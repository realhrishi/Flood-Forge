"""
FloodForge — Pydantic Models
PredictionRequest / PredictionResponse / LocationRiskResponse
Backward-compatible: all new fields are Optional with defaults.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class PredictionRequest(BaseModel):
    # ── Core fields (unchanged from v1) ──────────────────────────
    location: str
    rainfall: float = Field(..., ge=0, le=1000,
                            description="Rainfall in mm/day")
    river_level: float = Field(..., ge=0, le=20,
                               description="River level in meters")
    soil_moisture: float = Field(..., ge=0, le=1,
                                 description="Soil moisture 0-1")
    temperature: Optional[float] = Field(default=28.0, ge=-10, le=60)
    humidity: Optional[float]    = Field(default=70.0, ge=0, le=100)
    previous_flood: Optional[int] = Field(default=0, ge=0, le=1)
    prediction_window: Optional[int] = Field(
        default=24, description="Hours: 24, 48, or 72"
    )

    # ── New optional fields (v2) ──────────────────────────────────
    # If not provided, prediction_service will derive them from location lookup
    state:    Optional[str] = Field(default=None,
                                    description="Indian state name")
    district: Optional[str] = Field(default=None,
                                    description="District name")
    month:    Optional[int] = Field(default=None, ge=1, le=12,
                                    description="Month (1-12); auto from current date if omitted")


class PredictionResponse(BaseModel):
    # ── v1 fields (unchanged) ────────────────────────────────────
    location:         str
    risk_probability: float
    risk_level:       str
    risk_percentage:  int
    prediction_window: int
    timestamp:        datetime
    explanation:      list[dict]
    input_summary:    dict

    # ── v2 new fields ─────────────────────────────────────────────
    flood_risk_class:   Optional[int]   = None   # 0 / 1 / 2
    probability_low:    Optional[float] = None
    probability_medium: Optional[float] = None
    probability_high:   Optional[float] = None
    confidence:         Optional[float] = None
    prediction_source:  Optional[str]   = None   # ensemble / xgboost_only / rule_based_fallback


class LocationRiskResponse(BaseModel):
    # ── v1 fields (unchanged) ────────────────────────────────────
    city:             str
    state:            Optional[str]
    risk_probability: float
    risk_level:       str
    risk_percentage:  int
    rainfall:         float
    river_level:      float
    impact_window:    str

    # ── v2 new fields ─────────────────────────────────────────────
    flood_risk_class:   Optional[int]   = None
    probability_low:    Optional[float] = None
    probability_medium: Optional[float] = None
    probability_high:   Optional[float] = None
    confidence:         Optional[float] = None