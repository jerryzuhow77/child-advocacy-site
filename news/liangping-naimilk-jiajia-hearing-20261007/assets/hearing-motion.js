(() => {
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const revealSelector = [
    '.hero-image','.hero-copy','.hero-copy > *','.hero-facts','.hero-facts > *',
    '.content > section','.content > .note','.info-grid .card','.detail-grid article',
    '.case-timeline li','.timeline li','.reminder'
  ].join(',');

  function revealStatic() {
    document.documentElement.classList.add('motion-reduced');
    document.querySelectorAll(revealSelector).forEach((el) => {
      el.style.removeProperty('opacity');
      el.style.removeProperty('visibility');
      el.style.removeProperty('transform');
      el.style.removeProperty('filter');
    });
  }

  function initMotion() {
    if (motionQuery.matches || !window.gsap || !window.ScrollTrigger) {
      revealStatic();
      return;
    }

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ force3D: true, nullTargetWarn: false });
    ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });
    document.documentElement.classList.add('motion-ready');

    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image');
    const heroCopy = document.querySelector('.hero-copy');
    const heroFacts = document.querySelector('.hero-facts');

    if (hero && heroImage && heroCopy) {
      gsap.set(heroImage, { transformOrigin: '62% 48%' });
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro
        .fromTo(heroImage,
          { scale: 1.16, yPercent: -2, filter: 'blur(7px) saturate(.76) brightness(.90)' },
          { scale: 1.045, yPercent: 0, filter: 'blur(0px) saturate(1) brightness(1)', duration: 1.65, ease: 'power2.out' })
        .from(heroCopy, { y: 24, z: 56, rotateX: 2.2, scale: .985, duration: .95 }, .08)
        .from('.hero-copy .kicker', { autoAlpha: 0, y: 14, z: 36, duration: .46 }, .18)
        .from('.hero-copy h1', { autoAlpha: 0, y: 40, z: 82, duration: .82 }, .25)
        .from('.hero-copy > p', { autoAlpha: 0, y: 22, z: 52, duration: .62 }, .43)
        .from('.hero-copy .tag', { autoAlpha: 0, y: 12, scale: .90, duration: .44 }, .56);

      if (heroFacts) {
        intro
          .from(heroFacts, { autoAlpha: 0, y: 20, z: 42, scale: .975, duration: .58 }, .64)
          .from(heroFacts.children, { autoAlpha: 0, y: 12, stagger: .10, duration: .38, ease: 'power2.out' }, .76);
      }

      const mm = gsap.matchMedia();
      mm.add('(min-width: 721px)', () => {
        gsap.to(heroImage, {
          yPercent: 10, scale: 1.095, ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .75 }
        });
        gsap.to(heroCopy, {
          yPercent: -5, z: 30, ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .9 }
        });
      });
      mm.add('(max-width: 720px)', () => {
        gsap.to(heroImage, {
          yPercent: 5, scale: 1.065, ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .8 }
        });
      });
    }

    const infoGrid = document.querySelector('.info-grid');
    const infoCards = gsap.utils.toArray('.info-grid .card');
    if (infoGrid && infoCards.length) {
      gsap.from(infoCards, {
        autoAlpha: 0, y: 34, z: 34, scale: .955, rotateX: 5, stagger: .12,
        duration: .72, ease: 'power3.out', clearProps: 'transform,opacity,visibility',
        scrollTrigger: { trigger: infoGrid, start: 'top 86%', once: true }
      });
    }

    const detailGrid = document.querySelector('.detail-grid');
    const detailCards = gsap.utils.toArray('.detail-grid article');
    if (detailGrid && detailCards.length) {
      gsap.from(detailCards, {
        autoAlpha: 0, y: 30, z: 24, scale: .97, stagger: .10,
        duration: .68, ease: 'power2.out', clearProps: 'transform,opacity,visibility',
        scrollTrigger: { trigger: detailGrid, start: 'top 87%', once: true }
      });
    }

    gsap.utils.toArray('.content > section').forEach((section) => {
      if (section.classList.contains('info-grid')) return;
      gsap.from(section, {
        autoAlpha: 0, y: 28, duration: .72, ease: 'power2.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: { trigger: section, start: 'top 90%', once: true }
      });
    });

    gsap.utils.toArray('.case-timeline li').forEach((row, index) => {
      gsap.from(row, {
        autoAlpha: 0, x: index % 2 ? 18 : -18, y: 10, duration: .62, ease: 'power2.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: { trigger: row, start: 'top 90%', once: true }
      });
    });

    gsap.utils.toArray('.timeline li').forEach((row, index) => {
      gsap.from(row, {
        autoAlpha: 0, y: 24, x: index % 2 ? 10 : -10, duration: .58, ease: 'power2.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: { trigger: row, start: 'top 91%', once: true }
      });
    });

    gsap.utils.toArray('.content > .note').forEach((note) => {
      gsap.from(note, {
        autoAlpha: 0, y: 14, duration: .5, ease: 'power2.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: { trigger: note, start: 'top 94%', once: true }
      });
    });

    motionQuery.addEventListener?.('change', (event) => {
      if (!event.matches) return;
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.globalTimeline.clear();
      revealStatic();
    });

    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMotion, { once: true });
  else initMotion();
})();(()=>{if(document.documentElement.lang.toLowerCase().includes("hans"))document.documentElement.style.setProperty("--notice-art","url(../../../assets/art/jiajia-hearing-reminder-20261006-zh-Hans.jpg)")})();
