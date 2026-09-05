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

  // CHAPTER-WIDE-KEYWORD-SEARCH-20260831
  const pageSearch = document.querySelector('[data-page-search]');
  const searchToggle = pageSearch?.querySelector('.chapter-search-toggle');
  const searchPanel = pageSearch?.querySelector('.chapter-search-panel');
  const searchForm = pageSearch?.querySelector('.chapter-search-form');
  const searchInput = pageSearch?.querySelector('.chapter-search-input');
  const searchStatus = pageSearch?.querySelector('.chapter-search-status');
  const searchPrev = pageSearch?.querySelector('[data-search-prev]');
  const searchNext = pageSearch?.querySelector('[data-search-next]');
  const searchLocale = document.documentElement.lang === 'zh-Hans' ? 'zh-Hans' : 'zh-Hant';
  const searchCopy = searchLocale === 'zh-Hans'
    ? { idle: '输入关键字，即可搜索第二章全部正文与折叠记录。', none: '找不到“{query}”', count: '找到 <strong>{count}</strong> 条“{query}”，当前第 <strong>{current}</strong> 条。', capped: '结果超过 500 条，请输入更具体的关键字。' }
    : { idle: '输入关键字，即可搜寻第二章全部正文与收合纪录。', none: '找不到「{query}」', count: '找到 <strong>{count}</strong> 笔「{query}」，目前第 <strong>{current}</strong> 笔。', capped: '结果超过 500 笔，请输入更具体的关键字。' };
  let searchMarks = [];
  let searchCurrent = -1;
  let searchTimer = 0;

  const setSearchPanel = (open) => {
    if (!searchPanel || !searchToggle) return;
    searchPanel.hidden = !open;
    searchToggle.setAttribute('aria-expanded', String(open));
    if (open) window.setTimeout(() => searchInput?.focus(), 0);
  };

  const clearSearchMarks = () => {
    document.querySelectorAll('mark.page-search-mark').forEach((mark) => {
      const parent = mark.parentNode;
      mark.replaceWith(document.createTextNode(mark.textContent || ''));
      parent?.normalize();
    });
    searchMarks = [];
    searchCurrent = -1;
    document.body.classList.remove('page-search-active');
    searchPrev?.setAttribute('disabled', '');
    searchNext?.setAttribute('disabled', '');
  };

  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const revealSearchResult = (mark, index) => {
    if (!mark) return;
    searchMarks.forEach((item) => item.removeAttribute('data-current'));
    mark.setAttribute('data-current', 'true');
    mark.closest('details')?.setAttribute('open', '');
    let ancestor = mark.parentElement?.closest('details');
    while (ancestor) {
      ancestor.open = true;
      ancestor = ancestor.parentElement?.closest('details');
    }
    searchCurrent = index;
    const query = (searchInput?.value || '').trim();
    if (searchStatus) searchStatus.innerHTML = searchCopy.count.replace('{count}', String(searchMarks.length)).replace('{query}', query).replace('{current}', String(index + 1));
    mark.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  };

  const moveSearchResult = (step) => {
    if (!searchMarks.length) return;
    const nextIndex = (searchCurrent + step + searchMarks.length) % searchMarks.length;
    revealSearchResult(searchMarks[nextIndex], nextIndex);
  };

  const runPageSearch = () => {
    clearSearchMarks();
    const query = (searchInput?.value || '').trim();
    if (!query) {
      if (searchStatus) searchStatus.textContent = searchCopy.idle;
      return;
    }
    const main = document.querySelector('#main');
    if (!main) return;
    const pattern = new RegExp(escapeRegExp(query), 'giu');
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent || parent.closest('script,style,noscript,template,[aria-hidden="true"]')) return NodeFilter.FILTER_REJECT;
        pattern.lastIndex = 0;
        return pattern.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while (walker.nextNode() && nodes.length < 500) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const text = node.nodeValue || '';
      const fragment = document.createDocumentFragment();
      let cursor = 0;
      pattern.lastIndex = 0;
      for (const match of text.matchAll(pattern)) {
        fragment.append(document.createTextNode(text.slice(cursor, match.index)));
        const mark = document.createElement('mark');
        mark.className = 'page-search-mark';
        mark.textContent = match[0];
        fragment.append(mark);
        cursor = match.index + match[0].length;
      }
      fragment.append(document.createTextNode(text.slice(cursor)));
      node.replaceWith(fragment);
    });
    searchMarks = [...main.querySelectorAll('mark.page-search-mark')].slice(0, 500);
    if (!searchMarks.length) {
      if (searchStatus) searchStatus.textContent = searchCopy.none.replace('{query}', query);
      return;
    }
    document.body.classList.add('page-search-active');
    searchPrev?.removeAttribute('disabled');
    searchNext?.removeAttribute('disabled');
    if (searchMarks.length >= 500 && searchStatus) searchStatus.textContent = searchCopy.capped;
    revealSearchResult(searchMarks[0], 0);
  };

  searchToggle?.addEventListener('click', () => setSearchPanel(searchToggle.getAttribute('aria-expanded') !== 'true'));
  searchForm?.addEventListener('submit', (event) => { event.preventDefault(); runPageSearch(); });
  searchInput?.addEventListener('input', () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(runPageSearch, 220);
  });
  searchPrev?.addEventListener('click', () => moveSearchResult(-1));
  searchNext?.addEventListener('click', () => moveSearchResult(1));
  searchPrev?.setAttribute('disabled', '');
  searchNext?.setAttribute('disabled', '');
  document.addEventListener('click', (event) => {
    if (pageSearch && !pageSearch.contains(event.target)) setSearchPanel(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && searchToggle?.getAttribute('aria-expanded') === 'true') {
      setSearchPanel(false);
      searchToggle.focus();
    }
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
  // ENTRY-PROLOGUE-OVERLAY-20260829
  const prologueOverlay = document.querySelector('[data-entry-prologue]');
  const prologueVideo = prologueOverlay?.querySelector('[data-prologue-video]');
  const prologueSkip = prologueOverlay?.querySelector('[data-prologue-skip]');
  const prologuePlay = prologueOverlay?.querySelector('[data-prologue-play]');
  const prologueProgress = prologueOverlay?.querySelector('[data-prologue-progress]');
  const prologueReplayLinks = [...document.querySelectorAll('a[href="#prologue-film"]')];
  // PROLOGUE-AUDIO-AUTOSTART-20260829
  const prologueAudio = document.querySelector('#chapterBgm');
  const prologueAudioVolume = document.querySelector('[data-audio-volume]');
  const prologueAudioPrompt = locale === 'zh-Hans' ? '播放序幕与配乐' : '播放序幕与配乐';
  let prologueAudioBlocked = false;
  const prologuePageLayers = prologueOverlay
    ? [...document.body.children].filter((element) => element !== prologueOverlay && element.tagName !== 'NOSCRIPT')
    : [];
  let prologueClosed = false;
  let prologueFailsafeTimer = 0;
  let prologueHideTimer = 0;

  const setProloguePageState = (active) => {
    document.body.classList.toggle('prologue-active', active);
    prologuePageLayers.forEach((element) => {
      if (active) {
        element.dataset.prologueInert = element.hasAttribute('inert') ? 'preserve' : 'added';
        element.setAttribute('inert', '');
      } else if (element.dataset.prologueInert === 'added') {
        element.removeAttribute('inert');
        delete element.dataset.prologueInert;
      } else if (element.dataset.prologueInert === 'preserve') {
        delete element.dataset.prologueInert;
      }
    });
  };

  const showProloguePlayPrompt = ({ audioBlocked = false } = {}) => {
    if (!prologueOverlay || !prologuePlay) return;
    if (audioBlocked) prologueAudioBlocked = true;
    prologueOverlay.classList.add('is-blocked');
    prologueOverlay.classList.toggle('is-audio-blocked', prologueAudioBlocked);
    const labelNode = [...prologuePlay.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
    if (labelNode) labelNode.nodeValue = prologueAudioPrompt;
    prologuePlay.setAttribute('aria-label', prologueAudioPrompt);
    prologuePlay.hidden = false;
  };

  const startPrologueAudio = ({ restart = false } = {}) => {
    if (!prologueAudio) return Promise.resolve(false);
    if (restart || prologueAudio.ended) {
      try { prologueAudio.currentTime = 0; } catch (_) {}
    }
    prologueAudio.muted = false;
    prologueAudio.volume = Number(prologueAudioVolume?.value || prologueAudio.volume || 0.58);
    prologueAudio.dataset.prologueAutoplay = 'attempting';
    const attempt = prologueAudio.play();
    if (!attempt) {
      const playing = !prologueAudio.paused;
      prologueAudio.dataset.prologueAutoplay = playing ? 'playing' : 'blocked';
      if (!playing) showProloguePlayPrompt({ audioBlocked: true });
      return Promise.resolve(playing);
    }
    return attempt.then(() => {
      prologueAudioBlocked = false;
      prologueAudio.dataset.prologueAutoplay = 'playing';
      prologueOverlay?.classList.remove('is-audio-blocked');
      return true;
    }).catch(() => {
      prologueAudio.dataset.prologueAutoplay = 'blocked';
      showProloguePlayPrompt({ audioBlocked: true });
      return false;
    });
  };

  const closePrologue = ({ focusMain = false } = {}) => {
    if (!prologueOverlay || prologueClosed) return;
    prologueClosed = true;
    window.clearTimeout(prologueFailsafeTimer);
    window.clearTimeout(prologueHideTimer);
    prologueVideo?.pause();
    prologueOverlay.classList.remove('is-blocked');
    if (prologuePlay) prologuePlay.hidden = true;
    prologueOverlay.classList.add('is-closing');
    setProloguePageState(false);
    prologueHideTimer = window.setTimeout(() => {
      prologueOverlay.hidden = true;
      prologueOverlay.setAttribute('aria-hidden', 'true');
      prologueOverlay.classList.remove('is-closing');
      if (focusMain) {
        const main = document.querySelector('#main');
        main?.setAttribute('tabindex', '-1');
        main?.focus({ preventScroll: true });
      }
    }, 700);
  };

  const playPrologue = () => {
    if (!prologueOverlay || !prologueVideo) {
      document.body.classList.remove('prologue-active');
      return;
    }
    window.clearTimeout(prologueFailsafeTimer);
    window.clearTimeout(prologueHideTimer);
    prologueClosed = false;
    prologueOverlay.hidden = false;
    prologueOverlay.removeAttribute('aria-hidden');
    prologueOverlay.classList.remove('is-closing', 'is-blocked', 'is-audio-blocked');
    if (prologuePlay) prologuePlay.hidden = true;
    prologueAudioBlocked = false;
    setProloguePageState(true);
    prologueVideo.muted = true;
    prologueVideo.currentTime = 0;
    if (prologueProgress) prologueProgress.style.transform = 'scaleX(0)';

    void startPrologueAudio({ restart: true });
    const playAttempt = prologueVideo.play();
    playAttempt?.catch(() => showProloguePlayPrompt());
    prologueFailsafeTimer = window.setTimeout(() => {
      if (prologueVideo.paused && !prologueVideo.ended) showProloguePlayPrompt();
      else if (prologueAudioBlocked || prologueAudio?.paused) showProloguePlayPrompt({ audioBlocked: true });
      else closePrologue();
    }, 12000);
  };

  prologueSkip?.addEventListener('click', () => {
    void startPrologueAudio({ restart: false });
    closePrologue({ focusMain: true });
  });
  prologuePlay?.addEventListener('click', () => {
    if (prologueVideo) {
      try { prologueVideo.currentTime = 0; } catch (_) {}
    }
    const videoAttempt = prologueVideo?.play()
      ?.then(() => true)
      .catch(() => false) || Promise.resolve(false);
    Promise.all([videoAttempt, startPrologueAudio({ restart: true })]).then(([videoStarted, audioStarted]) => {
      if (videoStarted && audioStarted) {
        prologueOverlay?.classList.remove('is-blocked', 'is-audio-blocked');
        if (prologuePlay) prologuePlay.hidden = true;
      } else {
        showProloguePlayPrompt({ audioBlocked: !audioStarted });
      }
    });
  });
  prologueVideo?.addEventListener('timeupdate', () => {
    if (!prologueProgress) return;
    const duration = Number.isFinite(prologueVideo.duration) && prologueVideo.duration > 0
      ? prologueVideo.duration
      : 5;
    const ratio = Math.min(1, Math.max(0, prologueVideo.currentTime / duration));
    prologueProgress.style.transform = `scaleX(${ratio})`;
  });
  prologueVideo?.addEventListener('ended', () => {
    if (prologueAudioBlocked || prologueAudio?.paused) {
      showProloguePlayPrompt({ audioBlocked: true });
      return;
    }
    closePrologue();
  });
  prologueVideo?.addEventListener('error', showProloguePlayPrompt);
  prologueReplayLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      playPrologue();
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && prologueOverlay && !prologueOverlay.hidden) {
      void startPrologueAudio({ restart: false });
      closePrologue({ focusMain: true });
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible' || !prologueOverlay || prologueOverlay.hidden || prologueClosed) return;
    prologueVideo?.play().catch(() => showProloguePlayPrompt());
    void startPrologueAudio({ restart: false });
  });
  requestAnimationFrame(playPrologue);

  const totalLabel = locale === 'zh-Hans' ? '个生命节点' : '个生命节点';
  const resultLabel = locale === 'zh-Hans' ? '个相符节点' : '个相符节点';

  const normalize = (value) => value.toLocaleLowerCase().replace(/\s+/g, ' ').trim();
  const filterLifeEvents = () => {
  const query = normalize(lifeSearch?.value || '');
  document.body.classList.toggle('life-search-active', Boolean(query));
  let shown = 0;

  lifeEvents.forEach((event) => {
    const haystack = normalize(`${event.dataset.search || ''} ${event.textContent || ''}`);
    const match = !query || haystack.includes(query);
    event.hidden = !match;
    if (match) shown += 1;
  });

  if (lifeStatus) {
    const quickCollapsed = !query
      && document.body.dataset.readingDepth === 'quick'
      && !document.body.classList.contains('show-all-life');
    const quickShown = Math.min(4, lifeEvents.length);
    lifeStatus.textContent = query
      ? `${locale === 'zh-Hans' ? '找到' : '找到'} ${shown} ${resultLabel}`
      : quickCollapsed
        ? `${locale === 'zh-Hans' ? '重点显示' : '重点显示'} ${quickShown} / ${lifeEvents.length} ${totalLabel}`
        : `${locale === 'zh-Hans' ? '显示' : '显示'} ${lifeEvents.length} ${totalLabel}`;
  }
};

lifeSearch?.addEventListener('input', filterLifeEvents);

  const readingDepthButtons = [...document.querySelectorAll('[data-reading-depth]')];
  const readingDepthStatus = document.querySelector('#readingDepthStatus');
  const dayCards = [...document.querySelectorAll('#ten-days .day-card')];
  const readingDepthCopy = locale === 'zh-Hans'
    ? {
        quick: '五分钟模式：显示核心结论与三层证据状态。',
        guided: '十五分钟模式：显示人物、机构、医疗警讯与责任闭环。',
        full: '完整纪录模式：再显示并展开DAY1—DAY10逐日入口。'
      }
    : {
        quick: '五分钟模式：显示核心结论与三层证据状态。',
        guided: '十五分钟模式：显示人物、机构、医疗警讯与责任闭环。',
        full: '完整纪录模式：再显示并展开DAY1—DAY10逐日入口。'
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
  document.querySelectorAll('[data-reading-route]').forEach((link) => {
    link.addEventListener('click', () => {
      const depth = link.dataset.readingRoute;
      const button = document.querySelector(`[data-reading-depth="${depth}"]`);
      button?.click();
    });
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
  ? { play: '播放配乐', pause: '暂停配乐', replay: '重播配乐', track: '当前曲目' }
  : { play: '播放配乐', pause: '暂停配乐', replay: '重播配乐', track: '目前曲目' };

const originalAudioSources = audio
  ? [...audio.querySelectorAll('source')].map((source) => ({
      src: source.src,
      type: source.type
    }))
  : [];
const audioTracks = [
  {
    title: locale === 'zh-Hans' ? '未说出口的音符' : '未说出口的音符',
    sources: originalAudioSources
  }
].filter((track) => track.sources.length);
let audioTrackIndex = 0;

const formatMediaTime = (value) => {
  const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;
  const minutes = Math.floor(safeValue / 60);
  const seconds = Math.floor(safeValue % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const currentAudioTrack = () => audioTracks[audioTrackIndex] || audioTracks[0];

const updateAudioTime = () => {
  if (!audio || !audioTime || !audioTracks.length) return;
  audioTime.textContent = `${audioTrackIndex + 1}/${audioTracks.length} · ${formatMediaTime(audio.currentTime)} / ${formatMediaTime(audio.duration || 30.8)}`;
  const title = currentAudioTrack()?.title || '';
  const accessible = `${audioCopy.track}：${title}，${audioTrackIndex + 1}/${audioTracks.length}`;
  audioTime.setAttribute('aria-label', accessible);
  audioTime.title = accessible;
};

const updateAudioState = () => {
  if (!audio || !audioToggle || !audioLabel || !audioTracks.length) return;
  const playing = !audio.paused && !audio.ended;
  const action = playing ? audioCopy.pause : (audio.ended ? audioCopy.replay : audioCopy.play);
  audioToggle.setAttribute('aria-pressed', String(playing));
  audioLabel.textContent = action;
  const title = currentAudioTrack()?.title || '';
  audioToggle.setAttribute('aria-label', `${action}：${title}`);
  audioToggle.title = `${title} · ${audioTrackIndex + 1}/${audioTracks.length}`;
  updateAudioTime();
};

const setAudioTrack = (index, autoplay = false) => {
  if (!audio || !audioTracks.length) return Promise.resolve(false);
  audioTrackIndex = ((index % audioTracks.length) + audioTracks.length) % audioTracks.length;
  const track = currentAudioTrack();
  const sourceNodes = track.sources.map(({ src, type }) => {
    const source = document.createElement('source');
    source.src = src;
    if (type) source.type = type;
    return source;
  });
  audio.replaceChildren(...sourceNodes);
  audio.dataset.trackIndex = String(audioTrackIndex);
  audio.dataset.trackCount = String(audioTracks.length);
  audio.dataset.trackTitle = track.title;
  audio.load();
  updateAudioState();
  if (!autoplay) return Promise.resolve(true);
  return audio.play().then(() => true).catch(() => false);
};

const playChapterAudioFromGesture = (restart = false) => {
  if (!audio) return Promise.resolve();
  if (restart || audio.ended || (audio.duration && audio.currentTime >= audio.duration - 0.05)) audio.currentTime = 0;
  return audio.play().catch(() => undefined);
};

if (audio && audioTracks.length) {
  audio.loop = false;
  audio.volume = Number(audioVolume?.value || 0.58);
  audio.dataset.trackIndex = '0';
  audio.dataset.trackCount = String(audioTracks.length);
  audio.dataset.trackTitle = currentAudioTrack().title;
  audio.addEventListener('loadedmetadata', updateAudioTime);
  audio.addEventListener('durationchange', updateAudioTime);
  audio.addEventListener('timeupdate', updateAudioTime);
  audio.addEventListener('play', updateAudioState);
  audio.addEventListener('pause', updateAudioState);
  audio.addEventListener('ended', () => {
    setAudioTrack(audioTrackIndex + 1, true);
  });
  audioToggle?.addEventListener('click', () => {
    if (audio.paused || audio.ended) playChapterAudioFromGesture(audio.ended);
    else audio.pause();
  });
  audioVolume?.addEventListener('input', () => { audio.volume = Number(audioVolume.value); });
  updateAudioState();
}

  // READER-OPTIMIZATIONS-20260829
  const audioController = document.querySelector('[data-audio-controller]');
  const audioCollapse = document.querySelector('[data-audio-collapse]');
  const mobileAudio = window.matchMedia('(max-width: 760px)');
  const audioPanelCopy = locale === 'zh-Hans' ? { expand: '展开配乐控制器', collapse: '收合配乐控制器' } : { expand: '展开配乐控制器', collapse: '收合配乐控制器' };
  let audioManualOpenAt = -1;
  const setAudioCollapsed = (collapsed, reason = 'auto') => {
    if (!audioController || !audioCollapse) return;
    const next = mobileAudio.matches ? Boolean(collapsed) : false;
    audioController.classList.toggle('is-collapsed', next);
    audioCollapse.setAttribute('aria-expanded', String(!next));
    audioCollapse.setAttribute('aria-label', next ? audioPanelCopy.expand : audioPanelCopy.collapse);
    audioCollapse.title = next ? audioPanelCopy.expand : audioPanelCopy.collapse;
    if (!next && reason === 'manual') audioManualOpenAt = window.scrollY;
    if (next) audioManualOpenAt = -1;
  };
  audioCollapse?.addEventListener('click', () => setAudioCollapsed(!audioController?.classList.contains('is-collapsed'), 'manual'));
  let audioScrollTicking = false;
  const syncAudioPanelWithScroll = () => {
    audioScrollTicking = false;
    if (!audioController || !mobileAudio.matches) return;
    if (window.scrollY < 120) { setAudioCollapsed(false, 'auto'); return; }
    if (audioManualOpenAt >= 0 && window.scrollY - audioManualOpenAt < 280) return;
    setAudioCollapsed(true, 'auto');
  };
  window.addEventListener('scroll', () => { if (!audioScrollTicking) { audioScrollTicking = true; requestAnimationFrame(syncAudioPanelWithScroll); } }, { passive: true });
  mobileAudio.addEventListener?.('change', () => { audioManualOpenAt = -1; setAudioCollapsed(mobileAudio.matches && window.scrollY >= 120, 'auto'); });
  document.addEventListener('click', (event) => { if (event.target.closest('a[href^="#"]') && mobileAudio.matches) setAudioCollapsed(true, 'anchor'); }, { capture: true });
  window.addEventListener('hashchange', () => { if (mobileAudio.matches) setAudioCollapsed(true, 'anchor'); });
  setAudioCollapsed(mobileAudio.matches && window.scrollY >= 120, 'auto');

  const theatre = document.querySelector('[data-puppet-theatre]');
  const initPuppetTheatre = () => {
    if (!theatre || theatre.dataset.runtimeReady === 'true') return;
    theatre.dataset.runtimeReady = 'true';
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
      : { play: '开演', continue: '继续', playing: '演出中', replay: '再看一次', reduced: '已采用减少动态模式', unavailable: '动画不可用' };

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
  };
  if (theatre) {
    if ('IntersectionObserver' in window) {
      const theatreObserver = new IntersectionObserver((entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        initPuppetTheatre();
        observer.disconnect();
      }, { rootMargin: '800px 0px 800px 0px', threshold: 0.01 });
      theatreObserver.observe(theatre);
    } else { initPuppetTheatre(); }
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
        sectionLink: '复制本节连结', copied: '连结已复制', shareDone: '摘要连结已复制',
        exportDone: '来源索引已下载', showLife: '显示全部生命节点', hideLife: '收合为5分钟重点',
        top: '返回页首', revealed: '已为这个深连结暂时展开完整段落。', exportName: '剀剀案第二章-来源索引.tsv',
        shareText: '剀剀案特定专题第二章：先用5分钟看懂两次出养程序、警讯断点与制度责任。'
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
  const root = document.documentElement;
  const topbar = document.querySelector('.topbar');
  const getTargetFromHash = (hash = location.hash) => {
    if (!hash || hash.length < 2) return null;
    try { return document.getElementById(decodeURIComponent(hash.slice(1))); } catch (_) { return null; }
  };
  const getHashTarget = () => getTargetFromHash(location.hash);
  const syncAnchorOffset = () => {
    const headerHeight = topbar ? Math.ceil(topbar.getBoundingClientRect().height) : 0;
    const fallback = window.innerWidth <= 760 ? 82 : 92;
    const offset = headerHeight ? Math.max(fallback, headerHeight + 14) : fallback;
    root.style.setProperty('--chapter-anchor-offset', `${offset}px`);
    return offset;
  };
  syncAnchorOffset();
  window.addEventListener('resize', syncAnchorOffset, { passive: true });
  if ('ResizeObserver' in window && topbar) new ResizeObserver(syncAnchorOffset).observe(topbar);

  let hashScrollSequence = 0;
  let hashLayoutObserver = null;
  const revealTargetForNavigation = (target) => {
    if (!target) return;
    let disclosure = target.closest?.('details');
    while (disclosure) {
      disclosure.open = true;
      disclosure = disclosure.parentElement?.closest('details') || null;
    }
    let node = target;
    while (node && node !== document.documentElement) {
      if (node.tagName === 'DETAILS') node.open = true;
      if (node.classList?.contains('reveal')) node.classList.add('in-view');
      if (node.matches?.('section[data-heavy="true"]')) node.style.contentVisibility = 'visible';
      node = node.parentElement;
    }
  };
  const stopHashLayoutObserver = () => {
    hashLayoutObserver?.disconnect();
    hashLayoutObserver = null;
  };
  const stabilizeHashTarget = (target, smooth = false) => {
    if (!target) return;
    stopHashLayoutObserver();
    const sequence = ++hashScrollSequence;
    revealTargetForNavigation(target);
    syncAnchorOffset();

    const expectedTop = () => {
      const value = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
      return Number.isFinite(value) ? value : syncAnchorOffset();
    };
    const align = (behavior = 'auto') => {
      if (sequence !== hashScrollSequence || getHashTarget() !== target) return;
      revealTargetForNavigation(target);
      syncAnchorOffset();
      const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - expectedTop());
      if (behavior === 'smooth') {
        window.scrollTo({ top, left: window.scrollX, behavior: 'smooth' });
        return;
      }
      const previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      window.scrollTo({ top, left: window.scrollX, behavior: 'auto' });
      root.style.scrollBehavior = previousScrollBehavior;
    };
    const correctLayoutShift = () => {
      if (sequence !== hashScrollSequence || getHashTarget() !== target) return;
      revealTargetForNavigation(target);
      syncAnchorOffset();
      const top = target.getBoundingClientRect().top;
      if (Math.abs(top - expectedTop()) > 6) align('auto');
    };

    requestAnimationFrame(() => requestAnimationFrame(() => align(smooth && !reduceMotion ? 'smooth' : 'auto')));
    [120, 320, 700, 1200, 1900, 2800].forEach((delay) => window.setTimeout(correctLayoutShift, delay));
    if (document.fonts?.ready) document.fonts.ready.then(() => window.setTimeout(correctLayoutShift, 0));
    document.querySelectorAll('img:not([loading="lazy"])').forEach((image) => {
      if (!image.complete) image.addEventListener('load', correctLayoutShift, { once: true });
    });
    if ('ResizeObserver' in window) {
      hashLayoutObserver = new ResizeObserver(correctLayoutShift);
      hashLayoutObserver.observe(document.body);
      window.setTimeout(() => {
        if (sequence === hashScrollSequence) stopHashLayoutObserver();
      }, 3000);
    }
  };
  const cancelHashStabilization = () => {
    hashScrollSequence += 1;
    stopHashLayoutObserver();
  };
  window.addEventListener('wheel', cancelHashStabilization, { passive: true });
  window.addEventListener('touchstart', cancelHashStabilization, { passive: true });
  window.addEventListener('keydown', (event) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) cancelHashStabilization();
  });

  const revealHashTarget = (scroll = false) => {
  document.querySelectorAll('[data-depth-reveal="true"]').forEach((node) => {
    node.removeAttribute('data-depth-reveal');
    node.querySelector(':scope > .depth-reveal-note')?.remove();
  });
  const target = getHashTarget();
  const closestSection = target?.closest('main section[data-reading-level]');
  const revealedSections = new Set();
  if (!target) return revealedSections;
  revealTargetForNavigation(target);
  if (!closestSection) {
    if (scroll) stabilizeHashTarget(target, true);
    return revealedSections;
  }

  let section = closestSection;
  while (section) {
    section.dataset.depthReveal = 'true';
    section.hidden = false;
    section.removeAttribute('aria-hidden');
    revealedSections.add(section);
    section = section.parentElement?.closest('main section[data-reading-level]') || null;
  }

  revealTargetForNavigation(target);
  if (!closestSection.querySelector(':scope > .depth-reveal-note')) {
    const note = document.createElement('p');
    note.className = 'depth-reveal-note';
    note.textContent = copy.revealed;
    closestSection.prepend(note);
  }
  if (scroll) stabilizeHashTarget(target, true);
  return revealedSections;
};
const applyReadingDepth = (scrollToHash = false) => {
  const selected = Object.prototype.hasOwnProperty.call(depthRank, body.dataset.readingDepth)
    ? body.dataset.readingDepth : 'guided';
  const revealedSections = revealHashTarget(false);
  depthSections.forEach((section) => {
    const needed = depthRank[section.dataset.readingLevel] ?? 0;
    const hide = needed > depthRank[selected] && !revealedSections.has(section);
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
  window.addEventListener('load', () => {
    const target = getHashTarget();
    if (target) stabilizeHashTarget(target, false);
  }, { once: true });

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
  lifeSearch?.dispatchEvent(new Event('input'));
}
  syncLifeToggle();
  applyReadingDepth(Boolean(location.hash));

  document.querySelectorAll('main section[id]').forEach((section) => {
    const heading = section.querySelector(':scope > .section-head h2, :scope > header.section-head h2');
    if (!heading || heading.querySelector('.section-permalink')) return;
    const link = document.createElement('a');
    link.className = 'section-permalink';
    link.href = `#${section.id}`;
    link.textContent = isHans ? '链接' : '连结';
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
    const rows = [[isHans ? '序号' : '序号', isHans ? '来源' : '来源', isHans ? '网址' : '网址']];
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

  // 12-witness poster: restrained paper-depth reveal and pointer parallax.
  const witnessPoster = document.querySelector('.chen-witness-entry-card');
  if (witnessPoster && window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const posterArt = witnessPoster.querySelector('.witness-poster-art');
    const posterItems = witnessPoster.querySelectorAll('.witness-poster-copy > *');
    const revealPoster = () => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo(witnessPoster, { y: 34, opacity: 0, rotateX: 2 }, { y: 0, opacity: 1, rotateX: 0, duration: .9 })
        .fromTo(posterArt, { scale: 1.12, xPercent: 2 }, { scale: 1.035, xPercent: 0, duration: 1.4 }, 0)
        .fromTo(posterItems, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .62, stagger: .08 }, .2);
    };
    const posterObserver = new IntersectionObserver((entries, observer) => {
      if (entries.some((entry) => entry.isIntersecting)) { revealPoster(); observer.disconnect(); }
    }, { threshold: .22 });
    posterObserver.observe(witnessPoster);
    witnessPoster.addEventListener('pointermove', (event) => {
      const rect = witnessPoster.getBoundingClientRect();
      gsap.to(posterArt, { x: ((event.clientX - rect.left) / rect.width - .5) * 10, y: ((event.clientY - rect.top) / rect.height - .5) * 7, duration: .7, ease: 'power2.out' });
    });
    witnessPoster.addEventListener('pointerleave', () => gsap.to(posterArt, { x: 0, y: 0, duration: .8, ease: 'power2.out' }));
  }
})();
