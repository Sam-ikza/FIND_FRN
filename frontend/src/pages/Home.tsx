import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const features = [
  {
    icon: '🎯',
    title: 'Intent Alignment',
    desc: 'Growth vs. chill vs. balanced — we match you with people in the same life phase.',
  },
  {
    icon: '⚡',
    title: 'Conflict Prediction',
    desc: 'We simulate daily friction before you move in. No surprises.',
  },
  {
    icon: '💡',
    title: 'Explainable Matching',
    desc: 'Every score comes with human-readable reasons. You understand why.',
  },
  {
    icon: '🔐',
    title: 'Dealbreaker System',
    desc: 'Set hard filters — no smokers, gender preference, budget limits. Instant filtering.',
  },
  {
    icon: '🏆',
    title: 'Match Tiers',
    desc: 'Perfect, Great, Good, Fair, Poor — instantly see quality of each match.',
  },
  {
    icon: '🤝',
    title: 'Social Compatibility',
    desc: 'Introverts, extroverts, noise levels, guest frequency — all factored in.',
  },
];

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-4xl mx-auto text-center py-20 px-4"
      >
        <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-brand-50 via-purple-50 to-pink-50 dark:from-brand-900/20 dark:via-purple-900/20 dark:to-gray-900 animate-gradient" style={{ backgroundSize: '200% 200%' }} />

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-7xl mb-6"
        >
          🏠
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
          Room<span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">Sync</span>
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto mb-10">
          Find roommates who match your <strong className="text-gray-800 dark:text-white">life intent</strong>, not just your budget.
          We predict conflicts before they happen and explain <em>why</em> a match works.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/profile"
              className="inline-block px-8 py-4 bg-gradient-to-r from-brand-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-brand-200 dark:shadow-brand-900/30 min-h-[44px]"
            >
              Create Profile →
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/rooms"
              className="inline-block px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[44px]"
            >
              Browse Rooms
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Features grid */}
      <div className="max-w-5xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-10"
        >
          Why RoomSync?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 cursor-default transition-shadow"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA strip */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto px-4 text-center py-12 bg-gradient-to-r from-brand-600 to-purple-600 rounded-2xl"
      >
        <h2 className="text-2xl font-bold text-white mb-3">Ready to find your perfect roommate?</h2>
        <p className="text-brand-100 mb-6">Join thousands of users who found their ideal living situation with RoomSync.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/signup" className="px-6 py-3 bg-white text-brand-700 rounded-xl font-semibold hover:bg-brand-50 transition-colors min-h-[44px] flex items-center justify-center">
            Get Started Free
          </Link>
          <Link to="/match" className="px-6 py-3 border border-white/40 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors min-h-[44px] flex items-center justify-center">
            Try the Matcher
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

