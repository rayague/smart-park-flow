import { motion } from 'framer-motion';
import { 
  MapPin, 
  Zap, 
  Shield, 
  Clock, 
  CreditCard, 
  Leaf,
  ArrowRight 
} from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Real-Time Availability',
    description: 'Find available parking spots instantly with live updates across thousands of locations.',
    color: 'primary',
  },
  {
    icon: Zap,
    title: 'EV Charging Stations',
    description: 'Locate and reserve EV charging points with smart energy management.',
    color: 'secondary',
  },
  {
    icon: Shield,
    title: 'Secure Parking',
    description: '24/7 surveillance and access control for complete peace of mind.',
    color: 'primary',
  },
  {
    icon: Clock,
    title: 'Save Time',
    description: 'Skip the search. Pre-book your spot and drive directly to your destination.',
    color: 'secondary',
  },
  {
    icon: CreditCard,
    title: 'Seamless Payments',
    description: 'Contactless payments with transparent pricing. No hidden fees.',
    color: 'primary',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly',
    description: 'Reduce emissions by finding parking faster. Track your CO2 savings.',
    color: 'secondary',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full glass text-sm font-medium text-primary mb-4">
            Features
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Everything you need for{' '}
            <span className="gradient-text">smart parking</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From finding a spot to charging your EV, we've got you covered with cutting-edge technology.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <div className="h-full p-6 rounded-2xl glass card-hover cursor-pointer">
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${
                    feature.color === 'primary' ? 'gradient-primary' : 'bg-secondary'
                  }`}
                >
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturesSection;
