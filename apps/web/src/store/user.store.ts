import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/api';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => {
        set({ user });
      },
      logout: () => {
        set({ user: null });
      },
      hydrate: () => {
        // Load from localStorage on app startup
        try {
          const stored = localStorage.getItem('auth-store');
          if (stored) {
            const parsed = JSON.parse(stored);
            const user = parsed.state?.user || null;
            if (user) {
              console.log('Hydrated user from localStorage:', user);
              set({ user });
            }
          }
        } catch (error) {
          console.error('Failed to hydrate auth store:', error);
          localStorage.removeItem('auth-store');
        }
      },
    }),
    {
      name: 'auth-store', // localStorage key
    }
  )
);


interface tokenState {
  token: string | null;
  setToken: (token: string | null) => void;
  removeToken: () => void;
}

export const useTokenStore = create<tokenState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => {
        console.log("Store: Setting token:", token);
        set({ token });
      },
      removeToken: () => {
        set({ token: null });
      },
    }),
    {
      name: 'token', // localStorage key
    }
  )
);
