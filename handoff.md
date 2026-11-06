# Portfolio Handoff

**Last updated:** 2026-07-28  
**Status:** Deployed to production at https://iurche.vercel.app

---

## What was built

A full 7-page portfolio site rebuilt from a single-page layout. New information architecture matches the structural reference (carmen-elena.space) but with a professional, metric-led tone — outcome-first content throughout.

Six case study pages (`order-help.html`, `contact-experience.html`, `user-profile.html`, `tuza.html`, `daily-digest.html`, `ca-la-carme.html`) have a rich two-column CS2 template with a sticky right rail, AI chat, and mobile drawer.

### Pages

| File | Page | Status |
|---|---|---|
| `index.html` | Home | Live |
| `about-me.html` | About | Live |
| `experience.html` | Experience | Live |
| `contact.html` | Contact | Live |
| `order-help.html` | Case Study — Order Help | Live |
| `contact-experience.html` | Case Study — Contact Experience | Live |
| `user-profile.html` | Case Study — User Profile | Live |
| `tuza.html` | Case Study — Tuza (AI medication companion) | Live |
| `daily-digest.html` | Case Study — Daily Digest (personal AI newspaper) | Live |
| `ca-la-carme.html` | Case Study — Ca la Carme (home automation & AI assistant) | Live |
| `help-center.html` | Case Study — Help Center Redesign (VistaPrint) | Built locally 2026-11-06, **not yet committed/deployed** |
| `work.html`, `process.html`, `lab.html` | My Work / My Process / The Lab | Untracked in git, not linked from the live nav or any page — orphaned, not currently part of the site |

---

## Tech

- **Stack:** Static HTML + `styles.css`. No framework, no build step.
- **Font:** Arsenal (Google Fonts) — loaded on all pages.
- **Palette:** `#F7EFE5` beige · `#222222` dark · `#182060` footer · `#e8e3db` assistant chat bubble · `#f7efe5` rail background.
- **Analytics:** gtag `G-RG9B9LDKWE` — on all pages.
- **Chat widget (global):** `/chat.css` + `/chat.js` — floating chat bubble on all pages. Connects to `/api/chat` via POST.
- **Local dev server:** `server.js` — Node.js HTTP server on port 3001. Serves static files and routes `/api/chat` to `api/chat.js`. Start with `node server.js`. Configured in `.claude/launch.json`.
- **Deploy:** `git push` to `main` → Vercel auto-deploys to `iurche.vercel.app` (project `prj_69kYdA1H3myurlbxerBrw1soHcEN`, team `iurches-projects`).
- **API key:** `ANTHROPIC_API_KEY` is set in Vercel environment variables. Locally, add it to `.env` (gitignored).

---

## Navigation

All pages share a `.site-nav` component:

```
Iura Osadchuk  |  About · Experience · Contact  |  [CV] [LinkedIn]
```

(Work/Process/Lab were dropped from the live nav at some point — those three pages still exist as orphaned, untracked files; see Pages table above.)

Active page gets `class="current"` on its nav link (renders as border-bottom underline).

---

## CS2 Case Study Template

All three case study pages share the same structure and behaviour. Key elements:

### Layout
- Two-column grid at 1280px+: `8fr 4fr` (images left, sticky rail right).
- Below 1280px: single column, rail becomes a full-screen mobile drawer.
- Class: `.cs2-layout` containing `.cs2-images` and `.cs2-rail`.

### Right Rail (`.cs2-rail`)
Contains:
1. Mobile header with close button (hidden on desktop)
2. Scrollable content area (`.cs2-rail-scroll`) with labelled blocks: Situation, Task, Action, Result, Delivers, Stakeholders Managed, Documentation Prepared, Design System Used
3. AI Q&A area (`.cs2-qa-list`) — chat bubbles
4. Sticky input (`.cs2-qa-input-wrap`) at bottom

### Mobile drawer
- `.cs2-rail` base: `position: fixed; inset: 0; transform: translateX(100%); transition: transform 0.28s ease;`
- Open state: `.cs2-rail--open { transform: translateX(0); }`
- Triggered by `.chat-bubble` button (bottom-right, hidden on desktop)
- When open, `body.cs2-rail-open` is added → `.case-study__close-link` is hidden

### AI Chat (Q&A)
- **Endpoint:** POST `/api/chat` — handled by `api/chat.js`
- **Request body:** `{ messages, page }` where `page` is `'order-help'` | `'contact-experience'` | `'user-profile'` | `'tuza'`
- **Page context:** The API appends a page-specific focus instruction to the system prompt based on the `page` field, so the AI knows which case study the user is viewing
- **Model:** Claude via Anthropic API (streaming not used — full response returned)
- **Tone rules in system prompt:** No sycophantic openers ("great question", etc.). Concise, direct.
- **Loading state:** Shows "Thinking…" while waiting
- **Chat bubble styling:** User messages — dark `#222` background, right-aligned. Assistant — `#e8e3db` beige, left-aligned. Matches global `.chat-msg` style.
- **Divider logic:**
  - Border above input (`1px solid #e0dbd3`) — visible by default, hidden once first message sent (via CSS `:has(.cs2-qa-list--active)`)
  - Border above Q&A list — only appears after first message (`.cs2-qa-list--active` class added on first submit)
- **Auto-scroll:** After each response, `railScroll.scrollTop = railScroll.scrollHeight` with 50ms delay

### Scroll snap
- JS debounce (120ms): after scroll stops, if `section#body` top is within viewport, `scrollIntoView({ behavior: 'smooth', block: 'start' })` is called

### Design system pill
- Single link pill: `<a href="https://vista.design/swan" class="cs2-chip">SWAN design system</a>`

### "Thanks for reading" section
- Appears at the bottom of `.cs2-images` column after the image stack
- H2 heading with animated 🖤 heart (class `.cs2-next__heart`)
- Animation: `balloon-float 2.4s ease-in-out infinite` — 2 keyframes only (0%/100% at rest, 50% at peak), translateY -5.5px, rotate 1.25deg
- Two case study cards side by side (`.cs2-next__cards` — `display: flex; flex-direction: row; gap: 24px`)
- Each card: cover image (16:9) + title + "Read case study" primary button bottom-aligned (`flex: 1` on title pushes button down)
- Each page links to the other two case studies

---

## AI System Prompt (`api/chat.js`)

Full context for all three case studies is embedded in the system prompt. Page-specific focus is appended based on the `page` field:

| `page` value | Focus instruction |
|---|---|
| `'order-help'` | Focus on Case Study 1 (Order Help) |
| `'contact-experience'` | Focus on Case Study 2 (Contact Experience) |
| `'user-profile'` | Focus on Case Study 3 (User Profile) |
| `'ca-la-carme'` | Focus on Case Study 4 (Ca la Carme) |
| `'tuza'` | Focus on Case Study 5 (Tuza) |
| `'daily-digest'` | Focus on Case Study 6 (Daily Digest) |
| `'help-center'` | Focus on Case Study 7 (Help Center Redesign) |

---

## Home page (`index.html`)

- "Projects" H2 added above the projects section (`class="header2 projects__header2"`)
- Projects section no longer has 120px `margin-top` (was `.projects--spaced`, now `.projects`)

---

## CSS classes (case study pages — scoped `<style>` blocks)

Each CS2 page has an inline `<style>` block. Key classes:

| Class | Purpose |
|---|---|
| `.cs2-layout` | Two-column grid container |
| `.cs2-images` | Left column — image stack |
| `.cs2-rail` | Right column — sticky info + chat |
| `.cs2-rail-scroll` | Scrollable area inside rail |
| `.cs2-mobile-rail-header` | Mobile only — close button row |
| `.cs2-block` | Labelled content block in rail |
| `.cs2-label` | Uppercase tag label |
| `.cs2-chip` | Pill link (SWAN design system) |
| `.cs2-qa-list` | Chat message list |
| `.cs2-qa-list--active` | Added on first submit — shows top border |
| `.cs2-qa-item` | Single Q+A pair (flex column) |
| `.cs2-qa-item__q` | User bubble — dark, right-aligned |
| `.cs2-qa-item__a` | Assistant bubble — beige, left-aligned |
| `.cs2-qa-item__loading` | "Thinking…" state — italic beige bubble |
| `.cs2-qa-input-wrap` | Sticky input container |
| `.chat-bubble` | Mobile floating button to open rail |
| `.cs2-next` | "Thanks for reading" section |
| `.cs2-next__heading` | H2 with animated heart |
| `.cs2-next__heart` | Floating 🖤 emoji span |
| `.cs2-next__cards` | Two-column card row |
| `.cs2-next__card` | Individual case study card |
| `.cs2-next__img` | Cover image (16:9) |
| `.cs2-next__title` | Card title (flex: 1 for bottom-aligning button) |
| `.cs2-image-stack` | Vertical image list |
| `.cs2-image-item` | Figure + figcaption |

---

## New CSS classes (added to `styles.css`)

| Class | Used on |
|---|---|
| `.site-nav`, `.site-nav__*` | All pages — top nav bar |
| `.stats-strip`, `.stats-strip__*` | `index.html` — 4-stat row |
| `.page-header` | Inner pages — h1 + intro block |
| `.work-grid`, `.work-tile`, `.work-tile__*` | `work.html` |
| `.process-principle` | `process.html` — blockquote |
| `.process-selector`, `.process-tab`, `.process-panel` | `process.html` — tab switcher |
| `.phase-timeline`, `.phase-group`, `.phase-steps`, `.phase-step--*` | `process.html` |
| `.working-style-grid`, `.working-style-card` | `about-me.html` |
| `.experience-list`, `.experience-item`, `.experience-item__*` | `experience.html` |
| `.lab-stats`, `.lab-grid`, `.lab-card`, `.lab-card--featured` | `lab.html` |
| `.contact-form-wrapper`, `.form-group`, `.contact-channels` | `contact.html` |
| `.projects__header2` | `index.html` — "Projects" H2 |

---

## File structure

```
/Users/iuraosadchuk/Desktop/claude/portfolio/
├── index.html
├── work.html
├── process.html
├── about-me.html
├── experience.html
├── lab.html
├── contact.html
├── order-help.html          ← CS2 case study
├── contact-experience.html  ← CS2 case study
├── user-profile.html        ← CS2 case study
├── tuza.html                ← CS2 case study
├── daily-digest.html        ← CS2 case study
├── ca-la-carme.html         ← CS2 case study
├── styles.css               ← shared styles
├── chat.css / chat.js       ← global chat widget
├── server.js                ← local dev server (node server.js on :3001)
├── api/
│   └── chat.js              ← AI handler (Anthropic API)
├── images/                  ← all assets
├── .env                     ← ANTHROPIC_API_KEY (gitignored)
├── .gitignore
├── package-lock.json
└── handoff.md               ← this file
```

---

## Action required

### 1. Contact form — Formspree
The contact form uses a placeholder endpoint:
```html
<form action="https://formspree.io/f/xpwzgkpv" method="POST">
```
1. Go to [formspree.io](https://formspree.io), create account with `iuriiosad@gmail.com`
2. Create a new form, copy the generated ID
3. Replace `xpwzgkpv` in `contact.html`

### 2. Content to review
- ~~Experience dates~~ — confirmed and corrected 2026-07-22: VistaPrint 2024–present, Lynk & Co 2022–2024, Freelance 2021–2022. "Years experience" stat updated from 6+ to 5+ to match.
- **Lab project counts** — update when Tuza or the accessibility framework ships. (`lab.html` is not currently tracked in git / not linked from live nav — see Recent Changes below.)

### 3. ~~Homepage cover images are ~39MB total~~ — resolved 2026-11-06 (see Recent Changes)
The three personal-project covers are all SVG-wrapped full-size JPEGs, loaded on `index.html`:

| File | Size |
|---|---|
| `images/tuza-cover.svg` | ~15MB |
| `images/daily-digest-cover.svg` | ~12MB |
| `images/ca-la-carme-cover.svg` | ~12MB |

That's the single biggest performance problem on the site — the homepage pulls all three. Converting them to WebP (or plain compressed JPEG) at a sane resolution would cut this by well over 90%. Not a regression from any one case study; the pattern was inherited from the Tuza deploy and repeated since.

---

## Recent Changes

### 2026-11-06 (Ca la Carme — e-ink panel made the lead; not yet committed)
- **Situation** now has one paragraph only: the stuck-sensor story, the 17-hour-outage sentence and the "since then the scope has grown" paragraph were deleted at Iura's request. The stuck-sensor context now lives in the Action bullet (12.5h silent block → 3h watchdog) so the Result card still makes sense.
- **Panel leads the design story:** Task opens with the panel; Action now starts with six panel bullets (brief/build with Claude, designing for e-ink, the home screen as control surface incl. the "plain label, not a pill" decision, one job per view, 60s poll / tap-to-inspect / auto-reload / the five-attempt viewport bug, iteration from daily use), then the system bullets. Delivers, Constraints, Documentation and the tech chips also lead with the panel. Same ordering in `api/chat.js` Case Study 4 (new "The e-ink wall panel (main design focus)" section; chat is told there is no panel usage data).
- **Homepage card** (4th in the list, after Help Center, Tuza, Daily Digest) now opens with the e-ink panel; tags start with "E-ink UI Design". The title was later shortened to "Ca la Carme: From Climate Control to a Conversational Home System" (drops "Manual" and "Self-Healing") at Iura's request, on the page and the homepage card.
- Result cards unchanged (no measurable panel result exists — no usage logs).

### 2026-11-06 (Ca la Carme text rewrite — not yet committed)
- **Rewrote the whole rail text of `ca-la-carme.html`, the homepage card, and `api/chat.js` Case Study 4** from a subagent source brief (HANDOFF.md/AGENTS.md/panel source/live HA queries, 2026-11-06). Every old claim was verified; corrections applied:
  - **"12 production automations" → 27 live** (the panel lists 29 entries incl. two retired vacuum ghosts; caption says so). "Most built for this project" — a few (front-door lights etc.) pre-date it.
  - **€8.65/month removed everywhere.** No source for it exists. Replaced by the traceable series (Jul 11.39, Aug 13.59, Sep 6.41, Oct 0.30, Nov 0.00 = **€31.70 cumulative**, ESTIMATED from assumed fan wattage, cooling season only, ~€0 since October because the winter loop has no savings accounting). The Result block no longer leads with savings; it leads with 12.5h → ≤3h.
  - **"under 3h" → "≤3h"**, and the watchdog covers the living room only. **"previous month" → "two months earlier"** for the May outage. **"Three tools" → seven** (bot v1.3.0, claude-sonnet-4-6). **esios sync "on macOS" → runs on the Pi** (the Mac launchd job is failing — not mentioned on the page). Hysteresis card dropped (the "24→22°C bug" wasn't a clean bug; the real, worse one was the inverted guard that stopped the AC ever turning itself off, found 2026-07-20, now in Action).
  - **New content:** winter loop, irrigation (AEMET rain-skip, LinkTap), FusionSolar data (5 → 134), water tariff rebuilt from six bills (62% fixed charges; first model understated garden water ~2.8×), panel details, recent bugs/incidents, honest bot-failure bullet (2026-08-30 fabricated irrigation diagnosis).
- **Flagged to Iura:** the old title claimed "Self-Healing" although several Oct–Nov incidents were noticed by people, not monitoring — resolved by the retitle above (the chat is still told to be careful with that word). The Task says the work was done "working with Claude as a build partner" — **confirm that wording**.
- **Kept off the page:** network addresses, credentials, personal names, the utility company and town, and device names.
- **Security clean-up for the Home Assistant project** is tracked in that project's own notes, not here (this repo is public).
- **Still open:** no photo of the panel on the wall, no usage logs, no winter heating cost tracking, no watchdog firing counts (recorder keeps 5 days).

### 2026-11-06 (Ca la Carme images — not yet committed)
- **Replaced the Home Assistant dashboard screenshots in `ca-la-carme.html` with captures of the e-ink wall panel** (the Pi's `/local/panel/index.html`, LAN-only). New files: `images/ca-la-carme-panel-{home,energy,devices,automations}.png` — captured at the display's native **1872×1404** (4:3, Boox NoteAir) with headless Chrome + `puppeteer-core` installed in the scratchpad (not the repo); script clicks each `[data-tab=…]`. PNGs are 22–41KB because the UI is pure black/white line art, so no WebP needed.
- **Homepage cover replaced:** `images/ca-la-carme-cover.webp` is now the iPad Pro mockup from Figma `14:4933` (2000×1500 → 1600×1200 WebP, 253KB) showing the panel's Home view; it replaced the older mockup in place, so only the homepage card uses it. The Figma "Portfolio" page was cleared to just this node, so earlier frames only exist as the exported `images/help-center-*.webp` files. Note the mockup (like the panel capture) shows "Savings today €0.00".
- **Stack is now (7 images):** Home → Energy → Water → Devices & health → Automations → Garden (all captured from the panel) → Telegram chat (last). The Smart AC editor-logic image (`ca-la-carme-automation-logic.png`) was removed at Iura's request (file left in `images/`, unreferenced), as were the old `ca-la-carme-{overview,thermometer-history,savings-history,automations-list}.png` (also unreferenced, left in `images/`). Water and Garden were first left out by Claude's own editorial call, then added at Iura's request: `images/ca-la-carme-panel-water.png` (28KB) and `images/ca-la-carme-panel-garden.webp` (74KB).
- **Garden view = live 3D "digital twin"** of the garden embedded as an iframe (full colour, animated WebGL; the panel source calls it a deliberate, accepted deviation from the otherwise strict black-and-white, no-animation design). The e-ink wording on the page and in `api/chat.js` now says "…with one deliberate exception (the Garden view)". **Privacy:** it is an aerial render of the real house and garden (roof, solar panels, terraces); Iura chose to include it. The old automations-list screenshot exposed the Pi's LAN IP in the browser bar; the new captures don't.
- **E-ink explanation added** in the first caption, the Energy caption, a new Action bullet and a new Delivers bullet (plus `api/chat.js` Case Study 4 key facts). Facts come from the panel's own source: no animation (e-ink ghosting), grey tones/dash patterns instead of colour, state by black/white inversion, 60s refresh, 1872×1404 design canvas, and the Devices tab names the display "Boox NoteAir (this panel)". **Assumption:** the panel is described as designed by Iura (wording: "Designed a wall-mounted control panel…").
- **Counts:** the panel lists **29 automations** (old caption said 19, from July). The page/chat still say "12 production automations" = the ones built for this project; the instance total includes lighting, irrigation, vacuum etc. Caption now says "29 automations on this instance".
- **Known tension:** the Home capture shows "Savings today €0.00 / €0.00 month" (6 Nov, heating season, AC in HEAT) while the Result block leads with €8.65/mo from an earlier month. Not changed — consider dating the €8.65 figure or recapturing in a month with savings.

### 2026-11-06 (Help Center case study — not yet committed)
- **Added `help-center.html`** — 7th CS2 case study (VistaPrint Help Center redesign), built from the `order-help.html` template. Source material came from a research-subagent brief; images are 4 final desktop frames exported from the Figma "Portfolio" page (`13:31597` home, `13:31616` Orders & Delivery category, `13:31635` topic, `13:31651` Contact Us) → `images/help-center-{home,spoke,topic,contact}.webp` (135–236KB each) plus `help-center-cover.webp` — now the laptop mockup from Figma `14:4928` ("image 1", 1600×1067, 56KB; it replaced the earlier homepage hero crop). It is used for the homepage card and the "Thanks for reading" cards on `order-help.html` / `contact-experience.html`. The Help Center card is **first** in the homepage project list (above Tuza). Mobile frames were not used. A 5th image, the **before** (`HC Home old`, Figma `14:4009` → `images/help-center-old.webp`, 160KB), was added as the first figure; the stack gap on this page is 40px (other case studies use 24px). The stack has two `<h3 class="header3">` labels inside the first figures: **Before** (old frame) and **After** (first redesigned frame). Heading outline on the page is H1 → H3 → H3 → H2 ("Thanks for reading"), i.e. it skips H2; fine visually, flag if an a11y pass is wanted.
- **Experiment results added (from a Statsig readout screenshot supplied by Iura, undated, 50% en-US A/B):** CARE case rate **−3.0% ±2.7%** (interval below zero → measurable); VGP/visitor +1.0% ±9.0%, VTP/visitor +1.0% ±9.1%, RPV +2.8% ±9.4% (all intervals include zero). Page and chat frame revenue as **"trending up, encouraging, not yet statistically confirmed"** — Iura asked for the upward-trend framing instead of "no detectable change"; the short qualifier was kept on purpose so the claim survives scrutiny. **Unknowns to confirm:** readout date / whether it is final or interim, confidence level, sample size, and whether the metrics are relative to control (assumed). Do not convert the case-rate change into contacts avoided or € saved.
- **Other honest-framing rules baked into the page and `api/chat.js` Case Study 7:** no search-usage, article-view or CSAT claims; usability figures (9/10, 9/10, 6/10, n=10) are prototype task completions with no baseline; the 10/10-vs-9/10 source discrepancy on the order-lookup task is resolved to the safer "10/10 oriented, 9/10 reached article"; the IA tree/label tests are credited to UX Research, not Iura; the $500K–$600K figure is a projection and is deliberately **not** on the page.
- **Deliberately left off the public page:** colleague names, Jira/Confluence IDs, the internal GitLab prototype URL, named sibling brand (shown as "other Cimpress brands"), open stakeholder disputes.
- **Wiring:** homepage card added before Order Help in `index.html`; `help-center.html` links to Order Help + Contact Experience; Help Center replaced the Ca la Carme card in `order-help.html` and `contact-experience.html` "Thanks for reading" sections. Side effect: `ca-la-carme.html` is now linked **only from the homepage** (no other case study cross-links to it); its own "Thanks for reading" cards still point at Order Help and Contact Experience.
- Source-doc open items worth knowing: no HC CSAT, no SUS or time-on-task, no formal WCAG audit found; search-pill set in the final mockup differs from the Appendix C recommendation and no source says which was adopted.
- **Figma tooling:** the Framelink MCP token (`mcp__figma__*`) is expired (403 Token expired) — renew in Figma → Settings → Security. The official Figma MCP works but `get_metadata` on huge nodes truncates; screenshot by node id instead.

### 2026-11-06 (covers)
- **Homepage covers converted to WebP:** `tuza-cover.webp` (51KB), `daily-digest-cover.webp` (123KB), `ca-la-carme-cover.webp` (216KB) replace the 38MB of SVG-wrapped JPEGs. Embedded JPEG extracted, cropped to the SVG viewport (matters for Daily Digest, whose embedded image is taller than its viewBox), resized to 1600px wide, WebP q80. References updated in `index.html` and `daily-digest.html`. Colour checked against originals (all sRGB, mean RGB within 1–4 levels).
- The old `*-cover.svg` files are no longer referenced but were left in `images/`. **New covers should be WebP ~1600px wide, not SVG-wrapped exports.**
- Spotted, not fixed: `images/About me.png` 404s on the local server (likely the `%20` in the URL not being decoded by `server.js`) — check whether the live site has the same problem.

### 2026-07-28
- **Backfilled a documentation gap from the prior session (2026-07-22):** `daily-digest.html` (5th CS2 case study, personal AI-curated newspaper) had already shipped and been committed (`a9146ed`) but was never written up here — this entry closes that gap. It's registered in `api/chat.js` as Case Study 6, cross-linked from `order-help.html`, `contact-experience.html`, `tuza.html`, and `user-profile.html`, and has a project card on `index.html`.
- **Corrected stale info found during the same pass:** the Navigation section above still described a 6-link nav (Work/Process/About/Experience/Lab/Contact); the live `.site-nav` only has About/Experience/Contact. `work.html`, `process.html`, and `lab.html` are untracked in git and unlinked from anywhere in the live site — orphaned, not part of production.
- **Shipped `ca-la-carme.html`** — 6th (per `api/chat.js` numbering, Case Study 4) CS2 case study, covering the Ca la Carme home-automation + AI-assistant project (Home Assistant on a Raspberry Pi, 12 production automations, a Claude-powered Telegram bot). The page markup and `api/chat.js` system-prompt section already existed as an untracked draft from an earlier session; this session resolved its one blocker (6 referenced images that didn't exist) and wired it into the live site:
  - Image stack rebuilt around 6 real screenshots the user supplied: 5 from the live Home Assistant dashboard/automation editor (`ca-la-carme-overview.png`, `ca-la-carme-thermometer-history.png`, `ca-la-carme-savings-history.png`, `ca-la-carme-automation-logic.png`, `ca-la-carme-automations-list.png`) and 1 from Telegram (`ca-la-carme-telegram-chat.png`) — the original draft had assumed different (Telegram-heavier) screenshots that were never captured, so captions/alt text were rewritten to match what was actually provided rather than forcing a mismatch.
  - The Telegram screenshot was cropped (via PIL, offset crop — `sips` can't do arbitrary-offset crops) to remove the left sidebar, which exposed the user's other private Telegram chats/channels (contact list, unread counts) — not something to publish on a public page.
  - `images/ca-la-carme-cover.svg` (user-provided iPad mockup, SVG-wrapped JPEG, ~12MB — same pattern as the existing `tuza-cover.svg`/`daily-digest-cover.svg`, not a regression specific to this page) is used for the homepage project card. The in-page `.cs2-cover-img` (the raw dashboard screenshot) is hidden via `style="display:none"` — same pattern as `order-help.html`/`contact-experience.html` — with the first image-stack figure serving as the effective visual lead-in instead.
  - Cross-links: `order-help.html` and `contact-experience.html` each swapped their Daily Digest "Thanks for reading" card for Ca la Carme (their other original card kept); `ca-la-carme.html`'s own two cards link back to `order-help.html` and `contact-experience.html`.
  - `index.html` — added a Ca la Carme project card (grouped with Tuza/Daily Digest, before the work-history case studies).
  - `api/chat.js`'s existing Case Study 4 section and `'ca-la-carme'` `PAGE_FOCUS` entry were checked against the final page content — accurate as-is, no changes needed.
- **`chat.css` — explored, then deliberately left unchanged.** The global chat widget's greeting bubble sits at the top of the drawer with a large empty gap between it and the starter-question buttons (`.chat-drawer` is a fixed `height: 670px`; `.chat-drawer__messages { flex: 1 }` fills the leftover space, top-aligned). Two changes were tried and both reverted: `height: auto` (shrink-wrapped the drawer — changed its size, not wanted) and bottom-aligning the messages via `margin-top: auto` on the first child (kept the height but moved the greeting down to sit above the input). Neither was the desired look; **current prod behaviour is intentional — leave it alone.** Noted here so a future session doesn't "fix" it again.
  - If it's ever revisited: `justify-content: flex-end` is the obvious reach and is wrong — it clips the top of the list once messages overflow, making the earliest ones unreachable by scrolling. `margin-top: auto` on the first child avoids that.
- **Post-commit content edits to `ca-la-carme.html` (not yet committed at time of writing):**
  - Result block — replaced the "17h outage / full HA crash recovered" metric card with **€8.65/mo estimated cost avoided** by shifting AC runtime onto solar surplus. The outage card described an incident rather than an outcome, which is weak as a result. **Framing matters here:** the HA project's own `HANDOFF.md` is explicit that this figure is *not* a measurement — neither AC has a power meter, so draw is inferred from a modelled wattage-per-fan-speed table, and the number sits against ~€19/mo of AC spend over the same period. The card label says so. The genuinely interesting signal is that the system was instrumented to track and report on itself nightly, not the (small) absolute figure. Do not let this get restated as a metered or audited saving.
  - Constraints managed — dropped the "Docker rebuild vs. restart" and "No Python at the HAOS shell level" bullets, leaving Zigbee mesh reliability and unreliable upstream APIs. Both removed items were implementation detail rather than a managed constraint.
  - `api/chat.js` Case Study 4 key facts updated to match, with an explicit instruction not to present the savings figure as metered — otherwise the rail chat would contradict the page.
- **Committed and pushed as `8062e0f`** (12 files) → auto-deployed to `iurche.vercel.app`. The deploy itself was not verified from this session — confirm the live build renders before assuming it's good.
- **Deliberately excluded from that commit:** `images/ca la carme images/` and `images/ca la carme cover.svg` — the raw source folder the screenshots were supplied in. It still contains the **uncropped** Telegram screenshot showing unrelated private chats and unread counts; only the cropped `ca-la-carme-telegram-chat.png` is public. Both are still sitting untracked in `images/` locally. Don't blanket-`git add` this directory.
- Also not committed (pre-existing untracked files, unrelated to this work): `work.html`, `process.html`, `lab.html`, `case-study-template.html`, `.claude/`, assorted stray images.
- Re-confirmed still broken: the local `.env` `ANTHROPIC_API_KEY` is stale (server log: `authentication_error: invalid x-api-key`), so the CS2 rail chat can't be tested end-to-end on `localhost:3001` — it renders its "Something went wrong" fallback correctly, but no real reply. Request wiring was verified as correct (POSTs to `/api/chat` with `page: 'ca-la-carme'`). Production's Vercel key is unaffected.

### 2026-07-22
- **Added `tuza.html`** — 4th CS2 case study, covering the Tuza MSc capstone project (AI medication companion for autoimmune patients). Built from real screenshots captured against the live Tuza Next.js prototype (desktop `PhoneFrame` view, not raw mobile viewport — headless Chrome silently freezes the app's `.fade-up` CSS entrance animation at `opacity: 0`, so screenshot scripts must force it to its resolved end state or the capture looks washed out).
  - Result-block metrics are explicitly labelled as primary-research findings or Year-1 projections, never phrased as achieved outcomes — the project has no production traction yet.
  - Rail includes a "Deliverables" block (renamed from an initial "Prototype" block) linking the live prototype (`tuza-app.vercel.app`) and the product strategy doc.
  - Image stack uses page-scoped overrides (not shared `.cs2-*` classes) since Tuza's screenshots are tall phone-portrait shots rather than the wide desktop screenshots the other 3 case studies use: `.cs2-image-item` background `#2B2B2F` with `24px 0` padding, each `<img>` capped at `max-width: 380px` + `margin: 0 auto`, `border: none`, white figcaption text.
  - Cover image for Tuza uses `images/tuza-cover.svg` (wide 4-phone hero mockup) at natural `.cs2-cover-img` sizing (no cap) — unlike the tall single-phone screenshots in the stack.
  - `order-help.html` and `contact-experience.html` cover images (`.cs2-cover-img`) hidden via `style="display:none"` — markup kept in place, not deleted.
- **`api/chat.js`** — added "Case Study 5: Tuza" section to the system prompt (with an explicit "Honest framing — do not overstate" instruction) and a `'tuza'` entry to `PAGE_FOCUS`. Also fixed a stale "6+ years" reference that was missed in an earlier session's 6→5 years sweep (that sweep only grepped `*.html`, not `.js`).
- **Cross-links** — `order-help.html`, `contact-experience.html`, `user-profile.html` each swapped one "Thanks for reading" card for Tuza (kept one of the original two case studies in each, no page recommends itself).
- **`index.html`** — added Tuza project card (later promoted to first position in the project list); subheader changed from "I turn ambiguous problems into measurable outcomes" to "...into AI-powered products".
- **`chat.css`** — `.chat-drawer__input` `min-height` reduced from 38px to 24px (shared class, affects both the global chat widget and all CS2 rail inputs).
- Scope note: `.env` `ANTHROPIC_API_KEY` locally is stale (auth error against the Anthropic API) — chat is untestable end-to-end on `localhost:3001` until it's refreshed. Production's key (Vercel env var) is unaffected.
- Not committed this session (pre-existing untracked files, unrelated to this work): `work.html`, `process.html`, `lab.html`, `ca-la-carme.html`, `case-study-template.html`, a handful of stray images. These existed before this session started; see git status for current state before assuming they're live.
