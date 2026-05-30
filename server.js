const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'sawala_secret_key_123';
let db;

// Inisialisasi Database SQLite
(async () => {
    db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    });
    
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT);
        CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, task TEXT, is_done INTEGER DEFAULT 0);
    `);
    console.log('Database terhubung & Table siap.');
})();

// Middleware Autentikasi JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token tidak ditemukan' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token tidak valid' });
        req.user = user;
        next();
    });
};

// --- ENDPOINT AUTH ---
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Input tidak boleh kosong' });
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).json({ message: 'User berhasil didaftarkan' });
    } catch (error) {
        res.status(400).json({ message: 'Username sudah digunakan' });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    if (!user) return res.status(400).json({ message: 'User tidak ditemukan' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Password salah' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login berhasil', token });
});

// --- ENDPOINT CRUD TODOS ---
app.get('/api/todos', authenticateToken, async (req, res) => {
    const todos = await db.all('SELECT * FROM todos WHERE user_id = ?', [req.user.id]);
    res.json(todos);
});

app.post('/api/todos', authenticateToken, async (req, res) => {
    const { task } = req.body;
    if (!task) return res.status(400).json({ message: 'Task tidak boleh kosong' });
    
    const result = await db.run('INSERT INTO todos (user_id, task) VALUES (?, ?)', [req.user.id, task]);
    res.status(201).json({ id: result.lastID, user_id: req.user.id, task, is_done: 0 });
});

app.delete('/api/todos/:id', authenticateToken, async (req, res) => {
    await db.run('DELETE FROM todos WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Task berhasil dihapus' });
});

app.get('/', (req, res) => res.send('Sawala Tech Backend API Challenge Berjalan Lancar!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));