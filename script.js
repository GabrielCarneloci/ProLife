(function(){
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover:hover)').matches;

  /* scroll: nav state + progress bar (rAF-throttled, passive) */
  var nav = document.getElementById('nav');
  var progress = document.getElementById('progress');
  var ticking = false;

  function onScrollFrame(){
    var scrollY = window.scrollY;
    nav.classList.toggle('scrolled', scrollY > 40);
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    progress.style.width = pct + '%';
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if(!ticking){
      requestAnimationFrame(onScrollFrame);
      ticking = true;
    }
  }, {passive:true});

  /* FAQ accordion */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function(item){
    item.querySelector('.faq-q').addEventListener('click', function(){
      faqItems.forEach(function(i){ if(i !== item) i.classList.remove('open'); });
      item.classList.toggle('open');
    });
  });

  /* reveal on scroll */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:0.12});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  /* hero glow follows cursor (desktop only, rAF-throttled) */
  var heroSection = document.getElementById('heroSection');
  var glow = document.getElementById('heroGlow');
  if(heroSection && glow && canHover && !reduceMotion){
    var glowTicking = false, lastX = 0, lastY = 0;
    heroSection.addEventListener('mousemove', function(e){
      var r = heroSection.getBoundingClientRect();
      lastX = e.clientX - r.left - 260;
      lastY = e.clientY - r.top - 260;
      if(!glowTicking){
        requestAnimationFrame(function(){
          glow.style.transform = 'translate(' + lastX + 'px,' + lastY + 'px)';
          glowTicking = false;
        });
        glowTicking = true;
      }
    }, {passive:true});
  }

  /* animated hero counters */
  document.querySelectorAll('.hero-mark .n').forEach(function(el){
    var raw = el.textContent.trim();
    var match = raw.match(/[\d.,]+/);
    if(!match) return;
    var target = parseFloat(match[0].replace('.', '').replace(',', '.'));
    if(isNaN(target)) return;
    var suffix = raw.replace(match[0], '');
    var started = false;
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting && !started){
          started = true;
          if(reduceMotion){ el.textContent = raw; return; }
          var cur = 0, step = target / 26;
          var t = setInterval(function(){
            cur += step;
            if(cur >= target){ cur = target; clearInterval(t); }
            el.textContent = (Number.isInteger(target) ? Math.round(cur) : cur.toFixed(1)) + suffix;
          }, 28);
        }
      });
    }, {threshold:0.5});
    obs.observe(el);
  });

  /* magnetic CTA buttons (desktop only) */
  if(canHover && !reduceMotion){
    document.querySelectorAll('.btn-lime').forEach(function(btn){
      btn.addEventListener('mousemove', function(e){
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.25;
        var y = (e.clientY - r.top - r.height / 2) * 0.35;
        btn.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      btn.addEventListener('mouseleave', function(){ btn.style.transform = 'translate(0,0)'; });
    });
  }
})();
