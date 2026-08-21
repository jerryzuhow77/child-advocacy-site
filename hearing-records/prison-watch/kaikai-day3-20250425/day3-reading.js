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
  const core = new URL('./day3-reading-core.js?v=20260821-1', base).href;
  const crosscheck = new URL('../kaikai-day4-20250428/day4-crosscheck.js?v=20260821-1', base).href;
  const tensionData = new URL('../../../assets/witness-tensions-day3-data-20260821.js?v=20260821-1', base).href;
  const tensionUi = new URL('../../../assets/witness-testimony-tensions-20260821.js?v=20260821-2', base).href;
  const prepare = isDay4
    ? load(crosscheck).then(() => window.day4CrosscheckReady)
    : Promise.resolve();
  prepare.catch(error => console.error('Day 4 cross-check failed to load', error)).finally(() => {
    load(core).then(async () => {
      if (!isDay4) {
        try {
          await load(tensionData);
          await load(tensionUi);
        } catch (error) {
          console.error('Witness cross-check module failed to load', error);
        }
        return;
      }
      const reader = document.querySelector('.day3-record-progress');
      if (reader) reader.setAttribute('aria-label', document.documentElement.lang === 'ja' ? '第4日法廷対話の閲覧進捗' : document.documentElement.lang === 'en' ? 'Day 4 hearing-dialogue progress' : '第四日庭審對話閱讀進度');
      document.querySelectorAll('.day3-record-tools-copy span').forEach(element => {
        element.textContent = element.textContent.replace(/第三日|Day 3|第3日/g, value => value === 'Day 3' ? 'Day 4' : value === '第3日' ? '第4日' : '第四日');
      });
      window.ScrollTrigger?.refresh();
    }).catch(error => console.error('Court-record reader failed to load', error));
  });
})();
