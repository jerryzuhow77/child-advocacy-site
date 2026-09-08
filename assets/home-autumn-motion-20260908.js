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
  if(avatar)gsap.fromTo(avatar,{y:10,autoAlpha:.01},{y:0,autoAlpha:1,duration:.8,ease:'power3.out',clearProps:'opacity,visibility'});
})();
