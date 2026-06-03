import { Check, Plus, Upload, Eye, CircleCheck } from "lucide-react";
import { getInvoices } from "@/lib/data";
import { StatusBadge } from "@/components/badge";

export function SubmitInvoice() {
  return (
    <div style={{ maxWidth: 680 }}>
      <StepIndicator />
      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-medium">Pay application — Draw 4</div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Project" value="Palm Beach Warehouse Ph.1" readOnly />
          <Field label="Application #" value="4" readOnly />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Period from" type="date" value="2026-04-01" />
          <Field label="Period to" type="date" value="2026-04-30" />
        </div>
        <Divider />
        <div className="text-sm font-medium mb-3">Schedule of values — this draw</div>
        <table className="sov">
          <thead>
            <tr>
              <th>#</th><th>Description</th><th>Contract value</th>
              <th>Prev. completed</th><th>This period</th><th>Total</th><th>%</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>01</td><td>Electrical rough-in</td><td>$92,000</td><td>$55,200</td><td><input className="input" style={{ width: 90, padding: "4px 6px", fontSize: 12 }} defaultValue="36,800" /></td><td className="text-brand font-medium">$92,000</td><td>100%</td></tr>
            <tr><td>02</td><td>Panel installation</td><td>$52,000</td><td>$0</td><td><input className="input" style={{ width: 90, padding: "4px 6px", fontSize: 12 }} defaultValue="0" /></td><td>$0</td><td>0%</td></tr>
            <tr><td>03</td><td>Final trim &amp; devices</td><td>$40,000</td><td>$0</td><td><input className="input" style={{ width: 90, padding: "4px 6px", fontSize: 12 }} defaultValue="0" /></td><td>$0</td><td>0%</td></tr>
            <tr className="total"><td colSpan={4}>This draw total</td><td className="text-brand font-medium">$36,800</td><td colSpan={2}></td></tr>
          </tbody>
        </table>
        <Divider />
        <div className="mb-2">
          <div className="text-xs text-fg-secondary mb-1">Notes</div>
          <textarea className="input w-full" rows={3} placeholder="Describe scope completed, attach backup..." />
        </div>
        <div className="flex gap-2 mt-2">
          <button className="btn">Save draft</button>
          <button className="btn btn-primary">Next: attach lien waiver →</button>
        </div>
      </div>
    </div>
  );
}

function StepIndicator() {
  const steps = [
    { num: 1, label: "Contract info", state: "done" },
    { num: 2, label: "Line items", state: "active" },
    { num: 3, label: "Lien waiver", state: "" },
    { num: 4, label: "Submit", state: "" },
  ];
  return (
    <div className="flex items-center mb-5">
      {steps.map((s, i) => (
        <div key={s.num} className="flex items-center flex-1 last:flex-none">
          <div className={`flex items-center gap-1.5 text-xs ${
            s.state === "done" ? "text-brand"
              : s.state === "active" ? "text-fg-primary font-medium"
              : "text-fg-tertiary"
          }`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              s.state === "done" ? "bg-[#EAF3DE] border border-brand text-brand"
                : s.state === "active" ? "bg-brand text-white border border-brand"
                : "bg-bg-secondary border border-border"
            }`}>
              {s.state === "done" ? <Check size={10} /> : s.num}
            </div>
            {s.label}
          </div>
          {i < steps.length - 1 && <div className="flex-1 h-px bg-border-subtle mx-1.5" />}
        </div>
      ))}
    </div>
  );
}

function Field({
  label,
  value,
  readOnly,
  type = "text",
}: {
  label: string;
  value: string;
  readOnly?: boolean;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-fg-secondary">{label}</div>
      <input className="input" type={type} defaultValue={value} readOnly={readOnly} />
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-border-subtle my-4" />;
}

export async function SubInvoices() {
  const invoices = await getInvoices();
  const mine = invoices.filter((i) => i.sub === "Coastal Electric");
  return (
    <div>
      <div className="alert alert-success flex items-center gap-1.5">
        <CircleCheck size={14} />
        INV-0039 was approved Mar 30. Payment expected within 5 business days.
      </div>
      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-medium">Coastal Electric — invoice history</div>
          <button className="btn btn-primary btn-sm"><Plus size={12} /> New application</button>
        </div>
        <div className="overflow-x-auto">
          <table className="data">
            <thead>
              <tr>
                <th>Invoice</th><th>Draw</th><th>Period</th><th>Amount</th>
                <th>% Complete</th><th>Lien waiver</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mine.map((inv) => (
                <tr key={inv.id}>
                  <td className="font-medium font-mono text-xs">{inv.id}</td>
                  <td>Draw {inv.draw}</td>
                  <td>{inv.period}</td>
                  <td className="font-medium">{inv.billed}</td>
                  <td>{inv.pct}%</td>
                  <td><StatusBadge status={inv.lienStatus} /></td>
                  <td><StatusBadge status={inv.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function SubLienWaivers() {
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm font-medium">Lien waivers — Coastal Electric</div>
        <button className="btn btn-primary btn-sm"><Upload size={12} /> Upload waiver</button>
      </div>
      <div className="alert alert-warning">
        Draw 4 conditional lien waiver required before payment is released.
      </div>
      <div className="overflow-x-auto">
        <table className="data">
          <thead>
            <tr>
              <th>Draw</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th><th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Draw 4</td><td>Conditional</td><td>$92,000</td>
              <td><StatusBadge status="outstanding" /></td><td>—</td>
              <td><button className="btn btn-primary btn-sm"><Upload size={12} /> Upload</button></td>
            </tr>
            <tr>
              <td>Draw 3</td><td>Conditional</td><td>$55,200</td>
              <td><StatusBadge status="received" /></td><td>Mar 28, 2026</td>
              <td><button className="btn btn-sm"><Eye size={12} /> View</button></td>
            </tr>
            <tr>
              <td>Draw 2</td><td>Conditional</td><td>$37,000</td>
              <td><StatusBadge status="received" /></td><td>Feb 14, 2026</td>
              <td><button className="btn btn-sm"><Eye size={12} /> View</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
