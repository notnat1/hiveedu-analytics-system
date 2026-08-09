# Setup CI/CD Jenkins (GitHub & Docker)

Setelah Anda menjalankan `docker compose up -d --build` di VPS, Jenkins akan berjalan di alamat `http://46.250.231.48:8080`.
Ikuti panduan berikut untuk melakukan setup awal dan menghubungkannya dengan GitHub Anda:

## 1. Dapatkan Password Admin Awal
Jalankan perintah ini di terminal VPS Anda untuk mendapatkan password Administrator:
```bash
sudo docker exec hiveedu-jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```
*Copy password yang muncul, buka `http://46.250.231.48:8080` di browser Anda, dan paste password tersebut.*

## 2. Instalasi Plugin
1. Setelah login, pilih **"Install suggested plugins"**. Tunggu hingga instalasi selesai.
2. Buat akun Admin pertama Anda (Isi Username, Password, Email, dll).
3. Setelah masuk ke Dashboard Jenkins, pergi ke **Manage Jenkins** -> **Plugins** -> **Available plugins**.
4. Cari dan centang plugin berikut, lalu klik **Install**:
   - `Docker Pipeline`
   - `GitHub Integration`
   - `Docker`

## 3. Buat Pipeline (Job Baru)
1. Di Dashboard utama, klik **New Item** (atau Create a Job).
2. Beri nama (misal: `hiveedu-production`), pilih tipe **Pipeline**, lalu klik **OK**.
3. Di tab **General**, centang kotak **"GitHub project"** dan masukkan URL repository GitHub Anda (contoh: `https://github.com/username/hiveedu-analytics-system`).
4. Di tab **Build Triggers**, centang kotak **"GitHub hook trigger for GITScm polling"**.
5. Di bagian **Pipeline**:
   - Definition: Pilih **Pipeline script from SCM**
   - SCM: Pilih **Git**
   - Repository URL: Masukkan URL GitHub Anda (tambahkan Credentials/Token jika repository Anda *Private*).
   - Branch Specifier: `*/main` (sesuaikan jika branch utama Anda bernama `master`).
   - Script Path: Biarkan terisi `Jenkinsfile`.
6. Klik **Save**.

## 4. Konfigurasi Webhook di GitHub (Auto-Deploy)
Agar Jenkins berjalan otomatis setiap Anda nge-*push* kode ke GitHub:
1. Buka halaman Repository GitHub Anda.
2. Pergi ke tab **Settings** -> **Webhooks** -> klik **Add webhook**.
3. **Payload URL**: Masukkan `http://46.250.231.48:8080/github-webhook/` *(JANGAN lupa garis miring `/` di paling belakang!)*.
4. **Content type**: Pilih `application/json`.
5. Sisanya biarkan *default* dan klik **Add webhook**.

---

🚀 **Selesai!** 
Sekarang cobalah lakukan perubahan kecil pada kode Anda (misal mengedit teks di frontend), lakukan `git push`, dan periksa Dashboard Jenkins Anda. Jenkins akan otomatis mendeteksi perubahan tersebut, mem-build ulang kontainer, dan men-deploy-nya ke VPS Anda secara *real-time*!
