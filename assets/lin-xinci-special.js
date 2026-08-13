(() => {
  'use strict';
  document.documentElement.classList.add('lx-js');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.querySelector('.lx-scroll-progress');
  const hero = document.querySelector('.lx-visual');

  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`;
  };
  addEventListener('scroll', updateProgress, { passive: true });
  addEventListener('resize', updateProgress, { passive: true });
  updateProgress();

  const revealItems = document.querySelectorAll('.lx-reveal,.lx-ledger-row');
  if ('IntersectionObserver' in window && !reduced) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }), { threshold: .14, rootMargin: '0px 0px -6% 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  if (hero && !reduced && matchMedia('(pointer:fine)').matches) {
    hero.addEventListener('pointermove', event => {
      const box = hero.getBoundingClientRect();
      const x = ((event.clientX - box.left) / box.width - .5) * 10;
      const y = ((event.clientY - box.top) / box.height - .5) * 10;
      hero.style.setProperty('--lx-shift-x', `${x}px`);
      hero.style.setProperty('--lx-shift-y', `${y}px`);
    });
    hero.addEventListener('pointerleave', () => {
      hero.style.setProperty('--lx-shift-x', '0px');
      hero.style.setProperty('--lx-shift-y', '0px');
    });
  }

  document.querySelectorAll('[data-copy-ad]').forEach(button => {
    button.addEventListener('click', async () => {
      const source = document.querySelector(button.dataset.copyAd);
      if (!source) return;
      try {
        await navigator.clipboard.writeText(source.innerText.trim());
        button.classList.add('is-copied');
        setTimeout(() => button.classList.remove('is-copied'), 1800);
      } catch (_) {
        const range = document.createRange();
        range.selectNodeContents(source);
        const selection = getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });
  });

  const counter = document.querySelector('[data-lx-counter]');
  if (!counter) return;
  const number = counter.querySelector('[data-lx-count]');
  const key = 'case-lin-xinci-missing-four-days-shared';
  const namespace = 'jerryzuhow77.github.io-child-advocacy-site';
  const storageKey = `cpa-lx-viewed-v1:${key}`;
  const endpoint = `https://counterapi.com/api/${namespace}/view/${key}`;
  let recent = false;
  try { recent = Date.now() - Number(localStorage.getItem(storageKey) || 0) < 30 * 60 * 1000; } catch (_) {}
  const url = recent ? `${endpoint}?readOnly=true` : endpoint;
  const format = value => new Intl.NumberFormat(document.documentElement.lang || undefined).format(value);
  const jsonp = requestUrl => new Promise((resolve, reject) => {
    const callback = `__lxCounter_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement('script');
    const separator = requestUrl.includes('?') ? '&' : '?';
    const timer = setTimeout(() => { cleanup(); reject(new Error('counter timeout')); }, 6500);
    const cleanup = () => {
      clearTimeout(timer);
      try { delete window[callback]; } catch (_) { window[callback] = undefined; }
      script.remove();
    };
    window[callback] = data => { cleanup(); resolve(data); };
    script.onerror = () => { cleanup(); reject(new Error('counter jsonp')); };
    script.src = `${requestUrl}${separator}callback=${encodeURIComponent(callback)}`;
    document.head.appendChild(script);
  });
  const request = () => fetch(url, { cache: 'no-store', mode: 'cors', credentials: 'omit' })
    .then(response => { if (!response.ok) throw new Error('counter'); return response.json(); })
    .catch(() => jsonp(url));
  request()
    .then(data => {
      const value = Number(data && data.value);
      if (!Number.isFinite(value)) throw new Error('counter');
      number.textContent = format(value);
      if (!recent) try { localStorage.setItem(storageKey, String(Date.now())); } catch (_) {}
      counter.setAttribute('aria-busy', 'false');
    })
    .catch(() => {
      number.textContent = '—';
      counter.classList.add('is-error');
      counter.setAttribute('aria-busy', 'false');
    });
})();
