# AGENTS.md

Static single-page portfolio + blog + payments. **No build system, no package.json, no tests, no CI** — plain HTML/CSS/JS served as-is. Do not scaffold tooling.

## Structure

- `index.html` — the entire portfolio site: markup, all CSS (inline `<style>`), and the main inline script (GSAP animations, search, GitHub API, skill bars, visitor counter, typing effect, theme toggle, contact form via Formspree).
- `blog.html` — blog listing page. Fetches `data/blogs.json`, renders post cards. Hash-based routing for in-page post view, but cards link to individual SEO-friendly pages in `blog/`.
- `services.html` — consulting offerings, bKash/Nagad/Rocket QR payment page, and international gateway comparison table (Wise, Payoneer, Stripe, LianLianPay, Gumroad).
- `data/case-studies.json` — **source of truth for case study content.** Section `#case-study-list` is empty in the HTML and rendered entirely from this file via `js/render-case-studies.js`.
- `data/blogs.json` — **source of truth for blog posts.** Each entry: `id`, `slug`, `title`, `date`, `excerpt`, `content` (HTML string), `category`, `tags`, `readTime`.
- `js/render-case-studies.js` — fetches case studies JSON, builds entry markup with glassmorphism cards, image galleries, before/after impact bars, metric count-up animation, architecture diagram details.
- `blog/{slug}.html` — individual SEO-friendly blog post pages. Each loads content from `data/blogs.json` via JS but has hardcoded meta tags for Google. Copy a template for new posts.
- `assets/` — `profile.jpg`, `case-studies/` (screenshots, diagrams), `payments/` (QR images).
- `service-worker.js` — offline cache for key pages and data JSONs.
- `sitemap.xml`, `robots.txt`, `site.webmanifest`, `rss.xml` — SEO and PWA foundation.
- `HOW_TO_ADD_CASE_STUDIES.md` — full field reference including new `impact`, `gallery`, `diagram` fields.
- `DEPLOYMENT.md` — deployment steps, maintenance workflow, file structure map.
- `ACCOUNTS.md` — complete list of third-party accounts to create (GitHub, Formspree, GA4, Calendly, Stripe, Wise, AdSense, etc.) with signup URLs and where to paste keys.

## Local preview

```bash
python -m http.server 8000
```

Never open `index.html` via `file://` — `fetch()` of JSON blocked by browser.

## Editing rules

- **Case studies:** edit `data/case-studies.json` only. Never hardcode into `index.html`. Array order = display order.
- **Blog posts:** edit `data/blogs.json`, then copy a `blog/{template}.html` → update meta tags + slug constant. Also update `sitemap.xml` and `rss.xml`.
- JSON must stay valid (no comments/trailing commas). A parse failure empties the section.
- Metrics: `"placeholder": true` renders muted with em-dashes. Never fabricate values.
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
| Newsletter | Buttondown | `index.html` JS (replace `YOUR_BUTTONDOWN_API_KEY`) |
| Analytics | GA4 + Clarity | Add scripts in `index.html` `<head>` |
| Blog comments | Giscus | Add script in `blog.html` + post pages |
| GitHub activity | GitHub public API | `index.html` JS (username: `mahsin-islam`) |
| Calendly | Embed widget | Replace placeholder in `index.html` `#booking` section |
| Ads (AdSense/Ezoic/Adsterra) | Respective networks | Add ad scripts in `blog.html` + blog post pages only |

## Case study detail modal

Clicking any case study card now opens a beautiful full-screen modal:
- Image gallery with dot navigation (if `gallery` array exists)
- YouTube video embed (if `video` set)
- Problem/Approach side-by-side
- Metrics, tech tags, action links
- Close via X, ESC, or click outside

Entries store `data-entry-id` on `<article>` — the modal JS listens for clicks and opens the corresponding entry from `allCaseStudies` (fetched once).

## Blog post thumbnails

Each entry in `data/blogs.json` now supports a `thumbnail` field (path to image, e.g. `"assets/blog/thumb-01.jpg"`). Blog listing cards and individual post pages render the thumbnail automatically when set. Null = icon placeholder.

Blog listing cards link to `blog/{slug}.html` (individual SEO pages) and support hash-based fallback on `blog.html`.
