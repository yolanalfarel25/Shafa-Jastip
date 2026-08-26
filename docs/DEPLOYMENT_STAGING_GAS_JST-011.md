# Panduan Deploy GAS Staging & Integrasi GitHub [JST-011]

Dokumen ini menyediakan panduan operasional langkah demi langkah untuk deployment Google Apps Script (GAS) lingkungan staging dan integrasi repository lokal dengan remote GitHub.

---

## Prinsip Keamanan Lingkungan Staging

1. **Isolasi Penuh**: Jangan pernah menggunakan Google Spreadsheet, Folder Google Drive, atau Akun Google produksi untuk kebutuhan staging.
2. **Tanpa Hardcode Rahasia**: Jangan menulis ID Spreadsheet/Drive privat atau kredensial ke file source code yang terlacak Git. Gunakan Script Properties GAS.
3. **Data Sintetis**: Gunakan data uji buatan (nama fiktif, email pengujian, bukti transfer dummy). Jangan memakai data buyer nyata.

---

## Bagian A: Persiapan Google Spreadsheet & Google Drive

### 1. Buat Google Spreadsheet Staging
1. Buka [Google Sheets](https://sheets.new) menggunakan akun Google pengujian/staging.
2. Beri nama file: `[STAGING] Jastip Apps Database`.
3. Salin **Spreadsheet ID** dari bilah URL browser:
   `https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID_STAGING>/edit`
4. *Catatan*: Tidak perlu membuat tab/sheet secara manual; script akan menginisialisasinya secara otomatis melalui fungsi `setupApp()`.

### 2. Buat Google Drive Root Folder Staging
1. Buka [Google Drive](https://drive.google.com).
2. Buat folder baru dengan nama: `[STAGING] Jastip Apps Storage`.
3. Buka folder tersebut dan salin **Folder ID** dari URL browser:
   `https://drive.google.com/drive/folders/<DRIVE_ROOT_FOLDER_ID_STAGING>`

---

## Bagian B: Persiapan & Deployment Google Apps Script (GAS)

### 1. Buat Proyek Google Apps Script
1. Buka [script.google.com](https://script.google.com).
2. Klik tombol **New Project** / **Proyek Baru**.
3. Beri nama proyek: `[STAGING] Jastip Apps Backend`.

### 2. Salin Source Code ke Proyek GAS
1. **Manifest (`appsscript.json`)**:
   - Di menu sebelah kiri editor GAS, klik ikon **Project Settings** (roda gigi).
   - Centang opsi `"Show "appsscript.json" manifest file in editor"`.
   - Kembali ke tab editor (ikon `< >`), buka file `appsscript.json`, dan ganti isinya dengan isi file `04_Backend_GAS/appsscript.json`.
2. **Backend Script (`Code.gs`) & Script Properties**:
   - Buka file `Code.gs` di editor GAS.
   - Salin seluruh isi dari `04_Backend_GAS/Code.gs` dan simpan. Script membaca `SPREADSHEET_ID` dan `DRIVE_ROOT_FOLDER_ID` melalui `PropertiesService.getScriptProperties()`.
   - Di editor GAS, buka **Project Settings** (roda gigi) -> **Script Properties** -> **Add script property**.
   - Tambahkan `SPREADSHEET_ID` dengan nilai ID Spreadsheet staging.
   - Tambahkan `DRIVE_ROOT_FOLDER_ID` dengan nilai ID folder Drive staging.
   - Klik **Save script properties**. Jangan menulis nilai ID ke source atau file yang terlacak Git.
3. **File Antarmuka HTML**:
   - Di editor GAS, klik tombol **+** di samping Files -> pilih **HTML**.
   - Buat 3 file HTML berikut dengan menyalin isi file lokal:
     * File `Login.html` <- salin dari `01_Login_Signup/Login.html`
     * File `Dashboard.html` <- salin dari `02_Dashboard_Jastiper/Dashboard.html`
     * File `Konfirmasi.html` <- salin dari `03_Konfirmasi_Pembelian/Konfirmasi.html`

### 3. Inisialisasi Database Sheet (`setupApp`)
1. Pada dropdown daftar fungsi di bagian atas editor GAS, pilih fungsi `setupApp`.
2. Klik tombol **Run** (Jalankan).
3. Google akan meminta otorisasi perizinan akses (Review Permissions) -> Berikan izin menggunakan akun staging Anda.
4. Pastikan eksekusi selesai tanpa error (Execution log: `"Setup multi-jastiper selesai."`).
5. Buka Google Spreadsheet staging Anda dan periksa bahwa 4 sheet telah terbuat secara otomatis:
   - `Konfirmasi Jastip v4`
   - `Jastipers`
   - `Sessions`
   - `JastiperEmailHistory`

### 4. Deploy sebagai Web App
1. Klik tombol **Deploy** di pojok kanan atas -> pilih **New deployment**.
2. Klik ikon gear di sebelah kiri jenis deployment -> pilih **Web app**.
3. Isi konfigurasi deployment:
   - **Description**: `Staging Initial Deployment JST-011`
   - **Execute as**: `Me (<email-akun-staging>)` (*USER_DEPLOYING*)
   - **Who has access**: `Anyone` (*ANYONE_ANONYMOUS*)
4. Klik tombol **Deploy**.
5. Salin **Web App URL** yang dihasilkan:
   `https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec`

---

## Bagian C: Menghubungkan Repository Lokal ke GitHub

### 1. Tambahkan Remote GitHub
Jalankan perintah berikut di terminal lokal Master (ganti `<URL_REPO_GITHUB>` dengan URL repository Anda):

```bash
git remote add origin <URL_REPO_GITHUB>
```

Verifikasi remote telah terpasang:
```bash
git remote -v
```

### 2. Push Branch Kerja Staging ke GitHub
Pastikan seluruh file telah bersih dari data privat, lalu push branch staging:

```bash
git push -u origin chore/JST-011-deploy-gas-staging
```

---

## Bagian D: Pelaksanaan Smoke Test Staging

Setelah Web App aktif, jalankan 12 skenario pengujian sintesis mengacu pada `docs/STAGING_SMOKE_TEST_JST-007.md`:

| Skenario | Endpoint / URL Uji | Aksi Uji |
|---|---|---|
| **ST-01** | `.../exec?page=login` | Registrasi Jastiper Akun 1 (`user1_test@example.com`) |
| **ST-02** | `.../exec?page=login` | Login Jastiper Akun 1 & simpan token sesi |
| **ST-03** | `.../exec?page=dashboard` | Validasi muat dashboard Akun 1 & periksa shareCode |
| **ST-04** | `.../exec?page=dashboard` | Ubah profil (nama jastip & rekening bank) |
| **ST-05** | `.../exec?page=dashboard` | Ubah email aktif (`user1_baru@example.com`) & verifikasi logout otomatis |
| **ST-06** | `.../exec?shareCode=<CODE>` | Submit konfirmasi pembelian buyer dummy + file dummy (< 5MB) |
| **ST-07** | `.../exec?page=dashboard` | Login kembali & verifikasi pesanan baru muncul di dashboard |
| **ST-08** | `.../exec?page=login` | Registrasi Jastiper Akun 2 (`user2_test@example.com`) |
| **ST-09** | `.../exec?page=dashboard` | Verifikasi isolasi data (Akun 2 TIDAK DAPAT melihat pesanan Akun 1) |
| **ST-10** | `.../exec?page=login` | Trigger Rate Limit: lakukan salah password 11x berturut-turut |
| **ST-11** | `.../exec?page=login` | Trigger Signup Spam: daftar email baru 6x dalam 10 menit |
| **ST-12** | `.../exec?page=login` | Validasi format email invalid dan password < 8 karakter |

---

## Bagian E: Rollback & Cleanup Staging

Bila terjadi error saat staging:
1. Di editor GAS: Deploy -> Manage deployments -> Archive / Delete deployment aktif.
2. Di Google Drive: Kosongkan folder storage staging.
3. Di Google Sheets: Hapus baris data pengujian sintetis pada semua tab sheet.