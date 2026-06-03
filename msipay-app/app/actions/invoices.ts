"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/authz";
import { setInvoiceStatus } from "@/lib/mutations";
import type { InvoiceStatus } from "@/lib/data";

// Panels that render invoice state — revalidated after every transition so the
// change is reflected across roles without a manual reload.
const INVOICE_PATHS = [
  "/gc/dashboard",
  "/gc/invoices",
  "/owner/invoices",
  "/accounting/dashboard",
  "/accounting/invoices",
  "/sub/invoices",
];

function revalidateInvoices() {
  for (const p of INVOICE_PATHS) revalidatePath(p);
}

// GC-driven review lifecycle: pending → review → approved/rejected, plus reopen.
async function gcTransition(formData: FormData, status: InvoiceStatus) {
  await requireRole("gc");
  const id = String(formData.get("id") ?? "");
  if (id) {
    await setInvoiceStatus(id, status);
    revalidateInvoices();
  }
}

export async function startReview(formData: FormData) {
  await gcTransition(formData, "review");
}

export async function approveInvoice(formData: FormData) {
  await gcTransition(formData, "approved");
}

export async function rejectInvoice(formData: FormData) {
  await gcTransition(formData, "rejected");
}

export async function reopenInvoice(formData: FormData) {
  await gcTransition(formData, "pending");
}

// Accounting releases payment on an approved invoice that has a lien waiver on
// file. Marking it paid removes it from the payment queue.
export async function releasePayment(formData: FormData) {
  await requireRole("accounting");
  const id = String(formData.get("id") ?? "");
  if (id) {
    await setInvoiceStatus(id, "paid");
    revalidateInvoices();
  }
}
