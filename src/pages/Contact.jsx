import React from 'react';
import { motion } from 'framer-motion';

const team = [
  {
    name: "Hrishiraj Chowdhury",
    role: "Full Stack Developer",
    image: "/hrishi.png",
    phone: "+91 8766204806",
    email: "24cs2018@rgipt.ac.in",
    linkedin: "https://linkedin.com/in/hrishirajchowdhury/",
    github: "https://github.com/realhrishi"
  },
  {
    name: "Omika Singh",
    role: "Data Engineer",
    image: "/Omika.png",
    phone: "+91 8950084550",
    email: "24pp3005@rgipt.ac.in",
    linkedin: "https://www.linkedin.com/in/omikasingh/",
    github: "https://github.com"
  },
  {
    name: "Poorva Srivastava",
    role: "UI/UX Designer",
    image: "/poorva.png",
    phone: "+91 9140933837",
    email: "24ce3043@rgipt.ac.in",
    linkedin: "https://www.linkedin.com/in/poorva-srivastava/",
    github: "https://github.com"
  },
  {
    name: "Prasun Kumar",
    role: "ML Engineer",
    image: "/prasun.png",
    phone: "+91 8252711971",
    email: "24cs2029@rgipt.ac.in",
    linkedin: "https://www.linkedin.com/in/prasun-kumar-kp2813/",
    github: "https://github.com/Prasun-13"
  }
];

const Contact = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-[1200px] mx-auto px-6 py-12"
    >
      <div className="text-center mb-16">
        <h1 className="font-orbitron font-extrabold text-4xl mb-4 text-text-primary">Meet the Team</h1>
        <p className="font-space-grotesk text-text-muted">Binary Bandits — Innovating for a safer tomorrow.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {team.map((member, i) => (
          <motion.div
            key={i}
            className="card glass-panel p-8 rounded-2xl flex flex-col items-center text-center border-t-2 border-t-glass-border hover:border-t-accent-blue"
          >
            <img
              src={member.image}
              alt={member.name}
              className="team-avatar"
              onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`; }}
            />
            <h3 className="font-orbitron font-bold text-xl text-text-primary mb-1">{member.name}</h3>
            <p className="font-space-grotesk text-accent-cyan font-semibold text-sm mb-4">{member.role}</p>
            <div className="w-full h-px bg-glass-border mb-4 opacity-50" />

            <div className="font-space-grotesk text-sm text-text-muted space-y-2 mb-6">
              <div className="flex items-center justify-center gap-2"><span>📞</span> {member.phone}</div>
              <div className="flex items-center justify-center gap-2"><span>✉</span> {member.email}</div>
            </div>

            <div className="flex gap-4 w-full">
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="flex-1 w-full">
                <button className="profile-btn">LinkedIn</button>
              </a>
              <a href={member.github} target="_blank" rel="noopener noreferrer" className="flex-1 w-full">
                <button className="profile-btn">GitHub</button>
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="max-w-[600px] mx-auto glass-panel p-8 rounded-2xl text-center border border-accent-blue/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent-blue/5 z-0" />
        <div className="relative z-10">
          <h2 className="font-orbitron font-bold text-2xl text-text-primary mb-4">Partner with Us</h2>
          <p className="font-space-grotesk text-text-muted mb-6 text-sm">
            Are you a state disaster management authority or NGO? Connect with us to deploy FloodForge nodes in your region.
          </p>
          <a href="https://linkedin.com/in/hrishirajchowdhury/" target="_blank" rel="noopener noreferrer">
          <button className="btn-primary px-8">Send Inquiry</button>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;