const serviciosDetalle = {
  'mecanica-general': {
    nombre: 'Mecánica general',
    etiqueta: 'Motor, transmisión y dirección',
    imagen: 'assets/images/serv_mecanica.png',
    resumen: 'Reparación y mantenimiento integral para que tu auto vuelva a responder con fuerza, seguridad y confianza.',
    descripcion: 'Atendemos fallas de motor, transmisión, dirección, suspensión y mantenimiento preventivo. Incluye revisión técnica y diagnóstico computarizado cuando el caso lo requiere.',
    servicios: [
      {
        titulo: 'Diagnóstico computarizado',
        texto: 'Lectura de códigos de falla, revisión de sensores y orientación técnica antes de iniciar la reparación.'
      },
      {
        titulo: 'Mantenimiento de motor',
        texto: 'Revision de fugas, afinamiento, cambio de filtros, bujias, correas, fluidos y componentes de desgaste.'
      },
      {
        titulo: 'Reparación de transmisión',
        texto: 'Inspección de embrague, caja, soportes, retenes, aceite de transmisión y ruidos en el sistema.'
      },
      {
        titulo: 'Sistema de dirección',
        texto: 'Revisión de terminales, cremalleras, bombas, mangueras, fugas hidráulicas y dirección asistida.'
      },
      {
        titulo: 'Suspension y tren delantero',
        texto: 'Amortiguadores, rotulas, bocinas, bieletas, brazos y componentes que afectan estabilidad y confort.'
      },
      {
        titulo: 'Revision preventiva',
        texto: 'Chequeo general para detectar fallas antes de que se conviertan en reparaciones costosas.'
      }
    ],
    procesos: ['Recepción del vehículo', 'Diagnóstico inicial', 'Cotización clara', 'Reparación autorizada', 'Prueba final']
  },
  neumaticos: {
    nombre: 'Neumáticos',
    etiqueta: 'Venta, instalación y alineación',
    imagen: 'assets/images/serv_neumaticos.png',
    resumen: 'Todo para que tus llantas trabajen parejas, seguras y con mayor vida útil.',
    descripcion: 'Vendemos e instalamos neumáticos en diferentes medidas, con opciones premium y económicas. También realizamos balanceo, alineación y revisión del estado de tus ruedas.',
    servicios: [
      {
        titulo: 'Venta de neumáticos',
        texto: 'Medidas para autos, SUV y camionetas, con alternativas premium y económicas según tu presupuesto.'
      },
      {
        titulo: 'Instalación profesional',
        texto: 'Montaje correcto, revisión de válvulas, torque adecuado y verificación visual de cada rueda.'
      },
      {
        titulo: 'Balanceo',
        texto: 'Corrección de vibraciones para mejorar el confort, el agarre y el desgaste uniforme del neumático.'
      },
      {
        titulo: 'Alineación',
        texto: 'Ajuste de ángulos de dirección para evitar que el vehículo jale hacia un lado o desgaste mal las llantas.'
      },
      {
        titulo: 'Rotacion de llantas',
        texto: 'Cambio de posición para extender la vida útil y mantener un desgaste equilibrado.'
      },
      {
        titulo: 'Revisión de desgaste',
        texto: 'Evaluamos presión, profundidad de cocada, deformaciones, pinchazos y condición general.'
      }
    ],
    procesos: ['Elegimos la medida', 'Instalamos', 'Balanceamos', 'Alineamos', 'Revisamos presión y seguridad']
  }
};

const whatsappNumero = '51910029387';

function getCategoria() {
  const params = new URLSearchParams(window.location.search);
  return params.get('categoria') || 'mecanica-general';
}

function crearWhatsappUrl(servicio, detalle) {
  const mensaje = `Hola, quiero solicitar una cotizacion para ${servicio}. Me interesa: ${detalle}.`;
  return `https://wa.me/${whatsappNumero}?text=${encodeURIComponent(mensaje)}`;
}

function configurarWhatsApp(data) {
  const url = crearWhatsappUrl(data.nombre, 'revision y diagnostico');
  const cta = document.getElementById('whatsappCotizacion');
  const nav = document.getElementById('navWhatsapp');

  if (cta) cta.href = url;
  if (nav) nav.href = url;
}

function renderServicio() {
  const categoria = getCategoria();
  const data = serviciosDetalle[categoria] || serviciosDetalle['mecanica-general'];

  document.title = data.nombre + ' - Factoria Ronald';
  document.getElementById('servicioTitulo').textContent = data.nombre;
  document.getElementById('servicioEtiqueta').textContent = data.etiqueta;
  document.getElementById('servicioResumen').textContent = data.resumen;
  document.getElementById('servicioDescripcion').textContent = data.descripcion;
  document.getElementById('servicioImagen').src = data.imagen;
  document.getElementById('servicioImagen').alt = data.nombre;
  configurarWhatsApp(data);

  document.getElementById('servicioLista').innerHTML = data.servicios.map((item) => `
    <article class="detalle-card">
      <span class="detalle-card-icon">+</span>
      <h3>${item.titulo}</h3>
      <p>${item.texto}</p>
    </article>
  `).join('');

  document.getElementById('servicioProceso').innerHTML = data.procesos.map((item, index) => `
    <li>
      <span>${String(index + 1).padStart(2, '0')}</span>
      ${item}
    </li>
  `).join('');

  cargarCatalogo(categoria);
}

async function cargarCatalogo(categoria) {
  const catalogo = document.getElementById('servicioCatalogo');
  const estado = document.getElementById('catalogoEstado');
  const servicio = categoria === 'mecanica-general' ? 'Mecánica general' : 'Neumáticos';

  try {
    const res = await fetch('/api/catalogo?servicio=' + encodeURIComponent(servicio));
    const items = await res.json();

    if (!Array.isArray(items) || items.length === 0) {
      estado.textContent = 'Todavía no hay precios cargados en el catálogo para esta categoría.';
      const data = serviciosDetalle[categoria] || serviciosDetalle['mecanica-general'];
      estado.textContent = 'Opciones disponibles para consultar por WhatsApp';
      catalogo.innerHTML = data.servicios.map((item) => `
        <article class="detalle-producto">
          <div class="detalle-producto-img"><span>+</span></div>
          <div>
            <span>${data.nombre}</span>
            <h3>${item.titulo}</h3>
            <p>${item.texto}</p>
          </div>
          <a class="detalle-consulta" href="${crearWhatsappUrl(data.nombre, item.titulo)}" target="_blank" rel="noopener">Consultar</a>
        </article>
      `).join('');
      return;
    }

    estado.textContent = 'Catálogo disponible';
    catalogo.innerHTML = items.map((item) => {
      const imagen = item.imagen && item.imagen.length > 5
        ? `<img src="${item.imagen}" alt="${item.producto}">`
        : '<span>+</span>';

      return `
        <article class="detalle-producto">
          <div class="detalle-producto-img">${imagen}</div>
          <div>
            <span>${item.codigo || item.marca || 'Servicio'}</span>
            <h3>${item.producto}</h3>
            <p>${item.descripcion || ''}</p>
          </div>
          <strong>${item.precio}</strong>
        </article>
      `;
    }).join('');
  } catch (error) {
    estado.textContent = 'No se pudo cargar el catálogo en este momento.';
  }
}

document.addEventListener('DOMContentLoaded', renderServicio);
