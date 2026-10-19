const fs = require('fs');

const js = fs.readFileSync('analysis/assets/index-CxKV-nwI.js', 'utf8');

// 1. Extract Sample Question Banks
console.log('=== 1. SEARCHING SAMPLE QUESTION BANKS ===');
// Search for "Data Structures · Foundations" and extract surrounding object
const dsIdx = js.indexOf('Data Structures · Foundations');
if (dsIdx !== -1) {
  const start = Math.max(0, dsIdx - 200);
  const end = Math.min(js.length, dsIdx + 2000);
  console.log('Snippet around Data Structures Foundations:');
  console.log(js.slice(start, end));
}

// 2. Extract Sample Sources
console.log('\n=== 2. SEARCHING SAMPLE SOURCES ===');
const srcIdx = js.indexOf('01 Sorting algorithms.md');
if (srcIdx !== -1) {
  const start = Math.max(0, srcIdx - 200);
  const end = Math.min(js.length, srcIdx + 2000);
  console.log('Snippet around sample sources:');
  console.log(js.slice(start, end));
}

// 3. Extract Local Question Extraction Algorithm
console.log('\n=== 3. SEARCHING LOCAL QUESTION EXTRACTION ALGORITHM ===');
const genIdx = js.indexOf('Generate question drafts');
if (genIdx !== -1) {
  const start = Math.max(0, genIdx - 1500);
  const end = Math.min(js.length, genIdx + 500);
  console.log('Snippet around question generation:');
  console.log(js.slice(start, end));
}
