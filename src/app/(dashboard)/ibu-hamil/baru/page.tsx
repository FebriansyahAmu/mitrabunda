import { IntakeForm } from "@/components/ibu-hamil/intake-form";
import { getPuskesmasList } from "@/lib/data/puskesmas";

export default async function IntakeBaruPage() {
  const puskesmas = await getPuskesmasList();
  return <IntakeForm puskesmas={puskesmas} />;
}
