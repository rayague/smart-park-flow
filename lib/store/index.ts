import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'manager' | 'admin'
  avatar?: string
  createdAt: Date
}

export interface ParkingSpot {
  id: string
  parkingId: string
  number: string
  floor: number
  type: 'standard' | 'handicap' | 'ev' | 'motorcycle'
  isOccupied: boolean
  hasCharger: boolean
  pricePerHour: number
}

export interface Parking {
  id: string
  name: string
  address: string
  city: string
  latitude: number
  longitude: number
  totalSpots: number
  availableSpots: number
  pricePerHour: number
  hasEvCharging: boolean
  rating: number
  images: string[]
  amenities: string[]
  openingHours: {
    open: string
    close: string
  }
  status: 'active' | 'maintenance'
}

export interface Reservation {
  id: string
  parkingId: string
  parkingName: string
  spotId: string
  spotNumber: string
  userId: string
  startTime: Date
  endTime: Date
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  totalPrice: number
  vehiclePlate: string
  isEv: boolean
}

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  read: boolean
  createdAt: Date
}

// Auth Store
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User, token: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('smartpark_token', token)
        }
        set({ user, token, isAuthenticated: true })
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('smartpark_token')
        }
        set({ user: null, token: null, isAuthenticated: false })
      },
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

// Parking Store
interface ParkingState {
  parkings: Parking[]
  selectedParking: Parking | null
  searchQuery: string
  filters: {
    hasEv: boolean
    priceRange: [number, number]
    amenities: string[]
  }
  setParkings: (parkings: Parking[]) => void
  fetchParkings: () => Promise<void>
  selectParking: (parking: Parking | null) => void
  setSearchQuery: (query: string) => void
  setFilters: (filters: Partial<ParkingState['filters']>) => void
}

export const useParkingStore = create<ParkingState>((set) => ({
  parkings: [],
  selectedParking: null,
  searchQuery: '',
  filters: {
    hasEv: false,
    priceRange: [0, 50],
    amenities: [],
  },
  setParkings: (parkings) => set({ parkings }),
  fetchParkings: async () => {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase
        .from('parkings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data if necessary or just cast it
      set({
        parkings: (data as any[]).map(p => ({
          ...p,
          // Ensure arrays are initialized if null
          images: p.images || [],
          amenities: p.amenities || [],
          // Parse opening hours if they are strings or JSON
          openingHours: typeof p.opening_time === 'string' ? { open: p.opening_time, close: p.closing_time || '23:59' } : { open: '00:00', close: '23:59' }
        })) as Parking[]
      });
    } catch (error) {
      console.error('Failed to fetch parkings:', error);
    }
  },
  selectParking: (parking) => set({ selectedParking: parking }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
}))

// Reservation Store
interface ReservationState {
  reservations: Reservation[]
  activeReservation: Reservation | null
  addReservation: (reservation: Reservation) => void
  fetchReservations: () => Promise<void>
  updateReservation: (id: string, updates: Partial<Reservation>) => void
  cancelReservation: (id: string) => void
  setActiveReservation: (reservation: Reservation | null) => void
}

export const useReservationStore = create<ReservationState>((set) => ({
  reservations: [],
  activeReservation: null,
  addReservation: (reservation) =>
    set((state) => ({ reservations: [...state.reservations, reservation] })),
  fetchReservations: async () => {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('start_time', { ascending: true }); // Note snake_case in DB

      if (error) throw error;

      set({
        reservations: (data as any[]).map(r => ({
          ...r,
          startTime: new Date(r.start_time), // Map from snake_case DB to camelCase UI
          endTime: new Date(r.end_time),
          parkingId: r.parking_id,
          parkingName: r.parking_name,
          spotId: r.spot_id,
          spotNumber: r.spot_number,
          userId: r.user_id,
          totalPrice: r.total_price,
          vehiclePlate: r.vehicle_plate,
          isEv: r.is_ev
        })) as Reservation[]
      });
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    }
  },
  updateReservation: (id, updates) =>
    set((state) => ({
      reservations: state.reservations.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    })),
  cancelReservation: (id) =>
    set((state) => ({
      reservations: state.reservations.map((r) =>
        r.id === id ? { ...r, status: 'cancelled' as const } : r
      ),
    })),
  setActiveReservation: (reservation) =>
    set({ activeReservation: reservation }),
}))

// UI Store
interface UIState {
  isSidebarOpen: boolean
  isAuthModalOpen: boolean
  authModalView: 'login' | 'register'
  isLoading: boolean
  notifications: Notification[]
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  openAuthModal: (view: 'login' | 'register') => void
  closeAuthModal: () => void
  setLoading: (loading: boolean) => void
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void
  markNotificationRead: (id: string) => void
  clearNotifications: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isAuthModalOpen: false,
  authModalView: 'login',
  isLoading: false,
  notifications: [],
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  openAuthModal: (view) => set({ isAuthModalOpen: true, authModalView: view }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: Math.random().toString(36).substr(2, 9),
          read: false,
          createdAt: new Date(),
        },
        ...state.notifications,
      ],
    })),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  clearNotifications: () => set({ notifications: [] }),
}))

// Booking Store
interface BookingState {
  step: number
  parkingId: string | null
  parkingName: string | null
  selectedSpot: ParkingSpot | null
  selectedDate: Date | null
  startTime: string
  endTime: string
  vehiclePlate: string
  isEv: boolean
  setStep: (step: number) => void
  setParking: (id: string, name: string) => void
  nextStep: () => void
  prevStep: () => void
  setSelectedSpot: (spot: ParkingSpot | null) => void
  setSelectedDate: (date: Date | null) => void
  setStartTime: (time: string) => void
  setEndTime: (time: string) => void
  setVehiclePlate: (plate: string) => void
  setIsEv: (isEv: boolean) => void
  resetBooking: () => void
}

export const useBookingStore = create<BookingState>((set) => ({
  step: 1,
  parkingId: null,
  parkingName: null,
  selectedSpot: null,
  selectedDate: null,
  startTime: '09:00',
  endTime: '18:00',
  vehiclePlate: '',
  isEv: false,
  setStep: (step) => set({ step }),
  setParking: (id, name) => set({ parkingId: id, parkingName: name }),
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 4) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  setSelectedSpot: (spot) => set({ selectedSpot: spot }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setStartTime: (time) => set({ startTime: time }),
  setEndTime: (time) => set({ endTime: time }),
  setVehiclePlate: (plate) => set({ vehiclePlate: plate }),
  setIsEv: (isEv) => set({ isEv }),
  resetBooking: () =>
    set({
      step: 1,
      parkingId: null,
      parkingName: null,
      selectedSpot: null,
      selectedDate: null,
      startTime: '09:00',
      endTime: '18:00',
      vehiclePlate: '',
      isEv: false,
    }),
}))
