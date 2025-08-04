import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { GitCompare, ExternalLink, CheckCircle, Zap, DollarSign, Star } from "lucide-react";
import { type SeoData, type Competitor, type PricingPlan, type CompetitorWithReviews } from "@shared/schema";

export default function Comparison() {
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>(['heidi-1', 'freed-1']);
  const [selectedPlans, setSelectedPlans] = useState<Record<string, string>>({});

  const { data: seoData, isLoading: seoLoading } = useQuery<SeoData[]>({
    queryKey: ['/api/seo']
  });

  const { data: competitors, isLoading: competitorsLoading } = useQuery<Competitor[]>({
    queryKey: ['/api/competitors']
  });

  const { data: competitorsWithReviews, isLoading: reviewsLoading } = useQuery<CompetitorWithReviews[]>({
    queryKey: ['/api/competitors-with-reviews']
  });

  const { data: pricingPlans, isLoading: pricingLoading } = useQuery<PricingPlan[]>({
    queryKey: ['/api/pricing-plans']
  });

  const isLoading = seoLoading || competitorsLoading || pricingLoading || reviewsLoading;

  const handleCompetitorToggle = (competitorId: string) => {
    setSelectedCompetitors(prev => {
      if (prev.includes(competitorId)) {
        return prev.filter(id => id !== competitorId);
      } else if (prev.length < 3) {
        return [...prev, competitorId];
      }
      return prev;
    });
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(0)}`;
  };

  const getCompetitorData = (competitorId: string) => {
    const competitor = competitors?.find(c => c.id === competitorId);
    const competitorWithReviews = competitorsWithReviews?.find(c => c.id === competitorId);
    const seo = seoData?.find(s => s.competitorId === competitorId && s.pageType === 'homepage');
    const pricing = pricingPlans?.filter(p => p.competitorId === competitorId);
    
    // Calculate average rating from review summary (scale from 50 to 5.0)
    const averageRating = competitorWithReviews?.reviewSummary?.averageRating 
      ? competitorWithReviews.reviewSummary.averageRating / 10 
      : null;
    const totalReviews = competitorWithReviews?.reviewSummary?.totalReviews || 0;
    
    return { competitor, competitorWithReviews, seo, pricing, averageRating, totalReviews };
  };

  // Auto-select cheapest paid plan for individuals when data loads
  useEffect(() => {
    if (pricingPlans && selectedCompetitors.length > 0) {
      const newSelectedPlans: Record<string, string> = {};
      
      selectedCompetitors.forEach(competitorId => {
        // Only set if not already selected
        if (!selectedPlans[competitorId]) {
          const competitorPlans = pricingPlans.filter(p => p.competitorId === competitorId);
          const individualPlans = competitorPlans.filter(p => p.target === 'individuals');
          const paidPlans = individualPlans.filter(p => (p.price || 0) > 0);
          
          if (paidPlans.length > 0) {
            // Find cheapest paid plan
            const cheapestPlan = paidPlans.reduce((prev, current) => 
              ((prev.price || 0) < (current.price || 0)) ? prev : current
            );
            newSelectedPlans[competitorId] = cheapestPlan.id;
          }
        }
      });
      
      if (Object.keys(newSelectedPlans).length > 0) {
        setSelectedPlans(prev => ({ ...prev, ...newSelectedPlans }));
      }
    }
  }, [pricingPlans, selectedCompetitors, selectedPlans]);

  const handlePlanSelection = (competitorId: string, planId: string) => {
    setSelectedPlans(prev => ({
      ...prev,
      [competitorId]: planId
    }));
  };

  const getSelectedPlan = (competitorId: string) => {
    const planId = selectedPlans[competitorId];
    if (!planId) return null;
    return pricingPlans?.find(p => p.id === planId);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-dashboard-bg">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-t-primary border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading comparison data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-dashboard-bg" data-testid="comparison-container">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header />
        
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Vendor Comparison</h1>
            <p className="text-muted-foreground mt-2">
              Select up to 3 competitors and choose specific plans to compare side-by-side
            </p>
          </div>

          {/* Vendor Selection */}
          <Card data-testid="vendor-selection">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitCompare className="w-5 h-5" />
                Select Vendors to Compare (max 3)
              </CardTitle>
              <CardDescription>
                Choose up to 3 AI medical scribe vendors for side-by-side comparison
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {competitors?.map((competitor) => (
                  <div key={competitor.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={competitor.id}
                      checked={selectedCompetitors.includes(competitor.id)}
                      onCheckedChange={() => handleCompetitorToggle(competitor.id)}
                      disabled={!selectedCompetitors.includes(competitor.id) && selectedCompetitors.length >= 3}
                      data-testid={`checkbox-${competitor.id}`}
                    />
                    <label
                      htmlFor={competitor.id}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">{competitor.name}</div>
                      <div className="text-sm text-muted-foreground">{competitor.description}</div>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Table-like Comparison Layout */}
          {selectedCompetitors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Side-by-Side Comparison</CardTitle>
                <CardDescription>
                  Compare selected vendors with their chosen plans
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <div className="grid gap-0 min-w-full" style={{ gridTemplateColumns: `200px repeat(${selectedCompetitors.length}, 1fr)` }}>
                    
                    {/* Header Row */}
                    <div className="p-5 bg-muted font-medium border-b border-r text-base">Vendor</div>
                    {selectedCompetitors.map((competitorId) => {
                      const { competitor } = getCompetitorData(competitorId);
                      return (
                        <div key={competitorId} className="p-5 bg-muted border-b border-r last:border-r-0">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-200 shadow-sm">
                              {competitor?.name.includes("Heidi") ? (
                                <img 
                                  src="https://www.heidihealth.com/favicon.ico" 
                                  alt="Heidi Health Logo" 
                                  className="w-7 h-7"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                    if (fallback) fallback.style.display = 'block';
                                  }}
                                />
                              ) : competitor?.name.includes("Freed") ? (
                                <img 
                                  src="https://cdn.prod.website-files.com/6626cd90a59907680f6ccb64/6760822277db164afcfcf749_freed-logo.svg" 
                                  alt="Freed AI Logo" 
                                  className="w-7 h-7"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                    if (fallback) fallback.style.display = 'block';
                                  }}
                                />
                              ) : (
                                <img 
                                  src="https://sunoh.ai/favicon.ico" 
                                  alt="Sunoh AI Logo" 
                                  className="w-7 h-7"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                    if (fallback) fallback.style.display = 'block';
                                  }}
                                />
                              )}
                              <div className="hidden w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 font-bold text-sm">
                                {competitor?.name.charAt(0)}
                              </div>
                            </div>
                            <div className="font-semibold text-base">{competitor?.name}</div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Website Row */}
                    <div className="p-5 font-medium border-b border-r bg-gray-50 text-base">Website</div>
                    {selectedCompetitors.map((competitorId) => {
                      const { competitor } = getCompetitorData(competitorId);
                      return (
                        <div key={competitorId} className="p-5 border-b border-r last:border-r-0 bg-gray-50">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full text-sm"
                            onClick={() => competitor?.website && window.open(competitor.website, '_blank')}
                            data-testid={`visit-website-${competitorId}`}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Visit Site
                          </Button>
                        </div>
                      );
                    })}

                    {/* Plan Selection Row */}
                    <div className="p-5 font-medium border-b border-r text-base">Plan Selection</div>
                    {selectedCompetitors.map((competitorId) => {
                      const { pricing } = getCompetitorData(competitorId);
                      return (
                        <div key={competitorId} className="p-5 border-b border-r last:border-r-0">
                          <Select 
                            value={selectedPlans[competitorId] || ""} 
                            onValueChange={(value) => handlePlanSelection(competitorId, value)}
                          >
                            <SelectTrigger className="text-sm" data-testid={`plan-select-${competitorId}`}>
                              <SelectValue placeholder="Choose plan" />
                            </SelectTrigger>
                            <SelectContent>
                              {pricing?.map((plan) => (
                                <SelectItem key={plan.id} value={plan.id}>
                                  {plan.planName} - {plan.price === 0 ? 'Free' : formatPrice(plan.price || 0)}
                                  {(plan.price || 0) > 0 && `/${plan.billingPeriod}`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    })}

                    {/* Domain Rating Row */}
                    <div className="p-5 font-medium border-b border-r bg-gray-50 text-base">Domain Rating</div>
                    {selectedCompetitors.map((competitorId) => {
                      const { seo } = getCompetitorData(competitorId);
                      return (
                        <div key={competitorId} className="p-5 border-b border-r last:border-r-0 bg-gray-50">
                          <Badge variant="secondary" className="text-sm">
                            {seo?.domainRating || 'N/A'}
                          </Badge>
                        </div>
                      );
                    })}

                    {/* Average Review Row */}
                    <div className="p-5 font-medium border-b border-r text-base">Average Review</div>
                    {selectedCompetitors.map((competitorId) => {
                      const { averageRating, totalReviews } = getCompetitorData(competitorId);
                      return (
                        <div key={competitorId} className="p-5 border-b border-r last:border-r-0">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-base font-medium">
                              {averageRating ? averageRating.toFixed(1) : 'N/A'}
                            </span>
                            {totalReviews > 0 && (
                              <span className="text-sm text-muted-foreground">
                                ({totalReviews})
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Price Row */}
                    <div className="p-5 font-medium border-b border-r bg-gray-50 text-base">Price</div>
                    {selectedCompetitors.map((competitorId) => {
                      const selectedPlan = getSelectedPlan(competitorId);
                      return (
                        <div key={competitorId} className="p-5 border-b border-r last:border-r-0 bg-gray-50">
                          {selectedPlan ? (
                            <div>
                              <div className="text-xl font-bold text-primary">
                                {selectedPlan.price === 0 ? 'Free' : formatPrice(selectedPlan.price || 0)}
                              </div>
                              {(selectedPlan.price || 0) > 0 && (
                                <div className="text-sm text-muted-foreground">
                                  per {selectedPlan.billingPeriod}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-base text-muted-foreground">Select plan</span>
                          )}
                        </div>
                      );
                    })}

                    {/* Plan Name Row */}
                    <div className="p-5 font-medium border-b border-r text-base">Plan Name</div>
                    {selectedCompetitors.map((competitorId) => {
                      const selectedPlan = getSelectedPlan(competitorId);
                      return (
                        <div key={competitorId} className="p-5 border-b border-r last:border-r-0">
                          {selectedPlan ? (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-base">{selectedPlan.planName}</span>
                              {selectedPlan.price === 0 && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800 text-sm">
                                  Free
                                </Badge>
                              )}
                              {selectedPlan.isPromo && (
                                <Badge variant="destructive" className="text-sm">
                                  Promo
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-base text-muted-foreground">-</span>
                          )}
                        </div>
                      );
                    })}

                    {/* Features Row */}
                    <div className="p-5 font-medium border-r bg-gray-50 text-base">Features</div>
                    {selectedCompetitors.map((competitorId) => {
                      const selectedPlan = getSelectedPlan(competitorId);
                      return (
                        <div key={competitorId} className="p-5 border-r last:border-r-0 bg-gray-50">
                          {selectedPlan?.features ? (
                            <div className="space-y-2">
                              {selectedPlan.features.slice(0, 5).map((feature, index) => (
                                <div key={index} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span>{feature}</span>
                                </div>
                              ))}
                              {selectedPlan.features.length > 5 && (
                                <div className="text-sm text-muted-foreground">
                                  +{selectedPlan.features.length - 5} more features
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-base text-muted-foreground">Select plan to view features</span>
                          )}
                        </div>
                      );
                    })}

                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {selectedCompetitors.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <GitCompare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Vendors Selected</h3>
                <p className="text-muted-foreground">
                  Select at least one vendor from the list above to start comparing
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}