# Prosedur Smoke Test Staging — Jastip Apps [JST-007]

Dokumen ini menjadi panduan pengujian alur utama Jastip Apps pada lingkungan staging terisolasi. Dokumen ini dirancang agar aman dijalankan secara manual atau terstruktur tanpa menyentuh data produksi atau kredensial nyata.

## 1. Prinsip dan Batasan Keamanan

1. **Lingkungan Terpisah:** Pengujian HANYA boleh dijalankan pada deployment GAS Web App staging, Spreadsheet staging terpisah, dan Folder Drive staging terpisah. DILARANG menggunakan ID Spreadsheet/Folder produksi.
2. **Data Sintetis:** Semua nama, email, nomor rekening, pesanan, dan bukti transfer WAJIB sintetis (contoh email: `jastiper.test1@example.com`, `buyer.test@example.com`).
3. **Audit Bukti:** Catatan hasil pengujian, screenshot, atau log DILARANG memuat token sesi plaintext, password, API key, URL deployment privat lengkap, atau data pribadi nyata.
4. **Izin Operasi:** Eksekusi runtime pengujian aktif memerlukan izin deployment dan konfigurasi staging terpisah. Jika konfigurasi staging belum tersedia, status eksekusi dicatat `BLOCKED`.

---

## 2. Prasyarat Lingkungan Staging

Sebelum memulai pengujian runtime:
- [ ] Panduan deployment staging telah disusun (`docs/DEPLOYMENT_STAGING_GAS_JST-011.md`).
- [ ] Deployment GAS staging terpisah tersedia (`https://script.google.com/.../exec`).
- [ ] Spreadsheet staging dibuat dan diinisialisasi melalui fungsi `setupApp()` (`Jastipers`, `Sessions`, `JastiperEmailHistory`, `Konfirmasi Jastip v4`).
- [ ] Folder Google Drive root staging dibuat untuk penampungan upload bukti transfer / foto.
- [ ] Script Properties / konstanta staging terkonfigurasi (`SPREADSHEET_ID`, `DRIVE_ROOT_FOLDER_ID`).
- [ ] 2 akun jastiper sintetis disiapkan:
  - Akun A: `jastiper.alpha@example.test`
  - Akun B: `jastiper.beta@example.test`

---

## 3. Matriks Skenario Smoke Test

| ID Kasus | Modul / Alur | Langkah dan Input | Hasil Harapan | Bukti Aman | Status Eksekusi |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ST-01** | Auth - Signup | Buka form signup; isi email baru, password valid, dan username sintetis; kirim | Akun tersimpan di `Jastipers`; respons sukses; password tidak tersimpan plaintext | Status respons dan jumlah baris sebelum/sesudah, tanpa nilai password | `BLOCKED` (butuh runtime) |
| **ST-02** | Auth - Rate Limit Signup | Kirim signup sintetis 6 kali dalam 10 menit | Request ke-6 ditolak dengan pesan generik batas percobaan | Nomor percobaan, waktu relatif, dan pesan generik | `BLOCKED` (butuh runtime) |
| **ST-03** | Auth - Login | Isi kredensial akun sintetis terdaftar; kirim | Sesi tersimpan sebagai hash di `JastiperSessions`; dashboard tampil | Status navigasi dan keberadaan baris sesi, tanpa token/hash | `BLOCKED` (butuh runtime) |
| **ST-04** | Auth - Rate Limit Login | Kirim password sintetis salah 11 kali dalam 10 menit | Percobaan ke-11 ditolak server-side dengan pesan generik | Nomor percobaan dan pesan generik, tanpa password | `BLOCKED` (butuh runtime) |
| **ST-05** | Dashboard - Profil | Login sebagai Akun A; ganti email ke `jastiper.alpha2@example.test`; kirim | Audit `APPLIED` tercatat; sesi lama dicabut; login ulang diminta | Status audit dan hasil penggunaan ulang sesi, tanpa ID/token | `BLOCKED` (butuh runtime) |
| **ST-06** | Konfirmasi - Submit dan upload | Isi form sintetis; pilih satu PNG sintetis di bawah batas ukuran; kirim | Konfirmasi tercatat; file berada di Drive staging; kode unik tampil | Status respons, jumlah baris/file, MIME, dan ukuran; tanpa URL/ID privat | `BLOCKED` (butuh runtime) |
| **ST-07** | Konfirmasi - Edit | Buka konfirmasi sintetis memakai kredensial akses valid; ubah satu field; kirim | Field sasaran berubah; field lain tetap | Nama field dan nilai sintetis sebelum/sesudah, tanpa kredensial akses | `BLOCKED` (butuh runtime) |
| **ST-08** | Isolasi Akun | Login sebagai Akun A; coba akses resource sintetis milik Akun B | Server menolak akses; data Akun B tidak tampil | Kode/pesan penolakan generik, tanpa data Akun B | `BLOCKED` (butuh runtime) |
| **ST-09** | Auth - Logout | Login; pilih Logout; coba ulang operasi dashboard dengan sesi lama | Sesi dicabut; login tampil; sesi lama ditolak | Status logout dan penolakan penggunaan ulang, tanpa token | `BLOCKED` (butuh runtime) |
| **ST-10** | Auth - Expiry | Gunakan sesi sintetis yang kedaluwarsa pada operasi dashboard | Server menolak operasi dan meminta login ulang | Kode/pesan generik dan waktu relatif kedaluwarsa, tanpa token | `BLOCKED` (butuh runtime) |
| **ST-11** | Validasi Input | Kirim signup dan konfirmasi dengan field wajib kosong atau format invalid | Server menolak input; tidak ada baris atau file baru | Nama field, kategori invalid, pesan generik, dan jumlah sebelum/sesudah | `BLOCKED` (butuh runtime) |
| **ST-12** | Auth - Sesi Invalid | Kirim operasi dashboard dengan token sintetis acak/tidak dikenal | Server menolak operasi; tidak ada data jastiper tampil | Kode/pesan generik, tanpa mencatat token | `BLOCKED` (butuh runtime) |

---

## 4. Prosedur Pencatatan Bukti Bersih

Saat eksekusi staging diaktifkan di kemudian hari:
1. Catat status tiap kasus: `LULUS`, `GAGAL`, atau `BLOCKED`.
2. Jika gagal, catat kode error atau gejala non-sensitif (contoh: `ST-05: Gagal update email, status audit FAILED (ERR_DUPLICATE)`).
3. Ajukan approval operasi staging terpisah untuk cleanup, lalu hapus hanya data sintetis dan file dummy yang dibuat oleh siklus uji ini. Jangan menghapus resource bersama atau data produksi.
4. Catat bukti dengan format: `ID kasus | waktu relatif | status | hasil ringkas | referensi bukti tersanitasi`.
