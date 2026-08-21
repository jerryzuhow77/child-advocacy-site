/* Four-language homepage view counter — shared cumulative total, 2026-08-16 */
(() => {
  'use strict';

  const COUNTER_NAMESPACE = 'jerryzuhow77.github.io-child-advocacy-site';
  const COUNTER_ACTION = 'view';
  const SHARED_COUNTER_KEY = 'homepage-all-languages-v1';
  const LEGACY_COUNTER_KEYS = Object.freeze([
    'homepage-zh-hant',
    'homepage-zh-hans',
    'homepage-en',
    'homepage-ja',
    'homepage-shared'
  ]);
  const COOLDOWN_MS = 30 * 60 * 1000;
  const TIMEOUT_MS = 6500;
  const STORAGE_PREFIX = 'cpa-home-viewed-v1:';
  const HOMEPAGE_STORAGE_PREFIX = 'cpa-home-viewed-v3:';
  const TOTAL_FLOOR_KEY = 'cpa-home-total-floor-v3';

  function counterUrl(key, readOnly, callbackName = '') {
    const base = `https://counterapi.com/api/${encodeURIComponent(COUNTER_NAMESPACE)}/${encodeURIComponent(COUNTER_ACTION)}/${encodeURIComponent(key)}`;
    const params = new URLSearchParams();
    if (readOnly) params.set('readOnly', 'true');
    if (callbackName) params.set('callback', callbackName);
    const query = params.toString();
    return query ? `${base}?${query}` : base;
  }

  function parseValue(data) {
    const value = Number(data && data.value);
    if (!Number.isFinite(value) || value < 0) throw new Error('Invalid counter value');
    return value;
  }

  async function fetchCounter(key, readOnly) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(counterUrl(key, readOnly), {
        method: 'GET',
        mode: 'cors',
        cache: 'no-store',
        credentials: 'omit',
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`Counter ${response.status}`);
      return parseValue(await response.json());
    } finally {
      window.clearTimeout(timer);
    }
  }

  function jsonpCounter(key, readOnly) {
    return new Promise((resolve, reject) => {
      const callbackName = `__cpaHomeCounter_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const script = document.createElement('script');
      let timer;
      const cleanup = () => {
        window.clearTimeout(timer);
        try { delete window[callbackName]; } catch (_) { window[callbackName] = undefined; }
        script.remove();
      };

      window[callbackName] = data => {
        try {
          const value = parseValue(data);
          cleanup();
          resolve(value);
        } catch (error) {
          cleanup();
          reject(error);
        }
      };
      script.async = true;
      script.src = counterUrl(key, readOnly, callbackName);
      script.onerror = () => {
        cleanup();
        reject(new Error('Counter JSONP failed'));
      };
      timer = window.setTimeout(() => {
        cleanup();
        reject(new Error('Counter JSONP timed out'));
      }, TIMEOUT_MS);
      document.head.appendChild(script);
    });
  }

  async function requestCounter(key, readOnly) {
    try {
      return await fetchCounter(key, readOnly);
    } catch (_) {
      return jsonpCounter(key, readOnly);
    }
  }

  function hasRecentView(key) {
    try {
      const prefix = key === SHARED_COUNTER_KEY ? HOMEPAGE_STORAGE_PREFIX : STORAGE_PREFIX;
      const lastViewed = Number(localStorage.getItem(`${prefix}${key}`) || 0);
      return Boolean(lastViewed && Date.now() - lastViewed < COOLDOWN_MS);
    } catch (_) {
      return false;
    }
  }

  function markViewed(key) {
    const prefix = key === SHARED_COUNTER_KEY ? HOMEPAGE_STORAGE_PREFIX : STORAGE_PREFIX;
    try { localStorage.setItem(`${prefix}${key}`, String(Date.now())); }
    catch (_) {}
  }

  function storedTotalFloor() {
    try {
      const value = Number(localStorage.getItem(TOTAL_FLOOR_KEY) || 0);
      return Number.isFinite(value) && value >= 0 ? value : 0;
    } catch (_) {
      return 0;
    }
  }

  function rememberTotalFloor(value) {
    try {
      if (value > storedTotalFloor()) localStorage.setItem(TOTAL_FLOOR_KEY, String(value));
    } catch (_) {}
  }

  async function legacyTotal() {
    const values = await Promise.all(
      LEGACY_COUNTER_KEYS.map(key => requestCounter(key, true))
    );
    return values.reduce((sum, value) => sum + value, 0);
  }

  function formatNumber(value, locale) {
    try { return new Intl.NumberFormat(locale || undefined).format(value); }
    catch (_) { return String(value); }
  }

  function localizedData(widget, field) {
    const lang = document.documentElement.lang;
    if (lang === 'zh-Hans' && widget.dataset[`${field}Hans`]) return widget.dataset[`${field}Hans`];
    if (lang === 'zh-Hant' && widget.dataset[`${field}Hant`]) return widget.dataset[`${field}Hant`];
    return widget.dataset[field] || '';
  }

  async function initializeCounter(widget) {
    const number = widget.querySelector('[data-home-view-number]');
    const label = widget.querySelector('.home-view-counter-label');
    const unit = widget.querySelector('.home-view-counter-value span');
    const configuredKey = localizedData(widget, 'counterKey');
    if (!number || !configuredKey) return;

    const labelCopy = localizedData(widget, 'counterLabel');
    const unitCopy = localizedData(widget, 'counterUnit');
    const titleCopy = localizedData(widget, 'counterTitle');
    const errorCopy = localizedData(widget, 'counterError');
    const locale = localizedData(widget, 'counterLocale');
    if (label && labelCopy) label.textContent = labelCopy;
    if (unit && unitCopy) unit.textContent = unitCopy;

    const isHomepageTotal = configuredKey === SHARED_COUNTER_KEY || LEGACY_COUNTER_KEYS.includes(configuredKey);
    const counterKey = isHomepageTotal ? SHARED_COUNTER_KEY : configuredKey;
    const readOnly = hasRecentView(counterKey);
    try {
      let value;
      if (isHomepageTotal) {
        const sharedValue = await requestCounter(SHARED_COUNTER_KEY, readOnly);
        if (!readOnly) markViewed(SHARED_COUNTER_KEY);
        const previousLanguageTotals = await legacyTotal();

        // Preserve every count collected before the language counters were
        // unified. The local floor also prevents a temporary provider rollback
        // from making the number visibly decrease in a returning browser.
        const combinedValue = previousLanguageTotals + sharedValue;
        value = Math.max(combinedValue, storedTotalFloor());
        rememberTotalFloor(value);
      } else {
        value = await requestCounter(counterKey, readOnly);
        if (!readOnly) markViewed(counterKey);
      }
      const formatted = formatNumber(value, locale);
      number.textContent = formatted;
      widget.title = `${titleCopy}: ${formatted} ${unitCopy}`.trim();
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
