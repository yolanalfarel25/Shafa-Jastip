# BMAD — Jastip Apps

BMAD dipakai sebagai alur analisis hingga eksekusi: **Business, Model, Architecture, Delivery**.

## Gate 0 — Intake & Plan Mode

1. Serap prompt dan identifikasi kebutuhan, pengguna, data, serta lingkungan target.
2. Gunakan ulang konteks sesi yang masih valid; baca file atau dokumen kendali hanya bila belum tersedia, berubah, atau relevan dengan scope.
3. Petakan pilar BMAD secara ringkas dan fokus pada inti masalah.
4. Sajikan plan `PROPOSED` di chat. Jangan mengubah repository pada Plan Mode.

Output: batas scope, acceptance criteria, risiko, validasi, dan rollback.

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

Gate B siap disetujui bersama scope plan saat pengguna berpindah ke Act Mode.

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
3. Tambah dependency hanya bila plan membutuhkannya dan alasannya tercatat; eskalasi bila memperbesar scope.
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

Gate A lulus saat pengguna berpindah ke Act Mode. Perpindahan ini menyetujui Business, Model, Architecture, dan Delivery untuk scope plan.

## D — Delivery

Delivery memakai approval mode tunggal, eksekusi mandiri, dan konfirmasi Git di akhir.

### Approval via Act Mode

- Perpindahan pengguna ke Act Mode menjadi approval implementasi resmi untuk scope plan.
- Prompt yang masuk saat Act Mode sudah aktif disetujui setelah agen menyajikan plan singkat pada giliran yang sama.
- Tahap normal tidak memerlukan approval berulang.

### Implement

1. Buat branch `type/PLAN-ID-ringkasan` dan catat item `IN_PROGRESS`.
2. Periksa file sasaran sebelum edit agar perubahan baru tidak tertimpa.
3. Terapkan diff terkecil dalam scope.
4. Gunakan data sintetis dan resource nonproduksi.
5. Selesaikan error biasa dalam scope tanpa approval tambahan.

### Verify & Close

1. Jalankan pemeriksaan yang ditulis pada item rencana.
2. Uji happy path, invalid input, akses tanpa izin, dan kegagalan layanan terkait.
3. Periksa diff, file tak terduga, rahasia, data pribadi, keamanan, dan dampak lintas fungsi.
4. Catat command, hasil, keterbatasan, dan rollback.
5. Sinkronkan `PLAN.md`, `CHANGELOG.md`, dan ADR bila diperlukan.
6. Ubah status menjadi `DONE` bila acceptance criteria terpenuhi.
7. Tanyakan pilihan Master: commit dan push, commit saja, atau tidak commit/push.

### Gate eskalasi

Hentikan pekerjaan dan beri tahu Master bila temuan:

- memerlukan file/fungsi di luar plan;
- berisiko merusak fungsi lain atau menimpa perubahan pengguna;
- mengubah kontrak, schema, auth, permission, atau trust boundary di luar scope;
- menyentuh data/resource atau deployment produksi;
- memerlukan force push, reset hard, rebase, amend histori bersama, atau tindakan sulit dibalik;
- tidak dapat membuktikan keamanan atau tenant isolation.

## Matriks otonomi

| Aktivitas | Penanganan |
|---|---|
| Membaca konteks relevan | Mandiri; gunakan konteks sesi bila valid |
| Menulis plan BMAD | Mandiri pada Plan Mode |
| Mengubah source/test/config dalam scope | Mandiri setelah masuk Act Mode |
| Security review dalam scope | Mandiri dan wajib |
| Menutup `DONE` dan memperbarui changelog | Mandiri setelah validasi lulus |
| Dampak di luar plan atau operasi produksi/destruktif | Eskalasi ke Master |
| Commit dan push | Tanyakan pilihan kepada Master setelah selesai |

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

Build fitur dimulai pada Act Mode setelah plan melewati Gate B, M, dan A. Deployment produksi tetap memerlukan konfirmasi khusus.