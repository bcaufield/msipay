import { getSubcontractors } from "@/lib/data";
import { StatusBadge } from "@/components/badge";
import { Metric } from "./gc-dashboard";

export async function Subcontractors() {
  const subs = await getSubcontractors();
  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-4">
        <Metric label="Active subs" value="4" />
        <Metric label="Completed" value="1" />
        <Metric label="Total contracted" value="$574.5K" />
        <Metric label="Invoiced to date" value="$377.9K" />
      </div>
      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-medium">Subcontractor roster</div>
        </div>
        <div className="overflow-x-auto">
          <table className="data">
            <thead>
              <tr>
                <th>Company</th><th>Trade</th><th>Contract</th><th>Billed</th>
                <th>Progress</th><th>Active inv.</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => {
                const initials = s.name.split(" ").map((w) => w[0]).join("").slice(0, 2);
                return (
                  <tr key={s.name}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium" style={{ background: "#E1F5EE", color: "#0F6E56" }}>
                          {initials}
                        </div>
                        <span className="font-medium">{s.name}</span>
                      </div>
                    </td>
                    <td className="text-fg-secondary">{s.trade}</td>
                    <td>{s.contract}</td>
                    <td>{s.billed}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <div className="progress" style={{ width: 80 }}>
                          <div className="progress-fill" style={{ width: `${s.pct}%` }} />
                        </div>
                        <span className="text-[11px] text-fg-secondary">{s.pct}%</span>
                      </div>
                    </td>
                    <td className="text-center">{s.active}</td>
                    <td><StatusBadge status={s.status} /></td>
                    <td><button className="btn btn-sm">Details</button></td>
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
