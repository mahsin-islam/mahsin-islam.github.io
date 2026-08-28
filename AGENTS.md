# AGENTS.md

Static single-page portfolio + blog + payments. **No build system, no package.json, no tests, no CI** — plain HTML/CSS/JS served as-is. Do not scaffold tooling.

## Structure

- `index.html` — the entire portfolio site: markup, all CSS (inline `<style>`), and the main inline script (GSAP animations, search, GitHub API, skill bars, visitor counter, typing effect, theme toggle, contact form via Formspree).
- `blog.html` — blog listing page. Fetches `data/blogs.json` + Medium RSS proxy, renders post cards, paginates. Cards link to individual SEO-friendly pages in `blog/`.
- `services.html` — consulting offerings, bKash/Nagad/Rocket QR payment page, and international gateway comparison table (Wise, Payoneer, Stripe, LianLianPay, Gumroad).
- `work.html` — full case-study page with its own inline renderer + detail modal (same JSON as index).
- `products.html` — digital-products catalog + per-product demo pages (`products.html?slug=<id>`), rendered from `data/products.json`. Buy buttons route to `index.html#contact` (Gumroad-ready).
- `data/case-studies.json` — **source of truth for case study content.** Section `#case-study-list` is empty in the HTML and rendered entirely from this file via `js/render-case-studies.js`.
- `data/blogs.json` — **source of truth for blog posts.** Each entry: `id`, `slug`, `title`, `date`, `excerpt`, `content` (HTML string), `category`, `tags`, `readTime`.
- `data/products.json` — **source of truth for digital products.** Each entry: `id`, `name`, `price`, `icon`, `category`, `tagline`, `description`, `features[]`, `demo` (image path or null), `video`, `buyUrl`, `status`.
- `data/site-config.json` — **source of truth for site-wide settings**: notice/announcement bar (date-windowed, dismissible), featured video ID, all social/profile URLs. Rendered by `js/render-site-config.js`. No HTML edits needed to change these.
- `js/common.js` — shared utilities loaded on **every** page: footer year, theme init/toggle, mobile nav wiring, and `window.__a11y` modal-focus helpers. Do not re-implement these inline.
- `js/render-case-studies.js` — fetches case studies JSON, builds entry markup with glassmorphism cards, image galleries, before/after impact bars, metric count-up animation (numeric values only), architecture diagram details.
- `js/render-site-config.js` — notice bar + click-to-play featured-video facade from `site-config.json`. Safe no-op if JSON missing.
- `blog/{slug}.html` — individual SEO-friendly blog post pages. Each loads content from `data/blogs.json` via JS but has hardcoded meta tags for Google. Copy a template for new posts.
- `404.html` — themed not-found page with links (keeps old-site deep links useful).
- `assets/` — `profile.jpg` (optimized portrait), `icon-512.png` (PWA icon), `og-image.jpg` (social card), `case-studies/` (screenshots, diagrams), `payments/` (QR images).
- `service-worker.js` — cache v4: network-first for `/data/*` JSON, cache-first for same-origin static, **never** caches POST/cross-origin/API calls.
- `sitemap.xml`, `robots.txt`, `site.webmanifest`, `rss.xml` — SEO and PWA foundation.
- `HOW_TO_ADD_CASE_STUDIES.md` — full field reference including new `impact`, `gallery`, `diagram` fields.
- `DEPLOYMENT.md` — deployment steps, maintenance workflow, file structure map.
- `ACCOUNTS.md` — complete list of third-party accounts to create (GitHub, Formspree, GA4, Calendly, Stripe, Wise, AdSense, etc.) with signup URLs and where to paste keys.
- `AI_PROJECT_MEMORY.md` — architecture memory + gap analysis + phased roadmap (read before big changes).
- `_archive/` — git-ignored local archive of legacy/AI-slop files. Never deploy, never edit.

## Theme system (all pages)

- Dark by default; `data-theme="light"` attribute on `<html>` switches CSS variables.
- Each page has a tiny **pre-paint head script** that reads `localStorage.theme` before first render (prevents dark flash).
- The toggle is wired once by `js/common.js` (targets `document.documentElement`, guards `localStorage`). Never copy inline theme JS into a page again.
- GSAP may be unavailable (CDN block): main script adds `html.no-gsap` which force-shows all `.reveal` content. Never ship CSS that can hide content permanently.

## Local preview

```bash
python -m http.server 8000
```

Never open `index.html` via `file://` — `fetch()` of JSON blocked by browser.

## Editing rules

- **Case studies:** edit `data/case-studies.json` only. Never hardcode into `index.html`. Array order = display order.
- **Blog posts:** edit `data/blogs.json`, then copy a `blog/{template}.html` → update meta tags + slug constant. Also update `sitemap.xml` and `rss.xml`.
- **Site-wide settings (notice bar, featured video, social links):** edit `data/site-config.json` only.
- **Digital products:** edit `data/products.json`; demo pages render automatically at `products.html?slug=<id>`. Never hardcode product cards in `services.html`.
- JSON must stay valid (no comments/trailing commas). A parse failure empties the section.
- Metrics: `"placeholder": true` renders muted with em-dashes. Never fabricate values. Count-up animation only applies to numeric values.
- `video` is a YouTube video ID (not URL); opens in-page lightbox.
- `gallery` is an array of image paths; renders with prev/next carousel controls.
- `impact` renders before/after comparison bar: `{"before":"...","after":"...","improvement":"..."}`.
- `diagram` is a path to an architecture diagram image; renders as a collapsible `<details>` section.
- When touching the renderer or `index.html`, preserve:
  - `.reveal` class on entries + `case-studies:rendered` event (triggers ScrollTrigger.refresh)
  - `<noscript>` fallback inside `#case-study-list`
  - fetch path `data/case-studies.json`

## Deploy

GitHub Pages: `git push` → site rebuilds in ~2 minutes. See `DEPLOYMENT.md` for full setup.

## Third-party integrations

| Feature | Service | Config location |
|---------|---------|----------------|
| Contact form | Formspree | `index.html` JS (form ID: `mnnbkyeg`) |
| Newsletter | Buttondown | `index.html` JS (endpoint `md_mahsin_ul`) |
| Analytics | GA4 + Clarity | Scripts in `index.html` `<head>` |
| Blog comments | Giscus | Script in `blog.html` + post pages (re-generate config after repo creation) |
| GitHub activity | GitHub public API | `index.html` JS (username: `mahsin-islam`) |
| Calendly | Embed widget | `index.html` `#booking` + `services.html` `#book` |
| Ads (AdSense/Ezoic/Adsterra) | Respective networks | **Removed by default** — if monetizing later, add scripts in `blog.html` + blog post pages only, never index/work/services |

## Case study detail modal

Clicking any case study card opens a full-screen modal:
- Image gallery with dot navigation (if `gallery` array exists)
- YouTube video embed (if `video` set)
- Problem/Approach side-by-side
- Metrics, tech tags, action links
- Close via X, ESC, or click outside

Entries store `data-entry-id` on `<article>` — the modal JS listens for clicks and opens the corresponding entry from `allCaseStudies` (fetched once).

## Blog post thumbnails

Each entry in `data/blogs.json` supports a `thumbnail` field (path to image, e.g. `"assets/blog/thumb-01.jpg"`). Blog listing cards and individual post pages render the thumbnail automatically when set. Null = icon placeholder.

Blog listing cards link to `blog/{slug}.html` (individual SEO pages).

## Site config (notice bar + featured video)

`data/site-config.json` drives:
- `notice` — dismissible announcement bar (respects `start`/`end` dates, `severity`: info/warning/success, `dismissible`).
- `featuredVideo.id` — when set, `index.html` `#video-editing` shows a click-to-play facade with the real YouTube thumbnail; empty string keeps the channel-link fallback card.
- `brand` — all social/profile URLs (used by future sections; keep up to date).

Rendered by `js/render-site-config.js`, which is a no-op if the JSON is absent or invalid.
