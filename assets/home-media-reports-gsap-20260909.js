(function () {
  'use strict';

  function init() {
    var section = document.querySelector('#home-media-reports');
    var viewport = section && section.querySelector('.home-media-report-viewport');
    var track = viewport && viewport.querySelector('.home-media-report-track');
    var controls = section && section.querySelector('.home-media-report-controls');
    var cards = track && Array.prototype.slice.call(track.querySelectorAll('.home-media-report-card'));
    if (!section || !viewport || !track || !cards || cards.length < 2 || viewport.dataset.mediaGsapAutoplay === 'true') return;

    viewport.dataset.mediaGsapAutoplay = 'true';
    viewport.setAttribute('aria-label', '新聞專區，可自動由左向右移動，亦可用左右按鈕、方向鍵或手勢閱覽');

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var active = 0;
    var timer = 0;
    var scrollTimer = 0;
    var resumeTimer = 0;
    var tween = null;
    var interval = 5200;

    function nearestIndex() {
      var max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      if (viewport.scrollLeft <= 2) return 0;
      if (viewport.scrollLeft >= max - 2) return cards.length - 1;
      var viewportLeft = viewport.getBoundingClientRect().left;
      var best = 0;
      var distance = Infinity;
      cards.forEach(function (card, index) {
        var candidate = Math.abs(card.getBoundingClientRect().left - viewportLeft);
        if (candidate < distance) {
          distance = candidate;
          best = index;
        }
      });
      return best;
    }

    function stop() {
      window.clearInterval(timer);
      window.clearTimeout(resumeTimer);
      timer = 0;
      resumeTimer = 0;
      if (tween) {
        tween.kill();
        tween = null;
      }
    }

    function show(index, manual) {
      active = (index + cards.length) % cards.length;
      var viewportLeft = viewport.getBoundingClientRect().left;
      var destination = viewport.scrollLeft + cards[active].getBoundingClientRect().left - viewportLeft;
      if (window.gsap && !reduceMotion) {
        if (tween) tween.kill();
        tween = window.gsap.to(viewport, {
          scrollLeft: destination,
          duration: 1.05,
          ease: 'power2.inOut',
          overwrite: true,
          onComplete: function () { tween = null; }
        });
      } else {
        viewport.scrollTo({ left: destination, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
      if (manual) restart(4200);
    }

    function start() {
      window.clearInterval(timer);
      if (reduceMotion || document.hidden || section.contains(document.activeElement) || section.matches(':hover')) return;
      timer = window.setInterval(function () {
        show(active + 1, false);
      }, interval);
    }

    function restart(delay) {
      stop();
      resumeTimer = window.setTimeout(start, delay || 700);
    }

    // The responsive rail owns its accessible buttons and keyboard controls.
    // Keep this module focused on autoplay when that controller is present so
    // one click never starts two competing scroll animations.
    if (!controls || controls.dataset.mediaRailBound !== 'true') {
      section.querySelectorAll('[data-home-media-direction]').forEach(function (button) {
        button.addEventListener('click', function () {
          var direction = Number(button.getAttribute('data-home-media-direction')) || 1;
          show(active + direction, true);
        });
      });
      viewport.addEventListener('keydown', function (event) {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        show(active + (event.key === 'ArrowRight' ? 1 : -1), true);
      });
    }

    viewport.addEventListener('scroll', function () {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(function () {
        active = nearestIndex();
      }, 120);
    }, { passive: true });

    section.addEventListener('mouseenter', stop);
    section.addEventListener('mouseleave', function () { restart(); });
    section.addEventListener('focusin', stop);
    section.addEventListener('focusout', function (event) {
      if (!section.contains(event.relatedTarget)) restart();
    });
    section.addEventListener('touchstart', stop, { passive: true });
    section.addEventListener('touchend', function () { restart(1600); }, { passive: true });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else restart();
    });

    active = nearestIndex();
    start();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
}());
