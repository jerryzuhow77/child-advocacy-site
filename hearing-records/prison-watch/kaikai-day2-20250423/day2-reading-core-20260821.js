(() => {
  'use strict';

  const menu = document.querySelector('.day2-menu');
  const toc = document.querySelector('.day2-toc');
  const tocLinks = [...(toc?.querySelectorAll('a') || [])];
  const progress = document.querySelector('.day2-progress i');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canAnimate = Boolean(window.gsap && window.ScrollTrigger && !reduceMotion);
  const locale = document.documentElement.lang === 'ja' ? 'ja' : document.documentElement.lang === 'en' ? 'en' : 'zh-Hant';
  const messages = {
    'zh-Hant': { collapseAll: '收合全部', expandAll: '展開全部', collapseAllLabel: '收合全部旁聽紀錄章節', expandAllLabel: '展開全部旁聽紀錄章節', collapse: '收合', expand: '展開', collapseChapter: '收合本章', expandChapter: '展開本章', chapter: n => `第${n}章`, toolsLabel: '完整旁聽紀錄閱讀工具', procedure: '依庭審程序閱讀', procedureNote: '不是依 PDF 分頁；可逐章展開，也可一次查看全文。', jumps: '完整紀錄章節捷徑', progress: '第二日庭審對話閱讀進度', dialogue: '庭審對話' },
    en: { collapseAll: 'Collapse all', expandAll: 'Expand all', collapseAllLabel: 'Collapse all hearing-record chapters', expandAllLabel: 'Expand all hearing-record chapters', collapse: 'Collapse ', expand: 'Expand ', collapseChapter: 'Collapse chapter', expandChapter: 'Expand chapter', chapter: n => `Chapter ${n}`, toolsLabel: 'Full hearing-record reading tools', procedure: 'Read by hearing procedure', procedureNote: 'Organized by procedure, not PDF pages. Open chapters individually or view the full record.', jumps: 'Full-record chapter shortcuts', progress: 'Day 2 hearing-dialogue progress', dialogue: 'Hearing dialogue' },
    ja: { collapseAll: 'すべて閉じる', expandAll: 'すべて開く', collapseAllLabel: '傍聴記録の全章を閉じる', expandAllLabel: '傍聴記録の全章を開く', collapse: '閉じる：', expand: '開く：', collapseChapter: 'この章を閉じる', expandChapter: 'この章を開く', chapter: n => `第${n}章`, toolsLabel: '傍聴記録の閲覧ツール', procedure: '審理手続に沿って読む', procedureNote: 'PDFのページ順ではなく手続別に構成。章ごと、または全文を表示できます。', jumps: '全記録の章リンク', progress: '第2日法廷対話の閲覧進捗', dialogue: '法廷対話' }
  };
  const t = messages[locale];

  const closeMenu = () => {
    toc?.classList.remove('is-open');
    menu?.setAttribute('aria-expanded', 'false');
  };

  menu?.addEventListener('click', () => {
    const open = !toc?.classList.contains('is-open');
    toc?.classList.toggle('is-open', open);
    menu.setAttribute('aria-expanded', String(open));
  });

  tocLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => {
    if (toc?.classList.contains('is-open') && !toc.contains(event.target) && !menu?.contains(event.target)) {
      closeMenu();
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMenu();
      menu?.focus();
    }
  });

  const fullRecord = document.querySelector('.day2-full-record');
  const transcript = fullRecord?.querySelector('.day2-transcript');
  const chapters = transcript ? [...transcript.querySelectorAll('.day2-transcript-chapter')] : [];
  let readerBar;
  let readerCount;
  let reader;
  let toggleAll;

  const refreshScrollTriggers = () => {
    if (canAnimate) requestAnimationFrame(() => window.ScrollTrigger.refresh());
  };

  const updateToggleAll = () => {
    if (!toggleAll) return;
    const allOpen = chapters.every(chapter => !chapter.classList.contains('is-collapsed'));
    toggleAll.textContent = allOpen ? t.collapseAll : t.expandAll;
    toggleAll.setAttribute('aria-label', allOpen ? t.collapseAllLabel : t.expandAllLabel);
  };

  const setChapterOpen = (chapter, open, animate = true) => {
    const flow = chapter.querySelector('.day2-dialogue-flow');
    const button = chapter.querySelector('.day2-chapter-toggle');
    if (!flow || !button) return;

    const title = chapter.querySelector('h3')?.textContent?.trim() || t.chapter(chapter.dataset.chapter);
    chapter.classList.toggle('is-collapsed', !open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', `${open ? t.collapse : t.expand}${title}`);
    button.querySelector('span').textContent = open ? t.collapseChapter : t.expandChapter;

    if (!canAnimate || !animate) {
      flow.hidden = !open;
      flow.removeAttribute('style');
      updateToggleAll();
      return;
    }

    window.gsap.killTweensOf(flow);
    if (open) {
      flow.hidden = false;
      window.gsap.fromTo(
        flow,
        { height: 0, autoAlpha: 0, overflow: 'hidden' },
        {
          height: 'auto',
          autoAlpha: 1,
          duration: .46,
          ease: 'power2.out',
          clearProps: 'height,opacity,visibility,overflow',
          onComplete: refreshScrollTriggers
        }
      );
    } else {
      window.gsap.to(flow, {
        height: 0,
        autoAlpha: 0,
        overflow: 'hidden',
        duration: .36,
        ease: 'power2.inOut',
        onComplete: () => {
          flow.hidden = true;
          window.gsap.set(flow, { clearProps: 'height,opacity,visibility,overflow' });
          refreshScrollTriggers();
        }
      });
    }
    updateToggleAll();
  };

  if (fullRecord && transcript && chapters.length) {
    const ambience = document.createElement('div');
    ambience.className = 'day2-record-ambience';
    ambience.setAttribute('aria-hidden', 'true');
    ambience.innerHTML = '<i></i><i></i><i></i>';
    fullRecord.prepend(ambience);

    const tools = document.createElement('section');
    tools.className = 'day2-record-tools';
    tools.setAttribute('aria-label', t.toolsLabel);
    tools.innerHTML = `
      <div class="day2-record-tools-head">
        <div class="day2-record-tools-copy">
          <strong>${t.procedure}</strong>
          <span>${t.procedureNote}</span>
        </div>
        <button class="day2-record-toggle-all" type="button">${t.expandAll}</button>
      </div>
      <nav class="day2-chapter-jumps" aria-label="${t.jumps}"></nav>`;
    toggleAll = tools.querySelector('.day2-record-toggle-all');
    const jumps = tools.querySelector('.day2-chapter-jumps');

    reader = document.createElement('div');
    reader.className = 'day2-record-progress';
    reader.setAttribute('role', 'progressbar');
    reader.setAttribute('aria-label', t.progress);
    reader.setAttribute('aria-valuemin', '1');
    reader.setAttribute('aria-valuemax', String(chapters.length));
    reader.setAttribute('aria-valuenow', '1');
    reader.innerHTML = `<strong>${t.dialogue}</strong><span aria-hidden="true"><i></i></span><b>01 / ${String(chapters.length).padStart(2, '0')}</b>`;
    readerBar = reader.querySelector('i');
    readerCount = reader.querySelector('b');
    transcript.before(tools, reader);

    const hashTarget = chapters.find(chapter => `#${chapter.id}` === location.hash);
    chapters.forEach((chapter, index) => {
      const flow = chapter.querySelector('.day2-dialogue-flow');
      const header = chapter.querySelector(':scope > header');
      const title = chapter.querySelector('h3')?.textContent?.trim() || t.chapter(index + 1);
      const flowId = `${chapter.id}-content`;
      flow.id = flowId;

      const button = document.createElement('button');
      button.className = 'day2-chapter-toggle';
      button.type = 'button';
      button.setAttribute('aria-controls', flowId);
      button.innerHTML = `<span>${t.expandChapter}</span><i aria-hidden="true"></i>`;
      header.append(button);
      button.addEventListener('click', () => {
        setChapterOpen(chapter, button.getAttribute('aria-expanded') !== 'true');
      });

      const jump = document.createElement('a');
      jump.href = `#${chapter.id}`;
      jump.innerHTML = `${chapter.dataset.chapter}<span>${title}</span>`;
      jumps.append(jump);

      const initiallyOpen = hashTarget ? chapter === hashTarget : index === 0;
      setChapterOpen(chapter, initiallyOpen, false);
    });

    toggleAll.addEventListener('click', () => {
      const shouldOpen = chapters.some(chapter => chapter.classList.contains('is-collapsed'));
      chapters.forEach(chapter => setChapterOpen(chapter, shouldOpen, false));
      updateToggleAll();
      refreshScrollTriggers();
    });

    document.addEventListener('click', event => {
      const link = event.target.closest('a[href^="#day2-chapter-"]');
      if (!link) return;
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      setChapterOpen(target, true, false);
      history.pushState(null, '', `#${target.id}`);
      refreshScrollTriggers();
      requestAnimationFrame(() => target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }));
    });

    updateToggleAll();
  }

  const sections = tocLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const updateRecordProgress = () => {
    if (!chapters.length || !readerBar || !readerCount) return;
    let currentIndex = 0;
    chapters.forEach((chapter, index) => {
      if (chapter.getBoundingClientRect().top < innerHeight * .52) currentIndex = index;
    });
    const current = String(currentIndex + 1).padStart(2, '0');
    const total = String(chapters.length).padStart(2, '0');
    readerCount.textContent = `${current} / ${total}`;
    readerBar.style.transform = `scaleX(${(currentIndex + 1) / chapters.length})`;
    reader.setAttribute('aria-valuenow', String(currentIndex + 1));
  };

  const updatePageState = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const ratio = max > 0 ? Math.min(1, scrollY / max) : 0;
    if (progress) progress.style.transform = `scaleX(${ratio})`;

    let current = sections[0];
    sections.forEach(section => {
      if (section.getBoundingClientRect().top < innerHeight * .42) current = section;
    });
    tocLinks.forEach(link => {
      const active = Boolean(current && link.getAttribute('href') === `#${current.id}`);
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    updateRecordProgress();
  };

  let ticking = false;
  const requestPageUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updatePageState();
      ticking = false;
    });
  };
  addEventListener('scroll', requestPageUpdate, { passive: true });
  addEventListener('resize', requestPageUpdate, { passive: true });
  updatePageState();

  if (!canAnimate) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.day2-hero-copy > *', {
    y: 30,
    autoAlpha: 0,
    duration: .9,
    stagger: .07,
    ease: 'power3.out'
  });
  gsap.from('.day2-remembrance span', {
    y: 22,
    rotate: -5,
    scale: .82,
    autoAlpha: 0,
    duration: .72,
    delay: .28,
    stagger: .11,
    ease: 'back.out(1.7)'
  });
  gsap.from('.day2-hero-poster', { x: 55, rotate: 5, autoAlpha: 0, duration: 1.15, ease: 'power3.out' });
  gsap.to('.day2-hero-paper', {
    yPercent: 12,
    ease: 'none',
    scrollTrigger: { trigger: '.day2-hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });

  gsap.utils.toArray('.day2-reveal')
    .filter(element => !element.closest('.day2-juror-wall, .day2-lens-grid, .day2-full-record'))
    .forEach((element, index) => {
      gsap.fromTo(
        element,
        { y: 38, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: .72,
          delay: (index % 3) * .03,
          ease: 'power2.out',
          onComplete: () => { element.style.willChange = 'auto'; },
          scrollTrigger: { trigger: element, start: 'top 87%', once: true }
        }
      );
    });

  gsap.utils.toArray('.day2-lens-grid article').forEach((card, index) => {
    gsap.fromTo(
      card,
      { y: 28, scale: .97, autoAlpha: 0 },
      {
        y: 0,
        scale: 1,
        autoAlpha: 1,
        duration: .62,
        delay: index * .05,
        ease: 'power2.out',
        onComplete: () => { card.style.willChange = 'auto'; },
        scrollTrigger: { trigger: card, start: 'top 88%', once: true }
      }
    );
  });

  const jurorCards = gsap.utils.toArray('.day2-juror-wall article');
  const jurorPath = document.querySelector('.day2-question-path');
  const jurorPathBar = jurorPath?.querySelector('i');
  const jurorPathCount = jurorPath?.querySelector('b');
  const activateJurorTopic = index => {
    const columns = matchMedia('(max-width: 760px)').matches ? 1 : 2;
    const first = Math.floor(index / columns) * columns;
    const last = Math.min(first + columns - 1, jurorCards.length - 1);
    jurorCards.forEach((card, cardIndex) => card.classList.toggle('is-current', cardIndex >= first && cardIndex <= last));
    if (jurorPathCount) {
      const range = first === last
        ? String(first + 1).padStart(2, '0')
        : `${String(first + 1).padStart(2, '0')}–${String(last + 1).padStart(2, '0')}`;
      jurorPathCount.textContent = `${range} / ${String(jurorCards.length).padStart(2, '0')}`;
    }
    jurorPath?.setAttribute('aria-valuenow', String(last + 1));
    if (jurorPathBar) gsap.to(jurorPathBar, { scaleX: (last + 1) / jurorCards.length, duration: .4, ease: 'power2.out', overwrite: true });
  };

  jurorCards.forEach((card, index) => {
    gsap.fromTo(
      card,
      { y: 38, rotateY: index % 2 ? -3 : 3, autoAlpha: 0 },
      {
        y: 0,
        rotateY: 0,
        autoAlpha: 1,
        duration: .7,
        ease: 'power3.out',
        onComplete: () => { card.style.willChange = 'auto'; },
        scrollTrigger: { trigger: card, start: 'top 88%', once: true }
      }
    );
    ScrollTrigger.create({
      trigger: card,
      start: 'top 58%',
      end: 'bottom 42%',
      onEnter: () => activateJurorTopic(index),
      onEnterBack: () => activateJurorTopic(index)
    });
  });

  gsap.to('.day2-closing-door i:first-child', {
    xPercent: -18,
    ease: 'none',
    scrollTrigger: { trigger: '.day2-closing', start: 'top 70%', end: 'center 45%', scrub: 1 }
  });
  gsap.to('.day2-closing-door i:last-child', {
    xPercent: 18,
    ease: 'none',
    scrollTrigger: { trigger: '.day2-closing', start: 'top 70%', end: 'center 45%', scrub: 1 }
  });

  if (fullRecord && chapters.length) {
    chapters.forEach((chapter, index) => {
      gsap.fromTo(
        chapter.querySelector(':scope > header'),
        { x: index % 2 ? -24 : 24, autoAlpha: .72 },
        {
          x: 0,
          autoAlpha: 1,
          duration: .68,
          ease: 'power2.out',
          scrollTrigger: { trigger: chapter, start: 'top 91%', once: true }
        }
      );
      ScrollTrigger.create({
        trigger: chapter,
        start: 'top 54%',
        end: 'bottom 46%',
        onToggle: self => chapter.classList.toggle('is-reading', self.isActive)
      });
    });

    gsap.to('.day2-pdf-figure img', {
      scale: 1.045,
      yPercent: 3,
      ease: 'none',
      scrollTrigger: { trigger: '.day2-pdf-figure', start: 'top 85%', end: 'bottom 20%', scrub: 1 }
    });
    gsap.to('.day2-record-ambience i:nth-child(1)', {
      y: 150,
      rotate: 24,
      ease: 'none',
      scrollTrigger: { trigger: fullRecord, start: 'top bottom', end: 'bottom top', scrub: 1.4 }
    });
    gsap.to('.day2-record-ambience i:nth-child(2)', {
      y: -130,
      rotate: -16,
      ease: 'none',
      scrollTrigger: { trigger: fullRecord, start: 'top bottom', end: 'bottom top', scrub: 1.6 }
    });
    gsap.to('.day2-record-ambience i:nth-child(3)', {
      y: -90,
      scale: 1.16,
      ease: 'none',
      scrollTrigger: { trigger: fullRecord, start: 'top bottom', end: 'bottom top', scrub: 1.8 }
    });
  }

  ScrollTrigger.refresh();
})();
