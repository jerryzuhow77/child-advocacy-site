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

  function init() {
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