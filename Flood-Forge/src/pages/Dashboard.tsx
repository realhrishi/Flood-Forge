import { useEffect, useState } from 'react';
import { AlertTriangle, TrendingUp, MapPin, Clock } from 'lucide-react';
import { api } from '../lib/api';
import { Zone, Alert, Prediction } from '../lib/supabase';
import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [zonesData, alertsData, predictionsData] = await Promise.all([
        api.getZones(),
        api.getAlerts('TRIGGERED'),
        api.getLatestPredictions(10),
      ]);
      setZones(zonesData);
      setAlerts(alertsData);
      setPredictions(predictionsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  const highRiskZones = predictions.filter((p) => p.severity === 'HIGH').length;
  const moderateRiskZones = predictions.filter((p) => p.severity === 'MODERATE').length;
  const activeAlerts = alerts.length;

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
          <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
          <p style={{ color: 'rgba(230, 241, 255, 0.7)' }}>Real-time flood risk monitoring and management</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card-dark p-6 rounded-xl border border-red-500/30 hover:shadow-blue-glow transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="w-10 h-10 text-red-500" />
              <span className="text-3xl font-bold">{highRiskZones}</span>
            </div>
            <h3 className="text-sm font-medium" style={{ color: 'rgba(230, 241, 255, 0.7)' }}>High Risk Zones</h3>
            <p className="text-xs" style={{ color: 'rgba(230, 241, 255, 0.5)' }}>Immediate attention required</p>
          </div>

          <div className="bg-card-dark p-6 rounded-xl border border-yellow-500/30 hover:shadow-blue-glow transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10 text-yellow-500" />
              <span className="text-3xl font-bold">{moderateRiskZones}</span>
            </div>
            <h3 className="text-sm font-medium" style={{ color: 'rgba(230, 241, 255, 0.7)' }}>Moderate Risk Zones</h3>
            <p className="text-xs" style={{ color: 'rgba(230, 241, 255, 0.5)' }}>Monitoring required</p>
          </div>

          <div className="bg-card-dark p-6 rounded-xl border border-primary/30 hover:shadow-blue-glow transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <MapPin className="w-10 h-10 text-primary" />
              <span className="text-3xl font-bold">{zones.length}</span>
            </div>
            <h3 className="text-sm font-medium" style={{ color: 'rgba(230, 241, 255, 0.7)' }}>Monitored Zones</h3>
            <p className="text-xs" style={{ color: 'rgba(230, 241, 255, 0.5)' }}>Active monitoring areas</p>
          </div>

          <div className="bg-card-dark p-6 rounded-xl border border-secondary/30 hover:shadow-cyan-glow transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-10 h-10 text-secondary" />
              <span className="text-3xl font-bold">{activeAlerts}</span>
            </div>
            <h3 className="text-sm font-medium" style={{ color: 'rgba(230, 241, 255, 0.7)' }}>Active Alerts</h3>
            <p className="text-xs" style={{ color: 'rgba(230, 241, 255, 0.5)' }}>Unresolved alerts</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card-dark p-6 rounded-xl border border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent Predictions</h2>
              <Link
                to="/dashboard/map"
                className="text-primary hover:text-secondary text-sm transition-colors"
              >
                View Map
              </Link>
            </div>
            <div className="space-y-3">
              {predictions.slice(0, 5).map((prediction) => {
                const zone = zones.find((z) => z.id === prediction.zone_id);
                return (
                  <div
                    key={prediction.id}
                    className="p-4 bg-card-darker rounded-lg border border-primary/10 hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{zone?.name || 'Unknown Zone'}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          prediction.severity === 'HIGH'
                            ? 'bg-red-500/20 text-red-400'
                            : prediction.severity === 'MODERATE'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}
                      >
                        {prediction.severity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm" style={{ color: 'rgba(230, 241, 255, 0.6)' }}>
                      <span>Risk: {(prediction.risk_probability * 100).toFixed(0)}%</span>
                      <span>Impact in {prediction.time_to_impact_hours}h</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-card-dark p-6 rounded-xl border border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Active Alerts</h2>
              <Link
                to="/dashboard/alerts"
                className="text-primary hover:text-secondary text-sm transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => {
                const zone = zones.find((z) => z.id === alert.zone_id);
                return (
                  <div
                    key={alert.id}
                    className="p-4 bg-card-darker rounded-lg border border-primary/10 hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle
                        className={`w-5 h-5 ${
                          alert.severity === 'HIGH'
                            ? 'text-red-500'
                            : alert.severity === 'MODERATE'
                            ? 'text-yellow-500'
                            : 'text-green-500'
                        }`}
                      />
                      <span className="font-medium">{zone?.name || 'Unknown Zone'}</span>
                    </div>
                    <p className="text-sm" style={{ color: 'rgba(230, 241, 255, 0.7)' }} >{alert.message}</p>
                    <span className="text-xs" style={{ color: 'rgba(230, 241, 255, 0.5)' }}>
                      {new Date(alert.triggered_at).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
