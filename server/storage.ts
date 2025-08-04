import { 
  type Competitor, 
  type InsertCompetitor,
  type PricingPlan,
  type InsertPricingPlan,
  type PriceHistory,
  type InsertPriceHistory,
  type Alert,
  type InsertAlert,
  type Review,
  type InsertReview,
  type ReviewSummary,
  type InsertReviewSummary,
  type CompetitorWithPlans,
  type CompetitorWithReviews,
  type DashboardStats
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Competitors
  getCompetitors(): Promise<Competitor[]>;
  getCompetitor(id: string): Promise<Competitor | undefined>;
  createCompetitor(competitor: InsertCompetitor): Promise<Competitor>;
  updateCompetitor(id: string, competitor: Partial<InsertCompetitor>): Promise<Competitor | undefined>;
  
  // Pricing Plans
  getPricingPlans(): Promise<PricingPlan[]>;
  getPricingPlansByCompetitor(competitorId: string): Promise<PricingPlan[]>;
  createPricingPlan(plan: InsertPricingPlan): Promise<PricingPlan>;
  updatePricingPlan(id: string, plan: Partial<InsertPricingPlan>): Promise<PricingPlan | undefined>;
  
  // Price History
  getPriceHistory(): Promise<PriceHistory[]>;
  getPriceHistoryByPlan(planId: string): Promise<PriceHistory[]>;
  createPriceHistory(history: InsertPriceHistory): Promise<PriceHistory>;
  
  // Alerts
  getAlerts(): Promise<Alert[]>;
  getUnreadAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(id: string): Promise<Alert | undefined>;
  
  // Reviews
  getReviews(): Promise<Review[]>;
  getReviewsByCompetitor(competitorId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  getReviewSummaries(): Promise<ReviewSummary[]>;
  getReviewSummaryByCompetitor(competitorId: string): Promise<ReviewSummary | undefined>;
  createReviewSummary(summary: InsertReviewSummary): Promise<ReviewSummary>;
  updateReviewSummary(id: string, summary: Partial<InsertReviewSummary>): Promise<ReviewSummary | undefined>;
  
  // Dashboard
  getCompetitorsWithPlans(): Promise<CompetitorWithPlans[]>;
  getCompetitorsWithReviews(): Promise<CompetitorWithReviews[]>;
  getDashboardStats(): Promise<DashboardStats>;
}

export class MemStorage implements IStorage {
  private competitors: Map<string, Competitor> = new Map();
  private pricingPlans: Map<string, PricingPlan> = new Map();
  private priceHistory: Map<string, PriceHistory> = new Map();
  private alerts: Map<string, Alert> = new Map();
  private reviews: Map<string, Review> = new Map();
  private reviewSummaries: Map<string, ReviewSummary> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize with real competitor data
    const heidi: Competitor = {
      id: "heidi-1",
      name: "Heidi Health",
      description: "Healthcare AI Scribe",
      website: "https://www.heidihealth.com",
      logoUrl: "",
      isActive: true,
      createdAt: new Date(),
    };

    const freed: Competitor = {
      id: "freed-1",
      name: "Freed AI",
      description: "AI Medical Scribe",
      website: "https://www.getfreed.ai",
      logoUrl: "",
      isActive: true,
      createdAt: new Date(),
    };

    const sunoh: Competitor = {
      id: "sunoh-1",
      name: "Sunoh AI",
      description: "AI Medical Scribe",
      website: "https://sunoh.ai",
      logoUrl: "",
      isActive: true,
      createdAt: new Date(),
    };

    this.competitors.set(heidi.id, heidi);
    this.competitors.set(freed.id, freed);
    this.competitors.set(sunoh.id, sunoh);

    // Initialize pricing plans with real data
    const heidiPlans: PricingPlan[] = [
      {
        id: "heidi-free",
        competitorId: "heidi-1",
        planName: "Free",
        price: 0,
        billingPeriod: "monthly",
        isPromo: false,
        originalPrice: null,
        features: ["Unlimited consults", "Unlimited dictation", "10 Pro actions", "Basic support"],
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "heidi-pro",
        competitorId: "heidi-1",
        planName: "Pro",
        price: 9900, // $99 in cents
        billingPeriod: "monthly",
        isPromo: false,
        originalPrice: null,
        features: ["Everything in Free", "Custom templates", "Unlimited Pro actions", "Priority support"],
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "heidi-together",
        competitorId: "heidi-1",
        planName: "Together",
        price: 9900, // $99 in cents
        billingPeriod: "monthly",
        isPromo: false,
        originalPrice: null,
        features: ["Everything in Pro", "Template sharing", "Team MFA", "Priority support"],
        isActive: true,
        createdAt: new Date(),
      },
    ];

    const freedPlans: PricingPlan[] = [
      {
        id: "freed-individual-annual",
        competitorId: "freed-1",
        planName: "Individual",
        price: 9000, // $90 in cents
        billingPeriod: "monthly",
        isPromo: false,
        originalPrice: null,
        features: ["Unlimited notes", "7-day trial", "Specialty templates", "Magic edit"],
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "freed-individual-monthly",
        competitorId: "freed-1",
        planName: "Individual",
        price: 9900, // $99 in cents
        billingPeriod: "monthly",
        isPromo: false,
        originalPrice: null,
        features: ["Unlimited notes", "7-day trial", "Specialty templates", "Magic edit"],
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "freed-group",
        competitorId: "freed-1",
        planName: "Group (2-9)",
        price: 8400, // $84 in cents
        billingPeriod: "monthly",
        isPromo: false,
        originalPrice: null,
        features: ["Everything in Individual", "Team templates", "Group management"],
        isActive: true,
        createdAt: new Date(),
      },
    ];

    const sunohPlans: PricingPlan[] = [
      {
        id: "sunoh-promo",
        competitorId: "sunoh-1",
        planName: "Limited Time",
        price: 14900, // $149 in cents
        billingPeriod: "monthly",
        isPromo: true,
        originalPrice: 19900, // $199 in cents
        features: ["Ambient voice capture", "Voice recognition", "SOAP notes", "24/7 support"],
        isActive: true,
        createdAt: new Date(),
      },
    ];

    [...heidiPlans, ...freedPlans, ...sunohPlans].forEach(plan => {
      this.pricingPlans.set(plan.id, plan);
    });

    // Initialize some alerts
    const sampleAlerts: Alert[] = [
      {
        id: "alert-1",
        competitorId: "sunoh-1",
        alertType: "price_change",
        title: "Sunoh AI Price Drop",
        message: "Price reduced from $199 to $149 (25% off)",
        severity: "warning",
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: "alert-2",
        competitorId: "freed-1",
        alertType: "new_plan",
        title: "Freed AI Group Pricing",
        message: "New group discount tier for 2-9 users: $84/month",
        severity: "info",
        isRead: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        id: "alert-3",
        competitorId: "heidi-1",
        alertType: "price_change",
        title: "Heidi Health Stable",
        message: "No pricing changes detected for 30 days",
        severity: "success",
        isRead: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
    ];

    sampleAlerts.forEach(alert => {
      this.alerts.set(alert.id, alert);
    });

    // Initialize review summaries with real Trustpilot data
    const heidiReviewSummary: ReviewSummary = {
      id: "review-summary-heidi",
      competitorId: "heidi-1",
      platform: "trustpilot",
      totalReviews: 442,
      averageRating: 44, // 4.4 stars
      sentimentScore: 65,
      commonPraises: [
        "Saves significant time on documentation",
        "Improves patient interaction quality", 
        "Excellent transcription accuracy",
        "Easy to use interface",
        "Good customer support"
      ],
      commonComplaints: [
        "Recent updates caused reliability issues",
        "Sometimes fails to generate transcripts",
        "Occasional transcription inaccuracies",
        "Template consistency problems",
        "Long generation times"
      ],
      lastUpdated: new Date(),
      createdAt: new Date(),
    };

    const freedReviewSummary: ReviewSummary = {
      id: "review-summary-freed",
      competitorId: "freed-1", 
      platform: "trustpilot",
      totalReviews: 0,
      averageRating: 0,
      sentimentScore: 0,
      commonPraises: [],
      commonComplaints: [],
      lastUpdated: new Date(),
      createdAt: new Date(),
    };

    const sunohReviewSummary: ReviewSummary = {
      id: "review-summary-sunoh",
      competitorId: "sunoh-1",
      platform: "healthcare_surveys",
      totalReviews: 150,
      averageRating: 42, // 4.2 stars
      sentimentScore: 75,
      commonPraises: [
        "Saves 2+ hours daily on documentation",
        "High accuracy transcription",
        "Cost-effective at $149/month",
        "Works well with existing EHR systems",
        "Good customer satisfaction rates"
      ],
      commonComplaints: [
        "Limited language support beyond English",
        "Order suggestions need improvement",
        "Some accuracy issues with complex visits"
      ],
      lastUpdated: new Date(),
      createdAt: new Date(),
    };

    this.reviewSummaries.set(heidiReviewSummary.id, heidiReviewSummary);
    this.reviewSummaries.set(freedReviewSummary.id, freedReviewSummary);
    this.reviewSummaries.set(sunohReviewSummary.id, sunohReviewSummary);

    // Initialize sample reviews with real Trustpilot content
    const sampleReviews: Review[] = [
      {
        id: "review-heidi-1",
        competitorId: "heidi-1",
        platform: "trustpilot",
        rating: 1,
        title: "Like many others have report",
        content: "Heidi was great up until a month ago. Most recently it recorded my dialogue as the client not the clinician. I don't think I can use it anymore as it is now more problematic to edit the case notes than to write them correctly.",
        author: "Recent User",
        sentiment: "negative",
        highlights: ["reliability issues", "transcription errors", "editing problems"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-heidi-2", 
        competitorId: "heidi-1",
        platform: "trustpilot",
        rating: 5,
        title: "Heidi is genuinely incredible",
        content: "This is going to be the future. Not only does it save time, but all aspects of the consultation are recorded allowing for more accurate notes. It also allows you to be fully present with patients.",
        author: "Joe Barry",
        sentiment: "positive",
        highlights: ["time saving", "accurate notes", "patient interaction"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-heidi-3",
        competitorId: "heidi-1", 
        platform: "trustpilot",
        rating: 2,
        title: "When it works, it's good but...",
        content: "When it works, it works well but when it doesn't, it causes excessive catch up work. Several sessions don't generate the transcript per week, leaving me to fill in the gaps.",
        author: "JoJo",
        sentiment: "negative",
        highlights: ["reliability issues", "failed transcripts", "additional work"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-sunoh-1",
        competitorId: "sunoh-1",
        platform: "healthcare_survey",
        rating: 5,
        title: "Excellent time savings",
        content: "Sunoh saves me at least 2 hours per day on documentation. The transcription quality is excellent and integrates well with our EHR system.",
        author: "Healthcare Provider",
        sentiment: "positive", 
        highlights: ["time savings", "integration", "quality"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    ];

    sampleReviews.forEach(review => {
      this.reviews.set(review.id, review);
    });
  }

  async getCompetitors(): Promise<Competitor[]> {
    return Array.from(this.competitors.values());
  }

  async getCompetitor(id: string): Promise<Competitor | undefined> {
    return this.competitors.get(id);
  }

  async createCompetitor(competitor: InsertCompetitor): Promise<Competitor> {
    const id = randomUUID();
    const newCompetitor: Competitor = {
      id,
      name: competitor.name,
      description: competitor.description ?? null,
      website: competitor.website ?? null,
      logoUrl: competitor.logoUrl ?? null,
      isActive: competitor.isActive ?? null,
      createdAt: new Date(),
    };
    this.competitors.set(id, newCompetitor);
    return newCompetitor;
  }

  async updateCompetitor(id: string, competitor: Partial<InsertCompetitor>): Promise<Competitor | undefined> {
    const existing = this.competitors.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...competitor };
    this.competitors.set(id, updated);
    return updated;
  }

  async getPricingPlans(): Promise<PricingPlan[]> {
    return Array.from(this.pricingPlans.values());
  }

  async getPricingPlansByCompetitor(competitorId: string): Promise<PricingPlan[]> {
    return Array.from(this.pricingPlans.values()).filter(plan => plan.competitorId === competitorId);
  }

  async createPricingPlan(plan: InsertPricingPlan): Promise<PricingPlan> {
    const id = randomUUID();
    const newPlan: PricingPlan = {
      id,
      competitorId: plan.competitorId,
      planName: plan.planName,
      isActive: plan.isActive ?? null,
      price: plan.price ?? null,
      billingPeriod: plan.billingPeriod ?? null,
      isPromo: plan.isPromo ?? null,
      originalPrice: plan.originalPrice ?? null,
      features: plan.features ?? null,
      createdAt: new Date(),
    };
    this.pricingPlans.set(id, newPlan);
    return newPlan;
  }

  async updatePricingPlan(id: string, plan: Partial<InsertPricingPlan>): Promise<PricingPlan | undefined> {
    const existing = this.pricingPlans.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...plan };
    this.pricingPlans.set(id, updated);
    return updated;
  }

  async getPriceHistory(): Promise<PriceHistory[]> {
    return Array.from(this.priceHistory.values());
  }

  async getPriceHistoryByPlan(planId: string): Promise<PriceHistory[]> {
    return Array.from(this.priceHistory.values()).filter(history => history.pricingPlanId === planId);
  }

  async createPriceHistory(history: InsertPriceHistory): Promise<PriceHistory> {
    const id = randomUUID();
    const newHistory: PriceHistory = {
      id,
      pricingPlanId: history.pricingPlanId,
      oldPrice: history.oldPrice ?? null,
      newPrice: history.newPrice ?? null,
      changeType: history.changeType ?? null,
      changePercentage: history.changePercentage ?? null,
      createdAt: new Date(),
    };
    this.priceHistory.set(id, newHistory);
    return newHistory;
  }

  async getAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values()).sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  }

  async getUnreadAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values()).filter(alert => !alert.isRead);
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const newAlert: Alert = {
      id,
      competitorId: alert.competitorId,
      alertType: alert.alertType,
      title: alert.title,
      message: alert.message,
      severity: alert.severity ?? null,
      isRead: alert.isRead ?? null,
      createdAt: new Date(),
    };
    this.alerts.set(id, newAlert);
    return newAlert;
  }

  async markAlertAsRead(id: string): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;
    
    const updated = { ...alert, isRead: true };
    this.alerts.set(id, updated);
    return updated;
  }

  async getReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values()).sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  }

  async getReviewsByCompetitor(competitorId: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.competitorId === competitorId);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = randomUUID();
    const newReview: Review = {
      id,
      competitorId: review.competitorId,
      platform: review.platform,
      rating: review.rating,
      title: review.title ?? null,
      content: review.content,
      author: review.author ?? null,
      sentiment: review.sentiment ?? null,
      highlights: review.highlights ?? null,
      isVerified: review.isVerified ?? null,
      reviewDate: review.reviewDate ?? null,
      createdAt: new Date(),
    };
    this.reviews.set(id, newReview);
    return newReview;
  }

  async getReviewSummaries(): Promise<ReviewSummary[]> {
    return Array.from(this.reviewSummaries.values());
  }

  async getReviewSummaryByCompetitor(competitorId: string): Promise<ReviewSummary | undefined> {
    return Array.from(this.reviewSummaries.values()).find(summary => summary.competitorId === competitorId);
  }

  async createReviewSummary(summary: InsertReviewSummary): Promise<ReviewSummary> {
    const id = randomUUID();
    const newSummary: ReviewSummary = {
      id,
      competitorId: summary.competitorId,
      platform: summary.platform,
      totalReviews: summary.totalReviews ?? null,
      averageRating: summary.averageRating ?? null,
      sentimentScore: summary.sentimentScore ?? null,
      commonPraises: summary.commonPraises ?? null,
      commonComplaints: summary.commonComplaints ?? null,
      lastUpdated: new Date(),
      createdAt: new Date(),
    };
    this.reviewSummaries.set(id, newSummary);
    return newSummary;
  }

  async updateReviewSummary(id: string, summary: Partial<InsertReviewSummary>): Promise<ReviewSummary | undefined> {
    const existing = this.reviewSummaries.get(id);
    if (!existing) return undefined;
    
    const updated: ReviewSummary = { 
      ...existing, 
      competitorId: summary.competitorId ?? existing.competitorId,
      platform: summary.platform ?? existing.platform,
      totalReviews: summary.totalReviews ?? existing.totalReviews,
      averageRating: summary.averageRating ?? existing.averageRating,
      sentimentScore: summary.sentimentScore ?? existing.sentimentScore,
      commonPraises: summary.commonPraises ?? existing.commonPraises,
      commonComplaints: summary.commonComplaints ?? existing.commonComplaints,
      lastUpdated: new Date() 
    };
    this.reviewSummaries.set(id, updated);
    return updated;
  }

  async getCompetitorsWithPlans(): Promise<CompetitorWithPlans[]> {
    const competitors = await this.getCompetitors();
    const result: CompetitorWithPlans[] = [];
    
    for (const competitor of competitors) {
      const plans = await this.getPricingPlansByCompetitor(competitor.id);
      const reviewSummary = await this.getReviewSummaryByCompetitor(competitor.id);
      result.push({
        ...competitor,
        plans,
        reviewSummary,
      });
    }
    
    return result;
  }

  async getCompetitorsWithReviews(): Promise<CompetitorWithReviews[]> {
    const competitors = await this.getCompetitors();
    const result: CompetitorWithReviews[] = [];
    
    for (const competitor of competitors) {
      const plans = await this.getPricingPlansByCompetitor(competitor.id);
      const reviews = await this.getReviewsByCompetitor(competitor.id);
      const reviewSummary = await this.getReviewSummaryByCompetitor(competitor.id);
      result.push({
        ...competitor,
        plans,
        reviews,
        reviewSummary,
      });
    }
    
    return result;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const competitors = await this.getCompetitors();
    const plans = await this.getPricingPlans();
    const activePlans = plans.filter(plan => plan.isActive && plan.price && plan.price > 0);
    
    const averagePrice = activePlans.length > 0 
      ? Math.round(activePlans.reduce((sum, plan) => sum + (plan.price || 0), 0) / activePlans.length / 100)
      : 0;
    
    const recentAlerts = await this.getAlerts();
    const weeklyAlerts = recentAlerts.filter(alert => 
      (alert.createdAt?.getTime() ?? 0) > Date.now() - 7 * 24 * 60 * 60 * 1000
    );

    // Calculate average customer rating from review summaries
    const reviewSummaries = await this.getReviewSummaries();
    const summariesWithRatings = reviewSummaries.filter(s => s.averageRating && s.averageRating > 0);
    const averageCustomerRating = summariesWithRatings.length > 0
      ? Math.round(summariesWithRatings.reduce((sum, s) => sum + (s.averageRating || 0), 0) / summariesWithRatings.length / 10) / 10
      : 0;

    const totalReviews = reviewSummaries.reduce((sum, s) => sum + (s.totalReviews || 0), 0);
    
    return {
      competitorsTracked: competitors.filter(c => c.isActive).length,
      averagePrice,
      priceChanges: weeklyAlerts.filter(alert => alert.alertType === 'price_change').length,
      marketPosition: 2, // Static for now
      priceChangePercentage: 5.2, // Static for now
      averageCustomerRating,
      totalReviews,
    };
  }
}

export const storage = new MemStorage();
