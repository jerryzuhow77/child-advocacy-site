(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sections = [...document.querySelectorAll('.story > section')];

  // Give the opening, evidence-led sentence of each section a consistent
  // editorial highlighter treatment without changing its meaning.
  sections.forEach((section) => {
    const paragraph = section.querySelector(':scope > p');
    const node = paragraph && [...paragraph.childNodes].find((child) => child.nodeType === Node.TEXT_NODE && child.nodeValue.trim());
    if (!node || node.parentElement.closest('.reading-emphasis')) return;

    const text = node.nodeValue;
    const stop = text.search(/[。！？.!?]/);
    if (stop < 0) return;

    const lead = text.slice(0, stop + 1);
    const rest = text.slice(stop + 1);
    const highlight = document.createElement('span');
    highlight.className = 'reading-emphasis';
    highlight.textContent = lead;
    node.replaceWith(highlight, document.createTextNode(rest));
  });

  if (reduceMotion || !window.gsap) return;

  const animate = (section) => {
    if (section.dataset.motionDone) return;
    section.dataset.motionDone = 'true';
    window.gsap.fromTo(
      section,
      { autoAlpha: 0, y: 14 },
      { autoAlpha: 1, y: 0, duration: 0.54, ease: 'power2.out', clearProps: 'opacity,visibility,transform' }
    );
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animate(entry.target);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  sections.forEach((section) => observer.observe(section));
})();
