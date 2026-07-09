export interface PuskesmasDTO {
  id: string;
  nama: string;
  wilayahKerja: string;
  pic: string;
  kontak: string;
  statusKerjaSama: "aktif" | "nonaktif";
  jumlahIbuHamil: number;
}
