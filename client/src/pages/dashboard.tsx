import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { StatsOverview } from "@/components/StatsOverview";
import { CompetitorCard } from "@/components/CompetitorCard";
import { PricingChart } from "@/components/PricingChart";
import { ComparisonTable } from "@/components/ComparisonTable";
import { AlertsPanel } from "@/components/AlertsPanel";
import { HistoryPanel } from "@/components/HistoryPanel";
import { type CompetitorWithPlans, type DashboardStats } from "@shared/schema";

export default function Dashboard() {
  const { data: competitors, isLoading: competitorsLoading } = useQuery<CompetitorWithPlans[]>({
    queryKey: ['/api/competitors']
  });

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats']
  });

  if (competitorsLoading || statsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-dashboard-bg" data-testid="dashboard-container">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header />
        
        <div className="p-6 space-y-6">
          <StatsOverview stats={stats} />
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-4">
              {competitors?.map((competitor) => (
                <CompetitorCard 
                  key={competitor.id} 
                  competitor={competitor}
                  data-testid={`competitor-card-${competitor.id}`}
                />
              ))}
            </div>
            
            <div className="space-y-6">
              <PricingChart competitors={competitors || []} />
            </div>
          </div>
          
          <ComparisonTable competitors={competitors || []} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AlertsPanel />
            <HistoryPanel competitors={competitors || []} />
          </div>
        </div>
      </main>
    </div>
  );
}
