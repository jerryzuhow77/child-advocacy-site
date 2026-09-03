(() => {
  'use strict';

  const ROOT = '/child-advocacy-site/';
  const NEXTTV_URL = 'https://www.nexttv.com.tw/NextTV/News/Home/Society/m/2026-09-02/2455025.html';
  const PHOTO_SOURCE_URL = 'https://www.taisounds.com/news/content/96/174886';
  const PHOTO_URL = 'https://image.taisounds.com/newsimages/img/2026/0626/887688e131974df08ae8bffa97d11e7c.jpg';

  const localeCopy = {
    'zh-Hant': {
      source: '新聞來源｜壹電視 Next TV',
      photo: '資料照片：林心慈出庭；照片來源：太報／攝影：呂志明',
      read: '閱讀本站整理',
      original: '原始報導',
      unavailable: '照片暫時無法載入，請由來源連結查看。',
      items: [{
        date: '2026-09-02',
        publisher: '壹電視',
        title: '林心慈案首度開庭',
        summary: '從訪視紀錄與日期登載爭議出發，整理媒體報導、檢方指控、辯方主張與尚待法院審酌的事項。',
        article: `${ROOT}news/lin-xinci-nexttv-20260902/`
      }]
    },
    'zh-Hans': {
      source: '新闻来源｜壹电视 Next TV',
      photo: '资料照片：林心慈出庭；照片来源：太报／摄影：吕志明',
      read: '阅读本站整理',
      original: '原始报道',
      unavailable: '照片暂时无法载入，请由来源链接查看。',
      items: [{
        date: '2026-09-02',
        publisher: '壹电视',
        title: '林心慈案首次开庭',
        summary: '从访视记录与日期登记争议出发，整理媒体报道、检方指控、辩方主张及尚待法院审酌的事项。',
        article: `${ROOT}news/lin-xinci-nexttv-20260902/zh-Hans/`
      }]
    },
    en: {
      source: 'News source | Next TV',
      photo: 'File photo: Lin Hsin-tzu appearing in court. Source: TaiSounds; photo by Lu Chih-ming.',
      read: 'Read our brief',
      original: 'Original report',
      unavailable: 'The photograph is temporarily unavailable. Please use the source link.',
      items: [{
        date: '2026-09-02',
        publisher: 'Next TV',
        title: 'First hearing in the Lin Hsin-tzu case',
        summary: 'A source-attributed review of the disputed visit records, the prosecution account, the defense position, and matters still for the court.',
        article: `${ROOT}en/news/lin-xinci-nexttv-20260902/`
      }]
    },
    ja: {
      source: '報道資料｜壹電視 Next TV',
      photo: '資料写真：林心慈氏の出廷。写真提供：太報／撮影：呂志明氏',
      read: '本サイトの整理を読む',
      original: '元の報道',
      unavailable: '写真を読み込めません。出典リンクからご確認ください。',
      items: [{
        date: '2026-09-02',
        publisher: '壹電視',
        title: '林心慈事件、初公判',
        summary: '訪問記録と日付記載をめぐる争点について、報道、検察側の説明、弁護側の主張、今後裁判所が判断する事項を整理します。',
        article: `${ROOT}ja/news/lin-xinci-nexttv-20260902/`
      }]
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
    photo.src = PHOTO_URL;
    photo.alt = words.photo;
    photo.loading = index === 0 ? 'eager' : 'lazy';
    photo.decoding = 'async';
    photo.referrerPolicy = 'no-referrer';
    const credit = document.createElement('figcaption');
    credit.className = 'news-photo-credit';
    const creditLink = makeLink('', PHOTO_SOURCE_URL, words.photo, true);
    credit.appendChild(creditLink);
    photo.addEventListener('error', () => {
      photo.hidden = true;
      figure.classList.add('is-photo-unavailable');
      creditLink.textContent = words.unavailable;
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
    publisher.textContent = item.publisher;
    meta.append(time, publisher);

    const title = document.createElement('h3');
    const titleLink = makeLink('', item.article, item.title);
    title.appendChild(titleLink);
    const summary = document.createElement('p');
    summary.textContent = item.summary;

    const actions = document.createElement('div');
    actions.className = 'news-card-actions';
    actions.append(
      makeLink('news-read-link', item.article, `${words.read} →`),
      makeLink('news-source-link', NEXTTV_URL, `${words.original} ↗`, true)
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
      return dateDifference || a.title.localeCompare(b.title, language);
    });
    grid.replaceChildren(...items.map((item, index) => renderCard(item, words, language, index)));
    grid.dataset.rendered = 'true';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
