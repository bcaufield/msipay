import { notFound } from "next/navigation";
import { isRole } from "@/lib/nav";
import { GCDashboard } from "@/components/panels/gc-dashboard";
import { GCInvoices } from "@/components/panels/gc-invoices";
import { SOV } from "@/components/panels/sov";
import { LienWaivers } from "@/components/panels/lien-waivers";
import { Subcontractors } from "@/components/panels/subcontractors";
import { SubmitInvoice, SubInvoices, SubLienWaivers } from "@/components/panels/sub-panels";
import {
  OwnerDashboard,
  OwnerInvoices,
  AccountingDashboard,
} from "@/components/panels/owner-accounting";

type PanelKey = `${string}/${string}`;

const registry: Record<PanelKey, React.ComponentType> = {
  "gc/dashboard": GCDashboard,
  "gc/invoices": GCInvoices,
  "gc/sov": SOV,
  "gc/lien-waivers": LienWaivers,
  "gc/subcontractors": Subcontractors,

  "sub/submit": SubmitInvoice,
  "sub/invoices": SubInvoices,
  "sub/sov": SOV,
  "sub/lien-waivers": SubLienWaivers,

  "owner/dashboard": OwnerDashboard,
  "owner/invoices": OwnerInvoices,
  "owner/sov": SOV,

  "accounting/dashboard": AccountingDashboard,
  "accounting/invoices": AccountingDashboard,
  "accounting/liens": LienWaivers,
};

export default async function PanelPage({
  params,
}: {
  params: Promise<{ role: string; panel: string }>;
}) {
  const { role, panel } = await params;
  if (!isRole(role)) notFound();
  const key = `${role}/${panel}` as PanelKey;
  const Component = registry[key];
  if (!Component) notFound();
  return <Component />;
}
