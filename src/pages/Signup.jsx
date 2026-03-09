import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

function PasswordStrength({ password }) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#FF3B3B', '#F1C40F', '#FFB703', '#2ECC71'];
  return password ? (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= score ? colors[score] : 'rgba(255,255,255,0.1)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      <span style={{ fontSize: 12, color: colors[score], fontFamily: 'Space Grotesk' }}>
        {labels[score]}
      </span>
    </div>
  ) : null;
}

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
    borderRadius: 8, color: 'var(--text-primary)', fontFamily: 'Space Grotesk', fontSize: 15,
    outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = { fontFamily: 'Space Grotesk', color: 'var(--text-muted)', fontSize: 13, display: 'block', marginBottom: 8 };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-void)', padding: 24 }}
    >
      <div style={{
        width: '100%', maxWidth: 460,
        background: 'var(--glass-bg)', backdropFilter: 'blur(12px)',
        border: '1px solid var(--glass-border)', borderRadius: 12, padding: 40,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'Orbitron', color: 'var(--accent-blue)', fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
            Join FloodForge
          </h1>
          <p style={{ fontFamily: 'Space Grotesk', color: 'var(--text-muted)' }}>
            Create your account to start monitoring
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(255,59,59,0.1)', border: '1px solid #FF3B3B',
            borderRadius: 8, padding: '12px 16px', color: '#FF3B3B',
            fontFamily: 'Space Grotesk', marginBottom: 20, fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { field: 'name', label: 'FULL NAME', type: 'text', placeholder: 'Your full name' },
            { field: 'email', label: 'EMAIL', type: 'email', placeholder: 'you@example.com' },
          ].map(({ field, label, type, placeholder }) => (
            <div key={field} style={{ marginBottom: 20 }}>
              <label style={labelStyle}>{label}</label>
              <input type={type} value={form[field]} onChange={update(field)}
                required placeholder={placeholder} style={inputStyle} />
            </div>
          ))}

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>PASSWORD</label>
            <input type="password" value={form.password} onChange={update('password')}
              required placeholder="Min 8 characters" style={inputStyle} />
            <PasswordStrength password={form.password} />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>CONFIRM PASSWORD</label>
            <input type="password" value={form.confirm} onChange={update('confirm')}
              required placeholder="Repeat password" style={inputStyle} />
          </div>

          <button type="submit" disabled={loading}
            style={{
              width: '100%', padding: '14px',
              background: loading ? 'rgba(45, 212, 191, 0.4)' : 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))',
              border: 'none', borderRadius: 8, color: 'var(--bg-void)',
              fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}>
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontFamily: 'Space Grotesk', color: 'var(--text-muted)', fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 600 }}>
            Sign In →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
