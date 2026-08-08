# Free Keyboard Tester

A professional, 100% client-side keyboard testing and analysis tool — press keys, watch the virtual
keyboard light up, and (in Professional mode) track statistics, history, and export results.

## ✨ Features
- ⚡ Real-time key detection and visualization
- 🖥️ Cross-platform support (Mac, Windows, Linux) with correct modifier-key labels
- ⌨️ Virtual keyboard with visual feedback, plus a toggleable numpad
- 📊 Key statistics and history tracking (Professional mode)
- 📥 Export test results as JSON
- 🚫 No page scrolling during tests

## 🛠️ Tech Stack
| Category       | Technologies                 |
|----------------|------------------------------|
| Frontend       | React 19, JavaScript (ES6+)  |
| Build Tool     | Vite                         |
| Styling        | Tailwind CSS                 |
| Icons          | Lucide React                 |
| Testing        | Vitest, React Testing Library |
| Deployment     | Netlify                      |

## 🚀 Quick Start
### Prerequisites
- Node.js ≥20
- npm

### Installation
```bash
git clone https://github.com/Tadxss/KeyboardTesterPro.git
cd KeyboardTesterPro
npm install
cp .env.example .env   # fill in VITE_WEB3FORMS_ACCESS_KEY
npm run dev
```

### Scripts
```bash
npm run dev            # start the dev server
npm run build           # production build → dist/
npm run preview          # preview the production build locally
npm run lint               # ESLint
npm run check-types         # TypeScript check (tsc --noEmit)
npm run format                # Prettier --write
npm run format:check           # Prettier --check
npm test                        # run the Vitest suite
```

### Usage
1. Click "Start Test" to begin recording keystrokes (Professional mode)
2. Press any keys on your keyboard
3. Watch the virtual keyboard light up in real time
4. View statistics and export results when finished

See `CLAUDE.md` for the full project structure and conventions.

## License
MIT License
