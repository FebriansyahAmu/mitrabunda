import { cn } from "@/lib/utils";
import { RISK_LABEL, type RiskLevel } from "@/lib/dto/common";

const styles: Record<RiskLevel, string> = {
  "rendah": "bg-risk-rendah/12 text-risk-rendah border-risk-rendah/25",
  "sedang": "bg-risk-sedang/12 text-risk-sedang border-risk-sedang/25",
  "tinggi": "bg-risk-tinggi/12 text-risk-tinggi border-risk-tinggi/25",
  "sangat-tinggi":
    "bg-risk-sangat-tinggi/12 text-risk-sangat-tinggi border-risk-sangat-tinggi/25",
};

/**
 * Badge level risiko. Tidak mengandalkan warna saja — selalu ada titik + label
 * teks, sehingga tetap terbaca untuk pengguna dengan defisiensi warna.
 */
export function RiskBadge({
  level,
  className,
}: {
  level: RiskLevel;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        styles[level],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {RISK_LABEL[level]}
    </span>
  );
}
