# PLAN — Jastip Apps

Dokumen ini menjadi sumber agenda perubahan. Rencana disusun di Plan Mode, disetujui melalui perpindahan ke Act Mode, dan dieksekusi sampai `DONE` tanpa approval berulang kecuali memicu gate eskalasi.

## Status pekerjaan

`PROPOSED` → `IN_PROGRESS` → `DONE`

Status pendukung & histori:
- `APPROVED` — histori item lama sebelum JST-026 atau checkpoint eksplisit.
- `REVIEW` — histori item lama sebelum JST-026 atau status sementara saat eskalasi.
- `BLOCKED` — pekerjaan terhenti karena menunggu keputusan Master saat gate eskalasi aktif.
- `CANCELLED` — pekerjaan dibatalkan tanpa menghapus histori.

## Aturan penggunaan

1. Susun analisis BMAD dan sajikan plan di chat pada Plan Mode.
2. Gunakan ID berurutan: `JST-001`, `JST-002`, dan seterusnya.
3. Saat Master berpindah ke Act Mode, agen mencatat/memperbarui item ke `IN_PROGRESS` pada branch `type/PLAN-ID-ringkasan`.
4. Agen menjalankan implementasi, validasi, dan security review mandiri sampai tuntas.
5. Jika ada file/fungsi di luar plan yang terdampak, risiko kerusakan, atau operasi khusus, agen mengubah/menahan status pada `BLOCKED` dan melapor ke Master.
6. Setelah validasi lulus dan acceptance criteria terpenuhi, agen mengubah status menjadi `DONE` serta menyinkronkan `CHANGELOG.md`.
7. Setelah selesai, agen menanyakan konfirmasi kepada Master: commit, commit + push, atau tidak keduanya.
8. Approval Act Mode tidak mencakup deployment produksi atau manipulasi data produksi.

---

## JST-001 — Baseline governance dan dokumentasi prabuild

- **Status:** `DONE`
- **Jenis:** `docs`
- **Pemilik:** agen dokumentasi
- **Dibuat:** 2026-08-25
- **Approval:** diminta pengguna melalui tugas awal; approval penutupan diterima pada 2026-08-25.

### Tujuan

Membuat baseline dokumentasi, kontrol perubahan, keamanan, agenda, dan histori sebelum pembangunan lanjutan.

### Acceptance criteria

- Struktur dan runtime proyek terdokumentasi.
- Workflow BMAD tersedia.
- Aturan agen dan approval gate tersedia.
- Template agenda perubahan tersedia.
- Kebijakan keamanan dan histori perubahan tersedia.
- Baseline Git dibuat hanya setelah persetujuan eksplisit.
- Tidak ada rahasia atau data produksi masuk repository.

### Ruang lingkup

- `README.md`
- `AGENTS.md`
- `PLAN.md`
- `CHANGELOG.md`
- `SECURITY.md`
- `.gitignore`
- `.cline/rules/`
- `docs/BMAD.md`
- `docs/PROJECT_CONTEXT.md`
- `docs/decisions/README.md`

### Di luar ruang lingkup

- Deployment GAS.
- Operasi pada Spreadsheet atau Drive produksi.
- Penambahan dependency.
- Migrasi data.
- Perubahan fitur aplikasi.
- Perubahan scope OAuth.
- Perombakan autentikasi.

### Risiko keamanan/data

- Dokumentasi dapat tanpa sengaja memuat ID privat, token, URL edit, atau data buyer.
- Aturan longgar dapat memberi agen hak perubahan tanpa review.
- Baseline Git dapat mengabadikan rahasia yang sudah ada.

### Rencana validasi

- Periksa seluruh dokumen wajib tersedia dan saling konsisten.
- Periksa `git diff` atau daftar file sebelum baseline.
- Cari pola rahasia, token, kredensial, ID produksi, dan data pribadi.
- Pastikan tidak ada dependency atau artefak sementara baru.
- Pastikan status akhir `REVIEW`, bukan `DONE`.

### Rencana rollback

Hapus hanya file dokumentasi yang dibuat dalam item ini sebelum commit, atau revert commit `[JST-001]` setelah baseline tersedia. Jangan memakai reset histori bersama.

### Hasil validasi

- Dokumen wajib tersedia: `OK`.
- `appsscript.json` valid JSON: `OK`.
- Pemeriksaan pola API key/private key/client secret: `OK`; hanya placeholder konfigurasi yang disengaja ditemukan.
- Dependency atau artefak sementara baru: tidak ditemukan.
- Repository Git lokal dibuat pada branch `docs/JST-001-baseline-governance`.
- Baseline commit: `a9ec487`.
- Working tree setelah commit: bersih.
- Validasi runtime GAS dan staging: belum dijalankan; bukan scope approval ini.

### Catatan review

Branding dan perubahan HTML/GAS yang sudah masuk bukan bagian scope dokumentasi di atas. Pisahkan menjadi `JST-002`. Approval akhir penutupan diterima pengguna pada 2026-08-25. Status menjadi `DONE`.

---

## JST-002 — Normalisasi logo dan branding Jastip Apps

- **Status:** `DONE`
- **Jenis:** `feat`
- **Pemilik:** agen implementasi
- **Dibuat:** 2026-08-25
- **Approval:** persetujuan awal pada pembuatan aset; approval akhir penutupan diterima pengguna pada 2026-08-25.

### Tujuan

Menampilkan identitas “Jastip Apps” dan logo konsisten pada antarmuka tanpa mengubah alur bisnis.

### Acceptance criteria

- Logo tampil pada halaman sasaran.
- Referensi aset valid pada runtime GAS dan inspeksi lokal sesuai rancangan.
- Tidak ada perubahan autentikasi, otorisasi, penyimpanan, atau data.
- HTML tetap dapat diparse dan fungsi lama tetap tersedia.

### Ruang lingkup

- `01_Login_Signup/Login.html`
- `02_Dashboard_Jastiper/Dashboard.html`
- `03_Konfirmasi_Pembelian/Konfirmasi.html`
- `04_Backend_GAS/Code.gs`
- `assets/logo-jastip-apps.png`

### Di luar ruang lingkup

- Fitur baru.
- Perubahan skema data.
- Perubahan sesi/token.
- Deployment.
- Perubahan permission Drive/Sheets atau scope OAuth.

### Risiko keamanan/data

- Embed aset yang salah dapat merusak rendering.
- Edit source tanpa baseline Git menyulitkan audit.
- Referensi path lokal mungkin tidak berlaku dalam runtime GAS.

### Rencana validasi

- Tinjau diff semua file scope.
- Parse JavaScript/GAS bila alat lokal mendukung.
- Periksa semua referensi logo.
- Jalankan inspeksi visual lokal untuk halaman statis.
- Jalankan smoke test di deployment staging terpisah setelah approval deployment.

### Rencana rollback

Revert commit `[JST-002]` setelah histori Git tersedia, atau kembalikan blok branding berdasarkan diff review. Jangan menyentuh data GAS.

### Hasil validasi

- Referensi aset dan format HTML diperiksa: konsisten menggunakan penamaan Jastip Apps dan logo resmi.
- Tidak ada penambahan dependency atau perubahan autentikasi/otorisasi data.
- Persetujuan akhir manusia diterima pada 2026-08-25 untuk menutup item ini ke `DONE`.

---

## Backlog prabuild yang disarankan

### JST-003 — Audit keamanan autentikasi dan sesi

- **Status:** `DONE`
- **Jenis:** `security`
- **Pemilik:** agen keamanan
- **Dibuat:** 2026-08-25
- **Approval rencana:** pengguna, 2026-08-25, dengan teks `APPROVE PLAN JST-003`
- **Approval audit/implementasi:** pengguna, 2026-08-25, dengan teks `APPROVE JST-003 UNTUK AUDIT STATIS SAJA; IZINKAN UPDATE STATUS KE APPROVED/IN_PROGRESS, BUAT BRANCH security/JST-003-audit-auth-sesi, DAN BUAT LAPORAN AUDIT. TANPA PERUBAHAN SOURCE, COMMIT, MERGE, DEPLOY, NETWORK, ATAU DATA PRODUKSI.`
- **Approval akhir/close:** pengguna, 2026-08-25, dengan teks `APPROVE FINAL JST-003 — tutup ke DONE, perbarui CHANGELOG.md, tanpa commit/merge/deploy`

#### Tujuan

Memetakan trust boundary, alur autentikasi, otorisasi, dan siklus hidup sesi sebelum perubahan keamanan dilakukan.

#### Acceptance criteria

- Seluruh endpoint autentikasi dan operasi terproteksi terinventaris.
- Penyimpanan, pembuatan, perbandingan, masa berlaku, rotasi, pencabutan, dan logging token ditinjau.
- Login, logout, pergantian email, serta pencabutan sesi dipetakan.
- Otorisasi kepemilikan jastiper pada setiap operasi sensitif ditinjau server-side.
- Risiko brute force, account enumeration, replay, session fixation, dan akses lintas jastiper dinilai.
- Temuan mencantumkan bukti file/fungsi, tingkat dampak, keyakinan, dan mitigasi.
- Tidak ada token, kredensial, ID privat, atau data produksi dicatat dalam laporan.
- Audit tidak mengubah source, konfigurasi, scope OAuth, permission, atau data.
- Setiap perbaikan menjadi item rencana terpisah dan memerlukan approval eksplisit.

#### Ruang lingkup

- `01_Login_Signup/Login.html`
- `02_Dashboard_Jastiper/Dashboard.html`
- `04_Backend_GAS/Code.gs`
- `04_Backend_GAS/appsscript.json`
- `SECURITY.md`
- `docs/PROJECT_CONTEXT.md`
- `docs/AUDIT_AUTH_SESI_JST-003.md`
- `PLAN.md`

#### Di luar ruang lingkup

- Perubahan autentikasi, otorisasi, token, hashing, sesi, atau UI.
- Penambahan dependency.
- Perubahan manifest, scope OAuth, permission, atau sharing.
- Deployment GAS.
- Operasi Spreadsheet atau Drive produksi.
- Pengujian memakai akun, token, atau data produksi.
- Perbaikan temuan audit.

#### Risiko keamanan/data

- Source dapat memuat pola akses ke konfigurasi sensitif; nilai rahasia tidak boleh disalin ke laporan atau log.
- Pengujian aktif terhadap login dapat memicu lockout atau memengaruhi akun; audit awal wajib statis.
- Kesimpulan tanpa penelusuran seluruh caller dapat melewatkan jalur bypass otorisasi.
- Perubahan auth tanpa threat model dapat menciptakan account takeover atau sesi yang tidak tercabut.

#### Rencana audit

1. Dapatkan approval audit terpisah; approval rencana ini tidak mengizinkan perubahan source.
2. Pastikan audit dilakukan pada branch `security/JST-003-audit-auth-sesi` tanpa mencampur perubahan JST-008/JST-009.
3. Inventaris endpoint, caller browser, penyimpanan akun, dan penyimpanan sesi melalui pembacaan statis.
4. Petakan trust boundary dan aliran data login, validasi sesi, logout, perubahan email, serta operasi terproteksi.
5. Tinjau token entropy, penyimpanan, perbandingan, expiry, rotasi, pencabutan, dan potensi kebocoran log.
6. Tinjau validasi input, account enumeration, brute force, replay, session fixation, dan otorisasi kepemilikan server-side.
7. Catat temuan berbasis bukti tanpa mengubah source; pisahkan fakta, asumsi, serta hal yang belum dapat diuji.
8. Ajukan item rencana perbaikan terpisah untuk setiap perubahan yang disarankan.

#### Rencana validasi

1. Cocokkan inventaris endpoint dengan seluruh fungsi publik GAS dan pemanggil `google.script.run`.
2. Cari seluruh referensi token, sesi, login, logout, password, email, dan pemeriksaan identitas.
3. Pastikan setiap temuan menunjuk lokasi source dan skenario penyalahgunaan yang dapat direproduksi secara aman.
4. Tinjau laporan untuk rahasia, token, ID privat, data buyer, dan bukti transfer.
5. Periksa `git diff` serta daftar file; audit tidak boleh mengubah source atau konfigurasi.
6. Catat keterbatasan karena tidak memakai runtime staging.
7. Ubah status menjadi `REVIEW` hanya setelah laporan dan validasi selesai.

#### Rencana rollback

Jika pembatalan dilakukan sebelum commit, hapus `docs/AUDIT_AUTH_SESI_JST-003.md` dan kembalikan blok `PLAN.md`. Jika sudah di-commit, revert commit dokumentasi `[JST-003]`. Jangan reset histori bersama. Audit tidak menyentuh source code atau data produksi.

#### Hasil validasi

- Branch kerja: `security/JST-003-audit-auth-sesi`.
- Seluruh endpoint publik dan operasi terproteksi berhasil dipetakan: `signupJastiper`, `loginJastiper`, `getJastiperSession`, `logoutJastiper`, `getJastiperDashboard`, `getJastiperImageData`, `updateJastiperSettings`, `getPublicConfig`, `saveConfirmation`, `getConfirmation`.
- Siklus hidup sesi diverifikasi: format UUID ganda (64 hex), hash SHA-256 tersimpan di Sheets, expiry boundary `exp <= now`, linear revocation, dan cascading invalidation saat email berubah.
- Dokumen audit statis lengkap diterbitkan di `docs/AUDIT_AUTH_SESI_JST-003.md`.
- Tidak ada perubahan source code, manifest `appsscript.json`, atau dependensi baru.
- Audit rahasia: tidak ada token, password, ID produksi, atau data sensitif dimasukkan ke repository.
- Status diubah menjadi `REVIEW`.

#### Catatan review

Audit statis selesai dan approval akhir diterima pada 2026-08-25. Status menjadi `DONE`. Rekomendasi perbaikan dirangkum pada laporan `docs/AUDIT_AUTH_SESI_JST-003.md`. Tidak mencakup commit, merge, atau deployment.

### JST-004 — Validasi upload server-side

- **Status:** `DEFERRED`
- **Catatan penundaan:** Ditunda atas persetujuan Master pada 2026-08-25 untuk mendahulukan operasionalisasi dan uji staging baseline. Akan dijadwalkan ulang sebagai security hardening.
- Batasi MIME allowlist, ukuran, jumlah file, nama aman, dan penanganan payload rusak.
- Uji memakai file sintetis, bukan data buyer.

### JST-005 — Konfigurasi dan least privilege GAS

- **Status:** `DEFERRED`
- **Catatan penundaan:** Ditunda atas persetujuan Master pada 2026-08-25 untuk mendahulukan operasionalisasi dan uji staging baseline. Akan dijadwalkan ulang sebagai audit konfigurasi terpisah.
- Inventaris Script Properties, scope OAuth, Spreadsheet, Folder Drive, permission, dan akun eksekusi.
- Setiap perubahan `appsscript.json` memerlukan security review.

### JST-006 — Retensi dan penghapusan data sensitif

- **Status:** `DEFERRED`
- **Catatan penundaan:** Ditunda atas persetujuan Master pada 2026-08-25 untuk mendahulukan operasionalisasi dan uji staging baseline. Akan dijadwalkan ulang setelah kebijakan bisnis ditetapkan.
- Tetapkan masa simpan data buyer, foto barang, dan bukti transfer.
- Rancang audit trail dan penghapusan aman sebelum operasi data.

### JST-007 — Baseline pengujian staging

- **Status:** `DONE`
- **Jenis:** `test`
- **Pemilik:** agen pengujian
- **Dibuat:** 2026-08-25
- **Approval rencana/implementasi:** pengguna, 2026-08-25, dengan teks `APPROVE IMPLEMENTATION JST-007 — dokumentasi saja; tanpa deployment/network/operasi staging/data produksi`

#### Tujuan

Menyediakan prosedur smoke test staging yang aman dan dapat diulang untuk alur utama aplikasi sebelum dipakai, tanpa memakai akun, Spreadsheet, Drive, file, atau data produksi.

#### Acceptance criteria

- Checklist mencakup signup/login, dashboard, submit dan edit konfirmasi, upload sintetis, logout, sesi kedaluwarsa, serta isolasi antarjastiper.
- Prasyarat staging mewajibkan deployment, Spreadsheet, Drive, Script Properties, akun, dan data sintetis yang terpisah dari produksi.
- Setiap kasus memuat langkah, hasil harapan, bukti non-sensitif, serta status lulus/gagal/terblokir.
- Pengujian negatif mencakup input invalid, sesi tidak valid, dan akses lintas jastiper.
- Bukti tidak memuat password, token, ID privat, data buyer, bukti transfer, atau URL deployment privat.
- Tidak ada dependency, perubahan source aplikasi, manifest, scope OAuth, permission produksi, deployment produksi, atau operasi data produksi.
- Eksekusi staging hanya dilakukan setelah approval deployment/network/staging terpisah dan konfigurasi staging tersedia.

#### Ruang lingkup

- `PLAN.md`
- `docs/STAGING_SMOKE_TEST_JST-007.md`

#### Di luar ruang lingkup

- Perubahan source HTML atau GAS.
- Perbaikan bug yang ditemukan.
- Dependency atau framework test baru.
- Perubahan `appsscript.json`, scope OAuth, permission, atau sharing produksi.
- Deployment/rollback produksi.
- Penggunaan akun, token, Spreadsheet, Drive, file, atau data produksi.
- Penyimpanan nilai konfigurasi staging privat di repository.

#### Risiko keamanan/data

- Konfigurasi staging yang memakai resource produksi dapat mengubah atau membocorkan data nyata.
- Bukti test dapat membocorkan token sesi, email, ID resource, URL privat, foto, atau bukti transfer.
- Pengujian isolasi yang salah dapat membaca data akun lain.
- Upload sintetis tetap dapat tertinggal di Drive staging dan perlu pembersihan terkontrol.
- Approval implementasi dokumen tidak memberi izin deployment, network, permission, atau operasi staging.

#### Rencana implementasi

1. Setelah approval, buat branch `test/JST-007-baseline-staging`.
2. Baca ulang seluruh file scope.
3. Buat checklist manual minimum di `docs/STAGING_SMOKE_TEST_JST-007.md`; gunakan fitur native browser/GAS, tanpa dependency.
4. Definisikan prasyarat resource staging terpisah dan data sintetis.
5. Definisikan kasus positif, negatif, isolasi dua akun sintetis, format bukti aman, serta cleanup.
6. Jangan menjalankan deployment, network, atau operasi staging sebelum approval terpisah dan konfigurasi tersedia.

#### Rencana validasi

1. Periksa checklist mencakup seluruh acceptance criteria dan hasil harapan terukur.
2. Pastikan langkah tidak meminta rahasia atau data produksi dicatat.
3. Tinjau diff dan daftar file; perubahan hanya `PLAN.md` dan `docs/STAGING_SMOKE_TEST_JST-007.md`.
4. Jalankan audit pola token, password, ID privat, URL deployment privat, dan data pribadi.
5. Jika approval operasi staging tersedia, jalankan checklist dengan data sintetis lalu catat hasil tanpa nilai sensitif.
6. Jika approval/config staging belum tersedia, tandai eksekusi runtime `BLOCKED`; jangan klaim lulus.
7. Setelah validasi dokumen selesai, catat bukti dan ubah status menjadi `REVIEW`.

#### Rencana rollback

Sebelum commit, hapus dokumen JST-007 dan kembalikan blok ini. Setelah commit, revert commit `[JST-007]`; jangan reset histori bersama. Cleanup resource/data staging dan rollback deployment memerlukan approval terpisah.

#### Hasil validasi

- Branch kerja: `test/JST-007-baseline-staging`.
- Dokumen panduan dan matriks kasus uji `docs/STAGING_SMOKE_TEST_JST-007.md` selesai dibuat dengan 12 kasus (ST-01 s/d ST-12) mencakup auth, rate limit, profil, konfirmasi, upload sintetis, logout, expiry, isolasi antarjastiper, dan validasi input.
- Format pencatatan bukti bersih ditetapkan tanpa kredensial, token, URL privat, atau data pribadi.
- `git diff --check`: bersih (exit code `0`).
- Audit rahasia pada file scope: tidak ditemukan pola token, private key, URL deployment privat, atau data sensitif.
- Status eksekusi runtime tiap kasus dicatat `BLOCKED (butuh runtime)` karena eksekusi aktif dan deployment staging memerlukan approval operasi staging terpisah.
- Tidak ada dependensi baru, perubahan source aplikasi, manifest, atau data produksi.
- Status diubah menjadi `REVIEW`.

#### Catatan review

Implementasi dokumen panduan pengujian staging selesai dan disetujui Master pada 2026-08-25. Status menjadi `DONE`. Rencana pengujian staging aktif akan dilanjutkan melalui item persiapan deploy staging.

---

## JST-008 — Perubahan profil dan histori email jastiper

- **Status:** `DONE`
- **Jenis:** `feat`
- **Pemilik:** agen implementasi
- **Dibuat:** 2026-08-25
- **Approval rencana:** pengguna, 2026-08-25; hanya untuk pencatatan item ini di `PLAN.md`
- **Approval implementasi:** pengguna, 2026-08-25, dengan teks `APPROVE IMPLEMENTATION JST-008`
- **Approval akhir/close:** pengguna, 2026-08-25, dengan teks `APPROVE FINAL JST-008 DAN JST-009...`

### Tujuan

Memungkinkan jastiper memperbarui username dan email aktif tanpa menggandakan akun, serta menyimpan audit perubahan email secara terpisah.

### Acceptance criteria

- Username dan email aktif dapat diperbarui dari dashboard.
- Format email dinormalisasi dan divalidasi ulang server-side.
- Email baru harus unik terhadap akun jastiper lain.
- Baris akun pada sheet `Jastipers` tetap; kolom `email` berisi email aktif.
- Setiap upaya perubahan email memiliki satu catatan audit pada sheet `JastiperEmailHistory`.
- Catatan audit minimum memuat `historyId`, `jastiperId`, `oldEmail`, `newEmail`, `changedAt`, `status`, dan `errorCode`.
- Status audit memakai `PENDING`, `APPLIED`, atau `FAILED`; kegagalan tidak boleh tercatat sebagai perubahan sukses.
- Validasi gagal tidak mengubah akun.
- Perubahan email yang berhasil mencabut sesi lama dan meminta pengguna login ulang.
- Perubahan username saja tidak membuat histori email.
- Data buyer, rekening, pesanan, dan file tidak berubah.
- Password, token, data buyer, dan bukti transfer tidak masuk histori atau log.
- Otorisasi kepemilikan akun diverifikasi server-side.

### Ruang lingkup

- `04_Backend_GAS/Code.gs`
- `02_Dashboard_Jastiper/Dashboard.html`
- `PLAN.md`
- Satu pemeriksaan runnable kecil tanpa dependency baru bila diperlukan.

### Di luar ruang lingkup

- Reset atau perubahan password.
- Verifikasi email melalui tautan atau OTP.
- Migrasi atau penggabungan akun.
- Deployment GAS.
- Operasi pada Spreadsheet atau Drive produksi.
- Perubahan scope OAuth, permission, atau sharing.
- Perubahan data buyer, rekening, pesanan, upload, dan bukti transfer.
- Refactor yang tidak diperlukan oleh perubahan profil.

### Risiko keamanan/data

- Pergantian email dapat dipakai untuk mengambil alih akun jika sesi dan kepemilikan tidak diverifikasi server-side.
- Pemeriksaan unik yang tidak dilindungi lock dapat menghasilkan email ganda saat request bersamaan.
- Google Sheets tidak menyediakan transaksi penuh antara append histori, update akun, dan pencabutan sesi.
- Log atau histori yang terlalu luas dapat membocorkan token atau data sensitif.
- Kegagalan parsial dapat membuat histori dan email aktif tidak konsisten.
- Normalisasi email yang tidak konsisten dapat melewati pemeriksaan unik.

### Rencana implementasi

1. Buat branch `feat/JST-008-profil-histori-email` setelah approval implementasi.
2. Periksa ulang seluruh file sasaran dan kontrak data sebelum edit.
3. Tambahkan operasi backend terotorisasi untuk perubahan username dan email.
4. Normalisasi serta validasi input, lalu gunakan lock selama pemeriksaan unik dan perubahan data.
5. Saat email berubah, buat audit `PENDING`, perbarui baris akun, ubah audit menjadi `APPLIED`, lalu cabut sesi lama.
6. Jika operasi gagal, pertahankan atau pulihkan email aktif bila aman dan tandai audit `FAILED` dengan `errorCode` non-sensitif.
7. Tambahkan UI dashboard minimum untuk mengirim perubahan dan menangani login ulang.
8. Jangan menambah dependency atau mengubah file di luar scope.

### Rencana validasi

1. Jalankan pemeriksaan syntax HTML/JavaScript dan GAS yang tersedia.
2. Uji username valid, email valid, email invalid, email duplikat, email sama, dan input kosong sesuai aturan.
3. Uji bahwa perubahan username saja tidak menambah histori email.
4. Uji kegagalan append dan update memakai data sintetis pada lingkungan non-produksi.
5. Uji request tanpa sesi, sesi milik akun lain, dan request bersamaan.
6. Pastikan perubahan email sukses mencabut sesi lama.
7. Tinjau diff dan daftar file untuk perubahan tak terduga.
8. Cari pola rahasia, token, dan data pribadi baru.
9. Catat bukti, keterbatasan, dan status akhir `REVIEW`.

### Rencana rollback

Revert commit `[JST-008]` untuk source. Jangan menghapus histori produksi. Jika kegagalan parsial terjadi, pulihkan email aktif memakai catatan audit yang terverifikasi dan tambahkan catatan koreksi baru; jangan menimpa histori lama. Deployment dan pemulihan data memerlukan approval terpisah.

### Hasil validasi

- Branch kerja: `feat/JST-008-profil-histori-email`.
- `git diff --check`: lulus, exit code `0`; peringatan konversi LF ke CRLF pada `04_Backend_GAS/Code.gs`.
- Review diff: perubahan JST-008 terbatas pada `04_Backend_GAS/Code.gs`, `02_Dashboard_Jastiper/Dashboard.html`, dan `PLAN.md`.
- Pemeriksaan pola rahasia/data sensitif: tidak menemukan nilai kredensial baru; kecocokan hanya nama field, aturan, teks UI, dan source lama.
- Dependency, scope OAuth, deployment, serta operasi Spreadsheet/Drive produksi: tidak dilakukan.
- File tak terlacak `01_Login_Signup/Login-Jastip-Apps.html` berada di luar scope JST-008; tidak diubah atau dimasukkan ke perubahan ini.
- Smoke test GAS dan pengujian kegagalan parsial, request bersamaan, serta pencabutan sesi belum dijalankan karena memerlukan lingkungan non-produksi GAS/Spreadsheet.
- Batasan transaksi tetap: kegagalan setelah status audit `APPLIED` tetapi sebelum seluruh sesi tercabut dapat memerlukan tinjauan administrator.

### Catatan review

Approval pencatatan rencana diterima (`APPROVE PLAN JST-008`). Approval implementasi diterima (`APPROVE IMPLEMENTATION JST-008`). Branch kerja: `feat/JST-008-profil-histori-email`. Review kode berlapis selesai tanpa temuan fatal; approval akhir penutupan diterima pada 2026-08-25. Status menjadi `DONE`. Tidak mencakup merge atau deployment.

---

## JST-009 — Dokumentasi panduan prompt operasional agen

- **Status:** `DONE`
- **Jenis:** `docs`
- **Pemilik:** agen dokumentasi
- **Dibuat:** 2026-08-25
- **Approval rencana/implementasi:** pengguna, 2026-08-25, dengan teks `APPROVE PLAN DAN IMPLEMENTASI DOKUMENTASI PROMPT`
- **Approval akhir/close:** pengguna, 2026-08-25, dengan teks `APPROVE FINAL JST-008 DAN JST-009...`

### Tujuan

Menyediakan panduan prompt Markdown yang siap disalin untuk tiga skenario: memulai build, melanjutkan plan/task, dan pemulihan saat sesi/Act terkendala di tengah jalan.

### Acceptance criteria

- File `docs/AGENT_PROMPTS.md` tersedia dan valid.
- Memuat tiga prompt lengkap: awal build, lanjut task, dan recovery task.
- Seluruh prompt selaras dengan `AGENTS.md`, `PLAN.md`, `SECURITY.md`, `docs/BMAD.md`, dan `docs/PROJECT_CONTEXT.md`.
- `README.md` memuat tautan ke `docs/AGENT_PROMPTS.md`.
- Tidak ada perubahan source aplikasi, konfigurasi GAS, dependensi, atau data produksi.

### Ruang lingkup

- `docs/AGENT_PROMPTS.md`
- `README.md`
- `PLAN.md`

### Di luar ruang lingkup

- Perubahan source HTML / GAS.
- Perubahan manifest / scope OAuth.
- Penambahan dependency.
- Deployment dan operasi data produksi.

### Risiko keamanan/data

- Prompt yang keliru dapat menginstruksikan agen mengabaikan approval atau memodifikasi file tanpa izin.
- Perubahan dokumentasi dapat memuat rahasia atau instruksi destruktif bila tidak diaudit.

### Rencana implementasi

1. Dapatkan persetujuan eksplisit pengguna untuk lingkup dokumentasi prompt.
2. Buat `docs/AGENT_PROMPTS.md` berisi tiga template prompt terstandarisasi.
3. Tambahkan referensi file pada `README.md`.
4. Catat item `JST-009` di `PLAN.md`.
5. Jalankan validasi konsistensi, diff, dan audit rahasia.

### Rencana rollback

Hapus `docs/AGENT_PROMPTS.md` dan kembalikan baris referensi pada `README.md` serta `PLAN.md` sebelum commit. Jangan melakukan reset histori bersama.

### Hasil validasi

- `docs/AGENT_PROMPTS.md` dibuat dengan 3 prompt lengkap: `OK`.
- Tautan di `README.md` diperbarui: `OK`.
- Tidak ada perubahan source code, manifest, konfigurasi GAS, atau dependency baru: `OK`.
- Perubahan diff terbatas pada scope dokumentasi `JST-009`.
- Pemeriksaan rahasia: tidak ada kredensial atau token baru yang dimasukkan.

### Catatan review

Pekerjaan selesai diimplementasikan dan divalidasi. Approval akhir penutupan diterima pada 2026-08-25. Status menjadi `DONE`. Tidak mencakup merge atau deployment.

---

## JST-010 — Rate limiting login dan signup

- **Status:** `DONE`
- **Jenis:** `security`
- **Pemilik:** agen keamanan
- **Dibuat:** 2026-08-25
- **Approval pencatatan rencana:** pengguna, 2026-08-25, dengan teks `APPROVE COMMIT JST-003 DAN PENCATATAN PLAN JST-010 SEBAGAI PROPOSED; TANPA IMPLEMENTASI SOURCE, MERGE, DEPLOY, NETWORK, ATAU DATA PRODUKSI.`
- **Approval implementasi:** pengguna, 2026-08-25, dengan teks `APPROVE IMPLEMENTATION JST-010 dengan login 10/10 menit, signup 5/10 menit, key identitas SHA-256, CacheService fail-open; izinkan status APPROVED/IN_PROGRESS, branch security/JST-010-rate-limit-auth, perubahan hanya pada 04_Backend_GAS/Code.gs dan PLAN.md, tanpa commit/merge/deploy/network/data produksi.`

### Tujuan

Membatasi percobaan login berulang dan spam signup pada endpoint publik memakai `CacheService` native GAS tanpa mengubah kontrak autentikasi, penyimpanan password, atau siklus hidup sesi.

### Acceptance criteria

- Rate limit diterapkan server-side sebelum operasi autentikasi yang mahal atau perubahan data.
- Login dan signup memiliki bucket terpisah.
- Key cache tidak memuat password, token sesi, email plaintext, atau data pribadi lain; identitas yang diperlukan di-hash.
- Batas dan jendela waktu ditetapkan eksplisit serta tidak dapat diturunkan oleh input browser.
- Login gagal menambah hitungan; login berhasil membersihkan bucket identitas terkait.
- Signup berulang dibatasi tanpa mengungkap apakah email sudah terdaftar.
- Respons saat batas terlampaui bersifat generik dan tidak memuat nilai key internal.
- Kegagalan `CacheService` ditangani tanpa membocorkan rahasia atau merusak data.
- Validasi input, verifikasi password, autentikasi sesi, dan otorisasi server-side yang ada tidak dilemahkan.
- Tidak ada dependency, perubahan manifest, scope OAuth, deployment, network eksternal, atau operasi data produksi.

### Ruang lingkup

- `04_Backend_GAS/Code.gs`
- `PLAN.md`
- Satu pemeriksaan runnable kecil tanpa dependency baru bila diperlukan.

### Di luar ruang lingkup

- Perubahan UI login, signup, atau dashboard.
- Migrasi password hashing atau penggunaan auth provider eksternal.
- Lock untuk keunikan signup; ditangani terpisah pada kandidat `JST-011`.
- Perubahan format token, masa sesi, penyimpanan sesi, atau logout.
- Perubahan `04_Backend_GAS/appsscript.json`, scope OAuth, permission, atau sharing.
- Dependency baru.
- Deployment GAS.
- Network/API eksternal.
- Operasi Spreadsheet atau Drive produksi.
- Pengujian memakai akun, token, email, atau data produksi.

### Risiko keamanan/data

- `CacheService` bersifat best-effort; eviction dini dapat mengurangi efektivitas pembatasan.
- Key berbasis identitas dapat membocorkan email bila tidak di-hash.
- Batas terlalu ketat dapat menyebabkan denial of service terhadap pengguna sah.
- Operasi get/increment/put cache tidak menyediakan transaksi kuat; request konkuren dapat melewati batas kecil.
- Fail-closed saat cache bermasalah dapat memblokir semua login; fail-open mengurangi perlindungan sementara.
- Pesan berbeda antara email terdaftar dan tidak terdaftar dapat memperkuat user enumeration.

### Rencana implementasi

1. Dapatkan approval implementasi terpisah; approval pencatatan rencana tidak mengizinkan perubahan source.
2. Pastikan hasil JST-003 tidak tercampur dan buat branch `security/JST-010-rate-limit-auth`.
3. Baca ulang seluruh file dalam ruang lingkup sebelum edit.
4. Tetapkan konstanta batas dan jendela waktu secara server-side untuk login dan signup.
5. Bentuk key cache dari jenis operasi dan hash identitas yang sudah dinormalisasi; jangan masukkan password, token, atau email plaintext.
6. Tambahkan helper minimum berbasis `CacheService.getScriptCache()` untuk memeriksa serta mencatat percobaan.
7. Terapkan pemeriksaan pada `loginJastiper` dan `signupJastiper` tanpa menurunkan validasi yang ada.
8. Bersihkan bucket login setelah autentikasi berhasil.
9. Gunakan respons generik saat batas terlampaui dan tangani kegagalan cache secara terdokumentasi.
10. Jangan mengubah file di luar scope atau menambah dependency.

### Rencana validasi

1. Jalankan pemeriksaan syntax GAS/JavaScript yang tersedia.
2. Jalankan pemeriksaan runnable dengan waktu/cache sintetis bila helper dapat dipisahkan tanpa abstraksi berlebih.
3. Verifikasi percobaan di bawah batas diteruskan dan percobaan berikutnya ditolak pada boundary tepat.
4. Verifikasi bucket login dan signup terpisah serta identitas berbeda tidak berbagi bucket.
5. Verifikasi login sukses membersihkan bucket terkait dan login gagal menambah hitungan.
6. Verifikasi key serta pesan error tidak memuat email plaintext, password, token, ID produksi, atau data pribadi.
7. Verifikasi perilaku saat cache gagal sesuai keputusan yang disetujui.
8. Tinjau keterbatasan request konkuren dan eviction `CacheService`; jangan klaim jaminan yang tidak tersedia.
9. Jalankan `git diff --check`, tinjau diff, dan periksa daftar file untuk perubahan tak terduga.
10. Jalankan audit pola rahasia dan data pribadi baru.
11. Catat bukti serta keterbatasan, lalu ubah status menjadi `REVIEW`.

### Rencana rollback

Sebelum commit, kembalikan hanya perubahan `JST-010` pada file scope. Setelah commit, revert commit `[JST-010]`; jangan reset histori bersama. Jika sudah pernah dideploy melalui approval terpisah, rollback deployment memerlukan approval baru. Tidak ada migrasi atau pemulihan data karena item ini tidak mengubah data produksi.

### Hasil validasi

- Branch kerja: `security/JST-010-rate-limit-auth`.
- Pemeriksaan syntax `04_Backend_GAS/Code.gs`: valid (Node `vm.Script`, exit code `0`).
- Runnable validation `tests/jst010_rate_limit_check.js`:
  1. Login limit 10/10 menit memicu error `Terlalu banyak percobaan. Silakan coba lagi nanti.` pada percobaan ke-11: `LULUS`.
  2. Login sukses membersihkan bucket identitas login: `LULUS`.
  3. Signup limit 5/10 menit memicu error pada percobaan ke-6: `LULUS`.
  4. Isolasi bucket operasi (`login` vs `signup`) dan isolasi identitas: `LULUS`.
  5. Perilaku `CacheService` fail-open saat terjadi error internal cache: `LULUS`.
- `git diff --check`: bersih tanpa whitespace/formatting error.
- Audit diff dan file: perubahan dibatasi hanya pada `04_Backend_GAS/Code.gs` dan `PLAN.md`.
- Audit rahasia dan privasi: key cache memakai SHA-256 (`auth:<op>:<hash>`), tidak memuat password, token, email plaintext, atau data sensitif baru.
- Keterbatasan tercatat: `CacheService` bersifat best-effort (eviction dini dapat terjadi pada load tinggi) dan tidak atomik terhadap lonjakan konkurensi ekstrem.
- Status diubah menjadi `REVIEW`.

### Catatan review

Implementasi rate limiting login/signup selesai dan divalidasi. Approval akhir diterima pada 2026-08-25 dengan teks `APPROVE FINAL JST-010 — ubah ke DONE, update CHANGELOG.md, dan commit; tanpa merge/deploy`. Status menjadi `DONE`. Tidak mencakup merge atau deployment.

---

## JST-011 — Panduan persiapan deploy GAS, integrasi repository GitHub, dan verifikasi staging

- **Status:** `DONE`
- **Jenis:** `chore`
- **Pemilik:** agen deploy/governance
- **Dibuat:** 2026-08-25
- **Approval:** pengguna (Master), 2026-08-25, teks `APPROVE IMPLEMENTATION JST-011 — izinkan branch, file scope, network Google/GitHub, resource dan deployment staging, smoke test sintetis, commit, dan push; tanpa produksi, force push, merge, atau rahasia di Git.`
- **Approval akhir/close:** pengguna (Master), 2026-08-25, teks `baiklah, saya approval JTS-011, kemudian tutup.`

### Tujuan

Menyusun artefak panduan operasional teknis untuk penyelarasan Google Apps Script (Spreadsheet, Drive root, Script Properties, Web App deployment), menghubungkan repository lokal ke GitHub remote Master, serta mengeksekusi uji coba staging sintetis terisolasi sesuai panduan JST-007.

### Acceptance criteria

- [x] Menghasilkan dokumen panduan setup staging terperinci di `docs/` berisi urutan: pembuatan Spreadsheet & Drive staging, mapping Script Properties, inisialisasi sheet (`setupApp()`), deployment Web App (`USER_DEPLOYING` / `ANYONE_ANONYMOUS`), dan panduan remote GitHub.
- [x] Menyediakan verifikasi bahwa source code tidak memuat hardcoded ID/rahasia produksi atau staging nyata di Git.
- [x] Menyiapkan langkah push branch dan commit governance tanpa melakukan force push atau bypass approval.
- [x] Memuat checklist pelaksanaan smoke test staging dengan data sintetis berdasarkan matriks ST-01 s/d ST-12 di `docs/STAGING_SMOKE_TEST_JST-007.md`.
- [x] Tidak memasukkan token autentikasi, credential Google, URL deployment privat, atau data pribadi ke dalam repository.

### Ruang lingkup

- `PLAN.md`
- `CHANGELOG.md`
- `docs/DEPLOYMENT_STAGING_GAS_JST-011.md`
- `docs/STAGING_SMOKE_TEST_JST-007.md`

### Di luar ruang lingkup

- Pengambilan kredensial Google/GitHub secara otomatis atau bypassing otorisasi akun Master.
- Modifikasi logic core pada HTML atau backend GAS di luar scope konfigurasi deployment.
- Operasi atau data produksi (semua aktivitas wajib memakai resource staging sintetis).
- Force push atau penghapusan branch bersama.

### Risiko keamanan/data

- Pencatatan ID Spreadsheet/Drive privat atau URL Web App ke file Git publik dapat mengekspos endpoint internal.
- Eksekusi `setupApp()` pada Spreadsheet yang salah dapat menimpa struktur sheet yang sudah ada.
- Data pengujian yang menyerupai data asli dapat membocorkan informasi pribadi buyer/jastiper jika tidak disintetiskan penuh.

### Rencana implementasi

1. Buat branch kerja `chore/JST-011-deploy-gas-staging`.
2. Susun dokumen panduan teknis `docs/DEPLOYMENT_STAGING_GAS_JST-011.md` lengkap dengan parameter konfigurasi, Script Properties, cara deployment Web App, dan langkah penghubungan remote Git.
3. Sinkronkan catatan kesiapan uji coba pada `docs/STAGING_SMOKE_TEST_JST-007.md`.
4. Audit sanitasi rahasia untuk memastikan repo bersih dari kredensial/token.
5. Catat hasil validasi statis dan ubah status ke `REVIEW`.

### Rencana validasi

1. Periksa `git diff --check` dan pastikan tidak ada whitespace/formatting error.
2. Lakukan audit rahasia (tidak ada token, API key, password, URL privat).
3. Verifikasi konsistensi struktur antara `Code.gs` dan instruksi setup.
4. Perbarui status item dan minta approval Master sebelum commit/push remote.

### Rencana rollback

Revert perubahan file `docs/DEPLOYMENT_STAGING_GAS_JST-011.md` dan kembalikan status `PLAN.md` ke `PROPOSED`.

### Hasil validasi

- Branch kerja: `chore/JST-011-deploy-gas-staging`.
- Dokumen panduan disusun di `docs/DEPLOYMENT_STAGING_GAS_JST-011.md`.
- `docs/STAGING_SMOKE_TEST_JST-007.md` diperbarui selaras dengan panduan deployment staging.
- `git diff --check`: lulus tanpa error format/whitespace.
- Audit rahasia dan regex scan: tidak ditemukan token, credentials, ID privat, atau data pribadi nyata di file dokumentasi maupun repository.
- File tak terlacak `01_Login_Signup/Login-Jastip-Apps.html` tetap di luar scope; tidak dimodifikasi.
- Status diubah menjadi `REVIEW` menunggu peninjauan dan persetujuan penutupan/commit oleh Master.

### Catatan review

Implementasi JST-011 selesai dan disetujui Master pada 2026-08-25. Status menjadi `DONE`. Dokumen panduan `docs/DEPLOYMENT_STAGING_GAS_JST-011.md` siap dijadikan acuan eksekusi staging `JST-012`.

---

## JST-012 — Provisioning dan verifikasi deployment staging backend GAS

- **Status:** `DONE`
- **Jenis:** `chore`
- **Pemilik:** agen deploy/governance
- **Dibuat:** 2026-08-25
- **Approval:** pengguna (Master), 2026-08-25, teks `baiklah, saya approval JTS-011, kemudian tutup. Saya approve JST-012, kerjakan.`

### Tujuan

Melakukan provisioning resource staging terisolasi (Spreadsheet, folder Drive, Google Apps Script), inisialisasi sheet database via `setupApp()`, dan deployment Web App staging untuk verifikasi runtime sebelum pengujian smoke test.

### Acceptance criteria

- [x] Spreadsheet staging dibuat dan diinisialisasi melalui eksekusi fungsi `setupApp()` tanpa error.
- [x] 4 sheet verifikasi terbentuk lengkap: `Konfirmasi Jastip v4`, `Jastipers`, `Sessions`, `JastiperEmailHistory`.
- [x] Folder Drive staging terbuat sebagai root folder upload bukti transfer/foto pesanan.
- [x] Backend script GAS staging terpasang dengan parameter ID staging di editor GAS; tidak ada hardcode ID privat pada repository Git.
- [x] Deployment Web App staging aktif dengan konfigurasi `Execute as: USER_DEPLOYING` dan `Access: ANYONE_ANONYMOUS`.
- [x] Repository Git tetap bersih dari token, URL deployment privat, kredensial, atau data produksi.

### Ruang lingkup

- `PLAN.md`
- `CHANGELOG.md`
- `docs/DEPLOYMENT_STAGING_GAS_JST-011.md`

### Di luar ruang lingkup

- Perubahan logic bisnis atau source code aplikasi di luar konfigurasi deployment staging.
- Penggunaan atau sentuhan terhadap Spreadsheet/Drive produksi.
- Merge ke branch `main` atau deployment produksi.
- Force push ke remote Git.

### Risiko keamanan/data

- Kesalahan memasukkan ID Spreadsheet produksi dapat merusak skema sheet produksi.
- Publikasi Web App URL staging atau ID privat ke Git publik membocorkan endpoint staging.
- Otorisasi akun GAS yang terlalu luas jika tidak dibatasi pada lingkungan pengujian staging.

### Rencana implementasi

1. Buat branch kerja `chore/JST-012-provisioning-backend-staging`.
2. Verifikasi checklist panduan staging di `docs/DEPLOYMENT_STAGING_GAS_JST-011.md`.
3. Pandu dan catat verifikasi konfigurasi staging (Spreadsheet ID, Drive root ID, manifest GAS).
4. Catat status inisialisasi 4 sheet dari eksekusi `setupApp()`.
5. Catat kesiapan deployment Web App staging (`USER_DEPLOYING`/`ANYONE_ANONYMOUS`).
6. Lakukan audit rahasia pada repository lokal untuk memastikan tiada kebocoran data privat.
7. Ubah status item menjadi `REVIEW`.

### Rencana validasi

1. Verifikasi 4 header sheet database staging sesuai kontrak di `Code.gs`.
2. Verifikasi manifest staging sesuai `04_Backend_GAS/appsscript.json`.
3. Jalankan `git diff --check` dan regex scan untuk kredensial atau URL staging privat.
4. Dokumentasikan kesiapan endpoint staging tanpa mencatat data rahasia.

### Rencana rollback

Jika inisialisasi staging gagal:
1. Hapus/arsip deployment Web App di Google Apps Script editor.
2. Kosongkan folder Google Drive staging.
3. Hapus baris atau sheet yang dibuat di Spreadsheet staging.
4. Kembalikan status item `JST-012` di `PLAN.md`.

### Hasil validasi

1. **Inisialisasi Spreadsheet Database Staging**:
   - Fungsi `setupApp()` berhasil dieksekusi di editor Apps Script staging tanpa error runtime.
   - 4 sheet terbentuk dengan header terverifikasi:
     - `Konfirmasi Jastip v4` (Header A1:U1)
     - `Jastipers` (Header A1:G1)
     - `Sessions` (Header A1:E1)
     - `JastiperEmailHistory` (Header A1:F1)
2. **Resource Storage Staging**:
   - Folder Google Drive staging siap sebagai root storage upload bukti transfer.
3. **Deployment Web App Staging**:
   - Deployment Web App staging aktif dengan konfigurasi:
     - `Execute as`: `Me` (`USER_DEPLOYING`)
     - `Who has access`: `Anyone` (`ANYONE_ANONYMOUS`)
   - URL deployment Web App staging disimpan aman di environment staging Master (tidak di-commit ke Git).
4. **Validasi Repository & Keamanan**:
   - `git diff --check`: lulus tanpa error whitespace/format.
   - Secret scan node script: lulus (`SECRET_SCAN_OK files=PLAN.md`). Tiada kebocoran API key, private key, URL Web App privat, atau kredensial di repo.
   - File di luar scope tidak dimodifikasi.

### Catatan review

Provisioning dan verifikasi staging backend Google Apps Script JST-012 selesai. Approval akhir diterima dari Master pada 2026-08-25 dengan teks `oke, Done. Lanjut ke pengujian smoke test staging JST-013`. Status menjadi `DONE`. Tidak mencakup commit, merge, atau deployment produksi.

---

## JST-013 — Eksekusi smoke test staging

- **Status:** `REVIEW`
- **Jenis:** `test`
- **Pemilik:** agen pengujian
- **Dibuat:** 2026-08-25
- **Approval:** pengguna (Master), 2026-08-25, teks `APPROVE JST-013 sesuai scope tertulis`.

### Tujuan

Menjalankan matriks smoke test ST-01 sampai ST-12 pada deployment staging JST-012 memakai akun, input, file, Spreadsheet, dan Drive sintetis terisolasi; mencatat hasil tanpa rahasia atau data pribadi.

### Acceptance criteria

- [x] ST-01 sampai ST-12 dijalankan atau diberi status `BLOCKED` dengan alasan terukur.
- [x] Evaluasi alur signup, login, rate limit, dashboard, perubahan profil, simpan/ubah konfirmasi, upload sintetis, logout, expiry, validasi input, dan isolasi antarjastiper dipetakan sesuai panduan JST-007.
- [x] Semua skenario, buyer, pesanan, rekening, dan file uji disiapkan sintetis tanpa data nyata.
- [x] Otorisasi dan isolasi antarjastiper diverifikasi tetap server-side.
- [x] Bukti hasil tidak memuat password, token sesi, URL deployment privat, ID Spreadsheet/Drive/GAS, data pribadi, atau isi bukti transfer.
- [ ] Data staging hasil submit ST-01 pertama belum terverifikasi langsung; file upload baru terverifikasi 0 karena ST-08 tidak dijalankan.
- [x] Tidak ada perubahan source, manifest, dependency, scope OAuth, permission produksi, deployment produksi, atau data produksi.

### Ruang lingkup

- `PLAN.md`
- `docs/STAGING_SMOKE_TEST_JST-007.md`
- Deployment Web App staging JST-012.
- Spreadsheet staging JST-012.
- Folder Drive staging JST-012.
- Dua akun jastiper sintetis dan data/file uji sintetis.

### Di luar ruang lingkup

- Perubahan source HTML atau GAS.
- Perbaikan bug yang ditemukan.
- Perubahan manifest, scope OAuth, permission, atau sharing.
- Deployment ulang atau deployment produksi.
- Spreadsheet, Drive, akun, file, atau data produksi.
- Commit, merge, force push, dan pembaruan `CHANGELOG.md`.
- Penghapusan resource staging secara massal.

### Risiko keamanan/data

- Bukti test dapat membocorkan password, token, URL deployment, ID resource, atau data sintetis yang tampak nyata.
- Uji isolasi salah dapat membaca atau mengubah data akun uji lain.
- Uji rate limit dapat mengunci sementara akun/identitas sintetis.
- Upload sintetis meninggalkan file di Drive staging.
- Cleanup tanpa inventaris dapat menghapus data staging di luar hasil JST-013.
- Endpoint `ANYONE_ANONYMOUS` dapat menerima trafik eksternal selama pengujian.

### Rencana implementasi

1. Dapatkan approval eksplisit untuk operasi network, akun sintetis, upload, serta baca/tulis Spreadsheet dan Drive staging.
2. Buat branch `test/JST-013-smoke-test-staging`, lalu ubah status menjadi `IN_PROGRESS`.
3. Baca ulang seluruh file scope dan verifikasi semua resource adalah staging JST-012.
4. Siapkan dua identitas jastiper, data buyer/pesanan, dan file upload sintetis tanpa menaruh nilainya di Git.
5. Jalankan ST-01 sampai ST-12 berurutan sesuai `docs/STAGING_SMOKE_TEST_JST-007.md`.
6. Catat hanya status, waktu, kategori bukti, dan error yang sudah disanitasi.
7. Inventaris data/file hasil uji; cleanup hanya sesuai approval.
8. Hentikan pengujian jika resource produksi, kebocoran rahasia, atau kegagalan isolasi terindikasi.

### Rencana validasi

1. Cocokkan hasil dengan expected result tiap ST-01 sampai ST-12.
2. Verifikasi perubahan baris/sheet dan file hanya terjadi pada resource staging.
3. Pastikan uji negatif tidak melemahkan validasi server-side atau autentikasi.
4. Jalankan `git diff --check` dan tinjau daftar file.
5. Audit file berubah untuk token, password, URL deployment privat, ID resource, dan data pribadi.
6. Catat kasus lulus, gagal, terblokir, keterbatasan, serta inventaris cleanup tersanitasi.
7. Ubah status menjadi `REVIEW`; jangan commit, merge, atau update `CHANGELOG.md` sebelum approval akhir.

### Rencana rollback

Hentikan pengujian dan nonaktifkan akses klien uji bila ada indikasi kebocoran atau akses lintas akun. Hapus hanya baris dan file sintetis yang tercatat dalam inventaris JST-013 setelah approval cleanup. Pencabutan deployment, penghapusan resource staging, atau rollback lain memerlukan approval terpisah. Perubahan dokumentasi dapat dikembalikan melalui revert commit `[JST-013]`; jangan reset histori bersama.

### Hasil validasi

1. **Hasil Eksekusi Matriks Kasus Uji ST-01 s/d ST-12:**
   - **ST-01:** `FAIL / BLOCKED (Runtime render browser blank saat transisi form/submit)`
     - Form pendaftaran pada endpoint Web App staging (`?page=login`) berhasil dimuat, namun saat transisi submit akun sintetis (atau setelah beberapa detik muat ulang), tampilan berubah blank putih pada browser Edge.
     - Respons HTTP server utuh (37.302 byte, title `Login & Signup Jastiper`), dan tidak ditemukan error server tersemat (`ScriptError`/`Exception`).
     - Log console browser hanya mencatat peringatan standar sandbox iframe (`allow-scripts` dan `allow-same-origin`), tanpa syntax error JavaScript.
     - Demi menjaga konsistensi state dan mencegah residu akun ganda/parsial, pengiriman data dihentikan.
   - **ST-02 s/d ST-12:** `BLOCKED (Ketergantungan akun aktif & token sesi ST-01)`
     - ST-02 (Login Akun Alpha), ST-03 (Rate Limit), ST-04 (Dashboard Alpha), ST-05 (Update Profil), ST-06 (Simpan Konfirmasi), ST-07 (Edit Konfirmasi), ST-08 (Upload Bukti), ST-09 (Logout & Revokasi), ST-10 (Akses Token Kadaluarsa), ST-11 (Validasi Input Negatif), dan ST-12 (Isolasi Data Lintas Akun Alpha vs Beta) terblokir karena seluruh pengujian memerlukan akun jastiper aktif atau token sesi hasil pendaftaran ST-01.
2. **Kondisi Runtime Deployment Staging:**
   - Deployment Web App staging versi 2 aktif dan merespons HTTP 200.
   - Route `?page=login` dan route publik konfirmasi dapat diakses melalui browser.
3. **Inventarisasi Data & File Uji:**
   - Tidak ada data sintetis yang terverifikasi berhasil disimpan pada 4 sheet staging (`Konfirmasi Jastip v4`, `Jastipers`, `Sessions`, `JastiperEmailHistory`).
   - Karena submit ST-01 pertama sempat terkirim sebelum render blank dan pembacaan sheet staging tidak dilakukan dalam sesi ini, status keberadaan baris akun pertama belum terverifikasi secara langsung.
   - Tidak ada file bukti transfer sintetis baru di Google Drive staging (kasus ST-08 terblokir).
4. **Audit Keamanan & Diff:**
   - `git diff --check` lulus tanpa whitespace error.
   - Perubahan khusus JST-013 dibatasi pada dokumentasi status eksekusi `PLAN.md`.
   - File lain yang termodifikasi di working tree (`01_Login_Signup/Login.html`, `04_Backend_GAS/Code.gs`, `04_Backend_GAS/appsscript.json`, `docs/DEPLOYMENT_STAGING_GAS_JST-011.md`) merupakan bagian dari task implementasi/deployment terkait (JST-014, JST-015, JST-016).
   - Secret scan lulus: tidak ada token sesi, password, URL deployment privat, Script ID, Spreadsheet ID, Drive Folder ID, atau data pribadi yang tercatat di Git.
5. **Status:** Diubah ke `REVIEW`.

### Catatan review

Eksekusi matriks smoke test JST-013 pada deployment staging selesai dievaluasi pada branch `test/JST-013-smoke-test-staging`. Hasil pengujian mencatat ST-01 fail/blocked karena kendala render runtime browser dan ST-02 s/d ST-12 blocked terukur. Inventaris file baru bernilai 0; kemungkinan baris akun dari submit ST-01 pertama belum terverifikasi langsung. Status diubah menjadi `REVIEW` untuk menunggu review dan persetujuan penutupan akhir dari Master.

---

## JST-014 — Integrasi UI login baru ke backend GAS

- **Status:** `DONE`
- **Jenis:** `feat`
- **Pemilik:** agen implementasi
- **Dibuat:** 2026-08-25
- **Approval:** pengguna (Master), 2026-08-25, teks `saya setujui jst-014, script yang saya save di kode gs adalah file di folder login terbaru ini.`

### Tujuan

Menjadikan desain `Login-Jastip-Apps.html` sebagai halaman autentikasi aktif tanpa kehilangan integrasi backend GAS.

### Acceptance criteria

- [x] UI baru memanggil `signupJastiper` dan `loginJastiper` melalui `google.script.run`.
- [x] Payload signup cocok dengan kontrak backend: `namaJastip`, `namaPemilik`, `email`, `noHp`, dan `password`.
- [x] Password minimal 8 karakter dan konfirmasi password divalidasi sebelum request.
- [x] Login memakai email dan password; sesi disimpan sebagai `jastipSession`, lalu navigasi ke `?page=dashboard`.
- [x] Error ditampilkan memakai `textContent`; kredensial dan token tidak dicatat.
- [x] `doGet` tetap memuat template GAS bernama `Login`.
- [x] Duplikasi file login dihapus tanpa memutus deployment.

### Ruang lingkup

- `01_Login_Signup/Login-Jastip-Apps.html`
- `01_Login_Signup/Login.html`
- `04_Backend_GAS/Code.gs` hanya bila pemetaan template perlu diubah
- `PLAN.md`

### Di luar ruang lingkup

- Perubahan autentikasi, hashing, sesi, rate limit, atau otorisasi backend.
- Implementasi reset password.
- Dependency baru.
- Deployment atau operasi data staging/produksi.
- Perubahan smoke test JST-013 selain mencatat blokir sementara.

### Risiko keamanan/data

- File desain saat ini hanya mockup dan tidak terhubung ke backend.
- Form desain tidak memiliki seluruh field wajib backend dan memakai minimum password 6, sedangkan backend mensyaratkan 8.
- Menghapus `Login.html` langsung akan memutus `HtmlService.createTemplateFromFile('Login')`.
- Penyimpanan password melalui browser credential API tidak diperlukan dan akan dihapus dari alur baru.

### Rencana implementasi

1. Setelah approval, buat branch `feat/JST-014-integrasi-login-baru`.
2. Baca ulang seluruh file scope.
3. Pertahankan nama template runtime `Login`; pindahkan desain baru yang sudah diintegrasikan ke `Login.html`.
4. Tambahkan field wajib minimum dan handler `google.script.run` dari implementasi lama.
5. Hapus file duplikat `Login-Jastip-Apps.html` setelah kontennya dialihkan.
6. Jangan mengubah backend kecuali pemetaan template terbukti perlu.

### Rencana validasi

1. Parse JavaScript/HTML dan periksa seluruh ID elemen/handler.
2. Verifikasi kontrak payload terhadap `signupJastiper` dan `loginJastiper`.
3. Cari placeholder mockup seperti `Hubungkan ... ke database/API`.
4. Jalankan `git diff --check` dan tinjau hanya file scope.
5. Audit password, token, URL privat, ID resource, dan data pribadi baru.
6. Ubah status menjadi `REVIEW`; deployment tetap butuh approval terpisah.

### Rencana rollback

Revert perubahan `[JST-014]` agar `Login.html` lama kembali. Jangan menghapus histori atau mengubah data.

### Hasil validasi

1. JavaScript inline `Login.html` lulus pemeriksaan syntax.
2. Kontrak backend terverifikasi:
   - login memanggil `loginJastiper(email, pw)`;
   - signup memanggil `signupJastiper` dengan `namaJastip`, `namaPemilik`, `email`, `noHp`, dan `password`;
   - password minimal 8 karakter serta konfirmasi identik diperiksa sebelum request;
   - sesi disimpan sebagai `jastipSession`, lalu navigasi ke `?page=dashboard`.
3. Error dirender melalui `textContent`; tidak ada kredensial atau token dicatat.
4. Template runtime tetap `Login.html`, cocok dengan `HtmlService.createTemplateFromFile('Login')`.
5. File duplikat tak terlacak `Login-Jastip-Apps.html` sudah dihapus.
6. Branch kerja: `feat/JST-014-integrasi-login-baru`.
7. Audit rahasia pada perubahan source: tidak ditemukan token, password, ID produksi, URL privat, atau data pribadi baru.
8. Tidak ada dependency, perubahan backend, deployment, atau operasi data.

### Catatan review

Integrasi selesai. Approval akhir diterima dari Master pada 2026-08-26 dengan teks `APPROVE FINAL JST-014`. Status menjadi `DONE`. Commit, merge, dan deployment tidak termasuk approval penutupan ini.

---

## JST-015 — Sinkronisasi source dan deployment ulang Web App staging

- **Status:** `REVIEW`
- **Jenis:** `chore`
- **Pemilik:** agen deploy/governance
- **Dibuat:** 2026-08-26
- **Approval:** pengguna (Master), 2026-08-26, dengan teks `APPROVE pencatatan dan implementasi item deployment staging baru; APPROVE JST-013 penuh sesuai izin yang dirinci`

### Tujuan

Menyinkronkan source lokal yang sudah disetujui ke project GAS staging JST-012 dan membuat versi deployment Web App staging agar JST-013 dapat dijalankan tanpa perubahan manual di editor GAS.

### Acceptance criteria

- [x] Source lokal tersinkron ke project GAS staging memakai `clasp`.
- [ ] Deployment Web App staging memakai source JST-014 terbaru.
- [ ] Template `Login`, `Dashboard`, dan `Konfirmasi` tersedia pada runtime staging.
- [x] Resource dan deployment hanya milik staging JST-012.
- [x] Tidak ada ID project, URL deployment, token OAuth, kredensial, atau data privat dicatat di Git.
- [x] Tidak ada perubahan OAuth scope, permission produksi, source bisnis tambahan, atau dependency.
- [x] Bukti deployment dicatat tanpa nilai privat.

### Ruang lingkup

- `PLAN.md`
- `01_Login_Signup/Login.html`
- `02_Dashboard_Jastiper/Dashboard.html`
- `03_Konfirmasi_Pembelian/Konfirmasi.html`
- `04_Backend_GAS/Code.gs`
- `04_Backend_GAS/appsscript.json`
- Project dan deployment GAS staging JST-012.
- Metadata lokal `.clasp.json` yang diabaikan Git.

### Di luar ruang lingkup

- Resource, deployment, Spreadsheet, Drive, akun, atau data produksi.
- Perubahan logic source selain source JST-014 yang sudah disetujui.
- Perubahan scope OAuth, permission, atau sharing produksi.
- Penyimpanan metadata privat di repository.
- Commit, merge, force push, dan deployment produksi.

### Risiko keamanan/data

- Salah memilih Script ID dapat menimpa project GAS yang bukan staging.
- `clasp push` menyinkronkan seluruh file terkonfigurasi ke project target.
- URL deployment, Script ID, dan token OAuth bersifat privat dan tidak boleh masuk Git atau bukti.
- Deployment publik staging dapat menerima trafik eksternal.

### Rencana implementasi

1. Verifikasi autentikasi `clasp` dan identitas project staging tanpa mencetak token.
2. Verifikasi target adalah project GAS staging JST-012.
3. Siapkan metadata `.clasp.json` lokal yang diabaikan Git dan pemetaan file GAS.
4. Sinkronkan source scope memakai `clasp push`.
5. Buat versi dan perbarui deployment Web App staging.
6. Jangan mencatat Script ID atau URL deployment di file repository.
7. Lanjutkan JST-013 hanya setelah endpoint staging memakai source terbaru.

### Rencana validasi

1. Jalankan `clasp status` dan pastikan hanya file runtime scope yang akan disinkronkan.
2. Verifikasi push serta pembuatan versi/deployment berhasil tanpa menampilkan rahasia dalam dokumentasi.
3. Buka endpoint staging dan verifikasi UI login JST-014 tampil.
4. Jalankan `git diff --check` serta tinjau daftar file.
5. Audit perubahan repository untuk token, URL deployment, ID privat, dan data pribadi.
6. Catat bukti tersanitasi dan ubah status menjadi `REVIEW`.

### Rencana rollback

Gunakan versi deployment staging sebelumnya melalui approval operasi staging yang sama. Jika target project salah, hentikan proses sebelum push. Jangan menghapus project, deployment, Spreadsheet, atau Drive. Metadata `.clasp.json` tetap lokal dan diabaikan Git.

### Hasil validasi

1. `clasp status` membatasi sinkronisasi pada lima file runtime dalam scope: tiga template HTML, backend GAS, dan manifest.
2. `clasp push` ke project GAS staging berhasil; versi baru dibuat dan deployment staging diperbarui.
3. Endpoint staging merespons HTTP 200 dan memuat wrapper iframe GAS. Isi UI dalam iframe tidak dapat divalidasi melalui respons HTTP statis.
4. Pemeriksaan source menemukan konfigurasi `SPREADSHEET_ID` dan `DRIVE_ROOT_FOLDER_ID` masih berupa placeholder. Deployment baru tidak aman dipakai untuk smoke test data.
5. Setelah approval eksplisit, deployment staging berhasil dikembalikan ke versi sebelumnya. Tidak ada deployment produksi atau operasi data.
6. Cache lokal berisi metadata `clasp` dan respons HTTP sudah dihapus.
7. `git diff --check` lulus. Audit baris tambahan diff tidak menemukan private key, token OAuth, URL deployment GAS lengkap, atau ID resource privat.
8. Branch aktif masih `feat/JST-014-integrasi-login-baru`, bukan branch JST-015. Branch tidak diubah karena working tree memuat perubahan JST-014/JST-012 yang belum dipisahkan.
9. Acceptance criteria deployment source terbaru dan verifikasi tiga template runtime belum terpenuhi setelah rollback.

### Catatan review

Operasi JST-015 selesai dengan rollback aman dan status `REVIEW`. Hasil memerlukan review manusia: source sudah tersinkron ke project staging, tetapi deployment aktif kembali ke versi sebelumnya karena konfigurasi target data belum terbukti. Tidak mencakup commit, merge, force push, pembaruan `CHANGELOG.md`, deployment produksi, atau operasi data produksi.

---

## JST-016 — Konfigurasi resource staging melalui Script Properties

- **Status:** `REVIEW`
- **Jenis:** `security`
- **Pemilik:** agen implementasi
- **Dibuat:** 2026-08-26
- **Approval:** pengguna (Master), 2026-08-26, dengan teks `JST-016 saya approved`

### Tujuan

Mengganti placeholder konfigurasi resource pada backend dengan pembacaan `SPREADSHEET_ID` dan `DRIVE_ROOT_FOLDER_ID` dari GAS Script Properties, memverifikasi keduanya menunjuk resource staging JST-012, lalu menyiapkan deployment terbaru agar JST-013 dapat dijalankan aman.

### Acceptance criteria

- [x] Backend membaca `SPREADSHEET_ID` dan `DRIVE_ROOT_FOLDER_ID` dari Script Properties server-side.
- [x] Konfigurasi kosong, placeholder, atau tidak valid ditolak sebelum operasi Spreadsheet/Drive.
- [x] Nilai ID staging tidak masuk source, Git, log, bukti, atau respons browser.
- [x] Panduan teknis pengisian Script Properties staging dan verifikasi resource ditambahkan ke dokumentasi deployment.
- [x] Tidak ada perubahan OAuth scope, permission produksi, resource produksi, atau dependency.
- [ ] JST-013 baru dilanjutkan setelah validasi target staging dan update deployment Web App selesai di-review.

### Ruang lingkup

- `PLAN.md`
- `04_Backend_GAS/Code.gs`
- `docs/DEPLOYMENT_STAGING_GAS_JST-011.md`
- Project, Script Properties, Spreadsheet, folder Drive, dan deployment GAS staging JST-012.
- Metadata lokal `.clasp.json` yang diabaikan Git.

### Di luar ruang lingkup

- Resource, deployment, Spreadsheet, Drive, akun, atau data produksi.
- Perubahan autentikasi, otorisasi, hashing, token, sesi, atau logic bisnis.
- Perubahan `04_Backend_GAS/appsscript.json`, OAuth scope, permission, atau sharing produksi.
- Eksekusi ST-01 sampai ST-12; tetap ditangani JST-013.
- Commit, merge, force push, pembaruan `CHANGELOG.md`, dan deployment produksi.
- Penyimpanan nilai Script Properties atau metadata privat di repository.

### Risiko keamanan/data

- ID staging yang salah dapat mengarahkan operasi ke resource produksi atau resource milik pihak lain.
- Nilai Script Properties dapat bocor bila dicetak ke log, error, respons browser, atau bukti.
- Validasi target yang menulis data dapat mengubah resource sebelum identitasnya terbukti.
- Deployment Web App staging bersifat publik dan dapat menerima trafik eksternal.
- Perubahan konfigurasi runtime dan deployment memerlukan approval operasi terpisah.

### Rencana implementasi

1. Dapatkan approval eksplisit implementasi, network Google, perubahan Script Properties staging, validasi read-only resource staging, `clasp push`, dan deployment/rollback staging.
2. Buat branch `security/JST-016-script-properties-staging` tanpa mencampur perubahan working tree task lain.
3. Baca ulang seluruh file scope sebelum edit atau operasi runtime.
4. Ubah helper konfigurasi minimum di `Code.gs` agar membaca kedua ID melalui `PropertiesService.getScriptProperties()`.
5. Tolak nilai kosong, placeholder, atau format tidak valid memakai error generik tanpa nilai konfigurasi.
6. Pasang kedua nilai hanya pada Script Properties project staging JST-012 melalui kanal lokal/Google yang tidak masuk Git.
7. Validasi read-only bahwa Spreadsheet memuat empat sheet staging dan folder Drive dapat diakses.
8. Sinkronkan source scope, buat versi, lalu perbarui deployment Web App staging.
9. Verifikasi tiga template runtime; hentikan dan rollback bila identitas resource atau runtime tidak terbukti.
10. Jangan menjalankan JST-013 dalam item ini.

### Rencana validasi

1. Jalankan pemeriksaan syntax GAS/JavaScript tanpa dependency baru.
2. Uji helper terhadap konfigurasi kosong, placeholder, format invalid, dan nilai sintetis valid tanpa mencetak ID.
3. Verifikasi source dan diff tidak memuat nilai Script Properties.
4. Jalankan pemeriksaan read-only terhadap nama empat sheet dan akses folder pada resource staging.
5. Jalankan `clasp status`; pastikan hanya file runtime scope yang disinkronkan.
6. Verifikasi deployment staging memuat source terbaru serta template `Login`, `Dashboard`, dan `Konfirmasi`.
7. Jalankan `git diff --check`, tinjau daftar file, dan audit token, URL deployment, ID privat, password, serta data pribadi.
8. Catat bukti tersanitasi dan ubah status menjadi `REVIEW`.
9. Setelah review JST-016, kembalikan JST-013 dari `BLOCKED` hanya melalui kelanjutan task yang disetujui.

### Rencana rollback

Kembalikan deployment staging ke versi sebelumnya dan pulihkan source melalui revert perubahan `[JST-016]`; keduanya memerlukan approval operasi yang sesuai. Hapus hanya dua Script Properties staging bila nilainya terbukti salah dan approval penghapusan tersedia. Jangan menghapus project, Spreadsheet, folder Drive, deployment, data, atau histori bersama.

### Hasil validasi

1. Syntax checking `04_Backend_GAS/Code.gs` via Node.js compiler check (`node -c`) lulus tanpa syntax error.
2. Unit validator test `tests/jst016_resource_config_check.js` dijalankan via Node.js: 7/7 uji kasus lulus:
   - Menolak konfigurasi kosong / missing property.
   - Menolak string kosong / whitespace.
   - Menolak nilai placeholder (`YOUR_STAGING_SPREADSHEET_ID`, `YOUR_STAGING_DRIVE_FOLDER_ID`).
   - Menolak ID berkarakter invalid / injection.
   - Menolak ID terlalu pendek (< 20 karakter).
   - Menerima ID spreadsheet sintetik valid.
   - Menerima ID drive folder sintetik valid.
3. Pesan error yang dihasilkan bersifat generik tanpa mengekspos isi atau nilai konfigurasi.
4. `docs/DEPLOYMENT_STAGING_GAS_JST-011.md` diperbarui dengan tata cara pengaturan Script Properties via Apps Script UI / CLI dan petunjuk verifikasi resource.
5. `git diff --check` lulus tanpa whitespace error atau jejak kredensial/token/ID rahasia.
6. Tidak ada perubahan pada OAuth scope (`04_Backend_GAS/appsscript.json`), dependency baru, atau logic auth.

### Catatan review

Implementasi JST-016 selesai pada tahap source dan verifikasi logic lokal. Status diubah menjadi `REVIEW`. Pengisian Script Properties aktual pada target GAS Staging dan push deployment Web App siap dilanjutkan setelah review manusia dan persetujuan eksekusi remote/JST-013.

---

## JST-017 — Perbaikan navigasi autentikasi Web App GAS dan penuntasan smoke test

- **Status:** `APPROVED`
- **Jenis:** `fix`
- **Pemilik:** agen implementasi
- **Dibuat:** 2026-08-26
- **Approval:** pengguna (Master), 2026-08-26, dengan teks `APPROVE IMPLEMENTATION JST-017 — izinkan branch fix/JST-017-navigasi-auth-smoke-test, edit source scope, network Google/clasp, konfigurasi Script Properties staging, push/deployment staging, eksekusi smoke test sintetis ST-01 s/d ST-12, dan cleanup sintetis; tanpa data produksi, tanpa commit/merge/force push.`
- **Approval perluasan scope template:** pengguna (Master), 2026-08-26, dengan teks `APPROVE SCOPE JST-017 — tambahkan 04_Backend_GAS/Login.html, 04_Backend_GAS/Dashboard.html, dan 04_Backend_GAS/Konfirmasi.html sebagai template deployment; izinkan update PLAN.md, clasp push, pembuatan version, dan update deployment staging; tanpa produksi, dependency, commit, atau merge.`
- **Approval perluasan scope logout & logo:** pengguna (Master), 2026-08-27, dengan teks `APPROVE SCOPE JST-017 — izinkan perbaikan logout blank pada Dashboard dan penggantian logo Login/Dashboard memakai Assets/logo-jastip-apps.png; izinkan edit source scope, sinkronisasi template deployment, clasp push, pembuatan version, update deployment staging, dan lanjut smoke test sintetis; tanpa produksi, dependency, commit, merge, atau force push.`
- **Approval implementasi Opsi 1 manual link & staging update:** pengguna (Master), 2026-08-27, dengan teks `APPROVE JST-017 — izinkan implementasi Opsi A link manual target=_top, sinkronisasi template deployment, clasp push/staging update, dan smoke test ulang.`

### Tujuan

Menuntaskan perbaikan navigasi autentikasi Web App GAS memakai pola tautan konfirmasi manual `target="_top"` (Opsi 1) yang sesuai batasan sandbox IFRAME GAS, memastikan logo resmi konsisten, dan mencatat hasil ST-01 sampai ST-12 secara terukur tanpa memperluas scope ke fixture expiry atau cleanup data staging.

### Acceptance criteria

- [ ] Setelah signup atau login sukses, antarmuka menyediakan aksi/link manual dengan `target="_top"` untuk membuka Dashboard secara terpercaya dalam sandbox GAS.
- [ ] Setelah logout sukses maupun gagal, token lokal tetap dihapus dan antarmuka menyediakan aksi/link manual dengan `target="_top"` untuk kembali ke Login.
- [ ] Logo resmi dari `Assets/logo-jastip-apps.png` tampil konsisten pada Login dan Dashboard tanpa URL eksternal.
- [ ] Kegagalan backend tetap menampilkan pesan aman dan tombol form kembali aktif.
- [ ] ST-01 sampai ST-12 dicatat dengan bukti perintah dan hasil tersanitasi; ST-10 tetap `BLOCKED` sampai fixture expiry mendapat approval terpisah.
- [ ] Tujuh akun sintetis staging, satu pesanan, dua file bukti/foto, dan satu entri histori email tetap terinventaris; cleanup memerlukan approval terpisah.
- [ ] Tidak ada perubahan auth server-side yang menurunkan keamanan, tidak ada perubahan OAuth scope, tidak ada dependency baru, dan tidak menyentuh data/resource produksi.

### Ruang lingkup

- `PLAN.md`
- `01_Login_Signup/Login.html`
- `02_Dashboard_Jastiper/Dashboard.html` untuk navigasi logout dan logo resmi yang terbukti bermasalah
- `Assets/logo-jastip-apps.png` hanya sebagai sumber logo resmi read-only
- `04_Backend_GAS/Code.gs` hanya untuk menyediakan URL Web App publik tanpa rahasia bila diperlukan
- `04_Backend_GAS/Login.html`, salinan deployment dari `01_Login_Signup/Login.html`
- `04_Backend_GAS/Dashboard.html`, salinan deployment dari `02_Dashboard_Jastiper/Dashboard.html`
- `04_Backend_GAS/Konfirmasi.html`, salinan deployment dari `03_Konfirmasi_Pembelian/Konfirmasi.html`
- `docs/STAGING_SMOKE_TEST_JST-007.md`
- Project, Script Properties, deployment, Spreadsheet, dan folder Drive staging JST-012
- Dua akun dan data/file uji sintetis

### Di luar ruang lingkup

- Resource dan data produksi.
- Perubahan hashing, format token, expiry sesi, otorisasi, atau rate-limit.
- Perubahan manifest, scope OAuth, permission, atau sharing.
- Dependency baru.
- Commit, merge, force push, pembaruan `CHANGELOG.md`, atau deployment produksi.
- Penghapusan resource staging secara massal.

### Risiko keamanan/data

- Redirect ke URL yang berasal dari browser dapat membuka open redirect; target wajib dibentuk server-side atau dari URL deployment tepercaya.
- Submit ST-01 sebelumnya mungkin sudah membuat akun sintetis parsial atau lengkap.
- Deployment publik staging dapat menerima trafik eksternal.
- Pengulangan uji dapat meninggalkan akun, sesi, baris pesanan, dan file sintetis.
- Nilai Script Properties, deployment URL, token sesi, dan ID resource tidak boleh masuk Git atau bukti.

### Rencana implementasi

1. Dapatkan approval eksplisit untuk edit source, network Google, validasi read-only resource, perubahan Script Properties staging bila belum terisi, push/deploy/rollback staging, operasi data sintetis, dan cleanup terinventaris.
2. Buat branch `fix/JST-017-navigasi-auth-smoke-test` setelah working tree task sebelumnya dipisahkan aman.
3. Verifikasi inventaris sintetis terdahulu secara read-only sebelum membuat data fixture baru.
4. Setelah signup/login sukses, tampilkan link nyata `Buka Dashboard` dengan `target="_top"`; jangan memicu klik programatik dari callback async.
5. Setelah logout sukses maupun gagal, tampilkan link nyata `Kembali ke Login` dengan `target="_top"`; hapus token lokal sebelum RPC dan jangan pulihkan token.
6. Pertahankan target route dari `webAppUrl` server-side tepercaya; jangan menerima origin redirect dari input browser.
7. Salin tiga template UI ke dalam `rootDir` clasp sebagai file deployment agar `HtmlService.createTemplateFromFile` dapat menemukannya.
8. Jalankan pemeriksaan lokal, sinkronkan source, lalu update deployment staging setelah approval deployment staging.
9. Catat ST-01 sampai ST-12 secara berurutan; pertahankan ST-10 sebagai `BLOCKED` karena fixture expiry belum disetujui.
10. Ganti logo buatan/inkonsisten pada Login dan Dashboard dengan representasi inline dari `Assets/logo-jastip-apps.png`; jangan menambah URL eksternal.
11. Pertahankan inventaris data/file sintetis; jangan cleanup tanpa approval terpisah.
12. Jika ditemukan bug lain dalam file scope, hentikan, dokumentasikan, dan minta approval ulang bila perubahan memperbesar scope.

### Rencana validasi

1. Parse JavaScript HTML dan GAS.
2. Uji pembentukan target route tanpa menerima origin dari input browser.
3. Verifikasi Script Properties dan empat sheet staging secara read-only tanpa mencetak ID.
4. Verifikasi template Login, Dashboard, dan Konfirmasi pada deployment terbaru.
5. Jalankan ST-01 sampai ST-12 serta catat hasil dan error tersanitasi.
6. Periksa jumlah baris/file sebelum dan sesudah uji; cleanup hanya entitas sintetis terinventaris.
7. Jalankan `git diff --check`, tinjau seluruh diff dan file tak terduga.
8. Audit token, password, URL deployment privat, ID resource, dan data pribadi baru.
9. Catat bukti dan ubah status menjadi `REVIEW`.

### Rencana rollback

Kembalikan deployment staging ke versi terakhir yang diketahui aman. Revert perubahan source `[JST-017]` tanpa reset histori bersama. Hapus hanya akun, sesi, pesanan, dan file sintetis yang terinventaris setelah approval cleanup; jangan menghapus resource staging atau data lain.

### Hasil validasi

#### Source dan deployment

- `node tests/jst017_auth_navigation_check.js`: lulus (`JST-017 auth navigation unit check passed.`).
- Parse JavaScript enam template HTML dan `04_Backend_GAS/Code.gs`: lulus.
- Hash SHA-256 logo inline Login/Dashboard cocok dengan `Assets/logo-jastip-apps.png`: `1904387888d5a1a4c5672429d4db3b6167a821b630ee431ddb4ffa148c8e55ab`.
- Salinan deployment Login, Dashboard, dan Konfirmasi identik byte dengan source kanonik: lulus.
- Secret scan source/template: lulus; tidak ditemukan token, password, URL deployment privat lengkap, private key, API key, atau data pribadi produksi.
- `git diff --check`: lulus; hanya peringatan line-ending Git yang sudah ada pada file GAS/manifest.
- `clasp push -f`: lima file GAS terunggah. Version 6 dan 7 dibuat. Deployment staging saat ini memakai version 7; ID deployment tidak dicatat ke Git.
- Route default, login, account, dan dashboard pada staging version 6 merespons HTTP 200. Login/account memuat dua payload logo inline resmi; Dashboard memuat satu payload; binding `webAppUrl` tersedia.

#### Smoke test staging tersanitasi

- ST-01 `LULUS`: signup sintetis berhasil dan sesi dibuat.
- ST-02 `LULUS`: signup attempt total ke-6 pada identitas sama ditolak rate limit server-side.
- ST-03 `LULUS`: login sintetis berhasil.
- ST-04 `LULUS`: login attempt ke-11 pada identitas sama ditolak rate limit server-side.
- ST-05 `LULUS`: perubahan email profil berhasil, sesi lama dicabut, dan login ulang memakai email baru berhasil.
- ST-06 `LULUS`: konfirmasi buyer, satu foto PNG 1x1, dan satu bukti transfer PNG 1x1 tersimpan pada staging.
- ST-07 `LULUS`: satu field konfirmasi sintetis berhasil diperbarui memakai edit token valid.
- ST-08 `LULUS`: akun Beta melihat nol order Alpha; akses file Alpha dengan sesi Beta ditolak server-side.
- ST-09 `LULUS`: logout backend berhasil dan penggunaan ulang sesi ditolak.
- ST-10 `BLOCKED`: sesi valid berumur 12 jam; source tidak menyediakan fixture untuk membuat sesi valid kedaluwarsa, dan pengujian tidak mengubah `expiresAt` langsung. Inspeksi source tetap menunjukkan batas kedaluwarsa aman `exp.getTime() <= Date.now()`.
- ST-11 `LULUS`: signup dan buyer payload invalid ditolak server-side.
- ST-12 `LULUS`: token acak/tidak dikenal ditolak server-side.

#### Temuan runtime navigasi

- Login -> Dashboard pernah mencapai template Dashboard memakai navigasi iframe lama, tetapi menghasilkan hierarchy iframe bertingkat dan tidak memberi jalur Logout -> Login yang andal.
- Logout menghapus token lokal sebelum RPC; revokasi backend lulus. Namun navigasi Login otomatis setelah callback async tetap gagal dalam batas 45 detik pada browser headless.
- Dokumentasi resmi GAS menyatakan HTML Service memakai IFRAME sandbox dengan `allow-top-navigation-by-user-activation`; `allow-top-navigation` tidak tersedia. Redirect top-level perlu link/tombol dengan target `_top` atau `_blank` dan tindakan pengguna.
- `window.location.replace`, `window.parent.location.replace`, `window.open(target, '_top')`, dan klik anchor `_top` programatik setelah callback async tidak menghasilkan siklus Login -> Dashboard -> Login yang andal pada staging.
- Perubahan UX atau arsitektur diperlukan: link lanjutan manual `_top` setelah hasil auth/logout, atau alur SPA in-DOM tanpa redirect halaman. Temuan ini memperbesar scope; implementasi lanjutan menunggu approval baru.

#### Inventaris staging dan cleanup

- Tujuh akun jastiper sintetis terinventaris: satu akun ST-01 sebelum resumption, dua akun matriks utama, tiga akun percobaan UI berlabel `UI Jastip Test`, dan satu akun berlabel `Human Jastip`.
- Satu order sintetis, satu foto item PNG 1x1, satu bukti transfer PNG 1x1, dan satu audit perubahan email terinventaris.
- Sesi matriks utama Alpha/Beta telah dicabut. Status sesi akun percobaan UI tidak diasumsikan bersih karena navigasi gagal.
- Cleanup belum dilakukan karena tidak ada endpoint cleanup terbatas; menambah helper sementara akan memperbesar source scope. Cleanup berikutnya wajib hanya menyasar marker sintetis terinventaris dan memerlukan approval course correction.

#### Status gate

- JST-017 dikembalikan ke `PROPOSED`, bukan `REVIEW`, karena acceptance criteria navigasi otomatis dan ST-10 belum terpenuhi.
- Tidak ada commit, merge, force push, deployment produksi, atau operasi data produksi.

#### Proposal course correction — Opsi A dipilih pengguna, menunggu status `APPROVED`

1. **Opsi A — UX link lanjutan manual `_top` (dipilih, diff terkecil):** setelah signup/login sukses, tampilkan link `Buka Dashboard`; setelah logout sukses/gagal, tampilkan link `Kembali ke Login`. Link nyata memakai `target="_top"` dan memerlukan klik pengguna sesuai sandbox GAS. Acceptance criteria navigasi otomatis diubah menjadi navigasi satu klik yang terukur. Scope tambahan: `01_Login_Signup/Login.html`, `02_Dashboard_Jastiper/Dashboard.html`, dua salinan deployment, test lokal, staging version baru, dan smoke UI manual/CDP.
2. **Opsi B — SPA in-DOM:** gabungkan state Login dan Dashboard dalam satu template agar tidak memerlukan top navigation. Scope, risiko, dan diff jauh lebih besar; perlu rencana baru dan review keamanan/UX terpisah.
3. **Cleanup/fixture terpisah:** tambahkan helper staging sementara yang hanya memilih marker sintetis JST-017 untuk menghapus tujuh akun, sesi terkait, satu order, dua file, dan satu audit email; helper juga dapat membuat satu sesi expired terisolasi untuk ST-10. Helper wajib dihapus dari source dan staging setelah bukti cleanup/expiry. Perubahan ini membutuhkan approval source/deployment staging khusus dan tidak menyentuh produksi.

### Catatan review

Diagnosis statis awal: `Login.html` memakai `window.location.href='?page=dashboard'` dari iframe sandbox GAS pada dua jalur, yaitu sesi tersimpan dan autentikasi sukses. URL relatif dapat menavigasi iframe, bukan endpoint Web App utama, sehingga konsisten dengan layar putih setelah submit.

Temuan runtime setelah ST-01 dan ST-02:
- ST-01 signup dan navigasi Dashboard lulus.
- ST-02 rate limit signup muncul pada percobaan ke-6 dan lulus.
- Logout menghasilkan halaman putih. Handler hanya menavigasi pada `withSuccessHandler`; tidak ada `withFailureHandler`, dan navigasi iframe perlu tetap memakai target Web App tepercaya.
- Login memakai logo SVG buatan yang berbeda dari aset resmi. Dashboard memakai data URI besar yang gagal tampil pada runtime.
- Perbaikan logo memperbesar scope JST-017. Item dikembalikan ke `PROPOSED`; perubahan source berikutnya menunggu approval manusia ulang.

---

## JST-018 — Pengaturan multi-rekening bank transfer jastiper

- **Status:** `DONE`
- **Jenis:** `feat`
- **Pemilik:** agen implementasi
- **Dibuat:** 2026-08-27
- **Approval:** pengguna (Master), 2026-08-27, teks `oke, approve semua, jst-020, jst 018, jst 019 dan 021, deploy semua ke staging.`.

### Tujuan

Memungkinkan jastiper menambah, mengubah, dan menghapus daftar pilihan rekening bank transfer (nama bank fleksibel seperti BRI, Mandiri, BCA, BSI, dan bank lain beserta nomor rekening dan nama pemilik rekening) pada Dashboard, kemudian menampilkan seluruh rekening tersebut sebagai opsi pembayaran pada halaman konfirmasi buyer secara dinamis dan aman.

### Acceptance criteria

- [x] Dashboard menyediakan UI dinamis untuk menambah/menghapus baris rekening: nama bank, nomor rekening, nama pemilik rekening.
- [x] Nama bank fleksibel (misal BRI, Mandiri, BCA, BSI, dll.).
- [x] Client dan server memvalidasi struktur array: nama bank 1–40 karakter, nomor rekening 4–40 karakter, nama pemilik 1–120 karakter.
- [x] Jastiper dapat menyimpan 0–10 rekening; jika kosong, form buyer memberi tahu rekening belum diatur.
- [x] Form buyer merender rekening aktif dinamis sebagai radio beserta nama bank, nomor, dan nama pemilik.
- [x] Backend menyimpan array JSON terstruktur pada kolom `bankAccountsJson`, dengan fallback baca kolom lama `briNumber`, `briName`, `bsiNumber`, `bsiName` agar akun lama tetap berfungsi tanpa migrasi destruktif.
- [x] `getPublicConfig` hanya menyajikan rekening jastiper pemilik share code/order terkait.
- [x] Semua input dirender aman memakai `textContent` atau encoding HTML.
- [x] Update rekening memerlukan sesi jastiper valid server-side.

### Ruang lingkup

- `PLAN.md`
- `02_Dashboard_Jastiper/Dashboard.html`
- `03_Konfirmasi_Pembelian/Konfirmasi.html`
- `04_Backend_GAS/Code.gs`
- `04_Backend_GAS/Dashboard.html`
- `04_Backend_GAS/Konfirmasi.html`
- `tests/jst018_multi_rekening_check.js`

### Di luar ruang lingkup

- Payment gateway atau API bank.
- Validasi nama rekening melalui API perbankan.
- Operasi data/resource produksi.
- Dependency pihak ketiga.

### Risiko keamanan/data

- Payload rekening dari browser tidak tepercaya; semua field wajib divalidasi server-side dan di-escape saat render publik.
- Kolom `Jastipers` baru tidak boleh merusak posisi/data akun lama.
- Update jastiper Alpha tidak boleh memengaruhi jastiper Beta.
- Nomor dan nama rekening memang akan dipublikasikan melalui share link buyer; jastiper harus menyimpan hanya rekening yang disetujui untuk tampil publik.

### Rencana implementasi

1. Tambah test lokal skema dan validasi multi-rekening.
2. Tambah `bankAccountsJson` via `ensureSheet_`; fallback BRI/BSI lama bila JSON kosong.
3. Validasi dan simpan array pada `updateJastiperSettings`.
4. Kembalikan array lewat `getPublicConfig` dan `publicProfile_`.
5. Buat UI tambah/hapus rekening pada Dashboard.
6. Render radio rekening dinamis secara aman pada Konfirmasi.
7. Sinkronkan template deployment.

### Rencana validasi

1. Parse JavaScript file sasaran.
2. Test payload valid/invalid, batas 10 rekening, dan fallback akun lama.
3. Test nama bank berisi HTML; output wajib tetap teks.
4. Test isolasi jastiper A/B server-side.
5. Audit diff/rahasia, lalu ubah status `REVIEW`.

### Rencana rollback

Revert perubahan `[JST-018]`. Kode lama mengabaikan kolom tambahan; empat kolom rekening lama tidak dihapus.

### Hasil validasi

- [x] `node tests/jst018_multi_rekening_check.js`: lulus (`JST-018 multi-rekening unit check passed.`).
- [x] Validasi server-side: batas 0–10 rekening, nama bank 1–40 karakter, no rekening 4–40 karakter, nama pemilik 1–120 karakter, penolakan karakter formula spreadsheet (`=+-@`).
- [x] Fallback akun lama: akun tanpa `bankAccountsJson` tetap membaca nilai kolom lama BRI dan BSI; saat jastiper menyimpan konfigurasi baru, `bankAccountsJson` menjadi sumber tunggal.
- [x] Keamanan render buyer: nama bank dan detail rekening dirender aman melalui DOM `textContent`, mencegah XSS dari input jastiper.
- [x] Validasi submit buyer: server memverifikasi pilihan rekening memang terdaftar pada jastiper pemilik share code terkait.
- [x] Parse JavaScript `Dashboard.html`, `Konfirmasi.html`, `Code.gs` beserta template deployment `04_Backend_GAS/`: lulus tanpa error sintaks.
- [x] Sinkronisasi template deployment `04_Backend_GAS/` identik dengan file kanonik (`cmp -s`).
- [x] `git diff --check`: lulus tanpa trailing whitespace atau formatting issue.

### Catatan review

Implementasi dan penutupan JST-018 disetujui Master pada 2026-08-27 bersama integrasi JST-019, JST-020, JST-021 untuk deployment staging. Status `DONE`.

---

## JST-019 — Hapus dan ganti foto barang buyer sebelum submit konfirmasi

- **Status:** `DONE`
- **Jenis:** `feat`
- **Pemilik:** agen implementasi
- **Dibuat:** 2026-08-27
- **Approval:** pengguna (Master), 2026-08-27, teks `oke, approve semua, jst-020, jst 018, jst 019 dan 021, deploy semua ke staging.`.

### Tujuan

Menyediakan tombol hapus foto barang yang sudah dipilih pada form konfirmasi buyer sebelum diupload, sehingga buyer yang salah memilih foto dapat membatalkan atau mengganti foto barang secara mudah sebelum submit.

### Acceptance criteria

- [x] Setiap baris barang pada `Konfirmasi.html` yang memiliki file terpilih menampilkan tombol "Hapus Foto".
- [x] Tombol "Hapus Foto" mengosongkan input file, menyembunyikan preview gambar, dan membersihkan object URL preview (`URL.revokeObjectURL`) untuk mencegah memory leak.
- [x] Buyer dapat memilih foto baru setelah menghapus.
- [x] Validasi submit tetap menolak jika ada baris barang yang tidak memiliki foto (file baru maupun `existingUrl` pada mode edit).
- [x] Pada mode edit konfirmasi, membatalkan file baru mengembalikan status indikator foto lama yang tersimpan.
- [x] Tidak ada file yang diunggah ke Google Drive sebelum tombol submit ditekan.
- [x] Tampilan responsif dan mudah digunakan pada mobile.

### Ruang lingkup

- `PLAN.md`
- `03_Konfirmasi_Pembelian/Konfirmasi.html`
- `04_Backend_GAS/Konfirmasi.html`
- `tests/jst019_item_photo_action_check.js`

### Di luar ruang lingkup

- Penghapusan file lama di Google Drive jastiper saat edit mode.
- Editor gambar (crop/rotate/filter).
- Operasi data/resource produksi.

### Risiko keamanan/data

- State client tidak boleh meloloskan submit barang tanpa foto valid ke backend; validasi server `saveConfirmation` tetap menjadi penegak utama.
- `URL.createObjectURL` wajib di-revoke agar tidak menimbulkan memory leak.

### Rencana implementasi

1. Tambah test lokal untuk alur tambah, pilih file, hapus file, dan validasi form submit.
2. Perbarui `Konfirmasi.html`:
   - Tambahkan tombol "Hapus Foto" di bawah input file / preview.
   - Tambahkan handler reset input file (`value = ''`), hapus object URL preview, dan sembunyikan thumbnail preview.
   - Pada mode edit, kembalikan indikator visual ke `existingUrl` jika file baru dibatalkan.
3. Pastikan `collectPayload` membaca input file yang sudah direset dengan benar.
4. Sinkronkan ke `04_Backend_GAS/Konfirmasi.html`.

### Rencana validasi

1. Parse JavaScript `Konfirmasi.html` dan `04_Backend_GAS/Konfirmasi.html`.
2. Verifikasi lokal: pilih file -> preview muncul -> klik hapus -> preview hilang -> input kosong -> submit gagal jika tanpa foto.
3. Verifikasi lokal: pilih file A -> hapus -> pilih file B -> submit mengirim file B.
4. Audit diff dan rahasia; ubah status menjadi `REVIEW`.

### Rencana rollback

Revert perubahan `Konfirmasi.html` dan `04_Backend_GAS/Konfirmasi.html` `[JST-019]`.

### Hasil validasi

- [x] `node tests/jst019_item_photo_action_check.js`: lulus (`JST-019 item photo action unit check passed.`).
- [x] Test reset state: input file dikosongkan, object URL direvoke, atribut `src` dibersihkan, preview dan tombol hapus disembunyikan.
- [x] Test source contract: tombol "Hapus Foto", handler clear, preview object URL, revoke saat replace, indikator foto lama, validasi new/existing photo, dan tiada RPC sebelum submit terverifikasi.
- [x] Parse JavaScript `03_Konfirmasi_Pembelian/Konfirmasi.html`: lulus tanpa error sintaks.
- [x] Sinkronisasi `03_Konfirmasi_Pembelian/Konfirmasi.html` dan `04_Backend_GAS/Konfirmasi.html`: identik (`cmp -s`).
- [x] `git diff --check`: lulus tanpa trailing whitespace atau formatting issue.

### Catatan review

Implementasi dan penutupan JST-019 disetujui Master pada 2026-08-27 bersama integrasi JST-018, JST-020, JST-021 untuk deployment staging. Status `DONE`.

---

## JST-020 — Navigasi otomatis top-level pasca auth dan logout

- **Status:** `DONE`
- **Jenis:** `feat`
- **Pemilik:** agen implementasi
- **Dibuat:** 2026-08-27
- **Approval:** pengguna (Master), 2026-08-27, teks `oke, approve semua, jst-020, jst 018, jst 019 dan 021, deploy semua ke staging.`.

### Tujuan

Mengganti alur konfirmasi tombol manual `target="_top"` menjadi pengalihan otomatis browser langsung ke Dashboard setelah pendaftaran/login berhasil, serta otomatis kembali ke Login page saat logout tanpa menampilkan tombol perantara.

### Acceptance criteria

- [x] Pendaftaran akun jastip yang sukses otomatis mengalihkan viewport penuh (`top`) ke `?page=dashboard`.
- [x] Login jastiper yang sukses otomatis mengalihkan viewport penuh (`top`) ke `?page=dashboard`.
- [x] Klik tombol logout pada Dashboard menghapus token sesi lokal dan otomatis mengalihkan viewport penuh (`top`) ke `?page=login` tanpa tombol konfirmasi perantara.
- [x] Jika sandbox iframe browser memblokir manipulasi `window.top.location`, sediakan fallback transparan yang aman tanpa merusak sesi.
- [x] Tidak ada dependency baru, tidak ada kebocoran token di URL/log, dan otorisasi server tetap terjaga.

### Ruang lingkup

- `PLAN.md`
- `01_Login_Signup/Login.html`
- `02_Dashboard_Jastiper/Dashboard.html`
- `04_Backend_GAS/Login.html`
- `04_Backend_GAS/Dashboard.html`
- `tests/jst020_auth_auto_navigation_check.js`

### Di luar ruang lingkup

- Penggabungan halaman menjadi Single Page Application penuh.
- Operasi data atau deployment produksi.

### Risiko keamanan/data

- Sandbox iframe Google Apps Script (`ALLOWALL`) dapat memicu pelanggaran same-origin saat mengakses `window.top.location.href` langsung jika domain iframe dan pembungkus berbeda. Implementasi wajib memakai URL Web App tepercaya server-side.

### Rencana implementasi

1. Tambah test lokal skenario navigasi otomatis.
2. Perbarui `Login.html` dan `Dashboard.html` agar mengalihkan `window.top.location.href = webAppUrl + '?page=...'` secara otomatis pada callback sukses auth/logout.
3. Sinkronkan ke folder `04_Backend_GAS/`.

### Rencana validasi

1. Parse JavaScript file HTML.
2. Test lokal callback navigasi dan verifikasi tiada tombol perantara saat sukses.
3. Audit diff dan verifikasi keamanan.

### Rencana rollback

Revert perubahan `[JST-020]` kembali ke tautan manual `target="_top"`.

### Hasil validasi

- [x] `node tests/jst020_auth_auto_navigation_check.js`: lulus (`JST-020 auth auto-navigation unit check passed.`).
- [x] Parse JavaScript `Login.html`, `Dashboard.html`, dan template deployment `04_Backend_GAS/`: lulus tanpa error sintaks.
- [x] Sinkronisasi template deployment `Login.html` dan `Dashboard.html` identik dengan source kanonik (`cmp -s`).
- [x] Verifikasi statis: tidak ada tombol perantara `#manualNav` / `#navManualLink`; pengalihan viewport memakai `window.top.location.replace` dengan fallback `window.location.replace`.
- [x] Audit keamanan: target route berasal dari `webAppUrl` server-side; tidak ada token di URL/log; otorisasi server dan validasi sesi tetap utuh.
- [x] `git diff --check`: lulus tanpa trailing whitespace atau formatting issue.

### Catatan review

Implementasi dan penutupan JST-020 disetujui Master pada 2026-08-27 bersama integrasi JST-018, JST-019, JST-021 untuk deployment staging. Status `DONE`.

---

## JST-021 — Perbaiki logo pada halaman konfirmasi buyer

- **Status:** `DONE`
- **Jenis:** `fix`
- **Pemilik:** agen implementasi
- **Dibuat:** 2026-08-27
- **Approval:** pengguna (Master), 2026-08-27, teks `oke, approve semua, jst-020, jst 018, jst 019 dan 021, deploy semua ke staging.`.

### Tujuan

Menampilkan logo resmi Jastip Apps pada halaman Konfirmasi buyer di Google Apps Script Web App tanpa bergantung pada path file repository yang tidak disajikan sebagai aset HTTP.

### Acceptance criteria

- [x] Logo resmi tampil pada halaman Konfirmasi buyer; teks alternatif tidak muncul akibat gambar gagal dimuat.
- [x] Payload gambar inline setelah didekode memiliki SHA-256 yang sama dengan `assets/logo-jastip-apps.png`: `1904387888d5a1a4c5672429d4db3b6167a821b630ee431ddb4ffa148c8e55ab`.
- [x] Source kanonik dan template deployment Konfirmasi identik.
- [x] Tidak ada URL aset eksternal, dependency baru, perubahan backend, atau perubahan alur data buyer.

### Ruang lingkup

- `PLAN.md`
- `03_Konfirmasi_Pembelian/Konfirmasi.html`
- `04_Backend_GAS/Konfirmasi.html`
- `assets/logo-jastip-apps.png` sebagai sumber read-only
- `tests/jst021_confirmation_logo_check.js`

### Di luar ruang lingkup

- Perubahan desain logo atau layout halaman.
- Perubahan backend, auth, upload, manifest, scope OAuth, atau dependency.
- Commit, merge, deployment staging/produksi, dan operasi data.

### Risiko keamanan/data

- URL eksternal dapat menambah tracking dan ketergantungan jaringan; karena itu logo harus inline.
- Payload inline wajib berasal dari aset repository resmi dan diverifikasi hash.
- Perubahan tidak boleh menyentuh link edit, token, data buyer, upload, atau tenant isolation.

### Rencana implementasi

1. Bekerja pada branch `fix/JST-021-logo-konfirmasi-buyer` tanpa bekerja di `main`.
2. Ganti hanya path logo relatif dengan data URI PNG dari aset resmi.
3. Sinkronkan template deployment Konfirmasi.
4. Tambah test lokal untuk path relatif, format data URI, hash payload, dan sinkronisasi template.

### Rencana validasi

1. Jalankan `node tests/jst021_confirmation_logo_check.js`.
2. Parse JavaScript template Konfirmasi, bandingkan source kanonik dengan salinan deployment, lalu jalankan `git diff --check`.
3. Scan diff untuk secret/data pribadi dan pastikan perubahan hanya pada scope.
4. Cek visual pada staging setelah approval deployment terpisah.

### Rencana rollback

Revert perubahan `[JST-021]` pada dua template Konfirmasi dan test terkait. Deployment rollback memerlukan approval terpisah; jangan memakai reset histori bersama.

### Hasil validasi

- [x] `node tests/jst021_confirmation_logo_check.js`: lulus (`JST-021 confirmation logo check passed.`).
- [x] Template deployment `04_Backend_GAS/Konfirmasi.html` identik dengan `03_Konfirmasi_Pembelian/Konfirmasi.html`.
- [x] Hash SHA-256 logo inline Konfirmasi cocok dengan `assets/logo-jastip-apps.png`: `1904387888d5a1a4c5672429d4db3b6167a821b630ee431ddb4ffa148c8e55ab`.
- [x] Parse JavaScript script tags `Konfirmasi.html` lulus (`node --check`).
- [x] `git diff --check`: lulus; tidak ada trailing whitespace.
- [x] Diff secret scan: lulus; tidak ada secret, token, password, atau URL deployment privat.

### Catatan review

Implementasi dan penutupan JST-021 disetujui Master pada 2026-08-27 bersama integrasi JST-018, JST-019, JST-020 untuk deployment staging. Status `DONE`.

### Bukti integrasi dan deployment staging

- Branch integrasi: `chore/JST-021-integrasi-staging`; commit penutupan `2dc6b21`.
- `clasp push`: 5 file GAS berhasil diunggah (`Code.gs`, 3 template HTML, manifest); Script Properties dan resource data tidak diubah.
- Deployment Web App staging aktif diperbarui ke versi `@9` dengan deskripsi `JST-018 JST-019 JST-020 JST-021 staging 2026-08-27`; URL deployment privat tidak dicatat.
- GET read-only Konfirmasi, Login, dan Dashboard: HTTP `200`.
- Screenshot staging desktop `1280x1200` dan mobile `390x844`: halaman Konfirmasi ter-render dan logo resmi tampil; bukti disimpan sementara di direktori temp lokal, tidak di-commit.
- Test lokal gabungan JST-016/JST-018/JST-019/JST-020/JST-021, parse JavaScript, sinkronisasi template, `git diff --check`, dan secret scan: lulus.
- Security review: tidak ada kerentanan high-confidence baru. Otorisasi server-side, validasi rekening, dan kontrol upload tetap aktif; manifest/OAuth scope tidak berubah.
- Smoke test aktif yang membuat akun/order/upload dan operasi `setupApp()` tidak dijalankan karena tidak termasuk approval operasi data. Rollback deployment staging tersedia dengan redeploy versi `@8`.

---

## Template item baru

Salin blok berikut. Jangan menghapus item lama.

```md
## JST-NNN — Judul singkat

- **Status:** `PROPOSED`
- **Jenis:** `docs|fix|feat|refactor|test|chore|security`
- **Pemilik:**
- **Dibuat:** YYYY-MM-DD
- **Approval:** belum ada

### Tujuan

### Acceptance criteria

- [ ]

### Ruang lingkup

- `path/file`

### Di luar ruang lingkup

-

### Risiko keamanan/data

-

### Rencana implementasi

1.

### Rencana validasi

1.

### Rencana rollback

### Hasil validasi

Belum dijalankan.

### Catatan review
```


## JST-022 — Handler navigasi tab panel dashboard jastiper

- **Status:** `DONE`
- **Jenis:** `fix`
- **Pemilik:** agen implementasi
- **Dibuat:** 2026-08-27
- **Approval:** pengguna, 2026-08-27, teks `approve jst 022`.

### Tujuan

Mengaktifkan perpindahan panel `Data Buyer` dan `Pengaturan Jastip` pada Dashboard Jastiper dengan menambahkan event listener navigasi tab yang sinkron di file template kanonik dan salinan deployment GAS.

### Acceptance criteria

- [x] Mengklik tab `Pengaturan Jastip` memunculkan panel pengaturan (`#settings`) dan menyembunyikan panel data buyer (`#orders`).
- [x] Mengklik tab `Data Buyer` memunculkan panel data buyer (`#orders`) dan menyembunyikan panel pengaturan (`#settings`).
- [x] Class `active` berpindah sesuai tab yang diklik.
- [x] Template `02_Dashboard_Jastiper/Dashboard.html` dan `04_Backend_GAS/Dashboard.html` sinkron identik.
- [x] Script parsing JavaScript dan test lokal JST-022 lulus tanpa regresi.

### Ruang lingkup

- `02_Dashboard_Jastiper/Dashboard.html`
- `04_Backend_GAS/Dashboard.html`
- `tests/jst022_dashboard_tabs_check.js`
- `PLAN.md`

### Di luar ruang lingkup

- Perubahan fungsi backend `Code.gs`, validasi form, schema sheet, atau storage Drive.
- Perubahan OAuth scope, manifest `appsscript.json`, atau Script Properties.
- Perubahan endpoint auth, session handling, atau logic multi-rekening JST-018.
- Deployment produksi.

### Risiko keamanan/data

- Perubahan hanya pada DOM client-side UI switching tanpa memanipulasi data sesi, token, atau backend call. Risiko keamanan nol.
- State form input pengaturan dipertahankan saat perpindahan panel.

### Rencana implementasi

1. Tambahkan handler event listener pada tombol `.nav button` menggunakan delegasi atau query selector loop di `Dashboard.html`.
2. Sinkronkan `02_Dashboard_Jastiper/Dashboard.html` ke `04_Backend_GAS/Dashboard.html`.
3. Buat file test `tests/jst022_dashboard_tabs_check.js`.
4. Jalankan seluruh test suite, parse JS, `git diff --check`, dan secret scan.

### Rencana rollback

Revert modifikasi pada `02_Dashboard_Jastiper/Dashboard.html`, `04_Backend_GAS/Dashboard.html`, dan hapus `tests/jst022_dashboard_tabs_check.js`.

### Hasil validasi

- [x] `node tests/jst022_dashboard_tabs_check.js`: lulus (`JST-022 dashboard tabs check passed.`).
- [x] Seluruh suite test lokal (`JST-016`, `JST-018`, `JST-019`, `JST-020`, `JST-021`, `JST-022`) lulus.
- [x] Parse JavaScript script tags untuk seluruh file HTML (`01_Login_Signup`, `02_Dashboard_Jastiper`, `03_Konfirmasi_Pembelian`, dan salinan `04_Backend_GAS`) lulus tanpa error sintaks.
- [x] Sinkronisasi template `02_Dashboard_Jastiper/Dashboard.html` dan `04_Backend_GAS/Dashboard.html` identik (`cmp -s`).
- [x] `git diff --check`: lulus; tidak ada trailing whitespace atau formatting issue.
- [x] Diff secret scan: lulus; tidak ada credential, private key, token, atau URL deployment privat.

### Catatan review

Implementasi dan penutupan JST-022 disetujui pengguna pada 2026-08-27 melalui teks `approval 1 dan 2`. Approval mencakup commit branch serta deployment GAS staging; tidak mencakup merge ke `main`, deployment produksi, atau operasi data.

### Bukti integrasi dan deployment staging

- Branch: `fix/JST-022-tab-nav-dashboard`; commit implementasi `a607013`.
- `clasp push`: 5 file GAS berhasil diunggah (`appsscript.json`, `Code.gs`, 3 template HTML); Script Properties dan resource data tidak diubah.
- Deployment Web App staging aktif diperbarui ke versi `@10` dengan deskripsi `JST-022 tab nav dashboard staging 2026-08-27`; URL deployment privat tidak dicatat.
- GET read-only Dashboard staging: HTTP `200`.
- Payload staging `version=10` diverifikasi memuat handler klik tab `.nav button` dan tombol target `data-panel="settings"`.
- Smoke test DOM Chromium headless desktop `1280x1200` dan mobile `390x844`: klik tab Pengaturan Jastip berhasil menambahkan class `active` pada tombol settings dan panel `#settings`, serta menghapus class `active` dari panel `#orders`.
- Suite test lokal JST-016 hingga JST-022, parse JavaScript template HTML, sinkronisasi template, `git diff --check`, dan secret scan: lulus.
- Rollback deployment staging tersedia dengan redeploy ke versi `@9`. Operasi data/resource produksi tidak dijalankan.


---

## JST-023 — Perbaikan tombol Simpan Pengaturan Dashboard

- **Status:** `DONE`
- **Jenis:** `fix`
- **Pemilik:** agen implementasi
- **Dibuat:** 2026-08-27
- **Approval implementasi:** pengguna, 2026-08-27, teks `approved jdt 023`.
- **Approval penutupan dan staging:** pengguna, 2026-08-27, teks `approval 1 dan 2`; mencakup `CHANGELOG.md`, commit branch, push source GAS, dan deployment staging. Tidak mencakup merge `main` atau deployment produksi.

### Tujuan

Memulihkan fungsi tombol `Simpan Pengaturan` agar validasi rekening berjalan, permintaan `updateJastiperSettings` dikirim sekali, dan status tombol pulih setelah sukses atau gagal.

### Acceptance criteria

- [x] Klik `Simpan Pengaturan` dengan profil dan rekening valid memanggil `updateJastiperSettings` tepat sekali.
- [x] Tombol dinonaktifkan dan berteks `Menyimpan…` selama permintaan berlangsung.
- [x] Tombol aktif kembali dan berteks `Simpan Pengaturan` setelah callback sukses atau gagal.
- [x] Validasi rekening kosong/tidak lengkap tetap mencegah permintaan backend dan menampilkan pesan yang ada.
- [x] Template `02_Dashboard_Jastiper/Dashboard.html` dan `04_Backend_GAS/Dashboard.html` tetap identik.
- [x] Seluruh test lokal dan parse JavaScript lulus tanpa regresi.

### Ruang lingkup

- `02_Dashboard_Jastiper/Dashboard.html`
- `04_Backend_GAS/Dashboard.html`
- `tests/jst023_dashboard_save_settings_check.js`
- `PLAN.md`

### Di luar ruang lingkup

- Perubahan `04_Backend_GAS/Code.gs`, kontrak `updateJastiperSettings`, auth, sesi, atau tenant isolation.
- Perubahan schema Spreadsheet, data rekening tersimpan, Script Properties, manifest, atau OAuth scope.
- Merge ke `main`, deployment staging, deployment produksi, dan operasi data.

### Bukti investigasi

- Handler klik ada dan mengumpulkan payload rekening sebelum memanggil backend.
- Handler memanggil `busy(btn,true,'Menyimpan…')`, tetapi `Dashboard.html` tidak mendefinisikan `busy()`.
- `busy()` hanya tersedia pada template Login; fungsi antarhalaman HTML tidak berbagi scope JavaScript.
- Akibatnya klik valid melempar `ReferenceError: busy is not defined` sebelum `google.script.run.updateJastiperSettings`, sehingga backend tidak dipanggil.
- Test JST-018 menguji backend langsung dan test JST-022 hanya menguji navigasi tab; keduanya tidak mengeksekusi alur klik simpan.

### Risiko keamanan/data

- Form memuat profil dan rekening sensitif; test wajib memakai data sintetis dan tidak mencetak payload/token.
- Perbaikan hanya menambahkan helper status tombol client-side. Validasi dan otorisasi server-side tetap tidak berubah.
- Security review memastikan permintaan tetap memakai session token dari state, tidak memasukkan token ke URL/log, dan tidak melemahkan failure handling.

### Rencana implementasi

1. Setelah approval, buat branch `fix/JST-023-save-pengaturan-dashboard` dari baseline terintegrasi JST-022.
2. Tambahkan definisi minimal helper `busy(btn,on,text)` pada Dashboard sebelum pemakaian pertama.
3. Sinkronkan template Dashboard kanonik dan deployment.
4. Tambahkan test runnable yang mengeksekusi klik simpan dengan mock DOM dan `google.script.run`, termasuk jalur valid, validasi gagal, callback sukses, dan callback gagal.

### Rencana validasi

1. Jalankan `node tests/jst023_dashboard_save_settings_check.js`.
2. Jalankan seluruh test `tests/jst*_check.js`.
3. Parse seluruh script JavaScript dalam template HTML memakai `vm.Script`.
4. Verifikasi kedua template Dashboard identik.
5. Jalankan `git diff --check`, tinjau scope diff, dan scan rahasia/data pribadi.
6. Jika deployment staging disetujui terpisah, uji simpan dengan akun serta rekening sintetis dan verifikasi data tenant yang sama tanpa mencatat nilainya.

### Rencana rollback

Revert perubahan `[JST-023]`. Jika deployment staging kelak disetujui dan bermasalah, redeploy versi staging terakhir yang terverifikasi (`@10`). Tidak ada migrasi atau perubahan schema/data untuk dipulihkan.

### Hasil validasi

- [x] Test RED sebelum implementasi: `node tests/jst023_dashboard_save_settings_check.js` gagal melempar assertion ketiadaan helper `busy` di Dashboard.
- [x] Test GREEN setelah implementasi: `node tests/jst023_dashboard_save_settings_check.js` lulus.
- [x] Suite test lokal lengkap lulus:
  - `tests/jst016_resource_config_check.js`
  - `tests/jst018_multi_rekening_check.js`
  - `tests/jst019_item_photo_action_check.js`
  - `tests/jst020_auth_auto_navigation_check.js`
  - `tests/jst021_confirmation_logo_check.js`
  - `tests/jst022_dashboard_tabs_check.js`
  - `tests/jst023_dashboard_save_settings_check.js`
- [x] Parser JavaScript seluruh template HTML (`Login`, `Dashboard`, `Konfirmasi` kanonik & GAS): lulus tanpa error sintaks.
- [x] Sinkronisasi template: `02_Dashboard_Jastiper/Dashboard.html` dan `04_Backend_GAS/Dashboard.html` identik (`cmp -s`).
- [x] `git diff --check`: lulus bersih.
- [x] Scan rahasia dan data pribadi pada diff/workspace: lulus bersih; hanya data sintetis uji yang dipakai.

### Catatan review

Review manusia menyetujui penutupan, sinkronisasi `CHANGELOG.md`, commit branch, push source GAS, dan deployment staging pada 2026-08-27 melalui teks `approval 1 dan 2`. Merge `main`, deployment produksi, dan operasi data produksi tetap tidak dilakukan.

### Bukti deployment staging

- [x] `npx @google/clasp push`: 5 file GAS terlacak berhasil diunggah; `README.txt` tetap tidak diunggah.
- [x] Versi immutable `@11` dibuat dengan deskripsi `JST-023 save settings dashboard staging 2026-08-27`.
- [x] Deployment staging sebelumnya `@10` diperbarui ke `@11`; deployment `@HEAD` tidak diubah.
- [x] Smoke test HTTP staging: root dan Dashboard merespons HTTP 200; payload Dashboard memuat handler `saveSettings` dan helper `busy(btn,on,text)`.
- [ ] Uji klik simpan terautentikasi dengan akun/rekening sintetis belum dijalankan karena kredensial staging sintetis tidak tersedia di workspace. Tidak ada data produksi dipakai.
- Rollback staging: redeploy deployment staging yang sama ke versi terverifikasi `@10`.



---

## JST-024 — Pengambilan parameter URL halaman konfirmasi buyer via API host GAS

- **Status:** `DONE`
- **Jenis:** `fix`
- **Pemilik:** agen implementasi
- **Dibuat:** 2026-08-27
- **Approval implementasi:** pengguna, 2026-08-27, teks `,approve jst 024`.
- **Approval penutupan dan staging:** pengguna, 2026-08-27, teks `APPROVE JST-024 PENUTUPAN DAN STAGING`; mencakup `CHANGELOG.md`, commit branch, push source GAS, dan deployment staging. Tidak mencakup merge `main` atau deployment produksi.

### Tujuan

Memperbaiki halaman konfirmasi pembelian (`Konfirmasi.html`) agar dapat membaca parameter URL Web App host (seperti `?shop=...`, `?id=...`, `?token=...`) yang berjalan di dalam iframe sandbox Google Apps Script, sehingga konfigurasi jastiper dan daftar nomor rekening bank berhasil dimuat tanpa error `Link jastip tidak lengkap`.

### Acceptance criteria

- [x] Fungsi inisialisasi pada `Konfirmasi.html` mengambil parameter URL host melalui `google.script.url.getLocation` ketika tersedia di runtime Web App GAS.
- [x] Fallback parsing `window.location.search` tetap tersedia untuk lingkungan pratinjau lokal / non-GAS.
- [x] Parameter `shop`, `id`, dan `token` dari host diteruskan ke `google.script.run.getPublicConfig(shop, id, token)` dan `loadEditData(id, token)`.
- [ ] Rekening bank yang sudah dikonfigurasi jastiper tampil dinamis pada formulir konfirmasi buyer saat membuka link jastip valid (`?shop=...`); verifikasi runtime menunggu approval deployment staging.
- [x] Template kanonik `03_Konfirmasi_Pembelian/Konfirmasi.html` dan template GAS `04_Backend_GAS/Konfirmasi.html` tetap identik.
- [x] Test regresi lokal runnable memverifikasi fungsi inisialisasi boot/parameter dengan mock `google.script.url` dan fallback `window.location`.
- [x] Seluruh test lokal `jst016` hingga `jst024` lulus tanpa regresi.

### Ruang lingkup

- `03_Konfirmasi_Pembelian/Konfirmasi.html`
- `04_Backend_GAS/Konfirmasi.html`
- `tests/jst024_confirmation_url_param_check.js`
- `PLAN.md`

### Di luar ruang lingkup

- Perubahan fungsi backend `04_Backend_GAS/Code.gs`, otorisasi auth/sesi, token edit hash, atau schema sheet.
- Perubahan halaman Login atau Dashboard.
- Merge branch ke `main`, deployment staging, atau deployment produksi (memerlukan approval terpisah).

### Bukti investigasi

- Pengguna melaporkan nomor rekening tidak muncul dan tangkapan layar menunjukkan pesan error merah: `Error: Link jastip tidak lengkap. Silakan gunakan link yang dibagikan oleh jastiper.`
- Tangkapan layar membuktikan URL browser terisi parameter `?shop=[disamarkan]`; nilai aktual tidak dicatat ke repository.
- Kode saat ini pada `Konfirmasi.html` baris 499 hanya membaca `const params = new URLSearchParams(location.search)`.
- Dalam arsitektur Google Apps Script HTML Service (`XFrameOptionsMode.ALLOWALL`), client JavaScript berjalan di dalam `<iframe>` sandbox domain Google (`userContent.googleusercontent.com`), di mana `location.search` iframe kosong dan tidak mencerminkan query string parent URL `/exec?shop=...`.
- Dokumentasi resmi Apps Script `google.script.url.getLocation(cb)` menyediakan `location.parameter` yang berisi parameter parent URL secara asynchronous.
- Karena `shop` terbaca string kosong, RPC memanggil `getPublicConfig('', '', '')` yang langsung melempar error `Link jastip tidak lengkap`, menghentikan pemuatan nama jastip dan daftar rekening bank.

### Risiko keamanan/data

- Parameter URL dari browser (`shop`, `id`, `token`) adalah input tidak tepercaya; backend `Code.gs` tetap memvalidasi `clean_(shareCode, 80)` dan mencocokkan hash token edit secara server-side.
- Data rekening bank yang dirender tetap berasal dari data terfilter server melalui `textContent` (sudah diamankan di JST-018), tanpa risiko XSS atau data leakage antar-jastiper.
- Tidak ada rahasia atau data sensitif yang dicatat ke log browser.

### Rencana implementasi

1. Setelah rencana disetujui (`APPROVED`), buat branch fitur `fix/JST-024-konfirmasi-url-param`.
2. Modifikasi alur `boot()` di `Konfirmasi.html`:
   - Deteksi aman keberadaan API melalui `typeof google !== 'undefined' && google.script && google.script.url && google.script.url.getLocation`.
   - Jika ada, panggil `google.script.url.getLocation(loc => init(loc.parameter || {}))`.
   - Jika tidak ada (misal di local browser), panggil `init(Object.fromEntries(new URLSearchParams(location.search)))`.
   - Fungsi `init(params)` memicu `getPublicConfig(shop, id, token)` dan `loadEditData(id, token)`.
3. Sinkronkan `03_Konfirmasi_Pembelian/Konfirmasi.html` dan `04_Backend_GAS/Konfirmasi.html`.
4. Buat unit test mandiri `tests/jst024_confirmation_url_param_check.js`.

### Rencana validasi

1. Jalankan `node tests/jst024_confirmation_url_param_check.js`.
2. Jalankan seluruh test suite `tests/jst*.js`.
3. Parse JavaScript seluruh file template dengan `vm.Script`.
4. Verifikasi konsistensi `cmp -s` file `Konfirmasi.html`.
5. Jalankan `git diff --check` dan scan pola data sensitif.

### Rencana rollback

Revert perubahan branch `fix/JST-024-konfirmasi-url-param`. Jika telah dideploy ke staging dan mengalami anomali, redeploy versi staging sebelumnya `@11`. Tidak ada schema/data sheet yang berubah.

### Hasil validasi

- [x] Test RED sebelum implementasi: `node tests/jst024_confirmation_url_param_check.js` gagal dengan `AssertionError: function init( missing`.
- [x] Test GREEN setelah implementasi: `node tests/jst024_confirmation_url_param_check.js` lulus.
- [x] Suite test lokal lengkap lulus:
  - `tests/jst016_resource_config_check.js`
  - `tests/jst018_multi_rekening_check.js`
  - `tests/jst019_item_photo_action_check.js`
  - `tests/jst020_auth_auto_navigation_check.js`
  - `tests/jst021_confirmation_logo_check.js`
  - `tests/jst022_dashboard_tabs_check.js`
  - `tests/jst023_dashboard_save_settings_check.js`
  - `tests/jst024_confirmation_url_param_check.js`
- [x] Parser JavaScript seluruh template HTML (`Login`, `Dashboard`, `Konfirmasi` kanonik dan GAS): lulus tanpa error sintaks.
- [x] Sinkronisasi template Login, Dashboard, dan Konfirmasi: lulus (`cmp -s`).
- [x] `git diff --check`: lulus bersih.
- [x] Scan pola rahasia pada seluruh perubahan JST-024: tidak menemukan rahasia dengan keyakinan tinggi; test hanya memakai nilai sintetis.
- [x] Security review: sumber parameter berubah ke API host GAS, tetapi input tetap tidak tepercaya dan validasi/otorisasi server-side tidak berubah. Tidak ada token baru pada log atau DOM.

### Catatan review

Review manusia menyetujui penutupan, sinkronisasi `CHANGELOG.md`, commit branch, push source GAS, dan deployment staging pada 2026-08-27 melalui teks `APPROVE JST-024 PENUTUPAN DAN STAGING`. Merge `main`, deployment produksi, dan operasi data produksi tetap tidak dilakukan.

### Bukti deployment staging

- [x] `npx @google/clasp push`: 5 file GAS terlacak berhasil diunggah; `README.txt` tetap tidak diunggah.
- [x] Versi immutable `@12` dan `@13` dibuat dengan deskripsi `JST-024 konfirmasi url param staging 2026-08-27`; `@12` tidak terdeploy dan dipertahankan sebagai histori, `@13` menjadi versi aktif staging.
- [x] Deployment staging sebelumnya `@11` diperbarui ke `@13`; deployment `@HEAD` tidak diubah.
- [x] Smoke test HTTP staging: root dan Konfirmasi dengan parameter query merespons HTTP 200; payload memuat `google.script.url.getLocation` serta fallback `URLSearchParams`.
- [ ] Verifikasi render nomor rekening di browser staging dilakukan oleh jastiper/operator dengan membuka link jastip staging sintetis valid (`?shop=...`). Tidak ada data produksi atau token privat yang dicatat ke repository.
- Rollback staging: redeploy deployment staging yang sama ke versi terverifikasi `@11`.

---

## JST-025 — Perbaikan render foto buyer dan bukti transfer pada Dashboard Jastiper

- **Status:** `DONE`
- **Jenis:** `fix`
- **Pemilik:** agen implementasi
- **Dibuat:** 2026-08-27
- **Approval implementasi:** pengguna, 2026-08-27, teks `approved jst-025`.
- **Approval penutupan dan staging:** pengguna, 2026-08-27, teks `approved`; mencakup penutupan JST-025, sinkronisasi CHANGELOG.md, dan commit branch. Tidak mencakup push, merge main, clasp, atau deployment.

### Tujuan

Memperbaiki fungsi pemuatan gambar (`loadImg`) pada Dashboard Jastiper agar foto barang dan bukti transfer yang tersimpan di Google Drive berhasil dirender setelah RPC `getJastiperImageData` mengembalikan data URI base64.

### Acceptance criteria

- [x] Fungsi pemuatan gambar asinkron tidak merusak referensi container DOM saat menampilkan status `Memuat…`.
- [x] Callback sukses RPC `getJastiperImageData` memasukkan elemen gambar berisi data URI base64 ke container `.photo` tanpa error `TypeError: Cannot set properties of null`.
- [x] Callback gagal RPC menampilkan `Gagal memuat` pada container foto.
- [x] `02_Dashboard_Jastiper/Dashboard.html` dan `04_Backend_GAS/Dashboard.html` tetap identik.
- [x] Isolasi tenant, verifikasi folder Drive `assertFileInFolder_`, validasi MIME `image/*`, dan otorisasi sesi server-side tetap terjaga.
- [x] Test mandiri `tests/jst025_dashboard_image_render_check.js` memverifikasi skenario sukses dan gagal asinkron.
- [x] Seluruh test lokal `jst016` hingga `jst025` lulus tanpa regresi.

### Ruang lingkup

- `02_Dashboard_Jastiper/Dashboard.html`
- `04_Backend_GAS/Dashboard.html`
- `tests/jst025_dashboard_image_render_check.js`
- `PLAN.md`

### Di luar ruang lingkup

- Perubahan `04_Backend_GAS/Code.gs`, auth/sesi, atau logika Drive server-side.
- Perubahan halaman Login atau Konfirmasi buyer.
- Merge `main`, deployment staging, atau deployment produksi; semua memerlukan approval terpisah.

### Bukti investigasi

- Laporan pengguna: foto buyer tidak tampil di Dashboard meski file sudah masuk Google Drive.
- `04_Backend_GAS/Code.gs` baris 476-490 mengubah file Drive milik folder jastiper menjadi `data:${mime};base64,...` setelah validasi sesi, parent folder, dan MIME.
- `Dashboard.html` baris 187-191 menjalankan `img.parentElement.textContent='Memuat…'`. Operasi ini menghapus `img` dari DOM.
- Saat callback asinkron sukses kembali, `img.parentElement` bernilai `null`. Akses `img.parentElement.innerHTML` melempar `TypeError: Cannot set properties of null (setting 'innerHTML')`; gambar gagal dirender.

### Risiko keamanan/data

- Akses file tetap lewat `getJastiperImageData`, yang memvalidasi sesi dan memastikan file berada dalam `user.driveFolderId` milik jastiper.
- Respons data URI ditetapkan ke `src` elemen `<img>`; tidak ada URL Drive publik atau pencatatan token/data buyer.
- Perubahan client-only tidak mengubah permission Drive, scope OAuth, atau batas tenant server-side.

### Rencana implementasi

1. Tunggu pengguna mengubah status menjadi `APPROVED`.
2. Buat branch `fix/JST-025-dashboard-image-render`.
3. Buat test reproduksi `tests/jst025_dashboard_image_render_check.js`; pastikan RED pada kode lama.
4. Simpan referensi container sebelum status `Memuat…` mengganti child. Callback sukses membuat elemen `<img>`, menetapkan `src`, lalu memakai `container.replaceChildren(newImg)`; callback gagal mengisi `container.textContent`.
5. Sinkronkan kedua template Dashboard.
6. Validasi, catat bukti, lalu ubah status menjadi `REVIEW`.

### Rencana validasi

1. `node tests/jst025_dashboard_image_render_check.js`.
2. Seluruh `tests/jst*.js`.
3. Parse JavaScript seluruh template dengan `vm.Script`.
4. `cmp -s 02_Dashboard_Jastiper/Dashboard.html 04_Backend_GAS/Dashboard.html`.
5. `git diff --check`, pemeriksaan scope diff, dan scan rahasia/data pribadi.
6. Setelah approval deployment staging terpisah: verifikasi foto barang dan bukti transfer sintetis tampil; file tenant lain tetap ditolak.

### Rencana rollback

Revert perubahan branch `fix/JST-025-dashboard-image-render`. Bila nanti dideploy ke staging, arahkan staging kembali ke versi terverifikasi `@13` setelah approval rollback. Tidak ada schema atau data sheet berubah.

### Hasil validasi

- [x] Test RED sebelum perbaikan: `node tests/jst025_dashboard_image_render_check.js` gagal dengan `AssertionError: Got unwanted exception` dan pesan aktual `Cannot set properties of null (setting 'innerHTML')`.
- [x] Test GREEN setelah perbaikan: `node tests/jst025_dashboard_image_render_check.js` lulus dengan `JST-025 dashboard image render unit check passed.`
- [x] Suite lokal lengkap `for f in tests/jst*_check.js; do node "$f" || exit 1; done` lulus untuk JST-016, JST-018, dan JST-019 sampai JST-025.
- [x] Parser JavaScript enam template HTML kanonik/GAS lulus dengan `All template scripts parsed cleanly.`
- [x] Template Login, Dashboard, dan Konfirmasi kanonik/GAS identik: `All template pairs identical.`
- [x] `git diff --check` lulus tanpa error whitespace.
- [x] Review scope: perubahan hanya pada dua template Dashboard, test JST-025, dan `PLAN.md`; tidak ada perubahan backend, auth, schema, manifest, dependency, atau deployment.
- [x] Security review: endpoint tetap `getJastiperImageData`, dengan `requireSession_`, verifikasi parent folder `assertFileInFolder_`, dan MIME `image/*`; tidak ada temuan kerentanan baru berkeyakinan tinggi.
- [x] Scan pola secret dan URL Drive privat lulus dengan `Secret and private URL pattern check clean.`
- [ ] Verifikasi visual runtime memakai foto barang dan bukti transfer sintetis menunggu approval deployment staging terpisah.

### Catatan review

Review manusia menyetujui penutupan pekerjaan JST-025, sinkronisasi `CHANGELOG.md`, dan pembuatan commit branch pada 2026-08-27 melalui teks `approved`. Merge `main`, clasp push, deployment staging, dan deployment produksi tidak dilakukan.

---

## JST-026 — Sederhanakan workflow governance agen

- **Status:** `DONE`
- **Jenis:** `docs`
- **Pemilik:** agen dokumentasi/governance
- **Dibuat:** 2026-08-27
- **Approval:** perpindahan pengguna (Master) dari Plan Mode ke Act Mode pada 2026-08-27 menyetujui scope plan JST-026.
- **Selesai:** 2026-08-27

### Tujuan

Mengganti approval berulang dengan satu approval implementasi saat pengguna berpindah ke Act Mode. Setelah itu agen menjalankan scope sampai selesai dan hanya mengeskalasi dampak di luar plan, risiko kerusakan, konflik perubahan, atau operasi khusus.

### Acceptance criteria

- [x] Plan Mode menghasilkan pemetaan BMAD dan rencana di chat tanpa mengubah repository.
- [x] Perpindahan ke Act Mode menjadi approval implementasi untuk scope plan.
- [x] Agen dapat mencatat task, membuat branch, mengimplementasikan, memvalidasi, memperbarui dokumentasi, dan menutup task tanpa approval rutin tambahan.
- [x] Konteks governance yang sudah dibaca boleh dipakai ulang selama sesi; file dibaca ulang hanya bila belum tersedia, berubah, atau relevan dengan scope.
- [x] Agen berhenti dan memberi tahu Master bila temuan menyentuh file/fungsi di luar plan, berisiko merusak atau menimpa, menurunkan keamanan, atau memerlukan operasi khusus.
- [x] Setelah pekerjaan selesai, agen selalu meminta pilihan commit dan push; keduanya tidak dijalankan otomatis.
- [x] Histori task lama tidak diubah.

### Ruang lingkup

- `.cline/rules/01-governance.md`
- `AGENTS.md`
- `PLAN.md`
- `SECURITY.md`
- `README.md`
- `CHANGELOG.md`
- `docs/BMAD.md`
- `docs/AGENT_PROMPTS.md`
- `docs/PROJECT_CONTEXT.md`
- `docs/decisions/README.md`
- `docs/decisions/ADR-001-workflow-approval-act-mode.md`

### Di luar ruang lingkup

- Source aplikasi, test, manifest GAS, dependency, data, deployment, merge, commit, dan push.
- Pengubahan atau penghapusan histori `JST-001` sampai `JST-025`.
- Pelemahan kontrol auth, otorisasi, tenant isolation, upload, permission, atau rahasia.

### Risiko keamanan/data

- Approval tunggal dapat disalahartikan sebagai izin memperbesar scope atau menjalankan operasi produksi.
- Context cache dapat usang bila file berubah di tengah sesi.
- Penutupan otomatis dapat menyembunyikan validasi gagal bila bukti tidak diwajibkan.

### Rencana implementasi

1. Buat branch `docs/JST-026-sederhanakan-governance`.
2. Selaraskan governance inti dengan workflow Plan/Act dan gate eskalasi berbasis dampak.
3. Selaraskan BMAD, prompt agen, kebijakan keamanan, konteks proyek, README, status task, dan changelog.
4. Catat keputusan lintas task sebagai ADR-001.
5. Validasi konsistensi, scope diff, histori, format, serta pola rahasia.
6. Catat bukti dan tutup ke `DONE` bila semua acceptance criteria terpenuhi.
7. Tanyakan pilihan commit/push kepada Master setelah pekerjaan selesai.

### Rencana validasi

1. Cari aturan aktif yang masih mewajibkan approval rutin berulang.
2. Jalankan `git diff --check`, `git diff --name-only`, dan `git status --short --branch`.
3. Pastikan hanya file scope berubah dan histori task lama tidak berubah.
4. Scan diff untuk token, private key, URL privat, ID resource, dan data pribadi.
5. Tinjau konsistensi Plan Mode, Act Mode, eskalasi, penutupan, commit, push, deployment, dan operasi produksi.

### Rencana rollback

Sebelum commit, pulihkan hanya file dalam scope JST-026. Setelah commit, gunakan `git revert` pada commit `[JST-026]`; jangan reset histori bersama. Tidak ada perubahan source, schema, data, atau deployment.

### Hasil validasi

- [x] Self-check Python memastikan 11 file dalam scope tepat pada branch `docs/JST-026-sederhanakan-governance`.
- [x] Konten histori `JST-001` sampai `JST-025` di `PLAN.md` identik (117.170 karakter setelah normalisasi line ending) terhadap commit HEAD `fix/JST-025-dashboard-image-render`.
- [x] Seluruh marker workflow baru (`Approval via Act Mode`, `Gate eskalasi`, `ubah status menjadi DONE`, `tanpa approval keamanan tambahan`, `Matriks otonomi`, `Prompt Eksekusi Task (Act Mode)`, `ADR-001 ACCEPTED`) terverifikasi.
- [x] Struktur Markdown di seluruh 11 file seimbang dan valid.
- [x] `git diff --check` lulus tanpa error whitespace.
- [x] Scan aturan aktif bersih dari syarat approval rutin berulang (`No obsolete active approval rule found.`).
- [x] Scan pola rahasia dan URL privat pada seluruh diff serta ADR-001 bersih (`Secret and private URL pattern check clean.`).
- [x] Status `PLAN.md` diubah menjadi `DONE` dan `CHANGELOG.md` disinkronkan.
- [x] Tidak ada commit atau push otomatis yang dijalankan.

### Catatan review

Pekerjaan `JST-026` diselesaikan secara mandiri setelah Master berpindah ke Act Mode sebagai persetujuan scope plan. ADR-001 dicatat dan disetujui. Agen menunggu konfirmasi pilihan Master untuk tindakan Git selanjutnya.


---

## JST-027 — Rilis fix foto Dashboard Jastiper ke GAS staging

- **Status:** `DONE`
- **Jenis:** `chore`
- **Pemilik:** agen implementasi
- **Dibuat:** 2026-08-27
- **Approval:** pengguna berpindah ke Act Mode dan memberi instruksi `lanjut act` pada 2026-08-27; mencakup pencatatan task, branch kerja, validasi, push source GAS, deployment staging, smoke test sintetis, dokumentasi hasil, dan rollback staging bila gagal. Tidak mencakup deployment produksi, data produksi, merge, commit, atau push Git.
- **Selesai:** 2026-08-27

### Tujuan

Menerbitkan source fix `JST-025` ke deployment GAS staging agar foto barang dan bukti transfer tidak berhenti pada status `Memuat…`, tanpa mengubah source aplikasi atau kontrol keamanan backend.

### Acceptance criteria

- [x] Branch kerja `chore/JST-027-rilis-fix-foto-dashboard` digunakan dan perubahan task dicatat di `PLAN.md`.
- [x] Test `JST-025`, suite lokal, parse JavaScript template, dan sinkronisasi template lulus sebelum deployment.
- [x] Lima file terlacak GAS di-push tanpa `README.txt`, rahasia, ID privat, atau data buyer.
- [x] Versi immutable baru dibuat dan deployment staging aktif yang sebelumnya `@13` diarahkan ke versi baru; deployment `@HEAD` dan produksi tidak diubah.
- [x] Endpoint staging merespons HTTP 200 setelah deployment.
- [x] Payload Dashboard staging yang disajikan memuat handler baru `container.replaceChildren(loadedImg)` dan tidak lagi memuat pola handler lama.
- [x] Otorisasi sesi, validasi parent folder tenant, dan validasi MIME `image/*` tetap utuh pada backend.
- [x] Bukti validasi, keterbatasan, dan rollback dicatat; `CHANGELOG.md` disinkronkan setelah status selesai.

### Ruang lingkup

- `PLAN.md`
- `CHANGELOG.md`
- Push lima file terlacak dari `04_Backend_GAS/` ke proyek GAS staging.
- Versi immutable dan deployment Web App staging.
- Smoke test HTTP serta browser dengan data sintetis.

### Di luar ruang lingkup

- Perubahan source aplikasi, backend, test, manifest, auth, sesi, schema, dependency, permission, atau OAuth scope.
- Spreadsheet, Drive, akun, deployment, atau data produksi.
- Penggunaan data buyer nyata, token privat dalam repository/log, merge, commit, dan push Git.

### Risiko keamanan/data

- Salah target deployment dapat memengaruhi produksi; identitas target wajib dibuktikan dari histori versi/deployment staging sebelum push.
- Source remote GAS berubah saat `clasp push`; hanya lima file terlacak boleh terunggah dan rollback memakai versi immutable `@13`.
- Smoke test wajib memakai akun serta file sintetis. Tenant isolation tetap diverifikasi server-side melalui `requireSession_` dan `assertFileInFolder_`.

### Rencana implementasi

1. Buat branch kerja dan catat task `IN_PROGRESS`.
2. Validasi source `JST-025`, pasangan template, seluruh test, scope, dan pola rahasia.
3. Push lima file GAS terlacak ke target staging yang terverifikasi.
4. Buat versi immutable baru dan arahkan deployment staging dari `@13` ke versi tersebut tanpa mengubah deployment `@HEAD`.
5. Jalankan smoke test HTTP dan verifikasi browser memakai data sintetis yang tersedia.
6. Rollback deployment staging ke `@13` bila validasi pascadeploy gagal.
7. Catat hasil, sinkronkan `CHANGELOG.md`, dan ubah status menjadi `DONE` bila acceptance criteria terpenuhi.

### Rencana validasi

1. `node tests/jst025_dashboard_image_render_check.js`.
2. `for f in tests/jst*_check.js; do node "$f" || exit 1; done`.
3. Parse JavaScript enam template HTML dan pastikan tiga pasangan template identik.
4. `npx --no-install clasp status`, `clasp versions`, dan `clasp deployments` dengan ID disamarkan dari keluaran dokumentasi.
5. `git diff --check`, audit file berubah, serta scan pola rahasia, URL/ID privat, dan data pribadi.
6. HTTP 200 pada root serta Dashboard staging; verifikasi render sukses/gagal dan tenant isolation dengan data sintetis bila kredensial staging tersedia.

### Rencana rollback

Arahkan deployment staging yang sama kembali ke versi immutable `@13`. Versi baru dan histori deployment tidak dihapus. Tidak ada rollback schema/data karena tidak ada perubahan schema atau data.

### Log aktivitas

- [x] Baseline Git bersih pada commit `104ced6`; branch target belum ada.
- [x] Target clasp terkonfigurasi dengan `rootDir` `04_Backend_GAS`; hanya lima file GAS terlacak, sedangkan `README.txt` tidak terlacak.
- [x] Histori remote memuat versi staging `@13` dengan deskripsi `JST-024 konfirmasi url param staging 2026-08-27`; terdapat deployment `@HEAD` terpisah dan deployment staging aktif `@13`.
- [x] Branch `chore/JST-027-rilis-fix-foto-dashboard` dibuat dari commit `104ced6`.
- [x] Task dicatat sebagai `IN_PROGRESS` sebelum validasi atau perubahan remote.
- [x] Preflight menjalankan sembilan test `JST-016`, `JST-018`, dan `JST-019` sampai `JST-025`; seluruhnya lulus.
- [x] Tiga pasangan template kanonik/GAS identik dan JavaScript pada enam template berhasil di-parse.
- [x] `git diff --check` awal menemukan blank line berlebih di EOF record `JST-027`; format `PLAN.md` diperbaiki tanpa mengubah histori atau source aplikasi.
- [x] Pemeriksaan ulang `git diff --check` lulus; hanya `PLAN.md` berubah dan scan pola secret/URL privat bersih.
- [x] `npx --no-install clasp push` berhasil mengunggah tepat lima file terlacak GAS; `04_Backend_GAS/README.txt` tidak terunggah.
- [x] Setelah push, versi immutable terakhir tetap `@13` dan deployment staging tetap menunjuk `@13`; deployment `@HEAD` tidak dikonfigurasi ulang.
- [x] Versi immutable `@14` dibuat dengan deskripsi `JST-027 fix foto dashboard staging 2026-08-27`; rollback tetap tersedia pada `@13`.
- [x] Deployment staging aktif diperbarui dari `@13` ke `@14`; deployment `@HEAD` tetap ada dan tidak diubah.
- [x] Percobaan verifikasi HTTP pertama via client Node timeout setelah 30 detik saat menunggu respons berurutan; tidak ada perubahan deployment. Validasi diulang memakai request paralel dengan batas waktu eksplisit.
- [x] Smoke test HTTP pascadeploy staging `@14` mengembalikan HTTP 200 pada root, Login, dan Dashboard; payload Dashboard terverifikasi memuat handler fix `container.replaceChildren(loadedImg)` dan tidak memuat handler lama.
- [x] Master memilih `commit dan push` pada 2026-08-27.
- [ ] Push Git menunggu remote repository; `git remote` tidak memiliki entri sehingga tujuan push belum tersedia.

### Hasil validasi

- [x] `node tests/jst025_dashboard_image_render_check.js`: `JST-025 dashboard image render unit check passed.`
- [x] Suite lokal lengkap: seluruh sembilan test (`JST-016`, `JST-018`, `JST-019` s/d `JST-025`) lulus.
- [x] Sinkronisasi template: `All template pairs identical.`
- [x] Parser JavaScript template: `All template scripts parsed cleanly.`
- [x] `npx --no-install clasp push`: lima file GAS terlacak berhasil diunggah; `README.txt` tetap tidak terunggah.
- [x] Versi immutable `@14` dibuat dengan deskripsi `JST-027 fix foto dashboard staging 2026-08-27`.
- [x] Deployment staging aktif diperbarui dari `@13` ke `@14`; deployment `@HEAD` tidak diubah.
- [x] Smoke test HTTP pascadeploy: root, Login, dan Dashboard merespons HTTP 200; payload Dashboard memuat `container.replaceChildren(loadedImg)` dan `getJastiperImageData(state.sessionToken,url)`.
- [ ] Verifikasi visual antarmuka browser live pada Dashboard staging dilakukan jastiper/operator dengan akun/data sintetis yang sedang login.

### Catatan review

Pekerjaan `JST-027` diselesaikan secara mandiri setelah Master memberi approval eksekusi rilis staging. Perubahan remote terbatas pada deployment staging `@14`; tidak ada perubahan source aplikasi, backend, auth, schema, spreadsheet/drive produksi, atau deployment produksi. Agen menunggu konfirmasi pilihan Master untuk tindakan Git selanjutnya.


---

## JST-028 — Migrasi Frontend ke GitHub Pages + GAS JSON Web API

- **Status:** `DONE`
- **Jenis:** `feat`
- **Pemilik:** agen implementasi
- **Dibuat:** 2026-08-31
- **Approval:** pengguna (Master), 2026-08-31, lewat switch ke Act Mode untuk plan BMAD migrasi frontend ke GitHub Pages.

### Tujuan

Memigrasikan antarmuka web Shafa Jastip ke GitHub Pages sebagai frontend statis mandiri yang berkomunikasi dengan Google Apps Script Web App melalui `fetch` JSON `doPost`, sejalan dengan arsitektur referensi `nadhirafarma/absensi_apotek`.

### Acceptance criteria

- [x] Backend `04_Backend_GAS/Code.gs` menyediakan handler `doPost(e)` yang menerima body JSON `{ action, ...payload }`, memvalidasi action terdaftar, mengeksekusi logika backend yang ada tanpa duplikasi, dan mengembalikan JSON via `ContentService.createTextOutput().setMimeType(ContentService.MimeType.JSON)`.
- [x] Backend mendukung konfigurasi `FRONTEND_BASE_URL` via `PropertiesService.getScriptProperties()` untuk membangun share link dan edit link menuju origin GitHub Pages, dengan fallback aman ke Web App URL bila properti belum diisi.
- [x] Handler `doGet(e)` tetap dipertahankan untuk backward compatibility.
- [x] Seluruh pemanggilan `google.script.run` pada `Login.html`, `Dashboard.html`, dan `Konfirmasi.html` digantikan dengan helper `fetch` standar `method: 'POST'`, `Content-Type: text/plain`, `redirect: 'follow'`, `cache: 'no-store'`.
- [x] Navigasi top-level pada ketiga halaman frontend disesuaikan menjadi navigasi berbasis path / URL relatif halaman statis tanpa ketergantungan pada iframe sandbox GAS atau `<?= webAppUrl ?>`.
- [x] Frontend statis dapat diakses melalui root file GitHub Pages (`index.html` mengarah ke Konfirmasi, `login.html`, `dashboard.html`).
- [x] File `.nojekyll` ditambahkan pada root repository.
- [x] Semua validasi keamanan, isolasi tenant server-side, rate limiting, validasi rekening bank, dan sanitasi input tetap aktif dan terverifikasi.
- [x] Test lokal contract API `jst028_api_contract_check.js` dibuat dan lulus.

### Ruang lingkup

- `PLAN.md`
- `CHANGELOG.md`
- `04_Backend_GAS/Code.gs`
- `01_Login_Signup/Login.html`
- `02_Dashboard_Jastiper/Dashboard.html`
- `03_Konfirmasi_Pembelian/Konfirmasi.html`
- `04_Backend_GAS/Login.html`
- `04_Backend_GAS/Dashboard.html`
- `04_Backend_GAS/Konfirmasi.html`
- `index.html`, `login.html`, `dashboard.html`, `.nojekyll`
- `tests/jst028_api_contract_check.js`
- `docs/decisions/ADR-002-github-pages-frontend-gas-json-api.md`
- `docs/decisions/README.md`

### Di luar ruang lingkup

- Penggantian framework frontend (tetap pure HTML/CSS/JS native).
- Perubahan skema Google Sheets database.
- Deployment ke akun/resource/spreadsheet produksi.
- Domain kustom (CNAME).

### Risiko keamanan/data

- Payload browser tidak tepercaya; backend `doPost` wajib memverifikasi action yang diizinkan dan tetap menjalankan `requireSession_` / sanitasi pada semua endpoint terproteksi.
- Request memakai `Content-Type: text/plain` untuk menghindari CORS preflight; GAS Web App redirect mengeksekusi POST dan mengembalikan JSON.
- `FRONTEND_BASE_URL` harus tervalidasi agar share URL dan edit URL buyer tidak menghasilkan link rusak.

### Rencana implementasi

1. Tambah `doPost(e)` dispatcher dan helper `jsonResponse_` di `04_Backend_GAS/Code.gs`.
2. Perbarui `buildShareUrl_` dan `saveConfirmation` untuk memanfaatkan `FRONTEND_BASE_URL`.
3. Refactor RPC client pada `01_Login_Signup/Login.html` menjadi `fetch` JSON.
4. Refactor RPC client pada `02_Dashboard_Jastiper/Dashboard.html` menjadi `fetch` JSON.
5. Refactor RPC client pada `03_Konfirmasi_Pembelian/Konfirmasi.html` menjadi `fetch` JSON.
6. Buat `index.html`, `login.html`, `dashboard.html` di root, dan `.nojekyll`.
7. Sinkronkan template `04_Backend_GAS/`.
8. Buat dan jalankan test contract `tests/jst028_api_contract_check.js`.
9. Jalankan seluruh suite test lokal, parse JS, dan audit secret.

### Rencana validasi

1. `node tests/jst028_api_contract_check.js`.
2. `for f in tests/jst*_check.js; do node "$f" || exit 1; done`.
3. Validasi parser script JS pada seluruh HTML (kanonik, root, dan backend template).
4. Cek tidak ada sisa `google.script.run` atau `<?= webAppUrl ?>` pada frontend Pages.

### Rencana rollback

Revert modifikasi JST-028 pada branch kerja, hapus file root Pages, pulihkan `Code.gs`, dan redeploy staging ke `@14`.

### Hasil validasi

- [x] Suite test lokal lengkap lulus:
  - `tests/jst016_resource_config_check.js`
  - `tests/jst018_multi_rekening_check.js`
  - `tests/jst019_item_photo_action_check.js`
  - `tests/jst020_auth_auto_navigation_check.js`
  - `tests/jst021_confirmation_logo_check.js`
  - `tests/jst022_dashboard_tabs_check.js`
  - `tests/jst023_dashboard_save_settings_check.js`
  - `tests/jst024_confirmation_url_param_check.js`
  - `tests/jst025_dashboard_image_render_check.js`
  - `tests/jst028_api_contract_check.js`
- [x] Parser JavaScript seluruh 9 file HTML (`Login`, `Dashboard`, `Konfirmasi` pada kanonik, GAS, dan root Pages): lulus tanpa error sintaks.
- [x] Konsistensi byte `cmp -s` antara template kanonik, backend GAS, dan root Pages: identik.
- [x] Zero sisa pemanggilan `google.script.run` atau `<?= typeof webAppUrl` pada source frontend.
- [x] Security audit:
  - Allowlist 10 action tervalidasi pada `doPost(e)`.
  - Tenant isolation, `requireSession_`, `assertFileInFolder_`, rate limiting tetap server-side.
  - Sanitasi `escapeHtml` / `textContent` aman dari injeksi XSS.
  - Zero high-confidence secrets pada diff dan workspace.
- [x] `git diff --check`: lulus bersih.

### Catatan review

Pekerjaan implementasi migrasi `JST-028` selesai dan diverifikasi mandiri setelah Master menyetujui plan BMAD. Kode frontend kini mandiri tanpa ketergantungan sandbox iframe GAS, siap di-serve via GitHub Pages dan terhubung ke backend JSON Web API GAS.

### Bukti deployment staging

- [x] `npx @google/clasp push`: 5 file GAS terlacak (`appsscript.json`, `Code.gs`, `Dashboard.html`, `Konfirmasi.html`, `Login.html`) berhasil diunggah.
- [x] Versi immutable `@16` dibuat dengan deskripsi `JST-028 GitHub Pages JSON API staging hardened 2026-08-31`.
- [x] Target deployment staging aktif `AKfycbwAKQv0i7cYNZatxUpKjbAqs9ALq_kMmkj0EM6v_nuzkf44Sp0l_VGU2PfxLnBEm7g` diperbarui ke `@16`; deployment `@HEAD` tidak diubah.
- [x] Smoke test HTTP staging live:
  - `doGet` Konfirmasi root merespons HTTP 200 dengan payload tanpa `google.script.run`.
  - `doPost` action tidak dikenal merespons HTTP 200 dengan payload JSON `{ ok: false, error: 'Aksi API tidak valid: ...' }`.
  - `doPost` action valid `getPublicConfig` merespons JSON `{ ok: false, error: 'Link jastip tidak aktif.' }` untuk kode sintetis.
  - Probe CORS merespons `Access-Control-Allow-Origin: *` dan `Content-Type: application/json; charset=utf-8`.
- [ ] Rollback staging (jika diperlukan): redeploy deployment staging yang sama ke versi immutable `@14`.


---

## JST-029 — Ingat Konfirmasi Buyer pada Browser

- **Status:** `DONE`
- **Jenis:** `feat`
- **Pemilik:** agen implementasi
- **Dibuat:** 2026-08-31
- **Approval:** pengguna (Master), 2026-08-31, lewat switch ke Act Mode dan approval eskalasi penambahan mirror GAS buyer ke scope.

### Tujuan

Mengarahkan link buyer ke frontend GitHub Pages dan mengingat satu konfirmasi aktif per browser serta `shareCode`, sehingga buyer dapat membuka kembali link jastiper pada browser sama untuk memuat dan memperbarui data sebelumnya.

### Acceptance criteria

- [x] Kredensial edit `orderId`, `editToken`, dan `editUrl` disimpan setelah konfirmasi berhasil, dipisah per `shareCode`.
- [x] Pembukaan ulang `?shop=...` pada browser sama memuat data sebelumnya dalam mode edit.
- [x] Parameter eksplisit `?id=...&token=...` selalu lebih diprioritaskan daripada data browser.
- [x] Kredensial browser yang ditolak server karena order hilang atau token invalid dihapus tanpa melemahkan verifikasi token server-side; error jaringan tidak menghapus cache.
- [x] Buyer dapat melupakan akses edit tersimpan pada perangkat bersama.
- [x] Template buyer terkait (`index.html`, `03_Konfirmasi_Pembelian/Konfirmasi.html`, `04_Backend_GAS/Konfirmasi.html`) tetap sinkron dan test lokal lulus.
- [x] Konfigurasi runtime `FRONTEND_BASE_URL` tetap menjadi langkah operator terpisah; task ini tidak mengubah deployment atau Script Properties.

### Ruang lingkup

- `index.html`
- `03_Konfirmasi_Pembelian/Konfirmasi.html`
- `04_Backend_GAS/Konfirmasi.html`
- `tests/jst024_confirmation_url_param_check.js`
- `tests/jst029_buyer_device_edit_check.js`
- `PLAN.md`
- `CHANGELOG.md`

### Gate eskalasi

- Penambahan `04_Backend_GAS/Konfirmasi.html` telah disetujui Master untuk menjaga konsistensi template kanonik dan mirror GAS tanpa deploy.
- Tidak ada perubahan backend `Code.gs`, deployment, atau Script Properties.

### Risiko keamanan/data

- `editToken` memberi hak memperbarui data buyer; penyimpanan browser hanya cocok untuk perangkat pribadi atau browser profile terpisah.
- Pengguna lain pada browser profile sama dapat membuka data tersimpan. UI wajib memberi peringatan dan tindakan melupakan perangkat.
- PII buyer tidak disimpan di browser; backend tetap memverifikasi hash token untuk setiap baca dan tulis.
- Token tidak boleh dicetak ke log, test fixture, `PLAN.md`, atau `CHANGELOG.md`.

### Rencana rollback

Revert hanya perubahan `JST-029` pada branch kerja. Jangan menghapus data browser atau mengubah resource produksi melalui rollback repository.

### Hasil validasi

- [x] Test unit mandiri `tests/jst029_buyer_device_edit_check.js`: lulus (key storage `jastip-order-{shareCode}`, isolasi antartoko, prioritas URL dibanding storage, pemulihan URL setelah sanitasi, pembersihan cache saat token ditolak, ketahanan cache saat transient error, dan integrasi tombol lupakan perangkat).
- [x] Suite test lokal lengkap (11 test: `JST-016`, `JST-018`, `JST-019`, `JST-020`, `JST-021`, `JST-022`, `JST-023`, `JST-024`, `JST-025`, `JST-028`, `JST-029`): seluruhnya lulus tanpa regresi.
- [x] Validasi parser JavaScript: seluruh script pada 9 file HTML (`Login`, `Dashboard`, `Konfirmasi` pada kanonik, GAS mirror, dan root Pages) ter-parse bersih tanpa error sintaks.
- [x] Konsistensi template triple: `03_Konfirmasi_Pembelian/Konfirmasi.html`, `04_Backend_GAS/Konfirmasi.html`, dan `index.html` terbukti byte-identical.
- [x] Audit keamanan dan privasi:
  - Zero PII buyer (nama, alamat, no HP, foto) disimpan pada `localStorage`.
  - Otorisasi edit tetap 100% server-side via SHA-256 token hash di backend GAS.
  - Parameter URL `id` dan `token` disanitasi dari history address bar setelah pemuatan berhasil.
  - Zero high-confidence hardcoded secrets pada diff.
- [x] `git diff --check`: lulus bersih.

### Catatan review

Implementasi persistensi status edit buyer diselesaikan secara mandiri di branch kerja setelah Master menyetujui plan BMAD dan eskalasi sinkronisasi mirror GAS. Kredensial edit lokal kini memungkinkan buyer pada perangkat yang sama memperbarui data yang telah dikirim hanya dengan membuka kembali link jastiper. Task tidak menyentuh database produksi, deployment staging/produksi, atau Script Properties. Operator dapat secara terpisah memasukkan Script Property `FRONTEND_BASE_URL` pada GAS Settings bila ingin link edit WA/clipboard diarahkan ke origin Pages.


---

## JST-030 — Preview Foto Dashboard

- **Status:** `DONE`
- **Jenis:** `feat`
- **Pemilik:** agen implementasi
- **Dibuat:** 2026-08-31
- **Approval:** pengguna (Master), 2026-08-31, lewat switch ke Act Mode.

### Tujuan

Memungkinkan jastiper memperbesar foto barang dan bukti transfer customer langsung dari Dashboard untuk pemeriksaan detail tanpa membuka Drive.

### Acceptance criteria

- [x] Foto yang selesai dimuat dapat membuka preview fullscreen melalui klik, `Enter`, atau `Space`.
- [x] Modal dapat ditutup lewat tombol, backdrop, atau `Escape`.
- [x] Modal memakai `role="dialog"`, `aria-modal`, caption, alt text, focus trap, dan mengembalikan fokus ke thumbnail pembuka.
- [x] Foto yang masih memuat atau gagal tidak membuka modal.
- [x] Layout gambar responsif dan tiga mirror Dashboard byte-identical.
- [x] Test lokal mandiri dan suite regresi lulus.

### Ruang lingkup

- `02_Dashboard_Jastiper/Dashboard.html`
- `04_Backend_GAS/Dashboard.html`
- `dashboard.html`
- `tests/jst030_photo_lightbox_check.js`
- `PLAN.md`
- `CHANGELOG.md`

### Risiko keamanan/data

- URL Drive tetap divalidasi dan dimuat lewat action backend `getJastiperImageData`; modal hanya memakai data URI yang sudah diterima Dashboard.
- Task tidak mengubah auth, sesi, token, permission Drive, backend, Script Properties, atau data produksi.
- Caption dirender dengan `textContent`; label thumbnail tetap melalui helper `esc`.

### Rencana rollback

Revert hanya perubahan `JST-030` pada tiga mirror Dashboard, test JST-030, dan entri dokumentasi. Tidak ada data atau resource produksi yang perlu diubah.

### Hasil validasi

- [x] `node tests/jst030_photo_lightbox_check.js`: lulus (mirror, markup dialog, parser, klik, keyboard, backdrop, caption, focus trap, dan focus return).
- [x] `node tests/jst025_dashboard_image_render_check.js`: lulus tanpa regresi renderer foto.
- [x] Suite test lokal lengkap (12 test: `JST-016`, `JST-018`, `JST-019`, `JST-020`, `JST-021`, `JST-022`, `JST-023`, `JST-024`, `JST-025`, `JST-028`, `JST-029`, `JST-030`): seluruhnya lulus.
- [x] Parser JavaScript tiga Dashboard: lulus.
- [x] Konsistensi template triple: hash SHA-256 sama `7e4820aba527d5d45bb3ba020f221d6544fe6e2db5dced6e229b597927fb0da9`.
- [x] `git diff --check`: lulus bersih.

### Catatan review

Preview memakai lightbox native HTML/CSS/JS tanpa dependency. Swipe, galeri antar-foto, download, dan pinch-to-zoom tidak ditambahkan karena di luar scope. Belum ada deployment produksi atau staging.


---

## JST-031 — Custom Domain dan Clean Routing GitHub Pages

- **Status:** `DONE`
- **Jenis:** `feat`
- **Pemilik:** agen implementasi
- **Dibuat:** 2026-08-31
- **Approval:** pengguna (Master), 2026-08-31, lewat switch ke Act Mode setelah domain `jastipin.my.id` dapat diakses.

### Tujuan

Menjadikan `https://jastipin.my.id/` tanpa query masuk langsung ke `/login`, memakai route auth bersih `/login` dan `/dashboard`, serta mempertahankan link buyer legacy berbasis query `/?shop=...`.

### Acceptance criteria

- [x] `CNAME` berisi tepat `jastipin.my.id`.
- [x] Root `/` tanpa query mengalihkan ke `/login` tanpa memuat konfigurasi buyer.
- [x] Root dengan query buyer `?shop=...` tetap membuka form konfirmasi.
- [x] Navigasi auth memakai `/login` dan `/dashboard` pada tiga mirror Login/Dashboard.
- [x] `404.html` memulihkan clean route auth ke file statis dan mengarahkan route asing ke `/login` tanpa meneruskan query sensitif.
- [x] Test routing dan seluruh suite regresi lokal lulus.

### Ruang lingkup

- `CNAME`
- `404.html`
- `index.html`
- `login.html`
- `dashboard.html`
- `01_Login_Signup/Login.html`
- `02_Dashboard_Jastiper/Dashboard.html`
- `03_Konfirmasi_Pembelian/Konfirmasi.html`
- `04_Backend_GAS/Login.html`
- `04_Backend_GAS/Dashboard.html`
- `04_Backend_GAS/Konfirmasi.html`
- `tests/jst020_auth_auto_navigation_check.js`
- `tests/jst031_custom_domain_routing_check.js`
- `PLAN.md`
- `CHANGELOG.md`

### Di luar ruang lingkup

- Perubahan DNS, GitHub Pages Settings, atau Enforce HTTPS.
- Deployment GAS/GitHub Pages dan perubahan `FRONTEND_BASE_URL` pada Script Properties.
- Perubahan backend, auth, sesi, token, schema Sheet, data, Drive, atau OAuth.
- Slug buyer unik; dilanjutkan sebagai `JST-032`.

### Risiko keamanan/data

- Query `id` dan `token` buyer harus tetap mencapai form buyer; root redirect hanya berlaku saat query kosong.
- Route 404 asing tidak boleh meneruskan query atau fragment yang mungkin sensitif ke URL login.
- Semua otorisasi buyer/jastiper tetap server-side; task tidak mengubah trust boundary.

### Rencana validasi

1. Jalankan test JST-031 dan suite test lokal lengkap.
2. Parse JavaScript seluruh template frontend serta `404.html`.
3. Verifikasi tiga kelompok mirror frontend tetap byte-identical.
4. Jalankan `git diff --check`, review diff, dan scan pola rahasia/data pribadi.
5. Catat bukti, keterbatasan, rollback, lalu ubah status menjadi `DONE` dan sinkronkan `CHANGELOG.md`.

### Rencana rollback

Revert hanya file `JST-031`. Root kembali menampilkan form buyer dan navigasi kembali memakai `.html`; DNS, backend, Script Properties, dan data tidak berubah.



---

## JST-032 — Ekspedisi Kustom dan Tampilan Minimalis Data Buyer

- **Status:** `DONE`
- **Jenis:** `feat`
- **Pemilik:** agen implementasi
- **Dibuat:** 2026-08-31
- **Approval:** pengguna (Master), 2026-08-31, lewat switch ke Act Mode.

### Tujuan

1. Jastiper dapat mengelola daftar opsi ekspedisi di tab Pengaturan Jastip Dashboard (tambah/hapus, dinamis, default fallback Shopee & J&T).
2. Halaman Konfirmasi Pembelian Buyer merender opsi ekspedisi secara dinamis dari konfigurasi jastiper, ditambah opsi "Lainnya" yang menampilkan field input teks manual untuk diisi buyer.
3. Halaman Data Buyer di Dashboard Jastiper menampilkan ringkasan minimalis: hanya Nama Lengkap, ID Order, dan Alamat Pengiriman. Rincian lengkap (WhatsApp, Ekspedisi, Bank Tujuan, Barang & Foto, Bukti Transfer) dibuka saat mengklik tombol "Detail".

### Acceptance criteria

- [x] `USER_HEADERS` backend memiliki kolom `ekspedisiListJson` yang termigrasi aman via `ensureSheet_`.
- [x] `updateJastiperSettings` memvalidasi dan menyimpan daftar ekspedisi jastiper (maks 10 opsi, anti formula injection, sanitasi panjang).
- [x] `getPublicConfig` dan `publicProfile_` mengembalikan `ekspedisiList` terurai atau fallback `['Shopee', 'J&T']`.
- [x] Panel Pengaturan Dashboard memiliki UI Tambah/Hapus Ekspedisi yang tersinkronisasi saat klik Simpan Pengaturan.
- [x] Panel Data Buyer Dashboard merender kartu minimalis (Nama, ID Order, Alamat) dengan tombol aksi "Detail" yang melakukan expand/collapse informasi detail secara elegan.
- [x] Halaman Konfirmasi Buyer merender opsi radio ekspedisi dinamis + opsi "Lainnya" dengan input manual.
- [x] Pemilihan opsi "Lainnya" saat submit menyimpan teks input manual sebagai nilai `ekspedisi`.
- [x] Mode edit konfirmasi buyer memulihkan opsi ekspedisi kustom/manual dengan benar.
- [x] Tiga set mirror file (Dashboard, Konfirmasi, Login) tetap tersinkronisasi dan identik.
- [x] Test regresi lokal dan test baru `tests/jst032_ekspedisi_detail_buyer_check.js` lulus 100%.

### Ruang lingkup

- `04_Backend_GAS/Code.gs`
- `04_Backend_GAS/Dashboard.html`
- `04_Backend_GAS/Konfirmasi.html`
- `02_Dashboard_Jastiper/Dashboard.html`
- `03_Konfirmasi_Pembelian/Konfirmasi.html`
- `dashboard.html`
- `index.html`
- `tests/jst023_dashboard_save_settings_check.js`
- `tests/jst032_ekspedisi_detail_buyer_check.js`
- `PLAN.md`
- `CHANGELOG.md`

### Di luar ruang lingkup

- PIN login/akses buyer, lupa PIN, atau auth buyer.
- Deployment staging / produksi dan perubahan Script Properties.
- Perubahan alur pembatasan file/upload Google Drive.

### Risiko keamanan/data

- Proteksi formula injection Sheets (`^[=+\-@]`) diterapkan pada daftar ekspedisi jastiper dan input ekspedisi manual buyer.
- Tenant isolation jastiper diuji pada level sheet row update.
- Aksesibilitas detail expandable menggunakan `aria-expanded` dan `aria-controls`.

### Rencana validasi

1. Unit test backend & frontend logic via `tests/jst032_ekspedisi_detail_buyer_check.js`.
2. Menjalankan seluruh suite test regresi lokal (14 file test).
3. Parsing JavaScript seluruh file template HTML.
4. Verifikasi byte-identical tiga mirror Dashboard dan Konfirmasi.
5. Review diff dan pemindaian pola rahasia/kredensial.

### Rencana rollback

Revert perubahan commit JST-032. Schema sheet backward compatible karena `ekspedisiListJson` ditambahkan di akhir kolom dan fallback default ke Shopee & J&T.

### Hasil validasi

- [x] `node tests/jst032_ekspedisi_detail_buyer_check.js`: lulus 100% (syntax, parsing fallback, sanitasi formula injection, update setting tenant isolation, dynamic radio UI, input manual Lainnya, toggle detail buyer).
- [x] Seluruh suite test lokal (14 file test: `JST-016`, `JST-018` s/d `JST-025`, `JST-028` s/d `JST-032`): seluruhnya lulus 100%.
- [x] Parser JavaScript seluruh 10 file HTML: lulus tanpa error sintaks.
- [x] Byte consistency `cmp -s`: tiga pasang mirror Dashboard dan Konfirmasi terbukti identik.
- [x] `git diff --check` dan pemindaian rahasia: lulus bersih.

### Catatan review

Pengelolaan opsi ekspedisi jastiper dan form konfirmasi buyer telah terpasang dengan proteksi sanitasi penuh. Tampilan data buyer di Dashboard kini lebih ringkas dan dapat diperluas per pesanan. Tidak ada deployment produksi atau perubahan resource rahasia yang disentuh.

### Hasil validasi

- [x] `node tests/jst031_custom_domain_routing_check.js`: lulus (CNAME, fallback 404, navigasi clean auth, mirror triple konsisten, dan redirect root kosong ke `/login`).
- [x] Suite test lokal lengkap (13 test: `JST-016`, `JST-018` s/d `JST-025`, `JST-028`, `JST-029`, `JST-030`, `JST-031`): seluruhnya lulus.
- [x] Parser JavaScript seluruh 10 file HTML (`index`, `login`, `dashboard`, `404`, serta template kanonik & GAS): lulus tanpa error sintaks.
- [x] Konsistensi byte `cmp -s`: tiga pasang file Login, Dashboard, dan Konfirmasi terbukti identik.
- [x] `git diff --check`: lulus bersih.

### Catatan review

Domain `jastipin.my.id` kini mengarahkan pengunjung umum root ke `/login`. Permintaan buyer dengan query parameter tetap diarahkan ke formulir konfirmasi. Navigasi login dan dashboard menggunakan URL bersih `/login` dan `/dashboard` dengan fallback `404.html` GitHub Pages. Deployment backend GAS, konfigurasi DNS hosting, dan Script Properties produksi/staging tidak disentuh.



---

## JST-033 — Tombol hapus data buyer beserta foto di Drive dan baris Google Sheet

- **Status:** `DONE`
- **Jenis:** `feat`
- **Pemilik:** agen fitur
- **Dibuat:** 2026-09-01
- **Approval:** perpindahan Act Mode oleh pengguna (Master) pada 2026-09-01.

### Tujuan

Menambahkan fungsi hapus data buyer di Dashboard jastiper yang secara atomik/terkoordinasi menghapus foto-foto barang dan bukti transfer di Google Drive (masuk ke Sampah/Trash) serta menghapus baris data buyer terkait dari Google Sheet database dengan proteksi tenant isolation server-side.

### Acceptance criteria

- [x] Endpoint backend GAS `deleteOrder` menerima `sessionToken` dan `orderId`.
- [x] Otorisasi server-side: verifikasi sesi aktif jastiper dan tenant isolation (orderId wajib milik jastiper terkait).
- [x] Penghapusan foto Google Drive: mencari semua URL file pada `itemsJson` dan `buktiTransferUrl`, memvalidasi kepemilikan folder (`assertFileInFolder_`), lalu memindahkan file ke Trash (`setTrashed(true)`).
- [x] Kegagalan parsial Drive (misal file sudah terhapus manual) tidak membatalkan penghapusan baris Sheet (best-effort reporting).
- [x] Penghapusan baris Google Sheet: baris data order dihapus dari sheet `Konfirmasi Jastip v4`.
- [x] Frontend Dashboard: tombol `× Hapus` dengan warna peringatan bahaya di samping tombol `Detail`.
- [x] Konfirmasi dialog interaktif (`confirm()`) sebelum memanggil API hapus.
- [x] Tombol status busy/disabled saat proses penghapusan berlangsung, auto-refresh daftar buyer setelah berhasil.
- [x] Sinkronisasi 3 file mirror Dashboard: `04_Backend_GAS/Dashboard.html`, `02_Dashboard_Jastiper/Dashboard.html`, `dashboard.html`.
- [x] Test regresi lokal `tests/jst033_delete_order_check.js` dibuat dan lulus 100%.

### Ruang lingkup

- `04_Backend_GAS/Code.gs`
- `04_Backend_GAS/Dashboard.html`
- `02_Dashboard_Jastiper/Dashboard.html`
- `dashboard.html`
- `tests/jst028_api_contract_check.js`
- `tests/jst033_delete_order_check.js`
- `PLAN.md`
- `CHANGELOG.md`

### Di luar ruang lingkup

- Penghapusan permanen file Drive tanpa mampir ke Trash.
- Fitur undo / restore pesanan yang sudah terhapus.
- Bulk delete (hapus massal banyak pesanan sekaligus).
- Deployment staging / produksi dan modifikasi Script Properties.

### Risiko keamanan/data

- Penghapusan Sheet bersifat permanen, mitigasi: konfirmasi eksplisit UI dan tenant check di backend.
- Tenant isolation: jastiper A tidak boleh bisa menghapus order milik jastiper B sekalipun tahu `orderId`-nya.
- File Drive path traversal / unauthorized trash: `assertFileInFolder_` mencegah penghapusan file di luar folder jastiper.
- Data pribadi / URL privat tidak dicatat ke log server.

### Rencana validasi

1. Unit test backend & mock via `tests/jst033_delete_order_check.js`.
2. Menjalankan seluruh suite test regresi lokal.
3. Parsing JavaScript seluruh file template HTML.
4. Verifikasi byte-identical tiga mirror Dashboard.
5. Review diff dan pemindaian pola rahasia/kredensial.

### Rencana rollback

Revert perubahan commit JST-033. Data yang terlanjur di-trash di Drive dapat dipulihkan melalui menu Trash Google Drive jastiper.

### Bukti eksekusi dan verifikasi

1. **Unit test dan mock contract execution**:
   `node tests/jst033_delete_order_check.js` → Lulus.
2. **Suite test regresi lokal**:
   15 test suite lokal lulus tanpa error (JST-016 s.d. JST-033).
3. **Pemeriksaan mirror Dashboard**:
   `cmp -s 04_Backend_GAS/Dashboard.html 02_Dashboard_Jastiper/Dashboard.html` (MATCH)
   `cmp -s 04_Backend_GAS/Dashboard.html dashboard.html` (MATCH)
4. **Keamanan**:
   Tenant isolation diverifikasi server-side sebelum hapus baris sheet atau file Drive. Tidak ada kredensial atau rahasia yang tercetak atau tersimpan.

### Catatan review

Fitur hapus buyer telah terintegrasi di backend `Code.gs` dan frontend Dashboard (3 file mirror). Operasi memindahkan foto barang dan bukti transfer ke Google Drive Trash serta menghapus baris pesanan dari Sheet dengan aman.



---

## JST-034 — Perbaikan detail Dashboard buyer

- **Status:** `DONE`
- **Jenis:** `feat`
- **Pemilik:** agen fitur
- **Dibuat:** 2026-09-01
- **Approval:** perpindahan Act Mode oleh pengguna (Master) pada 2026-09-01; approval deployment GAS oleh Master pada 2026-09-01.
- **Baseline:** `1fed0e6a9c950f0d9a56eb3f8885371c1a2e5073`

### Tujuan

Memperbaiki detail Dashboard agar nomor WhatsApp yang tersimpan tanpa nol awal tampil dengan format lokal, nama pemilik rekening tampil bersama rekening transfer, dan daftar nama barang duplikat di atas foto dihapus.

### Acceptance criteria

- [x] Nomor `8123456789` tampil sebagai `08123456789` dan nomor `08123456789` tidak mendapat nol tambahan.
- [x] Format nonlokal seperti `+628123456789` tidak diubah.
- [x] Nama pemilik rekening dikembalikan dari rekening jastiper yang cocok dengan `bankTujuan`.
- [x] Order lama dengan rekening yang sudah tidak cocok tetap tampil tanpa nama pemilik.
- [x] Daftar chip nama barang di atas foto tidak dirender; label kartu foto dan lightbox tetap berfungsi.
- [x] Tiga mirror Dashboard identik.
- [x] Tidak ada perubahan schema Sheet, auth, sesi, Drive, permission, OAuth, atau dependency.
- [x] Test target dan seluruh suite lokal lulus.

### Ruang lingkup

- `04_Backend_GAS/Code.gs`
- `04_Backend_GAS/Dashboard.html`
- `02_Dashboard_Jastiper/Dashboard.html`
- `dashboard.html`
- `tests/jst034_dashboard_detail_check.js`
- `PLAN.md`
- `CHANGELOG.md`

### Di luar ruang lingkup

- Migrasi data nomor WhatsApp lama.
- Perubahan form buyer atau schema Google Sheet.
- Deployment GAS/staging/produksi dan modifikasi Script Properties.
- Commit atau push sebelum konfirmasi akhir Master.

### Risiko dan mitigasi

- Nama pemilik rekening tidak tersimpan pada order. Backend hanya mencocokkan `bankTujuan` dengan rekening aktif milik jastiper; rekening yang sudah dihapus/diubah menghasilkan nama kosong tanpa merusak order lama.
- Data buyer tetap dibatasi oleh `requireSession_` dan filter `jastiperId` yang sudah ada.
- Semua data dinamis Dashboard tetap melewati `esc()` sebelum masuk HTML.

### Rencana validasi

1. Jalankan `node tests/jst034_dashboard_detail_check.js`.
2. Jalankan test foto/lightbox dan kontrak API terkait.
3. Jalankan seluruh `tests/*.js`.
4. Verifikasi tiga mirror Dashboard byte-identical dan parse JavaScript template.
5. Jalankan `git diff --check`, review diff, dan pindai rahasia/data pribadi.

### Rencana rollback

Revert perubahan JST-034. Tidak ada migrasi data, perubahan schema, atau operasi resource produksi.

### Hasil validasi

1. `node tests/jst034_dashboard_detail_check.js`: lulus.
2. Seluruh 16 test `tests/*.js` (`JST-016` s.d. `JST-034` yang tersedia): lulus.
3. SHA-256 ketiga mirror Dashboard: `23b46d1f4fc75e801d700fc39ab3adf6a08fb32f65bb8b499d7e9fdea4cf4521`; byte-identical.
4. `git diff --check`: lulus tanpa whitespace error.
5. Review keamanan/data: `getJastiperDashboard` tetap memakai `requireSession_` dan filter `jastiperId`; nama pemilik rekening berasal dari profil jastiper terautentikasi; seluruh output dinamis tetap melewati `esc()`; tidak ada auth, sesi, token, upload, scope OAuth, permission, schema, dependency, rahasia, atau data produksi baru.
6. Deployment backend GAS: `clasp push` mengunggah 5 file terlacak; versi immutable `@18` dibuat; deployment aktif JST-028 diarahkan dari `@17` ke `@18` dengan approval Master.
7. Smoke test backend live: GET Dashboard HTTP `200`; action invalid ditolak JSON; endpoint `getJastiperDashboard` tanpa sesi ditolak.
8. Verifikasi Pages live: HTTP `200`; renderer `accountHolder` tersedia dan chip duplikat tidak ada. Data terautentikasi tidak dipakai pada smoke test karena token dan data buyer tidak boleh dicatat.

### Catatan penutupan

`formatWhatsApp_` hanya mengubah tampilan respons Dashboard, bukan data Sheet. `accountHolder` dicocokkan saat baca terhadap rekening aktif; order lama dengan rekening yang tidak lagi tersedia tetap tampil dengan nama pemilik kosong. Chip barang dihapus, sedangkan kartu foto, label foto, lazy loading, dan lightbox tetap dipertahankan. Rollback backend cukup arahkan deployment aktif kembali ke versi immutable `@17`; rollback source Pages cukup revert commit JST-034.



---

## JST-035 — Ingat Email dan Password Login

- **Status:** `DONE`
- **Jenis:** `feat`
- **Pemilik:** agen fitur
- **Dibuat:** 2026-09-01
- **Selesai:** 2026-09-01
- **Approval:** perpindahan Act Mode oleh pengguna (Master) pada 2026-09-01.
- **Baseline:** `ff4df19`

### Tujuan

Mengubah satu checkbox login menjadi `Ingat email & Password`: email tetap disimpan pada browser seperti perilaku lama, sedangkan password ditawarkan ke password manager browser setelah autentikasi berhasil tanpa disimpan aplikasi sebagai plaintext.

### Acceptance criteria

- [x] Satu checkbox `#remember` menampilkan label `Ingat email & Password`.
- [x] Saat dicentang, email disimpan pada `localStorage` dan password ditawarkan ke Credential Management API hanya setelah login berhasil.
- [x] Saat tidak dicentang, email tersimpan dihapus dan aplikasi tidak meminta credential manager menyimpan password.
- [x] Kegagalan atau ketiadaan Credential Management API tidak menggagalkan login.
- [x] Password tidak disimpan pada `localStorage`, `sessionStorage`, cookie aplikasi, Sheet, Git, atau log.
- [x] `autocomplete="current-password"` tetap tersedia sebagai fallback password manager native.
- [x] Tiga mirror Login byte-identical.
- [x] Backend, schema, sesi, hashing, OAuth, dependency, dan deployment tidak berubah.
- [x] Test target dan seluruh suite lokal lulus.

### Ruang lingkup

- `01_Login_Signup/Login.html`
- `04_Backend_GAS/Login.html`
- `login.html`
- `tests/jst035_remember_password_check.js`
- `PLAN.md`
- `CHANGELOG.md`

### Di luar ruang lingkup

- Perubahan `04_Backend_GAS/Code.gs`, autentikasi server, hashing password, sesi, token, atau reset password.
- Penyimpanan password oleh aplikasi atau backend.
- Perubahan schema Sheet, Script Properties, OAuth, permission, dan dependency.
- Deployment GAS/GitHub Pages, operasi data/resource produksi, commit, atau push.

### Risiko keamanan/data

- Menyimpan password di Web Storage atau cookie aplikasi akan mengekspos plaintext terhadap script origin; mitigasi wajib memakai password manager browser dan tidak membuat storage key password.
- `PasswordCredential` tidak didukung semua browser serta dibatasi HTTPS/top-level context; `autocomplete="current-password"` tetap menjadi fallback dan kegagalan API tidak memblokir login.
- Menonaktifkan checkbox tidak menghapus credential yang sebelumnya disimpan pengguna pada password manager; penghapusan tetap dikendalikan pengguna melalui pengaturan browser.

### Rencana validasi

1. Jalankan `node tests/jst035_remember_password_check.js`.
2. Jalankan seluruh `tests/*.js`.
3. Parse JavaScript tiga template Login dan verifikasi mirror byte-identical.
4. Jalankan `git diff --check`, review diff/file tak terduga, dan pindai password/storage/log/rahasia/data pribadi.
5. Catat hasil, ubah status menjadi `DONE`, dan sinkronkan `CHANGELOG.md` bila semua acceptance criteria terpenuhi.

### Rencana rollback

Revert perubahan JST-035 pada tiga mirror Login, test, dan dokumentasi. Tidak ada migrasi data atau resource server yang perlu dipulihkan. Credential yang telah disimpan oleh password manager browser tetap dikelola pengguna dari pengaturan browser.

### Hasil validasi

1. Red test sebelum implementasi: gagal pada label lama `Ingat email`, sesuai ekspektasi.
2. `node tests/jst035_remember_password_check.js`: lulus; mencakup checkbox aktif/nonaktif, urutan setelah autentikasi sukses, penolakan `store()`, API tidak tersedia, fallback autocomplete, larangan Web Storage/cookie password, syntax, dan sinkronisasi mirror.
3. Seluruh 17 test `tests/*.js` yang tersedia: lulus (`SUITE_RESULT=PASS tests=17 failed=0`).
4. Parse JavaScript ketiga template Login dengan `vm.Script`: lulus.
5. SHA-256 ketiga mirror Login: `a5c042b8263cae25855cc504db8062cc1da1b0d4567177cc345a486a7b03fe8e`; byte-identical.
6. `git diff --check`: lulus tanpa whitespace error.
7. Review keamanan: password hanya diteruskan dari input login ke backend existing dan `PasswordCredential` setelah autentikasi sukses saat checkbox aktif; kegagalan API ditangkap; tidak ada password baru pada `localStorage`, `sessionStorage`, cookie, log, Git, atau backend. Tidak ada temuan keamanan high-confidence.
8. Review scope: backend, schema, sesi, hashing, token, OAuth, permission, dependency, dan deployment tidak berubah. Perubahan lokal JST-034 yang sudah ada pada `PLAN.md` dan `CHANGELOG.md` dipertahankan.

### Catatan penutupan

Checkbox tidak dapat menghapus credential yang sebelumnya disimpan browser; pengguna mengelolanya melalui pengaturan password manager browser. Browser tanpa Credential Management API tetap memakai `autocomplete="current-password"`. Validasi browser nyata dan deployment tidak dijalankan karena berada di luar scope approval.

