import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ExternalLink, Star, Hash, Image, Globe } from "lucide-react";
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

  // Create a lookup map for competitor data
  const competitorMap: Record<string, SeoData> = {};
  seoData?.forEach(data => {
    competitorMap[data.competitorId] = data;
  });

  // Define the competitors we want to show
  const competitors = ['heidi-1', 'freed-1', 'sunoh-1'];

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

          {/* SEO Comparison Table */}
          {seoData && seoData.length > 0 ? (
            <Card data-testid="seo-comparison-table">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  SEO Attribute Comparison
                </CardTitle>
                <CardDescription>
                  Side-by-side comparison of SEO attributes for {pageTypes.find(t => t.value === selectedPageType)?.label.toLowerCase()} pages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-48 font-semibold">SEO Attribute</TableHead>
                        {competitors.map((competitorId) => (
                          <TableHead key={competitorId} className="text-center min-w-64">
                            <div className="flex flex-col items-center gap-2">
                              <span className="font-semibold">{getCompetitorName(competitorId)}</span>
                              {competitorMap[competitorId] && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                  className="h-6 w-6 p-0"
                                >
                                  <a
                                    href={competitorMap[competitorId].url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-testid={`header-link-${competitorId}`}
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Domain Rating */}
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-muted-foreground" />
                            Domain Rating
                          </div>
                        </TableCell>
                        {competitors.map((competitorId) => (
                          <TableCell key={competitorId} className="text-center">
                            {competitorMap[competitorId] ? (
                              <Badge className={getDomainRatingColor(competitorMap[competitorId].domainRating)}>
                                {competitorMap[competitorId].domainRating || 'N/A'}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">No data</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>

                      {/* Title Tag */}
                      <TableRow>
                        <TableCell className="font-medium">Title Tag</TableCell>
                        {competitors.map((competitorId) => (
                          <TableCell key={competitorId} className="max-w-xs">
                            {competitorMap[competitorId] ? (
                              <div>
                                <p className="text-sm leading-relaxed mb-1">
                                  {truncateText(competitorMap[competitorId].title, 80)}
                                </p>
                                {competitorMap[competitorId].title && (
                                  <span className="text-xs text-muted-foreground">
                                    {competitorMap[competitorId].title.length} chars
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">No data</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>

                      {/* Meta Description */}
                      <TableRow>
                        <TableCell className="font-medium">Meta Description</TableCell>
                        {competitors.map((competitorId) => (
                          <TableCell key={competitorId} className="max-w-xs">
                            {competitorMap[competitorId] ? (
                              <div>
                                <p className="text-sm leading-relaxed mb-1">
                                  {truncateText(competitorMap[competitorId].metaDescription, 100)}
                                </p>
                                {competitorMap[competitorId].metaDescription && (
                                  <span className="text-xs text-muted-foreground">
                                    {competitorMap[competitorId].metaDescription.length} chars
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">No data</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>

                      {/* H1 Tag */}
                      <TableRow>
                        <TableCell className="font-medium">H1 Tag</TableCell>
                        {competitors.map((competitorId) => (
                          <TableCell key={competitorId} className="max-w-xs">
                            <p className="text-sm">
                              {competitorMap[competitorId]?.h1Tag || 'Not specified'}
                            </p>
                          </TableCell>
                        ))}
                      </TableRow>

                      {/* Keywords */}
                      <TableRow>
                        <TableCell className="font-medium">Target Keywords</TableCell>
                        {competitors.map((competitorId) => (
                          <TableCell key={competitorId} className="max-w-xs">
                            {competitorMap[competitorId]?.keywords && competitorMap[competitorId].keywords.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {competitorMap[competitorId].keywords.slice(0, 3).map((keyword, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {keyword}
                                  </Badge>
                                ))}
                                {competitorMap[competitorId].keywords.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{competitorMap[competitorId].keywords.length - 3}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">No keywords</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>

                      {/* Open Graph Title */}
                      <TableRow>
                        <TableCell className="font-medium">OG Title</TableCell>
                        {competitors.map((competitorId) => (
                          <TableCell key={competitorId} className="max-w-xs">
                            <p className="text-sm">
                              {truncateText(competitorMap[competitorId]?.ogTitle, 60)}
                            </p>
                          </TableCell>
                        ))}
                      </TableRow>

                      {/* Open Graph Description */}
                      <TableRow>
                        <TableCell className="font-medium">OG Description</TableCell>
                        {competitors.map((competitorId) => (
                          <TableCell key={competitorId} className="max-w-xs">
                            <p className="text-sm">
                              {truncateText(competitorMap[competitorId]?.ogDescription, 80)}
                            </p>
                          </TableCell>
                        ))}
                      </TableRow>

                      {/* Schema Markup */}
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4 text-muted-foreground" />
                            Schema Markup
                          </div>
                        </TableCell>
                        {competitors.map((competitorId) => (
                          <TableCell key={competitorId} className="max-w-xs">
                            {competitorMap[competitorId]?.schemaMarkup ? (
                              <div className="flex flex-wrap gap-1">
                                {competitorMap[competitorId].schemaMarkup.split(', ').slice(0, 2).map((schema, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {schema}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">No schema</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>

                      {/* Images */}
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Image className="w-4 h-4 text-muted-foreground" />
                            Social Images
                          </div>
                        </TableCell>
                        {competitors.map((competitorId) => (
                          <TableCell key={competitorId} className="text-center">
                            {competitorMap[competitorId] ? (
                              <div className="flex gap-2 justify-center">
                                {competitorMap[competitorId].ogImage && (
                                  <Badge variant="outline" className="text-xs">
                                    OG
                                  </Badge>
                                )}
                                {competitorMap[competitorId].twitterImage && (
                                  <Badge variant="outline" className="text-xs">
                                    Twitter
                                  </Badge>
                                )}
                                {!competitorMap[competitorId].ogImage && !competitorMap[competitorId].twitterImage && (
                                  <span className="text-muted-foreground">No images</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">No data</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
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