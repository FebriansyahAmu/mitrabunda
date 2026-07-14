"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RISK_LABEL, RISK_LEVELS, type RiskLevel } from "@/lib/dto/common";
import type { PuskesmasDTO } from "@/lib/dto/puskesmas";

export interface DashboardFilterState {
  q: string;
  puskesmasId: string;
  risk: string;
}

export function DashboardFilters({
  puskesmas,
  value,
  onChange,
}: {
  puskesmas: PuskesmasDTO[];
  value: DashboardFilterState;
  onChange: (next: DashboardFilterState) => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative sm:max-w-xs sm:flex-1">
        <Search
          className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={value.q}
          onChange={(e) => onChange({ ...value, q: e.target.value })}
          placeholder="Cari nama ibu…"
          className="pl-8"
          aria-label="Cari nama ibu"
        />
      </div>

      <Select
        value={value.puskesmasId}
        onValueChange={(v) => onChange({ ...value, puskesmasId: v as string })}
      >
        <SelectTrigger className="w-full sm:w-[190px]" aria-label="Filter Puskesmas">
          <SelectValue>
            {(v: string) =>
              v === "all"
                ? "Semua Puskesmas"
                : (puskesmas.find((p) => p.id === v)?.nama ?? "Puskesmas")
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

      <Select
        value={value.risk}
        onValueChange={(v) => onChange({ ...value, risk: v as string })}
      >
        <SelectTrigger className="w-full sm:w-[170px]" aria-label="Filter level risiko">
          <SelectValue>
            {(v: string) =>
              v === "all" ? "Semua Risiko" : RISK_LABEL[v as RiskLevel]
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Risiko</SelectItem>
          {RISK_LEVELS.map((level) => (
            <SelectItem key={level} value={level}>
              {RISK_LABEL[level]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
