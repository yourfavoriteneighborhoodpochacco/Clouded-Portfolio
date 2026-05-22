import { useState, useMemo } from 'react';
import { useCMS } from '../context/CMSContext';
import { WritingCard } from '../components/WritingCard';

export const WritingPage = () => {
  const { publishedPosts, loading } = useCMS();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => {
    const cats = new Set(publishedPosts.map(p => p.category));
    return ['all', ...Array.from(cats)];
  }, [publishedPosts]);

  const filtered = useMemo(() => {
    return publishedPosts.filter(post => {
      const matchesCat = activeCategory === 'all' || post.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some(t => t.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [publishedPosts, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-sienna" />
            <span className="font-mono text-xs text-sienna/80 uppercase tracking-widest">Works</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl text-ink leading-none mb-5">
            Projects & work
          </h1>
          <p className="font-body text-ink/60 leading-relaxed max-w-lg">
            A collection of projects, internships, and things I've built or contributed to. Spanning full-stack work, AI/ML experiments, and whatever's been keeping me up at night.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="search projects..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full font-mono text-sm bg-paper/60 border border-dust/60 rounded-sm px-4 py-2.5 text-ink placeholder-ink/30 focus:outline-none focus:border-sienna/40 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink transition-colors text-lg leading-none"
              >
                ×
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-mono text-xs px-3 py-1.5 rounded-sm border transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-ink text-cream border-ink'
                    : 'bg-transparent text-ink/50 border-dust/60 hover:border-ink/30 hover:text-ink'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="mb-6">
          <p className="font-mono text-xs text-ink/30">
            {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
            {activeCategory !== 'all' ? ` in ${activeCategory}` : ''}
            {searchQuery ? ` matching "${searchQuery}"` : ''}
          </p>
        </div>

        {/* Posts */}
        {loading && publishedPosts.length === 0 ? (
          <div className="space-y-0">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="py-7 border-b border-dust/40 animate-pulse">
                <div className="h-3 w-24 bg-dust/60 rounded mb-4" />
                <div className="h-6 w-3/4 bg-dust/40 rounded mb-2" />
                <div className="h-4 w-full bg-dust/20 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div>
            {filtered.map(post => (
              <WritingCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="font-display text-2xl text-ink/30 italic mb-2">Nothing found.</p>
            <p className="font-body text-sm text-ink/30">Try a different search or category.</p>
          </div>
        )}
      </div>
    </div>
  );
};
