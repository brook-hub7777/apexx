# 02 Component Inventory

## 1. Component Hierarchy Overview

```
App (Root)
│
├── TopBar
│   ├── Brand & Notebook Title ("Practice Workbook")
│   ├── TopActionGroup
│   │   ├── CreateNotebookButton ("Create notebook")
│   │   ├── CopyNotebookButton ("Copy")
│   │   └── AnalyticsButton ("Analytics")
│   ├── StorageBadge ("Saved on this device")
│   ├── SoundToggleButton ("Mute / Enable sound")
│   ├── ThemeToggleButton ("Switch to dark / light theme")
│   ├── ShareButton ("Share")
│   ├── SettingsButton ("Settings" -> Mobile Studio Tab)
│   └── UserAvatar ("W")
│
├── MobileNav (Visible only on < 900px)
│   ├── TabButton ("Sources")
│   ├── TabButton ("Study")
│   └── TabButton ("Studio")
│
├── StorageErrorBanner (Conditional: alert role)
│
├── WorkspaceLayout (3 Columns on Desktop, Single Active View on Mobile)
│   │
│   ├── SourcesRail (Column 1 - Left)
│   │   ├── Header ("01 Sources" + Badge Count)
│   │   ├── AddSourcesButton
│   │   ├── SourceDiscoveryMenu ("◉ Web⌄", "Fast research⌄")
│   │   ├── SourceSearchInput ("Search saved sources")
│   │   ├── SelectAllSourcesCheckbox
│   │   ├── SourceCardList
│   │   │   └── SourceCard (Checkbox, Icon, Title, Kind Badge, Sample Badge)
│   │   └── PrivacyNoticeCard ("Your sources stay yours")
│   │
│   ├── MainCanvas (Column 2 - Center)
│   │   ├── CanvasHeader (Title, Conversation settings, More actions, Selection count)
│   │   └── ActiveViewContainer [Switch based on mode]
│   │       ├── HomeView (Starter Prompts, Chat Box, Question Banks Grid)
│   │       ├── BankOverviewView (Bank Title, Stats, Action Row, Question Accordion List)
│   │       ├── QuizView (Timer, Progress, Navigator Pills, Question Stem, Options, Feedback)
│   │       ├── ResultView (Hero Score, Time, Chapter Progress Bars, Action Buttons)
│   │       ├── FlashcardsView (Recall Header, 3D Flip Card, Flip Action, Prev/Next)
│   │       ├── EditorView (Title Input, Question Reorder List, Question Edit Form)
│   │       ├── SourceReaderView (Metadata, Line-Numbered Document Content, Generator Action)
│   │       ├── MistakeNotebookView (Missed Questions List, Review Mistakes Action, Clear)
│   │       ├── StudyNotesView (Auto-saving Markdown Textarea, Export Markdown)
│   │       └── SourceSearchView (Search Input, Matching Excerpts, Citation Triggers)
│   │
│   └── StudioRail (Column 3 - Right)
│       ├── Header ("03 Studio" + Tagline)
│       ├── StudioToolList
│       │   ├── ToolCard: Quiz ("From your sources")
│       │   ├── ToolCard: Flashcards ("Recall & reveal")
│       │   ├── ToolCard: Practice ("Instant feedback")
│       │   ├── ToolCard: Mock Exam ("Grade at the end")
│       │   ├── ToolCard: Reports ("Review your progress")
│       │   ├── ToolCard: Data Table ("Browse source excerpts")
│       │   ├── ToolCard: Audio Overview [Disabled / "Coming soon"]
│       │   └── ToolCard: Mind Map [Disabled / "Coming soon"]
│       ├── BankSelectorCombobox ("Active question bank")
│       ├── StudioSettingsGroup
│       │   ├── Switch: Instant Grading
│       │   ├── Switch: Shuffle Questions
│       │   └── Switch: 10-minute Time Limit
│       └── StudioUtilityList
│           ├── UtilityRow: Mistake Notebook (+ Badge Counter)
│           ├── UtilityRow: Study Notes
│           ├── UtilityRow: Search Sources
│           └── AddNoteButton
│
├── DialogContainer [Switch based on activeModal]
│   ├── ImportModal (Text paste, File upload, Title input)
│   ├── GenerateModal (Max questions, Question style, Source count)
│   ├── CitationModal (Source quote, Document name, Line number)
│   ├── ShareModal (Encoded link input, Copy button)
│   └── PosterModal (HTML5 Canvas poster preview, Download button)
│
├── ToastNotificationContainer (Floating bottom feedback)
└── ConfettiCanvas (Full-screen canvas particle overlay)
```

---

## 2. Detailed Component Specifications

### 2.1. TopBar Component
- **DOM Container**: `<header className="wb-topbar">`
- **Internal States**:
  - `soundMuted` (boolean)
  - `isDark` (boolean)
- **Sub-elements**:
  - `wb-brand`: Title element (`strong`), displays `"Practice Workbook"` or custom notebook name.
  - `wb-top-actions`: Group containing:
    - `wb-create`: Primary action button with `plus` SVG icon. Calls `Oa()` to prompt for a new notebook.
    - `wb-copy`: Button with `copy` SVG icon. Clones active question bank.
    - `wb-analytics`: Button with `chart` SVG icon. Navigates to `result` if previous score exists; otherwise triggers toast.
  - `wb-local`: Informational pill reading `"Saved on this device"` with green pulse indicator.
  - `wb-theme-toggle`: Toggle button switching `data-theme` attribute between `""` and `"dark"`. Displays `sun` or `moon` icon and text label.
  - `wb-share`: Action button opening `share` modal.
  - `wb-settings-button`: On desktop hidden or secondary; on mobile switches `mobileTab` to `"studio"`.
  - `wb-avatar`: Circular badge containing initial letter (e.g. `"W"`).

### 2.2. SourcesRail Component (`SourcesPanel`)
- **DOM Container**: `<aside className="wb-rail wb-sources-rail" role="complementary">`
- **Props / Scope**:
  - `sources`: Array of `{ id, title, kind, selected, sample, text }`
  - `onToggleSelect(id)`: Function to select/deselect a source
  - `onSelectAll(boolean)`: Function to toggle all
  - `onOpenSource(id)`: Function to view document in `SourceReader`
- **Sub-elements**:
  - `wb-rail-head`: Heading `"01 Sources"` + numerical count bubble.
  - `wb-add-source`: Primary button with `plus` icon triggering `import` modal.
  - `wb-source-tools`: Dropdown pills: `"◉ Web⌄"` and `"Fast research⌄"`.
  - `wb-source-search`: Input `<input placeholder="Search saved sources">`.
  - `wb-source-select-all`: Checkbox toggle for all sources.
  - `wb-source-list`: List of `wb-source-item` buttons. Each item renders:
    - Checkbox (checkbox state, stops propagation on toggle)
    - File icon (`it name="file"`)
    - Source title (bold)
    - Metadata badge: `MD` or `TXT` + `Sample source` chip
  - `wb-sources-footer`: Info card with lock icon: `"Your sources stay yours. Files are read in your browser. No account needed."`

### 2.3. StudioRail Component (`StudioPanel`)
- **DOM Container**: `<aside className="wb-rail wb-studio-rail" role="complementary">`
- **Sub-elements**:
  - `wb-rail-head`: Heading `"03 Studio"` + subtitle `"TURN SOURCES INTO PROGRESS"`.
  - `wb-tool-grid`: Grid of buttons with icons and arrow indicators:
    - `Quiz`: triggers `generate` modal.
    - `Flashcards`: sets mode to `"cards"`.
    - `Practice`: sets mode to `"questions"` with instant grading `true`.
    - `Mock exam`: sets mode to `"questions"` with instant grading `false`.
    - `Reports`: checks if session completed; opens `"result"`.
    - `Data table`: opens `"search"`.
    - `Audio overview` & `Mind map`: disabled buttons with badge `"Coming soon"`.
  - `wb-bank-select`: `<select>` element bound to `activeBankId`.
  - `wb-settings`: Group of 3 switch rows:
    - "Instant grading" (checkbox)
    - "Shuffle questions" (checkbox)
    - "10-minute time limit" (checkbox)
  - `wb-studio-utilities`:
    - "Mistake notebook" row with red badge showing wrong question count.
    - "Study notes" row with document icon.
    - "Search sources" row with magnifying glass icon.
    - "Add note" primary button.

### 2.4. QuizView Component (`quiz`)
- **DOM Container**: `<section className="wb-quiz-screen">`
- **State**:
  - `currentIndex` (0 to total-1)
  - `answers` (object or array of user selections)
  - `submitted` (boolean: whether current question is checked)
  - `isCorrect` (boolean)
  - `timer` (elapsed seconds)
- **Sub-elements**:
  - `wb-quiz-header`:
    - Back button ("Back to overview")
    - Mode badge (`Practice mode` or `Exam mode`)
    - Elapsed time clock (`00:00`)
    - Question counter (`X / Y`)
  - `wb-pagination-pills`: Horizontal bar of numbered pills (1..N) with status styles:
    - Default (unanswered)
    - Answered (filled)
    - Current (highlighted ring)
    - Correct (green) / Wrong (red) in instant grading mode
  - `wb-question-card`:
    - Chapter badge + question type badge (`Single choice`, `Multiple choice`, `True / false`, `Fill in`)
    - Question stem statement (`<h3>` or `<p>`)
  - `wb-options-container`:
    - Single choice: 4 buttons (`A`, `B`, `C`, `D`)
    - Multiple choice: 4 checkbox items
    - True / False: 2 buttons (`True`, `False`)
    - Fill-in: Text input field with submit handler
  - `wb-feedback-panel` (Rendered when submitted in Practice mode):
    - Status message: `"Correct"` (green) or `"Incorrect"` (red)
    - Explanation text
    - Citation button: `"Question source ↗"` opening citation dialog
  - `wb-quiz-action-bar`:
    - `Previous` button
    - `Check answer` (Practice) or `Next question` / `Submit exam` (Exam)

### 2.5. FlashcardsView Component (`cards`)
- **DOM Container**: `<section className="wb-flashcards-screen">`
- **State**:
  - `cardIndex` (0 to total-1)
  - `isFlipped` (boolean)
- **Sub-elements**:
  - `wb-card-wrapper`: Container with CSS 3D perspective (`perspective: 1000px`).
  - `wb-flashcard` (`button`):
    - Has class `is-flipped` when `isFlipped === true`.
    - CSS `transform-style: preserve-3d`, `transition: transform 0.4s`.
    - Front face: Question badge (`QUESTION X/Y`), question stem, `"Tap to flip"` prompt.
    - Back face: Answer badge (`ANSWER X/Y`), correct answer text, detailed explanation.
  - `wb-flashcard-controls`:
    - `Previous card` button
    - Indicator: `X / Y`
    - `Next card` button

### 2.6. ResultView Component (`result`)
- **DOM Container**: `<section className="wb-result-screen">`
- **Props**:
  - `result`: `{ score, right, total, spent, byChap }`
- **Sub-elements**:
  - `wb-result-hero`:
    - Score display: 80px font (`X / 100`)
    - Performance summary text: e.g. `"Great job! 9/10 correct in 01:45"`
  - `wb-chapter-breakdown`:
    - List of chapters with progress bars: `byChap[chap].r / byChap[chap].n * 100%`
  - `wb-action-row`:
    - `Retry these mistakes` (primary, disabled if 0 mistakes)
    - `Practice again` (button)
    - `Report image` (triggers poster generation)
    - `Print / PDF` (triggers `window.print()`)
