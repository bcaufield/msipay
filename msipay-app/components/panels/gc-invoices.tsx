import { Info } from "lucide-react";
import { getInvoices } from "@/lib/data";
import { StatusBadge } from "@/components/badge";
import { InvoiceActions } from "@/components/invoice-actions";

export async function GCInvoices() {
  const invoices = await getInvoices();
  return (
    <div>
      <div className="alert alert-info flex items-center gap-1.5">
        <Info size={14} />
        <span><strong>2 invoices</strong> require your review before the Draw 4 payment window closes.</span>
      </div>
      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-medium">All invoices — Draw 4 · Palm Beach Warehouse</div>
        </div>
        <div className="overflow-x-auto">
          <table className="data">
            <thead>
              <tr>
                <th>Invoice #</th><th>Subcontractor</th><th>Trade</th><th>Period</th>
                <th>Contract</th><th>This draw</th><th>% Comp.</th>
                <th>Lien waiver</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="font-medium font-mono text-xs">{inv.id}</td>
                  <td>{inv.sub}</td>
                  <td className="text-fg-secondary">{inv.trade}</td>
                  <td className="text-fg-secondary">{inv.period}</td>
                  <td>{inv.contract}</td>
                  <td className="font-medium">{inv.billed}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <div className="progress" style={{ width: 60 }}>
                        <div className="progress-fill" style={{ width: `${inv.pct}%` }} />
                      </div>
                      <span className="text-[11px] text-fg-secondary">{inv.pct}%</span>
                    </div>
                  </td>
                  <td><StatusBadge status={inv.lienStatus} /></td>
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
