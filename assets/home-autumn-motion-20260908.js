(()=>{
  const gsap=window.gsap;
  if(!gsap||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const shell=document.querySelector('.home-latest-flash .is-ferris-wheel');
  const avatar=document.querySelector('.premium-home-hero .premium-art-card');
  if(shell&&!window.matchMedia('(max-width:760px)').matches){
    gsap.to(shell,{backgroundPosition:'52% 48%',duration:8,repeat:-1,yoyo:true,ease:'sine.inOut'});
  }
  if(avatar)gsap.fromTo(avatar,{y:10,autoAlpha:.72,scale:.985},{y:0,autoAlpha:1,scale:1,duration:.8,ease:'power3.out',clearProps:'opacity,visibility,transform'});
  gsap.utils.toArray('.home-pinned-report-card,.home-news-card,.home-case-reel-card').forEach((card,index)=>{
    gsap.fromTo(card,{y:12,rotate:index%2?-.18:.18},{y:0,rotate:0,duration:.72,delay:Math.min(index,6)*.045,ease:'power2.out'});
  });
})();
