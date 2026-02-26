import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import MatchCard from '../components/MatchCard';
import { useAuthStore } from '../store/authStore';
import * as api from '../utils/api';

export default function SavedMatchesPage() {
  const { authUser } = useAuthStore();
  const [savedUsers, setSavedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authUser?._id) {
      api.getSavedMatches(authUser._id)
        .then(setSavedUsers)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [authUser]);

  const handleUnsave = async (matchUserId: string) => {
    if (!authUser?._id) return;
    try {
      await api.unsaveMatch(authUser._id, matchUserId);
      setSavedUsers(prev => prev.filter(u => u._id !== matchUserId));
      toast.success('Match unsaved');
    } catch {
      toast.error('Failed to unsave match');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">❤️ Saved Matches</h1>

      {!authUser && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <p className="text-lg">Please log in to view saved matches.</p>
        </div>
      )}

      {loading && <div className="text-center py-8 text-gray-400">Loading...</div>}

      {!loading && authUser && savedUsers.length === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <div className="text-5xl mb-4">💔</div>
          <p className="text-lg font-medium">No saved matches yet.</p>
          <p className="text-sm mt-1">Heart a match to save them here.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {savedUsers.map((user, i) => {
          const matchResult = {
            candidate: user,
            matchScore: 0,
            breakdown: {},
            conflicts: [],
            explanations: [],
            linkedRooms: [],
          };
          return (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <MatchCard
                match={matchResult as any}
                index={i}
                savedMatchIds={[user._id]}
                onUnsave={handleUnsave}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
