(() => {
  'use strict';

  document.documentElement.classList.add('fq-js');

  const featureScript = document.currentScript;

  const ready = callback => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  };

  ready(() => {
    const doc = document;
    const html = doc.documentElement;
    const body = doc.body;
    const root = doc.querySelector('[data-fq-page]') || body;
    const scenes = [...doc.querySelectorAll('.fq-act[data-fq-scene], [data-fq-scene]')]
      .filter((scene, index, collection) => collection.indexOf(scene) === index);
    const reducedMotionQuery = matchMedia('(prefers-reduced-motion: reduce)');
    const compactQuery = matchMedia('(max-width: 780px)');
    let motionMode = 'full';
    try { motionMode = localStorage.getItem('fq-motion-mode') || 'full'; } catch (_error) {}
    if (!['full', 'lite', 'off'].includes(motionMode)) motionMode = 'full';
    if (reducedMotionQuery.matches) motionMode = 'off';
    const reducedMotion = motionMode === 'off';
    const liteMotion = motionMode === 'lite';
    const saveData = Boolean(navigator.connection && navigator.connection.saveData);
    const gsapEngine = motionMode !== 'off' && window.gsap && typeof window.gsap.timeline === 'function'
      ? window.gsap
      : null;
    const ScrollTrigger = gsapEngine && window.ScrollTrigger
      && typeof window.ScrollTrigger.create === 'function'
      ? window.ScrollTrigger
      : null;

    let destroyed = false;
    let activeScene = null;
    let visibleScene = null;
    let visibilityAudioResume = false;
    let refreshFrame = 0;
    const observers = [];
    const scrollTriggers = [];
    const sealTweens = [];
    const sceneStates = new Map();
    const poseStates = new WeakMap();
    const posePreloads = new Map();
    const animationTimers = new Set();
    const visibilityPausedScenes = new Set();

    html.dataset.fqMotion = motionMode;
    if (reducedMotion) html.classList.add('fq-reduced-motion');
    if (saveData) html.classList.add('fq-save-data');

    if (gsapEngine) {
      html.classList.add('fq-gsap-ready');
      if (ScrollTrigger) {
        try {
          gsapEngine.registerPlugin(ScrollTrigger);
          ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });
          html.classList.add('fq-scrolltrigger-ready');
        } catch (_error) {
          html.classList.remove('fq-scrolltrigger-ready');
        }
      }
    }

    const language = (html.lang || 'zh-Hant').toLowerCase();
    const languageKey = language.startsWith('en') ? 'en' : language.startsWith('ja') ? 'ja' : 'zh';
    const copies = {
      zh: {
        ready: '本折準備播放',
        playing: '第 {act} 折播放中',
        paused: '第 {act} 折已暫停',
        complete: '第 {act} 折播放完畢',
        skipped: '已跳至第 {act} 折結尾',
        static: '已改以靜態方式呈現；完整台詞位於逐字稿',
        line: '第 {current} 句，共 {total} 句',
        play: '播放本折',
        pause: '暫停本折',
        resume: '繼續本折',
        replay: '重播本折',
        skip: '跳過本折動畫',
        audioOn: '配樂播放中：{track}',
        audioOff: '配樂已關閉',
        audioLoading: '正在準備配樂',
        audioError: '無法播放配樂，正文仍可繼續閱讀',
        audioSensitive: '敏感內容展開期間，配樂暫停',
        audioHelp: '進入求助資訊，配樂暫停',
        audioEnable: '開啟配樂',
        audioDisable: '關閉配樂',
        tide: '潮汐與寺院',
        scratches: '十七道刮痕'
      },
      en: {
        ready: 'This act is ready',
        playing: 'Act {act} is playing',
        paused: 'Act {act} is paused',
        complete: 'Act {act} is complete',
        skipped: 'Skipped to the end of Act {act}',
        static: 'Presented without motion; the complete dialogue is in the transcript',
        line: 'Line {current} of {total}',
        play: 'Play this act',
        pause: 'Pause this act',
        resume: 'Resume this act',
        replay: 'Replay this act',
        skip: 'Skip this act animation',
        audioOn: 'Score playing: {track}',
        audioOff: 'Score is off',
        audioLoading: 'Preparing the score',
        audioError: 'The score could not play; the article remains available',
        audioSensitive: 'Score paused while sensitive material is open',
        audioHelp: 'Score paused in the help section',
        audioEnable: 'Turn score on',
        audioDisable: 'Turn score off',
        tide: 'The Tide and the Temple',
        scratches: 'Seventeen Scratches'
      },
      ja: {
        ready: 'この幕は再生できます',
        playing: '第{act}幕を再生中',
        paused: '第{act}幕を一時停止しました',
        complete: '第{act}幕が終了しました',
        skipped: '第{act}幕の終わりへ移動しました',
        static: '動きのない表示です。台詞全文は逐字稿で読めます',
        line: '全{total}行中の{current}行目',
        play: 'この幕を再生',
        pause: 'この幕を一時停止',
        resume: 'この幕を続ける',
        replay: 'この幕を再生し直す',
        skip: 'この幕の動きをスキップ',
        audioOn: '音楽を再生中：{track}',
        audioOff: '音楽はオフです',
        audioLoading: '音楽を準備しています',
        audioError: '音楽を再生できません。本文は引き続き読めます',
        audioSensitive: 'センシティブな内容を開いている間、音楽を停止します',
        audioHelp: '相談案内では音楽を停止します',
        audioEnable: '音楽をオンにする',
        audioDisable: '音楽をオフにする',
        tide: '潮と寺院',
        scratches: '十七の傷跡'
      }
    };
    const baseCopy = copies[languageKey];

    const rootCopy = (name, fallback) => {
      const featureAttribute = 'data-fq-' + name;
      const genericAttribute = 'data-' + name;
      const value = root.getAttribute(featureAttribute)
        || root.getAttribute(genericAttribute)
        || body.getAttribute(featureAttribute)
        || body.getAttribute(genericAttribute)
        || fallback;
      return language === 'zh-hans' && typeof window.cv === 'function'
        ? window.cv(value)
        : value;
    };

    const copy = {
      ready: rootCopy('scene-ready', baseCopy.ready),
      playing: rootCopy('scene-playing', baseCopy.playing),
      paused: rootCopy('scene-paused', baseCopy.paused),
      complete: rootCopy('scene-complete', baseCopy.complete),
      skipped: rootCopy('scene-skipped', baseCopy.skipped),
      static: rootCopy('scene-static', baseCopy.static),
      line: rootCopy('scene-line', baseCopy.line),
      play: rootCopy('label-play', baseCopy.play),
      pause: rootCopy('label-pause', baseCopy.pause),
      resume: rootCopy('label-resume', baseCopy.resume),
      replay: rootCopy('label-replay', baseCopy.replay),
      skip: rootCopy('label-skip', baseCopy.skip),
      audioOn: rootCopy('audio-on', baseCopy.audioOn),
      audioOff: rootCopy('audio-off', baseCopy.audioOff),
      audioLoading: rootCopy('audio-loading', baseCopy.audioLoading),
      audioError: rootCopy('audio-error', baseCopy.audioError),
      audioSensitive: rootCopy('audio-sensitive', baseCopy.audioSensitive),
      audioHelp: rootCopy('audio-help', baseCopy.audioHelp),
      audioEnable: rootCopy('audio-enable', baseCopy.audioEnable),
      audioDisable: rootCopy('audio-disable', baseCopy.audioDisable),
      tide: rootCopy('track-tide', baseCopy.tide),
      scratches: rootCopy('track-scratches', baseCopy.scratches)
    };

    const format = (template, values) => Object.entries(values).reduce(
      (result, entry) => result.split('{' + entry[0] + '}').join(String(entry[1])),
      template
    );

    const motionButtons = [...doc.querySelectorAll('[data-fq-motion]')];
    const paintMotionButtons = () => motionButtons.forEach(button => {
      const active = button.dataset.fqMotion === motionMode;
      button.setAttribute('aria-pressed', String(active));
      button.dataset.active = active ? 'true' : 'false';
    });
    const chooseMotionMode = mode => {
      if (!['full', 'lite', 'off'].includes(mode) || mode === motionMode) return;
      try { localStorage.setItem('fq-motion-mode', mode); } catch (_error) {}
      window.location.reload();
    };
    paintMotionButtons();
    doc.querySelectorAll('.fq-evidence-legend').forEach(details => {
      if (compactQuery.matches && 'open' in details) details.open = false;
    });

    const clamp = (minimum, value, maximum) => Math.min(maximum, Math.max(minimum, value));

    const parseSeconds = value => {
      if (value === null || value === undefined || value === '') return 0;
      const numeric = Number.parseFloat(value);
      if (!Number.isFinite(numeric) || numeric <= 0) return 0;
      return numeric > 300 ? numeric / 1000 : numeric;
    };

    const normalizeSpeaker = value => {
      const speaker = String(value || 'narrator').toLowerCase();
      return {
        woman: 'female',
        girl: 'female',
        wife: 'female',
        man: 'male',
        boy: 'male',
        husband: 'male',
        both: 'chorus',
        together: 'chorus',
        final: 'chorus'
      }[speaker] || speaker;
    };

    const normalizeTrack = value => {
      const track = String(value || '').toLowerCase();
      if (track.includes('scratch') || track === 'b' || track === '2') return 'scratches';
      return 'tide';
    };

    const sceneAct = state => state.scene.dataset.act || String(state.index + 1);

    const sceneFor = target => {
      if (target instanceof Element) {
        return target.matches('[data-fq-scene]') ? target : target.closest('[data-fq-scene]');
      }
      if (typeof target === 'number' || (typeof target === 'string' && /^[1-5]$/.test(target))) {
        return scenes.find(scene => String(scene.dataset.act) === String(target)) || null;
      }
      if (typeof target === 'string') {
        try {
          const node = doc.querySelector(target);
          return node && (node.matches('[data-fq-scene]') ? node : node.closest('[data-fq-scene]'));
        } catch (_error) {
          return null;
        }
      }
      return null;
    };

    const stateFor = target => {
      const scene = sceneFor(target);
      return scene ? sceneStates.get(scene) : null;
    };

    const poseSource = (actor, poseValue) => {
      if (!actor || !poseValue) return '';
      const pose = String(poseValue).trim();
      if (!pose) return '';
      if (/^(?:https?:|data:|blob:|\/|\.\/|\.\.\/)/i.test(pose)
        || /\.(?:avif|webp|png|jpe?g|gif)(?:[?#].*)?$/i.test(pose)) {
        return pose;
      }
      const explicit = actor.getAttribute('data-pose-' + pose);
      if (explicit) return explicit;
      const base = actor.getAttribute('data-pose-base') || '';
      if (!base || !base.includes('{pose}')) return '';
      return base.split('{pose}').join(encodeURIComponent(pose));
    };

    const preloadPose = source => {
      if (!source) return Promise.resolve(false);
      if (posePreloads.has(source)) return posePreloads.get(source);
      const promise = new Promise(resolve => {
        const image = new Image();
        let settled = false;
        const finish = result => {
          if (settled) return;
          settled = true;
          resolve(result);
        };
        image.decoding = 'async';
        image.onload = () => {
          if (typeof image.decode === 'function') {
            image.decode().catch(() => undefined).finally(() => finish(true));
          } else {
            finish(true);
          }
        };
        image.onerror = () => finish(false);
        image.src = source;
        if (image.complete && image.naturalWidth) finish(true);
      });
      posePreloads.set(source, promise);
      return promise;
    };

    const actorPoseState = actor => {
      if (poseStates.has(actor)) return poseStates.get(actor);
      const layers = [...actor.querySelectorAll('img[data-pose-layer]')];
      const selected = Math.max(0, layers.findIndex(layer => layer.classList.contains('is-active')));
      layers.forEach((layer, index) => {
        layer.alt = '';
        layer.setAttribute('aria-hidden', 'true');
        layer.decoding = 'async';
        layer.classList.toggle('is-active', index === selected);
      });
      const state = {
        layers,
        activeIndex: selected,
        pose: actor.dataset.activePose || '',
        request: 0
      };
      poseStates.set(actor, state);
      return state;
    };

    const setActorPose = async (actor, pose, options = {}) => {
      if (!actor || !pose) return false;
      const state = actorPoseState(actor);
      const source = poseSource(actor, pose);
      if (!source || !state.layers.length) return false;
      if (state.pose === String(pose)) return true;

      const request = ++state.request;
      const activeLayer = state.layers[state.activeIndex];
      const targetIndex = state.layers.length > 1
        ? (state.activeIndex + 1) % state.layers.length
        : state.activeIndex;
      const targetLayer = state.layers[targetIndex];
      const animate = options.animate !== false && Boolean(gsapEngine) && !reducedMotion;

      targetLayer.src = source;
      targetLayer.dataset.pose = String(pose);
      const loaded = await preloadPose(source);
      if (!loaded || request !== state.request || destroyed) return false;

      actor.dataset.activePose = String(pose);
      state.pose = String(pose);

      if (!animate || !activeLayer || targetLayer === activeLayer) {
        state.layers.forEach((layer, index) => {
          const isActive = index === targetIndex;
          layer.classList.toggle('is-active', isActive);
          layer.style.opacity = isActive ? '1' : '0';
          layer.style.visibility = isActive ? 'visible' : 'hidden';
        });
        state.activeIndex = targetIndex;
        return true;
      }

      gsapEngine.killTweensOf([activeLayer, targetLayer]);
      gsapEngine.set(targetLayer, { autoAlpha: 0, scale: 1.006 });
      targetLayer.classList.add('is-active');
      const fadeOut = compactQuery.matches ? 0.1 : 0.16;
      const fadeIn = compactQuery.matches ? 0.22 : 0.32;
      gsapEngine.timeline({
        onComplete: () => {
          if (destroyed || request !== state.request) return;
          activeLayer.classList.remove('is-active');
          targetLayer.classList.add('is-active');
          gsapEngine.set(activeLayer, { autoAlpha: 0, scale: 1 });
          gsapEngine.set(targetLayer, { autoAlpha: 1, scale: 1 });
          state.activeIndex = targetIndex;
        }
      })
        .to(activeLayer, { autoAlpha: 0, duration: fadeOut, ease: 'power1.out' }, 0)
        .to(targetLayer, { autoAlpha: 1, scale: 1, duration: fadeIn, ease: 'power2.out' }, 0.05);
      return true;
    };

    const prefetchScenePoses = state => {
      if (!state || state.prefetched || saveData) return;
      state.prefetched = true;
      state.lines.forEach(line => {
        const female = line.dataset.femalePose;
        const male = line.dataset.malePose;
        const femaleSource = poseSource(state.actors.female, female);
        const maleSource = poseSource(state.actors.male, male);
        if (femaleSource) preloadPose(femaleSource);
        if (maleSource) preloadPose(maleSource);
      });
    };

    const setStatus = (state, message) => {
      if (!state || !state.status) return;
      state.status.textContent = message;
    };

    const setProgress = (state, progress) => {
      if (!state || !state.progress) return;
      const normalized = clamp(0, Number(progress) || 0, 1);
      state.progress.style.setProperty('--fq-scene-progress', normalized.toFixed(4));
      state.progress.setAttribute('role', 'progressbar');
      state.progress.setAttribute('aria-valuemin', '0');
      state.progress.setAttribute('aria-valuemax', '100');
      state.progress.setAttribute('aria-valuenow', String(Math.round(normalized * 100)));
      if ('value' in state.progress) state.progress.value = normalized;
    };

    const updateControls = state => {
      if (!state) return;
      const playing = state.playing && !state.paused;
      state.controls.play.forEach(button => {
        button.disabled = playing;
        button.setAttribute('aria-label', copy.play);
      });
      state.controls.pause.forEach(button => {
        button.disabled = !state.started || state.completed;
        button.setAttribute('aria-pressed', String(state.paused));
        button.setAttribute('aria-label', state.paused ? copy.resume : copy.pause);
        button.dataset.state = state.paused ? 'paused' : 'playing';
        const visibleLabel = state.paused
          ? button.getAttribute('data-resume-label')
          : button.getAttribute('data-pause-label');
        const labelNode = button.querySelector('[data-control-label]');
        if (visibleLabel && labelNode) labelNode.textContent = visibleLabel;
        else if (visibleLabel && !button.children.length) button.textContent = visibleLabel;
      });
      state.controls.replay.forEach(button => {
        button.disabled = false;
        button.setAttribute('aria-label', copy.replay);
      });
      state.controls.skip.forEach(button => {
        button.disabled = state.completed;
        button.setAttribute('aria-label', copy.skip);
      });
    };

    const clearSceneSpeaker = state => {
      ['female', 'male', 'chorus', 'narrator'].forEach(speaker => {
        state.scene.classList.remove('is-speaking-' + speaker);
        if (state.stage) state.stage.classList.remove('is-speaking-' + speaker);
      });
      state.scene.removeAttribute('data-active-speaker');
      if (state.stage) state.stage.removeAttribute('data-active-speaker');
    };

    const hideLine = line => {
      if (!line) return;
      line.classList.remove('is-current');
      line.classList.add('is-spoken');
      line.setAttribute('aria-hidden', 'true');
    };

    const clearLines = state => {
      state.activeLine = null;
      state.lines.forEach(line => {
        line.classList.remove('is-current', 'is-spoken');
        line.setAttribute('aria-hidden', 'true');
      });
      if (gsapEngine) {
        gsapEngine.set(state.lines, { autoAlpha: 0, y: 0, scale: 1 });
      }
      clearSceneSpeaker(state);
    };

    const activateLine = (state, line, index) => {
      if (!state || !line || destroyed) return;
      if (state.activeLine && state.activeLine !== line) hideLine(state.activeLine);
      const speaker = normalizeSpeaker(line.dataset.speaker);
      clearSceneSpeaker(state);
      state.scene.classList.add('is-speaking-' + speaker);
      state.scene.dataset.activeSpeaker = speaker;
      if (state.stage) {
        state.stage.classList.add('is-speaking-' + speaker);
        state.stage.dataset.activeSpeaker = speaker;
      }
      line.classList.remove('is-spoken');
      line.classList.add('is-current');
      line.setAttribute('aria-hidden', 'false');
      state.activeLine = line;
      state.activeLineIndex = index;

      const femalePose = line.dataset.femalePose;
      const malePose = line.dataset.malePose;
      if (femalePose) setActorPose(state.actors.female, femalePose, { animate: state.started });
      if (malePose) setActorPose(state.actors.male, malePose, { animate: state.started });

      setStatus(state, format(copy.line, {
        current: index + 1,
        total: state.lines.length
      }));
      setDialogueDucking(true);
    };

    const deactivateLine = (state, line) => {
      if (!state || !line) return;
      hideLine(line);
      if (state.activeLine === line) state.activeLine = null;
      setDialogueDucking(false);
    };

    const lineHold = line => {
      const explicit = parseSeconds(line.dataset.hold || line.dataset.duration);
      if (explicit) return clamp(2.1, explicit, 12);
      const text = (line.textContent || '').trim();
      if (languageKey === 'en') {
        const words = text.split(/\s+/).filter(Boolean).length;
        return clamp(3.1, 1.55 + words * 0.255, 8.5);
      }
      const visibleCharacters = text.replace(/\s+/g, '').length;
      return clamp(3, 1.7 + visibleCharacters * 0.075, 8);
    };

    const scaledHolds = state => {
      const holds = state.lines.map(lineHold);
      const requested = parseSeconds(state.scene.dataset.sceneDuration);
      if (!requested || !holds.length) return holds;
      const fixed = 2.2 + holds.length * 0.92;
      const available = Math.max(holds.length * 2.1, requested - fixed);
      const sum = holds.reduce((total, value) => total + value, 0) || 1;
      const scale = clamp(0.56, available / sum, 1.85);
      return holds.map(value => clamp(2.1, value * scale, 12));
    };

    /* The outer actor owns all body movement. Pose layers only crossfade in
       setActorPose(), keeping their alpha transition independent from GSAP's
       weight shifts and preventing nested transforms from drifting on replay. */
    const actorMotionTarget = actor => actor || null;

    const gestureProfiles = [
      { name: 'measured', shift: 1.35, lift: 4.4, lean: 0.24, breath: 0.006, listenerShift: 0.28, nod: 1.35 },
      { name: 'open', shift: 2.15, lift: 6.7, lean: 0.43, breath: 0.009, listenerShift: 0.42, nod: 1.8 },
      { name: 'aching', shift: 1.55, lift: 3.8, lean: 0.34, breath: 0.012, listenerShift: -0.24, nod: 1.15 },
      { name: 'resolve', shift: 2.45, lift: 7.2, lean: 0.5, breath: 0.007, listenerShift: 0.52, nod: 2.15 },
      { name: 'hushed', shift: 1.05, lift: 3.1, lean: 0.2, breath: 0.01, listenerShift: 0.18, nod: 0.95 }
    ];

    const gestureProfile = (state, line, index, speaker) => {
      const act = Number.parseInt(sceneAct(state), 10) || state.index + 1;
      const speakerOffset = speaker === 'male' ? 2 : speaker === 'chorus' ? 4 : 0;
      const deterministicIndex = Math.abs(act * 11 + index * 7 + speakerOffset) % gestureProfiles.length;
      const profile = { ...gestureProfiles[deterministicIndex] };
      const gesture = String(line.dataset.gesture || '').toLowerCase();
      if (gesture === 'plead' || gesture === 'reach') {
        profile.shift *= 1.14;
        profile.lift *= 1.12;
        profile.lean *= 1.15;
        profile.listenerShift = Math.abs(profile.listenerShift) + 0.12;
      } else if (gesture === 'refuse' || gesture === 'retreat') {
        profile.shift *= 0.82;
        profile.lean *= 0.78;
        profile.listenerShift = -Math.abs(profile.listenerShift) - 0.18;
      }
      if (compactQuery.matches) {
        profile.shift *= 0.74;
        profile.lift *= 0.76;
        profile.lean *= 0.72;
        profile.listenerShift *= 0.72;
        profile.nod *= 0.78;
      }
      return profile;
    };

    const inwardDirection = (actor, state) => {
      if (!actor) return 0;
      const stageRect = state.stage && state.stage.getBoundingClientRect
        ? state.stage.getBoundingClientRect()
        : null;
      const actorRect = actor.getBoundingClientRect ? actor.getBoundingClientRect() : null;
      if (stageRect && actorRect && stageRect.width > 0 && actorRect.width > 0) {
        const stageCenter = stageRect.left + stageRect.width / 2;
        const actorCenter = actorRect.left + actorRect.width / 2;
        if (Math.abs(stageCenter - actorCenter) > 1) return actorCenter < stageCenter ? 1 : -1;
      }
      const role = normalizeSpeaker(actor.dataset.actor);
      const reversed = String(sceneAct(state)) === '4';
      if (role === 'female') return reversed ? -1 : 1;
      return reversed ? 1 : -1;
    };

    const addSpeakerGesture = (timeline, target, inward, profile, position, hold, variation) => {
      if (!target) return;
      const accent = variation ? -0.08 : 0.08;
      const shifted = inward * profile.shift;
      const leaned = inward * (profile.lean + accent);
      const phraseAt = position + Math.min(0.72, Math.max(0.42, hold * 0.18));
      const settleAt = position + Math.max(1.22, hold - 0.18);
      const breathAt = phraseAt + 0.5;
      const breathDuration = clamp(0.46, (settleAt - breathAt - 0.08) / 2, 0.9);
      const breathRepeats = Math.max(
        1,
        Math.floor((settleAt - breathAt - 0.08) / breathDuration) - 1
      );

      /* A small intake, a forward phrase accent, then a long breath. The pose
         swap supplies the hand shape while this wrapper supplies body weight. */
      timeline.to(target, {
        xPercent: shifted * 0.72,
        y: -profile.lift * 0.58,
        rotation: leaned * 0.7,
        scaleX: 1.002,
        scaleY: 1 + profile.breath * 0.62,
        duration: 0.38,
        ease: 'power2.out'
      }, position);
      timeline.to(target, {
        xPercent: shifted,
        y: -profile.lift,
        rotation: leaned,
        scaleX: 1.003,
        scaleY: 1 + profile.breath,
        duration: 0.48,
        ease: 'power2.inOut'
      }, phraseAt);
      timeline.to(target, {
        xPercent: shifted * 0.9,
        y: -profile.lift + (variation ? 0.8 : -0.8),
        rotation: leaned * 0.86,
        scaleX: 1,
        scaleY: 1 + profile.breath * 0.28,
        duration: breathDuration,
        ease: 'sine.inOut',
        repeat: breathRepeats,
        yoyo: true
      }, breathAt);
      timeline.to(target, {
        xPercent: 0,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        duration: 0.54,
        ease: 'sine.inOut'
      }, settleAt);
    };

    const addListenerGesture = (timeline, target, inward, profile, position, hold, variation) => {
      if (!target) return;
      const responseShift = inward * profile.listenerShift;
      const responseLean = inward * (profile.listenerShift < 0 ? -0.13 : 0.16);
      const nodAt = position + Math.min(0.88, Math.max(0.58, hold * (variation ? 0.29 : 0.23)));
      const settleAt = position + Math.max(1.28, hold - 0.12);

      timeline.to(target, {
        xPercent: responseShift,
        y: variation ? 0.8 : -0.7,
        rotation: responseLean,
        scaleX: 1,
        scaleY: 1.002,
        duration: 0.46,
        ease: 'sine.inOut'
      }, position + 0.1);
      timeline.to(target, {
        xPercent: responseShift * 1.08,
        y: profile.nod,
        rotation: responseLean * 1.25,
        duration: 0.24,
        ease: 'power1.inOut'
      }, nodAt);
      timeline.to(target, {
        xPercent: responseShift,
        y: variation ? -0.5 : 0,
        rotation: responseLean * 0.72,
        duration: 0.34,
        ease: 'sine.out'
      }, nodAt + 0.24);
      timeline.to(target, {
        xPercent: 0,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        duration: 0.58,
        ease: 'sine.inOut'
      }, settleAt);
    };

    const addActorGesture = (timeline, state, line, index, position, hold) => {
      const speaker = normalizeSpeaker(line.dataset.speaker);
      const female = actorMotionTarget(state.actors.female);
      const male = actorMotionTarget(state.actors.male);
      const femaleInward = inwardDirection(female, state);
      const maleInward = inwardDirection(male, state);
      const profile = gestureProfile(state, line, index, speaker);
      const variation = (state.index + index) % 2;

      if (speaker === 'female') {
        addSpeakerGesture(timeline, female, femaleInward, profile, position, hold, variation);
        addListenerGesture(timeline, male, maleInward, profile, position, hold, variation);
      } else if (speaker === 'male') {
        addSpeakerGesture(timeline, male, maleInward, profile, position, hold, variation);
        addListenerGesture(timeline, female, femaleInward, profile, position, hold, variation);
      } else if (speaker === 'chorus') {
        addSpeakerGesture(timeline, female, femaleInward, profile, position, hold, variation);
        addSpeakerGesture(timeline, male, maleInward, profile, position + 0.06, hold, variation ? 0 : 1);
      } else {
        addListenerGesture(timeline, female, femaleInward, profile, position, hold, variation);
        addListenerGesture(timeline, male, maleInward, profile, position + 0.05, hold, variation ? 0 : 1);
      }
    };

    const settleActorMotion = state => {
      if (!gsapEngine || !state) return;
      const targets = Object.values(state.actors).map(actorMotionTarget).filter(Boolean);
      if (!targets.length) return;
      gsapEngine.set(targets, {
        xPercent: 0,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1
      });
    };

    const resetSceneVisuals = state => {
      clearLines(state);
      state.scene.classList.remove('is-playing', 'is-paused', 'is-complete', 'is-skipped');
      state.started = false;
      state.playing = false;
      state.paused = false;
      state.completed = false;
      state.userPaused = false;
      state.autoPaused = false;
      state.activeLineIndex = -1;
      setProgress(state, 0);
      setStatus(state, format(copy.ready, { act: sceneAct(state) }));

      if (!gsapEngine) return;
      const actors = Object.values(state.actors).filter(Boolean);
      const motionTargets = actors.map(actorMotionTarget).filter(Boolean);
      gsapEngine.set(actors, { autoAlpha: 1, xPercent: 0, y: 0, rotation: 0, scale: 1 });
      gsapEngine.set(motionTargets, { xPercent: 0, y: 0, rotation: 0, scale: 1 });
      if (state.backdrop) gsapEngine.set(state.backdrop, { scale: 1.035, xPercent: 0, yPercent: 0 });
      if (state.curtainLeft) gsapEngine.set(state.curtainLeft, { xPercent: 0 });
      if (state.curtainRight) gsapEngine.set(state.curtainRight, { xPercent: 0 });
    };

    const finishScene = (state, skipped = false) => {
      if (!state || destroyed) return;
      if (state.fallbackTimer) {
        clearTimeout(state.fallbackTimer);
        animationTimers.delete(state.fallbackTimer);
        state.fallbackTimer = 0;
      }
      if (state.activeLine) deactivateLine(state, state.activeLine);
      state.started = true;
      state.playing = false;
      state.paused = false;
      state.completed = true;
      state.userPaused = false;
      state.autoPaused = false;
      state.scene.classList.remove('is-playing', 'is-paused');
      state.scene.classList.add('is-complete');
      state.scene.classList.toggle('is-skipped', skipped);
      if (skipped) settleActorMotion(state);
      const finalLine = state.lines[state.lines.length - 1];
      if (finalLine) activateLine(state, finalLine, state.lines.length - 1);
      setProgress(state, 1);
      setStatus(state, format(skipped ? copy.skipped : copy.complete, { act: sceneAct(state) }));
      updateControls(state);
      setDialogueDucking(false);
    };

    const buildSceneTimeline = state => {
      if (!gsapEngine || reducedMotion || !state.lines.length) return null;
      const actors = Object.values(state.actors).filter(Boolean);
      const holds = scaledHolds(state);
      const timeline = gsapEngine.timeline({
        paused: true,
        defaults: { ease: 'power2.out' },
        onStart: () => {
          state.started = true;
          state.playing = true;
          state.paused = false;
          state.completed = false;
          state.scene.classList.add('is-playing');
          state.scene.classList.remove('is-paused', 'is-complete', 'is-skipped');
          setStatus(state, format(copy.playing, { act: sceneAct(state) }));
          updateControls(state);
        },
        onUpdate: () => setProgress(state, timeline.progress()),
        onComplete: () => finishScene(state, false)
      });

      let cursor = 0;
      if (!liteMotion && (state.curtainLeft || state.curtainRight)) {
        if (state.curtainLeft) {
          timeline.fromTo(state.curtainLeft, { xPercent: 0 }, {
            xPercent: -102,
            duration: 1.18,
            ease: 'power3.inOut'
          }, 0);
        }
        if (state.curtainRight) {
          timeline.fromTo(state.curtainRight, { xPercent: 0 }, {
            xPercent: 102,
            duration: 1.18,
            ease: 'power3.inOut'
          }, 0);
        }
        cursor = 0.82;
      }

      if (state.backdrop && !liteMotion) {
        timeline.fromTo(state.backdrop, {
          scale: 1.055,
          yPercent: 0
        }, {
          scale: 1.015,
          yPercent: -0.7,
          duration: 5.5,
          ease: 'sine.out'
        }, 0);
      }

      actors.forEach(actor => {
        const isFemale = actor.dataset.actor === 'female';
        timeline.fromTo(actor, {
          autoAlpha: 1,
          xPercent: isFemale ? -2.5 : 2.5,
          y: 9,
          rotation: isFemale ? -0.35 : 0.35
        }, {
          autoAlpha: 1,
          xPercent: 0,
          y: 0,
          rotation: 0,
          duration: 1.08,
          ease: 'power2.out',
          immediateRender: false
        }, Math.max(0.18, cursor - 0.28));
      });
      cursor += 0.72;

      state.lines.forEach((line, index) => {
        const hold = holds[index];
        const entrance = cursor;
        timeline.call(() => activateLine(state, line, index), null, entrance);
        timeline.fromTo(line, {
          autoAlpha: 0,
          y: 14,
          scale: 0.992
        }, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.43,
          ease: 'power2.out'
        }, entrance + 0.06);
        if (!liteMotion) addActorGesture(timeline, state, line, index, entrance + 0.08, hold);
        timeline.to(line, {
          autoAlpha: 0,
          y: -9,
          duration: 0.34,
          ease: 'power1.in'
        }, entrance + 0.45 + hold);
        timeline.call(() => deactivateLine(state, line), null, entrance + 0.81 + hold);
        cursor = entrance + 1.03 + hold;
      });

      const finalTargets = Object.values(state.actors).map(actorMotionTarget).filter(Boolean);
      if (finalTargets.length) {
        timeline.to(finalTargets, {
          xPercent: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 0.75,
          ease: 'sine.inOut'
        }, cursor);
      }
      return timeline;
    };

    const clearFallbackTimer = state => {
      if (!state.fallbackTimer) return;
      clearTimeout(state.fallbackTimer);
      animationTimers.delete(state.fallbackTimer);
      state.fallbackTimer = 0;
    };

    const scheduleFallbackAdvance = (state, delay) => {
      clearFallbackTimer(state);
      state.fallbackRemaining = delay;
      state.fallbackDeadline = performance.now() + delay;
      state.fallbackTimer = window.setTimeout(() => {
        animationTimers.delete(state.fallbackTimer);
        state.fallbackTimer = 0;
        if (state.activeLine) deactivateLine(state, state.activeLine);
        state.fallbackIndex += 1;
        if (state.fallbackIndex >= state.lines.length) {
          finishScene(state, false);
          return;
        }
        showFallbackLine(state);
      }, delay);
      animationTimers.add(state.fallbackTimer);
    };

    const showFallbackLine = state => {
      const line = state.lines[state.fallbackIndex];
      if (!line) {
        finishScene(state, false);
        return;
      }
      activateLine(state, line, state.fallbackIndex);
      const hold = scaledHolds(state)[state.fallbackIndex] * 1000;
      scheduleFallbackAdvance(state, hold);
    };

    const startFallback = (state, restart) => {
      if (restart || state.completed || !state.started) {
        resetSceneVisuals(state);
        state.fallbackIndex = 0;
      }
      state.started = true;
      state.playing = true;
      state.paused = false;
      state.completed = false;
      state.scene.classList.add('is-playing');
      state.scene.classList.remove('is-paused', 'is-complete', 'is-skipped');
      setStatus(state, format(copy.playing, { act: sceneAct(state) }));
      updateControls(state);
      if (state.activeLine && state.fallbackRemaining) {
        scheduleFallbackAdvance(state, state.fallbackRemaining);
      } else {
        showFallbackLine(state);
      }
    };

    const pauseScene = (state, options = {}) => {
      if (!state || !state.playing || state.completed) return false;
      if (state.timeline) {
        state.timeline.pause();
      } else {
        state.fallbackRemaining = Math.max(120, state.fallbackDeadline - performance.now());
        clearFallbackTimer(state);
      }
      state.playing = false;
      state.paused = true;
      if (!options.visibility && !options.automatic) state.userPaused = true;
      state.autoPaused = Boolean(options.automatic);
      state.scene.classList.remove('is-playing');
      state.scene.classList.add('is-paused');
      if (!options.visibility) {
        setStatus(state, format(copy.paused, { act: sceneAct(state) }));
        updateControls(state);
      }
      return true;
    };

    const playScene = (state, options = {}) => {
      if (!state || destroyed) return false;
      if (reducedMotion) {
        const transcript = state.transcript;
        if (transcript && 'open' in transcript) transcript.open = true;
        setStatus(state, copy.static);
        return false;
      }

      prefetchScenePoses(state);
      if (activeScene && activeScene !== state && activeScene.playing) {
        pauseScene(activeScene, { automatic: true });
      }
      activeScene = state;
      setDesiredTrack(state.track);
      if (!options.auto) state.userInteracted = true;
      state.userPaused = false;
      state.autoPaused = false;

      const restart = Boolean(options.restart || state.completed);
      if (state.timeline) {
        if (restart) {
          state.timeline.pause(0, true);
          resetSceneVisuals(state);
          state.timeline.restart();
        } else {
          state.timeline.play();
        }
        state.started = true;
        state.playing = true;
        state.paused = false;
        state.completed = false;
        state.scene.classList.add('is-playing');
        state.scene.classList.remove('is-paused', 'is-complete', 'is-skipped');
        setStatus(state, format(copy.playing, { act: sceneAct(state) }));
        updateControls(state);
        return true;
      }

      startFallback(state, restart);
      return true;
    };

    const skipScene = state => {
      if (!state || state.completed) return;
      state.userInteracted = true;
      if (state.timeline) state.timeline.pause();
      clearFallbackTimer(state);
      clearLines(state);
      const finalLine = state.lines[state.lines.length - 1];
      if (finalLine) {
        const femalePose = finalLine.dataset.femalePose;
        const malePose = finalLine.dataset.malePose;
        if (femalePose) setActorPose(state.actors.female, femalePose, { animate: false });
        if (malePose) setActorPose(state.actors.male, malePose, { animate: false });
      }
      finishScene(state, true);
    };

    const prepareScene = (scene, index) => {
      const stage = scene.querySelector('[data-fq-stage], .fq-stage') || scene;
      const dialogue = scene.querySelector('[data-fq-dialogue], .fq-dialogue');
      const lines = [...scene.querySelectorAll('.fq-line[data-speaker], [data-fq-line][data-speaker]')]
        .filter(line => !line.closest('[data-fq-transcript], .fq-transcript'));
      const controlsNode = scene.querySelector('[data-scene-controls], .fq-scene-controls');
      let status = scene.querySelector('[data-scene-status], .fq-scene-status');
      if (!status) {
        status = doc.createElement('span');
        status.className = controlsNode ? 'fq-scene-status' : 'fq-sr-only';
        status.dataset.sceneStatus = '';
        (controlsNode || scene).appendChild(status);
      }
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      status.setAttribute('aria-atomic', 'true');
      if (dialogue) {
        dialogue.setAttribute('aria-live', 'polite');
        dialogue.setAttribute('aria-atomic', 'false');
      }

      const state = {
        scene,
        stage,
        dialogue,
        lines,
        actors: {
          female: scene.querySelector('.fq-actor[data-actor="female"], [data-actor="female"]'),
          male: scene.querySelector('.fq-actor[data-actor="male"], [data-actor="male"]')
        },
        curtainLeft: scene.querySelector('[data-curtain-panel="left"], .fq-curtain__panel--left'),
        curtainRight: scene.querySelector('[data-curtain-panel="right"], .fq-curtain__panel--right'),
        backdrop: scene.querySelector('[data-fq-background], .fq-stage__backdrop, .fq-stage__bg'),
        transcript: scene.querySelector('[data-fq-transcript], .fq-transcript'),
        status,
        progress: scene.querySelector('[data-scene-progress], .fq-scene-progress'),
        controls: {
          play: [...scene.querySelectorAll('[data-scene-play], [data-fq-action="play"]')],
          pause: [...scene.querySelectorAll('[data-scene-pause], [data-fq-action="pause"]')],
          replay: [...scene.querySelectorAll('[data-scene-replay], [data-fq-action="replay"]')],
          skip: [...scene.querySelectorAll('[data-scene-skip], [data-fq-action="skip"]')]
        },
        index,
        track: normalizeTrack(scene.dataset.track),
        activeLine: null,
        activeLineIndex: -1,
        timeline: null,
        fallbackTimer: 0,
        fallbackIndex: 0,
        fallbackDeadline: 0,
        fallbackRemaining: 0,
        started: false,
        playing: false,
        paused: false,
        userPaused: false,
        autoPaused: false,
        completed: false,
        userInteracted: false,
        prefetched: false,
        manual: scene.dataset.sceneManual !== undefined && scene.dataset.sceneManual !== 'false'
      };

      scene.classList.add('is-enhanced');
      scene.dataset.fqReady = 'true';
      lines.forEach((line, lineIndex) => {
        if (!line.id) line.id = 'fq-act-' + sceneAct(state) + '-line-' + (lineIndex + 1);
        line.setAttribute('aria-hidden', 'true');
      });
      Object.values(state.actors).filter(Boolean).forEach(actor => actorPoseState(actor));
      resetSceneVisuals(state);

      if (reducedMotion) {
        scene.classList.add('is-static');
        if (dialogue) dialogue.setAttribute('aria-live', 'off');
        const hasTranscript = Boolean(state.transcript);
        lines.forEach(line => line.setAttribute('aria-hidden', hasTranscript ? 'true' : 'false'));
        if (state.transcript && 'open' in state.transcript) state.transcript.open = true;
        setStatus(state, copy.static);
      } else {
        state.timeline = buildSceneTimeline(state);
      }

      sceneStates.set(scene, state);
      updateControls(state);
      return state;
    };

    scenes.forEach(prepareScene);

    /* Audio --------------------------------------------------------------- */
    const audioMap = {
      tide: doc.querySelector('#qiqiAudioTide'),
      scratches: doc.querySelector('#qiqiAudioScratches')
    };
    const audioButtons = [...doc.querySelectorAll('[data-fq-audio-toggle], [data-audio-toggle]')]
      .filter((node, index, collection) => collection.indexOf(node) === index);
    const audioStatusNodes = [...doc.querySelectorAll('[data-fq-audio-status], [data-audio-state]')]
      .filter((node, index, collection) => collection.indexOf(node) === index);
    const rampFrames = new WeakMap();
    let audioEnabled = false;
    let audioUserActivated = false;
    let currentTrack = null;
    let desiredTrack = scenes.length ? normalizeTrack(scenes[0].dataset.track) : 'tide';
    let dialogueDucked = false;
    let audioLock = '';
    let audioSwitchToken = 0;

    const trackTitle = key => key === 'scratches' ? copy.scratches : copy.tide;
    const trackVolume = key => {
      const attribute = key === 'scratches' ? 'data-fq-volume-scratches' : 'data-fq-volume-tide';
      const configured = Number.parseFloat(root.getAttribute(attribute));
      if (Number.isFinite(configured)) return clamp(0.05, configured, 0.78);
      return key === 'scratches' ? 0.29 : 0.34;
    };

    Object.values(audioMap).filter(Boolean).forEach(audio => {
      audio.loop = true;
      audio.preload = saveData ? 'none' : (audio.getAttribute('preload') || 'none');
      audio.volume = 0;
    });

    const setAudioStatus = message => {
      audioStatusNodes.forEach(node => {
        node.textContent = message;
        node.setAttribute('aria-live', 'polite');
        node.setAttribute('aria-atomic', 'true');
      });
    };

    const paintAudioButtons = enabled => {
      audioButtons.forEach(button => {
        button.setAttribute('aria-pressed', String(enabled));
        button.dataset.audioState = enabled ? 'on' : 'off';
        button.setAttribute('aria-label', enabled ? copy.audioDisable : copy.audioEnable);
        const label = button.querySelector('[data-fq-audio-label], b');
        if (label) {
          const onLabel = label.getAttribute('data-label-on') || copy.audioDisable;
          const offLabel = label.getAttribute('data-label-off') || copy.audioEnable;
          label.textContent = enabled ? onLabel : offLabel;
        }
      });
    };

    const cancelRamp = audio => {
      const ramp = rampFrames.get(audio);
      if (!ramp) return;
      if (ramp.frame) cancelAnimationFrame(ramp.frame);
      rampFrames.delete(audio);
      if (typeof ramp.resolve === 'function') ramp.resolve();
    };

    const rampAudio = (audio, target, duration = 500) => new Promise(resolve => {
      if (!audio) {
        resolve();
        return;
      }
      cancelRamp(audio);
      const startVolume = Number.isFinite(audio.volume) ? audio.volume : 0;
      const endVolume = clamp(0, target, 1);
      if (!duration || Math.abs(startVolume - endVolume) < 0.002) {
        audio.volume = endVolume;
        resolve();
        return;
      }
      const startTime = performance.now();
      const tick = now => {
        if (destroyed) {
          rampFrames.delete(audio);
          resolve();
          return;
        }
        const progress = clamp(0, (now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        audio.volume = startVolume + (endVolume - startVolume) * eased;
        if (progress < 1) {
          const frame = requestAnimationFrame(tick);
          rampFrames.set(audio, { frame, resolve });
        } else {
          rampFrames.delete(audio);
          resolve();
        }
      };
      const frame = requestAnimationFrame(tick);
      rampFrames.set(audio, { frame, resolve });
    });

    const stopAllAudio = async (duration = 420) => {
      const token = ++audioSwitchToken;
      const audios = Object.values(audioMap).filter(Boolean);
      await Promise.all(audios.map(audio => rampAudio(audio, 0, duration)));
      if (token !== audioSwitchToken) return false;
      audios.forEach(audio => audio.pause());
      currentTrack = null;
      return true;
    };

    const playTrack = async (track, options = {}) => {
      const key = normalizeTrack(track);
      desiredTrack = key;
      if (!audioEnabled || audioLock || document.hidden) return false;
      const next = audioMap[key];
      if (!next) {
        setAudioStatus(copy.audioError);
        return false;
      }

      const token = ++audioSwitchToken;
      const oldKey = currentTrack;
      const old = oldKey ? audioMap[oldKey] : null;
      const target = trackVolume(key) * (dialogueDucked ? 0.42 : 1);
      setAudioStatus(copy.audioLoading);

      try {
        if (options.restart) next.currentTime = 0;
        if (next.paused) await next.play();
        if (token !== audioSwitchToken) return false;
        if (!audioEnabled || audioLock || desiredTrack !== key) {
          next.pause();
          return false;
        }
        currentTrack = key;
        const duration = options.crossfade === false ? 650 : 2200;
        const fades = [rampAudio(next, target, duration)];
        if (old && old !== next) {
          fades.push(rampAudio(old, 0, duration).then(() => {
            if (currentTrack !== oldKey) old.pause();
          }));
        }
        await Promise.all(fades);
        if (token !== audioSwitchToken || !audioEnabled) return false;
        paintAudioButtons(true);
        setAudioStatus(format(copy.audioOn, { track: trackTitle(key) }));
        return true;
      } catch (_error) {
        if (token !== audioSwitchToken) return false;
        next.pause();
        audioEnabled = false;
        currentTrack = null;
        paintAudioButtons(false);
        setAudioStatus(copy.audioError);
        return false;
      }
    };

    const enableAudio = async () => {
      audioUserActivated = true;
      audioEnabled = true;
      paintAudioButtons(true);
      if (audioLock) {
        setAudioStatus(audioLock === 'help' ? copy.audioHelp : copy.audioSensitive);
        return false;
      }
      return playTrack(desiredTrack, { crossfade: false });
    };

    const disableAudio = async () => {
      audioUserActivated = true;
      audioEnabled = false;
      paintAudioButtons(false);
      setAudioStatus(copy.audioOff);
      await stopAllAudio(420);
      return true;
    };

    function setDesiredTrack(track) {
      const key = normalizeTrack(track);
      if (!audioMap[key]) return;
      desiredTrack = key;
      const dock = doc.querySelector('[data-fq-audio-dock], [data-audio-dock]');
      if (dock) dock.dataset.track = key;
      if (audioEnabled && !audioLock && currentTrack !== key) {
        playTrack(key, { crossfade: true });
      }
    }

    function setDialogueDucking(ducked) {
      dialogueDucked = Boolean(ducked);
      if (!audioEnabled || !currentTrack) return;
      const audio = audioMap[currentTrack];
      if (!audio || audio.paused) return;
      const target = trackVolume(currentTrack) * (dialogueDucked ? 0.42 : 1);
      rampAudio(audio, target, dialogueDucked ? 260 : 620);
    }

    const lockAudio = async reason => {
      audioLock = reason;
      setAudioStatus(reason === 'help' ? copy.audioHelp : copy.audioSensitive);
      if (!audioEnabled) return;
      await stopAllAudio(650);
    };

    const unlockAudio = reason => {
      if (audioLock !== reason) return;
      audioLock = '';
      if (audioEnabled) playTrack(desiredTrack, { crossfade: false });
      else setAudioStatus(copy.audioOff);
    };

    paintAudioButtons(false);
    setAudioStatus(copy.audioOff);

    doc.querySelectorAll('[data-sensitive-details]').forEach(details => {
      details.addEventListener('toggle', () => {
        if (details.open) {
          lockAudio('sensitive');
        } else {
          const timer = window.setTimeout(() => {
            animationTimers.delete(timer);
            const anyOpen = [...doc.querySelectorAll('[data-sensitive-details]')].some(node => node.open);
            if (!anyOpen) unlockAudio('sensitive');
          }, 900);
          animationTimers.add(timer);
        }
      });
    });

    const continueAudioButtons = [...doc.querySelectorAll('[data-fq-audio-continue]')];
    continueAudioButtons.forEach(button => button.addEventListener('click', () => {
      button.hidden = true;
      unlockAudio('help');
    }));

    /* Page motion --------------------------------------------------------- */
    const initReveals = () => {
      const reveals = [...doc.querySelectorAll('[data-fq-reveal], .fq-reveal')]
        .filter((node, index, collection) => collection.indexOf(node) === index);
      if (!reveals.length) return;
      if (reducedMotion) {
        reveals.forEach(node => node.classList.add('is-visible'));
        return;
      }

      html.classList.add('fq-motion-ready');
      if (gsapEngine && ScrollTrigger) {
        gsapEngine.set(reveals, { autoAlpha: 0, y: compactQuery.matches ? 15 : 24 });
        reveals.forEach(node => {
          const trigger = ScrollTrigger.create({
            trigger: node,
            start: 'top 88%',
            once: true,
            onEnter: self => {
              node.classList.add('is-visible');
              gsapEngine.to(node, {
                autoAlpha: 1,
                y: 0,
                duration: compactQuery.matches ? 0.58 : 0.82,
                ease: 'power2.out',
                overwrite: 'auto',
                onComplete: () => gsapEngine.set(node, { clearProps: 'opacity,visibility,transform' })
              });
              self.kill();
            }
          });
          scrollTriggers.push(trigger);
        });
        return;
      }

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          });
        }, { threshold: 0.08, rootMargin: '0px 0px -7% 0px' });
        reveals.forEach(node => observer.observe(node));
        observers.push(observer);
      } else {
        reveals.forEach(node => node.classList.add('is-visible'));
      }
    };

    const initHeroParallax = () => {
      if (!gsapEngine || !ScrollTrigger || reducedMotion || liteMotion || saveData) return;
      const hero = doc.querySelector('[data-fq-hero], .fq-hero');
      if (!hero) return;
      const layers = [...hero.querySelectorAll('[data-fq-hero-layer], [data-fq-hero-media] img, .fq-hero__media img, .fq-hero__image img')]
        .filter((node, index, collection) => collection.indexOf(node) === index);
      layers.forEach((layer, index) => {
        const trigger = gsapEngine.to(layer, {
          yPercent: compactQuery.matches ? -3.2 : -7.5 - index * 1.5,
          scale: compactQuery.matches ? 1.025 : 1.055,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.75,
            invalidateOnRefresh: true
          }
        }).scrollTrigger;
        if (trigger) scrollTriggers.push(trigger);
      });
    };

    const stageParallaxCleanups = [];
    const initStageParallax = () => {
      if (!gsapEngine || reducedMotion || liteMotion || saveData || compactQuery.matches) return;
      scenes.forEach(scene => {
        const stage = scene.querySelector('.fq-stage');
        const light = scene.querySelector('.fq-stage__light');
        const seals = scene.querySelector('.fq-seals--scene');
        if (!stage || (!light && !seals)) return;
        const onMove = event => {
          const rect = stage.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / Math.max(1, rect.width) - .5);
          const y = ((event.clientY - rect.top) / Math.max(1, rect.height) - .5);
          if (light) gsapEngine.to(light, { x: x * 8, y: y * 5, duration: .8, ease: 'power2.out', overwrite: 'auto' });
          if (seals) gsapEngine.to(seals, { x: x * -5, y: y * -3, duration: 1, ease: 'power2.out', overwrite: 'auto' });
        };
        const onLeave = () => {
          if (light) gsapEngine.to(light, { x: 0, y: 0, duration: 1.1, overwrite: 'auto' });
          if (seals) gsapEngine.to(seals, { x: 0, y: 0, duration: 1.1, overwrite: 'auto' });
        };
        stage.addEventListener('pointermove', onMove, { passive: true });
        stage.addEventListener('pointerleave', onLeave, { passive: true });
        stageParallaxCleanups.push(() => { stage.removeEventListener('pointermove', onMove); stage.removeEventListener('pointerleave', onLeave); });
      });
    };

    const initSeals = () => {
      if (!gsapEngine || reducedMotion || liteMotion || saveData) return;
      let seals = [...doc.querySelectorAll('[data-fq-seal], .fq-seal, .fq-seals > span')]
        .filter((node, index, collection) => collection.indexOf(node) === index);
      if (compactQuery.matches) seals = seals.slice(0, 2);
      seals.forEach((seal, index) => {
        const target = seal.querySelector('[data-fq-seal-art], .fq-seal__art, img, i') || seal;
        const configured = Number.parseFloat(seal.dataset.sealDuration);
        const duration = Number.isFinite(configured) ? clamp(24, configured, 180) : 58 + index * 11;
        const direction = seal.dataset.sealDirection === '-1' || index % 2 ? -1 : 1;
        const tween = gsapEngine.to(target, {
          rotation: '+=' + (360 * direction),
          duration,
          ease: 'none',
          repeat: -1,
          transformOrigin: '50% 50%',
          paused: true
        });
        tween._fqSection = seal.closest('section') || seal;
        tween._fqVisible = false;
        sealTweens.push(tween);
      });
    };

    const initPageRonghua = () => {
      if (!featureScript || !featureScript.src) return;
      const assetBase = new URL('./', featureScript.src);
      const placements = [
        ['.fq-boundary', 'tian-tian-ronghua-refined-blue-branch-20260818.webp'],
        ['#waiting', 'tian-tian-ronghua-refined-peony-butterfly-20260818.webp'],
        ['#signals', 'tian-tian-ronghua-refined-snow-magnolia-20260818.webp'],
        ['#court-findings', 'tian-tian-ronghua-refined-frost-chrysanthemum-20260818.webp'],
        ['#protection', 'tian-tian-ronghua-refined-ten-knot-camellia-20260818.webp'],
        ['#sources', 'qiqi-ronghua-refined-plum-kingfisher-20260820.webp']
      ];

      placements.forEach((placement, index) => {
        const section = doc.querySelector(placement[0]);
        if (!section || section.querySelector(':scope > .fq-page-ronghua')) return;
        const wrapper = doc.createElement('span');
        const art = doc.createElement('i');
        const image = doc.createElement('img');
        wrapper.className = 'fq-page-ronghua fq-page-ronghua--' + String(index + 1).padStart(2, '0');
        wrapper.setAttribute('aria-hidden', 'true');
        art.className = 'fq-page-ronghua__art';
        image.src = new URL('art/' + placement[1], assetBase).href;
        image.alt = '';
        image.width = 1200;
        image.height = 800;
        image.loading = 'lazy';
        image.decoding = 'async';
        image.dataset.fqRonghua = '';
        art.append(image);
        wrapper.append(art);
        section.prepend(wrapper);
      });
    };

    const initRonghua = () => {
      if (!gsapEngine || reducedMotion || liteMotion || saveData) return;
      const flowers = [...doc.querySelectorAll('[data-fq-ronghua]')]
        .filter((node, index, collection) => collection.indexOf(node) === index)
        .filter(node => {
          const wrapper = node.closest('.fq-ronghua');
          return !wrapper || window.getComputedStyle(wrapper).display !== 'none';
        });
      flowers.forEach((flower, index) => {
        const direction = index % 2 ? -1 : 1;
        const tween = gsapEngine.to(flower, {
          xPercent: direction * (compactQuery.matches ? 1.1 : 1.8),
          yPercent: index % 2 ? 1.8 : -2.2,
          rotation: direction * (compactQuery.matches ? 0.35 : 0.65),
          duration: 10 + index * 2.4,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          transformOrigin: '50% 50%',
          paused: true
        });
        tween._fqSection = flower.closest('section') || flower;
        tween._fqVisible = false;
        sealTweens.push(tween);
      });
    };

    const initDecorVisibility = () => {
      if (!sealTweens.length || !('IntersectionObserver' in window)) {
        sealTweens.forEach(tween => { tween._fqVisible = true; tween.play(); });
        return;
      }
      const sections = [...new Set(sealTweens.map(tween => tween._fqSection).filter(Boolean))];
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          sealTweens.filter(tween => tween._fqSection === entry.target).forEach(tween => {
            tween._fqVisible = entry.isIntersecting;
            if (entry.isIntersecting && !document.hidden) tween.play(); else tween.pause();
          });
        });
      }, { rootMargin: '20% 0px', threshold: 0.01 });
      sections.forEach(section => observer.observe(section));
      observers.push(observer);
    };

    initPageRonghua();
    initReveals();
    initHeroParallax();
    initStageParallax();
    initSeals();
    initRonghua();
    initDecorVisibility();

    /* Scene and track observers ------------------------------------------ */
    if ('IntersectionObserver' in window && scenes.length) {
      const poseObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const state = sceneStates.get(entry.target);
          prefetchScenePoses(state);
          poseObserver.unobserve(entry.target);
        });
      }, { rootMargin: '650px 0px', threshold: 0.01 });
      scenes.forEach(scene => poseObserver.observe(scene));
      observers.push(poseObserver);

      const ratios = new Map();
      const sceneObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
          const state = sceneStates.get(entry.target);
          if (!state || reducedMotion) return;
          if (!entry.isIntersecting && state.playing) {
            pauseScene(state, { automatic: true });
            return;
          }
          if (entry.isIntersecting
            && entry.intersectionRatio >= (compactQuery.matches ? 0.36 : 0.44)
            && (!state.started || state.autoPaused)
            && !state.userInteracted
            && !state.manual) {
            playScene(state, { auto: true });
          }
        });

        const mostVisible = [...ratios.entries()]
          .filter(entry => entry[1] >= 0.14)
          .sort((a, b) => b[1] - a[1])[0];
        if (mostVisible) {
          const state = sceneStates.get(mostVisible[0]);
          if (state) {
            visibleScene = state;
            setDesiredTrack(state.track);
          }
        } else {
          visibleScene = null;
        }
      }, {
        threshold: [0, 0.14, 0.36, 0.44, 0.62],
        rootMargin: '-10% 0px -18% 0px'
      });
      scenes.forEach(scene => sceneObserver.observe(scene));
      observers.push(sceneObserver);

      const help = doc.querySelector('[data-fq-help-zone], [data-help-zone], .fq-help');
      if (help) {
        let helpEntered = false;
        const helpObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.2 && !helpEntered) {
              helpEntered = true;
              lockAudio('help');
              continueAudioButtons.forEach(button => { button.hidden = false; });
            } else if (!entry.isIntersecting && helpEntered && !continueAudioButtons.length) {
              helpEntered = false;
              unlockAudio('help');
            }
          });
        }, { threshold: [0.2, 0.45] });
        helpObserver.observe(help);
        observers.push(helpObserver);
      }
    }

    /* Controls ------------------------------------------------------------ */
    const sceneFromControl = control => {
      const scene = control.closest('[data-fq-scene]');
      return scene ? sceneStates.get(scene) : null;
    };

    const onClick = event => {
      const motionButton = event.target.closest('[data-fq-motion]');
      if (motionButton) { chooseMotionMode(motionButton.dataset.fqMotion); return; }

      const audioButton = event.target.closest('[data-fq-audio-toggle], [data-audio-toggle]');
      if (audioButton) {
        if (audioEnabled) disableAudio();
        else enableAudio();
        return;
      }

      const start = event.target.closest('[data-fq-start]');
      if (start) {
        const target = start.getAttribute('data-fq-start') || start.getAttribute('href') || '1';
        const state = stateFor(target);
        if (state) {
          state.scene.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
          playScene(state, { restart: state.completed });
        }
        return;
      }

      const play = event.target.closest('[data-scene-play], [data-fq-action="play"]');
      if (play) {
        const state = sceneFromControl(play);
        if (state) playScene(state, { restart: state.completed });
        return;
      }

      const pause = event.target.closest('[data-scene-pause], [data-fq-action="pause"]');
      if (pause) {
        const state = sceneFromControl(pause);
        if (!state) return;
        if (state.paused) playScene(state);
        else pauseScene(state);
        return;
      }

      const replay = event.target.closest('[data-scene-replay], [data-fq-action="replay"]');
      if (replay) {
        const state = sceneFromControl(replay);
        if (state) playScene(state, { restart: true });
        return;
      }

      const skip = event.target.closest('[data-scene-skip], [data-fq-action="skip"]');
      if (skip) {
        const state = sceneFromControl(skip);
        if (state) skipScene(state);
      }
    };
    doc.addEventListener('click', onClick);

    /* Lifecycle ----------------------------------------------------------- */
    const pageProgress = doc.querySelector('.fq-progress i');
    const topbar = doc.querySelector('.fq-topbar');
    let pageScrollFrame = 0;

    const paintPageScroll = () => {
      pageScrollFrame = 0;
      const scrolling = doc.scrollingElement || html;
      const maximum = Math.max(1, scrolling.scrollHeight - window.innerHeight);
      const progress = clamp(0, window.scrollY / maximum, 1);
      if (pageProgress) pageProgress.style.setProperty('--fq-page-progress', progress.toFixed(4));
      if (topbar) topbar.classList.toggle('is-scrolled', window.scrollY > 72);
    };

    const onPageScroll = () => {
      if (pageScrollFrame || destroyed) return;
      pageScrollFrame = requestAnimationFrame(paintPageScroll);
    };

    const onResize = () => {
      onPageScroll();
      scheduleRefresh();
    };

    const scheduleRefresh = () => {
      if (!ScrollTrigger || destroyed) return;
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => {
        refreshFrame = 0;
        if (!destroyed) ScrollTrigger.refresh();
      });
    };

    window.addEventListener('scroll', onPageScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    paintPageScroll();

    const pauseForVisibility = () => {
      sceneStates.forEach(state => {
        if (!state.playing) return;
        if (pauseScene(state, { visibility: true })) visibilityPausedScenes.add(state);
      });
      sealTweens.forEach(tween => tween.pause());
      const current = currentTrack ? audioMap[currentTrack] : null;
      visibilityAudioResume = Boolean(audioEnabled && current && !current.paused && !audioLock);
      Object.values(audioMap).filter(Boolean).forEach(audio => audio.pause());
    };

    const resumeFromVisibility = () => {
      sealTweens.forEach(tween => { if (tween._fqVisible) tween.resume(); });
      visibilityPausedScenes.forEach(state => {
        if (state.completed || state.userPaused) return;
        playScene(state, { auto: true });
      });
      visibilityPausedScenes.clear();
      if (visibilityAudioResume && audioEnabled && !audioLock) {
        playTrack(desiredTrack, { crossfade: false });
      }
      visibilityAudioResume = false;
      scheduleRefresh();
    };

    const onVisibility = () => {
      if (doc.hidden) pauseForVisibility();
      else resumeFromVisibility();
    };
    doc.addEventListener('visibilitychange', onVisibility);

    const onPageShow = event => {
      if (event.persisted) {
        resumeFromVisibility();
        scheduleRefresh();
      }
    };
    window.addEventListener('pageshow', onPageShow);

    const destroy = () => {
      if (destroyed) return;
      destroyed = true;
      cancelAnimationFrame(refreshFrame);
      cancelAnimationFrame(pageScrollFrame);
      animationTimers.forEach(timer => clearTimeout(timer));
      animationTimers.clear();
      observers.forEach(observer => observer.disconnect());
      scrollTriggers.forEach(trigger => {
        if (trigger && typeof trigger.kill === 'function') trigger.kill();
      });
      sealTweens.forEach(tween => tween.kill());
      stageParallaxCleanups.forEach(cleanup => cleanup());
      sceneStates.forEach(state => {
        clearFallbackTimer(state);
        if (state.timeline) state.timeline.kill();
        if (gsapEngine) {
          const actors = Object.values(state.actors).filter(Boolean);
          actors.forEach(actor => {
            const poseState = poseStates.get(actor);
            if (poseState) poseState.request += 1;
          });
          gsapEngine.killTweensOf([
            ...state.lines,
            ...actors,
            ...Object.values(state.actors).map(actorMotionTarget).filter(Boolean),
            ...actors.flatMap(actor => [...actor.querySelectorAll('[data-pose-layer]')])
          ]);
        }
      });
      Object.values(audioMap).filter(Boolean).forEach(audio => {
        cancelRamp(audio);
        audio.pause();
      });
      doc.removeEventListener('click', onClick);
      doc.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('scroll', onPageScroll);
      window.removeEventListener('resize', onResize);
    };

    window.addEventListener('pagehide', event => {
      if (event.persisted) pauseForVisibility();
      else destroy();
    });
    window.addEventListener('load', scheduleRefresh, { once: true });
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(scheduleRefresh).catch(() => undefined);
    [...doc.images].forEach(image => {
      if (!image.complete) image.addEventListener('load', scheduleRefresh, { once: true });
    });

    window.FujianQiqiFeature = {
      version: '1.3.3',
      play(target) {
        const state = stateFor(target);
        return state ? playScene(state) : false;
      },
      pause(target) {
        const state = stateFor(target);
        return state ? pauseScene(state) : false;
      },
      replay(target) {
        const state = stateFor(target);
        return state ? playScene(state, { restart: true }) : false;
      },
      skip(target) {
        const state = stateFor(target);
        if (!state) return false;
        skipScene(state);
        return true;
      },
      setPose(target, actorName, pose, animate = true) {
        const state = stateFor(target);
        const actor = state && state.actors[normalizeSpeaker(actorName)];
        return actor ? setActorPose(actor, pose, { animate }) : Promise.resolve(false);
      },
      enableAudio,
      disableAudio,
      setTrack: setDesiredTrack,
      refresh: scheduleRefresh,
      destroy,
      getState(target) {
        const state = stateFor(target);
        if (!state) return null;
        return {
          act: sceneAct(state),
          track: state.track,
          started: state.started,
          playing: state.playing,
          paused: state.paused,
          complete: state.completed,
          line: state.activeLineIndex
        };
      }
    };
  });
})();

/* Watercolor panorama ending showcase · 2026-08-21 */
(() => {
  'use strict';

  const ready = callback => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  };

  ready(() => {
    const html = document.documentElement;
    const ending = document.querySelector('.fq-ending');
    if (!ending || ending.dataset.fqWatercolorEnding === 'true') return;
    ending.dataset.fqWatercolorEnding = 'true';

    const makeLayer = className => {
      const layer = document.createElement('div');
      layer.className = className;
      layer.setAttribute('aria-hidden', 'true');
      return layer;
    };

    const detail = makeLayer('fq-ending__panorama fq-ending__panorama--detail');
    const full = makeLayer('fq-ending__panorama fq-ending__panorama--full');
    const glow = makeLayer('fq-ending__lantern-glow');
    ending.prepend(detail, full, glow);
    ending.classList.add('has-watercolor-panorama', 'is-watercolor-intro', 'is-visible');

    const compact = matchMedia('(max-width: 780px)').matches;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = Boolean(navigator.connection && navigator.connection.saveData);
    let motionMode = html.dataset.fqMotion || 'full';
    if (!['full', 'lite', 'off'].includes(motionMode)) {
      try { motionMode = localStorage.getItem('fq-motion-mode') || 'full'; } catch (_error) {}
    }
    const lite = motionMode === 'lite';
    const off = motionMode === 'off';
    const gsap = window.gsap && typeof window.gsap.timeline === 'function' ? window.gsap : null;

    const shell = ending.querySelector('.fq-shell');
    const pieces = shell
      ? [
          shell.querySelector(':scope > small'),
          shell.querySelector(':scope > h2'),
          shell.querySelector(':scope > p'),
          shell.querySelector('.fq-ending__seal'),
          shell.querySelector('.fq-ending__actions')
        ].filter(Boolean)
      : [];

    let played = false;
    let inView = false;
    let timeline = null;
    let glowTween = null;
    let observer = null;

    const showStatic = () => {
      ending.classList.remove('is-watercolor-intro', 'is-watercolor-animating');
      ending.classList.add('is-watercolor-copy', 'is-watercolor-static', 'is-watercolor-complete');
      if (gsap) {
        gsap.set(full, { autoAlpha: 1, scale: 1, xPercent: 0, yPercent: 0 });
        gsap.set(detail, { autoAlpha: 0, scale: 1, xPercent: 0, yPercent: 0 });
        gsap.set(glow, { autoAlpha: 0, scale: 1 });
        gsap.set(pieces, { autoAlpha: 1, x: 0, y: 0, filter: 'none' });
      }
    };

    if (!gsap || reduced || off || saveData) {
      showStatic();
    } else {
      const hold = lite ? 1.25 : 2.4;
      const crossAt = Math.max(.7, hold - .25);
      const detailDuration = lite ? 1.15 : 7.6;
      const copyAt = lite ? hold + .35 : hold + .72;

      gsap.set(full, { autoAlpha: 1, scale: 1, xPercent: 0, yPercent: 0 });
      gsap.set(detail, {
        autoAlpha: 0,
        scale: compact ? 1.13 : 1.09,
        xPercent: compact ? 1.8 : .7,
        yPercent: compact ? -.8 : 0
      });
      gsap.set(glow, { autoAlpha: 0, scale: .92 });
      gsap.set(pieces, { autoAlpha: 0, y: compact ? 22 : 28, filter: 'blur(3px)' });

      glowTween = gsap.to(glow, {
        autoAlpha: .76,
        scale: 1.08,
        duration: 2.6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        paused: true
      });

      timeline = gsap.timeline({
        paused: true,
        defaults: { ease: 'power2.out' },
        onStart: () => ending.classList.add('is-watercolor-animating'),
        onComplete: () => {
          ending.classList.remove('is-watercolor-animating');
          ending.classList.add('is-watercolor-complete');
          gsap.set(full, { autoAlpha: 0 });
          gsap.set(detail, { autoAlpha: 1, scale: 1, xPercent: 0, yPercent: 0 });
          gsap.set(pieces, { clearProps: 'opacity,visibility,transform,filter' });
          if (inView && !lite) glowTween.play();
        }
      });

      timeline.to(full, {
        scale: compact ? 1.018 : 1.012,
        duration: hold,
        ease: 'sine.inOut'
      }, 0);

      timeline.to(full, {
        autoAlpha: 0,
        scale: compact ? 1.045 : 1.03,
        duration: lite ? .78 : 1.35,
        ease: 'power2.inOut'
      }, crossAt);

      timeline.to(detail, {
        autoAlpha: 1,
        scale: 1,
        xPercent: 0,
        yPercent: 0,
        duration: detailDuration,
        ease: lite ? 'power2.out' : 'power1.out'
      }, crossAt);

      timeline.call(() => {
        ending.classList.remove('is-watercolor-intro');
        ending.classList.add('is-watercolor-copy');
        if (!lite && inView) glowTween.play(0);
      }, null, crossAt + .45);

      timeline.to(pieces, {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: lite ? .58 : .88,
        stagger: lite ? .1 : .19,
        ease: 'power2.out'
      }, copyAt);

      const seal = shell && shell.querySelector('.fq-ending__seal');
      if (seal) {
        timeline.fromTo(seal, {
          scale: .78,
          rotation: -15
        }, {
          scale: 1,
          rotation: -5,
          duration: .92,
          ease: 'back.out(1.7)'
        }, copyAt + .55);
      }
    }

    const playOrResume = () => {
      if (!timeline) return;
      if (!played) {
        played = true;
        timeline.play(0);
      } else if (timeline.progress() < 1) {
        timeline.resume();
      } else if (!lite && glowTween) {
        glowTween.resume();
      }
    };

    const pauseMotion = () => {
      if (timeline && timeline.progress() < 1) timeline.pause();
      if (glowTween) glowTween.pause();
    };

    if (timeline && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          inView = entry.isIntersecting && entry.intersectionRatio >= .08;
          html.classList.toggle('fq-ending-focus', inView);
          if (inView) playOrResume(); else pauseMotion();
        });
      }, { threshold: [0, .08, .2, .45], rootMargin: '3% 0px -5% 0px' });
      observer.observe(ending);
    } else if (timeline) {
      inView = true;
      html.classList.add('fq-ending-focus');
      playOrResume();
    }

    const onVisibility = () => {
      if (document.hidden) {
        pauseMotion();
      } else if (inView) {
        playOrResume();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    window.FujianQiqiEnding = {
      replay() {
        if (!timeline) {
          showStatic();
          return false;
        }
        played = true;
        ending.classList.remove('is-watercolor-copy', 'is-watercolor-complete', 'is-watercolor-static');
        ending.classList.add('is-watercolor-intro');
        glowTween.pause(0);
        timeline.restart(true);
        return true;
      }
    };

    window.addEventListener('pagehide', () => {
      if (observer) observer.disconnect();
      if (timeline) timeline.kill();
      if (glowTween) glowTween.kill();
      document.removeEventListener('visibilitychange', onVisibility);
      html.classList.remove('fq-ending-focus');
    }, { once: true });
  });
})();

/* Third-act contrast and motion refinement · 2026-08-21 */
(() => {
  'use strict';

  const ready = callback => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  };

  ready(() => {
    const scene = document.querySelector('.fq-act[data-act="3"]');
    const stage = scene && scene.querySelector('.fq-stage');
    if (!scene || !stage || scene.dataset.fqAct3Refined === 'true') return;
    scene.dataset.fqAct3Refined = 'true';

    const html = document.documentElement;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = Boolean(navigator.connection && navigator.connection.saveData);
    const motionMode = html.dataset.fqMotion || 'full';
    const lite = motionMode === 'lite';
    const off = motionMode === 'off';
    const gsap = window.gsap && typeof window.gsap.timeline === 'function' ? window.gsap : null;

    const sweep = document.createElement('div');
    sweep.className = 'fq-act3-moon-sweep';
    sweep.setAttribute('aria-hidden', 'true');

    const marksLayer = document.createElement('div');
    marksLayer.className = 'fq-act3-marks';
    marksLayer.setAttribute('aria-hidden', 'true');

    const xPositions = [7, 13, 20, 28, 36, 44, 52, 61, 69, 77, 85, 91, 17, 33, 48, 65, 82];
    const yPositions = [22, 42, 17, 54, 29, 66, 38, 18, 58, 31, 70, 46, 77, 12, 74, 9, 79];
    const heights = [54, 34, 44, 61, 38, 48, 57, 32, 52, 41, 63, 36, 46, 58, 35, 49, 40];
    const rotations = [-8, 6, -4, 9, -7, 5, -10, 4, -5, 8, -3, 7, -9, 3, -6, 10, -2];

    const marks = xPositions.map((x, index) => {
      const mark = document.createElement('i');
      mark.className = 'fq-act3-mark';
      mark.style.setProperty('--fq-mark-x', `${x}%`);
      mark.style.setProperty('--fq-mark-y', `${yPositions[index]}%`);
      mark.style.setProperty('--fq-mark-height', `${heights[index]}px`);
      mark.style.setProperty('--fq-mark-rotation', `${rotations[index]}deg`);
      marksLayer.append(mark);
      return mark;
    });

    const title = stage.querySelector('.fq-act__title');
    const anchor = stage.querySelector('.fq-stage__light') || title || stage.firstChild;
    stage.insertBefore(sweep, anchor);
    stage.insertBefore(marksLayer, anchor);
    scene.classList.add('fq-act3-refined');

    const titleParts = title ? [...title.querySelectorAll('small, h2, p')] : [];
    const lines = [...stage.querySelectorAll('.fq-dialogue .fq-line')];

    const revealStatic = () => {
      scene.classList.add('fq-act3-ready');
      marks.forEach(mark => mark.classList.add('is-drawn'));
    };

    if (!gsap || reduced || off || saveData) {
      revealStatic();
      return;
    }

    gsap.set(marks, {
      autoAlpha: 0,
      scaleY: 0,
      transformOrigin: '50% 100%'
    });

    const intro = gsap.timeline({
      paused: true,
      defaults: { ease: 'power2.out' },
      onStart: () => scene.classList.add('fq-act3-animating'),
      onComplete: () => {
        scene.classList.remove('fq-act3-animating');
        scene.classList.add('fq-act3-ready');
        gsap.set(titleParts, { clearProps: 'opacity,visibility,transform,filter' });
      }
    });

    if (titleParts.length) {
      intro.fromTo(
        titleParts,
        { autoAlpha: 0, y: -10, filter: 'blur(3px)' },
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: .72, stagger: .12 },
        0
      );
    }

    intro.to(
      marks,
      {
        autoAlpha: index => .24 + (index % 4) * .045,
        scaleY: 1,
        duration: lite ? .42 : .68,
        stagger: lite ? .025 : .055,
        ease: 'power3.out'
      },
      .18
    );

    const ambient = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    ambient.fromTo(
      sweep,
      { xPercent: -4, yPercent: -1, scale: 1.01, autoAlpha: .34 },
      { xPercent: 4, yPercent: 1, scale: 1.05, autoAlpha: .62, duration: 8.5, ease: 'sine.inOut' }
    );
    ambient.to(marksLayer, { autoAlpha: .78, duration: 4.8, ease: 'sine.inOut' }, 0);

    let currentLine = null;
    const emphasizeLine = line => {
      if (!line || line === currentLine) return;
      currentLine = line;
      const label = line.querySelector('b');
      const copy = line.querySelector('span');
      const index = Math.max(0, lines.indexOf(line));
      const start = index * 4;
      const activeMarks = marks.filter((_, markIndex) => markIndex >= start && markIndex < start + 5);
      const passiveMarks = marks.filter(mark => !activeMarks.includes(mark));

      if (label) {
        gsap.fromTo(
          label,
          { autoAlpha: 0, x: -10 },
          { autoAlpha: 1, x: 0, duration: .48, ease: 'power2.out', clearProps: 'opacity,visibility,transform' }
        );
      }
      if (copy) {
        gsap.fromTo(
          copy,
          { autoAlpha: .28, y: 8, filter: 'blur(2px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: .68, ease: 'power2.out', clearProps: 'opacity,visibility,transform,filter' }
        );
      }
      gsap.to(activeMarks, { autoAlpha: .62, duration: .45, stagger: .025, overwrite: 'auto' });
      gsap.to(passiveMarks, { autoAlpha: .2, duration: .58, overwrite: 'auto' });
      gsap.fromTo(
        line,
        { boxShadow: '0 14px 34px rgba(20, 15, 23, .18)' },
        { boxShadow: '0 24px 62px rgba(20, 15, 23, .34)', duration: .75, ease: 'power2.out' }
      );
    };

    lines.forEach(line => {
      if (line.classList.contains('is-current')) emphasizeLine(line);
    });

    const lineObserver = new MutationObserver(records => {
      records.forEach(record => {
        const line = record.target;
        if (line.classList.contains('is-current')) emphasizeLine(line);
      });
    });
    lines.forEach(line => lineObserver.observe(line, { attributes: true, attributeFilter: ['class'] }));

    let introPlayed = false;
    const playVisuals = () => {
      if (!introPlayed) {
        introPlayed = true;
        intro.play(0);
      }
      if (!lite && !document.hidden) ambient.play();
    };
    const pauseVisuals = () => ambient.pause();

    const visibilityObserver = 'IntersectionObserver' in window
      ? new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= .12) playVisuals();
            else pauseVisuals();
          });
        }, { threshold: [0, .12, .35], rootMargin: '12% 0px' })
      : null;

    if (visibilityObserver) visibilityObserver.observe(scene);
    else playVisuals();

    const replayButton = scene.querySelector('[data-scene-replay]');
    const onReplay = () => {
      introPlayed = true;
      intro.restart(true);
      if (!lite) ambient.restart(true);
    };
    if (replayButton) replayButton.addEventListener('click', onReplay);

    const onVisibility = () => {
      if (document.hidden) {
        pauseVisuals();
        return;
      }
      const rect = scene.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < innerHeight) playVisuals();
    };
    document.addEventListener('visibilitychange', onVisibility);

    window.addEventListener('pagehide', () => {
      if (visibilityObserver) visibilityObserver.disconnect();
      lineObserver.disconnect();
      intro.kill();
      ambient.kill();
      gsap.killTweensOf([...marks, marksLayer, sweep, ...titleParts, ...lines]);
      if (replayButton) replayButton.removeEventListener('click', onReplay);
      document.removeEventListener('visibilitychange', onVisibility);
    }, { once: true });
  });
})();

/* Mobile dialogue/control stack measurement · 2026-08-21 */
(() => {
  'use strict';

  const ready = callback => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  };

  ready(() => {
    const html = document.documentElement;
    const media = matchMedia('(max-width: 780px) and (orientation: portrait)');
    const scenes = [...document.querySelectorAll('.fq-act[data-fq-scene], [data-fq-scene]')]
      .filter((scene, index, list) => list.indexOf(scene) === index);
    if (!scenes.length) return;

    const ratios = new Map();
    let resizeFrame = 0;

    const syncScene = scene => {
      if (!media.matches) return;
      const stage = scene.querySelector('.fq-stage, [data-fq-stage]');
      const controls = scene.querySelector('.fq-scene-controls, [data-scene-controls]');
      if (!stage || !controls) return;
      const rect = controls.getBoundingClientRect();
      if (rect.height > 0) {
        stage.style.setProperty('--fq-mobile-control-height', `${Math.ceil(rect.height)}px`);
      }
    };

    const syncAll = () => {
      resizeFrame = 0;
      scenes.forEach(syncScene);
    };

    const scheduleSync = () => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(syncAll);
    };

    const paintFocus = () => {
      const visible = media.matches && [...ratios.values()].some(ratio => ratio >= .08);
      html.classList.toggle('fq-theatre-focus', visible);
    };

    const intersectionObserver = 'IntersectionObserver' in window
      ? new IntersectionObserver(entries => {
          entries.forEach(entry => {
            ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
            if (entry.isIntersecting) syncScene(entry.target);
          });
          paintFocus();
        }, { threshold: [0, .08, .18, .35], rootMargin: '-4% 0px -8% 0px' })
      : null;

    if (intersectionObserver) {
      scenes.forEach(scene => intersectionObserver.observe(scene));
    } else {
      ratios.set(scenes[0], 1);
      paintFocus();
    }

    const resizeObserver = 'ResizeObserver' in window
      ? new ResizeObserver(entries => {
          entries.forEach(entry => {
            const scene = entry.target.closest('.fq-act[data-fq-scene], [data-fq-scene]');
            if (scene) syncScene(scene);
          });
        })
      : null;

    scenes.forEach(scene => {
      const controls = scene.querySelector('.fq-scene-controls, [data-scene-controls]');
      if (controls && resizeObserver) resizeObserver.observe(controls);
    });

    const onViewportChange = () => {
      if (!media.matches) {
        html.classList.remove('fq-theatre-focus');
        scenes.forEach(scene => {
          const stage = scene.querySelector('.fq-stage, [data-fq-stage]');
          if (stage) stage.style.removeProperty('--fq-mobile-control-height');
        });
      } else {
        scheduleSync();
        paintFocus();
      }
    };

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', onViewportChange);
    } else if (typeof media.addListener === 'function') {
      media.addListener(onViewportChange);
    }
    window.addEventListener('resize', scheduleSync, { passive: true });
    window.addEventListener('orientationchange', scheduleSync, { passive: true });
    window.addEventListener('pageshow', scheduleSync);
    scheduleSync();

    window.addEventListener('pagehide', () => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      if (intersectionObserver) intersectionObserver.disconnect();
      if (resizeObserver) resizeObserver.disconnect();
      html.classList.remove('fq-theatre-focus');
      window.removeEventListener('resize', scheduleSync);
      window.removeEventListener('orientationchange', scheduleSync);
      window.removeEventListener('pageshow', scheduleSync);
      if (typeof media.removeEventListener === 'function') {
        media.removeEventListener('change', onViewportChange);
      } else if (typeof media.removeListener === 'function') {
        media.removeListener(onViewportChange);
      }
    }, { once: true });
  });
})();
