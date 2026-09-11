(()=>{
  const selectors=['.day1-transcript > article','.day2-transcript > article','.day3-transcript > article','.dialogue-list > details','.qa-list > article','#day6Record > article','#day6Record > details','#recordSections > article','#recordSections > details'];
  const normalized=value=>(value||'').replace(/\s+/g,'').replace(/[｜：:，。、「」『』（）()·]/g,'');
  const grams=value=>{const text=normalized(value),result=new Set();for(let i=0;i<text.length-1;i+=1)result.add(text.slice(i,i+2));return result;};
  const score=(row,box)=>{const a=grams(row),b=grams(box);let hits=0;a.forEach(value=>{if(b.has(value))hits+=1;});return a.size?hits/a.size:0;};
  const issueRules=[
    {pattern:/回到6號3樓（丙地）/,tone:'conflict',label:'地點代號疑義',note:'原紀錄前文將6號3樓標為乙地；此處卻記為丙地，應核對正式筆錄，不自行更正。'},
    {pattern:/沒聽過A童講話/,tone:'conflict',label:'前後說法待核',note:'同日較前段另記載證人聽見A童說話；本列又稱沒聽過，可能有漏題、錯置或語境差異。'},
    {pattern:/訂頭套的時間|9、10月時.*頭套|11月底、12月初.*頭套/s,tone:'conflict',label:'時間與物件待核',note:'原紀錄對頭套的訂購、看見與事件時間有不同記載，須分開核對是否為同一事件與同一物件。'},
    {pattern:/回答／右欄空白|回答欄空白/,tone:'scope',label:'原紀錄未載回答',note:'公開來源沒有記下答案；不得以相鄰列或摘要自行補成承認、否認或沉默。'},
    {pattern:/被告未答話|不語/,tone:'scope',label:'明載未作答',note:'此處僅能確認原紀錄記載未作答，不能單憑沉默推論事實成立。'},
    {pattern:/不記得|沒有印象|不確定|不清楚|不知道/,tone:'scope',label:'記憶／認知範圍',note:'回答明確限制證人的記憶或認知範圍；「不知道」不等於事件沒有發生。'},
    {pattern:/餘光|聽說|聽到|聽過|轉述|.*說去公園/,tone:'scope',label:'觀察基礎',note:'須區分親眼所見、餘光、聽聞及他人轉述，證明基礎並不相同。'},
    {pattern:/提示.*(?:照片|筆錄|對話|甲證|乙證)|(?:照片|筆錄|對話紀錄).*提示/s,tone:'source',label:'來源核對',note:'法庭提示資料是核對記憶與說法的過程；被提示不等於內容已由法院採信。'}
  ];
  const keyPattern=/跌倒|罰站|綑綁|綁住|固定|傷口|瘀傷|出血|骨折|哭|頭套|毛巾|浴巾|澡盆|餵食|毆打|打人|揍|死亡|死因|營養不良|自傷|擦藥|冰敷/;
  const speakerCopy=()=>{
    const lang=(document.documentElement.lang||'zh-Hant').toLowerCase();
    if(lang.startsWith('en'))return{asker:'Questioner',answerer:'Respondent',record:'Court record',unrecorded:'not identified in source'};
    if(lang.startsWith('ja'))return{asker:'質問者',answerer:'回答者',record:'法廷記録',unrecorded:'原記録に記載なし'};
    if(lang.includes('hans')||lang.startsWith('zh-cn'))return{asker:'提问者',answerer:'回答者',record:'庭审记录',unrecorded:'原始记录未载明'};
    return{asker:'提問者',answerer:'回答者',record:'庭審紀錄',unrecorded:'原始紀錄未載明'};
  };
  const tidySpeaker=value=>(value||'').replace(/\s+/g,' ').trim();
  const questionerFrom=value=>{
    const match=tidySpeaker(value).match(/(?:^|[。；;])\s*((?:檢察官|检察官|審判長|审判长|陪席法官|受命法官|國民法官(?:（[^）]+）)?|国民法官(?:（[^）]+）)?|[^。；;]{1,24}?辯護人|[^。；;]{1,24}?辩护人|Prosecutor|Presiding Judge|Associate Judge|Commissioned Judge|Citizen Judge(?:\s*\([^)]*\))?|[^.;]{1,40}?counsel|検察官|裁判長|陪席裁判官|受命裁判官|国民裁判官(?:（[^）]+）)?|[^。；;]{1,24}?弁護人)(?:主詰問|反詰問|覆主詰問|詢問|询问|質問|尋問| examination| asks?))/i);
    return match?match[1].replace(/(?:主詰問|反詰問|覆主詰問|詢問|询问|質問|尋問| examination| asks?).*$/i,'').trim():'';
  };
  const respondentFrom=value=>{
    const match=tidySpeaker(value).match(/^((?:證人|证人|被告|鑑定人|鉴定人|Witness|Defendant|Expert witness|証人|被告人|鑑定人)\s*[^。；;]{0,40}?)(?:回答|答复|答覆| answers?| responds?|が回答)(?:\s|$)/i);
    return match?match[1].trim():'';
  };
  const labelSpeakers=section=>{
    const copy=speakerCopy();
    section.querySelectorAll('.pw-verbatim-rows').forEach(group=>{
      let questioner='',respondent='';
      group.querySelectorAll(':scope > .pw-verbatim-row').forEach(row=>{
        const left=row.querySelector('.pw-verbatim-left'),right=row.querySelector('.pw-verbatim-right');
        if(!left||!right)return;
        const leftText=left.querySelector('p')?.innerText||'';
        const nextQuestioner=questionerFrom(leftText),nextRespondent=respondentFrom(right.querySelector('p')?.innerText||'');
        if(nextQuestioner)questioner=nextQuestioner;
        if(nextRespondent)respondent=nextRespondent;
        const procedural=!nextQuestioner&&!nextRespondent&&/休庭|入庭|退庭|異議|异议|裁定|程序|recess|adjourn|objection|休廷|入廷|退廷/.test(leftText);
        const leftLabel=left.querySelector('small'),rightLabel=right.querySelector('small');
        if(leftLabel){leftLabel.classList.add('pw-speaker-label');leftLabel.textContent=procedural?copy.record:`${copy.asker}｜${questioner||copy.unrecorded}`;}
        if(rightLabel){rightLabel.classList.add('pw-speaker-label');rightLabel.textContent=procedural?copy.record:`${copy.answerer}｜${respondent||copy.unrecorded}`;}
      });
    });
  };
  const annotate=row=>{
    const content=row.innerText,matched=issueRules.find(rule=>rule.pattern.test(content));
    if(matched){
      row.classList.add(`pw-highlight-${matched.tone}`);
      const note=document.createElement('aside');note.className=`pw-issue-note pw-issue-${matched.tone}`;
      note.innerHTML=`<strong>${matched.label}</strong><span>${matched.note}</span>`;row.append(note);
    }else if(keyPattern.test(content))row.classList.add('pw-highlight-key');
  };
  const findBoxes=scope=>{for(const selector of selectors){const boxes=[...scope.querySelectorAll(selector)].filter(box=>!box.closest('.pw-verbatim-source'));if(boxes.length)return boxes;}return [];};
  const integrate=(section,attempt=0)=>{
    labelSpeakers(section);
    const scope=section.parentElement,boxes=findBoxes(scope);
    if(!boxes.length&&attempt<120){requestAnimationFrame(()=>integrate(section,attempt+1));return;}
    if(!boxes.length)return;
    const rows=[...section.querySelectorAll('.pw-verbatim-row')],boxTexts=boxes.map(box=>box.innerText);
    rows.forEach((row,index)=>{
      let best=-1,bestScore=0;
      boxTexts.forEach((text,boxIndex)=>{const value=score(row.innerText,text);if(value>bestScore){bestScore=value;best=boxIndex;}});
      if(bestScore<.12)best=Math.min(boxes.length-1,Math.floor(index*boxes.length/Math.max(rows.length,1)));
      let inline=boxes[best].querySelector(':scope > .pw-inline-source');
      if(!inline){inline=document.createElement('div');inline.className='pw-inline-source';inline.innerHTML='<div class="pw-inline-head"><small>ORIGINAL RECORD · UNABRIDGED</small><h4>原始紀錄逐列全文</h4><p>本章原始問答完整收錄；編輯文字僅供導讀。</p></div>';boxes[best].append(inline);}
      annotate(row);inline.append(row);
    });
    scope.querySelectorAll(':scope > .pw-editorial-label').forEach(node=>node.remove());
    document.querySelectorAll('a[href="#verbatim-source"]').forEach(link=>link.remove());
    section.remove();
  };
  document.querySelectorAll('.pw-verbatim-source').forEach(section=>integrate(section));
})();
