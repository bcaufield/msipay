# MSI Pay — Next.js skeleton

A runnable Next.js 15 + TypeScript + Tailwind skeleton derived from
`prototype-MSIpay.html`. It mirrors the prototype's 4-role experience (GC,
Subcontractor, Owner, Accounting) with the same mock data, but built on a
production stack so you can extend it into a real product.

## Quick start

```bash
cd msipay-app
npm install
npm run dev
```

Then open <http://localhost:3000>. You'll be redirected to `/gc/dashboard`.
Use the **Viewing as** dropdown in the sidebar to switch roles.

## Routing

All panels are served by a single dynamic route:

```
app/[role]/[panel]/page.tsx
```

The component for each `role/panel` pair is selected from a registry in that
file. Valid URLs:

| Role | URL |
|---|---|
| GC | `/gc/dashboard`, `/gc/invoices`, `/gc/sov`, `/gc/lien-waivers`, `/gc/subcontractors` |
| Sub | `/sub/submit`, `/sub/invoices`, `/sub/sov`, `/sub/lien-waivers` |
| Owner | `/owner/dashboard`, `/owner/invoices`, `/owner/sov` |
| Accounting | `/accounting/dashboard`, `/accounting/invoices`, `/accounting/liens` |

## Project layout

```
msipay-app/
├─ app/
│  ├─ layout.tsx              # root html + global styles
│  ├─ page.tsx                # redirect → /gc/dashboard
│  ├─ globals.css             # design tokens + reusable utility classes
│  └─ [role]/
│     ├─ layout.tsx           # sidebar + topbar wrapper
│     └─ [panel]/page.tsx     # dynamic panel registry
├─ components/
│  ├─ sidebar.tsx             # nav + role highlight (client)
│  ├─ topbar.tsx              # page title + action buttons (client)
│  ├─ role-switcher.tsx       # role dropdown (client)
│  ├─ badge.tsx               # status pill
│  └─ panels/                 # one component per panel
│     ├─ gc-dashboard.tsx
│     ├─ gc-invoices.tsx
│     ├─ sov.tsx              # shared across roles
│     ├─ lien-waivers.tsx
│     ├─ subcontractors.tsx
│     ├─ sub-panels.tsx       # submit wizard, sub invoices, sub liens
│     └─ owner-accounting.tsx # owner + accounting dashboards
└─ lib/
   ├─ data.ts                 # mock data (replace with DB queries)
   └─ nav.ts                  # role + navigation config
```

## Where to plug in the real backend

This skeleton is intentionally **frontend-only**. The mock data in
`lib/data.ts` is a 1:1 port of the prototype's `state` object. To make it
real:

1. **Database** — add Drizzle + Postgres. Replace each named export in
   `lib/data.ts` with an async query function.
2. **Auth** — add NextAuth with magic-link email; wrap `[role]/layout.tsx`
   with a session check + role guard.
3. **Mutations** — convert each "Review", "Approve", "Reject", "Upload",
   "Send reminder" button into a server action under `app/actions/`.
4. **PDFs** — add `react-pdf` or `pdfme` and a server-rendered
   `app/pdf/g702/[invoiceId]/route.ts` endpoint.
5. **Email** — add Resend + React Email templates.
6. **File uploads** — add S3/R2 + presigned URLs for lien waiver uploads.

See `../docs/proposal.md` and `../docs/estimates.md` for the full scoping and
hour-by-feature breakdown.

## Notes

- All money is formatted as display strings here for fidelity with the
  prototype. **In production this must be integer cents end-to-end** — never
  store dollars as floats.
- The role switcher uses client-side navigation only. In production it would
  be replaced by an actual role assigned at login.
- Dark mode follows the OS preference automatically (CSS `prefers-color-scheme`).

## Stack

- **Next.js 15** App Router (server components by default)
- **React 19**
- **TypeScript 5.7** (strict)
- **Tailwind CSS 3.4**
- **Lucide React** icons (drop-in replacement for the prototype's Tabler icons)
