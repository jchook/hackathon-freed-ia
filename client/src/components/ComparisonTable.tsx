import { Button } from "@/components/ui/button";
import { Check, X, ExpandIcon, Download } from "lucide-react";
import { type CompetitorWithPlans } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ComparisonTableProps {
  competitors: CompetitorWithPlans[];
}

export function ComparisonTable({ competitors }: ComparisonTableProps) {
  const { toast } = useToast();

  const exportMutation = useMutation({
    mutationFn: () => apiRequest("GET", "/api/export/report"),
    onSuccess: async (response) => {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `comparison-table-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Table Exported",
        description: "Comparison table has been downloaded successfully.",
      });
    },
  });

  const getStartingPrice = (competitor: CompetitorWithPlans) => {
    const paidPlans = competitor.plans.filter(plan => plan.price && plan.price > 0);
    if (paidPlans.length === 0) return "Free";
    const lowestPrice = Math.min(...paidPlans.map(plan => plan.price || 0));
    return `$${Math.round(lowestPrice / 100)}/month`;
  };

  const hasFeature = (competitor: CompetitorWithPlans, feature: string) => {
    // Mock feature detection based on competitor name and feature
    const competitorName = competitor.name.toLowerCase();
    
    switch (feature) {
      case "Free Trial":
        return true; // All have some form of free trial
      case "Unlimited Notes":
        return !competitor.plans.some(plan => plan.planName.toLowerCase() === "free");
      case "Custom Templates":
        return !competitorName.includes("sunoh");
      case "EHR Integration":
        return true; // All have some form of EHR integration
      case "Team Features":
        return competitor.plans.some(plan => 
          plan.planName.toLowerCase().includes("together") || 
          plan.planName.toLowerCase().includes("group") ||
          plan.planName.toLowerCase().includes("team")
        );
      default:
        return Math.random() > 0.3; // Mock random feature availability
    }
  };

  const getTrialInfo = (competitor: CompetitorWithPlans) => {
    if (competitor.name.includes("Freed")) return "7 days";
    if (competitor.plans.some(plan => plan.planName.toLowerCase() === "free")) return "✓";
    return "✓";
  };

  const features = [
    "Starting Price",
    "Free Trial", 
    "Unlimited Notes",
    "Custom Templates",
    "EHR Integration",
    "Team Features"
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" data-testid="comparison-table">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Detailed Feature Comparison</h3>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-primary hover:text-blue-600"
              data-testid="button-expand-all"
            >
              <ExpandIcon className="w-4 h-4 mr-1" />
              Expand All
            </Button>
            <Button 
              size="sm"
              onClick={() => exportMutation.mutate()}
              disabled={exportMutation.isPending}
              data-testid="button-export-table"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Table
            </Button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Feature</th>
              {competitors.map(competitor => (
                <th key={competitor.id} className="px-6 py-4 text-center text-sm font-medium text-gray-900" data-testid={`table-header-${competitor.id}`}>
                  {competitor.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {features.map((feature, index) => (
              <tr key={feature} className="hover:bg-gray-50 transition-colors" data-testid={`table-row-${index}`}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{feature}</td>
                {competitors.map(competitor => (
                  <td key={competitor.id} className="px-6 py-4 text-center text-sm text-gray-900">
                    {feature === "Starting Price" ? (
                      <span data-testid={`starting-price-${competitor.id}`}>{getStartingPrice(competitor)}</span>
                    ) : feature === "Free Trial" ? (
                      <span data-testid={`free-trial-${competitor.id}`}>{getTrialInfo(competitor)}</span>
                    ) : hasFeature(competitor, feature) ? (
                      <Check className="w-5 h-5 text-success mx-auto" data-testid={`feature-check-${competitor.id}-${index}`} />
                    ) : (
                      <X className="w-5 h-5 text-gray-400 mx-auto" data-testid={`feature-cross-${competitor.id}-${index}`} />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
