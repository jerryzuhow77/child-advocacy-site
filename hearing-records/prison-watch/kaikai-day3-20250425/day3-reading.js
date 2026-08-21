(() => {
  'use strict';

  const current = document.currentScript;
  const base = current ? new URL('./', current.src) : new URL('./', location.href);
  const isDay4 = document.body.classList.contains('day4-page');
  const coreVersion = '20260821-former-caregiver-checks-2';
  const load = src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });

  const getLocale = () => {
    const lang = (document.documentElement.lang || '').toLowerCase();
    const query = new URLSearchParams(location.search).get('lang');
    let stored = '';
    try { stored = localStorage.getItem('siteLang') || ''; } catch (_) { /* storage may be blocked */ }
    if (query === 'zh-Hans' || stored === 'zh-Hans' || lang.startsWith('zh-hans')) return 'zh-Hans';
    if (lang.startsWith('en')) return 'en';
    if (lang.startsWith('ja')) return 'ja';
    return 'zh-Hant';
  };

  const locale = getLocale();
  const copy = {
    'zh-Hant': {
      toc: '06A 前保母證詞核對',
      eyebrow: '06A · FORMER CAREGIVERS CROSS-CHECK',
      title: '兩位前保母證詞｜日期、交接與照顧階段核對',
      introTitle: '先分清楚：真正前後不一，或只是觀察時期不同',
      intro: '周○與蕭○香照顧孩子的月齡、期間與接觸資訊不同。以下只並列本頁原始紀錄能直接核對的六組內容：日期重疊屬明確待釐清；緊繃、哭泣、健康與外觀等差異，則必須先排除月齡、成長及交接資訊不同，不能直接標成互相矛盾。',
      recordA: '記錄 A',
      recordB: '記錄 B',
      reading: '判讀',
      source: '回到完整問答',
      method: '編輯方法｜「矛盾」僅用於同一時間軸或同一證人回答無法同時成立的文字；不同照顧期的差異標為「跨期對照」。證詞仍須與托育紀錄、寶寶手冊、醫療資料、LINE回報、交接文件及正式庭訊紀錄核對。',
      cards: [
        { no: '01', kind: 'contradiction', tag: '同一證人／日期不一', title: '周○提出兩組不同的照顧起訖日', a: '先答111年6月30日至112年8月30日。', b: '同段又答111年6月28日至112年8月31日。', reading: '兩組日期無法同時作為唯一精確起訖日，是本段最明確的前後不一；應以托育契約、交接與補助紀錄確認。', chapter: '#day3-chapter-02' },
        { no: '02', kind: 'timeline', tag: '兩證人／交接時間軸', title: '蕭○香離開日與周○其中一個開始日出現重疊', a: '蕭○香依紀錄確認照顧至2022年6月29日。', b: '周○其中一組說法從2022年6月28日開始，形成兩日重疊；另一組6月30日開始則可順接。', reading: '重疊可能來自日期記憶、交接日與正式托育日定義不同，或原紀錄文字差異；未核對原始文件前不能自行選定。', chapter: '#day3-chapter-05' },
        { no: '03', kind: 'handover', tag: '資訊傳遞待核', title: '醫療與照顧提醒經過誰，兩段證詞沒有形成完整閉環', a: '蕭○香稱看醫生會用LINE告知社工，離開時在兒福聯盟辦公室交接後交給外婆。', b: '周○稱接手時收到一張提醒事項；往下一位照顧者交接時，奶量等細節主要告訴社工，與後手照顧者未充分交談。', reading: '兩人都提到社工或外婆，但本頁證詞不足以確認每項醫療提醒與日常細節是否完整傳至下一手。', chapter: '#day3-chapter-04' },
        { no: '04', kind: 'stage', tag: '跨期對照／非直接矛盾', title: '手腳緊繃：嬰兒期明顯，後期描述逐漸不同', a: '蕭○香在四、五個月大時稱洗澡、換衣服手較緊，會按摩；紀錄另載醫師建議觀察及小兒神經科。', b: '周○稱接手提醒包含換尿布較僵硬，但其後又描述手腳無異狀、走路穩。', reading: '觀察月份不同，可能反映成長、改善、適應或用語差異；這是一條需要醫療與發展紀錄串接的時間線，不宜直接判作互相矛盾。', chapter: '#day3-chapter-04' },
        { no: '05', kind: 'stage', tag: '月齡差異／非直接矛盾', title: '哭泣頻率描述不同，但兩人都說沒有特別難照顧', a: '蕭○香稱嬰兒期會哭且用力、臉色改變，但屬正常需求反應，照顧沒有特別困難。', b: '周○照顧較大月齡時稱不愛哭、不容易哭鬧，也沒有特別難照顧。', reading: '哭泣表現可隨月齡、需求與環境改變；兩段在「沒有特別照顧困難」上反而一致，不能只抽取「會哭／不愛哭」製造衝突。', chapter: '#day3-chapter-05' },
        { no: '06', kind: 'record', tag: '記憶／紀錄界線', title: '「健康」或「未被告知異常」不等於沒有醫療紀錄', a: '蕭○香稱交接時被告知健康，對神經科建議細節不記得，但對提示紀錄沒有意見。', b: '周○稱健康很好、領報告時未被告知異常；被提示看診及檢驗資料時，部分日期與數值沒有印象。', reading: '兩人都區分了當時理解與後來提示的書面紀錄。頁面應保留這個限制，不能把「被告知健康」擴張為醫療上從無任何需追蹤事項。', chapter: '#day3-chapter-03' }
      ],
      inline: ['日期前後不一', '交接日期待核', '資訊鏈待核', '跨期對照', '月齡不同', '記憶／紀錄待分']
    },
    'zh-Hans': {
      toc: '06A 前保姆证词核对',
      eyebrow: '06A · FORMER CAREGIVERS CROSS-CHECK',
      title: '两位前保姆证词｜日期、交接与照护阶段核对',
      introTitle: '先分清楚：真正前后不一，或只是观察时期不同',
      intro: '周○与萧○香照护孩子的月龄、期间与接触信息不同。以下只并列本页原始记录能直接核对的六组内容：日期重叠属于明确待厘清；紧绷、哭泣、健康与外观等差异，则必须先排除月龄、成长及交接信息不同，不能直接标成相互矛盾。',
      recordA: '记录 A',
      recordB: '记录 B',
      reading: '判读',
      source: '回到完整问答',
      method: '编辑方法｜“矛盾”仅用于同一时间轴或同一证人回答无法同时成立的文字；不同照护期的差异标为“跨期对照”。证词仍须与托育记录、宝宝手册、医疗资料、LINE回报、交接文件及正式庭讯记录核对。',
      cards: [
        { no: '01', kind: 'contradiction', tag: '同一证人／日期不一', title: '周○提出两组不同的照护起止日', a: '先答111年6月30日至112年8月30日。', b: '同段又答111年6月28日至112年8月31日。', reading: '两组日期无法同时作为唯一精确起止日，是本段最明确的前后不一；应以托育合同、交接与补助记录确认。', chapter: '#day3-chapter-02' },
        { no: '02', kind: 'timeline', tag: '两证人／交接时间轴', title: '萧○香离开日与周○其中一个开始日出现重叠', a: '萧○香依记录确认照护至2022年6月29日。', b: '周○其中一组说法从2022年6月28日开始，形成两日重叠；另一组6月30日开始则可顺接。', reading: '重叠可能来自日期记忆、交接日与正式托育日定义不同，或原记录文字差异；未核对原始文件前不能自行选定。', chapter: '#day3-chapter-05' },
        { no: '03', kind: 'handover', tag: '信息传递待核', title: '医疗与照护提醒经过谁，两段证词没有形成完整闭环', a: '萧○香称看医生会用LINE告知社工，离开时在儿福联盟办公室交接后交给外婆。', b: '周○称接手时收到一张提醒事项；往下一位照护者交接时，奶量等细节主要告诉社工，与后手照护者未充分交谈。', reading: '两人都提到社工或外婆，但本页证词不足以确认每项医疗提醒与日常细节是否完整传至下一手。', chapter: '#day3-chapter-04' },
        { no: '04', kind: 'stage', tag: '跨期对照／非直接矛盾', title: '手脚紧绷：婴儿期明显，后期描述逐渐不同', a: '萧○香在四、五个月大时称洗澡、换衣服手较紧，会按摩；记录另载医生建议观察及小儿神经科。', b: '周○称接手提醒包含换尿布较僵硬，但其后又描述手脚无异状、走路稳。', reading: '观察月份不同，可能反映成长、改善、适应或用语差异；这是一条需要医疗与发展记录串接的时间线，不宜直接判作相互矛盾。', chapter: '#day3-chapter-04' },
        { no: '05', kind: 'stage', tag: '月龄差异／非直接矛盾', title: '哭泣频率描述不同，但两人都说没有特别难照护', a: '萧○香称婴儿期会哭且用力、脸色改变，但属正常需求反应，照护没有特别困难。', b: '周○照护较大月龄时称不爱哭、不容易哭闹，也没有特别难照护。', reading: '哭泣表现可随月龄、需求与环境改变；两段在“没有特别照护困难”上反而一致，不能只抽取“会哭／不爱哭”制造冲突。', chapter: '#day3-chapter-05' },
        { no: '06', kind: 'record', tag: '记忆／记录界线', title: '“健康”或“未被告知异常”不等于没有医疗记录', a: '萧○香称交接时被告知健康，对神经科建议细节不记得，但对提示记录没有意见。', b: '周○称健康很好、领报告时未被告知异常；被提示就诊及检验资料时，部分日期与数值没有印象。', reading: '两人都区分了当时理解与后来提示的书面记录。页面应保留这个限制，不能把“被告知健康”扩张为医疗上从无任何需追踪事项。', chapter: '#day3-chapter-03' }
      ],
      inline: ['日期前后不一', '交接日期待核', '信息链待核', '跨期对照', '月龄不同', '记忆／记录待分']
    }
  };
  const c = copy[locale] || copy['zh-Hant'];

  const injectStyles = () => {
    if (document.getElementById('day3-caregiver-check-styles')) return;
    const style = document.createElement('style');
    style.id = 'day3-caregiver-check-styles';
    style.textContent = `
      .day3-caregiver-checks{position:relative;isolation:isolate;overflow:hidden;background:linear-gradient(145deg,rgba(247,243,237,.98),rgba(244,239,232,.95) 46%,rgba(237,246,244,.96));}
      .day3-caregiver-checks::before,.day3-caregiver-checks::after{content:"";position:absolute;border-radius:999px;pointer-events:none;z-index:-1;}
      .day3-caregiver-checks::before{width:280px;height:280px;right:-105px;top:55px;background:rgba(148,91,58,.10);}
      .day3-caregiver-checks::after{width:230px;height:230px;left:-110px;bottom:70px;background:rgba(68,126,119,.10);}
      .day3-caregiver-intro,.day3-caregiver-grid,.day3-caregiver-method{width:min(1120px,calc(100% - 32px));margin-inline:auto;}
      .day3-caregiver-intro{display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:start;padding:18px 20px;margin-top:8px;margin-bottom:22px;border:1px solid rgba(105,73,51,.18);border-radius:20px;background:rgba(255,255,255,.80);box-shadow:0 14px 34px rgba(67,52,42,.08);}
      .day3-caregiver-intro>i{display:grid;place-items:center;width:44px;height:44px;border-radius:14px;background:#72513f;color:#fff;font-style:normal;font-weight:900;letter-spacing:.04em;}
      .day3-caregiver-intro strong{display:block;color:#593b2c;font-size:clamp(1.02rem,1.5vw,1.18rem);line-height:1.45;margin-bottom:5px;}
      .day3-caregiver-intro p,.day3-caregiver-method{margin:0;color:#49423e;line-height:1.82;}
      .day3-caregiver-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;}
      .day3-caregiver-card{position:relative;display:flex;flex-direction:column;min-width:0;padding:24px;border:1px solid rgba(96,71,54,.16);border-left:5px solid #9d563f;border-radius:22px;background:rgba(255,255,255,.95);box-shadow:0 16px 38px rgba(61,48,39,.09);}
      .day3-caregiver-card.is-timeline{border-left-color:#8c6c28;}.day3-caregiver-card.is-handover{border-left-color:#3f7474;}.day3-caregiver-card.is-stage{border-left-color:#4c758d;}.day3-caregiver-card.is-record{border-left-color:#70568c;}
      .day3-caregiver-kicker{display:inline-flex;align-self:flex-start;padding:6px 10px;border-radius:999px;background:rgba(122,75,51,.10);color:#68402e;font-size:.78rem;font-weight:900;letter-spacing:.055em;}
      .day3-caregiver-card h3{margin:14px 0 13px;color:#312b28;font-size:clamp(1.08rem,1.7vw,1.28rem);line-height:1.5;}
      .day3-caregiver-source{margin:0 0 9px;padding:12px 14px;border-radius:14px;background:#faf7f2;color:#48413d;line-height:1.72;}
      .day3-caregiver-source b{color:#714633;}
      .day3-caregiver-reading{margin:5px 0 16px;color:#393533;line-height:1.78;}
      .day3-caregiver-reading strong{color:#53382b;}
      .day3-caregiver-link{align-self:flex-start;margin-top:auto;display:inline-flex;align-items:center;gap:7px;padding:9px 13px;border-radius:999px;border:1px solid rgba(106,70,48,.25);color:#5d3d2d;font-weight:800;text-decoration:none;background:#fff;}
      .day3-caregiver-link::after{content:"→";transition:transform .2s ease;}.day3-caregiver-link:hover::after,.day3-caregiver-link:focus-visible::after{transform:translateX(3px);}
      .day3-caregiver-link:focus-visible{outline:3px solid rgba(99,67,48,.24);outline-offset:3px;}
      .day3-caregiver-method{margin-top:20px;padding:14px 16px;border-top:1px dashed rgba(86,65,50,.28);font-size:.92rem;}
      .day3-dialogue-pair.day3-inline-caregiver-check{outline:3px solid rgba(157,86,63,.22);outline-offset:3px;border-radius:18px;}
      .day3-inline-caregiver-badge{display:inline-flex;align-items:center;margin:9px 0 0;padding:5px 9px;border-radius:999px;background:#704632;color:#fff;font-size:.72rem;font-weight:900;letter-spacing:.04em;box-shadow:0 5px 14px rgba(78,49,35,.18);}
      .day3-toc a[href="#former-caregiver-checks"]{font-weight:900;color:#65412f;}
      @media(max-width:760px){.day3-caregiver-grid{grid-template-columns:1fr;}.day3-caregiver-intro{grid-template-columns:1fr;padding:17px;}.day3-caregiver-intro>i{width:40px;height:40px}.day3-caregiver-card{padding:20px}.day3-caregiver-intro,.day3-caregiver-grid,.day3-caregiver-method{width:min(100% - 22px,1120px);}}
      @media(prefers-reduced-motion:reduce){.day3-caregiver-link::after{transition:none;}}
    `;
    document.head.append(style);
  };

  const renderSection = () => {
    if (document.getElementById('former-caregiver-checks')) return;
    const target = document.getElementById('limits');
    if (!target) return;

    const section = document.createElement('section');
    section.className = 'day3-section day3-caregiver-checks';
    section.id = 'former-caregiver-checks';
    section.setAttribute('aria-labelledby', 'former-caregiver-checks-title');
    const cards = c.cards.map(card => `
      <article class="day3-caregiver-card is-${card.kind} day3-reveal">
        <span class="day3-caregiver-kicker">${card.no} · ${card.tag}</span>
        <h3>${card.title}</h3>
        <p class="day3-caregiver-source"><b>${c.recordA}｜</b>${card.a}</p>
        <p class="day3-caregiver-source"><b>${c.recordB}｜</b>${card.b}</p>
        <p class="day3-caregiver-reading"><strong>${c.reading}｜</strong>${card.reading}</p>
        <a class="day3-caregiver-link" href="${card.chapter}">${c.source}</a>
      </article>`).join('');

    section.innerHTML = `
      <div class="day3-section-head day3-reveal">
        <small>${c.eyebrow}</small>
        <h2 id="former-caregiver-checks-title">${c.title}</h2>
      </div>
      <aside class="day3-caregiver-intro day3-reveal" role="note"><i aria-hidden="true">≠</i><div><strong>${c.introTitle}</strong><p>${c.intro}</p></div></aside>
      <div class="day3-caregiver-grid">${cards}</div>
      <p class="day3-caregiver-method day3-reveal">${c.method}</p>`;
    target.before(section);

    const toc = document.querySelector('.day3-toc');
    const limitsLink = toc?.querySelector('a[href="#limits"]');
    if (toc && !toc.querySelector('a[href="#former-caregiver-checks"]')) {
      const link = document.createElement('a');
      link.href = '#former-caregiver-checks';
      link.textContent = c.toc;
      if (limitsLink) limitsLink.before(link); else toc.append(link);
    }
  };

  const matchesGroups = (text, groups) => groups.every(group => group.some(needle => text.includes(needle)));
  const flagInlineComparisons = () => {
    const definitions = [
      { selector: '#day3-chapter-02 .day3-dialogue-pair', groups: [['照顧時間', '照护时间'], ['111年6月30日', '111年6月30日']], label: c.inline[0] },
      { selector: '#day3-chapter-05 .day3-dialogue-pair', groups: [['2022年5月4日至6月29日', '2022年5月4日至6月29日']], label: c.inline[1] },
      { selector: '#day3-chapter-04 .day3-dialogue-pair', groups: [['交接時對被告說過什麼', '交接时对被告说过什么']], label: c.inline[2] },
      { selector: '#day3-chapter-05 .day3-dialogue-pair', groups: [['醫師曾說全身緊繃', '医生曾说全身紧绷']], label: c.inline[3] },
      { selector: '#day3-chapter-02 .day3-dialogue-pair', groups: [['前保母交接時及你照顧期間有外傷嗎', '前保姆交接时及你照护期间有外伤吗']], label: c.inline[3] },
      { selector: '#day3-chapter-05 .day3-dialogue-pair', groups: [['照顧有特別困難或發展異常嗎', '照护有特别困难或发展异常吗']], label: c.inline[4] },
      { selector: '#day3-chapter-03 .day3-dialogue-pair', groups: [['2023年5月至8月多次看診', '2023年5月至8月多次就诊']], label: c.inline[5] },
      { selector: '#day3-chapter-03 .day3-dialogue-pair', groups: [['肌酐酸過低', '肌酐酸过低']], label: c.inline[5] }
    ];

    definitions.forEach(definition => {
      const pair = [...document.querySelectorAll(definition.selector)]
        .find(node => matchesGroups(node.textContent || '', definition.groups));
      if (!pair || pair.classList.contains('day3-inline-caregiver-check')) return;
      pair.classList.add('day3-inline-caregiver-check');
      const answer = pair.querySelector('.day3-dialogue-answer') || pair;
      const badge = document.createElement('span');
      badge.className = 'day3-inline-caregiver-badge';
      badge.textContent = definition.label;
      answer.append(badge);
    });
  };

  if (!isDay4) {
    injectStyles();
    renderSection();
    flagInlineComparisons();
  }

  const core = new URL(`./day3-reading-core.js?v=${coreVersion}`, base).href;
  const crosscheck = new URL('../kaikai-day4-20250428/day4-crosscheck.js?v=20260821-1', base).href;
  const prepare = isDay4
    ? load(crosscheck).then(() => window.day4CrosscheckReady)
    : Promise.resolve();

  prepare.catch(error => console.error('Day 4 cross-check failed to load', error)).finally(() => {
    load(core).then(() => {
      if (isDay4) {
        const reader = document.querySelector('.day3-record-progress');
        if (reader) reader.setAttribute('aria-label', document.documentElement.lang === 'ja' ? '第4日法廷対話の閲覧進捗' : document.documentElement.lang === 'en' ? 'Day 4 hearing-dialogue progress' : '第四日庭審對話閱讀進度');
        document.querySelectorAll('.day3-record-tools-copy span').forEach(element => {
          element.textContent = element.textContent.replace(/第三日|Day 3|第3日/g, value => value === 'Day 3' ? 'Day 4' : value === '第3日' ? '第4日' : '第四日');
        });
      }
      window.ScrollTrigger?.refresh?.();
    }).catch(error => console.error('Court-record reader failed to load', error));
  });
})();
