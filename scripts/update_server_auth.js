const fs = require('fs');

let serverCode = fs.readFileSync('server.js', 'utf8');

// 1. Add crypto
serverCode = serverCode.replace("const xlsx = require('xlsx');", "const xlsx = require('xlsx');\nconst crypto = require('crypto');");

// 2. Add Hash and Sessions
const hashAndSessions = `
// Utilidad para hash SHA256
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Almacén de sesiones en memoria (token -> user details)
const sessions = {}; 
`;
serverCode = serverCode.replace("const db = new sqlite3.Database", hashAndSessions + "\nconst db = new sqlite3.Database");

// 3. Add Users Table
const createUsersTable = `
        // Crear tabla de usuarios
        db.run(\`CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            rol TEXT NOT NULL,
            creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
        )\`, (err) => {
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
`;
serverCode = serverCode.replace("    }\n});\n\n// Autenticación sencilla", createUsersTable + "    }\n});\n\n// Autenticación dinámica");

// 4. Replace Auth Middlewares and Login endpoint
const newAuthLogic = `// Autenticación dinámica
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
    const { email, password } = req.body; // Cambiado a email
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
`;

const oldAuthRegex = /\/\/ Autenticación sencilla[\s\S]*?\}\);/g;
// We need to replace the old auth logic carefully. Let's just find the index.
const startIdx = serverCode.indexOf('// Autenticación sencilla');
const endIdx = serverCode.indexOf('// Endpoint para guardar cliente');

if (startIdx !== -1 && endIdx !== -1) {
    serverCode = serverCode.substring(0, startIdx) + newAuthLogic + "\n" + serverCode.substring(endIdx);
}

fs.writeFileSync('server.js', serverCode);
console.log('server.js updated successfully.');
