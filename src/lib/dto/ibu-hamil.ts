import type { RiskLevel, StatusAlur } from "./common";

/**
 * IbuHamilDTO — bentuk data ibu hamil yang dirender FE.
 *
 * Catatan model: entitas ini merepresentasikan **episode kehamilan**
 * (bukan orang), sehingga HPL, usia kehamilan, level risiko, dan status
 * alur adalah atribut per-kehamilan. Field sensitif (NIK/BPJS) sudah
 * dalam bentuk ter-mask di DTO.
 */
export interface IbuHamilDTO {
  id: string;
  nama: string;
  nikMasked: string;
  bpjsMasked: string;
  puskesmasId: string;
  puskesmasNama: string;
  usiaKehamilanMinggu: number;
  hpl: string; // ISO date (YYYY-MM-DD)
  hariMenujuHpl: number;
  levelRisiko: RiskLevel;
  statusAlur: StatusAlur;
  nakesPenanggungJawab: string;
  rencanaTempatBersalin: string;
}
