import type { DashboardSummaryDTO } from "@/lib/dto/dashboard";
import type { IbuHamilDTO } from "@/lib/dto/ibu-hamil";
import type { PuskesmasDTO } from "@/lib/dto/puskesmas";
import type { TrenBulanan } from "@/lib/mock/tren";
import { RISK_LEVELS } from "@/lib/dto/common";
import { getIbuHamilList } from "./ibu-hamil";
import { getPuskesmasList } from "./puskesmas";
import { getTrenBulanan } from "./tren";

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

export interface DashboardData {
  list: IbuHamilDTO[];
  puskesmas: PuskesmasDTO[];
  tren: TrenBulanan[];
}

/** Satu panggilan untuk seluruh data dashboard (dashboard menghitung metrik dari `list`). */
export async function getDashboardData(): Promise<DashboardData> {
  const [list, puskesmas, tren] = await Promise.all([
    getIbuHamilList(),
    getPuskesmasList(),
    getTrenBulanan(),
  ]);
  return { list, puskesmas, tren };
}
