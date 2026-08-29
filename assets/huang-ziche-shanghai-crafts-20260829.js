(() => {
  'use strict';
  const page = document.querySelector('.hz-page');
  if (!page) return;

  const ids = ['before','taken','unseen','abuse','last-day','hospital','verdict','father','protection'];
  const rail = document.querySelector('.hz-lantern-rail');
  const links = rail ? [...rail.querySelectorAll('.hz-rail-link')] : [];
  const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = matchMedia('(max-width: 900px)').matches;

  const setRail = () => {
    const marker = innerHeight * .36;
    let current = 0;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= marker) current = index;
    });
    links.forEach((link,index) => {
      link.classList.toggle('is-current', index === current);
      link.classList.toggle('is-read', index < current);
      if (index === current) link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
  };
  setRail();
  addEventListener('scroll', setRail, {passive:true});
  addEventListener('resize', setRail, {passive:true});

  links.forEach(link => link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block:'start'});
  }));

  const topButton = document.querySelector('.hz-back-top');
  const setTop = () => topButton?.classList.toggle('is-visible', scrollY > innerHeight * .7);
  setTop();
  addEventListener('scroll', setTop, {passive:true});
  topButton?.addEventListener('click', () => scrollTo({top:0,behavior:reduce?'auto':'smooth'}));

  const ending = document.querySelector('.tt-ending');
  if (!ending) return;
  const words = [...ending.querySelectorAll('.hz-lantern-words span')];
  const paths = [...ending.querySelectorAll('.hz-gu-embroidery path')];
  const curtains = [...ending.querySelectorAll('.hz-ending-curtain i')];
  const finalCopy = ending.querySelector('.hz-ending-final');
  let played = false;

  const finish = () => {
    ending.classList.add('is-haipai-playing','is-haipai-complete');
    words.forEach(el => {el.style.opacity='1';el.style.transform='none';});
    paths.forEach(el => {el.style.strokeDashoffset='0';});
    curtains.forEach(el => {el.style.transform='scaleX(1)';});
    if (finalCopy) finalCopy.style.opacity='1';
  };

  const play = () => {
    if (played) return;
    played = true;
    if (reduce || !window.gsap) { finish(); return; }
    ending.classList.add('is-haipai-playing');
    const lantern = ending.querySelector('.hz-carousel-lantern');
    const door = ending.querySelector('.hz-jade-door');
    const water = ending.querySelector('.hz-wool-water');
    const puppets = ending.querySelectorAll('.tt-ending-theatre-puppet');
    const scriptLines = ending.querySelectorAll('.tt-ending-theatre-script p');
    const timeline = gsap.timeline({defaults:{ease:'power2.out'},onComplete:()=>ending.classList.add('is-haipai-complete')});
    timeline
      .fromTo(water,{opacity:.18,yPercent:22},{opacity:.72,yPercent:0,duration:2.2})
      .fromTo(lantern,{opacity:0,scale:.42,rotation:-7},{opacity:1,scale:mobile ? .68:.9,rotation:0,duration:2.1},.4)
      .to(lantern,{rotation:360,duration:mobile?5:8,ease:'none'},1.3)
      .fromTo(door,{opacity:.12,filter:'brightness(.5)'},{opacity:.92,filter:'brightness(1.16)',duration:3},1.2)
      .to(words,{opacity:1,y:0,stagger:mobile ? .65:.9,duration:.8},2.2)
      .fromTo(scriptLines,{opacity:0,y:10},{opacity:1,y:0,stagger:1.15,duration:.65},3.2)
      .to(paths,{strokeDashoffset:0,stagger:.28,duration:3.2,ease:'none'},5)
      .to(puppets,{x:index=>index===0?-55:55,opacity:.34,duration:1.8},mobile?8.4:11.4)
      .to(curtains,{scaleX:1,duration:2.2,ease:'power1.inOut'},mobile?9.4:13.2)
      .to(finalCopy,{opacity:1,y:0,duration:1.4},mobile?10.7:15.2);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        play();
        observer.disconnect();
      }
    }, {threshold:mobile ? .18:.32});
    observer.observe(ending);
  } else play();

  ending.querySelector('[data-hz-ending-skip]')?.addEventListener('click', () => {
    if (window.gsap) gsap.globalTimeline.clear();
    played = true;
    finish();
    finalCopy?.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});
  });
})();