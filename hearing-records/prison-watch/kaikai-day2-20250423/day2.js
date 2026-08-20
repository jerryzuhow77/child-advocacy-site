(()=>{
  'use strict';
  const menu=document.querySelector('.day2-menu');
  const toc=document.querySelector('.day2-toc');
  menu?.addEventListener('click',()=>{const open=!toc.classList.contains('is-open');toc.classList.toggle('is-open',open);menu.setAttribute('aria-expanded',String(open));});
  toc?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{toc.classList.remove('is-open');menu?.setAttribute('aria-expanded','false');}));

  const progress=document.querySelector('.day2-progress i');
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
  gsap.from('.day2-hero-copy>*',{y:30,autoAlpha:0,duration:.9,stagger:.08,ease:'power3.out'});
  gsap.from('.day2-hero-poster',{x:55,rotate:5,autoAlpha:0,duration:1.2,ease:'power3.out'});
  gsap.to('.day2-hero-paper',{yPercent:12,ease:'none',scrollTrigger:{trigger:'.day2-hero',start:'top top',end:'bottom top',scrub:1}});
  gsap.utils.toArray('.day2-reveal').filter(el=>!el.closest('.day2-juror-wall')).forEach((el,i)=>gsap.fromTo(el,{y:42,autoAlpha:0},{y:0,autoAlpha:1,duration:.78,delay:(i%3)*.035,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 86%',once:true}}));
  gsap.utils.toArray('.day2-issues article').forEach((card,i)=>gsap.from(card,{x:i%2?-36:36,autoAlpha:0,duration:.7,scrollTrigger:{trigger:card,start:'top 87%',once:true}}));
  gsap.utils.toArray('.day2-lens-grid article').forEach((card,i)=>gsap.from(card,{y:28,scale:.96,autoAlpha:0,duration:.65,delay:i*.06,ease:'power2.out',scrollTrigger:{trigger:card,start:'top 88%',once:true}}));

  const jurorCards=gsap.utils.toArray('.day2-juror-wall article');
  const jurorPath=document.querySelector('.day2-question-path');
  const jurorPathBar=jurorPath?.querySelector('i');
  const jurorPathCount=jurorPath?.querySelector('b');
  const activateJurorTopic=index=>{
    const columns=matchMedia('(max-width: 760px)').matches?1:2;
    const first=Math.floor(index/columns)*columns;
    const last=Math.min(first+columns-1,jurorCards.length-1);
    jurorCards.forEach((card,cardIndex)=>{
      card.classList.toggle('is-current',cardIndex>=first&&cardIndex<=last);
    });
    if(jurorPathCount){
      const range=first===last?String(first+1).padStart(2,'0'):String(first+1).padStart(2,'0')+'–'+String(last+1).padStart(2,'0');
      jurorPathCount.textContent=range+' / '+String(jurorCards.length).padStart(2,'0');
    }
    if(jurorPathBar)gsap.to(jurorPathBar,{scaleX:(last+1)/jurorCards.length,duration:.45,ease:'power2.out',overwrite:true});
  };
  jurorCards.forEach((card,index)=>{
    const parts=card.querySelectorAll('b,h3,p,small');
    const entrance=gsap.timeline({scrollTrigger:{trigger:card,start:'top 88%',once:true}});
    entrance.fromTo(card,{y:40,rotateY:index%2?-4:4,autoAlpha:0},{y:0,rotateY:0,autoAlpha:1,duration:.74,ease:'power3.out'})
      .from(parts,{y:14,autoAlpha:0,duration:.46,stagger:.07,ease:'power2.out'},'-=.5');
    ScrollTrigger.create({trigger:card,start:'top 58%',end:'bottom 42%',onEnter:()=>activateJurorTopic(index),onEnterBack:()=>activateJurorTopic(index)});
  });
  gsap.to('.day2-closing-door i:first-child',{xPercent:-18,ease:'none',scrollTrigger:{trigger:'.day2-closing',start:'top 70%',end:'center 45%',scrub:1}});
  gsap.to('.day2-closing-door i:last-child',{xPercent:18,ease:'none',scrollTrigger:{trigger:'.day2-closing',start:'top 70%',end:'center 45%',scrub:1}});

  const fullRecord=document.querySelector('.day2-full-record');
  const chapters=fullRecord?[...fullRecord.querySelectorAll('.day2-transcript-chapter')]:[];
  if(fullRecord&&chapters.length){
    const ambience=document.createElement('div');
    ambience.className='day2-record-ambience';
    ambience.setAttribute('aria-hidden','true');
    ambience.innerHTML='<i></i><i></i><i></i>';
    fullRecord.prepend(ambience);

    const reader=document.createElement('div');
    reader.className='day2-record-progress';
    reader.setAttribute('aria-label','第二日庭審對話閱讀進度');
    reader.innerHTML='<strong>庭審對話</strong><span><i></i></span><b>01 / '+String(chapters.length).padStart(2,'0')+'</b>';
    fullRecord.querySelector('.day2-transcript')?.before(reader);
    const readerBar=reader.querySelector('i');
    const readerCount=reader.querySelector('b');

    chapters.forEach((chapter,index)=>{
      const current=String(index+1).padStart(2,'0');
      ScrollTrigger.create({
        trigger:chapter,start:'top 52%',end:'bottom 48%',
        onToggle:self=>chapter.classList.toggle('is-reading',self.isActive),
        onEnter:()=>{readerCount.textContent=current+' / '+String(chapters.length).padStart(2,'0');gsap.to(readerBar,{scaleX:(index+1)/chapters.length,duration:.45,ease:'power2.out'});},
        onEnterBack:()=>{readerCount.textContent=current+' / '+String(chapters.length).padStart(2,'0');gsap.to(readerBar,{scaleX:(index+1)/chapters.length,duration:.45,ease:'power2.out'});}
      });
    });
    gsap.utils.toArray('.day2-dispute-note').forEach(note=>gsap.fromTo(note,{x:-16,autoAlpha:0},{x:0,autoAlpha:1,duration:.62,ease:'power2.out',scrollTrigger:{trigger:note,start:'top 90%',once:true}}));
    gsap.utils.toArray('.day2-key-mark').forEach(mark=>gsap.fromTo(mark,{backgroundSize:'0% 100%'},{backgroundSize:'100% 100%',duration:.7,ease:'power1.out',scrollTrigger:{trigger:mark,start:'top 92%',once:true}}));

    const motion=gsap.matchMedia();
    motion.add('(min-width: 761px)',()=>{
      gsap.utils.toArray('.day2-transcript-chapter').forEach((chapter,index)=>gsap.fromTo(chapter,{x:index%2?-34:34,rotate:index%2?-.25:.25},{x:0,rotate:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:chapter,start:'top 90%',once:true}}));
      gsap.utils.toArray('.day2-dialogue-pair').forEach((pair,index)=>gsap.fromTo(pair,{y:18,autoAlpha:.72},{y:0,autoAlpha:1,duration:.48,delay:(index%4)*.025,ease:'power2.out',scrollTrigger:{trigger:pair,start:'top 94%',once:true}}));
      gsap.to('.day2-pdf-figure img',{scale:1.06,yPercent:5,ease:'none',scrollTrigger:{trigger:'.day2-pdf-figure',start:'top 85%',end:'bottom 20%',scrub:1}});
      gsap.to('.day2-record-ambience i:nth-child(1)',{y:180,rotate:26,ease:'none',scrollTrigger:{trigger:fullRecord,start:'top bottom',end:'bottom top',scrub:1.4}});
      gsap.to('.day2-record-ambience i:nth-child(2)',{y:-150,rotate:-18,ease:'none',scrollTrigger:{trigger:fullRecord,start:'top bottom',end:'bottom top',scrub:1.6}});
      gsap.to('.day2-record-ambience i:nth-child(3)',{y:-110,scale:1.2,ease:'none',scrollTrigger:{trigger:fullRecord,start:'top bottom',end:'bottom top',scrub:1.8}});
    });
    motion.add('(max-width: 760px)',()=>gsap.utils.toArray('.day2-transcript-chapter').forEach(chapter=>gsap.fromTo(chapter,{y:22,autoAlpha:.7},{y:0,autoAlpha:1,duration:.55,ease:'power2.out',scrollTrigger:{trigger:chapter,start:'top 92%',once:true}})));
  }
})();
