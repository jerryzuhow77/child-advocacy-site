(() => {
  "use strict";

  const doc = document;
  const root = doc.documentElement;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (prefersReducedMotion) {
    root.classList.add("tt-gsap-reduced");
    return;
  }

  if (!gsap || !ScrollTrigger) {
    root.classList.add("tt-gsap-fallback");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ force3D: true, nullTargetWarn: false });
  ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });

  const one = (selector, scope = doc) => scope.querySelector(selector);
  const all = (selector, scope = doc) => Array.from(scope.querySelectorAll(selector));
  const isMobile = window.matchMedia("(max-width: 720px)").matches;
  const isTouch = ScrollTrigger.isTouch === 1;
  const cleanups = [];
  const playOnce = (timeline) => {
    if (!timeline || timeline.data === "played") return;
    timeline.data = "played";
    timeline.play(0);
  };
  const paperCutMotion = {
    "scroll-prologue": { x: -12, y: 16, rotation: -4, scale: 0.76, restX: 0, restY: 0, restRotation: 0, alpha: 0.78 },
    "wind-kite": { x: -34, y: 17, rotation: -9, scale: 0.8, restX: 9, restY: -5, restRotation: 1.4, alpha: 0.76 },
    "ten-knot-door": { x: 0, y: 24, rotation: 0, scale: 0.7, restX: 0, restY: -2, restRotation: 0, alpha: 0.8 },
    "frost-lantern": { x: -11, y: -17, rotation: -6, scale: 0.78, restX: 3, restY: 2, restRotation: 0.8, alpha: 0.72 },
    "court-scroll": { x: 26, y: 4, rotation: 5, scale: 0.75, restX: 0, restY: 0, restRotation: 0, alpha: 0.74 },
    "seal-road": { x: -28, y: 19, rotation: -6, scale: 0.76, restX: 6, restY: -4, restRotation: 0.9, alpha: 0.76 },
    "evidence-blocks": { x: 0, y: 20, rotation: -5, scale: 0.7, restX: 0, restY: -1, restRotation: 0.5, alpha: 0.72 },
    "seven-moon": { x: 0, y: 5, rotation: -13, scale: 0.66, restX: 0, restY: -4, restRotation: 1.5, alpha: 0.78 },
    "guarded-lamp": { x: 0, y: 25, rotation: -3, scale: 0.7, restX: 0, restY: -4, restRotation: 0.5, alpha: 0.8 }
  };

  const createOnceTrigger = (trigger, timeline, start) => ScrollTrigger.create({
    trigger,
    start,
    once: true,
    onEnter: () => playOnce(timeline),
    onEnterBack: () => playOnce(timeline)
  });

  const initOpening = () => {
    const opening = one("[data-tt-opening]");
    if (!opening) return;

    const stage = one(".tt-stage", opening);
    const copy = one(".tt-stage-copy", opening);
    const lines = all(".tt-opening-line", opening);

    if (stage) {
      gsap.fromTo(stage,
        { autoAlpha: 0, scale: 0.972, y: 16 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 1.15, ease: "power3.out", clearProps: "transform" }
      );
    }

    if (copy) {
      gsap.fromTo(copy,
        { autoAlpha: 0, x: isMobile ? 0 : 26, y: isMobile ? 18 : 0 },
        { autoAlpha: 1, x: 0, y: 0, duration: 0.95, delay: 0.22, ease: "power3.out" }
      );
    }

    const showLine = (line) => {
      if (!line || !line.classList.contains("is-active")) return;
      lines.forEach((item) => {
        if (item !== line) gsap.set(item, { autoAlpha: 0, y: 12 });
      });
      const parts = [one("strong", line), one("span", line)].filter(Boolean);
      gsap.killTweensOf([line, ...parts]);
      gsap.set(line, { autoAlpha: 1, y: 0 });
      gsap.fromTo(parts,
        { autoAlpha: 0, y: 19, filter: "blur(3px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.78, stagger: 0.1, ease: "power3.out" }
      );
    };

    showLine(lines.find((line) => line.classList.contains("is-active")));
    const lineObserver = new MutationObserver((records) => {
      records.forEach(({ target }) => showLine(target));
    });
    lines.forEach((line) => lineObserver.observe(line, { attributes: true, attributeFilter: ["class"] }));
    cleanups.push(() => lineObserver.disconnect());
  };

  const initHero = () => {
    const hero = one(".tt-hero");
    if (!hero) return;

    const copy = one(".tt-hero-copy", hero);
    const art = one(".tt-hero-art", hero);
    const image = art && one("img", art);
    const revealTargets = copy ? [
      one(".tt-kicker", copy),
      one("h1", copy),
      one(".tt-subtitle", copy),
      one(".tt-deck", copy),
      one(".tt-meta", copy),
      one(".tt-craft-key", copy),
      one(".tt-view-counter", copy)
    ].filter(Boolean) : [];

    const timeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
    if (revealTargets.length) {
      timeline.fromTo(revealTargets,
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.82, stagger: 0.09 },
        0
      );
    }
    if (art) {
      timeline.fromTo(art,
        { autoAlpha: 0, x: isMobile ? 0 : 42, y: isMobile ? 28 : 0, clipPath: "inset(7% 7% 7% 7%)" },
        { autoAlpha: 1, x: 0, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1.2 },
        0.14
      );
    }
    if (image) {
      timeline.fromTo(image, { scale: 1.055 }, { scale: 1, duration: 1.55, ease: "power2.out" }, 0.14);
      gsap.to(image, {
        yPercent: isMobile ? 2.5 : 6,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 1.15 }
      });
    }

    const opening = one("[data-tt-opening]");
    const playHero = () => playOnce(timeline);
    if (!opening || opening.classList.contains("is-gone") || getComputedStyle(opening).visibility === "hidden") {
      playHero();
    } else {
      const openingObserver = new MutationObserver(() => {
        if (opening.classList.contains("is-gone")) {
          playHero();
          openingObserver.disconnect();
        }
      });
      openingObserver.observe(opening, { attributes: true, attributeFilter: ["class"] });
      cleanups.push(() => openingObserver.disconnect());
    }

    const heroRonghua = one(".tt-ronghua--hero", hero);
    if (heroRonghua && !isTouch) {
      gsap.to(heroRonghua, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top bottom", end: "bottom top", scrub: 1.3 }
      });
    }
  };

  const initGuide = () => {
    const guide = one(".tt-guide-card");
    if (!guide) return;
    const copy = one(".tt-guide-copy", guide);
    const links = all(".tt-guide-links a", guide);
    const ornament = one(".tt-ronghua--guide", guide);
    const timeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

    timeline.fromTo(guide,
      { autoAlpha: 0, y: 44, clipPath: "inset(0 0 12% 0)" },
      { autoAlpha: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: 0.95 },
      0
    );
    if (copy) timeline.fromTo(copy, { autoAlpha: 0, x: -22 }, { autoAlpha: 1, x: 0, duration: 0.72 }, 0.22);
    if (links.length) timeline.fromTo(links, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.58, stagger: 0.055 }, 0.32);
    if (ornament) timeline.fromTo(ornament, { autoAlpha: 0, scale: 0.72, rotation: 9 }, { autoAlpha: 0.2, scale: 1, rotation: 0, duration: 1.25 }, 0.16);

    createOnceTrigger(guide, timeline, isMobile ? "top 91%" : "top 84%");
  };

  const addSceneMotion = (timeline, transition) => {
    const scene = transition.dataset.shadowScene;
    const find = (selector) => one(selector, transition);
    const findAll = (selector) => all(selector, transition);
    const drawPaths = (selector, position = 0.76, duration = 1.7) => {
      const paths = findAll(selector);
      if (!paths.length) return;
      gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
      timeline.to(paths, { strokeDashoffset: 0, duration, stagger: 0.08, ease: "power2.inOut" }, position);
    };
    const animateCraft = (selector, fromVars, toVars, position = 0.6, stagger = 0.08) => {
      const parts = findAll(selector);
      if (!parts.length) return;
      timeline.fromTo(parts, fromVars, { ...toVars, stagger }, position);
    };

    const sun = find(".tt-shadow-sun-disc");
    const clouds = findAll(".tt-shadow-cloud");
    const mountains = findAll(".tt-shadow-mountain");
    const water = find(".tt-shadow-water");
    const footlights = find(".tt-shadow-footlights");
    const paperCut = find(".tt-paper-cut-atlas-image");
    const paperMotion = paperCutMotion[scene];
    if (paperCut && paperMotion) {
      timeline.fromTo(paperCut, {
        autoAlpha: 0,
        x: paperMotion.x,
        y: paperMotion.y,
        rotation: paperMotion.rotation,
        scale: paperMotion.scale,
        filter: "drop-shadow(3px 5px 2px rgba(35,15,9,.18)) blur(8px) saturate(.72) brightness(.76)"
      }, {
        autoAlpha: isMobile ? paperMotion.alpha * 0.84 : paperMotion.alpha,
        x: paperMotion.restX,
        y: paperMotion.restY,
        rotation: paperMotion.restRotation,
        scale: 1,
        filter: "drop-shadow(7px 9px 4px rgba(35,15,9,.3)) blur(0px) saturate(.96) brightness(.98)",
        duration: 1.7,
        ease: "power3.out"
      }, 0.18);
    }
    if (sun) timeline.fromTo(sun, { autoAlpha: 0, scale: 0.72 }, { autoAlpha: 0.62, scale: 1, duration: 1.45 }, 0.12);
    if (clouds.length) timeline.fromTo(clouds, { autoAlpha: 0, x: (index) => index ? 34 : -34 }, { autoAlpha: 0.66, x: 0, duration: 2.1, stagger: 0.18, ease: "sine.out" }, 0.08);
    if (mountains.length) timeline.fromTo(mountains, { autoAlpha: 0, y: 18 }, { autoAlpha: 0.72, y: 0, duration: 1.55, stagger: 0.14 }, 0.18);
    if (water) timeline.fromTo(water, { autoAlpha: 0, scaleX: 0.82 }, { autoAlpha: 0.58, scaleX: 1, duration: 1.7, transformOrigin: "50% 50%" }, 0.24);
    if (footlights) timeline.fromTo(footlights, { autoAlpha: 0.12 }, { autoAlpha: 0.78, duration: 0.82, repeat: 1, yoyo: true, ease: "sine.inOut" }, 0.18);

    if (scene === "scroll-prologue") {
      const scroll = find(".tt-shadow-scroll");
      const records = findAll(".tt-shadow-record-line");
      const seal = find(".tt-shadow-seal");
      const bloom = find(".tt-shadow-bloom");
      const petals = findAll(".tt-shadow-petal");
      if (scroll) timeline.fromTo(scroll, { scaleX: 0.18 }, { scaleX: 1, duration: 1.15, transformOrigin: "50% 50%" }, 0.72);
      if (records.length) timeline.fromTo(records, { scaleX: 0 }, { scaleX: 1, duration: 0.52, stagger: 0.11, transformOrigin: "0 50%" }, 1.18);
      if (seal) timeline.fromTo(seal, { autoAlpha: 0, scale: 1.7, rotation: -12 }, { autoAlpha: 0.82, scale: 1, rotation: 0, duration: 0.72 }, 1.55);
      if (bloom) timeline.fromTo(bloom, { autoAlpha: 0, scale: 0.45 }, { autoAlpha: 0.76, scale: 1, duration: 0.9 }, 1.74);
      if (petals.length) timeline.fromTo(petals, { autoAlpha: 0, y: -10, scale: 0.4 }, { autoAlpha: 0.68, y: 8, scale: 1, duration: 1.2, stagger: 0.06, ease: "sine.out" }, 1.82);
      animateCraft(".tt-craft-scroll-frame", { autoAlpha: 0, scaleX: 0.72 }, { autoAlpha: 0.72, scaleX: 1, duration: 1.2, transformOrigin: "50% 50%" }, 0.62);
      animateCraft(".tt-craft-binding-stitch", { autoAlpha: 0, y: -11, scale: 0.45 }, { autoAlpha: 0.82, y: 0, scale: 1, duration: 0.48, ease: "back.out(1.5)" }, 1.16, 0.09);
      animateCraft(".tt-craft-tassel", { autoAlpha: 0, y: -18, rotation: (index) => index ? 9 : -9 }, { autoAlpha: 0.72, y: 0, rotation: 0, duration: 0.9, ease: "sine.out" }, 1.42, 0.14);
      drawPaths(".tt-shadow-line path", 0.86, 1.55);
      return;
    }

    if (scene === "wind-kite") {
      const kite = find(".tt-shadow-kite");
      if (kite) timeline.to(kite, {
        keyframes: [
          { x: -16, y: 20, rotation: -12, duration: 0.45 },
          { x: 12, y: -18, rotation: 6, duration: 0.9 },
          { x: 26, y: -30, rotation: 10, duration: 0.8 }
        ],
        ease: "sine.inOut"
      }, 0.72);
      animateCraft(".tt-craft-wind-ribbon", { autoAlpha: 0, x: -38, scaleX: 0.56 }, { autoAlpha: 0.58, x: 0, scaleX: 1, duration: 1.65, transformOrigin: "0 50%", ease: "sine.out" }, 0.34, 0.12);
      animateCraft(".tt-craft-wind-mark", { autoAlpha: 0, x: -26, y: (index) => index % 2 ? 8 : -8 }, { autoAlpha: 0.66, x: 0, y: 0, duration: 0.72, ease: "power2.out" }, 0.9, 0.08);
      animateCraft(".tt-craft-edge-streamer", { autoAlpha: 0, rotation: (index) => index ? 18 : -18, scaleY: 0.45 }, { autoAlpha: 0.64, rotation: 0, scaleY: 1, duration: 1.15, transformOrigin: "50% 0", ease: "sine.out" }, 1.18, 0.16);
      drawPaths(".tt-shadow-thread path", 0.74, 1.9);
      return;
    }

    if (scene === "ten-knot-door") {
      const door = find(".tt-shadow-door");
      const lattice = find(".tt-shadow-lattice");
      const cord = find(".tt-shadow-knot-cord");
      const knots = findAll(".tt-shadow-knot");
      if (door) timeline.fromTo(door, { autoAlpha: 0.42, scaleX: 0.86 }, { autoAlpha: 0.9, scaleX: 1, duration: 1.05, transformOrigin: "50% 100%" }, 0.62);
      if (lattice) timeline.fromTo(lattice, { autoAlpha: 0, scale: 0.72, rotation: -3 }, { autoAlpha: 0.78, scale: 1, rotation: 0, duration: 1.15 }, 0.78);
      if (cord) timeline.fromTo(cord, { scaleY: 0.08 }, { scaleY: 1, duration: 1.1, transformOrigin: "50% 0" }, 0.88);
      if (knots.length) timeline.fromTo(knots, { autoAlpha: 0, scale: 0.25 }, { autoAlpha: 0.92, scale: 1, duration: 0.38, stagger: 0.09, ease: "back.out(1.7)" }, 1.05);
      animateCraft(".tt-craft-door-stud", { autoAlpha: 0, scale: 0.18 }, { autoAlpha: 0.78, scale: 1, duration: 0.34, ease: "back.out(1.8)" }, 1.04, 0.045);
      animateCraft(".tt-craft-rosette", { autoAlpha: 0, scale: 0.42, rotation: (index) => index ? 26 : -26 }, { autoAlpha: 0.78, scale: 1, rotation: 0, duration: 0.72, ease: "back.out(1.45)" }, 1.32, 0.14);
      animateCraft(".tt-craft-threshold", { autoAlpha: 0, scaleX: 0.1 }, { autoAlpha: 0.58, scaleX: 1, duration: 0.62, transformOrigin: "50% 50%" }, 1.58, 0.09);
      return;
    }

    if (scene === "frost-lantern") {
      const lantern = find(".tt-shadow-lantern");
      const wick = find(".tt-shadow-wick");
      const frost = find(".tt-shadow-frost");
      const date = find(".tt-shadow-date");
      if (lantern) timeline.fromTo(lantern, { y: 22, rotation: -7 }, { y: 0, rotation: 0, duration: 1.25, ease: "elastic.out(1, 0.55)" }, 0.62);
      if (wick) timeline.fromTo(wick, { autoAlpha: 0.12, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.7, repeat: 1, yoyo: true, ease: "sine.inOut" }, 1.05);
      if (frost) timeline.fromTo(frost, { autoAlpha: 0, clipPath: "inset(100% 0 0 0)" }, { autoAlpha: 0.82, clipPath: "inset(0% 0 0 0)", duration: 1.5 }, 1.08);
      if (date) timeline.fromTo(date, { autoAlpha: 0, letterSpacing: "0.25em" }, { autoAlpha: 0.88, letterSpacing: "0.08em", duration: 0.82 }, 1.5);
      animateCraft(".tt-craft-ice-mark", { autoAlpha: 0, scale: 0.2, rotation: (index) => index % 2 ? 28 : -28 }, { autoAlpha: 0.62, scale: 1, rotation: 0, duration: 0.58, ease: "back.out(1.45)" }, 0.82, 0.08);
      animateCraft(".tt-craft-cold-breath", { autoAlpha: 0, x: -26, scaleX: 0.5 }, { autoAlpha: 0.38, x: 0, scaleX: 1, duration: 1.35, transformOrigin: "0 50%", ease: "sine.out" }, 1.2, 0.17);
      animateCraft(".tt-craft-frost-corner", { autoAlpha: 0, clipPath: "inset(100% 100% 0 0)" }, { autoAlpha: 0.56, clipPath: "inset(0% 0% 0 0)", duration: 1.35, ease: "power2.out" }, 1.1, 0.18);
      return;
    }

    if (scene === "court-scroll") {
      const scroll = find(".tt-shadow-scroll");
      const records = findAll(".tt-shadow-record-line");
      const seal = find(".tt-shadow-seal");
      const bars = find(".tt-shadow-bars");
      if (scroll) timeline.fromTo(scroll, { scaleX: 0.12 }, { scaleX: 1, duration: 1.2, transformOrigin: "50% 50%" }, 0.58);
      if (records.length) timeline.fromTo(records, { scaleX: 0 }, { scaleX: 1, duration: 0.52, stagger: 0.15, transformOrigin: "0 50%" }, 1.05);
      if (seal) timeline.fromTo(seal, { autoAlpha: 0, scale: 1.8, rotation: -11 }, { autoAlpha: 0.9, scale: 1, rotation: 0, duration: 0.68, ease: "back.out(1.5)" }, 1.5);
      if (bars) timeline.fromTo(bars, { autoAlpha: 0, y: -18 }, { autoAlpha: 0.72, y: 0, duration: 0.85 }, 1.58);
      animateCraft(".tt-craft-document-tab", { autoAlpha: 0, x: 18 }, { autoAlpha: 0.78, x: 0, duration: 0.48, ease: "power2.out" }, 1.18, 0.12);
      animateCraft(".tt-craft-balance-rule", { autoAlpha: 0, scaleX: 0.08 }, { autoAlpha: 0.68, scaleX: 1, duration: 1.0, transformOrigin: "50% 50%" }, 0.86);
      animateCraft(".tt-craft-court-column", { autoAlpha: 0, scaleY: 0.18 }, { autoAlpha: 0.52, scaleY: 1, duration: 1.1, transformOrigin: "50% 100%" }, 0.72, 0.18);
      return;
    }

    if (scene === "seal-road") {
      const stamp = find(".tt-shadow-stamp");
      const flower = find(".tt-shadow-paper-flower");
      const home = find(".tt-shadow-roof-home");
      if (stamp) timeline.fromTo(stamp, { autoAlpha: 0, y: -34, rotation: -9, scale: 1.22 }, { autoAlpha: 0.9, y: 0, rotation: 0, scale: 1, duration: 0.75, ease: "back.out(1.4)" }, 0.86);
      drawPaths(".tt-shadow-road path", 0.92, 1.85);
      if (home) timeline.fromTo(home, { autoAlpha: 0, x: 18 }, { autoAlpha: 0.82, x: 0, duration: 0.9 }, 1.26);
      if (flower) timeline.fromTo(flower, { autoAlpha: 0, scale: 0.34, rotation: -14 }, { autoAlpha: 0.82, scale: 1, rotation: 0, duration: 1.0, ease: "back.out(1.55)" }, 1.52);
      animateCraft(".tt-craft-route-marker", { autoAlpha: 0, scale: 0.22, y: -9 }, { autoAlpha: 0.78, scale: 1, y: 0, duration: 0.48, ease: "back.out(1.65)" }, 1.08, 0.18);
      animateCraft(".tt-craft-track", { autoAlpha: 0, x: -18, scaleX: 0.45 }, { autoAlpha: 0.5, x: 0, scaleX: 1, duration: 0.64, transformOrigin: "0 50%" }, 1.14, 0.1);
      animateCraft(".tt-craft-home-glow", { autoAlpha: 0, scale: 0.48 }, { autoAlpha: 0.62, scale: 1, duration: 1.2, ease: "sine.out" }, 1.42);
      return;
    }

    if (scene === "evidence-blocks") {
      const blocks = findAll(".tt-shadow-block");
      const boundary = find(".tt-shadow-boundary");
      const record = find(".tt-shadow-blurred-record");
      if (blocks.length) timeline.fromTo(blocks, { autoAlpha: 0, y: 26, rotation: (index) => index % 2 ? 4 : -4 }, { autoAlpha: 0.92, y: 0, rotation: 0, duration: 0.58, stagger: 0.13, ease: "back.out(1.35)" }, 0.62);
      if (boundary) timeline.fromTo(boundary, { scaleX: 0 }, { scaleX: 1, duration: 1.15, transformOrigin: "0 50%" }, 1.12);
      if (record) timeline.fromTo(record, { autoAlpha: 0, x: 16 }, { autoAlpha: 0.56, x: 0, duration: 0.8 }, 1.46);
      animateCraft(".tt-craft-registration-mark", { autoAlpha: 0, scale: 1.65, rotation: (index) => index % 2 ? 22 : -22 }, { autoAlpha: 0.72, scale: 1, rotation: 0, duration: 0.55, ease: "back.out(1.35)" }, 0.82, 0.12);
      animateCraft(".tt-craft-ink-pad", { autoAlpha: 0, y: 18, scale: 0.55 }, { autoAlpha: 0.72, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.5)" }, 1.12, 0.11);
      animateCraft(".tt-craft-evidence-rule", { autoAlpha: 0, scaleY: 0.08 }, { autoAlpha: 0.66, scaleY: 1, duration: 1.05, transformOrigin: "50% 0" }, 1.2);
      return;
    }

    if (scene === "seven-moon") {
      const moon = find(".tt-shadow-moon");
      const thread = find(".tt-shadow-hanging-thread");
      if (moon) timeline.fromTo(moon, { autoAlpha: 0, scale: 0.58, rotation: -8 }, { autoAlpha: 0.92, scale: 1, rotation: 0, duration: 1.35, ease: "power2.out" }, 0.56);
      drawPaths(".tt-shadow-stitches path", 0.82, 2.05);
      if (thread) timeline.fromTo(thread, { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 0.72, scaleY: 1, duration: 1.15, transformOrigin: "50% 0" }, 1.08);
      animateCraft(".tt-craft-stitch-point", { autoAlpha: 0, scale: 0.15 }, { autoAlpha: 0.78, scale: 1, duration: 0.42, ease: "back.out(1.75)" }, 0.88, 0.12);
      animateCraft(".tt-craft-orbit-dot", { autoAlpha: 0, scale: 0.25 }, { autoAlpha: 0.58, scale: 1, duration: 0.6, ease: "sine.out" }, 1.22, 0.1);
      animateCraft(".tt-craft-needle-glint", { autoAlpha: 0, x: -28, rotation: -35 }, { autoAlpha: 0.74, x: 0, rotation: -17, duration: 0.95, ease: "power2.out" }, 1.52);
      return;
    }

    if (scene === "guarded-lamp") {
      const door = find(".tt-shadow-open-door");
      const lantern = find(".tt-shadow-guard-lantern");
      const hands = findAll(".tt-shadow-hand");
      const bloom = find(".tt-shadow-bloom");
      const petals = findAll(".tt-shadow-petal");
      if (door) timeline.fromTo(door, { autoAlpha: 0.35, scale: 0.78 }, { autoAlpha: 0.92, scale: 1, duration: 1.25, ease: "power2.out" }, 0.56);
      if (lantern) timeline.fromTo(lantern, { autoAlpha: 0, y: 22, scale: 0.72 }, { autoAlpha: 0.95, y: 0, scale: 1, duration: 1.05, ease: "back.out(1.45)" }, 0.84);
      if (hands.length) timeline.fromTo(hands, { autoAlpha: 0, scale: 0.3, rotation: (index) => index % 2 ? 10 : -10 }, { autoAlpha: 0.84, scale: 1, rotation: 0, duration: 0.58, stagger: 0.14, ease: "back.out(1.7)" }, 1.12);
      if (bloom) timeline.fromTo(bloom, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 0.86, scale: 1, duration: 1.05 }, 1.56);
      if (petals.length) timeline.fromTo(petals, { autoAlpha: 0, y: -16, scale: 0.35 }, { autoAlpha: 0.72, y: 9, scale: 1, duration: 1.25, stagger: 0.07, ease: "sine.out" }, 1.7);
      animateCraft(".tt-craft-safe-arc", { autoAlpha: 0, scale: 0.54 }, { autoAlpha: 0.46, scale: 1, duration: 1.25, ease: "power2.out" }, 0.72, 0.16);
      animateCraft(".tt-craft-spring-dot", { autoAlpha: 0, y: 12, scale: 0.2 }, { autoAlpha: 0.7, y: 0, scale: 1, duration: 0.48, ease: "back.out(1.65)" }, 1.42, 0.075);
      animateCraft(".tt-craft-door-glow", { autoAlpha: 0, scaleX: 0.36 }, { autoAlpha: 0.66, scaleX: 1, duration: 1.35, transformOrigin: "50% 50%", ease: "sine.out" }, 1.08);
    }
  };

  const mountTransition = (transition) => {
    if (transition.dataset.ttGsapMounted === "true") return true;
    const stage = one(".tt-shadow-stage", transition);
    if (!stage) return false;
    transition.dataset.ttGsapMounted = "true";

    const screen = one(".tt-shadow-screen", transition);
    const dialogue = one(".tt-shadow-dialogue", transition);
    const title = dialogue && one(":scope > small", dialogue);
    const lines = dialogue ? all(":scope > p", dialogue) : [];
    const props = all(".tt-shadow-props > *", transition);
    const woman = one(".tt-pose-actor--woman, .tt-shadow-figure--woman", transition);
    const scribe = one(".tt-pose-actor--scribe, .tt-shadow-figure--scribe", transition);
    const actors = [woman, scribe].filter(Boolean);
    const isPrologue = transition.classList.contains("tt-transition--prologue");
    const isMobilePrologue = isPrologue && isMobile;
    const curtain = one(".tt-stage-curtain--opening", transition);
    const leftCurtain = curtain && one(".tt-stage-curtain-panel--left", curtain);
    const rightCurtain = curtain && one(".tt-stage-curtain-panel--right", curtain);
    const valance = curtain && one(".tt-stage-curtain-valance", curtain);

    gsap.set(stage, { autoAlpha: isPrologue ? 1 : 0.18, scale: 1.035, transformOrigin: "50% 48%" });
    if (screen) gsap.set(screen, { autoAlpha: isPrologue ? 1 : 0.38, scale: 1.025 });
    if (props.length) gsap.set(props, { autoAlpha: 0, y: 22, scale: 0.84 });
    if (woman) gsap.set(woman, { autoAlpha: 0, x: isMobile ? -34 : -82, y: 8, rotation: -2.2 });
    if (scribe) gsap.set(scribe, { autoAlpha: 0, x: isMobile ? 34 : 82, y: 8, rotation: 2.2 });
    if (isPrologue) {
      if (dialogue) gsap.set(dialogue, { autoAlpha: 1, y: 0 });
      if (title) gsap.set(title, { autoAlpha: 1, y: 0 });
      if (lines.length) gsap.set(lines, { autoAlpha: 1, y: 0 });
    } else {
      if (title) gsap.set(title, { autoAlpha: 0, y: 10 });
      if (lines.length) gsap.set(lines, { autoAlpha: 0, y: 20 });
    }

    const timeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
    timeline.call(() => transition.classList.add("is-visible"), null, 0);
    timeline.to(stage, { autoAlpha: 1, scale: 1, duration: 1.1 }, 0);
    if (screen) timeline.to(screen, { autoAlpha: 1, scale: 1, duration: 1.35 }, 0.06);

    if (isPrologue && curtain) {
      if (leftCurtain) gsap.set(leftCurtain, { xPercent: 0 });
      if (rightCurtain) gsap.set(rightCurtain, { xPercent: 0 });
      if (valance) gsap.set(valance, { autoAlpha: 0, yPercent: -32, scaleY: 0.74 });
      if (valance) timeline.to(valance, { autoAlpha: 1, yPercent: 0, scaleY: 1, duration: 0.9 }, 0.06);
      if (leftCurtain) timeline.to(leftCurtain, { xPercent: -102, duration: 1.7, ease: "power2.inOut" }, 0.28);
      if (rightCurtain) timeline.to(rightCurtain, { xPercent: 102, duration: 1.7, ease: "power2.inOut" }, 0.28);
      if (actors.length) timeline.to(actors, { autoAlpha: 1, x: 0, y: 0, rotation: 0, duration: 1.05, stagger: 0.12 }, 0.72);
    } else {
      if (props.length) {
        timeline.to(props, {
          autoAlpha: (index) => Math.max(0.5, 0.9 - index * 0.035),
          y: 0,
          scale: 1,
          duration: 0.82,
          stagger: 0.07
        }, 0.28);
      }
      if (woman) timeline.to(woman, { autoAlpha: 1, x: 0, y: 0, rotation: 0, duration: 1.08 }, 0.38);
      if (scribe) timeline.to(scribe, { autoAlpha: 1, x: 0, y: 0, rotation: 0, duration: 1.08 }, 0.58);
      if (title) timeline.to(title, { autoAlpha: 1, y: 0, duration: 0.58 }, 0.62);
      if (lines.length) timeline.to(lines, { autoAlpha: 1, y: 0, duration: 0.72, stagger: 0.62 }, 0.82);
      if (actors.length) {
        timeline.to(actors, {
          y: (index) => index ? 1.5 : -1.5,
          rotation: (index) => index ? -0.45 : 0.45,
          duration: 1.8,
          ease: "sine.inOut"
        }, 2.15);
      }
    }

    addSceneMotion(timeline, transition);

    createOnceTrigger(transition, timeline, isMobile ? "top 90%" : "top 80%");

    // Mobile browsers can restore or jump the page past ScrollTrigger's start
    // boundary. A native visibility trigger keeps the chapter-zero stage and
    // its dialogue from remaining in their intentionally dimmed setup state.
    if (isMobilePrologue && "IntersectionObserver" in window) {
      const mobileVisibilityTrigger = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        playOnce(timeline);
        mobileVisibilityTrigger.disconnect();
      }, { rootMargin: "0px 0px 8% 0px", threshold: 0.01 });
      mobileVisibilityTrigger.observe(transition);
      cleanups.push(() => mobileVisibilityTrigger.disconnect());
    }
    return true;
  };

  const initTransitions = () => {
    all(".tt-transition[data-shadow-scene]").forEach((transition) => {
      if (mountTransition(transition)) return;
      const observer = new MutationObserver(() => {
        if (mountTransition(transition)) observer.disconnect();
      });
      observer.observe(transition, { childList: true, subtree: true });
      cleanups.push(() => observer.disconnect());
    });
  };

  const initChapters = () => {
    const chapters = all(".tt-chapter");
    chapters.forEach((chapter, index) => {
      const grid = one(".tt-chapter-grid", chapter);
      const mark = one(".tt-chapter-mark", chapter);
      const heading = one(".tt-prose > h2", chapter);
      const prose = one(".tt-prose", chapter);
      const intro = prose ? Array.from(prose.children).filter((item) => item.tagName === "P").slice(0, 2) : [];
      const ronghua = one(".tt-ronghua-scatter", chapter);
      const direction = index % 2 === 0 ? -1 : 1;
      const timeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

      if (grid) gsap.set(grid, { autoAlpha: 0, y: 36 });
      if (mark) gsap.set(mark, { autoAlpha: 0, x: direction * 22 });
      if (heading) gsap.set(heading, { autoAlpha: 0, y: 24 });
      if (intro.length) gsap.set(intro, { autoAlpha: 0, y: 17 });

      let ronghuaOpacity = 0.25;
      if (ronghua) {
        const value = parseFloat(getComputedStyle(ronghua).getPropertyValue("--tt-ronghua-opacity"));
        if (Number.isFinite(value)) ronghuaOpacity = value;
        gsap.set(ronghua, { autoAlpha: 0, x: direction * (isMobile ? 54 : 126), y: 32, scale: 0.72 });
      }

      timeline.call(() => chapter.classList.add("is-visible"), null, 0);
      if (ronghua) timeline.to(ronghua, { autoAlpha: ronghuaOpacity, x: 0, y: 0, scale: 1, duration: 1.65 }, 0);
      if (grid) timeline.to(grid, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.1);
      if (mark) timeline.to(mark, { autoAlpha: 1, x: 0, duration: 0.68 }, 0.28);
      if (heading) timeline.to(heading, { autoAlpha: 1, y: 0, duration: 0.78 }, 0.34);
      if (intro.length) timeline.to(intro, { autoAlpha: 1, y: 0, duration: 0.62, stagger: 0.1 }, 0.52);

      createOnceTrigger(chapter, timeline, isMobile ? "top 92%" : "top 84%");

      if (ronghua && !isTouch) {
        gsap.to(ronghua, {
          yPercent: direction * 8,
          ease: "none",
          scrollTrigger: { trigger: chapter, start: "top bottom", end: "bottom top", scrub: 1.25 }
        });
      }
    });

    const revealCards = all([
      ".tt-prose > .tt-box",
      ".tt-prose > .tt-classic",
      ".tt-prose > .tt-editorial-rule",
      ".tt-timeline article",
      ".tt-fact-grid article",
      ".tt-verdict-card",
      ".tt-action-grid article",
      ".tt-questions li"
    ].join(","));

    revealCards.forEach((card, index) => {
      const fromX = card.matches(".tt-questions li") ? -18 : 0;
      gsap.set(card, { autoAlpha: 0, x: fromX, y: 24, scale: card.matches("article") ? 0.985 : 1 });
      const reveal = () => gsap.to(card, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.7,
        delay: (index % 4) * 0.035,
        ease: "power3.out",
        overwrite: "auto"
      });
      ScrollTrigger.create({
        trigger: card,
        start: "top 93%",
        once: true,
        onEnter: reveal,
        onEnterBack: reveal
      });
    });
  };

  const initSources = () => {
    const sources = one(".tt-sources");
    if (!sources) return;
    const heading = one("h2", sources);
    const links = all(".tt-source-grid a", sources);
    const note = one(".tt-source-note", sources);
    const timeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
    if (heading) timeline.fromTo(heading, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.72 }, 0);
    if (links.length) timeline.fromTo(links, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.62, stagger: 0.08 }, 0.16);
    if (note) timeline.fromTo(note, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, 0.48);
    createOnceTrigger(sources, timeline, "top 88%");
  };

  const initEnding = () => {
    const ending = one("[data-tt-ending]");
    if (!ending) return;
    const theatre = one(".tt-ending-theatre", ending);
    const panorama = one(".tt-ending-panorama", ending);
    const panoramaImage = panorama && one("img", panorama);
    const copy = one(".tt-ending-copy", ending);
    const skip = one("[data-tt-ending-skip]", ending);
    const light = one(".tt-ending-theatre-light", ending);
    const bloom = one(".tt-ending-theatre-bloom", ending);
    const woman = one(".tt-ending-theatre-puppet--woman", ending);
    const scribe = one(".tt-ending-theatre-puppet--scribe", ending);
    const womanSprite = woman && one("i", woman);
    const scribeSprite = scribe && one("i", scribe);
    const title = one(".tt-ending-theatre-script > small", ending);
    const lines = all(".tt-ending-theatre-script > p", ending);
    const leftCurtain = one(".tt-stage-curtain--ending .tt-stage-curtain-panel--left", ending);
    const rightCurtain = one(".tt-stage-curtain--ending .tt-stage-curtain-panel--right", ending);
    const valance = one(".tt-stage-curtain--ending .tt-stage-curtain-valance", ending);

    if (!theatre || !panorama || !copy) return;

    gsap.set(theatre, { autoAlpha: 1, visibility: "visible" });
    gsap.set(panorama, { autoAlpha: 0, visibility: "hidden" });
    gsap.set(copy, { autoAlpha: 0, visibility: "hidden", pointerEvents: "none" });
    gsap.set(copy.children, { autoAlpha: 0, y: 18 });
    if (skip) gsap.set(skip, { autoAlpha: 0, visibility: "hidden", y: -6 });
    if (light) gsap.set(light, { autoAlpha: 0, xPercent: 0 });
    if (bloom) gsap.set(bloom, { autoAlpha: 0, xPercent: -50, scale: 0.65, rotation: -5 });
    if (woman) gsap.set(woman, { autoAlpha: 0, xPercent: -12, rotation: -1.5 });
    if (scribe) gsap.set(scribe, { autoAlpha: 0, xPercent: 12, rotation: 1.5 });
    if (title) gsap.set(title, { autoAlpha: 0, y: 7 });
    if (lines.length) gsap.set(lines, { autoAlpha: 0, y: 16 });
    if (leftCurtain) gsap.set(leftCurtain, { xPercent: 0 });
    if (rightCurtain) gsap.set(rightCurtain, { xPercent: 0 });
    if (valance) gsap.set(valance, { autoAlpha: 0, yPercent: -30, scaleY: 0.75 });

    const showFinal = () => {
      ending.classList.add("is-gsap-complete");
      theatre.setAttribute("aria-hidden", "true");
      gsap.set(theatre, { autoAlpha: 0, visibility: "hidden", pointerEvents: "none" });
      if (skip) gsap.set(skip, { autoAlpha: 0, visibility: "hidden" });
      gsap.set(panorama, { autoAlpha: 1, visibility: "visible", filter: "none" });
      if (panoramaImage) gsap.set(panoramaImage, { scale: 1 });
      gsap.set(copy, { autoAlpha: 1, visibility: "visible", pointerEvents: "auto" });
      gsap.set(copy.children, { autoAlpha: 1, y: 0 });
    };

    const timeline = gsap.timeline({
      paused: true,
      defaults: { ease: "power3.out" },
      onStart: () => {
        theatre.removeAttribute("aria-hidden");
        ending.classList.add("is-visible", "is-gsap-playing");
      },
      onComplete: () => {
        ending.classList.remove("is-gsap-playing");
        showFinal();
      }
    });

    if (skip) timeline.to(skip, { autoAlpha: 1, visibility: "visible", y: 0, duration: 0.34 }, 0.12);
    if (valance) timeline.to(valance, { autoAlpha: 1, yPercent: 0, scaleY: 1, duration: 0.82 }, 0.04);
    if (leftCurtain) timeline.to(leftCurtain, { xPercent: -102, duration: 1.6, ease: "power2.inOut" }, 0.38);
    if (rightCurtain) timeline.to(rightCurtain, { xPercent: 102, duration: 1.6, ease: "power2.inOut" }, 0.38);
    if (light) timeline.to(light, { autoAlpha: 0.82, duration: 0.8 }, 1.02);
    if (woman) timeline.to(woman, { autoAlpha: 1, xPercent: 0, rotation: 0, duration: 1.0 }, 1.05);
    if (scribe) timeline.to(scribe, { autoAlpha: 1, xPercent: 0, rotation: 0, duration: 1.0 }, 1.2);
    if (title) timeline.to(title, { autoAlpha: 1, y: 0, duration: 0.56 }, 1.36);
    if (bloom) timeline.to(bloom, { autoAlpha: 0.66, scale: 1, rotation: 0, duration: 1.15 }, 1.5);

    const cueLine = (index, start, duration, speaker) => {
      const line = lines[index];
      if (!line) return;
      const focusLeft = speaker === "woman";
      timeline.to(line, { autoAlpha: 1, y: 0, duration: 0.45 }, start);
      timeline.to(line, { autoAlpha: 0, y: -8, duration: 0.34 }, start + duration);
      if (light) timeline.to(light, { xPercent: focusLeft ? -40 : 40, autoAlpha: 0.9, duration: 0.55 }, start - 0.08);
      if (focusLeft && woman) timeline.to(woman, { xPercent: 2, rotation: 0.45, duration: 0.55 }, start - 0.05);
      if (!focusLeft && scribe) timeline.to(scribe, { xPercent: -2, rotation: -0.45, duration: 0.55 }, start - 0.05);
      if (focusLeft && womanSprite) timeline.set(womanSprite, { backgroundPosition: index === 2 ? "100% 0" : "50% 0" }, start - 0.02);
      if (!focusLeft && scribeSprite) timeline.set(scribeSprite, { backgroundPosition: index === 3 ? "100% 0" : "50% 0" }, start - 0.02);
    };

    cueLine(0, 2.45, 2.12, "woman");
    cueLine(1, 5.2, 2.12, "scribe");
    cueLine(2, 7.92, 1.9, "woman");
    cueLine(3, 10.35, 2.62, "scribe");

    if (womanSprite) timeline.set(womanSprite, { backgroundPosition: "0 100%" }, 13.15);
    if (scribeSprite) timeline.set(scribeSprite, { backgroundPosition: "0 100%" }, 13.15);
    if (woman) timeline.to(woman, { rotation: 7, y: 8, duration: 0.8, ease: "power2.inOut" }, 13.15);
    if (scribe) timeline.to(scribe, { rotation: -7, y: 8, duration: 0.8, ease: "power2.inOut" }, 13.15);
    if (bloom) timeline.to(bloom, { autoAlpha: 0, scale: 0.92, rotation: 3, duration: 0.7 }, 13.28);
    if (title) timeline.to(title, { autoAlpha: 0, y: -5, duration: 0.45 }, 13.4);
    if (leftCurtain) timeline.to(leftCurtain, { xPercent: 0, duration: 1.55, ease: "power2.inOut" }, 13.75);
    if (rightCurtain) timeline.to(rightCurtain, { xPercent: 0, duration: 1.55, ease: "power2.inOut" }, 13.75);
    if (light) timeline.to(light, { autoAlpha: 0, xPercent: 0, duration: 0.8 }, 13.72);
    if (skip) timeline.to(skip, { autoAlpha: 0, y: -5, duration: 0.35 }, 14.35);
    timeline.set(panorama, { visibility: "visible", autoAlpha: 0 }, 15.2);
    if (panoramaImage) timeline.fromTo(panoramaImage, { scale: 1.055 }, { scale: 1, duration: 1.8, ease: "power2.out" }, 15.2);
    timeline.to(theatre, { autoAlpha: 0, visibility: "hidden", duration: 0.86 }, 15.32);
    timeline.to(panorama, { autoAlpha: 1, filter: "saturate(1) brightness(1)", duration: 1.18 }, 15.38);
    timeline.set(copy, { visibility: "visible", pointerEvents: "auto" }, 15.82);
    timeline.to(copy, { autoAlpha: 1, duration: 0.7 }, 15.82);
    timeline.to(copy.children, { autoAlpha: 1, y: 0, duration: 0.62, stagger: 0.08 }, 15.92);

    const playEnding = () => {
      if (ending.classList.contains("is-epilogue-skipped")) {
        showFinal();
        return;
      }
      playOnce(timeline);
    };

    ScrollTrigger.create({
      trigger: ending,
      start: isMobile ? "top 88%" : "top 72%",
      once: true,
      onEnter: playEnding,
      onEnterBack: playEnding
    });

    if (skip) {
      skip.addEventListener("click", () => {
        timeline.pause();
        showFinal();
      });
    }

    const endingObserver = new MutationObserver(() => {
      if (!ending.classList.contains("is-epilogue-skipped")) return;
      timeline.pause();
      showFinal();
    });
    endingObserver.observe(ending, { attributes: true, attributeFilter: ["class"] });
    cleanups.push(() => endingObserver.disconnect());
  };

  const initFinePointerEffects = () => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const targets = all(".tt-guide-links a, .tt-source-grid a, .tt-ending-actions a");
    targets.forEach((target) => {
      const enter = () => gsap.to(target, { y: -4, duration: 0.26, ease: "power2.out", overwrite: "auto" });
      const leave = () => gsap.to(target, { y: 0, duration: 0.32, ease: "power2.out", overwrite: "auto" });
      target.addEventListener("mouseenter", enter);
      target.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        target.removeEventListener("mouseenter", enter);
        target.removeEventListener("mouseleave", leave);
      });
    });
  };

  const initialise = () => {
    gsap.context(() => {
      initOpening();
      initHero();
      initGuide();
      initTransitions();
      initChapters();
      initSources();
      initEnding();
      initFinePointerEffects();
    }, doc.body);
    root.classList.add("tt-gsap-ready");

    const refresh = () => window.requestAnimationFrame(() => ScrollTrigger.refresh());
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(refresh).catch(() => {});
    window.addEventListener("load", refresh, { once: true });
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) refresh();
    });
  };

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", initialise, { once: true });
  } else {
    initialise();
  }

  window.addEventListener("pagehide", () => {
    cleanups.splice(0).forEach((cleanup) => cleanup());
  }, { once: true });
})();
