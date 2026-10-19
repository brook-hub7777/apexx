const fs = require('fs');
const html = fs.readFileSync('c:/Users/HP/Desktop/apex/analysis/evidence/landing_page_dom.html', 'utf8');

const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
console.log('Title:', titleMatch ? titleMatch[1] : 'No title');

const metaTags = html.match(/<meta[^>]*>/gi) || [];
console.log('Meta tags:', metaTags);

const linkTags = html.match(/<link[^>]*>/gi) || [];
console.log('Link tags:', linkTags);

const scriptTags = html.match(/<script[^>]*>[\s\S]*?<\/script>/gi) || [];
console.log('Script count:', scriptTags.length);
scriptTags.forEach((s, idx) => {
  const src = s.match(/src=["']([^"']*)["']/i);
  const type = s.match(/type=["']([^"']*)["']/i);
  if (src) console.log('Script', idx, 'type:', type ? type[1] : 'default', 'src:', src[1]);
  else console.log('Script', idx, 'inline length:', s.length);
});

const styleTags = html.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || [];
console.log('Style tags count:', styleTags.length);

// Root element classes and data attributes
const rootMatch = html.match(/<div[^>]*id=["']root["'][^>]*>/i) || html.match(/<body[^>]*>/i);
console.log('Root / Body match:', rootMatch ? rootMatch[0] : 'None');
