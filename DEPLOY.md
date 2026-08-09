# Panduan Eksekusi Deployment VPS (Ubuntu 24.04)

Karena Anda menggunakan OS Ubuntu, silakan jalankan perintah-perintah berikut secara berurutan di terminal SSH Anda (`root@vmi3475565:~#`).

## Langkah 1: Instalasi Docker & Docker Compose
Jika VPS Anda belum terpasang Docker, jalankan script instalasi resmi dari Docker:

```bash
# Update sistem
apt update && apt upgrade -y

# Install curl
apt install curl -y

# Download dan jalankan script instalasi Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Verifikasi instalasi (pastikan muncul versi Docker dan Docker Compose)
docker --version
docker compose version
```

## Langkah 2: Pindahkan Kode Sumber ke VPS
Karena Anda sedang login di VPS, Anda perlu meng-copy folder proyek ini dari komputer lokal Anda (Windows) ke VPS.
Jika Anda menggunakan Git (Sangat Direkomendasikan):

```bash
# Di VPS Anda
apt install git -y
git clone <URL_REPO_GITHUB_ANDA> hiveedu-analytics
cd hiveedu-analytics
```

*(Catatan: Jika Anda tidak pakai Git, Anda bisa meng-copy via SCP/FileZilla dari lokal ke VPS ke dalam folder `/root/hiveedu-analytics`)*

## Langkah 3: Eksekusi Docker Compose
Setelah Anda berada di dalam folder proyek (`cd hiveedu-analytics`), jalankan perintah sakti ini:

```bash
docker compose up -d --build
```

Proses ini akan memakan waktu beberapa menit karena sistem akan mengunduh dependensi (Node.js, PostgreSQL) dan meng-compile aplikasi Anda secara otomatis di VPS.

## Langkah 4: Verifikasi & Cek Log
Untuk memastikan semuanya berjalan lancar, Anda bisa mengecek status kontainer:
```bash
docker compose ps
```
Semua kontainer (`db`, `backend`, `frontend`, `proxy`) harus berstatus **Up**.

Untuk melihat log backend secara *real-time*:
```bash
docker compose logs -f backend
```

Untuk melihat log frontend:
```bash
docker compose logs -f frontend
```

---
> [!IMPORTANT]
> **Konfigurasi SSL Cloudflare**
> Karena Nginx berjalan di port 80 (HTTP biasa) dan domain Anda dikelola oleh Cloudflare, pastikan pengaturan **SSL/TLS encryption mode** di *dashboard* Cloudflare di-set ke **Flexible** (bukan Full/Strict).
> Jika di-set ke Full/Strict, Cloudflare akan error 522/523 karena VPS Anda tidak memiliki sertifikat lokal. Mode Flexible sudah cukup aman karena trafik dari user ke Cloudflare sudah dienkripsi HTTPS, dan Nginx Anda tersembunyi di balik IP Cloudflare.
