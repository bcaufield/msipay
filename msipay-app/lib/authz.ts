import { auth } from "@/auth";
import type { Role } from "@/lib/nav";

// Guard a server action to one or more roles. Throws if the caller is not
// signed in or holds a role outside the allowed set. Returns the session so
// callers can use the authenticated user.
export async function requireRole(...allowed: Role[]) {
  const session = await auth();
  const role = session?.user?.role;
  if (!role || !allowed.includes(role)) {
    throw new Error("Not authorized");
  }
  return session;
}
