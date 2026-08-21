(function(){
  const wallBase='https://wall.globalprotectionwall.com/';
  const supported=['zh-Hant','zh-Hans','en','ja'];
  const sections=['home','bulletins','guest-message','member-submit','guidelines'];
  const copy={
    'zh-Hant':{skip:'跳至留言牆內容',alliance:'護童行動聯盟',officialBadge:'官網互動子頁',title:'全球守護留言牆',officialHome:'官網首頁',wallHome:'留言牆首頁',bulletins:'最新快報',guest:'訪客留言',member:'會員投稿',openSeparate:'獨立開啟',connected:'官網子頁連動中',connectedHint:'留言牆完整內容會留在此官網網址內顯示',fallbackHint:'若登入或投稿被瀏覽器限制，可使用右上方「獨立開啟」。',loading:'正在連接全球守護留言牆…',frameTitle:'全球守護留言牆'},
    'zh-Hans':{skip:'跳至留言墙内容',alliance:'护童行动联盟',officialBadge:'官网互动子页',title:'全球守护留言墙',officialHome:'官网首页',wallHome:'留言墙首页',bulletins:'最新快报',guest:'访客留言',member:'会员投稿',openSeparate:'独立打开',connected:'官网子页联动中',connectedHint:'留言墙完整内容会保留在此官网网址内显示',fallbackHint:'若登录或投稿受浏览器限制，可使用右上方“独立打开”。',loading:'正在连接全球守护留言墙…',frameTitle:'全球守护留言墙'},
    en:{skip:'Skip to the Guardian Wall',alliance:'Child Protection Action Alliance',officialBadge:'Official interactive page',title:'Global Guardian Wall',officialHome:'Official home',wallHome:'Wall home',bulletins:'Latest reports',guest:'Visitor message',member:'Member post',openSeparate:'Open separately',connected:'Connected inside the official site',connectedHint:'The complete Guardian Wall remains visible within this official-site URL',fallbackHint:'If your browser blocks sign-in or posting, use “Open separately”.',loading:'Connecting to the Global Guardian Wall…',frameTitle:'Global Guardian Wall'},
    ja:{skip:'守護壁の内容へ移動',alliance:'児童保護行動連盟',officialBadge:'公式交流ページ',title:'グローバル守護壁',officialHome:'公式ホーム',wallHome:'守護壁ホーム',bulletins:'最新速報',guest:'訪問者メッセージ',member:'会員投稿',openSeparate:'別画面で開く',connected:'公式サイト内で接続中',connectedHint:'守護壁の全内容を公式サイトのURL内に表示します',fallbackHint:'ログインや投稿が制限された場合は「別画面で開く」をご利用ください。',loading:'グローバル守護壁に接続しています…',frameTitle:'グローバル守護メッセージウォール'}
  };
  const frame=document.getElementById('guardianWallFrame');
  const loader=document.getElementById('portalLoader');
  const language=document.getElementById('portalLanguage');
  const external=document.querySelector('[data-open-wall]');
  const officialHomeLinks=document.querySelectorAll('[data-official-home-link]');
  const requested=new URLSearchParams(location.search);
  let locale=supported.includes(requested.get('lang'))?requested.get('lang'):'zh-Hant';
  let section=sections.includes(requested.get('section'))?requested.get('section'):'home';

  const wallUrl=()=>{
    const path=section==='member-submit'?'submit':section==='guidelines'?'guidelines':'';
    const params=locale==='zh-Hant'?'':`?lang=${encodeURIComponent(locale)}`;
    const hash=section==='bulletins'?'#bulletins':section==='guest-message'?'#guest-message':'';
    return `${wallBase}${path}${params}${hash}`;
  };
  const syncParentUrl=()=>{
    const params=new URLSearchParams();
    if(locale!=='zh-Hant')params.set('lang',locale);
    if(section!=='home')params.set('section',section);
    const query=params.toString();
    history.replaceState({locale,section},'',`${location.pathname}${query?`?${query}`:''}`);
  };
  const renderCopy=()=>{
    const t=copy[locale];
    document.documentElement.lang=locale;
    document.title=`${t.title}｜${t.officialBadge} · ${t.alliance}`;
    document.querySelectorAll('[data-i18n]').forEach(node=>{const key=node.dataset.i18n;if(t[key])node.textContent=t[key];});
    const officialHome=locale==='en'?'../en/':locale==='ja'?'../ja/':locale==='zh-Hans'?'../?lang=zh-Hans':'../';
    officialHomeLinks.forEach(link=>{link.href=officialHome;link.setAttribute('aria-label',t.officialHome);});
    frame.title=t.frameTitle;
    language.value=locale;
    document.querySelectorAll('[data-wall-section]').forEach(button=>button.setAttribute('aria-current',String(button.dataset.wallSection===section)));
  };
  const loadWall=()=>{
    loader.classList.remove('is-complete');
    const target=wallUrl();
    frame.src=target;
    external.href=target;
    renderCopy();
    syncParentUrl();
  };
  frame.addEventListener('load',()=>loader.classList.add('is-complete'));
  document.querySelectorAll('[data-wall-section]').forEach(button=>button.addEventListener('click',()=>{section=button.dataset.wallSection;loadWall();}));
  language.addEventListener('change',()=>{locale=language.value;loadWall();});
  window.addEventListener('popstate',()=>{
    const params=new URLSearchParams(location.search);
    locale=supported.includes(params.get('lang'))?params.get('lang'):'zh-Hant';
    section=sections.includes(params.get('section'))?params.get('section'):'home';
    loadWall();
  });
  loadWall();
})();
