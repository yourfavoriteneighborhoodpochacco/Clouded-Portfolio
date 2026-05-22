import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';

export const Nav = () => {
  const { config, isAuthenticated } = useCMS();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const links = [
    { to: '/', label: 'home' },
    { to: '/writing', label: 'works' },
    { to: '/about', label: 'about' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-cream/90 backdrop-blur-md border-b border-dust/60' : 'bg-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-10 flex items-center justify-between h-16">
        <Link to="/" className="font-display text-lg font-medium tracking-tight hover:text-sienna transition-colors duration-200">
          {config.name}
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`font-body text-sm tracking-wide hover-underline transition-colors duration-200 ${
                location.pathname === to ? 'text-sienna' : 'text-ink/70 hover:text-ink'
              }`}
            >
              {label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              to="/admin"
              className="font-mono text-xs px-3 py-1.5 bg-ink text-cream rounded-sm hover:bg-sienna transition-colors duration-200"
            >
              cms
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px bg-ink transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-px bg-ink transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-ink transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-cream/95 backdrop-blur-md border-b border-dust px-6 py-6 flex flex-col gap-5">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`font-display text-xl ${location.pathname === to ? 'text-sienna' : 'text-ink'}`}
            >
              {label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link to="/admin" className="font-mono text-sm text-sienna">cms →</Link>
          )}
        </div>
      </div>
    </nav>
  );
};
