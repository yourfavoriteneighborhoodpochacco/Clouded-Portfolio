export interface WritingPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  publishedAt: string;
  featured: boolean;
  readingTime: number;
}

export interface SiteConfig {
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  links: {
    github?: string;
    instagram?: string;
    linkedin?: string;
    spotify?: string;
  };
  footerQuote: string;
}
