import type { Parking, ParkingSpot, Reservation, User } from '@/lib/store'

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'user@smartpark.com',
    name: 'Jean Dupont',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    email: 'manager@smartpark.com',
    name: 'Marie Martin',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    email: 'admin@smartpark.com',
    name: 'Pierre Durand',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    createdAt: new Date('2024-01-01'),
  },
]

export const mockParkings: Parking[] = [
  {
    id: 'p1',
    name: 'Parking Central Tower',
    address: '15 Avenue des Champs-Élysées',
    city: 'Paris',
    latitude: 48.8698,
    longitude: 2.3078,
    totalSpots: 250,
    availableSpots: 45,
    pricePerHour: 4.5,
    hasEvCharging: true,
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800&h=600&fit=crop',
    ],
    amenities: ['EV Charging', '24/7 Security', 'Covered', 'Elevator', 'CCTV'],
    openingHours: { open: '00:00', close: '23:59' },
    status: 'active',
  },
  {
    id: 'p2',
    name: 'Gare du Nord Parking',
    address: '18 Rue de Dunkerque',
    city: 'Paris',
    latitude: 48.8809,
    longitude: 2.3553,
    totalSpots: 180,
    availableSpots: 32,
    pricePerHour: 3.8,
    hasEvCharging: true,
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1545179605-1b7e8e7a7ab9?w=800&h=600&fit=crop',
    ],
    amenities: ['EV Charging', '24/7 Access', 'Covered', 'Disabled Access'],
    openingHours: { open: '00:00', close: '23:59' },
    status: 'active',
  },
  {
    id: 'p3',
    name: 'La Défense Business Park',
    address: '1 Place de la Défense',
    city: 'Puteaux',
    latitude: 48.8918,
    longitude: 2.2362,
    totalSpots: 500,
    availableSpots: 127,
    pricePerHour: 5.0,
    hasEvCharging: true,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1567449303078-57ad995bd329?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    ],
    amenities: ['EV Charging', 'Valet', 'Car Wash', '24/7 Security', 'Reserved Spots'],
    openingHours: { open: '06:00', close: '23:00' },
    status: 'active',
  },
  {
    id: 'p4',
    name: 'Marais Underground',
    address: '4 Rue de Rivoli',
    city: 'Paris',
    latitude: 48.8566,
    longitude: 2.3522,
    totalSpots: 120,
    availableSpots: 8,
    pricePerHour: 6.0,
    hasEvCharging: false,
    rating: 4.3,
    images: [
      'https://images.unsplash.com/photo-1470224114660-3f6686c562eb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1597766354761-0963e2c70e4c?w=800&h=600&fit=crop',
    ],
    amenities: ['Covered', '24/7 Access', 'CCTV', 'Disabled Access'],
    openingHours: { open: '00:00', close: '23:59' },
    status: 'active',
  },
  {
    id: 'p5',
    name: 'Opera Premium Parking',
    address: '2 Place de l\'Opéra',
    city: 'Paris',
    latitude: 48.8719,
    longitude: 2.3316,
    totalSpots: 200,
    availableSpots: 65,
    pricePerHour: 7.5,
    hasEvCharging: true,
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    ],
    amenities: ['EV Charging', 'Valet', 'Premium Security', 'Covered', 'VIP Area'],
    openingHours: { open: '00:00', close: '23:59' },
    status: 'active',
  },
  {
    id: 'p6',
    name: 'Montmartre View Parking',
    address: '35 Rue Lepic',
    city: 'Paris',
    latitude: 48.8847,
    longitude: 2.3382,
    totalSpots: 80,
    availableSpots: 22,
    pricePerHour: 3.5,
    hasEvCharging: false,
    rating: 4.2,
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    ],
    amenities: ['Outdoor', 'Budget Friendly', 'Quick Access'],
    openingHours: { open: '07:00', close: '22:00' },
    status: 'active',
  },
]

export const generateParkingSpots = (parkingId: string, total: number): ParkingSpot[] => {
  const spots: ParkingSpot[] = []
  const types: ParkingSpot['type'][] = ['standard', 'handicap', 'ev', 'motorcycle']
  
  for (let i = 1; i <= total; i++) {
    const floor = Math.floor((i - 1) / 50) - 1
    const typeIndex = i <= 10 ? 2 : i <= 15 ? 1 : i <= 20 ? 3 : 0
    const isOccupied = Math.random() > 0.3
    
    spots.push({
      id: `${parkingId}-spot-${i}`,
      parkingId,
      number: `${floor < 0 ? 'B' : ''}${Math.abs(floor)}${String(((i - 1) % 50) + 1).padStart(2, '0')}`,
      floor,
      type: types[typeIndex],
      isOccupied,
      hasCharger: typeIndex === 2,
      pricePerHour: typeIndex === 2 ? 6.0 : typeIndex === 1 ? 4.0 : 4.5,
    })
  }
  
  return spots
}

export const mockReservations: Reservation[] = [
  {
    id: 'r1',
    parkingId: 'p1',
    parkingName: 'Parking Central Tower',
    spotId: 'p1-spot-15',
    spotNumber: 'B115',
    userId: '1',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 2),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 6),
    status: 'active',
    totalPrice: 18.0,
    vehiclePlate: 'AB-123-CD',
    isEv: true,
  },
  {
    id: 'r2',
    parkingId: 'p3',
    parkingName: 'La Défense Business Park',
    spotId: 'p3-spot-42',
    spotNumber: 'A042',
    userId: '1',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 * 4),
    status: 'completed',
    totalPrice: 20.0,
    vehiclePlate: 'AB-123-CD',
    isEv: false,
  },
  {
    id: 'r3',
    parkingId: 'p5',
    parkingName: 'Opera Premium Parking',
    spotId: 'p5-spot-7',
    spotNumber: 'B107',
    userId: '1',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60 * 8),
    status: 'pending',
    totalPrice: 60.0,
    vehiclePlate: 'AB-123-CD',
    isEv: true,
  },
]

export const mockStats = {
  user: {
    totalReservations: 24,
    co2Saved: 156,
    timeSaved: 48,
    moneySpent: 425,
    favoriteParking: 'Parking Central Tower',
  },
  manager: {
    totalRevenue: 45680,
    occupancyRate: 78,
    totalBookings: 1245,
    evUsage: 34,
    peakHours: [9, 10, 17, 18],
    weeklyGrowth: 12.5,
  },
  admin: {
    totalParkings: 156,
    totalUsers: 12450,
    totalManagers: 89,
    monthlyRevenue: 234500,
    activeReservations: 3456,
    systemUptime: 99.9,
  },
}

export const analyticsData = {
  revenue: [
    { month: 'Jan', revenue: 32000, bookings: 890 },
    { month: 'Feb', revenue: 35000, bookings: 920 },
    { month: 'Mar', revenue: 38000, bookings: 980 },
    { month: 'Apr', revenue: 42000, bookings: 1050 },
    { month: 'May', revenue: 45000, bookings: 1120 },
    { month: 'Jun', revenue: 48000, bookings: 1200 },
  ],
  occupancy: [
    { hour: '6AM', rate: 15 },
    { hour: '8AM', rate: 45 },
    { hour: '10AM', rate: 78 },
    { hour: '12PM', rate: 85 },
    { hour: '2PM', rate: 72 },
    { hour: '4PM', rate: 68 },
    { hour: '6PM', rate: 82 },
    { hour: '8PM', rate: 55 },
    { hour: '10PM', rate: 30 },
  ],
  spotTypes: [
    { type: 'Standard', count: 180, fill: 'var(--chart-1)' },
    { type: 'EV Charging', count: 40, fill: 'var(--chart-2)' },
    { type: 'Handicap', count: 15, fill: 'var(--chart-3)' },
    { type: 'Motorcycle', count: 15, fill: 'var(--chart-4)' },
  ],
}
