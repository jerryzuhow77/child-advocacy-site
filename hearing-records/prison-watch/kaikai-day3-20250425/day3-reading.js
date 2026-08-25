(() => {
  'use strict';
  const current = document.currentScript;
  const base = current ? new URL('./', current.src) : new URL('./', location.href);
  const isDay4 = document.body.classList.contains('day4-page');
  const pdfFigure = isDay4
    ? document.querySelector('.day4-schedule-figure')
    : document.querySelector('.day3-pdf-figure');
  const pdfImage = pdfFigure?.querySelector('img');
  const pdfCaption = pdfFigure?.querySelector('figcaption');
  if (pdfImage) {
    pdfImage.src = isDay4
      ? '../../../assets/source/prison-watch-day4-pdf-image-p1-20250428.png'
      : '../../../assets/source/prison-watch-day3-pdf-image-p1-20250425.png';
    pdfImage.alt = `${isDay4 ? 'DAY4' : 'DAY3'}原始PDF第1頁所附圖片`;
    pdfImage.width = 740;
    pdfImage.height = isDay4 ? 744 : 450;
  }
  if (pdfCaption) pdfCaption.textContent = '原始 PDF 圖片｜第1頁｜資料來源：監所關注小組';
  if (isDay4 && pdfFigure) {
    const fullRecordHeader = document.querySelector('#full-record > .day3-section-head');
    fullRecordHeader?.after(pdfFigure);
  }
  const load = src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });

  const sharedReader = new URL('./day3-reading-core-20260821.js?v=20260821-shared-site-a-father-1', base).href;
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
