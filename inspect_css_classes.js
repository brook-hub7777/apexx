import fs from 'fs';
const css = fs.readFileSync('analysis/assets/index-sn7STuAq.css', 'utf8');

function showMatches(name) {
  console.log(`\n=== MATCHES FOR ${name} ===`);
  let idx = 0;
  while ((idx = css.indexOf(name, idx)) !== -1) {
    console.log(css.slice(Math.max(0, idx - 20), Math.min(css.length, idx + 120)));
    idx += name.length;
  }
}

showMatches('.wb-reader');
showMatches('.wb-result');
showMatches('.wb-editor');
showMatches('.wb-flashcard');
showMatches('.wb-chat-prompt');
showMatches('.wb-bank-row');
