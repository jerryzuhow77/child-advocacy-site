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

