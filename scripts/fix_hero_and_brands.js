const fs = require('fs');

let html = fs.readFileSync(require('path').join(__dirname, '../public/index.html'), 'utf8');

// The onerror attributes currently look like this in HTML:
// onerror="this.outerHTML='<span class=\'brand-logo-text\'>'+this.alt+'</span>'"
// Which is broken JS inside an HTML attribute because of the escaping.
// Let's replace them with something safer that doesn't use single quotes inside single quotes:
// onerror="this.outerHTML='<span class=&quot;brand-logo-text&quot;>'+this.alt+'</span>'"

html = html.replace(/onerror="[^"]+"/g, 'onerror="this.outerHTML=\'<span class=&quot;brand-logo-text&quot;>\'+this.alt+\'</span>\'"');

fs.writeFileSync(require('path').join(__dirname, '../public/index.html'), html);

let css = fs.readFileSync(require('path').join(__dirname, '../public/css/styles.css'), 'utf8');

// 1. Remove the rule that hides spans:
// .marquee-track span { display: none; } /* Ocultar los textos viejos por si acaso */
css = css.replace('.marquee-track span { display: none; }', '/* Removed hidden spans */');

// 2. Add z-index to all .brand-marquee so they stay above the new absolute AWS bg:
if (!css.includes('.brand-marquee { position: relative; z-index: 10; }')) {
  css = css.replace('.brand-marquee {\n', '.brand-marquee {\n  position: relative;\n  z-index: 10;\n');
}

// 3. Ensure the hero has height so it doesn't collapse
if (!css.includes('.hero { height: 100vh; min-height: 600px; }')) {
  css += '\n.hero { height: 100vh; min-height: 600px; display: flex; flex-direction: column; justify-content: center; position: relative; overflow: hidden; }\n';
}

// And ensure .slides-wrapper is full height
css = css.replace('.slides-wrapper{display:flex;height:100%;transition:transform .8s cubic-bezier(.77,0,.18,1)}', '.slides-wrapper{display:flex;height:100%;width:100%;transition:transform .8s cubic-bezier(.77,0,.18,1)}');


fs.writeFileSync(require('path').join(__dirname, '../public/css/styles.css'), css);

console.log('Fixed');
