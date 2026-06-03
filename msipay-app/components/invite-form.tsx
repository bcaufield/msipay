"use client";

import { useActionState } from "react";
import { inviteUser, type InviteFormState } from "@/app/actions/invites";
import { roleLabels, type Role } from "@/lib/nav";

const roles = Object.keys(roleLabels) as Role[];
const initialState: InviteFormState = { ok: false, message: "" };

export function InviteForm() {
  const [state, formAction, pending] = useActionState(inviteUser, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3" key={state.ok ? state.message : "form"}>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="text-xs text-fg-secondary" htmlFor="invite-email">
            Email
          </label>
          <input
            id="invite-email"
            name="email"
            type="email"
            required
            placeholder="teammate@company.com"
            className="input w-full mt-1"
          />
        </div>
        <div>
          <label className="text-xs text-fg-secondary" htmlFor="invite-role">
            Role
          </label>
          <select id="invite-role" name="role" className="input w-full mt-1" defaultValue="sub">
            {roles.map((r) => (
              <option key={r} value={r}>
                {roleLabels[r]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Sending invite…" : "Send invite"}
        </button>
      </div>
      {state.message ? (
        <div className={`alert ${state.ok ? "alert-success" : "alert-warning"} text-xs`}>
          {state.message}
        </div>
      ) : null}
    </form>
  );
}
