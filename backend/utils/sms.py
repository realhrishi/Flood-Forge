"""
utils/sms.py
Sends SMS via Twilio (free trial — $15.50 credit, no expiry, no card needed).

Setup (5 mins):
  1. Sign up at https://www.twilio.com/try-twilio
  2. Verify your phone number (free trial can only send to verified numbers)
  3. Dashboard → Get a free phone number (your TWILIO_FROM_NUMBER)
  4. Account Info → copy Account SID and Auth Token
  5. Add to .env:
       TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
       TWILIO_AUTH_TOKEN=your_auth_token
       TWILIO_FROM_NUMBER=+1xxxxxxxxxx

NOTE on free trial:
  - You can only SMS to numbers you have verified in the Twilio console
  - To verify: twilio.com/console → Verified Caller IDs → Add number
  - Once you upgrade (paid), this restriction is removed
"""

import httpx
import logging
import os
from base64 import b64encode

logger = logging.getLogger(__name__)

TWILIO_ACCOUNT_SID  = os.environ.get("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN   = os.environ.get("TWILIO_AUTH_TOKEN", "")
TWILIO_FROM_NUMBER  = os.environ.get("TWILIO_FROM_NUMBER", "")   # e.g. +1xxxxxxxxxx

RISK_EMOJI = {
    "Low":      "GREEN",
    "Medium":   "YELLOW",
    "High":     "ORANGE",
    "Critical": "RED",
}


def _format_phone(phone: str) -> str:
    """
    Ensure the number has a + prefix and country code.
    If it's a 10-digit Indian number, prepend +91.
    """
    phone = phone.strip().replace(" ", "").replace("-", "")
    if not phone.startswith("+"):
        # Strip leading 0 or 91 if present
        if phone.startswith("91") and len(phone) == 12:
            phone = phone[2:]
        if phone.startswith("0"):
            phone = phone[1:]
        phone = f"+91{phone}"
    return phone


async def _send(to_phone: str, message: str) -> bool:
    """Core Twilio REST send. Returns True on success."""
    if not all([TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER]):
        logger.error("Twilio credentials not configured — SMS not sent.")
        return False

    formatted = _format_phone(to_phone)
    url       = f"https://api.twilio.com/2010-04-01/Accounts/{TWILIO_ACCOUNT_SID}/Messages.json"
    token     = b64encode(f"{TWILIO_ACCOUNT_SID}:{TWILIO_AUTH_TOKEN}".encode()).decode()

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                url,
                headers={"Authorization": f"Basic {token}"},
                data={
                    "From": TWILIO_FROM_NUMBER,
                    "To":   formatted,
                    "Body": message,
                },
            )
        body = resp.json()
        if resp.status_code in (200, 201):
            logger.info(f"SMS sent to {formatted} | SID: {body.get('sid')}")
            return True
        else:
            logger.error(f"Twilio error {resp.status_code}: {body.get('message')}")
            return False
    except Exception as e:
        logger.error(f"SMS send failed: {e}")
        return False


# ── Public helpers ─────────────────────────────────────────────────────────────

async def send_login_sms(phone: str, name: str) -> bool:
    msg = (
        f"Hi {name}, a login was detected on your FloodForge account. "
        f"If this wasn't you, change your password immediately. "
        f"- FloodForge"
    )
    return await _send(phone, msg)


async def send_signup_sms(phone: str, name: str) -> bool:
    msg = (
        f"Welcome to FloodForge, {name}! "
        f"Your account is ready. You will receive real-time flood alerts for India. "
        f"- FloodForge Team"
    )
    return await _send(phone, msg)


async def send_flood_alert_sms(
    phone: str,
    name: str,
    location: str,
    risk_level: str,
    probability: float,
    impact_window: str,
) -> bool:
    pct = round(probability * 100, 1)
    msg = (
        f"FLOODFORGE ALERT [{risk_level.upper()}]\n"
        f"Location: {location}\n"
        f"Flood probability: {pct}%\n"
        f"Expected window: {impact_window}\n"
        f"Please take precautions immediately.\n"
        f"- FloodForge"
    )
    return await _send(phone, msg)


async def send_alert_status_sms(
    phone: str,
    name: str,
    location: str,
    old_level: str,
    new_level: str,
) -> bool:
    msg = (
        f"FLOODFORGE RISK UPDATE\n"
        f"Location: {location}\n"
        f"Risk changed: {old_level} -> {new_level}\n"
        f"Stay alert and follow local authority guidance.\n"
        f"- FloodForge"
    )
    return await _send(phone, msg)