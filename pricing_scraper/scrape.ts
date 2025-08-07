import { crawlPage } from "./lib/crawlPage";
import { PageData, PricingData } from "./types";
import { isPricingPageAi } from "./lib/isPricingPageAi";
import { isPricingPageSimple } from "./lib/isPricingPageSimple";
import { createAnthropic } from "./lib/createAnthropic";
import { parsePricingPage } from "./lib/parsePricingPage";
import { scoreUrl } from "./lib/scoreUrl";
import { PricingError } from "./lib/pricingError";

type PageQueue = Array<readonly [score: number, url: string]>

const createBaseUrl = (url: string): string => {
  const parsed = new URL(url);
  return `${parsed.protocol}//${parsed.hostname}`;
}

export const scrape = async (url: string): Promise<PricingData | false> => {
  const baseUrl = createBaseUrl(url);
  const aiApi = createAnthropic();
  aiApi.resetTokens();
  let pageQueue: PageQueue = [];
  const parsedLinks = new Set<string>(baseUrl);

  pageQueue.push([0, url]);

  while (pageQueue.length > 0) {
    const [, url] = pageQueue.shift() as PageQueue[number];

    // Crawl page and extract data.
    let pageData: PageData;
    try {
      pageData = await crawlPage(url);
    } catch(error) {
      console.error(`Error crawling page ${url}:`, error);
      continue;
    }

    // If page is a pricing page, scrape it.
    try {
      if (isPricingPageSimple(pageData)) {
        console.info('simple match: ', url);
        if (await isPricingPageAi(aiApi, pageData)) {
          console.info('  accepted by ai');
          return parsePricingPage(aiApi, pageData);
        } else {
          console.info('  rejected by ai')
        }
      }
    } catch(error){
      if (error instanceof PricingError) {
        console.error(error);
        return false;
      }
      console.error(`Error scraping page ${url}:`, error);
    }

    // Otherwise extract links, add to queue, and sort.
    const { pageLinks } = pageData;
    for (const link of pageLinks) {
      if (parsedLinks.has(link)) {
        continue;
      }
      parsedLinks.add(link);
      pageQueue.push([scoreUrl(link), link]);
    }
    pageQueue.sort((a, b) => b[0] - a[0]);
  }

  return false;
}
