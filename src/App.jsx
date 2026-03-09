import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import IntroAnimation from './pages/IntroAnimation';

import Home from './pages/Home';
import FloodMap from './pages/FloodMap';
import Alerts from './pages/Alerts';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';

function AppRoutes() {
  const location = useLocation();
  const hideNav = ['/login', '/signup'].includes(location.pathname);

  return (
    <>
      {!hideNav && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"         element={<Home />} />
          <Route path="/radar"    element={<FloodMap />} />
          <Route path="/alerts"   element={<Alerts />} />
          <Route path="/about"    element={<About />} />
          <Route path="/contact"  element={<Contact />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/signup"   element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </AnimatePresence>
      {!hideNav && <Footer />}
    </>
  );
}

export default function App() {
  const introSeen = localStorage.getItem('ff_intro_seen');

  return (
    <AuthProvider>
      <BrowserRouter>
        {!introSeen && <IntroAnimation />}
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
