import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Rss, ExternalLink, Calendar, Filter, Tag } from "lucide-react";
import { type FeedItem } from "@shared/schema";
import { format } from "date-fns";

export default function Feed() {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: feedItems, isLoading } = useQuery<FeedItem[]>({
    queryKey: ['/api/feed', selectedSource, selectedTags],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedSource) params.append('source', selectedSource);
      if (selectedTags.length > 0) params.append('tags', selectedTags.join(','));
      return fetch(`/api/feed?${params.toString()}`).then(res => res.json());
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feed...</p>
        </div>
      </div>
    );
  }

  const sources = [
    { id: 'heidi', name: 'Heidi Health', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
    { id: 'freed', name: 'Freed AI', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    { id: 'sunoh', name: 'Sunoh AI', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
    { id: 'market', name: 'Market News', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' },
  ];

  const availableTags = [
    'product-update',
    'integration',
    'funding',
    'security',
    'market-research',
    'beta',
    'forms',
    'automation',
    'calls',
    'epic',
    'ehr',
    'series-a',
    'sequoia',
    'hipaa',
    'privacy',
    'templates',
    'customization',
    'productivity'
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getSourceInfo = (source: string) => {
    return sources.find(s => s.id === source) || { id: source, name: source, color: 'bg-gray-100 text-gray-800' };
  };

  const getTagColor = (tag: string) => {
    const tagColors: Record<string, string> = {
      'product-update': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300',
      'integration': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300',
      'funding': 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300',
      'security': 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300',
      'market-research': 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300',
      'beta': 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300',
    };
    return tagColors[tag] || 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300';
  };

  return (
    <div className="flex h-screen bg-dashboard-bg" data-testid="feed-container">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header />
        
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Industry Feed</h1>
            <p className="text-muted-foreground mt-2">
              Latest updates, announcements, and market insights from AI medical scribe vendors
            </p>
          </div>

          {/* Source Filters */}
          <Card data-testid="source-filters">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter by Source
              </CardTitle>
              <CardDescription>
                Filter updates by vendor or view all market activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant={selectedSource === null ? "default" : "outline"}
                  onClick={() => setSelectedSource(null)}
                  className="h-9"
                  data-testid="filter-all"
                >
                  All Sources
                </Button>
                {sources.map((source) => (
                  <Button
                    key={source.id}
                    variant={selectedSource === source.id ? "default" : "outline"}
                    onClick={() => setSelectedSource(source.id)}
                    className="h-9"
                    data-testid={`filter-${source.id}`}
                  >
                    {source.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tag Filters */}
          <Card data-testid="tag-filters">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Filter by Tags
              </CardTitle>
              <CardDescription>
                Select multiple tags to filter updates. Leave empty to show all tags.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => handleTagToggle(tag)}
                      data-testid={`tag-checkbox-${tag}`}
                    />
                    <label 
                      htmlFor={`tag-${tag}`} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {tag}
                    </label>
                  </div>
                ))}
              </div>
              
              {/* Clear Tags Button */}
              {selectedTags.length > 0 && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTags([])}
                    data-testid="clear-tags"
                  >
                    Clear All Tags ({selectedTags.length})
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feed Items */}
          <div className="space-y-4">
            {feedItems?.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Rss className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Updates Available</h3>
                  <p className="text-muted-foreground">
                    {selectedSource 
                      ? `No updates from ${getSourceInfo(selectedSource).name} at this time.`
                      : "No feed updates are currently available."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              feedItems?.map((item) => {
                const sourceInfo = getSourceInfo(item.source);
                return (
                  <Card key={item.id} className="hover:shadow-md transition-shadow" data-testid={`feed-item-${item.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className={sourceInfo.color}>
                              {sourceInfo.name}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(item.publishedAt), 'MMM d, yyyy')}
                            </div>
                          </div>
                          <CardTitle className="text-xl leading-tight">
                            {item.title}
                          </CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="flex-shrink-0"
                        >
                          <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid={`external-link-${item.id}`}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {item.content}
                      </p>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className={`text-xs ${getTagColor(tag)}`}
                              data-testid={`tag-${tag}`}
                            >
                              {tag.replace('-', ' ')}
                            </Badge>
                          ))}
                        </div>
                      )}
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