const fs = require('fs');

const js = fs.readFileSync('analysis/assets/index-CxKV-nwI.js', 'utf8');

function extractBlock(label, needle) {
  console.log(`\n=================== ${label} ===================`);
  const idx = js.indexOf(needle);
  if (idx !== -1) {
    console.log(js.slice(idx, idx + 1500));
  } else {
    console.log(`Needle ${needle} not found`);
  }
}

extractBlock('Mistake Notebook', 'B==="wrong"');
extractBlock('Study Notes', 'B==="note"');
extractBlock('Search Sources', 'B==="search"');
extractBlock('Results / Analytics', 'B==="result"');
