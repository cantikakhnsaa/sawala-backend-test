const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const SECRET_KEY = 'sawala_secret_key'; // Kunci rahasia untuk JWT

// Middleware
app.use(express.json());
app.use(cors());

// Inisialisasi Database SQLite di dalam memori
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error('Gagal menghubungkan ke database:', err.message);
    } else {
        console.log('Terhubung ke database SQLite (In-Memory).');
        createTables();
    }
});

// Membuat Tabel Users
function createTables() {
    db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`, (err) => {
        if (err) {
            console.log('Tabel users sudah ada atau gagal dibuat.');
        } else {
            console.log('Tabel users berhasil dibuat.');
        }
    });
}

// Middleware untuk Proteksi Route (Verifikasi JWT)
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak, token tidak ditemukan' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token tidak valid atau kedaluwarsa' });
        }
        req.user = user;
        next();
    });
};

// --- ROUTES ---

// 1. Route Utama (Halaman Landing)
app.get('/', (req, res) => {
    res.json({
        message: 'Selamat datang di Sawala Backend Test API!',
        status: 'Online',
        author: 'Cantika Khoerun Nisa'
    });
});

// 2. Register User Baru
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.run(query, [username, hashedPassword], function (err) {
        if (err) {
            return res.status(400).json({ message: 'Username sudah terdaftar' });
        }
        res.status(201).json({ message: 'User berhasil didaftarkan', userId: this.lastID });
    });
});

// 3. Login User (Mendapatkan Token)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }

    const query = `SELECT * FROM users WHERE username = ?`;
    db.get(query, [username], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ token: null, message: 'Password salah' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
            expiresIn: 86400 // Berlaku 24 jam
        });

        res.status(200).json({ message: 'Login berhasil', token: token });
    });
});

// 4. Route yang Diproteksi (Profile)
app.get('/api/profile', authenticateToken, (req, res) => {
    res.json({
        message: 'Berhasil mengakses data rahasia!',
        user: req.user
    });
});

// Menjalankan Server secara Lokal jika bukan di lingkungan Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Server lokal berjalan di http://localhost:${PORT}`);
    });
}

// Ekspor aplikasi Express agar Vercel Serverless Function bisa membacanya
module.exports = app;