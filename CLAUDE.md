# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Md. Mahsin-Ul-Islam, a software engineer and researcher. Static HTML/CSS/JavaScript site with PWA features, deployed on GitHub Pages.

**Key Architecture**: Content is data-driven via JSON files. To add case studies or blog posts, edit JSON — no HTML modification needed.

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
- **Case studies**: `data/case-studies.json` → rendered by `js/render-case-studies.js`
- **Blog posts**: `data/blogs.json` → each post has corresponding HTML file in `blog/`
- **Adding content**: Edit JSON only. The JavaScript builds the page automatically.

### Key Files
- `index.html` — Main portfolio page with inline styles
- `blog.html` — Blog listing page
- `services.html` — Services offered
- `work.html` — Projects/work showcase
- `js/render-case-studies.js` — Dynamic case study rendering with intersection observer animations
- `service-worker.js` — PWA offline capability
- `site.webmanifest` — PWA manifest

### JavaScript Features
- Intersection observer for scroll-triggered animations
- Video lightbox for YouTube embeds
- Gallery carousel for case study images
- Count-up animations for metrics
- Dynamic content loading from JSON

### Styling
- All CSS is inline in HTML files (no separate CSS files)
- CSS custom properties (variables) for theming
- Responsive design with mobile-first approach
- Font Awesome icons via CDN

## Adding New Case Studies

1. Edit `data/case-studies.json`
2. Copy an existing entry block and modify
3. Fields: `id`, `number`, `category`, `title`, `role`, `problem`, `approach`, `metrics`, `tech`, `links`
4. Optional: `image` (path to screenshot), `video` (YouTube ID), `gallery` (array of images)
5. See `HOW_TO_ADD_CASE_STUDIES.md` for complete reference

## Adding Blog Posts

1. Create HTML file in `blog/` directory (e.g., `your-post-slug.html`)
2. Add entry to `data/blogs.json`
3. Fields: `id`, `slug`, `title`, `date`, `excerpt`, `content`, `category`, `tags`, `readTime`

## Important Notes

### Local Development
- Must use local server for JSON `fetch()` calls to work (browsers block file:// fetches)
- Direct file opening of HTML will break dynamic content loading

### Deployment
- Target branch: `main` (GitHub Pages source)
- Auto-deploys on push to main
- Takes ~2 minutes to rebuild

### Performance
- PWA with service worker caching
- Images should be optimized (< 300KB each)
- Lazy loading for case study images
- Lighthouse score targets: 90+ performance

### Content Philosophy
- Case studies show real impact with metrics
- Placeholder metrics allowed (set `"placeholder": true`)
- Focus on business problems and technical solutions
- Honest status indicators ("In development", "Shipped", etc.)

## Existing Documentation

This project has extensive documentation:
- `IMPLEMENTATION_GUIDE.md` — Complete setup instructions
- `HOW_TO_ADD_CASE_STUDIES.md` — Detailed case study guide
- `README_COMPLETE_DELIVERY.md` — Project overview and strategy
- `DEPLOYMENT.md` — Deployment procedures
- `ACCOUNTS.md` — Account information

## Tech Stack Summary

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (no frameworks)
- **Hosting**: GitHub Pages
- **PWA**: Service worker, web manifest
- **Icons**: Font Awesome (CDN)
- **Fonts**: Google Fonts (via CDN)
- **No build tools required** — direct file editing and deployment