# 06 Unknowns, Limitations & Platform Boundaries

## 1. Placeholder & Disabled Features

| UI Element | Location | Status Observed | Technical Analysis & Recreation Guidance |
| :--- | :--- | :--- | :--- |
| **Audio Overview** | Studio Panel | `disabled` with badge `"Coming soon"` (即将推出) | No audio streaming or podcast synthesis code exists in bundle. It is a planned feature mirroring NotebookLM's Audio Overviews. **Recommendation: Keep button disabled with "Coming soon" chip in MVP.** |
| **Mind Map** | Studio Panel | `disabled` with badge `"Coming soon"` (即将推出) | No canvas/graph visualization engine exists in bundle. **Recommendation: Keep button disabled with "Coming soon" chip in MVP.** |
| **Web Discovery Dropdown ("◉ Web⌄")** | Sources Panel | Interactive button | In browser runtime without a backend proxy, external web scraping is blocked by CORS. The target prompts for manual text/URL input. **Recommendation: Implement as URL fetcher via CORS proxy, or fallback to file upload.** |
| **Fast Research ("Fast research⌄")** | Sources Panel | Interactive button | Similar to Web Discovery; opens prompt suggestions or pre-seeded templates. |

---

## 2. Chat Box vs. Local Search Semantics
The central input box displays:
> *"Ask a question or create something"* with button *"Search"*

- **Observed Behavior**: Despite visual resemblance to an AI chat input, this does **not** call an LLM backend or generate conversational answers.
- **Underlying Implementation**: Submitting a query executes `function Vg(sources, query)`, which performs **local case-insensitive substring search** over selected source lines and routes the user to `search` mode (`Find it in your sources`).
- **User Notice in DOM**:
  > *"Local extraction, not AI reasoning. Generated questions are drafts for you to review. No sources are sent to a model."*

---

## 3. Storage Quotas & Persistence Boundaries
- **Mechanism**: Browser `localStorage` (`exam-banks`, `exam-wrong`, theme/sound settings).
- **Quota Limit**: Browser-imposed ~5 MiB ceiling.
- **Fail-Safe Handler**:
  When `localStorage.setItem` throws `QuotaExceededError`, the top alert banner renders:
  > *"Browser storage is full or unavailable. Changes are in memory only. Export your bank before closing."*
- **Rebuild Recommendation**: For large documents and multiple question banks, consider supplementing `localStorage` with `IndexedDB` (`idb-keyval`) to safely store tens of megabytes of text without quota errors.

---

## 4. URL Share Link Boundaries
- **Length Constraint**: Standard browser URLs become unreliable beyond ~32 KB. The app explicitly sets a safety check:
  ```javascript
  if (shareUrl.length > 40000) throw new Error("large");
  ```
- **Fallback Behavior**: When a bank has > 50 questions or long stems, share link generation fails, triggering toast:
  > *"Cannot create a link. Check question completeness, or export a large bank as JSON."*

---

## 5. Web Audio Autoplay Policy
- Modern browsers suspend `AudioContext` until the user interacts with the page (click/tap).
- In the rebuild, ensure `ctx.state === "suspended"` calls `ctx.resume()` on the first click event to prevent silent failures on initial interaction.
