// Seed script: `npm run db:seed`. Idempotent — clears domain tables and the
// demo users, then re-inserts the prototype's data on a single project.

import { inArray } from "drizzle-orm";
import { db } from "./db";
import {
  projects,
  subcontractors,
  invoices,
  sovLines,
  waivers,
  users,
  invitations,
} from "./schema";

const d = (dollars: number) => dollars * 100; // dollars → integer cents

// Demo accounts (one per role). Sign in with any of these via magic link.
const demoUsers: { email: string; name: string; role: "gc" | "sub" | "owner" | "accounting" }[] = [
  { email: "gc@msipay.demo", name: "Pat (GC / PM)", role: "gc" },
  { email: "sub@msipay.demo", name: "Sam (Subcontractor)", role: "sub" },
  { email: "owner@msipay.demo", name: "Olivia (Owner)", role: "owner" },
  { email: "accounting@msipay.demo", name: "Ada (Accounting)", role: "accounting" },
  // Requester — so a real magic link can be delivered to a real inbox.
  { email: "bcaufield@gmail.com", name: "Brian Caufield", role: "gc" },
];

async function main() {
  // --- Reset (FK-safe order) -----------------------------------------------
  await db.delete(invoices);
  await db.delete(waivers);
  await db.delete(sovLines);
  await db.delete(subcontractors);
  await db.delete(projects);
  await db.delete(users).where(
    inArray(
      users.email,
      demoUsers.map((u) => u.email),
    ),
  );
  await db.delete(invitations);

  // --- Invitations (invite-only signup demo) -------------------------------
  // One pending invite so the GC "Team" panel isn't empty. Accepting it (via a
  // magic link) would create a `sub` user.
  await db.insert(invitations).values({
    email: "invitee@msipay.demo",
    role: "sub",
    status: "pending",
    invitedByEmail: "gc@msipay.demo",
  });

  // --- Project -------------------------------------------------------------
  const [project] = await db
    .insert(projects)
    .values({ name: "Palm Beach Warehouse Ph.1" })
    .returning();

  // --- Subcontractors ------------------------------------------------------
  const subRows = await db
    .insert(subcontractors)
    .values([
      { projectId: project.id, seq: 1, name: "Coastal Electric", trade: "Electrical", contractCents: d(184000), billedCents: d(147200), pct: 80, activeCount: 2, status: "active" },
      { projectId: project.id, seq: 2, name: "SunState Plumbing", trade: "Plumbing", contractCents: d(97500), billedCents: d(39000), pct: 40, activeCount: 1, status: "active" },
      { projectId: project.id, seq: 3, name: "Dade Drywall", trade: "Drywall", contractCents: d(62000), billedCents: d(46500), pct: 75, activeCount: 0, status: "active" },
      { projectId: project.id, seq: 4, name: "Tropical HVAC", trade: "HVAC", contractCents: d(143000), billedCents: d(57200), pct: 40, activeCount: 1, status: "active" },
      { projectId: project.id, seq: 5, name: "Boca Concrete", trade: "Concrete", contractCents: d(88000), billedCents: d(88000), pct: 100, activeCount: 0, status: "complete" },
    ])
    .returning();

  const subId = (name: string) => {
    const row = subRows.find((s) => s.name === name);
    if (!row) throw new Error(`Seed error: subcontractor "${name}" not found`);
    return row.id;
  };

  // --- Invoices ------------------------------------------------------------
  await db.insert(invoices).values([
    { id: "INV-0041", projectId: project.id, subId: subId("Coastal Electric"), trade: "Electrical", contractCents: d(184000), billedCents: d(92000), pct: 50, status: "pending", period: "Apr 2026", lienStatus: "outstanding", draw: 4 },
    { id: "INV-0040", projectId: project.id, subId: subId("SunState Plumbing"), trade: "Plumbing", contractCents: d(97500), billedCents: d(29250), pct: 30, status: "review", period: "Apr 2026", lienStatus: "received", draw: 4 },
    { id: "INV-0039", projectId: project.id, subId: subId("Dade Drywall"), trade: "Drywall", contractCents: d(62000), billedCents: d(46500), pct: 75, status: "approved", period: "Mar 2026", lienStatus: "received", draw: 3 },
    { id: "INV-0038", projectId: project.id, subId: subId("Tropical HVAC"), trade: "HVAC", contractCents: d(143000), billedCents: d(57200), pct: 40, status: "approved", period: "Mar 2026", lienStatus: "received", draw: 3 },
    { id: "INV-0037", projectId: project.id, subId: subId("Coastal Electric"), trade: "Electrical", contractCents: d(184000), billedCents: d(55200), pct: 30, status: "approved", period: "Feb 2026", lienStatus: "received", draw: 2 },
    { id: "INV-0036", projectId: project.id, subId: subId("SunState Plumbing"), trade: "Plumbing", contractCents: d(97500), billedCents: d(9750), pct: 10, status: "rejected", period: "Feb 2026", lienStatus: "outstanding", draw: 2 },
  ]);

  // --- Schedule of values --------------------------------------------------
  await db.insert(sovLines).values([
    { projectId: project.id, num: "01", description: "Site Work & Mobilization", valueCents: d(48000), prevCents: d(48000), currCents: d(0), storedCents: d(0) },
    { projectId: project.id, num: "02", description: "Concrete Foundation", valueCents: d(88000), prevCents: d(88000), currCents: d(0), storedCents: d(0) },
    { projectId: project.id, num: "03", description: "Structural Steel", valueCents: d(124000), prevCents: d(96000), currCents: d(0), storedCents: d(0) },
    { projectId: project.id, num: "04", description: "Electrical Rough-In", valueCents: d(92000), prevCents: d(55200), currCents: d(36800), storedCents: d(0) },
    { projectId: project.id, num: "05", description: "Plumbing Rough-In", valueCents: d(48750), prevCents: d(9750), currCents: d(19500), storedCents: d(0) },
    { projectId: project.id, num: "06", description: "Drywall & Framing", valueCents: d(62000), prevCents: d(31000), currCents: d(15500), storedCents: d(0) },
    { projectId: project.id, num: "07", description: "HVAC Equipment", valueCents: d(143000), prevCents: d(57200), currCents: d(0), storedCents: d(0) },
    { projectId: project.id, num: "08", description: "Roofing", valueCents: d(76000), prevCents: d(0), currCents: d(0), storedCents: d(0) },
    { projectId: project.id, num: "09", description: "Finishes & Painting", valueCents: d(41000), prevCents: d(0), currCents: d(0), storedCents: d(0) },
    { projectId: project.id, num: "10", description: "Sitework & Paving", valueCents: d(55000), prevCents: d(0), currCents: d(0), storedCents: d(0) },
  ]);

  // --- Lien waivers --------------------------------------------------------
  await db.insert(waivers).values([
    { projectId: project.id, subId: subId("Coastal Electric"), seq: 1, draw: 3, type: "Conditional", amountCents: d(55200), status: "received", date: "Mar 28, 2026" },
    { projectId: project.id, subId: subId("Dade Drywall"), seq: 2, draw: 3, type: "Conditional", amountCents: d(15500), status: "received", date: "Mar 28, 2026" },
    { projectId: project.id, subId: subId("Tropical HVAC"), seq: 3, draw: 3, type: "Conditional", amountCents: d(57200), status: "received", date: "Mar 29, 2026" },
    { projectId: project.id, subId: subId("SunState Plumbing"), seq: 4, draw: 3, type: "Conditional", amountCents: d(19500), status: "received", date: "Mar 28, 2026" },
    { projectId: project.id, subId: subId("Coastal Electric"), seq: 5, draw: 4, type: "Conditional", amountCents: d(92000), status: "outstanding", date: "—" },
    { projectId: project.id, subId: subId("SunState Plumbing"), seq: 6, draw: 2, type: "Unconditional", amountCents: d(9750), status: "outstanding", date: "—" },
    { projectId: project.id, subId: subId("Boca Concrete"), seq: 7, draw: 1, type: "Unconditional", amountCents: d(88000), status: "received", date: "Jan 15, 2026" },
  ]);

  // --- Demo users ----------------------------------------------------------
  await db.insert(users).values(demoUsers);

  // eslint-disable-next-line no-console
  console.log(
    `Seeded project "${project.name}" with ${subRows.length} subs, 6 invoices, 10 SOV lines, 7 waivers, and ${demoUsers.length} demo users.`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
