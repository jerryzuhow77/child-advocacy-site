(() => {
  'use strict';
  if (!document.body.classList.contains('day2-page') || window.__day2CrosscheckRefined) return;
  window.__day2CrosscheckRefined = true;

  let savedLang = '';
  try { savedLang = localStorage.getItem('siteLang') || ''; } catch (_) {}
  const hans = new URLSearchParams(location.search).get('lang') === 'zh-Hans'
    || document.documentElement.lang === 'zh-Hans' || savedLang === 'zh-Hans';

  const title = document.querySelector('#miraCrosscheckTitle');
  if (title) title.textContent = hans
    ? 'Mira 证词｜6组前后说法与来源核对点'
    : 'Mira 證詞｜6組前後說法與來源核對點';

  const limits = hans ? [
    '不能把这句话简化为证人认定当时完全没有任何伤势，也不能由此判定痕迹形成时间。',
    '未核对警询原笔录、录音及完整讯问脉络前，不能自行判定哪一个版本较可信。',
    '不能以证人未曾听见，直接推论孩子在所有时间都没有语言能力。',
    '未核对庭讯录音与正式笔录前，不能直接断定证人前后矛盾，或自行补入“平日”等限定。',
    '不能把任一离开时间或“一小时”写成精确计时结果，仍须与影片、信息及其他在场资料核对。',
    '不能把由设备声音、表情、语气或环境线索得出的判断，写成证人亲眼看见的事实。'
  ] : [
    '不能把這句簡化成證人認定當時完全沒有任何傷勢，也不能由此判定痕跡形成時間。',
    '未核對警詢原筆錄、錄音及完整訊問脈絡前，不能自行判定哪一個版本較可信。',
    '不能以證人未曾聽見，直接推論孩子在所有時間都沒有語言能力。',
    '未核對庭訊錄音與正式筆錄前，不能直接斷定證人前後矛盾，或自行補入「平日」等限定。',
    '不能把任一離開時間或「一小時」寫成精確計時結果，仍須與影片、訊息及其他在場資料核對。',
    '不能把由設備聲音、表情、語氣或環境線索得出的判斷，寫成證人親眼看見的事實。'
  ];

  document.querySelectorAll('.day2-crosscheck-card').forEach((card, index) => {
    const readingLabel = card.querySelector('.day2-crosscheck-reading b');
    if (readingLabel) readingLabel.textContent = hans ? '差异性质｜' : '差異性質｜';
    if (card.querySelector('.day2-crosscheck-limit')) return;
    const line = document.createElement('p');
    line.className = 'day2-crosscheck-limit';
    line.innerHTML = `<b>${hans ? '目前不能推论｜' : '目前不能推論｜'}</b>${limits[index] || ''}`;
    card.insertBefore(line, card.querySelector('.day2-crosscheck-links') || null);
  });

  const style = document.createElement('style');
  style.textContent = `.day2-crosscheck-limit{margin:0 0 16px;padding:12px 14px;border-left:3px solid rgba(171,128,69,.48);border-radius:0 12px 12px 0;background:rgba(250,246,234,.88);font-size:.93rem;line-height:1.72;color:#574f43}.day2-crosscheck-limit b{color:#795d31}`;
  document.head.append(style);
})();
