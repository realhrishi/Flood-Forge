import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { shelters, resources } from '@/data/zones';
import { 
  Building2, 
  Navigation, 
  Package, 
  Download, 
  CheckCircle2,
  XCircle,
  Truck,
  Droplets,
  HeartPulse,
  Ship,
  UtensilsCrossed,
  Bed
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

const resourceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Rescue Boats': Ship,
  'Medical Kits': HeartPulse,
  'Drinking Water': Droplets,
  'Ambulances': Truck,
  'Emergency Rations': UtensilsCrossed,
  'Blankets': Bed,
};

const ResponsePlanner = () => {
  const handleDownloadPlan = () => {
    toast({
      title: "Generating PDF",
      description: "Your response plan is being generated...",
    });
    setTimeout(() => {
      toast({
        title: "Download Ready",
        description: "Response plan PDF has been downloaded.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Response Planner</h1>
          <p className="text-muted-foreground mt-1">Emergency response coordination and resource management</p>
        </div>
        <Button variant="hero" className="gap-2" onClick={handleDownloadPlan}>
          <Download className="w-4 h-4" />
          Download Response Plan (PDF)
        </Button>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Shelters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Emergency Shelters</h3>
              <p className="text-sm text-muted-foreground">Available evacuation centers</p>
            </div>
          </div>

          <div className="space-y-3">
            {shelters.map((shelter, index) => (
              <motion.div
                key={shelter.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                className={cn(
                  "p-4 rounded-xl border transition-all duration-200",
                  shelter.available 
                    ? "bg-muted/50 border-border hover:border-primary/30" 
                    : "bg-muted/20 border-border/50 opacity-60"
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground">{shelter.name}</h4>
                      {shelter.available ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      ) : (
                        <XCircle className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Capacity: {shelter.capacity}</span>
                      <span>Distance: {shelter.distance}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={!shelter.available}
                  >
                    <Navigation className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Evacuation Routes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Evacuation Routes</h3>
              <p className="text-sm text-muted-foreground">Recommended escape paths</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { id: 1, name: 'Route A - North Highway', status: 'clear', time: '15 min', distance: '4.2 km' },
              { id: 2, name: 'Route B - Eastern Bridge', status: 'congested', time: '25 min', distance: '3.8 km' },
              { id: 3, name: 'Route C - West Ring Road', status: 'clear', time: '20 min', distance: '5.1 km' },
              { id: 4, name: 'Route D - River Bypass', status: 'blocked', time: 'N/A', distance: '2.5 km' },
            ].map((route, index) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                className={cn(
                  "p-4 rounded-xl border",
                  route.status === 'clear' ? 'bg-success/5 border-success/30' :
                  route.status === 'congested' ? 'bg-warning/5 border-warning/30' :
                  'bg-destructive/5 border-destructive/30'
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">{route.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>ETA: {route.time}</span>
                      <span>Distance: {route.distance}</span>
                    </div>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium capitalize",
                    route.status === 'clear' ? 'bg-success/20 text-success' :
                    route.status === 'congested' ? 'bg-warning/20 text-warning' :
                    'bg-destructive/20 text-destructive'
                  )}>
                    {route.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Resource Allocation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Resource Allocation Checklist</h3>
              <p className="text-sm text-muted-foreground">Emergency supplies status</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource, index) => {
              const Icon = resourceIcons[resource.name] || Package;
              const percentage = Math.round((resource.available / resource.required) * 100);
              const isLow = percentage < 80;
              const isCritical = percentage < 60;

              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                  className={cn(
                    "p-4 rounded-xl border transition-all duration-200",
                    isCritical ? 'bg-destructive/5 border-destructive/30' :
                    isLow ? 'bg-warning/5 border-warning/30' :
                    'bg-muted/50 border-border'
                  )}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      isCritical ? 'bg-destructive/10 text-destructive' :
                      isLow ? 'bg-warning/10 text-warning' :
                      'bg-success/10 text-success'
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{resource.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {resource.available} / {resource.required} {resource.unit}
                      </p>
                    </div>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={cn(
                      "h-2",
                      isCritical ? '[&>div]:bg-destructive' :
                      isLow ? '[&>div]:bg-warning' :
                      '[&>div]:bg-success'
                    )}
                  />
                  <div className="flex justify-between mt-2 text-xs">
                    <span className={cn(
                      isCritical ? 'text-destructive' :
                      isLow ? 'text-warning' :
                      'text-success'
                    )}>
                      {percentage}% available
                    </span>
                    {isLow && (
                      <span className={isCritical ? 'text-destructive' : 'text-warning'}>
                        {isCritical ? 'Critical shortage' : 'Low stock'}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResponsePlanner;
