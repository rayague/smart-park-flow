import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Zap, 
  Leaf, 
  ArrowRight,
  Car,
  Battery,
  TrendingUp
} from 'lucide-react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

const quickStats = [
  { icon: MapPin, label: 'Active Reservations', value: '3', trend: '+2 this week', color: 'primary' },
  { icon: Clock, label: 'Hours Saved', value: '47h', trend: 'This month', color: 'secondary' },
  { icon: Leaf, label: 'CO2 Saved', value: '28kg', trend: '+12% vs last month', color: 'secondary' },
  { icon: Battery, label: 'EV Sessions', value: '12', trend: '340 kWh charged', color: 'primary' },
];

const recentReservations = [
  { id: 1, location: 'Central Mall Parking', address: '123 Main St', time: 'Today, 2:00 PM', status: 'active', spot: 'A-24' },
  { id: 2, location: 'Airport Long-Term', address: 'Terminal 2', time: 'Jan 15, 9:00 AM', status: 'upcoming', spot: 'B-12' },
  { id: 3, location: 'Downtown Garage', address: '456 Oak Ave', time: 'Jan 10, 4:30 PM', status: 'completed', spot: 'C-08' },
];

const nearbyParkings = [
  { id: 1, name: 'Tech Hub Parking', distance: '0.3 km', available: 45, total: 120, price: '$2.50/hr', hasEV: true },
  { id: 2, name: 'City Center Garage', distance: '0.5 km', available: 23, total: 80, price: '$3.00/hr', hasEV: true },
  { id: 3, name: 'Riverside Lot', distance: '0.8 km', available: 67, total: 100, price: '$1.50/hr', hasEV: false },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function DashboardPage() {
  const { theme } = useAppStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="ml-64 transition-all duration-300">
        <DashboardHeader title="Dashboard" subtitle="Welcome back, Alex!" />
        
        <main className="p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-6 rounded-2xl glass card-hover"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                    stat.color === 'primary' ? 'gradient-primary' : 'bg-secondary'
                  }`}>
                    <stat.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-secondary" />
                </div>
                <div className="font-display text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="text-xs text-secondary mt-1">{stat.trend}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Reservations */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.4, delay: 0.4 }}
              className="lg:col-span-2 rounded-2xl glass p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold">Recent Reservations</h2>
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {recentReservations.map((reservation) => (
                  <motion.div
                    key={reservation.id}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Car className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{reservation.location}</div>
                      <div className="text-sm text-muted-foreground">{reservation.address}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-medium">Spot {reservation.spot}</div>
                      <div className="text-xs text-muted-foreground">{reservation.time}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      reservation.status === 'active' 
                        ? 'bg-secondary/20 text-secondary' 
                        : reservation.status === 'upcoming'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {reservation.status}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Nearby Parking */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.4, delay: 0.5 }}
              className="rounded-2xl glass p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold">Nearby</h2>
                <Button variant="ghost" size="sm">
                  Map
                  <MapPin className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {nearbyParkings.map((parking) => (
                  <motion.div
                    key={parking.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium">{parking.name}</div>
                        <div className="text-xs text-muted-foreground">{parking.distance} away</div>
                      </div>
                      {parking.hasEV && (
                        <div className="h-6 w-6 rounded-full bg-secondary/20 flex items-center justify-center">
                          <Zap className="h-3 w-3 text-secondary" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 bg-muted rounded-full w-20 overflow-hidden">
                          <div 
                            className="h-full bg-secondary rounded-full"
                            style={{ width: `${(parking.available / parking.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {parking.available}/{parking.total}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-primary">{parking.price}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button className="w-full mt-4 gradient-primary text-primary-foreground border-0">
                Find More Spots
              </Button>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;
