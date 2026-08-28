# Deployment & Maintenance Guide

## How to deploy to GitHub Pages

### One-time setup (5 minutes)

```bash
# 1. Create Git repo in the project folder
cd portfolio-v4
git init
git add .
git commit -m "Initial portfolio: case studies, blog, PWA, payments"

# 2. Create repo on GitHub (via website or CLI)
#    → Name: mahsin-islam.github.io  (or use your username)
#    → Public repository

# 3. Push to GitHub
git remote add origin https://github.com/MAHSIN-ISLAM/MAHSIN-ISLAM.github.io.git
git branch -M main
git push -u origin main

# 4. Enable GitHub Pages
#    → Go to repo Settings → Pages
#    → Source: "Deploy from a branch" → Branch: main → / (root) → Save
#    → Wait ~2 minutes for deployment
#    → Your site is live at https://MAHSIN-ISLAM.github.io
```

### Every time you update

```bash
git add . && git commit -m "Describe what you changed" && git push
```

Site rebuilds automatically in ~2 minutes. No other deploy step.

---

## Pre-deploy checklist (before first push)

```
[ ] All nav links tested locally (python -m http.server 8000)
[ ] Contact form ID confirmed (Formspree)
[ ] profile.jpg exists in assets/
[ ] Account IDs updated (see ACCOUNTS.md for full list)
[ ] Canary URL contains your correct GitHub username
[ ] sitemap.xml URLs use your actual domain
```

**Full account setup guide:** See `ACCOUNTS.md` — lists every service, signup URL, and where to paste keys.

---

## API keys & third-party services (all placeholders to fill before going live)

These integrations are in the code but point to placeholder values. Before deploying (or right after), replace each:

### Required (contact form works immediately)

| Service | File | Line / Location | Placeholder | Get key at |
|---------|------|-----------------|-------------|------------|
| **Formspree** | `index.html` | `fetch('https://formspree.io/f/mnnbkyeg')` | Already configured | formspree.io |

### Recommended (most value for least effort)

| Service | File | What to replace | Placeholder | Get key at |
|---------|------|-----------------|-------------|------------|
| **Google Analytics 4** | `index.html` `<head>` | Add script before `</head>` | Not yet added | analytics.google.com |
| **Microsoft Clarity** | `index.html` `<head>` | Add script before `</head>` | Not yet added | clarity.microsoft.com |
| **Calendly** | `index.html` `#booking` section | Replace placeholder div | `YOUR-LINK` | calendly.com |
| **GitHub API** | `index.html` inline JS | `fetch('https://api.github.com/users/mahsin-islam')` | Already configured | None (public API) |

### Newsletter (Buttondown)

| Service | File | What to replace | Placeholder |
|---------|------|-----------------|-------------|
| **Buttondown** | `index.html` newsletter JS | Replace API key | `YOUR_BUTTONDOWN_API_KEY` |

```javascript
// In index.html, find:
'Authorization': 'Token YOUR_BUTTONDOWN_API_KEY'

// Replace with your real key from buttondown.email → Settings → API
'Authorization': 'Token abc123-your-real-key'
```

### Ads (add after you have 20+ blog pages)

| Service | How to integrate | Notes |
|---------|-----------------|-------|
| **Google AdSense** | Add `<script>` in `blog.html` + individual blog pages | Requires domain verification. Only on blog pages, not homepage. |
| **Ezoic** | Add nameservers or Cloudflare integration | Approves after 10K monthly visitors. |
| **Adsterra** | Add ad unit script in `blog.html` footer | Works with any traffic level. |
| **PropellerAds** | Push notification + banner scripts | Quick approval. |

### Blog comments (Giscus)

| Service | File | What to replace | Get key at |
|---------|------|-----------------|------------|
| **Giscus** | `blog.html`, individual posts | Add script from giscus.app | giscus.app |

1. Enable GitHub Discussions in repo Settings
2. Install Giscus app from github.com/apps/giscus
3. Visit giscus.app, configure → copy `<script>` tag
4. Paste in `blog.html` and each `blog/*.html` file before `</body>`

### Payments (Qatar)

| Service | File | What to replace |
|---------|------|-----------------|
| **bKash/Nagad/Rocket QR** | `services.html` | Replace QR placeholder images and account numbers |
| **Stripe** | Not yet integrated | Add Stripe.js + your publishable key |
| **Gumroad** | Embed on services page | Replace with your Gumroad product URL |

### AI Chat (optional, future)

| Service | What to configure |
|---------|-------------------|
| **OpenAI / Gemini API** | Add your API key. Client-side only — key is exposed. Use a proxy or serverless function for production. |

### Local contact form verification

The Formspree form (`mnnbkyeg`) is the current contact form endpoint. It works without any API key. Just make sure:
- The form ID is correct (verify in your Formspree dashboard)
- Emails are forwarding to `mahsin.islam@gmail.com`

---

## How to maintain the site

### Adding a new case study

Edit `data/case-studies.json` only. Never touch `index.html`.

Fields you can use:
- `image` — single screenshot path, e.g. `"assets/case-studies/entry-05.jpg"`
- `gallery` — multiple images: `["assets/case-studies/e5-1.jpg", "assets/case-studies/e5-2.jpg"]`
- `video` — YouTube video ID (not URL), opens lightbox
- `impact` — before/after comparison: `{"before": "Text", "after": "Text", "improvement": "Text"}`
- `diagram` — architecture diagram image path
- `metrics` — up to 3. Set `"placeholder": true` for unmeasured results

Full reference: `HOW_TO_ADD_CASE_STUDIES.md`

### Adding a blog post

Edit `data/blogs.json`. Each entry needs:
```json
{
  "id": "blog-04",
  "slug": "unique-url-slug",
  "title": "Post Title",
  "date": "2026-08-01",
  "excerpt": "1-2 sentence preview",
  "content": "<p>HTML content here</p>",
  "category": "Category",
  "tags": ["tag1", "tag2"],
  "readTime": "5 min",
  "thumbnail": "assets/blog/thumb-04.jpg"
}
```

Then create a new SEO-friendly page: copy `blog/flutter-performance-optimization.html` to `blog/your-slug.html` and update:
- `<title>` tag
- `<meta name="description">` tag
- `<meta property="og:*">` tags
- `const slug = 'your-slug';` in the script
- The fallback HTML title in the `.catch()` block

Update `sitemap.xml` and `rss.xml` with the new post URL.

### Adding images

Save images to `assets/case-studies/` (recommended: 1200×675px, JPG, under 300KB):
```
assets/case-studies/entry-01.jpg
assets/case-studies/entry-02.jpg
assets/case-studies/entry-03.jpg
assets/case-studies/entry-04.jpg
```

Then set `"image": "assets/case-studies/entry-01.jpg"` in that entry. No HTML change needed.

### Adding payment QR codes

1. Screenshot your bKash/Nagad/Rocket QR codes
2. Save them as: `assets/payments/bkash-qr.png`, `assets/payments/nagad-qr.png`, `assets/payments/rocket-qr.png`
3. Edit `services.html` — replace the QR placeholder `<div>` with actual `<img>` tags
4. Update the account numbers in the `pm-details` sections

### Setting up analytics

**Google Analytics 4:**
1. Create a GA4 property at analytics.google.com
2. Copy your Measurement ID (starts with `G-`)
3. Add this script before `</head>` in `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Microsoft Clarity:**
1. Create a project at clarity.microsoft.com
2. Copy the tracking script
3. Paste it before `</head>` in `index.html`

### Setting up Giscus (blog comments)

1. Enable GitHub Discussions on your repo (Settings → Features)
2. Install Giscus app from github.com/apps/giscus
3. Visit giscus.app, configure your repo, copy the `<script>` tag
4. Add it to `blog.html` and each individual blog post page
5. Comments appear as GitHub Discussions — no database needed

### Setting up newsletter (Buttondown)

1. Create a free account at buttondown.email
2. Get your API key from Settings → API
3. In `index.html`, find the newsletter section and replace `YOUR_BUTTONDOWN_API_KEY` with your actual key
4. Alternatively, use the Buttondown subscribe form embed instead of the API

### Updating your availability calendar

1. Create a free Calendly account at calendly.com
2. Set up your event types (15min, 30min, 60min)
3. In `index.html`, find the Calendly section and replace the placeholder with:
```html
<div class="calendly-inline-widget" data-url="https://calendly.com/YOUR-USERNAME" style="min-width:320px;height:700px;"></div>
<script src="https://assets.calendly.com/assets/external/widget.js" async></script>
```

### Testing locally

```bash
cd portfolio-v4
python -m http.server 8000
# Open http://localhost:8000
```

The port must be 8000. Opening via `file://` won't work because the browser blocks `fetch()` on local files.

---

## File structure quick reference

```
portfolio-v4/
├── index.html                    ← main portfolio page (edit rarely)
├── blog.html                     ← blog listing (hash-based routing)
├── services.html                 ← payments & consulting page
├── site.webmanifest              ← PWA manifest
├── service-worker.js             ← offline cache
├── sitemap.xml                   ← Google indexing
├── robots.txt                    ← crawler rules
├── rss.xml                       ← blog RSS feed
├── AGENTS.md                     ← AI agent instructions
├── HOW_TO_ADD_CASE_STUDIES.md    ← case study field reference
├── data/
│   ├── case-studies.json         ← ★ edit to add/change case studies
│   └── blogs.json                ← ★ edit to add blog posts
├── js/
│   └── render-case-studies.js    ← case study renderer (edit rarely)
├── blog/
│   ├── flutter-performance-optimization.html
│   ├── fastapi-backend-lessons.html
│   └── bangladesh-fintech-landscape-2026.html
└── assets/
    ├── profile.jpg               ← your photo
    ├── case-studies/             ← ★ save screenshots here
    │   └── entry-02-diagram.png  ← architecture diagram
    └── payments/                 ← ★ save QR codes here
        ├── bkash-qr.png
        ├── nagad-qr.png
        └── rocket-qr.png
```

**Files you edit regularly:** `data/*.json` (content), `assets/` (images)  
**Files you edit rarely:** `index.html`, `blog.html`, `services.html`
