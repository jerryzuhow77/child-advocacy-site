(() => {
  'use strict';
  const cards = {
  "zh-Hant": {
    "title": "護童週報｜退款調解照常，支持如何接續？",
    "summary": "11/27 臺北退款調解照常。從家庭救濟、特殊需求支持到兒少參與，追蹤下一步由誰承接。",
    "read": "閱讀護童週報",
    "label": "護童週報",
    "url": "/child-advocacy-site/news/child-protection-weekly-20261116-1122/"
  },
  "zh-Hans": {
    "title": "护童周报｜退款调解照常，支持如何接续？",
    "summary": "11/27 台北退款调解照常。从家庭救济、特殊需求支持到儿童参与，追踪下一步由谁负责。",
    "read": "阅读护童周报",
    "label": "护童周报",
    "url": "/child-advocacy-site/news/child-protection-weekly-20261116-1122/zh-Hans/"
  },
  "en": {
    "title": "Child Protection Weekly | What support follows?",
    "summary": "Taipei’s 27 November refund mediation goes ahead. This week tracks routes to remedy, continuity of support and responses to young people’s proposals.",
    "read": "Read the weekly report",
    "label": "Child Protection Weekly",
    "url": "/child-advocacy-site/news/child-protection-weekly-20261116-1122/en/"
  },
  "ja": {
    "title": "子ども保護週報｜調停は予定どおり。支援をどうつなぐか",
    "summary": "台北の返金調停は11月27日に開催予定。家庭の救済手続き、支援の引き継ぎ、子どもの提案への応答を追います。",
    "read": "週報を読む",
    "label": "子ども保護週報",
    "url": "/child-advocacy-site/news/child-protection-weekly-20261116-1122/ja/"
  }
};
  const routeLocale = location.pathname.match(/^\/child-advocacy-site\/(en|ja|zh-Hans)(?:\/|$)/)?.[1];
  const lang = routeLocale || new URLSearchParams(location.search).get('lang') || document.documentElement.lang;
  const data = cards[lang] || cards['zh-Hant'];
  const grid = document.querySelector('.home-latest-25-grid, [data-weekly-latest]');
  if (!grid) return;

  const card = document.createElement('a');
  card.className = 'weekly-latest-card';
  card.href = data.url;
  const image = document.createElement('img');
  image.src = '/child-advocacy-site/assets/art/child-protection-weekly-20261116-1122-thumb.webp';
  image.alt = '';
  image.width = 640;
  image.height = 360;
  image.decoding = 'async';

  const body = document.createElement('span');
  const label = document.createElement('small');
  label.textContent = data.label;
  const title = document.createElement('strong');
  title.className = 'weekly-latest-title';
  title.textContent = data.title;
  const summary = document.createElement('span');
  summary.textContent = data.summary;
  const read = document.createElement('b');
  read.textContent = data.read + ' →';
  body.append(label, title, summary, read);
  card.append(image, body);

  function insert() {
    if (card.parentNode !== grid) grid.prepend(card);
  }
  insert();
  // The homepage also renders its article list asynchronously.
  new MutationObserver(insert).observe(grid, { childList: true });
})();
