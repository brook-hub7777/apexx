# 07 Prioritized Implementation Plan

This roadmap outlines the exact engineering phases required to independently rebuild the **Workbook** application from scratch, achieving 100% visual, functional, and offline parity with the target website.

---

## Phase 1: Project Scaffolding & Design System Foundation
- [ ] Initialize modern React project (Vite + React 18+ + TypeScript or JavaScript).
- [ ] Setup global CSS variables (`--bg`, `--ink`, `--panel`, `--line`, `--accent`, etc.) matching [`03_DESIGN_SYSTEM_SPECIFICATION.md`](file:///c:/Users/HP/Desktop/apex/analysis/03_DESIGN_SYSTEM_SPECIFICATION.md).
- [ ] Implement `[data-theme="dark"]` dark mode styles and bind to a theme toggle state with `localStorage` persistence.
- [ ] Install or configure font families (`Geist Variable` or clean system fallbacks).
- [ ] Implement the SVG icon component library (`it` with all 18 icons from [`05_ASSET_INVENTORY.md`](file:///c:/Users/HP/Desktop/apex/analysis/05_ASSET_INVENTORY.md)).

---

## Phase 2: State Management & Storage Engine
- [ ] Define TypeScript interfaces / schemas:
  - `SourceItem`: `{ id, title, kind, selected, sample, text }`
  - `QuestionItem`: `{ c, k, s, o, a, e, source? }`
  - `QuestionBank`: `{ id, name, qs: QuestionItem[] }`
  - `QuizResult`: `{ score, right, total, spent, byChap }`
  - `MistakeItem`: question reference + wrong timestamp
- [ ] Build local storage sync layer:
  - `exam-banks`: persistent question banks array. Pre-populate with default sample banks (`Data Structures · Foundations`, `Workplace Safety · General`) if empty.
  - `exam-wrong`: persistent missed questions array.
  - Storage error boundary / banner if quota exceeded.
- [ ] Build state-based router (`mode`: `home`, `questions`, `quiz`, `result`, `cards`, `edit`, `source`, `wrong`, `note`, `search`).
- [ ] Build modal overlay manager (`activeModal`: `import`, `generate`, `citation`, `share`, `poster`).

---

## Phase 3: Shell Layout & Responsive Navigation
- [ ] Implement `TopBar`:
  - Brand title, "Create notebook", "Copy", "Analytics", local badge, sound toggle, theme toggle, "Share", "Settings", avatar.
- [ ] Implement 3-column desktop layout (`SourcesRail` | `MainCanvas` | `StudioRail`).
- [ ] Implement responsive breakpoint `< 900px`:
  - `<nav className="wb-mobile-nav">` with 3 tabs: "Sources", "Study", "Studio".
  - Collapse desktop rails into active viewport view.

---

## Phase 4: Sources Panel & Document Management
- [ ] Build `SourcesRail`:
  - Header with counter, "Add sources" button, "Search saved sources" filter, "Select all sources" checkbox.
  - Source card list with selection checkboxes and file format badges.
- [ ] Build `ImportModal`:
  - Tabbed or unified file upload (.md, .txt) and raw text paste.
  - Adds new source to `sources` array and marks selected.
- [ ] Build `SourceReaderView` (`mode: "source"`):
  - Line-numbered document display with character count.
  - Actions: "Generate question bank", "Remove source".

---

## Phase 5: Deterministic Local Question Generator
- [ ] Port `function Yg(sources)`:
  - Regex patterns for colon definitions, Chinese definitions, English definitions, and cloze keywords.
- [ ] Port `function Gg(sources, maxQuestions, style)`:
  - Extract facts, generate distractors, randomize option slots, build multiple-choice and fill-in questions.
- [ ] Build `GenerateModal`:
  - Max questions dropdown (`5, 8, 10, 20`), style dropdown (`"mixed"`, `"blank"`).
  - "Generate question drafts" button creates new bank and opens `questions` overview.

---

## Phase 6: Interactive Study & Practice Engine
- [ ] Build `BankOverviewView` (`mode: "questions"`):
  - Bank metadata, actions ("Start practice", "Edit questions", "Export JSON").
  - Question list accordion with collapsible answer & explanation.
- [ ] Build `QuizView` (`mode: "quiz"`):
  - Elapsed live timer, pagination jump pills (1..N).
  - Interactive question components:
    - Single choice (radio buttons A/B/C/D)
    - Multiple choice (checkboxes)
    - True / false (binary buttons)
    - Fill-in (text input with trim & case-insensitive matching)
  - Instant grading mode (`Practice`): immediate feedback, explanation, citation link, and mistake capture.
  - Mock exam mode (`Exam`): delayed grading upon final submission.
- [ ] Build `FlashcardsView` (`mode: "cards"`):
  - 3D CSS flip card (`transform-style: preserve-3d`), question front, answer back, Prev/Next navigation.
- [ ] Build `CitationModal`:
  - Shows source title, line number, and verbatim blockquote excerpt.

---

## Phase 7: Analytics, Mistake Notebook & Studio Tools
- [ ] Build `ResultView` (`mode: "result"`):
  - Score hero (80px), time spent, chapter progress bars.
  - Actions: "Retry these mistakes", "Practice again", "Report image", "Print / PDF".
- [ ] Build `MistakeNotebookView` (`mode: "wrong"`):
  - Displays all missed questions from `localStorage["exam-wrong"]`.
  - Actions: "Review all mistakes" (launches dedicated practice), "Clear notebook".
- [ ] Build `StudyNotesView` (`mode: "note"`):
  - Markdown textarea auto-saving to localStorage, "Export Markdown" button.
- [ ] Build `SourceSearchView` (`mode: "search"`):
  - Keyword search across selected sources with line-numbered excerpt cards.
- [ ] Build `EditorView` (`mode: "edit"`):
  - Reorderable question list, full question CRUD form, "Done editing", "Delete bank".

---

## Phase 8: Multimedia, Polish & Share Protocol
- [ ] Build `WebAudioSynthesizer`:
  - Synthesize `tick`, `pop`, `ding`, `err`, `win` using `OscillatorNode` + `GainNode`.
- [ ] Build `CanvasConfetti`:
  - 2D particle simulation on high score (score >= 80).
- [ ] Build `CanvasPosterGenerator`:
  - Offscreen canvas drawing report card for PNG download.
- [ ] Build Deep-linking Share engine:
  - Compression via `CompressionStream("deflate-raw")` -> `#q=z<base64>`.
  - Decompression via `DecompressionStream("deflate-raw")` on page load.
- [ ] Toast notification system for copy feedback, mode changes, and alerts.

---

## Phase 9: Verification & Parity Testing
- [ ] Test desktop, tablet, and mobile viewports against REA reference screenshots.
- [ ] Test offline behavior (disconnect Wi-Fi: app must remain 100% functional).
- [ ] Verify zero external network egress (excluding optional font loads).
