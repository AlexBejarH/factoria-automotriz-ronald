const fs = require('fs');
let html = fs.readFileSync(require('path').join(__dirname, '../public/index.html'), 'utf8');

// 1. Find the Filosofia block
const filStart = html.indexOf('<!-- MISION VISION VALORES -->');
const filEnd = html.indexOf('<!-- SERVICIOS -->');
if (filStart !== -1 && filEnd !== -1) {
  let filBlock = html.substring(filStart, filEnd);
  
  // Remove the block from its current location
  html = html.replace(filBlock, '');
  
  // Modify the Filosofia block to be an inner div instead of a section
  // It currently has `<section id="filosofia" class="filosofia-section">`
  filBlock = filBlock.replace('<section id="filosofia" class="filosofia-section">', '<div id="filosofia" class="filosofia-inner" style="margin-top: 80px;">');
  
  // Find the closing tag of the modified block and change it to </div>
  filBlock = filBlock.replace('</section>', '</div>');
  
  // Now we need to insert it INSIDE the #nosotros section.
  // The #nosotros section looks like this:
  // <section id="nosotros" class="nosotros-section">
  //   <div class="container">
  //     <div class="nosotros-content">...</div>
  //   </div>
  // </section>
  
  // We want to insert it after `<div class="nosotros-content">...</div>`
  // A safe way is to find the string `<!-- MISION VISION VALORES -->` (which we just removed) 
  // Wait, the previous replacement already removed it.
  // Let's find `</section>` that belongs to `#nosotros` by looking for `</section>` after `<section id="nosotros"`
  
  const nosStart = html.indexOf('<section id="nosotros"');
  if (nosStart !== -1) {
    const nosEnd = html.indexOf('</section>', nosStart);
    // Actually, `<div class="container">` has a closing `</div>` before `</section>`.
    // It's safer to insert it just before the `</div>\n</section>` of nosotros.
    
    // Let's just insert it before `</section>\n<!-- MISION VISION VALORES -->`
    // Oh wait, `html` still has `<!-- SERVICIOS -->` right after where Filosofia used to be.
    // And before `<!-- SERVICIOS -->` is `</section>` of Nosotros.
    // So we can find the `</section>` right before `<!-- SERVICIOS -->`
    
    const serviciosIdx = html.indexOf('<!-- SERVICIOS -->');
    const lastSectionClose = html.lastIndexOf('</section>', serviciosIdx);
    
    // But wait! We want it inside the container, so it aligns perfectly.
    // The structure is:
    // <section id="nosotros">
    //   <div class="container">
    //     <div class="nosotros-content">...</div>
    //   </div>
    // </section>
    // So we replace `</div>\n</section>` with `\n` + filBlock + `\n</div>\n</section>`
    // But we need to make sure we hit the right one.
    
    // Safer:
    const nosotrosStr = html.substring(nosStart, html.indexOf('</section>', nosStart) + 10);
    const newNosotrosStr = nosotrosStr.replace(/<\/div>\s*<\/section>/, '\n' + filBlock + '\n  </div>\n</section>');
    
    html = html.replace(nosotrosStr, newNosotrosStr);
  }
}

fs.writeFileSync(require('path').join(__dirname, '../public/index.html'), html);
console.log('Merged');
