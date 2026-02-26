import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '../store/userStore';
import MatchResults from '../components/MatchResults';
import * as api from '../utils/api';
import type { MatchResult } from '../types';

export default function MatchPage() {
  const { users, currentUser, fetchUsers, setCurrentUser } = useUserStore();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFind = async (userId: string) => {
    setLoading(true);
    setSearched(false);
    try {
      const data = await api.findMatches(userId);
      setMatches(data.matches);
      const user = users.find((u) => u._id === userId);
      if (user) setCurrentUser(user);
    } catch (e) {
      console.error(e);
      setMatches([]);
    }
    setLoading(false);
    setSearched(true);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Find Your Match</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          Select a user to find their best roommate matches based on intent alignment, lifestyle, and conflict prediction.
        </p>

        <div className="flex flex-wrap gap-2">
          {users.map((u) => (
            <motion.button
              key={u._id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFind(u._id!)}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors min-h-[44px] ${
                currentUser?._id === u._id && searched
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-brand-400 dark:hover:border-brand-500'
              } disabled:opacity-50`}
            >
              {u.name}
            </motion.button>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500">
            <div className="text-4xl mb-3">👤</div>
            <p>No users found.</p>
            <a href="/profile" className="text-brand-600 dark:text-brand-400 hover:underline text-sm">Create a profile</a> first.
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-brand-600 border-t-transparent mb-3" />
          <p className="text-gray-400 dark:text-gray-500">Running match engine…</p>
        </div>
      )}

      {!loading && searched && currentUser && (
        <MatchResults matches={matches} seekerName={currentUser.name} />
      )}
    </div>
  );
}

