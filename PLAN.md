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

- **Status:** `REVIEW`
- **Jenis:** `docs`
- **Pemilik:** agen dokumentasi
- **Dibuat:** 2026-08-25
- **Approval:** diminta pengguna melalui tugas awal; perubahan source branding yang ikut terjadi harus ditinjau terpisah sebelum dianggap selesai.

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

Branding dan perubahan HTML/GAS yang sudah masuk bukan bagian scope dokumentasi di atas. Pisahkan menjadi `JST-002`; jangan nyatakan `DONE` sebelum review manusia.

---

## JST-002 — Normalisasi logo dan branding Jastip Apps

- **Status:** `REVIEW`
- **Jenis:** `feat`
- **Pemilik:** agen implementasi
- **Dibuat:** 2026-08-25
- **Approval:** perlu dikonfirmasi manusia karena perubahan source terjadi sebelum item agenda formal tersedia.

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

Belum lengkap. Menunggu review diff, pemeriksaan source, dan smoke test staging.

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

- **Status:** `PROPOSED`
- Batasi MIME allowlist, ukuran, jumlah file, nama aman, dan penanganan payload rusak.
- Uji memakai file sintetis, bukan data buyer.

### JST-005 — Konfigurasi dan least privilege GAS

- **Status:** `PROPOSED`
- Inventaris Script Properties, scope OAuth, Spreadsheet, Folder Drive, permission, dan akun eksekusi.
- Setiap perubahan `appsscript.json` memerlukan security review.

### JST-006 — Retensi dan penghapusan data sensitif

- **Status:** `PROPOSED`
- Tetapkan masa simpan data buyer, foto barang, dan bukti transfer.
- Rancang audit trail dan penghapusan aman sebelum operasi data.

### JST-007 — Baseline pengujian staging

- **Status:** `PROPOSED`
- Buat smoke test untuk login, dashboard, submit konfirmasi, edit, upload, dan isolasi antarjastiper.
- Gunakan Spreadsheet/Drive staging terpisah.

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