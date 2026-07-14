import { CalendarClock } from "lucide-react";

import { HplCountdown } from "@/components/shared/hpl-countdown";
import { RiskBadge } from "@/components/shared/risk-badge";
import type { IbuHamilDTO } from "@/lib/dto/ibu-hamil";
import { formatTanggalRingkas } from "@/lib/format";

export function SasaranList({ items }: { items: IbuHamilDTO[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
        <CalendarClock className="size-8 text-muted-foreground/40" aria-hidden />
        <p className="text-sm text-muted-foreground">
          Tidak ada sasaran H-30 pada filter ini.
        </p>
      </div>
    );
  }

  return (
    <ul className="-my-1 divide-y">
      {items.map((ibu) => (
        <li key={ibu.id} className="flex items-center gap-3 py-2.5">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{ibu.nama}</p>
            <p className="truncate text-xs text-muted-foreground">
              {ibu.puskesmasNama} · HPL {formatTanggalRingkas(ibu.hpl)}
            </p>
          </div>
          <RiskBadge level={ibu.levelRisiko} />
          <div className="w-12 shrink-0 text-right text-sm">
            <HplCountdown hari={ibu.hariMenujuHpl} />
          </div>
        </li>
      ))}
    </ul>
  );
}
