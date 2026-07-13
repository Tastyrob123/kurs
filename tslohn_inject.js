/* gemeinkosten-mitarbeiterlhne — Lohn-Ebenen-Animation (#tslohn)
   Visualisiert die drei Lohn-Ebenen (Netto -> Brutto -> Arbeitgeber-Bruttokosten)
   und den Aufbau der Arbeitgeber-Sozialabgaben auf den Bruttolohn.
   Nur Fakten-Prozentwerte (RV 9,3 / KV 7,3 / PV 1,8 / ALV 1,3 / Umlagen variabel);
   KEINE erfundenen Euro-Betraege (Niemals-schaetzen-Regel).
   Anker: NACH der 3-Ebenen-Bulletliste ("Nettolohn ... Arbeitgeber-Bruttokosten"),
   Text bleibt erhalten (nicht ersetzt).                                          */
(function(){
  if(window.__tslohn) return; window.__tslohn=true;

  var SCALE=0.76; /* %-Track-Breite pro 1% Lohnwert; Basis 100% -> 76% des Tracks */
  var GLOW='199,180,137';
  var SEG=[
    {name:'Rentenversicherung',      pct:9.3, disp:'9,3 %'},
    {name:'Krankenversicherung',     pct:7.3, disp:'7,3 %', note:'+ Zusatzbeitrag'},
    {name:'Pflegeversicherung',      pct:1.8, disp:'1,8 %'},
    {name:'Arbeitslosenversicherung',pct:1.3, disp:'1,3 %'},
    {name:'Unfallvers. / Umlagen U1–U3', pct:1.5, disp:'variabel', vari:true}
  ];
  var FACTOR_TARGET=1.21; /* 9,3+7,3+1,8+1,3 = 19,7 % + Umlagen -> grob +21 % */

  var CSS=`
  #tslohn{width:100vw;max-width:100vw;margin:40px 0 34px;margin-left:calc(50% - 50vw);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;color:#fff;-webkit-font-smoothing:antialiased}
  #tslohn *{box-sizing:border-box}
  #tslohn .tslohn-card{position:relative;width:min(1040px,92vw);margin:0 auto;padding:44px 46px 38px;border-radius:24px;overflow:hidden;
    background:linear-gradient(180deg,#0a0c14 0%,#05060c 62%,#04050a 100%);
    border:1px solid rgba(255,255,255,.08);
    box-shadow:0 40px 90px -50px rgba(0,0,0,.95),inset 0 1px 0 rgba(255,255,255,.05)}
  #tslohn .tslohn-card::before{content:"";position:absolute;left:0;top:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(${GLOW},.55),transparent);opacity:.7}
  #tslohn .tslohn-card::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(120% 80% at 50% -8%,rgba(${GLOW},.10),rgba(${GLOW},0) 55%)}
  #tslohn .tslohn-in{position:relative;z-index:2}

  #tslohn .tslohn-eyebrow{font-size:.7rem;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:#c7b489;margin:0 0 12px}
  #tslohn .tslohn-title{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;font-weight:600;font-size:clamp(1.5rem,3.2vw,2rem);line-height:1.12;letter-spacing:-.018em;color:#fff;margin:0 0 28px}
  #tslohn .tslohn-title span{color:#c7b489}

  /* ---- Akt 1: drei Ebenen ---- */
  #tslohn .tslohn-tiers{display:flex;align-items:stretch;gap:14px;margin:0 0 34px}
  #tslohn .tslohn-tier{flex:1;position:relative;padding:20px 20px 18px;border-radius:16px;background:rgba(255,255,255,.028);border:1px solid rgba(255,255,255,.08);
    opacity:0;transform:translateY(16px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1)}
  #tslohn.on .tslohn-tier{opacity:1;transform:none}
  #tslohn.on .tslohn-tier[data-i="0"]{transition-delay:.05s}
  #tslohn.on .tslohn-tier[data-i="1"]{transition-delay:.20s}
  #tslohn.on .tslohn-tier[data-i="2"]{transition-delay:.35s}
  #tslohn .tslohn-tier--gold{background:linear-gradient(180deg,rgba(${GLOW},.16),rgba(${GLOW},.05));border-color:rgba(${GLOW},.45);box-shadow:0 20px 46px -30px rgba(${GLOW},.6)}
  #tslohn .tslohn-tier__k{display:block;font-size:.64rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.42);margin-bottom:9px}
  #tslohn .tslohn-tier--gold .tslohn-tier__k{color:#c7b489}
  #tslohn .tslohn-tier__n{display:block;font-family:"Lineal TS",-apple-system,sans-serif;font-weight:600;font-size:1.06rem;letter-spacing:-.01em;color:#fff;line-height:1.2;margin-bottom:7px}
  #tslohn .tslohn-tier__d{display:block;font-size:.82rem;line-height:1.4;color:rgba(255,255,255,.5)}
  #tslohn .tslohn-tier--gold .tslohn-tier__d{color:rgba(231,222,200,.72)}
  #tslohn .tslohn-tier__badge{display:inline-block;margin-top:11px;font-size:.66rem;font-weight:600;letter-spacing:.04em;color:#05060b;background:#c7b489;padding:3px 9px;border-radius:99px}
  #tslohn .tslohn-arrow{align-self:center;flex:0 0 auto;color:rgba(${GLOW},.55);font-size:1.1rem;opacity:0;transition:opacity .6s ease .5s}
  #tslohn.on .tslohn-arrow{opacity:1}

  /* ---- Akt 2: Aufbau-Balken ---- */
  #tslohn .tslohn-break{margin:0 0 26px;padding:26px 26px 22px;border-radius:18px;background:rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.06)}
  #tslohn .tslohn-break__top{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;margin-bottom:20px;flex-wrap:wrap}
  #tslohn .tslohn-break__lbl{font-size:.82rem;font-weight:600;letter-spacing:.02em;color:rgba(255,255,255,.62)}
  #tslohn .tslohn-break__lbl b{color:#fff}
  #tslohn .tslohn-factor{display:flex;align-items:baseline;gap:9px;white-space:nowrap}
  #tslohn .tslohn-factor__k{font-size:.64rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.4)}
  #tslohn .tslohn-factor__n{font-family:"Lineal TS",-apple-system,sans-serif;font-weight:600;font-size:2rem;line-height:1;color:#c7b489;letter-spacing:-.01em;text-shadow:0 0 22px rgba(${GLOW},.4);font-variant-numeric:tabular-nums}

  #tslohn .tslohn-track{position:relative;display:flex;align-items:stretch;height:58px;border-radius:12px;background:rgba(255,255,255,.03);box-shadow:inset 0 1px 3px rgba(0,0,0,.6);padding:5px;gap:3px}
  #tslohn .tslohn-seg{position:relative;width:0;flex:0 0 auto;border-radius:7px;overflow:hidden;transition:width 1s cubic-bezier(.5,.1,.2,1)}
  #tslohn .tslohn-seg--base{background:linear-gradient(180deg,rgba(255,255,255,.14),rgba(255,255,255,.06));border:1px solid rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center}
  #tslohn .tslohn-seg--base .tslohn-seg__t{font-size:.78rem;font-weight:600;letter-spacing:.01em;color:rgba(255,255,255,.86);white-space:nowrap;padding:0 12px;opacity:0;transition:opacity .5s ease .35s}
  #tslohn.on .tslohn-seg--base .tslohn-seg__t{opacity:1}
  #tslohn .tslohn-seg--add{background:linear-gradient(180deg,#e9dcb8,#c7b489);box-shadow:inset 0 1px 0 rgba(255,255,255,.5),0 6px 18px -8px rgba(${GLOW},.7)}
  #tslohn .tslohn-seg--add::after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.7) 50%,transparent 65%);transform:translateX(-140%)}
  #tslohn.done .tslohn-seg--add::after{animation:tslohn-shim 1.5s ease .2s 1 forwards}
  #tslohn .tslohn-seg--vari{background:repeating-linear-gradient(115deg,rgba(${GLOW},.85) 0 7px,rgba(${GLOW},.5) 7px 14px);box-shadow:inset 0 1px 0 rgba(255,255,255,.35)}
  #tslohn .tslohn-guide{position:absolute;top:-7px;bottom:-7px;width:0;border-left:1.5px dashed rgba(255,255,255,.32);opacity:0;transition:opacity .5s ease .5s}
  #tslohn.on .tslohn-guide{opacity:1}
  @keyframes tslohn-shim{to{transform:translateX(340%)}}

  /* ---- Legende ---- */
  #tslohn .tslohn-legend{display:flex;flex-wrap:wrap;gap:9px 20px;margin-top:20px}
  #tslohn .tslohn-lg{display:flex;align-items:center;gap:9px;font-size:.8rem;color:rgba(255,255,255,.62);opacity:0;transform:translateY(6px);transition:opacity .5s ease,transform .5s ease}
  #tslohn.on .tslohn-lg{opacity:1;transform:none}
  #tslohn .tslohn-lg i{width:12px;height:12px;border-radius:3px;flex:0 0 auto;background:linear-gradient(180deg,#e9dcb8,#c7b489)}
  #tslohn .tslohn-lg--vari i{background:repeating-linear-gradient(115deg,rgba(${GLOW},.9) 0 4px,rgba(${GLOW},.45) 4px 8px)}
  #tslohn .tslohn-lg b{color:#fff;font-weight:600;margin-left:2px;white-space:nowrap}
  #tslohn .tslohn-lg s{color:rgba(255,255,255,.4);font-size:.72rem;text-decoration:none;margin-left:4px;white-space:nowrap}

  /* ---- Akt 3: Ergebnis ---- */
  #tslohn .tslohn-result{display:flex;align-items:center;gap:20px;flex-wrap:wrap;padding:22px 26px;border-radius:16px;
    background:linear-gradient(180deg,rgba(${GLOW},.12),rgba(${GLOW},.03));border:1px solid rgba(${GLOW},.32);
    opacity:0;transform:translateY(12px);transition:opacity .7s ease,transform .7s ease}
  #tslohn.on .tslohn-result{opacity:1;transform:none;transition-delay:.15s}
  #tslohn .tslohn-result__big{font-family:"Lineal TS",-apple-system,sans-serif;font-weight:600;font-size:clamp(1.7rem,4vw,2.3rem);line-height:1;color:#c7b489;letter-spacing:-.015em;text-shadow:0 0 26px rgba(${GLOW},.45)}
  #tslohn .tslohn-result__sub{font-size:.92rem;line-height:1.5;color:rgba(255,255,255,.7);max-width:520px}
  #tslohn .tslohn-result__sub b{color:#fff;font-weight:600}
  #tslohn .tslohn-note{margin:16px 2px 0;font-size:.73rem;line-height:1.55;color:rgba(255,255,255,.36)}

  @media(max-width:760px){
    #tslohn .tslohn-card{padding:32px 22px 28px;border-radius:20px}
    #tslohn .tslohn-title{margin-bottom:22px}
    #tslohn .tslohn-tiers{flex-direction:column;gap:10px}
    #tslohn .tslohn-arrow{transform:rotate(90deg);align-self:center;margin:-2px 0}
    #tslohn .tslohn-break{padding:20px 16px 18px}
    #tslohn .tslohn-break__top{margin-bottom:16px}
    #tslohn .tslohn-factor__n{font-size:1.7rem}
    #tslohn .tslohn-track{height:52px}
    #tslohn .tslohn-seg--base .tslohn-seg__t{font-size:.68rem;padding:0 6px}
    #tslohn .tslohn-result{padding:18px 18px}
  }
  @media(prefers-reduced-motion:reduce){
    #tslohn .tslohn-tier,#tslohn .tslohn-arrow,#tslohn .tslohn-lg,#tslohn .tslohn-result,#tslohn .tslohn-guide,#tslohn .tslohn-seg--base .tslohn-seg__t{opacity:1;transform:none;transition:none}
    #tslohn .tslohn-seg{transition:none}
    #tslohn .tslohn-seg--add::after{display:none}
  }`;

  function nf(v,dec){ return v.toFixed(dec).replace('.',','); }

  function injectCSS(){ if(document.getElementById('tslohn-css'))return; var s=document.createElement('style'); s.id='tslohn-css'; s.textContent=CSS; document.head.appendChild(s); }

  function build(){
    var baseW=(100*SCALE).toFixed(3);
    var segHTML='<div class="tslohn-seg tslohn-seg--base" data-w="'+baseW+'"><span class="tslohn-seg__t">Bruttolohn &middot; 100&thinsp;%</span></div>';
    SEG.forEach(function(s){
      var w=(s.pct*SCALE).toFixed(3);
      segHTML+='<div class="tslohn-seg '+(s.vari?'tslohn-seg--vari':'tslohn-seg--add')+'" data-w="'+w+'" title="'+s.name+' '+s.disp+'"></div>';
    });
    var legHTML=SEG.map(function(s){
      return '<span class="tslohn-lg '+(s.vari?'tslohn-lg--vari':'')+'"><i></i>'+s.name+' <b>'+s.disp+'</b>'+(s.note?'<s>'+s.note+'</s>':'')+'</span>';
    }).join('');

    var root=document.createElement('div'); root.id='tslohn';
    root.innerHTML=
      '<div class="tslohn-card"><div class="tslohn-in">'
      +'<p class="tslohn-eyebrow">Die echte Kostenzahl</p>'
      +'<h2 class="tslohn-title">Vom Nettolohn zu den <span>Arbeitgeberkosten</span></h2>'

      +'<div class="tslohn-tiers">'
        +'<div class="tslohn-tier" data-i="0"><span class="tslohn-tier__k">Ebene 1</span><span class="tslohn-tier__n">Nettolohn</span><span class="tslohn-tier__d">Was beim Mitarbeiter auf dem Konto ankommt.</span></div>'
        +'<span class="tslohn-arrow" aria-hidden="true">&rarr;</span>'
        +'<div class="tslohn-tier" data-i="1"><span class="tslohn-tier__k">Ebene 2</span><span class="tslohn-tier__n">Bruttolohn</span><span class="tslohn-tier__d">Was im Arbeitsvertrag steht: Netto + Lohnsteuer + AN-Sozialabgaben.</span></div>'
        +'<span class="tslohn-arrow" aria-hidden="true">&rarr;</span>'
        +'<div class="tslohn-tier tslohn-tier--gold" data-i="2"><span class="tslohn-tier__k">Ebene 3</span><span class="tslohn-tier__n">Arbeitgeber-Bruttokosten</span><span class="tslohn-tier__d">Was dich als Arbeitgeber tatsächlich kostet.</span><span class="tslohn-tier__badge">deine Kostenzahl</span></div>'
      +'</div>'

      +'<div class="tslohn-break">'
        +'<div class="tslohn-break__top">'
          +'<span class="tslohn-break__lbl">Arbeitgeberkosten = <b>Bruttolohn</b> + AG-Anteil zur Sozialversicherung (+ Umlagen)</span>'
          +'<span class="tslohn-factor"><span class="tslohn-factor__k">AG-Kosten-Faktor</span><span class="tslohn-factor__n" data-target="'+FACTOR_TARGET+'">1,00</span></span>'
        +'</div>'
        +'<div class="tslohn-track">'+segHTML
          +'<div class="tslohn-guide" data-left="'+baseW+'"></div>'
        +'</div>'
        +'<div class="tslohn-legend">'+legHTML+'</div>'
      +'</div>'

      +'<div class="tslohn-result">'
        +'<span class="tslohn-result__big">+21&thinsp;% bis +23&thinsp;%</span>'
        +'<span class="tslohn-result__sub">kommen auf den Bruttolohn obendrauf. In der Gastronomie rechnet man mit einem AG-Kosten-Faktor von <b>ca. 1,21&thinsp;–&thinsp;1,30</b> – die Spanne nach oben mit Urlaubsrückstellungen und Lohnfortzahlung im Krankheitsfall.</span>'
      +'</div>'
      +'<p class="tslohn-note">Prozentsätze sind gerundete Richtwerte für den Arbeitgeberanteil zur Sozialversicherung (RV 9,3&thinsp;% &middot; KV 7,3&thinsp;% zzgl. Zusatzbeitrag &middot; PV 1,8&thinsp;% &middot; ALV 1,3&thinsp;%). Unfallversicherung und Umlagen U1/U2/U3 sind betriebsindividuell.</p>'
      +'</div></div>';
    return root;
  }

  function play(root){
    if(root.__played) return; root.__played=true;
    root.classList.add('on');
    /* Segmente auf Zielbreite wachsen lassen (gestaffelt) */
    var segs=[].slice.call(root.querySelectorAll('.tslohn-seg'));
    segs.forEach(function(sg,i){
      setTimeout(function(){ sg.style.width=sg.getAttribute('data-w')+'%'; }, 350+i*180);
    });
    /* Legenden gestaffelt */
    var lgs=[].slice.call(root.querySelectorAll('.tslohn-lg'));
    lgs.forEach(function(lg,i){ lg.style.transitionDelay=(0.9+i*0.09)+'s'; });
    /* 100%-Guide positionieren */
    var g=root.querySelector('.tslohn-guide');
    if(g){ g.style.left='calc('+g.getAttribute('data-left')+'% + 5px)'; }
    /* Faktor hochzaehlen, synchron zum Balkenaufbau; Garantie-Endwert per setTimeout */
    var fx=root.querySelector('.tslohn-factor__n');
    if(fx){
      var target=parseFloat(fx.getAttribute('data-target'))||1.21, dur=1600, t0=null, done=false;
      function step(now){ if(t0===null)t0=now; var p=Math.min(1,(now-t0)/dur), e=1-Math.pow(1-p,3), v=1+(target-1)*e; fx.textContent=nf(v,2); if(p<1&&!done) requestAnimationFrame(step); }
      setTimeout(function(){ requestAnimationFrame(step); }, 500);
      setTimeout(function(){ done=true; fx.textContent=nf(target,2); }, 500+dur+180);
    }
    setTimeout(function(){ root.classList.add('done'); }, 500+1600+400);
  }

  function inView(el){ var r=el.getBoundingClientRect(); var vh=window.innerHeight||document.documentElement.clientHeight; return r.top < vh-70 && r.bottom > 0; }
  function setup(root){
    var io=new IntersectionObserver(function(e){ if(e[0].isIntersecting){ play(root); io.disconnect(); } },{threshold:.2});
    io.observe(root);
    function cleanup(){ window.removeEventListener('scroll',onScroll); clearInterval(poll); }
    function onScroll(){ if(inView(root)){ play(root); cleanup(); } }
    window.addEventListener('scroll',onScroll,{passive:true});
    var poll=setInterval(function(){ if(root.__played){ clearInterval(poll); return; } if(inView(root)){ play(root); cleanup(); } },250);
    setTimeout(function(){ clearInterval(poll); },15000);
    if(inView(root)) play(root);
  }

  function findList(){
    var uls=document.querySelectorAll('.page__gemeinkosten-mitarbeiterlhne ul.notion-bulleted-list');
    for(var i=0;i<uls.length;i++){
      var tx=uls[i].textContent||'';
      if(/Nettolohn/.test(tx) && /Arbeitgeber-Bruttokosten/.test(tx)) return uls[i];
    }
    return null;
  }
  function mount(){
    if(!/\/gemeinkosten-mitarbeiterlhne\/?$/.test(location.pathname)){ var e=document.getElementById('tslohn'); if(e&&e.parentNode)e.parentNode.removeChild(e); return; }
    if(document.getElementById('tslohn')) return;
    var ul=findList(); if(!ul) return;
    injectCSS();
    var root=build();
    ul.parentNode.insertBefore(root, ul.nextSibling); /* NACH der Liste, Text bleibt */
    setup(root);
  }
  function boot(){
    var tries=0;
    var iv=setInterval(function(){ tries++; mount(); if(tries>40) clearInterval(iv); },300);
    new MutationObserver(function(){ mount(); }).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='complete') boot(); else window.addEventListener('load',boot);
})();