import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Play, Pause, Upload, Download, Stethoscope, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import audioFile from "@assets/Visit to the family doctor_1754271038617.m4a";
import type { SharedExperience } from "@shared/schema";

const TRANSCRIPT = `Hi, it's Doctor McClure. How are you doing today? Doing fine. Great. I know we're supposed to review your labs, but do you have any questions before we start? My ankle has been hurting. Did anything happen to it? I twisted it while running. It's been swollen and not getting much better. When did that happen? A week ago. Have you been able to walk on it since then? Yeah, just hurts. Have you been doing anything for your ankle? I tried some ice. Ibuprofen once kind of helps. Are you able to do other exercises besides running so that you can still move your body even if you have an injury? It sounds like it can help. So I think that's a great first step. Let me just do that exam on your foot. Really glad that you've been doing exercise even when you're in pain. Doing other exercises besides running so that you can still move your body even if you have an injury. Does it hurt here? No. Does it hurt here? No. Does it hurt here? That hurts a little bit. I don't think you need an x-ray. I think you have an ankle sprain. Icing it is great. Ibuprofen can help reduce swelling.`;

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
  const [selectedVendor, setSelectedVendor] = useState<string>('heidi-1');
  const [customNote, setCustomNote] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });
  const [activeTab, setActiveTab] = useState('compare');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const handleSectionChange = (section: keyof typeof customNote, value: string) => {
    setCustomNote(prev => ({ ...prev, [section]: value }));
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

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  // Fetch latest shared experience for selected vendor
  const { data: sharedExperience, isLoading: isLoadingExperience } = useQuery({
    queryKey: ['/api/competitors', selectedVendor, 'latest-shared-experience'],
    enabled: !!selectedVendor,
  });

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
                  <p className="leading-relaxed">{TRANSCRIPT}</p>
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
                      <label htmlFor="vendor-select" className="text-sm font-medium">
                        Select AI Scribe Vendor:
                      </label>
                      <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                        <SelectTrigger className="w-48" data-testid="vendor-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="heidi-1">Heidi Health</SelectItem>
                          <SelectItem value="freed-1">Freed AI</SelectItem>
                          <SelectItem value="sunoh-1">Sunoh AI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleDownloadNote} className="flex items-center gap-2" data-testid="download-note">
                      <Download className="w-4 h-4" />
                      Download Note
                    </Button>
                  </div>

                  {/* Latest Shared Experience Display */}
                  {selectedVendor && sharedExperience && (
                    <Card className="mt-4 border-blue-200 bg-blue-50/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium text-blue-900">Latest Shared Experience</CardTitle>
                          <div className="flex items-center gap-2 text-xs text-blue-700">
                            <Clock className="w-3 h-3" />
                            <span>Transcription: {formatDuration(sharedExperience.transcriptionDuration || 0)}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">{sharedExperience.clinicianName}</span>
                          <Badge variant="outline" className="text-xs">{sharedExperience.clinicianSpecialty}</Badge>
                        </div>
                        {sharedExperience.notes && (
                          <p className="text-sm text-blue-800 italic">"{sharedExperience.notes}"</p>
                        )}
                        <div className="text-xs text-blue-600 mt-2">
                          Shared {new Date(sharedExperience.createdAt!).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {selectedVendor && isLoadingExperience && (
                    <Card className="mt-4 border-gray-200">
                      <CardContent className="p-4">
                        <div className="text-sm text-gray-500">Loading shared experience...</div>
                      </CardContent>
                    </Card>
                  )}

                  {selectedVendor && (
                    <div className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Subjective</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm leading-relaxed">
                              {VENDOR_OUTPUTS[selectedVendor as keyof typeof VENDOR_OUTPUTS].soap.subjective}
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Objective</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm leading-relaxed">
                              {VENDOR_OUTPUTS[selectedVendor as keyof typeof VENDOR_OUTPUTS].soap.objective}
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Assessment</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm leading-relaxed">
                              {VENDOR_OUTPUTS[selectedVendor as keyof typeof VENDOR_OUTPUTS].soap.assessment}
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Plan</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm leading-relaxed">
                              {VENDOR_OUTPUTS[selectedVendor as keyof typeof VENDOR_OUTPUTS].soap.plan}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="custom" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Share Your Clinical Experience</h3>
                    <Button onClick={handleDownloadNote} className="flex items-center gap-2" data-testid="download-custom-note">
                      <Download className="w-4 h-4" />
                      Download Your Note
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <label htmlFor="subjective" className="block text-sm font-medium mb-2">
                        Subjective
                      </label>
                      <Textarea
                        id="subjective"
                        placeholder="Enter patient's subjective information..."
                        value={customNote.subjective}
                        onChange={(e) => handleSectionChange('subjective', e.target.value)}
                        className="min-h-[100px]"
                        data-testid="input-subjective"
                      />
                    </div>

                    <div>
                      <label htmlFor="objective" className="block text-sm font-medium mb-2">
                        Objective
                      </label>
                      <Textarea
                        id="objective"
                        placeholder="Enter objective findings..."
                        value={customNote.objective}
                        onChange={(e) => handleSectionChange('objective', e.target.value)}
                        className="min-h-[100px]"
                        data-testid="input-objective"
                      />
                    </div>

                    <div>
                      <label htmlFor="assessment" className="block text-sm font-medium mb-2">
                        Assessment
                      </label>
                      <Textarea
                        id="assessment"
                        placeholder="Enter clinical assessment..."
                        value={customNote.assessment}
                        onChange={(e) => handleSectionChange('assessment', e.target.value)}
                        className="min-h-[100px]"
                        data-testid="input-assessment"
                      />
                    </div>

                    <div>
                      <label htmlFor="plan" className="block text-sm font-medium mb-2">
                        Plan
                      </label>
                      <Textarea
                        id="plan"
                        placeholder="Enter treatment plan..."
                        value={customNote.plan}
                        onChange={(e) => handleSectionChange('plan', e.target.value)}
                        className="min-h-[100px]"
                        data-testid="input-plan"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

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