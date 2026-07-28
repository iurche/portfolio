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

### 3. Homepage cover images are ~39MB total (noted 2026-07-28)
The three personal-project covers are all SVG-wrapped full-size JPEGs, loaded on `index.html`:

| File | Size |
|---|---|
| `images/tuza-cover.svg` | ~15MB |
| `images/daily-digest-cover.svg` | ~12MB |
| `images/ca-la-carme-cover.svg` | ~12MB |

That's the single biggest performance problem on the site — the homepage pulls all three. Converting them to WebP (or plain compressed JPEG) at a sane resolution would cut this by well over 90%. Not a regression from any one case study; the pattern was inherited from the Tuza deploy and repeated since.

---

## Recent Changes

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
