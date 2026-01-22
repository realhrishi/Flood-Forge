import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import RiskMap from './pages/RiskMap';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';
import ResponsePlanner from './pages/ResponsePlanner';
import DataSources from './pages/DataSources';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/map" element={<RiskMap />} />
        <Route path="/dashboard/analytics" element={<Analytics />} />
        <Route path="/dashboard/alerts" element={<Alerts />} />
        <Route path="/dashboard/response" element={<ResponsePlanner />} />
        <Route path="/dashboard/sources" element={<DataSources />} />
        <Route path="/dashboard/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
