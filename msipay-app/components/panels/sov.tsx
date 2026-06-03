import { getSov, fmt } from "@/lib/data";

export async function SOV() {
  const sov = await getSov();
  const tv = sov.reduce((a, r) => a + r.value, 0);
  const tp = sov.reduce((a, r) => a + r.prev, 0);
  const tc = sov.reduce((a, r) => a + r.curr, 0);
  const total = tp + tc;
  const ret = Math.round(total * 0.10);

  return (
    <div className="card !p-0 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border-subtle flex justify-between items-center">
        <div className="text-sm font-medium">AIA G702/G703 — Schedule of Values</div>
        <div className="text-xs text-fg-secondary">
          Palm Beach Warehouse Ph.1 · Draw 4 · April 2026
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="sov">
          <thead>
            <tr>
              <th style={{ width: 36 }}>#</th>
              <th>Description</th>
              <th>Scheduled value</th>
              <th>Prev. completed</th>
              <th>This period</th>
              <th>Stored</th>
              <th>Total completed</th>
              <th>% Complete</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {sov.map((r) => {
              const comp = r.prev + r.curr + r.stored;
              const pct = Math.round((comp / r.value) * 100);
              return (
                <tr key={r.num}>
                  <td>{r.num}</td>
                  <td>{r.desc}</td>
                  <td>{fmt(r.value)}</td>
                  <td>{fmt(r.prev)}</td>
                  <td>
                    {r.curr > 0 ? (
                      <span className="text-brand font-medium">{fmt(r.curr)}</span>
                    ) : (
                      fmt(r.curr)
                    )}
                  </td>
                  <td>{fmt(r.stored)}</td>
                  <td>{fmt(comp)}</td>
                  <td>
                    <div className="flex items-center gap-1 justify-end">
                      <div className="progress" style={{ width: 50 }}>
                        <div className="progress-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[11px]">{pct}%</span>
                    </div>
                  </td>
                  <td>{fmt(r.value - comp)}</td>
                </tr>
              );
            })}
            <tr className="total">
              <td colSpan={2}>Totals</td>
              <td>{fmt(tv)}</td>
              <td>{fmt(tp)}</td>
              <td>{fmt(tc)}</td>
              <td>$0</td>
              <td>{fmt(total)}</td>
              <td>{Math.round((total / tv) * 100)}%</td>
              <td>{fmt(tv - total)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3.5 border-t border-border-subtle flex gap-6">
        <div>
          <span className="text-xs text-fg-secondary">Retainage (10%): </span>
          <span className="text-[13px] font-medium">{fmt(ret)}</span>
        </div>
        <div>
          <span className="text-xs text-fg-secondary">Net payment due: </span>
          <span className="text-[13px] font-medium text-brand">{fmt(tc - ret)}</span>
        </div>
      </div>
    </div>
  );
}
