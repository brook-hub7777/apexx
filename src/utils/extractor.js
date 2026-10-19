export function extractFacts(sources) {
  const facts = [];
  for (const source of sources) {
    if (!source || !source.text) continue;
    source.text.split(/\n+/).forEach((line, lineIndex) => {
      const cleaned = line.replace(/^\s*(?:#{1,6}\s+|[-*•]\s+|\d+[.)、]\s*)/, "").trim();
      if (cleaned.length < 8 || cleaned.length > 1500) return;

      // Pattern 1: Colon definition
      let match = cleaned.match(/^([^:：]{2,48})[:：]\s*(.{5,})$/);
      
      // Pattern 2: Chinese definition
      if (!match) match = cleaned.match(/^(.{2,24}?)(?:是指|指的是|是)(.{5,})[。.]?$/);
      
      // Pattern 3: English definition
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
        // Pattern 4: Cloze fallback
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

  const seen = new Set();
  return facts.filter(f => {
    const key = f.term.toLowerCase() + f.definition;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function generateQuestions(sources, maxQuestions = 8, style = "mixed", isEnglish = true) {
  if (!sources || !sources.length) throw new Error("select");
  const facts = extractFacts(sources);
  if (!facts.length) throw new Error("facts");

  const limit = Math.max(1, Math.min(30, Number(maxQuestions) || 8));
  return facts.slice(0, limit).map((fact, index) => {
    const distractors = [...new Set(facts.filter(f => f.term !== fact.term).map(f => f.term))].slice(0, 3);
    const baseMeta = { c: fact.source.title, e: fact.quote, source: fact.source };

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

    return {
      ...baseMeta,
      k: "blank",
      s: fact.cloze ? fact.definition.replace(fact.term, "______") : (isEnglish ? "______ — " : "______：") + fact.definition,
      a: [fact.term]
    };
  });
}

export function searchSources(sources, query) {
  const q = (query || "").trim().toLowerCase();
  if (!q) return [];
  return sources.flatMap(src => {
    return (src.text || "").split("\n").map((line, idx) => ({
      id: src.id,
      title: src.title,
      text: line,
      index: idx + 1
    })).filter(item => item.text.toLowerCase().includes(q));
  }).slice(0, 20);
}

export function checkAnswer(question, userAnswer) {
  if (!question || userAnswer == null) return false;
  if (question.k === "single" || question.k === "judge") {
    return Array.isArray(question.a) && question.a[0] === userAnswer;
  }
  if (question.k === "multi") {
    if (!Array.isArray(userAnswer)) return false;
    const expected = [...(question.a || [])].sort();
    const actual = [...userAnswer].sort();
    return expected.length === actual.length && expected.every((val, i) => val === actual[i]);
  }
  if (question.k === "blank") {
    const expected = String(question.a?.[0] || "").trim().toLowerCase();
    const actual = String(userAnswer || "").trim().toLowerCase();
    return expected === actual;
  }
  return false;
}

export function gradeSession(questions, answers, spentSeconds = 0) {
  const graded = questions.map((q, idx) => checkAnswer(q, answers[idx]));
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

export function shuffleArray(arr, rng = Math.random) {
  const res = arr.slice();
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
}
