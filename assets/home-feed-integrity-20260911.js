(() => {
  'use strict';

  const canonicalHref = (anchor) => {
    if (!anchor?.href) return '';
    try {
      const url = new URL(anchor.href, window.location.href);
      const path = url.pathname.replace(/\/index\.html$/i, '/').replace(/\/+$/, '') || '/';
      const isOfficialSite = url.hostname.toLowerCase() === 'jerryzuhow77.github.io';
      const isCurrentSite = url.hostname.toLowerCase() === window.location.hostname.toLowerCase();
      if (isOfficialSite || isCurrentSite) {
        return `site:${path.replace(/^\/child-advocacy-site/i, '') || '/'}`;
      }
      return `${url.hostname.toLowerCase()}${path}`;
    } catch {
      return anchor.href;
    }
  };

  const removeDuplicates = (selector) => {
    // Each homepage section is an independent editorial surface. An article may
    // intentionally appear in News, Court information and Pinned reports at the
    // same time, so deduplicate only inside the current feed.
    const seen = new Set();
    document.querySelectorAll(selector).forEach((anchor) => {
      const href = canonicalHref(anchor);
      if (!href || seen.has(href)) {
        anchor.remove();
        return;
      }
      seen.add(href);
    });
  };

  removeDuplicates('#news-flash .home-pinned-report-card');
  removeDuplicates('#news-flash .home-document-disc-card');

  const recentCount = document.querySelectorAll('#news-flash .home-document-disc-card').length;
  const orbit = document.querySelector('#news-flash .home-document-disc-orbit');
  if (orbit) orbit.setAttribute('aria-label', `最新發布的${recentCount}篇文章`);
})();
