(function () {
  'use strict';

  var attempts = 0;

  function init() {
    attempts += 1;
    var viewport = document.querySelector('.home-pinned-reports-viewport');
    var track = viewport && viewport.querySelector('.home-pinned-reports-track');
    var tween = track && window.gsap && window.gsap.getTweensOf(track).filter(function (item) {
      return item.repeat() === -1;
    })[0];
    if (!viewport || !track || !tween || !track.querySelector('[data-pinned-clone]')) {
      if (attempts < 160) window.setTimeout(init, 60);
      return;
    }
    if (viewport.dataset.manualDragReady === 'true') return;
    viewport.dataset.manualDragReady = 'true';

    var dragging = false;
    var dragged = false;
    var startX = 0;
    var startProgress = 0;
    var pointerType = '';
    var resumeTimer = 0;
    var pageLanguage = (document.documentElement.lang || 'zh-Hant').toLowerCase();

    viewport.tabIndex = 0;
    viewport.setAttribute('role', 'region');
    viewport.setAttribute('aria-label', pageLanguage.indexOf('ja') === 0
      ? '固定速報。左右にドラッグするか矢印キーで閲覧できます'
      : pageLanguage.indexOf('en') === 0
        ? 'Pinned reports. Drag horizontally or use the arrow keys to browse'
        : pageLanguage.indexOf('zh-hans') === 0
          ? '置顶快报，可左右拖动或使用方向键浏览'
          : '置頂快報，可左右拖曳或使用方向鍵瀏覽');

    function normalize(value) { return ((value % 1) + 1) % 1; }
    function resumeAfterTouch() {
      window.clearTimeout(resumeTimer);
      if (pointerType === 'mouse') return;
      resumeTimer = window.setTimeout(function () { tween.resume(); }, 1400);
    }

    viewport.addEventListener('pointerdown', function (event) {
      if (event.button !== 0 || event.target.closest('button,input,select,textarea')) return;
      dragging = true;
      dragged = false;
      pointerType = event.pointerType || 'mouse';
      startX = event.clientX;
      startProgress = tween.progress();
      tween.pause();
      viewport.classList.add('is-dragging');
      viewport.setPointerCapture(event.pointerId);
    });
    viewport.addEventListener('pointermove', function (event) {
      if (!dragging) return;
      var delta = event.clientX - startX;
      if (Math.abs(delta) > 5) dragged = true;
      if (!dragged) return;
      tween.progress(normalize(startProgress - delta / Math.max(1, track.scrollWidth / 2)));
    });
    function finish(event) {
      if (!dragging) return;
      dragging = false;
      viewport.classList.remove('is-dragging');
      if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
      if (dragged) viewport.dataset.suppressClickUntil = String(Date.now() + 420);
      resumeAfterTouch();
    }
    viewport.addEventListener('pointerup', finish);
    viewport.addEventListener('pointercancel', finish);
    track.addEventListener('click', function (event) {
      if (Date.now() > Number(viewport.dataset.suppressClickUntil || 0)) return;
      event.preventDefault();
      event.stopPropagation();
    }, true);
    viewport.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      tween.pause();
      tween.progress(normalize(tween.progress() + (event.key === 'ArrowRight' ? 0.25 : -0.25)));
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
}());
