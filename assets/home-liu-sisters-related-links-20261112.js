/* Adds clearly labelled related records to the Liu Cai-xuan / Liu Ruo-lin separate-case card. */
(() => {
  const base = '/child-advocacy-site/';
  const detail = base + 'features/social-observation/three-cases-hearings-202610-11/#liu';
  const lin = base + 'hearing-records/liu-ruolin-lin-child-20260713/';
  const labels = {
    'zh-Hant': {
      heading: '延伸閱讀與庭期',
      hearing: '12/14 準備程序・查看完整庭期',
      record: '閱讀林童旁聽紀錄'
    },
    'zh-Hans': {
      heading: '延伸阅读与庭期',
      hearing: '12/14 准备程序・查看完整庭期',
      record: '阅读林童旁听记录'
    },
    en: {
      heading: 'Related record and hearing',
      hearing: '14 Dec preliminary proceeding · full schedule',
      record: 'Read Lin-child observation notes'
    },
    ja: {
      heading: '関連記録・期日',
      hearing: '12月14日 準備手続・期日一覧',
      record: '林姓児童の傍聴メモを読む'
    }
  };

  function locale() {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'zh-Hans' || q === 'zh-CN') return 'zh-Hans';
    return labels[document.documentElement.lang] ? document.documentElement.lang : 'zh-Hant';
  }

  function cardForLiuSisters() {
    return [...document.querySelectorAll('.upcoming-hearing')].find(card =>
      /劉彩萱|刘彩萱|Liu Cai-xuan/i.test(card.textContent)
    );
  }

  function render() {
    const card = cardForLiuSisters();
    if (!card) return;
    const key = locale(), text = labels[key];
    let links = card.querySelector('[data-liu-sisters-links]');
    if (!links) {
      links = document.createElement('nav');
      links.dataset.liuSistersLinks = '';
      links.setAttribute('aria-label', text.heading);
      links.innerHTML = '<span class="liu-sisters-related-title"></span><a class="liu-sisters-related-link liu-sisters-hearing"></a><a class="liu-sisters-related-link liu-sisters-record"></a>';
      card.append(links);
    }
    links.setAttribute('aria-label', text.heading);
    links.querySelector('.liu-sisters-related-title').textContent = text.heading;
    const hearing = links.querySelector('.liu-sisters-hearing');
    hearing.href = detail; hearing.textContent = text.hearing;
    const record = links.querySelector('.liu-sisters-record');
    record.href = lin + (key === 'zh-Hant' ? '' : key + '/'); record.textContent = text.record;
  }

  const style = document.createElement('style');
  style.textContent = `
    .upcoming-hearing [data-liu-sisters-links]{
      grid-column:2;display:flex;flex-wrap:wrap;gap:7px 9px;align-items:center;
      margin-top:10px;padding-top:9px;border-top:1px solid #d8cfbf
    }
    .liu-sisters-related-title{width:100%;font-size:12px;font-weight:800;letter-spacing:.05em;color:#725039}
    .liu-sisters-related-link{
      display:inline-flex;align-items:center;min-height:34px;padding:5px 9px;border-radius:7px;
      border:1px solid #829e8a;background:#f7fbf5;color:#29464b;font-size:13px;font-weight:750;
      line-height:1.35;text-decoration:none
    }
    .liu-sisters-related-link:hover{background:#e7f0e4;border-color:#577a6d}
    @media(max-width:760px){
      .upcoming-hearing [data-liu-sisters-links]{grid-column:1/-1;margin-left:77px}
      .liu-sisters-related-link{font-size:12px}
    }
  `;
  document.head.append(style);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render, {once:true});
  else render();
  new MutationObserver(render).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
})();