(()=>{
const url='https://cn.globalprotectionwall.com/alliance-dialogues';
const image='https://chen-witness-evidence-timeline.jerryzuhow77.chatgpt.site/shuimo-embroidery-mobile.png';
const lang=document.documentElement.lang||'zh-Hant';
const texts=lang.startsWith('ja')?['児童福祉連盟の内部で何が語られたか','多角的考察｜中国語原文','内部メッセージ・法廷での説明・被告人の供述を時系列で照合。']:lang.startsWith('en')?['What did CWLF staff say?','Multiple Perspectives · Chinese source text','Internal messages, courtroom explanations and defendant statements in chronological order.']:lang==='zh-Hans'?['儿盟内部人员说了什么？','多元观察','内部讯息、庭上勘验与被告陈述，依时间轴交叉核对。']:['兒盟內部人員說了什麼？','多元觀察','內部訊息、庭上勘驗與被告陳述，依時間軸交叉核對。'];
function card(kind){const a=document.createElement('a');a.href=url;a.className=kind;a.dataset.allianceEntry='true';const img=document.createElement('img');img.src=image;img.alt=texts[0];img.loading='lazy';const copy=document.createElement('span');copy.innerHTML='<small></small><strong></strong><em></em>';copy.children[0].textContent='09.05 · '+texts[1];copy.children[1].textContent=texts[0];copy.children[2].textContent=texts[2];if(kind==='special-feature-menu-card'){const art=document.createElement('span');art.className='special-feature-menu-art';art.append(img);copy.className='special-feature-menu-copy';a.append(art,copy);}else a.append(img,copy);return a;}
function insert(){const track=document.querySelector('.home-pinned-reports-track');if(track&&!track.querySelector('[data-alliance-entry]'))track.prepend(card('home-pinned-report-card'));const group=document.querySelector('[id^="specialFeatureSocial"]');if(group&&!group.querySelector('[data-alliance-entry]'))group.prepend(card('special-feature-menu-card'));}
insert();window.addEventListener('load',insert,{once:true});
})();
