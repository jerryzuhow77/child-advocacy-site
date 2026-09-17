(() => {
  const reduce=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const nodes=[...document.querySelectorAll("[data-embroidered-brief]")];
  if(!nodes.length||reduce||!window.gsap)return;
  const gsap=window.gsap;
  if(window.ScrollTrigger)gsap.registerPlugin(window.ScrollTrigger);
  gsap.fromTo(nodes,{autoAlpha:0,y:24,rotateX:-3,transformPerspective:700},{autoAlpha:1,y:0,rotateX:0,duration:.78,stagger:.12,ease:"power3.out",scrollTrigger:window.ScrollTrigger?{trigger:nodes[0].parentElement,start:"top 86%",once:true}:undefined});
  nodes.forEach(node=>{node.addEventListener("pointerenter",()=>gsap.to(node,{y:-4,scale:1.012,duration:.28,ease:"power2.out",overwrite:true}));node.addEventListener("pointerleave",()=>gsap.to(node,{y:0,scale:1,duration:.42,ease:"power2.out",overwrite:true}));});
})();