# MITRA BUNDA — Dokumentasi Teknis

**Maternal Integrated Tracking, Referral, and Assistance Framework**
Sistem navigasi pelayanan maternal prediktif untuk penguatan integrasi RSUD–Puskesmas.

> Dokumen ini adalah artefak **tahap desain**. Skema database (Prisma) dan implementasi kode belum termasuk dan akan menyusul pada tahap berikutnya.

---

## Snapshot Proyek

| Aspek | Keputusan |
|---|---|
| Bentuk produk | SaaS multi-tenant |
| Arsitektur aplikasi | Next.js fullstack + **layered** (`/api` → Service → DAL) |
| Background processing | Worker terpisah (BullMQ) sebagai entry point kedua |
| Database | PostgreSQL + Prisma, multi-tenancy **shared DB + RLS** |
| Cache & queue | Redis |
| Bahasa | TypeScript end-to-end |
| Hosting | Self-host di Indonesia (data residency / UU PDP) |
| Basis inovasi | Proposal MITRA BUNDA — RSUD Bolaang Mongondow Timur |

---

## Daftar Dokumen

| No | Dokumen | Isi |
|---|---|---|
| 01 | [`01-architecture-and-stack.md`](./01-architecture-and-stack.md) | Arsitektur aplikasi, deployment, layered method, dan stack final |
| 02 | [`02-modules-and-features.md`](./02-modules-and-features.md) | Deskripsi modul, fitur, dan pembagian kerja **FE / BE** |
| 03 | [`03-data-flow.md`](./03-data-flow.md) | Data Flow Diagram (Level 0 & Level 1) |
| 04 | [`04-erd.md`](./04-erd.md) | Entity Relationship Diagram (konseptual, **tanpa skema**) |

---

## Alur Baca yang Disarankan

1. Mulai dari **01** untuk memahami fondasi teknis dan aturan main tiap lapisan.
2. Lanjut ke **02** untuk membagi backlog per modul ke tim FE dan BE.
3. Gunakan **03** dan **04** sebagai referensi aliran data dan struktur entitas saat memecah task.

## Status & Langkah Berikutnya

- [x] Keputusan stack final
- [x] Pemetaan modul & fitur
- [x] Data Flow Diagram
- [x] ERD konseptual
- [ ] Skema Prisma + strategi RLS *(berikutnya)*
- [ ] Skeleton monorepo (`apps/web`, `apps/worker`, `packages/*`)
- [ ] Backlog & sprint MVP
