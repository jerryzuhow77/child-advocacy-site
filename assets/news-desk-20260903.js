(() => {
  'use strict';

  const ROOT = '/child-advocacy-site/';
  const reports = {
    oversight: { date: '2026-09-04', priority: 1, publisher: { 'zh-Hant':'立法院專題研究','zh-Hans':'台湾立法机构研究',en:'Taiwan Legislative Yuan study',ja:'台湾・立法院調査' }, title: { 'zh-Hant':'通報增加六成，安全網真的更安全了嗎？','zh-Hans':'通报增加六成，安全网真的更安全吗？',en:'Reports rose 60%. Is the safety net safer?',ja:'通報が6割増えて、安全網は強くなったのか' }, summary: { 'zh-Hant':'從通報量、預算、法醫鑑驗到司法及早介入，追問兒少保護不能只計算入口，更要公開處理速度與安全結果。','zh-Hans':'从通报量、预算、法医鉴定到司法及早介入，追问儿童保护不能只计算入口，更要公开处理速度与安全结果。',en:'A closer look at reporting volume, budgets, forensic capacity and early judicial intervention—and the outcome data still missing.',ja:'通報件数、予算、法医学、司法の早期関与を一体で検証し、処理速度と安全結果の公開を求めます。' }, article:`${ROOT}news/child-protection-oversight-202608/`, source:'https://www.ly.gov.tw/Pages/List.aspx?nodeid=56705', image:`${ROOT}assets/images/child-protection-oversight-paper-clay-20260904.webp`, alt:{'zh-Hant':'陶土孩子、守護之手、法院與紙雕安全網意象','zh-Hans':'陶土儿童、守护之手、法院与纸雕安全网意象',en:'Clay child, protective hands, courthouse and layered paper safety net',ja:'粘土の子ども、守る手、裁判所と紙彫刻の安全網'} },
    reporting: { date: '2026-09-04', priority: 2, publisher: { 'zh-Hant':'衛福部書面報告','zh-Hans':'台湾卫福部门书面报告',en:'Taiwan MOHW report',ja:'台湾・衛生福利部報告' }, title: { 'zh-Hant':'十三萬件通報之後，安全措施落實了多少？','zh-Hans':'十三万件通报之后，安全措施落实了多少？',en:'After 130,000 reports, what was actually implemented?',ja:'13万件の通報後、安全措置はどこまで実行されたか' }, summary: { 'zh-Hant':'檢視 24 小時責任通報、不預約訪視、證據保全與跨部會合作，並提出六組應公開的執行數據。','zh-Hans':'检视24小时责任通报、不预约访视、证据保全与跨部门合作，并提出六组应公开的执行数据。',en:'Six accountability datasets for mandatory reporting, unannounced visits, evidence preservation and inter-agency work.',ja:'24時間以内の義務通報、抜き打ち訪問、証拠保全、部門間連携について、公開すべき六つの実績指標を提示します。' }, article:`${ROOT}news/mandatory-reporting-visits-20260730/`, source:'https://www.mohw.gov.tw/dl-101863-ab884f32-81dd-4a19-82f2-3ccab843eb94.html', image:`${ROOT}assets/images/mandatory-reporting-visits-paper-clay-20260904.webp`, alt:{'zh-Hant':'訪視員、托育門口與教育醫療警政社福連結的紙雕陶土意象','zh-Hans':'访视员、托育门口与教育医疗警政社福连接的纸雕陶土意象',en:'Paper-and-clay scene linking a childcare visit with education, health, police and social services',ja:'保育訪問と教育・医療・警察・福祉を結ぶ紙彫刻と粘土の情景'} },
    lin: { date:'2026-09-02', priority:3, publisher:{'zh-Hant':'壹電視','zh-Hans':'壹电视',en:'Next TV',ja:'壹電視'}, title:{'zh-Hant':'林心慈案首度開庭','zh-Hans':'林心慈案首次开庭',en:'First hearing in the Lin Hsin-tzu case',ja:'林心慈事件、初公判'}, summary:{'zh-Hant':'從訪視紀錄與日期登載爭議出發，整理媒體報導、檢方指控、辯方主張與尚待法院審酌的事項。','zh-Hans':'从访视记录与日期登记争议出发，整理媒体报道、检方指控、辩方主张及尚待法院审酌的事项。',en:'A source-attributed review of the disputed visit records, the prosecution account, the defense position, and matters still for the court.',ja:'訪問記録と日付記載をめぐる争点について、報道、検察側の説明、弁護側の主張を整理します。'}, article:{'zh-Hant':`${ROOT}news/lin-xinci-nexttv-20260902/`,'zh-Hans':`${ROOT}news/lin-xinci-nexttv-20260902/zh-Hans/`,en:`${ROOT}en/news/lin-xinci-nexttv-20260902/`,ja:`${ROOT}ja/news/lin-xinci-nexttv-20260902/`}, source:'https://www.nexttv.com.tw/NextTV/News/Home/Society/m/2026-09-02/2455025.html', image:`${ROOT}assets/images/lin-xinci-inkwash-hero-20260903.png`, alt:{'zh-Hant':'中國傳統水墨山景與訪視紀錄意象','zh-Hans':'中国传统水墨山景与访视记录意象',en:'Traditional Chinese ink-wash landscape and visit-record imagery',ja:'中国伝統水墨の山景と訪問記録のイメージ'} }
  };

  const localeCopy = {
    'zh-Hant': {
      source: '原始資料',
      read: '閱讀本站整理',
      original: '原始報導',
      unavailable: '圖片暫時無法載入。', items: Object.values(reports)
    },
    'zh-Hans': {
      source: '原始资料',
      read: '阅读本站整理',
      original: '原始报道',
      unavailable: '图片暂时无法载入。', items: Object.values(reports)
    },
    en: {
      source: 'Original source',
      read: 'Read our brief',
      original: 'Original report',
      unavailable: 'The image is temporarily unavailable.', items: Object.values(reports)
    },
    ja: {
      source: '原資料',
      read: '本サイトの整理を読む',
      original: '元の報道',
      unavailable: '画像を読み込めません。', items: Object.values(reports)
    }
  };

  function locale() {
    const declared = (document.documentElement.lang || 'zh-Hant').toLowerCase();
    if (declared.startsWith('zh-hans') || declared.startsWith('zh-cn')) return 'zh-Hans';
    if (declared.startsWith('en')) return 'en';
    if (declared.startsWith('ja')) return 'ja';
    return 'zh-Hant';
  }

  function formatDate(value, language) {
    const tag = language === 'zh-Hant' ? 'zh-TW' : language === 'zh-Hans' ? 'zh-CN' : language;
    try {
      return new Intl.DateTimeFormat(tag, { year: 'numeric', month: '2-digit', day: '2-digit' })
        .format(new Date(`${value}T12:00:00+08:00`));
    } catch (_) {
      return value.replaceAll('-', '.');
    }
  }

  function makeLink(className, href, text, external = false) {
    const link = document.createElement('a');
    link.className = className;
    link.href = href;
    link.textContent = text;
    if (external) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    return link;
  }

  function renderCard(item, words, language, index) {
    const article = document.createElement('article');
    article.className = 'news-card';
    article.dataset.date = item.date;
    article.style.setProperty('--news-order', String(index + 1));

    const figure = document.createElement('figure');
    figure.className = 'news-card-media';
    const photo = document.createElement('img');
    photo.src = item.image;
    photo.alt = item.alt[language];
    photo.loading = index === 0 ? 'eager' : 'lazy';
    photo.decoding = 'async';
    const credit = document.createElement('figcaption');
    credit.className = 'news-photo-credit';
    credit.textContent = language === 'zh-Hant' ? '紙雕與陶土藝術意象，非事件現場' : language === 'zh-Hans' ? '纸雕与陶土艺术意象，非事件现场' : language === 'ja' ? '紙彫刻と粘土のイメージ（現場写真ではありません）' : 'Paper-and-clay artwork; not an event photograph';
    photo.addEventListener('error', () => {
      photo.hidden = true;
      figure.classList.add('is-photo-unavailable');
      credit.textContent = words.unavailable;
    }, { once: true });
    figure.append(photo, credit);

    const body = document.createElement('div');
    body.className = 'news-card-body';
    const meta = document.createElement('div');
    meta.className = 'news-card-meta';
    const time = document.createElement('time');
    time.dateTime = item.date;
    time.textContent = formatDate(item.date, language);
    const publisher = document.createElement('span');
    publisher.textContent = item.publisher[language];
    meta.append(time, publisher);

    const title = document.createElement('h3');
    const articleUrl = typeof item.article === 'string' ? item.article : item.article[language];
    const titleLink = makeLink('', articleUrl, item.title[language]);
    title.appendChild(titleLink);
    const summary = document.createElement('p');
    summary.textContent = item.summary[language];

    const actions = document.createElement('div');
    actions.className = 'news-card-actions';
    actions.append(
      makeLink('news-read-link', articleUrl, `${words.read} →`),
      makeLink('news-source-link', item.source, `${words.original} ↗`, true)
    );

    body.append(meta, title, summary, actions);
    article.append(figure, body);
    return article;
  }

  function init() {
    const grid = document.getElementById('newsDeskGrid');
    if (!grid || grid.dataset.rendered === 'true') return;
    const language = locale();
    const words = localeCopy[language] || localeCopy['zh-Hant'];
    const items = [...words.items].sort((a, b) => {
      const dateDifference = Date.parse(`${b.date}T12:00:00+08:00`) - Date.parse(`${a.date}T12:00:00+08:00`);
      return dateDifference || a.priority - b.priority;
    });
    grid.replaceChildren(...items.map((item, index) => renderCard(item, words, language, index)));
    grid.dataset.rendered = 'true';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
