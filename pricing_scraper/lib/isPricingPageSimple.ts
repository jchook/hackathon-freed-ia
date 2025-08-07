import { PageData } from "../types";

const PRICING_INDICATORS = [
  'pricing', 'price', 'plans', 'cost', 'billing', 'subscription',
  '$', '€', '£', '¥', 'free', 'premium', 'enterprise', 'basic',
  'monthly', 'annually', 'per month', 'per year', 'trial'
];


export const isPricingPageSimple = ({pageContent, pageTitle, url}: PageData) => PRICING_INDICATORS.some(indicator => 
  pageContent.includes(indicator) || pageTitle.includes(indicator) || url.toLowerCase().includes(indicator)
)