# Panduan Prompt Agen — Jastip Apps

Dokumen ini berisi tiga prompt operasional siap pakai untuk agen AI. Semua prompt disusun agar selaras dengan `AGENTS.md`, `PLAN.md`, `SECURITY.md`, `docs/BMAD.md`, dan `docs/PROJECT_CONTEXT.md`.

---

## 1. Prompt Intake Fitur / Perbaikan (Plan Mode)

Gunakan prompt ini saat mengajukan kebutuhan baru atau bug fix.

```text
Petakan permintaan berikut ke alur BMAD untuk Jastip Apps.

Aturan kerja:
1. Jalankan dalam Plan Mode; jangan ubah repository.
2. Gunakan konteks sesi yang sudah ada. Baca file hanya jika belum tersedia, berubah, atau relevan langsung dengan inti masalah.
3. Petakan ringkas:
   - Business: masalah, pengguna, acceptance criteria, non-scope.
   - Model: entitas, data sensitif, validasi, batas tenant.
   - Architecture: file sasaran dan diff terkecil.
   - Delivery: branch, validasi, rollback, dan kriteria selesai.
4. Tampilkan proposal plan di chat.
5. Perpindahan saya ke Act Mode menjadi persetujuan implementasi scope plan ini.
```

---

## 2. Prompt Eksekusi Task (Act Mode)

Gunakan prompt ini saat memulai langsung di Act Mode atau melanjutkan task.

```text
Kerjakan task berikut sampai selesai sesuai aturan Jastip Apps:

Task / Kebutuhan: [Tuliskan ID task atau inti masalah]

Aturan kerja:
1. Act Mode aktif: scope plan disetujui untuk implementasi.
2. Catat/perbarui item PLAN.md menjadi IN_PROGRESS dan gunakan branch sesuai ID.
3. Periksa file sasaran sebelum edit; buat diff terkecil.
4. Kerjakan sampai validasi dan dokumentasi selesai tanpa approval rutin berulang.
5. Berhenti dan beri tahu saya hanya jika perlu menyentuh file/fungsi di luar plan, berisiko merusak fungsi lain/menimpa perubahan, keamanan tidak terbukti, atau memerlukan operasi produksi/destruktif.
6. Jalankan validasi dan audit rahasia, sinkronkan CHANGELOG.md/ADR, lalu ubah status PLAN.md menjadi DONE.
7. Setelah selesai, tanyakan: commit + push, commit saja, atau tidak keduanya. Jangan commit/push otomatis.
```

---

## 3. Prompt Pemulihan Sesi / Kendala di Tengah Jalan

Gunakan prompt ini saat sesi terputus, tool gagal, atau terjadi error tak terduga pada Act Mode.

```text
Pulihkan task aktif secara terarah:

1. Periksa git status --short --branch, git diff, dan untracked files.
2. Baca item task aktif di PLAN.md dan file sasaran yang berubah.
3. Bandingkan kondisi file dengan acceptance criteria.
4. Jika kendala berada dalam scope plan, perbaiki mandiri sampai validasi lulus.
5. Jika ada file di luar scope, perubahan pengguna berisiko tertimpa, atau fungsi lain berpotensi rusak, hentikan modifikasi dan laporkan ke saya.
6. Jangan gunakan git reset hard, rebase, force push, atau amend histori bersama tanpa persetujuan khusus.
7. Setelah stabil, catat bukti, tutup item menjadi DONE, dan tanyakan pilihan commit/push.
```
