/* Same-origin, language-aware media. Full films load only after a visitor clicks. */
(()=>{
  'use strict';
  const script=document.currentScript;
  const asset=name=>new URL('video/'+name,script.src).href;
  const language=document.documentElement.lang;
  const hans=language==='zh-Hans';
  const words={
    'zh-Hant':{pause:'暫停動畫',play:'播放動畫',error:'影片暫時無法播放，請使用下方連結開啟影片。'},
    'zh-Hans':{pause:'暂停动画',play:'播放动画',error:'影片暂时无法播放，请使用下方链接开启影片。'},
    en:{pause:'Pause animation',play:'Play animation',error:'The video could not play. Use the link below to open it.'},
    ja:{pause:'アニメーションを一時停止',play:'アニメーションを再生',error:'動画を再生できません。下のリンクから開いてください。'}
  }[language]||{pause:'Pause animation',play:'Play animation',error:'Use the video link below.'};
  const loop=document.querySelector('.cinema-loop');
  const toggle=document.querySelector('[data-cinema-toggle]');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const connection=navigator.connection;
  let wantsMotion=!reduce.matches&&!connection?.saveData&&!/^(slow-)?2g$/.test(connection?.effectiveType||'');
  // The advocacy preview can live below the watercolor hero; don't load it until it is in view.
  let visible=loop.getBoundingClientRect().top<innerHeight&&loop.getBoundingClientRect().bottom>0;
  const startLoop=()=>{
    if(!loop.getAttribute('src')){loop.src=asset('guardian-loop-20261013.mp4');loop.load();}
    loop.muted=true;
    loop.play().catch(()=>{wantsMotion=false;syncToggle();});
  };
  const syncToggle=()=>{toggle.textContent=loop.paused?words.play:words.pause;toggle.setAttribute('aria-pressed',String(!loop.paused));};
  const syncLoop=()=>{if(wantsMotion&&visible&&!document.hidden&&!dialog.open)startLoop();else loop.pause();syncToggle();};
  loop.addEventListener('playing',()=>{loop.classList.add('is-ready');syncToggle();});
  loop.addEventListener('pause',syncToggle);
  loop.addEventListener('error',()=>{loop.classList.remove('is-ready');toggle.hidden=true;});
  toggle.hidden=false;
  toggle.addEventListener('click',()=>{wantsMotion=loop.paused;if(wantsMotion){visible=true;startLoop();}else syncLoop();});
  reduce.addEventListener('change',()=>{wantsMotion=!reduce.matches&&!connection?.saveData;if(reduce.matches)loop.classList.remove('is-ready');syncLoop();});
  document.addEventListener('visibilitychange',syncLoop);
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;syncLoop();},{threshold:.05}).observe(loop);
  const dialog=document.querySelector('.cinema-dialog');
  const player=dialog.querySelector('video');
  const openers=[...document.querySelectorAll('[data-cinema-open]')];
  let opener=openers[0];
  const download=dialog.querySelector('[data-cinema-file]');
  const error=dialog.querySelector('[data-cinema-error]');
  const editions=[...dialog.querySelectorAll('[data-cinema-edition]')];
  let edition=hans||(language!=='zh-Hant'&&location.hostname==='cn.globalprotectionwall.com')?'zh-Hans':'zh-Hant';
  const film=()=>asset('kaikai-cinema-'+edition+'-20261013.mp4');
  const selectEdition=(next,resume=false)=>{
    const time=resume?player.currentTime:0;
    edition=next;error.hidden=true;download.href=film();
    editions.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.cinemaEdition===edition)));
    player.src=film();player.load();
    if(resume)player.addEventListener('loadedmetadata',()=>{player.currentTime=Math.min(time,player.duration);},{once:true});
    player.play().catch(()=>{});
  };
  openers.forEach(button=>button.href=film());download.href=film();
  openers.forEach(button=>button.addEventListener('click',event=>{
    if(typeof dialog.showModal!=='function')return;
    event.preventDefault();opener=button;dialog.showModal();document.documentElement.classList.add('cinema-modal-open');loop.pause();selectEdition(edition);
  }));
  editions.forEach(button=>button.addEventListener('click',()=>selectEdition(button.dataset.cinemaEdition,true)));
  const unloadFilm=()=>{player.pause();if(player.hasAttribute('src')){player.removeAttribute('src');player.load();}error.hidden=true;};
  const closeFilm=()=>{unloadFilm();dialog.close();};
  dialog.querySelector('[data-cinema-close]').addEventListener('click',closeFilm);
  dialog.addEventListener('cancel',unloadFilm);
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)closeFilm();});
  dialog.addEventListener('close',()=>{unloadFilm();document.documentElement.classList.remove('cinema-modal-open');opener.focus();syncLoop();});
  player.addEventListener('error',()=>{if(player.hasAttribute('src')){error.textContent=words.error;error.hidden=false;}});
  syncLoop();
})();

