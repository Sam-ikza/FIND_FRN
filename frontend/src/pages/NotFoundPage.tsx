import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="text-8xl">🏚️</div>
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">404</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400">Oops! This page doesn't exist.</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-brand-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          Go Home
        </Link>
      </motion.div>
    </div>
  );
}
