import { Link, useLocation } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

export default function Navbar() {
  const location = useLocation();
  const currentUser = useUserStore((s) => s.currentUser);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/profile', label: 'Profile' },
    { to: '/rooms', label: 'Rooms' },
    { to: '/match', label: 'Find Match' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-brand-700">
          <span className="text-2xl">🏠</span> RoomSync
        </Link>

        <div className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === l.to
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {currentUser && (
          <div className="text-sm text-gray-500">
            As: <span className="font-semibold text-gray-800">{currentUser.name}</span>
          </div>
        )}
        {!currentUser && <div className="text-sm text-gray-400">No profile selected</div>}
      </div>
    </nav>
  );
}
