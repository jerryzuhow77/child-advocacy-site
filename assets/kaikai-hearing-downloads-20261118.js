(() => {
  const root = '/child-advocacy-site/assets/posters/kaikai-hearings-20261214-20270108/';
  const posters = [
    ['01-liu-case-chalk-candle.jpg', '劉彩萱、劉若琳另案｜粉筆燭光版', '劉彩萱、劉若琳另案，12月14日下午2:30，臺北地方法院第19法庭'],
    ['02-liu-case-chalk-teddy.jpg', '劉彩萱、劉若琳另案｜粉筆小熊版', '劉彩萱、劉若琳另案，12月14日下午2:30，臺北地方法院第19法庭'],
    ['03-liu-case-watercolor-blue.jpg', '劉彩萱、劉若琳另案｜水彩花野版', '劉彩萱、劉若琳另案，12月14日下午2:30，臺北地方法院第19法庭'],
    ['04-liu-case-red-ribbon.jpg', '劉彩萱、劉若琳另案｜紅絲帶版', '劉彩萱、劉若琳另案，12月14日下午2:30，臺北地方法院第19法庭'],
    ['05-chen-case-watercolor.jpg', '陳尚潔案｜水墨守望版', '陳尚潔案二審準備程序，116年1月8日（五）14:30，臺灣高等法院專一法庭'],
    ['06-chen-case-chalk.jpg', '陳尚潔案｜粉筆庭院版', '陳尚潔案二審準備程序，116年1月8日（五）14:30，臺灣高等法院專一法庭'],
    ['07-chen-case-golden-court.jpg', '陳尚潔案｜暖光法庭版', '陳尚潔案二審準備程序，116年1月8日（五）14:30，臺灣高等法院專一法庭'],
    ['08-chen-case-clean-blue.jpg', '陳尚潔案｜晴空守望版', '陳尚潔案二審準備程序，116年1月8日（五）14:30，臺灣高等法院專一法庭']
  ];
  const hans = document.documentElement.lang === 'zh-Hans';
  const words = hans ? {
    title: '剀剀案开庭追思海报下载',
    lede: '以下八款海报涵盖 12 月 14 日刘彩萱、刘若琳另案与 116 年 1 月 8 日陈尚洁案。可先开启预览，再下载原始图档；庭期如有异动请以法院公告为准。',
    preview: '预览海报', download: '下载原始档',
    names: ['刘彩萱、刘若琳另案｜粉笔烛光版','刘彩萱、刘若琳另案｜粉笔小熊版','刘彩萱、刘若琳另案｜水彩花野版','刘彩萱、刘若琳另案｜红丝带版','陈尚洁案｜水墨守望版','陈尚洁案｜粉笔庭院版','陈尚洁案｜暖光法庭版','陈尚洁案｜晴空守望版']
  } : {title:'剴剴案開庭追思海報下載',lede:'以下八款海報涵蓋 12 月 14 日劉彩萱、劉若琳另案與 116 年 1 月 8 日陳尚潔案。可先開啟預覽，再下載原始圖檔；庭期如有異動請以法院公告為準。',preview:'預覽海報',download:'下載原始檔',names:posters.map(([,name])=>name)};
  addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('#poster-downloads');
    const grid = section?.querySelector('.poster-download-grid');
    if (!grid) return;
    const title = section.querySelector('#poster-downloads-title');
    const lede = section.querySelector('.lede');
    if (title) title.textContent = words.title;
    if (lede) lede.textContent = words.lede;
    grid.innerHTML = posters.map(([file,_name,description],i) => {const name=words.names[i],url=root+file; return `<article class="poster-download-card"><a href="${url}" target="_blank" rel="noopener" aria-label="${words.preview}：${name}"><img src="${url}" alt="${description}" loading="lazy" width="1024" height="1536"></a><div class="poster-download-copy"><h3>${name}</h3><p>${description}</p><div class="poster-download-actions"><a href="${url}" target="_blank" rel="noopener">${words.preview}</a><a href="${url}" download>${words.download}</a></div></div></article>`;}).join('');
  });
})();
