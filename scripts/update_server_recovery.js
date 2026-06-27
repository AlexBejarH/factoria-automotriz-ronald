const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

// 1. Add `recuperacion` table inside db.run callback
const createUsersTableRegex = /\/\/\s*Crear tabla de usuarios[\s\S]*?db\.get\("SELECT COUNT\(\*\)/;
if (createUsersTableRegex.test(code)) {
    const tableCreation = `
        // Crear tabla de recuperación
        db.run(\`CREATE TABLE IF NOT EXISTS recuperacion (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            token TEXT NOT NULL,
            expiracion DATETIME NOT NULL
        )\`);
        
        // Crear tabla de usuarios`;
    code = code.replace('// Crear tabla de usuarios', tableCreation);
} else {
    console.log("Could not find the place to insert recuperacion table.");
}

// 2. Add Recovery endpoints before `// Endpoint para guardar cliente`
const recoveryEndpoints = `
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
                console.log(\`=======================================================\`);
                console.log(\`📧 SIMULADOR DE CORREO\`);
                console.log(\`Para: \${email}\`);
                console.log(\`Asunto: Recuperación de contraseña\`);
                console.log(\`Enlace: http://localhost:3000/admin.html?token=\${token}\`);
                console.log(\`=======================================================\`);
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

// Endpoint para guardar cliente`;
code = code.replace('// Endpoint para guardar cliente', recoveryEndpoints);

fs.writeFileSync('server.js', code);
console.log('server.js updated with recovery logic.');
