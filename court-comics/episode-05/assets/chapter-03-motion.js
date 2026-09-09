(function () {
  'use strict';

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var embroideryStyles = ['emb-suzhou', 'emb-shu', 'emb-xiang', 'emb-yue', 'emb-suzhou', 'emb-suzhou', 'emb-shu', 'emb-xiang', 'emb-yue'];
  var embroideryLabels = ['蘇繡・雙面繡與套針暈色', '蜀繡・雲紋與蓮花暈針', '湘繡・立體葉片與深淺絲理', '粵繡・盤金與珠光結點', '蘇繡・套針暈色', '蘇繡・細密平針', '蜀繡・雲紋暈針', '湘繡・立體葉片', '粵繡・盤金珠結'];
  document.querySelectorAll('.scene').forEach(function (scene, index) {
    scene.classList.add(embroideryStyles[index] || 'emb-suzhou');
    var label = scene.querySelector('.embroidery-label');
    if (label && embroideryLabels[index]) label.textContent = embroideryLabels[index];
  });
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!gsap || !ScrollTrigger || reduced) return;

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });

  var mobile = window.matchMedia('(max-width: 760px)').matches;
  var hero = document.querySelector('.hero-card');
  var copy = document.querySelector('.hero-copy');
  var thread = document.querySelector('.gold-thread');
  var knots = document.querySelectorAll('.knot');

  if (hero && copy) {
    var opening = gsap.timeline({ defaults: { ease: 'power3.out' } });
    opening.fromTo(hero, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .85 })
      .fromTo(copy.children, { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: .55, stagger: .075 }, '-=.48');
    if (!mobile) {
      gsap.to(hero, {
        backgroundPosition: '56% 48%',
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top+=64', end: 'bottom top', scrub: .75 }
      });
    }
  }

  if (thread) {
    gsap.fromTo(thread, { scaleX: 0, autoAlpha: .25 }, { scaleX: 1, autoAlpha: 1, duration: 1.45, delay: .35, ease: 'power2.inOut' });
    gsap.to(thread, { filter: 'drop-shadow(0 1px 4px rgba(224,178,78,.9))', duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }
  if (knots.length) gsap.fromTo(knots, { scale: 0, rotate: -120 }, { scale: 1, rotate: 0, duration: .75, stagger: .16, delay: .65, ease: 'back.out(2)' });

  ScrollTrigger.batch('.chapter-nav a', {
    start: 'top 94%',
    once: true,
    onEnter: function (badges) {
      gsap.fromTo(badges, { autoAlpha: 0, scale: .76, rotate: -8 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: .7, stagger: .08, ease: 'back.out(1.8)', clearProps: 'transform,opacity,visibility' });
    }
  });

  ScrollTrigger.batch('.responsibility-step', {
    start: 'top 90%',
    once: true,
    onEnter: function (medallions) {
      gsap.fromTo(medallions, { autoAlpha: 0, scale: .82, y: mobile ? 14 : 24, rotateY: mobile ? 0 : -18 }, { autoAlpha: 1, scale: 1, y: 0, rotateY: 0, duration: .78, stagger: .11, ease: 'back.out(1.55)', clearProps: 'transform,opacity,visibility' });
    }
  });

  var responsibilityLine = document.querySelector('.responsibility-chain');
  if (responsibilityLine) {
    gsap.fromTo(responsibilityLine, { '--thread-reveal': '0%' }, {
      '--thread-reveal': '100%',
      ease: 'none',
      scrollTrigger: { trigger: responsibilityLine, start: 'top 85%', end: 'bottom 55%', scrub: .45 }
    });
  }

  var groups = ['.section-head', '.embroidery-key span', '.evidence-card', '.evidence-step', '.decision-card', '.lens', '.accountability', '.scene', '.matrix article', '.risk-cell', '.law-card', '.news-card', '.appeal-card', '.note', '.takeaway-ribbon article', '.source-calibration', '.info-chain-step', '.not-equal', '.medical-context', '.legal-question', '.record-field'];
  groups.forEach(function (selector) {
    ScrollTrigger.batch(selector, {
      start: 'top 90%',
      once: true,
      onEnter: function (items) {
        gsap.fromTo(items, { autoAlpha: 0, y: mobile ? 14 : 25 }, { autoAlpha: 1, y: 0, duration: mobile ? .42 : .65, stagger: mobile ? .035 : .07, ease: 'power2.out', clearProps: 'transform,opacity,visibility' });
      }
    });
  });

  ScrollTrigger.batch('.embroidery-label', {
    start: 'top 91%',
    once: true,
    onEnter: function (labels) {
      gsap.fromTo(labels, { autoAlpha: 0, scale: .82, rotate: -3 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: .72, stagger: .08, ease: 'back.out(1.8)', clearProps: 'transform,opacity,visibility' });
    }
  });

  var sampler = document.querySelector('.embroidery-sampler');
  if (sampler) {
    gsap.fromTo(sampler, { autoAlpha: .35, scale: 1.035 }, {
      autoAlpha: 1,
      scale: 1,
      duration: 1.15,
      ease: 'power2.out',
      scrollTrigger: { trigger: sampler, start: 'top 88%', once: true }
    });
    if (!mobile) {
      gsap.to(sampler, {
        yPercent: -2.2,
        ease: 'none',
        scrollTrigger: { trigger: sampler, start: 'top bottom', end: 'bottom top', scrub: .45 }
      });
    }
  }

  document.querySelectorAll('.scene-art').forEach(function (art) {
    gsap.fromTo(art, { scale: 1.11 }, {
      scale: 1.025,
      ease: 'none',
      scrollTrigger: { trigger: art, start: 'top bottom', end: 'bottom top', scrub: mobile ? .25 : .55 }
    });
  });

  ScrollTrigger.batch('.timeline tbody tr, .audit-table tbody tr, .tracking tbody tr, .decision-clock tbody tr', {
    start: 'top 94%',
    once: true,
    onEnter: function (rows) {
      gsap.fromTo(rows, { autoAlpha: 0, x: mobile ? 10 : 24 }, { autoAlpha: 1, x: 0, duration: .48, stagger: .055, ease: 'power2.out', clearProps: 'transform,opacity,visibility' });
    }
  });

  document.querySelectorAll('.chapter-nav a,.responsibility-step,.evidence-card,.evidence-step,.lens,.risk-cell,.law-card,.news-card,.appeal-card,.note,.source-calibration,.info-chain-step,.not-equal,.legal-question,.record-field').forEach(function (card) {
    card.addEventListener('pointerenter', function () {
      if (!mobile) gsap.to(card, { y: -5, duration: .24, ease: 'power2.out' });
    });
    card.addEventListener('pointerleave', function () {
      if (!mobile) gsap.to(card, { y: 0, duration: .3, ease: 'power2.out' });
    });
  });

  var progress = document.createElement('div');
  progress.setAttribute('aria-hidden', 'true');
  progress.style.cssText = 'position:fixed;top:0;left:0;z-index:50;width:100%;height:3px;transform-origin:left;background:linear-gradient(90deg,#a63e38,#e7c56d,#3f7d68);pointer-events:none';
  document.body.appendChild(progress);
  gsap.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: .15 } });

  document.querySelectorAll('details.scene-detail').forEach(function (detail) {
    detail.addEventListener('toggle', function () {
      window.requestAnimationFrame(function () { ScrollTrigger.refresh(); });
    });
  });

  window.addEventListener('load', function () { window.setTimeout(function () { ScrollTrigger.refresh(); }, 120); }, { once: true });
}());
