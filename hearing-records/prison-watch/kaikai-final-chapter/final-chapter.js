(() => {
  document.documentElement.classList.add('js-ready');

  const menuButton = document.querySelector('#menuButton');
  const siteNav = document.querySelector('#siteNav');

  const setMenu = (open) => {
    if (!menuButton || !siteNav) return;
    siteNav.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
  };

  menuButton?.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  siteNav?.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  const revealItems = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('in-view'));
  }

  const lifeSearch = document.querySelector('#lifeSearch');
  const lifeStatus = document.querySelector('#lifeStatus');
  const lifeEvents = [...document.querySelectorAll('#lifeTimeline .life-event')];
  const locale = document.documentElement.lang === 'zh-Hans' ? 'zh-Hans' : 'zh-Hant';
  const totalLabel = locale === 'zh-Hans' ? '个生命节点' : '個生命節點';
  const resultLabel = locale === 'zh-Hans' ? '个相符节点' : '個相符節點';

  const normalize = (value) => value.toLocaleLowerCase().replace(/\s+/g, ' ').trim();
  const filterLifeEvents = () => {
    const query = normalize(lifeSearch?.value || '');
    let shown = 0;

    lifeEvents.forEach((event) => {
      const haystack = normalize(`${event.dataset.search || ''} ${event.textContent || ''}`);
      const match = !query || haystack.includes(query);
      event.hidden = !match;
      if (match) shown += 1;
    });

    if (lifeStatus) {
      lifeStatus.textContent = query
        ? `${locale === 'zh-Hans' ? '找到' : '找到'} ${shown} ${resultLabel}`
        : `${locale === 'zh-Hans' ? '显示' : '顯示'} ${lifeEvents.length} ${totalLabel}`;
    }
  };

  lifeSearch?.addEventListener('input', filterLifeEvents);

  const readingDepthButtons = [...document.querySelectorAll('[data-reading-depth]')];
  const readingDepthStatus = document.querySelector('#readingDepthStatus');
  const dayCards = [...document.querySelectorAll('#ten-days .day-card')];
  const readingDepthCopy = locale === 'zh-Hans'
    ? {
        quick: '五分钟模式：显示核心结论与三层证据状态。',
        guided: '三十分钟模式：显示三层证据状态、四阶段形成图与十项跨日勾稽。',
        full: '完整纪录模式：再显示并展开DAY1—DAY10逐日入口。'
      }
    : {
        quick: '五分鐘模式：顯示核心結論與三層證據狀態。',
        guided: '三十分鐘模式：顯示三層證據狀態、四階段形成圖與十項跨日勾稽。',
        full: '完整紀錄模式：再顯示並展開DAY1—DAY10逐日入口。'
      };

  const setReadingDepth = (depth, persist = true) => {
    const selected = Object.prototype.hasOwnProperty.call(readingDepthCopy, depth) ? depth : 'guided';
    document.body.dataset.readingDepth = selected;
    readingDepthButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.readingDepth === selected));
    });
    if (readingDepthStatus) readingDepthStatus.textContent = readingDepthCopy[selected];
    dayCards.forEach((card) => { card.open = selected === 'full'; });
    if (!persist) return;
    try { localStorage.setItem('kaikai-final-reading-depth-v1', selected); } catch (_) {}
  };

  let savedReadingDepth = 'guided';
  try { savedReadingDepth = localStorage.getItem('kaikai-final-reading-depth-v1') || 'guided'; } catch (_) {}
  setReadingDepth(savedReadingDepth, false);
  readingDepthButtons.forEach((button) => {
    button.addEventListener('click', () => setReadingDepth(button.dataset.readingDepth));
  });

  const navLinks = [...document.querySelectorAll('#siteNav a[href^="#"]')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && navLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${visible.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.1, 0.4] });
    sections.forEach((section) => sectionObserver.observe(section));
  }
})();
