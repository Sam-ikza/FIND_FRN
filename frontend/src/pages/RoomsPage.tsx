import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import RoomCard from '../components/RoomCard';
import { useRoomStore } from '../store/roomStore';

export default function RoomsPage() {
  const { rooms, loading, fetchRooms } = useRoomStore();

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Available Rooms</h1>
        <Link to="/rooms/new" className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700">
          + Post a Room
        </Link>
      </div>

      {loading && <p className="text-gray-400">Loading...</p>}

      {!loading && rooms.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">🏠</div>
          <p>No rooms posted yet.</p>
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
