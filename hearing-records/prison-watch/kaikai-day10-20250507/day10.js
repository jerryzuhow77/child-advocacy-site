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
    loading: '正在加载完整科刑辩论记录…',
    shown: (n) => `显示 ${n}／10 段`,
    empty: '没有符合条件的段落。',
    failed: '完整记录加载失败，请使用页面上方的原始来源链接。',
    titles: ['检察官科刑辩论','国民法官释疑与上午程序','刘彩萱辩护人科刑辩论','检察官就释疑事项说明','刘若琳辩护人科刑辩论','检察官补充辩论','刘彩萱辩护人补充辩论','刘若琳辩护人补充辩论','两名被告最后陈述','诉讼参与代理人与审理完毕']
  } : {
    loading: '正在載入完整科刑辯論紀錄…',
    shown: (n) => `顯示 ${n}／10 段`,
    empty: '沒有符合條件的段落。',
    failed: '完整紀錄載入失敗，請使用頁面上方的原始來源連結。',
    titles: ['檢察官科刑辯論','國民法官釋疑與上午程序','劉彩萱辯護人科刑辯論','檢察官就釋疑事項說明','劉若琳辯護人科刑辯論','檢察官補充辯論','劉彩萱辯護人補充辯論','劉若琳辯護人補充辯論','兩名被告最後陳述','訴訟參與代理人與審理完畢']
  };
  const actors = hans ? {
    prosecutor: { label: '检察官', badge: '检', side: 'left' },
    court: { label: '审判长／法院', badge: '院', side: 'left' },
    'caixuan-defense': { label: '刘彩萱辩护人', badge: '萱', side: 'right' },
    'ruolin-defense': { label: '刘若琳辩护人', badge: '琳', side: 'right' },
    defense: { label: '辩护人', badge: '辩', side: 'right' },
    'caixuan-defendant': { label: '被告刘彩萱', badge: '萱', side: 'right' },
    'ruolin-defendant': { label: '被告刘若琳', badge: '琳', side: 'right' },
    participant: { label: '诉讼参与代理人', badge: '参', side: 'left' }
  } : {
    prosecutor: { label: '檢察官', badge: '檢', side: 'left' },
    court: { label: '審判長／法院', badge: '院', side: 'left' },
    'caixuan-defense': { label: '劉彩萱辯護人', badge: '萱', side: 'right' },
    'ruolin-defense': { label: '劉若琳辯護人', badge: '琳', side: 'right' },
    defense: { label: '辯護人', badge: '辯', side: 'right' },
    'caixuan-defendant': { label: '被告劉彩萱', badge: '萱', side: 'right' },
    'ruolin-defendant': { label: '被告劉若琳', badge: '琳', side: 'right' },
    participant: { label: '訴訟參與代理人', badge: '參', side: 'left' }
  };
  status.textContent = copy.loading;

  const definitions = [
    { match: /^壹、[檢检]察官科刑[辯辩][論论]/, roles: ['prosecutor'], primary: 'prosecutor' },
    { match: /^10:23休庭/, roles: ['court','prosecutor'], primary: 'court' },
    { match: /^[貳贰]、[劉刘]彩萱[辯辩][護护]人科刑[辯辩][論论]/, roles: ['caixuan'], primary: 'caixuan-defense' },
    { match: /^13:41[續续]行[審审]理/, roles: ['court','prosecutor'], primary: 'prosecutor' },
    { match: /^肆、[劉刘]若琳[辯辩][護护]人科刑[辯辩][論论]/, roles: ['ruolin'], primary: 'ruolin-defense' },
    { match: /^伍、[檢检]察官[補补]充[辯辩][論论]/, roles: ['prosecutor'], primary: 'prosecutor' },
    { match: /^[陸陆]、[劉刘]彩萱[辯辩][護护]人[補补]充[辯辩][論论]/, roles: ['caixuan'], primary: 'caixuan-defense' },
    { match: /^柒、[劉刘]若琳[辯辩][護护]人[補补]充[辯辩][論论]/, roles: ['ruolin'], primary: 'ruolin-defense' },
    { match: /^捌、被告[劉刘]彩萱最[後后][陳陈]述/, roles: ['caixuan','ruolin'], primary: 'caixuan-defendant' },
    { match: /^拾、[訴诉][訟讼][參参][與与]代理人/, roles: ['court'], primary: 'participant' }
  ];

  const actorFromHeading = (line) => {
    if (/被告[劉刘]彩萱最[後后][陳陈]述/.test(line)) return 'caixuan-defendant';
    if (/被告[劉刘]若琳最[後后][陳陈]述/.test(line)) return 'ruolin-defendant';
    if (/[訴诉][訟讼][參参][與与]代理人[：:]/.test(line)) return 'participant';
    if (/[劉刘]彩萱[辯辩][護护]人(?:科刑|[補补]充)[辯辩][論论]/.test(line)) return 'caixuan-defense';
    if (/[劉刘]若琳[辯辩][護护]人(?:科刑|[補补]充)[辯辩][論论]/.test(line)) return 'ruolin-defense';
    if (/[檢检]察官(?:科刑|[補补]充)[辯辩][論论]/.test(line)) return 'prosecutor';
    return null;
  };

  const actorFromSpeaker = (line, primary) => {
    const normalized = line.replace(/^[※＊*]\s*/, '');
    if (/^[審审]判[長长][：:]/.test(normalized) || /^[審审]判[長长]裁定/.test(normalized)) return 'court';
    if (/^[檢检]察官[：:]/.test(normalized)) return 'prosecutor';
    if (/^[劉刘]彩萱[辯辩][護护]人[：:]/.test(normalized)) return 'caixuan-defense';
    if (/^[劉刘]若琳[辯辩][護护]人[：:]/.test(normalized)) return 'ruolin-defense';
    if (/^[辯辩][護护]人[：:]/.test(normalized)) return primary.includes('defense') ? primary : 'defense';
    if (/^[訴诉][訟讼][參参][與与]代理人[：:]/.test(normalized)) return 'participant';
    return null;
  };

  const isStageLine = (line) => /^(?:\d{1,4}(?::\d{2})?\s*(?:休庭|入庭|[續续]行[審审]理|休息)|114年.*(?:[審审]理完[畢毕]|宣判)|〔.*(?:旁[聽听]席鼓掌).*〕|→(?:[調调]整成))/.test(line);

  const normalizeParagraph = (paragraphLines) => {
    if (paragraphLines.some(line => /[▕┼_]| {3,}/.test(line))) return paragraphLines.join('\n');
    return paragraphLines.reduce((text, line, index) => {
      if (!index) return line;
      const structural = /^(?:\d+[.、]|[一二三四五六七八九十]+[、：:]|（[一二三四五六七八九十\d]+）|[A-Z]\.|[•→])/u.test(line);
      return `${text}${structural ? '\n' : ''}${line}`;
    }, '');
  };

  const buildDialogue = (section) => {
    const segments = [];
    let persistentActor = section.primary;
    let currentActor = persistentActor;
    let paragraph = [];

    const appendSegment = (kind, actor, text) => {
      if (!text.trim()) return;
      const previous = segments[segments.length - 1];
      if (kind === 'speech' && previous?.kind === kind && previous.actor === actor) {
        previous.paragraphs.push(text);
      } else {
        segments.push({ kind, actor, paragraphs: [text] });
      }
    };

    const flush = () => {
      if (!paragraph.length) return;
      const text = normalizeParagraph(paragraph);
      appendSegment(isStageLine(text) ? 'stage' : 'speech', currentActor, text);
      paragraph = [];
      currentActor = persistentActor;
    };

    section.text.split('\n').forEach(rawLine => {
      const line = rawLine.trim();
      if (!line) {
        flush();
        return;
      }

      const headingActor = actorFromHeading(line);
      if (headingActor) {
        flush();
        persistentActor = headingActor;
        currentActor = headingActor;
        paragraph.push(line);
        return;
      }

      const explicitActor = actorFromSpeaker(line, persistentActor);
      if (explicitActor) {
        flush();
        currentActor = explicitActor;
        paragraph.push(line);
        return;
      }

      if (isStageLine(line)) {
        flush();
        paragraph.push(line);
        flush();
        return;
      }

      paragraph.push(line);
    });
    flush();

    const transcript = document.createElement('div');
    transcript.className = 'record-transcript';
    segments.forEach(segment => {
      if (segment.kind === 'stage') {
        const note = document.createElement('aside');
        note.className = 'record-stage-note';
        note.textContent = segment.paragraphs.join('\n');
        transcript.appendChild(note);
        return;
      }

      const actor = actors[segment.actor] || actors.defense;
      const speech = document.createElement('article');
      speech.className = `record-speech is-${actor.side} speaker-${segment.actor}`;
      speech.setAttribute('aria-label', actor.label);

      const speakerLabel = document.createElement('header');
      speakerLabel.className = 'record-speaker';
      const badge = document.createElement('span');
      badge.setAttribute('aria-hidden', 'true');
      badge.textContent = actor.badge;
      const name = document.createElement('strong');
      name.textContent = actor.label;
      speakerLabel.append(badge, name);

      const bubble = document.createElement('div');
      bubble.className = 'record-speech-bubble';
      segment.paragraphs.forEach(text => {
        const paragraphNode = document.createElement('p');
        paragraphNode.textContent = text;
        bubble.appendChild(paragraphNode);
      });
      speech.append(speakerLabel, bubble);
      transcript.appendChild(speech);
    });
    return transcript;
  };

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
      primary: def.primary,
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

      details.append(summary, buildDialogue(section));
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
