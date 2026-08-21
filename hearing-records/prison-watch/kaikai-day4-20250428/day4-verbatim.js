(() => {
  'use strict';

  window.day4VerbatimReady = (async () => {
    if (!document.body.classList.contains('day4-page')) return;

    const fullRecord = document.getElementById('full-record');
    if (!fullRecord || fullRecord.dataset.completeRecord === 'ready' || fullRecord.dataset.completeRecord === 'loading') return;
    fullRecord.dataset.completeRecord = 'loading';

    const current = document.currentScript;
    const base = current ? new URL('./', current.src) : new URL('./', location.href);
    const partUrls = [0, 1].map(index => new URL(`../../../assets/day4-verbatim-source-${index}.b64?v=20260821-dialogue-art-1`, base));
    const encoded = (await Promise.all(partUrls.map(url => fetch(url, { cache: 'no-store' }).then(response => {
      if (!response.ok) throw new Error(`Source record HTTP ${response.status}`);
      return response.text();
    })))).join('').replace(/\s+/g, '');

    if (!('DecompressionStream' in window)) throw new Error('This browser does not support gzip decompression.');
    const compressed = Uint8Array.from(atob(encoded), character => character.charCodeAt(0));
    const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
    const raw = await new Response(stream).text();
    const pages = raw.split('\f').filter(page => page.trim());
    if (pages.length !== 11) throw new Error(`Expected 11 record pages, received ${pages.length}`);

    const params = new URLSearchParams(location.search);
    const locale = document.documentElement.lang === 'ja'
      ? 'ja'
      : document.documentElement.lang === 'en'
        ? 'en'
        : (params.get('lang') === 'zh-Hans' || localStorage.getItem('siteLang') === 'zh-Hans')
          ? 'zh-Hans'
          : 'zh-Hant';

    const copy = {
      'zh-Hant': {
        kicker: '09 · COMPLETE HEARING RECORD', title: '完整旁聽紀錄',
        intro: '以下依原始旁聽紀錄順序，完整呈現全部提問、回答、異議、證據提示、法官追問與時間紀錄；對話內容不刪節、不合併、不改寫。',
        note: '有底色的文字仍是原始紀錄內容；編號與爭點說明只是閱讀輔助，不屬於證詞，也不代表法院已認定任何一方說謊。',
        openAll: '展開全部紀錄', closeAll: '收合全部', hide: '隱藏底色標記', show: '顯示底色標記', download: '下載完整文字', source: '查看 Prison Watch 原始紀錄',
        page: '第', suffix: '頁', marks: '處標記', nav: '完整紀錄', toc: '09 完整紀錄', topics: '重點與爭點註記', jump: '點選卡片，可直接跳到相關原句。',
        original: '原始對話', editorial: '編輯註記', direct: '直接不一致', scope: '程度／範圍差異', record: '須以紀錄核對', caution: '高度待核', noChange: '底色只標示，不改動原句。',
        question: '問', answer: '答', procedure: '程序', recordLabel: '紀錄', collapsePage: '收合本頁', expandPage: '展開本頁', pageProgress: '完整紀錄閱讀進度'
      },
      'zh-Hans': {
        kicker: '09 · COMPLETE HEARING RECORD', title: '完整旁听记录',
        intro: '以下依原始旁听记录顺序，完整呈现全部提问、回答、异议、证据提示、法官追问与时间记录；对话内容不删节、不合并、不改写。',
        note: '带底色的文字仍是原始记录内容；编号与争点说明只是阅读辅助，不属于证词，也不代表法院已经认定任何一方说谎。',
        openAll: '展开全部记录', closeAll: '收起全部', hide: '隐藏底色标记', show: '显示底色标记', download: '下载完整文字', source: '查看 Prison Watch 原始记录',
        page: '第', suffix: '页', marks: '处标记', nav: '完整记录', toc: '09 完整记录', topics: '重点与争点注释', jump: '点击卡片，可直接跳到相关原句。',
        original: '原始对话', editorial: '编辑注释', direct: '直接不一致', scope: '程度／范围差异', record: '须以记录核对', caution: '高度待核', noChange: '底色只作标记，不改动原句。',
        question: '问', answer: '答', procedure: '程序', recordLabel: '记录', collapsePage: '收起本页', expandPage: '展开本页', pageProgress: '完整记录阅读进度'
      },
      en: {
        kicker: '09 · COMPLETE HEARING RECORD', title: 'Complete hearing record',
        intro: 'The complete sequence of questions, answers, objections, evidence prompts, judicial questions and time entries is preserved without shortening, merging or rewriting the dialogue.',
        note: 'Highlighted wording remains part of the source record. Numbers and issue notes are reading aids only, not testimony or judicial findings.',
        openAll: 'Open all records', closeAll: 'Collapse all', hide: 'Hide highlights', show: 'Show highlights', download: 'Download complete text', source: 'Original Prison Watch record',
        page: 'Page ', suffix: '', marks: ' highlights', nav: 'Full record', toc: '09 Full record', topics: 'Key points and disputed issues', jump: 'Select a card to jump to the related wording.',
        original: 'Source dialogue', editorial: 'Editorial note', direct: 'Direct inconsistency', scope: 'Difference in scope', record: 'Records required', caution: 'High-priority check', noChange: 'Highlights locate wording; they do not alter it.',
        question: 'Q', answer: 'A', procedure: 'Procedure', recordLabel: 'Record', collapsePage: 'Collapse page', expandPage: 'Open page', pageProgress: 'Complete-record reading progress'
      },
      ja: {
        kicker: '09 · COMPLETE HEARING RECORD', title: '完全な傍聴記録',
        intro: '質問、回答、異議、証拠提示、裁判官の質問、時刻記録を原順のまま、省略・統合・書き換えなしで全文掲載します。',
        note: '色付き部分も原記録の文言です。番号と争点説明は閲覧補助であり、証言や裁判所の認定ではありません。',
        openAll: '全記録を開く', closeAll: 'すべて閉じる', hide: '強調を隠す', show: '強調を表示', download: '全文テキスト', source: 'Prison Watch原記録',
        page: '第', suffix: '頁', marks: 'か所', nav: '完全記録', toc: '09 完全記録', topics: '重要点・争点の注記', jump: 'カードを選ぶと関連する原文へ移動します。',
        original: '原対話', editorial: '編集注記', direct: '直接の不一致', scope: '程度・範囲の差', record: '記録照合が必要', caution: '重点確認', noChange: '色は位置を示すだけで、原文は変更しません。',
        question: '問', answer: '答', procedure: '手続', recordLabel: '記録', collapsePage: 'この頁を閉じる', expandPage: 'この頁を開く', pageProgress: '完全記録の閲覧進捗'
      }
    }[locale];

    const pageTitles = {
      'zh-Hant': ['證據提示與劉若琳主詰問', '劉若琳主詰問續行', '劉若琳反詰問', '劉若琳｜國民法官提問', '劉若琳｜法官提問與照顧常態', '劉若琳證詞末段／劉彩萱開始作證', '劉彩萱主詰問｜冷靜區與澡盆', '劉彩萱反詰問｜動線、照片與照顧分工', '劉彩萱反詰問｜綑綁、罰站與知情', '劉彩萱｜法官提問與傷勢通報', '劉彩萱｜對話紀錄與最後確認'],
      'zh-Hans': ['证据提示与刘若琳主诘问', '刘若琳主诘问续行', '刘若琳反诘问', '刘若琳｜国民法官提问', '刘若琳｜法官提问与照顾常态', '刘若琳证词末段／刘彩萱开始作证', '刘彩萱主诘问｜冷静区与澡盆', '刘彩萱反诘问｜动线、照片与照顾分工', '刘彩萱反诘问｜捆绑、罚站与知情', '刘彩萱｜法官提问与伤势通报', '刘彩萱｜对话记录与最后确认'],
      en: ['Evidence prompts and Liu Ruo-lin direct examination', 'Liu Ruo-lin direct examination continued', 'Liu Ruo-lin cross-examination', 'Liu Ruo-lin | citizen-judge questions', 'Liu Ruo-lin | judicial questions and care practice', 'End of Liu Ruo-lin testimony / Liu Tsai-hsuan begins', 'Liu Tsai-hsuan direct examination | standing area and basin', 'Liu Tsai-hsuan cross-examination | route, photographs and care', 'Liu Tsai-hsuan cross-examination | restraint and knowledge', 'Liu Tsai-hsuan | judicial questions and injury reporting', 'Liu Tsai-hsuan | messages and final confirmation'],
      ja: ['証拠提示と劉若琳主尋問', '劉若琳主尋問の続き', '劉若琳反対尋問', '劉若琳｜国民法官の質問', '劉若琳｜裁判官質問と保育実務', '劉若琳証言末尾／劉彩萱証言開始', '劉彩萱主尋問｜立たせと洗面器', '劉彩萱反対尋問｜動線・写真・保育分担', '劉彩萱反対尋問｜拘束・立たせ・認識', '劉彩萱｜裁判官質問と傷の通報', '劉彩萱｜メッセージと最終確認']
    }[locale];

    const topicSets = {
      'zh-Hant': [
        { name: '丙地頻率與時段', kind: 'direct', note: '劉若琳稱「偶爾」，劉彩萱稱「幾乎每天」；需用照片、訊息、托育及訪視紀錄重建實際動線。' },
        { name: '甲地停留時間', kind: 'scope', note: '一方稱中午、晚間各停留約一小時以上；另一方稱多為午餐幾十分鐘。可能涉及不同日期或平均情形。' },
        { name: '冷靜區／罰站知情', kind: 'direct', note: '「看見站立」「知道是管教」「曾出言阻止」必須分層判讀，不能混成同一件事。' },
        { name: '澡盆事件代顧交代', kind: 'direct', note: '一方稱未被告知要做什麼，另一方稱離開前已交代代顧；監看責任與離開時間是核心。' },
        { name: '綑綁知情時間', kind: 'caution', note: '先確認「傳照片才知道」與11月2日澡盆事件是否指同一次綑綁；只有同一事件才構成明顯前後不一。' },
        { name: '各自照顧／互相代顧', kind: 'scope', note: '行政上非聯合收托，不等於日常生活中從未互相看顧；應分開判斷制度名義與實際行為。' },
        { name: '傷勢通報與避免被看見', kind: 'record', note: '不同傷勢可能有不同處理，須逐一比對社工訪視、通報、照片及醫療資料，不能以「有說」概括。' },
        { name: '是否曾制止管教', kind: 'scope', note: '「親眼看到具體打罵」與「曾口頭勸阻大聲或打小孩」並非完全相同的問題，須核對場景與日期。' }
      ],
      'zh-Hans': [
        { name: '丙地频率与时段', kind: 'direct', note: '刘若琳称“偶尔”，刘彩萱称“几乎每天”；需用照片、信息、托育及访视记录重建实际动线。' },
        { name: '甲地停留时间', kind: 'scope', note: '一方称中午、晚间各停留约一小时以上；另一方称多为午餐几十分钟。可能涉及不同日期或平均情形。' },
        { name: '冷静区／罚站知情', kind: 'direct', note: '“看见站立”“知道是管教”“曾出言阻止”必须分层判断，不能混为同一件事。' },
        { name: '澡盆事件代顾交代', kind: 'direct', note: '一方称未被告知要做什么，另一方称离开前已交代代顾；监看责任与离开时间是核心。' },
        { name: '捆绑知情时间', kind: 'caution', note: '先确认“传照片才知道”与11月2日澡盆事件是否指同一次捆绑；只有同一事件才构成明显前后不一。' },
        { name: '各自照顾／互相代顾', kind: 'scope', note: '行政上非联合收托，不等于日常生活中从未互相照看；应分开判断制度名义与实际行为。' },
        { name: '伤势通报与避免被看见', kind: 'record', note: '不同伤势可能有不同处理，须逐一比对社工访视、通报、照片及医疗资料，不能以“有说”概括。' },
        { name: '是否曾制止管教', kind: 'scope', note: '“亲眼看到具体打骂”与“曾口头劝阻大声或打小孩”并非完全相同的问题，须核对场景与日期。' }
      ],
      en: [
        { name: 'Visits to Liu Ruo-lin’s home', kind: 'direct', note: 'One account says “occasionally”; the other says “almost every day.” Photographs, messages, care logs and visit records are needed to reconstruct the route.' },
        { name: 'Time spent at the main location', kind: 'scope', note: 'One account describes lunch and evening visits lasting about an hour or more; the other describes mostly a few dozen minutes at lunch.' },
        { name: 'Knowledge of standing punishment', kind: 'direct', note: 'Seeing the child stand, understanding it as discipline, and verbally intervening are separate levels of knowledge.' },
        { name: 'Basin-event handover', kind: 'direct', note: 'One account says no instruction was given; the other says care was handed over before leaving. Supervision and duration are central.' },
        { name: 'When restraint became known', kind: 'caution', note: 'First confirm whether “learned from photographs” and the 2 November basin event concern the same restraint episode.' },
        { name: 'Separate care or substitute care', kind: 'scope', note: 'Not being formally registered as joint care does not establish that the caregivers never watched each other’s children in practice.' },
        { name: 'Injury reporting and concealment', kind: 'record', note: 'Each injury requires separate comparison with social-worker visits, reports, photographs and medical records.' },
        { name: 'Intervention in discipline', kind: 'scope', note: 'Personally witnessing a specific act and having verbally objected to shouting or hitting are not identical questions.' }
      ],
      ja: [
        { name: '丙地への訪問頻度・時間帯', kind: 'direct', note: '一方は「時々」、他方は「ほぼ毎日」と供述。写真、通信、保育記録、訪問記録による動線確認が必要です。' },
        { name: '甲地での滞在時間', kind: 'scope', note: '一方は昼夜それぞれ約1時間以上、他方は主に昼食の数十分と説明。異なる日や平均状況の可能性があります。' },
        { name: '立たせへの認識', kind: 'direct', note: '立っているのを見たこと、管教だと理解したこと、止める発言をしたことは別々に判断する必要があります。' },
        { name: '洗面器事件の引継ぎ', kind: 'direct', note: '一方は指示なし、他方は離れる前に見守りを依頼したと供述。監督責任と不在時間が中心です。' },
        { name: '拘束を知った時期', kind: 'caution', note: '「写真で知った」と11月2日の洗面器事件が同じ拘束場面かを先に確認する必要があります。' },
        { name: '別々の保育か相互代行か', kind: 'scope', note: '行政上の非共同保育は、日常で互いに見守ったことが一度もないことを意味しません。' },
        { name: 'けがの通報と隠匿', kind: 'record', note: '傷ごとに訪問、通報、写真、医療記録を照合する必要があり、「伝えた」だけで一括できません。' },
        { name: '管教を止めたか', kind: 'scope', note: '具体的な打罵を目撃したことと、大声や打つことを口頭で止めたことは同じ質問ではありません。' }
      ]
    }[locale];

    const kindLabels = { direct: copy.direct, scope: copy.scope, record: copy.record, caution: copy.caution };
    const highlights = [
      ['偶爾會，還好，因為我自己還有要照顧的小朋友', 1, 'direct'], ['幾乎', 1, 'direct'],
      ['中午1點下去，待1~1個多小時', 2, 'scope'], ['吃午餐，幾十分鐘', 2, 'scope'],
      ['是不是被罰站不知道', 3, 'direct'], ['問我為什麼A童站在那裡', 3, 'direct'],
      ['沒有說要做什麼', 4, 'direct'], ['就交代了一下', 4, 'direct'],
      ['手腳都被綁住', 5, 'caution'], ['傳照片才知道', 5, 'caution'],
      ['出門會托給我', 6, 'scope'], ['確實不會，劉若琳偶爾會幫忙', 6, 'scope'],
      ['跌倒、手，都有跟她說過要跟社工說', 7, 'record'], ['怕會被發現脖子上的傷', 7, 'record'],
      ['沒什麼印象，有拍過「這邊」', 8, 'scope'], ['她叫我不要這麼大聲', 8, 'scope'], ['口頭上有說不要打小孩', 8, 'scope']
    ].map(([phrase, topic, kind], index) => ({ phrase, topic, kind, id: `record-mark-${index + 1}`, used: false }));

    const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
    const joinText = (left, right) => {
      const a = String(left || '').replace(/\s+$/g, '');
      const b = String(right || '').trim();
      if (!a) return b;
      if (!b) return a;
      return /[A-Za-z0-9]$/.test(a) && /^[A-Za-z0-9]/.test(b) ? `${a} ${b}` : `${a}${b}`;
    };

    const knownSpeakers = ['訴訟參與代理人', '劉彩萱辯護人', '劉若琳辯護人', '國民法官（備位4 號）', '國民法官（備位4號）', '國民法官（備位2號）', '國民法官（備位1）', '國民法官（6號）', '國民法官（4號）', '國民法官（3號）', '國民法官（2號）', '國民法官（1號）', '陪席法官', '受命法官', '審判長', '檢察官', '辯護人', '劉若琳', '劉彩萱'];

    const cleanLines = page => page.split('\n').map(line => line.replace(/[\r\n]+$/g, '')).filter(line => {
      const text = line.trim();
      if (!text) return true;
      if (line.includes('https://www.prisonwatch-tw.org/post/') && line.includes('DAY4')) return false;
      if (/^第\s*\d+\s*頁，共\s*11\s*頁/.test(text)) return false;
      return true;
    });

    const splitColumns = line => {
      const rawLine = line.replace(/\s+$/g, '');
      const lead = (rawLine.match(/^ */) || [''])[0].length;
      if (lead > 28) return null;
      const expression = / {2,}/g;
      let match;
      while ((match = expression.exec(rawLine))) {
        if (match.index <= lead + 1 || match.index < 9) continue;
        const left = rawLine.slice(lead, match.index).trimEnd();
        const right = rawLine.slice(match.index + match[0].length).trim();
        if (left && right) return { left, right };
      }
      return null;
    };

    const speakerInfo = text => {
      for (const speaker of knownSpeakers) {
        if (text.startsWith(`${speaker}：`) || text.startsWith(`${speaker}:`)) return { speaker, text: text.slice(speaker.length + 1).trim() };
      }
      return null;
    };

    const parsedPages = [];
    let witness = '劉若琳';
    let questioner = '';
    pages.forEach((page, pageIndex) => {
      const blocks = [];
      let pair = null;
      const flush = () => { if (pair) { blocks.push(pair); pair = null; } };
      const add = block => { flush(); blocks.push(block); };

      for (const line of cleanLines(page)) {
        const text = line.trim();
        if (!text) { flush(); continue; }
        if (/^〔證人(.+)〕$/.test(text)) {
          witness = text.replace(/^〔證人|〕$/g, '');
          add({ type: 'witness', text, witness });
          continue;
        }
        if (text.startsWith('證人：')) { add({ type: 'witness-list', text }); continue; }
        if (/^\d{1,2}:\d{2}.*(?:休庭|入庭|續行審理|退庭)/.test(text)) { add({ type: 'time', text }); continue; }
        const speaker = speakerInfo(text);
        if (speaker) { add({ type: 'speaker', ...speaker }); continue; }
        const columns = splitColumns(line);
        if (columns) {
          if (/(主詰問|反詰問|詢問|覆主詰問)/.test(columns.left) && columns.right.startsWith('證人')) {
            questioner = columns.left;
            const witnessMatch = columns.right.match(/證人(.+?)回答/);
            if (witnessMatch) witness = witnessMatch[1];
            add({ type: 'subhead', left: columns.left, right: columns.right });
            continue;
          }
          flush();
          pair = { type: 'pair', question: columns.left, answer: columns.right, witness, questioner };
          continue;
        }
        const lead = line.length - line.replace(/^ +/, '').length;
        if (pair && lead > 28) { pair.answer = joinText(pair.answer, text); continue; }
        if (pair) {
          if (!/[？?。；;：:]$/.test(pair.question) || /^(我」|官重問|正問題|程序|的，就|在，有|了|式有說什麼嗎|「為什麼會有這種事」)/.test(text)) {
            pair.question = joinText(pair.question, text);
            continue;
          }
          flush();
        }
        if (/[？?]$/.test(text)) { pair = { type: 'pair', question: text, answer: '', witness, questioner }; continue; }
        const type = /^DAY4 /.test(text) || text === 'Prison Watch' || text === '2025年5月26日' || text === '讀畢需時 19 分鐘' || text === '證據調查程序'
          ? 'meta'
          : /^(提示|勘驗|不爭執事項|對話紀錄|辯護人異議|審判長裁定|審判長依序|劉彩萱辯護人覆主詰問|劉若琳辯護人覆主詰問|直接告以要旨)/.test(text)
            ? 'procedure'
            : 'note';
        add({ type, text });
      }
      flush();
      parsedPages.push({ pageIndex, blocks });
    });

    const markText = text => {
      const matches = [];
      for (const item of highlights) {
        if (item.used) continue;
        const index = text.indexOf(item.phrase);
        if (index >= 0) matches.push({ ...item, index });
      }
      matches.sort((a, b) => a.index - b.index);
      let cursor = 0;
      let html = '';
      const topics = [];
      for (const item of matches) {
        html += escapeHtml(text.slice(cursor, item.index));
        html += `<mark id="${item.id}" class="record-mark is-${item.kind}" data-topic="${item.topic}" title="${escapeHtml(topicSets[item.topic - 1].name)}">${escapeHtml(item.phrase)}<sup>${item.topic}</sup></mark>`;
        cursor = item.index + item.phrase.length;
        item.used = true;
        const source = highlights.find(entry => entry.id === item.id);
        if (source) source.used = true;
        topics.push(item.topic);
      }
      return { html: html + escapeHtml(text.slice(cursor)), topics: [...new Set(topics)] };
    };

    const speakerClass = speaker => {
      if (/審判長|法官/.test(speaker)) return 'is-judge';
      if (/檢察官/.test(speaker)) return 'is-prosecutor';
      if (/辯護人/.test(speaker)) return 'is-defense';
      if (/劉若琳|劉彩萱/.test(speaker)) return 'is-witness';
      return 'is-procedure';
    };

    const issueChips = topics => topics.length
      ? `<div class="issue-chips">${topics.map(topic => `<button type="button" data-jump-topic="${topic}"><b>${String(topic).padStart(2, '0')}</b>${escapeHtml(topicSets[topic - 1].name)}</button>`).join('')}</div>`
      : '';

    const renderBlock = block => {
      if (block.type === 'pair') {
        const question = markText(block.question);
        const answer = markText(block.answer);
        const topics = [...new Set([...question.topics, ...answer.topics])];
        const questionerText = block.questioner ? `<small>${escapeHtml(block.questioner)}</small>` : '';
        const answererText = block.witness ? `<small>${escapeHtml(`證人${block.witness}`)}</small>` : '';
        if (!block.answer) {
          return `<div class="dialogue-question-only"><b>${copy.question}</b><div>${questionerText}<p>${question.html}</p></div></div>${issueChips(topics)}`;
        }
        return `<div class="dialogue-pair"><div class="dialogue-question"><b>${copy.question}</b><div>${questionerText}<p>${question.html}</p></div></div><div class="dialogue-answer"><b>${copy.answer}</b><div>${answererText}<p>${answer.html}</p></div></div></div>${issueChips(topics)}`;
      }
      if (block.type === 'time') return `<p class="dialogue-time">${escapeHtml(block.text)}</p>`;
      if (block.type === 'subhead') return `<div class="dialogue-subhead"><strong>${escapeHtml(block.left)}</strong><span>${escapeHtml(block.right)}</span></div>`;
      if (block.type === 'witness') return `<div class="witness-divider"><i aria-hidden="true"></i><strong>${escapeHtml(block.text)}</strong><i aria-hidden="true"></i></div>`;
      if (block.type === 'witness-list') return `<p class="witness-list">${escapeHtml(block.text)}</p>`;
      if (block.type === 'speaker') {
        const body = markText(block.text);
        return `<div class="dialogue-line ${speakerClass(block.speaker)}"><b>${escapeHtml(block.speaker)}</b><p>${body.html}</p></div>${issueChips(body.topics)}`;
      }
      if (block.type === 'procedure') {
        const body = markText(block.text);
        return `<div class="dialogue-line is-procedure"><b>${copy.procedure}</b><p>${body.html}</p></div>${issueChips(body.topics)}`;
      }
      if (block.type === 'meta') return `<p class="dialogue-meta">${escapeHtml(block.text)}</p>`;
      const body = markText(block.text);
      return `<p class="dialogue-note">${body.html}</p>${issueChips(body.topics)}`;
    };

    document.querySelectorAll('#verbatim-record').forEach(element => { if (!fullRecord.contains(element)) element.remove(); });
    fullRecord.replaceChildren();
    fullRecord.classList.add('day4-verbatim-host');
    fullRecord.setAttribute('aria-label', copy.title);

    const host = document.createElement('div');
    host.id = 'verbatim-record';
    host.className = 'day4-verbatim-render';
    fullRecord.append(host);
    const shadow = host.attachShadow({ mode: 'open' });
    const sourceUrl = 'https://www.prisonwatch-tw.org/post/day4-2025%E5%B9%B44%E6%9C%8828%E6%97%A5%EF%BC%88%E4%B8%80%EF%BC%89%E7%AC%AC%E5%9B%9B%E6%AC%A1%E5%AF%A9%E5%88%A4%E6%9C%9F%E6%97%A5';
    const countMarks = page => highlights.filter(item => page.includes(item.phrase)).length;
    const topicHtml = topicSets.map((topic, index) => `<button type="button" class="topic-card is-${topic.kind}" data-jump-topic="${index + 1}"><b>${String(index + 1).padStart(2, '0')}</b><span><small>${escapeHtml(kindLabels[topic.kind])}</small><strong>${escapeHtml(topic.name)}</strong><em>${escapeHtml(topic.note)}</em></span></button>`).join('');
    const pageJumps = parsedPages.map(({ pageIndex }) => `<button type="button" data-jump-page="${pageIndex + 1}"><b>${String(pageIndex + 1).padStart(2, '0')}</b><span>${escapeHtml(pageTitles[pageIndex])}</span></button>`).join('');
    const chapters = parsedPages.map(({ pageIndex, blocks }) => {
      const number = pageIndex + 1;
      const content = blocks.map(renderBlock).join('');
      return `<article class="record-chapter" id="record-page-${number}" data-page="${number}"><header class="chapter-head"><span>${String(number).padStart(2, '0')}</span><div><small>COURT RECORD · COMPLETE</small><h3>${escapeHtml(pageTitles[pageIndex])}</h3><p>${copy.page}${number}${copy.suffix} · ${countMarks(pages[pageIndex])} ${copy.marks}</p></div><button type="button" class="chapter-toggle" aria-expanded="true"><i aria-hidden="true"></i><span>${copy.collapsePage}</span></button></header><div class="dialogue-flow">${content}</div></article>`;
    }).join('');

    shadow.innerHTML = `<style>
      :host{display:block;color:#183746;font-family:system-ui,-apple-system,"Noto Sans TC","PingFang TC",sans-serif}.record-wrap{position:relative;max-width:1180px;margin:auto;padding:clamp(8px,2vw,24px)}.record-wrap:before,.record-wrap:after{content:"";position:absolute;z-index:-1;border-radius:50%;filter:blur(2px);opacity:.38}.record-wrap:before{top:5%;right:-90px;width:260px;height:260px;background:#efd0d3}.record-wrap:after{top:42%;left:-130px;width:300px;height:300px;background:#c4d9dc}.record-head small{display:block;color:#9a4e42;font-weight:900;letter-spacing:.14em}.record-head h2{margin:.35rem 0 .7rem;color:#17394b;font-family:"Noto Serif TC","Songti TC",serif;font-size:clamp(2.15rem,4.6vw,3.65rem);line-height:1.16}.record-head>p{max-width:950px;color:#536b77;font-size:1.02rem;line-height:1.9}.source-note{margin-top:15px;padding:15px 18px;border-left:5px solid #b88948;border-radius:0 16px 16px 0;background:linear-gradient(110deg,#fff7e9,#fffdf8);color:#65533e;line-height:1.75;box-shadow:0 10px 26px rgba(69,58,48,.06)}.source-note b{margin-right:.5rem;color:#7b4c2b}.actions{display:flex;flex-wrap:wrap;gap:10px;margin:24px 0}.actions button,.actions a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:.68rem 1rem;border:1px solid rgba(23,57,75,.18);border-radius:999px;background:#fff;color:#17394b;font:inherit;font-weight:850;text-decoration:none;cursor:pointer;box-shadow:0 8px 22px rgba(23,57,75,.06)}.actions button:hover,.actions a:hover{background:#edf4f3}.legend{display:flex;flex-wrap:wrap;align-items:center;gap:9px;margin:0 0 22px}.legend strong{margin-right:4px;font-size:.8rem}.legend span{padding:.4rem .72rem;border-radius:999px;font-size:.78rem;font-weight:850}.legend .direct{background:#f8d7d1;color:#7e2e25}.legend .scope{background:#f5e4b7;color:#755610}.legend .record{background:#d8e9f1;color:#24516d}.legend .caution{background:#e5d9ef;color:#5e3d78}.legend small{flex-basis:100%;color:#6b7d86}.issues{margin:24px 0 30px;padding:clamp(17px,3vw,26px);border:1px solid rgba(23,57,75,.12);border-radius:28px;background:linear-gradient(145deg,rgba(255,255,255,.96),rgba(244,238,229,.92));box-shadow:0 18px 48px rgba(23,57,75,.08)}.issues h3{margin:0 0 .3rem;font-family:"Noto Serif TC","Songti TC",serif;font-size:1.4rem}.issues>p{margin:.2rem 0 18px;color:#627780}.topic-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.topic-card{display:grid;grid-template-columns:44px 1fr;gap:12px;align-items:start;padding:15px;border:1px solid rgba(23,57,75,.13);border-left-width:5px;border-radius:18px;background:#fff;color:#24495b;text-align:left;cursor:pointer;box-shadow:0 9px 22px rgba(23,57,75,.05);transition:transform .2s ease,box-shadow .2s ease}.topic-card:hover{transform:translateY(-2px);box-shadow:0 14px 30px rgba(23,57,75,.1)}.topic-card.is-direct{border-left-color:#b94d3f}.topic-card.is-scope{border-left-color:#b48a30}.topic-card.is-record{border-left-color:#407b9a}.topic-card.is-caution{border-left-color:#76558d}.topic-card>b{display:grid;place-items:center;width:44px;height:44px;border-radius:50% 50% 18px;background:linear-gradient(145deg,#17394b,#4f7488);color:#fff}.topic-card span{display:grid;gap:3px}.topic-card small{font-weight:900;letter-spacing:.04em}.topic-card strong{font-size:1rem}.topic-card em{color:#657984;font-size:.86rem;font-style:normal;line-height:1.58}.record-progress{position:sticky;top:82px;z-index:12;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:12px;width:min(780px,calc(100% - 16px));margin:0 auto 20px;padding:10px 14px;border:1px solid rgba(255,255,255,.9);border-radius:999px;background:rgba(255,250,245,.9);box-shadow:0 12px 30px rgba(48,62,72,.12);backdrop-filter:blur(14px);font-size:.72rem;font-weight:900}.record-progress>span{height:6px;border-radius:999px;background:rgba(23,57,75,.12);overflow:hidden}.record-progress i{display:block;width:100%;height:100%;border-radius:inherit;background:linear-gradient(90deg,#a95f6c,#c4913e,#5d8c82);transform:scaleX(.09);transform-origin:left}.record-progress b{min-width:5em;text-align:right;color:#a95f6c}.page-jumps{display:flex;gap:9px;overflow:auto;margin:0 0 30px;padding:4px 2px 10px;scrollbar-width:thin}.page-jumps button{flex:0 0 min(270px,76vw);display:grid;grid-template-columns:36px 1fr;gap:10px;align-items:center;padding:10px 12px;border:1px solid rgba(23,57,75,.12);border-radius:15px;background:rgba(255,255,255,.84);color:#24495b;text-align:left;cursor:pointer}.page-jumps b{display:grid;place-items:center;width:36px;height:36px;border-radius:50%;background:#17394b;color:#fff}.page-jumps span{font-size:.78rem;font-weight:800;line-height:1.4}.record-chapters{display:grid;gap:32px}.record-chapter{border:1px solid rgba(23,57,75,.16);border-radius:32px;background:rgba(255,255,255,.86);box-shadow:0 20px 52px rgba(47,62,72,.1);overflow:hidden;transition:border-color .25s ease,box-shadow .25s ease,transform .25s ease}.record-chapter.is-current{border-color:rgba(169,95,108,.5);box-shadow:0 28px 64px rgba(57,67,75,.15);transform:translateY(-2px)}.chapter-head{display:grid;grid-template-columns:62px 1fr auto;gap:17px;align-items:center;padding:24px 27px;background:radial-gradient(circle at 92% 10%,rgba(239,208,211,.55),transparent 32%),linear-gradient(112deg,rgba(196,217,220,.68),rgba(255,250,245,.96) 56%,rgba(239,208,211,.44))}.chapter-head>span{display:grid;place-items:center;width:58px;height:58px;border-radius:50% 50% 18px;background:linear-gradient(145deg,#17394b,#4e7084);box-shadow:0 10px 24px rgba(23,57,75,.22);color:#fff;font:900 1rem/1 "Noto Serif TC",serif}.chapter-head small{color:#a95f6c;font-weight:900;letter-spacing:.14em}.chapter-head h3{margin:.15rem 0;color:#17394b;font:800 clamp(1.25rem,3vw,1.95rem)/1.28 "Noto Serif TC","Songti TC",serif}.chapter-head p{margin:0;color:#6f7a80;font-size:.8rem}.chapter-toggle{display:inline-flex;align-items:center;gap:8px;padding:.58rem .78rem;border:1px solid rgba(23,57,75,.16);border-radius:999px;background:rgba(255,255,255,.8);color:#17394b;font:inherit;font-size:.75rem;font-weight:850;cursor:pointer}.chapter-toggle i{display:block;width:9px;height:9px;border-right:2px solid currentColor;border-bottom:2px solid currentColor;transform:rotate(45deg) translateY(-2px);transition:transform .25s ease}.record-chapter.is-collapsed .chapter-toggle i{transform:rotate(-45deg)}.record-chapter.is-collapsed .dialogue-flow{display:none}.dialogue-flow{display:grid;gap:12px;padding:28px;background-image:linear-gradient(90deg,transparent 0 7%,rgba(169,95,108,.08) 7% 7.15%,transparent 7.15%),repeating-linear-gradient(0deg,transparent 0 31px,rgba(23,57,75,.035) 32px)}.dialogue-subhead{display:flex;justify-content:space-between;gap:16px;align-items:center;margin:12px 0 4px;padding:12px 16px;border-radius:14px;background:linear-gradient(100deg,#17394b,#496f83);color:#fff}.dialogue-subhead span{font-size:.76rem;color:#d9e8e6}.dialogue-pair{display:grid;grid-template-columns:minmax(0,.92fr) minmax(0,1.08fr);gap:12px}.dialogue-question,.dialogue-answer,.dialogue-question-only{display:grid;grid-template-columns:44px 1fr;gap:12px;align-items:start;padding:16px;border-radius:18px;box-shadow:0 7px 18px rgba(47,62,72,.04)}.dialogue-question{background:linear-gradient(145deg,#f4edf0,#fff8fa)}.dialogue-answer{background:linear-gradient(145deg,#edf4f2,#f9fffd)}.dialogue-question-only{background:#f4edf0}.dialogue-question>b,.dialogue-answer>b,.dialogue-question-only>b{display:grid;place-items:center;min-height:34px;border-radius:12px;background:#a95f6c;color:#fff;font-size:.72rem}.dialogue-answer>b{background:#538278}.dialogue-question p,.dialogue-answer p,.dialogue-question-only p{margin:.25rem 0 0;line-height:1.78}.dialogue-question small,.dialogue-answer small,.dialogue-question-only small{display:block;color:#7a7277;font-size:.68rem;font-weight:850;letter-spacing:.04em}.dialogue-line{display:grid;grid-template-columns:145px 1fr;gap:14px;padding:15px 18px;border-left:4px solid #879cac;border-radius:0 16px 16px 0;background:#f2f5f7}.dialogue-line>b{color:#17394b}.dialogue-line p{margin:0;line-height:1.78}.dialogue-line.is-judge{border-color:#506d8b;background:#edf2f6}.dialogue-line.is-prosecutor{border-color:#b56b64;background:#f8eeeb}.dialogue-line.is-defense{border-color:#887797;background:#f3eff6}.dialogue-line.is-witness{border-color:#5d8c82;background:#edf5f1}.dialogue-line.is-procedure{border-color:#c4913e;background:#fff6e7}.dialogue-time{margin:10px 0;padding:10px 14px;border-radius:999px;background:linear-gradient(90deg,#17394b,#51718a);color:#fff;text-align:center;font-weight:900}.dialogue-note{margin:0;padding:13px 16px;border:1px dashed rgba(23,57,75,.18);border-radius:14px;background:#fff;line-height:1.75}.dialogue-meta{margin:0;text-align:center;color:#758187;font-size:.75rem;letter-spacing:.04em}.witness-list{margin:5px 0;padding:14px 18px;border-radius:15px;background:#fff7e9;color:#684f36;font-weight:900;text-align:center}.witness-divider{display:grid;grid-template-columns:1fr auto 1fr;gap:14px;align-items:center;margin:16px 0 6px;color:#17394b;font:900 1rem/1.4 "Noto Serif TC",serif}.witness-divider i{height:1px;background:linear-gradient(90deg,transparent,#a95f6c)}.witness-divider i:last-child{background:linear-gradient(90deg,#a95f6c,transparent)}.record-mark{padding:.08em .14em;border-radius:.28em;box-decoration-break:clone;-webkit-box-decoration-break:clone}.record-mark sup{display:inline-grid;place-items:center;min-width:1.45em;height:1.45em;margin-left:.28em;border-radius:50%;background:#17394b;color:#fff;font-size:.65em;line-height:1}.record-mark.is-direct{background:#f7cfc8}.record-mark.is-scope{background:#f3dfaa}.record-mark.is-record{background:#cfe4ef}.record-mark.is-caution{background:#dfd0eb}.hide-highlights .record-mark{background:transparent!important;outline:1px dotted rgba(23,57,75,.28)}.record-mark.is-pulse{animation:pulse 1.25s ease both}@keyframes pulse{0%,100%{box-shadow:none}35%{box-shadow:0 0 0 6px rgba(177,77,63,.23)}}.issue-chips{display:flex;flex-wrap:wrap;gap:7px;margin:-3px 0 5px}.issue-chips button{display:inline-flex;align-items:center;gap:6px;padding:.35rem .62rem;border:1px solid rgba(169,95,108,.2);border-radius:999px;background:#fff8f3;color:#7d4d45;font:inherit;font-size:.7rem;font-weight:850;cursor:pointer}.issue-chips b{display:grid;place-items:center;width:20px;height:20px;border-radius:50%;background:#a95f6c;color:#fff;font-size:.62rem}.fidelity{margin:30px 0 4px;padding:16px 18px;border-radius:16px;background:linear-gradient(100deg,#17394b,#335c70);color:#eef6f7;line-height:1.72}.fidelity b{color:#ffd7ad}@media(max-width:780px){.record-progress{top:68px;width:100%}.topic-grid{grid-template-columns:1fr}.chapter-head{grid-template-columns:46px 1fr;padding:20px 16px}.chapter-head>span{width:44px;height:44px}.chapter-toggle{grid-column:1/-1;justify-self:end}.dialogue-flow{padding:18px 14px}.dialogue-pair{grid-template-columns:1fr}.dialogue-question,.dialogue-answer,.dialogue-question-only{grid-template-columns:38px 1fr;padding:13px}.dialogue-line{grid-template-columns:1fr;gap:5px}.dialogue-subhead{align-items:flex-start;flex-direction:column;gap:2px}.record-chapters{gap:24px}.record-chapter{border-radius:24px}}@media(prefers-reduced-motion:reduce){.topic-card,.record-chapter,.chapter-toggle i{transition:none}.record-mark.is-pulse{animation:none}}
    </style><div class="record-wrap"><header class="record-head"><small>${copy.kicker}</small><h2>${copy.title}</h2><p>${copy.intro}</p><div class="source-note"><b>${copy.editorial}</b>${copy.note}</div></header><div class="actions"><button type="button" data-action="toggle-pages">${copy.closeAll}</button><button type="button" data-action="toggle-highlights">${copy.hide}</button><button type="button" data-action="download">${copy.download}</button><a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">${copy.source} ↗</a></div><div class="legend"><strong>${copy.original}：</strong><span class="direct">${copy.direct}</span><span class="scope">${copy.scope}</span><span class="record">${copy.record}</span><span class="caution">${copy.caution}</span><small>${copy.noChange}</small></div><section class="issues"><h3>${copy.topics}</h3><p>${copy.jump}</p><div class="topic-grid">${topicHtml}</div></section><div class="record-progress" role="progressbar" aria-label="${copy.pageProgress}" aria-valuemin="1" aria-valuemax="11" aria-valuenow="1"><strong>${copy.recordLabel}</strong><span aria-hidden="true"><i></i></span><b>01 / 11</b></div><nav class="page-jumps" aria-label="${copy.pageProgress}">${pageJumps}</nav><div class="record-chapters">${chapters}</div><div class="fidelity"><b>${copy.original}</b>｜${copy.noChange}</div></div>`;

    const wrap = shadow.querySelector('.record-wrap');
    const chaptersElements = [...shadow.querySelectorAll('.record-chapter')];
    const togglePages = shadow.querySelector('[data-action="toggle-pages"]');
    const toggleHighlights = shadow.querySelector('[data-action="toggle-highlights"]');
    const progressBar = shadow.querySelector('.record-progress i');
    const progressCount = shadow.querySelector('.record-progress b');
    const progressRoot = shadow.querySelector('.record-progress');

    const setChapterOpen = (chapter, open) => {
      chapter.classList.toggle('is-collapsed', !open);
      const button = chapter.querySelector('.chapter-toggle');
      button.setAttribute('aria-expanded', String(open));
      button.querySelector('span').textContent = open ? copy.collapsePage : copy.expandPage;
    };
    chaptersElements.forEach(chapter => {
      const button = chapter.querySelector('.chapter-toggle');
      button.addEventListener('click', () => setChapterOpen(chapter, chapter.classList.contains('is-collapsed')));
    });

    const updateAllButton = () => {
      const allOpen = chaptersElements.every(chapter => !chapter.classList.contains('is-collapsed'));
      togglePages.textContent = allOpen ? copy.closeAll : copy.openAll;
    };
    togglePages.addEventListener('click', () => {
      const shouldOpen = chaptersElements.some(chapter => chapter.classList.contains('is-collapsed'));
      chaptersElements.forEach(chapter => setChapterOpen(chapter, shouldOpen));
      updateAllButton();
    });

    toggleHighlights.addEventListener('click', () => {
      const hidden = wrap.classList.toggle('hide-highlights');
      toggleHighlights.textContent = hidden ? copy.show : copy.hide;
    });

    shadow.querySelector('[data-action="download"]').addEventListener('click', () => {
      const blob = new Blob([raw], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'kaikai-day4-20250428-complete-hearing-record.txt';
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });

    const scrollToMark = mark => {
      const chapter = mark.closest('.record-chapter');
      if (chapter) setChapterOpen(chapter, true);
      mark.classList.remove('is-pulse');
      void mark.offsetWidth;
      mark.classList.add('is-pulse');
      mark.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    };
    const jumpToTopic = topic => {
      const mark = shadow.querySelector(`.record-mark[data-topic="${topic}"]`);
      if (mark) scrollToMark(mark);
    };
    shadow.querySelectorAll('[data-jump-topic]').forEach(button => button.addEventListener('click', () => jumpToTopic(Number(button.dataset.jumpTopic))));
    shadow.querySelectorAll('[data-jump-page]').forEach(button => button.addEventListener('click', () => {
      const page = Number(button.dataset.jumpPage);
      const chapter = shadow.getElementById(`record-page-${page}`);
      if (!chapter) return;
      setChapterOpen(chapter, true);
      chapter.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    }));

    const updateProgress = () => {
      let currentIndex = 0;
      chaptersElements.forEach((chapter, index) => {
        if (chapter.getBoundingClientRect().top < innerHeight * .52) currentIndex = index;
      });
      chaptersElements.forEach((chapter, index) => chapter.classList.toggle('is-current', index === currentIndex));
      const currentNumber = currentIndex + 1;
      progressBar.style.transform = `scaleX(${currentNumber / chaptersElements.length})`;
      progressCount.textContent = `${String(currentNumber).padStart(2, '0')} / ${String(chaptersElements.length).padStart(2, '0')}`;
      progressRoot.setAttribute('aria-valuenow', String(currentNumber));
    };
    let ticking = false;
    const requestProgress = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { updateProgress(); ticking = false; });
    };
    addEventListener('scroll', requestProgress, { passive: true });
    addEventListener('resize', requestProgress, { passive: true });

    const topLink = document.querySelector('.day3-topbar nav a[href="#full-record"]');
    const tocLink = document.querySelector('.day3-toc a[href="#full-record"]');
    if (topLink) topLink.textContent = copy.nav;
    if (tocLink) tocLink.textContent = copy.toc;

    const chapterToTopic = { '02': 1, '03': 3, '04': 5, '05': 1, '06': 3, '07': 7, '08': 8 };
    document.addEventListener('click', event => {
      const link = event.target.closest('a[href^="#day3-chapter-"]');
      if (!link) return;
      const match = link.getAttribute('href').match(/day3-chapter-(\d+)/);
      const topic = match ? chapterToTopic[match[1]] : null;
      if (!topic) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      history.replaceState(null, '', '#full-record');
      jumpToTopic(topic);
    }, true);

    fullRecord.dataset.completeRecord = 'ready';
    delete fullRecord.dataset.pdfVerbatim;
    updateAllButton();
    updateProgress();

    const handleHash = () => {
      if (location.hash === '#verbatim-record' || location.hash === '#full-record') {
        requestAnimationFrame(() => fullRecord.scrollIntoView({ block: 'start' }));
        return;
      }
      const markMatch = location.hash.match(/^#(?:pdf|record)-mark-(\d+)$/);
      if (markMatch) {
        const item = highlights[Number(markMatch[1]) - 1];
        if (item) requestAnimationFrame(() => jumpToTopic(item.topic));
      }
    };
    addEventListener('hashchange', handleHash);
    handleHash();
    window.ScrollTrigger?.refresh();
  })().catch(error => {
    const fullRecord = document.getElementById('full-record');
    if (fullRecord) {
      delete fullRecord.dataset.completeRecord;
      delete fullRecord.dataset.pdfVerbatim;
    }
    console.error('Complete Day 4 hearing record failed to load', error);
    throw error;
  });
})();
