# 03 — Data Flow Diagram (DFD)

DFD disusun dua level: **Level 0 (context diagram)** memperlihatkan sistem sebagai satu proses dengan pihak luar, dan **Level 1** memecah sistem menjadi proses (= modul) beserta data store-nya.

> DFD menggambarkan **aliran data**, bukan daftar fitur. Rincian fitur tiap proses ada di `02-modules-and-features.md`.

Legenda: **proses/modul**, **entitas eksternal**, **data store**.

---

## DFD Level 0 — Context Diagram

```mermaid
flowchart LR
    PKM["Puskesmas"]
    IBU["Ibu & Keluarga"]
    BPJS["BPJS Kesehatan"]
    DINKES["Dinas Kesehatan"]
    RSUD["Tim RSUD"]

    SYS(("Sistem<br/>MITRA BUNDA"))

    PKM -->|data ibu hamil, HPL, faktor risiko| SYS
    SYS -->|resume & umpan balik| PKM
    SYS -->|edukasi, reminder, jadwal| IBU
    IBU -->|data & konfirmasi| SYS
    BPJS -->|status kepesertaan & SEP| SYS
    SYS -->|laporan mutu AKI/AKB| DINKES
    RSUD <-->|akses dashboard & input klinis| SYS
```

### Aliran data Level 0

| Entitas eksternal | Ke sistem | Dari sistem |
|---|---|---|
| Puskesmas | data ibu hamil, HPL, faktor risiko | resume & umpan balik |
| Ibu & Keluarga | data & konfirmasi | edukasi, reminder, jadwal |
| BPJS Kesehatan | status kepesertaan & SEP | (permintaan verifikasi) |
| Dinas Kesehatan | — | laporan mutu (AKI/AKB, monev) |
| Tim RSUD | input klinis | akses dashboard |

---

## DFD Level 1 — Proses & Data Store

Alur utama berjalan vertikal (P1→P7). Panah ke data store menandai penulisan/pembacaan data; entitas eksternal terhubung pada proses yang relevan.

```mermaid
flowchart TB
    PKM["Puskesmas"]
    RSUD["Tim RSUD"]
    IBU["Ibu & Keluarga"]
    BPJS["BPJS Kesehatan"]
    PKM2["Puskesmas (resume)"]
    DINKES["Dinas Kesehatan"]

    P1["P1 · Pendataan & deteksi H-30"]
    P2["P2 · Dashboard & monitoring"]
    P3["P3 · Pendampingan & edukasi"]
    P4["P4 · Verifikasi administrasi"]
    P5["P5 · Skrining & perencanaan"]
    P6["P6 · Rujukan, persalinan, nifas"]
    P7["P7 · Monev & pelaporan"]

    D1[("D1 · Data ibu hamil")]
    D2[("D2 · Administrasi")]
    D3[("D3 · Skrining & birth plan")]
    D4[("D4 · Rekam persalinan & nifas")]
    D5[("D5 · Indikator & evaluasi")]

    PKM -->|data ibu, HPL| P1
    P1 -->|data & risiko| P2
    P2 -->|sasaran H-30| P3
    P3 -->|ibu didampingi| P4
    P4 -->|admin lengkap| P5
    P5 -->|rencana lahir| P6
    P6 -->|outcome| P7

    RSUD <--> P2
    IBU <--> P3
    BPJS <--> P4
    P6 -->|resume| PKM2
    P7 -->|laporan mutu| DINKES

    P1 --> D1
    D1 -.baca.-> P2
    P4 --> D2
    P5 --> D3
    P6 --> D4
    P7 --> D5
```

### Penjelasan proses

| Proses | Modul terkait | Peran data |
|---|---|---|
| P1 Pendataan & deteksi H-30 | Modul 1, 2, 3 | Terima data dari Puskesmas → tulis **D1**; hitung HPL≤30 |
| P2 Dashboard & monitoring | Modul 4 | Baca seluruh data store → sajikan ke Tim RSUD |
| P3 Pendampingan & edukasi | Modul 5 | Interaksi dengan Ibu & Keluarga |
| P4 Verifikasi administrasi | Modul 6 | Cek dokumen → tulis **D2**; verifikasi via BPJS |
| P5 Skrining & perencanaan | Modul 7, 8 | Skoring risiko & birth plan → tulis **D3** |
| P6 Rujukan, persalinan, nifas | Modul 9, 10 | Catat outcome → tulis **D4**; kirim resume ke Puskesmas |
| P7 Monev & pelaporan | Modul 11 | Hitung indikator → tulis **D5**; laporan ke Dinkes |

> Catatan: P2 (Dashboard) membaca **semua** data store; pada diagram hanya digambar satu panah baca (D1→P2) agar tetap ringkas.
