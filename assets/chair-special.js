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
  var introTimer = 0;
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
    specialIntro.hidden = true;
    specialIntro.classList.remove("is-active", "is-closing", "is-reduced");
    document.body.classList.remove("intro-playing");
    setPageInert(false);
    if (specialTitle && moveFocusToTitle) {
      specialTitle.focus({ preventScroll: true });
    }
  }

  function closeIntro() {
    if (!specialIntro || specialIntro.hidden) return;
    window.clearTimeout(introTimer);
    specialIntro.classList.remove("is-active");
    specialIntro.classList.add("is-closing");
    introTimer = window.setTimeout(finishIntro, 470);
  }

  function showIntro() {
    if (!specialIntro) return;
    window.clearTimeout(introTimer);
    specialIntro.hidden = false;
    specialIntro.classList.remove("is-active", "is-closing", "is-reduced");
    void specialIntro.offsetWidth;
    document.body.classList.add("intro-playing");
    setPageInert(true);
    specialIntro.classList.add(reducedMotion ? "is-reduced" : "is-active");
    if (introSkip) window.setTimeout(function () { introSkip.focus({ preventScroll: true }); }, 60);
    introTimer = window.setTimeout(finishIntro, reducedMotion ? 3000 : 7900);
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
  if (introReplay) introReplay.addEventListener("click", showIntro);

  /* Play on every entry or reload. Replay when the page is restored from the browser back/forward cache. */
  showIntro();
  window.addEventListener("pageshow", function (event) {
    if (event.persisted) showIntro();
  });

  function clamp(value) {
    return Math.min(Math.max(value, 0), 1);
  }

  function updateChapterTransition() {
    if (!chapterTransition) return;

    if (reducedMotion) {
      chapterTransition.style.setProperty("--ancient-opacity", ".26");
      chapterTransition.style.setProperty("--ancient-scale", "1");
      chapterTransition.style.setProperty("--modern-opacity", "1");
      chapterTransition.style.setProperty("--door-left-shift", "-104%");
      chapterTransition.style.setProperty("--door-right-shift", "104%");
      chapterTransition.style.setProperty("--door-light-width", "82vw");
      chapterTransition.style.setProperty("--door-light-opacity", ".34");
      return;
    }

    var rect = chapterTransition.getBoundingClientRect();
    var travel = Math.max(chapterTransition.offsetHeight - window.innerHeight, 1);
    var progress = clamp(-rect.top / travel);
    var age = clamp(progress / .32);
    var door = clamp((progress - .16) / .5);
    var modern = clamp((progress - .34) / .42);

    chapterTransition.style.setProperty("--ancient-opacity", (1 - modern * .82).toFixed(3));
    chapterTransition.style.setProperty("--ancient-scale", (1 + age * .055).toFixed(3));
    chapterTransition.style.setProperty("--modern-opacity", modern.toFixed(3));
    chapterTransition.style.setProperty("--door-left-shift", (-104 * door).toFixed(2) + "%");
    chapterTransition.style.setProperty("--door-right-shift", (104 * door).toFixed(2) + "%");
    chapterTransition.style.setProperty("--door-light-width", (2 + door * 80).toFixed(2) + "vw");
    chapterTransition.style.setProperty("--door-light-opacity", (.22 + door * .42).toFixed(3));
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
