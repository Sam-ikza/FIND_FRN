import { useEffect, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import RoomCard from '../components/RoomCard';
import RoomFilters, { type FilterState } from '../components/RoomFilters';
import { useRoomStore } from '../store/roomStore';

const RoomMap = lazy(() => import('../components/RoomMap'));

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-200 dark:bg-gray-700" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      </div>
    </div>
  );
}

const defaultFilters: FilterState = {
  city: '', minRent: '', maxRent: '', vacancyType: 'all',
  amenities: [], sort: 'newest', search: '',
};

export default function RoomsPage() {
  const { rooms, loading, fetchRooms } = useRoomStore();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.city) params.city = filters.city;
    if (filters.minRent) params.minRent = filters.minRent;
    if (filters.maxRent) params.maxRent = filters.maxRent;
    if (filters.vacancyType !== 'all') params.vacancyType = filters.vacancyType;
    if (filters.amenities.length) params.amenities = filters.amenities.join(',');
    if (filters.sort !== 'newest') params.sort = filters.sort;
    if (filters.search) params.search = filters.search;
    fetchRooms(Object.keys(params).length ? params : undefined);
  }, [filters]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Available Rooms</h1>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              📋 List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              🗺️ Map
            </button>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/rooms/new"
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-teal-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity min-h-[44px] flex items-center"
            >
              + Post a Room
            </Link>
          </motion.div>
        </div>
      </div>

      <RoomFilters filters={filters} onChange={setFilters} />

      {loading && viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && rooms.length === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <div className="text-5xl mb-4">🪺</div>
          <p className="text-lg font-medium">No rooms posted yet.</p>
          <p className="text-sm mt-1">Be the first to post a room!</p>
          <Link to="/rooms/new" className="inline-block mt-4 px-6 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600">
            Post a Room
          </Link>
        </div>
      )}

      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      )}

      {viewMode === 'map' && (
        <Suspense fallback={<div className="h-[500px] bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse flex items-center justify-center text-gray-400">Loading map...</div>}>
          <RoomMap rooms={rooms as any} />
        </Suspense>
      )}
    </div>
  );
}

