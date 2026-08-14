(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  }

  document.addEventListener('DOMContentLoaded', () => {
    initOpening();
    initDocumentaryMotion();
    initReveals();
  });
})();
