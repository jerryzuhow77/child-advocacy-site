(function () {
  'use strict';

  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-activity-impact-panel]'));
  if (!panels.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;

  function setupScroller(panel) {
    var track = panel.querySelector('[data-activity-impact-track]');
    var previous = panel.querySelector('[data-activity-impact-prev]');
    var next = panel.querySelector('[data-activity-impact-next]');
    if (!track || !previous || !next) return;

    var ticking = false;

    function updateControls() {
      ticking = false;
      var max = Math.max(0, track.scrollWidth - track.clientWidth);
      previous.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
    }

    function scheduleUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateControls);
    }

    function move(direction) {
      var card = track.querySelector('[data-activity-impact-card]');
      var distance = card ? card.getBoundingClientRect().width + 12 : track.clientWidth * 0.88;
      track.scrollBy({
        left: direction * distance,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    }

    previous.addEventListener('click', function () { move(-1); });
    next.addEventListener('click', function () { move(1); });
    track.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    updateControls();
  }

  panels.forEach(setupScroller);

  if (reduceMotion || !gsap || !ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);
  document.body.classList.add('has-activity-impact-gsap');

  panels.forEach(function (panel) {
    var head = panel.querySelector('.activity-impact-head');
    var cards = Array.prototype.slice.call(panel.querySelectorAll('[data-activity-impact-card]'));
    var timeline = gsap.timeline({
      paused: true,
      defaults: { ease: 'power3.out' }
    });

    if (head) {
      timeline.fromTo(head, { y: 18, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.58,
        clearProps: 'transform,opacity,visibility'
      });
    }

    if (cards.length) {
      timeline.fromTo(cards, {
        x: function (index) { return index % 2 ? 24 : -24; },
        y: 16,
        scale: 0.985,
        autoAlpha: 0
      }, {
        x: 0,
        y: 0,
        scale: 1,
        autoAlpha: 1,
        duration: 0.68,
        stagger: 0.11,
        clearProps: 'transform,opacity,visibility'
      }, head ? '-=0.28' : 0);
    }

    ScrollTrigger.create({
      trigger: panel,
      start: 'top 88%',
      once: true,
      onEnter: function () { timeline.play(0); }
    });
  });

  var latestTimelineItems = Array.prototype.slice.call(document.querySelectorAll('[data-about-latest-card]'));
  if (latestTimelineItems.length) {
    ScrollTrigger.batch(latestTimelineItems, {
      start: 'top 92%',
      once: true,
      onEnter: function (items) {
        gsap.fromTo(items, { y: 20, autoAlpha: 0 }, {
          y: 0,
          autoAlpha: 1,
          duration: 0.62,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity,visibility'
        });
      }
    });
  }

  window.setTimeout(function () { ScrollTrigger.refresh(); }, 180);
}());
