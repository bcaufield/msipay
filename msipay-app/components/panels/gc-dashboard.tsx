import Link from "next/link";
import { getInvoices } from "@/lib/data";
import { StatusBadge } from "@/components/badge";
import { InvoiceActions } from "@/components/invoice-actions";

export async function GCDashboard() {
  const invoices = await getInvoices();
  const pending = invoices.filter((i) => i.status === "pending" || i.status === "review");
  const lienOut = invoices.filter((i) => i.lienStatus === "outstanding").length;
  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-4">
        <Metric label="Total contract value" value="$572K" sub="Palm Beach Warehouse Ph.1" />
        <Metric label="Billed to date" value="$331K" sub="58% of contract" />
        <Metric label="Pending invoices" value={String(pending.length)} sub="Awaiting action" />
        <Metric label="Lien waivers outstanding" value={String(lienOut)} sub="Require follow-up" />
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-medium">Overall project completion</div>
          <span className="text-xs text-fg-secondary">Draw 4 — April 2026</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="progress flex-1" style={{ height: 8 }}>
            <div className="progress-fill" style={{ width: "58%" }} />
          </div>
          <span className="text-[13px] font-medium">58%</span>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-medium">Invoices awaiting review</div>
          <Link href="/gc/invoices" className="btn btn-sm">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="data">
            <thead>
              <tr>
                <th>Invoice</th><th>Subcontractor</th><th>Trade</th>
                <th>Amount</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((inv) => (
                <tr key={inv.id}>
                  <td className="font-medium">{inv.id}</td>
                  <td>{inv.sub}</td>
                  <td className="text-fg-secondary">{inv.trade}</td>
                  <td className="font-medium">{inv.billed}</td>
                  <td><StatusBadge status={inv.status} /></td>
                  <td><InvoiceActions id={inv.id} status={inv.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-bg-secondary rounded-lg px-3.5 py-3">
      <div className="text-[11px] text-fg-secondary mb-1">{label}</div>
      <div className="text-[22px] font-medium">{value}</div>
      {sub ? <div className="text-[11px] text-fg-secondary mt-0.5">{sub}</div> : null}
    </div>
  );
}

GCDashboard.Metric = Metric;
export { Metric };
