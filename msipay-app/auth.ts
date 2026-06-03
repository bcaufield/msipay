import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Resend from "next-auth/providers/resend";
import { db } from "@/lib/db";
import {
  users,
  accounts,
  sessions,
  verificationTokens,
} from "@/lib/schema";
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
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user as { role?: Role }).role ?? "gc";
      }
      return session;
    },
  },
});
