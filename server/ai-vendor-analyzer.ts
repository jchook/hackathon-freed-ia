import OpenAI from "openai";

// Dynamic OpenAI client management
let openaiClient: OpenAI | null = null;
let lastApiKeyCheck: string | null = null;

function getOpenAIClient(): OpenAI | null {
  const currentApiKey = process.env.OPENAI_API_KEY || null;
  
  // Check if API key has changed or if client needs to be initialized
  if (currentApiKey !== lastApiKeyCheck) {
    if (currentApiKey) {
      // API key exists - create or recreate client
      openaiClient = new OpenAI({ apiKey: currentApiKey });
      console.log("AI Vendor Analyzer: OpenAI client initialized with API key");
    } else {
      // No API key - clear client
      openaiClient = null;
      console.log("AI Vendor Analyzer: OpenAI client cleared - no API key available");
    }
    lastApiKeyCheck = currentApiKey;
  }
  
  return openaiClient;
}

function isClientAvailable(): boolean {
  return getOpenAIClient() !== null;
}

export interface VendorAnalysisResult {
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
    type: string; // 'blog', 'news', 'press'
  }>;
  confidence: number;
  reasoning: string;
}

export async function analyzeVendorInput(input: string): Promise<VendorAnalysisResult> {
  // Check if OpenAI client is available
  if (!isClientAvailable()) {
    console.log("AI Vendor Analyzer: OpenAI client not available, using fallback analysis");
    return getFallbackVendorAnalysis(input);
  }

  try {
    const client = getOpenAIClient();
    if (!client) {
      console.log("AI Vendor Analyzer: OpenAI client not available, using fallback analysis");
      return getFallbackVendorAnalysis(input);
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI medical scribe vendor research specialist. Given a user input (company name, URL, or description), analyze and extract comprehensive vendor information.

Return a JSON object with this exact structure:
{
  "vendorName": "Official company name",
  "description": "Professional 2-3 sentence description focusing on AI medical scribe capabilities",
  "website": "https://official-website.com",
  "reviewSources": [
    {"platform": "Trustpilot", "url": "https://trustpilot.com/review/...", "confidence": 0.9},
    {"platform": "G2", "url": "https://g2.com/products/...", "confidence": 0.8},
    {"platform": "Capterra", "url": "https://capterra.com/...", "confidence": 0.7}
  ],
  "newsSources": [
    {"name": "Company Blog", "url": "https://company.com/blog", "type": "blog"},
    {"name": "Press Releases", "url": "https://company.com/press", "type": "press"}
  ],
  "confidence": 0.85,
  "reasoning": "Brief explanation of analysis confidence"
}

Guidelines:
- Extract the most likely official vendor name
- Generate professional medical scribe description
- Find official website URL (add https:// if missing)
- Locate review platform URLs (Trustpilot, G2, Capterra, Google Reviews)
- Find company blog/news sources for feed integration
- Assign confidence scores (0-1) based on certainty
- If input is unclear, make best educated guess but lower confidence`
        },
        {
          role: "user",
          content: `Analyze this AI medical scribe vendor input: "${input}"`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Validate required fields
    if (!result.vendorName || !result.website || !result.description) {
      throw new Error("AI analysis missing required fields");
    }

    return {
      vendorName: result.vendorName,
      description: result.description,
      website: (result.website && result.website.startsWith("http")) ? result.website : `https://${result.website || result.vendorName.toLowerCase().replace(/\s+/g, "")}.com`,
      reviewSources: Array.isArray(result.reviewSources) ? result.reviewSources : [],
      newsSources: Array.isArray(result.newsSources) ? result.newsSources : [],
      confidence: result.confidence || 0.5,
      reasoning: result.reasoning || "Analysis completed"
    };

  } catch (error) {
    console.error("AI vendor analysis failed:", error);
    console.log("Using fallback vendor analysis due to error");
    return getFallbackVendorAnalysis(input);
  }
}

function extractDomainName(url: string): string {
  try {
    const domain = new URL(url).hostname.replace("www.", "");
    return domain.split(".")[0].charAt(0).toUpperCase() + domain.split(".")[0].slice(1);
  } catch {
    return url.trim();
  }
}

function capitalizeVendorName(name: string): string {
  return name
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function getKnownMedicalAIWebsite(cleanName: string): string | null {
  const knownCompanies: Record<string, string> = {
    "nabla": "https://www.nabla.com",
    "heidi": "https://www.heidihealthai.com", 
    "heidihealthai": "https://www.heidihealthai.com",
    "hedihealth": "https://www.heidihealthai.com",
    "freed": "https://www.getfreed.ai",
    "getfreed": "https://www.getfreed.ai",
    "freedai": "https://www.getfreed.ai",
    "sunoh": "https://www.sunoh.ai",
    "sunohai": "https://www.sunoh.ai",
    "ambient": "https://www.ambient.ai",
    "ambientai": "https://www.ambient.ai",
    "nuance": "https://www.nuance.com",
    "microsoft": "https://www.microsoft.com",
    "dragon": "https://www.nuance.com",
    "whisper": "https://openai.com",
    "openai": "https://openai.com",
    "anthropic": "https://www.anthropic.com",
    "claude": "https://www.anthropic.com"
  };
  
  return knownCompanies[cleanName] || null;
}

function getFallbackVendorAnalysis(input: string): VendorAnalysisResult {
  // Enhanced fallback parsing for basic inputs
  const fallbackName = input.includes("http") 
    ? extractDomainName(input)
    : capitalizeVendorName(input.trim());
  
  let fallbackWebsite = "";
  if (input.includes("http")) {
    fallbackWebsite = input;
  } else {
    // Enhanced website discovery for known medical AI companies
    const cleanName = input.toLowerCase().replace(/\s+/g, "");
    const knownWebsite = getKnownMedicalAIWebsite(cleanName);
    fallbackWebsite = knownWebsite || `https://www.${cleanName}.com`;
  }
  
  return {
    vendorName: fallbackName,
    description: `${fallbackName} is an AI medical scribe solution that helps healthcare providers with clinical documentation and workflow automation.`,
    website: fallbackWebsite,
    reviewSources: [],
    newsSources: [],
    confidence: 0.3,
    reasoning: "Fallback analysis - OpenAI client not available, using basic pattern matching"
  };
}