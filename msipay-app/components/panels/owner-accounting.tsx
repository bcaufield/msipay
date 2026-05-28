import { invoices, fmt } from "@/lib/data";
import { StatusBadge } from "@/components/badge";
import { Metric } from "./gc-dashboard";

export function OwnerDashboard() {
  const milestones: [string, string][] = [
    ["Site work & concrete", "100%"],
    ["Structural steel", "77%"],
    ["MEP rough-in", "51%"],
    ["Drywall & envelope", "75%"],
    ["Finishes & closeout", "0%"],
  ];
  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-4">
        <Metric label="Total project budget" value="$572K" />
        <Metric label="Approved & paid" value="$245K" sub="Draws 1–3 certified" />
        <Metric label="Pending draw 4" value="$148K" sub="Awaiting GC cert." />
        <Metric label="Retainage held" value="$33K" />
      </div>
      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-medium">Project milestone progress</div>
        </div>
        {milestones.map(([label, pct]) => (
          <div key={label} className="mb-2.5">
            <div className="flex justify-between text-xs mb-1">
              <span>{label}</span>
              <span className="text-fg-secondary">{pct}</span>
            </div>
            <div className="progress">
              <div className="progress-fill" style={{ width: pct }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OwnerInvoices() {
  const cert = invoices.filter((i) => i.status === "approved");
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm font-medium">Certified pay applications</div>
      </div>
      <div className="overflow-x-auto">
        <table className="data">
          <thead>
            <tr>
              <th>Invoice</th><th>Subcontractor</th><th>Draw</th>
              <th>Certified amount</th><th>Retainage</th><th>Net due</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {cert.map((inv) => {
              const amt = parseFloat(inv.billed.replace(/[$,]/g, ""));
              const ret = Math.round(amt * 0.10);
              return (
                <tr key={inv.id}>
                  <td className="font-medium">{inv.id}</td>
                  <td>{inv.sub}</td>
                  <td>Draw {inv.draw}</td>
                  <td>{inv.billed}</td>
                  <td style={{ color: "#854F0B" }}>{fmt(ret)}</td>
                  <td className="font-medium text-brand">{fmt(amt - ret)}</td>
                  <td><StatusBadge status={inv.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AccountingDashboard() {
  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-4">
        <Metric label="Ready to pay" value="4" sub="Approved, lien waiver on file" />
        <Metric label="Total payable" value="$163K" />
        <Metric label="Held — lien waiver" value="2" />
        <Metric label="Retainage withheld" value="$16.3K" />
      </div>
      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-medium">Payment queue</div>
        </div>
        <div className="overflow-x-auto">
          <table className="data">
            <thead>
              <tr>
                <th>Invoice</th><th>Payee</th><th>Gross</th><th>Retainage</th>
                <th>Net payment</th><th>Lien waiver</th><th>Release</th>
              </tr>
            </thead>
            <tbody>
              {invoices.filter((i) => i.status === "approved").map((inv) => {
                const amt = parseFloat(inv.billed.replace(/[$,]/g, ""));
                const ret = Math.round(amt * 0.10);
                return (
                  <tr key={inv.id}>
                    <td className="font-medium font-mono text-xs">{inv.id}</td>
                    <td>{inv.sub}</td>
                    <td>{inv.billed}</td>
                    <td style={{ color: "#854F0B" }}>{fmt(ret)}</td>
                    <td className="font-medium text-brand">{fmt(amt - ret)}</td>
                    <td><StatusBadge status={inv.lienStatus} /></td>
                    <td>
                      {inv.lienStatus === "received" ? (
                        <button className="btn btn-primary btn-sm">Release payment</button>
                      ) : (
                        <span className="text-xs text-fg-tertiary">Blocked</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
