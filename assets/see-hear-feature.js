(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = [...document.querySelectorAll('.reveal')];

  document.querySelectorAll('.sh-lang a[data-site-lang]').forEach(link => {
    link.addEventListener('click', event => {
      const lang = link.dataset.siteLang;
      try { localStorage.setItem('siteLang', lang); } catch (_) {}
      if ((lang === 'zh-Hant' || lang === 'zh-Hans') &&
          typeof window.setLang === 'function' &&
          new URL(link.href, window.location.href).pathname === window.location.pathname) {
        event.preventDefault();
        window.setLang(lang);
      }
    });
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const siblings = [...entry.target.parentElement.querySelectorAll(':scope > .reveal')];
        const order = Math.max(0, siblings.indexOf(entry.target));
        entry.target.style.transitionDelay = `${Math.min(order * 90, 270)}ms`;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    revealItems.forEach(item => revealObserver.observe(item));
  }

  const navLinks = [...document.querySelectorAll('.sh-nav a[href^="#"]')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.toggleAttribute('aria-current', active);
        });
      });
    }, { threshold: 0, rootMargin: '-32% 0px -58% 0px' });
    sections.forEach(section => sectionObserver.observe(section));
  }

  if (!reduceMotion) {
    const heroArt = document.querySelector('.sh-hero-art');
    const child = document.querySelector('.sh-child-silhouette');
    let ticking = false;
    const paintParallax = () => {
      const distance = Math.min(window.scrollY, window.innerHeight);
      if (heroArt) heroArt.style.setProperty('--sh-scroll-shift', `${distance * 0.035}px`);
      if (child) child.style.marginTop = `${distance * 0.025}px`;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(paintParallax);
    }, { passive: true });
  }
})();
