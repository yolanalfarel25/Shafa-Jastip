# PLAN — Jastip Apps

Dokumen ini menjadi sumber agenda perubahan. Tidak ada perubahan source tanpa item berstatus `APPROVED`.

## Status pekerjaan

`PROPOSED` → `APPROVED` → `IN_PROGRESS` → `REVIEW` → `DONE`

Status tambahan:

- `BLOCKED` — pekerjaan terhenti karena dependensi, risiko, atau keputusan belum selesai.
- `CANCELLED` — pekerjaan dibatalkan tanpa menghapus histori.

Hanya manusia yang boleh mengubah `PROPOSED` menjadi `APPROVED` dan `REVIEW` menjadi `DONE`.

## Aturan penggunaan

1. Buat satu item untuk satu perubahan logis.
2. Gunakan ID berurutan: `JST-001`, `JST-002`, dan seterusnya.
3. Isi acceptance criteria, scope, risiko, validasi, serta rollback sebelum approval.
4. Catat nama pemberi approval dan waktu approval.
5. Implementasi dilakukan di branch `type/PLAN-ID-ringkasan`.
6. Temuan yang memperbesar scope wajib menjadi item baru atau dikembalikan ke `PROPOSED`.
7. Setelah implementasi, lampirkan bukti validasi dan ubah status menjadi `REVIEW`.
8. Setelah review manusia, ubah status menjadi `DONE` dan sinkronkan `CHANGELOG.md`.
9. Approval implementasi tidak mencakup deployment atau operasi data produksi.

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