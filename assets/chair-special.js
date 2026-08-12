(function () {
  "use strict";

  var progress = document.querySelector(".special-progress");
  var topButton = document.querySelector(".back-to-top");
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".special-toc a[href^='#']"));
  var sections = Array.prototype.slice.call(document.querySelectorAll(".story-section[id]"));
  var chapterTransition = document.querySelector(".next-chapter-transition");
  var specialIntro = document.querySelector("#specialIntro");
  var introSkip = document.querySelector("#introSkip");
  var introReplay = document.querySelector("#introReplay");
  var specialTitle = document.querySelector("#specialTitle");
  var chapterEnter = document.querySelector("#chapterEnter");
  var chapterSkip = document.querySelector("#chapterSkip");
  var chapterContent = document.querySelector("#chapterOneContent");
  var chapterHeading = document.querySelector("#chapterOneHeading");
  var introTimer = 0;
  var introFocusFrame = 0;
  var introReturnFocus = null;
  var introDuration = 10100;
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setPageInert(isInert) {
    var regions = document.querySelectorAll("body > header, body > main, body > footer, .back-to-top");
    regions.forEach(function (region) {
      if (isInert) {
        region.setAttribute("inert", "");
        region.setAttribute("aria-hidden", "true");
      } else {
        region.removeAttribute("inert");
        region.removeAttribute("aria-hidden");
      }
    });
  }

  function finishIntro() {
    if (!specialIntro) return;
    var moveFocusToTitle = specialIntro.contains(document.activeElement);
    window.clearTimeout(introTimer);
    window.cancelAnimationFrame(introFocusFrame);
    specialIntro.hidden = true;
    specialIntro.classList.remove("is-active", "is-closing", "is-reduced");
    document.body.classList.remove("intro-playing");
    setPageInert(false);
    if (moveFocusToTitle) {
      if (introReturnFocus && document.contains(introReturnFocus)) {
        introReturnFocus.focus({ preventScroll: true });
      } else if (specialTitle) {
        specialTitle.focus({ preventScroll: true });
      }
    }
    introReturnFocus = null;
  }

  function closeIntro() {
    if (!specialIntro || specialIntro.hidden) return;
    window.clearTimeout(introTimer);
    window.cancelAnimationFrame(introFocusFrame);
    if (reducedMotion) {
      finishIntro();
      return;
    }
    specialIntro.classList.remove("is-active");
    specialIntro.classList.add("is-closing");
    introTimer = window.setTimeout(finishIntro, 470);
  }

  function showIntro(returnFocus) {
    if (!specialIntro) return;
    window.clearTimeout(introTimer);
    window.cancelAnimationFrame(introFocusFrame);
    introReturnFocus = returnFocus || null;
    specialIntro.hidden = false;
    specialIntro.classList.remove("is-active", "is-closing", "is-reduced");
    void specialIntro.offsetWidth;
    document.body.classList.add("intro-playing");
    setPageInert(true);
    specialIntro.classList.add(reducedMotion ? "is-reduced" : "is-active");
    if (introSkip) {
      introFocusFrame = window.requestAnimationFrame(function () {
        if (!specialIntro.hidden) introSkip.focus({ preventScroll: true });
      });
    }
    introTimer = window.setTimeout(finishIntro, reducedMotion ? 3000 : introDuration);
  }

  if (specialIntro) {
    specialIntro.addEventListener("animationend", function (event) {
      if (event.target === specialIntro && event.animationName === "intro-overlay-exit") finishIntro();
    });

    specialIntro.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeIntro();
      } else if (event.key === "Tab" && introSkip) {
        event.preventDefault();
        introSkip.focus();
      }
    });
  }

  if (introSkip) introSkip.addEventListener("click", closeIntro);
  if (introReplay) introReplay.addEventListener("click", function () { showIntro(introReplay); });

  /* Play on every entry or reload. Replay when the page is restored from the browser back/forward cache. */
  showIntro();
  window.addEventListener("pageshow", function (event) {
    if (event.persisted) showIntro();
  });

  function clamp(value) {
    return Math.min(Math.max(value, 0), 1);
  }

  function phase(value, start, end) {
    return clamp((value - start) / Math.max(end - start, .001));
  }

  function pulse(value, start, peak, end) {
    if (value <= peak) return phase(value, start, peak);
    return 1 - phase(value, peak, end);
  }

  function setChapterButtonReady(isReady) {
    if (!chapterEnter) return;
    chapterEnter.disabled = !isReady;
    chapterEnter.setAttribute("aria-disabled", isReady ? "false" : "true");
  }

  function openChapter(options) {
    if (!chapterContent) return;
    var settings = options || {};
    chapterContent.hidden = false;
    chapterContent.removeAttribute("inert");
    chapterContent.classList.add("is-entering");
    if (chapterTransition) chapterTransition.classList.add("is-complete");
    if (chapterEnter) {
      chapterEnter.setAttribute("aria-expanded", "true");
      setChapterButtonReady(true);
    }

    if (settings.updateHash !== false && window.history && window.history.replaceState) {
      window.history.replaceState(null, "", "#chapterOneContent");
    }

    if (settings.moveFocus === false) return;
    window.requestAnimationFrame(function () {
      chapterContent.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      if (chapterHeading) chapterHeading.focus({ preventScroll: true });
    });
  }

  function chapterHashIsActive() {
    return window.location.hash === "#chapterOneContent" || window.location.hash === "#chapterOneHeading";
  }

  if (chapterContent) {
    if (chapterHashIsActive()) openChapter({ moveFocus: false, updateHash: false });
    else chapterContent.setAttribute("inert", "");
  }

  if (chapterEnter) chapterEnter.addEventListener("click", function () { openChapter(); });
  if (chapterSkip) chapterSkip.addEventListener("click", function () { openChapter(); });
  window.addEventListener("hashchange", function () {
    if (chapterHashIsActive()) openChapter({ moveFocus: false, updateHash: false });
  });

  function updateChapterTransition() {
    if (!chapterTransition) return;

    if (reducedMotion) {
      chapterTransition.style.setProperty("--ancient-opacity", ".16");
      chapterTransition.style.setProperty("--ancient-scale", "1");
      chapterTransition.style.setProperty("--modern-opacity", "1");
      chapterTransition.style.setProperty("--door-left-shift", "-104%");
      chapterTransition.style.setProperty("--door-right-shift", "104%");
      chapterTransition.style.setProperty("--door-light-width", "82vw");
      chapterTransition.style.setProperty("--door-light-opacity", ".34");
      chapterTransition.style.setProperty("--last-line-opacity", "0");
      chapterTransition.style.setProperty("--chapter-opacity", "1");
      chapterTransition.style.setProperty("--chapter-shift", "0px");
      chapterTransition.style.setProperty("--cta-opacity", "1");
      chapterTransition.style.setProperty("--cue-opacity", "0");
      setChapterButtonReady(true);
      return;
    }

    var rect = chapterTransition.getBoundingClientRect();
    var travel = Math.max(chapterTransition.offsetHeight - window.innerHeight, 1);
    var transitionProgress = clamp(-rect.top / travel);
    var sunlight = .16 + pulse(transitionProgress, .01, .065, .13) * .62 + pulse(transitionProgress, .15, .2, .26) * .28;
    var rain = pulse(transitionProgress, .075, .135, .2) * .72;
    var leaves = pulse(transitionProgress, .145, .215, .29) * .7;
    var ink = phase(transitionProgress, .2, .39);
    var push = phase(transitionProgress, .34, .56);
    var door = phase(transitionProgress, .5, .72);
    var modern = phase(transitionProgress, .59, .8);
    var morph = pulse(transitionProgress, .55, .7, .86);
    var morphProgress = phase(transitionProgress, .57, .8);
    var title = phase(transitionProgress, .76, .91);
    var cta = phase(transitionProgress, .89, .99);
    var lastLine = 1 - phase(transitionProgress, .1, .24);
    var cue = 1 - phase(transitionProgress, .08, .34);
    var chapterIsOpen = chapterContent && !chapterContent.hidden;

    chapterTransition.style.setProperty("--sunlight-opacity", Math.min(sunlight, .9).toFixed(3));
    chapterTransition.style.setProperty("--rain-shadow-opacity", rain.toFixed(3));
    chapterTransition.style.setProperty("--leaf-shadow-opacity", leaves.toFixed(3));
    chapterTransition.style.setProperty("--ink-opacity", ink.toFixed(3));
    chapterTransition.style.setProperty("--ancient-window-opacity", (.52 - ink * .34).toFixed(3));
    chapterTransition.style.setProperty("--ancient-chair-opacity", (.54 - ink * .36).toFixed(3));
    chapterTransition.style.setProperty("--time-rotate", (transitionProgress * 230).toFixed(2) + "deg");
    chapterTransition.style.setProperty("--leaf-shift-x", (transitionProgress * 7).toFixed(2) + "vw");
    chapterTransition.style.setProperty("--leaf-shift-y", (transitionProgress * 5).toFixed(2) + "vh");
    chapterTransition.style.setProperty("--ancient-opacity", (1 - modern * .88).toFixed(3));
    chapterTransition.style.setProperty("--ancient-scale", (1 + push * .08).toFixed(3));
    chapterTransition.style.setProperty("--modern-opacity", modern.toFixed(3));
    chapterTransition.style.setProperty("--door-left-shift", (-104 * door).toFixed(2) + "%");
    chapterTransition.style.setProperty("--door-right-shift", (104 * door).toFixed(2) + "%");
    chapterTransition.style.setProperty("--door-light-width", "calc(2px + " + (door * 86).toFixed(2) + "vw)");
    chapterTransition.style.setProperty("--door-light-opacity", (.18 + door * .52).toFixed(3));
    chapterTransition.style.setProperty("--morph-opacity", morph.toFixed(3));
    chapterTransition.style.setProperty("--morph-progress", morphProgress.toFixed(3));
    chapterTransition.style.setProperty("--morph-shift", (-2 * morphProgress).toFixed(3) + "vw");
    chapterTransition.style.setProperty("--morph-scale-x", (1 + morphProgress * 2.5).toFixed(3));
    chapterTransition.style.setProperty("--morph-scale-y", (1 + morphProgress * .42).toFixed(3));
    chapterTransition.style.setProperty("--last-line-opacity", lastLine.toFixed(3));
    chapterTransition.style.setProperty("--last-line-shift", (-12 * phase(transitionProgress, .1, .24)).toFixed(2) + "px");
    chapterTransition.style.setProperty("--chapter-opacity", title.toFixed(3));
    chapterTransition.style.setProperty("--chapter-shift", (18 * (1 - title)).toFixed(2) + "px");
    chapterTransition.style.setProperty("--cta-opacity", cta.toFixed(3));
    chapterTransition.style.setProperty("--cta-shift", (12 * (1 - cta)).toFixed(2) + "px");
    chapterTransition.style.setProperty("--cue-opacity", cue.toFixed(3));
    chapterTransition.style.setProperty("--paper-grain-opacity", (.18 - modern * .15).toFixed(3));
    setChapterButtonReady(Boolean(chapterIsOpen || transitionProgress >= .965));
  }

  function updateScrollUI() {
    var doc = document.documentElement;
    var scrollable = Math.max(doc.scrollHeight - window.innerHeight, 1);
    var ratio = Math.min(Math.max(window.scrollY / scrollable, 0), 1);

    if (progress) progress.style.width = (ratio * 100).toFixed(2) + "%";
    if (topButton) topButton.classList.toggle("is-visible", window.scrollY > 720);

    var currentId = "";
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= 180) currentId = section.id;
    });
    tocLinks.forEach(function (link) {
      var active = link.getAttribute("href") === "#" + currentId;
      link.classList.toggle("is-current", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });

    updateChapterTransition();
  }

  if (topButton) {
    topButton.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });
  }

  var revealItems = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    revealItems.forEach(function (item) { revealObserver.observe(item); });
  }

  var ticking = false;
  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      updateScrollUI();
      ticking = false;
    });
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  updateScrollUI();
}());
