# Architecture Decision Records

ADR mencatat keputusan teknis atau keamanan yang berdampak lintas fitur, sulit dibalik, mengubah trust boundary, atau memengaruhi data.

## Kapan ADR wajib

- perubahan penyedia autentikasi atau metode hashing;
- perubahan model sesi/token;
- perubahan skema atau penyimpanan data;
- perubahan scope OAuth, permission, atau sharing;
- penambahan layanan/dependency eksternal;
- perubahan strategi upload, retensi, backup, atau deployment;
- keputusan yang mengorbankan alternatif penting.

Perbaikan lokal kecil tidak memerlukan ADR bila sudah cukup dicatat di `PLAN.md`.

## Status ADR

`PROPOSED` → `ACCEPTED` → `SUPERSEDED`

Status tambahan: `REJECTED`, `DEPRECATED`.

Manusia menerima ADR melalui approval scope saat berpindah ke Act Mode atau melalui keputusan eksplisit. Agen tidak menerima ADR di luar scope yang disetujui.

## Penamaan

`ADR-NNN-judul-singkat.md`, contoh:

```text
ADR-001-strategi-autentikasi.md
```

Jangan mengganti isi keputusan lama untuk menyembunyikan perubahan. Buat ADR baru dan tandai ADR lama `SUPERSEDED`.

## Indeks

| ID | Judul | Status | Tanggal | PLAN ID |
|---|---|---|---|---|
| ADR-001 | Workflow approval melalui Act Mode | ACCEPTED | 2026-08-27 | JST-026 |

## Template

```md
# ADR-NNN — Judul

- **Status:** PROPOSED
- **Tanggal:** YYYY-MM-DD
- **PLAN ID:** JST-NNN
- **Pemilik keputusan:**

## Konteks

Masalah, batasan, data, trust boundary, dan alasan keputusan diperlukan.

## Driver keputusan

-

## Opsi

### Opsi 1

- Kelebihan:
- Kekurangan:
- Risiko:

### Opsi 2

- Kelebihan:
- Kekurangan:
- Risiko:

## Keputusan

Belum diputuskan.

## Konsekuensi

### Positif

-

### Negatif

-

### Risiko keamanan/data

-

## Validasi

-

## Rollback atau strategi keluar

-
```