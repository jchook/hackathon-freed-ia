import OpenAI from "openai";
import type { FeedItem, Insight } from "../shared/schema";

let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is required");
    }
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

interface InsightGenerationResult {
  shouldGenerate: boolean;
  impact: 'high' | 'medium' | 'low';
  categories: string[];
  reasoning: string;
}

interface GeneratedInsight {
  title: string;
  summary: string;
  categories: string[];
  impact: 'high' | 'medium' | 'low';
  insights: {
    gtm_impact?: string[];
    counter_programming?: string[];
    sales_soundbites?: string[];
    sales?: string[];
    marketing?: string[];
    product?: string[];
  };
  actionItems: {
    category: string;
    action: string;
    assignee?: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  mentions: string[];
}

export class InsightsService {
  async shouldGenerateInsight(feedItem: FeedItem): Promise<InsightGenerationResult> {
    try {
      const response = await getOpenAIClient().chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a competitive intelligence analyst for Freed AI, a medical AI scribe company. 
            
Your job is to determine if a competitor feed item requires strategic insights generation.

Only generate insights for HIGH-IMPACT items that could affect:
- Sales strategy and competitive positioning  
- Marketing messaging and positioning
- Product roadmap and feature priorities

Analyze the feed item and return JSON with this structure:
{
  "shouldGenerate": true/false,
  "impact": "high"/"medium"/"low", 
  "categories": ["sales", "marketing", "product"],
  "reasoning": "Brief explanation of why this item does/doesn't warrant insights"
}

HIGH-IMPACT examples:
- Major funding rounds ($20M+)
- New product launches or major feature releases
- Key partnerships (Epic, major health systems)
- Pricing changes
- Leadership changes at senior levels
- Security incidents
- Major customer wins/losses

LOW-IMPACT examples (skip these):
- Minor feature updates
- Small blog posts
- Regular maintenance releases
- Minor personnel changes
- General industry news`
          },
          {
            role: "user", 
            content: `Analyze this feed item:
Title: ${feedItem.title}
Content: ${feedItem.content}
Source: ${feedItem.source}
Tags: ${feedItem.tags?.join(', ') || 'none'}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        shouldGenerate: result.shouldGenerate || false,
        impact: result.impact || 'low',
        categories: Array.isArray(result.categories) ? result.categories : [],
        reasoning: result.reasoning || "Analysis completed"
      };

    } catch (error) {
      console.error("Failed to analyze feed item for insights:", error);
      return {
        shouldGenerate: false,
        impact: 'low',
        categories: [],
        reasoning: "Analysis failed - defaulting to no insights generation"
      };
    }
  }

  async generateInsight(feedItem: FeedItem, analysis: InsightGenerationResult): Promise<GeneratedInsight> {
    try {
      const response = await getOpenAIClient().chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a senior competitive intelligence analyst for Freed AI, a medical AI scribe company.

COMPANY CONTEXT:
Freed AI is a focused, fast, accurate AI medical scribe that prioritizes:
- Speed: 30-60 second note generation
- Clinical-grade accuracy 
- Ultra-simple workflows
- Core differentiator: "Trinity" of speed, accuracy, ease-of-use

COMPETITIVE POSITIONING AGAINST HEIDI HEALTH:
- Trinity narrative: "With Freed you never sacrifice the core three—speed (30–60 sec), clinical-grade accuracy, and ultra-simple workflows. Competitors that bolt on extra modules inevitably slow at least one of those pillars."
- Ease-of-use trade-off: "More toggles, tabs and call flows mean more onboarding and IT change-management. Freed stays friction-free: one workflow, one login, zero clutter."
- Accuracy under load: "Real-time accuracy drops when a model juggles 110 languages and phone triage. Freed's single-purpose engine is tuned exclusively for high-fidelity English clinical notes."
- Speed remains king: "Freed still delivers notes in under a minute—even as Heidi adds PDF parsing and telephony that can tax processing time."
- Epic parity, simpler path: "We already deploy inside Epic today—without forcing clinicians to learn a new marketplace. Freed's Chrome extension covers every other web-based EHR out-of-the-box."
- Focus beats sprawl: "Heidi's new features are exciting, but clinicians tell us they need one tool that nails note-taking, not a Swiss-army knife that's half-open on the desk."

Generate strategic insights in this JSON format with specific focus on GTM impact and counter-programming:
{
  "title": "Competitor Event - Talking Points",
  "summary": "Executive summary of the competitive event and its implications",
  "categories": ["sales", "marketing", "product"],
  "impact": "high"/"medium"/"low",
  "insights": {
    "gtm_impact": [
      "Enterprise pull-through: specific impact on enterprise deals",
      "Feature-bloat perception risk: how this affects buyer perception", 
      "International pressure: global market implications",
      "Up-funnel competition: expansion into new territories"
    ],
    "counter_programming": [
      "Trinity narrative first: core messaging about speed/accuracy/simplicity",
      "Ease-of-use trade-off: simplicity vs complexity argument",
      "Accuracy under load: performance under stress argument",
      "Speed remains king: time-to-value advantage",
      "Epic parity, simpler path: integration simplicity",
      "Focus beats sprawl: specialized vs generalized approach"
    ],
    "sales_soundbites": [
      "Ready-to-use talking points for sales conversations",
      "Specific responses to competitor claims",
      "Positioning statements that redirect to Freed's strengths"
    ]
  },
  "actionItems": [
    {
      "category": "sales",
      "action": "Update competitive battlecards with new counter-positions",
      "assignee": "@sales-team",
      "priority": "high"
    },
    {
      "category": "marketing", 
      "action": "Refresh messaging to emphasize differentiation",
      "assignee": "@marketing-team",
      "priority": "medium"
    }
  ],
  "mentions": ["@sales-team", "@product-team", "@leadership"]
}

TONE: Strategic, actionable, confident. Focus on specific talking points and competitive responses that sales teams can use immediately.`
          },
          {
            role: "user",
            content: `Generate strategic insights for this ${analysis.impact}-impact competitive intelligence:

Feed Item:
- Title: ${feedItem.title}
- Content: ${feedItem.content} 
- Source: ${feedItem.source}
- URL: ${feedItem.sourceUrl}
- Published: ${feedItem.publishedAt}
- Tags: ${feedItem.tags?.join(', ') || 'none'}

Focus on these categories: ${analysis.categories.join(', ')}

Provide specific, actionable insights that help Freed maintain competitive advantage.`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      // Validate and clean up the result
      return {
        title: result.title || `${feedItem.source} Competitive Intelligence`,
        summary: result.summary || "Strategic analysis of competitive development",
        categories: Array.isArray(result.categories) ? result.categories : analysis.categories,
        impact: result.impact || analysis.impact,
        insights: {
          gtm_impact: Array.isArray(result.insights?.gtm_impact) ? result.insights.gtm_impact : [],
          counter_programming: Array.isArray(result.insights?.counter_programming) ? result.insights.counter_programming : [],
          sales_soundbites: Array.isArray(result.insights?.sales_soundbites) ? result.insights.sales_soundbites : [],
          sales: Array.isArray(result.insights?.sales) ? result.insights.sales : [],
          marketing: Array.isArray(result.insights?.marketing) ? result.insights.marketing : [],
          product: Array.isArray(result.insights?.product) ? result.insights.product : []
        },
        actionItems: Array.isArray(result.actionItems) ? result.actionItems.map(item => ({
          category: item.category || 'general',
          action: item.action || '',
          assignee: item.assignee,
          priority: item.priority || 'medium'
        })) : [],
        mentions: Array.isArray(result.mentions) ? result.mentions : []
      };

    } catch (error) {
      console.error("Failed to generate insights:", error);
      
      // Fallback insight
      return {
        title: `${feedItem.source} Update - Requires Analysis`,
        summary: `New development from ${feedItem.source}: ${feedItem.title}`,
        categories: analysis.categories,
        impact: analysis.impact,
        insights: {
          sales: [`Monitor ${feedItem.source} developments for competitive positioning`],
          marketing: [`Review messaging against ${feedItem.source} claims`],
          product: [`Assess product implications of ${feedItem.source} changes`]
        },
        actionItems: [{
          category: 'general',
          action: `Manual review required for ${feedItem.source} development`,
          assignee: '@leadership',
          priority: 'medium' as const
        }],
        mentions: ['@leadership']
      };
    }
  }
}

export const insightsService = new InsightsService();