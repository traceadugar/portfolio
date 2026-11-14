import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteMetadata({ data, name }) {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!data) return;
    const study = data.case_studies?.find(item => pathname.replace(/\/$/, '') === `/case-studies/${item.id}`);
    const title = study ? `${study.title} | ${name}` : `${name} | ${data.basic_info.headline}`;
    const description = study?.summary || data.basic_info.meta_description;
    document.title = title;
    for (const [selector, content] of [['meta[name="description"]', description], ['meta[property="og:title"]', title], ['meta[property="og:description"]', description], ['meta[property="og:url"]', `https://traceportfolio.netlify.app${pathname}`]]) {
      const tag = document.querySelector(selector);
      if (tag) tag.setAttribute('content', content);
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', `https://traceportfolio.netlify.app${pathname}`);
  }, [data, name, pathname]);
  return null;
}
