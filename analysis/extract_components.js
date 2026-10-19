const fs = require('fs');

const js = fs.readFileSync('analysis/assets/index-CxKV-nwI.js', 'utf8');

// Find all React component functions (usually PascalCase functions or arrow functions)
const componentMatches = js.match(/(?:function\s+([A-Z][A-Za-z0-9_]*)|const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>)/g) || [];
console.log('--- POTENTIAL REACT COMPONENTS ---');
const components = new Set();
componentMatches.forEach(m => {
  const name = m.replace(/^(?:function\s+|const\s+)/, '').split(/[\s=]/)[0];
  if (name && name.length > 1) components.add(name);
});
console.log('Found components (' + components.size + '):', Array.from(components));

// Look for key sections, tabs, modals, buttons
console.log('--- UI STRINGS & LABELS ---');
const buttonLabels = js.match(/["']([A-Z][A-Za-z0-9\s·,!?&'-]{2,30})["']/g) || [];
const uniqueLabels = Array.from(new Set(buttonLabels.map(s => s.slice(1, -1)))).filter(s => 
  s.includes('Quiz') || s.includes('Flashcard') || s.includes('Practice') || s.includes('Exam') ||
  s.includes('Report') || s.includes('Notebook') || s.includes('Source') || s.includes('Studio') ||
  s.includes('Bank') || s.includes('Question') || s.includes('Analytics') || s.includes('Settings') ||
  s.includes('Share') || s.includes('Sound') || s.includes('Dark') || s.includes('Light') ||
  s.includes('Note') || s.includes('Search') || s.includes('Filter') || s.includes('Table')
);
console.log('Key UI labels:', uniqueLabels);
