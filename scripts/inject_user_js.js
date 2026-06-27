const fs = require('fs');
let html = fs.readFileSync(require('path').join(__dirname, '../public/admin.html'), 'utf8');

const userJsLogic = `
    async function cargarUsuarios() {
      if (userRole !== 'SUPERADMIN') return;
      try {
        const res = await fetch('http://localhost:3000/api/usuarios', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        if(res.status === 401 || res.status === 403) { cerrarSesion(); return; }
        const users = await res.json();
        const tbody = document.getElementById('tabla-usuarios');
        tbody.innerHTML = '';
        if(users.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--silver)">No hay otros usuarios</td></tr>';
          return;
        }
        users.forEach(u => {
          tbody.innerHTML += \`
            <tr>
              <td>\${u.id}</td>
              <td>\${u.email}</td>
              <td><span class="badge" \${u.rol === 'SUPERADMIN' ? 'style="background:rgba(255,153,0,0.15);color:var(--aws-orange);border-color:var(--aws-orange);"' : ''}>\${u.rol}</span></td>
              <td>\${new Date(u.creado_en).toLocaleString()}</td>
              <td>
                <button class="btn-volver" style="padding:4px 8px; font-size:12px;" onclick="eliminarUsuario(\${u.id})">Eliminar</button>
              </td>
            </tr>
          \`;
        });
      } catch(err) {
        console.error(err);
      }
    }

    async function guardarUsuario(e) {
      e.preventDefault();
      const email = document.getElementById('u-email').value;
      const password = document.getElementById('u-pass').value;
      const rol = document.getElementById('u-rol').value;

      if(!email || !password) return alert('Completa email y contraseña');

      try {
        const res = await fetch('http://localhost:3000/api/usuarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ email, password, rol })
        });
        if(res.ok) {
          alert('Usuario creado correctamente');
          document.getElementById('u-email').value = '';
          document.getElementById('u-pass').value = '';
          cargarUsuarios();
        } else {
          const err = await res.json();
          alert('Error: ' + err.error);
        }
      } catch(err) {
        alert('Error de conexión');
      }
    }

    async function eliminarUsuario(id) {
      if(!confirm('¿Estás seguro de eliminar este usuario?')) return;
      try {
        const res = await fetch('http://localhost:3000/api/usuarios/' + id, {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + token }
        });
        if(res.ok) {
          cargarUsuarios();
        } else {
          const err = await res.json();
          alert('Error: ' + err.error);
        }
      } catch(err) {
        alert('Error de conexión');
      }
    }
`;

if (!html.includes('async function cargarUsuarios()')) {
    html = html.replace('function cargarDatos() {', userJsLogic + '\n    function cargarDatos() {');
}

// Modify cargarDatos() to include cargarUsuarios()
const cargarDatosOld = `    function cargarDatos() {
      cargarClientes();
      cargarOfertas();
    }`;
const cargarDatosNew = `    function cargarDatos() {
      cargarClientes();
      cargarOfertas();
      if (userRole === 'SUPERADMIN') {
        cargarUsuarios();
      }
    }`;

html = html.replace(cargarDatosOld, cargarDatosNew);

fs.writeFileSync(require('path').join(__dirname, '../public/admin.html'), html);
console.log('admin.html updated successfully with missing JS logic.');
