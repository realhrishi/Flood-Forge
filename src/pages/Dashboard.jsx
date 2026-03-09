import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import { predictAPI, alertAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { detectUserLocation } from "../utils/locationService";

export default function Dashboard() {

  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('48h');
  const [riskData, setRiskData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [city, setCity] = useState(user?.city || "Delhi");
  const state = user?.state || 'IN';

  /* GPS AUTO DETECT */
  useEffect(() => {

    const getLocation = async () => {

      // If user already saved profile location, use that
      if (user?.city) {
        setCity(user.city);
        return;
      }

      // Otherwise detect GPS
      try {

        const loc = await detectUserLocation();

        if (loc?.district) {
          setCity(loc.district);
        }
        else if (loc?.city) {
          setCity(loc.city);
        }

      } catch (err) {

        console.log("GPS detection failed");

      }

    };

    getLocation();

  }, [user]);

  /* FETCH DATA */
  const fetchData = async () => {

    setLoading(true);

    try {

      const riskRes = await predictAPI.locationRisk(city);
      setRiskData(riskRes.data);

      const alertRes = await alertAPI.getMyAlerts({ limit: 4 });
      setAlerts(alertRes.data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchData();

    const interval = setInterval(fetchData, 60000);

    return () => clearInterval(interval);

  }, [city]);

  if (loading || !riskData) {

    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-bg-void text-accent-blue font-['Orbitron'] animate-pulse text-xl">
        LOADING DASHBOARD...
      </div>
    );

  }

  const baseProb = riskData.risk_percentage;

  const trendData =
    activeTab === '24h'
      ? [max0(baseProb - 20), max0(baseProb - 10), baseProb, baseProb + 5, baseProb]
      : activeTab === '48h'
      ? [max0(baseProb - 30), max0(baseProb - 15), baseProb, min100(baseProb + 15), min100(baseProb + 5)]
      : [max0(baseProb - 40), max0(baseProb - 20), baseProb, min100(baseProb + 25), min100(baseProb + 10)];

  const chartData = {
    labels: ['-12h', 'Now', '+12h', '+24h', '+36h'],
    datasets: [{
      label: 'Risk Probability (%)',
      data: trendData,
      borderColor: '#FF3B3B',
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(255,59,59,0.5)');
        gradient.addColorStop(1, 'rgba(255,59,59,0.0)');
        return gradient;
      },
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#FF3B3B',
      pointBorderColor: 'var(--bg-surface)',
      pointBorderWidth: 2,
      pointRadius: 4,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#7BA3C4' }
      },
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#7BA3C4' }
      }
    },
    plugins: { legend: { display: false } }
  };

  return (

    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-[1400px] mx-auto px-6 py-8 min-h-[calc(100vh-72px)]"
    >

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="font-orbitron font-bold text-3xl text-text-primary">
            Welcome, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="font-space-grotesk text-text-muted text-sm mt-1">
            Monitoring location: {riskData.city}, {riskData.state}
          </p>
        </div>

        <button
          onClick={fetchData}
          className="btn-secondary flex items-center gap-2 group"
        >
          Refresh Data
        </button>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT PANEL */}
        <div className="lg:col-span-3 space-y-6">

          <div className="glass-panel p-6 rounded-xl border-t-2 border-t-risk-high">

            <h3 className="text-xs text-text-muted mb-1">YOUR LOCATION</h3>

            <h2 className="font-orbitron font-bold text-2xl text-text-primary mb-6">
              {riskData.city}, {riskData.state || 'IN'}
            </h2>

            <h3 className="text-xs text-text-muted mb-2">FLOOD RISK</h3>

            <div className="flex justify-between mb-2">
              <span className={`font-orbitron ${getRiskColorText(riskData.risk_level)}`}>
                [{riskData.risk_level}]
              </span>
              <span>{riskData.risk_percentage}%</span>
            </div>

            <div className="w-full bg-bg-void h-2 rounded-full mb-6">
              <div
                className={`h-full ${getRiskColorBg(riskData.risk_level)}`}
                style={{ width: `${riskData.risk_percentage}%` }}
              />
            </div>

            <div className="space-y-3 text-sm mb-6">

              <div className="flex justify-between">
                <span>Impact Window</span>
                <span>{riskData.impact_window}</span>
              </div>

              <div className="flex justify-between">
                <span>Rainfall</span>
                <span>{riskData.rainfall} mm/day</span>
              </div>

              <div className="flex justify-between">
                <span>River Level</span>
                <span>{riskData.river_level} m</span>
              </div>

            </div>

            <button
              onClick={() => navigate('/profile')}
              className="w-full btn-secondary py-2 text-sm"
            >
              Update Location
            </button>

          </div>

        </div>

        {/* CENTER GRAPH */}
        <div className="lg:col-span-6">

          <div className="glass-panel p-6 rounded-xl min-h-[400px]">

            <div className="flex justify-between items-center mb-6">

              <h3 className="font-orbitron text-lg text-text-primary">
                Risk Trend
              </h3>

              <div className="flex bg-bg-surface p-1 rounded-md border border-glass-border">

                {['24h', '48h', '72h'].map(tab => (

                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 text-xs font-bold rounded ${
                      activeTab === tab
                        ? 'bg-accent-blue text-bg-void'
                        : 'text-text-muted'
                    }`}
                  >
                    {tab}
                  </button>

                ))}

              </div>

            </div>

            <div className="h-[300px]">
              <Line data={chartData} options={chartOptions} />
            </div>

          </div>

        </div>

        {/* ALERTS */}
        <div className="lg:col-span-3">

          <div className="glass-panel p-6 rounded-xl">

            <h3 className="text-xs text-text-muted mb-4">
              ACTIVE ALERTS
            </h3>

            {alerts.length === 0 ? (

              <div className="text-sm text-text-muted">
                No active alerts for you.
              </div>

            ) : (

              alerts.map((al) => (

                <div
                  key={al.id}
                  className={`flex justify-between border-b pb-2 mb-2 ${getRiskBorderLeft(al.risk_level)}`}
                >

                  <span>{al.location}</span>

                  <span>
                    {al.risk_level} {Math.round(al.probability * 100)}%
                  </span>

                </div>

              ))

            )}

            <button
              onClick={() => navigate('/alerts')}
              className="text-xs text-accent-blue mt-3"
            >
              View All Alerts →
            </button>

          </div>

        </div>

      </div>

    </motion.div>

  );

}

const max0 = (v) => Math.max(0, v);
const min100 = (v) => Math.min(100, v);

function getRiskColorText(level) {
  switch (level?.toUpperCase()) {
    case 'CRITICAL': return 'text-risk-critical';
    case 'HIGH': return 'text-risk-high';
    case 'MEDIUM': return 'text-risk-medium';
    default: return 'text-risk-low';
  }
}

function getRiskColorBg(level) {
  switch (level?.toUpperCase()) {
    case 'CRITICAL': return 'bg-risk-critical';
    case 'HIGH': return 'bg-risk-high';
    case 'MEDIUM': return 'bg-risk-medium';
    default: return 'bg-risk-low';
  }
}

function getRiskBorderLeft(level) {
  switch (level?.toUpperCase()) {
    case 'CRITICAL': return 'border-l-risk-critical';
    case 'HIGH': return 'border-l-risk-high';
    case 'MEDIUM': return 'border-l-risk-medium';
    default: return 'border-l-risk-low';
  }
}