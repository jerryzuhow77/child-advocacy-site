/* global-protection-jungein-prologue-hd-audio-20260829 */
(() => {
  "use strict";

  const PATCH_ID = "global-protection-jungein-prologue-hd-audio-20260829";
  const TARGET_PATH = "/historical-cases/korea/jungein";
  const VIDEO_SRC = "/jungein-prologue-hd-20260829.mp4";
  const POSTER_SRC = "/jungein-prologue-hd-poster-20260829.webp";

  if (window.__JUNGEIN_PROLOGUE_HD_AUDIO_20260829__) return;
  window.__JUNGEIN_PROLOGUE_HD_AUDIO_20260829__ = true;

  const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";
  if (normalizedPath !== TARGET_PATH) return;

  const params = new URLSearchParams(window.location.search);
  if (params.get("skipIntro") === "1" || params.get("intro") === "0") return;

  const start = () => {
    if (document.querySelector(`[data-jungein-video-prologue="${PATCH_ID}"]`)) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const forcePlayback = params.get("intro") === "1";
    const body = document.body;
    const pageMain = document.querySelector("body > main");
    const score = pageMain?.querySelector("audio");
    const musicControls = document.querySelector("#music-controls");
    const previousOverflow = body.style.overflow;
    const previousTouchAction = body.style.touchAction;

    const overlay = document.createElement("section");
    overlay.className = "jungein-video-prologue";
    overlay.dataset.jungeinVideoPrologue = PATCH_ID;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "jungein-video-prologue-title");
    overlay.setAttribute("aria-describedby", "jungein-video-prologue-status");
    overlay.innerHTML = `
      <div class="jungein-video-prologue__stage">
        <video class="jungein-video-prologue__video"
          src="${VIDEO_SRC}" poster="${POSTER_SRC}" preload="auto" autoplay
          playsinline webkit-playsinline aria-label="韓國鄭仁案高清序幕影片"></video>
        <div class="jungein-video-prologue__shade" aria-hidden="true"></div>
        <div class="jungein-video-prologue__masthead">
          <p>高清序幕・HD PROLOGUE</p>
          <h2 id="jungein-video-prologue-title">門沒有打開</h2>
          <span>문은 열리지 않았다</span>
        </div>
        <button class="jungein-video-prologue__skip" type="button">略過序幕</button>
        <button class="jungein-video-prologue__start" type="button" hidden>
          <span aria-hidden="true">♫</span><b>開啟聲音</b><small>畫面已開始播放</small>
        </button>
        <div class="jungein-video-prologue__footer">
          <div class="jungein-video-prologue__timeline" aria-hidden="true"><i></i></div>
          <p id="jungein-video-prologue-status" aria-live="polite">高清序幕載入中</p>
          <button class="jungein-video-prologue__sound" type="button" aria-pressed="false">聲音：開</button>
        </div>
        <p class="jungein-video-prologue__warning">內容警示｜本頁涉及兒童虐待與死亡；影片不呈現施虐過程或真實傷勢。</p>
      </div>`;

    const video = overlay.querySelector("video");
    const skipButton = overlay.querySelector(".jungein-video-prologue__skip");
    const startButton = overlay.querySelector(".jungein-video-prologue__start");
    const soundButton = overlay.querySelector(".jungein-video-prologue__sound");
    const progress = overlay.querySelector(".jungein-video-prologue__timeline i");
    const status = overlay.querySelector("#jungein-video-prologue-status");
    const startTitle = startButton.querySelector("b");
    const startNote = startButton.querySelector("small");

    let dismissed = false;
    let playbackStarted = false;
    let userMuted = false;
    let scoreStarted = false;
    let previousMainInert = false;
    let previousMainAriaHidden = null;

    const setStatus = (text) => { status.textContent = text; };
    const syncSound = () => {
      const muted = video.muted || video.volume === 0;
      soundButton.textContent = muted ? "聲音：關" : "聲音：開";
      soundButton.setAttribute("aria-pressed", String(muted));
    };
    const revealStart = (message, title = "播放序幕", note = "影片含聲音") => {
      startTitle.textContent = title;
      startNote.textContent = note;
      startButton.hidden = false;
      overlay.classList.add("is-awaiting-play");
      setStatus(message);
    };
    const hideStart = () => {
      startButton.hidden = true;
      overlay.classList.remove("is-awaiting-play", "is-autoplay-muted");
    };

    const restorePage = () => {
      body.classList.remove("jungein-video-prologue-open");
      body.style.overflow = previousOverflow;
      body.style.touchAction = previousTouchAction;
      if (pageMain) {
        pageMain.inert = previousMainInert;
        if (previousMainAriaHidden === null) pageMain.removeAttribute("aria-hidden");
        else pageMain.setAttribute("aria-hidden", previousMainAriaHidden);
      }
    };

    const startPageScore = async (fade = true) => {
      if (!score || scoreStarted || userMuted) return;
      score.preload = "auto";
      const targetVolume = Math.max(0.05, Math.min(1, Number(score.volume) || 0.55));
      if (fade) score.volume = 0;
      try {
        await score.play();
        scoreStarted = true;
        musicControls?.classList.remove("autoplay-waiting");
        if (fade) {
          const startedAt = performance.now();
          const step = (now) => {
            const ratio = Math.min(1, (now - startedAt) / 900);
            score.volume = targetVolume * ratio;
            if (ratio < 1 && !score.paused) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      } catch (_error) {
        if (fade) score.volume = targetVolume;
        musicControls?.classList.add("autoplay-waiting");
      }
    };

    const dismiss = (reason, returnFocus = false) => {
      if (dismissed) return;
      dismissed = true;
      video.pause();
      overlay.dataset.dismissReason = reason;
      overlay.classList.add("is-closing");
      restorePage();
      void startPageScore(reason !== "skipped");
      window.setTimeout(() => {
        overlay.remove();
        if (returnFocus) {
          document.querySelector(".hero-actions a, .topbar .brand, #top a")
            ?.focus?.({ preventScroll: true });
        }
      }, reduceMotion ? 0 : 460);
    };

    const enableSound = async () => {
      if (dismissed) return;
      userMuted = false;
      video.muted = false;
      video.volume = 1;
      syncSound();
      try {
        if (video.paused) await video.play();
        hideStart();
        overlay.classList.add("is-playing");
        setStatus("高清序幕播放中・背景音樂已開啟");
      } catch (_error) {
        revealStart("點選播放，開始高清序幕", "播放序幕", "影片含聲音");
      }
    };

    const attemptPlayback = async () => {
      if (dismissed) return;
      video.muted = false;
      syncSound();
      try {
        await video.play();
        playbackStarted = true;
        hideStart();
        overlay.classList.add("is-playing");
        setStatus("高清序幕播放中・背景音樂已開啟");
      } catch (_audibleError) {
        try {
          video.muted = true;
          await video.play();
          playbackStarted = true;
          overlay.classList.add("is-playing", "is-autoplay-muted");
          revealStart("畫面已自動播放；點一下開啟背景音樂", "開啟聲音", "瀏覽器要求一次互動");
          syncSound();
        } catch (_mutedError) {
          revealStart(
            reduceMotion && !forcePlayback ? "已依減少動態設定暫停自動播放" : "瀏覽器已暫停自動播放",
            "播放序幕", "影片含聲音"
          );
        }
      }
    };

    const registerActivation = (event) => {
      if (event.type === "keydown" && ["Tab", "Shift", "Control", "Alt", "Meta"].includes(event.key)) return;
      if (!dismissed && video.muted && !userMuted) void enableSound();
    };
    for (const type of ["pointerdown", "touchstart", "keydown"]) {
      document.addEventListener(type, registerActivation, {
        capture: true, once: true, passive: type !== "keydown"
      });
    }

    skipButton.addEventListener("click", () => dismiss("skipped", true));
    startButton.addEventListener("click", () => void enableSound());
    soundButton.addEventListener("click", () => {
      if (video.muted) void enableSound();
      else {
        userMuted = true;
        video.muted = true;
        overlay.classList.add("is-autoplay-muted");
        revealStart("畫面持續播放；點一下重新開啟聲音", "開啟聲音", "背景音樂目前靜音");
        syncSound();
      }
    });

    video.addEventListener("loadedmetadata", () => {
      if (!playbackStarted) setStatus(`高清序幕約 ${Math.ceil(video.duration || 15)} 秒`);
    });
    video.addEventListener("playing", () => {
      playbackStarted = true;
      overlay.classList.add("is-playing");
      if (!video.muted) {
        hideStart();
        setStatus("高清序幕播放中・背景音樂已開啟");
      }
    });
    video.addEventListener("pause", () => {
      if (!dismissed && !video.ended && playbackStarted) setStatus("高清序幕已暫停");
    });
    video.addEventListener("timeupdate", () => {
      const ratio = video.duration ? Math.min(1, video.currentTime / video.duration) : 0;
      progress.style.transform = `scaleX(${ratio})`;
      const remaining = video.duration - video.currentTime;
      if (!video.muted && remaining > 0 && remaining <= 1.1) {
        video.volume = Math.max(0, remaining / 1.1);
        void startPageScore(true);
      }
    });
    video.addEventListener("ended", () => dismiss("ended"));
    video.addEventListener("error", () => {
      overlay.classList.add("has-error");
      revealStart("影片暫時無法播放，可略過並閱讀完整專題", "影片載入失敗", "請略過並閱讀專題");
      startButton.disabled = true;
    });

    overlay.addEventListener("keydown", (event) => {
      if (dismissed) return;
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss("escape", true);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [skipButton, startButton, soundButton].filter(
        (element) => !element.hidden && !element.disabled
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    });

    window.addEventListener("pagehide", restorePage, { once: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && !video.paused) video.pause();
    });

    if (score) {
      score.preload = "auto";
      if (!score.paused) score.pause();
    }
    if ("disablePictureInPicture" in video) video.disablePictureInPicture = true;
    video.controls = false;
    video.autoplay = true;
    video.muted = false;
    video.volume = 1;

    if (pageMain) {
      previousMainInert = Boolean(pageMain.inert);
      previousMainAriaHidden = pageMain.getAttribute("aria-hidden");
      pageMain.inert = true;
      pageMain.setAttribute("aria-hidden", "true");
    }
    body.classList.add("jungein-video-prologue-open");
    body.style.overflow = "hidden";
    body.style.touchAction = "none";
    body.appendChild(overlay);
    syncSound();
    skipButton.focus({ preventScroll: true });

    if (reduceMotion && !forcePlayback) {
      revealStart("已依減少動態設定暫停自動播放", "播放序幕", "影片含聲音");
    } else {
      window.setTimeout(() => void attemptPlayback(), 40);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
