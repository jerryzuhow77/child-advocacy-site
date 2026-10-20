(()=>{"use strict";
document.documentElement.classList.add("js-ready");
const menu=document.getElementById("menuButton"),nav=document.getElementById("siteNav");
if(menu&&nav){menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open))});nav.addEventListener("click",e=>{if(e.target.closest("a")){nav.classList.remove("open");menu.setAttribute("aria-expanded","false")}})}
const reveals=[...document.querySelectorAll(".reveal")];
if("IntersectionObserver"in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in-view");io.unobserve(e.target)}}),{rootMargin:"0px 0px -8% 0px",threshold:.08});reveals.forEach(el=>io.observe(el))}else reveals.forEach(el=>el.classList.add("in-view"));
const cards=[...document.querySelectorAll(".qa-card")],search=document.getElementById("qaSearch"),count=document.getElementById("qaCount"),empty=document.getElementById("qaEmpty"),buttons=[...document.querySelectorAll(".filter-buttons button")];
const qaList=document.getElementById("qaList"),chapterDefs=[
  {key:"family",prefixes:["family"],title:"第1章｜A児の祖母の証言全文"},
  {key:"doctor-caixuan",prefixes:["doctor-caixuan"],title:"第2章｜彩萱弁護側から徐医師への質問"},
  {key:"doctor-ruolin",prefixes:["doctor-ruolin"],title:"第3章｜若琳弁護側から徐医師への質問"},
  {key:"doctor-prosecutor",prefixes:["doctor-prosecutor"],title:"第4章｜検察から徐医師への質問"},
  {key:"doctor-judge",prefixes:["doctor-judge"],title:"第5章｜裁判長から徐医師への質問"}
];
const crossrefMap={
  "02":[["#family-xref-placement","戻る｜養子縁組・養育者交代の照合"]],"03":[["#family-xref-placement","戻る｜養子縁組・養育者交代の照合"]],"06":[["#family-xref-health","戻る｜引継ぎ前の健康の照合"]],"07":[["#family-xref-health","戻る｜引継ぎ前の健康の照合"]],"08":[["#family-xref-placement","戻る｜養子縁組・養育者交代の照合"]],"10":[["#family-xref-contact","戻る｜面会・連絡の照合"]],"11":[["#family-xref-placement","戻る｜養子縁組・養育者交代の照合"]],"12":[["#family-xref-health","戻る｜引継ぎ前の健康の照合"]],"15":[["#family-xref-repair","戻る｜事件後の修復の照合"]],"17":[["#family-xref-repair","戻る｜事件後の修復の照合"]],"19":[["#family-xref-repair","戻る｜事件後の修復の照合"]],
  "28":[["#doctor-xref-self-harm","戻る｜自傷説の照合"]],"44":[["#doctor-xref-mental-state","戻る｜精神自述・治療の照合"]],"46":[["#doctor-xref-self-harm","戻る｜自傷説の照合"],["#doctor-xref-responsibility","戻る｜責任評価の照合"]],"48":[["#doctor-xref-mental-state","戻る｜精神自述・治療の照合"]],"50":[["#doctor-xref-mental-state","戻る｜精神自述・治療の照合"]],"51":[["#doctor-xref-recovery","戻る｜危険・復帰の照合"]],"58":[["#doctor-xref-responsibility","戻る｜責任評価の照合"]],"59":[["#doctor-xref-recovery","戻る｜危険・復帰の照合"]],"61":[["#doctor-xref-recovery","戻る｜危険・復帰の照合"]]
};
const keypointDefs={
  "01":{tone:"eyewitness",labels:[["直接見聞","is-eyewitness"]],phrases:["約2か月"],summary:"祖母はA児を約2か月実際に世話したと述べています。",boundary:"自身の養育期間の直接見聞に限られます。"},
  "03":{tone:"source",labels:[["手続の陳述","is-source"],["出典の限界","is-limit"]],phrases:["社会局が提案","その後児童福利連盟へ紹介"],summary:"社会局の提案後、連盟へ紹介された養子縁組経路を説明しています。",boundary:"流れは機関書類や担当者証言と分けて確認が必要です。"},
  "06":{tone:"eyewitness",labels:[["直接見聞","is-eyewitness"]],phrases:["月に2回以上"],summary:"当時月2回以上面会したと述べています。",boundary:"その期間の面会頻度のみを示します。"},
  "07":{tone:"eyewitness",labels:[["直接見聞","is-eyewitness"]],phrases:["健康で活発、いたずら好きでかわいかった"],summary:"周保育者の期間の印象は健康・活発でした。",boundary:"初期基準であり、その後毎日の状態は直接推定できません。"},
  "08":{tone:"emotion",labels:[["家庭の状況","is-source"],["感情の陳述","is-emotion"]],phrases:["私たちには無理","月5、6万台湾ドルの収入"],summary:"養子縁組を養育能力、労働時間、家族の負担と結びつけています。",boundary:"家族の感情と客観的財務資料は分けて理解します。"},
  "10":{tone:"source",labels:[["直接見聞","is-eyewitness"],["出典からの伝聞","is-source"]],phrases:["訪ねませんでした","担当者からA児の様子を聞きました"],summary:"未訪問は自身の行動、引継ぎ後の様子は担当者からの伝聞です。",boundary:"証拠源が異なり、直接見聞にまとめられません。"},
  "12":{tone:"emotion",labels:[["直接見聞","is-eyewitness"],["感情の陳述","is-emotion"]],phrases:["とても健康","本当につらいです（泣き始める）"],summary:"引継ぎ前の健康の印象と法廷での感情反応を含みます。",boundary:"健康の印象と感情は分けて読み取ります。"},
  "13":{tone:"emotion",labels:[["感情の陳述","is-emotion"]],phrases:["本当に自分を責めています。本当にどうしようもなく"],summary:"死後の気持ちを自責・無力感で表しています。",boundary:"感情・価値の陳述は法的責任認定ではありません。"},
  "15":{tone:"eyewitness",labels:[["直接見聞","is-eyewitness"],["修復の境界","is-limit"]],phrases:["両被告人はありません","連盟は一度連絡しましたが、断りました"],summary:"被告人は連絡せず、連盟の一度の連絡は断ったと述べています。",boundary:"連絡の有無と修復の受入れは別です。"},
  "16":{tone:"limit",labels:[["不明確","is-limit"]],phrases:["昔すぎて覚えていません"],summary:"連盟の連絡時刻は確認できません。",boundary:"他の話から日付を補いません。"},
  "17":{tone:"emotion",labels:[["直接見聞","is-eyewitness"],["修復の境界","is-limit"]],phrases:["ありましたが、望みません"],summary:"被告人の家族が賠償・和解を話しましたが、祖母は明確に拒みました。",boundary:"接触の提案は和解成立ではありません。"},
  "19":{tone:"limit",labels:[["不明確","is-limit"]],phrases:["よく分かりません"],summary:"付帯民事の提起は明確に確認していません。",boundary:"提起済み・未提起と書き換えず、手続資料に従います。"},
  "20":{tone:"source",labels:[["被告人の陳述","is-source"],["第三者の陳述","is-source"]],phrases:["気分が落ち込みガラスを割って自傷した","若琳の息子は"],summary:"同じ回答に彩萱の自述と若琳の息子の第三者説明が混在します。",boundary:"出典が異なり、どちらも医師の直接目撃ではありません。"},
  "22":{tone:"limit",labels:[["鑑定の限界","is-limit"]],phrases:["本当のところを見通せません","確定後に面接"],summary:"訴訟状況が現時点の面接の理解を制約すると説明しています。",boundary:"犯行原因の確定結論ではありません。"},
  "23":{tone:"assessment",labels:[["鑑定意見","is-assessment"],["反対方向の資料","is-limit"]],phrases:["介入できない閉鎖環境","別の子の世話には問題がありませんでした"],summary:"閉鎖環境と、別の子に同じ養育問題がなかった点を併記します。",boundary:"環境だけで個人の行為や他の証拠を代用できません。"},
  "27":{tone:"assessment",labels:[["鑑定意見","is-assessment"]],phrases:["個人が最も重要な影響"],summary:"複数要因中、個人要因を最重要と評価しています。",boundary:"鑑定意見で、採用は裁判所が判断します。"},
  "28":{tone:"limit",labels:[["鑑定意見","is-assessment"],["証拠の限界","is-limit"]],phrases:["A児に本当にこれらの行動があったかは確認困難","治療にはまず動機が必要","待つ必要"],summary:"被告人のいうA児の行動を証明済みとせず、治療を動機・訴訟段階に条件づけています。",boundary:"子の行動、治療動機、責任評価は3つの別問題です。"},
  "32":{tone:"limit",labels:[["専門範囲の限界","is-limit"]],phrases:["施設の資源に関する知識は限られます"],summary:"施設治療資源への知識を明確に限定しています。",boundary:"個別処遇の提案は施設の現存資源の確認ではありません。"},
  "39":{tone:"limit",labels:[["原記録空欄","is-limit"]],phrases:[],summary:"元の問答表に鑑定人回答はありません。",boundary:"後の裁判長説明や別資料で補いません。"},
  "44":{tone:"assessment",labels:[["被告人の陳述","is-source"],["鑑定意見","is-assessment"]],phrases:["3回目から幻聴を自述","診断上の現れとは大きく違います"],summary:"幻聴説の出現時点と診断的現れの一致を比較しています。",boundary:"自述と専門判断は分けて示します。"},
  "46":{tone:"assessment",labels:[["中核鑑定意見","is-assessment"]],phrases:["一時の衝動的制御喪失でなく","引下げの可能性はありません"],summary:"長期行為と既存の養育能力で責任引下げ判断を説明しています。",boundary:"鑑定人の量刑意見であり判決ではありません。"},
  "47":{tone:"limit",labels:[["被告人の陳述","is-source"],["観察なし","is-limit"]],phrases:["自分をかむと言いました","傷は見ませんでした"],summary:"自傷の申告と傷を見なかった観察を区別しています。",boundary:"傷の未確認から行為の有無を確定できません。"},
  "48":{tone:"assessment",labels:[["治療の前提","is-limit"]],phrases:["治療の動機が必要"],summary:"治療動機を復帰の重要前提としています。",boundary:"動機があっても責任刑が当然に下がるわけではありません。"},
  "51":{tone:"limit",labels:[["危険性判断","is-assessment"],["条件付き結論","is-limit"]],phrases:["確かにまだ危険があります","隔離要因がなければ"],summary:"彩萱の復帰評価には危険・隔離の条件が残ります。",boundary:"無条件の低危険結論ではありません。"},
  "57":{tone:"assessment",labels:[["概念説明","is-assessment"]],phrases:["異なる認知によって","自分や他人の不道徳な行動"],summary:"道徳的離脱の機制を平易に説明しています。",boundary:"概念説明で本件事実が証明されたわけではありません。"},
  "58":{tone:"assessment",labels:[["中核鑑定意見","is-assessment"]],phrases:["そのとおり、不利な発達要因はありません"],summary:"第4～6号の生活、品行、知識・知的水準で引下げなしと確認しています。",boundary:"鑑定意見と最終量刑判断を区別します。"},
  "59":{tone:"limit",labels:[["条件付き結論","is-limit"],["復帰評価","is-assessment"]],phrases:["彩萱が始め、若琳が後から加わったことが前提","その要因を除けば"],summary:"若琳の高い可能性は行為順序の特定前提に基づきます。",boundary:"無条件の復帰結論でも責任の自動引下げでもありません。"},
  "60":{tone:"limit",labels:[["経験の開示","is-limit"]],phrases:["4件、うち量刑が2件"],summary:"徐医師は4件、うち量刑鑑定2件と説明しました。",boundary:"裁判所が専門意見を評価する経験的基盤です。"},
  "61":{tone:"assessment",labels:[["概念説明","is-assessment"],["反対方向の資料","is-limit"]],phrases:["環境要因","迎えに来るから"],summary:"外的統制は送迎等の介入・監督可能な環境要因と説明されます。",boundary:"別の子には同様の現象がなく、閉鎖環境を唯一の原因とできません。"}
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
  boundary.textContent="限界｜"+def.boundary;
  note.append(badges,summary,boundary);
  card.appendChild(note);
}
cards.forEach(card=>{const number=(card.querySelector("header span")?.textContent||"").trim().padStart(2,"0");if(!number)return;card.id="qa-"+number;addKeypointAnnotation(card,number);const links=crossrefMap[number];if(!links)return;const back=document.createElement("nav");back.className="qa-crosslinks";back.setAttribute("aria-label","本問の証人横断照合");links.forEach(([href,label])=>{const a=document.createElement("a");a.href=href;a.textContent=label;back.appendChild(a)});card.appendChild(back)});
if(qaList&&cards.length){chapterDefs.forEach((def,index)=>{const members=cards.filter(card=>def.prefixes.some(prefix=>(card.dataset.group||"").startsWith(prefix)));if(!members.length)return;const details=document.createElement("details");details.className="qa-chapter";details.open=index<2;details.dataset.chapter=def.key;const summary=document.createElement("summary");summary.textContent=def.title+"・"+members.length+"組";const body=document.createElement("div");body.className="qa-chapter-body";members.forEach(card=>{const label=card.querySelector("header small")?.textContent||def.title;card.setAttribute("aria-label",label);body.appendChild(card)});details.append(summary,body);qaList.appendChild(details)})}
const chapters=[...document.querySelectorAll(".qa-chapter")];
function revealHashTarget(){const id=decodeURIComponent(location.hash.slice(1));if(!id)return;const target=document.getElementById(id);if(!target)return;const chapter=target.closest(".qa-chapter");if(chapter){chapter.hidden=false;chapter.open=true}document.querySelectorAll(".xref-target").forEach(el=>el.classList.remove("xref-target"));target.classList.add("xref-target");requestAnimationFrame(()=>target.scrollIntoView({block:"start",behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}))}
if(location.hash)setTimeout(revealHashTarget,60);window.addEventListener("hashchange",revealHashTarget);
const lang="ja";
let mode={type:"all",value:"all"};
function applyFilter(){const term=(search?.value||"").trim().toLocaleLowerCase();let visible=0;cards.forEach(card=>{const group=card.dataset.group||"";const groupOK=mode.type==="all"||mode.type==="exact"&&group===mode.value||mode.type==="prefix"&&group.startsWith(mode.value)||mode.type==="keypoints"&&card.dataset.keypoint==="true";const textOK=!term||card.textContent.toLocaleLowerCase().includes(term);card.hidden=!(groupOK&&textOK);if(!card.hidden){visible++;card.classList.add("in-view")}});chapters.forEach(chapter=>{const hasVisible=[...chapter.querySelectorAll(".qa-card")].some(card=>!card.hidden);chapter.hidden=!hasVisible;if(hasVisible&&(term||mode.type!=="all"))chapter.open=true});if(count)count.textContent=(lang==="zh-Hans"?"表示：":"表示：")+visible+(lang==="zh-Hans"?"組の問答":"組の問答");const mobileToggle=document.getElementById("mobileFilterToggle");if(mobileToggle)mobileToggle.textContent=(lang==="zh-Hans"?"検索／絞込み・表示：":"検索／絞込み・表示：")+visible+(lang==="zh-Hans"?"組":"組");if(empty)empty.hidden=visible!==0}
buttons.forEach(btn=>{if(!btn.hasAttribute("aria-pressed"))btn.setAttribute("aria-pressed","false");btn.addEventListener("click",()=>{buttons.forEach(x=>{x.classList.remove("active");x.setAttribute("aria-pressed","false")});btn.classList.add("active");btn.setAttribute("aria-pressed","true");mode=btn.dataset.filterKeypoints?{type:"keypoints",value:"keypoints"}:btn.dataset.filter==="all"?{type:"all",value:"all"}:btn.dataset.filter?{type:"exact",value:btn.dataset.filter}:{type:"prefix",value:btn.dataset.filterPrefix};applyFilter()})});search?.addEventListener("input",applyFilter);
const toolsPanel=document.querySelector(".dialogue-tools"),mobileToggle=document.getElementById("mobileFilterToggle");mobileToggle?.addEventListener("click",()=>{const open=toolsPanel.classList.toggle("panel-open");mobileToggle.setAttribute("aria-expanded",String(open))});
document.getElementById("expandAll")?.addEventListener("click",()=>chapters.filter(x=>!x.hidden).forEach(x=>x.open=true));document.getElementById("collapseAll")?.addEventListener("click",()=>chapters.forEach(x=>x.open=false));
const heroPoster=document.getElementById("day8HeroPoster");
if(heroPoster){heroPoster.src=lang==="zh-Hans"?heroPoster.dataset.srcHans:heroPoster.dataset.srcHant;heroPoster.alt=lang==="zh-Hans"?"悲劇を忘れない：第8回公判の量刑証拠ポスター。法廷、証拠の紙、青白の縞服の象徴的な子の後ろ姿":"悲劇を忘れない：第8回公判の量刑証拠ポスター。法廷、証拠の紙、青白の縞服の象徴的な子の後ろ姿"}
document.documentElement.lang=lang;document.querySelectorAll("[data-language]").forEach(a=>a.setAttribute("aria-current",String(a.dataset.language===lang)));
function applySimplified(){if(lang!=="zh-Hans"||!window.OpenCC?.Converter)return;const convert=OpenCC.Converter({from:"tw",to:"cn"});const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(node){const p=node.parentElement;if(!p||/^(SCRIPT|STYLE|CODE)$/.test(p.tagName))return NodeFilter.FILTER_REJECT;return node.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(n=>n.nodeValue=convert(n.nodeValue));document.title=convert(document.title)}
if(document.readyState==="complete")applySimplified();else window.addEventListener("load",applySimplified,{once:true});
const copy=document.getElementById("copyCitation");copy?.addEventListener("click",async()=>{const citation="監所關注小組〈DAY8｜2025年5月5日第8回公判〉子ども保護行動連盟再編集："+location.href.split("?")[0];try{await navigator.clipboard.writeText(citation);copy.textContent="出典をコピーしました"}catch{copy.textContent="URLを手動でコピーしてください"}setTimeout(()=>copy.textContent="出典をコピー",2200)});
window.addEventListener("load",()=>{if(!window.gsap||matchMedia("(prefers-reduced-motion: reduce)").matches)return;gsap.registerPlugin(window.ScrollTrigger);if(document.querySelector(".paper-cloud"))gsap.to(".paper-cloud",{x:18,y:-8,duration:5.5,repeat:-1,yoyo:true,ease:"sine.inOut"});if(document.querySelector(".red-thread"))gsap.to(".red-thread",{strokeDashoffset:-90,duration:6,repeat:-1,ease:"none",attr:{"stroke-dasharray":"18 13"}});if(document.querySelector(".dust circle"))gsap.to(".dust circle",{y:-22,opacity:.2,duration:3.5,stagger:.4,repeat:-1,yoyo:true,ease:"sine.inOut"});if(document.querySelector(".stage-ribbons path"))gsap.from(".stage-ribbons path",{scaleX:.82,transformOrigin:"50% 50%",duration:1.1,stagger:.13,ease:"power3.out"})},{once:true});
})();
