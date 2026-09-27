(function(){
  'use strict';
  function init(){
    var html=document.documentElement;
    var lang=(html.lang||'zh-Hant').toLowerCase();
    var hans=lang.indexOf('hans')>-1||location.hostname==='cn.globalprotectionwall.com';
    var english=lang.indexOf('en')===0;
    var japanese=lang.indexOf('ja')===0;
    var base='/child-advocacy-site/';
    var contentBase=base+(english?'en/':japanese?'ja/':'');
    var labels=english?{latest:'Latest',kaikai:'Kaikai case',court:'Court records',topics:'Features',cases:'Cases',search:'Search',more:'More'}:japanese?{latest:'最新',kaikai:'剴剴事件',court:'法廷記録',topics:'特集',cases:'事件',search:'検索',more:'その他'}:hans?{latest:'最新快报',kaikai:'剀剀案',court:'法庭记录',topics:'专题',cases:'案件',search:'搜索',more:'更多'}:{latest:'最新快報',kaikai:'剴剴案',court:'法庭紀錄',topics:'專題',cases:'案件',search:'搜尋',more:'更多'};
    var header=document.querySelector('.art-header .container.nav');
    var menuButton=header&&header.querySelector('.mobile-menu-toggle');
    if(header&&menuButton&&!header.querySelector('.cpa-primary-nav')){
      var nav=document.createElement('nav');
      nav.className='cpa-primary-nav';nav.setAttribute('aria-label',english?'Primary navigation':japanese?'メインナビゲーション':hans?'主要导航':'主要導覽');
      function link(href,text,cls){var a=document.createElement('a');a.href=href;a.textContent=text;if(cls)a.className=cls;return a;}
      nav.appendChild(link('#news-flash',labels.latest,'is-latest'));
      nav.appendChild(link(contentBase+'cases/kaikai/',labels.kaikai));
      nav.appendChild(link(contentBase+'hearing-records/',labels.court));
      nav.appendChild(link(english||japanese?'#news-advocacy':'#home-special-features',labels.topics));
      nav.appendChild(link(contentBase+'cases/',labels.cases));
      var search=document.createElement('button');search.type='button';search.textContent='⌕ '+labels.search;search.addEventListener('click',function(){var original=document.querySelector('.site-search-btn');if(original)original.click();});nav.appendChild(search);
      var languages=document.createElement('span');languages.className='cpa-primary-languages';
      [['https://jerryzuhow77.github.io/child-advocacy-site/','繁','hant'],['https://cn.globalprotectionwall.com/child-advocacy-site/','简','hans'],[base+'en/','EN','en'],[base+'ja/','日','ja']].forEach(function(item){var a=link(item[0],item[1]);if((item[2]==='hans'&&hans)||(item[2]==='en'&&english)||(item[2]==='ja'&&japanese)||(item[2]==='hant'&&!hans&&!english&&!japanese))a.setAttribute('aria-current','page');languages.appendChild(a);});
      nav.appendChild(languages);header.classList.add('has-cpa-primary-nav');header.insertBefore(nav,menuButton);menuButton.setAttribute('aria-label',labels.more);
    }
    var mobile=document.querySelector('.home-footer-mobile-bar');
    if(mobile){
      var items=english?[[contentBase,'⌂','Home'],['#news-flash','✦','Latest'],[contentBase+'cases/kaikai/','♡','Kaikai'],['#','⌕','Search'],['#','☰','More']]:japanese?[[contentBase,'⌂','ホーム'],['#news-flash','✦','速報'],[contentBase+'cases/kaikai/','♡','剴剴'],['#','⌕','検索'],['#','☰','その他']]:hans?[[contentBase,'⌂','首页'],['#news-flash','✦','快报'],[contentBase+'cases/kaikai/','♡','剀剀案'],['#','⌕','搜索'],['#','☰','更多']]:[[contentBase,'⌂','首頁'],['#news-flash','✦','快報'],[contentBase+'cases/kaikai/','♡','剴剴案'],['#','⌕','搜尋'],['#','☰','更多']];
      mobile.replaceChildren();items.forEach(function(item,index){var a=document.createElement('a');a.href=item[0];a.innerHTML='<span aria-hidden="true">'+item[1]+'</span><b>'+item[2]+'</b>';if(index===0)a.setAttribute('aria-current','page');if(index===3)a.addEventListener('click',function(e){e.preventDefault();var original=document.querySelector('.site-search-btn');if(original)original.click();});if(index===4)a.addEventListener('click',function(e){e.preventDefault();if(menuButton)menuButton.click();});mobile.appendChild(a);});
    }
    var viewport=document.querySelector('.home-pinned-reports-viewport');
    var track=viewport&&viewport.querySelector('.home-pinned-reports-track');
    if(track){
      var cards=[].slice.call(track.querySelectorAll('.home-pinned-report-card:not([data-pinned-clone])'));
      cards.sort(function(a,b){
        function key(card){var text=(card.querySelector('small')||{}).textContent||'';var match=text.match(/(\d{2})\.(\d{2})/);return match?Number(match[1])*100+Number(match[2]):0;}
        return key(b)-key(a);
      });
      cards.forEach(function(card){track.appendChild(card);});
      cards.forEach(function(card){card.classList.remove('is-latest-report');});
      if(cards[0]){cards[0].classList.add('is-latest-report');cards[0].setAttribute('aria-label',(hans?'最新：':'最新：')+(cards[0].querySelector('strong')||{}).textContent);}
      requestAnimationFrame(function(){viewport.scrollLeft=0;});
    }
  }
  init();
  window.setTimeout(init,500);
  window.setTimeout(init,2500);
  window.addEventListener('load',init,{once:true});
  var retries=0;
  var navigationRetry=window.setInterval(function(){
    if(document.querySelector('.cpa-primary-nav')||retries++>=30){window.clearInterval(navigationRetry);return;}
    init();
  },1000);
}());
