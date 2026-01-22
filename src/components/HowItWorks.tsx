import { motion } from 'framer-motion';
import { Database, Brain, AlertTriangle, Shield } from 'lucide-react';

const steps = [
  {
    icon: <Database className="w-8 h-8" />,
    step: '01',
    title: 'Data Collection',
    description: 'Real-time data from satellites, weather stations, river gauges, and soil sensors is continuously aggregated and processed.',
  },
  {
    icon: <Brain className="w-8 h-8" />,
    step: '02',
    title: 'AI Analysis',
    description: 'Machine learning models analyze patterns, historical data, and current conditions to predict flood probability and severity.',
  },
  {
    icon: <AlertTriangle className="w-8 h-8" />,
    step: '03',
    title: 'Early Warning',
    description: 'Automated alerts are triggered based on risk thresholds, notifying authorities and residents through multiple channels.',
  },
  {
    icon: <Shield className="w-8 h-8" />,
    step: '04',
    title: 'Response Coordination',
    description: 'Generate evacuation plans, allocate resources, and coordinate emergency services for effective disaster response.',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-card/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From data collection to emergency response, our system provides end-to-end flood management
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 hidden lg:block" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="glass-card-hover p-6 text-center h-full">
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground shadow-glow">
                    {step.step}
                  </div>
                  
                  <div className="mt-4 mb-4 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary">
                    {step.icon}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
