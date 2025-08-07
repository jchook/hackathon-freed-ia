const PRICING_KEYWORDS = ['pricing', 'price', 'plans', 'cost', 'billing', 'subscription', 'buy', 'purchase'];

export const scoreUrl = (url: string): number => {
  const urlLower = url.toLowerCase();
  let score = 0;
  
  for (const keyword of PRICING_KEYWORDS) {
    if (urlLower.includes(keyword)) {
      score += 10;
    }
  }
  
  if (urlLower.includes('about') || urlLower.includes('contact')) {
    score -= 5;
  }
  
  const depth = (url.match(/\//g) || []).length;
  score -= depth * 0.5;
  
  return score;
}