# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Md. Mahsin-Ul-Islam, a software engineer and researcher. Static HTML/CSS/JavaScript site with PWA features, deployed on GitHub Pages.

**Key Architecture**: Content is data-driven via JSON files. To add case studies, blog posts, events, products, or site-wide settings, edit JSON — no HTML modification needed.

## Development Commands

### Local Testing
```bash
# Required for testing fetch() calls to JSON files
python -m http.server 8000
# Then visit http://localhost:8000
```

### Deployment
```bash
git add .
git commit -m "description"
git push origin main
# GitHub Pages auto-rebuilds in ~2 minutes
```

## Architecture & Structure

### Content Management (Data-Driven)
- **Case studies**: `data/case-studies.json` → rendered by `js/render-case-studies.js` (index + work)
- **Blog posts**: `data/blogs.json` → each post has corresponding HTML file in `blog/`
- **Events/certificates**: `data/events.json` → rendered by `js/render-events.js` (index)
- **Digital products**: `data/products.json` → `products.html` (catalog + `?slug=` demo pages)
- **Site settings**: `data/site-config.json` → notice bar, featured video, brand URLs, lifestyle section via `js/render-site-config.js`
- **Adding content**: Edit JSON only. The JavaScript builds the page automatically.

### Key Files
- `index.html` — Main portfolio page with inline styles
- `blog.html` — Blog listing (JSON + Medium RSS, paginated)
- `services.html` — Services, courses, digital products, payments
- `work.html` — Projects/work showcase (own inline renderer)
- `products.html` — Digital products catalog + demo pages
- `js/common.js` — Shared year/theme/mobile-nav/modal-focus helpers (all pages)
- `js/render-case-studies.js` — Dynamic case study rendering with galleries, impact bars, count-up
- `js/render-events.js` — Data-driven events/certificates with popup modal
- `js/render-site-config.js` — Notice bar + featured-video facade + lifestyle
- `service-worker.js` — PWA offline cache (network-first for `/data/*`)
- `site.webmanifest` — PWA manifest

### JavaScript Features
- Intersection observer for scroll-triggered animations
- Video lightbox + click-to-play facades (privacy-enhanced `youtube-nocookie`)
- Gallery carousel for case study images
- Count-up animations for numeric metrics only (never clobbers text values)
- Dynamic content loading from JSON
- Settings-driven dismissible notice bar

### Styling
- All CSS is inline in HTML files (no separate CSS files)
- CSS custom properties (variables) for theming
- Dark default + light mode via `data-theme` on `<html>`
- Responsive design with mobile-first approach
- Font Awesome icons via CDN

### Theme System (all pages)
- Pre-paint head script reads `localStorage.theme` before first render (no flash)
- Toggle wired by `js/common.js` — targets `document.documentElement`
- GSAP-CDN failure fallback: `html.no-gsap` force-shows all `.reveal` content

## Adding New Case Studies

1. Edit `data/case-studies.json`
2. Copy an existing entry block and modify
3. Fields: `id`, `number`, `category`, `title`, `role`, `problem`, `approach`, `metrics`, `tech`, `links`
4. Optional: `image` (path to screenshot), `video` (YouTube ID), `gallery` (array of images), `impact`, `diagram`
5. See `HOW_TO_ADD_CASE_STUDIES.md` for complete reference

## Adding Blog Posts

1. Create HTML file in `blog/` directory (e.g., `your-post-slug.html`) — copy an existing template
2. Update its `<title>`, meta tags, `const slug`, and the `.catch()` fallback text
3. Add entry to `data/blogs.json`
4. Update `sitemap.xml` and `rss.xml`

## Important Notes

### Local Development
- Must use local server for JSON `fetch()` calls to work (browsers block file:// fetches)
- Direct file opening of HTML will break dynamic content loading

### Deployment
- Target branch: `main` (GitHub Pages source)
- Auto-deploys on push to main
- Takes ~2 minutes to rebuild
- This folder is not a git repo yet — see `DEPLOYMENT.md` for `git init` + push steps

### Performance
- PWA with service worker caching
- Images should be optimized (< 300KB each)
- Lazy loading for case study images
- Lighthouse score targets: 90+ performance

### Content Philosophy
- Case studies show real impact with metrics
- Placeholder metrics allowed (set `"placeholder": true`) — never fabricate values
- Honest status indicators ("In development", "Shipped", etc.)
- No invented testimonials, achievements, or events

## Existing Documentation

- `AI_PROJECT_MEMORY.md` — **authoritative architecture memory + gap analysis + phased roadmap + changelog**
- `HOW_TO_ADD_CASE_STUDIES.md` — Detailed case study guide
- `DEPLOYMENT.md` — Deployment procedures
- `ACCOUNTS.md` — Account information
- `AGENTS.md` — AI agent instructions (same rules, agent-tool flavor)

## Tech Stack Summary

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (no frameworks)
- **Hosting**: GitHub Pages
- **PWA**: Service worker, web manifest
- **Icons**: Font Awesome (CDN)
- **Fonts**: Google Fonts (via CDN)
- **Animation**: GSAP + ScrollTrigger (CDN, with no-JS/no-CDN fallbacks)
- **No build tools required** — direct file editing and deployment
