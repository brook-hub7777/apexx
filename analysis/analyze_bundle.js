const fs = require('fs');

const js = fs.readFileSync('analysis/assets/index-CxKV-nwI.js', 'utf8');
const css = fs.readFileSync('analysis/assets/index-sn7STuAq.css', 'utf8');

console.log('--- STORAGE KEYS ---');
const storageRegex = /(?:localStorage|sessionStorage)\.(?:getItem|setItem|removeItem)\((['"`])([^'"`]+)\1/g;
let match;
const storageKeys = new Set();
while ((match = storageRegex.exec(js)) !== null) {
  storageKeys.add(match[2]);
}
console.log('Storage keys:', Array.from(storageKeys));

console.log('--- THEMES & SKINS IN CSS ---');
const dataThemeRegex = /\[data-theme=["']?([^\]"']+)["']?\]/g;
const dataSkinsRegex = /\[data-skin=["']?([^\]"']+)["']?\]/g;
const dataModeRegex = /\[data-mode=["']?([^\]"']+)["']?\]/g;
const cssThemes = new Set();
while ((match = dataThemeRegex.exec(css)) !== null) cssThemes.add('theme: ' + match[1]);
while ((match = dataSkinsRegex.exec(css)) !== null) cssThemes.add('skin: ' + match[1]);
while ((match = dataModeRegex.exec(css)) !== null) cssThemes.add('mode: ' + match[1]);
console.log('CSS themes/skins/modes:', Array.from(cssThemes));

console.log('--- DATA- ATTRIBUTES IN HTML / JS ---');
const dataAttrRegex = /data-[a-z0-9-]+/g;
const dataAttrs = new Set();
while ((match = dataAttrRegex.exec(js)) !== null) dataAttrs.add(match[0]);
while ((match = dataAttrRegex.exec(css)) !== null) dataAttrs.add(match[0]);
console.log('data-* attributes:', Array.from(dataAttrs));

console.log('--- DIALOGS / MODALS ---');
const dialogMatches = js.match(/(?:modal|dialog|drawer|sheet|popup|overlay)[a-zA-Z0-9_-]*/gi) || [];
const uniqueDialogTerms = Array.from(new Set(dialogMatches.map(s => s.toLowerCase()))).filter(s => s.length > 5);
console.log('Dialog-related terms (sample):', uniqueDialogTerms.slice(0, 30));

console.log('--- SVG ICONS ---');
const svgRegex = /<svg[^>]*>[\s\S]*?<\/svg>/gi;
const svgs = js.match(svgRegex) || [];
console.log('Total inline SVGs in JS bundle:', svgs.length);
