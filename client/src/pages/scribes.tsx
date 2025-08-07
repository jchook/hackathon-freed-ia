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
  // Enterprise Solutions (20+ vendors)
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
    name: "Amazon AWS HealthScribe",
    domain: "aws.amazon.com/healthscribe",
    website: "https://aws.amazon.com/healthscribe",
    description: "HIPAA-eligible service that uses speech recognition and generative AI to automatically generate clinical notes from patient-clinician conversations.",
    category: "Enterprise",
    features: ["AWS cloud infrastructure", "HIPAA-eligible", "Scalable solution"]
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
    name: "Nuance Dragon Ambient eXperience",
    domain: "nuance.com",
    website: "https://nuance.com",
    description: "Dragon Ambient eXperience (DAX) by Microsoft Nuance provides ambient clinical intelligence that automatically captures patient encounters and generates clinical documentation.",
    category: "Enterprise",
    features: ["Ambient intelligence", "Microsoft integration", "Multi-language support"]
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
    name: "Oracle Clinical Digital Assistant",
    domain: "oracle.com/industries/healthcare",
    website: "https://oracle.com/industries/healthcare",
    description: "Enterprise-grade AI clinical assistant that integrates with Oracle's healthcare ecosystem to provide comprehensive documentation and workflow automation.",
    category: "Enterprise",
    features: ["Oracle integration", "Enterprise scalability", "Workflow automation"]
  },
  {
    name: "3M Fluency Align",
    domain: "3m.com/fluencyalign",
    website: "https://3m.com/fluencyalign",
    description: "Advanced clinical documentation improvement technology from 3M that enhances accuracy and efficiency in medical record documentation.",
    category: "Enterprise",
    features: ["Documentation improvement", "Clinical accuracy", "3M healthcare integration"]
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
    name: "ScribeAmerica Speke",
    domain: "scribeamerica.com/speke",
    website: "https://scribeamerica.com/speke",
    description: "AI-powered medical documentation platform from ScribeAmerica, combining traditional scribe services with advanced AI technology for comprehensive clinical documentation.",
    category: "Enterprise",
    features: ["Traditional scribe integration", "Hybrid AI-human model", "Comprehensive documentation"]
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
    name: "CareCloud (cirrusAI)",
    domain: "carecloud.com",
    website: "https://carecloud.com",
    description: "Comprehensive healthcare technology platform with integrated AI scribe capabilities for streamlined clinical documentation and practice management.",
    category: "Enterprise",
    features: ["Practice management integration", "Comprehensive platform", "Clinical documentation"]
  },
  {
    name: "Innovaccer InScribe",
    domain: "innovaccer.com",
    website: "https://innovaccer.com",
    description: "Healthcare data platform with integrated AI scribe functionality for automated clinical documentation and comprehensive patient data management.",
    category: "Enterprise",
    features: ["Data platform integration", "Patient data management", "Automated documentation"]
  },
  {
    name: "Athelas",
    domain: "athelas.com",
    website: "https://athelas.com",
    description: "AI-powered healthcare automation platform offering clinical documentation, remote patient monitoring, and administrative workflow optimization.",
    category: "Enterprise",
    features: ["Healthcare automation", "Remote monitoring", "Workflow optimization"]
  },
  {
    name: "Nextgen Ambient Assistant",
    domain: "nextgen.com",
    website: "https://nextgen.com",
    description: "Integrated ambient AI assistant within NextGen's healthcare platform, providing seamless clinical documentation and EHR integration.",
    category: "Enterprise",
    features: ["NextGen integration", "EHR seamless workflow", "Ambient documentation"]
  },
  {
    name: "Veradigm Ambient Scribe",
    domain: "veradigm.com",
    website: "https://veradigm.com",
    description: "Ambient AI scribe solution integrated with Veradigm's healthcare technology platform for comprehensive clinical documentation and workflow management.",
    category: "Enterprise",
    features: ["Veradigm integration", "Healthcare platform", "Workflow management"]
  },
  {
    name: "Expert AI",
    domain: "expert.ai",
    website: "https://expert.ai",
    description: "Advanced natural language processing platform with healthcare applications for clinical documentation and medical text analysis.",
    category: "Enterprise",
    features: ["Natural language processing", "Medical text analysis", "Advanced AI technology"]
  },
  {
    name: "IKS Health",
    domain: "ikshealth.com",
    website: "https://ikshealth.com",
    description: "Healthcare technology and services company providing AI-powered clinical documentation solutions and comprehensive healthcare support services.",
    category: "Enterprise",
    features: ["Healthcare services", "Clinical documentation", "Technology integration"]
  },

  // Mid-Market Solutions (40+ vendors)
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
    name: "Nabla",
    domain: "nabla.com",
    website: "https://nabla.com",
    description: "AI assistant for healthcare professionals that automatically generates clinical notes from patient encounters, reducing administrative burden and improving care quality.",
    category: "Mid-Market",
    features: ["Healthcare AI", "Administrative reduction", "Care quality focus"]
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
    name: "DeepCura AI",
    domain: "deepcura.com",
    website: "https://deepcura.com",
    description: "Advanced AI platform for clinical documentation that provides comprehensive note generation and medical workflow optimization for healthcare practices.",
    category: "Mid-Market",
    features: ["Advanced AI", "Comprehensive documentation", "Workflow optimization"]
  },
  {
    name: "Scribeberry",
    domain: "scribeberry.com",
    website: "https://scribeberry.com",
    description: "User-friendly AI medical scribe platform designed for individual practitioners and small practices, offering affordable clinical documentation solutions.",
    category: "Mid-Market",
    features: ["User-friendly design", "Small practice focus", "Affordable solution"]
  },
  {
    name: "PatientNotes",
    domain: "patientnotes.ai",
    website: "https://patientnotes.ai",
    description: "AI-powered clinical documentation platform that generates comprehensive patient notes from medical encounters with focus on accuracy and efficiency.",
    category: "Mid-Market",
    features: ["Patient-focused notes", "Clinical accuracy", "Efficient documentation"]
  },
  {
    name: "OnCall AI",
    domain: "oncall.ai",
    website: "https://oncall.ai",
    description: "AI medical assistant platform providing automated clinical documentation and clinical decision support for healthcare professionals.",
    category: "Mid-Market",
    features: ["Clinical decision support", "Automated documentation", "Medical assistance"]
  },
  {
    name: "Chartnote",
    domain: "chartnote.com",
    website: "https://chartnote.com",
    description: "Streamlined AI scribe solution for clinical documentation that integrates seamlessly with existing healthcare workflows and EHR systems.",
    category: "Mid-Market",
    features: ["Streamlined workflow", "EHR integration", "Clinical documentation"]
  },
  {
    name: "Notewand",
    domain: "notewand.com",
    website: "https://notewand.com",
    description: "AI-powered clinical note generation platform designed to reduce documentation time and improve accuracy in medical record keeping.",
    category: "Mid-Market",
    features: ["Note generation", "Time reduction", "Medical record accuracy"]
  },
  {
    name: "ScribeMD",
    domain: "scribemd.ai",
    website: "https://scribemd.ai",
    description: "Physician-focused AI scribe platform that provides intelligent clinical documentation tailored to medical practice workflows and requirements.",
    category: "Mid-Market",
    features: ["Physician-focused", "Intelligent documentation", "Practice workflow integration"]
  },
  {
    name: "Sayvant",
    domain: "sayvant.com",
    website: "https://sayvant.com",
    description: "Voice-enabled AI medical scribe that converts clinical conversations into structured documentation with high accuracy and HIPAA compliance.",
    category: "Mid-Market",
    features: ["Voice-enabled", "Structured documentation", "HIPAA compliance"]
  },
  {
    name: "S10 AI",
    domain: "s10.ai",
    website: "https://s10.ai",
    description: "Advanced AI platform for medical documentation that leverages machine learning to provide accurate and efficient clinical note generation.",
    category: "Mid-Market",
    features: ["Machine learning", "Accurate documentation", "Efficient generation"]
  },
  {
    name: "River Records",
    domain: "river.health",
    website: "https://river.health",
    description: "Modern medical record platform with integrated AI scribe capabilities for streamlined clinical documentation and patient data management.",
    category: "Mid-Market",
    features: ["Modern platform", "Patient data management", "Streamlined documentation"]
  },
  {
    name: "Refleta",
    domain: "refleta.com",
    website: "https://refleta.com",
    description: "AI-powered medical scribe solution that provides real-time clinical documentation with focus on accuracy and healthcare workflow integration.",
    category: "Mid-Market",
    features: ["Real-time documentation", "Healthcare workflow", "Clinical accuracy"]
  },
  {
    name: "OneChart",
    domain: "onechart.app",
    website: "https://onechart.app",
    description: "Unified clinical documentation platform with AI scribe functionality designed to consolidate medical records and improve patient care coordination.",
    category: "Mid-Market",
    features: ["Unified platform", "Medical record consolidation", "Care coordination"]
  },
  {
    name: "Mdhub",
    domain: "mdhub.ai",
    website: "https://mdhub.ai",
    description: "AI-powered healthcare platform providing comprehensive medical documentation and clinical workflow management for healthcare providers.",
    category: "Mid-Market",
    features: ["Healthcare platform", "Workflow management", "Comprehensive documentation"]
  },
  {
    name: "iScribe",
    domain: "iscribehealth.com",
    website: "https://iscribehealth.com",
    description: "Healthcare-focused AI scribe platform offering automated clinical documentation with emphasis on accuracy and ease of integration.",
    category: "Mid-Market",
    features: ["Healthcare-focused", "Automated documentation", "Easy integration"]
  },
  {
    name: "CureMD AI Scribe",
    domain: "curemd.com",
    website: "https://curemd.com",
    description: "Integrated AI scribe solution within CureMD's healthcare platform, providing seamless clinical documentation and practice management.",
    category: "Mid-Market",
    features: ["CureMD integration", "Practice management", "Seamless documentation"]
  },
  {
    name: "CarePilot",
    domain: "carepilot.ai",
    website: "https://carepilot.ai",
    description: "AI-powered healthcare assistant that provides clinical documentation support and patient care coordination for healthcare teams.",
    category: "Mid-Market",
    features: ["Healthcare assistance", "Care coordination", "Documentation support"]
  },
  {
    name: "Contrast",
    domain: "contrast.health",
    website: "https://contrast.health",
    description: "Modern AI medical scribe platform designed to enhance clinical documentation efficiency and improve patient-provider communication.",
    category: "Mid-Market",
    features: ["Modern platform", "Documentation efficiency", "Provider communication"]
  },
  {
    name: "CircleHealth AI",
    domain: "circlehealth.ai",
    website: "https://circlehealth.ai",
    description: "Comprehensive AI healthcare platform with integrated scribe functionality for clinical documentation and patient management.",
    category: "Mid-Market",
    features: ["Comprehensive platform", "Patient management", "Clinical documentation"]
  },
  {
    name: "Blueprint AI",
    domain: "blueprintai.com",
    website: "https://blueprintai.com",
    description: "AI-powered clinical documentation platform that creates structured medical notes from patient encounters with focus on accuracy and efficiency.",
    category: "Mid-Market",
    features: ["Structured notes", "Patient encounters", "Documentation accuracy"]
  },
  {
    name: "Bells AI",
    domain: "bells.ai",
    website: "https://bells.ai",
    description: "Intelligent AI scribe solution designed for healthcare professionals, offering automated clinical documentation and workflow optimization.",
    category: "Mid-Market",
    features: ["Intelligent documentation", "Healthcare professionals", "Workflow optimization"]
  },
  {
    name: "AutoScribe by Mutuo Health",
    domain: "mutuohealth.com",
    website: "https://mutuohealth.com",
    description: "Automated clinical documentation solution integrated within Mutuo Health's platform for comprehensive healthcare workflow management.",
    category: "Mid-Market",
    features: ["Automated documentation", "Healthcare workflows", "Platform integration"]
  },
  {
    name: "Andy",
    domain: "andy.health",
    website: "https://andy.health",
    description: "AI health assistant platform that provides clinical documentation support and patient interaction automation for healthcare providers.",
    category: "Mid-Market",
    features: ["Health assistant", "Patient interaction", "Documentation support"]
  },
  {
    name: "Aiva",
    domain: "aivahealth.com",
    website: "https://aivahealth.com",
    description: "AI-powered healthcare assistant offering clinical documentation automation and patient care support for medical professionals.",
    category: "Mid-Market",
    features: ["Healthcare assistant", "Documentation automation", "Patient care support"]
  },
  {
    name: "Ambient Clinical AWARE",
    domain: "ambientclinical.com",
    website: "https://ambientclinical.com",
    description: "Ambient AI clinical documentation platform that captures and processes medical conversations for accurate clinical note generation.",
    category: "Mid-Market",
    features: ["Ambient AI", "Medical conversations", "Clinical note generation"]
  },
  {
    name: "AutoMynd",
    domain: "automynd.com",
    website: "https://automynd.com",
    description: "AI-powered automation platform for healthcare documentation that streamlines clinical workflows and improves documentation efficiency.",
    category: "Mid-Market",
    features: ["Healthcare automation", "Clinical workflows", "Documentation efficiency"]
  },
  {
    name: "AvodMD",
    domain: "avodmd.com",
    website: "https://avodmd.com",
    description: "Medical documentation platform with AI scribe capabilities designed for healthcare providers seeking efficient clinical note generation.",
    category: "Mid-Market",
    features: ["Medical documentation", "Healthcare providers", "Efficient note generation"]
  },
  {
    name: "CareCortex",
    domain: "carecortex.ai",
    website: "https://carecortex.ai",
    description: "AI-powered clinical intelligence platform providing automated documentation and clinical decision support for healthcare organizations.",
    category: "Mid-Market",
    features: ["Clinical intelligence", "Automated documentation", "Decision support"]
  },
  {
    name: "Clinical Notes AI",
    domain: "clinicalnotes.ai",
    website: "https://clinicalnotes.ai",
    description: "Specialized AI platform for clinical note generation that focuses on accuracy and compliance with medical documentation standards.",
    category: "Mid-Market",
    features: ["Clinical note specialization", "Medical standards compliance", "Documentation accuracy"]
  },
  {
    name: "Commune Ambient AI",
    domain: "commune.us",
    website: "https://commune.us",
    description: "Ambient AI solution for healthcare documentation that captures clinical encounters and generates comprehensive medical notes.",
    category: "Mid-Market",
    features: ["Ambient solution", "Clinical encounters", "Comprehensive notes"]
  },
  {
    name: "Deliberate AI",
    domain: "deliberate.ai",
    website: "https://deliberate.ai",
    description: "Thoughtful AI approach to clinical documentation that provides accurate and contextual medical note generation for healthcare providers.",
    category: "Mid-Market",
    features: ["Thoughtful AI", "Contextual documentation", "Accurate note generation"]
  },
  {
    name: "Halo Medical Solutions",
    domain: "halomedicalsolutions.com",
    website: "https://halomedicalsolutions.com",
    description: "Comprehensive medical solutions platform with integrated AI scribe functionality for clinical documentation and practice management.",
    category: "Mid-Market",
    features: ["Medical solutions", "Practice management", "Clinical documentation"]
  },
  {
    name: "iMedX InstaNote",
    domain: "imedx.com/instanote",
    website: "https://imedx.com/instanote",
    description: "Instant clinical note generation platform that leverages AI to create accurate medical documentation from patient encounters.",
    category: "Mid-Market",
    features: ["Instant note generation", "Patient encounters", "Accurate documentation"]
  },
  {
    name: "InsightHealth Aura",
    domain: "insighthealth.ai",
    website: "https://insighthealth.ai",
    description: "AI-powered healthcare insights platform with clinical documentation capabilities that provide comprehensive patient care support.",
    category: "Mid-Market",
    features: ["Healthcare insights", "Patient care support", "Clinical documentation"]
  },
  {
    name: "Knowtex",
    domain: "knowtex.ai",
    website: "https://knowtex.ai",
    description: "Knowledge-driven AI platform for medical documentation that combines clinical expertise with advanced AI for accurate note generation.",
    category: "Mid-Market",
    features: ["Knowledge-driven AI", "Clinical expertise", "Accurate documentation"]
  },
  {
    name: "Mariana AI",
    domain: "marianaai.com",
    website: "https://marianaai.com",
    description: "Advanced AI platform for healthcare documentation that provides intelligent clinical note generation and workflow automation.",
    category: "Mid-Market",
    features: ["Advanced AI", "Intelligent documentation", "Workflow automation"]
  },
  {
    name: "Marvix AI",
    domain: "marvix.ai",
    website: "https://marvix.ai",
    description: "Innovative AI solution for medical documentation that offers comprehensive clinical note generation and healthcare workflow support.",
    category: "Mid-Market",
    features: ["Innovative AI", "Comprehensive notes", "Healthcare workflows"]
  },
  {
    name: "Mediary",
    domain: "mediary.ai",
    website: "https://mediary.ai",
    description: "AI-mediated clinical documentation platform that bridges the gap between patient care and accurate medical record keeping.",
    category: "Mid-Market",
    features: ["AI-mediated documentation", "Patient care bridge", "Medical record accuracy"]
  },
  {
    name: "MEDIT",
    domain: "medit.com",
    website: "https://medit.com",
    description: "Medical editing and documentation platform with AI capabilities for accurate clinical note generation and medical record management.",
    category: "Mid-Market",
    features: ["Medical editing", "Clinical notes", "Record management"]
  },
  {
    name: "MedSync",
    domain: "medsync.ai",
    website: "https://medsync.ai",
    description: "Synchronized medical documentation platform that uses AI to ensure consistency and accuracy across clinical notes and patient records.",
    category: "Mid-Market",
    features: ["Synchronized documentation", "Clinical consistency", "Patient record accuracy"]
  },
  {
    name: "Mpilo",
    domain: "mpilo.ai",
    website: "https://mpilo.ai",
    description: "AI-powered healthcare platform providing clinical documentation and patient management solutions for healthcare providers.",
    category: "Mid-Market",
    features: ["Healthcare platform", "Patient management", "Clinical documentation"]
  },
  {
    name: "Nudge AI",
    domain: "nudge.ai",
    website: "https://nudge.ai",
    description: "Intelligent AI assistant that nudges healthcare providers toward better clinical documentation and improved patient care outcomes.",
    category: "Mid-Market",
    features: ["Intelligent assistant", "Clinical documentation improvement", "Patient care outcomes"]
  },
  {
    name: "NVoq",
    domain: "nvoq.com",
    website: "https://nvoq.com",
    description: "Voice-powered AI platform for clinical documentation that converts speech to accurate medical notes with advanced transcription technology.",
    category: "Mid-Market",
    features: ["Voice-powered AI", "Speech conversion", "Advanced transcription"]
  },
  {
    name: "OmniMD AI Medical Scribe",
    domain: "omnimd.com",
    website: "https://omnimd.com",
    description: "Comprehensive medical practice management platform with integrated AI scribe functionality for streamlined clinical documentation.",
    category: "Mid-Market",
    features: ["Practice management", "Integrated scribe", "Streamlined documentation"]
  },
  {
    name: "Playback Health Pro",
    domain: "playbackhealth.com",
    website: "https://playbackhealth.com",
    description: "Professional healthcare documentation platform that replays and analyzes clinical encounters to generate accurate medical notes.",
    category: "Mid-Market",
    features: ["Encounter replay", "Clinical analysis", "Accurate documentation"]
  },
  {
    name: "RevMaxx",
    domain: "revmaxx.ai",
    website: "https://revmaxx.ai",
    description: "Revenue optimization platform with AI scribe capabilities designed to maximize documentation accuracy and healthcare billing efficiency.",
    category: "Mid-Market",
    features: ["Revenue optimization", "Documentation accuracy", "Billing efficiency"]
  },
  {
    name: "ScribeAI",
    domain: "scribeai.co",
    website: "https://scribeai.co",
    description: "Dedicated AI scribe platform providing automated clinical documentation with focus on accuracy and healthcare workflow integration.",
    category: "Mid-Market",
    features: ["Dedicated scribe", "Automated documentation", "Workflow integration"]
  },
  {
    name: "ScribeEMR",
    domain: "scribeemr.com",
    website: "https://scribeemr.com",
    description: "Electronic medical record platform with integrated AI scribe functionality for comprehensive clinical documentation and patient management.",
    category: "Mid-Market",
    features: ["EMR integration", "Comprehensive documentation", "Patient management"]
  },
  {
    name: "ScribeHealth AI",
    domain: "scribehealth.ai",
    website: "https://scribehealth.ai",
    description: "Healthcare-focused AI scribe platform designed specifically for medical professionals seeking accurate and efficient clinical documentation.",
    category: "Mid-Market",
    features: ["Healthcare-focused", "Medical professionals", "Efficient documentation"]
  },
  {
    name: "ScribeRyte",
    domain: "scriberyte.com",
    website: "https://scriberyte.com",
    description: "Right-sized AI scribe solution for healthcare practices that provides accurate clinical documentation tailored to specific medical specialties.",
    category: "Mid-Market",
    features: ["Right-sized solution", "Medical specialties", "Accurate documentation"]
  },
  {
    name: "Shine AI",
    domain: "shine.ai",
    website: "https://shine.ai",
    description: "Bright AI solution for medical documentation that illuminates clinical insights and provides comprehensive note generation for healthcare providers.",
    category: "Mid-Market",
    features: ["Clinical insights", "Comprehensive notes", "Healthcare providers"]
  },
  {
    name: "SimboAlphus",
    domain: "simbo.ai",
    website: "https://simbo.ai",
    description: "Advanced AI platform for healthcare automation including clinical documentation, patient interaction, and administrative workflow management.",
    category: "Mid-Market",
    features: ["Healthcare automation", "Patient interaction", "Administrative workflows"]
  },
  {
    name: "Sprynt AI Medical Scribe",
    domain: "sprynt.ai",
    website: "https://sprynt.ai",
    description: "Sprint-speed AI medical scribe that provides rapid clinical documentation generation without compromising accuracy or quality.",
    category: "Mid-Market",
    features: ["Rapid documentation", "Sprint-speed processing", "Quality maintenance"]
  },
  {
    name: "Sully AI",
    domain: "sully.ai",
    website: "https://sully.ai",
    description: "Reliable AI assistant for healthcare documentation that provides consistent and accurate clinical note generation for medical practices.",
    category: "Mid-Market",
    features: ["Reliable assistant", "Consistent documentation", "Medical practices"]
  },
  {
    name: "SwiftlyNote",
    domain: "swiftlynote.com",
    website: "https://swiftlynote.com",
    description: "Swift clinical note generation platform that accelerates medical documentation while maintaining accuracy and compliance standards.",
    category: "Mid-Market",
    features: ["Swift generation", "Documentation acceleration", "Compliance standards"]
  },
  {
    name: "Tebra Note Assist",
    domain: "tebra.com",
    website: "https://tebra.com",
    description: "Note assistance functionality within Tebra's comprehensive healthcare platform, providing AI-powered clinical documentation support.",
    category: "Mid-Market",
    features: ["Tebra integration", "Healthcare platform", "Documentation support"]
  },
  {
    name: "Tortus OSLER",
    domain: "tortus.ai",
    website: "https://tortus.ai",
    description: "OSLER AI system by Tortus that provides clinical decision support and automated medical documentation for healthcare professionals.",
    category: "Mid-Market",
    features: ["Clinical decision support", "Automated documentation", "Healthcare professionals"]
  },
  {
    name: "Twofold Health",
    domain: "twofold.health",
    website: "https://twofold.health",
    description: "Dual-approach healthcare platform that combines clinical documentation with patient engagement tools for comprehensive care management.",
    category: "Mid-Market",
    features: ["Dual-approach", "Patient engagement", "Care management"]
  },
  {
    name: "Vero Scribe",
    domain: "veroscribe.ai",
    website: "https://veroscribe.ai",
    description: "True-to-form AI scribe platform that provides accurate clinical documentation reflecting the authentic voice of healthcare providers.",
    category: "Mid-Market",
    features: ["True-to-form documentation", "Authentic voice", "Healthcare providers"]
  },
  {
    name: "Videra Health",
    domain: "viderahealth.com",
    website: "https://viderahealth.com",
    description: "Vision-driven healthcare platform with AI scribe capabilities that provide comprehensive clinical documentation and patient care insights.",
    category: "Mid-Market",
    features: ["Vision-driven platform", "Patient care insights", "Comprehensive documentation"]
  },
  {
    name: "Wavo Health AI Scribe",
    domain: "wavohealth.com",
    website: "https://wavohealth.com",
    description: "Wave of innovation in healthcare documentation with AI scribe technology that streamlines clinical note generation and workflow management.",
    category: "Mid-Market",
    features: ["Innovation wave", "Streamlined notes", "Workflow management"]
  },
  {
    name: "Zirr AI",
    domain: "zirr.ai",
    website: "https://zirr.ai",
    description: "Precision AI platform for medical documentation that delivers sharp, accurate clinical notes with advanced natural language processing.",
    category: "Mid-Market",
    features: ["Precision AI", "Sharp accuracy", "Natural language processing"]
  },

  // Specialized Solutions (Mental Health, Aesthetics, etc.)
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
  },
  {
    name: "JotPsych",
    domain: "jotpsych.com",
    website: "https://jotpsych.com",
    description: "Specialized AI scribe platform designed for psychiatric and psychological practices, offering tailored clinical documentation for mental health professionals.",
    category: "Specialized",
    features: ["Psychiatric specialization", "Psychology practices", "Mental health documentation"]
  },
  {
    name: "Upheal",
    domain: "upheal.com",
    website: "https://upheal.com",
    description: "AI-powered platform for mental health therapists that provides automated session notes and clinical documentation for therapy practices.",
    category: "Specialized",
    features: ["Mental health therapists", "Automated session notes", "Therapy practices"]
  },
  {
    name: "TheraPulse",
    domain: "therapulse.app",
    website: "https://therapulse.app",
    description: "Therapy-focused AI platform that captures the pulse of therapeutic sessions and generates comprehensive clinical documentation for mental health providers.",
    category: "Specialized",
    features: ["Therapy focus", "Therapeutic sessions", "Mental health providers"]
  },
  {
    name: "Empathia AI",
    domain: "empathia.ai",
    website: "https://empathia.ai",
    description: "Empathy-driven AI platform for healthcare documentation that understands the emotional context of patient encounters and generates compassionate clinical notes.",
    category: "Specialized",
    features: ["Empathy-driven", "Emotional context", "Compassionate documentation"]
  },
  {
    name: "Aesthetics360",
    domain: "aesthetics360.com",
    website: "https://aesthetics360.com",
    description: "Comprehensive platform for aesthetic medicine practices with integrated AI scribe functionality for cosmetic and aesthetic procedure documentation.",
    category: "Specialized",
    features: ["Aesthetic medicine", "Cosmetic procedures", "Aesthetic documentation"]
  },
  {
    name: "Accel EQ",
    domain: "acceleq.ai",
    website: "https://acceleq.ai",
    description: "Accelerated emotional quotient platform for healthcare that combines AI scribe capabilities with emotional intelligence for enhanced patient care documentation.",
    category: "Specialized",
    features: ["Emotional quotient", "Emotional intelligence", "Enhanced patient care"]
  },
  {
    name: "SOAPME.ai",
    domain: "soapme.ai",
    website: "https://soapme.ai",
    description: "SOAP note specialist AI platform that focuses specifically on generating structured SOAP format clinical documentation for healthcare providers.",
    category: "Specialized",
    features: ["SOAP note specialization", "Structured format", "Clinical documentation"]
  },
  {
    name: "SOAPNotesAI",
    domain: "soapnotesai.com",
    website: "https://soapnotesai.com",
    description: "Dedicated SOAP notes AI platform that specializes in creating standardized SOAP format medical documentation for clinical practices.",
    category: "Specialized",
    features: ["SOAP notes dedication", "Standardized format", "Medical documentation"]
  },
  {
    name: "SOAPsuds",
    domain: "soapsuds.ai",
    website: "https://soapsuds.ai",
    description: "Clean and efficient SOAP note generation platform that washes away documentation complexity with AI-powered clinical note automation.",
    category: "Specialized",
    features: ["Clean generation", "Documentation simplification", "Note automation"]
  },
  {
    name: "3M Fluency Direct",
    domain: "3m.com/fluency-direct",
    website: "https://3m.com/fluency-direct",
    description: "Direct clinical documentation solution from 3M that provides specialized AI scribe functionality for specific healthcare workflows and documentation needs.",
    category: "Specialized",
    features: ["3M healthcare integration", "Specialized workflows", "Direct documentation"]
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