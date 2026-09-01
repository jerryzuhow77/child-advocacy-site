(() => {
  'use strict';

  const $ = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initOpening() {
    const opening = $('[data-km-opening]');
    if (!opening || reducedMotion) return;
    const lines = $$('.km-opening-line', opening);
    const stepButtons = $$('[data-km-step]', opening);
    const skipButtons = $$('[data-km-close]', opening);
    const replay = $('[data-km-replay]');
    let index = 0;
    let timer = 0;
    let closeTimer = 0;

    const show = next => {
      index = Math.max(0, Math.min(lines.length - 1, next));
      lines.forEach((line, i) => {
        line.classList.toggle('is-active', i === index);
        line.setAttribute('aria-hidden', i === index ? 'false' : 'true');
      });
      stepButtons.forEach((button, i) => {
        button.classList.toggle('is-active', i === index);
        if (i === index) button.setAttribute('aria-current', 'step');
        else button.removeAttribute('aria-current');
      });
    };

    const stop = () => {
      window.clearInterval(timer);
      window.clearTimeout(closeTimer);
    };

    const close = () => {
      stop();
      opening.classList.add('is-gone');
      document.body.classList.remove('km-opening-active');
      opening.setAttribute('aria-hidden', 'true');
    };

    const play = () => {
      stop();
      index = 0;
      show(0);
      opening.classList.remove('is-gone');
      opening.setAttribute('aria-hidden', 'false');
      document.body.classList.add('km-opening-active');
      timer = window.setInterval(() => {
        if (index < lines.length - 1) show(index + 1);
        else {
          window.clearInterval(timer);
          closeTimer = window.setTimeout(close, 3700);
        }
      }, 3400);
    };

    stepButtons.forEach((button, i) => button.addEventListener('click', () => {
      stop();
      show(i);
      closeTimer = window.setTimeout(close, 4500);
    }));
    skipButtons.forEach(button => button.addEventListener('click', close));
    if (replay) replay.addEventListener('click', play);
    play();
  }

  function initReadingEffects() {
    const progress = $('.km-reading-progress i');
    const art = $('.km-hero-art img');
    let ticking = false;
    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (progress) progress.style.width = Math.min(100, Math.max(0, window.scrollY / max * 100)) + '%';
      if (art && !reducedMotion && window.scrollY < window.innerHeight * 1.4) {
        art.style.transform = 'scale(' + (1 + Math.min(0.006, window.scrollY * 0.000008)) + ')';
      }
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    update();

    $$('[data-km-fifty]').forEach(calendar => {
      if (!calendar.children.length) calendar.innerHTML = '<i></i>'.repeat(50);
    });

    const targets = $$('.km-section');
    if (reducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach(target => target.classList.add('is-seen'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-seen');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14 });
    targets.forEach(target => observer.observe(target));
  }

  function initSharedCounter() {
    const badge = $('[data-km-view-counter]');
    const number = $('[data-km-view-number]');
    if (!badge || !number) return;
    if (window.__cpaFourLanguageToolbar) {
      badge.remove();
      return;
    }

    const namespace = 'jerryzuhow77.github.io-child-advocacy-site';
    const key = 'historical-kurihara-mia-shared';
    const cooldownKey = 'cpa-viewed-v2:' + key;
    const endpoint = 'https://counterapi.com/api/' + encodeURIComponent(namespace) + '/view/' + encodeURIComponent(key);
    const cooldown = 30 * 60 * 1000;

    const recent = () => {
      try {
        const last = Number(localStorage.getItem(cooldownKey) || 0);
        return Boolean(last && Date.now() - last < cooldown);
      } catch (_) {
        return false;
      }
    };
    const mark = () => {
      try { localStorage.setItem(cooldownKey, String(Date.now())); } catch (_) {}
    };
    const parse = data => {
      const value = Number(data && data.value);
      if (!Number.isFinite(value) || value < 0) throw new Error('invalid counter');
      return value;
    };
    const jsonp = readOnly => new Promise((resolve, reject) => {
      const callback = '__kmCounter_' + Date.now() + '_' + Math.random().toString(36).slice(2);
      const script = document.createElement('script');
      const timeout = window.setTimeout(() => {
        cleanup();
        reject(new Error('counter timeout'));
      }, 6500);
      const cleanup = () => {
        window.clearTimeout(timeout);
        try { delete window[callback]; } catch (_) { window[callback] = undefined; }
        script.remove();
      };
      window[callback] = data => {
        try {
          const value = parse(data);
          cleanup();
          resolve(value);
        } catch (error) {
          cleanup();
          reject(error);
        }
      };
      const params = new URLSearchParams();
      if (readOnly) params.set('readOnly', 'true');
      params.set('callback', callback);
      script.src = endpoint + '?' + params.toString();
      script.onerror = () => {
        cleanup();
        reject(new Error('counter unavailable'));
      };
      document.head.appendChild(script);
    });
    const request = async readOnly => {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 6500);
      try {
        const url = readOnly ? endpoint + '?readOnly=true' : endpoint;
        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-store',
          credentials: 'omit',
          signal: controller.signal
        });
        if (!response.ok) throw new Error('counter ' + response.status);
        return parse(await response.json());
      } catch (_) {
        return jsonp(readOnly);
      } finally {
        window.clearTimeout(timeout);
      }
    };

    const readOnly = recent();
    request(readOnly).then(value => {
      if (!readOnly) mark();
      const lang = document.documentElement.lang;
      const locale = lang === 'en' ? 'en-US' : lang === 'ja' ? 'ja-JP' : lang === 'zh-Hans' ? 'zh-CN' : 'zh-TW';
      number.textContent = new Intl.NumberFormat(locale).format(value);
      badge.hidden = false;
    }).catch(() => {
      badge.hidden = true;
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initOpening();
    initReadingEffects();
    initSharedCounter();
  });
})();
