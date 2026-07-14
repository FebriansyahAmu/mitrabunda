import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { getDashboardData } from "@/lib/data/dashboard";

// Render dinamis agar skeleton (loading.tsx) tampil saat data dimuat,
// mencerminkan perilaku dengan Service BE nyata.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <DashboardClient data={data} />;
}
