const fs = require('fs');

// 1. Update factoria.html
let html = fs.readFileSync(require('path').join(__dirname, '../public/index.html'), 'utf8');

// Use regex to replace onerror attribute with a clean text fallback
html = html.replace(/onerror="[^"]+"/g, 'onerror="this.outerHTML=\'<span class=\\\'brand-logo-text\\\'>\'+this.alt+\'</span>\'"');

// Add 'reverse' class to the bottom marquee-track
const bottomStart = html.indexOf('<!-- BRAND MARQUEE BOTTOM -->');
if (bottomStart !== -1) {
  const bottomMarqueeStart = html.indexOf('<div class="marquee-track">', bottomStart);
  if (bottomMarqueeStart !== -1) {
    html = html.substring(0, bottomMarqueeStart) + '<div class="marquee-track reverse">' + html.substring(bottomMarqueeStart + '<div class="marquee-track">'.length);
  }
}

fs.writeFileSync(require('path').join(__dirname, '../public/index.html'), html);

// 2. Update styles.css
let css = fs.readFileSync(require('path').join(__dirname, '../public/css/styles.css'), 'utf8');

// Add .brand-logo-text and .reverse styles
const newCss = `
.marquee-track.reverse {
  animation-direction: reverse;
}
.brand-logo-text {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 800;
  color: var(--white);
  text-transform: uppercase;
  letter-spacing: 2px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  height: 36px;
  opacity: 0.5;
  transition: opacity 0.3s;
}
.brand-logo-text:hover {
  opacity: 1;
}
`;

fs.writeFileSync(require('path').join(__dirname, '../public/css/styles.css'), css + newCss);

console.log('Fixed marquees');
