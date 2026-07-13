/* gemeinkosten-mitarbeiterlhne — Lohn-Ebenen-Animation (#tslohn)
   Drei Lohn-Ebenen (Netto -> Brutto -> Arbeitgeber-Bruttokosten) + klarer,
   scanbarer Aufbau der Arbeitgeber-Sozialabgaben als Zeilenliste.
   Nur Fakten-Prozentwerte (RV 9,3 / KV 7,3 / PV 1,8 / ALV 1,3 / Umlagen variabel);
   KEINE erfundenen Euro-Betraege (Niemals-schaetzen-Regel).
   Anker: NACH der 3-Ebenen-Bulletliste, Text bleibt erhalten.                     */
(function(){
  if(window.__tslohn) return; window.__tslohn=true;

  var GLOW='199,180,137';
  var MAXPCT=9.3; /* laengster Balken = Rentenversicherung */
  var ROWS=[
    {name:'Rentenversicherung',       pct:9.3, disp:'9,3 %'},
    {name:'Krankenversicherung',      pct:7.3, disp:'7,3 %', note:'+ Zusatzbeitrag'},
    {name:'Pflegeversicherung',       pct:1.8, disp:'1,8 %'},
    {name:'Arbeitslosenversicherung', pct:1.3, disp:'1,3 %'},
    {name:'Unfallvers. / Umlagen U1–U3', pct:1.6, disp:'variabel', vari:true}
  ];
  var FACTOR_TARGET=1.21;

  var CSS=`
  #tslohn{width:100vw;max-width:100vw;margin:40px 0 34px;margin-left:calc(50% - 50vw);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;color:#fff;-webkit-font-smoothing:antialiased}
  #tslohn *{box-sizing:border-box}
  #tslohn .tslohn-card{position:relative;width:min(940px,92vw);margin:0 auto;padding:46px 48px 40px;border-radius:24px;overflow:hidden;
    background:linear-gradient(180deg,#0a0c14 0%,#05060c 62%,#04050a 100%);
    border:1px solid rgba(255,255,255,.08);
    box-shadow:0 40px 90px -50px rgba(0,0,0,.95),inset 0 1px 0 rgba(255,255,255,.05)}
  #tslohn .tslohn-card::before{content:"";position:absolute;left:0;top:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(${GLOW},.55),transparent);opacity:.7}
  #tslohn .tslohn-card::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(120% 80% at 50% -8%,rgba(${GLOW},.09),rgba(${GLOW},0) 55%)}
  #tslohn .tslohn-in{position:relative;z-index:2}

  #tslohn .tslohn-eyebrow{font-size:.7rem;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:#c7b489;margin:0 0 12px}
  #tslohn .tslohn-title{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;font-weight:600;font-size:clamp(1.5rem,3.2vw,2rem);line-height:1.14;letter-spacing:-.018em;color:#fff;margin:0 0 30px}
  #tslohn .tslohn-title span{color:#c7b489}

  /* ---- Akt 1: drei Ebenen ---- */
  #tslohn .tslohn-tiers{display:flex;align-items:stretch;gap:14px;margin:0 0 36px}
  #tslohn .tslohn-tier{flex:1;position:relative;padding:20px 22px 18px;border-radius:16px;background:rgba(255,255,255,.028);border:1px solid rgba(255,255,255,.08);
    opacity:0;transform:translateY(16px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1)}
  #tslohn.on .tslohn-tier{opacity:1;transform:none}
  #tslohn.on .tslohn-tier[data-i="0"]{transition-delay:.05s}
  #tslohn.on .tslohn-tier[data-i="1"]{transition-delay:.18s}
  #tslohn.on .tslohn-tier[data-i="2"]{transition-delay:.31s}
  #tslohn .tslohn-tier--gold{background:linear-gradient(180deg,rgba(${GLOW},.15),rgba(${GLOW},.05));border-color:rgba(${GLOW},.45);box-shadow:0 20px 46px -30px rgba(${GLOW},.6)}
  #tslohn .tslohn-tier__k{display:block;font-size:.64rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:10px}
  #tslohn .tslohn-tier--gold .tslohn-tier__k{color:#c7b489}
  #tslohn .tslohn-tier__n{display:block;font-family:"Lineal TS",-apple-system,sans-serif;font-weight:600;font-size:1.06rem;letter-spacing:-.01em;color:#fff;line-height:1.2;margin-bottom:7px}
  #tslohn .tslohn-tier__d{display:block;font-size:.82rem;line-height:1.45;color:rgba(255,255,255,.5)}
  #tslohn .tslohn-tier--gold .tslohn-tier__d{color:rgba(231,222,200,.72)}
  #tslohn .tslohn-tier__badge{display:inline-block;margin-top:12px;font-size:.66rem;font-weight:600;letter-spacing:.03em;color:#05060b;background:#c7b489;padding:3px 10px;border-radius:99px}
  #tslohn .tslohn-arrow{align-self:center;flex:0 0 auto;color:rgba(${GLOW},.5);font-size:1.05rem;opacity:0;transition:opacity .6s ease .45s}
  #tslohn.on .tslohn-arrow{opacity:1}

  /* ---- Akt 2: Aufbau als Zeilenliste ---- */
  #tslohn .tslohn-break{padding:28px 30px 24px;border-radius:18px;background:rgba(0,0,0,.26);border:1px solid rgba(255,255,255,.06)}
  #tslohn .tslohn-break__head{display:flex;align-items:baseline;justify-content:space-between;gap:18px;margin-bottom:22px;flex-wrap:wrap}
  #tslohn .tslohn-break__lbl{font-size:.94rem;line-height:1.45;color:rgba(255,255,255,.72);max-width:60%}
  #tslohn .tslohn-break__lbl b{color:#fff;font-weight:600}
  #tslohn .tslohn-factor{display:flex;flex-direction:column;align-items:flex-end;line-height:1;white-space:nowrap}
  #tslohn .tslohn-factor__k{font-size:.6rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.42);margin-bottom:7px}
  #tslohn .tslohn-factor__n{font-family:"Lineal TS",-apple-system,sans-serif;font-weight:600;font-size:2.1rem;line-height:1;color:#c7b489;letter-spacing:-.01em;text-shadow:0 0 22px rgba(${GLOW},.38);font-variant-numeric:tabular-nums}

  #tslohn .tslohn-row{display:grid;grid-template-columns:200px 1fr 68px;align-items:center;gap:16px;padding:9px 0;
    opacity:0;transform:translateX(-8px);transition:opacity .55s ease,transform .55s ease}
  #tslohn.on .tslohn-row{opacity:1;transform:none}
  #tslohn .tslohn-row+.tslohn-row{border-top:1px solid rgba(255,255,255,.05)}
  #tslohn .tslohn-row__name{font-size:.9rem;color:rgba(255,255,255,.82);display:flex;align-items:center;gap:8px;flex-wrap:wrap}
  #tslohn .tslohn-row__note{font-size:.7rem;color:rgba(255,255,255,.4)}
  #tslohn .tslohn-row__bar{position:relative;height:9px;border-radius:99px;background:rgba(255,255,255,.06);overflow:hidden}
  #tslohn .tslohn-row__fill{position:absolute;left:0;top:0;bottom:0;width:0;border-radius:99px;background:linear-gradient(90deg,#c7b489,#e9dcb8);box-shadow:0 0 14px rgba(${GLOW},.35);transition:width 1.1s cubic-bezier(.4,.1,.2,1)}
  #tslohn .tslohn-row--vari .tslohn-row__fill{background:repeating-linear-gradient(115deg,rgba(${GLOW},.85) 0 6px,rgba(${GLOW},.42) 6px 12px);box-shadow:none}
  #tslohn .tslohn-row__pct{text-align:right;font-size:.98rem;font-weight:600;color:#fff;font-variant-numeric:tabular-nums;letter-spacing:-.01em}
  #tslohn .tslohn-row--vari .tslohn-row__pct{font-size:.82rem;font-weight:500;color:rgba(255,255,255,.55)}

  #tslohn .tslohn-sum{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:20px;padding-top:18px;border-top:1px solid rgba(${GLOW},.22)}
  #tslohn .tslohn-sum__lbl{font-size:.82rem;font-weight:600;letter-spacing:.02em;color:rgba(255,255,255,.6)}
  #tslohn .tslohn-sum__val{font-family:"Lineal TS",-apple-system,sans-serif;font-weight:600;font-size:1.5rem;color:#c7b489;letter-spacing:-.01em;text-shadow:0 0 20px rgba(${GLOW},.35)}

  /* ---- Akt 3: Ergebnis ---- */
  #tslohn .tslohn-note{margin:20px 4px 0;font-size:.86rem;line-height:1.6;color:rgba(255,255,255,.56)}
  #tslohn .tslohn-note b{color:#fff;font-weight:600}
  #tslohn .tslohn-fine{margin:12px 4px 0;font-size:.72rem;line-height:1.55;color:rgba(255,255,255,.34)}

  @media(max-width:760px){
    #tslohn .tslohn-card{padding:32px 20px 28px;border-radius:20px}
    #tslohn .tslohn-title{margin-bottom:24px}
    #tslohn .tslohn-tiers{flex-direction:column;gap:10px}
    #tslohn .tslohn-arrow{transform:rotate(90deg);align-self:center;margin:-2px 0}
    #tslohn .tslohn-break{padding:22px 18px 20px}
    #tslohn .tslohn-break__lbl{max-width:100%;font-size:.88rem}
    #tslohn .tslohn-factor{flex-direction:row;align-items:baseline;gap:9px;margin-top:4px}
    #tslohn .tslohn-factor__k{margin-bottom:0}
    #tslohn .tslohn-factor__n{font-size:1.7rem}
    #tslohn .tslohn-row{grid-template-columns:1fr 58px;gap:5px 12px}
    #tslohn .tslohn-row__name{grid-column:1;grid-row:1}
    #tslohn .tslohn-row__pct{grid-column:2;grid-row:1}
    #tslohn .tslohn-row__bar{grid-column:1 / -1;grid-row:2;margin-top:2px}
    #tslohn .tslohn-sum__val{font-size:1.3rem}
  }
  @media(prefers-reduced-motion:reduce){
    #tslohn .tslohn-tier,#tslohn .tslohn-arrow,#tslohn .tslohn-row{opacity:1;transform:none;transition:none}
    #tslohn .tslohn-row__fill{transition:none}
  }`;

  function nf(v,dec){ return v.toFixed(dec).replace('.',','); }
  function injectCSS(){ if(document.getElementById('tslohn-css'))return; var s=document.createElement('style'); s.id='tslohn-css'; s.textContent=CSS; document.head.appendChild(s); }

  function build(){
    var rowsHTML=ROWS.map(function(r,i){
      var w=Math.round(r.pct/MAXPCT*100);
      return '<div class="tslohn-row '+(r.vari?'tslohn-row--vari':'')+'" data-i="'+i+'">'
        +'<span class="tslohn-row__name">'+r.name+(r.note?'<span class="tslohn-row__note">'+r.note+'</span>':'')+'</span>'
        +'<span class="tslohn-row__bar"><span class="tslohn-row__fill" data-w="'+w+'"></span></span>'
        +'<span class="tslohn-row__pct">'+r.disp+'</span>'
      +'</div>';
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
        +'<div class="tslohn-break__head">'
          +'<span class="tslohn-break__lbl">Der Arbeitgeber trägt <b>zusätzlich zum Bruttolohn</b> — Anteil zur Sozialversicherung plus Umlagen:</span>'
          +'<span class="tslohn-factor"><span class="tslohn-factor__k">AG-Kosten-Faktor</span><span class="tslohn-factor__n" data-target="'+FACTOR_TARGET+'">1,00</span></span>'
        +'</div>'
        +'<div class="tslohn-rows">'+rowsHTML+'</div>'
        +'<div class="tslohn-sum"><span class="tslohn-sum__lbl">Aufschlag auf den Bruttolohn</span><span class="tslohn-sum__val">+21 % bis +23 %</span></div>'
      +'</div>'

      +'<p class="tslohn-note">Für deine Kalkulation zählt am Ende <b>Ebene 3</b>: In der Gastronomie rechnet man mit einem AG-Kosten-Faktor von <b>ca. 1,21&thinsp;–&thinsp;1,30</b> — die Spanne nach oben mit Urlaubsrückstellungen und Lohnfortzahlung im Krankheitsfall.</p>'
      +'<p class="tslohn-fine">Prozentsätze sind gerundete Richtwerte für den Arbeitgeberanteil zur Sozialversicherung. Unfallversicherung und Umlagen U1/U2/U3 sind betriebsindividuell.</p>'
      +'</div></div>';
    return root;
  }

  function play(root){
    if(root.__played) return; root.__played=true;
    root.classList.add('on');
    var rows=[].slice.call(root.querySelectorAll('.tslohn-row'));
    rows.forEach(function(rw,i){
      rw.style.transitionDelay=(0.5+i*0.11)+'s';
      var fill=rw.querySelector('.tslohn-row__fill');
      setTimeout(function(){ fill.style.width=fill.getAttribute('data-w')+'%'; }, 650+i*160);
    });
    var fx=root.querySelector('.tslohn-factor__n');
    if(fx){
      var target=parseFloat(fx.getAttribute('data-target'))||1.21, dur=1500, t0=null, done=false;
      function step(now){ if(t0===null)t0=now; var p=Math.min(1,(now-t0)/dur), e=1-Math.pow(1-p,3), v=1+(target-1)*e; fx.textContent=nf(v,2); if(p<1&&!done) requestAnimationFrame(step); }
      setTimeout(function(){ requestAnimationFrame(step); }, 650);
      setTimeout(function(){ done=true; fx.textContent=nf(target,2); }, 650+dur+180);
    }
    setTimeout(function(){ root.classList.add('done'); }, 650+1500+400);
  }

  function inView(el){ var r=el.getBoundingClientRect(); var vh=window.innerHeight||document.documentElement.clientHeight; return r.top < vh-70 && r.bottom > 0; }
  function setup(root){
    var io=new IntersectionObserver(function(e){ if(e[0].isIntersecting){ play(root); io.disconnect(); } },{threshold:.18});
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