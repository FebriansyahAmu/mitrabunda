"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { TrenBulanan } from "@/lib/mock/tren";

const config: ChartConfig = {
  registrasi: { label: "Registrasi", color: "var(--chart-1)" },
  persalinan: { label: "Persalinan", color: "var(--chart-2)" },
};

export function TrenArea({ data }: { data: TrenBulanan[] }) {
  return (
    <ChartContainer config={config} className="h-[240px] w-full">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ left: -12, right: 8, top: 8, bottom: 0 }}
      >
        <defs>
          <linearGradient id="fillRegistrasi" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-registrasi)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--color-registrasi)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="fillPersalinan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-persalinan)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--color-persalinan)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="bulan" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={32} tickMargin={4} />
        <ChartTooltip cursor content={<ChartTooltipContent indicator="dot" />} />
        <Area
          dataKey="registrasi"
          type="monotone"
          stroke="var(--color-registrasi)"
          fill="url(#fillRegistrasi)"
          strokeWidth={2}
        />
        <Area
          dataKey="persalinan"
          type="monotone"
          stroke="var(--color-persalinan)"
          fill="url(#fillPersalinan)"
          strokeWidth={2}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}
