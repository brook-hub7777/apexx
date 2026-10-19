# 01 Route & Screen Inventory

## 1. Routing Model Architecture
The target application does not use traditional browser history URLs (`/path`) or standard `react-router` paths. Instead, it implements a **dual-layer state-based route and overlay architecture** coupled with an optional **URL Hash Protocol (`#q=...`)** for portable deep linking.

### Routing State Variables
1. **Primary Screen Mode (`B` / `mode`)**:
   Controls the central workspace view (`main` column on desktop, or active view when mobile nav is set to "Study").
2. **Modal / Overlay Mode (`V` / `activeModal`)**:
   Controls floating modal dialogs rendered over the entire application.
3. **Responsive Workspace Tab (`F` / `mobileTab`)**:
   On viewport widths `< 900px`, toggles which column is currently active: `"sources"`, `"work"` (Study), or `"studio"`.
4. **URL Hash Parameter (`location.hash`)**:
   Deep-links and restores question banks directly via compressed payloads.

---

## 2. Primary Screen Inventory (`mode` / `B`)

| Screen ID | UI Title (EN / ZH) | Path / Trigger | Purpose | Key Content & Controls |
| :--- | :--- | :--- | :--- | :--- |
| **`home`** | Let's start your notebook... / 开始你的笔记本… | Default entry; or click "Back to overview" | Canvas home & chat-style notebook launcher | • Prompt starter buttons ("Learn about a new topic", "Create a question bank", "Make progress on a review")<br>• Chat query input with "Search" button<br>• "My question banks" grid with question count & chapters<br>• "Create manually" button |
| **`questions`** | [Bank Name] / YOUR EDITABLE QUESTION BANK | Click bank card; click "Practice" in Studio; finish editing | Bank detail & study launcher | • Back button to `home`<br>• Bank name & question count<br>• Action buttons: "Start practice", "Edit questions", "Export bank as JSON"<br>• Question list cards with chapter tags, type badges, and collapsible answer/explanation accordions |
| **`quiz`** | Practice mode / Exam mode (练习 / 考试模式) | Click "Start practice" on bank overview | Active interactive testing session | • Live elapsed timer (`00:00`)<br>• Question indicator (`X / Y`)<br>• Direct jump pagination pills (1..N)<br>• Question stem, chapter tag, type badge<br>• Option buttons / checkboxes / text inputs<br>• Action buttons: "Previous", "Check answer" / "Next"<br>• Instant feedback panel with source citation button |
| **`result`** | [Bank Name] Report / 练习报告 | Complete all questions in quiz; click "Analytics" in topbar | Post-session performance analytics | • Big score indicator (0–100)<br>• Ratio: correct / total (`X / Y`)<br>• Time spent (`mm:ss`)<br>• Chapter-by-chapter mastery progress bars<br>• Action buttons: "Retry these mistakes", "Practice again", "Report image", "Print / PDF" |
| **`cards`** | Recall first. Reveal second. / 先想一想，再看答案 | Click "Flashcards" in Studio panel | Active recall card review | • Question counter (`X / Y`)<br>• Interactive 3D flip card (Front: Question stem, Back: Answer + Explanation)<br>• "Flip to see the answer" trigger<br>• Navigation buttons: "Previous", "Next card" |
| **`edit`** | Edit Question Bank / 编辑题库 | Click "Edit questions" or "Create manually" | Question bank CRUD editor | • Bank title input (max 160 chars)<br>• Left question reorder/delete list (`Fg`)<br>• Right form editor (`$g`): chapter, question type, stem, options, correct answers, explanation<br>• "Add question" button<br>• Action row: "Done editing", "Delete bank" |
| **`source`** | Source reader / 资料阅读器 | Click any source in left panel | Full-text document reader | • Source title, format badge (`MD` / `TXT`), character count<br>• Line-numbered text content<br>• Action buttons: "Generate question bank", "Remove source" |
| **`wrong`** | Make the unfamiliar familiar / 把不熟悉的，再练一遍 | Click "Mistake notebook" in Studio | Persistent wrong-question review | • List of all questions missed across all sessions<br>• Action buttons: "Review all mistakes" (starts quiz with wrong questions only), "Clear notebook" |
| **`note`** | Put your understanding into words / 把理解写下来 | Click "Study notes" or "Add note" in Studio | Markdown study notepad | • Auto-saving textarea (up to 50,000 characters)<br>• Stored in browser `localStorage`<br>• Action button: "Export Markdown" (`study-notes.md`) |
| **`search`** | Find it in your sources / 在原文中找到答案 | Click "Search sources" or "Data table" in Studio | Keyword search across sources | • Search input form with "Find" button<br>• Match count indicator<br>• Search result cards showing source title, line number, and matching excerpt<br>• Click result to open citation modal |

---

## 3. Modal / Dialog Inventory (`activeModal` / `V`)

| Modal ID | Header Title (EN / ZH) | Trigger Event | Dismissal Event | Content & Interactive Elements |
| :--- | :--- | :--- | :--- | :--- |
| **`import`** | Add sources / 添加资料 | Click "Add sources" button in Sources panel | Click backdrop, or close button | • File upload input (.md, .txt)<br>• Text area for raw text paste<br>• Title input field<br>• Submit button: "Add source" |
| **`generate`** | Generate from your sources / 从资料生成题库 | Click "Quiz From your sources" in Studio; or "Generate question bank" in Source Reader | Click close button, or backdrop | • Selected sources list indicator<br>• Dropdown "Maximum questions": `[5, 8, 10, 20]`<br>• Dropdown "Question style": `"mixed"` (Multiple choice + fill-in) or `"blank"` (Fill-in only)<br>• Disclaimers on local extraction<br>• Action button: "Generate question drafts" (`ln()`) |
| **`citation`** | Question source / 题目来源 | Click source citation link on a question feedback or search result | Click close button, or backdrop | • Source title and line number header (`Title · Line X`)<br>• Blockquote containing verbatim text quote<br>• Subtitle explaining snapshot persistence |
| **`share`** | Share this question bank / 分享题库 | Click "Share" button in topbar | Click close button, or backdrop | • Generated link input with URL hash payload<br>• Button: "Copy link"<br>• Toast notification: "Bank link copied" |
| **`poster`** | Learning report / 学习报告 | Click "Report image" in Result view | Click close button, backdrop, or "Close" | • Image tag preview rendering the generated Canvas poster<br>• Action button: "Download image" (`poster.png`)<br>• Tip: "Press and hold to save, or click Download" |

---

## 4. Deep-Linking Protocol (`#q=...`)

The application supports importing portable question banks via URL hash:

### URL Syntax
`https://<domain>/#q=<algorithm><base64_payload>`

1. **Algorithm Flag (`algorithm`)**:
   - `'z'`: Deflate-raw compressed JSON stream.
   - `'p'`: Uncompressed plain JSON string.
2. **Payload Encoding**:
   - Standard URL-safe Base64: `+` replaced by `-`, `/` replaced by `_`.
3. **Decoded Data Schema**:
   ```json
   {
     "n": "Question Bank Name",
     "q": [
       {
         "c": "Chapter Name",
         "k": "single" | "multi" | "judge" | "blank",
         "s": "Question stem text",
         "o": ["Option A", "Option B", "Option C", "Option D"],
         "a": [1],
         "e": "Explanation text"
       }
     ]
   }
   ```
4. **Decompression Implementation**:
   Uses browser native `DecompressionStream("deflate-raw")`:
   ```javascript
   const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
   ```
5. **Payload Size Guard**:
   Enforces maximum 50,000 characters for encoded string, and maximum 1,048,576 bytes (1 MiB) for decompressed JSON to prevent decompression bomb attacks.
