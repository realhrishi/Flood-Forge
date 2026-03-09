from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from contextlib import asynccontextmanager
import logging

from routes.auth_routes import router as auth_router
from routes.user_routes import router as user_router
from routes.predict_routes import router as predict_router
from routes.alert_routes import router as alert_router
from routes.location_routes import router as location_router
from ml_model.flood_model_loader import load_model          # ← returns dict now
from utils.security import settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting FloodForge API server...")

    # Load ensemble bundle — dict with xgb, rf, state_enc, district_enc
    bundle = load_model()
    app.state.flood_model = bundle

    loaded = [k for k, v in bundle.items() if v is not None]
    logger.info(f"Model bundle ready. Components loaded: {loaded}")
    yield
    logger.info("Shutting down FloodForge API server.")

app = FastAPI(
    title="FloodForge API",
    description="AI-powered flood prediction and alert system for India",
    version="2.0.0",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router,     prefix="/auth",     tags=["Authentication"])
app.include_router(user_router,     prefix="/user",     tags=["User"])
app.include_router(predict_router,  prefix="/predict",  tags=["Prediction"])
app.include_router(alert_router,    prefix="/alerts",   tags=["Alerts"])
app.include_router(location_router, prefix="/location", tags=["Location"])

@app.get("/")
async def root():
    return {
        "status":  "ok",
        "service": "FloodForge API",
        "version": "2.0.0",
        "model":   "XGBoost + Random Forest Ensemble"
    }

@app.get("/health")
async def health():
    bundle  = getattr(app.state, "flood_model", {})
    loaded  = [k for k, v in bundle.items() if v is not None]
    return {
        "status":         "healthy",
        "models_loaded":  loaded,
        "ensemble_ready": "xgb" in loaded and "rf" in loaded,
    }