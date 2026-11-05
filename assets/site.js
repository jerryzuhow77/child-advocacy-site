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
    style.textContent='.campaign-copy{max-width:820px;margin:28px auto 44px;padding:26px 28px;border:1px solid var(--line,#d4c6b2);background:#fffaf2;box-shadow:0 12px 30px rgba(63,45,31,.08)}.campaign-copy h2{margin:0 0 18px;color:var(--red,#a33129);font-size:clamp(1.55rem,3vw,2.2rem)}.campaign-copy .campaign-note{padding-bottom:14px;border-bottom:1px solid var(--line,#d4c6b2);color:#5d6866;font-size:.92rem}.campaign-copy p{margin:1em 0;font-size:1.06rem}.campaign-copy .campaign-title{font:800 clamp(1.3rem,3vw,1.9rem)/1.5 Georgia,"Noto Serif TC","Noto Serif SC","Noto Serif JP",serif;color:#642b25}.campaign-copy .campaign-details{font-weight:800}@media(max-width:720px){.campaign-copy{padding:22px 19px}.campaign-copy p{font-size:1rem}}';
    document.head.appendChild(style);

    var section=document.createElement('section');
    section.id='campaign-copy';
    section.className='campaign-copy';
    section.setAttribute('aria-labelledby','campaign-copy-title');
    section.innerHTML='<h2 id="campaign-copy-title">'+copy.heading+'</h2><p class="campaign-note">'+copy.note+'</p>'+copy.paragraphs.map(function(paragraph){return '<p>'+paragraph+'</p>';}).join('')+'<p class="campaign-details">'+copy.details+'</p><p>'+copy.credit+'</p>';
    notice.insertAdjacentElement('afterend',section);
  }
  mountAdvocacyCampaignCopy();
  load('site-base-20260823.js','base',function(){
    load('site-four-language-qa-20260823.js','four-language-qa',function(){
      load('mobile-nav-view-counter-20260823.js','mobile-nav-views');
      load('article-comments-20260828.js','article-comments',null,commentVersion);
      load('legal-notice.js','legal-notice');
    });
  });
})();

