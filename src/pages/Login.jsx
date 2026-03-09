import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="min-h-screen flex"
      style={{ background: 'var(--bg-void)' }}
    >
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-3/5 items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--bg-void), var(--bg-deep))' }}>
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <h1 style={{ fontFamily: 'Orbitron', fontSize: 56, fontWeight: 800, color: 'var(--accent-blue)',
            textShadow: '0 0 40px rgba(45,212,191,0.6)', letterSpacing: 4 }}>
            FloodForge
          </h1>
          <p style={{ fontFamily: 'Space Grotesk', color: 'var(--text-muted)', fontSize: 20, marginTop: 16, letterSpacing: 2 }}>
            Monitor. Predict. Protect.
          </p>
        </div>
        {/* Animated radar rings */}
        {[1,2,3].map(i => (
          <div key={i} style={{
            position: 'absolute', borderRadius: '50%',
            border: '1px solid var(--glass-border)',
            width: `${i * 200}px`, height: `${i * 200}px`,
            animation: `pulse ${i * 1.5 + 1}s ease-out infinite`,
            top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          }} />
        ))}
        <style>{`@keyframes pulse { 0%{opacity:0.6;transform:translate(-50%,-50%) scale(1)} 100%{opacity:0;transform:translate(-50%,-50%) scale(1.4)} }`}</style>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8">
        <div style={{
          width: '100%', maxWidth: 420,
          background: 'var(--glass-bg)', backdropFilter: 'blur(12px)',
          border: '1px solid var(--glass-border)', borderRadius: 12, padding: 40,
        }}>
          <h2 style={{ fontFamily: 'Orbitron', color: 'var(--text-primary)', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            Welcome Back
          </h2>
          <p style={{ fontFamily: 'Space Grotesk', color: 'var(--text-muted)', marginBottom: 32 }}>
            Sign in to your monitoring dashboard
          </p>

          {error && (
            <div style={{ background: 'rgba(255,59,59,0.1)', border: '1px solid #FF3B3B',
              borderRadius: 8, padding: '12px 16px', color: '#FF3B3B',
              fontFamily: 'Space Grotesk', marginBottom: 20, fontSize: 14 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontFamily: 'Space Grotesk', color: 'var(--text-muted)', fontSize: 13, display: 'block', marginBottom: 8 }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="you@example.com"
                style={{
                  width: '100%', padding: '13px 16px',
                  background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                  borderRadius: 8, color: 'var(--text-primary)', fontFamily: 'Space Grotesk', fontSize: 15,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ marginBottom: 28, position: 'relative' }}>
              <label style={{ fontFamily: 'Space Grotesk', color: 'var(--text-muted)', fontSize: 13, display: 'block', marginBottom: 8 }}>
                PASSWORD
              </label>
              <input
                type={showPass ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)}
                required placeholder="••••••••"
                style={{
                  width: '100%', padding: '13px 48px 13px 16px',
                  background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                  borderRadius: 8, color: 'var(--text-primary)', fontFamily: 'Space Grotesk', fontSize: 15,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 14, top: 42, background: 'none',
                  border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16 }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>

            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? 'rgba(45, 212, 191, 0.4)' : 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))',
                border: 'none', borderRadius: 8, color: 'var(--bg-void)',
                fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
              }}>
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, fontFamily: 'Space Grotesk', color: 'var(--text-muted)', fontSize: 14 }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 600 }}>
              Sign Up →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
