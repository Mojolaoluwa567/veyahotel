gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ignoreMobileResize:true});
const $=(s,c=document)=>[...c.querySelectorAll(s)];
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const track=document.getElementById('track'),bar=document.getElementById('bar'),ch=document.getElementById('ch');
const mobile=()=>innerWidth<761;
const touch=matchMedia('(hover:none)');

// cards: desktop click opens the page, touch first reveals the description
const goTo=h=>{const a=document.createElement('a');a.href=h;document.body.appendChild(a);a.click();a.remove()};
const tog=el=>{const was=el.classList.contains('on');$('.hv.on,.hv2.on').forEach(x=>x.classList.remove('on'));el.classList.toggle('on',!was)};
$('.hv').forEach(el=>{
 el.addEventListener('click',e=>{if(e.target.closest('a'))return;touch.matches?tog(el):el.dataset.href&&goTo(el.dataset.href)});
 el.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.target.closest('a')&&el.dataset.href)goTo(el.dataset.href)});
});
$('.hv2').forEach(el=>el.addEventListener('click',e=>{if(touch.matches&&!e.target.closest('a'))tog(el)}));
document.addEventListener('click',e=>{if(touch.matches&&!e.target.closest('.hv,.hv2'))$('.hv.on,.hv2.on').forEach(x=>x.classList.remove('on'))});

const counters=()=>$('[data-n]').forEach(el=>{const o={v:0};gsap.to(o,{v:+el.dataset.n,duration:1.6,ease:'power2.out',onUpdate:()=>el.textContent=Math.round(o.v)})});

if(rm){
 document.documentElement.classList.add('rm');$('[data-n]').forEach(e=>e.textContent=e.dataset.n);
}else{
 const panels=$('.p');let cur=-1,ctx,first=true,offs=[];
 const measure=()=>{offs=panels.map(p=>p.offsetLeft)};
 const onReady=f=>window.veyaReady?f():addEventListener('veya:ready',f,{once:true});
 const smooth=()=>!!window.lenis&&!mobile();
 const setCh=i=>{if(i===cur)return;cur=i;ch.innerHTML='<b>'+String(i+1).padStart(2,'0')+'</b><span>'+panels[i].dataset.ch+'</span>';document.body.classList.toggle('lt',panels[i].dataset.theme==='light')};
 const build=()=>{
  ctx&&ctx.revert();
  measure();
  ctx=gsap.context(()=>{
   const dist=()=>track.scrollWidth-innerWidth;
   const factor=mobile()?.8:1;
   const tween=gsap.to(track,{x:()=>-dist(),ease:'none',scrollTrigger:{
    trigger:'#pin',pin:true,scrub:smooth()?true:.5,start:'top top',end:()=>'+='+dist()*factor,
    invalidateOnRefresh:true,anticipatePin:1,
    onUpdate:s=>{bar.style.transform='scaleX('+s.progress+')';const x=s.progress*dist()+innerWidth*.5;let i=0;for(let k=0;k<offs.length;k++)if(offs[k]<=x)i=k;setCh(i)}}});
   const ca={containerAnimation:tween};
   if(first){
    const t1=gsap.from('#hero .in > *',{y:40,opacity:0,duration:1,stagger:.12,ease:'power3.out',paused:true});
    const t2=gsap.fromTo('#hero .bg img',{scale:1.15},{scale:1,duration:2.6,ease:'power2.out',paused:true});
    const t3=gsap.from('.mega',{yPercent:30,opacity:0,duration:1.4,ease:'power3.out',paused:true});
    onReady(()=>{t1.play();t2.play();t3.play()});
   }
   // giant wordmark drifts left as you travel
   gsap.to('.mega',{x:()=>-innerWidth*.3,ease:'none',scrollTrigger:{trigger:'#hero',start:'left left',end:'right left',scrub:true,...ca}});
   $('.p:not(#hero) .h h2, .p:not(#hero) .in h2, #intro .t h2').forEach(h=>
    gsap.from(h,{x:80,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:h,start:'left 92%',...ca,toggleActions:'play none none reverse'}}));
   $('.ph, .rc, .more').forEach(el=>{
    gsap.from(el,{clipPath:'inset(0 0 0 100%)',duration:1.1,ease:'power3.out',scrollTrigger:{trigger:el,start:'left 95%',...ca,toggleActions:'play none none none'}});
    const img=$('img',el)[0];
    if(img&&!el.classList.contains('rc'))gsap.fromTo(img,{x:'-10%',scale:1.2},{x:'10%',ease:'none',scrollTrigger:{trigger:el,start:'left right',end:'right left',scrub:true,...ca}});
   });
   $('.rc').forEach(c=>gsap.from($('img',c)[0],{x:'-8%',scale:1.18,ease:'none',scrollTrigger:{trigger:c,start:'left right',end:'right left',scrub:true,...ca}}));
   gsap.fromTo('#sky .bg img',{x:'-6%'},{x:'6%',ease:'none',scrollTrigger:{trigger:'#sky',start:'left right',end:'right left',scrub:true,...ca}});
   gsap.from('#sky .chips .hv2',{y:20,opacity:0,stagger:.1,scrollTrigger:{trigger:'#sky .chips',start:'left 85%',...ca,toggleActions:'play none none reverse'}});
   ScrollTrigger.create({trigger:'.stats',start:'left 90%',once:true,onEnter:counters,...ca});
  });
  first=false;setCh(0);
 };
 build();
 let w=innerWidth;addEventListener('resize',()=>{if(innerWidth!==w){w=innerWidth;build()}});
}
