const fs = require('fs');

let html = fs.readFileSync(require('path').join(__dirname, '../public/index.html'), 'utf8');

const replacements = [
  { old: '<span class="service-icon">🔧</span>', new: '<div class="service-img-wrapper"><img src="assets/images/serv_mecanica.png" alt="Mecánica general" class="service-img"></div>' },
  { old: '<span class="service-icon">🛞</span>', new: '<div class="service-img-wrapper"><img src="assets/images/serv_neumaticos.png" alt="Neumáticos" class="service-img"></div>' },
  { old: '<span class="service-icon">⚡</span>', new: '<div class="service-img-wrapper"><img src="assets/images/serv_electricidad.png" alt="Electricidad" class="service-img"></div>' },
  { old: '<span class="service-icon">🛑</span>', new: '<div class="service-img-wrapper"><img src="assets/images/serv_frenos.png" alt="Sistema de frenos" class="service-img"></div>' },
  { old: '<span class="service-icon">❄️</span>', new: '<div class="service-img-wrapper"><img src="assets/images/serv_aire.png" alt="Aire acondicionado" class="service-img"></div>' },
  { old: '<span class="service-icon">💧</span>', new: '<div class="service-img-wrapper"><img src="assets/images/serv_aceite.png" alt="Cambio de aceite" class="service-img"></div>' },
  { old: '<span class="service-icon">🔬</span>', new: '<div class="service-img-wrapper"><img src="assets/images/serv_diagnostico.png" alt="Diagnóstico computarizado" class="service-img"></div>' },
  { old: '<span class="service-icon">✨</span>', new: '<div class="service-img-wrapper"><img src="assets/images/serv_lavado.png" alt="Lavado y detailing" class="service-img"></div>' }
];

replacements.forEach(r => {
  html = html.replace(r.old, r.new);
});

fs.writeFileSync(require('path').join(__dirname, '../public/index.html'), html);
