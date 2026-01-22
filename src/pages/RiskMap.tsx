import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import { zones, Zone } from '@/data/zones';
import { X, MapPin, Users, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import 'leaflet/dist/leaflet.css';

const RiskMap = () => {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return '#ef4444';
      case 'moderate': return '#f59e0b';
      default: return '#22c55e';
    }
  };

  // Use callback with deferred state update to prevent conflict with Leaflet event processing
  const handleZoneClick = useCallback((zone: Zone) => {
    // Defer state update to next tick to let Leaflet finish event processing
    setTimeout(() => setSelectedZone(zone), 0);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedZone(null);
  }, []);

  return (
    <div className="h-[calc(100vh-8rem)] relative">
      {/* Legend */}
      <div className="absolute top-4 right-4 z-[1000] glass-card p-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">Risk Levels</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-success" />
            <span className="text-xs text-muted-foreground">Low Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-warning" />
            <span className="text-xs text-muted-foreground">Moderate Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-destructive" />
            <span className="text-xs text-muted-foreground">High Risk</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={[28.6139, 77.2090]}
        zoom={12}
        className="h-full w-full rounded-xl overflow-hidden"
        style={{ background: '#0a0a0a' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {zones.map((zone) => (
          <CircleMarker
            key={zone.id}
            center={zone.center}
            radius={zone.riskLevel === 'high' ? 30 : zone.riskLevel === 'moderate' ? 25 : 20}
            fillColor={getRiskColor(zone.riskLevel)}
            fillOpacity={0.4}
            color={getRiskColor(zone.riskLevel)}
            weight={2}
            eventHandlers={{
              click: () => handleZoneClick(zone),
            }}
          />
        ))}
      </MapContainer>

      {/* Zone Detail Drawer */}
      {selectedZone && (
        <div
          key={selectedZone.id}
          className="absolute top-0 right-0 h-full w-96 glass-card border-l border-border z-[1001] overflow-y-auto animate-slide-in"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">{selectedZone.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedZone.id}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Risk Status */}
            <div className={cn(
              "p-4 rounded-xl mb-6",
              selectedZone.riskLevel === 'high' ? 'bg-destructive/20 border border-destructive/30' :
              selectedZone.riskLevel === 'moderate' ? 'bg-warning/20 border border-warning/30' :
              'bg-success/20 border border-success/30'
            )}>
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className={cn(
                  "w-6 h-6",
                  selectedZone.riskLevel === 'high' ? 'text-destructive' :
                  selectedZone.riskLevel === 'moderate' ? 'text-warning' : 'text-success'
                )} />
                <span className="text-lg font-semibold text-foreground">
                  {selectedZone.severity} RISK
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Probability</p>
                  <p className="text-2xl font-bold text-foreground">
                    {Math.round(selectedZone.riskProbability * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Time to Impact</p>
                  <p className="text-2xl font-bold text-foreground">
                    {selectedZone.timeToImpact}h
                  </p>
                </div>
              </div>
            </div>

            {/* Zone Info */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm text-foreground">
                    {selectedZone.center[0].toFixed(4)}, {selectedZone.center[1].toFixed(4)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Population at Risk</p>
                  <p className="text-sm text-foreground">
                    {selectedZone.population.toLocaleString()} residents
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p className="text-sm text-foreground">
                    {new Date(selectedZone.lastUpdated).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">Top Risk Factors</h3>
              <div className="space-y-2">
                {selectedZone.topFactors.map((factor, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted"
                  >
                    <span className="w-6 h-6 rounded-full bg-destructive/20 text-destructive text-xs flex items-center justify-center font-medium">
                      {i + 1}
                    </span>
                    <span className="text-sm text-foreground">{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button variant="hero" className="w-full">
                Generate Response Plan
              </Button>
              <Button variant="outline" className="w-full">
                View Historical Data
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskMap;
