# Deploying MSI Pay to Vercel

The app is a stock Next.js 15 project, so Vercel deployment is essentially a
one-click flow. Two paths are documented below: **Git-based (recommended)** and
**CLI (no GitHub required)**.

---

## Prerequisites

- A Vercel account (`https://vercel.com/signup`) — the Hobby tier is free and
  sufficient for this demo.
- Node 20+ locally (matches `.nvmrc` and `engines.node` in `package.json`).
- `msipay-app/` must build cleanly locally: `npm install && npm run build`.

---

## Option A — Git-based deployment (recommended)

This is the path you'll want for the real client engagement: every push to
`main` ships to production, every PR gets a preview URL.

1. **Push the repo to GitHub.**

   From the root of the workspace:

   ```bash
   git init
   git add .
   git commit -m "MSI Pay: initial skeleton"
   git branch -M main
   git remote add origin git@github.com:<your-org>/msipay.git
   git push -u origin main
   ```

2. **Import the project into Vercel.**
   - Go to <https://vercel.com/new>.
   - Pick the GitHub repo.
   - **Root directory:** set to `msipay-app` (important — the Next app is in a
     subfolder, not at repo root).
   - **Framework preset:** Vercel should auto-detect *Next.js*. Leave the
     build/install/output commands as defaults (they match `vercel.json`).
   - Click **Deploy**.

3. **First production URL** appears in ~60 seconds, e.g.
   `https://msipay-<hash>.vercel.app`. Visiting `/` redirects to
   `/gc/dashboard`.

4. **Custom domain (optional).**
   - Project → Settings → Domains → Add `msipay.yourdomain.com`.
   - Add the CNAME record Vercel shows you to your DNS.

5. **Environment variables.** None are required for this skeleton (it has no
   DB or auth yet). Once you wire up Phase 1 backend, copy keys from
   `.env.example` into Project → Settings → Environment Variables, scoping
   them to **Production**, **Preview**, and **Development** as appropriate.

---

## Option B — Vercel CLI (no GitHub)

Useful for a quick share link before the repo is on GitHub.

```bash
npm install --global vercel
cd msipay-app
vercel login
vercel             # creates a preview deployment, prompts for project setup
vercel --prod      # promotes to production
```

When prompted:

- **Set up and deploy?** Yes
- **Which scope?** Your personal/team account
- **Link to existing project?** No (first time)
- **Project name?** `msipay`
- **Code directory?** `./` (you're already inside `msipay-app/`)
- **Override settings?** No

Subsequent `vercel --prod` runs from the same directory will ship to the same
project.

---

## Verifying the deployment

After deploy, hit these URLs to confirm all roles render:

- `/`                          → redirects to `/gc/dashboard`
- `/gc/invoices`
- `/sub/submit`
- `/owner/dashboard`
- `/accounting/dashboard`

Use the **Viewing as** dropdown in the sidebar to switch between roles
client-side.

---

## Build configuration reference

The repo ships with `vercel.json` that pins:

- `framework: nextjs`
- `buildCommand: next build`
- `installCommand: npm install`
- `regions: ["iad1"]` (US East — closest low-latency region for FL-based users)

Change `regions` if your client is on the west coast or in Europe.

---

## What to expect on first deploy

- Build time: **~45–70s** cold, ~25s warm.
- Bundle size: small — this is a server-component app with one client island
  per panel.
- No serverless functions are needed yet; everything is static-rendered or
  server-rendered at the edge.
- Vercel's free tier covers this comfortably until you add a database and
  user traffic.

---

## When you're ready to add a backend

The natural Vercel-friendly stack from `docs/proposal.md`:

| Concern | Service |
|---|---|
| Postgres | Neon (Vercel marketplace integration, $0 to start) |
| File storage | Vercel Blob, or Cloudflare R2 |
| Auth | Auth.js + Resend for magic links |
| Email | Resend |
| Background jobs | Vercel Cron + Inngest (for invoice reminders) |

Each integrates via env vars set in **Project → Settings → Environment
Variables**. The `.env.example` file lists the canonical names to use.
