import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useCMS } from '../context/CMSContext';
import type { WritingPost } from '../types';
import {
  Plus, Edit3, Trash2, Eye, Settings, LogOut,
  Save, X, ArrowLeft, ToggleLeft, ToggleRight, AlertCircle, Loader2
} from 'lucide-react';

// ── Helpers ─────────────────────────────────────────────────────────
const slugify = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80);

const estimateReading = (content: string) => Math.max(1, Math.ceil(content.split(/\s+/).length / 200));

// ── Post Editor ─────────────────────────────────────────────────────
interface EditorProps {
  post?: WritingPost;
  onSave: (data: Omit<WritingPost, 'id'>) => Promise<void>;
  onCancel: () => void;
}

const PostEditor = ({ post, onSave, onCancel }: EditorProps) => {
  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [category, setCategory] = useState(post?.category ?? 'Project');
  const [tags, setTags] = useState(post?.tags.join(', ') ?? '');
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [slugManual, setSlugManual] = useState(!!post?.slug);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slugManual && title) setSlug(slugify(title));
  }, [title, slugManual]);

  const readingTime = estimateReading(content);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    await onSave({
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      excerpt: excerpt.trim() || content.slice(0, 160) + '...',
      content: content.trim(),
      category: category.trim() || 'Project',
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      publishedAt: post?.publishedAt ?? new Date().toISOString(),
      featured,
      readingTime,
    });
    setSaving(false);
  };

  const categories = ['Project', 'Internship', 'Hobby', 'Open Source', 'Research', 'Hackathon', 'Course Work', 'Other'];

  return (
    <div className="min-h-screen bg-cream">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-dust/60 px-6 py-3 flex items-center justify-between">
        <button onClick={onCancel} className="group inline-flex items-center gap-2 font-mono text-xs text-ink/40 hover:text-ink transition-colors">
          <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
          back
        </button>

        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-ink/30">{readingTime} min · {content.split(/\s+/).filter(Boolean).length} words</span>
          <div className="flex gap-1">
            {(['write', 'preview'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`font-mono text-xs px-3 py-1.5 rounded-sm border transition-all ${tab === t ? 'bg-ink text-cream border-ink' : 'text-ink/50 border-dust/60 hover:border-ink/30'}`}>
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={handleSave}
            disabled={!title.trim() || !content.trim() || saving}
            className="inline-flex items-center gap-2 font-mono text-xs bg-sienna text-cream px-4 py-2 rounded-sm hover:bg-ink transition-colors disabled:opacity-30"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            {saving ? 'saving...' : 'save'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-10 py-10">
        {tab === 'write' ? (
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Project title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full font-display text-3xl md:text-4xl bg-transparent border-none outline-none text-ink placeholder-ink/20 leading-tight"
            />

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-mono text-xs text-ink/40 mb-1.5">slug</label>
                <input type="text" value={slug}
                  onChange={e => { setSlugManual(true); setSlug(e.target.value); }}
                  className="w-full font-mono text-xs bg-paper/60 border border-dust/50 rounded-sm px-3 py-2 text-ink/70 focus:outline-none focus:border-sienna/40" />
              </div>
              <div>
                <label className="block font-mono text-xs text-ink/40 mb-1.5">category</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full font-mono text-xs bg-paper/60 border border-dust/50 rounded-sm px-3 py-2 text-ink/70 focus:outline-none focus:border-sienna/40">
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-mono text-xs text-ink/40 mb-1.5">tags (comma separated)</label>
                <input type="text" placeholder="react, typescript, python" value={tags}
                  onChange={e => setTags(e.target.value)}
                  className="w-full font-mono text-xs bg-paper/60 border border-dust/50 rounded-sm px-3 py-2 text-ink/70 focus:outline-none focus:border-sienna/40" />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs text-ink/40 mb-1.5">excerpt / description</label>
              <textarea placeholder="A short description of what this project is and why it matters..."
                value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2}
                className="w-full font-body text-sm bg-paper/40 border border-dust/50 rounded-sm px-4 py-3 text-ink/70 focus:outline-none focus:border-sienna/40 resize-none italic placeholder-ink/25" />
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setFeatured(!featured)} className={`transition-colors ${featured ? 'text-sienna' : 'text-ink/30'}`}>
                {featured ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
              </button>
              <span className="font-mono text-xs text-ink/50">Featured on homepage</span>
            </div>

            <div className="border-t border-dust/40 pt-6" />

            <div>
              <label className="block font-mono text-xs text-ink/40 mb-3">content (markdown)</label>
              <textarea
                placeholder="Describe your project. Markdown supported — use ## for headings, **bold**, *italic*, > for callouts, - for lists..."
                value={content} onChange={e => setContent(e.target.value)} rows={30}
                className="w-full font-mono text-sm bg-transparent border-none outline-none text-ink/80 leading-relaxed resize-none placeholder-ink/20" />
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <span className="font-mono text-xs text-sienna/80 uppercase tracking-widest">{category}</span>
              <h1 className="font-display text-4xl text-ink mt-3 mb-3">{title || 'Untitled'}</h1>
              <p className="font-body text-lg text-ink/60 italic border-l-2 border-sienna pl-5">{excerpt}</p>
            </div>
            <div className="border-t border-dust/40 mb-8" />
            <div className="prose-writing">
              {content.split('\n').map((line, i) => {
                if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>;
                if (line.startsWith('# '))  return <h1 key={i}>{line.slice(2)}</h1>;
                if (line.startsWith('> '))  return <blockquote key={i}>{line.slice(2)}</blockquote>;
                if (line.startsWith('---')) return <hr key={i} />;
                if (line === '')            return <br key={i} />;
                return <p key={i}>{line}</p>;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Settings Panel
const SettingsPanel = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 bg-ink/20 backdrop-blur-sm flex justify-end">
    <div className="w-full max-w-md bg-cream h-full overflow-y-auto shadow-xl">
      <div className="sticky top-0 bg-cream border-b border-dust/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings size={14} className="text-sienna" />
          <h2 className="font-display text-lg">Settings</h2>
        </div>
        <button onClick={onClose} className="text-ink/40 hover:text-ink transition-colors"><X size={18} /></button>
      </div>

      <div className="px-6 py-8 space-y-6">
        <div className="bg-paper/60 border border-dust/40 rounded-sm p-5 space-y-3">
          <p className="font-mono text-xs text-ink/50 uppercase tracking-widest">Site Info & Password</p>
          <p className="font-body text-sm text-ink/70 leading-relaxed">
            Your name, bio, links, and CMS password are stored in source code — not the database. Edit these two files in VS Code, then push to GitHub to update everywhere:
          </p>
          <div className="space-y-2">
            <p className="font-mono text-xs bg-cream border border-dust/50 rounded px-3 py-2 text-ink/70">
              src/data/defaultConfig.ts
              <span className="text-ink/30 ml-2">— name, bio, links</span>
            </p>
            <p className="font-mono text-xs bg-cream border border-dust/50 rounded px-3 py-2 text-ink/70">
              .env / Vercel env vars
              <span className="text-ink/30 ml-2">— VITE_CMS_PASSWORD</span>
            </p>
          </div>
        </div>

        <div className="bg-paper/60 border border-dust/40 rounded-sm p-5 space-y-3">
          <p className="font-mono text-xs text-ink/50 uppercase tracking-widest">Posts / Database</p>
          <p className="font-body text-sm text-ink/70 leading-relaxed">
            All posts are stored in Supabase and are publicly visible to everyone instantly when you save them.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Admin Dash
export const AdminPage = () => {
  const { posts, isAuthenticated, loading, error, logout, createPost, updatePost, deletePost } = useCMS();
  const navigate = useNavigate();
  const [view, setView] = useState<'dashboard' | 'new' | 'edit'>('dashboard');
  const [editPost, setEditPost] = useState<WritingPost | undefined>();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  // Editor 
  if (view === 'new' || view === 'edit') {
    return (
      <>
        <PostEditor
          post={editPost}
          onSave={async data => {
            if (view === 'edit' && editPost) await updatePost(editPost.id, data);
            else await createPost(data);
            setView('dashboard');
            setEditPost(undefined);
          }}
          onCancel={() => { setView('dashboard'); setEditPost(undefined); }}
        />
        {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
      </>
    );
  }

  // Dashboard 
  const filtered = posts
    .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const featuredCount = posts.filter(p => p.featured).length;
  const totalWords = posts.reduce((acc, p) => acc + p.content.split(/\s+/).length, 0);

  return (
    <>
      <div className="min-h-screen bg-cream">
        {/* Top nav */}
        <div className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-dust/60 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-mono text-xs text-ink/40 hover:text-ink transition-colors">← site</Link>
            <span className="text-dust">·</span>
            <span className="font-display text-base text-ink">Content Manager</span>
            {loading && <Loader2 size={13} className="animate-spin text-ink/30" />}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setSettingsOpen(true)}
              className="inline-flex items-center gap-2 font-mono text-xs text-ink/40 hover:text-ink transition-colors px-3 py-1.5 border border-dust/60 rounded-sm hover:border-ink/30">
              <Settings size={12} />settings
            </button>
            <button onClick={logout}
              className="inline-flex items-center gap-2 font-mono text-xs text-ink/40 hover:text-sienna transition-colors px-3 py-1.5 border border-dust/60 rounded-sm hover:border-sienna/30">
              <LogOut size={12} />logout
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 md:px-10 py-10">
          {error && (
            <div className="flex items-center gap-3 bg-sienna/10 border border-sienna/30 rounded-sm px-4 py-3 mb-6">
              <AlertCircle size={14} className="text-sienna flex-shrink-0" />
              <p className="font-mono text-xs text-sienna">{error}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: 'Total Posts', value: posts.length },
              { label: 'Featured',    value: featuredCount },
              { label: 'Total Words', value: totalWords.toLocaleString() },
            ].map(stat => (
              <div key={stat.label} className="bg-paper/60 border border-dust/40 rounded-sm p-5">
                <p className="font-mono text-xs text-ink/30 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="font-display text-3xl text-ink">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="font-display text-xl text-ink">All Posts</h2>
              <input type="text" placeholder="search..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="font-mono text-xs bg-paper/60 border border-dust/50 rounded-sm px-3 py-1.5 text-ink/70 focus:outline-none focus:border-sienna/40 w-48" />
            </div>
            <button onClick={() => { setEditPost(undefined); setView('new'); }}
              className="inline-flex items-center gap-2 font-mono text-xs bg-sienna text-cream px-4 py-2 rounded-sm hover:bg-ink transition-colors">
              <Plus size={13} />new post
            </button>
          </div>

          {loading && posts.length === 0 ? (
            <div className="py-20 text-center">
              <Loader2 size={20} className="animate-spin text-ink/20 mx-auto mb-3" />
              <p className="font-mono text-xs text-ink/30">loading from database...</p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="border border-dust/40 rounded-sm overflow-hidden">
              {filtered.map((post, i) => (
                <div key={post.id}
                  className={`flex items-center justify-between gap-4 px-5 py-4 ${i < filtered.length - 1 ? 'border-b border-dust/30' : ''} hover:bg-paper/40 transition-colors group`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-display text-sm text-ink truncate">{post.title}</span>
                      {post.featured && (
                        <span className="font-mono text-xs text-sienna/70 border border-sienna/30 px-1.5 py-0.5 rounded-sm flex-shrink-0">★ featured</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-ink/30">{post.category}</span>
                      <span className="text-dust text-xs">·</span>
                      <span className="font-mono text-xs text-ink/30">{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
                      <span className="text-dust text-xs">·</span>
                      <span className="font-mono text-xs text-ink/30">{post.readingTime} min</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <Link to={`/writing/${post.slug}`} target="_blank"
                      className="p-1.5 text-ink/40 hover:text-sage transition-colors" title="View">
                      <Eye size={14} />
                    </Link>
                    <button onClick={() => { setEditPost(post); setView('edit'); }}
                      className="p-1.5 text-ink/40 hover:text-ink transition-colors" title="Edit">
                      <Edit3 size={14} />
                    </button>
                    {deleteConfirm === post.id ? (
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs text-sienna">sure?</span>
                        <button onClick={() => { deletePost(post.id); setDeleteConfirm(null); }}
                          className="font-mono text-xs text-sienna hover:underline">yes</button>
                        <button onClick={() => setDeleteConfirm(null)}
                          className="font-mono text-xs text-ink/40 hover:underline">no</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(post.id)}
                        className="p-1.5 text-ink/40 hover:text-sienna transition-colors" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-dust/30 rounded-sm">
              <p className="font-display text-2xl text-ink/20 italic mb-2">No posts yet.</p>
              <button onClick={() => setView('new')}
                className="font-mono text-sm text-sienna hover-underline mt-2">
                add your first project →
              </button>
            </div>
          )}
        </div>
      </div>

      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
    </>
  );
};