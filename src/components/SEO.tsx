import React, { useEffect } from 'react';

type JsonLd = Record<string, unknown>;

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  jsonLd?: JsonLd;
}

export default function SEO({ title, description, canonical, jsonLd }: SEOProps) {
  useEffect(() => {
    if (title) document.title = title;

    // Meta description
    let desc = document.querySelector('meta[name="description"]');
    if (!desc) {
      desc = document.createElement('meta');
      desc.setAttribute('name', 'description');
      document.head.appendChild(desc);
    }
    if (description) desc.setAttribute('content', description);

    // Canonical link
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    if (canonical) link.href = canonical;

    // JSON-LD
    const jsonId = 'seo-json-ld';
    let script = document.getElementById(jsonId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = jsonId;
      document.head.appendChild(script);
    }
    if (jsonLd) script.textContent = JSON.stringify(jsonLd);

    return () => {
      // optional: keep title but remove injected JSON-LD on unmount
      if (jsonLd) {
        const s = document.getElementById(jsonId);
        if (s) s.remove();
      }
    };
  }, [title, description, canonical, jsonLd]);

  return null;
}
