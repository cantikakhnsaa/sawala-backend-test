# 🚀 Sawala Backend Test - Auth & User API

Tugas tantangan PKL ini berisi pembuatan RESTful API dengan fitur registrasi, login, dan autentikasi menggunakan **JWT (JSON Web Token)** dan database **SQLite (In-Memory)**.

## 🛠️ Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite3 (In-Memory Database)
- **Security:** BcryptJS (Password Hashing) & JSON Web Token (Authentication)

---

## 🛣️ Daftar Endpoint API

### 1. Public Endpoints (Tanpa Token)
- **GET** `https://sawala-backend-test.vercel.app/` ➔ Cek Status Server (Landing Page)
- **POST** `/api/register` ➔ Mendaftarkan user baru (Body: `username`, `password`)
- **POST** `/api/login` ➔ Login & mendapatkan JWT Token (Body: `username`, `password`)

### 2. Protected Endpoints (Butuh Token JWT)
- **GET** `/api/profile` ➔ Mengakses data profil user (Wajib menyertakan `Authorization: Bearer <TOKEN>`)

---

## 💻 Cara Menjalankan Aplikasi di Lokal Komputer

Karena proyek ini menggunakan SQLite *In-Memory* yang berjalan di RAM lokal, disarankan untuk menguji fitur lengkapnya di komputer lokal menggunakan **Postman** atau **Insomnia**:

1. **Clone Repositori ini:**
   ```bash
   git clone [https://github.com/cantikakhnsaa/sawala-backend-test.git](https://github.com/cantikakhnsaa/sawala-backend-test.git)
   cd sawala-backend-test