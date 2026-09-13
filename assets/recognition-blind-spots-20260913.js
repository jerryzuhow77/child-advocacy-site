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
      }, 0.5);
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
