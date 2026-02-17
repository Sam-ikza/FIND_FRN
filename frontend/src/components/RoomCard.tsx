import { Link } from 'react-router-dom';
import type { Room } from '../types';

export default function RoomCard({ room }: { room: Room }) {
  return (
    <Link
      to={`/rooms/${room._id}`}
      className="block bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="h-40 bg-gradient-to-br from-brand-100 to-blue-50 flex items-center justify-center text-4xl">
        🏠
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-lg">{room.title}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {room.location.city}, {room.location.state}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-brand-700 font-bold text-lg">₹{room.rent?.toLocaleString()}/mo</span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            room.vacancyType === 'single'
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {room.vacancyType === 'single' ? 'Single Room' : 'Shared'}
          </span>
        </div>
        {room.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {room.amenities.slice(0, 4).map((a) => (
              <span key={a} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{a}</span>
            ))}
            {room.amenities.length > 4 && (
              <span className="text-xs text-gray-400">+{room.amenities.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
