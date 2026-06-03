// Invite-only access control helpers. A person may sign in only if they already
// have a user row or a pending invitation. These functions back both the auth
// gate (auth.ts) and the GC "Team" admin panel.

import { and, desc, eq } from "drizzle-orm";
import { db } from "./db";
import { invitations, users } from "./schema";
import type { Role } from "./nav";

export type InviteStatus = "pending" | "accepted" | "revoked";

export type Invitation = {
  id: string;
  email: string;
  role: Role;
  status: InviteStatus;
  invitedByEmail: string | null;
  createdAt: Date;
  acceptedAt: Date | null;
};

export type Member = {
  id: string;
  email: string | null;
  name: string | null;
  role: Role;
};

// Emails are matched case-insensitively; store and compare in normalized form.
const norm = (email: string) => email.trim().toLowerCase();

export async function listInvitations(): Promise<Invitation[]> {
  return db.select().from(invitations).orderBy(desc(invitations.createdAt));
}

export async function listMembers(): Promise<Member[]> {
  return db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
    })
    .from(users)
    .orderBy(users.email);
}

// Create (or re-open) an invitation for an email with a given role. If a row for
// the email already exists it is updated and reset to pending — so re-inviting a
// previously revoked address works, and changing the role before they accept
// just overwrites it.
export async function createInvitation(
  email: string,
  role: Role,
  invitedByEmail?: string | null,
): Promise<void> {
  const e = norm(email);
  await db
    .insert(invitations)
    .values({
      email: e,
      role,
      status: "pending",
      invitedByEmail: invitedByEmail ?? null,
      acceptedAt: null,
    })
    .onConflictDoUpdate({
      target: invitations.email,
      set: {
        role,
        status: "pending",
        invitedByEmail: invitedByEmail ?? null,
        acceptedAt: null,
      },
    });
}

export async function revokeInvitation(id: string): Promise<void> {
  await db
    .update(invitations)
    .set({ status: "revoked" })
    .where(eq(invitations.id, id));
}

// A sign-in is permitted if the email is an existing user OR has a pending
// invite. Existing users (e.g. seeded demo accounts) never need an invite.
export async function isEmailAllowed(email: string): Promise<boolean> {
  const e = norm(email);

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, e))
    .limit(1);
  if (existing.length > 0) return true;

  const pending = await db
    .select({ id: invitations.id })
    .from(invitations)
    .where(and(eq(invitations.email, e), eq(invitations.status, "pending")))
    .limit(1);
  return pending.length > 0;
}

export async function getPendingInvite(
  email: string,
): Promise<Invitation | null> {
  const e = norm(email);
  const rows = await db
    .select()
    .from(invitations)
    .where(and(eq(invitations.email, e), eq(invitations.status, "pending")))
    .limit(1);
  return rows[0] ?? null;
}

// Marks a pending invite for the email as accepted. Called once, when the
// invited user's account is first created.
export async function markInviteAccepted(email: string): Promise<void> {
  const e = norm(email);
  await db
    .update(invitations)
    .set({ status: "accepted", acceptedAt: new Date() })
    .where(and(eq(invitations.email, e), eq(invitations.status, "pending")));
}
