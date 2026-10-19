import fs from 'fs';
const js = fs.readFileSync('analysis/assets/index-CxKV-nwI.js', 'utf8');

const idx = js.indexOf('className:"wb-pane wb-main');
console.log('Found wb-pane wb-main at', idx);
if (idx !== -1) {
  console.log(js.slice(idx, idx + 3500));
}
