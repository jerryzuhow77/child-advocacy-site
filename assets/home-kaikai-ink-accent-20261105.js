(()=>{
  const asset='/child-advocacy-site/assets/kaikai-guardian-ink-20261105.webp';
  const mount=()=>{
    const aside=document.querySelector('#guardian-wall-gateway aside');
    if(!aside||aside.querySelector('.gwg-kaikai'))return false;
    const hans=document.documentElement.lang==='zh-Hans';
    const figure=document.createElement('figure');
    figure.className='gwg-kaikai';
    const image=document.createElement('img');
    image.src=asset;
    image.alt=hans?'象征性的剀剀守护水墨纸艺：匿名孩子背影与宣纸守护双手，非真实肖像或事件现场':'象徵性的剴剴守護水墨紙藝：匿名孩子背影與宣紙守護雙手，非真實肖像或事件現場';
    image.loading='lazy';
    image.decoding='async';
    const caption=document.createElement('figcaption');
    caption.textContent=hans?'剀剀守护意象・非真实肖像':'剴剴守護意象・非真實肖像';
    figure.append(image,caption);
    aside.prepend(figure);
    if(!document.getElementById('gwg-kaikai-style')){
      const style=document.createElement('style');
      style.id='gwg-kaikai-style';
      style.textContent='.gwg-kaikai{position:relative;margin:-14px -12px 22px;padding:7px;overflow:hidden;border:1px solid rgba(35,73,69,.2);background:rgba(255,252,244,.72);box-shadow:0 15px 35px rgba(37,58,52,.1)}.gwg-kaikai:after{content:"";position:absolute;inset:7px;pointer-events:none;background:linear-gradient(180deg,transparent 55%,rgba(17,48,46,.58))}.gwg-kaikai img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;object-position:55% center;filter:saturate(.88) contrast(.98)}.gwg-kaikai figcaption{position:absolute;z-index:2;left:18px;bottom:16px;padding:6px 9px;border-left:2px solid #d2aa61;background:rgba(17,51,49,.7);color:#fff9ed;font-size:9px;letter-spacing:.08em;backdrop-filter:blur(7px)}@media(max-width:900px){.gwg-kaikai img{aspect-ratio:16/8;object-position:center 48%}}@media(max-width:560px){.gwg-kaikai{margin:-9px -7px 18px}.gwg-kaikai img{aspect-ratio:4/3}.gwg-kaikai figcaption{left:15px;bottom:13px}}';
      document.head.append(style);
    }
    return true;
  };
  const start=()=>{
    if(mount())return;
    const observer=new MutationObserver(()=>{if(mount())observer.disconnect()});
    observer.observe(document.body,{childList:true,subtree:true});
    window.setTimeout(()=>observer.disconnect(),12000);
  };
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start,{once:true}):start();
})();

