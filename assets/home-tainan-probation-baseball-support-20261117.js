(()=>{
  const root='/child-advocacy-site/';
  const targetId='tainan-pinned-feature-20261117';
  let observer;
  const mount=()=>{
    if(document.getElementById(targetId)){observer?.disconnect();return true;}
    const slider=document.querySelector('#daily-brief-pair-20261026');
    if(!slider || !slider.parentNode)return false;
    const lang=document.documentElement.lang==='zh-Hans'?'zh-Hans':document.documentElement.lang==='ja'?'ja':document.documentElement.lang==='en'?'en':'zh-Hant';
    const d={
      'zh-Hant':{path:'',meta:'首頁置頂｜護童快報・2026.11.17',title:'球場之外，少年支持如何接力？',summary:'台南觀護盃壘球賽已舉行；一次活動不是成效證明。從陪伴、資源與穩定轉銜，繼續追問支持能否真正接住少年。',read:'閱讀完整報導 →',alt:'夕陽下的棒壘球場與本壘板插畫。'},
      'zh-Hans':{path:'zh-Hans/',meta:'首页置顶｜护童快报・2026.11.17',title:'球场之外，少年支持如何接力？',summary:'台南观护杯垒球赛已经举行；一次活动不是成效证明。继续追问陪伴、资源与稳定转衔能否真正接住少年。',read:'阅读完整报道 →',alt:'夕阳下的棒垒球场与本垒板插画。'},
      en:{path:'en/',meta:'PINNED · CHILD-PROTECTION BRIEF · 17 NOV 2026',title:'Beyond the field: how does support stay with a young person?',summary:'The Tainan Probation Cup took place. One event is not proof of outcomes; the follow-up question is whether sustained support and transitions are actually available.',read:'Read the brief →',alt:'An illustrated baseball field and home plate at sunset.'},
      ja:{path:'ja/',meta:'固定・子ども保護速報｜2026年11月17日',title:'グラウンドの外で、少年への支援をどうつなぐか？',summary:'台南観護杯ソフトボール大会は実施されました。一度の大会を成果とせず、継続した支援と移行を問い続けます。',read:'記事を読む →',alt:'夕暮れの野球場とホームベースを描いたイラスト。'}
    }[lang];
    const feature=document.createElement('section');
    feature.id=targetId;
    feature.setAttribute('aria-label',d.meta);
    feature.innerHTML='<a class="tainan-pinned-card" href="'+root+'news/tainan-probation-baseball-support-20261116/'+d.path+'"><img src="'+root+'assets/art/tainan-probation-baseball-support-20261117.jpg?v=20261117-5" alt="'+d.alt+'" width="1672" height="941"><span class="tainan-pinned-copy"><small>'+d.meta+'</small><strong>'+d.title+'</strong><span>'+d.summary+'</span><b>'+d.read+'</b></span></a>';
    slider.parentNode.insertBefore(feature,slider);
    const style=document.createElement('style');
    style.id='tainan-pinned-feature-style-20261117';
    style.textContent='#daily-brief-pair-20261026#daily-brief-pair-20261026{display:none!important}#tainan-pinned-feature-20261117{width:min(1180px,calc(100% - 40px));margin:26px auto 34px}.tainan-pinned-card{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(0,.92fr);min-height:390px;overflow:hidden;border:1px solid #cbbca8;border-radius:18px;background:#fffaf1;color:#29464b;text-decoration:none;box-shadow:0 12px 30px rgba(55,62,53,.11)}.tainan-pinned-card>img{width:100%;height:100%;min-height:390px;object-fit:cover;object-position:center}.tainan-pinned-copy{display:flex;min-width:0;padding:clamp(28px,4vw,52px);flex-direction:column;justify-content:center;gap:14px}.tainan-pinned-copy small{font-size:14px;font-weight:800;letter-spacing:.04em;color:#79563b}.tainan-pinned-copy strong{font-family:ui-serif,Georgia,"Noto Serif TC",serif;font-size:clamp(30px,3.5vw,48px);line-height:1.28}.tainan-pinned-copy>span{font-size:17px;line-height:1.85;color:#465b59}.tainan-pinned-copy b{font-size:15px;color:#735033}@media(max-width:760px){#tainan-pinned-feature-20261117{width:calc(100% - 28px);margin:16px auto 28px}.tainan-pinned-card{display:flex;flex-direction:column;min-height:0}.tainan-pinned-card>img{height:auto;min-height:0;aspect-ratio:16/9}.tainan-pinned-copy{padding:24px 22px 28px;gap:11px}.tainan-pinned-copy strong{font-size:30px}.tainan-pinned-copy>span{font-size:16px}}';
    document.head.appendChild(style);
    observer?.disconnect();
    return true;
  };
  if(!mount()){
    observer=new MutationObserver(()=>mount());
    observer.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>{mount();observer?.disconnect();},10000);
  }
})();