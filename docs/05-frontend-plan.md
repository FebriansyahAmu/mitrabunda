# 05 — Rencana Setup Frontend (FE)

Dokumen ini memecah pekerjaan **Frontend** menjadi (a) fondasi/setup proyek dan (b) rencana per modul beserta fitur-fiturnya. Mengacu pada [`01-architecture-and-stack.md`](./01-architecture-and-stack.md) (stack & struktur `src/`) dan [`02-modules-and-features.md`](./02-modules-and-features.md) (modul, fitur, KPI, pembagian FE/BE).

> Strategi: **FE-first dengan mock data**. UI dibangun mengikuti kontrak **Zod + DTO**; BE mengisi di balik kontrak yang sama. Tidak ada query Prisma dari komponen.

---

## 0. Prinsip & Batasan FE

- **Kontrak = Zod (`src/lib/validation`) + DTO (`src/lib/dto`).** FE hanya bergantung pada bentuk DTO, bukan tabel DB.
- **Pola data:** baca via Server Component → (nanti) Service; untuk sekarang baca **mock**. Mutasi via **Server Action** di `_actions` per fitur.
- **Otorisasi sebenarnya di BE** (Service + RLS). Di FE hanya *role-gating tampilan* (sembunyikan nav/aksi) — bukan pengaman.
- **Cakupan MVP (Fase 1):** Modul **1–4** + **A** (RBAC dasar) + **C** (keamanan UI dasar). Fase 2/3 direncanakan ringkas.
- **Bahasa UI: Indonesia.** Label, format tanggal, dan angka mengikuti lokal `id-ID`.

---

## 1. Fondasi / Setup Proyek

### 1.1 Prasyarat & versi
| Item | Pilihan |
|---|---|
| Runtime | Node.js LTS |
| Package manager | pnpm (rekomendasi) / npm |
| Framework | Next.js **16** (App Router) |
| Bahasa | TypeScript (strict) |

### 1.2 Scaffold awal
```bash
pnpm create next-app@latest mitrabunda \
  --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```
Catatan: di Next.js 16, konvensi interceptor request adalah **`proxy.ts`** (bukan `middleware.ts`) — diletakkan di `src/proxy.ts`.

### 1.3 Dependencies FE
| Paket | Fungsi |
|---|---|
| `shadcn/ui` (+ Radix) | komponen dasar (di-generate ke `src/components/ui`) |
| `lucide-react` | ikon |
| `next-themes` | mode terang/gelap |
| `react-hook-form` + `zod` + `@hookform/resolvers` | form + kontrak validasi (dipakai FE & BE) |
| `@tanstack/react-table` | tabel data (list ibu hamil, filter/sort/pagination) |
| `recharts` (via **shadcn Charts**) | grafik dashboard & monev |
| `date-fns` | hitung mundur HPL, format tanggal `id-ID` |
| `@tanstack/react-query` *(opsional)* | fetching/polling sisi klien untuk dashboard semi-real-time |

> Keputusan chart sudah dikunci: **shadcn Charts (Recharts)**, bukan Tremor, agar satu bahasa visual.

### 1.4 Inisialisasi shadcn/ui
`npx shadcn init` → tetapkan base color & radius. Komponen awal yang dipasang:
`button, input, textarea, select, checkbox, radio-group, label, form, card, table, badge, dialog, sheet, dropdown-menu, tabs, tooltip, avatar, skeleton, sonner (toast), command, separator, breadcrumb, pagination`.

### 1.5 Struktur folder FE (mengacu [01 §9](./01-architecture-and-stack.md))
```
src/
  app/(auth)/, (dashboard)/, api/.../route.ts, layout.tsx
  components/
    ui/            # shadcn (generated)
    shared/        # komponen bersama proyek (RiskBadge, KpiCard, DataTable, dst.)
  lib/
    dto/ validation/   # kontrak FE↔BE
    mock/              # data tiruan sementara (bentuk = DTO)
    format/            # helper id-ID (tanggal, NIK mask, dsb.)
    utils.ts
  proxy.ts
```

### 1.6 Design tokens & sistem visual
- **Warna level risiko** (Modul 3), didefinisikan sebagai token dan dipakai konsisten di badge/baris/chart:

  | Level | Warna dasar |
  |---|---|
  | Rendah | hijau (emerald) |
  | Sedang | amber |
  | Tinggi | oranye |
  | Sangat Tinggi | merah |

  Wajib lolos kontras (a11y) di terang & gelap; jangan andalkan warna saja — sertakan label/ikon.
- Tipografi, spacing, dan detail visual final ditetapkan saat membangun UI (pakai skill **frontend-design**); pada tahap ini cukup default shadcn yang rapi.

### 1.7 App Shell & navigasi
`(dashboard)/layout.tsx`: **sidebar** (nav per peran) + **topbar** (search, notifikasi, menu user, theme toggle) + **breadcrumb**. Konten memakai `PageHeader` + area utama.

### 1.8 Auth & RBAC di FE
- `(auth)/login` — form login (mock auth dulu).
- **Role-gating**: helper `can(role, action)` untuk menyembunyikan nav & tombol. Peran (dari [02 §A](./02-modules-and-features.md)): Direktur, Obgyn, Bidan, Perawat Navigator, Case Manager, Ruang Bersalin, Rekam Medis, Tim Mutu, PIC Puskesmas, Dinkes, view BPJS.

### 1.9 Strategi data & mock
- Mock DTO di `src/lib/mock`, **bentuknya = draft DTO** agar pertukaran ke Service nanti nol-perubahan di komponen.
- State standar tiap layar: **loading (skeleton)**, **empty**, **error**.

### 1.10 Kualitas & konvensi
- ESLint: `server-only` pada modul data; `no-restricted-imports` agar `next/*` tak bocor ke modul yang dipakai worker.
- Prettier + Tailwind class sorting; komponen per fitur dikolokasikan di `_components`.

---

## 2. Rencana per Modul — MVP (Fase 1)

Setiap modul: **Rute · Layar · Komponen kunci · Fitur FE (checklist) · Kontrak (draft) · State · Definition of Done (FE)**.

### Modul 1 — Manajemen Kerja Sama & Master Faskes
- **Rute:** `(dashboard)/faskes` · `faskes/[id]` · `faskes/[id]/pic`
- **Layar:** tabel Puskesmas; detail Puskesmas + daftar PIC; arsip dokumen (MoU/SK).
- **Komponen kunci:** `DataTable`, form CRUD (Dialog/Sheet), `FileUpload`, `StatusPill` (kerja sama aktif/tidak).
- **Fitur FE:**
  - [ ] Tabel Puskesmas + search/filter wilayah
  - [ ] Form tambah/edit Puskesmas & wilayah kerja
  - [ ] Manajemen PIC per Puskesmas (CRUD)
  - [ ] Halaman arsip dokumen + UI upload MoU/SK/SOP
  - [ ] Indikator status kerja sama
- **Kontrak (draft):** `PuskesmasDTO { id, nama, wilayahKerja, pic[], statusKerjaSama }`, `DokumenDTO`.
- **State:** loading/empty/error; validasi form (Zod).
- **DoD:** CRUD jalan dengan mock; upload menampilkan preview & daftar; responsif; role-gating admin tenant.

### Modul 2 — Pendataan Ibu Hamil / Intake
- **Rute:** `(dashboard)/ibu-hamil` (list) · `ibu-hamil/baru` (form) · `ibu-hamil/[id]` (detail)
- **Layar:** form intake; daftar ibu; detail ibu.
- **Komponen kunci:** `Form` (react-hook-form+zod), `DataTable`, `HplField`, feedback duplikasi NIK.
- **Fitur FE:**
  - [ ] Form intake ringan & responsif (nama, NIK, No. BPJS, alamat, telp, usia kehamilan, HPL, riwayat persalinan, faktor risiko, nakes PJ, rencana tempat bersalin)
  - [ ] Validasi real-time (Zod) + pesan error jelas
  - [ ] Feedback **deteksi duplikasi NIK** (peringatan sebelum simpan)
  - [ ] Indikator status/ketepatan waktu kiriman
  - [ ] Daftar ibu + link ke detail
- **Kontrak (draft):** `IbuHamilInput` (Zod) & `IbuHamilDTO { id, nama, nikMasked, hpl, usiaKehamilan, levelRisiko, statusAlur, puskesmasId }`.
- **State:** loading/empty/error; state submit (pending/success/gagal) via Server Action mock.
- **DoD:** form tervalidasi end-to-end (mock), duplikasi NIK memicu peringatan, NIK/BPJS ter-mask di list.
- **Catatan lintas-doc:** keputusan **`IBU_HAMIL` = orang atau episode kehamilan** ([04](./04-erd.md)) memengaruhi bentuk form & relasi — perlu final sebelum kunci kontrak.

### Modul 3 — Tracking & Deteksi Dini H-30
- **Rute:** `(dashboard)/tracking` (atau panel pada Dashboard)
- **Layar:** daftar sasaran HPL ≤30 hari, terurut prioritas.
- **Komponen kunci:** `RiskBadge`, `HplCountdown`, filter per level risiko.
- **Fitur FE:**
  - [ ] Daftar sasaran + **badge warna risiko** (4 level)
  - [ ] **Hitung mundur** dari HPL (client, `date-fns`)
  - [ ] Filter interaktif per level risiko & Puskesmas
  - [ ] Penanda prioritas
- **Kontrak (draft):** konsumsi `IbuHamilDTO` (field `levelRisiko`, `hpl`, `statusAlur`). **Mesin H-30 & skoring dihitung di worker (BE)** — FE hanya menampilkan.
- **State:** loading/empty/error.
- **DoD:** daftar tersaring benar dari mock, countdown akurat, warna konsisten dengan token risiko.

### Modul 4 — Dashboard Monitoring Terpusat
- **Rute:** `(dashboard)` (halaman utama)
- **Layar:** ringkasan + tabel + chart.
- **Komponen kunci:** `KpiCard`, `DataTable`, shadcn `Chart`, filter global.
- **Fitur FE:**
  - [ ] Kartu KPI (total ibu, risiko tinggi, menjelang persalinan, sudah bersalin)
  - [ ] Tabel ibu + warna risiko + status per ibu
  - [ ] Filter & pencarian (Puskesmas/risiko/HPL)
  - [ ] Chart ringkas (distribusi risiko, tren)
  - [ ] **Tampilan sesuai peran**
  - [ ] Mekanisme refresh (polling/SSE — opsional di MVP)
- **Kontrak (draft):** `DashboardSummaryDTO { totalIbu, risikoTinggi, menjelangPersalinan, sudahBersalin, distribusiRisiko[] }`.
- **State:** loading (skeleton kartu & tabel)/empty/error.
- **DoD:** KPI & tabel terisi dari mock, filter berfungsi, layout responsif, minimal 1 chart tampil.

### Modul A — Manajemen Pengguna & Hak Akses (RBAC) — dasar
- **Rute:** `(auth)/login` · `(dashboard)/pengaturan/pengguna`
- **Fitur FE:** UI login; daftar user & peran (read + assign dasar); **kontrol tampilan berbasis peran** di nav/aksi.
- **DoD:** login mock berhasil; nav & tombol menyesuaikan peran aktif.

### Modul C — Keamanan, Audit & Kepatuhan (UU PDP) — dasar (FE)
- **Fitur FE:** **masking field sensitif** (NIK/BPJS) di semua tampilan; indikator sesi/keamanan minimal.
- **DoD:** helper `maskNik`/`maskBpjs` dipakai konsisten; tidak ada field sensitif tampil penuh secara default.

---

## 3. Rencana per Modul — Fase 2 & 3 (ringkas)

Dibuat ringkas; dirinci saat fase-nya tiba.

| Modul | Rute utama | Layar/komponen kunci FE |
|---|---|---|
| 5 Pendampingan & Edukasi | `/pendampingan` | jadwal & log pendampingan, pustaka materi, tombol trigger WA |
| 6 Verifikasi Administrasi | `/administrasi` | checklist dokumen interaktif, indikator lengkap/kurang, upload |
| 7 Skrining Risiko | `/skrining` | form skrining bertahap, tampilan skor & rekomendasi jalur |
| 8 Perencanaan Persalinan | `/perencanaan` | birth plan, kalender persalinan, papan kesiapan sumber daya |
| 9 Koordinasi Rujukan | `/rujukan` | inisiasi & timeline status rujukan, indikator waktu respons |
| 10 Persalinan & Nifas | `/persalinan` | pencatatan alur, tampilan resume Continuity of Care |
| 11 Monev & Pelaporan | `/monev` | analitik & tren, tombol ekspor PDF/Excel, rekomendasi & tindak lanjut |
| B Notifikasi | lintas modul | aksi kirim notifikasi, riwayat notifikasi |
| D Konfigurasi & Integrasi | `/pengaturan` | UI SOP, parameter skoring, template materi, integrasi eksternal |

---

## 4. Inventaris Komponen Bersama (`components/shared`)

| Komponen | Fungsi | Dipakai modul |
|---|---|---|
| `RiskBadge` | badge level risiko + warna/ikon | 3, 4, 7 |
| `HplCountdown` | hitung mundur ke HPL | 2, 3, 4 |
| `KpiCard` | kartu ringkasan angka | 4, 11 |
| `DataTable` | tabel (TanStack) + filter/sort/pagination | 1, 2, 3, 4 |
| `StatusPill` | status alur/kerja sama/dokumen | 1, 2, 4, 6, 9, 10 |
| `FileUpload` | unggah & preview dokumen | 1, 6 |
| `PageHeader` | judul + aksi + breadcrumb | semua |
| `EmptyState` / skeleton | state kosong & loading | semua |
| `SensitiveField` | tampil masked + reveal (berhak) | 2, 4, C |

---

## 5. Milestone / Urutan Kerja FE

| Milestone | Isi | Hasil |
|---|---|---|
| **M0 — Fondasi** | §1.1–1.10 (scaffold, shadcn, tokens, shell, mock) | app shell + login + theming jalan |
| **M1 — Dashboard skeleton** | Modul 4 dengan mock + KPI/tabel/chart | layar utama tampil |
| **M2 — Intake & Faskes** | Modul 2 + Modul 1 | data masuk (mock) + master faskes |
| **M3 — Tracking H-30** | Modul 3 + integrasi status ke Dashboard | alur inti MVP terlihat: data → H-30 → dashboard berwarna |
| **M4 — RBAC & keamanan UI** | Modul A & C dasar | role-gating + masking konsisten |

> Target akhir MVP FE: membuktikan alur inti **data masuk → deteksi H-30 → tampil di dashboard berwarna risiko** dengan mock DTO, siap disambung ke Service BE tanpa mengubah komponen.

---

## 6. Definition of Done (FE, umum)

- [ ] Responsif (mobile → desktop), tidak ada scroll horizontal tak sengaja
- [ ] Aksesibilitas dasar (keyboard/ARIA via Radix), tidak mengandalkan warna saja
- [ ] Mode terang & gelap
- [ ] State **loading / empty / error** tersedia
- [ ] Bentuk data mengikuti **DTO** (siap ganti mock → Service)
- [ ] **Role-gating** tampilan diterapkan
- [ ] Field sensitif (NIK/BPJS) **ter-mask** secara default
- [ ] Label & format **id-ID**

---

## 7. Prasyarat Sebelum Kunci Kontrak (dari analisis desain)

Beberapa keputusan desain memengaruhi bentuk layar MVP — sebaiknya final sebelum kontrak DTO dibekukan:
1. **`IBU_HAMIL` = orang atau episode kehamilan?** → bentuk form intake & detail (Modul 2).
2. **Draft DTO MVP** (`IbuHamilDTO`, `PuskesmasDTO`, `DashboardSummaryDTO`) → kontrak mock FE.
3. **Daftar peran final + matriks layar↔peran** → role-gating (Modul A, Dashboard).
