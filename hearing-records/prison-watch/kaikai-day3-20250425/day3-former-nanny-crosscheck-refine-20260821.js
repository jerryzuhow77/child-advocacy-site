(() => {
  'use strict';
  if (!document.body.classList.contains('day3-page') || window.__day3CrosscheckRefined) return;
  window.__day3CrosscheckRefined = true;

  let savedLang = '';
  try { savedLang = localStorage.getItem('siteLang') || ''; } catch (_) {}
  const hans = new URLSearchParams(location.search).get('lang') === 'zh-Hans'
    || document.documentElement.lang === 'zh-Hans' || savedLang === 'zh-Hans';

  const copy = hans ? {
    title: '两位前保姆证词｜7组时间、记忆与来源核对点',
    intro: '本区整理原始旁听记录中可直接对照的日期差异、用语张力、记忆与记录落差，以及跨证人的观察差异。标示“差异”不代表护童行动联盟认定证人说谎或构成伪证，也不代替法院对证明力与事实的判断。',
    type: '差异性质｜', cannot: '目前不能推论｜', open: '回到完整问答',
    limits: [
      '在正式笔录、契约或安置记录核对前，不能自行选择其中一套，也不能据此精算交接天数。',
      '不能由多次就诊或单一数值自行诊断疾病，也不能把“未被告知异常”写成客观上没有任何医疗问题。',
      '不能只因都使用“僵硬／僵直”就认定互相矛盾，仍需厘清动作、频率、月龄与医疗意义。',
      '不能由证人曾向社工说明，就推定后手照顾者本人已收到全部内容；也不能反向推定完全没有交接。',
      '不能因“整体还好”抹去曾观察到的反应，也不能把追踪建议直接写成已确诊发展异常。',
      '不能把不同月龄的观察写成谁推翻谁；应先确认时间、问题概念与孩子当时的发展状态。'
    ],
    birthTag: '07 · 两位前保姆／跨证人', birthTitle: '两名前保姆对“胎记”的描述不同',
    birthA: '萧○香被问是否有胎记或其他印记时，回答“没有”。',
    birthB: '周○被问洗澡时有无胎记或疤痕时，回答“屁股有胎记，手脚没有”。',
    birthType: '两名证人对是否曾见臀部胎记留下不同描述，但照顾月龄、期间与记忆条件不同。',
    birthCannot: '不能仅凭两句摘要判定谁说错；应与婴儿期照片、健检／宝宝手册、正式笔录及观察部位核对。',
    timelineTitle: '先把三段照顾时间放回原位',
    timelineIntro: '三位证人描述的不是同一个月龄或同一段生活。跨时期对照可以呈现状态变化，但不能把不同阶段的“有／没有看见”直接当成同日矛盾。',
    stages: [
      ['2022.05.04–06.29','萧○香','约4至5个月大｜婴儿期短期照顾','手较紧、哭泣与医疗追踪建议；同时称无特殊照顾困难。'],
      ['2022.06月底–2023.08月底','周○','长期全日照顾基准｜起止日待核','饮食、行走、语言、口腔、身体印记与交接；同段日期有两套答案。'],
      ['2023.09.27–12月初','Mira','后期家中生活的零散观察','站立、衣着、玩耍、伤势用语、声音与时间估算；观察基础需逐项区分。']
    ]
  } : {
    title: '兩位前保母證詞｜7組時間、記憶與來源核對點',
    intro: '本區整理原始旁聽紀錄中可直接對照的日期差異、用語張力、記憶與紀錄落差，以及跨證人的觀察差異。標示「差異」不代表護童行動聯盟認定證人說謊或構成偽證，也不代替法院對證明力與事實的判斷。',
    type: '差異性質｜', cannot: '目前不能推論｜', open: '回到完整問答',
    limits: [
      '在正式筆錄、契約或安置紀錄核對前，不能自行選擇其中一套，也不能據此精算交接天數。',
      '不能由多次看診或單一數值自行診斷疾病，也不能把「未被告知異常」寫成客觀上沒有任何醫療問題。',
      '不能只因都使用「僵硬／僵直」就認定互相矛盾，仍需釐清動作、頻率、月齡與醫療意義。',
      '不能由證人曾向社工說明，就推定後手照顧者本人已收到全部內容；也不能反向推定完全沒有交接。',
      '不能因「整體還好」抹去曾觀察到的反應，也不能把追蹤建議直接寫成已確診發展異常。',
      '不能把不同月齡的觀察寫成誰推翻誰；應先確認時間、問題概念與孩子當時的發展狀態。'
    ],
    birthTag: '07 · 兩位前保母／跨證人', birthTitle: '兩名前保母對「胎記」的描述不同',
    birthA: '蕭○香被問是否有胎記或其他印記時，回答「沒有」。',
    birthB: '周○被問洗澡時有無胎記或疤痕時，回答「屁股有胎記，手腳沒有」。',
    birthType: '兩名證人對是否曾見臀部胎記留下不同描述，但照顧月齡、期間與記憶條件不同。',
    birthCannot: '不能僅憑兩句摘要判定誰說錯；應與嬰兒期照片、健檢／寶寶手冊、正式筆錄及觀察部位核對。',
    timelineTitle: '先把三段照顧時間放回原位',
    timelineIntro: '三位證人描述的不是同一個月齡或同一段生活。跨時期對照可以呈現狀態變化，但不能把不同階段的「有／沒有看見」直接當成同日矛盾。',
    stages: [
      ['2022.05.04–06.29','蕭○香','約4至5個月大｜嬰兒期短期照顧','手較緊、哭泣與醫療追蹤建議；同時稱無特殊照顧困難。'],
      ['2022.06月底–2023.08月底','周○','長期全日照顧基準｜起訖日待核','飲食、行走、語言、口腔、身體印記與交接；同段日期有兩套答案。'],
      ['2023.09.27–12月初','Mira','後期家中生活的零散觀察','站立、衣著、玩耍、傷勢用語、聲音與時間估算；觀察基礎需逐項區分。']
    ]
  };

  const title = document.querySelector('#formerNannyCrosscheckTitle');
  if (title) title.textContent = copy.title;
  const intro = title?.closest('.day3-section-head')?.querySelector('p');
  if (intro) intro.textContent = copy.intro;

  document.querySelectorAll('.day3-nanny-card').forEach((card, index) => {
    const readingLabel = card.querySelector('.day3-nanny-reading b');
    if (readingLabel) readingLabel.textContent = copy.type;
    if (card.querySelector('.day3-nanny-limit')) return;
    const line = document.createElement('p');
    line.className = 'day3-nanny-limit';
    line.innerHTML = `<b>${copy.cannot}</b>${copy.limits[index] || ''}`;
    card.insertBefore(line, card.querySelector('.day3-nanny-links') || null);
  });

  const grid = document.querySelector('.day3-nanny-grid');
  if (grid && !document.querySelector('#nanny-birthmark-crosscheck')) {
    const card = document.createElement('article');
    card.className = 'day3-nanny-card day3-reveal';
    card.id = 'nanny-birthmark-crosscheck';
    card.innerHTML = `<span>${copy.birthTag}</span><h3>${copy.birthTitle}</h3>
      <p class="day3-nanny-evidence"><b>${hans ? '记录 A｜' : '記錄 A｜'}</b>${copy.birthA}</p>
      <p class="day3-nanny-evidence"><b>${hans ? '记录 B｜' : '記錄 B｜'}</b>${copy.birthB}</p>
      <p class="day3-nanny-reading"><b>${copy.type}</b>${copy.birthType}</p>
      <p class="day3-nanny-limit"><b>${copy.cannot}</b>${copy.birthCannot}</p>
      <div class="day3-nanny-links"><a href="#day3-chapter-04">${copy.open}・${hans ? '周○法官提问' : '周○法官提問'}</a><a href="#day3-chapter-05">${copy.open}・${hans ? '萧○香法官提问' : '蕭○香法官提問'}</a></div>`;
    grid.append(card);
  }

  const sourceNote = document.querySelector('.day3-nanny-source-note');
  if (sourceNote && !document.querySelector('.day3-care-stage-panel')) {
    const panel = document.createElement('section');
    panel.className = 'day3-care-stage-panel day3-reveal';
    panel.setAttribute('aria-labelledby', 'day3CareStageTitle');
    panel.innerHTML = `<h3 id="day3CareStageTitle">${copy.timelineTitle}</h3><p>${copy.timelineIntro}</p><div>${copy.stages.map(([date,name,scope,text]) => `<article><time>${date}</time><b>${name}</b><span>${scope}</span><p>${text}</p></article>`).join('')}</div>`;
    sourceNote.before(panel);
  }

  const style = document.createElement('style');
  style.textContent = `
    .day3-nanny-limit{margin:0 0 16px;padding:12px 14px;border-left:3px solid rgba(171,128,69,.48);border-radius:0 12px 12px 0;background:rgba(250,246,234,.88);font-size:.93rem;line-height:1.72;color:#574f43}.day3-nanny-limit b{color:#795d31}
    .day3-care-stage-panel{position:relative;z-index:1;margin-top:22px;padding:clamp(20px,3vw,28px);border:1px solid rgba(72,96,90,.17);border-radius:25px;background:rgba(255,255,255,.72)}
    .day3-care-stage-panel h3{margin:0 0 6px;color:#354c46;font-size:clamp(1.18rem,2.2vw,1.52rem)}.day3-care-stage-panel>p{margin:0 0 18px;color:#56635f;line-height:1.75}
    .day3-care-stage-panel>div{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.day3-care-stage-panel article{position:relative;padding:17px 16px;border-radius:18px;background:rgba(240,246,243,.88);border:1px solid rgba(72,96,90,.14)}
    .day3-care-stage-panel article::before{content:"";position:absolute;left:18px;top:-7px;width:13px;height:13px;border-radius:50%;background:#56786e;box-shadow:0 0 0 5px rgba(86,120,110,.13)}
    .day3-care-stage-panel time{display:block;margin-bottom:6px;color:#6b474e;font-size:.79rem;font-weight:850}.day3-care-stage-panel b{display:block;color:#38554d;font-size:1.04rem}.day3-care-stage-panel span{display:block;margin:5px 0 7px;color:#50615c;font-size:.86rem;font-weight:750}.day3-care-stage-panel article p{margin:0;color:#5c6662;font-size:.87rem;line-height:1.67}
    @media(max-width:900px){.day3-care-stage-panel>div{grid-template-columns:1fr}}
  `;
  document.head.append(style);
})();
