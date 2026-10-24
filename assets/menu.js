(()=>{
const q=(s,c=document)=>[...c.querySelectorAll(s)];
const menu=document.getElementById('menu'),burger=document.getElementById('burger');if(!menu||!burger)return;let open=false;
const setMenu=(o,refocus)=>{open=o;menu.classList.toggle('open',o);burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Close menu':'Open menu');
 o?menu.removeAttribute('inert'):menu.setAttribute('inert','');
 if(o)setTimeout(()=>q('.ml',menu)[0].focus({preventScroll:true}),350);else if(refocus)burger.focus({preventScroll:true})};
burger.addEventListener('click',()=>setMenu(!open,true));
menu.addEventListener('click',e=>{if(e.target.closest('a,button'))setMenu(false)});
addEventListener('keydown',e=>{if(!open)return;
 if(e.key==='Escape')setMenu(false,true);
 if(e.key==='Tab'){const f=[burger,...q('button,a',menu)],i=f.indexOf(document.activeElement);
  if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}});
['touchmove','wheel'].forEach(t=>addEventListener(t,e=>{if(open&&menu.scrollHeight<=menu.clientHeight)e.preventDefault()},{passive:false}));
addEventListener('resize',()=>{if(innerWidth>760&&open)setMenu(false)});
})();
