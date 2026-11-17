(()=>{
  const mount=()=>{
    const slider=document.querySelector('[data-gsap-slider]');
    if(!slider||slider.querySelector('[data-home-brief="tainan-probation-baseball-support-20261116"]'))return;
    const lang=document.documentElement.lang==='zh-Hans'?'zh-Hans':document.documentElement.lang==='ja'?'ja':document.documentElement.lang==='en'?'en':'zh-Hant';
    const root='/child-advocacy-site/';
    const d={
      'zh-Hant':{path:'',meta:'首頁置頂｜護童快報・2026.11.17',title:'球場之外，少年支持如何接力？',summary:'台南觀護盃壘球賽已舉行；一次活動不是成效證明。從陪伴、資源與穩定轉銜，繼續追問支持能否真正接住少年。',read:'閱讀完整報導 →',alt:'夕陽下的棒壘球場與本壘板插畫。'},
      'zh-Hans':{path:'zh-Hans/',meta:'首页置顶｜护童快报・2026.11.17',title:'球场之外，少年支持如何接力？',summary:'台南观护杯垒球赛已经举行；一次活动不是成效证明。继续追问陪伴、资源与稳定转衔能否真正接住少年。',read:'阅读完整报道 →',alt:'夕阳下的棒垒球场与本垒板插画。'},
      en:{path:'en/',meta:'PINNED · CHILD-PROTECTION BRIEF · 17 NOV 2026',title:'Beyond the field: how does support stay with a young person?',summary:'The Tainan Probation Cup took place. One event is not proof of outcomes; the follow-up question is whether sustained support and transitions are actually available.',read:'Read the brief →',alt:'An illustrated baseball field and home plate at sunset.'},
      ja:{path:'ja/',meta:'固定・子ども保護速報｜2026年11月17日',title:'グラウンドの外で、少年への支援をどうつなぐか？',summary:'台南観護杯ソフトボール大会は実施されました。一度の大会を成果とせず、継続した支援と移行を問い続けます。',read:'記事を読む →',alt:'夕暮れの野球場とホームベースを描いたイラスト。'}
    }[lang];
    const card=document.createElement('a');
    card.href=root+'news/tainan-probation-baseball-support-20261116/'+d.path;
    card.dataset.homeArticle='';
    card.dataset.homeBrief='tainan-probation-baseball-support-20261116';
    card.dataset.homePinned='true';
    card.dataset.homeDate='2026-11-17T09:00';
    card.innerHTML='<img src="'+root+'assets/art/tainan-probation-baseball-support-20261117.jpg?v=20261117-1" alt="'+d.alt+'" data-home-thumb width="1672" height="941"><span class="brief-copy"><small>'+d.meta+'</small><h2>'+d.title+'</h2><p>'+d.summary+'</p><span class="brief-read">'+d.read+'</span></span>';
    slider.insertBefore(card,slider.firstChild);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();

(function(){
  var target='tainan-probation-baseball-support-20261116';
  var css='#daily-brief-pair-20261026[data-gsap-slider][data-two-week-carousel]{display:block!important;width:min(1180px,calc(100% - 40px))!important;height:auto!important;min-height:0!important;margin:24px auto 36px!important;padding:0!important;overflow:visible!important}#daily-brief-pair-20261026[data-gsap-slider][data-two-week-carousel]>a:not([data-home-brief="tainan-probation-baseball-support-20261116"]){display:none!important}#daily-brief-pair-20261026[data-gsap-slider][data-two-week-carousel]>a[data-home-brief="tainan-probation-baseball-support-20261116"]{display:grid!important;grid-template-columns:minmax(0,1.08fr) minmax(0,.92fr)!important;grid-template-rows:minmax(0,1fr)!important;width:100%!important;min-height:390px!important;height:390px!important;margin:0!important;overflow:hidden!important;border-radius:18px!important}#daily-brief-pair-20261026[data-gsap-slider][data-two-week-carousel]>a[data-home-brief="tainan-probation-baseball-support-20261116"]>[data-home-thumb]{display:block!important;width:100%!important;height:100%!important;min-height:0!important;aspect-ratio:auto!important;object-fit:cover!important;object-position:center!important}#daily-brief-pair-20261026[data-gsap-slider][data-two-week-carousel]>a[data-home-brief="tainan-probation-baseball-support-20261116"]>.brief-copy{display:flex!important;min-width:0!important;min-height:0!important;height:100%!important;padding:clamp(28px,4vw,52px)!important;flex-direction:column!important;justify-content:center!important;gap:12px!important}#daily-brief-pair-20261026[data-gsap-slider][data-two-week-carousel]>a[data-home-brief="tainan-probation-baseball-support-20261116"]>.brief-copy p{display:block!important}@media(max-width:760px){#daily-brief-pair-20261026[data-gsap-slider][data-two-week-carousel]{width:calc(100% - 28px)!important;margin:16px auto 28px!important}#daily-brief-pair-20261026[data-gsap-slider][data-two-week-carousel]>a[data-home-brief="tainan-probation-baseball-support-20261116"]{display:flex!important;flex-direction:column!important;min-height:0!important;height:auto!important}#daily-brief-pair-20261026[data-gsap-slider][data-two-week-carousel]>a[data-home-brief="tainan-probation-baseball-support-20261116"]>[data-home-thumb]{height:auto!important;aspect-ratio:16 / 9!important}#daily-brief-pair-20261026[data-gsap-slider][data-two-week-carousel]>a[data-home-brief="tainan-probation-baseball-support-20261116"]>.brief-copy{height:auto!important;padding:24px 22px 28px!important}}';
  function finish(){
    var box=document.querySelector('#daily-brief-pair-20261026');
    var card=box&&box.querySelector('a[data-home-brief="'+target+'"]');
    if(!box||!card)return;
    if(box.firstElementChild!==card)box.insertBefore(card,box.firstElementChild);
    var old=document.getElementById('tainan-pinned-final-layout-20261117');
    if(old)old.remove();
    var style=document.createElement('style');
    style.id='tainan-pinned-final-layout-20261117';
    style.textContent=css;
    document.head.appendChild(style);
    var img=card.querySelector('[data-home-thumb]');
    if(img){img.onerror=null;img.src='/child-advocacy-site/assets/art/tainan-probation-baseball-support-20261117.jpg?v=20261117-2';}
  }
  setTimeout(finish,800);
  setTimeout(finish,1800);
})();
