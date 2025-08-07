import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain, Search, Filter, TrendingUp, AlertTriangle, 
  Users, Target, CheckCircle2, Clock, ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";

interface Insight {
  id: string;
  feedItemId?: string;
  title: string;
  summary: string;
  categories: string[];
  impact: 'high' | 'medium' | 'low';
  content: string; // Markdown content
  mentions: string[];
  createdAt: string;
}

export default function Insights() {
  const [searchTerm, setSearchTerm] = useState("");
  const [impactFilter, setImpactFilter] = useState<string>("all");

  const { data: insights = [], isLoading } = useQuery({
    queryKey: ["insights", impactFilter],
    queryFn: async () => {
      const params = impactFilter !== "all" ? `?impact=${impactFilter}` : "";
      const response = await apiRequest("GET", `/api/insights${params}`);
      return await response.json();
    },
  });

  // Fuzzy search and filtering
  const filteredInsights = useMemo(() => {
    let filtered = insights;

    // Text search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((insight: Insight) => 
        insight.title.toLowerCase().includes(searchLower) ||
        insight.summary.toLowerCase().includes(searchLower) ||
        insight.categories.some(cat => cat.toLowerCase().includes(searchLower))
      );
    }

    return filtered.sort((a: Insight, b: Insight) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [insights, searchTerm]);

  const getImpactColor = (impact: string) => {
    if (impact === 'high') return "bg-red-500";
    if (impact === 'medium') return "bg-orange-500"; 
    return "bg-green-500";
  };

  const getImpactIcon = (impact: string) => {
    if (impact === 'high') return <AlertTriangle className="w-4 h-4" />;
    if (impact === 'medium') return <TrendingUp className="w-4 h-4" />;
    return <CheckCircle2 className="w-4 h-4" />;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      "sales": Target,
      "marketing": TrendingUp,
      "product": Brain,
      "general": CheckCircle2,
      "gtm_impact": TrendingUp,
      "counter_programming": Target,
      "sales_soundbites": Target,
      "gtm impact": TrendingUp,
      "counter programming": Target,
      "sales soundbites": Target
    };
    const IconComponent = icons[category.toLowerCase()] || CheckCircle2;
    return <IconComponent className="w-3 h-3" />;
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return "text-red-600";
    if (priority === 'medium') return "text-orange-600";
    return "text-green-600";
  };

  return (
    <div className="flex h-screen bg-dashboard-bg" data-testid="insights-container">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header />
        
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Brain className="w-8 h-8" />
              Strategic Insights
            </h1>
            <p className="text-muted-foreground mt-2">
              AI-powered competitive intelligence and strategic recommendations
            </p>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 flex-1 max-w-2xl">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search insights by title, summary, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="search-input"
                />
              </div>

              {/* Impact Filter */}
              <Select value={impactFilter} onValueChange={setImpactFilter}>
                <SelectTrigger className="w-40" data-testid="impact-filter">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Impact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Impact</SelectItem>
                  <SelectItem value="high">High Impact</SelectItem>
                  <SelectItem value="medium">Medium Impact</SelectItem>
                  <SelectItem value="low">Low Impact</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredInsights.length} of {insights.length} insights
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Insights Cards */}
          <div className="space-y-6">
            {filteredInsights.length === 0 && !isLoading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No insights found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or filters to see more results.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredInsights.map((insight: Insight) => (
                <Card key={insight.id} className="hover:shadow-lg transition-shadow duration-200" data-testid={`insight-card-${insight.id}`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {getImpactIcon(insight.impact)}
                          <CardTitle className="text-lg leading-tight">{insight.title}</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{insight.summary}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Impact Indicator */}
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getImpactColor(insight.impact)}`}></div>
                          <span className="text-sm text-muted-foreground capitalize">{insight.impact}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-4">
                    {/* Categories */}
                    <div className="flex flex-wrap gap-2">
                      {insight.categories.map((category) => (
                        <Badge key={category} variant="secondary" className="flex items-center gap-1">
                          {getCategoryIcon(category)}
                          {category}
                        </Badge>
                      ))}
                    </div>

                    {/* Insights Content */}
                    <div className="markdown-content prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm, remarkBreaks]}
                        components={{
                          // Custom styling for tables
                          table: ({ children }) => (
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                {children}
                              </table>
                            </div>
                          ),
                          thead: ({ children }) => (
                            <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>
                          ),
                          tbody: ({ children }) => (
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                              {children}
                            </tbody>
                          ),
                          tr: ({ children }) => (
                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">{children}</tr>
                          ),
                          th: ({ children }) => (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              {children}
                            </th>
                          ),
                          td: ({ children }) => (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {children}
                            </td>
                          ),
                          // Custom styling for checkboxes
                          input: ({ type, checked, ...props }) => {
                            if (type === 'checkbox') {
                              return (
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  readOnly
                                  className="mr-2 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                  {...props}
                                />
                              );
                            }
                            return <input type={type} {...props} />;
                          },
                          // Custom styling for code blocks
                          code: ({ node, className, children, ...props }: any) => {
                            const match = /language-(\w+)/.exec(className || '');
                            const isInline = !match;
                            return !isInline ? (
                              <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              </pre>
                            ) : (
                              <code className="bg-gray-100 dark:bg-gray-100 px-1 py-0.5 rounded text-sm" {...props}>
                                {children}
                              </code>
                            );
                          },
                          // Custom styling for blockquotes
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-primary pl-4 italic text-gray-600 dark:text-gray-400">
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {insight.content}
                      </ReactMarkdown>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(insight.createdAt), 'MMM d, yyyy • h:mm a')}
                      </div>
                      
                      {insight.mentions && insight.mentions.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {insight.mentions.join(', ')}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}