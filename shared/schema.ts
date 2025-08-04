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

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  competitorId: varchar("competitor_id").notNull().references(() => competitors.id),
  platform: text("platform").notNull(), // 'trustpilot', 'google', 'capterra', etc.
  rating: integer("rating").notNull(), // 1-5 stars
  title: text("title"),
  content: text("content").notNull(),
  author: text("author"),
  sentiment: text("sentiment"), // 'positive', 'negative', 'neutral'
  highlights: jsonb("highlights").$type<string[]>(),
  isVerified: boolean("is_verified").default(false),
  reviewDate: timestamp("review_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviewSummary = pgTable("review_summary", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  competitorId: varchar("competitor_id").notNull().references(() => competitors.id),
  platform: text("platform").notNull(),
  totalReviews: integer("total_reviews").default(0),
  averageRating: integer("average_rating"), // stored as integer (4.4 = 44)
  sentimentScore: integer("sentiment_score"), // -100 to 100
  commonPraises: jsonb("common_praises").$type<string[]>(),
  commonComplaints: jsonb("common_complaints").$type<string[]>(),
  lastUpdated: timestamp("last_updated").defaultNow(),
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

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSummarySchema = createInsertSchema(reviewSummary).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export const feedItems = pgTable("feed_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  competitorId: varchar("competitor_id").references(() => competitors.id), // null for generic market updates
  title: text("title").notNull(),
  content: text("content").notNull(), // snippet/excerpt
  source: text("source").notNull(), // 'heidi', 'freed', 'sunoh', 'market'
  sourceUrl: text("source_url").notNull(),
  publishedAt: timestamp("published_at").notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFeedItemSchema = createInsertSchema(feedItems).omit({
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

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type ReviewSummary = typeof reviewSummary.$inferSelect;
export type InsertReviewSummary = z.infer<typeof insertReviewSummarySchema>;

export type FeedItem = typeof feedItems.$inferSelect;
export type InsertFeedItem = z.infer<typeof insertFeedItemSchema>;

// SEO Data Table
export const seoData = pgTable("seo_data", {
  id: text("id").primaryKey(),
  competitorId: text("competitor_id").references(() => competitors.id).notNull(),
  pageType: text("page_type").notNull(), // 'homepage', 'pricing', 'about', 'product'
  url: text("url").notNull(),
  title: text("title"),
  metaDescription: text("meta_description"),
  h1Tag: text("h1_tag"),
  h2Tags: text("h2_tags").array(),
  keywords: text("keywords").array(),
  canonicalUrl: text("canonical_url"),
  ogTitle: text("og_title"),
  ogDescription: text("og_description"),
  ogImage: text("og_image"),
  twitterTitle: text("twitter_title"),
  twitterDescription: text("twitter_description"),
  twitterImage: text("twitter_image"),
  schemaMarkup: text("schema_markup"),
  domainRating: integer("domain_rating"), // Ahrefs Domain Rating (0-100)
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSeoDataSchema = createInsertSchema(seoData).omit({ 
  id: true, 
  createdAt: true 
});

export type SeoData = typeof seoData.$inferSelect;
export type InsertSeoData = z.infer<typeof insertSeoDataSchema>;

// Combined types for API responses
export type CompetitorWithPlans = Competitor & {
  plans: PricingPlan[];
  reviewSummary?: ReviewSummary;
};

export type CompetitorWithReviews = Competitor & {
  plans: PricingPlan[];
  reviews: Review[];
  reviewSummary?: ReviewSummary;
};

export type DashboardStats = {
  competitorsTracked: number;
  averagePrice: number;
  priceChanges: number;
  marketPosition: number;
  priceChangePercentage: number;
  averageCustomerRating: number;
  totalReviews: number;
};
