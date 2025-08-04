import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { AddVendorModal } from "@/components/AddVendorModal";
import { RefreshProgress } from "@/components/RefreshProgress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, User, Calendar, DollarSign, CheckCircle, Plus } from "lucide-react";
import { type CompetitorWithPlans, type DashboardStats, type PricingPlan } from "@shared/schema";

export default function Dashboard() {
  const [planFilter, setPlanFilter] = useState<"individuals" | "groups">("individuals");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [showRefreshProgress, setShowRefreshProgress] = useState(false);

  const { data: competitors, isLoading: competitorsLoading } = useQuery<CompetitorWithPlans[]>({
    queryKey: ['/api/competitors']
  });

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats']
  });

  // Filter and organize plans based on current filters
  const getFilteredPlans = (competitorPlans: PricingPlan[]) => {
    return competitorPlans.filter(plan => 
      plan.target === planFilter && plan.billingPeriod === billingPeriod
    );
  };

  const formatPrice = (price: number | null) => {
    if (!price) return "Free";
    if (billingPeriod === "annual") {
      const monthlyPrice = Math.round(price / 12 / 100);
      return `$${monthlyPrice}/mo`;
    }
    return `$${Math.round(price / 100)}/mo`;
  };

  const getDisplayPrice = (price: number | null) => {
    if (!price) return "Free";
    if (billingPeriod === "annual") {
      return `$${Math.round(price / 100)}/year`;
    }
    return `$${Math.round(price / 100)}/month`;
  };

  const handleVendorAdded = () => {
    setShowAddVendor(false);
    setShowRefreshProgress(true);
  };

  const handleRefreshComplete = () => {
    setShowRefreshProgress(false);
  };

  if (competitorsLoading || statsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-dashboard-bg" data-testid="dashboard-container">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header />
        
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Scribe Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Compare AI medical scribe products and their pricing plans
            </p>
          </div>
          
          {/* Pricing Plans Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                AI Scribe Pricing Comparison
              </CardTitle>
              <CardDescription>
                Compare pricing plans across different AI medical scribe vendors
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filter Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Tabs value={planFilter} onValueChange={(value) => setPlanFilter(value as "individuals" | "groups")}>
                    <TabsList className="grid w-64 grid-cols-2">
                      <TabsTrigger value="individuals" className="flex items-center gap-2" data-testid="filter-individuals">
                        <User className="w-4 h-4" />
                        Individuals
                      </TabsTrigger>
                      <TabsTrigger value="groups" className="flex items-center gap-2" data-testid="filter-groups">
                        <Users className="w-4 h-4" />
                        Groups
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <Button
                    onClick={() => setShowAddVendor(true)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    data-testid="add-vendor-button"
                  >
                    <Plus className="w-4 h-4" />
                    Add Vendor
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={billingPeriod === "monthly" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBillingPeriod("monthly")}
                    data-testid="billing-monthly"
                    className="flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Monthly
                  </Button>
                  <Button
                    variant={billingPeriod === "annual" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBillingPeriod("annual")}
                    data-testid="billing-annual"
                    className="flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Annual
                  </Button>
                </div>
              </div>

              {/* Vertical Pricing Cards */}
              <div className="space-y-6" data-testid="pricing-plans-grid">
                {competitors?.map((competitor) => {
                  const filteredPlans = getFilteredPlans(competitor.plans);
                  const freePlan = competitor.plans.find(plan => plan.price === 0 && plan.target === "individuals");
                  const plansToShow = planFilter === "individuals" && freePlan ? [freePlan, ...filteredPlans.filter(p => p.id !== freePlan.id)] : filteredPlans;
                  
                  return (
                    <Card key={competitor.id} className="relative" data-testid={`pricing-card-${competitor.id}`}>
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-white border border-gray-200 shadow-sm">
                              {competitor.name.includes("Heidi") ? (
                                <img 
                                  src="https://www.heidihealth.com/favicon.ico" 
                                  alt="Heidi Health Logo" 
                                  className="w-10 h-10"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling.style.display = 'block';
                                  }}
                                />
                              ) : competitor.name.includes("Freed") ? (
                                <img 
                                  src="https://cdn.prod.website-files.com/6626cd90a59907680f6ccb64/6760822277db164afcfcf749_freed-logo.svg" 
                                  alt="Freed AI Logo" 
                                  className="w-10 h-10"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling.style.display = 'block';
                                  }}
                                />
                              ) : (
                                <img 
                                  src="https://sunoh.ai/favicon.ico" 
                                  alt="Sunoh AI Logo" 
                                  className="w-10 h-10"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling.style.display = 'block';
                                  }}
                                />
                              )}
                              {/* Fallback SVG - hidden by default */}
                              <div className="hidden w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 font-bold text-lg">
                                {competitor.name.charAt(0)}
                              </div>
                            </div>
                            <div>
                              <CardTitle className="text-2xl" data-testid={`pricing-title-${competitor.id}`}>
                                {competitor.name}
                              </CardTitle>
                              <CardDescription className="text-base mt-1" data-testid={`pricing-description-${competitor.id}`}>
                                {competitor.description}
                              </CardDescription>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            className="flex items-center gap-2"
                            onClick={() => window.open(competitor.website, '_blank')}
                            data-testid={`visit-website-${competitor.id}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Visit Website
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {plansToShow.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {plansToShow.map((plan) => (
                              <div key={plan.id} className={`p-4 rounded-lg border-2 ${
                                plan.price === 0 ? "border-green-200 bg-green-50" :
                                plan.isPromo ? "border-red-200 bg-red-50" :
                                "border-gray-200 bg-gray-50"
                              }`} data-testid={`plan-${plan.id}`}>
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-lg" data-testid={`plan-name-${plan.id}`}>
                                    {plan.planName}
                                  </h4>
                                  {plan.price === 0 && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Free
                                    </Badge>
                                  )}
                                  {plan.isPromo && (
                                    <Badge variant="destructive" data-testid={`promo-badge-${plan.id}`}>
                                      Limited Time
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-3xl font-bold mb-2" data-testid={`plan-price-${plan.id}`}>
                                  {plan.isPromo && plan.originalPrice ? (
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg text-red-400 line-through">
                                        {formatPrice(plan.originalPrice)}
                                      </span>
                                      <span className="text-red-600">
                                        {formatPrice(plan.price)}
                                      </span>
                                    </div>
                                  ) : (
                                    formatPrice(plan.price)
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-3" data-testid={`plan-billing-${plan.id}`}>
                                  {getDisplayPrice(plan.price)}
                                </p>
                                <ul className="space-y-1 text-sm">
                                  {plan.features?.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2" data-testid={`feature-${plan.id}-${idx}`}>
                                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500" data-testid={`no-plans-${competitor.id}`}>
                            <p>No {planFilter} plans available for {billingPeriod} billing</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <AddVendorModal 
        isOpen={showAddVendor}
        onClose={() => setShowAddVendor(false)}
        onSuccess={handleVendorAdded}
      />
      
      <RefreshProgress 
        isOpen={showRefreshProgress}
        onClose={() => setShowRefreshProgress(false)}
        onComplete={handleRefreshComplete}
      />
    </div>
  );
}
