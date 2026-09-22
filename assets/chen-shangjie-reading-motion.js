(() => {
  const ready = () => {
    if (!window.gsap || !window.ScrollTrigger) return;
    const root = document.querySelector('.chen-case-page');
    if (!root || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(root.querySelectorAll('.chen-case-hero .art-eyebrow,.chen-case-hero .case-profile-kicker,.chen-case-hero h1,.chen-case-hero p,.chen-case-hero .case-status-row,.chen-case-hero .case-profile-actions'), {
      autoAlpha: 0, y: 24, duration: .68, ease: 'power2.out', stagger: .075, clearProps: 'transform,opacity,visibility'
    });
    const poster = root.querySelector('.case-profile-poster');
    if (poster) gsap.from(poster, {autoAlpha:0, scale:.96, y:16, duration:.85, ease:'power2.out', delay:.12, clearProps:'transform,opacity,visibility'});
    const intro = root.querySelector('.case-opening-section');
    if (intro) gsap.from(intro.children, {autoAlpha:0, y:18, duration:.58, stagger:.07, ease:'power2.out', scrollTrigger:{trigger:intro,start:'top 82%',once:true},clearProps:'transform,opacity,visibility'});
    root.querySelectorAll('.case-story-section:not(.case-opening-section)').forEach(section => {
      const heading = section.querySelector(':scope > h2');
      if (heading) gsap.from(heading, {autoAlpha:0, x:-14, duration:.48, ease:'power2.out', scrollTrigger:{trigger:section,start:'top 86%',once:true},clearProps:'transform,opacity,visibility'});
    });
    root.querySelectorAll('.case-visit-list,.case-duty-grid,.case-negligence-list,.case-timeline-list,.case-judgment-grid,.case-progress-box').forEach(group => {
      const items = group.children;
      if (!items.length) return;
      gsap.from(items, {autoAlpha:0, y:16, duration:.46, stagger:.075, ease:'power2.out', scrollTrigger:{trigger:group,start:'top 88%',once:true},clearProps:'transform,opacity,visibility'});
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, {once:true}); else ready();
})();