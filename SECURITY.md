# Kebijakan Keamanan — Jastip Apps

## Status

Project belum dinyatakan siap produksi. Audit auth, upload, permission, retensi data, dan konfigurasi GAS wajib selesai sebelum deployment produksi.

## Data sensitif

Data berikut tidak boleh masuk Git, issue publik, screenshot, log, atau data uji:

- password dan token sesi;
- edit token dan link edit buyer;
- ID Spreadsheet/Folder produksi;
- Script Properties;
- nama, alamat, nomor HP, email buyer;
- bukti transfer;
- foto barang produksi;
- export Google Sheets/Drive;
- URL Drive privat.

Gunakan data sintetis dan resource staging terpisah.

## Pelaporan kerentanan

Jangan membuka detail eksploitasi atau data terdampak pada kanal publik.

Laporan minimum:

- komponen dan versi/commit;
- dampak;
- langkah reproduksi memakai data sintetis;
- bukti yang sudah disamarkan;
- mitigasi sementara;
- apakah produksi diduga terdampak.

Hentikan pengujian jika berisiko mengubah, menghapus, atau mengekspos data. Eskalasi ke pemilik project melalui kanal privat yang disepakati organisasi.

## Security review dan eskalasi

Security review wajib menjadi bagian eksekusi Act Mode untuk:

- autentikasi, hashing, sesi, token, dan logout;
- akses lintas jastiper;
- share code dan edit link;
- upload dan akses file Drive;
- scope OAuth, manifest, permission, dan sharing;
- Script Properties dan konfigurasi privat;
- migrasi, retensi, export, atau penghapusan data;
- logging, telemetry, dan integrasi eksternal;
- deployment atau rollback.

Perubahan dalam scope plan dapat dilanjutkan tanpa approval keamanan tambahan jika kontrol, validasi, dan rollback dapat dibuktikan. Agen wajib berhenti dan meminta keputusan Master bila security review menemukan risiko yang tidak dapat dimitigasi dalam scope, perlu melemahkan kontrol, berdampak lintas tenant/fungsi, menyentuh data/resource produksi, atau memerlukan tindakan sulit dibalik.

## Baseline kontrol

### Input dan output

- Anggap semua payload browser, query string, nama file, MIME, URL, dan token tidak tepercaya.
- Validasi backend: tipe, panjang, format, allowlist, cardinality, dan hubungan kepemilikan.
- Client validation hanya untuk UX.
- Encode output berdasarkan konteks.
- Jangan masukkan data pengguna ke `innerHTML`; gunakan `textContent` atau encoding yang ditinjau.
- Pesan error publik tidak boleh membocorkan token, ID internal, konfigurasi, atau detail akun.

### Auth dan otorisasi

- Simpan token dalam bentuk hash di server.
- Token harus acak, dapat dicabut, memiliki masa berlaku, dan tidak dicatat di log.
- Setiap endpoint privat wajib memvalidasi sesi dan kepemilikan server-side.
- Perbandingan expiry memakai batas aman: kedaluwarsa saat `expiresAt <= now`.
- Login memerlukan mitigasi brute force/rate limiting sebelum produksi.
- Password hashing buatan sendiri saat ini harus dianggap risiko terbuka; jangan perluas penggunaannya tanpa keputusan keamanan.
- Jangan memakai share code sebagai autentikasi.
- Edit token memberi akses ke data buyer; perlakukan setara secret.

### Upload dan Drive

- Allowlist tipe gambar aktual, bukan hanya nilai MIME dari browser.
- Batasi ukuran decoded, jumlah file per order, dimensi, dan total payload.
- Tolak base64 rusak, ekstensi tidak cocok, nama berbahaya, dan format tidak dikenal.
- Buat nama file server-side.
- Verifikasi file lama dan URL Drive memang milik order serta folder jastiper.
- Terapkan permission least privilege; jangan membuat file publik tanpa kebutuhan dan approval.
- Jangan menampilkan URL Drive mentah jika proxy terotorisasi cukup.
- Tetapkan scanning atau moderasi file jika layanan menjadi publik luas.

### Sheets dan konsistensi data

- Verifikasi tenant pada setiap read/write.
- Gunakan lock untuk operasi uniqueness dan read-modify-write yang bersaing.
- Backup sebelum migrasi.
- Migrasi harus idempotent atau memiliki checkpoint dan rollback.
- Jangan mengubah header/skema produksi hanya karena halaman dibuka.
- Formula injection harus dinilai untuk nilai yang diawali `=`, `+`, `-`, atau `@` jika data diekspor/dibuka sebagai spreadsheet.

### GAS dan OAuth

- Simpan nilai privat di Script Properties.
- Gunakan scope OAuth minimum.
- Tinjau akun eksekusi dan siapa yang dapat mengakses Web App.
- Tinjau kebutuhan `XFrameOptionsMode.ALLOWALL`; nonaktifkan jika embed tidak dibutuhkan.
- Pisahkan project, Spreadsheet, Folder, dan property staging dari produksi.
- Jangan menjalankan `setupApp()` pada produksi tanpa backup dan approval.

### Logging dan audit

Boleh dicatat:

- timestamp;
- jenis event;
- ID korelasi nonrahasia;
- hasil umum;
- aktor internal yang sudah dipseudonimkan bila diperlukan.

Dilarang dicatat:

- password;
- token mentah atau hash token;
- alamat lengkap;
- nomor HP/email utuh;
- bukti transfer;
- payload base64;
- Script Properties;
- URL edit privat.

## Respons insiden

1. Hentikan deployment dan perubahan terkait.
2. Jangan menghapus bukti atau rewrite histori.
3. Batasi akses resource terdampak.
4. Cabut token/permission yang terpapar.
5. Simpan bukti minimum pada lokasi privat.
6. Nilai data dan tenant terdampak.
7. Pulihkan dari versi/backup terverifikasi.
8. Dokumentasikan akar masalah dan tindakan pencegahan tanpa memasukkan data sensitif.
9. Deployment pemulihan memerlukan konfirmasi khusus lingkungan/Master.

## Retensi

Kebijakan final belum ditetapkan. Sebelum produksi, pemilik project wajib menentukan:

- tujuan pengumpulan setiap field;
- masa simpan order, foto, dan bukti transfer;
- proses koreksi dan penghapusan;
- backup retention;
- siapa yang berwenang;
- audit trail;
- kewajiban hukum lokal.

Sampai kebijakan tersedia, jangan memakai data produksi.

## Checklist release keamanan

- [ ] Tidak ada secret/data pribadi baru dalam diff.
- [ ] Endpoint privat memiliki autentikasi dan otorisasi server-side.
- [ ] Input dan upload memiliki validasi backend.
- [ ] Scope OAuth dan permission tidak melebar tanpa approval.
- [ ] Test isolasi antarjastiper lulus pada staging.
- [ ] Token invalid/kedaluwarsa/tercabut diuji.
- [ ] Backup dan rollback tersedia.
- [ ] Logging sudah disamarkan.
- [ ] Retensi data disetujui.
- [ ] Security review dan approval deployment tercatat.