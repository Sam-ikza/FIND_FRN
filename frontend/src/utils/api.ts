import axios from 'axios';
import type { User, Room, MatchResult } from '../types';

const api = axios.create({ baseURL: '/api' });

// Users
export const getUsers = () => api.get<User[]>('/users').then(r => r.data);
export const getUser = (id: string) => api.get<User>(`/users/${id}`).then(r => r.data);
export const createUser = (data: Omit<User, '_id'>) => api.post<User>('/users', data).then(r => r.data);
export const updateUser = (id: string, data: Partial<User>) => api.put<User>(`/users/${id}`, data).then(r => r.data);
export const deleteUser = (id: string) => api.delete(`/users/${id}`).then(r => r.data);

// Rooms
export const getRooms = () => api.get<Room[]>('/rooms').then(r => r.data);
export const getRoom = (id: string) => api.get<Room>(`/rooms/${id}`).then(r => r.data);
export const createRoom = (data: Omit<Room, '_id'>) => api.post<Room>('/rooms', data).then(r => r.data);
export const updateRoom = (id: string, data: Partial<Room>) => api.put<Room>(`/rooms/${id}`, data).then(r => r.data);
export const deleteRoom = (id: string) => api.delete(`/rooms/${id}`).then(r => r.data);

// Matching
export const findMatches = (userId: string) =>
  api.post<{ seeker: any; totalMatches: number; matches: MatchResult[] }>('/match', { userId }).then(r => r.data);
