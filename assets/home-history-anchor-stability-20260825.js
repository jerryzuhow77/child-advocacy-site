(() => {
  'use strict';

  const HASH = '#home-historical-cases';
  const MAX_LIFETIME = 6000;
  const CHECK_DELAYS = [0, 80, 220, 500, 900, 1500, 2400, 3600, 5200];
  let runId = 0;
  let userMoved = false;
  let observer;
  let stopTimer;

  const hasTargetHash = () => decodeURIComponent(location.hash) === HASH;

  function headerOffset() {
    const candidates = document.querySelectorAll(
      '.mobile-sticky-header, .site-header, .art-header, header[role="banner"]'
    );
    let offset = 16;
    candidates.forEach((node) => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      if ((style.position === 'fixed' || style.position === 'sticky') && rect.bottom > 0) {
        offset = Math.max(offset, Math.min(rect.bottom + 12, innerHeight * 0.25));
      }
    });
    return offset;
  }

  function revealHistory(target) {
    target.classList.remove('case-db-hidden');
    const social = document.getElementById('home-social-cases');
    const historyTab = document.querySelector('[data-case-tab="history"]');
    const liveTab = document.querySelector('[data-case-tab="live"]');
    if (!historyTab) return;
    social?.classList.add('case-db-hidden');
    historyTab.setAttribute('aria-selected', 'true');
    liveTab?.setAttribute('aria-selected', 'false');
  }

  function align(target, id) {
    if (id !== runId || userMoved || !hasTargetHash()) return;
    revealHistory(target);
    const wanted = headerOffset();
    const current = target.getBoundingClientRect().top;
    if (Math.abs(current - wanted) > 2) {
      window.scrollTo({ top: Math.max(0, window.scrollY + current - wanted), behavior: 'auto' });
    }
  }

  function stop() {
    observer?.disconnect();
    observer = undefined;
    clearTimeout(stopTimer);
  }

  function start() {
    stop();
    if (!hasTargetHash()) return;
    const target = document.getElementById(HASH.slice(1));
    if (!target) return;

    const id = ++runId;
    userMoved = false;
    revealHistory(target);
    CHECK_DELAYS.forEach((delay) => setTimeout(() => align(target, id), delay));

    if ('ResizeObserver' in window) {
      observer = new ResizeObserver(() => requestAnimationFrame(() => align(target, id)));
      observer.observe(document.body);
      observer.observe(target);
    }
    document.fonts?.ready.then(() => align(target, id));
    window.addEventListener('load', () => align(target, id), { once: true });
    stopTimer = setTimeout(stop, MAX_LIFETIME);
  }

  const cancelForUser = () => {
    if (!hasTargetHash()) return;
    userMoved = true;
    stop();
  };
  ['wheel', 'touchstart', 'pointerdown'].forEach((type) =>
    window.addEventListener(type, cancelForUser, { passive: true })
  );
  window.addEventListener('keydown', (event) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) {
      cancelForUser();
    }
  });
  window.addEventListener('hashchange', start);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();

(() => {
  'use strict';
  if (document.querySelector('script[data-home-media-reports-loader]')) return;
  const current = document.currentScript && document.currentScript.src
    ? document.currentScript.src
    : new URL('./assets/home-history-anchor-stability-20260825.js', document.baseURI).href;
  const script = document.createElement('script');
  script.src = new URL('home-media-reports-20260903.js?v=20260904-news-exclusion-1', current).href;
  script.defer = true;
  script.dataset.homeMediaReportsLoader = 'true';
  document.head.appendChild(script);
})();
