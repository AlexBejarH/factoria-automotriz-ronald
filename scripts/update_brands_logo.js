const fs = require('fs');

let html = fs.readFileSync(require('path').join(__dirname, '../public/index.html'), 'utf8');

// 1. Update logo for "Automotriz Factoria Ronald"
// Let's replace the gear emoji with a professional SVG logo
const newLogo = `
<svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:28px; height:28px; margin-right:8px; color: var(--aws-orange);">
  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
</svg>
<span style="display:flex; flex-direction:column; line-height:1;">
  <span style="font-size:16px; font-weight:900; letter-spacing:0.5px;">AUTOMOTRIZ</span>
  <span style="font-size:12px; font-weight:500; color:var(--aws-orange); letter-spacing:1px;">FACTORÍA RONALD</span>
</span>
`;
html = html.replace(/<span class="logo-icon">⚙<\/span>\s*Automotriz Factoría Ronald/g, newLogo);


// 2. Expand car brands (Popular in Lima/Peru)
const carBrands = [
  { name: 'Toyota', domain: 'toyota.com' },
  { name: 'Nissan', domain: 'nissan-global.com' },
  { name: 'Hyundai', domain: 'hyundai.com' },
  { name: 'Kia', domain: 'kia.com' },
  { name: 'Chevrolet', domain: 'chevrolet.com' },
  { name: 'Volkswagen', domain: 'vw.com' },
  { name: 'Suzuki', domain: 'globalsuzuki.com' },
  { name: 'Mazda', domain: 'mazda.com' },
  { name: 'Renault', domain: 'renault.com' },
  { name: 'Honda', domain: 'honda.com' },
  { name: 'Ford', domain: 'ford.com' },
  { name: 'Subaru', domain: 'subaru.com' },
  { name: 'Mitsubishi', domain: 'mitsubishi-motors.com' },
  { name: 'Peugeot', domain: 'peugeot.com' },
  { name: 'Jeep', domain: 'jeep.com' },
  { name: 'BMW', domain: 'bmw.com' },
  { name: 'Audi', domain: 'audi.com' },
  { name: 'Mercedes', domain: 'mercedes-benz.com' }
];

let brandsHTML = '';
for (let b of carBrands) {
  brandsHTML += `\n    <img src="https://logo.clearbit.com/${b.domain}" alt="${b.name}" class="brand-logo" onerror="this.outerHTML='<span class=&quot;brand-logo-text&quot;>'+this.alt+'</span>'">`;
}

// Repeat to ensure continuous marquee
const repeatedBrands = brandsHTML + brandsHTML;

// Replace contents of BOTH marquees
html = html.replace(/<div class="marquee-track">[\s\S]*?<\/div>/, '<div class="marquee-track">\n' + repeatedBrands + '\n  </div>');
html = html.replace(/<div class="marquee-track reverse">[\s\S]*?<\/div>/, '<div class="marquee-track reverse">\n' + repeatedBrands + '\n  </div>');

fs.writeFileSync(require('path').join(__dirname, '../public/index.html'), html);
console.log('Done');
