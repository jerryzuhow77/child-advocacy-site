(() => {
  const isHans = () => {
    const requested = new URLSearchParams(location.search).get('lang');
    return requested === 'zh-Hans' || document.documentElement.lang === 'zh-Hans';
  };

  const setLocalizedText = (node, value) => {
    if (!node) return;
    if (!node.children.length) {
      node.textContent = value;
      return;
    }
    const firstElement = node.firstElementChild;
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) child.remove();
    });
    node.insertBefore(document.createTextNode(value + (firstElement ? ' ' : '')), firstElement || null);
  };

  const sync = () => {
    const hans = isHans();
    document.querySelectorAll('[data-chapter2-hant][data-chapter2-hans]').forEach((node) => {
      setLocalizedText(node, hans ? node.dataset.chapter2Hans : node.dataset.chapter2Hant);
    });
    document.querySelectorAll('[data-chapter2-hant-href][data-chapter2-hans-href]').forEach((node) => {
      node.setAttribute('href', hans ? node.dataset.chapter2HansHref : node.dataset.chapter2HantHref);
    });
    document.querySelectorAll('[data-chapter2-hant-src][data-chapter2-hans-src]').forEach((node) => {
      node.setAttribute('src', hans ? node.dataset.chapter2HansSrc : node.dataset.chapter2HantSrc);
    });
    document.querySelectorAll('[data-chapter2-hant-alt][data-chapter2-hans-alt]').forEach((node) => {
      node.setAttribute('alt', hans ? node.dataset.chapter2HansAlt : node.dataset.chapter2HantAlt);
    });
    document.querySelectorAll('[data-chapter2-hant-aria-label][data-chapter2-hans-aria-label]').forEach((node) => {
      node.setAttribute('aria-label', hans ? node.dataset.chapter2HansAriaLabel : node.dataset.chapter2HantAriaLabel);
    });
    document.querySelectorAll('[data-chapter2-hant-title][data-chapter2-hans-title]').forEach((node) => {
      node.setAttribute('title', hans ? node.dataset.chapter2HansTitle : node.dataset.chapter2HantTitle);
    });
  };

  const schedule = () => {
    sync();
    requestAnimationFrame(sync);
    window.setTimeout(sync, 120);
    window.setTimeout(sync, 420);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, { once: true });
  } else {
    schedule();
  }
  window.addEventListener('pageshow', schedule);
  window.addEventListener('popstate', schedule);
  new MutationObserver((records) => {
    if (records.some((record) => record.attributeName === 'lang')) schedule();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
