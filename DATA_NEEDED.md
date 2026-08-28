# DATA_NEEDED.md — Owner's Content Checklist

Everything the site is waiting for, in priority order. Drop files into `assets/…` and fill the matching JSON fields — no code changes needed.

## 🔴 Blockers (highest impact)

| # | Item | Where it goes | Notes |
|---|---|---|---|
| 1 | **1 featured YouTube video ID** (your best tutorial) | `data/site-config.json` → `featuredVideo.id` | Homepage video section becomes a click-to-play card with your real thumbnail |
| 2 | **YouTube channel ID** | needed for the auto course-thumbs feed (Phase C Action) | Get it: open your channel → View page source → search `"externalId"` |
| 3 | **Case-study screenshots** — 1200×675 JPG, < 300 KB each | `assets/case-studies/…` + `data/case-studies.json` → `image`/`gallery` | All 4 cards currently show placeholders |
| 4 | **Entry-02 architecture diagram** | `assets/case-studies/entry-02-diagram.png` | The JSON already points here — just add the file |
| 5 | **Real case-study metrics** (visitors, revenue, outcomes) | `data/case-studies.json` → `metrics` (set `placeholder: false`) | Keep `placeholder: true` until measured — the site renders that honestly |

## 🟠 Strongly recommended

| # | Item | Where it goes |
|---|---|---|
| 6 | **Play Store app names + links** (DazzLeoIT) | `data/site-config.json` brand section; future app cards on `#apps` |
| 7 | **Real events/certificates** — photos (800×600, < 500 KB) + facts | `assets/events/…` + `data/events.json` → `image` / `certificate` |
| 8 | **Blog post thumbnails** — 1200×675 | `assets/blog/thumb-*.jpg` + `data/blogs.json` → `thumbnail` |
| 9 | **Product demo screenshots** | `assets/products/…` + `data/products.json` → `demo` |
| 10 | **Gumroad product links** (once you create listings) | `data/products.json` → `buyUrl` |

## 🟡 Nice to have

| # | Item | Where it goes |
|---|---|---|
| 11 | **Lifestyle facts** (hobbies, photography, travel, fitness — real ones) | `data/site-config.json` → `lifestyle` array (section appears automatically) |
| 12 | **Google Business Profile** (once created) | `data/site-config.json` brand section; reviews card returns to `#proof` |
| 13 | **New profile photo** (optional — current one is optimized at `assets/profile.jpg`) | replace `assets/profile.jpg` (keep ~900 px, < 150 KB) |
| 14 | **Testimonials from real clients** (names + quotes, with permission) | new `data/testimonials.json` + small renderer (future) |
| 15 | **bKash/Nagad/Rocket QR images** | `assets/payments/bkash-qr.png` etc. + `services.html` payment cards |

## Account setup reminders (see ACCOUNTS.md for URLs)

- [ ] Formspree — confirm form `mnnbkyeg` forwards to your email
- [ ] GA4 `G-K1C6HFSC4C` + Clarity `xtj7i8cyjj` — confirm ownership
- [ ] Calendly — confirm `mahsin-islam-md/30min` event exists
- [ ] Buttondown — test newsletter subscribe
- [ ] Giscus — re-generate config against the real repo **after first push**
- [ ] Google Search Console — verify domain + submit `sitemap.xml`

## After you supply data

1. Edit the JSON file(s) → validate with any JSON linter.
2. Test: `python -m http.server 8000` → check the section.
3. `git add . && git commit -m "content: …" && git push origin main`.
