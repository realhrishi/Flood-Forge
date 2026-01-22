import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { MapPin, Clock, Zap, Download, Bell } from 'lucide-react';
import { zones } from '@/data/zones';

interface DashboardHeaderProps {
  onPredict?: () => void;
  isPredicting?: boolean;
}

const DashboardHeader = ({ onPredict, isPredicting }: DashboardHeaderProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedZone, setSelectedZone] = useState('all');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm px-6 flex items-center justify-between">
      <div className="flex items-center gap-6">
        {/* Location Selector */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <Select value={selectedZone} onValueChange={setSelectedZone}>
            <SelectTrigger className="w-48 bg-muted border-border">
              <SelectValue placeholder="Select Zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Zones</SelectItem>
              {zones.map((zone) => (
                <SelectItem key={zone.id} value={zone.id}>
                  {zone.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Live Time */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-mono">
            {currentTime.toLocaleString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </span>
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-success">LIVE</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
            3
          </span>
        </Button>

        {/* Predict Button */}
        <Button 
          variant="hero" 
          onClick={onPredict}
          disabled={isPredicting}
          className="gap-2"
        >
          <Zap className="w-4 h-4" />
          {isPredicting ? 'Predicting...' : 'Predict'}
        </Button>

        {/* Export Report */}
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
