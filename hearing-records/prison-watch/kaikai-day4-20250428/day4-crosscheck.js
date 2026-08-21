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
          { code: '乙地', exact: '另一棟的夜間睡覺處', title: '夜間睡眠', text: '劉彩萱稱晚間與A童在此睡覺；部分夜間照片與乙地罰站情節也涉及此處。這份紀錄未明載完整門牌與樓層。' },
          { code: '丙地', exact: '4號3樓・劉若琳住處', title: '上午與往返', text: '也是劉若琳的居家托育空間。A童前往頻率是兩人證詞爭點；澡盆事件與部分照片涉及此處。' },
          { code: '甲地', exact: '4號1樓・白天主要托育處', title: '午餐與日間照顧', text: '劉彩萱稱白天主要在此托育；準備餐點、用餐、冷靜區／罰站與地下室入口等情節涉及此處。' }
        ],
        routeNote: '依2025年4月28日庭審問答整理；用途與動線屬證人陳述，不等於法院認定每天均固定如此。',
        kicker: 'LOCATION KEY',
        title: '甲、乙、丙地分別是哪裡？',
        intro: '「甲地、乙地、丙地」是庭審紀錄使用的地點代稱，不是證據編號。本頁只寫入原始紀錄已公開的樓層與用途，不補寫紀錄未載明的完整地址。',
        cards: [
          { cls: 'is-a', code: '甲地', exact: '4號1樓', text: '劉彩萱稱白天主要在此托育。準備餐點、用餐、冷靜區／罰站、地下室入口與家庭共餐等情節涉及此處。' },
          { cls: 'is-b', code: '乙地', exact: '另一棟的夜間睡覺處', text: '劉彩萱稱晚間與A童在此睡覺；部分夜間照片與乙地罰站情節涉及此處。這份紀錄沒有明載完整門牌與樓層。' },
          { cls: 'is-c', code: '丙地', exact: '4號3樓・劉若琳住處', text: '也是劉若琳的居家托育空間。A童前往此處的頻率是本日證詞爭點；澡盆事件與部分照片涉及此處。' }
        ],
        source: '閱讀界線｜地點用途與往返動線均依證人陳述整理；除明載的「4號1樓」「4號3樓」外，不推定未公開的完整地址。',
        reminderAria: '地點代稱快速對照',
        reminderTitle: '地點代稱',
        reminder: ['甲：4號1樓', '乙：另一棟夜間睡覺處', '丙：4號3樓・劉若琳住處'],
        reminderLink: '查看完整說明 ↑'
      },
      en: {
        routeAria: 'Three location labels in Liu Tsai-hsuan’s testimony',
        route: [
          { code: 'Site B', exact: 'Separate building · overnight sleeping location', title: 'Night', text: 'Liu Tsai-hsuan said she and the child slept here at night. Some night photographs and standing episodes also involved this site. The source record does not state its full address or floor.' },
          { code: 'Site C', exact: 'No. 4, 3F · Liu Ruo-lin’s residence', title: 'Morning / movement', text: 'It was also Liu Ruo-lin’s home childcare setting. How often the child went there is disputed in the testimony; the basin incident and some photographs involved this site.' },
          { code: 'Site A', exact: 'No. 4, 1F · main daytime care location', title: 'Lunch / daytime', text: 'Liu Tsai-hsuan described this as the principal daytime childcare site. Meals, the calm-down/standing area and the basement entrance involved this location.' }
        ],
        routeNote: 'Compiled from the 28 April 2025 hearing questions and answers. Uses and movement are witness accounts, not findings that every day followed a fixed route.',
        kicker: 'LOCATION KEY',
        title: 'What do Sites A, B and C mean?',
        intro: 'They are location labels used in the hearing record, not exhibit numbers. This page shows only the floor and use disclosed in the source record and does not supply an unstated full address.',
        cards: [
          { cls: 'is-a', code: 'Site A', exact: 'No. 4, 1F', text: 'Liu Tsai-hsuan described it as the main daytime childcare site. Meals, the calm-down/standing area, basement entrance and family dining involved this location.' },
          { cls: 'is-b', code: 'Site B', exact: 'Separate overnight sleeping location', text: 'Liu Tsai-hsuan said she and the child slept here at night. Some night photographs and standing episodes involved this site. The record does not state its full address or floor.' },
          { cls: 'is-c', code: 'Site C', exact: 'No. 4, 3F · Liu Ruo-lin’s residence', text: 'It was also her home childcare setting. The frequency of the child’s visits is a testimony issue; the basin incident and some photographs involved this site.' }
        ],
        source: 'Reading limit | Uses and movement are summarized from witness testimony. Apart from “No. 4, 1F” and “No. 4, 3F,” no unpublished address is inferred.',
        reminderAria: 'Location-label quick reference',
        reminderTitle: 'Location labels',
        reminder: ['A: No. 4, 1F', 'B: separate overnight location', 'C: No. 4, 3F · Liu Ruo-lin’s residence'],
        reminderLink: 'Full explanation ↑'
      },
      ja: {
        routeAria: '劉彩萱の供述における三つの場所',
        route: [
          { code: '乙地', exact: '別棟の夜間就寝場所', title: '夜間', text: '劉彩萱は、夜にA児とここで就寝したと供述した。夜間の写真や乙地で立たせた場面の一部もこの場所に関係する。原記録には完全な住所と階数の記載がない。' },
          { code: '丙地', exact: '4号3階・劉若琳の住居', title: '午前・移動', text: '劉若琳の居宅保育スペースでもある。A児が訪れた頻度は二人の供述の争点で、洗面器の出来事と一部の写真がこの場所に関係する。' },
          { code: '甲地', exact: '4号1階・日中の主な保育場所', title: '昼食・日中', text: '劉彩萱は日中の主な保育場所と供述した。食事の準備、食事、クールダウン／立たせ、地下室入口などがこの場所に関係する。' }
        ],
        routeNote: '2025年4月28日の法廷での質問と回答から整理。用途と動線は証人の供述であり、毎日固定されていたとの裁判所認定ではない。',
        kicker: 'LOCATION KEY',
        title: '甲・乙・丙地とは？',
        intro: '甲地・乙地・丙地は法廷記録で使われた場所の呼称であり、証拠番号ではない。本頁は原記録に明示された階数と用途だけを掲載し、記載のない完全な住所を補わない。',
        cards: [
          { cls: 'is-a', code: '甲地', exact: '4号1階', text: '劉彩萱は日中の主な保育場所と供述した。食事の準備、食事、クールダウン／立たせ、地下室入口、家族との食事などが関係する。' },
          { cls: 'is-b', code: '乙地', exact: '別棟の夜間就寝場所', text: '劉彩萱は夜にA児とここで就寝したと供述した。夜間の写真や乙地での立たせも一部関係する。原記録には完全な住所と階数の記載がない。' },
          { cls: 'is-c', code: '丙地', exact: '4号3階・劉若琳の住居', text: '劉若琳の居宅保育スペースでもある。A児が訪れた頻度は本日の供述の争点で、洗面器の出来事と一部の写真が関係する。' }
        ],
        source: '読み方の限界｜用途と動線は証人供述から整理した。「4号1階」「4号3階」以外の非公開住所は推定しない。',
        reminderAria: '場所呼称の早見表',
        reminderTitle: '場所呼称',
        reminder: ['甲：4号1階', '乙：別棟の夜間就寝場所', '丙：4号3階・劉若琳の住居'],
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