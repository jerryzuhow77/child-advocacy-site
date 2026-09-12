(() => {
  'use strict';

  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  function setupSeasonalArtwork() {
    const sections = [...document.querySelectorAll('section[data-seasonal-art]')];
    if (!sections.length) return;

    const reveal = (section) => {
      if (!section || section.classList.contains('is-seasonal-art-ready')) return;
      section.classList.add('is-seasonal-art-ready');
      section.dataset.seasonalArtLoaded = 'true';
    };

    reveal(sections.find((section) => section.dataset.seasonalArt === '01'));

    const revealHashTarget = () => {
      if (!location.hash) return;
      let target;
      try { target = document.querySelector(location.hash); } catch (_) { return; }
      reveal(target?.matches?.('[data-seasonal-art]') ? target : target?.closest?.('[data-seasonal-art]'));
    };
    revealHashTarget();
    window.addEventListener('hashchange', revealHashTarget, { passive: true });

    const pending = sections.filter((section) => !section.classList.contains('is-seasonal-art-ready'));
    if (!('IntersectionObserver' in window)) {
      pending.forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '1000px 0px', threshold: 0 });
    pending.forEach((section) => observer.observe(section));

    // A long homepage can jump across several sections in one scrollbar move.
    // Keep a geometry-based fallback in addition to IntersectionObserver so a
    // skipped observer delivery can never leave a visited section on an old
    // background. Readiness remains monotonic: classes are only ever added.
    let revealFrame = 0;
    const revealNearViewport = () => {
      revealFrame = 0;
      const margin = Math.max(1000, window.innerHeight);
      sections.forEach((section) => {
        if (section.classList.contains('is-seasonal-art-ready')) return;
        const rect = section.getBoundingClientRect();
        // Treat every section above the current viewport as visited too. Large
        // scrollbar jumps can skip an IntersectionObserver delivery entirely;
        // once the visitor has moved past a section its artwork must stay ready.
        if (rect.top <= window.innerHeight + margin) {
          reveal(section);
          observer.unobserve(section);
        }
      });
    };
    const scheduleReveal = () => {
      if (revealFrame) return;
      revealFrame = requestAnimationFrame(revealNearViewport);
    };
    window.addEventListener('scroll', scheduleReveal, { passive: true });
    window.addEventListener('resize', scheduleReveal, { passive: true });
    window.addEventListener('pageshow', scheduleReveal, { passive: true });
    revealNearViewport();
  }

  function setupMediaRail() {
    const section = document.getElementById('home-media-reports');
    const viewport = section?.querySelector('.home-media-report-viewport');
    const track = viewport?.querySelector('.home-media-report-track');
    const controls = section?.querySelector('.home-media-report-controls');
    const cards = track ? [...track.querySelectorAll('.home-media-report-card')] : [];
    const buttons = controls ? [...controls.querySelectorAll('button')] : [];
    if (!viewport || !track || !controls || !cards.length || buttons.length < 2) return;

    if (!viewport.id) viewport.id = 'homeMediaReportViewport';
    buttons.forEach((button) => button.setAttribute('aria-controls', viewport.id));

    let progress = controls.querySelector('.home-media-report-progress');
    if (!progress) {
      progress = document.createElement('span');
      progress.className = 'home-media-report-progress';
      progress.setAttribute('role', 'status');
      progress.setAttribute('aria-live', 'polite');
      progress.innerHTML = '<span aria-hidden="true"><i></i></span><small><b>1</b> / <span></span></small>';
      controls.insertBefore(progress, buttons[1]);
    }

    const current = progress.querySelector('b');
    const total = progress.querySelector('small span');
    total.textContent = String(cards.length);

    const nearestIndex = () => {
      const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      if (viewport.scrollLeft <= 2) return 0;
      if (viewport.scrollLeft >= max - 2) return cards.length - 1;
      const viewportLeft = viewport.getBoundingClientRect().left;
      let best = 0;
      let distance = Number.POSITIVE_INFINITY;
      cards.forEach((card, index) => {
        const nextDistance = Math.abs(card.getBoundingClientRect().left - viewportLeft);
        if (nextDistance < distance) {
          distance = nextDistance;
          best = index;
        }
      });
      return best;
    };

    const update = () => {
      const index = nearestIndex();
      current.textContent = String(index + 1);
      progress.style.setProperty('--media-progress', String((index + 1) / cards.length));
      const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      // Scroll snapping can settle a fraction short of the mathematical edge
      // on narrow screens.  The selected end card is the authoritative state.
      buttons[0].disabled = index === 0 || viewport.scrollLeft <= 2;
      buttons[1].disabled = index === cards.length - 1 || viewport.scrollLeft >= max - 2;
      cards.forEach((card, cardIndex) => card.toggleAttribute('data-current-news', cardIndex === index));
    };

    const show = (index) => {
      const targetIndex = Math.max(0, Math.min(cards.length - 1, index));
      const viewportLeft = viewport.getBoundingClientRect().left;
      const targetLeft = viewport.scrollLeft + cards[targetIndex].getBoundingClientRect().left - viewportLeft;
      viewport.scrollTo({ left: targetLeft, behavior: reduceMotion ? 'auto' : 'smooth' });
      window.setTimeout(update, reduceMotion ? 0 : 520);
    };

    if (controls.dataset.mediaRailBound !== 'true') {
      controls.dataset.mediaRailBound = 'true';
      buttons[0].addEventListener('click', () => show(nearestIndex() - 1));
      buttons[1].addEventListener('click', () => show(nearestIndex() + 1));
      viewport.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        show(nearestIndex() + (event.key === 'ArrowRight' ? 1 : -1));
      });
    }

    let frame = 0;
    let settleTimer = 0;
    viewport.addEventListener('scroll', () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(update, 180);
    }, { passive: true });
    viewport.addEventListener('scrollend', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  function setupMobileFerrisRail() {
    const shell = document.querySelector('#news-flash [data-document-disc]');
    const orbit = shell?.querySelector('.home-document-disc-orbit');
    const previous = shell?.querySelector('[data-disc-prev]');
    const next = shell?.querySelector('[data-disc-next]');
    if (!shell || !orbit || !previous || !next || shell.dataset.mobileRailBound === 'true') return;
    shell.dataset.mobileRailBound = 'true';

    const move = (direction) => {
      if (!window.matchMedia('(max-width:760px)').matches) return;
      const card = orbit.querySelector('.home-document-disc-card');
      if (!card) return;
      const gap = Number.parseFloat(getComputedStyle(orbit).gap) || 12;
      orbit.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
  }

  function normalizeDeferredThumbnails() {
    document.querySelectorAll('#news-flash .home-pinned-report-card img').forEach((image) => {
      image.loading = 'lazy';
      image.removeAttribute('fetchpriority');
      image.decoding = 'async';
    });
  }

  function init() {
    setupSeasonalArtwork();
    setupMediaRail();
    setupMobileFerrisRail();
    normalizeDeferredThumbnails();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
