# Accounts You Need to Create — Complete Setup Guide

Everything you need to sign up for before (or right after) deployment. Each service is free to start. Listed in priority order.

---

## Tier 1 — Do These Before Deploy (portfolio won't work without these)

### GitHub
- **Sign up at:** https://github.com
- **Username:** `mahsin-islam` (already have)
- **Create repository:** `MAHSIN-ISLAM.github.io` (must match your username exactly for GitHub Pages)
- **What to do:** Push this project folder to that repo. Enable GitHub Pages in Settings → Pages → Source: main branch, / (root).
- **Where the key goes:** No key needed. Just push code.

### Formspree (Contact Form)
- **Sign up at:** https://formspree.io
- **Already configured:** Your form ID `mnnbkyeg` is in `index.html` inline JS
- **What to do:**
  1. Create Formspree account
  2. Create a new form → get your form ID
  3. Replace `mnnbkyeg` in `index.html` with YOUR new form ID
  4. Set forwarding email to `mahsin.islam@gmail.com`
- **Where:** `index.html` → search for `formspree.io/f/mnnbkyeg`
- **Free tier:** 50 submissions/month

### Google Search Console
- **Sign up at:** https://search.google.com/search-console
- **What to do:** Add your site (`https://MAHSIN-ISLAM.github.io`) → verify via HTML file or DNS
- **Submit sitemap:** `https://MAHSIN-ISLAM.github.io/sitemap.xml`
- **Why:** Tells Google to index your pages. Without this, your blog won't show in search results.
- **No key needed** — just verification.

---

## Tier 2 — Analytics & Tracking (highly recommended)

### Google Analytics 4 (GA4)
- **Sign up at:** https://analytics.google.com
- **What to get:** Measurement ID (starts with `G-`)
- **Where to paste:** `index.html` — add this script before `</head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```
- **Also add to:** `blog.html`, `services.html`, and each `blog/*.html` page
- **Free:** Unlimited

### Microsoft Clarity
- **Sign up at:** https://clarity.microsoft.com
- **What to do:** Create project → copy the tracking `<script>` tag
- **Where to paste:** `index.html` before `</head>`, also on `blog.html` and services page
- **Why:** Session recordings + heatmaps. See how visitors interact. Complements GA4.
- **Free:** Unlimited

### Google Business Profile
- **Sign up at:** https://business.google.com
- **What to do:** Create a profile for "Md. Mahsin-Ul-Islam — Software Engineer"
- **Why:** Shows up in Google search sidebar. You can collect reviews here.
- **Connect to site:** The "Google reviews" section in index.html `#proof` is waiting for this.

---

## Tier 3 — Content & Community

### Calendly (Booking)
- **Sign up at:** https://calendly.com
- **What to get:** Your personal Calendly link (e.g. `calendly.com/mahsinislam`)
- **Where to paste:** `index.html` → `#booking` section → replace the placeholder div with:
```html
<div class="calendly-inline-widget" data-url="https://calendly.com/YOUR-USERNAME" style="min-width:320px;height:700px;"></div>
```
- **Also add:** `<script src="https://assets.calendly.com/assets/external/widget.js" async></script>` before `</body>`
- **Free tier:** 1 event type

### Buttondown (Newsletter)
- **Sign up at:** https://buttondown.email
- **What to get:** API key from Settings → API
- **Where to paste:** `index.html` → search for `YOUR_BUTTONDOWN_API_KEY`
- **Free tier:** Up to 100 subscribers

### Giscus (Blog Comments)
- **Sign up at:** https://giscus.app
- **Prerequisites:**
  1. Enable GitHub Discussions in your repo: Settings → Features → Discussions
  2. Install Giscus app: https://github.com/apps/giscus
- **What to do:**
  1. Go to https://giscus.app
  2. Enter your repo: `MAHSIN-ISLAM/MAHSIN-ISLAM.github.io`
  3. Choose "Discussion title contains page pathname"
  4. Copy the `<script>` tag
- **Where to paste:** `blog.html` and each `blog/*.html` page, before `</body>`
- **Free:** Unlimited (uses GitHub Discussions as backend)

### YouTube Channel
- **Already have:** https://youtube.com/@mahsintheeducator
- **Video embed:** Replace the placeholder in `index.html` `#video-editing` section
- **API key (optional):** For auto-fetching latest videos, get a YouTube Data API key from https://console.cloud.google.com → APIs → YouTube Data API v3

### Medium
- **Already have:** https://medium.com/@mahsin.islam
- **Can embed link:** The marquee section in `index.html` `#content` shows your Medium posts

---

## Tier 4 — Monetization

### Google AdSense
- **Sign up at:** https://adsense.google.com
- **Requirements:**
  - Your site must be LIVE on your domain
  - 20-30+ quality content pages recommended
  - Original, valuable content
  - Privacy policy page recommended
- **What to do:**
  1. Apply with your GitHub Pages URL
  2. Google reviews your site (takes 1-2 weeks)
  3. Once approved, create ad units
  4. Paste ad code ONLY in `blog.html` and `blog/*.html` pages
  5. **NEVER put AdSense on `index.html`** — keep portfolio clean for recruiters
- **Payment:** Wire transfer to bank (some Bangladesh banks supported), or Western Union

### Ezoic
- **Sign up at:** https://ezoic.com
- **Requirements:** 10,000+ monthly page views recommended
- **How it works:**
  - Ezoic integrates via Cloudflare or nameservers
  - May conflict with GitHub Pages if using nameservers
  - Use the Cloudflare integration method for GitHub Pages
- **Payment:** Payoneer, check, or bank transfer (may not support all BD banks)

### Adsterra
- **Sign up at:** https://adsterra.com
- **Requirements:** Very low — works with any traffic
- **What to do:**
  1. Sign up → Create ad unit
  2. Copy the ad code
  3. Paste in `blog.html` and blog post pages only
- **Payment:** Bitcoin, WebMoney, Payoneer, Wire transfer

### PropellerAds
- **Sign up at:** https://propellerads.com
- **Requirements:** Low — quick approval
- **Best for:** Push notifications + banners
- **Payment:** Payoneer, WebMoney, wire transfer

### Important: Ad Placement Rules
```
✅ Blog pages (blog.html, blog/*.html)     → Ads allowed
✅ Services page (services.html)           → OK for affiliate links only
❌ Homepage (index.html)                   → NO ads. Keep professional.
❌ Contact form page                       → NO ads
```

---

## Tier 5 — Payment Gateways

### For Bangladesh Clients (bKash/Nagad/Rocket)

These don't need API keys — just your personal account numbers and QR codes.

- **bKash:** Download your merchant QR from the bKash app → save as `assets/payments/bkash-qr.png`
- **Nagad:** Save your Nagad QR → save as `assets/payments/nagad-qr.png`
- **Rocket:** Save your Rocket QR → save as `assets/payments/rocket-qr.png`
- **Where to update:** `services.html` — replace placeholder descriptions with actual images and account numbers
- **Verification process:** Client pays → sends screenshot via email or contact form → you verify manually → deliver

### For International Clients

#### Wise (TransferWise) — RECOMMENDED
- **Sign up at:** https://wise.com
- **What to get:** USD account details (you get real US bank details)
- **How it receives:** Clients send USD → Wise converts to BDT → deposits to your BD bank
- **Setup time:** 15 minutes
- **Where:** Use your Wise USD account number for Stripe integration below

#### Payoneer
- **Sign up at:** https://payoneer.com
- **Already have?** Check — many Bangladeshi freelancers have Payoneer
- **How it works:** Clients pay → Payoneer holds → withdraw to BD bank (BRAC, City, Standard Chartered, Dutch-Bangla etc.)
- **Fees:** 2% + $15 withdrawal fee
- **URL:** Share your Payoneer "Request a Payment" link on your site

#### Stripe (for automated checkout)
- **Sign up at:** https://stripe.com
- **Important:** Stripe doesn't support Bangladesh directly. Workaround:
  1. Open a Wise USD account (gives you US bank details)
  2. Create a Stripe account using that US bank account
  3. Stripe → Wise → BD bank
- **Where the keys go:**
  - Stripe publishable key → paste in `services.html` for Stripe.js checkout
  - Stripe secret key → keep server-side (not on GitHub Pages!)
  - For simple one-off sales, use Gumroad instead (easier)

#### Gumroad (EASIEST for digital products)
- **Sign up at:** https://gumroad.com
- **What to do:**
  1. Create product listings (source code, templates, etc.)
  2. Set price in USD
  3. Get your Gumroad profile URL or product embed code
  4. Replace placeholder in `services.html`
- **Payout:** Connects to Payoneer or Wise
- **Best for:** Selling digital products without any server code

#### LianLianPay
- **Sign up at:** https://lianlianpay.com
- **Best for:** Receiving payments from Chinese/Alipay users
- **Supports BD banks?** Via intermediary. Check current status.

---

## Tier 6 — SEO & Tools

### Google PageSpeed Insights
- **URL:** https://pagespeed.web.dev
- **Test your site:** Enter `https://MAHSIN-ISLAM.github.io`
- **Goal:** Score 90+ on all metrics

### Favicon Generator
- **URL:** https://realfavicongenerator.net
- **Generate proper favicons** (currently using inline SVG — works but not ideal for all platforms)

### RSS Feed
- **Your feed:** `https://MAHSIN-ISLAM.github.io/rss.xml` (already created)
- **Submit to:** Feedly, Inoreader, Apple Podcasts Connect (if you start a podcast)

### Google Structured Data Testing
- **URL:** https://search.google.com/test/rich-results
- **Test your JSON-LD:** Already in `index.html` `<head>`

---

## Quick Checklist Before You Go Live

```
[ ] GitHub repo created & pushed
[ ] GitHub Pages enabled (Settings → Pages → main branch)
[ ] Formspree account created + form ID replaced
[ ] Google Search Console verified + sitemap submitted
[ ] Calendly account created + widget embedded
[ ] Buttondown account created + API key pasted
[ ] bKash/Nagad QR images saved to assets/payments/
[ ] Profile photo at assets/profile.jpg
[ ] GA4 measurement ID added (optional, do later)
[ ] Microsoft Clarity added (optional, do later)
[ ] Giscus added for blog comments (optional, after 5+ posts)
[ ] AdSense applied (optional, after 20+ blog posts)
[ ] Wise account created (optional, when selling internationally)
[ ] Test locally: python -m http.server 8000 → open http://localhost:8000
[ ] Test every nav link on every page
[ ] Deploy: git push origin main → wait 2 min → open https://MAHSIN-ISLAM.github.io
```
