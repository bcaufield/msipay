import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Resend from "next-auth/providers/resend";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  users,
  accounts,
  sessions,
  verificationTokens,
} from "@/lib/schema";
import { getPendingInvite, isEmailAllowed, markInviteAccepted } from "@/lib/invites";
import type { Role } from "@/lib/nav";

const resendKey = process.env.AUTH_RESEND_KEY;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "database" },
  pages: { signIn: "/signin" },
  trustHost: true,
  providers: [
    Resend({
      // A non-empty placeholder lets the app boot without a real key; the
      // magic link is logged to the server console in development.
      apiKey: resendKey ?? "re_development_placeholder",
      from: process.env.AUTH_EMAIL_FROM ?? "onboarding@resend.dev",
      async sendVerificationRequest({ identifier, url, provider }) {
        // Invite-only: don't email a magic link to anyone who isn't an existing
        // user or a pending invitee. (The signIn callback is the hard backstop.)
        if (!(await isEmailAllowed(identifier))) {
          if (process.env.NODE_ENV !== "production") {
            // eslint-disable-next-line no-console
            console.log(`\n[auth] No invite for ${identifier}; magic link not sent.\n`);
          }
          return;
        }
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.log(`\n[auth] Magic sign-in link for ${identifier}:\n${url}\n`);
        }
        if (!resendKey) return; // dev fallback: console link only

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: provider.from,
            to: identifier,
            subject: "Sign in to MSI Pay",
            html: `<p>Click <a href="${url}">this link</a> to sign in to MSI Pay. If you did not request this, you can ignore this email.</p>`,
          }),
        });

        if (!res.ok) {
          const detail = await res.text();
          if (process.env.NODE_ENV === "production") {
            throw new Error(`Resend delivery failed: ${detail}`);
          }
          // eslint-disable-next-line no-console
          console.warn(`[auth] Resend delivery failed (using console link): ${detail}`);
        }
      },
    }),
  ],
  callbacks: {
    // Invite-only hard gate: even with a valid magic link, only existing users
    // or pending invitees may complete sign-in.
    async signIn({ user }) {
      if (!user.email) return false;
      return isEmailAllowed(user.email);
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user as { role?: Role }).role ?? "gc";
      }
      return session;
    },
  },
  events: {
    // First sign-in creates the user with the default role; copy the invited
    // role onto the new row and mark the invitation accepted.
    async createUser({ user }) {
      if (!user.email || !user.id) return;
      const invite = await getPendingInvite(user.email);
      if (!invite) return;
      await db.update(users).set({ role: invite.role }).where(eq(users.id, user.id));
      await markInviteAccepted(user.email);
    },
  },
});
