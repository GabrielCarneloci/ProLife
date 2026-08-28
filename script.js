window.addEventListener('scroll',()=>{
  const nav=document.getElementById('nav');
  nav.classList.toggle('scrolled', window.scrollY>40);
  const h=document.documentElement;
  const pct=(h.scrollTop)/(h.scrollHeight-h.clientHeight)*100;
  document.getElementById('progress').style.width=pct+'%';
});

document.querySelectorAll('.faq-item').forEach(item=>{
  item.querySelector('.faq-q').addEventListener('click',()=>{
    document.querySelectorAll('.faq-item').forEach(i=>{if(i!==item)i.classList.remove('open')});
    item.classList.toggle('open');
  });
});

const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* hero glow follows cursor */
const heroSection=document.getElementById('heroSection');
const glow=document.getElementById('heroGlow');
if(heroSection && window.matchMedia('(hover:hover)').matches){
  heroSection.addEventListener('mousemove',e=>{
    const r=heroSection.getBoundingClientRect();
    glow.style.transform=`translate(${e.clientX-r.left-260}px, ${e.clientY-r.top-260}px)`;
  });
}

/* plan billing toggle */
document.querySelectorAll('.plan-toggle button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.plan-toggle button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const cycle=btn.dataset.cycle;
    document.querySelectorAll('.plan .price[data-'+cycle+']').forEach(el=>{
      el.innerHTML=el.dataset[cycle];
    });
    document.querySelectorAll('.plan .cycle[data-'+cycle+']').forEach(el=>{
      el.textContent=el.dataset[cycle];
    });
  });
});

/* animated hero counters */
document.querySelectorAll('.hero-mark .n').forEach(el=>{
  const raw=el.textContent.trim();
  const match=raw.match(/[\d.,]+/);
  if(!match) return;
  const target=parseFloat(match[0].replace('.','').replace(',','.'));
  if(isNaN(target)) return;
  const suffix=raw.replace(match[0],'');
  let started=false;
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting && !started){
        started=true;
        let cur=0; const step=target/26;
        const t=setInterval(()=>{
          cur+=step;
          if(cur>=target){cur=target;clearInterval(t);}
          el.textContent=(Number.isInteger(target)?Math.round(cur):cur.toFixed(1))+suffix;
        },28);
      }
    });
  },{threshold:0.5});
  obs.observe(el);
});

/* magnetic buttons */
document.querySelectorAll('.btn-lime').forEach(btn=>{
  if(!window.matchMedia('(hover:hover)').matches) return;
  btn.addEventListener('mousemove',e=>{
    const r=btn.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*0.25;
    const y=(e.clientY-r.top-r.height/2)*0.35;
    btn.style.transform=`translate(${x}px,${y}px)`;
  });
  btn.addEventListener('mouseleave',()=>{btn.style.transform='translate(0,0)';});
});