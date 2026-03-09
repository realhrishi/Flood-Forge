import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Radar Map', path: '/radar' },
    { name: 'Alerts', path: '/alerts' },
    ...(isAuthenticated ? [{ name: 'Dashboard', path: '/dashboard' }] : []),
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="glass-nav sticky top-0 z-50 h-[72px] flex items-center w-full">
      <div className="max-w-[1400px] w-full mx-auto px-6 flex justify-between items-center">
        
        {/* Logo */}
        <NavLink to="/" className="text-3xl font-extrabold font-orbitron bg-clip-text text-transparent bg-gradient-to-br from-accent-blue to-accent-cyan tracking-wider">
          FloodForge
        </NavLink>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-all duration-300 relative ${
                  isActive ? 'text-accent-blue' : 'text-text-muted hover:text-accent-blue hover:drop-shadow-[0_0_12px_rgba(0,198,255,0.8)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="underline"
                      className="absolute left-0 top-full mt-1 h-[2px] w-full bg-accent-blue"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <NavLink to="/profile" className="btn-secondary py-2 px-4 text-sm">Profile</NavLink>
              <button onClick={handleLogout} className="py-2 px-4 text-sm font-orbitron font-bold rounded-lg border border-risk-high text-risk-high hover:bg-risk-high/10 transition-colors shadow-[0_0_15px_rgba(255,59,59,0.1)] hover:shadow-[0_0_20px_rgba(255,59,59,0.3)]">Sign Out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn-secondary py-2 px-4 text-sm">Login</NavLink>
              <NavLink to="/signup" className="btn-primary py-2 px-4 text-sm">Sign Up</NavLink>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button className="md:hidden text-text-primary focus:outline-none" onClick={toggleMenu}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 top-[72px] bg-bg-deep/95 backdrop-blur-xl z-40 flex flex-col p-6 border-t border-glass-border md:hidden"
          >
            <div className="flex flex-col space-y-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `text-xl font-medium ${isActive ? 'text-accent-blue' : 'text-text-primary'}`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
              <div className="h-px w-full bg-glass-border my-4" />
              {isAuthenticated ? (
                <>
                  <NavLink to="/profile" onClick={() => setIsOpen(false)} className="btn-secondary py-3 text-center text-lg">Profile</NavLink>
                  <button onClick={handleLogout} className="py-3 text-center text-lg font-orbitron font-bold rounded-lg border border-risk-high text-risk-high hover:bg-risk-high/10 transition-colors">Sign Out</button>
                </>
              ) : (
                <>
                  <NavLink to="/login" onClick={() => setIsOpen(false)} className="btn-secondary py-3 text-center text-lg">Login</NavLink>
                  <NavLink to="/signup" onClick={() => setIsOpen(false)} className="btn-primary py-3 text-center text-lg">Sign Up</NavLink>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
