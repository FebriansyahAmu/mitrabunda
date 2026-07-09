# 02 — Modul, Fitur & Pembagian Kerja FE/BE

Sistem dipetakan menjadi **11 modul inti** (mengikuti alur kerja 10 tahap proposal + fungsi Rujukan) dan **4 modul pendukung** (lintas-fungsi). Setiap modul dilengkapi deskripsi, fitur, dan pembagian tanggung jawab Frontend (FE) dan Backend (BE).

## Konvensi Pembagian FE/BE

| | Frontend (FE) | Backend (BE) |
|---|---|---|
| **Cakupan** | UI Next.js (App Router), komponen, form, dashboard, chart, state, pemanggilan `/api`/server actions | Service layer, DAL, route handlers, worker jobs, integrasi, business rules, RLS |
| **Fokus** | Pengalaman pengguna, tampilan, interaksi, validasi UX | Logika, data, keamanan, penjadwalan, notifikasi, pelaporan |
| **Kontrak bersama** | Skema **Zod** (di `src/lib/validation`) dan **DTO** (di `src/lib/dto`) menjadi kontrak antara FE dan BE | |

---

# Modul Inti

## 1. Manajemen Kerja Sama & Master Faskes
*(Tahap 1 — fondasi data)*

**Deskripsi.** Mengelola data institusi yang terlibat: Puskesmas, wilayah kerja, PIC, dan arsip perjanjian.

**Fitur:** data Puskesmas & wilayah kerja; manajemen PIC per Puskesmas; arsip dokumen MoU/PKS, SOP, SK Tim; direktori Tim MITRA BUNDA RSUD; pengaturan kontak & alur komunikasi.

| FE | BE |
|---|---|
| Form & tabel CRUD Puskesmas/PIC; halaman arsip dokumen; UI upload MoU/SK | Service master faskes; DAL Puskesmas/PIC; simpan dokumen ke object storage; validasi & otorisasi admin tenant |

**KPI:** 100% Puskesmas terdaftar & kerja sama aktif.

---

## 2. Pendataan Ibu Hamil / Intake
*(Tahap 2 — pintu masuk data)*

**Deskripsi.** Puskesmas mengirim data ibu hamil secara berkala ke sistem.

**Fitur:** form data ibu (nama, NIK, No. BPJS, alamat, telp, usia kehamilan, HPL, riwayat persalinan, faktor risiko, nakes penanggung jawab, rencana tempat bersalin); input batch/mingguan; validasi & deteksi duplikasi; penanda ketepatan waktu kiriman; jalur transisi (Google Form/WA) untuk fase awal.

| FE | BE |
|---|---|
| Form intake responsif & ringan; feedback validasi real-time; indikator status kiriman | Skema Zod intake; Service create/update ibu hamil; DAL + RLS; deteksi duplikasi (NIK); pencatatan ketepatan waktu |

**KPI:** ≥95% data diterima tepat waktu.

---

## 3. Tracking & Deteksi Dini H-30
*(Tahap 4 — inti prediktif)*

**Deskripsi.** Mesin yang menandai ibu dengan HPL ≤30 hari dan menstratifikasi risikonya.

**Fitur:** hitung mundur otomatis dari HPL; filter otomatis HPL ≤30 hari; stratifikasi risiko (Rendah/Sedang/Tinggi/Sangat Tinggi) + kode warna; penanda prioritas; pembentukan daftar sasaran otomatis.

| FE | BE |
|---|---|
| Tampilan daftar sasaran + badge warna risiko; filter interaktif per level risiko | **Worker cron harian** hitung HPL−hari ini ≤30; aturan skoring risiko; Service update status; enqueue tindak lanjut |

**KPI:** 100% ibu HPL ≤30 hari masuk daftar monitoring.

---

## 4. Dashboard Monitoring Terpusat
*(Tahap 3 — satu layar untuk semua)*

**Deskripsi.** Pusat informasi seluruh ibu hamil dalam pengawasan.

**Fitur:** kartu ringkasan (total ibu, risiko tinggi, menjelang persalinan, sudah bersalin); daftar ibu + warna risiko; status per ibu (administrasi, pendampingan, jadwal, rujukan, persalinan, nifas); filter & pencarian (Puskesmas/risiko/HPL); tampilan sesuai peran; pembaruan harian/semi-real-time.

| FE | BE |
|---|---|
| Layout dashboard; komponen kartu KPI; tabel & filter; chart; polling/SSE untuk update; kontrol tampilan per peran | Service agregasi metrik; DAL query ringkasan; endpoint per peran; (opsional) pub/sub Redis untuk update real-time |

**KPI:** dashboard diperbarui setiap hari kerja.

---

## 5. Pendampingan & Edukasi
*(Tahap 5)*

**Deskripsi.** Memastikan setiap ibu sasaran didampingi menjelang persalinan.

**Fitur:** penjadwalan & pencatatan pendampingan (min. 2×); log komunikasi (telp/WA/video call/kunjungan rumah); pustaka materi edukasi (tanda bahaya, persiapan persalinan, barang bawaan, donor darah, pendamping, gizi, menyusui, transportasi); penugasan ke Bidan/Perawat Navigator/Case Manager; laporan pendampingan.

| FE | BE |
|---|---|
| UI jadwal & log pendampingan; pustaka materi; form catatan; tombol trigger WA | Service pendampingan; DAL log; penjadwalan reminder (enqueue); manajemen materi edukasi; penugasan petugas |

**KPI:** minimal 2× edukasi sebelum persalinan.

---

## 6. Verifikasi Administrasi
*(Tahap 6)*

**Deskripsi.** Mengecek kelengkapan dokumen sebelum ibu datang, mencegah keterlambatan administrasi.

**Fitur:** checklist digital (BPJS, KTP, KK, surat rujukan, SEP, persetujuan tindakan, kontak keluarga); status lengkap/kurang per ibu; reminder pelengkapan sebelum HPL; upload & arsip dokumen.

| FE | BE |
|---|---|
| UI checklist interaktif; indikator lengkap/kurang; komponen upload dokumen | Service verifikasi; DAL checklist & dokumen; simpan file ke MinIO; enqueue reminder pelengkapan |

**KPI:** 95% administrasi lengkap sebelum persalinan.

---

## 7. Skrining Risiko Maternal
*(Tahap 7)*

**Deskripsi.** Identifikasi terstruktur potensi komplikasi berdasarkan parameter medis, obstetri, dan sosial.

**Fitur:** form skrining (hipertensi, diabetes, perdarahan, anemia, riwayat SC, gemeli, presentasi janin, usia ibu, penyakit penyerta); perhitungan skor (mis. KSPR/Poedji Rochjati); rekomendasi jalur (normal / terencana di RSUD / operasi elektif / rujukan lanjut); input multi-nakes; output Risk Assessment Form.

| FE | BE |
|---|---|
| Form skrining bertahap; tampilan hasil skor & rekomendasi | Service skrining; **mesin skoring berbasis aturan**; DAL hasil skrining; update level risiko ke modul tracking |

**KPI:** 100% ibu diskrining.

---

## 8. Perencanaan Persalinan & Kesiapan RSUD
*(Tahap 8)*

**Deskripsi.** Menjamin sumber daya RSUD siap sebelum ibu datang.

**Fitur:** Birth Preparedness Plan per ibu; penjadwalan kontrol & operasi elektif; perencanaan kebutuhan (tempat tidur, tim medis, ruang bersalin/operasi, ICU/NICU, darah, ambulans); kalender persalinan terencana; papan kesiapan sumber daya.

| FE | BE |
|---|---|
| UI birth plan; kalender persalinan; papan kesiapan sumber daya | Service perencanaan; DAL birth plan & jadwal; agregasi kebutuhan sumber daya |

**KPI:** 90% persalinan sesuai rencana.

---

## 9. Koordinasi Rujukan
*(fungsi "R" pada framework; lintas Tahap 7–9)*

**Deskripsi.** Memastikan perpindahan pasien Puskesmas→RSUD cepat, tepat, dan aman.

**Fitur:** inisiasi & pelacakan rujukan; status rujukan real-time; **pra-notifikasi otomatis** ke RSUD; koordinasi ambulans/transport; pencatatan waktu respons.

| FE | BE |
|---|---|
| UI inisiasi & pelacakan rujukan; timeline status; indikator waktu respons | Service rujukan; DAL status rujukan; pra-notifikasi otomatis (enqueue WA); pencatatan waktu respons |

**KPI:** ≥95% rujukan dengan pra-notifikasi ≤30 menit.

---

## 10. Monitoring Persalinan & Nifas (Continuity of Care)
*(Tahap 9)*

**Deskripsi.** Kesinambungan pelayanan hingga resume kembali ke Puskesmas.

**Fitur:** pencatatan alur (masuk→persalinan→perawatan bayi→pulang→nifas); data outcome (cara persalinan, komplikasi, kondisi bayi, lama rawat, edukasi nifas, follow-up); resume Continuity of Care otomatis; kirim resume balik ke Puskesmas; pengingat follow-up nifas.

| FE | BE |
|---|---|
| UI pencatatan alur persalinan & nifas; tampilan resume | Service continuity; DAL rekam persalinan & nifas; generate resume; kirim balik ke Puskesmas; enqueue pengingat nifas |

**KPI:** 100% ibu memperoleh tindak lanjut pascapersalinan.

---

## 11. Monitoring, Evaluasi & Pelaporan
*(Tahap 10)*

**Deskripsi.** Mengukur efektivitas dan mendorong perbaikan berkelanjutan.

**Fitur:** perhitungan indikator mutu otomatis (akses & kontinuitas, keamanan pasien, efektivitas klinis, outcome, kepuasan, tata kelola); laporan Monev bulanan (ekspor PDF/Excel); tren AKI/AKB/Near Miss/komplikasi/waktu respons; distribusi laporan & rekomendasi ke Puskesmas; pelacakan tindak lanjut rekomendasi.

| FE | BE |
|---|---|
| Halaman analitik & tren; tombol ekspor; tampilan rekomendasi & status tindak lanjut | **Worker** kalkulasi indikator bulanan; Service pelaporan; generate PDF/Excel; DAL evaluasi; distribusi laporan |

**KPI:** laporan terbit tiap bulan; ≥80% rekomendasi ditindaklanjuti.

---

# Modul Pendukung (Lintas-Fungsi)

## A. Manajemen Pengguna & Hak Akses (RBAC)

**Peran:** Direktur, Obgyn, Bidan, Perawat Navigator, Case Manager, Ruang Bersalin, Rekam Medis, Tim Mutu, PIC Puskesmas, Dinkes, view BPJS.

| FE | BE |
|---|---|
| UI login; manajemen user & peran; kontrol tampilan berbasis peran | Auth.js/Lucia; tabel roles/permissions; enforce di Service; RLS per tenant |

## B. Notifikasi & Komunikasi

Melayani modul 5, 6, 8, 9, 10.

| FE | BE |
|---|---|
| Tombol/aksi kirim notifikasi; tampilan riwayat notifikasi | Interface `NotificationProvider`; integrasi WhatsApp (Meta/BSP lokal); template pesan; worker pengirim; reminder otomatis |

## C. Keamanan, Audit & Kepatuhan Data (UU PDP)

| FE | BE |
|---|---|
| Indikator sesi/keamanan minimal; masking field sensitif di UI | Enkripsi field (NIK/BPJS); audit log akses; backup & retensi; manajemen consent (opsional) |

## D. Konfigurasi & Integrasi Eksternal

| FE | BE |
|---|---|
| UI pengaturan SOP, indikator, parameter skoring, template materi | Manajemen konfigurasi; *(fase lanjut)* integrasi SIMRS, SATUSEHAT (FHIR), BPJS/SEP; jembatan Google Form |

---

# Pemetaan Fase & Kepemilikan

| Modul | Fase | Lead |
|---|---|---|
| 1 Master Faskes | MVP | BE + FE |
| 2 Intake | MVP | FE + BE |
| 3 Tracking H-30 | MVP | BE |
| 4 Dashboard | MVP | FE |
| A RBAC (dasar) | MVP | BE |
| C Keamanan (dasar) | MVP | BE |
| 5 Pendampingan | Fase 2 | FE + BE |
| 6 Verifikasi Admin | Fase 2 | FE + BE |
| 7 Skrining | Fase 2 | BE + FE |
| 8 Perencanaan | Fase 2 | FE + BE |
| 9 Rujukan | Fase 2 | BE + FE |
| 10 Monitoring Nifas | Fase 2 | BE + FE |
| 11 Monev | Fase 2 | BE + FE |
| B Notifikasi (WhatsApp) | Fase 2 | BE |
| D Integrasi eksternal | Fase 3 | BE |

> **MVP (Fase 1):** modul 1–4 + A & C dasar — membuktikan alur inti (data masuk → deteksi H-30 → tampil di dashboard berwarna risiko).
