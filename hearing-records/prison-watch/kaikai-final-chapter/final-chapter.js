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

  const audio = document.querySelector('#chapterBgm');
  const audioToggle = document.querySelector('[data-audio-label]')?.closest('button');
  const audioLabel = document.querySelector('[data-audio-label]');
  const audioTime = document.querySelector('[data-audio-time]');
  const audioVolume = document.querySelector('[data-audio-volume]');
  const audioCopy = locale === 'zh-Hans'
    ? { play: '播放配乐', pause: '暂停配乐', replay: '重播配乐' }
    : { play: '播放配樂', pause: '暫停配樂', replay: '重播配樂' };

  const formatMediaTime = (value) => {
    const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;
    const minutes = Math.floor(safeValue / 60);
    const seconds = Math.floor(safeValue % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const updateAudioTime = () => {
    if (!audio || !audioTime) return;
    audioTime.textContent = `${formatMediaTime(audio.currentTime)} / ${formatMediaTime(audio.duration || 30.8)}`;
  };

  const updateAudioState = () => {
    if (!audio || !audioToggle || !audioLabel) return;
    const playing = !audio.paused && !audio.ended;
    audioToggle.setAttribute('aria-pressed', String(playing));
    audioLabel.textContent = playing ? audioCopy.pause : (audio.ended ? audioCopy.replay : audioCopy.play);
    updateAudioTime();
  };

  const playChapterAudioFromGesture = (restart = false) => {
    if (!audio) return Promise.resolve();
    if (restart || audio.ended || (audio.duration && audio.currentTime >= audio.duration - 0.05)) audio.currentTime = 0;
    return audio.play().catch(() => undefined);
  };

  if (audio) {
    audio.loop = false;
    audio.volume = Number(audioVolume?.value || 0.58);
    audio.addEventListener('loadedmetadata', updateAudioTime);
    audio.addEventListener('timeupdate', updateAudioTime);
    audio.addEventListener('play', updateAudioState);
    audio.addEventListener('pause', updateAudioState);
    audio.addEventListener('ended', updateAudioState);
    audioToggle?.addEventListener('click', () => {
      if (audio.paused || audio.ended) playChapterAudioFromGesture(audio.ended);
      else audio.pause();
    });
    audioVolume?.addEventListener('input', () => { audio.volume = Number(audioVolume.value); });
    updateAudioState();
  }

  const theatre = document.querySelector('[data-puppet-theatre]');
  if (theatre) {
    const stage = theatre.querySelector('.puppet-stage');
    const stageArt = theatre.querySelector('.puppet-stage-art');
    const female = theatre.querySelector('[data-puppet="female"]');
    const male = theatre.querySelector('[data-puppet="male"]');
    const curtainLeft = theatre.querySelector('.stage-curtain-left');
    const curtainRight = theatre.querySelector('.stage-curtain-right');
    const dialogue = theatre.querySelector('.puppet-dialogue');
    const dialogueSpeaker = theatre.querySelector('[data-dialogue-speaker]');
    const dialogueCopy = theatre.querySelector('[data-dialogue-copy]');
    const petals = [...theatre.querySelectorAll('.stage-petals i')];
    const mistOne = theatre.querySelector('.mist-one');
    const mistTwo = theatre.querySelector('.mist-two');
    const playButton = theatre.querySelector('[data-puppet-action="play"]');
    const pauseButton = theatre.querySelector('[data-puppet-action="pause"]');
    const replayButton = theatre.querySelector('[data-puppet-action="replay"]');
    const skipLink = theatre.querySelector('[data-puppet-action="skip"]');
    const progress = theatre.querySelector('.puppet-progress');
    const progressFill = progress?.querySelector('span');
    const transcript = document.querySelector('#puppet-transcript');
    const dialogueLines = [...document.querySelectorAll('[data-dialogue-lines] li')].map((item) => ({
      speaker: item.dataset.speaker || '',
      copy: item.querySelector('p')?.textContent?.trim() || ''
    }));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const theatreCopy = locale === 'zh-Hans'
      ? { play: '开演', continue: '继续', playing: '演出中', replay: '再看一次', reduced: '已采用减少动态模式', unavailable: '动画不可用' }
      : { play: '開演', continue: '繼續', playing: '演出中', replay: '再看一次', reduced: '已採用減少動態模式', unavailable: '動畫不可用' };

    const showDialogue = (index) => {
      const line = dialogueLines[index];
      if (!line || !dialogueSpeaker || !dialogueCopy) return;
      dialogueSpeaker.textContent = line.speaker;
      dialogueCopy.textContent = line.copy;
    };

    const setProgress = (ratio) => {
      const percent = Math.max(0, Math.min(100, Math.round(ratio * 100)));
      if (progressFill) progressFill.style.width = `${percent}%`;
      progress?.setAttribute('aria-valuenow', String(percent));
    };

    const setStaticFinalState = () => {
      showDialogue(dialogueLines.length - 1);
      setProgress(1);
      theatre.dataset.curtain = 'open';
      if (!window.gsap) return;
      window.gsap.set([female, male, dialogue], { clearProps: 'all', autoAlpha: 1, xPercent: 0, y: 0, rotation: 0, scale: 1 });
      window.gsap.set(curtainLeft, { xPercent: -105 });
      window.gsap.set(curtainRight, { xPercent: 105 });
      window.gsap.set(petals, { autoAlpha: 0 });
    };

    if (!window.gsap || reducedMotion || !dialogueLines.length) {
      theatre.dataset.animated = 'false';
      setStaticFinalState();
      if (playButton) {
        playButton.disabled = true;
        playButton.textContent = reducedMotion ? theatreCopy.reduced : theatreCopy.unavailable;
      }
      if (pauseButton) pauseButton.disabled = true;
      if (replayButton) replayButton.disabled = true;
    } else {
      const gsap = window.gsap;
      theatre.dataset.animated = 'true';
      theatre.dataset.curtain = 'closed';
      gsap.set(curtainLeft, { xPercent: 0 });
      gsap.set(curtainRight, { xPercent: 0 });
      gsap.set([female, male], { autoAlpha: 0 });
      gsap.set(female, { xPercent: -42, rotation: -7, transformOrigin: '50% 90%' });
      gsap.set(male, { xPercent: 42, rotation: 7, transformOrigin: '50% 90%' });
      gsap.set(stageArt, { scale: 1.065, transformOrigin: '50% 50%' });
      gsap.set(dialogue, { autoAlpha: 0, y: 18 });

      const timeline = gsap.timeline({
        paused: true,
        defaults: { ease: 'power2.inOut' },
        onUpdate: () => setProgress(timeline.totalProgress()),
        onComplete: () => {
          if (playButton) {
            playButton.textContent = theatreCopy.replay;
            playButton.disabled = false;
          }
          if (pauseButton) pauseButton.disabled = true;
        }
      });

      timeline
        .to(curtainLeft, { xPercent: -105, duration: 1.55, ease: 'power3.inOut' }, 0)
        .to(curtainRight, { xPercent: 105, duration: 1.55, ease: 'power3.inOut' }, 0)
        .call(() => { theatre.dataset.curtain = 'open'; }, [], 1.4)
        .to(stageArt, { scale: 1, duration: 5.5, ease: 'sine.out' }, 0)
        .to(female, { xPercent: 0, autoAlpha: 1, rotation: 0, duration: 1.25, ease: 'back.out(1.25)' }, 0.65)
        .to(male, { xPercent: 0, autoAlpha: 1, rotation: 0, duration: 1.35, ease: 'back.out(1.2)' }, 1.05)
        .to(mistOne, { xPercent: 16, yPercent: -8, duration: 8, repeat: 3, yoyo: true, ease: 'sine.inOut' }, 0)
        .to(mistTwo, { xPercent: -18, yPercent: 7, duration: 7, repeat: 3, yoyo: true, ease: 'sine.inOut' }, 0);

      petals.forEach((petal, index) => {
        timeline.fromTo(petal,
          { y: -30, x: 0, rotation: index * 19, autoAlpha: 0 },
          { y: Math.max(440, stage?.clientHeight || 520), x: index % 2 ? 90 : -70, rotation: 540, autoAlpha: 0.82, duration: 7.2, repeat: 3, delay: index * 0.27, ease: 'none' },
          0
        );
      });

      dialogueLines.forEach((line, index) => {
        const start = 2.15 + index * 3.25;
        const ensemble = line.speaker.includes('同');
        const actor = line.speaker.includes('女') && !ensemble ? female : male;
        timeline.call(() => showDialogue(index), [], start)
          .fromTo(dialogue, { autoAlpha: 0.25, y: 13 }, { autoAlpha: 1, y: 0, duration: 0.42 }, start);
        if (ensemble) {
          timeline.to([female, male], { y: -8, scale: 1.02, duration: 0.5 }, start)
            .to([female, male], { y: 0, scale: 1, duration: 0.82 }, start + 0.52);
        } else {
          timeline.to(actor, { y: -11, rotation: actor === female ? -2.4 : 2.4, scale: 1.025, duration: 0.5, ease: 'sine.out' }, start)
            .to(actor, { y: 0, rotation: 0, scale: 1, duration: 0.82, ease: 'sine.inOut' }, start + 0.52);
        }
      });

      const curtainCloseAt = 28.15;
      timeline
        .to(dialogue, { autoAlpha: 0, y: 14, duration: 0.55, ease: 'power2.in' }, curtainCloseAt)
        .to([female, male], { y: 12, autoAlpha: 0.72, duration: 0.8, ease: 'sine.inOut' }, curtainCloseAt)
        .call(() => { theatre.dataset.curtain = 'closed'; }, [], curtainCloseAt + 0.3)
        .to(curtainLeft, { xPercent: 0, duration: 1.85, ease: 'power3.inOut' }, curtainCloseAt + 0.35)
        .to(curtainRight, { xPercent: 0, duration: 1.85, ease: 'power3.inOut' }, curtainCloseAt + 0.35);

      const playTimeline = (restart = false) => {
        if (restart || timeline.totalProgress() >= 0.999) timeline.restart();
        else timeline.play();
        playChapterAudioFromGesture(restart || audio?.ended);
        if (playButton) {
          playButton.textContent = theatreCopy.playing;
          playButton.disabled = true;
        }
        if (pauseButton) pauseButton.disabled = false;
      };

      playButton?.addEventListener('click', () => playTimeline(false));
      pauseButton?.addEventListener('click', () => {
        timeline.pause();
        audio?.pause();
        if (playButton) {
          playButton.textContent = theatreCopy.continue;
          playButton.disabled = false;
        }
        pauseButton.disabled = true;
      });
      replayButton?.addEventListener('click', () => playTimeline(true));
      skipLink?.addEventListener('click', () => {
        timeline.pause(0);
        audio?.pause();
        if (audio) audio.currentTime = 0;
        setStaticFinalState();
        if (transcript) transcript.open = true;
        if (playButton) {
          playButton.textContent = theatreCopy.replay;
          playButton.disabled = false;
        }
        if (pauseButton) pauseButton.disabled = true;
      });
    }
  }
})();

// 2026-08-28 · chapter 2 reader-first UX
(() => {
  const locale = document.documentElement.lang === 'zh-Hans' ? 'zh-Hans' : 'zh-Hant';
  const isHans = locale === 'zh-Hans';
  const body = document.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const copy = isHans
    ? {
        sectionLink: '复制本节链接', copied: '链接已复制', shareDone: '摘要链接已复制',
        exportDone: '来源索引已下载', showLife: '显示全部生命节点', hideLife: '收合为5分钟重点',
        top: '返回页首', revealed: '已为这个深链接暂时展开完整段落。', exportName: '剀剀案第二章-来源索引.tsv',
        shareText: '剀剀案特定专题第二章：先用5分钟看懂两次出养程序、警讯断点与制度责任。'
      }
    : {
        sectionLink: '複製本節連結', copied: '連結已複製', shareDone: '摘要連結已複製',
        exportDone: '來源索引已下載', showLife: '顯示全部生命節點', hideLife: '收合為5分鐘重點',
        top: '返回頁首', revealed: '已為這個深連結暫時展開完整段落。', exportName: '剴剴案第二章-來源索引.tsv',
        shareText: '剴剴案特定專題第二章：先用5分鐘看懂兩次出養程序、警訊斷點與制度責任。'
      };

  const toast = document.createElement('div');
  toast.className = 'chapter-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.append(toast);
  let toastTimer = 0;
  const notify = (message) => {
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2200);
  };

  const siteNav = document.querySelector('#siteNav');
  const navGroups = [...document.querySelectorAll('#siteNav .nav-group')];
  navGroups.forEach((group) => {
    group.addEventListener('toggle', () => {
      if (!group.open) return;
      navGroups.forEach((other) => { if (other !== group) other.open = false; });
    });
  });
  document.addEventListener('click', (event) => {
    if (!siteNav?.contains(event.target)) navGroups.forEach((group) => { group.open = false; });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const openGroup = navGroups.find((group) => group.open);
    if (openGroup) {
      openGroup.open = false;
      openGroup.querySelector('summary')?.focus();
    }
  });

  const activeGroupObserver = siteNav && 'MutationObserver' in window
    ? new MutationObserver(() => {
        const active = siteNav.querySelector('a.active');
        if (active && window.innerWidth > 1480) active.closest('.nav-group')?.setAttribute('open', '');
      })
    : null;
  activeGroupObserver?.observe(siteNav, { attributes: true, subtree: true, attributeFilter: ['class'] });

  const caption = document.querySelector('.hero-caption-details');
  const mobileCaption = window.matchMedia('(max-width: 760px)');
  let captionTouched = false;
  caption?.addEventListener('toggle', () => { captionTouched = true; });
  const syncCaption = () => {
    if (!caption || captionTouched) return;
    caption.open = !mobileCaption.matches;
  };
  syncCaption();
  mobileCaption.addEventListener?.('change', syncCaption);

  const depthRank = { quick: 0, guided: 1, full: 2 };
  const depthSections = [...document.querySelectorAll('main section[data-reading-level]')];
  const getHashTarget = () => {
    if (!location.hash || location.hash.length < 2) return null;
    try { return document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (_) { return null; }
  };
  const revealHashTarget = (scroll = false) => {
    document.querySelectorAll('[data-depth-reveal="true"]').forEach((node) => {
      node.removeAttribute('data-depth-reveal');
      node.querySelector(':scope > .depth-reveal-note')?.remove();
    });
    const target = getHashTarget();
    const section = target?.closest('main section[data-reading-level]');
    if (!section) return null;
    section.dataset.depthReveal = 'true';
    section.hidden = false;
    section.removeAttribute('aria-hidden');
    if (!section.querySelector(':scope > .depth-reveal-note')) {
      const note = document.createElement('p');
      note.className = 'depth-reveal-note';
      note.textContent = copy.revealed;
      section.prepend(note);
    }
    if (scroll) requestAnimationFrame(() => target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }));
    return section;
  };
  const applyReadingDepth = (scrollToHash = false) => {
    const selected = Object.prototype.hasOwnProperty.call(depthRank, body.dataset.readingDepth)
      ? body.dataset.readingDepth : 'guided';
    const revealed = revealHashTarget(false);
    depthSections.forEach((section) => {
      const needed = depthRank[section.dataset.readingLevel] ?? 0;
      const hide = needed > depthRank[selected] && section !== revealed;
      section.hidden = hide;
      if (hide) section.setAttribute('aria-hidden', 'true');
      else section.removeAttribute('aria-hidden');
    });
    if (scrollToHash) revealHashTarget(true);
    syncLifeToggle();
  };
  document.querySelectorAll('[data-reading-depth]').forEach((button) => {
    button.addEventListener('click', () => requestAnimationFrame(() => applyReadingDepth(false)));
  });
  if ('MutationObserver' in window) {
    new MutationObserver(() => applyReadingDepth(false)).observe(body, { attributes: true, attributeFilter: ['data-reading-depth'] });
  }
  window.addEventListener('hashchange', () => applyReadingDepth(true));

  const lifeTimeline = document.querySelector('#lifeTimeline');
  let lifeToggle = null;
  if (lifeTimeline?.children.length > 4) {
    lifeToggle = document.createElement('button');
    lifeToggle.id = 'lifeQuickToggle';
    lifeToggle.type = 'button';
    lifeTimeline.after(lifeToggle);
    lifeToggle.addEventListener('click', () => {
      body.classList.toggle('show-all-life');
      syncLifeToggle();
    });
  }
  function syncLifeToggle() {
    if (!lifeToggle) return;
    const expanded = body.classList.contains('show-all-life');
    lifeToggle.textContent = expanded ? copy.hideLife : copy.showLife;
    lifeToggle.setAttribute('aria-expanded', String(expanded));
    lifeToggle.setAttribute('aria-controls', 'lifeTimeline');
  }
  syncLifeToggle();
  applyReadingDepth(false);

  document.querySelectorAll('main section[id]').forEach((section) => {
    const heading = section.querySelector(':scope > .section-head h2, :scope > header.section-head h2');
    if (!heading || heading.querySelector('.section-permalink')) return;
    const link = document.createElement('a');
    link.className = 'section-permalink';
    link.href = `#${section.id}`;
    link.textContent = isHans ? '链接' : '連結';
    link.setAttribute('aria-label', `${copy.sectionLink}：${heading.textContent.trim()}`);
    link.title = copy.sectionLink;
    link.addEventListener('click', async (event) => {
      if (!navigator.clipboard) return;
      event.preventDefault();
      const url = `${location.href.split('#')[0]}#${section.id}`;
      try { await navigator.clipboard.writeText(url); notify(copy.copied); history.replaceState(null, '', `#${section.id}`); }
      catch (_) { location.hash = section.id; }
    });
    heading.append(link);
  });

  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  progress.innerHTML = '<span></span>';
  document.body.prepend(progress);
  const progressFill = progress.firstElementChild;
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.type = 'button';
  backToTop.innerHTML = '↑';
  backToTop.setAttribute('aria-label', copy.top);
  backToTop.title = copy.top;
  document.body.append(backToTop);
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  let ticking = false;
  const updateScrollUi = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progressFill.style.width = `${Math.min(100, Math.max(0, window.scrollY / max * 100))}%`;
    backToTop.classList.toggle('visible', window.scrollY > 700);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateScrollUi);
  }, { passive: true });
  window.addEventListener('resize', updateScrollUi, { passive: true });
  updateScrollUi();

  document.querySelector('[data-share-summary]')?.addEventListener('click', async () => {
    const url = `${location.href.split('#')[0]}#chapter-brief`;
    try {
      if (navigator.share) await navigator.share({ title: document.title, text: copy.shareText, url });
      else if (navigator.clipboard) { await navigator.clipboard.writeText(`${copy.shareText}\n${url}`); notify(copy.shareDone); }
      else location.hash = 'chapter-brief';
    } catch (error) {
      if (error?.name !== 'AbortError') location.hash = 'chapter-brief';
    }
  });

  document.querySelector('[data-export-sources]')?.addEventListener('click', () => {
    const rows = [[isHans ? '序号' : '序號', isHans ? '来源' : '來源', isHans ? '网址' : '網址']];
    document.querySelectorAll('#sources a[href]').forEach((link, index) => {
      rows.push([String(index + 1), link.textContent.replace(/\s+/g, ' ').trim(), link.href]);
    });
    const tsv = '\ufeff' + rows.map((row) => row.map((cell) => String(cell).replace(/\t/g, ' ')).join('\t')).join('\n');
    const href = URL.createObjectURL(new Blob([tsv], { type: 'text/tab-separated-values;charset=utf-8' }));
    const download = document.createElement('a');
    download.href = href;
    download.download = copy.exportName;
    document.body.append(download);
    download.click();
    download.remove();
    URL.revokeObjectURL(href);
    notify(copy.exportDone);
  });
})();
