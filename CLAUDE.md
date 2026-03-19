# CLAUDE.md — Vegas Sidekick Codebase Guide

## Project Overview

Vegas Sidekick (`https://vegassidekick.com`) is a **static website** for Las Vegas show ticket discovery and affiliate booking. It has no backend or build system — all content is plain HTML/CSS/JS files deployed directly.

**Business model:** Affiliate revenue via Spotlight.vegas ticket links.

---

## Repository Structure

```
vegas-sidekick/
├── admin/                  # Decap CMS content editor
│   ├── index.html          # CMS web interface entry point
│   └── config.yml          # CMS collection/field definitions
├── components/             # Reusable JS web components
│   ├── header.js           # Site navigation (injected via script tag)
│   └── footer.js           # Email signup + footer links
├── functions/              # Serverless edge functions
│   └── api/
│       └── auth.js         # GitHub OAuth handler (Cloudflare Workers)
├── images/                 # Static image assets
│   ├── logo-*.png/.jpg     # Logo variants
│   ├── *-hero.jpg          # Show hero images
│   ├── spike-*.png/.jpg    # Mascot (Spike) assets
│   └── news/               # CMS-managed news article images
├── search/
│   └── index.html          # Algolia-powered search page
├── shows/                  # Show detail pages
│   ├── comedy/
│   │   └── carrot-top/index.html
│   └── cirque/
│       └── michael-jackson-one/index.html
├── index.html              # Homepage
├── sitemap.xml             # SEO sitemap
└── _redirects              # Netlify routing rules
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Hosting | Netlify (static) + Cloudflare Workers (functions) |
| CMS | Decap CMS v3 (GitHub-backed) |
| Search | Algolia InstantSearch v4 |
| Email | Brevo (formerly Sendinblue) |
| Auth | GitHub OAuth (for CMS admin) |
| Fonts | Google Fonts (Bebas Neue, Barlow, Barlow Condensed) |

**No npm, no build step, no bundler.** All third-party libraries are loaded from CDN.

---

## Design System

### Color Palette (CSS Custom Properties)
```css
--navy:     #0A1628   /* Primary background */
--blue:     #1A6BFF   /* Secondary accent, links */
--orange:   #FF6B00   /* Primary CTA buttons */
--white:    #FFFFFF
--gray-*:   various   /* Text hierarchy */
```

### Typography
- **Headlines:** Bebas Neue (Google Fonts)
- **Body text:** Barlow 400/600/700 (Google Fonts)
- **Labels/Callouts:** Barlow Condensed 700/800 (Google Fonts)

### Responsive Breakpoints
- Desktop → Tablet: `900px`
- Tablet → Mobile: `480px`

### Visual Conventions
- Dark navy theme throughout
- Orange for primary CTAs, Blue for secondary actions
- Starfield background (CSS radial-gradient pattern)
- Glassmorphism on cards (`backdrop-filter: blur`)
- Animations: `fadeUp`, `fadeIn`, `float`, `ctaPulse`

---

## Page Structure Conventions

### Homepage (`index.html`)
All CSS embedded in `<style>` tags. All JS inline at bottom. Components loaded via `<script src="/components/header.js">`.

### Show Detail Pages (`shows/{category}/{show-slug}/index.html`)
Each show page follows this consistent structure:
1. Breadcrumbs (`Home > Category > Show Name`)
2. Hero section with image carousel
3. Two-column layout: Main content (left) + Sticky sidebar (right)
4. Sidebar: Ticket CTA card with price and affiliate link
5. Content blocks: Description, details table, video preview
6. FAQ accordion section
7. "Have you seen this show?" engagement widget
8. Similar shows grid

### URL Pattern for Affiliate Links
```
https://spotlight.vegas/shows/{category}/{show-slug}/ref/vegassidekick
```

---

## Components

### `components/header.js`
Injects the site navigation via `document.currentScript` reference. Includes:
- Logo image
- Desktop nav links: Comedy, Magic, Cirque, Music, Headliners, All Shows
- Mobile hamburger drawer

**Exposed global function:** `vsToggleMenu()` (called by mobile hamburger button)

To include in a page:
```html
<script src="/components/header.js"></script>
```

### `components/footer.js`
Injects footer with email signup and link columns. Integrates with Brevo API.

**Exposed global function:** `vsSubmitEmail()` (called by email form submit button)

To include in a page:
```html
<script src="/components/footer.js"></script>
```

---

## CMS (Decap)

The admin CMS is at `/admin`. It reads/writes content via the GitHub API.

**Config:** `admin/config.yml`
- Backend: `github`, repo `VegasSidekick/vegas-sidekick`
- Media uploads: `images/news/`
- Collection: **News Articles** — fields include title, date, category, image, body, ticket_link, ticket_price, show_date, venue

Authentication is handled by the Cloudflare Worker at `/api/auth`, which implements GitHub OAuth and posts the token back to the CMS via `window.postMessage`.

---

## External Services & Credentials

Credentials are embedded in client-side code (read-only, restricted scope):

| Service | Credential | Location |
|---|---|---|
| Algolia | App ID: `E402SBJE6D`, Search Key in source | `search/index.html` |
| Brevo | API Key in source, List ID: `2` | `components/footer.js` |
| GitHub OAuth | Client ID: `Ov23lit31UqvtSuPp7tJ` | `functions/api/auth.js` |
| GitHub OAuth | Client Secret via `GITHUB_CLIENT_SECRET` env var | `functions/api/auth.js` |

**Note:** The Algolia key is a search-only key and the Brevo key has restricted permissions. The GitHub Client Secret must be stored as an environment variable in Cloudflare Workers — never commit it to the repo.

---

## Development Workflow

### Adding a New Show Page

1. Create directory: `shows/{category}/{show-slug}/`
2. Copy an existing show page (e.g., `shows/comedy/carrot-top/index.html`) as a template
3. Update all show-specific content: title, description, images, pricing, show times, venue, FAQ
4. Update the affiliate ticket link to `https://spotlight.vegas/shows/{category}/{show-slug}/ref/vegassidekick`
5. Add show images to `images/` directory
6. Add the show to `sitemap.xml`
7. Link the show from the relevant category section on `index.html`

### Adding a New Category Page

Currently no category landing pages exist (links go directly to show detail pages). If adding:
- Create `shows/{category}/index.html`
- Update header nav in `components/header.js`
- Update footer links in `components/footer.js`

### Modifying the Header or Footer

Edit the component files directly:
- `components/header.js` — nav links, logo, mobile menu
- `components/footer.js` — link columns, email signup, Brevo list ID

Changes apply site-wide automatically since all pages load these components.

### Deploying

Push to `master` branch. Netlify auto-deploys on push. The Cloudflare Worker (`functions/api/auth.js`) must be deployed separately via Cloudflare dashboard or Wrangler CLI.

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Show page URLs | kebab-case | `carrot-top`, `michael-jackson-one` |
| CSS classes | BEM-adjacent | `show-card`, `btn-primary`, `show-sidebar` |
| CSS custom properties | `--kebab-case` | `--navy`, `--orange` |
| Image files | kebab-case with descriptors | `carrot-top-hero.jpg`, `spike-wink.png` |
| Component functions | `vs` prefix camelCase | `vsToggleMenu()`, `vsSubmitEmail()` |

---

## Key Gotchas

1. **No build system** — changes to HTML/CSS/JS take effect immediately on deploy. There is no compilation step.
2. **Components are injected JS** — header and footer are injected into the DOM by JavaScript. Ensure pages load component scripts before any JS that depends on them.
3. **Script load order matters** — place component `<script>` tags where DOM injection should happen (current pattern injects relative to the script tag position).
4. **Image paths are root-relative** — use `/images/filename.jpg` not relative paths, since pages exist in subdirectories.
5. **Sitemap must be updated manually** — add new pages to `sitemap.xml` when creating new show pages.
6. **CSS is all inline** — there is no shared stylesheet. The design system exists as repeated CSS custom properties in each page's `<style>` block.
7. **Algolia index is external** — the search index `vegas_shows` must be populated separately via the Algolia dashboard or API. Adding a show page does not auto-index it.

---

## Algolia Search Index Schema

The `vegas_shows` Algolia index expects records with these fields:
- `name` — Show name
- `venue` — Venue/hotel name
- `description` — Short description
- `price` — Price string (e.g., `"From $68"`)
- `category` — Category tag (e.g., `"comedy"`, `"cirque"`)
- `url` — Relative path to show page

---

## Git Conventions

Commit messages are imperative, descriptive, and scoped to what changed:
- `Add Michael Jackson ONE show page and images`
- `Wire header/footer components into Carrot Top page`
- `Fix logo path and add all logo and mascot images`

Branch naming: `claude/feature-description-<id>` for AI-assisted work.
