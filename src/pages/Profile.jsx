import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { INDIA_DISTRICTS } from '../data/indiaDistricts';
import { detectUserLocation } from "../utils/locationService";

const INDIAN_STATES = Object.keys(INDIA_DISTRICTS);

export default function Profile() {

  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    phone: '',
    city: '',
    state: '',
    country: 'India',
    address: '',
    alert_dashboard: true,
    alert_email: true,
    alert_sms: false,
  });

  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Load user data
  useEffect(() => {

    if (user) {

      const state = user.state || '';

      setForm(f => ({
        ...f,
        phone: user.phone || '',
        city: user.city || '',
        state: state,
        country: user.country || 'India',
        address: user.address || '',
      }));

      if (state && INDIA_DISTRICTS[state]) {
        setDistricts(INDIA_DISTRICTS[state]);
      }

    }

  }, [user]);

  // Update form fields
  const update = (field) => (e) =>
    setForm({
      ...form,
      [field]: e.target.type === 'checkbox'
        ? e.target.checked
        : e.target.value
    });

  // Handle state change
  const handleStateChange = (e) => {

    const state = e.target.value;

    setForm({
      ...form,
      state: state,
      city: ''
    });

    setDistricts(INDIA_DISTRICTS[state] || []);

  };

  // ⭐ AUTO DETECT LOCATION (GPS)
  const autoDetectLocation = async () => {

    try {

      const loc = await detectUserLocation();

      const detectedState = loc.state;
      const detectedDistrict = loc.district;

      const newDistricts = INDIA_DISTRICTS[detectedState] || [];

      setDistricts(newDistricts);

      setForm({
        ...form,
        state: detectedState,
        city: detectedDistrict,
        country: "India"
      });

    } catch (err) {

      console.error(err);
      alert("Unable to detect location");

    }

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError('');
    setSuccess(false);

    try {

      const res = await userAPI.updateProfile(form);

      updateUser(res.data);

      setSuccess(true);

      setTimeout(() => navigate('/dashboard'), 1500);

    } catch (err) {

      setError(
        err.response?.data?.detail ||
        'Failed to save profile.'
      );

    } finally {

      setLoading(false);

    }

  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: 'var(--glass-bg)',
    border: '1px solid var(--glass-border)',
    borderRadius: 8,
    color: 'var(--text-primary)',
    fontFamily: 'Space Grotesk',
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh',
        background: 'var(--bg-void)',
        padding: '80px 24px',
        paddingTop: 100
      }}
    >

      <div style={{ maxWidth: 560, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{
            fontFamily: 'Orbitron',
            color: 'var(--accent-blue)',
            fontSize: 32,
            fontWeight: 700
          }}>
            Complete Your Profile
          </h1>

          <p style={{
            fontFamily: 'Space Grotesk',
            color: 'var(--text-muted)',
            marginTop: 12
          }}>
            We use this to send you location-specific flood alerts
          </p>
        </div>

        {success && (
          <div style={{
            background: 'rgba(46,204,113,0.1)',
            border: '1px solid #2ECC71',
            borderRadius: 8,
            padding: '14px 20px',
            color: '#2ECC71',
            fontFamily: 'Space Grotesk',
            marginBottom: 24,
            textAlign: 'center'
          }}>
            ✓ Profile saved! Redirecting to dashboard...
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(255,59,59,0.1)',
            border: '1px solid #FF3B3B',
            borderRadius: 8,
            padding: '14px 20px',
            color: '#FF3B3B',
            fontFamily: 'Space Grotesk',
            marginBottom: 24
          }}>
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--glass-border)',
            borderRadius: 12,
            padding: 36
          }}
        >

          {/* PHONE */}

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontFamily: 'Space Grotesk', color: 'var(--text-muted)', fontSize: 13, display: 'block', marginBottom: 8 }}>
              PHONE NUMBER
            </label>

            <input
              type="tel"
              value={form.phone}
              onChange={update('phone')}
              placeholder="+91 XXXXXXXXXX"
              style={inputStyle}
            />
          </div>

          {/* STATE + DISTRICT */}

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            marginBottom: 10
          }}>

            {/* DISTRICT */}

            <div>
              <label style={{ fontFamily: 'Space Grotesk', color: 'var(--text-muted)', fontSize: 13, display: 'block', marginBottom: 8 }}>
                DISTRICT
              </label>

              <select
                value={form.city}
                onChange={update('city')}
                required
                style={{ ...inputStyle, cursor: 'pointer' }}
              >

                <option value="">Select District</option>

                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}

              </select>
            </div>

            {/* STATE */}

            <div>
              <label style={{ fontFamily: 'Space Grotesk', color: 'var(--text-muted)', fontSize: 13, display: 'block', marginBottom: 8 }}>
                STATE / UNION TERRITORY
              </label>

              <select
                value={form.state}
                onChange={handleStateChange}
                required
                style={{ ...inputStyle, cursor: 'pointer' }}
              >

                <option value="">Select State / UT</option>

                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}

              </select>

            </div>

          </div>

          {/* AUTO DETECT BUTTON */}

          <button
            type="button"
            onClick={autoDetectLocation}
            style={{
              marginBottom: 20,
              width: "100%",
              padding: "10px",
              borderRadius: 6,
              border: "1px solid var(--accent-blue)",
              background: "transparent",
              color: "var(--accent-blue)",
              cursor: "pointer",
              fontFamily: "Space Grotesk"
            }}
          >
            USE CURRENT LOCATION
          </button>

          {/* COUNTRY */}

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontFamily: 'Space Grotesk', color: 'var(--text-muted)', fontSize: 13, display: 'block', marginBottom: 8 }}>
              COUNTRY
            </label>

            <input
              type="text"
              value={form.country}
              onChange={update('country')}
              style={inputStyle}
            />
          </div>

          {/* ADDRESS */}

          <div style={{ marginBottom: 28 }}>
            <label style={{ fontFamily: 'Space Grotesk', color: 'var(--text-muted)', fontSize: 13, display: 'block', marginBottom: 8 }}>
              FULL ADDRESS
            </label>

            <textarea
              value={form.address}
              onChange={update('address')}
              rows={3}
              placeholder="Street, locality, PIN code..."
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* ALERT PREFERENCES */}

          <div style={{ marginBottom: 28 }}>
            <label style={{
              fontFamily: 'Space Grotesk', color: 'var(--text-muted)',
              fontSize: 13, display: 'block', marginBottom: 14, letterSpacing: 1,
            }}>
              ALERT PREFERENCES <span style={{ opacity: 0.5, fontWeight: 400 }}>(optional)</span>
            </label>

            {[
              { field: 'alert_dashboard', label: 'Receive alerts through website' },
              { field: 'alert_email',     label: 'Receive alerts through email' },
              { field: 'alert_sms',       label: 'Receive alerts through phone number' },
            ].map(({ field, label, icon }) => (
              <label
                key={field}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', marginBottom: 10,
                  background: form[field] ? 'rgba(45,212,191,0.07)' : 'var(--glass-bg)',
                  border: `1px solid ${form[field] ? 'rgba(45,212,191,0.35)' : 'var(--glass-border)'}`,
                  borderRadius: 8, cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <input
                  type="checkbox"
                  checked={form[field]}
                  onChange={update(field)}
                  style={{ display: 'none' }}
                />
                {/* Custom styled checkbox */}
                <div style={{
                  width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                  border: `2px solid ${form[field] ? 'var(--accent-blue)' : 'var(--glass-border)'}`,
                  background: form[field] ? 'var(--accent-blue)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}>
                  {form[field] && (
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <polyline points="2,6 5,9 10,3" stroke="#050816" strokeWidth="2.2"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{
                  fontFamily: 'Space Grotesk', fontSize: 14,
                  color: form[field] ? 'var(--text-primary)' : 'var(--text-muted)',
                  transition: 'color 0.2s',
                }}>
                  {label}
                </span>
              </label>
            ))}
          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              background: loading
                ? 'rgba(45, 212, 191, 0.4)'
                : 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))',
              border: 'none',
              borderRadius: 8,
              color: 'var(--bg-void)',
              fontFamily: 'Space Grotesk',
              fontWeight: 700,
              fontSize: 16,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >

            {loading
              ? 'SAVING...'
              : 'SAVE PROFILE & START MONITORING →'}

          </button>

        </form>

      </div>

    </motion.div>

  );
}