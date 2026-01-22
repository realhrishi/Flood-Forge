import { useEffect, useState } from 'react';
import { MapPin, Users, Phone, FileDown, CheckSquare, Square } from 'lucide-react';
import { api } from '../lib/api';
import { Shelter } from '../lib/supabase';
import DashboardLayout from '../components/DashboardLayout';

interface Resource {
  id: string;
  name: string;
  checked: boolean;
}

export default function ResponsePlanner() {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<Resource[]>([
    { id: '1', name: 'Emergency boats (10 units)', checked: false },
    { id: '2', name: 'Medical kits (50 units)', checked: false },
    { id: '3', name: 'Drinking water (1000 liters)', checked: false },
    { id: '4', name: 'Ambulances (5 units)', checked: false },
    { id: '5', name: 'Food supplies (500 meals)', checked: false },
    { id: '6', name: 'Blankets (200 units)', checked: false },
    { id: '7', name: 'Communication devices (20 units)', checked: false },
    { id: '8', name: 'Generators (10 units)', checked: false },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const sheltersData = await api.getShelters();
      setShelters(sheltersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  function toggleResource(id: string) {
    setResources(resources.map((r) => (r.id === id ? { ...r, checked: !r.checked } : r)));
  }

  function downloadPlan() {
    const checkedResources = resources.filter((r) => r.checked);
    const planText = `
FLOOD RESPONSE PLAN
Generated: ${new Date().toLocaleString()}

SHELTERS (${shelters.length} locations)
${shelters
  .map(
    (s) => `
- ${s.name}
  Address: ${s.address}
  Capacity: ${s.capacity} people (${s.current_occupancy} occupied)
  Contact: ${s.contact || 'N/A'}
  Facilities: ${s.facilities.join(', ')}
`
  )
  .join('\n')}

RESOURCE ALLOCATION (${checkedResources.length} items)
${checkedResources.map((r) => `- ${r.name}`).join('\n')}
    `;

    const blob = new Blob([planText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flood-response-plan-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Response Planner</h1>
            <p style={{ color: 'rgba(230, 241, 255, 0.7)' }}>Emergency response coordination and planning</p>
          </div>
          <button
            onClick={downloadPlan}
            className="px-6 py-2 bg-ocean-gradient rounded-lg font-semibold hover:shadow-blue-glow transition-all duration-300 flex items-center gap-2"
          >
            <FileDown className="w-5 h-5" />
            Download Response Plan
          </button>
        </div>

        <div className="bg-card-dark p-6 rounded-xl border border-primary/20">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Emergency Shelters</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {shelters.map((shelter) => (
              <div
                key={shelter.id}
                className="bg-card-darker p-5 rounded-lg border border-primary/10 hover:border-primary/30 transition-all"
              >
                <h3 className="text-lg font-semibold mb-3">{shelter.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span style={{ color: 'rgba(230, 241, 255, 0.7)' }}>{shelter.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-secondary" />
                    <span style={{ color: 'rgba(230, 241, 255, 0.7)' }}>
                      Capacity: {shelter.current_occupancy}/{shelter.capacity}
                    </span>
                  </div>
                  {shelter.contact && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <span style={{ color: 'rgba(230, 241, 255, 0.7)' }}>{shelter.contact}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card-dark p-6 rounded-xl border border-primary/20">
          <h2 className="text-2xl font-bold mb-6">Resource Allocation Checklist</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {resources.map((resource) => (
              <button
                key={resource.id}
                onClick={() => toggleResource(resource.id)}
                className="flex items-center gap-3 p-4 bg-card-darker rounded-lg border border-primary/10 hover:border-primary/30 transition-all text-left"
              >
                {resource.checked ? (
                  <CheckSquare className="w-5 h-5 text-green-400 flex-shrink-0" />
                ) : (
                  <Square className="w-5 h-5 flex-shrink-0" style={{ color: 'rgba(230, 241, 255, 0.3)' }} />
                )}
                <span style={{ color: resource.checked ? '#E6F1FF' : 'rgba(230, 241, 255, 0.6)' }}>
                  {resource.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
