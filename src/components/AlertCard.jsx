import React from 'react';
import { motion } from 'framer-motion';

const getSeverityStyles = (risk) => {
  switch (risk.toUpperCase()) {
    case 'LOW':
      return {
        borderLeft: 'border-l-4 border-risk-low',
        badgeClass: 'bg-risk-low/15 text-risk-low border-risk-low',
        wrapperClass: 'border-glass-border hover:border-risk-low/50',
      };
    case 'MEDIUM':
      return {
        borderLeft: 'border-l-4 border-risk-medium',
        badgeClass: 'bg-risk-medium/15 text-risk-medium border-risk-medium',
        wrapperClass: 'border-glass-border hover:border-risk-medium/50',
      };
    case 'HIGH':
      return {
        borderLeft: 'border-l-4 border-risk-high',
        badgeClass: 'bg-risk-high/15 text-risk-high border-risk-high',
        wrapperClass: 'border-glass-border hover:border-risk-high/50',
      };
    case 'CRITICAL':
      return {
        borderLeft: 'border-l-4 border-risk-critical',
        badgeClass: 'bg-risk-critical/20 text-red-500 border-risk-critical animate-[pulse_1.5s_infinite]',
        wrapperClass: 'border-risk-critical shadow-[0_0_15px_rgba(139,0,0,0.4)] animate-[critical-pulse_1.5s_infinite]',
      };
    default:
      return {
        borderLeft: 'border-l-4 border-accent-blue',
        badgeClass: 'bg-accent-blue/15 text-accent-blue border-accent-blue',
        wrapperClass: 'border-glass-border',
      };
  }
};

const AlertCard = ({ location, risk, probability, window, timestamp, rainfall }) => {
  const styles = getSeverityStyles(risk);
  
  // Create simple ascii bar for probability
  const filledBars = Math.round(probability / 10);
  const emptyBars = 10 - filledBars;
  const barString = '█'.repeat(filledBars) + '░'.repeat(emptyBars);

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className={`glass-panel p-6 rounded-xl flex flex-col gap-4 transition-all duration-300 ${styles.wrapperClass} ${styles.borderLeft}`}
    >
      <div className="flex justify-between items-start">
        <h3 className={`font-orbitron font-bold text-lg ${risk.toUpperCase() === 'CRITICAL' ? 'text-risk-high' : 'text-text-primary'}`}>
          {risk.toUpperCase() === 'CRITICAL' ? '⚠ CRITICAL FLOOD WARNING' : '⚠ FLOOD WARNING'}
        </h3>
        <span className={`px-2 py-1 text-xs font-bold rounded border ${styles.badgeClass}`}>
          [{risk.toUpperCase()}]
        </span>
      </div>

      <div className="h-px w-full bg-glass-border opacity-50 my-1"/>

      <div className="grid grid-cols-1 gap-2 font-space-grotesk font-semibold text-[15px] text-text-primary">
        <div className="flex items-center gap-2">
          <span>📍</span> <span>{location}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🔴</span> <span>Risk Level: {risk.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>📊</span> <span>Probability: {probability}% <span className="text-accent-cyan tracking-widest ml-1">{barString}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <span>⏱</span> <span>Impact Window: {window}</span>
        </div>
        {rainfall && (
          <div className="flex items-center gap-2">
            <span>🌧</span> <span>Rainfall: {rainfall}</span>
          </div>
        )}
      </div>

      <div className="h-px w-full bg-glass-border opacity-50 my-1"/>

      <div className="flex justify-between items-center mt-2">
        <span className="text-text-muted text-sm">{timestamp}</span>
        <div className="flex gap-3">
          <button className="text-accent-blue text-sm hover:underline font-medium">View on Map</button>
          <button className="text-accent-cyan text-sm hover:underline font-medium">Get Notified</button>
        </div>
      </div>
    </motion.div>
  );
};

export default AlertCard;
