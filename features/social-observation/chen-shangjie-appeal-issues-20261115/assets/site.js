(() => {
  const q = selector => document.querySelector(selector);
  const audio = q('#soundtrack'), play = q('.audio-toggle'), motion = q('.motion-toggle');
  const title = q('#node-title'), copy = q('#node-copy'), list = q('#node-list'), panel = q('#comparison-panel');
  const documentBody = q('.document-body');
  const readingEntry = q('.reading-entry'), readingEntryButton = q('.reading-entry-button');
  const chapterHeadings = [];

  const nodes = {
    family: { title: '親屬：照顧與監護資訊的一端', copy: '需核對親屬在何時取得何種訊息、與誰聯繫，以及監護與照顧安排如何影響可採取措施。', items: ['權限：監護、就醫與照顧安排的實際參與', '證據：監護卷證、聯繫與回應紀錄', '爭點：資訊是否已被傳遞並形成後續處置的可能'] },
    chen: { title: '陳尚潔：資訊與處置樞紐', copy: '應分別檢驗她的個案角色、可得資訊、聯繫能力、向上呈報與協作路徑；這些都是待由卷證核對的事實，而非預設結論。', items: ['權限：能否查證、回報、通報或促成就醫', '證據：工作紀錄、聯繫紀錄、督導鏈與機構流程', '爭點：實際控制是否足以形成個人化義務'] },
    caregiver: { title: '保母：實際照顧與訊息來源的一端', copy: '應釐清照顧現場的資訊、回覆內容、合作關係與居托體系的分工；不能將他人義務直接移植為個人刑責。', items: ['權限：照顧現場、回報與配合要求的範圍', '證據：托育紀錄、訊息、居托與醫療資料', '爭點：何種異常訊息已足以啟動查證或升級處置'] }
  };
  const issues = {
    duty: ['機構或行政規範的義務，不能當然落到個別收出養社工；須具體證明義務來源及個人化。', '被告承接個案、實際工作與保護／通報規範，可作為積極作為義務的討論起點。', '職務說明、個案分派、督導鏈、契約與原審理由。'],
    info: ['實際知悉內容、時間與可信度須具體證明，不能由結果倒推。', '異常訊息、專業背景與個案角色，可能支持提高查證與處置的主張。', '完整訪視、聯繫、醫療、督導與跨機關紀錄。'],
    action: ['無強制變更照顧或監護權限；可採措施及其他機關是否接手均須具體化。', '爭點不是能否取代保護體系，而是能否查證、回報、通報、促成就醫或啟動協作。', '通報流程、督導決策、轉介與醫療回應紀錄。'],
    cause: ['須證明採取特定作為後，死亡有相當可能被避免；不能以行政瑕疵取代因果證明。', '若及早處置可使醫療或保護系統介入，不作為與結果的連結值得調查。', '醫療意見、保護系統時程及各措施可能效果。']
  };
  const chapterNames = { 一: '案件與程序定位', 二: '爭點總覽', 三: '不作為犯與保證人地位', 四: '保證人地位的五步檢驗', 五: '作為可能性與避免死亡結果', 六: '注意義務、風險訊號與通報', 七: '制度分工', 八: '規範來源與提醒指標', 九: '調查聲請與待證資料', 十: '法律與社工專業鑑定', 十一: '雙方攻防的結構對照', 十二: '證據與論證地圖', 十三: '現階段程序與後續待辦', 十四: '規範適用、職務分工與個人義務', 十五: '檢辯主張對照表' };
  function renderIssue(key) { const [defence, prosecution, evidence] = issues[key]; panel.innerHTML = `<article><h3>辯方摘要</h3><p>${defence}</p></article><article><h3>檢方／一審方向</h3><p>${prosecution}</p></article><article><h3>待核對資料</h3><p>${evidence}</p></article>`; }
  function enhanceDocument() {
    if (!documentBody || documentBody.querySelector('.chapter-section')) return;
    const style = document.createElement('style');
    style.textContent = `.document-body{max-width:780px;margin:0 auto;padding:clamp(22px,5vw,58px);background:#fffdf8;color:#183d3f;font-family:system-ui,"Noto Sans TC",sans-serif;line-height:1.95}.document-body h2{font-family:"Noto Serif TC","Songti TC",serif!important;color:#183d3f!important;border-top:1px solid #c39b55!important;padding-top:34px!important}.document-body h3{font-family:"Noto Serif TC",serif!important;color:#785039!important}.document-body table{display:block;overflow:auto;border-collapse:collapse;background:#fff;max-width:100%}.document-body td,.document-body th{padding:10px!important;border:1px solid #d8cab2!important}.chapter-art{position:relative;margin:22px 0 34px;overflow:hidden;background:#e5e0d6;border:1px solid #d8cab2}.chapter-art img{display:block;width:100%;aspect-ratio:16/7;object-fit:cover}.chapter-art figcaption{position:absolute;inset:auto 0 0;padding:12px 17px;color:#fff;background:linear-gradient(90deg,#183d3fe8,#183d3f22);font:700 13px system-ui,"Noto Sans TC",sans-serif;letter-spacing:.07em}.chapter-art b{display:block;font:700 19px "Noto Serif TC",serif;letter-spacing:.03em;margin-top:2px}`;
    document.head.append(style);
    [...documentBody.querySelectorAll('h1')].forEach(heading => {
      if (!heading.textContent.trim()) { heading.remove(); return; }
      const replacement = document.createElement('h2');
      [...heading.attributes].forEach(attribute => replacement.setAttribute(attribute.name, attribute.value));
      replacement.innerHTML = heading.innerHTML;
      heading.replaceWith(replacement);
    });
    const headings = [...documentBody.querySelectorAll('h2')].filter(heading => /^([一二三四五六七八九十]+)、/.test(heading.textContent.trim()));
    headings.forEach(heading => {
      const match = heading.textContent.trim().match(/^([一二三四五六七八九十]+)、/);
      if (!match || !chapterNames[match[1]]) return;
      const number = Object.keys(chapterNames).indexOf(match[1]) + 1;
      const figure = document.createElement('figure');
      figure.className = 'chapter-art';
      figure.innerHTML = `<img src="./assets/chapter-${String(number).padStart(2, '0')}.jpg" alt="第${number}章：${chapterNames[match[1]]}的現代水墨意象"><figcaption>第 ${number} 章<b>${chapterNames[match[1]]}</b></figcaption>`;
      heading.classList.add('chapter-title');
      heading.insertAdjacentElement('afterend', figure);
      chapterHeadings.push({ number, heading, title: chapterNames[match[1]] });
    });
    const tools = document.createElement('nav');
    tools.className = 'reading-tools';
    tools.setAttribute('aria-label', '十五章閱讀控制');
    tools.innerHTML = '<div class="reading-tools-actions"><button type="button" data-expand>全部展開</button><button type="button" data-collapse>全部收合</button></div><div class="chapter-nav"></div>';
    documentBody.insertAdjacentElement('beforebegin', tools);
    const nav = tools.querySelector('.chapter-nav');
    const ordered = [...chapterHeadings].sort((a, b) => a.number - b.number);
    ordered.forEach((item, index) => {
      const nextHeading = ordered[index + 1]?.heading;
      const details = document.createElement('details');
      details.className = 'chapter-section';
      details.id = 'chapter-' + String(item.number).padStart(2, '0');
      details.open = [1, 4, 15].includes(item.number);
      const summary = document.createElement('summary');
      summary.textContent = item.heading.textContent.trim();
      const body = document.createElement('div');
      body.className = 'chapter-section-body';
      item.heading.parentNode.insertBefore(details, item.heading);
      details.append(summary, body);
      let node = item.heading;
      while (node && node !== nextHeading) {
        const next = node.nextSibling;
        body.appendChild(node);
        node = next;
      }
      const jump = document.createElement('div');
      jump.className = 'chapter-jump';
      jump.innerHTML = '<a href="#complete-document">回到章節目錄</a>' + (index < ordered.length - 1 ? '<a href="#chapter-' + String(ordered[index + 1].number).padStart(2, '0') + '">下一章 →</a>' : '<a href="#comparison">回到重點對照 ↑</a>');
      body.appendChild(jump);
      const link = document.createElement('a');
      link.href = '#' + details.id;
      link.textContent = String(item.number).padStart(2, '0');
      link.title = item.title;
      nav.appendChild(link);
    });
    tools.querySelector('[data-expand]').addEventListener('click', () => documentBody.querySelectorAll('.chapter-section').forEach(section => section.open = true));
    tools.querySelector('[data-collapse]').addEventListener('click', () => documentBody.querySelectorAll('.chapter-section').forEach(section => section.open = false));
  }
  function addReadingProgress() {
    const bar = document.createElement('div'); bar.className = 'reading-progress'; bar.setAttribute('aria-hidden','true'); bar.innerHTML = '<span></span>'; document.body.prepend(bar);
    const fill = bar.firstElementChild;
    const update = () => { const max = document.documentElement.scrollHeight - innerHeight; fill.style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`; };
    addEventListener('scroll', update, { passive: true }); addEventListener('resize', update); update();
  }
  function simplifyChapterSelect() {
    const toolbar = document.querySelector('#cpa-four-language-toolbar'); if (!toolbar) return;
    const select = [...toolbar.querySelectorAll('select')].find(item => item.options?.[0]?.textContent.trim() === '章節'); if (!select || select.dataset.simplified) return;
    const keep = [...select.options].filter((option, index) => index === 0 || /^(能同時聯繫|先把每一環|不是保證|同一爭點|結論必須|從程序定位|[一二三四五六七八九十]+、)/.test(option.textContent.trim()));
    select.replaceChildren(...keep.map(option => option.cloneNode(true))); select.dataset.simplified = 'true';
  }
  renderIssue('duty');
  document.querySelectorAll('[data-node]').forEach(button => button.addEventListener('click', () => { const node = nodes[button.dataset.node]; title.textContent = node.title; copy.textContent = node.copy; list.innerHTML = node.items.map(item => `<li>${item}</li>`).join(''); }));
  document.querySelectorAll('[data-issue]').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('[data-issue]').forEach(item => item.setAttribute('aria-selected', 'false')); button.setAttribute('aria-selected', 'true'); renderIssue(button.dataset.issue); }));
  async function autoMusic() {
    if (!audio) return;
    audio.autoplay = true; audio.loop = true; audio.playsInline = true; audio.preload = 'auto'; audio.volume = .28; audio.muted = false;
    try {
      await audio.play();
      play.textContent = '暫停配樂'; play.setAttribute('aria-pressed', 'true');
    } catch {
      play.textContent = '點一下開啟配樂'; play.setAttribute('aria-pressed', 'false'); play.classList.add('needs-gesture');
      const unlock = async event => {
        if (event?.target?.closest?.('.motion-toggle,.audio-toggle')) return;
        try { audio.muted = false; await audio.play(); play.textContent = '暫停配樂'; play.setAttribute('aria-pressed', 'true'); play.classList.remove('needs-gesture'); } catch {}
      };
      ['pointerdown','touchstart','keydown'].forEach(type => document.addEventListener(type, unlock, { once: true, passive: type !== 'keydown' }));
    }
  }
  readingEntryButton?.addEventListener('click', async () => {
    readingEntryButton.disabled = true;
    readingEntryButton.textContent = '正在進入…';
    try {
      audio.muted = false; audio.volume = .28; audio.loop = true; await audio.play();
      play.textContent = '暫停配樂'; play.setAttribute('aria-pressed', 'true'); play.classList.remove('needs-gesture');
    } catch {
      play.textContent = '播放配樂'; play.setAttribute('aria-pressed', 'false');
    }
    document.body.classList.remove('entry-locked');
    readingEntry.classList.add('is-leaving');
    setTimeout(() => { readingEntry.hidden = true; q('#title')?.focus?.({ preventScroll: true }); }, 560);
  });
  play?.addEventListener('click', async () => { try { if (audio.paused) { audio.muted = false; await audio.play(); play.textContent = '暫停配樂'; play.setAttribute('aria-pressed', 'true'); } else if (audio.muted) { audio.muted = false; play.textContent = '暫停配樂'; play.setAttribute('aria-pressed', 'true'); } else { audio.pause(); play.textContent = '播放配樂'; play.setAttribute('aria-pressed', 'false'); } } catch { play.textContent = '播放配樂'; } });
  let artContext;
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  function updateArtMotion() {
    artContext?.revert();
    artContext = null;
    if (!window.gsap || !window.ScrollTrigger || motionPreference.matches || document.documentElement.classList.contains('reduce-motion')) return;
    gsap.registerPlugin(ScrollTrigger);
    artContext = gsap.context(() => {
      gsap.from('.paper-relief i', {y:18, stagger:.12, duration:.8, ease:'power2.out', scrollTrigger:{trigger:'#three-way',start:'top 90%',once:true},clearProps:'transform'});
      gsap.from('.question-grid article', {y:16, stagger:.09, duration:.55, ease:'power2.out', scrollTrigger:{trigger:'.question-grid',start:'top 90%',once:true},clearProps:'transform'});
    });
  }
  motion?.addEventListener('click', () => {
    const enabled = document.documentElement.classList.toggle('reduce-motion');
    motion.setAttribute('aria-pressed', String(enabled));
    motion.textContent = enabled ? '恢復動態' : '減少動態';
    updateArtMotion();
  });
  motionPreference.addEventListener('change', updateArtMotion);
  const relief = document.createElement('div');
  relief.className = 'paper-relief';
  relief.setAttribute('aria-hidden', 'true');
  relief.innerHTML = '<i></i><i></i><i></i>';
  q('#three-way')?.prepend(relief);
  document.querySelectorAll('[data-node]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.node === 'chen'));
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-node]').forEach(node => node.setAttribute('aria-pressed', String(node === button)));
    });
  });
  autoMusic();
  window.addEventListener('load', () => {
    enhanceDocument(); addReadingProgress(); simplifyChapterSelect(); setTimeout(simplifyChapterSelect, 500);
    updateArtMotion();
  });
})();
