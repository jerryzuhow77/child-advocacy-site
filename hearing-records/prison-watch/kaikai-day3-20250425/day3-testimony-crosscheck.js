(() => {
  'use strict';

  const currentScript = document.currentScript;
  const loadCore = () => {
    if (window.__day3ReadingCoreRequested) return;
    window.__day3ReadingCoreRequested = true;
    const core = document.createElement('script');
    core.src = new URL('./day3-reading-core-20260821.js?v=20260821-testimony-crosscheck-1', currentScript?.src || location.href).href;
    core.async = false;
    core.onerror = () => console.error('Day 3 reading core failed to load.');
    document.head.append(core);
  };

  if (window.__day3FormerNannyCrosscheckInjected) {
    loadCore();
    return;
  }
  window.__day3FormerNannyCrosscheckInjected = true;

  const isHans = new URLSearchParams(location.search).get('lang') === 'zh-Hans'
    || document.documentElement.lang === 'zh-Hans'
    || localStorage.getItem('siteLang') === 'zh-Hans';

  const copies = {
    hant: {
      nav: '保母核對',
      toc: '02A 前保母證詞核對',
      eyebrow: '02A · FORMER CAREGIVERS SOURCE CHECK',
      title: '兩位前保母證詞｜矛盾、表面張力與跨階段差異',
      intro: '以下只標示原始旁聽紀錄可直接對照的日期差異、回答張力與觀察範圍。只有同一命題出現不能同時成立的說法，才列為明確差異；月齡、照顧期間、提問概念不同者，改列「表面張力」或「跨階段差異」，不把它們硬寫成互相推翻。',
      legend: [
        ['明確差異', '同段起訖日期出現兩套不同記載'],
        ['表面張力', '整體評價與特定症狀／事件需同時保留'],
        ['跨階段差異', '不同月齡與照顧期間不能直接互相替代']
      ],
      recordA: '記錄 A｜',
      recordB: '記錄 B｜',
      reading: '判讀｜',
      open: '回到完整問答',
      cards: [
        {
          tag: '01 · 周○／明確差異',
          title: '照顧起訖日期出現兩套答案',
          a: '先答「111年6月30日至112年8月30日」。',
          b: '同一段又答「111年6月28日至112年8月31日」。',
          reading: '這是原紀錄可直接確認的日期差異；在正式筆錄或相關文件核對前，不應自行選定其中一套。',
          links: [['#day3-chapter-02', '周○主詰問']]
        },
        {
          tag: '02 · 周○／健康用語',
          title: '「健康很好」與多次就醫、檢驗數值',
          a: '主詰問稱睡眠、健康都很好，健檢回診時沒有被告知異常。',
          b: '反詰問提示2023年5月至8月多次看診；證人稱換季流鼻水、鼻子較過敏。提示肌酐酸偏低時，她答沒有印象，記得醫師說正常。',
          reading: '整體健康評價可以與換季就醫並存；「未被告知異常」是證人的記憶與理解，不等於對檢驗數值作醫療判讀。',
          links: [['#day3-chapter-02', '健康概述'], ['#day3-chapter-03', '就醫與檢驗']]
        },
        {
          tag: '03 · 周○／概念差異',
          title: '「換尿布較僵硬」不等於固定僵直',
          a: '接手提醒中提到，換尿布時身體較僵硬，到陌生環境會害怕。',
          b: '後續又稱不會固定僵直站立、手腳無異狀，走路穩、跑步偶爾跌倒。',
          reading: '前者是特定照顧動作與適應情境，後者詢問持續性的姿勢、肢體異常與較後期發展；表面有張力，但不是同一件事。',
          links: [['#day3-chapter-02', '接手提醒'], ['#day3-chapter-03', '覆主詰問'], ['#day3-chapter-04', '法官提問']]
        },
        {
          tag: '04 · 周○／交接範圍',
          title: '沒有談細節，但部分資訊交給社工',
          a: '證人稱與劉保母僅互動約一小時，沒有談照顧細節；奶量等資訊是向社工交代。',
          b: '又稱沒有特別交接食物要剪碎，因為這是保母都知道的一般常識。',
          reading: '兩段顯示的是不同資訊傳遞路徑，以及證人對「一般常識」的假設；不能因此推定被告本人已直接收到所有細節。',
          links: [['#day3-chapter-03', '交接過程'], ['#day3-chapter-04', '法官提問']]
        },
        {
          tag: '05 · 蕭○香／表面張力',
          title: '「整體還好」與手緊、醫療追蹤建議',
          a: '稱四個多月時整體還好，但洗澡、換衣服時手較緊，哭時會用力、臉色改變；紀錄顯示醫師建議觀察並至小兒神經科。',
          b: '反詰問時又稱照顧沒有特別困難、成長未見異於同齡，且一般幼兒也可能緊繃。',
          reading: '「整體還好」不能抹去曾出現的特定徵象；醫師建議追蹤也不等於已診斷異常。兩層訊息應並列，而不是只擇一。',
          links: [['#day3-chapter-05', '蕭○香完整證詞']]
        },
        {
          tag: '06 · 兩位前保母／跨階段',
          title: '嬰兒期緊繃，與後期手腳無異狀',
          a: '蕭○香照顧四、五個月大時，描述洗澡、換衣時手較緊；周○接手時也提到換尿布較僵硬。',
          b: '周○描述較後期沒有固定僵直站立，手腳無異狀，之後能穩定走路、跑步。',
          reading: '兩位證人談的是不同月齡與不同階段；可能呈現情況改變，也可能是觀察項目不同。這組對照不能直接被寫成誰推翻誰。',
          links: [['#day3-chapter-02', '周○接手'], ['#day3-chapter-04', '後期發展'], ['#day3-chapter-05', '嬰兒期觀察']]
        }
      ],
      sourceTitle: '原檔文字異常也已標出',
      source: '蕭○香段落另出現一段與周○庭末意見相同的文字，可能是原頁編排或複製所致。本頁保留提醒，但不把該段改認為蕭○香的證詞或法院結論。',
      previous: '返回第二日 Mira 證詞核對專區'
    },
    hans: {
      nav: '保姆核对',
      toc: '02A 前保姆证词核对',
      eyebrow: '02A · FORMER CAREGIVERS SOURCE CHECK',
      title: '两位前保姆证词｜矛盾、表面张力与跨阶段差异',
      intro: '以下只标示原始旁听记录可直接对照的日期差异、回答张力与观察范围。只有同一命题出现不能同时成立的说法，才列为明确差异；月龄、照顾期间、提问概念不同者，改列“表面张力”或“跨阶段差异”，不把它们硬写成互相推翻。',
      legend: [
        ['明确差异', '同段起止日期出现两套不同记载'],
        ['表面张力', '整体评价与特定症状／事件需同时保留'],
        ['跨阶段差异', '不同月龄与照顾期间不能直接互相替代']
      ],
      recordA: '记录 A｜',
      recordB: '记录 B｜',
      reading: '判读｜',
      open: '回到完整问答',
      cards: [
        {
          tag: '01 · 周○／明确差异',
          title: '照顾起止日期出现两套答案',
          a: '先答“111年6月30日至112年8月30日”。',
          b: '同一段又答“111年6月28日至112年8月31日”。',
          reading: '这是原记录可直接确认的日期差异；在正式笔录或相关文件核对前，不应自行选定其中一套。',
          links: [['#day3-chapter-02', '周○主诘问']]
        },
        {
          tag: '02 · 周○／健康用语',
          title: '“健康很好”与多次就医、检验数值',
          a: '主诘问称睡眠、健康都很好，健检复诊时没有被告知异常。',
          b: '反诘问提示2023年5月至8月多次就诊；证人称换季流鼻水、鼻子较过敏。提示肌酐酸偏低时，她答没有印象，记得医师说正常。',
          reading: '整体健康评价可以与换季就医并存；“未被告知异常”是证人的记忆与理解，不等于对检验数值作医疗判读。',
          links: [['#day3-chapter-02', '健康概述'], ['#day3-chapter-03', '就医与检验']]
        },
        {
          tag: '03 · 周○／概念差异',
          title: '“换尿布较僵硬”不等于固定僵直',
          a: '接手提醒中提到，换尿布时身体较僵硬，到陌生环境会害怕。',
          b: '后续又称不会固定僵直站立、手脚无异常，走路稳、跑步偶尔跌倒。',
          reading: '前者是特定照顾动作与适应情境，后者询问持续性的姿势、肢体异常与较后期发展；表面有张力，但不是同一件事。',
          links: [['#day3-chapter-02', '接手提醒'], ['#day3-chapter-03', '覆主诘问'], ['#day3-chapter-04', '法官提问']]
        },
        {
          tag: '04 · 周○／交接范围',
          title: '没有谈细节，但部分信息交给社工',
          a: '证人称与刘保姆仅互动约一小时，没有谈照顾细节；奶量等信息是向社工交代。',
          b: '又称没有特别交接食物要剪碎，因为这是保姆都知道的一般常识。',
          reading: '两段显示的是不同信息传递路径，以及证人对“一般常识”的假设；不能因此推定被告本人已直接收到所有细节。',
          links: [['#day3-chapter-03', '交接过程'], ['#day3-chapter-04', '法官提问']]
        },
        {
          tag: '05 · 萧○香／表面张力',
          title: '“整体还好”与手紧、医疗追踪建议',
          a: '称四个多月时整体还好，但洗澡、换衣服时手较紧，哭时会用力、脸色改变；记录显示医师建议观察并至小儿神经科。',
          b: '反诘问时又称照顾没有特别困难、成长未见异于同龄，且一般幼儿也可能紧绷。',
          reading: '“整体还好”不能抹去曾出现的特定征象；医师建议追踪也不等于已诊断异常。两层信息应并列，而不是只择一。',
          links: [['#day3-chapter-05', '萧○香完整证词']]
        },
        {
          tag: '06 · 两位前保姆／跨阶段',
          title: '婴儿期紧绷，与后期手脚无异常',
          a: '萧○香照顾四、五个月大时，描述洗澡、换衣时手较紧；周○接手时也提到换尿布较僵硬。',
          b: '周○描述较后期没有固定僵直站立，手脚无异常，之后能稳定走路、跑步。',
          reading: '两位证人谈的是不同月龄与不同阶段；可能呈现情况改变，也可能是观察项目不同。这组对照不能直接被写成谁推翻谁。',
          links: [['#day3-chapter-02', '周○接手'], ['#day3-chapter-04', '后期发展'], ['#day3-chapter-05', '婴儿期观察']]
        }
      ],
      sourceTitle: '原档文字异常也已标出',
      source: '萧○香段落另出现一段与周○庭末意见相同的文字，可能是原页编排或复制所致。本页保留提醒，但不把该段改认作萧○香的证词或法院结论。',
      previous: '返回第二日 Mira 证词核对专区'
    }
  };
  const c = isHans ? copies.hans : copies.hant;

  const style = document.createElement('style');
  style.id = 'day3-former-nanny-crosscheck-style';
  style.textContent = `
    #former-nanny-crosscheck{scroll-margin-top:110px;position:relative;overflow:hidden;background:linear-gradient(145deg,rgba(248,250,248,.98),rgba(244,238,235,.96));border-top:1px solid rgba(70,91,87,.13);border-bottom:1px solid rgba(101,70,70,.13)}
    #former-nanny-crosscheck::before,#former-nanny-crosscheck::after{content:"";position:absolute;border-radius:999px;pointer-events:none}
    #former-nanny-crosscheck::before{width:270px;height:270px;right:-105px;top:52px;background:rgba(116,145,137,.11)}
    #former-nanny-crosscheck::after{width:205px;height:205px;left:-84px;bottom:72px;background:rgba(182,130,126,.1)}
    .day3-nanny-legend{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:22px 0 26px;position:relative;z-index:1}
    .day3-nanny-legend span{display:flex;flex-direction:column;gap:5px;padding:16px 17px;border:1px solid rgba(72,96,90,.16);border-radius:18px;background:rgba(255,255,255,.69);box-shadow:0 12px 28px rgba(60,78,73,.052)}
    .day3-nanny-legend b{font-size:.96rem;color:#45645c;letter-spacing:.04em}
    .day3-nanny-legend small{font-size:.86rem;line-height:1.65;color:#5c6561}
    .day3-nanny-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;position:relative;z-index:1}
    .day3-nanny-card{display:flex;flex-direction:column;min-height:100%;padding:clamp(20px,3vw,28px);border:1px solid rgba(72,96,90,.17);border-radius:24px;background:rgba(255,255,255,.84);box-shadow:0 17px 40px rgba(59,73,69,.07)}
    .day3-nanny-card>span{align-self:flex-start;margin-bottom:9px;padding:5px 10px;border-radius:999px;background:#e4eee9;color:#3e6258;font-size:.75rem;font-weight:800;letter-spacing:.065em}
    .day3-nanny-card:first-child>span{background:#f1e1df;color:#7a4148}
    .day3-nanny-card h3{margin:0 0 15px;color:#303c39;font-size:clamp(1.12rem,2vw,1.42rem);line-height:1.36}
    .day3-nanny-evidence{margin:0 0 9px;padding:12px 14px;border-left:3px solid rgba(76,112,101,.34);border-radius:0 12px 12px 0;background:rgba(241,246,243,.79);font-size:.94rem;line-height:1.72;color:#46504d}
    .day3-nanny-evidence b{color:#41645a}
    .day3-nanny-reading{margin:7px 0 16px;padding-top:13px;border-top:1px dashed rgba(72,96,90,.2);font-size:.93rem;line-height:1.72;color:#46504d}
    .day3-nanny-reading b{color:#3f6158}
    .day3-nanny-links{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}
    .day3-nanny-links a{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border:1px solid rgba(63,96,87,.2);border-radius:999px;color:#3f6459;text-decoration:none;font-size:.83rem;font-weight:750;background:rgba(249,253,251,.92)}
    .day3-nanny-links a::after{content:"↗";font-size:.8em}
    .day3-nanny-links a:hover,.day3-nanny-links a:focus-visible{background:#466a60;color:#fff;outline:none}
    .day3-nanny-source-note{position:relative;z-index:1;margin-top:20px;padding:20px 22px;border-radius:21px;background:rgba(244,232,229,.73);border:1px solid rgba(128,77,78,.17)}
    .day3-nanny-source-note strong{display:block;margin-bottom:5px;color:#75454b;font-size:1rem}
    .day3-nanny-source-note p{margin:0;color:#5d5051;line-height:1.75}
    .day3-nanny-source-note a{display:inline-flex;margin-top:12px;color:#3f6158;font-weight:800;text-underline-offset:4px}
    @media(max-width:760px){.day3-nanny-legend,.day3-nanny-grid{grid-template-columns:1fr}.day3-nanny-card{border-radius:20px}.day3-nanny-legend{gap:9px}}
  `;
  document.head.append(style);

  const cards = c.cards.map(card => `
    <article class="day3-nanny-card day3-reveal">
      <span>${card.tag}</span>
      <h3>${card.title}</h3>
      <p class="day3-nanny-evidence"><b>${c.recordA}</b>${card.a}</p>
      <p class="day3-nanny-evidence"><b>${c.recordB}</b>${card.b}</p>
      <p class="day3-nanny-reading"><b>${c.reading}</b>${card.reading}</p>
      <div class="day3-nanny-links">${card.links.map(([href, label]) => `<a href="${href}">${c.open}・${label}</a>`).join('')}</div>
    </article>`).join('');

  const section = document.createElement('section');
  section.className = 'day3-section day3-former-nanny-crosscheck';
  section.id = 'former-nanny-crosscheck';
  section.setAttribute('aria-labelledby', 'formerNannyCrosscheckTitle');
  section.innerHTML = `
    <div class="day3-section-head day3-reveal">
      <small>${c.eyebrow}</small>
      <h2 id="formerNannyCrosscheckTitle">${c.title}</h2>
      <p>${c.intro}</p>
    </div>
    <div class="day3-nanny-legend day3-reveal" aria-label="${c.title}">
      ${c.legend.map(([title, text]) => `<span><b>${title}</b><small>${text}</small></span>`).join('')}
    </div>
    <div class="day3-nanny-grid">${cards}</div>
    <aside class="day3-nanny-source-note day3-reveal" role="note">
      <strong>${c.sourceTitle}</strong>
      <p>${c.source}</p>
      <a href="../kaikai-day2-20250423/#mira-crosscheck">← ${c.previous}</a>
    </aside>`;

  const witness = document.querySelector('#witness');
  const lens = document.querySelector('#lens');
  if (witness?.parentNode) witness.insertAdjacentElement('afterend', section);
  else lens?.parentNode?.insertBefore(section, lens);

  const topNav = document.querySelector('.day3-topbar nav');
  if (topNav && !topNav.querySelector('a[href="#former-nanny-crosscheck"]')) {
    const link = document.createElement('a');
    link.href = '#former-nanny-crosscheck';
    link.textContent = c.nav;
    const examinationLink = topNav.querySelector('a[href="#examination"]');
    topNav.insertBefore(link, examinationLink || null);
  }

  const toc = document.querySelector('.day3-toc');
  if (toc && !toc.querySelector('a[href="#former-nanny-crosscheck"]')) {
    const link = document.createElement('a');
    link.href = '#former-nanny-crosscheck';
    link.textContent = c.toc;
    const lensLink = toc.querySelector('a[href="#lens"]');
    toc.insertBefore(link, lensLink || null);
  }

  loadCore();
})();
