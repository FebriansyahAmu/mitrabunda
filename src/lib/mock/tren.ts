export interface TrenBulanan {
  bulan: string;
  registrasi: number;
  persalinan: number;
}

// Tren 6 bulan terakhir (agregat historis mock).
export const trenBulanan: TrenBulanan[] = [
  { bulan: "Feb", registrasi: 14, persalinan: 9 },
  { bulan: "Mar", registrasi: 19, persalinan: 12 },
  { bulan: "Apr", registrasi: 17, persalinan: 15 },
  { bulan: "Mei", registrasi: 23, persalinan: 14 },
  { bulan: "Jun", registrasi: 21, persalinan: 18 },
  { bulan: "Jul", registrasi: 26, persalinan: 16 },
];
