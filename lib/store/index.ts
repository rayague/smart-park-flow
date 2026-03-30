import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'

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

export function mapParkingStatus(status: string | null | undefined): Parking['status'] {
  switch (status) {
    case 'MAINTENANCE':
      return 'maintenance'
    case 'ACTIVE':
    default:
      return 'active'
  }
}

export function mapReservationStatus(
  status: string | null | undefined
): Reservation['status'] {
  switch (status) {
    case 'CANCELLED':
      return 'cancelled'
    case 'COMPLETED':
      return 'completed'
    case 'PAID':
      return 'active'
    case 'PENDING':
    default:
      return 'pending'
  }
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
  initialized: boolean
  login: (user: User, token: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  setSession: (user: User, token: string) => void
  clearSession: () => void
  updateUser: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      initialized: false,
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
      setInitialized: (initialized) => set({ initialized }),
      setSession: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('smartpark_token', token)
        }
        set({ user, token, isAuthenticated: true })
      },
      clearSession: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('smartpark_token')
        }
        set({ user: null, token: null, isAuthenticated: false })
      },
      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null
        }))
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)

// Parking Store
export type NewParkingData = {
  name: string
  address: string
  city: string
  totalSpots: number
  pricePerHour: number
  hasEvCharging: boolean
  openingHours: { open: string; close: string }
}

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
  createParking: (data: NewParkingData) => Promise<void>
  updateParking: (id: string, data: Partial<NewParkingData>) => Promise<void>
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
      const { user } = useAuthStore.getState()

      let query = supabase
        .from('parkings')
        .select('*')
        .order('created_at', { ascending: false })

      // Role-aware filtering
      if (user?.role === 'manager') {
        query = query.eq('manager_id', user.id)
      }

      const { data, error } = await query
      if (error) throw error

      const mapped: Parking[] = (data || []).map((p) => ({
        id: p.id,
        name: p.name,
        address: p.address,
        city: p.city,
        latitude: p.latitude ?? 0,
        longitude: p.longitude ?? 0,
        totalSpots: p.total_spots,
        availableSpots: p.available_spots,
        pricePerHour: p.price_per_hour,
        hasEvCharging: !!p.has_ev_charging,
        rating: p.rating ?? 0,
        images: p.images ?? [],
        amenities: p.amenities ?? [],
        openingHours: {
          open: p.opening_time ?? '00:00',
          close: p.closing_time ?? '23:59',
        },
        status: mapParkingStatus(p.status as string),
      }))

      set({ parkings: mapped })
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') return
      console.error('Failed to fetch parkings:', error);
    }
  },
  createParking: async (data) => {
    const { user } = useAuthStore.getState()
    if (!user) throw new Error('Not authenticated')

    const response = await fetch('/api/parkings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        managerId: user.id,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to create parking' }))
      throw new Error(errorData.message || 'Failed to create parking')
    }

    const created = await response.json()

    const newParking: Parking = {
      id: created.id,
      name: created.name,
      address: created.address,
      city: created.city,
      latitude: created.latitude ?? 0,
      longitude: created.longitude ?? 0,
      totalSpots: created.total_spots,
      availableSpots: created.available_spots,
      pricePerHour: created.price_per_hour,
      hasEvCharging: !!created.has_ev_charging,
      rating: created.rating ?? 0,
      images: created.images ?? [],
      amenities: created.amenities ?? [],
      openingHours: {
        open: created.opening_time ?? '00:00',
        close: created.closing_time ?? '23:59',
      },
      status: mapParkingStatus(created.status),
    }

    set((state) => ({ parkings: [newParking, ...state.parkings] }))
  },

  updateParking: async (id, data) => {
    const response = await fetch('/api/parkings', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        ...data,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update parking' }))
      throw new Error(errorData.message || 'Failed to update parking')
    }

    const updated = await response.json()

    const updatedParking: Parking = {
      id: updated.id,
      name: updated.name,
      address: updated.address,
      city: updated.city,
      latitude: updated.latitude ?? 0,
      longitude: updated.longitude ?? 0,
      totalSpots: updated.total_spots,
      availableSpots: updated.available_spots,
      pricePerHour: updated.price_per_hour,
      hasEvCharging: !!updated.has_ev_charging,
      rating: updated.rating ?? 0,
      images: updated.images ?? [],
      amenities: updated.amenities ?? [],
      openingHours: {
        open: updated.opening_time ?? '00:00',
        close: updated.closing_time ?? '23:59',
      },
      status: mapParkingStatus(updated.status),
    }

    set((state) => ({
      parkings: state.parkings.map((p) => (p.id === id ? updatedParking : p)),
    }))
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

export const useReservationStore = create<ReservationState>()(
  persist(
    (set, get) => ({
      reservations: [],
      activeReservation: null,
      addReservation: (reservation) =>
        set((state) => ({ reservations: [...state.reservations, reservation] })),
      fetchReservations: async () => {
        try {
          const { user } = useAuthStore.getState()
          if (!user) return

          let reservationRows: any[] = []

          if (user.role === 'admin') {
            const { data, error } = await supabase
              .from('reservations')
              .select('*')
              .order('created_at', { ascending: false })
            if (error) throw error
            reservationRows = data || []
          } else if (user.role === 'manager') {
            const { data: parkings, error: parkErr } = await supabase
              .from('parkings')
              .select('id')
              .eq('manager_id', user.id)
            if (parkErr) throw parkErr

            const parkingIds = (parkings || []).map((p) => p.id)
            if (parkingIds.length === 0) return

            const { data, error } = await supabase
              .from('reservations')
              .select('*')
              .in('parking_id', parkingIds)
              .order('created_at', { ascending: false })
            if (error) throw error
            reservationRows = data || []
          } else {
            const { data, error } = await supabase
              .from('reservations')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
            if (error) throw error
            reservationRows = data || []
          }

          const mapped: Reservation[] = (data || []).map((r: any) => ({
            id: r.id,
            parkingId: r.parking_id,
            parkingName: r.parking_name,
            spotId: r.spot_id,
            spotNumber: r.spot_number,
            userId: r.user_id,
            startTime: new Date(r.start_time),
            endTime: new Date(r.end_time),
            status: mapReservationStatus(r.status as string),
            totalPrice: r.total_price,
            vehiclePlate: r.vehicle_plate || '',
            isEv: !!r.is_ev,
          }))

          if (mapped.length > 0) {
            set({ reservations: mapped })
          }
          // If Supabase returns empty, keep existing local reservations
        } catch (error: unknown) {
          if (error instanceof Error && error.name === 'AbortError') return
          console.error('Failed to fetch reservations:', error);
        }
      },
      updateReservation: (id, updates) =>
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),
      cancelReservation: (id) => {
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r.id === id ? { ...r, status: 'cancelled' as const } : r
          ),
        }))
        supabase
          .from('reservations')
          .update({ status: 'CANCELLED' })
          .eq('id', id)
          .then(() => undefined, (err) => console.error('Failed to cancel reservation in DB:', err))
      },
      setActiveReservation: (reservation) =>
        set({ activeReservation: reservation }),
    }),
    {
      name: 'smartpark-reservations',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          const parsed = JSON.parse(str)
          if (parsed?.state?.reservations) {
            parsed.state.reservations = parsed.state.reservations.map((r: any) => ({
              ...r,
              startTime: new Date(r.startTime),
              endTime: new Date(r.endTime),
            }))
          }
          return parsed
        },
        setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
)

// UI Store
interface UIState {
  isSidebarOpen: boolean
  isAuthModalOpen: boolean
  authModalView: 'login' | 'register'
  isLoading: boolean
  notifications: Notification[]
  setNotifications: (notifications: Notification[]) => void
  fetchNotifications: () => Promise<void>
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
  setNotifications: (notifications) => set({ notifications }),
  fetchNotifications: async () => {
    try {
      const { user } = useAuthStore.getState()
      if (!user) {
        set({ notifications: [] })
        return
      }

      let query: any = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      // Basic role-aware filtering when the table supports it
      if (user.role !== 'admin') {
        query = query.eq('user_id', user.id)
      }

      const { data, error } = await query
      if (error) {
        // Table may not exist yet: fail gracefully without mock data
        set({ notifications: [] })
        return
      }

      const mapped: Notification[] = (data || []).map((n) => ({
        id: n.id,
        type: (n.type || 'info') as Notification['type'],
        title: n.title || 'Notification',
        message: n.message || '',
        read: !!(n.is_read ?? n.read),
        createdAt: n.created_at ? new Date(n.created_at as string) : new Date(),
      }))

      set({ notifications: mapped })
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      set({ notifications: [] })
    }
  },
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
  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }))

    // Best-effort persistence (ignore failures)
    supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .then(() => undefined, () => undefined)
  },
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
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 5) })),
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
