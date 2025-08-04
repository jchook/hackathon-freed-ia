import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ReviewsPanel } from "@/components/ReviewsPanel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Building } from "lucide-react";
import { type CompetitorWithReviews } from "@shared/schema";

export default function Reviews() {
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);

  const { data: competitorsWithReviews, isLoading } = useQuery<CompetitorWithReviews[]>({
    queryKey: ['/api/competitors-with-reviews']
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  // Filter reviews by selected vendor or show all if none selected
  const filteredCompetitors = selectedVendor 
    ? competitorsWithReviews?.filter(c => c.id === selectedVendor) || []
    : competitorsWithReviews || [];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="flex h-screen bg-dashboard-bg" data-testid="reviews-container">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header />
        
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Customer Reviews</h1>
            <p className="text-muted-foreground mt-2">
              Authentic customer feedback and sentiment analysis from across the medical AI scribe market
            </p>
          </div>

          {/* Vendor Selection - Moved to top */}
          <Card data-testid="vendor-selection-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Select Vendor
              </CardTitle>
              <CardDescription>
                Choose a vendor to view their specific reviews and customer feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setSelectedVendor(null)}
                  className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${
                    selectedVendor === null
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800'
                  }`}
                  data-testid="vendor-filter-all"
                >
                  <div className="text-left">
                    <div className="font-semibold">All Vendors</div>
                    <div className="text-sm text-muted-foreground">
                      View all reviews
                    </div>
                  </div>
                </button>
                
                {competitorsWithReviews?.map((competitor) => {
                  const averageRating = competitor.reviewSummary?.averageRating 
                    ? competitor.reviewSummary.averageRating / 10 
                    : 0;
                  const totalReviews = competitor.reviewSummary?.totalReviews || 0;
                  
                  return (
                    <button
                      key={competitor.id}
                      onClick={() => setSelectedVendor(competitor.id)}
                      className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${
                        selectedVendor === competitor.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800'
                      }`}
                      data-testid={`vendor-filter-${competitor.id}`}
                    >
                      <div className="text-left">
                        <div className="font-semibold">{competitor.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          {averageRating > 0 ? (
                            <>
                              <div className="flex items-center gap-1">
                                {renderStars(Math.round(averageRating))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {averageRating.toFixed(1)} ({totalReviews} reviews)
                              </span>
                            </>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              No reviews yet
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Current Selection Indicator */}
          {selectedVendor && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                Currently viewing: {competitorsWithReviews?.find(c => c.id === selectedVendor)?.name}
              </Badge>
              <button
                onClick={() => setSelectedVendor(null)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="clear-filter-button"
              >
                Clear filter
              </button>
            </div>
          )}

          {/* Reviews Section - Updates based on selection */}
          <div className="space-y-6">
            {filteredCompetitors.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Building className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Reviews Available</h3>
                  <p className="text-muted-foreground">
                    {selectedVendor 
                      ? "This vendor doesn't have any reviews yet." 
                      : "No customer reviews are currently available."}
                  </p>
                </CardContent>
              </Card>
            ) : selectedVendor ? (
              // Show single vendor's reviews
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredCompetitors.map((competitor) => (
                  <ReviewsPanel
                    key={`reviews-${competitor.id}`}
                    reviews={competitor.reviews || []}
                    summary={competitor.reviewSummary}
                    competitorName={competitor.name}
                  />
                ))}
              </div>
            ) : (
              // Show all vendors' reviews in a single consolidated view
              <div className="space-y-6">
                {competitorsWithReviews?.map((competitor) => (
                  <div key={`vendor-section-${competitor.id}`} className="space-y-4">
                    <div className="flex items-center gap-3 border-b pb-2">
                      <Building className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-semibold">{competitor.name}</h2>
                      {competitor.reviewSummary && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {renderStars(Math.round((competitor.reviewSummary.averageRating || 0) / 10))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {((competitor.reviewSummary.averageRating || 0) / 10).toFixed(1)} 
                            ({competitor.reviewSummary.totalReviews || 0} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      <ReviewsPanel
                        reviews={competitor.reviews || []}
                        summary={competitor.reviewSummary}
                        competitorName={competitor.name}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}