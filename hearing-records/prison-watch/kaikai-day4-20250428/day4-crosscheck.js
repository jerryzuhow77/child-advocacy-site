(() => {
  'use strict';

  window.day4CrosscheckReady = (async () => {
    if (!document.body.classList.contains('day4-page') || document.getElementById('contradictions')) return;

    const current = document.currentScript;
    const base = current ? new URL('./', current.src) : new URL('./', location.href);
    const sourceUrl = new URL('../../../assets/day4-crosscheck-source.txt?v=20260821-1', base);
    const raw = await fetch(sourceUrl, { cache: 'no-cache' }).then(response => {
      if (!response.ok) throw new Error(`Cross-check source HTTP ${response.status}`);
      return response.text();
    });

    const extract = name => {
      const marker = `${name} = r'''`;
      const start = raw.indexOf(marker);
      if (start < 0) throw new Error(`Missing ${name} block`);
      const contentStart = start + marker.length;
      const end = raw.indexOf("'''", contentStart);
      if (end < 0) throw new Error(`Unclosed ${name} block`);
      return raw.slice(contentStart, end);
    };

    const locale = document.documentElement.lang === 'ja' ? 'ja' : document.documentElement.lang === 'en' ? 'en' : 'zh';
    const labels = {
      zh: { nav: '證詞矛盾', toc: '05A 證詞對照' },
      en: { nav: 'Testimony conflicts', toc: '05A Cross-check' },
      ja: { nav: '供述の食い違い', toc: '05A 供述照合' }
    }[locale];

    const restraintCaution = {
      zh: {
        meta: '高度待核 · 須先確認是否為同一綑綁事件',
        text: '先確認「傳照片才知道」是否指另一場次的綑綁；只有在問題同指11月2日事件時，才構成明顯前後不一。'
      },
      en: {
        meta: 'High-priority check · Confirm that both answers concern the same restraint incident',
        text: 'First determine whether “learned from photographs” referred to a different restraint episode. A clear internal conflict arises only if both answers concern 2 November.'
      },
      ja: {
        meta: '重点確認 · 同一の拘束事件を指すか確認が必要',
        text: '「写真を送って初めて知った」が別の拘束場面を指すかを先に確認する必要があります。双方が11月2日の出来事を指す場合に限り、明確な前後不一致となります。'
      }
    }[locale];

    const locationCopy = {
      zh: {
        routeAria: '劉彩萱證詞中的三處日常動線',
        route: [
          { code: '乙地', exact: '另一棟夜間睡覺處｜二審旁聽：左側相鄰棟3樓，疑為劉彩萱居所', title: '夜間／二審補充', text: '第四日原始紀錄稱劉彩萱晚間與A童在乙地睡覺；二審旁聽時另聽到乙地疑為左側相鄰棟3樓、可能是劉彩萱居所。這與第四日原始紀錄所述「劉彩萱晚間與A童在乙地睡覺」相互呼應；完整門牌與居所性質仍待正式筆錄、判決或圖面確認。' },
          { code: '丙地', exact: '4號3樓・劉若琳住處', title: '上午與往返', text: '也是劉若琳的居家托育空間。A童前往頻率是兩人證詞爭點；澡盆事件與部分照片涉及此處。' },
          { code: '甲地', exact: '4號1樓・白天主要托育處', title: '午餐與日間照顧', text: '劉彩萱稱白天主要在此托育；準備餐點、用餐、冷靜區／罰站與地下室入口等情節涉及此處。' }
        ],
        routeNote: '甲、丙依2025年4月28日原始紀錄；乙加入二審旁聽補充。乙地疑為劉彩萱居所，完整門牌與居所性質仍待正式資料確認。',
        kicker: 'LOCATION KEY',
        title: '甲、乙、丙地分別是哪裡？',
        intro: '「甲地、乙地、丙地」是庭審使用的地點代稱。本頁並列第四日原始紀錄與二審旁聽補充；二審補充提供較具體的相鄰棟位置，未經正式筆錄確認的部分會明確標示。',
        cards: [
          { cls: 'is-a', code: '甲地', exact: '4號1樓', text: '劉彩萱稱白天主要在此托育。準備餐點、用餐、冷靜區／罰站、地下室入口與家庭共餐等情節涉及此處。' },
          { cls: 'is-b', code: '乙地', exact: '二審旁聽補充｜左側相鄰棟3樓・疑為劉彩萱居所', text: '第四日原始紀錄把乙地描述為另一棟的夜間睡覺處；二審旁聽時另聽到乙地應位於左側相鄰棟3樓，可能是劉彩萱居所。此補充與第四日紀錄所述乙地為夜間睡覺處相互呼應；完整門牌與居所性質仍待正式資料確認。' },
          { cls: 'is-c', code: '丙地', exact: '4號3樓・劉若琳住處', text: '也是劉若琳的居家托育空間。A童前往此處的頻率是本日證詞爭點；澡盆事件與部分照片涉及此處。' }
        ],
        source: '閱讀界線｜甲、丙依第四日原始紀錄；乙含二審旁聽補充。乙地疑為劉彩萱居所；完整門牌與居所性質仍待正式筆錄、判決或圖面確認。',
        reminderAria: '地點代稱快速對照',
        reminderTitle: '地點代稱',
        reminder: ['甲：4號1樓', '乙：左側相鄰棟3樓・疑為劉彩萱居所（二審旁聽）', '丙：4號3樓・劉若琳住處（第四日原始紀錄）'],
        reminderLink: '查看完整說明 ↑'
      },
      en: {
        routeAria: 'Three location labels in Liu Tsai-hsuan’s testimony',
        route: [
          { code: 'Site B', exact: 'Separate overnight site | appeal-hearing note: left adjacent building, 3F; possibly Liu Tsai-hsuan’s residence', title: 'Night / appeal-hearing note', text: 'The Day 4 source record describes Site B as the separate building used for overnight sleeping. At the appeal hearing, it was additionally heard that Site B may be on the third floor of the adjacent building to the left and may be Liu Tsai-hsuan’s residence. This is consistent with the Day 4 record describing Site B as the overnight sleeping location; the complete address and residential status still require confirmation in formal minutes, judgment materials or a site plan.' },
          { code: 'Site C', exact: 'No. 4, 3F · Liu Ruo-lin’s residence', title: 'Morning / movement', text: 'It was also Liu Ruo-lin’s home childcare setting. How often the child went there is disputed in the testimony; the basin incident and some photographs involved this site.' },
          { code: 'Site A', exact: 'No. 4, 1F · main daytime care location', title: 'Lunch / daytime', text: 'Liu Tsai-hsuan described this as the principal daytime childcare site. Meals, the calm-down/standing area and the basement entrance involved this location.' }
        ],
        routeNote: 'Sites A and C follow the 28 April 2025 source record; Site B also includes an appeal-hearing observation. Site B is noted as possibly Liu Tsai-hsuan’s residence, while Site C follows the Day 4 record as Liu Ruo-lin’s residence; Site B’s complete address and residential status remain unconfirmed.',
        kicker: 'LOCATION KEY',
        title: 'What do Sites A, B and C mean?',
        intro: 'These are location labels used at the hearings. This page presents both the Day 4 source record and the more specific appeal-hearing observation, with unconfirmed details clearly marked.',
        cards: [
          { cls: 'is-a', code: 'Site A', exact: 'No. 4, 1F', text: 'Liu Tsai-hsuan described it as the main daytime childcare site. Meals, the calm-down/standing area, basement entrance and family dining involved this location.' },
          { cls: 'is-b', code: 'Site B', exact: 'Appeal-hearing note | left adjacent building, 3F; possibly Liu Tsai-hsuan’s residence', text: 'The Day 4 source record describes Site B as a separate overnight sleeping location. An appeal-hearing observation places it on the third floor of the adjacent building to the left and possibly at Liu Tsai-hsuan’s residence. This complements the Day 4 description of Site B as the overnight sleeping location; its complete address and residential status remain subject to formal confirmation.' },
          { cls: 'is-c', code: 'Site C', exact: 'No. 4, 3F · Liu Ruo-lin’s residence', text: 'It was also her home childcare setting. The frequency of the child’s visits is a testimony issue; the basin incident and some photographs involved this site.' }
        ],
        source: 'Reading limit | Sites A and C follow the Day 4 source record; Site B includes an appeal-hearing observation. Site B is noted as possibly Liu Tsai-hsuan’s residence; its complete address and residential status remain subject to confirmation in formal minutes, judgment materials or a site plan.',
        reminderAria: 'Location-label quick reference',
        reminderTitle: 'Location labels',
        reminder: ['A: No. 4, 1F', 'B: left adjacent building, 3F · possibly Liu Tsai-hsuan’s residence (appeal-hearing note)', 'C: No. 4, 3F · Liu Ruo-lin’s residence (Day 4 source record)'],
        reminderLink: 'Full explanation ↑'
      },
      ja: {
        routeAria: '劉彩萱の供述における三つの場所',
        route: [
          { code: '乙地', exact: '別棟の夜間就寝場所｜控訴審傍聴補足：左隣の棟3階、劉彩萱の住居の可能性', title: '夜間／控訴審補足', text: '第4日の原記録では乙地を別棟の夜間就寝場所としている。控訴審の傍聴では、乙地が左隣の棟の3階で、劉彩萱の住居である可能性も聞かれた。これは第4日記録が乙地を夜間の就寝場所としていることとも整合するが、完全な住所と住居としての位置付けは正式な調書・判決資料・配置図での確認が必要である。' },
          { code: '丙地', exact: '4号3階・劉若琳の住居', title: '午前・移動', text: '劉若琳の居宅保育スペースでもある。A児が訪れた頻度は二人の供述の争点で、洗面器の出来事と一部の写真がこの場所に関係する。' },
          { code: '甲地', exact: '4号1階・日中の主な保育場所', title: '昼食・日中', text: '劉彩萱は日中の主な保育場所と供述した。食事の準備、食事、クールダウン／立たせ、地下室入口などがこの場所に関係する。' }
        ],
        routeNote: '甲地・丙地は2025年4月28日の原記録に基づき、乙地には控訴審傍聴での補足も併記する。乙地は劉彩萱の住居の可能性、丙地は第4日原記録に基づき劉若琳の住居として表示し、乙地の完全な住所と住居としての位置付けは未確認とする。',
        kicker: 'LOCATION KEY',
        title: '甲・乙・丙地とは？',
        intro: '甲地・乙地・丙地は法廷で使われた場所の呼称である。第4日の原記録と、より具体的な控訴審傍聴での補足を併記し、未確認部分を明示する。',
        cards: [
          { cls: 'is-a', code: '甲地', exact: '4号1階', text: '劉彩萱は日中の主な保育場所と供述した。食事の準備、食事、クールダウン／立たせ、地下室入口、家族との食事などが関係する。' },
          { cls: 'is-b', code: '乙地', exact: '控訴審傍聴補足｜左隣の棟3階・劉彩萱の住居の可能性', text: '第4日の原記録では乙地を別棟の夜間就寝場所としている。控訴審傍聴では左隣の棟3階で、劉彩萱の住居である可能性が聞かれた。一方、第4日記録は丙地（4号3階）も劉若琳の住居としており、正式資料による確認が必要である。' },
          { cls: 'is-c', code: '丙地', exact: '4号3階・劉若琳の住居', text: '劉若琳の居宅保育スペースでもある。A児が訪れた頻度は本日の供述の争点で、洗面器の出来事と一部の写真が関係する。' }
        ],
        source: '読み方の限界｜甲地・丙地は第4日の原記録、乙地は控訴審傍聴補足を含む。乙地・丙地と劉若琳の住居との対応は、正式調書・判決資料・配置図での確認を要する。',
        reminderAria: '場所呼称の早見表',
        reminderTitle: '場所呼称',
        reminder: ['甲：4号1階', '乙：左隣の棟3階・劉彩萱の住居の可能性（控訴審傍聴）', '丙：4号3階・劉若琳の住居（第4日原記録）'],
        reminderLink: '詳しい説明 ↑'
      }
    }[locale];

    const style = document.createElement('style');
    style.id = 'day4-contrast-style';
    style.textContent = `${extract('css')}

/* Softer verification-note strip. */
body.day4-page .day4-contrast-card > footer {
  background: linear-gradient(90deg, rgba(255,255,255,.98), rgba(250,248,245,.82)) !important;
  border-color: rgba(16,43,58,.065) !important;
  box-shadow: none !important;
}
body.day4-page .day4-contrast-card > footer > b { color: #7a6b64 !important; }

/* Day 4 location-label key. */
.day4-location-exact{display:block;margin:.35rem 0 .65rem;color:#8a634d;font-size:.75rem;font-weight:850;line-height:1.5}
.day4-location-key{max-width:1120px;margin:22px auto 0;padding:clamp(20px,3vw,30px);border:1px solid rgba(16,43,58,.13);border-radius:26px;background:linear-gradient(145deg,rgba(255,255,255,.96),rgba(244,239,231,.9));box-shadow:0 16px 42px rgba(16,43,58,.08)}
.day4-location-key header small{display:block;color:#9f4e3f;font-size:.72rem;font-weight:900;letter-spacing:.12em}
.day4-location-key h3{margin:.35rem 0 .55rem;color:#102b3a;font-size:clamp(1.45rem,3vw,2rem);line-height:1.3}
.day4-location-key header p{margin:0;color:#5b717c;line-height:1.75}
.day4-location-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px;margin-top:20px}
.day4-location-grid article{padding:18px;border:1px solid rgba(16,43,58,.1);border-top:4px solid #9f4e3f;border-radius:18px;background:#fff;box-shadow:0 8px 24px rgba(16,43,58,.055)}
.day4-location-grid article.is-b{border-top-color:#3d7185}.day4-location-grid article.is-c{border-top-color:#b98b45}
.day4-location-grid span{display:inline-flex;padding:.25rem .55rem;border-radius:999px;background:#edf2f3;color:#24495a;font-size:.72rem;font-weight:900}
.day4-location-grid strong{display:block;margin:.7rem 0 .45rem;color:#102b3a;font-size:1.05rem;line-height:1.4}
.day4-location-grid p{margin:0;color:#526b76;line-height:1.7}
.day4-location-source{margin:16px 0 0;color:#6b7d85;font-size:.76rem;line-height:1.65}
.day4-location-reminder{display:flex;flex-wrap:wrap;align-items:center;gap:8px;max-width:1180px;margin:0 auto 22px;padding:14px 16px;border:1px solid rgba(16,43,58,.1);border-radius:18px;background:rgba(248,245,239,.94);color:#526b76;box-shadow:0 8px 24px rgba(16,43,58,.05)}
.day4-location-reminder>b{color:#102b3a}.day4-location-reminder span{padding:.35rem .58rem;border-radius:999px;background:#fff;font-size:.78rem;font-weight:800}.day4-location-reminder a{margin-left:auto;color:#8f4438;font-size:.78rem;font-weight:900;text-decoration:none}
@media(max-width:760px){.day4-location-grid{grid-template-columns:1fr}.day4-location-reminder a{width:100%;margin-left:0}.day4-location-exact{font-size:.72rem}}
`;
    document.head.append(style);

    const template = document.createElement('template');
    template.innerHTML = extract(locale).trim();
    const section = template.content.firstElementChild;
    const jurors = document.getElementById('jurors');
    if (!section || !jurors) throw new Error('Cross-check insertion point not found');

    const restraintCard = section.querySelectorAll('.day4-contrast-card')[4];
    if (restraintCard) {
      const meta = restraintCard.querySelector('header small');
      const note = restraintCard.querySelector('footer p');
      if (meta) meta.textContent = restraintCaution.meta;
      if (note) note.textContent = restraintCaution.text;
    }

    jurors.before(section);

    const route = document.querySelector('.day4-route');
    if (route) {
      route.classList.add('day3-reveal');
      route.setAttribute('aria-label', locationCopy.routeAria);
      route.innerHTML = locationCopy.route.map((item, index) => `${index ? '<i aria-hidden="true">→</i>' : ''}<article><span>${item.code}</span><small class="day4-location-exact">${item.exact}</small><strong>${item.title}</strong><p>${item.text}</p></article>`).join('') + `<small>${locationCopy.routeNote}</small>`;

      if (!document.getElementById('location-key')) {
        const key = document.createElement('aside');
        key.className = 'day4-location-key day3-reveal';
        key.id = 'location-key';
        key.setAttribute('aria-labelledby', 'day4LocationTitle');
        key.innerHTML = `<header><small>${locationCopy.kicker}</small><h3 id="day4LocationTitle">${locationCopy.title}</h3><p>${locationCopy.intro}</p></header><div class="day4-location-grid">${locationCopy.cards.map(card => `<article class="${card.cls}"><span>${card.code}</span><strong>${card.exact}</strong><p>${card.text}</p></article>`).join('')}</div><p class="day4-location-source">${locationCopy.source}</p>`;
        route.after(key);
      }
    }

    const fullRecord = document.getElementById('full-record');
    if (fullRecord && !document.querySelector('.day4-location-reminder')) {
      const reminder = document.createElement('aside');
      reminder.className = 'day4-location-reminder';
      reminder.setAttribute('aria-label', locationCopy.reminderAria);
      reminder.innerHTML = `<b>${locationCopy.reminderTitle}</b>${locationCopy.reminder.map(item => `<span>${item}</span>`).join('')}<a href="#location-key">${locationCopy.reminderLink}</a>`;
      fullRecord.before(reminder);
    }

    const topTarget = document.querySelector('.day3-topbar nav a[href="#jurors"]');
    if (topTarget && !document.querySelector('.day3-topbar nav a[href="#contradictions"]')) {
      const link = document.createElement('a');
      link.href = '#contradictions';
      link.textContent = labels.nav;
      topTarget.before(link);
    }

    const tocTarget = document.querySelector('.day3-toc a[href="#jurors"]');
    if (tocTarget && !document.querySelector('.day3-toc a[href="#contradictions"]')) {
      const link = document.createElement('a');
      link.href = '#contradictions';
      link.textContent = labels.toc;
      tocTarget.before(link);
    }

    const simplified = locale === 'zh' && (new URLSearchParams(location.search).get('lang') === 'zh-Hans' || localStorage.getItem('siteLang') === 'zh-Hans');
    if (simplified && typeof window.setLang === 'function') window.setLang('zh-Hans');
    if (location.hash === '#contradictions') requestAnimationFrame(() => section.scrollIntoView({ block: 'start' }));
    if (location.hash === '#location-key') requestAnimationFrame(() => document.getElementById('location-key')?.scrollIntoView({ block: 'start' }));
    window.ScrollTrigger?.refresh();
  })().catch(error => {
    console.error('Day 4 testimony cross-check failed', error);
  });
})();