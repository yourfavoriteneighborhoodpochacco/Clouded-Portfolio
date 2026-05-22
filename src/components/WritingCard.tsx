import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import type { WritingPost } from '../types';

interface WritingCardProps {
  post: WritingPost;
  variant?: 'default' | 'featured' | 'compact';
}

export const WritingCard = ({ post, variant = 'default' }: WritingCardProps) => {
  const date = format(new Date(post.publishedAt), 'MMM d, yyyy');

  if (variant === 'compact') {
    return (
      <Link to={`/writing/${post.slug}`} className="group block">
        <div className="flex items-start justify-between gap-4 py-4 border-b border-dust/60 hover:border-sienna/40 transition-colors duration-200">
          <div className="flex-1 min-w-0">
            <p className="font-display text-base text-ink group-hover:text-sienna transition-colors duration-200 leading-snug">
              {post.title}
            </p>
            <p className="font-mono text-xs text-ink/40 mt-1">{post.category}</p>
          </div>
          <span className="font-mono text-xs text-ink/30 whitespace-nowrap pt-0.5">{date}</span>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link to={`/writing/${post.slug}`} className="group block">
        <article className="p-8 bg-paper/60 border border-dust/60 rounded-sm writing-card-hover group-hover:border-sienna/30 transition-all duration-300">
          <div className="flex items-center gap-3 mb-5">
            <span className="font-mono text-xs text-sienna/80 uppercase tracking-widest">{post.category}</span>
            <span className="text-dust">·</span>
            <span className="font-mono text-xs text-ink/40">{date}</span>
            <span className="text-dust">·</span>
            <span className="font-mono text-xs text-ink/40">{post.readingTime} min read</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-ink group-hover:text-sienna transition-colors duration-300 leading-snug mb-4">
            {post.title}
          </h2>
          <p className="font-body text-ink/65 leading-relaxed line-clamp-3 mb-5">
            {post.excerpt}
          </p>
          <span className="font-mono text-sm text-sienna group-hover:gap-2 flex items-center gap-1.5 transition-all duration-200">
            view project <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </span>
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/writing/${post.slug}`} className="group block">
      <article className="py-7 border-b border-dust/60 hover:border-sienna/30 transition-colors duration-200">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-xs text-sienna/80 uppercase tracking-widest">{post.category}</span>
          <span className="text-dust">·</span>
          <span className="font-mono text-xs text-ink/40">{date}</span>
          <span className="text-dust">·</span>
          <span className="font-mono text-xs text-ink/40">{post.readingTime} min</span>
        </div>
        <h2 className="font-display text-xl md:text-2xl text-ink group-hover:text-sienna transition-colors duration-200 leading-snug mb-2">
          {post.title}
        </h2>
        <p className="font-body text-sm text-ink/60 leading-relaxed line-clamp-2">{post.excerpt}</p>
      </article>
    </Link>
  );
};
