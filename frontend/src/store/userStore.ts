import { create } from 'zustand';
import type { User } from '../types';
import * as api from '../utils/api';

interface UserStore {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  fetchUsers: () => Promise<void>;
  setCurrentUser: (user: User | null) => void;
  createUser: (data: Omit<User, '_id'>) => Promise<User>;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  currentUser: null,
  loading: false,

  fetchUsers: async () => {
    set({ loading: true });
    try {
      const users = await api.getUsers();
      set({ users, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  setCurrentUser: (user) => set({ currentUser: user }),

  createUser: async (data) => {
    const user = await api.createUser(data);
    set((s) => ({ users: [user, ...s.users] }));
    return user;
  }
}));
