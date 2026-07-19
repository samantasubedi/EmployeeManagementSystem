CREATE TYPE "public"."role" AS ENUM('employee', 'manager', 'admin');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(120) NOT NULL,
	"email" varchar(255) NOT NULL,
	"hashedPassword" text NOT NULL,
	"role" "role",
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
