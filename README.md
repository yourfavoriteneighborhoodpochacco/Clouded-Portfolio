# ✦ Portfolio — Writing CMS

A personal portfolio and writing CMS built with React, TypeScript, TailwindCSS, and Vite.

## Features
- **Writing CMS** — create, edit, delete essays with markdown support
- **Fullscreen editor** with live preview tab
- **Site settings** — update bio, name, location, social links from the UI
- **Password-protected admin** at `/admin`
- **Grain texture** + custom cursor for tactile feel
- Responsive, mobile-first design
- Filtered writing archive with search
- Featured essays on homepage

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## CMS

Visit `/admin` and log in. Default password: **writer2024**

> **Important:** Change your password in Settings before deploying publicly!

### What you can do in the CMS:
- Create / edit / delete posts
- Toggle posts as "featured" (shows on homepage)
- Update site name, bio, location, links
- Change your admin password

All content is stored in `localStorage` (browser storage). It persists across sessions on the same device/browser.

> **Note on data persistence:** localStorage is device-specific. If you want posts to survive across devices or browsers, consider swapping the storage layer in `src/context/CMSContext.tsx` for a backend like Supabase, PlanetScale, or a headless CMS.

## Customizing

- **Your info:** Log in → Settings panel
- **Sample posts:** Edit `src/data/defaultPosts.ts` (shown on first load)
- **Colors/fonts:** `tailwind.config.js` and `src/index.css`
- **About page reading list:** `src/pages/AboutPage.tsx`

## Deploy to Vercel

```bash
# 1. Push to GitHub (see Git instructions below)
# 2. Go to vercel.com → Import repository
# 3. Framework: Vite (auto-detected)
# 4. Deploy — done!
```

`vercel.json` handles SPA routing automatically.

## Git Instructions (copy-paste)

```bash
# In your project folder:
git init
git add .
git commit -m "init: portfolio + writing CMS"

# Create a repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```
