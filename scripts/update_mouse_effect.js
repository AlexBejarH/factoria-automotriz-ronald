const fs = require('fs');

let js = fs.readFileSync(require('path').join(__dirname, '../public/js/main.js'), 'utf8');

const startIdx = js.indexOf('// ====== EFECTO DE RATON (NEÓN Y ESTRELLAS) ======');
const endIdx = js.indexOf('// ====== CATÁLOGO MODAL ======');

if (startIdx !== -1 && endIdx !== -1) {
  const oldBlock = js.substring(startIdx, endIdx);
  
  const newBlock = `// ====== EFECTO DE RATON (BURBUJAS) ======
document.addEventListener('mousemove', function(e) {
  // Variables CSS para el efecto Neon
  document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
  document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');

  // Burbujitas que siguen al cursor
  if(Math.random() > 0.8) return;
  
  const bubble = document.createElement('div');
  const size = Math.random() * 15 + 5;
  bubble.style.position = 'fixed';
  bubble.style.left = e.clientX + 'px';
  bubble.style.top = e.clientY + 'px';
  bubble.style.width = size + 'px';
  bubble.style.height = size + 'px';
  bubble.style.borderRadius = '50%';
  // Estilo Glass/Neon para la burbuja
  bubble.style.border = '1px solid rgba(255, 153, 0, 0.6)';
  bubble.style.boxShadow = '0 0 8px rgba(255, 153, 0, 0.4), inset 0 0 5px rgba(255, 153, 0, 0.2)';
  bubble.style.backgroundColor = 'rgba(255, 153, 0, 0.1)';
  bubble.style.pointerEvents = 'none';
  bubble.style.zIndex = '9999';
  bubble.style.transform = 'translate(-50%, -50%)';
  bubble.style.transition = 'all 0.8s ease-out';
  
  document.body.appendChild(bubble);
  
  setTimeout(() => {
    bubble.style.opacity = '0';
    // Se elevan como burbujas y crecen
    bubble.style.transform = \`translate(-50%, \${-50 - Math.random() * 50}px) scale(1.5)\`;
  }, 10);
  
  setTimeout(() => {
    bubble.remove();
  }, 800);
});

`;

  js = js.replace(oldBlock, newBlock);
  fs.writeFileSync(require('path').join(__dirname, '../public/js/main.js'), js);
}

console.log('Bubbles added');
