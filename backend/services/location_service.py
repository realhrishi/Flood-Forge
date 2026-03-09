# Comprehensive India city database for demo predictions
INDIA_CITIES = {
    "Patna": {"state": "Bihar", "lat": 25.5941, "lng": 85.1376, "rainfall": 124.0, "river_level": 5.2, "soil_moisture": 0.82},
    "Mumbai": {"state": "Maharashtra", "lat": 19.0760, "lng": 72.8777, "rainfall": 156.0, "river_level": 3.8, "soil_moisture": 0.75},
    "Delhi": {"state": "Delhi", "lat": 28.7041, "lng": 77.1025, "rainfall": 45.0, "river_level": 2.1, "soil_moisture": 0.48},
    "Kolkata": {"state": "West Bengal", "lat": 22.5726, "lng": 88.3639, "rainfall": 98.0, "river_level": 4.5, "soil_moisture": 0.78},
    "Chennai": {"state": "Tamil Nadu", "lat": 13.0827, "lng": 80.2707, "rainfall": 62.0, "river_level": 2.9, "soil_moisture": 0.55},
    "Varanasi": {"state": "Uttar Pradesh", "lat": 25.3176, "lng": 82.9739, "rainfall": 88.0, "river_level": 4.8, "soil_moisture": 0.72},
    "Guwahati": {"state": "Assam", "lat": 26.1445, "lng": 91.7362, "rainfall": 178.0, "river_level": 6.1, "soil_moisture": 0.91},
    "Bhubaneswar": {"state": "Odisha", "lat": 20.2961, "lng": 85.8245, "rainfall": 112.0, "river_level": 4.2, "soil_moisture": 0.77},
    "Hyderabad": {"state": "Telangana", "lat": 17.3850, "lng": 78.4867, "rainfall": 38.0, "river_level": 1.8, "soil_moisture": 0.42},
    "Ahmedabad": {"state": "Gujarat", "lat": 23.0225, "lng": 72.5714, "rainfall": 52.0, "river_level": 2.2, "soil_moisture": 0.51},
    "Lucknow": {"state": "Uttar Pradesh", "lat": 26.8467, "lng": 80.9462, "rainfall": 76.0, "river_level": 3.5, "soil_moisture": 0.65},
    "Srinagar": {"state": "J&K", "lat": 34.0837, "lng": 74.7973, "rainfall": 85.0, "river_level": 4.9, "soil_moisture": 0.80},
    "Agartala": {"state": "Tripura", "lat": 23.8315, "lng": 91.2868, "rainfall": 145.0, "river_level": 5.5, "soil_moisture": 0.88},
    "Puri": {"state": "Odisha", "lat": 19.8134, "lng": 85.8312, "rainfall": 135.0, "river_level": 4.7, "soil_moisture": 0.81},
    "Coimbatore": {"state": "Tamil Nadu", "lat": 11.0168, "lng": 76.9558, "rainfall": 42.0, "river_level": 1.9, "soil_moisture": 0.44},
    "Jaipur": {"state": "Rajasthan", "lat": 26.9124, "lng": 75.7873, "rainfall": 22.0, "river_level": 0.9, "soil_moisture": 0.28},
    "Bengaluru": {"state": "Karnataka", "lat": 12.9716, "lng": 77.5946, "rainfall": 55.0, "river_level": 2.1, "soil_moisture": 0.52},
    "Pune": {"state": "Maharashtra", "lat": 18.5204, "lng": 73.8567, "rainfall": 71.0, "river_level": 3.0, "soil_moisture": 0.60},
    "Nagpur": {"state": "Maharashtra", "lat": 21.1458, "lng": 79.0882, "rainfall": 68.0, "river_level": 2.8, "soil_moisture": 0.58},
    "Indore": {"state": "Madhya Pradesh", "lat": 22.7196, "lng": 75.8577, "rainfall": 49.0, "river_level": 2.0, "soil_moisture": 0.47},
}

def search_locations(query: str, model=None) -> list[dict]:
    query_lower = query.lower()
    results = []
    for city, data in INDIA_CITIES.items():
        if query_lower in city.lower() or query_lower in data.get("state", "").lower():
            from services.prediction_service import get_location_risk
            risk_data = get_location_risk(model, city)
            results.append({
                "city": city,
                "state": data["state"],
                "lat": data["lat"],
                "lng": data["lng"],
                "risk_level": risk_data.risk_level,
                "risk_percentage": risk_data.risk_percentage,
                "impact_window": risk_data.impact_window,
            })
    return results[:10]

def get_india_risk_overview(model) -> list[dict]:
    from services.prediction_service import get_location_risk
    overview = []
    for city in INDIA_CITIES:
        risk = get_location_risk(model, city)
        overview.append({
            "city": city,
            "state": INDIA_CITIES[city]["state"],
            "lat": INDIA_CITIES[city]["lat"],
            "lng": INDIA_CITIES[city]["lng"],
            "risk_level": risk.risk_level,
            "risk_percentage": risk.risk_percentage,
            "impact_window": risk.impact_window,
        })
    return overview
