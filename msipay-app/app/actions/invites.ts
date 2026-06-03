"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { isRole } from "@/lib/nav";
import { createInvitation, revokeInvitation } from "@/lib/invites";

// Only a signed-in GC (the primary tenant/admin) may manage invitations.
async function requireGC() {
  const session = await auth();
  if (session?.user?.role !== "gc") {
    throw new Error("Not authorized");
  }
  return session;
}

export type InviteFormState = { ok: boolean; message: string };

export async function inviteUser(
  _prev: InviteFormState,
  formData: FormData,
): Promise<InviteFormState> {
  const session = await requireGC();

  const email = String(formData.get("email") ?? "").trim();
  const role = String(formData.get("role") ?? "");

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, message: "Enter a valid email address." };
  }
  if (!isRole(role)) {
    return { ok: false, message: "Pick a valid role." };
  }

  await createInvitation(email, role, session.user?.email ?? null);
  revalidatePath("/gc/team");
  return { ok: true, message: `Invited ${email} as ${role}.` };
}

export async function revokeInvite(formData: FormData): Promise<void> {
  await requireGC();
  const id = String(formData.get("id") ?? "");
  if (id) {
    await revokeInvitation(id);
    revalidatePath("/gc/team");
  }
}
