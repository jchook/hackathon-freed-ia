import { useState } from "react";
import { Star, TrendingUp, TrendingDown, MessageSquare, Shield, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { Review, ReviewSummary } from "@shared/schema";

interface ReviewsPanelProps {
  reviews: Review[];
  summary?: ReviewSummary;
  competitorName: string;
}

export function ReviewsPanel({ reviews, summary, competitorName }: ReviewsPanelProps) {
  const [displayedCount, setDisplayedCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600 dark:text-green-400";
    if (rating >= 3) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getSentimentColor = (sentiment?: string | null) => {
    switch (sentiment) {
      case "positive": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "negative": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Unknown date";
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  const averageRating = summary?.averageRating ? summary.averageRating / 10 : 0;
  const sentimentScore = summary?.sentimentScore ?? 0;

  const displayedReviews = reviews.slice(0, displayedCount);
  const hasMoreReviews = displayedCount < reviews.length;

  const handleShowMore = async () => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setDisplayedCount(prev => prev + 10);
    setIsLoading(false);
  };

  return (
    <div className="w-full space-y-6" data-testid="reviews-panel">
      {/* Summary Statistics */}
      {summary && (
        <Card data-testid="review-summary-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Customer Reviews Summary
            </CardTitle>
            <CardDescription>
              {competitorName} on {summary.platform}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {renderStars(Math.round(averageRating))}
                </div>
                <div className={`text-2xl font-bold ${getRatingColor(averageRating)}`}>
                  {averageRating.toFixed(1)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {summary.totalReviews} reviews
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {sentimentScore >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className={`text-2xl font-bold ${sentimentScore >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {sentimentScore > 0 ? '+' : ''}{sentimentScore}
                </div>
                <p className="text-sm text-muted-foreground">
                  Sentiment Score
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {summary.platform}
                </div>
                <p className="text-sm text-muted-foreground">
                  Platform
                </p>
              </div>
            </div>

            {/* Common Praises and Complaints */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {summary.commonPraises && summary.commonPraises.length > 0 && (
                <div>
                  <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3">
                    Common Praises
                  </h4>
                  <ul className="space-y-2">
                    {summary.commonPraises.map((praise, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{praise}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {summary.commonComplaints && summary.commonComplaints.length > 0 && (
                <div>
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3">
                    Common Issues
                  </h4>
                  <ul className="space-y-2">
                    {summary.commonComplaints.map((complaint, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <TrendingDown className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{complaint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual Reviews */}
      <Card data-testid="individual-reviews-card">
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
          <CardDescription>
            Latest customer feedback and experiences
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No reviews available yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {displayedReviews.map((review, index) => (
                <div key={review.id} data-testid={`review-item-${index}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                      <Badge variant="outline" className={getSentimentColor(review.sentiment)}>
                        {review.sentiment || "neutral"}
                      </Badge>
                      {review.isVerified && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(review.reviewDate)}
                    </span>
                  </div>

                  {review.title && (
                    <h4 className="font-semibold mb-2">{review.title}</h4>
                  )}

                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {review.content}
                  </p>

                  {review.highlights && review.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {review.highlights.map((highlight, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{review.author || "Anonymous"}</span>
                    <span>{review.platform}</span>
                  </div>

                  {index < displayedReviews.length - 1 && <Separator className="mt-6" />}
                </div>
              ))}
            </div>
          )}
          
          {/* Show More Button */}
          {hasMoreReviews && (
            <div className="flex justify-center pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleShowMore}
                disabled={isLoading}
                className="min-w-[160px]"
                data-testid="show-more-reviews-button"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Show 10 more ({reviews.length - displayedCount} remaining)
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}