import { Baby, CalendarClock, TriangleAlert, Users } from "lucide-react";

import { KpiCard } from "@/components/shared/kpi-card";
import { PageHeader } from "@/components/shared/page-header";
import { RiskBadge } from "@/components/shared/risk-badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDashboardSummary } from "@/lib/data/dashboard";
import { formatAngka } from "@/lib/format";

export default async function DashboardPage() {
  const summary = await getDashboardSummary();
  const maks = Math.max(1, ...summary.distribusiRisiko.map((d) => d.jumlah));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Ringkasan pemantauan ibu hamil dalam pengawasan."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Ibu Hamil" value={summary.totalIbu} icon={Users} />
        <KpiCard
          label="Risiko Tinggi"
          value={summary.risikoTinggi}
          icon={TriangleAlert}
          hint="Tinggi + Sangat Tinggi"
          accentClassName="bg-risk-tinggi/12 text-risk-tinggi"
        />
        <KpiCard
          label="Menjelang Persalinan"
          value={summary.menjelangPersalinan}
          icon={CalendarClock}
          hint="HPL ≤ 30 hari"
          accentClassName="bg-risk-sedang/12 text-risk-sedang"
        />
        <KpiCard
          label="Sudah Bersalin"
          value={summary.sudahBersalin}
          icon={Baby}
          accentClassName="bg-risk-rendah/12 text-risk-rendah"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribusi Risiko</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.distribusiRisiko.map((d) => (
              <div key={d.level} className="flex items-center gap-3">
                <div className="w-28 shrink-0">
                  <RiskBadge level={d.level} />
                </div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(d.jumlah / maks) * 100}%`,
                      backgroundColor: `var(--risk-${d.level})`,
                    }}
                  />
                </div>
                <span className="w-8 text-right text-sm tabular-nums text-muted-foreground">
                  {formatAngka(d.jumlah)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Catatan</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Fondasi <strong className="font-medium text-foreground">M0</strong>{" "}
            selesai: shell, tema terang/gelap, token warna risiko, dan seam data
            mock sudah aktif. Tabel ibu, filter, dan grafik interaktif menyusul
            pada milestone <strong className="font-medium text-foreground">M1</strong>.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
