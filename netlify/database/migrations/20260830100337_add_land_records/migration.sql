CREATE TABLE "land_records" (
	"id" serial PRIMARY KEY,
	"survey_number" text NOT NULL,
	"village" text,
	"land_extent" numeric(10,2) NOT NULL,
	"extent_unit" text DEFAULT 'acres' NOT NULL,
	"owner_name" text NOT NULL,
	"cultivator_name" text NOT NULL,
	"crop_grown" text,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
