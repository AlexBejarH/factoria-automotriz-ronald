const fs = require('fs');
let html = fs.readFileSync(require('path').join(__dirname, '../public/admin.html'), 'utf8');

// 1. Add "Olvidé mi contraseña" link in login box
const loginBtn = `<button class="btn-primary" style="width:100%;" onclick="hacerLogin()">Entrar</button>`;
const loginWithForgot = `<button class="btn-primary" style="width:100%;" onclick="hacerLogin()">Entrar</button>
      <div style="margin-top:15px; text-align:center;">
        <a href="#" style="color:var(--silver); font-size:13px; text-decoration:none;" onclick="mostrarRecuperacion()">¿Olvidaste tu contraseña?</a>
      </div>`;
html = html.replace(loginBtn, loginWithForgot);

// 2. Add Recovery and Reset UI Modal inside #login-screen
const loginBoxOld = `    <div class="login-box">`;
const recoveryUI = `
    <!-- Modal Recuperación -->
    <div class="login-box" id="recovery-box" style="display:none;">
      <h2 style="margin-bottom:10px;">Recuperar Contraseña</h2>
      <p style="color:var(--silver); font-size:14px; margin-bottom:20px;">Ingresa tu correo para recibir un enlace de recuperación.</p>
      <div id="recovery-msg" style="font-size:13px; margin-bottom:16px; display:none;"></div>
      <input type="email" id="recovery-email" placeholder="Correo Electrónico" />
      <button class="btn-primary" style="width:100%; margin-bottom:10px;" onclick="solicitarRecuperacion()">Enviar enlace</button>
      <a href="#" style="color:var(--silver); font-size:13px; text-decoration:none;" onclick="mostrarLogin()">Volver al inicio de sesión</a>
    </div>

    <!-- Modal Reset Password -->
    <div class="login-box" id="reset-box" style="display:none;">
      <h2 style="margin-bottom:10px;">Nueva Contraseña</h2>
      <p style="color:var(--silver); font-size:14px; margin-bottom:20px;">Ingresa tu nueva contraseña maestra.</p>
      <div id="reset-msg" style="font-size:13px; margin-bottom:16px; display:none;"></div>
      <input type="password" id="reset-pass" placeholder="Nueva Contraseña" />
      <button class="btn-primary" style="width:100%; margin-bottom:10px;" onclick="resetearPassword()">Guardar Contraseña</button>
      <a href=require('path').join(__dirname, '../public/admin.html') style="color:var(--silver); font-size:13px; text-decoration:none;">Ir al inicio de sesión</a>
    </div>

    <!-- Caja de Login Original -->
    <div class="login-box" id="login-box-inner">
`;
html = html.replace(loginBoxOld, recoveryUI);

// Close the inner div of login-box-inner. Wait, login-box was closed with </div> at the end of login-screen.
html = html.replace(`</div>\n  </div>\n\n  <div class="container" style="display:none;" id="main-content">`, `</div>\n  </div>\n\n  <div class="container" style="display:none;" id="main-content">`);

// Actually, I can just replace `id="login-screen">` completely
const fullLoginScreen = `  <!-- Pantalla de Login -->
  <div id="login-screen">
    <div class="login-box" id="login-box-inner">
      <h1 style="margin-bottom:20px;">Factoría <em>Admin</em></h1>
      <div id="login-error" class="error-msg">Credenciales incorrectas</div>
      <input type="email" id="email" placeholder="Correo Electrónico" />
      <input type="password" id="password" placeholder="Contraseña" />
      <button class="btn-primary" style="width:100%;" onclick="hacerLogin()">Entrar</button>
      <div style="margin-top:15px; text-align:center;">
        <a href="#" style="color:var(--silver); font-size:13px; text-decoration:none;" onclick="mostrarRecuperacion()">¿Olvidaste tu contraseña?</a>
      </div>
    </div>
    
    <div class="login-box" id="recovery-box" style="display:none;">
      <h2 style="margin-bottom:10px;">Recuperar Contraseña</h2>
      <p style="color:var(--silver); font-size:14px; margin-bottom:20px;">Ingresa tu correo para recibir un enlace de recuperación.</p>
      <div id="recovery-msg" style="font-size:13px; margin-bottom:16px; display:none;"></div>
      <input type="email" id="recovery-email" placeholder="Correo Electrónico" />
      <button class="btn-primary" style="width:100%; margin-bottom:10px;" onclick="solicitarRecuperacion()">Enviar enlace</button>
      <a href="#" style="color:var(--silver); font-size:13px; text-decoration:none;" onclick="mostrarLogin()">Volver al inicio de sesión</a>
    </div>

    <div class="login-box" id="reset-box" style="display:none;">
      <h2 style="margin-bottom:10px;">Nueva Contraseña</h2>
      <p style="color:var(--silver); font-size:14px; margin-bottom:20px;">Ingresa tu nueva contraseña maestra.</p>
      <div id="reset-msg" style="font-size:13px; margin-bottom:16px; display:none;"></div>
      <input type="password" id="reset-pass" placeholder="Nueva Contraseña" />
      <button class="btn-primary" style="width:100%; margin-bottom:10px;" onclick="resetearPassword()">Guardar Contraseña</button>
      <a href="http://localhost:3000/admin.html" style="color:var(--silver); font-size:13px; text-decoration:none;">Volver al inicio de sesión</a>
    </div>
  </div>`;

const loginScreenRegex = /<!-- Pantalla de Login -->[\s\S]*?<\/div>\s*<\/div>/;
html = html.replace(loginScreenRegex, fullLoginScreen);

// 3. Add JS functions for recovery logic inside <script>
const recoveryJS = `
    // Lógica de recuperación
    function mostrarRecuperacion() {
      document.getElementById('login-box-inner').style.display = 'none';
      document.getElementById('recovery-box').style.display = 'block';
    }
    function mostrarLogin() {
      document.getElementById('recovery-box').style.display = 'none';
      document.getElementById('login-box-inner').style.display = 'block';
    }

    async function solicitarRecuperacion() {
      const email = document.getElementById('recovery-email').value;
      const msg = document.getElementById('recovery-msg');
      if (!email) {
        msg.textContent = 'Ingresa un correo';
        msg.style.display = 'block';
        msg.style.color = 'var(--red)';
        return;
      }
      try {
        const res = await fetch('http://localhost:3000/api/recuperar', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        msg.textContent = data.message || data.error;
        msg.style.display = 'block';
        msg.style.color = res.ok ? '#4CAF50' : 'var(--red)';
      } catch(e) {
        msg.textContent = 'Error de conexión';
        msg.style.display = 'block';
        msg.style.color = 'var(--red)';
      }
    }

    async function resetearPassword() {
      const pass = document.getElementById('reset-pass').value;
      const msg = document.getElementById('reset-msg');
      const urlParams = new URLSearchParams(window.location.search);
      const tokenURL = urlParams.get('token');
      
      if (!pass || pass.length < 6) {
        msg.textContent = 'La contraseña debe tener mínimo 6 caracteres';
        msg.style.display = 'block';
        msg.style.color = 'var(--red)';
        return;
      }
      try {
        const res = await fetch('http://localhost:3000/api/reset', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ token: tokenURL, newPassword: pass })
        });
        const data = await res.json();
        msg.textContent = data.message || data.error;
        msg.style.display = 'block';
        msg.style.color = res.ok ? '#4CAF50' : 'var(--red)';
        if(res.ok) {
           setTimeout(() => {
              window.location.href = 'http://localhost:3000/admin.html';
           }, 2000);
        }
      } catch(e) {
        msg.textContent = 'Error de conexión';
        msg.style.display = 'block';
        msg.style.color = 'var(--red)';
      }
    }

    // Detectar si venimos de un enlace de recuperación
    window.addEventListener('DOMContentLoaded', () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('token')) {
        document.getElementById('login-box-inner').style.display = 'none';
        document.getElementById('recovery-box').style.display = 'none';
        document.getElementById('reset-box').style.display = 'block';
      }
    });
`;

if (!html.includes('function mostrarRecuperacion()')) {
    html = html.replace('  <script>', '  <script>\n' + recoveryJS);
}

fs.writeFileSync(require('path').join(__dirname, '../public/admin.html'), html);
console.log('admin.html updated with recovery logic.');
