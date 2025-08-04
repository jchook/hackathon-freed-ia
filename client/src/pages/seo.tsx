import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ExternalLink, Globe, Hash, Image, Star } from "lucide-react";
import { type SeoData } from "@shared/schema";

export default function SEO() {
  const [selectedPageType, setSelectedPageType] = useState<string>("homepage");

  const { data: seoData, isLoading } = useQuery<SeoData[]>({
    queryKey: ['/api/seo', { pageType: selectedPageType }]
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SEO data...</p>
        </div>
      </div>
    );
  }

  const pageTypes = [
    { value: "homepage", label: "Homepage" },
    { value: "pricing", label: "Pricing" },
    { value: "about", label: "About" },
    { value: "product", label: "Product" },
  ];

  const getCompetitorName = (competitorId: string) => {
    const names: Record<string, string> = {
      'heidi-1': 'Heidi Health',
      'freed-1': 'Freed AI',
      'sunoh-1': 'Sunoh AI'
    };
    return names[competitorId] || competitorId;
  };

  const getCompetitorColor = (competitorId: string) => {
    const colors: Record<string, string> = {
      'heidi-1': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'freed-1': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'sunoh-1': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    };
    return colors[competitorId] || 'bg-gray-100 text-gray-800';
  };

  const getDomainRatingColor = (rating?: number | null) => {
    if (!rating) return 'bg-gray-100 text-gray-800';
    if (rating >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (rating >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };

  const truncateText = (text: string | null, maxLength: number = 100) => {
    if (!text) return 'Not specified';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="flex h-screen bg-dashboard-bg" data-testid="seo-container">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header />
        
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">SEO Comparison</h1>
            <p className="text-muted-foreground mt-2">
              Compare SEO attributes across AI medical scribe competitors side-by-side
            </p>
          </div>

          {/* Page Type Filter */}
          <Card data-testid="page-type-filter">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Page Type Comparison
              </CardTitle>
              <CardDescription>
                Select a page type to compare SEO attributes across competitors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedPageType} onValueChange={setSelectedPageType}>
                <SelectTrigger className="w-64" data-testid="page-type-select">
                  <SelectValue placeholder="Select page type" />
                </SelectTrigger>
                <SelectContent>
                  {pageTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* SEO Comparison Grid */}
          {seoData && seoData.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {seoData.map((data) => (
                <Card key={data.id} className="h-fit" data-testid={`seo-card-${data.competitorId}`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <Badge className={getCompetitorColor(data.competitorId)}>
                        {getCompetitorName(data.competitorId)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-8 w-8 p-0"
                      >
                        <a
                          href={data.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-testid={`external-link-${data.competitorId}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground font-mono">
                        {data.url.replace('https://', '')}
                      </span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <Tabs defaultValue="basic" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="basic">Basic</TabsTrigger>
                        <TabsTrigger value="social">Social</TabsTrigger>
                        <TabsTrigger value="technical">Technical</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="basic" className="space-y-4 mt-4">
                        {/* Domain Rating */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Domain Rating</span>
                          </div>
                          <Badge className={getDomainRatingColor(data.domainRating)}>
                            {data.domainRating || 'N/A'}
                          </Badge>
                        </div>

                        {/* Title */}
                        <div>
                          <span className="text-sm font-medium block mb-1">Title Tag</span>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {truncateText(data.title, 120)}
                          </p>
                          {data.title && (
                            <span className="text-xs text-muted-foreground">
                              {data.title.length} characters
                            </span>
                          )}
                        </div>

                        {/* Meta Description */}
                        <div>
                          <span className="text-sm font-medium block mb-1">Meta Description</span>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {truncateText(data.metaDescription, 160)}
                          </p>
                          {data.metaDescription && (
                            <span className="text-xs text-muted-foreground">
                              {data.metaDescription.length} characters
                            </span>
                          )}
                        </div>

                        {/* H1 Tag */}
                        <div>
                          <span className="text-sm font-medium block mb-1">H1 Tag</span>
                          <p className="text-sm text-muted-foreground">
                            {data.h1Tag || 'Not specified'}
                          </p>
                        </div>

                        {/* H2 Tags */}
                        {data.h2Tags && data.h2Tags.length > 0 && (
                          <div>
                            <span className="text-sm font-medium block mb-2">H2 Tags</span>
                            <div className="space-y-1">
                              {data.h2Tags.slice(0, 3).map((h2, index) => (
                                <p key={index} className="text-xs text-muted-foreground">
                                  {truncateText(h2, 80)}
                                </p>
                              ))}
                              {data.h2Tags.length > 3 && (
                                <span className="text-xs text-muted-foreground italic">
                                  +{data.h2Tags.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Keywords */}
                        {data.keywords && data.keywords.length > 0 && (
                          <div>
                            <span className="text-sm font-medium block mb-2">Target Keywords</span>
                            <div className="flex flex-wrap gap-1">
                              {data.keywords.slice(0, 4).map((keyword, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                              {data.keywords.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{data.keywords.length - 4} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="social" className="space-y-4 mt-4">
                        {/* Open Graph */}
                        <div>
                          <span className="text-sm font-medium block mb-1">OG Title</span>
                          <p className="text-sm text-muted-foreground">
                            {truncateText(data.ogTitle, 100)}
                          </p>
                        </div>

                        <div>
                          <span className="text-sm font-medium block mb-1">OG Description</span>
                          <p className="text-sm text-muted-foreground">
                            {truncateText(data.ogDescription, 120)}
                          </p>
                        </div>

                        {data.ogImage && (
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Image className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium">OG Image</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              Image set
                            </Badge>
                          </div>
                        )}

                        {/* Twitter */}
                        <div>
                          <span className="text-sm font-medium block mb-1">Twitter Title</span>
                          <p className="text-sm text-muted-foreground">
                            {truncateText(data.twitterTitle, 100)}
                          </p>
                        </div>

                        <div>
                          <span className="text-sm font-medium block mb-1">Twitter Description</span>
                          <p className="text-sm text-muted-foreground">
                            {truncateText(data.twitterDescription, 120)}
                          </p>
                        </div>

                        {data.twitterImage && (
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Image className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium">Twitter Image</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              Image set
                            </Badge>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="technical" className="space-y-4 mt-4">
                        {/* Canonical URL */}
                        <div>
                          <span className="text-sm font-medium block mb-1">Canonical URL</span>
                          <p className="text-sm text-muted-foreground font-mono">
                            {data.canonicalUrl || 'Not set'}
                          </p>
                        </div>

                        {/* Schema Markup */}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Hash className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Schema Markup</span>
                          </div>
                          {data.schemaMarkup ? (
                            <div className="flex flex-wrap gap-1">
                              {data.schemaMarkup.split(', ').map((schema, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {schema}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">Not implemented</p>
                          )}
                        </div>

                        {/* Last Updated */}
                        <div>
                          <span className="text-sm font-medium block mb-1">Last Updated</span>
                          <p className="text-sm text-muted-foreground">
                            {new Date(data.lastUpdated).toLocaleDateString()}
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No SEO Data Available</h3>
                <p className="text-muted-foreground">
                  No SEO data found for {pageTypes.find(t => t.value === selectedPageType)?.label.toLowerCase()} pages.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}