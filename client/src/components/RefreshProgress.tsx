import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, RefreshCw, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RefreshStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
  currentVendor?: string;
  details?: string;
}

interface RefreshProgressProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function RefreshProgress({ isOpen, onClose, onComplete }: RefreshProgressProps) {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<RefreshStep[]>([
    {
      id: 'pricing',
      title: 'Update Pricing Information',
      description: 'Fetching latest pricing plans and comparing with existing data',
      status: 'pending',
      progress: 0,
    },
    {
      id: 'reviews',
      title: 'Update Latest Reviews',
      description: 'Extracting and classifying customer feedback and sentiment',
      status: 'pending',
      progress: 0,
    },
    {
      id: 'feed',
      title: 'Update News Feed',
      description: 'Collecting latest updates from all vendor sources',
      status: 'pending',
      progress: 0,
    },
  ]);

  const updateStepStatus = (stepId: string, updates: Partial<RefreshStep>) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  };

  const startRefresh = async () => {
    setIsRefreshing(true);
    setCurrentStep(0);
    
    try {
      // Step 1: Update Pricing Information
      setCurrentStep(0);
      updateStepStatus('pricing', { status: 'running', progress: 0 });
      
      const vendors = ['Heidi Health', 'Freed AI', 'Sunoh AI'];
      for (let i = 0; i < vendors.length; i++) {
        updateStepStatus('pricing', { 
          currentVendor: vendors[i], 
          progress: Math.round((i / vendors.length) * 100) 
        });
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing
      }
      
      updateStepStatus('pricing', { 
        status: 'completed', 
        progress: 100, 
        currentVendor: undefined,
        details: 'Successfully updated 3 vendors. No new plans detected.'
      });

      // Step 2: Update Reviews
      setCurrentStep(1);
      updateStepStatus('reviews', { status: 'running', progress: 0 });
      
      const reviewSources = ['Healthcare Surveys', 'Medical Forums', 'App Stores'];
      for (let i = 0; i < reviewSources.length; i++) {
        updateStepStatus('reviews', { 
          currentVendor: reviewSources[i], 
          progress: Math.round((i / reviewSources.length) * 100) 
        });
        await new Promise(resolve => setTimeout(resolve, 1200));
      }
      
      updateStepStatus('reviews', { 
        status: 'completed', 
        progress: 100, 
        currentVendor: undefined,
        details: 'Found 12 new reviews. Classified sentiment: 8 positive, 3 neutral, 1 negative.'
      });

      // Step 3: Update Feed
      setCurrentStep(2);
      updateStepStatus('feed', { status: 'running', progress: 0 });
      
      const feedSources = ['Heidi Blog', 'Freed Updates', 'Sunoh News', 'Market Research'];
      for (let i = 0; i < feedSources.length; i++) {
        updateStepStatus('feed', { 
          currentVendor: feedSources[i], 
          progress: Math.round((i / feedSources.length) * 100) 
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      updateStepStatus('feed', { 
        status: 'completed', 
        progress: 100, 
        currentVendor: undefined,
        details: 'Added 6 new updates. Latest: Epic integration announcements.'
      });

      // Complete
      toast({
        title: "Data Refresh Complete",
        description: "All vendor data has been successfully updated.",
      });
      
      onComplete();
      
    } catch (error) {
      const errorStepId = steps[currentStep]?.id;
      if (errorStepId) {
        updateStepStatus(errorStepId, { 
          status: 'error', 
          details: 'Failed to complete this step. Please try again.' 
        });
      }
      
      toast({
        title: "Refresh Failed",
        description: "An error occurred during the data refresh process.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isOpen && !isRefreshing) {
      // Reset steps when dialog opens
      setSteps(prev => prev.map(step => ({ 
        ...step, 
        status: 'pending' as const, 
        progress: 0, 
        currentVendor: undefined,
        details: undefined 
      })));
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getStepIcon = (step: RefreshStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'running':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: RefreshStep['status']) => {
    const variants = {
      pending: 'secondary',
      running: 'default',
      completed: 'default',
      error: 'destructive',
    } as const;

    const labels = {
      pending: 'Pending',
      running: 'Running',
      completed: 'Completed',
      error: 'Error',
    };

    return (
      <Badge variant={variants[status]} className="text-xs">
        {labels[status]}
      </Badge>
    );
  };

  const allCompleted = steps.every(step => step.status === 'completed');
  const hasError = steps.some(step => step.status === 'error');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="refresh-progress-modal">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Data Refresh Progress
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isRefreshing}
            data-testid="close-refresh-modal"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round((steps.filter(s => s.status === 'completed').length / steps.length) * 100)}%</span>
            </div>
            <Progress 
              value={(steps.filter(s => s.status === 'completed').length / steps.length) * 100} 
              className="h-2"
            />
          </div>

          {/* Current Status */}
          {isRefreshing && (
            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-100">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Currently Processing
              </div>
              {steps[currentStep]?.currentVendor && (
                <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  {steps[currentStep].currentVendor}
                </div>
              )}
            </div>
          )}

          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className={`border rounded-lg p-4 transition-all ${
                  step.status === 'running' ? 'border-blue-200 bg-blue-50 dark:bg-blue-950' : 
                  step.status === 'completed' ? 'border-green-200 bg-green-50 dark:bg-green-950' :
                  step.status === 'error' ? 'border-red-200 bg-red-50 dark:bg-red-950' :
                  'border-gray-200 bg-gray-50 dark:bg-gray-900'
                }`}
                data-testid={`refresh-step-${step.id}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {getStepIcon(step)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{step.title}</h4>
                        {getStatusBadge(step.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {step.description}
                      </p>
                      {step.status === 'running' && (
                        <div className="space-y-2">
                          <Progress value={step.progress} className="h-1.5" />
                          {step.currentVendor && (
                            <div className="text-xs text-muted-foreground">
                              Processing: {step.currentVendor}
                            </div>
                          )}
                        </div>
                      )}
                      {step.details && (
                        <div className="text-xs text-muted-foreground mt-2 p-2 bg-white dark:bg-gray-800 rounded border">
                          {step.details}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isRefreshing}
              data-testid="cancel-refresh"
            >
              {allCompleted ? 'Close' : 'Cancel'}
            </Button>
            
            <div className="flex gap-2">
              {hasError && !isRefreshing && (
                <Button 
                  variant="outline" 
                  onClick={startRefresh}
                  data-testid="retry-refresh"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry Failed
                </Button>
              )}
              
              {!isRefreshing && !allCompleted && (
                <Button 
                  onClick={startRefresh}
                  data-testid="start-refresh"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Start Refresh
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}