import React, { useState, useEffect } from "react";
import { predictAPI } from "../services/api";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import AlertCard from "../components/AlertCard";
import FloodHeatmap from "../components/FloodHeatmap";
import "leaflet/dist/leaflet.css";

const FloodMap = () => {

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  console.log("API KEY:", import.meta.env.VITE_OPENWEATHER_API_KEY);

  const [activeTab, setActiveTab] = useState("24h");
  const [radarLayer, setRadarLayer] = useState("precipitation_new");
  const [predictions, setPredictions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [searchCity, setSearchCity] = useState("");
  const [mapCenter, setMapCenter] = useState([22.5, 79]);
  const [mapZoom, setMapZoom] = useState(5);

  const cities = [
    { name: "Delhi", lat: 28.7041, lng: 77.1025 },
    { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
    { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
    { name: "Chennai", lat: 13.0827, lng: 80.2707 },
    { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
    { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
    { name: "Patna", lat: 25.5941, lng: 85.1376 },
    { name: "Lucknow", lat: 26.8467, lng: 80.9462 },
    { name: "Bhopal", lat: 23.2599, lng: 77.4126 },
    { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
    { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
    { name: "Surat", lat: 21.1702, lng: 72.8311 },
    { name: "Indore", lat: 22.7196, lng: 75.8577 },
    { name: "Nagpur", lat: 21.1458, lng: 79.0882 },
    { name: "Guwahati", lat: 26.1445, lng: 91.7362 }
  ];

  // 🔍 SEARCH FUNCTION (NEW)
  const handleSearch = () => {

    if (!searchCity) return;

    const city = predictions.find(c =>
      c.name.toLowerCase().includes(searchCity.toLowerCase())
    );

    if (!city) {
      alert("City not found in radar coverage");
      return;
    }

    setMapCenter([city.lat, city.lng]);
    setMapZoom(7);
  };

  useEffect(() => {

    const loadPredictions = async () => {

      try {

        const results = await Promise.all(
          cities.map(city => predictAPI.locationRisk(city.name))
        );

        const data = results.map((res, i) => ({
          lat: cities[i].lat,
          lng: cities[i].lng,
          name: cities[i].name,
          risk_level: res?.data?.risk_level || "Low",
          risk_percentage: res?.data?.risk_percentage || 0
        }));

        setPredictions(data);

      } catch (err) {

        console.error("Prediction fetch failed:", err);

        const fallback = cities.map(city => ({
          ...city,
          risk_level: "Low",
          risk_percentage: 0
        }));

        setPredictions(fallback);
      }
    };

    const loadAlerts = async () => {

      try {

        const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const res = await fetch(`${BASE}/alerts/all`);
        const data = await res.json();

        const sorted = data.sort(
          (a, b) => b.risk_percentage - a.risk_percentage
        );

        setAlerts(sorted);

      } catch (err) {

        console.error("Alert fetch failed:", err);

        setAlerts([]);
      }
    };

    loadPredictions();
    loadAlerts();

    const interval = setInterval(() => {
      loadPredictions();
      loadAlerts();
    }, 60000);

    return () => clearInterval(interval);

  }, []);

  const getRiskColor = (risk) => {

    if (!risk) return "#2ECC71";

    const r = risk.toLowerCase();

    if (r.includes("critical")) return "#8B0000";
    if (r.includes("high")) return "#FF3B3B";
    if (r.includes("medium")) return "#F1C40F";

    return "#2ECC71";
  };

  return (

    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col md:flex-row h-screen w-full relative overflow-hidden"
    >

      {/* Sidebar */}

      <div className="w-full md:w-[360px] h-1/2 md:h-full bg-bg-deep border-r border-glass-border flex flex-col z-20 shrink-0">

        <div className="p-6 border-b border-glass-border">

          <h2 className="font-orbitron font-bold text-accent-cyan text-2xl mb-4 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
            FLOOD RADAR
          </h2>

          <div className="relative mb-6">

            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Search city or district..."
              className="w-full bg-bg-surface border border-glass-border rounded-lg py-3 px-4 pl-10 text-sm text-text-primary"
            />

          </div>

          <div className="flex bg-bg-surface p-1 rounded-lg border border-glass-border">

            {["24h", "48h", "72h"].map(tab => (

              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-sm font-semibold rounded-md ${
                  activeTab === tab
                    ? "bg-accent-blue text-bg-void"
                    : "text-text-muted"
                }`}
              >
                {tab}
              </button>

            ))}

          </div>

        </div>

        {/* Legend */}

        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          <div>

            <h3 className="text-text-muted text-xs mb-3">
              RISK LEGEND
            </h3>

            <div className="space-y-2 text-sm">

              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                Low Risk
              </div>

              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                Medium Risk
              </div>

              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                High Risk
              </div>

            </div>

          </div>

          {/* ALERTS */}

          <div>

            <h3 className="text-text-muted text-xs mb-3">
              RECENT ALERTS
            </h3>

            <div className="space-y-3">

              {alerts.slice(0,5).map((alert, i) => {

                const city =
                  alert.city ||
                  alert.location ||
                  alert.name ||
                  "Unknown";

                const probability =
                  alert.risk_percentage ??
                  Math.round((alert.risk_probability || 0) * 100);

                return (
                  <AlertCard
                    key={i}
                    location={city}
                    risk={alert.risk_level || "Low"}
                    probability={probability}
                    window={alert.impact_window || "72+ hours"}
                    timestamp="Live"
                  />
                );

              })}

            </div>

          </div>

        </div>

      </div>

      {/* MAP */}

      <div className="flex-1 bg-bg-void relative">

        {/* Weather Layer Controls */}

        <div className="absolute top-4 right-4 z-[1000] bg-black/70 p-2 rounded-lg flex gap-2 text-xs text-white">

          {[
            { label: "Precip", value: "precipitation_new" },
            { label: "Clouds", value: "clouds_new" },
            { label: "Rain",   value: "rain_new" },
            { label: "Pressure", value: "pressure_new" },
            { label: "Temp",   value: "temp_new" },
          ].map(({ label, value }) => (
            <button
              key={value}
              className={`px-2 py-1 rounded transition-colors ${
                radarLayer === value
                  ? "bg-cyan-500 text-black font-bold"
                  : "hover:bg-cyan-500/30"
              }`}
              onClick={() => setRadarLayer(value)}
            >
              {label}
            </button>
          ))}

        </div>

        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: "100%", width: "100%" }}
        >

          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          <TileLayer
            key={radarLayer}
            url={`https://tile.openweathermap.org/map/${radarLayer}/{z}/{x}/{y}.png?appid=${API_KEY}`}
            opacity={0.35}
          />

          <FloodHeatmap data={predictions} />

          {predictions.map((city, i) => (

            <CircleMarker
              key={i}
              center={[city.lat, city.lng]}
              radius={5}
              pathOptions={{
                color: getRiskColor(city.risk_level),
                fillColor: getRiskColor(city.risk_level),
                fillOpacity: 0.9,
                weight: 2
              }}
            >

              <Popup>

                <div className="text-sm">

                  <b>{city.name}</b>
                  <br />
                  Risk: {city.risk_level}
                  <br />
                  Probability: {city.risk_percentage}%

                </div>

              </Popup>

            </CircleMarker>

          ))}

        </MapContainer>

      </div>

    </motion.div>

  );
};

export default FloodMap;