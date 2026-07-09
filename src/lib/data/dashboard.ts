import type { DashboardSummaryDTO } from "@/lib/dto/dashboard";
import { RISK_LEVELS } from "@/lib/dto/common";
import { getIbuHamilList } from "./ibu-hamil";

export async function getDashboardSummary(): Promise<DashboardSummaryDTO> {
  const list = await getIbuHamilList();

  const distribusiRisiko = RISK_LEVELS.map((level) => ({
    level,
    jumlah: list.filter((x) => x.levelRisiko === level).length,
  }));

  return {
    totalIbu: list.length,
    risikoTinggi: list.filter(
      (x) => x.levelRisiko === "tinggi" || x.levelRisiko === "sangat-tinggi",
    ).length,
    menjelangPersalinan: list.filter(
      (x) => x.hariMenujuHpl >= 0 && x.hariMenujuHpl <= 30,
    ).length,
    sudahBersalin: list.filter(
      (x) =>
        x.statusAlur === "persalinan" ||
        x.statusAlur === "nifas" ||
        x.statusAlur === "selesai",
    ).length,
    distribusiRisiko,
  };
}
