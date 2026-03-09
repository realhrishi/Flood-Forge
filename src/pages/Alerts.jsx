import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AlertCard from '../components/AlertCard';
import { alertAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

export default function Alerts() {
  const [filter, setFilter] = useState({ state: 'All', severity: 'All' });
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.state !== 'All') params.state = filter.state;
      if (filter.severity !== 'All') params.risk_level = filter.severity;
      
      const res = isAuthenticated
        ? await alertAPI.getMyAlerts(params)
        : await alertAPI.getAllAlerts(params);
        
      setAlerts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [filter, isAuthenticated]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-[1400px] mx-auto px-6 py-8 min-h-[calc(100vh-72px)]"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="font-orbitron font-bold text-3xl text-text-primary mb-2 flex items-center gap-3">
            <span className="animate-pulse">⚠</span> ACTIVE ALERTS
            {!isAuthenticated && <span className="text-sm border border-accent-blue px-2 py-1 rounded text-accent-blue font-space-grotesk ml-2">GLOBAL</span>}
          </h1>
          <p className="font-space-grotesk text-text-muted">Monitor high-risk zones and automated early warnings.</p>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-xl mb-8 flex flex-col md:flex-row gap-4 border-t border-t-accent-blue/30">
        <select 
          className="bg-bg-void border border-glass-border text-text-primary text-sm rounded-lg focus:border-accent-blue block w-full p-2.5 font-space-grotesk outline-none"
          value={filter.state}
          onChange={(e) => setFilter({ ...filter, state: e.target.value })}
        >
          <option value="">All States</option>
          <option>Andhra Pradesh</option>
          <option>Arunachal Pradesh</option>
          <option>Assam</option>
          <option>Bihar</option>
          <option>Chhattisgarh</option>
          <option>Goa</option>
          <option>Gujarat</option>
          <option>Haryana</option>
          <option>Himachal Pradesh</option>
          <option>Jharkhand</option>
          <option>Karnataka</option>
          <option>Kerala</option>
          <option>Madhya Pradesh</option>
          <option>Maharashtra</option>
          <option>Manipur</option>
          <option>Meghalaya</option>
          <option>Mizoram</option>
          <option>Nagaland</option>
          <option>Odisha</option>
          <option>Punjab</option>
          <option>Rajasthan</option>
          <option>Sikkim</option>
          <option>Tamil Nadu</option>
          <option>Telangana</option>
          <option>Tripura</option>
          <option>Uttar Pradesh</option>
          <option>Uttarakhand</option>
          <option>West Bengal</option>
          <option>Andaman and Nicobar Islands</option>
          <option>Chandigarh</option>
          <option>Dadra and Nagar Haveli and Daman and Diu</option>
          <option>Delhi</option>
          <option>Lakshadweep</option>
          <option>Puducherry</option>
          <option>Ladakh</option>
          <option>Jammu and Kashmir</option>
        </select>

        <select 
          className="bg-bg-void border border-glass-border text-text-primary text-sm rounded-lg focus:border-accent-blue block w-full p-2.5 font-space-grotesk outline-none"
          value={filter.severity}
          onChange={(e) => setFilter({ ...filter, severity: e.target.value })}
        >
          <option value="All">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="mb-4 text-text-muted font-space-grotesk text-sm">
        {loading ? 'Fetching active alerts...' : `Showing ${alerts.length} active alerts`}
      </div>

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alerts.map((alert, idx) => (
            <motion.div key={alert.id || idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <AlertCard 
                location={alert.location}
                risk={alert.risk_level?.toUpperCase()}
                probability={Math.round(alert.probability * 100)}
                window={alert.impact_window}
                rainfall={`${alert.rainfall}mm/day`}
                timestamp={alert.timestamp ? formatDistanceToNow(new Date(alert.timestamp)) + ' ago' : 'Just now'}
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
