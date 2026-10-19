# Target Website Reverse Engineering - Executive Summary

## 1. Target Identity & High-Level Architecture
- **Target URL**: `https://aexehjvfubefs.ok.kimi.link/`
- **Application Title**: `Workbook · Turn study materials into practice` (题册 · 资料学习工作台)
- **Product Archetype**: A client-side, privacy-first AI-style study workbook (inspired by Google NotebookLM and Quizlet), enabling students and professionals to import study materials, locally extract facts into question banks (without AI server costs or privacy concerns), and practice via interactive quizzes, mock exams, flashcards, and mistake notebooks.
- **Runtime Model**: 100% Client-side Single Page Application (SPA). Zero server dependencies for core functionality.
- **Stack Detected**:
  - React 18+ (Hooks: `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`)
  - Bundler: Vite (ES modules: `index-CxKV-nwI.js`, CSS: `index-sn7STuAq.css`)
  - Styling: Pure CSS with CSS custom properties (`--bg`, `--ink`, `--panel`, etc.), responsive flexbox/grid layout, CSS switches, backdrop dialogs, and 3D card flips.
  - Audio: Native Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`) synthesizing game-like feedback chimes (`tick`, `pop`, `ding`, `err`, `win`).
  - Haptics: `navigator.vibrate`
  - Visual Effects: Custom HTML5 2D Canvas confetti particle physics engine.
  - Export: Native Canvas poster rendering (`toDataURL("image/png")`) and CSS `@media print` PDF generation.
  - Data Compression: Native `CompressionStream("deflate-raw")` and `DecompressionStream("deflate-raw")` for URL sharing via base64 hashes (`#q=z...`).
  - Storage: Browser `localStorage` (`exam-banks`, `exam-wrong`, theme preferences).

---

## 2. Core Value Proposition & Privacy Architecture
- Unlike cloud AI products that transmit sensitive user notes to LLM API backends, this target implements **deterministic client-side NLP / regex fact extraction** (`function Yg` and `function Gg`).
- All documents remain in browser memory; question banks and mistake history stay in `localStorage`.
- No accounts, no logins, no tracking, and no egress network requests.

---

## 3. Scope of Analysis
This investigation was performed using REA (Reverse Engineer Anything) MCP browser capture and inspection tools:
1. **Passive Observation & Scenario Capture**: Recorded DOM, Accessibility Tree (`a11y`), and Viewport Screenshots at Desktop (1280x720), Tablet (768x1024), and Mobile (375x812).
2. **Interactive State Verification**: Tested and captured Source Reader, Flashcards, Quiz Generation modal, Interactive Practice session, Results/Analytics, Question Bank Editor, Mistake Notebook, Study Notes, Source Search, Dark Theme toggle, and Audio synthesis.
3. **Static Bundle Decompilation**: Extracted all data models, sample banks (`Data Structures · Foundations`, `Workplace Safety · General`), sample sources, fact extraction heuristics, compression protocols, and CSS tokens from `index-CxKV-nwI.js` and `index-sn7STuAq.css`.

---

## 4. Documentation Structure
1. [`01_ROUTE_INVENTORY.md`](file:///c:/Users/HP/Desktop/apex/analysis/01_ROUTE_INVENTORY.md): Routing mechanism, screen states, modal states, and URL hash protocol.
2. [`02_COMPONENT_INVENTORY.md`](file:///c:/Users/HP/Desktop/apex/analysis/02_COMPONENT_INVENTORY.md): Complete component hierarchy, props, internal states, and DOM element signatures.
3. [`03_DESIGN_SYSTEM_SPECIFICATION.md`](file:///c:/Users/HP/Desktop/apex/analysis/03_DESIGN_SYSTEM_SPECIFICATION.md): Color tokens (light/dark), typography, spacing, shadows, animations, and responsive breakpoints.
4. [`04_INTERACTION_AND_BEHAVIOR_SPECIFICATION.md`](file:///c:/Users/HP/Desktop/apex/analysis/04_INTERACTION_AND_BEHAVIOR_SPECIFICATION.md): User flows, practice grading, timer, question generation heuristics, audio synthesis, and export mechanics.
5. [`05_ASSET_INVENTORY.md`](file:///c:/Users/HP/Desktop/apex/analysis/05_ASSET_INVENTORY.md): Scripts, stylesheets, fonts, inline SVGs, and sample datasets.
6. [`06_UNKNOWNS_AND_LIMITATIONS.md`](file:///c:/Users/HP/Desktop/apex/analysis/06_UNKNOWNS_AND_LIMITATIONS.md): External dependencies, disabled features, browser compatibility constraints.
7. [`07_PRIORITIZED_IMPLEMENTATION_PLAN.md`](file:///c:/Users/HP/Desktop/apex/analysis/07_PRIORITIZED_IMPLEMENTATION_PLAN.md): Step-by-step rebuilding roadmap from foundation to polish.
