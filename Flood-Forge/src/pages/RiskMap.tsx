import { useEffect, useState } from 'react';
import { X, Clock, AlertTriangle } from 'lucide-react';
import { api } from '../lib/api';
import { Zone, Prediction } from '../lib/supabase';
import DashboardLayout from '../components/DashboardLayout';

export default function RiskMap() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [zonesData, predictionsData] = await Promise.all([
        api.getZones(),
        api.getLatestPredictions(50),
      ]);
      setZones(zonesData);
      setPredictions(predictionsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  function getRiskColor(severity: string): string {
    switch (severity) {
      case 'HIGH':
        return '#EF4444';
      case 'MODERATE':
        return '#EAB308';
      case 'LOW':
        return '#22C55E';
      default:
        return '#3B82F6';
    }
  }

  function handleZoneClick(zone: Zone) {
    setSelectedZone(zone);
    const prediction = predictions.find((p) => p.zone_id === zone.id);
    setSelectedPrediction(prediction || null);
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Risk Map</h1>
          <p style={{ color: 'rgba(230, 241, 255, 0.7)' }}>Interactive flood risk visualization by zone</p>
        </div>

        <div className="relative h-[calc(100vh-250px)] bg-card-dark rounded-xl border border-primary/20 overflow-hidden flex items-center justify-center">
          <div style={{ background: '#0B1220' }} className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">Interactive Map</p>
              <p style={{ color: 'rgba(230, 241, 255, 0.6)' }}>Zone risk visualization map loads here</p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {zones.slice(0, 4).map((zone) => {
                  const prediction = predictions.find((p) => p.zone_id === zone.id);
                  const severity = prediction?.severity || 'LOW';
                  return (
                    <button
                      key={zone.id}
                      onClick={() => handleZoneClick(zone)}
                      className="p-3 bg-card-darker rounded border border-primary/20 hover:border-primary/50 text-left transition-all"
                    >
                      <div className="font-semibold text-sm">{zone.name}</div>
                      <div className="text-xs" style={{ color: 'rgba(230, 241, 255, 0.5)' }}>Risk: {severity}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {selectedZone && (
            <div className="absolute right-0 top-0 bottom-0 w-96 bg-card-darker border-l border-primary/20 overflow-y-auto z-[1000]">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Zone Details</h2>
                  <button
                    onClick={() => setSelectedZone(null)}
                    className="hover:text-primary"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{selectedZone.name}</h3>
                    <p style={{ color: 'rgba(230, 241, 255, 0.6)' }}>{selectedZone.city}</p>
                    <p className="text-sm" style={{ color: 'rgba(230, 241, 255, 0.5)' }}>
                      Population: {selectedZone.population.toLocaleString()}
                    </p>
                  </div>

                  {selectedPrediction ? (
                    <>
                      <div className="bg-card-dark p-4 rounded-lg border border-primary/20">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm" style={{ color: 'rgba(230, 241, 255, 0.7)' }}>Risk Level</span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              selectedPrediction.severity === 'HIGH'
                                ? 'bg-red-500/20 text-red-400'
                                : selectedPrediction.severity === 'MODERATE'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-green-500/20 text-green-400'
                            }`}
                          >
                            {selectedPrediction.severity}
                          </span>
                        </div>
                        <div className="text-3xl font-bold text-primary">
                          {(selectedPrediction.risk_probability * 100).toFixed(0)}%
                        </div>
                        <p className="text-sm" style={{ color: 'rgba(230, 241, 255, 0.6)' }}>Risk Probability</p>
                      </div>

                      <div className="bg-card-dark p-4 rounded-lg border border-primary/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-secondary" />
                          <span className="font-semibold">Time to Impact</span>
                        </div>
                        <div className="text-2xl font-bold">
                          {selectedPrediction.time_to_impact_hours} hours
                        </div>
                      </div>

                      <div className="bg-card-dark p-4 rounded-lg border border-primary/20">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="w-5 h-5 text-yellow-500" />
                          <span className="font-semibold">Top Risk Factors</span>
                        </div>
                        <ul className="space-y-2">
                          {selectedPrediction.top_factors.map((factor, index) => (
                            <li key={index} className="text-sm flex items-start gap-2" style={{ color: 'rgba(230, 241, 255, 0.7)' }}>
                              <span className="text-primary mt-1">•</span>
                              <span>{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <div className="bg-card-dark p-4 rounded-lg border border-primary/20 text-center">
                      <p style={{ color: 'rgba(230, 241, 255, 0.6)' }}>No recent predictions available for this zone</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card-dark p-4 rounded-lg border border-green-500/30 flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <div>
              <div className="font-semibold">Low Risk</div>
              <div className="text-sm" style={{ color: 'rgba(230, 241, 255, 0.6)' }}>Risk &lt; 30%</div>
            </div>
          </div>
          <div className="bg-card-dark p-4 rounded-lg border border-yellow-500/30 flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <div>
              <div className="font-semibold">Moderate Risk</div>
              <div className="text-sm" style={{ color: 'rgba(230, 241, 255, 0.6)' }}>Risk 30-70%</div>
            </div>
          </div>
          <div className="bg-card-dark p-4 rounded-lg border border-red-500/30 flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <div>
              <div className="font-semibold">High Risk</div>
              <div className="text-sm" style={{ color: 'rgba(230, 241, 255, 0.6)' }}>Risk &gt; 70%</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
