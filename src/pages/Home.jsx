import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler
} from 'chart.js';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

const Home = () => {
  const canvasRef = useRef(null);

  // Rain particles background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const drops = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 2 + Math.random() * 3,
      length: 10 + Math.random() * 15,
      opacity: 0.2 + Math.random() * 0.4
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drops.forEach(drop => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.strokeStyle = `rgba(45,212,191,${drop.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        drop.y += drop.speed;
        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }
      });
      requestAnimationFrame(draw);
    };
    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mock chart data
  const chartData = {
    labels: ['0h', '12h', '24h', '36h', '48h', '60h', '72h'],
    datasets: [{
      label: 'Flood Probability (%)',
      data: [10, 15, 25, 60, 85, 90, 82],
      borderColor: '#2dd4bf',
      backgroundColor: 'rgba(45, 212, 191, 0.2)',
      fill: true,
      tension: 0.4,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.05)' } },
      x: { grid: { color: 'rgba(255,255,255,0.05)' } }
    },
    plugins: { legend: { display: false } }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative"
    >
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[-1]" />
      <div className="fixed inset-0 pointer-events-none z-[-2] bg-grid" />

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-72px)] flex items-center pt-12 md:pt-0">
        <div className="max-w-[1400px] mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col space-y-6"
          >
            <div className="flex items-center gap-2 text-accent-cyan font-orbitron text-sm">
              <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
              [ 🛰️ LIVE MONITORING ACTIVE ]
            </div>
            
            <h1 className="font-orbitron font-extrabold text-5xl md:text-7xl leading-tight bg-clip-text text-transparent bg-gradient-to-br from-accent-blue to-accent-cyan">
              FloodForge
            </h1>
            
            <h2 className="font-orbitron font-bold text-2xl md:text-4xl text-text-primary">
              AI Flood Intelligence System
            </h2>
            
            <p className="font-space-grotesk text-lg text-text-muted max-w-lg">
              Predict floods 24–72 hours in advance and receive real-time alerts for your location.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <NavLink to="/dashboard" className="btn-primary">Check Flood Risk</NavLink>
              <NavLink to="/radar" className="btn-secondary">View Live Map</NavLink>
            </div>
            
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-glass-border">
              <div>
                <div className="font-orbitron text-2xl text-accent-blue">847</div>
                <div className="font-space-grotesk text-sm text-text-muted">Cities Monitored</div>
              </div>
              <div>
                <div className="font-orbitron text-2xl text-accent-blue">94%</div>
                <div className="font-space-grotesk text-sm text-text-muted">Prediction Accuracy</div>
              </div>
              <div>
                <div className="font-orbitron text-2xl text-accent-blue">2.3M+</div>
                <div className="font-space-grotesk text-sm text-text-muted">Users Protected</div>
              </div>
            </div>
          </motion.div>

          {/* Right column: Interactive Map Preview */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full h-[400px] lg:h-[600px] relative rounded-2xl overflow-hidden glass-panel border-accent-blue/30 p-2"
          >
            <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_100px_rgba(5,8,22,1)] z-10" />
            <MapContainer 
              center={[22.5937, 78.9629]} 
              zoom={4} 
              zoomControl={false} 
              scrollWheelZoom={false}
              dragging={false}
              className="w-full h-full rounded-xl bg-bg-void"
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution="&copy; OpenStreetMap contributors &copy; CARTO"
              />
              <CircleMarker center={[19.0760, 72.8777]} radius={6} color="#FF3B3B" fillColor="#FF3B3B" fillOpacity={0.8} />
              <CircleMarker center={[25.5941, 85.1376]} radius={6} color="#F1C40F" fillColor="#F1C40F" fillOpacity={0.8} />
              <CircleMarker center={[28.7041, 77.1025]} radius={6} color="#2ECC71" fillColor="#2ECC71" fillOpacity={0.8} />
            </MapContainer>
            {/* Mock radar sweep overlay */}
            <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 border-t-[4px] border-accent-cyan/60 rounded-full animate-[scan-rotate_4s_linear_infinite] origin-center z-20 pointer-events-none mix-blend-screen" 
                 style={{ background: 'conic-gradient(from 0deg, transparent 0%, rgba(0,245,212,0.1) 20%, transparent 80%)' }} />
          </motion.div>
        </div>
      </section>

      {/* Stats/Problem Section */}
      <section className="py-24 bg-bg-deep/50 border-t border-glass-border backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-orbitron font-bold text-3xl md:text-4xl text-text-primary mb-4">The Flood Crisis in India</h2>
            <p className="font-space-grotesk text-text-muted text-lg">Why real-time prediction matters</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🌊', title: 'Devastating Flooding', stat: '40M+', desc: 'Floods affect more than 40 million Indians annually' },
              { icon: '⏰', title: 'Delayed Warnings', stat: '6–12 hrs', desc: 'Existing systems issue warnings too late for evacuation' },
              { icon: '💸', title: 'Economic Loss', stat: '₹1.8 Lakh Cr', desc: 'Massive infrastructure and agricultural destruction' },
              { icon: '👥', title: 'Community Risk', stat: '700+', desc: 'Over 700 districts face recurring flood risk' },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 rounded-xl border-t-2 border-t-risk-high hover:-translate-y-1 transition-transform"
              >
                <div className="w-12 h-12 rounded-full bg-risk-high/10 flex items-center justify-center text-2xl mb-4 border border-risk-high/30">
                  {item.icon}
                </div>
                <h3 className="font-orbitron font-semibold text-xl text-text-primary mb-2">{item.title}</h3>
                <div className="font-orbitron text-risk-high font-bold mb-2">{item.stat}</div>
                <p className="font-space-grotesk text-sm text-text-muted">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Features */}
      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-orbitron font-bold text-3xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-accent-cyan">
              How FloodForge Solves This
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🤖', title: 'AI Flood Prediction', desc: 'XGBoost model predicts flood risk 24–72 hours in advance with 94% accuracy' },
              { icon: '🗺️', title: 'Interactive Risk Heatmap', desc: 'Real-time color-coded flood zones across all of India on an interactive map' },
              { icon: '🔔', title: 'Smart Location Alerts', desc: 'Instant notifications when flood risk rises for your registered location' },
              { icon: '🚨', title: 'Evacuation Guidance', desc: 'AI-generated evacuation recommendations based on risk level' },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 rounded-xl border-t-2 border-t-accent-cyan hover:-translate-y-1 transition-transform group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">{item.icon}</div>
                <h3 className="font-orbitron font-semibold text-xl text-text-primary mb-3">{item.title}</h3>
                <p className="font-space-grotesk text-sm text-text-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline Flow */}
      <section className="py-24 bg-bg-deep/50 border-y border-glass-border">
        <div className="max-w-[1400px] mx-auto px-6 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[800px] space-x-4">
            {[
              { step: '1', title: '🌧️ Environmental Data' },
              { step: '2', title: '⚙️ AI Prediction Model' },
              { step: '3', title: '📊 Risk Scoring' },
              { step: '4', title: '🔔 Alert System' },
              { step: '5', title: '📱 User Dashboard' },
            ].map((item, i, arr) => (
              <React.Fragment key={i}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center flex-1 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-accent-blue/10 border border-accent-blue flex items-center justify-center font-orbitron font-bold text-xl text-accent-blue mb-4 shadow-[0_0_15px_rgba(0,198,255,0.2)]">
                    {item.step}
                  </div>
                  <div className="font-space-grotesk font-semibold text-text-primary">{item.title}</div>
                </motion.div>
                {i < arr.length - 1 && (
                  <div className="flex-1 max-w-[60px]">
                    <svg viewBox="0 0 100 20" className="w-full text-accent-cyan overflow-visible">
                      <motion.line 
                        x1="0" y1="10" x2="100" y2="10" 
                        stroke="currentColor" strokeWidth="2" strokeDasharray="5,5"
                        animate={{ strokeDashoffset: [-20, 0] }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      />
                      <path d="M90 0 L100 10 L90 20" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* AI Graph Preview / Tabs */}
      <section className="py-24">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="glass-panel p-8 rounded-2xl border-accent-blue/20">
            <div className="flex justify-center mb-8 gap-4">
              {['24 Hours', '48 Hours', '72 Hours'].map((tab, i) => (
                <button 
                  key={tab} 
                  className={`px-6 py-2 rounded-full font-space-grotesk font-semibold text-sm transition-colors ${i === 2 ? 'bg-accent-blue text-bg-void shadow-[0_0_15px_rgba(0,198,255,0.4)]' : 'bg-transparent text-text-primary border border-glass-border hover:border-accent-blue/50'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="h-[300px] w-full">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden border-t border-glass-border">
        <div className="max-w-[800px] mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <h2 className="font-orbitron font-bold text-4xl md:text-5xl text-text-primary mb-6">
            Start Monitoring Your Area
          </h2>
          <p className="font-space-grotesk text-text-muted text-lg mb-10">
            Join thousands of users receiving real-time flood alerts across India.
          </p>
          <NavLink to="/signup" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
            Sign Up for Free
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </NavLink>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
