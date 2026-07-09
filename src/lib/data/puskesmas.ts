import type { PuskesmasDTO } from "@/lib/dto/puskesmas";
import { puskesmasRaw } from "@/lib/mock/puskesmas";
import { ibuHamilRaw } from "@/lib/mock/ibu-hamil";

function hitungIbuPerPuskesmas(): Map<string, number> {
  const counts = new Map<string, number>();
  for (const ibu of ibuHamilRaw) {
    counts.set(ibu.puskesmasId, (counts.get(ibu.puskesmasId) ?? 0) + 1);
  }
  return counts;
}

export async function getPuskesmasList(): Promise<PuskesmasDTO[]> {
  const counts = hitungIbuPerPuskesmas();
  return puskesmasRaw.map((p) => ({
    ...p,
    jumlahIbuHamil: counts.get(p.id) ?? 0,
  }));
}
