const fs = require('fs');
const css = `
/* ====== EFECTOS NEON HOVER ====== */
:root {
  --mouse-x: 50vw;
  --mouse-y: 50vh;
}

.mouse-glow-blob {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  pointer-events: none;
  z-index: -1;
  background: radial-gradient(
    600px circle at var(--mouse-x) var(--mouse-y),
    rgba(0, 153, 255, 0.08),
    transparent 40%
  );
}

/* Tarjetas Glow */
.oferta-card, .servicio-card, .cat-item, .glass-panel {
  position: relative;
  z-index: 1;
}

.oferta-card::before, .servicio-card::before, .cat-item::before, .glass-panel::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: inherit;
  padding: 2px;
  background: radial-gradient(
    800px circle at var(--mouse-x, 0) var(--mouse-y, 0),
    rgba(0, 153, 255, 0.5),
    transparent 40%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.oferta-card:hover::before, .servicio-card:hover::before, .cat-item:hover::before, .glass-panel:hover::before {
  opacity: 1;
}

/* Animación Continua Carrusel */
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-50% - 10px)); }
}

.ofertas-track.continuous-marquee {
  animation: marquee 30s linear infinite;
  width: max-content;
}

.ofertas-track.continuous-marquee:hover {
  animation-play-state: paused;
}

/* Ocultar navegación vieja de ofertas */
#ofertasNav { display: none !important; }
`;
fs.appendFileSync(require('path').join(__dirname, '../public/css/styles.css'), css);
console.log('CSS Appended successfully');
