const fs = require('fs');

let css = fs.readFileSync(require('path').join(__dirname, '../public/css/styles.css'), 'utf8');

// The block to replace is:
// /* Línea de color progresivo superior */
// nav::before {
//   content: '';
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   height: 2px;
//   background: linear-gradient(90deg, #FFD600, #FF9900, #00C853, #008296);
//   border-radius: 999px 999px 0 0;
//   z-index: 10;
// }

const newNavBefore = `/* Línea de color progresivo superior */
nav::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #FFD600, #FF9900, #00C853, #008296);
  border-radius: 999px;
  z-index: 10;
  width: calc(var(--scroll, 0) * 100%);
  transition: width 0.1s ease-out;
}`;

// Make sure to find the block properly
const regex = /\/\* Línea de color progresivo superior \*\/[\s\S]*?z-index: 10;\n\}/;
if (regex.test(css)) {
  css = css.replace(regex, newNavBefore);
  fs.writeFileSync(require('path').join(__dirname, '../public/css/styles.css'), css);
}


let js = fs.readFileSync(require('path').join(__dirname, '../public/js/main.js'), 'utf8');

const scrollJs = `
// ====== SCROLL PROGRESS BAR ======
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) : 0;
  document.documentElement.style.setProperty('--scroll', scrollPercent);
});
// Trigger once on load
window.dispatchEvent(new Event('scroll'));
`;

if (!js.includes('SCROLL PROGRESS BAR')) {
  js += '\n' + scrollJs;
  fs.writeFileSync(require('path').join(__dirname, '../public/js/main.js'), js);
}

console.log('Scroll progress added');
