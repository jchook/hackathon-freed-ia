import { AiApi, PageData, PricingData } from "../types";

export const parsePricingPage = async (aiApi: AiApi, {pageContent, url}: PageData): Promise<false | PricingData> => {
  const result = await aiApi.execute(`
Extract pricing information from this pricing page and return it as a JSON string matching the following TypeScript type format:

{
  company: string; // The name of the company
  pricingPlans: Array<{
    price: number; // The price of the plan
    currency: string; // The currency of the price
    pricePlan: string; // The name of the plan
    benefitsList: string[]; // A list of benefits of the plan
    billingCycle: string; // The billing cycle of the plan (e.g.,"monthly", "yearly")
  }>;
}


Use the following raw HTML content:
${pageContent}

Return only **raw JSON**.

If no clear pricing structure is found, return JSON-encoded "false".

  `);

  const trimmedResult = result.replace(/```json|```/g, '');

  if (trimmedResult === 'false') {
    return false;
  }

  try {
    return {...JSON.parse(trimmedResult), url};
  } catch(error) {
    console.error(`Error parsing pricing page JSON:`, error);
    return false;
  }
}