import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { type CompetitorWithPlans } from "@shared/schema";
import { useState } from "react";

interface HistoryPanelProps {
  competitors: CompetitorWithPlans[];
}

export function HistoryPanel({ competitors }: HistoryPanelProps) {
  const [timeRange, setTimeRange] = useState("30");

  const getCompetitorInitial = (name: string) => name.charAt(0).toUpperCase();
  
  const getCompetitorColor = (name: string) => {
    if (name.includes("Heidi")) return "bg-blue-100 text-blue-600";
    if (name.includes("Freed")) return "bg-green-100 text-green-600";
    if (name.includes("Sunoh")) return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-600";
  };

  const getCurrentPrice = (competitor: CompetitorWithPlans) => {
    const paidPlans = competitor.plans.filter(plan => plan.price && plan.price > 0);
    if (paidPlans.length === 0) return 0;
    
    // Get the most representative plan
    const mainPlan = paidPlans.find(plan => 
      plan.planName.toLowerCase().includes("pro") || 
      plan.planName.toLowerCase().includes("individual")
    ) || paidPlans[0];
    
    return Math.round((mainPlan.price || 0) / 100);
  };

  const getPriceChange = (competitor: CompetitorWithPlans) => {
    // Mock price change data based on competitor
    if (competitor.name.includes("Heidi")) {
      return { change: 0, percentage: 0, trend: "stable" as const };
    }
    if (competitor.name.includes("Freed")) {
      return { change: -9, percentage: -9, trend: "decrease" as const };
    }
    if (competitor.name.includes("Sunoh")) {
      return { change: -50, percentage: -25, trend: "decrease" as const };
    }
    return { change: 0, percentage: 0, trend: "stable" as const };
  };

  const getStatusText = (competitor: CompetitorWithPlans) => {
    if (competitor.name.includes("Heidi")) return "No changes";
    if (competitor.name.includes("Freed")) return "Price reduced";
    if (competitor.name.includes("Sunoh")) return "Limited promotion";
    return "No changes";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increase":
        return <TrendingUp className="w-4 h-4 mr-1" />;
      case "decrease":
        return <TrendingDown className="w-4 h-4 mr-1" />;
      default:
        return <Minus className="w-4 h-4 mr-1" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "increase":
        return "text-red-600";
      case "decrease":
        return "text-green-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-testid="history-panel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Price History Trends</h3>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32" data-testid="time-range-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="180">Last 6 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-4">
        {competitors.map((competitor) => {
          const currentPrice = getCurrentPrice(competitor);
          const priceChange = getPriceChange(competitor);
          const statusText = getStatusText(competitor);
          
          return (
            <div 
              key={competitor.id} 
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              data-testid={`history-item-${competitor.id}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getCompetitorColor(competitor.name)}`}>
                  <span className="font-bold text-sm">{getCompetitorInitial(competitor.name)}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900" data-testid={`history-name-${competitor.id}`}>
                    {competitor.name}
                  </p>
                  <p className="text-xs text-gray-500" data-testid={`history-status-${competitor.id}`}>
                    {statusText}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900" data-testid={`history-price-${competitor.id}`}>
                  ${currentPrice}
                </p>
                <div className={`flex items-center text-xs ${getTrendColor(priceChange.trend)}`} data-testid={`history-trend-${competitor.id}`}>
                  {getTrendIcon(priceChange.trend)}
                  <span>
                    {priceChange.trend === "stable" ? "Stable" : `${priceChange.percentage}%`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
