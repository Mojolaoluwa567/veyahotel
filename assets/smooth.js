// Lenis inertia scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync
(()=>{
 if(matchMedia('(prefers-reduced-motion: reduce)').matches||!window.Lenis||!window.gsap)return;
 const l=new Lenis({lerp:.085,wheelMultiplier:.9,smoothWheel:true});
 window.lenis=l;
 if(window.ScrollTrigger)l.on('scroll',ScrollTrigger.update);
 gsap.ticker.add(t=>l.raf(t*1000));
 gsap.ticker.lagSmoothing(0);
})();
