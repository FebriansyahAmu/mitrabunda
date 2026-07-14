import { IbuHamilClient } from "@/components/ibu-hamil/ibu-hamil-client";
import { getIbuHamilList } from "@/lib/data/ibu-hamil";
import { getPuskesmasList } from "@/lib/data/puskesmas";

export const dynamic = "force-dynamic";

export default async function IbuHamilPage() {
  // Simulasi latensi (mock) agar skeleton tampil — hapus saat Service BE aktif.
  await new Promise((resolve) => setTimeout(resolve, 400));

  const [list, puskesmas] = await Promise.all([
    getIbuHamilList(),
    getPuskesmasList(),
  ]);

  return <IbuHamilClient list={list} puskesmas={puskesmas} />;
}
