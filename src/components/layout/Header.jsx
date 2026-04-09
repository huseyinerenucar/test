import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Users, Upload, Briefcase } from 'lucide-react';

export default function Header({ darkMode, toggleDarkMode }) {
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Candidates', Icon: Users },
    { to: '/upload', label: 'Upload CV', Icon: Upload },
  ];

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 no-underline group">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              <Briefcase size={18} className="text-white" />
            </div>
            <span
              className="text-lg font-semibold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              HR Desk
            </span>
          </Link>

          <nav className="flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="focus-ring flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium no-underline transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <link.Icon size={16} />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}

            <div
              className="w-px h-6 mx-2"
              style={{ backgroundColor: 'var(--border-color)' }}
            />

            <button
              onClick={toggleDarkMode}
              className="focus-ring p-2 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                color: 'var(--text-secondary)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
