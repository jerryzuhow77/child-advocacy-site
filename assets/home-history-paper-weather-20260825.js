(function () {
  'use strict';

  var SELECTOR = '#home-historical-cases .home-history-static-map, #home-historical-cases .history-relief-figure';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = window.matchMedia('(max-width: 760px)').matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var controllers = [];
  var observer = null;
  var mutationFrame = 0;

  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function ribbonMarkup(type, path, extraClass) {
    var prefix = type === 'wind' ? 'home-map-wind' : 'home-map-current';
    return '' +
      '<g class="' + prefix + '-ribbon ' + (extraClass || '') + '">' +
        '<path class="' + prefix + '-shadow" d="' + path + '"></path>' +
        '<path class="' + prefix + '-edge" d="' + path + '"></path>' +
        '<path class="' + prefix + '-path" d="' + path + '"></path>' +
        '<path class="' + prefix + '-highlight" d="' + path + '"></path>' +
      '</g>';
  }

  function cloudMarkup(modifier, id) {
    var silhouette = 'M18 87 C7 81 10 67 24 64 C28 49 43 40 58 43 C67 24 87 17 105 27 C118 9 147 7 164 25 C184 19 207 31 209 51 C226 52 237 66 231 80 C237 88 228 99 216 99 H28 C15 99 8 91 18 87 Z';
    return '' +
      '<svg class="home-map-paper-cloud ' + modifier + '" viewBox="0 0 240 112" aria-hidden="true" focusable="false">' +
        '<defs>' +
          '<linearGradient id="paperCloudMid' + id + '" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0" stop-color="#f4f0d6"></stop><stop offset="1" stop-color="#cfd1b3"></stop>' +
          '</linearGradient>' +
          '<linearGradient id="paperCloudTop' + id + '" x1="0" y1="0" x2=".82" y2="1">' +
            '<stop offset="0" stop-color="#fffdf0"></stop><stop offset=".52" stop-color="#f3efd3"></stop><stop offset="1" stop-color="#dedcc0"></stop>' +
          '</linearGradient>' +
          '<pattern id="paperCloudFibre' + id + '" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">' +
            '<path d="M0 2 H14 M0 9 H14" stroke="#7d735e" stroke-width=".55" opacity=".34"></path>' +
            '<path d="M3 0 V14 M11 0 V14" stroke="#fff" stroke-width=".4" opacity=".46"></path>' +
          '</pattern>' +
        '</defs>' +
        '<path class="home-map-cloud-back" d="' + silhouette + '" transform="translate(0 9)"></path>' +
        '<path class="home-map-cloud-mid" fill="url(#paperCloudMid' + id + ')" d="' + silhouette + '" transform="translate(0 4.5)"></path>' +
        '<path class="home-map-cloud-top" fill="url(#paperCloudTop' + id + ')" d="' + silhouette + '"></path>' +
        '<path class="home-map-cloud-fibre" fill="url(#paperCloudFibre' + id + ')" d="' + silhouette + '"></path>' +
        '<path class="home-map-cloud-crease" d="M31 76 C67 69 83 78 112 70 S166 63 207 75"></path>' +
        '<path class="home-map-cloud-crease" d="M70 43 C88 48 103 46 119 36 M151 31 C168 37 179 38 193 45"></path>' +
        '<path class="home-map-cloud-glint" d="M34 59 C44 48 52 47 61 49 M120 25 C130 17 144 16 154 20"></path>' +
      '</svg>';
  }

  function layerMarkup() {
    return '' +
      '<div class="home-map-sea-flow" aria-hidden="true">' +
        '<span class="home-map-sea-sheet is-shallow"></span>' +
        '<span class="home-map-sea-sheet is-deep"></span>' +
        '<span class="home-map-sea-grain"></span>' +
      '</div>' +
      '<svg class="home-map-weather-svg" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
        '<g class="home-map-wind-lines">' +
          ribbonMarkup('wind', 'M-120 164 C 120 52 352 248 650 138 S 1190 85 1718 236') +
          ribbonMarkup('wind', 'M-180 310 C 86 184 322 401 622 276 S 1168 232 1740 375') +
          ribbonMarkup('wind', 'M-96 456 C 180 348 390 505 692 405 S 1250 365 1696 482') +
        '</g>' +
        '<g class="home-map-sea-currents">' +
          ribbonMarkup('current', 'M650 492 C 846 402 984 548 1172 482 S 1455 400 1712 472') +
          ribbonMarkup('current', 'M720 625 C 912 530 1080 704 1288 608 S 1512 560 1720 640') +
          ribbonMarkup('current', 'M848 770 C 1040 674 1210 826 1430 718 S 1600 690 1738 724') +
        '</g>' +
      '</svg>' +
      cloudMarkup('is-near', 'Near') +
      cloudMarkup('is-mid', 'Mid') +
      cloudMarkup('is-far', 'Far') +
      '<span class="home-map-wind-fleck is-warm" style="--fleck-top:15%;--fleck-size:13px"></span>' +
      '<span class="home-map-wind-fleck is-cool" style="--fleck-top:27%;--fleck-size:9px"></span>' +
      '<span class="home-map-wind-fleck is-lite-extra" style="--fleck-top:39%;--fleck-size:11px"></span>' +
      '<span class="home-map-wind-fleck is-lite-extra is-mobile-extra is-warm" style="--fleck-top:51%;--fleck-size:8px"></span>' +
      '<span class="home-map-wind-fleck is-lite-extra is-mobile-extra is-cool" style="--fleck-top:63%;--fleck-size:10px"></span>' +
      '<span class="home-map-paper-fibres" aria-hidden="true"></span>' +
      '<span class="home-map-weather-vignette" aria-hidden="true"></span>';
  }

  function pauseController(controller) {
    controller.visible = false;
    controller.animations.forEach(function (animation) { animation.pause(); });
  }

  function playController(controller) {
    controller.visible = true;
    if (document.hidden) return;
    controller.animations.forEach(function (animation) { animation.resume(); });
  }

  function observeController(controller) {
    if (!('IntersectionObserver' in window)) {
      playController(controller);
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var match = controllers.filter(function (item) { return item.figure === entry.target; })[0];
          if (!match) return;
          if (entry.isIntersecting && entry.intersectionRatio > .025) playController(match);
          else pauseController(match);
        });
      }, { threshold: [0, .025, .15] });
    }
    observer.observe(controller.figure);
  }

  function animateLayer(figure, layer) {
    var gsap = window.gsap;
    if (!gsap || reduceMotion) {
      layer.classList.add('is-static');
      return;
    }

    var lite = saveData || mobile;
    if (lite) layer.classList.add('paper-weather-lite');

    var animations = [];
    var windRibbons = all('.home-map-wind-ribbon', layer).slice(0, lite ? 2 : 3);
    var currentRibbons = all('.home-map-current-ribbon', layer).slice(0, lite ? 2 : 3);
    var clouds = all('.home-map-paper-cloud', layer).slice(0, lite ? 2 : 3);
    var flecks = all('.home-map-wind-fleck', layer).slice(0, lite ? 2 : 5);
    var seaGrain = layer.querySelector('.home-map-sea-grain');
    var seaSheets = all('.home-map-sea-sheet', layer).slice(0, lite ? 1 : 2);
    var paperFibres = layer.querySelector('.home-map-paper-fibres');

    gsap.set(layer, { autoAlpha: 0 });
    animations.push(gsap.to(layer, { autoAlpha: 1, duration: .8, ease: 'power2.out', paused: true }));

    windRibbons.forEach(function (ribbon, index) {
      var paths = all('path', ribbon);
      animations.push(gsap.to(paths, {
        strokeDashoffset: -210 - index * 34,
        duration: 10.5 + index * 3.2,
        repeat: -1,
        ease: 'none',
        paused: true
      }));
      animations.push(gsap.to(ribbon, {
        opacity: index === 0 ? .82 : .54,
        duration: 2.8 + index * .6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        paused: true
      }));
    });

    currentRibbons.forEach(function (ribbon, index) {
      animations.push(gsap.to(all('path', ribbon), {
        strokeDashoffset: 188 + index * 28,
        duration: 8.8 + index * 2.7,
        repeat: -1,
        ease: 'none',
        paused: true
      }));
    });

    if (seaGrain) {
      animations.push(gsap.to(seaGrain, {
        backgroundPositionX: '236px',
        backgroundPositionY: '72px',
        duration: lite ? 19 : 14,
        repeat: -1,
        ease: 'none',
        paused: true
      }));
      animations.push(gsap.to(seaGrain, {
        xPercent: 2.4,
        yPercent: -1.6,
        duration: 5.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        paused: true
      }));
    }

    seaSheets.forEach(function (sheet, index) {
      animations.push(gsap.to(sheet, {
        xPercent: index ? -3.5 : 4.2,
        yPercent: index ? 2.1 : -1.7,
        rotation: index ? -1.1 : .8,
        opacity: index ? .38 : .62,
        duration: 8.5 + index * 2.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        paused: true
      }));
    });

    if (paperFibres && !lite) {
      animations.push(gsap.to(paperFibres, {
        backgroundPositionX: '96px',
        backgroundPositionY: '34px',
        duration: 28,
        repeat: -1,
        ease: 'none',
        paused: true
      }));
    }

    clouds.forEach(function (cloud, index) {
      var duration = (lite ? 29 : 24) + index * 6;
      var travel = gsap.timeline({
        repeat: -1,
        repeatRefresh: true,
        delay: index * (lite ? 8 : 5.5),
        paused: true
      });
      travel
        .set(cloud, { x: function () { return -cloud.getBoundingClientRect().width * 1.35; }, autoAlpha: 0, rotation: index % 2 ? -1.2 : .8 })
        .to(cloud, { autoAlpha: index === 0 ? .74 : .58, duration: 1.2, ease: 'sine.out' }, 0)
        .to(cloud, { x: function () { return figure.clientWidth + cloud.getBoundingClientRect().width * 1.45; }, duration: duration, ease: 'none' }, 0)
        .to(cloud, { autoAlpha: 0, duration: 1.45, ease: 'sine.in' }, duration - 1.45);
      animations.push(travel);
      animations.push(gsap.to(cloud, {
        y: index % 2 ? 6 : -7,
        rotation: index % 2 ? 1.1 : -1,
        duration: 4.2 + index,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        paused: true
      }));
    });

    flecks.forEach(function (fleck, index) {
      animations.push(gsap.fromTo(fleck, {
        x: -42 - index * 16,
        y: index % 2 ? -5 : 5,
        rotation: index % 2 ? -12 : 15,
        rotationX: index % 2 ? 28 : -24,
        rotationY: index % 2 ? -18 : 22,
        transformPerspective: 180,
        autoAlpha: 0
      }, {
        x: function () { return figure.clientWidth + 72; },
        y: index % 2 ? 13 : -11,
        rotation: index % 2 ? 170 : -165,
        rotationX: index % 2 ? 332 : -318,
        rotationY: index % 2 ? 196 : -184,
        transformPerspective: 180,
        autoAlpha: .76,
        duration: 12 + index * 2.15,
        delay: 1.4 + index * 2.4,
        repeat: -1,
        repeatDelay: 2.2 + index * .55,
        repeatRefresh: true,
        ease: 'none',
        paused: true
      }));
    });

    var controller = { figure: figure, layer: layer, animations: animations, visible: false };
    controllers.push(controller);
    observeController(controller);
  }

  function enhanceFigure(figure) {
    if (!figure || figure.dataset.paperWeatherReady === 'true') return;
    var image = figure.querySelector('img');
    if (!image) return;
    figure.dataset.paperWeatherReady = 'true';
    figure.classList.add('has-paper-weather-map');

    var layer = document.createElement('div');
    layer.className = 'home-map-weather';
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML = layerMarkup();

    var caption = figure.querySelector('figcaption');
    figure.insertBefore(layer, caption || null);
    animateLayer(figure, layer);
  }

  function enhanceAll(root) {
    if (root && root.matches && root.matches(SELECTOR)) enhanceFigure(root);
    all(SELECTOR, root && root.querySelectorAll ? root : document).forEach(enhanceFigure);
  }

  function scheduleEnhance() {
    if (mutationFrame) return;
    mutationFrame = window.requestAnimationFrame(function () {
      mutationFrame = 0;
      enhanceAll(document);
    });
  }

  function init() {
    enhanceAll(document);
    var zone = document.getElementById('home-historical-cases');
    if (zone && 'MutationObserver' in window) {
      new MutationObserver(scheduleEnhance).observe(zone, { childList: true, subtree: true });
    }
    window.addEventListener('pageshow', scheduleEnhance);
    document.addEventListener('visibilitychange', function () {
      controllers.forEach(function (controller) {
        if (document.hidden) controller.animations.forEach(function (animation) { animation.pause(); });
        else if (controller.visible) controller.animations.forEach(function (animation) { animation.resume(); });
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
