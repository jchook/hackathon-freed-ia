import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Minus, Calendar, DollarSign, Users, Star, AlertTriangle } from "lucide-react";

export default function Deltas() {
  const deltaCards = [
    {
      id: "pricing-changes",
      title: "Pricing Changes",
      subtitle: "Last 30 days",
      icon: DollarSign,
      items: [
        { vendor: "Heidi Health", change: "+$5", type: "increase", detail: "Pro plan increased from $99 to $104/month" },
        { vendor: "Freed AI", change: "-$10", type: "decrease", detail: "Enterprise plan decreased from $199 to $189/month" },
        { vendor: "Sunoh AI", change: "No change", type: "stable", detail: "All pricing plans remain stable" }
      ]
    },
    {
      id: "feature-updates",
      title: "Feature Updates",
      subtitle: "New capabilities and improvements",
      icon: TrendingUp,
      items: [
        { vendor: "Heidi Health", change: "New Integration", type: "increase", detail: "Added Epic EHR integration capability" },
        { vendor: "Freed AI", change: "Enhanced AI", type: "increase", detail: "Improved clinical note accuracy by 15%" },
        { vendor: "Sunoh AI", change: "Mobile App", type: "increase", detail: "Released iOS and Android companion apps" }
      ]
    },
    {
      id: "market-position",
      title: "Market Position",
      subtitle: "Competitive standing changes",
      icon: Users,
      items: [
        { vendor: "Heidi Health", change: "+2 positions", type: "increase", detail: "Moved from #3 to #1 in customer satisfaction" },
        { vendor: "Freed AI", change: "-1 position", type: "decrease", detail: "Dropped from #2 to #3 in pricing competitiveness" },
        { vendor: "Sunoh AI", change: "+1 position", type: "increase", detail: "Improved from #4 to #3 in feature completeness" }
      ]
    },
    {
      id: "customer-sentiment",
      title: "Customer Sentiment",
      subtitle: "Review score changes",
      icon: Star,
      items: [
        { vendor: "Heidi Health", change: "+0.3 stars", type: "increase", detail: "Average rating improved from 4.2 to 4.5 stars" },
        { vendor: "Freed AI", change: "-0.1 stars", type: "decrease", detail: "Average rating decreased from 4.4 to 4.3 stars" },
        { vendor: "Sunoh AI", change: "+0.2 stars", type: "increase", detail: "Average rating improved from 3.9 to 4.1 stars" }
      ]
    },
    {
      id: "compliance-updates",
      title: "Compliance & Security",
      subtitle: "Regulatory and security changes",
      icon: AlertTriangle,
      items: [
        { vendor: "Heidi Health", change: "SOC 2 Certified", type: "increase", detail: "Achieved SOC 2 Type II certification" },
        { vendor: "Freed AI", change: "HIPAA Update", type: "stable", detail: "Updated HIPAA compliance documentation" },
        { vendor: "Sunoh AI", change: "ISO 27001", type: "increase", detail: "Obtained ISO 27001 information security certification" }
      ]
    },
    {
      id: "integration-ecosystem",
      title: "Integration Ecosystem",
      subtitle: "New partnerships and integrations",
      icon: TrendingUp,
      items: [
        { vendor: "Heidi Health", change: "+3 integrations", type: "increase", detail: "Added Cerner, Allscripts, and NextGen integrations" },
        { vendor: "Freed AI", change: "+1 integration", type: "increase", detail: "New partnership with Athenahealth" },
        { vendor: "Sunoh AI", change: "+2 integrations", type: "increase", detail: "Added DrChrono and Practice Fusion support" }
      ]
    }
  ];

  const getChangeIcon = (type: string) => {
    switch (type) {
      case "increase":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "decrease":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getChangeBadge = (type: string) => {
    switch (type) {
      case "increase":
        return "secondary";
      case "decrease":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex h-screen bg-dashboard-bg" data-testid="deltas-container">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header />
        
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Market Deltas</h1>
            <p className="text-muted-foreground mt-2">
              Track competitive changes, pricing shifts, and market movements across AI medical scribe vendors
            </p>
          </div>

          {/* Time Filter */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Showing changes from:</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Last 7 days</Button>
              <Button variant="default" size="sm">Last 30 days</Button>
              <Button variant="outline" size="sm">Last 90 days</Button>
            </div>
          </div>

          {/* Delta Cards Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {deltaCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <Card key={card.id} className="hover:shadow-lg transition-shadow duration-200" data-testid={`delta-card-${card.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{card.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{card.subtitle}</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {card.items.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {getChangeIcon(item.type)}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{item.vendor}</span>
                              <Badge variant={getChangeBadge(item.type)} className="text-xs">
                                {item.change}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {item.detail}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Summary Stats */}
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="text-center">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <p className="text-sm text-muted-foreground">Positive Changes</p>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-red-600">3</div>
                  <p className="text-sm text-muted-foreground">Negative Changes</p>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-600">3</div>
                  <p className="text-sm text-muted-foreground">No Changes</p>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">18</div>
                  <p className="text-sm text-muted-foreground">Total Tracked Items</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}