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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus, RefreshCw, Globe, CheckCircle } from "lucide-react";

const addVendorSchema = z.object({
  name: z.string().min(2, "Vendor name must be at least 2 characters"),
  website: z.string().url("Please enter a valid website URL"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type AddVendorForm = z.infer<typeof addVendorSchema>;

interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddVendorModal({ isOpen, onClose, onSuccess }: AddVendorModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showSuccessStep, setShowSuccessStep] = useState(false);
  const [addedVendorName, setAddedVendorName] = useState("");

  const form = useForm<AddVendorForm>({
    resolver: zodResolver(addVendorSchema),
    defaultValues: {
      name: "",
      website: "",
      description: "",
    },
  });

  const addVendorMutation = useMutation({
    mutationFn: (data: AddVendorForm) => apiRequest("POST", "/api/competitors", data),
    onSuccess: (response) => {
      setAddedVendorName(form.getValues("name"));
      setShowSuccessStep(true);
      
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/competitors'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      
      toast({
        title: "Vendor Added Successfully",
        description: `${form.getValues("name")} has been added to your competitor tracking.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Add Vendor",
        description: "Please check your input and try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: AddVendorForm) => {
    addVendorMutation.mutate(data);
  };

  const handleClose = () => {
    if (!addVendorMutation.isPending) {
      form.reset();
      setShowSuccessStep(false);
      setAddedVendorName("");
      onClose();
    }
  };

  const handleRefreshAndClose = () => {
    onSuccess();
    handleClose();
  };

  const extractDomainName = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="add-vendor-modal">
      <Card className="w-full max-w-lg mx-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            {showSuccessStep ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                Vendor Added Successfully
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Add New AI Scribe Vendor
              </>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={addVendorMutation.isPending}
            data-testid="close-add-vendor-modal"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          {showSuccessStep ? (
            <div className="space-y-6">
              <div className="text-center py-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {addedVendorName} Added Successfully!
                </h3>
                <p className="text-muted-foreground mb-4">
                  Your new vendor has been added to the platform. To get the most up-to-date information, we recommend running a data refresh.
                </p>
                
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border mb-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    What happens during refresh:
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 text-left">
                    <li>• Fetch pricing plans and features</li>
                    <li>• Collect customer reviews and ratings</li>
                    <li>• Gather latest news and updates</li>
                    <li>• Update SEO and domain metrics</li>
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
          ) : (
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Vendor Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Ambient AI, DocTalk, MedScribe"
                    {...form.register("name")}
                    disabled={addVendorMutation.isPending}
                    data-testid="vendor-name-input"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="website">Website URL *</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="website"
                      placeholder="https://example.com"
                      className="pl-10"
                      {...form.register("website")}
                      disabled={addVendorMutation.isPending}
                      data-testid="vendor-website-input"
                    />
                  </div>
                  {form.formState.errors.website && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.website.message}
                    </p>
                  )}
                  {form.watch("website") && !form.formState.errors.website && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        Domain: {extractDomainName(form.watch("website"))}
                      </Badge>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the AI scribe product and its key features..."
                    rows={3}
                    {...form.register("description")}
                    disabled={addVendorMutation.isPending}
                    data-testid="vendor-description-input"
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> After adding the vendor, initial data will be minimal. 
                  Run a data refresh to populate pricing, reviews, and other information.
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={addVendorMutation.isPending}
                  className="flex-1"
                  data-testid="cancel-add-vendor"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={addVendorMutation.isPending}
                  className="flex-1"
                  data-testid="submit-add-vendor"
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
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}