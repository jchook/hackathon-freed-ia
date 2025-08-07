import type { AiApi, PageData } from "../types";

export const isPricingPageAi = async (aiApi: AiApi, {pageContent, pageTitle, url}: PageData): Promise<boolean> => {
  const response = await aiApi.execute(`
          
Analyze if this webpage is a pricing page that lists services with prices. Look for structured pricing information, service tiers, or pricing tables.

Page title: ${pageTitle}
URL: ${url}
Content: ${pageContent}

Respond only with a single string: "YES" to indicate that this is a pricing page with service pricing information or "NO" if it is not. Do not under any circumstances include any other data in the response.

  `);

  return (response).trim().toUpperCase() === 'YES';
}
