import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Default admin user for login
const DEFAULT_ADMIN = {
  id: '1',
  name: 'Admin',
  email: 'admin@example.com',
  role: 'admin' as const,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // For demo purposes, we'll use a hardcoded admin user
        if (email === 'admin@example.com' && password === 'admin123') {
          set({ user: DEFAULT_ADMIN, isAuthenticated: true });
        } else {
          throw new Error('Invalid credentials');
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
); 