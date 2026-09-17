(() => {
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const gsap = window.gsap;
  if (reduce || !gsap) return;

  const ScrollTrigger = window.ScrollTrigger;
  if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  const priorityStrip = document.querySelector(".home-priority-strip");
  if (priorityStrip) {
    gsap.from(priorityStrip, { autoAlpha: 0, y: 20, duration: .7, ease: "power3.out" });
    const priorityItems = priorityStrip.querySelectorAll("h1, h2, h3, p, a, article, li");
    if (priorityItems.length) gsap.from(priorityItems, { autoAlpha: 0, y: 14, duration: .5, stagger: .055, ease: "power2.out", delay: .12 });
  }

  const hero = document.querySelector(".brief-embroidered .hero");
  const heroItems = hero ? hero.querySelectorAll(".eyebrow, h1, p") : [];
  const sections = [...document.querySelectorAll(".brief-embroidered main > .section")];
  const quickCards = [...document.querySelectorAll(".brief-quick-grid > p")];
  const galleryCards = [...document.querySelectorAll(".brief-embroidered .gallery figure")];
  const highlights = [...document.querySelectorAll(".brief-embroidered .highlight")];

  if (heroItems.length) {
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(heroItems, { autoAlpha: 0, y: 26, duration: .78, stagger: .13 })
      .from(".brief-embroidered .top a", { autoAlpha: 0, y: -10, duration: .42, stagger: .08 }, .12);
  }

  if (quickCards.length) {
    gsap.from(quickCards, {
      autoAlpha: 0, y: 18, scale: .97, duration: .52, stagger: .08, ease: "back.out(1.35)",
      scrollTrigger: ScrollTrigger ? { trigger: quickCards[0].parentElement, start: "top 82%", once: true } : undefined
    });
  }

  sections.forEach((section, index) => {
    gsap.from(section, {
      autoAlpha: 0, y: 28, duration: .7, ease: "power2.out",
      scrollTrigger: ScrollTrigger ? { trigger: section, start: "top 86%", once: true } : undefined,
      delay: index === 0 ? .06 : 0
    });
  });

  if (galleryCards.length) {
    gsap.from(galleryCards, {
      autoAlpha: 0, x: (_, el) => el === galleryCards[0] ? -24 : 24,
      duration: .72, stagger: .12, ease: "power3.out",
      scrollTrigger: ScrollTrigger ? { trigger: galleryCards[0].parentElement, start: "top 82%", once: true } : undefined
    });
    galleryCards.forEach(card => {
      card.addEventListener("pointerenter", () => gsap.to(card, { y: -5, boxShadow: "0 15px 30px rgba(91,54,27,.16)", duration: .28, ease: "power2.out", overwrite: true }));
      card.addEventListener("pointerleave", () => gsap.to(card, { y: 0, boxShadow: "0 0 0 rgba(91,54,27,0)", duration: .42, ease: "power2.out", overwrite: true }));
    });
  }

  highlights.forEach((highlight, index) => {
    gsap.fromTo(highlight, { backgroundSize: "0% 100%" }, {
      backgroundSize: "100% 100%", duration: .72, ease: "power2.out",
      scrollTrigger: ScrollTrigger ? { trigger: highlight, start: "top 88%", once: true } : undefined,
      delay: Math.min(index * .03, .18)
    });
  });

  document.querySelectorAll("[data-embroidered-brief]").forEach(node => {
    node.addEventListener("pointerenter", () => gsap.to(node, { y: -2, duration: .24, ease: "power2.out", overwrite: true }));
    node.addEventListener("pointerleave", () => gsap.to(node, { y: 0, duration: .36, ease: "power2.out", overwrite: true }));
  });
})();