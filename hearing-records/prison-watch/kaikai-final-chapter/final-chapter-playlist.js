// DUAL-TRACK-PLAYLIST-20260829
(() => {
  const initDualTrackPlaylist = () => {
    const audio = document.querySelector('#chapterBgm');
    if (!audio || audio.dataset.dualTrackReady === 'true') return;

    const controller = document.querySelector('[data-audio-controller]');
    const time = controller?.querySelector('[data-audio-time]');
    const firstWebm = audio.querySelector('source[type="audio/webm"]')?.src || '';
    const firstM4a = audio.querySelector('source[type="audio/mp4"]')?.src || '';
    const secondWebm = firstWebm
      ? new URL('kaikai-chapter2-bgm-02-20260829.webm', firstWebm).href
      : '';
    const secondM4a = firstM4a
      ? new URL('kaikai-chapter2-bgm-02-20260829.m4a', firstM4a).href
      : '';
    const canPlayWebm = Boolean(audio.canPlayType('audio/webm; codecs="opus"'));
    const locale = document.documentElement.lang === 'zh-Hans' ? 'zh-Hans' : 'zh-Hant';
    const tracks = [
      {
        src: canPlayWebm ? (firstWebm || firstM4a) : (firstM4a || firstWebm),
        label: locale === 'zh-Hans' ? '原配乐' : '原配樂'
      },
      {
        src: canPlayWebm ? (secondWebm || secondM4a) : (secondM4a || secondWebm),
        label: locale === 'zh-Hans' ? '新增配乐' : '新增配樂'
      }
    ];

    if (tracks.some((track) => !track.src)) return;

    audio.dataset.dualTrackReady = 'true';
    audio.loop = false;

    let trackIndex = 0;
    let consecutiveErrors = 0;
    let pendingCanPlay = null;

    const indicator = document.createElement('span');
    indicator.className = 'audio-track-indicator';
    indicator.dataset.audioTrackIndicator = 'true';
    indicator.setAttribute('aria-live', 'polite');
    indicator.style.cssText = 'min-width:4.6rem;text-align:center;font-size:.78rem;font-weight:700;letter-spacing:.04em;opacity:.82;white-space:nowrap;';
    if (time) time.insertAdjacentElement('afterend', indicator);
    else controller?.append(indicator);

    const updateIndicator = () => {
      const track = tracks[trackIndex];
      indicator.textContent = `曲目 ${trackIndex + 1}/${tracks.length}`;
      indicator.setAttribute('aria-label', `${track.label}，${trackIndex + 1}/${tracks.length}`);
      indicator.title = locale === 'zh-Hans'
        ? `${track.label}｜两首背景音乐依序轮流播放`
        : `${track.label}｜兩首背景音樂依序輪流播放`;
      controller?.setAttribute('data-audio-track', String(trackIndex + 1));
      audio.setAttribute('aria-label', `${track.label}，${trackIndex + 1}/${tracks.length}`);
    };

    const clearPendingCanPlay = () => {
      if (!pendingCanPlay) return;
      audio.removeEventListener('canplay', pendingCanPlay);
      pendingCanPlay = null;
    };

    const startCurrentTrack = () => {
      clearPendingCanPlay();
      const playPromise = audio.play();
      if (!playPromise || typeof playPromise.then !== 'function') {
        consecutiveErrors = 0;
        return;
      }
      playPromise
        .then(() => { consecutiveErrors = 0; })
        .catch(() => undefined);
    };

    const switchTrack = (nextIndex, shouldPlay = true) => {
      clearPendingCanPlay();
      trackIndex = (nextIndex + tracks.length) % tracks.length;
      const preservedVolume = audio.volume;
      audio.src = tracks[trackIndex].src;
      audio.load();
      audio.volume = preservedVolume;
      updateIndicator();

      if (!shouldPlay) return;
      if (audio.readyState >= 3) {
        startCurrentTrack();
        return;
      }
      pendingCanPlay = startCurrentTrack;
      audio.addEventListener('canplay', pendingCanPlay, { once: true });
    };

    audio.addEventListener('ended', () => {
      consecutiveErrors = 0;
      switchTrack(trackIndex + 1, true);
    });

    audio.addEventListener('error', () => {
      clearPendingCanPlay();
      if (consecutiveErrors >= tracks.length - 1) return;
      consecutiveErrors += 1;
      switchTrack(trackIndex + 1, true);
    });

    updateIndicator();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDualTrackPlaylist, { once: true });
  } else {
    initDualTrackPlaylist();
  }
})();
