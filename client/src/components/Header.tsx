import { Clock, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const refreshMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/refresh"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/competitors'] });
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      toast({
        title: "Data Refreshed",
        description: "All competitor pricing data has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Refresh Failed",
        description: "Unable to refresh data. Please try again.",
        variant: "destructive",
      });
    },
  });

  const exportMutation = useMutation({
    mutationFn: () => apiRequest("GET", "/api/export/report"),
    onSuccess: async (response) => {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pricing-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Report Exported",
        description: "Pricing report has been downloaded successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Export Failed",
        description: "Unable to export report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  const handleExport = () => {
    exportMutation.mutate();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4" data-testid="header">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900" data-testid="header-title">
            Competitor Pricing Dashboard
          </h2>
          <p className="text-gray-600 mt-1" data-testid="header-subtitle">
            Real-time pricing intelligence for AI medical scribe solutions
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500" data-testid="last-updated">
            <Clock className="w-4 h-4" />
            <span>Last updated: 2 minutes ago</span>
          </div>
          <Button 
            onClick={handleRefresh}
            disabled={refreshMutation.isPending}
            className="bg-primary hover:bg-blue-600"
            data-testid="button-refresh"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button 
            onClick={handleExport}
            disabled={exportMutation.isPending}
            className="bg-success hover:bg-green-600"
            data-testid="button-export"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
    </header>
  );
}
