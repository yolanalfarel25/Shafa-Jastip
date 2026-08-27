# ADR-001 — Workflow persetujuan berbasis Plan/Act Mode, eksekusi mandiri, dan konfirmasi commit/push

- **Status:** ACCEPTED
- **Tanggal:** 2026-08-27
- **PLAN ID:** JST-026
- **Pemilik keputusan:** Master (pengguna) dan agen governance

## Konteks

Sebelum keputusan ini, workflow mewajibkan approval terpisah di banyak titik: Observe -> proposal -> approval rencana -> approval implementasi -> verifikasi -> review -> approval akhir untuk `DONE`. Selain itu, dokumen kendali wajib dibaca ulang secara penuh pada setiap prompt, memperlambat respon dan menimbulkan gesekan pada perubahan berulang.

Master menginginkan alur kerja yang lebih ringkas dan fokus:
1. Saat prompt masuk, agen memetakan kebutuhan memakai alur BMAD di Plan Mode tanpa harus membaca ulang seluruh file secara berlebihan.
2. Proposal plan disajikan di chat.
3. Saat pengguna berpindah ke Act Mode, perpindahan tersebut berlaku sebagai persetujuan resmi atas scope plan.
4. Agen langsung mengeksekusi pekerjaan sampai tuntas dengan hati-hati tanpa approval tambahan.
5. Eskalasi ke Master hanya terjadi bila perubahan berdampak ke file/fungsi di luar plan, berisiko merusak sistem, berpotensi menimpa perubahan pengguna, atau menyangkut operasi khusus/destruktif.
6. Setelah pekerjaan selesai, agen selalu menanyakan konfirmasi kepada Master terkait commit dan push.

## Driver keputusan

- Menghilangkan proses bolak-balik approval pada siklus implementasi normal.
- Mengoptimalkan konsumsi token dan waktu respon dengan memakai ulang konteks sesi.
- Tetap menjaga keamanan, privasi, isolasi data, dan kehati-hatian teknis.
- Memberikan kontrol akhir penuh kepada Master sebelum perubahan di-commit atau di-push.

## Opsi

### Opsi 1 — Mempertahankan approval berulang per gate (status quo)
- Kelebihan: audit trail manusia sangat rapat pada setiap transisi status.
- Kekurangan: sangat lambat, repetitif, dan menimbulkan overhead token yang tinggi.
- Risiko: pengguna mengalami kelelahan approval sehingga efisiensi menurun.

### Opsi 2 — Eksekusi bebas tanpa plan atau tanpa batasan eskalasi
- Kelebihan: paling cepat.
- Kekurangan: rentan scope creep, berisiko merusak fungsi lain, dan berpotensi membocorkan rahasia atau mengubah data produksi.
- Risiko: kehilangan kendali atas integritas sistem.

### Opsi 3 — Plan Mode terstruktur BMAD, approval tunggal via Act Mode, eksekusi mandiri dengan gate eskalasi, dan konfirmasi commit/push di akhir (dipilih)
- Kelebihan: transisi cepat dan efisien, plan tetap jelas, keamanan tetap terjaga, eskalasi hanya pada risiko riil, dan kendali Git tetap di tangan Master.
- Kekurangan: agen membutuhkan disiplin tinggi dalam memvalidasi scope dan mendeteksi benturan sebelum mengedit.
- Risiko: mitigasi melalui gate eskalasi wajib dan larangan commit/push otomatis.

## Keputusan

1. **Intake & BMAD Plan**: pada Plan Mode, agen menganalisis masalah dan menyajikan proposal BMAD di chat. File kendali dibaca jika belum ada dalam sesi; konteks yang sudah dipahami dipakai ulang.
2. **Approval via Mode Switch**: perpindahan pengguna ke Act Mode adalah persetujuan resmi atas scope plan.
3. **Eksekusi Mandiri**: pada Act Mode, agen mencatat task di `PLAN.md` menjadi `IN_PROGRESS`, membuat/memakai branch fitur, melakukan edit minimal, memvalidasi mandiri, dan menutup item ke `DONE` tanpa approval perantara.
4. **Gate Eskalasi Terarah**: agen wajib berhenti dan melapor ke Master hanya jika:
   - memerlukan file atau fungsi di luar plan;
   - berisiko merusak/menimpa fungsi atau perubahan lokal lain;
   - asumsi keamanan/tenant isolation tidak terbukti;
   - memerlukan operasi produksi, migrasi destruktif, atau destructive Git command.
5. **Konfirmasi Akhir Git**: setelah selesai, agen selalu menanyakan apakah Master ingin commit + push, commit saja, atau tidak commit/push. Tidak ada commit/push otomatis.

## Konsekuensi

### Positif
- Alur kerja jauh lebih cepat dan fokus pada masalah teknis aktual.
- Token context window lebih hemat karena tidak membaca ulang dokumen kendali secara massal.
- Master tetap memegang kendali penuh atas scope awal dan persetujuan akhir commit/push.

### Negatif
- Agen harus memverifikasi sendiri keberhasilan build/test lokal sebelum menandai status `DONE`.

### Risiko keamanan & data
- Risiko mitigasi: zero-trust client input, validasi server-side, larangan hardcoded secret/data produksi, dan isolasi tenant tetap berlaku penuh. Security review tetap wajib dijalankan oleh agen sebagai bagian dari proses verifikasi.

## Validasi

- Seluruh dokumen kendali (`.cline/rules/01-governance.md`, `AGENTS.md`, `PLAN.md`, `SECURITY.md`, `README.md`, `docs/BMAD.md`, `docs/AGENT_PROMPTS.md`, `docs/PROJECT_CONTEXT.md`) diselaraskan.
- Tidak ada kontradiksi aturan approval di seluruh repository.
- Histori task masa lalu (`JST-001` s/d `JST-025`) tetap utuh.

## Rollback atau strategi keluar

Jika alur ini terbukti melonggarkan batasan secara tidak aman, buat ADR baru yang menandai ADR-001 `SUPERSEDED` dan kembalikan aturan approval bertingkat di dokumen kendali terkait.
