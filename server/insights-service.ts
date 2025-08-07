import OpenAI from "openai";
import type { FeedItem, Insight } from "../shared/schema";

// Extended FeedItem type that includes severity, category, and subcategory
interface ExtendedFeedItem extends FeedItem {
  severity?: number;
  category?: string;
  subcategory?: string;
}

let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

function hasApiKey(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

// Predefined insights for demo purposes when no API key is available
const DEMO_INSIGHTS = {
  heidi: {
    title: "Heidi July 2025 Release – Strategic Analysis",
    summary: "Heidi rolled out six notable upgrades including PDF form filling, AI calls, 110+ language support, smart dictation, native Epic integration, and an integration marketplace. This represents significant feature expansion that impacts Freed's competitive positioning.",
    categories: ["sales", "marketing", "product"],
    impact: "high" as const,
    content: `# Heidi July 2025 Release – Strategic Analysis

## Executive Summary
Heidi's July 2025 release represents a significant expansion of their platform capabilities, moving beyond pure ambient scribing into broader clinical workflow automation. This development requires strategic response from Freed to maintain competitive positioning.

## GTM Impact Analysis

### 🏢 Enterprise Pull-Through
Heidi's Epic connector and marketplace messaging will increase mindshare in hospital/health-system deals where Freed pitches its custom Epic, Cerner & Meditech work. The integration marketplace positions Heidi as a comprehensive solution rather than a point tool.

### ⚠️ Feature-Bloat Perception Risk
A wider surface area (calls, forms, multilingual, etc.) may impress buyers but also raises expectations that could complicate proofs-of-concept and lengthen sales cycles. This creates an opportunity for Freed to emphasize simplicity.

### 🌍 International Pressure
The 110-language claim sets a new bar for global customers. Freed may need to highlight its current multilingual roadmap or prioritize top-requested languages based on customer demand.

### 📞 Up-Funnel Competition
Automated patient calls inch Heidi toward engagement/CRM territory. Freed should monitor if prospects start benchmarking 'patient-outreach' rather than pure ambient scribing.

## Counter-Programming Strategy

### 🎯 Trinity Narrative First
> "With Freed you never sacrifice the core three—speed (30–60 sec), clinical-grade accuracy, and ultra-simple workflows. Competitors that bolt on extra modules inevitably slow at least one of those pillars."

### 🎛️ Ease-of-Use Trade-Off
> "More toggles, tabs and call flows mean more onboarding and IT change-management. Freed stays friction-free: one workflow, one login, zero clutter."

### ⚡ Accuracy Under Load
> "Real-time accuracy drops when a model juggles 110 languages and phone triage. Freed's single-purpose engine is tuned exclusively for high-fidelity English clinical notes."

### 🏃 Speed Remains King
> "Freed still delivers notes in under a minute—even as Heidi adds PDF parsing and telephony that can tax processing time."

### 🔗 Epic Parity, Simpler Path
> "We already deploy inside Epic today—without forcing clinicians to learn a new marketplace. Freed's Chrome extension covers every other web-based EHR out-of-the-box."

### 🎯 Focus Beats Sprawl
> "Heidi's new features are exciting, but clinicians tell us they need one tool that nails note-taking, not a Swiss-army knife that's half-open on the desk."

## Sales Soundbites

| Situation | Response |
|-----------|----------|
| Heidi's feature expansion comes up | "More features often mean more complexity. What matters is getting notes done fast and accurately." |
| Epic integration discussion | "We integrate with Epic today through our Chrome extension - no new marketplace to learn." |
| Multilingual capabilities | "Our focus is on perfecting English clinical notes. Speed and accuracy beat language breadth." |

## Action Items

### High Priority
- [ ] **Sales Team**: Update competitive battlecards with new counter-positions against Heidi's feature expansion
- [ ] **Marketing Team**: Refresh messaging to emphasize Trinity narrative and simplicity advantage

### Medium Priority  
- [ ] **Product Team**: Review multilingual roadmap priorities based on market pressure

## Key Takeaways
- Use these points to steer conversations back to Freed's differentiated speed, accuracy, and ease of use
- Emphasize that feature expansion often comes at the cost of core competencies
- Position Freed as the focused, reliable choice vs. the Swiss-army knife approach`,
    mentions: ["@sales-team", "@marketing-team", "@product-team", "@leadership"]
  },
  generic: {
    title: "Competitive Intelligence Analysis",
    summary: "New competitive development detected. Strategic review recommended to assess impact on Freed's market position.",
    categories: ["sales", "marketing"],
    impact: "medium" as const,
    content: `# Competitive Intelligence Analysis

## Executive Summary
New competitive development detected. Strategic review recommended to assess impact on Freed's market position.

## GTM Impact

- Monitor competitive landscape changes that may affect sales positioning
- Assess potential impact on customer acquisition and retention strategies

## Counter-Programming

- Reinforce Freed's core value proposition of speed, accuracy, and simplicity
- Emphasize proven track record and customer satisfaction

## Sales Soundbites

- Focus on Freed's differentiated Trinity approach
- Highlight customer success stories and proven ROI

## Action Items

- [ ] **Sales Team**: Review competitive positioning and update sales materials

## Next Steps
Continue monitoring competitive landscape and adjust strategy as needed.`,
    mentions: ["@sales-team", "@leadership"]
  }
};

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
  content: string; // Markdown content
  mentions: string[];
}

export class InsightsService {
  async shouldGenerateInsight(feedItem: ExtendedFeedItem): Promise<InsightGenerationResult> {
    // Use severity to determine if we should generate insights (severity 8+ = high impact)
    const severity = feedItem.severity || 5;
    const isHighImpact = severity >= 8;
    
    console.log(`Insights analysis: severity=${severity}, isHighImpact=${isHighImpact}, shouldGenerate=${isHighImpact}`);
    return {
      shouldGenerate: isHighImpact, // Only generate for high severity items
      impact: isHighImpact ? 'high' : 'medium',
      categories: ['sales', 'marketing', 'product'],
      reasoning: `Severity ${severity} ${isHighImpact ? 'warrants' : 'does not warrant'} insights generation`
    };
  }

  async generateInsight(feedItem: ExtendedFeedItem, analysis: InsightGenerationResult): Promise<GeneratedInsight> {
    // If no API key, use predefined insights
    if (!hasApiKey()) {
      console.log("No API key found, using predefined insights for demo");
      
      // Check if this is about Heidi to use specific insights
      const isHeidiRelated = feedItem.title.toLowerCase().includes('heidi') || 
                            feedItem.source.toLowerCase() === 'heidi';
      
      const demoInsight = isHeidiRelated ? DEMO_INSIGHTS.heidi : DEMO_INSIGHTS.generic;
      
      return {
        title: demoInsight.title,
        summary: demoInsight.summary,
        categories: demoInsight.categories,
        impact: demoInsight.impact,
        content: demoInsight.content,
        mentions: demoInsight.mentions
      };
    }

    try {
      const client = getOpenAIClient();
      if (!client) {
        throw new Error("OpenAI client not available");
      }
      
      const response = await client.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 4000,
        temperature: 0.3,
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

Generate strategic insights in rich markdown format with specific focus on GTM impact and counter-programming. Use:

- **Headings** (##, ###) for organization
- **Bold text** for emphasis
- **Tables** for structured data
- **Bullet points** for lists
- **Blockquotes** (>) for key messaging
- **Emojis** for visual appeal
- **Checkboxes** (- [ ]) for action items

Structure your response with:
1. Executive Summary
2. GTM Impact Analysis
3. Counter-Programming Strategy  
4. Sales Soundbites (use tables)
5. Action Items (use checkboxes)
6. Key Takeaways

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

Provide specific, actionable insights that help Freed maintain competitive advantage. Respond with rich markdown content.`
          }
        ]
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('Unexpected response from OpenAI');
      }
      
      // Return the markdown content directly
      return {
        title: `${feedItem.source} Competitive Intelligence`,
        summary: `Strategic analysis of ${feedItem.source} development: ${feedItem.title}`,
        categories: analysis.categories,
        impact: analysis.impact,
        content: content,
        mentions: ["@sales-team", "@marketing-team", "@product-team", "@leadership"]
      };

    } catch (error) {
      console.error("Failed to generate insights:", error);
      
      // Fallback insight
      return {
        title: `${feedItem.source} Update - Requires Analysis`,
        summary: `New development from ${feedItem.source}: ${feedItem.title}`,
        categories: analysis.categories,
        impact: analysis.impact,
        content: `# ${feedItem.source} Update - Requires Analysis

## Executive Summary
New development from ${feedItem.source}: ${feedItem.title}

## Key Areas to Monitor

- **Sales**: Monitor ${feedItem.source} developments for competitive positioning
- **Marketing**: Review messaging against ${feedItem.source} claims  
- **Product**: Assess product implications of ${feedItem.source} changes

## Action Items

- [ ] **Leadership**: Manual review required for ${feedItem.source} development

## Next Steps
Continue monitoring and assess strategic implications as more information becomes available.`,
        mentions: ['@leadership']
      };
    }
  }
}

export const insightsService = new InsightsService();