import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-[1200px] mx-auto px-6 py-12"
    >
      <div className="text-center mb-16">
        <h1 className="font-orbitron font-extrabold text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-accent-cyan inline-block pb-2 mb-4">
          About FloodForge
        </h1>
        <p className="font-space-grotesk text-lg text-text-muted max-w-2xl mx-auto">
          Built for Chemathon 2026 by Team Binary Bandits. An AI-driven early warning system designed to protect vulnerable communities.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-2xl mb-12 border-t-2 border-t-accent-blue">
        <h2 className="font-orbitron text-2xl font-bold mb-4 text-text-primary">Project Overview</h2>
        <p className="font-space-grotesk text-text-muted leading-relaxed mb-6">
          FloodForge ingests live environmental data (rainfall, river levels, soil moisture) and processes it through an advanced Random Forest and XGBoost machine learning model. By simulating future flow paths, we deliver 24-72 hour accurate predictions to warn authorities and citizens well before disaster strikes.
        </p>
        
        <div className="flex items-center gap-4 bg-bg-surface p-4 rounded-xl border border-glass-border">
          <div className="w-12 h-12 flex items-center justify-center bg-risk-low/20 rounded-full border border-risk-low/50 text-2xl shadow-[0_0_10px_rgba(46,204,113,0.3)]">
             🌍
          </div>
          <div>
            <h4 className="font-orbitron font-bold text-text-primary text-sm">SDG 13: Climate Action</h4>
            <p className="font-space-grotesk text-xs text-text-muted mt-1">Driving resilience and adaptive capacity against climate-related hazards.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="glass-panel p-8 rounded-2xl">
          <h2 className="font-orbitron text-2xl font-bold mb-6 text-text-primary">System Architecture</h2>
          <div className="flex flex-col gap-4 font-space-grotesk text-sm">
            <div className="bg-bg-surface p-4 rounded border border-glass-border flex justify-between items-center text-accent-blue font-semibold border-l-4 border-l-accent-blue">
              <span>Data Ingestion API</span>
              <span className="text-xl">📡</span>
            </div>
            <div className="mx-auto h-6 w-px bg-glass-border" />
            <div className="bg-bg-surface p-4 rounded border border-glass-border flex justify-between items-center text-accent-cyan font-semibold border-l-4 border-l-accent-cyan">
              <span>FastAPI + XGBoost Engine + Random Forest Engine</span>
              <span className="text-xl">⚙️</span>
            </div>
            <div className="mx-auto h-6 w-px bg-glass-border" />
            <div className="bg-bg-surface p-4 rounded border border-glass-border flex justify-between items-center text-risk-medium font-semibold border-l-4 border-l-risk-medium">
              <span>Supabase Database Layers</span>
              <span className="text-xl">🗄️</span>
            </div>
            <div className="mx-auto h-6 w-px bg-glass-border" />
            <div className="bg-bg-surface p-4 rounded border border-glass-border flex justify-between items-center text-risk-low font-semibold border-l-4 border-l-risk-low">
              <span>React Warning Dashboard</span>
              <span className="text-xl">💻</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="glass-panel p-8 rounded-2xl flex-1 border-t border-t-risk-high/50">
            <h2 className="font-orbitron text-2xl font-bold mb-4 text-text-primary">Tech Stack</h2>
            <div className="grid grid-cols-2 gap-4">
              {['React.js & TailwindCSS', 'Three.js & Leaflet', 'FastAPI & Python', 'Random Forest & XGBoost', 'Supabase & Postgres', 'Vercel Deployment'].map(tech => (
                <div key={tech} className="bg-bg-surface p-3 rounded-lg border border-glass-border text-center font-space-grotesk text-xs text-text-muted">
                  {tech}
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel p-8 rounded-2xl flex-1 border-b border-b-accent-blue text-center flex flex-col justify-center items-center">
             <h2 className="font-orbitron text-xl font-bold mb-2 text-text-primary">Hackathon Context</h2>
             <p className="font-space-grotesk text-sm text-text-muted">Developed rapidly over 72 hours for Chemathon 2026. Codebase is open-source.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
