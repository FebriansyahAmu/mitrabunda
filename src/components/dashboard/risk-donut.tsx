"use client";

import { Cell, Pie, PieChart } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { RISK_LABEL, RISK_LEVELS, type RiskLevel } from "@/lib/dto/common";
import { formatAngka } from "@/lib/format";

export interface RiskDatum {
  level: RiskLevel;
  jumlah: number;
}

const config: ChartConfig = {
  jumlah: { label: "Ibu" },
  ...Object.fromEntries(
    RISK_LEVELS.map((level) => [
      level,
      { label: RISK_LABEL[level], color: `var(--risk-${level})` },
    ]),
  ),
};

export function RiskDonut({ data }: { data: RiskDatum[] }) {
  const total = data.reduce((sum, d) => sum + d.jumlah, 0);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[220px]">
      <ChartContainer config={config} className="h-full w-full">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent nameKey="level" hideLabel />}
          />
          <Pie
            data={data}
            dataKey="jumlah"
            nameKey="level"
            innerRadius="62%"
            outerRadius="100%"
            paddingAngle={2}
            strokeWidth={2}
          >
            {data.map((d) => (
              <Cell
                key={d.level}
                fill={`var(--risk-${d.level})`}
                stroke="var(--background)"
              />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tabular-nums">
          {formatAngka(total)}
        </span>
        <span className="text-xs text-muted-foreground">Ibu Hamil</span>
      </div>
    </div>
  );
}
