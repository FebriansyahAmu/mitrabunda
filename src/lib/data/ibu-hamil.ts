// Seam data: SEKARANG membaca mock. Nanti isi fungsi ini dipindah memanggil
// Service (BE) — komponen pemanggil tidak berubah.

import type { IbuHamilDTO } from "@/lib/dto/ibu-hamil";
import { ibuHamilRaw, type IbuHamilRaw } from "@/lib/mock/ibu-hamil";
import { puskesmasRaw } from "@/lib/mock/puskesmas";
import {
  hariMenujuHpl,
  maskBpjs,
  maskNik,
  usiaKehamilanMinggu,
} from "@/lib/format";

const puskesmasNama = new Map(puskesmasRaw.map((p) => [p.id, p.nama]));

function hplFromOffset(offsetHari: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetHari);
  return d.toISOString().slice(0, 10);
}

function toDTO(r: IbuHamilRaw): IbuHamilDTO {
  const hpl = hplFromOffset(r.hplOffsetHari);
  return {
    id: r.id,
    nama: r.nama,
    nikMasked: maskNik(r.nik),
    bpjsMasked: maskBpjs(r.bpjs),
    puskesmasId: r.puskesmasId,
    puskesmasNama: puskesmasNama.get(r.puskesmasId) ?? "—",
    usiaKehamilanMinggu: usiaKehamilanMinggu(hpl),
    hpl,
    hariMenujuHpl: hariMenujuHpl(hpl),
    levelRisiko: r.levelRisiko,
    statusAlur: r.statusAlur,
    nakesPenanggungJawab: r.nakesPenanggungJawab,
    rencanaTempatBersalin: r.rencanaTempatBersalin,
  };
}

export async function getIbuHamilList(): Promise<IbuHamilDTO[]> {
  return ibuHamilRaw
    .map(toDTO)
    .sort((a, b) => a.hariMenujuHpl - b.hariMenujuHpl);
}

export async function getIbuHamilById(id: string): Promise<IbuHamilDTO | null> {
  const r = ibuHamilRaw.find((x) => x.id === id);
  return r ? toDTO(r) : null;
}

/** Sasaran deteksi dini: HPL dalam 0–30 hari ke depan. */
export async function getSasaranH30(): Promise<IbuHamilDTO[]> {
  const list = await getIbuHamilList();
  return list.filter((x) => x.hariMenujuHpl >= 0 && x.hariMenujuHpl <= 30);
}
