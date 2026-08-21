(() => {
  'use strict';

  const wrapperSrc = document.currentScript?.src || location.href;
  const coreVersion = '20260821-testimony-checks-1';

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
      toc: '06A Mira證詞核對',
      eyebrow: '06A · TESTIMONY CROSS-CHECK',
      title: 'Mira（外籍家庭照顧者）證詞｜前後落差與待核對點',
      introTitle: '這裡標示的是「文字張力」，不是說謊判定',
      intro: '同一證人在主詰問、反詰問與法官提問中，可能修正時間、縮小原先說法，或把直接看見與環境推論混在一起。以下集中列出六組可由本頁原始紀錄直接對照的落差；是否影響可信性，仍應由法院依正式筆錄、錄音與其他證據判斷。',
      recordA: '記錄 A',
      recordB: '記錄 B',
      reading: '判讀',
      source: '回到完整問答',
      method: '編輯方法｜只並列本頁已收錄的回答，不新增事實；「前後落差」可能來自提問情境、翻譯、記憶、時間範圍或紀錄文字，不能直接等同虛偽陳述。',
      cards: [
        { no: '01', kind: 'correction', tag: '前後修正', title: '離開時間由13:30改為14:30–15:00', a: '先稱兩被告用餐看電視至約13:30，之後陸續出門。', b: '被追問孩子仍站到14:30或15:00後，證人改稱兩人約14:30至15:00才陸續離開。', reading: '這是庭上明確修正；閱讀時不應把13:30與修正後時間同時當成確定值。', chapter: '#day2-chapter-02' },
        { no: '02', kind: 'tension', tag: '用語縮限', title: '「不會說話」與「沒聽過他說話」範圍不同', a: '主詰問中回答「Baby A不會講話」。', b: '國民法官追問究竟是不會說話或只是沒聽過時，證人回答「沒聽過」。', reading: '前句是對能力的概括結論，後句只描述個人觀察；正式引用宜採較窄的「證人未曾聽見」。', chapter: '#day2-chapter-06' },
        { no: '03', kind: 'tension', tag: '例外／概括', title: '曾見訪客到場時玩小車，後又答「沒看過玩耍」', a: '證人稱有訪客來時，第一次看見孩子穿衣服並玩小車。', b: '審判長後問是否看過孩子玩耍或睡覺，證人回答「沒有」。', reading: '兩段表面不一致；可能是後題在概括平日狀況，也可能是遺漏先前例外，需連同問題語境評價。', chapter: '#day2-chapter-09' },
        { no: '04', kind: 'record', tag: '庭上記憶／先前筆錄', title: '「不記得親眼看過」與警詢所載目擊內容', a: '庭上先稱不記得親眼看過「愛的小手」打孩子。', b: '被提示警詢記載曾看見打側大腿後，證人表示較接近案發的先前筆錄若有記載，該筆錄才正確。', reading: '不是單純二選一；應核對警詢原文、詢問方式、通譯與庭訊錄音，再判斷記憶變化的影響。', chapter: '#day2-chapter-02' },
        { no: '05', kind: 'inference', tag: '親見／推論', title: '稱鍋巴餵食「非猜測」，但未親眼看見實際餵食內容', a: '證人稱不是猜測，因看見攪拌後食物、紙碗及照顧者進入洗手間餵小孩。', b: '緊接著被問是否親眼看到時，回答沒有親眼看見，只看到打碎的食物。', reading: '可直接證明的是食物、氣味、容器與動線；碗內究竟餵了什麼，仍含由環境線索形成的推論。', chapter: '#day2-chapter-03' },
        { no: '06', kind: 'estimate', tag: '估計降格', title: '躺地約一小時，後明確表示「我用猜的」', a: '先以約一小時描述孩子躺地、雙腳靠近地下室門的時間。', b: '審判長追問判斷依據時，證人回答「我用猜的」。', reading: '這不是計時結果，應標為未經測量的估計；不能把「一小時」當成精確持續時間。', chapter: '#day2-chapter-09' }
      ],
      inline: ['時間修正', '能力／親見待分', '例外待核', '先前筆錄待核', '親見範圍', '估計非計時']
    },
    'zh-Hans': {
      toc: '06A Mira证词核对',
      eyebrow: '06A · TESTIMONY CROSS-CHECK',
      title: 'Mira（外籍家庭照护者）证词｜前后落差与待核对点',
      introTitle: '这里标示的是“文字张力”，不是说谎判定',
      intro: '同一证人在主诘问、反诘问与法官提问中，可能修正时间、缩小原先说法，或把直接看见与环境推论混在一起。以下集中列出六组可由本页原始记录直接对照的落差；是否影响可信性，仍应由法院依正式笔录、录音与其他证据判断。',
      recordA: '记录 A',
      recordB: '记录 B',
      reading: '判读',
      source: '回到完整问答',
      method: '编辑方法｜只并列本页已收录的回答，不新增事实；“前后落差”可能来自提问情境、翻译、记忆、时间范围或记录文字，不能直接等同虚假陈述。',
      cards: [
        { no: '01', kind: 'correction', tag: '前后修正', title: '离开时间由13:30改为14:30–15:00', a: '先称两被告用餐看电视至约13:30，之后陆续出门。', b: '被追问孩子仍站到14:30或15:00后，证人改称两人约14:30至15:00才陆续离开。', reading: '这是庭上明确修正；阅读时不应把13:30与修正后时间同时当成确定值。', chapter: '#day2-chapter-02' },
        { no: '02', kind: 'tension', tag: '用语缩限', title: '“不会说话”与“没听过他说话”范围不同', a: '主诘问中回答“Baby A不会讲话”。', b: '国民法官追问究竟是不会说话或只是没听过时，证人回答“没听过”。', reading: '前句是对能力的概括结论，后句只描述个人观察；正式引用宜采用较窄的“证人未曾听见”。', chapter: '#day2-chapter-06' },
        { no: '03', kind: 'tension', tag: '例外／概括', title: '曾见访客到场时玩小车，后又答“没看过玩耍”', a: '证人称有访客来时，第一次看见孩子穿衣服并玩小车。', b: '审判长后问是否看过孩子玩耍或睡觉，证人回答“没有”。', reading: '两段表面不一致；可能是后题在概括平日状况，也可能是遗漏先前例外，需连同问题语境评价。', chapter: '#day2-chapter-09' },
        { no: '04', kind: 'record', tag: '庭上记忆／先前笔录', title: '“不记得亲眼看过”与警询所载目击内容', a: '庭上先称不记得亲眼看过“爱的小手”打孩子。', b: '被提示警询记载曾看见打侧大腿后，证人表示较接近案发的先前笔录若有记载，该笔录才正确。', reading: '不是单纯二选一；应核对警询原文、询问方式、翻译与庭讯录音，再判断记忆变化的影响。', chapter: '#day2-chapter-02' },
        { no: '05', kind: 'inference', tag: '亲见／推论', title: '称锅巴喂食“非猜测”，但未亲眼看见实际喂食内容', a: '证人称不是猜测，因看见搅拌后食物、纸碗及照护者进入洗手间喂小孩。', b: '紧接着被问是否亲眼看到时，回答没有亲眼看见，只看到打碎的食物。', reading: '可直接证明的是食物、气味、容器与动线；碗内究竟喂了什么，仍含由环境线索形成的推论。', chapter: '#day2-chapter-03' },
        { no: '06', kind: 'estimate', tag: '估计降格', title: '躺地约一小时，后明确表示“我用猜的”', a: '先以约一小时描述孩子躺地、双脚靠近地下室门的时间。', b: '审判长追问判断依据时，证人回答“我用猜的”。', reading: '这不是计时结果，应标为未经测量的估计；不能把“一小时”当成精确持续时间。', chapter: '#day2-chapter-09' }
      ],
      inline: ['时间修正', '能力／亲见待分', '例外待核', '先前笔录待核', '亲见范围', '估计非计时']
    },
    en: {
      toc: '06A Mira cross-check',
      eyebrow: '06A · TESTIMONY CROSS-CHECK',
      title: 'Mira’s testimony | apparent tensions and verification points',
      introTitle: 'These markers identify textual tension, not dishonesty',
      intro: 'Across direct examination, cross-examination and judicial questions, a witness may correct a time, narrow an earlier statement, or move between direct observation and inference. The six comparisons below are drawn from the record reproduced on this page. Their effect on credibility remains for the court to assess against the official transcript, audio and other evidence.',
      recordA: 'Record A',
      recordB: 'Record B',
      reading: 'How to read it',
      source: 'Open the full exchange',
      method: 'Editorial method | This panel only compares answers already reproduced on the page. An apparent inconsistency may arise from question context, interpretation, memory, time scope or record wording; it is not by itself proof of a false statement.',
      cards: [
        { no: '01', kind: 'correction', tag: 'Correction', title: 'Departure time changed from 13:30 to 14:30–15:00', a: 'She first said the two defendants watched television while eating until about 13:30 and then left in sequence.', b: 'After being asked how the child could still be standing later, she revised the departure window to about 14:30–15:00.', reading: 'This is an express correction at trial. The original and revised times should not both be treated as fixed facts.', chapter: '#day2-chapter-02' },
        { no: '02', kind: 'tension', tag: 'Narrowed wording', title: '“Could not speak” is broader than “I never heard him speak”', a: 'During direct examination she said the child could not speak.', b: 'When a citizen judge asked whether he could not speak or she had simply never heard him, she answered that she had never heard him.', reading: 'The first is a general conclusion about ability; the second is limited to her observation. Careful quotation should use the narrower formulation.', chapter: '#day2-chapter-06' },
        { no: '03', kind: 'tension', tag: 'Exception / generalization', title: 'She described one toy-car episode, then said she had never seen play', a: 'She said that when a formally dressed visitor came, she saw the child dressed and playing with a toy car.', b: 'Later, when asked whether she had seen the child play or sleep, she answered no.', reading: 'The answers appear inconsistent. The later answer may have meant ordinary daily life, or may have omitted the earlier exception; question context matters.', chapter: '#day2-chapter-09' },
        { no: '04', kind: 'record', tag: 'Trial memory / earlier statement', title: 'No trial recollection versus an earlier recorded observation', a: 'At trial she first said she did not remember directly seeing the hand-shaped paddle used to strike the child.', b: 'After being shown the police interview entry about a strike to the side of the thigh, she said the earlier, closer-in-time statement should be treated as correct if it recorded that.', reading: 'The police wording, questioning, interpretation and hearing audio should be compared before assessing the change in recollection.', chapter: '#day2-chapter-02' },
        { no: '05', kind: 'inference', tag: 'Observation / inference', title: 'She called the burnt-rice feeding “not a guess” but did not see the actual contents fed', a: 'She relied on blended food, smell, a paper bowl and the caregiver entering the bathroom to feed the child.', b: 'When immediately asked whether she personally saw it, she said she did not see the actual feeding and had seen the blended food.', reading: 'The food, container and movement were observed; what was actually in the bowl remained partly inferential.', chapter: '#day2-chapter-03' },
        { no: '06', kind: 'estimate', tag: 'Estimate downgraded', title: '“About one hour” was later described as a guess', a: 'She initially estimated that the child had been lying by the basement door for about one hour.', b: 'When the presiding judge asked for the basis, she answered that she had guessed.', reading: 'This was not a timed duration and should not be presented as a precise one-hour period.', chapter: '#day2-chapter-09' }
      ],
      inline: ['Time corrected', 'Ability / observation', 'Exception to check', 'Earlier record', 'Observation limit', 'Untimed estimate']
    },
    ja: {
      toc: '06A Mira証言照合',
      eyebrow: '06A · TESTIMONY CROSS-CHECK',
      title: 'Mira（外国人家事・介護労働者）の証言｜前後のずれと照合点',
      introTitle: 'ここで示すのは文言上の緊張関係であり、虚偽の認定ではありません',
      intro: '主尋問、反対尋問、裁判官の質問を通じ、証人は時刻を訂正したり、先の表現を限定したり、直接見たことと状況からの推測を行き来することがあります。以下の6組は本ページに再録された記録だけを対照したものです。信用性への影響は、正式調書、録音、他の証拠を踏まえて裁判所が判断すべき事項です。',
      recordA: '記録 A',
      recordB: '記録 B',
      reading: '読み方',
      source: '該当する全問答へ',
      method: '編集方針｜本ページに収録済みの回答のみを並べ、新たな事実は加えていません。見かけ上の不一致は、質問の文脈、通訳、記憶、対象期間、記録文言から生じ得るため、それだけで虚偽陳述を意味しません。',
      cards: [
        { no: '01', kind: 'correction', tag: '前後の訂正', title: '退出時刻を13時30分から14時30分～15時へ訂正', a: '当初、2人は食事とテレビを13時30分頃まで続け、その後順に外出したと述べた。', b: '子どもが14時30分または15時まで立っていた点を問われ、退出は14時30分～15時頃だったと訂正した。', reading: '法廷で明示された訂正であり、訂正前後の時刻を同時に確定値として扱うべきではありません。', chapter: '#day2-chapter-02' },
        { no: '02', kind: 'tension', tag: '表現の限定', title: '「話せない」と「話すのを聞いたことがない」は範囲が異なる', a: '主尋問では、子どもは話せないと答えた。', b: '国民法官から能力か自身の経験かを問われると、「聞いたことがない」と答えた。', reading: '前者は能力への一般的結論、後者は証人の観察範囲です。引用時は後者の限定を保つ必要があります。', chapter: '#day2-chapter-06' },
        { no: '03', kind: 'tension', tag: '例外／一般化', title: '来客時に玩具で遊ぶ姿を見た一方、後に「遊びを見ていない」と回答', a: '正式な服装の来客時、子どもが服を着て玩具の車で遊ぶのを初めて見たと述べた。', b: 'その後、遊びや睡眠を見たかとの質問に「ない」と答えた。', reading: '表面的には一致しません。後者が平常時の概括か、先の例外を失念したのか、質問文脈と併せて評価が必要です。', chapter: '#day2-chapter-09' },
        { no: '04', kind: 'record', tag: '法廷記憶／先行供述', title: '法廷での記憶欠如と警察聴取記録の目撃内容', a: '法廷では、手形状の道具で打つのを直接見たか覚えていないと述べた。', b: '太もも側面を打つのを見たとの警察聴取記録を示され、事件に近い時期の記録にあればそちらが正しいと述べた。', reading: '警察聴取の原文、質問方法、通訳、法廷録音を照合してから記憶変化を評価すべきです。', chapter: '#day2-chapter-02' },
        { no: '05', kind: 'inference', tag: '直接観察／推測', title: '焦げ飯を食べさせたことは「推測でない」としつつ、実際の内容は見ていない', a: '攪拌後の食物、焦げた匂い、紙椀、浴室へ入る動線を根拠に挙げた。', b: '直後に直接見たか問われると、実際に食べさせた内容は見ておらず、砕いた食物を見たと答えた。', reading: '食物、容器、動線は直接観察ですが、椀の中身と実際の摂取内容には状況からの推測が含まれます。', chapter: '#day2-chapter-03' },
        { no: '06', kind: 'estimate', tag: '推定の限定', title: '横たわった時間「約1時間」は後に「推測」と説明', a: '地下室扉付近で横たわっていた時間を約1時間と述べた。', b: '裁判長が根拠を尋ねると、「推測した」と答えた。', reading: '計測された時間ではなく、正確な1時間として示すことはできません。', chapter: '#day2-chapter-09' }
      ],
      inline: ['時刻訂正', '能力／観察', '例外を照合', '先行記録', '観察範囲', '未計測の推定']
    }
  };

  const c = copy[locale] || copy['zh-Hant'];

  const injectStyles = () => {
    if (document.getElementById('day2-testimony-check-styles')) return;
    const style = document.createElement('style');
    style.id = 'day2-testimony-check-styles';
    style.textContent = `
      .day2-testimony-checks{position:relative;isolation:isolate;overflow:hidden;background:linear-gradient(145deg,rgba(255,247,242,.98),rgba(248,238,244,.94) 52%,rgba(239,247,248,.96));}
      .day2-testimony-checks::before,.day2-testimony-checks::after{content:"";position:absolute;border-radius:999px;filter:blur(2px);pointer-events:none;z-index:-1;}
      .day2-testimony-checks::before{width:260px;height:260px;right:-90px;top:60px;background:rgba(198,113,134,.11);}
      .day2-testimony-checks::after{width:220px;height:220px;left:-100px;bottom:80px;background:rgba(74,136,144,.10);}
      .day2-check-intro,.day2-check-grid,.day2-check-method{width:min(1120px,calc(100% - 32px));margin-inline:auto;}
      .day2-check-intro{display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:start;padding:18px 20px;margin-top:8px;margin-bottom:22px;border:1px solid rgba(126,64,82,.18);border-radius:20px;background:rgba(255,255,255,.78);box-shadow:0 14px 34px rgba(83,48,60,.08);}
      .day2-check-intro>i{display:grid;place-items:center;width:44px;height:44px;border-radius:14px;background:#843d55;color:#fff;font-style:normal;font-weight:900;letter-spacing:.04em;}
      .day2-check-intro strong{display:block;color:#662b40;font-size:clamp(1.02rem,1.5vw,1.18rem);line-height:1.45;margin-bottom:5px;}
      .day2-check-intro p,.day2-check-method{margin:0;color:#4f4146;line-height:1.82;}
      .day2-check-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;}
      .day2-check-card{position:relative;display:flex;flex-direction:column;min-width:0;padding:24px;border:1px solid rgba(112,65,79,.16);border-left:5px solid #a94966;border-radius:22px;background:rgba(255,255,255,.94);box-shadow:0 16px 38px rgba(68,43,52,.09);}
      .day2-check-card.is-inference{border-left-color:#8a6a28;}.day2-check-card.is-estimate{border-left-color:#3d7880;}.day2-check-card.is-record{border-left-color:#6d558e;}
      .day2-check-kicker{display:inline-flex;align-self:flex-start;padding:6px 10px;border-radius:999px;background:rgba(132,61,85,.10);color:#743249;font-size:.78rem;font-weight:900;letter-spacing:.055em;}
      .day2-check-card h3{margin:14px 0 13px;color:#35282d;font-size:clamp(1.08rem,1.7vw,1.28rem);line-height:1.5;}
      .day2-check-source{margin:0 0 9px;padding:12px 14px;border-radius:14px;background:#fbf7f5;color:#4d4145;line-height:1.72;}
      .day2-check-source b{color:#7b344d;}
      .day2-check-reading{margin:5px 0 16px;color:#3f363a;line-height:1.78;}
      .day2-check-reading strong{color:#5b2b3d;}
      .day2-check-link{align-self:flex-start;margin-top:auto;display:inline-flex;align-items:center;gap:7px;padding:9px 13px;border-radius:999px;border:1px solid rgba(126,55,80,.25);color:#6c2f45;font-weight:800;text-decoration:none;background:#fff;}
      .day2-check-link::after{content:"→";transition:transform .2s ease;}.day2-check-link:hover::after,.day2-check-link:focus-visible::after{transform:translateX(3px);}
      .day2-check-link:focus-visible{outline:3px solid rgba(116,50,73,.24);outline-offset:3px;}
      .day2-check-method{margin-top:20px;padding:14px 16px;border-top:1px dashed rgba(101,58,72,.28);font-size:.92rem;}
      .day2-dialogue-pair.day2-inline-check{outline:3px solid rgba(172,76,104,.22);outline-offset:3px;border-radius:18px;}
      .day2-inline-check-badge{display:inline-flex;align-items:center;margin:9px 0 0;padding:5px 9px;border-radius:999px;background:#7d334c;color:#fff;font-size:.72rem;font-weight:900;letter-spacing:.04em;box-shadow:0 5px 14px rgba(82,35,51,.18);}
      .day2-toc a[href="#mira-testimony-checks"]{font-weight:900;color:#722f48;}
      @media(max-width:760px){.day2-check-grid{grid-template-columns:1fr;}.day2-check-intro{grid-template-columns:1fr;padding:17px;}.day2-check-intro>i{width:40px;height:40px}.day2-check-card{padding:20px}.day2-check-intro,.day2-check-grid,.day2-check-method{width:min(100% - 22px,1120px);}}
      @media(prefers-reduced-motion:reduce){.day2-check-link::after{transition:none;}}
    `;
    document.head.append(style);
  };

  const renderSection = () => {
    if (document.getElementById('mira-testimony-checks')) return;
    const target = document.getElementById('limits');
    if (!target) return;

    const section = document.createElement('section');
    section.className = 'day2-section day2-testimony-checks';
    section.id = 'mira-testimony-checks';
    section.setAttribute('aria-labelledby', 'mira-testimony-checks-title');
    const cards = c.cards.map(card => `
      <article class="day2-check-card is-${card.kind} day2-reveal">
        <span class="day2-check-kicker">${card.no} · ${card.tag}</span>
        <h3>${card.title}</h3>
        <p class="day2-check-source"><b>${c.recordA}｜</b>${card.a}</p>
        <p class="day2-check-source"><b>${c.recordB}｜</b>${card.b}</p>
        <p class="day2-check-reading"><strong>${c.reading}｜</strong>${card.reading}</p>
        <a class="day2-check-link" href="${card.chapter}">${c.source}</a>
      </article>`).join('');

    section.innerHTML = `
      <div class="day2-section-head day2-reveal">
        <small>${c.eyebrow}</small>
        <h2 id="mira-testimony-checks-title">${c.title}</h2>
      </div>
      <aside class="day2-check-intro day2-reveal" role="note"><i aria-hidden="true">≠</i><div><strong>${c.introTitle}</strong><p>${c.intro}</p></div></aside>
      <div class="day2-check-grid">${cards}</div>
      <p class="day2-check-method day2-reveal">${c.method}</p>`;
    target.before(section);

    const toc = document.querySelector('.day2-toc');
    const limitsLink = toc?.querySelector('a[href="#limits"]');
    if (toc && !toc.querySelector('a[href="#mira-testimony-checks"]')) {
      const link = document.createElement('a');
      link.href = '#mira-testimony-checks';
      link.textContent = c.toc;
      if (limitsLink) limitsLink.before(link); else toc.append(link);
    }
  };

  const matchesGroups = (text, groups) => groups.every(group => group.some(needle => text.includes(needle)));
  const flagInlineComparisons = () => {
    const definitions = [
      { selector: '#day2-chapter-02 .day2-dialogue-pair', groups: [['剛說劉彩萱13:30', '刚说刘彩萱13:30']], label: c.inline[0] },
      { selector: '#day2-chapter-02 .day2-dialogue-pair', groups: [['A是否會對你微笑或說話', 'A是否会对你微笑或说话']], label: c.inline[1] },
      { selector: '#day2-chapter-06 .day2-dialogue-pair', groups: [['是不會說話還是沒聽過他說話', '是不会说话还是没听过他说话']], label: c.inline[1] },
      { selector: '#day2-chapter-09 .day2-dialogue-pair', groups: [['有看過A玩耍或睡覺', '有看过A玩耍或睡觉']], label: c.inline[2] },
      { selector: '#day2-chapter-02 .day2-dialogue-pair', groups: [['有看見拿來打A童嗎', '有看见拿来打A童吗']], label: c.inline[3] },
      { selector: '#day2-chapter-02 .day2-dialogue-pair', groups: [['警詢筆錄說有看到', '警询笔录说有看到']], label: c.inline[3] },
      { selector: '#day2-chapter-03 .day2-dialogue-pair', groups: [['有親眼看到嗎', '有亲眼看到吗']], label: c.inline[4] },
      { selector: '#day2-chapter-09 .day2-dialogue-pair', groups: [['依何情狀判斷約1小時', '依何情状判断约1小时']], label: c.inline[5] }
    ];

    definitions.forEach(definition => {
      const pair = [...document.querySelectorAll(definition.selector)]
        .find(node => matchesGroups(node.textContent || '', definition.groups));
      if (!pair || pair.classList.contains('day2-inline-check')) return;
      pair.classList.add('day2-inline-check');
      const answer = pair.querySelector('.day2-dialogue-answer') || pair;
      const badge = document.createElement('span');
      badge.className = 'day2-inline-check-badge';
      badge.textContent = definition.label;
      answer.append(badge);
    });
  };

  injectStyles();
  renderSection();
  flagInlineComparisons();

  if (!document.querySelector('script[data-day2-reading-core]')) {
    const core = document.createElement('script');
    core.src = new URL(`./day2-reading-core.js?v=${coreVersion}`, wrapperSrc).href;
    core.async = false;
    core.dataset.day2ReadingCore = 'true';
    core.addEventListener('load', () => window.ScrollTrigger?.refresh?.());
    core.addEventListener('error', () => console.error('Unable to load Day 2 reading core.'));
    document.body.append(core);
  }
})();
