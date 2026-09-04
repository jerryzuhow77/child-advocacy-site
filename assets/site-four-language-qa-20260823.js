(function(){
  'use strict';
  if(window.FourLanguageQA)return;

  var current=document.currentScript&&document.currentScript.src?document.currentScript.src:'';
  var assetsBase=current?current.slice(0,current.lastIndexOf('/')+1):'./assets/';
  var siteRoot=new URL('../',assetsBase).href;
  var applying=false;

  var copy={
    'zh-Hant':{
      submit:'前往心得投稿',official:'護童行動聯盟官方網站',heroAlt:'「讓我們一起寫下剴剴的故事」心得募集活動紙雕陶土主視覺',caption:'活動主視覺｜讓我們一起寫下剴剴的故事',
      campaign:{eyebrow:'9/16 SECOND-INSTANCE PREPARATORY PROCEEDING · STORY COLLECTION',title:'9/16 二審準備程序前，留下你想說的話',body:'在陳尚潔案二審準備程序舉行以前，邀請你寫下關注剴剴案的感受、仍想追問的問題，以及希望兒少保護制度改變的地方。每一段文字，都會成為不讓孩子與制度課題被遺忘的共同紀錄。',primary:'前往心得投稿',secondary:'閱讀活動說明',mini:'9/16 二審準備程序前，留下你的心得',discMeta:'08.20 · 9/16 二審準備程序前行動',discTitle:'一起寫下剴剴的故事',discBody:'留下感受、疑問與改變期待'}
    },
    'zh-Hans':{
      submit:'前往心得投稿',official:'护童行动联盟官方网站',heroAlt:'“让我们一起写下剀剀的故事”心得征集活动纸雕陶土主视觉',caption:'活动主视觉｜让我们一起写下剀剀的故事',
      campaign:{eyebrow:'9/16 SECOND-INSTANCE PREPARATORY PROCEEDING · STORY COLLECTION',title:'9/16 二审准备程序前，留下你想说的话',body:'在陈尚洁案二审准备程序举行以前，邀请你写下关注剀剀案的感受、仍想追问的问题，以及希望儿童保护制度改变的地方。每一段文字，都会成为不让孩子与制度课题被遗忘的共同记录。',primary:'前往心得投稿',secondary:'阅读活动说明',mini:'9/16 二审准备程序前，留下你的心得',discMeta:'08.20 · 9/16 二审准备程序前行动',discTitle:'一起写下剀剀的故事',discBody:'留下感受、疑问与改变期待'}
    },
    en:{
      submit:'Share your reflection',official:'Official website',heroAlt:'Paper-cut and clay artwork for the “Let Us Write Kaikai’s Story Together” campaign',caption:'Campaign artwork｜Let Us Write Kaikai’s Story Together',
      campaign:{eyebrow:'SEPTEMBER 16 APPEAL PREPARATORY PROCEEDING · STORY COLLECTION',title:'Before the September 16 appeal preparatory proceeding, share what you want the system to hear',body:'Write about what stayed with you, the questions that remain, and the changes you hope to see in child protection. Each submission becomes part of a shared public record that refuses to let the child—or the institutional failures—be forgotten.',primary:'Share your reflection',secondary:'Read the campaign',mini:'Before the September 16 preparatory proceeding, share your reflection',discMeta:'AUG 20 · BEFORE SEPTEMBER 16 PREPARATORY PROCEEDING',discTitle:'Write Kaikai’s Story Together',discBody:'Share what stayed with you and what should change'}
    },
    ja:{
      submit:'思いを投稿する',official:'公式サイト',heroAlt:'「一緒にカイカイの物語を綴りませんか」投稿企画の切り絵・クレイアート主ビジュアル',caption:'企画主ビジュアル｜一緒にカイカイの物語を綴りませんか',
      campaign:{eyebrow:'9月16日 控訴審準備手続 · 投稿企画',title:'9月16日の控訴審準備手続を前に、あなたの思いを残してください',body:'事件を見守る中で心に残ったこと、今も問い続けたいこと、子どもの保護制度に望む変化を、あなたの言葉でお寄せください。一つひとつの投稿が、子どもと制度上の課題を忘れないための共同記録になります。',primary:'思いを投稿する',secondary:'企画の詳細を見る',mini:'9月16日の控訴審準備手続を前に、あなたの思いを残す',discMeta:'08.20 · 9月16日の控訴審準備手続前',discTitle:'カイカイの物語を一緒に綴る',discBody:'思い、問い、変化への願いを残す'}
    }
  };

  var exactLabels={
    en:{'cases of public concern':'Cases','Cases of Public Concern':'Cases','activity record':'Activity Records','event album':'Event Albums','official community':'Official Social Media','Thematic tour':'Related Content'},
    ja:{'テーマ別ツアー':'関連コンテンツ','公式コミュニティ':'公式SNS','社会的関心事件':'社会事件'}
  };

  var replacements={
    'zh-Hant':[
      ['中國大陸','大陸']
    ],
    'zh-Hans':[
      ['中国大陆','大陆'],['中國大陸','大陆'],['讓我們一起寫下剴剴的故事','让我们一起写下剀剀的故事'],['二審準備程序','二审准备程序']
    ],
    en:[
      ['Mainland China','Mainland'],
      ['Second trial preparation procedure','Second-instance preparatory hearing'],
      ['Court observation notes of the second trial preparation process','Court observation record of the second-instance preparatory hearing'],
      ['Attendance record of the Tucheng Two-Year-Old Boy Death Case Art advertising picture','Artwork introducing the Tucheng two-year-old case court record'],
      ['Anti-drug driving and anti-drunk driving. Ketagalan Boulevard Parade','Ketagalan Boulevard rally against drug- and alcohol-impaired driving'],
      ['Event text, photo album and video record','Campaign report, photo album and video record']
    ],
    ja:[
      ['子供保護行動連盟','児童保護行動連盟'],
      ['第二次治験準備手順','控訴審準備手続'],
      ['二次試験準備過程の傍聴記録','控訴審準備手続の傍聴記録'],
      ['二次試験準備過程','控訴審準備手続'],
      ['土城美術広告写真2歳児死亡事件の立会い記録','土城2歳男児死亡事件の傍聴記録を紹介するビジュアル'],
      ['「2本の牛乳瓶を持ったまま亡くなった子供」','「最後にそばに残されていたのは、2本のミルクだけでした」'],
      ['薬物運転防止と飲酒運転防止。開道パレード','薬物・飲酒運転の根絶を訴える凱達格蘭大道パレード'],
      ['開道パレード','凱達格蘭大道パレード'],
      ['イベントテキスト、フォトアルバム、ビデオ記録','活動レポート・写真・映像記録'],
      ['立会い記録','傍聴記録']
    ]
  };

  Object.keys(replacements).forEach(function(key){
    replacements[key].sort(function(a,b){return b[0].length-a[0].length;});
  });

  function detectLocale(){
    var query=new URLSearchParams(location.search).get('lang');
    if(query==='zh-Hans'||query==='en'||query==='ja'||query==='zh-Hant')return query;
    var activeHans=document.querySelector('[data-hans][aria-current="true"], [data-hans].is-active');
    if(activeHans)return 'zh-Hans';
    var lang=(document.documentElement.lang||'zh-Hant').toLowerCase();
    if(lang.indexOf('zh-hans')===0||lang.indexOf('zh-cn')===0)return 'zh-Hans';
    if(lang.indexOf('en')===0)return 'en';
    if(lang.indexOf('ja')===0)return 'ja';
    return 'zh-Hant';
  }

  function replaceString(value,locale){
    var result=value||'';
    var match=result.match(/^(\s*)([\s\S]*?)(\s*)$/);
    if(match&&exactLabels[locale]&&Object.prototype.hasOwnProperty.call(exactLabels[locale],match[2]))result=match[1]+exactLabels[locale][match[2]]+match[3];
    (replacements[locale]||[]).forEach(function(pair){result=result.split(pair[0]).join(pair[1]);});
    return result;
  }

  function patchTextNodes(locale){
    if(!document.body||!document.createTreeWalker)return;
    var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:function(node){
      var parent=node.parentElement;
      if(!parent||/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/i.test(parent.tagName))return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }}),node;
    while((node=walker.nextNode())){
      var next=replaceString(node.nodeValue,locale);
      if(next!==node.nodeValue)node.nodeValue=next;
    }
    document.querySelectorAll('[alt],[title],[aria-label]').forEach(function(el){
      ['alt','title','aria-label'].forEach(function(attr){
        if(!el.hasAttribute(attr))return;
        var old=el.getAttribute(attr),next=replaceString(old,locale);
        if(next!==old)el.setAttribute(attr,next);
      });
    });
  }

  function submissionUrl(locale){
    if(locale==='zh-Hans')return 'https://cn.globalprotectionwall.com/?section=member-submit';
    var url=new URL('global-protection-wall/',siteRoot);
    url.searchParams.set('section','member-submit');
    if(locale!=='zh-Hant')url.searchParams.set('lang',locale);
    return url.href;
  }

  function campaignUrl(locale){
    var prefix=locale==='en'?'en/':locale==='ja'?'ja/':'';
    return new URL(prefix+'activity-records/20260820-kaikai-story-collection/',siteRoot).href;
  }

  function homeUrl(locale){
    if(locale==='en')return new URL('en/',siteRoot).href;
    if(locale==='ja')return new URL('ja/',siteRoot).href;
    if(locale==='zh-Hans')return new URL('?lang=zh-Hans',siteRoot).href;
    return siteRoot;
  }

  function setLink(link,url,external){
    if(!link)return;
    link.href=url;
    if(external){link.target='_blank';link.rel='noopener noreferrer';}
    else{link.removeAttribute('target');link.removeAttribute('rel');}
  }

  function patchSubmissionLinks(locale){
    var target=submissionUrl(locale);
    document.querySelectorAll('a[href]').forEach(function(link){
      var href=link.getAttribute('href')||'';
      var oldWall=href.indexOf('global-protection.jerryzuhow77.chatgpt.site')>-1;
      var simplifyWall=locale==='zh-Hans'&&href.indexOf('wall.globalprotectionwall.com')>-1;
      if(oldWall||simplifyWall)setLink(link,target,locale==='zh-Hans');
    });
  }

  function patchStoryPage(locale){
    if(!document.body||!document.body.classList.contains('story-collection-page'))return;
    var t=copy[locale]||copy['zh-Hant'];
    var hero=document.querySelector('.story-collection-hero img');
    if(hero){
      hero.src=new URL('activity-records/20260820-kaikai-story-collection/images/kaikai-story-collection-hero.webp',siteRoot).href;
      hero.alt=t.heroAlt;
      hero.dataset.fourLanguageSynced='true';
    }
    var caption=document.querySelector('.story-collection-hero figcaption');
    if(caption)caption.textContent=t.caption;
    var submit=document.querySelector('.story-submit-panel .read-btn');
    if(submit){submit.textContent=t.submit+' →';setLink(submit,submissionUrl(locale),locale==='zh-Hans');submit.dataset.fourLanguageSynced='true';}
    var official=document.querySelector('.story-submit-panel .outline-btn');
    if(official){official.textContent=t.official;setLink(official,homeUrl(locale),false);}
  }

  function syncCampaignCards(locale){
    var t=(copy[locale]||copy['zh-Hant']).campaign;
    document.querySelectorAll('[data-qa916-card]').forEach(function(card){
      var mapping={eyebrow:t.eyebrow,title:t.title,body:t.body,primary:t.primary,secondary:t.secondary,mini:t.mini,discMeta:t.discMeta,discTitle:t.discTitle,discBody:t.discBody};
      Object.keys(mapping).forEach(function(role){
        card.querySelectorAll('[data-qa916-copy="'+role+'"]').forEach(function(node){node.textContent=mapping[role];});
      });
      card.querySelectorAll('[data-qa916-primary]').forEach(function(link){setLink(link,submissionUrl(locale),locale==='zh-Hans');});
      card.querySelectorAll('[data-qa916-secondary]').forEach(function(link){setLink(link,campaignUrl(locale),false);});
      if(card.matches('a')){setLink(card,campaignUrl(locale),false);card.setAttribute('aria-label',t.title);}
      var image=card.querySelector('img[data-qa916-image]');
      if(image){image.src=new URL('activity-records/20260820-kaikai-story-collection/images/kaikai-story-collection-hero.webp',siteRoot).href;image.alt=(copy[locale]||copy['zh-Hant']).heroAlt;}
    });
  }

  function apply(){
    if(applying)return;
    applying=true;
    try{
      var locale=detectLocale();
      patchTextNodes(locale);
      patchSubmissionLinks(locale);
      patchStoryPage(locale);
      syncCampaignCards(locale);
      if(document.body)document.body.dataset.fourLanguageQa=locale;
    }finally{applying=false;}
  }

  function schedule(){[0,120,420,1100].forEach(function(delay){setTimeout(apply,delay);});}

  window.FourLanguageQA={sync:apply,locale:detectLocale,submissionUrl:submissionUrl,campaignUrl:campaignUrl,siteRoot:siteRoot};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  document.addEventListener('click',function(event){if(event.target.closest('[data-hans],.language-switcher a,#portalLanguage'))schedule();},true);
})();
