import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import RoomCard from '../components/RoomCard';
import { useRoomStore } from '../store/roomStore';

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

export default function RoomsPage() {
  const { rooms, loading, fetchRooms } = useRoomStore();

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Available Rooms</h1>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/rooms/new"
            className="px-4 py-2 bg-gradient-to-r from-brand-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity min-h-[44px] flex items-center"
          >
            + Post a Room
          </Link>
        </motion.div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && rooms.length === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <div className="text-5xl mb-4">🏠</div>
          <p className="text-lg font-medium">No rooms posted yet.</p>
          <p className="text-sm mt-1">Be the first to post a room!</p>
          <Link to="/rooms/new" className="inline-block mt-4 px-6 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700">
            Post a Room
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
}

