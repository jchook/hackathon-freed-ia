import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const competitors = pgTable("competitors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  website: text("website"),
  logoUrl: text("logo_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pricingPlans = pgTable("pricing_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  competitorId: varchar("competitor_id").notNull().references(() => competitors.id),
  planName: text("plan_name").notNull(),
  price: integer("price"), // in cents
  billingPeriod: text("billing_period"), // 'monthly', 'annual'
  isPromo: boolean("is_promo").default(false),
  originalPrice: integer("original_price"), // in cents, for promo pricing
  features: jsonb("features").$type<string[]>(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const priceHistory = pgTable("price_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pricingPlanId: varchar("pricing_plan_id").notNull().references(() => pricingPlans.id),
  oldPrice: integer("old_price"),
  newPrice: integer("new_price"),
  changeType: text("change_type"), // 'increase', 'decrease', 'no_change'
  changePercentage: integer("change_percentage"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  competitorId: varchar("competitor_id").notNull().references(() => competitors.id),
  alertType: text("alert_type").notNull(), // 'price_change', 'new_plan', 'promo_detected'
  title: text("title").notNull(),
  message: text("message").notNull(),
  severity: text("severity").default('info'), // 'info', 'warning', 'error', 'success'
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertCompetitorSchema = createInsertSchema(competitors).omit({
  id: true,
  createdAt: true,
});

export const insertPricingPlanSchema = createInsertSchema(pricingPlans).omit({
  id: true,
  createdAt: true,
});

export const insertPriceHistorySchema = createInsertSchema(priceHistory).omit({
  id: true,
  createdAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

// Types
export type Competitor = typeof competitors.$inferSelect;
export type InsertCompetitor = z.infer<typeof insertCompetitorSchema>;

export type PricingPlan = typeof pricingPlans.$inferSelect;
export type InsertPricingPlan = z.infer<typeof insertPricingPlanSchema>;

export type PriceHistory = typeof priceHistory.$inferSelect;
export type InsertPriceHistory = z.infer<typeof insertPriceHistorySchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

// Combined types for API responses
export type CompetitorWithPlans = Competitor & {
  plans: PricingPlan[];
};

export type DashboardStats = {
  competitorsTracked: number;
  averagePrice: number;
  priceChanges: number;
  marketPosition: number;
  priceChangePercentage: number;
};
