(() => {
  'use strict';

  const currentScript = document.currentScript;
  const loadCore = () => {
    if (window.__day2ReadingCoreRequested) return;
    window.__day2ReadingCoreRequested = true;
    const core = document.createElement('script');
    core.src = new URL('./day2-reading-core-20260821.js?v=20260821-testimony-crosscheck-1', currentScript?.src || location.href).href;
    core.async = false;
    core.onerror = () => console.error('Day 2 reading core failed to load.');
    document.head.append(core);
  };

  if (window.__day2TestimonyCrosscheckInjected) {
    loadCore();
    return;
  }
  window.__day2TestimonyCrosscheckInjected = true;

  const isHans = new URLSearchParams(location.search).get('lang') === 'zh-Hans'
    || document.documentElement.lang === 'zh-Hans'
    || localStorage.getItem('siteLang') === 'zh-Hans';

  const copies = {
    hant: {
      nav: '證詞核對',
      toc: '05A 外傭證詞核對',
      eyebrow: '05A · TESTIMONY SOURCE CHECK',
      title: 'Mira 證詞｜前後說法與來源核對點',
      intro: '以下標示原始旁聽紀錄中可直接對照的前後差異、回答修正與觀察限制。「表面張力」不等於本頁認定證人虛偽陳述或構成偽證；可信性仍應由法院依庭訊錄音、正式筆錄、影像及其他證據綜合判斷。',
      legend: [
        ['明確差異', '同一證人在庭上或先前筆錄留下不同說法'],
        ['表面張力', '可能受到提問脈絡、用語範圍或記憶影響'],
        ['觀察限制', '把親眼看見、聽見、推論與估計分開閱讀']
      ],
      recordA: '記錄 A｜',
      recordB: '記錄 B｜',
      reading: '判讀｜',
      open: '回到完整問答',
      cards: [
        {
          tag: '01 · 用語張力',
          title: '「沒有看到傷」與「有快好的疤」',
          a: '住院前身上有傷嗎？證人答：「沒有看到傷，但有快好的疤。」',
          b: '疤的位置只記得「應該是手或腳，不太清楚」。',
          reading: '可能是在區分明顯新傷與接近癒合的痕跡，也顯示部位記憶有限；這句不能被簡化成「當時完全沒有傷」。',
          links: [['#day2-chapter-03', '反詰問']]
        },
        {
          tag: '02 · 筆錄差異',
          title: '是否親眼看見「愛的小手」打孩子',
          a: '庭上先答「不記得有親眼看過」。',
          b: '提示2024年1月6日警詢記載曾看見打側大腿後，證人表示較接近案發的警詢筆錄才正確。',
          reading: '這是庭上記憶與先前筆錄的明確差異；仍須核對原筆錄、錄音及當時訊問脈絡。',
          links: [['#day2-chapter-02', '主詰問']]
        },
        {
          tag: '03 · 範圍收束',
          title: '「不會講話」後改為「沒聽過」',
          a: '主詰問時稱孩子「不會講話」，只有微笑、以眼睛打招呼。',
          b: '國民法官追問是孩子不會說話，還是證人沒有聽過時，證人答「沒聽過」。',
          reading: '後一回答把對孩子能力的普遍判斷，收束為證人自己的觀察範圍；兩者不是完全相同的命題。',
          links: [['#day2-chapter-02', '主詰問'], ['#day2-chapter-06', '國民法官提問']]
        },
        {
          tag: '04 · 前後差異',
          title: '曾見玩小車，後又答未見玩耍',
          a: '受命法官段落記載：正式穿著的訪客到場時，證人第一次看見孩子穿衣、玩小車。',
          b: '審判長後問是否看過孩子玩耍或睡覺，證人答「沒有」。',
          reading: '兩段回答表面不一致；可能與「平日」和特定訪客情境不同，也可能涉及記憶或提問範圍，應回到完整問答核對。',
          links: [['#day2-chapter-08', '訪客段落'], ['#day2-chapter-09', '審判長提問']]
        },
        {
          tag: '05 · 更正／估計',
          title: '離開時間修正；「一小時」是猜測',
          a: '先稱被告約13:30離開，經追問孩子站立時段後，改為約14:30至15:00。',
          b: '稱孩子躺地約一小時，審判長追問判斷基礎時，明確回答「我用猜的」。',
          reading: '一項是當庭更正，一項是未計時估計；摘要不得把兩者寫成精確且始終未變動的時點或時長。',
          links: [['#day2-chapter-02', '時間更正'], ['#day2-chapter-09', '時長估計']]
        },
        {
          tag: '06 · 親見與推論',
          title: '鍋巴餵食、冷水澡與中文意思',
          a: '證人先稱鍋巴餵食不是猜測，後也明說沒有親眼看見實際餵食；水溫則由熱水器是否運轉的聲音判斷。',
          b: '證人表示只懂非常基本的中文單字；部分意思是依表情、語氣及孩子反應推想。',
          reading: '這些內容並非全然無據，但證言基礎分別是環境線索、聽覺與推論，不應與直接目擊放在同一證明層級。',
          links: [['#day2-chapter-03', '親見與推論'], ['#day2-chapter-04', '語言與視線']]
        }
      ],
      footerTitle: '跨日閱讀提醒',
      footer: 'Mira自2023年9月27日起照顧被告父親；她所描述的是2023年秋冬在一樓的零散日常。兩位前保母談的是更早的嬰兒期與寄養照顧期，不能把不同時間、不同地點與不同觀察條件的描述直接互相抵銷。',
      next: '前往第三日兩位前保母核對專區'
    },
    hans: {
      nav: '证词核对',
      toc: '05A 外佣证词核对',
      eyebrow: '05A · TESTIMONY SOURCE CHECK',
      title: 'Mira 证词｜前后说法与来源核对点',
      intro: '以下标示原始旁听记录中可直接对照的前后差异、回答修正与观察限制。“表面张力”不等于本页认定证人虚假陈述或构成伪证；可信性仍应由法院依庭讯录音、正式笔录、影像及其他证据综合判断。',
      legend: [
        ['明确差异', '同一证人在庭上或先前笔录留下不同说法'],
        ['表面张力', '可能受到提问脉络、用语范围或记忆影响'],
        ['观察限制', '把亲眼看见、听见、推论与估计分开阅读']
      ],
      recordA: '记录 A｜',
      recordB: '记录 B｜',
      reading: '判读｜',
      open: '回到完整问答',
      cards: [
        {
          tag: '01 · 用语张力',
          title: '“没有看到伤”与“有快好的疤”',
          a: '住院前身上有伤吗？证人答：“没有看到伤，但有快好的疤。”',
          b: '疤的位置只记得“应该是手或脚，不太清楚”。',
          reading: '可能是在区分明显新伤与接近愈合的痕迹，也显示部位记忆有限；这句话不能被简化成“当时完全没有伤”。',
          links: [['#day2-chapter-03', '反诘问']]
        },
        {
          tag: '02 · 笔录差异',
          title: '是否亲眼看见“爱的小手”打孩子',
          a: '庭上先答“不记得有亲眼看过”。',
          b: '提示2024年1月6日警询记载曾看见打侧大腿后，证人表示较接近案发的警询笔录才正确。',
          reading: '这是庭上记忆与先前笔录的明确差异；仍须核对原笔录、录音及当时讯问脉络。',
          links: [['#day2-chapter-02', '主诘问']]
        },
        {
          tag: '03 · 范围收束',
          title: '“不会讲话”后改为“没听过”',
          a: '主诘问时称孩子“不会讲话”，只有微笑、以眼睛打招呼。',
          b: '国民法官追问是孩子不会说话，还是证人没有听过时，证人答“没听过”。',
          reading: '后一回答把对孩子能力的普遍判断，收束为证人自己的观察范围；两者不是完全相同的命题。',
          links: [['#day2-chapter-02', '主诘问'], ['#day2-chapter-06', '国民法官提问']]
        },
        {
          tag: '04 · 前后差异',
          title: '曾见玩小车，后又答未见玩耍',
          a: '受命法官段落记载：正式穿着的访客到场时，证人第一次看见孩子穿衣、玩小车。',
          b: '审判长后问是否看过孩子玩耍或睡觉，证人答“没有”。',
          reading: '两段回答表面不一致；可能与“平日”和特定访客情境不同，也可能涉及记忆或提问范围，应回到完整问答核对。',
          links: [['#day2-chapter-08', '访客段落'], ['#day2-chapter-09', '审判长提问']]
        },
        {
          tag: '05 · 更正／估计',
          title: '离开时间修正；“一小时”是猜测',
          a: '先称被告约13:30离开，经追问孩子站立时段后，改为约14:30至15:00。',
          b: '称孩子躺地约一小时，审判长追问判断基础时，明确回答“我用猜的”。',
          reading: '一项是当庭更正，一项是未计时估计；摘要不得把两者写成精确且始终未变动的时点或时长。',
          links: [['#day2-chapter-02', '时间更正'], ['#day2-chapter-09', '时长估计']]
        },
        {
          tag: '06 · 亲见与推论',
          title: '锅巴喂食、冷水澡与中文意思',
          a: '证人先称锅巴喂食不是猜测，后也明说没有亲眼看见实际喂食；水温则由热水器是否运转的声音判断。',
          b: '证人表示只懂非常基本的中文单字；部分意思是依表情、语气及孩子反应推想。',
          reading: '这些内容并非全然无据，但证言基础分别是环境线索、听觉与推论，不应与直接目击放在同一证明层级。',
          links: [['#day2-chapter-03', '亲见与推论'], ['#day2-chapter-04', '语言与视线']]
        }
      ],
      footerTitle: '跨日阅读提醒',
      footer: 'Mira自2023年9月27日起照顾被告父亲；她所描述的是2023年秋冬在一楼的零散日常。两位前保姆谈的是更早的婴儿期与寄养照顾期，不能把不同时间、不同地点与不同观察条件的描述直接互相抵销。',
      next: '前往第三日两位前保姆核对专区'
    }
  };
  const c = isHans ? copies.hans : copies.hant;

  const style = document.createElement('style');
  style.id = 'day2-testimony-crosscheck-style';
  style.textContent = `
    #mira-crosscheck{scroll-margin-top:110px;position:relative;overflow:hidden;background:linear-gradient(145deg,rgba(255,250,246,.98),rgba(246,239,235,.95));border-top:1px solid rgba(114,67,66,.14);border-bottom:1px solid rgba(114,67,66,.14)}
    #mira-crosscheck::before,#mira-crosscheck::after{content:"";position:absolute;border-radius:999px;pointer-events:none;filter:blur(1px)}
    #mira-crosscheck::before{width:260px;height:260px;right:-92px;top:62px;background:rgba(190,140,135,.12)}
    #mira-crosscheck::after{width:190px;height:190px;left:-78px;bottom:84px;background:rgba(137,157,151,.11)}
    .day2-crosscheck-legend{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:22px 0 26px;position:relative;z-index:1}
    .day2-crosscheck-legend span{display:flex;flex-direction:column;gap:5px;padding:16px 17px;border:1px solid rgba(112,66,67,.16);border-radius:18px;background:rgba(255,255,255,.67);box-shadow:0 12px 28px rgba(91,61,57,.055)}
    .day2-crosscheck-legend b{font-size:.96rem;color:#713d48;letter-spacing:.04em}
    .day2-crosscheck-legend small{font-size:.86rem;line-height:1.65;color:#665d5c}
    .day2-crosscheck-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;position:relative;z-index:1}
    .day2-crosscheck-card{display:flex;flex-direction:column;min-height:100%;padding:clamp(20px,3vw,28px);border:1px solid rgba(112,66,67,.17);border-radius:24px;background:rgba(255,255,255,.82);box-shadow:0 17px 40px rgba(83,54,51,.075)}
    .day2-crosscheck-card>span{align-self:flex-start;margin-bottom:9px;padding:5px 10px;border-radius:999px;background:#f2e4e2;color:#743b47;font-size:.75rem;font-weight:800;letter-spacing:.07em}
    .day2-crosscheck-card h3{margin:0 0 15px;color:#3f3031;font-size:clamp(1.12rem,2vw,1.42rem);line-height:1.36}
    .day2-crosscheck-evidence{margin:0 0 9px;padding:12px 14px;border-left:3px solid rgba(125,72,75,.35);border-radius:0 12px 12px 0;background:rgba(248,242,239,.78);font-size:.94rem;line-height:1.72;color:#514849}
    .day2-crosscheck-evidence b{color:#75434a}
    .day2-crosscheck-reading{margin:7px 0 16px;padding-top:13px;border-top:1px dashed rgba(112,66,67,.2);font-size:.93rem;line-height:1.72;color:#514849}
    .day2-crosscheck-reading b{color:#6b3943}
    .day2-crosscheck-links{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}
    .day2-crosscheck-links a{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border:1px solid rgba(111,61,69,.2);border-radius:999px;color:#6e3945;text-decoration:none;font-size:.83rem;font-weight:750;background:rgba(255,250,248,.9)}
    .day2-crosscheck-links a::after{content:"↗";font-size:.8em}
    .day2-crosscheck-links a:hover,.day2-crosscheck-links a:focus-visible{background:#6e3945;color:#fff;outline:none}
    .day2-crosscheck-footer{position:relative;z-index:1;margin-top:20px;padding:20px 22px;border-radius:21px;background:rgba(226,235,230,.7);border:1px solid rgba(94,119,108,.18)}
    .day2-crosscheck-footer strong{display:block;margin-bottom:5px;color:#405c50;font-size:1rem}
    .day2-crosscheck-footer p{margin:0;color:#4f5d57;line-height:1.75}
    .day2-crosscheck-footer a{display:inline-flex;margin-top:12px;color:#5d3741;font-weight:800;text-underline-offset:4px}
    @media(max-width:760px){.day2-crosscheck-legend,.day2-crosscheck-grid{grid-template-columns:1fr}.day2-crosscheck-card{border-radius:20px}.day2-crosscheck-legend{gap:9px}}
  `;
  document.head.append(style);

  const cards = c.cards.map(card => `
    <article class="day2-crosscheck-card day2-reveal">
      <span>${card.tag}</span>
      <h3>${card.title}</h3>
      <p class="day2-crosscheck-evidence"><b>${c.recordA}</b>${card.a}</p>
      <p class="day2-crosscheck-evidence"><b>${c.recordB}</b>${card.b}</p>
      <p class="day2-crosscheck-reading"><b>${c.reading}</b>${card.reading}</p>
      <div class="day2-crosscheck-links">${card.links.map(([href, label]) => `<a href="${href}">${c.open}・${label}</a>`).join('')}</div>
    </article>`).join('');

  const section = document.createElement('section');
  section.className = 'day2-section day2-crosscheck';
  section.id = 'mira-crosscheck';
  section.setAttribute('aria-labelledby', 'miraCrosscheckTitle');
  section.innerHTML = `
    <div class="day2-section-head day2-reveal">
      <small>${c.eyebrow}</small>
      <h2 id="miraCrosscheckTitle">${c.title}</h2>
      <p>${c.intro}</p>
    </div>
    <div class="day2-crosscheck-legend day2-reveal" aria-label="${c.title}">
      ${c.legend.map(([title, text]) => `<span><b>${title}</b><small>${text}</small></span>`).join('')}
    </div>
    <div class="day2-crosscheck-grid">${cards}</div>
    <aside class="day2-crosscheck-footer day2-reveal" role="note">
      <strong>${c.footerTitle}</strong>
      <p>${c.footer}</p>
      <a href="../kaikai-day3-20250425/#former-nanny-crosscheck">${c.next} →</a>
    </aside>`;

  const examination = document.querySelector('#examination');
  const jurors = document.querySelector('#jurors');
  if (examination?.parentNode) examination.insertAdjacentElement('afterend', section);
  else jurors?.parentNode?.insertBefore(section, jurors);

  const topNav = document.querySelector('.day2-topbar nav');
  if (topNav && !topNav.querySelector('a[href="#mira-crosscheck"]')) {
    const link = document.createElement('a');
    link.href = '#mira-crosscheck';
    link.textContent = c.nav;
    const fullRecordLink = topNav.querySelector('a[href="#full-record"]');
    topNav.insertBefore(link, fullRecordLink || null);
  }

  const toc = document.querySelector('.day2-toc');
  if (toc && !toc.querySelector('a[href="#mira-crosscheck"]')) {
    const link = document.createElement('a');
    link.href = '#mira-crosscheck';
    link.textContent = c.toc;
    const jurorLink = toc.querySelector('a[href="#jurors"]');
    toc.insertBefore(link, jurorLink || null);
  }

  loadCore();
})();
