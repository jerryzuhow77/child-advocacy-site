(()=>{
  const root='/child-advocacy-site/';
  const briefId='tainan-probation-baseball-support-20261116';
  const layoutStyleId='tainan-two-week-carousel-layout-20261117';

  function language(){
    return document.documentElement.lang==='zh-Hans'?'zh-Hans':
      document.documentElement.lang==='ja'?'ja':
      document.documentElement.lang==='en'?'en':'zh-Hant';
  }

  const copy={
    'zh-Hant':{path:'',meta:'首頁置頂｜護童快報・2026.11.17',title:'球場之外，少年支持如何接力？',summary:'台南觀護盃壘球賽已舉行；一次活動不是成效證明。從陪伴、資源與穩定轉銜，繼續追問支持能否真正接住少年。',read:'閱讀完整報導 →',alt:'夕陽下的棒壘球場與本壘板插畫。'},
    'zh-Hans':{path:'zh-Hans/',meta:'首页置顶｜护童快报・2026.11.17',title:'球场之外，少年支持如何接力？',summary:'台南观护杯垒球赛已经举行；一次活动不是成效证明。继续追问陪伴、资源与稳定转衔能否真正接住少年。',read:'阅读完整报道 →',alt:'夕阳下的棒垒球场与本垒板插画。'},
    en:{path:'en/',meta:'PINNED · CHILD-PROTECTION BRIEF · 17 NOV 2026',title:'Beyond the field: how does support stay with a young person?',summary:'The Tainan Probation Cup took place. One event is not proof of outcomes; the follow-up question is whether sustained support and transitions are actually available.',read:'Read the brief →',alt:'An illustrated baseball field and home plate at sunset.'},
    ja:{path:'ja/',meta:'固定・子ども保護速報｜2026年11月17日',title:'グラウンドの外で、少年への支援をどうつなぐか？',summary:'台南観護杯ソフトボール大会は実施されました。一度の大会を成果とせず、継続した支援と移行を問い続けます。',read:'記事を読む →',alt:'夕暮れの野球場とホームベースを描いたイラスト。'}
  };

  function installLayout(){
    if(document.getElementById(layoutStyleId))return;
    document.getElementById('tainan-pinned-feature-20261117')?.remove();
    document.getElementById('tainan-pinned-feature-style-20261117')?.remove();
    const style=document.createElement('style');
    style.id=layoutStyleId;
    style.textContent=`
html body #daily-brief-pair-20261026#daily-brief-pair-20261026{
  display:flex!important;grid-template-columns:none!important;grid-template-rows:none!important;
  width:min(1240px,calc(100% - 64px))!important;height:auto!important;min-height:0!important;
  margin:24px auto 0!important;padding:2px 3px 14px!important;gap:18px!important;
  overflow-x:auto!important;overflow-y:hidden!important;scroll-snap-type:x mandatory!important;
  scrollbar-width:none!important;overscroll-behavior-x:contain!important;touch-action:pan-x pan-y!important;
  background:transparent!important;border:0!important;
}
html body #daily-brief-pair-20261026#daily-brief-pair-20261026::-webkit-scrollbar{display:none!important}
html body #daily-brief-pair-20261026#daily-brief-pair-20261026>a{
  display:grid!important;grid-template-columns:1fr!important;grid-template-rows:44% 56%!important;
  grid-column:auto!important;grid-row:auto!important;flex:0 0 clamp(300px,31.5vw,400px)!important;
  width:auto!important;min-width:0!important;height:430px!important;min-height:430px!important;
  margin:0!important;padding:0!important;overflow:hidden!important;scroll-snap-align:start!important;
  border:1px solid #cbbca8!important;border-radius:16px!important;background:#fffaf1!important;
  box-shadow:0 10px 26px rgba(55,62,53,.11)!important;text-decoration:none!important;
}
html body #daily-brief-pair-20261026#daily-brief-pair-20261026>a>[data-home-thumb]{
  display:block!important;width:100%!important;height:100%!important;min-height:0!important;
  aspect-ratio:auto!important;object-fit:cover!important;object-position:center!important;background:#eee7da!important;
}
html body #daily-brief-pair-20261026#daily-brief-pair-20261026>a>.brief-copy{
  display:flex!important;min-width:0!important;min-height:0!important;height:auto!important;
  padding:18px 20px 21px!important;flex-direction:column!important;overflow:hidden!important;
}
html body #daily-brief-pair-20261026#daily-brief-pair-20261026>a>.brief-copy small{display:block!important;margin:0 0 7px!important}
html body #daily-brief-pair-20261026#daily-brief-pair-20261026>a>.brief-copy h2{
  display:block!important;margin:0 0 9px!important;font-size:clamp(20px,1.8vw,25px)!important;line-height:1.35!important;
}
html body #daily-brief-pair-20261026#daily-brief-pair-20261026>a>.brief-copy p{
  display:-webkit-box!important;margin:0 0 10px!important;overflow:hidden!important;
  -webkit-box-orient:vertical!important;-webkit-line-clamp:3!important;line-height:1.65!important;
}
html body #daily-brief-pair-20261026#daily-brief-pair-20261026+a.pinned-brief-slider-controls,
html body #daily-brief-pair-20261026#daily-brief-pair-20261026~.pinned-brief-slider-controls{
  display:flex!important;width:min(1240px,calc(100% - 64px))!important;margin:2px auto 28px!important;
  align-items:center!important;justify-content:flex-end!important;gap:9px!important;
}
.pinned-brief-slider-controls .pinned-brief-range{margin-right:auto;color:#5f5143;font-size:13px;font-weight:750}
.pinned-brief-slider-controls button{
  display:grid;place-items:center;width:44px;height:44px;border:1px solid #b9aa96;border-radius:50%;
  background:#fffaf1;color:#29464b;font:700 25px/1 system-ui;cursor:pointer;
}
.pinned-brief-slider-controls button:hover{background:#29464b;color:#fffaf1}
@media(max-width:760px){
  html body #daily-brief-pair-20261026#daily-brief-pair-20261026{
    width:100%!important;margin:16px auto 0!important;padding:0 16px 12px!important;gap:14px!important;
  }
  html body #daily-brief-pair-20261026#daily-brief-pair-20261026>a{
    flex:0 0 calc(100% - 34px)!important;height:auto!important;min-height:430px!important;
    grid-template-rows:auto 1fr!important;
  }
  html body #daily-brief-pair-20261026#daily-brief-pair-20261026>a>[data-home-thumb]{
    height:auto!important;aspect-ratio:16/9!important;
  }
  html body #daily-brief-pair-20261026#daily-brief-pair-20261026>a>.brief-copy{padding:18px 18px 21px!important}
  html body #daily-brief-pair-20261026#daily-brief-pair-20261026~.pinned-brief-slider-controls{
    width:calc(100% - 32px)!important;margin-bottom:24px!important;
  }
}
`;
    document.body.appendChild(style);
  }

  function mount(){
    const slider=document.querySelector('#daily-brief-pair-20261026');
    if(!slider)return false;
    installLayout();
    const d=copy[language()];
    let card=slider.querySelector('a[data-home-brief="'+briefId+'"]');
    if(!card){
      card=document.createElement('a');
      card.dataset.homeArticle='';
      card.dataset.homeBrief=briefId;
      slider.prepend(card);
    }
    card.href=root+'news/tainan-probation-baseball-support-20261116/'+d.path;
    card.dataset.homePinned='true';
    card.dataset.homePin='true';
    card.dataset.homePriority='200';
    card.dataset.homeDate='2026-11-17T09:00:00';
    card.innerHTML='<img src="'+root+'assets/art/tainan-probation-baseball-support-20261117.jpg?v=20261117-6" alt="'+d.alt+'" data-home-thumb loading="eager" width="1672" height="941"><span class="brief-copy"><small>'+d.meta+'</small><h2>'+d.title+'</h2><p>'+d.summary+'</p><span class="brief-read">'+d.read+'</span></span>';
    slider.dataset.twoWeekCarousel='true';
    slider.setAttribute('aria-label','近兩週護童貼文；可左右滑動');
    slider.dispatchEvent(new CustomEvent('home:briefs-updated',{bubbles:true}));
    return true;
  }

  function boot(){
    if(mount())return;
    const observer=new MutationObserver(()=>{if(mount())observer.disconnect();});
    observer.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>{mount();observer.disconnect();},10000);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
  addEventListener('load',mount,{once:true});
  setTimeout(mount,1200);
})();