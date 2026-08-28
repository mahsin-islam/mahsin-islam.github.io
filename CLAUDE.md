# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Md. Mahsin-Ul-Islam, a software engineer and researcher. 100% static HTML/CSS/vanilla-JS site with PWA features, deployed on GitHub Pages.

**No build system, no package.json, no tests — do not scaffold tooling.** Plain files are served as-is; the only workflow is edit + push.

**Key architecture**: Content is data-driven via JSON files in `data/`. Renderers in `js/` fetch the JSON at runtime and build the DOM. To add case studies, blog posts, events, products, or site-wide settings, edit JSON — no HTML modification needed.

## Development Commands

### Local Testing
```bash
python -m http.server 8000
# Then visit http://localhost:8000
```
`fetch()` of JSON is blocked on `file://` — always test through a local server.

### Deployment
`origin` already points at the Pages repository (`MAHSIN-ISLAM/MAHSIN-ISLAM.github.io`):
```bash
git add . && git commit -m "description" && git push origin main
# GitHub Pages auto-rebuilds in ~2 minutes
```
Verify with a hard refresh (Ctrl+Shift+R) — the service worker caches static assets. See `DEPLOYMENT.md` for first-push details.

## Architecture & Structure

### Content pipeline (JSON → renderer → page)

| Content | Edit | Rendered by | Where it appears |
|---|---|---|---|
| Case studies | `data/case-studies.json` | `js/render-case-studies.js` | `index.html` + `work.html` (same shared renderer; each page has its own inline detail modal) |
| Events/certificates | `data/events.json` | `js/render-events.js` | `index.html` (`#events-list`, popup `#certificate-modal`) |
| Blog posts | `data/blogs.json` | inline script in `blog.html` (+ Medium RSS via rss2json proxy) | `blog.html` listing + one SEO shell per post in `blog/` |
| Digital products | `data/products.json` | inline script in `products.html` | catalog + demo pages at `products.html?slug=<id>` |
| Site settings | `data/site-config.json` | `js/render-site-config.js` | notice bar, featured-video facade, lifestyle grid, courses (`index.html`) |
| YouTube course feed | `data/youtube.json` (generated) | `js/render-site-config.js` | `#courses` on `index.html` |

Content rules:
- **Edit JSON only.** Never hardcode case studies, products, or events into HTML. Array order = display order.
- JSON must stay valid (no comments, no trailing commas) — a parse failure empties the section (renderers fail soft with an error card / no-op).
- All JSON text fields are HTML-escaped by renderers (XSS-safe). Exception: blog post `content` is injected as raw HTML — trusted author content only.
- Placeholder metrics: `"placeholder": true` renders muted em-dashes — never fabricate values.

### Shared JS layer
- `js/common.js` — loaded on **every** page: footer year (`#year`), theme init/toggle, mobile nav wiring, `window.__a11y` modal-focus helpers (`saveFocus`/`focusFirst`/`restoreFocus`). Never re-implement these inline.
- `js/search.js` — shared search engine (180 ms debounce, lazily-built index). Any page containing the `.search-wrap` markup calls `initSiteSearch({ seeds, dataFiles })`. Never write inline search code. Used by index/blog/work/services.
- `js/render-case-studies.js` — fetches into `#case-study-list`: glassmorphism cards, gallery carousel, video lightbox, before/after impact bars, count-up (numeric metrics only), collapsible diagrams. Dispatches `case-studies:rendered` when done.
- `js/render-events.js` — fetches into `#events-list`; dispatches `events:rendered`.
- `js/render-site-config.js` — everything settings-driven from `data/site-config.json`; safe no-op if the JSON is missing or invalid.

**Renderer contract** — when touching `index.html`, `work.html`, or a renderer, preserve:
- `.reveal` class on generated entries and the `case-studies:rendered` / `events:rendered` events (inline scripts listen for these to re-run GSAP reveals + `ScrollTrigger.refresh()`)
- the `<noscript>` fallback inside `#case-study-list`
- relative fetch paths (`data/*.json` from root pages, `../data/*.json` from `blog/` posts)
- modal focus management via `window.__a11y`, plus `role="dialog"` / `aria-modal` / `aria-live` on search results

### YouTube feed pipeline (self-activating)
`.github/workflows/feeds.yml` runs every 6 hours: it reads `youtube.channelId` from `data/site-config.json` and, only if set, fetches the channel RSS and commits a refreshed `data/youtube.json`. It is inert until a channel ID is added — no secrets, no API key. Client-side priority: prebuilt `data/youtube.json` → live channel RSS → static fallback card.

### Theme system (all pages)
- Dark default; light mode via `data-theme="light"` on `<html>`, driven by CSS custom properties.
- A tiny pre-paint head script on every page reads `localStorage.theme` before first render (no flash). The toggle is wired only by `js/common.js` (targets `document.documentElement`, guards `localStorage`).
- GSAP-CDN failure fallback: main scripts add `html.no-gsap`, which force-shows all `.reveal` content. Never ship CSS that can hide content permanently.

### Styling
- All CSS is inline in HTML files (no separate CSS files); mobile-first responsive.
- Font Awesome, Google Fonts, and GSAP + ScrollTrigger via CDN (with the no-gsap fallback above).

## Adding Blog Posts

1. Create `blog/<slug>.html` from an existing post template — update `<title>`, meta tags, the `const slug`, and the `.catch()` fallback text.
2. Add an entry to `data/blogs.json` (`content` is an HTML string).
3. Update `sitemap.xml` and `rss.xml`.

For case studies, see `HOW_TO_ADD_CASE_STUDIES.md` (full field reference: `gallery`, `impact`, `diagram`; `video` is a YouTube video **ID**, not a URL).

## Important Notes

- **Service worker** (`service-worker.js`, cache `portfolio-v4`): network-first for `/data/*` (edits appear immediately), cache-first for other same-origin GETs, never caches POST/cross-origin/API calls. **Bump the `CACHE` name when changing the precache list**, or returning visitors keep the old cache.
- **Ads/monetization scripts are intentionally absent.** If re-adding later, blog pages only — never index/work/services/products.
- `_archive/` is a local git-ignored dump of legacy docs — never edit or deploy it.
- Images should be optimized (< 300 KB each); lazy loading for JSON-driven images.
- Lighthouse target: 90+ performance.

### Content Philosophy
- Case studies show real impact with metrics; placeholder metrics allowed (`"placeholder": true`) — never fabricate values.
- Honest status indicators ("In development", "Shipped", etc.).
- No invented testimonials, achievements, or events.

## Existing Documentation

- `AI_PROJECT_MEMORY.md` — **authoritative architecture memory + gap analysis + phased roadmap + changelog** (read before big changes)
- `AGENTS.md` — same rules in agent-tool flavor, plus a full file map and integration register
- `HOW_TO_ADD_CASE_STUDIES.md` — case-study field reference
- `DEPLOYMENT.md` — deployment + maintenance
- `ACCOUNTS.md` — third-party accounts to create and where keys go
- `DATA_NEEDED.md` — prioritized checklist of content/assets the owner supplies
