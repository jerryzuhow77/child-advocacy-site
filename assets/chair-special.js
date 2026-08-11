(function () {
  "use strict";

  var progress = document.querySelector(".special-progress");
  var topButton = document.querySelector(".back-to-top");
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".special-toc a[href^='#']"));
  var sections = Array.prototype.slice.call(document.querySelectorAll(".story-section[id]"));
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
