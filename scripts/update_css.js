const fs = require('fs');
let css = fs.readFileSync(require('path').join(__dirname, '../public/css/styles.css'), 'utf8');

// Modificar .brand-marquee para centrarlo (quitar padding grande, margin-top)
css = css.replace('.brand-marquee {\n  margin-top: 68px;\n  background: var(--charcoal);\n  padding: 14px 0;', 
'.brand-marquee {\n  margin-top: 56px;\n  background: var(--black);\n  padding: 30px 0;\n  border-top: 1px solid rgba(255,255,255,0.05);');

// Para el segundo marquee no necesitamos margin-top 56px, así que quitamos margin-top globalmente y lo ponemos solo al primero o ajustamos
css = css.replace('.brand-marquee {\n  margin-top: 56px;', '.brand-marquee {\n');
// We will add padding top to the body or something, but actually the first .brand-marquee needs margin-top:56px because of the fixed nav. We can use a specific selector.
// Let's just append the new CSS rules.

const newCss = `
/* ======= NUEVAS REGLAS ======= */
nav + .brand-marquee {
  margin-top: 56px;
}
.brand-logo {
  height: 32px;
  object-fit: contain;
  filter: grayscale(1) invert(1) opacity(0.7);
  transition: opacity 0.3s, filter 0.3s;
}
.brand-logo:hover {
  filter: grayscale(0) invert(0) opacity(1);
  background: white; /* In case logo needs contrast */
  border-radius: 4px;
}
.marquee-track span { display: none; } /* Ocultar los textos viejos por si acaso */

/* HERO CONTINUOUS MARQUEE */
.continuous-hero {
  animation: marquee-hero 40s linear infinite;
  width: max-content;
}
.continuous-hero:hover {
  animation-play-state: paused;
}
@keyframes marquee-hero {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-50%)); }
}
.slide {
  width: 100vw;
  min-width: 100vw;
}
`;

// Remove #stats completely
const statsStart = css.indexOf('/* STATS */');
if (statsStart !== -1) {
  const statsEnd = css.indexOf('/* SERVICIOS */', statsStart);
  if (statsEnd !== -1) {
    css = css.substring(0, statsStart) + css.substring(statsEnd);
  }
}

fs.writeFileSync(require('path').join(__dirname, '../public/css/styles.css'), css + newCss);
console.log('styles.css updated!');
