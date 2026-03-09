from fastapi import APIRouter, Depends, Query
from models.alert_model import Alert, AlertCreateRequest
from services.alert_service import get_user_alerts, get_all_alerts, create_alert, mark_alert_read
from utils.security import get_current_user
from typing import Optional

router = APIRouter()

@router.get("/", response_model=list[Alert])
async def list_alerts(
    state: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
    limit: int = Query(default=20, le=100),
    current_user: dict = Depends(get_current_user)
):
    return get_user_alerts(current_user["sub"], state=state, risk_level=risk_level, limit=limit)

@router.get("/all", response_model=list[Alert])
async def list_all_alerts(
    state: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
    limit: int = Query(default=50, le=200),
):
    return get_all_alerts(state=state, risk_level=risk_level, limit=limit)

@router.post("/subscribe", response_model=Alert)
async def subscribe_alert(
    data: AlertCreateRequest,
    current_user: dict = Depends(get_current_user)
):
    return await create_alert(current_user["sub"], data)   # ← await added (create_alert is now async)

@router.patch("/{alert_id}/read")
async def read_alert(alert_id: str, current_user: dict = Depends(get_current_user)):
    mark_alert_read(alert_id, current_user["sub"])
    return {"status": "ok"}