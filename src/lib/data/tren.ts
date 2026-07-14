import { trenBulanan, type TrenBulanan } from "@/lib/mock/tren";

export async function getTrenBulanan(): Promise<TrenBulanan[]> {
  return trenBulanan;
}
