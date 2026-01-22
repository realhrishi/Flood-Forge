import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Zone {
  id: string;
  zone_id: string;
  name: string;
  city: string;
  geometry: any;
  center_lat: number;
  center_lng: number;
  population: number;
  created_at: string;
  updated_at: string;
}

export interface Prediction {
  id: string;
  zone_id: string;
  risk_probability: number;
  severity: 'LOW' | 'MODERATE' | 'HIGH';
  time_to_impact_hours: number;
  rain_1h: number;
  rain_24h: number;
  river_level: number;
  soil_index: number;
  top_factors: string[];
  predicted_at: string;
  created_at: string;
}

export interface Alert {
  id: string;
  zone_id: string;
  severity: 'LOW' | 'MODERATE' | 'HIGH';
  message: string;
  status: 'TRIGGERED' | 'RESOLVED';
  triggered_at: string;
  resolved_at?: string;
  created_at: string;
}

export interface AnalyticsData {
  id: string;
  zone_id: string;
  timestamp: string;
  rainfall_mm: number;
  river_level_m: number;
  soil_moisture: number;
  created_at: string;
}

export interface Shelter {
  id: string;
  zone_id: string;
  name: string;
  capacity: number;
  current_occupancy: number;
  address: string;
  latitude: number;
  longitude: number;
  facilities: string[];
  contact?: string;
  created_at: string;
}
