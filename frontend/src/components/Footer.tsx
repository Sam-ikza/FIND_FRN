import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-xl font-bold text-amber-600 dark:text-amber-400 mb-2">
              <span className="text-2xl">🪺</span> NestBud
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Find your bud, find your nest.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/rooms', 'Browse Rooms'], ['/match', 'Find Match'], ['/profile', 'Profile']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              {[['/login', 'Login'], ['/signup', 'Sign Up']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            © 2026 NestBud. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xl cursor-pointer hover:scale-110 transition-transform">🐦</span>
            <span className="text-xl cursor-pointer hover:scale-110 transition-transform">💼</span>
            <span className="text-xl cursor-pointer hover:scale-110 transition-transform">🐙</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
