(() => {
  'use strict';

  window.day4VerbatimReady = (async () => {
    if (!document.body.classList.contains('day4-page') || document.getElementById('verbatim-record')) return;

    const current = document.currentScript;
    const base = current ? new URL('./', current.src) : new URL('./', location.href);
    const partUrls = [0, 1].map(index => new URL(`../../../assets/day4-verbatim-source-${index}.b64?v=20260821-verbatim-2`, base));
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
        kicker: '08A · PDF VERBATIM RECORD', title: 'PDF 原文完整證詞｜11頁逐頁保留',
        intro: '以下完整呈現上傳 PDF 的逐頁文字：不刪節、不合併、不改寫，也不修正原有用詞。彩色標記只協助定位重點，不會改動證詞內容，亦不代表法院已認定任何一方說謊。',
        sourceNote: '原始 PDF 為繁體中文；切換簡體、英文或日文介面時，本區仍保留原始文字。',
        openAll: '展開全部', closeAll: '收合全部', hide: '隱藏標記', show: '顯示標記', download: '下載完整純文字', source: '查看 Prison Watch 原始紀錄',
        page: 'PDF 第', suffix: '頁', marks: '處重點', nav: 'PDF原文', toc: '08A PDF原文', topics: '八組重點原文定位', jump: '點選議題可跳到 PDF 原句。'
      },
      'zh-Hans': {
        kicker: '08A · PDF VERBATIM RECORD', title: 'PDF 原文完整证词｜11页逐页保留',
        intro: '以下完整呈现上传 PDF 的逐页文字：不删节、不合并、不改写，也不修正原有用词。彩色标记只用于定位重点，不会改变证词内容，也不代表法院已经认定任何一方说谎。',
        sourceNote: '原始 PDF 为繁体中文；切换简体、英文或日文界面时，本区仍保留原始文字。',
        openAll: '展开全部', closeAll: '收起全部', hide: '隐藏标记', show: '显示标记', download: '下载完整纯文字', source: '查看 Prison Watch 原始记录',
        page: 'PDF 第', suffix: '页', marks: '处重点', nav: 'PDF原文', toc: '08A PDF原文', topics: '八组重点原文定位', jump: '点击议题可跳到 PDF 原句。'
      },
      en: {
        kicker: '08A · PDF VERBATIM RECORD', title: 'Complete PDF testimony | All 11 pages preserved',
        intro: 'The uploaded PDF text is reproduced page by page without shortening, merging, rewriting or silent correction. Colour highlights only locate key passages; they are not findings that either witness lied.',
        sourceNote: 'The source PDF is in Traditional Chinese. Its original wording remains unchanged in every language interface.',
        openAll: 'Open all', closeAll: 'Collapse all', hide: 'Hide highlights', show: 'Show highlights', download: 'Download full text', source: 'Original Prison Watch record',
        page: 'PDF page ', suffix: '', marks: ' highlights', nav: 'PDF text', toc: '08A PDF text', topics: 'Eight source-text cross-checks', jump: 'Select a topic to jump to the exact PDF wording.'
      },
      ja: {
        kicker: '08A · PDF VERBATIM RECORD', title: 'PDF証言全文｜11ページをそのまま収録',
        intro: '提出されたPDFの文字をページごとに、省略・統合・書き換え・黙示的訂正をせず掲載します。色付き表示は重要箇所の位置を示すだけで、虚偽供述の認定ではありません。',
        sourceNote: '原PDFは繁体字中国語です。言語を切り替えても原文は変更しません。',
        openAll: 'すべて開く', closeAll: 'すべて閉じる', hide: '強調を隠す', show: '強調を表示', download: '全文テキスト', source: 'Prison Watch原記録',
        page: 'PDF 第', suffix: '頁', marks: 'か所', nav: 'PDF原文', toc: '08A PDF原文', topics: '8項目の原文照合', jump: '項目を選ぶとPDF原文の該当箇所へ移動します。'
      }
    }[locale];

    const topicNames = {
      'zh-Hant': ['丙地頻率與時段', '甲地停留時間', '冷靜區／罰站知情', '澡盆事件代顧交代', '綑綁知情時間', '各自照顧／互相代顧', '傷勢通報與避免被看見', '是否曾制止管教'],
      'zh-Hans': ['丙地频率与时段', '甲地停留时间', '冷静区／罚站知情', '澡盆事件代为照顾', '捆绑知情时间', '各自照顾／互相代顾', '伤势通报与避免被看见', '是否曾制止管教'],
      en: ['Visits to the sister’s home', 'Time spent at the main location', 'Knowledge of standing punishment', 'Basin handover', 'Knowledge of restraint', 'Separate care or shared care', 'Injury reporting and concealment', 'Intervention in discipline'],
      ja: ['丙地への訪問頻度', '甲地での滞在時間', '立たせへの認識', '洗面器事件の引継ぎ', '拘束を知った時期', '別々の保育か相互代行か', 'けがの通報と隠匿', '管教を止めたか']
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
      const ranges = highlights.map(item => ({ ...item, start: text.indexOf(item.phrase) })).filter(item => item.start >= 0).sort((a, b) => a.start - b.start);
      let cursor = 0;
      let html = '';
      for (const item of ranges) {
        html += escapeHtml(text.slice(cursor, item.start));
        html += `<mark id="${item.id}" class="pdf-mark is-${item.kind}" data-topic="${item.topic}" title="${escapeHtml(topicNames[item.topic - 1])}">${escapeHtml(item.phrase)}<sup>${item.topic}</sup></mark>`;
        cursor = item.start + item.phrase.length;
      }
      return html + escapeHtml(text.slice(cursor));
    };

    const section = document.createElement('section');
    section.id = 'verbatim-record';
    section.className = 'day3-section day4-verbatim-host';
    section.setAttribute('aria-label', labels.title);
    const shadow = section.attachShadow({ mode: 'open' });
    const sourceUrl = 'https://www.prisonwatch-tw.org/post/day4-2025%E5%B9%B44%E6%9C%8828%E6%97%A5%EF%BC%88%E4%B8%80%EF%BC%89%E7%AC%AC%E5%9B%9B%E6%AC%A1%E5%AF%A9%E5%88%A4%E6%9C%9F%E6%97%A5';
    const countMarks = page => highlights.filter(item => page.includes(item.phrase)).length;
    const pageHtml = pages.map((page, index) => `<details class="pdf-page" ${index === 0 ? 'open' : ''}><summary><span>${labels.page}${index + 1}${labels.suffix}</span><small>${countMarks(page)} ${labels.marks}</small></summary><div class="pdf-scroll"><pre>${markPage(page)}</pre></div></details>`).join('');
    const topicHtml = topicNames.map((name, index) => `<button type="button" data-jump-topic="${index + 1}"><b>${String(index + 1).padStart(2, '0')}</b><span>${escapeHtml(name)}</span></button>`).join('');

    shadow.innerHTML = `<style>
      :host{display:block;color:#153344;font-family:system-ui,-apple-system,"Noto Sans TC","PingFang TC",sans-serif}.wrap{max-width:1180px;margin:auto}.head small{display:block;color:#9b4d3f;font-weight:900;letter-spacing:.13em}.head h2{margin:.35rem 0 .75rem;font-family:"Noto Serif TC","Songti TC",serif;font-size:clamp(2rem,4vw,3.2rem);line-height:1.2}.head p{max-width:920px;color:#526b77;font-size:1rem;line-height:1.85}.source-note{margin-top:12px;padding:12px 16px;border-left:4px solid #b58a4a;border-radius:8px;background:#fff7e9;color:#6b5941}.tools{display:flex;flex-wrap:wrap;gap:10px;margin:24px 0}.tools button,.tools a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:.65rem .95rem;border:1px solid rgba(16,43,58,.18);border-radius:999px;background:#fff;color:#173a4d;font:inherit;font-weight:850;text-decoration:none;cursor:pointer}.tools button:hover,.tools a:hover{background:#eef4f5}.legend{display:flex;flex-wrap:wrap;gap:9px;margin:0 0 20px}.legend span{padding:.4rem .7rem;border-radius:999px;font-size:.78rem;font-weight:850}.legend .direct{background:#f8d9d3;color:#7e2e25}.legend .scope{background:#f5e6bd;color:#755610}.legend .record{background:#dceaf2;color:#24516d}.legend .caution{background:#e8ddf2;color:#5e3d78}.topics{margin:22px 0 28px;padding:20px;border:1px solid rgba(16,43,58,.12);border-radius:24px;background:linear-gradient(145deg,#fff,#f3eee6)}.topics h3{margin:0 0 .25rem;font-size:1.2rem}.topics p{margin:.2rem 0 15px;color:#627780}.topic-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.topic-grid button{display:grid;grid-template-columns:34px 1fr;gap:9px;align-items:center;padding:10px;border:1px solid rgba(16,43,58,.12);border-radius:14px;background:#fff;color:#24495b;text-align:left;cursor:pointer}.topic-grid b{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#173a4d;color:#fff}.pdf-page{margin:12px 0;border:1px solid rgba(16,43,58,.15);border-radius:18px;background:#fff;box-shadow:0 10px 30px rgba(16,43,58,.07);overflow:hidden}.pdf-page summary{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:17px 19px;cursor:pointer;font-weight:900;background:#f8f4ed}.pdf-page summary small{color:#856342;font-size:.75rem}.pdf-scroll{overflow:auto;background:#fff}.pdf-scroll pre{box-sizing:border-box;min-width:900px;margin:0;padding:22px 24px;color:#192f3a;font:500 14px/1.72 ui-monospace,"SFMono-Regular","Noto Sans Mono CJK TC",monospace;white-space:pre;tab-size:4}.pdf-mark{padding:.08em .12em;border-radius:.25em;box-decoration-break:clone;-webkit-box-decoration-break:clone}.pdf-mark sup{display:inline-grid;place-items:center;min-width:1.35em;height:1.35em;margin-left:.25em;border-radius:50%;background:#173a4d;color:#fff;font-size:.65em;line-height:1}.pdf-mark.is-direct{background:#ffd7cf;color:#70271f}.pdf-mark.is-scope{background:#ffeab0;color:#684e0b}.pdf-mark.is-record{background:#d7edf8;color:#174d69}.pdf-mark.is-caution{background:#eadcf7;color:#563573}.hide-marks .pdf-mark{padding:0;background:transparent!important;color:inherit!important}.hide-marks .pdf-mark sup{display:none}.verify{margin-top:18px;padding:16px 18px;border-radius:14px;background:#102b3a;color:#edf5f5;font:600 12px/1.7 ui-monospace,monospace;overflow-wrap:anywhere}@media(max-width:900px){.topic-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.topic-grid{grid-template-columns:1fr}.tools>*{flex:1 1 45%}.pdf-scroll pre{font-size:13px}.head h2{font-size:1.8rem}}
    </style><div class="wrap"><header class="head"><small>${labels.kicker}</small><h2>${labels.title}</h2><p>${labels.intro}</p><p class="source-note">${labels.sourceNote}</p></header><div class="tools"><button type="button" data-open-all>${labels.openAll}</button><button type="button" data-close-all>${labels.closeAll}</button><button type="button" data-toggle-marks>${labels.hide}</button><a data-download>${labels.download}</a><a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">${labels.source} ↗</a></div><div class="legend"><span class="direct">01–04 ${topicNames[0] ? '●' : ''} ${locale === 'en' ? 'Direct conflict' : locale === 'ja' ? '直接不一致' : '直接不一致'}</span><span class="scope">${locale === 'en' ? 'Scope / degree' : locale === 'ja' ? '範囲・程度' : locale === 'zh-Hans' ? '程度／范围不同' : '程度／範圍不同'}</span><span class="record">${locale === 'en' ? 'Check records' : locale === 'ja' ? '記録照合' : locale === 'zh-Hans' ? '须以记录核对' : '須以紀錄核對'}</span><span class="caution">${locale === 'en' ? 'High-priority check' : locale === 'ja' ? '重点確認' : locale === 'zh-Hans' ? '高度待核' : '高度待核'}</span></div><section class="topics"><h3>${labels.topics}</h3><p>${labels.jump}</p><div class="topic-grid">${topicHtml}</div></section><div class="pages">${pageHtml}</div><div class="verify">PDF pages: 11<br>Text SHA-256: 9842c7562f8dd3b7e09671c03eabecc168daeadbef962b96dbac52b99f7790d6<br>Original PDF SHA-256: 3fba39c082c5ad28070acbe5d5ad476afbf7b898fe972a5c8a61226e2f4c52f2</div></div>`;

    const fullRecord = document.getElementById('full-record');
    if (!fullRecord) throw new Error('Full-record insertion point not found');
    fullRecord.before(section);

    const details = [...shadow.querySelectorAll('details')];
    shadow.querySelector('[data-open-all]').addEventListener('click', () => details.forEach(item => { item.open = true; }));
    shadow.querySelector('[data-close-all]').addEventListener('click', () => details.forEach(item => { item.open = false; }));
    const toggle = shadow.querySelector('[data-toggle-marks]');
    toggle.addEventListener('click', () => {
      const hidden = shadow.querySelector('.wrap').classList.toggle('hide-marks');
      toggle.textContent = hidden ? labels.show : labels.hide;
    });
    shadow.querySelectorAll('[data-jump-topic]').forEach(button => button.addEventListener('click', () => {
      const topic = button.dataset.jumpTopic;
      const target = shadow.querySelector(`mark[data-topic="${topic}"]`);
      if (!target) return;
      target.closest('details').open = true;
      requestAnimationFrame(() => target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' }));
    }));
    const download = shadow.querySelector('[data-download]');
    download.href = URL.createObjectURL(new Blob([raw], { type: 'text/plain;charset=utf-8' }));
    download.download = 'DAY4-2025-04-28-Prison-Watch-verbatim.txt';

    const insertNav = (selector, text) => {
      const target = document.querySelector(selector);
      if (!target || document.querySelector(`${selector.split(' a')[0]} a[href="#verbatim-record"]`)) return;
      const link = document.createElement('a');
      link.href = '#verbatim-record';
      link.textContent = text;
      target.before(link);
    };
    insertNav('.day3-topbar nav a[href="#full-record"]', labels.nav);
    insertNav('.day3-toc a[href="#full-record"]', labels.toc);
    if (location.hash === '#verbatim-record') requestAnimationFrame(() => section.scrollIntoView({ block: 'start' }));
  })().catch(error => {
    console.error('Day 4 verbatim record failed', error);
    const fullRecord = document.getElementById('full-record');
    if (!fullRecord || document.getElementById('verbatim-record-error')) return;
    const errorBox = document.createElement('aside');
    errorBox.id = 'verbatim-record-error';
    errorBox.className = 'day3-notice';
    errorBox.innerHTML = '<b>PDF 原文載入失敗</b><p>請重新整理頁面，或先閱讀 Prison Watch 原始紀錄。</p>';
    fullRecord.before(errorBox);
  });
})();
