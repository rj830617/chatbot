import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Meditations', path: '/meditations' },
  { label: 'Music Library', path: '/music' },
  { label: 'Profile', path: '/profile' },
];

export default function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 sticky top-0 z-20 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div>
          <Link className="text-xl font-semibold text-white" to="/">
            Meditation Audio Gen
          </Link>
          <p className="text-sm text-slate-400">Your audio meditation dashboard</p>
        </div>
        <nav className="flex items-center gap-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`rounded-full px-4 py-2 text-sm transition ${
                location.pathname === item.path
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="text-right text-sm text-slate-300">
            <div>{user?.name || user?.email}</div>
            <div className="text-slate-500">{user?.auth_provider}</div>
          </div>
          <button
            className="rounded-full bg-slate-700 px-4 py-2 text-sm text-white transition hover:bg-slate-600"
            onClick={signOut}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
