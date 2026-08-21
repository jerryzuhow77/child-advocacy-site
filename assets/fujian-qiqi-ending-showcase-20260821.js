/* Fujian Putian Qiqi epilogue panorama showcase · 2026-08-21 */
(() => {
  'use strict';

  const run = () => {
    const ending = document.querySelector('.fq-ending');
    if (!ending || ending.dataset.fqPanoramaShowcaseReady === 'true') return;

    ending.dataset.fqPanoramaShowcaseReady = 'true';
    /* Prevent the legacy ending enhancer and the generic reveal system from
       competing with this purpose-built timeline. */
    ending.dataset.fqEndingRepairReady = 'true';
    ending.removeAttribute('data-fq-reveal');
    ending.classList.add('fq-ending--panorama-showcase', 'is-visible');

    const oldPanorama = ending.querySelector(':scope > .fq-ending__panorama');
    if (oldPanorama) oldPanorama.hidden = true;

    const showcase = document.createElement('div');
    showcase.className = 'fq-ending-showcase';
    showcase.setAttribute('aria-hidden', 'true');
    showcase.innerHTML = [
      '<div class="fq-ending-showcase__wide"></div>',
      '<div class="fq-ending-showcase__detail"></div>',
      '<div class="fq-ending-showcase__veil"></div>',
      '<div class="fq-ending-showcase__light"></div>',
      '<div class="fq-ending-showcase__grain"></div>'
    ].join('');
    ending.prepend(showcase);

    const html = document.documentElement;
    const wide = showcase.querySelector('.fq-ending-showcase__wide');
    const detail = showcase.querySelector('.fq-ending-showcase__detail');
    const veil = showcase.querySelector('.fq-ending-showcase__veil');
    const light = showcase.querySelector('.fq-ending-showcase__light');
    const pieces = [
      ending.querySelector('.fq-shell > small'),
      ending.querySelector('.fq-shell > h2'),
      ending.querySelector('.fq-shell > p'),
      ending.querySelector('.fq-ending__seal'),
      ending.querySelector('.fq-ending__actions')
    ].filter(Boolean);

    const motionMode = html.dataset.fqMotion || (() => {
      try { return localStorage.getItem('fq-motion-mode') || 'full'; } catch (_error) { return 'full'; }
    })();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const compact = matchMedia('(max-width: 780px)').matches;
    const saveData = Boolean(navigator.connection && navigator.connection.saveData);
    const gsap = window.gsap && typeof window.gsap.timeline === 'function' ? window.gsap : null;
    const lite = motionMode === 'lite';
    const off = motionMode === 'off';

    let timeline = null;
    let glowTween = null;
    let observer = null;
    let played = false;

    const showStatic = () => {
      ending.classList.remove('is-showcase-animating');
      ending.classList.add('is-showcase-complete');
      if (!gsap) return;
      gsap.set(wide, { autoAlpha: 1, clearProps: 'transform' });
      gsap.set(detail, { autoAlpha: 0, clearProps: 'transform' });
      gsap.set(veil, { autoAlpha: compact ? .82 : .68 });
      gsap.set(light, { autoAlpha: 0 });
      gsap.set(pieces, { autoAlpha: 1, clearProps: 'transform,filter' });
    };

    const finish = () => {
      ending.classList.remove('is-showcase-animating');
      ending.classList.add('is-showcase-complete');
      if (gsap) {
        gsap.set(pieces, { clearProps: 'filter' });
      }
    };

    const play = () => {
      if (played) return;
      played = true;

      if (!gsap || reduced || off || saveData) {
        showStatic();
        return;
      }

      ending.classList.add('is-showcase-animating');
      ending.classList.remove('is-showcase-complete');
      gsap.killTweensOf([wide, detail, veil, light, ...pieces]);

      if (lite) {
        timeline = gsap.timeline({ onComplete: finish });
        timeline
          .fromTo(wide, { autoAlpha: 0, scale: .975 }, { autoAlpha: 1, scale: 1, duration: .8, ease: 'power2.out' }, 0)
          .to(veil, { autoAlpha: compact ? .82 : .68, duration: .55 }, .28)
          .fromTo(pieces, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .62, stagger: .1, ease: 'power2.out' }, .42);
        return;
      }

      timeline = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: finish
      });

      /* First hold the full painting long enough to be read as one panorama. */
      timeline.fromTo(
        wide,
        { autoAlpha: 0, scale: compact ? .93 : .96, filter: 'blur(3px)' },
        { autoAlpha: 1, scale: 1.015, filter: 'blur(0px)', duration: compact ? 2.35 : 2.65, ease: 'power2.out' },
        0
      );

      /* Then move closer to the child, village road and lantern without a hard cut. */
      timeline.fromTo(
        detail,
        { autoAlpha: 0, scale: compact ? 1.18 : 1.12, xPercent: compact ? 2.2 : .7, yPercent: compact ? -1.2 : 0 },
        { autoAlpha: 1, scale: compact ? 1.05 : 1.025, xPercent: 0, yPercent: 0, duration: 1.75, ease: 'power2.inOut' },
        compact ? 2.05 : 2.25
      );
      timeline.to(wide, { autoAlpha: 0, scale: 1.045, duration: 1.25, ease: 'power1.inOut' }, compact ? 2.25 : 2.45);
      timeline.to(detail, { scale: 1, duration: compact ? 5.4 : 6.2, ease: 'none' }, compact ? 3.2 : 3.45);
      timeline.to(veil, { autoAlpha: compact ? .94 : .88, duration: 1.25, ease: 'power2.out' }, compact ? 2.72 : 2.92);
      timeline.to(light, { autoAlpha: compact ? .82 : .72, duration: 1.05 }, compact ? 3.0 : 3.2);

      timeline.fromTo(
        pieces,
        { autoAlpha: 0, y: compact ? 22 : 27, filter: 'blur(3px)' },
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: .82, stagger: .17, ease: 'power2.out' },
        compact ? 3.15 : 3.4
      );

      const seal = ending.querySelector('.fq-ending__seal');
      if (seal) {
        timeline.fromTo(
          seal,
          { scale: .74, rotation: -14 },
          { scale: 1, rotation: -5, duration: .86, ease: 'back.out(1.65)' },
          compact ? 4.18 : 4.42
        );
      }

      glowTween = gsap.to(light, {
        autoAlpha: compact ? .62 : .56,
        duration: 2.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        paused: true
      });
      timeline.call(() => glowTween && glowTween.play(), null, compact ? 4.25 : 4.5);
    };

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const focused = entry.isIntersecting && entry.intersectionRatio >= .1;
          html.classList.toggle('fq-ending-focus', focused);
          if (focused) {
            play();
            if (glowTween && !document.hidden) glowTween.resume();
          } else if (glowTween) {
            glowTween.pause();
          }
        });
      }, { threshold: [0, .1, .28, .5], rootMargin: '0px 0px -5% 0px' });
      observer.observe(ending);
    } else {
      play();
    }

    const onVisibility = () => {
      if (!glowTween) return;
      if (document.hidden) glowTween.pause();
      else {
        const rect = ending.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < innerHeight) glowTween.resume();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    window.addEventListener('pagehide', () => {
      if (observer) observer.disconnect();
      if (timeline) timeline.kill();
      if (glowTween) glowTween.kill();
      document.removeEventListener('visibilitychange', onVisibility);
      html.classList.remove('fq-ending-focus');
    }, { once: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
