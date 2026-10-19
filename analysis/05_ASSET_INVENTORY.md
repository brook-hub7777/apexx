# 05 Asset Inventory & Embedded Datasets

## 1. Network & Script Resource Inventory

| Resource Type | Relative / Absolute URL | Size | HTTP Status | Criticality | Purpose & Replacement Strategy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Document** | `/` (index.html) | 30.6 KB | 200 OK | Critical | HTML root, meta tags, `<div id="root">`. |
| **Stylesheet** | `./assets/index-sn7STuAq.css` | 68.6 KB | 200 OK | Critical | Complete application styles, themes, responsive rules. |
| **JavaScript** | `./assets/index-CxKV-nwI.js` | 316.2 KB | 200 OK | Critical | Complete React application logic, state, and UI. |
| **Font (Sans)** | `../fonts/geist-latin-wght.woff2` | ~45 KB | Referenced | Medium | `Geist Variable` font. Can use system-ui fallback. |
| **Font (Mono)** | `../fonts/geist-mono-latin-wght.woff2`| ~38 KB | Referenced | Medium | `Geist Mono Variable` font. Can use `ui-monospace`. |
| **Kimi Seed** | `https://www.kimi.com/sdk-seed.js` | ~5 KB | External | None | Platform telemetry / badge. **Omit in rebuild.** |
| **Kimi Publish** | `https://statics.kimi.ai/sdk/publish...`| ~12 KB | External | None | Watermark badge. **Omit in rebuild.** |

---

## 2. Inline SVG Icon Catalog

All icons in the application are embedded directly as SVG vectors with standard 24x24 viewBox:

```javascript
const ICONS = {
  x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
  share: '<svg viewBox="0 0 24 24"><path d="M12 15V3M8 7l4-4 4 4M4 14v5a2 2 0 002 2h12a2 2 0 002-2v-5"/></svg>',
  image: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M21 16l-5-5-6 6-3-3-4 4"/></svg>',
  print: '<svg viewBox="0 0 24 24"><path d="M6 9V3h12v6M6 18H4v-6h16v6h-2M8 14h8v7H8z"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5"/></svg>',
  sound: '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4zM17 9.5a4 4 0 010 5"/></svg>',
  mute: '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4zM17 10l4 4M21 10l-4 4"/></svg>',
  gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.2 2.2M16.9 16.9l2.2 2.2M19.1 4.9l-2.2 2.2M7.1 16.9l-2.2 2.2"/></svg>',
  dice: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.3" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/></svg>',
  sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
  moon: '<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  spark: '<svg viewBox="0 0 24 24"><path d="M12 2l2.4 7.2L21.6 12l-7.2 2.4L12 21.6l-2.4-7.2L2.4 12l7.2-2.4z"/></svg>',
  file: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
  download: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>'
};
```

---

## 3. Embedded Default Sample Sources

```javascript
export const SAMPLE_SOURCES = [
  {
    id: "sample-sort",
    title: "01 Sorting algorithms.md",
    kind: "MD",
    selected: true,
    sample: true,
    text: `# Sorting algorithms
Merge sort: A stable comparison sort that divides a sequence, sorts each half, and merges them in O(n log n) time.
Insertion sort: A sorting algorithm that inserts each element into the already sorted prefix and works well on nearly sorted input.
Quicksort: A partition-based sort with average O(n log n) time and worst-case O(n²) time.
Stable sort: A sort that preserves the relative order of elements with equal keys.
Comparison sort: A sort based only on comparing elements, with a worst-case lower bound of O(n log n).`
  },
  {
    id: "sample-structures",
    title: "02 Essential data structures.md",
    kind: "MD",
    selected: true,
    sample: true,
    text: `# Essential data structures
Stack: A last-in-first-out linear data structure often used for function calls and expression evaluation.
Queue: A first-in-first-out linear data structure used in task scheduling and breadth-first search.
Hash table: A structure mapping keys to storage positions, with average O(1) lookup and worst-case O(n) lookup.
Binary search tree: A tree with at most two children per node, smaller keys on the left and larger keys on the right.
B+ tree: A balanced multiway search tree, not a binary tree, commonly used for database indexes.`
  },
  {
    id: "sample-search",
    title: "03 Search and traversal.txt",
    kind: "TXT",
    selected: true,
    sample: true,
    text: `Binary search: A search method on sorted sequences that eliminates half the remaining range at each step, with O(log n) time.
Breadth-first search: A layer-by-layer traversal method that can find the shortest path in an unweighted graph.
Depth-first search: A traversal method that explores as deep as possible along a branch before backtracking; does not guarantee shortest paths.
Bellman-Ford: A single-source shortest path algorithm allowing negative edge weights that can detect reachable negative cycles.
Dijkstra: A single-source shortest path algorithm suitable only for graphs with non-negative edge weights.`
  }
];
```

---

## 4. Embedded Initial Question Banks

### 4.1. Data Structures · Foundations (`id: "ds"`)
- **Category Breakdown**:
  - `Sorting` (2 questions: Merge sort stability, Insertion sort speed)
  - `Search` (2 questions: Binary search comparison count, Pre-sorting requirement)
  - `Complexity` (2 questions: O(1) average operations, Comparison sort lower bound)
  - `Trees` (2 questions: Complete binary tree height, Balanced search trees)
  - `Graphs` (2 questions: Negative edge handling via Bellman-Ford, DFS path optimality)

### 4.2. Workplace Safety · General (`id: "safe"`)
- **Category Breakdown**:
  - `Policy` (2 questions: Leadership responsibility, Orientation mandate)
  - `Site` (2 questions: Construction PPE, Electric shock first response)
  - `Fire` (2 questions: Electrical extinguisher choice, Safety pin protocol)
  - `Emergency` (2 questions: Elevator fire hazard, Confined space requirements)
