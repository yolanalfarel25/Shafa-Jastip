# Panduan Prompt Agen — Jastip Apps

Dokumen ini berisi tiga prompt operasional siap pakai untuk agen AI. Semua prompt disusun agar selaras dengan `AGENTS.md`, `PLAN.md`, `SECURITY.md`, `docs/BMAD.md`, dan `docs/PROJECT_CONTEXT.md`.

---

## 1. Prompt Awal Memulai Build Project

Gunakan prompt ini saat membuka sesi baru sebelum pekerjaan fitur atau perbaikan dimulai.

```text
Kamu bekerja pada repository "Jastip Apps" dengan aturan kendali ketat.

Langkah wajib:
1. Mulai hanya dalam mode Observe. Jangan mengedit file, jangan membuat commit, jangan menambah dependency, dan jangan menjalankan operasi destruktif.
2. Baca file berikut secara berurutan:
   - AGENTS.md
   - PLAN.md
   - SECURITY.md
   - docs/BMAD.md
   - docs/PROJECT_CONTEXT.md
   - README.md
3. Periksa status Git lokal, branch aktif, dan working tree tanpa mengubah file.
4. Identifikasi apakah ada pekerjaan aktif berstatus APPROVED atau REVIEW di PLAN.md.
5. Jalankan analisis kebutuhan memakai alur BMAD:
   - Business: tujuan, pengguna, acceptance criteria, hal di luar scope.
   - Model: entitas, sumber kebenaran, validasi backend, data sensitif.
   - Architecture: diff terkecil, least privilege, zero-trust browser, Script Properties.
   - Delivery: rencana branch, validasi, dan rollback.
6. Buat proposal item baru di PLAN.md dengan status PROPOSED.
7. Tunggu persetujuan manusia. Jangan mulai implementasi sebelum manusia memberikan teks persetujuan eksplisit.
8. Ingat: persetujuan rencana BUKAN persetujuan implementasi, dan persetujuan implementasi BUKAN persetujuan deployment.
```

---

## 2. Prompt Melanjutkan Plan / Task

Gunakan prompt ini saat melanjutkan pekerjaan yang sudah terdaftar di `PLAN.md`.

```text
Lanjutkan pekerjaan teragenda untuk Jastip Apps.

Parameter tugas:
- Task ID: [JST-NNN]
- Ringkasan tujuan: [Tuliskan ringkasan singkat fitur/perbaikan]

Langkah wajib:
1. Baca kembali item [JST-NNN] di PLAN.md dan periksa statusnya:
   - Jika masih PROPOSED: jangan ubah source; laporkan bahwa task membutuhkan persetujuan manusia terlebih dahulu.
   - Jika sudah APPROVED: pastikan branch kerja sesuai format (contoh: feat/JST-NNN-ringkasan) dan ubah status menjadi IN_PROGRESS jika implementasi dimulai.
   - Jika sudah REVIEW: jangan implementasi ulang; lakukan verifikasi tambahan atau tunggu review manusia.
2. Baca seluruh file yang terdaftar dalam "Ruang lingkup" item tersebut sebelum melakukan edit.
3. Kerjakan hanya file yang berada di dalam scope. Dilarang mengubah file di luar scope tanpa memperbarui PLAN.md dan meminta persetujuan ulang.
4. Jaga perubahan tetap minimal, tanpa dependency baru, dan tanpa melemahkan validasi server-side atau autentikasi.
5. Setelah implementasi:
   - Jalankan validasi yang tercantum pada item rencana.
   - Periksa diff untuk memastikan tidak ada perubahan tak terduga.
   - Lakukan audit rahasia: pastikan tidak ada token, password, ID produksi, atau data pribadi baru.
   - Catat bukti hasil validasi pada item [JST-NNN].
   - Ubah status item menjadi REVIEW.
6. Tunggu persetujuan akhir manusia sebelum commit, merge, atau pembaruan CHANGELOG.md.
```

---

## 3. Prompt Pemulihan Task / Act yang Terkendala di Tengah Jalan

Gunakan prompt ini saat sesi terputus, tool gagal, terminal mati, context window ter-reset, atau terjadi error tak terduga saat Act mode.

```text
Sesi kerja sebelumnya terputus di tengah jalan. Lakukan prosedur pemulihan aman berikut:

Langkah investigasi (Mode Observe):
1. Jangan langsung mengulang perintah write/replace atau mengeksekusi perintah shell yang berpotensi destruktif.
2. Anggap setiap pemanggilan tool terakhir yang belum memiliki status sukses terkonfirmasi sebagai GAGAL atau BELUM SELESAI.
3. Periksa status workspace:
   - Jalankan pemeriksaan branch dan status Git (git status --short --branch).
   - Tinjau diff aktif (git diff) untuk melihat baris mana yang sudah terubah.
   - Periksa daftar file tak terlacak (untracked files).
4. Baca PLAN.md untuk menentukan task ID yang sedang aktif, status terakhir yang tercatat, dan acceptance criteria.
5. Bandingkan kondisi file sasaran saat ini dengan acceptance criteria dan rencana implementasi pada task tersebut.

Langkah penanganan:
6. Identifikasi apakah kendala disebabkan oleh:
   - Error sintaks / linter / diff formatting.
   - Perubahan file yang parsial / setengah tertulis.
   - File di luar scope yang tidak sengaja terubah.
   - Ambiguasi persetujuan atau kebutuhan.
7. Jika ada file di luar scope yang terubah, jangan pulihkan atau hapus otomatis. Hentikan perubahan, catat file tersebut, dan minta keputusan manusia agar perubahan pengguna tidak hilang.
8. Jika ada perubahan parsial yang rusak, perbaiki secara terarah hanya pada file yang masuk scope task aktif dan sudah memiliki approval implementasi.
9. Jangan gunakan git reset hard, force checkout massal, rebase, atau amend pada commit bersama tanpa persetujuan eksplisit.
10. Setelah kondisi stabil, jalankan ulang langkah validasi terkecil yang relevan.
11. Laporkan kepada manusia:
    - Task ID yang sedang dipulihkan.
    - Kondisi terakhir yang ditemukan saat resume.
    - Tindakan perbaikan yang dilakukan.
    - Status validasi saat ini (tetap IN_PROGRESS atau siap naik ke REVIEW).
```
