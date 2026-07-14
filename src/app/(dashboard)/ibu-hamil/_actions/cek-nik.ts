"use server";

import { ibuHamilRaw } from "@/lib/mock/ibu-hamil";

export interface CekNikResult {
  duplikat: boolean;
  nama?: string;
}

/** Deteksi duplikasi NIK terhadap data terdaftar (mock). */
export async function cekNik(nik: string): Promise<CekNikResult> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  const found = ibuHamilRaw.find((x) => x.nik === nik);
  return found ? { duplikat: true, nama: found.nama } : { duplikat: false };
}
