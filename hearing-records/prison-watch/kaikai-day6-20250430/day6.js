const topbar=document.querySelector('.top');
const menu=document.querySelector('#menu');
menu?.addEventListener('click',()=>{const open=topbar.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
document.querySelectorAll('.top a').forEach(a=>a.addEventListener('click',()=>topbar.classList.remove('open')));
const load=document.querySelector('#loadText');
const raw=document.querySelector('#rawText');
let loaded=false;
load?.addEventListener('click',async()=>{const show=raw.hidden;raw.hidden=!show;load.setAttribute('aria-expanded',String(show));load.textContent=show?'收合可搜尋全文':'展開可搜尋全文';if(show&&!loaded){try{const r=await fetch('../../../assets/documents/prison-watch-day6-20250430.txt');if(!r.ok)throw Error();raw.textContent=await r.text();loaded=true;}catch{raw.textContent='全文載入失敗，請改用上方 PDF 原件。';}}});
