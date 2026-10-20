document.documentElement.classList.add('lx-js');
const items=document.querySelectorAll('.lx-reveal');
if('IntersectionObserver'in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.12});items.forEach(el=>io.observe(el))}else{items.forEach(el=>el.classList.add('is-visible'))}
