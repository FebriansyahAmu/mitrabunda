import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatAngka } from "@/lib/format";

export interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  /** Persentase perubahan vs periode sebelumnya. */
  delta?: number;
  deltaLabel?: string;
  hint?: string;
  accentClassName?: string;
  /** Untuk metrik yang "naik = buruk" (mis. risiko tinggi). */
  invertDelta?: boolean;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaLabel = "vs bln lalu",
  hint,
  accentClassName,
  invertDelta = false,
}: StatCardProps) {
  const hasDelta = typeof delta === "number";
  const up = (delta ?? 0) >= 0;
  const good = hasDelta ? (invertDelta ? !up : up) : false;
  const Arrow = up ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="transition-shadow hover:shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg",
              accentClassName ?? "bg-primary/10 text-primary",
            )}
          >
            <Icon className="size-5" aria-hidden />
          </div>
        </div>

        <div className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">
          {typeof value === "number" ? formatAngka(value) : value}
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-xs">
          {hasDelta ? (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium",
                good
                  ? "bg-risk-rendah/12 text-risk-rendah"
                  : "bg-risk-sangat-tinggi/12 text-risk-sangat-tinggi",
              )}
            >
              <Arrow className="size-3" aria-hidden />
              {Math.abs(delta as number)}%
            </span>
          ) : null}
          <span className="truncate text-muted-foreground">
            {hint ?? deltaLabel}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
