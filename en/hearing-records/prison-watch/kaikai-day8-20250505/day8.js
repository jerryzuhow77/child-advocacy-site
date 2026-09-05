(()=>{"use strict";
document.documentElement.classList.add("js-ready");
const menu=document.getElementById("menuButton"),nav=document.getElementById("siteNav");
if(menu&&nav){menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open))});nav.addEventListener("click",e=>{if(e.target.closest("a")){nav.classList.remove("open");menu.setAttribute("aria-expanded","false")}})}
const reveals=[...document.querySelectorAll(".reveal")];
if("IntersectionObserver"in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in-view");io.unobserve(e.target)}}),{rootMargin:"0px 0px -8% 0px",threshold:.08});reveals.forEach(el=>io.observe(el))}else reveals.forEach(el=>el.classList.add("in-view"));
const cards=[...document.querySelectorAll(".qa-card")],search=document.getElementById("qaSearch"),count=document.getElementById("qaCount"),empty=document.getElementById("qaEmpty"),buttons=[...document.querySelectorAll(".filter-buttons button")];
const qaList=document.getElementById("qaList"),chapterDefs=[
  {key:"family",prefixes:["family"],title:"Chapter 1 | Grandmother’s full testimony"},
  {key:"doctor-caixuan",prefixes:["doctor-caixuan"],title:"Chapter 2 | Caixuan’s defense questions Dr. Hsu"},
  {key:"doctor-ruolin",prefixes:["doctor-ruolin"],title:"Chapter 3 | Ruolin’s defense questions Dr. Hsu"},
  {key:"doctor-prosecutor",prefixes:["doctor-prosecutor"],title:"Chapter 4 | Prosecution questions Dr. Hsu"},
  {key:"doctor-judge",prefixes:["doctor-judge"],title:"Chapter 5 | Presiding judge questions Dr. Hsu"}
];
const crossrefMap={
  "02":[["#family-xref-placement","Back | Adoption/care transitions"]],"03":[["#family-xref-placement","Back | Adoption/care transitions"]],"06":[["#family-xref-health","Back | Pre-handover health"]],"07":[["#family-xref-health","Back | Pre-handover health"]],"08":[["#family-xref-placement","Back | Adoption/care transitions"]],"10":[["#family-xref-contact","Back | Visits/contact"]],"11":[["#family-xref-placement","Back | Adoption/care transitions"]],"12":[["#family-xref-health","Back | Pre-handover health"]],"15":[["#family-xref-repair","Back | Post-incident repair"]],"17":[["#family-xref-repair","Back | Post-incident repair"]],"19":[["#family-xref-repair","Back | Post-incident repair"]],
  "28":[["#doctor-xref-self-harm","Back | Self-injury claims"]],"44":[["#doctor-xref-mental-state","Back | Mental-health claims/treatment"]],"46":[["#doctor-xref-self-harm","Back | Self-injury claims"],["#doctor-xref-responsibility","Back | Responsibility evaluation"]],"48":[["#doctor-xref-mental-state","Back | Mental-health claims/treatment"]],"50":[["#doctor-xref-mental-state","Back | Mental-health claims/treatment"]],"51":[["#doctor-xref-recovery","Back | Risk/reintegration"]],"58":[["#doctor-xref-responsibility","Back | Responsibility evaluation"]],"59":[["#doctor-xref-recovery","Back | Risk/reintegration"]],"61":[["#doctor-xref-recovery","Back | Risk/reintegration"]]
};
const keypointDefs={
  "01":{tone:"eyewitness",labels:[["Personal observation","is-eyewitness"]],phrases:["about two months"],summary:"The grandmother says she actually cared for A for about two months.",boundary:"Limited to personal observations during her care."},
  "03":{tone:"source",labels:[["Procedural account","is-source"],["Source limit","is-limit"]],phrases:["the social-affairs bureau recommended it","then referred him to the foundation"],summary:"She describes a bureau recommendation followed by referral to the foundation for adoption.",boundary:"Check the process separately against agency documents or staff testimony."},
  "06":{tone:"eyewitness",labels:[["Personal observation","is-eyewitness"]],phrases:["more than twice a month"],summary:"She says she visited A more than twice monthly then.",boundary:"This establishes visit frequency only for that period."},
  "07":{tone:"eyewitness",labels:[["Personal observation","is-eyewitness"]],phrases:["healthy, lively, mischievous and lovable"],summary:"Her impression during Chou’s care was health and liveliness.",boundary:"An early baseline, not proof of every later day’s condition."},
  "08":{tone:"emotion",labels:[["Family context","is-source"],["Emotional statement","is-emotion"]],phrases:["Because we could not manage","earned NT$50,000–60,000 monthly"],summary:"She links adoption to care capacity, working hours and family burdens.",boundary:"Distinguish family feelings from objective financial data."},
  "10":{tone:"source",labels:[["Personal observation","is-eyewitness"],["Reported source","is-source"]],phrases:["I did not visit","I heard about A from the social worker"],summary:"Not visiting concerns her own conduct; the later condition came via a social worker.",boundary:"Different sources cannot be merged into personal observation."},
  "12":{tone:"emotion",labels:[["Personal observation","is-eyewitness"],["Emotional statement","is-emotion"]],phrases:["Very healthy","I’m so sad (begins crying)"],summary:"The answer includes a pre-handover health impression and a courtroom emotional response.",boundary:"Read health impressions and emotional statements separately."},
  "13":{tone:"emotion",labels:[["Emotional statement","is-emotion"]],phrases:["I truly blame myself; I really could do nothing"],summary:"She describes self-blame and helplessness after the child’s death.",boundary:"Emotion and value statements do not determine legal responsibility."},
  "15":{tone:"eyewitness",labels:[["Personal observation","is-eyewitness"],["Repair boundary","is-limit"]],phrases:["Neither defendant did","The foundation contacted me once; I refused"],summary:"She reports no defendant contact, and one foundation contact which she rejected.",boundary:"Contact and acceptance of repair are separate."},
  "16":{tone:"limit",labels:[["Unclear","is-limit"]],phrases:["Too long ago to remember"],summary:"She cannot confirm when the foundation contacted her.",boundary:"Do not infer a date from other accounts."},
  "17":{tone:"emotion",labels:[["Personal observation","is-eyewitness"],["Repair boundary","is-limit"]],phrases:["Yes, but I did not want it"],summary:"Defendants’ relatives raised compensation/settlement; she expressly declined.",boundary:"An approach does not mean settlement was reached."},
  "19":{tone:"limit",labels:[["Unclear","is-limit"]],phrases:["I’m not very clear on that"],summary:"She did not clearly confirm whether a civil action was filed.",boundary:"Do not rewrite this as filed or not filed; check procedural records."},
  "20":{tone:"source",labels:[["Defendant’s account","is-source"],["Third-party account","is-source"]],phrases:["reported low mood and breaking glass to injure herself","Ruolin’s son said"],summary:"One answer combines Caixuan’s self-report with Ruolin’s son’s third-party account.",boundary:"Different sources, neither direct doctor observation."},
  "22":{tone:"limit",labels:[["Assessment limit","is-limit"]],phrases:["cannot truly see through it","Interviewing after the judgment becomes final"],summary:"The doctor describes litigation limiting present interview depth.",boundary:"Not a definitive conclusion on the crime’s cause."},
  "23":{tone:"assessment",labels:[["Expert opinion","is-assessment"],["Countervailing material","is-limit"]],phrases:["a closed environment preventing intervention","the other child was cared for without problems"],summary:"He notes both the closed setting and absence of the same problem for another child.",boundary:"Environment alone cannot replace individual conduct and other evidence."},
  "27":{tone:"assessment",labels:[["Expert opinion","is-assessment"]],phrases:["the personal factor is most important"],summary:"He rates the individual factor most important among multiple factors.",boundary:"An expert opinion; adoption remains the court’s decision."},
  "28":{tone:"limit",labels:[["Expert opinion","is-assessment"],["Evidentiary boundary","is-limit"]],phrases:["It is difficult to establish whether A really had these behaviors","Treatment first requires motivation","We must wait"],summary:"He does not treat alleged child behaviors as proved, and conditions treatment on motivation and litigation stage.",boundary:"Child behavior, treatment motivation and responsibility are three different questions."},
  "32":{tone:"limit",labels:[["Professional scope limit","is-limit"]],phrases:["My knowledge of prison resources is limited"],summary:"He explicitly limits his knowledge of custodial treatment resources.",boundary:"Recommending individualized care does not confirm existing prison resources."},
  "39":{tone:"limit",labels:[["Original record blank","is-limit"]],phrases:[],summary:"The source Q&A table records no expert answer.",boundary:"Do not fill it with later judicial remarks or other material."},
  "44":{tone:"assessment",labels:[["Defendant’s account","is-source"],["Expert opinion","is-assessment"]],phrases:["only at the third did she report hearing voices","This differed greatly from diagnostic presentation"],summary:"He checks consistency between onset of the voices claim and diagnostic presentation.",boundary:"Separate self-report from the doctor’s professional judgment."},
  "46":{tone:"assessment",labels:[["Core expert opinion","is-assessment"]],phrases:["It was not momentary impulsive loss of control","there is no possibility of reduction"],summary:"He cites prolonged conduct and existing care ability to explain his reduction assessment.",boundary:"This is the expert’s sentencing view, not a judgment."},
  "47":{tone:"limit",labels:[["Defendant’s account","is-source"],["Not observed","is-limit"]],phrases:["She mentioned biting herself","but I saw no injury"],summary:"He distinguishes reported self-harm from his observation of no injury.",boundary:"No observed injury proves neither occurrence nor non-occurrence."},
  "48":{tone:"assessment",labels:[["Treatment prerequisite","is-limit"]],phrases:["There must be motivation for treatment"],summary:"He treats motivation as an important reintegration prerequisite.",boundary:"Motivation does not automatically lower a culpability-based sentence."},
  "51":{tone:"limit",labels:[["Risk assessment","is-assessment"],["Conditional conclusion","is-limit"]],phrases:["There certainly remains risk","without a separation factor"],summary:"Caixuan’s reintegration assessment remains conditional on risk and separation.",boundary:"Not an unconditional low-risk conclusion."},
  "57":{tone:"assessment",labels:[["Concept explanation","is-assessment"]],phrases:["using different cognitions","one’s own or others’ immoral actions"],summary:"He explains the mechanism of moral disengagement plainly.",boundary:"A concept explanation does not prove case facts through that mechanism."},
  "58":{tone:"assessment",labels:[["Core expert opinion","is-assessment"]],phrases:["Correct; there were no adverse developmental factors"],summary:"He confirms no reduction for items 4–6: living conditions, character and intellect/education.",boundary:"Distinguish expert opinion from final judicial sentencing."},
  "59":{tone:"limit",labels:[["Conditional conclusion","is-limit"],["Reintegration assessment","is-assessment"]],phrases:["The premise is Caixuan started and Ruolin joined later","Removing that factor"],summary:"Ruolin’s better prospect rests on a particular sequence-of-conduct premise.",boundary:"Not unconditional reintegration or automatic responsibility reduction."},
  "60":{tone:"limit",labels:[["Experience disclosure","is-limit"]],phrases:["Four, two involving sentencing"],summary:"Dr. Hsu reports four assessments, including two sentencing cases.",boundary:"Experience basis for the court’s evaluation of the opinion."},
  "61":{tone:"assessment",labels:[["Concept explanation","is-assessment"],["Countervailing material","is-limit"]],phrases:["Environmental factors","because they come to collect the child"],summary:"External control means environmental intervention/oversight, such as parent pickup.",boundary:"He also notes no similar phenomenon for another child; closure cannot be the sole cause."}
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
  flag.textContent="Highlight";
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
  summaryLabel.textContent="Highlight | ";
  summary.append(summaryLabel,document.createTextNode(def.summary));
  const boundary=document.createElement("small");
  boundary.textContent="Boundary | "+def.boundary;
  note.append(badges,summary,boundary);
  card.appendChild(note);
}
cards.forEach(card=>{const number=(card.querySelector("header span")?.textContent||"").trim().padStart(2,"0");if(!number)return;card.id="qa-"+number;addKeypointAnnotation(card,number);const links=crossrefMap[number];if(!links)return;const back=document.createElement("nav");back.className="qa-crosslinks";back.setAttribute("aria-label","Cross-witness references for this question");links.forEach(([href,label])=>{const a=document.createElement("a");a.href=href;a.textContent=label;back.appendChild(a)});card.appendChild(back)});
if(qaList&&cards.length){chapterDefs.forEach((def,index)=>{const members=cards.filter(card=>def.prefixes.some(prefix=>(card.dataset.group||"").startsWith(prefix)));if(!members.length)return;const details=document.createElement("details");details.className="qa-chapter";details.open=index<2;details.dataset.chapter=def.key;const summary=document.createElement("summary");summary.textContent=def.title+"・"+members.length+" pairs";const body=document.createElement("div");body.className="qa-chapter-body";members.forEach(card=>{const label=card.querySelector("header small")?.textContent||def.title;card.setAttribute("aria-label",label);body.appendChild(card)});details.append(summary,body);qaList.appendChild(details)})}
const chapters=[...document.querySelectorAll(".qa-chapter")];
function revealHashTarget(){const id=decodeURIComponent(location.hash.slice(1));if(!id)return;const target=document.getElementById(id);if(!target)return;const chapter=target.closest(".qa-chapter");if(chapter){chapter.hidden=false;chapter.open=true}document.querySelectorAll(".xref-target").forEach(el=>el.classList.remove("xref-target"));target.classList.add("xref-target");requestAnimationFrame(()=>target.scrollIntoView({block:"start",behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}))}
if(location.hash)setTimeout(revealHashTarget,60);window.addEventListener("hashchange",revealHashTarget);
const lang="en";
let mode={type:"all",value:"all"};
function applyFilter(){const term=(search?.value||"").trim().toLocaleLowerCase();let visible=0;cards.forEach(card=>{const group=card.dataset.group||"";const groupOK=mode.type==="all"||mode.type==="exact"&&group===mode.value||mode.type==="prefix"&&group.startsWith(mode.value)||mode.type==="keypoints"&&card.dataset.keypoint==="true";const textOK=!term||card.textContent.toLocaleLowerCase().includes(term);card.hidden=!(groupOK&&textOK);if(!card.hidden){visible++;card.classList.add("in-view")}});chapters.forEach(chapter=>{const hasVisible=[...chapter.querySelectorAll(".qa-card")].some(card=>!card.hidden);chapter.hidden=!hasVisible;if(hasVisible&&(term||mode.type!=="all"))chapter.open=true});if(count)count.textContent=(lang==="zh-Hans"?"Showing ":"Showing ")+visible+(lang==="zh-Hans"?" Q&A pairs":" Q&A pairs");const mobileToggle=document.getElementById("mobileFilterToggle");if(mobileToggle)mobileToggle.textContent=(lang==="zh-Hans"?"Search/filter · Showing ":"Search/filter · Showing ")+visible+(lang==="zh-Hans"?" pairs":" pairs");if(empty)empty.hidden=visible!==0}
buttons.forEach(btn=>{if(!btn.hasAttribute("aria-pressed"))btn.setAttribute("aria-pressed","false");btn.addEventListener("click",()=>{buttons.forEach(x=>{x.classList.remove("active");x.setAttribute("aria-pressed","false")});btn.classList.add("active");btn.setAttribute("aria-pressed","true");mode=btn.dataset.filterKeypoints?{type:"keypoints",value:"keypoints"}:btn.dataset.filter==="all"?{type:"all",value:"all"}:btn.dataset.filter?{type:"exact",value:btn.dataset.filter}:{type:"prefix",value:btn.dataset.filterPrefix};applyFilter()})});search?.addEventListener("input",applyFilter);
const toolsPanel=document.querySelector(".dialogue-tools"),mobileToggle=document.getElementById("mobileFilterToggle");mobileToggle?.addEventListener("click",()=>{const open=toolsPanel.classList.toggle("panel-open");mobileToggle.setAttribute("aria-expanded",String(open))});
document.getElementById("expandAll")?.addEventListener("click",()=>chapters.filter(x=>!x.hidden).forEach(x=>x.open=true));document.getElementById("collapseAll")?.addEventListener("click",()=>chapters.forEach(x=>x.open=false));
const heroPoster=document.getElementById("day8HeroPoster");
if(heroPoster){heroPoster.src=lang==="zh-Hans"?heroPoster.dataset.srcHans:heroPoster.dataset.srcHant;heroPoster.alt=lang==="zh-Hans"?"Remembering tragedy: Day 8 sentencing-evidence poster, court, evidence sheets and a symbolic child’s back in blue-white stripes":"Remembering tragedy: Day 8 sentencing-evidence poster, court, evidence sheets and a symbolic child’s back in blue-white stripes"}
document.documentElement.lang=lang;document.querySelectorAll("[data-language]").forEach(a=>a.setAttribute("aria-current",String(a.dataset.language===lang)));
function applySimplified(){if(lang!=="zh-Hans"||!window.OpenCC?.Converter)return;const convert=OpenCC.Converter({from:"tw",to:"cn"});const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(node){const p=node.parentElement;if(!p||/^(SCRIPT|STYLE|CODE)$/.test(p.tagName))return NodeFilter.FILTER_REJECT;return node.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(n=>n.nodeValue=convert(n.nodeValue));document.title=convert(document.title)}
if(document.readyState==="complete")applySimplified();else window.addEventListener("load",applySimplified,{once:true});
const copy=document.getElementById("copyCitation");copy?.addEventListener("click",async()=>{const citation="Prison Watch, DAY8 | May 5, 2025, eighth hearing; Child Protection Action Alliance reconstruction: "+location.href.split("?")[0];try{await navigator.clipboard.writeText(citation);copy.textContent="Citation copied"}catch{copy.textContent="Please copy the URL manually"}setTimeout(()=>copy.textContent="Copy citation",2200)});
window.addEventListener("load",()=>{if(!window.gsap||matchMedia("(prefers-reduced-motion: reduce)").matches)return;gsap.registerPlugin(window.ScrollTrigger);if(document.querySelector(".paper-cloud"))gsap.to(".paper-cloud",{x:18,y:-8,duration:5.5,repeat:-1,yoyo:true,ease:"sine.inOut"});if(document.querySelector(".red-thread"))gsap.to(".red-thread",{strokeDashoffset:-90,duration:6,repeat:-1,ease:"none",attr:{"stroke-dasharray":"18 13"}});if(document.querySelector(".dust circle"))gsap.to(".dust circle",{y:-22,opacity:.2,duration:3.5,stagger:.4,repeat:-1,yoyo:true,ease:"sine.inOut"});if(document.querySelector(".stage-ribbons path"))gsap.from(".stage-ribbons path",{scaleX:.82,transformOrigin:"50% 50%",duration:1.1,stagger:.13,ease:"power3.out"})},{once:true});
})();
