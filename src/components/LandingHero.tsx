import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Shield, Map, Bell, ArrowRight, Waves, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingHero = () => {
  return (
    <section className="relative min-h-screen ocean-gradient-bg overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-6 pt-32 pb-20">
        {/* Hero Content */}
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Activity className="w-4 h-4" />
              SDG 13: Climate Action
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="text-foreground">FloodForge</span>
            <br />
            <span className="gradient-text">Predict. Prepare. Protect.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            AI-powered flood prediction and management system. Get real-time risk assessments, 
            early warnings, and actionable response plans to protect your community.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild variant="hero" size="xl">
              <Link to="/dashboard">
                Open Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="heroOutline" size="xl">
              <Link to="/dashboard/map">
                View Risk Map
                <Map className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-24 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          <StatCard
            icon={<Waves className="w-8 h-8" />}
            title="24–72 Hr Forecast"
            description="Advanced prediction models analyzing multiple data sources for accurate flood forecasting"
            delay={0.6}
          />
          <StatCard
            icon={<Map className="w-8 h-8" />}
            title="Micro-zone Risk Maps"
            description="Granular risk assessment down to neighborhood level with real-time updates"
            delay={0.7}
          />
          <StatCard
            icon={<Bell className="w-8 h-8" />}
            title="Alert + Response Planner"
            description="Automated alerts with comprehensive evacuation and resource management plans"
            delay={0.8}
          />
        </motion.div>
      </div>
    </section>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const StatCard = ({ icon, title, description, delay }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="glass-card-hover p-8 text-center group"
  >
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6 group-hover:bg-primary/20 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </motion.div>
);

export default LandingHero;
