(() => {
  const root = document.querySelector('#home-latest-25-20261118');
  if (!root) return;

  const grid = root.querySelector('.home-latest-25-grid');
  const note = root.querySelector('.home-latest-25-note');
  const pinnedPath = '/child-advocacy-site/features/social-observation/chen-shangjie-appeal-issues-20261115/';

  const applyPreview = () => {
    const weekly = grid.querySelector('.weekly-policy-latest');
    const weeklyCard = weekly && (() => {
      const card = document.createElement('a');
      const sourceTitle = weekly.querySelector('h3');
      const sourceTime = weekly.querySelector('time');
      const sourceImage = weekly.querySelector('img');
      card.className = 'home-latest-25-card';
      card.href = weekly.href;
      if (sourceImage) card.append(sourceImage.cloneNode(true));
      if (sourceTime) card.append(sourceTime.cloneNode(true));
      const title = document.createElement('strong');
      title.textContent = sourceTitle?.textContent || '';
      if (sourceTitle?.dataset.hans) title.dataset.hans = sourceTitle.dataset.hans;
      card.append(title);
      return card;
    })();
    const cards = [...grid.querySelectorAll('.home-latest-25-card'), weeklyCard].filter(Boolean);
    if (!cards.length) return;

    let pinned = cards.find(card => new URL(card.href).pathname.includes(pinnedPath));
    if (!pinned) {
      const template = cards.find(card => card.classList.contains('home-latest-25-card'));
      if (template) {
        pinned = template.cloneNode(true);
        pinned.href = document.documentElement.lang === 'zh-Hans'
          ? 'https://cn.globalprotectionwall.com/child-advocacy-site/features/social-observation/chen-shangjie-appeal-issues-20261115/?lang=zh-Hans'
          : 'https://jerryzuhow77.github.io/child-advocacy-site/features/social-observation/chen-shangjie-appeal-issues-20261115/';
        const title = pinned.querySelector('strong, h3');
        if (title) title.textContent = document.documentElement.lang === 'zh-Hans'
          ? '不是职称，而是信息、权限与可作为性｜十五章旁听笔记'
          : '不是職稱，而是資訊、權限與可作為性｜十五章旁聽筆記';
        const time = pinned.querySelector('time');
        if (time) { time.dateTime = '2026-11-15'; time.textContent = '2026/11/15'; }
      }
    }
    const recent = cards
      .filter(card => card !== pinned)
      .sort((a, b) => (b.querySelector('time')?.dateTime || '').localeCompare(a.querySelector('time')?.dateTime || ''))
      .slice(0, 9);

    if (pinned) pinned.classList.add('featured');
    const ordered = [pinned, ...recent].filter(Boolean);
    const current = [...grid.children];
    const needsRebuild = current.length !== ordered.length || current.some((card, index) => card !== ordered[index]);
    if (needsRebuild) grid.replaceChildren(...ordered);
    if (note) {
      const hans = document.documentElement.lang === 'zh-Hans';
      note.textContent = hans
        ? '置顶精选后，依发布日期排序；预览十篇文章。'
        : '置頂精選後，依發布日期排序；預覽十篇文章。';
    }
  };

  const style = document.createElement('style');
  style.textContent = `
    .home-latest-25-card.featured {
      grid-column: 1 / -1;
      aspect-ratio: auto;
      min-height: 240px;
      padding: clamp(22px, 4vw, 48px);
      justify-content: end;
    }
    .home-latest-25-card.featured::after {
      background: linear-gradient(90deg, #173c50ec 0%, #173c50aa 52%, #173c5044 100%);
    }
    .home-latest-25-card.featured strong {
      max-width: 42rem;
      font-size: clamp(22px, 3.2vw, 38px);
      -webkit-line-clamp: 2;
    }
    .home-latest-25-card.featured time::before { content: '置頂精選 · '; }
    @media (max-width: 600px) {
      .home-latest-25-card.featured { min-height: 210px; padding: 24px; }
    }
  `;
  document.head.append(style);

  let queued = false;
  const schedulePreview = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      applyPreview();
    });
  };

  const observer = new MutationObserver(schedulePreview);
  observer.observe(grid, { childList: true });
  schedulePreview();
  window.addEventListener('load', () => { schedulePreview(); setTimeout(schedulePreview, 1200); setTimeout(schedulePreview, 3500); }, { once: true });
})();

