(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  const locale = document.documentElement.lang === 'ja'
    ? 'ja'
    : document.documentElement.lang === 'en'
      ? 'en'
      : (params.get('lang') === 'zh-Hans' || localStorage.getItem('siteLang') === 'zh-Hans')
        ? 'zh-Hans'
        : 'zh-Hant';

  const copy = {
    'zh-Hant': {
      code: '甲地',
      exact: '4號1樓・白天主要托育處；劉彩萱、劉若琳的父親也在此處',
      title: '午餐、日間照顧與父親所在處',
      text: '劉彩萱稱白天主要在此托育；準備餐點、用餐、冷靜區／罰站與地下室入口等情節涉及此處。另依旁聽補充，劉彩萱、劉若琳的父親也在甲地；第四日紀錄亦提到甲地孝親房內有「爸爸」與Mira。',
      routeNote: '甲、丙依2025年4月28日原始紀錄；甲地父親所在及乙地位置另含旁聽補充。乙地疑為劉彩萱居所，完整門牌與居所性質仍待正式資料確認。',
      source: '閱讀界線｜甲、丙依第四日原始紀錄；甲地另依旁聽補充註明劉彩萱、劉若琳的父親也在此處，且原始紀錄提到甲地孝親房內有「爸爸」與Mira。乙地位置與居所性質仍待正式筆錄、判決或圖面確認。',
      reminder: '甲：4號1樓・白天主要托育處；兩人父親也在此'
    },
    'zh-Hans': {
      code: '甲地',
      exact: '4号1楼・白天主要托育处；刘彩萱、刘若琳的父亲也在此处',
      title: '午餐、日间照顾与父亲所在处',
      text: '刘彩萱称白天主要在此托育；准备餐点、用餐、冷静区／罚站与地下室入口等情节涉及此处。另据旁听补充，刘彩萱、刘若琳的父亲也在甲地；第四日记录也提到甲地孝亲房内有“爸爸”与Mira。',
      routeNote: '甲、丙依据2025年4月28日原始记录；甲地父亲所在及乙地位置另含旁听补充。乙地疑为刘彩萱居所，完整门牌与居所性质仍待正式资料确认。',
      source: '阅读界线｜甲、丙依据第四日原始记录；甲地另据旁听补充注明刘彩萱、刘若琳的父亲也在此处，且原始记录提到甲地孝亲房内有“爸爸”与Mira。乙地位置与居所性质仍待正式笔录、判决或图面确认。',
      reminder: '甲：4号1楼・白天主要托育处；两人父亲也在此'
    },
    en: {
      code: 'Site A',
      exact: 'No. 4, 1F · main daytime care site; the sisters’ father was also at this location',
      title: 'Lunch, daytime care and the father’s location',
      text: 'Liu Tsai-hsuan described Site A as the main daytime childcare location. Meals, the calm-down/standing area and the basement entrance involved this site. An additional hearing observation places the father of Liu Tsai-hsuan and Liu Ruo-lin at Site A; the Day 4 record also refers to “Dad” and Mira in the filial room there.',
      routeNote: 'Sites A and C follow the 28 April 2025 source record. The father’s presence at Site A and the more specific Site B location also include hearing observations. Site B’s complete address and residential status remain subject to formal confirmation.',
      source: 'Reading limit | Sites A and C follow the Day 4 source record. The note that the sisters’ father was also at Site A includes an additional hearing observation, while the source record itself refers to “Dad” and Mira in Site A’s filial room. Site B’s exact address and residential status remain subject to formal confirmation.',
      reminder: 'A: No. 4, 1F · main daytime care site; the sisters’ father was also there'
    },
    ja: {
      code: '甲地',
      exact: '4号1階・日中の主な保育場所；劉彩萱・劉若琳の父親もこの場所にいた',
      title: '昼食・日中の保育・父親の所在',
      text: '劉彩萱は甲地を日中の主な保育場所と供述した。食事の準備、食事、クールダウン／立たせ、地下室入口などが関係する。傍聴での補足では、劉彩萱・劉若琳の父親も甲地にいたとされ、第4日の記録にも甲地の孝親房に「父」とMiraがいたとの記載がある。',
      routeNote: '甲地・丙地は2025年4月28日の原記録に基づく。甲地に父親がいたとの情報と乙地の具体的位置には傍聴補足も含む。乙地の完全な住所と住居としての位置付けは正式資料での確認を要する。',
      source: '読み方の限界｜甲地・丙地は第4日の原記録に基づく。甲地には劉彩萱・劉若琳の父親もいたとの傍聴補足を併記し、原記録にも甲地の孝親房に「父」とMiraがいたとの記載がある。乙地の位置と住居としての性質は正式な調書・判決資料・配置図での確認を要する。',
      reminder: '甲：4号1階・日中の主な保育場所；二人の父親もここにいた'
    }
  }[locale];

  const findArticle = (selector, code) => [...document.querySelectorAll(selector)]
    .find(article => article.querySelector('span')?.textContent.trim() === code);

  const apply = () => {
    const routeA = findArticle('.day4-route article', copy.code);
    if (routeA) {
      const exact = routeA.querySelector('.day4-location-exact');
      const title = routeA.querySelector('strong');
      const text = routeA.querySelector('p');
      if (exact) exact.textContent = copy.exact;
      if (title) title.textContent = copy.title;
      if (text) text.textContent = copy.text;
    }

    const routeNote = document.querySelector('.day4-route > small:last-child');
    if (routeNote) routeNote.textContent = copy.routeNote;

    const keyA = findArticle('.day4-location-grid article', copy.code);
    if (keyA) {
      const exact = keyA.querySelector('strong');
      const text = keyA.querySelector('p');
      if (exact) exact.textContent = copy.exact;
      if (text) text.textContent = copy.text;
    }

    const source = document.querySelector('.day4-location-source');
    if (source) source.textContent = copy.source;

    const reminder = document.querySelector('.day4-location-reminder');
    if (reminder) {
      const first = reminder.querySelector('span');
      if (first) first.textContent = copy.reminder;
    }

    window.ScrollTrigger?.refresh();
  };

  window.day4LocationNoteReady = Promise.resolve(window.day4CrosscheckReady)
    .then(() => {
      apply();
      requestAnimationFrame(apply);
    })
    .catch(error => console.error('Day 4 location note failed', error));
})();
