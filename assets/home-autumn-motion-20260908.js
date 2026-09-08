(()=>{
  const gsap=window.gsap;
  if(!gsap||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const shell=document.querySelector('.home-latest-flash .is-ferris-wheel');
  const avatar=document.querySelector('.premium-home-hero .premium-art-card');
  if(shell){
    gsap.to(shell,{backgroundPosition:'52% 48%',duration:8,repeat:-1,yoyo:true,ease:'sine.inOut'});
    const cards=shell.querySelectorAll('.home-document-disc-card');
    gsap.to(cards,{y:(i)=>i%2?-3:3,rotate:(i)=>i%2?-.45:.45,duration:2.8,stagger:.18,repeat:-1,yoyo:true,ease:'sine.inOut'});
  }
  if(avatar)gsap.fromTo(avatar,{y:10,autoAlpha:.72,scale:.985},{y:0,autoAlpha:1,scale:1,duration:.8,ease:'power3.out',clearProps:'opacity,visibility,transform'});
  gsap.utils.toArray('.home-pinned-report-card,.home-news-card,.home-case-reel-card').forEach((card,index)=>{
    gsap.fromTo(card,{y:12,rotate:index%2?-.18:.18},{y:0,rotate:0,duration:.72,delay:Math.min(index,6)*.045,ease:'power2.out'});
  });
  gsap.to('.home-priority-strip,.home-policy-news,.home-feature-stream',{backgroundPosition:'51% 49%',duration:12,repeat:-1,yoyo:true,ease:'sine.inOut'});
})();
