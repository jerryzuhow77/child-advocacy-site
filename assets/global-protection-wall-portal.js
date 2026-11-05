(function(){
  'use strict';
  const wallBase='https://global-protection.jerryzuhow77.chatgpt.site/';
  // Temporary direct Sites route while custom-domain DNS validation is pending.
  // Restore wall.globalprotectionwall.com after both custom domains report active.
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

  const language=document.getElementById('portalLanguage');
  const external=document.querySelector('[data-open-wall]');
  const launchWall=document.querySelector('[data-launch-wall]');
  const officialHomeLinks=document.querySelectorAll('[data-official-home-link]');
  const curatedGrid=document.getElementById('curatedMessageGrid');
  if(!language||!external)return;

  const requested=new URLSearchParams(location.search);
  let locale=supported.includes(requested.get('lang'))?requested.get('lang'):'zh-Hant';
  let section=sections.includes(requested.get('section'))?requested.get('section'):'home';
  const mirrorHost=location.hostname==='cn.globalprotectionwall.com';
  let region=regions.includes(requested.get('region'))?requested.get('region'):(mirrorHost?'hk':'tw');

  const wallUrl=()=>{
    // Taiwan and Hong Kong share the healthy primary application. The primary
    // app currently redirects region=hk through the Hong Kong root and can
    // create a redirect loop, so use its stable Taiwan routing context here.
    // Visitors can still select Hong Kong in the public country/region field.
    const regionalBase=wallBase;
    const path=section==='member-submit'?'submit/':section==='guidelines'?'guidelines/':'';
    const target=new URL(path,regionalBase);
    target.searchParams.set('region','tw');
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
    document.documentElement.dataset.wallRegion=region;
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
    language.value=locale;
    document.querySelectorAll('[data-wall-section]').forEach(button=>button.setAttribute('aria-current',String(button.dataset.wallSection===section)));
    document.querySelectorAll('[data-wall-region]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.wallRegion===region)));
  };

  const loadWall=()=>{
    const target=wallUrl();
    external.href=target;
    if(launchWall)launchWall.href=target;
    renderCopy();
    syncParentUrl();
  };

  const safeText=(value)=>String(value||'').replace(/\s+/g,' ').trim();
  const messageRows=(payload)=>Array.isArray(payload)?payload:Array.isArray(payload?.messages)?payload.messages:Array.isArray(payload?.items)?payload.items:[];
  const messageBody=(row)=>safeText(row.message||row.content||row.body||row.text||row.excerpt);
  const messageAuthor=(row)=>safeText(row.display_name||row.displayName||row.author_name||row.author?.display_name||row.nickname)||'守護留言者';
  const messageRegion=(row)=>safeText(row.region_label||row.region||row.country||row.location)||'守護留言牆';
  const renderCurated=(rows)=>{
    if(!curatedGrid)return;
    const selected=rows.filter(row=>messageBody(row)).slice(0,3);
    if(!selected.length){
      curatedGrid.innerHTML='<div class="curated-message-empty"><span>尚無公開精選留言</span><p>留言通過審核並同意公開後，會由留言牆資料直接呈現在這裡。</p><button type="button" data-empty-wall-action>成為第一個留下觀點的人</button></div>';
      curatedGrid.querySelector('[data-empty-wall-action]')?.addEventListener('click',()=>{section='guest-message';loadWall();window.location.assign(wallUrl());});
      return;
    }
    curatedGrid.innerHTML=selected.map((row,index)=>'<article class="curated-message-card"><span>0'+(index+1)+'</span><blockquote>「'+messageBody(row).replace(/[<>&]/g,char=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[char]))+'」</blockquote><footer><strong>'+messageAuthor(row).replace(/[<>&]/g,char=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[char]))+'</strong><small>'+messageRegion(row).replace(/[<>&]/g,char=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[char]))+'</small></footer></article>').join('');
  };
  const loadCurated=async()=>{
    if(!curatedGrid)return;
    const bases=[wallBase,mainlandWallBase];
    for(const base of bases){
      try{
        const response=await fetch(new URL('api/public/messages?limit=12',base),{headers:{Accept:'application/json'}});
        if(!response.ok)continue;
        const rows=messageRows(await response.json());
        renderCurated(rows);
        return;
      }catch(_){ }
    }
    renderCurated([]);
  };

  document.querySelectorAll('[data-wall-section]').forEach(button=>button.addEventListener('click',()=>{
    section=button.dataset.wallSection;
    loadWall();
    window.location.assign(wallUrl());
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
    region=regions.includes(params.get('region'))?params.get('region'):(mirrorHost?'hk':'tw');
    loadWall();
  });
  loadWall();
  loadCurated();
})();


