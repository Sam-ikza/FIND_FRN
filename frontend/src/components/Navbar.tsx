import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useUserStore } from '../store/userStore';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useUserStore((s) => s.currentUser);
  const { isDark, toggleDark } = useThemeStore();
  const { isAuthenticated, authUser, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/profile', label: 'Profile' },
    { to: '/rooms', label: 'Rooms' },
    { to: '/match', label: 'Find Match' },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const initials = (name: string) =>
    name.split(' ').filter(n => n.length > 0).map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-brand-700 dark:text-brand-400">
          <span className="text-2xl">🏠</span> RoomSync
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <motion.div key={l.to} whileHover={{ scale: 1.05 }}>
              <Link
                to={l.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === l.to
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {l.label}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleDark}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle dark mode"
          >
            {isDark ? '☀️' : '🌙'}
          </motion.button>

          {/* Auth section */}
          {isAuthenticated && authUser ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                {initials(authUser.name)}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{authUser.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 ml-1 min-h-[44px] px-2"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[44px] flex items-center"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-brand-600 to-purple-600 rounded-lg hover:opacity-90 transition-opacity min-h-[44px] flex items-center"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Show current user (legacy) if logged in via profile */}
          {!isAuthenticated && currentUser && (
            <div className="hidden md:block text-sm text-gray-500 dark:text-gray-400">
              As: <span className="font-semibold text-gray-800 dark:text-gray-200">{currentUser.name}</span>
            </div>
          )}

          {/* Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] flex items-center ${
                    location.pathname === l.to
                      ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                {isAuthenticated && authUser ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                      Signed in as <strong>{authUser.name}</strong>
                    </div>
                    <button
                      onClick={() => { handleLogout(); setMenuOpen(false); }}
                      className="block w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg min-h-[44px]"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg min-h-[44px] flex items-center">Login</Link>
                    <Link to="/signup" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg min-h-[44px] flex items-center">Sign Up</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

