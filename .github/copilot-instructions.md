# Copilot Instructions — Keyboard Tester Pro

A professional keyboard testing tool built with React 19, Vite, and Tailwind CSS 3.4.
Live at: https://freekeyboardtester.netlify.app/
GitHub: https://github.com/Tadxss/KeyboardTesterPro

## Project Structure

```
src/
  components/
    KeyboardTester.jsx  ← thin orchestrator: showContact state, calls useKeyboardTester(),
                           composes the pieces below
    Header.jsx          ← sticky header
    ControlPanel.jsx    ← mode selector + start/stop/reset/export/numpad buttons + live metrics
    ModeSelector.jsx    ← the mode dropdown, owns its own open/close state
    VirtualKeyboard.jsx ← QWERTY or numpad grid
    KeyStatistics.jsx   ← key-frequency panel
    KeyHistoryPanel.jsx ← recent key-press log panel
    Instructions.jsx    ← info section
    CollabCta.jsx       ← "Got an idea" banner
    Footer.jsx          ← full footer
    BuyMeACoffee.jsx    ← support banner
    ContactModal.jsx    ← contact form modal, submits via lib/contact.js
    ErrorBoundary.jsx   ← top-level crash fallback, wired in main.jsx
  hooks/
    useKeyboardTester.js ← ALL state + keydown/keyup handling + recording/stats, takes an
                           `active` param (pass `!showContact`) to suppress capture while
                           the modal is open
  data/
    testModes.js         ← the basic/pro mode config object
  lib/
    keyboard.js           ← pure functions: buildKeyboardLayouts, buildSpecialKeys,
                            normalizeKeyDown/Up, getKeyClassName, getKeyWidth, formatTime,
                            buildExportPayload, downloadJson
    contact.js             ← submitContactForm, reads the Web3Forms key from env
  test/
    setup.js                ← Vitest + Testing Library setup
  main.jsx
index.html               ← SEO meta, OG tags, GA4, JSON-LD
netlify.toml             ← SPA redirect rule + build config
public/
  sitemap.xml
  robots.txt
```

Tests are colocated next to the file they cover (`keyboard.js` / `keyboard.test.js`, `ContactModal.jsx`
/ `ContactModal.test.jsx`), not in a separate `tests/` folder. See `CLAUDE.md` for the full convention
writeup (this file is a quick-reference summary of it).

## Build, Dev, and Quality Gates

```
npm install         # install dependencies
npm run dev          # start Vite dev server at http://localhost:5173
npm run build         # production build → dist/
npm run preview       # preview production build locally
npm run lint           # ESLint (flat config), zero warnings expected
npm run check-types     # tsc --noEmit (allowJs, checkJs off — opt-in per file)
npm run format          # Prettier --write over src/**/*.{js,jsx,css}
npm run format:check     # Prettier --check, used in CI
npm test                  # Vitest run (jsdom environment)
```

CI (`.github/workflows/ci.yml`) runs lint → check-types → format:check → test → build on every push/PR.

Deploys automatically from GitHub via Netlify on push to main. Node.js 20 is in use — pin
`eslint`/`@eslint/js` to `^9` and `jsdom`/`@testing-library/jest-dom` to versions compatible with Node 20
(their newest majors require Node 22+) if you ever reinstall from scratch.

## Design System

- Background: `bg-slate-900`, Cards: `bg-slate-800`, Header/Footer: `bg-slate-950`
- Accent: purple — `text-purple-400`, `border-purple-500`, `bg-purple-600 hover:bg-purple-700`
- Text: white headings, `text-slate-300` body, `text-slate-400` muted
- Icons: Lucide React
- Page layout: `flex flex-col min-h-screen` root + `flex-1` on `<main>` to pin footer

## ContactModal Conventions

- Title: "Contact the Developer" (with `<Mail>` icon)
- Form labels use inline Lucide icons — `<User>`, `<Mail>`, `<MessageSquare>` (w-3.5 h-3.5 inline mr-1.5)
- Body wrapper must have `text-left` class: `<div className="px-6 py-5 text-left">`
- Web3Forms `access_key` is **not** hardcoded — `lib/contact.js` reads it from
  `VITE_WEB3FORMS_ACCESS_KEY` in a local, gitignored `.env` (see `.env.example`; get the real value from
  the Web3Forms dashboard or a teammate, not from git history)
- Subject line: `Keyboard Tester Pro — Message from ${formData.name}`

## Keyboard Event Guard

`useKeyboardTester(active)` intercepts global `keydown`/`keyup` events. Both handlers guard against
firing when `active` is false (the orchestrator passes `!showContact`) or when an input/textarea is
focused:

```js
if (!active) return;
const tag = document.activeElement?.tagName;
if (tag === 'INPUT' || tag === 'TEXTAREA') return;
```

`active` must be included in the dependency array of both `useCallback` hooks inside
`useKeyboardTester.js`.

## Shared Identity

- Footer "Daryl John Tadeo" links to `https://daryljohntadeo.space/`
- Buy Me a Coffee copy: `"Found this useful? Support the work —"`
- GA4 ID: `G-7ZCMXKRDSC` (this app's own ID — the portfolio and other sub-apps use different IDs, don't
  copy one app's GA4 ID into another)

For the full cross-project design system reference, see `COPILOT.md` in the DarylJohnTadeo portfolio repo.
