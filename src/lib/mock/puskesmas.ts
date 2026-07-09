export interface PuskesmasRaw {
  id: string;
  nama: string;
  wilayahKerja: string;
  pic: string;
  kontak: string;
  statusKerjaSama: "aktif" | "nonaktif";
}

export const puskesmasRaw: PuskesmasRaw[] = [
  {
    id: "pkm-tutuyan",
    nama: "Puskesmas Tutuyan",
    wilayahKerja: "Kec. Tutuyan",
    pic: "Bd. Rahmawati",
    kontak: "0812-3456-1001",
    statusKerjaSama: "aktif",
  },
  {
    id: "pkm-kotabunan",
    nama: "Puskesmas Kotabunan",
    wilayahKerja: "Kec. Kotabunan",
    pic: "Bd. Selvi Mokodongan",
    kontak: "0812-3456-1002",
    statusKerjaSama: "aktif",
  },
  {
    id: "pkm-nuangan",
    nama: "Puskesmas Nuangan",
    wilayahKerja: "Kec. Nuangan",
    pic: "Bd. Hasna Paputungan",
    kontak: "0812-3456-1003",
    statusKerjaSama: "aktif",
  },
  {
    id: "pkm-modayag",
    nama: "Puskesmas Modayag",
    wilayahKerja: "Kec. Modayag",
    pic: "Bd. Yuni Korompot",
    kontak: "0812-3456-1004",
    statusKerjaSama: "nonaktif",
  },
];
