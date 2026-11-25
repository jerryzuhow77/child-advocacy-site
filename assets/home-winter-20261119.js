(() => {
  const TEXT = {
    zhHant: {
      latest: '最新',
      hearings: '庭期',
      cases: '案件',
      features: '專題',
      join: '參與',
      news: '新聞',
      more: '更多內容',
      title: '最新發布 25 篇',
      note: '首先呈現 4 篇精選；可在本專區展開瀏覽完整 25 篇。',
      all: '查看全部文章',
      expandLatest: '展開全部 25 篇',
      collapseLatest: '收合文章',
      hearingCta: '查看最新庭期',
      hearingAll: '查看完整庭期表',
      heroCaption: '剴剴守護意象｜冬日水墨紙雕',
      heroAlt: '剴剴守護意象：冬日水墨紙雕中穿藍色條紋上衣的孩子背影，非真實肖像或事件現場'
    },
    zhHans: {
      latest: '最新',
      hearings: '庭期',
      cases: '案件',
      features: '专题',
      join: '参与',
      news: '新闻',
      more: '更多内容',
      title: '最新发布 25 篇',
      note: '首先呈现 4 篇精选；可在本专区展开浏览完整 25 篇。',
      all: '查看全部文章',
      expandLatest: '展开全部 25 篇',
      collapseLatest: '收起文章',
      hearingCta: '查看最新庭期',
      hearingAll: '查看完整庭期表',
      heroCaption: '剴剴守护意象｜冬日水墨纸雕',
      heroAlt: '剴剴守护意象：冬日水墨纸雕中穿蓝色条纹上衣的孩子背影，非真实肖像或事件现场'
    }
  };

  const organizeLatest = (latest, grid) => {
    const cards = [...grid.querySelectorAll(':scope > .home-latest-25-card')];
    if (cards.length <= 5) return { count: cards.length, moreGrid: null };

    const moreGrid = document.createElement('div');
    moreGrid.id = 'home-latest-more-20261119';
    moreGrid.className = 'home-latest-more-grid';
    moreGrid.hidden = true;
    cards.slice(5).forEach(card => moreGrid.append(card));
    grid.insertAdjacentElement('afterend', moreGrid);
    latest.dataset.articleCount = String(cards.length);
    return { count: cards.length, moreGrid };
  };

  const simplifyNav = (nav, labels, hrefs) => {
    if (!nav) return [];
    const links = [...nav.querySelectorAll(':scope > a')];
    links.slice(0, 5).forEach((link, index) => {
      const span = link.querySelector('span') || link;
      span.textContent = labels[index];
      span.dataset.hans = TEXT.zhHans[['latest', 'hearings', 'cases', 'features', 'join'][index]];
      link.href = hrefs[index];
      link.dataset.hansHref = hrefs[index];
    });
    return links;
  };

  const mountSnow = hero => {
    const stage = hero?.querySelector('.ink-hero-stage');
    if (!stage || stage.querySelector('.winter-snow-layer')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const layer = document.createElement('div');
    layer.className = 'winter-snow-layer';
    layer.setAttribute('aria-hidden', 'true');
    const flakeCount = window.innerWidth <= 760 ? 18 : 30;
    const flakes = Array.from({ length: flakeCount }, (_, index) => {
      const flake = document.createElement('i');
      flake.className = 'winter-flake';
      flake.style.setProperty('--snow-left', `${(index * 37) % 100}%`);
      flake.style.setProperty('--snow-duration', `${7 + (index % 8)}s`);
      flake.style.setProperty('--snow-delay', `${-(index % 11)}s`);
      flake.style.setProperty('--snow-drift', `${-34 + (index * 19) % 68}px`);
      layer.append(flake);
      return flake;
    });
    stage.append(layer);

    const startSnowAnimation = () => {
      const { gsap } = window;
      if (!gsap) {
        layer.dataset.animationEngine = 'css';
        layer.classList.add('winter-snow-fallback');
        return;
      }

      layer.dataset.animationEngine = 'gsap';

      const random = (min, max) => min + Math.random() * (max - min);
      const fall = (flake, firstRun = false) => {
        if (!flake.isConnected) return;
        const width = Math.max(stage.clientWidth, 280);
        const height = Math.max(stage.clientHeight, 220);
        const startY = firstRun ? random(-20, height * .9) : random(-height * .35, -18);
        const endY = height + 28;
        const speed = random(27, 43);
        gsap.set(flake, {
          x: random(10, width - 10),
          y: startY,
          rotation: random(0, 180),
          scale: random(.75, 1.5),
          opacity: random(.35, .78)
        });
        gsap.to(flake, {
          x: `+=${random(-54, 54)}`,
          y: endY,
          rotation: `+=${random(100, 300)}`,
          duration: Math.max(5.5, (endY - startY) / speed),
          ease: 'none',
          onComplete: () => fall(flake)
        });
      };
      flakes.forEach(flake => fall(flake, true));
    };

    if (document.readyState === 'complete') startSnowAnimation();
    else window.addEventListener('load', startSnowAnimation, { once: true });
  };

  const mountPaperCraft = hero => {
    const stage = hero?.querySelector('.ink-hero-stage');
    const copy = hero?.querySelector('.cinema-copy');
    if (!stage || !copy || stage.querySelector('.winter-paper-craft')) return;

    const craft = document.createElement('div');
    craft.className = 'winter-paper-craft';
    craft.setAttribute('aria-hidden', 'true');
    const ridge = document.createElement('span');
    ridge.className = 'winter-paper-ridge';
    const lantern = document.createElement('span');
    lantern.className = 'winter-paper-lantern';
    craft.append(ridge, lantern);
    stage.append(craft);

    const magnolia = document.createElement('img');
    magnolia.className = 'winter-ronghua-magnolia';
    magnolia.src = './assets/art/tian-tian-ronghua-refined-snow-magnolia-20260818.webp';
    magnolia.alt = '';
    magnolia.width = 1200;
    magnolia.height = 800;
    magnolia.decoding = 'async';
    magnolia.setAttribute('aria-hidden', 'true');
    copy.append(magnolia);
  };

  const mountPageWinter = main => {
    if (!main || document.querySelector('.winter-page-snow-layer')) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sections = [...main.querySelectorAll(':scope > section')].filter(section =>
      !section.classList.contains('ink-scroll-hero')
    );

    const artScenes = [
      ['#home-latest-25-20261118', 'is-warm'],
      ['#kaikai-ten-hearings', 'is-mirrored'],
      ['#home-special-features', 'is-muted'],
      ['#home-historical-cases', 'is-mirrored is-muted'],
      ['#home-memorial', 'is-warm'],
      ['#join', 'is-muted']
    ];

    sections.forEach((section, sectionIndex) => {
      section.classList.add('winter-section-panel');
      section.dataset.winterScene = `${sectionIndex + 1}`;
      if (!section.querySelector(':scope > .winter-section-snowcap')) {
        const snowcap = document.createElement('span');
        snowcap.className = 'winter-section-snowcap';
        snowcap.setAttribute('aria-hidden', 'true');
        section.prepend(snowcap);
      }
      const scene = artScenes.find(([selector]) => section.matches(selector));
      if (scene && !section.querySelector(':scope > .winter-scroll-divider')) {
        const divider = document.createElement('span');
        divider.className = `winter-scroll-divider ${scene[1]}`;
        divider.setAttribute('aria-hidden', 'true');
        section.insertBefore(divider, section.querySelector(':scope > .winter-section-snowcap')?.nextSibling || section.firstChild);
      }
    });

    if (reduceMotion) return;

    const layer = document.createElement('div');
    layer.className = 'winter-page-snow-layer';
    layer.setAttribute('aria-hidden', 'true');
    const flakeCount = window.innerWidth <= 760 ? 24 : 42;
    const flakes = Array.from({ length: flakeCount }, (_, index) => {
      const flake = document.createElement('i');
      const depth = index % 7 === 0 ? 'is-near' : index % 3 === 0 ? 'is-far' : 'is-mid';
      flake.className = `winter-page-flake ${depth}`;
      flake.dataset.depth = depth;
      flake.style.setProperty('--page-snow-left', `${(index * 29) % 100}%`);
      flake.style.setProperty('--page-snow-duration', `${8 + (index % 10)}s`);
      flake.style.setProperty('--page-snow-delay', `${-(index % 13)}s`);
      layer.append(flake);
      return flake;
    });
    document.body.append(layer);

    const start = () => {
      const { gsap } = window;
      if (!gsap) {
        layer.dataset.animationEngine = 'css';
        layer.classList.add('winter-page-snow-fallback');
        return;
      }
      layer.dataset.animationEngine = 'gsap';
      const random = (min, max) => min + Math.random() * (max - min);
      const fall = (flake, firstRun = false) => {
        if (!flake.isConnected) return;
        const width = Math.max(window.innerWidth, 320);
        const height = Math.max(window.innerHeight, 640);
        const isFar = flake.dataset.depth === 'is-far';
        const isNear = flake.dataset.depth === 'is-near';
        const startY = firstRun ? random(-30, height) : random(-height * .3, -24);
        const endY = height + 40;
        gsap.set(flake, {
          x: random(8, width - 8),
          y: startY,
          rotation: random(0, 180),
          scale: isFar ? random(.55, .9) : isNear ? random(1.05, 1.55) : random(.72, 1.25),
          opacity: isFar ? random(.16, .34) : isNear ? random(.28, .58) : random(.22, .5)
        });
        gsap.to(flake, {
          x: `+=${random(isFar ? -34 : -82, isFar ? 34 : 82)}`,
          y: endY,
          rotation: `+=${random(120, 340)}`,
          duration: isFar ? random(16, 24) : isNear ? random(8, 13) : random(11, 18),
          ease: 'none',
          onComplete: () => fall(flake)
        });
      };
      flakes.forEach(flake => fall(flake, true));

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const cap = entry.target.querySelector(':scope > .winter-section-snowcap');
          const divider = entry.target.querySelector(':scope > .winter-scroll-divider');
          const heading = entry.target.querySelector('h2');
          if (cap && !cap.dataset.animated) {
            cap.dataset.animated = 'true';
            gsap.fromTo(cap,
              { opacity: 0, scaleX: .18, x: -24 },
              { opacity: .92, scaleX: 1, x: 0, duration: .9, ease: 'power2.out' }
            );
            gsap.to(cap, { backgroundPositionX: '+=96px', duration: 9, repeat: -1, ease: 'none' });
          }
          if (divider && !divider.dataset.animated) {
            divider.dataset.animated = 'true';
            const mirrored = divider.classList.contains('is-mirrored');
            gsap.fromTo(divider,
              { opacity: 0, y: 22, scaleX: mirrored ? -.96 : .96, scaleY: .96 },
              { opacity: divider.classList.contains('is-muted') ? .78 : 1, y: 0, scaleX: mirrored ? -1 : 1, scaleY: 1, duration: 1.15, ease: 'power2.out' }
            );
            gsap.to(divider, {
              y: -4,
              duration: 4.8,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut'
            });
          }
          if (heading && !heading.dataset.winterAnimated) {
            heading.dataset.winterAnimated = 'true';
            gsap.fromTo(heading,
              { opacity: .72, y: 12 },
              { opacity: 1, y: 0, duration: .65, ease: 'power2.out' }
            );
          }
          const cards = [...entry.target.querySelectorAll('.home-card, .home-latest-25-card, .upcoming-hearing')]
            .filter(card => card.offsetParent !== null)
            .slice(0, 10);
          if (cards.length && !entry.target.dataset.cardsAnimated) {
            entry.target.dataset.cardsAnimated = 'true';
            gsap.fromTo(cards,
              { opacity: .72, y: 14 },
              { opacity: 1, y: 0, duration: .62, stagger: .055, ease: 'power2.out', clearProps: 'transform' }
            );
          }
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: .08 });
      sections.forEach(section => observer.observe(section));
    };

    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
  };

  const mount = () => {
    const body = document.body;
    const main = document.querySelector('main#main-content');
    const hero = main?.querySelector('.ink-scroll-hero');
    const hearings = document.querySelector('#october-action-focus');
    const latest = document.querySelector('#home-latest-25-20261118');
    const grid = latest?.querySelector('.home-latest-25-grid');
    const isHans = document.documentElement.lang === 'zh-Hans';
    const copy = isHans ? TEXT.zhHans : TEXT.zhHant;

    body?.classList.add('home-winter-20261119');
    mountPaperCraft(hero);
    mountSnow(hero);

    if (main && hero && main.firstElementChild !== hero) {
      main.insertBefore(hero, main.firstElementChild);
    }
    if (hearings && latest) {
      hearings.insertAdjacentElement('afterend', latest);
    }

    mountPageWinter(main);

    const latestCollection = grid
      ? organizeLatest(latest, grid)
      : { count: 0, moreGrid: null };

    const latestTitle = latest?.querySelector('h2');
    const latestNote = latest?.querySelector('.home-latest-25-note');
    const latestHead = latest?.querySelector('.home-latest-25-head');
    if (latestTitle) {
      latestTitle.textContent = copy.title;
      latestTitle.dataset.hans = TEXT.zhHans.title;
    }
    if (latestNote) {
      latestNote.textContent = copy.note;
      latestNote.dataset.hans = TEXT.zhHans.note;
    }
    if (latestHead && !latestHead.querySelector('.home-latest-all')) {
      const controls = document.createElement('div');
      controls.className = 'home-latest-head-controls';
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'home-latest-toggle';
      toggle.textContent = copy.expandLatest;
      toggle.dataset.hans = TEXT.zhHans.expandLatest;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', 'home-latest-more-20261119');
      const all = document.createElement('a');
      all.className = 'home-latest-all';
      all.href = './news/';
      all.dataset.hansHref = './zh-Hans/news/';
      all.dataset.hans = TEXT.zhHans.all;
      all.textContent = copy.all;
      toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        toggle.textContent = expanded ? copy.expandLatest : copy.collapseLatest;
        toggle.dataset.hans = expanded ? TEXT.zhHans.expandLatest : TEXT.zhHans.collapseLatest;
        latestCollection.moreGrid.hidden = expanded;
        latest?.classList.toggle('is-expanded', !expanded);
      });
      controls.append(latestNote);
      if (latestCollection.moreGrid && latestCollection.count > 4) controls.append(toggle);
      controls.append(all);
      latestHead.append(controls);
    }

    const navLabels = [copy.latest, copy.hearings, copy.cases, copy.features, copy.join];
    const navHrefs = ['#home-latest-25-20261118', '#october-action-focus', './cases/', '#home-special-features', '#join'];
    simplifyNav(document.querySelector('.primary-nav'), navLabels, navHrefs);

    const mobileNav = document.querySelector('.mobile-menu > nav');
    const mobileLinks = simplifyNav(mobileNav, navLabels, navHrefs);
    if (mobileNav && mobileLinks.length > 5 && !mobileNav.querySelector('.mobile-menu-more')) {
      const news = document.createElement('a');
      news.href = '#home-media-reports';
      news.textContent = copy.news;
      news.dataset.hans = TEXT.zhHans.news;
      mobileNav.append(news);

      const more = document.createElement('div');
      more.className = 'mobile-menu-more';
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'mobile-menu-more-toggle';
      toggle.textContent = copy.more;
      toggle.dataset.hans = TEXT.zhHans.more;
      toggle.setAttribute('aria-expanded', 'false');
      const links = document.createElement('div');
      links.className = 'mobile-menu-more-links';
      links.hidden = true;
      mobileLinks.slice(5).forEach(link => links.append(link));
      toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isOpen));
        links.hidden = isOpen;
      });
      more.append(toggle, links);
      mobileNav.append(more);

      mobileNav.addEventListener('click', event => {
        if (event.target.closest('a')) {
          mobileNav.closest('details')?.removeAttribute('open');
        }
      });
    }

    const heroPrimary = hero?.querySelector('.actions .button:first-child span');
    if (heroPrimary) {
      heroPrimary.textContent = copy.hearingCta;
      heroPrimary.dataset.hans = TEXT.zhHans.hearingCta;
    }

    const heroImage = hero?.querySelector('.ink-hero-image');
    const heroCaption = hero?.querySelector('.ink-hero-caption');
    if (heroImage) {
      heroImage.alt = copy.heroAlt;
      heroImage.dataset.hansAlt = TEXT.zhHans.heroAlt;
    }
    if (heroCaption) {
      heroCaption.textContent = copy.heroCaption;
      heroCaption.dataset.hans = TEXT.zhHans.heroCaption;
    }

    const hearingAll = hearings?.querySelector('.upcoming-hearings-all span');
    if (hearingAll) {
      hearingAll.textContent = copy.hearingAll;
      hearingAll.dataset.hans = TEXT.zhHans.hearingAll;
    }

    const legalNotes = [...document.querySelectorAll('details')].find(details =>
      /法律[爭争]議界限/.test(details.querySelector('summary')?.textContent || '')
    );
    legalNotes?.removeAttribute('open');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }
})();


/* Decorative and fully optional: shares the existing GSAP runtime when present. */
(() => {
  const hero=document.querySelector('.ink-scroll-hero'), stage=hero?.querySelector('.ink-hero-stage');
  if(!stage || stage.querySelector('.winter-lost-sleigh')) return;
  const hans=document.documentElement.lang==='zh-Hans'||location.search.includes('lang=zh-Hans');
  const labels=hans?['水墨','纸雕','陶土']:['水墨','紙雕','陶土'];
  const sleigh=document.createElement('div'); sleigh.className='winter-lost-sleigh'; sleigh.setAttribute('aria-hidden','true');
  sleigh.innerHTML='<span class="winter-lost-sleigh__trail"></span><svg viewBox="0 0 180 90" role="presentation"><path d="M62 68c28 10 64 8 89-4M61 73c26 10 62 10 88-2" fill="none" stroke="#d8ad70" stroke-width="4" stroke-linecap="round"/><path d="M52 56h89l-11-24H64z" fill="#a74f3e"/><path d="M60 52h74" stroke="#f6dfaa" stroke-width="5"/><circle cx="87" cy="39" r="16" fill="#f0c2a6"/><path d="M72 34c2-21 27-24 31-3" fill="#fff7e5"/><path d="M70 31c8-17 24-17 34 0" fill="#b9473c"/><circle cx="103" cy="31" r="4" fill="#fff7e5"/><path d="M56 44L33 36M55 54L25 57" stroke="#c9975f" stroke-width="3"/><path d="M26 35c-7-10-16-8-20 0 8 0 13 4 20 10M23 57c-9-8-17-4-19 5 8-2 14 0 19 5" fill="none" stroke="#d7b47d" stroke-width="3"/></svg>';
  const tokens=document.createElement('div'); tokens.className='winter-material-tokens';tokens.setAttribute('aria-label',hans?'圣诞视觉素材':'聖誕視覺素材');tokens.innerHTML=labels.map(label=>'<span><i></i>'+label+'</span>').join('');
  stage.append(sleigh,tokens);
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!window.gsap)return;
  window.gsap.to(sleigh,{rotation:1.5,y:-3,duration:2.8,repeat:-1,yoyo:true,ease:'sine.inOut'});
})();


(() => {
  const banner=document.querySelector('.court-hearing-home-20270108');
  if(!banner || banner.querySelector('.winter-top-sleigh')) return;
  const sleigh=document.createElement('div');sleigh.className='winter-top-sleigh';sleigh.setAttribute('aria-hidden','true');
  sleigh.innerHTML='<span class="winter-top-sleigh__trail"></span><svg viewBox="0 0 180 90" role="presentation"><path d="M62 68c28 10 64 8 89-4M61 73c26 10 62 10 88-2" fill="none" stroke="#d8ad70" stroke-width="4" stroke-linecap="round"/><path d="M52 56h89l-11-24H64z" fill="#a74f3e"/><path d="M60 52h74" stroke="#f6dfaa" stroke-width="5"/><circle cx="87" cy="39" r="16" fill="#f0c2a6"/><path d="M72 34c2-21 27-24 31-3" fill="#fff7e5"/><path d="M70 31c8-17 24-17 34 0" fill="#b9473c"/><circle cx="103" cy="31" r="4" fill="#fff7e5"/><path d="M56 44L33 36M55 54L25 57" stroke="#c9975f" stroke-width="3"/><path d="M26 35c-7-10-16-8-20 0 8 0 13 4 20 10M23 57c-9-8-17-4-19 5 8-2 14 0 19 5" fill="none" stroke="#d7b47d" stroke-width="3"/></svg>';
  banner.append(sleigh);
})();


(() => {
  const banner=document.querySelector('.court-hearing-home-20270108');
  if(!banner || banner.querySelector('.christmas-art-tableau')) return;
  const art=document.createElement('div');art.className='christmas-art-tableau';art.setAttribute('aria-hidden','true');
  art.innerHTML='<i class="christmas-paper-origami"></i><i class="christmas-clay-lantern"></i>';
  banner.prepend(art);
})();


/* Editorial reading order: the core promise is the first visual experience;
   practical court information follows immediately as the first utility module. */
(() => {
  const arrange=()=>{
    const main=document.querySelector('main#main-content');
    const hero=main?.querySelector('.ink-scroll-hero');
    const hearing=document.querySelector('.court-hearing-home-20270108');
    if(main&&hero&&hearing&&hearing.previousElementSibling!==hero) hero.insertAdjacentElement('afterend',hearing);
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',arrange,{once:true}); else arrange();
})();
