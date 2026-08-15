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

  if ('IntersectionObserver' in window && !reducedMotion) {
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

  const activateScene = (scene, replay = false) => {
    if (!scene || reducedMotion) return;
    if (replay) {
      scene.classList.remove('is-active');
      void scene.offsetWidth;
    }
    scene.classList.add('is-active');
    if (!scene.dataset.xxPlayed || replay) playCue(scene.dataset.xxSfx, replay);
    scene.dataset.xxPlayed = 'true';
  };

  if ('IntersectionObserver' in window && !reducedMotion) {
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
    clearTimeout(scoreDuckTimer);
    cancelAnimationFrame(scoreFadeFrame);
    if (score) score.pause();
    if (audioContext && audioContext.state !== 'closed') audioContext.close();
  }, { once: true });
})();
