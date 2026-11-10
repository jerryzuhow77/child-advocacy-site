/* July 13 Lin-child hearing: localized pinned entry, shared by both site mirrors. */
(() => {
  const root = '/child-advocacy-site/';
  const article = root + 'hearing-records/liu-ruolin-lin-child-20260713/';
  const image = root + 'assets/art/liu-ruolin-lin-child-20260713-hero.jpg';
  const copy = {
    'zh-Hant': ['旁聽紀錄・2026.07.13','劉若琳涉虐童另案｜林童旁聽筆記','證人陳述與待查事項分開記錄；不代表法院認定。','現代水墨紙藝主視覺'],
    'zh-Hans': ['旁听记录・2026.07.13','刘若琳涉虐童另案｜林童旁听笔记','证人陈述与待查事项分开记录；不代表法院认定。','现代水墨纸艺主视觉'],
    en: ['Court observation · 2026.07.13','Liu Ruo-lin separate case | Lin-child observation notes','Witness accounts and unresolved issues, distinguished from court findings.','Modern ink-wash paper-art illustration'],
    ja: ['法廷傍聴・2026.07.13','劉若琳の別件事件｜林姓児童の傍聴メモ','証人の陳述と未確認事項を区別。裁判所の認定ではありません。','現代水墨・ペーパーアートのイメージ']
  };
  let last = '';
  function render() {
    const lang = document.documentElement.lang;
    const query = new URLSearchParams(location.search).get('lang');
    const key = query === 'zh-Hans' || query === 'zh-CN' ? 'zh-Hans' : copy[lang] ? lang : 'zh-Hant';
    const track = document.querySelector('#news-flash .home-pinned-reports-track') || document.querySelector('.home-pinned-reports-track');
    if (!track) return;
    let card = document.getElementById('liu-ruolin-lin-child-pinned');
    if (card && key === last) return;
    const fresh = !card;
    if (fresh) {
      card = document.createElement('a');
      card.id = 'liu-ruolin-lin-child-pinned';
      card.className = 'home-pinned-report-card is-latest-report';
    }
    last = key;
    const words = copy[key];
    card.href = article + (key === 'zh-Hant' ? '' : key + '/');
    card.hreflang = key;
    card.replaceChildren();
    const img = document.createElement('img');
    img.src = image; img.alt = words[3]; img.loading = 'eager'; img.decoding = 'async';
    const span = document.createElement('span');
    ['small','strong','em'].forEach((tag,i) => {const el = document.createElement(tag);el.textContent = words[i];span.append(el);});
    card.append(img, span);
    if (fresh) track.prepend(card);
    if (fresh && window.gsap && !matchMedia('(prefers-reduced-motion:reduce)').matches)
      gsap.fromTo(card,{opacity:0,y:20,rotate:-.35},{opacity:1,y:0,rotate:0,duration:.65,ease:'power3.out'});
  }
  const start = () => {render();new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});};
  document.readyState === 'loading' ? addEventListener('DOMContentLoaded', start, {once:true}) : start();
})();
