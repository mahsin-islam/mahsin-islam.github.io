# How to Add a New Case Study or R&D Entry

Your case studies no longer live in `index.html`. They live in **`data/case-studies.json`**,
and JavaScript (`js/render-case-studies.js`) builds the page from it automatically.

This means: **adding a new project = adding one JSON entry. No HTML editing.**

---

## Quick steps

1. Open `data/case-studies.json`
2. Copy the whole block for one existing entry (from `{` to `}`)
3. Paste it just before the final `]`, add a comma after the entry above it
4. Edit the fields (see reference below)
5. Save, commit, push — GitHub Pages rebuilds in ~2 minutes

The new entry appears on the site in the same order it sits in the file —
put your newest or most important work first.

---

## Field reference

| Field | Required | Notes |
|---|---|---|
| `id` | yes | Any unique string, e.g. `"entry-05"` |
| `number` | yes | Display number, e.g. `"05"` |
| `category` | yes | Short label: `"Client Engagement"`, `"Product Build"`, `"Platform & Content"`, `"R&D — Ongoing"`, or your own |
| `categoryIcon` | no | A Font Awesome icon class (without `fas`), e.g. `"fa-flask"` — shown when no image is set |
| `status` | yes | `"Shipped"`, `"Live"`, `"In development"`, `"Continuous"`, or your own |
| `title` | yes | The project name / headline |
| `role` | yes | e.g. `"Solo build · Backend architecture"` |
| `problem` | yes | 1–3 sentences. What was broken or missing. |
| `approach` | yes | 1–3 sentences. What you actually built and why. |
| `metrics` | yes | Array of up to 3 `{label, value, placeholder}` objects. Set `"placeholder": true` for anything you haven't measured yet — it renders in muted italic with em-dashes so it's clearly marked as unfilled, not fabricated. |
| `tech` | yes | Array of strings, shown as tags |
| `links` | yes | Array of `{label, href, icon}`. Internal links (like `#contact`) render without `target="_blank"`; external links (`http...`) open in a new tab automatically. |
| `image` | no | Path to a screenshot, e.g. `"assets/case-studies/entry-05.jpg"`. Leave `null` for a clean placeholder tile instead. |
| `video` | no | Just the YouTube video ID (the part after `v=` in a YouTube URL), e.g. `"dQw4w9WgXcQ"`. Leave `null` to hide the video button. |

---

## Example: adding a new entry

```json
{
  "id": "entry-05",
  "number": "05",
  "category": "R&D — Ongoing",
  "categoryIcon": "fa-flask",
  "status": "Prototype",
  "title": "Your new project title",
  "role": "Solo build · What kind of work this was",
  "problem": "What was actually broken, in plain language.",
  "approach": "What you built, and the one or two decisions that mattered most.",
  "metrics": [
    { "label": "Something concrete", "value": "3 weeks", "placeholder": false },
    { "label": "Result not measured yet", "value": "add your result here", "placeholder": true }
  ],
  "tech": ["Tech 1", "Tech 2", "Tech 3"],
  "links": [
    { "label": "View repository", "href": "https://github.com/mahsin-islam/your-repo", "icon": "fab fa-github" }
  ],
  "image": null,
  "video": null
}
```

---

## Adding a project screenshot

1. Save an image (recommended: 1200×675px, `.jpg`, under 300KB) into `assets/case-studies/`
2. Set `"image": "assets/case-studies/your-file.jpg"` in that entry
3. It replaces the placeholder tile automatically — no other change needed

## Adding a project video

1. Find your YouTube video's ID — in `https://youtube.com/watch?v=dQw4w9WgXcQ`, the ID is `dQw4w9WgXcQ`
2. Set `"video": "dQw4w9WgXcQ"` in that entry
3. A "Watch the walkthrough" link appears automatically and opens the video in an in-page lightbox

---

## Testing locally before you push

Because the page loads `case-studies.json` with `fetch()`, opening `index.html` directly
by double-clicking it will **not** work — browsers block local file fetches for security.

Run a tiny local server instead, from the project folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser. This isn't needed once it's live on
GitHub Pages — `fetch()` works normally there because it's served over HTTPS.

---

## What NOT to do

- Don't invent metrics. If you haven't measured something, set `"placeholder": true` —
  the site is designed to make placeholders look intentional, not embarrassing.
- Don't remove the `noscript` fallback message in `index.html` — it's what a visitor
  with JavaScript disabled sees instead of a blank section.
- Don't rename `case-studies.json` or move it out of `data/` unless you also update the
  `fetch('data/case-studies.json')` path inside `js/render-case-studies.js`.
