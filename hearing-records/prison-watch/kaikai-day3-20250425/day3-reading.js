(() => {
  'use strict';
  const current = document.currentScript;
  const base = current ? new URL('./', current.src) : new URL('./', location.href);
  const isDay4 = document.body.classList.contains('day4-page');
  const load = src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });

  const sharedReader = new URL('./day3-reading-core-20260821.js?v=20260821-shared-location-reconcile-2', base).href;
  if (isDay4) {
    load(sharedReader).catch(error => console.error('Shared Day 4 reader failed to load', error));
    return;
  }

  const crosscheck = new URL('./day3-testimony-crosscheck.js?v=20260821-testimony-crosscheck-2', base).href;
  const refine = new URL('./day3-former-nanny-crosscheck-refine-20260821.js?v=20260821-2', base).href;

  window.__day3ReadingCoreRequested = true;
  load(crosscheck)
    .catch(error => console.error('Day 3 testimony cross-check failed to load', error))
    .then(() => load(refine).catch(error => console.error('Day 3 testimony refinement failed to load', error)))
    .finally(() => load(sharedReader).catch(error => console.error('Shared Day 3 reader failed to load', error)));
})();