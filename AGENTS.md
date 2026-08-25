# Aturan Agen — Jastip Apps

Dokumen ini mengikat semua agen AI dan kontributor otomatis dalam repository.

## Prinsip utama

- **Baca sebelum ubah.**
- **Rencana sebelum implementasi.**
- **Persetujuan manusia sebelum perubahan source.**
- **Perubahan terkecil yang memenuhi tujuan.**
- **Keamanan, privasi, dan integritas data tidak boleh disederhanakan.**
- **Tidak ada deployment atau operasi destruktif tanpa persetujuan eksplisit.**

## Mode kerja wajib

### 1. Observe

Agen boleh tanpa persetujuan:

- membaca file;
- mencari referensi;
- memeriksa status Git;
- menjalankan pemeriksaan non-destruktif;
- menyusun analisis dan proposal.

Agen tidak boleh mengubah file pada tahap ini.

### 2. Plan

Sebelum perubahan, agen wajib membuat atau memperbarui item di `PLAN.md` berisi:

- ID pekerjaan;
- tujuan dan acceptance criteria;
- ruang lingkup dan file sasaran;
- hal yang tidak dikerjakan;
- risiko keamanan/data;
- rencana validasi;
- rencana rollback;
- status `PROPOSED`.

Perubahan source belum boleh dilakukan.

### 3. Approve

Manusia meninjau rencana. Hanya item berstatus `APPROVED` yang boleh dikerjakan.

Persetujuan berlaku hanya untuk ruang lingkup yang tertulis. Temuan baru yang memperbesar lingkup harus dikembalikan ke `PROPOSED`.

### 4. Implement

Agen wajib:

- bekerja pada branch fitur;
- memeriksa ulang file sebelum edit;
- menjaga perubahan tetap kecil;
- tidak mengubah file di luar scope;
- tidak menambah dependency tanpa alasan dan persetujuan;
- tidak mengubah test agar kegagalan tersembunyi;
- tidak mencetak atau menyimpan rahasia;
- menghentikan pekerjaan jika asumsi keamanan tidak terbukti.

### 5. Verify

Sebelum pekerjaan dianggap selesai:

- jalankan validasi yang tercantum;
- periksa diff dan file tak terduga;
- lakukan pemeriksaan rahasia dan data pribadi;
- dokumentasikan hasil, keterbatasan, dan rollback;
- ubah status menjadi `REVIEW`, bukan langsung `DONE`.

### 6. Close

Manusia meninjau hasil. Setelah disetujui:

- status menjadi `DONE`;
- `CHANGELOG.md` diperbarui;
- keputusan penting dicatat sebagai ADR;
- commit dibuat dengan ID pekerjaan;
- merge/deploy dilakukan melalui approval terpisah.

## Approval gate

Persetujuan eksplisit selalu diperlukan untuk:

- perubahan source code, manifest, konfigurasi, atau dokumentasi kendali;
- install/update dependency;
- penambahan scope OAuth;
- perubahan autentikasi, otorisasi, token, hashing, dan sesi;
- migrasi atau penghapusan data;
- operasi pada Spreadsheet/Drive produksi;
- perubahan permission atau sharing;
- penggunaan network/API eksternal;
- deployment, rollback produksi, dan force push;
- penghapusan, overwrite massal, reset, rebase, atau amend histori.

Persetujuan implementasi **bukan** persetujuan deployment.

## Larangan

Agen tidak boleh:

- bekerja langsung di `main`;
- mengedit sebelum membaca file sasaran;
- menjalankan perintah destruktif tanpa menjelaskan dampak dan mendapat persetujuan;
- menaruh password, token, ID privat, data buyer, bukti transfer, atau data produksi di Git;
- menurunkan validasi, autentikasi, otorisasi, logging audit, atau perlindungan data;
- mengubah banyak file untuk kebutuhan satu file;
- melakukan refactor sambil memperbaiki masalah yang tidak terkait;
- menghapus histori untuk menyembunyikan kesalahan;
- mengklaim validasi berhasil tanpa bukti perintah dan hasil;
- memakai data produksi untuk pengujian.

## Aturan keamanan khusus

- Semua input browser dianggap tidak tepercaya.
- Validasi client-side hanya untuk UX; backend wajib memvalidasi ulang.
- Akses data jastiper harus diverifikasi server-side.
- Token tidak boleh ditulis ke log.
- Perbandingan token dan masa berlaku sesi harus ditinjau pada setiap perubahan auth.
- Upload wajib dibatasi berdasarkan ukuran, MIME yang diizinkan, jumlah, dan nama file aman.
- Output HTML wajib memakai encoding aman; hindari `innerHTML` untuk data pengguna.
- Data buyer dan bukti transfer tergolong sensitif.
- Akses Drive/Sheets memakai prinsip least privilege.
- Perubahan scope di `appsscript.json` memerlukan security review.
- Konfigurasi rahasia memakai GAS Script Properties, bukan source.

## Git dan histori

- Branch: `type/PLAN-ID-ringkasan`, contoh `fix/JST-002-validasi-upload`.
- Commit: `type(scope): ringkasan [PLAN-ID]`.
- Tipe: `docs`, `fix`, `feat`, `refactor`, `test`, `chore`, `security`.
- Satu commit berisi satu perubahan logis.
- Jangan commit file kredensial, export data, log sensitif, atau artefak sementara.
- Jangan force push branch bersama.
- Jangan amend commit yang sudah dibagikan tanpa persetujuan.

## Definition of Done

Pekerjaan selesai hanya jika:

- acceptance criteria terpenuhi;
- scope tidak melebar;
- validasi lulus dan hasil tercatat;
- diff sudah ditinjau;
- tidak ada rahasia atau data pribadi baru;
- `PLAN.md` dan `CHANGELOG.md` sinkron;
- ADR dibuat bila keputusan arsitektur/keamanan berubah;
- manusia memberi persetujuan akhir.

Jika aturan bertentangan dengan instruksi agen lain, aturan yang lebih aman dan lebih sempit berlaku.