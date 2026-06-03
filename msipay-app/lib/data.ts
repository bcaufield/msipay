// Data-access layer. Each export reads from Postgres via Drizzle and maps rows
// back to the shapes the panels render. Monetary columns are integer cents in
// the DB and are converted to dollars / display strings here.

import { eq, asc, desc } from "drizzle-orm";
import { db } from "./db";
import {
  invoices as invoicesTable,
  subcontractors as subsTable,
  sovLines as sovTable,
  waivers as waiversTable,
  projects as projectsTable,
} from "./schema";

export type InvoiceStatus =
  | "pending"
  | "review"
  | "approved"
  | "rejected"
  | "draft"
  | "paid";
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
  id: string;
  sub: string;
  draw: number;
  type: "Conditional" | "Unconditional";
  amount: string;
  status: LienStatus;
  date: string;
};

// Cents (integer) → "$1,234" display string.
const centsToStr = (cents: number) => "$" + Math.round(cents / 100).toLocaleString();
// Cents (integer) → whole-dollar number for arithmetic in the SOV table.
const centsToDollars = (cents: number) => Math.round(cents / 100);

export async function getInvoices(): Promise<Invoice[]> {
  const rows = await db
    .select({
      id: invoicesTable.id,
      sub: subsTable.name,
      trade: invoicesTable.trade,
      contractCents: invoicesTable.contractCents,
      billedCents: invoicesTable.billedCents,
      pct: invoicesTable.pct,
      status: invoicesTable.status,
      period: invoicesTable.period,
      project: projectsTable.name,
      lienStatus: invoicesTable.lienStatus,
      draw: invoicesTable.draw,
    })
    .from(invoicesTable)
    .innerJoin(subsTable, eq(invoicesTable.subId, subsTable.id))
    .innerJoin(projectsTable, eq(invoicesTable.projectId, projectsTable.id))
    .orderBy(desc(invoicesTable.id));

  return rows.map((r) => ({
    id: r.id,
    sub: r.sub,
    trade: r.trade,
    contract: centsToStr(r.contractCents),
    billed: centsToStr(r.billedCents),
    pct: r.pct,
    status: r.status,
    period: r.period,
    project: r.project,
    lienStatus: r.lienStatus,
    draw: r.draw,
  }));
}

export async function getSubcontractors(): Promise<Subcontractor[]> {
  const rows = await db
    .select()
    .from(subsTable)
    .orderBy(asc(subsTable.seq));

  return rows.map((r) => ({
    name: r.name,
    trade: r.trade,
    contract: centsToStr(r.contractCents),
    billed: centsToStr(r.billedCents),
    pct: r.pct,
    active: r.activeCount,
    status: r.status,
  }));
}

export async function getSov(): Promise<SovLine[]> {
  const rows = await db.select().from(sovTable).orderBy(asc(sovTable.num));

  return rows.map((r) => ({
    num: r.num,
    desc: r.description,
    value: centsToDollars(r.valueCents),
    prev: centsToDollars(r.prevCents),
    curr: centsToDollars(r.currCents),
    stored: centsToDollars(r.storedCents),
  }));
}

export async function getWaivers(): Promise<Waiver[]> {
  const rows = await db
    .select({
      id: waiversTable.id,
      sub: subsTable.name,
      seq: waiversTable.seq,
      draw: waiversTable.draw,
      type: waiversTable.type,
      amountCents: waiversTable.amountCents,
      status: waiversTable.status,
      date: waiversTable.date,
    })
    .from(waiversTable)
    .innerJoin(subsTable, eq(waiversTable.subId, subsTable.id))
    .orderBy(asc(waiversTable.seq));

  return rows.map((r) => ({
    id: r.id,
    sub: r.sub,
    draw: r.draw,
    type: r.type,
    amount: centsToStr(r.amountCents),
    status: r.status,
    date: r.date,
  }));
}

export const fmt = (n: number) => "$" + Number(n).toLocaleString();

export const statusLabels: Record<string, string> = {
  pending: "Pending Review",
  review: "In Review",
  approved: "Approved",
  rejected: "Rejected",
  draft: "Draft",
  paid: "Paid",
  received: "Received",
  outstanding: "Outstanding",
  active: "Active",
  complete: "Complete",
};
