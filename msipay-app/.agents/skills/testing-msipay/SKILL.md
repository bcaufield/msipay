---
name: testing-msipay
description: Run and end-to-end test the MSI Pay app (Auth.js magic-link + Drizzle/Postgres) locally. Use when verifying auth, role guards, or DB-backed panels.
---

# Testing MSI Pay (auth + data tier)

The app lives in the `msipay-app/` subfolder. All commands below run from there.

## 1. Local Postgres
The app needs a Postgres database (`DATABASE_URL`). For local testing, a disposable
Docker Postgres works well:
```bash
docker run -d --name msipay-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=msipay -p 5433:5432 postgres:16
```
Then set in `.env.local` (or export):
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/msipay
AUTH_SECRET=<any value, e.g. `openssl rand -base64 32`>
```
Leave `AUTH_RESEND_KEY` UNSET in dev so magic links print to the console (see step 3).

## 2. Migrate + seed
```bash
npm install
npm run db:migrate   # applies drizzle/*.sql
npm run db:seed      # idempotent; loads prototype data + 5 demo users
```
Demo users (all magic-link only, no password):
`gc@msipay.demo` (gc), `sub@msipay.demo` (sub), `owner@msipay.demo` (owner),
`accounting@msipay.demo` (accounting), `bcaufield@gmail.com` (gc).

Inspect/mutate data directly when needed:
```bash
docker exec msipay-pg psql -U postgres -d msipay -c "SELECT id, billed_cents FROM invoice;"
```
Note: monetary columns are integer CENTS (e.g. 9200000 = $92,000).

## 3. Run the dev server + grab the magic link
```bash
npm run dev 2>&1 | tee /tmp/msipay-dev.log &
```
Sign in flow: visit any protected route (e.g. `/gc/dashboard`) → redirected to `/signin`
→ enter a demo email → "Check your email" page. Because `AUTH_RESEND_KEY` is unset, the
link is printed to the server console instead of emailed. Extract it:
```bash
grep -ao "http://localhost:3000/api/auth/callback/resend[^ ]*" /tmp/msipay-dev.log | tail -1
```
Open that URL in the browser to complete login. (If Resend delivery itself is broken in
future, this console fallback in `auth.ts` `sendVerificationRequest` is the workaround.)

## 4. Key assertions worth re-checking
- Logged out → protected routes redirect to `/signin`.
- After login, sidebar shows "Signed in as <email>" + the role label.
- Role guard: a user of role X visiting `/<otherRole>/...` is redirected to their own
  `/<X>/...` area (logic in `app/[role]/layout.tsx`).
- Data is LIVE from Postgres (adversarial): `UPDATE invoice SET billed_cents=12345600
  WHERE id='INV-0041';` then reload `/gc/invoices` — the "This draw" cell must change to
  `$123,456`. Restore afterward. Seeded values alone do NOT prove DB wiring because the
  seed mirrors the old static data.
- Sign out → `/signin`, and protected routes are blocked again.

## Notes / gotchas
- Vercel CI may show red due to a Root Directory misconfig (must be set to `msipay-app`);
  this is a project setting, unrelated to app code.
- `next lint` may prompt to configure ESLint interactively (Next 16); use `npx tsc
  --noEmit` for a non-interactive type check.
- Panels are async server components and `[role]/[panel]` is `force-dynamic`, so a reload
  re-queries the DB (no rebuild needed to see data changes).

## Devin Secrets Needed
- For local testing: none (Docker Postgres + dev console magic link).
- For testing against real services: `DATABASE_URL` (Neon pooled string) and
  `AUTH_RESEND_KEY` (Resend API key), plus optionally `AUTH_EMAIL_FROM`.
