const fs = require('fs');

let html = fs.readFileSync(require('path').join(__dirname, '../public/index.html'), 'utf8');

// Add "Filosofía" to the nav menu before "Servicios"
html = html.replace('<li><a href="#servicios">Servicios</a></li>', '<li><a href="#filosofia">Filosofía</a></li>\n        <li><a href="#servicios">Servicios</a></li>');

// Center the title of Filosofia section
html = html.replace('<div class="section-header reveal">', '<div class="section-header reveal" style="text-align: center;">');

fs.writeFileSync(require('path').join(__dirname, '../public/index.html'), html);
console.log('Fixed');
