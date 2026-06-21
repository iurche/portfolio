# Portfolio Handoff

**Last updated:** 2026-06-21  
**Status:** Deployed to production at https://iurche.vercel.app

---

## What was built

A full 7-page portfolio site rebuilt from a single-page layout. New information architecture matches the structural reference (carmen-elena.space) but with a professional, metric-led tone — outcome-first content throughout.

Three case study pages (`order-help.html`, `contact-experience.html`, `user-profile.html`) have a rich two-column CS2 template with a sticky right rail, AI chat, and mobile drawer.

### Pages

| File | Page | Status |
|---|---|---|
| `index.html` | Home | Live |
| `work.html` | My Work | Live |
| `process.html` | My Process | Live |
| `about-me.html` | About | Live |
| `experience.html` | Experience | Live |
| `lab.html` | The Lab | Live |
| `contact.html` | Contact | Live |
| `order-help.html` | Case Study — Order Help | Live |
| `contact-experience.html` | Case Study — Contact Experience | Live |
| `user-profile.html` | Case Study — User Profile | Live |

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
Iura Osadchuk  |  Work · Process · About · Experience · Lab · Contact  |  [CV] [LinkedIn]
```

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
- **Request body:** `{ messages, page }` where `page` is `'order-help'` | `'contact-experience'` | `'user-profile'`
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
- **Experience dates** — VistaPrint 2022, Lynk & Co 2020–2022, Freelance 2019–2020. Confirm accuracy.
- **Lab project counts** — update when Tuza or the accessibility framework ships.
