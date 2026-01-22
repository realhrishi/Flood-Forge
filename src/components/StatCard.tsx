import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  delay?: number;
}

const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  change, 
  trend = 'neutral',
  variant = 'default',
  delay = 0 
}: StatCardProps) => {
  const variantStyles = {
    default: 'border-border',
    success: 'border-success/30 bg-success/5',
    warning: 'border-warning/30 bg-warning/5',
    danger: 'border-destructive/30 bg-destructive/5',
  };

  const iconStyles = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-destructive/10 text-destructive',
  };

  const trendColors = {
    up: 'text-success',
    down: 'text-destructive',
    neutral: 'text-muted-foreground',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "glass-card-hover p-6",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", iconStyles[variant])}>
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <span className={cn("text-sm font-medium", trendColors[trend])}>
            {change}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-muted-foreground text-sm">{label}</p>
        <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
