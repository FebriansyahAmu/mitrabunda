import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { getDashboardData } from "@/lib/data/dashboard";

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <DashboardClient data={data} />;
}
