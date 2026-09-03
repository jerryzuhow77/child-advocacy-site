(() => {
  'use strict';

  const SOURCE_URL = 'https://www.nexttv.com.tw/NextTV/News/Home/Society/m/2026-09-02/2455025.html';

  function getLocale() {
    const requested = new URLSearchParams(window.location.search).get('lang');
    if (requested && requested.toLowerCase() === 'zh-hans') return 'zh-Hans';
    const declared = (document.documentElement.lang || 'zh-Hant').toLowerCase();
    if (declared.startsWith('en')) return 'en';
    if (declared.startsWith('ja')) return 'ja';
    if (declared.startsWith('zh-hans') || declared.startsWith('zh-cn')) return 'zh-Hans';
    return 'zh-Hant';
  }

  const copy = {
    'zh-Hant': {
      eyebrow: 'MEDIA REPORTS · 新聞專區',
      title: '新聞專區',
      description: '整理重要媒體報導，清楚區分報導內容、訴訟主張與法院認定。',
      date: '2026.09.02 · 壹電視',
      headline: '林心慈案首度開庭',
      summary: '從訪視紀錄與日期登載爭議出發，整理媒體報導、辯方主張及尚待法院審酌的事項。',
      source: '媒體資料來源｜壹電視 Next TV',
      action: '閱讀完整整理',
      art: '紙雕紀錄頁與象徵剴剴的陶土孩童藝術意象',
      note: '本區以摘要與來源連結呈現；原始報導文字、照片及影音之著作權屬原媒體或權利人所有。',
      article: 'news/lin-xinci-nexttv-20260902/'
    },
    'zh-Hans': {
      eyebrow: 'MEDIA REPORTS · 新闻专区',
      title: '新闻专区',
      description: '整理重要媒体报道，清楚区分报道内容、诉讼主张与法院认定。',
      date: '2026.09.02 · 壹电视',
      headline: '林心慈案首次开庭',
      summary: '从访视记录与日期登记争议出发，整理媒体报道、辩方主张及尚待法院审酌的事项。',
      source: '媒体资料来源｜壹电视 Next TV',
      action: '阅读完整整理',
      art: '纸雕记录页与象征剀剀的陶土儿童艺术意象',
      note: '本区以摘要与来源链接呈现；原始报道文字、照片及影音的著作权属于原媒体或权利人。',
      article: 'news/lin-xinci-nexttv-20260902/zh-Hans/'
    },
    en: {
      eyebrow: 'MEDIA REPORTS · NEWS DESK',
      title: 'Media Reports',
      description: 'Important reporting, with media accounts, litigation positions, and court findings kept clearly separate.',
      date: '2026.09.02 · Next TV',
      headline: 'First hearing in the Lin Hsin-tzu case',
      summary: 'A source-attributed review of the disputed visit records, the defense position, and matters still for the court to determine.',
      source: 'Media source | Next TV',
      action: 'Read the full brief',
      art: 'Paper-cut records and a clay child symbolically representing Kai-Kai',
      note: 'This section uses summaries and source links. Copyright in the original report, photographs, and video remains with the publisher or rights holders.',
      article: 'en/news/lin-xinci-nexttv-20260902/'
    },
    ja: {
      eyebrow: 'MEDIA REPORTS · ニュース特集',
      title: 'ニュース特集',
      description: '重要報道を整理し、報道内容、訴訟上の主張、裁判所の認定を明確に分けて示します。',
      date: '2026.09.02 · 壹電視',
      headline: '林心慈事件、初公判',
      summary: '訪問記録と日付記載をめぐる争点について、報道、弁護側の主張、裁判所が今後判断する事項を整理します。',
      source: '報道資料｜壹電視 Next TV',
      action: '記事整理を読む',
      art: '訪問記録の切り絵と、剴剴を象徴する粘土の子どもの芸術表現',
      note: '本欄は要約と出典リンクで構成しています。原報道の文章、写真、映像の著作権は報道機関または権利者に帰属します。',
      article: 'ja/news/lin-xinci-nexttv-20260902/'
    }
  };

  function assetRoot() {
    const script = document.currentScript && document.currentScript.src
      ? document.currentScript.src
      : new URL('assets/home-media-reports-20260903.js', document.baseURI).href;
    return {
      css: new URL('home-media-reports-20260903.css?v=20260903-1', script).href,
      site: new URL('../', script)
    };
  }

  function addStylesheet(href) {
    if (document.getElementById('home-media-reports-20260903-style')) return;
    const link = document.createElement('link');
    link.id = 'home-media-reports-20260903-style';
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function buildArt(label) {
    const art = document.createElement('div');
    art.className = 'home-media-paper-art';
    art.setAttribute('role', 'img');
    art.setAttribute('aria-label', label);
    art.innerHTML = [
      '<span class="home-media-paper-sun" aria-hidden="true"></span>',
      '<span class="home-media-paper-cloud cloud-one" aria-hidden="true"></span>',
      '<span class="home-media-paper-cloud cloud-two" aria-hidden="true"></span>',
      '<span class="home-media-paper-hill hill-back" aria-hidden="true"></span>',
      '<span class="home-media-paper-hill hill-front" aria-hidden="true"></span>',
      '<span class="home-media-record-sheet sheet-back" aria-hidden="true"><i></i><i></i><i></i></span>',
      '<span class="home-media-record-sheet sheet-front" aria-hidden="true"><i></i><i></i><i></i></span>',
      '<span class="home-media-clay-child" aria-hidden="true"><i class="head"></i><i class="hair"></i><i class="body"></i><i class="arm left"></i><i class="arm right"></i></span>',
      '<span class="home-media-paper-leaf leaf-one" aria-hidden="true"></span>',
      '<span class="home-media-paper-leaf leaf-two" aria-hidden="true"></span>'
    ].join('');
    return art;
  }

  function init() {
    if (document.getElementById('home-media-reports')) return;
    const latest = document.getElementById('news-flash');
    if (!latest) return;

    const locale = getLocale();
    const text = copy[locale] || copy['zh-Hant'];
    const roots = assetRoot();
    addStylesheet(roots.css);

    const section = document.createElement('section');
    section.id = 'home-media-reports';
    section.className = 'home-media-reports-section';
    section.setAttribute('aria-labelledby', 'homeMediaReportsTitle');

    const container = document.createElement('div');
    container.className = 'container';

    const header = document.createElement('div');
    header.className = 'home-news-stream-head home-flash-head home-media-reports-head';
    const headerCopy = document.createElement('div');
    const eyebrow = document.createElement('div');
    eyebrow.className = 'art-eyebrow dark';
    eyebrow.textContent = text.eyebrow;
    const sparkle = document.createElement('span');
    sparkle.className = 'stream-icon';
    sparkle.setAttribute('aria-hidden', 'true');
    sparkle.textContent = '✦';
    const title = document.createElement('h2');
    title.id = 'homeMediaReportsTitle';
    title.textContent = text.title;
    const description = document.createElement('p');
    description.textContent = text.description;
    headerCopy.append(eyebrow, sparkle, title, description);
    header.appendChild(headerCopy);

    const viewport = document.createElement('div');
    viewport.className = 'home-media-report-viewport';
    viewport.setAttribute('role', 'region');
    viewport.setAttribute('aria-label', text.title);
    viewport.tabIndex = 0;

    const track = document.createElement('div');
    track.className = 'home-media-report-track';
    track.setAttribute('role', 'list');

    const card = document.createElement('a');
    card.className = 'home-media-report-card';
    card.href = new URL(text.article, roots.site).href;
    card.setAttribute('role', 'listitem');
    card.appendChild(buildArt(text.art));

    const body = document.createElement('span');
    body.className = 'home-media-report-copy';
    const date = document.createElement('small');
    date.className = 'home-media-report-date';
    date.textContent = text.date;
    const headline = document.createElement('strong');
    headline.textContent = text.headline;
    const summary = document.createElement('em');
    summary.textContent = text.summary;
    const source = document.createElement('span');
    source.className = 'home-media-report-source';
    source.textContent = text.source;
    const action = document.createElement('b');
    action.className = 'home-media-report-action';
    action.textContent = text.action + ' →';
    body.append(date, headline, summary, source, action);
    card.appendChild(body);
    track.appendChild(card);
    viewport.appendChild(track);

    const note = document.createElement('p');
    note.className = 'home-media-report-note';
    note.textContent = text.note;
    const sourceLink = document.createElement('a');
    sourceLink.href = SOURCE_URL;
    sourceLink.target = '_blank';
    sourceLink.rel = 'noopener noreferrer';
    sourceLink.textContent = ' Next TV ↗';
    note.appendChild(sourceLink);

    container.append(header, viewport, note);
    section.appendChild(container);
    latest.insertAdjacentElement('afterend', section);

    if (window.location.hash === '#home-media-reports') {
      requestAnimationFrame(() => section.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      }));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();