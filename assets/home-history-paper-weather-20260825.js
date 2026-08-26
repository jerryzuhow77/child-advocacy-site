(function () {
  'use strict';

  var SELECTOR = '#home-historical-cases .home-history-static-map, #home-historical-cases .history-relief-figure';
  var scriptUrl = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = window.matchMedia('(max-width: 760px)').matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var controllers = [];
  var observer = null;
  var mutationFrame = 0;

  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function artUrl(filename) {
    if (!scriptUrl) return './assets/art/' + filename;
    return new URL('art/' + filename, scriptUrl).href;
  }

  function paperArtwork(trackClass, imageClass, filename) {
    return '' +
      '<span class="' + trackClass + '">' +
        '<img class="' + imageClass + '" src="' + artUrl(filename) + '" alt="" aria-hidden="true" draggable="false" loading="lazy" decoding="async">' +
      '</span>';
  }

  function paperFleck(fleckClass, top, size, filename) {
    var src = artUrl('paper-fragments-v1/' + filename);
    return '' +
      '<span class="home-map-wind-fleck ' + fleckClass + '" style="--fleck-top:' + top + ';--fleck-size:' + size + '">' +
        '<img class="home-map-wind-fleck-face" src="' + src + '" alt="" aria-hidden="true" draggable="false" decoding="async">' +
        '<img class="home-map-wind-fleck-back" src="' + src + '" alt="" aria-hidden="true" draggable="false" decoding="async">' +
      '</span>';
  }

  function layerMarkup(lite) {
    var cloudArt = 'paper-cloud-bank-v1.webp';
    var windArt = 'paper-wind-ribbon-v1.webp';
    var currentArt = 'paper-ocean-current-v1.webp';
    var extraCloud = lite ? '' : paperArtwork('home-map-paper-cloud is-far', 'home-map-paper-cloud-art', cloudArt);
    var extraWind = lite ? '' : paperArtwork('home-map-paper-wind is-wind-three', 'home-map-paper-wind-art', windArt);
    var extraCurrent = lite ? '' : paperArtwork('home-map-paper-current is-current-three', 'home-map-paper-current-art', currentArt);
    var extraFlecks = lite ? '' : '' +
      paperFleck('is-sage', '39%', '34px', 'fragment-03.webp') +
      paperFleck('is-ocean', '53%', '30px', 'fragment-04.webp') +
      paperFleck('is-gold', '66%', '36px', 'fragment-06.webp');

    return '' +
      '<div class="home-map-current-field" aria-hidden="true">' +
        paperArtwork('home-map-paper-current is-current-one', 'home-map-paper-current-art', currentArt) +
        paperArtwork('home-map-paper-current is-current-two', 'home-map-paper-current-art', currentArt) +
        extraCurrent +
        '<span class="home-map-sea-grain"></span>' +
      '</div>' +
      '<div class="home-map-wind-field" aria-hidden="true">' +
        paperArtwork('home-map-paper-wind is-wind-one', 'home-map-paper-wind-art', windArt) +
        paperArtwork('home-map-paper-wind is-wind-two', 'home-map-paper-wind-art', windArt) +
        extraWind +
      '</div>' +
      paperArtwork('home-map-paper-cloud is-near', 'home-map-paper-cloud-art', cloudArt) +
      paperArtwork('home-map-paper-cloud is-mid', 'home-map-paper-cloud-art', cloudArt) +
      extraCloud +
      paperFleck('is-ivory', '15%', '40px', 'fragment-01.webp') +
      paperFleck('is-ocean', '27%', '36px', 'fragment-02.webp') +
      (lite ? paperFleck('is-sage', '47%', '30px', 'fragment-05.webp') : '') +
      extraFlecks +
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
    var winds = all('.home-map-paper-wind', layer);
    var currents = all('.home-map-paper-current', layer);
    var clouds = all('.home-map-paper-cloud', layer);
    var flecks = all('.home-map-wind-fleck', layer);
    var seaGrain = layer.querySelector('.home-map-sea-grain');
    var paperFibres = layer.querySelector('.home-map-paper-fibres');

    gsap.set(layer, { autoAlpha: 0 });
    animations.push(gsap.to(layer, { autoAlpha: 1, duration: .72, ease: 'power2.out', paused: true }));

    winds.forEach(function (wind, index) {
      var travel = gsap.fromTo(wind, {
        x: -32 - index * 18,
        y: index % 2 ? 8 : -6,
        rotation: index % 2 ? -1.3 : 1.1,
        autoAlpha: index === 0 ? .9 : .7
      }, {
        x: 92 + index * 30,
        y: index % 2 ? -11 : 10,
        rotation: index % 2 ? 1.5 : -1.25,
        autoAlpha: index === 0 ? .98 : .82,
        duration: (lite ? 8.4 : 6.8) + index * 1.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        paused: true
      });
      travel.progress([.18, .54, .76][index] || .2);
      animations.push(travel);
      var windArt = wind.querySelector('.home-map-paper-wind-art');
      if (windArt) {
        gsap.set(windArt, { scaleX: index % 2 ? -1 : 1 });
        animations.push(gsap.to(windArt, {
          scaleX: index % 2 ? -.965 : 1.035,
          scaleY: index % 2 ? 1.03 : .975,
          duration: 3.4 + index * .7,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          paused: true
        }));
      }
    });

    currents.forEach(function (current, index) {
      var currentTravel = gsap.fromTo(current, {
        x: 42 + index * 22,
        y: index % 2 ? -5 : 8,
        rotation: index % 2 ? 1.2 : -1.05,
        autoAlpha: index === 0 ? .92 : .68
      }, {
        x: -68 - index * 26,
        y: index % 2 ? 13 : -12,
        rotation: index % 2 ? -1.35 : 1.2,
        autoAlpha: index === 0 ? .98 : .82,
        duration: (lite ? 9.2 : 7.1) + index * 1.35,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        paused: true
      });
      currentTravel.progress([.12, .48, .72][index] || .16);
      animations.push(currentTravel);
      var currentArt = current.querySelector('.home-map-paper-current-art');
      if (currentArt) {
        gsap.set(currentArt, { scaleX: index % 2 ? -1 : 1 });
        animations.push(gsap.to(currentArt, {
          scaleX: index % 2 ? -1.025 : .97,
          scaleY: index % 2 ? .965 : 1.045,
          y: index % 2 ? 4 : -5,
          duration: 3.8 + index * .8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          paused: true
        }));
      }
    });

    if (seaGrain) {
      animations.push(gsap.to(seaGrain, {
        backgroundPositionX: '280px',
        backgroundPositionY: '96px',
        xPercent: 4.5,
        yPercent: -2.8,
        duration: lite ? 14 : 10.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        paused: true
      }));
    }

    if (paperFibres && !lite) {
      animations.push(gsap.to(paperFibres, {
        backgroundPositionX: '88px',
        backgroundPositionY: '32px',
        duration: 26,
        repeat: -1,
        ease: 'none',
        paused: true
      }));
    }

    clouds.forEach(function (cloud, index) {
      var duration = (lite ? 26 : 22) + index * (lite ? 5 : 4.5);
      var progress = [0.12, 0.49, 0.73][index] || .16;
      var opacity = [0.94, 0.8, 0.66][index] || .72;
      var travel = gsap.timeline({ repeat: -1, repeatRefresh: true, paused: true });
      travel
        .set(cloud, {
          x: function () { return -cloud.getBoundingClientRect().width * 1.12; },
          autoAlpha: 0,
          rotation: index % 2 ? -1.4 : .9
        })
        .to(cloud, { autoAlpha: opacity, duration: .8, ease: 'sine.out' }, 0)
        .to(cloud, {
          x: function () { return figure.clientWidth + cloud.getBoundingClientRect().width * 1.18; },
          duration: duration,
          ease: 'none'
        }, 0)
        .to(cloud, { autoAlpha: 0, duration: .9, ease: 'sine.in' }, duration - .9);
      travel.progress(progress);
      animations.push(travel);

      var cloudArt = cloud.querySelector('.home-map-paper-cloud-art');
      if (cloudArt) animations.push(gsap.to(cloudArt, {
        y: index % 2 ? 7 : -8,
        rotation: index % 2 ? .7 : -.55,
        duration: 4.2 + index * .7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        paused: true
      }));
    });

    flecks.forEach(function (fleck, index) {
      var fleckDuration = (lite ? 14.2 : 11.4) + index * 1.25;
      var fleckTravel = gsap.timeline({
        repeat: -1,
        repeatDelay: .75 + index * .2,
        repeatRefresh: true,
        paused: true
      });
      fleckTravel
        .set(fleck, {
          x: -72 - index * 16,
          y: index % 2 ? -9 : 9,
          rotation: index % 2 ? -12 : 14,
          rotationX: index % 2 ? 18 : -16,
          rotationY: index % 2 ? -20 : 22,
          transformPerspective: 420,
          autoAlpha: 0
        })
        .to(fleck, { autoAlpha: .94, duration: .4, ease: 'sine.out' }, 0)
        .to(fleck, {
          x: function () { return figure.clientWidth + 94; },
          y: index % 2 ? 28 : -25,
          rotation: index % 2 ? 112 : -106,
          rotationX: index % 2 ? 158 : -146,
          rotationY: index % 2 ? 196 : -188,
          transformPerspective: 420,
          duration: fleckDuration,
          ease: 'none'
        }, 0)
        .to(fleck, { autoAlpha: 0, duration: .45, ease: 'sine.in' }, fleckDuration - .45);
      fleckTravel.progress((.08 + index * .18) % .9);
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

    var lite = saveData || mobile;
    var layer = document.createElement('div');
    layer.className = 'home-map-weather';
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML = layerMarkup(lite);

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

  function repairHomepageLatestReport() {
    var article = document.querySelector('.home-charity-feature');
    if (!article) return;

    var otherRegion = all('.historical-region-static').filter(function (item) {
      return item.textContent.trim() === '其他地區';
    })[0];
    if (otherRegion) otherRegion.remove();

    if (!article.querySelector('.home-charity-feature-copy')) {
      var copy = document.createElement('div');
      copy.className = 'home-charity-feature-copy';
      copy.innerHTML = '' +
        '<small>08.25 · 公益行動・款項公開</small>' +
        '<h3 id="homeLuoFeatureTitle">把共同的支持，<span>延續成另一份守護</span></h3>' +
        '<p>1/11「反廢死・護兒少大遊行」活動互助公費結餘新臺幣 27,128 元，已透過家屬公開募款管道，全數捐贈予羅氏兄弟。</p>' +
        '<div class="home-charity-feature-meta"><b>27,128 元全數捐贈</b><b>收據公開</b><b>關懷被害家庭</b></div>' +
        '<a class="home-charity-feature-link" href="./activity-records/20260825-111-surplus-donation/">閱讀完整公告與捐贈證明 <span aria-hidden="true">→</span></a>';
      article.appendChild(copy);
    }

    if (!document.getElementById('home-latest-desktop-repair-20260826')) {
      var style = document.createElement('style');
      style.id = 'home-latest-desktop-repair-20260826';
      style.textContent = '@media(min-width:761px){' +
        '.home-civic-film,.home-civic-film-track,.home-civic-film-slide{display:block!important;position:relative!important;visibility:visible!important;opacity:1!important;transform:none!important}' +
        '.home-charity-feature{grid-template-columns:minmax(320px,.88fr) minmax(440px,1.12fr)!important;min-height:540px!important;opacity:1!important;visibility:visible!important;transform:none!important}' +
        '.home-charity-feature-media{position:relative!important;inset:auto!important;grid-column:2;grid-row:1;min-width:0;min-height:540px;background:#6d3b2b}' +
        '.home-charity-feature-bg{display:block!important;visibility:visible!important;opacity:1!important;object-position:center}' +
        '.home-charity-feature-proof{right:6%;width:88%;max-height:84%;opacity:1!important;visibility:visible!important}' +
        '.home-charity-feature-media:after{background:linear-gradient(90deg,rgba(66,28,18,.22),rgba(79,35,24,.04) 38%,rgba(79,35,24,0) 72%)}' +
        '.home-charity-feature-copy{grid-column:1;grid-row:1;align-self:stretch;display:flex!important;flex-direction:column;justify-content:center;max-width:none;padding:clamp(34px,4.3vw,68px);background:linear-gradient(145deg,rgba(58,23,17,.98),rgba(91,42,29,.92));text-shadow:0 2px 14px rgba(25,8,5,.34)}' +
      '}';
      document.head.appendChild(style);
    }
  }

  function init() {
    repairHomepageLatestReport();
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
