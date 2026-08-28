from pathlib import Path

JS_PATH = Path("hearing-records/prison-watch/kaikai-final-chapter/final-chapter.js")
TRAD_PATH = Path("hearing-records/prison-watch/kaikai-final-chapter/index.html")
SIMP_PATH = Path("hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/index.html")

js = JS_PATH.read_text(encoding="utf-8")

if "const stabilizeHashTarget" not in js:
    old = """  const revealHashTarget = (scroll = false) => {
  document.querySelectorAll('[data-depth-reveal=\"true\"]').forEach((node) => {
    node.removeAttribute('data-depth-reveal');
    node.querySelector(':scope > .depth-reveal-note')?.remove();
  });
  const target = getHashTarget();
  const closestSection = target?.closest('main section[data-reading-level]');
  const revealedSections = new Set();
  if (!closestSection) return revealedSections;

  let section = closestSection;
  while (section) {
    section.dataset.depthReveal = 'true';
    section.hidden = false;
    section.removeAttribute('aria-hidden');
    revealedSections.add(section);
    section = section.parentElement?.closest('main section[data-reading-level]') || null;
  }

  if (!closestSection.querySelector(':scope > .depth-reveal-note')) {
    const note = document.createElement('p');
    note.className = 'depth-reveal-note';
    note.textContent = copy.revealed;
    closestSection.prepend(note);
  }
  if (scroll) requestAnimationFrame(() => target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }));
  return revealedSections;
};"""

    new = """  let hashScrollSequence = 0;
  const revealTargetForNavigation = (target) => {
    if (!target) return;
    let node = target;
    while (node && node !== document.documentElement) {
      if (node.classList?.contains('reveal')) node.classList.add('in-view');
      if (node.matches?.('section[data-heavy=\"true\"]')) node.style.contentVisibility = 'visible';
      node = node.parentElement;
    }
  };
  const stabilizeHashTarget = (target, smooth = false) => {
    if (!target) return;
    const sequence = ++hashScrollSequence;
    revealTargetForNavigation(target);

    const expectedTop = () => {
      const value = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
      return Number.isFinite(value) ? value : 90;
    };
    const align = (behavior = 'auto') => {
      if (sequence !== hashScrollSequence || getHashTarget() !== target) return;
      revealTargetForNavigation(target);
      target.scrollIntoView({ behavior, block: 'start', inline: 'nearest' });
    };
    const correctLayoutShift = () => {
      if (sequence !== hashScrollSequence || getHashTarget() !== target) return;
      revealTargetForNavigation(target);
      const top = target.getBoundingClientRect().top;
      if (Math.abs(top - expectedTop()) > 8) align('auto');
    };

    requestAnimationFrame(() => align(smooth && !reduceMotion ? 'smooth' : 'auto'));
    [120, 360, 850, 1500].forEach((delay) => window.setTimeout(correctLayoutShift, delay));
    if (document.fonts?.ready) document.fonts.ready.then(() => window.setTimeout(correctLayoutShift, 0));
  };
  const cancelHashStabilization = () => { hashScrollSequence += 1; };
  window.addEventListener('wheel', cancelHashStabilization, { passive: true });
  window.addEventListener('touchstart', cancelHashStabilization, { passive: true });
  window.addEventListener('keydown', (event) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) cancelHashStabilization();
  });

  const revealHashTarget = (scroll = false) => {
  document.querySelectorAll('[data-depth-reveal=\"true\"]').forEach((node) => {
    node.removeAttribute('data-depth-reveal');
    node.querySelector(':scope > .depth-reveal-note')?.remove();
  });
  const target = getHashTarget();
  const closestSection = target?.closest('main section[data-reading-level]');
  const revealedSections = new Set();
  if (!closestSection) return revealedSections;

  let section = closestSection;
  while (section) {
    section.dataset.depthReveal = 'true';
    section.hidden = false;
    section.removeAttribute('aria-hidden');
    revealedSections.add(section);
    section = section.parentElement?.closest('main section[data-reading-level]') || null;
  }

  revealTargetForNavigation(target);
  if (!closestSection.querySelector(':scope > .depth-reveal-note')) {
    const note = document.createElement('p');
    note.className = 'depth-reveal-note';
    note.textContent = copy.revealed;
    closestSection.prepend(note);
  }
  if (scroll) stabilizeHashTarget(target, true);
  return revealedSections;
};"""

    if js.count(old) != 1:
        raise SystemExit(f"Expected one revealHashTarget block, found {js.count(old)}")
    js = js.replace(old, new, 1)

    old_listener = "  window.addEventListener('hashchange', () => applyReadingDepth(true));"
    new_listener = """  window.addEventListener('hashchange', () => applyReadingDepth(true));
  window.addEventListener('load', () => {
    const target = getHashTarget();
    if (target) stabilizeHashTarget(target, false);
  }, { once: true });"""
    if js.count(old_listener) != 1:
        raise SystemExit(f"Expected one hashchange listener, found {js.count(old_listener)}")
    js = js.replace(old_listener, new_listener, 1)

    old_initial = "  syncLifeToggle();\n  applyReadingDepth(false);\n\n  document.querySelectorAll('main section[id]')"
    new_initial = "  syncLifeToggle();\n  applyReadingDepth(Boolean(location.hash));\n\n  document.querySelectorAll('main section[id]')"
    if js.count(old_initial) != 1:
        raise SystemExit(f"Expected one initial depth call, found {js.count(old_initial)}")
    js = js.replace(old_initial, new_initial, 1)
    JS_PATH.write_text(js, encoding="utf-8")

for path in (TRAD_PATH, SIMP_PATH):
    html = path.read_text(encoding="utf-8")
    if "final-chapter.js?v=20260829-6" in html:
        continue
    old_cache = "final-chapter.js?v=20260828-5"
    if html.count(old_cache) != 1:
        raise SystemExit(f"{path}: expected one JS cache key, found {html.count(old_cache)}")
    path.write_text(html.replace(old_cache, "final-chapter.js?v=20260829-6", 1), encoding="utf-8")

print("Kaikai hash-stability patch applied")
