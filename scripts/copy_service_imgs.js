const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\Usuario\\.gemini\\antigravity-ide\\brain\\bcc0a894-3a1a-4df0-bf4b-c4ff3f5ec70a';
const targetDir = 'c:\\Users\\Usuario\\mi-nuevo-saas\\assets\\images';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(brainDir);
const mappings = {
  'img_mecanica': 'serv_mecanica.png',
  'img_neumaticos': 'serv_neumaticos.png',
  'img_electricidad': 'serv_electricidad.png',
  'img_frenos': 'serv_frenos.png',
  'img_aire': 'serv_aire.png',
  'img_aceite': 'serv_aceite.png',
  'img_diagnostico': 'serv_diagnostico.png',
  'img_lavado': 'serv_lavado.png',
};

files.forEach(file => {
  for (const [prefix, targetName] of Object.entries(mappings)) {
    if (file.startsWith(prefix) && file.endsWith('.png')) {
      fs.copyFileSync(path.join(brainDir, file), path.join(targetDir, targetName));
      console.log(`Copied ${file} to ${targetName}`);
    }
  }
});
