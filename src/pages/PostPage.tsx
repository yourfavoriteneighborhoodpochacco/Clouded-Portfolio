import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import { useCMS } from '../context/CMSContext';
import { ArrowLeft } from 'lucide-react';

export const PostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getPost, publishedPosts } = useCMS();
  const navigate = useNavigate();

  const post = slug ? getPost(slug) : undefined;

  if (!post) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
        <p className="font-display text-3xl text-ink/30 italic mb-4">Post not found.</p>
        <Link to="/writing" className="font-mono text-sm text-sienna hover-underline">← back to works</Link>
      </div>
    );
  }

  const date = format(new Date(post.publishedAt), 'MMMM d, yyyy');

  const idx = publishedPosts.findIndex(p => p.id === post.id);
  const prev = publishedPosts[idx + 1];
  const next = publishedPosts[idx - 1];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-6 md:px-10">
        <button
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2 font-mono text-xs text-ink/40 hover:text-sienna transition-colors duration-200 mb-12"
        >
          <ArrowLeft size={13} className="transition-transform duration-200 group-hover:-translate-x-1" />
          back
        </button>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="font-mono text-xs text-sienna/80 uppercase tracking-widest">{post.category}</span>
            <span className="text-dust">·</span>
            <span className="font-mono text-xs text-ink/40">{date}</span>
            <span className="text-dust">·</span>
            <span className="font-mono text-xs text-ink/40">{post.readingTime} min read</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-ink leading-tight mb-6">
            {post.title}
          </h1>

          <p className="font-body text-lg text-ink/60 leading-relaxed italic border-l-2 border-sienna pl-5">
            {post.excerpt}
          </p>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-6 flex-wrap">
              {post.tags.map(tag => (
                <span key={tag} className="font-mono text-xs text-ink/40 px-2 py-1 bg-paper/80 border border-dust/40 rounded-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Div */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-dust/60" />
          <div className="w-1 h-1 rounded-full bg-sienna" />
          <div className="flex-1 h-px bg-dust/60" />
        </div>

        {/* Content */}
        <div className="prose-writing">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* End mark */}
        <div className="flex justify-center my-16">
          <div className="flex items-center gap-3 text-ink/20">
            <div className="w-8 h-px bg-current" />
            <span className="font-mono text-xs">∎</span>
            <div className="w-8 h-px bg-current" />
          </div>
        </div>

        {/* Nav */}
        {(prev || next) && (
          <div className="grid grid-cols-2 gap-8 border-t border-dust/40 pt-10">
            {prev ? (
              <Link to={`/writing/${prev.slug}`} className="group">
                <p className="font-mono text-xs text-ink/30 uppercase tracking-widest mb-2">← previous</p>
                <p className="font-display text-base text-ink/70 group-hover:text-sienna transition-colors duration-200 leading-snug">
                  {prev.title}
                </p>
              </Link>
            ) : <div />}

            {next ? (
              <Link to={`/writing/${next.slug}`} className="group text-right">
                <p className="font-mono text-xs text-ink/30 uppercase tracking-widest mb-2">next →</p>
                <p className="font-display text-base text-ink/70 group-hover:text-sienna transition-colors duration-200 leading-snug">
                  {next.title}
                </p>
              </Link>
            ) : <div />}
          </div>
        )}
      </div>
    </div>
  );
};
