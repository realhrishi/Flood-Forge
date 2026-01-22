export interface Zone {
  id: string;
  name: string;
  center: [number, number];
  bounds: [number, number][];
  riskLevel: 'low' | 'moderate' | 'high';
  riskProbability: number;
  severity: string;
  timeToImpact: number;
  topFactors: string[];
  population: number;
  lastUpdated: string;
}

export const zones: Zone[] = [
  {
    id: "ZONE_001",
    name: "Downtown Riverfront",
    center: [28.6139, 77.2090],
    bounds: [[28.61, 77.20], [28.62, 77.21], [28.62, 77.22], [28.61, 77.22]],
    riskLevel: 'high',
    riskProbability: 0.87,
    severity: 'HIGH',
    timeToImpact: 4,
    topFactors: ['Heavy rainfall', 'River overflow risk', 'Drainage saturation'],
    population: 45000,
    lastUpdated: new Date().toISOString()
  },
  {
    id: "ZONE_002",
    name: "Industrial District",
    center: [28.6239, 77.2190],
    bounds: [[28.62, 77.21], [28.63, 77.22], [28.63, 77.23], [28.62, 77.23]],
    riskLevel: 'moderate',
    riskProbability: 0.54,
    severity: 'MODERATE',
    timeToImpact: 12,
    topFactors: ['Upstream water flow', 'Soil saturation'],
    population: 28000,
    lastUpdated: new Date().toISOString()
  },
  {
    id: "ZONE_003",
    name: "Residential Heights",
    center: [28.6039, 77.1990],
    bounds: [[28.60, 77.19], [28.61, 77.20], [28.61, 77.21], [28.60, 77.21]],
    riskLevel: 'low',
    riskProbability: 0.18,
    severity: 'LOW',
    timeToImpact: 48,
    topFactors: ['Elevated terrain', 'Good drainage'],
    population: 62000,
    lastUpdated: new Date().toISOString()
  },
  {
    id: "ZONE_004",
    name: "Lake View Area",
    center: [28.6339, 77.2290],
    bounds: [[28.63, 77.22], [28.64, 77.23], [28.64, 77.24], [28.63, 77.24]],
    riskLevel: 'high',
    riskProbability: 0.79,
    severity: 'HIGH',
    timeToImpact: 6,
    topFactors: ['Lake level rising', 'Backflow risk', 'Low elevation'],
    population: 35000,
    lastUpdated: new Date().toISOString()
  },
  {
    id: "ZONE_005",
    name: "Commercial Hub",
    center: [28.5939, 77.2090],
    bounds: [[28.59, 77.20], [28.60, 77.21], [28.60, 77.22], [28.59, 77.22]],
    riskLevel: 'moderate',
    riskProbability: 0.42,
    severity: 'MODERATE',
    timeToImpact: 18,
    topFactors: ['Urban runoff', 'Concrete coverage'],
    population: 52000,
    lastUpdated: new Date().toISOString()
  },
  {
    id: "ZONE_006",
    name: "Green Valley",
    center: [28.5839, 77.1890],
    bounds: [[28.58, 77.18], [28.59, 77.19], [28.59, 77.20], [28.58, 77.20]],
    riskLevel: 'low',
    riskProbability: 0.12,
    severity: 'LOW',
    timeToImpact: 72,
    topFactors: ['Natural absorption', 'Away from water bodies'],
    population: 18000,
    lastUpdated: new Date().toISOString()
  },
  {
    id: "ZONE_007",
    name: "Harbor District",
    center: [28.6439, 77.2390],
    bounds: [[28.64, 77.23], [28.65, 77.24], [28.65, 77.25], [28.64, 77.25]],
    riskLevel: 'high',
    riskProbability: 0.91,
    severity: 'CRITICAL',
    timeToImpact: 2,
    topFactors: ['Storm surge', 'Tide levels', 'Infrastructure age'],
    population: 22000,
    lastUpdated: new Date().toISOString()
  }
];

export const rainfallData = [
  { time: '00:00', rainfall: 2.1, predicted: 2.0 },
  { time: '02:00', rainfall: 3.4, predicted: 3.2 },
  { time: '04:00', rainfall: 5.8, predicted: 5.5 },
  { time: '06:00', rainfall: 12.3, predicted: 11.0 },
  { time: '08:00', rainfall: 18.7, predicted: 16.5 },
  { time: '10:00', rainfall: 22.1, predicted: 20.0 },
  { time: '12:00', rainfall: 15.4, predicted: 18.0 },
  { time: '14:00', rainfall: 8.9, predicted: 12.0 },
  { time: '16:00', rainfall: 6.2, predicted: 8.0 },
  { time: '18:00', rainfall: 4.5, predicted: 5.5 },
  { time: '20:00', rainfall: 3.1, predicted: 4.0 },
  { time: '22:00', rainfall: 2.8, predicted: 3.0 },
];

export const riskForecastData = [
  { hour: 'Now', zone1: 87, zone2: 54, zone3: 18 },
  { hour: '+6h', zone1: 82, zone2: 58, zone3: 22 },
  { hour: '+12h', zone1: 78, zone2: 62, zone3: 28 },
  { hour: '+24h', zone1: 65, zone2: 55, zone3: 32 },
  { hour: '+48h', zone1: 45, zone2: 42, zone3: 25 },
  { hour: '+72h', zone1: 32, zone2: 35, zone3: 18 },
];

export const severityDistribution = [
  { zone: 'Downtown', high: 35, moderate: 45, low: 20 },
  { zone: 'Industrial', high: 15, moderate: 55, low: 30 },
  { zone: 'Residential', high: 5, moderate: 25, low: 70 },
  { zone: 'Lake View', high: 40, moderate: 40, low: 20 },
  { zone: 'Commercial', high: 20, moderate: 50, low: 30 },
];

export interface Alert {
  id: string;
  zoneId: string;
  zoneName: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  message: string;
  timestamp: string;
  status: 'triggered' | 'resolved';
  riskProbability: number;
}

export const alerts: Alert[] = [
  {
    id: 'ALT_001',
    zoneId: 'ZONE_007',
    zoneName: 'Harbor District',
    severity: 'critical',
    message: 'Immediate flood risk detected. Storm surge expected in 2 hours.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    status: 'triggered',
    riskProbability: 0.91
  },
  {
    id: 'ALT_002',
    zoneId: 'ZONE_001',
    zoneName: 'Downtown Riverfront',
    severity: 'high',
    message: 'River levels approaching critical threshold. Monitor closely.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: 'triggered',
    riskProbability: 0.87
  },
  {
    id: 'ALT_003',
    zoneId: 'ZONE_004',
    zoneName: 'Lake View Area',
    severity: 'high',
    message: 'Lake overflow risk increasing due to continuous rainfall.',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    status: 'triggered',
    riskProbability: 0.79
  },
  {
    id: 'ALT_004',
    zoneId: 'ZONE_002',
    zoneName: 'Industrial District',
    severity: 'moderate',
    message: 'Drainage capacity at 75%. Monitoring situation.',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    status: 'resolved',
    riskProbability: 0.54
  },
];

export const shelters = [
  { id: 1, name: 'Central Community Hall', capacity: 500, distance: '1.2 km', available: true },
  { id: 2, name: 'Metro Sports Complex', capacity: 1200, distance: '2.8 km', available: true },
  { id: 3, name: 'Government School #12', capacity: 350, distance: '0.8 km', available: true },
  { id: 4, name: 'District Hospital Annex', capacity: 200, distance: '3.5 km', available: false },
  { id: 5, name: 'Railway Station Hall', capacity: 800, distance: '4.2 km', available: true },
];

export const resources = [
  { id: 1, name: 'Rescue Boats', required: 15, available: 12, unit: 'units' },
  { id: 2, name: 'Medical Kits', required: 500, available: 480, unit: 'kits' },
  { id: 3, name: 'Drinking Water', required: 10000, available: 8500, unit: 'liters' },
  { id: 4, name: 'Ambulances', required: 8, available: 6, unit: 'vehicles' },
  { id: 5, name: 'Emergency Rations', required: 2000, available: 2200, unit: 'packets' },
  { id: 6, name: 'Blankets', required: 1000, available: 750, unit: 'pieces' },
];

export const dataSources = [
  {
    id: 1,
    name: 'NASA GPM Rainfall',
    description: 'Global Precipitation Measurement satellite data',
    status: 'active',
    lastSync: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    accuracy: 94
  },
  {
    id: 2,
    name: 'IMD Weather Data',
    description: 'India Meteorological Department real-time forecasts',
    status: 'active',
    lastSync: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    accuracy: 91
  },
  {
    id: 3,
    name: 'Historical Flood Records',
    description: '50+ years of flood event data for pattern analysis',
    status: 'active',
    lastSync: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    accuracy: 88
  },
  {
    id: 4,
    name: 'River Gauge Network',
    description: 'Real-time water level sensors across major rivers',
    status: 'active',
    lastSync: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    accuracy: 97
  },
  {
    id: 5,
    name: 'Soil Moisture Index',
    description: 'Ground saturation levels from IoT sensor network',
    status: 'maintenance',
    lastSync: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    accuracy: 85
  },
];
