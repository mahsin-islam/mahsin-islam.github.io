# Md. Mahsin-Ul-Islam — Portfolio (v4)

Personal portfolio, blog, digital products, and services site — 100% static HTML/CSS/JS, data-driven via JSON, deployed on GitHub Pages.

**Live:** https://mahsin-islam.github.io/

## What's inside

- **Home** — hero, services, case studies (data-driven, glassmorphism cards + galleries + impact bars + modal), live GitHub activity, education, events/certificates, video editing, research, teaching, capabilities, skills, content marquee, social proof, newsletter, Calendly booking, contact (Formspree).
- **Work & R&D** — full case-study page with detail modals.
- **Blog** — local posts + Medium feed (RSS proxy), pagination, per-post SEO pages.
- **Services** — development/consulting/video/courses, bKash/Nagad/Rocket manual payments, international gateways.
- **Products** — digital product catalog with per-product demo pages (`products.html?slug=…`).
- **Settings-driven UI** — dismissible notice bar, featured video facade, lifestyle section, brand links — all from `data/site-config.json`.
- **PWA** — offline-capable (service worker v4), installable (manifest + icon).
- **Light/dark theme** — flash-free, persisted, with GSAP-CDN failure fallback.

## Edit content without touching code

| To change… | Edit… |
|---|---|
| Case studies | `data/case-studies.json` |
| Blog posts | `data/blogs.json` + copy a template in `blog/` |
| Events / certificates | `data/events.json` |
| Digital products | `data/products.json` |
| Notice bar, featured video, social links, lifestyle | `data/site-config.json` |

Rules: keep JSON valid, never fabricate metrics/testimonials, keep images < 300 KB. See `HOW_TO_ADD_CASE_STUDIES.md` and `AGENTS.md`.

## Run locally

```bash
python -m http.server 8000
# open http://localhost:8000  (never open via file://)
```

## Deploy

```bash
git remote add origin https://github.com/MAHSIN-ISLAM/MAHSIN-ISLAM.github.io.git
git branch -M main
git push -u origin main --force   # replaces the old site on the same URL
```
Then: repo Settings → Pages → Source: `main` / root. Live in ~2 minutes. Full guide: `DEPLOYMENT.md`.

## Docs

- `AI_PROJECT_MEMORY.md` — architecture, gap analysis, phased roadmap, changelog (read before big changes).
- `DEPLOYMENT.md` — deploy + maintenance.
- `ACCOUNTS.md` — free-tier accounts to create (Formspree, GA4, Calendly, Gumroad…).
- `DATA_NEEDED.md` — the checklist of assets/content the owner should supply.

© Md. Mahsin-Ul-Islam · Dhaka, Bangladesh
