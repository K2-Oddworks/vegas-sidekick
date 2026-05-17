# Vegas Sidekick — Show Page Builder Prompt

Paste this entire document at the start of a new chat session before requesting a new show page.

---

## What This Project Is

Vegas Sidekick (`vegassidekick.com`) is a **static HTML website** for Las Vegas show ticket discovery and affiliate booking. No build system, no npm, no framework — pure HTML/CSS/JS files deployed via Netlify on push to `main`.

**Revenue model:** Affiliate commissions via ticket links in the format:
```
https://spotlight.vegas/shows/{category-slug}/{show-slug}/ref/vegassidekick
```

**Critical rule:** Never mention "Spotlight.vegas" or any partner name in visible copy text. Links are fine; named references in text are not (business partner may change).

---

## Repository

- **Repo:** `VegasSidekick/vegas-sidekick` on GitHub
- **Deploy branch:** `main` — Netlify auto-deploys on push
- **Feature branches:** `claude/feature-description-<id>` for AI-assisted work
- **Git push** works normally from this environment

---

## Canonical Show Page Template

**Primary reference:** `shows/spectaculars/awakening/index.html`
**Secondary reference:** `shows/adult/absinthe/index.html`
**Comedy reference:** `shows/comedy/laugh-factory/index.html`

Every show page follows this exact structure:

```
<head>
  - charset, favicon, viewport, title, meta description, canonical
  - Open Graph tags (og:title, og:description, og:image, og:url, og:type, og:site_name)
  - Twitter card tags
  - application/ld+json schema (EventSeries type)
  - Google Fonts preconnect + link
  - <style> block (all CSS inline — no shared stylesheet)

<body>
  <div id="vs-header"></div>          ← TOP of body, required

  <div id="progress-bar"></div>       ← scroll progress bar

  <section class="hero">
    1. Breadcrumb nav (.breadcrumbs)
    2. Full-width image slider (.hero-slider, 3 images, 16:9 aspect ratio, max-height 560px)
    3. Hero text block (.hero-content):
       - .venue-label (IBM Plex Mono, show accent color)
       - h1.hero-title (Bebas Neue, huge)
       - p.hero-subtitle (tagline, show accent color)
       - .info-pills row (category, duration, Spike's Pick, venue, age)
       - .urgency-pills row (schedule times with animated orange dots)
    4. .price-strip (price, strikethrough, save badge, CTA button, urgency text)
  </section>

  <div class="page-layout">           ← two-column grid
    <main class="main-content">
      1. .seen-widget
      2. .trust-grid (4 cards)
      3. About section with .spike-callout
      4. .email-signup (Brevo worker)
      5. .details-grid (3-col icon cards)
      6. .expect-grid (2-col "What to Expect")
      7. Seating chart (.seating-section, SVG, .zone-popup, .seat-accord)
      8. .faq-list (accordion, 6–8 Q&A)
      9. .also-grid (3 "You Might Also Like" cards)
    </main>
    <aside class="sidebar">           ← sticky, navy bg
      - Price + CTA
      - Trust checklist (.t-check items)
      - Show info snippet
    </aside>
  </div>

  <div class="final-cta">             ← full-width bottom CTA block
  <div class="mobile-sticky">        ← fixed bottom bar, hidden on desktop

  <div id="vs-footer"></div>         ← BOTTOM, before scripts
  <script src="/components/header.js"></script>
  <script src="/components/footer.js"></script>
</body>
```

---

## Design System

### Colors (CSS custom properties)
```css
--navy:      #0A1628   /* primary background */
--navy-mid:  #0f1e38   /* slightly lighter bg for cards */
--orange:    #FF6B00   /* ALL CTA buttons — never deviate */
--orange-lt: #FF8C2A   /* hover/accent */
--gold:      #C9A84C   /* Spike's Pick accent */
--gold-lt:   #E0C06A
```

### Show-specific accent colors (add per show in :root)
| Category | CSS Variables |
|---|---|
| Comedy | `--show-blue: #1A5FAA; --show-blue-lt: #4A90D4` |
| Magic | `--show-purple: #5B2D8E; --show-purple-lt: #9B6FD4` |
| Cirque | `--show-teal: #0E7C7B; --show-teal-lt: #2EC0BF` (or purple) |
| Spectacular | `--show-blue: #1A42A8; --show-blue-lt: #5B8EE8` |
| Family/Dinner | `--show-red: #8B1A1A; --show-red-lt: #D45050; --show-gold: #C9A84C; --show-gold-lt: #E8C87A` |
| Adult | `--show-red: #8B0000; --show-red-lt: #CC2222` |
| Music | `--show-gold: #C9A84C; --show-gold-lt: #E8C87A` |

The show accent color is used on:
- progress bar gradient end
- `.venue-label`
- `.hero-subtitle`
- category `.pill` background
- `.seen-tag` (if not orange)
- `.email-signup` bar/button
- `.spike-callout` left border
- `.details-grid .detail-card-lbl`
- `.expect-grid .expect-card` top border
- `.also-grid .also-venue`
- `.t-check` icons in sidebar

**Orange is always used for all CTA buttons** (`.hero-cta`, `.sb-cta`, `.mob-cta`, `.final-cta-btn`, `.zone-popup-cta`).

### Fonts
- `Bebas Neue` — headlines, show titles, section titles, CTA buttons
- `Barlow Condensed` — prices, labels, badges, pills
- `Barlow` — body text
- `IBM Plex Mono` — venue labels, monospace meta tags

Google Fonts link (include on every page):
```html
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
```

### Progress bar
```css
#progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, var(--show-color), var(--orange)); z-index: 300; transition: width 0.1s; }
```
JS: `window.addEventListener('scroll', () => { const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100; document.getElementById('progress-bar').style.width = pct + '%'; });`

---

## Hero Slider

3 images, 16:9 ratio, slide every 5 seconds. Always referenced as root-relative paths (`/images/{slug}-hero.webp`).

```html
<div class="hero-slider">
  <div class="slide active" style="background-image:url('/images/{slug}-hero.webp')"></div>
  <div class="slide" style="background-image:url('/images/{slug}-2.webp')"></div>
  <div class="slide" style="background-image:url('/images/{slug}-3.webp')"></div>
  <div class="slide-dots">
    <span class="dot active" onclick="goSlide(0)"></span>
    <span class="dot" onclick="goSlide(1)"></span>
    <span class="dot" onclick="goSlide(2)"></span>
  </div>
</div>
```

JS auto-advance:
```javascript
let slideIdx = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
function goSlide(n) {
  slides[slideIdx].classList.remove('active');
  dots[slideIdx].classList.remove('active');
  slideIdx = n;
  slides[slideIdx].classList.add('active');
  dots[slideIdx].classList.add('active');
}
setInterval(() => goSlide((slideIdx + 1) % slides.length), 5000);
```

---

## Info Pills

```html
<div class="info-pills">
  <span class="pill pill-blue">✨ Comedy</span>
  <span class="pill">⏱ 75 Min</span>
  <span class="pill pill-pick">🌵 Spike's Pick</span>   <!-- only if recommended -->
  <span class="pill">📍 Venue Name</span>
  <span class="pill">🔞 18+</span>
</div>
```

Pill CSS:
```css
.pill { display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 100px; font-family: var(--font-mono); font-size: 0.67rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.74); border: 1px solid rgba(255,255,255,0.11); }
.pill-pick { background: rgba(201,168,76,0.15); color: var(--gold-lt); border-color: rgba(201,168,76,0.35); }
/* Color variant example (change RGB to match show color): */
.pill-blue { background: rgba(26,95,170,0.25); color: var(--show-blue-lt); border-color: rgba(74,144,212,0.4); }
```

## Urgency Pills (animated dots)

```html
<div class="urgency-pills">
  <div class="upill"><span class="udot"></span>Mon–Sun · 8:30 PM &amp; 10:30 PM</div>
</div>
```

```css
.upill { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 6px; font-family: var(--font-mono); font-size: 0.63rem; background: rgba(255,107,0,0.09); color: var(--orange-lt); border: 1px solid rgba(255,107,0,0.2); }
.udot { width: 5px; height: 5px; border-radius: 50%; background: var(--orange); animation: blink 1.6s infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.36} }
```

## Urgency Copy — Locked

✅ **Allowed:** "Prices may increase closer to show date"
❌ **Never:** "Prices increase closer to show date" — removing "may" makes it a false claim
❌ **Never:** Fake countdown timers, fake social proof, fabricated scarcity, made-up reviews

---

## Seen Widget

```html
<div class="seen-widget fade-up">
  <div class="seen-tag">🌵 Spike Wants to Know</div>
  <div class="seen-q">Have you seen [Show Name] before?</div>
  <div class="seen-btns">
    <button class="seen-btn seen-yes" onclick="showSeen('yes')">Yeah, I've been</button>
    <button class="seen-btn seen-no" onclick="showSeen('no')">First time</button>
  </div>
  <div class="seen-resp" id="seen-yes">
    <p>Encouraging repeat-visitor message. <a href="[AFFILIATE_LINK]" target="_blank" rel="noopener">Grab tickets →</a></p>
  </div>
  <div class="seen-resp" id="seen-no">
    <p>Enthusiastic first-timer pitch. <a href="[AFFILIATE_LINK]" target="_blank" rel="noopener">Get your tickets →</a></p>
  </div>
</div>
```

JS: `function showSeen(id) { document.querySelectorAll('.seen-resp').forEach(el => el.classList.remove('visible')); document.getElementById('seen-' + id).classList.add('visible'); }`

The `.seen-resp a` links must be **orange** (`color: var(--orange)`).

---

## Trust Grid (4 cards, always identical)

Copy these exactly — wording is locked. Never name the ticketing partner anywhere in these cards.

```html
<div class="trust-grid fade-up">
  <div class="trust-card"><div class="trust-icon">🔒</div><div class="trust-title">Secure Booking</div><div class="trust-body">Every transaction uses secure, encrypted checkout. Your payment information is always protected.</div></div>
  <div class="trust-card"><div class="trust-icon">⚡</div><div class="trust-title">Instant Delivery</div><div class="trust-body">Tickets arrive by email immediately after purchase. No will-call, no waiting.</div></div>
  <div class="trust-card"><div class="trust-icon">✅</div><div class="trust-title">No Hidden Fees</div><div class="trust-body">The price you see is the price you pay. Nothing added at checkout.</div></div>
  <div class="trust-card"><div class="trust-icon">🎫</div><div class="trust-title">No Account Required</div><div class="trust-body">Buy without creating an account. Fast, clean, tickets straight to your inbox.</div></div>
</div>
```

---

## Spike's Pick / Sidekick Recommend

Only add if the user explicitly says "this is a Sidekick recommend show":
- Add `🌵 Spike's Pick` pill to `.info-pills`
- Add `<div class="card-best-badge">🌵 Spike's Pick</div>` to the show card in `shows/index.html`
- Include `.spike-callout` in the About section with `<strong>🌵 Spike's Pick — Vegas Sidekick Recommends</strong>` label

For **seat-level picks** (e.g., "Sidekick Pick seats are Ruby & Sapphire"):
- Add `<span class="seat-accord-badge">🌵 Spike's Pick</span>` to that zone's accordion row
- Set `pick: true` in that zone's `zoneData` object so the badge shows in the popup

---

## Email Signup (inline in main content)

```html
<div class="email-signup fade-up">
  <div class="email-signup-text">
    <div class="email-signup-title">Get Vegas Deals in Your Inbox</div>
    <div class="email-signup-sub">Last-minute discounts, show alerts, and picks from someone who actually lives here.</div>
  </div>
  <div class="email-form-wrap">
    <input type="email" id="emailInp" placeholder="your@email.com" />
    <button id="emailBtn" onclick="submitEmail()">Get Free Deals 🎟️</button>
    <div class="email-success" id="emailSuccess">✅ You're in!</div>
  </div>
</div>
```

JS:
```javascript
async function submitEmail() {
  const inp = document.getElementById('emailInp');
  const email = inp.value.trim();
  if (!email || !email.includes('@')) return;
  document.getElementById('emailBtn').disabled = true;
  try {
    await fetch('https://brevo-subscribe.vegassidekickcom.workers.dev', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
  } catch(e) {}
  inp.style.display = 'none';
  document.getElementById('emailBtn').style.display = 'none';
  document.getElementById('emailSuccess').classList.add('visible');
}
```

---

## Seating Charts (SVG)

### Theater-in-the-round (e.g., Awakening)
- 5 concentric filled circles, largest first (inner circles sit on top for click priority)
- Dark aisle lines radiating from center
- Section labels in outermost ring
- Each circle: `onclick="selectZone('zone-id')"`

### Arena/horseshoe (e.g., Tournament of Kings)
- Central stage rectangle
- Colored section blocks arranged above, below, and sides
- Named sections with 3 category tiers (A=gold, B=magenta, C=purple)

### Comedy clubs (e.g., Laugh Factory)
- Simple rectangle stage at top or bottom
- VIP front rows (orange/gold), general floor sections, bar area
- Often 3–4 zones only (no balcony)

### Zone popup pattern (same on every page):
```html
<div class="zone-popup" id="zonePopup">
  <div class="zone-popup-hdr">
    <div class="zone-popup-name" id="zoneName">—</div>
    <div class="zone-popup-pick" id="zonePick" style="display:none">🌵 Spike's Pick</div>
  </div>
  <div class="zone-popup-desc" id="zoneDesc"></div>
  <a href="[AFFILIATE_LINK]" class="zone-popup-cta" target="_blank" rel="noopener">Get Tickets in This Zone →</a>
</div>
```

JS:
```javascript
const zoneData = {
  'zone-id': { name: 'Zone Name', pick: false, desc: 'Short description.' },
};
function selectZone(id) {
  const z = zoneData[id];
  document.getElementById('zoneName').textContent = z.name;
  document.getElementById('zoneDesc').textContent = z.desc;
  document.getElementById('zonePick').style.display = z.pick ? 'inline-block' : 'none';
  const popup = document.getElementById('zonePopup');
  popup.classList.add('visible');
  popup.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
```

### Seat accordion (.seat-accord)
Below the SVG and zone popup, a list of all zones with prices and brief notes:
```html
<div class="seat-accord">
  <div class="seat-accord-row" onclick="selectZone('vip')">
    <div class="seat-accord-dot" style="background:#FFD700"></div>
    <div class="seat-accord-name">VIP Front Row <span class="seat-accord-badge">🌵 Spike's Pick</span></div>
    <div class="seat-accord-price">From $XX</div>
  </div>
  <!-- repeat for each zone -->
</div>
```

---

## FAQ Accordion

```html
<div class="faq-list">
  <div class="faq-item">
    <button class="faq-q" onclick="toggleFaq(this)">Question text? <span class="faq-icon">+</span></button>
    <div class="faq-a"><p>Answer text.</p></div>
  </div>
</div>
```

JS: `function toggleFaq(btn) { const item = btn.parentElement; const wasOpen = item.classList.contains('open'); document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open')); if (!wasOpen) item.classList.add('open'); }`

Standard FAQ questions for every show (adapt answers per show):
1. Where do I pick up my tickets?
2. Is there parking?
3. Are there any age restrictions?
4. What's the photography/recording policy?
5. Can I get a refund or exchange if my plans change?
6. What should I wear?
7. How early should I arrive?
8. [Show-specific Q]

**Refund answer (always use this exact language):**
> "Tickets are generally non-refundable once purchased. If your travel plans change, some exchanges may be possible — check the cancellation terms at checkout before completing your order."

---

## "You Might Also Like" Cards (.also-grid)

3 cards linking to other existing show pages. Use shows from the same or adjacent category. Structure:

```html
<div class="also-grid">
  <a href="/shows/{category}/{slug}/" class="also-card" target="_blank">
    <div class="also-img" style="background-image:url('/images/{slug}-hero.webp')"></div>
    <div class="also-body">
      <div class="also-venue">Venue Name</div>
      <div class="also-name">Show Name</div>
      <div class="also-price">From $XX</div>
    </div>
  </a>
</div>
```

---

## Files to Create / Update for Every New Show

### Always CREATE:
- `shows/{category}/{show-slug}/index.html`

### Create IF new category:
- `shows/{category}/index.html` — category landing page (copy spectaculars or comedy pattern)
- Update `components/header.js` — add nav link
- Update `components/footer.js` — add footer column link

### Always UPDATE:
| File | What to change |
|---|---|
| `shows/index.html` | Add schema item (increment `numberOfItems`), add show card HTML, add show name to `defaultOrder` array |
| `sitemap.xml` | Add `<url>` entry with `<lastmod>` (today's date) — and category entry if new |

### Update if show should appear on homepage:
- `index.html` — add card to the relevant section (**always check `git log index.html` before touching this file**)

---

## Show Card HTML (for shows/index.html)

```html
<!-- SHOW NAME -->
<a href="/shows/{category}/{slug}/"
   class="show-grid-card"
   data-name="Show Name"
   data-price="74"
   data-occasions="comedy"
   data-duration="75 min"
   data-age="18+"
   data-schedule="Mon–Sun · 8:30 PM"
   data-venue="Venue Name"
   data-bestfor="Best Stand-Up">
  <div class="card-img-wrap">
    <img src="/images/{slug}-hero.webp" alt="[descriptive alt]" loading="lazy" />
    <div class="card-best-badge">🌵 Spike's Pick</div>   <!-- remove if not recommended -->
    <div class="card-cat-pill">Comedy</div>
  </div>
  <div class="card-body">
    <div class="card-venue">Venue · Hotel</div>
    <div class="card-name">Show Name</div>
    <div class="card-tags">
      <span class="card-tag">🔞 18+</span>
      <span class="card-tag">🗓️ 7 Nights/Week</span>
      <span class="card-tag">75 min</span>
    </div>
    <button class="card-compare-inline" onclick="toggleCompare(event,this,this.closest('.show-grid-card').dataset.name)">+ Add to Compare</button>
    <div class="card-footer">
      <div class="card-price"><div class="card-price-our">$32</div><div class="card-price-was">$49</div></div>
      <span class="card-cta">Get Tickets →</span>
    </div>
  </div>
</a>
```

`data-occasions` values (use all that apply, space-separated):
`comedy` `magic` `cirque` `adult` `music` `spectacular` `family` `date` `dinner` `budget`

---

## Image Handling

Images live in `/images/` and are referenced with root-relative paths.

**3 images per show:**
1. `{slug}-hero.webp` — main promo/action shot (16:9 preferred)
2. `{slug}-2.webp` — second angle or scene
3. `{slug}-3.webp` — third angle or scene

**Processing with Python (if working locally):**
```python
from PIL import Image
import io

img = Image.open("input.jpg").convert("RGB")
img.thumbnail((1400, 900), Image.LANCZOS)
buf = io.BytesIO()
img.save(buf, "webp", quality=72)
with open("images/show-hero.webp", "wb") as f:
    f.write(buf.getvalue())
```

Target sizes: hero ~80KB, slider images ~50KB each.

**Note:** Binary images cannot be pushed via MCP tools (they corrupt as base64 ASCII). Images must be pushed via `git push` or uploaded via the GitHub web interface (`github.com/VegasSidekick/vegas-sidekick/upload/main/images`).

**OG/social preview images** require a real hosted URL (crawlers can't use data URLs). Upload manually via GitHub web UI.

---

## Open Graph / Schema (head block)

```html
<title>Show Name Tickets 2026 | Venue · Hotel | Vegas Sidekick</title>
<meta name="description" content="Show Name tickets from $XX. [One punchy sentence]. [Venue]." />
<link rel="canonical" href="https://vegassidekick.com/shows/{category}/{slug}/" />
<meta property="og:title" content="Show Name | Vegas Sidekick" />
<meta property="og:description" content="[One punchy sentence]. From $XX at [Venue]." />
<meta property="og:image" content="https://vegassidekick.com/images/{slug}-hero.jpg" />
<meta property="og:url" content="https://vegassidekick.com/shows/{category}/{slug}/" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Vegas Sidekick" />
<meta name="twitter:card" content="summary_large_image" />
```

Schema (EventSeries type):
```json
{
  "@context": "https://schema.org",
  "@type": "EventSeries",
  "name": "Show Name",
  "description": "...",
  "image": "https://vegassidekick.com/images/{slug}-hero.jpg",
  "url": "https://vegassidekick.com/shows/{category}/{slug}/",
  "eventStatus": "https://schema.org/EventScheduled",
  "organizer": { "@type": "Organization", "name": "Show Name at Venue" },
  "location": {
    "@type": "Place",
    "name": "Venue",
    "address": { "@type": "PostalAddress", "streetAddress": "...", "addressLocality": "Las Vegas", "addressRegion": "NV", "postalCode": "...", "addressCountry": "US" }
  },
  "offers": {
    "@type": "Offer",
    "url": "https://spotlight.vegas/shows/...",
    "price": "XX",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
```

---

## Content Rules

1. **No partner branding in copy** — Never write "Spotlight.vegas" or any ticket partner name in visible text. Affiliate links themselves are fine.
2. **No "choose your seats"** — Don't use this as a CTA phrase.
3. **No upsell language** — Don't write "upgrade to VIP" or push spending more.
4. **No intermission** — Most shows have none; confirm before writing "no intermission."
5. **Spike's Pick** — Only add if user explicitly says "this is a Sidekick recommend."
6. **Refund FAQ** — Always use the exact generic language in the FAQ section above.
7. **Age policy** — Copy exactly from user's brief; it varies significantly per show.
8. **Prices** — "Our price" is the affiliate price; "box office price" is the strikethrough comparison price.
9. **Photography default** — Unless the brief specifies otherwise, use: *"Still photos are generally welcome — check with your usher before shooting. No flash photography and no video recording. Ushers may ask you to stop at any time."*
10. **Urgency copy** — Only ever write "Prices **may** increase closer to show date." Never drop "may." Never add countdown timers, fake scarcity, or fabricated social proof.

---

## Header & Footer Components

Every page needs both placeholder divs and both script tags:

```html
<body>
  <div id="vs-header"></div>          ← TOP of body (required)
  <!-- all page content -->
  <div id="vs-footer"></div>          ← before scripts
  <script src="/components/header.js"></script>
  <script src="/components/footer.js"></script>
</body>
```

`header.js` also injects Google Analytics (G-BM6QGF7B4Y) — no need to add it separately.

---

## The Brief Template

When starting a new show, provide this exact brief:

```
Show Name:
Category: (comedy / magic / cirque / spectacular / family / adult / music)
Affiliate URL: https://spotlight.vegas/shows/.../ref/vegassidekick

Venue + Hotel:
Address: (street address for schema)
Schedule: (list every day + every show time)
Duration:
Age restriction:
Other restrictions: (photography, recording, dress code)
Warnings: (strobe, pyrotechnics, loud noise, haze, etc.)

Our price (affiliate): $
Box office / comparison price: $
Save amount: $

Sidekick recommend show: yes / no
Sidekick Pick seats: (zone names, "all seats great", or none)

Seating zones: (name, color, seat count/description for each)
Seating layout: (comedy-club / theater-in-the-round / arena-horseshoe / traditional-rows / other)

About / description: (2–3 paragraphs of show content)
"What to Expect" highlights: (3–6 key bullet points)
FAQ specifics: (anything show-unique beyond standard questions)
"You Might Also Like" shows: (3 shows with existing pages)

Images: 3 attached — hero + 2 more
```

**The affiliate URL must be provided exactly.** Do not guess the category slug — it does not always match the site category name (e.g., Tournament of Kings uses `production/tournament-of-kings`, not `family/tournament-of-kings`).

---

## Git Workflow

```bash
# Stage specific files — never use git add -A
git add shows/comedy/show-name/index.html images/show-name-hero.webp

# Commit
git commit -m "Add Show Name show page"

# Push
git push -u origin main
```

After pushing, Netlify deploys automatically. No other steps needed.

---

## Current Show Pages (as of 2026-05-17)

### Comedy (`/shows/comedy/`)
| Show | URL | Our Price |
|---|---|---|
| Carrot Top | /shows/comedy/carrot-top/ | — |
| Laugh Factory | /shows/comedy/laugh-factory/ | $32 |
| Comedy Cellar | /shows/comedy/comedy-cellar/ | $41 |
| Brad Garrett's Comedy Club | /shows/comedy/brad-garretts-comedy-club/ | $51 |
| Marc Savard Comedy Hypnosis | /shows/comedy/marc-savard-comedy-hypnosis/ | $28 |
| Tape Face | /shows/comedy/tape-face/ | $57 |
| Popovich Comedy Pet Theater | /shows/comedy/popovich-comedy-pet-theater/ | $31 |
| LA Comedy Club | /shows/comedy/la-comedy-club/ | $43 |
| Las Vegas LIVE Comedy Club | /shows/comedy/las-vegas-live-comedy-club/ | $30 |
| Marriage Can Be Murder | /shows/comedy/marriage-can-be-murder/ | $95 |

### Magic (`/shows/magic/`)
| Show | URL | Our Price |
|---|---|---|
| Mac King | /shows/magic/mac-king/ | $33 |
| Nathan Burton Comedy Magic | /shows/magic/nathan-burton-comedy-magic/ | $28 |
| Criss Angel MINDFREAK | /shows/magic/criss-angel/ | $117 |
| Shin Lim: LIMITLESS | /shows/magic/shin-lim/ | $67 |
| Penn & Teller | /shows/magic/penn-and-teller/ | $90 |
| Allstars of Magic | /shows/magic/allstars-of-magic/ | $31 |
| Mat Franco | /shows/magic/mat-franco/ | $57 |
| The Mentalist | /shows/magic/the-mentalist/ | $40 |
| Colin Cloud | /shows/magic/colin-cloud/ | $51 |

### Cirque & Acrobatic (`/shows/cirque/`)
| Show | URL | Our Price |
|---|---|---|
| Mad Apple | /shows/cirque/mad-apple/ | $53 |
| O by Cirque du Soleil | /shows/cirque/o/ | $119 |
| KÀ by Cirque du Soleil | /shows/cirque/ka/ | — |
| Michael Jackson ONE | /shows/cirque/michael-jackson-one/ | — |
| Mystère | /shows/cirque/mystere/ | — |

### Spectaculars (`/shows/spectaculars/`)
| Show | URL | Our Price |
|---|---|---|
| Awakening | /shows/spectaculars/awakening/ | $70 |

### Family (`/shows/family/`)
| Show | URL | Our Price |
|---|---|---|
| Tournament of Kings | /shows/family/tournament-of-kings/ | $74 |

### Adult (`/shows/adult/`)
| Show | URL | Our Price |
|---|---|---|
| Absinthe | /shows/adult/absinthe/ | $122 |
| Rouge | /shows/adult/rouge/ | $119 |

### Music & Variety (`/shows/music/`)
| Show | URL | Our Price |
|---|---|---|
| VEGAS! The Show | /shows/music/vegas-the-show/ | $55 |
| Blue Man Group | /shows/music/blue-man-group/ | $65 |

---

## Category Landing Pages (all exist)

| Category | URL | Status |
|---|---|---|
| Comedy | /shows/comedy/ | Full — Spike's Picks, occasion filters, 2-col grid, compare tool |
| Magic | /shows/magic/ | Full |
| Cirque & Acrobatic | /shows/cirque/ | Exists (status: stub or partial) |
| Music & Variety | /shows/music/ | Full |
| Spectaculars | /shows/spectaculars/ | Full — Best For sidebar |
| Family | /shows/family/ | Full |
| Adult | /shows/adult/ | Full |
| All Shows | /shows/ | Full — unified grid with filters, sort, compare |

---

## What "Consistent" Means

A correctly built show page:
- Matches the Awakening/Absinthe page structure (hero → page-layout → final-cta → mobile-sticky)
- Uses the show's accent color for: progress bar, venue-label, hero-subtitle, category pill, spike-callout border, detail-card-lbl, expect-card top border, also-venue, t-check icons
- Uses orange for ALL CTAs — never use the show color on a buy button
- Has a working interactive seating chart with zone popup and seat accordion
- Contains no mentions of any ticket partner name in visible text
- Has 6–8 FAQ items including the standard refund language
- Has exactly 3 "You Might Also Like" cards linking to real existing pages

---

*Last updated: 2026-05-17*
