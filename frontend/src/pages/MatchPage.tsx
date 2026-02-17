import { useEffect, useState } from 'react';
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
      // set current user to the seeker
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
      <div className="bg-white rounded-xl border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Your Match</h1>
        <p className="text-gray-500 text-sm mb-4">Select a user to find their best roommate matches based on intent alignment, lifestyle, and conflict prediction.</p>

        <div className="flex flex-wrap gap-2">
          {users.map((u) => (
            <button
              key={u._id}
              onClick={() => handleFind(u._id!)}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                currentUser?._id === u._id && searched
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-brand-400'
              } disabled:opacity-50`}
            >
              {u.name}
            </button>
          ))}
        </div>

        {users.length === 0 && (
          <p className="text-gray-400 mt-4">No users found. <a href="/profile" className="text-brand-600 hover:underline">Create a profile</a> first.</p>
        )}
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-600 border-t-transparent" />
          <p className="text-gray-400 mt-3">Running match engine…</p>
        </div>
      )}

      {!loading && searched && currentUser && (
        <MatchResults matches={matches} seekerName={currentUser.name} />
      )}
    </div>
  );
}
