(() => {
  'use strict';

  document.documentElement.classList.add('js');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = [...document.querySelectorAll('.reveal')];

  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .14 });
    reveals.forEach(node => revealObserver.observe(node));
  } else {
    reveals.forEach(node => node.classList.add('is-visible'));
  }

  if (!reducedMotion) {
    const line = document.createElement('div');
    line.className = 'wh-progress';
    line.setAttribute('aria-hidden', 'true');
    document.body.appendChild(line);
    let scheduled = false;
    const paint = () => {
      const available = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      line.style.width = `${Math.max(0, Math.min(1, scrollY / available)) * 100}%`;
      scheduled = false;
    };
    addEventListener('scroll', () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(paint);
    }, { passive: true });
    addEventListener('resize', paint, { passive: true });
    paint();
  }

  const replay = document.querySelector('[data-replay-opening]');
  const heroImage = document.querySelector('.wh-hero-media img');
  const curtain = document.querySelector('.wh-curtain');
  replay?.addEventListener('click', () => {
    if (reducedMotion) return;
    [heroImage].forEach(node => {
      if (!node) return;
      node.style.animation = 'none';
      void node.offsetWidth;
      node.style.removeProperty('animation');
    });
    if (curtain?.isConnected) curtain.replaceWith(curtain.cloneNode(true));
    document.querySelector('.wh-hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  const soundButton = document.querySelector('[data-sound-toggle]');
  const soundStatus = document.querySelector('[data-sound-status]');
  if (!soundButton || !soundStatus) return;

  const copy = key => document.body.dataset[key] || '';
  const cues = {
    hero: { start: 0, end: 5.85, volume: .44 },
    chapter1: { start: 3.6, end: 5.85, volume: .32 },
    chapter4: { start: 12.5, end: 17.1, volume: .35 },
    chapter5: { start: 17.1, end: 22.3, volume: .39 },
    chapter6: { start: 20.3, end: 23.4, volume: .34 },
    finale: { start: 20.3, end: 26.819, volume: .34 }
  };
  const played = new Set();
  let audio = null;
  let stopTimer = 0;
  let enabled = false;
  let pausedByUser = false;
  let currentCue = 'hero';

  function setStatus(message, pressed = enabled) {
    soundStatus.textContent = message;
    soundButton.setAttribute('aria-pressed', String(pressed));
    soundButton.textContent = pressed ? `♪ ${copy('soundPause')}` : `♪ ${copy('soundEnable')}`;
  }

  function sourceForBrowser() {
    const probe = document.createElement('audio');
    const webm = document.body.dataset.audioWebm;
    const m4a = document.body.dataset.audioM4a;
    if (webm && probe.canPlayType('audio/webm; codecs="opus"')) return webm;
    return m4a || webm || '';
  }

  function getAudio() {
    if (audio) return audio;
    const src = sourceForBrowser();
    if (!src) throw new Error('No audio source');
    audio = new Audio();
    audio.preload = 'none';
    audio.loop = false;
    audio.src = src;
    audio.addEventListener('ended', () => setStatus(copy('soundReady'), true));
    audio.addEventListener('error', () => {
      enabled = false;
      setStatus(copy('soundUnavailable'), false);
    });
    return audio;
  }

  async function playCue(name, force = false) {
    const cue = cues[name];
    if (!enabled || !cue || (!force && played.has(name))) return;
    const player = getAudio();
    clearTimeout(stopTimer);
    player.pause();
    player.currentTime = cue.start;
    player.volume = cue.volume;
    player.loop = false;
    try {
      await player.play();
      played.add(name);
      setStatus(copy('soundPlaying'), true);
      stopTimer = window.setTimeout(() => {
        if (!audio) return;
        audio.pause();
        setStatus(copy('soundReady'), true);
      }, Math.max(0, (cue.end - cue.start) * 1000));
    } catch (_) {
      enabled = false;
      setStatus(copy('soundUnavailable'), false);
    }
  }

  function pauseByReader() {
    clearTimeout(stopTimer);
    audio?.pause();
    enabled = false;
    pausedByUser = true;
    setStatus(copy('soundPaused'), false);
  }

  soundButton.addEventListener('click', async () => {
    if (enabled) {
      pauseByReader();
      return;
    }
    enabled = true;
    pausedByUser = false;
    setStatus(copy('soundLoading'), true);
    await playCue(currentCue, true);
  });

  const cueNodes = [...document.querySelectorAll('[data-music-cue]')];
  if ('IntersectionObserver' in window) {
    const cueObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || entry.intersectionRatio < .55) return;
        currentCue = entry.target.dataset.musicCue;
        if (enabled && !pausedByUser) playCue(currentCue);
      });
    }, { threshold: [.55, .72] });
    cueNodes.forEach(node => cueObserver.observe(node));
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden || !audio || audio.paused) return;
    clearTimeout(stopTimer);
    audio.pause();
    enabled = false;
    pausedByUser = true;
    setStatus(copy('soundPaused'), false);
  });

  const dataSaver = navigator.connection && navigator.connection.saveData;
  setStatus(dataSaver ? copy('soundDataSaver') : copy('soundDefault'), false);
})();
