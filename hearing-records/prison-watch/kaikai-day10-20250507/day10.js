document.documentElement.classList.add('js-ready');

document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('menuButton');
  const siteNav = document.getElementById('siteNav');
  if (menuButton && siteNav) {
    menuButton.addEventListener('click', () => {
      const open = siteNav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    siteNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
  }

  const revealNodes = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealNodes.forEach(node => observer.observe(node));
  } else {
    revealNodes.forEach(node => node.classList.add('in-view'));
  }

  initFullRecord();
});

async function initFullRecord() {
  const host = document.getElementById('recordSections');
  const status = document.getElementById('recordStatus');
  const search = document.getElementById('recordSearch');
  const speaker = document.getElementById('recordSpeaker');
  const expand = document.getElementById('expandAll');
  const collapse = document.getElementById('collapseAll');
  if (!host || !status || !search || !speaker) return;

  const hans = document.body.dataset.locale === 'zh-Hans';
  const copy = hans ? {
    loading: '正在加载7页文字层…',
    shown: (n) => `显示 ${n}／10 段`,
    empty: '没有符合条件的段落。',
    failed: '文字层加载失败，请使用页面上方的原始来源链接。',
    titles: ['检察官科刑辩论','国民法官释疑与上午程序','刘彩萱辩护人科刑辩论','检察官就释疑事项说明','刘若琳辩护人科刑辩论','检察官补充辩论','刘彩萱辩护人补充辩论','刘若琳辩护人补充辩论','两名被告最后陈述','诉讼参与代理人与审理完毕']
  } : {
    loading: '正在載入7頁文字層…',
    shown: (n) => `顯示 ${n}／10 段`,
    empty: '沒有符合條件的段落。',
    failed: '文字層載入失敗，請使用頁面上方的原始來源連結。',
    titles: ['檢察官科刑辯論','國民法官釋疑與上午程序','劉彩萱辯護人科刑辯論','檢察官就釋疑事項說明','劉若琳辯護人科刑辯論','檢察官補充辯論','劉彩萱辯護人補充辯論','劉若琳辯護人補充辯論','兩名被告最後陳述','訴訟參與代理人與審理完畢']
  };
  status.textContent = copy.loading;

  const definitions = [
    { match: /^壹、[檢检]察官科刑[辯辩][論论]/, roles: ['prosecutor'] },
    { match: /^10:23休庭/, roles: ['court','prosecutor'] },
    { match: /^[貳贰]、[劉刘]彩萱[辯辩][護护]人科刑[辯辩][論论]/, roles: ['caixuan'] },
    { match: /^13:41[續续]行[審审]理/, roles: ['court','prosecutor'] },
    { match: /^肆、[劉刘]若琳[辯辩][護护]人科刑[辯辩][論论]/, roles: ['ruolin'] },
    { match: /^伍、[檢检]察官[補补]充[辯辩][論论]/, roles: ['prosecutor'] },
    { match: /^[陸陆]、[劉刘]彩萱[辯辩][護护]人[補补]充[辯辩][論论]/, roles: ['caixuan'] },
    { match: /^柒、[劉刘]若琳[辯辩][護护]人[補补]充[辯辩][論论]/, roles: ['ruolin'] },
    { match: /^捌、被告[劉刘]彩萱最[後后][陳陈]述/, roles: ['caixuan','ruolin'] },
    { match: /^拾、[訴诉][訟讼][參参][與与]代理人/, roles: ['court'] }
  ];

  try {
    const response = await fetch(document.body.dataset.textSource, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const raw = await response.text();
    const lines = raw.replace(/\r/g, '').split('\n').map(line => line.trimEnd()).filter(line => {
      const trimmed = line.trim();
      if (/^DAY10.*https:\/\//.test(trimmed)) return false;
      if (/^第\s*\d+\s*[頁页]，共\s*7\s*[頁页]/.test(trimmed)) return false;
      if (/^2026\/7\/15/.test(trimmed)) return false;
      return true;
    });

    const indexes = definitions.map(def => lines.findIndex(line => def.match.test(line.trim())));
    if (indexes.some(index => index < 0) || indexes.some((index, i) => i && index <= indexes[i - 1])) {
      throw new Error('Expected ten-section boundary was not found');
    }

    const sections = definitions.map((def, index) => ({
      number: index + 1,
      title: copy.titles[index],
      roles: def.roles,
      text: lines.slice(indexes[index], indexes[index + 1] ?? lines.length).join('\n').replace(/\n{4,}/g, '\n\n\n').trim()
    }));

    host.replaceChildren(...sections.map((section, index) => {
      const details = document.createElement('details');
      details.className = 'record-section';
      details.dataset.roles = section.roles.join(' ');
      details.dataset.search = `${section.title}\n${section.text}`.toLocaleLowerCase(hans ? 'zh-CN' : 'zh-TW');
      details.open = index === 0;

      const summary = document.createElement('summary');
      const number = document.createElement('span');
      number.textContent = String(section.number).padStart(2, '0');
      const title = document.createElement('b');
      title.textContent = section.title;
      summary.append(number, title);

      const pre = document.createElement('pre');
      pre.textContent = section.text;
      details.append(summary, pre);
      return details;
    }));

    const applyFilters = () => {
      const query = search.value.trim().toLocaleLowerCase(hans ? 'zh-CN' : 'zh-TW');
      const role = speaker.value;
      let visible = 0;
      host.querySelectorAll('.record-section').forEach(section => {
        const roleMatch = role === 'all' || section.dataset.roles.split(' ').includes(role);
        const queryMatch = !query || section.dataset.search.includes(query);
        section.hidden = !(roleMatch && queryMatch);
        if (!section.hidden) visible += 1;
      });
      status.textContent = visible ? copy.shown(visible) : copy.empty;
    };

    search.addEventListener('input', applyFilters);
    speaker.addEventListener('change', applyFilters);
    expand?.addEventListener('click', () => host.querySelectorAll('.record-section:not([hidden])').forEach(section => { section.open = true; }));
    collapse?.addEventListener('click', () => host.querySelectorAll('.record-section').forEach(section => { section.open = false; }));
    applyFilters();
  } catch (error) {
    console.error('DAY10 text layer:', error);
    status.textContent = copy.failed;
    const message = document.createElement('p');
    message.className = 'load-error';
    message.textContent = copy.failed;
    host.replaceChildren(message);
  }
}
