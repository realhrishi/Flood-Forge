import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Zone } from '../lib/supabase';
import DashboardLayout from '../components/DashboardLayout';

export default function Analytics() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>('');

  useEffect(() => {
    loadZones();
  }, []);

  async function loadZones() {
    try {
      const zonesData = await api.getZones();
      setZones(zonesData);
      if (zonesData.length > 0) {
        setSelectedZone(zonesData[0].id);
      }
    } catch (error) {
      console.error('Error loading zones:', error);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics</h1>
            <p style={{ color: 'rgba(230, 241, 255, 0.7)' }}>Environmental data and risk trends</p>
          </div>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-4 py-2 bg-card-dark border border-primary/30 rounded-lg focus:outline-none focus:border-primary"
          >
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card-dark p-6 rounded-xl border border-primary/20">
            <div className="text-2xl font-bold">--</div>
            <div className="text-sm" style={{ color: 'rgba(230, 241, 255, 0.6)' }}>Current Rainfall</div>
          </div>
          <div className="bg-card-dark p-6 rounded-xl border border-secondary/20">
            <div className="text-2xl font-bold">--</div>
            <div className="text-sm" style={{ color: 'rgba(230, 241, 255, 0.6)' }}>River Level</div>
          </div>
          <div className="bg-card-dark p-6 rounded-xl border border-primary/20">
            <div className="text-2xl font-bold">--</div>
            <div className="text-sm" style={{ color: 'rgba(230, 241, 255, 0.6)' }}>Risk Level</div>
          </div>
        </div>

        <div className="bg-card-dark p-6 rounded-xl border border-primary/20">
          <h2 className="text-xl font-bold mb-4">Charts will load here</h2>
          <div className="h-64 flex items-center justify-center" style={{ color: 'rgba(230, 241, 255, 0.5)' }}>
            Loading analytics data...
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
