const fs = require('fs');

const js = fs.readFileSync('analysis/assets/index-CxKV-nwI.js', 'utf8');

// 1. Extract full Dm
const dmIdx = js.indexOf('Dm=[');
if (dmIdx !== -1) {
  let depth = 0;
  let end = dmIdx + 3;
  for (let i = dmIdx + 3; i < js.length; i++) {
    if (js[i] === '[') depth++;
    else if (js[i] === ']') {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  const dmCode = js.slice(dmIdx, end);
  fs.writeFileSync('analysis/evidence/sample_banks.json', dmCode.replace(/^Dm=/, ''), 'utf8');
  console.log('Saved sample_banks.json, length:', dmCode.length);
}

// 2. Extract Question Generation Algorithm (ln function)
const lnIdx = js.indexOf('Generate question drafts');
if (lnIdx !== -1) {
  // Find where ln is defined: const ln = ... or function ln
  const fnMatch = js.match(/(?:const|function)\s+ln\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/);
  console.log('ln definition pattern:', fnMatch ? fnMatch[0] : 'not arrow');
}

// Search for the generation logic
const genLogicMatches = js.match(/function\s+[a-zA-Z0-9_]+\s*\([^)]*\)\s*{(?:(?!function)[^}]*(?:split|colon|regex|extract)[^}]*)}/gi) || [];
console.log('Potential extraction functions:', genLogicMatches.length);

// 3. Find all modal states V === "..."
const vModalStates = Array.from(new Set(js.match(/V===["']([a-zA-Z0-9_-]+)["']/g) || []));
console.log('Modal states V ===:', vModalStates);

// 4. Find all Bt("...") modes
const btModes = Array.from(new Set(js.match(/Bt\(["']([a-zA-Z0-9_-]+)["']\)/g) || []));
console.log('Bt modes:', btModes);
