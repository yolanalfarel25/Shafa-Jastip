# BMAD — Jastip Apps

BMAD dipakai sebagai alur kerja sebelum build dan pada setiap perubahan: **Business, Model, Architecture, Delivery**.

## Gate 0 — Intake

Sebelum BMAD dimulai:

- baca `AGENTS.md`, `PLAN.md`, dan `docs/PROJECT_CONTEXT.md`;
- identifikasi kebutuhan, pengguna terdampak, data terdampak, dan lingkungan target;
- buat item `PROPOSED` di `PLAN.md`;
- jangan mengubah source sebelum approval manusia tercatat.

Output: ID pekerjaan dan batas scope.

## B — Business

Pastikan perubahan memang diperlukan.

### Pertanyaan wajib

- Masalah pengguna apa yang diselesaikan?
- Siapa pengguna: jastiper, buyer, admin, atau operator?
- Apa hasil terukur?
- Apa dampak jika perubahan tidak dibuat?
- Apakah proses manual atau fitur yang sudah ada cukup?
- Data pribadi atau transaksi apa yang terlibat?
- Apa yang secara eksplisit tidak dikerjakan?

### Artefak minimum

- tujuan;
- acceptance criteria yang dapat diuji;
- scope dan non-scope;
- prioritas;
- pemilik keputusan;
- risiko bisnis dan privasi.

Gate B lulus setelah manusia menyetujui kebutuhan dan acceptance criteria.

## M — Model

Petakan domain dan aliran data sebelum memilih solusi.

### Entitas saat ini

- **Jastiper** — pemilik toko/link dan pengguna dashboard.
- **Session** — bukti login sementara untuk akses dashboard.
- **Confirmation/Order** — konfirmasi buyer.
- **Item** — nama dan foto barang.
- **Bank Account** — rekening tujuan milik jastiper.
- **Upload** — foto barang atau bukti transfer.
- **Share Code** — penghubung form publik dengan jastiper.
- **Edit Token** — kapabilitas privat untuk mengubah konfirmasi.

### Pemeriksaan wajib

- sumber kebenaran setiap field;
- validasi browser dan validasi ulang backend;
- siapa boleh membuat, membaca, memperbarui, dan menghapus;
- masa berlaku token;
- retensi dan penghapusan data;
- perilaku saat data duplikat, hilang, rusak, atau terlambat;
- batas ukuran, jumlah, dan tipe upload;
- audit trail yang dibutuhkan;
- larangan memakai data produksi untuk test.

Gate M lulus setelah model data, trust boundary, dan aturan akses dapat dijelaskan tanpa asumsi kritis.

## A — Architecture

Pilih perubahan terkecil yang menjaga keamanan dan integritas data.

### Komponen saat ini

```text
Browser HTML
  |
  | google.script.run / Web App request
  v
Google Apps Script (Code.gs)
  |-- Google Sheets: data terstruktur
  |-- Google Drive: foto dan bukti transfer
  `-- Script Properties: konfigurasi/rahasia
```

### Aturan keputusan

1. Jangan buat fitur jika kebutuhan belum terbukti.
2. Gunakan kemampuan native GAS/HTML/CSS sebelum dependency.
3. Jangan tambah dependency tanpa approval.
4. Semua otorisasi diputuskan backend.
5. Browser dan parameter URL selalu tidak tepercaya.
6. Script Properties menyimpan konfigurasi privat; source tidak boleh menyimpan rahasia.
7. Scope OAuth memakai least privilege.
8. Perubahan auth, upload, sharing, atau manifest wajib security review.
9. Keputusan lintas fitur atau sulit dibalik dicatat sebagai ADR.
10. Staging memakai Spreadsheet dan Folder terpisah dari produksi.

### Review arsitektur minimum

- komponen dan file yang berubah;
- kontrak fungsi yang berubah;
- aliran data sebelum dan sesudah;
- trust boundary;
- kegagalan dan pemulihan;
- kompatibilitas data lama;
- observability tanpa membocorkan token/data buyer;
- rollback tanpa kehilangan data.

Gate A lulus setelah rencana implementasi, validasi, dan rollback disetujui manusia. Status item berubah menjadi `APPROVED`.

## D — Delivery

Delivery memisahkan implementasi, review, dan deployment.

### Implement

1. Buat branch `type/PLAN-ID-ringkasan`.
2. Ubah status menjadi `IN_PROGRESS`.
3. Baca ulang file sasaran.
4. Terapkan diff terkecil dalam scope.
5. Jangan menyentuh file lain tanpa memperbarui rencana dan approval.
6. Jangan memakai data produksi.

### Verify

1. Jalankan pemeriksaan yang ditulis pada item rencana.
2. Uji happy path, invalid input, akses tanpa izin, dan kegagalan layanan terkait.
3. Periksa diff dan file tidak terduga.
4. Cari rahasia, token, ID privat, data buyer, dan bukti transfer.
5. Catat perintah, hasil, batasan, dan rollback.
6. Ubah status menjadi `REVIEW`.

### Human review

Manusia memeriksa:

- acceptance criteria;
- scope;
- keamanan dan privasi;
- bukti validasi;
- diff;
- kesiapan rollback.

Status hanya menjadi `DONE` setelah approval akhir.

### Close

- perbarui `CHANGELOG.md`;
- buat ADR jika keputusan penting berubah;
- commit dengan ID pekerjaan;
- merge melalui review;
- deployment memakai approval terpisah;
- catat versi/deployment tanpa menyimpan URL atau ID privat bila tidak diperlukan.

## Matriks approval

| Aktivitas | Observe | Approval implementasi | Approval khusus |
|---|---:|---:|---:|
| Membaca source dan status Git | Ya | Tidak | Tidak |
| Menulis proposal di chat | Ya | Tidak | Tidak |
| Mengubah dokumentasi repository | Tidak | Ya | Tidak |
| Mengubah source/test/config | Tidak | Ya | Tergantung risiko |
| Menambah dependency | Tidak | Ya | Ya |
| Mengubah auth/token/sesi | Tidak | Ya | Security review |
| Mengubah scope OAuth/permission | Tidak | Ya | Security review |
| Operasi data produksi | Tidak | Tidak | Ya |
| Deploy/rollback produksi | Tidak | Tidak | Ya |
| Force push/reset/rebase histori bersama | Tidak | Tidak | Ya |

## Checklist prabuild

- [ ] Baseline Git tersedia dan bersih.
- [ ] Branch protection/review policy ditetapkan.
- [ ] Spreadsheet dan Drive staging tersedia.
- [ ] Script Properties staging terdokumentasi tanpa nilainya.
- [ ] Scope OAuth ditinjau.
- [ ] Threat model auth, share link, edit token, dan upload selesai.
- [ ] Validasi backend untuk semua input dipastikan.
- [ ] Kebijakan retensi data disetujui.
- [ ] Smoke test utama tersedia.
- [ ] Prosedur backup dan rollback diuji.
- [ ] Pemilik deployment dan approval produksi ditetapkan.

Build fitur dimulai hanya setelah item terkait melewati Gate B, M, dan A.