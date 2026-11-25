(function(){
  'use strict';

  if(window.__cpaSiteQaLoader)return;
  window.__cpaSiteQaLoader=true;

  var counterEndpoint='https://sweet-art-bed8child-advocacy-page-views.jerryzuhow77.workers.dev/views';
  window.CPA_VIEW_COUNTER=window.CPA_VIEW_COUNTER||{};
  if(!window.CPA_VIEW_COUNTER.endpoint){
    window.CPA_VIEW_COUNTER.endpoint=counterEndpoint;
  }
  window.CPA_VIEW_COUNTER_API=window.CPA_VIEW_COUNTER.endpoint;

  var current=document.currentScript&&document.currentScript.src?document.currentScript.src:'';
  var base=current?current.slice(0,current.lastIndexOf('/')+1):'./assets/';
  var version='20260912-taiwan-guardian-wall-3';
  var commentVersion='20260905-comment-key-3';
  function load(name,marker,done,assetVersion){
    var existing=document.querySelector('script[data-cpa-site-layer="'+marker+'"]');
    if(existing){if(done)done();return;}
    var script=document.createElement('script');
    script.src=base+name+'?v='+(assetVersion||version);
    script.async=false;
    script.dataset.cpaSiteLayer=marker;
    script.onload=function(){if(done)done();};
    script.onerror=function(){if(done)done();};
    document.head.appendChild(script);
  }
  function mountAdvocacyHeroPosters(){
    if(location.pathname.indexOf('/news/why-we-keep-showing-up-20261105/')===-1)return;
    var hero=document.querySelector('.hero');
    if(!hero||hero.querySelector('.hero-posters'))return;
    var firstPoster=hero.querySelector(':scope > img');
    if(!firstPoster)return;

    var locale=location.pathname.indexOf('/zh-Hans/')!==-1?'zh-Hans':location.pathname.indexOf('/en/')!==-1?'en':location.pathname.indexOf('/ja/')!==-1?'ja':'zh-Hant';
    var labels={
      'zh-Hant':['11 月 6 日二審準備程序｜水墨版海報','水墨版','11 月 6 日二審準備程序｜霓虹版海報','霓虹版'],
      'zh-Hans':['11 月 6 日二审准备程序｜水墨版海报','水墨版','11 月 6 日二审准备程序｜霓虹版海报','霓虹版'],
      en:['6 November appeal preparatory hearing｜Ink poster','Ink edition','6 November appeal preparatory hearing｜Neon poster','Neon edition'],
      ja:['11月6日 控訴審準備手続｜水墨版ポスター','水墨版','11月6日 控訴審準備手続｜ネオン版ポスター','ネオン版']
    }[locale];

    var posters=document.createElement('div');
    posters.className='hero-posters';
    posters.setAttribute('aria-label',labels[0]+'・'+labels[2]);
    var inkFigure=document.createElement('figure');
    inkFigure.className='hero-poster hero-poster-ink';
    firstPoster.alt=labels[0];
    firstPoster.loading='eager';
    inkFigure.appendChild(firstPoster);
    var inkCaption=document.createElement('figcaption');
    inkCaption.textContent=labels[1];
    inkFigure.appendChild(inkCaption);

    var neonFigure=document.createElement('figure');
    neonFigure.className='hero-poster hero-poster-neon';
    var neonPoster=document.createElement('img');
    neonPoster.src='/child-advocacy-site/assets/art/chen-shangjie-20261106-poster-neon.jpg?v=20261105-dual-poster-1';
    neonPoster.alt=labels[2];
    neonPoster.loading='eager';
    neonPoster.decoding='async';
    neonFigure.appendChild(neonPoster);
    var neonCaption=document.createElement('figcaption');
    neonCaption.textContent=labels[3];
    neonFigure.appendChild(neonCaption);

    posters.appendChild(inkFigure);
    posters.appendChild(neonFigure);
    hero.appendChild(posters);

    var style=document.createElement('style');
    style.id='advocacy-hero-posters-style';
    style.textContent=
      '.hero{grid-template-columns:minmax(300px,.82fr) minmax(0,1.18fr);gap:34px}'+
      '.hero-posters{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;align-items:stretch;perspective:1200px}'+
      '.hero-poster{position:relative;overflow:hidden;margin:0;min-width:0;border:1px solid rgba(193,139,60,.42);background:#111;box-shadow:0 18px 38px rgba(25,27,27,.2);transition:transform .38s ease,box-shadow .38s ease}'+
      '.hero-poster:first-child{transform:rotate(-1deg)}.hero-poster:last-child{transform:rotate(1deg)}'+
      '.hero-poster:hover{transform:translateY(-7px) rotate(0);box-shadow:0 25px 48px rgba(25,27,27,.3)}'+
      '.hero-posters .hero-poster img{display:block;width:100%;height:auto;max-height:none;aspect-ratio:4/5;object-fit:cover;background:#111}'+
      '.hero-poster figcaption{position:absolute;inset:auto 0 0;padding:9px 12px;background:linear-gradient(transparent,rgba(9,13,14,.9));color:#fff7e8;font-size:.76rem;font-weight:800;letter-spacing:.12em;text-align:right;text-shadow:0 1px 3px #000}'+
      '@media(max-width:900px){.hero{grid-template-columns:1fr}.hero-posters{max-width:680px;margin:8px auto 0}}'+
      '@media(max-width:560px){.hero-posters{gap:8px}.hero-poster figcaption{padding:7px 8px;font-size:.67rem}.hero-posters .hero-poster img{aspect-ratio:4/5}}'+
      '@media(prefers-reduced-motion:reduce){.hero-poster{transition:none}}';
    document.head.appendChild(style);

    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&window.gsap){
      window.gsap.from(posters.querySelectorAll('.hero-poster'),{opacity:0,y:34,x:function(index){return index===0?-22:22;},rotation:function(index){return index===0?-4:4;},duration:.85,stagger:.16,ease:'power3.out',clearProps:'opacity,x,y,rotation'});
    }
  }
  function mountAdvocacyCampaignCopy(){
    if(location.pathname.indexOf('/news/why-we-keep-showing-up-20261105/')===-1)return;
    if(document.getElementById('campaign-copy'))return;
    var notice=document.querySelector('.notice');
    if(!notice)return;

    var locale=location.pathname.indexOf('/zh-Hans/')!==-1?'zh-Hans':location.pathname.indexOf('/en/')!==-1?'en':location.pathname.indexOf('/ja/')!==-1?'ja':'zh-Hant';
    var copy={
      'zh-Hant':{
        heading:'行動倡議原文',
        note:'以下保留本次行動倡議原文；其中反問與批判屬倡議表達，並非二審已確定之法院認定。案件尚未定讞。',
        paragraphs:[
          '<span class="campaign-title">《他就說是被騙的，不然想怎樣？》</span>',
          '陳尚潔就說自己是被保母騙了啊！他是收出養社工，不負責監督保母，也不是去懷疑保母有沒有不當對待孩子的。',
          '還有人出來替他背書，說他是盡心盡力、85分以上的好社工。從頭到尾法庭上都爭取無罪不行嗎？',
          '陳尚潔在家安心陪伴女兒，過年過節，一家人團聚、吃好穿好，不行嗎？',
          '那些一次又一次站在法院外聲援剴剴的人，你們去只是被罵自以為的正義，還要看那些戲謔你們海報的👄🐵，你們還要繼續堅持嗎？',
          '好啊！既然你們這麼堅持，倒是讓大家看看，當事證確鑿辯護方仍然主張無罪，當兒福希望這件事早日翻篇的時候，就看看你們究竟能堅持多久！',
          '畢竟，對有些人來說，這場官司總有結束的一天；但對剴剴來說，他連長大的機會都沒有，所以，你們到底在堅持什麼？',
          '「我就是被騙的，不然想怎樣？」'
        ],
        details:'📍11月6日（星期五）下午2:30<br>📍台北市中正區博愛路127號（專一法庭）',
        credit:'影片來源：中視、中天、ETtoday新聞雲、鏡新聞、TVBS、東森'
      },
      'zh-Hans':{
        heading:'行动倡议原文',
        note:'以下保留本次行动倡议原文；其中反问与批判属于倡议表达，并非二审已经确定的法院认定。案件尚未定谳。',
        paragraphs:[
          '<span class="campaign-title">《他说是被骗的，不然想怎样？》</span>',
          '陈尚洁就说自己是被保姆骗了啊！她是收出养社工，不负责监督保姆，也不是去怀疑保姆有没有不当对待孩子的。',
          '还有人出来替她背书，说她是尽心尽力、85分以上的好社工。从头到尾法庭上都争取无罪不行吗？',
          '陈尚洁在家安心陪伴女儿，过年过节，一家人团聚、吃好穿好，不行吗？',
          '那些一次又一次站在法院外声援剀剀的人，你们去只是被骂自以为的正义，还要看那些戏谑你们海报的👄🐵，你们还要继续坚持吗？',
          '好啊！既然你们这么坚持，倒是让大家看看，当事证确凿辩护方仍然主张无罪，当儿福希望这件事早日翻篇的时候，就看看你们究竟能坚持多久！',
          '毕竟，对有些人来说，这场官司总有结束的一天；但对剀剀来说，他连长大的机会都没有，所以，你们到底在坚持什么？',
          '「我就是被骗的，不然想怎样？」'
        ],
        details:'📍11月6日（星期五）下午2:30<br>📍台北市中正区博爱路127号（专一法庭）',
        credit:'影片来源：中视、中天、ETtoday新闻云、镜新闻、TVBS、东森'
      },
      en:{
        heading:'Original campaign statement',
        note:'The following preserves the campaign statement. Its rhetorical questions and criticism are advocacy language, not a final appellate finding. The case is not final.',
        paragraphs:[
          '<span class="campaign-title">“She said she was deceived. What else do you want?”</span>',
          'Chen Shangjie says the babysitter deceived her. She was the adoption social worker, not responsible for supervising the babysitter or questioning whether the babysitter was mistreating the child.',
          'Others have vouched for her, calling her a dedicated social worker worthy of more than 85 points. Is she not allowed to seek an acquittal throughout the proceedings?',
          'Is Chen Shangjie not allowed to stay home, safely accompany her daughter, spend holidays with her family, and live comfortably?',
          'To those who repeatedly stand outside the court in support of Kaikai: you are dismissed as self-righteous, and even have to watch 👄🐵 mock your posters. Will you keep going?',
          'Fine. If you are this determined, let everyone see how long you can persist when the defence still seeks an acquittal despite conclusive evidence, and when the child-welfare organisation wants the matter turned into the past.',
          'For some people, this case will eventually end. For Kaikai, there was no chance to grow up. So what are you insisting on?',
          '“I was deceived. What else do you want?”'
        ],
        details:'📍Friday, 6 November, 2:30 p.m.<br>📍Special Courtroom, 127 Bo’ai Road, Zhongzheng District, Taipei',
        credit:'Video sources: CTV, CTi, ETtoday, Mirror News, TVBS and EBC'
      },
      ja:{
        heading:'行動提言の原文',
        note:'以下は今回の行動提言の原文を保つための掲載です。反問や批判は提言上の表現であり、控訴審で確定した裁判所の認定ではありません。判決は確定していません。',
        paragraphs:[
          '<span class="campaign-title">「だまされたと言っている。ほかにどうしろというのか」</span>',
          '陳尚潔被告は、保育者にだまされたと言っています。養子縁組担当のソーシャルワーカーであって、保育者を監督する立場でも、子どもが不適切に扱われていないかを疑う役割でもなかった、というのです。',
          'さらに、彼女は全力を尽くした「85点以上」の良いソーシャルワーカーだったと評価する人もいます。法廷で一貫して無罪を求めてはいけないのでしょうか。',
          '陳尚潔被告が自宅で娘に寄り添い、年末年始や祝日を家族で過ごし、衣食に困らず暮らしてはいけないのでしょうか。',
          '何度も裁判所の外に立ち、カイカイを支援してきた皆さん。自分勝手な正義だと罵られ、ポスターを嘲笑する👄🐵まで目にしても、なお続けるのでしょうか。',
          'それほど続けるというなら、明白な証拠があっても弁護側が無罪を主張し、児童福祉団体が早く過去のことにしたいと望む中で、どこまで続けられるのか、皆に見てもらいましょう。',
          'ある人にとって裁判にはいつか終わりが来ます。しかしカイカイには、成長する機会さえありませんでした。皆さんはいったい何を求め続けているのでしょうか。',
          '「私はだまされた。ほかにどうしろというのか」'
        ],
        details:'📍11月6日（金）午後2時30分<br>📍台北市中正区博愛路127号（専門法廷）',
        credit:'映像出典：中視、中天、ETtoday新聞雲、鏡新聞、TVBS、東森'
      }
    }[locale];

    var style=document.createElement('style');
    style.id='campaign-copy-style';
    style.textContent=
      '.campaign-copy{--campaign-red:#9d2f2a;--campaign-gold:#b7792f;--campaign-blue:#254b59;--campaign-green:#3f6458;position:relative;overflow:hidden;max-width:860px;margin:32px auto 52px;padding:34px 38px 36px;border:1px solid rgba(133,97,65,.3);background:radial-gradient(circle at 95% 2%,rgba(183,121,47,.18),transparent 34%),linear-gradient(145deg,#fffdf8 0%,#f8efe0 100%);box-shadow:0 20px 48px rgba(63,45,31,.13)}'+
      '.campaign-copy:before{content:"";position:absolute;inset:0 auto 0 0;width:7px;background:linear-gradient(180deg,var(--campaign-red),var(--campaign-gold),var(--campaign-blue))}'+
      '.campaign-copy h2{position:relative;margin:0 0 20px;color:var(--campaign-red);font:900 clamp(1.35rem,2.8vw,2.25rem)/1.15 system-ui,"Noto Sans TC","Noto Sans SC","Noto Sans JP",sans-serif;letter-spacing:.13em}'+
      '.campaign-copy h2:after{content:"";display:block;width:min(180px,42%);height:3px;margin-top:12px;background:linear-gradient(90deg,var(--campaign-red),var(--campaign-gold),transparent)}'+
      '.campaign-copy .campaign-note{max-width:690px;margin:0 0 27px;padding:0 0 16px;border-bottom:1px solid rgba(133,97,65,.28);color:#68726f;font-size:clamp(.78rem,1.5vw,.92rem);line-height:1.7;letter-spacing:.035em}'+
      '.campaign-copy .campaign-line{position:relative;margin:1.15em 0;line-height:1.8}'+
      '.campaign-copy .campaign-line-1{margin:.2em 0 1.2em;line-height:1.35}'+
      '.campaign-copy .campaign-title{display:inline-block;font:900 clamp(1.75rem,4.4vw,3.35rem)/1.25 Georgia,"Noto Serif TC","Noto Serif SC","Noto Serif JP",serif;color:#6f2420;letter-spacing:.015em}'+
      '.campaign-copy .campaign-line-2{max-width:94%;color:var(--campaign-blue);font:700 clamp(1.05rem,2.3vw,1.32rem)/1.85 Georgia,"Noto Serif TC","Noto Serif SC","Noto Serif JP",serif}'+
      '.campaign-copy .campaign-line-3{max-width:92%;margin-left:6%;color:#5a4c43;font-size:clamp(.98rem,1.8vw,1.1rem);font-weight:650}'+
      '.campaign-copy .campaign-line-4{max-width:88%;margin-left:11%;color:var(--campaign-green);font:800 clamp(1.05rem,2.1vw,1.26rem)/1.78 Georgia,"Noto Serif TC","Noto Serif SC","Noto Serif JP",serif}'+
      '.campaign-copy .campaign-line-5{max-width:96%;color:var(--campaign-red);font-size:clamp(1.08rem,2.4vw,1.42rem);font-weight:900;line-height:1.72}'+
      '.campaign-copy .campaign-line-6{margin:1.45em 0;padding:18px 22px;border-left:4px solid var(--campaign-gold);background:rgba(183,121,47,.1);color:#263f46;font:800 clamp(1.05rem,2.25vw,1.34rem)/1.75 Georgia,"Noto Serif TC","Noto Serif SC","Noto Serif JP",serif}'+
      '.campaign-copy .campaign-line-7{max-width:91%;margin-left:7%;color:#403b37;font-size:clamp(1rem,1.9vw,1.16rem)}'+
      '.campaign-copy .campaign-line-8{margin:1.4em 0 .9em;padding:.55em 0;border-top:1px solid rgba(157,47,42,.45);border-bottom:1px solid rgba(157,47,42,.45);color:#7b2924;font:900 clamp(1.45rem,3.5vw,2.35rem)/1.5 Georgia,"Noto Serif TC","Noto Serif SC","Noto Serif JP",serif;text-align:center}'+
      '.campaign-copy .campaign-details{margin:1.6em 0 .8em;color:#f9f4e9;background:#263f46;padding:16px 19px;font:800 clamp(.94rem,1.8vw,1.08rem)/1.85 ui-monospace,"Noto Sans Mono CJK TC",monospace;letter-spacing:.025em}'+
      '.campaign-copy .campaign-credit{margin:.7em 0 0;color:#74665b;font-size:clamp(.76rem,1.4vw,.88rem);letter-spacing:.04em}'+
      '@media(max-width:720px){.campaign-copy{padding:27px 21px 30px 27px}.campaign-copy .campaign-line-3,.campaign-copy .campaign-line-4,.campaign-copy .campaign-line-7{max-width:100%;margin-left:0}.campaign-copy .campaign-line-6{padding:15px 16px}.campaign-copy .campaign-details{padding:14px 15px}}';
    document.head.appendChild(style);

    var section=document.createElement('section');
    section.id='campaign-copy';
    section.className='campaign-copy';
    section.setAttribute('aria-labelledby','campaign-copy-title');
    section.innerHTML='<h2 id="campaign-copy-title">'+copy.heading+'</h2><p class="campaign-note">'+copy.note+'</p>'+copy.paragraphs.map(function(paragraph,index){return '<p class="campaign-line campaign-line-'+(index+1)+'">'+paragraph+'</p>';}).join('')+'<p class="campaign-details">'+copy.details+'</p><p class="campaign-credit">'+copy.credit+'</p>';
    notice.insertAdjacentElement('afterend',section);

    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&window.gsap){
      var timelineOptions={};
      if(window.ScrollTrigger){
        window.gsap.registerPlugin(window.ScrollTrigger);
        timelineOptions.scrollTrigger={trigger:section,start:'top 84%',once:true};
      }
      var timeline=window.gsap.timeline(timelineOptions);
      timeline
        .from(section,{opacity:0,scale:.975,y:30,duration:.72,ease:'power2.out'})
        .from(section.querySelector('h2'),{opacity:0,x:-38,skewX:-7,duration:.58,ease:'power3.out'},'-.38')
        .from(section.querySelector('.campaign-note'),{opacity:0,y:16,duration:.42},'-.25')
        .from(section.querySelectorAll('.campaign-line'),{opacity:0,x:function(index){return index%2===0?-30:30;},y:function(index){return index%3===0?18:8;},rotation:function(index){return index%2===0?-1.1:1.1;},duration:.64,stagger:.11,ease:'power2.out',clearProps:'transform'},'-.16')
        .from(section.querySelector('.campaign-details'),{opacity:0,scaleX:.92,transformOrigin:'left center',duration:.48,ease:'power2.out'},'-.22')
        .from(section.querySelector('.campaign-credit'),{opacity:0,y:9,duration:.34},'-.2');
      window.gsap.to(section.querySelector('.campaign-title'),{textShadow:'0 0 18px rgba(157,47,42,.32)',duration:2.2,repeat:-1,yoyo:true,ease:'sine.inOut'});
    }
  }
  mountAdvocacyHeroPosters();
  mountAdvocacyCampaignCopy();
  load('site-base-20260823.js','base',function(){
    load('site-four-language-qa-20260823.js','four-language-qa',function(){
      load('mobile-nav-view-counter-20260823.js','mobile-nav-views');
      load('article-comments-20260828.js','article-comments',null,commentVersion);
      load('legal-notice.js','legal-notice');
    });
  });
})();



/* 2026-11-19 pinned child-support forum: homepage cache-safe mount. */
(()=>{const id='special-needs-support-forum-20261119',root='/child-advocacy-site/';const locale=()=>document.documentElement.lang==='zh-Hans'?'zh-Hans':document.documentElement.lang==='en'?'en':document.documentElement.lang==='ja'?'ja':'zh-Hant';const copy={'zh-Hant':['首頁置頂｜護童快報・2026.11.19','需求先於資格：支持不能等到拿到標籤','今日論壇討論從學習到生活的支持；活動本身不是政策成效，後續仍要追問支持入口與資源連續性。','閱讀制度追蹤 →'],'zh-Hans':['首页置顶｜护童快报・2026.11.19','需求先于资格：支持不能等到拿到标签','今日论坛讨论从学习到生活的支持；活动本身不是政策成效，后续仍要追问支持入口与资源连续性。','阅读制度追踪 →'],en:['PINNED BRIEF · 19 NOV 2026','Support before labels: a need should not wait','Today’s forum looks from learning to life. The event itself is not proof of policy outcomes; access and continuity remain the question.','Read the policy watch →'],ja:['固定・子ども保護速報｜2026年11月19日','資格より先に、必要な支援を','今日の公開フォーラムは、学びから生活までの支援を扱います。行事そのものを制度成果とはせず、利用しやすさと継続性を問います。','制度追跡を読む →']};function mount(){const host=document.querySelector('#daily-brief-pair-20261026');if(!host)return;host.querySelectorAll('[data-home-date]').forEach(x=>{const d=(x.dataset.homeDate||'').slice(0,10);if(d&&d<'2026-11-17')x.remove();});if(document.getElementById(id))return;const l=locale(),t=copy[l],a=document.createElement('a');a.id=id;a.dataset.homeArticle='';a.dataset.homeBrief=id;a.dataset.homePinned='true';a.dataset.homePin='true';a.dataset.homePriority='300';a.dataset.homeDate='2026-11-19T08:20:00';a.href=root+'news/special-needs-support-forum-20261119/'+({'zh-Hant':'','zh-Hans':'zh-Hans/','en':'en/','ja':'ja/'}[l]);a.innerHTML='<img src="'+root+'assets/art/special-needs-support-forum-20261119.png" width="1672" height="941" loading="eager" data-home-thumb alt="Original contemporary ink-and-paper artwork; not an event scene."><span class="brief-copy"><small>'+t[0]+'</small><h2>'+t[1]+'</h2><p>'+t[2]+'</p><span class="brief-read">'+t[3]+'</span></span>';host.prepend(a);host.dispatchEvent(new CustomEvent('home:briefs-updated',{bubbles:true}));}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();setTimeout(mount,900);setTimeout(mount,1900)})();


/* A single decorative journey shared by every page; no motion for reduced-motion visitors. */
(() => {
  const mount=()=>{
    if(document.querySelector('.cpa-global-sleigh')||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const sleigh=document.createElement('div');sleigh.className='cpa-global-sleigh';sleigh.setAttribute('aria-hidden','true');
    sleigh.innerHTML='<span class="cpa-global-sleigh__trail"></span><svg viewBox="0 0 180 90" role="presentation"><path d="M62 68c28 10 64 8 89-4M61 73c26 10 62 10 88-2" fill="none" stroke="#d8ad70" stroke-width="4" stroke-linecap="round"/><path d="M52 56h89l-11-24H64z" fill="#a74f3e"/><path d="M60 52h74" stroke="#f6dfaa" stroke-width="5"/><circle cx="87" cy="39" r="16" fill="#f0c2a6"/><path d="M72 34c2-21 27-24 31-3" fill="#fff7e5"/><path d="M70 31c8-17 24-17 34 0" fill="#b9473c"/><circle cx="103" cy="31" r="4" fill="#fff7e5"/><path d="M56 44L33 36M55 54L25 57" stroke="#c9975f" stroke-width="3"/><path d="M26 35c-7-10-16-8-20 0 8 0 13 4 20 10M23 57c-9-8-17-4-19 5 8-2 14 0 19 5" fill="none" stroke="#d7b47d" stroke-width="3"/></svg>';
    document.body.append(sleigh);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();


/* Upgrade the shared traveller into a full, foreground reindeer sleigh tableau. */
(() => {
 const upgrade=()=>{const el=document.querySelector('.cpa-global-sleigh');if(!el||el.dataset.reindeerUpgrade)return;el.dataset.reindeerUpgrade='true';
 el.innerHTML='<span class="cpa-global-sleigh__trail"></span><svg viewBox="0 0 620 280" role="presentation"><defs><linearGradient id="cpaRed" x1="0" x2="1"><stop stop-color="#7f302d"/><stop offset=".55" stop-color="#bd5d46"/><stop offset="1" stop-color="#722b31"/></linearGradient><linearGradient id="cpaGold" x1="0" x2="1"><stop stop-color="#8f672a"/><stop offset=".5" stop-color="#f8db91"/><stop offset="1" stop-color="#b17b31"/></linearGradient></defs><g fill="#f6ead5" stroke="#c79c61" stroke-width="5"><path d="M170 125c-31-46-74-48-100-13 24 1 38 9 49 25-30-11-56-4-70 24 27-5 47 1 61 19l59-14z"/><path d="M310 135c-31-46-74-48-100-13 24 1 38 9 49 25-30-11-56-4-70 24 27-5 47 1 61 19l59-14z"/></g><g fill="#f8efe0" stroke="#9f7040" stroke-width="7"><path d="M135 110c-38-13-69 12-67 52l15 44 23-20 12 32 20-7 1-39c33-11 49-35 16-62z"/><path d="M275 120c-38-13-69 12-67 52l15 44 23-20 12 32 20-7 1-39c33-11 49-35 16-62z"/></g><g fill="none" stroke="url(#cpaGold)" stroke-width="12" stroke-linecap="round"><path d="M92 111l-21-43m30 38L91 57m8 51l24-39M232 121l-21-43m30 38l-10-49m8 51l24-39"/><path d="M118 171L388 159M257 180l133-21"/></g><g fill="url(#cpaRed)" stroke="url(#cpaGold)" stroke-width="10"><path d="M358 134c55-29 135-22 177 16l-6 77H347z"/><path d="M388 125c12-47 62-64 95-35l21 48z"/></g><g fill="#f8efe0" stroke="#a36c42" stroke-width="5"><circle cx="440" cy="92" r="30"/><path d="M411 76c15-35 56-27 58 7l-16 8z"/><path d="M399 131c35-15 67-8 88 20l-80 17z"/></g><path d="M360 229c48 23 123 21 177-9m-172 27c49 24 122 24 173-7" fill="none" stroke="url(#cpaGold)" stroke-width="13" stroke-linecap="round"/><circle cx="105" cy="163" r="8" fill="#d49c43"/><circle cx="245" cy="173" r="8" fill="#d49c43"/></svg>';};
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(upgrade,20),{once:true});else setTimeout(upgrade,20);
})();

/* Premium Christmas neon choreography. GSAP powers the oversized reindeer sleigh when available. */
(()=>{const boot=()=>{const el=document.querySelector('.cpa-global-sleigh');if(!el||matchMedia('(prefers-reduced-motion:reduce)').matches)return;el.innerHTML='<span class="cpa-global-sleigh__trail"></span><svg viewBox="0 0 460 250" aria-hidden="true"><defs><linearGradient id="cpaSleigh" x1="0" x2="1"><stop stop-color="#a60d32"/><stop offset=".52" stop-color="#ff315a"/><stop offset="1" stop-color="#ffd36d"/></linearGradient><filter id="cpaGlow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g filter="url(#cpaGlow)"><path d="M205 185c74 28 164 26 226-9M202 201c75 30 164 29 233-5" fill="none" stroke="#ffd36d" stroke-width="9" stroke-linecap="round"/><path d="M194 159h215l-27-66H225z" fill="url(#cpaSleigh)" stroke="#ffe7a5" stroke-width="5"/><path d="M219 158h170" stroke="#fff0bf" stroke-width="9"/><circle cx="270" cy="112" r="38" fill="#ffd8bf" stroke="#ffe7a5" stroke-width="4"/><path d="M230 103c6-50 63-59 80-4" fill="#fff7e6"/><path d="M224 98c14-42 62-45 88 0" fill="#c91943"/><circle cx="307" cy="96" r="11" fill="#fff7e6"/><path d="M212 126 118 88M211 153 95 164" stroke="#ffcc71" stroke-width="7"/><g fill="#f9f0dc" stroke="#ffd36d" stroke-width="5"><path d="M95 91C64 45 22 55 9 92c37-5 61 12 85 36z"/><path d="M79 166c-41-27-70-5-73 27 31-13 59-6 80 12z"/></g><path d="M95 93c-15-23-35-31-52-27M80 168c-21-10-39-5-53 9" fill="none" stroke="#4ff0ac" stroke-width="7" stroke-linecap="round"/><circle cx="392" cy="146" r="7" fill="#4ff0ac"/><circle cx="409" cy="163" r="6" fill="#ff315a"/><circle cx="229" cy="169" r="6" fill="#4ff0ac"/></g></svg>';const g=window.gsap;if(g){g.set(el,{x:-520,y:innerHeight*.14,rotation:5});const tl=g.timeline({repeat:-1,repeatDelay:.2});tl.to(el,{duration:7,x:innerWidth*.63,y:innerHeight*.08,rotation:-4,ease:'power1.inOut'}).to(el,{duration:6,x:innerWidth+500,y:innerHeight*.35,rotation:5,ease:'power1.inOut'}).set(el,{x:-520,y:innerHeight*.58,rotation:-6}).to(el,{duration:8,x:innerWidth*.35,y:innerHeight*.18,rotation:3,ease:'power1.inOut'});g.to(el.querySelector('svg'),{y:-16,rotation:2,duration:1.45,yoyo:true,repeat:-1,ease:'sine.inOut'});g.to(el.querySelector('.cpa-global-sleigh__trail'),{opacity:.33,duration:.8,yoyo:true,repeat:-1,ease:'sine.inOut'});}};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();})();

/* A large, freely travelling artisan sleigh on every route. GSAP controls the whole journey. */
(()=>{const launch=()=>{if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;let el=document.querySelector('.cpa-global-sleigh');if(!el){el=document.createElement('div');el.className='cpa-global-sleigh';el.setAttribute('aria-hidden','true');document.body.append(el)}el.innerHTML='<span class="cpa-global-sleigh__trail"></span><img class="cpa-global-sleigh__art" src="/child-advocacy-site/assets/images/luxe-free-flying-reindeer-sleigh.png" alt="">';const g=window.gsap;if(!g)return;g.killTweensOf(el);g.killTweensOf(el.querySelector('.cpa-global-sleigh__art'));const w=()=>window.innerWidth,h=()=>window.innerHeight;const exit=()=>Math.max(920,w()*.72);g.set(el,{x:-exit(),y:h()*.12,rotation:4,transformOrigin:'50% 50%'});const t=g.timeline({repeat:-1,repeatDelay:.35});t.to(el,{x:w()*.54,y:h()*.05,rotation:-5,duration:6.2,ease:'sine.inOut'}).to(el,{x:exit(),y:h()*.38,rotation:4,duration:5.7,ease:'sine.inOut'}).set(el,{x:-exit(),y:h()*.66,rotation:-6}).to(el,{x:w()*.22,y:h()*.22,rotation:3,duration:6.5,ease:'sine.inOut'}).to(el,{x:exit(),y:h()*.68,rotation:-3,duration:6.2,ease:'sine.inOut'}).set(el,{x:-exit(),y:h()*.32,rotation:5});g.to(el.querySelector('.cpa-global-sleigh__art'),{y:-24,rotation:1.3,duration:1.65,ease:'sine.inOut',repeat:-1,yoyo:true});g.to(el.querySelector('.cpa-global-sleigh__trail'),{opacity:.28,duration:1.05,ease:'sine.inOut',repeat:-1,yoyo:true})};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',launch,{once:true});else launch()})();

/* Runs after legacy decorators to guarantee the large artwork is the last sleigh renderer. */
(()=>{const render=()=>{if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;let e=document.querySelector('.cpa-global-sleigh');if(!e){e=document.createElement('div');e.className='cpa-global-sleigh';e.setAttribute('aria-hidden','true');document.body.append(e)}e.innerHTML='<span class="cpa-global-sleigh__trail"></span><img class="cpa-global-sleigh__art" src="/child-advocacy-site/assets/images/luxe-free-flying-reindeer-sleigh.png" alt="">';const g=window.gsap;if(!g)return;g.killTweensOf(e);g.killTweensOf(e.querySelector('.cpa-global-sleigh__art'));const x=()=>Math.max(960,innerWidth*.75),h=()=>innerHeight;g.set(e,{x:-x(),y:h()*.14,rotation:4});const t=g.timeline({repeat:-1,repeatDelay:.4});t.to(e,{x:innerWidth*.54,y:h()*.06,rotation:-5,duration:6,ease:'sine.inOut'}).to(e,{x:x(),y:h()*.37,rotation:4,duration:5.5,ease:'sine.inOut'}).set(e,{x:-x(),y:h()*.67,rotation:-6}).to(e,{x:innerWidth*.28,y:h()*.2,rotation:3,duration:6.4,ease:'sine.inOut'}).to(e,{x:x(),y:h()*.65,rotation:-3,duration:6,ease:'sine.inOut'});g.to(e.querySelector('.cpa-global-sleigh__art'),{y:-25,duration:1.5,yoyo:true,repeat:-1,ease:'sine.inOut'})};setTimeout(render,180)})();
