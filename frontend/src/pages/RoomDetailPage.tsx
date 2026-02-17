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

  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (!room) return <p className="text-red-500">Room not found.</p>;

  const roommates = (room.currentRoommates || []) as any[];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl border p-8 space-y-6">
      <Link to="/rooms" className="text-sm text-brand-600 hover:underline">&larr; Back to rooms</Link>

      <div className="h-48 bg-gradient-to-br from-brand-100 to-blue-50 rounded-xl flex items-center justify-center text-6xl">
        🏠
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">{room.title}</h1>
        <p className="text-gray-500 mt-1">{room.location.city}, {room.location.state}</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="bg-brand-50 text-brand-700 px-4 py-2 rounded-lg font-semibold">₹{room.rent.toLocaleString()}/mo</div>
        <div className={`px-4 py-2 rounded-lg font-medium ${room.vacancyType === 'single' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
          {room.vacancyType === 'single' ? 'Single Room' : 'Shared'}
        </div>
        <div className="bg-gray-50 text-gray-600 px-4 py-2 rounded-lg">
          Available: {new Date(room.availableFrom).toLocaleDateString()}
        </div>
      </div>

      {room.description && <p className="text-gray-600">{room.description}</p>}

      {room.amenities.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {room.amenities.map((a) => (
              <span key={a} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">{a}</span>
            ))}
          </div>
        </div>
      )}

      {roommates.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Current Roommates</h3>
          <div className="space-y-2">
            {roommates.map((rm: any) => (
              <div key={rm._id || rm} className="bg-gray-50 rounded-lg p-3 text-sm">
                {rm.name ? (
                  <>
                    <span className="font-medium">{rm.name}</span>
                    <span className="text-gray-500 ml-2">{rm.age}y · {rm.occupation}</span>
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
