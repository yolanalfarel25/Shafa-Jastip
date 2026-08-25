# Konteks Proyek — Jastip Apps

Dokumen ini memetakan kondisi source saat ini. Bukan jaminan keamanan atau kesiapan produksi.

## Ringkasan

Jastip Apps adalah Web App Google Apps Script untuk:

- pendaftaran dan login jastiper;
- pengaturan profil dan rekening;
- pembagian link form buyer;
- konfirmasi pembelian dan upload gambar;
- edit konfirmasi melalui token privat;
- dashboard data buyer per jastiper.

Tidak ada package manager, dependency pihak ketiga, test suite, CI, atau konfigurasi deployment lokal yang terlihat.

## Source tree

```text
01_Login_Signup/
  Login.html
  README.txt
02_Dashboard_Jastiper/
  Dashboard.html
  README.txt
03_Konfirmasi_Pembelian/
  Konfirmasi.html
  README.txt
04_Backend_GAS/
  Code.gs
  appsscript.json
  README.txt
Assets/
  logo-jastip-apps.png
```

Dokumen kendali berada di root dan `docs/`.

## Runtime surfaces

### Halaman

| Route/query | Template GAS | Source repository | Akses |
|---|---|---|---|
| default | `Konfirmasi` | `03_Konfirmasi_Pembelian/Konfirmasi.html` | publik memakai `shop`, atau edit memakai `id` + `token` |
| `?page=login` | `Login` | `01_Login_Signup/Login.html` | publik |
| `?page=dashboard` | `Dashboard` | `02_Dashboard_Jastiper/Dashboard.html` | UI publik; data memerlukan token sesi |

Catatan: deployment GAS membutuhkan file HTML berada dalam project GAS memakai nama template yang dirujuk `doGet`. Struktur folder lokal tidak otomatis dipertahankan GAS.

### Endpoint callable dari browser

- `signupJastiper(payload)`
- `loginJastiper(email, password)`
- `getJastiperSession(sessionToken)`
- `logoutJastiper(sessionToken)`
- `updateJastiperSettings(sessionToken, payload)`
- `getPublicConfig(shareCode, orderId, editToken)`
- `saveConfirmation(payload)`
- `getConfirmation(orderId, editToken)`
- `getJastiperDashboard(sessionToken, searchText)`
- `getJastiperImageData(sessionToken, driveFileUrl)`

`setupApp()` adalah operasi setup yang membuat/melengkapi sheet. Jalankan hanya pada lingkungan yang disetujui.

## Penyimpanan

### Google Sheets

`Konfirmasi Jastip v4`:

- ID order dan jastiper;
- share code;
- hash edit token;
- waktu;
- nama, alamat, nomor HP;
- ekspedisi dan bank;
- JSON item;
- URL bukti transfer.

`Jastipers`:

- ID dan profil jastiper;
- email dan nomor HP;
- salt/hash password;
- share code;
- ID folder Drive;
- rekening;
- status.

`Sessions`:

- hash token;
- ID jastiper;
- waktu dibuat dan kedaluwarsa.

Nama sheet dan header berada di `Code.gs`.

### Google Drive

- Satu root folder dikonfigurasi.
- Signup membuat subfolder per jastiper.
- Foto barang dan bukti transfer disimpan ke subfolder tersebut.
- Dashboard mengambil gambar setelah memeriksa parent folder langsung.

### Konfigurasi

Saat ini `CONFIG.SPREADSHEET_ID` dan `CONFIG.DRIVE_ROOT_FOLDER_ID` memakai placeholder dalam source. Rencana produksi: pindahkan nilai aktual ke Script Properties. Jangan commit nilai aktual.

## Trust boundaries

```text
Buyer/Jastiper browser (tidak tepercaya)
        |
        | payload, URL params, file base64, session/edit token
        v
GAS server (wajib validasi + otorisasi)
        |
        +--> Sheets (data pribadi, auth metadata)
        `--> Drive (gambar dan bukti transfer sensitif)
```

- Validasi HTML tidak menjadi kontrol keamanan.
- `sessionToken` memberi akses dashboard jastiper.
- `editToken` memberi akses baca/ubah satu order.
- `shareCode` dimaksudkan untuk dibagikan dan bukan rahasia autentikasi.
- URL Drive dan edit link harus diperlakukan sensitif.
- Akun eksekusi GAS menjadi trust boundary utama untuk Sheets/Drive.

## Aturan implementasi penting

- Jangan ubah `ORDER_HEADERS`, `USER_HEADERS`, atau `SESSION_HEADERS` tanpa rencana migrasi dan rollback.
- `ensureSheet_` menambah header hilang, tetapi tidak menangani rename, reorder, type migration, atau rollback.
- Jangan mengandalkan filter UI untuk isolasi tenant; verifikasi `jastiperId` server-side.
- Jangan menerima `existingUrl` upload sebagai bukti kepemilikan tanpa verifikasi server-side.
- Jangan membocorkan hash, salt, token, folder ID, atau konfigurasi privat dalam response/log.
- Jangan memakai `innerHTML` dengan data pengguna tanpa encoding.
- Gunakan LockService untuk operasi yang memerlukan keunikan atau konsistensi lintas request setelah direncanakan.
- Jangan memperluas `ALLOWALL` atau scope OAuth tanpa security review; evaluasi kebutuhan `ALLOWALL` sebelum produksi.
- Jangan menguji pada sheet/folder produksi.

## Temuan risiko awal

Temuan ini agenda audit, bukan perubahan yang telah disetujui.

1. **Konfigurasi dalam source.** Placeholder aman saat ini, tetapi pola harus diganti Script Properties sebelum nilai nyata dipakai.
2. **Hash password buatan sendiri.** Iterasi SHA-256 bukan password KDF modern. Migrasi ke penyedia auth atau rancangan KDF yang layak perlu keputusan arsitektur.
3. **Token bearer di browser/URL.** Dampak kebocoran tinggi; masa berlaku, storage browser, referrer, dan revocation perlu audit.
4. **Tidak ada rate limiting.** Login/signup/form dapat disalahgunakan atau menghabiskan kuota GAS.
5. **Upload validation terbatas.** Prefix MIME dari client dipercaya; ekstensi bebas; base64 rusak dan decompression/image validity belum ditangani.
6. **`existingUrl` dipercaya saat update.** Backend perlu memastikan URL lama memang milik order dan folder jastiper.
7. **Race condition.** Pencarian lalu append/update tanpa lock dapat menghasilkan duplikasi atau lost update.
8. **X-Frame `ALLOWALL`.** Risiko clickjacking perlu dinilai terhadap kebutuhan embed.
9. **Data sensitif tanpa kebijakan retensi.** Nama, alamat, nomor HP, dan bukti transfer belum memiliki jadwal penghapusan terdokumentasi.
10. **Belum ada test/CI.** Perubahan backend dan HTML belum memiliki regression gate.
11. **Link Drive.** Sharing/permission file belum terlihat dikendalikan eksplisit dalam source; perilaku deployment harus diverifikasi.
12. **Setup memodifikasi sheet.** `setupApp()` bukan pemeriksaan read-only dan memerlukan backup serta approval lingkungan.

## Validasi yang tersedia

Tanpa runtime GAS, validasi lokal terbatas:

- inspeksi struktur dan referensi;
- parse JavaScript setelah ekstraksi script HTML;
- pemeriksaan sintaks `Code.gs` dengan adaptasi lokal bila diperlukan;
- pencarian pola rahasia;
- review manifest;
- inspeksi visual statis;
- review Git diff.

Validasi runtime wajib memakai staging:

- signup/login/logout/expiry;
- isolasi data antarjastiper;
- submit dan edit order;
- upload valid, terlalu besar, MIME salah, base64 rusak;
- akses gambar lintas jastiper;
- link invalid/kedaluwarsa;
- kuota dan kegagalan Sheets/Drive;
- permission file dan folder.

## File yang harus dibaca menurut jenis perubahan

| Perubahan | File minimum |
|---|---|
| Routing/template | `Code.gs`, semua HTML terkait |
| Auth/sesi | `Code.gs`, `Login.html`, `Dashboard.html`, `SECURITY.md` |
| Buyer/order | `Code.gs`, `Konfirmasi.html`, `Dashboard.html` |
| Upload/Drive | `Code.gs`, `Konfirmasi.html`, `Dashboard.html`, manifest |
| Scope/permission | `appsscript.json`, `Code.gs`, `SECURITY.md` |
| Skema Sheets | `Code.gs`, rencana migrasi, ADR |
| Branding/UI | HTML sasaran dan aset |
| Deployment | manifest, runbook lingkungan, approval terpisah |

## Perintah dan konvensi

Belum ada command build/test resmi. Jangan mengarang klaim validasi. Setiap item `PLAN.md` harus mencatat command atau langkah staging yang benar-benar dijalankan beserta hasilnya.

Branch dan commit mengikuti `AGENTS.md`.