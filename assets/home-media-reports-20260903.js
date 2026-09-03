(() => {
  'use strict';

  const ROOT = '/child-advocacy-site/';
  const NEXTTV_URL = 'https://www.nexttv.com.tw/NextTV/News/Home/Society/m/2026-09-02/2455025.html';
  const PHOTO_SOURCE_URL = 'https://www.taisounds.com/news/content/96/174886';
  const PHOTO_URL = 'https://image.taisounds.com/newsimages/img/2026/0626/887688e131974df08ae8bffa97d11e7c.jpg';

  function getLocale() {
    const requested = new URLSearchParams(window.location.search).get('lang');
    if (requested && requested.toLowerCase() === 'zh-hans') return 'zh-Hans';
    const declared = (document.documentElement.lang || 'zh-Hant').toLowerCase();
    if (declared.startsWith('en')) return 'en';
    if (declared.startsWith('ja')) return 'ja';
    if (declared.startsWith('zh-hans') || declared.startsWith('zh-cn')) return 'zh-Hans';
    return 'zh-Hant';
  }

  const copy = {
    'zh-Hant': {
      eyebrow: 'MEDIA REPORTS · 新聞專區', title: '新聞專區',
      description: '重要媒體報導依日期新到舊整理，並清楚標示報導、照片與攝影來源。', nav: '新聞專區', all: '查看全部新聞',
      date: '2026.09.02', publisher: '壹電視', headline: '剴剴案後續｜林心慈訪視紀錄案',
      summary: '一個出養安置案，為何接連出現第一線失職與偽造紀錄？回顧訪視日期、紀錄與安全網責任。',
      source: '新聞來源｜壹電視 Next TV', photo: '資料照片：林心慈出庭；照片來源：太報／攝影：呂志明', action: '閱讀完整整理',
      art: '精緻紙雕層景、訪視紀錄與象徵剴剴的陶土孩童藝術意象，搭配林心慈出庭資料照片',
      note: '本區使用摘要與來源連結；真人照片為外部來源資料照片，著作權屬原媒體、攝影者或其他權利人。',
      article: `${ROOT}news/lin-xinci-nexttv-20260902/`, index: `${ROOT}news/`
    },
    'zh-Hans': {
      eyebrow: 'MEDIA REPORTS · 新闻专区', title: '新闻专区', description: '重要媒体报道依日期由新到旧整理，并清楚标示报道、照片与摄影来源。', nav: '新闻专区', all: '查看全部新闻',
      date: '2026.09.02', publisher: '壹电视', headline: '林心慈案首次开庭', summary: '从访视记录与日期登记争议出发，整理媒体报道、检方指控、辩方主张及尚待法院审酌的事项。',
      source: '新闻来源｜壹电视 Next TV', photo: '资料照片：林心慈出庭；照片来源：太报／摄影：吕志明', action: '阅读完整整理',
      art: '精致纸雕层景、访视记录与陶土儿童艺术意象，搭配林心慈出庭资料照片',
      note: '本区使用摘要与来源链接；真人照片为外部来源资料照片，著作权属于原媒体、摄影者或其他权利人。',
      article: `${ROOT}news/lin-xinci-nexttv-20260902/zh-Hans/`, index: `${ROOT}news/zh-Hans/`
    },
    en: {
      eyebrow: 'MEDIA REPORTS · NEWS DESK', title: 'News Desk', description: 'Important reports, ordered newest first with publishers, photographs, and photographers clearly credited.', nav: 'News Desk', all: 'View all news',
      date: '2026.09.02', publisher: 'Next TV', headline: 'First hearing in the Lin Hsin-tzu case', summary: 'A source-attributed review of the disputed visit records, the prosecution account, the defense position, and matters still for the court.',
      source: 'News source | Next TV', photo: 'File photo: Lin Hsin-tzu appearing in court. Source: TaiSounds; photo by Lu Chih-ming.', action: 'Read the full brief',
      art: 'Detailed paper-cut layers, visit records and a clay child sculpture, paired with a file photograph of Lin Hsin-tzu',
      note: 'This section uses summaries and source links. The real-person image is an externally hosted file photo; copyright remains with the publisher, photographer, or other rights holder.',
      article: `${ROOT}en/news/lin-xinci-nexttv-20260902/`, index: `${ROOT}en/news/`
    },
    ja: {
      eyebrow: 'MEDIA REPORTS · ニュース特集', title: 'ニュース特集', description: '重要報道を新しい日付から順に整理し、報道・写真・撮影者の出典を明記します。', nav: 'ニュース特集', all: 'ニュース一覧',
      date: '2026.09.02', publisher: '壹電視', headline: '林心慈事件、初公判', summary: '訪問記録と日付記載をめぐる争点について、報道、検察側の説明、弁護側の主張、今後裁判所が判断する事項を整理します。',
      source: '報道資料｜壹電視 Next TV', photo: '資料写真：林心慈氏の出廷。写真提供：太報／撮影：呂志明氏', action: '記事整理を読む',
      art: '精緻な紙彫刻、訪問記録、粘土の子どもの造形と、林心慈氏の出廷資料写真',
      note: '本欄は要約と出典リンクで構成しています。実写写真は外部配信の資料写真で、著作権は報道機関、撮影者、その他の権利者に帰属します。',
      article: `${ROOT}ja/news/lin-xinci-nexttv-20260902/`, index: `${ROOT}ja/news/`
    }
  };

  const reports = [{ date: '2026-09-02' }];

  function assetRoot() {
    const script = document.currentScript && document.currentScript.src ? document.currentScript.src : new URL('assets/home-media-reports-20260903.js', document.baseURI).href;
    return { css: new URL('home-media-reports-20260903.css?v=20260903-paper-clay-home-2', script).href, art: new URL('images/news-desk-paper-clay-hero-20260903.svg?v=20260903-paper-clay-home-2', script).href };
  }
  function addStylesheet(href) { if (document.getElementById('home-media-reports-20260903-style')) return; const link=document.createElement('link'); link.id='home-media-reports-20260903-style'; link.rel='stylesheet'; link.href=href; document.head.appendChild(link); }
  function injectNewsNav(text) { const navigation=document.querySelector('.art-header .container.nav > nav'); if(!navigation||navigation.querySelector('[data-cpa-news-nav]')) return; const link=document.createElement('a'); link.href=text.index; link.className='cpa-news-nav-link'; link.dataset.cpaNewsNav='true'; link.textContent=text.nav; link.setAttribute('aria-label',text.nav); const firstMenu=navigation.querySelector('.social-case-nav'); if(firstMenu) navigation.insertBefore(link,firstMenu); else navigation.appendChild(link); }
  function buildVisual(text, roots) {
    const visual=document.createElement('div'); visual.className='home-media-visual'; visual.setAttribute('role','img'); visual.setAttribute('aria-label',text.art);
    const art=document.createElement('img'); art.className='home-media-pastel-art'; art.src=roots.art; art.alt=''; art.loading='lazy'; art.decoding='async';
    const photoFrame=document.createElement('figure'); photoFrame.className='home-media-real-photo'; const photo=document.createElement('img'); photo.src=PHOTO_URL; photo.alt=text.photo; photo.loading='lazy'; photo.decoding='async'; photo.referrerPolicy='no-referrer'; const credit=document.createElement('figcaption'); credit.textContent=text.photo; photo.addEventListener('error',()=>photoFrame.remove(),{once:true}); photoFrame.append(photo,credit);
    const label=document.createElement('span'); label.className='home-media-pastel-label'; label.textContent=text.eyebrow; visual.append(art,photoFrame,label); return visual;
  }
  function buildCard(text,roots,report){
    const card=document.createElement('article'); card.className='home-media-report-card'; card.dataset.date=report.date; card.setAttribute('role','listitem'); card.appendChild(buildVisual(text,roots));
    const body=document.createElement('div'); body.className='home-media-report-copy'; const meta=document.createElement('div'); meta.className='home-media-report-meta'; const date=document.createElement('time'); date.className='home-media-report-date'; date.dateTime=report.date; date.textContent=text.date; const publisher=document.createElement('span'); publisher.textContent=text.publisher; meta.append(date,publisher);
    const headline=document.createElement('h3'); const headlineLink=document.createElement('a'); headlineLink.href=text.article; headlineLink.textContent=text.headline; headline.appendChild(headlineLink); const summary=document.createElement('p'); summary.textContent=text.summary; const source=document.createElement('span'); source.className='home-media-report-source'; source.textContent=text.source; const action=document.createElement('a'); action.className='home-media-report-action'; action.href=text.article; action.textContent=`${text.action} →`; body.append(meta,headline,summary,source,action); card.appendChild(body); return card;
  }
  function init(){
    const locale=getLocale(); const text=copy[locale]||copy['zh-Hant']; const roots=assetRoot(); addStylesheet(roots.css); injectNewsNav(text); if(document.getElementById('home-media-reports')) return; const latest=document.getElementById('news-flash'); if(!latest) return;
    const section=document.createElement('section'); section.id='home-media-reports'; section.className='home-media-reports-section'; section.setAttribute('aria-labelledby','homeMediaReportsTitle'); const container=document.createElement('div'); container.className='container';
    const header=document.createElement('div'); header.className='home-news-stream-head home-flash-head home-media-reports-head'; const headerCopy=document.createElement('div'); const eyebrow=document.createElement('div'); eyebrow.className='art-eyebrow dark'; eyebrow.textContent=text.eyebrow; const title=document.createElement('h2'); title.id='homeMediaReportsTitle'; title.textContent=text.title; const description=document.createElement('p'); description.textContent=text.description; headerCopy.append(eyebrow,title,description); const allLink=document.createElement('a'); allLink.className='home-media-all-link'; allLink.href=text.index; allLink.textContent=`${text.all} →`; header.append(headerCopy,allLink);
    const viewport=document.createElement('div'); viewport.className='home-media-report-viewport'; viewport.setAttribute('role','region'); viewport.setAttribute('aria-label',text.title); viewport.tabIndex=0; const track=document.createElement('div'); track.className='home-media-report-track'; track.setAttribute('role','list'); [...reports].sort((a,b)=>Date.parse(`${b.date}T12:00:00+08:00`)-Date.parse(`${a.date}T12:00:00+08:00`)).forEach(report=>track.appendChild(buildCard(text,roots,report))); viewport.appendChild(track);
    const note=document.createElement('p'); note.className='home-media-report-note'; note.append(document.createTextNode(`${text.note} `)); const reportSource=document.createElement('a'); reportSource.href=NEXTTV_URL; reportSource.target='_blank'; reportSource.rel='noopener noreferrer'; reportSource.textContent='Next TV ↗'; const separator=document.createTextNode(' · '); const photoSource=document.createElement('a'); photoSource.href=PHOTO_SOURCE_URL; photoSource.target='_blank'; photoSource.rel='noopener noreferrer'; photoSource.textContent='太報／TaiSounds ↗'; note.append(reportSource,separator,photoSource);
    container.append(header,viewport,note); section.appendChild(container); latest.insertAdjacentElement('afterend',section); if(window.location.hash==='#home-media-reports') requestAnimationFrame(()=>section.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'}));
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();