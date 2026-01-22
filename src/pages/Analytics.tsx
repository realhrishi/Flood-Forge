import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { rainfallData, riskForecastData, severityDistribution } from '@/data/zones';
import { Droplets, TrendingUp, BarChart3 } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Historical trends and forecasting data</p>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Rainfall Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Rainfall Trend</h3>
              <p className="text-sm text-muted-foreground">Last 24 hours</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rainfallData}>
                <defs>
                  <linearGradient id="rainfallGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(210, 100%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(210, 100%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 30%, 15%)" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(210, 30%, 60%)" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(210, 30%, 60%)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}mm`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(220, 30%, 7%)',
                    border: '1px solid hsl(220, 30%, 15%)',
                    borderRadius: '8px',
                    color: 'hsl(210, 100%, 95%)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rainfall"
                  stroke="hsl(210, 100%, 50%)"
                  strokeWidth={2}
                  fill="url(#rainfallGradient)"
                  name="Actual Rainfall"
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="hsl(190, 100%, 44%)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Predicted"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Risk Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Risk Forecast</h3>
              <p className="text-sm text-muted-foreground">Next 72 hours</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskForecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 30%, 15%)" />
                <XAxis 
                  dataKey="hour" 
                  stroke="hsl(210, 30%, 60%)" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(210, 30%, 60%)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(220, 30%, 7%)',
                    border: '1px solid hsl(220, 30%, 15%)',
                    borderRadius: '8px',
                    color: 'hsl(210, 100%, 95%)',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="zone1"
                  stroke="hsl(0, 84%, 60%)"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(0, 84%, 60%)' }}
                  name="Downtown Riverfront"
                />
                <Line
                  type="monotone"
                  dataKey="zone2"
                  stroke="hsl(45, 100%, 50%)"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(45, 100%, 50%)' }}
                  name="Industrial District"
                />
                <Line
                  type="monotone"
                  dataKey="zone3"
                  stroke="hsl(145, 80%, 42%)"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(145, 80%, 42%)' }}
                  name="Residential Heights"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Severity Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Severity Distribution by Zone</h3>
              <p className="text-sm text-muted-foreground">Risk level breakdown</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 30%, 15%)" />
                <XAxis 
                  dataKey="zone" 
                  stroke="hsl(210, 30%, 60%)" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(210, 30%, 60%)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(220, 30%, 7%)',
                    border: '1px solid hsl(220, 30%, 15%)',
                    borderRadius: '8px',
                    color: 'hsl(210, 100%, 95%)',
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="high" 
                  stackId="a" 
                  fill="hsl(0, 84%, 60%)" 
                  name="High Risk"
                  radius={[0, 0, 0, 0]}
                />
                <Bar 
                  dataKey="moderate" 
                  stackId="a" 
                  fill="hsl(45, 100%, 50%)" 
                  name="Moderate Risk"
                  radius={[0, 0, 0, 0]}
                />
                <Bar 
                  dataKey="low" 
                  stackId="a" 
                  fill="hsl(145, 80%, 42%)" 
                  name="Low Risk"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
