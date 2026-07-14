"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface PuskesmasDatum {
  nama: string;
  jumlah: number;
}

const config: ChartConfig = {
  jumlah: { label: "Ibu Hamil", color: "var(--chart-1)" },
};

export function PuskesmasBar({ data }: { data: PuskesmasDatum[] }) {
  return (
    <ChartContainer config={config} className="h-[220px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{ left: 0, right: 28, top: 4, bottom: 4 }}
      >
        <XAxis type="number" dataKey="jumlah" hide />
        <YAxis
          type="category"
          dataKey="nama"
          tickLine={false}
          axisLine={false}
          width={96}
          tick={{ fontSize: 12 }}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="jumlah" fill="var(--color-jumlah)" radius={4} barSize={20}>
          <LabelList
            dataKey="jumlah"
            position="right"
            offset={8}
            className="fill-muted-foreground"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
