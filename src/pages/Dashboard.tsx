import { motion } from 'framer-motion';
import StatCard from '@/components/StatCard';
import ZoneCard from '@/components/ZoneCard';
import { zones, alerts } from '@/data/zones';
import { 
  AlertTriangle, 
  MapPin, 
  Activity, 
  TrendingUp,
  Droplets,
  Thermometer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const highRiskZones = zones.filter(z => z.riskLevel === 'high');
  const activeAlerts = alerts.filter(a => a.status === 'triggered');
  const avgRisk = Math.round(zones.reduce((acc, z) => acc + z.riskProbability, 0) / zones.length * 100);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Real-time flood risk monitoring and analysis</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={AlertTriangle}
          label="Active Alerts"
          value={activeAlerts.length}
          change="+2 today"
          trend="up"
          variant="danger"
          delay={0.1}
        />
        <StatCard
          icon={MapPin}
          label="High Risk Zones"
          value={highRiskZones.length}
          change="of 7 total"
          variant="warning"
          delay={0.2}
        />
        <StatCard
          icon={Activity}
          label="Average Risk Level"
          value={`${avgRisk}%`}
          change="+5% from yesterday"
          trend="up"
          variant="default"
          delay={0.3}
        />
        <StatCard
          icon={Droplets}
          label="24h Rainfall"
          value="122.5mm"
          change="Heavy"
          variant="default"
          delay={0.4}
        />
      </div>

      {/* Current Conditions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Zone Risk Overview</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {zones.slice(0, 4).map((zone, i) => (
              <ZoneCard
                key={zone.id}
                zone={zone}
                delay={0.1 * i}
                onClick={() => navigate('/dashboard/map')}
              />
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="space-y-4"
        >
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Current Conditions</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rainfall (1h)</p>
                    <p className="text-lg font-semibold text-foreground">18.2mm</p>
                  </div>
                </div>
                <span className="text-xs text-warning">Heavy</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">River Level</p>
                    <p className="text-lg font-semibold text-foreground">4.6m</p>
                  </div>
                </div>
                <span className="text-xs text-destructive">Critical</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Thermometer className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Soil Saturation</p>
                    <p className="text-lg font-semibold text-foreground">78%</p>
                  </div>
                </div>
                <span className="text-xs text-warning">High</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Prediction Status</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
              <span className="text-sm text-muted-foreground">Model running • Last update: 2 min ago</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Model Accuracy</span>
                <span className="text-foreground font-medium">94.2%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Data Sources</span>
                <span className="text-foreground font-medium">5 active</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Coverage</span>
                <span className="text-foreground font-medium">7 zones</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
