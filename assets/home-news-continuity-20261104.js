/* Keeps the homepage news path chronological without duplicating cards or imagery. */
(function () {
  'use strict';

  var labels = {
    'zh-Hant': {
      current: '今日快報',
      archive: '新聞檔案',
      archiveCopy: '依發布日期回溯閱讀',
      jump: '前往今日快報（最新）'
    },
    'zh-Hans': {
      current: '今日快报',
      archive: '新闻档案',
      archiveCopy: '按发布日期回溯阅读',
      jump: '前往今日快报（最新）'
    },
    en: {
      current: 'Today’s brief',
      archive: 'News archive',
      archiveCopy: 'Browse reports by publication date',
      jump: 'Go to today’s brief (latest)'
    },
    ja: {
      current: '今日の速報',
      archive: 'ニュースアーカイブ',
      archiveCopy: '公開日順にさかのぼって読む',
      jump: '今日の速報（最新）へ'
    }
  };

  function addStyle() {
    if (document.getElementById('home-news-continuity-style')) return;
    var style = document.createElement('style');
    style.id = 'home-news-continuity-style';
    style.textContent = [
      '#news-flash,[data-news-archive]{scroll-margin-top:calc(56px + 16px)}',
      '.home-news-continuity-bridge{display:flex;align-items:center;gap:12px;width:min(1200px,calc(100% - 48px));margin:18px auto 6px;color:#9b7c52}',
      '.home-news-continuity-bridge::before,.home-news-continuity-bridge::after{content:"";height:1px;flex:1;background:#d8cfbf}',
      '.home-news-continuity-bridge span{width:7px;height:7px;border:1px solid currentColor;border-radius:50%;background:#f7f3eb}',
      '@media(max-width:760px){.home-news-continuity-bridge{width:calc(100% - 32px);margin:14px auto 4px}#news-flash,[data-news-archive]{scroll-margin-top:calc(56px + 12px)}}'
    ].join('');
    document.head.appendChild(style);
  }

  function init() {
    addStyle();
    var copy = labels[document.documentElement.lang] || labels['zh-Hant'];
    var flash = document.getElementById('news-flash');
    var archive = document.getElementById('home-media-reports');

    document.querySelectorAll('a[href$="#home-media-reports"]').forEach(function (link) {
      link.href = '#news-flash';
      link.setAttribute('aria-label', copy.jump);
    });

    if (flash) {
      flash.setAttribute('data-news-current', '');
      flash.setAttribute('aria-label', copy.current);
      if (!document.getElementById('home-news-continuity-bridge')) {
        var bridge = document.createElement('div');
        bridge.id = 'home-news-continuity-bridge';
        bridge.className = 'home-news-continuity-bridge';
        bridge.setAttribute('aria-hidden', 'true');
        bridge.innerHTML = '<span></span>';
        flash.insertAdjacentElement('afterend', bridge);
      }
    }

    if (archive) {
      archive.setAttribute('data-news-archive', '');
      var heading = archive.querySelector('.section-heading h2');
      var description = archive.querySelector('.section-heading p');
      if (heading) heading.textContent = copy.archive;
      if (description) description.textContent = copy.archiveCopy;
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());