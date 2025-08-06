import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FileText, Play, Pause, Stethoscope, Clock, User, ChevronDown, ChevronUp } from "lucide-react";
import { Label } from "@/components/ui/label";
import audioFile from "@assets/Visit to the family doctor_1754271038617.m4a";
import type { Competitor, SharedExperience } from "@shared/schema";

const TRANSCRIPT = `Hi, it's Doctor McClure. How are you doing today? Doing fine. Great. I know we're supposed to review your labs, but do you have any questions before we start? My ankle has been hurting. Did anything happen to it? I twisted it while running. It's been swollen and not getting much better. When did that happen? A week ago. Have you been able to walk on it since then? Yeah, just hurts. Have you been doing anything for your ankle? I tried some ice. Ibuprofen once kind of helps. Also, I wanted to ask about my current medications - I'm taking delgocitinib for my skin condition and ramipril for blood pressure. Are you able to do other exercises besides running so that you can still move your body even if you have an injury? It sounds like it can help. So I think that's a great first step. Let me just do that exam on your foot. Really glad that you've been doing exercise even when you're in pain. Doing other exercises besides running so that you can still move your body even if you have an injury. Does it hurt here? No. Does it hurt here? No. Does it hurt here? That hurts a little bit. I don't think you need an x-ray. I think you have an ankle sprain. Icing it is great. Ibuprofen can help reduce swelling. Continue your delgocitinib and ramipril as prescribed.`;

// Component to highlight medications in text
const HighlightedText = ({ text }: { text: string }) => {
  const medications = ['delgocitinib', 'ramipril', 'ibuprofen'];
  
  let highlightedText = text;
  medications.forEach(med => {
    const regex = new RegExp(`\\b${med}\\b`, 'gi');
    highlightedText = highlightedText.replace(regex, `<span class="bg-green-200 dark:bg-green-800 px-1 rounded font-medium text-green-900 dark:text-green-100">${med}</span>`);
  });
  
  // Convert line breaks to HTML br tags to preserve formatting
  highlightedText = highlightedText.replace(/\n/g, '<br>');
  
  return <div dangerouslySetInnerHTML={{ __html: highlightedText }} className="leading-relaxed whitespace-pre-wrap" />;
};

const VENDOR_OUTPUTS = {
  'heidi-1': {
    name: 'Heidi Health',
    soap: {
      subjective: `Reports right ankle pain.

Pain started a week ago after twisting the ankle while running. Swelling present and not improving. Able to walk but painful.

Tried ice and ibuprofen, which provided some relief. Not wrapping or supporting the ankle.

Stepped on a rock on a trail and twisted ankle to the right (supination).

Similar, less severe episodes in the past.

Not running since injury, but performing other exercises.

Reports feeling tired. Noted increased thirst and frequent urination.

Past Medical History:
- Family history of diabetes.`,
      objective: `Foot and ankle examination: Tenderness noted. No pain in areas suggesting need for X-ray.

Investigations with results: Haemoglobin A1c (HbA1c) reported as high.`,
      assessment: `1. Right ankle sprain
2. Elevated blood sugar / Diabetes - Type 2 Diabetes Mellitus
3. Other conditions requiring follow-up`,
      plan: `1. Right ankle sprain
- Icing, ibuprofen, and Tylenol for pain.
- Elevating the ankle.
- Provide ankle wrap for stability.

2. Elevated blood sugar / Diabetes
- Assessment: Type 2 Diabetes Mellitus.
- Investigations planned: Blood test for current blood sugar level (finger prick). Labs ordered to check cholesterol, electrolytes, and blood work.
- Treatment planned: Reduce sugar-sweetened beverages. Counselling provided regarding dietary changes, specifically reducing carbohydrates and sugary drinks. Encouraged switching to water or sparkling water.
- Relevant referrals: Referral to an eye doctor for eye examination.
- Follow-up: Follow-up visit for diabetes education within 2-3 weeks. Follow-up in about a month to discuss progress with dietary changes.

3. Other
- Foot test to be performed today.`
    }
  },
  'freed-1': {
    name: 'Freed AI',
    soap: {
      subjective: `Chief Complaint
Ankle pain and swelling for 1 week after twisting it while running

History of Present Illness
The patient presents for a follow-up visit to review labs and reports a new complaint of ankle pain. The patient twisted their ankle while running one week ago, resulting in swelling and persistent pain.

The patient describes the ankle as swollen and not improving significantly since the injury occurred. They have been able to walk on the affected ankle, but it continues to cause discomfort. The patient has attempted self-treatment with ice application and has taken ibuprofen once, which provided some relief. The ankle pain is impacting their ability to run, but they express interest in exploring alternative exercises to maintain physical activity while managing the injury.

The patient is currently taking delgocitinib for an unspecified skin condition and ramipril for blood pressure management. They inquire about these current medications, suggesting adherence to their prescribed regimen.

Medical History
- Hypertension, controlled with medication
- Skin condition requiring treatment
- Ankle sprain, occurred one week ago

Medications and Supplements
- Delgocitinib
  - For skin condition
- Ramipril
  - For blood pressure
- Ibuprofen
  - Taken once for ankle pain
  - Helps with pain

Social History
- Exercise: Patient engages in running

Review of Systems
Musculoskeletal: Positive for ankle pain and swelling.`,
      objective: `Physical examination of the ankle was performed. The provider conducted a focused examination with palpation at multiple points. The patient denied pain at two specific examination sites but reported pain at a third location. The patient appeared to be ambulating without severe distress.`,
      assessment: `Based on the history and physical examination findings, the patient appears to have sustained an ankle sprain. The mechanism of injury (twisting while running), timeline (one week), and examination findings are consistent with this diagnosis. No fracture is suspected based on clinical presentation, and imaging is not indicated at this time.`,
      plan: `Recommended continued conservative management including ice therapy and ibuprofen for anti-inflammatory effects. Patient counseled on the benefits of maintaining physical activity with modifications (avoiding running temporarily while continuing other exercises). Continue current medications: ramipril for hypertension management and delgocitinib for dermatologic treatment as previously prescribed. Patient advised to follow up if symptoms worsen or do not improve with conservative measures.`
    }
  },
  'sunoh-1': {
    name: 'Sunoh AI',
    soap: {
      subjective: `Patient reports onset of ankle pain 1 week ago following injury sustained while running. Describes mechanism as twisting motion. Associated symptoms include swelling without significant improvement over the past week. Patient rates pain as tolerable, allowing continued ambulation. Current self-treatment includes intermittent ice application and ibuprofen with partial symptomatic relief. Patient maintains active lifestyle with modification to avoid aggravating activities. Medication history includes delgocitinib for skin condition and ramipril for hypertension.`,
      objective: `Focused musculoskeletal examination of affected ankle performed. Palpation reveals point tenderness at one anatomical location with absence of tenderness at adjacent areas tested. Patient demonstrates functional mobility without apparent severe limitation. Swelling noted as reported by patient history.`,
      assessment: `Clinical presentation consistent with ankle sprain injury. History of twisting mechanism during athletic activity with subsequent pain and swelling supports this diagnosis. Physical examination findings of localized tenderness without widespread involvement suggests mild to moderate sprain. No red flags present requiring immediate advanced imaging.`,
      plan: `Continue current conservative treatment regimen with ice therapy and NSAIDs (ibuprofen) for inflammation control and analgesia. Encourage activity modification with continuation of non-impact exercises as tolerated. Maintain current medication regimen including ramipril for blood pressure control and delgocitinib for dermatologic management. Patient education provided regarding expected healing timeline. Return visit warranted if symptoms persist beyond expected timeframe or worsen despite appropriate treatment.`
    }
  }
};

export default function ExampleNote() {
  const [compareVendor, setCompareVendor] = useState<string>('freed-1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [soapSectionsExpanded, setSoapSectionsExpanded] = useState({
    subjective: true,
    objective: true,
    assessment: true,
    plan: true
  });
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch competitors for the vendor selector
  const { data: competitors = [] } = useQuery<Competitor[]>({
    queryKey: ['/api/competitors'],
  });

  // Fetch latest shared experience for compare vendor
  const { data: sharedExperience, isLoading: isLoadingExperience } = useQuery<SharedExperience>({
    queryKey: ['/api/competitors', compareVendor, 'latest-shared-experience'],
    enabled: !!compareVendor,
  });

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

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
                  <HighlightedText text={TRANSCRIPT} />
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
              <div className="space-y-4">
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
                    {/* Freed AI Video Demo */}
                    {compareVendor === 'freed-1' && (
                      <Card data-testid="freed-video-demo">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Play className="w-5 h-5" />
                            Freed AI Demo Video
                          </CardTitle>
                          <CardDescription>
                            Watch how Freed AI processes clinical encounters in real-time
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                            <iframe
                              width="100%"
                              height="100%"
                              src="https://www.youtube.com/embed/ueSwbb7we44"
                              title="Freed AI Demo - Real-time Medical Scribe"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              className="w-full h-full"
                              data-testid="freed-demo-video"
                            />
                          </div>
                          <div className="mt-3 text-sm text-muted-foreground">
                            See Freed AI in action with real clinical documentation workflows
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Example Note */}
                    {sharedExperience && (
                      <Card data-testid="example-note">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">Example Note</CardTitle>
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
                                <HighlightedText text={sharedExperience.subjective} />
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
                                <HighlightedText text={sharedExperience.objective} />
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
                                <HighlightedText text={sharedExperience.assessment} />
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
                                <HighlightedText text={sharedExperience.plan} />
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
                      <div className="space-y-4">
                        <Card>
                          <CardContent className="p-8 text-center">
                            <div className="text-sm text-muted-foreground mb-4">No shared experiences found for this vendor yet.</div>
                            <div className="text-sm text-muted-foreground">Showing sample AI-generated SOAP note below:</div>
                          </CardContent>
                        </Card>
                        
                        {/* Sample Vendor Output */}
                        {VENDOR_OUTPUTS[compareVendor as keyof typeof VENDOR_OUTPUTS] && (
                          <Card data-testid="sample-vendor-output">
                            <CardHeader>
                              <CardTitle className="text-lg">Sample AI-Generated SOAP Note</CardTitle>
                              <CardDescription>
                                Example output from {VENDOR_OUTPUTS[compareVendor as keyof typeof VENDOR_OUTPUTS].name}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {/* Sample Subjective Section */}
                              <Collapsible open={soapSectionsExpanded.subjective} onOpenChange={() => toggleSoapSection('subjective')}>
                                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                                  <span className="font-medium">Subjective</span>
                                  {soapSectionsExpanded.subjective ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-2">
                                  <div className="p-3 bg-background border rounded-lg">
                                    <HighlightedText text={VENDOR_OUTPUTS[compareVendor as keyof typeof VENDOR_OUTPUTS].soap.subjective} />
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>

                              {/* Sample Objective Section */}
                              <Collapsible open={soapSectionsExpanded.objective} onOpenChange={() => toggleSoapSection('objective')}>
                                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                                  <span className="font-medium">Objective</span>
                                  {soapSectionsExpanded.objective ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-2">
                                  <div className="p-3 bg-background border rounded-lg">
                                    <HighlightedText text={VENDOR_OUTPUTS[compareVendor as keyof typeof VENDOR_OUTPUTS].soap.objective} />
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>

                              {/* Sample Assessment Section */}
                              <Collapsible open={soapSectionsExpanded.assessment} onOpenChange={() => toggleSoapSection('assessment')}>
                                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                                  <span className="font-medium">Assessment</span>
                                  {soapSectionsExpanded.assessment ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-2">
                                  <div className="p-3 bg-background border rounded-lg">
                                    <HighlightedText text={VENDOR_OUTPUTS[compareVendor as keyof typeof VENDOR_OUTPUTS].soap.assessment} />
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>

                              {/* Sample Plan Section */}
                              <Collapsible open={soapSectionsExpanded.plan} onOpenChange={() => toggleSoapSection('plan')}>
                                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                                  <span className="font-medium">Plan</span>
                                  {soapSectionsExpanded.plan ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-2">
                                  <div className="p-3 bg-background border rounded-lg">
                                    <HighlightedText text={VENDOR_OUTPUTS[compareVendor as keyof typeof VENDOR_OUTPUTS].soap.plan} />
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}