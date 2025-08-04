import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Plus, RefreshCw, Globe, CheckCircle, Brain, ExternalLink, Star, Rss } from "lucide-react";

const vendorInputSchema = z.object({
  input: z.string().min(2, "Please enter a company name, website, or description"),
});

type VendorInputForm = z.infer<typeof vendorInputSchema>;

interface VendorAnalysis {
  vendorName: string;
  description: string;
  website: string;
  reviewSources: Array<{
    platform: string;
    url: string;
    confidence: number;
  }>;
  newsSources: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  confidence: number;
  reasoning: string;
}

interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = "input" | "analyzing" | "review" | "success";

export function AddVendorModal({ isOpen, onClose, onSuccess }: AddVendorModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState<Step>("input");
  const [vendorAnalysis, setVendorAnalysis] = useState<VendorAnalysis | null>(null);
  const [addedVendorName, setAddedVendorName] = useState("");

  const form = useForm<VendorInputForm>({
    resolver: zodResolver(vendorInputSchema),
    defaultValues: {
      input: "",
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: (data: { input: string }) => apiRequest("POST", "/api/competitors/analyze", data),
    onSuccess: (analysis: VendorAnalysis) => {
      console.log("Analysis success:", analysis);
      setVendorAnalysis(analysis);
      setCurrentStep("review");
    },
    onError: (error) => {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze vendor input. Please try again.",
        variant: "destructive",
      });
      setCurrentStep("input");
    },
  });

  const addVendorMutation = useMutation({
    mutationFn: (data: { name: string; website: string; description: string }) => 
      apiRequest("POST", "/api/competitors", data),
    onSuccess: (response) => {
      setAddedVendorName(vendorAnalysis?.vendorName || "");
      setCurrentStep("success");
      
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/competitors'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      
      toast({
        title: "Vendor Added Successfully",
        description: `${vendorAnalysis?.vendorName} has been added to your competitor tracking.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Add Vendor",
        description: "Please check the analysis and try again.",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = (data: VendorInputForm) => {
    console.log("Starting analysis for:", data.input);
    setCurrentStep("analyzing");
    analyzeMutation.mutate({ input: data.input });
  };

  const handleConfirmAdd = () => {
    if (!vendorAnalysis) return;
    
    addVendorMutation.mutate({
      name: vendorAnalysis.vendorName,
      website: vendorAnalysis.website,
      description: vendorAnalysis.description,
    });
  };

  const handleClose = () => {
    if (!analyzeMutation.isPending && !addVendorMutation.isPending) {
      form.reset();
      setCurrentStep("input");
      setVendorAnalysis(null);
      setAddedVendorName("");
      onClose();
    }
  };

  const handleRefreshAndClose = () => {
    onSuccess();
    handleClose();
  };

  const handleBackToInput = () => {
    setCurrentStep("input");
    setVendorAnalysis(null);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return "High Confidence";
    if (confidence >= 0.6) return "Medium Confidence";
    return "Low Confidence";
  };

  if (!isOpen) return null;

  console.log("Current step:", currentStep, "Vendor analysis:", vendorAnalysis);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="add-vendor-modal">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            {currentStep === "input" && (
              <>
                <Brain className="w-5 h-5 text-blue-500" />
                AI-Powered Vendor Analysis
              </>
            )}
            {currentStep === "analyzing" && (
              <>
                <Brain className="w-5 h-5 text-blue-500 animate-pulse" />
                Analyzing Vendor...
              </>
            )}
            {currentStep === "review" && (
              <>
                <CheckCircle className="w-5 h-5 text-blue-500" />
                Review Analysis Results
              </>
            )}
            {currentStep === "success" && (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                Vendor Added Successfully
              </>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={analyzeMutation.isPending || addVendorMutation.isPending}
            data-testid="close-add-vendor-modal"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          {/* Input Step */}
          {currentStep === "input" && (
            <form onSubmit={form.handleSubmit(handleAnalyze)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="input">Enter Vendor Information</Label>
                  <Input
                    id="input"
                    placeholder="Company name, website URL, or description (e.g., 'Ambient AI', 'https://getfreed.ai', 'AI scribe for dermatology')"
                    {...form.register("input")}
                    disabled={analyzeMutation.isPending}
                    data-testid="vendor-input-field"
                    className="text-base"
                  />
                  {form.formState.errors.input && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.input.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                      AI will automatically analyze:
                    </h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Official vendor name and website</li>
                      <li>• Professional product description</li>
                      <li>• Review platform locations (Trustpilot, G2, Capterra)</li>
                      <li>• News feed sources and company blog</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={analyzeMutation.isPending}
                  className="flex-1"
                  data-testid="cancel-analyze"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={analyzeMutation.isPending}
                  className="flex-1"
                  data-testid="analyze-vendor"
                >
                  {analyzeMutation.isPending ? (
                    <>
                      <Brain className="w-4 h-4 mr-2 animate-pulse" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Analyze with AI
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Analyzing Step */}
          {currentStep === "analyzing" && (
            <div className="space-y-6 py-8">
              <div className="text-center">
                <Brain className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-pulse" />
                <h3 className="text-lg font-semibold mb-2">AI Analysis in Progress</h3>
                <p className="text-muted-foreground mb-4">
                  Analyzing vendor information and gathering data from multiple sources...
                </p>
                
                <div className="flex justify-center">
                  <div className="w-64 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full animate-pulse w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Review Step */}
          {currentStep === "review" && vendorAnalysis && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getConfidenceColor(vendorAnalysis.confidence)}>
                    {getConfidenceLabel(vendorAnalysis.confidence)} ({Math.round(vendorAnalysis.confidence * 100)}%)
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Vendor Name</Label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                    <p className="font-medium">{vendorAnalysis.vendorName}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Website</Label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                    <a 
                      href={vendorAnalysis.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <Globe className="w-4 h-4" />
                      {vendorAnalysis.website}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                    <p className="text-sm">{vendorAnalysis.description}</p>
                  </div>
                </div>

                {vendorAnalysis.reviewSources && vendorAnalysis.reviewSources.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Review Sources Found ({vendorAnalysis.reviewSources.length})
                    </Label>
                    <div className="space-y-2 mt-2">
                      {vendorAnalysis.reviewSources.map((source, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{source.platform}</Badge>
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              View Reviews <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <Badge variant="outline" className={getConfidenceColor(source.confidence)}>
                            {Math.round(source.confidence * 100)}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {vendorAnalysis.newsSources && vendorAnalysis.newsSources.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Rss className="w-4 h-4" />
                      News Sources Found ({vendorAnalysis.newsSources.length})
                    </Label>
                    <div className="space-y-2 mt-2">
                      {vendorAnalysis.newsSources.map((source, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{source.type}</Badge>
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              {source.name} <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                  <Label className="text-sm font-medium">AI Analysis Notes</Label>
                  <p className="text-sm text-muted-foreground mt-1">{vendorAnalysis.reasoning}</p>
                </div>
              </div>

              <Separator />

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleBackToInput}
                  disabled={addVendorMutation.isPending}
                  className="flex-1"
                  data-testid="back-to-input"
                >
                  Back to Edit
                </Button>
                <Button
                  onClick={handleConfirmAdd}
                  disabled={addVendorMutation.isPending}
                  className="flex-1"
                  data-testid="confirm-add-vendor"
                >
                  {addVendorMutation.isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Vendor
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Success Step */}
          {currentStep === "success" && (
            <div className="space-y-6">
              <div className="text-center py-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {addedVendorName} Added Successfully!
                </h3>
                <p className="text-muted-foreground mb-4">
                  The AI analysis has been used to add your new vendor. Run a data refresh to populate all navigation tabs with pricing, reviews, and news.
                </p>
                
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border mb-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    What refresh will populate:
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 text-left">
                    <li>• Pricing plans and features from website</li>
                    <li>• Customer reviews from discovered platforms</li>
                    <li>• Latest news and updates from feeds</li>
                    <li>• SEO metrics and domain analysis</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                  data-testid="close-success-modal"
                >
                  Close
                </Button>
                <Button
                  onClick={handleRefreshAndClose}
                  className="flex-1"
                  data-testid="refresh-and-close"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Start Refresh
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}