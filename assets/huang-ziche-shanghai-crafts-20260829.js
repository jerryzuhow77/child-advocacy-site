(() => {
  'use strict';

  const page = document.querySelector('.hz-page');
  if (!page) return;

  const ids = ['before', 'taken', 'unseen', 'abuse', 'last-day', 'hospital', 'verdict', 'father', 'precedents', 'protection'];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = matchMedia('(max-width: 900px)').matches;
  const rail = document.querySelector('.hz-lantern-rail');
  const links = rail ? [...rail.querySelectorAll('.hz-rail-link')] : [];
  const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
  const craftCycle = ['rongxiu', 'jade', 'guxiu', 'lantern'];

  /* v8 stage craft system: every puppet scene shares Gu-embroidery thread,
     translucent jade light and Shanghai lantern motion. */
  const decoratePuppetLayer = (layer, index) => {
    if (!layer || layer.querySelector('.hz-puppet-craft-layer')) return;
    const craft = document.createElement('div');
    craft.className = 'hz-puppet-craft-layer';
    craft.setAttribute('aria-hidden', 'true');
    craft.dataset.craftIndex = String(index);
    craft.innerHTML = '<i class="hz-stage-paper-wing hz-stage-paper-wing--left"></i><i class="hz-stage-paper-wing hz-stage-paper-wing--right"></i><i class="hz-stage-jade-aura"></i><i class="hz-stage-jade-medallion hz-stage-jade-medallion--left"></i><i class="hz-stage-jade-medallion hz-stage-jade-medallion--right"></i><i class="hz-stage-lantern-core"></i><i class="hz-stage-lantern-orbit"></i><i class="hz-stage-guxiu-thread hz-stage-guxiu-thread--one"></i><i class="hz-stage-guxiu-thread hz-stage-guxiu-thread--two"></i><i class="hz-stage-guxiu-thread hz-stage-guxiu-thread--three"></i>';
    layer.append(craft);
  };

  const puppetLayers = [
    document.querySelector('.tt-stage > .tt-pose-layer--opening'),
    ...document.querySelectorAll('.tt-transition[data-shadow-scene] .tt-pose-layer')
  ].filter(Boolean);
  puppetLayers.forEach(decoratePuppetLayer);

  if (!page.querySelector('.hz-ambient-crafts')) {
    const ambientCrafts = document.createElement('div');
    ambientCrafts.className = 'hz-ambient-crafts';
    ambientCrafts.setAttribute('aria-hidden', 'true');
    ambientCrafts.innerHTML = '<i class="hz-ambient-craft hz-ambient-craft--guxiu"></i><i class="hz-ambient-craft hz-ambient-craft--rongxiu"></i><i class="hz-ambient-craft hz-ambient-craft--jade"></i><i class="hz-ambient-craft hz-ambient-craft--lantern"></i>';
    page.prepend(ambientCrafts);
  }

  sections.forEach((section, index) => {
    section.dataset.hzCraft = craftCycle[index % craftCycle.length];
  });

  const setRail = () => {
    const marker = innerHeight * .36;
    let current = 0;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= marker) current = index;
    });
    links.forEach((link, index) => {
      link.classList.toggle('is-current', index === current);
      link.classList.toggle('is-read', index < current);
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  setRail();
  addEventListener('scroll', setRail, { passive: true });
  addEventListener('resize', setRail, { passive: true });

  links.forEach(link => link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }));

  const topButton = document.querySelector('.hz-back-top');
  const setTop = () => topButton?.classList.toggle('is-visible', scrollY > innerHeight * .7);
  setTop();
  addEventListener('scroll', setTop, { passive: true });
  topButton?.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  /* The supplied score is intentionally page-specific. Autoplay is attempted,
     then released on the visitor's first gesture when browser policy blocks it. */
  const audio = document.querySelector('[data-hz-audio]');
  const audioButton = document.querySelector('[data-hz-audio-toggle]');
  const audioLabel = audioButton?.querySelector('[data-hz-audio-label]');
  const openingAudioButton = document.querySelector('[data-hz-opening-audio]');
  const storageKey = 'huang-ziche-background-music-paused';
  let wantsPlayback = true;
  let unlockBound = false;

  try {
    wantsPlayback = localStorage.getItem(storageKey) !== '1';
  } catch (_) {
    wantsPlayback = true;
  }

  const audioText = playing => {
    if (!audioButton) return '';
    const isHans = document.documentElement.lang.toLowerCase() === 'zh-hans';
    if (playing) return isHans ? audioButton.dataset.labelPauseHans : audioButton.dataset.labelPause;
    return isHans ? audioButton.dataset.labelPlayHans : audioButton.dataset.labelPlay;
  };

  const updateAudioControl = () => {
    if (!audio || !audioButton) return;
    const playing = !audio.paused;
    const label = audioText(playing);
    audioButton.setAttribute('aria-pressed', playing ? 'true' : 'false');
    audioButton.setAttribute('aria-label', label);
    if (audioLabel) audioLabel.textContent = label;
    if (openingAudioButton) {
      openingAudioButton.setAttribute('aria-pressed', playing ? 'true' : 'false');
      const openingLabel = playing ? openingAudioButton.dataset.labelPause : openingAudioButton.dataset.labelPlay;
      openingAudioButton.setAttribute('aria-label', openingLabel || label);
      const span = openingAudioButton.querySelector('span');
      if (span) span.textContent = openingLabel || label;
    }
  };

  const removeUnlock = () => {
    if (!unlockBound) return;
    unlockBound = false;
    document.removeEventListener('pointerdown', unlockAudio, true);
    document.removeEventListener('keydown', unlockAudio, true);
  };

  const playAudio = async () => {
    if (!audio || !wantsPlayback) return false;
    audio.volume = Math.max(.01, Math.min(.3, Number(audio.volume) || .28));
    try {
      await audio.play();
      removeUnlock();
      updateAudioControl();
      return true;
    } catch (_) {
      updateAudioControl();
      return false;
    }
  };

  function unlockAudio(event) {
    if (audioButton && event.target instanceof Node && audioButton.contains(event.target)) return;
    playAudio();
  }

  const bindUnlock = () => {
    if (unlockBound || !audio || !wantsPlayback) return;
    unlockBound = true;
    document.addEventListener('pointerdown', unlockAudio, true);
    document.addEventListener('keydown', unlockAudio, true);
  };

  const opening = document.querySelector('[data-tt-opening]');
  const replayOpening = document.querySelector('[data-tt-replay]');
  if (opening) wantsPlayback = true;

  if (audio) {
    audio.volume = .28;
    audio.addEventListener('play', updateAudioControl);
    audio.addEventListener('pause', updateAudioControl);
    audio.addEventListener('error', () => {
      audioButton?.setAttribute('disabled', '');
      audioButton?.setAttribute('aria-label', document.documentElement.lang.toLowerCase() === 'zh-hans' ? '背景音乐无法播放' : '背景音樂無法播放');
    });
    updateAudioControl();

    if (wantsPlayback) {
      requestAnimationFrame(async () => {
        const started = await playAudio();
        if (!started) bindUnlock();
      });
    }
  }

  const startOpeningScore = () => {
    wantsPlayback = true;
    if (audio) {
      audio.currentTime = audio.currentTime || 0;
      playAudio().then(started => { if (!started) bindUnlock(); });
    }
  };
  opening?.addEventListener('pointerdown', startOpeningScore, { capture: true });
  replayOpening?.addEventListener('pointerdown', startOpeningScore, { capture: true });
  addEventListener('pageshow', () => { if (opening && !opening.hidden) playAudio().then(started => { if (!started) bindUnlock(); }); }, { once: true });

  openingAudioButton?.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    audioButton?.click();
  });

  audioButton?.addEventListener('click', async () => {
    if (!audio) return;
    if (audio.paused) {
      wantsPlayback = true;
      try { localStorage.removeItem(storageKey); } catch (_) { /* storage may be unavailable */ }
      const started = await playAudio();
      if (!started) bindUnlock();
    } else {
      wantsPlayback = false;
      audio.pause();
      removeUnlock();
      try { localStorage.setItem(storageKey, '1'); } catch (_) { /* storage may be unavailable */ }
    }
    updateAudioControl();
  });

  /* GSAP carries motion across the same craft roles: thread drift, jade light,
     lantern navigation and a restrained proscenium entrance. */
  if (!reduce && window.gsap) {
    if (window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);

    document.querySelectorAll('.hz-puppet-craft-layer').forEach((craft, index) => {
      const jade = craft.querySelector('.hz-stage-jade-aura');
      const lantern = craft.querySelector('.hz-stage-lantern-core');
      const orbit = craft.querySelector('.hz-stage-lantern-orbit');
      const threads = craft.querySelectorAll('.hz-stage-guxiu-thread');
      const paperWings = craft.querySelectorAll('.hz-stage-paper-wing');
      const jadeMedallions = craft.querySelectorAll('.hz-stage-jade-medallion');
      const trigger = craft.closest('.tt-opening, .tt-transition') || craft;
      const puppetActors = trigger.querySelectorAll('.tt-pose-actor, .tt-ending-theatre-puppet');
      const timeline = gsap.timeline({
        scrollTrigger: trigger.classList.contains('tt-opening') ? undefined : {
          trigger,
          start: 'top 82%',
          once: true
        },
        defaults: { ease: 'power2.out' }
      });
      timeline
        .fromTo(jade, { opacity: 0, scale: .86 }, { opacity: .66, scale: 1, duration: 1.15 }, 0)
        .fromTo(lantern, { opacity: 0, y: -14, scale: .6 }, { opacity: .92, y: 0, scale: 1, duration: .9 }, .18)
        .fromTo(orbit, { opacity: 0, rotation: -28, scale: .72 }, { opacity: .72, rotation: 0, scale: 1, duration: 1.2 }, .25)
        .fromTo(paperWings, { opacity: 0, scaleX: .72 }, { opacity: .72, scaleX: 1, stagger: .1, duration: 1.05 }, .1)
        .fromTo(jadeMedallions, { opacity: 0, scale: .55, rotation: -12 }, { opacity: .82, scale: 1, rotation: 0, stagger: .12, duration: .95 }, .22)
        .fromTo(threads, { opacity: 0, scaleX: 0 }, { opacity: .8, scaleX: 1, stagger: .14, duration: 1.15 }, .4);
      gsap.to(lantern, { y: index % 2 ? 5 : -5, rotation: index % 2 ? 2 : -2, duration: 2.2 + index * .08, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to(orbit, { rotation: 360, duration: 13 + index, repeat: -1, ease: 'none' });
      gsap.to(paperWings, { filter: 'brightness(1.16) saturate(1.08)', duration: 3.2 + index * .1, repeat: -1, yoyo: true, stagger: .2, ease: 'sine.inOut' });
      gsap.to(jadeMedallions, { rotation: index % 2 ? 4 : -4, scale: 1.035, duration: 3.6, repeat: -1, yoyo: true, stagger: .25, ease: 'sine.inOut' });
      if (puppetActors.length) {
        gsap.fromTo(puppetActors, { opacity: 0, y: 14, rotation: index % 2 ? 1.2 : -1.2 }, { opacity: 1, y: 0, rotation: 0, duration: 1.1, stagger: .18, ease: 'power2.out', scrollTrigger: trigger.classList.contains('tt-opening') ? undefined : { trigger, start: 'top 84%', once: true } });
        puppetActors.forEach((actor, actorIndex) => gsap.to(actor, { y: actorIndex % 2 ? -3 : 3, rotation: actorIndex % 2 ? -.45 : .45, duration: 3.8 + actorIndex * .45 + index * .08, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: '50% 100%' }));
      }
      gsap.to(threads, { '--hz-thread-shimmer': '1', duration: 2.8 + index * .12, repeat: -1, yoyo: true, stagger: .18, ease: 'sine.inOut' });
    });


    const openingStage = document.querySelector('.tt-opening .tt-stage');
    if (openingStage) {
      gsap.fromTo(openingStage, { opacity: 0, scale: .985 }, {
        opacity: 1,
        scale: 1,
        duration: 1.15,
        ease: 'power2.out'
      });
      const openingCraftLayer = openingStage.querySelector('.tt-pose-layer--opening');
      if (openingCraftLayer) {
        gsap.to(openingCraftLayer, {
          '--hz-stage-craft-x': mobile ? '1.4%' : '2.4%',
          '--hz-stage-craft-glow': mobile ? .72 : .68,
          duration: 4.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }
      const openingWoman = openingStage.querySelector('.tt-pose-actor--woman');
      const openingScribe = openingStage.querySelector('.tt-pose-actor--scribe');
      if (openingWoman && openingScribe) {
        const actors = [openingWoman, openingScribe];
        const light = openingStage.querySelector('.tt-ronghua--opening');
        let entrancePlayed = false;
        let womanIdle;
        let scribeIdle;

        gsap.set(actors, { transformOrigin: '50% 94%', willChange: 'transform,opacity,filter' });

        const startIdle = () => {
          womanIdle?.kill();
          scribeIdle?.kill();
          womanIdle = gsap.to(openingWoman, {
            y: mobile ? -5 : -9,
            rotation: -1.15,
            duration: 1.85,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
          scribeIdle = gsap.to(openingScribe, {
            y: mobile ? -4 : -7,
            rotation: .95,
            duration: 2.15,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        };

        const playEntrance = () => {
          womanIdle?.kill();
          scribeIdle?.kill();
          gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: startIdle })
            .fromTo(openingWoman,
              { autoAlpha: 0, xPercent: mobile ? -24 : -34, yPercent: 8, rotation: -4, scale: .92 },
              { autoAlpha: 1, xPercent: 0, yPercent: 0, rotation: 0, scale: 1, duration: 1.25 }, 0)
            .fromTo(openingScribe,
              { autoAlpha: 0, xPercent: mobile ? 24 : 34, yPercent: 8, rotation: 4, scale: .92 },
              { autoAlpha: 1, xPercent: 0, yPercent: 0, rotation: 0, scale: 1, duration: 1.25 }, .16);
          if (light) gsap.fromTo(light,
            { opacity: .12, scale: .82 },
            { opacity: .78, scale: 1.06, duration: 1.55, ease: 'sine.out' });
        };

        const cueShadowScene = index => {
          if (index === 0 && (!entrancePlayed || !document.body.classList.contains('tt-opening-active'))) {
            entrancePlayed = true;
            playEntrance();
            return;
          }
          const womanSpeaks = index === 0 || index === 2;
          const scribeSpeaks = index === 1 || index === 3;
          womanIdle?.pause();
          scribeIdle?.pause();
          const amount = mobile ? 5 : 8;
          const scene = gsap.timeline({
            defaults: { overwrite: 'auto' },
            onComplete: startIdle
          });

          if (index === 4) {
            scene
              .to(openingWoman, { xPercent: amount, y: -8, rotation: .7, duration: .65, ease: 'power2.out' }, 0)
              .to(openingScribe, { xPercent: -amount, y: -7, rotation: -.65, duration: .65, ease: 'power2.out' }, 0)
              .to(actors, { xPercent: 0, y: 0, rotation: 0, duration: .95, ease: 'sine.inOut' }, .8);
          } else {
            const speaker = womanSpeaks ? openingWoman : openingScribe;
            const listener = womanSpeaks ? openingScribe : openingWoman;
            scene
              .to(speaker, {
                xPercent: womanSpeaks ? amount : -amount,
                y: mobile ? -7 : -11,
                rotation: womanSpeaks ? 1.15 : -1.05,
                scale: 1.025,
                duration: .56,
                ease: 'power2.out'
              }, 0)
              .to(listener, {
                xPercent: womanSpeaks ? 1.5 : -1.5,
                rotation: womanSpeaks ? .35 : -.35,
                duration: .7,
                ease: 'sine.out'
              }, .08)
              .to(speaker, { xPercent: 0, y: 0, rotation: 0, scale: 1, duration: .9, ease: 'sine.inOut' }, .72)
              .to(listener, { xPercent: 0, rotation: 0, duration: .82, ease: 'sine.inOut' }, .82);
          }
          if (light) scene.to(light, { opacity: scribeSpeaks ? .58 : .82, duration: .45, yoyo: true, repeat: 1 }, 0);
        };

        document.addEventListener('tt:opening-scene', event => cueShadowScene(Number(event.detail?.index || 0)));
        document.addEventListener('tt:opening-close', () => {
          womanIdle?.pause();
          scribeIdle?.pause();
          entrancePlayed = false;
        });
        cueShadowScene(0);
      }
    }

    if (window.ScrollTrigger) {
      const heroArt = document.querySelector('.tt-hero-art');
      if (heroArt) {
        gsap.fromTo(heroArt, { opacity: .4, y: 24 }, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: heroArt, start: 'top 92%', once: true }
        });
      }

      sections.forEach((section, index) => {
        gsap.to(section, {
          '--hz-craft-x': index % 2 ? '-32px' : '32px',
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: .7 }
        });
      });

      document.querySelectorAll('.tt-transition .tt-shadow-stage').forEach(stage => {
        gsap.fromTo(stage, { filter: 'brightness(.78) saturate(.84)' }, {
          filter: 'brightness(1) saturate(1)',
          ease: 'none',
          scrollTrigger: { trigger: stage, start: 'top 88%', end: 'center 42%', scrub: .55 }
        });
        const craftLayer = stage.querySelector('.tt-pose-layer');
        if (craftLayer) {
          gsap.fromTo(craftLayer,
            { '--hz-stage-craft-x': '-1.2%', '--hz-stage-craft-glow': .48 },
            { '--hz-stage-craft-x': '1.2%', '--hz-stage-craft-glow': .7, duration: 3.8, ease: 'sine.inOut',
              scrollTrigger: { trigger: stage, start: 'top 90%', end: 'bottom 15%', scrub: .65 } });
        }
        const woman = stage.querySelector('.tt-pose-actor--woman');
        const scribe = stage.querySelector('.tt-pose-actor--scribe');
        if (woman && scribe) {
          gsap.fromTo(woman,
            { autoAlpha: 0, xPercent: mobile ? -14 : -22, yPercent: 5, rotation: -2.5 },
            { autoAlpha: 1, xPercent: 0, yPercent: 0, rotation: 0, duration: 1.05, ease: 'power3.out',
              scrollTrigger: { trigger: stage, start: 'top 86%', once: true } });
          gsap.fromTo(scribe,
            { autoAlpha: 0, xPercent: mobile ? 14 : 22, yPercent: 5, rotation: 2.5 },
            { autoAlpha: 1, xPercent: 0, yPercent: 0, rotation: 0, duration: 1.05, delay: .12, ease: 'power3.out',
              scrollTrigger: { trigger: stage, start: 'top 86%', once: true } });
        }
      });

      document.querySelectorAll('.hz-classical-echo').forEach((echo, index) => {
        const quote = echo.querySelector('p');
        const explanation = echo.querySelector('span');
        const source = echo.querySelector('cite');
        gsap.fromTo(echo, {
          opacity: 0,
          x: index % 2 ? 18 : -18
        }, {
          opacity: 1,
          x: 0,
          duration: .9,
          ease: 'power2.out',
          scrollTrigger: { trigger: echo, start: 'top 88%', once: true }
        });
        gsap.fromTo([quote, source, explanation], {
          opacity: 0,
          y: 10
        }, {
          opacity: 1,
          y: 0,
          duration: .7,
          stagger: .12,
          ease: 'power2.out',
          scrollTrigger: { trigger: echo, start: 'top 84%', once: true }
        });
      });

      const socialPoster = document.querySelector('.hz-social-poster');
      const socialPosterImage = socialPoster?.querySelector('img');
      if (socialPoster && socialPosterImage) {
        gsap.fromTo(socialPosterImage, {
          opacity: .18,
          y: 30,
          rotate: .8,
          scale: .975
        }, {
          opacity: 1,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 1.25,
          ease: 'power3.out',
          scrollTrigger: { trigger: socialPoster, start: 'top 82%', once: true }
        });
      }
    }
  }


  const endingStage = document.querySelector('.tt-ending-theatre-stage');
  if (endingStage && !endingStage.querySelector('.hz-ending-master-craft')) {
    const masterCraft = document.createElement('div');
    masterCraft.className = 'hz-ending-master-craft';
    masterCraft.setAttribute('aria-hidden', 'true');
    masterCraft.innerHTML = '<i class="hz-ending-jade-arch"></i><i class="hz-ending-paper-canopy"></i><span class="hz-ending-lantern-node hz-ending-lantern-node--one"></span><span class="hz-ending-lantern-node hz-ending-lantern-node--two"></span><span class="hz-ending-lantern-node hz-ending-lantern-node--three"></span><span class="hz-ending-guxiu-vine hz-ending-guxiu-vine--one"></span><span class="hz-ending-guxiu-vine hz-ending-guxiu-vine--two"></span>';
    endingStage.prepend(masterCraft);
  }

  const ending = document.querySelector('.tt-ending');
  if (!ending) return;

  const words = [...ending.querySelectorAll('.hz-lantern-words span')];
  const paths = [...ending.querySelectorAll('.hz-gu-embroidery path')];
  const curtains = [...ending.querySelectorAll('.hz-ending-curtain i')];
  const finalCopy = ending.querySelector('.hz-ending-final');
  const finalReveal = ending.querySelector('.hz-ending-reveal');
  const finalRevealImage = finalReveal?.querySelector('img');
  const scriptLines = [...ending.querySelectorAll('.tt-ending-theatre-script p')];
  const masterCraft = ending.querySelector('.hz-ending-master-craft');
  const jadeArch = ending.querySelector('.hz-ending-jade-arch');
  const paperCanopy = ending.querySelector('.hz-ending-paper-canopy');
  const lanternNodes = [...ending.querySelectorAll('.hz-ending-lantern-node')];
  const guxiuVines = [...ending.querySelectorAll('.hz-ending-guxiu-vine')];
  let played = false;
  let finaleTimeline = null;

  const finish = () => {
    ending.classList.add('is-haipai-playing', 'is-haipai-complete');
    words.forEach(element => {
      element.style.opacity = '1';
      element.style.transform = 'none';
    });
    paths.forEach(element => { element.style.strokeDashoffset = '0'; });
    scriptLines.forEach(element => {
      element.style.opacity = '1';
      element.style.transform = 'none';
    });
    curtains.forEach(element => { element.style.transform = 'scaleX(1)'; });
    if (masterCraft) masterCraft.style.opacity = '1';
    if (jadeArch) jadeArch.style.opacity = '.82';
    if (paperCanopy) paperCanopy.style.opacity = '.9';
    lanternNodes.forEach(element => { element.style.opacity = '1'; });
    guxiuVines.forEach(element => { element.style.opacity = '.86'; element.style.transform = 'scaleX(1)'; });
    if (finalReveal) finalReveal.style.opacity = '1';
    if (finalRevealImage) finalRevealImage.style.transform = 'scale(1)';
    if (finalCopy) {
      finalCopy.style.opacity = '1';
      finalCopy.style.transform = 'none';
    }
  };

  const play = () => {
    if (played) return;
    played = true;

    if (reduce || !window.gsap) {
      finish();
      return;
    }

    ending.classList.add('is-haipai-playing');
    const lantern = ending.querySelector('.hz-carousel-lantern');
    const door = ending.querySelector('.hz-jade-door');
    const water = ending.querySelector('.hz-wool-water');
    const puppets = ending.querySelectorAll('.tt-ending-theatre-puppet');
    const curtainAt = mobile ? 9.2 : 13.8;
    const revealAt = mobile ? 10.65 : 15.95;
    const finalAt = mobile ? 11.35 : 17.05;

    gsap.set(masterCraft, { opacity: 1 });
    gsap.set(guxiuVines, { transformOrigin: 'center center' });

    const timeline = finaleTimeline = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: () => ending.classList.add('is-haipai-complete')
    });

    timeline
      .fromTo(masterCraft, { opacity: 0 }, { opacity: 1, duration: .65 }, 0)
      .fromTo(paperCanopy, { opacity: 0, yPercent: -18 }, { opacity: .9, yPercent: 0, duration: 1.35 }, .1)
      .fromTo(jadeArch, { opacity: 0, scale: .82, filter: 'brightness(.55)' }, { opacity: .82, scale: 1, filter: 'brightness(1.18)', duration: 2.1 }, .35)
      .fromTo(lanternNodes, { opacity: 0, y: -15, scale: .45 }, { opacity: 1, y: 0, scale: 1, stagger: .18, duration: .8 }, .75)
      .fromTo(guxiuVines, { opacity: 0, scaleX: 0 }, { opacity: .86, scaleX: 1, stagger: .25, duration: 2.2, ease: 'power1.inOut' }, 1.15)
      .fromTo(water, { opacity: .15, yPercent: 22 }, { opacity: .7, yPercent: 0, duration: 2.1 })
      .fromTo(lantern, { opacity: 0, scale: .42, rotation: -6 }, {
        opacity: 1,
        scale: mobile ? .68 : .9,
        rotation: 0,
        duration: 1.8
      }, .35)
      .to(lantern, { rotation: 360, duration: mobile ? 4.8 : 7.2, ease: 'none' }, 1.15)
      .fromTo(door, { opacity: .1, filter: 'brightness(.52)' }, {
        opacity: .88,
        filter: 'brightness(1.15)',
        duration: 2.8
      }, 1)
      .to(words, { opacity: 1, y: 0, stagger: mobile ? .55 : .8, duration: .7 }, 2)
      .fromTo(scriptLines, { opacity: 0, y: 10 }, {
        opacity: 1,
        y: 0,
        stagger: mobile ? .75 : 1.05,
        duration: .58
      }, mobile ? 3 : 3.35)
      .to(paths, { strokeDashoffset: 0, stagger: .24, duration: 2.8, ease: 'none' }, mobile ? 4.8 : 5.2)
      .to(puppets, {
        xPercent: index => index === 0 ? -18 : 18,
        opacity: .58,
        duration: 1.5
      }, mobile ? 7.9 : 11.7)
      .to(curtains, { scaleX: 1, duration: mobile ? 1.65 : 2.15, ease: 'power1.inOut' }, curtainAt)
      .fromTo(finalReveal, { opacity: 0 }, { opacity: 1, duration: 1.2 }, revealAt)
      .fromTo(finalRevealImage, { scale: 1.045 }, { scale: 1, duration: mobile ? 2.5 : 3.6, ease: 'power1.out' }, revealAt)
      .to(finalCopy, { opacity: 1, y: 0, duration: 1.15 }, finalAt);

    if (audio && !audio.paused) {
      timeline
        .to(audio, { volume: .16, duration: 1.1 }, curtainAt)
        .to(audio, { volume: .26, duration: 1.4 }, finalAt + .35);
    }
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        play();
        observer.disconnect();
      }
    }, { threshold: mobile ? .16 : .3 });
    observer.observe(ending);
  } else {
    play();
  }

  ending.querySelector('[data-hz-ending-skip]')?.addEventListener('click', () => {
    if (finaleTimeline) finaleTimeline.progress(1).kill();
    played = true;
    finish();
    finalCopy?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  });
})();


/* v7: interactive legal comparison, source drawer and restrained GSAP craft reveals. */
(() => {
  'use strict';

  const filterButtons = [...document.querySelectorAll('[data-hz-case-filter]')];
  const caseCards = [...document.querySelectorAll('.hz-case-card[data-case-tags]')];
  const matrixRows = [...document.querySelectorAll('.hz-compare-matrix tbody tr[data-case-tags]')];
  const count = document.querySelector('[data-hz-filter-count]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const countSuffix = count ? count.textContent.replace(/^\d+\s*/, '') : '';

  const matches = (node, filter) =>
    filter === 'all' || (node.dataset.caseTags || '').split(/\s+/).includes(filter);

  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.hzCaseFilter || 'all';
    filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));

    caseCards.forEach(card => { card.hidden = !matches(card, filter); });
    matrixRows.forEach(row => { row.hidden = !matches(row, filter); });

    const visibleCards = caseCards.filter(card => !card.hidden);
    if (count) count.textContent = visibleCards.length + ' ' + countSuffix;

    if (!reduce && window.gsap && visibleCards.length) {
      gsap.fromTo(visibleCards, { opacity: 0, y: 12 }, {
        opacity: 1, y: 0, duration: .42, stagger: .06, ease: 'power2.out', clearProps: 'opacity,transform'
      });
    }
  }));

  const drawer = document.querySelector('[data-hz-source-drawer]');
  const drawerTitle = drawer?.querySelector('[data-hz-source-title]');
  const drawerStatus = drawer?.querySelector('[data-hz-source-status]');
  const drawerDate = drawer?.querySelector('[data-hz-source-date]');
  const drawerSummary = drawer?.querySelector('[data-hz-source-summary]');
  const drawerLink = drawer?.querySelector('[data-hz-source-link]');

  document.querySelectorAll('[data-hz-source-open]').forEach(button => {
    button.addEventListener('click', () => {
      if (!drawer) return;
      if (drawerTitle) drawerTitle.textContent = button.dataset.sourceTitle || '';
      if (drawerStatus) drawerStatus.textContent = button.dataset.sourceStatus || '';
      if (drawerDate) drawerDate.textContent = button.dataset.sourceDate || '';
      if (drawerSummary) drawerSummary.textContent = button.dataset.sourceSummary || '';
      if (drawerLink) drawerLink.href = button.dataset.sourceUrl || '#';
      if (typeof drawer.showModal === 'function') drawer.showModal();
      else drawer.setAttribute('open', '');
      if (!reduce && window.gsap) {
        const panel = drawer.querySelector('.hz-source-drawer-panel');
        if (panel) gsap.fromTo(panel, { xPercent: 12, opacity: .7 }, { xPercent: 0, opacity: 1, duration: .38, ease: 'power2.out', clearProps: 'transform,opacity' });
      }
    });
  });

  if (!reduce && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.hz-matrix-zone, .hz-intent-panel, .hz-evidence-panel, .hz-intervention-panel').forEach(panel => {
      gsap.fromTo(panel, { opacity: .72, y: 18 }, {
        opacity: 1, y: 0, duration: .72, ease: 'power2.out',
        scrollTrigger: { trigger: panel, start: 'top 86%', once: true },
        clearProps: 'opacity,transform'
      });
    });
    document.querySelectorAll('.hz-evidence-tree li, .hz-intervention-path li').forEach((item, index) => {
      gsap.fromTo(item, { opacity: .55, y: 10 }, {
        opacity: 1, y: 0, duration: .5, delay: (index % 3) * .05, ease: 'power2.out',
        scrollTrigger: { trigger: item, start: 'top 91%', once: true },
        clearProps: 'opacity,transform'
      });
    });
  }
})();
