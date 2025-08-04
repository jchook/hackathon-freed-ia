import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCompetitorSchema, 
  insertPricingPlanSchema, 
  insertAlertSchema,
  insertReviewSchema,
  insertReviewSummarySchema,
  insertFeedItemSchema,
  insertSeoDataSchema,
  insertSharedExperienceSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Competitors
  app.get("/api/competitors", async (req, res) => {
    try {
      const competitors = await storage.getCompetitorsWithPlans();
      res.json(competitors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch competitors" });
    }
  });

  app.post("/api/competitors", async (req, res) => {
    try {
      const validatedData = insertCompetitorSchema.parse(req.body);
      const competitor = await storage.createCompetitor(validatedData);
      res.status(201).json(competitor);
    } catch (error) {
      res.status(400).json({ error: "Invalid competitor data" });
    }
  });

  app.get("/api/competitors/:id", async (req, res) => {
    try {
      const competitor = await storage.getCompetitor(req.params.id);
      if (!competitor) {
        return res.status(404).json({ error: "Competitor not found" });
      }
      res.json(competitor);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch competitor" });
    }
  });

  app.post("/api/competitors", async (req, res) => {
    try {
      const validatedData = insertCompetitorSchema.parse(req.body);
      const competitor = await storage.createCompetitor(validatedData);
      res.status(201).json(competitor);
    } catch (error) {
      res.status(400).json({ error: "Invalid competitor data" });
    }
  });

  // Pricing plans
  app.get("/api/pricing-plans", async (req, res) => {
    try {
      const plans = await storage.getPricingPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pricing plans" });
    }
  });

  app.get("/api/competitors/:id/pricing-plans", async (req, res) => {
    try {
      const plans = await storage.getPricingPlansByCompetitor(req.params.id);
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pricing plans for competitor" });
    }
  });

  app.post("/api/pricing-plans", async (req, res) => {
    try {
      const validatedData = insertPricingPlanSchema.parse(req.body);
      const plan = await storage.createPricingPlan(validatedData);
      res.status(201).json(plan);
    } catch (error) {
      res.status(400).json({ error: "Invalid pricing plan data" });
    }
  });

  // Price history
  app.get("/api/price-history", async (req, res) => {
    try {
      const history = await storage.getPriceHistory();
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch price history" });
    }
  });

  app.get("/api/pricing-plans/:id/history", async (req, res) => {
    try {
      const history = await storage.getPriceHistoryByPlan(req.params.id);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch price history for plan" });
    }
  });

  // Alerts
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  app.get("/api/alerts/unread", async (req, res) => {
    try {
      const alerts = await storage.getUnreadAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch unread alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const validatedData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validatedData);
      res.status(201).json(alert);
    } catch (error) {
      res.status(400).json({ error: "Invalid alert data" });
    }
  });

  app.patch("/api/alerts/:id/read", async (req, res) => {
    try {
      const alert = await storage.markAlertAsRead(req.params.id);
      if (!alert) {
        return res.status(404).json({ error: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      res.status(500).json({ error: "Failed to mark alert as read" });
    }
  });

  // Data refresh endpoint
  app.post("/api/refresh", async (req, res) => {
    try {
      // In a real implementation, this would trigger web scraping
      // For now, we'll just return success
      res.json({ message: "Data refresh initiated", timestamp: new Date().toISOString() });
    } catch (error) {
      res.status(500).json({ error: "Failed to refresh data" });
    }
  });

  // Export functionality
  app.get("/api/export/report", async (req, res) => {
    try {
      const competitors = await storage.getCompetitorsWithPlans();
      const stats = await storage.getDashboardStats();
      
      const reportData = {
        generatedAt: new Date().toISOString(),
        stats,
        competitors,
      };
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="pricing-report.json"');
      res.json(reportData);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate report" });
    }
  });

  // Reviews
  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  app.get("/api/competitors/:id/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByCompetitor(req.params.id);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch competitor reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ error: "Invalid review data" });
    }
  });

  // Review Summaries
  app.get("/api/review-summaries", async (req, res) => {
    try {
      const summaries = await storage.getReviewSummaries();
      res.json(summaries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch review summaries" });
    }
  });

  app.get("/api/competitors/:id/review-summary", async (req, res) => {
    try {
      const summary = await storage.getReviewSummaryByCompetitor(req.params.id);
      if (!summary) {
        return res.status(404).json({ error: "Review summary not found" });
      }
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch review summary" });
    }
  });

  app.post("/api/review-summaries", async (req, res) => {
    try {
      const validatedData = insertReviewSummarySchema.parse(req.body);
      const summary = await storage.createReviewSummary(validatedData);
      res.status(201).json(summary);
    } catch (error) {
      res.status(400).json({ error: "Invalid review summary data" });
    }
  });

  // Enhanced competitors endpoint with reviews
  app.get("/api/competitors-with-reviews", async (req, res) => {
    try {
      const competitors = await storage.getCompetitorsWithReviews();
      res.json(competitors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch competitors with reviews" });
    }
  });

  // Feed items
  app.get("/api/feed", async (req, res) => {
    try {
      const { source, tags } = req.query;
      const tagArray = tags ? (tags as string).split(',').map(t => t.trim()) : [];
      
      let feedItems = source 
        ? await storage.getFeedItemsBySource(source as string)
        : await storage.getFeedItems();
      
      // Filter by tags if provided
      if (tagArray.length > 0) {
        feedItems = feedItems.filter(item => 
          item.tags && item.tags.some(tag => tagArray.includes(tag))
        );
      }
      
      res.json(feedItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch feed items" });
    }
  });

  app.post("/api/feed", async (req, res) => {
    try {
      const validatedData = insertFeedItemSchema.parse(req.body);
      const feedItem = await storage.createFeedItem(validatedData);
      res.status(201).json(feedItem);
    } catch (error) {
      res.status(400).json({ error: "Invalid feed item data" });
    }
  });

  // SEO data
  app.get("/api/seo", async (req, res) => {
    try {
      const { competitorId, pageType } = req.query;
      let seoData;
      
      if (competitorId) {
        seoData = await storage.getSeoDataByCompetitor(competitorId as string);
      } else if (pageType) {
        seoData = await storage.getSeoDataByPageType(pageType as string);
      } else {
        seoData = await storage.getSeoData();
      }
      
      res.json(seoData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch SEO data" });
    }
  });

  app.post("/api/seo", async (req, res) => {
    try {
      const validatedData = insertSeoDataSchema.parse(req.body);
      const seoData = await storage.createSeoData(validatedData);
      res.status(201).json(seoData);
    } catch (error) {
      res.status(400).json({ error: "Invalid SEO data" });
    }
  });

  // Shared Experiences
  app.get("/api/shared-experiences", async (req, res) => {
    try {
      const experiences = await storage.getSharedExperiences();
      res.json(experiences);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shared experiences" });
    }
  });

  app.get("/api/competitors/:id/shared-experiences", async (req, res) => {
    try {
      const experiences = await storage.getSharedExperiencesByCompetitor(req.params.id);
      res.json(experiences);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shared experiences for competitor" });
    }
  });

  app.get("/api/competitors/:id/latest-shared-experience", async (req, res) => {
    try {
      const experience = await storage.getLatestSharedExperience(req.params.id);
      if (!experience) {
        return res.status(404).json({ error: "No shared experience found" });
      }
      res.json(experience);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch latest shared experience" });
    }
  });

  app.post("/api/shared-experiences", async (req, res) => {
    try {
      const validatedData = insertSharedExperienceSchema.parse(req.body);
      const experience = await storage.createSharedExperience(validatedData);
      res.status(201).json(experience);
    } catch (error) {
      res.status(400).json({ error: "Invalid shared experience data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
