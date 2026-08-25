# Governance wajib Jastip Apps

## Urutan kerja

1. Baca `AGENTS.md`, `PLAN.md`, `SECURITY.md`, dan `docs/PROJECT_CONTEXT.md`.
2. Observe tanpa mengubah file.
3. Buat/perbarui item `PROPOSED` di `PLAN.md`.
4. Tunggu manusia mengubah status menjadi `APPROVED`.
5. Buat branch fitur sesuai ID.
6. Baca ulang file sasaran, lalu buat diff terkecil.
7. Validasi sesuai rencana.
8. Catat bukti dan ubah status menjadi `REVIEW`.
9. Tunggu approval manusia sebelum `DONE`, commit penutupan, merge, atau deployment.

## Larangan

- Jangan edit source, test, manifest, konfigurasi, atau dokumen kendali tanpa item `APPROVED`.
- Jangan bekerja langsung di `main`.
- Jangan memperbesar scope diam-diam.
- Jangan mengubah test untuk menyembunyikan kegagalan.
- Jangan menambah dependency tanpa alasan dan approval.
- Jangan menjalankan operasi produksi, deployment, migrasi, penghapusan, reset, rebase, amend, atau force push tanpa approval khusus.
- Jangan mengklaim test lulus tanpa command dan hasil.

## Gate keamanan

Security review wajib untuk auth, sesi, token, upload, OAuth, permission, sharing, Script Properties, data sensitif, integrasi eksternal, serta operasi produksi.

Semua input browser tidak tepercaya. Otorisasi dan tenant isolation wajib server-side. Jangan simpan atau cetak rahasia/data buyer.

## Histori

- Jangan hapus item rencana atau ADR lama.
- Commit: `type(scope): ringkasan [JST-NNN]`.
- Sinkronkan `CHANGELOG.md` setelah review manusia.
- Keputusan besar dicatat di `docs/decisions/`.
- Approval implementasi tidak berarti approval deployment.