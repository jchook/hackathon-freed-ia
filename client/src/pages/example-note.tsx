import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FileText, Play, Pause, Upload, Download, Stethoscope, Clock, User, Share2, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import audioFile from "@assets/Visit to the family doctor_1754271038617.m4a";
import type { SharedExperience, Competitor } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

const TRANSCRIPT = `Hi, it's Doctor McClure. How are you doing today? Doing fine. Great. I know we're supposed to review your labs, but do you have any questions before we start? My ankle has been hurting. Did anything happen to it? I twisted it while running. It's been swollen and not getting much better. When did that happen? A week ago. Have you been able to walk on it since then? Yeah, just hurts. Have you been doing anything for your ankle? I tried some ice. Ibuprofen once kind of helps. Also, I wanted to ask about my current medications - I'm taking delgocitinib for my skin condition and ramipril for blood pressure. Are you able to do other exercises besides running so that you can still move your body even if you have an injury? It sounds like it can help. So I think that's a great first step. Let me just do that exam on your foot. Really glad that you've been doing exercise even when you're in pain. Doing other exercises besides running so that you can still move your body even if you have an injury. Does it hurt here? No. Does it hurt here? No. Does it hurt here? That hurts a little bit. I don't think you need an x-ray. I think you have an ankle sprain. Icing it is great. Ibuprofen can help reduce swelling. Continue your delgocitinib and ramipril as prescribed.`;

// Component to highlight medications in the transcript
const HighlightedTranscript = ({ text }: { text: string }) => {
  const medications = ['delgocitinib', 'ramipril'];
  
  let highlightedText = text;
  medications.forEach(med => {
    const regex = new RegExp(`\\b${med}\\b`, 'gi');
    highlightedText = highlightedText.replace(regex, `<span class="bg-green-200 dark:bg-green-800 px-1 rounded font-medium text-green-900 dark:text-green-100">${med}</span>`);
  });
  
  return <div dangerouslySetInnerHTML={{ __html: highlightedText }} className="leading-relaxed" />;
};

const VENDOR_OUTPUTS = {
  'heidi-1': {
    name: 'Heidi Health',
    soap: {
      subjective: `Patient reports ankle pain lasting one week following a running injury. States ankle is swollen and "not getting much better." Pain persists with walking but patient able to ambulate. Has tried ice and ibuprofen with some relief. Reports ibuprofen "kind of helps." Patient continues other exercises besides running.`,
      objective: `Physical examination of ankle performed. Point tenderness elicited on palpation at one specific location. No tenderness noted at two other examination points. Patient ambulating without significant distress.`,
      assessment: `Ankle sprain (likely grade 1-2 based on presentation and examination findings). No indication for radiographic imaging at this time.`,
      plan: `Continue current management with ice and ibuprofen for anti-inflammatory effect and pain control. Patient education provided regarding continued non-impact exercise. Follow-up as needed if symptoms worsen or fail to improve.`
    }
  },
  'freed-1': {
    name: 'Freed AI',
    soap: {
      subjective: `The patient presents with a chief complaint of ankle pain. The pain began approximately one week ago after the patient twisted their ankle while running. The patient describes the ankle as swollen and reports that it has not been improving significantly. The patient is able to walk on the affected ankle, though it causes discomfort. For pain management, the patient has been using ice and has taken ibuprofen, which provides some relief. The patient continues to engage in other forms of exercise aside from running.`,
      objective: `Physical examination of the ankle was performed. The provider conducted a focused examination with palpation at multiple points. The patient denied pain at two specific examination sites but reported pain at a third location. The patient appeared to be ambulating without severe distress.`,
      assessment: `Based on the history and physical examination findings, the patient appears to have sustained an ankle sprain. The mechanism of injury (twisting while running), timeline (one week), and examination findings are consistent with this diagnosis. No fracture is suspected based on clinical presentation, and imaging is not indicated at this time.`,
      plan: `Recommended continued conservative management including ice therapy and ibuprofen for anti-inflammatory effects. Patient counseled on the benefits of maintaining physical activity with modifications (avoiding running temporarily while continuing other exercises). Patient advised to follow up if symptoms worsen or do not improve with conservative measures.`
    }
  },
  'sunoh-1': {
    name: 'Sunoh AI',
    soap: {
      subjective: `Patient reports onset of ankle pain 1 week ago following injury sustained while running. Describes mechanism as twisting motion. Associated symptoms include swelling without significant improvement over the past week. Patient rates pain as tolerable, allowing continued ambulation. Current self-treatment includes intermittent ice application and ibuprofen with partial symptomatic relief. Patient maintains active lifestyle with modification to avoid aggravating activities.`,
      objective: `Focused musculoskeletal examination of affected ankle performed. Palpation reveals point tenderness at one anatomical location with absence of tenderness at adjacent areas tested. Patient demonstrates functional mobility without apparent severe limitation. Swelling noted as reported by patient history.`,
      assessment: `Clinical presentation consistent with ankle sprain injury. History of twisting mechanism during athletic activity with subsequent pain and swelling supports this diagnosis. Physical examination findings of localized tenderness without widespread involvement suggests mild to moderate sprain. No red flags present requiring immediate advanced imaging.`,
      plan: `Continue current conservative treatment regimen with ice therapy and NSAIDs (ibuprofen) for inflammation control and analgesia. Encourage activity modification with continuation of non-impact exercises as tolerated. Patient education provided regarding expected healing timeline. Return visit warranted if symptoms persist beyond expected timeframe or worsen despite appropriate treatment.`
    }
  }
};

export default function ExampleNote() {
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [compareVendor, setCompareVendor] = useState<string>('');
  const [customNote, setCustomNote] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });
  const [clinicianData, setClinicianData] = useState({
    name: '',
    specialty: '',
    transcriptionDuration: 0,
    notes: ''
  });
  const [activeTab, setActiveTab] = useState('compare');
  const [isPlaying, setIsPlaying] = useState(false);
  const [soapSectionsExpanded, setSoapSectionsExpanded] = useState({
    subjective: true,
    objective: true,
    assessment: true,
    plan: true
  });
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  // Fetch competitors for the vendor selector
  const { data: competitors = [] } = useQuery<Competitor[]>({
    queryKey: ['/api/competitors'],
  });

  // Mutation for submitting shared experience
  const shareExperience = useMutation({
    mutationFn: async (experienceData: any) => {
      return apiRequest('/api/shared-experiences', {
        method: 'POST',
        body: JSON.stringify(experienceData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your experience has been shared with the community",
      });
      // Reset form
      setCustomNote({ subjective: '', objective: '', assessment: '', plan: '' });
      setClinicianData({ name: '', specialty: '', transcriptionDuration: 0, notes: '' });
      setSelectedVendor('');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to share experience. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSectionChange = (section: keyof typeof customNote, value: string) => {
    setCustomNote(prev => ({ ...prev, [section]: value }));
  };

  const handleClinicianDataChange = (field: keyof typeof clinicianData, value: string | number) => {
    setClinicianData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSubmitExperience = () => {
    if (!selectedVendor) {
      toast({
        title: "Error",
        description: "Please select a vendor first",
        variant: "destructive",
      });
      return;
    }

    if (!customNote.subjective || !customNote.objective || !customNote.assessment || !customNote.plan) {
      toast({
        title: "Error", 
        description: "Please fill in all SOAP note sections",
        variant: "destructive",
      });
      return;
    }

    const experienceData = {
      competitorId: selectedVendor,
      transcriptId: "family-doctor-visit-1",
      clinicianName: clinicianData.name || "Anonymous",
      clinicianSpecialty: clinicianData.specialty || "General Practice",
      subjective: customNote.subjective,
      objective: customNote.objective,
      assessment: customNote.assessment,
      plan: customNote.plan,
      transcriptionDuration: clinicianData.transcriptionDuration || null,
      notes: clinicianData.notes || null,
      isPublic: true
    };

    shareExperience.mutate(experienceData);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  // Fetch latest shared experience for compare vendor
  const { data: sharedExperience, isLoading: isLoadingExperience } = useQuery({
    queryKey: ['/api/competitors', compareVendor, 'latest-shared-experience'],
    enabled: !!compareVendor,
  });

  const toggleSoapSection = (section: keyof typeof soapSectionsExpanded) => {
    setSoapSectionsExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleDownloadNote = () => {
    const currentNote = activeTab === 'compare' ? VENDOR_OUTPUTS[selectedVendor as keyof typeof VENDOR_OUTPUTS] : {
      name: 'Custom Note',
      soap: customNote
    };
    
    const noteContent = `SOAP Note - ${currentNote.name}
    
SUBJECTIVE:
${currentNote.soap.subjective}

OBJECTIVE:
${currentNote.soap.objective}

ASSESSMENT:
${currentNote.soap.assessment}

PLAN:
${currentNote.soap.plan}

Generated on: ${new Date().toLocaleDateString()}
Source: ScribeArena Example Note Tool`;

    const blob = new Blob([noteContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soap-note-${currentNote.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: "Note Downloaded",
      description: "SOAP note has been downloaded successfully."
    });
  };

  return (
    <div className="flex h-screen bg-dashboard-bg" data-testid="example-note-container">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header />
        
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Example Note Generator</h1>
            <p className="text-muted-foreground mt-2">
              Test how different AI scribes handle the same patient visit and generate SOAP notes
            </p>
          </div>



          {/* Audio and Transcript Section */}
          <Card data-testid="transcript-section">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Golden Visit - Ankle Sprain
              </CardTitle>
              <CardDescription>
                This standardized patient visit allows you to compare how different AI scribes process the same clinical encounter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <audio 
                  ref={audioRef} 
                  src={audioFile} 
                  onEnded={handleAudioEnded}
                  preload="metadata"
                />
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2" 
                  onClick={handlePlayPause}
                  data-testid="play-audio"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'Pause Recording' : 'Play Audio Recording'}
                </Button>
                <Badge variant="secondary">Family Medicine Visit</Badge>
                <Badge variant="outline">Duration: 3:45</Badge>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Visit Transcript:</h4>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-sm">
                  <HighlightedTranscript text={TRANSCRIPT} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SOAP Note Comparison */}
          <Card data-testid="soap-comparison">
            <CardHeader>
              <CardTitle>SOAP Note Comparison</CardTitle>
              <CardDescription>
                Compare AI-generated clinical documentation from different scribe vendors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="compare">Compare Vendors</TabsTrigger>
                  <TabsTrigger value="custom">Share Experience</TabsTrigger>
                </TabsList>
                
                <TabsContent value="compare" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Label htmlFor="compare-vendor-select" className="text-sm font-medium">
                        Select Vendor:
                      </Label>
                      <Select value={compareVendor} onValueChange={setCompareVendor} data-testid="compare-vendor-select">
                        <SelectTrigger className="w-48" id="compare-vendor-select">
                          <SelectValue placeholder="Choose vendor to compare..." />
                        </SelectTrigger>
                        <SelectContent>
                          {competitors.map((competitor) => (
                            <SelectItem key={competitor.id} value={competitor.id}>
                              {competitor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {compareVendor && (
                      <Button onClick={handleDownloadNote} className="flex items-center gap-2" data-testid="download-note">
                        <Download className="w-4 h-4" />
                        Download Note
                      </Button>
                    )}
                  </div>

                  {!compareVendor ? (
                    <div className="text-center py-12">
                      <div className="max-w-md mx-auto">
                        <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Select a Vendor Above</h3>
                        <p className="text-muted-foreground text-sm">
                          Choose an AI scribe vendor to view the latest shared experience and compare outputs.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Latest Shared Experience */}
                      {sharedExperience && (
                        <Card data-testid="latest-shared-experience">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-lg">Latest Shared Experience</CardTitle>
                                <CardDescription className="flex items-center gap-4 mt-1">
                                  <span className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    {sharedExperience.clinicianName || 'Anonymous'}
                                  </span>
                                  <Badge variant="outline">{sharedExperience.clinicianSpecialty || 'General Practice'}</Badge>
                                  {sharedExperience.transcriptionDuration && (
                                    <span className="flex items-center gap-1 text-xs">
                                      <Clock className="w-3 h-3" />
                                      {formatDuration(sharedExperience.transcriptionDuration)} generation time
                                    </span>
                                  )}
                                </CardDescription>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(sharedExperience.createdAt!).toLocaleDateString()}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Subjective Section */}
                            <Collapsible open={soapSectionsExpanded.subjective} onOpenChange={() => toggleSoapSection('subjective')}>
                              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                                <span className="font-medium">Subjective</span>
                                {soapSectionsExpanded.subjective ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </CollapsibleTrigger>
                              <CollapsibleContent className="mt-2">
                                <div className="p-3 bg-background border rounded-lg">
                                  <p className="text-sm leading-relaxed">{sharedExperience.subjective}</p>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>

                            {/* Objective Section */}
                            <Collapsible open={soapSectionsExpanded.objective} onOpenChange={() => toggleSoapSection('objective')}>
                              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                                <span className="font-medium">Objective</span>
                                {soapSectionsExpanded.objective ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </CollapsibleTrigger>
                              <CollapsibleContent className="mt-2">
                                <div className="p-3 bg-background border rounded-lg">
                                  <p className="text-sm leading-relaxed">{sharedExperience.objective}</p>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>

                            {/* Assessment Section */}
                            <Collapsible open={soapSectionsExpanded.assessment} onOpenChange={() => toggleSoapSection('assessment')}>
                              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                                <span className="font-medium">Assessment</span>
                                {soapSectionsExpanded.assessment ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </CollapsibleTrigger>
                              <CollapsibleContent className="mt-2">
                                <div className="p-3 bg-background border rounded-lg">
                                  <p className="text-sm leading-relaxed">{sharedExperience.assessment}</p>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>

                            {/* Plan Section */}
                            <Collapsible open={soapSectionsExpanded.plan} onOpenChange={() => toggleSoapSection('plan')}>
                              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                                <span className="font-medium">Plan</span>
                                {soapSectionsExpanded.plan ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </CollapsibleTrigger>
                              <CollapsibleContent className="mt-2">
                                <div className="p-3 bg-background border rounded-lg">
                                  <p className="text-sm leading-relaxed">{sharedExperience.plan}</p>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>

                            {/* Additional Comments */}
                            {sharedExperience.notes && (
                              <div className="pt-4 border-t">
                                <h4 className="font-medium text-sm mb-2">Additional Comments</h4>
                                <p className="text-sm text-muted-foreground italic">"{sharedExperience.notes}"</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )}

                      {isLoadingExperience && (
                        <Card>
                          <CardContent className="p-8 text-center">
                            <div className="text-sm text-muted-foreground">Loading shared experience...</div>
                          </CardContent>
                        </Card>
                      )}

                      {!isLoadingExperience && !sharedExperience && (
                        <Card>
                          <CardContent className="p-8 text-center">
                            <div className="text-sm text-muted-foreground">No shared experiences found for this vendor yet.</div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="custom" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Share Your Clinical Experience</h3>
                    <Button onClick={handleDownloadNote} className="flex items-center gap-2" data-testid="download-custom-note">
                      <Download className="w-4 h-4" />
                      Download Your Note
                    </Button>
                  </div>

                  {/* Section 1: EHR Scribe Vendor Selection */}
                  <Card data-testid="vendor-selection">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        EHR Scribe Vendor Selection
                      </CardTitle>
                      <CardDescription>
                        Choose which AI scribe vendor you'd like to test with this patient visit
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="vendor-select">AI Scribe Vendor *</Label>
                          <Select value={selectedVendor} onValueChange={setSelectedVendor} data-testid="vendor-select">
                            <SelectTrigger id="vendor-select">
                              <SelectValue placeholder="Select a vendor to test..." />
                            </SelectTrigger>
                            <SelectContent>
                              {competitors.map((competitor) => (
                                <SelectItem key={competitor.id} value={competitor.id}>
                                  {competitor.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="clinician-name">Your Name (Optional)</Label>
                          <Input 
                            id="clinician-name"
                            placeholder="Dr. Smith"
                            value={clinicianData.name}
                            onChange={(e) => handleClinicianDataChange('name', e.target.value)}
                            data-testid="input-clinician-name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="specialty">Specialty (Optional)</Label>
                          <Input 
                            id="specialty"
                            placeholder="Internal Medicine"
                            value={clinicianData.specialty}
                            onChange={(e) => handleClinicianDataChange('specialty', e.target.value)}
                            data-testid="input-specialty"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section 2: SOAP Note Fields */}
                  <Card data-testid="soap-note-fields">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        SOAP Note Documentation
                      </CardTitle>
                      <CardDescription>
                        Document your clinical assessment using the SOAP format
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        <div>
                          <Label htmlFor="subjective" className="text-sm font-medium">
                            Subjective *
                          </Label>
                          <Textarea
                            id="subjective"
                            placeholder="Patient's chief complaint, history of present illness, review of systems..."
                            value={customNote.subjective}
                            onChange={(e) => handleSectionChange('subjective', e.target.value)}
                            className="min-h-[100px] mt-2"
                            data-testid="input-subjective"
                          />
                        </div>

                        <div>
                          <Label htmlFor="objective" className="text-sm font-medium">
                            Objective *
                          </Label>
                          <Textarea
                            id="objective"
                            placeholder="Physical examination findings, vital signs, diagnostic test results..."
                            value={customNote.objective}
                            onChange={(e) => handleSectionChange('objective', e.target.value)}
                            className="min-h-[100px] mt-2"
                            data-testid="input-objective"
                          />
                        </div>

                        <div>
                          <Label htmlFor="assessment" className="text-sm font-medium">
                            Assessment *
                          </Label>
                          <Textarea
                            id="assessment"
                            placeholder="Clinical diagnosis, differential diagnosis, clinical reasoning..."
                            value={customNote.assessment}
                            onChange={(e) => handleSectionChange('assessment', e.target.value)}
                            className="min-h-[100px] mt-2"
                            data-testid="input-assessment"
                          />
                        </div>

                        <div>
                          <Label htmlFor="plan" className="text-sm font-medium">
                            Plan *
                          </Label>
                          <Textarea
                            id="plan"
                            placeholder="Treatment plan, medications, follow-up instructions, patient education..."
                            value={customNote.plan}
                            onChange={(e) => handleSectionChange('plan', e.target.value)}
                            className="min-h-[100px] mt-2"
                            data-testid="input-plan"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section 3: Generation Feedback */}
                  <Card data-testid="generation-feedback">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Generation Feedback
                      </CardTitle>
                      <CardDescription>
                        Share your experience with the AI scribe generation process
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        <div>
                          <Label htmlFor="duration" className="text-sm font-medium">
                            Estimated Generation Time (seconds)
                          </Label>
                          <Input 
                            id="duration"
                            type="number"
                            placeholder="e.g., 45"
                            value={clinicianData.transcriptionDuration}
                            onChange={(e) => handleClinicianDataChange('transcriptionDuration', parseInt(e.target.value) || 0)}
                            className="mt-2 max-w-xs"
                            data-testid="input-duration"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            How long did it take for the AI to generate the note?
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="notes" className="text-sm font-medium">
                            Additional Comments (Optional)
                          </Label>
                          <Textarea
                            id="notes"
                            placeholder="Share your thoughts on accuracy, ease of use, formatting quality, areas for improvement..."
                            value={clinicianData.notes}
                            onChange={(e) => handleClinicianDataChange('notes', e.target.value)}
                            className="min-h-[80px] mt-2"
                            data-testid="input-notes"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Submit Experience Section */}
          {activeTab === 'custom' && (
            <Card data-testid="submit-experience">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">Share Your Clinical Experience</h3>
                    <p className="text-sm text-muted-foreground">
                      Help the medical community by sharing your SOAP note for this standardized visit
                    </p>
                  </div>
                  <Button 
                    onClick={handleSubmitExperience}
                    disabled={!selectedVendor || shareExperience.isPending}
                    className="flex items-center gap-2"
                    data-testid="button-submit-experience"
                  >
                    {shareExperience.isPending ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        Share Experience
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Usage Instructions */}
          <Card data-testid="usage-instructions">
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Compare AI Scribes
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Select different vendors to see their SOAP note outputs</li>
                    <li>• Compare clinical documentation quality and structure</li>
                    <li>• Evaluate how each AI handles the same patient encounter</li>
                    <li>• Download notes for detailed analysis</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Share Your Experience
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Document your own clinical approach with the provided transcript</li>
                    <li>• Use section-by-section editor for structured SOAP documentation</li>
                    <li>• Compare your clinical reasoning with AI-generated versions</li>
                    <li>• Share your expertise and download notes for reference</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}