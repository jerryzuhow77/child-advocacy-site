(() => {
  const TEXT = {
    zhHant: {
      latest: '最新',
      hearings: '庭期',
      cases: '案件',
      features: '專題',
      join: '參與',
      news: '新聞',
      more: '更多內容',
      title: '最新發布 25 篇',
      note: '首先呈現 4 篇精選；可在本專區展開瀏覽完整 25 篇。',
      all: '查看全部文章',
      expandLatest: '展開全部 25 篇',
      collapseLatest: '收合文章',
      hearingCta: '查看最新庭期',
      hearingAll: '查看完整庭期表'
    },
    zhHans: {
      latest: '最新',
      hearings: '庭期',
      cases: '案件',
      features: '专题',
      join: '参与',
      news: '新闻',
      more: '更多内容',
      title: '最新发布 25 篇',
      note: '首先呈现 4 篇精选；可在本专区展开浏览完整 25 篇。',
      all: '查看全部文章',
      expandLatest: '展开全部 25 篇',
      collapseLatest: '收起文章',
      hearingCta: '查看最新庭期',
      hearingAll: '查看完整庭期表'
    }
  };

  const organizeLatest = (latest, grid) => {
    const cards = [...grid.querySelectorAll(':scope > .home-latest-25-card')];
    if (cards.length <= 4) return { count: cards.length, moreGrid: null };

    const moreGrid = document.createElement('div');
    moreGrid.id = 'home-latest-more-20261119';
    moreGrid.className = 'home-latest-more-grid';
    moreGrid.hidden = true;
    cards.slice(4).forEach(card => moreGrid.append(card));
    grid.insertAdjacentElement('afterend', moreGrid);
    latest.dataset.articleCount = String(cards.length);
    return { count: cards.length, moreGrid };
  };

  const simplifyNav = (nav, labels, hrefs) => {
    if (!nav) return [];
    const links = [...nav.querySelectorAll(':scope > a')];
    links.slice(0, 5).forEach((link, index) => {
      const span = link.querySelector('span') || link;
      span.textContent = labels[index];
      span.dataset.hans = TEXT.zhHans[['latest', 'hearings', 'cases', 'features', 'join'][index]];
      link.href = hrefs[index];
      link.dataset.hansHref = hrefs[index];
    });
    return links;
  };

  const mount = () => {
    const body = document.body;
    const main = document.querySelector('main#main-content');
    const hero = main?.querySelector('.ink-scroll-hero');
    const hearings = document.querySelector('#october-action-focus');
    const latest = document.querySelector('#home-latest-25-20261118');
    const grid = latest?.querySelector('.home-latest-25-grid');
    const isHans = document.documentElement.lang === 'zh-Hans';
    const copy = isHans ? TEXT.zhHans : TEXT.zhHant;

    body?.classList.add('home-winter-20261119');

    if (main && hero && main.firstElementChild !== hero) {
      main.insertBefore(hero, main.firstElementChild);
    }
    if (hearings && latest) {
      hearings.insertAdjacentElement('afterend', latest);
    }

    const latestCollection = grid
      ? organizeLatest(latest, grid)
      : { count: 0, moreGrid: null };

    const latestTitle = latest?.querySelector('h2');
    const latestNote = latest?.querySelector('.home-latest-25-note');
    const latestHead = latest?.querySelector('.home-latest-25-head');
    if (latestTitle) {
      latestTitle.textContent = copy.title;
      latestTitle.dataset.hans = TEXT.zhHans.title;
    }
    if (latestNote) {
      latestNote.textContent = copy.note;
      latestNote.dataset.hans = TEXT.zhHans.note;
    }
    if (latestHead && !latestHead.querySelector('.home-latest-all')) {
      const controls = document.createElement('div');
      controls.className = 'home-latest-head-controls';
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'home-latest-toggle';
      toggle.textContent = copy.expandLatest;
      toggle.dataset.hans = TEXT.zhHans.expandLatest;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', 'home-latest-more-20261119');
      const all = document.createElement('a');
      all.className = 'home-latest-all';
      all.href = './news/';
      all.dataset.hansHref = './zh-Hans/news/';
      all.dataset.hans = TEXT.zhHans.all;
      all.textContent = copy.all;
      toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        toggle.textContent = expanded ? copy.expandLatest : copy.collapseLatest;
        toggle.dataset.hans = expanded ? TEXT.zhHans.expandLatest : TEXT.zhHans.collapseLatest;
        latestCollection.moreGrid.hidden = expanded;
        latest?.classList.toggle('is-expanded', !expanded);
      });
      controls.append(latestNote);
      if (latestCollection.moreGrid && latestCollection.count > 4) controls.append(toggle);
      controls.append(all);
      latestHead.append(controls);
    }

    const navLabels = [copy.latest, copy.hearings, copy.cases, copy.features, copy.join];
    const navHrefs = ['#home-latest-25-20261118', '#october-action-focus', './cases/', '#home-special-features', '#join'];
    simplifyNav(document.querySelector('.primary-nav'), navLabels, navHrefs);

    const mobileNav = document.querySelector('.mobile-menu > nav');
    const mobileLinks = simplifyNav(mobileNav, navLabels, navHrefs);
    if (mobileNav && mobileLinks.length > 5 && !mobileNav.querySelector('.mobile-menu-more')) {
      const news = document.createElement('a');
      news.href = '#home-media-reports';
      news.textContent = copy.news;
      news.dataset.hans = TEXT.zhHans.news;
      mobileNav.append(news);

      const more = document.createElement('div');
      more.className = 'mobile-menu-more';
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'mobile-menu-more-toggle';
      toggle.textContent = copy.more;
      toggle.dataset.hans = TEXT.zhHans.more;
      toggle.setAttribute('aria-expanded', 'false');
      const links = document.createElement('div');
      links.className = 'mobile-menu-more-links';
      links.hidden = true;
      mobileLinks.slice(5).forEach(link => links.append(link));
      toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isOpen));
        links.hidden = isOpen;
      });
      more.append(toggle, links);
      mobileNav.append(more);

      mobileNav.addEventListener('click', event => {
        if (event.target.closest('a')) {
          mobileNav.closest('details')?.removeAttribute('open');
        }
      });
    }

    const heroPrimary = hero?.querySelector('.actions .button:first-child span');
    if (heroPrimary) {
      heroPrimary.textContent = copy.hearingCta;
      heroPrimary.dataset.hans = TEXT.zhHans.hearingCta;
    }

    const hearingAll = hearings?.querySelector('.upcoming-hearings-all span');
    if (hearingAll) {
      hearingAll.textContent = copy.hearingAll;
      hearingAll.dataset.hans = TEXT.zhHans.hearingAll;
    }

    const legalNotes = [...document.querySelectorAll('details')].find(details =>
      details.querySelector('summary')?.textContent.includes('法律爭議界限')
    );
    legalNotes?.removeAttribute('open');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }
})();
