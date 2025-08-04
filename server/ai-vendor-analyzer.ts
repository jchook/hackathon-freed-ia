import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
  try {
    const response = await openai.chat.completions.create({
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
      website: result.website.startsWith("http") ? result.website : `https://${result.website}`,
      reviewSources: result.reviewSources || [],
      newsSources: result.newsSources || [],
      confidence: result.confidence || 0.5,
      reasoning: result.reasoning || "Analysis completed"
    };

  } catch (error) {
    console.error("AI vendor analysis failed:", error);
    
    // Fallback parsing for basic inputs
    const fallbackName = input.includes("http") 
      ? extractDomainName(input)
      : input.trim();
    
    const fallbackWebsite = input.includes("http") 
      ? input 
      : `https://${input.toLowerCase().replace(/\s+/g, "")}.com`;

    return {
      vendorName: fallbackName,
      description: `${fallbackName} is an AI medical scribe solution that helps healthcare providers with clinical documentation.`,
      website: fallbackWebsite,
      reviewSources: [],
      newsSources: [],
      confidence: 0.3,
      reasoning: "Fallback analysis due to AI processing error"
    };
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