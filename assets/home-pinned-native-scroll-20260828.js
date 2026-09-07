(function () {
  'use strict';
  function init() {
    var viewport = document.querySelector('.home-pinned-reports-viewport');
    var track = viewport && viewport.querySelector('.home-pinned-reports-track');
    var section = viewport && viewport.closest('[data-pinned-reports]');
    if (!viewport || !track || !section || viewport.dataset.nativePinnedScroll === 'true') return;
    track.querySelectorAll('[data-pinned-clone]').forEach(function (clone) { clone.remove(); });
    var cards = Array.prototype.slice.call(track.querySelectorAll('.home-pinned-report-card'));
    if (!cards.length) return;
    viewport.dataset.nativePinnedScroll = 'true';
    viewport.dataset.manualDragReady = 'true';
    viewport.tabIndex = 0;
    viewport.setAttribute('role', 'region');
    var language = (document.documentElement.lang || 'zh-Hant').toLowerCase();
    var labels = language.indexOf('ja') === 0
      ? { region: '固定速報。自動再生、左右ボタン、ページボタン、矢印キーで閲覧できます', previous: '前の固定速報', next: '次の固定速報', page: '固定速報 %s を表示' }
      : language.indexOf('en') === 0
        ? { region: 'Pinned reports. Browse with autoplay, previous and next buttons, page buttons, or arrow keys', previous: 'Previous pinned report', next: 'Next pinned report', page: 'Show pinned report %s' }
        : language.indexOf('zh-hans') === 0
          ? { region: '置顶快报，可自动播放，或使用左右按钮、分页按钮及方向键浏览', previous: '上一则置顶快报', next: '下一则置顶快报', page: '显示第 %s 则置顶快报' }
          : { region: '置頂快報，可自動播放，或使用左右按鈕、分頁按鈕及方向鍵瀏覽', previous: '上一則置頂快報', next: '下一則置頂快報', page: '顯示第 %s 則置頂快報' };
    viewport.setAttribute('aria-label', labels.region);
    var controls = document.createElement('div');
    controls.className = 'home-pinned-controls';
    controls.innerHTML = '<button class="home-pinned-arrow is-previous" type="button" aria-label="' + labels.previous + '">‹</button><div class="home-pinned-dots" role="group"></div><button class="home-pinned-arrow is-next" type="button" aria-label="' + labels.next + '">›</button><span class="home-pinned-progress" aria-hidden="true"><i></i></span>';
    section.appendChild(controls);
    var previous = controls.querySelector('.is-previous');
    var next = controls.querySelector('.is-next');
    var dotsHost = controls.querySelector('.home-pinned-dots');
    var progress = controls.querySelector('.home-pinned-progress i');
    var active = 0, timer = 0, scrollTimer = 0, dragging = false, dragged = false, startX = 0, startScroll = 0, suppressUntil = 0;
    var progressTween = null;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var dots = cards.map(function (_, index) {
      var dot = document.createElement('button');
      dot.className = 'home-pinned-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', labels.page.replace('%s', String(index + 1)));
      dot.addEventListener('click', function () { show(index, true); });
      dotsHost.appendChild(dot);
      return dot;
    });
    function updateControls(index) {
      active = (index + cards.length) % cards.length;
      dots.forEach(function (dot, dotIndex) {
        var selected = dotIndex === active;
        dot.classList.toggle('is-active', selected);
        dot.setAttribute('aria-current', selected ? 'true' : 'false');
      });
    }
    function nearestIndex() {
      var left = viewport.scrollLeft, best = 0, distance = Infinity;
      cards.forEach(function (card, index) {
        var candidate = Math.abs(card.offsetLeft - left);
        if (candidate < distance) { distance = candidate; best = index; }
      });
      return best;
    }
    function show(index, manual) {
      updateControls(index);
      viewport.scrollTo({ left: cards[active].offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' });
      if (!reduceMotion && window.gsap) {
        window.gsap.killTweensOf(cards[active]);
        window.gsap.fromTo(cards[active], { y: 12, scale: .985, boxShadow: '0 8px 18px rgba(70,52,47,.08)' }, { y: 0, scale: 1, boxShadow: '0 18px 34px rgba(70,52,47,.16)', duration: .65, ease: 'power3.out', clearProps: 'transform,boxShadow' });
        window.gsap.fromTo(dots[active], { scale: .72 }, { scale: 1, duration: .42, ease: 'back.out(2.2)', clearProps: 'transform' });
      }
      if (manual) restart();
    }
    function stop() {
      window.clearInterval(timer); timer = 0;
      if (progressTween) { progressTween.kill(); progressTween = null; }
    }
    function restart() {
      stop();
      if (!reduceMotion && !document.hidden) {
        if (window.gsap && progress) {
          window.gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' });
          progressTween = window.gsap.to(progress, { scaleX: 1, duration: 5.5, ease: 'none' });
        }
        timer = window.setInterval(function () {
          show(active + 1, false);
          if (window.gsap && progress) {
            window.gsap.set(progress, { scaleX: 0 });
            progressTween = window.gsap.to(progress, { scaleX: 1, duration: 5.5, ease: 'none' });
          }
        }, 5500);
      }
    }
    previous.addEventListener('click', function () { show(active - 1, true); });
    next.addEventListener('click', function () { show(active + 1, true); });
    section.addEventListener('mouseenter', stop);
    section.addEventListener('mouseleave', restart);
    section.addEventListener('focusin', stop);
    section.addEventListener('focusout', function (event) { if (!section.contains(event.relatedTarget)) restart(); });
    section.addEventListener('touchstart', stop, { passive: true });
    section.addEventListener('touchend', restart, { passive: true });
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else restart(); });
    viewport.addEventListener('pointerdown', function (event) {
      if (event.button !== 0 || event.target.closest('button,input,select,textarea,[role="button"]')) return;
      stop(); dragging = true; dragged = false; startX = event.clientX; startScroll = viewport.scrollLeft;
    });
    viewport.addEventListener('pointermove', function (event) {
      if (!dragging) return;
      var delta = event.clientX - startX;
      if (!dragged && Math.abs(delta) > 6) {
        dragged = true; viewport.classList.add('is-dragging'); viewport.setPointerCapture(event.pointerId);
      }
      if (dragged) viewport.scrollLeft = startScroll - delta;
    });
    function finish(event) {
      if (!dragging) return;
      dragging = false; viewport.classList.remove('is-dragging');
      if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
      if (dragged) suppressUntil = Date.now() + 420;
      show(nearestIndex(), false); restart();
    }
    viewport.addEventListener('pointerup', finish);
    viewport.addEventListener('pointercancel', finish);
    track.addEventListener('click', function (event) {
      if (Date.now() > suppressUntil) return;
      event.preventDefault(); event.stopPropagation();
    }, true);
    viewport.addEventListener('scroll', function () {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(function () { updateControls(nearestIndex()); }, 100);
    }, { passive: true });
    viewport.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault(); show(active + (event.key === 'ArrowRight' ? 1 : -1), true);
    });
    updateControls(0);
    restart();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
}());

