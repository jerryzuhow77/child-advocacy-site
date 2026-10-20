(()=>{"use strict";
document.documentElement.classList.add("js-ready");
const menu=document.getElementById("menuButton"),nav=document.getElementById("siteNav");
if(menu&&nav){menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open))});nav.addEventListener("click",e=>{if(e.target.closest("a")){nav.classList.remove("open");menu.setAttribute("aria-expanded","false")}})}
const reveals=[...document.querySelectorAll(".reveal")];
if("IntersectionObserver"in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in-view");io.unobserve(e.target)}}),{rootMargin:"0px 0px -8% 0px",threshold:.08});reveals.forEach(el=>io.observe(el))}else reveals.forEach(el=>el.classList.add("in-view"));
const cards=[...document.querySelectorAll(".qa-card")],search=document.getElementById("qaSearch"),count=document.getElementById("qaCount"),empty=document.getElementById("qaEmpty"),buttons=[...document.querySelectorAll(".filter-buttons button")];
const qaList=document.getElementById("qaList"),chapterDefs=[
  {key:"family",prefixes:["family"],title:"第一章｜A童外婆完整证词"},
  {key:"doctor-caixuan",prefixes:["doctor-caixuan"],title:"第二章｜刘彩萱辩方诘问徐坚棋医师"},
  {key:"doctor-ruolin",prefixes:["doctor-ruolin"],title:"第三章｜刘若琳辩方诘问徐坚棋医师"},
  {key:"doctor-prosecutor",prefixes:["doctor-prosecutor"],title:"第四章｜检察官诘问徐坚棋医师"},
  {key:"doctor-judge",prefixes:["doctor-judge"],title:"第五章｜审判长询问徐坚棋医师"}
];
const crossrefMap={
  "02":[["#family-xref-placement","返回｜出养与照顾转换勾稽"]],"03":[["#family-xref-placement","返回｜出养与照顾转换勾稽"]],"06":[["#family-xref-health","返回｜交接前健康勾稽"]],"07":[["#family-xref-health","返回｜交接前健康勾稽"]],"08":[["#family-xref-placement","返回｜出养与照顾转换勾稽"]],"10":[["#family-xref-contact","返回｜探视与联系勾稽"]],"11":[["#family-xref-placement","返回｜出养与照顾转换勾稽"]],"12":[["#family-xref-health","返回｜交接前健康勾稽"]],"15":[["#family-xref-repair","返回｜事发后修复勾稽"]],"17":[["#family-xref-repair","返回｜事发后修复勾稽"]],"19":[["#family-xref-repair","返回｜事发后修复勾稽"]],
  "28":[["#doctor-xref-self-harm","返回｜自伤说法勾稽"]],"44":[["#doctor-xref-mental-state","返回｜精神自述与治疗勾稽"]],"46":[["#doctor-xref-self-harm","返回｜自伤说法勾稽"],["#doctor-xref-responsibility","返回｜责任评价勾稽"]],"48":[["#doctor-xref-mental-state","返回｜精神自述与治疗勾稽"]],"50":[["#doctor-xref-mental-state","返回｜精神自述与治疗勾稽"]],"51":[["#doctor-xref-recovery","返回｜风险与复归勾稽"]],"58":[["#doctor-xref-responsibility","返回｜责任评价勾稽"]],"59":[["#doctor-xref-recovery","返回｜风险与复归勾稽"]],"61":[["#doctor-xref-recovery","返回｜风险与复归勾稽"]]
};
const keypointDefs={
  "01":{tone:"eyewitness",labels:[["亲自见闻","is-eyewitness"]],phrases:["大概2个月"],summary:"外婆称自己曾实际照顾 A童约两个月。",boundary:"限于其照顾期间的亲自见闻。"},
  "03":{tone:"source",labels:[["程序陈述","is-source"],["来源限制","is-limit"]],phrases:["社会局建议","后转介给儿福联盟"],summary:"外婆描述出养路径由社会局建议，再转介儿福联盟。",boundary:"流程脉络仍须与机关文件或承办人证词分开核对。"},
  "06":{tone:"eyewitness",labels:[["亲自见闻","is-eyewitness"]],phrases:["一个月2次以上"],summary:"外婆称当时每月探视 A童两次以上。",boundary:"只能说明该段期间的探视频率。"},
  "07":{tone:"eyewitness",labels:[["亲自见闻","is-eyewitness"]],phrases:["很健康、很活泼、很调皮、很可爱"],summary:"外婆对周保母照顾期间的印象是健康、活泼。",boundary:"这是早期状态基准，不能直接推定后期每天状态。"},
  "08":{tone:"emotion",labels:[["家庭情境","is-source"],["情绪陈述","is-emotion"]],phrases:["因为我们无能为力","一个月收入5、6万元"],summary:"外婆把出养决定连结到照顾能力、工时与家庭负担。",boundary:"家庭感受与客观财务资料应分开理解。"},
  "10":{tone:"source",labels:[["亲自见闻","is-eyewitness"],["来源转述","is-source"]],phrases:["没有去探望过","从社工处有得知A童的情形"],summary:"未探望是外婆自身行为；交接后情形则来自社工转述。",boundary:"两者的证据来源不同，不能合并成亲自见闻。"},
  "12":{tone:"emotion",labels:[["亲自见闻","is-eyewitness"],["情绪陈述","is-emotion"]],phrases:["很健康","我很难过（开始哭泣）"],summary:"回答同时包含交接前健康印象与当庭情绪反应。",boundary:"健康印象与情绪陈述须分开判读。"},
  "13":{tone:"emotion",labels:[["情绪陈述","is-emotion"]],phrases:["我真的很自责，我真的无能为力"],summary:"外婆以自责与无力描述孩子死亡后的感受。",boundary:"情绪与价值陈述不等同法律责任认定。"},
  "15":{tone:"eyewitness",labels:[["亲自见闻","is-eyewitness"],["修复界线","is-limit"]],phrases:["两位被告没有","儿福联盟找过我一次，我拒绝了"],summary:"外婆称被告未联系；儿盟曾联系一次但遭拒绝。",boundary:"有无联系与是否接受修复必须分开。"},
  "16":{tone:"limit",labels:[["未明确","is-limit"]],phrases:["时间太久我不记得了"],summary:"外婆无法确认儿盟联系的具体时间。",boundary:"日期不以其他叙述推补。"},
  "17":{tone:"emotion",labels:[["亲自见闻","is-eyewitness"],["修复界线","is-limit"]],phrases:["有，但我不愿意"],summary:"被告方家人曾谈赔偿、和解，但外婆明确表示不愿意。",boundary:"曾提出接触不等于已达成和解。"},
  "19":{tone:"limit",labels:[["未明确","is-limit"]],phrases:["不是很清楚"],summary:"外婆未明确确认是否提起附带民事。",boundary:"本回答不能改写成已提起或未提起；须以程序资料为准。"},
  "20":{tone:"source",labels:[["被告陈述","is-source"],["第三人陈述","is-source"]],phrases:["提到情绪低落打破玻璃自伤","刘若琳儿子说"],summary:"同一回答混合刘彩萱自述与刘若琳儿子的第三人说法。",boundary:"来源不同，均不等于医师亲自目击。"},
  "22":{tone:"limit",labels:[["鉴定限制","is-limit"]],phrases:["无法真正看穿","等定谳后再访谈"],summary:"医师说明诉讼情境限制目前访谈的理解深度。",boundary:"不是对犯案原因作确定结论。"},
  "23":{tone:"assessment",labels:[["鉴定意见","is-assessment"],["反向资料","is-limit"]],phrases:["封闭环境无法介入","另外一个孩子照顾是没问题的"],summary:"医师同时指出封闭环境与另一名孩子未出现相同照顾问题。",boundary:"环境因素不能单独取代个人行为与其他证据。"},
  "27":{tone:"assessment",labels:[["鉴定意见","is-assessment"]],phrases:["个人是最重要的影响"],summary:"在多重因素中，医师把个人因素评为最重要。",boundary:"属鉴定意见，是否采纳仍由法院判断。"},
  "28":{tone:"limit",labels:[["鉴定意见","is-assessment"],["证据界线","is-limit"]],phrases:["A童是否真有这些行为难以确定","治疗要先有动机","要等"],summary:"医师未把被告所述 A童行为视为已证实，并把治疗可能性系于动机与诉讼阶段。",boundary:"孩子行为、治疗动机与责任评价是三个不同问题。"},
  "32":{tone:"limit",labels:[["专业范围限制","is-limit"]],phrases:["我对监所的资源了解有限"],summary:"医师明确限定自己对监所治疗资源的了解。",boundary:"个别化处遇建议不等于监所现有资源已获证实。"},
  "39":{tone:"limit",labels:[["原始纪录空白","is-limit"]],phrases:[],summary:"原始问答表未记载鉴定人回答。",boundary:"不以审判长后续说明或其他资料代填。"},
  "44":{tone:"assessment",labels:[["被告陈述","is-source"],["鉴定意见","is-assessment"]],phrases:["第三次才开始自己说有听幻觉","和诊断上的表现差很多"],summary:"医师将幻觉说法出现时点与诊断表现作一致性比较。",boundary:"自述内容与医师专业判断必须分开呈现。"},
  "46":{tone:"assessment",labels:[["核心鉴定意见","is-assessment"]],phrases:["非一时冲动失控","没有下修的可能性"],summary:"医师以长时间行为及既有照顾能力，说明其责任下修判断。",boundary:"这是鉴定人的量刑意见，不是法院判决。"},
  "47":{tone:"limit",labels:[["被告陈述","is-source"],["未观察到","is-limit"]],phrases:["有提到咬自己","但没有看到伤"],summary:"医师区分被告提及的自伤行为与未见伤势的观察结果。",boundary:"未见伤势不等于能推定行为一定发生或未发生。"},
  "48":{tone:"assessment",labels:[["治疗前提","is-limit"]],phrases:["要有治疗的动机"],summary:"医师把治疗动机列为社会复归的重要前提。",boundary:"具备动机不等于责任刑当然下修。"},
  "51":{tone:"limit",labels:[["风险判断","is-assessment"],["条件式结论","is-limit"]],phrases:["的确还是会有风险","如果没有隔离因子的话"],summary:"刘彩萱的复归评价仍带有风险与隔离因子的条件。",boundary:"不是无条件的低风险结论。"},
  "57":{tone:"assessment",labels:[["概念解释","is-assessment"]],phrases:["透过不同的认知","不会因为自己或他人的不道德行为"],summary:"医师以白话说明道德疏离的心理机制。",boundary:"概念解释不等于个案事实已由此机制证实。"},
  "58":{tone:"assessment",labels:[["核心鉴定意见","is-assessment"]],phrases:["没错，没有不利的发展因素"],summary:"医师确认第4、5、6款生活状况、品行、智识程度没有下修空间。",boundary:"鉴定意见与法院最终量刑判断仍须区分。"},
  "59":{tone:"limit",labels:[["条件式结论","is-limit"],["复归评价","is-assessment"]],phrases:["前提是刘彩萱开始，刘若琳后来才加入","若除去这个因素"],summary:"刘若琳较高复归可能性建立在特定行为先后前提上。",boundary:"不是不附条件的复归结论，也不自动下修责任。"},
  "60":{tone:"limit",labels:[["经验揭露","is-limit"]],phrases:["四件，两件量刑"],summary:"徐医师当庭说明共四件鉴定经验，其中两件为量刑鉴定。",boundary:"供法院评价专业意见的经验基础。"},
  "61":{tone:"assessment",labels:[["概念解释","is-assessment"],["反向资料","is-limit"]],phrases:["环境因素","因为家长会来接"],summary:"外控被解释为家长接送等可介入、可监督的环境因素。",boundary:"医师同时提到另一名孩子未出现相同现象，不能把封闭环境当成唯一原因。"}
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
  flag.textContent="重点";
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
  summaryLabel.textContent="重点｜";
  summary.append(summaryLabel,document.createTextNode(def.summary));
  const boundary=document.createElement("small");
  boundary.textContent="界线｜"+def.boundary;
  note.append(badges,summary,boundary);
  card.appendChild(note);
}
cards.forEach(card=>{const number=(card.querySelector("header span")?.textContent||"").trim().padStart(2,"0");if(!number)return;card.id="qa-"+number;addKeypointAnnotation(card,number);const links=crossrefMap[number];if(!links)return;const back=document.createElement("nav");back.className="qa-crosslinks";back.setAttribute("aria-label","本题跨证人勾稽");links.forEach(([href,label])=>{const a=document.createElement("a");a.href=href;a.textContent=label;back.appendChild(a)});card.appendChild(back)});
if(qaList&&cards.length){chapterDefs.forEach((def,index)=>{const members=cards.filter(card=>def.prefixes.some(prefix=>(card.dataset.group||"").startsWith(prefix)));if(!members.length)return;const details=document.createElement("details");details.className="qa-chapter";details.open=index<2;details.dataset.chapter=def.key;const summary=document.createElement("summary");summary.textContent=def.title+"・"+members.length+"组";const body=document.createElement("div");body.className="qa-chapter-body";members.forEach(card=>{const label=card.querySelector("header small")?.textContent||def.title;card.setAttribute("aria-label",label);body.appendChild(card)});details.append(summary,body);qaList.appendChild(details)})}
const chapters=[...document.querySelectorAll(".qa-chapter")];
function revealHashTarget(){const id=decodeURIComponent(location.hash.slice(1));if(!id)return;const target=document.getElementById(id);if(!target)return;const chapter=target.closest(".qa-chapter");if(chapter){chapter.hidden=false;chapter.open=true}document.querySelectorAll(".xref-target").forEach(el=>el.classList.remove("xref-target"));target.classList.add("xref-target");requestAnimationFrame(()=>target.scrollIntoView({block:"start",behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}))}
if(location.hash)setTimeout(revealHashTarget,60);window.addEventListener("hashchange",revealHashTarget);
const lang="zh-Hans";
let mode={type:"all",value:"all"};
function applyFilter(){const term=(search?.value||"").trim().toLocaleLowerCase();let visible=0;cards.forEach(card=>{const group=card.dataset.group||"";const groupOK=mode.type==="all"||mode.type==="exact"&&group===mode.value||mode.type==="prefix"&&group.startsWith(mode.value)||mode.type==="keypoints"&&card.dataset.keypoint==="true";const textOK=!term||card.textContent.toLocaleLowerCase().includes(term);card.hidden=!(groupOK&&textOK);if(!card.hidden){visible++;card.classList.add("in-view")}});chapters.forEach(chapter=>{const hasVisible=[...chapter.querySelectorAll(".qa-card")].some(card=>!card.hidden);chapter.hidden=!hasVisible;if(hasVisible&&(term||mode.type!=="all"))chapter.open=true});if(count)count.textContent=(lang==="zh-Hans"?"显示 ":"显示 ")+visible+(lang==="zh-Hans"?" 组问答":" 组问答");const mobileToggle=document.getElementById("mobileFilterToggle");if(mobileToggle)mobileToggle.textContent=(lang==="zh-Hans"?"搜索／筛选・显示 ":"搜寻／筛选・显示 ")+visible+(lang==="zh-Hans"?" 组":" 组");if(empty)empty.hidden=visible!==0}
buttons.forEach(btn=>{if(!btn.hasAttribute("aria-pressed"))btn.setAttribute("aria-pressed","false");btn.addEventListener("click",()=>{buttons.forEach(x=>{x.classList.remove("active");x.setAttribute("aria-pressed","false")});btn.classList.add("active");btn.setAttribute("aria-pressed","true");mode=btn.dataset.filterKeypoints?{type:"keypoints",value:"keypoints"}:btn.dataset.filter==="all"?{type:"all",value:"all"}:btn.dataset.filter?{type:"exact",value:btn.dataset.filter}:{type:"prefix",value:btn.dataset.filterPrefix};applyFilter()})});search?.addEventListener("input",applyFilter);
const toolsPanel=document.querySelector(".dialogue-tools"),mobileToggle=document.getElementById("mobileFilterToggle");mobileToggle?.addEventListener("click",()=>{const open=toolsPanel.classList.toggle("panel-open");mobileToggle.setAttribute("aria-expanded",String(open))});
document.getElementById("expandAll")?.addEventListener("click",()=>chapters.filter(x=>!x.hidden).forEach(x=>x.open=true));document.getElementById("collapseAll")?.addEventListener("click",()=>chapters.forEach(x=>x.open=false));
const heroPoster=document.getElementById("day8HeroPoster");
if(heroPoster){heroPoster.src=lang==="zh-Hans"?heroPoster.dataset.srcHans:heroPoster.dataset.srcHant;heroPoster.alt=lang==="zh-Hans"?"悲剧不忘：第八次审判期日量刑证据主视觉海报，画面呈现法庭、证据纸页与穿蓝白条纹衣的幼儿象征背影":"悲剧不忘：第八次审判期日量刑证据主视觉海报，画面呈现法庭、证据纸页与穿蓝白条纹衣的幼儿象征背影"}
document.documentElement.lang=lang;document.querySelectorAll("[data-language]").forEach(a=>a.setAttribute("aria-current",String(a.dataset.language===lang)));
function applySimplified(){if(lang!=="zh-Hans"||!window.OpenCC?.Converter)return;const convert=OpenCC.Converter({from:"tw",to:"cn"});const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(node){const p=node.parentElement;if(!p||/^(SCRIPT|STYLE|CODE)$/.test(p.tagName))return NodeFilter.FILTER_REJECT;return node.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(n=>n.nodeValue=convert(n.nodeValue));document.title=convert(document.title)}
if(document.readyState==="complete")applySimplified();else window.addEventListener("load",applySimplified,{once:true});
const copy=document.getElementById("copyCitation");copy?.addEventListener("click",async()=>{const citation="监所关注小组，〈DAY8｜2025年5月5日（一）第八次审判期日〉，护童行动联盟重制页："+location.href.split("?")[0];try{await navigator.clipboard.writeText(citation);copy.textContent="已复制来源注记"}catch{copy.textContent="请手动复制网址"}setTimeout(()=>copy.textContent="复制来源注记",2200)});
window.addEventListener("load",()=>{if(!window.gsap||matchMedia("(prefers-reduced-motion: reduce)").matches)return;gsap.registerPlugin(window.ScrollTrigger);if(document.querySelector(".paper-cloud"))gsap.to(".paper-cloud",{x:18,y:-8,duration:5.5,repeat:-1,yoyo:true,ease:"sine.inOut"});if(document.querySelector(".red-thread"))gsap.to(".red-thread",{strokeDashoffset:-90,duration:6,repeat:-1,ease:"none",attr:{"stroke-dasharray":"18 13"}});if(document.querySelector(".dust circle"))gsap.to(".dust circle",{y:-22,opacity:.2,duration:3.5,stagger:.4,repeat:-1,yoyo:true,ease:"sine.inOut"});if(document.querySelector(".stage-ribbons path"))gsap.from(".stage-ribbons path",{scaleX:.82,transformOrigin:"50% 50%",duration:1.1,stagger:.13,ease:"power3.out"})},{once:true});
})();
