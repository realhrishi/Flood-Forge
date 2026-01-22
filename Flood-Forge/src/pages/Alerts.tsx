import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Bell } from 'lucide-react';
import { api } from '../lib/api';
import { Zone, Alert } from '../lib/supabase';
import DashboardLayout from '../components/DashboardLayout';

export default function Alerts() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'TRIGGERED' | 'RESOLVED'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [zonesData, alertsData] = await Promise.all([api.getZones(), api.getAlerts()]);
      setZones(zonesData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleResolveAlert(alertId: string) {
    try {
      await api.resolveAlert(alertId);
      setAlerts(alerts.map((a) => (a.id === alertId ? { ...a, status: 'RESOLVED' as const } : a)));
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  }

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'all') return true;
    return alert.status === filter;
  });

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Alerts</h1>
            <p style={{ color: 'rgba(230, 241, 255, 0.7)' }}>Monitor and manage flood alerts</p>
          </div>
          <button className="px-6 py-2 bg-ocean-gradient rounded-lg font-semibold hover:shadow-blue-glow transition-all duration-300">
            Simulate SMS/Email Alert
          </button>
        </div>

        <div className="flex gap-4">
          {['all', 'TRIGGERED', 'RESOLVED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === f
                  ? 'bg-primary text-white'
                  : 'bg-card-dark hover:bg-card-darker'
              }`}
            >
              {f === 'all' ? 'All Alerts' : f === 'TRIGGERED' ? 'Active' : 'Resolved'}
            </button>
          ))}
        </div>

        <div className="grid gap-4">
          {filteredAlerts.map((alert) => {
            const zone = zones.find((z) => z.id === alert.zone_id);
            return (
              <div
                key={alert.id}
                className={`bg-card-dark p-6 rounded-xl border transition-all hover:shadow-blue-glow ${
                  alert.status === 'TRIGGERED'
                    ? 'border-yellow-500/30'
                    : 'border-primary/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <AlertTriangle
                      className={`w-6 h-6 flex-shrink-0 mt-1 ${
                        alert.severity === 'HIGH'
                          ? 'text-red-500'
                          : alert.severity === 'MODERATE'
                          ? 'text-yellow-500'
                          : 'text-green-500'
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{zone?.name || 'Unknown Zone'}</h3>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{
                          backgroundColor: alert.severity === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                          color: alert.severity === 'HIGH' ? '#ef4444' : '#eab308'
                        }}>
                          {alert.severity}
                        </span>
                      </div>
                      <p style={{ color: 'rgba(230, 241, 255, 0.7)' }}>{alert.message}</p>
                      <span className="text-xs" style={{ color: 'rgba(230, 241, 255, 0.5)' }}>
                        {new Date(alert.triggered_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {alert.status === 'TRIGGERED' && (
                    <button
                      onClick={() => handleResolveAlert(alert.id)}
                      className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
