
/* =========================================================================
   Chaos -> Klarheit  (mehrwert-zielbild)  ·  #tsChaos
   Full-Width-Widget unter "Warum du das ueberhaupt brauchst.":
   Panel ploppt auf (Notion + Claude Code Logos) -> pro Gericht eine kleine
   DeckungsbeitragsRechnung (VK, Wareneinsatz, DB I-III) -> Pfeile mit
   Stueckzahlen (3 Monate) -> Abschluss-Rechnung: Gewinn oder Verlust.
   Spielt einmal beim Reinscrollen, bleibt dann stehen (kein Replay).
   Alle Zahlen BEISPIELWERTE. Guard window.__tsChaos · Pfad /mehrwert-zielbild.
   ========================================================================= */
(function(){
  if(window.__tsChaos) return; window.__tsChaos = true;
  function on(){ return /\/mehrwert-zielbild\/?$/.test(location.pathname); }
  var LINEAL='"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif';
  var BASE=(window.__tsChaosBase)||'https://tastyrob123.github.io/kurs/img/mehrwert/';
  function IMG(slug){ return BASE+slug+'.jpg'; }
  var NOTION_SVG='<svg viewBox="0 0 24 24" width="26" height="26" fill="#fff" aria-hidden="true"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/></svg>';
  var CLAUDE_SVG='<svg viewBox="0 0 24 24" width="25" height="25" fill="#D97757" aria-hidden="true"><path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/></svg>';

  // === BEISPIELWERTE (SSOT: Lektion 3.2). Intern konsistent:
  //     DB I = VK - Wareneinsatz · DB II = DB I - Gemeinkosten · DB III = DB II - Personalkosten.
  //     units = verkaufte Portionen letzte 3 Monate.
  var DISHES=[
    {slug:'rinderfilet',       name:'Rinderfilet',       vk:28.00, we:12.60, db1:15.40, db2:8.90, db3:-0.40, units:210},
    {slug:'rote-bete-risotto', name:'Rote-Bete-Risotto', vk:16.50, we: 3.80, db1:12.70, db2:8.50, db3: 3.20, units:540},
    {slug:'lammkarree',        name:'Lammkarree',        vk:32.00, we:15.40, db1:16.60, db2:9.50, db3:-0.90, units:160},
    {slug:'kuerbis-veloute',   name:'Kürbis-Velouté',    vk:12.00, we: 2.40, db1: 9.60, db2:6.50, db3: 2.80, units:480},
    {slug:'pilz-ravioli',      name:'Pilz-Ravioli',      vk:17.50, we: 4.90, db1:12.60, db2:8.30, db3: 2.40, units:420},
    {slug:'gemuese-steak',     name:'Gemüse-Steak',      vk:15.00, we: 3.20, db1:11.80, db2:8.00, db3: 3.60, units:500}
  ];
  function totals(){
    var t={netto:0,we:0,gemein:0,personal:0,erg:0,units:0};
    DISHES.forEach(function(d){
      t.netto    += d.vk*d.units;
      t.we       += d.we*d.units;
      t.gemein   += (d.db1-d.db2)*d.units;
      t.personal += (d.db2-d.db3)*d.units;
      t.erg      += d.db3*d.units;
      t.units    += d.units;
    });
    return t;
  }
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  // Deutsche Zahl: Tausenderpunkt, Komma-Dezimal.
  function eur(v,plus){
    var neg=v<0; v=Math.abs(v);
    var p=v.toFixed(2).split('.');
    p[0]=p[0].replace(/\B(?=(\d{3})+(?!\d))/g,'.');
    return (neg?'−':(plus&&v!==0?'+':''))+p[0]+','+p[1]+' €';
  }
  function intf(v){ return Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.'); }

  function css(){
    if(document.getElementById('tsChaosStyle')) return;
    var s=document.createElement('style'); s.id='tsChaosStyle';
    s.textContent=[
'#tsChaos{--champ:#c7b489;--champ-lite:#d8c9ab;--red:#e32552;--green:#8FCBAA;',
'  position:relative;width:100vw;max-width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);',
'  box-sizing:border-box;padding:clamp(24px,3vw,44px) clamp(16px,3vw,44px) clamp(24px,3vw,48px);',
'  color:#fff;overflow:hidden;background:transparent;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",sans-serif;}',
'#tsChaos .ck-inner{max-width:1240px;margin:0 auto;text-align:center}',
'#tsChaos .ck-title{font-family:'+LINEAL+';font-size:clamp(1.9rem,4.4vw,3rem);line-height:1.08;font-weight:600;letter-spacing:-.02em;margin:0 0 clamp(20px,3vw,32px);color:#fff}',
'#tsChaos .ck-title span{color:var(--champ)}',
/* Panel */
'#tsChaos .ck-np{position:relative;margin:0 auto;width:min(640px,94%);opacity:0;transform:scale(.86) translateY(12px);',
'  background:rgba(12,13,18,.96);border:1px solid rgba(199,180,137,.42);border-radius:16px;',
'  box-shadow:0 0 0 0 rgba(199,180,137,.3),0 30px 70px rgba(0,0,0,.6);overflow:hidden;',
'  transition:opacity .7s ease,transform .8s cubic-bezier(.16,1,.3,1),width .8s cubic-bezier(.16,1,.3,1)}',
'#tsChaos.is-intro .ck-np{opacity:1;transform:none;animation:tsChaosPulse 2.8s ease-in-out infinite}',
'#tsChaos.is-dishes .ck-np,#tsChaos.is-flow .ck-np,#tsChaos.is-result .ck-np{opacity:1;transform:none;width:min(1180px,100%);animation:none}',
'@keyframes tsChaosPulse{0%,100%{box-shadow:0 0 0 0 rgba(199,180,137,.28),0 30px 70px rgba(0,0,0,.6)}50%{box-shadow:0 0 40px 9px rgba(199,180,137,.13),0 30px 70px rgba(0,0,0,.6)}}',
/* Logo-Header */
'#tsChaos .ck-np__bar{display:flex;align-items:center;justify-content:center;gap:clamp(16px,2.4vw,30px);padding:15px 18px;border-bottom:1px solid rgba(255,255,255,.08)}',
'#tsChaos .ck-logo,#tsChaos .ck-plus{display:inline-flex;align-items:center;opacity:0;transform:scale(.4)}',
'#tsChaos .ck-logo{gap:9px;font-weight:700;font-size:clamp(.92rem,1.7vw,1.14rem);color:#fff}',
'#tsChaos .ck-logo svg{display:block}',
'#tsChaos .ck-logo--claude{color:#e7c9ba}',
'#tsChaos .ck-plus{font-size:clamp(1.2rem,2.4vw,1.7rem);font-weight:400;color:var(--champ)}',
'#tsChaos.ck-lit .ck-logo--notion{animation:tsChaosPop .5s .12s both}',
'#tsChaos.ck-lit .ck-plus{animation:tsChaosPop .5s .30s both}',
'#tsChaos.ck-lit .ck-logo--claude{animation:tsChaosPop .5s .48s both}',
'@keyframes tsChaosPop{0%{opacity:0;transform:scale(.4)}60%{opacity:1;transform:scale(1.12)}100%{opacity:1;transform:scale(1)}}',
/* intro rows */
'#tsChaos .ck-np__rows{padding:16px 18px 20px;display:grid;gap:11px;transition:opacity .35s ease,max-height .5s ease,padding .5s ease}',
'#tsChaos .ck-np__rowline{display:flex;align-items:center;gap:11px}',
'#tsChaos .ck-np__rowline i{width:9px;height:9px;border-radius:50%;background:var(--green);flex:none}',
'#tsChaos .ck-np__rowline span{height:8px;border-radius:4px;background:rgba(255,255,255,.14)}',
'#tsChaos.is-dishes .ck-np__rows,#tsChaos.is-flow .ck-np__rows,#tsChaos.is-result .ck-np__rows{opacity:0;max-height:0;padding:0 18px;overflow:hidden}',
/* dishes */
'#tsChaos .ck-np__dishes{display:flex;gap:clamp(6px,1vw,14px);justify-content:center;align-items:flex-start;padding:0 12px;max-height:0;opacity:0;overflow:hidden;transition:opacity .5s ease .1s,max-height .6s ease,padding .5s ease}',
'#tsChaos.is-dishes .ck-np__dishes,#tsChaos.is-flow .ck-np__dishes,#tsChaos.is-result .ck-np__dishes{opacity:1;max-height:600px;padding:16px 14px 18px}',
'#tsChaos .ck-dish{margin:0;flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:stretch;opacity:0;transform:translateY(18px);transition:opacity .55s ease,transform .55s cubic-bezier(.16,1,.3,1)}',
'#tsChaos.is-dishes .ck-dish,#tsChaos.is-flow .ck-dish,#tsChaos.is-result .ck-dish{opacity:1;transform:none}',
'#tsChaos.is-dishes .ck-dish:nth-child(1),#tsChaos.is-flow .ck-dish:nth-child(1),#tsChaos.is-result .ck-dish:nth-child(1){transition-delay:.05s}',
'#tsChaos.is-dishes .ck-dish:nth-child(2),#tsChaos.is-flow .ck-dish:nth-child(2),#tsChaos.is-result .ck-dish:nth-child(2){transition-delay:.13s}',
'#tsChaos.is-dishes .ck-dish:nth-child(3),#tsChaos.is-flow .ck-dish:nth-child(3),#tsChaos.is-result .ck-dish:nth-child(3){transition-delay:.21s}',
'#tsChaos.is-dishes .ck-dish:nth-child(4),#tsChaos.is-flow .ck-dish:nth-child(4),#tsChaos.is-result .ck-dish:nth-child(4){transition-delay:.29s}',
'#tsChaos.is-dishes .ck-dish:nth-child(5),#tsChaos.is-flow .ck-dish:nth-child(5),#tsChaos.is-result .ck-dish:nth-child(5){transition-delay:.37s}',
'#tsChaos.is-dishes .ck-dish:nth-child(6),#tsChaos.is-flow .ck-dish:nth-child(6),#tsChaos.is-result .ck-dish:nth-child(6){transition-delay:.45s}',
'#tsChaos .ck-dish__imgwrap{width:100%;border-radius:11px;overflow:hidden;line-height:0}',
'#tsChaos .ck-dish__imgwrap img{width:100%;height:auto;display:block}',
'#tsChaos .ck-dish--bad .ck-dish__imgwrap{box-shadow:0 0 0 1px rgba(227,37,82,.5),0 0 22px rgba(227,37,82,.25)}',
'#tsChaos .ck-dish--good .ck-dish__imgwrap{box-shadow:0 0 0 1px rgba(143,203,170,.42),0 0 18px rgba(143,203,170,.16)}',
'#tsChaos .ck-dish__name{font-size:clamp(.64rem,1vw,.82rem);color:#fff;margin:8px 0 7px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:center}',
/* per-dish P&L */
'#tsChaos .ck-pl{display:flex;flex-direction:column;gap:2px;font-variant-numeric:tabular-nums}',
'#tsChaos .ck-pl__row{display:flex;justify-content:space-between;align-items:baseline;gap:6px;font-size:clamp(.55rem,.85vw,.68rem);padding:2px 3px;border-radius:4px}',
'#tsChaos .ck-pl__row span{color:rgba(255,255,255,.5)}',
'#tsChaos .ck-pl__row b{font-weight:600;color:rgba(255,255,255,.9)}',
'#tsChaos .ck-pl__we b{color:rgba(255,255,255,.55)}',
'#tsChaos .ck-pl__db3{margin-top:3px;border-top:1px solid rgba(255,255,255,.1);padding-top:5px}',
'#tsChaos .ck-pl__db3 span{color:rgba(255,255,255,.75);font-weight:600}',
'#tsChaos .ck-pl__db3 b{font-size:clamp(.72rem,1.15vw,.92rem)}',
'#tsChaos .ck-dish--good .ck-pl__db3 b{color:var(--green)}',
'#tsChaos .ck-dish--bad .ck-pl__db3 b{color:var(--red)}',
'#tsChaos .ck-dish--good .ck-pl__db3{background:rgba(143,203,170,.08)}',
'#tsChaos .ck-dish--bad .ck-pl__db3{background:rgba(227,37,82,.09)}',
/* flow arrows + units */
'#tsChaos .ck-flow{display:flex;gap:clamp(6px,1vw,14px);justify-content:center;padding:0 clamp(14px,1.5vw,28px);margin-top:2px;opacity:0;max-height:0;overflow:hidden;transition:opacity .5s ease,max-height .6s ease,margin .4s ease}',
'#tsChaos.is-flow .ck-flow,#tsChaos.is-result .ck-flow{opacity:1;max-height:120px;margin-top:10px}',
'#tsChaos .ck-flow__col{flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:center;gap:5px}',
'#tsChaos .ck-flow__arrow{width:2px;height:0;background:linear-gradient(180deg,rgba(199,180,137,.15),var(--champ));transition:height .5s ease;position:relative}',
'#tsChaos.is-flow .ck-flow__arrow,#tsChaos.is-result .ck-flow__arrow{height:20px}',
'#tsChaos .ck-flow__arrow::after{content:"";position:absolute;bottom:-4px;left:50%;transform:translateX(-50%);border-left:4px solid transparent;border-right:4px solid transparent;border-top:6px solid var(--champ)}',
'#tsChaos .ck-flow__u{font-size:clamp(.6rem,1vw,.8rem);font-weight:700;color:var(--champ-lite);font-variant-numeric:tabular-nums}',
'#tsChaos .ck-flow__l{font-size:clamp(.5rem,.8vw,.62rem);color:rgba(255,255,255,.42);margin-top:-2px}',
/* Rechnung */
'#tsChaos .ck-result{max-width:520px;margin:clamp(18px,2.4vw,28px) auto 0;background:rgba(12,13,18,.9);border:1px solid rgba(199,180,137,.36);border-radius:16px;padding:clamp(16px,2vw,24px) clamp(18px,2.4vw,30px);text-align:left;opacity:0;transform:translateY(16px);transition:opacity .6s ease,transform .6s cubic-bezier(.16,1,.3,1)}',
'#tsChaos.is-result .ck-result{opacity:1;transform:none}',
'#tsChaos .ck-result__h{font-size:.62rem;letter-spacing:.2em;text-transform:uppercase;color:var(--champ);font-weight:600;margin-bottom:12px;text-align:center}',
'#tsChaos .ck-rrow{display:flex;justify-content:space-between;align-items:baseline;gap:10px;padding:6px 0;font-size:clamp(.82rem,1.3vw,.98rem);font-variant-numeric:tabular-nums}',
'#tsChaos .ck-rrow span{color:rgba(255,255,255,.66)}',
'#tsChaos .ck-rrow b{font-weight:600;color:#fff}',
'#tsChaos .ck-rrow--cost b{color:rgba(255,255,255,.62)}',
'#tsChaos .ck-rline{height:1px;background:rgba(255,255,255,.14);margin:8px 0}',
'#tsChaos .ck-rfinal{display:flex;justify-content:space-between;align-items:center;gap:10px;padding-top:4px}',
'#tsChaos .ck-rfinal__l{display:flex;flex-direction:column}',
'#tsChaos .ck-rfinal__l span{font-size:.72rem;color:rgba(255,255,255,.6)}',
'#tsChaos .ck-rfinal__l .ck-verdict{font-family:'+LINEAL+';font-weight:600;font-size:clamp(1rem,1.8vw,1.28rem);letter-spacing:.01em}',
'#tsChaos .ck-rfinal__v{font-family:'+LINEAL+';font-weight:600;font-size:clamp(1.5rem,3vw,2.1rem);font-variant-numeric:tabular-nums}',
'#tsChaos.is-win .ck-verdict,#tsChaos.is-win .ck-rfinal__v{color:var(--green)}',
'#tsChaos.is-loss .ck-verdict,#tsChaos.is-loss .ck-rfinal__v{color:var(--red)}',
'#tsChaos .ck-caption{max-width:720px;margin:clamp(16px,2.4vw,26px) auto 0;font-size:1.02rem;line-height:1.5;color:rgba(255,255,255,.84);min-height:2.4em;transition:opacity .35s ease}',
'@media(max-width:820px){#tsChaos .ck-np__dishes{flex-wrap:wrap}#tsChaos .ck-dish{flex:0 0 30%}#tsChaos .ck-flow{display:none}}',
'@media(prefers-reduced-motion:reduce){#tsChaos .ck-np{animation:none!important}#tsChaos .ck-logo,#tsChaos .ck-plus{animation:none!important;opacity:1!important;transform:none!important}}'
    ].join('\n');
    document.head.appendChild(s);
  }

  function dishesHtml(){
    return DISHES.map(function(d){
      var k=d.db3<0?'bad':'good';
      return '<figure class="ck-dish ck-dish--'+k+'">'+
        '<div class="ck-dish__imgwrap"><img src="'+IMG(d.slug)+'" alt="'+d.name+'" loading="lazy"></div>'+
        '<figcaption class="ck-dish__name">'+d.name+'</figcaption>'+
        '<div class="ck-pl">'+
          '<div class="ck-pl__row"><span>VK</span><b>'+eur(d.vk)+'</b></div>'+
          '<div class="ck-pl__row ck-pl__we"><span>Wareneinsatz</span><b>'+eur(-d.we)+'</b></div>'+
          '<div class="ck-pl__row"><span>DB I</span><b>'+eur(d.db1)+'</b></div>'+
          '<div class="ck-pl__row"><span>DB II</span><b>'+eur(d.db2)+'</b></div>'+
          '<div class="ck-pl__row ck-pl__db3"><span>DB III</span><b>'+eur(d.db3,true)+'</b></div>'+
        '</div>'+
      '</figure>';
    }).join('');
  }
  function flowHtml(){
    return DISHES.map(function(d){
      return '<div class="ck-flow__col">'+
        '<div class="ck-flow__arrow"></div>'+
        '<div class="ck-flow__u" data-u="'+d.units+'">0</div>'+
        '<div class="ck-flow__l">verkauft · 3 Mon.</div>'+
      '</div>';
    }).join('');
  }
  function resultHtml(){
    var t=totals();
    return '<div class="ck-result__h">Rechnung · letzte 3 Monate</div>'+
      '<div class="ck-rrow"><span>Verkauf Netto</span><b data-c="'+t.netto+'">0,00 €</b></div>'+
      '<div class="ck-rrow ck-rrow--cost"><span>− Wareneinsatz</span><b data-c="'+(-t.we)+'">0,00 €</b></div>'+
      '<div class="ck-rrow ck-rrow--cost"><span>− Gemeinkosten</span><b data-c="'+(-t.gemein)+'">0,00 €</b></div>'+
      '<div class="ck-rrow ck-rrow--cost"><span>− Personalkosten</span><b data-c="'+(-t.personal)+'">0,00 €</b></div>'+
      '<div class="ck-rline"></div>'+
      '<div class="ck-rfinal"><div class="ck-rfinal__l"><span>Ergebnis</span><span class="ck-verdict"></span></div>'+
        '<div class="ck-rfinal__v" data-c="'+t.erg+'" data-plus="1">0,00 €</div></div>';
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
        '<div class="ck-flow">'+flowHtml()+'</div>'+
        '<div class="ck-result">'+resultHtml()+'</div>'+
        '<p class="ck-caption">Notion mit Claude Code zieht alles an einen Ort — dein ganzes Backoffice, ein System.</p>'+
      '</div>';
    return root;
  }

  var CAPS={
    intro:'Notion mit Claude Code zieht alles an einen Ort — dein ganzes Backoffice, ein System.',
    dishes:'Für jedes Gericht rechnet dir das System VK, Wareneinsatz und Deckungsbeitrag I bis III aus.',
    flow:'Mal die verkauften Portionen der letzten drei Monate — und alles läuft in einer Zahl zusammen.',
    result:'Und die entscheidende Zahl steht da: Am Ende zählt, ob unterm Strich Gewinn oder Verlust bleibt.'
  };
  function say(root,k){ var c=root.querySelector('.ck-caption'); c.style.opacity=0; setTimeout(function(){ c.textContent=CAPS[k]; c.style.opacity=1; },200); }

  function count(el,target,dur,fmt){
    var s=null,done=false;
    function step(ts){ if(done)return; if(!s)s=ts; var p=Math.min(1,(ts-s)/dur),e=1-Math.pow(1-p,3);
      el.textContent=fmt(target*e); if(p<1)requestAnimationFrame(step); else { done=true; el.textContent=fmt(target); } }
    requestAnimationFrame(step);
    setTimeout(function(){ done=true; el.textContent=fmt(target); }, dur+150);
  }

  function play(root){
    if(reduce){ finalStatic(root); return; }
    root.classList.add('ck-lit');
    root.className='ck-wrap ck-lit is-intro'; root.querySelector('.ck-caption').textContent=CAPS.intro;
    var tm=[];
    tm.push(setTimeout(function(){ root.className='ck-wrap ck-lit is-dishes'; say(root,'dishes'); },1900));
    tm.push(setTimeout(function(){
      root.className='ck-wrap ck-lit is-flow'; say(root,'flow');
      root.querySelectorAll('.ck-flow__u').forEach(function(el,i){
        setTimeout(function(){ count(el, parseInt(el.getAttribute('data-u'),10), 700, function(v){ return intf(v); }); }, 200+i*70);
      });
    },4600));
    tm.push(setTimeout(function(){
      root.className='ck-wrap ck-lit is-result'; say(root,'result');
      applyVerdict(root);
      root.querySelectorAll('.ck-result [data-c]').forEach(function(el,i){
        var plus=el.getAttribute('data-plus')==='1';
        setTimeout(function(){ count(el, parseFloat(el.getAttribute('data-c')), 950, function(v){ return eur(v,plus); }); }, 150+i*140);
      });
    },6700));
    root._tm=tm;
  }

  function applyVerdict(root){
    var t=totals(); var win=t.erg>=0;
    root.classList.remove('is-win','is-loss'); root.classList.add(win?'is-win':'is-loss');
    var v=root.querySelector('.ck-verdict'); if(v) v.textContent=win?'Gewinn':'Verlust';
  }
  function finalStatic(root){
    root.className='ck-wrap ck-lit is-result'; applyVerdict(root);
    root.querySelector('.ck-caption').textContent=CAPS.result;
    root.querySelectorAll('.ck-flow__u').forEach(function(el){ el.textContent=intf(parseInt(el.getAttribute('data-u'),10)); });
    root.querySelectorAll('[data-c]').forEach(function(el){ el.textContent=eur(parseFloat(el.getAttribute('data-c')), el.getAttribute('data-plus')==='1'); });
  }

  function inView(el){ var r=el.getBoundingClientRect(); return r.top<(innerHeight*0.85)&&r.bottom>0; }

  function arm(root){
    var played=false;
    function go(){ if(played)return; played=true; play(root); }
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(ev){ if(ev[0].isIntersecting){ go(); io.disconnect(); } },{threshold:.25});
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
