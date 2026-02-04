
export interface User {
    id: string;
    email: string;
    name: string;
    password?: string;
    role: 'user' | 'manager' | 'admin';
    avatar?: string;
    createdAt: string;
}

export interface Parking {
    id: string;
    name: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    totalSpots: number;
    availableSpots: number;
    pricePerHour: number;
    hasEvCharging: boolean;
    rating: number;
    images: string[];
    amenities: string[];
    status: 'active' | 'maintenance';
}

export const users: User[] = [
    {
        id: 'u1',
        email: 'client@smartpark.com',
        name: 'Jean Dupont',
        password: 'password123', // In a real app, this would be hashed
        role: 'user',
        createdAt: new Date().toISOString()
    },
    {
        id: 'm1',
        email: 'manager@smartpark.com',
        name: 'Alice Martin',
        password: 'password123',
        role: 'manager',
        createdAt: new Date().toISOString()
    },
    {
        id: 'a1',
        email: 'admin@smartpark.com',
        name: 'SmartPark Admin',
        password: 'password123',
        role: 'admin',
        createdAt: new Date().toISOString()
    }
];

export const parkings: Parking[] = [
    {
        id: 'p1',
        name: 'Central Station Parking',
        address: '123 Avenue de la Gare',
        city: 'Paris',
        latitude: 48.8566,
        longitude: 2.3522,
        totalSpots: 150,
        availableSpots: 45,
        pricePerHour: 3.5,
        hasEvCharging: true,
        rating: 4.5,
        images: [],
        amenities: ['24/7 Access', 'Security Cameras', 'EV Charging'],
        status: 'active'
    },
    {
        id: 'p2',
        name: 'Mall Plaza Garage',
        address: '45 Boulevard Saint-Germain',
        city: 'Paris',
        latitude: 48.8512,
        longitude: 2.3387,
        totalSpots: 200,
        availableSpots: 12,
        pricePerHour: 4.2,
        hasEvCharging: false,
        rating: 4.2,
        images: [],
        amenities: ['Underground', 'Elevator', 'Security'],
        status: 'active'
    }
];

export const reservations = [
    {
        id: 'r1',
        userId: 'u1',
        parkingId: 'p1',
        parkingName: 'Central Station Parking',
        spotId: 's10',
        spotNumber: 'A-10',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 7200000).toISOString(),
        status: 'active',
        totalPrice: 7.0,
        vehiclePlate: 'AB-123-CD',
        isEv: true
    }
];
