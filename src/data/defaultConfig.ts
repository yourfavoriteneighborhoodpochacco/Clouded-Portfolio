import type { SiteConfig } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// FILL THIS IN — this is what every device/browser sees by default.
// After editing, commit and redeploy to Vercel. Changes here show up everywhere.
// (You can also override via the CMS Settings panel, but that's device-specific.)
// ─────────────────────────────────────────────────────────────────────────────
export const defaultConfig: SiteConfig = {
  name: 'Your Name',                          // e.g. 'Jane Smith'
  title: 'software engineering student',      // shows as typewriter on homepage
  bio: 'I build things for the web and think deeply about how technology shapes the world. Currently studying computer science and always working on something new.',
  location: 'Your City',                      // e.g. 'San Francisco, CA'
  email: 'hello@yourname.com',
  links: {
    github:    'https://github.com/yourhandle',
    instagram: 'https://instagram.com/yourhandle',
    linkedin:  'https://linkedin.com/in/yourhandle',
    spotify:   'https://open.spotify.com/user/yourhandle',
  },
  footerQuote: 'Build things. Break things. Learn everything.',
};
