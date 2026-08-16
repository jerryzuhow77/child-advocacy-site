(() => {
  'use strict';

  document.documentElement.classList.add('case-fu-js');
  const body = document.body;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  const shortLandscape = matchMedia('(max-height: 419px) and (orientation: landscape)').matches;
  const scenes = [...document.querySelectorAll('[data-fu-scene]')];
  const sceneTimers = new WeakMap();
  let activeScene = null;

  const pageLanguage = (document.documentElement.lang || 'zh-Hant').toLowerCase();
  const sceneLanguage = pageLanguage.startsWith('en') ? 'en' : pageLanguage.startsWith('ja') ? 'ja' : 'zh';
  const theatreCopy = {
    zh: {
      romanceLabel: '原創浪漫感傷詩句｜向古典悲劇的月光、誓言與獨白語彙致意',
      modernLabel: '原創時代校園心理懸疑轉場｜不重現傷害，不複製既有遊戲角色或場景',
      interactionLabel: '現代敘事互動：調閱制度線索',
      interactionNote: '只切換可核對的日期、記錄與保護行動；不模擬傷害，也不改寫案件結果。',
      curtainOpen: '幕開',
      curtainClose: '幕謝'
    },
    en: {
      romanceLabel: 'Original romantic elegy · an homage to the moonlit vows and soliloquies of classical tragedy',
      modernLabel: 'Original period-school psychological suspense · no reenactment and no copied game characters or settings',
      interactionLabel: 'Modern narrative interaction: inspect a systems clue',
      interactionNote: 'Switch only among verified dates, records, and protective actions. No harm is simulated and no outcome is rewritten.',
      curtainOpen: 'CURTAIN RISES',
      curtainClose: 'CURTAIN CALL'
    },
    ja: {
      romanceLabel: 'オリジナルの浪漫的哀歌｜古典悲劇の月、誓い、独白の語彙へのオマージュ',
      modernLabel: 'オリジナルの時代校園心理サスペンス｜被害を再現せず、既存ゲームの人物・場面を複製しません',
      interactionLabel: '現代叙事インタラクション：制度上の手掛かりを調べる',
      interactionNote: '確認可能な日付・記録・保護行動だけを切り替えます。被害を模擬せず、結末を書き換えません。',
      curtainOpen: '幕開き',
      curtainClose: '幕謝'
    }
  }[sceneLanguage];

  const romanceLines = {
    zh: [
      '記錄者：啊，若名字是長夜最後一顆星，願我這支筆不再讓它墜落。｜守望者：那便以真實作月光；愛不替沉默編詞，只替未答的門守候。',
      '記錄者：傷痕若奪走名字，記憶便像失去芬芳的玫瑰。｜守望者：把名字還給孩子吧，讓哀傷低聲，讓尊嚴先被聽見。',
      '記錄者：我願記住，卻怕凝視本身也成為一把冷刃。｜守望者：真正的愛懂得止步；在真相的門檻前，克制亦是一種擁抱。',
      '記錄者：一紙承諾渡過成人的手，孩子卻像孤舟未聞回聲。｜守望者：莫讓簽名冒充港岸；看見他安然抵達，才算完成誓言。',
      '記錄者：七十一度晨昏沉入紙頁，如秋葉無人拾起。｜守望者：別把歲月寫成宿命；每一個清晨，都仍可有人敲門。',
      '記錄者：當警報終於有了聲音，夜色已逼近最後一頁。｜守望者：願疑慮不必先成鐵證；一絲不安，也配得上一盞查證的燈。',
      '記錄者：判決迴旋兩度，正義的路像潮水退而復來。｜守望者：程序不是忘川；它應讓每一個理由，在真實面前站穩。',
      '記錄者：無期與十六年之間，多少重量落在沉默的秤盤。｜守望者：把理由逐字照亮，才不讓憤怒或和解替孩子說完一切。',
      '記錄者：箭已送出，若沒有回信，責任仍在風裡漂泊。｜守望者：讓最後一環等到一句真話——我見過孩子，他此刻安全。',
      '記錄者：倘若照顧者的心已臨斷崖，求援會不會被誤作離棄？｜守望者：不，向人伸手不是背叛；在傷害之前停下，正是愛的勇氣。',
      '記錄者：幕將謝，七十一日仍不能倒流。｜守望者：那就把今夜的哀傷化作明日的門鈴；每次交付，都要有人回應。'
    ],
    en: [
      'RECORDER — O name, last star of this long night, may my pen never let thee fall. | GUARDIAN — Then let truth be moonlight; love invents no words for silence, but keeps watch beside the unanswered door.',
      'RECORDER — When wounds eclipse a name, remembrance is a rose bereft of scent. | GUARDIAN — Return the name to the child; let sorrow speak softly, and dignity be heard first.',
      'RECORDER — I would remember, yet fear the gaze itself may turn a blade. | GUARDIAN — True love knows where to stop; at truth’s threshold, restraint is also an embrace.',
      'RECORDER — A paper vow crossed adult hands, while the child drifted like a boat without reply. | GUARDIAN — Let no signature counterfeit a shore; the vow ends only when safe arrival is seen.',
      'RECORDER — Seventy-one dawns and dusks fell into the ledger like leaves no hand would lift. | GUARDIAN — Write not the days as fate; at every morning, someone might yet knock.',
      'RECORDER — When warning found a voice, night had reached the final page. | GUARDIAN — Let concern speak before it hardens into proof; the faintest doubt deserves a lamp of inquiry.',
      'RECORDER — Twice judgment turned, like a tide withdrawing and returning. | GUARDIAN — Procedure is no river of forgetting; it must make every reason stand before the truth.',
      'RECORDER — Between life and sixteen years, what weight lay upon the silent scale? | GUARDIAN — Light every reason, lest anger or settlement presume to finish the child’s voice.',
      'RECORDER — The arrow was sent, yet without reply responsibility wandered in the wind. | GUARDIAN — Keep the final circle open until someone can say: I saw the child; the child is safe.',
      'RECORDER — If a caregiver’s heart stands at the cliff, will asking for help be called desertion? | GUARDIAN — No. To reach for another is no betrayal; to stop before harm is love made brave.',
      'RECORDER — The curtain falls, and seventy-one days cannot flow backward. | GUARDIAN — Then turn tonight’s sorrow into tomorrow’s bell; let every handover receive an answer.'
    ],
    ja: [
      '記録者——ああ、名が長い夜の最後の星なら、この筆でもう落とすまい。｜見守る者——ならば真実を月明かりに。愛は沈黙の台詞を作らず、答えのない扉を見守る。',
      '記録者——傷が名を覆えば、記憶は香りを失った薔薇になる。｜見守る者——名を子どもへ返そう。悲しみは低く、尊厳は先に聞こえるように。',
      '記録者——覚えたい。けれど見ること自体が冷たい刃にならないか。｜見守る者——真の愛は止まる場所を知る。真実の敷居では、節度も抱擁だ。',
      '記録者——紙の誓いは大人の手を渡り、子どもは返事のない小舟となった。｜見守る者——署名を岸辺と呼ぶな。安全な到着を見て、初めて誓いは終わる。',
      '記録者——七十一の朝と夕べが、拾う手のない落葉のように帳簿へ沈む。｜見守る者——日々を宿命にするな。どの朝にも、まだ扉をたたく人は現れ得る。',
      '記録者——警告が声を得た時、夜は最後の頁まで来ていた。｜見守る者——懸念は証明になる前に話してよい。小さな不安にも、確認の灯を。',
      '記録者——裁判は二度めぐり、正義の道は引いて戻る潮のようだ。｜見守る者——手続は忘却の川ではない。すべての理由を真実の前に立たせるものだ。',
      '記録者——無期と十六年の間、沈黙の秤には何が載ったのか。｜見守る者——理由を一語ずつ照らそう。怒りや和解に、子どもの声を言い終えさせないために。',
      '記録者——矢印を送っても返事がなければ、責任は風の中を漂う。｜見守る者——最後の輪は、この言葉まで閉じるな。子どもを見た、いま安全だ。',
      '記録者——養育者の心が崖に立つ時、助けを求めれば見捨てたと言われるか。｜見守る者——いいえ。手を伸ばすことは裏切りではない。被害の前に止まるのは、勇気ある愛だ。',
      '記録者——幕は下り、七十一日は逆流しない。｜見守る者——ならば今夜の悲しみを明日の呼び鈴に。すべての引継ぎに返事を。'
    ]
  }[sceneLanguage];

  const clueSets = {
    zh: [
      [['日期', '2005.09.16 → 2005.11.26'], ['空欄', '下一次直接安全確認：公開記錄未見日期'], ['行動', '指定確認者、期限與回覆']],
      [['孩子', '2002.11.27 出生；正文只稱傅小弟'], ['界線', '不創作性格、遺言或私密細節'], ['記憶', '先記名字，再讀案件編號']],
      [['識別', '同一孩子曾以全名、隱名與公共稱呼出現'], ['最小化', '不公開住址、實景與親密傷勢'], ['行動', '以尊嚴與可核對性共同決定呈現']],
      [['交付', '2005.09.16 由張姓男子接手照顧'], ['缺口', '公開記錄未列下一次直接訪視日期'], ['閉環', '安全抵達需由人直接確認']],
      [['經過', '兩日期相隔 71 日；畫面不推測逐日事件'], ['風險', '幼兒失去日常公共接點'], ['早期保護', '安排定期直接確認']],
      [['送醫', '2005.11.26 送醫並於當晚死亡'], ['鑑定', '死因是長期累積的因果鏈，不是單一標籤'], ['通報', '讓「我擔心」足以啟動安全查證']],
      [['裁判', '6 件主要裁判、2 次最高法院發回'], ['原則', '發回要求證據、理由與法律適用受檢驗'], ['閱讀', '不把程序濃縮成一句「改判」']],
      [['前段', '一審、首次上訴及更一審均為無期徒刑'], ['轉折', '最高法院兩度撤銷發回'], ['結果', '公開歷審最後實體結果：16 年']],
      [['識別', '主動找出入監者需要照顧的未成年子女'], ['確認', '核對實際照顧者、地址與孩子現況'], ['回覆', '接手機關確認受理並安排追蹤']],
      [['110', '有立即危險或暴力正在發生'], ['119', '需要救護與緊急醫療'], ['113', '疑似虐待、疏忽或保護諮詢']],
      [['記錄', '保留日期、裁判與證據界線'], ['查證', '每次交付都安排直接安全確認'], ['承接', '有人明確回覆：已看見、已接手、會追蹤']]
    ],
    en: [
      [['Dates', '16 Sep 2005 → 26 Nov 2005'], ['Blank', 'Next direct safety check: no date found in the public record'], ['Action', 'Assign a verifier, deadline, and reply']],
      [['Child', 'Born 27 Nov 2002; called Little Fu throughout'], ['Boundary', 'No invented personality, last words, or intimate detail'], ['Memory', 'Put the name before the case number']],
      [['Identity', 'The same child appeared under a full, redacted, and public short name'], ['Minimum', 'No address, real-scene image, or intimate injury detail'], ['Action', 'Let dignity and verifiability govern display']],
      [['Handover', 'Chang took over care on 16 Sep 2005'], ['Gap', 'No next direct-visit date appears in the public record'], ['Closed loop', 'A person must verify safe arrival']],
      [['Elapsed', '71 days between the dates; the display does not invent daily events'], ['Risk', 'A very young child lost routine public contact'], ['Early protection', 'Schedule recurring direct checks']],
      [['Hospital', 'Taken to hospital and died on 26 Nov 2005'], ['Assessment', 'A cumulative causal chain, not one sensational label'], ['Report', 'Let “I am worried” begin a safety check']],
      [['Rulings', 'Six key rulings and two Supreme Court remands'], ['Principle', 'A remand tests evidence, reasons, and legal treatment'], ['Reading', 'Do not compress the path into “the appeal reduced it”']],
      [['Earlier', 'Life at first instance, first appeal, and first retrial'], ['Turn', 'Two Supreme Court reversals and remands'], ['Result', 'Last substantive result in public history: 16 years']],
      [['Identify', 'Proactively find minor children of people entering custody'], ['Verify', 'Check actual caregiver, address, and the child directly'], ['Reply', 'Receiving body confirms acceptance and follow-up']],
      [['110', 'Immediate danger or violence in progress'], ['119', 'Ambulance and emergency medical care'], ['113', 'Suspected abuse, neglect, or protection advice']],
      [['Record', 'Preserve dates, rulings, and evidentiary limits'], ['Verify', 'Make every handover trigger a direct safety check'], ['Receive', 'Someone replies: seen, accepted, and followed up']]
    ],
    ja: [
      [['日付', '2005.09.16 → 2005.11.26'], ['空欄', '次回の直接安全確認：公開記録に日付なし'], ['行動', '確認者、期限、返答を割り当てる']],
      [['子ども', '2002年11月27日生まれ。本文は傅小弟に統一'], ['境界', '性格、最期の言葉、私的情報を創作しない'], ['記憶', '事件番号より先に名前を置く']],
      [['同一性', '同じ子どもが実名、伏字、公共の短称で記された'], ['最小化', '住所、実景、親密な傷害情報を示さない'], ['行動', '尊厳と検証可能性で表現を決める']],
      [['引継ぎ', '2005年9月16日、張姓の男性が養育を引受け'], ['空白', '公開記録に次回の直接訪問日がない'], ['閉ループ', '安全な到着を人が直接確認する']],
      [['経過', '日付間は71日。各日の出来事を推測しない'], ['危険', '幼児が日常の公共接点を失った'], ['早期保護', '定期的な直接確認を設定する']],
      [['搬送', '2005年11月26日に搬送、同夜に死亡'], ['鑑定', '刺激的な一語ではなく、長期に累積した因果連鎖'], ['通報', '「心配だ」から安全確認を始める']],
      [['裁判', '主要6裁判、最高法院の差戻し2回'], ['原則', '差戻しは証拠、理由、法律適用を検証する'], ['読み方', '経路を「控訴で減刑」の一言にしない']],
      [['前半', '一審、最初の控訴、第1次差戻審は無期'], ['転換', '最高法院が2度破棄差戻し'], ['結果', '公開裁判履歴最後の実体判断：懲役16年']],
      [['把握', '収監される人の未成年の子を能動的に探す'], ['確認', '実際の養育者、住所、子ども本人を確認'], ['返答', '受領機関が引受けと追跡を確認する']],
      [['110', '差し迫った危険、進行中の暴力'], ['119', '救急車、緊急医療'], ['113', '虐待・ネグレクトの疑い、保護相談']],
      [['記録', '日付、裁判、証拠上の境界を残す'], ['確認', 'すべての引継ぎで直接安全確認を行う'], ['受領', '見た、引き受けた、追跡する、と誰かが返す']]
    ]
  }[sceneLanguage];

  function addTheatreLayers() {
    scenes.forEach((scene, index) => {
      const stage = scene.querySelector('.case-fu__stage');
      if (!stage || stage.querySelector('.case-fu__curtain')) return;

      const requestedDuration = Number(scene.dataset.sceneDuration || 0);
      const minimumDuration = index === 0 ? 19500 : index === scenes.length - 1 ? 16000 : 12000;
      const duration = Math.max(requestedDuration, minimumDuration);
      scene.dataset.sceneDuration = String(duration);
      scene.style.setProperty('--scene-duration', `${duration}ms`);

      const curtainLeft = document.createElement('i');
      curtainLeft.className = 'case-fu__curtain case-fu__curtain--left';
      curtainLeft.setAttribute('aria-hidden', 'true');
      const curtainRight = document.createElement('i');
      curtainRight.className = 'case-fu__curtain case-fu__curtain--right';
      curtainRight.setAttribute('aria-hidden', 'true');

      const cue = document.createElement('div');
      cue.className = 'case-fu__curtain-cue';
      cue.setAttribute('aria-hidden', 'true');
      cue.innerHTML = `<span>${theatreCopy.curtainOpen}</span><span>${theatreCopy.curtainClose}</span>`;

      const romance = document.createElement('div');
      romance.className = 'case-fu__romance';
      const romanceSmall = document.createElement('small');
      romanceSmall.textContent = theatreCopy.romanceLabel;
      const romanceText = document.createElement('p');
      romanceText.textContent = romanceLines[index] || romanceLines[romanceLines.length - 1];
      romance.append(romanceSmall, romanceText);

      const modern = document.createElement('div');
      modern.className = 'case-fu__modern-world';
      modern.setAttribute('aria-hidden', 'true');
      modern.innerHTML = '<i class="case-fu__fluorescent"></i><i class="case-fu__window"></i><i class="case-fu__noticeboard"></i><i class="case-fu__hallway"></i><i class="case-fu__walker"></i><i class="case-fu__paper-scrap case-fu__paper-scrap--a"></i><i class="case-fu__paper-scrap case-fu__paper-scrap--b"></i>';
      const modernLabel = document.createElement('span');
      modernLabel.className = 'case-fu__modern-label';
      modernLabel.textContent = theatreCopy.modernLabel;
      modern.appendChild(modernLabel);

      const focusPanel = document.createElement('div');
      focusPanel.className = 'case-fu__focus-panel';
      focusPanel.setAttribute('aria-live', 'polite');
      const focusTitle = document.createElement('b');
      const focusText = document.createElement('span');
      focusPanel.append(focusTitle, focusText);
      stage.append(modern, romance, focusPanel, cue, curtainLeft, curtainRight);

      const interaction = document.createElement('div');
      interaction.className = 'case-fu__interaction';
      const heading = document.createElement('div');
      heading.className = 'case-fu__interaction-head';
      const headingStrong = document.createElement('strong');
      headingStrong.textContent = theatreCopy.interactionLabel;
      const headingSmall = document.createElement('small');
      headingSmall.textContent = theatreCopy.interactionNote;
      heading.append(headingStrong, headingSmall);
      const buttons = document.createElement('div');
      buttons.className = 'case-fu__interaction-buttons';
      buttons.setAttribute('role', 'group');
      buttons.setAttribute('aria-label', theatreCopy.interactionLabel);

      const clues = clueSets[index] || clueSets[clueSets.length - 1];
      const showClue = clueIndex => {
        const clue = clues[clueIndex] || clues[0];
        focusTitle.textContent = clue[0];
        focusText.textContent = clue[1];
        scene.dataset.focus = String(clueIndex);
        buttons.querySelectorAll('[data-scene-focus]').forEach((button, buttonIndex) => {
          button.setAttribute('aria-pressed', String(buttonIndex === clueIndex));
        });
      };

      clues.forEach((clue, clueIndex) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'case-fu__focus-button';
        button.dataset.sceneFocus = String(clueIndex);
        button.setAttribute('aria-pressed', String(clueIndex === 0));
        button.disabled = true;
        button.textContent = clue[0];
        button.addEventListener('click', () => showClue(clueIndex));
        buttons.appendChild(button);
      });
      showClue(0);
      interaction.append(heading, buttons);
      const controls = scene.querySelector('.case-fu__scene-controls');
      if (controls) controls.insertAdjacentElement('afterend', interaction);
      else scene.appendChild(interaction);
    });
  }

  addTheatreLayers();

  const sceneCopy = {
    playing: body.dataset.scenePlaying || 'Scene playing',
    paused: body.dataset.scenePaused || 'Scene paused',
    complete: body.dataset.sceneComplete || 'Scene complete',
    skipped: body.dataset.sceneSkipped || 'Scene skipped'
  };

  function sceneStatus(scene, message) {
    const node = scene.querySelector('[data-scene-status]');
    if (node) node.textContent = message;
  }

  function clearSceneTimer(scene) {
    const timer = sceneTimers.get(scene);
    if (timer) window.clearTimeout(timer);
    sceneTimers.delete(scene);
  }

  function armSceneTimer(scene, duration) {
    clearSceneTimer(scene);
    const safeDuration = Math.max(0, Number(duration) || 0);
    scene.dataset.sceneRemaining = String(safeDuration);
    scene.dataset.sceneTimerStarted = String(performance.now());
    const timer = window.setTimeout(() => {
      if (scene.classList.contains('is-playing') && !scene.classList.contains('is-paused')) finishScene(scene);
    }, safeDuration + 120);
    sceneTimers.set(scene, timer);
  }

  function finishScene(scene, copy = sceneCopy.complete) {
    if (!scene) return;
    clearSceneTimer(scene);
    scene.classList.remove('is-playing', 'is-paused');
    scene.classList.add('is-complete');
    scene.dataset.scenePlayed = '1';
    delete scene.dataset.sceneRemaining;
    delete scene.dataset.sceneTimerStarted;
    scene.querySelectorAll('[data-scene-focus]').forEach(button => { button.disabled = false; });
    sceneStatus(scene, copy);
    if (activeScene === scene) activeScene = null;
  }

  function startScene(scene, { replay = false } = {}) {
    if (!scene || ((reducedMotion || saveData || shortLandscape) && !replay)) {
      finishScene(scene);
      return;
    }
    if (activeScene && activeScene !== scene) finishScene(activeScene);
    if (scene.dataset.scenePlayed === '1' && !replay) return;
    clearSceneTimer(scene);
    scene.classList.remove('is-playing', 'is-paused', 'is-complete');
    scene.querySelectorAll('[data-scene-focus]').forEach(button => { button.disabled = true; });
    // Force the CSS animations to restart only after an explicit replay.
    if (replay) void scene.offsetWidth;
    scene.classList.add('is-playing');
    scene.dataset.scenePlayed = '1';
    activeScene = scene;
    sceneStatus(scene, sceneCopy.playing);
    const duration = Number(scene.dataset.sceneDuration || 5000);
    armSceneTimer(scene, duration);
  }

  document.addEventListener('click', event => {
    const replay = event.target.closest('[data-scene-replay]');
    if (replay) {
      startScene(replay.closest('[data-fu-scene]'), { replay: true });
      return;
    }
    const pause = event.target.closest('[data-scene-pause]');
    if (pause) {
      const scene = pause.closest('[data-fu-scene]');
      const paused = !scene.classList.contains('is-paused');
      scene.classList.toggle('is-paused', paused);
      if (paused) {
        const started = Number(scene.dataset.sceneTimerStarted || performance.now());
        const remaining = Number(scene.dataset.sceneRemaining || scene.dataset.sceneDuration || 5000);
        scene.dataset.sceneRemaining = String(Math.max(0, remaining - (performance.now() - started)));
        clearSceneTimer(scene);
      } else if (scene.classList.contains('is-playing')) {
        armSceneTimer(scene, Number(scene.dataset.sceneRemaining || 0));
      }
      pause.setAttribute('aria-pressed', String(paused));
      pause.textContent = paused ? (pause.dataset.resumeLabel || 'Resume') : (pause.dataset.pauseLabel || 'Pause');
      sceneStatus(scene, paused ? sceneCopy.paused : sceneCopy.playing);
      return;
    }
    const skip = event.target.closest('[data-scene-skip]');
    if (skip) finishScene(skip.closest('[data-fu-scene]'), sceneCopy.skipped);
  });

  if (!reducedMotion && !saveData && !shortLandscape && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const scene = entry.target;
        if (scene.dataset.sceneManual !== 'true') startScene(scene);
        observer.unobserve(scene);
      });
    }, { threshold: 0.28 });
    scenes.forEach(scene => observer.observe(scene));
  } else {
    scenes.forEach(scene => finishScene(scene));
  }

  document.querySelectorAll('[data-fu-days]').forEach(rail => {
    rail.setAttribute('aria-hidden', 'true');
    for (let index = 0; index < 72; index += 1) rail.appendChild(document.createElement('span'));
  });

  const audioA = document.querySelector('[data-fu-audio="a"]');
  const audioB = document.querySelector('[data-fu-audio="b"]');
  const audioMap = { a: audioA, b: audioB };
  const volumeMap = { a: 0.22, b: 0.20 };
  const trackButtons = [...document.querySelectorAll('[data-audio-select]')];
  const audioState = document.querySelector('[data-audio-state]');
  const audioDock = document.querySelector('[data-audio-dock]');
  const continueButton = document.querySelector('[data-audio-continue]');
  let audioEnabled = false;
  let currentTrack = 'a';
  let fadeToken = 0;
  let helpLocked = false;
  let sensitiveLocked = false;

  const audioCopy = {
    off: body.dataset.audioOff || 'Original music is off',
    loading: body.dataset.audioLoading || 'Loading original music…',
    playing: body.dataset.audioPlaying || 'Now playing',
    sensitive: body.dataset.audioSensitive || 'Music paused for sensitive content',
    help: body.dataset.audioHelp || 'Music remains off in the help section',
    error: body.dataset.audioError || 'Music could not be loaded; reading is unaffected'
  };

  function setAudioState(message) {
    if (audioState) audioState.textContent = message;
  }

  function trackTitle(key) {
    const button = trackButtons.find(item => item.dataset.audioSelect === key);
    return button ? (button.dataset.trackTitle || button.textContent.trim()) : key;
  }

  function paintTrackButtons(active = '') {
    trackButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.audioSelect === active)));
  }

  function ramp(audio, from, to, duration = 900) {
    if (!audio) return Promise.resolve();
    const token = ++fadeToken;
    const start = performance.now();
    audio.volume = Math.max(0, Math.min(1, from));
    return new Promise(resolve => {
      const frame = now => {
        if (token !== fadeToken) return resolve();
        const progress = Math.min(1, (now - start) / Math.max(1, duration));
        const eased = Math.sin(progress * Math.PI / 2);
        audio.volume = Math.max(0, Math.min(1, from + (to - from) * eased));
        if (progress < 1) requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });
  }

  async function stopAll(duration = 800, pause = true) {
    const playing = Object.values(audioMap).filter(Boolean).filter(audio => !audio.paused);
    await Promise.all(playing.map(audio => ramp(audio, audio.volume, 0, duration)));
    if (pause) playing.forEach(audio => audio.pause());
    paintTrackButtons('');
  }

  async function playTrack(key, { crossfade = true, restart = false } = {}) {
    const next = audioMap[key];
    if (!next) return;
    helpLocked = false;
    sensitiveLocked = false;
    if (continueButton) continueButton.hidden = true;
    setAudioState(audioCopy.loading);
    try {
      if (restart || next.ended || !Number.isFinite(next.currentTime)) next.currentTime = 0;
      next.volume = 0;
      await next.play();
      const oldKey = currentTrack;
      const old = audioMap[oldKey];
      currentTrack = key;
      audioEnabled = true;
      paintTrackButtons(key);
      if (old && old !== next && !old.paused && crossfade) {
        const token = ++fadeToken;
        const start = performance.now();
        const duration = 2600;
        const oldStart = old.volume;
        await new Promise(resolve => {
          const frame = now => {
            if (token !== fadeToken) return resolve();
            const p = Math.min(1, (now - start) / duration);
            old.volume = oldStart * Math.cos(p * Math.PI / 2);
            next.volume = volumeMap[key] * Math.sin(p * Math.PI / 2);
            if (p < 1) requestAnimationFrame(frame);
            else resolve();
          };
          requestAnimationFrame(frame);
        });
        old.pause();
        old.volume = 0;
      } else {
        if (old && old !== next) old.pause();
        await ramp(next, next.volume, volumeMap[key], 1200);
      }
      setAudioState(`${audioCopy.playing}: ${trackTitle(key)}`);
    } catch (_) {
      audioEnabled = false;
      paintTrackButtons('');
      setAudioState(audioCopy.error);
    }
  }

  trackButtons.forEach(button => button.addEventListener('click', async () => {
    const key = button.dataset.audioSelect;
    if (audioEnabled && currentTrack === key && audioMap[key] && !audioMap[key].paused) {
      await stopAll();
      audioEnabled = false;
      setAudioState(audioCopy.off);
      return;
    }
    await playTrack(key, { crossfade: audioEnabled, restart: !audioEnabled });
  }));

  Object.entries(audioMap).forEach(([key, audio]) => {
    if (!audio) return;
    audio.addEventListener('ended', () => {
      if (!audioEnabled || helpLocked || sensitiveLocked || currentTrack !== key) return;
      audio.currentTime = 0;
      audio.volume = 0;
      audio.play().then(() => ramp(audio, 0, volumeMap[key], 1500)).catch(() => setAudioState(audioCopy.error));
    });
  });

  async function muteForSensitive() {
    if (!audioEnabled) return;
    sensitiveLocked = true;
    await stopAll(800);
    setAudioState(audioCopy.sensitive);
  }

  function resumeAfterSensitive() {
    if (!audioEnabled || helpLocked) return;
    window.setTimeout(() => {
      if (!sensitiveLocked || helpLocked) return;
      sensitiveLocked = false;
      playTrack(currentTrack, { crossfade: false, restart: false });
    }, 1500);
  }

  document.querySelectorAll('[data-sensitive-details]').forEach(details => {
    details.addEventListener('toggle', () => {
      if (details.open) muteForSensitive();
      else resumeAfterSensitive();
    });
  });

  async function enterHelp() {
    if (!audioEnabled || helpLocked) return;
    helpLocked = true;
    await stopAll(800);
    setAudioState(audioCopy.help);
    if (continueButton) continueButton.hidden = false;
  }

  if ('IntersectionObserver' in window) {
    const help = document.querySelector('[data-help-zone]');
    if (help) {
      const helpObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) enterHelp(); });
      }, { threshold: 0.22 });
      helpObserver.observe(help);
    }
  }

  if (continueButton) continueButton.addEventListener('click', () => {
    helpLocked = false;
    continueButton.hidden = true;
    playTrack('a', { crossfade: false, restart: false });
  });

  const opening = document.querySelector('[data-opening-scene]');
  const heroTitle = document.querySelector('#case-fu-title');
  document.querySelectorAll('[data-opening-action]').forEach(button => {
    button.addEventListener('click', async () => {
      const action = button.dataset.openingAction;
      if (action === 'music') await playTrack('a', { crossfade: false, restart: true });
      if (action === 'skip') finishScene(opening, sceneCopy.skipped);
      else startScene(opening, { replay: true });
      if (heroTitle) {
        heroTitle.setAttribute('tabindex', '-1');
        heroTitle.focus({ preventScroll: true });
      }
    });
  });

  const dockToggle = document.querySelector('[data-audio-collapse]');
  if (dockToggle && audioDock) dockToggle.addEventListener('click', () => {
    const collapsed = audioDock.classList.toggle('is-collapsed');
    dockToggle.setAttribute('aria-expanded', String(!collapsed));
  });

  document.querySelectorAll('[data-fu-print]').forEach(button => button.addEventListener('click', () => window.print()));

  document.addEventListener('visibilitychange', () => {
    if (!audioEnabled) return;
    const current = audioMap[currentTrack];
    if (!current) return;
    if (document.hidden) current.pause();
    else if (!helpLocked && !sensitiveLocked) current.play().catch(() => {});
  });
})();
