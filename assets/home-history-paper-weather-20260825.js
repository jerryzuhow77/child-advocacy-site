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

  function layerMarkup() {
    return '' +
      '<div class="home-map-sea-flow" aria-hidden="true"><span class="home-map-sea-grain"></span></div>' +
      '<svg class="home-map-weather-svg" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
        '<g class="home-map-wind-lines">' +
          '<path class="home-map-wind-path" d="M-120 164 C 120 52 352 248 650 138 S 1190 85 1718 236"></path>' +
          '<path class="home-map-wind-path" d="M-180 310 C 86 184 322 401 622 276 S 1168 232 1740 375"></path>' +
          '<path class="home-map-wind-path" d="M-96 456 C 180 348 390 505 692 405 S 1250 365 1696 482"></path>' +
        '</g>' +
        '<g class="home-map-sea-currents">' +
          '<path class="home-map-current-path" d="M650 492 C 846 402 984 548 1172 482 S 1455 400 1712 472"></path>' +
          '<path class="home-map-current-path" d="M720 625 C 912 530 1080 704 1288 608 S 1512 560 1720 640"></path>' +
          '<path class="home-map-current-path" d="M848 770 C 1040 674 1210 826 1430 718 S 1600 690 1738 724"></path>' +
        '</g>' +
      '</svg>' +
      '<span class="home-map-paper-cloud is-near"><i></i><i></i><b></b></span>' +
      '<span class="home-map-paper-cloud is-mid"><i></i><i></i><b></b></span>' +
      '<span class="home-map-paper-cloud is-far"><i></i><i></i><b></b></span>' +
      '<span class="home-map-wind-fleck" style="--fleck-top:15%;--fleck-size:13px"></span>' +
      '<span class="home-map-wind-fleck" style="--fleck-top:27%;--fleck-size:9px"></span>' +
      '<span class="home-map-wind-fleck is-lite-extra" style="--fleck-top:39%;--fleck-size:11px"></span>' +
      '<span class="home-map-wind-fleck is-lite-extra is-mobile-extra" style="--fleck-top:51%;--fleck-size:8px"></span>' +
      '<span class="home-map-wind-fleck is-lite-extra is-mobile-extra" style="--fleck-top:63%;--fleck-size:10px"></span>' +
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
    var windPaths = all('.home-map-wind-path', layer).slice(0, lite ? 2 : 3);
    var currentPaths = all('.home-map-current-path', layer).slice(0, lite ? 2 : 3);
    var clouds = all('.home-map-paper-cloud', layer).slice(0, lite ? 2 : 3);
    var flecks = all('.home-map-wind-fleck', layer).slice(0, lite ? 2 : 5);
    var seaGrain = layer.querySelector('.home-map-sea-grain');

    gsap.set(layer, { autoAlpha: 0 });
    animations.push(gsap.to(layer, { autoAlpha: 1, duration: .8, ease: 'power2.out', paused: true }));

    windPaths.forEach(function (path, index) {
      animations.push(gsap.to(path, {
        strokeDashoffset: -210 - index * 34,
        duration: 10.5 + index * 3.2,
        repeat: -1,
        ease: 'none',
        paused: true
      }));
      animations.push(gsap.to(path, {
        opacity: index === 0 ? .84 : .56,
        duration: 2.8 + index * .6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        paused: true
      }));
    });

    currentPaths.forEach(function (path, index) {
      animations.push(gsap.to(path, {
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

    clouds.forEach(function (cloud, index) {
      var duration = (lite ? 29 : 24) + index * 6;
      var travel = gsap.timeline({
        repeat: -1,
        repeatRefresh: true,
        delay: index * (lite ? 8 : 5.5),
        paused: true
      });
      travel
        .set(cloud, { x: function () { return -cloud.offsetWidth * 1.35; }, autoAlpha: 0, rotation: index % 2 ? -1.2 : .8 })
        .to(cloud, { autoAlpha: index === 0 ? .66 : .5, duration: 1.2, ease: 'sine.out' }, 0)
        .to(cloud, { x: function () { return figure.clientWidth + cloud.offsetWidth * 1.45; }, duration: duration, ease: 'none' }, 0)
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
        autoAlpha: 0
      }, {
        x: function () { return figure.clientWidth + 72; },
        y: index % 2 ? 13 : -11,
        rotation: index % 2 ? 170 : -165,
        autoAlpha: .72,
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
