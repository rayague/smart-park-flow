import { motion } from 'framer-motion';
import { TrendingUp, Users, MapPin, Zap } from 'lucide-react';

const stats = [
  { 
    icon: MapPin, 
    value: '50K+', 
    label: 'Parking Spots', 
    suffix: '' 
  },
  { 
    icon: Users, 
    value: '2M+', 
    label: 'Happy Users', 
    suffix: '' 
  },
  { 
    icon: TrendingUp, 
    value: '98', 
    label: 'Satisfaction Rate', 
    suffix: '%' 
  },
  { 
    icon: Zap, 
    value: '10K+', 
    label: 'EV Chargers', 
    suffix: '' 
  },
];

export function StatsSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl gradient-primary p-1"
        >
          <div className="rounded-[calc(1.5rem-4px)] bg-card/95 backdrop-blur-xl p-8 md:p-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl glass mb-4">
                    <stat.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="font-display text-4xl md:text-5xl font-bold gradient-text mb-2">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default StatsSection;
