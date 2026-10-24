(()=>{
const d=document,h=d.documentElement;
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
let cv=d.querySelector('.curtain');
if(!cv){cv=d.createElement('div');cv.className='curtain';cv.setAttribute('aria-hidden','true');cv.innerHTML='<b>Veya</b>';d.body.prepend(cv)}

// ---- arrive: curtain is already covering (static markup + .cv), wait for fonts + hero image, then wipe up
let lifted=false;
const reset=()=>{cv.style.transition='none';h.classList.remove('out');void cv.offsetHeight;cv.style.transition=''};
const lift=()=>{
 if(lifted)return;lifted=true;
 h.classList.remove('cv');h.classList.add('out');
 setTimeout(()=>{window.veyaReady=true;dispatchEvent(new Event('veya:ready'))},380);
 setTimeout(reset,900);
};
const hi=d.querySelector('.rh>img,#hero .bg img');
Promise.all([d.fonts&&d.fonts.ready,hi&&hi.decode?hi.decode().catch(()=>{}):0]).then(()=>setTimeout(lift,250));
setTimeout(lift,2600);
if(rm){h.classList.remove('cv');window.veyaReady=true;dispatchEvent(new Event('veya:ready'))}
addEventListener('pageshow',e=>{if(e.persisted){h.classList.remove('leave','cv','out');window.veyaReady=true;window.lenis&&lenis.start()}});

// ---- leave: curtain rises from the bottom, navigate only when it fully covers the page
let leaving=false;
const prefetch=a=>{if(a.dataset.pf)return;a.dataset.pf=1;const l=d.createElement('link');l.rel='prefetch';l.href=a.href;d.head.appendChild(l)};
['pointerenter','touchstart','focusin'].forEach(t=>d.addEventListener(t,e=>{const a=e.target.closest&&e.target.closest('a[href]');if(a&&/^(https?|file):$/.test(a.protocol)&&a.origin===location.origin&&a.pathname!==location.pathname)prefetch(a)},{passive:true,capture:true}));
const leave=url=>{
 if(leaving)return;leaving=true;
 window.lenis&&lenis.stop();
 reset();
 let done=false;const fin=()=>{if(done)return;done=true;location.href=url};
 cv.addEventListener('transitionend',e=>{if(e.target===cv)fin()});
 setTimeout(fin,1000);
 requestAnimationFrame(()=>requestAnimationFrame(()=>h.classList.add('leave')));
};
d.addEventListener('click',e=>{
 const a=e.target.closest('a[href]');
 if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button||a.target||a.hasAttribute('download'))return;
 let u;try{u=new URL(a.href,location.href)}catch(_){return}
 if(!/^(https?|file):$/.test(u.protocol)||u.origin!==location.origin)return;
 if(u.pathname===location.pathname&&u.search===location.search){
  if(!u.hash){e.preventDefault();window.lenis?lenis.scrollTo(0,{duration:1.6}):scrollTo({top:0,behavior:rm?'auto':'smooth'})}
  return;
 }
 e.preventDefault();
 rm?(location.href=u.href):leave(u.href);
});

// ---- cursor follower (mouse devices only)
if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!rm){
 const c=d.createElement('div');c.className='cur';c.innerHTML='<span></span>';d.body.appendChild(c);
 const t=c.firstChild;let x=-100,y=-100,cx=x,cy=y;
 addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY},{passive:true});
 (function loop(){cx+=(x-cx)*.2;cy+=(y-cy)*.2;c.style.transform='translate3d('+cx+'px,'+cy+'px,0)';requestAnimationFrame(loop)})();
 d.addEventListener('mouseover',e=>{
  const el=e.target.closest('[data-cur],.hv,.rm .ph,.card');
  if(el){t.textContent=el.dataset.cur||(el.classList.contains('hv')?'View':'Open');c.classList.add('big')}else c.classList.remove('big');
 });
}
})();
