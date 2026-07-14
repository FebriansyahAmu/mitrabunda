"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarClock, Plus, Search, TriangleAlert, Users } from "lucide-react";

import { MotionItem, MotionStagger } from "@/components/motion/animated";
import { IbuTable } from "@/components/dashboard/ibu-table";
import { StatCard } from "@/components/dashboard/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { IbuHamilDTO } from "@/lib/dto/ibu-hamil";
import type { PuskesmasDTO } from "@/lib/dto/puskesmas";

type Tab = "semua" | "h30" | "risiko";

function TabCount({ n }: { n: number }) {
  return (
    <span className="ml-1.5 rounded bg-foreground/10 px-1.5 text-xs tabular-nums">
      {n}
    </span>
  );
}

export function IbuHamilClient({
  list,
  puskesmas,
}: {
  list: IbuHamilDTO[];
  puskesmas: PuskesmasDTO[];
}) {
  const [tab, setTab] = useState<Tab>("semua");
  const [q, setQ] = useState("");
  const [puskesmasId, setPuskesmasId] = useState("all");

  const base = useMemo(() => {
    const query = q.trim().toLowerCase();
    return list.filter((ibu) => {
      if (puskesmasId !== "all" && ibu.puskesmasId !== puskesmasId) return false;
      if (
        query &&
        !ibu.nama.toLowerCase().includes(query) &&
        !ibu.puskesmasNama.toLowerCase().includes(query)
      )
        return false;
      return true;
    });
  }, [list, q, puskesmasId]);

  const counts = useMemo(
    () => ({
      semua: base.length,
      h30: base.filter((x) => x.hariMenujuHpl >= 0 && x.hariMenujuHpl <= 30)
        .length,
      risiko: base.filter(
        (x) => x.levelRisiko === "tinggi" || x.levelRisiko === "sangat-tinggi",
      ).length,
    }),
    [base],
  );

  const filtered = useMemo(() => {
    if (tab === "h30")
      return base.filter((x) => x.hariMenujuHpl >= 0 && x.hariMenujuHpl <= 30);
    if (tab === "risiko")
      return base.filter(
        (x) => x.levelRisiko === "tinggi" || x.levelRisiko === "sangat-tinggi",
      );
    return base;
  }, [base, tab]);

  return (
    <MotionStagger className="space-y-6">
      <MotionItem>
        <PageHeader
          title="Ibu Hamil"
          description="Pendataan dan pemantauan seluruh ibu hamil dalam pengawasan."
        >
          <Button nativeButton={false} render={<Link href="/ibu-hamil/baru" />}>
            <Plus className="size-4" aria-hidden />
            Tambah Ibu Hamil
          </Button>
        </PageHeader>
      </MotionItem>

      <MotionStagger className="grid gap-4 sm:grid-cols-3">
        <MotionItem lift>
          <StatCard
            label="Total Ibu Hamil"
            value={counts.semua}
            icon={Users}
            hint="Sesuai filter"
          />
        </MotionItem>
        <MotionItem lift>
          <StatCard
            label="Menjelang Persalinan"
            value={counts.h30}
            icon={CalendarClock}
            accentClassName="bg-risk-sedang/12 text-risk-sedang"
            hint="HPL ≤ 30 hari"
          />
        </MotionItem>
        <MotionItem lift>
          <StatCard
            label="Risiko Tinggi"
            value={counts.risiko}
            icon={TriangleAlert}
            accentClassName="bg-risk-tinggi/12 text-risk-tinggi"
            hint="Tinggi + Sangat Tinggi"
          />
        </MotionItem>
      </MotionStagger>

      <MotionItem>
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
                <TabsList>
                  <TabsTrigger value="semua">
                    Semua
                    <TabCount n={counts.semua} />
                  </TabsTrigger>
                  <TabsTrigger value="h30">
                    Menjelang H-30
                    <TabCount n={counts.h30} />
                  </TabsTrigger>
                  <TabsTrigger value="risiko">
                    Risiko Tinggi
                    <TabCount n={counts.risiko} />
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative sm:w-56">
                  <Search
                    className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Cari nama ibu…"
                    className="pl-8"
                    aria-label="Cari nama ibu"
                  />
                </div>
                <Select
                  value={puskesmasId}
                  onValueChange={(v) => setPuskesmasId(v ?? "all")}
                >
                  <SelectTrigger
                    className="w-full sm:w-[190px]"
                    aria-label="Filter Puskesmas"
                  >
                    <SelectValue>
                      {(v: string) =>
                        v === "all"
                          ? "Semua Puskesmas"
                          : (puskesmas.find((p) => p.id === v)?.nama ??
                            "Puskesmas")
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Puskesmas</SelectItem>
                    {puskesmas.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <IbuTable
              data={filtered}
              getHref={(ibu) => `/ibu-hamil/${ibu.id}`}
              pageSize={8}
            />
          </CardContent>
        </Card>
      </MotionItem>
    </MotionStagger>
  );
}
