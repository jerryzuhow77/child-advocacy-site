/* English and Japanese homepage view counter — 2026-08-11 */
(() => {
  'use strict';

  const COUNTER_NAMESPACE = 'jerryzuhow77.github.io-child-advocacy-site';
  const COUNTER_ACTION = 'view';
  const COOLDOWN_MS = 30 * 60 * 1000;
  const TIMEOUT_MS = 6500;
  const STORAGE_PREFIX = 'cpa-home-viewed-v1:';

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
      const lastViewed = Number(localStorage.getItem(`${STORAGE_PREFIX}${key}`) || 0);
      return Boolean(lastViewed && Date.now() - lastViewed < COOLDOWN_MS);
    } catch (_) {
      return false;
    }
  }

  function markViewed(key) {
    try { localStorage.setItem(`${STORAGE_PREFIX}${key}`, String(Date.now())); }
    catch (_) {}
  }

  function formatNumber(value, locale) {
    try { return new Intl.NumberFormat(locale || undefined).format(value); }
    catch (_) { return String(value); }
  }

  async function initializeCounter(widget) {
    const number = widget.querySelector('[data-home-view-number]');
    const key = widget.dataset.counterKey;
    if (!number || !key) return;

    const readOnly = hasRecentView(key);
    try {
      const value = await requestCounter(key, readOnly);
      if (!readOnly) markViewed(key);
      const formatted = formatNumber(value, widget.dataset.counterLocale);
      number.textContent = formatted;
      widget.title = `${widget.dataset.counterTitle || ''}: ${formatted} ${widget.dataset.counterUnit || ''}`.trim();
    } catch (_) {
      number.textContent = '—';
      widget.classList.add('is-unavailable');
      widget.title = widget.dataset.counterError || '';
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
