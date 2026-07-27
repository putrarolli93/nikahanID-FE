import { useEffect } from 'react';

const DEFAULT_TITLE = 'Datangya.site - Undangan Pernikahan Digital Elegan & Modern';
const DEFAULT_DESC = 'Datangya.site - Platform pembuatan undangan pernikahan digital elegan, praktis, & modern. Fitur RSVP, ucapan tamu, lokasi Google Maps, dan musik background.';
const DEFAULT_IMAGE = 'https://datangya.site/favicon.svg';
const BASE_SITE_URL = 'https://datangya.site';

export default function SEO({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  noindex = false,
  schemaData = null,
}) {
  useEffect(() => {
    // 1. Title
    const finalTitle = title ? `${title} | Datangya.site` : DEFAULT_TITLE;
    document.title = finalTitle;

    // Helper to update or create meta element
    const setMeta = (selector, attrName, attrVal, contentVal) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentVal);
    };

    // 2. Meta description & keywords
    const finalDesc = description || DEFAULT_DESC;
    setMeta('meta[name="description"]', 'name', 'description', finalDesc);

    if (keywords) {
      setMeta('meta[name="keywords"]', 'name', 'keywords', keywords);
    }

    // 3. Robots
    const robotsVal = noindex ? 'noindex, nofollow' : 'index, follow';
    setMeta('meta[name="robots"]', 'name', 'robots', robotsVal);

    // 4. Canonical Link
    const currentUrl = canonicalUrl || `${BASE_SITE_URL}${window.location.pathname}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    // 5. OpenGraph Tags
    const finalImage = ogImage || DEFAULT_IMAGE;
    setMeta('meta[property="og:title"]', 'property', 'og:title', finalTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', finalDesc);
    setMeta('meta[property="og:url"]', 'property', 'og:url', currentUrl);
    setMeta('meta[property="og:image"]', 'property', 'og:image', finalImage);
    setMeta('meta[property="og:type"]', 'property', 'og:type', ogType);

    // 6. Twitter Cards
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', finalTitle);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', finalDesc);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', finalImage);

    // 7. Schema.org JSON-LD Structured Data
    let schemaScript = document.getElementById('json-ld-schema');
    if (schemaData) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'json-ld-schema';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.text = JSON.stringify(schemaData);
    } else if (schemaScript) {
      schemaScript.remove();
    }

    // Cleanup when component unmounts
    return () => {
      const scriptToRemove = document.getElementById('json-ld-schema');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, noindex, schemaData]);

  return null;
}
