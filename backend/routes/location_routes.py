from fastapi import APIRouter, Query, Request
from models.prediction_model import LocationRiskResponse
from services.location_service import search_locations, get_india_risk_overview

router = APIRouter()

@router.get("/search")
async def search(q: str = Query(..., min_length=2), request: Request = None):
    return search_locations(q, request.app.state.flood_model if request else None)

@router.get("/india-overview")
async def india_overview(request: Request):
    return get_india_risk_overview(request.app.state.flood_model)
