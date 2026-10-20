(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const SCRIPT_URL = document.currentScript && document.currentScript.src;
  const assetUrl = relativePath => SCRIPT_URL ? new URL(relativePath, SCRIPT_URL).href : relativePath;
  const POSE_SHEETS = {
    woman: assetUrl('./art/tian-tian-shadow-woman-poses-20260815.webp'),
    scribe: assetUrl('./art/tian-tian-shadow-scribe-poses-20260815.webp')
  };
  const SCORE_URL = assetUrl('./audio/tian-tian-original-score-20260814.mp3');
  const POSE_POSITIONS = ['0% 0%', '50% 0%', '100% 0%', '0% 100%', '50% 100%', '100% 100%'];
  const OPENING_POSES = [
    { woman: [0, 1, 0, 0], scribe: [0, 0, 1, 0] },
    { woman: [0, 1, 0, 0], scribe: [0, 1, 2, 0] },
    { woman: [0, 2, 1, 0], scribe: [0, 2, 0, 0] },
    { woman: [0, 3, 5, 3], scribe: [0, 1, 3, 0] },
    { woman: [3, 1, 4, 0], scribe: [3, 2, 4, 0] }
  ];
  const ACT_POSES = {
    // The prologue starts with the record held open, lowers it, bows to the
    // child's place in the centre of the screen, then opens both silhouettes
    // back toward the audience. These deliberately distinct cells keep the
    // gesture legible even on a narrow phone stage.
    'scroll-prologue': { woman: [0, 2, 4, 5], scribe: [1, 0, 3, 5] },
    'wind-kite': { woman: [0, 1, 0, 5], scribe: [0, 0, 2, 0] },
    'ten-knot-door': { woman: [0, 1, 0, 3], scribe: [0, 0, 2, 3] },
    'frost-lantern': { woman: [0, 3, 4, 3], scribe: [0, 0, 2, 0] },
    'court-scroll': { woman: [0, 0, 2, 0], scribe: [0, 1, 0, 0] },
    'seal-road': { woman: [0, 5, 1, 3], scribe: [0, 0, 2, 3] },
    'evidence-blocks': { woman: [0, 0, 1, 0], scribe: [0, 1, 2, 3] },
    'seven-moon': { woman: [0, 1, 2, 3], scribe: [0, 0, 2, 0] },
    'guarded-lamp': { woman: [3, 1, 5, 4], scribe: [3, 0, 2, 4] }
  };
  const ENDING_POSES = { woman: [0, 5, 4, 3], scribe: [0, 5, 4, 3] };
  const ACT_STORY_DURATIONS = {
    'scroll-prologue': 7.2,
    'wind-kite': 8,
    'ten-knot-door': 8.2,
    'frost-lantern': 8,
    'court-scroll': 8.4,
    'seal-road': 8.6,
    'evidence-blocks': 8.2,
    'seven-moon': 9,
    'guarded-lamp': 9.2
  };
  const prologueAnimations = new WeakMap();

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

  function appendCarvedStageFrame(stage, context) {
    if (!stage || $('.tt-carved-stage-frame', stage)) return;
    const frame = makePart('span', `tt-carved-stage-frame tt-carved-stage-frame--${context}`);
    frame.setAttribute('aria-hidden', 'true');
    stage.append(frame);
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

  function markStoryProp(node, name) {
    node.dataset.ttStoryProp = name;
    return node;
  }

  function appendPrologueProps(props) {
    props.dataset.ttSceneProps = 'scroll-prologue';

    // Keep the prologue useful before any scene-specific CSS arrives by
    // composing it from the same visible craft primitives as the later acts.
    // Modifier classes and data attributes give the stylesheet stable hooks
    // for the prologue's more spacious desktop and phone arrangements.
    const cloud = markStoryProp(makeShadowLine(
      'tt-shadow-line tt-shadow-prologue-cloud',
      [
        'M18 92 C49 55 83 55 112 88 C135 54 176 48 205 82 C230 62 259 63 286 92',
        'M35 119 C73 91 103 99 132 119 C164 88 206 91 235 116'
      ]
    ), 'paper-cut-cloud');
    props.append(cloud);

    props.append(
      markStoryProp(makePart('i', 'tt-shadow-prologue-ornament tt-shadow-prologue-ornament--left'), 'paper-cut-left'),
      markStoryProp(makePart('i', 'tt-shadow-prologue-ornament tt-shadow-prologue-ornament--right'), 'paper-cut-right')
    );

    props.append(markStoryProp(
      makePart('i', 'tt-shadow-scroll tt-shadow-scroll--prologue'),
      'case-file'
    ));
    makeParts('tt-shadow-record-line tt-shadow-record-line--prologue', 4).forEach((line, index) => {
      line.dataset.ttStoryProp = 'record-line';
      line.dataset.ttRecordLine = String(index + 1);
      props.append(line);
    });
    props.append(markStoryProp(
      makePart('i', 'tt-shadow-seal tt-shadow-seal--prologue'),
      'vermilion-seal'
    ));
    props.append(markStoryProp(
      makePart('i', 'tt-shadow-paper-flower tt-shadow-paper-flower--prologue'),
      'paper-flower'
    ));

    const bloom = markStoryProp(
      makePart('i', 'tt-shadow-bloom tt-shadow-bloom--prologue'),
      'velvet-flower'
    );
    makeParts('tt-shadow-petal tt-shadow-petal--prologue', 8).forEach(petal => bloom.append(petal));
    props.append(bloom);

    // This unprinted cartouche is the deliberate empty space revealed when
    // the record descends: a child is placed before the case number without
    // reenacting harm or inventing her likeness.
    props.append(markStoryProp(
      makePart('i', 'tt-shadow-prologue-name-space'),
      'child-before-record'
    ));
  }

  function makePoseActor(role) {
    const actor = makePart('span', `tt-pose-actor tt-pose-actor--${role}`);
    actor.dataset.ttPoseRole = role;
    actor.append(makePart('i', 'tt-pose-sprite'));
    return actor;
  }

  function applyPoseSequence(layer, sequence, play = true) {
    if (!layer || !sequence) return;
    ['woman', 'scribe'].forEach(role => {
      const actor = $(`[data-tt-pose-role="${role}"]`, layer);
      const frames = sequence[role] || [0, 0, 0, 0];
      if (!actor) return;
      actor.style.setProperty('--tt-pose-start', POSE_POSITIONS[frames[0]] || POSE_POSITIONS[0]);
      actor.style.setProperty('--tt-pose-mid', POSE_POSITIONS[frames[1]] || POSE_POSITIONS[0]);
      actor.style.setProperty('--tt-pose-action', POSE_POSITIONS[frames[2]] || POSE_POSITIONS[0]);
      actor.style.setProperty('--tt-pose-end', POSE_POSITIONS[frames[3]] || POSE_POSITIONS[0]);
    });
    layer.classList.remove('is-playing');
    if (!play || reducedMotion) return;
    window.requestAnimationFrame(() => {
      void layer.offsetWidth;
      layer.classList.add('is-playing');
    });
  }

  function makePoseLayer(context, sequence) {
    const layer = makePart('span', `tt-pose-layer tt-pose-layer--${context}`);
    layer.setAttribute('aria-hidden', 'true');
    layer.append(makePoseActor('woman'), makePoseActor('scribe'));
    applyPoseSequence(layer, sequence, false);
    return layer;
  }

  function appendSceneCraft(stage, scene) {
    const craft = makePart('span', `tt-scene-craft tt-scene-craft--${scene}`);
    craft.dataset.ttSceneCraft = scene;

    const add = (className, count = 1) => {
      Array.from({ length: count }, (_, index) => {
        const part = makePart('i', className);
        part.style.setProperty('--tt-craft-i', String(index));
        part.style.setProperty('--tt-craft-count', String(count));
        part.style.setProperty('--tt-craft-progress', count > 1 ? String(index / (count - 1)) : '0');
        craft.append(part);
        return part;
      });
    };

    // Each act receives a small, scene-specific finishing layer. These are
    // abstract craft marks rather than extra narrative figures, so they enrich
    // the Chinese cut-paper vocabulary without competing with the testimony.
    if (scene === 'scroll-prologue') {
      add('tt-craft-scroll-frame');
      add('tt-craft-binding-stitch', 5);
      add('tt-craft-tassel', 2);
    } else if (scene === 'wind-kite') {
      add('tt-craft-wind-ribbon', 3);
      add('tt-craft-wind-mark', 7);
      add('tt-craft-edge-streamer', 2);
    } else if (scene === 'ten-knot-door') {
      add('tt-craft-door-stud', 12);
      add('tt-craft-rosette', 2);
      add('tt-craft-threshold', 3);
    } else if (scene === 'frost-lantern') {
      add('tt-craft-ice-mark', 8);
      add('tt-craft-cold-breath', 3);
      add('tt-craft-frost-corner', 2);
    } else if (scene === 'court-scroll') {
      add('tt-craft-document-tab', 3);
      add('tt-craft-balance-rule');
      add('tt-craft-court-column', 2);
    } else if (scene === 'seal-road') {
      add('tt-craft-route-marker', 3);
      add('tt-craft-track', 5);
      add('tt-craft-home-glow');
    } else if (scene === 'evidence-blocks') {
      add('tt-craft-registration-mark', 4);
      add('tt-craft-ink-pad', 4);
      add('tt-craft-evidence-rule');
    } else if (scene === 'seven-moon') {
      add('tt-craft-stitch-point', 7);
      add('tt-craft-orbit-dot', 6);
      add('tt-craft-needle-glint');
    } else if (scene === 'guarded-lamp') {
      add('tt-craft-safe-arc', 3);
      add('tt-craft-spring-dot', 8);
      add('tt-craft-door-glow');
    }

    // A single transparent atlas supplies the tactile paper sculpture for all
    // nine acts. Keeping it in one cached image avoids nine separate mobile
    // downloads, while the scene modifier selects the correct atlas cell.
    const paperCut = makePart('i', 'tt-paper-cut-atlas');
    paperCut.dataset.ttPaperCut = scene;
    paperCut.append(makePart('span', 'tt-paper-cut-atlas-image'));
    craft.append(paperCut);

    stage.append(craft);
  }

  function preloadPoseSheets() {
    const requests = Object.values(POSE_SHEETS).map(src => new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = resolve;
      image.onerror = reject;
      image.src = src;
      if (image.complete && image.naturalWidth) resolve();
    }));
    Promise.all(requests).then(() => {
      document.documentElement.classList.add('tt-pose-ready');
    }).catch(() => {
      document.documentElement.classList.add('tt-pose-fallback');
    });
  }

  function makeShadowStage(scene) {
    const stage = makePart('div', `tt-shadow-stage tt-shadow-stage--${scene}`);
    stage.setAttribute('aria-hidden', 'true');
    stage.dataset.ttShadowScene = scene;
    stage.append(makePart('span', 'tt-shadow-screen'));
    stage.append(makePart('span', 'tt-shadow-vignette'));
    const atmosphere = makePart('span', 'tt-shadow-atmosphere');
    atmosphere.append(
      makePart('i', 'tt-shadow-sun-disc'),
      makePart('i', 'tt-shadow-cloud tt-shadow-cloud--near'),
      makePart('i', 'tt-shadow-cloud tt-shadow-cloud--far'),
      makePart('i', 'tt-shadow-mountain tt-shadow-mountain--rear'),
      makePart('i', 'tt-shadow-mountain tt-shadow-mountain--front'),
      makePart('i', 'tt-shadow-water'),
      makePart('i', 'tt-shadow-footlights')
    );
    stage.append(atmosphere);
    appendSceneCraft(stage, scene);
    const props = makePart('span', 'tt-shadow-props');

    if (scene === 'scroll-prologue') {
      appendPrologueProps(props);
    } else if (scene === 'wind-kite') {
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
    stage.append(makePoseLayer('transition', ACT_POSES[scene] || ACT_POSES['scroll-prologue']));
    appendCarvedStageFrame(stage, 'transition');
    return stage;
  }

  function cancelPrologueStory(transition) {
    const animations = prologueAnimations.get(transition) || [];
    animations.forEach(animation => {
      try { animation.cancel(); } catch (_) { /* detached/replaced animation */ }
    });
    prologueAnimations.delete(transition);
    transition.classList.remove('is-story-playing');
    const stage = $('.tt-shadow-stage--scroll-prologue', transition);
    if (stage) stage.classList.remove('is-story-playing');
  }

  function playPrologueStory(transition, play = true) {
    if (!transition || transition.dataset.shadowScene !== 'scroll-prologue') return;
    cancelPrologueStory(transition);

    const stage = $('.tt-shadow-stage--scroll-prologue', transition);
    if (!stage) return;
    stage.dataset.ttStoryState = play && !reducedMotion ? 'playing' : 'settled';
    if (!play || reducedMotion || typeof stage.animate !== 'function') return;

    const duration = (ACT_STORY_DURATIONS['scroll-prologue'] || 7.2) * 1000;
    const animations = [];
    const animate = (node, keyframes, options = {}) => {
      if (!node || typeof node.animate !== 'function') return;
      animations.push(node.animate(keyframes, {
        duration,
        fill: 'both',
        easing: 'cubic-bezier(.2,.72,.2,1)',
        ...options
      }));
    };

    transition.classList.add('is-story-playing');
    stage.classList.add('is-story-playing');

    // The physical record opens first, then descends roughly one visual inch.
    // The empty cartouche is revealed only after it has moved out of the way.
    animate($('[data-tt-story-prop="case-file"]', stage), [
      { opacity: .12, transform: 'translate3d(0,-14px,0) scaleX(.18)', offset: 0 },
      { opacity: 1, transform: 'translate3d(0,0,0) scaleX(1)', offset: .3 },
      { opacity: 1, transform: 'translate3d(0,0,0) scaleX(1)', offset: .5 },
      { opacity: .9, transform: 'translate3d(0,24px,0) scaleX(.92)', offset: .78 },
      { opacity: .84, transform: 'translate3d(0,28px,0) scaleX(.92)', offset: 1 }
    ]);
    $$('[data-tt-story-prop="record-line"]', stage).forEach((line, index) => {
      const enter = .2 + index * .045;
      animate(line, [
        { opacity: 0, transform: 'scaleX(0)', offset: 0 },
        { opacity: 0, transform: 'scaleX(0)', offset: enter },
        { opacity: .9, transform: 'scaleX(1)', offset: Math.min(.48, enter + .12) },
        { opacity: .9, transform: 'translate3d(0,0,0) scaleX(1)', offset: .5 },
        { opacity: .62, transform: 'translate3d(0,24px,0) scaleX(.92)', offset: .78 },
        { opacity: .55, transform: 'translate3d(0,28px,0) scaleX(.92)', offset: 1 }
      ]);
    });
    animate($('[data-tt-story-prop="vermilion-seal"]', stage), [
      { opacity: 0, transform: 'translate3d(0,-10px,0) scale(1.7) rotate(-12deg)', offset: 0 },
      { opacity: 0, transform: 'translate3d(0,-10px,0) scale(1.7) rotate(-12deg)', offset: .33 },
      { opacity: .94, transform: 'translate3d(0,0,0) scale(.94) rotate(-3deg)', offset: .51 },
      { opacity: .72, transform: 'translate3d(0,24px,0) scale(.9) rotate(-5deg)', offset: .79 },
      { opacity: .66, transform: 'translate3d(0,28px,0) scale(.9) rotate(-5deg)', offset: 1 }
    ]);
    animate($('[data-tt-story-prop="child-before-record"]', stage), [
      { opacity: 0, transform: 'translate3d(0,12px,0) scale(.84)', offset: 0 },
      { opacity: 0, transform: 'translate3d(0,12px,0) scale(.84)', offset: .48 },
      { opacity: .92, transform: 'translate3d(0,0,0) scale(1)', offset: .72 },
      { opacity: .78, transform: 'translate3d(0,-2px,0) scale(1.02)', offset: 1 }
    ]);

    // Paper-cut clouds, a white paper flower and a velvet bloom frame the
    // action as craft objects rather than decorative emoji-like symbols.
    $$('[data-tt-story-prop="paper-cut-cloud"] path', stage).forEach((path, index) => {
      animate(path, [
        { opacity: .08, strokeDashoffset: 1, offset: 0 },
        { opacity: .08, strokeDashoffset: 1, offset: .08 + index * .04 },
        { opacity: .68, strokeDashoffset: 0, offset: .38 + index * .06 },
        { opacity: .4, strokeDashoffset: 0, offset: 1 }
      ]);
    });
    $$('[data-tt-story-prop^="paper-cut-"]', stage).forEach(ornament => {
      if (ornament.matches('svg')) return;
      const isRight = ornament.classList.contains('tt-shadow-prologue-ornament--right');
      animate(ornament, [
        { opacity: 0, transform: `translate3d(${isRight ? 12 : -12}px,0,0) rotate(${isRight ? 8 : -8}deg)`, offset: 0 },
        { opacity: .72, transform: 'translate3d(0,0,0) rotate(0deg)', offset: .32 },
        { opacity: .5, transform: `translate3d(${isRight ? 3 : -3}px,-2px,0) rotate(${isRight ? 2 : -2}deg)`, offset: 1 }
      ]);
    });
    ['paper-flower', 'velvet-flower'].forEach((name, index) => {
      animate($(`[data-tt-story-prop="${name}"]`, stage), [
        { opacity: 0, transform: 'scale(.22) rotate(-18deg)', offset: 0 },
        { opacity: 0, transform: 'scale(.22) rotate(-18deg)', offset: .46 + index * .06 },
        { opacity: .9, transform: 'scale(1.04) rotate(2deg)', offset: .74 + index * .05 },
        { opacity: .72, transform: 'scale(1) rotate(0deg)', offset: 1 }
      ]);
    });

    // A WAAPI pose track backs up the CSS sprite animation. This prevents the
    // prologue from appearing frozen if it enters while styles or images are
    // still settling, and it works identically on desktop and mobile.
    Object.entries(ACT_POSES['scroll-prologue']).forEach(([role, frames]) => {
      const actor = $(`[data-tt-pose-role="${role}"]`, stage);
      const sprite = actor && $('.tt-pose-sprite', actor);
      const positions = frames.map(frame => POSE_POSITIONS[frame] || POSE_POSITIONS[0]);
      animate(sprite, [
        { backgroundPosition: positions[0], offset: 0 },
        { backgroundPosition: positions[0], offset: .2 },
        { backgroundPosition: positions[1], offset: .201 },
        { backgroundPosition: positions[1], offset: .43 },
        { backgroundPosition: positions[2], offset: .431 },
        { backgroundPosition: positions[2], offset: .78 },
        { backgroundPosition: positions[3], offset: .781 },
        { backgroundPosition: positions[3], offset: 1 }
      ], { easing: 'steps(1,end)' });
      animate(actor, role === 'scribe' ? [
        { opacity: .7, transform: 'translate3d(10px,0,0)', offset: 0 },
        { opacity: 1, transform: 'translate3d(0,0,0)', offset: .22 },
        { opacity: 1, transform: 'translate3d(-3px,-2px,0)', offset: .43 },
        { opacity: .98, transform: 'translate3d(-5px,5px,0)', offset: .78 },
        { opacity: .96, transform: 'translate3d(-2px,3px,0)', offset: 1 }
      ] : [
        { opacity: .7, transform: 'translate3d(-10px,0,0)', offset: 0 },
        { opacity: 1, transform: 'translate3d(0,0,0)', offset: .22 },
        { opacity: 1, transform: 'translate3d(3px,-2px,0)', offset: .43 },
        { opacity: .98, transform: 'translate3d(5px,4px,0)', offset: .78 },
        { opacity: .96, transform: 'translate3d(2px,2px,0)', offset: 1 }
      ]);
    });

    prologueAnimations.set(transition, animations);
  }

  function initShadowStages() {
    $$('[data-shadow-scene]').forEach(transition => {
      const scene = transition.dataset.shadowScene;
      const fallback = $('.tt-transition-puppet', transition);
      if (!scene || $('.tt-shadow-stage', transition)) return;
      const stage = makeShadowStage(scene);
      const speakers = $$('.tt-shadow-dialogue p[data-speaker]', transition)
        .map(line => line.dataset.speaker)
        .filter(Boolean);
      const storyFlow = speakers.length ? speakers.join('-') : 'together';
      const storyDuration = ACT_STORY_DURATIONS[scene] || 8;
      transition.dataset.ttStoryFlow = storyFlow;
      transition.style.setProperty('--tt-story-duration', `${storyDuration}s`);
      stage.dataset.ttStoryFlow = storyFlow;
      const poseLayer = $('.tt-pose-layer--transition', stage);
      if (poseLayer) poseLayer.style.setProperty('--tt-pose-duration', `${storyDuration}s`);
      if (fallback) fallback.replaceWith(stage);
      else {
        const inner = $('.tt-transition-inner', transition);
        if (inner) inner.prepend(stage);
        else transition.prepend(stage);
      }
      transition.classList.add('tt-shadow-ready');
    });
  }

  function initPoseTheatre() {
    const openingStage = $('.tt-stage');
    if (openingStage && !$('.tt-pose-layer--opening', openingStage)) {
      openingStage.append(makePoseLayer('opening', OPENING_POSES[0]));
    }
    appendCarvedStageFrame(openingStage, 'opening');

    const endingStage = $('.tt-ending-theatre-stage');
    appendCarvedStageFrame(endingStage, 'ending');

    const ending = $('[data-tt-ending]');
    if (ending && !$('.tt-pose-layer--ending', ending)) {
      ending.append(makePoseLayer('ending', ENDING_POSES));
    }

    preloadPoseSheets();

    const targets = [...$$('[data-shadow-scene]'), ...(ending ? [ending] : [])];
    if (reducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach(target => {
        const layer = $('.tt-pose-layer', target);
        const scene = target.dataset.shadowScene;
        applyPoseSequence(layer, scene ? ACT_POSES[scene] : ENDING_POSES, false);
        if (scene === 'scroll-prologue') playPrologueStory(target, false);
      });
      return;
    }
    const prologue = $('[data-shadow-scene="scroll-prologue"]');
    let prologueVisible = false;
    const playVisiblePrologue = () => {
      if (!prologue || !prologueVisible || document.body.classList.contains('tt-opening-active')) return;
      const layer = $('.tt-pose-layer', prologue);
      applyPoseSequence(layer, ACT_POSES['scroll-prologue'], true);
      playPrologueStory(prologue, true);
    };
    document.addEventListener('tt:opening-close', () => {
      window.requestAnimationFrame(playVisiblePrologue);
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const target = entry.target;
        const scene = target.dataset.shadowScene;
        if (scene === 'scroll-prologue') {
          prologueVisible = entry.isIntersecting && entry.intersectionRatio >= .58;
          if (!prologueVisible) {
            cancelPrologueStory(target);
            return;
          }
          if (document.body.classList.contains('tt-opening-active')) return;
          const layer = $('.tt-pose-layer', target);
          applyPoseSequence(layer, ACT_POSES[scene], true);
          playPrologueStory(target, true);
          // Keep observing the prologue so its complete 7.2-second narrative
          // begins only when the stage is mostly visible, and replays on return.
          return;
        }
        if (!entry.isIntersecting) return;
        const layer = $('.tt-pose-layer', target);
        applyPoseSequence(layer, scene ? ACT_POSES[scene] : ENDING_POSES, true);
        observer.unobserve(target);
      });
    }, { rootMargin: '-6% 0px -6% 0px', threshold: [.18, .58] });
    targets.forEach(target => observer.observe(target));
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
      applyPoseSequence($('.tt-pose-layer--opening', opening), OPENING_POSES[index], true);
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
    // D yu mode / D minor pentatonic: D, F, G, A, C. The modal cells below
    // were written for this page and do not quote or reconstruct any score.
    const SCALE = [146.83, 174.61, 196, 220, 261.63];
    const transitionPhrases = [
      [0, 2, 1], [0, 4, 3], [3, 2, 0], [0, 3, 1], [4, 3, 0],
      [0, 1, 2], [3, 1, 0], [0, 2, 4], [1, 0, 3]
    ];
    const transitionXiaoTurns = [
      [{ degree: 3, at: 0, hold: 3.25, glide: -54, fall: -36 }, { degree: 1, at: 2.72, hold: 3.6, glide: 38, fall: -52 }],
      [{ degree: 4, at: 0, hold: 3.05, glide: -42, fall: -28 }, { degree: 3, at: 2.55, hold: 3.75, glide: 34, fall: -49 }],
      [{ degree: 2, at: 0, hold: 3.45, glide: 46, fall: -42 }, { degree: 0, at: 2.95, hold: 3.9, glide: 31, fall: -60 }],
      [{ degree: 0, at: 0, hold: 3.15, glide: -48, fall: -26 }, { degree: 3, at: 2.62, hold: 3.5, glide: -36, fall: -45 }],
      [{ degree: 4, at: 0, hold: 3.3, glide: 37, fall: -39 }, { degree: 1, at: 2.78, hold: 4.05, glide: 42, fall: -56 }],
      [{ degree: 1, at: 0, hold: 3.45, glide: -45, fall: -38 }, { degree: 2, at: 2.92, hold: 3.4, glide: -32, fall: -51 }],
      [{ degree: 3, at: 0, hold: 3.15, glide: 42, fall: -33 }, { degree: 0, at: 2.64, hold: 4.15, glide: 36, fall: -62 }],
      [{ degree: 0, at: 0, hold: 3.25, glide: -40, fall: -35 }, { degree: 4, at: 2.72, hold: 3.55, glide: -51, fall: -48 }],
      [{ degree: 1, at: 0, hold: 3.2, glide: 36, fall: -31 }, { degree: 0, at: 2.58, hold: 4.35, glide: 48, fall: -66 }]
    ];
    const ambientXiaoPhrases = [
      [
        { degree: 3, at: 0, hold: 4.35, glide: -58, fall: -35 },
        { degree: 0, at: 4.72, hold: 5.15, glide: 45, fall: -68 }
      ],
      [
        { degree: 4, at: 0, hold: 3.95, glide: -44, fall: -32 },
        { degree: 3, at: 4.38, hold: 4.25, glide: 39, fall: -51 },
        { degree: 1, at: 8.92, hold: 4.75, glide: 33, fall: -65 }
      ],
      [
        { degree: 1, at: 0, hold: 4.15, glide: -51, fall: -39 },
        { degree: 2, at: 4.62, hold: 4.35, glide: 43, fall: -53 },
        { degree: 0, at: 9.28, hold: 5.05, glide: 34, fall: -70 }
      ]
    ];
    const endingXiaoPhrase = [
      { degree: 4, at: 0, hold: 3.85, glide: -52, fall: -38 },
      { degree: 3, at: 4.18, hold: 4.25, glide: 41, fall: -53 },
      { degree: 1, at: 8.72, hold: 4.75, glide: 36, fall: -61 },
      { degree: 0, at: 13.75, hold: 6.15, glide: 48, fall: -78 }
    ];
    const seen = new WeakSet();
    let context = null;
    let master = null;
    let musicBus = null;
    let sfxBus = null;
    let noiseBuffer = null;
    let ambientTimer = 0;
    let ambientPhraseIndex = 0;
    let audioEnabled = false;
    let soundtrackFailed = false;
    let soundtrackFadeFrame = 0;
    let endingFadeActive = false;
    const soundtrack = new Audio(SCORE_URL);
    soundtrack.preload = 'auto';
    soundtrack.loop = true;
    soundtrack.volume = 0;
    soundtrack.addEventListener('error', () => { soundtrackFailed = true; });

    const fadeSoundtrack = (target, duration = 900, pauseAtEnd = false, onComplete) => {
      window.cancelAnimationFrame(soundtrackFadeFrame);
      const from = Number.isFinite(soundtrack.volume) ? soundtrack.volume : 0;
      const started = performance.now();
      const finish = () => {
        soundtrack.volume = Math.max(0, Math.min(1, target));
        if (pauseAtEnd) soundtrack.pause();
        if (typeof onComplete === 'function') onComplete();
      };
      if (duration <= 0) {
        finish();
        return;
      }
      const tick = now => {
        const progress = Math.min(1, (now - started) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        soundtrack.volume = Math.max(0, Math.min(1, from + (target - from) * eased));
        if (progress < 1) soundtrackFadeFrame = window.requestAnimationFrame(tick);
        else finish();
      };
      soundtrackFadeFrame = window.requestAnimationFrame(tick);
    };

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

    const modeFrequency = degree => {
      const scaleIndex = ((degree % SCALE.length) + SCALE.length) % SCALE.length;
      const octave = Math.floor(degree / SCALE.length) + 1;
      return SCALE[scaleIndex] * Math.pow(2, octave);
    };

    const playXiaoNote = (frequency, when, duration, level = .038, expression = {}) => {
      if (!audioEnabled || !context || !musicBus || !noiseBuffer) return;
      const start = Math.max(context.currentTime + .006, when);
      const length = Math.max(1.15, duration);
      const end = start + length;
      const attack = Math.min(.78, Math.max(.38, length * .2));
      const release = Math.min(1.28, Math.max(.68, length * .29));
      const sustainEnd = Math.max(start + attack + .08, end - release);
      const glideEnd = start + Math.min(.62, attack + .15);
      const fallStart = Math.max(start + attack + .12, end - Math.min(.48, release * .72));
      const glideCents = Number(expression.glide) || 0;
      const fallCents = Number(expression.fall) || -28;
      const vibratoDepth = Number(expression.vibrato) || 7.5;
      const vibratoRate = Number(expression.vibratoRate) || (3.82 + Math.random() * .42);

      const carrier = context.createOscillator();
      const overtone = context.createOscillator();
      const overtoneGain = context.createGain();
      const toneFilter = context.createBiquadFilter();
      const toneGain = context.createGain();
      const breath = context.createBufferSource();
      const breathFilter = context.createBiquadFilter();
      const breathGain = context.createGain();
      const vibrato = context.createOscillator();
      const vibratoGain = context.createGain();

      const setExpressivePitch = (oscillator, target) => {
        const initial = target * Math.pow(2, glideCents / 1200);
        const final = target * Math.pow(2, fallCents / 1200);
        oscillator.frequency.setValueAtTime(initial, start);
        oscillator.frequency.exponentialRampToValueAtTime(target, glideEnd);
        oscillator.frequency.setValueAtTime(target, fallStart);
        oscillator.frequency.exponentialRampToValueAtTime(final, end);
      };

      carrier.type = 'sine';
      overtone.type = 'sine';
      setExpressivePitch(carrier, frequency);
      setExpressivePitch(overtone, frequency * 2.002);
      overtoneGain.gain.setValueAtTime(.13, start);
      overtoneGain.gain.linearRampToValueAtTime(.085, sustainEnd);

      toneFilter.type = 'lowpass';
      toneFilter.frequency.setValueAtTime(Math.min(1900, 920 + frequency * 2.25), start);
      toneFilter.frequency.linearRampToValueAtTime(Math.min(1450, 760 + frequency * 1.65), sustainEnd);
      toneFilter.Q.setValueAtTime(.82, start);

      toneGain.gain.setValueAtTime(.0001, start);
      toneGain.gain.exponentialRampToValueAtTime(Math.max(.0002, level), start + attack);
      toneGain.gain.linearRampToValueAtTime(level * .72, sustainEnd);
      toneGain.gain.exponentialRampToValueAtTime(.0001, end);

      breath.buffer = noiseBuffer;
      breath.loop = true;
      breath.playbackRate.setValueAtTime(.82 + Math.random() * .18, start);
      breathFilter.type = 'bandpass';
      breathFilter.frequency.setValueAtTime(1780 + Math.random() * 310, start);
      breathFilter.frequency.linearRampToValueAtTime(1450 + Math.random() * 240, sustainEnd);
      breathFilter.Q.setValueAtTime(.72, start);
      breathGain.gain.setValueAtTime(.0001, start);
      breathGain.gain.exponentialRampToValueAtTime(Math.max(.0002, level * .42), start + attack * .76);
      breathGain.gain.linearRampToValueAtTime(level * .24, sustainEnd);
      breathGain.gain.exponentialRampToValueAtTime(.0001, end);

      vibrato.type = 'sine';
      vibrato.frequency.setValueAtTime(vibratoRate, start);
      vibratoGain.gain.setValueAtTime(.0001, start);
      vibratoGain.gain.linearRampToValueAtTime(vibratoDepth, start + attack + .38);
      vibratoGain.gain.setValueAtTime(vibratoDepth, sustainEnd);
      vibratoGain.gain.linearRampToValueAtTime(vibratoDepth * .38, end);

      carrier.connect(toneFilter);
      overtone.connect(overtoneGain);
      overtoneGain.connect(toneFilter);
      toneFilter.connect(toneGain);
      toneGain.connect(musicBus);
      breath.connect(breathFilter);
      breathFilter.connect(breathGain);
      breathGain.connect(musicBus);
      vibrato.connect(vibratoGain);
      vibratoGain.connect(carrier.detune);
      vibratoGain.connect(overtone.detune);

      carrier.start(start);
      overtone.start(start);
      breath.start(start, Math.random() * .7);
      vibrato.start(start);
      carrier.stop(end + .035);
      overtone.stop(end + .035);
      breath.stop(end + .035);
      vibrato.stop(end + .035);
      carrier.onended = disconnectOnEnd([
        carrier, overtone, overtoneGain, toneFilter, toneGain,
        breath, breathFilter, breathGain, vibrato, vibratoGain
      ]);
    };

    const playXiaoPhrase = (phrase, when, level = .036) => {
      phrase.forEach((turn, index) => {
        playXiaoNote(
          modeFrequency(turn.degree),
          when + turn.at,
          turn.hold,
          Math.max(.024, level - index * .0025),
          {
            glide: turn.glide,
            fall: turn.fall,
            vibrato: 5.8 + index * 1.05,
            vibratoRate: 3.82 + index * .16
          }
        );
      });
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
      if (!reducedMotion) rodClick(now + .17, 720 + index * 36, .34);
    };

    const cueTransition = index => {
      if (!audioEnabled || !context) return;
      const now = context.currentTime + .025;
      if (!reducedMotion) {
        paperRustle(now, .82);
        rodClick(now + .14, 760 + index * 29, .72);
      }
    };

    const cueEnding = () => {
      if (!audioEnabled) return;
      endingFadeActive = true;
      if (context) {
        const now = context.currentTime + .03;
        if (!reducedMotion) paperRustle(now, .55);
        [110, 162, 230, 289].forEach((frequency, index) => {
          playTone(frequency, now + .14, 5.2 - index * .45, .052 / (index + 1), 'sine', musicBus);
        });
      }
      fadeSoundtrack(0, 5200, true, () => {
        if (audioEnabled) disableAudio(true);
      });
    };

    const playAmbientPhrase = () => {
      if (!audioEnabled || !context || document.hidden) return;
      const now = context.currentTime + .04;
      const phrase = ambientXiaoPhrases[ambientPhraseIndex % ambientXiaoPhrases.length];
      const supportNote = [0, 0, 1][ambientPhraseIndex % 3];
      ambientPhraseIndex += 1;
      playPluck(SCALE[supportNote] / 2, now + .12, .019);
      playTone(73.42, now + .3, 7.4, .011, 'sine', musicBus);
      playXiaoPhrase(phrase, now + .36, .032);
    };

    const startDrone = () => {
      if (!context || !musicBus) return;
      [73.42, 110].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const now = context.currentTime;
        oscillator.type = index ? 'sine' : 'triangle';
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(.0001, now);
        gain.gain.exponentialRampToValueAtTime(index ? .014 : .017, now + 1.8 + index * .35);
        oscillator.connect(gain);
        gain.connect(musicBus);
        oscillator.start(now);
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

      const impulseLength = Math.floor(context.sampleRate * 1.8);
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

    const startFallbackScore = () => {
      if (!context || ambientTimer) return;
      startDrone();
      playAmbientPhrase();
      ambientTimer = window.setInterval(playAmbientPhrase, 23000);
    };

    const startOriginalScore = () => {
      if (soundtrackFailed) {
        startFallbackScore();
        return;
      }
      soundtrack.volume = 0;
      const playback = soundtrack.play();
      if (playback && typeof playback.then === 'function') {
        playback.then(() => fadeSoundtrack(.34, 1800)).catch(() => {
          soundtrackFailed = true;
          startFallbackScore();
        });
      } else {
        fadeSoundtrack(.34, 1800);
      }
    };

    const enableAudio = () => {
      if (audioEnabled) return;
      try {
        if (AudioCtor) {
          context = new AudioCtor();
          buildAudioGraph();
          context.resume().catch(() => {});
        }
        ambientPhraseIndex = 0;
        endingFadeActive = false;
        audioEnabled = true;
        updateControls();
        startOriginalScore();
        const opening = $('[data-tt-opening]');
        if (opening && !opening.classList.contains('is-gone')) cueOpening(Math.max(0, Number(opening.dataset.scene || 1) - 1));
      } catch (_) {
        audioEnabled = false;
        soundtrack.pause();
        updateControls();
      }
    };

    const disableAudio = (immediate = false) => {
      if (!audioEnabled) return;
      audioEnabled = false;
      endingFadeActive = false;
      window.clearInterval(ambientTimer);
      ambientTimer = 0;
      fadeSoundtrack(0, immediate ? 0 : 650, true);
      updateControls();
      const oldContext = context;
      const oldMaster = master;
      context = null;
      master = null;
      musicBus = null;
      sfxBus = null;
      noiseBuffer = null;
      if (!oldContext || !oldMaster) return;
      try {
        const now = oldContext.currentTime;
        oldMaster.gain.cancelScheduledValues(now);
        oldMaster.gain.setValueAtTime(Math.max(.0001, oldMaster.gain.value), now);
        oldMaster.gain.exponentialRampToValueAtTime(.0001, now + .25);
      } catch (_) { /* context may already be interrupted */ }
      window.setTimeout(() => oldContext.close().catch(() => {}), 290);
    };

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
      if (!audioEnabled) return;
      if (document.hidden) {
        if (context) context.suspend().catch(() => {});
        soundtrack.pause();
        return;
      }
      if (context) context.resume().catch(() => {});
      if (!soundtrackFailed && !endingFadeActive) {
        const playback = soundtrack.play();
        if (playback && typeof playback.then === 'function') playback.then(() => fadeSoundtrack(.34, 650)).catch(() => {});
      }
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
    initPoseTheatre();
    initSoundscape();
    initOpening();
    initDocumentaryMotion();
    initReveals();
  });
})();
