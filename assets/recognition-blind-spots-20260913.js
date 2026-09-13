(function () {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const progressFill = document.querySelector(".rb-progress span");
  const replay = document.querySelector(".rb-replay");
  const hero = document.querySelector(".rb-hero");

  if (!hero || reduceMotion.matches) {
    root.classList.add("motion-reduced");
    return;
  }

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) {
    root.classList.add("motion-fallback");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  root.classList.add("motion-ready");

  const heroCopy = hero.querySelectorAll(".rb-hero-copy > *");
  const sheets = hero.querySelectorAll(".rb-evidence-sheet");
  const threads = hero.querySelectorAll(".rb-thread");
  const seals = hero.querySelectorAll(".rb-clay-mark");
  const leaves = hero.querySelectorAll(".rb-leaf");
  const inkBloom = document.createElement("span");
  inkBloom.className = "rb-ink-bloom";
  hero.appendChild(inkBloom);
  let intro;

  function playIntro() {
    if (intro) intro.kill();
    gsap.set(heroCopy, { clearProps: "opacity,visibility,transform,filter" });
    gsap.set([sheets, threads, seals, leaves], { clearProps: "opacity,visibility,transform" });

    intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
      .fromTo(heroCopy, { y: 30, autoAlpha: 0, filter: "blur(5px)" }, {
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 0.9,
        stagger: 0.1,
        clearProps: "opacity,visibility,transform,filter"
      }, 0.08)
      .fromTo(sheets, { y: 70, rotation: function (index) { return index % 2 ? 16 : -18; }, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 1.15,
        stagger: 0.15,
        clearProps: "opacity,visibility,transform"
      }, 0.2)
      .fromTo(threads, { scaleX: 0, autoAlpha: 0 }, {
        scaleX: 1,
        autoAlpha: 1,
        duration: 0.85,
        stagger: 0.16,
        clearProps: "opacity,visibility,transform"
      }, 0.85)
      .fromTo(seals, { scale: 0.55, rotation: -20, autoAlpha: 0 }, {
        scale: 1,
        rotation: function (index) { return index ? 5 : -8; },
        autoAlpha: 1,
        duration: 0.72,
        stagger: 0.16,
        clearProps: "opacity,visibility,transform"
      }, 1.05)
      .fromTo(leaves, { y: -30, rotation: -35, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 1.1,
        stagger: 0.12,
        clearProps: "opacity,visibility,transform"
      }, 0.5)
      .fromTo(inkBloom, { scale: 0.25, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.8 }, 0.15);
  }

  playIntro();
  if (replay) replay.addEventListener("click", playIntro);

  gsap.utils.toArray(".rb-reveal").forEach(function (element) {
    gsap.fromTo(element, { y: 28, autoAlpha: 0 }, {
      y: 0,
      autoAlpha: 1,
      duration: 0.82,
      ease: "power2.out",
      clearProps: "opacity,visibility,transform",
      scrollTrigger: { trigger: element, start: "top 88%", once: true }
    });
  });

  gsap.utils.toArray("mark.rb-highlight").forEach(function (mark) {
    ScrollTrigger.create({
      trigger: mark,
      start: "top 86%",
      once: true,
      onEnter: function () { mark.classList.add("is-drawn"); }
    });
  });

  gsap.utils.toArray(".rb-hero-questions span").forEach(function (item, index) {
    gsap.fromTo(item, { y: 24, rotation: index % 2 ? 1.5 : -1.5, autoAlpha: 0 }, { y: 0, rotation: 0, autoAlpha: 1, duration: 0.7, delay: index * 0.08, clearProps: "opacity,visibility,transform" });
  });

  gsap.utils.toArray(".rb-witness-matrix, .rb-crosscheck-wrap, .rb-cannot-infer").forEach(function (panel) {
    gsap.fromTo(panel, { y: 36, clipPath: "inset(0 100% 0 0)", autoAlpha: 0 }, { y: 0, clipPath: "inset(0 0% 0 0)", autoAlpha: 1, duration: 1, ease: "power3.out", clearProps: "opacity,visibility,transform,clipPath", scrollTrigger: { trigger: panel, start: "top 86%", once: true } });
  });

  gsap.utils.toArray(".rb-debate-card").forEach(function (card, index) {
    gsap.fromTo(card, { y: 44, rotation: index % 2 ? 1.2 : -1.2, autoAlpha: 0 }, {
      y: 0,
      rotation: 0,
      autoAlpha: 1,
      duration: 0.82,
      delay: index * 0.08,
      ease: "back.out(1.25)",
      clearProps: "opacity,visibility,transform",
      scrollTrigger: { trigger: card, start: "top 88%", once: true }
    });
  });

  gsap.utils.toArray(".rb-quote-ribbon blockquote").forEach(function (quote, index) {
    gsap.fromTo(quote, { y: 30, rotation: index % 2 ? 1.4 : -1.4, autoAlpha: 0 }, {
      y: 0,
      rotation: 0,
      autoAlpha: 1,
      duration: 0.72,
      delay: (index % 2) * 0.09,
      ease: "back.out(1.2)",
      clearProps: "opacity,visibility,transform",
      scrollTrigger: { trigger: quote, start: "top 89%", once: true }
    });
  });

  gsap.utils.toArray(".rb-answer-grid, .rb-blind-grid, .rb-finding-grid, .rb-evidence-levels, .rb-related-grid").forEach(function (group) {
    const cards = group.children;
    gsap.fromTo(cards, { y: 38, rotation: function (index) { return index % 2 ? 1.1 : -1.1; }, autoAlpha: 0 }, {
      y: 0, rotation: 0, autoAlpha: 1, duration: .78, stagger: .09, ease: "back.out(1.16)",
      clearProps: "opacity,visibility,transform", scrollTrigger: { trigger: group, start: "top 86%", once: true }
    });
  });

  gsap.utils.toArray(".rb-section").forEach(function (section, index) {
    const heading = section.querySelector("h2, .rb-archive-subtitle");
    if (!heading) return;
    gsap.fromTo(heading, { x: index % 2 ? 28 : -28, filter: "blur(4px)" }, {
      x: 0, filter: "blur(0px)", duration: .9, ease: "power3.out",
      clearProps: "transform,filter", scrollTrigger: { trigger: heading, start: "top 88%", once: true }
    });
  });

  gsap.utils.toArray(".rb-witness-records summary, .rb-chen-records summary, .rb-locale-dropdown > summary").forEach(function (summary) {
    summary.addEventListener("pointerenter", function () { gsap.to(summary, { x: 3, duration: 0.22, ease: "power2.out" }); });
    summary.addEventListener("pointerleave", function () { gsap.to(summary, { x: 0, duration: 0.3, ease: "power2.out", clearProps: "transform" }); });
  });

  gsap.utils.toArray(".rb-witness-records > details, .rb-chen-records > details").forEach(function (panel) {
    panel.addEventListener("toggle", function () {
      if (!panel.open) return;
      const targets = panel.querySelectorAll(".rb-excerpts blockquote, p");
      gsap.fromTo(targets, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.48, stagger: 0.055, clearProps: "opacity,visibility,transform" });
      panel.querySelectorAll("mark.rb-highlight").forEach(function (mark) { mark.classList.add("is-drawn"); });
      ScrollTrigger.refresh();
    });
  });

  gsap.to(leaves, { y: 18, rotation: 18, duration: 3.2, stagger: 0.25, repeat: -1, yoyo: true, ease: "sine.inOut" });

  gsap.to(".rb-sheet-1", {
    yPercent: -8,
    ease: "none",
    scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.8 }
  });
  gsap.to(".rb-sheet-2", {
    yPercent: 7,
    ease: "none",
    scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.8 }
  });

  if (progressFill) {
    gsap.to(progressFill, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.15 }
    });
  }

  function pauseForPrint() {
    if (intro) intro.pause();
    ScrollTrigger.getAll().forEach(function (trigger) { trigger.disable(false); });
  }

  function resumeAfterPrint() {
    ScrollTrigger.getAll().forEach(function (trigger) { trigger.enable(false); });
    ScrollTrigger.refresh();
  }

  window.addEventListener("beforeprint", pauseForPrint);
  window.addEventListener("afterprint", resumeAfterPrint);
}());
