import { Link } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';

export const Footer = () => {
  const { config, isAuthenticated, logout } = useCMS();

  return (
    <footer className="border-t border-dust/60 bg-paper/40 mt-24">
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-16">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Quote */}
          <div className="md:col-span-2">
            <p className="font-display text-xl md:text-2xl text-ink/70 italic leading-relaxed">
              "{config.footerQuote}"
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <p className="font-mono text-xs text-ink/40 uppercase tracking-widest mb-2">say hi</p>
            {config.email && (
              <a href={`mailto:${config.email}`} className="font-body text-sm text-ink/70 hover:text-sienna transition-colors hover-underline">
                {config.email}
              </a>
            )}
            {config.links.github && (
              <a href={config.links.github} target="_blank" rel="noreferrer" className="font-body text-sm text-ink/70 hover:text-sienna transition-colors hover-underline">
                github
              </a>
            )}
            {config.links.instagram && (
              <a href={config.links.instagram} target="_blank" rel="noreferrer" className="font-body text-sm text-ink/70 hover:text-sienna transition-colors hover-underline">
                instagram
              </a>
            )}
            {config.links.linkedin && (
              <a href={config.links.linkedin} target="_blank" rel="noreferrer" className="font-body text-sm text-ink/70 hover:text-sienna transition-colors hover-underline">
                linkedin
              </a>
            )}
            {config.links.spotify && (
              <a href={config.links.spotify} target="_blank" rel="noreferrer" className="font-body text-sm text-ink/70 hover:text-sienna transition-colors hover-underline">
                spotify
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-dust/40 pt-6">
          <p className="font-mono text-xs text-ink/30">
            © {new Date().getFullYear()} {config.name}
          </p>
          <div className="flex items-center gap-6">
            <Link to="/" className="font-mono text-xs text-ink/30 hover:text-ink/60 transition-colors">home</Link>
            <Link to="/writing" className="font-mono text-xs text-ink/30 hover:text-ink/60 transition-colors">works</Link>
            <Link to="/about" className="font-mono text-xs text-ink/30 hover:text-ink/60 transition-colors">about</Link>
            {isAuthenticated ? (
              <>
                <Link to="/admin" className="font-mono text-xs text-sienna/70 hover:text-sienna transition-colors">cms</Link>
                <button onClick={logout} className="font-mono text-xs text-ink/30 hover:text-ink/60 transition-colors">logout</button>
              </>
            ) : (
              <Link to="/login" className="font-mono text-xs text-ink/30 hover:text-ink/60 transition-colors">login</Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
