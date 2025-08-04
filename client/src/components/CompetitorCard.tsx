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

  return null;
}
