"use client";

import { LogOut } from "lucide-react";
import { roleLabels, type Role } from "@/lib/nav";
import { doSignOut } from "@/app/actions/auth";

export function UserMenu({ role, userEmail }: { role: Role; userEmail: string }) {
  return (
    <div className="px-3 py-2.5 border-b border-border-subtle">
      <div className="text-[10px] uppercase tracking-wider text-fg-tertiary mb-1">
        Signed in as
      </div>
      <div className="text-xs text-fg-primary font-medium truncate" title={userEmail}>
        {userEmail || "—"}
      </div>
      <div className="text-[11px] text-fg-secondary mt-0.5">{roleLabels[role]}</div>
      <form action={doSignOut} className="mt-2">
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-1.5 text-xs px-2 py-1.5 rounded-md border border-border bg-bg-secondary text-fg-secondary hover:text-fg-primary transition-colors"
        >
          <LogOut size={12} /> Sign out
        </button>
      </form>
    </div>
  );
}
