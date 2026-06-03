import {
  pgTable,
  text,
  integer,
  bigint,
  timestamp,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// --- Enums -----------------------------------------------------------------

export const roleEnum = pgEnum("role", ["gc", "sub", "owner", "accounting"]);
export const invoiceStatusEnum = pgEnum("invoice_status", [
  "pending",
  "review",
  "approved",
  "rejected",
  "draft",
]);
export const lienStatusEnum = pgEnum("lien_status", ["received", "outstanding"]);
export const subStatusEnum = pgEnum("sub_status", ["active", "complete"]);
export const waiverTypeEnum = pgEnum("waiver_type", [
  "Conditional",
  "Unconditional",
]);
export const inviteStatusEnum = pgEnum("invite_status", [
  "pending",
  "accepted",
  "revoked",
]);

// --- Auth.js tables (Drizzle adapter) --------------------------------------

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: roleEnum("role").notNull().default("gc"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ],
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })],
);

// Invite-only access control. A person may sign in only if they already have a
// user row or a pending invitation. On first sign-in the invited role is copied
// onto their new user row and the invite is marked accepted (see auth.ts).
export const invitations = pgTable("invitation", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  role: roleEnum("role").notNull(),
  status: inviteStatusEnum("status").notNull().default("pending"),
  invitedByEmail: text("invited_by_email"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  acceptedAt: timestamp("accepted_at", { mode: "date" }),
});

// --- Domain tables ---------------------------------------------------------
// All monetary values are stored as integer cents — never dollars as floats.

export const projects = pgTable("project", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
});

export const subcontractors = pgTable("subcontractor", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  seq: integer("seq").notNull(),
  name: text("name").notNull(),
  trade: text("trade").notNull(),
  contractCents: bigint("contract_cents", { mode: "number" }).notNull(),
  billedCents: bigint("billed_cents", { mode: "number" }).notNull(),
  pct: integer("pct").notNull(),
  activeCount: integer("active_count").notNull().default(0),
  status: subStatusEnum("status").notNull(),
});

export const invoices = pgTable("invoice", {
  id: text("id").primaryKey(), // human-facing number, e.g. "INV-0041"
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  subId: text("sub_id")
    .notNull()
    .references(() => subcontractors.id, { onDelete: "cascade" }),
  trade: text("trade").notNull(),
  contractCents: bigint("contract_cents", { mode: "number" }).notNull(),
  billedCents: bigint("billed_cents", { mode: "number" }).notNull(),
  pct: integer("pct").notNull(),
  status: invoiceStatusEnum("status").notNull(),
  period: text("period").notNull(),
  lienStatus: lienStatusEnum("lien_status").notNull(),
  draw: integer("draw").notNull(),
});

export const sovLines = pgTable("sov_line", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  num: text("num").notNull(),
  description: text("description").notNull(),
  valueCents: bigint("value_cents", { mode: "number" }).notNull(),
  prevCents: bigint("prev_cents", { mode: "number" }).notNull(),
  currCents: bigint("curr_cents", { mode: "number" }).notNull(),
  storedCents: bigint("stored_cents", { mode: "number" }).notNull(),
});

export const waivers = pgTable("waiver", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  subId: text("sub_id")
    .notNull()
    .references(() => subcontractors.id, { onDelete: "cascade" }),
  seq: integer("seq").notNull(),
  draw: integer("draw").notNull(),
  type: waiverTypeEnum("type").notNull(),
  amountCents: bigint("amount_cents", { mode: "number" }).notNull(),
  status: lienStatusEnum("status").notNull(),
  date: text("date").notNull(),
});
