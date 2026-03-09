import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

const FloodHeatmap = ({ data }) => {

  const map = useMap();
  const heatLayerRef = useRef(null);

  useEffect(() => {

    if (!map) return;

    // create layer only once
    if (!heatLayerRef.current) {

      heatLayerRef.current = L.heatLayer([], {
        radius: 55,
        blur: 40,
        maxZoom: 7,
        gradient: {
          0.2: "#2ECC71",
          0.4: "#F1C40F",
          0.6: "#FF8C00",
          0.8: "#FF3B3B",
          1.0: "#8B0000"
        }
      });

      heatLayerRef.current.addTo(map);
    }

    if (data && data.length > 0) {

      const heatPoints = data.map(d => [
        d.lat,
        d.lng,
        (d.risk_percentage || 10) / 100
      ]);

      heatLayerRef.current.setLatLngs(heatPoints);
    }

  }, [data, map]);

  return null;
};

export default FloodHeatmap;