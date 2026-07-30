# Phase 3: Enterprise Readiness & "Wow" Factor AI

Berdasarkan permintaan Anda untuk membuat proyek ini sekelas *Enterprise* (siap untuk level perusahaan) dan membuat fitur AI menjadi lebih "pintar" (wow factor), berikut adalah rencana implementasi komprehensif yang akan kita kerjakan.

## 🚀 1. The "Wow" Factor: Generative AI (LLM) untuk XAI
Saat ini, *Explainable AI* (XAI) kita hanya menggabungkan string statis dengan pola IF-ELSE. Kita akan melakukan *upgrade* besar:
- Mengintegrasikan **Google Gemini AI** (atau LLM lain) ke dalam `XaiService`.
- **Sistem Prompting**: AI tidak hanya memprediksi angka, tetapi juga akan men- *generate* paragraf analisis personal, empati, dan rekomendasi langkah belajar konkret untuk setiap siswa berdasarkan statistik nilai (`math`, `logic`, `english`, `attendance`, dll) secara dinamis.
- Ini adalah materi yang sangat luar biasa untuk dipresentasikan di sidang Tugas Akhir!

## 🛡️ 2. Security Hardening
- Menginstal `@nestjs/throttler` untuk **Rate Limiting** (mencegah *spam request* / DDoS).
- Menginstal `helmet` untuk mengamankan *header* HTTP secara otomatis.
- Mengonfigurasi batasan **CORS** agar hanya domain yang diizinkan yang dapat mengakses *backend*.

## 📚 3. Dokumentasi API Otomatis (Swagger)
- Menginstal `@nestjs/swagger`.
- Menambahkan *decorator* pada *controller* utama agar sistem secara otomatis membuat antarmuka UI dokumentasi interaktif (biasanya diakses di `http://localhost:3000/api-docs`).

## ⚡ 4. Performa (Caching & Skalabilitas)
- Mengintegrasikan `@nestjs/cache-manager` untuk **In-Memory Caching**.
- Endpoint *dashboard* yang berat (yang menghitung prediksi MLR untuk semua murid) akan di-*cache* selama beberapa menit sehingga waktu respons API menjadi instan (dari ratusan ms menjadi ~5ms).

## 📝 5. Advanced Logging (Winston)
- Mengganti log bawaan dengan `nest-winston`.
- Menyimpan setiap aktivitas (terutama peringatan sistem) dalam format JSON ke dalam direktori file harian otomatis (`logs/app-YYYY-MM-DD.log`).

## 🧪 6. Pengujian Otomatis (Unit Testing)
- Menulis kode **Unit Test** dengan `Jest` khusus untuk modul kritis: `mlr.service.ts` dan `xai.service.ts`.
- Pembuktian matematis bahwa algoritma Anda solid, bukan hanya *"berjalan kebetulan"*.

---

> [!WARNING]
> ## User Review Required
> Karena cakupannya cukup besar, kita akan mengeksekusinya secara bertahap. Apakah Anda setuju dengan seluruh poin di atas?

> [!IMPORTANT]
> ## Open Questions (Mohon Dijawab)
> 1. **Untuk fitur Generative AI (Gemini):** Apakah Anda sudah memiliki API Key dari Google Gemini (Google AI Studio) atau OpenAI? Jika belum, Anda bisa membuatnya secara gratis di [Google AI Studio](https://aistudio.google.com/). Nanti kita akan masukkan ke file `.env` sebagai `GEMINI_API_KEY`.
> 2. **Dari 6 poin di atas,** apakah ada poin yang ingin dikerjakan pertama kali (misalnya, membuat AI-nya pintar dulu), atau Anda ingin saya langsung mengeksekusinya secara berurutan?
