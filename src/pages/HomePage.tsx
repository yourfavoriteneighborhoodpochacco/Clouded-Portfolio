import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import { WritingCard } from '../components/WritingCard';

export const HomePage = () => {
  const { config, publishedPosts } = useCMS();
  const heroRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullTitle = config.title;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setTypedText('');
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullTitle.length) {
        setTypedText(fullTitle.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [fullTitle]);

  useEffect(() => {
    const handler = () => {
      if (heroRef.current) {
        const y = window.scrollY;
        heroRef.current.style.transform = `translateY(${y * 0.2}px)`;
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const featuredPosts = publishedPosts.filter(p => p.featured).slice(0, 2);
  const recentPosts = publishedPosts.filter(p => !featuredPosts.find(f => f.id === p.id)).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 right-10 md:right-20 w-64 h-64 rounded-full bg-sienna/5 blur-3xl" />
          <div className="absolute bottom-1/3 left-10 w-48 h-48 rounded-full bg-sage/8 blur-2xl" />
          <div
            className="absolute top-0 left-[42%] w-px bg-gradient-to-b from-transparent via-dust/60 to-transparent"
            style={{ height: '100vh' }}
          />
        </div>

        <div ref={heroRef} className="relative max-w-5xl mx-auto px-6 md:px-10 pt-32 pb-20">
          <div
            className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-sienna" />
              <span className="font-mono text-xs text-sienna/80 uppercase tracking-widest">
                {config.location}
              </span>
            </div>

            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-medium text-ink leading-none tracking-tight mb-6">
              {config.name}
            </h1>

            <div className="flex items-center gap-2 mb-10">
              <p className="font-body text-lg md:text-xl text-ink/60 italic">
                {typedText}
                <span className="inline-block w-0.5 h-5 bg-sienna ml-0.5 align-middle animate-cursor-blink" />
              </p>
            </div>

            <p className="font-body text-base md:text-lg text-ink/60 leading-relaxed max-w-xl mb-12 text-balance">
              {config.bio}
            </p>

            <div className="flex items-center gap-6">
              <Link
                to="/writing"
                className="group inline-flex items-center gap-2 font-body text-sm text-ink border-b border-ink/30 pb-0.5 hover:border-sienna hover:text-sienna transition-all duration-200"
              >
                view my work
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                to="/about"
                className="font-body text-sm text-ink/50 hover:text-ink transition-colors duration-200"
              >
                about me
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="font-mono text-xs uppercase tracking-widest">scroll</span>
          <div className="w-px h-10 bg-ink/30 relative overflow-hidden">
            <div className="absolute top-0 w-full h-1/2 bg-ink animate-bounce" />
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredPosts.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 md:px-10 py-20">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-8 h-px bg-sienna" />
              <h2 className="font-mono text-xs uppercase tracking-widest text-sienna/80">Featured Projects</h2>
            </div>
            <Link
              to="/writing"
              className="font-mono text-xs text-ink/40 hover:text-sienna transition-colors duration-200"
            >
              all work →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {featuredPosts.map(post => (
              <WritingCard key={post.id} post={post} variant="featured" />
            ))}
          </div>
        </section>
      )}

      {/* More work list */}
      {recentPosts.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 md:px-10 py-10 mb-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-px bg-dust" />
            <h2 className="font-mono text-xs uppercase tracking-widest text-ink/40">More Work</h2>
          </div>

          <div>
            {recentPosts.map(post => (
              <WritingCard key={post.id} post={post} variant="compact" />
            ))}
          </div>

          <div className="mt-8">
            <Link
              to="/writing"
              className="group inline-flex items-center gap-2 font-body text-sm text-ink/50 hover:text-sienna transition-colors duration-200"
            >
              view all projects
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </section>
      )}

      {/* Bottom statement */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 py-16 border-t border-dust/40">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="font-display text-3xl md:text-4xl text-ink leading-snug italic">
              A lot of things are happening in the world. Don't forget you are happening to the world too.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <p className="font-body text-sm text-ink/60 leading-relaxed">
              so erm...recruiters. i'm actively seeking software engineering internships. and ummm... regular people. follow my journey as i fulfill my great prophecy (pursuing a software engineering career).
            </p>
            {config.email && (
              <a
                href={`mailto:${config.email}`}
                className="group inline-flex items-center gap-2 font-body text-sm text-sienna"
              >
                get in touch
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
