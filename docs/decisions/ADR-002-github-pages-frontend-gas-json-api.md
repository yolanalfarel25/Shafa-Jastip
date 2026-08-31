# ADR-002 — Migrasi Frontend Mandiri GitHub Pages dengan Backend GAS JSON Web API

- **Status:** ACCEPTED
- **Tanggal:** 2026-08-31
- **PLAN ID:** JST-028
- **Pemilik keputusan:** Master (pengguna) dan agen implementasi

## Konteks

Sebelum keputusan ini, seluruh antarmuka web Shafa Jastip disajikan langsung melalui Web App Google Apps Script (`doGet` yang mengevaluasi template `HtmlService.createTemplateFromFile`). Frontend berjalan di dalam iframe sandbox Google Apps Script (`script.googleusercontent.com`) dan memanggil fungsi backend melalui `google.script.run`.

Arsitektur ini memiliki keterbatasan:
1. Ketergantungan iframe sandbox menimbulkan isu styling, navigasi URL host, viewport top-level, dan pembacaan parameter URL query.
2. Tidak dapat dihosting secara independen pada static site hosting modern seperti GitHub Pages.
3. Arsitektur referensi internal `nadhirafarma/absensi_apotek` membuktikan pola hosting frontend statis di GitHub Pages dengan backend Google Apps Script JSON Web API (`fetch` `doPost`) lebih tangguh dan mudah dirawat.

## Driver keputusan

- Menjadikan frontend aplikasi statis independen yang di-serve via GitHub Pages (`index.html`, `login.html`, `dashboard.html`).
- Menghilangkan ketergantungan pada iframe sandbox GAS dan `google.script.run`.
- Mempertahankan Google Apps Script sebagai backend database/auth tanpa mengubah skema Sheets atau infrastruktur backend.
- Menjaga backward compatibility: `doGet(e)` tetap tersedia untuk fallback template GAS.

## Opsi

### Opsi 1 — Mempertahankan Full GAS HtmlService Iframe (Status Quo)
- Kelebihan: seluruh file terkonsentrasi di GAS.
- Kekurangan: viewport terbatas, parameter URL rentan gagal terbaca, URL share tidak ramah pengguna.
- Risiko: masalah kompatibilitas browser/iframe sandbox berulang.

### Opsi 2 — Migrasi Penuh ke Serverless Hosting Lain (Vercel / Cloudflare + Database SQL)
- Kelebihan: ekosistem frontend/backend modern.
- Kekurangan: melanggar batasan arsitektur tanpa dependency tambahan, membutuhkan biaya/akun baru, dan mengubah database Google Sheets.
- Risiko: overhead migrasi data produksi dan peningkatan kompleksitas arsitektur.

### Opsi 3 — Frontend Statis GitHub Pages + GAS JSON Web API via doPost (Dipilih)
- Kelebihan: arsitektur terbukti pada `nadhirafarma/absensi_apotek`, bebas biaya hosting tambahan, tidak mengubah struktur database Sheets/Drive, frontend responsif tanpa iframe sandbox.
- Kekurangan: butuh konfigurasi URL staging/produksi publik pada frontend dan konfigurasi `FRONTEND_BASE_URL` pada backend untuk link builder.
- Risiko: payload browser tidak tepercaya diatasi dengan verifikasi allowlist 10 action dan penegakan `requireSession_` server-side.

## Keputusan

1. **Backend Web API**: backend `04_Backend_GAS/Code.gs` menyediakan dispatcher `doPost(e)` yang menerima JSON `{ action, ...payload }`, memverifikasi allowlist 10 action yang diizinkan, mengeksekusi fungsi domain terkait, dan merespons via `ContentService.createTextOutput(JSON).setMimeType(JSON)`.
2. **Frontend Transport**: seluruh komunikasi RPC digantikan dengan HTTP fetch POST:
   - Header `Content-Type: text/plain;charset=utf-8` (menghindari CORS preflight browser).
   - Opsi `redirect: 'follow'` dan `cache: 'no-store'`.
3. **URL Link Generation**: backend membaca `FRONTEND_BASE_URL` dari Script Properties untuk membangun share link dan edit link buyer, dengan fallback aman ke Web App URL jika properti belum diset.
4. **Static Hosting Layout**: file root repository (`index.html` untuk formulir buyer, `login.html`, `dashboard.html`, `.nojekyll`) bertindak sebagai entrypoint GitHub Pages.
5. **Navigasi Statis**: navigasi antarmuka memakai path relatif (`dashboard.html` dan `login.html`).

## Konsekuensi

### Positif
- Frontend dapat di-host langsung di GitHub Pages secara gratis, cepat, dan mandiri.
- Tampilan form buyer dan dashboard jastiper tidak lagi terkurung dalam sandbox iframe GAS.
- Keterikatan antarmuka dengan GAS berkurang; backend murni berperan sebagai REST/JSON API.

### Negatif
- URL Web App backend perlu dikonfigurasikan pada client frontend.

### Risiko keamanan & data
- Endpoint Web App dibuka dengan akses publik (eksekusi `USER_DEPLOYING`), namun seluruh endpoint terproteksi (`getJastiperDashboard`, `getJastiperImageData`, `updateJastiperSettings`, `logoutJastiper`, `getJastiperSession`) mewajibkan `sessionToken` valid via `requireSession_()`.
- Upload file divalidasi MIME type `image/*`, ukuran maksimal `CONFIG.MAX_FILE_MB`, dan tenant isolation diverifikasi melalui `assertFileInFolder_()`.
- Endpoint `FRONTEND_BASE_URL` divalidasi regex HTTPS untuk mencegah open redirect.

## Validasi

- Unit test contract API `tests/jst028_api_contract_check.js` memverifikasi allowlist 10 action, mapping argumen, fallback base URL, dan validasi URL.
- Test regresi `tests/jst016` hingga `tests/jst025` lulus.
- Deploy staging `@15` merespons smoke test live HTTP POST JSON dengan header CORS `Access-Control-Allow-Origin: *`.

## Rollback atau strategi keluar

Jika static Pages mengalami kendala, redeploy staging backend ke versi immutable `@14` dan pulihkan template kanonik. Schema sheet database tidak berubah.
