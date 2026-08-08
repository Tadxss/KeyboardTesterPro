# CLAUDE.md — Free Keyboard Tester · Project Blueprint

> Reference for Claude Code (and future AI sessions) when making changes to this app.
> Keep this file updated whenever the structure, scripts, or credentials change.

---

## 1. Overview

A professional, 100% client-side keyboard testing tool by Daryl John Tadeo. Built with React 19, Vite,
and Tailwind CSS 3.4, hosted on Netlify at https://freekeyboardtester.netlify.app/. No backend — key
capture, stats, and export all happen in the browser. The only network call in the app is the optional
contact form (Web3Forms).

## 2. Project Structure

`src/components/KeyboardTester.jsx` is a thin orchestrator holding only `showContact` state, calling
`useKeyboardTester(!showContact)`, and composing: `Header`, `ControlPanel` (which renders `ModeSelector`),
`VirtualKeyboard`, `KeyStatistics`/`KeyHistoryPanel` (shown together once a test has started or has
history), `Instructions`, `CollabCta`, `BuyMeACoffee`, `ContactModal`, `Footer`, plus `ErrorBoundary`
(top-level crash fallback, wired in `main.jsx`).

- `src/hooks/useKeyboardTester.js` — **one combined hook** holding everything: pressed-key highlighting,
  recording/stats/history, test mode selection, numpad toggle, export. Kept as a single hook (unlike
  `PdfToBase64`'s separate encode/decode hooks) because key-capture and recording are tightly coupled —
  the same keydown handler updates both `pressedKeys` (always) and history/stats (only while recording).
  Takes an `active` param; the orchestrator passes `!showContact` so key capture is suppressed while the
  contact modal is open (this replaces the old inline `if (showContact) return` check).
- `src/data/testModes.js` — the `basic`/`pro` mode config object (plain data, no platform dependency).
- `src/lib/` — framework-agnostic functions, one concern per file: `keyboard.js` (layout/key-map
  building, event normalization, class-name/width helpers, `formatTime`, export payload + download) and
  `contact.js` (`submitContactForm`, reads the Web3Forms key from env).
- `src/test/setup.js` — Vitest + Testing Library setup (jest-dom matchers, RTL `cleanup` after each test).
- Tests are colocated next to the file they cover (`keyboard.js` / `keyboard.test.js`, `ContactModal.jsx`
  / `ContactModal.test.jsx`), not in a separate `tests/` folder.
- No routes, no global state library — `ModeSelector` owns its own dropdown-open state locally, all other
  state lives in `useKeyboardTester`.
- `src/main.jsx` mounts `<KeyboardTester />` (wrapped in `ErrorBoundary`) into `#root`. There is no
  `App.jsx`/`App.css` — they were a trivial wrapper and unused reset, removed (same cleanup as the other
  sub-apps).
- `index.html` contains all SEO meta tags, Open Graph tags, JSON-LD structured data, and the GA4 snippet.

## 3. Build, Dev, and Quality Gates

```
npm install         # install dependencies
npm run dev          # start Vite dev server at http://localhost:5173
npm run build         # production build → dist/
npm run preview       # preview production build locally
npm run lint           # ESLint (flat config), zero warnings expected
npm run check-types     # tsc --noEmit (allowJs, checkJs off — opt-in per file/as files are converted)
npm run format          # Prettier --write over src/**/*.{js,jsx,css}
npm run format:check     # Prettier --check, used in CI
npm test                  # Vitest run (jsdom environment)
```

CI (`.github/workflows/ci.yml`) runs lint → check-types → format:check → test → build on every push/PR to `main`.

Netlify deploys automatically from GitHub on push to main. Build command: `npm run build`, publish dir: `dist`.
`netlify.toml` at the root handles SPA redirects. `dist/`, `.env`, and `.DS_Store` are gitignored — `dist/`
used to be tracked in git (a stale committed build) and was untracked as part of this cleanup.

**Node version note**: this environment runs Node 20.11.0. `eslint`/`@eslint/js` are pinned to `^9`
(their `10.x` majors require `util.styleText`, added in a newer Node) and `jsdom`/
`@testing-library/jest-dom` are pinned to versions whose `engines` range includes Node 20 (their newest
majors require Node 22+). If a fresh `npm install` pulls in a newer major of any of these and things
break, re-pin rather than trying to upgrade Node in this environment.

---

## 4. Credentials

The Web3Forms access key is **not** hardcoded in source — it's read from `VITE_WEB3FORMS_ACCESS_KEY` in
a local, gitignored `.env` (see `.env.example` for the variable name; get the actual value from the
Web3Forms dashboard or a teammate, not from git history).

| Service | Value |
|---|---|
| Web3Forms email | `daryltadss.workemail@gmail.com` |
| Google Analytics 4 ID | `G-7ZCMXKRDSC` (this app's own ID — do not reuse another sub-app's) |
| Live URL | `https://freekeyboardtester.netlify.app/` |
| GitHub | `https://github.com/Tadxss/KeyboardTesterPro` |

## 5. Design System

Same shared sub-app slate palette, with an **emerald** accent (not purple) for primary UI, and purple
reserved for the collab CTA / contact modal — matches this app's actual Tailwind usage:

- Background: `bg-slate-900`, Cards: `bg-slate-800`, Header/Footer: `bg-slate-950`
- Primary accent: emerald — `text-emerald-400`, active-key/active-mode states use `bg-emerald-500`/`bg-emerald-600`
- CTA/contact accent: purple — same as the other sub-apps
- Text: white headings, `text-slate-300` body, `text-slate-400` muted
- Icons: Lucide React; virtual keyboard uses `font-mono`
- Page layout: `flex flex-col min-h-screen` root (implicit — no explicit wrapper needed since header is
  sticky and footer follows content naturally)

## 6. Core Keyboard-Testing Logic (in `useKeyboardTester` / `lib/keyboard.js`)

- **Key capture**: global `keydown`/`keyup` listeners on `window`. Guarded by the hook's `active` param
  (suppressed while the contact modal is open) and by a focus check (ignored while an `INPUT`/`TEXTAREA`
  has focus).
- **Platform-aware normalization**: `normalizeKeyDown`/`normalizeKeyUp` map raw `event.key`/`event.code`
  to a normalized key (e.g. `Meta` → `Cmd` on Mac, `Win` on Windows/Linux) and a display key, based on
  `getIsMac()` (`navigator.platform.includes('Mac')`).
- **Highlighting**: pressed keys go into a `Set`, auto-removed after `settings.highlightDuration` (200ms
  default) via `setTimeout`.
- **Recording**: `keyHistory` only accumulates while `isRecording` is true AND the current test mode has
  `showHistory`. `keyStats` accumulates whenever the mode has `showStats`, **regardless of whether
  recording has started** — this asymmetry is intentional and preserved from the original implementation,
  not a bug to "fix".
- **Test modes** (`src/data/testModes.js`): `basic` (visual only) vs `pro` (stats + history + export +
  advanced metrics).
- **Export**: `buildExportPayload()` assembles `{ testMode, duration, keyHistory, keyStats, timestamp,
  totalKeys }`, then `downloadJson()` triggers the browser download.
- **No `navigator.userAgentData`** — platform detection intentionally still uses the deprecated
  `navigator.platform` string, matching the original app; not in scope to modernize as part of this
  restructuring pass.

## 7. ContactModal

Title is **"Contact the Developer"** — matches the DarylJohnTadeo/FreeJsonFormatterBeautifier convention
(unlike `PdfToBase64`, which intentionally uses "Get in Touch"). The CTA button that opens it says "Get in
Touch" — that's just the button label, not the modal title, and is consistent with the other sub-apps.
Form labels use inline Lucide icons, subject line `Keyboard Tester Pro — Message from ${formData.name}`,
submission through `lib/contact.js` rather than an inline `fetch` in the component.
