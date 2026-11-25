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

    const pinned = cards.find(card => new URL(card.href).pathname.includes(pinnedPath));
    const recent = cards
      .filter(card => card !== pinned)
      .sort((a, b) => (b.querySelector('time')?.dateTime || '').localeCompare(a.querySelector('time')?.dateTime || ''))
      .slice(0, 9);

    if (pinned) pinned.classList.add('featured');
    grid.replaceChildren(...[pinned, ...recent].filter(Boolean));
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

  applyPreview();
  window.addEventListener('load', applyPreview, { once: true });
})();

