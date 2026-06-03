// Write-side data access for the invoice/payment workflow. Mirrors lib/data.ts
// (read-side) but performs the state transitions the action buttons trigger.

import { and, eq } from "drizzle-orm";
import { db } from "./db";
import {
  invoices as invoicesTable,
  waivers as waiversTable,
} from "./schema";
import type { InvoiceStatus, LienStatus } from "./data";

export async function setInvoiceStatus(id: string, status: InvoiceStatus) {
  await db
    .update(invoicesTable)
    .set({ status })
    .where(eq(invoicesTable.id, id));
}

// Flip a waiver's status and cascade to any invoice for the same subcontractor
// and draw, so marking a lien waiver "received" unblocks that invoice's payment
// (and vice-versa). Returns the affected waiver row for revalidation context.
export async function setWaiverStatus(id: string, status: LienStatus) {
  const [waiver] = await db
    .update(waiversTable)
    .set({ status })
    .where(eq(waiversTable.id, id))
    .returning();

  if (waiver) {
    await db
      .update(invoicesTable)
      .set({ lienStatus: status })
      .where(
        and(
          eq(invoicesTable.subId, waiver.subId),
          eq(invoicesTable.draw, waiver.draw),
        ),
      );
  }

  return waiver;
}
