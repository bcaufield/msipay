CREATE TYPE "public"."invoice_status" AS ENUM('pending', 'review', 'approved', 'rejected', 'draft');--> statement-breakpoint
CREATE TYPE "public"."lien_status" AS ENUM('received', 'outstanding');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('gc', 'sub', 'owner', 'accounting');--> statement-breakpoint
CREATE TYPE "public"."sub_status" AS ENUM('active', 'complete');--> statement-breakpoint
CREATE TYPE "public"."waiver_type" AS ENUM('Conditional', 'Unconditional');--> statement-breakpoint
CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "invoice" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"sub_id" text NOT NULL,
	"trade" text NOT NULL,
	"contract_cents" bigint NOT NULL,
	"billed_cents" bigint NOT NULL,
	"pct" integer NOT NULL,
	"status" "invoice_status" NOT NULL,
	"period" text NOT NULL,
	"lien_status" "lien_status" NOT NULL,
	"draw" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sov_line" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"num" text NOT NULL,
	"description" text NOT NULL,
	"value_cents" bigint NOT NULL,
	"prev_cents" bigint NOT NULL,
	"curr_cents" bigint NOT NULL,
	"stored_cents" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subcontractor" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"seq" integer NOT NULL,
	"name" text NOT NULL,
	"trade" text NOT NULL,
	"contract_cents" bigint NOT NULL,
	"billed_cents" bigint NOT NULL,
	"pct" integer NOT NULL,
	"active_count" integer DEFAULT 0 NOT NULL,
	"status" "sub_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	"role" "role" DEFAULT 'gc' NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "waiver" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"sub_id" text NOT NULL,
	"seq" integer NOT NULL,
	"draw" integer NOT NULL,
	"type" "waiver_type" NOT NULL,
	"amount_cents" bigint NOT NULL,
	"status" "lien_status" NOT NULL,
	"date" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_sub_id_subcontractor_id_fk" FOREIGN KEY ("sub_id") REFERENCES "public"."subcontractor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sov_line" ADD CONSTRAINT "sov_line_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subcontractor" ADD CONSTRAINT "subcontractor_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waiver" ADD CONSTRAINT "waiver_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waiver" ADD CONSTRAINT "waiver_sub_id_subcontractor_id_fk" FOREIGN KEY ("sub_id") REFERENCES "public"."subcontractor"("id") ON DELETE cascade ON UPDATE no action;