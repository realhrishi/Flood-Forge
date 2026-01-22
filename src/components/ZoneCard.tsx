import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MapPin, Clock, TrendingUp, Users } from 'lucide-react';
import { Zone } from '@/data/zones';

interface ZoneCardProps {
  zone: Zone;
  onClick?: () => void;
  delay?: number;
}

const ZoneCard = ({ zone, onClick, delay = 0 }: ZoneCardProps) => {
  const riskStyles = {
    low: 'risk-low',
    moderate: 'risk-moderate',
    high: 'risk-high',
  };

  const riskBgStyles = {
    low: 'from-success/20 to-success/5',
    moderate: 'from-warning/20 to-warning/5',
    high: 'from-destructive/20 to-destructive/5',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      onClick={onClick}
      className={cn(
        "glass-card-hover p-5 cursor-pointer relative overflow-hidden",
        "bg-gradient-to-br",
        riskBgStyles[zone.riskLevel]
      )}
    >
      {/* Risk indicator bar */}
      <div 
        className={cn(
          "absolute top-0 left-0 right-0 h-1",
          zone.riskLevel === 'high' ? 'bg-destructive' :
          zone.riskLevel === 'moderate' ? 'bg-warning' : 'bg-success'
        )}
      />

      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{zone.name}</h3>
          <p className="text-sm text-muted-foreground">{zone.id}</p>
        </div>
        <span className={cn(
          "px-3 py-1 rounded-full text-xs font-medium border",
          riskStyles[zone.riskLevel]
        )}>
          {zone.severity}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Risk Probability</p>
          <p className="text-2xl font-bold text-foreground">
            {Math.round(zone.riskProbability * 100)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Time to Impact</p>
          <p className="text-2xl font-bold text-foreground">
            {zone.timeToImpact}h
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{zone.population.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>Updated now</span>
        </div>
      </div>

      {zone.topFactors.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-2">Top Risk Factors:</p>
          <div className="flex flex-wrap gap-2">
            {zone.topFactors.slice(0, 3).map((factor, i) => (
              <span 
                key={i}
                className="px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground"
              >
                {factor}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ZoneCard;
