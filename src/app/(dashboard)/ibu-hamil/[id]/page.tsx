import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarClock, HeartPulse, Hourglass } from "lucide-react";

import { StatusTimeline } from "@/components/ibu-hamil/status-timeline";
import { HplCountdown } from "@/components/shared/hpl-countdown";
import { RiskBadge } from "@/components/shared/risk-badge";
import { StatusPill } from "@/components/shared/status-pill";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getIbuHamilById } from "@/lib/data/ibu-hamil";
import { RISK_LABEL } from "@/lib/dto/common";
import { formatTanggal } from "@/lib/format";

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-2.5 last:border-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium">{children}</dd>
    </div>
  );
}

export default async function IbuDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ibu = await getIbuHamilById(id);
  if (!ibu) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          className="mb-2 -ml-2"
          render={<Link href="/ibu-hamil" />}
        >
          <ArrowLeft className="size-4" aria-hidden />
          Ibu Hamil
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{ibu.nama}</h1>
          <RiskBadge level={ibu.levelRisiko} />
          <StatusPill status={ibu.statusAlur} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {ibu.puskesmasNama} · NIK {ibu.nikMasked}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarClock className="size-4" aria-hidden />
              Menuju HPL
            </div>
            <p className="mt-1 text-2xl font-semibold">
              <HplCountdown hari={ibu.hariMenujuHpl} />
            </p>
            <p className="text-xs text-muted-foreground">
              {formatTanggal(ibu.hpl)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Hourglass className="size-4" aria-hidden />
              Usia Kehamilan
            </div>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {ibu.usiaKehamilanMinggu}{" "}
              <span className="text-base font-normal text-muted-foreground">
                minggu
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <HeartPulse className="size-4" aria-hidden />
              Level Risiko
            </div>
            <div className="mt-2">
              <RiskBadge level={ibu.levelRisiko} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Alur Continuity of Care</CardTitle>
        </CardHeader>
        <CardContent>
          <StatusTimeline current={ibu.statusAlur} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Identitas &amp; Kontak</CardTitle>
          </CardHeader>
          <CardContent>
            <dl>
              <InfoRow label="NIK">{ibu.nikMasked}</InfoRow>
              <InfoRow label="No. BPJS">{ibu.bpjsMasked}</InfoRow>
              <InfoRow label="Puskesmas">{ibu.puskesmasNama}</InfoRow>
              <InfoRow label="Nakes Penanggung Jawab">
                {ibu.nakesPenanggungJawab}
              </InfoRow>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kehamilan &amp; Rencana</CardTitle>
          </CardHeader>
          <CardContent>
            <dl>
              <InfoRow label="HPL">{formatTanggal(ibu.hpl)}</InfoRow>
              <InfoRow label="Usia Kehamilan">
                {ibu.usiaKehamilanMinggu} minggu
              </InfoRow>
              <InfoRow label="Level Risiko">
                {RISK_LABEL[ibu.levelRisiko]}
              </InfoRow>
              <InfoRow label="Status Alur">
                <StatusPill status={ibu.statusAlur} />
              </InfoRow>
              <InfoRow label="Rencana Tempat Bersalin">
                {ibu.rencanaTempatBersalin}
              </InfoRow>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
