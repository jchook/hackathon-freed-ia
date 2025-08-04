import { Calendar, CheckCircle, AlertTriangle, Percent } from "lucide-react";
import { type CompetitorWithPlans } from "@shared/schema";

interface CompetitorCardProps {
  competitor: CompetitorWithPlans;
}

export function CompetitorCard({ competitor }: CompetitorCardProps) {
  const getCompetitorInitial = (name: string) => name.charAt(0).toUpperCase();
  
  const getGradientClass = (name: string) => {
    if (name.includes("Heidi")) return "from-blue-500 to-purple-600";
    if (name.includes("Freed")) return "from-green-500 to-blue-600";
    if (name.includes("Sunoh")) return "from-orange-500 to-red-600";
    return "from-gray-500 to-gray-600";
  };

  const formatPrice = (price: number | null) => {
    if (!price) return "Free";
    return `$${Math.round(price / 100)}`;
  };

  const getPlanStyle = (planName: string, isPromo?: boolean) => {
    if (isPromo) return "bg-red-50 border-2 border-red-200";
    if (planName.toLowerCase().includes("pro") || planName.toLowerCase().includes("individual")) {
      return "bg-blue-50 border-2 border-blue-200";
    }
    if (planName.toLowerCase().includes("together") || planName.toLowerCase().includes("group")) {
      return "bg-orange-50 rounded-lg";
    }
    return "bg-gray-50 rounded-lg";
  };

  const getPlanTextColor = (planName: string, isPromo?: boolean) => {
    if (isPromo) return "text-red-600";
    if (planName.toLowerCase().includes("pro") || planName.toLowerCase().includes("individual")) {
      return "text-blue-600";
    }
    if (planName.toLowerCase().includes("together") || planName.toLowerCase().includes("group")) {
      return "text-orange-600";
    }
    return "text-gray-900";
  };

  const hasPromotion = competitor.plans.some(plan => plan.isPromo);
  const hasRecentChange = competitor.name.includes("Freed"); // Mock logic

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" data-testid={`competitor-card-${competitor.id}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${getGradientClass(competitor.name)} rounded-lg flex items-center justify-center`}>
              <span className="text-white font-bold text-lg">{getCompetitorInitial(competitor.name)}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900" data-testid={`competitor-name-${competitor.id}`}>
                {competitor.name}
              </h3>
              <p className="text-gray-600" data-testid={`competitor-description-${competitor.id}`}>
                {competitor.description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800" data-testid={`competitor-status-${competitor.id}`}>
              <CheckCircle className="w-3 h-3 mr-1" />
              Active
            </span>
            {hasPromotion && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800" data-testid={`competitor-promo-${competitor.id}`}>
                <Percent className="w-3 h-3 mr-1" />
                Limited Offer
              </span>
            )}
          </div>
        </div>
        
        <div className={`grid grid-cols-${Math.min(competitor.plans.length, 4)} gap-4 mb-6`} data-testid={`competitor-plans-${competitor.id}`}>
          {competitor.plans.map((plan) => (
            <div key={plan.id} className={`text-center p-3 rounded-lg ${getPlanStyle(plan.planName, plan.isPromo)}`}>
              {plan.isPromo && plan.originalPrice ? (
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <p className="text-lg text-red-400 line-through">{formatPrice(plan.originalPrice)}</p>
                  <p className="text-2xl font-bold text-red-600">{formatPrice(plan.price)}</p>
                </div>
              ) : (
                <p className="text-2xl font-bold" style={{ color: getPlanTextColor(plan.planName, plan.isPromo).replace('text-', '') }}>
                  {formatPrice(plan.price)}
                </p>
              )}
              <p className={`text-sm font-medium ${getPlanTextColor(plan.planName, plan.isPromo)}`}>
                {plan.planName}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {plan.billingPeriod === 'monthly' ? 'Monthly' : plan.billingPeriod === 'annual' ? 'Annual' : 'Per user/month'}
              </p>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Last updated: Jan 15, 2024</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {hasRecentChange ? (
              <>
                <span className="text-warning text-sm">Price change detected</span>
                <AlertTriangle className="w-4 h-4 text-warning" />
              </>
            ) : hasPromotion ? (
              <>
                <span className="text-danger text-sm">25% discount active</span>
                <Percent className="w-4 h-4 text-danger" />
              </>
            ) : (
              <span className="text-success text-sm">No changes</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
