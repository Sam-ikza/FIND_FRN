import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
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
      toast.success('Profile created successfully! 🎉');
    } catch (e) {
      console.error(e);
      toast.error('Failed to create profile. Please try again.');
    }
    setSubmitting(false);
  };

  const initials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Existing users selector */}
      {users.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Switch Profile</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Select an existing user to act as:</p>
          <div className="flex flex-wrap gap-2">
            {users.map((u) => (
              <motion.button
                key={u._id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentUser(u)}
                className={`px-4 py-2 rounded-lg text-sm border transition-colors min-h-[44px] ${
                  currentUser?._id === u._id
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-brand-400'
                }`}
              >
                {u.name}
              </motion.button>
            ))}
          </div>
          {currentUser && (
            <div className="mt-4 p-3 bg-brand-50 dark:bg-brand-900/20 rounded-lg flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {initials(currentUser.name)}
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-700 dark:text-brand-400">{currentUser.name}</p>
                <p className="text-xs text-brand-500 dark:text-brand-500">{currentUser.occupation} · {currentUser.location.city} · {currentUser.lifeIntent.lifeMode} mode</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create new */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {created ? '✅ Profile Created!' : 'Create New Profile'}
        </h2>
        {created ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl mx-auto">
              {currentUser ? initials(currentUser.name) : '?'}
            </div>
            <p className="text-gray-600 dark:text-gray-300">Your profile for <strong>{currentUser?.name}</strong> is ready.</p>
            <div className="flex gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCreated(false)}
                className="px-4 py-2 border dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300 min-h-[44px]"
              >
                Create Another
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/match"
                className="px-4 py-2 bg-gradient-to-r from-brand-600 to-purple-600 text-white rounded-lg text-sm hover:opacity-90 min-h-[44px] flex items-center"
              >
                Find Matches →
              </motion.a>
            </div>
          </div>
        ) : (
          <UserProfileForm onSubmit={handleCreate} submitting={submitting} />
        )}
      </div>
    </div>
  );
}

