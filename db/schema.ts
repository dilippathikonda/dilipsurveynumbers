import { pgTable, serial, text, numeric, timestamp } from "drizzle-orm/pg-core";

export const landRecords = pgTable("land_records", {
  id: serial().primaryKey(),
  surveyNumber: text("survey_number").notNull(),
  village: text("village"),
  landExtent: numeric("land_extent", { precision: 10, scale: 2 }).notNull(),
  extentUnit: text("extent_unit").notNull().default("acres"),
  ownerName: text("owner_name").notNull(),
  cultivatorName: text("cultivator_name").notNull(),
  cropGrown: text("crop_grown"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});
