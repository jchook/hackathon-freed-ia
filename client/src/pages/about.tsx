import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, BookOpen, TrendingUp, Heart, Stethoscope, Globe } from "lucide-react";
import sharefImage from "@assets/sharedf_1754282048093.png";

export default function About() {
  return (
    <div className="flex h-screen bg-dashboard-bg" data-testid="about-container">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header />
        
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">About ScribeArena</h1>
              <p className="text-muted-foreground mt-2">
                Building a community to help clinicians navigate the future of ambient scribe technology
              </p>
            </div>

            {/* Hero Section */}
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20">
                  <img 
                    src={sharefImage} 
                    alt="Dr. Sharef" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Meet Dr. Sharef</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A clinician's mission to create a supportive community for ambient scribe adoption
              </p>
            </div>

            {/* Introduction Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Stethoscope className="w-6 h-6 text-primary" />
                  <CardTitle className="text-xl">My Story</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg leading-relaxed">
                  My name is <strong>Sharef</strong>, and I am a clinician who has witnessed firsthand the rapid evolution 
                  of healthcare technology. As ambient scribe solutions began transforming clinical documentation, 
                  I realized that many of my colleagues were struggling to navigate this new landscape.
                </p>
                <p className="leading-relaxed">
                  The promise of AI-powered medical scribes is immense – reducing documentation burden, improving 
                  patient interaction time, and enhancing clinical workflow efficiency. However, the reality is that 
                  choosing the right solution, understanding regulatory requirements, and implementing best practices 
                  can be overwhelming for busy healthcare professionals.
                </p>
              </CardContent>
            </Card>

            {/* Mission Statement */}
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6 text-red-500" />
                  <CardTitle className="text-xl">The Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">
                  I created <strong>ScribeArena</strong> to make it easy for other clinicians to navigate the world of 
                  ambient scribe technology, stay informed about regulations, follow industry news, and most importantly, 
                  create a community where we can share best practices and learn from each other's experiences.
                </p>
              </CardContent>
            </Card>

            {/* What We Offer */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <CardTitle>Market Intelligence</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed">
                    Real-time pricing tracking, vendor comparisons, and performance analytics to help you make 
                    informed decisions about AI scribe solutions.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-green-500" />
                    <CardTitle>Regulatory Guidance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed">
                    Stay up-to-date with HIPAA compliance, FDA regulations, and industry standards that affect 
                    ambient scribe implementation in healthcare settings.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-purple-500" />
                    <CardTitle>Community Platform</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed">
                    Connect with fellow clinicians, share experiences, and learn from real-world implementations 
                    across different specialties and practice settings.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-orange-500" />
                    <CardTitle>Industry News</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed">
                    Curated updates from leading vendors, breakthrough research, and emerging trends in 
                    AI-powered clinical documentation technology.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Vision Section */}
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle className="text-xl text-center">Our Vision</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg leading-relaxed text-center">
                  I envision a future where every clinician has access to the information, tools, and community 
                  support needed to successfully integrate ambient scribe technology into their practice.
                </p>
                
                <Separator className="my-6" />
                
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      Informed Decisions
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Evidence-based vendor selection and implementation strategies
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      Shared Knowledge
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Community-driven best practices and lessons learned
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      Better Patient Care
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      More time with patients through efficient documentation
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="border-primary">
              <CardContent className="p-8 text-center space-y-4">
                <h3 className="text-2xl font-semibold">Join Our Community</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Whether you're just beginning to explore ambient scribe solutions or you're an experienced user 
                  looking to optimize your workflow, ScribeArena is here to support your journey. Together, we can 
                  shape the future of clinical documentation.
                </p>
                <div className="flex justify-center gap-2 pt-4">
                  <Badge variant="outline">Community</Badge>
                  <Badge variant="outline">Innovation</Badge>
                  <Badge variant="outline">Excellence</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}