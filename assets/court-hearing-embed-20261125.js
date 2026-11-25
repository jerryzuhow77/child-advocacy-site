(() => {
  const mount = () => {
    const card = document.getElementById('court-hearing-home-20270108');
    if (!card) return;

    const video = card.querySelector('video');
    const isHans = document.documentElement.lang === 'zh-Hans' ||
      new URLSearchParams(location.search).get('lang') === 'zh-Hans';
    const locale = isHans ? 'zh-Hans' : 'zh-Hant';
    const base = './assets/video/kaikai-cinema-';
    video.src = `${base}${locale}-court-20261125.mp4`;
    video.poster = `${base}${locale}-court-poster-20261125.jpg`;
    video.setAttribute('aria-label', isHans ? '剀剀守护动画，简体中文字幕，三分钟' : '剴剴守護動畫，繁體中文字幕，三分鐘');
    card.dataset.videoLocale = locale;

    const layer = card.querySelector('.court-home-snow');
    if (!layer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const gsap = window.gsap;
    const count = window.innerWidth <= 700 ? 10 : 18;
    const flakes = Array.from({ length: count }, (_, i) => {
      const flake = document.createElement('i');
      flake.className = 'court-home-flake';
      flake.style.left = `${(i * 53 + 11) % 98}%`;
      flake.style.top = `${(i * 29 + 7) % 90}%`;
      layer.append(flake);
      return flake;
    });

    if (!gsap) {
      layer.dataset.animationEngine = 'static';
      return;
    }

    layer.dataset.animationEngine = 'gsap';
    const height = Math.max(card.clientHeight, 260);
    const tweens = flakes.map((flake, i) => {
      const startY = -(i * 31 % height);
      const drift = (i % 2 ? 1 : -1) * (16 + i % 5 * 7);
      gsap.set(flake, { y: startY, opacity: .22 + i % 5 * .07, scale: .7 + i % 4 * .17 });
      return gsap.to(flake, {
        y: height + 30,
        x: drift,
        rotation: i % 5 === 0 ? 180 : 0,
        duration: 10 + i % 8,
        delay: -(i * .81),
        repeat: -1,
        ease: 'none'
      });
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        tweens.forEach(tween => tween.paused(!entry.isIntersecting));
      }, { threshold: .03 });
      observer.observe(card);
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
