# CLAUDE.md — Vegas Sidekick / K2 Oddworks 🌵

Read this file completely before doing anything. These rules override
your defaults. When in doubt, ask — do not improvise on locked systems.

---

## WHO / WHAT

- Solo founder: **Kris Kidd**. Company: **K2 Oddworks**. Anchor property:
  **Vegas Sidekick** (vegassidekick.com) — Las Vegas show-ticket
  affiliate platform. Positioning: "Vegas without the Trauma."
- Monetization: Spotlight.Vegas affiliate commissions.
  Link format: `spotlight.vegas/shows/[category]/[show-slug]/ref/vegassidekick`
  All affiliate links use `rel="sponsored"`.
- Mascot: **Spike** — deadpan saguaro cactus, gold retro aviator
  sunglasses, never smiles. Tagline used occasionally:
  "VEGAS SIDEKICK: Spike Knows Vegas"
- The 🌵 cactus is embedded somewhere subtle in every deliverable.

---

## BRAND CONSTANTS (LOCKED)

```
Navy    #0A0F2C   primary background
Blue    #1A6BFF   electric accent, links
Orange  #FF6B2B   primary CTA buttons
White   #FFFFFF
```

**Typography:**
- **Bebas Neue** — headlines only
- **Barlow Condensed 800** — prices, numbers, labels
- **Barlow 400/600/700** — body text
- **IBM Plex Mono** — AI/utility labels, meta
- **Cormorant Garamond italic** — editorial accent (hero taglines, article lede paragraphs)

**Voice:** desert-coded, deadpan, mythic Vegas storytelling, authentic
local. No hype, no fake urgency.

---

## TECH STACK

| Layer | Technology |
|---|---|
| Hosting | Cloudflare Pages (static) + Cloudflare Workers (functions) |
| CMS | Decap CMS v3 (GitHub-backed) |
| Search | Algolia InstantSearch v4 |
| Email | Brevo (List #2) via Cloudflare Worker proxy |
| Auth | GitHub OAuth (for CMS admin) |
| Analytics | Google Analytics 4 (G-BM6QGF7B4Y, injected via header.js) |
| Fonts | Google Fonts (Bebas Neue, Barlow, Barlow Condensed, IBM Plex Mono, Cormorant Garamond) |

**No npm, no build step, no bundler.** All third-party libraries are loaded from CDN.

Dev environment: Windows + VS Code + PowerShell.

⚠️ **Terminal always starts from the wrong directory.** Every git
instruction begins with `cd vegas-sidekick` and provides the full
command sequence — never "commit and push" without the full sequence.

---

## REPOSITORY STRUCTURE

```
vegas-sidekick/
├── admin/                  # Decap CMS content editor
│   ├── index.html          # CMS web interface entry point
│   └── config.yml          # CMS collection/field definitions
├── about/
│   ├── index.html
│   └── kris-kidd/index.html
├── affiliate-disclosure/index.html
├── components/             # Reusable JS web components
│   ├── header.js           # Site nav + Google Analytics + Memorial Day banner
│   └── footer.js           # Email signup + footer links + deal overlay
├── contact/index.html
├── functions/              # Serverless edge functions
│   └── api/
│       └── auth.js         # GitHub OAuth handler (Cloudflare Workers)
├── images/                 # Static image assets
│   ├── logo-*.png/.jpg     # Logo variants
│   ├── *-hero.jpg/.webp    # Show hero images
│   ├── spike-*.png/.jpg    # Mascot (Spike) assets
│   ├── kris-kidd.*         # Author photo
│   └── news/               # CMS-managed news article images
├── mom/                    # Easter egg pages
├── news/                   # Vegas Dispatch news articles
│   ├── index.html          # News hub page
│   └── {article-slug}/index.html  # Individual articles (15 as of May 2026)
├── neondesert/             # Interactive 3D Las Vegas Strip map (active build)
├── privacy/index.html
├── search/index.html       # Algolia-powered search page
├── shows/                  # Show catalog
│   ├── index.html          # Main "All Shows" hub
│   ├── adult/              # adult hub + shows (absinthe, rouge)
│   ├── cirque/             # cirque hub + shows (ka, mad-apple, michael-jackson-one, mystere, o)
│   ├── comedy/             # comedy hub + 10 shows
│   ├── family/             # family hub + shows (tournament-of-kings)
│   ├── magic/              # magic hub + 10 shows
│   ├── music/              # music hub + shows (blue-man-group, rupauls-drag-race-live, vegas-the-show)
│   └── spectaculars/       # spectaculars hub + shows (awakening, wizard-of-oz)
├── terms/index.html
├── 404.html
├── index.html              # Homepage
├── sitemap.xml             # SEO sitemap
├── _redirects              # Cloudflare Pages routing rules
├── wrangler.jsonc          # Cloudflare Workers config
└── SHOW-BUILDER-PROMPT.md  # Full AI prompt for building new show pages
```

**Show counts (as of May 2026):** 34 individual show pages across 7 categories + 7 category hub pages.

---

## DESIGN SYSTEM

### Responsive Breakpoints
- Desktop → Tablet: `900px`
- Tablet → Mobile: `480px`

### Visual Conventions
- Dark navy theme throughout
- Orange for primary CTAs, Blue for secondary actions
- Starfield background (CSS radial-gradient pattern)
- Glassmorphism on cards (`backdrop-filter: blur`)
- Animations: `fadeUp`, `fadeIn`, `float`, `ctaPulse`
- Show-specific accent color via `--show` / `--show-lt` CSS vars

---

## PAGE STRUCTURE CONVENTIONS

### Homepage (`index.html`)
All CSS embedded in `<style>` tags. All JS inline at bottom. Components loaded via `<script src="/components/header.js">`.

### Category Hub Pages (`shows/{category}/index.html`)
Each category has its own landing page with a show grid, filters, and a "compare" bar. All 7 categories have hubs: adult, cirque, comedy, family, magic, music, spectaculars.

### Show Detail Pages (`shows/{category}/{show-slug}/index.html`)

**Model/reference page: `shows/adult/absinthe/index.html`**

Absinthe is the design and feature standard for all show pages. When building or updating any show page, consult Absinthe first — every page should be inspired by and consistent with it. Features like info pills (`.info-pills`, `.pill`, `.pill-green`, `.pill-orange`, `.urgency-pills`, `.upill`), the seen-widget behavior, sidebar layout, and mobile-buy-bar are all benchmarked against Absinthe.

**Canonical template: `shows/music/vegas-the-show/index.html`**

This is the standard template for all new show pages — locked in as the reference build. Copy it when building a new show — do not use older pages (including `v-the-ultimate-variety-show`) as a starting point. See `SHOW-BUILDER-PROMPT.md` for the full AI prompt that builds a complete show page from scratch. Key features of the Sidekick Build template:

- Dual scroll progress bars (top + sidebar)
- Hero section: breadcrumb + Ken Burns image slider (`aspect-ratio: 16/9`) + venue/title block + price strip
- Scrolling ticker strip (show-color background) below hero
- Stats strip with count-up animation (`IntersectionObserver` + `requestAnimationFrame`)
- Two-column layout: `main.main-content` (left) + `aside.sidebar` (right, sticky, navy bg)
- Mobile sticky buy bar fixed to bottom (hidden on desktop)
- Main content sections in order:
  1. `.seen-widget` — "Have you seen this show?" yes/no engagement widget
  2. `.trust-grid` — 4 trust cards (secure booking, instant delivery, no fees, no account)
  3. About section with `.spike-callout` (show-color left-border callout)
  4. `.email-signup` — accent bar, inline email form wired to Brevo Worker
  5. `.details-grid` — 3-col icon cards for venue/schedule/duration/age/etc.
  6. `.expect-grid` — 2-col "What to Expect" cards
  7. `.seating-section` — interactive SVG seating chart + `.zone-popup` + `.seat-accord`
  8. `.faq-list` — accordion FAQ (+ icon)
  9. `.also-grid` — 3 "You Might Also Like" show cards
  10. `.final-cta` — dark gradient card CTA inside `<main>` (with ambient orbs), NOT full-width
- Photo gallery section (`.gallery-section` / `.gallery-grid`) placed right after the About section — asymmetric masonry layout (one large image + smaller stacked images), hover zoom, click-to-enlarge
- Serif editorial accent: hero tagline and the About section's opening "lede" paragraph render in italic Cormorant Garamond (`.lede` class)
- `@media (prefers-reduced-motion: reduce)` disables Ken Burns + ticker animations
- All primary "Get Tickets" CTA buttons (`.hero-cta`, `.sb-cta`, `.mob-cta`, `.final-cta-btn`) share one locked-in treatment: navy text on orange fill, soft light-blue neon border + matching glow (`rgba(96,165,250,...)`), pulsing glow-ring animation (`pulseGlowCta`), shimmer sweep, and a light-blue bobbing 🎟️ ticket emoji (`.cta-ticket`, `bobTicket` animation)

The seating chart is an interactive SVG — clickable zones call `selectZone('id')`, which populates a `.zone-popup` panel below with zone name, description, and optional Sidekick Pick badge.

### Schema.org Structured Data (Standard)

All show pages include three JSON-LD blocks:
1. **EventSeries** — show name, venue, offers/pricing, event status, attendance mode
2. **FAQPage** — accordion FAQ content mirrored as schema for Google rich results
3. **BreadcrumbList** — breadcrumb trail for search result display

---

## COMPONENTS

### `components/header.js`
Injects site navigation and Google Analytics into every page. Includes:
- Logo image (`/images/logo-pill-alt.png`)
- Desktop nav links: Comedy, Magic, Cirque, Music, Spectaculars, Family, Dispatch, All Shows →
- Mobile hamburger drawer (includes Adult Shows link)
- Memorial Day countdown banner (`#vs-memorial-banner`)
- Google Analytics 4 tag (`G-BM6QGF7B4Y`) appended to `<head>` on every page load

**Exposed global function:** `vsToggleMenu()`

```html
<script src="/components/header.js"></script>
```

### `components/footer.js`
Injects footer with email signup, link columns, trust strip, and post-affiliate-click deal overlay. Includes:
- Email signup form → Brevo Worker (`brevo-subscribe.vegassidekickcom.workers.dev`)
- Sidekick Standards trust strip
- **Post-affiliate-click deal overlay** (`#vs-deal-overlay`) — modal fires after a user clicks a Spotlight.vegas ticket link. Shows once per user (stored in `localStorage` key `vs_deal_alert_captured`). Triggered by intercepting clicks on `a[href*="spotlight.vegas"]`.

**Exposed global functions:** `vsSubmitEmail()`, `vsDealClose()`, `vsDealSubmit()`

```html
<script src="/components/footer.js"></script>
```

### Header/Footer — Correct Usage

Every page requires **both** of these patterns:

```html
<!-- TOP of <body> -->
<div id="vs-header"></div>

<!-- BOTTOM of <body>, before </body> -->
<div id="vs-footer"></div>
<script src="/components/header.js"></script>
<script src="/components/footer.js"></script>
```

`header.js` injects into `#vs-header`. If that div is missing, the nav silently fails to render.

---

## CMS (DECAP)

The admin CMS is at `/admin`. It reads/writes content via the GitHub API.

**Config:** `admin/config.yml`
- Backend: `github`, repo `VegasSidekick/vegas-sidekick`, branch: `main`
- Media uploads: `images/news/`
- Collection: **News Articles** — fields: title, date, category (Comedy/Music/Magic/Residencies/Dining/Events), image, caption, description, body (markdown), ticket_url, ticket_price, show_date, venue

Authentication is handled by the Cloudflare Worker at `/api/auth` — GitHub OAuth, posts token back to CMS via `window.postMessage`.

---

## EXTERNAL SERVICES & CREDENTIALS

| Service | Credential | Location |
|---|---|---|
| Algolia | App ID: `E402SBJE6D`, Search Key in source | `search/index.html` |
| Brevo | API Key in source, List ID: `2` | `components/footer.js` |
| Google Analytics | Tag ID: `G-BM6QGF7B4Y` | `components/header.js` |
| GitHub OAuth | Client ID: `Ov23lit31UqvtSuPp7tJ` | `functions/api/auth.js` |
| GitHub OAuth | Client Secret via `GITHUB_CLIENT_SECRET` env var | `functions/api/auth.js` |
| Cloudinary | Cloud: `dvhunpinz`, API Key: `966995363786296`, Secret: in `.cloudinary` | OG image hosting |

The Algolia key is search-only; the Brevo key has restricted permissions. The GitHub Client Secret must live in Cloudflare Workers env — never commit it.

**Cloudinary workflow for OG images** (server-to-server uploads blocked by IP):
1. Kris uploads image to Cloudinary from his phone
2. Pastes the resulting URL (`https://res.cloudinary.com/dvhunpinz/image/upload/f_auto,q_auto/...`)
3. Claude updates `og:image` and `twitter:image` meta tags in the article

---

## DEVELOPMENT WORKFLOW

### Adding a New Show Page

Fastest path: paste `SHOW-BUILDER-PROMPT.md` into a new session with show details.

Manual steps:
1. Create `shows/{category}/{show-slug}/`
2. Copy `shows/music/vegas-the-show/index.html` as base template
3. Update all show-specific content: title, description, images, pricing, show times, venue, FAQ
4. Affiliate link: `https://spotlight.vegas/shows/{category}/{show-slug}/ref/vegassidekick` with `rel="sponsored"`
5. Add show images to `images/`
6. Add to `sitemap.xml`
7. Add show card to category hub (`shows/{category}/index.html`)
8. Add card to relevant section on `index.html`

### Adding a New Category Page

If adding a new category beyond the existing 7:
- Create `shows/{new-category}/index.html` (model after an existing category hub)
- Update `components/header.js` — desktop + mobile nav
- Update `components/footer.js` — link columns
- Update `shows/index.html` — All Shows hub

### Publishing News Articles

Four files must be updated per article:

1. **Create** `news/{slug}/index.html` — full article page
2. **Update** `news/index.html` — promote to featured, add grid card, shift oldest out
3. **Update** `index.html` — update Vegas Dispatch section card
4. **Update** `sitemap.xml` — add URL with `<lastmod>` date

**Before touching `index.html`**, confirm current state:
```
cd vegas-sidekick
git log --oneline --format="%h %ad %s" --date=short index.html | head -5
```
Never rewrite `index.html` from scratch — only target the dispatch/news card section.

### News article HTML structure

```html
<body>
<div id="vs-header"></div>
<div id="vs-progress"></div>
<nav class="breadcrumbs">...</nav>  <!-- Home › Vegas Dispatch › Article Title -->
<!-- hero, article body, etc. -->
<div id="vs-footer"></div>
<script src="/components/header.js"></script>
<script src="/components/footer.js"></script>
</body>
```

Email signup in articles — use Cloudflare Worker endpoint, not Brevo API directly:
```javascript
fetch('https://brevo-subscribe.vegassidekickcom.workers.dev', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email })
})
```

---

## NEON DESERT (ACTIVE BUILD — `/neondesert/`)

Interactive 3D Las Vegas Strip map. Three.js. Future revenue product:
**Founding Partners** — four tiers of one-time-fee ad inventory
(street bricks · static billboards · rotating digital billboards ·
premium venue zones).

### THE THESIS (non-negotiable)

**Night is the default state. Every landmark self-illuminates against
a dark desert void.** Emissive surfaces + selective bloom + bulb
choreography ARE the product. No golden-hour defaults, no flat scene
lighting washing out faces, no cartoon rendering. Premium, cinematic,
restrained.

### QUALITY BAR

The Welcome Sign module (Phase 1) is the locked reference for
everything that enters this scene. Backlit baked-canvas typography,
selective bloom, choreographed bulbs. If a new asset doesn't clear
the sign's bar, it doesn't ship.

### LOCKED ARCHITECTURE — never refactor without explicit approval

1. **Selective bloom pipeline** (`swapForBloom` / `restoreMats` /
   `blurPass` / `renderFrame`). The scene renders through `renderFrame()`
   — never a bare `renderer.render()`. ACESFilmicToneMapping +
   SRGBColorSpace stay exactly as configured.
2. **The spine is data, not code.** `strip-spine.json` defines the
   Las Vegas Blvd centerline, zone boundaries, and all named ad
   inventory anchors. World objects position relative to the spine.
   Anchor IDs are stable and human-readable — they are future sales
   inventory. Never rename or renumber existing anchors.
3. **Zone module pattern.** Every property is a self-contained zone
   module with footprint, spineRange, side, and LOD tiers. Future
   landmarks follow this pattern verbatim.
4. **CameraRig is controller-agnostic.** DriveController exists now;
   WalkController arrives later without refactoring the rig.
5. **Geometry facts baked into the map:** 8 lanes (4 each way) with
   median. Real geography compressed ~40% along the spine; property
   frontage stays generous — zones never read stacked. Hard Rock
   (former Mirage) and the Athletics ballpark (former Tropicana) are
   UNDER CONSTRUCTION sites: cranes, blinking beacons. Wynn/Encore
   and Venetian/Palazzo are separate buildings.

### PERFORMANCE FLOOR (non-negotiable)

Smooth on a mid-range Android phone: target 60fps, never below 30.
InstancedMesh for repeated elements, merged massing geometry, pixel
ratio capped at 2, bloom at half resolution, draw-call discipline.
FPS meter lives behind `?debug=1`.

### THE IP FIREWALL (legal — do not breach)

Sponsor/advertiser placements live ONLY on fictional street furniture
(bricks, billboards, digitals, zone markers) — NEVER on real property
buildings, their marquees, or their signage. Real properties get
map-style wayfinding labels only. Stylized silhouettes, not replicas
of protected trade dress. Nothing that implies a casino endorsed a
sponsor.

### PHASE DISCIPLINE

- One phase per session. Build ONLY the stated scope. No feature
  creep, no "improvements" to locked modules, no starting the next
  phase early.
- Every phase ends with the verification steps in its prompt —
  including visual comparison against reference before reporting done.
- Fresh session per phase. This file is the continuity.
- Easter eggs (Spike sightings, Lou's convertible, KNOD references,
  hidden 🌵) are a planned content system added in dedicated passes —
  do not scatter them ad hoc.

---

## COMPLIANCE

- **FTC:** Affiliate disclosure on every monetized page; `rel="sponsored"` on all affiliate links.
- No fabricated urgency, countdown timers, fake social proof, or fake reviews.
- **Urgency copy locked:** "Prices **may** increase closer to show date." Never "Prices increase closer to show date."
- **"⭐ Sidekick Pick" badge** is a selective endorsement — only add when explicitly requested.

---

## IMAGE HANDLING (CRITICAL)

**Binary images cannot be uploaded via the MCP/GitHub tools.** Passing base64-encoded binary stores the ASCII string as the file — this corrupts every image uploaded this way.

### The fix: embed images as WebP data URLs in HTML

For images inside HTML pages (article heroes, card thumbnails):
1. Convert to WebP: `cwebp -q 70 photo.jpg -o photo.webp`
2. Generate data URL: `python3 -c "import base64; print('data:image/webp;base64,' + base64.b64encode(open('photo.webp','rb').read()).decode())" > dataurl.txt`
3. Use the data URL as the `src` attribute directly in HTML

**Size targets:**
- Card thumbnails: `cwebp -q 65`, aim for <60KB binary (~80KB data URL)
- Article hero images: `cwebp -q 75`, aim for <100KB binary (~133KB data URL)
- Use `cwebp -size 71680 input.jpg -o output.webp` to hit a specific byte count
- MCP payload limit is ~500KB per push — keep total HTML file under that

**OG/social preview images** require a real hosted URL (crawlers can't use data URLs). Upload as binary via GitHub web interface: `github.com/VegasSidekick/vegas-sidekick/upload/main/images/news`.

---

## PUSHING FILES TO GITHUB (MCP API)

`git push` is blocked in this environment (proxy returns 403). All file pushes go through the Python MCP API:

```python
import urllib.request, json

with open('/home/claude/.claude/remote/.session_ingress_token') as f:
    token = f.read().strip()

mcp_url = "https://api.anthropic.com/v2/ccr-sessions/{SESSION_ID}/github/mcp"
headers = {
    "X-MCP-Server-ID": "f537862b-b4d9-5761-8681-c6df5723856e",
    "X-Session-UUID": "{SESSION_ID}",
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json",
    "Accept": "application/json, text/event-stream"
}

def mcp_push(files, msg):
    payload = {"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {
        "name": "push_files",
        "arguments": {"owner": "VegasSidekick", "repo": "vegas-sidekick",
                      "branch": "main", "files": files, "message": msg}
    }}
    req = urllib.request.Request(mcp_url, data=json.dumps(payload).encode(), headers=headers, method='POST')
    with urllib.request.urlopen(req, timeout=180) as r:
        raw = r.read()
    result = None
    for line in raw.decode().split('\n'):
        if line.startswith('data: '):
            result = json.loads(line[6:])
    text = result.get('result', {}).get('content', [{}])[0].get('text', '') if result else ''
    return '"commit"' in text
```

The `SESSION_ID` and `X-MCP-Server-ID` change each session — read the current values from `/tmp/mcp-config-cse_*.json`.

After every push, sync the local repo:
```
git fetch origin main && git reset --hard origin/main
```

The stop hook checks for uncommitted local changes — the local repo must always match remote after a session.

---

## ALGOLIA SEARCH INDEX SCHEMA

Index name: `vegas_shows`. Expected fields:
- `name` — Show name
- `venue` — Venue/hotel name
- `description` — Short description
- `price` — Price string (e.g., `"From $68"`)
- `category` — Category tag (e.g., `"comedy"`, `"cirque"`)
- `url` — Relative path to show page

---

## NAMING CONVENTIONS

| Thing | Convention | Example |
|---|---|---|
| Show page URLs | kebab-case | `carrot-top`, `michael-jackson-one` |
| CSS classes | BEM-adjacent | `show-card`, `btn-primary`, `show-sidebar` |
| CSS custom properties | `--kebab-case` | `--navy`, `--orange` |
| Image files | kebab-case with descriptors | `carrot-top-hero.jpg`, `spike-wink.png` |
| Component functions | `vs` prefix camelCase | `vsToggleMenu()`, `vsSubmitEmail()` |
| News article slugs | kebab-case, descriptive | `eagles-sphere-additional-shows-2026` |
| HTML deliverables (iterative) | versioned filenames | `name-v2.html`, `name-v3.html` — never overwrite a previous version |

---

## KEY GOTCHAS

1. **No build system** — changes to HTML/CSS/JS take effect immediately on deploy. No compilation step.
2. **Deploy branch is `main`** — pushes to `main` trigger Cloudflare Pages deploy.
3. **Components are injected JS** — header and footer are injected into the DOM by JavaScript. Both require placeholder divs in the HTML; scripts go at the bottom of `<body>`.
4. **Script load order matters** — component scripts go at the bottom of `<body>`, after all content.
5. **Image paths are root-relative** — use `/images/filename.jpg` not relative paths.
6. **Sitemap must be updated manually** — add new pages to `sitemap.xml` when creating show pages or articles.
7. **CSS is all inline** — no shared stylesheet. The design system exists as repeated CSS custom properties in each page's `<style>` block.
8. **Algolia index is external** — adding a show page does not auto-index it.
9. **Category hub pages exist** — all 7 categories have landing pages. When adding a show, also update the category hub.

---

## GIT WORKFLOW

```
cd vegas-sidekick
git add .
git commit -m "<scoped message>"
git push
```

Commit messages are imperative and scoped:
- `Add Michael Jackson ONE show page and images`
- `Add FAQPage schema to all 32 show pages for Google rich results`
- `Update Memorial Day banner copy`

Branch naming: `claude/feature-description-<id>` for AI-assisted work.
