import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ff_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally → redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ff_token');
      localStorage.removeItem('ff_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── AUTH ─────────────────────────────────────────────────────────────
export const authAPI = {
  signup: (name, email, password) =>
    api.post('/auth/signup', { name, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
};

// ─── USER ─────────────────────────────────────────────────────────────
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.post('/user/profile', data),
};

// ─── PREDICTIONS ──────────────────────────────────────────────────────
export const predictAPI = {
  predict: (data) => api.post('/predict', data),
  locationRisk: (city) => api.get(`/predict/location?city=${encodeURIComponent(city)}`),
};

// ─── ALERTS ───────────────────────────────────────────────────────────
export const alertAPI = {
  getMyAlerts: (params = {}) => api.get('/alerts', { params }),
  getAllAlerts: (params = {}) => api.get('/alerts/all', { params }),
  subscribeAlert: (location, state) => api.post('/alerts/subscribe', { location, state }),
  markRead: (alertId) => api.patch(`/alerts/${alertId}/read`),
};

// ─── LOCATIONS ────────────────────────────────────────────────────────
export const locationAPI = {
  search: (q) => api.get(`/location/search?q=${encodeURIComponent(q)}`),
  indiaOverview: () => api.get('/location/india-overview'),
};

export default api;
