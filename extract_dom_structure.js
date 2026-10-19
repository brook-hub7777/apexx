import fs from 'fs';
const html = fs.readFileSync('analysis/evidence/landing_page_dom.html', 'utf8');

const headerMatch = html.match(/<header class="wb-top">[\s\S]*?<\/header>/);
console.log('--- HEADER ---');
console.log(headerMatch ? headerMatch[0] : 'None');

const sourcesMatch = html.match(/<aside class="wb-pane wb-sources\s*">[\s\S]*?<\/aside>/);
console.log('\n--- SOURCES PANE ---');
console.log(sourcesMatch ? sourcesMatch[0] : 'None');

const studioMatch = html.match(/<aside class="wb-pane wb-studio\s*">[\s\S]*?<\/aside>/);
console.log('\n--- STUDIO PANE ---');
console.log(studioMatch ? studioMatch[0] : 'None');
