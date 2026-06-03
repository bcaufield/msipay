CREATE TYPE "public"."invite_status" AS ENUM('pending', 'accepted', 'revoked');--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"role" "role" NOT NULL,
	"status" "invite_status" DEFAULT 'pending' NOT NULL,
	"invited_by_email" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"accepted_at" timestamp,
	CONSTRAINT "invitation_email_unique" UNIQUE("email")
);
