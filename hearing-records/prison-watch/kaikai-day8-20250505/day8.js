(()=>{"use strict";
document.documentElement.classList.add("js-ready");
const menu=document.getElementById("menuButton"),nav=document.getElementById("siteNav");
if(menu&&nav){menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open))});nav.addEventListener("click",e=>{if(e.target.closest("a")){nav.classList.remove("open");menu.setAttribute("aria-expanded","false")}})}
const reveals=[...document.querySelectorAll(".reveal")];
if("IntersectionObserver"in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in-view");io.unobserve(e.target)}}),{rootMargin:"0px 0px -8% 0px",threshold:.08});reveals.forEach(el=>io.observe(el))}else reveals.forEach(el=>el.classList.add("in-view"));
const cards=[...document.querySelectorAll(".qa-card")],search=document.getElementById("qaSearch"),count=document.getElementById("qaCount"),empty=document.getElementById("qaEmpty"),buttons=[...document.querySelectorAll(".filter-buttons button")];
const qaList=document.getElementById("qaList"),chapterDefs=[
  {key:"family",prefixes:["family"],title:"第一章｜A童外婆完整證詞"},
  {key:"doctor-caixuan",prefixes:["doctor-caixuan"],title:"第二章｜劉彩萱辯方詰問徐堅棋醫師"},
  {key:"doctor-ruolin",prefixes:["doctor-ruolin"],title:"第三章｜劉若琳辯方詰問徐堅棋醫師"},
  {key:"doctor-prosecutor",prefixes:["doctor-prosecutor"],title:"第四章｜檢察官詰問徐堅棋醫師"},
  {key:"doctor-judge",prefixes:["doctor-judge"],title:"第五章｜審判長詢問徐堅棋醫師"}
];
const crossrefMap={
  "02":[["#family-xref-placement","返回｜出養與照顧轉換勾稽"]],"03":[["#family-xref-placement","返回｜出養與照顧轉換勾稽"]],"06":[["#family-xref-health","返回｜交接前健康勾稽"]],"07":[["#family-xref-health","返回｜交接前健康勾稽"]],"08":[["#family-xref-placement","返回｜出養與照顧轉換勾稽"]],"10":[["#family-xref-contact","返回｜探視與聯繫勾稽"]],"11":[["#family-xref-placement","返回｜出養與照顧轉換勾稽"]],"12":[["#family-xref-health","返回｜交接前健康勾稽"]],"15":[["#family-xref-repair","返回｜事發後修復勾稽"]],"17":[["#family-xref-repair","返回｜事發後修復勾稽"]],"19":[["#family-xref-repair","返回｜事發後修復勾稽"]],
  "28":[["#doctor-xref-self-harm","返回｜自傷說法勾稽"]],"44":[["#doctor-xref-mental-state","返回｜精神自述與治療勾稽"]],"46":[["#doctor-xref-self-harm","返回｜自傷說法勾稽"],["#doctor-xref-responsibility","返回｜責任評價勾稽"]],"48":[["#doctor-xref-mental-state","返回｜精神自述與治療勾稽"]],"50":[["#doctor-xref-mental-state","返回｜精神自述與治療勾稽"]],"51":[["#doctor-xref-recovery","返回｜風險與復歸勾稽"]],"58":[["#doctor-xref-responsibility","返回｜責任評價勾稽"]],"59":[["#doctor-xref-recovery","返回｜風險與復歸勾稽"]],"61":[["#doctor-xref-recovery","返回｜風險與復歸勾稽"]]
};
const keypointDefs={
  "01":{tone:"eyewitness",labels:[["親自見聞","is-eyewitness"]],phrases:["大概2個月"],summary:"外婆稱自己曾實際照顧 A童約兩個月。",boundary:"限於其照顧期間的親自見聞。"},
  "03":{tone:"source",labels:[["程序陳述","is-source"],["來源限制","is-limit"]],phrases:["社會局建議","後轉介給兒福聯盟"],summary:"外婆描述出養路徑由社會局建議，再轉介兒福聯盟。",boundary:"流程脈絡仍須與機關文件或承辦人證詞分開核對。"},
  "06":{tone:"eyewitness",labels:[["親自見聞","is-eyewitness"]],phrases:["一個月2次以上"],summary:"外婆稱當時每月探視 A童兩次以上。",boundary:"只能說明該段期間的探視頻率。"},
  "07":{tone:"eyewitness",labels:[["親自見聞","is-eyewitness"]],phrases:["很健康、很活潑、很調皮、很可愛"],summary:"外婆對周保母照顧期間的印象是健康、活潑。",boundary:"這是早期狀態基準，不能直接推定後期每天狀態。"},
  "08":{tone:"emotion",labels:[["家庭情境","is-source"],["情緒陳述","is-emotion"]],phrases:["因為我們無能為力","一個月收入5、6萬元"],summary:"外婆把出養決定連結到照顧能力、工時與家庭負擔。",boundary:"家庭感受與客觀財務資料應分開理解。"},
  "10":{tone:"source",labels:[["親自見聞","is-eyewitness"],["來源轉述","is-source"]],phrases:["沒有去探望過","從社工處有得知A童的情形"],summary:"未探望是外婆自身行為；交接後情形則來自社工轉述。",boundary:"兩者的證據來源不同，不能合併成親自見聞。"},
  "12":{tone:"emotion",labels:[["親自見聞","is-eyewitness"],["情緒陳述","is-emotion"]],phrases:["很健康","我很難過（開始哭泣）"],summary:"回答同時包含交接前健康印象與當庭情緒反應。",boundary:"健康印象與情緒陳述須分開判讀。"},
  "13":{tone:"emotion",labels:[["情緒陳述","is-emotion"]],phrases:["我真的很自責，我真的無能為力"],summary:"外婆以自責與無力描述孩子死亡後的感受。",boundary:"情緒與價值陳述不等同法律責任認定。"},
  "15":{tone:"eyewitness",labels:[["親自見聞","is-eyewitness"],["修復界線","is-limit"]],phrases:["兩位被告沒有","兒福聯盟找過我一次，我拒絕了"],summary:"外婆稱被告未聯繫；兒盟曾聯繫一次但遭拒絕。",boundary:"有無聯繫與是否接受修復必須分開。"},
  "16":{tone:"limit",labels:[["未明確","is-limit"]],phrases:["時間太久我不記得了"],summary:"外婆無法確認兒盟聯繫的具體時間。",boundary:"日期不以其他敘述推補。"},
  "17":{tone:"emotion",labels:[["親自見聞","is-eyewitness"],["修復界線","is-limit"]],phrases:["有，但我不願意"],summary:"被告方家人曾談賠償、和解，但外婆明確表示不願意。",boundary:"曾提出接觸不等於已達成和解。"},
  "19":{tone:"limit",labels:[["未明確","is-limit"]],phrases:["不是很清楚"],summary:"外婆未明確確認是否提起附帶民事。",boundary:"本回答不能改寫成已提起或未提起；須以程序資料為準。"},
  "20":{tone:"source",labels:[["被告陳述","is-source"],["第三人陳述","is-source"]],phrases:["提到情緒低落打破玻璃自傷","劉若琳兒子說"],summary:"同一回答混合劉彩萱自述與劉若琳兒子的第三人說法。",boundary:"來源不同，均不等於醫師親自目擊。"},
  "22":{tone:"limit",labels:[["鑑定限制","is-limit"]],phrases:["無法真正看穿","等定讞後再訪談"],summary:"醫師說明訴訟情境限制目前訪談的理解深度。",boundary:"不是對犯案原因作確定結論。"},
  "23":{tone:"assessment",labels:[["鑑定意見","is-assessment"],["反向資料","is-limit"]],phrases:["封閉環境無法介入","另外一個孩子照顧是沒問題的"],summary:"醫師同時指出封閉環境與另一名孩子未出現相同照顧問題。",boundary:"環境因素不能單獨取代個人行為與其他證據。"},
  "27":{tone:"assessment",labels:[["鑑定意見","is-assessment"]],phrases:["個人是最重要的影響"],summary:"在多重因素中，醫師把個人因素評為最重要。",boundary:"屬鑑定意見，是否採納仍由法院判斷。"},
  "28":{tone:"limit",labels:[["鑑定意見","is-assessment"],["證據界線","is-limit"]],phrases:["A童是否真有這些行為難以確定","治療要先有動機","要等"],summary:"醫師未把被告所述 A童行為視為已證實，並把治療可能性繫於動機與訴訟階段。",boundary:"孩子行為、治療動機與責任評價是三個不同問題。"},
  "32":{tone:"limit",labels:[["專業範圍限制","is-limit"]],phrases:["我對監所的資源瞭解有限"],summary:"醫師明確限定自己對監所治療資源的了解。",boundary:"個別化處遇建議不等於監所現有資源已獲證實。"},
  "39":{tone:"limit",labels:[["原始紀錄空白","is-limit"]],phrases:[],summary:"原始問答表未記載鑑定人回答。",boundary:"不以審判長後續說明或其他資料代填。"},
  "44":{tone:"assessment",labels:[["被告陳述","is-source"],["鑑定意見","is-assessment"]],phrases:["第三次才開始自己說有聽幻覺","和診斷上的表現差很多"],summary:"醫師將幻覺說法出現時點與診斷表現作一致性比較。",boundary:"自述內容與醫師專業判斷必須分開呈現。"},
  "46":{tone:"assessment",labels:[["核心鑑定意見","is-assessment"]],phrases:["非一時衝動失控","沒有下修的可能性"],summary:"醫師以長時間行為及既有照顧能力，說明其責任下修判斷。",boundary:"這是鑑定人的量刑意見，不是法院判決。"},
  "47":{tone:"limit",labels:[["被告陳述","is-source"],["未觀察到","is-limit"]],phrases:["有提到咬自己","但沒有看到傷"],summary:"醫師區分被告提及的自傷行為與未見傷勢的觀察結果。",boundary:"未見傷勢不等於能推定行為一定發生或未發生。"},
  "48":{tone:"assessment",labels:[["治療前提","is-limit"]],phrases:["要有治療的動機"],summary:"醫師把治療動機列為社會復歸的重要前提。",boundary:"具備動機不等於責任刑當然下修。"},
  "51":{tone:"limit",labels:[["風險判斷","is-assessment"],["條件式結論","is-limit"]],phrases:["的確還是會有風險","如果沒有隔離因子的話"],summary:"劉彩萱的復歸評價仍帶有風險與隔離因子的條件。",boundary:"不是無條件的低風險結論。"},
  "57":{tone:"assessment",labels:[["概念解釋","is-assessment"]],phrases:["透過不同的認知","不會因為自己或他人的不道德行為"],summary:"醫師以白話說明道德疏離的心理機制。",boundary:"概念解釋不等於個案事實已由此機制證實。"},
  "58":{tone:"assessment",labels:[["核心鑑定意見","is-assessment"]],phrases:["沒錯，沒有不利的發展因素"],summary:"醫師確認第4、5、6款生活狀況、品行、智識程度沒有下修空間。",boundary:"鑑定意見與法院最終量刑判斷仍須區分。"},
  "59":{tone:"limit",labels:[["條件式結論","is-limit"],["復歸評價","is-assessment"]],phrases:["前提是劉彩萱開始，劉若琳後來才加入","若除去這個因素"],summary:"劉若琳較高復歸可能性建立在特定行為先後前提上。",boundary:"不是不附條件的復歸結論，也不自動下修責任。"},
  "60":{tone:"limit",labels:[["經驗揭露","is-limit"]],phrases:["四件，兩件量刑"],summary:"徐醫師當庭說明共四件鑑定經驗，其中兩件為量刑鑑定。",boundary:"供法院評價專業意見的經驗基礎。"},
  "61":{tone:"assessment",labels:[["概念解釋","is-assessment"],["反向資料","is-limit"]],phrases:["環境因素","因為家長會來接"],summary:"外控被解釋為家長接送等可介入、可監督的環境因素。",boundary:"醫師同時提到另一名孩子未出現相同現象，不能把封閉環境當成唯一原因。"}
};
function highlightPhrase(root,phrase,tone){
  if(!root||!phrase)return false;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  let node;
  while((node=walker.nextNode())){
    const index=node.nodeValue.indexOf(phrase);
    if(index<0)continue;
    const hit=node.splitText(index);
    hit.splitText(phrase.length);
    const mark=document.createElement("mark");
    mark.className="testimony-highlight tone-"+tone;
    mark.textContent=hit.nodeValue;
    hit.replaceWith(mark);
    return true;
  }
  return false;
}
function addKeypointAnnotation(card,number){
  const def=keypointDefs[number];
  if(!def)return;
  card.classList.add("has-keypoint");
  card.dataset.keypoint="true";
  const flag=document.createElement("strong");
  flag.className="keypoint-flag";
  flag.textContent="重點";
  card.querySelector(":scope > header")?.appendChild(flag);
  const answer=card.querySelector(".qa-columns section:nth-child(2) p");
  def.phrases.forEach(phrase=>highlightPhrase(answer,phrase,def.tone));
  const note=document.createElement("aside");
  note.className="keypoint-note";
  const badges=document.createElement("div");
  badges.className="keypoint-badges";
  def.labels.forEach(([label,className])=>{const chip=document.createElement("span");chip.className="annotation-chip "+className;chip.textContent=label;badges.appendChild(chip)});
  const summary=document.createElement("p");
  const summaryLabel=document.createElement("b");
  summaryLabel.textContent="重點｜";
  summary.append(summaryLabel,document.createTextNode(def.summary));
  const boundary=document.createElement("small");
  boundary.textContent="界線｜"+def.boundary;
  note.append(badges,summary,boundary);
  card.appendChild(note);
}
cards.forEach(card=>{const number=(card.querySelector("header span")?.textContent||"").trim().padStart(2,"0");if(!number)return;card.id="qa-"+number;addKeypointAnnotation(card,number);const links=crossrefMap[number];if(!links)return;const back=document.createElement("nav");back.className="qa-crosslinks";back.setAttribute("aria-label","本題跨證人勾稽");links.forEach(([href,label])=>{const a=document.createElement("a");a.href=href;a.textContent=label;back.appendChild(a)});card.appendChild(back)});
if(qaList&&cards.length){chapterDefs.forEach((def,index)=>{const members=cards.filter(card=>def.prefixes.some(prefix=>(card.dataset.group||"").startsWith(prefix)));if(!members.length)return;const details=document.createElement("details");details.className="qa-chapter";details.open=index<2;details.dataset.chapter=def.key;const summary=document.createElement("summary");summary.textContent=def.title+"・"+members.length+"組";const body=document.createElement("div");body.className="qa-chapter-body";members.forEach(card=>{const label=card.querySelector("header small")?.textContent||def.title;card.setAttribute("aria-label",label);body.appendChild(card)});details.append(summary,body);qaList.appendChild(details)})}
const chapters=[...document.querySelectorAll(".qa-chapter")];
function revealHashTarget(){const id=decodeURIComponent(location.hash.slice(1));if(!id)return;const target=document.getElementById(id);if(!target)return;const chapter=target.closest(".qa-chapter");if(chapter){chapter.hidden=false;chapter.open=true}document.querySelectorAll(".xref-target").forEach(el=>el.classList.remove("xref-target"));target.classList.add("xref-target");requestAnimationFrame(()=>target.scrollIntoView({block:"start",behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}))}
if(location.hash)setTimeout(revealHashTarget,60);window.addEventListener("hashchange",revealHashTarget);
const lang=new URLSearchParams(location.search).get("lang")==="zh-Hans"?"zh-Hans":"zh-Hant";
let mode={type:"all",value:"all"};
function applyFilter(){const term=(search?.value||"").trim().toLocaleLowerCase();let visible=0;cards.forEach(card=>{const group=card.dataset.group||"";const groupOK=mode.type==="all"||mode.type==="exact"&&group===mode.value||mode.type==="prefix"&&group.startsWith(mode.value)||mode.type==="keypoints"&&card.dataset.keypoint==="true";const textOK=!term||card.textContent.toLocaleLowerCase().includes(term);card.hidden=!(groupOK&&textOK);if(!card.hidden){visible++;card.classList.add("in-view")}});chapters.forEach(chapter=>{const hasVisible=[...chapter.querySelectorAll(".qa-card")].some(card=>!card.hidden);chapter.hidden=!hasVisible;if(hasVisible&&(term||mode.type!=="all"))chapter.open=true});if(count)count.textContent=(lang==="zh-Hans"?"显示 ":"顯示 ")+visible+(lang==="zh-Hans"?" 组问答":" 組問答");const mobileToggle=document.getElementById("mobileFilterToggle");if(mobileToggle)mobileToggle.textContent=(lang==="zh-Hans"?"搜索／筛选・显示 ":"搜尋／篩選・顯示 ")+visible+(lang==="zh-Hans"?" 组":" 組");if(empty)empty.hidden=visible!==0}
buttons.forEach(btn=>{if(!btn.hasAttribute("aria-pressed"))btn.setAttribute("aria-pressed","false");btn.addEventListener("click",()=>{buttons.forEach(x=>{x.classList.remove("active");x.setAttribute("aria-pressed","false")});btn.classList.add("active");btn.setAttribute("aria-pressed","true");mode=btn.dataset.filterKeypoints?{type:"keypoints",value:"keypoints"}:btn.dataset.filter==="all"?{type:"all",value:"all"}:btn.dataset.filter?{type:"exact",value:btn.dataset.filter}:{type:"prefix",value:btn.dataset.filterPrefix};applyFilter()})});search?.addEventListener("input",applyFilter);
const toolsPanel=document.querySelector(".dialogue-tools"),mobileToggle=document.getElementById("mobileFilterToggle");mobileToggle?.addEventListener("click",()=>{const open=toolsPanel.classList.toggle("panel-open");mobileToggle.setAttribute("aria-expanded",String(open))});
document.getElementById("expandAll")?.addEventListener("click",()=>chapters.filter(x=>!x.hidden).forEach(x=>x.open=true));document.getElementById("collapseAll")?.addEventListener("click",()=>chapters.forEach(x=>x.open=false));
const heroPoster=document.getElementById("day8HeroPoster");
if(heroPoster){heroPoster.src=lang==="zh-Hans"?heroPoster.dataset.srcHans:heroPoster.dataset.srcHant;heroPoster.alt=lang==="zh-Hans"?"悲剧不忘：第八次审判期日量刑证据主视觉海报，画面呈现法庭、证据纸页与穿蓝白条纹衣的幼儿象征背影":"悲劇不忘：第八次審判期日量刑證據主視覺海報，畫面呈現法庭、證據紙頁與穿藍白條紋衣的幼兒象徵背影"}
document.documentElement.lang=lang;document.querySelectorAll("[data-language]").forEach(a=>a.setAttribute("aria-current",String(a.dataset.language===lang)));
function applySimplified(){if(lang!=="zh-Hans"||!window.OpenCC?.Converter)return;const convert=OpenCC.Converter({from:"tw",to:"cn"});const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(node){const p=node.parentElement;if(!p||/^(SCRIPT|STYLE|CODE)$/.test(p.tagName))return NodeFilter.FILTER_REJECT;return node.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(n=>n.nodeValue=convert(n.nodeValue));document.title=convert(document.title)}
if(document.readyState==="complete")applySimplified();else window.addEventListener("load",applySimplified,{once:true});
const copy=document.getElementById("copyCitation");copy?.addEventListener("click",async()=>{const citation="監所關注小組，〈DAY8｜2025年5月5日（一）第八次審判期日〉，護童行動聯盟重製頁："+location.href.split("?")[0];try{await navigator.clipboard.writeText(citation);copy.textContent="已複製來源註記"}catch{copy.textContent="請手動複製網址"}setTimeout(()=>copy.textContent="複製來源註記",2200)});
window.addEventListener("load",()=>{if(!window.gsap||matchMedia("(prefers-reduced-motion: reduce)").matches)return;gsap.registerPlugin(window.ScrollTrigger);if(document.querySelector(".paper-cloud"))gsap.to(".paper-cloud",{x:18,y:-8,duration:5.5,repeat:-1,yoyo:true,ease:"sine.inOut"});if(document.querySelector(".red-thread"))gsap.to(".red-thread",{strokeDashoffset:-90,duration:6,repeat:-1,ease:"none",attr:{"stroke-dasharray":"18 13"}});if(document.querySelector(".dust circle"))gsap.to(".dust circle",{y:-22,opacity:.2,duration:3.5,stagger:.4,repeat:-1,yoyo:true,ease:"sine.inOut"});if(document.querySelector(".stage-ribbons path"))gsap.from(".stage-ribbons path",{scaleX:.82,transformOrigin:"50% 50%",duration:1.1,stagger:.13,ease:"power3.out"})},{once:true});
})();
