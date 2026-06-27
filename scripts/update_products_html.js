const fs = require('fs');

let html = fs.readFileSync(require('path').join(__dirname, '../public/index.html'), 'utf8');

const replacements = [
  { old: '<div class="producto-img">🛞</div>\\s*<div class="producto-body">\\s*<p class="producto-cat">Neumáticos</p>\\s*<h4>Michelin Primacy 4</h4>', new: '<div class="producto-img"><img src="assets/images/prod_michelin.png" alt="Michelin Primacy 4"></div>\\n        <div class="producto-body">\\n          <p class="producto-cat">Neumáticos</p>\\n          <h4>Michelin Primacy 4</h4>' },
  { old: '<div class="producto-img">🛢️</div>\\s*<div class="producto-body">\\s*<p class="producto-cat">Aceites</p>\\s*<h4>Castrol GTX 5W-30 4L</h4>', new: '<div class="producto-img"><img src="assets/images/prod_castrol.png" alt="Castrol GTX"></div>\\n        <div class="producto-body">\\n          <p class="producto-cat">Aceites</p>\\n          <h4>Castrol GTX 5W-30 4L</h4>' },
  { old: '<div class="producto-img">🔋</div>\\s*<div class="producto-body">\\s*<p class="producto-cat">Baterías</p>\\s*<h4>Bosch S5 12V 60Ah</h4>', new: '<div class="producto-img"><img src="assets/images/prod_bosch.png" alt="Bosch S5"></div>\\n        <div class="producto-body">\\n          <p class="producto-cat">Baterías</p>\\n          <h4>Bosch S5 12V 60Ah</h4>' },
  { old: '<div class="producto-img">🔴</div>\\s*<div class="producto-body">\\s*<p class="producto-cat">Frenos</p>\\s*<h4>Pastillas Brembo Sport</h4>', new: '<div class="producto-img"><img src="assets/images/prod_brembo.png" alt="Brembo Sport"></div>\\n        <div class="producto-body">\\n          <p class="producto-cat">Frenos</p>\\n          <h4>Pastillas Brembo Sport</h4>' },
  { old: '<div class="producto-img">🌡️</div>\\s*<div class="producto-body">\\s*<p class="producto-cat">Refrigerante</p>\\s*<h4>Coolant TOTAL Orgánico</h4>', new: '<div class="producto-img"><img src="assets/images/prod_coolant.png" alt="Coolant TOTAL"></div>\\n        <div class="producto-body">\\n          <p class="producto-cat">Refrigerante</p>\\n          <h4>Coolant TOTAL Orgánico</h4>' },
  { old: '<div class="producto-img">🔌</div>\\s*<div class="producto-body">\\s*<p class="producto-cat">Repuestos</p>\\s*<h4>Bujías NGK Iridium</h4>', new: '<div class="producto-img"><img src="assets/images/prod_bujias.png" alt="Bujías NGK"></div>\\n        <div class="producto-body">\\n          <p class="producto-cat">Repuestos</p>\\n          <h4>Bujías NGK Iridium</h4>' },
  { old: '<div class="producto-img">🛞</div>\\s*<div class="producto-body">\\s*<p class="producto-cat">Neumáticos</p>\\s*<h4>Bridgestone Ecopia EP300</h4>', new: '<div class="producto-img"><img src="assets/images/prod_bridgestone.png" alt="Bridgestone Ecopia"></div>\\n        <div class="producto-body">\\n          <p class="producto-cat">Neumáticos</p>\\n          <h4>Bridgestone Ecopia EP300</h4>' },
  { old: '<div class="producto-img">🛢️</div>\\s*<div class="producto-body">\\s*<p class="producto-cat">Aceites</p>\\s*<h4>Mobil 1 Sintético 0W-40</h4>', new: '<div class="producto-img"><img src="assets/images/prod_mobil1.png" alt="Mobil 1"></div>\\n        <div class="producto-body">\\n          <p class="producto-cat">Aceites</p>\\n          <h4>Mobil 1 Sintético 0W-40</h4>' }
];

replacements.forEach(r => {
  const regex = new RegExp(r.old, 'g');
  html = html.replace(regex, r.new.replace(/\\n/g, '\n'));
});

fs.writeFileSync(require('path').join(__dirname, '../public/index.html'), html);
