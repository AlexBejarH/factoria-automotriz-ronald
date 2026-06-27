const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const xlsx = require('xlsx');
const crypto = require('crypto');

const upload = multer({ storage: multer.memoryStorage() });

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use((req,res,next)=>{console.log(new Date().toISOString(), req.method, req.url); next();});
// Servir archivos estáticos del directorio public
app.use(express.static(path.join(__dirname, 'public')));

// Configurar Base de Datos SQLite

// Utilidad para hash SHA256
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Almacén de sesiones en memoria (token -> user details)
const sessions = {}; 

// En Vercel el filesystem es read-only excepto /tmp
const dbPath = process.env.VERCEL ? '/tmp/database.sqlite' : path.join(__dirname, 'data', 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con SQLite:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
        // Crear tabla de clientes
        db.run(`CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            telefono TEXT NOT NULL,
            servicio TEXT NOT NULL,
            vehiculo TEXT NOT NULL,
            mensaje TEXT,
            fecha DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        
        // Crear tabla de ofertas
        db.run(`CREATE TABLE IF NOT EXISTS ofertas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            badge TEXT,
            imagen TEXT NOT NULL,
            titulo TEXT NOT NULL,
            descripcion TEXT NOT NULL,
            precio_antiguo TEXT,
            precio_nuevo TEXT NOT NULL,
            creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (!err) {
                // Insertar ofertas de ejemplo si la tabla está vacía
                db.get("SELECT COUNT(*) as count FROM ofertas", (err, row) => {
                    if (row && row.count === 0) {
                        const stmt = db.prepare("INSERT INTO ofertas (badge, imagen, titulo, descripcion, precio_antiguo, precio_nuevo) VALUES (?, ?, ?, ?, ?, ?)");
                        stmt.run("🔥 Más vendido", "💧", "Pack Cambio de Aceite", "Aceite sintético 5W-30 + filtro de aceite + revisión de 15 puntos. Para cualquier vehículo.", "S/ 140", "S/ 89");
                        stmt.run("⚡ Solo esta semana", "🛞", "2 Neumáticos + Balanceo", "Bridgestone Ecopia 185/65R15. Instalación y balanceo incluidos.", "S/ 560", "S/ 440");
                        stmt.run("🌟 Pack completo", "🔧", "Mantenimiento Total", "Aceite + filtros + frenos + alineación + diagnóstico. El servicio más completo al mejor precio.", "S/ 380", "S/ 199");
                        stmt.run("❄️ Verano 2025", "❄️", "Recarga A/C Completa", "Gas refrigerante R-134a + limpieza del sistema + revisión de compresor. Frío garantizado.", "S/ 220", "S/ 150");
                        stmt.run("🛑 Seguridad primero", "🛑", "Kit de Frenos Completo", "Pastillas delanteras + traseras + líquido DOT4 + purga del sistema. Para autos nacionales e importados.", "S/ 280", "S/ 199");
                        stmt.run("✨ Lunes y Martes", "✨", "Detailing Premium", "Lavado completo + encerado + tratamiento de tapicería + pulido de faros. Tu auto como nuevo.", "S/ 200", "S/ 120");
                        stmt.finalize();
                    }
                });
            }
        });

        // Crear tabla de catalogo de servicios
        db.run(`CREATE TABLE IF NOT EXISTS catalogo_servicios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            servicio TEXT NOT NULL,
            codigo TEXT,
            marca TEXT,
            producto TEXT NOT NULL,
            descripcion TEXT,
            precio TEXT NOT NULL,
            imagen TEXT
        )`);

        
        // Crear tabla de recuperación
        db.run(`CREATE TABLE IF NOT EXISTS recuperacion (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            token TEXT NOT NULL,
            expiracion DATETIME NOT NULL
        )`);
        
        // Crear tabla de usuarios
        db.run(`CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            rol TEXT NOT NULL,
            creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (!err) {
                db.get("SELECT COUNT(*) as count FROM usuarios", (err, row) => {
                    if (row && row.count === 0) {
                        const defaultEmail = 'admin@factoria.com';
                        const defaultPass = hashPassword('admin123');
                        db.run("INSERT INTO usuarios (email, password, rol) VALUES (?, ?, ?)", [defaultEmail, defaultPass, 'SUPERADMIN']);
                    }
                });
            }
        });
    }
});

// Autenticación dinámica
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        if (sessions[token]) {
            req.user = sessions[token];
            return next();
        }
    }
    res.status(401).json({ error: 'No autorizado' });
};

const superAdminMiddleware = (req, res, next) => {
    if (req.user && req.user.rol === 'SUPERADMIN') {
        next();
    } else {
        res.status(403).json({ error: 'Prohibido: Se requiere rol SUPERADMIN' });
    }
};

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });
    
    const hashedPass = hashPassword(password);
    
    db.get("SELECT id, email, rol FROM usuarios WHERE email = ? AND password = ?", [email, hashedPass], (err, row) => {
        if (err) return res.status(500).json({ error: 'Error de base de datos' });
        if (row) {
            const token = crypto.randomBytes(32).toString('hex');
            sessions[token] = { id: row.id, email: row.email, rol: row.rol };
            res.json({ token, rol: row.rol, email: row.email });
        } else {
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    });
});

app.post('/api/logout', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        delete sessions[token];
    }
    res.json({ message: 'Sesión cerrada' });
});

// Endpoints de Usuarios (Solo SUPERADMIN)
app.get('/api/usuarios', authMiddleware, superAdminMiddleware, (req, res) => {
    db.all("SELECT id, email, rol, creado_en FROM usuarios ORDER BY creado_en DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/usuarios', authMiddleware, superAdminMiddleware, (req, res) => {
    const { email, password, rol } = req.body;
    if (!email || !password || !rol) return res.status(400).json({ error: 'Campos requeridos' });
    
    const hashedPass = hashPassword(password);
    
    db.run("INSERT INTO usuarios (email, password, rol) VALUES (?, ?, ?)", [email, hashedPass, rol], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE')) return res.status(400).json({ error: 'El email ya existe' });
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, message: 'Usuario creado' });
    });
});

app.delete('/api/usuarios/:id', authMiddleware, superAdminMiddleware, (req, res) => {
    if (parseInt(req.params.id) === req.user.id) {
        return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
    }
    db.run("DELETE FROM usuarios WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Usuario eliminado' });
    });
});


// Endpoints de Recuperación de Contraseña
app.post('/api/recuperar', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email requerido' });
    
    db.get("SELECT id FROM usuarios WHERE email = ?", [email], (err, row) => {
        if (err) return res.status(500).json({ error: 'Error de base de datos' });
        if (row) {
            const token = crypto.randomBytes(20).toString('hex');
            const expiracion = new Date(Date.now() + 3600000).toISOString(); // 1 hora
            db.run("INSERT INTO recuperacion (email, token, expiracion) VALUES (?, ?, ?)", [email, token, expiracion], (err) => {
                if (err) return res.status(500).json({ error: 'Error al generar token' });
                console.log(`=======================================================`);
                console.log(`📧 SIMULADOR DE CORREO`);
                console.log(`Para: ${email}`);
                console.log(`Asunto: Recuperación de contraseña`);
                console.log(`Enlace: http://localhost:3000/admin.html?token=${token}`);
                console.log(`=======================================================`);
                res.json({ message: 'Si el correo existe, se ha enviado un enlace de recuperación.' });
            });
        } else {
            // No decir que no existe por seguridad, decir lo mismo
            res.json({ message: 'Si el correo existe, se ha enviado un enlace de recuperación.' });
        }
    });
});

app.post('/api/reset', (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: 'Faltan datos' });
    
    db.get("SELECT email, expiracion FROM recuperacion WHERE token = ?", [token], (err, row) => {
        if (err) return res.status(500).json({ error: 'Error de base de datos' });
        if (!row) return res.status(400).json({ error: 'Token inválido o no existe' });
        
        if (new Date() > new Date(row.expiracion)) {
            return res.status(400).json({ error: 'El token ha expirado' });
        }
        
        const hashedPass = hashPassword(newPassword);
        db.run("UPDATE usuarios SET password = ? WHERE email = ?", [hashedPass, row.email], function(err) {
            if (err) return res.status(500).json({ error: 'Error al actualizar contraseña' });
            
            // Eliminar token usado
            db.run("DELETE FROM recuperacion WHERE email = ?", [row.email]);
            res.json({ message: 'Contraseña actualizada correctamente' });
        });
    });
});

// Endpoint para guardar cliente
app.post('/api/clientes', (req, res) => {
    const { nombre, telefono, servicio, vehiculo, mensaje } = req.body;
    if (!nombre || !telefono || !servicio) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const sql = `INSERT INTO clientes (nombre, telefono, servicio, vehiculo, mensaje) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [nombre, telefono, servicio, vehiculo, mensaje], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, message: 'Cliente guardado con éxito' });
    });
});

app.get('/api/clientes', authMiddleware, (req, res) => {
    db.all("SELECT * FROM clientes ORDER BY fecha DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Endpoints de Ofertas
app.get('/api/ofertas', (req, res) => {
    db.all("SELECT * FROM ofertas ORDER BY creado_en DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/ofertas', authMiddleware, (req, res) => {
    const { badge, imagen, titulo, descripcion, precio_antiguo, precio_nuevo } = req.body;
    const sql = `INSERT INTO ofertas (badge, imagen, titulo, descripcion, precio_antiguo, precio_nuevo) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [badge, imagen, titulo, descripcion, precio_antiguo, precio_nuevo], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID });
    });
});

app.put('/api/ofertas/:id', authMiddleware, (req, res) => {
    const { badge, imagen, titulo, descripcion, precio_antiguo, precio_nuevo } = req.body;
    const sql = `UPDATE ofertas SET badge = ?, imagen = ?, titulo = ?, descripcion = ?, precio_antiguo = ?, precio_nuevo = ? WHERE id = ?`;
    db.run(sql, [badge, imagen, titulo, descripcion, precio_antiguo, precio_nuevo, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Oferta actualizada' });
    });
});

app.delete('/api/ofertas/:id', authMiddleware, (req, res) => {
    const sql = `DELETE FROM ofertas WHERE id = ?`;
    db.run(sql, [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Oferta eliminada' });
    });
});

// Endpoints Catalogo de Servicios (Excel)
app.post('/api/catalogo/upload', authMiddleware, upload.single('excel'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se subió ningún archivo' });
    }
    
    try {
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        // Las columnas esperadas: Servicio, Codigo, Marca, Producto, Descripcion, Precio, Imagen
        const data = xlsx.utils.sheet_to_json(sheet);
        
        if(data.length === 0) return res.status(400).json({error: 'Excel vacío'});

        db.serialize(() => {
            // Limpiar la tabla antes de cargar la nueva
            db.run('DELETE FROM catalogo_servicios');
            
            const stmt = db.prepare('INSERT INTO catalogo_servicios (servicio, codigo, marca, producto, descripcion, precio, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)');
            data.forEach(row => {
                const s = row['Servicio'] || '';
                const c = row['Codigo'] || '';
                const m = row['Marca'] || '';
                const p = row['Producto'] || '';
                const d = row['Descripcion'] || '';
                const pr = row['Precio'] || '';
                const img = row['Imagen'] || '';
                
                if (p && pr && s) { // Requeridos minimos
                    stmt.run(s, c, m, p, d, pr, img);
                }
            });
            stmt.finalize();
        });

        res.json({ message: 'Catálogo actualizado exitosamente con ' + data.length + ' registros (aprox).' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error procesando el archivo Excel' });
    }
});

app.get('/api/catalogo', (req, res) => {
    const { q, servicio } = req.query;
    let sql = "SELECT * FROM catalogo_servicios WHERE 1=1";
    let params = [];
    
    if (servicio) {
        sql += " AND servicio = ?";
        params.push(servicio);
    }
    if (q) {
        sql += " AND (codigo LIKE ? OR marca LIKE ? OR producto LIKE ?)";
        params.push('%' + q + '%', '%' + q + '%', '%' + q + '%');
    }
    
    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Solo escuchar en local (en Vercel lo maneja el runtime)
if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`----------------------------------------------------`);
        console.log(`🚀 Servidor y Base de Datos corriendo en el puerto ${port}`);
        console.log(`🌐 Visita http://localhost:${port}/`);
        console.log(`----------------------------------------------------`);
    });
}

// Exportar para Vercel serverless
module.exports = app;
