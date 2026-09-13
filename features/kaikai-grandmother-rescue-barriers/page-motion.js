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
    ? { skip: "略过动画", replay: "重播动画", closingReplay: "重播结语动画" }
    : lang.startsWith("en")
      ? { skip: "Skip animation", replay: "Replay animation", closingReplay: "Replay closing animation" }
      : lang.startsWith("ja")
        ? { skip: "アニメーションをスキップ", replay: "アニメーションを再生", closingReplay: "結語アニメーションを再生" }
        : { skip: "略過動畫", replay: "重播動畫", closingReplay: "重播結語動畫" };

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
  const closing = document.querySelector(".closing");
  let closingStage = null;
  let closingReplayButton = null;

  if (closing) {
    closingStage = document.createElement("div");
    closingStage.className = "closing-motion-stage";
    closingStage.setAttribute("aria-hidden", "true");
    closingStage.innerHTML = [
      '<span class="closing-paper-frame"></span>',
      '<span class="closing-glow"></span>',
      '<span class="closing-paper-fold closing-paper-fold--left"></span>',
      '<span class="closing-paper-fold closing-paper-fold--right"></span>',
      '<span class="closing-door closing-door--left"></span>',
      '<span class="closing-door closing-door--right"></span>',
      '<span class="closing-seam"></span>',
      '<span class="closing-clay-seal"></span>',
      '<span class="closing-dust"></span>',
      '<span class="closing-threshold"></span>'
    ].join("");
    closing.prepend(closingStage);

    closingReplayButton = document.createElement("button");
    closingReplayButton.type = "button";
    closingReplayButton.className = "closing-motion-replay";
    closingReplayButton.textContent = labels.closingReplay;
    closingReplayButton.setAttribute("aria-label", labels.closingReplay);
    closing.appendChild(closingReplayButton);
  }

  const motionTargets = new Set([heroArt, heroCopy, paper, stage, atmosphere, warmLight, closing, closingStage, closingReplayButton].filter(Boolean));
  let introTimeline = null;
  let ambientTween = null;
  let closingTimeline = null;
  let closingAmbientTimeline = null;
  let scrollContext = null;
  let printPaused = false;
  let introWasPlayingBeforePrint = false;
  let closingWasPlayingBeforePrint = false;

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

  function buildClosingMotion(isMobile) {
    if (!closing || !closingStage) return;

    const label = closing.querySelector(":scope > .section-label");
    const title = closing.querySelector(":scope > h2");
    const copy = closing.querySelector(":scope > p:not(.section-label)");
    const highlight = closing.querySelector(".fluorescent");
    const paperFrame = closingStage.querySelector(".closing-paper-frame");
    const glow = closingStage.querySelector(".closing-glow");
    const folds = closingStage.querySelectorAll(".closing-paper-fold");
    const leftDoor = closingStage.querySelector(".closing-door--left");
    const rightDoor = closingStage.querySelector(".closing-door--right");
    const seam = closingStage.querySelector(".closing-seam");
    const claySeal = closingStage.querySelector(".closing-clay-seal");
    const dust = closingStage.querySelector(".closing-dust");
    const threshold = closingStage.querySelector(".closing-threshold");
    const content = [label, title, copy, closingReplayButton].filter(Boolean);

    remember([
      closingStage,
      paperFrame,
      glow,
      ...folds,
      leftDoor,
      rightDoor,
      seam,
      claySeal,
      dust,
      threshold,
      highlight,
      ...content
    ].filter(Boolean));

    function stopClosingAmbient() {
      if (!closingAmbientTimeline) return;
      closingAmbientTimeline.kill();
      closingAmbientTimeline = null;
    }

    function startClosingAmbient() {
      stopClosingAmbient();
      closingAmbientTimeline = gsap.timeline({ repeat: -1, yoyo: true })
        .to(glow, { scale: 1.045, autoAlpha: 0.88, duration: 4.8, ease: "sine.inOut" }, 0)
        .to(dust, { y: isMobile ? -5 : -8, autoAlpha: 0.72, duration: 5.6, ease: "sine.inOut" }, 0)
        .to(claySeal, { rotation: 92, scale: 0.86, duration: 5.6, ease: "sine.inOut" }, 0);
    }

    closingTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: closing,
        start: isMobile ? "top 82%" : "top 76%",
        once: true
      },
      onStart: function () {
        stopClosingAmbient();
        closing.classList.remove("is-closing-motion-complete");
        closing.classList.add("is-closing-motion-active");
      },
      onComplete: function () {
        closing.classList.add("is-closing-motion-complete");
        startClosingAmbient();
      }
    })
      .fromTo(closingStage, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.34 }, 0)
      .fromTo(paperFrame, { autoAlpha: 0, scale: 0.91, rotation: -1.6 }, {
        autoAlpha: 0.92,
        scale: 1,
        rotation: 0,
        duration: 1.35,
        ease: "power2.out"
      }, 0)
      .fromTo(dust, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 0.56, duration: 1.6, ease: "sine.out" }, 0.08)
      .fromTo(glow, { autoAlpha: 0, scale: 0.62 }, { autoAlpha: 0.82, scale: 1, duration: 1.9, ease: "sine.out" }, 0.12)
      .fromTo(folds, { xPercent: function (index) { return index ? 34 : -34; }, autoAlpha: 0 }, {
        xPercent: 0,
        autoAlpha: 0.5,
        duration: 1.25,
        stagger: 0.08,
        ease: "power2.out"
      }, 0.08)
      .fromTo(leftDoor, { xPercent: 7, rotationY: 0, autoAlpha: 0.78 }, {
        xPercent: isMobile ? -27 : -25,
        rotationY: isMobile ? -12 : -18,
        autoAlpha: 0.34,
        duration: 1.78,
        ease: "power3.inOut"
      }, 0.16)
      .fromTo(rightDoor, { xPercent: -7, rotationY: 0, autoAlpha: 0.78 }, {
        xPercent: isMobile ? 27 : 25,
        rotationY: isMobile ? 12 : 18,
        autoAlpha: 0.34,
        duration: 1.78,
        ease: "power3.inOut"
      }, 0.16)
      .fromTo(seam, { scaleY: 0, autoAlpha: 0 }, { scaleY: 1, autoAlpha: 0.92, duration: 0.82, ease: "power2.out" }, 0.12)
      .to(seam, { autoAlpha: 0.14, duration: 0.86, ease: "sine.out" }, 0.88)
      .fromTo(claySeal, {
        xPercent: -50,
        yPercent: -50,
        scale: 0.62,
        rotation: -18,
        autoAlpha: 0
      }, {
        xPercent: -50,
        yPercent: -50,
        scale: 1,
        rotation: 0,
        autoAlpha: 1,
        duration: 0.86,
        ease: "back.out(1.7)"
      }, 0.18)
      .to(claySeal, {
        xPercent: -50,
        yPercent: -50,
        y: isMobile ? 54 : 76,
        scale: 0.84,
        rotation: 90,
        autoAlpha: 0.46,
        duration: 1.12,
        ease: "power2.inOut"
      }, 0.84)
      .fromTo(threshold, { scaleX: 0, autoAlpha: 0 }, { scaleX: 1, autoAlpha: 0.72, duration: 1.32, ease: "power2.out" }, 0.46)
      .fromTo(label, { y: 20, autoAlpha: 0, "--motion-label-line": 0 }, {
        y: 0,
        autoAlpha: 1,
        "--motion-label-line": 1,
        duration: 0.78,
        ease: "power2.out",
        clearProps: "opacity,visibility,transform"
      }, 0.92)
      .fromTo(title, {
        y: isMobile ? 36 : 48,
        autoAlpha: 0,
        filter: "blur(7px)",
        clipPath: "inset(0 0 100% 0)"
      }, {
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.08,
        ease: "power3.out",
        clearProps: "opacity,visibility,transform,filter,clipPath"
      }, 1.02)
      .fromTo(copy, { y: isMobile ? 24 : 32, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.9,
        ease: "power2.out",
        clearProps: "opacity,visibility,transform"
      }, 1.34)
      .fromTo(highlight, { backgroundSize: "0% 0.46em" }, {
        backgroundSize: "100% 0.46em",
        duration: 1.2,
        ease: "power1.out"
      }, 1.62)
      .fromTo(closingReplayButton, { y: 12, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.62,
        ease: "power2.out",
        clearProps: "opacity,visibility,transform"
      }, 1.92);

    closingReplayButton.addEventListener("click", function () {
      stopClosingAmbient();
      closing.classList.remove("is-closing-motion-active", "is-closing-motion-complete");
      if (closingTimeline.scrollTrigger) closingTimeline.scrollTrigger.kill(false, true);
      closingTimeline.invalidate().restart(true, false);
    });

    gsap.fromTo(
      closingStage,
      { yPercent: isMobile ? 3 : 6 },
      {
        yPercent: isMobile ? -3 : -6,
        ease: "none",
        scrollTrigger: {
          trigger: closing,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.1
        }
      }
    );
  }

  function buildScrollMotion() {
    const isMobile = window.matchMedia("(max-width: 780px)").matches;
    const sections = gsap.utils.toArray(".paper > section");
    const labelsOnPage = gsap.utils.toArray(".paper .section-label, .paper .subsection-label").filter(function (label) {
      return !label.closest(".closing");
    });
    const highlights = gsap.utils.toArray(".paper .fluorescent").filter(function (highlight) {
      return !highlight.closest(".closing");
    });
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
      if (section.classList.contains("closing")) return;

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
        { backgroundSize: "0% 0.46em" },
        {
          backgroundSize: "100% 0.46em",
          duration: 1.15,
          ease: "power1.out",
          scrollTrigger: { trigger: highlight, start: "top 89%", once: true }
        }
      );
    });

    buildClosingMotion(isMobile);

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
    remember(cards);

    cards.forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        if (reduceMotion.matches) return;
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
        if (reduceMotion.matches) return;
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
    closingWasPlayingBeforePrint = Boolean(closingTimeline && closingTimeline.isActive());
    if (introTimeline) introTimeline.pause();
    if (ambientTween) ambientTween.pause();
    if (closingTimeline) closingTimeline.pause();
    if (closingAmbientTimeline) closingAmbientTimeline.pause();
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
    if (closingWasPlayingBeforePrint && closingTimeline) closingTimeline.resume();
    if (closingAmbientTimeline) closingAmbientTimeline.resume();
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
    if (printPaused) return;
    [ambientTween, closingAmbientTimeline].filter(Boolean).forEach(function (tween) {
      if (document.hidden) tween.pause();
      else tween.resume();
    });
  });

  reduceMotion.addEventListener("change", function (event) {
    if (!event.matches) return;
    if (introTimeline) introTimeline.kill();
    if (ambientTween) ambientTween.kill();
    if (closingTimeline) closingTimeline.kill();
    if (closingAmbientTimeline) closingAmbientTimeline.kill();
    if (scrollContext) scrollContext.revert();
    motionTargets.forEach(function (target) {
      gsap.killTweensOf(target);
      gsap.set(target, {
        clearProps: "opacity,visibility,transform,filter,clipPath,backgroundSize"
      });
    });
    root.classList.remove("motion-ready", "motion-intro-complete");
    root.classList.add("motion-reduced");
    stage.remove();
    if (closingStage) closingStage.remove();
    if (closingReplayButton) closingReplayButton.remove();
    controls.remove();
    progress.remove();
  });
})();
