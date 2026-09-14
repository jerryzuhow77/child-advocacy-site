(() => {
  const query = window.matchMedia("(max-width: 760px)");
  const rails = [...document.querySelectorAll(".home-court-horizontal-reel")];

  rails.forEach((rail) => {
    const cards = [...rail.children].filter((card) => card.classList.contains("home-news-card"));
    if (!cards.length) return;

    let frame = 0;
    const resize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!query.matches) {
          rail.style.removeProperty("height");
          return;
        }

        const railLeft = rail.getBoundingClientRect().left;
        const active = cards.reduce((closest, card) => {
          const distance = Math.abs(card.getBoundingClientRect().left - railLeft);
          return distance < closest.distance ? { card, distance } : closest;
        }, { card: cards[0], distance: Number.POSITIVE_INFINITY }).card;

        rail.style.height = `${Math.ceil(active.scrollHeight)}px`;
      });
    };

    rail.addEventListener("scroll", resize, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    query.addEventListener?.("change", resize);

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(resize);
      cards.forEach((card) => observer.observe(card));
    }

    resize();
    window.addEventListener("load", resize, { once: true });
  });
})();
