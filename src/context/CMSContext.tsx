import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { WritingPost, SiteConfig } from '../types';
import { defaultConfig } from '../data/defaultConfig';
import { supabase } from '../lib/supabase';

const AUTH_KEY = 'portfolio_auth';

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: Change this to your real password, then commit and redeploy.
// This is the single source-of-truth password for ALL devices / visitors.
// ─────────────────────────────────────────────────────────────────────────────
const CMS_PASSWORD = 'writer2024';

interface CMSContextType {
  posts: WritingPost[];
  config: SiteConfig;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (password: string) => boolean;
  logout: () => void;
  createPost: (post: Omit<WritingPost, 'id'>) => Promise<WritingPost | null>;
  updatePost: (id: string, post: Partial<WritingPost>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  updateConfig: (config: Partial<SiteConfig>) => void;
  getPost: (slug: string) => WritingPost | undefined;
  publishedPosts: WritingPost[];
}

const CMSContext = createContext<CMSContextType | null>(null);

// Map Supabase row → WritingPost
const rowToPost = (row: Record<string, unknown>): WritingPost => ({
  id:          String(row.id),
  title:       String(row.title),
  slug:        String(row.slug),
  excerpt:     String(row.excerpt ?? ''),
  content:     String(row.content ?? ''),
  category:    String(row.category ?? ''),
  tags:        Array.isArray(row.tags) ? (row.tags as string[]) : [],
  publishedAt: String(row.published_at),
  featured:    Boolean(row.featured),
  readingTime: Number(row.reading_time ?? 1),
});

// Map WritingPost → Supabase insert/update shape
const postToRow = (post: Omit<WritingPost, 'id'>) => ({
  title:        post.title,
  slug:         post.slug,
  excerpt:      post.excerpt,
  content:      post.content,
  category:     post.category,
  tags:         post.tags,
  published_at: post.publishedAt,
  featured:     post.featured,
  reading_time: post.readingTime,
});

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<WritingPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Config lives in defaultConfig.ts — edit that file and redeploy
  const [config] = useState<SiteConfig>(defaultConfig);

  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    sessionStorage.getItem(AUTH_KEY) === 'true'
  );

  // ── Load all posts from Supabase on mount ──────────────────────
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from('posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (err) {
        setError(err.message);
      } else {
        setPosts((data ?? []).map(rowToPost));
      }
      setLoading(false);
    };

    fetchPosts();

    // Real-time subscription — new/updated/deleted posts appear instantly
    const channel = supabase
      .channel('posts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // ── Auth ───────────────────────────────────────────────────────
  const login = useCallback((password: string): boolean => {
    if (password === CMS_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_KEY);
  }, []);

  // ── CRUD ───────────────────────────────────────────────────────
  const createPost = useCallback(async (postData: Omit<WritingPost, 'id'>): Promise<WritingPost | null> => {
    const { data, error: err } = await supabase
      .from('posts')
      .insert(postToRow(postData))
      .select()
      .single();

    if (err) { setError(err.message); return null; }
    const newPost = rowToPost(data);
    setPosts(prev => [newPost, ...prev]);
    return newPost;
  }, []);

  const updatePost = useCallback(async (id: string, updates: Partial<WritingPost>) => {
    const row: Record<string, unknown> = {};
    if (updates.title       !== undefined) row.title        = updates.title;
    if (updates.slug        !== undefined) row.slug         = updates.slug;
    if (updates.excerpt     !== undefined) row.excerpt      = updates.excerpt;
    if (updates.content     !== undefined) row.content      = updates.content;
    if (updates.category    !== undefined) row.category     = updates.category;
    if (updates.tags        !== undefined) row.tags         = updates.tags;
    if (updates.publishedAt !== undefined) row.published_at = updates.publishedAt;
    if (updates.featured    !== undefined) row.featured     = updates.featured;
    if (updates.readingTime !== undefined) row.reading_time = updates.readingTime;

    const { error: err } = await supabase.from('posts').update(row).eq('id', id);
    if (err) { setError(err.message); return; }
    setPosts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deletePost = useCallback(async (id: string) => {
    const { error: err } = await supabase.from('posts').delete().eq('id', id);
    if (err) { setError(err.message); return; }
    setPosts(prev => prev.filter(p => p.id !== id));
  }, []);

  // Config updates are local-only (edit defaultConfig.ts + redeploy for permanent changes)
  const updateConfig = useCallback((_updates: Partial<SiteConfig>) => {
    // no-op for now — config is hardcoded in defaultConfig.ts
  }, []);

  const getPost = useCallback((slug: string) => {
    return posts.find(p => p.slug === slug);
  }, [posts]);

  const publishedPosts = [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <CMSContext.Provider value={{
      posts,
      config,
      isAuthenticated,
      loading,
      error,
      login,
      logout,
      createPost,
      updatePost,
      deletePost,
      updateConfig,
      getPost,
      publishedPosts,
    }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const ctx = useContext(CMSContext);
  if (!ctx) throw new Error('useCMS must be used within CMSProvider');
  return ctx;
};
