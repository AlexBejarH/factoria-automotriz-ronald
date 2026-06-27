const fs = require('fs');

let html = fs.readFileSync(require('path').join(__dirname, '../public/index.html'), 'utf8');

const brandMarqueeContent = `
<!-- BRAND MARQUEE TOP -->
<div class="brand-marquee">
  <div class="marquee-track">
    <img src="https://logo.clearbit.com/michelin.com" alt="Michelin" class="brand-logo" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'30\\'><text x=\\'0\\' y=\\'20\\' fill=\\'white\\'>MICHELIN</text></svg>'">
    <img src="https://logo.clearbit.com/castrol.com" alt="Castrol" class="brand-logo" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'30\\'><text x=\\'0\\' y=\\'20\\' fill=\\'white\\'>CASTROL</text></svg>'">
    <img src="https://logo.clearbit.com/mobil.com" alt="Mobil" class="brand-logo" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'30\\'><text x=\\'0\\' y=\\'20\\' fill=\\'white\\'>MOBIL</text></svg>'">
    <img src="https://logo.clearbit.com/bosch.com" alt="Bosch" class="brand-logo" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'30\\'><text x=\\'0\\' y=\\'20\\' fill=\\'white\\'>BOSCH</text></svg>'">
    <img src="https://logo.clearbit.com/bridgestone.com" alt="Bridgestone" class="brand-logo" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'30\\'><text x=\\'0\\' y=\\'20\\' fill=\\'white\\'>BRIDGESTONE</text></svg>'">
    <img src="https://logo.clearbit.com/continental.com" alt="Continental" class="brand-logo" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'30\\'><text x=\\'0\\' y=\\'20\\' fill=\\'white\\'>CONTINENTAL</text></svg>'">
    <img src="https://logo.clearbit.com/pirelli.com" alt="Pirelli" class="brand-logo" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'30\\'><text x=\\'0\\' y=\\'20\\' fill=\\'white\\'>PIRELLI</text></svg>'">
    <img src="https://logo.clearbit.com/motul.com" alt="Motul" class="brand-logo" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'30\\'><text x=\\'0\\' y=\\'20\\' fill=\\'white\\'>MOTUL</text></svg>'">
    <img src="https://logo.clearbit.com/liqui-moly.com" alt="Liqui Moly" class="brand-logo" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'30\\'><text x=\\'0\\' y=\\'20\\' fill=\\'white\\'>LIQUI MOLY</text></svg>'">
    <img src="https://logo.clearbit.com/goodyear.com" alt="Goodyear" class="brand-logo" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'30\\'><text x=\\'0\\' y=\\'20\\' fill=\\'white\\'>GOODYEAR</text></svg>'">
    
    <!-- Duplicado para efecto infinito suave -->
    <img src="https://logo.clearbit.com/michelin.com" alt="Michelin" class="brand-logo" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'30\\'><text x=\\'0\\' y=\\'20\\' fill=\\'white\\'>MICHELIN</text></svg>'">
    <img src="https://logo.clearbit.com/castrol.com" alt="Castrol" class="brand-logo" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'30\\'><text x=\\'0\\' y=\\'20\\' fill=\\'white\\'>CASTROL</text></svg>'">
    <img src="https://logo.clearbit.com/mobil.com" alt="Mobil" class="brand-logo" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'30\\'><text x=\\'0\\' y=\\'20\\' fill=\\'white\\'>MOBIL</text></svg>'">
    <img src="https://logo.clearbit.com/bosch.com" alt="Bosch" class="brand-logo" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'30\\'><text x=\\'0\\' y=\\'20\\' fill=\\'white\\'>BOSCH</text></svg>'">
    <img src="https://logo.clearbit.com/bridgestone.com" alt="Bridgestone" class="brand-logo" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'30\\'><text x=\\'0\\' y=\\'20\\' fill=\\'white\\'>BRIDGESTONE</text></svg>'">
    <img src="https://logo.clearbit.com/continental.com" alt="Continental" class="brand-logo" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'30\\'><text x=\\'0\\' y=\\'20\\' fill=\\'white\\'>CONTINENTAL</text></svg>'">
    <img src="https://logo.clearbit.com/pirelli.com" alt="Pirelli" class="brand-logo" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'30\\'><text x=\\'0\\' y=\\'20\\' fill=\\'white\\'>PIRELLI</text></svg>'">
    <img src="https://logo.clearbit.com/motul.com" alt="Motul" class="brand-logo" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'30\\'><text x=\\'0\\' y=\\'20\\' fill=\\'white\\'>MOTUL</text></svg>'">
    <img src="https://logo.clearbit.com/liqui-moly.com" alt="Liqui Moly" class="brand-logo" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'30\\'><text x=\\'0\\' y=\\'20\\' fill=\\'white\\'>LIQUI MOLY</text></svg>'">
    <img src="https://logo.clearbit.com/goodyear.com" alt="Goodyear" class="brand-logo" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'30\\'><text x=\\'0\\' y=\\'20\\' fill=\\'white\\'>GOODYEAR</text></svg>'">
  </div>
</div>
`;

// Extract slides content
const slidesStart = html.indexOf('<div class="slides-wrapper" id="slidesWrapper">') + '<div class="slides-wrapper" id="slidesWrapper">'.length;
const slidesEnd = html.indexOf('</div>\n\n  <div class="progress-bar" id="progressBar"></div>');
let slidesContent = html.substring(slidesStart, slidesEnd);

const newHeroContent = `
<!-- HERO CAROUSEL CONTINUO -->
<section class="hero" id="hero">
  <div class="slides-wrapper continuous-hero" id="slidesWrapper">
    ${slidesContent}
    ${slidesContent} <!-- Duplicado para el marquee infinito -->
  </div>
</section>
`;

const brandMarqueeBottom = brandMarqueeContent.replace('<!-- BRAND MARQUEE TOP -->', '<!-- BRAND MARQUEE BOTTOM -->');

const beforeSection = html.substring(0, html.indexOf('<!-- BRAND MARQUEE -->'));
const afterSection = html.substring(html.indexOf('<!-- SERVICIOS -->'));

const newHtml = beforeSection + brandMarqueeContent + newHeroContent + brandMarqueeBottom + '\n' + afterSection;

fs.writeFileSync(require('path').join(__dirname, '../public/index.html'), newHtml);
console.log('factoria.html updated!');
