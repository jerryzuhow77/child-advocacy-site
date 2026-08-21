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

    const restraintCaution = {
      zh: {
        meta: '高度待核 · 須先確認是否為同一綑綁事件',
        text: '先確認「傳照片才知道」是否指另一場次的綑綁；只有在問題同指11月2日事件時，才構成明顯前後不一。'
      },
      en: {
        meta: 'High-priority check · Confirm that both answers concern the same restraint incident',
        text: 'First determine whether “learned from photographs” referred to a different restraint episode. A clear internal conflict arises only if both answers concern 2 November.'
      },
      ja: {
        meta: '重点確認 · 同一の拘束事件を指すか確認が必要',
        text: '「写真を送って初めて知った」が別の拘束場面を指すかを先に確認する必要があります。双方が11月2日の出来事を指す場合に限り、明確な前後不一致となります。'
      }
    }[locale];

    const style = document.createElement('style');
    style.id = 'day4-contrast-style';
    style.textContent = `${extract('css')}

/* 2026-08-21: visibly soften the verification-note strip. This override lives here
   because the cross-check stylesheet is injected after day4.css. */
body.day4-page .day4-contrast-card > footer {
  background: linear-gradient(90deg, rgba(255,255,255,.98), rgba(250,248,245,.82)) !important;
  border-color: rgba(16,43,58,.065) !important;
  box-shadow: none !important;
}
body.day4-page .day4-contrast-card > footer > b {
  color: #7a6b64 !important;
}
`;
    document.head.append(style);

    const template = document.createElement('template');
    template.innerHTML = extract(locale).trim();
    const section = template.content.firstElementChild;
    const jurors = document.getElementById('jurors');
    if (!section || !jurors) throw new Error('Cross-check insertion point not found');

    const restraintCard = section.querySelectorAll('.day4-contrast-card')[4];
    if (restraintCard) {
      const meta = restraintCard.querySelector('header small');
      const note = restraintCard.querySelector('footer p');
      if (meta) meta.textContent = restraintCaution.meta;
      if (note) note.textContent = restraintCaution.text;
    }

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