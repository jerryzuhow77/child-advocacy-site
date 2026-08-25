(() => {
  'use strict';
  const current = document.currentScript;
  const base = current ? new URL('./', current.src) : new URL('./', location.href);
  const pdfFigure = document.querySelector('.day2-pdf-figure');
  const pdfImage = pdfFigure?.querySelector('img');
  const pdfCaption = pdfFigure?.querySelector('figcaption');
  if (pdfImage) {
    pdfImage.src = '../../../assets/source/prison-watch-day2-pdf-image-p1-20250423.png';
    pdfImage.alt = 'DAY2原始PDF第1頁所附圖片';
    pdfImage.width = 740;
    pdfImage.height = 455;
  }
  if (pdfCaption) pdfCaption.textContent = '原始 PDF 圖片｜第1頁｜資料來源：監所關注小組';
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
