/* Shared Cloudflare KV view counters for homepage and feature widgets. */
(() => {
  'use strict';
  // Embedded readers are references to a chapter, not independent chapter visits.
  // Do not let an iframe increment or live-poll the shared page counter.
  if (window.top !== window.self) return;
  if (window.__cpaHomeViewCounterWorker) return;
  window.__cpaHomeViewCounterWorker = true;

  const DEFAULT_ENDPOINT = 'https://sweet-art-bed8child-advocacy-page-views.jerryzuhow77.workers.dev/views';
  const ENGAGEMENT_ENDPOINT = 'https://global-protection.jerryzuhow77.chatgpt.site/api/public/view-count';
  const CLIENT_KEY = 'cpa_engagement_client_v1';
  /*
   * IMPORTANT: homepage-all-languages-v1 is the original production KV key.
   * Keep every historical/home alias pointed at that key so redesigns,
   * language switches and newer page-home naming never reset the total.
   */
  const HOMEPAGE_CANONICAL_KEY = 'homepage-all-languages-v1';
  // 590 legacy CounterAPI views plus 17 visits collected under page-home.
  const HOMEPAGE_HISTORICAL_BASELINE = 607;
  // Chapter 2 moved to the shared two-region engagement counter after 97
  // verified Worker views. Freeze that migration baseline so it is added once.
  const CHAPTER_TWO_KEY = 'kaikai-special-chapter-02-shared';
  const CHAPTER_TWO_HISTORICAL_BASELINE = 97;
  const ARTICLE_HISTORICAL_FLOORS = Object.freeze({
    'case-xuanxuan-shared': 46,
    'feature-see-hear-after-shared': 53,
    'historical-fu-junxiang-shared': 51,
    'historical-fujian-qiqi-shared': 36,
    'historical-tian-tian-shared': 64,
    'historical-wanghao-shared': 70,
    'case-lin-xinci-missing-four-days-shared': 33,
    'historical-kurihara-mia-shared': 39
  });
  const HOMEPAGE_KEYS = new Set([
    'homepage-all-languages-v1',
    'homepage-zh-hant',
    'homepage-zh-hans',
    'homepage-en',
    'homepage-ja',
    'homepage-shared',
    'page-home'
  ]);
  const TIMEOUT_MS = 7000;
  const READ_SYNC_DELAY_MS = 1000;
  const READ_SYNC_INTERVAL_MS = 60000;
  const sharedRequests = new Map();
  const liveSyncs = new WeakMap();

  function clientId() {
    try {
      let value = localStorage.getItem(CLIENT_KEY);
      if (!value) {
        value = crypto.randomUUID();
        localStorage.setItem(CLIENT_KEY, value);
      }
      return value;
    } catch (_) {
      return '';
    }
  }

  function endpoint() {
    const config = window.CPA_VIEW_COUNTER || {};
    if (config.endpoint) return String(config.endpoint);
    if (typeof window.CPA_VIEW_COUNTER_API === 'string' && window.CPA_VIEW_COUNTER_API) {
      return window.CPA_VIEW_COUNTER_API;
    }
    const meta = document.querySelector('meta[name="cpa-view-counter-endpoint"]');
    return meta && meta.content ? meta.content : DEFAULT_ENDPOINT;
  }

  function cleanKey(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9:_./-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 120);
  }

  function localizedData(widget, field) {
    const lang = (document.documentElement.lang || 'zh-Hant').toLowerCase();
    if ((lang.startsWith('zh-hans') || lang === 'zh-cn') && widget.dataset[`${field}Hans`]) {
      return widget.dataset[`${field}Hans`];
    }
    if (lang.startsWith('zh-hant') && widget.dataset[`${field}Hant`]) {
      return widget.dataset[`${field}Hant`];
    }
    return widget.dataset[field] || widget.dataset[`${field}Hant`] || '';
  }

  function fallbackLabel() {
    const lang = (document.documentElement.lang || 'zh-Hant').toLowerCase();
    if (lang.startsWith('zh-hans') || lang === 'zh-cn') return '本设备浏览';
    if (lang.startsWith('en')) return 'Views on this device';
    if (lang.startsWith('ja')) return 'この端末での閲覧';
    return '本裝置瀏覽';
  }

  function widgetKey(widget) {
    const configured = cleanKey(localizedData(widget, 'counterKey'));
    return HOMEPAGE_KEYS.has(configured) ? HOMEPAGE_CANONICAL_KEY : configured;
  }

  function formatNumber(value, locale) {
    try { return new Intl.NumberFormat(locale || undefined).format(value); }
    catch (_) { return String(value); }
  }

  function seenKey(key) {
    return `cpa_shared_seen_${key}`;
  }

  function shouldIncrement(key) {
    try { return !sessionStorage.getItem(seenKey(key)); }
    catch (_) { return true; }
  }

  function markSeen(key) {
    try { sessionStorage.setItem(seenKey(key), '1'); }
    catch (_) {}
  }

  function localCount(key, increment) {
    const storageKey = `cpa_views_${key}`;
    let value = 0;
    try {
      value = Number.parseInt(localStorage.getItem(storageKey) || '0', 10) || 0;
      if (increment) {
        value += 1;
        localStorage.setItem(storageKey, String(value));
        markSeen(key);
      }
    } catch (_) {
      value = 1;
    }
    return value;
  }

  async function fetchCount(key, increment) {
    const base = endpoint().replace(/\/$/, '');
    const canonical = /\/api\/public\/view-count(?:$|\?)/.test(base);
    // A unique read URL prevents intermediary/CDN caches from returning a
    // previous total even when the browser requests no-store.
    const url = canonical ? base : `${base}${base.includes('?') ? '&' : '?'}page=${encodeURIComponent(key)}&increment=${increment ? '1' : '0'}&ts=${Date.now()}`;
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = window.setTimeout(() => controller && controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        method: canonical ? 'POST' : 'GET',
        mode: 'cors',
        cache: 'no-store',
        credentials: 'omit',
        headers: canonical ? { Accept: 'application/json', 'content-type': 'application/json' } : { Accept: 'application/json' },
        body: canonical ? JSON.stringify({ action: increment ? 'view' : 'read', clientId: clientId() }) : undefined,
        signal: controller ? controller.signal : undefined
      });
      if (!response.ok) throw new Error(`Counter ${response.status}`);
      const data = await response.json();
      const value = Number(data && (data.value ?? data.count));
      if (!Number.isFinite(value) || value < 0) throw new Error('Invalid counter value');
      if (increment) markSeen(key);
      return { value, shared: true };
    } finally {
      window.clearTimeout(timer);
    }
  }

  async function fetchSharedCount(key, increment) {
    if (key !== CHAPTER_TWO_KEY) return fetchCount(key, increment);
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = window.setTimeout(() => controller && controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(ENGAGEMENT_ENDPOINT, {
        method: 'POST', mode: 'cors', cache: 'no-store', credentials: 'omit',
        headers: { Accept: 'application/json', 'content-type': 'application/json' },
        body: JSON.stringify({ channel: 'official-article', articleKey: key, action: increment ? 'view' : 'read', clientId: clientId() }),
        signal: controller ? controller.signal : undefined
      });
      if (!response.ok) throw new Error(`Engagement counter ${response.status}`);
      const data = await response.json();
      const current = Number(data && data.viewCount);
      if (!Number.isFinite(current) || current < 0) throw new Error('Invalid engagement counter value');
      if (increment) markSeen(key);
      return { value: current + CHAPTER_TWO_HISTORICAL_BASELINE, shared: true };
    } finally {
      window.clearTimeout(timer);
    }
  }

  function requestCount(key) {
    if (sharedRequests.has(key)) return sharedRequests.get(key);
    const increment = shouldIncrement(key);
    const request = fetchSharedCount(key, increment)
      .catch(() => ({ value: localCount(key, increment), shared: false }));
    sharedRequests.set(key, request);
    return request;
  }

  function renderCounter(widget, result) {
    const number = widget.querySelector('[data-home-view-number]');
    const label = widget.querySelector('.home-view-counter-label');
    const unit = widget.querySelector('.home-view-counter-value span');
    if (!number) return;

    const labelCopy = localizedData(widget, 'counterLabel');
    const unitCopy = localizedData(widget, 'counterUnit');
    const titleCopy = localizedData(widget, 'counterTitle');
    const locale = localizedData(widget, 'counterLocale');
    const formatted = formatNumber(result.value, locale);

    if (label && labelCopy) label.textContent = result.shared ? labelCopy : fallbackLabel();
    if (unit && unitCopy) unit.textContent = unitCopy;
    number.textContent = formatted;
    widget.classList.toggle('is-unavailable', !result.shared);
    widget.classList.toggle('is-local-fallback', !result.shared);
    widget.title = result.shared
      ? `${titleCopy || labelCopy}: ${formatted} ${unitCopy}`.trim()
      : `${localizedData(widget, 'counterError') || fallbackLabel()}: ${formatted} ${unitCopy}`.trim();
  }

  function restoreHistoricalCount(key, current) {
    if (key === HOMEPAGE_CANONICAL_KEY) {
      return { ...current, value: current.value + HOMEPAGE_HISTORICAL_BASELINE };
    }
    const floor = ARTICLE_HISTORICAL_FLOORS[key] || 0;
    return { ...current, value: Math.max(current.value, floor) };
  }

  function startLiveSync(widget, key) {
    if (liveSyncs.has(widget)) return;
    let reading = false;

    const refresh = async () => {
      if (reading || document.visibilityState === 'hidden') return;
      reading = true;
      try {
        const current = await fetchSharedCount(key, false);
        renderCounter(widget, restoreHistoricalCount(key, current));
      } catch (_) {
        // Preserve the last confirmed shared value during a transient read failure.
      } finally {
        reading = false;
      }
    };

    const firstRead = window.setTimeout(refresh, READ_SYNC_DELAY_MS);
    const interval = window.setInterval(refresh, READ_SYNC_INTERVAL_MS);
    const onVisibility = () => { if (document.visibilityState === 'visible') refresh(); };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', refresh);
    window.addEventListener('pageshow', refresh);
    liveSyncs.set(widget, { firstRead, interval, onVisibility, refresh });
  }

  async function initializeCounter(widget) {
    const number = widget.querySelector('[data-home-view-number]');
    const label = widget.querySelector('.home-view-counter-label');
    const unit = widget.querySelector('.home-view-counter-value span');
    const key = widgetKey(widget);
    if (!number || !key) return;

    const labelCopy = localizedData(widget, 'counterLabel');
    const unitCopy = localizedData(widget, 'counterUnit');
    const errorCopy = localizedData(widget, 'counterError');

    if (label && labelCopy) label.textContent = labelCopy;
    if (unit && unitCopy) unit.textContent = unitCopy;
    widget.setAttribute('aria-busy', 'true');

    try {
      const current = await requestCount(key);
      const result = restoreHistoricalCount(key, current);
      renderCounter(widget, result);
      startLiveSync(widget, key);
    } catch (_) {
      number.textContent = '—';
      widget.classList.add('is-unavailable');
      widget.title = errorCopy;
    } finally {
      widget.setAttribute('aria-busy', 'false');
    }
  }

  function initializeAll() {
    document.querySelectorAll('[data-home-view-counter]').forEach(initializeCounter);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAll, { once: true });
  } else {
    initializeAll();
  }
  document.addEventListener('cpa-language-change', initializeAll);
})();

/* Load the Qiqi feature's four-language classical quotation layer only on
 * that case page. This remains harmless when the notes are later rendered
 * statically, because the feature script checks every data-fq-classic-key. */
(() => {
  'use strict';
  if (!/\/historical-cases\/regions\/mainland-china\/fujian-qiqi\/?$/.test(location.pathname)) return;
  if (document.querySelector('script[data-qiqi-classical-loader]')) return;
  const script = document.createElement('script');
  script.src = new URL('./qiqi-classical-notes.js?v=20260821-1', document.currentScript.src).href;
  script.async = false;
  script.dataset.qiqiClassicalLoader = '';
  document.head.appendChild(script);
})();
