const fs = require('fs');

let html = fs.readFileSync(require('path').join(__dirname, '../public/index.html'), 'utf8');

// 1. Update logo text
html = html.replace(/⚙<\/span> FACTO<em>RÍA<\/em>/g, '⚙</span> Automotriz Factoría Ronald');

// 2. Update brand marques with new specific brands (Toyota, Mitsubishi, Hyundai, Mazda, Kia)
const newBrandsHTML = `
    <img src="https://logo.clearbit.com/toyota.com" alt="Toyota" class="brand-logo" onerror="this.outerHTML='<span class=&quot;brand-logo-text&quot;>'+this.alt+'</span>'">
    <img src="https://logo.clearbit.com/mitsubishi-motors.com" alt="Mitsubishi" class="brand-logo" onerror="this.outerHTML='<span class=&quot;brand-logo-text&quot;>'+this.alt+'</span>'">
    <img src="https://logo.clearbit.com/hyundai.com" alt="Hyundai" class="brand-logo" onerror="this.outerHTML='<span class=&quot;brand-logo-text&quot;>'+this.alt+'</span>'">
    <img src="https://logo.clearbit.com/mazda.com" alt="Mazda" class="brand-logo" onerror="this.outerHTML='<span class=&quot;brand-logo-text&quot;>'+this.alt+'</span>'">
    <img src="https://logo.clearbit.com/kia.com" alt="Kia" class="brand-logo" onerror="this.outerHTML='<span class=&quot;brand-logo-text&quot;>'+this.alt+'</span>'">
`;

// It should be repeated at least 3-4 times to ensure it fills the continuous scroll width without gaps
const repeatedBrands = newBrandsHTML + newBrandsHTML + newBrandsHTML + newBrandsHTML;

// Find the two marquee tracks and replace their contents
html = html.replace(/<div class="marquee-track">[\s\S]*?<\/div>/, '<div class="marquee-track">\n' + repeatedBrands + '\n  </div>');
html = html.replace(/<div class="marquee-track reverse">[\s\S]*?<\/div>/, '<div class="marquee-track reverse">\n' + repeatedBrands + '\n  </div>');

// 3. Add Misión, Visión, Valores Section
const misionHTML = `
<!-- MISION VISION VALORES -->
<section id="filosofia" class="filosofia-section">
  <div class="container">
    <div class="section-header reveal">
      <h2>Nuestra <span>Filosofía</span></h2>
      <p>Somos una empresa joven forjada con puro esfuerzo, dedicación y trabajo constante.</p>
    </div>
    <div class="filosofia-grid">
      <div class="filosofia-card reveal">
        <div class="icon">🚀</div>
        <h3>Misión</h3>
        <p>Brindar un servicio automotriz de excelencia mediante un trabajo honrado, minucioso y transparente. Nos esforzamos cada día para que cada vehículo que entra a nuestro taller salga en perfectas condiciones, garantizando la seguridad y tranquilidad de nuestros clientes.</p>
      </div>
      <div class="filosofia-card reveal" style="transition-delay: 0.2s">
        <div class="icon">⭐</div>
        <h3>Visión</h3>
        <p>Convertirnos en el taller mecánico de referencia a nivel nacional, reconocidos por nuestro crecimiento constante, la innovación tecnológica de nuestros procesos y la confianza inquebrantable que generamos a través de nuestro esfuerzo diario.</p>
      </div>
      <div class="filosofia-card reveal" style="transition-delay: 0.4s">
        <div class="icon">🤝</div>
        <h3>Valores</h3>
        <ul>
          <li><strong>Esfuerzo:</strong> El trabajo duro es nuestro motor.</li>
          <li><strong>Honestidad:</strong> Transparencia total en cada diagnóstico.</li>
          <li><strong>Crecimiento:</strong> Aprendemos y mejoramos continuamente.</li>
          <li><strong>Pasión:</strong> Amamos lo que hacemos y se nota en los resultados.</li>
        </ul>
      </div>
    </div>
  </div>
</section>
`;

// Insert the new section just before SERVICIOS
html = html.replace('<!-- SERVICIOS -->', misionHTML + '\n<!-- SERVICIOS -->');

fs.writeFileSync(require('path').join(__dirname, '../public/index.html'), html);


let css = fs.readFileSync(require('path').join(__dirname, '../public/css/styles.css'), 'utf8');

// Update brand logo CSS to be solid white and larger
css = css.replace('filter: grayscale(1) brightness(0) invert(1) opacity(0.5);', 'filter: brightness(0) invert(1) opacity(1);');
css = css.replace('height: 36px;', 'height: 48px;');
css = css.replace('opacity: 1;', 'opacity: 1;'); // Ensure hover state doesn't change opacity if it was 1
css = css.replace('.brand-logo:hover {\n  filter: grayscale(1) brightness(0) invert(1) opacity(1);\n}', '.brand-logo:hover {\n  transform: scale(1.05);\n}');

// Add new section CSS
const newCSS = `
/* FILOSOFIA (MISION, VISION, VALORES) */
.filosofia-section {
  padding: 100px 24px;
  background: var(--charcoal);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  z-index: 10;
}
.filosofia-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 50px;
}
.filosofia-card {
  background: var(--card-bg);
  padding: 40px 30px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
}
.filosofia-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 153, 0, 0.3);
  box-shadow: 0 15px 40px rgba(255, 153, 0, 0.1);
}
.filosofia-card .icon {
  font-size: 48px;
  margin-bottom: 20px;
}
.filosofia-card h3 {
  font-family: var(--font-display);
  font-size: 24px;
  color: var(--white);
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.filosofia-card p {
  color: var(--silver);
  line-height: 1.7;
}
.filosofia-card ul {
  list-style: none;
  padding: 0;
}
.filosofia-card ul li {
  color: var(--silver);
  margin-bottom: 12px;
  line-height: 1.6;
}
.filosofia-card ul li strong {
  color: var(--aws-orange);
}
`;

css += newCSS;

fs.writeFileSync(require('path').join(__dirname, '../public/css/styles.css'), css);

console.log('Done');
