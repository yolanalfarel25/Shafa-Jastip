# Jastip Apps

Aplikasi jastip berbasis Google Apps Script (GAS), Google Sheets, Google Drive, dan tiga antarmuka HTML.

> **Status:** pengembangan staging. Perubahan dipetakan di Plan Mode dan mulai dikerjakan setelah pengguna berpindah ke Act Mode.

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

1. Pada Plan Mode, petakan Business, Model, Architecture, dan Delivery lalu sajikan plan di chat.
2. Perpindahan pengguna ke Act Mode menyetujui implementasi sesuai scope plan.
3. Pada Act Mode, catat task di `PLAN.md`, buat branch, dan kerjakan sampai validasi serta dokumentasi selesai.
4. Gunakan ulang konteks sesi yang masih valid; baca file sasaran sebelum edit dan konteks tambahan hanya bila diperlukan.
5. Terapkan perubahan terkecil. Jangan bekerja langsung pada branch utama.
6. Eskalasi hanya bila perlu menyentuh fungsi/file di luar plan, berisiko merusak/menimpa, gagal membuktikan keamanan, atau memerlukan operasi khusus.
7. Setelah selesai, tanyakan pilihan commit + push, commit saja, atau tidak keduanya.
8. Deployment/operasi produksi, perubahan data destruktif, merge, dan rewrite histori memerlukan konfirmasi khusus.

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

- `AGENTS.md` — kontrak kerja agen, approval Act Mode, dan gate eskalasi.
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
- Lindungi branch utama dan lakukan review manusia melalui konfirmasi commit/push atau proses merge.