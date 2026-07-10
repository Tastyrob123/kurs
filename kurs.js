/* ============================================================
   TASTY STUDIOS · Gastronomie AI MasterClass
   kurs.js — ausgelagerte Interaktionen (super.so -> extern)
   Byte-genau aus dem Live-DOM extrahiert 2026-07-09.
   ============================================================ */

(function () {
  var SEL = '.notion-toggle[class*="notion-toggle-heading"]';
  var booted = false;
  function party() {
    var c = document.createElement('canvas');
    c.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:2147483647;';
    document.body.appendChild(c);
    var ctx = c.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2), vw = innerWidth, vh = innerHeight;
    c.width = vw * dpr; c.height = vh * dpr; ctx.scale(dpr, dpr);
    var colors = ['#F5D77A','#EFE3B8','#FFFFFF','#A9DcC1','#E7B7A3','#D9C27A','#C9A94E'];
    var parts = [];
    function burst(cx) {
      for (var i = 0; i < 90; i++) {
        var a = -Math.PI/2 + (Math.random()-0.5)*(Math.PI*0.62);
        var sp = 13 + Math.random()*13;
        parts.push({ x: cx+(Math.random()-0.5)*50, y: vh+12,
          vx: Math.cos(a)*sp, vy: Math.sin(a)*sp, g: 0.22+Math.random()*0.10,
          w: 5+Math.random()*7, h: 9+Math.random()*9, rot: Math.random()*6.28,
          vr: (Math.random()-0.5)*0.35, color: colors[(Math.random()*colors.length)|0],
          life: 0, ttl: 120+Math.random()*50, drag: 0.988 });
      }
    }
    burst(vw*0.5); setTimeout(function(){burst(vw*0.3);},160); setTimeout(function(){burst(vw*0.7);},300);
    var frame = 0;
    (function tick() {
      frame++; ctx.clearRect(0,0,vw,vh);
      for (var i = parts.length-1; i >= 0; i--) {
        var p = parts[i];
        p.vx *= p.drag; p.vy = p.vy*p.drag + p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
        var al = p.life < 16 ? 1 : Math.max(0, 1-(p.life-16)/(p.ttl-16));
        ctx.save(); ctx.globalAlpha = al; ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color; ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h); ctx.restore();
        if (p.life > p.ttl || p.y > vh+50) parts.splice(i, 1);
      }
      if (parts.length && frame < 520) requestAnimationFrame(tick); else c.remove();
    })();
  }
  function decorate() {
    document.querySelectorAll(SEL).forEach(function (block, i) {
      var sum = block.querySelector(':scope > .notion-toggle__summary');
      if (!sum || sum.querySelector('.done-check')) return;
      var key = 'done-' + ((sum.textContent || '').replace(/[‣\s]/g, '').slice(0, 40) || ('i' + i));
      var box = document.createElement('input');
      box.type = 'checkbox'; box.className = 'done-check';
      box.checked = localStorage.getItem(key) === '1';
      block.setAttribute('data-done', box.checked ? '1' : '0');
      box.addEventListener('click', function (e) { e.stopPropagation(); });
      box.addEventListener('change', function () {
        block.setAttribute('data-done', box.checked ? '1' : '0');
        localStorage.setItem(key, box.checked ? '1' : '0');
        updateBars();
      });
      sum.appendChild(box);
    });
  }
  function ensureBars() {
    document.querySelectorAll('.notion-tabs__panel').forEach(function (panel) {
      if (panel.querySelector(':scope > .done-progress')) return;
      var first = panel.querySelector(':scope > ' + SEL);
      if (!first) return;
      var bar = document.createElement('div');
      bar.className = 'done-progress';
      bar.innerHTML = '<div class="done-progress__inner"><div class="done-progress__track"><div class="done-progress__fill"></div></div><div class="done-progress__label"></div></div>';
      panel.insertBefore(bar, first);
    });
  }
  function updateBars() {
    document.querySelectorAll('.notion-tabs__panel').forEach(function (panel) {
      var bar = panel.querySelector(':scope > .done-progress'); if (!bar) return;
      var toggles = [].slice.call(panel.querySelectorAll(':scope > ' + SEL));
      var total = toggles.length; if (!total) return;
      var done = toggles.filter(function (t) { var c = t.querySelector('.done-check'); return c && c.checked; }).length;
      var pct = Math.round(done / total * 100);
      var fill = bar.querySelector('.done-progress__fill');
      var lab = bar.querySelector('.done-progress__label');
      var wasFull = bar.dataset.full === '1';
      var isFull = done === total;
      if (isFull && !wasFull && booted) party();
      bar.dataset.full = isFull ? '1' : '0';
      if (done === 0) { bar.classList.remove('is-on'); fill.style.width = '0%'; if (lab.textContent !== '') lab.textContent = ''; return; }
      bar.classList.add('is-on');
      if (fill.style.width !== pct + '%') fill.style.width = pct + '%';
      var txt = done + ' / ' + total + ' erledigt · ' + pct + '%';
      if (lab.textContent !== txt) lab.textContent = txt;
    });
  }
  function sync() { decorate(); ensureBars(); }
  function boot() { sync(); setTimeout(function () { updateBars(); booted = true; }, 80); }
  document.addEventListener('DOMContentLoaded', boot);
  boot();
  var t;
  new MutationObserver(function () { clearTimeout(t); t = setTimeout(function () { sync(); updateBars(); }, 150); })
    .observe(document.documentElement, { childList: true, subtree: true });
})();

/* ---- */

(function(){
  var IMG="https://files.catbox.moe/etxqcu.webp";
  var LOGO="https://files.catbox.moe/au80tp.png";
  var POSTER="https://files.catbox.moe/fpkny6.webp";
  function on(){ return /\/zutatenliste\/?$/.test(location.pathname); }
  function enhanceVideo(sc){
    var vwrap=sc.querySelector(".notion-video__content");
    var vid=vwrap&&vwrap.querySelector("video");
    if(!vid||vid.dataset.tsEnhanced) return;
    vid.dataset.tsEnhanced="1";
    vid.poster=POSTER; vid.setAttribute("poster",POSTER); vid.setAttribute("preload","none");
    vid.removeAttribute("controls");
    vwrap.style.position="relative";
    var ov=document.createElement("div"); ov.className="ts-play-overlay";
    ov.innerHTML='<span class="ts-play-btn"><svg viewBox="0 0 24 24" width="30" height="30" fill="#fff"><path d="M8 5v14l11-7z"/></svg></span>';
    ov.addEventListener("click",function(){ vid.setAttribute("controls","controls"); try{vid.play();}catch(e){} ov.parentNode&&ov.parentNode.removeChild(ov); });
    vwrap.appendChild(ov);
    var fs=document.createElement("button"); fs.className="ts-fs"; fs.type="button"; fs.setAttribute("aria-label","Vollbild");
    fs.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>';
    fs.addEventListener("click",function(e){ e.stopPropagation(); var el=vid; var r=el.requestFullscreen||el.webkitRequestFullscreen||el.webkitEnterFullscreen||el.msRequestFullscreen; if(r) r.call(el); });
    vwrap.appendChild(fs);
  }
  function mount(){
    if(!on()) return;
    var sc=document.querySelector(".super-content");
    if(!sc) return;
    enhanceVideo(sc);
    if(document.querySelector(".ts-hero")) return;
    var hero=document.createElement("div");
    hero.className="ts-hero";
    hero.innerHTML=
      '<img class="ts-hero__img" alt="DB IV — Zutaten" src="'+IMG+'">'+
      '<div class="ts-hero__text">'+
        '<img class="ts-hero__logo" alt="Tasty Studios" src="'+LOGO+'">'+
        '<div class="ts-hero__eyebrow">Lektion 2.3</div>'+
        '<h1 class="ts-hero__title">DB IV : <span class="ts-gold">Zutaten</span></h1>'+
      '</div>';
    var nr=sc.querySelector(".notion-root");
    if(nr) sc.insertBefore(hero, nr); else sc.appendChild(hero);
    ["block-395b95465534809d9337dc22e327d729",
     "block-395b9546553480bcb014ce28290876db"
    ].forEach(function(id){ var b=document.getElementById(id); if(b) b.style.display="none"; });
    Array.prototype.forEach.call(sc.querySelectorAll('.notion-image img[src*="logo_vektor"]'),
      function(img){ var blk=img.closest(".notion-image"); if(blk) blk.style.display="none"; });
    var nh=document.querySelector(".notion-header.page"); if(nh) nh.style.display="none";
  }
  mount();
  document.addEventListener("DOMContentLoaded", mount);
  new MutationObserver(mount).observe(document.documentElement,{childList:true,subtree:true});
})();

/* ---- */

(function(){
  var IMG="https://files.catbox.moe/4ezi8i.png";
  var LOGO="https://files.catbox.moe/au80tp.png";
  function mount(){
    var sc=document.querySelector(".super-content.page__index");
    if(!sc || sc.querySelector(".ts-hero")) return;
    var hero=document.createElement("div");
    hero.className="ts-hero";
    hero.innerHTML=
      '<img class="ts-hero__img" alt="Gastronomie AI MasterClass" src="'+IMG+'">'+
      '<div class="ts-hero__text">'+
        '<img class="ts-hero__logo" alt="Tasty Studios" src="'+LOGO+'">'+
        '<div class="ts-hero__eyebrow"><span class="ts-eb-w">Tasty</span><span class="ts-eb-b">Studios</span></div>'+
        '<h1 class="ts-hero__title">Gastronomie<br>AI Master<span class="ts-red">Class</span></h1>'+
      '</div>';
    var nr=sc.querySelector(".notion-root");
    if(nr) sc.insertBefore(hero, nr); else sc.appendChild(hero);
  }
  mount();
  document.addEventListener("DOMContentLoaded", mount);
  new MutationObserver(mount).observe(document.documentElement,{childList:true,subtree:true});
})();

/* ---- */

(function(){
  if(window.__tsHome) return; window.__tsHome=true;
  function isHome(){ return location.pathname.replace(/\/+$/,'')===''; }
  function findCols(root){
    var lists=root.querySelectorAll('.notion-column-list');
    for(var i=0;i<lists.length;i++){
      var cols=lists[i].querySelectorAll(':scope > .notion-column');
      if(cols.length>=3){ var t=(lists[i].textContent||''); if(/Struktur/i.test(t) && /Plattform/i.test(t)) return lists[i]; }
    }
    return null;
  }
  function tagIntro(root, colList){
    var texts=root.querySelectorAll('.notion-text'), k=0;
    for(var i=0;i<texts.length;i++){ var el=texts[i];
      if(!(el.textContent||'').trim()) continue;
      if(colList.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING){
        el.classList.add('ts-intro'); el.style.animationDelay=(0.05 + k*0.11)+'s'; k++;
        if(/Bevor wir loslegen/i.test(el.textContent||'')) el.classList.add('ts-intro--lead');
      }
    }
  }
  function armReveal(colList){
    function arm(){
      setTimeout(function(){                                  // Layout nach Bild-Nachladen setzen lassen
        if(colList.classList.contains('is-in')) return;
        var io=new IntersectionObserver(function(ents){
          ents.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); } });
        }, { threshold:.2, rootMargin:'0px 0px -12% 0px' });
        io.observe(colList);
      }, 500);
    }
    if(document.readyState==='complete') arm();
    else window.addEventListener('load', arm);               // Observer ERST nach vollständigem Load → Reveal beim Scrollen sichtbar
  }
  function mount(){
    if(!isHome() || !document.body) return;
    var root=document.querySelector('.notion-root')||document.body;
    var colList=findCols(root);
    if(!colList || colList.classList.contains('ts-cols')) return;
    document.body.classList.add('ts-home');
    colList.classList.add('ts-cols');
    var cols=colList.querySelectorAll(':scope > .notion-column');
    for(var i=0;i<cols.length;i++){ cols[i].classList.add('ts-col'); cols[i].style.setProperty('--ts-i', i); }
    tagIntro(root, colList);
    armReveal(colList);
  }
  document.addEventListener('DOMContentLoaded', mount);
  var t;
  new MutationObserver(function(){ clearTimeout(t); t=setTimeout(mount,120); })
    .observe(document.documentElement, { childList:true, subtree:true });
  mount();
})();

/* ---- */

(function(){
  var IMG="https://files.catbox.moe/d9udfg.png";
  var LOGO="https://files.catbox.moe/au80tp.png";
  function on(){ return /\/modul-2-das-notion-ai-backoffice-system\/?$/.test(location.pathname); }
  function mount(){
    if(!on()) return;
    var sc=document.querySelector(".super-content");
    if(!sc || sc.querySelector(".ts-hero")) return;
    var hero=document.createElement("div");
    hero.className="ts-hero";
    hero.innerHTML=
      '<img class="ts-hero__img" alt="Notion AI Backoffice System" src="'+IMG+'">'+
      '<div class="ts-hero__text">'+
        '<img class="ts-hero__logo" alt="Tasty Studios" src="'+LOGO+'">'+
        '<div class="ts-hero__eyebrow">Tasty Studios</div>'+
        '<h1 class="ts-hero__title"><span class="ts-red">Modul 2</span><br>Das Notion AI Backoffice System</h1>'+
      '</div>';
    var nr=sc.querySelector(".notion-root");
    if(nr) sc.insertBefore(hero, nr); else sc.appendChild(hero);
    var orig=document.getElementById("block-397b9546553480f081e7c0a7b6e7beb4"); if(orig) orig.style.display="none";
    var nh=document.querySelector(".notion-header.page"); if(nh) nh.style.display="none";
  }
  mount();
  document.addEventListener("DOMContentLoaded", mount);
  new MutationObserver(mount).observe(document.documentElement,{childList:true,subtree:true});
})();

/* ---- */

(function(){
  var IMG="https://files.catbox.moe/botkum.webp";
  var LOGO="https://files.catbox.moe/au80tp.png";
  function on(){ return /\/mehrwert-zielbild\/?$/.test(location.pathname); }
  function mount(){
    if(!on()) return;
    var sc=document.querySelector(".super-content");
    if(!sc || sc.querySelector(".ts-hero")) return;
    var hero=document.createElement("div");
    hero.className="ts-hero";
    hero.innerHTML=
      '<img class="ts-hero__img" alt="Mehrwert & Zielbild" src="'+IMG+'">'+
      '<div class="ts-hero__text">'+
        '<img class="ts-hero__logo" alt="Tasty Studios" src="'+LOGO+'">'+
        '<div class="ts-hero__eyebrow">Lektion 2.1</div>'+
        '<h1 class="ts-hero__title">Mehrwert &amp; <span class="ts-gold">Zielbild</span></h1>'+
      '</div>';
    var nr=sc.querySelector(".notion-root");
    if(nr) sc.insertBefore(hero, nr); else sc.appendChild(hero);
    Array.prototype.forEach.call(sc.querySelectorAll('.notion-image img[src*="logo_vektor"]'),
      function(img){ var blk=img.closest(".notion-image"); if(blk) blk.style.display="none"; });
    var nh=document.querySelector(".notion-header.page"); if(nh) nh.style.display="none";
  }
  mount();
  document.addEventListener("DOMContentLoaded", mount);
  new MutationObserver(mount).observe(document.documentElement,{childList:true,subtree:true});
})();

/* ---- */

(function(){
  var PATH = /\/mehrwert-zielbild\/?$/;
  var ANCHOR_ID = 'block-38eb9546553480a4a888ebe99e15bef5';
  var ANCHOR_PHRASE = 'pflegst eine Information genau einmal';
  var ROOT_ID = 'tsEcoRoot';

  function injectStyles(){
    if (document.getElementById('tsEcoStyles')) return;
    var css = `
    #tsEcoRoot { margin: 8px 0 4px; }
    #tsEcoRoot * { box-sizing: border-box; }
    #tsEcoRoot .net-section { position: relative; overflow: hidden; padding: 58px 8px 46px; background: transparent; }  /* ★1 Abstand oben/unten Überschrift */
    #tsEcoRoot .net-section::before { content:''; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:1400px; height:1000px; background: radial-gradient(ellipse at center, rgba(199,180,137,.05) 0%, transparent 60%); pointer-events:none; }
    #tsEcoRoot .net-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }
    #tsEcoRoot .net-header { text-align: center; margin-bottom: 8px; }
    #tsEcoRoot .net-title { font-size: clamp(30px,4.4vw,52px); font-weight:800; letter-spacing:-.03em; color:#fff; line-height:1.1; margin:0 0 12px; }
    #tsEcoRoot .net-title span { color:#c7b489; }
    #tsEcoRoot .net-sub { font-size:17px; color:rgba(255,255,255,.42); max-width:560px; margin:0 auto; line-height:1.65; }
    #tsEcoRoot .eco-canvas-wrap { position:relative; width:100%; max-width:1100px; margin:8px auto 0; aspect-ratio:1100/560; }  /* ★3 Grafik enger an Header */
    #tsEcoRoot .eco-canvas { position:absolute; inset:0; width:100%; height:100%; z-index:0; }
    #tsEcoRoot .eco-svg { position:absolute; inset:0; width:100%; height:100%; z-index:1; overflow:visible; pointer-events:none; }
    #tsEcoRoot .eco-svg-arrows { position:absolute; inset:0; width:100%; height:100%; z-index:10; overflow:visible; pointer-events:none; }
    #tsEcoRoot .eco-hover-hint { text-align:center; margin-top:6px; pointer-events:none; transition:opacity .8s ease; }  /* ★2 Hinweis enger an Untertitel */
    #tsEcoRoot .eco-hover-hint.hidden { opacity:0; }
    #tsEcoRoot .eco-hover-hint-text { font-size:13px; font-weight:500; color:rgba(216,201,171,.25); letter-spacing:.04em; }
    #tsEcoRoot .eco-hover-hint-icon { font-size:22px; color:rgba(216,201,171,.25); margin-bottom:6px; animation:tsHintPulse 2.5s ease-in-out infinite; }
    @keyframes tsHintPulse { 0%,100%{opacity:.2;transform:scale(1);} 50%{opacity:.5;transform:scale(1.12);} }
    #tsEcoRoot .eco-node { position:absolute; z-index:5; transform:translate(-50%,-50%) scale(0); opacity:0; transition:transform .6s cubic-bezier(.34,1.56,.64,1), opacity .5s ease; }
    #tsEcoRoot .eco-node.shown { transform:translate(-50%,-50%) scale(1); opacity:1; }
    #tsEcoRoot .eco-node-box { padding:10px 20px; border-radius:12px; display:flex; align-items:center; justify-content:center; cursor:pointer; position:relative; text-align:center; min-width:100px; transition:transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .35s, border-color .35s; }
    #tsEcoRoot .eco-node:hover .eco-node-box { transform:scale(1.08); }
    #tsEcoRoot .eco-node-box.key { border:1.5px solid rgba(216,201,171,.45); background:rgba(216,201,171,.07); box-shadow:0 0 24px rgba(199,180,137,.06); }
    #tsEcoRoot .eco-node:hover .eco-node-box.key { box-shadow:0 0 50px rgba(199,180,137,.18), 0 0 0 8px rgba(199,180,137,.04); border-color:rgba(216,201,171,.7); }
    #tsEcoRoot .eco-node-box.key .eco-node-label { color:#d8c9ab; }
    #tsEcoRoot .eco-node-box.sub { border:1px solid rgba(216,201,171,.15); background:rgba(216,201,171,.04); box-shadow:none; }
    #tsEcoRoot .eco-node:hover .eco-node-box.sub { box-shadow:0 0 28px rgba(199,180,137,.08); border-color:rgba(216,201,171,.3); }
    #tsEcoRoot .eco-node-box.sub .eco-node-label { color:rgba(216,201,171,.35); }
    #tsEcoRoot .eco-node-box.central { border:2px solid rgba(216,201,171,.6); background:rgba(216,201,171,.09); box-shadow:0 0 40px rgba(199,180,137,.1), 0 0 0 4px rgba(199,180,137,.03); padding:14px 26px; min-width:120px; }
    #tsEcoRoot .eco-node:hover .eco-node-box.central { box-shadow:0 0 60px rgba(199,180,137,.25), 0 0 0 10px rgba(199,180,137,.05); border-color:rgba(216,201,171,.85); }
    #tsEcoRoot .eco-node-box.central .eco-node-label { color:#efe6d2; font-size:12px; font-weight:800; }
    #tsEcoRoot .eco-node-label { font-size:10px; font-weight:700; letter-spacing:.05em; text-transform:uppercase; text-align:center; line-height:1.3; white-space:nowrap; }
    #tsEcoRoot .eco-path { opacity:0; fill:none; stroke-linecap:round; }
    #tsEcoRoot .eco-path.animate-in { opacity:1; transition:opacity .2s ease; }
    #tsEcoRoot .eco-path-glow { opacity:0; fill:none; stroke-linecap:round; }
    #tsEcoRoot .eco-path-glow.animate-in { opacity:1; transition:opacity .2s ease; }
    @keyframes tsLinePulse { 0%{opacity:1} 50%{opacity:.7} 100%{opacity:1} }
    #tsEcoRoot .eco-path.pulsing { animation:tsLinePulse 3.5s ease-in-out infinite; }
    #tsEcoRoot .eco-arrow { opacity:0; }
    #tsEcoRoot .net-args { display:grid; grid-template-columns:repeat(3,1fr); gap:0; margin-top:-65px; }
    #tsEcoRoot .net-arg { padding:0 40px; position:relative; }
    #tsEcoRoot .net-arg:not(:last-child)::after { content:''; position:absolute; right:0; top:0; bottom:0; width:1px; background:rgba(199,180,137,.1); }
    #tsEcoRoot .net-arg:first-child { padding-left:0; }
    #tsEcoRoot .net-arg:last-child { padding-right:0; }
    #tsEcoRoot .net-arg-title { font-size:18px; font-weight:700; letter-spacing:-.02em; color:#fff; margin-bottom:10px; }
    #tsEcoRoot .net-arg-text { font-size:15px; color:rgba(255,255,255,.42); line-height:1.65; }
    @media(max-width:900px){
      #tsEcoRoot .eco-canvas-wrap { aspect-ratio:auto; height:520px; overflow-x:auto; overflow-y:hidden; }
      #tsEcoRoot .eco-canvas-wrap > .eco-scroll { min-width:800px; position:relative; height:100%; }
      #tsEcoRoot .net-args { grid-template-columns:1fr; gap:32px; margin-top:16px; }
      #tsEcoRoot .net-arg { padding:0; }
      #tsEcoRoot .net-arg:not(:last-child)::after { display:none; }
    }
    @media(max-width:640px){
      #tsEcoRoot .net-section { padding:40px 6px 20px; }  /* ★4 Mobile Abstand oben/unten */
      #tsEcoRoot .eco-canvas-wrap { height:400px; }
      #tsEcoRoot .eco-canvas-wrap > .eco-scroll { min-width:700px; }
      #tsEcoRoot .eco-node-box { padding:6px 10px; min-width:60px; border-radius:8px; }
      #tsEcoRoot .eco-node-label { font-size:7px; }
      #tsEcoRoot .eco-node-box.central { padding:8px 14px; min-width:70px; }
      #tsEcoRoot .eco-node-box.central .eco-node-label { font-size:9px; }
    }
    @media(prefers-reduced-motion:reduce){
      #tsEcoRoot .eco-node { transition:none; }
      #tsEcoRoot .eco-hover-hint-icon { animation:none; }
      #tsEcoRoot .eco-path.pulsing { animation:none; }
    }`;
    var s = document.createElement('style'); s.id = 'tsEcoStyles'; s.textContent = css; document.head.appendChild(s);
  }

  function buildMarkup(){
    var root = document.createElement('div'); root.id = ROOT_ID;
    root.innerHTML = `
    <section class="net-section" id="ecoNetwork"><div class="net-inner">
      <div class="net-header">
        <h2 class="net-title">Vernetztes Ökosystem.<br>Eine <span>Datenquelle.</span></h2>
        <p class="net-sub">Vom Lieferpartner bis zum Deckungsbeitrag — jedes Element verbunden, jede Änderung in Echtzeit synchronisiert.</p>
        <div class="eco-hover-hint" id="ecoHint"><div class="eco-hover-hint-icon">⬡</div><div class="eco-hover-hint-text">Hover über ein Element</div></div></div>
      <div class="eco-canvas-wrap" id="ecoWrap"><div class="eco-scroll">
        <canvas class="eco-canvas" id="ecoParticles"></canvas>
        <svg class="eco-svg" id="ecoSvg" viewBox="0 0 1100 560" preserveAspectRatio="none"></svg>
        <svg class="eco-svg-arrows" id="ecoSvgArrows" viewBox="0 0 1100 560" preserveAspectRatio="none"></svg>
        <div class="eco-node" data-id="personalkosten" style="left:58%;top:5%;"><div class="eco-node-box key"><span class="eco-node-label">Personalkosten</span></div></div>
        <div class="eco-node" data-id="gemeinkosten" style="left:76%;top:5%;"><div class="eco-node-box key"><span class="eco-node-label">Gemeinkosten</span></div></div>
        <div class="eco-node" data-id="ansprechpartner" style="left:12%;top:18%;"><div class="eco-node-box key"><span class="eco-node-label">Ansprechpartner</span></div></div>
        <div class="eco-node" data-id="deckungsbeitraege" style="left:66%;top:18%;"><div class="eco-node-box sub"><span class="eco-node-label">Deckungsbeiträge</span></div></div>
        <div class="eco-node" data-id="wareneinsaetze" style="left:66%;top:30%;"><div class="eco-node-box sub"><span class="eco-node-label">Wareneinsätze</span></div></div>
        <div class="eco-node" data-id="packaging" style="left:88%;top:18%;"><div class="eco-node-box key"><span class="eco-node-label">Packaging</span></div></div>
        <div class="eco-node" data-id="lieferpartner" style="left:12%;top:42%;"><div class="eco-node-box key"><span class="eco-node-label">Lieferpartner</span></div></div>
        <div class="eco-node" data-id="inventar" style="left:30%;top:42%;"><div class="eco-node-box key"><span class="eco-node-label">Inventar</span></div></div>
        <div class="eco-node" data-id="rezepte" style="left:48%;top:42%;"><div class="eco-node-box key"><span class="eco-node-label">Zutaten</span></div></div>
        <div class="eco-node" data-id="gerichte" style="left:66%;top:42%;"><div class="eco-node-box central"><span class="eco-node-label">Gerichte</span></div></div>
        <div class="eco-node" data-id="events" style="left:88%;top:42%;"><div class="eco-node-box key"><span class="eco-node-label">Events</span></div></div>
        <div class="eco-node" data-id="partnervertraege" style="left:12%;top:58%;"><div class="eco-node-box sub"><span class="eco-node-label">Partnerverträge</span></div></div>
        <div class="eco-node" data-id="hausgemachtes" style="left:48%;top:58%;"><div class="eco-node-box key"><span class="eco-node-label">Rezepturen</span></div></div>
        <div class="eco-node" data-id="naehrstoffe" style="left:66%;top:58%;"><div class="eco-node-box sub"><span class="eco-node-label">Nährstoffe</span></div></div>
        <div class="eco-node" data-id="allergene" style="left:66%;top:72%;"><div class="eco-node-box sub"><span class="eco-node-label">Allergene</span></div></div>
      </div></div>
      <div class="net-args">
        <div class="net-arg"><div class="net-arg-title">Kein Datensilo</div><p class="net-arg-text">Vom Lieferpartner über die Rezeptur bis zum Deckungsbeitrag — alle Daten fließen automatisch durch das gesamte System.</p></div>
        <div class="net-arg"><div class="net-arg-title">Durchgängige Kalkulation</div><p class="net-arg-text">Ändert sich ein Einkaufspreis, aktualisiert sich die gesamte Kette: Wareneinsatz, Deckungsbeitrag, Event-Kalkulation.</p></div>
        <div class="net-arg"><div class="net-arg-title">Alles verbunden</div><p class="net-arg-text">Allergene, Nährstoffe, Kosten und Verpackung — jedes Detail ist mit deinen Gerichten verknüpft. Keine Inseln.</p></div>
      </div></div></section>`;
    return root;
  }

  function initEco(root){
    var wrap = root.querySelector('#ecoWrap');
    var svg  = root.querySelector('#ecoSvg');
    var svgArrows = root.querySelector('#ecoSvgArrows');
    var canvas = root.querySelector('#ecoParticles');
    var hint = root.querySelector('#ecoHint');
    var nodes = root.querySelectorAll('.eco-node');
    if (!wrap || !svg || !nodes.length) return;

    var W = 1100, H = 560, CORNER_R = 14, ARROW_GAP = 3;
    function pct(el){ return { x: parseFloat(el.style.left)/100*W, y: parseFloat(el.style.top)/100*H }; }
    var nodeMap = {}, nodeEls = {};
    nodes.forEach(function(n){ nodeMap[n.dataset.id]=pct(n); nodeEls[n.dataset.id]=n; });

    var halfCache = {};
    function getHalf(id){
      if (halfCache[id]) return halfCache[id];
      var el = nodeEls[id];
      if (el){ var box = el.querySelector('.eco-node-box');
        if (box){ var r = wrap.getBoundingClientRect();
          halfCache[id] = { hw:(box.offsetWidth/2)*(W/r.width), hh:(box.offsetHeight/2)*(H/r.height) };
          return halfCache[id]; } }
      halfCache[id] = { hw:58, hh:20 }; return halfCache[id];
    }

    var connections = [
      { from:'ansprechpartner', to:'lieferpartner', route:'v', type:'key' },
      { from:'ansprechpartner', to:'inventar', route:'hv', type:'key' },
      { from:'lieferpartner', to:'inventar', route:'h', type:'key' },
      { from:'lieferpartner', to:'partnervertraege', route:'v', type:'sub' },
      { from:'inventar', to:'rezepte', route:'h', type:'key' },
      { from:'rezepte', to:'hausgemachtes', route:'v', type:'key' },
      { from:'hausgemachtes', to:'naehrstoffe', route:'h', type:'sub' },
      { from:'hausgemachtes', to:'allergene', route:'vh', type:'sub' },
      { from:'rezepte', to:'gerichte', route:'h', type:'key' },
      { from:'naehrstoffe', to:'gerichte', route:'v', type:'sub' },
      { from:'gerichte', to:'events', route:'h', type:'key' },
      { from:'gerichte', to:'wareneinsaetze', route:'v', type:'key' },
      { from:'wareneinsaetze', to:'deckungsbeitraege', route:'v', type:'key' },
      { from:'deckungsbeitraege', to:'personalkosten', route:'hv', type:'key' },
      { from:'deckungsbeitraege', to:'gemeinkosten', route:'hv', type:'key' },
      { from:'packaging', to:'deckungsbeitraege', route:'h', type:'key' },
      { from:'packaging', to:'wareneinsaetze', route:'vh', type:'key' }
    ];
    var keyStroke='rgba(216,201,171,.4)', keyGlowC='rgba(216,201,171,.08)', subStroke='rgba(216,201,171,.18)', subGlowC='rgba(216,201,171,.03)';

    function buildPath(fromId,toId,route,xOff,toXOff,bidi){
      var s={x:nodeMap[fromId].x,y:nodeMap[fromId].y}, t={x:nodeMap[toId].x,y:nodeMap[toId].y};
      if(xOff)s.x+=xOff; if(toXOff)t.x+=toXOff;
      var sf=getHalf(fromId), tf=getHalf(toId);
      var dx=t.x-s.x, dy=t.y-s.y, dirX=dx>0?1:-1, dirY=dy>0?1:-1, gap=bidi?0:ARROW_GAP;
      if(route==='h'){ var x1=s.x+dirX*sf.hw, x2=t.x-dirX*(tf.hw+gap); return 'M '+x1+' '+s.y+' H '+x2; }
      if(route==='v'){ var y1=s.y+dirY*sf.hh, y2=t.y-dirY*(tf.hh+gap); return 'M '+s.x+' '+y1+' V '+y2; }
      if(route==='hv'){ var x1=s.x+dirX*sf.hw, y2=t.y-dirY*(tf.hh+gap), cx=t.x, cy=s.y;
        var r=Math.min(CORNER_R,Math.abs(cx-x1)*0.4,Math.abs(y2-cy)*0.4), sweep=(dirX*dirY>0)?1:0;
        return 'M '+x1+' '+cy+' H '+(cx-dirX*r)+' A '+r+' '+r+' 0 0 '+sweep+' '+cx+' '+(cy+dirY*r)+' V '+y2; }
      if(route==='vh'){ var y1=s.y+dirY*sf.hh, x2=t.x-dirX*(tf.hw+gap), cx=s.x, cy=t.y;
        var r=Math.min(CORNER_R,Math.abs(cy-y1)*0.4,Math.abs(x2-cx)*0.4), sweep=(dirX*dirY>0)?0:1;
        return 'M '+cx+' '+y1+' V '+(cy-dirY*r)+' A '+r+' '+r+' 0 0 '+sweep+' '+(cx+dirX*r)+' '+cy+' H '+x2; }
      return '';
    }

    var adjacency={};
    connections.forEach(function(conn,idx){
      (adjacency[conn.from]=adjacency[conn.from]||[]).push({target:conn.to,connIdx:idx});
      (adjacency[conn.to]=adjacency[conn.to]||[]).push({target:conn.from,connIdx:idx});
    });

    function createArrow(isKey){
      var g=document.createElementNS('http://www.w3.org/2000/svg','g'); g.classList.add('eco-arrow');
      var p=document.createElementNS('http://www.w3.org/2000/svg','path');
      p.setAttribute('d','M-7,-4.5 L0,0 L-7,4.5'); p.setAttribute('fill','none');
      p.setAttribute('stroke',isKey?'rgba(216,201,171,.6)':'rgba(216,201,171,.3)');
      p.setAttribute('stroke-width',isKey?'1.6':'1.1'); p.setAttribute('stroke-linecap','round'); p.setAttribute('stroke-linejoin','round');
      g.appendChild(p); return g;
    }

    var allPaths=[];
    connections.forEach(function(conn){
      var isKey=conn.type==='key';
      var d=buildPath(conn.from,conn.to,conn.route,conn.xOff||0,conn.toXOff||0,conn.bidi);
      if(!d) return;
      var glow=document.createElementNS('http://www.w3.org/2000/svg','path');
      glow.setAttribute('d',d); glow.setAttribute('stroke',isKey?keyGlowC:subGlowC); glow.setAttribute('stroke-width','6'); glow.setAttribute('stroke-linejoin','round');
      glow.classList.add('eco-path-glow'); svg.appendChild(glow);
      var gl=glow.getTotalLength(); glow.style.strokeDasharray=gl; glow.style.strokeDashoffset=gl;
      var path=document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d',d); path.setAttribute('stroke',isKey?keyStroke:subStroke); path.setAttribute('stroke-width',isKey?'1.5':'0.9'); path.setAttribute('stroke-linejoin','round');
      path.classList.add('eco-path'); svg.appendChild(path);
      var pl=path.getTotalLength(); path.style.strokeDasharray=pl; path.style.strokeDashoffset=pl;
      var arrow=null; if(!conn.bidi){ arrow=createArrow(isKey); svgArrows.appendChild(arrow); }
      allPaths.push({path:path,glow:glow,pathLen:pl,glowLen:gl,conn:conn,arrow:arrow,dashProgress:0});
    });

    var connectionsTriggered=false;
    function triggerChainAnimation(startNodeId){
      if(connectionsTriggered) return; connectionsTriggered=true;
      if(hint) hint.classList.add('hidden');
      var visited=new Set([startNodeId]), queue=[{nodeId:startNodeId,depth:0}], animOrder=[], usedConns=new Set();
      while(queue.length>0){
        var q=queue.shift();
        (adjacency[q.nodeId]||[]).forEach(function(nb){
          if(!usedConns.has(nb.connIdx)){ usedConns.add(nb.connIdx); animOrder.push({connIdx:nb.connIdx,depth:q.depth}); }
          if(!visited.has(nb.target)){ visited.add(nb.target); queue.push({nodeId:nb.target,depth:q.depth+1}); }
        });
      }
      animOrder.forEach(function(o){
        var item=allPaths[o.connIdx]; if(!item) return;
        var delay=o.depth*0.28+0.08;
        if(window.gsap){
          gsap.to(item,{ dashProgress:1, duration:0.9, delay:delay, ease:'power2.out',
            onStart:function(){ item.path.classList.add('animate-in'); item.glow.classList.add('animate-in'); },
            onUpdate:function(){
              var p=item.dashProgress;
              item.path.style.strokeDashoffset=item.pathLen*(1-p);
              item.glow.style.strokeDashoffset=item.glowLen*(1-p);
              if(item.arrow && p>0.01){
                var visLen=item.pathLen*p, pt=item.path.getPointAtLength(visLen), pt2=item.path.getPointAtLength(Math.max(0,visLen-2));
                var ang=Math.atan2(pt.y-pt2.y,pt.x-pt2.x)*180/Math.PI;
                item.arrow.setAttribute('transform','translate('+pt.x+','+pt.y+') rotate('+ang+')'); item.arrow.style.opacity='1';
              }
            },
            onComplete:function(){ setTimeout(function(){ item.path.classList.add('pulsing'); },100); }
          });
        } else {
          item.path.classList.add('animate-in'); item.glow.classList.add('animate-in');
          item.path.style.strokeDashoffset=0; item.glow.style.strokeDashoffset=0;
          if(item.arrow){ var len=item.pathLen, pt=item.path.getPointAtLength(len), pt2=item.path.getPointAtLength(Math.max(0,len-2));
            var ang=Math.atan2(pt.y-pt2.y,pt.x-pt2.x)*180/Math.PI;
            item.arrow.setAttribute('transform','translate('+pt.x+','+pt.y+') rotate('+ang+')'); item.arrow.style.opacity='1'; }
        }
      });
    }

    var ctx=canvas.getContext('2d'), particles=[], animFrame, particlesRunning=false, _rect={width:0,height:0}, _last=0, FRAME_MS=33;
    function resizeCanvas(){ var r=wrap.getBoundingClientRect(); _rect=r; var dpr=window.devicePixelRatio||1;
      canvas.width=r.width*dpr; canvas.height=r.height*dpr; canvas.style.width=r.width+'px'; canvas.style.height=r.height+'px'; ctx.setTransform(dpr,0,0,dpr,0,0); }
    function initParticles(){ particles=[]; var r=wrap.getBoundingClientRect(); _rect=r;
      for(var i=0;i<40;i++){ particles.push({ x:Math.random()*r.width, y:Math.random()*r.height, r:Math.random()*.8+.2, vx:(Math.random()-.5)*.08, vy:(Math.random()-.5)*.06, alpha:Math.random()*.12+.02, pulse:Math.random()*Math.PI*2 }); } }
    function drawParticles(ts){
      if(!particlesRunning) return;
      if(ts && _last && ts-_last<FRAME_MS){ animFrame=requestAnimationFrame(drawParticles); return; }
      if(ts) _last=ts;
      var pw=_rect.width, ph=_rect.height; if(!pw||!ph){ animFrame=requestAnimationFrame(drawParticles); return; }
      ctx.clearRect(0,0,pw,ph);
      particles.forEach(function(p){ p.x+=p.vx; p.y+=p.vy; p.pulse+=.005;
        if(p.x<0)p.x=pw; if(p.x>pw)p.x=0; if(p.y<0)p.y=ph; if(p.y>ph)p.y=0;
        var a=p.alpha*(.7+Math.sin(p.pulse)*.3);
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle='rgba(199,180,137,'+a+')'; ctx.fill(); });
      animFrame=requestAnimationFrame(drawParticles);
    }

    var animated=false;
    var obs=new IntersectionObserver(function(en){
      if(en[0].isIntersecting && !animated){ animated=true;
        resizeCanvas(); initParticles(); particlesRunning=true; drawParticles();
        Array.from(nodes).forEach(function(node,i){ setTimeout(function(){ node.classList.add('shown'); },200+i*60); });
      }
    },{threshold:0.12});
    obs.observe(wrap);

    nodes.forEach(function(node){ node.addEventListener('mouseenter',function(){ triggerChainAnimation(node.dataset.id); }); });

    var rt;
    window.addEventListener('resize',function(){ clearTimeout(rt); rt=setTimeout(function(){ if(particlesRunning){ resizeCanvas(); initParticles(); } },200); });

    var visObs=new IntersectionObserver(function(en){
      if(!en[0].isIntersecting && particlesRunning){ particlesRunning=false; cancelAnimationFrame(animFrame); }
      else if(en[0].isIntersecting && animated && !particlesRunning){ particlesRunning=true; resizeCanvas(); drawParticles(); }
    },{threshold:0});
    visObs.observe(wrap);
  }

  function ensureGsap(cb){
    if (window.gsap) return cb();
    var ex = document.querySelector('script[data-ts-gsap]');
    if (ex){ ex.addEventListener('load', cb); return; }
    var sc = document.createElement('script');
    sc.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
    sc.setAttribute('data-ts-gsap','1');
    sc.onload = cb; sc.onerror = cb;
    document.head.appendChild(sc);
  }

  function findAnchor(){
    var a = document.getElementById(ANCHOR_ID);
    if (a) return a;
    var cands = document.querySelectorAll('.notion-text, p');
    for (var i=0;i<cands.length;i++){ if (cands[i].textContent && cands[i].textContent.indexOf(ANCHOR_PHRASE)!==-1) return cands[i]; }
    return null;
  }
  function mount(){
    if (!PATH.test(location.pathname)) return;
    if (document.getElementById(ROOT_ID)) return;
    var anchor = findAnchor();
    if (!anchor) return;
    injectStyles();
    var root = buildMarkup();
    anchor.parentNode.insertBefore(root, anchor.nextSibling);
    ensureGsap(function(){ initEco(root); });
  }

  function boot(){
    mount();
    var mo = new MutationObserver(function(){
      if (!PATH.test(location.pathname)){
        var stale = document.getElementById(ROOT_ID); if (stale) stale.remove();
        return;
      }
      if (!document.getElementById(ROOT_ID)) mount();
    });
    mo.observe(document.body, { childList:true, subtree:true });
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

/* ---- */

(function(){
  if (window.__tsq) return; window.__tsq = true;
  var LINK = {
    food:    "https://app.notion.com/p/1bcb9546553483fc9793818e30347903?source=copy_link",
    drinks:  "https://app.notion.com/p/377b9546553482868a568118ef062cf2?source=copy_link",
    finance: "https://app.notion.com/p/1bcb95465534831c8eaa01ac7c46c8ad?source=copy_link",
    metrics: "https://app.notion.com/p/41ab95465534822e90fc01563e979ad0?source=copy_link",
    ops:     "https://app.notion.com/p/ecbb954655348360b84a01247cce3178?source=copy_link",
    vision:  "https://app.notion.com/p/cceb95465534823c889e01b310495ab9?source=copy_link"
  };
  var IMG = {
    food:"https://files.catbox.moe/rf93ka.jpg",drinks:"https://files.catbox.moe/5j95hc.jpg",
    finance:"https://files.catbox.moe/m629vk.jpg",metrics:"https://files.catbox.moe/hninlw.jpg",
    ops:"https://files.catbox.moe/bne5l8.jpg",vision:"https://files.catbox.moe/6b9lws.jpg"
  };
  var GLOW = {food:"90,150,185",drinks:"235,140,40",finance:"60,150,215",metrics:"95,165,205",ops:"170,120,90",vision:"150,110,220"};
  var CSS = `
  #tsq{width:100vw;max-width:100vw;margin:32px 0 6px;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);padding:0 clamp(20px,4vw,56px);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",Helvetica,Arial,sans-serif;color:#fff}
  #tsq *{box-sizing:border-box}
  #tsq .tsq-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;max-width:1280px;margin:0 auto}
  #tsq a.tsq-card{display:flex;flex-direction:column;text-align:center;padding-bottom:20px;text-decoration:none;color:inherit;-webkit-tap-highlight-color:transparent;border-radius:14px}
  #tsq a.tsq-card:focus-visible{outline:2px solid rgba(var(--g),.7);outline-offset:4px}
  #tsq .tsq-frame{position:relative;width:80%;margin:0 auto;aspect-ratio:16/9;border-radius:11px;overflow:hidden;background:#0c0e16;border:1px solid rgba(255,255,255,.10);transition:transform .35s cubic-bezier(.22,1,.36,1),border-color .45s ease,box-shadow .45s ease;will-change:transform,box-shadow;box-shadow:0 14px 34px -22px rgba(0,0,0,.8)}
  #tsq .tsq-frame img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .5s cubic-bezier(.22,1,.36,1)}
  #tsq a.tsq-card:hover .tsq-frame{transform:translateY(-4px);border-color:rgba(var(--g),.5);animation:tsq-heartbeat 2.6s cubic-bezier(.4,0,.3,1) infinite}
  #tsq a.tsq-card:hover .tsq-frame img{transform:scale(1.04)}
  #tsq .tsq-k{display:inline-block;font-size:.58rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:#9e947f;margin:24px 0 10px}
  #tsq .tsq-h{font-size:1.45rem;font-weight:600;letter-spacing:-.015em;line-height:1.12;margin:0 0 18px;transition:color .3s ease}
  #tsq .tsq-h .g{color:#9e947f}
  #tsq a.tsq-card:hover .tsq-h{color:#fff}
  #tsq .tsq-t{color:rgba(255,255,255,.62);font-size:.9rem;line-height:1.68;margin:0 auto;max-width:36ch}
  #tsq .tsq-t b{color:#fff;font-weight:600}
  @keyframes tsq-heartbeat{0%{box-shadow:0 4px 14px rgba(var(--g),.10),0 0 14px rgba(var(--g),.10)}18%{box-shadow:0 6px 22px rgba(var(--g),.30),0 0 46px rgba(var(--g),.34)}32%{box-shadow:0 5px 18px rgba(var(--g),.16),0 0 26px rgba(var(--g),.18)}46%{box-shadow:0 6px 20px rgba(var(--g),.26),0 0 40px rgba(var(--g),.28)}72%,100%{box-shadow:0 4px 14px rgba(var(--g),.10),0 0 14px rgba(var(--g),.10)}}
  @media(prefers-reduced-motion:reduce){#tsq .tsq-frame{transition:none}#tsq a.tsq-card:hover .tsq-frame{transform:none;animation:none;box-shadow:0 0 26px rgba(var(--g),.25)}#tsq a.tsq-card:hover .tsq-frame img{transform:none}}
  @media(max-width:820px){#tsq .tsq-grid{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:540px){#tsq .tsq-grid{grid-template-columns:1fr}}
  `;
  function card(k,ki,w1,w2,tx){return '<a class="tsq-card" href="'+LINK[k]+'" style="--g:'+GLOW[k]+'"><div class="tsq-frame"><img src="'+IMG[k]+'" alt="'+w1+' '+w2+'" loading="lazy"></div><span class="tsq-k">'+ki+'</span><h3 class="tsq-h">'+w1+' <span class="g">'+w2+'</span></h3><p class="tsq-t">'+tx+'</p></a>';}
  var HTML = '<div id="tsq"><div class="tsq-grid">'
   +card('food','Der Kern','Food','Quartier','Alles, was auf den <b>Teller</b> kommt. Deine Speisen-Produkte, sauber strukturiert.')
   +card('drinks','Der Kern','Drinks','Quartier','Alles, was ins <b>Glas</b> geht. Gleich aufgebaut wie das Foodquartier.')
   +card('finance','Die Verknüpfung','Finance','Studio','Gemein- und Personalkosten, mit den Gerichten verknüpft. Liefert die <b>Deckungsbeiträge</b>.')
   +card('metrics','Der Überblick','Key','Metrics','Dein KPI-Dashboard: Umsätze, Personalkosten, Produktivität, Bewertungen.')
   +card('ops','Der Maschinenraum','Operations','Area','Checklisten, Handbücher, Pflichtdokumente, Onboarding, Schlüssel — damit der Betrieb ohne dich läuft.')
   +card('vision','Das große Bild','Vision','Frame','Werte, Marke, Teamkultur, Expansion, Konkurrenzanalyse — über das Tagesgeschäft hinaus.')
   +'</div></div>';
  function injectStyle(){if(document.getElementById('tsq-style'))return;var s=document.createElement('style');s.id='tsq-style';s.textContent=CSS;document.head.appendChild(s);}
  function findAnchor(){var n=document.querySelectorAll('.notion-text');for(var i=0;i<n.length;i++){if(n[i].textContent&&n[i].textContent.indexOf('teilt sich in sechs Bereiche')>-1)return n[i];}return null;}
  function mount(){
    if(!/\/mehrwert-zielbild\/?$/.test(location.pathname)){var e=document.getElementById('tsq');if(e&&e.parentNode)e.parentNode.removeChild(e);return;}
    if(document.getElementById('tsq'))return;
    var a=findAnchor();if(!a)return;
    injectStyle();var d=document.createElement('div');d.innerHTML=HTML;a.parentNode.insertBefore(d.firstElementChild,a.nextSibling);
  }
  function boot(){
    var tries=0;
    var iv=setInterval(function(){tries++;mount();if(tries>40)clearInterval(iv);},300);
    new MutationObserver(function(){if(!document.getElementById('tsq'))mount();}).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='complete')boot();else window.addEventListener('load',boot);
})();

/* ---- */

/* mehrwert-zielbild — Intro über dem 6-Kachel-Raster zentrieren; alles darunter bleibt links wie in Notion */
(function(){
  if(window.__tsMzIntro) return; window.__tsMzIntro = true;
  function tagIntro(){
    var scope = document.querySelector('.page__mehrwert-zielbild');
    var tsq = document.getElementById('tsq');
    if(!scope || !tsq) return false;
    scope.querySelectorAll('.notion-text, .notion-heading').forEach(function(b){
      if(tsq.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_PRECEDING) b.classList.add('ts-mz-center');
    });
    return true;
  }
  if(tagIntro()) return;
  var obs = new MutationObserver(function(){ if(tagIntro()) obs.disconnect(); });
  obs.observe(document.documentElement, {childList:true, subtree:true});
  setTimeout(function(){ try{ obs.disconnect(); }catch(e){} }, 8000);
})();

/* ---- */

(function(){
  if (window.__tsmwzlead) return; window.__tsmwzlead = true;

  var LIFT = 28;   // px höher (nur erster Lead-Block; 0 = nicht anheben)

  var CENTER = [
    "Wir starten mit dem Food",
    "Der Core des Systems",
    "Und genau diese drei Stufen rechnet",
    "Du siehst den Gemeinkostenanteil",
    "Du siehst die Allergene und die Nährwerte",
    "Du bekommst Vorschläge für deinen Verkaufspreis",
    "Du siehst die Zubereitungszeit",
    "Und optional, wenn du es auswählst",
    "Das ist das Ziel",
    "Learnings",
    "Du kennst die sechs Bereiche",
    "Du verstehst, warum ein Wareneinsatz",
    "Du kannst den Deckungsbeitrag I, II und III",
    "Du hast das vollständige Zielbild"
  ];
  var LIFT_KEY = "Wir starten mit dem Food"; // dieser Block wird zusätzlich angehoben

  var CSS =
    '.ts-mwz-c{text-align:center !important;}' +
    'li.ts-mwz-c,.ts-mwz-c li{list-style-position:inside !important;}' +
    '.ts-mwz-lift{margin-top:-' + LIFT + 'px !important;}';

  function injectStyle(){
    if (document.getElementById('ts-mwz-lead-style')) return;
    var s = document.createElement('style');
    s.id = 'ts-mwz-lead-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function apply(){
    if (!/\/mehrwert-zielbild\/?$/.test(location.pathname)) return;
    var nodes = document.querySelectorAll('.notion-text, .notion-heading, li, .notion-list-item');
    if (!nodes.length) return;
    injectStyle();
    for (var i=0;i<nodes.length;i++){
      var t = nodes[i].textContent || '';
      for (var j=0;j<CENTER.length;j++){
        if (t.indexOf(CENTER[j]) > -1){
          nodes[i].classList.add('ts-mwz-c');
          if (CENTER[j] === LIFT_KEY) nodes[i].classList.add('ts-mwz-lift');
          break;
        }
      }
    }
  }

  function boot(){
    var tries = 0;
    var iv = setInterval(function(){ tries++; apply(); if (tries > 40) clearInterval(iv); }, 300);
    new MutationObserver(function(){ apply(); })
      .observe(document.documentElement, {childList:true, subtree:true});
  }
  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot);
})();

/* ---- */

(function(){
  if(window.__tsNext) return;
  window.__tsNext = true;
  var PATH = /\/mehrwert-zielbild\/?$/;
  function mount(){
    if(!PATH.test(location.pathname)) return;
    if(document.getElementById('ts-next')) return;
    var host = document.querySelector('.notion-root') || document.querySelector('main');
    if(!host) return;
    var wrap = document.createElement('div');
    wrap.id = 'ts-next-wrap';
    var a = document.createElement('a');
    a.id = 'ts-next';
    a.href = '/inventurliste';
    a.textContent = 'Nächste Lektion';
    wrap.appendChild(a);
    host.appendChild(wrap);
  }
  function boot(){
    if(!document.body){ return setTimeout(boot, 50); }   // Fix: auf <body> warten
    mount();
    new MutationObserver(mount).observe(document.body, {childList:true, subtree:true});
  }
  boot();
  document.addEventListener('DOMContentLoaded', mount);
  window.addEventListener('load', mount);
})();

/* ---- */

(function(){
  if (window.__tsl) return; window.__tsl = true;

  var ITEMS = [
    "Du kennst die sechs Bereiche deines Backoffice und weißt, wie sie zusammenhängen.",
    "Du verstehst, warum ein Wareneinsatz pro Gericht mehr wert ist als ein Jahresschnitt.",
    "Du kannst den Deckungsbeitrag I, II und III erklären und weißt, was in jede Stufe einfließt.",
    "Du hast das vollständige Zielbild eines fertigen Gerichts vor Augen und weißt, worauf die nächsten sieben Schritte hinarbeiten."
  ];

  var CSS = `
  #tsl{width:100vw;max-width:100vw;margin:44px 0 10px;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);padding:0 clamp(20px,4vw,56px);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",Helvetica,Arial,sans-serif;color:#fff}
  #tsl *{box-sizing:border-box}
  #tsl .tsl-head{text-align:center;margin:0 auto 46px}
  #tsl .tsl-eyebrow{display:inline-block;font-size:.62rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#9e947f;margin:0 0 14px}
  #tsl .tsl-title{font-size:clamp(30px,5vw,46px);font-weight:600;letter-spacing:-.02em;line-height:1.05;margin:0}
  #tsl .tsl-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(20px,3vw,40px);max-width:1180px;margin:0 auto;justify-items:center}
  #tsl .tsl-cell{opacity:0;transform:translateY(22px);filter:blur(8px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1),filter .9s cubic-bezier(.16,1,.3,1);transition-delay:calc(var(--i) * 140ms);width:100%;max-width:250px}
  #tsl .tsl-cell.in{opacity:1;transform:translateY(0);filter:blur(0)}
  #tsl .tsl-orb{position:relative;width:100%;aspect-ratio:1;border-radius:50%;display:flex;align-items:center;justify-content:center;text-align:center;
    padding:clamp(20px,2.6vw,32px);
    background:radial-gradient(120% 120% at 38% 28%, rgba(158,148,127,.20), rgba(255,255,255,.035) 46%, rgba(10,12,20,.85) 78%);
    border:1px solid rgba(255,255,255,.12);
    box-shadow:0 18px 44px -18px rgba(0,0,0,.75), inset 0 1px 1px rgba(255,255,255,.10), inset 0 0 60px rgba(158,148,127,.06);
    animation:tsl-float 7s ease-in-out infinite;will-change:transform;
    transition:border-color .45s ease, box-shadow .45s ease}
  #tsl .tsl-cell:nth-child(1) .tsl-orb{animation-delay:0s}
  #tsl .tsl-cell:nth-child(2) .tsl-orb{animation-delay:-1.6s}
  #tsl .tsl-cell:nth-child(3) .tsl-orb{animation-delay:-3.2s}
  #tsl .tsl-cell:nth-child(4) .tsl-orb{animation-delay:-4.8s}
  #tsl .tsl-orb::before{content:"";position:absolute;top:10%;left:16%;width:34%;height:24%;border-radius:50%;background:radial-gradient(closest-side, rgba(255,255,255,.16), rgba(255,255,255,0));pointer-events:none}
  #tsl .tsl-orb:hover{border-color:rgba(158,148,127,.5);box-shadow:0 22px 50px -18px rgba(0,0,0,.8), inset 0 1px 1px rgba(255,255,255,.12), 0 0 40px rgba(158,148,127,.22)}
  #tsl .tsl-t{position:relative;color:rgba(255,255,255,.9);font-size:clamp(12.5px,1.15vw,15px);font-weight:500;line-height:1.5;letter-spacing:-.005em;max-width:22ch}
  @keyframes tsl-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-11px)}}
  @media(max-width:1079px){#tsl .tsl-grid{grid-template-columns:repeat(2,1fr);gap:36px 30px;max-width:580px}}
  @media(max-width:520px){#tsl .tsl-grid{grid-template-columns:1fr;max-width:320px}}
  @media(prefers-reduced-motion:reduce){
    #tsl .tsl-cell{transition:none;opacity:1;transform:none;filter:none}
    #tsl .tsl-orb{animation:none}
  }
  `;

  function orb(i,tx){
    return '<div class="tsl-cell" style="--i:'+i+'"><div class="tsl-orb"><p class="tsl-t">'+tx+'</p></div></div>';
  }
  var HTML = '<section id="tsl">' +
    '<div class="tsl-head"><span class="tsl-eyebrow">Was du mitnimmst</span><h2 class="tsl-title">Learnings</h2></div>' +
    '<div class="tsl-grid">' + ITEMS.map(function(t,i){return orb(i,t);}).join('') + '</div>' +
  '</section>';

  function injectStyle(){
    if (document.getElementById('tsl-style')) return;
    var s = document.createElement('style'); s.id='tsl-style'; s.textContent = CSS;
    document.head.appendChild(s);
  }
  function findHead(){
    var sel = document.querySelectorAll('.notion-heading, [class*="notion-h"], h1, h2, h3');
    for (var i=0;i<sel.length;i++){
      if ((sel[i].textContent||'').trim() === 'Learnings') return sel[i];
    }
    return null;
  }
  function blockOf(el){
    return el.closest('[class*="notion-block"], .notion-selectable') || el;
  }
  function hideOriginals(head){
    var hb = blockOf(head);
    hb.setAttribute('data-tsl-hidden','1'); hb.style.display='none';
    var n = hb.nextElementSibling;
    while (n){
      var isList = n.matches('ul, ol, .notion-list, [class*="bulleted"], [class*="numbered"]') ||
                   (n.querySelector && n.querySelector('ul, ol, .notion-list'));
      if (!isList) break;
      n.setAttribute('data-tsl-hidden','1'); n.style.display='none';
      n = n.nextElementSibling;
    }
    return hb;
  }
  function reveal(root){
    var cells = root.querySelectorAll('.tsl-cell');
    function showAll(){ cells.forEach(function(c){ c.classList.add('in'); }); }
    if (!('IntersectionObserver' in window)){ showAll(); return; }
    var io = new IntersectionObserver(function(ents){
      ents.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:.2});
    cells.forEach(function(c){ io.observe(c); });
    setTimeout(showAll, 1800);
  }
  function mount(){
    if (!/\/mehrwert-zielbild\/?$/.test(location.pathname)){
      var e = document.getElementById('tsl'); if (e && e.parentNode) e.parentNode.removeChild(e); return;
    }
    if (document.getElementById('tsl')) return;
    var head = findHead(); if (!head) return;
    injectStyle();
    var hb = hideOriginals(head);
    var d = document.createElement('div'); d.innerHTML = HTML;
    var node = d.firstElementChild;
    hb.parentNode.insertBefore(node, hb);
    reveal(node);
  }
  function boot(){
    var tries = 0;
    var iv = setInterval(function(){ tries++; mount(); if (tries > 40) clearInterval(iv); }, 300);
    new MutationObserver(function(){ if (!document.getElementById('tsl')) mount(); })
      .observe(document.documentElement, {childList:true, subtree:true});
  }
  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot);
})();

/* ---- */

(function(){
  if(window.__tsTone) return; window.__tsTone=true;
  function toneLastWord(h){
    if(h.dataset.tsToned) return;
    var txt=(h.textContent||'').trim(); if(!txt) return;
    var last=txt.split(/\s+/).pop(); if(!last||last.length<2) return;
    var w=document.createTreeWalker(h,NodeFilter.SHOW_TEXT,null),node,target=null;
    while(node=w.nextNode()){ if(node.nodeValue.indexOf(last)>=0) target=node; }
    if(!target) return;
    var i=target.nodeValue.lastIndexOf(last); if(i<0) return;
    var b=target.nodeValue.slice(0,i), a=target.nodeValue.slice(i+last.length);
    var sp=document.createElement('span'); sp.className='ts-accent'; sp.textContent=last;
    var f=document.createDocumentFragment();
    if(b)f.appendChild(document.createTextNode(b)); f.appendChild(sp); if(a)f.appendChild(document.createTextNode(a));
    target.parentNode.replaceChild(f,target); h.dataset.tsToned='1';
  }
  function run(){ document.querySelectorAll('.notion-root h1.notion-heading').forEach(toneLastWord); }
  run(); setTimeout(run,600); setTimeout(run,1500);
})();

/* ---- */

(function(){
  var ANCHOR='block-396b954655348098ae30f9bff07fa068';
  var items=[
    {num:'8', title:'Minuten', desc:'Kursdauer dieser Lektion.'},
    {num:'4', title:'Phasen',  desc:'Sauberer Aufbau, Schritt für Schritt.'},
    {num:'28',title:'Schritte',desc:'Bis zur fertigen Datenbank.'},
    {num:'20',title:'Minuten', desc:'Zeitaufwand zum Mitbauen.'}
  ];
  function mount(){
    var a=document.getElementById(ANCHOR); if(!a) return false;
    if(document.getElementById('ts-lesson-stats')) return true;
    var w=document.createElement('div'); w.id='ts-lesson-stats';
    w.innerHTML=items.map(function(i){return '<div class="ts-cell">'+
      '<div class="ts-num">'+i.num+'</div>'+
      '<div class="ts-title">'+i.title+'</div>'+
      '<div class="ts-desc">'+i.desc+'</div></div>';}).join('');
    a.parentElement.insertBefore(w,a); return true;
  }
  if(mount()) return;
  var obs=new MutationObserver(function(){ if(mount()) obs.disconnect(); });
  obs.observe(document.body,{childList:true,subtree:true});
  setTimeout(function(){ obs.disconnect(); },15000);
})();

/* ============================================================
   MacBook-Cover + Klick-Lightbox (mehrwert-zielbild)
   ============================================================ */
/* Tasty Studios · mehrwert-zielbild · MacBook-Cover + Klick-Lightbox
   Extern gehostet, damit super.so-Code klein bleibt. Läuft nur auf /mehrwert-zielbild. */
(function(){
  var POSTER="https://files.catbox.moe/qryb5j.png";
  (function(){ var pre=new Image(); pre.src=POSTER; })(); // Poster vorladen -> kein Leer-Blitz
  var CSS=[
    '.page__mehrwert-zielbild .notion-column-list:has(h1.notion-heading) > .notion-column:not(:has(h1.notion-heading)){display:flex!important;}',
    '@media (min-width:768px){',
    '.page__mehrwert-zielbild .notion-column-list:has(h1.notion-heading){display:flex!important;gap:0!important;}',
    '.page__mehrwert-zielbild .notion-column-list:has(h1.notion-heading) > .notion-column{width:calc((100% - 18px) * 0.5)!important;}',
    '.page__mehrwert-zielbild .notion-column-list:has(h1.notion-heading) > .notion-column + .notion-column{margin-inline-start:18px!important;}',
    '}',
    '.page__mehrwert-zielbild .notion-column-list:has(h1.notion-heading) .notion-video video{display:none!important;}',
    '.page__mehrwert-zielbild .tsmac{position:relative;cursor:pointer;display:block;width:100%;line-height:0;background:transparent;}',
    '.page__mehrwert-zielbild .tsmac img{width:100%;height:auto;display:block;transition:transform .5s ease;}',
    '.page__mehrwert-zielbild .tsmac:hover img{transform:scale(1.02);}',
    '.page__mehrwert-zielbild .tsmac__play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;}',
    '.page__mehrwert-zielbild .tsmac__play span{width:76px;height:76px;border-radius:50%;background:rgba(255,255,255,.16);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.55);display:flex;align-items:center;justify-content:center;transition:transform .3s,background .3s;}',
    '.page__mehrwert-zielbild .tsmac__play span::after{content:"";border-style:solid;border-width:12px 0 12px 20px;border-color:transparent transparent transparent #fff;margin-left:5px;}',
    '.page__mehrwert-zielbild .tsmac:hover .tsmac__play span{transform:scale(1.08);background:rgba(255,255,255,.26);}',
    '#tsmac-lb{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;background:rgba(5,6,11,.85);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);padding:4vw;opacity:0;transition:opacity .35s ease;}',
    '#tsmac-lb.open{display:flex;opacity:1;}',
    '#tsmac-lb .tsmac-stage{transform:scale(.94);transition:transform .4s cubic-bezier(.2,.7,.2,1);width:min(92vw,1180px);}',
    '#tsmac-lb.open .tsmac-stage{transform:scale(1);}',
    '#tsmac-lb video{width:100%;max-height:86vh;border-radius:12px;box-shadow:0 40px 120px rgba(0,0,0,.6);background:#000;display:block;}',
    '#tsmac-lb__close{position:absolute;top:22px;right:28px;width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.08);color:#fff;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;}'
  ].join('');
  function injectCSS(){ if(document.getElementById('tsmac-css'))return; var s=document.createElement('style'); s.id='tsmac-css'; s.textContent=CSS; document.head.appendChild(s); }
  function shut(){ var lb=document.getElementById('tsmac-lb'); if(!lb)return; lb.classList.remove('open'); var v=lb.querySelector('video'); if(v){ try{v.pause();}catch(e){} } }
  function ensureLb(){
    var lb=document.getElementById('tsmac-lb'); if(lb) return lb;
    lb=document.createElement('div'); lb.id='tsmac-lb';
    var stage=document.createElement('div'); stage.className='tsmac-stage';
    var close=document.createElement('button'); close.id='tsmac-lb__close'; close.textContent='✕';
    lb.appendChild(stage); lb.appendChild(close); document.body.appendChild(lb);
    close.addEventListener('click',shut);
    lb.addEventListener('click',function(e){ if(e.target===lb) shut(); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') shut(); });
    return lb;
  }
  function mount(){
    if(!/\/mehrwert-zielbild\/?$/.test(location.pathname)) return;
    injectCSS();
    var scope=document.querySelector('.page__mehrwert-zielbild'); if(!scope) return;
    var nv=scope.querySelector('.notion-column-list:has(h1.notion-heading) .notion-video'); if(!nv) return;
    if(nv.querySelector('.tsmac')) return;
    var raw=nv.querySelector('video'); if(!raw) return;
    var src=raw.currentSrc||raw.getAttribute('src')||(raw.querySelector('source')&&raw.querySelector('source').getAttribute('src'));
    if(!src) return;
    var poster=document.createElement('div'); poster.className='tsmac';
    poster.innerHTML='<img src="'+POSTER+'" alt="Lektion 3.2 – Mehrwert & Zielbild" fetchpriority="high" decoding="async"><div class="tsmac__play"><span></span></div>';
    nv.appendChild(poster);
    poster.addEventListener('click',function(){
      var lb=ensureLb(); var stage=lb.querySelector('.tsmac-stage');
      stage.innerHTML='<video controls playsinline preload="auto" src="'+src+'"></video>';
      lb.classList.add('open');
      var v=stage.querySelector('video'); if(v){ try{ v.play(); }catch(e){} }
    });
  }
  function boot(){
    var tries=0;
    var iv=setInterval(function(){ tries++; mount(); if(tries>60) clearInterval(iv); },300);
    new MutationObserver(function(){ mount(); }).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='complete') boot(); else window.addEventListener('load',boot);
})();




/* ============================================================
   MacBook-Scroll-Kachel "Thai Peanut Tofu Bowl" (mehrwert-zielbild)
   Sitzt in der leeren LINKEN Spalte neben dem "Du siehst..."-Text.
   Klick auf MacBook -> großer PC -> Screen scrollt die ganze
   Gericht-Detailseite (langer Screenshot). Nur auf /mehrwert-zielbild.
   Bilder (catbox): Frame = oj1wa9.png · Screenshot = 4s49ab.png
   ============================================================ */
(function(){
  var FRAME="https://files.catbox.moe/oj1wa9.png";
  var SHOT="https://files.catbox.moe/4s49ab.png";
  var ANCHOR="verwendeten Zutaten und Produkte";   // Text der RECHTEN Spalte -> MacBook links daneben
  var CSS=[
    '#tsmb-root{--tsmb-gold:#9e947f;--tsmb-ease:cubic-bezier(.16,1,.3,1);margin:0 0 8px;display:flex;flex-direction:column;align-items:center;gap:14px;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;}',
    '.notion-column-list.tsmb-centered-row{align-items:center;}',
    '#tsmb-root .tsmb-caption{width:100%;text-align:center;font-size:15px;font-weight:600;letter-spacing:.005em;color:#fff;margin-top:4px;}',
    '#tsmb-root .tsmb-caption .tsmb-accent{color:var(--tsmb-gold);}',
    '#tsmb-root .tsmb-tile{position:relative;width:100%;max-width:520px;cursor:pointer;border-radius:12px;filter:drop-shadow(0 10px 30px rgba(0,0,0,.45));transition:transform .5s var(--tsmb-ease),filter .5s var(--tsmb-ease);}',
    '#tsmb-root .tsmb-tile:hover{transform:translateY(-4px) scale(1.02);animation:tsmbHeartbeat 2.6s var(--tsmb-ease) infinite;}',
    '@keyframes tsmbHeartbeat{0%,100%{filter:drop-shadow(0 22px 52px rgba(0,0,0,.6)) drop-shadow(0 6px 18px rgba(158,148,127,.14));}50%{filter:drop-shadow(0 22px 52px rgba(0,0,0,.6)) drop-shadow(0 8px 26px rgba(158,148,127,.30));}}',
    '#tsmb-root .tsmb-tile:active{transform:scale(.99);transition-duration:.12s;}',
    '#tsmb-root .tsmb-frame{width:100%;height:auto;display:block;position:relative;z-index:1;pointer-events:none;user-select:none;}',
    '#tsmb-root .tsmb-cover{position:absolute;top:3.65%;left:12.22%;width:73.06%;height:83.85%;overflow:hidden;z-index:0;border-radius:3px;background:#191919;}',
    '#tsmb-root .tsmb-cover img{width:100%;display:block;}',
    '#tsmb-root .tsmb-hint{font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.32);animation:tsmbHint 2.5s ease-in-out infinite;}',
    '@keyframes tsmbHint{0%,100%{opacity:.4}50%{opacity:.8}}',
    '#tsmb-lb{position:fixed;inset:0;z-index:99999;display:none;flex-direction:column;align-items:center;justify-content:center;background:rgba(5,6,11,.92);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);padding:32px;opacity:0;transition:opacity .24s cubic-bezier(.16,1,.3,1);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;}',
    '#tsmb-lb.open{display:flex;opacity:1;}',
    '#tsmb-lb .tsmb-inner{position:relative;width:100%;max-width:min(960px,calc(100vw - 64px));transform:scale(.92) translateY(24px);transition:transform .5s cubic-bezier(.16,1,.3,1);}',
    '#tsmb-lb.open .tsmb-inner{transform:scale(1) translateY(0);}',
    '#tsmb-lb.full{padding:0;}',
    '#tsmb-lb.full .tsmb-inner{max-width:100vw;}',
    '#tsmb-lb .tsmb-mockup{position:relative;width:100%;aspect-ratio:1366/768;filter:drop-shadow(0 30px 80px rgba(0,0,0,.6)) drop-shadow(0 10px 30px rgba(0,0,0,.5));}',
    '#tsmb-lb .tsmb-frame{position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none;user-select:none;}',
    '#tsmb-lb .tsmb-screen{position:absolute;top:3.65%;left:12.22%;width:73.06%;height:83.85%;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;z-index:3;border-radius:3px;background:#191919;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.14) transparent;}',
    '#tsmb-lb .tsmb-screen::-webkit-scrollbar{width:5px;}',
    '#tsmb-lb .tsmb-screen::-webkit-scrollbar-thumb{background:rgba(255,255,255,.14);border-radius:4px;}',
    '#tsmb-lb .tsmb-screen img{width:100%;display:block;}',
    '#tsmb-lb .tsmb-closehint{margin-top:22px;font-size:12px;letter-spacing:.1em;color:rgba(255,255,255,.32);text-align:center;}',
    '#tsmb-lb.full .tsmb-closehint{display:none;}',
    '#tsmb-lb .tsmb-btn{position:absolute;top:16px;z-index:10;width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.55);cursor:pointer;display:flex;align-items:center;justify-content:center;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);transition:background .2s,color .2s;}',
    '#tsmb-lb .tsmb-btn:hover{background:rgba(255,255,255,.16);color:#fff;}',
    '#tsmb-lb .tsmb-expand{left:16px;}#tsmb-lb .tsmb-closex{right:16px;}',
    '@media(prefers-reduced-motion:reduce){#tsmb-root *,#tsmb-lb *{animation:none!important;transition-duration:.01ms!important;}}'
  ].join('');
  function injectCSS(){ if(document.getElementById('tsmb-css'))return; var s=document.createElement('style'); s.id='tsmb-css'; s.textContent=CSS; document.head.appendChild(s); }
  function shut(){ var lb=document.getElementById('tsmb-lb'); if(!lb)return; lb.classList.remove('open','full'); document.body.style.overflow=''; }
  function ensureLb(){
    var lb=document.getElementById('tsmb-lb'); if(lb) return lb;
    lb=document.createElement('div'); lb.id='tsmb-lb';
    lb.innerHTML='<button class="tsmb-btn tsmb-expand" title="Vollbild" aria-label="Vollbild"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="tsmb-btn tsmb-closex" title="Schließen" aria-label="Schließen"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4.5 4.5l9 9M13.5 4.5l-9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button><div class="tsmb-inner"><div class="tsmb-mockup"><img class="tsmb-frame" src="'+FRAME+'" alt="MacBook"><div class="tsmb-screen"><img src="'+SHOT+'" alt="Thai Peanut Tofu Bowl"></div></div></div><div class="tsmb-closehint">✕ Klicke daneben oder ESC zum Schließen</div>';
    document.body.appendChild(lb);
    var inner=lb.querySelector('.tsmb-inner');
    lb.querySelector('.tsmb-closex').addEventListener('click',shut);
    lb.querySelector('.tsmb-expand').addEventListener('click',function(e){ e.stopPropagation(); lb.classList.toggle('full'); });
    inner.addEventListener('click',function(e){ e.stopPropagation(); });
    lb.addEventListener('click',function(e){ if(e.target===lb) shut(); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') shut(); });
    return lb;
  }
  function openLb(){ var lb=ensureLb(); lb.classList.add('open'); lb.classList.remove('full'); document.body.style.overflow='hidden'; var sc=lb.querySelector('.tsmb-screen'); if(sc) sc.scrollTop=0; }
  function findAnchor(){ var n=document.querySelectorAll('.notion-text'); for(var i=0;i<n.length;i++){ var t=n[i].textContent; if(t && t.indexOf(ANCHOR)>-1) return n[i]; } return null; }
  function buildTile(){
    var root=document.createElement('div'); root.id='tsmb-root';
    root.innerHTML='<div class="tsmb-tile" role="button" tabindex="0" aria-label="MacBook vergrößern"><div class="tsmb-cover"><img src="'+SHOT+'" alt=""></div><img class="tsmb-frame" src="'+FRAME+'" alt="MacBook"></div><div class="tsmb-caption">Gerichte Datenbank<span class="tsmb-accent"> – Live Beispiel</span></div><div class="tsmb-hint">Klicke zum Vergrößern</div>';
    var tile=root.querySelector('.tsmb-tile');
    tile.addEventListener('click',openLb);
    tile.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openLb(); } });
    return root;
  }
  function mount(){
    if(!/\/mehrwert-zielbild\/?$/.test(location.pathname)){ var e=document.getElementById('tsmb-root'); if(e&&e.parentNode)e.parentNode.removeChild(e); return; }
    injectCSS();
    var p=findAnchor(); if(!p) return;
    var textCol=p.closest('.notion-column'); if(!textCol) return;
    var list=p.closest('.notion-column-list'); if(!list) return;
    list.classList.add('tsmb-centered-row');
    var cols=[]; for(var i=0;i<list.children.length;i++){ var c=list.children[i]; if(c.classList&&c.classList.contains('notion-column')) cols.push(c); }
    var target=null; for(var j=0;j<cols.length;j++){ if(cols[j]!==textCol){ target=cols[j]; break; } }
    if(!target) return;
    var existing=document.getElementById('tsmb-root');
    if(existing){ if(target.contains(existing)) return; existing.parentNode.removeChild(existing); }
    target.insertBefore(buildTile(), target.firstChild);
  }
  function boot(){
    var tries=0;
    var iv=setInterval(function(){ tries++; mount(); if((document.getElementById('tsmb-root')&&document.getElementById('tsmb-root').closest('.notion-column'))||tries>60) clearInterval(iv); },300);
    new MutationObserver(function(){ mount(); }).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='complete') boot(); else window.addEventListener('load',boot);
})();

/* ---- */

/* ============================================================
   Deckungsbeitrags-Treppe DB I–III (mehrwert-zielbild)
   Waterfall-Balken: Verkaufspreis → Abzüge → DB III.
   Beispielzahlen = fiktives Rechenbeispiel (14,00 € netto).
   ============================================================ */
(function(){
  if (window.__tsdb) return; window.__tsdb = true;
  var PATH = /\/mehrwert-zielbild\/?$/;
  /* Anker: Satz NACH der Animation ("Und genau diese drei Stufen…") — Widget wird DAVOR eingefügt.
     Phrase zuerst (Block-IDs haben sich am 10.07. als instabil erwiesen: Formel-Block verschwand samt ID). */
  var ANCHOR_ID = 'block-38eb9546553480a5a7c8c1b512fd2f2b';
  var ANCHOR_PHRASE = 'Und genau diese drei Stufen rechnet';
  var ROOT_ID = 'tsdb';
  var STEP_MS = 620, BAR_MS = 850;

  /* Beispielgericht 14,00 € netto — Anteile in % des Verkaufspreises */
  var ROWS = [
    { kind:'base',   name:'Verkaufspreis Netto',  sub:'dein Startwert',               from:0,      to:100,    val:14.00, sign:''  },
    { kind:'cost',   name:'Wareneinsatz',         sub:'',                             from:70,     to:100,    val:4.20,  sign:'−' },
    { kind:'result', name:'Deckungsbeitrag I',    sub:'Verkaufspreis − Wareneinsatz', from:0,      to:70,     val:9.80,  sign:'=' },
    { kind:'cost',   name:'Gemeinkostenanteil',   sub:'',                             from:45,     to:70,     val:3.50,  sign:'−' },
    { kind:'result', name:'Deckungsbeitrag II',   sub:'DB I − Gemeinkostenanteil',    from:0,      to:45,     val:6.30,  sign:'=' },
    { kind:'cost',   name:'Personalkostenanteil', sub:'',                             from:15.714, to:45,     val:4.10,  sign:'−' },
    { kind:'final',  name:'Deckungsbeitrag III',  sub:'DB II − Personalkostenanteil', from:0,      to:15.714, val:2.20,  sign:'=' }
  ];
  var GUIDES = [100, 70, 45, 15.714];

  var CSS = `
  #tsdb{width:100%;max-width:900px;margin:30px auto 12px;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",Helvetica,Arial,sans-serif;color:#fff}
  #tsdb *{box-sizing:border-box}
  #tsdb .tsdb-head{text-align:center;margin-bottom:28px}
  #tsdb .tsdb-title{font-size:clamp(24px,3.2vw,36px);font-weight:800;letter-spacing:-.02em;line-height:1.12;color:#fff;margin:0 0 10px}
  #tsdb .tsdb-title span{color:#c7b489}
  #tsdb .tsdb-sub{font-size:15px;color:rgba(255,255,255,.42);max-width:520px;margin:0 auto;line-height:1.6}
  #tsdb .tsdb-chart{position:relative;padding:4px 0}
  #tsdb .tsdb-guides{position:absolute;z-index:0;top:2px;bottom:2px;left:216px;right:100px;pointer-events:none}
  #tsdb .tsdb-guide{position:absolute;top:0;bottom:0;width:0;border-left:1px dashed rgba(216,201,171,.16);opacity:0;transition:opacity .8s ease}
  #tsdb .tsdb-guide.on{opacity:1}
  #tsdb .tsdb-rows{position:relative;z-index:1;display:flex;flex-direction:column;gap:10px}
  #tsdb .tsdb-row{display:grid;grid-template-columns:200px 1fr 84px;grid-template-areas:"lab track val";gap:16px;align-items:center;opacity:0;transform:translateY(12px);transition:opacity .55s ease,transform .55s cubic-bezier(.16,1,.3,1)}
  #tsdb .tsdb-row.on{opacity:1;transform:none}
  #tsdb .tsdb-lab{grid-area:lab;text-align:right;line-height:1.3;min-width:0}
  #tsdb .tsdb-name{display:block;font-size:13px;font-weight:700;letter-spacing:.02em;color:rgba(255,255,255,.82);white-space:nowrap}
  #tsdb .tsdb-row[data-kind="cost"] .tsdb-name{color:rgba(255,255,255,.5);font-weight:600}
  #tsdb .tsdb-row[data-kind="result"] .tsdb-name{color:#d8c9ab}
  #tsdb .tsdb-row[data-kind="final"] .tsdb-name{color:#efe6d2}
  #tsdb .tsdb-formula{display:block;font-size:11px;color:rgba(255,255,255,.3);margin-top:2px;white-space:nowrap}
  #tsdb .tsdb-track{grid-area:track;position:relative;height:32px;border-radius:8px;background:rgba(255,255,255,.035);box-shadow:inset 0 0 0 1px rgba(255,255,255,.05)}
  #tsdb .tsdb-bar{position:absolute;top:3px;bottom:3px;border-radius:6px;transform:scaleX(0);transform-origin:left center;transition:transform ${BAR_MS}ms cubic-bezier(.16,1,.3,1)}
  #tsdb .tsdb-row[data-kind="cost"] .tsdb-bar{transform-origin:right center}
  #tsdb .tsdb-row.on .tsdb-bar{transform:scaleX(1)}
  #tsdb .tsdb-row[data-kind="base"] .tsdb-bar{background:linear-gradient(90deg,rgba(255,255,255,.13),rgba(255,255,255,.26));box-shadow:inset 0 0 0 1px rgba(255,255,255,.28)}
  #tsdb .tsdb-row[data-kind="cost"] .tsdb-bar{background:linear-gradient(90deg,rgba(227,37,82,.14),rgba(227,37,82,.32));box-shadow:inset 0 0 0 1px rgba(227,37,82,.38)}
  #tsdb .tsdb-row[data-kind="result"] .tsdb-bar{background:linear-gradient(90deg,rgba(216,201,171,.18),rgba(216,201,171,.4));box-shadow:inset 0 0 0 1px rgba(216,201,171,.42)}
  #tsdb .tsdb-row[data-kind="final"] .tsdb-bar{background:linear-gradient(90deg,rgba(216,201,171,.5),rgba(239,230,210,.78));box-shadow:inset 0 0 0 1px rgba(239,230,210,.6),0 0 22px rgba(199,180,137,.28)}
  @keyframes tsdbPulse{0%,100%{box-shadow:inset 0 0 0 1px rgba(239,230,210,.6),0 0 18px rgba(199,180,137,.22)}50%{box-shadow:inset 0 0 0 1px rgba(239,230,210,.75),0 0 34px rgba(199,180,137,.42)}}
  #tsdb .tsdb-row[data-kind="final"].pulse .tsdb-bar{animation:tsdbPulse 3.2s ease-in-out infinite}
  #tsdb .tsdb-val{grid-area:val;font-size:14px;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:.01em;color:rgba(255,255,255,.85);white-space:nowrap}
  #tsdb .tsdb-row[data-kind="cost"] .tsdb-val{color:rgba(227,37,82,.85);font-weight:600}
  #tsdb .tsdb-row[data-kind="result"] .tsdb-val{color:#d8c9ab}
  #tsdb .tsdb-row[data-kind="final"] .tsdb-val{color:#efe6d2;font-size:15px}
  #tsdb .tsdb-take{text-align:center;margin:24px auto 0;max-width:560px;font-size:14px;color:rgba(255,255,255,.42);line-height:1.6;opacity:0;transform:translateY(8px);transition:opacity .7s ease,transform .7s cubic-bezier(.16,1,.3,1)}
  #tsdb .tsdb-take.on{opacity:1;transform:none}
  #tsdb .tsdb-take b{color:#d8c9ab;font-weight:700}
  #tsdb .tsdb-replay{display:block;margin:14px auto 0;padding:7px 18px;border:1px solid rgba(216,201,171,.25);border-radius:9999px;background:transparent;color:rgba(216,201,171,.55);font-size:12px;font-weight:600;letter-spacing:.04em;cursor:pointer;opacity:0;transition:opacity .5s ease,color .2s ease,border-color .2s ease}
  #tsdb .tsdb-replay.on{opacity:1}
  #tsdb .tsdb-replay:hover{color:#d8c9ab;border-color:rgba(216,201,171,.5)}
  @media(max-width:700px){
    #tsdb .tsdb-row{grid-template-columns:1fr auto;grid-template-areas:"lab val" "track track";gap:5px 12px}
    #tsdb .tsdb-lab{text-align:left}
    #tsdb .tsdb-name{white-space:normal}
    #tsdb .tsdb-formula{display:none}
    #tsdb .tsdb-val{align-self:end}
    #tsdb .tsdb-track{height:26px}
    #tsdb .tsdb-rows{gap:14px}
    #tsdb .tsdb-guides{display:none}
  }
  @media(prefers-reduced-motion:reduce){
    #tsdb .tsdb-row,#tsdb .tsdb-bar,#tsdb .tsdb-take,#tsdb .tsdb-replay,#tsdb .tsdb-guide{transition:none}
    #tsdb .tsdb-row[data-kind="final"].pulse .tsdb-bar{animation:none}
  }`;

  function euro(v){ return v.toFixed(2).replace('.', ',') + ' €'; }

  function injectStyle(){
    if (document.getElementById('tsdb-style')) return;
    var s = document.createElement('style'); s.id = 'tsdb-style'; s.textContent = CSS;
    document.head.appendChild(s);
  }

  function buildMarkup(){
    var root = document.createElement('div'); root.id = ROOT_ID;
    var rows = ROWS.map(function(r){
      return '<div class="tsdb-row" data-kind="' + r.kind + '">' +
        '<div class="tsdb-lab"><span class="tsdb-name">' + r.name + '</span>' +
          (r.sub ? '<span class="tsdb-formula">' + r.sub + '</span>' : '') + '</div>' +
        '<div class="tsdb-track"><div class="tsdb-bar" style="left:' + r.from + '%;width:' + (r.to - r.from) + '%;"></div></div>' +
        '<div class="tsdb-val">' + (r.sign ? r.sign + '&nbsp;' : '') + '0,00&nbsp;€</div>' +
      '</div>';
    }).join('');
    var guides = GUIDES.map(function(g){ return '<div class="tsdb-guide" style="left:' + g + '%;"></div>'; }).join('');
    root.innerHTML =
      '<div class="tsdb-head">' +
        '<h3 class="tsdb-title">Deckungsbeitrag. <span>Stufe für Stufe.</span></h3>' +
        '<p class="tsdb-sub">Ein Beispielgericht für 14,00&nbsp;€ netto — und was nach jedem Abzug übrig bleibt.</p>' +
      '</div>' +
      '<div class="tsdb-chart">' +
        '<div class="tsdb-guides">' + guides + '</div>' +
        '<div class="tsdb-rows">' + rows + '</div>' +
      '</div>' +
      '<p class="tsdb-take">Von <b>14,00&nbsp;€</b> netto bleiben <b>2,20&nbsp;€</b> — dein Deckungsbeitrag III.</p>' +
      '<button type="button" class="tsdb-replay">↻ Nochmal abspielen</button>';
    return root;
  }

  function countUp(el, target, sign, ms){
    var start = null;
    function frame(ts){
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / ms);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (sign ? sign + ' ' : '') + euro(target * eased).replace(' €', ' €');
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function play(root, instant){
    var rows = root.querySelectorAll('.tsdb-row');
    rows.forEach(function(row, i){
      var val = row.querySelector('.tsdb-val');
      var data = ROWS[i];
      if (instant){
        row.classList.add('on'); if (data.kind === 'final') row.classList.add('pulse');
        val.textContent = (data.sign ? data.sign + ' ' : '') + euro(data.val).replace(' €', ' €');
        return;
      }
      setTimeout(function(){
        row.classList.add('on');
        countUp(val, data.val, data.sign, BAR_MS);
        if (data.kind === 'final') setTimeout(function(){ row.classList.add('pulse'); }, BAR_MS);
      }, 150 + i * STEP_MS);
    });
    setTimeout(function(){
      root.querySelectorAll('.tsdb-guide').forEach(function(g){ g.classList.add('on'); });
      var take = root.querySelector('.tsdb-take'); if (take) take.classList.add('on');
      var rep = root.querySelector('.tsdb-replay'); if (rep) rep.classList.add('on');
    }, instant ? 0 : 150 + rows.length * STEP_MS + 250);
  }

  function reset(root){
    root.querySelectorAll('.tsdb-row').forEach(function(row, i){
      row.classList.remove('on', 'pulse');
      row.querySelector('.tsdb-val').textContent = (ROWS[i].sign ? ROWS[i].sign + ' ' : '') + '0,00 €';
    });
    root.querySelectorAll('.tsdb-guide').forEach(function(g){ g.classList.remove('on'); });
    var take = root.querySelector('.tsdb-take'); if (take) take.classList.remove('on');
  }

  function init(root){
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var played = false;
    if (!('IntersectionObserver' in window)){ play(root, true); return; }
    var io = new IntersectionObserver(function(en){
      if (en[0].isIntersecting && !played){ played = true; io.disconnect(); play(root, reduced); }
    }, { threshold: 0.35 });
    io.observe(root.querySelector('.tsdb-chart'));
    var rep = root.querySelector('.tsdb-replay');
    if (rep) rep.addEventListener('click', function(){
      if (reduced) return;
      reset(root);
      setTimeout(function(){ play(root, false); }, 60);
    });
  }

  function findAnchor(){
    var cands = document.querySelectorAll('.notion-text, p');
    for (var i=0;i<cands.length;i++){ if (cands[i].textContent && cands[i].textContent.indexOf(ANCHOR_PHRASE)!==-1) return cands[i]; }
    return document.getElementById(ANCHOR_ID);
  }
  function mount(){
    if (!PATH.test(location.pathname)){
      var stale = document.getElementById(ROOT_ID); if (stale && stale.parentNode) stale.parentNode.removeChild(stale);
      return;
    }
    if (document.getElementById(ROOT_ID)) return;
    var anchor = findAnchor();
    if (!anchor) return;
    injectStyle();
    var root = buildMarkup();
    anchor.parentNode.insertBefore(root, anchor);
    init(root);
  }
  function boot(){
    var tries = 0;
    var iv = setInterval(function(){ tries++; mount(); if (tries > 40) clearInterval(iv); }, 300);
    new MutationObserver(function(){ if (!document.getElementById(ROOT_ID)) mount(); })
      .observe(document.documentElement, {childList:true, subtree:true});
  }
  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot);
})();

/* ---- */

(function(){
  var IMG="https://files.catbox.moe/l40xto.webp";
  var LOGO="https://files.catbox.moe/au80tp.png";
  function on(){ return /\/inventurliste\/?$/.test(location.pathname); }
  function mount(){
    if(!on()) return;
    var sc=document.querySelector(".super-content");
    if(!sc || sc.querySelector(".ts-hero")) return;
    var hero=document.createElement("div");
    hero.className="ts-hero";
    hero.innerHTML=
      '<img class="ts-hero__img" alt="DB 0 — Inventurliste" src="'+IMG+'">'+
      '<div class="ts-hero__text">'+
        '<img class="ts-hero__logo" alt="Tasty Studios" src="'+LOGO+'">'+
        '<div class="ts-hero__eyebrow">Lektion 2.2</div>'+
        '<h1 class="ts-hero__title">DB 0 : <span class="ts-gold">Inventurliste</span></h1>'+
      '</div>';
    var nr=sc.querySelector(".notion-root");
    if(nr) sc.insertBefore(hero, nr); else sc.appendChild(hero);
    Array.prototype.forEach.call(sc.querySelectorAll('.notion-image img[src*="logo_vektor"]'),
      function(img){ var blk=img.closest(".notion-image"); if(blk) blk.style.display="none"; });
    var nh=document.querySelector(".notion-header.page"); if(nh) nh.style.display="none";
  }
  mount();
  document.addEventListener("DOMContentLoaded", mount);
  new MutationObserver(mount).observe(document.documentElement,{childList:true,subtree:true});
})();
