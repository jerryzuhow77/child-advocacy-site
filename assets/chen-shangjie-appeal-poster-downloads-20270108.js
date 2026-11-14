(()=>{
  const base='/child-advocacy-site/assets/posters/chen-shangjie-appeal-20270108/';
  const posters=[
    ['chen-shangjie-appeal-gold-court.svg','金光法庭・追思版'],
    ['chen-shangjie-appeal-modern-ink.svg','現代水墨・守望版'],
    ['chen-shangjie-appeal-watercolor.svg','水彩追思・白花版'],
    ['chen-shangjie-appeal-chalk.svg','粉筆夜色・小熊版']
  ];
  const strings={
    'zh-Hant':{title:'剴剴案開庭追思海報下載',lead:'四款海報均標示陳尚潔案二審準備程序：116 年 1 月 8 日（五）14:30，臺灣高等法院，115 年度上訴字第 4688 號，博愛路 127 號・專一法庭。可先預覽，再下載原始圖檔；庭期如有異動請以法院公告為準。',preview:'預覽海報',download:'下載原始檔',labels:['金光法庭・追思版','現代水墨・守望版','水彩追思・白花版','粉筆夜色・小熊版']},
    'zh-Hans':{title:'剀剀案开庭追思海报下载',lead:'四款海报均标示陈尚洁案二审准备程序：116 年 1 月 8 日（五）14:30，台湾高等法院，115 年度上诉字第 4688 号，博爱路 127 号・专一法庭。可先预览，再下载原始图档；庭期如有异动请以法院公告为准。',preview:'预览海报',download:'下载原始档',labels:['金光法庭・追思版','现代水墨・守望版','水彩追思・白花版','粉笔夜色・小熊版']},
    en:{title:'Kaikai Hearing Memorial Poster Downloads',lead:'Four downloadable memorial posters for the Chen Shangjie appeal preparation hearing: 8 January 2027 (Fri), 14:30, Taiwan High Court, Case No. 115 Shang-Su 4688, No. 127 Bo-ai Road, Courtroom 1. Please confirm any change with the court’s latest notice.',preview:'Preview poster',download:'Download original',labels:['Golden Court Memorial','Modern Ink Vigil','Watercolor Memorial','Chalk Night Memorial']},
    ja:{title:'剴剴事件・開廷追悼ポスター',lead:'陳尚潔事件・控訴審準備手続の追悼ポスター4種です。116年1月8日（金）14:30、台湾高等法院、115年度上訴字第4688号、博愛路127号・専一法廷。期日に変更がある場合は、裁判所の最新公告をご確認ください。',preview:'ポスターを見る',download:'原本をダウンロード',labels:['金色の法廷・追悼版','現代水墨・見守り版','水彩追悼・白花版','チョーク夜景・小熊版']}
  };
  const locale=()=>document.documentElement.lang==='zh-Hans'?'zh-Hans':document.documentElement.lang==='ja'?'ja':document.documentElement.lang==='en'?'en':'zh-Hant';
  const render=()=>{
    const s=strings[locale()];
    let section=document.getElementById('poster-downloads');
    if(!section){section=document.createElement('section');section.className='panel poster-download';section.id='poster-downloads';const target=document.querySelector('.cases')?.closest('.panel');if(target)target.before(section);else document.querySelector('main.shell')?.append(section)}
    section.setAttribute('aria-labelledby','poster-downloads-title');
    const cards=posters.map(([file],i)=>{const label=s.labels[i];const url=base+file;return `<article class="poster-download-card"><a href="${url}" target="_blank" rel="noopener" aria-label="${s.preview}：${label}"><img src="${url}" alt="${label}｜${s.title}" loading="lazy" width="1024" height="1536"></a><div class="poster-download-copy"><h3>${label}</h3><p>陳尚潔案・二審準備程序<br>116 年 1 月 8 日（五）14:30</p><div class="poster-download-actions"><a href="${url}" target="_blank" rel="noopener">${s.preview}</a><a href="${url}" download>${s.download}</a></div></div></article>`}).join('');
    section.innerHTML=`<h2 id="poster-downloads-title">${s.title}</h2><p class="lede">${s.lead}</p><div class="poster-download-grid">${cards}</div>`;
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});else render();
})();
