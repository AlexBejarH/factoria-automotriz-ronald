const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Utilidades ─────────────────────────────────────────────────────────────
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// ─── Base de datos en memoria ────────────────────────────────────────────────
let usuarios = [
    { id: 1, email: 'admin@factoria.com', password: hashPassword('admin123'), rol: 'SUPERADMIN', creado_en: new Date().toISOString() }
];

let clientes = [];

let ofertas = [
    { id: 1, badge: '🔥 Más vendido',      imagen: '💧', titulo: 'Pack Cambio de Aceite',    descripcion: 'Aceite sintético 5W-30 + filtro de aceite + revisión de 15 puntos. Para cualquier vehículo.', precio_antiguo: 'S/ 140', precio_nuevo: 'S/ 89',  creado_en: new Date().toISOString() },
    { id: 2, badge: '⚡ Solo esta semana',  imagen: '🛞', titulo: '2 Neumáticos + Balanceo',  descripcion: 'Bridgestone Ecopia 185/65R15. Instalación y balanceo incluidos.',                             precio_antiguo: 'S/ 560', precio_nuevo: 'S/ 440', creado_en: new Date().toISOString() },
    { id: 3, badge: '🌟 Pack completo',     imagen: '🔧', titulo: 'Mantenimiento Total',       descripcion: 'Aceite + filtros + frenos + alineación + diagnóstico. El servicio más completo.',             precio_antiguo: 'S/ 380', precio_nuevo: 'S/ 199', creado_en: new Date().toISOString() },
    { id: 4, badge: '❄️ Verano 2025',       imagen: '❄️', titulo: 'Recarga A/C Completa',     descripcion: 'Gas refrigerante R-134a + limpieza del sistema + revisión de compresor. Frío garantizado.',  precio_antiguo: 'S/ 220', precio_nuevo: 'S/ 150', creado_en: new Date().toISOString() },
    { id: 5, badge: '🛑 Seguridad primero', imagen: '🛑', titulo: 'Kit de Frenos Completo',   descripcion: 'Pastillas delanteras + traseras + líquido DOT4 + purga del sistema.',                        precio_antiguo: 'S/ 280', precio_nuevo: 'S/ 199', creado_en: new Date().toISOString() },
    { id: 6, badge: '✨ Lunes y Martes',    imagen: '✨', titulo: 'Detailing Premium',         descripcion: 'Lavado completo + encerado + tratamiento de tapicería + pulido de faros.',                    precio_antiguo: 'S/ 200', precio_nuevo: 'S/ 120', creado_en: new Date().toISOString() },
];

let catalogo = [];
let recuperacion = [];
const sessions = {};

let nextId = {
    usuarios: 2,
    clientes: 1,
    ofertas: 7,
    catalogo: 1,
};

// ─── Auth Middleware ──────────────────────────────────────────────────────────
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        if (sessions[token]) { req.user = sessions[token]; return next(); }
    }
    res.status(401).json({ error: 'No autorizado' });
};

const superAdminMiddleware = (req, res, next) => {
    if (req.user && req.user.rol === 'SUPERADMIN') return next();
    res.status(403).json({ error: 'Prohibido: Se requiere rol SUPERADMIN' });
};

// ─── Login / Logout ───────────────────────────────────────────────────────────
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });
    const hashedPass = hashPassword(password);
    const user = usuarios.find(u => u.email === email && u.password === hashedPass);
    if (user) {
        const token = crypto.randomBytes(32).toString('hex');
        sessions[token] = { id: user.id, email: user.email, rol: user.rol };
        return res.json({ token, rol: user.rol, email: user.email });
    }
    res.status(401).json({ error: 'Credenciales inválidas' });
});

app.post('/api/logout', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) delete sessions[authHeader.split(' ')[1]];
    res.json({ message: 'Sesión cerrada' });
});

// ─── Usuarios ─────────────────────────────────────────────────────────────────
app.get('/api/usuarios', authMiddleware, superAdminMiddleware, (req, res) => {
    res.json(usuarios.map(({ password, ...u }) => u));
});

app.post('/api/usuarios', authMiddleware, superAdminMiddleware, (req, res) => {
    const { email, password, rol } = req.body;
    if (!email || !password || !rol) return res.status(400).json({ error: 'Campos requeridos' });
    if (usuarios.find(u => u.email === email)) return res.status(400).json({ error: 'El email ya existe' });
    const newUser = { id: nextId.usuarios++, email, password: hashPassword(password), rol, creado_en: new Date().toISOString() };
    usuarios.push(newUser);
    res.status(201).json({ id: newUser.id, message: 'Usuario creado' });
});

app.delete('/api/usuarios/:id', authMiddleware, superAdminMiddleware, (req, res) => {
    const id = parseInt(req.params.id);
    if (id === req.user.id) return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
    usuarios = usuarios.filter(u => u.id !== id);
    res.json({ message: 'Usuario eliminado' });
});

// ─── Recuperación de contraseña ───────────────────────────────────────────────
app.post('/api/recuperar', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email requerido' });
    const user = usuarios.find(u => u.email === email);
    if (user) {
        const token = crypto.randomBytes(20).toString('hex');
        const expiracion = new Date(Date.now() + 3600000).toISOString();
        recuperacion.push({ email, token, expiracion });
        console.log(`📧 Token de recuperación para ${email}: ${token}`);
    }
    res.json({ message: 'Si el correo existe, se ha enviado un enlace de recuperación.' });
});

app.post('/api/reset', (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: 'Faltan datos' });
    const rec = recuperacion.find(r => r.token === token);
    if (!rec) return res.status(400).json({ error: 'Token inválido' });
    if (new Date() > new Date(rec.expiracion)) return res.status(400).json({ error: 'Token expirado' });
    const user = usuarios.find(u => u.email === rec.email);
    if (user) user.password = hashPassword(newPassword);
    recuperacion = recuperacion.filter(r => r.email !== rec.email);
    res.json({ message: 'Contraseña actualizada correctamente' });
});

// ─── Clientes ─────────────────────────────────────────────────────────────────
app.post('/api/clientes', (req, res) => {
    const { nombre, telefono, servicio, vehiculo, mensaje } = req.body;
    if (!nombre || !telefono || !servicio) return res.status(400).json({ error: 'Faltan campos obligatorios' });
    const newCliente = { id: nextId.clientes++, nombre, telefono, servicio, vehiculo, mensaje, fecha: new Date().toISOString() };
    clientes.push(newCliente);
    res.status(201).json({ id: newCliente.id, message: 'Cliente guardado con éxito' });
});

app.get('/api/clientes', authMiddleware, (req, res) => {
    res.json([...clientes].reverse());
});

// ─── Ofertas ──────────────────────────────────────────────────────────────────
app.get('/api/ofertas', (req, res) => {
    res.json([...ofertas].reverse());
});

app.post('/api/ofertas', authMiddleware, (req, res) => {
    const { badge, imagen, titulo, descripcion, precio_antiguo, precio_nuevo } = req.body;
    const newOferta = { id: nextId.ofertas++, badge, imagen, titulo, descripcion, precio_antiguo, precio_nuevo, creado_en: new Date().toISOString() };
    ofertas.push(newOferta);
    res.status(201).json({ id: newOferta.id });
});

app.put('/api/ofertas/:id', authMiddleware, (req, res) => {
    const id = parseInt(req.params.id);
    const idx = ofertas.findIndex(o => o.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Oferta no encontrada' });
    ofertas[idx] = { ...ofertas[idx], ...req.body };
    res.json({ message: 'Oferta actualizada' });
});

app.delete('/api/ofertas/:id', authMiddleware, (req, res) => {
    const id = parseInt(req.params.id);
    ofertas = ofertas.filter(o => o.id !== id);
    res.json({ message: 'Oferta eliminada' });
});

// ─── Catálogo ─────────────────────────────────────────────────────────────────
app.post('/api/catalogo/upload', authMiddleware, (req, res) => {
    // En demo/serverless no procesamos Excel, respondemos OK
    res.json({ message: 'Función disponible solo en servidor local.' });
});

app.get('/api/catalogo', (req, res) => {
    const { q, servicio } = req.query;
    let result = [...catalogo];
    if (servicio) result = result.filter(r => r.servicio === servicio);
    if (q) {
        const lq = q.toLowerCase();
        result = result.filter(r =>
            (r.codigo && r.codigo.toLowerCase().includes(lq)) ||
            (r.marca && r.marca.toLowerCase().includes(lq)) ||
            (r.producto && r.producto.toLowerCase().includes(lq))
        );
    }
    res.json(result);
});

// ─── Servidor ─────────────────────────────────────────────────────────────────
if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`----------------------------------------------------`);
        console.log(`🚀 Servidor corriendo en http://localhost:${port}/`);
        console.log(`----------------------------------------------------`);
    });
}

module.exports = app;
