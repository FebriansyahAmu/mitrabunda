# 06 — Workflow & TODO List FE (per Modul & Fitur)

Checklist eksekusi Frontend. Dikerjakan **atas → bawah**; dikelompokkan per modul & fitur. Mengacu pada [`05-frontend-plan.md`](./05-frontend-plan.md).

**Pendekatan:** FE-first, **mock bertipe** (mock ikut tipe DTO provisional di `src/lib/dto`), dibaca lewat seam `src/lib/data/`, **Zod ditulis sekarang** untuk form.
**Urutan build:** M0 (fondasi) → Modul 4 (Dashboard) → Modul 2 (Intake) → Modul 1 (Faskes) → Modul 3 (Tracking) → Modul A & C.

Legenda: `[ ]` belum · `[~]` sedang dikerjakan · `[x]` selesai.

---

## 🔑 Prasyarat (kunci sebelum coding)

- [ ] Keputusan **`IBU_HAMIL` = episode kehamilan** dikonfirmasi
- [ ] Draft tipe DTO provisional MVP disepakati: `IbuHamilDTO`, `PuskesmasDTO`, `DashboardSummaryDTO`
- [ ] Daftar peran final + **matriks layar ↔ peran**

---

## M0 — Fondasi (lintas-fungsi)

### Setup proyek
- [ ] `create-next-app` (TS, Tailwind, ESLint, App Router, `src/`, alias `@/*`)
- [ ] TS `strict` + verifikasi path alias
- [ ] `src/proxy.ts` stub (placeholder auth guard + resolve tenant)
- [ ] Skrip `dev/build/start` + placeholder skrip worker (tsx) — non-aktif dulu

### Design system
- [ ] `npx shadcn init` (base color + radius)
- [ ] Pasang komponen dasar: `button, input, textarea, select, checkbox, radio-group, label, form, card, table, badge, dialog, sheet, dropdown-menu, tabs, tooltip, avatar, skeleton, sonner, command, separator, breadcrumb, pagination`
- [ ] Token **warna risiko** (Rendah/Sedang/Tinggi/Sangat Tinggi) + util `riskColor(level)`
- [ ] `next-themes` (mode terang/gelap) + verifikasi kontras token

### Struktur & pola data
- [ ] Buat folder `src/lib/{dto,validation,mock,data,format,utils}`
- [ ] Implement **seam** contoh: `data/ibu-hamil.ts` → `getIbuHamilList()` baca `mock/`
- [ ] Helper `format/`: tanggal `id-ID`, `maskNik`, `maskBpjs`, `hitungUsiaKehamilan`

### App shell & komponen inti
- [ ] `(dashboard)/layout.tsx`: sidebar (nav per peran) + topbar + breadcrumb
- [ ] Topbar: search, menu user, **theme toggle**
- [ ] Komponen bersama awal: `PageHeader`, `EmptyState`, skeleton pattern

### Auth / RBAC dasar
- [ ] `(auth)/login` — form login (mock auth)
- [ ] Helper `can(role, action)` + **role-gating** item sidebar

### Kualitas & konvensi
- [ ] ESLint: `server-only` pada `lib/data`; `no-restricted-imports` (blok `next/*` di modul share-worker)
- [ ] Prettier + Tailwind class sorting
- [ ] Konvensi penamaan & kolokasi `_components` / `_actions`

---

## Komponen Bersama (dibangun saat modul pertama membutuhkannya)

- [ ] `RiskBadge` (warna + ikon + label)
- [ ] `HplCountdown` (hitung mundur `date-fns`)
- [ ] `KpiCard`
- [ ] `DataTable` (TanStack: sort/filter/pagination)
- [ ] `StatusPill`
- [ ] `FileUpload` (preview + daftar)
- [ ] `SensitiveField` (masked + reveal berhak)

---

## Modul 4 — Dashboard Monitoring Terpusat  ·  *M1*

### Fitur: Kartu KPI
- [ ] Tipe `DashboardSummaryDTO` + mock + `data/getDashboardSummary()`
- [ ] `KpiCard` ×4: total ibu, risiko tinggi, menjelang persalinan, sudah bersalin
- [ ] Skeleton loading kartu

### Fitur: Tabel ibu + status
- [ ] `DataTable` kolom: nama, Puskesmas, HPL, `RiskBadge`, `StatusPill`
- [ ] State empty & error

### Fitur: Filter & pencarian
- [ ] Filter Puskesmas / level risiko / rentang HPL
- [ ] Pencarian nama

### Fitur: Chart
- [ ] shadcn `Chart`: distribusi risiko (+ 1 tren ringkas)

### Fitur: Tampilan per peran
- [ ] Role-gating kartu/kolom sesuai matriks

### Fitur: Refresh (opsional MVP)
- [ ] Polling/refetch ringan

**DoD:** KPI & tabel terisi mock · filter jalan · ≥1 chart · responsif · loading/empty/error ✔

---

## Modul 2 — Pendataan Ibu Hamil / Intake  ·  *M2*

### Fitur: Form intake
- [ ] `intakeSchema` (Zod): nama, NIK, No. BPJS, alamat, telp, usia kehamilan, HPL, riwayat persalinan, faktor risiko, nakes PJ, rencana tempat bersalin
- [ ] Form `react-hook-form` + shadcn `Form` + validasi real-time
- [ ] `HplField` + auto-hitung usia kehamilan
- [ ] Server Action **mock** `createIbuHamil` (`_actions`)
- [ ] State submit: pending/success/error (toast `sonner`)

### Fitur: Deteksi duplikasi NIK
- [ ] Cek terhadap mock → peringatan sebelum simpan

### Fitur: Daftar ibu
- [ ] `DataTable` + NIK/BPJS **ter-mask** (`SensitiveField`)
- [ ] Link ke detail

### Fitur: Detail ibu
- [ ] Halaman detail + ringkasan status alur

**DoD:** form tervalidasi E2E (mock) · duplikat NIK memicu peringatan · field sensitif ter-mask ✔

---

## Modul 1 — Manajemen Kerja Sama & Master Faskes  ·  *M2*

### Fitur: CRUD Puskesmas
- [ ] Tipe `PuskesmasDTO` + mock + `data/` getter
- [ ] `DataTable` + search/filter wilayah
- [ ] Form tambah/edit (Dialog/Sheet) + Zod

### Fitur: Manajemen PIC
- [ ] CRUD PIC per Puskesmas

### Fitur: Arsip dokumen
- [ ] Halaman arsip + `FileUpload` (MoU/SK/SOP) + `StatusPill` kerja sama

**DoD:** CRUD jalan (mock) · upload tampil preview & daftar · role-gating admin tenant ✔

---

## Modul 3 — Tracking & Deteksi Dini H-30  ·  *M3*

### Fitur: Daftar sasaran H-30
- [ ] `data/getSasaranH30()` (filter HPL−hari ini ≤ 30 dari mock)
- [ ] Daftar + `RiskBadge` + `HplCountdown` + penanda prioritas

### Fitur: Filter level risiko
- [ ] Filter interaktif per level & Puskesmas

### Fitur: Integrasi ke Dashboard
- [ ] Status/level nyambung ke tampilan Modul 4

**DoD:** daftar tersaring benar · countdown akurat · warna konsisten token risiko ✔
> Catatan: mesin H-30 & skoring sebenarnya milik worker (BE) — FE hanya menampilkan.

---

## Modul A — Manajemen Pengguna & Hak Akses (RBAC) dasar  ·  *M4*

### Fitur: Login & sesi
- [ ] (lanjutan `(auth)/login` dari M0) indikator sesi

### Fitur: Manajemen user & peran
- [ ] Daftar user (read) + assign peran dasar

### Fitur: Role-gating tampilan
- [ ] Terapkan `can()` ke nav & tombol aksi di seluruh layar MVP

**DoD:** nav & aksi menyesuaikan peran aktif ✔

---

## Modul C — Keamanan, Audit & Kepatuhan (UU PDP) dasar (FE)  ·  *M4*

### Fitur: Masking data sensitif
- [ ] `SensitiveField` dipakai konsisten (NIK/BPJS) di semua layar

### Fitur: Reveal berhak
- [ ] Aksi reveal hanya untuk peran berhak (role-gated)

### Fitur: Indikator keamanan
- [ ] Indikator sesi/keamanan minimal di topbar

**DoD:** tidak ada field sensitif tampil penuh secara default ✔

---

## Fase 2 & 3 — belum aktif (placeholder)

- [ ] Modul 5 Pendampingan & Edukasi
- [ ] Modul 6 Verifikasi Administrasi
- [ ] Modul 7 Skrining Risiko
- [ ] Modul 8 Perencanaan Persalinan
- [ ] Modul 9 Koordinasi Rujukan
- [ ] Modul 10 Persalinan & Nifas
- [ ] Modul 11 Monev & Pelaporan
- [ ] Modul B Notifikasi
- [ ] Modul D Konfigurasi & Integrasi

---

## ✅ Gate Rilis MVP FE

- [ ] Alur inti terlihat (mock): **data masuk → deteksi H-30 → dashboard berwarna risiko**
- [ ] Responsif (mobile→desktop), tanpa scroll horizontal tak sengaja
- [ ] Aksesibilitas dasar (keyboard/ARIA), tidak mengandalkan warna saja
- [ ] Mode terang & gelap
- [ ] State **loading/empty/error** di semua layar MVP
- [ ] **Role-gating** + **masking** aktif
- [ ] Semua data lewat seam `data/` (siap ganti mock → Service tanpa ubah komponen)
- [ ] Label & format **id-ID**
