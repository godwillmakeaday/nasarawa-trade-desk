import { humanizeStatus, statusTone } from "@/lib/workflow";
import type { WorkflowStatus } from "@/types";

export function StatusPill({ status }: { status: WorkflowStatus }) {
  return (
    <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-black ring-1 ${statusTone[status]}`}>
      {humanizeStatus(status)}
    </span>
  );
}
