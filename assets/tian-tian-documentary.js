(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SVG_NS = 'http://www.w3.org/2000/svg';

  const makePart = (tag, className) => {
    const node = document.createElement(tag);
    node.className = className;
    return node;
  };

  function makeParts(className, count) {
    return Array.from({ length: count }, (_, index) => {
      const node = makePart('i', className);
      node.style.setProperty('--i', String(index));
      node.style.setProperty('--tt-delay-knot', `${(index * .16).toFixed(2)}s`);
      node.style.setProperty('--tt-delay-block', `${(index * .55).toFixed(2)}s`);
      node.style.setProperty('--tt-delay-petal', `${(index * .11).toFixed(2)}s`);
      node.style.setProperty('--tt-hand-left', `${14 + index * 17}%`);
      node.style.setProperty('--tt-hand-angle', `${-24 + index * 16}deg`);
      node.style.setProperty('--tt-petal-angle', `${index * 45}deg`);
      node.style.setProperty('--tt-record-top', `${76 + index * 31}px`);
      node.style.setProperty('--tt-record-top-mobile', `${49 + index * 21}px`);
      return node;
    });
  }

  function makeShadowLine(className, paths) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', className);
    svg.setAttribute('viewBox', '0 0 300 180');
    svg.setAttribute('preserveAspectRatio', 'none');
    paths.forEach((d, index) => {
      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('pathLength', '1');
      path.style.setProperty('--i', String(index));
      path.style.setProperty('--tt-delay-stitch', `${(index * .36).toFixed(2)}s`);
      svg.append(path);
    });
    return svg;
  }

  function makeShadowFigure(role) {
    const figure = makePart('span', `tt-shadow-figure tt-shadow-figure--${role}`);
    [
      'tt-shadow-cast',
      'tt-shadow-crown',
      'tt-shadow-head',
      'tt-shadow-body',
      'tt-shadow-skirt',
      'tt-shadow-arm tt-shadow-arm--upper',
      'tt-shadow-arm tt-shadow-arm--lower',
      'tt-shadow-rod tt-shadow-rod--front',
      'tt-shadow-rod tt-shadow-rod--rear'
    ].forEach(className => figure.append(makePart('i', className)));
    return figure;
  }

  function makeShadowStage(scene) {
    const stage = makePart('div', `tt-shadow-stage tt-shadow-stage--${scene}`);
    stage.setAttribute('aria-hidden', 'true');
    stage.append(makePart('span', 'tt-shadow-screen'));
    stage.append(makePart('span', 'tt-shadow-vignette'));
    const props = makePart('span', 'tt-shadow-props');

    if (scene === 'wind-kite') {
      props.append(makePart('i', 'tt-shadow-roof'));
      props.append(makePart('i', 'tt-shadow-kite'));
      props.append(makeShadowLine('tt-shadow-line tt-shadow-thread', ['M38 139 C91 73 155 153 260 44']));
    } else if (scene === 'ten-knot-door') {
      props.append(makePart('i', 'tt-shadow-door'));
      props.append(makePart('i', 'tt-shadow-lattice'));
      const cord = makePart('i', 'tt-shadow-knot-cord');
      makeParts('tt-shadow-knot', 10).forEach(knot => cord.append(knot));
      props.append(cord);
    } else if (scene === 'frost-lantern') {
      props.append(makePart('i', 'tt-shadow-lantern'));
      props.append(makePart('i', 'tt-shadow-wick'));
      props.append(makePart('i', 'tt-shadow-frost'));
      props.append(makePart('i', 'tt-shadow-date'));
    } else if (scene === 'court-scroll') {
      props.append(makePart('i', 'tt-shadow-scroll'));
      makeParts('tt-shadow-record-line', 3).forEach(line => props.append(line));
      props.append(makePart('i', 'tt-shadow-seal'));
      props.append(makePart('i', 'tt-shadow-bars'));
    } else if (scene === 'seal-road') {
      props.append(makePart('i', 'tt-shadow-stamp'));
      props.append(makeShadowLine('tt-shadow-line tt-shadow-road', ['M25 154 C98 125 160 145 278 82']));
      props.append(makePart('i', 'tt-shadow-paper-flower'));
      props.append(makePart('i', 'tt-shadow-roof-home'));
    } else if (scene === 'evidence-blocks') {
      makeParts('tt-shadow-block', 4).forEach(block => props.append(block));
      props.append(makePart('i', 'tt-shadow-boundary'));
      props.append(makePart('i', 'tt-shadow-blurred-record'));
    } else if (scene === 'seven-moon') {
      props.append(makePart('i', 'tt-shadow-moon'));
      props.append(makeShadowLine('tt-shadow-line tt-shadow-stitches', [
        'M108 70 C118 42 143 37 157 57',
        'M140 45 C171 35 187 55 179 78',
        'M177 64 C201 77 198 103 179 113',
        'M184 108 C174 135 148 140 132 122',
        'M139 132 C108 141 91 118 101 96',
        'M103 108 C78 93 83 68 103 58',
        'M116 87 C127 70 151 67 166 82'
      ]));
      props.append(makePart('i', 'tt-shadow-hanging-thread'));
    } else if (scene === 'guarded-lamp') {
      props.append(makePart('i', 'tt-shadow-open-door'));
      props.append(makePart('i', 'tt-shadow-guard-lantern'));
      makeParts('tt-shadow-hand', 4).forEach(hand => props.append(hand));
      const bloom = makePart('i', 'tt-shadow-bloom');
      makeParts('tt-shadow-petal', 8).forEach(petal => bloom.append(petal));
      props.append(bloom);
    }

    stage.append(props);
    stage.append(makeShadowFigure('woman'));
    stage.append(makeShadowFigure('scribe'));
    return stage;
  }

  function initShadowStages() {
    $$('[data-shadow-scene]').forEach(transition => {
      const scene = transition.dataset.shadowScene;
      const fallback = $('.tt-transition-puppet', transition);
      if (!scene || !fallback || $('.tt-shadow-stage', transition)) return;
      fallback.replaceWith(makeShadowStage(scene));
      transition.classList.add('tt-shadow-ready');
    });
  }

  function initOpening() {
    const opening = $('[data-tt-opening]');
    if (!opening) return;
    const lines = $$('.tt-opening-line', opening);
    const steps = $$('[data-tt-step]', opening);
    const closeButtons = $$('[data-tt-close]', opening);
    const replay = $('[data-tt-replay]');
    let index = 0;
    let interval = 0;
    let closing = 0;

    const stop = () => {
      window.clearInterval(interval);
      window.clearTimeout(closing);
    };
    const show = next => {
      index = Math.max(0, Math.min(lines.length - 1, next));
      opening.dataset.scene = String(index + 1);
      lines.forEach((line, i) => {
        line.classList.toggle('is-active', i === index);
        line.setAttribute('aria-hidden', i === index ? 'false' : 'true');
      });
      steps.forEach((step, i) => {
        step.classList.toggle('is-active', i === index);
        if (i === index) step.setAttribute('aria-current', 'step');
        else step.removeAttribute('aria-current');
      });
      document.dispatchEvent(new CustomEvent('tt:opening-scene', { detail: { index } }));
    };
    const close = () => {
      stop();
      opening.classList.add('is-gone');
      opening.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('tt-opening-active');
      document.dispatchEvent(new CustomEvent('tt:opening-close'));
    };
    const play = () => {
      stop();
      show(0);
      opening.classList.remove('is-gone');
      opening.setAttribute('aria-hidden', 'false');
      document.body.classList.add('tt-opening-active');
      if (reducedMotion) return;
      interval = window.setInterval(() => {
        if (index < lines.length - 1) show(index + 1);
        else {
          window.clearInterval(interval);
          closing = window.setTimeout(close, 4200);
        }
      }, 3900);
    };

    closeButtons.forEach(button => button.addEventListener('click', close));
    steps.forEach((step, i) => step.addEventListener('click', () => {
      stop();
      show(i);
      closing = window.setTimeout(close, 5200);
    }));
    if (replay) replay.addEventListener('click', play);
    if (reducedMotion) close();
    else play();
  }

  function initSoundscape() {
    const buttons = $$('[data-tt-audio]');
    if (!buttons.length) return;

    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    const SCALE = [146.83, 164.81, 185, 220, 246.94];
    const transitionPhrases = [
      [0, 1, 3], [0, 4, 3], [3, 2, 0], [0, 3, 4], [4, 3, 0],
      [0, 2, 1], [3, 1, 0], [0, 3, 1], [0, 1, 4]
    ];
    const seen = new WeakSet();
    let context = null;
    let master = null;
    let musicBus = null;
    let sfxBus = null;
    let noiseBuffer = null;
    let ambientTimer = 0;
    let audioEnabled = false;

    const getLabel = (button, key) => {
      const isHans = document.documentElement.lang.toLowerCase() === 'zh-hans';
      return (isHans && button.dataset[`${key}Hans`]) || button.dataset[key] || '';
    };

    const setButtonText = (button, value) => {
      const label = $('[data-tt-audio-label]', button);
      if (label) label.textContent = value;
      else button.textContent = value;
    };

    const updateControls = () => {
      document.body.classList.toggle('tt-audio-active', audioEnabled);
      buttons.forEach(button => {
        button.setAttribute('aria-pressed', audioEnabled ? 'true' : 'false');
        setButtonText(button, getLabel(button, audioEnabled ? 'labelOn' : 'labelOff'));
      });
    };

    const disconnectOnEnd = nodes => () => nodes.forEach(node => {
      try { node.disconnect(); } catch (_) { /* already disconnected */ }
    });

    const playTone = (frequency, when, duration, level, type = 'sine', bus = musicBus) => {
      if (!audioEnabled || !context || !bus) return;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = Math.max(context.currentTime + .006, when);
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, start);
      oscillator.detune.setValueAtTime((Math.random() - .5) * 4, start);
      gain.gain.setValueAtTime(.0001, start);
      gain.gain.exponentialRampToValueAtTime(Math.max(.0002, level), start + Math.min(.08, duration * .16));
      gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
      oscillator.connect(gain);
      gain.connect(bus);
      oscillator.start(start);
      oscillator.stop(start + duration + .03);
      oscillator.onended = disconnectOnEnd([oscillator, gain]);
    };

    const playPluck = (frequency, when, level = .075) => {
      playTone(frequency, when, 1.7, level, 'triangle', musicBus);
      playTone(frequency * 2.01, when + .012, .86, level * .26, 'sine', musicBus);
    };

    const noiseBurst = (when, duration, level, frequency = 1200, type = 'bandpass') => {
      if (!audioEnabled || !context || !noiseBuffer || !sfxBus) return;
      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      const start = Math.max(context.currentTime + .006, when);
      source.buffer = noiseBuffer;
      filter.type = type;
      filter.frequency.setValueAtTime(frequency, start);
      filter.Q.setValueAtTime(type === 'bandpass' ? .75 : .28, start);
      gain.gain.setValueAtTime(.0001, start);
      gain.gain.exponentialRampToValueAtTime(Math.max(.0002, level), start + .025);
      gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(sfxBus);
      source.start(start, Math.random() * .65, Math.min(duration + .04, 1.1));
      source.onended = disconnectOnEnd([source, filter, gain]);
    };

    const paperRustle = (when, strength = 1) => {
      noiseBurst(when, .52, .055 * strength, 1150, 'bandpass');
      noiseBurst(when + .06, .38, .026 * strength, 2350, 'highpass');
    };

    const rodClick = (when, frequency = 840, strength = 1) => {
      noiseBurst(when, .065, .05 * strength, 1750, 'highpass');
      playTone(frequency, when, .12, .045 * strength, 'triangle', sfxBus);
    };

    const cueOpening = index => {
      if (!audioEnabled || !context) return;
      const now = context.currentTime + .025;
      if (!reducedMotion) paperRustle(now, .62);
      playPluck(SCALE[index % SCALE.length], now + .16, .052);
    };

    const cueTransition = index => {
      if (!audioEnabled || !context) return;
      const now = context.currentTime + .025;
      const phrase = transitionPhrases[index % transitionPhrases.length];
      if (!reducedMotion) {
        paperRustle(now, .82);
        rodClick(now + .14, 760 + index * 29, .9);
        rodClick(now + .29, 980 - index * 17, .48);
      }
      phrase.forEach((note, noteIndex) => {
        playPluck(SCALE[note], now + .52 + noteIndex * .38, .055 - noteIndex * .006);
      });
    };

    const cueEnding = () => {
      if (!audioEnabled || !context) return;
      const now = context.currentTime + .03;
      if (!reducedMotion) paperRustle(now, .55);
      [110, 162, 230, 289].forEach((frequency, index) => {
        playTone(frequency, now + .14, 5.2 - index * .45, .052 / (index + 1), 'sine', musicBus);
      });
      [0, 1, 3, 0].forEach((note, index) => {
        playPluck(SCALE[note], now + .8 + index * .72, .052 - index * .006);
      });
    };

    const playAmbientPhrase = () => {
      if (!audioEnabled || !context || document.hidden) return;
      const now = context.currentTime + .04;
      const start = Math.floor(Math.random() * SCALE.length);
      const notes = [start, (start + 3) % SCALE.length, (start + 1) % SCALE.length];
      notes.forEach((note, index) => playPluck(SCALE[note] / (index === 2 ? 2 : 1), now + index * 1.15, .031));
      playTone(SCALE[(start + 2) % SCALE.length] / 2, now + .35, 3.6, .019, 'sine', musicBus);
    };

    const startDrone = () => {
      if (!context || !musicBus) return;
      [73.42, 110].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = index ? 'sine' : 'triangle';
        oscillator.frequency.value = frequency;
        gain.gain.value = index ? .018 : .022;
        oscillator.connect(gain);
        gain.connect(musicBus);
        oscillator.start();
      });
    };

    const buildAudioGraph = () => {
      master = context.createGain();
      musicBus = context.createGain();
      sfxBus = context.createGain();
      const compressor = context.createDynamicsCompressor();
      const convolver = context.createConvolver();
      const wetGain = context.createGain();

      master.gain.value = .58;
      musicBus.gain.value = .13;
      sfxBus.gain.value = .18;
      wetGain.gain.value = .13;
      compressor.threshold.value = -24;
      compressor.knee.value = 16;
      compressor.ratio.value = 8;
      compressor.attack.value = .003;
      compressor.release.value = .25;

      const impulseLength = Math.floor(context.sampleRate * 1.25);
      const impulse = context.createBuffer(2, impulseLength, context.sampleRate);
      for (let channel = 0; channel < impulse.numberOfChannels; channel += 1) {
        const data = impulse.getChannelData(channel);
        for (let i = 0; i < data.length; i += 1) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2.7);
        }
      }
      convolver.buffer = impulse;

      noiseBuffer = context.createBuffer(1, Math.floor(context.sampleRate * 2), context.sampleRate);
      const noise = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noise.length; i += 1) noise[i] = Math.random() * 2 - 1;

      musicBus.connect(master);
      sfxBus.connect(master);
      musicBus.connect(convolver);
      sfxBus.connect(convolver);
      convolver.connect(wetGain);
      wetGain.connect(master);
      master.connect(compressor);
      compressor.connect(context.destination);
    };

    const enableAudio = () => {
      if (audioEnabled || !AudioCtor) return;
      try {
        context = new AudioCtor();
        buildAudioGraph();
        audioEnabled = true;
        updateControls();
        startDrone();
        context.resume().catch(() => {});
        const opening = $('[data-tt-opening]');
        if (opening && !opening.classList.contains('is-gone')) cueOpening(Math.max(0, Number(opening.dataset.scene || 1) - 1));
        else playAmbientPhrase();
        window.clearInterval(ambientTimer);
        ambientTimer = window.setInterval(playAmbientPhrase, 15000);
      } catch (_) {
        audioEnabled = false;
        updateControls();
      }
    };

    const disableAudio = () => {
      if (!audioEnabled) return;
      audioEnabled = false;
      window.clearInterval(ambientTimer);
      ambientTimer = 0;
      updateControls();
      const oldContext = context;
      const oldMaster = master;
      context = null;
      master = null;
      musicBus = null;
      sfxBus = null;
      noiseBuffer = null;
      if (!oldContext) return;
      try {
        const now = oldContext.currentTime;
        oldMaster.gain.cancelScheduledValues(now);
        oldMaster.gain.setValueAtTime(Math.max(.0001, oldMaster.gain.value), now);
        oldMaster.gain.exponentialRampToValueAtTime(.0001, now + .25);
      } catch (_) { /* context may already be interrupted */ }
      window.setTimeout(() => oldContext.close().catch(() => {}), 290);
    };

    if (!AudioCtor) {
      buttons.forEach(button => {
        button.disabled = true;
        setButtonText(button, getLabel(button, 'labelUnsupported'));
      });
      return;
    }

    buttons.forEach(button => button.addEventListener('click', () => {
      if (audioEnabled) disableAudio();
      else enableAudio();
    }));
    updateControls();

    document.addEventListener('tt:opening-scene', event => cueOpening(Number(event.detail && event.detail.index) || 0));
    document.addEventListener('tt:opening-close', () => {
      if (!audioEnabled || !context || reducedMotion) return;
      paperRustle(context.currentTime + .025, .44);
    });

    if ('IntersectionObserver' in window) {
      const transitions = $$('.tt-transition');
      const ending = $('[data-tt-ending]');
      const cueObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting || seen.has(entry.target)) return;
          seen.add(entry.target);
          if (entry.target.matches('[data-tt-ending]')) cueEnding();
          else cueTransition(transitions.indexOf(entry.target));
        });
      }, { rootMargin: '-10% 0px -10% 0px', threshold: .42 });
      transitions.forEach(transition => cueObserver.observe(transition));
      if (ending) cueObserver.observe(ending);
    }

    document.addEventListener('visibilitychange', () => {
      if (!audioEnabled || !context) return;
      if (document.hidden) context.suspend().catch(() => {});
      else context.resume().catch(() => {});
    });
  }

  function initDocumentaryMotion() {
    const progress = $('.tt-reading-progress i');
    const heroImage = $('.tt-hero-art img');
    let scheduled = false;

    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (progress) progress.style.width = Math.min(100, Math.max(0, window.scrollY / max * 100)) + '%';
      if (heroImage && !reducedMotion && window.scrollY < window.innerHeight * 1.5) {
        const y = Math.min(15, window.scrollY * .018);
        heroImage.style.transform = `scale(1.025) translate3d(0,${y}px,0)`;
      }
      scheduled = false;
    };

    window.addEventListener('scroll', () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  function initReveals() {
    const targets = $$('[data-tt-reveal], .tt-chapter');
    const cinematicTargets = $$('.tt-transition, .tt-ending');
    $$('.tt-transition').forEach((target, index) => {
      target.style.setProperty('--tt-scene-index', String(index + 1));
    });
    if (reducedMotion || !('IntersectionObserver' in window)) {
      [...targets, ...cinematicTargets].forEach(target => target.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -9% 0px', threshold: .13 });
    targets.forEach(target => observer.observe(target));

    const cinematicObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    }, { rootMargin: '-8% 0px -8% 0px', threshold: .18 });
    cinematicTargets.forEach(target => cinematicObserver.observe(target));
    document.documentElement.classList.add('tt-motion-ready');
  }

  document.addEventListener('DOMContentLoaded', () => {
    initShadowStages();
    initSoundscape();
    initOpening();
    initDocumentaryMotion();
    initReveals();
  });
})();
