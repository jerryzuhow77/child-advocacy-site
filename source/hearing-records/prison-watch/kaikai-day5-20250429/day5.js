(() => {
  'use strict';

  const body = document.body;
  const params = new URLSearchParams(location.search);
  const language = document.documentElement.lang || 'zh-Hant';
  const simplified = params.get('lang') === 'zh-Hans' || localStorage.getItem('siteLang') === 'zh-Hans';
  const posterVersion = '20260822-jpeg-blank-fix-1';

  const locale = simplified
    ? 'zh-Hans'
    : language.startsWith('ja')
      ? 'ja'
      : language.startsWith('en')
        ? 'en'
        : 'zh-Hant';

  const copy = {
    'zh-Hant': {
      filterLabel: '篩選醫師證詞對照',
      filters: [['all', '全部'], ['is-agree', '共同結論'], ['is-complement', '互補視角'], ['is-difference', '表述差異'], ['is-limit', '鑑定界線']],
      mobile: {'+': '兩者互補', '≈': '大致相符', '≠': '表述不同', '＝': '共同結論'},
      back: '↑ 返回醫師證詞對照',
      overview: '42處是可確認下限，不是完整總數',
      noteTitle: '不是只有42處｜42處是可確認的最低數量',
      noteBody: '原始紀錄明載，簡報只挑選部分照片，並未呈現所有傷勢照片；「全身至少42處確定傷勢」是依現有資料仍能辨識、確認的下限。部分傷勢癒合後，死亡時外觀已看不到；頭皮等部位另被描述為傷勢「非常多，族繁不及備載」。因此，不應把42處理解成孩子曾受傷害的完整總數。正式表述應是「至少42處確定傷勢」，而不是只有42處。',
      noteSource: '資料依原始紀錄 P.5–6｜查看完整原文',
      open: '展開',
      close: '收合'
    },
    'zh-Hans': {
      filterLabel: '筛选医师证词对照',
      filters: [['all', '全部'], ['is-agree', '共同结论'], ['is-complement', '互补视角'], ['is-difference', '表述差异'], ['is-limit', '鉴定界线']],
      mobile: {'+': '两者互补', '≈': '大致相符', '≠': '表述不同', '＝': '共同结论'},
      back: '↑ 返回医师证词对照',
      overview: '42处是可确认下限，不是完整总数',
      noteTitle: '不只有42处｜42处是可确认的最低数量',
      noteBody: '原始记录明确写道，简报只挑选部分照片，并未呈现所有伤势照片；“全身至少42处确定伤势”是依据现有资料仍能辨识、确认的下限。部分伤势愈合后，在死亡时的外观上已看不到；头皮等部位另被描述为伤势“非常多，族繁不及备载”。因此，不应把42处理解为孩子曾受伤害的完整总数。正式表述应是“至少42处确定伤势”，而不是只有42处。',
      noteSource: '资料依据原始记录 P.5–6｜查看完整原文',
      open: '展开',
      close: '收合'
    },
    en: {
      filterLabel: 'Filter the medical-testimony comparison',
      filters: [['all', 'All'], ['is-agree', 'Shared conclusions'], ['is-complement', 'Complementary views'], ['is-difference', 'Different formulations'], ['is-limit', 'Limits']],
      mobile: {'+': 'Complementary', '≈': 'Broadly aligned', '≠': 'Different wording', '＝': 'Shared conclusion'},
      back: '↑ Back to the doctor comparison',
      overview: 'A confirmed minimum, not the full total',
      noteTitle: 'Not only 42 injuries | 42 is the confirmed minimum',
      noteBody: 'The source record states that the presentation selected only some photographs and did not show every injury. “At least 42 confirmed injuries” is the minimum that could still be identified and confirmed from the available material. Some injuries had healed and were no longer visible at death; injuries to areas including the scalp were also described as too numerous to list fully. The number 42 must therefore not be read as the complete total of harm the child experienced.',
      noteSource: 'Based on source record pp. 5–6 | Read the complete passage',
      open: 'Expand',
      close: 'Collapse'
    },
    ja: {
      filterLabel: '医師証言の比較を絞り込む',
      filters: [['all', 'すべて'], ['is-agree', '共通結論'], ['is-complement', '補完的視点'], ['is-difference', '表現の相違'], ['is-limit', '鑑定の限界']],
      mobile: {'+': '補完関係', '≈': '概ね一致', '≠': '表現が異なる', '＝': '共通結論'},
      back: '↑ 医師証言の比較へ戻る',
      overview: '42か所は確認できた下限で、全数ではない',
      noteTitle: '42か所だけではない｜42か所は確認できた最低数',
      noteBody: '原記録には、説明用資料では一部の写真だけを選び、すべての外傷写真を示していないと明記されています。「全身に少なくとも42か所の確定外傷」は、現存資料から識別・確認できた下限です。治癒後、死亡時には外見から確認できなくなった外傷もあり、頭皮などの外傷は「非常に多く、すべてを列挙できない」とも説明されています。したがって、42か所を子どもが受けた傷害の完全な総数と解釈してはいけません。',
      noteSource: '原記録5～6頁に基づく｜全文を確認',
      open: '展開',
      close: '折りたたむ'
    }
  }[locale];

  const versioned = value => {
    if (!value) return '';
    const url = new URL(value, location.href);
    url.searchParams.set('v', posterVersion);
    return url.href;
  };

  document.querySelectorAll('[data-day5-poster]').forEach(img => {
    const selected = simplified ? img.dataset.simplified : img.dataset.traditional;
    if (selected) img.src = versioned(selected);
  });

  if (simplified) {
    const transcript = document.querySelector('#full-record .day3-transcript');
    const originalTranscript = transcript?.innerHTML || '';
    const run = () => {
      if (typeof window.setLang === 'function') window.setLang('zh-Hans');
      if (transcript && originalTranscript) transcript.innerHTML = originalTranscript;
    };
    run();
    setTimeout(run, 120);
  }

  if (!document.getElementById('day5InjuryCountStyle')) {
    const style = document.createElement('style');
    style.id = 'day5InjuryCountStyle';
    style.textContent = `
      .day5-injury-count-note{
        grid-column:1/-1;
        position:relative;
        overflow:hidden;
        margin:6px 0 4px;
        padding:clamp(20px,3vw,30px);
        border:1px solid rgba(159,78,63,.17);
        border-left:7px solid #9f4e3f;
        border-radius:24px;
        background:
          radial-gradient(circle at 92% 10%,rgba(185,139,69,.12),transparent 27%),
          linear-gradient(145deg,rgba(255,253,249,.98),rgba(247,238,228,.94));
        box-shadow:0 16px 42px rgba(16,43,58,.08);
      }
      .day5-injury-count-note::before{
        content:'42+';
        position:absolute;
        right:18px;
        top:-13px;
        color:rgba(159,78,63,.07);
        font-size:clamp(4.8rem,12vw,9rem);
        font-weight:1000;
        line-height:1;
        pointer-events:none;
      }
      .day5-injury-count-note strong{
        position:relative;
        display:block;
        max-width:830px;
        color:#843f35;
        font-size:clamp(1.2rem,2.4vw,1.72rem);
        line-height:1.35;
      }
      .day5-injury-count-note p{
        position:relative;
        max-width:960px;
        margin:.8rem 0 0;
        color:#405b67;
        font-size:clamp(.96rem,1.5vw,1.05rem);
        line-height:1.82;
      }
      .day5-injury-count-note a{
        position:relative;
        display:inline-flex;
        margin-top:13px;
        padding:.48rem .78rem;
        border-radius:999px;
        background:#fff;
        color:#24495a;
        font-size:.78rem;
        font-weight:900;
        text-decoration:none;
        box-shadow:0 5px 16px rgba(16,43,58,.08);
      }
      .day5-injury-count-note a:hover,
      .day5-injury-count-note a:focus-visible{
        transform:translateY(-1px);
        outline:2px solid rgba(159,78,63,.24);
        outline-offset:2px;
      }
      @media(max-width:640px){
        .day5-injury-count-note{padding:19px 17px;border-left-width:5px;border-radius:19px}
        .day5-injury-count-note::before{right:8px;top:2px}
      }
    `;
    document.head.append(style);
  }

  const overviewCount = [...document.querySelectorAll('#overview .day3-facts article')]
    .find(article => article.querySelector('strong')?.textContent.includes('42'));
  if (overviewCount) {
    const small = overviewCount.querySelector('small');
    if (small) small.textContent = copy.overview;
  }

  const menu = document.querySelector('.day3-menu');
  const toc = document.getElementById('day5Toc');
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!open));
    toc?.classList.toggle('is-open', !open);
  });
  toc?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toc.classList.remove('is-open');
    menu?.setAttribute('aria-expanded', 'false');
  }));

  const chapters = [...document.querySelectorAll('.day5-record-chapter')];
  const setChapterState = (card, expanded) => {
    const btn = card?.querySelector('.day5-chapter-toggle');
    if (!card || !btn) return;
    card.classList.toggle('is-collapsed', !expanded);
    btn.textContent = expanded ? '−' : '+';
    btn.setAttribute('aria-expanded', String(expanded));
    const title = card.querySelector('h3')?.textContent?.trim() || '';
    btn.setAttribute('aria-label', `${expanded ? copy.close : copy.open}：${title}`);
  };
  chapters.forEach((card, index) => setChapterState(card, index === 0));
  document.querySelectorAll('.day5-chapter-toggle').forEach(btn => btn.addEventListener('click', event => {
    event.stopPropagation();
    const card = btn.closest('.day5-record-chapter');
    setChapterState(card, card.classList.contains('is-collapsed'));
  }));
  chapters.forEach(card => card.querySelector(':scope > header')?.addEventListener('click', () => {
    setChapterState(card, card.classList.contains('is-collapsed'));
  }));
  document.querySelector('[data-record-action="open"]')?.addEventListener('click', () => chapters.forEach(card => setChapterState(card, true)));
  document.querySelector('[data-record-action="close"]')?.addEventListener('click', () => chapters.forEach(card => setChapterState(card, false)));
  document.querySelector('[data-record-action="hide"]')?.addEventListener('click', () => body.classList.add('hide-highlights'));
  document.querySelector('[data-record-action="show"]')?.addEventListener('click', () => body.classList.remove('hide-highlights'));

  const compareGrid = document.querySelector('.day5-compare-grid');
  const compareCards = [...document.querySelectorAll('.day5-compare-card')];
  const comparison = document.getElementById('comparison');

  if (compareGrid && comparison) {
    let note = document.getElementById('day5InjuryCountNote');
    if (!note) {
      note = document.createElement('aside');
      note.id = 'day5InjuryCountNote';
      note.className = 'day5-injury-count-note';
      (compareCards[3] || compareGrid.lastElementChild)?.after(note);
    }
    note.setAttribute('aria-label', copy.noteTitle);
    note.innerHTML = `<strong>${copy.noteTitle}</strong><p>${copy.noteBody}</p><a href="#record-08">${copy.noteSource}</a>`;

    if (!comparison.querySelector('.day5-compare-filters')) {
      const filters = document.createElement('div');
      filters.className = 'day5-compare-filters';
      filters.setAttribute('role', 'group');
      filters.setAttribute('aria-label', copy.filterLabel);
      copy.filters.forEach(([key, label], index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'day5-compare-filter';
        button.dataset.compareFilter = key;
        button.textContent = label;
        button.setAttribute('aria-pressed', String(index === 0));
        filters.append(button);
      });
      compareGrid.before(filters);
      filters.addEventListener('click', event => {
        const button = event.target.closest('[data-compare-filter]');
        if (!button) return;
        filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        const key = button.dataset.compareFilter;
        compareCards.forEach(card => {
          card.hidden = key !== 'all' && !card.classList.contains(key);
        });
        const note = document.getElementById('day5InjuryCountNote');
        if (note) note.hidden = key !== 'all' && key !== 'is-agree';
      });
    }

    document.querySelectorAll('.day5-compare-sides > i').forEach(symbol => {
      symbol.dataset.mobileLabel = copy.mobile[symbol.textContent.trim()] || '';
    });
  }

  const fullRecord = document.getElementById('full-record');
  if (fullRecord && !fullRecord.querySelector('.day5-back-to-comparison')) {
    const back = document.createElement('a');
    back.href = '#comparison';
    back.className = 'day5-back-to-comparison';
    back.textContent = copy.back;
    fullRecord.prepend(back);
  }

  const openHashChapter = () => {
    if (!location.hash) return;
    const target = document.querySelector(location.hash);
    const card = target?.closest('.day5-record-chapter');
    if (card) {
      setChapterState(card, true);
      body.classList.add('day5-record-active');
    }
  };
  document.querySelectorAll('.day5-compare-links a,.day5-injury-count-note a').forEach(link => {
    link.addEventListener('click', () => setTimeout(openHashChapter, 0));
  });
  addEventListener('hashchange', openHashChapter);
  openHashChapter();

  const progress = document.querySelector('.day3-record-progress');
  const full = document.getElementById('full-record');
  const update = () => {
    if (!full || !progress) return;
    const rect = full.getBoundingClientRect();
    const total = Math.max(1, full.offsetHeight - innerHeight);
    const passed = Math.min(total, Math.max(0, -rect.top));
    const pct = Math.round(passed / total * 100);
    progress.querySelector('i')?.style.setProperty('transform', `scaleX(${Math.max(.03, pct / 100)})`);
    const label = progress.querySelector('b');
    if (label) label.textContent = `${pct}%`;
  };
  addEventListener('scroll', update, {passive: true});
  addEventListener('resize', update);
  update();

  if (window.gsap && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.utils.toArray('.day5-expert-grid article,.day5-note-grid article,.day5-evidence-grid article,.day5-comparison article,.day5-compare-card,.day5-injury-count-note')
      .forEach(el => gsap.from(el, {
        scrollTrigger: {trigger: el, start: 'top 88%', once: true},
        y: 24,
        opacity: 0,
        duration: .65,
        ease: 'power2.out'
      }));
  }
})();