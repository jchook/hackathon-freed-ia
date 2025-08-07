import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Rss, ExternalLink, Calendar, Filter, Search, RefreshCw,
  DollarSign, Users, TrendingUp, FileText, Tv, 
  Handshake, UserPlus, Zap, Star, Code, Shield,
  Building, TrendingDown, AlertTriangle, CheckCircle,
  Brain, Sparkles
} from "lucide-react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  feedItemsAtom, 
  newlyAddedItemsAtom, 
  currentFeedIndexAtom, 
  nextFeedItemsAtom,
  addFeedItemAtom,
  markAsNewlyAddedAtom,
  removeNewlyAddedAtom,
  incrementFeedIndexAtom,
  type FeedItem
} from "@/stores/feedAtoms";

export default function Feed() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  
  // Use global state from feedAtoms
  const [feedItems] = useAtom(feedItemsAtom);
  const [newlyAddedItems] = useAtom(newlyAddedItemsAtom);
  const [currentFeedIndex] = useAtom(currentFeedIndexAtom);
  const [nextFeedItems] = useAtom(nextFeedItemsAtom);
  
  // Use helper functions from feedAtoms
  const addFeedItem = useSetAtom(addFeedItemAtom);
  const markAsNewlyAdded = useSetAtom(markAsNewlyAddedAtom);
  const removeNewlyAdded = useSetAtom(removeNewlyAddedAtom);
  const incrementFeedIndex = useSetAtom(incrementFeedIndexAtom);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Helper function to determine if an item is high relevance for insights
  const isHighRelevanceForInsights = (item: FeedItem): boolean => {
    // Only look at severity - high relevance for severity 8+
    const severity = item.severity || 5;
    return severity >= 8;
  };

  // Initialize with existing competitive intelligence data
  const addDemoDelta = useMutation({
    mutationFn: async () => {
      console.log("Starting addDemoDelta mutation...");
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the next feed item to add
      const selectedItem = nextFeedItems[currentFeedIndex % nextFeedItems.length];
      console.log("Selected feed item:", selectedItem);

      // Check if this item is high relevance for insights
      const shouldGenerateInsights = isHighRelevanceForInsights(selectedItem);
      
      if (shouldGenerateInsights) {
        setIsGeneratingInsights(true);
        console.log("High relevance item detected - generating insights...");
      }

      // Send to Slack endpoint
      const slackResponse = await apiRequest("POST", "/api/slack/send-feed-alerts", {
        feedItems: [selectedItem]
      });
      const slackResult = await slackResponse.json();

      // Generate insights for high-impact items
      let insightsResult = null;
      if (shouldGenerateInsights) {
        try {
          const insightsResponse = await apiRequest("POST", "/api/insights/generate", {
            feedItem: selectedItem
          });
          insightsResult = await insightsResponse.json();
        } catch (error) {
          console.error("Failed to generate insights:", error);
          insightsResult = { shouldGenerate: false, error: "Failed to generate insights" };
        }
      }

      return { 
        feedItem: selectedItem, 
        slackResult: slackResult,
        insightsResult: insightsResult,
        shouldGenerateInsights
      };
    },
    onError: (error) => {
      console.error("addDemoDelta mutation failed:", error);
      setIsGeneratingInsights(false);
      toast({
        title: "Error",
        description: "Failed to refresh feed. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      console.log("addDemoDelta mutation successful:", data);
      setIsGeneratingInsights(false);
      
      // Map tags to proper categories
      const tagToCategoryMap: Record<string, string> = {
        "features": "Features",
        "fundraising": "Fundraising", 
        "partnerships": "Partnerships",
        "epic": "Competitor Entry",
        "epic-integration": "Partnerships",
        "security": "Security",
        "pricing": "Pricing",
        "telemedicine": "Partnerships",
        "ehr": "Partnerships",
        "competition": "Competitor Entry",
        "enterprise": "Features",
        "marketplace": "Features"
      };

      // Determine severity and category
      const primaryTag = data.feedItem.tags?.[0] || "general";
      const category = tagToCategoryMap[primaryTag] || "Features";
      let severity = 6;
      
      if (data.feedItem.title.toLowerCase().includes("heidi") && (data.feedItem.content.toLowerCase().includes("epic") || data.feedItem.tags?.includes("high-priority"))) {
        severity = 9; // High severity for Heidi + Epic integration or high-priority items
      } else if (data.feedItem.source === "ambience") {
        severity = 9;
      } else {
        severity = Math.floor(Math.random() * 4) + 6;
      }

      // Add category and severity to the feed item
      const enhancedFeedItem: FeedItem = {
        ...data.feedItem,
        severity,
        category,
        subcategory: data.feedItem.tags?.[1] ? data.feedItem.tags[1].replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase()) : "New Feature Release"
      };
      
      console.log("Adding new feed item:", enhancedFeedItem);
      
      // Use global state helper to add feed item
      addFeedItem(enhancedFeedItem);
      
      // Mark this item as newly added for animation
      markAsNewlyAdded(enhancedFeedItem.id);
      
      // Remove the "newly added" status after animation completes
      setTimeout(() => {
        removeNewlyAdded(enhancedFeedItem.id);
      }, 2000); // Remove after 2 seconds
      
      // Increment feed index for next refresh
      incrementFeedIndex();
      
      const slackSuccess = data.slackResult?.summary?.successful > 0;
      const insightsGenerated = data.insightsResult?.shouldGenerate;
      
      // Invalidate insights queries to refresh the insights page
      if (insightsGenerated) {
        queryClient.invalidateQueries({ queryKey: ["insights"] });
        console.log("Invalidated insights queries after generating new insights");
      }
      
      // Build toast description with better indicators
      let description = `New competitive intel: "${data.feedItem.title}"`;
      let toastVariant: "default" | "destructive" = "default";
      
      if (data.shouldGenerateInsights) {
        if (insightsGenerated) {
          description += " 🧠 AI insights generated";
          toastVariant = "default";
        } else {
          description += " ⚠️ Insight generation failed";
          toastVariant = "destructive";
        }
      }
      
      if (slackSuccess) {
        description += " 📢 Alert sent to Slack";
      }
      
      toast({
        title: data.shouldGenerateInsights ? "High-Impact Intel + Insights" : "Feed Refreshed",
        description: description,
        variant: toastVariant,
      });
    }
  });

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      "Fundraising": DollarSign,
      "Pricing": TrendingUp,
      "Features": Zap,
      "Competitor Entry": Building,
      "Security": Shield,
      "Personnel": UserPlus,
      "Partnerships": Handshake,
      "Reviews": Star,
      "API/SDK": Code,
      "Media": Tv,
      "Blog/Newsletter": FileText,
      "Research": FileText,
      "Platform": Code
    };
    const IconComponent = icons[category] || FileText;
    return <IconComponent className="w-4 h-4" />;
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return "bg-red-500";
    if (severity >= 5) return "bg-orange-500"; 
    return "bg-green-500";
  };

  const getSeverityLabel = (severity: number) => {
    if (severity >= 8) return "High";
    if (severity >= 5) return "Med";
    return "Low";
  };

  // Fuzzy search and filtering
  const filteredFeedItems = useMemo(() => {
    let filtered = feedItems;

    // Text search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchLower) ||
        item.content.toLowerCase().includes(searchLower) ||
        item.source.toLowerCase().includes(searchLower) ||
        (item.category && item.category.toLowerCase().includes(searchLower)) ||
        (item.subcategory && item.subcategory.toLowerCase().includes(searchLower))
      );
    }

    // Severity filter
    if (severityFilter !== "all") {
      filtered = filtered.filter(item => {
        const severity = item.severity || 5;
        if (severityFilter === "high") return severity >= 8;
        if (severityFilter === "med") return severity >= 5 && severity < 8;
        if (severityFilter === "low") return severity < 5;
        return true;
      });
    }

    return filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [feedItems, searchTerm, severityFilter]);

  return (
    <div className="flex h-screen bg-dashboard-bg" data-testid="feed-container">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header />
        
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Delta Feed</h1>
            <p className="text-muted-foreground mt-2">
              Real-time competitive intelligence and market changes across AI medical scribe vendors
            </p>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 flex-1 max-w-2xl">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search deltas by title, vendor, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="search-input"
                />
              </div>

              {/* Severity Filter */}
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-40" data-testid="severity-filter">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="high">High (8-10)</SelectItem>
                  <SelectItem value="med">Med (5-7)</SelectItem>
                  <SelectItem value="low">Low (0-4)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Refresh Button */}
            <Button 
              onClick={() => addDemoDelta.mutate()}
              disabled={addDemoDelta.isPending}
              data-testid="refresh-button"
              className={isGeneratingInsights ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" : ""}
            >
              {isGeneratingInsights ? (
                <>
                  <Brain className="w-4 h-4 mr-2 animate-pulse" />
                  Generating Insights...
                </>
              ) : (
                <>
                  <RefreshCw className={`w-4 h-4 mr-2 ${addDemoDelta.isPending ? 'animate-spin' : ''}`} />
                  {addDemoDelta.isPending ? 'Analyzing...' : 'Refresh Feed'}
                </>
              )}
            </Button>
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredFeedItems.length} of {feedItems.length} feed items
          </div>

          {/* Feed Item Cards */}
          <div className="space-y-4">
            {filteredFeedItems.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Rss className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No feed items found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or filters to see more results.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredFeedItems.map((item) => {
                const isNewlyAdded = newlyAddedItems.has(item.id);
                return (
                <Card 
                  key={item.id} 
                  className={`hover:shadow-lg transition-all duration-500 ${
                    isNewlyAdded 
                      ? 'animate-in slide-in-from-top-2 fade-in duration-700 border-green-400 bg-green-50/30' 
                      : 'transition-shadow duration-200'
                  }`}
                  data-testid={`feed-card-${item.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg leading-tight mb-2">{item.title}</CardTitle>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Severity Indicator */}
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getSeverityColor(item.severity || 5)} ${
                            isNewlyAdded ? 'animate-pulse' : ''
                          }`}></div>
                          <span className="text-sm text-muted-foreground">{getSeverityLabel(item.severity || 5)}</span>
                        </div>
                        
                        {/* Insights Indicator */}
                        {isHighRelevanceForInsights(item) && (
                          <div className="flex items-center gap-1">
                            <Brain className="w-3 h-3 text-purple-500" />
                            <span className="text-xs text-purple-600 font-medium">AI Insights</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Category Badge */}
                      {item.category && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          {getCategoryIcon(item.category)}
                          {item.category}
                        </Badge>
                      )}
                      
                      {/* Subcategory Badge */}
                      {item.subcategory && (
                        <Badge variant="outline" className="text-xs">
                          {item.subcategory}
                        </Badge>
                      )}
                      
                      {/* Source Badge */}
                      <Badge variant="default" className="text-xs">
                        {item.source.charAt(0).toUpperCase() + item.source.slice(1)}
                      </Badge>
                      
                      {/* Insights Generated Badge */}
                      {isHighRelevanceForInsights(item) && (
                        <Badge variant="outline" className="text-xs border-purple-200 text-purple-700 bg-purple-50">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Insights Generated
                        </Badge>
                      )}
                      
                      <div className="flex-1"></div>
                      
                      {/* Date and Source Link */}
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(item.publishedAt), 'MMM d, yyyy')}
                        </div>
                        
                        <a 
                          href={item.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Source
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
