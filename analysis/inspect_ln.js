const fs = require('fs');

const js = fs.readFileSync('analysis/assets/index-CxKV-nwI.js', 'utf8');

// Find where ln is defined
const lnIdx = js.indexOf('onClick:ln');
if (lnIdx !== -1) {
  // Let's look back 2000 chars for ln = or function ln
  const snippet = js.slice(Math.max(0, lnIdx - 3000), lnIdx + 100);
  console.log('Snippet before onClick:ln:');
  // Find ln =
  const lnPos = snippet.lastIndexOf('ln=');
  if (lnPos !== -1) {
    console.log(snippet.slice(lnPos, lnPos + 1500));
  } else {
    console.log('ln= not found directly in snippet, printing tail:');
    console.log(snippet.slice(-1000));
  }
}
