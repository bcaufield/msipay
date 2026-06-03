import { Check, RotateCcw } from "lucide-react";
import { getWaivers } from "@/lib/data";
import { StatusBadge } from "@/components/badge";
import { Metric } from "./gc-dashboard";
import { markWaiverReceived, markWaiverOutstanding } from "@/app/actions/waivers";

export async function LienWaivers() {
  const waivers = await getWaivers();
  const received = waivers.filter((w) => w.status === "received").length;
  const outstanding = waivers.filter((w) => w.status === "outstanding").length;
  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <Metric label="Waivers received" value={String(received)} />
        <Metric label="Outstanding" value={String(outstanding)} />
        <Metric label="Payment holds" value="2 subs" sub="Blocked pending waiver" />
      </div>
      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-medium">Lien waiver log</div>
        </div>
        <div className="overflow-x-auto">
          <table className="data">
            <thead>
              <tr>
                <th>Subcontractor</th><th>Draw</th><th>Type</th>
                <th>Amount</th><th>Date received</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {waivers.map((w) => (
                <tr key={w.id}>
                  <td>{w.sub}</td>
                  <td className="text-fg-secondary">Draw {w.draw}</td>
                  <td className="text-fg-secondary">{w.type}</td>
                  <td className="font-medium">{w.amount}</td>
                  <td className="text-fg-secondary text-xs">{w.date}</td>
                  <td><StatusBadge status={w.status} /></td>
                  <td>
                    {w.status === "outstanding" ? (
                      <form action={markWaiverReceived}>
                        <input type="hidden" name="id" value={w.id} />
                        <button type="submit" className="btn btn-primary btn-sm">
                          <Check size={12} /> Mark received
                        </button>
                      </form>
                    ) : (
                      <form action={markWaiverOutstanding}>
                        <input type="hidden" name="id" value={w.id} />
                        <button type="submit" className="btn btn-sm">
                          <RotateCcw size={12} /> Mark outstanding
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
