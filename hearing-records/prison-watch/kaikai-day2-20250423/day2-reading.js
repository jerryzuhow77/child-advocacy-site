(() => {
  'use strict';
  const base=document.currentScript?.src||location.href;
  const load=src=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=new URL(src,base).href;s.onload=resolve;s.onerror=reject;document.head.append(s);});
  (async()=>{
    try{await load('./day2-reading-core-20260821.js');}catch(error){console.error('Day 2 reading core failed to load',error);}
    try{await load('../../../assets/witness-tensions-day2-data-20260821.js?v=20260821-1');await load('../../../assets/witness-testimony-tensions-20260821.js?v=20260821-2');}catch(error){console.error('Witness cross-check module failed to load',error);}
  })();
})();
