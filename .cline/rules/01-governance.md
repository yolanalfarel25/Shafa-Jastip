# Governance Jastip Apps

## Urutan kerja

1. **Intake & Plan (Plan Mode)**:
   - Agen membaca konteks yang diperlukan (cukup sekali per sesi; gunakan ulang konteks yang sudah dipahami).
   - Petakan masalah memakai alur BMAD yang fokus pada inti masalah.
   - Sajikan proposal plan di chat tanpa mengubah repository.
2. **Approval via Act Mode**:
   - Manusia menyetujui rencana dengan berpindah ke **Act Mode** (atau mengirim prompt saat Act Mode aktif).
   - Perpindahan mode ini adalah approval resmi untuk ruang lingkup yang tertulis dalam plan.
3. **Eksekusi mandiri (Act Mode)**:
   - Agen mencatat/memperbarui item di `PLAN.md` dengan status `IN_PROGRESS`.
   - Buat/gunakan branch kerja sesuai ID (contoh: `feat/JST-NNN-ringkasan`).
   - Periksa file sasaran sebelum edit; buat diff terkecil yang tepat sasaran.
   - Jalankan pekerjaan secara hati-hati sampai selesai tanpa meminta approval rutin berulang.
4. **Validasi & Selesai**:
   - Jalankan validasi sesuai rencana dan catat bukti nyata.
   - Ubah status item di `PLAN.md` menjadi `DONE` serta sinkronkan `CHANGELOG.md`.
5. **Konfirmasi penutupan**:
   - Setelah seluruh pekerjaan selesai, tanyakan konfirmasi kepada Master: apakah ingin melakukan commit, commit + push, atau tidak melakukan commit/push.

## Gate eskalasi ke Master

Agen wajib berhenti dan memberi tahu Master hanya jika:

- Perubahan perlu menyentuh file atau fungsi lain di luar ruang lingkup plan.
- Terdapat potensi benturan, regresi, atau kerusakan fungsi yang bersinggungan.
- Ditemukan perubahan lokal milik pengguna yang berisiko tertimpa.
- Memerlukan operasi berisiko tinggi atau sulit dibalik: modifikasi data produksi, deployment produksi, migrasi schema destruktif, penghapusan resource, force push, reset hard, atau rebase histori bersama.
- Asumsi keamanan atau isolasi data tidak dapat dibuktikan.

Untuk bug, perbaikan sintaks, dan penyesuaian lokal dalam ruang lingkup plan yang sudah disetujui, agen menyelesaikan langsung tanpa meminta approval tambahan.

## Gate keamanan

- Semua input browser dianggap tidak tepercaya; otorisasi dan tenant isolation wajib server-side.
- Jangan simpan atau cetak rahasia, token, password, ID privat, atau data buyer di Git/log.
- Perubahan auth, sesi, token, upload Drive, permission, scope OAuth, dan Script Properties tetap memerlukan security review oleh agen sebelum diselesaikan.
- Approval implementasi bukan persetujuan deployment produksi atau modifikasi data produksi.

## Histori & Git

- Jangan hapus item rencana atau ADR lama.
- Format commit: `type(scope): ringkasan [JST-NNN]`.
- Keputusan arsitektur atau keamanan lintas task dicatat di `docs/decisions/`.
- Jangan commit atau push otomatis; selalu tunggu konfirmasi pilihan dari Master di akhir task.