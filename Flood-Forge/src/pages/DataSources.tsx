import { Database, Cloud, Satellite, Zap } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

export default function DataSources() {
  const dataSources = [
    {
      icon: Satellite,
      name: 'NASA GPM Rainfall',
      description: 'Global Precipitation Measurement satellite data providing real-time rainfall estimates.',
      status: 'Active',
      lastUpdate: '5 minutes ago',
      coverage: 'Global',
      interval: 'Every 30 minutes',
    },
    {
      icon: Cloud,
      name: 'IMD Rainfall Network',
      description: 'India Meteorological Department rainfall gauge network for precise local measurements.',
      status: 'Active',
      lastUpdate: '2 minutes ago',
      coverage: 'India',
      interval: 'Every 15 minutes',
    },
    {
      icon: Database,
      name: 'Flood History Dataset',
      description: 'Historical flood events and patterns for machine learning model training.',
      status: 'Active',
      lastUpdate: '24 hours ago',
      coverage: 'Global',
      interval: 'Monthly updates',
    },
    {
      icon: Zap,
      name: 'River Gauge Network',
      description: 'Real-time river level and discharge measurements from monitoring stations.',
      status: 'Active',
      lastUpdate: '1 minute ago',
      coverage: 'Regional',
      interval: 'Every 5 minutes',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Data Sources</h1>
          <p className="text-text-light/70">Connected data streams for flood prediction system</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {dataSources.map((source) => {
            const Icon = source.icon;
            return (
              <div
                key={source.name}
                className="bg-card-dark p-6 rounded-xl border border-primary/20 hover:border-primary/50 hover:shadow-blue-glow transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon className="w-10 h-10 text-primary" />
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
                    {source.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{source.name}</h3>
                <p className="text-text-light/70 mb-4">{source.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-light/60">Coverage:</span>
                    <span className="font-semibold text-primary">{source.coverage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-light/60">Update Interval:</span>
                    <span className="font-semibold text-secondary">{source.interval}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-light/60">Last Update:</span>
                    <span className="font-semibold">{source.lastUpdate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-card-dark p-6 rounded-xl border border-primary/20">
          <h2 className="text-2xl font-bold mb-4">Sensor Integration</h2>
          <div className="bg-card-darker p-6 rounded-lg border border-secondary/20">
            <h3 className="text-lg font-semibold mb-3 text-secondary">Optional Hardware Integration</h3>
            <p className="text-text-light/70 mb-4">
              FloodGuard AI supports integration with additional sensors for enhanced local monitoring:
            </p>
            <ul className="space-y-3 ml-4">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <div>
                  <div className="font-semibold">Rain Gauges</div>
                  <div className="text-sm text-text-light/60">Automated weather stations for precise local rainfall measurement</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <div>
                  <div className="font-semibold">Water Level Sensors</div>
                  <div className="text-sm text-text-light/60">IoT devices for real-time river and stream monitoring</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <div>
                  <div className="font-semibold">Soil Moisture Sensors</div>
                  <div className="text-sm text-text-light/60">Ground-based sensors measuring soil saturation levels</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <div>
                  <div className="font-semibold">Weather Stations</div>
                  <div className="text-sm text-text-light/60">Comprehensive environmental monitoring systems</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-card-dark p-6 rounded-xl border border-primary/20">
          <h2 className="text-2xl font-bold mb-4">API Documentation</h2>
          <div className="space-y-4">
            <div className="bg-card-darker p-4 rounded-lg border border-primary/10">
              <div className="font-mono text-sm text-secondary mb-2">GET /api/zones</div>
              <p className="text-text-light/70">Get list of monitored zones with geographic boundaries</p>
            </div>
            <div className="bg-card-darker p-4 rounded-lg border border-primary/10">
              <div className="font-mono text-sm text-secondary mb-2">POST /api/predict</div>
              <p className="text-text-light/70">Generate flood risk predictions based on environmental parameters</p>
            </div>
            <div className="bg-card-darker p-4 rounded-lg border border-primary/10">
              <div className="font-mono text-sm text-secondary mb-2">GET /api/alerts</div>
              <p className="text-text-light/70">Retrieve current and historical flood alerts</p>
            </div>
            <div className="bg-card-darker p-4 rounded-lg border border-primary/10">
              <div className="font-mono text-sm text-secondary mb-2">GET /api/analytics</div>
              <p className="text-text-light/70">Access historical environmental analytics data</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
