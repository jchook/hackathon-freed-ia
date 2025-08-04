import { Building, DollarSign, TrendingUp, Trophy } from "lucide-react";
import { type DashboardStats } from "@shared/schema";

interface StatsOverviewProps {
  stats?: DashboardStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
            <div className="h-16"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Competitors Tracked",
      value: stats.competitorsTracked.toString(),
      icon: Building,
      bgColor: "bg-blue-100",
      iconColor: "text-primary",
    },
    {
      title: "Avg. Monthly Price",
      value: `$${stats.averagePrice}`,
      icon: DollarSign,
      bgColor: "bg-green-100",
      iconColor: "text-success",
      trend: `+${stats.priceChangePercentage}% from last month`,
      trendIcon: TrendingUp,
      trendColor: "text-success",
    },
    {
      title: "Price Changes",
      value: stats.priceChanges.toString(),
      icon: TrendingUp,
      bgColor: "bg-yellow-100",
      iconColor: "text-warning",
      subtitle: "This week",
    },
    {
      title: "Market Position",
      value: `#${stats.marketPosition}`,
      icon: Trophy,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      subtitle: "By pricing competitiveness",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-testid="stats-overview">
      {statCards.map((stat, index) => (
        <div 
          key={stat.title} 
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          data-testid={`stat-card-${index}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm" data-testid={`stat-title-${index}`}>
                {stat.title}
              </p>
              <p className="text-3xl font-bold text-gray-900" data-testid={`stat-value-${index}`}>
                {stat.value}
              </p>
            </div>
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
              <stat.icon className={`${stat.iconColor} text-xl w-6 h-6`} />
            </div>
          </div>
          {stat.trend && (
            <div className="flex items-center mt-2" data-testid={`stat-trend-${index}`}>
              {stat.trendIcon && <stat.trendIcon className={`${stat.trendColor} text-sm mr-1 w-4 h-4`} />}
              <span className={`${stat.trendColor} text-sm`}>{stat.trend}</span>
            </div>
          )}
          {stat.subtitle && (
            <div className="flex items-center mt-2" data-testid={`stat-subtitle-${index}`}>
              <span className="text-gray-600 text-sm">{stat.subtitle}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
