import { Check, Play, X, RotateCcw } from "lucide-react";
import type { InvoiceStatus } from "@/lib/data";
import {
  startReview,
  approveInvoice,
  rejectInvoice,
  reopenInvoice,
} from "@/app/actions/invoices";

// GC-facing review controls. Rendered in the dashboard and invoices table; each
// button is a form posting to a server action that mutates Postgres.
export function InvoiceActions({
  id,
  status,
}: {
  id: string;
  status: InvoiceStatus;
}) {
  if (status === "pending") {
    return (
      <div className="flex items-center gap-1.5">
        <ActionButton id={id} action={startReview} className="btn btn-primary btn-sm">
          <Play size={12} /> Start review
        </ActionButton>
        <ActionButton id={id} action={rejectInvoice} className="btn btn-sm btn-danger">
          <X size={12} /> Reject
        </ActionButton>
      </div>
    );
  }

  if (status === "review") {
    return (
      <div className="flex items-center gap-1.5">
        <ActionButton id={id} action={approveInvoice} className="btn btn-primary btn-sm">
          <Check size={12} /> Approve
        </ActionButton>
        <ActionButton id={id} action={rejectInvoice} className="btn btn-sm btn-danger">
          <X size={12} /> Reject
        </ActionButton>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <ActionButton id={id} action={reopenInvoice} className="btn btn-sm">
        <RotateCcw size={12} /> Reopen
      </ActionButton>
    );
  }

  if (status === "approved") {
    return <span className="text-xs text-fg-tertiary">Approved · awaiting payment</span>;
  }

  if (status === "paid") {
    return <span className="text-xs text-fg-tertiary">Paid</span>;
  }

  return <span className="text-xs text-fg-tertiary">—</span>;
}

function ActionButton({
  id,
  action,
  className,
  children,
}: {
  id: string;
  action: (formData: FormData) => Promise<void>;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={className}>
        {children}
      </button>
    </form>
  );
}
