# Changelog

Semua perubahan penting dicatat di sini. Format mengikuti prinsip [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) tanpa mengklaim semantic versioning sebelum strategi rilis ditetapkan.

## [Unreleased]

### Added

- Dokumen governance, BMAD, konteks brownfield, keamanan, agenda, dan ADR untuk baseline prabuild (`JST-001`).
- Identitas visual “Jastip Apps” dan aset logo pada antarmuka (`JST-002`).
- Panduan prompt operasional agen untuk memulai, melanjutkan, dan memulihkan pekerjaan (`JST-009`).
- Panduan smoke test staging dengan 12 skenario aman dan data sintetis (`JST-007`).
- Panduan persiapan deployment GAS staging, integrasi GitHub, dan verifikasi staging (`JST-011`).
- Provisioning resource staging backend GAS, inisialisasi sheet database via `setupApp()`, dan deployment Web App staging (`JST-012`).

### Security

- Approval gate untuk auth, token, upload, OAuth, data produksi, permission, dan deployment.
- Daftar risiko awal auth, upload, tenant isolation, race condition, clickjacking, dan retensi data.
- Audit keamanan statis autentikasi dan sesi GAS (`JST-003`).
- Rate limiting login dan signup berbasis CacheService server-side dengan hash identitas SHA-256 (`JST-010`).

### Changed

- Dashboard dan backend mendukung perubahan username serta email aktif dengan histori audit email dan pencabutan sesi lama (`JST-008`).

## Aturan pencatatan

- Catat hanya perubahan yang masuk `REVIEW` atau `DONE`.
- Sertakan ID `PLAN.md`.
- Jangan menaruh token, ID privat, data buyer, URL deployment privat, atau bukti transfer.
- Jangan menghapus entri lama; koreksi memakai entri baru.
- Tanggal rilis ditambahkan setelah approval manusia.