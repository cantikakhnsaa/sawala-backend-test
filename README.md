# Simple To-Do RESTful API - Internship Technical Test SAWALA Technology

Project ini adalah sebuah Web API sederhana untuk manajemen tugas (To-Do List) yang dilengkapi dengan sistem autentikasi JWT (JSON Web Token) dan database SQLite.

## 🚀 Link Akses
- **Repository GitHub:** [Link Repo Kamu]
- **Live Deployment URL:** [Link Render Kamu]
- **Figma Design System:** [Link Figma Kamu]

## 🛠️ Teknologi yang Digunakan
- **Backend Framework:** Node.js & Express.js
- **Database:** SQLite (sqlite3 & sqlite wrapper)
- **Autentikasi:** JSON Web Token (JWT) & BcryptJS (Password Hashing)
- **Deployment Platform:** Render

## ⚙️ Cara Menjalankan Secara Lokal
1. Clone repository ini: `git clone <link-repo>`
2. Masuk ke direktori: `cd sawala-backend-test`
3. Install dependensi: `npm install`
4. Jalankan server mode development: `npm run dev`
5. Aplikasi akan berjalan di `http://localhost:5000`

## 📖 Dokumentasi API

### 1. Autentikasi
- **Register User**
  - Endpoint: `POST /api/register`
  - Body (JSON): `{"username": "user123", "password": "password123"}`
- **Login User**
  - Endpoint: `POST /api/login`
  - Body (JSON): `{"username": "user123", "password": "password123"}`
  - Response: `{ "message": "Login berhasil", "token": "JWT_TOKEN_DI_SINI" }`

### 2. To-Do List (Membutuhkan Header `Authorization: Bearer <TOKEN>`)
- **Ambil Semua Tugas:** `GET /api/todos`
- **Tambah Tugas Baru:** `POST /api/todos` -> Body: `{"task": "Belajar Backend"}`
- **Hapus Tugas:** `DELETE /api/todos/:id`

## 🤖 Penggunaan AI / Referensi
Project ini dibangun dengan bantuan AI (Gemini) untuk mempercepat penulisan struktur boilerplate code Express.js dan manajemen file SQLite dalam waktu pengerjaan yang singkat (2 jam challenge).