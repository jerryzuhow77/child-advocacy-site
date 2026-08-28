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
