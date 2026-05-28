import { statusLabels } from "@/lib/data";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`badge badge-${status}`}>
      {statusLabels[status] ?? status}
    </span>
  );
}
