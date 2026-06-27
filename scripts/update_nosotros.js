const fs = require('fs');

let html = fs.readFileSync(require('path').join(__dirname, '../public/index.html'), 'utf8');

// 1. Añadir "Nosotros" al menú antes de Filosofía
html = html.replace('<li><a href="#filosofia">Filosofía</a></li>', '<li><a href="#nosotros">Nosotros</a></li>\n        <li><a href="#filosofia">Filosofía</a></li>');

// 2. Crear sección Quiénes Somos
const nosotrosHTML = `
<!-- QUIENES SOMOS -->
<section id="nosotros" class="nosotros-section">
  <div class="container">
    <div class="nosotros-content">
      <div class="nosotros-text reveal">
        <h2>¿Quiénes <span>Somos?</span></h2>
        <p class="lead"><strong>Automotriz Factoría Ronald</strong> nace de la auténtica pasión por los motores y el compromiso con el trabajo bien hecho.</p>
        <p>Somos un equipo de mecánicos profesionales que comenzó con un gran sueño: transformar la industria del servicio automotriz mediante la honestidad técnica y la excelencia operativa. A lo largo de los años, nuestro esfuerzo incansable, dedicación absoluta y atención al detalle nos han permitido crecer y ganarnos la confianza de cientos de clientes.</p>
        <p>No somos un taller convencional; somos una clínica automotriz donde cada vehículo es tratado con el mayor rigor tecnológico y humano. Nuestra juventud como empresa es nuestro principal motor: nos impulsa a mantenernos a la vanguardia, a innovar en cada diagnóstico y a superar constantemente las expectativas de quienes confían su seguridad en nuestras manos.</p>
      </div>
      <div class="nosotros-image reveal" style="transition-delay: 0.2s">
        <!-- Placeholder para foto del taller/equipo, por ahora un bloque elegante -->
        <div class="image-wrapper">
          <img src="https://images.unsplash.com/photo-1625047509168-a71c6f50c05d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Mecánico Profesional Factoría Ronald" style="width:100%; height:100%; object-fit:cover; border-radius:16px;">
          <div class="glow-effect"></div>
        </div>
      </div>
    </div>
  </div>
</section>
`;

// Insert it right before #filosofia
html = html.replace('<!-- MISION VISION VALORES -->', nosotrosHTML + '\n<!-- MISION VISION VALORES -->');

fs.writeFileSync(require('path').join(__dirname, '../public/index.html'), html);


let css = fs.readFileSync(require('path').join(__dirname, '../public/css/styles.css'), 'utf8');

const nosotrosCSS = `
/* QUIENES SOMOS */
.nosotros-section {
  padding: 100px 24px;
  background: var(--black);
  position: relative;
  z-index: 10;
}
.nosotros-content {
  display: flex;
  gap: 60px;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}
.nosotros-text {
  flex: 1;
}
.nosotros-text h2 {
  font-family: var(--font-display);
  font-size: 36px;
  margin-bottom: 24px;
}
.nosotros-text h2 span {
  color: var(--aws-orange);
}
.nosotros-text .lead {
  font-size: 18px;
  color: var(--white);
  margin-bottom: 20px;
  line-height: 1.6;
}
.nosotros-text p {
  color: var(--silver);
  margin-bottom: 16px;
  line-height: 1.8;
  font-size: 15px;
}
.nosotros-image {
  flex: 1;
  position: relative;
}
.image-wrapper {
  position: relative;
  height: 400px;
  border-radius: 16px;
  border: 1px solid rgba(255, 153, 0, 0.2);
  padding: 10px;
  background: var(--charcoal);
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}
.image-wrapper .glow-effect {
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, var(--aws-orange), transparent 60%);
  z-index: -1;
  border-radius: 18px;
  opacity: 0.5;
  filter: blur(10px);
}

@media(max-width: 900px) {
  .nosotros-content {
    flex-direction: column;
  }
}
`;

css += '\n' + nosotrosCSS;

fs.writeFileSync(require('path').join(__dirname, '../public/css/styles.css'), css);

console.log('Quienes somos added');
