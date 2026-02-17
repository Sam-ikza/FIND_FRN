import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomForm from '../components/RoomForm';
import { useRoomStore } from '../store/roomStore';
import { useUserStore } from '../store/userStore';

export default function CreateRoomPage() {
  const { createRoom } = useRoomStore();
  const currentUser = useUserStore((s) => s.currentUser);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 space-y-4">
        <p className="text-gray-500">Please create or select a profile first.</p>
        <a href="/profile" className="text-brand-600 hover:underline">Go to Profile</a>
      </div>
    );
  }

  const handleSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      await createRoom(data);
      navigate('/rooms');
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl border p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a Room</h1>
      <RoomForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
