# MSI Pay — Feature-by-Feature Hour Estimates

All estimates are **engineering hours**, assuming a senior full-stack developer at
production quality (typed, tested, accessible, deployable). Ranges reflect
optimistic → pessimistic. Apply a blended rate to get cost (e.g. $125/hr × midpoint).

Design, PM, QA, and DevOps overhead are **not** included in line items — they appear in
the rollup at the bottom.

---

## Phase 1 — MVP

### A. Foundation & infrastructure

| # | Item | Hours (low–high) |
|---|---|---|
| A1 | Next.js 15 + TypeScript + Tailwind + shadcn/ui scaffold | 6 – 10 |
| A2 | CI/CD pipeline (GitHub Actions → Vercel preview + prod) | 6 – 10 |
| A3 | Postgres + Drizzle ORM setup, migrations workflow | 8 – 12 |
| A4 | Environment management (dev/staging/prod), secrets | 4 – 8 |
| A5 | Logging + error tracking (Sentry) | 4 – 6 |
| A6 | Design tokens ported from prototype, dark mode | 6 – 10 |
| | **Subtotal** | **34 – 56** |

### B. Identity, tenancy, access control

| # | Item | Hours |
|---|---|---|
| B1 | Auth.js with email magic links + Resend | 10 – 16 |
| B2 | Organization (tenant) model, invitations, onboarding flow | 14 – 20 |
| B3 | Role + project-membership RBAC (4 roles) | 16 – 24 |
| B4 | Row-level security helpers + query guards | 10 – 14 |
| B5 | Audit log table, write-on-every-mutation middleware | 10 – 14 |
| B6 | User profile, password fallback, session management | 6 – 10 |
| | **Subtotal** | **66 – 98** |

### C. Core domain model

| # | Item | Hours |
|---|---|---|
| C1 | Projects, contracts, draws schema | 8 – 12 |
| C2 | Subcontractors + contracts schema | 6 – 10 |
| C3 | Invoices (pay applications) schema + state machine | 12 – 18 |
| C4 | Schedule of Values + line items schema | 10 – 14 |
| C5 | Lien waivers schema (conditional/unconditional × progress/final) | 8 – 12 |
| C6 | Money math utilities (integer cents, retainage, rounding) | 8 – 12 |
| C7 | Seed data + factories for dev/demo | 6 – 10 |
| | **Subtotal** | **58 – 88** |

### D. GC role

| # | Item | Hours |
|---|---|---|
| D1 | GC dashboard with KPI tiles + project completion bar | 8 – 12 |
| D2 | Invoice list with filters (draw, status, sub, trade) | 10 – 14 |
| D3 | Invoice review modal with validation checklist | 12 – 18 |
| D4 | Approve / reject actions + conditional approval | 8 – 12 |
| D5 | SOV viewer (G703 layout) with retainage rollup | 12 – 16 |
| D6 | Lien waiver tracker + reminder send | 10 – 14 |
| D7 | Subcontractor roster CRUD + add-sub modal | 10 – 14 |
| | **Subtotal** | **70 – 100** |

### E. Subcontractor role

| # | Item | Hours |
|---|---|---|
| E1 | Sub dashboard / invoice history | 6 – 10 |
| E2 | 4-step submission wizard shell + progress indicator | 8 – 12 |
| E3 | SOV line-item input grid with live totals + validation | 16 – 24 |
| E4 | Draft autosave (server-action debounced) | 8 – 12 |
| E5 | Lien waiver upload (multipart → S3, MIME/size checks) | 10 – 14 |
| E6 | Submit + email notify GC | 4 – 6 |
| | **Subtotal** | **52 – 78** |

### F. Owner role

| # | Item | Hours |
|---|---|---|
| F1 | Owner project summary dashboard | 6 – 10 |
| F2 | Certified pay-app list with PDF download | 8 – 12 |
| F3 | Read-only SOV view + retainage held breakdown | 6 – 10 |
| | **Subtotal** | **20 – 32** |

### G. Accounting role

| # | Item | Hours |
|---|---|---|
| G1 | Payables dashboard with KPI tiles | 6 – 10 |
| G2 | Payment release queue with hold enforcement | 12 – 16 |
| G3 | CSV / QuickBooks IIF export of payable batches | 10 – 14 |
| G4 | Lien tracker (accounting view) | 6 – 8 |
| G5 | Mark-as-paid action + audit | 4 – 6 |
| | **Subtotal** | **38 – 54** |

### H. PDF & documents

| # | Item | Hours |
|---|---|---|
| H1 | G702 (Application for Payment) PDF template | 16 – 24 |
| H2 | G703 (Continuation Sheet) PDF template | 14 – 20 |
| H3 | FL Chapter 713 conditional lien waiver template | 8 – 12 |
| H4 | FL Chapter 713 unconditional lien waiver template | 8 – 12 |
| H5 | Document storage abstraction (S3/R2) + signed URLs | 10 – 14 |
| H6 | Virus scan integration (ClamAV-as-a-service or similar) | 6 – 10 |
| | **Subtotal** | **62 – 92** |

### I. Notifications

| # | Item | Hours |
|---|---|---|
| I1 | Email templates (8 transactional emails) | 10 – 14 |
| I2 | Notification preferences per user | 6 – 8 |
| I3 | Activity feed per project | 8 – 12 |
| | **Subtotal** | **24 – 34** |

### J. Quality, security, launch

| # | Item | Hours |
|---|---|---|
| J1 | Unit tests on money math + state machines | 16 – 24 |
| J2 | E2E tests (Playwright) on the 4 critical flows | 16 – 24 |
| J3 | Accessibility pass (WCAG 2.1 AA on core screens) | 10 – 16 |
| J4 | Security review (OWASP top 10, file upload, auth) | 10 – 14 |
| J5 | Performance pass + N+1 query audit | 6 – 10 |
| J6 | Pilot onboarding docs + admin runbook | 8 – 12 |
| J7 | Bug-fix buffer / pilot feedback loop | 30 – 50 |
| | **Subtotal** | **96 – 150** |

---

### Phase 1 rollup

| Group | Low | High |
|---|---:|---:|
| A. Foundation | 34 | 56 |
| B. Identity/tenancy | 66 | 98 |
| C. Domain model | 58 | 88 |
| D. GC role | 70 | 100 |
| E. Sub role | 52 | 78 |
| F. Owner role | 20 | 32 |
| G. Accounting role | 38 | 54 |
| H. PDFs & docs | 62 | 92 |
| I. Notifications | 24 | 34 |
| J. Quality & launch | 96 | 150 |
| **Engineering subtotal** | **520** | **782** |
| Design (≈15%) | 78 | 117 |
| PM / coordination (≈10%) | 52 | 78 |
| **Project total** | **650** | **977** |

At **$125/hr blended**: **$81k – $122k**
At **$100/hr blended**: **$65k – $98k**

---

## Phase 2 — Growth (high-level only)

| Item | Hours (low–high) |
|---|---|
| DocuSign integration on lien waivers | 40 – 60 |
| Multi-state lien-waiver template library (10 states) | 60 – 100 |
| QuickBooks Online live sync | 60 – 90 |
| Sage 300 integration | 40 – 70 |
| Payment execution (Modern Treasury or similar) | 80 – 140 |
| Multi-project portfolio dashboard | 30 – 50 |
| Mobile-optimized sub portal polish | 24 – 40 |
| In-app notifications | 16 – 24 |
| Lender / owner audit export | 24 – 36 |
| **Engineering subtotal** | **374 – 610** |
| Design + PM uplift (≈25%) | 94 – 153 |
| **Phase 2 total** | **468 – 763** |

At **$125/hr**: **$59k – $95k**

---

## Notes on the numbers

- **The "high" end is what I'd quote a real customer**, since fixed-price work needs to
  absorb scope creep and unknowns. The "low" end is achievable only with a clear pilot
  customer, no spec churn, and an experienced senior dev.
- The largest single risk areas are **AIA G702/G703 PDF fidelity (H1+H2)** and the
  **invoice/SOV state machine + money math (C3+C6)**. These are where to focus design
  spikes early.
- **J7 (50h bug-fix buffer)** is non-negotiable for financial software. If the client
  resists, push back — it always gets used.
- Hours assume **one engineer**. Two engineers in parallel cuts calendar time by ~40%
  (not 50% — coordination overhead) but does not reduce total hours.
