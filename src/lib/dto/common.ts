// Tipe & konstanta bersama (provisional DTO — bukan skema DB).

export type RiskLevel = "rendah" | "sedang" | "tinggi" | "sangat-tinggi";

export const RISK_LEVELS: RiskLevel[] = [
  "rendah",
  "sedang",
  "tinggi",
  "sangat-tinggi",
];

export const RISK_LABEL: Record<RiskLevel, string> = {
  "rendah": "Rendah",
  "sedang": "Sedang",
  "tinggi": "Tinggi",
  "sangat-tinggi": "Sangat Tinggi",
};

export type StatusAlur =
  | "intake"
  | "pendampingan"
  | "administrasi"
  | "skrining"
  | "perencanaan"
  | "rujukan"
  | "persalinan"
  | "nifas"
  | "selesai";

export const STATUS_ALUR_LABEL: Record<StatusAlur, string> = {
  intake: "Intake",
  pendampingan: "Pendampingan",
  administrasi: "Administrasi",
  skrining: "Skrining",
  perencanaan: "Perencanaan",
  rujukan: "Rujukan",
  persalinan: "Persalinan",
  nifas: "Nifas",
  selesai: "Selesai",
};
