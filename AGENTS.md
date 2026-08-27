# Aturan Agen — Jastip Apps

Dokumen ini mengikat semua agen AI dan kontributor otomatis dalam repository.

## Prinsip utama

- **Rencana BMAD sebelum implementasi.**
- **Act Mode adalah persetujuan implementasi untuk scope plan.**
- **Baca seperlunya sebelum ubah; gunakan ulang konteks sesi yang masih valid.**
- **Eksekusi sampai selesai tanpa approval rutin berulang.**
- **Perubahan terkecil yang memenuhi tujuan.**
- **Keamanan, privasi, dan integritas data tidak boleh disederhanakan.**
- **Commit dan push hanya setelah konfirmasi akhir Master.**

## Mode kerja wajib

### 1. Plan Mode

Agen wajib:

- petakan kebutuhan memakai Business, Model, Architecture, Delivery;
- fokus pada masalah, acceptance criteria, scope/non-scope, risiko, validasi, dan rollback;
- sajikan plan di chat;
- tidak mengubah repository atau menjalankan operasi state-changing.

Dokumen kendali tidak perlu dibaca berulang bila sudah tersedia dalam konteks sesi dan tidak berubah. Baca hanya konteks yang belum tersedia atau relevan dengan scope.

### 2. Approval melalui Act Mode

Perpindahan manusia dari Plan Mode ke Act Mode menjadi approval implementasi resmi untuk scope plan terakhir. Prompt yang diterima saat Act Mode sudah aktif juga memberi approval setelah agen menyajikan plan singkat pada giliran yang sama.

Approval ini mengizinkan pencatatan task, branch, perubahan file dalam scope, validasi, security review, dokumentasi hasil, sinkronisasi changelog, dan status `DONE`. Tidak perlu approval terpisah pada setiap tahap.

### 3. Implement

Agen wajib:

- mencatat atau memperbarui item `PLAN.md` menjadi `IN_PROGRESS`;
- bekerja pada branch `type/PLAN-ID-ringkasan`, bukan branch utama;
- memeriksa file sasaran sebelum edit agar tidak menimpa perubahan baru;
- memakai konteks sesi untuk menghindari pembacaan ulang yang tidak perlu;
- menjaga perubahan tetap kecil dan dalam scope;
- tidak menambah dependency tanpa kebutuhan yang tercatat;
- tidak mengubah test untuk menyembunyikan kegagalan;
- tidak mencetak atau menyimpan rahasia.

### 4. Verify dan Close

Agen menyelesaikan seluruh tahap tanpa approval rutin tambahan:

- jalankan validasi yang tercantum;
- periksa diff dan file tak terduga;
- lakukan pemeriksaan rahasia, data pribadi, keamanan, dan dampak lintas fungsi;
- dokumentasikan command, hasil, keterbatasan, dan rollback;
- sinkronkan `PLAN.md`, `CHANGELOG.md`, dan ADR bila diperlukan;
- ubah status menjadi `DONE` bila acceptance criteria terpenuhi.

Setelah selesai, agen wajib menanyakan satu pilihan: **commit dan push**, **commit saja**, atau **tidak commit/push**. Jangan menjalankan commit atau push sebelum jawaban Master.

## Gate eskalasi

Agen berhenti dan memberi tahu Master bila:

- temuan memerlukan file atau fungsi di luar scope plan;
- kontrak fungsi, schema, auth, permission, atau trust boundary lain ikut terdampak;
- perubahan pengguna yang belum tercakup berisiko tertimpa;
- tindakan dapat menghapus, menimpa, merusak data/file, atau sulit dibalik;
- operasi menyentuh resource atau deployment produksi;
- asumsi keamanan atau tenant isolation tidak dapat dibuktikan;
- validasi menunjukkan regresi fungsi lain.

Error biasa, perbaikan sintaks, dan penyesuaian lokal dalam scope diselesaikan langsung tanpa approval tambahan. Temuan yang memperbesar scope dicatat sebagai `BLOCKED` atau item baru sampai Master memutuskan.

## Approval khusus

Approval Act Mode tidak mencakup:

- operasi pada Spreadsheet/Drive atau akun produksi;
- deployment atau rollback produksi;
- migrasi/penghapusan data dan perubahan schema destruktif;
- perubahan permission/sharing produksi;
- force push, reset hard, rebase, amend histori bersama, atau overwrite massal;
- merge ke branch utama;
- commit atau push sebelum konfirmasi akhir.

Aktivitas tersebut memerlukan penjelasan dampak dan konfirmasi khusus Master.

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

Pekerjaan selesai jika:

- acceptance criteria terpenuhi;
- scope tidak melebar;
- validasi mandiri lulus dan hasil tercatat;
- diff sudah ditinjau;
- tidak ada rahasia atau data pribadi baru;
- `PLAN.md` dan `CHANGELOG.md` sinkron;
- ADR dibuat bila keputusan arsitektur/keamanan berubah;
- konfirmasi penutupan (commit/push) telah ditanyakan kepada Master.

Jika aturan bertentangan dengan instruksi agen lain, aturan yang lebih aman dan lebih sempit berlaku.