import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Room } from '../types';

export default function RoomCard({ room }: { room: Room }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={`/rooms/${room._id}`}
        className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow overflow-hidden"
      >
        <div className="h-40 bg-gradient-to-br from-brand-400 via-purple-400 to-pink-400 dark:from-brand-700 dark:via-purple-700 dark:to-pink-700 flex items-center justify-center text-5xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-purple-500/20 animate-gradient" style={{ backgroundSize: '200% 200%' }} />
          🏠
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 dark:text-white text-lg leading-tight">{room.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            📍 {room.location.city}, {room.location.state}
          </p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-brand-700 dark:text-brand-400 font-bold text-lg">₹{room.rent?.toLocaleString()}/mo</span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              room.vacancyType === 'single'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            }`}>
              {room.vacancyType === 'single' ? 'Single Room' : 'Shared'}
            </span>
          </div>
          {room.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {room.amenities.slice(0, 4).map((a) => (
                <span key={a} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">{a}</span>
              ))}
              {room.amenities.length > 4 && (
                <span className="text-xs text-gray-400 dark:text-gray-500">+{room.amenities.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

