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

  const crosscheck = new URL('./day2-testimony-crosscheck.js?v=20260821-2', base).href;
  const refine = new URL('./day2-crosscheck-refine-20260821.js?v=20260821-2', base).href;
  const core = new URL('./day2-reading-core-20260821.js?v=20260821-1', base).href;

  window.__day2ReadingCoreRequested = true;
  load(crosscheck)
    .catch(error => console.error('Day 2 testimony cross-check failed to load', error))
    .then(() => load(refine).catch(error => console.error('Day 2 testimony refinement failed to load', error)))
    .finally(() => load(core).catch(error => console.error('Day 2 reading core failed to load', error)));
})();
