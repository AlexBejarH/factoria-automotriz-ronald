const fs = require('fs');

// 1. Update CSS to add the gradient line to the nav
let css = fs.readFileSync(require('path').join(__dirname, '../public/css/styles.css'), 'utf8');

const gradientCss = `
/* Línea de color progresivo superior */
nav::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #FFD600, #FF9900, #00C853, #008296);
  border-radius: 999px 999px 0 0;
  z-index: 10;
}
`;

if (!css.includes('Línea de color progresivo superior')) {
  css = css.replace('.nav-inner {', gradientCss + '\n.nav-inner {');
  fs.writeFileSync(require('path').join(__dirname, '../public/css/styles.css'), css);
}


// 2. Update JS to add the scramble/hacker text effect
let js = fs.readFileSync(require('path').join(__dirname, '../public/js/main.js'), 'utf8');

const hackerJs = `
// ====== EFECTO HACKER (SCRAMBLE TEXT) EN NAVEGACION ======
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

document.querySelectorAll(".nav-links.aws-mono a").forEach(link => {
  link.dataset.value = link.innerText;

  link.addEventListener("mouseover", event => {
    let iterations = 0;
    
    clearInterval(link.interval);
    
    link.interval = setInterval(() => {
      event.target.innerText = event.target.innerText.split("")
        .map((letter, index) => {
          if(index < iterations) {
            return event.target.dataset.value[index];
          }
          return letters[Math.floor(Math.random() * letters.length)];
        })
        .join("");
      
      if(iterations >= event.target.dataset.value.length){
        clearInterval(link.interval);
        event.target.innerText = event.target.dataset.value; // Asegurar que termine bien
      }
      
      iterations += 1 / 3; // Velocidad del efecto
    }, 30);
  });
});
`;

if (!js.includes('EFECTO HACKER')) {
  js += '\n\n' + hackerJs;
  fs.writeFileSync(require('path').join(__dirname, '../public/js/main.js'), js);
}

console.log('Hacker effect added');
