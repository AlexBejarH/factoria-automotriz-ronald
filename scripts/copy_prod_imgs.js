const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\Usuario\\.gemini\\antigravity-ide\\brain\\bcc0a894-3a1a-4df0-bf4b-c4ff3f5ec70a';
const targetDir = 'c:\\Users\\Usuario\\mi-nuevo-saas\\assets\\images';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(brainDir);
const mappings = {
  'prod_michelin': 'prod_michelin.png',
  'prod_castrol': 'prod_castrol.png',
  'prod_bosch': 'prod_bosch.png',
  'prod_brembo': 'prod_brembo.png',
  'prod_coolant': 'prod_coolant.png',
  'prod_bujias': 'prod_bujias.png',
  'prod_bridgestone': 'prod_bridgestone.png',
  'prod_mobil1': 'prod_mobil1.png',
};

files.forEach(file => {
  for (const [prefix, targetName] of Object.entries(mappings)) {
    if (file.startsWith(prefix) && file.endsWith('.png')) {
      fs.copyFileSync(path.join(brainDir, file), path.join(targetDir, targetName));
      console.log(`Copied ${file} to ${targetName}`);
    }
  }
});
