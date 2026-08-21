import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  numeric,
  timestamp,
  date,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

/* ==========================================================================
   Enums
   ========================================================================== */

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "VANZARI"]);

export const equipmentStatusEnum = pgEnum("equipment_status", [
  "DE_VANZARE",
  "DE_INCHIRIAT",
  "DE_VANZARE_SI_INCHIRIAT",
  "INDISPONIBIL",
  "VANDUT",
  "INCHIRIAT",
]);

export const requestTypeEnum = pgEnum("request_type", [
  "VANZARE",
  "INCHIRIERE",
  "GENERAL",
]);

export const leadStatusEnum = pgEnum("lead_status", [
  "NOU",
  "CONTACTAT",
  "OFERTA_TRIMISA",
  "NEGOCIERE",
  "CASTIGAT",
  "PIERDUT",
]);

export const rentalStatusEnum = pgEnum("rental_status", [
  "SOLICITAT",
  "CONFIRMAT",
  "ACTIV",
  "FINALIZAT",
  "ANULAT",
]);

export const availabilityReasonEnum = pgEnum("availability_reason", [
  "INCHIRIAT",
  "MENTENANTA",
  "REZERVAT",
]);

/* ==========================================================================
   Users (admin / echipă vânzări)
   ========================================================================== */

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 190 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("VANZARI"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  emailIdx: uniqueIndex("users_email_idx").on(table.email),
}));

/* ==========================================================================
   Categorii de utilaje
   ========================================================================== */

export const categories = pgTable("categories", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 140 }).notNull(),
  description: text("description"),
  image: text("image"),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  slugIdx: uniqueIndex("categories_slug_idx").on(table.slug),
}));

/* ==========================================================================
   Mărci de utilaje (adăugate de admin, fără listă de utilaje inițială)
   ========================================================================== */

export const brands = pgTable("brands", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 140 }).notNull(),
  logoUrl: text("logo_url"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  slugIdx: uniqueIndex("brands_slug_idx").on(table.slug),
}));

/* ==========================================================================
   Utilaje
   ========================================================================== */

export const equipment = pgTable("equipment", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "restrict" }),
  brandId: text("brand_id").references(() => brands.id, {
    onDelete: "set null",
  }),
  model: varchar("model", { length: 160 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull(),
  year: integer("year"),
  hours: integer("hours"),
  description: text("description"),
  location: varchar("location", { length: 160 }),

  salePrice: numeric("sale_price", { precision: 12, scale: 2 }),
  rentalPriceDay: numeric("rental_price_day", { precision: 12, scale: 2 }),
  rentalPriceWeek: numeric("rental_price_week", { precision: 12, scale: 2 }),
  rentalPriceMonth: numeric("rental_price_month", { precision: 12, scale: 2 }),

  status: equipmentStatusEnum("status").notNull().default("DE_VANZARE"),
  featured: boolean("featured").notNull().default(false),

  metaTitle: varchar("meta_title", { length: 220 }),
  metaDescription: varchar("meta_description", { length: 400 }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  slugIdx: uniqueIndex("equipment_slug_idx").on(table.slug),
  categoryIdx: index("equipment_category_idx").on(table.categoryId),
  statusIdx: index("equipment_status_idx").on(table.status),
}));

/* ==========================================================================
   Imagini utilaj
   ========================================================================== */

export const equipmentImages = pgTable("equipment_images", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  equipmentId: text("equipment_id")
    .notNull()
    .references(() => equipment.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  altText: varchar("alt_text", { length: 200 }),
  sortOrder: integer("sort_order").notNull().default(0),
}, (table) => ({
  equipmentIdx: index("equipment_images_equipment_idx").on(table.equipmentId),
}));

/* ==========================================================================
   Specificații tehnice (cheie-valoare, flexibil per categorie)
   ========================================================================== */

export const equipmentSpecifications = pgTable("equipment_specifications", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  equipmentId: text("equipment_id")
    .notNull()
    .references(() => equipment.id, { onDelete: "cascade" }),
  specKey: varchar("spec_key", { length: 120 }).notNull(),
  specValue: varchar("spec_value", { length: 200 }).notNull(),
  specGroup: varchar("spec_group", { length: 80 }),
  sortOrder: integer("sort_order").notNull().default(0),
}, (table) => ({
  equipmentIdx: index("equipment_specs_equipment_idx").on(table.equipmentId),
}));

/* ==========================================================================
   Șabloane de specificații per categorie (ajută admin-ul să nu retape chei)
   ========================================================================== */

export const specTemplates = pgTable("spec_templates", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  specKey: varchar("spec_key", { length: 120 }).notNull(),
  specLabel: varchar("spec_label", { length: 160 }).notNull(),
  unit: varchar("unit", { length: 40 }),
  sortOrder: integer("sort_order").notNull().default(0),
}, (table) => ({
  categoryIdx: index("spec_templates_category_idx").on(table.categoryId),
}));

/* ==========================================================================
   Lead-uri (cereri ofertă / închiriere / general)
   ========================================================================== */

export const leads = pgTable("leads", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  equipmentId: text("equipment_id").references(() => equipment.id, {
    onDelete: "set null",
  }),
  customerName: varchar("customer_name", { length: 140 }).notNull(),
  company: varchar("company", { length: 160 }),
  email: varchar("email", { length: 190 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  requestType: requestTypeEnum("request_type").notNull().default("GENERAL"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  projectLocation: varchar("project_location", { length: 200 }),
  quantity: integer("quantity").default(1),
  message: text("message"),
  gdprConsent: boolean("gdpr_consent").notNull().default(false),
  status: leadStatusEnum("status").notNull().default("NOU"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  statusIdx: index("leads_status_idx").on(table.status),
  equipmentIdx: index("leads_equipment_idx").on(table.equipmentId),
}));

/* ==========================================================================
   Închirieri
   ========================================================================== */

export const rentals = pgTable("rentals", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  equipmentId: text("equipment_id")
    .notNull()
    .references(() => equipment.id, { onDelete: "cascade" }),
  leadId: text("lead_id").references(() => leads.id, {
    onDelete: "set null",
  }),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  status: rentalStatusEnum("status").notNull().default("SOLICITAT"),
  estimatedPrice: numeric("estimated_price", { precision: 12, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  equipmentIdx: index("rentals_equipment_idx").on(table.equipmentId),
  statusIdx: index("rentals_status_idx").on(table.status),
}));

/* ==========================================================================
   Perioade de indisponibilitate (mentenanță, rezervări confirmate)
   ========================================================================== */

export const availabilityBlocks = pgTable("availability_blocks", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  equipmentId: text("equipment_id")
    .notNull()
    .references(() => equipment.id, { onDelete: "cascade" }),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  reason: availabilityReasonEnum("reason").notNull().default("REZERVAT"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  equipmentIdx: index("availability_blocks_equipment_idx").on(
    table.equipmentId
  ),
}));

/* ==========================================================================
   Setări companie (singleton) — editabil din admin: logo, date firmă, hero
   ========================================================================== */

export const settings = pgTable("settings", {
  id: integer("id").primaryKey().default(1),
  companyName: varchar("company_name", { length: 160 })
    .notNull()
    .default("PVC CONSTRUCT SRL"),
  cui: varchar("cui", { length: 20 }),
  regCom: varchar("reg_com", { length: 40 }),
  euid: varchar("euid", { length: 60 }),
  foundedAt: date("founded_at"),
  county: varchar("county", { length: 80 }),
  city: varchar("city", { length: 120 }),
  address: text("address"),
  postalCode: varchar("postal_code", { length: 20 }),
  phone: varchar("phone", { length: 40 }),
  email: varchar("email", { length: 190 }),
  logoUrl: text("logo_url"),
  heroHeadline: varchar("hero_headline", { length: 200 }),
  heroSubheadline: varchar("hero_subheadline", { length: 300 }),
  heroImageUrl: text("hero_image_url"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ==========================================================================
   Relations
   ========================================================================== */

export const categoriesRelations = relations(categories, ({ many }) => ({
  equipment: many(equipment),
  specTemplates: many(specTemplates),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  equipment: many(equipment),
}));

export const equipmentRelations = relations(equipment, ({ one, many }) => ({
  category: one(categories, {
    fields: [equipment.categoryId],
    references: [categories.id],
  }),
  brand: one(brands, {
    fields: [equipment.brandId],
    references: [brands.id],
  }),
  images: many(equipmentImages),
  specifications: many(equipmentSpecifications),
  leads: many(leads),
  rentals: many(rentals),
  availabilityBlocks: many(availabilityBlocks),
}));

export const equipmentImagesRelations = relations(
  equipmentImages,
  ({ one }) => ({
    equipment: one(equipment, {
      fields: [equipmentImages.equipmentId],
      references: [equipment.id],
    }),
  })
);

export const equipmentSpecificationsRelations = relations(
  equipmentSpecifications,
  ({ one }) => ({
    equipment: one(equipment, {
      fields: [equipmentSpecifications.equipmentId],
      references: [equipment.id],
    }),
  })
);

export const specTemplatesRelations = relations(specTemplates, ({ one }) => ({
  category: one(categories, {
    fields: [specTemplates.categoryId],
    references: [categories.id],
  }),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
  equipment: one(equipment, {
    fields: [leads.equipmentId],
    references: [equipment.id],
  }),
  rentals: many(rentals),
}));

export const rentalsRelations = relations(rentals, ({ one }) => ({
  equipment: one(equipment, {
    fields: [rentals.equipmentId],
    references: [equipment.id],
  }),
  lead: one(leads, {
    fields: [rentals.leadId],
    references: [leads.id],
  }),
}));

export const availabilityBlocksRelations = relations(
  availabilityBlocks,
  ({ one }) => ({
    equipment: one(equipment, {
      fields: [availabilityBlocks.equipmentId],
      references: [equipment.id],
    }),
  })
);
