(() => {
  'use strict';

  const page = document.querySelector('.hz-page');
  if (!page) return;

  const ids = ['before', 'taken', 'unseen', 'abuse', 'last-day', 'hospital', 'verdict', 'father', 'protection'];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = matchMedia('(max-width: 900px)').matches;
  const rail = document.querySelector('.hz-lantern-rail');
  const links = rail ? [...rail.querySelectorAll('.hz-rail-link')] : [];
  const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
  const craftCycle = ['rongxiu', 'jade', 'guxiu', 'lantern'];

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

    const openingStage = document.querySelector('.tt-opening .tt-stage');
    if (openingStage) {
      gsap.fromTo(openingStage, { opacity: 0, scale: .985 }, {
        opacity: 1,
        scale: 1,
        duration: 1.15,
        ease: 'power2.out'
      });
      gsap.fromTo(openingStage.querySelectorAll('.tt-pose-actor'), {
        opacity: 0,
        yPercent: 5
      }, {
        opacity: 1,
        yPercent: 0,
        duration: 1.3,
        stagger: .16,
        ease: 'power2.out'
      });
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
      });
    }
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

    const timeline = finaleTimeline = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: () => ending.classList.add('is-haipai-complete')
    });

    timeline
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
        opacity: .28,
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
