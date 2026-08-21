CREATE TYPE "public"."availability_reason" AS ENUM('INCHIRIAT', 'MENTENANTA', 'REZERVAT');--> statement-breakpoint
CREATE TYPE "public"."equipment_status" AS ENUM('DE_VANZARE', 'DE_INCHIRIAT', 'DE_VANZARE_SI_INCHIRIAT', 'INDISPONIBIL', 'VANDUT', 'INCHIRIAT');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('NOU', 'CONTACTAT', 'OFERTA_TRIMISA', 'NEGOCIERE', 'CASTIGAT', 'PIERDUT');--> statement-breakpoint
CREATE TYPE "public"."rental_status" AS ENUM('SOLICITAT', 'CONFIRMAT', 'ACTIV', 'FINALIZAT', 'ANULAT');--> statement-breakpoint
CREATE TYPE "public"."request_type" AS ENUM('VANZARE', 'INCHIRIERE', 'GENERAL');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'VANZARI');--> statement-breakpoint
CREATE TABLE "availability_blocks" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"equipment_id" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"reason" "availability_reason" DEFAULT 'REZERVAT' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brands" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"slug" varchar(140) NOT NULL,
	"logo_url" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"slug" varchar(140) NOT NULL,
	"description" text,
	"image" text,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "equipment" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" text NOT NULL,
	"brand_id" text,
	"model" varchar(160) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"year" integer,
	"hours" integer,
	"description" text,
	"location" varchar(160),
	"sale_price" numeric(12, 2),
	"rental_price_day" numeric(12, 2),
	"rental_price_week" numeric(12, 2),
	"rental_price_month" numeric(12, 2),
	"status" "equipment_status" DEFAULT 'DE_VANZARE' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"meta_title" varchar(220),
	"meta_description" varchar(400),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "equipment_images" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"equipment_id" text NOT NULL,
	"image_url" text NOT NULL,
	"alt_text" varchar(200),
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "equipment_specifications" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"equipment_id" text NOT NULL,
	"spec_key" varchar(120) NOT NULL,
	"spec_value" varchar(200) NOT NULL,
	"spec_group" varchar(80),
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"equipment_id" text,
	"customer_name" varchar(140) NOT NULL,
	"company" varchar(160),
	"email" varchar(190) NOT NULL,
	"phone" varchar(40) NOT NULL,
	"request_type" "request_type" DEFAULT 'GENERAL' NOT NULL,
	"start_date" date,
	"end_date" date,
	"project_location" varchar(200),
	"quantity" integer DEFAULT 1,
	"message" text,
	"gdpr_consent" boolean DEFAULT false NOT NULL,
	"status" "lead_status" DEFAULT 'NOU' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rentals" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"equipment_id" text NOT NULL,
	"lead_id" text,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"status" "rental_status" DEFAULT 'SOLICITAT' NOT NULL,
	"estimated_price" numeric(12, 2),
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"company_name" varchar(160) DEFAULT 'PVC CONSTRUCT SRL' NOT NULL,
	"cui" varchar(20),
	"reg_com" varchar(40),
	"euid" varchar(60),
	"founded_at" date,
	"county" varchar(80),
	"city" varchar(120),
	"address" text,
	"postal_code" varchar(20),
	"phone" varchar(40),
	"email" varchar(190),
	"logo_url" text,
	"hero_headline" varchar(200),
	"hero_subheadline" varchar(300),
	"hero_image_url" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "spec_templates" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" text NOT NULL,
	"spec_key" varchar(120) NOT NULL,
	"spec_label" varchar(160) NOT NULL,
	"unit" varchar(40),
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"email" varchar(190) NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'VANZARI' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "availability_blocks" ADD CONSTRAINT "availability_blocks_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_images" ADD CONSTRAINT "equipment_images_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_specifications" ADD CONSTRAINT "equipment_specifications_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rentals" ADD CONSTRAINT "rentals_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rentals" ADD CONSTRAINT "rentals_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spec_templates" ADD CONSTRAINT "spec_templates_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "availability_blocks_equipment_idx" ON "availability_blocks" USING btree ("equipment_id");--> statement-breakpoint
CREATE UNIQUE INDEX "brands_slug_idx" ON "brands" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "equipment_slug_idx" ON "equipment" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "equipment_category_idx" ON "equipment" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "equipment_status_idx" ON "equipment" USING btree ("status");--> statement-breakpoint
CREATE INDEX "equipment_images_equipment_idx" ON "equipment_images" USING btree ("equipment_id");--> statement-breakpoint
CREATE INDEX "equipment_specs_equipment_idx" ON "equipment_specifications" USING btree ("equipment_id");--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "leads_equipment_idx" ON "leads" USING btree ("equipment_id");--> statement-breakpoint
CREATE INDEX "rentals_equipment_idx" ON "rentals" USING btree ("equipment_id");--> statement-breakpoint
CREATE INDEX "rentals_status_idx" ON "rentals" USING btree ("status");--> statement-breakpoint
CREATE INDEX "spec_templates_category_idx" ON "spec_templates" USING btree ("category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");