const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');
db.run("DELETE FROM ofertas WHERE titulo = ''", (err) => console.log('Borrados', err));
