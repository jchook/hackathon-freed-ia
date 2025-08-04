import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { GitCompare, ExternalLink, Star, DollarSign } from "lucide-react";
import { type SeoData, type Competitor, type PricingPlan } from "@shared/schema";

export default function Comparison() {
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>(['heidi-1', 'freed-1']);

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

  const getDomainRatingColor = (rating?: number | null) => {
    if (!rating) return 'bg-gray-100 text-gray-800';
    if (rating >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (rating >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
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
              Select up to 3 competitors to compare side-by-side
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

          {/* Comparison Table */}
          {selectedCompetitors.length > 0 && (
            <Card data-testid="comparison-table">
              <CardHeader>
                <CardTitle>Vendor Comparison</CardTitle>
                <CardDescription>
                  Side-by-side comparison of selected vendors
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table className="w-full min-w-[800px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-48">Attribute</TableHead>
                      {selectedCompetitors.map((competitorId) => {
                        const { competitor } = getCompetitorData(competitorId);
                        return (
                          <TableHead key={competitorId} className="text-center min-w-[250px]">
                            <div className="flex flex-col items-center gap-1">
                              <span className="font-semibold">{competitor?.name}</span>
                            </div>
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Website URL */}
                    <TableRow>
                      <TableCell className="font-medium">Website</TableCell>
                      {selectedCompetitors.map((competitorId) => {
                        const { competitor } = getCompetitorData(competitorId);
                        return (
                          <TableCell key={competitorId} className="text-center">
                            <a
                              href={competitor?.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm flex items-center gap-1 justify-center"
                              data-testid={`link-${competitorId}`}
                            >
                              {competitor?.website} <ExternalLink className="w-3 h-3" />
                            </a>
                          </TableCell>
                        );
                      })}
                    </TableRow>

                    {/* Domain Rating */}
                    <TableRow>
                      <TableCell className="font-medium">Domain Rating</TableCell>
                      {selectedCompetitors.map((competitorId) => {
                        const { seo } = getCompetitorData(competitorId);
                        return (
                          <TableCell key={competitorId} className="text-center">
                            <Badge className={getDomainRatingColor(seo?.domainRating)}>
                              {seo?.domainRating || 'N/A'}
                            </Badge>
                          </TableCell>
                        );
                      })}
                    </TableRow>

                    {/* Title */}
                    <TableRow>
                      <TableCell className="font-medium">Page Title</TableCell>
                      {selectedCompetitors.map((competitorId) => {
                        const { seo } = getCompetitorData(competitorId);
                        return (
                          <TableCell key={competitorId} className="text-center">
                            <div className="text-sm">
                              {seo?.title || 'Not specified'}
                              {seo?.title && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {seo.title.length} chars
                                </div>
                              )}
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>

                    {/* Meta Description */}
                    <TableRow>
                      <TableCell className="font-medium">Meta Description</TableCell>
                      {selectedCompetitors.map((competitorId) => {
                        const { seo } = getCompetitorData(competitorId);
                        return (
                          <TableCell key={competitorId} className="text-center">
                            <div className="text-sm">
                              {seo?.metaDescription ? (
                                <div>
                                  <div className="line-clamp-3">
                                    {seo.metaDescription}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {seo.metaDescription.length} chars
                                  </div>
                                </div>
                              ) : (
                                'Not specified'
                              )}
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>

                    {/* Pricing */}
                    <TableRow>
                      <TableCell className="font-medium">Pricing Plans</TableCell>
                      {selectedCompetitors.map((competitorId) => {
                        const { pricing } = getCompetitorData(competitorId);
                        return (
                          <TableCell key={competitorId} className="text-center">
                            <div className="space-y-2">
                              {pricing?.map((plan) => (
                                <div key={plan.id} className="p-2 border rounded">
                                  <div className="font-medium text-sm">{plan.planName}</div>
                                  <div className="text-lg font-bold text-primary">
                                    {plan.price === 0 ? 'Free' : formatPrice(plan.price)}
                                    {plan.price > 0 && (
                                      <span className="text-xs text-muted-foreground">
                                        /{plan.billingPeriod}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>

                    {/* Features */}
                    <TableRow>
                      <TableCell className="font-medium">Features</TableCell>
                      {selectedCompetitors.map((competitorId) => {
                        const { pricing } = getCompetitorData(competitorId);
                        return (
                          <TableCell key={competitorId} className="text-center">
                            <div className="space-y-3">
                              {pricing?.map((plan) => (
                                <div key={plan.id} className="text-left">
                                  <div className="font-medium text-sm mb-2 text-center">{plan.planName}</div>
                                  <ul className="text-xs space-y-1">
                                    {plan.features.map((feature, index) => (
                                      <li key={index} className="flex items-start gap-1">
                                        <span className="text-green-500 mt-0.5">✓</span>
                                        <span>{feature}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>

                    {/* Keywords */}
                    <TableRow>
                      <TableCell className="font-medium">Target Keywords</TableCell>
                      {selectedCompetitors.map((competitorId) => {
                        const { seo } = getCompetitorData(competitorId);
                        return (
                          <TableCell key={competitorId} className="text-center">
                            <div className="flex flex-wrap gap-1 justify-center">
                              {seo?.keywords?.slice(0, 3).map((keyword, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                              {seo?.keywords && seo.keywords.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{seo.keywords.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>

                    {/* Canonical URL */}
                    <TableRow>
                      <TableCell className="font-medium">Canonical URL</TableCell>
                      {selectedCompetitors.map((competitorId) => {
                        const { seo } = getCompetitorData(competitorId);
                        return (
                          <TableCell key={competitorId} className="text-center">
                            {seo?.canonicalUrl ? (
                              <a
                                href={seo.canonicalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline text-sm break-all"
                              >
                                {seo.canonicalUrl}
                              </a>
                            ) : (
                              'Not specified'
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>


                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {selectedCompetitors.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <GitCompare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Vendors Selected</h3>
                <p className="text-muted-foreground">
                  Select at least one vendor above to start comparing their features and pricing.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}