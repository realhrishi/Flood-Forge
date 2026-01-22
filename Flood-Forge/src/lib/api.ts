import { supabase, Zone, Prediction, Alert, AnalyticsData, Shelter } from './supabase';

export const api = {
  async getZones(): Promise<Zone[]> {
    const { data, error } = await supabase
      .from('zones')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getZoneById(zoneId: string): Promise<Zone | null> {
    const { data, error } = await supabase
      .from('zones')
      .select('*')
      .eq('id', zoneId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getLatestPredictions(limit = 10): Promise<Prediction[]> {
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .order('predicted_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async getPredictionsByZone(zoneId: string): Promise<Prediction[]> {
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('zone_id', zoneId)
      .order('predicted_at', { ascending: false })
      .limit(24);

    if (error) throw error;
    return data || [];
  },

  async createPrediction(prediction: Omit<Prediction, 'id' | 'created_at' | 'predicted_at'>): Promise<Prediction> {
    const { data, error } = await supabase
      .from('predictions')
      .insert([prediction])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async predictRisk(params: {
    zone_id: string;
    rain_1h: number;
    rain_24h: number;
    river_level: number;
    soil_index: number;
  }): Promise<Prediction> {
    const { zone_id, rain_1h, rain_24h, river_level, soil_index } = params;

    let riskScore = 0;
    const topFactors: string[] = [];

    if (rain_1h > 15) {
      riskScore += 0.3;
      topFactors.push('Heavy rainfall detected');
    }
    if (rain_24h > 100) {
      riskScore += 0.25;
      topFactors.push('24-hour rainfall overload');
    }
    if (river_level > 4.0) {
      riskScore += 0.25;
      topFactors.push('Elevated river levels');
    }
    if (soil_index > 0.7) {
      riskScore += 0.2;
      topFactors.push('High soil saturation');
    }

    const risk_probability = Math.min(riskScore, 1.0);
    let severity: 'LOW' | 'MODERATE' | 'HIGH';
    let time_to_impact_hours: number;

    if (risk_probability < 0.3) {
      severity = 'LOW';
      time_to_impact_hours = 48;
    } else if (risk_probability < 0.7) {
      severity = 'MODERATE';
      time_to_impact_hours = 24;
    } else {
      severity = 'HIGH';
      time_to_impact_hours = 6;
    }

    if (topFactors.length === 0) {
      topFactors.push('Normal conditions');
    }

    const prediction = await this.createPrediction({
      zone_id,
      risk_probability,
      severity,
      time_to_impact_hours,
      rain_1h,
      rain_24h,
      river_level,
      soil_index,
      top_factors: topFactors,
    });

    if (severity === 'HIGH' || severity === 'MODERATE') {
      await this.createAlert({
        zone_id,
        severity,
        message: `${severity} flood risk detected in zone. Risk probability: ${(risk_probability * 100).toFixed(0)}%`,
        status: 'TRIGGERED',
      });
    }

    return prediction;
  },

  async getAlerts(status?: 'TRIGGERED' | 'RESOLVED'): Promise<Alert[]> {
    let query = supabase
      .from('alerts')
      .select('*')
      .order('triggered_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createAlert(alert: Omit<Alert, 'id' | 'created_at' | 'triggered_at'>): Promise<Alert> {
    const { data, error } = await supabase
      .from('alerts')
      .insert([alert])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async resolveAlert(alertId: string): Promise<Alert> {
    const { data, error } = await supabase
      .from('alerts')
      .update({ status: 'RESOLVED', resolved_at: new Date().toISOString() })
      .eq('id', alertId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAnalyticsData(zoneId: string, hours = 24): Promise<AnalyticsData[]> {
    const since = new Date();
    since.setHours(since.getHours() - hours);

    const { data, error } = await supabase
      .from('analytics_data')
      .select('*')
      .eq('zone_id', zoneId)
      .gte('timestamp', since.toISOString())
      .order('timestamp', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getShelters(zoneId?: string): Promise<Shelter[]> {
    let query = supabase
      .from('shelters')
      .select('*')
      .order('name');

    if (zoneId) {
      query = query.eq('zone_id', zoneId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async updateShelterOccupancy(shelterId: string, occupancy: number): Promise<Shelter> {
    const { data, error } = await supabase
      .from('shelters')
      .update({ current_occupancy: occupancy })
      .eq('id', shelterId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
