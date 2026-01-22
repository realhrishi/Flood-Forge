import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { alerts as initialAlerts, Alert } from '@/data/zones';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Check, 
  AlertTriangle, 
  Clock, 
  MapPin,
  Send,
  Mail,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [filter, setFilter] = useState<'all' | 'triggered' | 'resolved'>('all');

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  const handleResolve = (alertId: string) => {
    setAlerts(alerts.map(a => 
      a.id === alertId ? { ...a, status: 'resolved' as const } : a
    ));
    toast({
      title: "Alert Resolved",
      description: "The alert has been marked as resolved.",
    });
  };

  const handleSimulateAlert = (type: 'sms' | 'email') => {
    toast({
      title: `${type.toUpperCase()} Alert Simulated`,
      description: `A test ${type} alert has been sent to registered contacts.`,
    });
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-l-4 border-l-destructive bg-destructive/10';
      case 'high':
        return 'border-l-4 border-l-destructive/70 bg-destructive/5';
      case 'moderate':
        return 'border-l-4 border-l-warning bg-warning/5';
      default:
        return 'border-l-4 border-l-success bg-success/5';
    }
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
          <h1 className="text-2xl font-bold text-foreground">Alert Management</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage flood alerts</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => handleSimulateAlert('sms')}
          >
            <MessageSquare className="w-4 h-4" />
            Simulate SMS
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => handleSimulateAlert('email')}
          >
            <Mail className="w-4 h-4" />
            Simulate Email
          </Button>
        </div>
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
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {alerts.filter(a => a.status === 'triggered').length}
              </p>
              <p className="text-sm text-muted-foreground">Active Alerts</p>
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
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <Check className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {alerts.filter(a => a.status === 'resolved').length}
              </p>
              <p className="text-sm text-muted-foreground">Resolved</p>
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
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{alerts.length}</p>
              <p className="text-sm text-muted-foreground">Total Alerts</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'triggered', 'resolved'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f}
          </Button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={cn(
                "glass-card p-5 transition-all duration-300",
                getSeverityStyles(alert.severity)
              )}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-xs font-medium uppercase",
                      alert.severity === 'critical' ? 'bg-destructive text-destructive-foreground' :
                      alert.severity === 'high' ? 'bg-destructive/80 text-destructive-foreground' :
                      alert.severity === 'moderate' ? 'bg-warning text-warning-foreground' :
                      'bg-success text-success-foreground'
                    )}>
                      {alert.severity}
                    </span>
                    <span className={cn(
                      "px-2 py-1 rounded-md text-xs font-medium",
                      alert.status === 'triggered' ? 'bg-destructive/20 text-destructive' : 'bg-success/20 text-success'
                    )}>
                      {alert.status}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {alert.zoneName}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {alert.message}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{alert.zoneId}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(alert.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Risk: {Math.round(alert.riskProbability * 100)}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {alert.status === 'triggered' && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleResolve(alert.id)}
                      className="gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Mark Resolved
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Alerts;
