// Mock data — ported verbatim from prototype-MSIpay.html.
// Replace with real Postgres-backed queries in production.

export type InvoiceStatus = "pending" | "review" | "approved" | "rejected" | "draft";
export type LienStatus = "received" | "outstanding";
export type SubStatus = "active" | "complete";

export type Invoice = {
  id: string;
  sub: string;
  trade: string;
  contract: string;
  billed: string;
  pct: number;
  status: InvoiceStatus;
  period: string;
  project: string;
  lienStatus: LienStatus;
  draw: number;
};

export type Subcontractor = {
  name: string;
  trade: string;
  contract: string;
  billed: string;
  pct: number;
  active: number;
  status: SubStatus;
};

export type SovLine = {
  num: string;
  desc: string;
  value: number;
  prev: number;
  curr: number;
  stored: number;
};

export type Waiver = {
  sub: string;
  draw: number;
  type: "Conditional" | "Unconditional";
  amount: string;
  status: LienStatus;
  date: string;
};

export const invoices: Invoice[] = [
  { id: "INV-0041", sub: "Coastal Electric",   trade: "Electrical", contract: "$184,000", billed: "$92,000", pct: 50, status: "pending",  period: "Apr 2026", project: "Palm Beach Warehouse Ph.1", lienStatus: "outstanding", draw: 4 },
  { id: "INV-0040", sub: "SunState Plumbing",  trade: "Plumbing",   contract: "$97,500",  billed: "$29,250", pct: 30, status: "review",   period: "Apr 2026", project: "Palm Beach Warehouse Ph.1", lienStatus: "received",    draw: 4 },
  { id: "INV-0039", sub: "Dade Drywall",       trade: "Drywall",    contract: "$62,000",  billed: "$46,500", pct: 75, status: "approved", period: "Mar 2026", project: "Palm Beach Warehouse Ph.1", lienStatus: "received",    draw: 3 },
  { id: "INV-0038", sub: "Tropical HVAC",      trade: "HVAC",       contract: "$143,000", billed: "$57,200", pct: 40, status: "approved", period: "Mar 2026", project: "Palm Beach Warehouse Ph.1", lienStatus: "received",    draw: 3 },
  { id: "INV-0037", sub: "Coastal Electric",   trade: "Electrical", contract: "$184,000", billed: "$55,200", pct: 30, status: "approved", period: "Feb 2026", project: "Palm Beach Warehouse Ph.1", lienStatus: "received",    draw: 2 },
  { id: "INV-0036", sub: "SunState Plumbing",  trade: "Plumbing",   contract: "$97,500",  billed: "$9,750",  pct: 10, status: "rejected", period: "Feb 2026", project: "Palm Beach Warehouse Ph.1", lienStatus: "outstanding", draw: 2 },
];

export const subs: Subcontractor[] = [
  { name: "Coastal Electric",   trade: "Electrical", contract: "$184,000", billed: "$147,200", pct: 80,  active: 2, status: "active" },
  { name: "SunState Plumbing",  trade: "Plumbing",   contract: "$97,500",  billed: "$39,000",  pct: 40,  active: 1, status: "active" },
  { name: "Dade Drywall",       trade: "Drywall",    contract: "$62,000",  billed: "$46,500",  pct: 75,  active: 0, status: "active" },
  { name: "Tropical HVAC",      trade: "HVAC",       contract: "$143,000", billed: "$57,200",  pct: 40,  active: 1, status: "active" },
  { name: "Boca Concrete",      trade: "Concrete",   contract: "$88,000",  billed: "$88,000",  pct: 100, active: 0, status: "complete" },
];

export const sov: SovLine[] = [
  { num: "01", desc: "Site Work & Mobilization", value: 48000,  prev: 48000, curr: 0,     stored: 0 },
  { num: "02", desc: "Concrete Foundation",       value: 88000,  prev: 88000, curr: 0,     stored: 0 },
  { num: "03", desc: "Structural Steel",          value: 124000, prev: 96000, curr: 0,     stored: 0 },
  { num: "04", desc: "Electrical Rough-In",       value: 92000,  prev: 55200, curr: 36800, stored: 0 },
  { num: "05", desc: "Plumbing Rough-In",         value: 48750,  prev: 9750,  curr: 19500, stored: 0 },
  { num: "06", desc: "Drywall & Framing",         value: 62000,  prev: 31000, curr: 15500, stored: 0 },
  { num: "07", desc: "HVAC Equipment",            value: 143000, prev: 57200, curr: 0,     stored: 0 },
  { num: "08", desc: "Roofing",                   value: 76000,  prev: 0,     curr: 0,     stored: 0 },
  { num: "09", desc: "Finishes & Painting",       value: 41000,  prev: 0,     curr: 0,     stored: 0 },
  { num: "10", desc: "Sitework & Paving",         value: 55000,  prev: 0,     curr: 0,     stored: 0 },
];

export const waivers: Waiver[] = [
  { sub: "Coastal Electric",  draw: 3, type: "Conditional",   amount: "$55,200", status: "received",    date: "Mar 28, 2026" },
  { sub: "Dade Drywall",      draw: 3, type: "Conditional",   amount: "$15,500", status: "received",    date: "Mar 28, 2026" },
  { sub: "Tropical HVAC",     draw: 3, type: "Conditional",   amount: "$57,200", status: "received",    date: "Mar 29, 2026" },
  { sub: "SunState Plumbing", draw: 3, type: "Conditional",   amount: "$19,500", status: "received",    date: "Mar 28, 2026" },
  { sub: "Coastal Electric",  draw: 4, type: "Conditional",   amount: "$92,000", status: "outstanding", date: "—" },
  { sub: "SunState Plumbing", draw: 2, type: "Unconditional", amount: "$9,750",  status: "outstanding", date: "—" },
  { sub: "Boca Concrete",     draw: 1, type: "Unconditional", amount: "$88,000", status: "received",    date: "Jan 15, 2026" },
];

export const fmt = (n: number) => "$" + Number(n).toLocaleString();

export const statusLabels: Record<string, string> = {
  pending: "Pending Review",
  review: "In Review",
  approved: "Approved",
  rejected: "Rejected",
  draft: "Draft",
  received: "Received",
  outstanding: "Outstanding",
  active: "Active",
  complete: "Complete",
};
