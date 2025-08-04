import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Info, CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Alert } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function AlertsPanel() {
  const queryClient = useQueryClient();
  
  const { data: alerts, isLoading } = useQuery<Alert[]>({
    queryKey: ['/api/alerts']
  });

  const markReadMutation = useMutation({
    mutationFn: (alertId: string) => apiRequest("PATCH", `/api/alerts/${alertId}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
    },
  });

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'warning':
        return <AlertTriangle className="text-warning w-4 h-4 mt-1" />;
      case 'info':
        return <Info className="text-primary w-4 h-4 mt-1" />;
      case 'success':
        return <CheckCircle className="text-success w-4 h-4 mt-1" />;
      default:
        return <Info className="text-primary w-4 h-4 mt-1" />;
    }
  };

  const getAlertBorderColor = (severity: string) => {
    switch (severity) {
      case 'warning':
        return 'border-yellow-400 bg-yellow-50';
      case 'info':
        return 'border-blue-400 bg-blue-50';
      case 'success':
        return 'border-green-400 bg-green-50';
      default:
        return 'border-gray-400 bg-gray-50';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-testid="alerts-panel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Recent Price Alerts</h3>
        <Button variant="ghost" size="sm" data-testid="button-view-all-alerts">
          <ExternalLink className="w-4 h-4 mr-1" />
          View All
        </Button>
      </div>
      
      <div className="space-y-3">
        {alerts?.slice(0, 3).map((alert) => (
          <div 
            key={alert.id} 
            className={`flex items-start space-x-3 p-3 rounded-lg border-l-4 ${getAlertBorderColor(alert.severity)}`}
            data-testid={`alert-${alert.id}`}
          >
            {getAlertIcon(alert.severity)}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900" data-testid={`alert-title-${alert.id}`}>
                {alert.title}
              </p>
              <p className="text-xs text-gray-600 mt-1" data-testid={`alert-message-${alert.id}`}>
                {alert.message}
              </p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500" data-testid={`alert-time-${alert.id}`}>
                  {formatTimeAgo(alert.createdAt)}
                </p>
                {!alert.isRead && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => markReadMutation.mutate(alert.id)}
                    disabled={markReadMutation.isPending}
                    className="text-xs h-6 px-2"
                    data-testid={`button-mark-read-${alert.id}`}
                  >
                    Mark as read
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {(!alerts || alerts.length === 0) && (
          <div className="text-center py-8 text-gray-500" data-testid="no-alerts">
            <Info className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No recent alerts</p>
          </div>
        )}
      </div>
    </div>
  );
}
