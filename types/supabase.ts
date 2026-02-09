export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          phone: string | null
          role: 'USER' | 'MANAGER' | 'ADMIN'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          phone?: string | null
          role?: 'USER' | 'MANAGER' | 'ADMIN'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string | null
          role?: 'USER' | 'MANAGER' | 'ADMIN'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      parkings: {
        Row: {
          id: string
          name: string
          description: string | null
          address: string
          city: string
          postal_code: string | null
          latitude: number | null
          longitude: number | null
          price_per_hour: number
          total_spots: number
          available_spots: number
          has_ev_charging: boolean | null
          ev_spots_count: number | null
          rating: number | null
          total_ratings: number | null
          status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | null
          manager_id: string | null
          images: string[] | null
          amenities: string[] | null
          opening_time: string | null
          closing_time: string | null
          is_24h: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          address: string
          city: string
          postal_code?: string | null
          latitude?: number | null
          longitude?: number | null
          price_per_hour: number
          total_spots?: number
          available_spots?: number
          has_ev_charging?: boolean | null
          ev_spots_count?: number | null
          rating?: number | null
          total_ratings?: number | null
          status?: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | null
          manager_id?: string | null
          images?: string[] | null
          amenities?: string[] | null
          opening_time?: string | null
          closing_time?: string | null
          is_24h?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          address?: string
          city?: string
          postal_code?: string | null
          latitude?: number | null
          longitude?: number | null
          price_per_hour?: number
          total_spots?: number
          available_spots?: number
          has_ev_charging?: boolean | null
          ev_spots_count?: number | null
          rating?: number | null
          total_ratings?: number | null
          status?: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | null
          manager_id?: string | null
          images?: string[] | null
          amenities?: string[] | null
          opening_time?: string | null
          closing_time?: string | null
          is_24h?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "parkings_manager_id_fkey"
            columns: ["manager_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      spots: {
        Row: {
          id: string
          parking_id: string
          number: string
          floor: number | null
          type: 'REGULAR' | 'EV' | null
          status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | null
          has_charger: boolean | null
          charger_power_kw: number | null
          price_per_hour: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          parking_id: string
          number: string
          floor?: number | null
          type?: 'REGULAR' | 'EV' | null
          status?: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | null
          has_charger?: boolean | null
          charger_power_kw?: number | null
          price_per_hour?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          parking_id?: string
          number?: string
          floor?: number | null
          type?: 'REGULAR' | 'EV' | null
          status?: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | null
          has_charger?: boolean | null
          charger_power_kw?: number | null
          price_per_hour?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "spots_parking_id_fkey"
            columns: ["parking_id"]
            referencedRelation: "parkings"
            referencedColumns: ["id"]
          }
        ]
      }
      reservations: {
        Row: {
          id: string
          user_id: string
          parking_id: string
          spot_id: string
          parking_name: string
          spot_number: string
          start_time: string
          end_time: string
          total_price: number
          vehicle_plate: string | null
          vehicle_type: string | null
          is_ev: boolean | null
          needs_charging: boolean | null
          status: 'PENDING' | 'PAID' | 'CANCELLED' | 'COMPLETED' | null
          payment_intent_id: string | null
          qr_code: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          parking_id: string
          spot_id: string
          parking_name: string
          spot_number: string
          start_time: string
          end_time: string
          total_price: number
          vehicle_plate?: string | null
          vehicle_type?: string | null
          is_ev?: boolean | null
          needs_charging?: boolean | null
          status?: 'PENDING' | 'PAID' | 'CANCELLED' | 'COMPLETED' | null
          payment_intent_id?: string | null
          qr_code?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          parking_id?: string
          spot_id?: string
          parking_name?: string
          spot_number?: string
          start_time?: string
          end_time?: string
          total_price?: number
          vehicle_plate?: string | null
          vehicle_type?: string | null
          is_ev?: boolean | null
          needs_charging?: boolean | null
          status?: 'PENDING' | 'PAID' | 'CANCELLED' | 'COMPLETED' | null
          payment_intent_id?: string | null
          qr_code?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_parking_id_fkey"
            columns: ["parking_id"]
            referencedRelation: "parkings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_spot_id_fkey"
            columns: ["spot_id"]
            referencedRelation: "spots"
            referencedColumns: ["id"]
          }
        ]
      }
      vehicles: {
        Row: {
          id: string
          user_id: string
          plate: string
          brand: string | null
          model: string | null
          color: string | null
          is_electric: boolean | null
          is_default: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plate: string
          brand?: string | null
          model?: string | null
          color?: string | null
          is_electric?: boolean | null
          is_default?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plate?: string
          brand?: string | null
          model?: string | null
          color?: string | null
          is_electric?: boolean | null
          is_default?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          parking_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          parking_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          parking_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_parking_id_fkey"
            columns: ["parking_id"]
            referencedRelation: "parkings"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          parking_id: string
          reservation_id: string | null
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          parking_id: string
          reservation_id?: string | null
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          parking_id?: string
          reservation_id?: string | null
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_parking_id_fkey"
            columns: ["parking_id"]
            referencedRelation: "parkings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reservation_id_fkey"
            columns: ["reservation_id"]
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          data: Json | null
          is_read: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          data?: Json | null
          is_read?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          data?: Json | null
          is_read?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          id: string
          reservation_id: string
          user_id: string
          amount: number
          currency: string | null
          payment_method: string | null
          payment_status: string | null
          stripe_payment_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reservation_id: string
          user_id: string
          amount: number
          currency?: string | null
          payment_method?: string | null
          payment_status?: string | null
          stripe_payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reservation_id?: string
          user_id?: string
          amount?: number
          currency?: string | null
          payment_method?: string | null
          payment_status?: string | null
          stripe_payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_reservation_id_fkey"
            columns: ["reservation_id"]
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'USER' | 'MANAGER' | 'ADMIN'
      spot_status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE'
      spot_type: 'REGULAR' | 'EV'
      reservation_status: 'PENDING' | 'PAID' | 'CANCELLED' | 'COMPLETED'
      parking_status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'
    }
  }
}
