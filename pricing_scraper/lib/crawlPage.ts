import type { PageData } from "../types";
import { parseUrl } from "./parseUrl";
import axios from 'axios';
import * as cheerio from 'cheerio';


const getLinksFromPage = ($: cheerio.CheerioAPI, baseUrl: string): Array<string> => {
  const links = new Set<string>();
  
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (href) {
      const fullUrl = parseUrl(baseUrl, href);
      const baseDomain = new URL(baseUrl).hostname;
      
      try {
        const linkDomain = new URL(fullUrl).hostname;
        if (linkDomain === baseDomain) {
          links.add(fullUrl);
        }
      } catch {
        // Skip invalid URLs
      }
    }
  });

  return Array.from(links);
}

export const crawlPage = async (url: string): Promise<PageData> => {
  const response = await axios.get(url, { timeout: 10000 });
  const $ = cheerio.load(response.data);
  
  const pageContent = $('body').text().toLowerCase();
  const pageTitle = $('title').text().toLowerCase();
  const pageHtml = $.html();
  const pageLinks = getLinksFromPage($, url);
  
  return {url, pageContent, pageTitle, pageHtml, pageLinks}
}