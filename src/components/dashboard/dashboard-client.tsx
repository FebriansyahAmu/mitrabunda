"use client";

import { useMemo, useState } from "react";
import { Baby, CalendarClock, TriangleAlert, Users } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import {
  DashboardFilters,
  type DashboardFilterState,
} from "@/components/dashboard/dashboard-filters";
import { IbuTable } from "@/components/dashboard/ibu-table";
import { PuskesmasBar } from "@/components/dashboard/puskesmas-bar";
import { RiskDonut } from "@/components/dashboard/risk-donut";
import { SasaranList } from "@/components/dashboard/sasaran-list";
import { StatCard } from "@/components/dashboard/stat-card";
import { TrenArea } from "@/components/dashboard/tren-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RISK_LABEL, RISK_LEVELS } from "@/lib/dto/common";
import type { DashboardData } from "@/lib/data/dashboard";

export function DashboardClient({ data }: { data: DashboardData }) {
  const { list, puskesmas, tren } = data;
  const [filter, setFilter] = useState<DashboardFilterState>({
    q: "",
    puskesmasId: "all",
    risk: "all",
  });

  const filtered = useMemo(() => {
    const q = filter.q.trim().toLowerCase();
    return list.filter((ibu) => {
      if (filter.puskesmasId !== "all" && ibu.puskesmasId !== filter.puskesmasId)
        return false;
      if (filter.risk !== "all" && ibu.levelRisiko !== filter.risk) return false;
      if (
        q &&
        !ibu.nama.toLowerCase().includes(q) &&
        !ibu.puskesmasNama.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [list, filter]);

  const kpi = useMemo(
    () => ({
      total: filtered.length,
      risikoTinggi: filtered.filter(
        (x) => x.levelRisiko === "tinggi" || x.levelRisiko === "sangat-tinggi",
      ).length,
      menjelang: filtered.filter(
        (x) => x.hariMenujuHpl >= 0 && x.hariMenujuHpl <= 30,
      ).length,
      bersalin: filtered.filter((x) =>
        ["persalinan", "nifas", "selesai"].includes(x.statusAlur),
      ).length,
    }),
    [filtered],
  );

  const risikoData = useMemo(
    () =>
      RISK_LEVELS.map((level) => ({
        level,
        jumlah: filtered.filter((x) => x.levelRisiko === level).length,
      })),
    [filtered],
  );

  const puskesmasData = useMemo(() => {
    const counts = new Map<string, number>();
    for (const ibu of filtered) {
      counts.set(ibu.puskesmasNama, (counts.get(ibu.puskesmasNama) ?? 0) + 1);
    }
    return puskesmas
      .map((p) => ({
        nama: p.nama.replace(/^Puskesmas\s+/i, ""),
        jumlah: counts.get(p.nama) ?? 0,
      }))
      .filter((d) => d.jumlah > 0 || filter.puskesmasId === "all")
      .sort((a, b) => b.jumlah - a.jumlah);
  }, [filtered, puskesmas, filter.puskesmasId]);

  const sasaran = useMemo(
    () =>
      filtered
        .filter((x) => x.hariMenujuHpl >= 0 && x.hariMenujuHpl <= 30)
        .sort((a, b) => a.hariMenujuHpl - b.hariMenujuHpl),
    [filtered],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Pemantauan ibu hamil dalam pengawasan — diperbarui setiap hari kerja."
      />

      <DashboardFilters puskesmas={puskesmas} value={filter} onChange={setFilter} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Ibu Hamil" value={kpi.total} icon={Users} delta={12} />
        <StatCard
          label="Risiko Tinggi"
          value={kpi.risikoTinggi}
          icon={TriangleAlert}
          delta={8}
          invertDelta
          accentClassName="bg-risk-tinggi/12 text-risk-tinggi"
          hint="Tinggi + Sangat Tinggi"
        />
        <StatCard
          label="Menjelang Persalinan"
          value={kpi.menjelang}
          icon={CalendarClock}
          accentClassName="bg-risk-sedang/12 text-risk-sedang"
          hint="HPL ≤ 30 hari"
        />
        <StatCard
          label="Sudah Bersalin"
          value={kpi.bersalin}
          icon={Baby}
          delta={5}
          accentClassName="bg-risk-rendah/12 text-risk-rendah"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">
              Tren Registrasi &amp; Persalinan
            </CardTitle>
            <CardDescription>6 bulan terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <TrenArea data={tren} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribusi Risiko</CardTitle>
            <CardDescription>Mengikuti filter aktif</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RiskDonut data={risikoData} />
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
              {risikoData.map((d) => (
                <li
                  key={d.level}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: `var(--risk-${d.level})` }}
                    />
                    <span className="text-muted-foreground">
                      {RISK_LABEL[d.level]}
                    </span>
                  </span>
                  <span className="font-medium tabular-nums">{d.jumlah}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Ibu Hamil per Puskesmas</CardTitle>
            <CardDescription>Sebaran wilayah kerja</CardDescription>
          </CardHeader>
          <CardContent>
            <PuskesmasBar data={puskesmasData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sasaran H-30</CardTitle>
            <CardDescription>Prioritas menjelang persalinan</CardDescription>
          </CardHeader>
          <CardContent>
            <SasaranList items={sasaran} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daftar Ibu Hamil</CardTitle>
          <CardDescription>{filtered.length} ibu sesuai filter</CardDescription>
        </CardHeader>
        <CardContent>
          <IbuTable data={filtered} />
        </CardContent>
      </Card>
    </div>
  );
}
