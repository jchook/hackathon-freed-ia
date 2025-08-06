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

  // Real competitive intelligence data
  const [deltas, setDeltas] = useState<Delta[]>([
    {
      id: "delta-1",
      title: "Ambience Healthcare Raises $243M Series C",
      subheading: "Ambience Healthcare announced a $243 million Series C round co-led by Oak HC/FT and Andreessen Horowitz. The company, which offers an ambient AI platform for documentation, coding and clinical documentation integrity (CDI), now supports over 100 specialties and more than 100 ambulatory subspecialties.",
      sourceUrl: "https://www.ambiencehealthcare.com/blog/ambience-healthcare-announces-243-million-series-c-to-scale-its-ai-platform-for-health-systems",
      category: "Fundraising",
      subcategory: "Series C",
      severity: 9,
      date: "2025-07-29",
      vendor: "Ambience Healthcare"
    },
    {
      id: "delta-2",
      title: "Suki AI Expands Leadership Team",
      subheading: "Suki expanded its leadership team by appointing Dr. Kevin Wang as Chief Medical Officer, Joe Chang as Chief Technology Officer and Dr. Vikram Khanna as Chief Customer Officer. CEO Punit Soni said these seasoned leaders would help scale Suki's intelligent assistive solutions.",
      sourceUrl: "https://suki.ai",
      category: "Personnel",
      subcategory: "Executive Hires",
      severity: 6,
      date: "2025-07-24",
      vendor: "Suki AI"
    },
    {
      id: "delta-3",
      title: "Heidi Health Releases Forms & Calls Features",
      subheading: "Heidi Health released several updates. Its Forms feature automatically fills PDF forms based on visit details, while Calls (beta) lets clinicians automate routine patient calls and respond to queries.",
      sourceUrl: "https://heidihealth.com",
      category: "Features",
      subcategory: "Product Updates",
      severity: 5,
      date: "2025-07-23",
      vendor: "Heidi Health"
    },
    {
      id: "delta-4",
      title: "Abridge Announces Abridge Inside for Inpatient",
      subheading: "Abridge announced 'Abridge Inside for Inpatient,' a module integrated with Epic that generates inpatient notes. The launch coincided with Abridge's Series E raise, and Abridge forecast 50 million encounters annually with international expansion. Nemours Children's evaluation saw a 32% drop in after-hours charting.",
      sourceUrl: "https://2minutemedicine.com",
      category: "Features",
      subcategory: "Product Launch",
      severity: 8,
      date: "2025-07-07",
      vendor: "Abridge"
    },
    {
      id: "delta-5",
      title: "Abridge Raises $300M Series E at $5B+ Valuation",
      subheading: "According to StatNews snippets, Abridge raised a $300 million Series E led by Andreessen Horowitz with a valuation above $5 billion, coming just months after a February $250 million round. The company claimed over 150 enterprise customers.",
      sourceUrl: "https://statnews.com",
      category: "Fundraising",
      subcategory: "Series E",
      severity: 10,
      date: "2025-07-01",
      vendor: "Abridge"
    },
    {
      id: "delta-6",
      title: "Suki AI Integrates with MEDITECH Expanse",
      subheading: "Suki announced that it became the first ambient AI solution integrated with MEDITECH Expanse. The integration allows ambiently generated notes and dictation to flow directly into MEDITECH, enabling clinicians to reduce administrative burden. Over 100,000 encounters and 1,000 providers had already used the Expanse integration.",
      sourceUrl: "https://suki.ai",
      category: "Partnerships",
      subcategory: "EHR Integration",
      severity: 7,
      date: "2025-07-01",
      vendor: "Suki AI"
    },
    {
      id: "delta-7",
      title: "Community Health Network Adopts Nuance DAX Copilot",
      subheading: "Nuance (Microsoft) announced that Community Health Network in Indiana adopted the Dragon Medical Platform (including DAX Copilot) and Microsoft Azure as part of a multi-year digital transformation. Community expanded DAX Copilot to 400 clinicians and integrated Epic on Azure.",
      sourceUrl: "https://news.nuance.com",
      category: "Partnerships",
      subcategory: "Health System Adoption",
      severity: 6,
      date: "2025-06-25",
      vendor: "Nuance/Microsoft"
    },
    {
      id: "delta-8",
      title: "Heidi Health Launches Integration Marketplace & Smart Dictation",
      subheading: "Heidi introduced an integration marketplace that lets practices manage connections to multiple EHRs, along with Smart Dictation (automatic grammar handling) and the ability to write notes directly in Epic. The changelog also noted Heidi supports 110+ languages for transcription.",
      sourceUrl: "https://heidihealth.com",
      category: "Features",
      subcategory: "Integration Platform",
      severity: 6,
      date: "2025-06-21",
      vendor: "Heidi Health"
    },
    {
      id: "delta-9",
      title: "Freed AI Raises $30M Series A",
      subheading: "Freed AI announced a $30 million Series A led by Sequoia Capital. The company has 17,000 paying clinicians, has saved more than 2.5 million hours of clinicians' time and achieved 4× year-over-year ARR growth. New features include specialty-specific notes, a custom template builder, pre-charting and EHR integration via browser extension.",
      sourceUrl: "https://businesswire.com",
      category: "Fundraising",
      subcategory: "Series A",
      severity: 8,
      date: "2025-03-05",
      vendor: "Freed AI"
    },
    {
      id: "delta-10",
      title: "DeepScribe Partners with Pearl Health ACO REACH",
      subheading: "DeepScribe became Pearl Health's preferred ambient AI partner for more than 3,500 primary care providers participating in the ACO REACH program. The integration pulls forward previous notes, generates new notes automatically and has adoption rates over 80%; DeepScribe holds a 98.8 KLAS score.",
      sourceUrl: "https://deepscribe.ai",
      category: "Partnerships",
      subcategory: "ACO Partnership",
      severity: 7,
      date: "2025-01-14",
      vendor: "DeepScribe"
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
