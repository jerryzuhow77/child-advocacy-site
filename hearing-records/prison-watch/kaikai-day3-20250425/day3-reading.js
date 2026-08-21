(() => {
  'use strict';
  const current = document.currentScript;
  const base = current ? new URL('./', current.src) : new URL('./', location.href);
  const isDay4 = document.body.classList.contains('day4-page');
  const target = isDay4
    ? './day3-reading-core-20260821.js?v=20260821-shared-loader-1'
    : './day3-testimony-crosscheck.js?v=20260821-testimony-crosscheck-1';
  const script = document.createElement('script');
  script.src = new URL(target, base).href;
  script.async = false;
  script.onerror = () => console.error(isDay4 ? 'Shared Day 4 reader failed to load.' : 'Day 3 testimony cross-check failed to load.');
  document.head.append(script);
})();
