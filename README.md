# MSI Pay — Client deliverables

Three artifacts prepared for the Miami Systems Inc. client conversation:

| Deliverable | Path | Purpose |
|---|---|---|
| **Original prototype** | `prototype-MSIpay.html` | The client's clickable mockup (single-page, vanilla JS). Open in any browser. |
| **Proposal / scoping doc** | `docs/proposal.md` | Client-facing scope, assumptions, phases, risks, open questions, commercial placeholder. |
| **Hour estimates** | `docs/estimates.md` | Feature-by-feature engineering hour breakdown (low/high), with phase rollup and indicative pricing. |
| **Working Next.js skeleton** | `msipay-app/` | Runnable Next.js 15 + TypeScript + Tailwind app that reproduces the prototype's 4 roles on a production stack. See `msipay-app/README.md`. |

## Suggested workflow for the client meeting

1. Walk the client through `docs/proposal.md` (top to bottom — it ends with
   the **open questions** list that drives the next decision).
2. Use `docs/estimates.md` to answer "how much" and "how long" with line-item
   defensibility.
3. Demo the `msipay-app/` skeleton to show that the prototype's design
   already maps cleanly onto a real-world stack and to anchor the
   conversation on what's already done vs. what remains.

## Open assumptions (confirm before quoting)

- Primary buyer is the **General Contractor**.
- **Florida-first** statutory compliance in MVP.
- No money movement / payment execution in MVP (export to AP only).
- E-signature is Phase 2 (DocuSign).
- Hosting on Vercel + Neon (Postgres) + S3-compatible storage.

Update the proposal's **Assumptions** section as the client clarifies these.
