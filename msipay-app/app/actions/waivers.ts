"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/authz";
import { setWaiverStatus } from "@/lib/mutations";

// Marking a waiver received/outstanding cascades to the matching invoice's lien
// status (see setWaiverStatus), which is what gates Accounting's payment button.
const WAIVER_PATHS = [
  "/gc/lien-waivers",
  "/accounting/liens",
  "/accounting/dashboard",
  "/accounting/invoices",
  "/gc/invoices",
];

function revalidateWaivers() {
  for (const p of WAIVER_PATHS) revalidatePath(p);
}

export async function markWaiverReceived(formData: FormData) {
  await requireRole("gc");
  const id = String(formData.get("id") ?? "");
  if (id) {
    await setWaiverStatus(id, "received");
    revalidateWaivers();
  }
}

export async function markWaiverOutstanding(formData: FormData) {
  await requireRole("gc");
  const id = String(formData.get("id") ?? "");
  if (id) {
    await setWaiverStatus(id, "outstanding");
    revalidateWaivers();
  }
}
