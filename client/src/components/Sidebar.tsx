import { useState } from "react";
import { BarChart3, MessageSquare, TrendingUp, Rss, GitCompare, RefreshCw, Download, Clock, FileText, User, Activity, Building2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { RefreshProgress } from "@/components/RefreshProgress";
import logoImage from "@assets/Gemini_Generated_Image_da5ni7da5ni7da5n (1)_1754525964468.jpeg";

export function Sidebar() {
  const [location] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showRefreshProgress, setShowRefreshProgress] = useState(false);

  const handleRefreshComplete = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    queryClient.invalidateQueries({ queryKey: ['/api/competitors'] });
    queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
    queryClient.invalidateQueries({ queryKey: ['/api/seo'] });
    queryClient.invalidateQueries({ queryKey: ['/api/pricing-plans'] });
    queryClient.invalidateQueries({ queryKey: ['/api/feed'] });
    queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
    queryClient.invalidateQueries({ queryKey: ['/api/competitors-with-reviews'] });
    setShowRefreshProgress(false);
  };

  const exportMutation = useMutation({
    mutationFn: () => apiRequest("GET", "/api/export/report"),
    onSuccess: async (response) => {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scribearena-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Report Exported",
        description: "Data report has been downloaded successfully.",
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
  
  const navItems = [
    { icon: BarChart3, label: "Dashboard", href: "/", active: location === "/" },
    { icon: Activity, label: "Deltas", href: "/deltas", active: location === "/deltas" },
    { icon: Rss, label: "Feed", href: "/feed", active: location === "/feed" },
    { icon: MessageSquare, label: "Reviews", href: "/reviews", active: location === "/reviews" },
    { icon: GitCompare, label: "Comparison", href: "/comparison", active: location === "/comparison" },
    { icon: FileText, label: "Example Note", href: "/example-note", active: location === "/example-note" },
    { icon: Building2, label: "Scribes", href: "/scribes", active: location === "/scribes" },
    { icon: User, label: "About", href: "/about", active: location === "/about" },
  ];

  return (
    <aside className="w-64 bg-sidebar-bg text-white flex-shrink-0" data-testid="sidebar">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8" data-testid="sidebar-logo">
          <div className="w-10 h-10 rounded-lg overflow-hidden">
            <img 
              src={logoImage} 
              alt="ScribeArena Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-xl font-bold">ScribeArena</h1>
        </div>
        
        {/* Action Buttons */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center space-x-2 text-xs text-gray-300" data-testid="sidebar-last-updated">
            <Clock className="w-3 h-3" />
            <span>Updated: 2 min ago</span>
          </div>
          <Button 
            onClick={() => setShowRefreshProgress(true)}
            className="w-full bg-primary hover:bg-blue-600 text-white"
            data-testid="sidebar-refresh"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button 
            onClick={() => exportMutation.mutate()}
            disabled={exportMutation.isPending}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            data-testid="sidebar-export"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => (
            item.href.startsWith("/") ? (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  item.active 
                    ? 'bg-primary/20 text-blue-300' 
                    : 'hover:bg-gray-700'
                }`}
                data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  item.active 
                    ? 'bg-primary/20 text-blue-300' 
                    : 'hover:bg-gray-700'
                }`}
                data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </a>
            )
          ))}
        </nav>
      </div>
      
      <RefreshProgress 
        isOpen={showRefreshProgress}
        onClose={() => setShowRefreshProgress(false)}
        onComplete={handleRefreshComplete}
      />
    </aside>
  );
}
