import type { RiskLevel } from "@/lib/dto/common";

export const FAKTOR_RISIKO = [
  "Hipertensi",
  "Diabetes gestasional",
  "Anemia",
  "Riwayat SC",
  "Perdarahan",
  "Usia <20 / >35 th",
  "Gemeli (kembar)",
  "Jarak kehamilan <2 th",
  "Preeklampsia",
  "Penyakit penyerta",
] as const;

export const RIWAYAT_PERSALINAN = [
  "Belum pernah",
  "1 kali",
  "2 kali",
  "3 kali atau lebih",
] as const;

/**
 * Estimasi kasar level risiko dari jumlah faktor — hanya untuk pratinjau di FE.
 * Skoring final (mis. KSPR) dilakukan di BE/worker.
 */
export function estimasiRisiko(jumlahFaktor: number): RiskLevel {
  if (jumlahFaktor <= 0) return "rendah";
  if (jumlahFaktor === 1) return "sedang";
  if (jumlahFaktor <= 3) return "tinggi";
  return "sangat-tinggi";
}
