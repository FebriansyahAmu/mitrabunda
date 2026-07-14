import { cn } from "@/lib/utils";

/**
 * Menampilkan hitung mundur ke HPL dalam notasi domain: H-30, "Hari ini", H+3.
 * Warna menegaskan urgensi (≤7 hari kritis) — bukan satu-satunya penanda.
 */
export function HplCountdown({
  hari,
  className,
}: {
  hari: number;
  className?: string;
}) {
  const label =
    hari < 0 ? `H+${Math.abs(hari)}` : hari === 0 ? "Hari ini" : `H-${hari}`;

  const tone =
    hari < 0
      ? "text-muted-foreground"
      : hari <= 7
        ? "text-risk-sangat-tinggi"
        : hari <= 14
          ? "text-risk-tinggi"
          : hari <= 30
            ? "text-risk-sedang"
            : "text-muted-foreground";

  return (
    <span className={cn("font-medium tabular-nums", tone, className)}>
      {label}
    </span>
  );
}
