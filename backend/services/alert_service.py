from database.supabase_client import get_supabase, get_supabase_admin
from models.alert_model import Alert, AlertCreateRequest
from services.location_service import INDIA_CITIES
from services.prediction_service import get_location_risk
from ml_model.flood_model_loader import model_bundle
from utils.sms import send_flood_alert_sms, send_alert_status_sms
import uuid
import logging
from datetime import datetime, timezone, timedelta
import random

logger = logging.getLogger(__name__)

# Only fire a fresh flood-alert SMS for these levels (not Low/Medium)
SMS_WORTHY_LEVELS = {"High", "Critical"}


def _get_user_contact(user_id: str) -> tuple[str | None, str]:
    """
    Returns (phone, name) for a user. Phone is None if not set.
    Uses admin client so RLS doesn't block the lookup.
    """
    try:
        db     = get_supabase_admin()
        result = db.table("users").select("phone, name").eq("id", user_id).execute()
        if result.data:
            row = result.data[0]
            return row.get("phone"), row.get("name") or "there"
    except Exception as e:
        logger.warning(f"Could not fetch contact for user {user_id}: {e}")
    return None, "there"


def get_user_alerts(user_id: str, state=None, risk_level=None, limit=20) -> list[Alert]:
    db    = get_supabase()
    query = db.table("alerts").select("*").eq("user_id", user_id)
    if state:
        query = query.eq("state", state)
    if risk_level:
        query = query.eq("risk_level", risk_level)
    result = query.order("timestamp", desc=True).limit(limit).execute()
    return [Alert(**a) for a in (result.data or [])]


def get_all_alerts(state=None, risk_level=None, limit=50) -> list[Alert]:
    alerts = []
    for city, data in list(INDIA_CITIES.items())[:limit]:
        risk = get_location_risk(model_bundle, city)
        if risk_level and risk.risk_level != risk_level:
            continue
        if state and data.get("state") != state:
            continue
        alerts.append(Alert(
            id=str(uuid.uuid4()),
            location=city,
            state=data.get("state"),
            risk_level=risk.risk_level,
            probability=risk.risk_probability,
            impact_window=risk.impact_window,
            rainfall=data.get("rainfall"),
            timestamp=datetime.now(timezone.utc) - timedelta(minutes=random.randint(0, 120)),
        ))
    alerts.sort(key=lambda a: a.probability, reverse=True)
    return alerts


async def create_alert(user_id: str, data: AlertCreateRequest) -> Alert:
    db   = get_supabase()
    risk = get_location_risk(None, data.location)

    # Check if this user already has an alert for this location
    # so we can detect a risk level change
    prev = db.table("alerts") \
             .select("risk_level") \
             .eq("user_id", user_id) \
             .eq("location", data.location) \
             .order("timestamp", desc=True) \
             .limit(1) \
             .execute()
    prev_level = prev.data[0]["risk_level"] if prev.data else None

    alert_id   = str(uuid.uuid4())
    alert_data = {
        "id":            alert_id,
        "user_id":       user_id,
        "location":      data.location,
        "state":         data.state,
        "risk_level":    risk.risk_level,
        "probability":   risk.risk_probability,
        "impact_window": risk.impact_window,
        "timestamp":     datetime.now(timezone.utc).isoformat(),
        "is_read":       False,
    }
    db.table("alerts").insert(alert_data).execute()

    # ── SMS ───────────────────────────────────────────────────────────────────
    phone, name = _get_user_contact(user_id)

    if phone:
        if prev_level and prev_level != risk.risk_level:
            # Risk level escalated or changed — notify regardless of level
            logger.info(f"Risk change at {data.location}: {prev_level} → {risk.risk_level}")
            await send_alert_status_sms(
                phone     = phone,
                name      = name,
                location  = data.location,
                old_level = prev_level,
                new_level = risk.risk_level,
            )
        elif risk.risk_level in SMS_WORTHY_LEVELS:
            # New High / Critical alert with no previous record
            await send_flood_alert_sms(
                phone         = phone,
                name          = name,
                location      = data.location,
                risk_level    = risk.risk_level,
                probability   = risk.risk_probability,
                impact_window = risk.impact_window,
            )

    return Alert(**alert_data)


def mark_alert_read(alert_id: str, user_id: str):
    db = get_supabase()
    db.table("alerts").update({"is_read": True}) \
      .eq("id", alert_id).eq("user_id", user_id).execute()