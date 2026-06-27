const fs = require('fs');

let html = fs.readFileSync(require('path').join(__dirname, '../public/admin.html'), 'utf8');

// 1. Update login form inputs
html = html.replace('<input type="text" id="username" placeholder="Usuario" />', '<input type="email" id="email" placeholder="Correo Electrónico" />');

// 2. Add 'Equipo' tab button
const equipoTabBtn = `
      <button class="tab" onclick="switchTab('catalogo')">Catálogo Excel</button>
      <button class="tab" id="tab-btn-equipo" onclick="switchTab('equipo')" style="display:none; color:var(--aws-orange);">Equipo (SuperAdmin)</button>
`;
html = html.replace('<button class="tab" onclick="switchTab(\'catalogo\')">Catálogo Excel</button>', equipoTabBtn);

// 3. Add 'Equipo' tab content
const equipoTabContent = `
    <!-- Pestaña Equipo -->
    <div id="tab-equipo" class="tab-content">
      <div class="control-panel">
        <div class="offer-form">
          <h3>Añadir Administrador</h3>
          <div>
            <label>Correo Electrónico</label>
            <input type="email" id="u-email" placeholder="ej: ayudante@factoria.com">
          </div>
          <div>
            <label>Contraseña</label>
            <input type="password" id="u-pass" placeholder="Mínimo 6 caracteres">
          </div>
          <div>
            <label>Rol</label>
            <select id="u-rol" style="width:100%; padding:10px; background:var(--steel); border:1px solid rgba(255,255,255,0.1); color:var(--white); border-radius:6px; margin-top:8px;">
              <option value="ADMIN">Administrador (Normal)</option>
              <option value="SUPERADMIN">Super Administrador</option>
            </select>
          </div>
          <div class="full" style="display:flex;align-items:flex-end;margin-top:10px;">
            <button class="btn-primary" onclick="guardarUsuario(event)">Crear Usuario</button>
          </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Fecha de Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="tabla-usuarios">
          <tr><td colspan="5" style="text-align:center;color:var(--silver)">Cargando usuarios...</td></tr>
        </tbody>
      </table>
    </div>
  </div>
`;
html = html.replace('  </div>\n\n  <script>', equipoTabContent + '\n  <script>');

// 4. Update JS logic (Init)
const initLogic = `
    let token = localStorage.getItem('admin_token');
    let userRole = localStorage.getItem('admin_rol');

    if (token) {
      document.getElementById('login-screen').style.display = 'none';
      document.getElementById('main-content').style.display = 'block';
      if (userRole === 'SUPERADMIN') {
         document.getElementById('tab-btn-equipo').style.display = 'inline-block';
      }
      cargarDatos();
`;
html = html.replace(`    let token = localStorage.getItem('admin_token');\n\n    if (token) {\n      document.getElementById('login-screen').style.display = 'none';\n      document.getElementById('main-content').style.display = 'block';\n      cargarDatos();`, initLogic);

// 5. Update JS logic (Login)
const loginLogicStrOld = `async function hacerLogin() {
      const u = document.getElementById('username').value;
      const p = document.getElementById('password').value;
      const err = document.getElementById('login-error');
      
      try {
        const res = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({username: u, password: p})
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('admin_token', data.token);
          token = data.token;
          err.style.display = 'none';
          document.getElementById('login-screen').style.display = 'none';
          document.getElementById('main-content').style.display = 'block';
          cargarDatos();
        } else {
          err.style.display = 'block';
        }
      } catch(e) {
        err.textContent = 'Error de conexión';
        err.style.display = 'block';
      }
    }`;

const loginLogicStrNew = `async function hacerLogin() {
      const u = document.getElementById('email').value;
      const p = document.getElementById('password').value;
      const err = document.getElementById('login-error');
      
      try {
        const res = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({email: u, password: p})
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('admin_token', data.token);
          localStorage.setItem('admin_rol', data.rol);
          token = data.token;
          userRole = data.rol;
          err.style.display = 'none';
          document.getElementById('login-screen').style.display = 'none';
          document.getElementById('main-content').style.display = 'block';
          if (userRole === 'SUPERADMIN') {
             document.getElementById('tab-btn-equipo').style.display = 'inline-block';
          }
          cargarDatos();
        } else {
          const e = await res.json();
          err.textContent = e.error || 'Credenciales incorrectas';
          err.style.display = 'block';
        }
      } catch(e) {
        err.textContent = 'Error de conexión';
        err.style.display = 'block';
      }
    }`;
html = html.replace(loginLogicStrOld, loginLogicStrNew);

// 6. Logout update
const logoutLogicOld = `function cerrarSesion() {
      localStorage.removeItem('admin_token');
      location.reload();
    }`;
const logoutLogicNew = `async function cerrarSesion() {
      await fetch('http://localhost:3000/api/logout', {
        method: 'POST',
        headers: {'Authorization': 'Bearer ' + token}
      });
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_rol');
      location.reload();
    }`;
html = html.replace(logoutLogicOld, logoutLogicNew);

// 7. Add Users JS logic
const userJsLogic = `
    async function cargarUsuarios() {
      if (userRole !== 'SUPERADMIN') return;
      try {
        const res = await fetch('http://localhost:3000/api/usuarios', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
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
          alert('Usuario creado');
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

const cargarDatosOld = `function cargarDatos() {
      cargarClientes();
      cargarOfertas();
    }`;
const cargarDatosNew = `function cargarDatos() {
      cargarClientes();
      cargarOfertas();
      if (userRole === 'SUPERADMIN') {
        cargarUsuarios();
      }
    }\n` + userJsLogic;

html = html.replace(cargarDatosOld, cargarDatosNew);

fs.writeFileSync(require('path').join(__dirname, '../public/admin.html'), html);
console.log('admin.html updated successfully.');
