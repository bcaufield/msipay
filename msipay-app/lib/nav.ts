export type Role = "gc" | "sub" | "owner" | "accounting";

export type NavItem = {
  panel: string;
  icon: string; // lucide-react icon name
  label: string;
  badge?: number;
};

export const roleLabels: Record<Role, string> = {
  gc: "GC / Project Manager",
  sub: "Subcontractor",
  owner: "Owner / Developer",
  accounting: "Accounting / Finance",
};

export const navConfig: Record<Role, NavItem[]> = {
  gc: [
    { panel: "dashboard",       icon: "LayoutDashboard", label: "Dashboard" },
    { panel: "invoices",        icon: "FileText",        label: "Invoices", badge: 2 },
    { panel: "sov",             icon: "Table2",          label: "Schedule of Values" },
    { panel: "lien-waivers",    icon: "ShieldCheck",     label: "Lien Waivers", badge: 1 },
    { panel: "subcontractors",  icon: "Users",           label: "Subcontractors" },
  ],
  sub: [
    { panel: "submit",          icon: "FilePlus",        label: "Submit Invoice" },
    { panel: "invoices",        icon: "FileText",        label: "My Invoices" },
    { panel: "sov",             icon: "Table2",          label: "Schedule of Values" },
    { panel: "lien-waivers",    icon: "ShieldCheck",     label: "Lien Waivers" },
  ],
  owner: [
    { panel: "dashboard",       icon: "LayoutDashboard", label: "Project Summary" },
    { panel: "invoices",        icon: "FileText",        label: "Pay Applications" },
    { panel: "sov",             icon: "Table2",          label: "Schedule of Values" },
  ],
  accounting: [
    { panel: "dashboard",       icon: "LayoutDashboard", label: "Payables Dashboard" },
    { panel: "invoices",        icon: "FileText",        label: "Approved Invoices" },
    { panel: "liens",           icon: "ShieldCheck",     label: "Lien Tracker" },
  ],
};

export const panelTitles: Record<string, string> = {
  "gc/dashboard":       "Invoice Dashboard",
  "gc/invoices":        "Invoice Review",
  "gc/sov":             "Schedule of Values",
  "gc/lien-waivers":    "Lien Waiver Tracker",
  "gc/subcontractors":  "Subcontractor Management",
  "sub/submit":         "Submit Pay Application",
  "sub/invoices":       "My Invoices",
  "sub/sov":            "Schedule of Values",
  "sub/lien-waivers":   "My Lien Waivers",
  "owner/dashboard":    "Project Summary",
  "owner/invoices":     "Pay Applications",
  "owner/sov":          "Schedule of Values",
  "accounting/dashboard": "Payables Dashboard",
  "accounting/invoices":  "Approved Invoices for Payment",
  "accounting/liens":     "Lien Waiver Tracker",
};

export function isRole(s: string): s is Role {
  return s === "gc" || s === "sub" || s === "owner" || s === "accounting";
}
