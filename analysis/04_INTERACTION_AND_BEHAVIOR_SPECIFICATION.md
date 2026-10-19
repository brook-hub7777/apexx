# 04 Interaction & Behavior Specification

## 1. Document Management & Local Question Extraction

The heart of the application is a **deterministic, client-side NLP / regex knowledge extraction engine** that transforms study text into structured practice questions without calling external AI APIs.

### 1.1. Extraction Algorithm (`function Yg`)
```javascript
function Yg(sources) {
  const facts = [];
  for (const source of sources) {
    // Normalize and split text by line breaks
    source.text.split(/\n+/).forEach((line, lineIndex) => {
      // Strip markdown headers, bullets, and numbering
      const cleaned = line.replace(/^\s*(?:#{1,6}\s+|[-*•]\s+|\d+[.)、]\s*)/, "").trim();
      if (cleaned.length < 8 || cleaned.length > 1500) return;

      // Pattern 1: Colon definition (Term: Definition)
      let match = cleaned.match(/^([^:：]{2,48})[:：]\s*(.{5,})$/);
      
      // Pattern 2: Chinese definition (Term 是指/是 Definition)
      if (!match) match = cleaned.match(/^(.{2,24}?)(?:是指|指的是|是)(.{5,})[。.]?$/);
      
      // Pattern 3: English definition (Term is/are/means Definition)
      if (!match) match = cleaned.match(/^(.{2,48}?)\s+(?:is|are|means)\s+(.{5,})$/i);

      if (match) {
        const term = match[1].replace(/\*\*/g, "").trim();
        if (term && term.length < 49) {
          facts.push({
            term,
            definition: match[2].trim(),
            quote: cleaned,
            source: { id: source.id, title: source.title, index: lineIndex + 1, quote: cleaned }
          });
        }
      } else {
        // Pattern 4: Cloze fallback (Bold text or key numbers)
        const boldTerm = cleaned.match(/\*\*([^*]{2,40})\*\*/)?.[1] || 
                         cleaned.match(/\b\d+(?:\.\d+)?(?:%|年|天|小时)?\b/)?.[0];
        if (boldTerm) {
          facts.push({
            term: boldTerm,
            definition: cleaned.replace(/\*\*/g, ""),
            quote: cleaned,
            cloze: true,
            source: { id: source.id, title: source.title, index: lineIndex + 1, quote: cleaned }
          });
        }
      }
    });
  }

  // Deduplicate by lowercase term + definition
  const seen = new Set();
  return facts.filter(f => {
    const key = f.term.toLowerCase() + f.definition;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
```

### 1.2. Question Draft Generation (`function Gg`)
```javascript
function Gg(sources, maxQuestions = 8, style = "mixed", isEnglish = true) {
  if (!sources.length) throw new Error("select");
  const facts = Yg(sources);
  if (!facts.length) throw new Error("facts");

  const limit = Math.max(1, Math.min(30, Number(maxQuestions) || 8));
  return facts.slice(0, limit).map((fact, index) => {
    // Collect 3 distractor terms from other facts
    const distractors = [...new Set(facts.filter(f => f.term !== fact.term).map(f => f.term))].slice(0, 3);
    const baseMeta = { c: fact.source.title, e: fact.quote, source: fact.source };

    // If style is mixed and 3 valid distractors exist, build a 4-choice single choice question
    if (style === "mixed" && !fact.cloze && distractors.length === 3) {
      const correctIndex = index % 4;
      const options = [...distractors];
      options.splice(correctIndex, 0, fact.term);
      return {
        ...baseMeta,
        k: "single",
        s: (isEnglish ? "Which concept matches this description?\n" : "根据资料，以下描述对应哪个概念？\n") + fact.definition,
        o: options,
        a: [correctIndex]
      };
    }

    // Otherwise build a fill-in blank question
    return {
      ...baseMeta,
      k: "blank",
      s: fact.cloze ? fact.definition.replace(fact.term, "______") : (isEnglish ? "______ — " : "______：") + fact.definition,
      a: [fact.term]
    };
  });
}
```

---

## 2. Practice & Mock Exam Interaction Mechanics

### 2.1. Dual-Mode Workflow Matrix

| Feature | Practice Mode (`instantGrading: true`) | Mock Exam Mode (`instantGrading: false`) |
| :--- | :--- | :--- |
| **Immediate Feedback** | Yes. Answer revealed immediately on "Check answer". | No. Options recorded; feedback withheld until exam submission. |
| **Option Mutability** | Locked once "Check answer" is pressed. | Freely mutable until final submission. |
| **Sound & Haptics** | Immediate `ding` (correct) or `err` (wrong) + `vibrate(12)`. | Silent until completion (`win` on score >= 80). |
| **Mistake Capture** | Wrong answers saved immediately to `localStorage["exam-wrong"]`. | Wrong answers saved upon submission. |
| **Explanations & Citations** | Available immediately after checking each question. | Available only on the final Results screen. |
| **Time Limit** | Optional (default off). | Optional 10-minute timer (`timer.mode = "down"`). |

### 2.2. Scoring Formula (`function Qg`)
```javascript
function Qg(questions, answers, gradeFn, spentSeconds = 0) {
  const graded = questions.map((q, idx) => gradeFn(q, answers[idx]));
  const rightCount = graded.filter(Boolean).length;
  const chapterBreakdown = {};

  questions.forEach((q, idx) => {
    const chap = q.c || "General";
    chapterBreakdown[chap] ||= { n: 0, r: 0 };
    chapterBreakdown[chap].n++;
    if (graded[idx]) chapterBreakdown[chap].r++;
  });

  return {
    graded,
    score: questions.length ? Math.round((rightCount / questions.length) * 100) : 0,
    right: rightCount,
    total: questions.length,
    spent: Math.max(0, spentSeconds),
    byChap: chapterBreakdown
  };
}
```

### 2.3. Celebration Trigger
When `score >= 80` upon session completion:
1. Audio: `toolkit.sound.win()` plays ascending 4-note chord `[C5, E5, G5, C6]`.
2. Visual: `toolkit.confetti()` spawns 140 animated canvas confetti particles across the viewport.

---

## 3. Web Audio Synthesis Specification (`toolkit.sound`)

All audio is generated dynamically using Web Audio API nodes (`OscillatorNode` + `GainNode`), requiring no external MP3/WAV files.

```javascript
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx && typeof AudioContext !== "undefined") {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playTone(freq, duration = 0.08, type = "sine", gainVal = 0.12, rampFreq = null) {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  if (rampFreq) {
    osc.frequency.exponentialRampToValueAtTime(rampFreq, ctx.currentTime + duration);
  }

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(gainVal, ctx.currentTime + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration + 0.02);
}

const sound = {
  tick() { playTone(1180, 0.028, "square", 0.05); },
  pop()  { playTone(520, 0.07, "triangle", 0.11, 880); },
  ding() {
    playTone(880, 0.16, "sine", 0.13);
    setTimeout(() => playTone(1320, 0.22, "sine", 0.1), 90);
  },
  err()  { playTone(220, 0.16, "sawtooth", 0.07, 130); },
  win()  {
    [0, 110, 220, 400].forEach((delay, idx) => {
      setTimeout(() => playTone([523, 659, 784, 1047][idx], 0.34, "triangle", 0.12), delay);
    });
  }
};
```

---

## 4. Question Bank Serialization & Deep-Linking Protocol

### 4.1. Export to URL (`toolkit.share.link`)
1. Data payload: `{ n: bank.name, q: bank.qs }`.
2. Convert to JSON UTF-8 bytes: `new TextEncoder().encode(JSON.stringify(payload))`.
3. Compress using native `CompressionStream("deflate-raw")`.
4. Encode compressed bytes to URL-safe Base64:
   ```javascript
   const base64 = btoa(String.fromCharCode(...compressedBytes))
     .replace(/\+/g, "-")
     .replace(/\//g, "_")
     .replace(/=+$/, "");
   const shareUrl = `${location.origin}${location.pathname}#q=z${base64}`;
   ```

### 4.2. Import from URL Hash (`Zg(hash)`)
1. Match `#q=([zp])([A-Za-z0-9_-]+)`.
2. If algorithm is `'z'`, pipe through `DecompressionStream("deflate-raw")`.
3. If algorithm is `'p'`, parse base64 directly.
4. Validate bank shape: verify title (`name`), question array (`qs`), required fields (`s`, `k`, `a`).
5. Prepend imported bank to `banks` state and set active.
