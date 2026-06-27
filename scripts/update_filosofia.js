const fs = require('fs');

let html = fs.readFileSync(require('path').join(__dirname, '../public/index.html'), 'utf8');

// Replace the current filosofia section with a new, professional one.
const newFilosofia = `
<!-- MISION VISION VALORES -->
<section id="filosofia" class="filosofia-section">
  <div class="container">
    <div class="section-header reveal">
      <h2>Nuestra <span>Filosofía Corporativa</span></h2>
      <p>Construyendo el futuro automotriz a través de la excelencia técnica, el trabajo honrado y la mejora continua.</p>
    </div>
    <div class="filosofia-grid">
      <div class="filosofia-card reveal">
        <div class="icon" style="color: var(--aws-orange);">
          <!-- Target/Mision Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="6"></circle>
            <circle cx="12" cy="12" r="2"></circle>
          </svg>
        </div>
        <h3>Misión</h3>
        <p>Proporcionar soluciones automotrices integrales de máxima calidad, asegurando el rendimiento óptimo y la seguridad de cada vehículo que ingresa a nuestras instalaciones. Nos comprometemos a brindar diagnósticos precisos y transparentes, respaldados por un equipo técnico en constante capacitación y guiados por una inquebrantable ética de trabajo.</p>
      </div>
      <div class="filosofia-card reveal" style="transition-delay: 0.2s">
        <div class="icon" style="color: var(--aws-orange);">
          <!-- Vision/Eye Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </div>
        <h3>Visión</h3>
        <p>Consolidarnos como el centro automotriz líder y de mayor confianza a nivel nacional. Aspiramos a ser referentes en innovación y servicio al cliente, demostrando que una empresa joven impulsada por el esfuerzo y la resiliencia puede establecer los más altos estándares de excelencia operativa en la industria automotriz.</p>
      </div>
      <div class="filosofia-card reveal" style="transition-delay: 0.4s">
        <div class="icon" style="color: var(--aws-orange);">
          <!-- Values/Shield/Heart Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="M9 12l2 2 4-4"></path>
          </svg>
        </div>
        <h3>Valores</h3>
        <ul>
          <li><strong>Integridad:</strong> Transparencia y honestidad como base de cada servicio y diagnóstico.</li>
          <li><strong>Perseverancia:</strong> Afrontamos cada reto mecánico con dedicación absoluta.</li>
          <li><strong>Evolución:</strong> Apostamos por el aprendizaje continuo y la modernización de nuestros procesos.</li>
          <li><strong>Compromiso:</strong> La seguridad y satisfacción de nuestros clientes es nuestra prioridad innegociable.</li>
        </ul>
      </div>
    </div>
  </div>
</section>
`;

html = html.replace(/<!-- MISION VISION VALORES -->[\s\S]*?<!-- SERVICIOS -->/g, newFilosofia.trim() + '\n<!-- SERVICIOS -->');

fs.writeFileSync(require('path').join(__dirname, '../public/index.html'), html);
console.log('Filosofia updated');
