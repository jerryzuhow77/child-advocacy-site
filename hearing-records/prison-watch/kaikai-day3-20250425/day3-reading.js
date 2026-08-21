(() => {
  'use strict';
  const current = document.currentScript;
  const base = current ? new URL('./', current.src) : new URL('./', location.href);
  const load = src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });
  const core = new URL('./day3-reading-core.js?v=20260821-1', base).href;
  const crosscheck = new URL('../kaikai-day4-20250428/day4-crosscheck.js?v=20260821-1', base).href;
  const prepare = document.body.classList.contains('day4-page')
    ? load(crosscheck).then(() => window.day4CrosscheckReady)
    : Promise.resolve();
  prepare.catch(error => console.error('Day 4 cross-check failed to load', error)).finally(() => {
    load(core).catch(error => console.error('Court-record reader failed to load', error));
  });
})();
