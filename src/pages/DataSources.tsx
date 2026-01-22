import { motion } from 'framer-motion';
import { dataSources } from '@/data/zones';
import { 
  Satellite, 
  Cloud, 
  Database, 
  Activity, 
  Leaf,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const sourceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'NASA GPM Rainfall': Satellite,
  'IMD Weather Data': Cloud,
  'Historical Flood Records': Database,
  'River Gauge Network': Activity,
  'Soil Moisture Index': Leaf,
};

const DataSources = () => {
  const formatTimeAgo = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffHours / 24)} day${diffHours > 24 ? 's' : ''} ago`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-foreground">Data Sources</h1>
        <p className="text-muted-foreground mt-1">Connected data feeds and integrations</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {dataSources.filter(s => s.status === 'active').length}
              </p>
              <p className="text-sm text-muted-foreground">Active Sources</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {dataSources.filter(s => s.status === 'maintenance').length}
              </p>
              <p className="text-sm text-muted-foreground">In Maintenance</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {Math.round(dataSources.reduce((acc, s) => acc + s.accuracy, 0) / dataSources.length)}%
              </p>
              <p className="text-sm text-muted-foreground">Avg. Accuracy</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Data Sources Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {dataSources.map((source, index) => {
          const Icon = sourceIcons[source.name] || Database;
          
          return (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
              className="glass-card-hover p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    source.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{source.name}</h3>
                    <p className="text-sm text-muted-foreground">{source.description}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      source.status === 'active' ? 'bg-success' : 'bg-warning animate-pulse'
                    )} />
                    <span className={cn(
                      "text-sm font-medium capitalize",
                      source.status === 'active' ? 'text-success' : 'text-warning'
                    )}>
                      {source.status}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Last Sync</p>
                  <p className="text-sm font-medium text-foreground">
                    {formatTimeAgo(source.lastSync)}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Accuracy</span>
                  <span className="text-xs font-medium text-foreground">{source.accuracy}%</span>
                </div>
                <Progress 
                  value={source.accuracy} 
                  className="h-2 [&>div]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button variant="ghost" size="sm" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Sync Now
                </Button>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Sensor Integration Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="glass-card p-6 border-l-4 border-l-primary"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">IoT Sensor Integration</h3>
            <p className="text-muted-foreground text-sm mb-4">
              FloodForge supports optional integration with ground-level IoT sensors for enhanced accuracy. 
              Sensor data can be streamed directly to our prediction models for real-time local conditions monitoring.
            </p>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">Learn More</Button>
              <Button variant="ghost" size="sm">Request Hardware Setup</Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DataSources;
