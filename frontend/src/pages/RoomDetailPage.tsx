import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as api from '../utils/api';
import type { Room } from '../types';

export default function RoomDetailPage() {
  const { id } = useParams();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getRoom(id).then(setRoom).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return (
    <div className="max-w-3xl mx-auto space-y-4 animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
    </div>
  );
  if (!room) return <p className="text-red-500">Room not found.</p>;

  const roommates = (room.currentRoommates || []) as any[];

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 space-y-6">
      <Link to="/rooms" className="text-sm text-brand-600 dark:text-brand-400 hover:underline">&larr; Back to rooms</Link>

      <div className="h-48 bg-gradient-to-br from-brand-400 via-purple-400 to-pink-400 dark:from-brand-700 dark:via-purple-700 dark:to-pink-700 rounded-xl flex items-center justify-center text-6xl">
        🏠
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{room.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">📍 {room.location.city}, {room.location.state}</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 px-4 py-2 rounded-lg font-semibold">₹{room.rent.toLocaleString()}/mo</div>
        <div className={`px-4 py-2 rounded-lg font-medium ${room.vacancyType === 'single' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'}`}>
          {room.vacancyType === 'single' ? 'Single Room' : 'Shared'}
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg">
          Available: {new Date(room.availableFrom).toLocaleDateString()}
        </div>
      </div>

      {room.description && <p className="text-gray-600 dark:text-gray-300">{room.description}</p>}

      {room.amenities.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {room.amenities.map((a) => (
              <span key={a} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm">{a}</span>
            ))}
          </div>
        </div>
      )}

      {roommates.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Current Roommates</h3>
          <div className="space-y-2">
            {roommates.map((rm: any) => (
              <div key={rm._id || rm} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-sm">
                {rm.name ? (
                  <>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{rm.name}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">{rm.age}y · {rm.occupation}</span>
                  </>
                ) : (
                  <span className="text-gray-400">User ID: {rm}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

