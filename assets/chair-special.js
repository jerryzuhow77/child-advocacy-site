(function () {
  "use strict";

  var progress = document.querySelector(".special-progress");
  var topButton = document.querySelector(".back-to-top");
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".special-toc a[href^='#']"));
  var sections = Array.prototype.slice.call(document.querySelectorAll(".story-section[id]"));
  var chapterTransition = document.querySelector(".next-chapter-transition");
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
