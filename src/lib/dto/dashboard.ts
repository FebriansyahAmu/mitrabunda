import type { RiskLevel } from "./common";

export interface DistribusiRisiko {
  level: RiskLevel;
  jumlah: number;
}

export interface DashboardSummaryDTO {
  totalIbu: number;
  risikoTinggi: number; // level tinggi + sangat-tinggi
  menjelangPersalinan: number; // HPL <= 30 hari
  sudahBersalin: number;
  distribusiRisiko: DistribusiRisiko[];
}
