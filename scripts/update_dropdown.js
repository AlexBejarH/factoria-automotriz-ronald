const fs = require('fs');

// 1. Modificar HTML
let html = fs.readFileSync(require('path').join(__dirname, '../public/index.html'), 'utf8');

// The current HTML has:
// <li><a href="#nosotros">Nosotros</a></li>
// <li><a href="#filosofia">Filosofía</a></li>

const dropdownHTML = `
        <li class="dropdown">
          <a href="#nosotros">Nosotros <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 4px; display: inline-block; vertical-align: middle;"><polyline points="6 9 12 15 18 9"></polyline></svg></a>
          <ul class="dropdown-menu">
            <li><a href="#filosofia">Filosofía</a></li>
          </ul>
        </li>`;

// Remove original and insert dropdown
html = html.replace('<li><a href="#nosotros">Nosotros</a></li>', dropdownHTML);
html = html.replace('<li><a href="#filosofia">Filosofía</a></li>', ''); // Also might have spaces

// Clean up any double spaces left
html = html.replace(/\s*<li><a href="#filosofia">Filosofía<\/a><\/li>/, '');

fs.writeFileSync(require('path').join(__dirname, '../public/index.html'), html);


// 2. Modificar CSS
let css = fs.readFileSync(require('path').join(__dirname, '../public/css/styles.css'), 'utf8');

const dropdownCSS = `
/* DROPDOWN MENU */
.dropdown {
  position: relative;
}
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: rgba(15, 15, 15, 0.9);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px 0;
  min-width: 150px;
  list-style: none;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 15px 35px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
}

.dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.dropdown-menu li {
  margin: 0;
  padding: 0;
}

.dropdown-menu a {
  padding: 10px 20px !important;
  display: block;
  font-size: 13px;
  white-space: nowrap;
}

.dropdown-menu a::after {
  display: none; /* Quitamos la linea de abajo para el submenu */
}

/* Ajuste sutil para el icono del flecha */
.dropdown > a svg {
  transition: transform 0.3s;
}
.dropdown:hover > a svg {
  transform: rotate(180deg);
}
`;

if (!css.includes('DROPDOWN MENU')) {
  css += '\n' + dropdownCSS;
  fs.writeFileSync(require('path').join(__dirname, '../public/css/styles.css'), css);
}

console.log('Dropdown added');
