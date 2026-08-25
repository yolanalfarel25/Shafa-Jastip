# Jastip Apps

Aplikasi jastip berbasis Google Apps Script (GAS), Google Sheets, Google Drive, dan tiga antarmuka HTML.

> **Status:** tahap prabuild. Perubahan fitur belum boleh dimulai sebelum `PLAN.md` disetujui dan baseline Git tersedia.

## Struktur proyek

| Jalur | Fungsi |
|---|---|
| `01_Login_Signup/Login.html` | Login dan pendaftaran jastiper |
| `02_Dashboard_Jastiper/Dashboard.html` | Dashboard, data buyer, profil, dan rekening |
| `03_Konfirmasi_Pembelian/Konfirmasi.html` | Form publik konfirmasi pembelian |
| `04_Backend_GAS/Code.gs` | Routing, autentikasi, penyimpanan data, dan integrasi Drive/Sheets |
| `04_Backend_GAS/appsscript.json` | Manifest GAS |
| `assets/logo-jastip-apps.png` | Logo utama |
| `docs/` | Dokumentasi arsitektur, keamanan, keputusan, dan perubahan |
| `.cline/rules/` | Aturan wajib untuk agen AI |

## Alur sistem

1. Jastiper mendaftar atau masuk.
2. Backend membuat dan memvalidasi sesi.
3. Jastiper membagikan link konfirmasi unik.
4. Buyer mengisi identitas, barang, foto, ekspedisi, rekening tujuan, dan bukti transfer.
5. Backend menyimpan data terstruktur ke Google Sheets dan berkas ke Google Drive.
6. Jastiper melihat data melalui dashboard.
7. Buyer dapat memperbarui data melalui link edit privat.

## Aturan sebelum perubahan

1. Baca `AGENTS.md`, `PLAN.md`, dan dokumen terkait di `docs/`.
2. Catat pekerjaan sebagai item teragenda di `PLAN.md`.
3. Tulis tujuan, ruang lingkup, file sasaran, risiko, pengujian, dan rollback.
4. Dapatkan persetujuan manusia sebelum mengubah source code.
5. Buat branch baru. Jangan bekerja langsung pada `main`.
6. Terapkan perubahan terkecil.
7. Jalankan pemeriksaan yang relevan.
8. Catat hasil di `CHANGELOG.md` dan, bila menyangkut keputusan teknis, di `docs/decisions/`.
9. Commit dengan pesan jelas. Satu commit untuk satu perubahan logis.
10. Deployment, perubahan data, kredensial, dan operasi destruktif selalu butuh persetujuan eksplisit.

## Menjalankan proyek

Source HTML memakai `google.script.run`; membuka file langsung hanya cocok untuk inspeksi visual statis. Runtime penuh membutuhkan deployment Google Apps Script.

Urutan setup awal:

1. Buat project GAS.
2. Salin `Code.gs`, manifest, dan HTML dengan nama file yang sesuai routing backend.
3. Konfigurasikan ID Spreadsheet/Folder melalui Script Properties bila backend mensyaratkannya.
4. Tinjau scope OAuth di `appsscript.json`.
5. Deploy sebagai Web App pada akun dan tingkat akses yang disetujui.
6. Uji memakai data nonproduksi.

Detail operasional wajib ditulis setelah lingkungan GAS aktual dikonfirmasi. Jangan menaruh ID, token, password, atau URL privat di repository.

## Dokumen kendali

- `AGENTS.md` — kontrak kerja agen dan approval gate.
- `PLAN.md` — backlog, agenda, dan status pekerjaan.
- `CHANGELOG.md` — histori perubahan yang telah selesai.
- `SECURITY.md` — kebijakan keamanan dan pelaporan.
- `docs/PROJECT_CONTEXT.md` — peta teknis brownfield.
- `docs/BMAD.md` — workflow analisis hingga delivery.
- `docs/AGENT_PROMPTS.md` — panduan prompt agen (awal build, lanjut task, pemulihan task).
- `docs/decisions/README.md` — log keputusan arsitektur.

## Rekomendasi awal

- Audit backend dan izin GAS sebelum deployment.
- Pisahkan konfigurasi dari source code memakai Script Properties.
- Tambahkan pengujian terotomasi untuk fungsi murni dan smoke test staging.
- Hindari penyimpanan token sesi jangka panjang di `localStorage`; evaluasi cookie aman atau sesi berumur pendek sesuai batas GAS.
- Terapkan validasi file server-side: MIME, ukuran, ekstensi, dan batas jumlah.
- Tetapkan retensi serta penghapusan data buyer dan bukti transfer.
- Gunakan Spreadsheet dan Folder staging terpisah dari produksi.
- Lindungi branch `main` dan wajibkan review manusia.