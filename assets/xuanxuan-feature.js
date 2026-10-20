(() => {
  'use strict';

  document.documentElement.classList.add('js');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const featureScript = document.currentScript;
  const scoreUrl = featureScript && featureScript.src
    ? new URL('audio/xuanxuan-original-score-loop-20260815.mp3', featureScript.src).href
    : '';
  const reveals = document.querySelectorAll('.reveal');
  const scenes = [...document.querySelectorAll('.xx-scene')];
  const gsapEngine = window.gsap;
  const ScrollTriggerPlugin = window.ScrollTrigger;
  const gsapEnabled = Boolean(!reducedMotion && gsapEngine && ScrollTriggerPlugin);
  const sceneTimelines = new Map();
  const puppetPosePlan = {
    'chapter-01': [
      ['.xx-puppet--keeper', ['record-keeper-reading-20260819.webp']],
      ['.xx-puppet--messenger', ['messenger-acknowledging-20260819.webp']]
    ],
    'chapter-02': [
      ['.xx-puppet--examiner', ['examiner-reviewing-20260819.webp']]
    ],
    'chapter-03': [
      ['.xx-puppet--guide', ['guide-stitching-records-20260819.webp']],
      ['.xx-puppet--messenger', ['messenger-handoff-20260819.webp']]
    ],
    'chapter-04': [
      ['.xx-puppet--messenger', ['messenger-waiting-20260819.webp']]
    ],
    'chapter-05': [
      ['.xx-puppet--guide', ['guide-guardian-lantern-20260819.webp', 'guide-passing-thread-20260819.webp']]
    ],
    'chapter-06': [
      ['.xx-puppet--examiner', ['examiner-rechecking-20260819.webp', 'examiner-weighing-dossier-20260819.webp']]
    ],
    finale: [
      ['.xx-puppet--keeper', ['record-keeper-sealing-20260819.webp', 'record-keeper-handoff-20260819.webp']]
    ]
  };
  const puppetPoseStates = new Map();

  if (gsapEnabled) {
    gsapEngine.registerPlugin(ScrollTriggerPlugin);
    document.documentElement.classList.add('xx-gsap-ready');
    ScrollTriggerPlugin.config({ limitCallbacks: true, ignoreMobileResize: true });
  }

  const puppetPoseUrl = (filename) => featureScript && featureScript.src
    ? new URL(`art/xuanxuan-puppets/${filename}`, featureScript.src).href
    : '';

  scenes.forEach((scene) => {
    const plan = puppetPosePlan[scene.dataset.xxScene];
    if (!plan) return;
    plan.forEach(([selector, filenames]) => {
      const puppet = scene.querySelector(selector);
      if (!puppet) return;
      puppetPoseStates.set(puppet, {
        original: puppet.getAttribute('src'),
        urls: filenames.map(puppetPoseUrl).filter(Boolean),
        timers: []
      });
    });
  });

  if (gsapEnabled) {
    reveals.forEach((element) => {
      const detailTargets = element.querySelectorAll([
        '.xx-method-grid article',
        '.xx-source-links a',
        '.xx-case-facts > *',
        '.xx-signal-grid > *',
        '.xx-policy-grid > *',
        '.xx-dialect-pair > *'
      ].join(','));
      const revealTimeline = gsapEngine.timeline({
        scrollTrigger: {
          trigger: element,
          start: 'top 86%',
          once: true
        }
      });
      revealTimeline.fromTo(element, {
        autoAlpha: 0,
        y: 34
      }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.95,
        ease: 'power3.out',
        clearProps: 'transform',
        onStart: () => element.classList.add('is-visible')
      });
      if (detailTargets.length) {
        revealTimeline.fromTo(detailTargets, {
          autoAlpha: 0,
          y: 22
        }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.68,
          stagger: 0.075,
          ease: 'power2.out',
          clearProps: 'transform'
        }, '-=0.62');
      }
    });

    const parallaxDistance = matchMedia('(max-width: 780px)').matches ? 2.2 : 4.5;
    document.querySelectorAll('.xx-art img, .xx-ending-grid > img').forEach((image) => {
      gsapEngine.fromTo(image, {
        yPercent: -parallaxDistance,
        scale: 1.045
      }, {
        yPercent: parallaxDistance,
        scale: 1.01,
        ease: 'none',
        scrollTrigger: {
          trigger: image,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.65
        }
      });
    });
  } else if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.14 });
    reveals.forEach((element) => revealObserver.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add('is-visible'));
  }

  if (!reducedMotion) {
    const progress = document.createElement('div');
    progress.className = 'xx-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progress);
    if (gsapEnabled) {
      gsapEngine.set(progress, { width: '100%', scaleX: 0, transformOrigin: 'left center' });
      gsapEngine.to(progress, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          start: 0,
          end: 'max',
          scrub: 0.18
        }
      });
    } else {
      let ticking = false;
      const paintProgress = () => {
        const scrollable = Math.max(1, document.documentElement.scrollHeight - innerHeight);
        progress.style.width = `${Math.min(1, Math.max(0, scrollY / scrollable)) * 100}%`;
        ticking = false;
      };
      addEventListener('scroll', () => {
        if (ticking) return;
        requestAnimationFrame(paintProgress);
        ticking = true;
      }, { passive: true });
      addEventListener('resize', paintProgress, { passive: true });
      paintProgress();
    }
  }

  const language = document.documentElement.lang;
  const isHans = language === 'zh-Hans';
  const audioCopy = language === 'en'
    ? { off: 'Sound is off by default', on: 'Original score, ambience, and transition sound are on', muted: 'Sound muted' }
    : language === 'ja'
      ? { off: '音は初期設定でオフです', on: 'オリジナル音楽・環境音・幕間効果音を再生中', muted: '音をミュートしました' }
      : isHans
        ? { off: '声音默认关闭', on: '原创配乐、环境音与转场音效已开启', muted: '声音已关闭' }
        : { off: '聲音預設關閉', on: '原創配樂、環境音與轉場音效已開啟', muted: '聲音已關閉' };

  const audioButton = document.querySelector('.xx-audio-toggle');
  const audioState = document.querySelector('.xx-audio-state');
  let audioContext = null;
  let masterGain = null;
  let ambientStarted = false;
  let audioEnabled = false;
  let lastCueAt = 0;
  let score = null;
  let scoreFadeFrame = 0;
  let scoreDuckTimer = 0;
  const scoreVolume = 0.34;

  const preferredLabel = (button, enabled) => {
    if (!button) return '';
    if (isHans) return enabled ? button.dataset.labelOnHans : button.dataset.labelOffHans;
    if (language === 'zh-Hant') return enabled ? button.dataset.labelOnHant : button.dataset.labelOffHant;
    return enabled ? button.dataset.labelOn : button.dataset.labelOff;
  };

  const ensureScore = async () => {
    if (!scoreUrl) return false;
    if (!score) {
      score = new Audio();
      score.src = scoreUrl;
      score.preload = 'auto';
      score.loop = true;
      score.volume = 0;
    }
    try {
      await score.play();
      return true;
    } catch {
      return false;
    }
  };

  const fadeScore = (target, duration = 700, onComplete) => {
    if (!score) return;
    cancelAnimationFrame(scoreFadeFrame);
    const from = score.volume;
    const to = Math.min(1, Math.max(0, target));
    const startedAt = performance.now();
    const paint = (now) => {
      const progress = Math.min(1, (now - startedAt) / Math.max(1, duration));
      const eased = 1 - Math.pow(1 - progress, 3);
      score.volume = from + (to - from) * eased;
      if (progress < 1) scoreFadeFrame = requestAnimationFrame(paint);
      else if (onComplete) onComplete();
    };
    scoreFadeFrame = requestAnimationFrame(paint);
  };

  const duckScore = (duration = 1500) => {
    if (!score || score.paused || !audioEnabled) return;
    clearTimeout(scoreDuckTimer);
    fadeScore(0.1, 220);
    scoreDuckTimer = setTimeout(() => {
      if (audioEnabled && !document.hidden) fadeScore(scoreVolume, 900);
    }, duration);
  };

  const createNoiseBuffer = (duration = 1) => {
    const length = Math.max(1, Math.floor(audioContext.sampleRate * duration));
    const buffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let index = 0; index < length; index += 1) channel[index] = Math.random() * 2 - 1;
    return buffer;
  };

  const tone = (frequency, delay = 0, duration = 0.55, volume = 0.032, type = 'sine') => {
    if (!audioContext || !masterGain || !audioEnabled) return;
    const start = audioContext.currentTime + delay;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(45, frequency * 0.94), start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(masterGain);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.04);
  };

  const noiseBurst = (delay = 0, duration = 0.45, volume = 0.02, frequency = 900) => {
    if (!audioContext || !masterGain || !audioEnabled) return;
    const start = audioContext.currentTime + delay;
    const source = audioContext.createBufferSource();
    const filter = audioContext.createBiquadFilter();
    const gain = audioContext.createGain();
    source.buffer = createNoiseBuffer(duration + 0.08);
    filter.type = 'bandpass';
    filter.frequency.value = frequency;
    filter.Q.value = 0.7;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter).connect(gain).connect(masterGain);
    source.start(start);
    source.stop(start + duration + 0.06);
  };

  const startAmbient = () => {
    if (ambientStarted || !audioContext || !masterGain) return;
    ambientStarted = true;
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 360;
    filter.Q.value = 0.35;
    filter.connect(masterGain);

    [82.41, 123.47].forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = index ? 'sine' : 'triangle';
      oscillator.frequency.value = frequency;
      gain.gain.value = index ? 0.018 : 0.026;
      oscillator.connect(gain).connect(filter);
      oscillator.start();
    });

    const air = audioContext.createBufferSource();
    const airFilter = audioContext.createBiquadFilter();
    const airGain = audioContext.createGain();
    air.buffer = createNoiseBuffer(2.5);
    air.loop = true;
    airFilter.type = 'lowpass';
    airFilter.frequency.value = 720;
    airGain.gain.value = 0.008;
    air.connect(airFilter).connect(airGain).connect(masterGain);
    air.start();
  };

  const ensureAudio = async () => {
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return false;
      audioContext = new AudioContextClass();
      masterGain = audioContext.createGain();
      masterGain.gain.value = 0.0001;
      masterGain.connect(audioContext.destination);
      startAmbient();
    }
    if (audioContext.state === 'suspended') await audioContext.resume();
    return true;
  };

  const playCue = (name, force = false) => {
    if (!audioEnabled || reducedMotion) return;
    const now = performance.now();
    if (!force && now - lastCueAt < 1100) return;
    lastCueAt = now;
    duckScore(name === 'finale' ? 2800 : 1500);
    switch (name) {
      case 'opening':
        noiseBurst(0, 0.7, 0.012, 1100);
        tone(196, 0.08, 0.16, 0.045, 'square');
        tone(293.66, 0.8, 1.6, 0.026);
        break;
      case 'signals':
        [392, 440, 493.88, 523.25, 587.33].forEach((frequency, index) => tone(frequency, index * 0.22, 0.65, 0.018));
        break;
      case 'records':
        noiseBurst(0, 0.5, 0.018, 1450);
        tone(118, 0.42, 0.24, 0.055, 'triangle');
        break;
      case 'cities':
        tone(246.94, 0, 0.18, 0.042, 'square');
        tone(246.94, 0.55, 0.18, 0.042, 'square');
        noiseBurst(0.9, 1.4, 0.01, 620);
        break;
      case 'unfinished':
        tone(440, 0, 0.08, 0.03, 'square');
        tone(392, 0.64, 0.08, 0.026, 'square');
        tone(329.63, 1.28, 0.08, 0.022, 'square');
        break;
      case 'mosaic':
        [0, 0.28, 0.56, 0.84].forEach((delay, index) => tone(185 + index * 16, delay, 0.13, 0.037, 'triangle'));
        break;
      case 'accountability':
        noiseBurst(0, 0.72, 0.014, 850);
        tone(146.83, 0.38, 1.7, 0.035, 'triangle');
        tone(440, 1.05, 1.8, 0.018);
        break;
      case 'finale':
        tone(392, 0.15, 3.2, 0.033);
        noiseBurst(0, 1.8, 0.008, 520);
        break;
      default:
        tone(261.63, 0, 0.5, 0.018);
    }
  };

  const setAudio = async (enabled) => {
    if (enabled && !(await ensureAudio())) return;
    audioEnabled = enabled;
    if (masterGain && audioContext) {
      masterGain.gain.cancelScheduledValues(audioContext.currentTime);
      masterGain.gain.setTargetAtTime(enabled ? 0.14 : 0.0001, audioContext.currentTime, 0.08);
    }
    clearTimeout(scoreDuckTimer);
    if (enabled) {
      await ensureScore();
      fadeScore(scoreVolume, 1800);
    } else if (score) {
      fadeScore(0, 520, () => score.pause());
    }
    if (audioButton) {
      audioButton.setAttribute('aria-pressed', String(enabled));
      const label = preferredLabel(audioButton, enabled);
      const labelNode = audioButton.querySelector('b');
      if (label && labelNode) labelNode.textContent = label;
    }
    if (audioState) audioState.textContent = enabled ? audioCopy.on : audioCopy.muted;
    if (enabled) playCue('opening', true);
  };

  if (audioButton && !reducedMotion) {
    const initialLabel = preferredLabel(audioButton, false);
    if (initialLabel && audioButton.querySelector('b')) audioButton.querySelector('b').textContent = initialLabel;
    if (audioState) audioState.textContent = audioCopy.off;
    audioButton.addEventListener('click', () => setAudio(!audioEnabled));
  }

  const clearPuppetPoseTimers = (scene, restoreOriginal = false) => {
    scene.querySelectorAll('.xx-puppet').forEach((puppet) => {
      const state = puppetPoseStates.get(puppet);
      if (!state) return;
      state.timers.forEach(clearTimeout);
      state.timers.length = 0;
      puppet.classList.remove('is-pose-switching');
      if (restoreOriginal && state.original) puppet.setAttribute('src', state.original);
    });
  };

  const schedulePuppetPoses = (scene, replay = false) => {
    if (reducedMotion) return;
    clearPuppetPoseTimers(scene, replay);
    scene.querySelectorAll('.xx-puppet').forEach((puppet) => {
      const state = puppetPoseStates.get(puppet);
      if (!state || !state.urls.length) return;

      state.urls.forEach((url) => {
        const preload = new Image();
        preload.decoding = 'async';
        preload.src = url;
      });

      const firstDelay = state.urls.length > 1 ? 3700 : 4300;
      state.urls.forEach((url, index) => {
        const hideTimer = setTimeout(() => {
          puppet.classList.add('is-pose-switching');
          const changeTimer = setTimeout(() => {
            puppet.src = url;
            requestAnimationFrame(() => requestAnimationFrame(() => {
              puppet.classList.remove('is-pose-switching');
            }));
          }, 190);
          state.timers.push(changeTimer);
        }, firstDelay + index * 2100);
        state.timers.push(hideTimer);
      });
    });
  };

  const preloadPuppetPoses = (scene) => {
    scene.querySelectorAll('.xx-puppet').forEach((puppet) => {
      const state = puppetPoseStates.get(puppet);
      if (!state) return;
      state.urls.forEach((url) => {
        const preload = new Image();
        preload.decoding = 'async';
        preload.src = url;
      });
    });
  };

  const addGsapPuppetMotion = (timeline, scene) => {
    const mobile = matchMedia('(max-width: 780px)').matches;
    const isFinale = scene.dataset.xxScene === 'finale';
    const puppets = [...scene.querySelectorAll('.xx-puppet')];

    puppets.forEach((puppet, puppetIndex) => {
      const isLeft = puppet.classList.contains('is-left');
      const entryX = (mobile ? 38 : 68) * (isLeft ? -1 : 1);
      const accentRotation = (isLeft ? 1 : -1) * (puppet.classList.contains('xx-motion-weigh') ? 1.2 : 2.1);
      const introAt = 0.82 + puppetIndex * 0.2;

      timeline.fromTo(puppet, {
        autoAlpha: 0,
        xPercent: entryX,
        yPercent: mobile ? 4 : 8,
        rotation: isLeft ? -5 : 5,
        scale: 0.94
      }, {
        autoAlpha: isFinale ? 0.86 : 0.92,
        xPercent: 0,
        yPercent: 0,
        rotation: 0,
        scale: 1,
        duration: 1.45,
        ease: 'power3.out'
      }, introAt);

      timeline.to(puppet, {
        yPercent: mobile ? -0.8 : -1.6,
        rotation: accentRotation,
        scale: 1.015,
        duration: 0.72,
        repeat: 1,
        yoyo: true,
        ease: 'sine.inOut'
      }, introAt + 1.25);

      const state = puppetPoseStates.get(puppet);
      if (state && state.urls.length) {
        const firstPoseAt = state.urls.length > 1 ? 4.05 : 4.5;
        state.urls.forEach((url, poseIndex) => {
          const poseAt = firstPoseAt + poseIndex * 1.72;
          timeline.to(puppet, {
            autoAlpha: 0.08,
            scale: 0.965,
            duration: 0.2,
            ease: 'power2.in'
          }, poseAt);
          timeline.call(() => {
            puppet.src = url;
          }, [], poseAt + 0.18);
          timeline.to(puppet, {
            autoAlpha: isFinale ? 0.8 : 0.88,
            scale: 1,
            duration: 0.48,
            ease: 'power3.out'
          }, poseAt + 0.2);
        });
      }

      if (isFinale) {
        timeline.to(puppet, {
          autoAlpha: 0.18,
          xPercent: entryX * 0.88,
          yPercent: 5,
          rotation: isLeft ? -4 : 4,
          scale: 0.94,
          duration: 1.8,
          ease: 'power2.inOut'
        }, 6.55);
      } else {
        timeline.to(puppet, {
          autoAlpha: 0.78,
          xPercent: (isLeft ? -1 : 1) * (mobile ? 1.2 : 3.2),
          rotation: isLeft ? -0.7 : 0.7,
          duration: 1.4,
          ease: 'sine.inOut'
        }, 7.05);
      }
    });
  };

  const addGsapStageProps = (timeline, scene) => {
    const thread = scene.querySelectorAll('.xx-gold-thread, .xx-indigo-stitch');
    const seal = scene.querySelector('.xx-seal');
    const scale = scene.querySelector('.xx-scale');
    const clock = scene.querySelector('.xx-clock-hand');
    const pieces = scene.querySelectorAll('.xx-mosaic-piece');
    const door = scene.querySelector('.xx-court-door');
    const finaleLamp = scene.querySelector('.xx-finale-lamp');

    if (thread.length) {
      timeline.fromTo(thread, {
        scaleX: 0,
        transformOrigin: 'left center'
      }, {
        scaleX: 1,
        duration: 2.9,
        ease: 'power2.out',
        stagger: 0.12
      }, 2.05);
    }
    if (seal) {
      timeline.fromTo(seal, {
        autoAlpha: 0,
        xPercent: -50,
        yPercent: -180,
        rotation: -8
      }, {
        autoAlpha: 0.62,
        xPercent: -50,
        yPercent: -4,
        rotation: -8,
        duration: 1.18,
        ease: 'back.out(1.45)'
      }, 2.45);
    }
    if (scale) {
      timeline.fromTo(scale, {
        autoAlpha: 0,
        xPercent: -50,
        rotation: -7
      }, {
        autoAlpha: 0.86,
        xPercent: -50,
        rotation: 6,
        duration: 1.35,
        ease: 'power2.out'
      }, 2.05);
      timeline.to(scale, {
        rotation: -2,
        duration: 1.4,
        ease: 'elastic.out(1, 0.35)'
      }, 3.4);
    }
    if (clock) {
      timeline.fromTo(clock, {
        autoAlpha: 0,
        rotation: -34,
        transformOrigin: '50% 0%'
      }, {
        autoAlpha: 0.84,
        rotation: 118,
        duration: 3.25,
        ease: 'power1.inOut'
      }, 1.72);
      timeline.to(clock, {
        rotation: 118,
        duration: 0.62,
        ease: 'none'
      }, 4.97);
    }
    if (pieces.length) {
      timeline.fromTo(pieces, {
        autoAlpha: 0,
        y: -110,
        rotation: -18,
        scale: 0.72
      }, {
        autoAlpha: (index) => index === pieces.length - 1 ? 0.55 : 0.88,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 0.82,
        stagger: 0.28,
        ease: 'back.out(1.7)'
      }, 1.45);
    }
    if (door) {
      timeline.fromTo(door, {
        autoAlpha: 0,
        xPercent: -50,
        scaleY: 0.08,
        transformOrigin: '50% 100%'
      }, {
        autoAlpha: 0.9,
        xPercent: -50,
        scaleY: 1,
        duration: 1.65,
        ease: 'power3.out'
      }, 2.25);
    }
    if (finaleLamp) {
      timeline.fromTo(finaleLamp, {
        autoAlpha: 0,
        xPercent: -50,
        y: 15,
        scale: 0.62
      }, {
        autoAlpha: 1,
        xPercent: -50,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'back.out(1.8)'
      }, 1.15);
      timeline.to(finaleLamp, {
        scale: 1.14,
        duration: 0.9,
        repeat: 3,
        yoyo: true,
        ease: 'sine.inOut'
      }, 2.35);
    }
  };

  const buildGsapOpeningTimeline = (scene) => {
    const background = scene.querySelector(':scope > img');
    const leftCurtain = scene.querySelector('.xx-curtain.is-left');
    const rightCurtain = scene.querySelector('.xx-curtain.is-right');
    const beam = scene.querySelector('.xx-stage-beam');
    const columns = scene.querySelectorAll('.xx-stage-column');
    const leftSleeve = scene.querySelector('.xx-opera-sleeve.is-left');
    const rightSleeve = scene.querySelector('.xx-opera-sleeve.is-right');
    const lamps = scene.querySelectorAll('.xx-opening-lamp');
    const copy = scene.querySelectorAll('.xx-hero-copy > *');
    const timeline = gsapEngine.timeline({ paused: true });

    if (background) {
      timeline.fromTo(background, {
        scale: 1.085,
        xPercent: -1.2,
        yPercent: 1.2
      }, {
        scale: 1.005,
        xPercent: 0,
        yPercent: 0,
        duration: 10.5,
        ease: 'power1.out'
      }, 0);
    }
    if (beam) {
      timeline.fromTo(beam, { autoAlpha: 0, yPercent: -80 }, {
        autoAlpha: 1,
        yPercent: 0,
        duration: 0.9,
        ease: 'power3.out'
      }, 0.05);
    }
    if (columns.length) {
      timeline.fromTo(columns, { autoAlpha: 0, scaleY: 0.82, transformOrigin: '50% 0%' }, {
        autoAlpha: 1,
        scaleY: 1,
        duration: 1.05,
        stagger: 0.08,
        ease: 'power2.out'
      }, 0.12);
    }
    if (leftCurtain && rightCurtain) {
      timeline.fromTo(leftCurtain, { xPercent: 0, scaleX: 1 }, {
        xPercent: -72,
        scaleX: 0.62,
        duration: 2.35,
        ease: 'power4.inOut'
      }, 0.12);
      timeline.fromTo(rightCurtain, { xPercent: 0, scaleX: 1 }, {
        xPercent: 72,
        scaleX: 0.62,
        duration: 2.35,
        ease: 'power4.inOut'
      }, 0.12);
    }
    if (leftSleeve) {
      timeline.fromTo(leftSleeve, { autoAlpha: 0, xPercent: -42, rotation: -10 }, {
        autoAlpha: 0.78,
        xPercent: 28,
        rotation: 4,
        duration: 1.55,
        ease: 'power2.inOut'
      }, 0.82);
      timeline.to(leftSleeve, { autoAlpha: 0, xPercent: 52, rotation: 10, duration: 0.9 }, 2.37);
    }
    if (rightSleeve) {
      timeline.fromTo(rightSleeve, { autoAlpha: 0, xPercent: 42, rotation: 10, scaleX: -1 }, {
        autoAlpha: 0.78,
        xPercent: -28,
        rotation: -4,
        scaleX: -1,
        duration: 1.55,
        ease: 'power2.inOut'
      }, 0.98);
      timeline.to(rightSleeve, { autoAlpha: 0, xPercent: -52, rotation: -10, scaleX: -1, duration: 0.9 }, 2.53);
    }
    if (lamps.length) {
      timeline.fromTo(lamps, { autoAlpha: 0, y: 15, scale: 0.62 }, {
        autoAlpha: 0.96,
        y: 0,
        scale: 1,
        duration: 0.72,
        stagger: 0.24,
        ease: 'back.out(1.8)'
      }, 1.35);
      timeline.to(lamps, {
        scale: 1.15,
        duration: 0.55,
        stagger: 0.1,
        repeat: 1,
        yoyo: true,
        ease: 'sine.inOut'
      }, 3.05);
    }
    if (copy.length) {
      timeline.fromTo(copy, { autoAlpha: 0, y: 24 }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.78,
        stagger: 0.075,
        ease: 'power3.out'
      }, 1.05);
    }
    return timeline;
  };

  const buildGsapInterludeTimeline = (scene) => {
    const isFinale = scene.dataset.xxScene === 'finale';
    const background = scene.querySelector('.xx-interlude-bg');
    const copy = scene.querySelector('.xx-interlude-copy');
    const leftCurtain = scene.querySelector('.xx-curtain.is-left');
    const rightCurtain = scene.querySelector('.xx-curtain.is-right');
    const beam = scene.querySelector('.xx-stage-beam');
    const columns = scene.querySelectorAll('.xx-stage-column');
    const timeline = gsapEngine.timeline({ paused: true });

    if (background) {
      timeline.fromTo(background, {
        scale: 1.1,
        xPercent: -1.5,
        yPercent: 1.5
      }, {
        scale: 1.01,
        xPercent: 0,
        yPercent: 0,
        duration: 9.2,
        ease: 'power1.out'
      }, 0);
    }
    if (beam) {
      timeline.fromTo(beam, { autoAlpha: 0, yPercent: -72 }, {
        autoAlpha: 1,
        yPercent: 0,
        duration: 0.82,
        ease: 'power3.out'
      }, 0.02);
    }
    if (columns.length) {
      timeline.fromTo(columns, { autoAlpha: 0, scaleY: 0.86, transformOrigin: '50% 0%' }, {
        autoAlpha: 1,
        scaleY: 1,
        duration: 0.92,
        stagger: 0.08,
        ease: 'power2.out'
      }, 0.08);
    }
    if (leftCurtain && rightCurtain) {
      if (isFinale) {
        timeline.set(leftCurtain, { xPercent: -72, scaleX: 0.62 }, 0);
        timeline.set(rightCurtain, { xPercent: 72, scaleX: 0.62 }, 0);
        timeline.to(leftCurtain, {
          xPercent: 0,
          scaleX: 1,
          duration: 2.45,
          ease: 'power4.inOut'
        }, 6.4);
        timeline.to(rightCurtain, {
          xPercent: 0,
          scaleX: 1,
          duration: 2.45,
          ease: 'power4.inOut'
        }, 6.4);
      } else {
        timeline.fromTo(leftCurtain, { xPercent: 0, scaleX: 1 }, {
          xPercent: -72,
          scaleX: 0.62,
          duration: 2.25,
          ease: 'power4.inOut'
        }, 0.08);
        timeline.fromTo(rightCurtain, { xPercent: 0, scaleX: 1 }, {
          xPercent: 72,
          scaleX: 0.62,
          duration: 2.25,
          ease: 'power4.inOut'
        }, 0.08);
      }
    }
    if (copy) {
      timeline.fromTo(copy, { autoAlpha: 0, y: 30 }, {
        autoAlpha: 1,
        y: 0,
        duration: 1.0,
        ease: 'power3.out'
      }, isFinale ? 1.28 : 1.82);
      if (isFinale) {
        timeline.to(copy, { autoAlpha: 0.7, y: 6, duration: 1.3, ease: 'power2.inOut' }, 6.85);
      }
    }

    addGsapPuppetMotion(timeline, scene);
    addGsapStageProps(timeline, scene);
    return timeline;
  };

  const activateScene = (scene, replay = false) => {
    if (!scene || reducedMotion) return;
    if (gsapEnabled) {
      const timeline = sceneTimelines.get(scene);
      if (!timeline || (scene.dataset.xxPlayed && !replay)) return;
      clearPuppetPoseTimers(scene, true);
      preloadPuppetPoses(scene);
      scene.classList.add('is-active');
      timeline.restart();
      if (!scene.dataset.xxPlayed || replay) playCue(scene.dataset.xxSfx, replay);
      scene.dataset.xxPlayed = 'true';
      return;
    }
    if (replay) {
      scene.classList.remove('is-active');
      void scene.offsetWidth;
    }
    scene.classList.add('is-active');
    schedulePuppetPoses(scene, replay);
    if (!scene.dataset.xxPlayed || replay) playCue(scene.dataset.xxSfx, replay);
    scene.dataset.xxPlayed = 'true';
  };

  if (gsapEnabled) {
    scenes.forEach((scene) => {
      const timeline = scene.dataset.xxScene === 'opening'
        ? buildGsapOpeningTimeline(scene)
        : buildGsapInterludeTimeline(scene);
      sceneTimelines.set(scene, timeline);
      if (scene.dataset.xxScene !== 'opening') {
        ScrollTriggerPlugin.create({
          trigger: scene,
          start: 'top 74%',
          once: true,
          onEnter: () => activateScene(scene)
        });
      }
    });
    activateScene(scenes.find((scene) => scene.dataset.xxScene === 'opening'));

    const refreshMotion = () => ScrollTriggerPlugin.refresh();
    if (document.readyState === 'complete') refreshMotion();
    else addEventListener('load', refreshMotion, { once: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refreshMotion).catch(() => {});
  } else if ('IntersectionObserver' in window && !reducedMotion) {
    const sceneObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.target.dataset.xxPlayed) return;
        activateScene(entry.target);
      });
    }, { threshold: 0.28 });
    scenes.forEach((scene) => sceneObserver.observe(scene));
  } else {
    scenes.forEach((scene) => scene.classList.add('is-active'));
  }

  document.querySelectorAll('[data-xx-replay]').forEach((button) => {
    button.addEventListener('click', () => {
      const scene = document.querySelector(`[data-xx-scene="${CSS.escape(button.dataset.xxReplay)}"]`);
      activateScene(scene, true);
    });
  });

  document.addEventListener('visibilitychange', async () => {
    if (!audioContext || !audioEnabled) return;
    if (document.hidden) {
      await audioContext.suspend();
      if (score) score.pause();
    } else {
      await audioContext.resume();
      if (score) {
        await score.play().catch(() => {});
        fadeScore(scoreVolume, 800);
      }
    }
  });
  addEventListener('pagehide', () => {
    scenes.forEach((scene) => clearPuppetPoseTimers(scene));
    clearTimeout(scoreDuckTimer);
    cancelAnimationFrame(scoreFadeFrame);
    if (score) score.pause();
    if (audioContext && audioContext.state !== 'closed') audioContext.close();
  }, { once: true });
})();
