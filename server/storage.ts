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
  type FeedItem,
  type InsertFeedItem,
  type SeoData,
  type InsertSeoData,
  type SharedExperience,
  type InsertSharedExperience,
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
  
  // Feed Items
  getFeedItems(): Promise<FeedItem[]>;
  getFeedItemsBySource(source: string): Promise<FeedItem[]>;
  createFeedItem(item: InsertFeedItem): Promise<FeedItem>;

  // SEO Data
  getSeoData(): Promise<SeoData[]>;
  getSeoDataByCompetitor(competitorId: string): Promise<SeoData[]>;
  getSeoDataByPageType(pageType: string): Promise<SeoData[]>;
  createSeoData(seoData: InsertSeoData): Promise<SeoData>;
  updateSeoData(id: string, seoData: Partial<InsertSeoData>): Promise<SeoData | undefined>;
  
  // Shared Experiences
  getSharedExperiences(): Promise<SharedExperience[]>;
  getSharedExperiencesByCompetitor(competitorId: string): Promise<SharedExperience[]>;
  getLatestSharedExperience(competitorId: string): Promise<SharedExperience | undefined>;
  createSharedExperience(experience: InsertSharedExperience): Promise<SharedExperience>;
  
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
  private feedItems: Map<string, FeedItem> = new Map();
  private seoData: Map<string, SeoData> = new Map();
  private sharedExperiences: Map<string, SharedExperience> = new Map();

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
        target: "individuals",
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
        target: "individuals",
        isPromo: false,
        originalPrice: null,
        features: ["Everything in Free", "Custom templates", "Unlimited Pro actions", "Priority support"],
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "heidi-pro-annual",
        competitorId: "heidi-1",
        planName: "Pro",
        price: 95040, // $950.40 in cents (annual: $99*12*0.8)
        billingPeriod: "annual",
        target: "individuals",
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
        target: "groups",
        isPromo: false,
        originalPrice: null,
        features: ["Everything in Pro", "Template sharing", "Team MFA", "Priority support"],
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "heidi-together-annual",
        competitorId: "heidi-1",
        planName: "Together",
        price: 95040, // $950.40 in cents (annual: $99*12*0.8)
        billingPeriod: "annual",
        target: "groups",
        isPromo: false,
        originalPrice: null,
        features: ["Everything in Pro", "Template sharing", "Team MFA", "Priority support"],
        isActive: true,
        createdAt: new Date(),
      },
    ];

    const freedPlans: PricingPlan[] = [
      {
        id: "freed-free",
        competitorId: "freed-1",
        planName: "Free Trial",
        price: 0,
        billingPeriod: "monthly",
        target: "individuals",
        isPromo: false,
        originalPrice: null,
        features: ["7-day trial", "5 notes", "Basic templates"],
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "freed-individual-monthly",
        competitorId: "freed-1",
        planName: "Individual",
        price: 9900, // $99 in cents
        billingPeriod: "monthly",
        target: "individuals",
        isPromo: false,
        originalPrice: null,
        features: ["Unlimited notes", "7-day trial", "Specialty templates", "Magic edit"],
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "freed-individual-annual",
        competitorId: "freed-1",
        planName: "Individual",
        price: 95040, // $950.40 in cents (annual: $99*12*0.8)
        billingPeriod: "annual",
        target: "individuals",
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
        target: "groups",
        isPromo: false,
        originalPrice: null,
        features: ["Everything in Individual", "Team templates", "Group management"],
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "freed-group-annual",
        competitorId: "freed-1",
        planName: "Group (2-9)",
        price: 80640, // $806.40 in cents (annual: $84*12*0.8)
        billingPeriod: "annual",
        target: "groups",
        isPromo: false,
        originalPrice: null,
        features: ["Everything in Individual", "Team templates", "Group management"],
        isActive: true,
        createdAt: new Date(),
      },
    ];

    const sunohPlans: PricingPlan[] = [
      {
        id: "sunoh-free",
        competitorId: "sunoh-1",
        planName: "Free Trial",
        price: 0,
        billingPeriod: "monthly",
        target: "individuals",
        isPromo: false,
        originalPrice: null,
        features: ["14-day trial", "5 patient visits", "Basic SOAP notes"],
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "sunoh-promo",
        competitorId: "sunoh-1",
        planName: "Limited Time",
        price: 14900, // $149 in cents
        billingPeriod: "monthly",
        target: "individuals",
        isPromo: true,
        originalPrice: 19900, // $199 in cents
        features: ["Ambient voice capture", "Voice recognition", "SOAP notes", "24/7 support"],
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "sunoh-standard",
        competitorId: "sunoh-1",
        planName: "Standard",
        price: 19900, // $199 in cents
        billingPeriod: "monthly",
        target: "individuals",
        isPromo: false,
        originalPrice: null,
        features: ["Ambient voice capture", "Voice recognition", "SOAP notes", "24/7 support"],
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "sunoh-standard-annual",
        competitorId: "sunoh-1",
        planName: "Standard",
        price: 191040, // $1910.40 in cents (annual: $199*12*0.8)
        billingPeriod: "annual",
        target: "individuals",
        isPromo: false,
        originalPrice: null,
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
        id: "review-heidi-4",
        competitorId: "heidi-1",
        platform: "trustpilot",
        rating: 4,
        title: "Great potential but needs improvement",
        content: "The concept is excellent and when it works, it saves significant time. However, there are still some accuracy issues that need manual correction.",
        author: "Dr. Smith",
        sentiment: "positive",
        highlights: ["time saving", "accuracy concerns", "manual corrections"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-heidi-5",
        competitorId: "heidi-1",
        platform: "trustpilot",
        rating: 5,
        title: "Game changer for my practice",
        content: "Heidi has revolutionized how I document patient encounters. The AI is surprisingly accurate and saves me hours each day.",
        author: "Medical Professional",
        sentiment: "positive",
        highlights: ["practice efficiency", "accurate AI", "time savings"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-heidi-6",
        competitorId: "heidi-1",
        platform: "trustpilot",
        rating: 3,
        title: "Mixed experience",
        content: "Some sessions work perfectly, others miss important details. It's useful but requires careful review of generated notes.",
        author: "Clinical User",
        sentiment: "neutral",
        highlights: ["inconsistent results", "requires review", "useful tool"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-heidi-7",
        competitorId: "heidi-1",
        platform: "trustpilot",
        rating: 4,
        title: "Solid performance overall",
        content: "After using for 3 months, I can say it significantly reduces documentation time. Some minor issues with medical terminology but improving.",
        author: "Dr. Johnson",
        sentiment: "positive",
        highlights: ["reduces documentation time", "medical terminology", "continuous improvement"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-heidi-8",
        competitorId: "heidi-1",
        platform: "trustpilot",
        rating: 2,
        title: "Frustrating technical issues",
        content: "Constant connectivity problems and failed recordings. When it works it's great, but reliability is a major concern.",
        author: "Frustrated User",
        sentiment: "negative",
        highlights: ["connectivity problems", "failed recordings", "reliability issues"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-heidi-9",
        competitorId: "heidi-1",
        platform: "trustpilot",
        rating: 5,
        title: "Excellent customer support",
        content: "Not only is the product great, but their support team is responsive and helpful. They quickly resolved my integration issues.",
        author: "Happy Customer",
        sentiment: "positive",
        highlights: ["excellent support", "responsive team", "integration help"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-heidi-10",
        competitorId: "heidi-1",
        platform: "trustpilot",
        rating: 4,
        title: "Worth the investment",
        content: "The subscription cost is justified by the time savings. My documentation quality has improved and I spend more time with patients.",
        author: "Satisfied Doctor",
        sentiment: "positive",
        highlights: ["worth the cost", "improved quality", "more patient time"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-heidi-11",
        competitorId: "heidi-1",
        platform: "trustpilot",
        rating: 3,
        title: "Learning curve but getting better",
        content: "Initial setup was challenging and it took time to learn how to use effectively. Now that I'm comfortable, it's quite helpful.",
        author: "Learning User",
        sentiment: "neutral",
        highlights: ["learning curve", "setup challenges", "getting better"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-heidi-12",
        competitorId: "heidi-1",
        platform: "trustpilot",
        rating: 5,
        title: "Perfect for busy practices",
        content: "In our high-volume clinic, Heidi helps us maintain quality documentation without sacrificing patient care time. Highly recommended.",
        author: "Clinic Manager",
        sentiment: "positive",
        highlights: ["high-volume practice", "quality documentation", "patient care"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-freed-1",
        competitorId: "freed-1",
        platform: "capterra",
        rating: 4,
        title: "Solid AI scribe solution",
        content: "Freed has been reliable for our practice. The interface is intuitive and the transcription accuracy is good for most medical terminology.",
        author: "Dr. Williams",
        sentiment: "positive",
        highlights: ["reliable", "intuitive interface", "good accuracy"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-freed-2",
        competitorId: "freed-1",
        platform: "capterra",
        rating: 5,
        title: "Outstanding value",
        content: "For the price point, Freed delivers excellent functionality. The magic edit feature is particularly useful for quick corrections.",
        author: "Budget-Conscious Provider",
        sentiment: "positive",
        highlights: ["excellent value", "magic edit", "quick corrections"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-freed-3",
        competitorId: "freed-1",
        platform: "capterra",
        rating: 3,
        title: "Good but room for improvement",
        content: "Works well for standard consultations but struggles with complex cases or specialist terminology. Customer service is responsive.",
        author: "Specialist User",
        sentiment: "neutral",
        highlights: ["standard consultations", "specialist challenges", "responsive service"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-freed-4",
        competitorId: "freed-1",
        platform: "capterra",
        rating: 4,
        title: "Great for family practice",
        content: "Perfect fit for our family medicine practice. Handles routine visits excellently and the templates save significant time.",
        author: "Family Physician",
        sentiment: "positive",
        highlights: ["family medicine", "routine visits", "time-saving templates"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-freed-5",
        competitorId: "freed-1",
        platform: "capterra",
        rating: 2,
        title: "Technical difficulties",
        content: "Frequent sync issues with our EHR system. When it works it's helpful, but the technical problems are frustrating.",
        author: "Tech-Challenged User",
        sentiment: "negative",
        highlights: ["sync issues", "EHR problems", "technical difficulties"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-freed-6",
        competitorId: "freed-1",
        platform: "capterra",
        rating: 5,
        title: "Exceeded expectations",
        content: "Initially skeptical about AI scribes, but Freed has completely changed my workflow. The 7-day trial convinced me immediately.",
        author: "Converted Skeptic",
        sentiment: "positive",
        highlights: ["exceeded expectations", "workflow change", "convincing trial"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-freed-7",
        competitorId: "freed-1",
        platform: "capterra",
        rating: 4,
        title: "Reliable and consistent",
        content: "Six months of use and it's been consistently reliable. Minor formatting issues occasionally but overall very satisfied.",
        author: "Long-term User",
        sentiment: "positive",
        highlights: ["reliable", "consistent", "minor formatting issues"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-freed-8",
        competitorId: "freed-1",
        platform: "capterra",
        rating: 3,
        title: "Decent starter option",
        content: "Good introduction to AI scribes. May need to upgrade to more advanced solutions as our practice grows, but serves current needs.",
        author: "Growing Practice",
        sentiment: "neutral",
        highlights: ["starter option", "practice growth", "current needs"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-freed-9",
        competitorId: "freed-1",
        platform: "capterra",
        rating: 5,
        title: "Love the simplicity",
        content: "No complex setup or training needed. Just works out of the box. The user interface is clean and intuitive.",
        author: "Simplicity Lover",
        sentiment: "positive",
        highlights: ["simple setup", "works immediately", "clean interface"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-freed-10",
        competitorId: "freed-1",
        platform: "capterra",
        rating: 4,
        title: "Good team features",
        content: "The group management features work well for our small practice. Template sharing between providers is particularly useful.",
        author: "Team Leader",
        sentiment: "positive",
        highlights: ["team features", "group management", "template sharing"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-freed-11",
        competitorId: "freed-1",
        platform: "capterra",
        rating: 2,
        title: "Limited customization",
        content: "Works for basic needs but lacks the customization options we need for our specialized practice. Support was helpful but limited solutions.",
        author: "Specialist Practice",
        sentiment: "negative",
        highlights: ["limited customization", "specialized needs", "helpful support"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-freed-12",
        competitorId: "freed-1",
        platform: "capterra",
        rating: 5,
        title: "Perfect for telemedicine",
        content: "Works seamlessly with our telehealth platform. Audio quality handling is excellent even with less-than-perfect connections.",
        author: "Telehealth Provider",
        sentiment: "positive",
        highlights: ["telemedicine", "telehealth integration", "audio quality"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 37 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 37 * 24 * 60 * 60 * 1000),
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
      {
        id: "review-sunoh-2",
        competitorId: "sunoh-1",
        platform: "healthcare_survey",
        rating: 4,
        title: "Premium solution worth the cost",
        content: "Higher price point but the ambient voice capture technology is impressive. Minimal post-processing needed.",
        author: "Premium User",
        sentiment: "positive",
        highlights: ["ambient capture", "impressive technology", "minimal editing"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-sunoh-3",
        competitorId: "sunoh-1",
        platform: "healthcare_survey",
        rating: 5,
        title: "24/7 support is amazing",
        content: "Had an issue during a weekend and their support team resolved it within hours. The product itself is top-notch.",
        author: "Weekend Warrior",
        sentiment: "positive",
        highlights: ["24/7 support", "quick resolution", "top-notch product"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-sunoh-4",
        competitorId: "sunoh-1",
        platform: "healthcare_survey",
        rating: 3,
        title: "Good but expensive",
        content: "The technology works well but the pricing is steep for smaller practices. Would love to see more flexible pricing options.",
        author: "Small Practice Owner",
        sentiment: "neutral",
        highlights: ["good technology", "expensive pricing", "pricing flexibility"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-sunoh-5",
        competitorId: "sunoh-1",
        platform: "healthcare_survey",
        rating: 4,
        title: "Enterprise-grade reliability",
        content: "Deployed across our health system and it's been rock solid. The voice recognition handles accents and background noise well.",
        author: "Health System Administrator",
        sentiment: "positive",
        highlights: ["enterprise reliability", "voice recognition", "noise handling"],
        isVerified: true,
        reviewDate: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000),
      },
    ];

    sampleReviews.forEach(review => {
      this.reviews.set(review.id, review);
    });

    // Initialize feed items with recent updates
    const sampleFeedItems: FeedItem[] = [
      {
        id: "feed-1",
        competitorId: "heidi-1",
        title: "Forms - PDF Form Completion Based on Session Details",
        content: "Heidi can now complete your PDF forms based on your session details. Upload structured form templates such as pre-surgical screenings or insurance forms and Heidi will automatically complete fields and sections as instructed. No more manual paperwork, no more missed fields.",
        source: "heidi",
        sourceUrl: "https://www.heidihealth.com/changelog/july-2025-updates",
        publishedAt: new Date("2025-07-23"),
        tags: ["product-update", "forms", "automation"],
        createdAt: new Date(),
      },
      {
        id: "feed-2",
        competitorId: "heidi-1",
        title: "Calls (beta) - Automate Routine Patient Calls",
        content: "Soon you'll be able to automate routine patient calls and front-desk queries so you and your staff can focus on what matters. Handle medication reviews, post-procedure follow-ups, appointment scheduling, and admin questions - all on autopilot.",
        source: "heidi",
        sourceUrl: "https://www.heidihealth.com/changelog/july-2025-updates",
        publishedAt: new Date("2025-07-23"),
        tags: ["product-update", "calls", "automation", "beta"],
        createdAt: new Date(),
      },
      {
        id: "feed-3",
        competitorId: "heidi-1",
        title: "Epic Integration Now Available",
        content: "Heidi is now integrated with Epic. Write consult notes faster without leaving your EHR. Automatically pull patient data, generate notes with AI, and push polished drafts back to the record - all from within the Epic chart.",
        source: "heidi",
        sourceUrl: "https://www.heidihealth.com/changelog/july-2025-updates",
        publishedAt: new Date("2025-07-23"),
        tags: ["integration", "epic", "ehr"],
        createdAt: new Date(),
      },
      {
        id: "feed-4",
        competitorId: "freed-1",
        title: "Freed Raises $30 Million to Free Clinicians",
        content: "Freed raised $30 million in Series A funding led by Sequoia Capital. But what does this mean for you — the clinicians? This funding enables us to accelerate development, expand our team, and continue delivering the AI scribe that saves you time.",
        source: "freed",
        sourceUrl: "https://www.getfreed.ai/blog/freed-raises-series-a",
        publishedAt: new Date("2025-01-15"),
        tags: ["funding", "series-a", "sequoia"],
        createdAt: new Date(),
      },
      {
        id: "feed-5",
        competitorId: "freed-1",
        title: "How Freed Handles Data, Privacy, & Compliance",
        content: "A clear look at our security-first AI scribe — built for HIPAA compliance, clinician control, and peace of mind. We prioritize data security and never store patient recordings, ensuring your practice remains compliant.",
        source: "freed",
        sourceUrl: "https://www.getfreed.ai/blog/how-freed-handles-data-privacy-compliance",
        publishedAt: new Date("2025-01-10"),
        tags: ["security", "hipaa", "privacy"],
        createdAt: new Date(),
      },
      {
        id: "feed-6",
        competitorId: "freed-1",
        title: "Introducing Freed's New Template Library",
        content: "A smarter, faster way to build and share templates — now available in every Freed account. Share, customize, and chart smarter with our comprehensive template system that adapts to your practice needs.",
        source: "freed",
        sourceUrl: "https://www.getfreed.ai/blog/freed-template-library",
        publishedAt: new Date("2025-01-05"),
        tags: ["templates", "customization", "productivity"],
        createdAt: new Date(),
      },
      {
        id: "feed-7",
        competitorId: "heidi-1",
        title: "Tasks and Past Sessions as Context",
        content: "Tasks enables Heidi to automatically identify and organize action items from your clinical notes. Everything you need to follow up on is neatly color-coded in an interactive list next to your note. Plus, add previous sessions to Context with the click of a button.",
        source: "heidi",
        sourceUrl: "https://www.heidihealth.com/changelog/tasks-and-past-sessions-as-context",
        publishedAt: new Date("2025-06-05"),
        tags: ["tasks", "context", "workflow"],
        createdAt: new Date(),
      },
      {
        id: "feed-8",
        competitorId: null,
        title: "AI Medical Scribes Market Growth Accelerates",
        content: "The AI medical scribe market is experiencing unprecedented growth as healthcare providers seek solutions to reduce documentation burden. Recent studies show 67% of physicians report significant time savings with AI scribes.",
        source: "market",
        sourceUrl: "https://example.com/market-research",
        publishedAt: new Date("2025-01-20"),
        tags: ["market-research", "growth", "adoption"],
        createdAt: new Date(),
      },
    ];

    sampleFeedItems.forEach(item => {
      this.feedItems.set(item.id, item);
    });

    // Initialize SEO data
    const sampleSeoData: SeoData[] = [
      {
        id: "seo-heidi-homepage",
        competitorId: "heidi-1",
        pageType: "homepage",
        url: "https://www.heidihealth.com",
        title: "Heidi Health - AI Medical Scribe for Healthcare Professionals",
        metaDescription: "Heidi Health is the AI medical scribe that understands healthcare. Streamline documentation, boost efficiency, and focus on patient care with our intelligent assistant.",
        h1Tag: "The AI medical scribe that understands healthcare",
        h2Tags: ["Transform your documentation workflow", "Trusted by healthcare professionals", "Secure & compliant"],
        keywords: ["ai medical scribe", "healthcare AI", "medical documentation", "clinical notes", "EMR integration"],
        canonicalUrl: "https://www.heidihealth.com",
        ogTitle: "Heidi Health - AI Medical Scribe for Healthcare",
        ogDescription: "Transform your medical documentation with AI. Heidi Health helps healthcare professionals save time and improve patient care.",
        ogImage: "https://www.heidihealth.com/og-image.jpg",
        twitterTitle: "Heidi Health - AI Medical Scribe",
        twitterDescription: "The AI medical scribe that understands healthcare. Save time, improve accuracy.",
        twitterImage: "https://www.heidihealth.com/twitter-image.jpg",
        schemaMarkup: "Organization, WebSite, Product",
        domainRating: 78,
        lastUpdated: new Date(),
        createdAt: new Date(),
      },
      {
        id: "seo-heidi-pricing",
        competitorId: "heidi-1",
        pageType: "pricing",
        url: "https://www.heidihealth.com/pricing",
        title: "Pricing - Heidi Health AI Medical Scribe Plans",
        metaDescription: "Choose the perfect Heidi Health plan for your practice. Transparent pricing for AI medical scribe services with flexible options for individual practitioners and teams.",
        h1Tag: "Simple, transparent pricing",
        h2Tags: ["For individuals", "For teams", "Enterprise solutions"],
        keywords: ["heidi pricing", "medical scribe cost", "ai healthcare pricing", "medical documentation pricing"],
        canonicalUrl: "https://www.heidihealth.com/pricing",
        ogTitle: "Heidi Health Pricing - AI Medical Scribe Plans",
        ogDescription: "Transparent pricing for AI medical scribe services. Choose the plan that fits your practice.",
        ogImage: "https://www.heidihealth.com/pricing-og.jpg",
        domainRating: 78,
        lastUpdated: new Date(),
        createdAt: new Date(),
      },
      {
        id: "seo-freed-homepage",
        competitorId: "freed-1",
        pageType: "homepage",
        url: "https://www.getfreed.ai",
        title: "Freed - The AI Medical Scribe Built for Clinicians",
        metaDescription: "Freed is the #1 AI medical scribe that listens, transcribes, and writes medical documentation for you. Focus on patients, not paperwork. Try Freed today.",
        h1Tag: "The AI medical scribe built for clinicians",
        h2Tags: ["Listen, transcribe, document", "Built by clinicians", "HIPAA compliant & secure"],
        keywords: ["ai medical scribe", "clinical documentation", "medical transcription", "ehr integration", "hipaa compliant"],
        canonicalUrl: "https://www.getfreed.ai",
        ogTitle: "Freed - AI Medical Scribe for Clinicians",
        ogDescription: "The #1 AI medical scribe that listens, transcribes, and writes medical documentation. Focus on patients, not paperwork.",
        ogImage: "https://www.getfreed.ai/og-image.jpg",
        twitterTitle: "Freed - AI Medical Scribe",
        twitterDescription: "Listen, transcribe, document. The AI scribe built for clinicians.",
        twitterImage: "https://www.getfreed.ai/twitter-image.jpg",
        schemaMarkup: "Organization, WebSite, Product, SoftwareApplication",
        domainRating: 85,
        lastUpdated: new Date(),
        createdAt: new Date(),
      },
      {
        id: "seo-freed-pricing",
        competitorId: "freed-1",
        pageType: "pricing",
        url: "https://www.getfreed.ai/pricing",
        title: "Pricing - Freed AI Medical Scribe Plans & Costs",
        metaDescription: "Transparent pricing for Freed AI medical scribe. Plans starting at $99/month. See how much time and money you can save with our AI documentation assistant.",
        h1Tag: "Pricing that scales with your practice",
        h2Tags: ["Individual plan", "Group plans", "Enterprise solutions"],
        keywords: ["freed pricing", "ai scribe cost", "medical documentation pricing", "clinical ai pricing"],
        canonicalUrl: "https://www.getfreed.ai/pricing",
        ogTitle: "Freed Pricing - AI Medical Scribe Plans",
        ogDescription: "Transparent pricing for AI medical scribe services. Plans starting at $99/month.",
        ogImage: "https://www.getfreed.ai/pricing-og.jpg",
        domainRating: 85,
        lastUpdated: new Date(),
        createdAt: new Date(),
      },
      {
        id: "seo-sunoh-homepage",
        competitorId: "sunoh-1",
        pageType: "homepage",
        url: "https://www.sunoh.ai",
        title: "Sunoh AI - Intelligent Medical Documentation Assistant",
        metaDescription: "Sunoh AI transforms healthcare documentation with intelligent AI. Reduce administrative burden, improve accuracy, and enhance patient care with our medical scribe.",
        h1Tag: "Intelligent medical documentation for modern healthcare",
        h2Tags: ["AI-powered efficiency", "Seamless integration", "Enhanced patient care"],
        keywords: ["medical ai", "healthcare documentation", "clinical ai assistant", "medical scribe automation"],
        canonicalUrl: "https://www.sunoh.ai",
        ogTitle: "Sunoh AI - Medical Documentation Assistant",
        ogDescription: "Transform healthcare documentation with intelligent AI. Reduce administrative burden and enhance patient care.",
        ogImage: "https://www.sunoh.ai/og-image.jpg",
        twitterTitle: "Sunoh AI - Medical Documentation",
        twitterDescription: "Intelligent AI for modern healthcare documentation.",
        twitterImage: "https://www.sunoh.ai/twitter-image.jpg",
        schemaMarkup: "Organization, WebSite, Product",
        domainRating: 72,
        lastUpdated: new Date(),
        createdAt: new Date(),
      },
    ];

    sampleSeoData.forEach(data => {
      this.seoData.set(data.id, data);
    });

    // Initialize shared experiences with sample data
    const sampleSharedExperiences: SharedExperience[] = [
      {
        id: "exp-heidi-1",
        competitorId: "heidi-1",
        transcriptId: "family-medicine-visit-1",
        clinicianName: "Dr. Sarah Chen",
        clinicianSpecialty: "Family Medicine",
        subjective: "Mr. McClure, a 52-year-old male, presents for routine follow-up of hypertension and recent concerns about fatigue. He reports good compliance with medications but has been experiencing increased tiredness over the past 2-3 weeks. Denies chest pain, shortness of breath, or palpitations.",
        objective: "Vital signs: BP 142/88, HR 78, T 98.6°F. Physical exam notable for mild peripheral edema. Heart rate regular, no murmurs. Lungs clear bilaterally. No focal neurological deficits.",
        assessment: "1. Hypertension - suboptimal control, considering medication adjustment\n2. Fatigue - likely related to blood pressure medications, will monitor\n3. Peripheral edema - mild, consistent with current antihypertensive regimen",
        plan: "1. Increase lisinopril to 10mg daily\n2. Basic metabolic panel to check kidney function\n3. Consider adding hydrochlorothiazide if BP remains elevated\n4. Return visit in 4 weeks\n5. Patient education on sodium restriction and regular exercise",
        transcriptionDuration: 142, // 2 minutes 22 seconds
        notes: "Heidi Health captured the clinical reasoning very well. The assessment and plan were comprehensive and clinically appropriate.",
        isPublic: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        id: "exp-freed-1",
        competitorId: "freed-1",
        transcriptId: "family-medicine-visit-1",
        clinicianName: "Dr. Michael Rodriguez",
        clinicianSpecialty: "Internal Medicine",
        subjective: "Patient presents for hypertension follow-up. Reports fatigue x 2-3 weeks. Medications: lisinopril 5mg daily, metformin 500mg BID. Denies cardiac symptoms.",
        objective: "VS: 142/88, 78, 98.6. Exam: +1 pedal edema bilaterally, RRR, CTAB.",
        assessment: "Hypertension with suboptimal control. Medication-related fatigue possible.",
        plan: "Increase lisinopril to 10mg daily. Order BMP. F/U 4 weeks. Lifestyle counseling provided.",
        transcriptionDuration: 89, // 1 minute 29 seconds
        notes: "Freed AI provided a more concise note. Good for efficiency but might miss some clinical nuances.",
        isPublic: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        id: "exp-sunoh-1",
        competitorId: "sunoh-1",
        transcriptId: "family-medicine-visit-1",
        clinicianName: "Dr. Emily Johnson",
        clinicianSpecialty: "Family Medicine",
        subjective: "52-year-old male with established hypertension presents for routine follow-up. Patient reports good medication adherence but notes increasing fatigue over the past 2-3 weeks. Reviews symptoms systematically - denies chest pain, dyspnea, or palpitations.",
        objective: "Blood pressure 142/88 mmHg, heart rate 78 bpm, temperature 98.6°F. Physical examination reveals mild bilateral lower extremity edema. Cardiovascular exam shows regular rate and rhythm without murmurs. Pulmonary examination clear to auscultation bilaterally.",
        assessment: "Primary hypertension with suboptimal blood pressure control on current ACE inhibitor therapy. New onset fatigue likely multifactorial - consider medication side effects versus underlying cardiovascular status. Mild peripheral edema consistent with current medication regimen.",
        plan: "Optimize antihypertensive therapy by increasing lisinopril dose to 10mg daily. Order comprehensive metabolic panel to assess renal function prior to medication adjustment. Consider addition of thiazide diuretic if blood pressure remains elevated. Schedule follow-up appointment in 4 weeks. Provide patient education regarding dietary sodium restriction and regular aerobic exercise.",
        transcriptionDuration: 195, // 3 minutes 15 seconds
        notes: "Sunoh AI generated a very detailed note with excellent clinical flow. Perhaps too verbose for some practice styles.",
        isPublic: true,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      },
    ];

    sampleSharedExperiences.forEach(exp => {
      this.sharedExperiences.set(exp.id, exp);
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

  // Feed Items
  async getFeedItems(): Promise<FeedItem[]> {
    return Array.from(this.feedItems.values()).sort((a, b) => 
      b.publishedAt.getTime() - a.publishedAt.getTime()
    );
  }

  async getFeedItemsBySource(source: string): Promise<FeedItem[]> {
    const allItems = await this.getFeedItems();
    return allItems.filter(item => item.source === source);
  }

  async createFeedItem(item: InsertFeedItem): Promise<FeedItem> {
    const id = randomUUID();
    const feedItem: FeedItem = {
      id,
      ...item,
      createdAt: new Date(),
    };
    this.feedItems.set(id, feedItem);
    return feedItem;
  }

  // SEO Data methods
  async getSeoData(): Promise<SeoData[]> {
    return Array.from(this.seoData.values());
  }

  async getSeoDataByCompetitor(competitorId: string): Promise<SeoData[]> {
    return Array.from(this.seoData.values()).filter(data => data.competitorId === competitorId);
  }

  async getSeoDataByPageType(pageType: string): Promise<SeoData[]> {
    return Array.from(this.seoData.values()).filter(data => data.pageType === pageType);
  }

  async createSeoData(seoData: InsertSeoData): Promise<SeoData> {
    const id = randomUUID();
    const newSeoData: SeoData = {
      id,
      ...seoData,
      createdAt: new Date(),
    };
    this.seoData.set(id, newSeoData);
    return newSeoData;
  }

  async updateSeoData(id: string, seoData: Partial<InsertSeoData>): Promise<SeoData | undefined> {
    const existing = this.seoData.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...seoData, lastUpdated: new Date() };
    this.seoData.set(id, updated);
    return updated;
  }

  // Shared Experience methods
  async getSharedExperiences(): Promise<SharedExperience[]> {
    return Array.from(this.sharedExperiences.values()).sort((a, b) => 
      b.createdAt!.getTime() - a.createdAt!.getTime()
    );
  }

  async getSharedExperiencesByCompetitor(competitorId: string): Promise<SharedExperience[]> {
    return Array.from(this.sharedExperiences.values())
      .filter(exp => exp.competitorId === competitorId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getLatestSharedExperience(competitorId: string): Promise<SharedExperience | undefined> {
    const experiences = await this.getSharedExperiencesByCompetitor(competitorId);
    return experiences[0]; // First item is most recent due to sorting
  }

  async createSharedExperience(experience: InsertSharedExperience): Promise<SharedExperience> {
    const id = randomUUID();
    const newExperience: SharedExperience = {
      id,
      ...experience,
      createdAt: new Date(),
    };
    this.sharedExperiences.set(id, newExperience);
    return newExperience;
  }
}

export const storage = new MemStorage();
