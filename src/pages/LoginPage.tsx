import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import { Eye, EyeOff } from 'lucide-react';

export const LoginPage = () => {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useCMS();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/admin');
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const ok = login(password);
      if (ok) {
        navigate('/admin');
      } else {
        setError('Incorrect password. Try again.');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="w-8 h-px bg-sienna mx-auto mb-4" />
          <h1 className="font-display text-3xl text-ink mb-2">CMS Login</h1>
          <p className="font-body text-sm text-ink/50">Enter your password to manage content</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              className="w-full font-mono text-sm bg-paper/60 border border-dust/60 rounded-sm px-4 py-3 text-ink placeholder-ink/30 focus:outline-none focus:border-sienna/40 transition-colors pr-10"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink transition-colors"
            >
              {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          {error && (
            <p className="font-mono text-xs text-sienna">{error}</p>
          )}

          <button
            type="submit"
            disabled={!password || loading}
            className="w-full font-mono text-sm bg-ink text-cream py-3 rounded-sm hover:bg-sienna transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'entering...' : 'enter →'}
          </button>
        </form>

        <p className="font-mono text-xs text-ink/20 text-center mt-8">
          Default password: <span className="text-ink/40">writer2024</span>
          <br />Change it in the CMS settings after login.
        </p>
      </div>
    </div>
  );
};
