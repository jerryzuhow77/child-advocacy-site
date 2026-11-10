(() => {
  'use strict';
  const root = '/child-advocacy-site/';
  const route = 'hearing-records/liu-ruolin-lin-child-20260713/';
  const copy = {
    'zh-Hant': ['旁聽紀錄・2026.07.13', '劉若琳涉虐童另案｜林童旁聽筆記', '證人陳述、辯方主張與旁聽整理分開閱讀；不代表法院認定。'],
    'zh-Hans': ['旁听记录・2026.07.13', '刘若琳涉虐童另案｜林童旁听笔记', '区分证人陈述、辩方主张与旁听整理；不代表法院认定。'],
    en: ['Court observation · 2026.07.13', 'Liu Ruolin separate case | Notes concerning the Lin child', 'Witness accounts, defence submissions and observers’ analysis; not court findings.'],
    ja: ['傍聴記録・2026.07.13', '劉若琳の別件｜林姓児童の傍聴記録', '証人の供述、弁護側の主張、傍聴整理を区別。裁判所の認定ではありません。']
  };
  function mount() {
    const track = document.querySelector('#news-flash .home-pinned-reports-track') || document.querySelector('.home-pinned-reports-track');
    if (!track) return;
    const declared = document.documentElement.lang;
    const query = new URLSearchParams(location.search).get('lang');
    const lang = copy[query] ? query : (copy[declared] ? declared : 'zh-Hant');
    let card = document.getElementById('liu-ruolin-lin-child-pinned');
    if (!card) {
      card = document.createElement('a');
      card.id = 'liu-ruolin-lin-child-pinned';
      card.className = 'home-pinned-report-card is-latest-report';
      card.innerHTML = '<img loading="eager" decoding="async" width="1536" height="1024"><span><small></small><strong></strong><em></em></span>';
      track.prepend(card);
      if (window.gsap && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
        gsap.fromTo(card, {opacity: 0, y: 20}, {opacity: 1, y: 0, duration: .65, ease: 'power3.out'});
      }
    }
    card.href = root + route + (lang === 'zh-Hant' ? '' : lang + '/');
    const img = card.querySelector('img');
    img.src = root + 'assets/art/liu-ruolin-lin-child-20260713-hero.jpg';
    img.alt = '';
    ['small', 'strong', 'em'].forEach((tag, i) => {card.querySelector(tag).textContent = copy[lang][i];});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, {once: true});
  else mount();
  // The Hong Kong homepage may apply its locale after DOMContentLoaded.
  new MutationObserver(mount).observe(document.documentElement, {attributes: true, attributeFilter: ['lang']});
})();
