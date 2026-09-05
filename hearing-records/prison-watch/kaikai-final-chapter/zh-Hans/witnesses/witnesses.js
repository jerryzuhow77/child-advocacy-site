(() => {
  'use strict';
  const root = document.documentElement;
  const isHans = root.lang === 'zh-Hans';
  const copy = isHans
    ? { people: '名证人', copied: '已复制', denied: '浏览器未允许复制' }
    : { people: '名证人', copied: '已复制', denied: '浏览器未允许复制' };
  const header = document.querySelector('.topbar');
  const menuButton = document.getElementById('witnessMenuButton');
  const quickNav = document.getElementById('witnessQuickNav');
  const search = document.getElementById('witnessSearch');
  const cards = [...document.querySelectorAll('[data-witness-card]')];
  const resultCount = document.getElementById('resultCount');
  const noResults = document.getElementById('noResults');

  const updateOffset = () => {
    const h = header ? Math.ceil(header.getBoundingClientRect().height) : 70;
    root.style.setProperty('--w-anchor-offset', `${h + 18}px`);
  };
  updateOffset();
  addEventListener('resize', updateOffset, {passive:true});
  if ('ResizeObserver' in window && header) new ResizeObserver(updateOffset).observe(header);

  const normalize = value => value.toLocaleLowerCase(isHans ? 'zh-Hans' : 'zh-Hant').replace(/\s+/g, ' ').trim();
  const filterCards = () => {
    const query = normalize(search?.value || '');
    let visible = 0;
    cards.forEach(card => {
      const match = !query || normalize(card.dataset.search || card.textContent).includes(query);
      card.hidden = !match;
      if (match) visible += 1;
    });
    if (resultCount) resultCount.textContent = `${visible}${copy.people}`;
    if (noResults) noResults.hidden = visible !== 0;
  };
  search?.addEventListener('input', filterCards);

  document.getElementById('expandAll')?.addEventListener('click', () => {
    cards.filter(card => !card.hidden).forEach(card => card.querySelector('.transcript-panel')?.setAttribute('open',''));
  });
  document.getElementById('collapseAll')?.addEventListener('click', () => {
    cards.forEach(card => card.querySelector('.transcript-panel')?.removeAttribute('open'));
  });

  menuButton?.addEventListener('click', () => {
    const open = quickNav?.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  const openAncestors = target => {
    let node = target;
    while (node && node !== document.body) {
      if (node instanceof HTMLDetailsElement) node.open = true;
      if (node.hidden) node.hidden = false;
      node = node.parentElement;
    }
    if (target instanceof HTMLDetailsElement) target.open = true;
  };

  const jump = (hash, push = true) => {
    if (!hash || hash === '#') return false;
    const id = decodeURIComponent(hash.slice(1));
    const target = document.getElementById(id);
    if (!target) return false;
    openAncestors(target);
    quickNav?.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded','false');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const offset = parseFloat(getComputedStyle(root).getPropertyValue('--w-anchor-offset')) || 92;
      const top = Math.max(0, target.getBoundingClientRect().top + scrollY - offset);
      scrollTo({top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
      if (push && location.hash !== hash) history.pushState(null, '', hash);
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex','-1');
      target.focus({preventScroll:true});
      target.classList.add('anchor-flash');
      setTimeout(() => target.classList.remove('anchor-flash'), 1200);
    }));
    return true;
  };

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    if (jump(link.getAttribute('href'))) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
  addEventListener('popstate', () => jump(location.hash, false));
  if (location.hash) setTimeout(() => jump(location.hash, false), 120);

  document.addEventListener('click', async event => {
    const button = event.target.closest('[data-copy-transcript]');
    if (!button) return;
    const body = button.closest('.transcript-panel')?.querySelector('[data-transcript-body]');
    if (!body) return;
    const text = [...body.querySelectorAll('.transcript-line')].map(line => line.innerText.replace(/^\d{3}\s*/, '')).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      const original = button.textContent;
      button.textContent = copy.copied;
      setTimeout(() => button.textContent = original, 1400);
    } catch {
      button.textContent = copy.denied;
    }
  });
})();
