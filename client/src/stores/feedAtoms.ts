import { atom } from 'jotai';

export interface FeedItem {
  id: string;
  title: string;
  content: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  tags: string[];
  severity?: number;
  category?: string;
  subcategory?: string;
}

// Initial feed items data
const initialFeedItems: FeedItem[] = [
  {
    id: "feed-2",
    title: "Heidi Health Releases Forms & Calls Features",
    content: "Heidi Health released several updates. Its Forms feature automatically fills PDF forms based on visit details, while Calls (beta) lets clinicians automate routine patient calls and respond to queries.",
    source: "heidi",
    sourceUrl: "https://heidihealth.com",
    publishedAt: "2025-07-13T00:00:00.000Z",
    tags: ["features", "product-updates"],
    severity: 5,
    category: "Features",
    subcategory: "Product Updates"
  },
  {
    id: "feed-1",
    title: "Suki AI Expands Leadership Team",
    content: "Suki expanded its leadership team by appointing Dr. Kevin Wang as Chief Medical Officer, Joe Chang as Chief Technology Officer and Dr. Vikram Khanna as Chief Customer Officer. CEO Punit Soni said these seasoned leaders would help scale Suki's intelligent assistive solutions.",
    source: "suki",
    sourceUrl: "https://suki.ai",
    publishedAt: "2025-07-14T00:00:00.000Z",
    tags: ["personnel", "leadership"],
    severity: 6,
    category: "Personnel",
    subcategory: "Executive Hires"
  },
  {
    id: "feed-3",
    title: "Abridge Announces Abridge Inside for Inpatient",
    content: "Abridge announced 'Abridge Inside for Inpatient,' a module integrated with Epic that generates inpatient notes. The launch coincided with Abridge's Series E raise, and Abridge forecast 50 million encounters annually with international expansion. Nemours Children's evaluation saw a 32% drop in after-hours charting.",
    source: "abridge",
    sourceUrl: "https://2minutemedicine.com",
    publishedAt: "2025-07-07T00:00:00.000Z",
    tags: ["features", "epic-integration"],
    severity: 8,
    category: "Features",
    subcategory: "Product Launch"
  },
  {
    id: "feed-4",
    title: "Abridge Raises $300M Series E at $5B+ Valuation",
    content: "According to StatNews snippets, Abridge raised a $300 million Series E led by Andreessen Horowitz with a valuation above $5 billion, coming just months after a February $250 million round. The company claimed over 150 enterprise customers.",
    source: "abridge",
    sourceUrl: "https://statnews.com",
    publishedAt: "2025-07-01T00:00:00.000Z",
    tags: ["fundraising", "series-e"],
    severity: 10,
    category: "Fundraising",
    subcategory: "Series E"
  },
  {
    id: "feed-5",
    title: "Suki AI Integrates with MEDITECH Expanse",
    content: "Suki announced that it became the first ambient AI solution integrated with MEDITECH Expanse. The integration allows ambiently generated notes and dictation to flow directly into MEDITECH, enabling clinicians to reduce administrative burden. Over 100,000 encounters and 1,000 providers had already used the Expanse integration.",
    source: "suki",
    sourceUrl: "https://suki.ai",
    publishedAt: "2025-07-01T00:00:00.000Z",
    tags: ["partnerships", "ehr-integration"],
    severity: 7,
    category: "Partnerships",
    subcategory: "EHR Integration"
  },
  {
    id: "feed-6",
    title: "Community Health Network Adopts Nuance DAX Copilot",
    content: "Nuance (Microsoft) announced that Community Health Network in Indiana adopted the Dragon Medical Platform (including DAX Copilot) and Microsoft Azure as part of a multi-year digital transformation. Community expanded DAX Copilot to 400 clinicians and integrated Epic on Azure.",
    source: "nuance",
    sourceUrl: "https://news.nuance.com",
    publishedAt: "2025-06-25T00:00:00.000Z",
    tags: ["partnerships", "health-system"],
    severity: 6,
    category: "Partnerships",
    subcategory: "Health System Adoption"
  },
  {
    id: "feed-7",
    title: "Heidi Health Launches Integration Marketplace & Smart Dictation",
    content: "Heidi introduced an integration marketplace that lets practices manage connections to multiple EHRs, along with Smart Dictation (automatic grammar handling) and the ability to write notes directly in Epic. The changelog also noted Heidi supports 110+ languages for transcription.",
    source: "heidi",
    sourceUrl: "https://heidihealth.com",
    publishedAt: "2025-06-21T00:00:00.000Z",
    tags: ["features", "integration-platform"],
    severity: 6,
    category: "Features",
    subcategory: "Integration Platform"
  },
  {
    id: "feed-8",
    title: "Nabla Introduces Real-Time Billing/Coding Assistant",
    content: "Introduced real-time billing/coding assistant that flags billing issues and nudges documentation during encounters. Also expanded nurse/inpatient tools.",
    source: "nabla",
    sourceUrl: "https://hospitalogy.com/articles/2025-06-18/breaking-down-nabla-sword-and-commons-clinics-recent-raises/",
    publishedAt: "2025-06-18T00:00:00.000Z",
    tags: ["features", "billing"],
    severity: 7,
    category: "Features",
    subcategory: "Feature Launch"
  },
  {
    id: "feed-9",
    title: "PDQI-9 Validation Study Shows AI Scribe Quality",
    content: "Introduced PDQI-9 validation study showing AI scribe notes scalable across specialties, scoring ~4.20/5 vs human 4.25/5.",
    source: "research",
    sourceUrl: "https://arxiv.org/abs/2505.17047",
    publishedAt: "2025-05-15T00:00:00.000Z",
    tags: ["research", "validation"],
    severity: 5,
    category: "Research",
    subcategory: "Evaluation Metric"
  },
  {
    id: "feed-10",
    title: "Peterson Institute Questions AI Scribe ROI",
    content: "Peterson Institute report finds limited evidence health systems save time with scribes—or lower costs—even as adoption climbs.",
    source: "research",
    sourceUrl: "https://www.statnews.com/2025/03/27/do-ai-scribes-help-health-systems-save-time-health-tech/",
    publishedAt: "2025-03-27T00:00:00.000Z",
    tags: ["research", "roi"],
    severity: 8,
    category: "Research",
    subcategory: "ROI/Operational Insight"
  },
  {
    id: "feed-11",
    title: "Freed AI Raises $30M Series A",
    content: "Freed AI announced a $30 million Series A led by Sequoia Capital. The company has 17,000 paying clinicians, has saved more than 2.5 million hours of clinicians' time and achieved 4× year-over-year ARR growth. New features include specialty-specific notes, a custom template builder, pre-charting and EHR integration via browser extension.",
    source: "freed",
    sourceUrl: "https://businesswire.com",
    publishedAt: "2025-03-05T00:00:00.000Z",
    tags: ["fundraising", "series-a"],
    severity: 8,
    category: "Fundraising",
    subcategory: "Series A"
  },
  {
    id: "feed-12",
    title: "Nabla Rolls Out Magic Edit Template Customizer",
    content: "Rolled out 'Magic Edit' note template customizer – allows physicians to control what to include/exclude contextually.",
    source: "nabla",
    sourceUrl: "https://hospitalogy.com/articles/2025-02-12/nabla-restoring-the-joy-of-medicine/",
    publishedAt: "2025-02-12T00:00:00.000Z",
    tags: ["features", "personalization"],
    severity: 6,
    category: "Features",
    subcategory: "Personalization"
  },
  {
    id: "feed-13",
    title: "DeepScribe Partners with Pearl Health ACO REACH",
    content: "DeepScribe became Pearl Health's preferred ambient AI partner for more than 3,500 primary care providers participating in the ACO REACH program. The integration pulls forward previous notes, generates new notes automatically and has adoption rates over 80%; DeepScribe holds a 98.8 KLAS score.",
    source: "deepscribe",
    sourceUrl: "https://deepscribe.ai",
    publishedAt: "2025-01-14T00:00:00.000Z",
    tags: ["partnerships", "aco"],
    severity: 7,
    category: "Partnerships",
    subcategory: "ACO Partnership"
  },
  {
    id: "feed-14",
    title: "Sporo Health Outperforms GPT-4o in Clinical Accuracy",
    content: "ArXiv study shows Sporo's specialized agentic architecture outperforms GPT-4o in clinical note accuracy (F1 ~75%), per clinician surveys.",
    source: "sporo",
    sourceUrl: "https://arxiv.org/abs/2411.06713",
    publishedAt: "2024-11-01T00:00:00.000Z",
    tags: ["research", "performance"],
    severity: 6,
    category: "Research",
    subcategory: "Performance Benchmark"
  },
  {
    id: "feed-15",
    title: "Sporo Health vs GPT-4o Mini Comparative Study",
    content: "Another comparative evaluation shows Sporo beats GPT-4o Mini in recall, precision, and hallucination reduction.",
    source: "sporo",
    sourceUrl: "https://arxiv.org/abs/2410.15528",
    publishedAt: "2024-10-01T00:00:00.000Z",
    tags: ["research", "comparative"],
    severity: 5,
    category: "Research",
    subcategory: "Comparative Study"
  },
  {
    id: "feed-16",
    title: "Market Analysis: Only 6 Vendors Dominate Enterprise",
    content: "Gartner/STAT analysis: although > 50 scribe vendors exist, only ~6 dominate enterprise deployments—nuance, Abridge, Nabla, etc.",
    source: "market",
    sourceUrl: "https://www.statnews.com/2024/07/30/generative-ai-health-care-adoption-ambient-scribes/",
    publishedAt: "2024-07-30T00:00:00.000Z",
    tags: ["research", "market-analysis"],
    severity: 7,
    category: "Research",
    subcategory: "Vendor Consolidation"
  },
  {
    id: "feed-17",
    title: "HCA Pilots Augmedix AI Scribe in 4 Emergency Rooms",
    content: "HCA piloted Augmedix AI scribe in 4 ERs, with human-in-loop cleanup, showing continuous learning and workflow efficiency.",
    source: "augmedix",
    sourceUrl: "https://hospitalogy.com/articles/2023-12-17/medallion-signed-sealed-credentialed/",
    publishedAt: "2023-12-01T00:00:00.000Z",
    tags: ["partnerships", "pilot"],
    severity: 6,
    category: "Partnerships",
    subcategory: "Pilot Deployment"
  },
  {
    id: "feed-18",
    title: "AWS Launches HealthScribe HIPAA-Eligible Service",
    content: "AWS launched HealthScribe—a HIPAA-eligible generative AI service to allow EHR partners to build ambient note apps with partners like 3M M*Modal, Babylon.",
    source: "aws",
    sourceUrl: "https://hospitalogy.com/articles/2023-08-01/amazon-healthcare-ai-play-healthscribe/",
    publishedAt: "2023-08-01T00:00:00.000Z",
    tags: ["platform", "infrastructure"],
    severity: 8,
    category: "Platform",
    subcategory: "Infrastructure Feature"
  }
];

// Next feed items that get added when refresh is clicked
const nextFeedItems: FeedItem[] = [
  {
    id: `refresh-${Date.now()}`,
    title: "Heidi Health July 2025 Release",
    content: "Heidi's July 2025 release adds auto-filled PDF forms, beta automated patient calls, 110-language transcription, smart dictation tabs, Epic EHR integration, a unified Integration Marketplace and assorted mobile/UI performance tweaks.",
    source: "heidi",
    sourceUrl: "https://www.heidihealth.com/changelog/july-2025-updates",
    publishedAt: "2025-07-15T00:00:00.000Z",
    tags: ["features", "epic-integration", "marketplace", "high-priority"]
  },
  {
    id: `refresh-${Date.now() + 1}`,
    title: "Sunoh AI Partners with Microsoft Teams",
    content: "New integration allows seamless documentation during virtual patient consultations, expanding Sunoh's platform reach into telemedicine workflows.",
    source: "sunoh",
    sourceUrl: "https://sunoh.ai/microsoft-partnership",
    publishedAt: new Date().toISOString(),
    tags: ["partnerships", "telemedicine", "integration"]
  },
  {
    id: `refresh-${Date.now() + 2}`,
    title: "Epic Systems Expands AI Scribe Capabilities", 
    content: "Epic announces native AI documentation features in next EHR update, potentially disrupting third-party scribe market with built-in functionality.",
    source: "market",
    sourceUrl: "https://epic.com/ai-scribe-expansion",
    publishedAt: new Date().toISOString(),
    tags: ["epic", "ehr", "competition", "ai-scribe"]
  },
  {
    id: `refresh-${Date.now() + 3}`,
    title: "Heidi Health Reports Security Incident",
    content: "Minor security incident affecting 2,000 users resolved within 4 hours. Company implements additional security measures and offers free credit monitoring.",
    source: "heidi",
    sourceUrl: "https://heidihealth.com/security-update", 
    publishedAt: new Date().toISOString(),
    tags: ["security", "incident", "response"]
  },
  {
    id: `refresh-${Date.now() + 4}`,
    title: "Abridge Announces Enterprise Pricing Update",
    content: "Enterprise plans increase by 15% effective next quarter, citing increased infrastructure costs and enhanced AI model capabilities.",
    source: "abridge",
    sourceUrl: "https://abridge.com/pricing-update",
    publishedAt: new Date().toISOString(),
    tags: ["pricing", "enterprise", "increase"]
  }
];

// Jotai atoms
export const feedItemsAtom = atom<FeedItem[]>(initialFeedItems);
export const newlyAddedItemsAtom = atom<Set<string>>(new Set<string>());
export const currentFeedIndexAtom = atom<number>(0);
export const nextFeedItemsAtom = atom<FeedItem[]>(nextFeedItems);

// Derived atoms for actions
export const addFeedItemAtom = atom(
  null,
  (get, set, newItem: FeedItem) => {
    const currentItems = get(feedItemsAtom);
    set(feedItemsAtom, [newItem, ...currentItems]);
  }
);

export const markAsNewlyAddedAtom = atom(
  null,
  (get, set, itemId: string) => {
    const currentNewlyAdded = get(newlyAddedItemsAtom);
    const updated = new Set(currentNewlyAdded);
    updated.add(itemId);
    set(newlyAddedItemsAtom, updated);
  }
);

export const removeNewlyAddedAtom = atom(
  null,
  (get, set, itemId: string) => {
    const currentNewlyAdded = get(newlyAddedItemsAtom);
    const updated = new Set(currentNewlyAdded);
    updated.delete(itemId);
    set(newlyAddedItemsAtom, updated);
  }
);

export const incrementFeedIndexAtom = atom(
  null,
  (get, set) => {
    const currentIndex = get(currentFeedIndexAtom);
    set(currentFeedIndexAtom, currentIndex + 1);
  }
);

export const resetFeedStoreAtom = atom(
  null,
  (get, set) => {
    set(feedItemsAtom, initialFeedItems);
    set(newlyAddedItemsAtom, new Set());
    set(currentFeedIndexAtom, 0);
    set(nextFeedItemsAtom, nextFeedItems);
  }
); 