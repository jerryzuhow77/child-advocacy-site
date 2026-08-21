(() => {
  'use strict';

  window.day4VerbatimReady = (async () => {
    if (!document.body.classList.contains('day4-page')) return;

    const fullRecord = document.getElementById('full-record');
    if (!fullRecord || fullRecord.dataset.pdfVerbatim === 'ready' || fullRecord.dataset.pdfVerbatim === 'loading') return;
    fullRecord.dataset.pdfVerbatim = 'loading';

    const current = document.currentScript;
    const base = current ? new URL('./', current.src) : new URL('./', location.href);
    const partUrls = [0, 1].map(index => new URL(`../../../assets/day4-verbatim-source-${index}.b64?v=20260821-full-record-3`, base));
    const encoded = (await Promise.all(partUrls.map(url => fetch(url, { cache: 'no-store' }).then(response => {
      if (!response.ok) throw new Error(`PDF source HTTP ${response.status}`);
      return response.text();
    })))).join('').replace(/\s+/g, '');

    if (!('DecompressionStream' in window)) throw new Error('This browser does not support gzip decompression.');
    const compressed = Uint8Array.from(atob(encoded), character => character.charCodeAt(0));
    const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
    const raw = await new Response(stream).text();
    const pages = raw.split('\f').filter(page => page.trim());
    if (pages.length !== 11) throw new Error(`Expected 11 PDF pages, received ${pages.length}`);

    const params = new URLSearchParams(location.search);
    const locale = document.documentElement.lang === 'ja'
      ? 'ja'
      : document.documentElement.lang === 'en'
        ? 'en'
        : (params.get('lang') === 'zh-Hans' || localStorage.getItem('siteLang') === 'zh-Hans')
          ? 'zh-Hans'
          : 'zh-Hant';

    const labels = {
      'zh-Hant': {
        kicker: '09 · COMPLETE HEARING RECORD',
        title: '完整旁聽紀錄｜PDF原文完整保留',
        intro: '本區直接以11頁PDF完整原文取代原先的重製摘要。所有提問、回答、異議、提示證據、法官追問與時間紀錄均依原頁次呈現，不刪節、不合併、不改寫，也不自行修正文句。',
        sourceNote: '原文與編輯註記分層呈現：有底色的句子仍是PDF原句；編號、顏色與上方爭點說明只是閱讀標記，不屬於證詞，也不代表法院已認定任何一方說謊。',
        openAll: '展開全部11頁', closeAll: '收合全部', hide: '隱藏底色標記', show: '顯示底色標記', download: '下載完整純文字', source: '查看 Prison Watch 原始紀錄',
        page: 'PDF 第', suffix: '頁', marks: '處標記', nav: '完整原文', toc: '09 完整原文', topics: '重點與爭點註記', jump: '點選卡片，可直接跳到PDF原句。',
        original: 'PDF原文', editorial: '編輯註記', direct: '直接不一致', scope: '程度／範圍差異', record: '須以紀錄核對', caution: '高度待核',
        noChange: '底色只標示，不改動原句。'
      },
      'zh-Hans': {
        kicker: '09 · COMPLETE HEARING RECORD',
        title: '完整旁听记录｜PDF原文完整保留',
        intro: '本区直接以11页PDF完整原文替代原先的重制摘要。所有提问、回答、异议、提示证据、法官追问与时间记录均依原页次呈现，不删节、不合并、不改写，也不自行修正文句。',
        sourceNote: '原文与编辑注释分层呈现：带底色的句子仍是PDF原句；编号、颜色与上方争点说明只是阅读标记，不属于证词，也不代表法院已经认定任何一方说谎。',
        openAll: '展开全部11页', closeAll: '收起全部', hide: '隐藏底色标记', show: '显示底色标记', download: '下载完整纯文字', source: '查看 Prison Watch 原始记录',
        page: 'PDF 第', suffix: '页', marks: '处标记', nav: '完整原文', toc: '09 完整原文', topics: '重点与争点注释', jump: '点击卡片，可直接跳到PDF原句。',
        original: 'PDF原文', editorial: '编辑注释', direct: '直接不一致', scope: '程度／范围差异', record: '须以记录核对', caution: '高度待核',
        noChange: '底色只作标记，不改动原句。'
      },
      en: {
        kicker: '09 · COMPLETE HEARING RECORD',
        title: 'Complete hearing record | Full PDF wording preserved',
        intro: 'This section replaces the earlier edited summary with the complete text of all 11 PDF pages. Questions, answers, objections, exhibits, judicial questions and time entries remain in source order without shortening, merging, rewriting or silent correction.',
        sourceNote: 'Source text and editorial notes are visually separated. Highlighted wording remains the original PDF text; numbers, colours and issue notes are reading aids only and are not testimony or judicial findings.',
        openAll: 'Open all 11 pages', closeAll: 'Collapse all', hide: 'Hide highlights', show: 'Show highlights', download: 'Download complete text', source: 'Original Prison Watch record',
        page: 'PDF page ', suffix: '', marks: ' highlights', nav: 'Full PDF text', toc: '09 Full PDF text', topics: 'Key points and disputed issues', jump: 'Select a card to jump to the exact PDF wording.',
        original: 'PDF source text', editorial: 'Editorial note', direct: 'Direct inconsistency', scope: 'Difference in scope', record: 'Records required', caution: 'High-priority check',
        noChange: 'Highlights locate wording; they do not alter it.'
      },
      ja: {
        kicker: '09 · COMPLETE HEARING RECORD',
        title: '完全な傍聴記録｜PDF原文11ページを全文収録',
        intro: '従来の編集要約を、PDF全11ページの原文に置き換えます。質問、回答、異議、証拠提示、裁判官の質問、時刻記録を原順のまま、省略・統合・書き換え・黙示的訂正なしで掲載します。',
        sourceNote: '原文と編集注記は分けて表示します。色付き部分もPDF原文であり、番号・色・争点説明は閲覧補助にすぎず、証言や裁判所の認定ではありません。',
        openAll: '11ページをすべて開く', closeAll: 'すべて閉じる', hide: '強調を隠す', show: '強調を表示', download: '全文テキスト', source: 'Prison Watch原記録',
        page: 'PDF 第', suffix: '頁', marks: 'か所', nav: 'PDF全文', toc: '09 PDF全文', topics: '重要点・争点の注記', jump: 'カードを選ぶとPDF原文の該当箇所へ移動します。',
        original: 'PDF原文', editorial: '編集注記', direct: '直接の不一致', scope: '程度・範囲の差', record: '記録照合が必要', caution: '重点確認',
        noChange: '色は位置を示すだけで、原文は変更しません。'
      }
    }[locale];

    const kindLabels = {
      direct: labels.direct,
      scope: labels.scope,
      record: labels.record,
      caution: labels.caution
    };

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

    const highlights = [
      ['偶爾會，還好，因為我自己還有要照顧的小朋友', 1, 'direct'], ['幾乎', 1, 'direct'],
      ['中午1點下去，待1~1個多小時', 2, 'scope'], ['吃午餐，幾十分鐘', 2, 'scope'],
      ['是不是被罰站不知道', 3, 'direct'], ['問我為什麼A童站在那裡', 3, 'direct'],
      ['沒有說要做什麼', 4, 'direct'], ['就交代了一下', 4, 'direct'],
      ['手腳都被綁住', 5, 'caution'], ['傳照片才知道', 5, 'caution'],
      ['出門會托給我', 6, 'scope'], ['確實不會，劉若琳偶爾會幫忙', 6, 'scope'],
      ['跌倒、手，都有跟她說過要跟社工說', 7, 'record'], ['怕會被發現脖子上的傷', 7, 'record'],
      ['沒什麼印象，有拍過「這邊」', 8, 'scope'], ['她叫我不要這麼大聲', 8, 'scope'], ['口頭上有說不要打小孩', 8, 'scope']
    ].map(([phrase, topic, kind], index) => ({ phrase, topic, kind, id: `pdf-mark-${index + 1}` }));

    const escapeHtml = value => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
    const markPage = text => {
      const ranges = highlights
        .map(item => ({ ...item, start: text.indexOf(item.phrase) }))
        .filter(item => item.start >= 0)
        .sort((a, b) => a.start - b.start);
      let cursor = 0;
      let html = '';
      for (const item of ranges) {
        html += escapeHtml(text.slice(cursor, item.start));
        html += `<mark id="${item.id}" class="pdf-mark is-${item.kind}" data-topic="${item.topic}" title="${escapeHtml(topicSets[item.topic - 1].name)}">${escapeHtml(item.phrase)}<sup>${item.topic}</sup></mark>`;
        cursor = item.start + item.phrase.length;
      }
      return html + escapeHtml(text.slice(cursor));
    };

    document.querySelectorAll('#verbatim-record').forEach(element => {
      if (!fullRecord.contains(element)) element.remove();
    });
    fullRecord.replaceChildren();
    fullRecord.classList.add('day4-verbatim-host');
    fullRecord.setAttribute('aria-label', labels.title);

    const host = document.createElement('div');
    host.id = 'verbatim-record';
    host.className = 'day4-verbatim-render';
    fullRecord.append(host);
    const shadow = host.attachShadow({ mode: 'open' });
    const sourceUrl = 'https://www.prisonwatch-tw.org/post/day4-2025%E5%B9%B44%E6%9C%8828%E6%97%A5%EF%BC%88%E4%B8%80%EF%BC%89%E7%AC%AC%E5%9B%9B%E6%AC%A1%E5%AF%A9%E5%88%A4%E6%9C%9F%E6%97%A5';
    const countMarks = page => highlights.filter(item => page.includes(item.phrase)).length;
    const pageHtml = pages.map((page, index) => `<details class="pdf-page" open><summary><span>${labels.page}${index + 1}${labels.suffix}</span><small>${countMarks(page)} ${labels.marks}</small></summary><div class="pdf-scroll"><pre>${markPage(page)}</pre></div></details>`).join('');
    const topicHtml = topicSets.map((topic, index) => `<button type="button" class="topic-card is-${topic.kind}" data-jump-topic="${index + 1}"><b>${String(index + 1).padStart(2, '0')}</b><span><small>${escapeHtml(kindLabels[topic.kind])}</small><strong>${escapeHtml(topic.name)}</strong><em>${escapeHtml(topic.note)}</em></span></button>`).join('');

    shadow.innerHTML = `<style>
      :host{display:block;color:#153344;font-family:system-ui,-apple-system,"Noto Sans TC","PingFang TC",sans-serif}.wrap{max-width:1180px;margin:auto;padding:clamp(8px,2vw,24px)}.head small{display:block;color:#9b4d3f;font-weight:900;letter-spacing:.13em}.head h2{margin:.35rem 0 .75rem;font-family:"Noto Serif TC","Songti TC",serif;font-size:clamp(2rem,4vw,3.2rem);line-height:1.2}.head p{max-width:940px;color:#526b77;font-size:1rem;line-height:1.85}.source-note{margin-top:14px;padding:14px 17px;border-left:5px solid #b58a4a;border-radius:10px;background:#fff7e9;color:#66543e;line-height:1.75}.source-note b{display:inline-block;margin-right:.45rem;color:#7c4c28}.tools{display:flex;flex-wrap:wrap;gap:10px;margin:24px 0}.tools button,.tools a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:.68rem 1rem;border:1px solid rgba(16,43,58,.18);border-radius:999px;background:#fff;color:#173a4d;font:inherit;font-weight:850;text-decoration:none;cursor:pointer}.tools button:hover,.tools a:hover{background:#eef4f5}.legend{display:flex;flex-wrap:wrap;align-items:center;gap:9px;margin:0 0 20px}.legend strong{margin-right:4px;font-size:.8rem}.legend span{padding:.4rem .7rem;border-radius:999px;font-size:.78rem;font-weight:850}.legend .direct{background:#f8d9d3;color:#7e2e25}.legend .scope{background:#f5e6bd;color:#755610}.legend .record{background:#dceaf2;color:#24516d}.legend .caution{background:#e8ddf2;color:#5e3d78}.legend-note{display:block;width:100%;color:#687d87;font-size:.78rem}.topics{margin:22px 0 30px;padding:clamp(16px,3vw,24px);border:1px solid rgba(16,43,58,.12);border-radius:26px;background:linear-gradient(145deg,#fff,#f3eee6);box-shadow:0 16px 42px rgba(16,43,58,.08)}.topics h3{margin:0 0 .25rem;font-size:1.28rem}.topics>p{margin:.2rem 0 17px;color:#627780}.topic-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.topic-card{display:grid;grid-template-columns:42px 1fr;gap:12px;align-items:start;padding:14px;border:1px solid rgba(16,43,58,.13);border-left-width:5px;border-radius:17px;background:#fff;color:#24495b;text-align:left;cursor:pointer;box-shadow:0 8px 20px rgba(16,43,58,.05)}.topic-card:hover{transform:translateY(-1px);box-shadow:0 12px 26px rgba(16,43,58,.09)}.topic-card.is-direct{border-left-color:#b94d3f}.topic-card.is-scope{border-left-color:#b48a30}.topic-card.is-record{border-left-color:#407b9a}.topic-card.is-caution{border-left-color:#76558d}.topic-card>b{display:grid;place-items:center;width:42px;height:42px;border-radius:50%;background:#173a4d;color:#fff}.topic-card span{display:grid;gap:3px}.topic-card small{font-weight:900;letter-spacing:.04em}.topic-card strong{font-size:1rem}.topic-card em{color:#657984;font-size:.86rem;font-style:normal;line-height:1.55}.pdf-page{margin:14px 0;border:1px solid rgba(16,43,58,.15);border-radius:19px;background:#fff;box-shadow:0 10px 30px rgba(16,43,58,.07);overflow:hidden}.pdf-page summary{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:17px 19px;cursor:pointer;font-weight:900;background:#f8f4ed}.pdf-page summary small{color:#856342;font-size:.75rem}.pdf-scroll{overflow:auto;background:#fff}.pdf-scroll pre{box-sizing:border-box;width:100%;margin:0;padding:22px 24px;color:#192f3a;font:500 14px/1.78 ui-monospace,"SFMono-Regular","Noto Sans Mono CJK TC",monospace;white-space:pre-wrap;overflow-wrap:anywhere;tab-size:4}.pdf-mark{padding:.08em .14em;border-radius:.28em;box-decoration-break:clone;-webkit-box-decoration-break:clone}.pdf-mark sup{display:inline-grid;place-items:center;min-width:1.45em;height:1.45em;margin-left:.28em;border-radius:50%;background:#173a4d;color:#fff;font-size:.65em;line-height:1}.pdf-mark.is-direct{background:#f7cfc8}.pdf-mark.is-scope{background:#f3dfaa}.pdf-mark.is-record{background:#cfe4ef}.pdf-mark.is-caution{background:#dfd0eb}.hide-highlights .pdf-mark{background:transparent!important;outline:1px dotted rgba(16,43,58,.28)}.pdf-mark.is-pulse{animation:pulse 1.25s ease both}@keyframes pulse{0%,100%{box-shadow:none}35%{box-shadow:0 0 0 6px rgba(177,77,63,.23)}}.fidelity{margin:28px 0 8px;padding:15px 18px;border-radius:15px;background:#173a4d;color:#eef6f7;line-height:1.7}.fidelity b{color:#ffd7ad}.error{padding:20px;border:1px solid #d49a91;border-radius:16px;background:#fff2ef;color:#78362d}.noscript-note{color:#657984;font-size:.8rem}@media(max-width:760px){.wrap{padding:4px}.topic-grid{grid-template-columns:1fr}.topic-card{grid-template-columns:38px 1fr;padding:12px}.topic-card>b{width:38px;height:38px}.pdf-scroll pre{padding:18px 16px;font-size:13px;line-height:1.72}.head h2{font-size:clamp(1.75rem,9vw,2.5rem)}}@media(prefers-reduced-motion:reduce){.topic-card{transition:none}.pdf-mark.is-pulse{animation:none}}
    </style><div class="wrap"><header class="head"><small>${labels.kicker}</small><h2>${labels.title}</h2><p>${labels.intro}</p><div class="source-note"><b>${labels.editorial}</b>${labels.sourceNote}</div></header><div class="tools"><button type="button" data-action="toggle-pages">${labels.closeAll}</button><button type="button" data-action="toggle-highlights">${labels.hide}</button><button type="button" data-action="download">${labels.download}</button><a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">${labels.source} ↗</a></div><div class="legend"><strong>${labels.original}：</strong><span class="direct">${labels.direct}</span><span class="scope">${labels.scope}</span><span class="record">${labels.record}</span><span class="caution">${labels.caution}</span><small class="legend-note">${labels.noChange}</small></div><section class="topics"><h3>${labels.topics}</h3><p>${labels.jump}</p><div class="topic-grid">${topicHtml}</div></section><div class="pages">${pageHtml}</div><div class="fidelity"><b>${labels.original}</b>｜${labels.noChange}</div></div>`;

    const wrap = shadow.querySelector('.wrap');
    const pageDetails = [...shadow.querySelectorAll('.pdf-page')];
    const togglePages = shadow.querySelector('[data-action="toggle-pages"]');
    const toggleHighlights = shadow.querySelector('[data-action="toggle-highlights"]');

    const updatePageButton = () => {
      const allOpen = pageDetails.every(detail => detail.open);
      togglePages.textContent = allOpen ? labels.closeAll : labels.openAll;
    };

    const jumpToTopic = topic => {
      const mark = shadow.querySelector(`.pdf-mark[data-topic="${topic}"]`);
      if (!mark) return;
      const detail = mark.closest('details');
      if (detail) detail.open = true;
      mark.classList.remove('is-pulse');
      void mark.offsetWidth;
      mark.classList.add('is-pulse');
      mark.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
      updatePageButton();
    };

    togglePages.addEventListener('click', () => {
      const shouldOpen = pageDetails.some(detail => !detail.open);
      pageDetails.forEach(detail => { detail.open = shouldOpen; });
      updatePageButton();
    });

    toggleHighlights.addEventListener('click', () => {
      const hidden = wrap.classList.toggle('hide-highlights');
      toggleHighlights.textContent = hidden ? labels.show : labels.hide;
    });

    shadow.querySelector('[data-action="download"]').addEventListener('click', () => {
      const blob = new Blob([raw], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'kaikai-day4-20250428-complete-pdf-text.txt';
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });

    shadow.querySelectorAll('[data-jump-topic]').forEach(button => {
      button.addEventListener('click', () => jumpToTopic(Number(button.dataset.jumpTopic)));
    });
    pageDetails.forEach(detail => detail.addEventListener('toggle', updatePageButton));

    const chapterToTopic = { '02': 1, '03': 3, '04': 5, '05': 1, '06': 3, '07': 7, '08': 8 };
    document.addEventListener('click', event => {
      const link = event.target.closest('a[href^="#day3-chapter-"]');
      if (!link) return;
      const match = link.getAttribute('href').match(/day3-chapter-(\d+)/);
      const topic = match ? chapterToTopic[match[1]] : null;
      if (!topic) return;
      event.preventDefault();
      history.replaceState(null, '', '#full-record');
      jumpToTopic(topic);
    });

    const topLink = document.querySelector('.day3-topbar nav a[href="#full-record"]');
    const tocLink = document.querySelector('.day3-toc a[href="#full-record"]');
    if (topLink) topLink.textContent = labels.nav;
    if (tocLink) tocLink.textContent = labels.toc;

    fullRecord.dataset.pdfVerbatim = 'ready';
    updatePageButton();

    const handleHash = () => {
      if (location.hash === '#verbatim-record' || location.hash === '#full-record') {
        requestAnimationFrame(() => fullRecord.scrollIntoView({ block: 'start' }));
        return;
      }
      const markMatch = location.hash.match(/^#pdf-mark-(\d+)$/);
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
    if (fullRecord) delete fullRecord.dataset.pdfVerbatim;
    console.error('Complete Day 4 PDF record failed to load', error);
    throw error;
  });
})();
