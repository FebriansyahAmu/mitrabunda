import { Badge } from "@/components/ui/badge";
import { STATUS_ALUR_LABEL, type StatusAlur } from "@/lib/dto/common";

export function StatusPill({ status }: { status: StatusAlur }) {
  return (
    <Badge variant="secondary" className="font-normal">
      {STATUS_ALUR_LABEL[status]}
    </Badge>
  );
}
