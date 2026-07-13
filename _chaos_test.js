
/* =========================================================================
   Chaos -> Klarheit  (mehrwert-zielbild)  ·  #tsChaos
   Full-Width-Widget unter "Warum du das ueberhaupt brauchst.":
   Panel ploppt auf (Notion-Logo + Claude-Code-Logo) -> echte Gerichte mit
   Deckungs-Verdikt (Beispielwerte). Kein Band-Hintergrund (nahtloser Guss
   mit der Seite). Guard window.__tsChaos · Pfad /mehrwert-zielbild.
   ========================================================================= */
(function(){
  if(window.__tsChaos) return; window.__tsChaos = true;
  function on(){ return /\/mehrwert-zielbild\/?$/.test(location.pathname); }
  var LINEAL='"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif';
  var BASE=(window.__tsChaosBase)||'https://tastyrob123.github.io/kurs/img/mehrwert/';
  function IMG(slug){ return BASE+slug+'.jpg'; }
  var NOTION_SVG='<svg viewBox="0 0 24 24" width="27" height="27" fill="#fff" aria-hidden="true"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/></svg>';
  var CLAUDE_SVG='<svg viewBox="0 0 24 24" width="26" height="26" fill="#D97757" aria-hidden="true"><path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/></svg>';
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
'  position:relative;width:100vw;max-width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);',
'  box-sizing:border-box;padding:clamp(24px,3vw,44px) clamp(16px,3vw,44px) clamp(20px,3vw,40px);',
'  color:#fff;overflow:hidden;background:transparent;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",sans-serif;}',
'#tsChaos .ck-inner{max-width:1240px;margin:0 auto;text-align:center}',
'#tsChaos .ck-title{font-family:'+LINEAL+';font-size:clamp(1.9rem,4.4vw,3rem);line-height:1.08;font-weight:600;letter-spacing:-.02em;margin:0 0 clamp(22px,3vw,34px);color:#fff}',
'#tsChaos .ck-title span{color:var(--champ)}',
/* Panel */
'#tsChaos .ck-np{position:relative;margin:0 auto;width:min(640px,94%);opacity:0;transform:scale(.86) translateY(12px);',
'  background:rgba(12,13,18,.96);border:1px solid rgba(199,180,137,.42);border-radius:16px;',
'  box-shadow:0 0 0 0 rgba(199,180,137,.3),0 30px 70px rgba(0,0,0,.6);overflow:hidden;',
'  transition:opacity .7s ease,transform .8s cubic-bezier(.16,1,.3,1),width .8s cubic-bezier(.16,1,.3,1)}',
'#tsChaos.is-intro .ck-np{opacity:1;transform:none;animation:tsChaosPulse 2.8s ease-in-out infinite}',
'#tsChaos.is-dishes .ck-np{opacity:1;transform:none;width:min(1180px,100%);animation:none}',
'@keyframes tsChaosPulse{0%,100%{box-shadow:0 0 0 0 rgba(199,180,137,.28),0 30px 70px rgba(0,0,0,.6)}50%{box-shadow:0 0 40px 9px rgba(199,180,137,.13),0 30px 70px rgba(0,0,0,.6)}}',
/* Logo-Header */
'#tsChaos .ck-np__bar{display:flex;align-items:center;justify-content:center;gap:clamp(16px,2.4vw,30px);padding:16px 18px;border-bottom:1px solid rgba(255,255,255,.08)}',
'#tsChaos .ck-logo,#tsChaos .ck-plus{display:inline-flex;align-items:center;opacity:0;transform:scale(.4)}',
'#tsChaos .ck-logo{gap:9px;font-weight:700;font-size:clamp(.95rem,1.8vw,1.18rem);color:#fff}',
'#tsChaos .ck-logo svg{display:block}',
'#tsChaos .ck-logo--claude{color:#e7c9ba}',
'#tsChaos .ck-plus{font-size:clamp(1.2rem,2.4vw,1.7rem);font-weight:400;color:var(--champ)}',
'#tsChaos.ck-lit .ck-logo--notion{animation:tsChaosPop .5s .12s both}',
'#tsChaos.ck-lit .ck-plus{animation:tsChaosPop .5s .30s both}',
'#tsChaos.ck-lit .ck-logo--claude{animation:tsChaosPop .5s .48s both}',
'@keyframes tsChaosPop{0%{opacity:0;transform:scale(.4)}60%{opacity:1;transform:scale(1.12)}100%{opacity:1;transform:scale(1)}}',
/* Act A: tidy rows */
'#tsChaos .ck-np__rows{padding:16px 18px 20px;display:grid;gap:11px;transition:opacity .4s ease,max-height .6s ease,padding .6s ease}',
'#tsChaos .ck-np__rowline{display:flex;align-items:center;gap:11px}',
'#tsChaos .ck-np__rowline i{width:9px;height:9px;border-radius:50%;background:var(--green);flex:none}',
'#tsChaos .ck-np__rowline span{height:8px;border-radius:4px;background:rgba(255,255,255,.14)}',
'#tsChaos.is-dishes .ck-np__rows{opacity:0;max-height:0;padding:0 18px;overflow:hidden}',
/* Act B: dishes */
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
'#tsChaos .ck-caption{max-width:720px;margin:clamp(20px,3vw,30px) auto 0;font-size:1.02rem;line-height:1.5;color:rgba(255,255,255,.84);min-height:3em;transition:opacity .35s ease}',
'#tsChaos .ck-replay{margin-top:16px;padding:9px 20px;border-radius:9999px;cursor:pointer;background:var(--champ);color:#05060b;border:0;font-weight:600;font-size:.86rem}',
'#tsChaos .ck-replay:hover{background:var(--champ-lite)}',
'@media(max-width:720px){#tsChaos .ck-np__dishes{flex-wrap:wrap}#tsChaos .ck-dish{flex:0 0 30%}}',
'@media(prefers-reduced-motion:reduce){#tsChaos .ck-np{animation:none!important}#tsChaos .ck-logo,#tsChaos .ck-plus{animation:none!important;opacity:1!important;transform:none!important}}'
    ].join('\n');
    document.head.appendChild(s);
  }

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
    root.id='tsChaos'; root.className='ck-wrap';
    root.innerHTML=''+
      '<div class="ck-inner">'+
        '<h2 class="ck-title">Vom Chaos zur <span>Klarheit.</span></h2>'+
        '<div class="ck-np">'+
          '<div class="ck-np__bar">'+
            '<span class="ck-logo ck-logo--notion">'+NOTION_SVG+'<span>Notion</span></span>'+
            '<span class="ck-plus">+</span>'+
            '<span class="ck-logo ck-logo--claude">'+CLAUDE_SVG+'<span>Claude Code</span></span>'+
          '</div>'+
          '<div class="ck-np__rows"><div class="ck-np__rowline"><i></i><span style="width:70%"></span></div><div class="ck-np__rowline"><i></i><span style="width:84%"></span></div><div class="ck-np__rowline"><i></i><span style="width:60%"></span></div><div class="ck-np__rowline"><i></i><span style="width:76%"></span></div></div>'+
          '<div class="ck-np__dishes">'+dishesHtml()+'</div>'+
        '</div>'+
        '<p class="ck-caption">Notion mit Claude Code zieht alles an einen Ort — dein ganzes Backoffice, ein System.</p>'+
        '<button class="ck-replay" type="button">↻ Nochmal abspielen</button>'+
      '</div>';
    return root;
  }

  var CAPS={
    intro:'Notion mit Claude Code zieht alles an einen Ort — dein ganzes Backoffice, ein System.',
    dishes:'Und im Backoffice siehst du es für jedes Gericht: welches trägt sich — und welches kostet dich bei jedem Verkauf Geld?'
  };
  function fmt(v){ return (v<0?'−':'+')+Math.abs(v).toFixed(2).replace('.',',')+' €'; }
  function count(el){
    var t=parseFloat(el.getAttribute('data-target')),s=null,d=900,done=false;
    function step(ts){ if(done)return; if(!s)s=ts; var p=Math.min(1,(ts-s)/d),e=1-Math.pow(1-p,3);
      el.textContent=fmt(t*e); if(p<1)requestAnimationFrame(step); else { done=true; el.textContent=fmt(t); } }
    requestAnimationFrame(step);
    setTimeout(function(){ done=true; el.textContent=fmt(t); }, d+150);
  }

  function play(root){
    var cap=root.querySelector('.ck-caption');
    function say(k){ cap.style.opacity=0; setTimeout(function(){ cap.textContent=CAPS[k]; cap.style.opacity=1; },200); }
    function badges(){ root.querySelectorAll('.ck-dish__badge').forEach(function(el,i){ setTimeout(function(){ count(el); },250+i*90); }); }
    root.classList.add('ck-lit');
    if(reduce){
      root.className='ck-wrap ck-lit is-dishes'; cap.textContent=CAPS.dishes;
      root.querySelectorAll('.ck-dish__badge').forEach(function(el){ el.textContent=fmt(parseFloat(el.getAttribute('data-target'))); });
      return;
    }
    root.className='ck-wrap ck-lit is-intro'; cap.textContent=CAPS.intro;
    var tm=[];
    tm.push(setTimeout(function(){ root.className='ck-wrap ck-lit is-dishes'; say('dishes'); badges(); },2600));
    root._tm=tm;
  }

  function inView(el){ var r=el.getBoundingClientRect(); return r.top<(innerHeight*0.85)&&r.bottom>0; }

  function arm(root){
    var played=false;
    function go(){ if(played)return; played=true; play(root); }
    root.querySelector('.ck-replay').addEventListener('click',function(){
      if(root._tm)root._tm.forEach(clearTimeout);
      root.className='ck-wrap'; played=false;
      // Neustart: kurz zuruecksetzen, dann abspielen (Pop erneut).
      void root.offsetWidth; go();
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
