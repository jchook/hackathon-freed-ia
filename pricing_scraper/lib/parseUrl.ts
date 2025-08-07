export const parseUrl = (baseUrl: string, relativeUrl: string): string => {
  let url: string;
  
  if (relativeUrl.startsWith('http')) {
    url = relativeUrl;
  } else {
    try {
      url = new URL(relativeUrl, baseUrl).toString();
    } catch {
      url = baseUrl + (relativeUrl.startsWith('/') ? '' : '/') + relativeUrl;
    }
  }
  
  // Remove query strings and hash fragments
  const queryIndex = url.indexOf('?');
  const hashIndex = url.indexOf('#');
  
  if (queryIndex !== -1 && hashIndex !== -1) {
    // Both exist, use whichever comes first
    url = url.substring(0, Math.min(queryIndex, hashIndex));
  } else if (queryIndex !== -1) {
    // Only query string exists
    url = url.substring(0, queryIndex);
  } else if (hashIndex !== -1) {
    // Only hash fragment exists
    url = url.substring(0, hashIndex);
  }
  
  return url;
}