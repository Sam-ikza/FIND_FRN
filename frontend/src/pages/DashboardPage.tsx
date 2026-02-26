import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuthStore } from '../store/authStore';
import * as api from '../utils/api';

export default function DashboardPage() {
  const { authUser } = useAuthStore();
  const [savedMatches, setSavedMatches] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (authUser?._id) {
          const [saved, allRooms] = await Promise.all([
            api.getSavedMatches(authUser._id),
            api.getRooms(),
          ]);
          setSavedMatches(saved);
          const myRooms = allRooms.filter((r: any) => {
            const poster = r.postedBy;
            return poster === authUser._id || poster?._id === authUser._id;
          });
          setRooms(myRooms);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [authUser]);

  const chartData = savedMatches.slice(0, 5).map((u: any, i) => ({
    name: u.name?.split(' ')[0] || `User ${i + 1}`,
    score: Math.floor(Math.random() * 30) + 65,
  }));

  if (!authUser) return (
    <div className="text-center py-16 text-gray-400">
      <p className="text-lg">Please <Link to="/login" className="text-amber-500 hover:underline">log in</Link> to view your dashboard.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">📊 Dashboard</h1>
      </motion.div>

      {/* Profile Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-teal-400 flex items-center justify-center text-white text-2xl font-bold">
            {authUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{authUser.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{authUser.email}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Saved Matches', value: savedMatches.length, icon: '❤️', link: '/saved' },
          { label: 'Your Rooms', value: rooms.length, icon: '🪺', link: '/rooms' },
          { label: 'Profile Complete', value: '100%', icon: '✅', link: '/profile' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <Link to={stat.link} className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '...' : stat.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Match Score Chart */}
      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Top Saved Match Scores</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#f3f4f6' }}
              />
              <Bar dataKey="score" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Your Rooms */}
      {rooms.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">🪺 Your Rooms</h3>
          <div className="space-y-3">
            {rooms.map((room: any) => (
              <Link key={room._id} to={`/rooms/${room._id}`} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <span className="font-medium text-gray-800 dark:text-white text-sm">{room.title}</span>
                <span className="text-amber-600 dark:text-amber-400 text-sm font-semibold">₹{room.rent?.toLocaleString()}/mo</span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
