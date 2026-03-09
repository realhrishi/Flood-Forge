from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Alert(BaseModel):
    id: Optional[str] = None
    user_id: Optional[str] = None
    location: str
    state: Optional[str] = None
    risk_level: str
    probability: float
    impact_window: str
    rainfall: Optional[float] = None
    timestamp: Optional[datetime] = None
    is_read: bool = False

class AlertCreateRequest(BaseModel):
    location: str
    state: Optional[str] = None
