(()=>{
  'use strict';
  const menu=document.querySelector('.day1-menu');
  const toc=document.querySelector('.day1-toc');
  menu?.addEventListener('click',()=>{const open=!toc.classList.contains('is-open');toc.classList.toggle('is-open',open);menu.setAttribute('aria-expanded',String(open));});
  toc?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{toc.classList.remove('is-open');menu?.setAttribute('aria-expanded','false');}));

  const progress=document.querySelector('.day1-progress i');
  const links=[...(toc?.querySelectorAll('a')||[])];
  const sections=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const update=()=>{
    const max=document.documentElement.scrollHeight-innerHeight;
    const ratio=max>0?Math.min(1,scrollY/max):0;
    if(progress) progress.style.transform=`scaleX(${ratio})`;
    let current=sections[0];sections.forEach(s=>{if(s.getBoundingClientRect().top<innerHeight*.42)current=s;});
    links.forEach(a=>a.classList.toggle('is-active',current&&a.getAttribute('href')==='#'+current.id));
  };
  addEventListener('scroll',update,{passive:true});update();

  if(!window.gsap||!window.ScrollTrigger||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.day1-hero-copy>*',{y:30,autoAlpha:0,duration:.9,stagger:.08,ease:'power3.out'});
  gsap.from('.day1-hero-poster',{x:55,rotate:5,autoAlpha:0,duration:1.2,ease:'power3.out'});
  gsap.to('.day1-hero-paper',{yPercent:12,ease:'none',scrollTrigger:{trigger:'.day1-hero',start:'top top',end:'bottom top',scrub:1}});
  gsap.utils.toArray('.day1-reveal').forEach((el,i)=>gsap.fromTo(el,{y:42,autoAlpha:0},{y:0,autoAlpha:1,duration:.78,delay:(i%3)*.035,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 86%',once:true}}));
  gsap.utils.toArray('.day1-issues article').forEach((card,i)=>gsap.from(card,{x:i%2?-36:36,autoAlpha:0,duration:.7,scrollTrigger:{trigger:card,start:'top 87%',once:true}}));
  gsap.to('.day1-closing-door i:first-child',{xPercent:-18,ease:'none',scrollTrigger:{trigger:'.day1-closing',start:'top 70%',end:'center 45%',scrub:1}});
  gsap.to('.day1-closing-door i:last-child',{xPercent:18,ease:'none',scrollTrigger:{trigger:'.day1-closing',start:'top 70%',end:'center 45%',scrub:1}});

  const fullRecord=document.querySelector('.day1-full-record');
  const chapters=fullRecord?[...fullRecord.querySelectorAll('.day1-transcript-chapter')]:[];
  if(fullRecord&&chapters.length){
    const reader=document.createElement('div');
    reader.className='day1-record-progress';
    reader.setAttribute('aria-label','第一日庭審程序閱讀進度');
    reader.innerHTML='<strong>庭審程序</strong><span><i></i></span><b>01 / '+String(chapters.length).padStart(2,'0')+'</b>';
    fullRecord.querySelector('.day1-transcript')?.before(reader);
    const readerBar=reader.querySelector('i');
    const readerCount=reader.querySelector('b');
    chapters.forEach((chapter,index)=>{
      const current=String(index+1).padStart(2,'0');
      ScrollTrigger.create({trigger:chapter,start:'top 52%',end:'bottom 48%',onToggle:self=>chapter.classList.toggle('is-reading',self.isActive),onEnter:()=>{readerCount.textContent=current+' / '+String(chapters.length).padStart(2,'0');gsap.to(readerBar,{scaleX:(index+1)/chapters.length,duration:.4});},onEnterBack:()=>{readerCount.textContent=current+' / '+String(chapters.length).padStart(2,'0');gsap.to(readerBar,{scaleX:(index+1)/chapters.length,duration:.4});}});
    });
    gsap.utils.toArray('.day1-dispute-note').forEach(note=>gsap.fromTo(note,{x:-16,autoAlpha:0},{x:0,autoAlpha:1,duration:.62,ease:'power2.out',scrollTrigger:{trigger:note,start:'top 90%',once:true}}));
    gsap.utils.toArray('.day1-key-mark').forEach(mark=>gsap.fromTo(mark,{backgroundSize:'0% 100%'},{backgroundSize:'100% 100%',duration:.7,ease:'power1.out',scrollTrigger:{trigger:mark,start:'top 92%',once:true}}));
    const motion=gsap.matchMedia();
    motion.add('(min-width: 761px)',()=>{
      gsap.utils.toArray('.day1-transcript-chapter').forEach((chapter,index)=>gsap.fromTo(chapter,{x:index%2?-30:30,rotate:index%2?-.2:.2},{x:0,rotate:0,duration:.78,ease:'power3.out',scrollTrigger:{trigger:chapter,start:'top 90%',once:true}}));
      gsap.to('.day1-pdf-figure img',{scale:1.05,yPercent:4,ease:'none',scrollTrigger:{trigger:'.day1-pdf-figure',start:'top 85%',end:'bottom 20%',scrub:1}});
    });
    motion.add('(max-width: 760px)',()=>gsap.utils.toArray('.day1-transcript-chapter').forEach(chapter=>gsap.fromTo(chapter,{y:20,autoAlpha:.72},{y:0,autoAlpha:1,duration:.52,ease:'power2.out',scrollTrigger:{trigger:chapter,start:'top 92%',once:true}})));
  }
})();
