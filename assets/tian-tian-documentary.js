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
    };
    const close = () => {
      stop();
      opening.classList.add('is-gone');
      opening.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('tt-opening-active');
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
    initOpening();
    initDocumentaryMotion();
    initReveals();
  });
})();
