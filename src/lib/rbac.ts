// RBAC ringan sisi FE: HANYA untuk gating tampilan (sembunyikan nav/aksi).
// Otorisasi sebenarnya ditegakkan di BE (Service + RLS).

export type Peran =
  | "direktur"
  | "obgyn"
  | "bidan"
  | "perawat-navigator"
  | "case-manager"
  | "ruang-bersalin"
  | "rekam-medis"
  | "tim-mutu"
  | "pic-puskesmas"
  | "dinkes"
  | "view-bpjs";

export const PERAN_LABEL: Record<Peran, string> = {
  "direktur": "Direktur",
  "obgyn": "Dokter Obgyn",
  "bidan": "Bidan",
  "perawat-navigator": "Perawat Navigator",
  "case-manager": "Case Manager",
  "ruang-bersalin": "Ruang Bersalin",
  "rekam-medis": "Rekam Medis",
  "tim-mutu": "Tim Mutu",
  "pic-puskesmas": "PIC Puskesmas",
  "dinkes": "Dinas Kesehatan",
  "view-bpjs": "BPJS (view)",
};

export interface CurrentUser {
  nama: string;
  peran: Peran;
  faskes: string;
  inisial: string;
}

// Mock pengguna aktif (sementara, sampai auth BE tersedia).
export const currentUser: CurrentUser = {
  nama: "dr. Sartika Mokoginta",
  peran: "direktur",
  faskes: "RSUD Bolaang Mongondow Timur",
  inisial: "SM",
};

/** true jika `peran` boleh melihat item dengan `roles` (undefined/empty = semua). */
export function can(peran: Peran, roles?: Peran[]): boolean {
  if (!roles || roles.length === 0) return true;
  return roles.includes(peran);
}
