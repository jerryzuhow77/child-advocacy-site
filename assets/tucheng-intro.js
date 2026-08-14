(()=>{
  const intro=document.querySelector('[data-tucheng-intro]');
  if(!intro)return;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let returnFocus=null;
  const open=()=>{
    returnFocus=document.activeElement;
    intro.hidden=false;
    document.body.classList.add('tucheng-intro-active');
    requestAnimationFrame(()=>intro.classList.add('is-playing'));
    const skip=intro.querySelector('[data-tucheng-intro-close]');
    if(skip)skip.focus({preventScroll:true});
  };
  const close=()=>{
    intro.classList.remove('is-playing');
    document.body.classList.remove('tucheng-intro-active');
    window.setTimeout(()=>{intro.hidden=true;if(returnFocus&&returnFocus.focus)returnFocus.focus({preventScroll:true})},reduce?0:420);
  };
  document.querySelectorAll('[data-tucheng-intro-open]').forEach(button=>button.addEventListener('click',open));
  intro.querySelectorAll('[data-tucheng-intro-close]').forEach(button=>button.addEventListener('click',close));
  intro.addEventListener('keydown',event=>{
    if(event.key==='Escape')close();
    if(event.key==='Tab'){
      const focusable=[...intro.querySelectorAll('button:not([disabled])')];
      if(!focusable.length)return;
      const first=focusable[0],last=focusable[focusable.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
    }
  });
  window.setTimeout(open,reduce?120:360);
})();
