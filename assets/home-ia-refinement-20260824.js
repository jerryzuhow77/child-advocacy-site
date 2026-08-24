(()=>{"use strict";
const ready=()=>{
 const reading=document.getElementById("ia-reading");
 const special=document.getElementById("home-special-features");
 const historical=document.getElementById("home-historical-cases");
 const social=[...document.querySelectorAll("section")].find(s=>/社會案件專區/.test(s.querySelector("h2")?.textContent||""));
 if(reading&&social&&historical&&!document.querySelector(".case-database-intro")){
   const intro=document.createElement("div");
   intro.className="case-database-intro";
   intro.innerHTML='<small class="art-eyebrow dark">CASE DATABASE · TRACKING & ARCHIVE</small><h2>案件資料庫</h2><p>從正在發生的司法進度，走進不該被時間帶走的歷史檔案；依追蹤狀態、地區與議題找到完整紀錄。</p><div class="case-database-tabs" role="tablist" aria-label="案件資料庫分類"><button class="case-database-tab" type="button" role="tab" aria-selected="true" data-case-tab="live">持續追蹤</button><button class="case-database-tab" type="button" role="tab" aria-selected="false" data-case-tab="history">歷史檔案</button><a class="case-database-tab" href="./cases/">依地區／議題</a></div>';
   social.before(intro);
   historical.classList.add("case-db-hidden");
   intro.querySelectorAll("[data-case-tab]").forEach(btn=>btn.addEventListener("click",()=>{
     const history=btn.dataset.caseTab==="history";
     social.classList.toggle("case-db-hidden",history);
     historical.classList.toggle("case-db-hidden",!history);
     intro.querySelectorAll("[data-case-tab]").forEach(b=>b.setAttribute("aria-selected",String(b===btn)));
     if(history) historical.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
   }));
 }
 const wall=document.getElementById("global-protection-wall");
 const why=[...document.querySelectorAll("section")].find(s=>/勿忘剴剴｜我們為什麼持續行動/.test(s.querySelector("h2")?.textContent||""));
 if(wall&&why&&wall.parentElement) wall.parentElement.insertBefore(why,wall);
 const map=document.getElementById("home-historical-cases");
 if(map&&"IntersectionObserver" in window){
   new IntersectionObserver(es=>document.body.classList.toggle("case-map-in-view",es.some(e=>e.isIntersecting)),{threshold:.12}).observe(map);
 }
};
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ready,{once:true}):ready();
})();