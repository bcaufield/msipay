import { Warehouse } from "lucide-react";
import { signIn } from "@/auth";

export const dynamic = "force-dynamic";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-bg-secondary">
      <div className="card w-full" style={{ maxWidth: 380 }}>
        <div className="flex items-center gap-1.5 text-[17px] font-medium mb-1">
          <Warehouse size={18} className="text-brand" />
          MSI Pay
        </div>
        <div className="text-xs text-fg-secondary mb-4">
          Sign in to the Miami Systems Inc. pay-application platform.
        </div>

        {error ? (
          <div className="alert alert-warning mb-3 text-xs">
            Could not sign you in. Please try again.
          </div>
        ) : null}

        <form
          action={async (formData: FormData) => {
            "use server";
            const email = String(formData.get("email") ?? "").trim();
            await signIn("resend", { email, redirectTo: "/" });
          }}
        >
          <label className="text-xs text-fg-secondary" htmlFor="email">
            Work email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            className="input w-full mt-1 mb-3"
          />
          <button type="submit" className="btn btn-primary w-full">
            Email me a sign-in link
          </button>
        </form>

        <div className="text-[11px] text-fg-tertiary mt-3">
          We&apos;ll send a one-time magic link — no password required.
        </div>
      </div>
    </div>
  );
}
