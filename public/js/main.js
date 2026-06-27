// ====== OFERTAS MINI-CAROUSEL ======
const whatsappNumero = '51910029387';

function crearWhatsAppUrl(detalle) {
  const mensaje = `Hola, quiero consultar por ${detalle}.`;
  return `https://wa.me/${whatsappNumero}?text=${encodeURIComponent(mensaje)}`;
}

function abrirWhatsAppConsulta(detalle) {
  window.open(crearWhatsAppUrl(detalle), '_blank', 'noopener');
}

const ofertasTrack = document.getElementById('ofertasTrack');
const ofertasNav = document.getElementById('ofertasNav');

async function cargarOfertasWeb() {
  try {
    const res = await fetch('/api/ofertas');
    const ofertas = await res.json();
    
    if(ofertas.length === 0) {
      ofertasTrack.innerHTML = '<p style="color:var(--silver);padding:20px;">No hay ofertas disponibles en este momento.</p>';
      return;
    }
    
    ofertasTrack.innerHTML = '';
    ofertasNav.innerHTML = '';
    
    ofertas.forEach(o => {
      const card = document.createElement('div');
      card.className = 'oferta-card';
      const imgHtml = o.imagen.length > 5 ? `<img src="${o.imagen}" width="100%" height="100%" style="object-fit:cover;">` : o.imagen;
      card.innerHTML = `
        ${o.badge ? '<div class="oferta-badge">' + o.badge + '</div>' : ''}
        <div class="oferta-img">${imgHtml}</div>
        <div class="oferta-body">
          <h3>${o.titulo}</h3>
          <p>${o.descripcion}</p>
          <div class="oferta-pricing">
            ${o.precio_antiguo ? '<span class="price-old">' + o.precio_antiguo + '</span>' : ''}
            <span class="price-new">${o.precio_nuevo}</span>
          </div>
          <a class="oferta-cta" href="${crearWhatsAppUrl('la oferta ' + o.titulo)}" target="_blank" rel="noopener">Reservar ahora</a>
        </div>
      `;
      ofertasTrack.appendChild(card);
    });
    
    // Aplicar clase para animación continua CSS
    ofertasTrack.classList.add('continuous-marquee');
    
  } catch(err) {
    console.error("Error cargando ofertas:", err);
  }
}

document.addEventListener('DOMContentLoaded', cargarOfertasWeb);

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.producto-card .add-btn').forEach(function(btn) {
    const card = btn.closest('.producto-card');
    const producto = card ? card.querySelector('h4') : null;
    const nombre = producto ? producto.textContent.trim() : 'un producto';
    btn.removeAttribute('onclick');
    btn.addEventListener('click', function() {
      abrirWhatsAppConsulta('disponibilidad de ' + nombre);
    });
  });

  document.querySelectorAll('a[href="#contacto"]:not(.nav-links a)').forEach(function(link) {
    const texto = link.textContent.trim().toLowerCase();
    if (texto.includes('reservar') || texto.includes('contáct') || texto.includes('contact')) {
      link.href = crearWhatsAppUrl(link.textContent.trim());
      link.target = '_blank';
      link.rel = 'noopener';
    }
  });

  document.querySelectorAll('button.nav-cta').forEach(function(btn) {
    btn.removeAttribute('onclick');
    btn.addEventListener('click', function() {
      abrirWhatsAppConsulta('reservar una cita');
    });
  });
});

// ====== SCROLL REVEAL ======
const revealElements = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); revealObs.unobserve(e.target); }});
},{threshold:.12});
revealElements.forEach(r=>revealObs.observe(r));

// ====== NAV MOBILE ======
function toggleMenu(){
  const links = document.querySelector('.nav-links');
  const navContainer = links.parentElement;
  const adminLink = navContainer.querySelector('.nav-admin');
  const cta = navContainer.querySelector('.nav-cta');
  
  if(links.style.display==='flex'){
    links.style.display='none';
    if(adminLink) adminLink.style.display='none';
    cta.style.display='none';
  } else {
    links.style.cssText='display:flex;flex-direction:column;position:absolute;top:68px;left:0;right:0;background:#0A0A0A;padding:20px;gap:16px;border-bottom:1px solid rgba(255,255,255,.1)';
    if(adminLink) adminLink.style.cssText='display:block;margin:0 24px 10px;text-align:center';
    cta.style.cssText='display:block;margin:0 24px 20px;text-align:center';
  }
}

// ====== SMOOTH ACTIVE NAV ======
const allSections = document.querySelectorAll('section[id], div[id="stats"]');
const allNavLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll',()=>{
  let current='';
  allSections.forEach(s=>{if(window.scrollY>=s.offsetTop-100)current=s.id;});
  allNavLinks.forEach(a=>{
    a.style.color=a.getAttribute('href')==='#'+current?'var(--white)':'var(--silver)';
  });
},{ passive:true });

// ====== VALIDACIONES ======

function showError(fieldId, message) {
  var errorEl = document.getElementById('error-' + fieldId);
  var inputEl = document.getElementById(fieldId);
  if (errorEl) { errorEl.textContent = message; errorEl.style.display = 'block'; }
  if (inputEl) { inputEl.style.borderColor = '#D9231D'; }
}

function clearError(fieldId) {
  var errorEl = document.getElementById('error-' + fieldId);
  var inputEl = document.getElementById(fieldId);
  if (errorEl) { errorEl.textContent = ''; errorEl.style.display = 'none'; }
  if (inputEl) { inputEl.style.borderColor = 'rgba(255,255,255,0.1)'; }
}

function validarNombre() {
  var val = document.getElementById('nombre').value.trim();
  var palabras = val.split(/\s+/).filter(function(p){ return p.length > 0; });
  if (palabras.length < 3) {
    showError('nombre', 'Ingresa tu nombre y tus 2 apellidos. Ej: Juan Perez Gomez');
    return false;
  }
  clearError('nombre');
  return true;
}

function validarTelefono() {
  var val = document.getElementById('telefono').value.trim();
  if (/[^0-9]/.test(val)) {
    showError('telefono', 'Solo debes ingresar numeros. No se permiten letras ni espacios.');
    return false;
  }
  if (val.length !== 9) {
    showError('telefono', 'El numero de celular debe tener exactamente 9 digitos.');
    return false;
  }
  if (val[0] !== '9') {
    showError('telefono', 'El numero de celular debe empezar con 9.');
    return false;
  }
  clearError('telefono');
  return true;
}

function validarServicio() {
  var val = document.getElementById('servicio').value;
  if (!val) {
    showError('servicio', 'Selecciona el servicio que necesitas.');
    return false;
  }
  clearError('servicio');
  return true;
}

function validarVehiculo() {
  var val = document.getElementById('vehiculo').value.trim();
  var palabras = val.split(/\s+/).filter(function(p){ return p.length > 0; });
  if (palabras.length < 2) {
    showError('vehiculo', 'Ingresa la marca y el modelo. Ej: Toyota Corolla');
    return false;
  }
  clearError('vehiculo');
  return true;
}

// Validacion en tiempo real
document.addEventListener('DOMContentLoaded', function() {
  var nombreEl = document.getElementById('nombre');
  var telefonoEl = document.getElementById('telefono');
  var servicioEl = document.getElementById('servicio');
  var vehiculoEl = document.getElementById('vehiculo');
  var btnSubmit = document.getElementById('btn-submit');

  if (nombreEl) { nombreEl.addEventListener('blur', validarNombre); }
  if (telefonoEl) {
    telefonoEl.addEventListener('input', function() {
      this.value = this.value.replace(/[^0-9]/g, '');
      if (this.value.length > 9) { this.value = this.value.slice(0, 9); }
    });
    telefonoEl.addEventListener('blur', validarTelefono);
  }
  if (servicioEl) { servicioEl.addEventListener('change', validarServicio); }
  if (vehiculoEl) { vehiculoEl.addEventListener('blur', validarVehiculo); }
  if (btnSubmit) { btnSubmit.addEventListener('click', enviarFormulario); }
});

// ====== ENVIAR FORMULARIO ======
async function enviarFormulario(e) {
  if (e) e.preventDefault();
  var btn = document.getElementById('btn-submit');

  var n = validarNombre();
  var t = validarTelefono();
  var s = validarServicio();
  var v = validarVehiculo();
  if (!n || !t || !s || !v) return;

  var data = {
    nombre: document.getElementById('nombre').value.trim(),
    telefono: document.getElementById('telefono').value.trim(),
    servicio: document.getElementById('servicio').value,
    vehiculo: document.getElementById('vehiculo').value.trim(),
    mensaje: document.getElementById('mensaje').value.trim()
  };

  btn.textContent = 'Guardando...';
  btn.disabled = true;
  btn.style.opacity = '0.6';

  try {
    var res = await fetch('/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      btn.textContent = 'Cita reservada con exito!';
      btn.style.background = '#1E7E4A';
      document.getElementById('nombre').value = '';
      document.getElementById('telefono').value = '';
      document.getElementById('servicio').value = '';
      document.getElementById('vehiculo').value = '';
      document.getElementById('mensaje').value = '';
      setTimeout(function() {
        btn.textContent = 'Enviar solicitud de cita';
        btn.style.background = '';
        btn.disabled = false;
        btn.style.opacity = '1';
      }, 3000);
    } else {
      btn.textContent = 'Error al guardar';
      btn.style.background = '#B01B16';
      setTimeout(function() {
        btn.textContent = 'Enviar solicitud de cita';
        btn.style.background = '';
        btn.disabled = false;
        btn.style.opacity = '1';
      }, 2500);
    }
  } catch (error) {
    btn.textContent = 'Sin conexion al servidor';
    btn.style.background = '#B01B16';
    setTimeout(function() {
      btn.textContent = 'Enviar solicitud de cita';
      btn.style.background = '';
      btn.disabled = false;
      btn.style.opacity = '1';
    }, 3000);
  }
}

// ====== EFECTO DE RATON (BURBUJAS) ======
document.addEventListener('mousemove', function(e) {
  // Variables CSS para el efecto Neon
  document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
  document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');

  // Burbujitas que siguen al cursor
  if(Math.random() > 0.8) return;
  
  const bubble = document.createElement('div');
  const size = Math.random() * 15 + 5;
  bubble.style.position = 'fixed';
  bubble.style.left = e.clientX + 'px';
  bubble.style.top = e.clientY + 'px';
  bubble.style.width = size + 'px';
  bubble.style.height = size + 'px';
  bubble.style.borderRadius = '50%';
  // Estilo Glass/Neon para la burbuja
  bubble.style.border = '1px solid rgba(255, 153, 0, 0.6)';
  bubble.style.boxShadow = '0 0 8px rgba(255, 153, 0, 0.4), inset 0 0 5px rgba(255, 153, 0, 0.2)';
  bubble.style.backgroundColor = 'rgba(255, 153, 0, 0.1)';
  bubble.style.pointerEvents = 'none';
  bubble.style.zIndex = '9999';
  bubble.style.transform = 'translate(-50%, -50%)';
  bubble.style.transition = 'all 0.8s ease-out';
  
  document.body.appendChild(bubble);
  
  setTimeout(() => {
    bubble.style.opacity = '0';
    // Se elevan como burbujas y crecen
    bubble.style.transform = `translate(-50%, ${-50 - Math.random() * 50}px) scale(1.5)`;
  }, 10);
  
  setTimeout(() => {
    bubble.remove();
  }, 800);
});

// ====== CATÁLOGO MODAL ======
async function abrirCatalogo(servicio) {
  const slug = servicio
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const detalleSlug = slug.includes('mecanica') || slug.includes('meca-nica')
    ? 'mecanica-general'
    : (slug.includes('neumaticos') || slug.includes('neuma-ticos') ? 'neumaticos' : '');

  if (detalleSlug) {
    window.location.href = 'servicio.html?categoria=' + encodeURIComponent(detalleSlug);
    return;
  }

  document.getElementById('modalTitle').textContent = 'Catálogo: ' + servicio;
  document.getElementById('catalogoModal').classList.add('active');
  document.body.style.overflow = 'hidden';
  
  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = '<p style="text-align:center;color:var(--silver);">Cargando catálogo...</p>';
  
  try {
    const res = await fetch('/api/catalogo?servicio=' + encodeURIComponent(servicio));
    const items = await res.json();
    
    if(items.length === 0) {
      modalBody.innerHTML = '<p style="text-align:center;color:var(--silver);">No hay productos registrados para este servicio aún.</p>';
      return;
    }
    
    modalBody.innerHTML = '';
    items.forEach(i => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'cat-item';
      
      const imgHtml = i.imagen && i.imagen.length > 5 
        ? `<img src="${i.imagen}" alt="${i.producto}">` 
        : (i.imagen || '⚙');
        
      const marcaHtml = i.marca ? ` - ${i.marca}` : '';
      const codHtml = i.codigo ? `COD: ${i.codigo}${marcaHtml}` : (i.marca ? `MARCA: ${i.marca}` : '');
      
      itemDiv.innerHTML = `
        <div class="cat-img">${imgHtml}</div>
        <div class="cat-info">
          ${codHtml ? `<span class="cat-codigo">${codHtml}</span>` : ''}
          <div class="cat-title">${i.producto}</div>
          <div class="cat-desc">${i.descripcion || ''}</div>
        </div>
        <div class="cat-precio">${i.precio}</div>
      `;
      modalBody.appendChild(itemDiv);
    });
    
  } catch(err) {
    modalBody.innerHTML = '<p style="text-align:center;color:var(--red);">Error cargando el catálogo.</p>';
  }
}

function cerrarCatalogo(e) {
  if (e && e.target !== document.getElementById('catalogoModal') && !e.target.classList.contains('modal-close')) return;
  document.getElementById('catalogoModal').classList.remove('active');
  document.body.style.overflow = '';
}



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


// ====== SCROLL PROGRESS BAR ======
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) : 0;
  document.documentElement.style.setProperty('--scroll', scrollPercent);
});
// Trigger once on load
window.dispatchEvent(new Event('scroll'));

// ====== HAMBURGER MENU (MÓVIL) ======
function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  const nav = document.querySelector('nav');
  const hamburger = document.querySelector('.hamburger');
  const isOpen = navLinks.classList.toggle('open');
  nav.classList.toggle('menu-open', isOpen);
  // Animar el hamburger → X
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.cssText = 'transform:translateY(7px) rotate(45deg);';
    spans[1].style.cssText = 'opacity:0;';
    spans[2].style.cssText = 'transform:translateY(-7px) rotate(-45deg);';
  } else {
    spans[0].style.cssText = '';
    spans[1].style.cssText = '';
    spans[2].style.cssText = '';
  }
}

// Cerrar menú al hacer click en un link del nav
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    const nav = document.querySelector('nav');
    const hamburger = document.querySelector('.hamburger');
    if (navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      nav.classList.remove('menu-open');
      hamburger.querySelectorAll('span').forEach(s => s.style.cssText = '');
    }
  });
});

// Cerrar menú al hacer click fuera
document.addEventListener('click', (e) => {
  const nav = document.querySelector('nav');
  const navLinks = document.querySelector('.nav-links');
  if (navLinks && navLinks.classList.contains('open') && !nav.contains(e.target)) {
    navLinks.classList.remove('open');
    nav.classList.remove('menu-open');
    document.querySelector('.hamburger').querySelectorAll('span').forEach(s => s.style.cssText = '');
  }
});
