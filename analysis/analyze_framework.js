const fs = require('fs');

const js = fs.readFileSync('analysis/assets/index-CxKV-nwI.js', 'utf8');

// Check React or other frameworks
console.log('--- FRAMEWORK DETECTION ---');
if (js.includes('react') || js.includes('useState') || js.includes('useEffect') || js.includes('jsx')) {
  console.log('React detected!');
  const reactMatches = js.match(/useState|useEffect|useMemo|useCallback|useRef|createContext|useReducer/g) || [];
  console.log('Hook usages:', reactMatches.length, 'occurrences');
}

// Check audio
console.log('--- AUDIO & SOUND ---');
const audioMatches = js.match(/(?:AudioContext|webkitAudioContext|new Audio|\.play\(|sound|synth|oscillator|beep)/gi) || [];
console.log('Audio references:', Array.from(new Set(audioMatches)));

// Check sample data / embedded sources
console.log('--- EMBEDDED SAMPLE SOURCES & QUESTION BANKS ---');
const sampleMatches = js.match(/(?:Sorting algorithms|Essential data structures|Search and traversal|Data Structures · Foundations|Workplace Safety · General)/g) || [];
console.log('Sample source matches:', Array.from(new Set(sampleMatches)));

// Check sound synthesis code
const synthCode = js.match(/function\s+[a-zA-Z0-9_]*sound[a-zA-Z0-9_]*\s*\([^)]*\)\s*{[^}]+}/gi) || [];
console.log('Sound functions:', synthCode);
