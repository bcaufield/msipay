import { listInvitations, listMembers } from "@/lib/invites";
import { roleLabels } from "@/lib/nav";
import { revokeInvite } from "@/app/actions/invites";
import { InviteForm } from "@/components/invite-form";

const inviteBadge: Record<string, string> = {
  pending: "badge-pending",
  accepted: "badge-approved",
  revoked: "badge-rejected",
};

const fmtDate = (d: Date | null) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

export async function GCTeam() {
  const [invites, members] = await Promise.all([listInvitations(), listMembers()]);
  const pending = invites.filter((i) => i.status === "pending");

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="text-sm font-medium mb-1">Invite a teammate</div>
        <div className="text-xs text-fg-secondary mb-3">
          Sign-in is invite-only. Only invited emails (and existing members) can
          receive a magic link. New invitees get the role you choose here on
          first sign-in.
        </div>
        <InviteForm />
      </div>

      <div className="card">
        <div className="text-sm font-medium mb-3">
          Pending invitations{" "}
          <span className="text-fg-tertiary font-normal">({pending.length})</span>
        </div>
        {pending.length === 0 ? (
          <div className="text-xs text-fg-secondary">No pending invitations.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data">
              <thead>
                <tr>
                  <th>Email</th><th>Role</th><th>Invited by</th><th>Sent</th><th></th>
                </tr>
              </thead>
              <tbody>
                {pending.map((inv) => (
                  <tr key={inv.id}>
                    <td className="font-medium">{inv.email}</td>
                    <td className="text-fg-secondary">{roleLabels[inv.role]}</td>
                    <td className="text-fg-secondary">{inv.invitedByEmail ?? "—"}</td>
                    <td className="text-fg-secondary">{fmtDate(inv.createdAt)}</td>
                    <td>
                      <form action={revokeInvite}>
                        <input type="hidden" name="id" value={inv.id} />
                        <button type="submit" className="btn btn-sm btn-danger">
                          Revoke
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <div className="text-sm font-medium mb-3">
          Members{" "}
          <span className="text-fg-tertiary font-normal">({members.length})</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data">
            <thead>
              <tr><th>Email</th><th>Name</th><th>Role</th></tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td className="font-medium">{m.email ?? "—"}</td>
                  <td className="text-fg-secondary">{m.name ?? "—"}</td>
                  <td className="text-fg-secondary">{roleLabels[m.role]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {invites.some((i) => i.status !== "pending") ? (
        <div className="card">
          <div className="text-sm font-medium mb-3">Invitation history</div>
          <div className="overflow-x-auto">
            <table className="data">
              <thead>
                <tr><th>Email</th><th>Role</th><th>Status</th><th>Accepted</th></tr>
              </thead>
              <tbody>
                {invites
                  .filter((i) => i.status !== "pending")
                  .map((inv) => (
                    <tr key={inv.id}>
                      <td className="font-medium">{inv.email}</td>
                      <td className="text-fg-secondary">{roleLabels[inv.role]}</td>
                      <td>
                        <span className={`badge ${inviteBadge[inv.status]}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="text-fg-secondary">{fmtDate(inv.acceptedAt)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
