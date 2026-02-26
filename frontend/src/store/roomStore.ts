import { create } from 'zustand';
import type { Room } from '../types';
import * as api from '../utils/api';

interface RoomStore {
  rooms: Room[];
  loading: boolean;
  fetchRooms: (params?: Record<string, string>) => Promise<void>;
  createRoom: (data: Omit<Room, '_id'>) => Promise<Room>;
}

export const useRoomStore = create<RoomStore>((set) => ({
  rooms: [],
  loading: false,

  fetchRooms: async (params?: Record<string, string>) => {
    set({ loading: true });
    try {
      const rooms = await api.getRooms(params);
      set({ rooms, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  createRoom: async (data) => {
    const room = await api.createRoom(data);
    set((s) => ({ rooms: [room, ...s.rooms] }));
    return room;
  }
}));
