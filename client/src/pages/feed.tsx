import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  Building, TrendingDown, AlertTriangle, CheckCircle
} from "lucide-react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Delta {
  id: string;
  title: string;
  subheading: string;
  sourceUrl: string;
  category: string;
  subcategory: string;
  severity: number;
  date: string;
  vendor: string;
}

export default function Feed() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Demo data - in real app this would come from API
  const [deltas, setDeltas] = useState<Delta[]>([
    {
      id: "delta-1",
      title: "Heidi Health Raises $40M Series B",
      subheading: "AI medical scribe platform secures funding from Andreessen Horowitz to expand EHR integrations",
      sourceUrl: "https://techcrunch.com/heidi-health-series-b",
      category: "Fundraising",
      subcategory: "Series B",
      severity: 8,
      date: "2025-01-15",
      vendor: "Heidi Health"
    },
    {
      id: "delta-2", 
      title: "Freed AI Increases Enterprise Pricing",
      subheading: "Monthly subscription increases from $199 to $229 for enterprise plans effective February 1st",
      sourceUrl: "https://freed.ai/pricing",
      category: "Pricing",
      subcategory: "Price Increase",
      severity: 6,
      date: "2025-01-14",
      vendor: "Freed AI"
    },
    {
      id: "delta-3",
      title: "Sunoh AI Launches Mobile App",
      subheading: "New iOS and Android companion apps enable voice capture and real-time transcription",
      sourceUrl: "https://sunoh.ai/blog/mobile-app-launch",
      category: "Features", 
      subcategory: "Mobile Platform",
      severity: 5,
      date: "2025-01-13",
      vendor: "Sunoh AI"
    },
    {
      id: "delta-4",
      title: "Epic Systems Announces AI Scribe Integration",
      subheading: "Healthcare giant enters competitive space with built-in ambient documentation features",
      sourceUrl: "https://epic.com/ai-scribe-announcement",
      category: "Competitor Entry",
      subcategory: "EHR Integration",
      severity: 9,
      date: "2025-01-12",
      vendor: "Epic Systems"
    },
    {
      id: "delta-5",
      title: "Heidi Health Data Breach Incident",
      subheading: "Unauthorized access to patient transcription data affects 15,000 users, investigation ongoing",
      sourceUrl: "https://security.heidi.ai/breach-report",
      category: "Security",
      subcategory: "Data Breach",
      severity: 10,
      date: "2025-01-11",
      vendor: "Heidi Health"
    },
    {
      id: "delta-6",
      title: "Freed AI Hires Former Google Health VP",
      subheading: "Sarah Chen joins as Chief Medical Officer to lead clinical accuracy initiatives",
      sourceUrl: "https://freed.ai/blog/sarah-chen-joins",
      category: "Personnel",
      subcategory: "Executive Hire",
      severity: 4,
      date: "2025-01-10",
      vendor: "Freed AI"
    }
  ]);

  const addDemoDelta = useMutation({
    mutationFn: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    },
    onSuccess: () => {
      const newDelta: Delta = {
        id: `delta-${Date.now()}`,
        title: "Sunoh AI Partners with Microsoft Teams",
        subheading: "New integration allows seamless documentation during virtual patient consultations",
        sourceUrl: "https://sunoh.ai/microsoft-partnership", 
        category: "Partnerships",
        subcategory: "Platform Integration",
        severity: 7,
        date: new Date().toISOString().split('T')[0],
        vendor: "Sunoh AI"
      };
      
      setDeltas(prev => [newDelta, ...prev]);
      
      toast({
        title: "New Delta Added",
        description: "Demo delta has been added to the feed.",
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
      "Blog/Newsletter": FileText
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
  const filteredDeltas = useMemo(() => {
    let filtered = deltas;

    // Text search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(delta => 
        delta.title.toLowerCase().includes(searchLower) ||
        delta.subheading.toLowerCase().includes(searchLower) ||
        delta.vendor.toLowerCase().includes(searchLower) ||
        delta.category.toLowerCase().includes(searchLower) ||
        delta.subcategory.toLowerCase().includes(searchLower)
      );
    }

    // Severity filter
    if (severityFilter !== "all") {
      const severityThreshold = parseInt(severityFilter);
      filtered = filtered.filter(delta => {
        if (severityFilter === "high") return delta.severity >= 8;
        if (severityFilter === "med") return delta.severity >= 5 && delta.severity < 8;
        if (severityFilter === "low") return delta.severity < 5;
        return true;
      });
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [deltas, searchTerm, severityFilter]);

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
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${addDemoDelta.isPending ? 'animate-spin' : ''}`} />
              Add Demo Delta
            </Button>
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredDeltas.length} of {deltas.length} deltas
          </div>

          {/* Delta Cards */}
          <div className="space-y-4">
            {filteredDeltas.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Rss className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No deltas found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or filters to see more results.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredDeltas.map((delta) => (
                <Card key={delta.id} className="hover:shadow-lg transition-shadow duration-200" data-testid={`delta-card-${delta.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg leading-tight mb-2">{delta.title}</CardTitle>
                        <p className="text-sm text-muted-foreground leading-relaxed">{delta.subheading}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Severity Indicator */}
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getSeverityColor(delta.severity)}`}></div>
                          <span className="text-sm text-muted-foreground">{getSeverityLabel(delta.severity)}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Category Badge */}
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {getCategoryIcon(delta.category)}
                        {delta.category}
                      </Badge>
                      
                      {/* Subcategory Badge */}
                      <Badge variant="outline" className="text-xs">
                        {delta.subcategory}
                      </Badge>
                      
                      {/* Vendor Badge */}
                      <Badge variant="default" className="text-xs">
                        {delta.vendor}
                      </Badge>
                      
                      <div className="flex-1"></div>
                      
                      {/* Date and Source Link */}
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(delta.date), 'MMM d, yyyy')}
                        </div>
                        
                        <a 
                          href={delta.sourceUrl} 
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
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}