(function () {
  "use strict";

  const root = document.documentElement;
  const main = document.querySelector("#main");
  const hero = document.querySelector(".hero");
  const heroArt = hero && hero.querySelector(".hero-art");
  const heroCopy = hero && hero.querySelector(".hero-copy");
  const paper = document.querySelector(".paper");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!main || !hero || !heroArt || !heroCopy || !paper) return;

  if (reduceMotion.matches) {
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

  const lang = (root.lang || "zh-Hant").toLowerCase();
  const labels = lang.startsWith("zh-hans")
    ? { skip: "略过动画", replay: "重播动画" }
    : lang.startsWith("en")
      ? { skip: "Skip animation", replay: "Replay animation" }
      : lang.startsWith("ja")
        ? { skip: "アニメーションをスキップ", replay: "アニメーションを再生" }
        : { skip: "略過動畫", replay: "重播動畫" };

  const stage = document.createElement("div");
  stage.className = "hero-motion-stage";
  stage.setAttribute("aria-hidden", "true");
  stage.innerHTML = [
    '<span class="hero-atmosphere"></span>',
    '<span class="hero-paper-veil hero-paper-veil--left"></span>',
    '<span class="hero-paper-veil hero-paper-veil--right"></span>',
    '<span class="hero-door-line hero-door-line--one"></span>',
    '<span class="hero-door-line hero-door-line--two"></span>',
    '<span class="hero-door-line hero-door-line--three"></span>',
    '<span class="hero-warm-light"></span>'
  ].join("");
  heroArt.insertAdjacentElement("afterend", stage);

  const controls = document.createElement("div");
  controls.className = "motion-controls";

  const skipButton = document.createElement("button");
  skipButton.type = "button";
  skipButton.className = "motion-control motion-control--skip";
  skipButton.textContent = labels.skip;
  skipButton.setAttribute("aria-label", labels.skip);

  const replayButton = document.createElement("button");
  replayButton.type = "button";
  replayButton.className = "motion-control motion-control--replay";
  replayButton.textContent = labels.replay;
  replayButton.setAttribute("aria-label", labels.replay);

  controls.append(skipButton, replayButton);
  hero.appendChild(controls);

  const progress = document.createElement("div");
  progress.className = "story-progress";
  progress.setAttribute("aria-hidden", "true");
  progress.innerHTML = '<span class="story-progress__fill"></span>';
  document.body.appendChild(progress);

  const progressFill = progress.firstElementChild;
  const atmosphere = stage.querySelector(".hero-atmosphere");
  const warmLight = stage.querySelector(".hero-warm-light");
  const veils = stage.querySelectorAll(".hero-paper-veil");
  const doorLines = stage.querySelectorAll(".hero-door-line");
  const heroCopyItems = Array.from(heroCopy.children);
  const motionTargets = new Set([heroArt, heroCopy, paper, stage, atmosphere, warmLight]);
  let introTimeline = null;
  let ambientTween = null;
  let scrollContext = null;
  let printPaused = false;
  let introWasPlayingBeforePrint = false;

  function remember(targets) {
    gsap.utils.toArray(targets).forEach((target) => motionTargets.add(target));
    return targets;
  }

  remember(heroCopyItems);
  remember(veils);
  remember(doorLines);

  function startAmbientLight() {
    if (ambientTween) ambientTween.kill();
    ambientTween = gsap.to(warmLight, {
      scale: 1.08,
      autoAlpha: 0.78,
      duration: 5.4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });
  }

  function playIntro() {
    if (introTimeline) introTimeline.kill();
    if (ambientTween) ambientTween.kill();
    root.classList.remove("motion-intro-complete");

    gsap.set(stage, { autoAlpha: 1 });
    gsap.set(heroCopyItems, { clearProps: "opacity,visibility,transform,filter" });
    gsap.set([heroArt, atmosphere, warmLight, ...veils, ...doorLines], {
      clearProps: "opacity,visibility,transform,filter"
    });

    introTimeline = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: function () {
        root.classList.add("motion-intro-complete");
        startAmbientLight();
      }
    });

    introTimeline
      .fromTo(
        heroArt,
        { scale: 1.095, filter: "saturate(0.8) brightness(0.82)" },
        { scale: 1, filter: "saturate(1) brightness(1)", duration: 2.25 },
        0
      )
      .fromTo(
        atmosphere,
        { autoAlpha: 0, scale: 0.86 },
        { autoAlpha: 0.7, scale: 1, duration: 2.1 },
        0.08
      )
      .fromTo(
        stage.querySelector(".hero-paper-veil--left"),
        { xPercent: -42, autoAlpha: 0.76 },
        { xPercent: -5, autoAlpha: 0.28, duration: 1.9 },
        0
      )
      .fromTo(
        stage.querySelector(".hero-paper-veil--right"),
        { xPercent: 42, autoAlpha: 0.68 },
        { xPercent: 5, autoAlpha: 0.24, duration: 1.9 },
        0.06
      )
      .fromTo(
        doorLines,
        { xPercent: 14, autoAlpha: 0, scaleY: 0.9 },
        { xPercent: 0, autoAlpha: 0.68, scaleY: 1, duration: 1.35, stagger: 0.12 },
        0.34
      )
      .fromTo(
        warmLight,
        { autoAlpha: 0, scale: 0.72 },
        { autoAlpha: 0.64, scale: 1, duration: 1.8 },
        0.52
      )
      .fromTo(
        heroCopyItems,
        { y: 30, autoAlpha: 0, filter: "blur(5px)" },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.95,
          stagger: 0.14,
          clearProps: "opacity,visibility,transform,filter"
        },
        0.34
      );
  }

  function skipIntro() {
    if (!introTimeline) return;
    introTimeline.progress(1).pause();
  }

  skipButton.addEventListener("click", skipIntro);
  replayButton.addEventListener("click", playIntro);

  function revealChildren(container, options) {
    const items = Array.from(container.children).filter((child) => child.nodeType === 1);
    if (!items.length) return;

    remember(items);
    gsap.fromTo(
      items,
      {
        y: options && options.y != null ? options.y : 30,
        x: options && options.x != null ? options.x : 0,
        autoAlpha: 0.01
      },
      {
        y: 0,
        x: 0,
        autoAlpha: 1,
        duration: options && options.duration ? options.duration : 0.88,
        stagger: options && options.stagger ? options.stagger : 0.09,
        ease: "power2.out",
        clearProps: "opacity,visibility,transform",
        scrollTrigger: {
          trigger: container,
          start: options && options.start ? options.start : "top 84%",
          once: true
        }
      }
    );
  }

  function buildScrollMotion() {
    const isMobile = window.matchMedia("(max-width: 780px)").matches;
    const sections = gsap.utils.toArray(".paper > section");
    const labelsOnPage = gsap.utils.toArray(".paper .section-label, .paper .subsection-label");
    const highlights = gsap.utils.toArray(".paper .fluorescent");
    const timeline = document.querySelector(".timeline");

    remember(sections);
    remember(labelsOnPage);
    remember(highlights);

    gsap.to(heroArt, {
      yPercent: isMobile ? 3.5 : 7,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 0.8
      }
    });

    gsap.to(heroCopy, {
      yPercent: isMobile ? -3 : -8,
      autoAlpha: 0.38,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "35% top",
        end: "bottom top",
        scrub: 0.7
      }
    });

    gsap.to(stage, {
      yPercent: isMobile ? 2 : 5,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });

    gsap.to(paper, {
      "--paper-shape-y1": isMobile ? "42px" : "118px",
      "--paper-shape-y2": isMobile ? "-34px" : "-92px",
      ease: "none",
      scrollTrigger: {
        trigger: paper,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.1
      }
    });

    sections.forEach(function (section, index) {
      const lead = Array.from(section.children).filter(function (child) {
        return child.matches(".section-label, h2, .intro");
      });

      if (lead.length) {
        remember(lead);
        gsap.fromTo(
          lead,
          {
            x: isMobile ? 0 : index % 2 === 0 ? -24 : 24,
            y: isMobile ? 24 : 34,
            autoAlpha: 0.01
          },
          {
            x: 0,
            y: 0,
            autoAlpha: 1,
            duration: 1,
            stagger: 0.12,
            ease: "power2.out",
            clearProps: "opacity,visibility,transform",
            scrollTrigger: {
              trigger: section,
              start: "top 86%",
              once: true
            }
          }
        );
      }

      ScrollTrigger.create({
        trigger: section,
        start: "top 58%",
        end: "bottom 42%",
        toggleClass: { targets: section, className: "is-motion-active" }
      });
    });

    labelsOnPage.forEach(function (label) {
      gsap.fromTo(
        label,
        { "--motion-label-line": 0 },
        {
          "--motion-label-line": 1,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: label, start: "top 88%", once: true }
        }
      );
    });

    highlights.forEach(function (highlight) {
      gsap.fromTo(
        highlight,
        { backgroundSize: "0% 100%" },
        {
          backgroundSize: "100% 100%",
          duration: 1.15,
          ease: "power1.out",
          scrollTrigger: { trigger: highlight, start: "top 89%", once: true }
        }
      );
    });

    if (timeline) {
      remember(timeline);
      gsap.fromTo(
        timeline,
        { "--timeline-progress": 0 },
        {
          "--timeline-progress": 1,
          ease: "none",
          scrollTrigger: {
            trigger: timeline,
            start: "top 78%",
            end: "bottom 38%",
            scrub: 0.65
          }
        }
      );
    }

    [
      ".qa-grid",
      ".aid-flow",
      ".timeline",
      ".evidence-grid",
      ".questions",
      ".route-list",
      ".chain",
      ".change-grid",
      ".chapter-next"
    ].forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (container) {
        revealChildren(container, {
          y: isMobile ? 22 : 32,
          x: isMobile ? 0 : selector === ".route-list" ? -16 : 0,
          stagger: selector === ".timeline" ? 0.12 : 0.085
        });
      });
    });

    document.querySelectorAll(".comparison-table tbody, .knowledge-table tbody, .missing-evidence tbody").forEach(function (body) {
      revealChildren(body, { y: isMobile ? 16 : 22, stagger: 0.065, start: "top 87%" });
    });

    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: function (self) {
        gsap.set(progressFill, { scaleX: self.progress });
      }
    });
  }

  function buildHoverMotion() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cards = document.querySelectorAll(
      ".qa-grid article, .evidence-grid article, .questions article, .change-grid article, .route, .chapter-next a"
    );

    cards.forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        const box = card.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;
        gsap.to(card, {
          rotationY: x * 2.2,
          rotationX: y * -1.6,
          y: -3,
          transformPerspective: 900,
          duration: 0.42,
          ease: "power2.out",
          overwrite: "auto"
        });
      });

      card.addEventListener("pointerleave", function () {
        gsap.to(card, {
          rotationY: 0,
          rotationX: 0,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
          overwrite: "auto",
          onComplete: function () {
            gsap.set(card, { clearProps: "transform" });
          }
        });
      });
    });
  }

  function prepareForPrint() {
    printPaused = true;
    introWasPlayingBeforePrint = Boolean(introTimeline && introTimeline.isActive());
    if (introTimeline) introTimeline.pause();
    if (ambientTween) ambientTween.pause();
    root.classList.add("motion-printing");
    motionTargets.forEach(function (target) {
      gsap.set(target, {
        clearProps: "opacity,visibility,transform,filter,clipPath"
      });
    });
  }

  function restoreAfterPrint() {
    root.classList.remove("motion-printing");
    printPaused = false;
    if (introWasPlayingBeforePrint && introTimeline) introTimeline.resume();
    if (ambientTween) ambientTween.resume();
    ScrollTrigger.refresh();
  }

  playIntro();
  scrollContext = gsap.context(function () {
    buildScrollMotion();
    buildHoverMotion();
  }, main);

  window.addEventListener("load", function () {
    ScrollTrigger.refresh();
  }, { once: true });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      ScrollTrigger.refresh();
    });
  }

  window.addEventListener("pageshow", function (event) {
    if (event.persisted) playIntro();
    ScrollTrigger.refresh();
  });

  window.addEventListener("beforeprint", prepareForPrint);
  window.addEventListener("afterprint", restoreAfterPrint);

  document.addEventListener("visibilitychange", function () {
    if (!ambientTween || printPaused) return;
    if (document.hidden) ambientTween.pause();
    else ambientTween.resume();
  });

  reduceMotion.addEventListener("change", function (event) {
    if (!event.matches) return;
    if (introTimeline) introTimeline.kill();
    if (ambientTween) ambientTween.kill();
    if (scrollContext) scrollContext.revert();
    motionTargets.forEach(function (target) {
      gsap.set(target, {
        clearProps: "opacity,visibility,transform,filter,clipPath,backgroundSize"
      });
    });
    root.classList.remove("motion-ready", "motion-intro-complete");
    root.classList.add("motion-reduced");
    stage.remove();
    controls.remove();
    progress.remove();
  });
})();
