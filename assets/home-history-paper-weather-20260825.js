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
      '<span class="home-map-wind-fleck is-warm" style="--fleck-top:14%;--fleck-size:19px"></span>' +
      '<span class="home-map-wind-fleck is-cool" style="--fleck-top:26%;--fleck-size:15px"></span>' +
      '<span class="home-map-wind-fleck is-lite-extra" style="--fleck-top:39%;--fleck-size:17px"></span>' +
      '<span class="home-map-wind-fleck is-lite-extra is-mobile-extra is-warm" style="--fleck-top:51%;--fleck-size:13px"></span>' +
      '<span class="home-map-wind-fleck is-lite-extra is-mobile-extra is-cool" style="--fleck-top:64%;--fleck-size:16px"></span>' +
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
        strokeDashoffset: -250 - index * 42,
        duration: 5.6 + index * 1.35,
        repeat: -1,
        ease: 'none',
        paused: true
      }));
      animations.push(gsap.to(ribbon, {
        x: 34 + index * 12,
        y: index % 2 ? -7 : 6,
        opacity: index === 0 ? .96 : .72,
        duration: 4.2 + index * .65,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        paused: true
      }));
    });

    currentRibbons.forEach(function (ribbon, index) {
      animations.push(gsap.to(all('path', ribbon), {
        strokeDashoffset: 230 + index * 36,
        duration: 4.9 + index * 1.2,
        repeat: -1,
        ease: 'none',
        paused: true
      }));
      animations.push(gsap.to(ribbon, {
        x: -28 - index * 10,
        y: index % 2 ? 9 : -6,
        rotation: index % 2 ? -.35 : .3,
        duration: 4.6 + index * .8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        paused: true
      }));
    });

    if (seaGrain) {
      animations.push(gsap.to(seaGrain, {
        backgroundPositionX: '304px',
        backgroundPositionY: '108px',
        duration: lite ? 12.5 : 9.5,
        repeat: -1,
        ease: 'none',
        paused: true
      }));
      animations.push(gsap.to(seaGrain, {
        xPercent: 5.6,
        yPercent: -3.1,
        duration: 4.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        paused: true
      }));
    }

    seaSheets.forEach(function (sheet, index) {
      animations.push(gsap.to(sheet, {
        xPercent: index ? -8.5 : 10.2,
        yPercent: index ? 4.4 : -3.8,
        rotation: index ? -1.8 : 1.45,
        opacity: index ? .54 : .78,
        duration: 6.2 + index * 1.4,
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
      var duration = (lite ? 18 : 14.5) + index * (lite ? 4.5 : 3.8);
      var cloudProgress = [0.14, 0.48, 0.72][index] || .18;
      var cloudOpacity = [0.9, 0.76, 0.62][index] || .7;
      var travel = gsap.timeline({
        repeat: -1,
        repeatRefresh: true,
        paused: true
      });
      travel
        .set(cloud, { x: function () { return -cloud.getBoundingClientRect().width * 1.18; }, autoAlpha: 0, rotation: index % 2 ? -1.8 : 1.25 })
        .to(cloud, { autoAlpha: cloudOpacity, duration: .72, ease: 'sine.out' }, 0)
        .to(cloud, { x: function () { return figure.clientWidth + cloud.getBoundingClientRect().width * 1.24; }, duration: duration, ease: 'none' }, 0)
        .to(cloud, { autoAlpha: 0, duration: .82, ease: 'sine.in' }, duration - .82);
      travel.progress(cloudProgress);
      animations.push(travel);
      animations.push(gsap.to(cloud, {
        y: index % 2 ? 12 : -13,
        rotation: index % 2 ? 2.2 : -1.9,
        duration: 3.2 + index * .55,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        paused: true
      }));
    });

    flecks.forEach(function (fleck, index) {
      var fleckDuration = (lite ? 8.8 : 7.2) + index * 1.05;
      var fleckTravel = gsap.timeline({
        repeat: -1,
        repeatDelay: .55 + index * .18,
        repeatRefresh: true,
        paused: true
      });
      fleckTravel
        .set(fleck, {
          x: -64 - index * 18,
          y: index % 2 ? -8 : 8,
          rotation: index % 2 ? -16 : 18,
          rotationX: index % 2 ? 32 : -28,
          rotationY: index % 2 ? -22 : 26,
          transformPerspective: 180,
          autoAlpha: 0
        })
        .to(fleck, { autoAlpha: .92, duration: .34, ease: 'sine.out' }, 0)
        .to(fleck, {
          x: function () { return figure.clientWidth + 88; },
          y: index % 2 ? 22 : -19,
          rotation: index % 2 ? 190 : -184,
          rotationX: index % 2 ? 348 : -336,
          rotationY: index % 2 ? 214 : -206,
          transformPerspective: 180,
          duration: fleckDuration,
          ease: 'none'
        }, 0)
        .to(fleck, { autoAlpha: 0, duration: .42, ease: 'sine.in' }, fleckDuration - .42);
      fleckTravel.progress((.08 + index * .19) % .92);
      animations.push(fleckTravel);
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
