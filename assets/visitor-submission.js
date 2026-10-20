(function () {
  'use strict';

  function initVisitorSubmission() {
    var launch = document.querySelector('[data-visitor-launch]');
    var dialog = document.querySelector('[data-visitor-submit-dialog]');
    var locale = document.documentElement.lang;

    if (['zh-Hant', 'zh-Hans', 'en', 'ja'].indexOf(locale) < 0) locale = 'zh-Hant';
    var officialWall = 'https://jerryzuhow77.github.io/child-advocacy-site/global-protection-wall/?section=guest-message';
    if (locale !== 'zh-Hant') officialWall += '&lang=' + encodeURIComponent(locale);
    document.querySelectorAll('[data-visitor-wall-link]').forEach(function (link) {
      link.href = officialWall;
    });

    if (launch) launch.hidden = true;
    if (dialog && dialog.open && typeof dialog.close === 'function') dialog.close();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVisitorSubmission, { once: true });
  } else {
    initVisitorSubmission();
  }
}());
