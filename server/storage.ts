import { 
  type Competitor, 
  type InsertCompetitor,
  type PricingPlan,
  type InsertPricingPlan,
  type PriceHistory,
  type InsertPriceHistory,
  type Alert,
  type InsertAlert,
  type CompetitorWithPlans,
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
  
  // Dashboard
  getCompetitorsWithPlans(): Promise<CompetitorWithPlans[]>;
  getDashboardStats(): Promise<DashboardStats>;
}

export class MemStorage implements IStorage {
  private competitors: Map<string, Competitor> = new Map();
  private pricingPlans: Map<string, PricingPlan> = new Map();
  private priceHistory: Map<string, PriceHistory> = new Map();
  private alerts: Map<string, Alert> = new Map();

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
      ...competitor,
      id,
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
      ...plan,
      id,
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
      ...history,
      id,
      createdAt: new Date(),
    };
    this.priceHistory.set(id, newHistory);
    return newHistory;
  }

  async getAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getUnreadAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values()).filter(alert => !alert.isRead);
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const newAlert: Alert = {
      ...alert,
      id,
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

  async getCompetitorsWithPlans(): Promise<CompetitorWithPlans[]> {
    const competitors = await this.getCompetitors();
    const result: CompetitorWithPlans[] = [];
    
    for (const competitor of competitors) {
      const plans = await this.getPricingPlansByCompetitor(competitor.id);
      result.push({
        ...competitor,
        plans,
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
      alert.createdAt.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    );
    
    return {
      competitorsTracked: competitors.filter(c => c.isActive).length,
      averagePrice,
      priceChanges: weeklyAlerts.filter(alert => alert.alertType === 'price_change').length,
      marketPosition: 2, // Static for now
      priceChangePercentage: 5.2, // Static for now
    };
  }
}

export const storage = new MemStorage();
