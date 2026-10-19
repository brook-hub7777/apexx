# 03 Design System Specification

## 1. Design Token Architecture
The target application uses clean CSS custom properties declared on `:root` and overridden via `[data-theme="dark"]`. A secondary playful/editorial color palette is also embedded for poster exports and highlight cards.

### 1.1. Color Tokens

| Token Name | Light Theme Value | Dark Theme Value (`[data-theme=dark]`) | Semantic Purpose |
| :--- | :--- | :--- | :--- |
| `--bg` | `#fbfbfa` | `#0e0d0b` | Global page canvas background |
| `--panel` | `#ffffff` | `#171613` | Card and sidebar panel surface |
| `--raised` | `#f4f4f2` | `#1e1c18` | Elevated card, hover surface, and input background |
| `--ink` | `#14140f` | `#eae5d8` | Primary text and high-contrast iconography |
| `--muted` | `#6f6f68` | `#95907f` | Secondary text, subtitles, and captions |
| `--faint` | `#a3a39c` | `#615d51` | Placeholder text, disabled labels, and subtle borders |
| `--line` | `#e6e6e1` | `#2a2823` | Card borders, dividers, and table outlines |
| `--line-soft` | `#f0f0ec` | `#211f1b` | Subtle separators and table row alternate fills |
| `--accent` | `#1d4ed8` | `#8fb0d6` | Interactive focus, primary buttons, and citations |
| `--accent-ink` | `#ffffff` | `#0f1620` | Text rendered on top of `--accent` elements |
| `--accent-soft` | `#eaeffc` | `#1c2530` | Active tab background, selected option pill background |
| `--pos` | `#0f7b4f` | `#79ae6e` | Success states, correct answer feedback, high scores |
| `--neg` | `#c2352b` | `#dd7b68` | Error alerts, wrong answer indicators, mistake badges |
| `--warn` | `#b4690e` | `#c99a3c` | Warnings, time-limit countdowns, caution banners |
| `--info` | `#2563eb` | `#8fb0d6` | Informational chips and notice callouts |

#### Comic / Editorial Theme Tokens (Used in Report Posters & Badges)
```css
:root {
  --comic-paper: #f7e928;
  --comic-surface: #e7d9b8;
  --comic-rule: #282720;
  --comic-shadow: #282720;
  --comic-type: #25251f;
  --comic-dot: rgba(44, 39, 12, 0.08);
  --comic-red: #ac3e2a;
  --comic-blue: #ccdae0;
  --comic-rose: #efd0bb;
  --comic-cyan: #d3dedb;
  --comic-purple: #dfd1d7;
  --comic-gold: #e8d19a;
  --comic-pink: #e4d3c3;
}
```

---

## 2. Typography Specification

### 2.1. Font Families
1. **Sans-Serif (Body & UI)**:
   ```css
   --sans: "Geist Variable", ui-sans-serif, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
   ```
2. **Monospace (Code, Metrics, Time)**:
   ```css
   --mono: "Geist Mono Variable", ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;
   ```
3. **Serif (Editorial Titles & Quotations)**:
   ```css
   --serif: "Iowan Old Style", Georgia, "Songti SC", "Noto Serif CJK SC", serif;
   ```

### 2.2. Type Hierarchy Scale

| Role / Element | Font Size | Weight | Line Height | Tracking | Font Family |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Score (Result)** | `80px` | 700 | 1.0 | `-0.03em` | `--sans` |
| **Page Title (`h1`)** | `26px`–`30px` | 700 | 1.25 | `-0.02em` | `--sans` or `--serif` |
| **Section Header (`h2`)** | `18px`–`20px` | 600 | 1.3 | `-0.01em` | `--sans` |
| **Card Header (`h3`)** | `15px`–`16px` | 600 | 1.4 | `0` | `--sans` |
| **Body Text** | `14px` | 400 | 1.55 | `0` | `--sans` |
| **Eyebrow / Category Tag** | `11px` | 600 | 1.2 | `0.06em` | `--mono` (Uppercase) |
| **Timer / Counter** | `13px`–`14px` | 500 | 1.0 | `0.02em` | `--mono` |
| **Footnote / Fine Print** | `12px` | 400 | 1.4 | `0` | `--sans` |

---

## 3. Spacing, Sizing & Radii Tokens

### 3.1. Structural Dimensions
```css
:root {
  --bar-h: 60px;          /* Top navigation bar height */
  --rail: 340px;          /* Left & right desktop sidebar widths */
  --rail-wide: 400px;     /* Expanded sidebar width on ultra-wide screens */
  --read: 760px;          /* Maximum reading measure in center column */
  --sheet-w: 480px;       /* Modal dialog sheet width */
  --pad: 20px;            /* Standard component padding */
  --gap: 14px;            /* Grid and flex gap */
  --safe-b: env(safe-area-inset-bottom, 0px); /* Mobile safe area inset */
}
```

### 3.2. Border Radii
```css
:root {
  --r-sm: 4px;   /* Small pills, checkboxes, tag chips */
  --r: 6px;      /* Standard buttons, input fields, cards */
  --r-lg: 10px;  /* Modals, large interactive cards, popovers */
}
```

---

## 4. Responsive Breakpoints

| Breakpoint | Target Screen | Layout Behavior |
| :--- | :--- | :--- |
| **`>= 1550px`** | Ultra-wide Desktop | Sidebar widths expand to `--rail-wide` (`400px`); center reading column centers with max-width `900px`. |
| **`1024px`–`1549px`** | Standard Desktop | Full 3-column layout: Left Sources (`340px`), Center Canvas (flex: 1), Right Studio (`340px`). Top bar shows all action buttons. |
| **`900px`–`1023px`** | Compact Desktop / Tablet Landscape | 3 columns with reduced padding (`--pad: 14px`); secondary actions in topbar collapse to icon-only. |
| **`< 900px`** | Tablet Portrait & Mobile | **1-Column Stack**: Left and Right rails become independent viewports toggled by `<nav className="wb-mobile-nav">` ("Sources", "Study", "Studio"). Top actions collapse. |
| **`< 500px`** | Mobile Phones | Question pagination bar scrolls horizontally; dialogs occupy full width with bottom-sheet styling. |
| **`< 390px`** | Small Mobile (iPhone SE) | Header title font reduces to `14px`; padding drops to `10px`. |

---

## 5. Animation, Elevation & Physics

### 5.1. Timing Functions
```css
:root {
  --ease: cubic-bezier(.22, .7, .2, 1);
  --fast: 0.16s var(--ease);
  --slow: 0.34s var(--ease);
}
```

### 5.2. Key Animations
1. **Interactive Switch Toggle (`.sw`)**:
   - `width: 38px`, `height: 22px`, `border-radius: 11px`.
   - Thumb transforms `translateX(16px)` on checked with `0.16s` ease.
2. **3D Flashcard Flip**:
   - `perspective: 1000px`.
   - Card `.wb-flashcard` rotates `rotateY(180deg)` over `0.4s cubic-bezier(.2, .8, .2, 1)`.
   - Front and back faces use `backface-visibility: hidden`.
3. **Modal Backdrop Blur**:
   - `::backdrop { background: #1218245c; backdrop-filter: blur(4px); }`
4. **Confetti Particle System**:
   - Custom 2D canvas simulation firing 140 particles with randomized velocity, air drag, gravity (`0.42 * L`), and rotation decay over `3200ms`.
   - Auto-disabled when `@media (prefers-reduced-motion: reduce)` is detected.
