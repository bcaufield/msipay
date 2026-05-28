# MSI Pay — Scoping & Proposal

**Prepared for:** Miami Systems Inc.
**Prepared by:** Folksware Technologies
**Date:** May 2026
**Status:** Draft v1 — based on `prototype-MSIpay.html`

---

## 1. Executive summary

MSI Pay is a vertical-SaaS platform that streamlines the construction pay-application
lifecycle — from subcontractor invoice submission through GC review, owner certification,
lien-waiver tracking, and accounting payment release. The prototype provided is a
clickable single-page mockup that correctly models the four primary user roles and the
core artifacts (invoices, schedule of values, lien waivers, retainage). It is an excellent
foundation for a production build.

This document scopes a two-phase delivery:

- **Phase 1 (MVP)** — production-grade web app covering the workflows shown in the
  prototype, single-state (Florida) compliance, manual lien-waiver PDFs, and accounting
  export (no payment execution).
- **Phase 2 (Growth)** — e-signature, multi-state lien templates, QuickBooks/Sage
  integration, payment rails, notifications, mobile field UX.

Indicative budget and timeline:

| Phase | Duration | Team | Budget (USD) |
|---|---|---|---|
| Phase 1 — MVP | 14–18 weeks | 1 senior full-stack + 0.5 designer | **$75k – $115k** |
| Phase 2 — Growth | 8–12 weeks | 1–2 full-stack | **$45k – $80k** |

Detailed hour breakdown is in `estimates.md`.

---

## 2. Assumptions

These assumptions drive the scope and budget. **Please confirm or correct before sign-off.**

1. **Primary buyer is the General Contractor.** Owners, subs, and accounting are invited
   users on the GC's tenant. Pricing is per-GC / per-project.
2. **Florida-first.** Lien-waiver templates and statutory language are FL Chapter 713
   compliant in Phase 1. Multi-state support is Phase 2.
3. **No money movement in MVP.** The platform tracks payment release decisions and
   exports payable batches; actual ACH/check is handled by the customer's existing AP
   system (or QuickBooks in Phase 2).
4. **E-signature is Phase 2** (DocuSign integration). MVP accepts uploaded signed PDFs.
5. **Single project per GC at launch is acceptable**; multi-project portfolio view is a
   fast-follow inside MVP if budget permits.
6. **Hosting:** Vercel + a managed Postgres (Neon or Supabase) + S3-compatible object
   storage. Estimated infra cost: $80–$200/mo at launch.
7. **No native mobile app in MVP.** The web app will be responsive; subs upload
   waivers/photos from phone browsers.

---

## 3. Architecture overview (proposed)

```
┌──────────────────────────────────────────────────────────────┐
│                    Next.js 15 (App Router)                   │
│   Vercel · Server Components · Server Actions · Edge auth    │
└──────────────┬───────────────────────────────────────────────┘
               │
   ┌───────────┼─────────────┬──────────────┬────────────────┐
   ▼           ▼             ▼              ▼                ▼
 Postgres   S3 (R2)     Resend/Postmark   PDF service    Audit log
 (Neon)     uploads     email             (G702/G703)    (Postgres)
   │
   └── Drizzle ORM · Row-level multi-tenancy · pgcrypto for PII
```

**Stack rationale**

- **Next.js 15 + TypeScript** — matches the prototype's structure 1:1; SSR delivers
  fast dashboards; server actions remove most API plumbing.
- **Tailwind + shadcn/ui** — the prototype's design system is already Tailwind-ready;
  shadcn gives accessible primitives (Dialog, Table, Form) out of the box.
- **Postgres + Drizzle** — financial data demands relational integrity. Drizzle's
  type-safety prevents the float-rounding class of bug.
- **Auth.js (NextAuth) + Resend magic links** — low-friction for subs; supports SSO
  add-on in Phase 2.
- **react-pdf or pdfme** for G702/G703 generation — keeps PDF rendering in-process.

---

## 4. Phase 1 — MVP scope

### 4.1 Identity & tenancy
- Magic-link auth (email) + password fallback
- Organization (tenant) = GC. Invited users: subs, owner, accounting
- Role-based access control with four roles + project-level membership
- Audit log for every approve/reject/edit/payment-release action

### 4.2 GC role
- Project dashboard with KPI tiles (contract, billed, pending, lien-outstanding)
- Invoice review queue with validation checklist
- Approve / reject with notes; conditional approval when lien waiver missing
- Schedule of Values editor (AIA G703 columns)
- Lien waiver tracker with reminder emails
- Subcontractor roster (CRUD)

### 4.3 Subcontractor role
- 4-step pay-application wizard (contract → SOV line items → lien waiver → submit)
- Draft autosave
- Invoice history, status tracking
- Lien-waiver upload (PDF, signed off-platform in MVP)

### 4.4 Owner / Developer role
- Read-only project summary with milestone progress
- Certified pay-application list with downloadable G702/G703 PDF
- Retainage held visibility

### 4.5 Accounting / Finance role
- Payables dashboard (ready-to-pay vs. blocked-on-waiver)
- Payment release queue with retainage calculation
- CSV export for AP system / QuickBooks IIF export
- Lien tracker with payment hold enforcement

### 4.6 Cross-cutting
- AIA G702 + G703 PDF generation per draw
- Email notifications (invoice submitted, approved, rejected, lien-waiver reminder,
  payment released)
- Activity feed per project
- Document storage (lien waivers, backup docs, photos) with virus scan
- All monetary math in integer cents; double-entry SOV reconciliation

### 4.7 Explicitly **out of scope** for MVP
- Payment execution (ACH, checks)
- E-signature
- Multi-state lien templates
- Native mobile apps
- QuickBooks/Sage live sync (export only)
- Procore / Autodesk Build integrations
- Change orders / RFIs / submittals
- Time tracking / certified payroll

---

## 5. Phase 2 — Growth scope

| Feature | Why |
|---|---|
| DocuSign / native e-signature on lien waivers | Removes the #1 manual step |
| Multi-state lien-waiver template library | Unlocks customers outside FL |
| QuickBooks Online + Sage 300 live integration | #1 ask from accounting users |
| Payment execution (Modern Treasury or ACH partner) | Recurring-revenue lever |
| Multi-project portfolio dashboards | Larger GCs |
| In-app notifications + mobile-optimized sub portal | Field-friendly |
| Bank-grade audit export | Lender / owner requirement on larger jobs |

---

## 6. Delivery plan (Phase 1)

| Sprint | Weeks | Deliverable |
|---|---|---|
| 0 | 1 | Repo, CI/CD, design tokens, auth shell |
| 1 | 2–3 | Multi-tenant data model, role/permission system |
| 2 | 4–5 | GC dashboard + invoice review flow |
| 3 | 6–7 | Subcontractor submission wizard + draft autosave |
| 4 | 8–9 | Schedule of Values editor + retainage math |
| 5 | 10–11 | Lien waiver tracking + uploads + reminders |
| 6 | 12 | Owner & Accounting dashboards |
| 7 | 13 | G702/G703 PDF generation |
| 8 | 14–15 | Audit log, email notifications, QA hardening |
| 9 | 16–17 | Pilot deployment, customer onboarding, bugfixing |
| Buffer | 18 | Contingency / pilot feedback loop |

---

## 7. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Statutory lien-waiver language wrong | Low | High | Have FL construction attorney review templates pre-launch (≈$2k) |
| Money math rounding bugs | Med | High | Integer cents only; property-based tests on SOV reconciliation |
| Sub adoption friction | High | Med | Magic-link auth, no password, mobile-friendly upload |
| Scope creep into change orders / RFIs | High | High | Strict change-control after Sprint 2 |
| G702/G703 PDF visual fidelity | Med | Med | Pixel-compare against AIA reference docs in CI |

---

## 8. Open questions for Miami Systems Inc.

Before contract signing, please confirm:

1. **Who is the named pilot GC?** A real first customer de-risks scope materially.
2. **Single-state or multi-state at launch?**
3. **Will MSI Pay handle money movement** in any future phase, or always export to a
   third-party AP system?
4. **Brand identity** — is "MSI Pay" the final name, and do we have a logo/typography
   system, or is design part of this engagement?
5. **Existing systems to integrate with at launch** (QuickBooks Online? Sage? Procore?).
6. **Hosting preference** — Vercel + Neon (our recommendation), AWS, or customer's
   existing cloud account?
7. **SLA / uptime expectations** for the pilot.
8. **Data residency** — any requirement to keep data in the US (yes by default) or
   on-prem?

---

## 9. Commercial terms (placeholder — to be negotiated)

- **Engagement model:** Fixed-fee per phase, milestone billing (25% kickoff, 25% at
  Sprint 4, 25% at Sprint 7, 25% at pilot acceptance).
- **Change requests:** Logged in writing; billed at $[rate]/hr after a 10% scope buffer
  is exhausted.
- **IP:** Full transfer to Miami Systems Inc. on final payment; we retain a portfolio
  reference right.
- **Warranty:** 30 days post-launch bugfix coverage at no charge.
- **Optional retainer:** Post-launch maintenance + Phase 2 build at a monthly retainer
  to be quoted separately.

---

*See `estimates.md` for the line-item hour breakdown that backs this proposal, and
`msipay-app/` for a runnable Next.js skeleton seeded from the prototype's data.*
