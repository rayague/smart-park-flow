import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'fr';
export type UserRole = 'user' | 'client' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AppState {
  theme: Theme;
  language: Language;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loaderNonce: number;
  
  // Actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setLanguage: (language: Language) => void;
  pulseLoader: () => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      language: 'fr',
      user: null,
      isAuthenticated: false,
      isLoading: false,
      loaderNonce: 0,

      pulseLoader: () => set((state) => ({ loaderNonce: state.loaderNonce + 1 })),

      setTheme: (theme) => {
        set((state) => ({ theme, loaderNonce: state.loaderNonce + 1 }));
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      },

      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        get().setTheme(newTheme);
      },

      setLanguage: (language) => set((state) => ({ language, loaderNonce: state.loaderNonce + 1 })),

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      setLoading: (isLoading) => set({ isLoading }),

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'smartpark-storage',
      partialize: (state) => ({ theme: state.theme, language: state.language }),
    }
  )
);
