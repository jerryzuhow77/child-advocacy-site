(()=>{'use strict';
const E='https://sweet-art-bed8child-advocacy-page-views.jerryzuhow77.workers.dev/weekly';
const A=[
['case-xuanxuan-shared','cases/xuanxuan/',['萱萱案','萱萱案','Xuan Xuan case','萱萱さんの事案'],46],
['historical-fujian-qiqi-shared','historical-cases/regions/mainland-china/fujian-qiqi/',['福建琪琪案','福建琪琪案','Fujian Qiqi case','福建・琪琪さんの事案'],36],
['historical-tian-tian-shared','historical-cases/regions/mainland-china/tian-tian/',['田田案','田田案','Tian Tian case','甜甜さんの事案'],64],
['historical-wanghao-shared','historical-cases/regions/taiwan/wanghao/',['王昊案','王昊案','Wang Hao case','王昊さんの事案'],70],
['historical-fu-junxiang-shared','historical-cases/regions/taiwan/fu-junxiang/',['傅俊祥案','傅俊祥案','Fu Junxiang case','傅俊祥さんの事案'],51]];
const C=[
['本週最多閱讀','依本週精選案件專題的實際閱讀次數排序。','次閱讀','每週重新累積','暫估熱度（週數據累積中）','暫估熱度'],
['本周最多阅读','依本周精选案件专题的实际阅读次数排序。','次阅读','每周重新累积','暂估热度（周数据累积中）','暂估热度'],
['Most read this week','Ranked by real weekly reads across selected case features.','reads','Resets weekly','Estimated interest while weekly data builds','estimated interest'],
['今週よく読まれている記事','選定した事件特集の今週の実際の閲覧数による順位です。','回閲覧','毎週リセット','暫定の関心度（週次データを集計中）','暫定の関心度']];
const L=()=>{let l=(document.documentElement.lang||'').toLowerCase();return l.startsWith('zh-hans')?1:l.startsWith('en')?2:l.startsWith('ja')?3:0};
const start=async h=>{let l=L(),c=C[l],p=l===2?'../en/':l===3?'../ja/':'./',estimated=false;
h.className='home-section weekly-reading';
h.innerHTML='<div class="section-heading"><div><span class="weekly-kicker">'+c[3]+'</span><h2 id="weekly-reading-title">'+c[0]+'</h2><p>'+c[1]+'</p></div></div><ol class="weekly-list" aria-labelledby="weekly-reading-title"></ol>';
let list=h.querySelector('ol'),v=[];
try{let r=await fetch(E+'?keys='+encodeURIComponent(A.map(x=>x[0]).join(','))+'&ts='+Date.now(),{cache:'no-store'});if(!r.ok)throw 0;let d=await r.json(),m=new Map((d.items||[]).map(x=>[x.key,+x.count||0])),raw=A.map(x=>({key:x[0],path:x[1],title:x[2],actual:m.get(x[0])||0,estimate:x[3]})),total=raw.reduce((sum,x)=>sum+x.actual,0),covered=raw.filter(x=>x.actual).length;v=total>=10&&covered>=2?raw.filter(x=>x.actual).sort((a,b)=>b.actual-a.actual):[]}catch(_){}
if(!v.length){estimated=true;v=A.map(x=>({key:x[0],path:x[1],title:x[2],estimate:x[3]})).sort((a,b)=>b.estimate-a.estimate)}
if(estimated){h.querySelector('.weekly-kicker').textContent=c[4];h.querySelector('.section-heading p').textContent=c[4]}
for(let[x,i]of v.map((x,i)=>[x,i])){let q=document.createElement('li'),a=document.createElement('a'),n=estimated?x.estimate:x.actual;a.href=p+x.path;a.innerHTML='<span class="weekly-rank" aria-label="rank '+String(i+1)+'">'+String(i+1).padStart(2,'0')+'</span><span class="weekly-item-copy"><strong>'+x.title[l]+'</strong><em>'+new Intl.NumberFormat().format(n)+' '+(estimated?c[5]:c[2])+'</em></span>';q.className='weekly-item weekly-item--'+(i+1);q.append(a);list.append(q)}};
let s=()=>document.querySelectorAll('[data-weekly-reading]').forEach(start);document.readyState==='loading'?document.addEventListener('DOMContentLoaded',s,{once:true}):s()})();