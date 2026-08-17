(() => {
  'use strict';

  document.documentElement.classList.add('js');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = [...document.querySelectorAll('.reveal')];
  let stageSoundEnabled = false;
  let stageAudioContext = null;

  function getStageAudioContext() {
    if (!stageSoundEnabled || document.hidden) return null;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    stageAudioContext ||= new AudioContextClass();
    if (stageAudioContext.state === 'suspended') stageAudioContext.resume().catch(() => {});
    return stageAudioContext;
  }

  function stageTone(context, frequency, delay, duration, volume, type = 'sine') {
    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(55, frequency * .72), start + duration);
    gain.gain.setValueAtTime(.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + .025);
    gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + .04);
  }

  function stageSwish(context, delay = 0) {
    const duration = .42;
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let index = 0; index < channel.length; index += 1) {
      channel[index] = (Math.random() * 2 - 1) * Math.sin(Math.PI * index / channel.length);
    }
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    const start = context.currentTime + delay;
    source.buffer = buffer;
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(680, start);
    filter.frequency.exponentialRampToValueAtTime(260, start + duration);
    filter.Q.value = .72;
    gain.gain.setValueAtTime(.0001, start);
    gain.gain.exponentialRampToValueAtTime(.012, start + .09);
    gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
    source.connect(filter).connect(gain).connect(context.destination);
    source.start(start);
  }

  function playStageSound(kind) {
    const context = getStageAudioContext();
    if (!context) return;
    if (kind === 'open' || kind === 'close') {
      stageSwish(context);
      stageTone(context, kind === 'open' ? 164 : 132, .06, .16, .016, 'triangle');
      return;
    }
    if (kind === 'chorus') {
      stageTone(context, 220, 0, .75, .012, 'sine');
      stageTone(context, 330, .08, .72, .009, 'sine');
      return;
    }
    stageTone(context, kind === 'female' ? 392 : 294, 0, .34, .009, 'sine');
  }

  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .14 });
    reveals.forEach(node => revealObserver.observe(node));
  } else {
    reveals.forEach(node => node.classList.add('is-visible'));
  }

  if (!reducedMotion) {
    const line = document.createElement('div');
    line.className = 'wh-progress';
    line.setAttribute('aria-hidden', 'true');
    document.body.appendChild(line);
    let scheduled = false;
    const paint = () => {
      const available = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      line.style.width = `${Math.max(0, Math.min(1, scrollY / available)) * 100}%`;
      scheduled = false;
    };
    addEventListener('scroll', () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(paint);
    }, { passive: true });
    addEventListener('resize', paint, { passive: true });
    paint();
  }

  const theatreCopy = {
    zh: {
      notice: '原創皮影詩劇｜女角「守門人」與男角「說書人」皆為象徵角色，不是王昊、家屬、被告或司法人員；台詞不是案件史料，也不重演受害情節。',
      noticeTitle: '舞臺聲明', transcript: '展開本幕完整台詞', replay: '重看本幕',
      labels: { female: '女・守門人', male: '男・說書人', chorus: '合聲' },
      seals: { minnan: '閩南剪黏', hakka: '客家藍染', postwar: '眷村家書' },
      scenes: [
        { title: '序幕｜布幕初啟', female: '檐雨守著門，我守的不是木扉，而是孩子無法獨自推開、也不該無人抵達的界線。', male: '我在卷宗另一端守夜，紙上日期與刑期都冷，只有兩歲五個月的名字仍使字頁發熱。', seals: ['minnan', 'hakka', 'postwar'] },
        { title: '第一章｜在成為案號以前', female: '我在戲臺中央留一寸白，不畫傷勢，也不借他的口說話，只讓孩子先站回名字裡。', male: '在案號與法條以前，王昊先是一名兩歲五個月幼兒，本應被照顧，也無法替自己呼喚制度。' },
        { title: '第二章｜被帶離視線的日子', female: '日曆逐格亮起，不是死亡倒數，也不是虛構的失蹤紀錄，只標出外界未能抵達的距離。', male: '從10月11日至11月1日相隔二十一日；判決分開控制與後段參與，我們也不把四人混寫。', seals: ['postwar'] },
        { title: '第三章｜送醫是最後一段路', female: '舞臺走到醫院長廊便止步，戲偶不模仿哭喊、不重演急救，讓事實在克制裡保有尊嚴。', male: '判決採認兩種毒品共同作用造成中毒性休克，抵院前已無生命徵象；送醫不等於及時救治。' },
        { title: '第四章｜分岔的判詞', female: '判詞如河分岔，悲傷可以追問每一處轉折，卻不能讓一審、二審與特別救濟彼此冒名。', male: '我把法院認定、檢察總長批評與家屬主張分欄書寫，使責任在正確的光下被看見。' },
        { title: '第五章｜名字落進法條', female: '他的名字落進第54條之1的社會稱呼，我卻怕名字成碑，人人看見，仍無人往門前一步。', male: '法律真正記住的應是一串動詞：辨認、查訪、親見、通報與接手，讓保護離開紙面。', seals: ['minnan'] },
        { title: '第六章｜查訪必須抵達', female: '地址只有一行，從卷宗走到門前卻很遠；我把藍染的燈留在簷下，等真正抵達的人。', male: '電話裡一句「孩子很好」不能代替親見；制度要確認承辦、風險、通報與下一雙接住的手。', seals: ['hakka'] },
        { title: '終幕｜東方既白・布幕合起', female: '天色沿瓦脊變白，布幕將合；我仍怕名字被刻得太深，反而遮住後人該繼續走的路。', male: '我們不能倒轉2011年的日曆，卻能讓下一份文件更早找到孩子，使制度先於危險抵達。', chorus: '我們不是孩子的聲音，只是守門人與說書人；布幕落下，責任不散場，願每一扇門都有人走到。', seals: ['minnan', 'hakka', 'postwar'] }
      ],
      culture: {
        kicker: 'TAIWAN CULTURAL MEMORY · 裝飾性文化語彙', title: '臺灣公共文化圖章',
        intro: '六枚圖章把地方手工藝與戰後生活記憶帶進專題舞臺；它們只負責頁面的文化節奏，不替案件人物標示身分。',
        stampTitle: '六枚新作文化圖章',
        stampIntro: '紙纖維、套色版印與歲月磨痕延續全頁的傳統色調；每一枚都是裝飾性文化圖像，不是案件證據或身分標記。',
        stamps: [
          ['minnan-03', '閩南 03｜燕影與厝院'],
          ['minnan-04', '閩南 04｜彩棚與獅首'],
          ['hakka-03', '客家 03｜柿果與紙傘'],
          ['hakka-04', '客家 04｜花田與水圳'],
          ['waisheng-03', '戰後外省移居生活記憶 03｜車站與家書'],
          ['waisheng-04', '戰後外省移居生活記憶 04｜露天電影與收音機']
        ],
        cards: [
          ['minnan', '臺灣閩南生活工藝', '剪黏花片', '以抽象陶片與屋脊弧線引用剪黏手藝的材料感，不重製廟徽或宗教標誌。'],
          ['hakka', '臺灣客家手作記憶', '藍染布與縫線', '以靛藍布褶與細密縫線呈現手作痕跡，也呼應制度交接不能斷線。'],
          ['postwar', '眷村／戰後外省移居生活記憶', '巷樹與家書', '以巷口老樹與尋常家書指向遷居、成家與鄰里日常；不使用軍徽、旗幟或籍貫符號。']
        ],
        noteLabel: '編輯聲明：', note: '這些圖章只是臺灣公共文化意象，不是案件證據；不代表、也不暗示王昊、家屬、被告或其他案件人物的族群、語言、祖籍、出生地、宗教、政治立場或家庭史。'
      }
    },
    en: {
      notice: 'Original shadow-puppet verse drama | The woman, “Keeper of the Threshold,” and the man, “Storyteller,” are symbolic figures created for this feature. They do not represent Wang Hao, his family, any defendant, or any judicial actor. Their words are not evidence and do not reenact abuse.',
      noticeTitle: 'Stage notice', transcript: 'Open the complete dialogue', replay: 'Replay this scene',
      labels: { female: 'Woman · Keeper of the Threshold', male: 'Man · Storyteller', chorus: 'Together' },
      seals: { minnan: 'Minnan mosaic', hakka: 'Hakka indigo', postwar: 'Settlement letter' },
      scenes: [
        { title: 'Prologue | The curtain rises', female: 'Beneath rain-dark eaves, I guard not a wooden door but a threshold no child can open alone—and no adult should fail to reach.', male: 'I keep vigil at the far end of the record; dates and sentences lie cold, yet the name of a two-year-five-month-old still warms the page.', seals: ['minnan', 'hakka', 'postwar'] },
        { title: 'Chapter One | Before he became a case number', female: 'I leave a handspan of white at center stage: no wounds, no borrowed voice, only room for the child to stand again within his own name.', male: 'Before docket numbers and statutes, Wang Hao was a child of two years and five months, entitled to care and unable to summon the system for himself.' },
        { title: 'Chapter Two | The days beyond sight', female: 'The calendar lights square by square, neither a countdown to death nor an invented missing-child record, only the measure of how far help failed to travel.', male: 'October 11 and November 1 stand twenty-one days apart; the judgment separates control from later participation, and so must our telling.', seals: ['postwar'] },
        { title: 'Chapter Three | The last road was to the hospital', female: 'The stage stops at the hospital corridor; the puppets imitate no cries and reenact no resuscitation, allowing restraint to protect the dignity of fact.', male: 'The judgment accepted that the two drugs acted together to cause toxic shock; he had no signs of life on arrival, and transport was not timely care.' },
        { title: 'Chapter Four | Judgments at the fork', female: 'A judgment branches like a river; grief may question every turn, but it must not make trial, appeal, and extraordinary remedies exchange their names.', male: 'I place the court’s findings, the Prosecutor-General’s criticism, and the family’s claims in separate columns, so each responsibility appears in its proper light.' },
        { title: 'Chapter Five | His name entered the law', female: 'His name entered the public name for Article 54-1, yet I fear a name may become a monument—visible to all, while no one walks to the door.', male: 'What the law must remember is a chain of verbs: identify, visit, see in person, report, and hand over, until protection leaves the page.', seals: ['minnan'] },
        { title: 'Chapter Six | The visit must arrive', female: 'An address is one line, but the road from the file to the door is long; I leave an indigo lamp beneath the eaves for whoever truly arrives.', male: '“The child is fine” over the phone cannot replace seeing; the system must confirm responsibility, risk, reporting, and the next hands that receive the child.', seals: ['hakka'] },
        { title: 'Finale | Dawn breaks and the curtain closes', female: 'Dawn whitens the roof ridge as the curtain closes; I still fear a name carved too deeply may hide the road others must continue.', male: 'We cannot turn back the calendar of 2011, but the next file can find the child sooner and let protection arrive before danger.', chorus: 'We are not the child’s voice, only threshold keeper and storyteller; the curtain falls, responsibility does not—may every door be reached.', seals: ['minnan', 'hakka', 'postwar'] }
      ],
      culture: {
        kicker: 'TAIWAN CULTURAL MEMORY · DECORATIVE CONTEXT', title: 'Taiwan public cultural stamps',
        intro: 'Six stamps bring local craft and postwar everyday memory into the visual language of the feature. They do not identify anyone in the case.',
        stampTitle: 'Six newly designed cultural stamps',
        stampIntro: 'Paper grain, layered block-print color, and gently weathered edges continue the page’s traditional palette. Every stamp is decorative cultural imagery—not evidence or an identity marker.',
        stamps: [
          ['minnan-03', 'Minnan 03 | Courtyard and swallow'],
          ['minnan-04', 'Minnan 04 | Festival canopy and lion motif'],
          ['hakka-03', 'Hakka 03 | Persimmons and paper parasol'],
          ['hakka-04', 'Hakka 04 | Flower field and irrigation channel'],
          ['waisheng-03', 'Postwar migrant memory 03 | Station and family letters'],
          ['waisheng-04', 'Postwar migrant memory 04 | Outdoor cinema and radio']
        ],
        cards: [
          ['minnan', 'Taiwanese Minnan craft', 'Cut-and-paste ceramic mosaic', 'Abstract ceramic fragments and a roofline curve recall the material language of jian-nian without reproducing a temple emblem or religious sign.'],
          ['hakka', 'Taiwan Hakka handwork', 'Indigo cloth and stitching', 'An indigo fold and stitch line evoke handwork while echoing a safeguarding handoff that must not be allowed to break.'],
          ['postwar', 'Waisheng migration / postwar settlement memory', 'Alley tree and family letter', 'An ordinary tree and letter refer to migration, home, and neighborhood—not military rank, flags, politics, or ancestry.']
        ],
        noteLabel: 'Editorial note:', note: 'These are public cultural images only, not case evidence. They do not identify or imply the ethnicity, language, ancestry, birthplace, religion, political affiliation, or family history of Wang Hao or anyone connected with the case.'
      }
    },
    ja: {
      notice: 'オリジナル皮影戯詩劇｜女の「門守り」と男の「語り部」は、本特集のために創作した象徴的な役です。王昊、家族、被告、司法関係者のいずれも演じません。台詞は事件資料ではなく、被害の再現でもありません。',
      noticeTitle: '舞台上の注記', transcript: 'この場面の台詞全文を開く', replay: 'この場面を再生',
      labels: { female: '女・門守り', male: '男・語り部', chorus: '合唱' },
      seals: { minnan: '閩南の剪黏', hakka: '客家の藍染', postwar: '眷村の家書' },
      scenes: [
        { title: '序幕｜幕が上がる', female: '雨に濡れた軒下で、私は木の扉ではなく、子ども一人では開けられず、大人がたどり着くべき境を守る。', male: '私は記録の向こう側で夜を守る。日付も刑も冷たいが、二歳五か月の名だけが紙面にぬくもりを残す。', seals: ['minnan', 'hakka', 'postwar'] },
        { title: '第一章｜事件番号になる前に', female: '舞台中央に一寸の余白を残す。傷も描かず、声も借りず、子どもが自分の名の中へ戻る場所だけを置く。', male: '事件番号と法条より先に、王昊は二歳五か月の幼児であり、養育を受ける権利があり、自ら制度を呼べなかった。' },
        { title: '第二章｜視線から離れた日々', female: '暦の枠が一つずつ灯る。死への秒読みでも、作られた失踪記録でもなく、外から届かなかった距離だけを示す。', male: '10月11日と11月1日は二十一日隔たる。判決が支配と後段の関与を分けたように、語りも四人を混同しない。', seals: ['postwar'] },
        { title: '第三章｜最後の道は病院へ', female: '舞台は病院の廊下で止まる。人形は泣き声も蘇生も再現せず、抑制の中で事実の尊厳を守る。', male: '判決は二種の薬物の相互作用による中毒性ショックを認定し、到着時に生命徴候はなく、搬送は適時の救命ではなかった。' },
        { title: '第四章｜分かれた判決', female: '判決文は川のように分かれる。悲しみは曲折を問えるが、一審・控訴審・特別救済の名を入れ替えてはならない。', male: '裁判所の認定、検察総長の批判、家族の主張を別々に記し、それぞれの責任を正しい光の下に置く。' },
        { title: '第五章｜名前が法条へ入る', female: '彼の名は第54条の1の通称に残ったが、名が碑となり、誰も扉まで歩かなくなることを私は恐れる。', male: '法が覚えるべきは、特定し、訪問し、直接会い、通報し、引き継ぐという動詞の列である。', seals: ['minnan'] },
        { title: '第六章｜訪問は届かなければならない', female: '住所は一行でも、記録から扉までは遠い。私は軒下に藍染の灯を残し、本当に到着する人を待つ。', male: '電話の「子どもは元気」は面会に代わらない。担当、危険、通報、そして受け取る次の手まで確認する。', seals: ['hakka'] },
        { title: '終幕｜東の空が白み、幕が閉じる', female: '屋根の稜線が白み、幕が閉じる。深く刻まれた名が、後に続く者の道を隠さないか、私はなお恐れる。', male: '2011年の暦は戻せない。それでも次の記録は、より早く子どもを見つけ、危険より先に保護を届けられる。', chorus: '私たちは子どもの声ではなく、門守りと語り部にすぎない。幕が下りても責任は終わらず、すべての扉に誰かがたどり着くように。', seals: ['minnan', 'hakka', 'postwar'] }
      ],
      culture: {
        kicker: 'TAIWAN CULTURAL MEMORY · 装飾上の文化的文脈', title: '台湾公共文化図章',
        intro: '六つの図章で地方工芸と戦後の日常記憶を特集の視覚言語へ取り入れます。事件関係者の背景を示すものではありません。',
        stampTitle: '新作の文化図章・六点',
        stampIntro: '紙の繊維、重ね刷りの色、穏やかな経年の痕跡が、ページ全体の伝統色を引き継ぎます。いずれも装飾的な文化図像であり、事件の証拠や身分表示ではありません。',
        stamps: [
          ['minnan-03', '閩南 03｜燕と家屋の中庭'],
          ['minnan-04', '閩南 04｜祭礼の彩棚と獅子意匠'],
          ['hakka-03', '客家 03｜柿と紙傘'],
          ['hakka-04', '客家 04｜花畑と水路'],
          ['waisheng-03', '戦後外省系移住生活の記憶 03｜駅と家族への手紙'],
          ['waisheng-04', '戦後外省系移住生活の記憶 04｜野外映画とラジオ']
        ],
        cards: [
          ['minnan', '台湾閩南の生活工芸', '剪黏の陶片', '抽象化した陶片と屋根の曲線で剪黏の素材感を表し、寺廟の紋章や宗教的標識は再現しません。'],
          ['hakka', '台湾客家の手仕事の記憶', '藍染の布と縫い目', '藍色の布の折り目と縫い目で手仕事を表し、保護制度の引継ぎを途切れさせないという主題にも重ねます。'],
          ['postwar', '外省系移住／眷村の戦後生活記憶', '路地の木と家族への手紙', '路地の木と日常の手紙で移住、家庭、近隣生活の記憶を示し、軍章、旗、出身地の記号は用いません。']
        ],
        noteLabel: '編集上の注記：', note: 'これらは台湾の公共文化を示す装飾的意象であり、事件の証拠ではありません。王昊、家族、被告その他の関係者について、民族、言語、祖籍、出生地、宗教、政治的立場、家族史を示唆するものではありません。'
      }
    }
  };

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function currentTheatreCopy() {
    const language = (document.documentElement.lang || 'zh-Hant').toLowerCase();
    if (language.startsWith('en')) return theatreCopy.en;
    if (language.startsWith('ja')) return theatreCopy.ja;
    return theatreCopy.zh;
  }

  function puppetStage(scene, mode, copy) {
    const stage = document.createElement('div');
    const sceneIndex = copy.scenes.indexOf(scene);
    const motionSequence = ['arrival', 'incline', 'step', 'turn', 'raise', 'unfold', 'search', 'guard'];
    const stampSequence = ['minnan-03', 'hakka-03', 'waisheng-03', '', '', 'minnan-04', 'hakka-04', 'waisheng-04'];
    const stageStamp = stampSequence[sceneIndex] || '';
    stage.className = 'wh-puppet-play';
    stage.dataset.puppetPlay = '';
    stage.dataset.puppetMode = mode;
    stage.dataset.puppetScene = String(sceneIndex);
    stage.dataset.puppetMotion = motionSequence[sceneIndex] || 'arrival';
    if (stageStamp) stage.dataset.stageStamp = stageStamp;
    stage.dataset.dialogueDelay = mode === 'finale' ? '1850' : '1650';
    stage.dataset.dialogueHold = document.documentElement.lang === 'en' ? '6100' : '5200';
    stage.setAttribute('aria-label', scene.title);
    const dialogues = [
      ['female', scene.female], ['male', scene.male], ...(scene.chorus ? [['chorus', scene.chorus]] : [])
    ];
    const dialogueHTML = dialogues.map(([speaker, text]) =>
      `<blockquote class="wh-puppet-dialogue" data-speaker="${speaker}" data-label="${escapeHTML(copy.labels[speaker])}" aria-hidden="true">${escapeHTML(text)}</blockquote>`
    ).join('');
    const transcriptHTML = dialogues.map(([speaker, text]) =>
      `<p><strong>${escapeHTML(copy.labels[speaker])}</strong>：${escapeHTML(text)}</p>`
    ).join('');
    const sealHTML = (scene.seals || []).map(name =>
      `<span class="wh-cultural-seal" data-culture="${name}">${escapeHTML(copy.seals[name])}</span>`
    ).join('');
    stage.innerHTML = `
      <div class="wh-stage-curtain" aria-hidden="true"><span class="wh-curtain-panel is-left"></span><span class="wh-curtain-panel is-right"></span></div>
      ${stageStamp ? '<span class="wh-stage-stamp" aria-hidden="true"></span>' : ''}
      <figure class="wh-puppet is-female" aria-hidden="true"><span class="wh-puppet-motion-layer"><span class="wh-puppet-art"></span><i class="wh-control-rod is-body"></i><i class="wh-control-rod is-hand"></i></span></figure>
      <figure class="wh-puppet is-male" aria-hidden="true"><span class="wh-puppet-motion-layer"><span class="wh-puppet-art"></span><i class="wh-control-rod is-body"></i><i class="wh-control-rod is-hand"></i></span></figure>
      <div class="wh-puppet-dialogues" aria-live="polite">${dialogueHTML}</div>
      ${sealHTML ? `<div class="wh-cultural-seals" aria-label="${escapeHTML(copy.culture.title)}">${sealHTML}</div>` : ''}
      <details class="wh-puppet-transcript"><summary>${escapeHTML(copy.transcript)}</summary>${transcriptHTML}</details>
      <button class="wh-puppet-replay" type="button">↻ ${escapeHTML(copy.replay)}</button>`;
    return stage;
  }

  function cultureMark(kind) {
    const paths = {
      minnan: '<path d="M11 38 22 20l10 9-8 17Z" fill="currentColor" opacity=".28"/><path d="m31 19 12-8 10 17-16 8Z" fill="currentColor" opacity=".48"/><path d="M18 49c10-11 25-13 36-2" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
      hakka: '<path d="M14 12h36v40H14z" fill="currentColor" opacity=".13"/><path d="M18 22c9 6 18-6 28 0M18 34c9 6 18-6 28 0" stroke="currentColor" stroke-width="3"/><path d="M18 45h28" stroke="currentColor" stroke-width="2" stroke-dasharray="3 4"/>',
      postwar: '<path d="M7 52c12-13 27-16 50-8" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M42 16v27M35 22c0-7 14-7 14 0 7 0 7 10 0 10H35c-8 0-8-10 0-10Z" fill="currentColor" opacity=".28"/><path d="M12 26h20v15H12zM12 27l10 8 10-8" stroke="currentColor" stroke-width="2"/>'
    };
    return `<span class="wh-culture-mark" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none" focusable="false">${paths[kind]}</svg></span>`;
  }

  function installTheatre() {
    const copy = currentTheatreCopy();
    const openingSection = document.querySelector('#opening-guide');
    const openingTarget = document.querySelector('#opening-guide .wh-narrow');
    if (openingTarget && !document.querySelector('.wh-puppet-notice')) {
      const notice = document.createElement('aside');
      notice.className = 'wh-puppet-notice';
      notice.innerHTML = `<strong>${escapeHTML(copy.noticeTitle)}</strong><p>${escapeHTML(copy.notice)}</p>`;
      openingTarget.appendChild(notice);
      openingSection?.appendChild(puppetStage(copy.scenes[0], 'opening', copy));
    }

    [...document.querySelectorAll('.wh-act .wh-interlude .wh-stage')].forEach((target, index) => {
      if (!target.querySelector('.wh-puppet-play') && copy.scenes[index + 1]) {
        target.appendChild(puppetStage(copy.scenes[index + 1], 'chapter', copy));
      }
    });

    const finaleTarget = document.querySelector('.wh-finale-inner');
    if (finaleTarget && !finaleTarget.querySelector('.wh-puppet-play')) {
      finaleTarget.appendChild(puppetStage(copy.scenes[7], 'finale', copy));
    }

    if (openingSection && !document.querySelector('.wh-culture-strip')) {
      const culture = copy.culture;
      const strip = document.createElement('aside');
      strip.className = 'wh-culture-strip';
      strip.setAttribute('aria-labelledby', 'culture-title');
      strip.innerHTML = `<div class="wh-culture-inner">
        <div class="wh-kicker">${escapeHTML(culture.kicker)}</div><h2 id="culture-title">${escapeHTML(culture.title)}</h2>
        <p class="wh-culture-intro">${escapeHTML(culture.intro)}</p>
        <section class="wh-stamp-set" aria-labelledby="culture-stamp-title">
          <div class="wh-stamp-heading"><h3 id="culture-stamp-title">${escapeHTML(culture.stampTitle)}</h3><p>${escapeHTML(culture.stampIntro)}</p></div>
          <ul class="wh-stamp-list" role="list">${culture.stamps.map(([stamp, label]) =>
            `<li class="wh-stamp-item" data-stamp="${stamp}"><span class="wh-stamp-art" aria-hidden="true"></span><span class="wh-stamp-caption">${escapeHTML(label)}</span></li>`
          ).join('')}</ul>
        </section>
        <ul class="wh-culture-list" role="list">${culture.cards.map(([kind, title, subtitle, description]) =>
          `<li class="wh-culture-card" data-culture="${kind}">${cultureMark(kind)}<div class="wh-culture-copy"><h3>${escapeHTML(title)}</h3><small>${escapeHTML(subtitle)}</small><p>${escapeHTML(description)}</p></div></li>`
        ).join('')}</ul>
        <p class="wh-culture-note"><strong>${escapeHTML(culture.noteLabel)}</strong>${escapeHTML(culture.note)}</p>
      </div>`;
      openingSection.after(strip);
    }
  }

  installTheatre();

  const puppetStages = [...document.querySelectorAll('.wh-puppet-play')];
  const puppetTimers = new WeakMap();

  function clearPuppetTimers(stage) {
    (puppetTimers.get(stage) || []).forEach(window.clearTimeout);
    puppetTimers.set(stage, []);
  }

  function queuePuppetTimer(stage, callback, delay) {
    const timers = puppetTimers.get(stage) || [];
    timers.push(window.setTimeout(callback, delay));
    puppetTimers.set(stage, timers);
  }

  function resetPuppetStage(stage) {
    clearPuppetTimers(stage);
    stage.classList.remove(
      'is-playing', 'is-closing', 'is-complete',
      'is-speaking-female', 'is-speaking-male', 'is-speaking-chorus'
    );
    stage.removeAttribute('data-active-speaker');
    stage.querySelectorAll('.wh-puppet-dialogue').forEach(dialogue => {
      dialogue.classList.remove('is-current', 'is-spoken');
      dialogue.setAttribute('aria-hidden', 'true');
    });
  }

  function playPuppetStage(stage, force = false) {
    if (reducedMotion) {
      stage.classList.add('is-static', 'is-complete');
      stage.querySelectorAll('.wh-puppet-dialogue').forEach(dialogue => {
        dialogue.setAttribute('aria-hidden', 'false');
      });
      return;
    }
    if (!force && stage.dataset.puppetPlayed === 'true') return;
    resetPuppetStage(stage);
    if (force) void stage.offsetWidth;
    stage.dataset.puppetPlayed = 'true';
    stage.classList.add('is-playing');
    playStageSound('open');

    const dialogues = [...stage.querySelectorAll('.wh-puppet-dialogue')];
    const openingDelay = Math.max(900, Number(stage.dataset.dialogueDelay) || 1750);
    const defaultHold = Math.max(2600, Number(stage.dataset.dialogueHold) || 4300);

    dialogues.forEach((dialogue, index) => {
      const previous = dialogues[index - 1];
      const elapsed = dialogues.slice(0, index).reduce((total, item) => {
        return total + Math.max(2600, Number(item.dataset.hold) || defaultHold);
      }, openingDelay);

      queuePuppetTimer(stage, () => {
        if (previous) {
          previous.classList.remove('is-current');
          previous.classList.add('is-spoken');
          previous.setAttribute('aria-hidden', 'true');
        }
        const requestedSpeaker = (dialogue.dataset.speaker || 'chorus').toLowerCase();
        const speaker = ({ woman: 'female', man: 'male', together: 'chorus', final: 'chorus' })[requestedSpeaker] || requestedSpeaker;
        stage.classList.remove('is-speaking-female', 'is-speaking-male', 'is-speaking-chorus');
        stage.classList.add(`is-speaking-${speaker}`);
        stage.dataset.activeSpeaker = speaker;
        dialogue.classList.add('is-current');
        dialogue.setAttribute('aria-hidden', 'false');
        playStageSound(speaker);
      }, elapsed);
    });

    const dialogueLength = dialogues.reduce((total, item) => {
      return total + Math.max(2600, Number(item.dataset.hold) || defaultHold);
    }, openingDelay);
    const closeDelay = dialogues.length ? dialogueLength : openingDelay + 1800;

    queuePuppetTimer(stage, () => {
      const last = dialogues.at(-1);
      last?.classList.add('is-spoken');
      const isFinale = ['finale', 'ending', 'final'].includes((stage.dataset.puppetMode || '').toLowerCase());
      if (!isFinale) last?.classList.remove('is-current');
      if (!isFinale) last?.setAttribute('aria-hidden', 'true');
      stage.classList.add('is-complete', 'is-closing');
      stage.classList.remove('is-speaking-female', 'is-speaking-male');
      if (isFinale) {
        stage.classList.add('is-speaking-chorus');
        stage.dataset.activeSpeaker = 'chorus';
      }
      playStageSound('close');
    }, closeDelay);
  }

  if (puppetStages.length) {
    if (reducedMotion || !('IntersectionObserver' in window)) {
      puppetStages.forEach(stage => playPuppetStage(stage));
    } else {
      const puppetObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting || entry.intersectionRatio < .28) return;
          playPuppetStage(entry.target);
        });
      }, { threshold: [.28, .52] });
      puppetStages.forEach(stage => puppetObserver.observe(stage));
    }

    document.addEventListener('click', event => {
      const button = event.target.closest('.wh-puppet-replay, [data-puppet-replay]');
      if (!button) return;
      const stage = button.closest('.wh-puppet-play');
      if (!stage) return;
      playPuppetStage(stage, true);
    });
  }

  const replay = document.querySelector('[data-replay-opening]');
  const heroImage = document.querySelector('.wh-hero-media img');
  replay?.addEventListener('click', () => {
    if (!reducedMotion) {
      [heroImage].forEach(node => {
        if (!node) return;
        node.style.animation = 'none';
        void node.offsetWidth;
        node.style.removeProperty('animation');
      });
      const activeCurtain = document.querySelector('.wh-curtain');
      if (activeCurtain) activeCurtain.replaceWith(activeCurtain.cloneNode(true));
    }
    document.querySelector('.wh-hero')?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start'
    });
  });

  const soundButton = document.querySelector('[data-sound-toggle]');
  const soundStatus = document.querySelector('[data-sound-status]');
  if (!soundButton || !soundStatus) return;

  const copy = key => {
    const value = document.body.dataset[key] || '';
    if (document.documentElement.lang === 'zh-Hans' && typeof window.cv === 'function') return window.cv(value);
    return value;
  };
  const dataSaver = Boolean(navigator.connection && navigator.connection.saveData);
  const baseVolume = .36;
  const fadeSeconds = 1.45;
  let audio = null;
  let enabled = false;
  let pausedBySystem = false;
  let levelFrame = 0;
  let startingAt = 0;
  let lastPlaybackTime = 0;

  function setStatus(message, pressed = enabled) {
    stageSoundEnabled = Boolean(pressed);
    if (!stageSoundEnabled && stageAudioContext?.state === 'running') stageAudioContext.suspend().catch(() => {});
    soundStatus.textContent = message;
    soundButton.setAttribute('aria-pressed', String(pressed));
    soundButton.textContent = pressed ? `♪ ${copy('soundPause')}` : `♪ ${copy('soundEnable')}`;
  }

  function sourceForBrowser() {
    const probe = document.createElement('audio');
    const webm = document.body.dataset.audioWebm;
    const m4a = document.body.dataset.audioM4a;
    if (webm && probe.canPlayType('audio/webm; codecs="opus"')) return webm;
    return m4a || webm || '';
  }

  function stopLevelMonitor() {
    cancelAnimationFrame(levelFrame);
    levelFrame = 0;
  }

  function monitorLevel() {
    if (!audio || audio.paused || !enabled || document.hidden) {
      levelFrame = 0;
      return;
    }
    if (audio.currentTime + .2 < lastPlaybackTime) startingAt = 0;
    lastPlaybackTime = audio.currentTime;
    const elapsed = Math.max(0, audio.currentTime - startingAt);
    const fadeIn = Math.min(1, elapsed / fadeSeconds);
    const remaining = Number.isFinite(audio.duration) ? Math.max(0, audio.duration - audio.currentTime) : fadeSeconds;
    const fadeOut = Math.min(1, remaining / fadeSeconds);
    const envelope = Math.max(0, Math.min(fadeIn, fadeOut));
    audio.volume = baseVolume * envelope;
    levelFrame = requestAnimationFrame(monitorLevel);
  }

  function beginLevelMonitor() {
    stopLevelMonitor();
    levelFrame = requestAnimationFrame(monitorLevel);
  }

  async function startContinuousScore({ restart = false } = {}) {
    if (!enabled || document.hidden) return;
    let player;
    try {
      player = getAudio();
    } catch (_) {
      enabled = false;
      setStatus(copy('soundUnavailable'), false);
      return;
    }
    if (restart || player.ended || !Number.isFinite(player.currentTime)) player.currentTime = 0;
    startingAt = player.currentTime;
    lastPlaybackTime = player.currentTime;
    player.volume = 0;
    try {
      await player.play();
      pausedBySystem = false;
      setStatus(copy('soundPlaying'), true);
      beginLevelMonitor();
    } catch (_) {
      enabled = false;
      pausedBySystem = false;
      stopLevelMonitor();
      setStatus(copy('soundUnavailable'), false);
    }
  }

  function getAudio() {
    if (audio) return audio;
    const src = sourceForBrowser();
    if (!src) throw new Error('No audio source');
    audio = new Audio();
    audio.preload = dataSaver ? 'none' : 'metadata';
    audio.loop = true;
    audio.src = src;
    audio.addEventListener('error', () => {
      enabled = false;
      pausedBySystem = false;
      stopLevelMonitor();
      setStatus(copy('soundUnavailable'), false);
    });
    return audio;
  }

  function pauseScore({ byUser = false } = {}) {
    stopLevelMonitor();
    audio?.pause();
    if (audio) audio.volume = baseVolume;
    if (byUser) {
      enabled = false;
      pausedBySystem = false;
      setStatus(copy('soundPaused'), false);
    } else if (enabled) {
      pausedBySystem = true;
      setStatus(copy('soundPaused'), true);
    }
  }

  soundButton.addEventListener('click', async () => {
    if (enabled) {
      pauseScore({ byUser: true });
      return;
    }
    enabled = true;
    pausedBySystem = false;
    setStatus(copy('soundLoading'), true);
    getStageAudioContext();
    await startContinuousScore({ restart: !audio || audio.ended });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (enabled) pauseScore();
      return;
    }
    if (enabled && pausedBySystem) startContinuousScore();
  });

  addEventListener('pagehide', () => {
    if (enabled) pauseScore();
  });

  setStatus(dataSaver ? copy('soundDataSaver') : copy('soundDefault'), false);
})();
