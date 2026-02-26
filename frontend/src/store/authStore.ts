import { create } from 'zustand';
import * as api from '../utils/api';

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthStore {
  token: string | null;
  authUser: AuthUser | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('roomsync-token');
};

const getStoredUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('roomsync-user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthStore>((set) => ({
  token: getStoredToken(),
  authUser: getStoredUser(),
  isAuthenticated: !!getStoredToken(),
  authLoading: false,
  authError: null,

  login: async (email, password) => {
    set({ authLoading: true, authError: null });
    try {
      const data = await api.login(email, password);
      localStorage.setItem('roomsync-token', data.token);
      localStorage.setItem('roomsync-user', JSON.stringify(data.user));
      set({ token: data.token, authUser: data.user, isAuthenticated: true, authLoading: false });
    } catch (err: any) {
      set({ authError: err.response?.data?.error || 'Login failed', authLoading: false });
      throw err;
    }
  },

  signup: async (name, email, password) => {
    set({ authLoading: true, authError: null });
    try {
      const data = await api.signup(name, email, password);
      localStorage.setItem('roomsync-token', data.token);
      localStorage.setItem('roomsync-user', JSON.stringify(data.user));
      set({ token: data.token, authUser: data.user, isAuthenticated: true, authLoading: false });
    } catch (err: any) {
      set({ authError: err.response?.data?.error || 'Signup failed', authLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('roomsync-token');
    localStorage.removeItem('roomsync-user');
    set({ token: null, authUser: null, isAuthenticated: false });
  },

  forgotPassword: async (email) => {
    set({ authLoading: true, authError: null });
    try {
      await api.forgotPassword(email);
      set({ authLoading: false });
    } catch (err: any) {
      set({ authError: err.response?.data?.error || 'Request failed', authLoading: false });
      throw err;
    }
  },

  clearError: () => set({ authError: null }),
}));
