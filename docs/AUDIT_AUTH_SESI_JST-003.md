# Laporan Audit Keamanan Autentikasi dan Sesi (JST-003)

- **Tanggal:** 2026-08-25
- **Jenis:** Audit statis source & arsitektur
- **Target:** `01_Login_Signup/Login.html`, `02_Dashboard_Jastiper/Dashboard.html`, `04_Backend_GAS/Code.gs`, `04_Backend_GAS/appsscript.json`, `SECURITY.md`
- **Status:** SELESAI (Statis)

---

## 1. Inventaris Endpoint & Operasi Terproteksi

| Endpoint / Fungsi GAS | Hak Akses | Parameter Auth | Mekanisme Otorisasi Server-Side |
|---|---|---|---|
| `signupJastiper(payload)` | Publik | Tidak ada | Validasi input, cek email duplikat di sheet `Users` |
| `loginJastiper(email, password)` | Publik | Tidak ada | Verifikasi hash password + salt, buat sesi baru |
| `getJastiperSession(sessionToken)` | Terproteksi | `sessionToken` | `requireSession_()` → ambil profil jastiper sesuai `session.jastiperId` |
| `logoutJastiper(sessionToken)` | Terproteksi / Publik | `sessionToken` | Hapus baris token hash dari sheet `Sessions` |
| `getJastiperDashboard(sessionToken, q)` | Terproteksi | `sessionToken` | `requireSession_()` → filter baris sheet `Orders` hanya milik `session.jastiperId` |
| `getJastiperImageData(sessionToken, url)`| Terproteksi | `sessionToken` | `requireSession_()` → verifikasi file Drive berada di folder milik `user.driveFolderId` |
| `updateJastiperSettings(sessionToken, p)`| Terproteksi | `sessionToken` | `requireSession_()` + LockService → update hanya akun `session.jastiperId`, cabut sesi jika email berubah |
| `getPublicConfig(shareCode, id, token)` | Publik | `editToken` (opsional) | `getVerifiedOrder_()` jika ada token edit |
| `saveConfirmation(payload)` | Publik | `editToken` (jika update)| `getVerifiedOrder_()` verifikasi `sha256(editToken)` |
| `getConfirmation(orderId, editToken)` | Publik | `editToken` | `getVerifiedOrder_()` verifikasi `sha256(editToken)` |

---

## 2. Siklus Hidup Sesi & Token

1. **Pembuatan Token (`createSession_`):**
   - Token: Gabungan dua `Utilities.getUuid().replace(/-/g, '')` menghasilkan 64 karakter hex. Karena UUID v4 memuat bit versi/varian tetap, panjang representasi 256 bit bukan 256 bit entropi; kualitas acak aktual bergantung implementasi `Utilities.getUuid()`.
   - Masa berlaku: 12 jam (`CONFIG.SESSION_HOURS = 12`).
   - Penyimpanan: Token plaintext dikirim ke client; server hanya menyimpan `sha256_(token)`, `jastiperId`, `createdAt`, dan `expiresAt` pada sheet `Sessions`.

2. **Validasi Sesi (`requireSession_`):**
   - Hash token client dihitung dengan `sha256_()`.
   - Linear scan sheet `Sessions`.
   - Pengecekan expiry: `exp <= now`. Jika kedaluwarsa, baris dihapus dan request ditolak.

3. **Pencabutan Sesi (`logoutJastiper` & `revokeSessionsForUser_`):**
   - Logout menghapus entri sesi spesifik.
   - Perubahan email memanggil `revokeSessionsForUser_()` yang menghapus semua sesi milik `jastiperId` secara terbalik (bottom-up scan).

4. **Penyimpanan Klien:**
   - Disimpan di `localStorage` browser (`Login.html` dan `Dashboard.html`).
   - Dihapus saat logout manual atau saat server mengembalikan error sesi tidak valid.

---

## 3. Temuan & Analisis Risiko

### Temuan 1: Password Hashing Berulang Rendah (Medium)
- **Lokasi:** `04_Backend_GAS/Code.gs` (`hashPassword_`, baris 531-536)
- **Kondisi:** 2500 iterasi SHA-256 dengan salt unik per user.
- **Risiko:** Tidak sekuat PBKDF2/Argon2 standar modern terhadap offline GPU cracking jika sheet `Users` bocor.
- **Batasan Runtime:** GAS tidak menyediakan native bcrypt/Argon2 dan memiliki batas eksekusi per eksekusi.
- **Rekomendasi:** Pertahankan untuk fase MVP internal; jadwalkan migrasi auth provider eksternal (Supabase/Firebase/Auth0) sebelum produksi skala luas.

### Temuan 2: Tidak Ada Rate Limiting pada Login & Signup (Medium)
- **Lokasi:** `04_Backend_GAS/Code.gs` (`loginJastiper`, `signupJastiper`)
- **Kondisi:** Endpoint publik dapat dipanggil berulang tanpa delay atau lockout akun.
- **Risiko:** Brute force tebakan password dan spam pembuatan akun.
- **Rekomendasi:** Buat item backlog (JST-010) untuk implementasi cache-based rate limiting via `CacheService.getScriptCache()`.

### Temuan 3: Pendaftaran Akun Bersamaan Tanpa Lock (Low)
- **Lokasi:** `04_Backend_GAS/Code.gs` (`signupJastiper`, baris 49-84)
- **Kondisi:** Pengecekan `findUserByEmail_` dan `users.appendRow` tidak dibungkus `LockService.getScriptLock()`, berbeda dengan `updateJastiperSettings`.
- **Risiko:** Dua request pendaftaran bersamaan dengan email sama dapat lolos validasi keunikan.
- **Rekomendasi:** Tambahkan `LockService` pada `signupJastiper` (JST-011).

### Temuan 4: Potensi User Enumeration pada Signup (Low)
- **Lokasi:** `04_Backend_GAS/Code.gs` (`signupJastiper`)
- **Kondisi:** `signupJastiper` mengembalikan pesan eksplisit "Email ini sudah terdaftar." (Sementara `loginJastiper` sudah aman menggunakan pesan generik "Email atau password salah.").
- **Risiko:** Penyerang dapat mengidentifikasi apakah alamat email tertentu sudah terdaftar.
- **Rekomendasi:** Sesuaikan pesan atau dokumentasikan sebagai perilaku yang diterima pada MVP.

### Temuan 5: Token Sesi Disimpan di LocalStorage (Low)
- **Lokasi:** `01_Login_Signup/Login.html`, `02_Dashboard_Jastiper/Dashboard.html`
- **Kondisi:** `sessionToken` disimpan di `localStorage`.
- **Risiko:** Jika terjadi XSS, token dapat dibaca skrip jahat.
- **Mitigasi saat ini:** Aplikasi sudah menghindari `innerHTML` untuk data tidak tepercaya dan memakai `clean_` server-side.

---

## 4. Kesimpulan & Rekomendasi Backlog

Model autentikasi dan sesi saat ini **memenuhi baseline keamanan untuk tahap pra-rilis / MVP GAS**, dengan kontrol isolasi tenant server-side, hashing token di database Sheets, validasi batas expiry aman, serta pencabutan sesi otomatis saat perubahan email.

### Kandidat Agenda Perbaikan (Belum Dicatat di `PLAN.md`)
1. Rate limiting login/signup berbasis `CacheService`.
2. `LockService` pada `signupJastiper` untuk mencegah pendaftaran duplikat konkuren.
3. Evaluasi penyedia autentikasi terdedikasi untuk fase produksi penuh.

Setiap kandidat memerlukan item `PROPOSED`, penilaian scope/risiko, dan approval manusia sebelum perubahan source.
