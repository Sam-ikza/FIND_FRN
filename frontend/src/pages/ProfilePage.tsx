import { useEffect, useState } from 'react';
import UserProfileForm from '../components/UserProfileForm';
import { useUserStore } from '../store/userStore';

export default function ProfilePage() {
  const { users, currentUser, fetchUsers, setCurrentUser, createUser } = useUserStore();
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (data: any) => {
    setSubmitting(true);
    try {
      const user = await createUser(data);
      setCurrentUser(user);
      setCreated(true);
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Existing users selector */}
      {users.length > 0 && (
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Switch Profile</h2>
          <p className="text-sm text-gray-500 mb-3">Select an existing user to act as:</p>
          <div className="flex flex-wrap gap-2">
            {users.map((u) => (
              <button
                key={u._id}
                onClick={() => setCurrentUser(u)}
                className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                  currentUser?._id === u._id
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-brand-400'
                }`}
              >
                {u.name}
              </button>
            ))}
          </div>
          {currentUser && (
            <div className="mt-4 p-3 bg-brand-50 rounded-lg text-sm text-brand-700">
              Active: <strong>{currentUser.name}</strong> — {currentUser.occupation}, {currentUser.location.city} · {currentUser.lifeIntent.lifeMode} mode
            </div>
          )}
        </div>
      )}

      {/* Create new */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {created ? '✅ Profile Created!' : 'Create New Profile'}
        </h2>
        {created ? (
          <div className="text-center py-8 space-y-4">
            <p className="text-gray-600">Your profile for <strong>{currentUser?.name}</strong> is ready.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setCreated(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Create Another</button>
              <a href="/match" className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700">Find Matches</a>
            </div>
          </div>
        ) : (
          <UserProfileForm onSubmit={handleCreate} submitting={submitting} />
        )}
      </div>
    </div>
  );
}
