(()=>{
const q=(s,c=document)=>[...c.querySelectorAll(s)];
const nav=document.querySelector('nav');const onS=()=>nav.classList.toggle('sc',scrollY>40);onS();addEventListener('scroll',onS,{passive:true});
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(rm||!window.gsap){document.documentElement.classList.add('nomo');return}
gsap.registerPlugin(ScrollTrigger);
const onReady=f=>window.veyaReady?f():addEventListener('veya:ready',f,{once:true});
const intro=gsap.from('.rh .wrap > *',{y:36,opacity:0,duration:1,stagger:.12,ease:'power3.out',paused:true});
onReady(()=>intro.play());
q('[data-r]').forEach(el=>gsap.to(el,{opacity:1,y:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%'}}));
q('.rh>img').forEach(img=>gsap.fromTo(img,{yPercent:-4},{yPercent:4,ease:'none',scrollTrigger:{trigger:img.parentElement,start:'top top',end:'bottom top',scrub:true}}));
})();
