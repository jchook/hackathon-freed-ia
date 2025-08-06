import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink, Search, Building2 } from "lucide-react";

interface ScribeVendor {
  name: string;
  domain: string;
  website: string;
  description: string;
  category: string;
  features: string[];
}

const SCRIBE_VENDORS: ScribeVendor[] = [
  {
    name: "Abridge",
    domain: "abridge.com",
    website: "https://abridge.com",
    description: "AI-powered medical conversation platform that transforms patient-clinician conversations into structured clinical notes, improving documentation accuracy and patient engagement.",
    category: "Enterprise",
    features: ["Real-time transcription", "HIPAA compliant", "EHR integration"]
  },
  {
    name: "Augmedix",
    domain: "augmedix.com", 
    website: "https://augmedix.com",
    description: "Leading ambient medical documentation company providing live clinical note generation through AI-powered scribes, reducing physician burnout and improving patient care.",
    category: "Enterprise",
    features: ["Live documentation", "Specialized scribes", "Multi-specialty support"]
  },
  {
    name: "Suki AI",
    domain: "suki.ai",
    website: "https://suki.ai",
    description: "Voice-enabled AI assistant designed specifically for healthcare, offering hands-free clinical documentation and administrative task automation for physicians.",
    category: "Enterprise",
    features: ["Voice commands", "Clinical workflows", "Administrative automation"]
  },
  {
    name: "Nuance DAX",
    domain: "nuance.com",
    website: "https://nuance.com",
    description: "Dragon Ambient eXperience (DAX) by Microsoft Nuance provides ambient clinical intelligence that automatically captures patient encounters and generates clinical documentation.",
    category: "Enterprise",
    features: ["Ambient intelligence", "Microsoft integration", "Multi-language support"]
  },
  {
    name: "Heidi Health",
    domain: "heidihealth.com.au",
    website: "https://heidihealth.com.au",
    description: "Australian-based AI medical scribe that understands healthcare workflows, providing intelligent clinical documentation with strong focus on accuracy and ease of use.",
    category: "Mid-Market",
    features: ["Healthcare-focused AI", "Workflow integration", "Clinical accuracy"]
  },
  {
    name: "Freed AI",
    domain: "getfreed.ai",
    website: "https://getfreed.ai",
    description: "AI medical scribe built for clinicians, offering streamlined documentation with real-time transcription and intelligent note generation designed by healthcare professionals.",
    category: "Mid-Market", 
    features: ["Clinician-built", "Real-time processing", "User-friendly interface"]
  },
  {
    name: "Sunoh.ai",
    domain: "sunoh.ai",
    website: "https://sunoh.ai",
    description: "Intelligent medical documentation assistant that transforms healthcare workflows with AI-powered transcription and automated clinical note generation.",
    category: "Mid-Market",
    features: ["Intelligent automation", "Workflow optimization", "Seamless integration"]
  },
  {
    name: "DeepScribe",
    domain: "deepscribe.ai",
    website: "https://deepscribe.ai", 
    description: "Ambient AI platform that automates medical documentation by capturing and structuring clinical conversations into comprehensive notes without disrupting patient care.",
    category: "Enterprise",
    features: ["Ambient capture", "Structured notes", "Non-intrusive documentation"]
  },
  {
    name: "Robin Healthcare",
    domain: "robinhealthcare.com",
    website: "https://robinhealthcare.com",
    description: "AI-powered clinical documentation platform that combines human expertise with advanced technology to deliver accurate, comprehensive medical notes.",
    category: "Enterprise", 
    features: ["Human-AI collaboration", "Clinical expertise", "Comprehensive documentation"]
  },
  {
    name: "Nabla",
    domain: "nabla.com",
    website: "https://nabla.com",
    description: "AI assistant for healthcare professionals that automatically generates clinical notes from patient encounters, reducing administrative burden and improving care quality.",
    category: "Mid-Market",
    features: ["Healthcare AI", "Administrative reduction", "Care quality focus"]
  },
  {
    name: "Ambience Healthcare",
    domain: "ambiencehealthcare.com", 
    website: "https://ambiencehealthcare.com",
    description: "Comprehensive AI operating system for healthcare that automates clinical documentation, coding, and administrative workflows across the entire care continuum.",
    category: "Enterprise",
    features: ["Healthcare OS", "Full workflow automation", "Care continuum coverage"]
  },
  {
    name: "Doximity Scribe",
    domain: "doximity.com",
    website: "https://doximity.com",
    description: "Medical networking platform's AI scribe solution that integrates clinical documentation with physician communication and collaboration tools.",
    category: "Mid-Market",
    features: ["Physician network integration", "Communication tools", "Collaborative documentation"]
  },
  {
    name: "Amazon AWS HealthScribe",
    domain: "aws.amazon.com/healthscribe",
    website: "https://aws.amazon.com/healthscribe",
    description: "HIPAA-eligible service that uses speech recognition and generative AI to automatically generate clinical notes from patient-clinician conversations.",
    category: "Enterprise",
    features: ["AWS cloud infrastructure", "HIPAA-eligible", "Scalable solution"]
  },
  {
    name: "Google Cloud MedLM",
    domain: "cloud.google.com/solutions/ai/medlm",
    website: "https://cloud.google.com/solutions/ai/medlm",
    description: "Google's medical large language models designed for healthcare applications, including clinical documentation, medical reasoning, and healthcare workflows.",
    category: "Enterprise", 
    features: ["Google Cloud integration", "Medical LLM", "Healthcare workflows"]
  },
  {
    name: "Corti Assistant",
    domain: "corti.ai",
    website: "https://corti.ai",
    description: "AI assistant that supports healthcare professionals with real-time clinical decision support and automated documentation during patient encounters.",
    category: "Enterprise",
    features: ["Real-time decision support", "Clinical assistance", "Encounter documentation"]
  },
  {
    name: "ScribeAmerica Speke",
    domain: "scribeamerica.com/speke",
    website: "https://scribeamerica.com/speke",
    description: "AI-powered medical documentation platform from ScribeAmerica, combining traditional scribe services with advanced AI technology for comprehensive clinical documentation.",
    category: "Enterprise",
    features: ["Traditional scribe integration", "Hybrid AI-human model", "Comprehensive documentation"]
  },
  {
    name: "Tali AI",
    domain: "tali.ai",
    website: "https://tali.ai",
    description: "Voice-first AI assistant for healthcare that enables hands-free clinical documentation and seamless integration with existing EHR systems.",
    category: "Mid-Market",
    features: ["Voice-first interface", "Hands-free operation", "EHR integration"]
  },
  {
    name: "Lyrebird Health",
    domain: "lyrebirdhealth.com",
    website: "https://lyrebirdhealth.com",
    description: "AI medical scribe that automatically generates clinical notes from patient consultations, designed to reduce administrative burden and improve patient care.",
    category: "Mid-Market",
    features: ["Consultation automation", "Administrative reduction", "Patient care focus"]
  },
  {
    name: "Eleos Health", 
    domain: "eleos.health",
    website: "https://eleos.health",
    description: "AI-powered platform specifically designed for behavioral health, providing automated clinical documentation and insights for mental health professionals.",
    category: "Specialized",
    features: ["Behavioral health focus", "Mental health specialization", "Clinical insights"]
  },
  {
    name: "Mentalyc",
    domain: "mentalyc.com", 
    website: "https://mentalyc.com",
    description: "AI-powered tool for mental health professionals that automates therapy note generation and clinical documentation for behavioral health practices.",
    category: "Specialized",
    features: ["Mental health focus", "Therapy notes", "Behavioral health specialization"]
  }
];

export default function Scribes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Enterprise", "Mid-Market", "Specialized"];

  const filteredVendors = SCRIBE_VENDORS.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || vendor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Enterprise":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Mid-Market":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Specialized":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="flex h-screen bg-dashboard-bg" data-testid="scribes-container">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header />
        
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Building2 className="w-8 h-8" />
                AI Medical Scribes Directory
              </h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive directory of {SCRIBE_VENDORS.length} AI medical scribe vendors and platforms
              </p>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search vendors, features, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="vendor-search"
              />
            </div>
            <div className="flex gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  data-testid={`category-filter-${category.toLowerCase()}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredVendors.length} of {SCRIBE_VENDORS.length} vendors
            {searchTerm && ` matching "${searchTerm}"`}
            {selectedCategory !== "All" && ` in ${selectedCategory} category`}
          </div>

          {/* Vendor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor, index) => (
              <Card key={vendor.domain} className="h-full hover:shadow-lg transition-shadow" data-testid={`vendor-card-${index}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{vendor.name}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground mb-2">
                        {vendor.domain}
                      </CardDescription>
                    </div>
                    <Badge className={getCategoryColor(vendor.category)}>
                      {vendor.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed">{vendor.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Key Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {vendor.features.map(feature => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center gap-2"
                      onClick={() => window.open(vendor.website, '_blank')}
                      data-testid={`visit-website-${vendor.domain}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Website
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results Message */}
          {filteredVendors.length === 0 && (
            <Card className="p-8">
              <div className="text-center">
                <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No vendors found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or category filter
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {SCRIBE_VENDORS.filter(v => v.category === "Enterprise").length}
                </div>
                <div className="text-sm text-muted-foreground">Enterprise Solutions</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {SCRIBE_VENDORS.filter(v => v.category === "Mid-Market").length}
                </div>
                <div className="text-sm text-muted-foreground">Mid-Market Options</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {SCRIBE_VENDORS.filter(v => v.category === "Specialized").length}
                </div>
                <div className="text-sm text-muted-foreground">Specialized Platforms</div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}