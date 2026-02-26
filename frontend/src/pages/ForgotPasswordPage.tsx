import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { forgotPassword, authLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    try {
      await forgotPassword(email);
      setSent(true);
      toast.success('Reset instructions sent!');
    } catch {
      toast.error('Something went wrong. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔐</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Forgot password?</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Enter your email and we'll send a reset link</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          {sent ? (
            <div className="text-center py-4 space-y-4">
              <div className="text-4xl">📧</div>
              <p className="text-gray-700 dark:text-gray-300">If that email exists, you'll receive a reset link shortly.</p>
              <Link
                to="/login"
                className="inline-block mt-4 px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-gradient-to-r from-brand-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 min-h-[44px]"
              >
                {authLoading ? 'Sending...' : 'Send Reset Link'}
              </motion.button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Remember your password?{' '}
                <Link to="/login" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
