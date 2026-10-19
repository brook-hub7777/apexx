const fs = require('fs');

const js = fs.readFileSync('analysis/assets/index-CxKV-nwI.js', 'utf8');

// Search around Bt("...")
const btCalls = Array.from(new Set(js.match(/Bt\(['"][a-zA-Z0-9_-]+['"]\)/g) || []));
console.log('Bt calls with string literal:', btCalls);

// Find where Bt is defined
const matches = js.match(/[a-zA-Z0-9_]+,\s*Bt\]\s*=\s*[a-zA-Z0-9_.]+\([^)]*\)/g) || [];
console.log('Bt state declaration matches:', matches);

// Let's find what main view states exist
// Let's check the render logic in main:
// e.g. switch(mode) or mode === "..." ? ... : ...
const modeChecks = Array.from(new Set(js.match(/===\s*["'](chat|quiz|practice|exam|flashcards|result|table|notes|source|mistake)["']/g) || []));
console.log('Mode check patterns:', modeChecks);
