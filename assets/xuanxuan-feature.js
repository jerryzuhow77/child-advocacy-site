document.documentElement.classList.add('js');
const reveal = document.querySelectorAll('.reveal');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), {threshold: .16});
  reveal.forEach(element => observer.observe(element));
} else { reveal.forEach(element => element.classList.add('is-visible')); }

// A quiet two-pixel reading line gives the longform a sense of movement
// without covering the records or turning the page into a dramatic replay.
if (!reducedMotion) {
  const progress = document.createElement('div');
  progress.className = 'xx-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);
  let ticking = false;
  const paintProgress = () => {
    const scrollable = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const ratio = Math.min(1, Math.max(0, scrollY / scrollable));
    progress.style.width = `${ratio * 100}%`;
    ticking = false;
  };
  addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(paintProgress);
      ticking = true;
    }
  }, {passive: true});
  addEventListener('resize', paintProgress, {passive: true});
  paintProgress();
}
