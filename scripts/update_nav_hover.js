const fs = require('fs');
let css = fs.readFileSync(require('path').join(__dirname, '../public/css/styles.css'), 'utf8');

const navStyles = `
/* Efecto hover AWS para los enlaces */
.nav-links.aws-mono {
  position: relative;
  display: flex;
  gap: 15px; /* Reducimos un poco el gap para los paddings */
}
.nav-links.aws-mono a {
  position: relative;
  padding: 8px 16px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: 1;
}

/* El fondo brillante y texto */
.nav-links.aws-mono a:hover {
  color: var(--aws-orange);
  background: rgba(255, 153, 0, 0.1); /* Fondo naranja super suave */
  box-shadow: inset 0 0 0 1px rgba(255, 153, 0, 0.2), 0 0 15px rgba(255, 153, 0, 0.15); /* Borde luminoso y resplandor */
  transform: translateY(-1px);
}

/* La rayita luminosa debajo del texto que crece desde el centro */
.nav-links.aws-mono a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--aws-orange);
  box-shadow: 0 0 8px var(--aws-orange);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-radius: 2px;
  transform: translateX(-50%);
  opacity: 0;
}

.nav-links.aws-mono a:hover::after {
  width: 40%; /* Línea elegante que no ocupa todo el ancho */
  opacity: 1;
  bottom: -2px;
}
`;

// Replace old simple hover styles with the new advanced hover styles
css = css.replace('.nav-links.aws-mono a {\n  font-family: var(--font-mono);\n  font-size: 13px;\n  color: rgba(255, 255, 255, 0.7);\n  text-decoration: none;\n  font-weight: 500;\n  transition: color 0.2s;\n}\n.nav-links.aws-mono a:hover {\n  color: var(--aws-orange);\n}', navStyles);

// Just in case it wasn't replaced exactly:
if (!css.includes('transition: all 0.3s cubic-bezier')) {
  // Try another replace approach if exact string match failed
  const start = css.indexOf('.nav-links.aws-mono a {');
  const end = css.indexOf('.nav-cta {');
  if (start !== -1 && end !== -1) {
    const oldBlock = css.substring(start, end);
    css = css.replace(oldBlock, navStyles + '\n');
  }
}

fs.writeFileSync(require('path').join(__dirname, '../public/css/styles.css'), css);
console.log('Hover effect added');
