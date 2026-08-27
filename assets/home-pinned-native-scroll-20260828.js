(function () {
  'use strict';

  function init() {
    var viewport = document.querySelector('.home-pinned-reports-viewport');
    var track = viewport && viewport.querySelector('.home-pinned-reports-track');
    if (!viewport || !track || viewport.dataset.nativePinnedScroll === 'true') return;

    track.querySelectorAll('[data-pinned-clone]').forEach(function (clone) { clone.remove(); });
    viewport.dataset.nativePinnedScroll = 'true';
    viewport.dataset.manualDragReady = 'true';
    viewport.tabIndex = 0;
    viewport.setAttribute('role', 'region');

    var language = (document.documentElement.lang || 'zh-Hant').toLowerCase();
    viewport.setAttribute('aria-label', language.indexOf('ja') === 0
      ? '固定速報。左右にスクロールするか矢印キーで閲覧できます'
      : language.indexOf('en') === 0
        ? 'Pinned reports. Scroll horizontally or use the arrow keys'
        : language.indexOf('zh-hans') === 0
          ? '置顶快报，可左右滚动或使用方向键浏览'
          : '置頂快報，可左右捲動或使用方向鍵瀏覽');

    var dragging = false;
    var dragged = false;
    var startX = 0;
    var startScroll = 0;
    var suppressUntil = 0;

    viewport.addEventListener('pointerdown', function (event) {
      if (event.button !== 0 || event.target.closest('button,input,select,textarea,[role="button"]')) return;
      dragging = true;
      dragged = false;
      startX = event.clientX;
      startScroll = viewport.scrollLeft;
      viewport.classList.add('is-dragging');
      viewport.setPointerCapture(event.pointerId);
    });
    viewport.addEventListener('pointermove', function (event) {
      if (!dragging) return;
      var delta = event.clientX - startX;
      if (Math.abs(delta) > 6) dragged = true;
      if (dragged) viewport.scrollLeft = startScroll - delta;
    });
    function finish(event) {
      if (!dragging) return;
      dragging = false;
      viewport.classList.remove('is-dragging');
      if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
      if (dragged) suppressUntil = Date.now() + 420;
    }
    viewport.addEventListener('pointerup', finish);
    viewport.addEventListener('pointercancel', finish);
    track.addEventListener('click', function (event) {
      if (Date.now() > suppressUntil) return;
      event.preventDefault();
      event.stopPropagation();
    }, true);
    viewport.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      viewport.scrollBy({ left: (event.key === 'ArrowRight' ? 1 : -1) * Math.max(280, viewport.clientWidth * .72), behavior: 'smooth' });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
}());
