(() => {
  const menuButton = document.getElementById('medicalMenuButton');
  const nav = document.getElementById('medicalNav');
  const navLinks = [...document.querySelectorAll('#medicalNav a[href^="#"]')];
  const backToTop = document.querySelector('[data-back-to-top]');
  const filterButtons = [...document.querySelectorAll('[data-source-filter]')];
  const filterCards = [...document.querySelectorAll('[data-source-level]')];
  const filterStatus = document.querySelector('[data-filter-status]');
  const copyStatus = document.querySelector('[data-copy-status]');
  const copyButtons = [...document.querySelectorAll('[data-copy-citation]')];
  const shareButton = document.querySelector('[data-share-page]');
  const printButton = document.querySelector('[data-print-page]');
  const locale = document.documentElement.lang === 'zh-Hans' ? 'zh-Hans' : 'zh-Hant';
  const copy = locale === 'zh-Hans'
    ? {
        copied: '引用文字已复制。',
        copyFail: '无法自动复制，请手动选择文字。',
        all: '显示全部来源层级。',
        filtered: (count) => `目前显示 ${count} 个来源区块。`,
        shareTitle: '医疗责任厘清专区｜剀剀案第二章',
      }
    : {
        copied: '引用文字已複製。',
        copyFail: '無法自動複製，請手動選取文字。',
        all: '顯示全部來源層級。',
        filtered: (count) => `目前顯示 ${count} 個來源區塊。`,
        shareTitle: '醫療責任釐清專區｜剴剴案第二章',
      };

  const setMenu = (open) => {
    if (!menuButton || !nav) return;
    nav.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
  };

  const getHashTarget = (hash = location.hash) => {
    if (!hash || hash === '#') return null;
    try {
      return document.querySelector(hash);
    } catch (_) {
      return null;
    }
  };

  const revealTarget = (target) => {
    if (!target) return;
    let details = target.closest('details');
    while (details) {
      details.open = true;
      details = details.parentElement?.closest('details') || null;
    }
    target.style.contentVisibility = 'visible';
  };

  const alignHashTarget = (hash = location.hash) => {
    const target = getHashTarget(hash);
    if (!target) return;
    revealTarget(target);
    const rootStyle = getComputedStyle(document.documentElement);
    const padding = Number.parseFloat(rootStyle.scrollPaddingTop) || 0;
    const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - padding);
    const previous = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo({ top, left: window.scrollX, behavior: 'auto' });
    document.documentElement.style.scrollBehavior = previous;
  };

  menuButton?.addEventListener('click', () => {
    setMenu(!nav?.classList.contains('open'));
  });

  nav?.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    event.preventDefault();
    const hash = link.getAttribute('href');
    history.pushState(null, '', hash);
    setMenu(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => alignHashTarget(hash));
    });
  });

  document.addEventListener('click', (event) => {
    if (!nav?.classList.contains('open')) return;
    if (event.target.closest('#medicalNav') || event.target.closest('#medicalMenuButton')) return;
    setMenu(false);
  });

  const showToast = (message) => {
    if (!copyStatus) return;
    copyStatus.textContent = message;
    copyStatus.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => copyStatus.classList.remove('show'), 2400);
  };

  const applyFilter = (filter) => {
    let visibleCount = 0;
    filterCards.forEach((card) => {
      const levels = (card.dataset.sourceLevel || '').split(/\s+/).filter(Boolean);
      const visible = filter === 'all' || levels.includes(filter);
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    filterButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.sourceFilter === filter));
    });
    if (filterStatus) {
      filterStatus.textContent = filter === 'all' ? copy.all : copy.filtered(visibleCount);
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => applyFilter(button.dataset.sourceFilter || 'all'));
  });

  copyButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const text = button.dataset.copyCitation || '';
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        showToast(copy.copied);
      } catch (_) {
        showToast(copy.copyFail);
      }
    });
  });

  shareButton?.addEventListener('click', async () => {
    const payload = { title: copy.shareTitle, text: copy.shareTitle, url: location.href };
    try {
      if (navigator.share) {
        await navigator.share(payload);
      } else {
        await navigator.clipboard.writeText(location.href);
        showToast(copy.copied);
      }
    } catch (error) {
      if (error?.name !== 'AbortError') showToast(copy.copyFail);
    }
  });

  printButton?.addEventListener('click', () => window.print());

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });

  let scrollTicking = false;
  const updateBackToTop = () => {
    scrollTicking = false;
    backToTop?.classList.toggle('show', window.scrollY > 700);
  };
  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(updateBackToTop);
  }, { passive: true });
  updateBackToTop();

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`);
      });
    }, { rootMargin: '-25% 0px -62% 0px', threshold: [0.05, 0.2, 0.5] });
    sections.forEach((section) => observer.observe(section));
  }

  const revealHashTarget = () => {
    const target = getHashTarget();
    if (!target) return;
    revealTarget(target);
    requestAnimationFrame(() => alignHashTarget());
  };
  window.addEventListener('hashchange', revealHashTarget);
  window.addEventListener('load', revealHashTarget, { once: true });
  revealHashTarget();
  applyFilter('all');

  document.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-copy-transcript]');
    if (!button) return;
    const body = button.closest('.transcript-panel')?.querySelector('[data-transcript-body]');
    if (!body) return;
    const text = [...body.querySelectorAll('.transcript-line')]
      .map((line) => line.innerText.replace(/^\d{3}\s*/, ''))
      .join('\n');
    try {
      await navigator.clipboard.writeText(text);
      const original = button.textContent;
      button.textContent = locale === 'zh-Hans' ? '已复制' : '已複製';
      showToast(copy.copied);
      window.setTimeout(() => { button.textContent = original; }, 1400);
    } catch (_) {
      showToast(copy.copyFail);
    }
  });

})();
