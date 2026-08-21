(() => {
  'use strict';

  window.day4CrosscheckReady = (async () => {
    if (!document.body.classList.contains('day4-page') || document.getElementById('contradictions')) return;

    const current = document.currentScript;
    const base = current ? new URL('./', current.src) : new URL('./', location.href);
    const sourceUrl = new URL('../../../assets/day4-crosscheck-source.txt?v=20260821-1', base);
    const raw = await fetch(sourceUrl, { cache: 'no-cache' }).then(response => {
      if (!response.ok) throw new Error(`Cross-check source HTTP ${response.status}`);
      return response.text();
    });

    const extract = name => {
      const marker = `${name} = r'''`;
      const start = raw.indexOf(marker);
      if (start < 0) throw new Error(`Missing ${name} block`);
      const contentStart = start + marker.length;
      const end = raw.indexOf("'''", contentStart);
      if (end < 0) throw new Error(`Unclosed ${name} block`);
      return raw.slice(contentStart, end);
    };

    const locale = document.documentElement.lang === 'ja' ? 'ja' : document.documentElement.lang === 'en' ? 'en' : 'zh';
    const labels = {
      zh: { nav: '證詞矛盾', toc: '05A 證詞對照' },
      en: { nav: 'Testimony conflicts', toc: '05A Cross-check' },
      ja: { nav: '供述の食い違い', toc: '05A 供述照合' }
    }[locale];

    const style = document.createElement('style');
    style.id = 'day4-contrast-style';
    style.textContent = extract('css');
    document.head.append(style);

    const template = document.createElement('template');
    template.innerHTML = extract(locale).trim();
    const section = template.content.firstElementChild;
    const jurors = document.getElementById('jurors');
    if (!section || !jurors) throw new Error('Cross-check insertion point not found');
    jurors.before(section);

    const topTarget = document.querySelector('.day3-topbar nav a[href="#jurors"]');
    if (topTarget && !document.querySelector('.day3-topbar nav a[href="#contradictions"]')) {
      const link = document.createElement('a');
      link.href = '#contradictions';
      link.textContent = labels.nav;
      topTarget.before(link);
    }

    const tocTarget = document.querySelector('.day3-toc a[href="#jurors"]');
    if (tocTarget && !document.querySelector('.day3-toc a[href="#contradictions"]')) {
      const link = document.createElement('a');
      link.href = '#contradictions';
      link.textContent = labels.toc;
      tocTarget.before(link);
    }

    const simplified = locale === 'zh' && (new URLSearchParams(location.search).get('lang') === 'zh-Hans' || localStorage.getItem('siteLang') === 'zh-Hans');
    if (simplified && typeof window.setLang === 'function') window.setLang('zh-Hans');
    if (location.hash === '#contradictions') requestAnimationFrame(() => section.scrollIntoView({ block: 'start' }));
  })().catch(error => {
    console.error('Day 4 testimony cross-check failed', error);
  });
})();
