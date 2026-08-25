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

- **Status:** `PROPOSED`
- Tinjau penyimpanan token, expiry, perbandingan token, logout, brute force, serta otorisasi server-side.
- Perubahan auth dilarang sebelum threat model dan approval khusus tersedia.

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