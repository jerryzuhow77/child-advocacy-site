(function () {
  'use strict';

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger || document.body.dataset.homeGsapReady === 'true') return;

  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false, force3D: true });

  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  body.dataset.homeGsapReady = 'true';
  body.classList.add('has-home-gsap');

  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function markActive(elements) {
    elements.forEach(function (element) { element.classList.add('home-gsap-active'); });
  }

  function addProgressBar() {
    var bar = document.createElement('div');
    bar.className = 'home-gsap-progress';
    bar.setAttribute('aria-hidden', 'true');
    body.appendChild(bar);

    var move = gsap.quickTo(bar, 'scaleX', { duration: 0.18, ease: 'power1.out' });
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: function (self) { move(self.progress); }
    });
  }

  function addHeroAtmosphere(hero) {
    if (!hero) return;
    var ambient = document.createElement('div');
    ambient.className = 'home-gsap-ambient';
    ambient.setAttribute('aria-hidden', 'true');
    ambient.innerHTML = '<span class="home-gsap-orb is-coral"></span><span class="home-gsap-orb is-gold"></span><span class="home-gsap-orb is-blue"></span>';
    hero.insertBefore(ambient, hero.firstChild);

    var coral = ambient.querySelector('.is-coral');
    var gold = ambient.querySelector('.is-gold');
    var blue = ambient.querySelector('.is-blue');
    gsap.to(coral, { xPercent: 20, yPercent: 12, scale: 1.12, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to(gold, { xPercent: -18, yPercent: -10, scale: 1.16, duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to(blue, { xPercent: 15, yPercent: 18, scale: 0.92, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }

  function animateHeaderAndHero() {
    var header = document.querySelector('.art-header');
    var hero = document.querySelector('.premium-home-hero');
    if (!hero) return;

    addHeroAtmosphere(hero);

    var copy = all('.premium-kicker, .seo-brand-name, .premium-hero-copy > .art-eyebrow, .premium-hero-copy h1, .premium-hero-lead, .premium-hero-actions, .premium-hero-note, .home-view-counter', hero);
    var art = hero.querySelector('.premium-hero-art');
    var bottomline = hero.querySelector('.premium-hero-bottomline');
    markActive(copy.concat([art, bottomline].filter(Boolean)));

    var timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (header) timeline.fromTo(header, { y: -24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.65, clearProps: 'transform,opacity,visibility' });
    timeline
      .fromTo(copy, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.72, stagger: 0.075, clearProps: 'opacity,visibility' }, header ? '-=0.25' : 0)
      .fromTo(art, { x: 72, rotateY: -9, scale: 0.94, autoAlpha: 0 }, { x: 0, rotateY: 0, scale: 1, autoAlpha: 1, duration: 1.05, clearProps: 'opacity,visibility' }, '-=0.72')
      .fromTo(bottomline, { scaleX: 0.76, autoAlpha: 0 }, { scaleX: 1, autoAlpha: 1, duration: 0.8, clearProps: 'transform,opacity,visibility' }, '-=0.45');

    all('.premium-art-orbit', hero).forEach(function (orbit, index) {
      gsap.to(orbit, { rotate: index % 2 ? -360 : 360, duration: index % 2 ? 26 : 21, repeat: -1, ease: 'none' });
    });
    all('.premium-floating-tag', hero).forEach(function (tag, index) {
      gsap.to(tag, { y: index % 2 ? 8 : -9, rotate: index % 2 ? -1.4 : 1.2, duration: 2.4 + index * 0.45, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    });
    var glow = hero.querySelector('.premium-art-glow');
    if (glow) gsap.to(glow, { scale: 1.1, opacity: 0.82, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    var heart = hero.querySelector('.premium-kicker span');
    if (heart) gsap.to(heart, { scale: 1.12, duration: 0.8, repeat: -1, yoyo: true, ease: 'sine.inOut', repeatDelay: 1.1 });
  }

  function revealHeaders() {
    var selectors = [
      '.home-news-hub-head',
      '.home-news-stream-head',
      '.home-social-cases-banner',
      '.remember-kaikai-copy',
      '.impact-dashboard-head',
      '.mission-section .section-head',
      '.primary-brand-section .section-head',
      '.social-preview-section .section-head',
      '.belief-footer-section .belief-footer-copy',
      '.home-art-footer .footer-grid'
    ].join(',');
    var items = all(selectors);
    markActive(items);

    ScrollTrigger.batch(items, {
      start: 'top 88%',
      once: true,
      interval: 0.1,
      batchMax: 3,
      onEnter: function (batch) {
        gsap.fromTo(batch, { y: 38, autoAlpha: 0 }, {
          y: 0,
          autoAlpha: 1,
          duration: 0.78,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'opacity,visibility'
        });
      }
    });
  }

  function revealGroup(container, itemSelector, direction) {
    all(container).forEach(function (group) {
      var items = all(itemSelector, group);
      if (!items.length) return;
      markActive(items);
      gsap.fromTo(items, {
        x: direction || 32,
        y: 22,
        autoAlpha: 0,
        scale: 0.975
      }, {
        x: 0,
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.72,
        stagger: 0.085,
        ease: 'power3.out',
        clearProps: 'opacity,visibility',
        scrollTrigger: { trigger: group, start: 'top 88%', once: true }
      });
    });
  }

  function animateNewsFocus() {
    var focus = document.querySelector('.home-news-focus');
    if (!focus) return;
    var media = focus.querySelector('.home-news-focus-media');
    var copy = focus.querySelector('.home-news-focus-copy');
    var pieces = [media, copy].filter(Boolean);
    markActive(pieces);
    gsap.fromTo(media, { x: -48, autoAlpha: 0 }, {
      x: 0,
      autoAlpha: 1,
      duration: 0.9,
      ease: 'power3.out',
      clearProps: 'opacity,visibility',
      scrollTrigger: { trigger: focus, start: 'top 84%', once: true }
    });
    gsap.fromTo(copy, { x: 48, autoAlpha: 0 }, {
      x: 0,
      autoAlpha: 1,
      duration: 0.9,
      delay: 0.08,
      ease: 'power3.out',
      clearProps: 'opacity,visibility',
      scrollTrigger: { trigger: focus, start: 'top 84%', once: true }
    });
    var image = focus.querySelector('img');
    if (image) gsap.to(image, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: focus, start: 'top bottom', end: 'bottom top', scrub: 0.7 } });
  }

  function addReelSheen() {
    all('.home-news-reel, .home-case-reel, .home-progress-reel').forEach(function (reel) {
      var sheen = document.createElement('span');
      sheen.className = 'home-gsap-reel-sheen';
      sheen.setAttribute('aria-hidden', 'true');
      reel.appendChild(sheen);
      gsap.fromTo(sheen, { x: 0, autoAlpha: 0 }, {
        x: function () { return Math.max(reel.clientWidth + 160, 520); },
        autoAlpha: 0.6,
        duration: 1.35,
        ease: 'power2.inOut',
        clearProps: 'opacity,visibility',
        scrollTrigger: { trigger: reel, start: 'top 86%', once: true }
      });
    });
  }

  function animateDecorations() {
    all('.stream-icon').forEach(function (icon) {
      gsap.fromTo(icon, { rotate: -12, scale: 0.72 }, {
        rotate: 0,
        scale: 1,
        duration: 0.62,
        ease: 'back.out(1.8)',
        scrollTrigger: { trigger: icon, start: 'top 90%', once: true }
      });
    });

    all('.home-news-hub-mark, .home-social-cases-qcluster, .remember-kaikai-visual, .home-advocacy-art').forEach(function (visual, index) {
      gsap.to(visual, {
        yPercent: index % 2 ? 5 : -5,
        rotate: index % 2 ? 0.7 : -0.7,
        ease: 'none',
        scrollTrigger: { trigger: visual, start: 'top bottom', end: 'bottom top', scrub: 0.75 }
      });
    });

    all('.footer-light-ad img').forEach(function (image) {
      gsap.fromTo(image, { scale: 1.08 }, { scale: 1, duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: image, start: 'top 92%', once: true } });
    });
  }

  function animateFooterToolbar() {
    var footer = document.querySelector('.home-art-footer');
    if (!footer) return;
    var lead = footer.querySelector('.home-footer-lead');
    var columns = all('.home-footer-toolbar > section', footer);
    var bottom = footer.querySelector('.home-footer-bottom');
    var glow = footer.querySelector('.home-footer-glow');
    var mobileItems = all('.home-footer-mobile-bar a', footer);

    if (lead) gsap.fromTo(lead, { y: 34, autoAlpha: 0 }, {
      y: 0, autoAlpha: 1, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: footer, start: 'top 88%', once: true }
    });
    if (columns.length) gsap.fromTo(columns, { y: 28, autoAlpha: 0 }, {
      y: 0, autoAlpha: 1, duration: .68, stagger: .1, ease: 'power2.out',
      scrollTrigger: { trigger: columns[0], start: 'top 92%', once: true }
    });
    if (bottom) gsap.fromTo(bottom, { autoAlpha: 0 }, {
      autoAlpha: 1, duration: .7,
      scrollTrigger: { trigger: bottom, start: 'top 96%', once: true }
    });
    if (glow) gsap.to(glow, { xPercent: 16, yPercent: 8, scale: 1.12, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    if (mobileItems.length) gsap.fromTo(mobileItems, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .46, stagger: .07, delay: .25, ease: 'back.out(1.5)' });

    var light = footer.querySelector('.footer-light-ad');
    if (light) {
      var sheen = document.createElement('span');
      sheen.className = 'home-footer-sheen';
      sheen.setAttribute('aria-hidden', 'true');
      light.appendChild(sheen);
      gsap.fromTo(sheen, { xPercent: -180, autoAlpha: 0 }, {
        xPercent: 360, autoAlpha: .55, duration: 1.25, ease: 'power2.inOut',
        scrollTrigger: { trigger: light, start: 'top 90%', once: true }
      });
    }
  }

  function animateCraftedZones() {
    all('.home-crafted-zone').forEach(function (zone) {
      var head = zone.querySelector('.home-crafted-head');
      var cards = all('.home-crafted-card, .home-historical-card', zone);
      var layers = all('.home-craft-layer', zone);
      var seal = zone.querySelector('.home-clay-seal');
      if (head) gsap.fromTo(head, { y: 34, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: .9, ease: 'power3.out',
        scrollTrigger: { trigger: zone, start: 'top 84%', once: true }
      });
      if (cards.length) gsap.fromTo(cards, { y: 44, rotate: -1.2, autoAlpha: 0 }, {
        y: 0, rotate: 0, autoAlpha: 1, duration: .82, stagger: .1, ease: 'power3.out',
        scrollTrigger: { trigger: cards[0], start: 'top 88%', once: true }
      });
      layers.forEach(function (layer, index) {
        gsap.to(layer, {
          yPercent: index ? -9 : 8, rotate: index ? 2 : -2, ease: 'none',
          scrollTrigger: { trigger: zone, start: 'top bottom', end: 'bottom top', scrub: .9 }
        });
      });
      if (seal) gsap.to(seal, { rotate: zone.classList.contains('home-historical-zone') ? 4 : -4, y: -8, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    });
  }

  function initSpecialFeatureScroller() {
    var reel = document.querySelector('.home-special-grid');
    if (!reel) return;
    var step = function () {
      var card = reel.querySelector('.home-crafted-card');
      return card ? card.getBoundingClientRect().width + 24 : Math.min(390, reel.clientWidth * .84);
    };
    var move = function (direction) {
      reel.scrollBy({ left: direction * step(), behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    document.querySelector('[data-special-prev]')?.addEventListener('click', function () { move(-1); });
    document.querySelector('[data-special-next]')?.addEventListener('click', function () { move(1); });
    reel.addEventListener('wheel', function (event) {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX) || reel.scrollWidth <= reel.clientWidth) return;
      event.preventDefault();
      reel.scrollLeft += event.deltaY;
    }, { passive: false });
  }

  function animateSeaArt() {
    all('.sea-wave-layer').forEach(function (wave, index) {
      gsap.to(wave, { xPercent: index ? 4 : -4, y: index ? -3 : 4, duration: 4.2 + index, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    });
    all('.sea-sailboat').forEach(function (boat) {
      gsap.to(boat, { x: -18, y: 5, rotate: -2.5, duration: 5.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    });
    all('.sea-fish').forEach(function (fish, index) {
      gsap.to(fish, { x: 32 + index * 14, y: index ? -5 : 4, duration: 4.6 + index, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    });
    var gulls = document.querySelector('.sea-gulls');
    if (gulls) gsap.to(gulls, { x: -14, y: -5, duration: 4.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }

  function animateSummerBeach() {
    var wall = document.querySelector('.home-protection-wall');
    if (!wall) return;
    var sun = wall.querySelector('.home-beach-sun');
    var waves = all('.home-beach-wave', wall);
    var notes = all('.home-beach-note', wall);
    var shells = all('.home-beach-shell', wall);
    if (sun) gsap.to(sun, { scale: 1.1, opacity: .78, duration: 3.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    waves.forEach(function (wave, index) {
      gsap.to(wave, { xPercent: index ? -3 : 3, y: index ? 4 : -3, duration: 3.4 + index, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    });
    notes.forEach(function (note, index) {
      gsap.to(note, { y: index ? 9 : -10, rotate: index ? 1.5 : -1.5, duration: 2.7 + index * .5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    });
    shells.forEach(function (shell, index) {
      gsap.to(shell, { rotate: index ? 9 : -8, y: index ? -5 : 4, duration: 2.4 + index * .4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    });
    gsap.fromTo(wall.querySelector('.home-protection-wall-card'), { y: 36, autoAlpha: 0 }, {
      y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: wall, start: 'top 84%', once: true }
    });
  }

  function animateHearingZone() {
    var zone = document.querySelector('.home-hearing-zone');
    if (!zone) return;
    var head = zone.querySelector('.home-hearing-zone-head');
    var features = all('.home-hearing-zone-feature', zone);

    if (head) gsap.fromTo(head, { y: 28, autoAlpha: 0 }, {
      y: 0, autoAlpha: 1, duration: .85, ease: 'power2.out',
      scrollTrigger: { trigger: zone, start: 'top 82%', once: true }
    });
    features.forEach(function (feature, index) {
      var poster = feature.querySelector('.home-hearing-zone-poster');
      var copy = feature.querySelector('.home-hearing-zone-copy');
      var stamp = feature.querySelector('.home-hearing-zone-stamp');
      if (poster) gsap.fromTo(poster, { x: -46, rotate: -4, autoAlpha: 0 }, {
        x: 0, rotate: -1.2, autoAlpha: 1, duration: 1, delay: index * .05, ease: 'power3.out',
        scrollTrigger: { trigger: feature, start: 'top 86%', once: true }
      });
      if (copy) gsap.fromTo(copy.children, { x: 34, autoAlpha: 0 }, {
        x: 0, autoAlpha: 1, duration: .72, stagger: .08, ease: 'power2.out',
        scrollTrigger: { trigger: feature, start: 'top 84%', once: true }
      });
      if (stamp) gsap.to(stamp, {
        rotate: index % 2 ? -5 : 8, y: -10, ease: 'none',
        scrollTrigger: { trigger: feature, start: 'top bottom', end: 'bottom top', scrub: .8 }
      });
    });
  }

  function addCardTilt() {
    if (!finePointer) return;
    var cards = all('.home-news-card, .home-case-reel-card, .home-progress-card, .impact-metric-card, .remember-kaikai-card');
    cards.forEach(function (card) {
      card.classList.add('home-gsap-tilt');
      var rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.35, ease: 'power2.out' });
      var rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.35, ease: 'power2.out' });
      var lift = gsap.quickTo(card, 'y', { duration: 0.3, ease: 'power2.out' });

      card.addEventListener('pointermove', function (event) {
        var rect = card.getBoundingClientRect();
        var px = (event.clientX - rect.left) / rect.width - 0.5;
        var py = (event.clientY - rect.top) / rect.height - 0.5;
        rotateY(px * 5.5);
        rotateX(py * -4.5);
        lift(-5);
      }, { passive: true });

      card.addEventListener('pointerleave', function () {
        rotateX(0);
        rotateY(0);
        lift(0);
      }, { passive: true });
    });
  }

  function initDocumentDisc() {
    var shell = document.querySelector('[data-document-disc]');
    if (!shell) return;
    var orbit = shell.querySelector('.home-document-disc-orbit');
    var cards = all('.home-document-disc-card', shell);
    var spokes = shell.querySelector('.home-ferris-spokes');
    if (!orbit || !cards.length) return;

    var step = 360 / cards.length;
    var autoTween;
    var dragging = false;
    var startX = 0;
    var startRotation = 0;

    function radius() {
      if (window.innerWidth <= 430) return 152;
      if (window.innerWidth <= 760) return 184;
      return Math.min(shell.clientWidth * 0.35, 300);
    }

    function keepCardsUpright() {
      var rotation = Number(gsap.getProperty(orbit, 'rotation')) || 0;
      cards.forEach(function (card) { gsap.set(card, { rotation: -rotation }); });
      if (spokes) gsap.set(spokes, { rotation: rotation });
    }

    function layout() {
      var r = radius();
      cards.forEach(function (card, index) {
        var angle = (-90 + index * step) * Math.PI / 180;
        gsap.set(card, {
          xPercent: -50,
          yPercent: -50,
          x: Math.cos(angle) * r,
          y: Math.sin(angle) * r
        });
      });
      keepCardsUpright();
    }

    function rotateBy(delta) {
      if (reduceMotion) return;
      if (autoTween) autoTween.pause();
      gsap.to(orbit, {
        rotation: function () { return (Number(gsap.getProperty(orbit, 'rotation')) || 0) + delta; },
        duration: 0.72,
        ease: 'power2.inOut',
        onUpdate: keepCardsUpright,
        onComplete: function () { if (autoTween) autoTween.resume(); }
      });
    }

    layout();
    window.addEventListener('resize', layout, { passive: true });

    if (!reduceMotion) {
      autoTween = gsap.to(orbit, {
        rotation: '+=360',
        duration: 42,
        repeat: -1,
        ease: 'none',
        onUpdate: keepCardsUpright
      });

      shell.addEventListener('pointerenter', function () { autoTween.pause(); });
      shell.addEventListener('pointerleave', function () {
        if (!dragging) autoTween.resume();
      });
      shell.addEventListener('pointerdown', function (event) {
        if (event.target.closest('a,button')) return;
        dragging = true;
        startX = event.clientX;
        startRotation = Number(gsap.getProperty(orbit, 'rotation')) || 0;
        shell.setPointerCapture(event.pointerId);
        autoTween.pause();
      });
      shell.addEventListener('pointermove', function (event) {
        if (!dragging) return;
        gsap.set(orbit, { rotation: startRotation + (event.clientX - startX) * 0.32 });
        keepCardsUpright();
      });
      shell.addEventListener('pointerup', function (event) {
        dragging = false;
        if (shell.hasPointerCapture(event.pointerId)) shell.releasePointerCapture(event.pointerId);
        autoTween.resume();
      });
      shell.addEventListener('pointercancel', function () { dragging = false; autoTween.resume(); });
    }

    var prev = shell.querySelector('[data-disc-prev]');
    var next = shell.querySelector('[data-disc-next]');
    if (prev) prev.addEventListener('click', function () { rotateBy(step); });
    if (next) next.addEventListener('click', function () { rotateBy(-step); });
  }

  function init() {
    initDocumentDisc();
    initSpecialFeatureScroller();
    if (reduceMotion) return;
    addProgressBar();
    animateHeaderAndHero();
    revealHeaders();
    animateNewsFocus();
    revealGroup('.home-news-reel', ':scope > .home-news-card', 38);
    revealGroup('.home-progress-reel', ':scope > .home-progress-card', 34);
    revealGroup('.home-case-reel', ':scope > .home-case-reel-card', 36);
    revealGroup('.impact-metrics-grid', ':scope > .impact-metric-card', 0);
    revealGroup('.mission-grid', ':scope > *', 0);
    revealGroup('.social-preview-grid', ':scope > *', 0);
    addReelSheen();
    animateDecorations();
    animateFooterToolbar();
    animateCraftedZones();
    animateSeaArt();
    animateSummerBeach();
    animateHearingZone();
    addCardTilt();
    window.setTimeout(function () { ScrollTrigger.refresh(); }, 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}());
