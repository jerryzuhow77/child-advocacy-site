/* Related reading panel for the Liu Cai-xuan / Liu Ruo-lin separate case. */
(() => {
  const base = '/child-advocacy-site/';
  const dates = ['2025.04.22','2025.04.23','2025.04.25','2025.04.28','2025.04.29','2025.04.30','2025.05.02','2025.05.05','2025.05.06','2025.05.07'];
  const slugs = ['kaikai-day1-20250422','kaikai-day2-20250423','kaikai-day3-20250425','kaikai-day4-20250428','kaikai-day5-20250429','kaikai-day6-20250430','kaikai-day7-20250502','kaikai-day8-20250505','kaikai-day9-20250506','kaikai-day10-20250507'];
  const words = {
    'zh-Hant': {title:'延伸閱讀｜剴剴案十日審判與林童筆記',sub:'十日庭審紀錄',lin:'林童旁聽筆記 →'},
    'zh-Hans': {title:'延伸阅读｜剀剀案十日庭审与林童笔记',sub:'十日庭审记录',lin:'林童旁听笔记 →'},
    en: {title:'Related reading | ten hearing records and Lin-child notes',sub:'Ten hearing records',lin:'Lin-child observation notes →'},
    ja: {title:'関連資料｜10回の公判記録と林姓児童の傍聴メモ',sub:'10回の公判記録',lin:'林姓児童の傍聴メモ →'}
  };
  function locale(){
    const q=new URLSearchParams(location.search).get('lang');
    if(q==='zh-Hans'||q==='zh-CN') return 'zh-Hans';
    const l=document.documentElement.lang;
    return words[l]?l:'zh-Hant';
  }
  function prefix(l){return l==='zh-Hans'?'zh-Hans/':l==='en'?'en/':l==='ja'?'ja/':'';}
  function render(){
    const root=document.querySelector('#detail-liu .case-body');
    if(!root||root.querySelector('[data-liu-related-reading]')) return;
    const l=locale(), w=words[l], p=prefix(l);
    const section=document.createElement('section');
    section.className='liu-related-reading';
    section.dataset.liuRelatedReading='';
    section.setAttribute('aria-label',w.title);
    const heading=document.createElement('h3'); heading.textContent=w.title;
    const label=document.createElement('p'); label.className='liu-related-label'; label.textContent=w.sub;
    const list=document.createElement('nav'); list.className='liu-ten-day-links'; list.setAttribute('aria-label',w.sub);
    slugs.forEach((slug,i)=>{const a=document.createElement('a');a.href=base+p+'hearing-records/prison-watch/'+slug+'/';a.textContent='DAY '+String(i+1).padStart(2,'0')+' · '+dates[i];list.append(a);});
    const lin=document.createElement('a');lin.className='liu-lin-note';lin.href=base+'hearing-records/liu-ruolin-lin-child-20260713/'+(l==='zh-Hant'?'':l+'/');lin.textContent=w.lin;
    section.append(heading,label,list,lin); root.append(section);
  }
  const style=document.createElement('style');
  style.textContent=`
    .liu-related-reading{margin-top:1.7em;padding:20px;border:1px solid #cadbd5;border-left:5px solid #b25142;border-radius:12px;background:linear-gradient(135deg,#fffaf0,#eff6f1)}
    .liu-related-reading h3{margin:0 0 7px;font-size:1.04rem;line-height:1.5;color:#244951}
    .liu-related-label{margin:0 0 12px!important;color:#8d4b3e;font-size:.82rem;font-weight:900;letter-spacing:.08em}
    .liu-ten-day-links{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
    .liu-ten-day-links a,.liu-lin-note{display:flex;align-items:center;min-height:38px;padding:8px 10px;border:1px solid #b9cec5;border-radius:8px;background:#fffdf8;color:#1d5764!important;font-size:.83rem;font-weight:850;text-decoration:none}
    .liu-ten-day-links a:hover,.liu-lin-note:hover{border-color:#b25142;background:#fff3e5}
    .liu-lin-note{margin-top:11px;border-color:#c9966b;background:#fdf1e4}
    @media(max-width:560px){.liu-related-reading{padding:16px}.liu-ten-day-links{grid-template-columns:1fr;gap:7px}.liu-ten-day-links a,.liu-lin-note{font-size:.8rem;min-height:40px}}
  `;
  document.head.append(style); render();
})();