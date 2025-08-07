import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Briefcase, GraduationCap, Heart } from "lucide-react";
import sharelfProfileImage from "@assets/sharef_1754525452177.png";

export default function About() {
  return (
    <div className="flex h-screen bg-dashboard-bg" data-testid="about-container">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header />
        
        <div className="p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              <div className="w-48 h-48 rounded-xl overflow-hidden shadow-lg bg-white">
                <img 
                  src={sharelfProfileImage} 
                  alt="Dr. Sharef" 
                  className="w-full h-full object-cover"
                  data-testid="profile-image"
                />
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Dr. Sharef
                </h1>
                <p className="text-xl text-muted-foreground mb-4">
                  Founder & Clinical Director, ScribeArena
                </p>
                <div className="flex flex-wrap gap-3 mb-4">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    Family Physician
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" />
                    MD
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Canada
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <Card data-testid="about-section">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                About Dr. Sharef
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base leading-relaxed">
                Dr. Sharef is a practicing family physician and healthcare technology innovator who created 
                ScribeArena to help fellow clinicians navigate the rapidly evolving landscape of AI medical 
                scribe solutions. With firsthand experience in clinical practice and a deep understanding 
                of healthcare workflows, he recognized the need for comprehensive, unbiased competitive 
                intelligence in the ambient documentation space.
              </p>
              <p className="text-base leading-relaxed">
                As both a clinician and technology advocate, Dr. Sharef brings unique insights into the 
                challenges healthcare professionals face with clinical documentation. His work focuses on 
                bridging the gap between cutting-edge AI technology and practical clinical applications, 
                ensuring that healthcare providers have the information they need to make informed decisions 
                about AI scribe adoption.
              </p>
            </CardContent>
          </Card>

          {/* Vision & Mission */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card data-testid="vision-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  To create a supportive community where healthcare professionals can share experiences, 
                  learn from each other, and confidently adopt AI scribe technologies that truly improve 
                  patient care and reduce clinical documentation burden.
                </p>
              </CardContent>
            </Card>

            <Card data-testid="mission-card">
              <CardHeader>
                <CardTitle>Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  ScribeArena provides comprehensive competitive intelligence and real-world testing 
                  of AI medical scribe platforms, empowering healthcare professionals to make 
                  evidence-based decisions about ambient documentation technology adoption.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Platform Impact */}
          <Card data-testid="impact-section">
            <CardHeader>
              <CardTitle>Platform Impact</CardTitle>
              <CardDescription>
                Building the future of clinical documentation through community-driven intelligence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-2">100+</div>
                  <div className="text-sm text-muted-foreground">AI Scribe Vendors Tracked</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-2">Real-time</div>
                  <div className="text-sm text-muted-foreground">Competitive Intelligence</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-2">Clinical</div>
                  <div className="text-sm text-muted-foreground">Testing Environment</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Focus */}
          <Card data-testid="community-section">
            <CardHeader>
              <CardTitle>Building a Clinical Community</CardTitle>
              <CardDescription>
                Sharing experiences and best practices for ambient scribe adoption
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed mb-4">
                Dr. Sharef's vision extends beyond competitive analysis to fostering a supportive 
                community where clinicians can share their experiences with AI scribe technology. 
                Through ScribeArena, healthcare professionals connect to discuss implementation 
                challenges, share success stories, and collectively advance the adoption of 
                ambient documentation tools that truly serve patient care.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge>Clinician-Led</Badge>
                <Badge>Evidence-Based</Badge>
                <Badge>Community-Driven</Badge>
                <Badge>Patient-Focused</Badge>
                <Badge>Innovation-Forward</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Professional Background */}
          <Card data-testid="background-section">
            <CardHeader>
              <CardTitle>Professional Background</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 mt-1 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">Family Medicine Practice</h4>
                  <p className="text-sm text-muted-foreground">
                    Practicing family physician with extensive experience in primary care 
                    and clinical documentation challenges
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 mt-1 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">Medical Education</h4>
                  <p className="text-sm text-muted-foreground">
                    Medical degree with specialization in family medicine and healthcare technology integration
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 mt-1 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">Healthcare Innovation</h4>
                  <p className="text-sm text-muted-foreground">
                    Passionate advocate for technology solutions that improve patient care and reduce physician burnout
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}