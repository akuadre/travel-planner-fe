# Travel Planner (Frontend)

Aplikasi frontend berbasis React untuk merencanakan perjalanan wisata, mengelola destinasi, dan membuat itinerary. Project ini dibangun menggunakan ekosistem React modern dengan Vite dan Tailwind CSS v4.

## 🌟 Fitur Utama

Berdasarkan struktur kode dan dependensi, berikut adalah fitur utama aplikasi:

* **Autentikasi Pengguna**: Halaman Login dan Register untuk keamanan akses.
* **Manajemen Destinasi**:
    * Melihat daftar destinasi wisata.
    * Melihat detail destinasi.
    * Menambah/Mengedit data destinasi melalui formulir.
* **Perencanaan Itinerary**: Membuat dan mengatur jadwal perjalanan.
* **Antarmuka Interaktif**: Menggunakan Modal, Notifikasi, dan transisi animasi.
* **Desain Responsif**: Tampilan yang menyesuaikan perangkat desktop dan mobile.

## 🛠 Teknologi yang Digunakan

Project ini dibangun menggunakan *stack* teknologi berikut:

* **Core**: [React](https://react.dev/) (v19), [React DOM](https://react.dev/)
* **Build Tool**: [Vite](https://vitejs.dev/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4)
* **Routing**: [React Router DOM](https://reactrouter.com/) (v7)
* **State & API**: [Axios](https://axios-http.com/)
* **Animasi**: [Framer Motion](https://www.framer.com/motion/)
* **Ikon**: [Lucide React](https://lucide.dev/)
* **Utilities**: React Responsive

## 📋 Prasyarat Instalasi

Sebelum memulai, pastikan komputer Anda telah terinstal:

* [Node.js](https://nodejs.org/) (Versi LTS direkomendasikan)
* npm (bawaan Node.js) atau yarn/pnpm

## 🚀 Cara Instalasi dan Penggunaan

1.  **Clone Repository**
    ```bash
    git clone https://github.com/akuadre/travel-planner-fe.git
    cd travel-planner-fe
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Jalankan Mode Development**
    Untuk menjalankan aplikasi di server lokal (biasanya di http://localhost:5173):
    ```bash
    npm run dev
    ```

4.  **Build untuk Production**
    Untuk membuild aplikasi menjadi file statis:
    ```bash
    npm run build
    ```

5.  **Preview Hasil Build**
    ```bash
    npm run preview
    ```

## 📂 Susunan Project

Berikut adalah struktur folder utama dari aplikasi ini:

```text
travel-planner-fe/
├── public/              # Aset statis (gambar background, icon)
├── src/
│   ├── assets/          # Aset project (logo, svg)
│   ├── components/      # Komponen UI yang dapat digunakan kembali
│   │   ├── common/      # Komponen umum (OptimizedImage, dll)
│   │   ├── layout/      # Header, Footer, Sidebar
│   │   └── ...          # Modal, Form, Notification
│   ├── layouts/         # Layout utama aplikasi (AppLayout)
│   ├── pages/           # Halaman utama (Home, Login, Destinations, dll)
│   ├── routes/          # Konfigurasi routing (AuthRoutes)
│   ├── services/        # Logika API (auth, destination, itinerary)
│   ├── utils/           # Fungsi utilitas (auth helper)
│   ├── App.jsx          # Komponen root utama
│   ├── main.jsx         # Entry point aplikasi
│   └── index.css        # Global styles & konfigurasi Tailwind
├── .gitignore
├── eslint.config.js     # Konfigurasi ESLint
├── index.html
├── package.json         # Manifest project & dependensi
└── vite.config.js       # Konfigurasi Vite
```

## 🤝 Kontribusi

Kontribusi selalu diterima! Jika Anda ingin berkontribusi:

1. Fork repository ini.
2. Buat branch fitur baru (git checkout -b fitur-baru).
3. Commit perubahan Anda (git commit -m 'Menambahkan fitur baru').
4. Push ke branch tersebut (git push origin fitur-baru).
5. Buat Pull Request.

## 📄 Lisensi

Project ini dilisensikan di bawah MIT License.
