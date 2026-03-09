from fastapi import APIRouter, Depends, Request
from models.prediction_model import PredictionRequest, PredictionResponse, LocationRiskResponse
from services.prediction_service import run_prediction, get_location_risk
from utils.security import get_current_user
from database.supabase_client import get_supabase_admin
from datetime import datetime
import uuid

router = APIRouter()

@router.post("/", response_model=PredictionResponse)
async def predict_flood_risk(
    request: Request,
    data: PredictionRequest,
    current_user: dict = Depends(get_current_user)
):
    result = run_prediction(request.app.state.flood_model, data)

    # Store prediction in DB
    db = get_supabase_admin()
    db.table("predictions").insert({
        "id": str(uuid.uuid4()),
        "user_id": current_user["sub"],
        "location": data.location,
        "rainfall": data.rainfall,
        "river_level": data.river_level,
        "soil_moisture": data.soil_moisture,
        "risk_probability": result.risk_probability,
        "risk_level": result.risk_level,
        "prediction_window": data.prediction_window,
        "prediction_time": datetime.utcnow().isoformat(),
    }).execute()

    return result

@router.get("/location", response_model=LocationRiskResponse)
async def get_location_risk_public(city: str, request: Request):
    return get_location_risk(request.app.state.flood_model, city)
