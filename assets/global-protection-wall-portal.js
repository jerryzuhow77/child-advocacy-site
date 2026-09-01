(function(){
  'use strict';
  const wallBase='https://global-protection.jerryzuhow77.chatgpt.site/';
  const mainlandWallBase='https://cn.globalprotectionwall.com/';
  const supported=['zh-Hant','zh-Hans','en','ja'];
  const regions=['tw','hk'];
  const sections=['home','bulletins','guest-message','member-submit','guidelines'];
  const copy={
    'zh-Hant':{
      skip:'跳至留言牆內容',alliance:'護童行動聯盟',officialBadge:'留言牆社群空間',title:'全球守護留言牆',
      officialHome:'官網首頁',wallHome:'留言牆首頁',guest:'訪客留言',member:'會員投稿',guidelines:'社群守則',
      openSeparate:'獨立開啟',connected:'人的聲音，在這裡相遇',connectedHint:'官網記住事實；留言牆留下祝福、文章與倡議',
      facts:'官網・事實',voices:'留言牆・聲音',fallbackHint:'若登入或投稿受瀏覽器限制，可使用右上方「獨立開啟」。',
      loading:'正在連接全球守護留言牆…',frameTitle:'全球守護留言牆',regionLabel:'留言牆地區',taiwan:'台灣',hongKong:'香港'
    },
    'zh-Hans':{
      skip:'跳至留言墙内容',alliance:'护童行动联盟',officialBadge:'简体留言墙社群空间',title:'全球守护留言墙',
      officialHome:'官网首页',wallHome:'留言墙首页',guest:'访客留言',member:'会员投稿',guidelines:'社群守则',
      openSeparate:'独立打开',connected:'人的声音，在这里相遇',connectedHint:'官网记住事实；留言墙留下祝福、文章与倡议',
      facts:'官网・事实',voices:'留言墙・声音',fallbackHint:'简体版连接 cn.globalprotectionwall.com；若嵌入浏览受限，请使用右上方“独立打开”。',
      loading:'正在连接简体全球守护留言墙…',frameTitle:'全球守护留言墙简体版',regionLabel:'留言墙地区',taiwan:'台湾',hongKong:'香港'
    },
    en:{
      skip:'Skip to the Guardian Wall',alliance:'Child Protection Action Alliance',officialBadge:'Community space',title:'Global Guardian Wall',
      officialHome:'Official site',wallHome:'Wall home',guest:'Visitor message',member:'Member post',guidelines:'Community guidelines',
      openSeparate:'Open separately',connected:'People’s voices meet here',connectedHint:'The official site keeps the facts; the Wall keeps messages, stories and calls for change',
      facts:'Official site · Facts',voices:'Guardian Wall · Voices',fallbackHint:'If your browser blocks sign-in or posting, use “Open separately”.',
      loading:'Connecting to the Global Guardian Wall…',frameTitle:'Global Guardian Wall',regionLabel:'Wall region',taiwan:'Taiwan',hongKong:'Hong Kong'
    },
    ja:{
      skip:'守護壁の内容へ移動',alliance:'児童保護行動連盟',officialBadge:'守護壁コミュニティ',title:'グローバル守護壁',
      officialHome:'公式サイト',wallHome:'守護壁ホーム',guest:'訪問者メッセージ',member:'会員投稿',guidelines:'コミュニティ規則',
      openSeparate:'別画面で開く',connected:'人の声が、ここで出会う',connectedHint:'公式サイトは事実を記録し、守護壁はメッセージ・記事・提言を残します',
      facts:'公式サイト・事実',voices:'守護壁・声',fallbackHint:'ログインや投稿が制限された場合は「別画面で開く」をご利用ください。',
      loading:'グローバル守護壁に接続しています…',frameTitle:'グローバル守護メッセージウォール',regionLabel:'地域',taiwan:'台湾',hongKong:'香港'
    }
  };

  const frame=document.getElementById('guardianWallFrame');
  const loader=document.getElementById('portalLoader');
  const language=document.getElementById('portalLanguage');
  const external=document.querySelector('[data-open-wall]');
  const officialHomeLinks=document.querySelectorAll('[data-official-home-link]');
  if(!frame||!loader||!language||!external)return;

  const requested=new URLSearchParams(location.search);
  let locale=supported.includes(requested.get('lang'))?requested.get('lang'):'zh-Hant';
  let section=sections.includes(requested.get('section'))?requested.get('section'):'home';
  let region=regions.includes(requested.get('region'))?requested.get('region'):'tw';

  const wallUrl=()=>{
    if(locale==='zh-Hans'){
      const target=new URL(mainlandWallBase);
      if(section!=='home')target.searchParams.set('section',section);
      return target.toString();
    }
    const path=section==='member-submit'?'submit/':section==='guidelines'?'guidelines/':'';
    const target=new URL(path,wallBase);
    target.searchParams.set('region',region);
    if(locale!=='zh-Hant')target.searchParams.set('lang',locale);
    if(section==='bulletins')target.hash='bulletins';
    if(section==='guest-message')target.hash='guest-message';
    return target.toString();
  };

  const syncParentUrl=()=>{
    const params=new URLSearchParams();
    if(locale!=='zh-Hant')params.set('lang',locale);
    if(section!=='home')params.set('section',section);
    params.set('region',region);
    const query=params.toString();
    history.replaceState({locale,section,region},'',`${location.pathname}${query?`?${query}`:''}`);
  };

  const renderCopy=()=>{
    const t=copy[locale];
    document.documentElement.lang=locale;
    document.title=`${t.title}｜${t.officialBadge} · ${t.alliance}`;
    document.querySelectorAll('[data-i18n]').forEach(node=>{
      const key=node.dataset.i18n;
      if(Object.prototype.hasOwnProperty.call(t,key))node.textContent=t[key];
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(node=>{
      const key=node.dataset.i18nAria;
      if(Object.prototype.hasOwnProperty.call(t,key))node.setAttribute('aria-label',t[key]);
    });
    const officialHome=locale==='en'?'../en/':locale==='ja'?'../ja/':locale==='zh-Hans'?'../?lang=zh-Hans':'../';
    officialHomeLinks.forEach(link=>{link.href=officialHome;link.setAttribute('aria-label',t.officialHome);});
    frame.title=t.frameTitle;
    language.value=locale;
    document.querySelectorAll('[data-wall-section]').forEach(button=>button.setAttribute('aria-current',String(button.dataset.wallSection===section)));
    document.querySelectorAll('[data-wall-region]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.wallRegion===region)));
  };

  const loadWall=()=>{
    document.body.classList.remove('portal-ready');
    loader.classList.remove('is-complete');
    const target=wallUrl();
    frame.src=target;
    external.href=target;
    renderCopy();
    syncParentUrl();
  };

  frame.addEventListener('load',()=>{
    loader.classList.add('is-complete');
    document.body.classList.add('portal-ready');
  });
  document.querySelectorAll('[data-wall-section]').forEach(button=>button.addEventListener('click',()=>{
    section=button.dataset.wallSection;
    loadWall();
  }));
  document.querySelectorAll('[data-wall-region]').forEach(button=>button.addEventListener('click',()=>{
    region=button.dataset.wallRegion;
    loadWall();
  }));
  language.addEventListener('change',()=>{locale=language.value;loadWall();});
  window.addEventListener('popstate',()=>{
    const params=new URLSearchParams(location.search);
    locale=supported.includes(params.get('lang'))?params.get('lang'):'zh-Hant';
    section=sections.includes(params.get('section'))?params.get('section'):'home';
    region=regions.includes(params.get('region'))?params.get('region'):'tw';
    loadWall();
  });
  loadWall();
})();

