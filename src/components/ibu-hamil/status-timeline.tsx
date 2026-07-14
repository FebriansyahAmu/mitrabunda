import { Check } from "lucide-react";

import { STATUS_ALUR_LABEL, type StatusAlur } from "@/lib/dto/common";
import { cn } from "@/lib/utils";

const ORDER: StatusAlur[] = [
  "intake",
  "pendampingan",
  "administrasi",
  "skrining",
  "perencanaan",
  "rujukan",
  "persalinan",
  "nifas",
  "selesai",
];

export function StatusTimeline({ current }: { current: StatusAlur }) {
  const currentIndex = ORDER.indexOf(current);

  return (
    <ol className="flex gap-1 overflow-x-auto pb-1">
      {ORDER.map((s, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <li
            key={s}
            className="flex min-w-14 flex-1 flex-col items-center gap-1.5 text-center"
          >
            <div className="flex w-full items-center">
              <span
                className={cn(
                  "h-0.5 flex-1",
                  i === 0 ? "bg-transparent" : done || active ? "bg-primary" : "bg-border",
                )}
              />
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-medium",
                  done
                    ? "border-primary bg-primary text-primary-foreground"
                    : active
                      ? "border-primary text-primary ring-2 ring-primary/20"
                      : "border-input text-muted-foreground",
                )}
              >
                {done ? <Check className="size-3" aria-hidden /> : i + 1}
              </span>
              <span
                className={cn(
                  "h-0.5 flex-1",
                  i === ORDER.length - 1
                    ? "bg-transparent"
                    : done
                      ? "bg-primary"
                      : "bg-border",
                )}
              />
            </div>
            <span
              className={cn(
                "text-[11px] leading-tight",
                active ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              {STATUS_ALUR_LABEL[s]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
