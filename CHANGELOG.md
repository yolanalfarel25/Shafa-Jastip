# Changelog

Semua perubahan penting dicatat di sini. Format mengikuti prinsip [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) tanpa mengklaim semantic versioning sebelum strategi rilis ditetapkan.

## [Unreleased]

### Added

- Pengaturan daftar ekspedisi kustom per jastiper, opsi ekspedisi buyer dinamis, pilihan manual “Lainnya”, dan test kontrak lokal `tests/jst032_ekspedisi_detail_buyer_check.js` (`JST-032`).
- Custom domain GitHub Pages `jastipin.my.id`, fallback clean route melalui `404.html`, dan test routing lokal `tests/jst031_custom_domain_routing_check.js` (`JST-031`).
- Lightbox aksesibel untuk memperbesar foto barang dan bukti transfer pada Dashboard melalui klik atau keyboard, dengan caption, backdrop, `Escape`, focus trap, dan focus return (`JST-030`).
- Test suite lokal `tests/jst030_photo_lightbox_check.js` memverifikasi modal, interaksi keyboard, fokus, renderer foto, dan sinkronisasi tiga mirror Dashboard (`JST-030`).
- Persistensi status edit buyer pada `localStorage` browser per `shareCode` toko (`jastip-order-{shareCode}`) yang memuat kembali pesanan sebelumnya saat membuka tautan toko tanpa token (`JST-029`).
- Tombol “Lupakan di Perangkat Ini” pada formulir konfirmasi buyer untuk membersihkan akses edit tersimpan pada perangkat bersama (`JST-029`).
- Sanitasi URL browser pada formulir konfirmasi buyer setelah token edit divalidasi via `history.replaceState` (`JST-029`).
- Test suite lokal `tests/jst029_buyer_device_edit_check.js` memverifikasi prioritas URL, persistensi, isolasi antartoko, dan penghapusan token tidak valid (`JST-029`).
- Dokumen governance, BMAD, konteks brownfield, keamanan, agenda, dan ADR untuk baseline prabuild (`JST-001`).
- Identitas visual “Jastip Apps” dan aset logo pada antarmuka (`JST-002`).
- Panduan prompt operasional agen untuk memulai, melanjutkan, dan memulihkan pekerjaan (`JST-009`).
- Panduan smoke test staging dengan 12 skenario aman dan data sintetis (`JST-007`).
- Panduan persiapan deployment GAS staging, integrasi GitHub, dan verifikasi staging (`JST-011`).
- Provisioning resource staging backend GAS, inisialisasi sheet database via `setupApp()`, dan deployment Web App staging (`JST-012`).
- Pengaturan dinamis hingga 10 rekening bank per jastiper dengan fallback data rekening lama (`JST-018`).
- Tombol hapus dan ganti foto barang buyer sebelum submit (`JST-019`).
- Frontend statis mandiri GitHub Pages (`index.html`, `login.html`, `dashboard.html`, `.nojekyll`) dengan komunikasi HTTP POST JSON `doPost` ke Google Apps Script backend (`JST-028`).
- Endpoint backend `doPost(e)` menyediakan JSON Web API dengan allowlist 10 action dan konfigurasi dinamis `FRONTEND_BASE_URL` (`JST-028`).
- Test suite lokal contract API `tests/jst028_api_contract_check.js` memverifikasi allowlist action, mapping payload, sanitasi, dan ketiadaan scriptlet/RPC GAS pada static Pages (`JST-028`).

### Security

- Validasi server ekspedisi kustom dan manual membatasi panjang/jumlah, menolak duplikat/nama cadangan, serta mencegah formula injection Google Sheets (`JST-032`).
- Approval gate untuk auth, token, upload, OAuth, data produksi, permission, dan deployment.
- Daftar risiko awal auth, upload, tenant isolation, race condition, clickjacking, dan retensi data.
- Audit keamanan statis autentikasi dan sesi GAS (`JST-003`).
- Rate limiting login dan signup berbasis CacheService server-side dengan hash identitas SHA-256 (`JST-010`).

### Changed

- Kartu Data Buyer Dashboard diringkas menjadi Nama, ID Order, dan Alamat; tombol Detail membuka data pesanan lengkap secara aksesibel (`JST-032`).
- Root URL Pages `/` tanpa query kini langsung redirect ke `/login` tanpa memuat konfigurasi form buyer, sementara akses toko/edit buyer berbasis query `/?shop=...` tetap utuh (`JST-031`).
- Navigasi auth login dan dashboard dialihkan ke URL bersih `/login` dan `/dashboard` pada seluruh mirror template frontend (`JST-031`).
- Workflow agen memakai plan BMAD di Plan Mode, approval implementasi saat pindah ke Act Mode, eksekusi sampai `DONE`, eskalasi berbasis dampak, dan konfirmasi commit/push di akhir (`JST-026`).
- Dashboard dan backend mendukung perubahan username serta email aktif dengan histori audit email dan pencabutan sesi lama (`JST-008`).
- Navigasi login, signup, logout, dan sesi invalid mengalihkan viewport top-level otomatis (`JST-020`).
- Logo Konfirmasi buyer memakai data URI PNG inline dari aset resmi agar tampil pada GAS (`JST-021`).
- Tab `Data Buyer` dan `Pengaturan Jastip` pada Dashboard Jastiper kini berpindah panel sesuai klik (`JST-022`).
- Tombol `Simpan Pengaturan` Dashboard kembali mengirim profil dan rekening valid serta memulihkan status tombol setelah respons (`JST-023`).
- Inisialisasi formulir konfirmasi buyer membaca parameter URL host Web App melalui `google.script.url.getLocation` pada runtime iframe GAS (`JST-024`).
- Pemuatan foto barang dan bukti transfer pada Dashboard Jastiper menyimpan container DOM sebelum status memuat sehingga respons data URI base64 dari Google Drive berhasil dirender (`JST-025`).
- Fix pemuatan foto Dashboard `JST-025` dirilis ke deployment GAS staging versi `@14`; deployment produksi tidak diubah (`JST-027`).

## Aturan pencatatan

- Catat hanya perubahan yang masuk `REVIEW` atau `DONE`.
- Sertakan ID `PLAN.md`.
- Jangan menaruh token, ID privat, data buyer, URL deployment privat, atau bukti transfer.
- Jangan menghapus entri lama; koreksi memakai entri baru.
- Tanggal rilis ditambahkan setelah approval manusia.