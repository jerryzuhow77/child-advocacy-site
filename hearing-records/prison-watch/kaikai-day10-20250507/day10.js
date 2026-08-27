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
    titles: ['检察官科刑辩论','国民法官释疑与上午程序','刘彩萱辩护人科刑辩论','检察官就释疑事项说明','刘若琳辩护人科刑辩论','检察官补充辩论','刘彩萱辩护人补充辩论｜网页原文补遗','刘若琳辩护人补充辩论','两名被告最后陈述','诉讼参与代理人与审理完毕']
  } : {
    loading: '正在載入完整科刑辯論紀錄…',
    shown: (n) => `顯示 ${n}／10 段`,
    empty: '沒有符合條件的段落。',
    failed: '完整紀錄載入失敗，請使用頁面上方的原始來源連結。',
    titles: ['檢察官科刑辯論','國民法官釋疑與上午程序','劉彩萱辯護人科刑辯論','檢察官就釋疑事項說明','劉若琳辯護人科刑辯論','檢察官補充辯論','劉彩萱辯護人補充辯論｜網頁原文補遺','劉若琳辯護人補充辯論','兩名被告最後陳述','訴訟參與代理人與審理完畢']
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
  const sourceUrl = 'https://www.prisonwatch-tw.org/post/day10-2025%E5%B9%B45%E6%9C%887%E6%97%A5%EF%BC%88%E4%B8%89%EF%BC%89%E7%AC%AC%E5%8D%81%E6%AC%A1%E5%AF%A9%E5%88%A4%E6%9C%9F%E6%97%A5';
  const supplementalRecord = hans ? {
    label: '网页原文补遗',
    speaker: '刘彩萱辩护人',
    text: '一、台湾新北地方法院109年度诉字第137号刑事判决：凌虐幼童发育致死罪，处无期徒刑，褫夺公权终身。案情差异很大，处罚要符合比例。',
    boundary: '此项内容可见于监所关注小组繁体原始网页，未见于本站保存的7页PDF打印档；本站仅作简体转写并独立补列，不将它误标为PDF文字层。',
    link: '查看原始网页 ↗'
  } : {
    label: '網頁原文補遺',
    speaker: '劉彩萱辯護人',
    text: '一、臺灣新北地方法院109年度訴字第137號刑事判決：凌虐幼童發育致死罪，處無期徒刑，褫奪公權終身。案情差異很大，處罰要符合比例。',
    boundary: '此項內容可見於監所關注小組原始網頁，未見於本站保存的7頁PDF列印檔；本站獨立補列，不將它誤標為PDF文字層。',
    link: '查看原始網頁 ↗'
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
  const isSourceHeading = (line) => /^[壹貳贰參叁肆伍陸陆柒捌玖拾]、/.test(line) && !/[訴诉][訟讼][參参][與与]代理人[：:]/.test(line);
  const isTopicText = (text) => /^[一二三四五六七八九十百]+[、：:]/u.test(text);

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

    const appendSegment = (kind, actor, text, { forceNew = false, topic = false } = {}) => {
      if (!text.trim()) return;
      const previous = segments[segments.length - 1];
      if (!forceNew && kind === 'speech' && previous?.kind === kind && previous.actor === actor) {
        previous.paragraphs.push(text);
      } else {
        segments.push({ kind, actor, topic, paragraphs: [text] });
      }
    };

    const flush = () => {
      if (!paragraph.length) return;
      const text = normalizeParagraph(paragraph);
      const kind = isStageLine(text) ? 'stage' : isSourceHeading(text) ? 'heading' : 'speech';
      const topic = kind === 'speech' && isTopicText(text);
      appendSegment(kind, currentActor, text, { forceNew: topic, topic });
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
        appendSegment('heading', headingActor, line, { forceNew: true });
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
      if (segment.kind === 'heading') {
        const caption = document.createElement('p');
        caption.className = 'record-source-caption';
        caption.textContent = segment.paragraphs.join('\n');
        transcript.appendChild(caption);
        return;
      }

      if (segment.kind === 'stage') {
        const note = document.createElement('aside');
        note.className = 'record-stage-note';
        note.textContent = segment.paragraphs.join('\n');
        transcript.appendChild(note);
        return;
      }

      const actor = actors[segment.actor] || actors.defense;
      const speech = document.createElement('article');
      speech.className = `record-speech is-${actor.side} speaker-${segment.actor}${segment.topic ? ' has-topic' : ''}`;
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

    if (section.supplement) {
      const supplement = document.createElement('aside');
      supplement.className = 'record-source-supplement';
      supplement.setAttribute('aria-label', section.supplement.label);

      const supplementHeader = document.createElement('header');
      const label = document.createElement('span');
      label.textContent = section.supplement.label;
      const link = document.createElement('a');
      link.href = sourceUrl;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = section.supplement.link;
      supplementHeader.append(label, link);

      const supplementSpeaker = document.createElement('strong');
      supplementSpeaker.textContent = section.supplement.speaker;
      const supplementText = document.createElement('p');
      supplementText.textContent = section.supplement.text;
      const boundary = document.createElement('small');
      boundary.textContent = section.supplement.boundary;
      supplement.append(supplementHeader, supplementSpeaker, supplementText, boundary);
      transcript.appendChild(supplement);
    }
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
      supplement: index === 6 ? supplementalRecord : null,
      text: lines.slice(indexes[index], indexes[index + 1] ?? lines.length).join('\n').replace(/\n{4,}/g, '\n\n\n').trim()
    }));

    host.replaceChildren(...sections.map((section, index) => {
      const details = document.createElement('details');
      details.className = 'record-section';
      details.dataset.roles = section.roles.join(' ');
      details.dataset.search = [section.title, section.text, section.supplement?.label, section.supplement?.speaker, section.supplement?.text, section.supplement?.boundary]
        .filter(Boolean)
        .join('\n')
        .toLocaleLowerCase(hans ? 'zh-CN' : 'zh-TW');
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

    const highlightNodes = [...host.querySelectorAll('.record-speech-bubble p, .record-stage-note, .record-source-caption, .record-source-supplement p, .record-source-supplement small')];
    highlightNodes.forEach(node => { node.dataset.sourceText = node.textContent; });

    const highlightQuery = (query) => {
      highlightNodes.forEach(node => {
        const sourceText = node.dataset.sourceText || '';
        node.replaceChildren();
        if (!query) {
          node.textContent = sourceText;
          return;
        }

        const normalizedText = sourceText.toLocaleLowerCase(hans ? 'zh-CN' : 'zh-TW');
        let cursor = 0;
        let matchIndex = normalizedText.indexOf(query, cursor);
        while (matchIndex !== -1) {
          if (matchIndex > cursor) node.append(document.createTextNode(sourceText.slice(cursor, matchIndex)));
          const mark = document.createElement('mark');
          mark.textContent = sourceText.slice(matchIndex, matchIndex + query.length);
          node.append(mark);
          cursor = matchIndex + query.length;
          matchIndex = normalizedText.indexOf(query, cursor);
        }
        if (cursor < sourceText.length) node.append(document.createTextNode(sourceText.slice(cursor)));
      });
    };

    const applyFilters = () => {
      const query = search.value.trim().toLocaleLowerCase(hans ? 'zh-CN' : 'zh-TW');
      const role = speaker.value;
      let visible = 0;
      host.querySelectorAll('.record-section').forEach(section => {
        const roleMatch = role === 'all' || section.dataset.roles.split(' ').includes(role);
        const queryMatch = !query || section.dataset.search.includes(query);
        section.hidden = !(roleMatch && queryMatch);
        if (!section.hidden) {
          visible += 1;
          if (query) section.open = true;
        }
      });
      highlightQuery(query);
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
