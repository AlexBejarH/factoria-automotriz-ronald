const fs = require('fs');

// --- 1. MODIFICAR FACTORIA.HTML ---
let html = fs.readFileSync(require('path').join(__dirname, '../public/index.html'), 'utf8');

// Añadir JetBrains Mono
if (!html.includes('JetBrains+Mono')) {
  html = html.replace('family=Inter:wght@300;400;500;600;700;800;900&display=swap', 'family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
}

// Añadir el bloque de fondo AWS justo después de <body>
const bgHtml = `
<!-- AWS DYNAMIC BACKGROUND -->
<div class="aws-bg-container" aria-hidden="true">
  <div class="aws-glow-drift"></div>
  <div class="aws-particles">
    <div class="particle" style="left:7%;top:18%;width:10px;height:10px;background-color:#FF9900;"></div>
    <div class="particle" style="left:13%;top:28%;width:6px;height:6px;background-color:#FF9900;"></div>
    <div class="particle" style="left:5%;top:38%;width:8px;height:8px;background-color:#00C853;"></div>
    <div class="particle" style="left:18%;top:14%;width:5px;height:5px;background-color:#008296;"></div>
    <div class="particle" style="left:85%;top:16%;width:9px;height:9px;background-color:#FF9900;"></div>
    <div class="particle" style="left:91%;top:26%;width:6px;height:6px;background-color:#00C853;"></div>
    <div class="particle" style="left:80%;top:34%;width:7px;height:7px;background-color:#008296;"></div>
    <div class="particle" style="left:93%;top:42%;width:4px;height:4px;background-color:#FF9900;"></div>
    <div class="particle" style="left:3%;top:55%;width:5px;height:5px;background-color:#008296;"></div>
    <div class="particle" style="left:10%;top:62%;width:7px;height:7px;background-color:#FF9900;"></div>
    <div class="particle" style="left:90%;top:58%;width:6px;height:6px;background-color:#00C853;"></div>
    <div class="particle" style="left:96%;top:68%;width:4px;height:4px;background-color:#FF9900;"></div>
  </div>
</div>
`;
if (!html.includes('aws-bg-container')) {
  html = html.replace('<body>\n', '<body>\n' + bgHtml);
}

// Modificar NAV para añadir clase de los links mono
html = html.replace(/<ul class="nav-links">/g, '<ul class="nav-links aws-mono">');

fs.writeFileSync(require('path').join(__dirname, '../public/index.html'), html);


// --- 2. MODIFICAR STYLES.CSS ---
let css = fs.readFileSync(require('path').join(__dirname, '../public/css/styles.css'), 'utf8');

// Colors & Fonts
css = css.replace(/--red:\s*#[a-f0-9A-F]+;/g, '--aws-orange: #FF9900;');
css = css.replace(/--red-dark:\s*#[a-f0-9A-F]+;/g, '--aws-orange-dark: #e68a00;');
// Some places might use var(--red) directly
css = css.replace(/var\(--red\)/g, 'var(--aws-orange)');
css = css.replace(/var\(--red-dark\)/g, 'var(--aws-orange-dark)');

// Add Mono font var
if (!css.includes('--font-mono')) {
  css = css.replace('--font-display: \'Inter\', sans-serif;', '--font-display: \'Inter\', sans-serif;\n  --font-mono: \'JetBrains Mono\', monospace;');
}

// Replace completely NAV styling
const navStart = css.indexOf('/* NAV */');
const navEnd = css.indexOf('/* BRAND MARQUEE */');
const oldNav = css.substring(navStart, navEnd);

const newNavCss = `/* NAV AWS STYLE */
nav {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: 95%;
  max-width: 1280px;
  z-index: 1000;
  border-radius: 999px;
  background: rgba(20, 20, 20, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  transition: background 0.3s, border-color 0.3s;
}
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
}
.logo {
  font-size: 18px;
  font-weight: 800;
  color: var(--white);
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.logo-icon {
  color: var(--aws-orange);
  font-size: 20px;
}
.nav-links {
  display: flex;
  gap: 28px;
  list-style: none;
}
.nav-links.aws-mono a {
  font-family: var(--font-mono);
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}
.nav-links.aws-mono a:hover {
  color: var(--aws-orange);
}
.nav-cta {
  background: var(--aws-orange);
  color: #111;
  border: none;
  padding: 8px 24px;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
}
.nav-cta:hover {
  box-shadow: 0 0 20px rgba(255, 153, 0, 0.4);
  transform: translateY(-1px);
}
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
}
.hamburger span {
  width: 24px;
  height: 2px;
  background: var(--white);
  border-radius: 2px;
}
@media (max-width: 900px) {
  .nav-links { display: none; }
  .hamburger { display: flex; }
}

`;

css = css.replace(oldNav, newNavCss);

// Remove the `nav + .brand-marquee` margin we added previously, because the nav is now floating. We might need padding on the hero.
css = css.replace('nav + .brand-marquee {\n  margin-top: 56px;\n}', '/* margin-top removed for floating nav */');

// Let's add top padding to the body or hero so content doesn't hide under nav.
// Since the first thing is the .brand-marquee, we give it a solid margin-top.
css = css.replace('/* ======= NUEVAS REGLAS ======= */', '/* ======= NUEVAS REGLAS ======= */\n.brand-marquee:first-of-type { margin-top: 100px; position:relative; z-index:10; }');


// Append Background CSS
const bgStyles = `
/* AWS BACKGROUND EFFECTS */
.aws-bg-container {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}
.aws-glow-drift {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 40% 40% at 80% 20%, rgba(255, 153, 0, 0.08), transparent),
              radial-gradient(ellipse 30% 30% at 50% 50%, rgba(255, 214, 0, 0.04), transparent);
  animation: drift 20s ease-in-out infinite;
}
@keyframes drift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.05); }
  66% { transform: translate(-20px, 15px) scale(0.95); }
}
.aws-particles {
  position: absolute;
  inset-x: 0;
  bottom: 0;
  top: 80px;
  z-index: 10;
  overflow: hidden;
}
.particle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.55;
  box-shadow: 0 0 10px currentColor;
}
`;

css = css + '\n' + bgStyles;

fs.writeFileSync(require('path').join(__dirname, '../public/css/styles.css'), css);

console.log('AWS theme applied');
