
/* =========================================================================
   Chaos -> Klarheit  (mehrwert-zielbild)
   Full-Width-Erzaehlanimation unter dem Abschnitt "Warum du das ueberhaupt
   brauchst.": Akt 1 verstreute Tools -> Akt 2 ein System (Notion+Claude Code)
   -> Akt 3 echte Gerichte mit Deckungs-Verdikt (Beispielwerte).
   Guard window.__tsChaos · Pfad /mehrwert-zielbild · React-resilienter Mount.
   ========================================================================= */
(function(){
  if(window.__tsChaos) return; window.__tsChaos = true;
  function on(){ return /\/mehrwert-zielbild\/?$/.test(location.pathname); }
  var LINEAL='"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif';
  var BASE=(window.__tsChaosBase)||'https://tastyrob123.github.io/kurs/img/mehrwert/';
  function IMG(slug){ return BASE+slug+'.jpg'; }
  // Beispielwerte (Deckungsbeitrag / Verkauf) — SSOT in der Lektionsdatei.
  var DISHES=[
    {slug:'rinderfilet',       name:'Rinderfilet',       v:-0.40, k:'bad'},
    {slug:'rote-bete-risotto', name:'Rote-Bete-Risotto', v: 3.20, k:'good'},
    {slug:'lammkarree',        name:'Lammkarree',        v:-0.90, k:'bad'},
    {slug:'kuerbis-veloute',   name:'Kürbis-Velouté',    v: 2.80, k:'good'},
    {slug:'pilz-ravioli',      name:'Pilz-Ravioli',      v: 2.40, k:'good'},
    {slug:'gemuese-steak',     name:'Gemüse-Steak',      v: 3.60, k:'good'}
  ];
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  function css(){
    if(document.getElementById('tsChaosStyle')) return;
    var s=document.createElement('style'); s.id='tsChaosStyle';
    s.textContent=[
'#tsChaos{--champ:#c7b489;--champ-lite:#d8c9ab;--red:#e32552;--green:#8FCBAA;',
'  background:radial-gradient(120% 85% at 50% 0%, rgba(46,64,120,.38), transparent 55%);',
'  position:relative;width:100vw;max-width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);',
'  box-sizing:border-box;padding:clamp(30px,4vw,54px) clamp(16px,3vw,44px) clamp(26px,3vw,44px);',
'  color:#fff;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",sans-serif;}',
'#tsChaos .ck-inner{max-width:1240px;margin:0 auto;text-align:center}',
'#tsChaos .ck-eyebrow{font-size:.72rem;letter-spacing:.24em;text-transform:uppercase;color:var(--champ);font-weight:600;margin-bottom:12px}',
'#tsChaos .ck-title{font-family:'+LINEAL+';font-size:clamp(1.9rem,4.4vw,3rem);line-height:1.08;font-weight:600;letter-spacing:-.02em;margin:0 0 clamp(22px,3vw,36px);color:#fff}',
'#tsChaos .ck-title span{color:var(--champ)}',
'#tsChaos .ck-stage{position:relative;height:clamp(340px,40vw,420px);margin:0 auto}',
/* Act1 windows */
'#tsChaos .ck-win{position:absolute;box-sizing:border-box;border-radius:9px;overflow:hidden;background:#1b1d28;border:1px solid rgba(255,255,255,.16);box-shadow:0 10px 24px rgba(0,0,0,.55);filter:grayscale(.35) brightness(1);opacity:0;transition:left .95s cubic-bezier(.5,0,.2,1),top .95s cubic-bezier(.5,0,.2,1),transform .95s cubic-bezier(.5,0,.2,1),opacity .7s ease,filter .7s ease}',
'#tsChaos.is-chaos .ck-win{opacity:1;animation:tsChaosJit 3.6s ease-in-out infinite}',
'#tsChaos .ck-win__bar{display:flex;align-items:center;gap:5px;padding:6px 9px;font-size:.62rem;font-weight:600;color:rgba(255,255,255,.7)}',
'#tsChaos .ck-win__bar i{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.25);display:inline-block}',
'#tsChaos .ck-win__body{padding:8px 10px 11px}',
'#tsChaos .ck-row{height:6px;border-radius:3px;background:rgba(255,255,255,.13);margin:5px 0}',
'#tsChaos .ck-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:3px}',
'#tsChaos .ck-cell{height:11px;border-radius:2px;background:rgba(255,255,255,.09)}',
'#tsChaos .ck-cell.r{background:rgba(227,37,82,.5)}',
'#tsChaos .ck-bub{max-width:78%;padding:5px 8px;border-radius:9px;font-size:.55rem;color:rgba(255,255,255,.6);background:rgba(255,255,255,.09);margin:5px 0}',
'#tsChaos .ck-bub.me{margin-left:auto;background:rgba(199,180,137,.16)}',
'#tsChaos .ck-dots{letter-spacing:2px;color:rgba(255,255,255,.4);font-size:.7rem}',
'#tsChaos .ck-win--excel .ck-win__bar{background:#1e6b45}',
'#tsChaos .ck-win--word .ck-win__bar{background:#2a4b8d}',
'#tsChaos .ck-win--chat .ck-win__bar{background:#3a3550}',
'#tsChaos .ck-win--pass .ck-win__bar{background:#5a3a3a}',
'#tsChaos .ck-win--cal .ck-win__bar{background:#8d3a2a}',
'#tsChaos .ck-win--mail .ck-win__bar{background:#2a5a6b}',
'#tsChaos .ck-win--note{background:#e9d27a;border-color:#d8be5c;color:#4a3d12}',
'#tsChaos .ck-win--note .ck-win__bar{color:#4a3d12}',
'#tsChaos .ck-win--note .ck-row{background:rgba(74,61,18,.28)}',
'#tsChaos .ck-win--head{background:#15161d;display:flex;align-items:center;justify-content:center}',
'#tsChaos .ck-head__glyph{width:34px;height:34px;color:rgba(255,255,255,.55)}',
'#tsChaos .ck-head__q{color:var(--champ);font-weight:700;font-size:.82rem;margin-top:4px}',
'#tsChaos.is-converge .ck-win,#tsChaos.is-hub .ck-win,#tsChaos.is-dishes .ck-win{left:50%!important;top:42%!important;transform:translate(-50%,-50%) scale(.22) rotate(0)!important;opacity:0!important;animation:none!important}',
'@keyframes tsChaosJit{0%,100%{transform:translate(0,0) rotate(var(--r))}33%{transform:translate(2px,-3px) rotate(calc(var(--r) + 1deg))}66%{transform:translate(-2px,2px) rotate(calc(var(--r) - .8deg))}}',
/* Act2/3 panel */
'#tsChaos .ck-np{position:absolute;left:50%;top:50%;width:min(680px,92%);transform:translate(-50%,-50%) scale(.7);opacity:0;pointer-events:none;background:rgba(12,13,18,.96);border:1px solid rgba(199,180,137,.42);border-radius:16px;box-shadow:0 0 0 0 rgba(199,180,137,.3),0 30px 70px rgba(0,0,0,.6);transition:opacity .7s ease,transform .8s cubic-bezier(.16,1,.3,1),width .8s cubic-bezier(.16,1,.3,1);overflow:hidden}',
'#tsChaos.is-hub .ck-np{opacity:1;transform:translate(-50%,-50%) scale(1);animation:tsChaosPulse 2.8s ease-in-out infinite}',
'#tsChaos.is-dishes .ck-np{opacity:1;transform:translate(-50%,-50%) scale(1);width:min(1180px,100%);animation:none}',
'#tsChaos .ck-np__bar{display:flex;align-items:center;gap:8px;padding:11px 16px;border-bottom:1px solid rgba(255,255,255,.08)}',
'#tsChaos .ck-np__dot{width:11px;height:11px;border-radius:50%;background:var(--champ);box-shadow:0 0 16px 3px rgba(199,180,137,.6)}',
'#tsChaos .ck-np__t{font-weight:700;font-size:.98rem}',
'#tsChaos .ck-np__t b{color:var(--champ);font-weight:700}',
'#tsChaos .ck-np__pill{margin-left:auto;font-size:.6rem;letter-spacing:.12em;text-transform:uppercase;color:#05060b;background:var(--champ);padding:3px 9px;border-radius:9999px;font-weight:700}',
'@keyframes tsChaosPulse{0%,100%{box-shadow:0 0 0 0 rgba(199,180,137,.28),0 30px 70px rgba(0,0,0,.6)}50%{box-shadow:0 0 40px 9px rgba(199,180,137,.13),0 30px 70px rgba(0,0,0,.6)}}',
'#tsChaos .ck-np__rows{padding:16px 18px 20px;display:grid;gap:11px;transition:opacity .4s ease,max-height .6s ease,padding .6s ease}',
'#tsChaos .ck-np__rowline{display:flex;align-items:center;gap:11px}',
'#tsChaos .ck-np__rowline i{width:9px;height:9px;border-radius:50%;background:var(--green);flex:none}',
'#tsChaos .ck-np__rowline span{height:8px;border-radius:4px;background:rgba(255,255,255,.14)}',
'#tsChaos.is-dishes .ck-np__rows{opacity:0;max-height:0;padding:0 18px;overflow:hidden}',
'#tsChaos .ck-np__dishes{display:flex;gap:clamp(6px,1vw,16px);justify-content:center;align-items:flex-end;padding:0 12px;max-height:0;opacity:0;overflow:hidden;transition:opacity .6s ease .1s,max-height .7s ease,padding .6s ease}',
'#tsChaos.is-dishes .ck-np__dishes{opacity:1;max-height:380px;padding:14px 14px 20px}',
'#tsChaos .ck-dish{margin:0;flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:center;opacity:0;transform:translateY(20px);transition:opacity .6s ease,transform .6s cubic-bezier(.16,1,.3,1)}',
'#tsChaos.is-dishes .ck-dish{opacity:1;transform:none}',
'#tsChaos.is-dishes .ck-dish:nth-child(1){transition-delay:.05s}#tsChaos.is-dishes .ck-dish:nth-child(2){transition-delay:.13s}#tsChaos.is-dishes .ck-dish:nth-child(3){transition-delay:.21s}#tsChaos.is-dishes .ck-dish:nth-child(4){transition-delay:.29s}#tsChaos.is-dishes .ck-dish:nth-child(5){transition-delay:.37s}#tsChaos.is-dishes .ck-dish:nth-child(6){transition-delay:.45s}',
'#tsChaos .ck-dish__imgwrap{width:100%;border-radius:12px;overflow:hidden;position:relative;line-height:0}',
'#tsChaos .ck-dish__imgwrap img{width:100%;height:auto;display:block}',
'#tsChaos .ck-dish--bad .ck-dish__imgwrap{box-shadow:0 0 0 1px rgba(227,37,82,.5),0 0 26px rgba(227,37,82,.28)}',
'#tsChaos .ck-dish--good .ck-dish__imgwrap{box-shadow:0 0 0 1px rgba(143,203,170,.45),0 0 22px rgba(143,203,170,.18)}',
'#tsChaos .ck-dish__name{font-size:clamp(.62rem,1vw,.8rem);color:rgba(255,255,255,.8);margin:9px 0 5px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}',
'#tsChaos .ck-dish__badge{font-size:clamp(.8rem,1.5vw,1.15rem);font-weight:700;font-variant-numeric:tabular-nums;padding:3px 10px;border-radius:9999px}',
'#tsChaos .ck-badge--bad{color:var(--red);background:rgba(227,37,82,.14)}',
'#tsChaos .ck-badge--good{color:#062017;background:var(--green)}',
'#tsChaos .ck-caption{max-width:720px;margin:clamp(22px,3vw,32px) auto 0;font-size:1.02rem;line-height:1.5;color:rgba(255,255,255,.84);min-height:3em;transition:opacity .35s ease}',
'#tsChaos .ck-replay{margin-top:18px;padding:9px 20px;border-radius:9999px;cursor:pointer;background:var(--champ);color:#05060b;border:0;font-weight:600;font-size:.86rem}',
'#tsChaos .ck-replay:hover{background:var(--champ-lite)}',
'#tsChaos .ck-note{margin-top:9px;font-size:.72rem;color:rgba(255,255,255,.38)}',
'@media(max-width:720px){#tsChaos .ck-np__dishes{flex-wrap:wrap}#tsChaos .ck-dish{flex:0 0 30%}#tsChaos .ck-stage{height:400px}}',
'@media(prefers-reduced-motion:reduce){#tsChaos .ck-win,#tsChaos .ck-np{animation:none!important}}'
    ].join('\n');
    document.head.appendChild(s);
  }

  var WINS=''+
  '<div class="ck-win ck-win--excel" style="left:0%;top:5%;width:216px;--r:-3deg"><div class="ck-win__bar"><i></i>Kalkulation.xlsx</div><div class="ck-win__body"><div class="ck-grid"><div class="ck-cell"></div><div class="ck-cell"></div><div class="ck-cell r"></div><div class="ck-cell"></div><div class="ck-cell"></div><div class="ck-cell r"></div><div class="ck-cell"></div><div class="ck-cell"></div><div class="ck-cell"></div><div class="ck-cell"></div><div class="ck-cell"></div><div class="ck-cell r"></div></div></div></div>'+
  '<div class="ck-win ck-win--chat" style="left:21%;top:2%;width:210px;--r:2deg"><div class="ck-win__bar"><i></i>KI-Tool</div><div class="ck-win__body"><div class="ck-bub">Was kostet mein Gericht?</div><div class="ck-bub me">Bitte Daten angeben…</div><div class="ck-bub">???</div></div></div>'+
  '<div class="ck-win ck-win--pass" style="left:43%;top:6%;width:198px;--r:-2deg"><div class="ck-win__bar"><i></i>Passwörter</div><div class="ck-win__body"><div class="ck-dots">••••••••</div><div class="ck-dots">••••••</div><div class="ck-dots">•••••••••</div></div></div>'+
  '<div class="ck-win ck-win--cal" style="left:62%;top:3%;width:194px;--r:3deg"><div class="ck-win__bar"><i></i>Kalender</div><div class="ck-win__body"><div class="ck-grid"><div class="ck-cell"></div><div class="ck-cell"></div><div class="ck-cell"></div><div class="ck-cell"></div><div class="ck-cell"></div><div class="ck-cell r"></div><div class="ck-cell"></div><div class="ck-cell"></div></div></div></div>'+
  '<div class="ck-win ck-win--note" style="left:81%;top:7%;width:176px;--r:-4deg"><div class="ck-win__bar">Notizzettel</div><div class="ck-win__body"><div class="ck-row" style="width:85%"></div><div class="ck-row" style="width:65%"></div><div class="ck-row" style="width:75%"></div></div></div>'+
  '<div class="ck-win ck-win--word" style="left:6%;top:48%;width:206px;--r:4deg"><div class="ck-win__bar"><i></i>Rezepte.docx</div><div class="ck-win__body"><div class="ck-row" style="width:90%"></div><div class="ck-row" style="width:70%"></div><div class="ck-row" style="width:82%"></div><div class="ck-row" style="width:55%"></div></div></div>'+
  '<div class="ck-win ck-win--excel" style="left:27%;top:52%;width:198px;--r:-3deg"><div class="ck-win__bar"><i></i>Preise_2024.xlsx</div><div class="ck-win__body"><div class="ck-grid"><div class="ck-cell"></div><div class="ck-cell r"></div><div class="ck-cell"></div><div class="ck-cell"></div><div class="ck-cell r"></div><div class="ck-cell"></div><div class="ck-cell"></div><div class="ck-cell r"></div></div></div></div>'+
  '<div class="ck-win ck-win--mail" style="left:48%;top:49%;width:202px;--r:2deg"><div class="ck-win__bar"><i></i>Posteingang</div><div class="ck-win__body"><div class="ck-row" style="width:78%"></div><div class="ck-row" style="width:88%"></div><div class="ck-row" style="width:64%"></div></div></div>'+
  '<div class="ck-win ck-win--note" style="left:68%;top:53%;width:180px;--r:-5deg"><div class="ck-win__bar">Zettel</div><div class="ck-win__body"><div class="ck-row" style="width:70%"></div><div class="ck-row" style="width:88%"></div></div></div>'+
  '<div class="ck-win ck-win--head" style="left:86%;top:47%;width:146px;height:118px;--r:4deg"><div style="text-align:center"><svg class="ck-head__glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"></circle><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"></path></svg><div class="ck-head__q">Wissen im Kopf</div></div></div>';

  function dishesHtml(){
    return DISHES.map(function(d){
      return '<figure class="ck-dish ck-dish--'+d.k+'">'+
        '<div class="ck-dish__imgwrap"><img src="'+IMG(d.slug)+'" alt="'+d.name+'" loading="lazy"></div>'+
        '<figcaption class="ck-dish__name">'+d.name+'</figcaption>'+
        '<div class="ck-dish__badge ck-badge--'+d.k+'" data-target="'+d.v+'">0,00 €</div>'+
      '</figure>';
    }).join('');
  }

  function build(){
    var root=document.createElement('section');
    root.id='tsChaos'; root.className='ck-stage-wrap';
    root.innerHTML=''+
      '<div class="ck-inner">'+
        '<div class="ck-eyebrow">Warum ein System</div>'+
        '<h2 class="ck-title">Vom Chaos zur <span>Klarheit.</span></h2>'+
        '<div class="ck-stage">'+
          WINS+
          '<div class="ck-np">'+
            '<div class="ck-np__bar"><span class="ck-np__dot"></span><span class="ck-np__t">Notion <b>+ Claude Code</b></span><span class="ck-np__pill">Ein Ort</span></div>'+
            '<div class="ck-np__rows"><div class="ck-np__rowline"><i></i><span style="width:70%"></span></div><div class="ck-np__rowline"><i></i><span style="width:84%"></span></div><div class="ck-np__rowline"><i></i><span style="width:60%"></span></div><div class="ck-np__rowline"><i></i><span style="width:76%"></span></div></div>'+
            '<div class="ck-np__dishes">'+dishesHtml()+'</div>'+
          '</div>'+
        '</div>'+
        '<p class="ck-caption">Heute: verstreut in Excel, Word, mehreren Tools — Wissen in Köpfen, Dokumente und Passwörter überall.</p>'+
        '<button class="ck-replay" type="button">↻ Nochmal abspielen</button>'+
        '<p class="ck-note">Beispielwerte zur Illustration.</p>'+
      '</div>';
    return root;
  }

  var CAPS={
    chaos:'Heute: verstreut in Excel, Word, mehreren Tools — Wissen in Köpfen, Dokumente und Passwörter überall.',
    hub:'Notion mit Claude Code zieht alles an einen Ort. Ein System, statt zehn Inseln.',
    dishes:'Und im Backoffice siehst du es für jedes Gericht: welches trägt sich — und welches kostet dich bei jedem Verkauf Geld?'
  };
  function fmt(v){ return (v<0?'−':'+')+Math.abs(v).toFixed(2).replace('.',',')+' €'; }
  function count(el){
    var t=parseFloat(el.getAttribute('data-target')),s=null,d=900,done=false;
    function step(ts){ if(done)return; if(!s)s=ts; var p=Math.min(1,(ts-s)/d),e=1-Math.pow(1-p,3);
      el.textContent=fmt(t*e); if(p<1)requestAnimationFrame(step); else { done=true; el.textContent=fmt(t); } }
    requestAnimationFrame(step);
    // Garantie-Endwert, falls rAF gedrosselt wird (Hintergrund-Tab) — Endzustand nie animationsabhängig.
    setTimeout(function(){ done=true; el.textContent=fmt(t); }, d+150);
  }

  function play(root){
    var stage=root.querySelector('.ck-stage'), cap=root.querySelector('.ck-caption');
    function set(c){ stage.parentNode; root.className='ck-stage-wrap '+c; }
    function say(k){ cap.style.opacity=0; setTimeout(function(){ cap.textContent=CAPS[k]; cap.style.opacity=1; },200); }
    function badges(){ root.querySelectorAll('.ck-dish__badge').forEach(function(el,i){ setTimeout(function(){ count(el); },250+i*90); }); }
    if(reduce){
      root.className='ck-stage-wrap is-dishes'; cap.textContent=CAPS.dishes;
      root.querySelectorAll('.ck-dish__badge').forEach(function(el){ el.textContent=fmt(parseFloat(el.getAttribute('data-target'))); });
      return;
    }
    root.className='ck-stage-wrap is-chaos'; say('chaos');
    var tm=[];
    tm.push(setTimeout(function(){ root.className='ck-stage-wrap is-converge'; },3200));
    tm.push(setTimeout(function(){ root.className='ck-stage-wrap is-hub'; say('hub'); },4200));
    tm.push(setTimeout(function(){ root.className='ck-stage-wrap is-dishes'; say('dishes'); badges(); },7200));
    root._tm=tm;
  }

  function inView(el){ var r=el.getBoundingClientRect(); return r.top<(innerHeight*0.85)&&r.bottom>0; }

  function arm(root){
    var played=false;
    function go(){ if(played)return; played=true; play(root); }
    root.querySelector('.ck-replay').addEventListener('click',function(){
      if(root._tm)root._tm.forEach(clearTimeout);
      played=false; go();
    });
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(ev){ if(ev[0].isIntersecting){ go(); io.disconnect(); } },{threshold:.3});
      io.observe(root);
    }
    if(inView(root)) go();
    var poll=setInterval(function(){ if(!document.body.contains(root)){ clearInterval(poll); return; } if(inView(root)){ go(); clearInterval(poll); } },250);
    setTimeout(function(){ clearInterval(poll); },20000);
  }

  function anchor(){
    // Phrase-first: Absatz "...ein gut laufender Salat den Schnitt rettet." -> danach einsetzen.
    var scope=document.querySelector('.page__mehrwert-zielbild')||document;
    var ps=scope.querySelectorAll('.notion-text, p');
    var after=null, before=null;
    for(var i=0;i<ps.length;i++){
      var t=(ps[i].textContent||'');
      if(!after && /gut laufender Salat den Schnitt rettet/.test(t)) after=ps[i];
      if(!before && /^Genau das ändern wir/.test(t.trim())) before=ps[i];
    }
    return {after:after, before:before};
  }

  function mount(){
    if(!on()){ var ex=document.getElementById('tsChaos'); if(ex)ex.remove(); return; }
    if(document.getElementById('tsChaos')) return;
    var a=anchor();
    var target=a.after||a.before; if(!target) return;
    css();
    var root=build();
    if(a.after){ target.parentNode.insertBefore(root, target.nextSibling); }
    else { target.parentNode.insertBefore(root, target); }
    arm(root);
  }

  mount();
  document.addEventListener('DOMContentLoaded', mount);
  var _mt=null;
  new MutationObserver(function(){ if(_mt)return; _mt=setTimeout(function(){ _mt=null; mount(); },300); })
    .observe(document.documentElement,{childList:true,subtree:true});
})();
