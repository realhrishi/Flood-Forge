import { Link } from 'react-router-dom';
import { Droplets, MapPin, Shield, Clock, Target, AlertTriangle } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-black" style={{ color: '#E6F1FF' }}>
      <div className="bg-dark-gradient min-h-screen">
        <nav className="fixed top-0 w-full bg-black/50 backdrop-blur-md border-b border-primary/20 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Droplets className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">FloodGuard AI</span>
            </div>
            <Link
              to="/dashboard"
              className="px-6 py-2 bg-ocean-gradient rounded-lg font-semibold hover:shadow-blue-glow transition-all duration-300"
            >
              Open Dashboard
            </Link>
          </div>
        </nav>

        <section className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              FloodGuard AI
            </h1>
            <p className="text-3xl md:text-4xl font-light mb-8" style={{ color: '#E6F1FF' }}>
              Predict. Prepare. Protect.
            </p>
            <p className="text-xl" style={{ color: 'rgba(230, 241, 255, 0.7)', maxWidth: '768px', margin: '0 auto' }}>
              Advanced flood prediction and management system leveraging AI to protect communities
              with real-time risk assessment and emergency response planning.
            </p>
            <div className="flex gap-4 justify-center mt-12">
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-ocean-gradient rounded-lg font-semibold text-lg hover:shadow-blue-glow transition-all duration-300 transform hover:scale-105"
              >
                Open Dashboard
              </Link>
              <a
                href="#features"
                className="px-8 py-4 border-2 border-primary rounded-lg font-semibold text-lg hover:bg-primary/10 transition-all duration-300"
              >
                View Demo
              </a>
            </div>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card-dark p-8 rounded-2xl border border-primary/20 hover:border-primary/50 hover:shadow-blue-glow transition-all duration-300">
                <Clock className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">24-72 Hr Forecast</h3>
                <p style={{ color: 'rgba(230, 241, 255, 0.7)' }}>
                  Advanced prediction models provide accurate flood risk forecasts up to 72 hours in advance.
                </p>
              </div>
              <div className="bg-card-dark p-8 rounded-2xl border border-secondary/20 hover:border-secondary/50 hover:shadow-cyan-glow transition-all duration-300">
                <MapPin className="w-12 h-12 text-secondary mb-4" />
                <h3 className="text-2xl font-bold mb-2">Micro-zone Risk Maps</h3>
                <p style={{ color: 'rgba(230, 241, 255, 0.7)' }}>
                  Interactive maps with zone-level risk assessment and real-time monitoring capabilities.
                </p>
              </div>
              <div className="bg-card-dark p-8 rounded-2xl border border-primary/20 hover:border-primary/50 hover:shadow-blue-glow transition-all duration-300">
                <Shield className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">Alert + Response Planner</h3>
                <p style={{ color: 'rgba(230, 241, 255, 0.7)' }}>
                  Automated alert systems with comprehensive evacuation plans and resource allocation.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-ocean-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Data Collection</h3>
                <p style={{ color: 'rgba(230, 241, 255, 0.7)' }}>
                  Aggregate real-time data from rainfall sensors, river gauges, and satellite imagery.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-ocean-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">AI Analysis</h3>
                <p style={{ color: 'rgba(230, 241, 255, 0.7)' }}>
                  Machine learning models analyze patterns and predict flood risk with high accuracy.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-ocean-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Action & Response</h3>
                <p style={{ color: 'rgba(230, 241, 255, 0.7)' }}>
                  Automated alerts and response plans help communities prepare and respond effectively.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 border-t border-primary/20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4 items-start">
                <Target className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Precise Risk Assessment</h3>
                  <p style={{ color: 'rgba(230, 241, 255, 0.7)' }}>
                    Zone-level risk calculation based on multiple environmental factors and historical data.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <AlertTriangle className="w-8 h-8 text-secondary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Early Warning System</h3>
                  <p style={{ color: 'rgba(230, 241, 255, 0.7)' }}>
                    Multi-channel alert system with SMS, email, and push notifications for timely warnings.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <MapPin className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Evacuation Routes</h3>
                  <p style={{ color: 'rgba(230, 241, 255, 0.7)' }}>
                    Optimized evacuation paths and shelter locations for efficient emergency response.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Shield className="w-8 h-8 text-secondary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Resource Management</h3>
                  <p style={{ color: 'rgba(230, 241, 255, 0.7)' }}>
                    Track and allocate emergency resources including shelters, medical supplies, and personnel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-12 px-6 border-t border-primary/20">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Droplets className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">FloodGuard AI</span>
            </div>
            <p style={{ color: 'rgba(230, 241, 255, 0.6)' }}>
              SDG 13: Climate Action - Flood Prediction & Management System
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
