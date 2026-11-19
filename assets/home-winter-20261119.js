(() => {
  const TEXT = {
    zhHant: {
      latest: '最新',
      hearings: '庭期',
      cases: '案件',
      features: '專題',
      join: '參與',
      more: '更多內容',
      title: '最新發布',
      note: '精選近期重要內容；完整文章請前往新聞專區。',
      all: '查看全部文章',
      hearingCta: '查看最新庭期',
      hearingAll: '查看完整庭期表'
    },
    zhHans: {
      latest: '最新',
      hearings: '庭期',
      cases: '案件',
      features: '专题',
      join: '参与',
      more: '更多内容',
      title: '最新发布',
      note: '精选近期重要内容；完整文章请前往新闻专区。',
      all: '查看全部文章',
      hearingCta: '查看最新庭期',
      hearingAll: '查看完整庭期表'
    }
  };

  const trimLatest = grid => {
    [...grid.children].slice(4).forEach(card => card.remove());
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

    if (grid) {
      trimLatest(grid);
      new MutationObserver(() => trimLatest(grid)).observe(grid, { childList: true });
    }

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
      const all = document.createElement('a');
      all.className = 'home-latest-all';
      all.href = './news/';
      all.dataset.hansHref = './zh-Hans/news/';
      all.dataset.hans = TEXT.zhHans.all;
      all.textContent = copy.all;
      controls.append(latestNote, all);
      latestHead.append(controls);
    }

    const navLabels = [copy.latest, copy.hearings, copy.cases, copy.features, copy.join];
    const navHrefs = ['#home-latest-25-20261118', '#october-action-focus', './cases/', '#home-special-features', '#join'];
    simplifyNav(document.querySelector('.primary-nav'), navLabels, navHrefs);

    const mobileNav = document.querySelector('.mobile-menu > nav');
    const mobileLinks = simplifyNav(mobileNav, navLabels, navHrefs);
    if (mobileNav && mobileLinks.length > 5 && !mobileNav.querySelector('.mobile-menu-more')) {
      const more = document.createElement('details');
      more.className = 'mobile-menu-more';
      const summary = document.createElement('summary');
      summary.textContent = copy.more;
      summary.dataset.hans = TEXT.zhHans.more;
      const links = document.createElement('div');
      links.className = 'mobile-menu-more-links';
      mobileLinks.slice(5).forEach(link => links.append(link));
      more.append(summary, links);
      mobileNav.append(more);
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
