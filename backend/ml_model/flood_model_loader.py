"""
FloodForge — ML Model Loader
Loads XGBoost + Random Forest ensemble + encoders from /ml_model/
"""

import os
import pickle
import joblib
import numpy as np
import logging

logger = logging.getLogger(__name__)

# ── Paths (all files must be in the same folder as this script) ──
_DIR = os.path.dirname(__file__)

XGB_PATH          = os.path.join(_DIR, "xgboost_flood_model.pkl")
RF_PATH           = os.path.join(_DIR, "rf_flood_model.pkl")
STATE_ENC_PATH    = os.path.join(_DIR, "state_encoder.pkl")
DISTRICT_ENC_PATH = os.path.join(_DIR, "district_encoder.pkl")

# ── Weights for soft-voting ensemble ──
XGB_WEIGHT = 0.3
RF_WEIGHT  = 0.7


def _load_pkl(path: str, name: str):
    """
    Load a model file safely.
    XGBoost was saved with pickle → use pickle.
    RF + encoders were saved with joblib on Kaggle → use joblib.
    Falls back between both automatically.
    """
    if not os.path.exists(path):
        logger.warning(f"{name} not found at {path}")
        return None
    # Try joblib first (Kaggle default), then pickle
    for loader_name, loader in [("joblib", joblib.load), ("pickle", None)]:
        try:
            if loader_name == "pickle":
                with open(path, "rb") as f:
                    obj = pickle.load(f)
            else:
                obj = loader(path)
            logger.info(f"{name} loaded via {loader_name} from {path}")
            return obj
        except Exception as e:
            logger.warning(f"{name} failed with {loader_name}: {e}. Trying next...")
    logger.warning(f"All loaders failed for {name}.")
    return None


def load_model() -> dict:
    """
    Load all model artifacts.
    Returns a dict with keys: xgb, rf, state_enc, district_enc
    Any missing model gracefully falls back to rule-based prediction.
    """
    bundle = {
        "xgb":          _load_pkl(XGB_PATH,          "XGBoost model"),
        "rf":           _load_pkl(RF_PATH,            "Random Forest model"),
        "state_enc":    _load_pkl(STATE_ENC_PATH,     "State encoder"),
        "district_enc": _load_pkl(DISTRICT_ENC_PATH,  "District encoder"),
    }

    loaded = [k for k, v in bundle.items() if v is not None]
    logger.info(f"Model bundle ready. Loaded: {loaded}")
    return bundle


def _encode(encoder, value: str) -> int:
    """Encode a string label safely; fall back to median index."""
    if encoder is None:
        return 0
    try:
        return int(encoder.transform([value])[0])
    except ValueError:
        return len(encoder.classes_) // 2


def _build_feature_vector(bundle: dict, inputs: dict) -> np.ndarray:
    """
    Build the 36-feature vector the trained models expect.

    inputs keys (all required):
        state, district, month,
        monthly_rainfall_mm, max_daily_rainfall_mm, avg_daily_rainfall_mm,
        rainy_days, rain_days_extreme, rain_days_heavy,
        rainfall_anomaly, rainfall_anomaly_pct, cumulative_3month_mm,
        avg_deviation_pct, monthly_normal_mm,
        temperature_celsius, humidity_pct, wind_speed_kmh,
        avg_drainage_density, avg_annual_precip, avg_urban_pct,
        avg_stream_order, avg_catchment_relief,
        corrected_pct_flooded_area, mean_flood_duration,
        flood_freq_per_year, vulnerability_score, population
    """
    m = inputs["month"]

    # Encodings
    sc = _encode(bundle.get("state_enc"),    inputs["state"])
    dc = _encode(bundle.get("district_enc"), inputs["district"])

    # Cyclical month
    m_sin = np.sin(2 * np.pi * m / 12)
    m_cos = np.cos(2 * np.pi * m / 12)
    is_mon  = int(m in [6, 7, 8, 9, 10])
    is_post = int(m in [10, 11])

    # Raw values
    rain     = inputs["monthly_rainfall_mm"]
    max_r    = inputs["max_daily_rainfall_mm"]
    avg_r    = inputs["avg_daily_rainfall_mm"]
    vuln     = inputs["vulnerability_score"]
    flood_a  = inputs["corrected_pct_flooded_area"]
    ext      = inputs["rain_days_extreme"]
    anom     = inputs["rainfall_anomaly_pct"]
    cum      = inputs["cumulative_3month_mm"]
    ff       = inputs["flood_freq_per_year"]

    # Interaction features
    rain_x_vuln   = rain * vuln
    rain_x_area   = rain * flood_a
    ext_x_vuln    = ext  * vuln
    anom_x_mon    = anom * is_mon
    cum_x_freq    = cum  * ff
    intensity     = min((max_r / avg_r) if avg_r > 0 else 0.0, 20.0)

    return np.array([[
        m_sin, m_cos, is_mon, is_post,
        rain, max_r, avg_r,
        inputs["rainy_days"], ext, inputs["rain_days_heavy"],
        inputs["rainfall_anomaly"], anom, cum,
        inputs["avg_deviation_pct"], inputs["monthly_normal_mm"],
        inputs["temperature_celsius"], inputs["humidity_pct"],
        inputs["wind_speed_kmh"],
        inputs["avg_drainage_density"], inputs["avg_annual_precip"],
        inputs["avg_urban_pct"], inputs["avg_stream_order"],
        inputs["avg_catchment_relief"],
        flood_a, inputs["mean_flood_duration"], ff, vuln,
        inputs["population"],
        sc, dc,
        rain_x_vuln, rain_x_area, ext_x_vuln,
        anom_x_mon, cum_x_freq, intensity,
    ]])


def _rule_based_fallback(inputs: dict) -> dict:
    """Rule-based prediction when models are unavailable."""
    rain  = inputs.get("monthly_rainfall_mm", 0) / 300.0
    vuln  = inputs.get("vulnerability_score", 0.3)
    anom  = max(inputs.get("rainfall_anomaly_pct", 0), 0) / 100.0
    score = min(rain * 0.5 + vuln * 0.3 + anom * 0.2, 1.0)
    score += np.random.uniform(-0.03, 0.03)
    score = max(0.0, min(1.0, score))

    if score >= 0.65:
        cls, label = 2, "High"
    elif score >= 0.35:
        cls, label = 1, "Medium"
    else:
        cls, label = 0, "Low"

    p_high   = score if cls == 2 else score * 0.4
    p_medium = score if cls == 1 else (1 - score) * 0.4
    p_low    = 1 - p_high - p_medium

    return {
        "flood_risk_class":   cls,
        "flood_risk_label":   label,
        "probability_low":    round(max(p_low, 0.0), 4),
        "probability_medium": round(max(p_medium, 0.0), 4),
        "probability_high":   round(max(p_high, 0.0), 4),
        "confidence":         round(score, 4),
        "source":             "rule_based_fallback",
    }


def predict_flood_risk(bundle: dict, inputs: dict) -> dict:
    """
    Main prediction function.

    Args:
        bundle: dict returned by load_model()
        inputs: dict with all 27 input fields

    Returns:
        dict with flood_risk_class, flood_risk_label,
             probability_low/medium/high, confidence, source
    """
    xgb = bundle.get("xgb")
    rf  = bundle.get("rf")

    # Both models unavailable → rule-based
    if xgb is None and rf is None:
        logger.warning("Both models unavailable. Using rule-based fallback.")
        return _rule_based_fallback(inputs)

    try:
        feat = _build_feature_vector(bundle, inputs)

        if xgb is not None and rf is not None:
            p_xgb = xgb.predict_proba(feat)[0]
            p_rf  = rf.predict_proba(feat)[0]
            proba = XGB_WEIGHT * p_xgb + RF_WEIGHT * p_rf
            source = "ensemble"
        elif xgb is not None:
            proba  = xgb.predict_proba(feat)[0]
            source = "xgboost_only"
        else:
            proba  = rf.predict_proba(feat)[0]
            source = "rf_only"

        # Asymmetric thresholds — lower bar for High (safety-critical)
        if proba[2] >= 0.30:
            pred = 2
        elif proba[1] >= 0.35:
            pred = 1
        else:
            pred = 0

        return {
            "flood_risk_class":   pred,
            "flood_risk_label":   ["Low", "Medium", "High"][pred],
            "probability_low":    round(float(proba[0]), 4),
            "probability_medium": round(float(proba[1]), 4),
            "probability_high":   round(float(proba[2]), 4),
            "confidence":         round(float(proba.max()), 4),
            "source":             source,
        }

    except Exception as e:
        logger.error(f"Ensemble inference failed: {e}. Using fallback.")
        return _rule_based_fallback(inputs)

# ───────────────────────────────────────────────────────────────
# GLOBAL MODEL BUNDLE (loaded once at server startup)
# ───────────────────────────────────────────────────────────────

try:
    model_bundle = load_model()
    logger.info("FloodForge model bundle initialized successfully.")
except Exception as e:
    logger.error(f"Failed to initialize model bundle: {e}")
    model_bundle = {
        "xgb": None,
        "rf": None,
        "state_enc": None,
        "district_enc": None
    }
