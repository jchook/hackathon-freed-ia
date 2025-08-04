import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { GitCompare, ExternalLink, CheckCircle, Zap, DollarSign } from "lucide-react";
import { type SeoData, type Competitor, type PricingPlan } from "@shared/schema";

export default function Comparison() {
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>(['heidi-1', 'freed-1']);
  const [selectedPlans, setSelectedPlans] = useState<Record<string, string>>({});

  const { data: seoData, isLoading: seoLoading } = useQuery<SeoData[]>({
    queryKey: ['/api/seo']
  });

  const { data: competitors, isLoading: competitorsLoading } = useQuery<Competitor[]>({
    queryKey: ['/api/competitors']
  });

  const { data: pricingPlans, isLoading: pricingLoading } = useQuery<PricingPlan[]>({
    queryKey: ['/api/pricing-plans']
  });

  const isLoading = seoLoading || competitorsLoading || pricingLoading;

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
    const seo = seoData?.find(s => s.competitorId === competitorId && s.pageType === 'homepage');
    const pricing = pricingPlans?.filter(p => p.competitorId === competitorId);
    return { competitor, seo, pricing };
  };

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

          {/* Vendor Comparison Cards */}
          {selectedCompetitors.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {selectedCompetitors.map((competitorId) => {
                const { competitor, seo, pricing } = getCompetitorData(competitorId);
                const selectedPlan = getSelectedPlan(competitorId);
                
                return (
                  <Card key={competitorId} className="h-fit" data-testid={`comparison-card-${competitorId}`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white border border-gray-200 shadow-sm">
                          {competitor?.name.includes("Heidi") ? (
                            <img 
                              src="https://www.heidihealth.com/favicon.ico" 
                              alt="Heidi Health Logo" 
                              className="w-8 h-8"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling.style.display = 'block';
                              }}
                            />
                          ) : competitor?.name.includes("Freed") ? (
                            <img 
                              src="https://cdn.prod.website-files.com/6626cd90a59907680f6ccb64/6760822277db164afcfcf749_freed-logo.svg" 
                              alt="Freed AI Logo" 
                              className="w-8 h-8"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling.style.display = 'block';
                              }}
                            />
                          ) : (
                            <img 
                              src="https://sunoh.ai/favicon.ico" 
                              alt="Sunoh AI Logo" 
                              className="w-8 h-8"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling.style.display = 'block';
                              }}
                            />
                          )}
                          {/* Fallback */}
                          <div className="hidden w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 font-bold text-sm">
                            {competitor?.name.charAt(0)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl">{competitor?.name}</CardTitle>
                          <CardDescription className="text-sm">{competitor?.description}</CardDescription>
                        </div>
                      </div>

                      {/* Website Link */}
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full mb-4"
                        onClick={() => window.open(competitor?.website, '_blank')}
                        data-testid={`visit-website-${competitorId}`}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Website
                      </Button>

                      {/* Plan Selection */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Select Plan:</label>
                        <Select 
                          value={selectedPlans[competitorId] || ""} 
                          onValueChange={(value) => handlePlanSelection(competitorId, value)}
                        >
                          <SelectTrigger data-testid={`plan-select-${competitorId}`}>
                            <SelectValue placeholder="Choose a plan" />
                          </SelectTrigger>
                          <SelectContent>
                            {pricing?.map((plan) => (
                              <SelectItem key={plan.id} value={plan.id}>
                                {plan.planName} - {plan.price === 0 ? 'Free' : formatPrice(plan.price)}
                                {plan.price > 0 && `/${plan.billingPeriod}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* SEO Info */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Domain Rating</span>
                          <Badge variant="secondary">
                            {seo?.domainRating || 'N/A'}
                          </Badge>
                        </div>
                      </div>

                      {/* Selected Plan Details */}
                      {selectedPlan && (
                        <div className="border rounded-lg p-4 bg-muted/50">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-lg">{selectedPlan.planName}</h4>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">
                                {selectedPlan.price === 0 ? 'Free' : formatPrice(selectedPlan.price)}
                              </div>
                              {selectedPlan.price > 0 && (
                                <div className="text-sm text-muted-foreground">
                                  per {selectedPlan.billingPeriod}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Plan Benefits */}
                          <div className="space-y-2">
                            <h5 className="font-medium text-sm text-muted-foreground">Plan Benefits:</h5>
                            <div className="space-y-1">
                              {selectedPlan.features.map((feature, index) => (
                                <div key={index} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Special Badges */}
                          <div className="flex gap-2 mt-3">
                            {selectedPlan.price === 0 && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Free Plan
                              </Badge>
                            )}
                            {selectedPlan.isPromo && (
                              <Badge variant="destructive">
                                <Zap className="w-3 h-3 mr-1" />
                                Limited Time
                              </Badge>
                            )}
                            {selectedPlan.target === "individuals" && (
                              <Badge variant="outline">Individual</Badge>
                            )}
                            {selectedPlan.target === "groups" && (
                              <Badge variant="outline">Team</Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Prompt to select plan */}
                      {!selectedPlan && (
                        <div className="border rounded-lg p-4 bg-muted/20 text-center">
                          <DollarSign className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Select a plan above to view detailed benefits and pricing
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
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