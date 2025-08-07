export type AiApi = {
  execute: (content: string) => Promise<string>;
  resetTokens: () => void;
}

export type PageData = {
  url: string;
  pageTitle: string;
  pageContent: string;
  pageHtml: string;
  pageLinks: Array<string>;
}

export type PricingData = {
  company: string;
  url: string;
  pricingPlans: undefined | Array<{
    price: number;
    pricePlan: string;
    benefitsList: string[];
    billingCycle: string;
  }>;
}
