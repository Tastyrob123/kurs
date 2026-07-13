/* ============================================================
   TASTY STUDIOS · Gastronomie AI MasterClass
   kurs.js — ausgelagerte Interaktionen (super.so -> extern)
   Byte-genau aus dem Live-DOM extrahiert 2026-07-09.
   ============================================================ */

/* ============================================================
   Sidebar-Styling-Spans (Farben/Font kommen aus kurs.css, hier nur die Spans):
   1. Modul-Titel: Zahl in "Modul N" in unser Rot (.ts-modul-num) — Wort weiß / Zahl rot.
   2. Lektionen: Name NACH "//" beige (.ts-lektion-name) — "Lektion 2.1 //" bleibt weiß.
   Site-weit, selbstheilend via debounced Observer (Muster wie ts-m2-gold).
   BEWUSST AM DATEIANFANG platziert: der frühere Platz am Dateiende wurde wiederholt von
   Parallel-Commits (ad33dbc, 0b76635) beim Anhängen neuer Blöcke überschrieben. Am Anfang
   arbeitet niemand -> kollisionssicher. Bitte hier lassen.
   ============================================================ */
(function(){
  if(window.__tsSbNum) return; window.__tsSbNum = true;

  /* Modul-Header: erste Ziffernfolge rot wrappen */
  function wrapModulNum(){
    document.querySelectorAll('.super-navigation-menu__list-header .super-navigation-menu__item-title').forEach(function(el){
      if(el.querySelector('.ts-modul-num')) return;
      var w=document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n;
      while(n=w.nextNode()){
        var m=n.nodeValue.match(/\d+/);
        if(m){
          var after=n.splitText(m.index); after.splitText(m[0].length);
          var span=document.createElement('span'); span.className='ts-modul-num'; span.textContent=m[0];
          after.parentNode.replaceChild(span, after);
          break;
        }
      }
    });
  }

  /* Lektionen (Leaf-Links, NICHT in einem list-header): alles nach "//" beige wrappen */
  function wrapLektionName(){
    document.querySelectorAll('.super-navigation-menu__item-title').forEach(function(el){
      if(el.closest('.super-navigation-menu__list-header')) return;
      if(el.querySelector('.ts-lektion-name')) return;
      var w=document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n;
      while(n=w.nextNode()){
        var i=n.nodeValue.indexOf('//');
        if(i>-1){
          var after=n.splitText(i+2);
          var span=document.createElement('span'); span.className='ts-lektion-name'; span.textContent=after.nodeValue;
          after.parentNode.replaceChild(span, after);
          break;
        }
      }
    });
  }

  function apply(){ wrapModulNum(); wrapLektionName(); }

  apply();
  document.addEventListener('DOMContentLoaded', apply);
  var _t=null;
  new MutationObserver(function(){ if(_t) return; _t=setTimeout(function(){ _t=null; apply(); },200); })
    .observe(document.documentElement,{childList:true,subtree:true});
})();

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

/* --- #tsChaos mid-file platziert (EOF-Clobber-Schutz gegen Parallel-Chats) --- */

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
'#tsChaos.is-dishes .ck-np__dishes,#tsChaos.is-flow .ck-np__dishes,#tsChaos.is-result .ck-np__dishes{opacity:1;max-height:620px;padding:20px 14px 8px}',
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
'#tsChaos .ck-pl__row{display:flex;justify-content:space-between;align-items:baseline;gap:6px;font-size:clamp(.62rem,.94vw,.76rem);padding:2px 4px;border-radius:4px}',
'#tsChaos .ck-pl__row span{color:rgba(255,255,255,.64)}',
'#tsChaos .ck-pl__row b{font-weight:600;color:#fff}',
'#tsChaos .ck-pl__we b{color:rgba(255,255,255,.72)}',
'#tsChaos .ck-pl__db3{margin-top:3px;border-top:1px solid rgba(255,255,255,.1);padding-top:5px}',
'#tsChaos .ck-pl__db3 span{color:rgba(255,255,255,.75);font-weight:600}',
'#tsChaos .ck-pl__db3 b{font-size:clamp(.72rem,1.15vw,.92rem)}',
'#tsChaos .ck-dish--good .ck-pl__db3 b{color:var(--green)}',
'#tsChaos .ck-dish--bad .ck-pl__db3 b{color:var(--red)}',
'#tsChaos .ck-dish--good .ck-pl__db3{background:rgba(143,203,170,.08)}',
'#tsChaos .ck-dish--bad .ck-pl__db3{background:rgba(227,37,82,.09)}',
/* flow arrows + units */
'#tsChaos .ck-flow{display:flex;gap:clamp(6px,1vw,14px);justify-content:center;padding:0 14px;margin-top:0;opacity:0;max-height:0;overflow:hidden;transition:opacity .5s ease,max-height .6s ease,padding .4s ease}',
'#tsChaos.is-flow .ck-flow,#tsChaos.is-result .ck-flow{opacity:1;max-height:190px;padding:26px 14px 30px}',
'#tsChaos .ck-flow__col{flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:center;gap:12px}',
'#tsChaos .ck-flow__arrow{width:2px;height:0;background:var(--champ);transition:height .5s ease;position:relative;box-shadow:0 0 8px rgba(199,180,137,.55);margin-bottom:8px}',
'#tsChaos.is-flow .ck-flow__arrow,#tsChaos.is-result .ck-flow__arrow{height:26px}',
'#tsChaos .ck-flow__arrow::after{content:"";position:absolute;bottom:-5px;left:50%;transform:translateX(-50%);border-left:5px solid transparent;border-right:5px solid transparent;border-top:7px solid var(--champ)}',
'#tsChaos .ck-flow__u{font-size:clamp(.95rem,1.4vw,1.18rem);font-weight:700;color:#fff;font-variant-numeric:tabular-nums;line-height:1.05}',
'#tsChaos .ck-flow__l{font-size:clamp(.56rem,.85vw,.66rem);color:rgba(255,255,255,.6);margin-top:-6px}',
/* Rechnung */
'#tsChaos .ck-result{width:100%;background:rgba(199,180,137,.05);border-top:1px solid transparent;padding:0 clamp(18px,2.4vw,30px);text-align:left;max-height:0;opacity:0;overflow:hidden;transition:opacity .55s ease,max-height .6s ease,padding .5s ease}',
'#tsChaos.is-result .ck-result{opacity:1;max-height:420px;padding:clamp(18px,2vw,26px) clamp(18px,2.4vw,30px) clamp(20px,2vw,28px);border-top-color:rgba(199,180,137,.22)}',
'#tsChaos .ck-result__in{max-width:560px;margin:0 auto}',
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
    return '<div class="ck-result__in">'+
      '<div class="ck-result__h">Rechnung · letzte 3 Monate</div>'+
      '<div class="ck-rrow"><span>Verkauf Netto</span><b data-c="'+t.netto+'">0,00 €</b></div>'+
      '<div class="ck-rrow ck-rrow--cost"><span>− Wareneinsatz</span><b data-c="'+(-t.we)+'">0,00 €</b></div>'+
      '<div class="ck-rrow ck-rrow--cost"><span>− Gemeinkosten</span><b data-c="'+(-t.gemein)+'">0,00 €</b></div>'+
      '<div class="ck-rrow ck-rrow--cost"><span>− Personalkosten</span><b data-c="'+(-t.personal)+'">0,00 €</b></div>'+
      '<div class="ck-rline"></div>'+
      '<div class="ck-rfinal"><div class="ck-rfinal__l"><span>Ergebnis</span><span class="ck-verdict"></span></div>'+
        '<div class="ck-rfinal__v" data-c="'+t.erg+'" data-plus="1">0,00 €</div></div>'+
      '</div>';
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
          '<div class="ck-flow">'+flowHtml()+'</div>'+
          '<div class="ck-result">'+resultHtml()+'</div>'+
        '</div>'+
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

/* ============================================================
   rezepturen — Hero "DB V : Rezepturen" (Muster: zutatenliste-Hero DB IV)
   ============================================================ */
(function(){
  var IMG="https://files.catbox.moe/usatux.png"; /* 3-Laptop-Cover Rezepturen v3 UHD: NEU aus sauberem Original "Meine Rezepte.png" aufgebaut (nicht mehr aus dem harten Live-Asset), auf Alpha-Grid registriert (offset 3,132 @1x), 3x Lanczos = 4080x1464 RGBA. Ton = Original-natuerlich, farbenfroh (saturate 1.20) + knackig (UnsharpMask r1.8/p85), leichte Kontrast-Pointe 1.05 (pivot118) -- KEIN harter contrast/unsharp125 mehr. Alpha aus 7qzb0p hochskaliert -> blendet nahtlos in #05060b. Vorgaenger: n0vdhw (K2, zu flach), 7qzb0p (zu hart) */
  var LOGO="https://files.catbox.moe/au80tp.png";
  function on(){ return /\/rezepturen\/?$/.test(location.pathname); }
  function mount(){
    if(!on()) return;
    var sc=document.querySelector(".super-content");
    if(!sc) return;
    if(document.querySelector(".ts-hero")) return;
    var hero=document.createElement("div");
    hero.className="ts-hero";
    hero.innerHTML=
      '<img class="ts-hero__img" alt="DB V — Rezepturen" src="'+IMG+'">'+
      '<div class="ts-hero__text">'+
        '<img class="ts-hero__logo" alt="Tasty Studios" src="'+LOGO+'">'+
        '<div class="ts-hero__eyebrow">Lektion 2.4</div>'+
        '<h1 class="ts-hero__title">DB V : <span class="ts-gold">Rezepturen</span></h1>'+
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

/* ============================================================
   gerichte-getrnke-finaler-schritt — Hero "DB VIII : Gerichte & Getränke" (Muster: rezepturen-Hero DB V)
   ============================================================ */
(function(){
  var IMG="https://files.catbox.moe/sceu4c.png"; /* 3-Laptop-Cover Gerichte & Getränke: weisser Hintergrund per Edge-Flood-Fill entfernt (transparent RGBA, kein AI), Farben knallig (Saettigung +24%), Feinradius-Schaerfung (2-stufig r1.0/r0.5, Kantenschaerfe OHNE Kontrast-Halo), eng auf die Laptops beschnitten -> groesser+hoeher wie Referenz, 2700px (aus Gerichte.png) */
  var LOGO="https://files.catbox.moe/au80tp.png";
  function on(){ return /\/gerichte-getrnke-finaler-schritt\/?$/.test(location.pathname); }
  function mount(){
    if(!on()) return;
    var sc=document.querySelector(".super-content");
    if(!sc) return;
    if(document.querySelector(".ts-hero")) return;
    var hero=document.createElement("div");
    hero.className="ts-hero";
    hero.innerHTML=
      '<img class="ts-hero__img" alt="DB VIII — Gerichte & Getränke" src="'+IMG+'">'+
      '<div class="ts-hero__text">'+
        '<img class="ts-hero__logo" alt="Tasty Studios" src="'+LOGO+'">'+
        '<div class="ts-hero__eyebrow">L 2.7</div>'+
        '<h1 class="ts-hero__title">DB VIII : <span class="ts-gold">Gerichte &amp; Getränke</span></h1>'+
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

/* ============================================================
   zutatenliste — DB IV Erklaer-Animation "Die Zutat zieht sich ihren Preis"
   Inventurliste (DB 0, ganze Tomate) --Relation--> Zutat (DB IV, in Scheiben, Einwaage)
   = Portionspreis (2 gestapelte Scheiben). Roh -> verarbeitet -> portioniert.
   Stil nach #tsflow / #tsiv. Mount an der (entfernten) Stats-Position, vor "Zutaten als Bausteinkonzept".
   Zahlen = Beispielwerte (Einwaage 120 g aus SSOT; Einkaufspreis 3,20 EUR/kg Platzhalter).
   ============================================================ */
(function(){
  if(window.__tsd4) return; window.__tsd4=true;
  var IMG_WHOLE ="https://tastyrob123.github.io/kurs/img/anim/tomate-3d.png";
  var IMG_SLICED="https://tastyrob123.github.io/kurs/img/anim/tomate-sliced.png";
  var IMG_STACK ="https://tastyrob123.github.io/kurs/img/anim/tomate-stack.png";
  var CSS=`
  #tsd4{width:min(1000px,95vw);margin:20px auto 60px;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;color:#fff;opacity:0;transform:translateY(20px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)}
  #tsd4.in{opacity:1;transform:none}
  #tsd4 .tsd4-head{text-align:center;margin:0 0 104px}
  #tsd4 .tsd4-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:600;letter-spacing:1.6px;text-transform:uppercase;color:#c7b489;margin:0 0 12px}
  #tsd4 .tsd4-eyebrow::before{content:"";width:7px;height:7px;border-radius:50%;background:#c7b489;box-shadow:0 0 12px rgba(199,180,137,.7)}
  #tsd4 .tsd4-title{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;font-size:clamp(1.5rem,3vw,2.1rem);font-weight:600;letter-spacing:-.02em;line-height:1.15;margin:0;color:#fff}
  #tsd4 .tsd4-title .g{color:#c7b489}
  #tsd4 .tsd4-stage{display:grid;grid-template-columns:1fr auto 1.15fr auto 1fr;align-items:center;gap:0}
  #tsd4 .tsd4-card{position:relative;border-radius:14px;padding:66px 20px 20px;background:rgba(255,255,255,.035);border:1px solid rgba(199,180,137,.28);opacity:0;transform:translateY(14px) scale(.97);transition:opacity .55s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1),border-color .6s ease,box-shadow .6s ease}
  #tsd4 .tsd4-card.lit{opacity:1;transform:none}
  #tsd4 .tsd4-card .c-eye{font-size:10px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:rgba(255,255,255,.4);margin:0 0 10px}
  #tsd4 .tsd4-card .c-name{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,sans-serif;font-size:20px;font-weight:600;letter-spacing:-.01em;color:#fff;margin:0 0 14px}
  #tsd4 .tsd4-card .c-div{height:1px;background:rgba(255,255,255,.09);margin:0 0 12px}
  #tsd4 .tsd4-row{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin:0 0 9px}
  #tsd4 .tsd4-row:last-child{margin-bottom:0}
  #tsd4 .tsd4-row .k{font-size:12.5px;color:rgba(255,255,255,.55)}
  #tsd4 .tsd4-row .v{font-size:14px;font-weight:600;color:#fff;white-space:nowrap}
  #tsd4 .tsd4-row .v.muted{color:rgba(255,255,255,.6);font-weight:500}
  #tsd4 .tsd4-row .v.gold{color:#c7b489;font-weight:700;font-size:15px}
  #tsd4 .tsd4-note{font-size:10px;color:rgba(255,255,255,.28);margin:10px 0 0}
  /* Schwebendes Motiv auf jeder Karte */
  #tsd4 .tsd4-fruit{position:absolute;top:-52px;left:50%;height:82px;transform:translateX(-50%) scale(.4);opacity:0;pointer-events:none;filter:drop-shadow(0 15px 20px rgba(0,0,0,.55)) drop-shadow(0 4px 10px rgba(0,0,0,.4));transition:opacity .6s ease,transform .7s cubic-bezier(.34,1.56,.64,1)}
  #tsd4 .tsd4-card.lit .tsd4-fruit{opacity:1;transform:translateX(-50%) scale(1)}
  #tsd4 .tsd4-fruit img{height:100%;width:auto;display:block}
  #tsd4 .tsd4-fruit.is-sliced{height:100px;top:-52px}
  #tsd4 .tsd4-fruit.is-stack{height:82px;top:-54px}
  #tsd4 .tsd4-zutat{border-color:rgba(199,180,137,.5)}
  #tsd4 .tsd4-zutat.lit{box-shadow:0 24px 60px rgba(0,0,0,.45)}
  /* Connector 1 (Relation, mit wandernder Kugel) */
  #tsd4 .tsd4-conn{position:relative;width:clamp(56px,7vw,92px);height:2px;align-self:center;margin-top:8px}
  #tsd4 .tsd4-conn .line{position:absolute;inset:0;border-top:2px dashed rgba(199,180,137,.45);opacity:0;transition:opacity .4s ease}
  #tsd4 .tsd4-conn.on .line{opacity:1}
  #tsd4 .tsd4-conn .ball{position:absolute;top:50%;left:0;width:9px;height:9px;border-radius:50%;background:#c7b489;box-shadow:0 0 12px rgba(199,180,137,.8);transform:translate(-50%,-50%) scale(0);transition:left .85s cubic-bezier(.5,0,.2,1),transform .3s ease}
  #tsd4 .tsd4-conn.on .ball{transform:translate(-50%,-50%) scale(1)}
  #tsd4 .tsd4-conn.go .ball{left:100%}
  #tsd4 .tsd4-conn .clabel{position:absolute;top:-30px;left:50%;transform:translateX(-50%);text-align:center;white-space:nowrap;font-size:9.5px;letter-spacing:.5px;color:#c7b489;opacity:0;transition:opacity .4s ease}
  #tsd4 .tsd4-conn .clabel small{display:block;color:rgba(199,180,137,.65);font-size:8.5px;letter-spacing:.2px;margin-top:1px}
  #tsd4 .tsd4-conn.on .clabel{opacity:1}
  /* Connector 2 (=) */
  #tsd4 .tsd4-eq{display:flex;align-items:center;justify-content:center;width:clamp(40px,5vw,64px);opacity:0;transition:opacity .5s ease}
  #tsd4 .tsd4-eq.on{opacity:1}
  #tsd4 .tsd4-eq svg{width:26px;height:14px;overflow:visible}
  #tsd4 .tsd4-eq path{stroke:#c7b489;stroke-width:2;fill:none;stroke-linecap:round}
  /* Ergebnis-Chip */
  #tsd4 .tsd4-result{text-align:center;background:rgba(199,180,137,.09);border-color:rgba(199,180,137,.55)}
  #tsd4 .tsd4-result .c-eye{color:#c7b489}
  #tsd4 .tsd4-result .r-val{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,sans-serif;font-size:clamp(1.8rem,4vw,2.4rem);font-weight:700;letter-spacing:-.02em;color:#fff;margin:6px 0 8px;line-height:1}
  #tsd4 .tsd4-result .r-formula{font-size:12px;color:rgba(255,255,255,.5)}
  /* Fussnote */
  #tsd4 .tsd4-foot{text-align:center;margin:34px auto 0;max-width:640px}
  #tsd4 .tsd4-foot .f-main{font-size:17px;color:rgba(255,255,255,.85);margin:0 0 6px}
  #tsd4 .tsd4-foot .f-main .g{color:#c7b489}
  #tsd4 .tsd4-foot .f-sub{font-size:13px;color:rgba(255,255,255,.85);margin:0}
  /* Beschreibungs-Absatz unter der Animation (Text aus dem Notion-Intro hierher gezogen) */
  #tsd4 .tsd4-desc{max-width:700px;margin:44px auto 0;text-align:center;font-size:16px;line-height:1.65;color:#fff}
  /* Original-Notion-Absatz "Jede einzelne Zutat buendelt" + die 4 leeren Text-Spacer + die leere Rest-Spalte im Intro ausblenden — Text lebt jetzt in .tsd4-desc unter der Animation, damit rutscht alles darueber natuerlich nach oben */
  #block-397b9546553480b38ea2c6249770ed89,#block-39bb9546553480b2a3dac60d493abdae,#block-39bb9546553480d6821be64987faefaa,#block-39bb9546553480bd9f4cdefa67b13599,#block-396b9546553480eeaef5d96a000077f7,#block-395b95465534809eb290d1066e21f264{display:none!important}
  @media(max-width:820px){
    #tsd4{margin-top:24px}
    #tsd4 .tsd4-stage{grid-template-columns:1fr;gap:0;max-width:420px;margin:0 auto}
    #tsd4 .tsd4-conn{width:2px;height:clamp(44px,9vw,58px);margin:8px auto;border-top:0}
    #tsd4 .tsd4-conn .line{border-top:0;border-left:2px dashed rgba(199,180,137,.45)}
    #tsd4 .tsd4-conn .ball{top:0;left:50%;transition:top .85s cubic-bezier(.5,0,.2,1),transform .3s ease}
    #tsd4 .tsd4-conn.go .ball{left:50%;top:100%}
    #tsd4 .tsd4-conn .clabel{top:50%;left:auto;right:-8px;transform:translate(100%,-50%);text-align:left}
    #tsd4 .tsd4-eq{width:auto;height:40px;margin:6px auto}
    #tsd4 .tsd4-eq svg{transform:rotate(90deg)}
  }
  `;
  function injectCSS(){ if(document.getElementById('tsd4-css'))return; var s=document.createElement('style'); s.id='tsd4-css'; s.textContent=CSS; document.head.appendChild(s); }
  function build(){
    var root=document.createElement('div'); root.id='tsd4';
    root.innerHTML=
      '<div class="tsd4-head"><h2 class="tsd4-title">Die Zutat zieht sich ihren <span class="g">Preis</span>.</h2></div>'+
      '<div class="tsd4-stage">'+
        '<div class="tsd4-card tsd4-inv"><div class="tsd4-fruit is-whole"><img src="'+IMG_WHOLE+'" alt="Tomate" loading="lazy"></div><p class="c-eye">DB 0 · Inventurliste</p><p class="c-name">Tomaten</p><div class="c-div"></div><div class="tsd4-row"><span class="k">Einkaufspreis</span><span class="v">3,20 €/kg</span></div><p class="tsd4-note">Beispielwert</p></div>'+
        '<div class="tsd4-conn"><div class="clabel">Relation<small>zieht den Preis</small></div><div class="line"></div><div class="ball"></div></div>'+
        '<div class="tsd4-card tsd4-zutat"><div class="tsd4-fruit is-sliced"><img src="'+IMG_SLICED+'" alt="Tomate in Scheiben" loading="lazy"></div><p class="c-eye">DB IV · Zutat</p><p class="c-name">Tomate</p><div class="c-div"></div><div class="tsd4-row"><span class="k">Preis (aus DB 0)</span><span class="v muted">3,20 €/kg</span></div><div class="tsd4-row"><span class="k">Einwaage</span><span class="v gold">120 g</span></div></div>'+
        '<div class="tsd4-eq"><svg viewBox="0 0 26 14"><path d="M2 5 H20 M2 9 H20 M17 2 L23 7 L17 12"/></svg></div>'+
        '<div class="tsd4-card tsd4-result"><div class="tsd4-fruit is-stack"><img src="'+IMG_STACK+'" alt="Zwei Tomatenscheiben" loading="lazy"></div><p class="c-eye">Portionspreis</p><p class="r-val" data-target="0.384">0,00 €</p><p class="r-formula">120 g × 3,20 €/kg</p></div>'+
      '</div>'+
      '<p class="tsd4-desc">Jede einzelne Zutat bündelt dabei sämtliche relevanten Informationen an einem Ort – von Einkaufspreisen über Nährwerte bis hin zu den Allergenen. So hast du für jede Zutat alles Wichtige auf einen Blick und musst die Angaben nicht mehr an mehreren Stellen zusammensuchen.</p>'+
      '<div class="tsd4-foot"><p class="f-main">→ Der fertige Baustein geht so in <span class="g">jedes Rezept</span> — Preis und Menge in einem.</p><p class="f-sub">Zahlen = Beispielwerte. Einwaage aus deiner Zutaten-Tabelle, Einkaufspreis illustrativ.</p></div>';
    return root;
  }
  function countUp(el){ var target=parseFloat(el.getAttribute('data-target'))||0, dur=850, t0=null; function step(now){ if(t0===null)t0=now; var p=Math.min(1,(now-t0)/dur), e=1-Math.pow(1-p,3), val=target*e; el.textContent=val.toFixed(2).replace('.',',')+' €'; if(p<1)requestAnimationFrame(step); } requestAnimationFrame(step); }
  function play(root){ if(root.__played)return; root.__played=true; var inv=root.querySelector('.tsd4-inv'), conn=root.querySelector('.tsd4-conn'), zutat=root.querySelector('.tsd4-zutat'), eq=root.querySelector('.tsd4-eq'), result=root.querySelector('.tsd4-result'), rval=result.querySelector('.r-val'); root.classList.add('in'); setTimeout(function(){ inv.classList.add('lit'); },220); setTimeout(function(){ conn.classList.add('on'); },820); setTimeout(function(){ conn.classList.add('go'); },980); setTimeout(function(){ zutat.classList.add('lit'); },1620); setTimeout(function(){ eq.classList.add('on'); result.classList.add('lit'); },2060); setTimeout(function(){ countUp(rval); },2260); }
  function findAnchor(){ var a=document.getElementById('block-396b954655348098ae30f9bff07fa068'); if(a) return a; var n=document.querySelectorAll('h1.notion-heading'); for(var i=0;i<n.length;i++){ if((n[i].textContent||'').trim().indexOf('Zutaten als Bausteinkonzept')===0) return n[i].closest('.notion-column-list')||n[i].closest('[id^="block-"]')||n[i]; } return null; }
  function inView(el){ var r=el.getBoundingClientRect(); return r.top < (window.innerHeight*0.7) && r.bottom > (window.innerHeight*0.3); }
  function mount(){ if(!/\/zutatenliste\/?$/.test(location.pathname)){ var e=document.getElementById('tsd4'); if(e&&e.parentNode)e.parentNode.removeChild(e); return; } if(document.getElementById('tsd4')) return; var a=findAnchor(); if(!a) return; injectCSS(); var root=build(); a.parentNode.insertBefore(root, a); var io=new IntersectionObserver(function(ev){ if(ev[0].isIntersecting){ play(root); io.disconnect(); } },{threshold:.35}); io.observe(root); if(inView(root)) play(root); }
  mount();
  document.addEventListener("DOMContentLoaded", mount);
  new MutationObserver(mount).observe(document.documentElement,{childList:true,subtree:true});
})();

/* ============================================================
   zutatenliste — #tsreuse  Split: Text links / Animation rechts
   Links: die zwei Absaetze "In diesem Schritt..." + "Oeffne hierzu..."
   (nativ ausgeblendet, hier gerendert = driftsichere Text+Visual-Einheit).
   Rechts: elegante "Video"-Sequenz (Olivenoel):
     1) nur die Quell-Kachel DB IV · Zutat (12,90 EUR/L) erscheint
     2) Verbindung wird EINMAL aufgebaut (Linien faden ein, bleiben solide)
        + die 4 Anwendungs-Kacheln erscheinen (DB-Label je Kachel)
     3) Preis wird nach oben angepasst 12,90 -> 14,90 EUR/L
     4) ein Tron-Lichtimpuls laeuft ueber alle 4 Linien zu den Kacheln
     5) beim Ankommen blitzt jede Kachel kurz auf + Preis rechnet neu
   Mount: eigener Top-Level-Block VOR der "In diesem Schritt"-Column-List,
   die ganze Column-List + der native "Kurz gesagt"-Heading werden versteckt.
   "Die Loesung"-Absatz wird auf normal (16px/400) zurueckgesetzt.
   Zahlen = Beispielwerte (Olivenoel 12,90->14,90 EUR/L illustrativ).
   Reveal robust: @keyframes + inView-Polling, Endzustand direkt gesetzt.
   ============================================================ */
(function(){
  if(window.__tsreuse) return; window.__tsreuse=true;
  function on(){ return /\/zutatenliste\/?$/.test(location.pathname); }
  var DEST=[
    {name:'Salat',        db:'DB IX · Gerichte', menge:'15 ml', a:0.19, b:0.22},
    {name:'Dressing',     db:'DB V · Rezepte',   menge:'30 ml', a:0.39, b:0.45},
    {name:'Dressing II',  db:'DB V · Rezepte',   menge:'25 ml', a:0.32, b:0.37},
    {name:'Tomatensauce', db:'DB V · Rezepte',   menge:'90 ml', a:1.16, b:1.34}
  ];
  var VB_W=720, VB_H=340;
  var SRCX=237, SRCY=170, DSTX=481, DSTY=[37,126,214,303];
  var PARA1='In diesem Schritt übersetzen wir das Inventarprodukt in diese verarbeitbare Einheit – zum Beispiel vom gelieferten Gebinde hin zu Gramm, Milliliter oder Stück. Wenn wir damit weiterarbeiten wollen duplizieren wir es einfach, ändern die Portionsgröße, entfernen den Haken bei &#8220;Hauptzutat&#8221; und haben einen fertigen Baustein (s. Animation).';
  var PARA2='Öffne hierzu zunächst deine Notion AI Backoffice Startseite, erstelle eine neue Seite die du &#8220;DB Zutaten&#8221; nennst, einen &#8220;Zurück&#8221; Button und eine neue Tabelle / Datenbankansicht → Name : &#8220;DB IV : Zutaten&#8221; :';
  var CSS=`
  /* "Die Lösung"-Absatz wieder normal gross + nicht fett (nativ 18px/600) */
  #block-38eb9546553480fea559e458d25dd0da{font-size:16px!important;font-weight:400!important;line-height:1.7!important}
  #block-38eb9546553480fea559e458d25dd0da b,#block-38eb9546553480fea559e458d25dd0da strong,#block-38eb9546553480fea559e458d25dd0da *{font-weight:400!important}
  #tsreuse{width:100%;max-width:1120px;margin:46px auto 44px;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;color:#fff}
  #tsreuse .rz-wrap{display:flex;align-items:center;gap:clamp(28px,4vw,60px)}
  #tsreuse .rz-left{flex:0 0 39%;max-width:39%;min-width:0}
  #tsreuse .rz-para{font-size:15.5px;line-height:1.72;color:rgba(255,255,255,.82);margin:0 0 16px}
  #tsreuse .rz-para:last-child{margin-bottom:0}
  #tsreuse .rz-left{opacity:0;transform:translateY(14px)}
  #tsreuse.go .rz-left{animation:rzUp .8s cubic-bezier(.16,1,.3,1) both}
  #tsreuse .rz-right{flex:1 1 auto;min-width:0}
  #tsreuse .rz-head{text-align:center;margin:0 auto 18px;opacity:0;transform:translateY(14px)}
  #tsreuse.go .rz-head{animation:rzUp .7s cubic-bezier(.16,1,.3,1) both;animation-delay:.1s}
  #tsreuse .rz-title{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;font-weight:600;font-size:clamp(1.25rem,2.2vw,1.65rem);letter-spacing:-.02em;line-height:1.15;margin:0;color:#fff}
  #tsreuse .rz-title .g{color:#c7b489}
  #tsreuse .rz-stage{position:relative;width:100%;max-width:640px;margin:0 auto;aspect-ratio:720/340;min-height:300px}
  #tsreuse svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
  /* Basis-Verbindung (einmal aufgebaut, bleibt solide) */
  #tsreuse .rz-line{fill:none;stroke:#c7b489;stroke-width:1.5;stroke-linecap:round;vector-effect:non-scaling-stroke;opacity:0}
  #tsreuse.go .rz-line{animation:rzFade .7s ease forwards;animation-delay:.85s}
  /* Tron-Lichtimpuls (nur bei Preisaenderung) */
  #tsreuse .rz-pulse{fill:none;stroke:#fbe6c2;stroke-width:3;stroke-linecap:round;vector-effect:non-scaling-stroke;stroke-dasharray:8 300;stroke-dashoffset:8;opacity:0;filter:drop-shadow(0 0 4px rgba(251,230,194,.95)) drop-shadow(0 0 10px rgba(199,180,137,.75))}
  #tsreuse.upd .rz-pulse{animation:rzTron .9s cubic-bezier(.42,0,.32,1) forwards}
  @keyframes rzTron{0%{stroke-dashoffset:8;opacity:0}12%{opacity:1}86%{opacity:1}100%{stroke-dashoffset:-96;opacity:0}}
  #tsreuse .rz-node{position:absolute;transform:translate(-50%,-50%) translateY(10px);opacity:0;box-sizing:border-box}
  #tsreuse.go .rz-node{animation:rzNode .55s cubic-bezier(.16,1,.3,1) both}
  #tsreuse .rz-card{position:relative;border-radius:13px;background:rgba(255,255,255,.04);border:1px solid rgba(199,180,137,.28)}
  /* Quelle */
  #tsreuse .rz-src{left:19%;top:50%;width:min(35%,196px)}
  #tsreuse .rz-src .rz-card{padding:14px 16px;border-color:rgba(199,180,137,.5);box-shadow:0 16px 40px rgba(0,0,0,.4)}
  #tsreuse .rz-eye{font-size:9px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.45);margin:0 0 6px}
  #tsreuse .rz-src .rz-eye{color:#c7b489}
  #tsreuse .rz-name{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,sans-serif;font-weight:600;font-size:18px;letter-spacing:-.01em;color:#fff;margin:0 0 10px}
  #tsreuse .rz-div{height:1px;background:rgba(255,255,255,.09);margin:0 0 9px}
  #tsreuse .rz-row{display:flex;justify-content:space-between;align-items:baseline;gap:10px}
  #tsreuse .rz-row .k{font-size:11px;color:rgba(255,255,255,.55)}
  #tsreuse .rz-price{font-size:16px;font-weight:700;color:#c7b489;white-space:nowrap;font-variant-numeric:tabular-nums}
  #tsreuse .rz-badge{display:inline-block;margin-top:10px;font-size:8.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#c7b489;background:rgba(199,180,137,.1);border:1px solid rgba(199,180,137,.32);border-radius:999px;padding:3px 9px}
  #tsreuse .rz-chg{position:absolute;top:-11px;right:11px;font-size:8.5px;font-weight:600;letter-spacing:.05em;color:#05060b;background:#c7b489;border-radius:999px;padding:3px 8px;opacity:0;transform:translateY(5px) scale(.9);box-shadow:0 6px 16px rgba(199,180,137,.35)}
  #tsreuse.upd .rz-chg{animation:rzChg .5s cubic-bezier(.34,1.56,.64,1) both}
  /* Anwendungen */
  #tsreuse .rz-dst{left:80%;width:min(35%,192px)}
  #tsreuse .rz-dst.d0{top:10.9%}
  #tsreuse .rz-dst.d1{top:37.1%}
  #tsreuse .rz-dst.d2{top:62.9%}
  #tsreuse .rz-dst.d3{top:89.1%}
  #tsreuse .rz-dst .rz-card{padding:9px 12px;display:flex;align-items:center;justify-content:space-between;gap:9px;transition:border-color .4s ease,box-shadow .45s ease}
  #tsreuse .rz-dst.lit .rz-card{border-color:rgba(199,180,137,.5);box-shadow:0 10px 24px rgba(0,0,0,.3)}
  #tsreuse .rz-dst.flash .rz-card{border-color:#f2e2b8;box-shadow:0 0 24px rgba(251,230,194,.55),0 10px 24px rgba(0,0,0,.3)}
  #tsreuse .rz-deye{font-size:8px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#c7b489;margin:0 0 3px;opacity:.85}
  #tsreuse .rz-dst .rz-l .rz-name{font-size:13px;margin:0 0 2px}
  #tsreuse .rz-dst .rz-l .rz-menge{font-size:10px;color:rgba(255,255,255,.5)}
  #tsreuse .rz-dst .rz-r{text-align:right}
  #tsreuse .rz-dst .rz-cost{font-size:14px;font-weight:700;color:#fff;white-space:nowrap;font-variant-numeric:tabular-nums;transition:color .4s ease}
  #tsreuse .rz-dst.pop .rz-cost{color:#c7b489}
  #tsreuse .rz-dst .rz-upd{display:block;font-size:7.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#c7b489;margin-top:2px;opacity:0}
  #tsreuse .rz-dst.pop .rz-upd{opacity:1;transition:opacity .4s ease}
  /* Merksatz */
  #tsreuse .rz-note{max-width:520px;margin:24px auto 0;text-align:center;font-size:clamp(.95rem,1.2vw,1.06rem);line-height:1.55;color:#fff;opacity:0;transform:translateY(10px)}
  #tsreuse.go .rz-note{animation:rzUp .8s cubic-bezier(.16,1,.3,1) both;animation-delay:.5s}
  #tsreuse .rz-note b{color:#c7b489;font-weight:600}
  #tsreuse .rz-note .lead{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,sans-serif;color:rgba(255,255,255,.5);font-size:.78em;letter-spacing:.02em;display:block;margin-bottom:5px}
  @keyframes rzUp{to{opacity:1;transform:none}}
  @keyframes rzNode{to{opacity:1;transform:translate(-50%,-50%)}}
  @keyframes rzFade{to{opacity:.5}}
  @keyframes rzChg{to{opacity:1;transform:none}}
  @media(max-width:860px){
    #tsreuse{margin-top:32px}
    #tsreuse .rz-wrap{flex-direction:column;align-items:stretch;gap:26px}
    #tsreuse .rz-left{flex-basis:auto;max-width:none}
    #tsreuse .rz-stage{max-width:560px}
  }
  @media(max-width:600px){
    #tsreuse .rz-stage{overflow-x:auto;overflow-y:hidden;aspect-ratio:auto;max-width:none}
    #tsreuse .rz-stage>.rz-inner{position:relative;width:600px;height:340px;margin:0 auto}
    #tsreuse svg{width:600px;height:340px}
  }
  @media(prefers-reduced-motion:reduce){
    #tsreuse .rz-left,#tsreuse .rz-head,#tsreuse .rz-node,#tsreuse .rz-note{opacity:1!important;transform:none!important;animation:none!important}
    #tsreuse .rz-line{opacity:.5!important;animation:none!important}
    #tsreuse .rz-pulse{display:none!important}
  }
  `;
  function injectCSS(){ if(document.getElementById('tsreuse-css'))return; var s=document.createElement('style'); s.id='tsreuse-css'; s.textContent=CSS; document.head.appendChild(s); }
  function eur(v){ return v.toFixed(2).replace('.',',')+' €'; }
  function build(){
    var root=document.createElement('div'); root.id='tsreuse';
    var lines='', pulses='';
    DSTY.forEach(function(y,i){
      var cx=(SRCX+DSTX)/2;
      var d='M '+SRCX+','+SRCY+' C '+cx+','+SRCY+' '+cx+','+y+' '+DSTX+','+y;
      lines +='<path class="rz-line l'+i+'" pathLength="100" d="'+d+'"/>';
      pulses+='<path class="rz-pulse p'+i+'" pathLength="100" d="'+d+'"/>';
    });
    var dstHTML='';
    DEST.forEach(function(d,i){
      dstHTML+='<div class="rz-node rz-dst d'+i+'" data-i="'+i+'"><div class="rz-card"><div class="rz-l"><p class="rz-deye">'+d.db+'</p><p class="rz-name">'+d.name+'</p><span class="rz-menge">'+d.menge+'</span></div><div class="rz-r"><span class="rz-cost" data-b="'+d.b+'">'+eur(d.a)+'</span><span class="rz-upd">aktualisiert</span></div></div></div>';
    });
    var right=
      '<div class="rz-head"><h2 class="rz-title">Ein Eintrag, <span class="g">vier Anwendungen.</span></h2></div>'+
      '<div class="rz-stage"><div class="rz-inner"><svg viewBox="0 0 '+VB_W+' '+VB_H+'" preserveAspectRatio="none">'+lines+pulses+'</svg>'+
        '<div class="rz-node rz-src"><div class="rz-card"><span class="rz-chg">Preis geändert</span><p class="rz-eye">DB IV · Zutat</p><p class="rz-name">Olivenöl</p><div class="rz-div"></div><div class="rz-row"><span class="k">Preis</span><span class="rz-price" data-b="14.90">12,90&nbsp;€/L</span></div><span class="rz-badge">1× angelegt</span></div></div>'+
        dstHTML+
      '</div></div>'+
      '<p class="rz-note"><span class="lead">Kurz gesagt</span>Die Zutat wird <b>einmal gepflegt</b>, aber <b>beliebig oft verwendet</b>.</p>';
    root.innerHTML=
      '<div class="rz-wrap">'+
        '<div class="rz-left"><p class="rz-para">'+PARA1+'</p><p class="rz-para">'+PARA2+'</p></div>'+
        '<div class="rz-right">'+right+'</div>'+
      '</div>';
    root.querySelector('.rz-src').style.animationDelay='.22s';
    root.querySelectorAll('.rz-dst').forEach(function(n,i){ n.style.animationDelay=(1.05+i*0.12)+'s'; });
    return root;
  }
  function countUp(el,to,unit){ var from=parseFloat((el.textContent||'0').replace(/[^\d,]/g,'').replace(',','.'))||0, dur=600, t0=null;
    function step(now){ if(t0===null)t0=now; var p=Math.min(1,(now-t0)/dur), e=1-Math.pow(1-p,3), v=from+(to-from)*e; el.textContent=unit(v); if(p<1)requestAnimationFrame(step); }
    requestAnimationFrame(step); }
  function reduced(){ try{return window.matchMedia('(prefers-reduced-motion:reduce)').matches;}catch(e){return false;} }
  function priceUnit(v){ return v.toFixed(2).replace('.',',')+' €/L'; }
  function go(root){ if(root.__played) return; root.__played=true;
    var dsts=root.querySelectorAll('.rz-dst'), price=root.querySelector('.rz-price');
    if(reduced()){ root.classList.add('go','upd'); dsts.forEach(function(n){ n.classList.add('lit','pop'); n.querySelector('.rz-cost').textContent=eur(parseFloat(n.querySelector('.rz-cost').getAttribute('data-b'))); }); price.textContent='14,90 €/L'; return; }
    root.classList.add('go');
    /* Preis nach oben anpassen -> Tron-Impuls -> Kacheln blitzen auf */
    setTimeout(function(){
      root.classList.add('upd');                 // Pill + Tron-Pulse starten
      countUp(price,14.90,priceUnit);
    },2200);
    DEST.forEach(function(d,i){
      setTimeout(function(){
        var n=dsts[i]; n.classList.add('flash','pop');
        countUp(n.querySelector('.rz-cost'),parseFloat(n.querySelector('.rz-cost').getAttribute('data-b')),eur);
        setTimeout(function(){ n.classList.remove('flash'); n.classList.add('lit'); },430);
      },2200+760+i*70);
    });
  }
  function inView(el){ var r=el.getBoundingClientRect(); return r.top < (window.innerHeight*0.82) && r.bottom > 60; }
  function arm(root){
    if(inView(root)) return go(root);
    var iv=setInterval(function(){ if(!document.body.contains(root)){ clearInterval(iv); return; } if(inView(root)){ clearInterval(iv); go(root); } },250);
    window.addEventListener('scroll',function h(){ if(inView(root)){ window.removeEventListener('scroll',h); go(root); } },{passive:true});
    try{ var io=new IntersectionObserver(function(e){ if(e[0].isIntersecting){ io.disconnect(); go(root); } },{threshold:.2}); io.observe(root); }catch(e){}
  }
  /* natives Element mit Phrase finden, aber niemals aus dem eigenen Widget */
  function findNative(phrase){
    var els=document.querySelectorAll('.notion-text, .notion-heading, p, h1, h2, h3');
    for(var i=0;i<els.length;i++){ var e=els[i]; if(e.closest('#tsreuse')) continue; if((e.textContent||'').replace(/\s+/g,' ').indexOf(phrase)>-1) return e; }
    return null;
  }
  /* hoch bis zum direkten Kind der .notion-root (Top-Level-Block) */
  function topLevel(el){ var nr=document.querySelector('.notion-root'); if(!nr) return el.closest('[id^="block-"]')||el; var b=el; while(b&&b.parentElement&&b.parentElement!==nr) b=b.parentElement; return (b&&b.parentElement===nr)?b:(el.closest('[id^="block-"]')||el); }
  function hideNative(){
    var t=findNative('In diesem Schritt übersetzen wir das Inventarprodukt');
    if(t){ var tl=topLevel(t); if(tl && tl.id!=='tsreuse') tl.style.setProperty('display','none','important'); }
    var k=findNative('Kurz gesagt: Die Zutat wird einmal gepflegt');
    if(k){ var kb=k.closest('[id^="block-"]')||k; kb.style.setProperty('display','none','important');
      var ka=document.getElementById(kb.id.replace(/^block-/,'')); if(ka) ka.style.setProperty('display','none','important'); }
    var f=document.getElementById('block-38eb9546553480fea559e458d25dd0da');
    if(f){ f.style.setProperty('font-weight','400','important'); f.style.setProperty('font-size','16px','important'); }
  }
  function findAnchor(){
    var t=findNative('In diesem Schritt übersetzen wir das Inventarprodukt');
    if(t) return topLevel(t);
    return document.getElementById('block-396b9546553480a5b5a4d06877f1543c');
  }
  function mount(){
    if(!on()){ var e=document.getElementById('tsreuse'); if(e&&e.parentNode)e.parentNode.removeChild(e); return; }
    hideNative();
    if(document.getElementById('tsreuse')) return;
    var a=findAnchor(); if(!a) return;
    injectCSS();
    var root=build();
    a.parentNode.insertBefore(root, a);
    arm(root);
  }
  function boot(){ var tries=0; var iv=setInterval(function(){ tries++; mount(); if(tries>40) clearInterval(iv); },300);
    new MutationObserver(function(){ if(on()){ hideNative(); if(!document.getElementById('tsreuse')) mount(); } }).observe(document.documentElement,{childList:true,subtree:true}); }
  if(document.readyState==='complete') boot(); else window.addEventListener('load',boot);
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

/* modul-2 — Section-Headings: die Wörter "Herzstück" / "bauen" / "Ende hast" beige (Lineal-Schrift kommt aus kurs.css).
   Wird per JS in .ts-m2-gold gewrappt, selbstheilend via debounced Observer (Muster wie toneLastWord). */
(function(){
  if(window.__tsm2) return; window.__tsm2 = true;
  function on(){ return /\/modul-2-das-notion-ai-backoffice-system\/?$/.test(location.pathname); }

  function wrapWord(id, word){
    var el=document.getElementById(id); if(!el) return;
    if(el.querySelector('.ts-m2-gold')) return;
    var w=document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n;
    while(n=w.nextNode()){
      var i=n.nodeValue.indexOf(word);
      if(i>-1){
        var after=n.splitText(i); after.splitText(word.length);
        var span=document.createElement('span'); span.className='ts-m2-gold'; span.textContent=word;
        after.parentNode.replaceChild(span, after); return;
      }
    }
  }

  function apply(){
    if(!on()) return;
    wrapWord('block-397b9546553480b18f14f64a88c4e98e','Herzstück');
    wrapWord('block-397b95465534806b9ed5d5ede61dd474','bauen');
    wrapWord('block-397b95465534805e8d76e9befe98ed4f','Ende hast');
  }

  apply();
  document.addEventListener('DOMContentLoaded', apply);
  /* debounced Observer (wie toneLastWord): React kann Heading spät mounten oder den Span strippen -> nachziehen */
  var _t=null;
  new MutationObserver(function(){ if(_t) return; _t=setTimeout(function(){ _t=null; apply(); },200); })
    .observe(document.documentElement,{childList:true,subtree:true});
})();

/* ---- */

/* modul-2 — ZWEI Full-Bleed-Animationen (.tsmb), aufgesplittet:
   TEIL 1 "Fundament" (#tsm2build)  — ZWISCHEN Intro-Absatz und 2-Spalten-Textblock; Bereiche Food/Drinks/Finance + 7 Kacheln.
   TEIL 2 "Ausbau"    (#tsm2build2) — UNTER dem 2-Spalten-Textblock, ÜBER "Was du am Ende hast"; Bereiche Key Metrics/Operations/Vision + 7 andere Kacheln.
   Jede läuft EINMAL beim Scrollen in den Viewport (danach statisch → flüssig, KEINE Dauer-Animation, kein Loop, kein Klick).
   Bilder = DB-Cover aus img/modul2/ via GitHub Pages. reduced-motion → sofort fertiger Zustand. */
(function(){
  if(window.__tsm2build) return; window.__tsm2build = true;
  function on(){ return /\/modul-2-das-notion-ai-backoffice-system\/?$/.test(location.pathname); }
  var IMGBASE="https://tastyrob123.github.io/kurs/img/modul2/", N=7;
  var IC={
    food:"<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'><path d='M6 3v6a2 2 0 0 0 2 2 2 2 0 0 0 2-2V3'/><path d='M8 11v10'/><path d='M17 3c-1.4 0-2.2 2-2.2 4.6 0 2 .9 3 2.2 3.2V21'/></svg>",
    drinks:"<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'><path d='M6 4h12l-5 8v6'/><path d='M9 18h6'/><path d='M8.5 8h7'/></svg>",
    finance:"<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'><path d='M5 20h14'/><path d='M7 20v-6'/><path d='M12 20V8'/><path d='M17 20v-9'/></svg>",
    metrics:"<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'><path d='M4 14a8 8 0 0 1 16 0'/><path d='M12 14l4-3'/><circle cx='12' cy='14' r='1'/></svg>",
    ops:"<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'><path d='M4 8h10'/><circle cx='17' cy='8' r='2.4'/><path d='M20 16H10'/><circle cx='7' cy='16' r='2.4'/></svg>",
    vision:"<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'><path d='M3 12s3.2-6 9-6 9 6 9 6-3.2 6-9 6-9-6-9-6z'/><circle cx='12' cy='12' r='2.2'/></svg>"
  };
  /* Zwei Teile: je 3 Bereiche ([icon,label]) + 7 Kacheln ([label,bild]).
     anchor = stabiler Content-Block; place: 'afterIntro' = Top-Level hinter dem Intro | 'afterColList' = hinter dem 2-Spalten-Block. */
  var PARTS=[
    { id:'tsm2build', eyebrow:'Dein Backoffice', title:'Sechs Bereiche. Ein Fundament in sieben Schritten.',
      cap:'Das Fundament: <b>Food, Drinks &amp; Finance Studio</b> — in sieben Schritten.',
      areas:[['food','Foodquartier'],['drinks','Drinksquartier'],['finance','Finance Studio']],
      tiles:[['Inventar','inventurliste.jpg'],['Lieferpartner','lieferanten.jpg'],['Zutaten','zutaten.jpg'],['Rezepturen','rezepturen.jpg'],['Gerichte','mehrwert-zielbild.jpg'],['Kalkulation','menuekalkulation.jpg'],['Menü','food-drinks.jpg']],
      anchor:'block-397b95465534803a8f54d1ee1b7bd80c', place:'afterIntro' },
    { id:'tsm2build2', eyebrow:'Der Ausbau', title:'Der Ausbau. Die nächsten 7 Schritte zum Backoffice.',
      cap:'Der Ausbau: <b>Key Metrics, Operations &amp; Vision</b> — sieben weitere Bausteine.',
      areas:[['metrics','Key Metrics'],['ops','Operations Area'],['vision','Vision Frame']],
      tiles:[['Operations Area','operations.jpg'],['Allergene','allergene.jpg'],['Gemeinkosten & Löhne','gemeinkosten-loehne.jpg'],['Key Metrics','key-metrics.jpg'],['Multi Standorte','multistandort.jpg'],['Vision Frame','vision-frame.jpg'],['Allgemeine Tipps','allgemeine-tipps.jpg']],
      anchor:'block-397b9546553480dfa291d21d2b5e7456', place:'afterColList' }
  ];

  function build(cfg){
    var el=document.createElement('div'); el.id=cfg.id; el.className='tsmb'; el.setAttribute('data-phase','0');
    var areasH=cfg.areas.map(function(a,i){ return "<div class='tb-area hot' style='transition-delay:"+(i*70)+"ms'><span class='tb-ic'>"+IC[a[0]]+"</span><span class='tb-al'>"+a[1]+"</span></div>"; }).join('');
    var stepsH=''; for(var i=0;i<N;i++){ stepsH+="<div class='tb-step'><div class='tb-brick'><img src='"+IMGBASE+cfg.tiles[i][1]+"' alt='' loading='lazy' decoding='async'></div><div class='tb-sl'>"+cfg.tiles[i][0]+"</div></div>"; }
    el.innerHTML="<div class='tb-stage'><div class='tb-grain'></div>"+
      "<div class='tb-inner'>"+
      "<div class='tb-eyebrow'>"+cfg.eyebrow+"</div>"+
      "<h3 class='tb-title'>"+cfg.title+"</h3>"+
      "<div class='tb-areas'>"+areasH+"</div>"+
      "<div class='tb-rail'><div class='tb-track'><span class='tb-fill'></span></div>"+stepsH+"</div>"+
      "<div class='tb-caption'></div>"+
      "</div></div>";
    return el;
  }

  function sequence(el, cfg){
    var fill=el.querySelector('.tb-fill'), cap=el.querySelector('.tb-caption');
    var steps=[].slice.call(el.querySelectorAll('.tb-step'));
    var STEP_MS=430, started=false, io=null;
    /* EINMALIGER Aufbau: Bereiche steigen auf, dann 7 Kacheln gestaffelt rein, Gold-Linie wächst mit. */
    function reveal(){
      if(started) return; started=true; cleanup();
      el.classList.add('a-in');
      cap.innerHTML=cfg.cap; setTimeout(function(){ cap.classList.add('show'); }, 480);
      for(var i=0;i<N;i++){ (function(i){
        setTimeout(function(){ steps[i].classList.add('in'); fill.style.transform='scaleX('+(i/(N-1))+')'; if(i===N-1) steps[i].classList.add('fin'); }, 340+i*STEP_MS);
      })(i); }
    }
    function cleanup(){ if(io) io.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); }
    function inView(){ var r=el.getBoundingClientRect(); return r.top < innerHeight*0.85 && r.bottom > 40; }
    function onScroll(){ if(!started && inView()) reveal(); }
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      el.classList.add('a-in'); steps.forEach(function(s){ s.classList.add('in'); }); steps[N-1].classList.add('fin');
      fill.style.transform='scaleX(1)'; cap.innerHTML=cfg.cap; cap.classList.add('show'); return;
    }
    /* Reveal, sobald in den Viewport gescrollt — IntersectionObserver + Scroll-Fallback (robust, auch falls IO gedrosselt).
       Läuft genau EINMAL (cleanup nach reveal); kein Loop, keine Dauer-Last. */
    if('IntersectionObserver' in window){
      io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting) reveal(); }); },{threshold:.25});
      io.observe(el);
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll);
    onScroll();   // initial: falls schon im Viewport (z.B. Teil 1 above-the-fold)
  }

  function mount(cfg){
    var anchor=document.getElementById(cfg.anchor);
    if(!anchor) return;
    var ex=document.getElementById(cfg.id);
    if(ex && ex.isConnected) return;                 // schon montiert
    if(ex && ex.parentNode) ex.parentNode.removeChild(ex);
    var parent, ref, el=build(cfg);
    if(cfg.place==='afterIntro'){
      var root=anchor.closest('.notion-root'); if(!root) return;
      var top=anchor; while(top.parentElement && top.parentElement!==root){ top=top.parentElement; }
      if(top.parentElement!==root) return;
      parent=root; ref=top.nextSibling;
    } else {                                          // afterColList: hinter den ganzen 2-Spalten-Block
      var cl=anchor.closest('.notion-column-list'); if(!cl || !cl.parentNode) return;
      parent=cl.parentNode; ref=cl.nextSibling;
    }
    parent.insertBefore(el, ref);
    sequence(el, cfg);
  }
  function mountAll(){ if(!on()) return; PARTS.forEach(mount); }

  mountAll();
  document.addEventListener('DOMContentLoaded', mountAll);
  var _tb=null;
  new MutationObserver(function(){ if(_tb) return; _tb=setTimeout(function(){ _tb=null; mountAll(); },200); })
    .observe(document.documentElement,{childList:true,subtree:true});
})();

/* ---- */


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
    #tsEcoRoot .net-title { font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif; font-size: clamp(30px,4.4vw,52px); font-weight:600; letter-spacing:-.03em; color:#fff; line-height:1.1; margin:0 0 12px; }
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
        <h2 class="net-title">Vernetztes Ökosystem.<br>Eine <span>Datenquelle</span>.</h2>
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
        <div class="net-arg"><div class="net-arg-title">Effektiver Datenfluss</div><p class="net-arg-text">Vom Lieferpartner über die Rezeptur bis zum Deckungsbeitrag — alle Daten fließen automatisch durch das gesamte System.</p></div>
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
  #tsq .tsq-k{display:inline-block;font-size:.58rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:#c7b489;margin:24px 0 10px}
  #tsq .tsq-h{font-size:1.45rem;font-weight:600;letter-spacing:-.015em;line-height:1.12;margin:0 0 18px;transition:color .3s ease}
  #tsq .tsq-h .g{color:#c7b489}
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

/* mehrwert-zielbild — "Das Zielbild: was ein fertiges Gericht dir zeigt."-Absatz (strong):
   Phrase "was ein fertiges Gericht dir zeigt." in .ts-accent (beige) wrappen; Klasse ts-mwz-goal setzen
   (groß/mittig/Lineal via kurs.css). Absatz per Text gefunden, nicht per Block-ID (driftsicher).
   Selbstheilend (Muster wie toneLastWord/ts-m2-gold): React kann den Span strippen -> nachziehen. */
(function(){
  if(window.__tsMwzGoal) return; window.__tsMwzGoal = true;
  function on(){ return /\/mehrwert-zielbild\/?$/.test(location.pathname); }
  var PHRASE='was ein fertiges Gericht dir zeigt.';
  var FULL='Das Zielbild: '+PHRASE;
  function apply(){
    if(!on()) return;
    var scope=document.querySelector('.page__mehrwert-zielbild'); if(!scope) return;
    var el=null, ps=scope.querySelectorAll('.notion-text, p');
    for(var j=0;j<ps.length;j++){ if((ps[j].textContent||'').trim()===FULL){ el=ps[j]; break; } }
    if(!el) return;
    el.classList.add('ts-mwz-goal');
    var strong=el.querySelector('strong')||el;
    if(strong.querySelector('.ts-accent')) return;   /* schon getont & Span intakt */
    var w=document.createTreeWalker(strong, NodeFilter.SHOW_TEXT), n;
    while(n=w.nextNode()){
      var i=n.nodeValue.indexOf(PHRASE);
      if(i>-1){ var PACC=PHRASE.replace(/[.!?…]+$/,'');   /* Satzzeichen bleibt weiss (ausserhalb Span) */
        var after=n.splitText(i); after.splitText(PACC.length);
        var span=document.createElement('span'); span.className='ts-accent'; span.textContent=PACC;
        after.parentNode.replaceChild(span, after); return; }
    }
  }
  apply();
  document.addEventListener('DOMContentLoaded', apply);
  var _t=null;
  new MutationObserver(function(){ if(_t) return; _t=setTimeout(function(){ _t=null; apply(); },200); })
    .observe(document.documentElement,{childList:true,subtree:true});
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
  /* Seiten-Map: auf welcher Lektion führt "Nächste Lektion" wohin */
  var PAGES = [
    { re:/\/mehrwert-zielbild\/?$/, href:'/inventurliste' },
    { re:/\/inventurliste\/?$/,     href:'/lieferpartner-ansprechpartner-lieferantenvertrge' },
    { re:/\/lieferpartner-ansprechpartner-lieferantenvertrge\/?$/, href:'/zutatenliste' },
    { re:/\/zutatenliste\/?$/,       href:'/rezepturen' },
    { re:/\/rezepturen\/?$/,         href:'/gemeinkosten-mitarbeiterlhne' },
    { re:/\/gemeinkosten-mitarbeiterlhne\/?$/, href:'/gerichte-getrnke-finaler-schritt' }
  ];
  function pageHref(){
    for(var i=0;i<PAGES.length;i++){ if(PAGES[i].re.test(location.pathname)) return PAGES[i].href; }
    return null;
  }
  function mount(){
    var href = pageHref();
    var ex = document.getElementById('ts-next');
    if(!href){ if(ex){ var w=document.getElementById('ts-next-wrap'); if(w&&w.parentNode)w.parentNode.removeChild(w); else if(ex.parentNode)ex.parentNode.removeChild(ex); } return; }
    if(ex){ if(ex.getAttribute('href')!==href) ex.setAttribute('href',href); return; }
    var host = document.querySelector('.notion-root') || document.querySelector('main');
    if(!host) return;
    var wrap = document.createElement('div');
    wrap.id = 'ts-next-wrap';
    var a = document.createElement('a');
    a.id = 'ts-next';
    a.href = href;
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

  /* /rezepturen (DB V) — feste Learnings (keine Notion-"Learnings"-Überschrift auf der Seite) */
  var REZ = [
    "Du hast die Rezepturen-Datenbank gebaut — sie bündelt deine Zutaten zu fertigen Bausteinen für Gerichte und Getränke.",
    "Du verstehst, wie eine Rezeptur alle Zutaten zusammenzieht und ihr Gesamtvolumen automatisch in Gramm oder Liter rechnet.",
    "Du weißt, wie die Portionsgröße alles aufteilt: Menge, Rohstoffkosten und Nährwerte pro Portion entstehen von selbst.",
    "Du kannst die Rezeptur um Personalkosten erweitern und siehst, was dich eine Portion in der Zubereitung wirklich kostet."
  ];

  var CSS = `
  #tsl{width:100vw;max-width:100vw;margin:44px 0 10px;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);padding:0 clamp(20px,4vw,56px);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",Helvetica,Arial,sans-serif;color:#fff}
  #tsl *{box-sizing:border-box}
  #tsl .tsl-head{text-align:center;margin:0 auto 66px}
  #tsl .tsl-eyebrow{display:inline-block;font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;font-size:.62rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#c7b489;margin:0 0 14px}
  #tsl .tsl-title{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;font-size:clamp(30px,5vw,46px);font-weight:600;letter-spacing:-.02em;line-height:1.05;margin:0}
  #tsl .tsl-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(20px,3vw,40px);max-width:1180px;margin:0 auto;justify-items:center}
  #tsl .tsl-cell{opacity:0;transform:translateY(22px);filter:blur(8px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1),filter .9s cubic-bezier(.16,1,.3,1);transition-delay:calc(var(--i) * 140ms);width:100%;max-width:250px}
  #tsl .tsl-cell.in{opacity:1;transform:translateY(0);filter:blur(0)}
  #tsl .tsl-orb{position:relative;width:100%;aspect-ratio:1;border-radius:50%;display:flex;align-items:center;justify-content:center;text-align:center;
    padding:clamp(20px,2.6vw,32px);
    background:radial-gradient(120% 120% at 38% 28%, rgba(199,180,137,.20), rgba(255,255,255,.035) 46%, rgba(10,12,20,.85) 78%);
    border:1px solid rgba(255,255,255,.12);
    box-shadow:0 18px 44px -18px rgba(0,0,0,.75), inset 0 1px 1px rgba(255,255,255,.10), inset 0 0 60px rgba(199,180,137,.06);
    animation:tsl-float 7s ease-in-out infinite;will-change:transform;
    transition:border-color .45s ease, box-shadow .45s ease}
  #tsl .tsl-cell:nth-child(1) .tsl-orb{animation-delay:0s}
  #tsl .tsl-cell:nth-child(2) .tsl-orb{animation-delay:-1.6s}
  #tsl .tsl-cell:nth-child(3) .tsl-orb{animation-delay:-3.2s}
  #tsl .tsl-cell:nth-child(4) .tsl-orb{animation-delay:-4.8s}
  #tsl .tsl-orb::before{content:"";position:absolute;top:10%;left:16%;width:34%;height:24%;border-radius:50%;background:radial-gradient(closest-side, rgba(255,255,255,.16), rgba(255,255,255,0));pointer-events:none}
  #tsl .tsl-orb:hover{border-color:rgba(199,180,137,.5);box-shadow:0 22px 50px -18px rgba(0,0,0,.8), inset 0 1px 1px rgba(255,255,255,.12), 0 0 40px rgba(199,180,137,.22)}
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
  function buildHTML(items){
    return '<section id="tsl">' +
      '<div class="tsl-head"><span class="tsl-eyebrow">Was du mitnimmst</span><h2 class="tsl-title">Learnings</h2></div>' +
      '<div class="tsl-grid">' + items.map(function(t,i){return orb(i,t);}).join('') + '</div>' +
    '</section>';
  }
  /* Seiten-Map: mehrwert-zielbild = fixe Texte (Original), inventurliste = Texte
     dynamisch aus der Notion-Bullet-Liste unter "Learnings" (Robert darf sie in
     Notion editieren/ergänzen, die Bubbles ziehen automatisch nach) */
  var PAGES = [
    { re:/\/mehrwert-zielbild\/?$/, items:ITEMS },
    { re:/\/inventurliste\/?$/,     items:null },
    { re:/\/lieferpartner-ansprechpartner-lieferantenvertrge\/?$/, items:null },
    { re:/\/zutatenliste\/?$/,      items:null },
    { re:/\/rezepturen\/?$/,        items:REZ }
  ];
  function pageCfg(){
    for(var i=0;i<PAGES.length;i++){ if(PAGES[i].re.test(location.pathname)) return PAGES[i]; }
    return null;
  }
  function readItems(head){
    var out=[], hb=blockOf(head), n=hb.nextElementSibling;
    while(n){
      var isList = n.matches('ul, ol, .notion-list, [class*="bulleted"], [class*="numbered"]') ||
                   (n.querySelector && n.querySelector('ul, ol, .notion-list'));
      if(!isList) break;
      n.querySelectorAll('li').forEach(function(li){
        var t=(li.textContent||'').trim();
        if(t) out.push(t);
      });
      n = n.nextElementSibling;
    }
    return out;
  }

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
    var cfg = pageCfg();
    if (!cfg){
      var e = document.getElementById('tsl'); if (e && e.parentNode) e.parentNode.removeChild(e); return;
    }
    if (document.getElementById('tsl')) return;
    var head = findHead();
    var items = cfg.items || (head ? readItems(head) : []);
    if (!items.length) return;
    injectStyle();
    var d = document.createElement('div'); d.innerHTML = buildHTML(items);
    var node = d.firstElementChild;
    if (head){
      var hb = hideOriginals(head);
      hb.parentNode.insertBefore(node, hb);
    } else {
      /* Keine Notion-"Learnings"-Überschrift (z. B. /rezepturen mit festen items):
         ans Seitenende, aber ÜBER den "Nächste Lektion"-Button. */
      var root = document.querySelector('.notion-root') || document.querySelector('main');
      if (!root) return;
      var nx = document.getElementById('ts-next-wrap');
      if (nx && nx.parentNode === root) root.insertBefore(node, nx);
      else root.appendChild(node);
    }
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
    if(h.querySelector('.ts-accent')) return;   /* self-healing: schon getont & Span intakt -> überspringen */
    var txt=(h.textContent||'').trim(); if(!txt) return;
    var last=txt.split(/\s+/).pop(); if(!last) return;
    last=last.replace(/[.!?…:;,]+$/,''); if(last.length<2) return;   /* Satzzeichen bleibt weiss (ausserhalb Span) */
    var w=document.createTreeWalker(h,NodeFilter.SHOW_TEXT,null),node,target=null;
    while(node=w.nextNode()){ if(node.nodeValue.indexOf(last)>=0) target=node; }
    if(!target) return;
    var i=target.nodeValue.lastIndexOf(last); if(i<0) return;
    var b=target.nodeValue.slice(0,i), a=target.nodeValue.slice(i+last.length);
    var sp=document.createElement('span'); sp.className='ts-accent'; sp.textContent=last;
    var f=document.createDocumentFragment();
    if(b)f.appendChild(document.createTextNode(b)); f.appendChild(sp); if(a)f.appendChild(document.createTextNode(a));
    target.parentNode.replaceChild(f,target);
  }
  function run(){ document.querySelectorAll('.notion-root h1.notion-heading').forEach(toneLastWord); }
  run();
  /* dauerhafter, debounced Observer: React kann die H1 spät mounten oder den Span strippen -> immer wieder nachziehen */
  var t=null;
  new MutationObserver(function(){ if(t) return; t=setTimeout(function(){ t=null; run(); },200); })
    .observe(document.documentElement,{childList:true,subtree:true});
})();

/* ---- */

/* zutatenliste — H1 "Wofür eine Zutaten DB ?" : ganze Zeile in Lineal TS,
   Phrase "Zutaten DB" beige via .ts-accent (#c7b489). super.so liefert den
   Notion-Text teils halb-gesynct ("Wofür eine Zuta ") -> JS erzwingt die
   finale Darstellung (Notion bleibt Text-SSOT). Block-ID-Anker, selbstheilend,
   ueberschreibt auch den generischen Letztes-Wort-Toner __tsTone. */
(function(){
  if(window.__tsZdbHead) return; window.__tsZdbHead=true;
  var ID='block-395b9546553480fcb4a0f065b83ee656';
  var BLACK='Wofür eine ', ACCENT='Zutaten DB', TAIL=' ?';
  function injectCSS(){
    if(document.getElementById('tszdb-css')) return;
    var s=document.createElement('style'); s.id='tszdb-css';
    s.textContent='#'+ID+'{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;font-weight:600}';
    document.head.appendChild(s);
  }
  function norm(s){ return (s||'').replace(/\s+/g,' ').trim(); }
  function tone(){
    var el=document.getElementById(ID); if(!el) return;
    var want=norm(BLACK+ACCENT+TAIL);
    var sp=el.querySelector('.ts-accent');
    if(sp && norm(sp.textContent)===norm(ACCENT) && norm(el.textContent)===want) return; /* schon korrekt -> nichts tun (verhindert Ping-Pong) */
    while(el.firstChild) el.removeChild(el.firstChild);
    el.appendChild(document.createTextNode(BLACK));
    var s=document.createElement('span'); s.className='ts-accent'; s.textContent=ACCENT;
    el.appendChild(s);
    el.appendChild(document.createTextNode(TAIL));
  }
  function apply(){ injectCSS(); tone(); }
  apply();
  document.addEventListener('DOMContentLoaded', apply);
  var _t=null;
  new MutationObserver(function(){ if(_t) return; _t=setTimeout(function(){ _t=null; apply(); },200); })
    .observe(document.documentElement,{childList:true,subtree:true});
})();

/* ---- */

/* zutatenliste — Section-Heading "Die fertige Übersicht." : Wort "Übersicht" beige (.ts-gold).
   Lineal-Schrift + Größe kommen aus kurs.css; hier nur der Wort-Wrap, selbstheilend (Muster wie __tsm2). */
(function(){
  if(window.__tsZdbUeber) return; window.__tsZdbUeber=true;
  var ID='block-39bb9546553480158645e1054324e824', WORD='Übersicht';
  function on(){ return /\/zutatenliste\/?$/.test(location.pathname); }
  function wrap(){
    if(!on()) return;
    var el=document.getElementById(ID); if(!el) return;
    if(el.querySelector('.ts-gold')) return;
    var w=document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n;
    while(n=w.nextNode()){
      var i=n.nodeValue.indexOf(WORD);
      if(i>-1){
        var after=n.splitText(i); after.splitText(WORD.length);
        var span=document.createElement('span'); span.className='ts-gold'; span.textContent=WORD;
        after.parentNode.replaceChild(span, after); return;
      }
    }
  }
  wrap();
  document.addEventListener('DOMContentLoaded', wrap);
  var _tu=null;
  new MutationObserver(function(){ if(_tu) return; _tu=setTimeout(function(){ _tu=null; wrap(); },200); })
    .observe(document.documentElement,{childList:true,subtree:true});
})();

/* ---- */

(function(){
  return; /* Lesson-Stats auf /zutatenliste entfernt (Robert 2026-07-13) — die #tsd4-Erklaer-Animation uebernimmt diese Position. Kennzahlen bleiben SSOT in der Vault-Lektionsdatei. Zum Reaktivieren dieses return entfernen. */
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
    '#tsmb-root{--tsmb-gold:#c7b489;--tsmb-ease:cubic-bezier(.16,1,.3,1);margin:0;display:flex;flex-direction:column;align-items:center;gap:8px;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;}',
    '.notion-column-list.tsmb-centered-row{align-items:center;}',
    '@media(min-width:768px){#tsmb-root{padding-top:51px;}}',
    '#tsmb-root .tsmb-caption{width:100%;text-align:center;font-size:15px;font-weight:600;letter-spacing:.005em;color:#fff;margin-top:4px;}',
    '#tsmb-root .tsmb-caption .tsmb-accent{color:var(--tsmb-gold);}',
    '#tsmb-root .tsmb-tile{position:relative;width:100%;max-width:520px;cursor:pointer;border-radius:12px;filter:drop-shadow(0 10px 30px rgba(0,0,0,.45));transition:transform .5s var(--tsmb-ease),filter .5s var(--tsmb-ease);}',
    '#tsmb-root .tsmb-tile:hover{transform:translateY(-4px) scale(1.02);animation:tsmbHeartbeat 2.6s var(--tsmb-ease) infinite;}',
    '@keyframes tsmbHeartbeat{0%,100%{filter:drop-shadow(0 22px 52px rgba(0,0,0,.6)) drop-shadow(0 6px 18px rgba(199,180,137,.14));}50%{filter:drop-shadow(0 22px 52px rgba(0,0,0,.6)) drop-shadow(0 8px 26px rgba(199,180,137,.30));}}',
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
    for(var k=0;k<target.children.length;k++){ var ch=target.children[k]; if(ch.id!=='tsmb-root' && ch.classList && ch.classList.contains('notion-text') && !(ch.textContent||'').trim()){ ch.style.display='none'; } }
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
  #tsdb .tsdb-title{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;font-size:clamp(24px,3.2vw,36px);font-weight:600;letter-spacing:-.02em;line-height:1.12;color:#fff;margin:0 0 10px}
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
        '<h3 class="tsdb-title">Deckungsbeitrag. <span>Stufe für Stufe</span>.</h3>' +
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
  var IMG="https://files.catbox.moe/9ah8jn.webp";
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
        '<div class="ts-hero__eyebrow">Lektion 2.1</div>'+
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

/* ---- */

/* gemeinkosten-mitarbeiterlhne — Hero "DB VI–VII : GK und Löhne" (Muster: inventurliste-Hero).
   Bild = 3-Laptop-Cover (Finance Studio) freigestellt auf Transparenz (aus GK & Löhne.png). Text = HTML/CSS-Overlay. */
(function(){
  var IMG="https://files.catbox.moe/sscg6x.webp";
  var LOGO="https://files.catbox.moe/au80tp.png";
  function on(){ return /\/gemeinkosten-mitarbeiterlhne\/?$/.test(location.pathname); }
  function mount(){
    if(!on()) return;
    var sc=document.querySelector(".super-content");
    if(!sc || sc.querySelector(".ts-hero")) return;
    var hero=document.createElement("div");
    hero.className="ts-hero";
    hero.innerHTML=
      '<img class="ts-hero__img" alt="DB VI–VII — Gemeinkosten & Löhne" src="'+IMG+'">'+
      '<div class="ts-hero__text">'+
        '<img class="ts-hero__logo" alt="Tasty Studios" src="'+LOGO+'">'+
        '<div class="ts-hero__eyebrow">Lektion 2.5</div>'+
        '<h1 class="ts-hero__title">DB VI – VII :<br><span class="ts-gold">GK und Löhne</span></h1>'+
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

/* ============================================================
   gemeinkosten-mitarbeiterlhne — "Was sind Gemeinkosten?"
   Animiertes Kostenblock-Grid (#tsgk) ersetzt die 8er-Bullet-
   liste (Muster: #tslink/inventurliste — Glaskarten, Champagner-
   Gold-Glow, Lineal-TS-Labels). Reveal per Keyframe-Animation
   + inView-Polling (nicht transition/IO — s. Kommentar unten,
   busy Super.so-Seite). Stagger-Reveal (.on -> .done), Icon-
   Linien zeichnen sich (stroke-dashoffset, pathLength=1).
   reduced-motion = alles statisch. Kategorien = SSOT Lektion 2.5.
   ============================================================ */
(function(){
  if(window.__tsgk) return; window.__tsgk=true;
  var GLOW='199,180,137';
  var CSS=`
  /* Full-Bleed: aus der schmalen Notion-Spalte auf ~volle Viewport-Breite ausbrechen
     (Spalte ist zentriert -> Standard 50%/50vw-Technik). */
  /* Zentrierung bulletproof: aeusserer Container bricht auf volle Viewport-Breite
     aus (50%/50vw-Trick, hier bewaehrt), innerer Grid wird auf 1320 gedeckelt und
     per margin:auto exakt mittig gesetzt — unabhaengig von der Notion-Spaltenbreite. */
  #tsgk{width:100vw;max-width:100vw;margin:34px 0 30px;margin-left:calc(50% - 50vw);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;color:#fff}
  #tsgk *{box-sizing:border-box}
  #tsgk .tsgk-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;width:min(1320px,92vw);margin:0 auto}
  #tsgk .tsgk-card{position:relative;display:block;aspect-ratio:6/5;border-radius:18px;overflow:hidden;background:#04050a;border:1px solid rgba(255,255,255,.09);box-shadow:0 22px 50px -32px rgba(0,0,0,.9);opacity:0;transform:translateY(18px) scale(.985);will-change:transform,opacity;transition:border-color .4s ease,box-shadow .5s ease}
  /* Reveal = Keyframe-Animation (NICHT transition): auf dieser busy Super.so-Seite
     bleiben class-getriggerte Transitions haengen. .on setzt zusaetzlich den End-
     zustand direkt, damit der Inhalt nie von der Animation abhaengt. */
  #tsgk .tsgk-card.on{opacity:1;transform:none;animation:tsgk-rise .7s cubic-bezier(.22,1,.36,1) both;animation-delay:var(--d,0s)}
  #tsgk .tsgk-card.on.done{animation:none}
  #tsgk .tsgk-card.on.done:hover{border-color:rgba(var(--g),.5);transform:translateY(-4px);animation:tsgk-hb 2.6s cubic-bezier(.4,0,.3,1) infinite}
  #tsgk .tsgk-bg{position:absolute;inset:0;z-index:0;border-radius:inherit;overflow:hidden}
  #tsgk .tsgk-bg img{width:100%;height:100%;object-fit:cover;object-position:center 68%;display:block}
  #tsgk .tsgk-bg::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(4,5,10,.92) 0%,rgba(4,5,10,.62) 30%,rgba(4,5,10,.14) 46%,rgba(4,5,10,0) 60%),radial-gradient(120% 80% at 50% 100%,rgba(4,5,10,.5),rgba(4,5,10,0) 60%)}
  #tsgk .tsgk-in{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center;padding:32px 22px 0}
  #tsgk .tsgk-logo{display:block;height:30px;width:auto;margin:0 auto 20px;filter:drop-shadow(0 1px 3px rgba(0,0,0,.7))}
  #tsgk .tsgk-k{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;font-weight:600;font-size:.66rem;letter-spacing:.1em;color:#c7b489;margin-bottom:10px;text-shadow:0 1px 2px rgba(0,0,0,.9),0 2px 8px rgba(0,0,0,.8)}
  #tsgk .tsgk-h{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;font-size:1.66rem;font-weight:600;letter-spacing:-.012em;line-height:1.14;color:#fff;margin:0;text-shadow:0 0 6px rgba(0,0,0,.95),0 2px 5px rgba(0,0,0,1),0 4px 18px rgba(0,0,0,.92),0 0 26px rgba(0,0,0,.7)}
  @keyframes tsgk-rise{from{opacity:0;transform:translateY(18px) scale(.985)}to{opacity:1;transform:none}}
  @keyframes tsgk-hb{0%{box-shadow:0 4px 14px rgba(var(--g),.10),0 0 14px rgba(var(--g),.10)}18%{box-shadow:0 6px 22px rgba(var(--g),.30),0 0 46px rgba(var(--g),.34)}32%{box-shadow:0 5px 18px rgba(var(--g),.16),0 0 26px rgba(var(--g),.18)}46%{box-shadow:0 6px 20px rgba(var(--g),.26),0 0 40px rgba(var(--g),.28)}72%,100%{box-shadow:0 4px 14px rgba(var(--g),.10),0 0 14px rgba(var(--g),.10)}}
  @media(max-width:860px){#tsgk .tsgk-grid{grid-template-columns:repeat(2,1fr);gap:16px}#tsgk .tsgk-in{padding:28px 18px 0}#tsgk .tsgk-h{font-size:1.54rem}#tsgk .tsgk-k{font-size:.66rem}#tsgk .tsgk-logo{height:30px;margin-bottom:18px}}
  @media(max-width:460px){#tsgk .tsgk-grid{gap:12px}#tsgk .tsgk-in{padding:22px 14px 0}#tsgk .tsgk-h{font-size:1.3rem}#tsgk .tsgk-k{font-size:.62rem}#tsgk .tsgk-logo{height:26px;margin-bottom:14px}}
  @media(prefers-reduced-motion:reduce){#tsgk .tsgk-card,#tsgk .tsgk-card.on{opacity:1;transform:none;animation:none}#tsgk .tsgk-card.on.done:hover{transform:none;animation:none;box-shadow:0 0 26px rgba(var(--g),.22)}}
  #tsgk .tsgk-card{cursor:pointer}
  #tsgk .tsgk-card:focus-visible{outline:2px solid rgba(199,180,137,.75);outline-offset:3px}
  /* ===== Klick-Modal: elegantes Info-Fenster mit Hero-Cover ===== */
  .tsgk-ov{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:24px;opacity:0;pointer-events:none;transition:opacity .3s ease;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif}
  .tsgk-ov.open{opacity:1;pointer-events:auto}
  .tsgk-ov__scrim{position:absolute;inset:0;background:rgba(3,4,8,.78);backdrop-filter:blur(9px) saturate(1.08);-webkit-backdrop-filter:blur(9px) saturate(1.08)}
  .tsgk-ov__box{position:relative;z-index:1;display:flex;flex-direction:column;width:min(660px,100%);max-height:90vh;overflow:hidden;border-radius:24px;background:linear-gradient(180deg,#0d1119,#080b12);border:1px solid rgba(255,255,255,.10);box-shadow:0 50px 140px -34px rgba(0,0,0,.92);color:#e9ecf3;transform:translateY(16px) scale(.975);transition:transform .34s cubic-bezier(.22,1,.36,1)}
  .tsgk-ov.open .tsgk-ov__box{transform:none}
  .tsgk-ov__x{position:absolute;top:18px;right:18px;z-index:5;width:40px;height:40px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.14);border-radius:50%;background:rgba(10,13,20,.5);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);color:#d7dbe4;font-size:19px;line-height:1;cursor:pointer;transition:background .2s,color .2s,border-color .2s,transform .25s}
  .tsgk-ov__x:hover{background:rgba(255,255,255,.14);color:#fff;border-color:rgba(255,255,255,.26);transform:rotate(90deg)}
  .tsgk-ov__hero{position:relative;flex:none;height:198px;background:#04050a}
  .tsgk-ov__hero .tsgk-ov__heroimg{width:100%;height:100%;object-fit:cover;object-position:center 42%;display:block}
  .tsgk-ov__hero::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(13,17,25,.05) 0%,rgba(13,17,25,0) 32%,rgba(13,17,25,.7) 76%,#0d1119 100%)}
  .tsgk-ov__logo{position:absolute;top:22px;left:32px;z-index:2;height:28px;width:auto;filter:drop-shadow(0 1px 4px rgba(0,0,0,.85))}
  .tsgk-ov__cap{position:absolute;left:0;right:0;bottom:0;z-index:2;padding:0 40px 6px}
  .tsgk-ov__k{font-family:"Lineal TS",-apple-system,sans-serif;font-weight:600;font-size:.8rem;letter-spacing:.16em;color:#d8c193;display:block;margin-bottom:8px;text-shadow:0 1px 3px rgba(0,0,0,.9)}
  .tsgk-ov__h{font-family:"Lineal TS",-apple-system,sans-serif;font-weight:600;font-size:2.15rem;letter-spacing:-.015em;line-height:1.06;color:#fff;margin:0;text-shadow:0 2px 20px rgba(0,0,0,.85),0 1px 4px rgba(0,0,0,.9)}
  .tsgk-ov__body{flex:1 1 auto;min-height:0;overflow:auto;-webkit-overflow-scrolling:touch;padding:28px 40px 40px}
  .tsgk-ov__body::-webkit-scrollbar{width:8px}.tsgk-ov__body::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);border-radius:8px}
  .tsgk-ov__intro{font-size:1.06rem;line-height:1.64;font-weight:300;color:#cbd1dd;margin:0 0 32px}
  .tsgk-ov__sec{margin:0 0 32px}
  .tsgk-ov__sec h4{display:flex;align-items:center;gap:12px;font-family:"Lineal TS",-apple-system,sans-serif;font-weight:600;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:#7f8698;margin:0 0 16px}
  .tsgk-ov__sec h4::before{content:"";width:24px;height:1px;background:linear-gradient(90deg,#c7b489,rgba(199,180,137,.15));flex:none}
  .tsgk-ov__list{list-style:none;margin:0;padding:0}
  .tsgk-ov__list li{position:relative;padding:0 0 0 24px;margin:0 0 12px;font-size:.99rem;line-height:1.5;color:#d3d8e2}
  .tsgk-ov__list li:last-child{margin-bottom:0}
  .tsgk-ov__list li::before{content:"";position:absolute;left:2px;top:8px;width:6px;height:6px;border-radius:50%;background:linear-gradient(145deg,#eaddbe,#c7b489);box-shadow:0 0 8px rgba(199,180,137,.45)}
  .tsgk-calc{border:1px solid rgba(255,255,255,.08);border-radius:16px;overflow:hidden;background:linear-gradient(180deg,rgba(255,255,255,.028),rgba(255,255,255,.008))}
  .tsgk-calc__ex{padding:14px 20px;font-size:.82rem;font-style:italic;line-height:1.45;color:#8b93a6;border-bottom:1px solid rgba(255,255,255,.06)}
  .tsgk-calc__row{display:flex;justify-content:space-between;gap:16px;padding:14px 20px;font-size:.96rem;color:#d3d8e2;border-bottom:1px solid rgba(255,255,255,.045)}
  .tsgk-calc__row span:last-child{color:#fff;font-variant-numeric:tabular-nums;white-space:nowrap;letter-spacing:.01em}
  .tsgk-calc__sum{border-bottom:0;border-top:1px solid rgba(199,180,137,.28);background:linear-gradient(180deg,rgba(199,180,137,.11),rgba(199,180,137,.04));padding-top:15px;padding-bottom:15px}
  .tsgk-calc__sum span{font-family:"Lineal TS",-apple-system,sans-serif;font-weight:600;font-size:1.02rem;color:#fff}
  .tsgk-calc__sum span:last-child{color:#e8d9b6}
  .tsgk-ov__pct{margin:14px 4px 0;font-size:.9rem;line-height:1.5;color:#b7a679}
  .tsgk-ov__tip{margin:30px 0 0;padding:18px 20px 18px 22px;border-radius:14px;background:linear-gradient(180deg,rgba(199,180,137,.1),rgba(199,180,137,.03));border:1px solid rgba(199,180,137,.16);border-left:2px solid #c7b489;font-size:.95rem;line-height:1.6;color:#dfe3ec}
  .tsgk-ov__tip strong{font-family:"Lineal TS",-apple-system,sans-serif;color:#e8d9b6;font-weight:600;letter-spacing:.02em}
  body.tsgk-lock{overflow:hidden}
  @media(max-width:560px){.tsgk-ov{padding:0}.tsgk-ov__box{max-height:100vh;border-radius:0;width:100%}.tsgk-ov__hero{height:158px}.tsgk-ov__body{padding:24px 22px 34px}.tsgk-ov__h{font-size:1.62rem}.tsgk-ov__cap{padding:0 24px 6px}.tsgk-ov__logo{left:24px}.tsgk-ov__intro{font-size:1rem}}
  `;
  /* BG-Bilder liegen im Repo (GitHub Pages), da kurs.js von github.io geladen
     wird -> absolute Pages-URL noetig. Serie 3: Produkt mittig auf reinem Schwarz. */
  var BASE='https://tastyrob123.github.io/kurs/img/gemeinkosten-grid/';
  var LOGO='https://files.catbox.moe/au80tp.png';
  var CARDS=[
    ['Reinigungskosten','reinigungskosten'],
    ['Versicherungen','versicherungen'],
    ['Verwaltung','verwaltung'],
    ['Instandhaltung','instandhaltung'],
    ['Miete & Kaution','miete-kaution'],
    ['Abschreibungen','abschreibungen'],
    ['Marketing','marketing'],
    ['Sonstige Kosten','sonstige-kosten']
  ];
  var TITLE={}; CARDS.forEach(function(c){ TITLE[c[1]]=c[0]; });
  /* Kursinhalt je Kostenblock. Alle Beispielrechnungen beziehen sich auf denselben
     fiktiven Beispielbetrieb (80 Plaetze, ~40.000 EUR Netto-Umsatz/Monat) — reine
     Lehr-Beispiele, keine echten Zahlen. Stil: direkt, Du, kein Verkaufston. */
  var EX='Beispielbetrieb: Restaurant, 80 Plätze, ~40.000 € Netto-Umsatz/Monat (480.000 €/Jahr).';
  var CONTENT={
    'reinigungskosten':{
      intro:'Sauberkeit ist im Gastro-Betrieb keine Kür, sondern Hygienevorschrift und Gästeerlebnis in einem. Reinigungskosten fallen täglich an und werden trotzdem fast immer zu niedrig angesetzt.',
      includes:['Externe Reinigungsfirma für Gastraum & Sanitär','Küchen-Grundreinigung (periodisch)','Fettabscheider entleeren & reinigen (Nachweispflicht)','Reinigungsmittel & Verbrauchsmaterial','Wäscheservice: Tischwäsche, Kochjacken, Handtücher','Fenster- und Sonderreinigung'],
      ex:EX,
      rows:[['Reinigungsfirma Gastraum & WC (6×/Woche, 2 Std, 22 €)','1.144 €'],['Reinigungsmittel & Verbrauch','180 €'],['Wäscheservice','260 €'],['Fettabscheider (anteilig)','200 €'],['Küchen-Grundreinigung (anteilig)','150 €']],
      sum:['Summe / Monat','≈ 1.934 €'],
      pct:'≈ 23.200 € im Jahr — rund 4,8 % vom Umsatz. Faustregel: 3–5 %.',
      tip:'Die Fettabscheider-Reinigung ist gesetzlich vorgeschrieben und nachweispflichtig. Wer sie schleifen lässt, riskiert Ärger mit dem Ordnungsamt und verstopfte Leitungen mitten im Service.'
    },
    'versicherungen':{
      intro:'Ein Wasserschaden, ein Küchenbrand, ein gestürzter Gast — ein einziger Fall kann den Betrieb kosten. Versicherungen sind die Rücklage, die im Ernstfall greift, wenn das eigene Konto es nicht kann.',
      includes:['Betriebshaftpflicht (Personen- & Sachschäden Dritter)','Inhalts-/Geschäftsversicherung (Feuer, Leitungswasser, Sturm, Einbruch)','Betriebsunterbrechung (Umsatzausfall nach Schaden)','Glasversicherung','Elektronik- & Maschinenversicherung','Rechtsschutz für den Betrieb'],
      ex:EX,
      rows:[['Betriebshaftpflicht','650 €'],['Inhaltsversicherung (Einrichtung ~150.000 €)','1.800 €'],['Betriebsunterbrechung','900 €'],['Glasversicherung','240 €'],['Elektronik / Maschinen','480 €'],['Rechtsschutz','380 €']],
      sum:['Summe / Jahr','≈ 4.450 €'],
      pct:'≈ 370 € im Monat — rund 0,9 % vom Umsatz.',
      tip:'Die häufigste Falle ist die Unterversicherung. Ist die Versicherungssumme niedriger als der echte Wiederbeschaffungswert, kürzt die Versicherung im Schaden anteilig — dann bleibst du auf einem Teil sitzen.'
    },
    'verwaltung':{
      intro:'Der Papierkram, den kein Gast sieht — aber der über Bußgelder, Steuernachzahlungen und Nerven entscheidet. Verwaltung ist der Betrieb hinter dem Betrieb.',
      includes:['Steuerberater: Finanzbuchhaltung & Jahresabschluss','Lohn- & Gehaltsabrechnung','Kassensystem inkl. TSE (Pflicht)','Warenwirtschaft / Software','Bank- & Kontoführung','Beiträge IHK & DEHOGA','Telefon, Internet, Bürobedarf'],
      ex:EX,
      rows:[['Steuerberater (FiBu + Abschluss anteilig)','550 €'],['Lohnabrechnung (12 Mitarbeitende)','144 €'],['Kassensystem + TSE-Lizenz','90 €'],['Warenwirtschaft / Software','60 €'],['Telefon & Internet','70 €'],['IHK / DEHOGA (anteilig)','45 €'],['Bürobedarf / Porto','40 €']],
      sum:['Summe / Monat','≈ 999 €'],
      pct:'≈ 12.000 € im Jahr — rund 2,5 % vom Umsatz.',
      tip:'Die TSE (Technische Sicherheitseinrichtung) an der Kasse ist Pflicht. Fehlt sie oder ist sie defekt, wird die unangekündigte Kassennachschau des Finanzamts sofort zum Problem.'
    },
    'instandhaltung':{
      intro:'Kombidämpfer, Kühlhaus, Spülmaschine, Zapfanlage — deine Technik läuft im Dauerbetrieb. Instandhaltung entscheidet, ob sie planbar gewartet wird oder mitten im Freitagabend-Service ausfällt.',
      includes:['Wartungsverträge: Lüftung, Kälte, Kombidämpfer, Spültechnik','Reparaturen & Ersatzteile','Handwerker (Elektro, Sanitär)','Kleinere Anschaffungen & Nachrüstungen','Rücklage für Geräteausfall'],
      ex:EX,
      rows:[['Wartung Lüftungsanlage','700 €'],['Wartung Kälte / Kühlhaus','900 €'],['Wartung Kombidämpfer & Spültechnik','600 €'],['Reparaturen & Ersatzteile','2.400 €'],['Handwerker','1.200 €'],['Rücklage Geräteausfall','1.800 €']],
      sum:['Summe / Jahr','≈ 7.600 €'],
      pct:'≈ 630 € im Monat — rund 1,6 % vom Umsatz. Faustregel: 1–2 % als Rücklage.',
      tip:'Wartung ist planbar, ein Ausfall nie. Ein gewartetes Kühlhaus hält Jahre länger — ein ungewartetes fällt an dem Tag aus, an dem es voll ist. Rücklage bilden, bevor der teure Fall kommt.'
    },
    'miete-kaution':{
      intro:'Meist der größte Fixkostenblock nach Personal und Wareneinsatz. Die Miete läuft, ob der Laden voll ist oder leer — deshalb entscheidet das Verhältnis von Miete zu Umsatz über die Rentabilität.',
      includes:['Kaltmiete','Nebenkosten (Grundsteuer, Müll, Wasser, Allgemeinstrom)','Kaution (einmalig, meist 3 Monatsmieten)','Ggf. Umsatzmiete / Staffelmiete','Ggf. Pacht bei Inventarübernahme'],
      ex:EX,
      rows:[['Kaltmiete (220 m² à 18 €)','3.960 €'],['Nebenkosten','640 €'],['— laufend / Monat','4.600 €'],['Kaution einmalig (3 Kaltmieten, gebunden)','11.880 €']],
      sum:['Laufend / Jahr','≈ 55.200 €'],
      pct:'≈ 11,5 % vom Umsatz. Faustregel: Miete inkl. NK unter 8–12 % halten — ab 15 % wird es eng.',
      tip:'Die Kaution ist kein Aufwand, bindet aber Kapital, das dir bei der Eröffnung fehlt. Rechne sie in der Liquiditätsplanung mit, nicht in der Gewinn-und-Verlust-Rechnung.'
    },
    'abschreibungen':{
      intro:'Die Küche, die Einrichtung, die Kaffeemaschine — du zahlst sie einmal, nutzt sie aber jahrelang. Die Abschreibung (AfA) verteilt die Anschaffung steuerlich über die Nutzungsdauer. Kein Geldabfluss, aber echter Wertverzehr.',
      includes:['AfA auf Küchengeräte & -einrichtung','Gastraum-Möblierung','Kassen- & IT-Technik','Geschirr / Erstausstattung','Umbauten & fest eingebaute Anlagen','Geringwertige Wirtschaftsgüter (GWG) bis 800 € sofort'],
      ex:EX+' — Abschreibung nach amtlicher Nutzungsdauer (ND).',
      rows:[['Kücheneinrichtung 90.000 € / ND 8 J.','11.250 €'],['Gastraum-Möblierung 40.000 € / ND 8 J.','5.000 €'],['Kassen- & IT-Technik 8.000 € / ND 3 J.','2.667 €'],['Geschirr & Ausstattung 12.000 € / ND 5 J.','2.400 €']],
      sum:['Summe / Jahr','≈ 21.317 €'],
      pct:'≈ 1.775 € im Monat als kalkulatorischer Aufwand — rund 4,4 % vom Umsatz.',
      tip:'Abschreibung senkt den Gewinn und damit die Steuer, ohne dass Geld abfließt — Gewinn und Liquidität laufen hier auseinander. GWG bis 800 € netto kannst du sofort voll absetzen, das spart Verwaltung.'
    },
    'marketing':{
      intro:'Der beste Laden nützt nichts, wenn ihn niemand kennt. Marketing bringt Gäste rein — aber nur, wenn du es planst und misst, statt aus dem Bauch heraus Geld zu verbrennen.',
      includes:['Social Media: Content & Betreuung','Google & Meta Ads','Website & Hosting','Foodfotografie','Print: Flyer, Speisekarten, Aushänge','Google-Business-Profil & Bewertungsmanagement','Aktionen & Events'],
      ex:EX,
      rows:[['Social-Media-Content & Betreuung','400 €'],['Google & Meta Ads','350 €'],['Foodfotografie (anteilig)','150 €'],['Print & Speisekarten','120 €'],['Aktionen / Events','140 €'],['Website & Hosting (anteilig)','40 €']],
      sum:['Summe / Monat','≈ 1.200 €'],
      pct:'≈ 14.400 € im Jahr — rund 3 % vom Umsatz. Faustregel: 3–6 %, in der Eröffnungsphase mehr.',
      tip:'Miss, was reinkommt. Ein Gutscheincode oder die simple Frage „Woher kennst du uns?" macht jeden Marketing-Euro nachvollziehbar. Ohne Messung weißt du nie, welche Ausgabe tatsächlich Gäste bringt.'
    },
    'sonstige-kosten':{
      intro:'Die Sammelposition für alles, was in keinen anderen Block passt — einzeln klein, in Summe relevant. Genau hier versteckt sich die schleichende Marge, die niemand auf dem Schirm hat.',
      includes:['Kartenzahlungs-Disagio & Terminalgebühren','GEMA (Musik im Betrieb)','Bank- & Kontoführung','Rundfunkbeitrag','Schädlingsbekämpfung (Vertrag)','Genehmigungen, Konzessionen, Arbeitsschutz','Puffer für Unvorhergesehenes'],
      ex:EX+' — davon ~28.000 € Kartenumsatz.',
      rows:[['Kartenzahlungs-Disagio (~0,9 %)','252 €'],['GEMA','55 €'],['Bank- & Kontoführung','45 €'],['Rundfunkbeitrag','46 €'],['Schädlingsbekämpfung','60 €'],['Diverses / Puffer','120 €']],
      sum:['Summe / Monat','≈ 578 €'],
      pct:'≈ 7.000 € im Jahr — rund 1,5 % vom Umsatz.',
      tip:'Das Karten-Disagio wächst mit jedem Euro Kartenumsatz. Ab einem gewissen Volumen lässt sich die Gebühr neu verhandeln — das sind pro Jahr schnell vierstellige Beträge, die sonst leise abfließen.'
    }
  };
  function closeModal(){ var ov=document.getElementById('tsgk-ov'); if(!ov)return; ov.classList.remove('open'); document.body.classList.remove('tsgk-lock'); }
  function openModal(slug){
    var d=CONTENT[slug]; if(!d) return;
    var ov=document.getElementById('tsgk-ov');
    if(!ov){
      ov=document.createElement('div'); ov.id='tsgk-ov'; ov.className='tsgk-ov'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true');
      ov.innerHTML='<div class="tsgk-ov__scrim"></div>'
        +'<div class="tsgk-ov__box">'
          +'<button class="tsgk-ov__x" aria-label="Schließen">&times;</button>'
          +'<div class="tsgk-ov__hero"><img class="tsgk-ov__heroimg" alt="" src="" loading="lazy"><img class="tsgk-ov__logo" src="'+LOGO+'" alt="Tasty Studios"><div class="tsgk-ov__cap"><span class="tsgk-ov__k">Kostenblock</span><h3 class="tsgk-ov__h"></h3></div></div>'
          +'<div class="tsgk-ov__body"></div>'
        +'</div>';
      document.body.appendChild(ov);
      ov.querySelector('.tsgk-ov__scrim').addEventListener('click',closeModal);
      ov.querySelector('.tsgk-ov__x').addEventListener('click',closeModal);
      document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeModal(); });
    }
    var rows=d.rows.map(function(r){ return '<div class="tsgk-calc__row"><span>'+r[0]+'</span><span>'+r[1]+'</span></div>'; }).join('');
    var inc=d.includes.map(function(x){ return '<li>'+x+'</li>'; }).join('');
    ov.querySelector('.tsgk-ov__heroimg').src=BASE+slug+'.webp';
    ov.querySelector('.tsgk-ov__h').textContent=TITLE[slug]||'';
    ov.querySelector('.tsgk-ov__body').innerHTML=
      '<p class="tsgk-ov__intro">'+d.intro+'</p>'
      +'<div class="tsgk-ov__sec"><h4>Was dazugehört</h4><ul class="tsgk-ov__list">'+inc+'</ul></div>'
      +'<div class="tsgk-ov__sec"><h4>Beispielrechnung</h4><div class="tsgk-calc"><div class="tsgk-calc__ex">'+d.ex+'</div>'+rows
      +'<div class="tsgk-calc__row tsgk-calc__sum"><span>'+d.sum[0]+'</span><span>'+d.sum[1]+'</span></div></div>'
      +'<div class="tsgk-ov__pct">'+d.pct+'</div></div>'
      +'<div class="tsgk-ov__tip"><strong>Praxis-Tipp</strong> — '+d.tip+'</div>';
    ov.querySelector('.tsgk-ov__body').scrollTop=0;
    document.body.classList.add('tsgk-lock');
    requestAnimationFrame(function(){ ov.classList.add('open'); });
  }
  function injectCSS(){ if(document.getElementById('tsgk-css'))return; var s=document.createElement('style'); s.id='tsgk-css'; s.textContent=CSS; document.head.appendChild(s); }
  function build(){
    var root=document.createElement('div'); root.id='tsgk';
    root.innerHTML='<div class="tsgk-grid">'+CARDS.map(function(c){
      return '<div class="tsgk-card" style="--g:'+GLOW+'" data-slug="'+c[1]+'" role="button" tabindex="0" aria-label="'+c[0]+' — Details öffnen">'
        +'<span class="tsgk-bg" aria-hidden="true"><img src="'+BASE+c[1]+'.webp" alt="" loading="lazy"></span>'
        +'<div class="tsgk-in"><img class="tsgk-logo" src="'+LOGO+'" alt="Tasty Studios" loading="lazy">'
        +'<span class="tsgk-k">Kostenblock</span>'
        +'<h3 class="tsgk-h">'+c[0]+'</h3></div>'
        +'</div>';
    }).join('')+'</div>';
    return root;
  }
  function play(root){
    if(root.__played) return; root.__played=true;
    var cards=[].slice.call(root.querySelectorAll('.tsgk-card'));
    cards.forEach(function(c,i){
      c.style.setProperty('--d',(i*0.09)+'s');
      c.classList.add('on');
      /* nach Entrance 'done' setzen: friert Endzustand ein + gibt Hover frei (kein Replay) */
      setTimeout(function(){ c.classList.add('done'); }, i*90+1000);
    });
  }
  function inView(el){ var r=el.getBoundingClientRect(); var vh=window.innerHeight||document.documentElement.clientHeight; return r.top < vh-60 && r.bottom > 0; }
  function setup(root){
    /* IntersectionObserver ist auf dieser busy Super.so-Seite unzuverlaessig
       (Main-Thread saturiert) — deshalb robustes inView-Polling + Scroll-Fallback
       als primaerer Trigger, IO nur als Zusatz. Inhalt nie animationsabhaengig. */
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
    var ps=document.querySelectorAll('.page__gemeinkosten-mitarbeiterlhne .notion-text');
    for(var i=0;i<ps.length;i++){
      if(/Wenn wir von Gemeinkosten sprechen/.test(ps[i].textContent||'')){
        var el=ps[i].nextElementSibling;
        while(el){ if(el.matches&&el.matches('ul.notion-bulleted-list')) return el; el=el.nextElementSibling; }
      }
    }
    var uls=document.querySelectorAll('.page__gemeinkosten-mitarbeiterlhne ul.notion-bulleted-list');
    for(var j=0;j<uls.length;j++){ var tx=uls[j].textContent||''; if(/Reinigungskosten/.test(tx)&&/Sonstige Kosten/.test(tx)) return uls[j]; }
    return null;
  }
  function mount(){
    if(!/\/gemeinkosten-mitarbeiterlhne\/?$/.test(location.pathname)){ var e=document.getElementById('tsgk'); if(e&&e.parentNode)e.parentNode.removeChild(e); return; }
    if(document.getElementById('tsgk')) return;
    var ul=findList(); if(!ul) return;
    injectCSS();
    ul.style.display='none';
    var root=build();
    ul.parentNode.insertBefore(root, ul.nextSibling);
    root.addEventListener('click',function(e){ var c=e.target.closest('.tsgk-card'); if(c&&c.dataset.slug) openModal(c.dataset.slug); });
    root.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '||e.key==='Spacebar'){ var c=e.target.closest('.tsgk-card'); if(c&&c.dataset.slug){ e.preventDefault(); openModal(c.dataset.slug); } } });
    setup(root);
  }
  function boot(){
    var tries=0;
    var iv=setInterval(function(){ tries++; mount(); if(tries>40) clearInterval(iv); },300);
    new MutationObserver(function(){ mount(); }).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='complete') boot(); else window.addEventListener('load',boot);
})();

/* gemeinkosten-mitarbeiterlhne — Lohn-Ebenen-Erklaerung (#tslohn)
   Full-bleed, transparent (Website-Hintergrund), edge-to-edge.
   Struktur wie eine Rechnung: Bruttolohn (100%) + Abgaben = Arbeitgeber-Bruttokosten.
   Farbcodierung nach BEDEUTUNG: neutral=Ausgangswert, beige=fixe Sozialabgaben,
   schraffiert-grau=variable Umlagen, gold=Ergebnis.
   Nur Fakten-Prozentwerte (RV 9,3 / KV 7,3 / PV 1,8 / ALV 1,3 / Umlagen variabel);
   KEINE erfundenen Euro-Betraege (Niemals-schaetzen).
   Anker: NACH der 3-Ebenen-Bulletliste, Text bleibt erhalten.                     */
(function(){
  if(window.__tslohn) return; window.__tslohn=true;

  var GLOW='199,180,137';
  var MAXPCT=9.3;
  var SV=[
    {name:'Rentenversicherung',       pct:9.3, disp:'9,3 %'},
    {name:'Krankenversicherung',      pct:7.3, disp:'7,3 %', note:'+ Zusatzbeitrag'},
    {name:'Pflegeversicherung',       pct:1.8, disp:'1,8 %'},
    {name:'Arbeitslosenversicherung', pct:1.3, disp:'1,3 %'}
  ];
  var FACTOR_TARGET=1.21;

  var CSS=`
  #tslohn{width:100vw;max-width:100vw;margin:44px 0;margin-left:calc(50% - 50vw);
    background:transparent;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;-webkit-font-smoothing:antialiased;
    border-top:1px solid rgba(255,255,255,.09);border-bottom:1px solid rgba(255,255,255,.09)}
  #tslohn *{box-sizing:border-box}
  #tslohn .tslohn-wrap{width:100%;padding:52px clamp(20px,5vw,96px) 56px}

  #tslohn .tslohn-eyebrow{font-size:.7rem;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:#c7b489;margin:0 0 14px}
  #tslohn .tslohn-h{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;font-weight:600;font-size:clamp(1.6rem,3.4vw,2.35rem);line-height:1.1;letter-spacing:-.02em;color:#fff;margin:0 0 10px}
  #tslohn .tslohn-h span{color:#c7b489}
  #tslohn .tslohn-sub{font-size:1rem;line-height:1.55;color:rgba(255,255,255,.6);margin:0 0 40px;max-width:640px}

  /* ===== Zone A — drei Ebenen ===== */
  #tslohn .tslohn-secttl{font-size:.72rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.4);margin:0 0 18px}
  #tslohn .tslohn-levels{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin:0 0 52px}
  #tslohn .tslohn-lv{position:relative;display:flex;gap:16px;padding:22px 24px;border-radius:14px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.08);
    opacity:0;transform:translateY(14px);transition:opacity .6s cubic-bezier(.22,1,.36,1),transform .6s cubic-bezier(.22,1,.36,1)}
  #tslohn.on .tslohn-lv{opacity:1;transform:none}
  #tslohn.on .tslohn-lv[data-i="0"]{transition-delay:.04s}
  #tslohn.on .tslohn-lv[data-i="1"]{transition-delay:.16s}
  #tslohn.on .tslohn-lv[data-i="2"]{transition-delay:.28s}
  #tslohn .tslohn-lv--gold{background:linear-gradient(180deg,rgba(${GLOW},.14),rgba(${GLOW},.04));border-color:rgba(${GLOW},.5);box-shadow:0 24px 50px -34px rgba(${GLOW},.7)}
  #tslohn .tslohn-lv__no{flex:0 0 auto;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;
    font-family:"Lineal TS",-apple-system,sans-serif;font-weight:600;font-size:1.05rem;color:rgba(255,255,255,.55);background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.14)}
  #tslohn .tslohn-lv--gold .tslohn-lv__no{color:#05060b;background:#c7b489;border-color:#c7b489;box-shadow:0 0 20px rgba(${GLOW},.5)}
  #tslohn .tslohn-lv__name{display:block;font-family:"Lineal TS",-apple-system,sans-serif;font-weight:600;font-size:1.1rem;letter-spacing:-.01em;color:#fff;line-height:1.2;margin-bottom:6px}
  #tslohn .tslohn-lv--gold .tslohn-lv__name{color:#e9dcb8}
  #tslohn .tslohn-lv__desc{display:block;font-size:.86rem;line-height:1.5;color:rgba(255,255,255,.55)}
  #tslohn .tslohn-lv__desc b{color:rgba(255,255,255,.82);font-weight:600}
  #tslohn .tslohn-lv__tag{display:inline-block;margin-top:12px;font-size:.64rem;font-weight:600;letter-spacing:.04em;color:#05060b;background:#c7b489;padding:3px 10px;border-radius:99px}

  /* ===== Zone B — die Rechnung ===== */
  #tslohn .tslohn-calc{border:1px solid rgba(255,255,255,.09);border-radius:16px;overflow:hidden;background:rgba(0,0,0,.22)}
  #tslohn .tslohn-row{display:grid;grid-template-columns:minmax(300px,440px) 1fr;align-items:center;gap:clamp(18px,3vw,48px);padding:16px clamp(18px,3vw,32px)}
  #tslohn .tslohn-row+.tslohn-row{border-top:1px solid rgba(255,255,255,.06)}
  #tslohn .tslohn-head{display:flex;align-items:baseline;justify-content:space-between;gap:16px}
  #tslohn .tslohn-name{display:flex;align-items:baseline;gap:11px;font-size:1rem;color:rgba(255,255,255,.9)}
  #tslohn .tslohn-op{flex:0 0 auto;width:20px;text-align:center;font-family:"Lineal TS",-apple-system,sans-serif;font-weight:600;color:rgba(${GLOW},.85);font-size:1.05rem}
  #tslohn .tslohn-note{display:block;font-size:.74rem;color:rgba(255,255,255,.4);margin-top:3px;padding-left:31px}
  #tslohn .tslohn-val{font-variant-numeric:tabular-nums;font-weight:600;font-size:1.05rem;color:#fff;white-space:nowrap}

  /* Balkenspur */
  #tslohn .tslohn-bar{position:relative;height:12px;border-radius:99px;background:rgba(255,255,255,.05);overflow:hidden}
  #tslohn .tslohn-fill{position:absolute;left:0;top:0;bottom:0;width:0;border-radius:99px;transition:width 1.05s cubic-bezier(.4,.1,.2,1)}
  #tslohn .tslohn-fill--sv{background:linear-gradient(90deg,#b89c67,#e9dcb8);box-shadow:0 0 16px rgba(${GLOW},.4)}
  #tslohn .tslohn-fill--vari{background:repeating-linear-gradient(115deg,rgba(255,255,255,.3) 0 7px,rgba(255,255,255,.12) 7px 14px)}

  /* Ausgangs- & Ergebniszeile */
  #tslohn .tslohn-row--base{background:rgba(255,255,255,.03)}
  #tslohn .tslohn-row--base .tslohn-name{font-family:"Lineal TS",-apple-system,sans-serif;font-weight:600;font-size:1.12rem;color:#fff}
  #tslohn .tslohn-row--base .tslohn-val{font-size:1.5rem;color:#fff}
  #tslohn .tslohn-row--total{background:linear-gradient(180deg,rgba(${GLOW},.16),rgba(${GLOW},.05));border-top:1px solid rgba(${GLOW},.35)}
  #tslohn .tslohn-row--total .tslohn-name{font-family:"Lineal TS",-apple-system,sans-serif;font-weight:600;font-size:1.2rem;color:#e9dcb8}
  #tslohn .tslohn-total-val{display:flex;align-items:baseline;gap:14px;justify-content:flex-end;flex-wrap:wrap}
  #tslohn .tslohn-fac{font-family:"Lineal TS",-apple-system,sans-serif;font-weight:600;font-size:2rem;line-height:1;color:#c7b489;letter-spacing:-.01em;text-shadow:0 0 24px rgba(${GLOW},.45);font-variant-numeric:tabular-nums}
  #tslohn .tslohn-fac small{font-family:-apple-system,sans-serif;font-size:.9rem;font-weight:600;color:rgba(231,222,200,.7)}
  #tslohn .tslohn-total-note{font-size:.86rem;color:rgba(255,255,255,.6)}

  /* Gruppenband */
  #tslohn .tslohn-grp{display:flex;align-items:center;gap:12px;padding:14px clamp(18px,3vw,32px);background:rgba(255,255,255,.015);border-top:1px solid rgba(255,255,255,.06);
    font-size:.7rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.42)}
  #tslohn .tslohn-grp::before{content:"";width:9px;height:9px;border-radius:2px;flex:0 0 auto}
  #tslohn .tslohn-grp--sv::before{background:linear-gradient(90deg,#b89c67,#e9dcb8)}
  #tslohn .tslohn-grp--vari::before{background:repeating-linear-gradient(115deg,rgba(255,255,255,.32) 0 4px,rgba(255,255,255,.12) 4px 8px)}

  #tslohn .tslohn-foot{margin:22px 4px 0;font-size:.8rem;line-height:1.6;color:rgba(255,255,255,.4)}

  #tslohn .tslohn-row,#tslohn .tslohn-grp{opacity:0;transform:translateX(-6px);transition:opacity .5s ease,transform .5s ease}
  #tslohn.on .tslohn-row,#tslohn.on .tslohn-grp{opacity:1;transform:none}

  @media(max-width:820px){
    #tslohn .tslohn-wrap{padding:40px 18px 44px}
    #tslohn .tslohn-levels{grid-template-columns:1fr;gap:12px;margin-bottom:40px}
    #tslohn .tslohn-row{grid-template-columns:1fr;gap:12px;padding:16px 18px}
    #tslohn .tslohn-bar{order:2}
    #tslohn .tslohn-row--base .tslohn-val,#tslohn .tslohn-fac{font-size:1.5rem}
    #tslohn .tslohn-total-val{justify-content:space-between}
  }
  @media(prefers-reduced-motion:reduce){
    #tslohn .tslohn-lv,#tslohn .tslohn-row,#tslohn .tslohn-grp{opacity:1;transform:none;transition:none}
    #tslohn .tslohn-fill{transition:none}
  }`;

  function nf(v,dec){ return v.toFixed(dec).replace('.',','); }
  function injectCSS(){ if(document.getElementById('tslohn-css'))return; var s=document.createElement('style'); s.id='tslohn-css'; s.textContent=CSS; document.head.appendChild(s); }

  function svRow(r){
    var w=Math.round(r.pct/MAXPCT*100);
    return '<div class="tslohn-row">'
      +'<div class="tslohn-head"><span class="tslohn-name"><span class="tslohn-op">+</span>'+r.name+'</span><span class="tslohn-val">'+r.disp+'</span></div>'
      +'<div class="tslohn-bar"><span class="tslohn-fill tslohn-fill--sv" data-w="'+w+'"></span></div>'
      +(r.note?'<span class="tslohn-note">'+r.note+'</span>':'')
    +'</div>';
  }

  function build(){
    var root=document.createElement('div'); root.id='tslohn';
    root.innerHTML=
      '<div class="tslohn-wrap">'
      +'<p class="tslohn-eyebrow">Mitarbeiterlöhne</p>'
      +'<h2 class="tslohn-h">Vom Nettolohn zu den <span>Arbeitgeberkosten</span></h2>'
      +'<p class="tslohn-sub">Es gibt drei Lohn-Ebenen — und für deine Kalkulation zählt nur die dritte.</p>'

      +'<p class="tslohn-secttl">Die drei Lohn-Ebenen</p>'
      +'<div class="tslohn-levels">'
        +'<div class="tslohn-lv" data-i="0"><span class="tslohn-lv__no">1</span><div><span class="tslohn-lv__name">Nettolohn</span><span class="tslohn-lv__desc">Was beim Mitarbeiter auf dem <b>Konto ankommt</b>.</span></div></div>'
        +'<div class="tslohn-lv" data-i="1"><span class="tslohn-lv__no">2</span><div><span class="tslohn-lv__name">Bruttolohn</span><span class="tslohn-lv__desc">Was im <b>Arbeitsvertrag</b> steht: Netto + Lohnsteuer + Arbeitnehmer-Sozialabgaben.</span></div></div>'
        +'<div class="tslohn-lv tslohn-lv--gold" data-i="2"><span class="tslohn-lv__no">3</span><div><span class="tslohn-lv__name">Arbeitgeber-Bruttokosten</span><span class="tslohn-lv__desc">Bruttolohn + <b>Arbeitgeber-Abgaben</b>. Was dich als Arbeitgeber wirklich kostet.</span><span class="tslohn-lv__tag">deine Kostenzahl</span></div></div>'
      +'</div>'

      +'<p class="tslohn-secttl">So entsteht Ebene 3 — der Aufbau auf den Bruttolohn</p>'
      +'<div class="tslohn-calc">'
        +'<div class="tslohn-row tslohn-row--base">'
          +'<div class="tslohn-head"><span class="tslohn-name">Bruttolohn</span><span class="tslohn-val">100 %</span></div>'
          +'<div style="font-size:.82rem;color:rgba(255,255,255,.45)">Ausgangswert &middot; Ebene 2</div>'
        +'</div>'

        +'<div class="tslohn-grp tslohn-grp--sv">Arbeitgeberanteil zur Sozialversicherung</div>'
        +SV.map(svRow).join('')

        +'<div class="tslohn-grp tslohn-grp--vari">Umlagen &middot; betriebsindividuell</div>'
        +'<div class="tslohn-row">'
          +'<div class="tslohn-head"><span class="tslohn-name"><span class="tslohn-op">+</span>Unfallversicherung &amp; Umlagen U1 / U2 / U3</span><span class="tslohn-val" style="color:rgba(255,255,255,.6);font-weight:500">variabel</span></div>'
          +'<div class="tslohn-bar"><span class="tslohn-fill tslohn-fill--vari" data-w="42"></span></div>'
        +'</div>'

        +'<div class="tslohn-row tslohn-row--total">'
          +'<div class="tslohn-head"><span class="tslohn-name"><span class="tslohn-op">=</span>Arbeitgeber-Bruttokosten</span></div>'
          +'<div class="tslohn-total-val"><span class="tslohn-fac" data-target="'+FACTOR_TARGET+'">1,00<small>&thinsp;× Bruttolohn</small></span><span class="tslohn-total-note">das sind <b style="color:#e9dcb8">+21 % bis +23 %</b> obendrauf</span></div>'
        +'</div>'
      +'</div>'

      +'<p class="tslohn-foot">In der Gastronomie rechnet man mit einem AG-Kosten-Faktor von <b style="color:rgba(255,255,255,.7)">ca. 1,21 bis 1,30</b> — die Spanne nach oben mit Urlaubsrückstellungen und Lohnfortzahlung im Krankheitsfall. Prozentsätze sind gerundete Richtwerte; Unfallversicherung und Umlagen U1/U2/U3 sind betriebsindividuell.</p>'
      +'</div>';
    return root;
  }

  function play(root){
    if(root.__played) return; root.__played=true;
    root.classList.add('on');
    var rows=[].slice.call(root.querySelectorAll('.tslohn-row, .tslohn-grp'));
    rows.forEach(function(rw,i){ rw.style.transitionDelay=(0.45+i*0.08)+'s'; });
    var fills=[].slice.call(root.querySelectorAll('.tslohn-fill'));
    fills.forEach(function(f,i){ setTimeout(function(){ f.style.width=f.getAttribute('data-w')+'%'; }, 700+i*130); });
    var fac=root.querySelector('.tslohn-fac');
    if(fac){
      var small=fac.querySelector('small').outerHTML;
      var target=parseFloat(fac.getAttribute('data-target'))||1.21, dur=1500, t0=null, done=false;
      function set(v){ fac.innerHTML=nf(v,2)+small; }
      function step(now){ if(t0===null)t0=now; var p=Math.min(1,(now-t0)/dur), e=1-Math.pow(1-p,3), v=1+(target-1)*e; if(!done) set(v); if(p<1&&!done) requestAnimationFrame(step); }
      setTimeout(function(){ requestAnimationFrame(step); }, 900);
      setTimeout(function(){ done=true; set(target); }, 900+dur+180);
    }
    setTimeout(function(){ root.classList.add('done'); }, 900+1500+400);
  }

  function inView(el){ var r=el.getBoundingClientRect(); var vh=window.innerHeight||document.documentElement.clientHeight; return r.top < vh-70 && r.bottom > 0; }
  function setup(root){
    var io=new IntersectionObserver(function(e){ if(e[0].isIntersecting){ play(root); io.disconnect(); } },{threshold:.15});
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
    ul.parentNode.insertBefore(root, ul.nextSibling);
    setup(root);
  }
  function boot(){
    var tries=0;
    var iv=setInterval(function(){ tries++; mount(); if(tries>40) clearInterval(iv); },300);
    new MutationObserver(function(){ mount(); }).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='complete') boot(); else window.addEventListener('load',boot);
})();

/* ---- */

/* ---- */

(function(){
  var IMG="https://files.catbox.moe/ecvbxi.webp";
  var LOGO="https://files.catbox.moe/au80tp.png";
  function on(){ return /\/lieferpartner-ansprechpartner-lieferantenvertrge\/?$/.test(location.pathname); }
  function mount(){
    if(!on()) return;
    var sc=document.querySelector(".super-content");
    if(!sc || sc.querySelector(".ts-hero")) return;
    var hero=document.createElement("div");
    hero.className="ts-hero";
    hero.innerHTML=
      '<img class="ts-hero__img" alt="DB I - III — Lieferanten" src="'+IMG+'">'+
      '<div class="ts-hero__text">'+
        '<img class="ts-hero__logo" alt="Tasty Studios" src="'+LOGO+'">'+
        '<div class="ts-hero__eyebrow">Lektion 2.2.1</div>'+
        '<h1 class="ts-hero__title">DB I - III : <span class="ts-gold">Lieferanten</span></h1>'+
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

/* ============================================================
   inventurliste — Flow-Animation "Preis richtig / Preis falsch"
   Node 1 beige; gruene Hauptlinie ab Inventar; roter Abzweig nach unten.
   Stil nach tasty-studios.vercel.app. Mount zwischen den beiden Textabsaetzen.
   ============================================================ */
(function(){
  if(window.__tsflow) return; window.__tsflow=true;
  var CSS=`
  #tsflow{width:min(1000px,95vw);margin:46px auto 34px;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;color:#fff}
  #tsflow .stage{position:relative;width:100%;aspect-ratio:1000/320;}
  #tsflow svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
  #tsflow .ln{fill:none;stroke-width:2;stroke-linecap:round;vector-effect:non-scaling-stroke}
  #tsflow .ln-beige{stroke:#cbb994}
  #tsflow .ln-green{stroke:#46af73}
  #tsflow .ln-red{stroke:#e0574f}
  #tsflow .nd{position:absolute;transform:translate(-50%,-50%) scale(.5);opacity:0;transition:opacity .3s ease,transform .4s cubic-bezier(.34,1.56,.64,1)}
  #tsflow .nd.on{opacity:1;transform:translate(-50%,-50%) scale(1)}
  #tsflow .dot{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;background:#0f1218;border:1.5px solid rgba(255,255,255,.25);color:rgba(255,255,255,.85);margin:0 auto}
  #tsflow .nd.beige .dot{background:#e7dcc4;border-color:#cbb994;color:#1a1a1a}
  #tsflow .nd.green .dot{border-color:#46af73;box-shadow:0 0 18px rgba(70,175,115,.25);color:#bfe8cf}
  #tsflow .nd.red .dot{border-color:#e0574f;box-shadow:0 0 18px rgba(224,87,79,.25);color:#f0c3c0}
  #tsflow .lbl{position:absolute;top:46px;left:50%;transform:translateX(-50%);width:150px;text-align:center;font-size:11px;font-weight:500;letter-spacing:1.4px;text-transform:uppercase;line-height:1.35;color:rgba(255,255,255,.55)}
  #tsflow .nd.red .lbl{color:rgba(224,87,79,.6)}
  #tsflow .plabel{position:absolute;transform:translate(-50%,-50%);font-size:12px;font-weight:600;letter-spacing:.04em;padding:4px 12px;border-radius:999px;white-space:nowrap;opacity:0;transition:opacity .35s ease}
  #tsflow .plabel.on{opacity:1}
  #tsflow .plabel.green{color:#7fd3a3;background:rgba(70,175,115,.12);border:1px solid rgba(70,175,115,.35)}
  #tsflow .plabel.red{color:#f0968f;background:rgba(224,87,79,.1);border:1px solid rgba(224,87,79,.32)}
  @media(max-width:720px){#tsflow{overflow-x:auto}#tsflow .stage{min-width:720px}}
  `;
  function injectCSS(){ if(document.getElementById('tsflow-css'))return; var s=document.createElement('style'); s.id='tsflow-css'; s.textContent=CSS; document.head.appendChild(s); }
  var TOP=[['1','Liefer- &<br>Ansprechpartner',9,'beige'],['2','Inventar',25.4,'green'],['3','Zutaten',41.8,'green'],['4','Rezepte',58.2,'green'],['5','Gerichte',74.6,'green'],['6','Menükalkulation',91,'green']];
  var RED=[['3','Zutaten',41.8],['4','Rezepte',58.2],['5','Gerichte',74.6],['6','Menükalkulation',91]];
  function build(){
    var root=document.createElement('div'); root.id='tsflow';
    var TY=24,RY=70,nodesHTML='';
    TOP.forEach(function(t,i){ nodesHTML+='<div class="nd '+t[3]+'" data-i="'+i+'" style="left:'+t[2]+'%;top:'+TY+'%"><span class="dot">'+t[0]+'</span><span class="lbl">'+t[1]+'</span></div>'; });
    RED.forEach(function(t,i){ nodesHTML+='<div class="nd red" data-i="'+(6+i)+'" style="left:'+t[2]+'%;top:'+RY+'%"><span class="dot">'+t[0]+'</span><span class="lbl">'+t[1]+'</span></div>'; });
    root.innerHTML='<div class="stage"><svg viewBox="0 0 1000 320" preserveAspectRatio="none"><path class="ln ln-beige" d="M 110,77 H 234"/><path class="ln ln-green" d="M 274,77 H 890"/><path class="ln ln-red" d="M 254,150 V 205 Q 254,224 274,224 H 890"/></svg>'+nodesHTML+'<div class="plabel green" style="left:89%;top:11%">Preis richtig</div><div class="plabel red" style="left:89%;top:58%">Preis falsch</div></div>';
    return root;
  }
  function setup(root){
    var SPEED=430, START=0.15, LEAD=50; // px/s; LEAD: Kugel zuendet kurz bevor die Spitze ankommt
    var beige=root.querySelector('.ln-beige'), green=root.querySelector('.ln-green'), red=root.querySelector('.ln-red');
    // Roter Abzweig beginnt knapp unter dem Inventar-Label (aus echter Label-Position berechnet)
    try{
      var sr=root.querySelector('.stage').getBoundingClientRect();
      var lbl=root.querySelector('.nd[data-i="1"] .lbl');
      var y=Math.max(112, Math.min(190, (0.24*sr.height + 28 + lbl.offsetHeight + 10) / sr.height * 320)); // Node-Top(24%)+Label-Offset 28px+Label-Hoehe+10px Luft (transform-unabhaengig)
      red.setAttribute('d','M 254,'+y.toFixed(0)+' V 205 Q 254,224 274,224 H 890');
    }catch(e){}
    var t2=START+beige.getTotalLength()/SPEED; // Spitze erreicht Inventar
    var lines=[[beige,START],[green,t2],[red,t2]].map(function(s){ var L=s[0].getTotalLength(); s[0].style.strokeDasharray=L; s[0].style.strokeDashoffset=L; return [s[0],s[1],L]; });
    function lenAtX(path,x){ var T=path.getTotalLength(); for(var l=0;l<=T;l+=5){ if(path.getPointAtLength(l).x>=x) return l; } return T; }
    var TX=[90,254,418,582,746,910];
    var jobs=[]; // [Element, Startzeit, Pfad|null, Pfadlaenge bis Kugel]
    root.querySelectorAll('.nd').forEach(function(n){
      var i=+n.getAttribute('data-i');
      if(i===0) jobs.push([n,START,null,0]);
      else if(i===1) jobs.push([n,t2,null,0]);
      else if(i<6) jobs.push([n,t2,green,lenAtX(green,TX[i])]);
      else jobs.push([n,t2,red,lenAtX(red,TX[i-4])]);
    });
    jobs.push([root.querySelector('.plabel.green'), t2+lines[1][2]/SPEED, null, 0]);
    jobs.push([root.querySelector('.plabel.red'),   t2+lines[2][2]/SPEED, null, 0]);
    var t0=null;
    function frame(now){
      if(t0===null) t0=now;
      var t=(now-t0)/1000, done=true;
      lines.forEach(function(s){ var drawn=Math.max(0,Math.min(s[2],(t-s[1])*SPEED)); s[0].style.strokeDashoffset=s[2]-drawn; if(drawn<s[2]) done=false; });
      jobs.forEach(function(j){
        if(j[0].classList.contains('on')) return;
        if(j[2] ? ((t-j[1])*SPEED >= j[3]-LEAD) : (t>=j[1])) j[0].classList.add('on'); else done=false;
      });
      if(!done) requestAnimationFrame(frame);
    }
    root.__tsfFrame=frame; // Test-Hook
    var io=new IntersectionObserver(function(e){ if(e[0].isIntersecting){ root.classList.add('in'); requestAnimationFrame(frame); io.disconnect(); } },{threshold:.3});
    io.observe(root);
  }
  function findAnchor(){
    var a=document.getElementById('block-399b9546553480c0ac35e72c9d8c4055');
    if(a) return a;
    var n=document.querySelectorAll('.notion-text');
    for(var i=0;i<n.length;i++){ if(n[i].textContent && n[i].textContent.indexOf('In dieser Datenbank hinterlegst du alle Produkte')>-1) return n[i].closest('[id^="block-"]')||n[i]; }
    return null;
  }
  function colorNull(){
    var h=document.getElementById('block-399b9546553480d993d5ef22dd9598a6');
    if(!h||h.querySelector('.ts-null-red')) return;
    var w=document.createTreeWalker(h,NodeFilter.SHOW_TEXT,null),node,target=null;
    while(node=w.nextNode()){ if(/\bNull\b/.test(node.nodeValue)){ target=node; break; } }
    if(!target) return;
    var i=target.nodeValue.search(/\bNull\b/);
    var before=target.nodeValue.slice(0,i), after=target.nodeValue.slice(i+4);
    var sp=document.createElement('span'); sp.className='ts-null-red'; sp.style.color='#e32552'; sp.textContent='Null';
    var f=document.createDocumentFragment();
    if(before)f.appendChild(document.createTextNode(before)); f.appendChild(sp); if(after)f.appendChild(document.createTextNode(after));
    target.parentNode.replaceChild(f,target);
  }
  function mount(){
    if(!/\/inventurliste\/?$/.test(location.pathname)){ var e=document.getElementById('tsflow'); if(e&&e.parentNode)e.parentNode.removeChild(e); return; }
    colorNull();
    if(document.getElementById('tsflow')) return;
    var a=findAnchor(); if(!a) return;
    injectCSS();
    var root=build();
    a.parentNode.insertBefore(root, a.nextSibling);
    setup(root);
  }
  function boot(){
    var tries=0;
    var iv=setInterval(function(){ tries++; mount(); if(tries>40) clearInterval(iv); },300);
    new MutationObserver(function(){ if(!document.getElementById('tsflow')) mount(); }).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='complete') boot(); else window.addEventListener('load',boot);
})();

/* ============================================================
   MacBook-Cover + Klick-Lightbox (inventurliste)
   Exakt wie /mehrwert-zielbild: Rohvideo per CSS versteckt,
   MacBook-Poster (Lektion 2.1 in den Screen gebacken) sitzt in
   der linken Spalte an der Stelle des Videos, Klick -> Lightbox.
   Poster (catbox): tqee6z.png · Läuft nur auf /inventurliste.
   ============================================================ */
(function(){
  if(window.__tsmacInv) return; window.__tsmacInv=true;
  var POSTER="https://files.catbox.moe/tqee6z.png";
  (function(){ var pre=new Image(); pre.src=POSTER; })(); // Poster vorladen -> kein Leer-Blitz
  var CSS=[
    '.page__inventurliste .notion-column-list:has(h1.notion-heading) > .notion-column:not(:has(h1.notion-heading)){display:flex!important;}',
    '@media (min-width:768px){',
    '.page__inventurliste .notion-column-list:has(h1.notion-heading){display:flex!important;gap:0!important;}',
    '.page__inventurliste .notion-column-list:has(h1.notion-heading) > .notion-column{width:calc((100% - 18px) * 0.5)!important;}',
    '.page__inventurliste .notion-column-list:has(h1.notion-heading) > .notion-column + .notion-column{margin-inline-start:18px!important;}',
    '}',
    '.page__inventurliste .notion-column-list:has(h1.notion-heading) .notion-video video{display:none!important;}',
    '.page__inventurliste .tsmac{position:relative;cursor:pointer;display:block;width:100%;line-height:0;background:transparent;}',
    '.page__inventurliste .tsmac img{width:100%;height:auto;display:block;transition:transform .5s ease;}',
    '.page__inventurliste .tsmac:hover img{transform:scale(1.02);}',
    '.page__inventurliste .tsmac__play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;}',
    '.page__inventurliste .tsmac__play span{width:76px;height:76px;border-radius:50%;background:rgba(255,255,255,.16);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.55);display:flex;align-items:center;justify-content:center;transition:transform .3s,background .3s;}',
    '.page__inventurliste .tsmac__play span::after{content:"";border-style:solid;border-width:12px 0 12px 20px;border-color:transparent transparent transparent #fff;margin-left:5px;}',
    '.page__inventurliste .tsmac:hover .tsmac__play span{transform:scale(1.08);background:rgba(255,255,255,.26);}',
    '#tsmac-lb{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;background:rgba(5,6,11,.85);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);padding:4vw;opacity:0;transition:opacity .35s ease;}',
    '#tsmac-lb.open{display:flex;opacity:1;}',
    '#tsmac-lb .tsmac-stage{transform:scale(.94);transition:transform .4s cubic-bezier(.2,.7,.2,1);width:min(92vw,1180px);}',
    '#tsmac-lb.open .tsmac-stage{transform:scale(1);}',
    '#tsmac-lb video{width:100%;max-height:86vh;border-radius:12px;box-shadow:0 40px 120px rgba(0,0,0,.6);background:#000;display:block;}',
    '#tsmac-lb__close{position:absolute;top:22px;right:28px;width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.08);color:#fff;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;}'
  ].join('');
  function injectCSS(){ if(document.getElementById('tsmac-inv-css'))return; var s=document.createElement('style'); s.id='tsmac-inv-css'; s.textContent=CSS; document.head.appendChild(s); }
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
    if(!/\/inventurliste\/?$/.test(location.pathname)) return;
    injectCSS();
    var scope=document.querySelector('.page__inventurliste'); if(!scope) return;
    var nv=scope.querySelector('.notion-column-list .notion-video'); if(!nv) return;
    if(nv.querySelector('.tsmac')) return;
    var raw=nv.querySelector('video'); if(!raw) return;
    var src=raw.currentSrc||raw.getAttribute('src')||(raw.querySelector('source')&&raw.querySelector('source').getAttribute('src'));
    if(!src) return;
    var poster=document.createElement('div'); poster.className='tsmac';
    poster.innerHTML='<img src="'+POSTER+'" alt="Lektion 2.1 – DB 0: Inventurliste" fetchpriority="high" decoding="async"><div class="tsmac__play"><span></span></div>';
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
   MacBook-Cover + Klick-Lightbox (rezepturen) — Viertnutzung
   Muster 1:1 aus inventurliste (.tsmac). Rohvideo im Ziel-Block
   (Block-ID #block-39cb… / Anker-Phrase "Nährstoffe und
   Allergene") per JS-Marker (.tsmac-host) versteckt, MacBook-
   Poster (bhs.png → Lektion 2.4 in den Screen gebacken) +
   Play-Button, Klick -> geteilte Lightbox #tsmac-lb.
   Poster: GitHub-Pages img (rezepturen-mac/pc.png).
   Läuft nur auf /rezepturen. Natives 2-Spalten-Layout ->
   KEINE 50/50-Reaktivierung (Lieferpartner-Regel 2).
   ============================================================ */
(function(){
  if(window.__tsmacRez) return; window.__tsmacRez=true;
  var POSTER="https://tastyrob123.github.io/kurs/img/rezepturen-mac/pc.png";
  (function(){ var pre=new Image(); pre.src=POSTER; })(); // Poster vorladen -> kein Leer-Blitz
  var VID='#block-39cb9546553480698e45d99c0d1cb9d5';
  var PHRASE='Nährstoffe und Allergene';
  var CSS=[
    '.page__rezepturen .notion-video.tsmac-host video{display:none!important;}',
    '.page__rezepturen .tsmac{position:relative;cursor:pointer;display:block;width:100%;line-height:0;background:transparent;}',
    '.page__rezepturen .tsmac img{width:100%;height:auto;display:block;transition:transform .5s ease;}',
    '.page__rezepturen .tsmac:hover img{transform:scale(1.02);}',
    '.page__rezepturen .tsmac__play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;}',
    '.page__rezepturen .tsmac__play span{width:76px;height:76px;border-radius:50%;background:rgba(255,255,255,.16);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.55);display:flex;align-items:center;justify-content:center;transition:transform .3s,background .3s;}',
    '.page__rezepturen .tsmac__play span::after{content:"";border-style:solid;border-width:12px 0 12px 20px;border-color:transparent transparent transparent #fff;margin-left:5px;}',
    '.page__rezepturen .tsmac:hover .tsmac__play span{transform:scale(1.08);background:rgba(255,255,255,.26);}',
    '#tsmac-lb{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;background:rgba(5,6,11,.85);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);padding:4vw;opacity:0;transition:opacity .35s ease;}',
    '#tsmac-lb.open{display:flex;opacity:1;}',
    '#tsmac-lb .tsmac-stage{transform:scale(.94);transition:transform .4s cubic-bezier(.2,.7,.2,1);width:min(92vw,1180px);}',
    '#tsmac-lb.open .tsmac-stage{transform:scale(1);}',
    '#tsmac-lb video{width:100%;max-height:86vh;border-radius:12px;box-shadow:0 40px 120px rgba(0,0,0,.6);background:#000;display:block;}',
    '#tsmac-lb__close{position:absolute;top:22px;right:28px;width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.08);color:#fff;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;}'
  ].join('');
  function injectCSS(){ if(document.getElementById('tsmac-rez-css'))return; var s=document.createElement('style'); s.id='tsmac-rez-css'; s.textContent=CSS; document.head.appendChild(s); }
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
  function findVid(scope){
    // Anker: 1) Ziel-Block per ID  2) Anker-Phrase -> nächste .notion-video  3) generisch
    var b=scope.querySelector(VID);
    if(b){ var v=b.matches&&b.matches('.notion-video')?b:b.querySelector('.notion-video'); if(v&&v.querySelector('video')) return v; }
    var texts=scope.querySelectorAll('.notion-text,p');
    for(var i=0;i<texts.length;i++){
      if(texts[i].textContent && texts[i].textContent.indexOf(PHRASE)>-1){
        var cl=texts[i].closest('.notion-column-list'); if(cl){ var vv=cl.querySelector('.notion-video'); if(vv&&vv.querySelector('video')) return vv; }
      }
    }
    var g=scope.querySelectorAll('.notion-column-list .notion-video');
    for(var j=0;j<g.length;j++){ if(g[j].querySelector('video')) return g[j]; }
    return null;
  }
  function mount(){
    if(!/\/rezepturen\/?$/.test(location.pathname)) return;
    injectCSS();
    var scope=document.querySelector('.page__rezepturen'); if(!scope) return;
    var nv=findVid(scope); if(!nv) return;
    if(nv.querySelector('.tsmac')) return;
    var raw=nv.querySelector('video'); if(!raw) return;
    var src=raw.currentSrc||raw.getAttribute('src')||(raw.querySelector('source')&&raw.querySelector('source').getAttribute('src'));
    if(!src) return;
    nv.classList.add('tsmac-host');
    var poster=document.createElement('div'); poster.className='tsmac';
    poster.innerHTML='<img src="'+POSTER+'" alt="Lektion 2.4 – DB V: Rezepturen" fetchpriority="high" decoding="async"><div class="tsmac__play"><span></span></div>';
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
   inventurliste — Kacheln "Was uns jetzt noch fehlt" (v3)
   Drei reduzierte Luxus-Kacheln (DB Lieferpartner / Zutaten /
   Packaging) ersetzen die Text-Bullets. v3 (11.07.2026):
   klickbare Links zu den Notion-Vorlagen (neuer Tab), Tasty-
   Studios-Logo mittig statt Icon-Viereck, alles zentriert,
   Titel in "Lineal TS", Fußzeile "Verknüpfung in Lektion
   2.2.1/2.2.2/2.2.3", Hover-Heartbeat-Glow wie #tsq
   (mehrwert-zielbild), Champagner-Gold als Glow-Farbe.
   v4 (11.07.2026): Hintergrundbild je Kachel (catbox-JPEG 3:2,
   object-fit:contain — nichts abgeschnitten, Bildschwarz ver-
   schmilzt mit Kachelgrund #04050a) + Scrim in der Hero-Farb-
   familie rgba(4,5,10,…) + Hero-Text-Shadows fürs Lesen.
   ============================================================ */
(function(){
  if(window.__tslink) return; window.__tslink=true;
  var LOGO='https://files.catbox.moe/au80tp.png';
  var GLOW='199,180,137';
  var CSS=`
  #tslink{width:min(1000px,95vw);margin:36px auto 30px;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;color:#fff}
  #tslink *{box-sizing:border-box}
  #tslink .tsl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
  #tslink a.tsl-card{position:relative;display:block;overflow:hidden;text-align:center;text-decoration:none;color:inherit;-webkit-tap-highlight-color:transparent;border-radius:16px;padding:30px 26px 22px;background:linear-gradient(165deg,rgba(255,255,255,.05),rgba(255,255,255,.015) 55%,rgba(255,255,255,0));border:1px solid rgba(255,255,255,.10);box-shadow:0 18px 44px -30px rgba(0,0,0,.85);opacity:0;transform:translateY(18px);will-change:transform,box-shadow;transition:opacity .65s ease,transform .75s cubic-bezier(.22,1,.36,1),border-color .4s ease,box-shadow .5s ease}
  #tslink .tsl-bg{position:absolute;inset:0;z-index:0;border-radius:inherit;overflow:hidden;background:#04050a;pointer-events:none}
  #tslink .tsl-bg img{width:100%;height:100%;object-fit:contain;object-position:center;display:block}
  #tslink .tsl-bg::after{content:"";position:absolute;inset:0;background:linear-gradient(165deg,rgba(255,255,255,.05),rgba(255,255,255,.015) 55%,rgba(255,255,255,0)),radial-gradient(92% 80% at 50% 58%,rgba(4,5,10,.74) 0%,rgba(4,5,10,.48) 50%,rgba(4,5,10,.14) 76%,rgba(4,5,10,0) 100%)}
  #tslink .tsl-num,#tslink .tsl-logo,#tslink .tsl-k,#tslink .tsl-h,#tslink .tsl-t,#tslink .tsl-foot{position:relative;z-index:2}
  #tslink a.tsl-card.on{opacity:1;transform:translateY(0)}
  #tslink a.tsl-card:hover{transform:translateY(-4px);border-color:rgba(var(--g),.5);animation:tsl-heartbeat 2.6s cubic-bezier(.4,0,.3,1) infinite}
  #tslink a.tsl-card:focus-visible{outline:2px solid rgba(var(--g),.7);outline-offset:4px}
  #tslink .tsl-num{position:absolute;top:26px;right:26px;font-size:.7rem;font-weight:500;letter-spacing:.2em;color:rgba(199,180,137,.55)}
  #tslink .tsl-logo{display:block;height:34px;width:auto;margin:2px auto 18px}
  #tslink .tsl-k{display:block;font-size:.58rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#c7b489;margin-bottom:8px}
  #tslink .tsl-h{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;font-size:1.32rem;font-weight:600;letter-spacing:-.012em;line-height:1.15;color:#fff;margin:0 0 12px;text-shadow:0 0 4px rgba(0,0,0,.9),0 1px 3px rgba(0,0,0,.95),0 3px 14px rgba(0,0,0,.9),0 6px 34px rgba(0,0,0,.8)}
  #tslink .tsl-t{color:rgba(255,255,255,.66);font-size:.88rem;line-height:1.62;margin:0 auto;max-width:34ch;text-shadow:0 1px 2px rgba(0,0,0,.9),0 2px 10px rgba(0,0,0,.85),0 4px 22px rgba(0,0,0,.7)}
  #tslink .tsl-k{text-shadow:0 1px 2px rgba(0,0,0,.9),0 2px 8px rgba(0,0,0,.8)}
  #tslink .tsl-foot{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:20px;padding-top:15px;border-top:1px solid rgba(255,255,255,.07);color:rgba(255,255,255,.42);font-size:.76rem;letter-spacing:.03em}
  #tslink .tsl-foot svg{flex:none;opacity:.7}
  @keyframes tsl-heartbeat{0%{box-shadow:0 4px 14px rgba(var(--g),.10),0 0 14px rgba(var(--g),.10)}18%{box-shadow:0 6px 22px rgba(var(--g),.30),0 0 46px rgba(var(--g),.34)}32%{box-shadow:0 5px 18px rgba(var(--g),.16),0 0 26px rgba(var(--g),.18)}46%{box-shadow:0 6px 20px rgba(var(--g),.26),0 0 40px rgba(var(--g),.28)}72%,100%{box-shadow:0 4px 14px rgba(var(--g),.10),0 0 14px rgba(var(--g),.10)}}
  @media(max-width:860px){#tslink .tsl-grid{grid-template-columns:1fr}}
  @media(prefers-reduced-motion:reduce){#tslink a.tsl-card{opacity:1;transform:none;transition:none}#tslink a.tsl-card:hover{transform:none;animation:none;box-shadow:0 0 26px rgba(var(--g),.25)}}
  `;
  var LINKICON='<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>';
  var CARDS=[
    ['01','Lieferpartner','Deine Lieferanten & Ansprechpartner — die Quelle jeder Einkaufszeile.','https://sore-donut-083.notion.site/DB-Lieferpartner-2f5b9546553483e2afbc816dd470da0a?source=copy_link','Lektion 2.2.1','https://files.catbox.moe/wl5y7h.jpg'],
    ['02','Zutaten','Zieht ihre Preise später direkt aus deiner Inventurliste.','https://sore-donut-083.notion.site/DB-Zutaten-388b95465534827481c0011c243f90de?source=copy_link','Lektion 2.2.2','https://files.catbox.moe/cvv9ee.jpg'],
    ['03','Packaging','Auch Verpackung wird Teil der Kalkulation — bis auf den Cent.','https://sore-donut-083.notion.site/Packaging-cfdb95465534835e9e5f8153ce960d12?source=copy_link','Lektion 2.2.3','https://files.catbox.moe/bwgtim.jpg']
  ];
  function injectCSS(){ if(document.getElementById('tslink-css'))return; var s=document.createElement('style'); s.id='tslink-css'; s.textContent=CSS; document.head.appendChild(s); }
  function build(){
    var root=document.createElement('div'); root.id='tslink';
    root.innerHTML='<div class="tsl-grid">'+CARDS.map(function(c){
      return '<a class="tsl-card" href="'+c[3]+'" target="_blank" rel="noopener" style="--g:'+GLOW+'"><span class="tsl-bg" aria-hidden="true"><img src="'+c[5]+'" alt="" loading="lazy"></span><span class="tsl-num">'+c[0]+'</span><img class="tsl-logo" src="'+LOGO+'" alt="Tasty Studios" loading="lazy"><span class="tsl-k">Datenbank</span><h3 class="tsl-h">DB '+c[1]+'</h3><p class="tsl-t">'+c[2]+'</p><div class="tsl-foot">'+LINKICON+'Verknüpfung in '+c[4]+'</div></a>';
    }).join('')+'</div>';
    return root;
  }
  function setup(root){
    var cards=[...root.querySelectorAll('.tsl-card')];
    var io=new IntersectionObserver(function(e){
      if(!e[0].isIntersecting) return;
      cards.forEach(function(c,i){
        c.style.transitionDelay=(i*0.13)+'s';
        c.classList.add('on');
        setTimeout(function(){ c.style.transitionDelay=''; }, i*130+900);
      });
      io.disconnect();
    },{threshold:.3});
    io.observe(root);
  }
  function findList(){
    var ps=document.querySelectorAll('.page__inventurliste .notion-text');
    for(var i=0;i<ps.length;i++){
      if(/verknüpfen mit/.test(ps[i].textContent||'')){
        var el=ps[i].nextElementSibling;
        while(el){ if(el.matches&&el.matches('ul.notion-bulleted-list')) return el; el=el.nextElementSibling; }
      }
    }
    var uls=document.querySelectorAll('.page__inventurliste ul.notion-bulleted-list');
    for(var j=0;j<uls.length;j++){ var tx=uls[j].textContent||''; if(/DB Lieferpartner/.test(tx)&&/DB Packaging/.test(tx)) return uls[j]; }
    return null;
  }
  function mount(){
    if(!/\/inventurliste\/?$/.test(location.pathname)){ var e=document.getElementById('tslink'); if(e&&e.parentNode)e.parentNode.removeChild(e); return; }
    if(document.getElementById('tslink')) return;
    var ul=findList(); if(!ul) return;
    injectCSS();
    ul.style.display='none';
    var root=build();
    ul.parentNode.insertBefore(root, ul.nextSibling);
    setup(root);
  }
  function boot(){
    var tries=0;
    var iv=setInterval(function(){ tries++; mount(); if(tries>40) clearInterval(iv); },300);
    new MutationObserver(function(){ if(!document.getElementById('tslink')) mount(); }).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='complete') boot(); else window.addEventListener('load',boot);
})();

/* ============================================================
   inventurliste — MacBook-Scroll-Kachel "Mein Inventar" (#tsiv)
   Zwischen dem oberen Fortschritts-Balken und der Überschrift
   „Was uns jetzt noch fehlt". Muster = die „Live Beispiel"-
   Kachel von /mehrwert-zielbild (#tsmb): anklickbarer MacBook
   (Cover = pc.png, „Mein Inventar"-Galerie), Klick → großer PC
   (leerer MacBook-Frame) → Screen scrollt den langen Avocado-
   Detail-Screenshot. Nur auf /inventurliste.
   LAYOUT wie DB 0/Zielbild: #tsiv-root ist selbst ein 2-Spalten-
   Grid (eine Node, vor der Überschrift eingefügt) — linke Hälfte
   frei (Platz für Roberts Notion-Text daneben), MacBook rechts.
   Mobil (<900px) stapelt es: linke Hälfte weg, MacBook voll.
   Bilder (catbox, wie #tsmb): Cover = r8ef2f.png (pc.png) ·
   Scroll = 5hhr5b.png (avocado.png) · Frame (geteilt mit #tsmb)
   = oj1wa9.png. Repo-Archiv: img/inventurliste/{pc,avocado}.png.
   ============================================================ */
(function(){
  if(window.__tsiv) return; window.__tsiv=true;
  var FRAME="https://files.catbox.moe/oj1wa9.png";
  var COVER="https://files.catbox.moe/r8ef2f.png";
  var SHOT="https://files.catbox.moe/5hhr5b.png";
  var CSS=[
    '#tsiv-root{--tsiv-gold:#c7b489;--tsiv-ease:cubic-bezier(.16,1,.3,1);width:min(1000px,95vw);margin:8px auto 40px;display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,4.5vw,60px);align-items:center;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;opacity:0;transform:translateY(20px);transition:opacity .8s var(--tsiv-ease),transform .9s var(--tsiv-ease);}',
    '#tsiv-root.in{opacity:1;transform:none;}',
    '#tsiv-root .tsiv-textslot{min-width:0;min-height:1px;}',
    '#tsiv-root .tsiv-textslot .tsiv-lead{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;font-size:clamp(1.32rem,2vw,1.6rem);font-weight:600;letter-spacing:-.012em;line-height:1.22;color:#fff;margin:0 0 18px;}',
    '#tsiv-root .tsiv-textslot .tsiv-lead .tsiv-accent{color:var(--tsiv-gold);}',
    '#tsiv-root .tsiv-textslot p:not(.tsiv-lead){font-size:.95rem;line-height:1.7;color:rgba(255,255,255,.62);margin:0 0 14px;}',
    '#tsiv-root .tsiv-textslot p:last-child{margin-bottom:0;}',
    '.tsiv-hide{display:none !important;}',
    '#tsiv-root .tsiv-unit{display:flex;flex-direction:column;align-items:center;gap:8px;min-width:0;}',
    '@media(max-width:900px){#tsiv-root{grid-template-columns:1fr;}#tsiv-root .tsiv-textslot{text-align:left;max-width:560px;margin:0 auto;}}',
    '#tsiv-root .tsiv-tile{position:relative;width:100%;max-width:520px;cursor:pointer;border-radius:12px;filter:drop-shadow(0 18px 44px rgba(0,0,0,.5));transition:transform .5s var(--tsiv-ease),filter .5s var(--tsiv-ease);}',
    '#tsiv-root .tsiv-tile:hover{transform:translateY(-4px) scale(1.02);animation:tsivHeartbeat 2.6s var(--tsiv-ease) infinite;}',
    '@keyframes tsivHeartbeat{0%,100%{filter:drop-shadow(0 22px 52px rgba(0,0,0,.6)) drop-shadow(0 6px 18px rgba(199,180,137,.14));}50%{filter:drop-shadow(0 22px 52px rgba(0,0,0,.6)) drop-shadow(0 8px 26px rgba(199,180,137,.30));}}',
    '#tsiv-root .tsiv-tile:active{transform:scale(.99);transition-duration:.12s;}',
    '#tsiv-root .tsiv-cover{width:100%;height:auto;aspect-ratio:831/522;display:block;pointer-events:none;user-select:none;}',
    '#tsiv-root .tsiv-caption{width:100%;text-align:center;font-size:15px;font-weight:600;letter-spacing:.005em;color:#fff;margin-top:6px;}',
    '#tsiv-root .tsiv-caption .tsiv-accent{color:var(--tsiv-gold);}',
    '#tsiv-root .tsiv-hint{font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.32);animation:tsivHint 2.5s ease-in-out infinite;}',
    '@keyframes tsivHint{0%,100%{opacity:.4}50%{opacity:.8}}',
    '#tsiv-lb{position:fixed;inset:0;z-index:99999;display:none;flex-direction:column;align-items:center;justify-content:center;background:rgba(5,6,11,.92);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);padding:32px;opacity:0;transition:opacity .24s cubic-bezier(.16,1,.3,1);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;}',
    '#tsiv-lb.open{display:flex;opacity:1;}',
    '#tsiv-lb .tsiv-inner{position:relative;width:100%;max-width:min(960px,calc(100vw - 64px));transform:scale(.92) translateY(24px);transition:transform .5s cubic-bezier(.16,1,.3,1);}',
    '#tsiv-lb.open .tsiv-inner{transform:scale(1) translateY(0);}',
    '#tsiv-lb.full{padding:0;}',
    '#tsiv-lb.full .tsiv-inner{max-width:100vw;}',
    '#tsiv-lb .tsiv-mockup{position:relative;width:100%;aspect-ratio:1366/768;filter:drop-shadow(0 30px 80px rgba(0,0,0,.6)) drop-shadow(0 10px 30px rgba(0,0,0,.5));}',
    '#tsiv-lb .tsiv-frame{position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none;user-select:none;}',
    '#tsiv-lb .tsiv-screen{position:absolute;top:3.65%;left:12.22%;width:73.06%;height:83.85%;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;z-index:3;border-radius:3px;background:#191919;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.14) transparent;}',
    '#tsiv-lb .tsiv-screen::-webkit-scrollbar{width:5px;}',
    '#tsiv-lb .tsiv-screen::-webkit-scrollbar-thumb{background:rgba(255,255,255,.14);border-radius:4px;}',
    '#tsiv-lb .tsiv-screen img{width:100%;display:block;}',
    '#tsiv-lb .tsiv-closehint{margin-top:22px;font-size:12px;letter-spacing:.1em;color:rgba(255,255,255,.32);text-align:center;}',
    '#tsiv-lb.full .tsiv-closehint{display:none;}',
    '#tsiv-lb .tsiv-btn{position:absolute;top:16px;z-index:10;width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.55);cursor:pointer;display:flex;align-items:center;justify-content:center;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);transition:background .2s,color .2s;}',
    '#tsiv-lb .tsiv-btn:hover{background:rgba(255,255,255,.16);color:#fff;}',
    '#tsiv-lb .tsiv-expand{left:16px;}#tsiv-lb .tsiv-closex{right:16px;}',
    '@media(prefers-reduced-motion:reduce){#tsiv-root,#tsiv-root *,#tsiv-lb *{animation:none!important;transition-duration:.01ms!important;}#tsiv-root{opacity:1;transform:none;}}'
  ].join('');
  function injectCSS(){ if(document.getElementById('tsiv-css'))return; var s=document.createElement('style'); s.id='tsiv-css'; s.textContent=CSS; document.head.appendChild(s); }
  function shut(){ var lb=document.getElementById('tsiv-lb'); if(!lb)return; lb.classList.remove('open','full'); document.body.style.overflow=''; }
  function ensureLb(){
    var lb=document.getElementById('tsiv-lb'); if(lb) return lb;
    lb=document.createElement('div'); lb.id='tsiv-lb';
    lb.innerHTML='<button class="tsiv-btn tsiv-expand" title="Vollbild" aria-label="Vollbild"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="tsiv-btn tsiv-closex" title="Schließen" aria-label="Schließen"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4.5 4.5l9 9M13.5 4.5l-9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button><div class="tsiv-inner"><div class="tsiv-mockup"><img class="tsiv-frame" src="'+FRAME+'" alt="MacBook"><div class="tsiv-screen"><img src="'+SHOT+'" alt="Avocado — Zutaten-Detailseite"></div></div></div><div class="tsiv-closehint">✕ Klicke daneben oder ESC zum Schließen</div>';
    document.body.appendChild(lb);
    var inner=lb.querySelector('.tsiv-inner');
    lb.querySelector('.tsiv-closex').addEventListener('click',shut);
    lb.querySelector('.tsiv-expand').addEventListener('click',function(e){ e.stopPropagation(); lb.classList.toggle('full'); });
    inner.addEventListener('click',function(e){ e.stopPropagation(); });
    lb.addEventListener('click',function(e){ if(e.target===lb) shut(); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') shut(); });
    return lb;
  }
  function openLb(){ var lb=ensureLb(); lb.classList.add('open'); lb.classList.remove('full'); document.body.style.overflow='hidden'; var sc=lb.querySelector('.tsiv-screen'); if(sc) sc.scrollTop=0; }
  function buildTile(){
    var root=document.createElement('div'); root.id='tsiv-root';
    root.innerHTML='<div class="tsiv-textslot"></div><div class="tsiv-unit"><div class="tsiv-tile" role="button" tabindex="0" aria-label="Mein Inventar vergrößern"><img class="tsiv-cover" src="'+COVER+'" alt="Mein Inventar — DB Inventurliste" fetchpriority="high" decoding="async"></div><div class="tsiv-caption">Mein Inventar<span class="tsiv-accent"> – Live Beispiel</span></div><div class="tsiv-hint">Klicke zum Vergrößern</div></div>';
    var tile=root.querySelector('.tsiv-tile');
    tile.addEventListener('click',openLb);
    tile.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openLb(); } });
    return root;
  }
  function reveal(root){
    if(root.__rv) return; root.__rv=true;
    var io=new IntersectionObserver(function(en){ if(en[0].isIntersecting){ root.classList.add('in'); io.disconnect(); } },{threshold:.2});
    io.observe(root);
  }
  function findHeading(){
    var hs=document.querySelectorAll('.page__inventurliste .notion-heading, .page__inventurliste h1, .page__inventurliste h2');
    for(var i=0;i<hs.length;i++){ if(/Was uns jetzt noch fehlt/i.test(hs[i].textContent||'')) return hs[i]; }
    return null;
  }
  /* Roberts Notion-Text (Lead + 2 Absätze) für die linke Slot-Spalte. Block-IDs primär,
     Phrasen als Fallback — so überlebt es sowohl Copy-Edits (ID) als auch Block-Neuanlage (Phrase). */
  var LEAD_ID='block-39bb95465534804e9a9ed9762f5b2e6f';
  var B1_ID='block-39bb954655348057b301cf325b5c1016';
  var B2_ID='block-39bb9546553480f6bca8e98e15d3eaa2';
  var SPACER_ID='block-39bb95465534806493f0fd96d5d1edcd';
  function findByPhrase(ph){
    var els=document.querySelectorAll('.page__inventurliste p.notion-text, .page__inventurliste .notion-text__content');
    for(var i=0;i<els.length;i++){ if((els[i].textContent||'').trim().indexOf(ph)===0) return els[i]; }
    return null;
  }
  function hideBlock(el){ if(!el)return; var w=(el.id&&/^block-/.test(el.id))?el:(el.closest('[id^="block-"]')||el); if(w) w.classList.add('tsiv-hide'); }
  function makeLead(text){
    var p=document.createElement('p'); p.className='tsiv-lead';
    var m=(text||'').match(/^([\s\S]*\s)(\S+)$/);
    if(m){ p.appendChild(document.createTextNode(m[1])); var s=document.createElement('span'); s.className='tsiv-accent'; s.textContent=m[2]; p.appendChild(s); }
    else p.textContent=text||'';
    return p;
  }
  function makeP(text){ var p=document.createElement('p'); p.textContent=(text||'').trim(); return p; }
  /* Klont den echten Notion-Text in die Slot-Spalte neben das MacBook und versteckt die
     Originale — Notion bleibt Text-SSOT, kein Duplikat. Idempotent (slot.__filled). */
  function fillText(){
    var root=document.getElementById('tsiv-root'); if(!root) return;
    var slot=root.querySelector('.tsiv-textslot'); if(!slot || slot.__filled) return;
    var lead=document.getElementById(LEAD_ID) || findByPhrase('Deine fertige Datenbank');
    var b1=document.getElementById(B1_ID) || findByPhrase('So kann deine Inventurliste');
    var b2=document.getElementById(B2_ID) || findByPhrase('Außerdem werden wir in der Lektion');
    if(!lead || !b1 || !b2) return; /* auf Notion-Hydration warten */
    slot.appendChild(makeLead((lead.textContent||'').trim()));
    slot.appendChild(makeP(b1.textContent));
    slot.appendChild(makeP(b2.textContent));
    slot.__filled=true;
    hideBlock(lead);
    var sp=document.getElementById(SPACER_ID); if(sp) sp.classList.add('tsiv-hide');
    var col=b1.closest('.notion-column-list'); if(col){ col.classList.add('tsiv-hide'); } else { hideBlock(b1); hideBlock(b2); }
  }
  /* #tsiv-root ist selbst ein 2-Spalten-Grid: links Roberts Notion-Text, rechts das MacBook. */
  function mount(){
    if(!/\/inventurliste\/?$/.test(location.pathname)){
      ['tsiv-root','tsiv-lb'].forEach(function(id){ var e=document.getElementById(id); if(e&&e.parentNode)e.parentNode.removeChild(e); });
      return;
    }
    var h=findHeading(); if(!h) return;
    if(!document.getElementById('tsiv-root')){
      var block=h.closest('[id^="block-"]')||h;
      injectCSS();
      var root=buildTile();
      block.parentNode.insertBefore(root, block);
      reveal(root);
    }
    fillText();
  }
  function boot(){
    var tries=0;
    var iv=setInterval(function(){ tries++; mount(); if(tries>60) clearInterval(iv); },300);
    var t=null;
    new MutationObserver(function(){ if(t) return; t=setTimeout(function(){ t=null; mount(); },200); }).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='complete') boot(); else window.addEventListener('load',boot);
})();

/* ---- */

/* ============================================================
   inventurliste — #tsdb0 Scroll-Animation "DB 0 : Inventurliste"
   Ersetzt den Screenshot (Heading + Ansichts-Tabs) durch natives,
   scroll-getriggertes Element: Reveal + wandernde Glas-Pille durch
   die 3 Ansichten (Tabelle / Nach Lieferpartner / Nach Preis).
   Anker: Callout "Empfehlung zur Anzeige" (linke Spalte daneben).
   ============================================================ */
(function(){
  if(window.__tsdb0) return; window.__tsdb0=true;
  var CSS=`
  #tsdb0{width:100%;margin:6px 0 10px;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;color:#fff}
  #tsdb0 .hd{font-size:1.65rem;font-weight:700;letter-spacing:-.01em;line-height:1.2;margin:0 0 18px;opacity:0;transform:translateY(14px);transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1)}
  #tsdb0 .hd .g{color:#c7b489}
  #tsdb0.in .hd{opacity:1;transform:none}
  #tsdb0 .row{position:relative;display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap}
  #tsdb0 .ind{position:absolute;top:0;left:0;height:100%;border-radius:999px;background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.16);box-shadow:0 0 22px rgba(199,180,137,.10);opacity:0;transition:left .55s cubic-bezier(.22,1,.36,1),width .55s cubic-bezier(.22,1,.36,1),opacity .4s ease;pointer-events:none}
  #tsdb0.in .ind{opacity:1}
  #tsdb0 .tb{position:relative;z-index:1;display:inline-flex;align-items:center;gap:8px;padding:9px 16px;border-radius:999px;font-size:.92rem;font-weight:600;color:rgba(255,255,255,.5);white-space:nowrap;opacity:0;transform:translateY(10px) scale(.96);transition:color .45s ease,opacity .55s cubic-bezier(.16,1,.3,1),transform .55s cubic-bezier(.16,1,.3,1)}
  #tsdb0 .tb svg{width:15px;height:15px;flex:none;opacity:.75}
  #tsdb0.in .tb{opacity:1;transform:none}
  #tsdb0.in .tb:nth-child(3){transition-delay:.10s}
  #tsdb0.in .tb:nth-child(4){transition-delay:.20s}
  #tsdb0 .tb.on{color:#fff}
  #tsdb0 .tb.on svg{opacity:1}
  @media(max-width:720px){#tsdb0 .hd{font-size:1.35rem}#tsdb0 .tb{padding:8px 12px;font-size:.85rem}}
  `;
  var ICON='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5"/><path d="M1.5 6.5h13M6.5 6.5v7"/></svg>';
  var TABS=['Tabelle','Nach Lieferpartner','Nach Preis'];
  function injectCSS(){ if(document.getElementById('tsdb0-css'))return; var s=document.createElement('style'); s.id='tsdb0-css'; s.textContent=CSS; document.head.appendChild(s); }
  function build(){
    var root=document.createElement('div'); root.id='tsdb0';
    root.innerHTML='<div class="hd">DB 0 : <span class="g">Inventurliste</span></div>'+
      '<div class="row"><span class="ind"></span>'+
      TABS.map(function(t){ return '<span class="tb">'+ICON+t+'</span>'; }).join('')+'</div>';
    return root;
  }
  function setup(root){
    var tabs=[].slice.call(root.querySelectorAll('.tb')), ind=root.querySelector('.ind'), idx=0, timer=null;
    function move(){
      var t=tabs[idx];
      ind.style.left=t.offsetLeft+'px'; ind.style.width=t.offsetWidth+'px';
      tabs.forEach(function(x,i){ x.classList.toggle('on',i===idx); });
    }
    var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    var io=new IntersectionObserver(function(e){
      if(e[0].isIntersecting){
        root.classList.add('in'); move();
        if(!reduce&&!timer) timer=setInterval(function(){ idx=(idx+1)%tabs.length; move(); },2400);
      } else if(timer){ clearInterval(timer); timer=null; }
    },{threshold:.35});
    io.observe(root);
    window.addEventListener('resize',move);
  }
  function findSpot(){
    var cs=document.querySelectorAll('.notion-callout,[class*="callout"]');
    var a=null;
    for(var i=0;i<cs.length;i++){ if(/Empfehlung zur Anzeige/.test(cs[i].textContent||'')){ a=cs[i]; break; } }
    if(!a){
      var n=document.querySelectorAll('.notion-text,.notion-semantic-string');
      for(var j=0;j<n.length;j++){ if(/Empfehlung zur Anzeige/.test(n[j].textContent||'')){ a=n[j]; break; } }
    }
    if(!a) return null;
    var col=a.closest('.notion-column');
    if(col){
      var list=col.closest('.notion-column-list');
      var first=list?list.querySelector('.notion-column'):null;
      if(first&&first!==col) return {mode:'append',el:first};
    }
    var blk=a.closest('[id^="block-"]')||a;
    return {mode:'before',el:blk};
  }
  function mount(){
    if(!/\/inventurliste\/?$/.test(location.pathname)){ var e=document.getElementById('tsdb0'); if(e&&e.parentNode)e.parentNode.removeChild(e); return; }
    if(document.getElementById('tsdb0')) return;
    var spot=findSpot(); if(!spot) return;
    injectCSS();
    var root=build();
    if(spot.mode==='append') spot.el.appendChild(root);
    else spot.el.parentNode.insertBefore(root,spot.el);
    setup(root);
  }
  function boot(){
    var tries=0;
    var iv=setInterval(function(){ tries++; mount(); if(tries>40) clearInterval(iv); },300);
    new MutationObserver(function(){ if(!document.getElementById('tsdb0')) mount(); }).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='complete') boot(); else window.addEventListener('load',boot);
})();

/* ============================================================
   inventurliste — #tsmiss "Was uns jetzt noch fehlt"
   (ersetzt #tsside, 11.07.2026.) Heading groß + mittig in
   "Lineal TS" (+72px Abstand zum Shop-Zähler darüber),
   Intro-Text mittig mit Wortlaut-Override "… verknüpfen mit
   unserem System." (Display-Layer; no-opt von selbst, sobald
   der Text in Notion nachgezogen ist). "Dazu kommen wir…"
   bleibt an Ort und Stelle und wird weiß + mittig unter den
   3 Kacheln gestylt (.tsm-mid). Darunter 2-Zonen-Grid:
   links (erstes Drittel) die DB0-Animation #tsdb0 als vertikale
   Ansichts-Liste (Glas-Highlight statt wandernder Pille),
   rechts (2/3) die allgemeinen Infos ("Als nächstes…" falls
   in Notion vorhanden — optional — + "Empfehlung zur Anzeige"
   + Liste) als Klone, die per gestaffeltem Scroll-Reveal
   hochwandern. Notion-DOM wird NICHT verschoben — Originale
   nur versteckt (React-sicher, Muster wie .tsmac).
   Anker: Phrase-first, Einfügepunkt = h2 "Empfehlung zur
   Anzeige" (Pflicht-Anker; einzelne Sätze darf Robert in
   Notion löschen, ohne dass die Sektion zerfällt).
   v2 (11.07.2026): Das 2-Zonen-Grid ist jetzt EINE zusammen-
   hängende 3D-Glas-Kachel (Glas-Sprache wie #tslink, Champagner-
   Glow --g:199,180,137): Scroll-Entrance mit Perspektive
   (rotateX), dezenter Pointer-Tilt nur bei hover:hover +
   pointer:fine (reduced-motion: alles statisch), Heartbeat-Glow
   bei Hover. Zusammenhang sichtbar gemacht: die aktive Ansicht
   in #tsdb0 koppelt live auf den zugehörigen Empfehlungs-Schritt
   ("Nach Lieferpartner"→Schritt 1, "Nach Preis"→Schritt 2,
   Glas-Highlight wie .tb.on) + goldene SVG-Verbindungslinie
   zwischen beiden (Layout-Koordinaten via offsetParent-Kette,
   nur >900px; mobil nur Schritt-Highlight). NEUES MUSTER:
   3D-Tilt-Kachel — vor Zweitnutzung in Design-System.md
   kanonisieren.
   ============================================================ */
(function(){
  if(window.__tsmiss) return; window.__tsmiss=true;
  var CSS=`
  .page__inventurliste .tsm-h{text-align:center !important;color:#fff !important;font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif !important;font-size:clamp(1.7rem,2.6vw,2.2rem) !important;font-weight:600 !important;letter-spacing:-.01em !important;line-height:1.2 !important;margin-top:72px !important;margin-bottom:16px !important}
  .page__inventurliste .tsm-h .tsm-hg{color:#c7b489 !important}
  .page__inventurliste .tsm-i{max-width:820px;margin-left:auto !important;margin-right:auto !important;text-align:center !important;color:rgba(255,255,255,.62) !important}
  .page__inventurliste .tsm-mid{max-width:820px;margin-left:auto !important;margin-right:auto !important;margin-top:10px !important;text-align:center !important;color:#fff !important}
  #tsmiss{--g:199,180,137;--rx:0deg;--ry:0deg;position:relative;display:grid;grid-template-columns:minmax(300px,1fr) 2fr;gap:clamp(28px,4.5vw,60px);align-items:center;width:min(1000px,95vw);margin:34px auto 30px;padding:clamp(26px,4vw,44px) clamp(24px,4.5vw,50px);border-radius:20px;background:linear-gradient(165deg,rgba(255,255,255,.05),rgba(255,255,255,.015) 55%,rgba(255,255,255,0));border:1px solid rgba(255,255,255,.10);box-shadow:0 18px 44px -30px rgba(0,0,0,.85),0 0 14px rgba(var(--g),.08);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;color:#fff;transform-style:preserve-3d;will-change:transform;opacity:0;transform:perspective(1100px) rotateX(9deg) translateY(34px) scale(.97);transition:opacity .8s ease,transform .9s cubic-bezier(.16,1,.3,1)}
  #tsmiss,#tsmiss *{box-sizing:border-box}
  #tsmiss.in{opacity:1;transform:perspective(1100px) rotateX(var(--rx)) rotateY(var(--ry))}
  #tsmiss.live{transition:transform .16s ease-out,box-shadow .5s ease,border-color .4s ease}
  #tsmiss.live:hover{border-color:rgba(var(--g),.4);animation:tsm-heartbeat 2.6s cubic-bezier(.4,0,.3,1) infinite}
  #tsmiss::before{content:"";position:absolute;inset:0;border-radius:20px;background:radial-gradient(560px circle at var(--mx,50%) var(--my,0%),rgba(255,255,255,.055),transparent 46%);opacity:0;transition:opacity .5s ease;pointer-events:none}
  #tsmiss.live:hover::before{opacity:1}
  #tsmiss::after{content:"";position:absolute;top:0;left:9%;right:9%;height:1px;background:linear-gradient(90deg,transparent,rgba(var(--g),.4),transparent);pointer-events:none}
  #tsmiss .tsm-link{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:0;opacity:1;transition:opacity .35s ease}
  #tsmiss .tsm-link.off{opacity:0}
  #tsmiss .tsm-link path{fill:none;stroke:rgba(var(--g),.55);stroke-width:1.5;filter:drop-shadow(0 0 6px rgba(var(--g),.35))}
  #tsmiss .tsm-link circle{fill:rgba(var(--g),.9)}
  #tsmiss .tsm-col{min-width:0;position:relative;z-index:1;transform:translateZ(22px)}
  #tsmiss #tsdb0{margin:0}
  #tsmiss #tsdb0 .hd{font-size:1.4rem;margin-bottom:14px}
  #tsmiss #tsdb0 .row{display:flex;flex-direction:column;align-items:stretch;gap:6px;max-width:280px}
  #tsmiss #tsdb0 .ind{display:none}
  #tsmiss #tsdb0 .tb{border-radius:12px;padding:10px 14px;transition:color .45s ease,background .5s ease,box-shadow .5s ease,opacity .55s cubic-bezier(.16,1,.3,1),transform .55s cubic-bezier(.16,1,.3,1)}
  #tsmiss #tsdb0 .tb.on{background:rgba(255,255,255,.09);box-shadow:inset 0 0 0 1px rgba(255,255,255,.16),0 0 22px rgba(199,180,137,.10)}
  #tsmiss .tsm-item{opacity:0;transform:translateY(14px);transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1)}
  #tsmiss.in .tsm-item{opacity:1;transform:none}
  #tsmiss .tsm-p{color:rgba(255,255,255,.62);font-size:.95rem;line-height:1.7;margin:0 0 14px;max-width:none}
  #tsmiss .tsm-emph2{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;font-size:1.45rem;font-weight:600;letter-spacing:-.012em;text-align:center;color:#fff;margin:2px 0 16px !important;padding:0}
  #tsmiss .tsm-emph2 .tsm-eg{color:#c7b489}
  #tsmiss .tsm-ol{margin:0;padding-left:1.6em}
  #tsmiss .tsm-ol li{color:rgba(255,255,255,.62);font-size:.92rem;line-height:1.7;margin:0 0 10px;padding:10px 14px;border-radius:12px;transition:color .45s ease,background .5s ease,box-shadow .5s ease}
  #tsmiss .tsm-ol li::marker{color:rgba(255,255,255,.35);font-weight:600}
  #tsmiss .tsm-ol li.lit{color:#fff;background:rgba(255,255,255,.09);box-shadow:inset 0 0 0 1px rgba(255,255,255,.16),0 0 22px rgba(var(--g),.10)}
  #tsmiss .tsm-ol li.lit::marker{color:rgba(var(--g),.9)}
  .tsm-hide{display:none !important}
  @keyframes tsm-heartbeat{0%{box-shadow:0 4px 14px rgba(var(--g),.10),0 0 14px rgba(var(--g),.10)}18%{box-shadow:0 6px 22px rgba(var(--g),.30),0 0 46px rgba(var(--g),.34)}32%{box-shadow:0 5px 18px rgba(var(--g),.16),0 0 26px rgba(var(--g),.18)}46%{box-shadow:0 6px 20px rgba(var(--g),.26),0 0 40px rgba(var(--g),.28)}72%,100%{box-shadow:0 4px 14px rgba(var(--g),.10),0 0 14px rgba(var(--g),.10)}}
  @media(max-width:900px){#tsmiss{grid-template-columns:1fr;gap:26px}#tsmiss .tsm-link{display:none}}
  @media(prefers-reduced-motion:reduce){#tsmiss,#tsmiss.in{opacity:1;transform:none;transition:none}#tsmiss .tsm-item{opacity:1;transform:none;transition:none}#tsmiss.live:hover{animation:none;box-shadow:0 18px 44px -30px rgba(0,0,0,.85),0 0 26px rgba(var(--g),.22)}}
  `;
  function on(){ return /\/inventurliste\/?$/.test(location.pathname); }
  function injectCSS(){ if(document.getElementById('tsmiss-css'))return; var s=document.createElement('style'); s.id='tsmiss-css'; s.textContent=CSS; document.head.appendChild(s); }
  function findText(sel,re){ var n=document.querySelectorAll(sel); for(var i=0;i<n.length;i++){ if(re.test(n[i].textContent||'')) return n[i]; } return null; }
  function retext(){
    var h=findText('.page__inventurliste .notion-heading', /Was uns jetzt noch fehlt/);
    if(h && !h.classList.contains('tsm-h')){ h.classList.add('tsm-h'); h.textContent=(h.textContent||'').replace(/\s*:\s*$/,''); }
    if(h && !h.querySelector('.tsm-hg')){ h.innerHTML=(h.textContent||'').replace(/(fehlt)(\s*)$/,'<span class="tsm-hg">$1</span>$2'); } /* Zwei-Ton: letztes Wort gold */
    var p=findText('.page__inventurliste .notion-text', /Grundstruktur für deine Inventurliste/);
    if(p && !p.classList.contains('tsm-i')){
      p.classList.add('tsm-i');
      p.textContent=(p.textContent||'').replace(/^\s*DIe\s/,'Die ').replace(/verknüpfen mit\s*:?\s*$/,'verknüpfen mit unserem System.');
    }
    var m=findText('.page__inventurliste .notion-text', /Dazu kommen wir in den jeweiligen Lektionen/);
    if(m && !m.classList.contains('tsm-mid')) m.classList.add('tsm-mid');
  }
  function stripIds(el){ el.removeAttribute('id'); var q=el.querySelectorAll('[id]'); for(var i=0;i<q.length;i++)q[i].removeAttribute('id'); return el; }
  function pos(el,root){ var x=0,y=0; while(el&&el!==root){ x+=el.offsetLeft; y+=el.offsetTop; el=el.offsetParent; } return {x:x,y:y}; }
  /* Live-Kopplung Ansicht → Empfehlungs-Schritt + goldene Verbindungslinie */
  function connect(wrap){
    var NS='http://www.w3.org/2000/svg';
    var tabs=[].slice.call(wrap.querySelectorAll('#tsdb0 .tb'));
    var lis=[].slice.call(wrap.querySelectorAll('.tsm-ol li'));
    if(tabs.length<3||lis.length<2) return;
    var MAP={1:0,2:1}; /* Nach Lieferpartner→Schritt 1, Nach Preis→Schritt 2 */
    var svg=document.createElementNS(NS,'svg'); svg.setAttribute('class','tsm-link off');
    var path=document.createElementNS(NS,'path');
    var c1=document.createElementNS(NS,'circle'), c2=document.createElementNS(NS,'circle');
    c1.setAttribute('r','2.5'); c2.setAttribute('r','2.5');
    svg.appendChild(path); svg.appendChild(c1); svg.appendChild(c2);
    wrap.appendChild(svg);
    function draw(a,b){
      svg.setAttribute('viewBox','0 0 '+wrap.clientWidth+' '+wrap.clientHeight);
      var pa=pos(a,wrap), pb=pos(b,wrap);
      var ax=pa.x+a.offsetWidth+10, ay=pa.y+a.offsetHeight/2;
      var bx=pb.x-14, by=pb.y+b.offsetHeight/2;
      var dx=Math.max(30,(bx-ax)*.45);
      path.setAttribute('d','M'+ax+' '+ay+' C'+(ax+dx)+' '+ay+', '+(bx-dx)+' '+by+', '+bx+' '+by);
      c1.setAttribute('cx',ax); c1.setAttribute('cy',ay);
      c2.setAttribute('cx',bx); c2.setAttribute('cy',by);
      try{
        var len=path.getTotalLength();
        path.style.transition='none';
        path.style.strokeDasharray=len;
        path.style.strokeDashoffset=len;
        void path.getBoundingClientRect();
        path.style.transition='stroke-dashoffset .55s cubic-bezier(.22,1,.36,1)';
        path.style.strokeDashoffset='0';
      }catch(e){}
      svg.classList.remove('off');
    }
    function upd(){
      var act=-1;
      for(var i=0;i<tabs.length;i++) if(tabs[i].classList.contains('on')) act=i;
      var li=(act in MAP)?lis[MAP[act]]:null;
      for(var j=0;j<lis.length;j++) lis[j].classList.toggle('lit',lis[j]===li);
      if(!li||window.innerWidth<901){ svg.classList.add('off'); return; }
      draw(tabs[act],li);
    }
    var mo=new MutationObserver(upd);
    tabs.forEach(function(t){ mo.observe(t,{attributes:true,attributeFilter:['class']}); });
    window.addEventListener('resize',upd);
    upd();
  }
  /* Dezenter 3D-Pointer-Tilt — nur Desktop-Pointer, nie bei reduced-motion */
  function tilt(wrap){
    if(!(window.matchMedia&&matchMedia('(hover: hover) and (pointer: fine)').matches)) return;
    if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var raf=null, cx=0, cy=0;
    wrap.addEventListener('mousemove',function(e){
      cx=e.clientX; cy=e.clientY;
      if(!wrap.classList.contains('live')||raf) return;
      raf=requestAnimationFrame(function(){
        raf=null;
        var r=wrap.getBoundingClientRect();
        var px=(cx-r.left)/r.width, py=(cy-r.top)/r.height;
        wrap.style.setProperty('--ry',((px-.5)*5).toFixed(2)+'deg');
        wrap.style.setProperty('--rx',((.5-py)*4).toFixed(2)+'deg');
        wrap.style.setProperty('--mx',(px*100).toFixed(1)+'%');
        wrap.style.setProperty('--my',(py*100).toFixed(1)+'%');
      });
    });
    wrap.addEventListener('mouseleave',function(){
      wrap.style.setProperty('--rx','0deg'); wrap.style.setProperty('--ry','0deg');
    });
  }
  function mount(){
    if(!on()){ var e=document.getElementById('tsmiss'); if(e&&e.parentNode)e.parentNode.removeChild(e); return; }
    injectCSS();
    retext();
    if(document.getElementById('tsmiss')) return;
    var db0=document.getElementById('tsdb0');
    var p2=findText('.page__inventurliste .notion-text', /Als nächstes entwickeln wir/); /* optional — Satz kann in Notion fehlen */
    var h2=findText('.page__inventurliste h2.notion-heading', /Empfehlung zur Anzeige/);
    if(!db0||!h2) return;
    var ol=h2.nextElementSibling;
    while(ol && !(ol.matches&&ol.matches('ol.notion-numbered-list'))) ol=ol.nextElementSibling;
    var wrap=document.createElement('div'); wrap.id='tsmiss';
    var L=document.createElement('div'); L.className='tsm-col';
    var R=document.createElement('div'); R.className='tsm-col';
    wrap.appendChild(L); wrap.appendChild(R);
    h2.parentNode.insertBefore(wrap, h2);
    L.appendChild(db0);
    function addClone(el,cls){ if(!el)return; var c=stripIds(el.cloneNode(true)); c.className+=' '+cls+' tsm-item'; R.appendChild(c); el.classList.add('tsm-hide'); }
    addClone(p2,'tsm-p'); addClone(h2,'tsm-emph2'); addClone(ol,'tsm-ol');
    var emph=R.querySelector('.tsm-emph2'); /* letztes Wort "Anzeige" beige (#c7b489), parallel zu "DB 0 : Inventurliste" links */
    if(emph && !emph.querySelector('.tsm-eg')) emph.innerHTML=(emph.textContent||'').replace(/(\S+)(\s*)$/,'<span class="tsm-eg">$1</span>$2');
    var items=R.querySelectorAll('.tsm-item');
    for(var i=0;i<items.length;i++) items[i].style.transitionDelay=(i*0.12)+'s';
    var io=new IntersectionObserver(function(e){
      if(e[0].isIntersecting){
        wrap.classList.add('in');
        setTimeout(function(){ wrap.classList.add('live'); },950);
        io.disconnect();
      }
    },{threshold:.25});
    io.observe(wrap);
    connect(wrap);
    tilt(wrap);
  }
  function boot(){
    var tries=0;
    var iv=setInterval(function(){ tries++; mount(); if(tries>60) clearInterval(iv); },300);
    new MutationObserver(function(){ if(on()) mount(); }).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='complete') boot(); else window.addEventListener('load',boot);
})();

/* ---- */

/* ============================================================
   lieferpartner — #tslpemp  "Empfehlung zur Einrichtung"
   Klon des inventurliste-Empfehlungskastens (#tsdb0 + #tsmiss)
   als EIN self-contained IIFE für die Seite /lieferpartner-
   ansprechpartner-lieferantenvertrge. Linke Spalte = DB-
   Animation (zyklisches Glas-Highlight durch DB I / DB II /
   DB III, Sprache wie #tsdb0), rechte Spalte = Lineal-Heading
   "Empfehlung zur Einrichtung" (letztes Wort beige) + Claude-
   Code-Empfehlungstext. KEIN Connector (rechts keine Schritt-
   Liste). Glas-Sprache identisch #tsmiss (--g:199,180,137,
   Perspektiv-Entrance, Pointer-Tilt, Heartbeat, Gold-Top-Line).
   Anker (Phrase-first, React-sicher): Notion-Marker
   "+++ Empfehlung zur Nutzung +++" + Folgeabsatz "Lass Claude
   Code…" (geklont, Originale nur .tslp-hide). "Somit…" wird
   mittig gestylt (.tslp-i), "In der nächsten Lektion…" als
   mittige Abschlusszeile (.tslp-mid). Box wird direkt UNTER
   "Somit…" eingesetzt.
   ============================================================ */
(function(){
  if(window.__tslpemp) return; window.__tslpemp=true;
  var SLUG=/\/lieferpartner-ansprechpartner-lieferantenvertrge\/?$/;
  var PG='.page__lieferpartner-ansprechpartner-lieferantenvertrge';
  var ICON='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5"/><path d="M1.5 6.5h13M6.5 6.5v7"/></svg>';
  var DBS=[['DB I','Lieferpartner'],['DB II','Ansprechpartner'],['DB III','Verträge']];
  var CSS=`
  ${PG} .tslp-i{max-width:820px;margin-left:auto !important;margin-right:auto !important;text-align:center !important;color:#fff !important}
  ${PG} .tslp-mid{max-width:760px;margin-left:auto !important;margin-right:auto !important;margin-top:16px !important;text-align:center !important;color:rgba(255,255,255,.62) !important}
  .tslp-hide{display:none !important}
  #tslpemp{--g:199,180,137;--rx:0deg;--ry:0deg;position:relative;display:grid;grid-template-columns:minmax(280px,1fr) 1.35fr;gap:clamp(28px,4.5vw,56px);align-items:center;width:min(1000px,95vw);margin:26px auto 22px;padding:clamp(26px,4vw,44px) clamp(24px,4.5vw,50px);border-radius:20px;background:linear-gradient(165deg,rgba(255,255,255,.05),rgba(255,255,255,.015) 55%,rgba(255,255,255,0));border:1px solid rgba(255,255,255,.10);box-shadow:0 18px 44px -30px rgba(0,0,0,.85),0 0 14px rgba(var(--g),.08);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;color:#fff;transform-style:preserve-3d;will-change:transform;opacity:0;transform:perspective(1100px) rotateX(9deg) translateY(34px) scale(.97);transition:opacity .8s ease,transform .9s cubic-bezier(.16,1,.3,1)}
  #tslpemp,#tslpemp *{box-sizing:border-box}
  #tslpemp.in{opacity:1;transform:perspective(1100px) rotateX(var(--rx)) rotateY(var(--ry))}
  #tslpemp.live{transition:transform .16s ease-out,box-shadow .5s ease,border-color .4s ease}
  #tslpemp.live:hover{border-color:rgba(var(--g),.4);animation:tslp-heartbeat 2.6s cubic-bezier(.4,0,.3,1) infinite}
  #tslpemp::before{content:"";position:absolute;inset:0;border-radius:20px;background:radial-gradient(560px circle at var(--mx,50%) var(--my,0%),rgba(255,255,255,.055),transparent 46%);opacity:0;transition:opacity .5s ease;pointer-events:none}
  #tslpemp.live:hover::before{opacity:1}
  #tslpemp::after{content:"";position:absolute;top:0;left:9%;right:9%;height:1px;background:linear-gradient(90deg,transparent,rgba(var(--g),.4),transparent);pointer-events:none}
  #tslpemp .tslp-col{min-width:0;position:relative;z-index:1;transform:translateZ(22px)}
  #tslpemp .db-hd{font-size:1.4rem;font-weight:700;letter-spacing:-.01em;line-height:1.2;margin:0 0 14px;color:#fff;opacity:0;transform:translateY(14px);transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1)}
  #tslpemp .db-hd .g{color:#c7b489}
  #tslpemp.in .db-hd{opacity:1;transform:none}
  #tslpemp .db-row{display:flex;flex-direction:column;align-items:stretch;gap:6px;max-width:300px}
  #tslpemp .tb{display:inline-flex;align-items:center;gap:9px;padding:11px 15px;border-radius:12px;font-size:.94rem;font-weight:600;color:rgba(255,255,255,.5);white-space:nowrap;opacity:0;transform:translateY(10px) scale(.97);transition:color .45s ease,background .5s ease,box-shadow .5s ease,opacity .55s cubic-bezier(.16,1,.3,1),transform .55s cubic-bezier(.16,1,.3,1)}
  #tslpemp .tb svg{width:15px;height:15px;flex:none;opacity:.7}
  #tslpemp .tb .num{color:#c7b489;font-variant-numeric:tabular-nums;opacity:.9}
  #tslpemp.in .tb{opacity:1;transform:none}
  #tslpemp.in .tb:nth-child(2){transition-delay:.10s}
  #tslpemp.in .tb:nth-child(3){transition-delay:.20s}
  #tslpemp .tb.on{color:#fff;background:rgba(255,255,255,.09);box-shadow:inset 0 0 0 1px rgba(255,255,255,.16),0 0 22px rgba(var(--g),.10)}
  #tslpemp .tb.on svg{opacity:1}
  #tslpemp .tb.on .num{opacity:1}
  #tslpemp .tslp-item{opacity:0;transform:translateY(14px);transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1)}
  #tslpemp.in .tslp-item{opacity:1;transform:none}
  #tslpemp .emph{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;font-size:1.45rem;font-weight:600;letter-spacing:-.012em;color:#fff;margin:0 0 14px;padding:0}
  #tslpemp .emph .eg{color:#c7b489}
  #tslpemp .p{color:rgba(255,255,255,.68);font-size:.98rem;line-height:1.72;margin:0;max-width:none}
  @keyframes tslp-heartbeat{0%{box-shadow:0 4px 14px rgba(var(--g),.10),0 0 14px rgba(var(--g),.10)}18%{box-shadow:0 6px 22px rgba(var(--g),.30),0 0 46px rgba(var(--g),.34)}32%{box-shadow:0 5px 18px rgba(var(--g),.16),0 0 26px rgba(var(--g),.18)}46%{box-shadow:0 6px 20px rgba(var(--g),.26),0 0 40px rgba(var(--g),.28)}72%,100%{box-shadow:0 4px 14px rgba(var(--g),.10),0 0 14px rgba(var(--g),.10)}}
  @media(max-width:900px){#tslpemp{grid-template-columns:1fr;gap:26px}#tslpemp .db-row{max-width:none}}
  @media(max-width:720px){#tslpemp .db-hd{font-size:1.25rem}#tslpemp .tb{padding:10px 13px;font-size:.88rem}#tslpemp .emph{font-size:1.3rem}}
  @media(prefers-reduced-motion:reduce){#tslpemp,#tslpemp.in{opacity:1;transform:none;transition:none}#tslpemp .db-hd,#tslpemp .tb,#tslpemp .tslp-item{opacity:1;transform:none;transition:none}#tslpemp.live:hover{animation:none;box-shadow:0 18px 44px -30px rgba(0,0,0,.85),0 0 26px rgba(var(--g),.22)}}
  `;
  function on(){ return SLUG.test(location.pathname); }
  function injectCSS(){ if(document.getElementById('tslpemp-css'))return; var s=document.createElement('style'); s.id='tslpemp-css'; s.textContent=CSS; document.head.appendChild(s); }
  function find(re){ var n=document.querySelectorAll(PG+' .notion-text'); for(var i=0;i<n.length;i++){ if(re.test(n[i].textContent||'')) return n[i]; } return null; }
  function retext(){
    var somit=find(/Somit haben wir nun/);
    if(somit && !somit.classList.contains('tslp-i')) somit.classList.add('tslp-i');
    var nx=find(/In der nächsten Lektion/);
    if(nx && !nx.classList.contains('tslp-mid')) nx.classList.add('tslp-mid');
    /* Originale (Marker + Claude-Text) sicher verstecken — bei jedem Tick, React-fest */
    var marker=find(/Empfehlung zur Nutzung/);
    if(marker && !marker.classList.contains('tslp-hide')) marker.classList.add('tslp-hide');
    var claude=find(/Lass Claude Code/);
    if(claude && document.getElementById('tslpemp') && !claude.classList.contains('tslp-hide')) claude.classList.add('tslp-hide');
  }
  function stripIds(el){ el.removeAttribute('id'); var q=el.querySelectorAll('[id]'); for(var i=0;i<q.length;i++)q[i].removeAttribute('id'); return el; }
  function tilt(wrap){
    if(!(window.matchMedia&&matchMedia('(hover: hover) and (pointer: fine)').matches)) return;
    if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var raf=null, cx=0, cy=0;
    wrap.addEventListener('mousemove',function(e){
      cx=e.clientX; cy=e.clientY;
      if(!wrap.classList.contains('live')||raf) return;
      raf=requestAnimationFrame(function(){
        raf=null;
        var r=wrap.getBoundingClientRect();
        var px=(cx-r.left)/r.width, py=(cy-r.top)/r.height;
        wrap.style.setProperty('--ry',((px-.5)*5).toFixed(2)+'deg');
        wrap.style.setProperty('--rx',((.5-py)*4).toFixed(2)+'deg');
        wrap.style.setProperty('--mx',(px*100).toFixed(1)+'%');
        wrap.style.setProperty('--my',(py*100).toFixed(1)+'%');
      });
    });
    wrap.addEventListener('mouseleave',function(){
      wrap.style.setProperty('--rx','0deg'); wrap.style.setProperty('--ry','0deg');
    });
  }
  function cycle(wrap){
    var tabs=[].slice.call(wrap.querySelectorAll('.tb')), idx=0, timer=null;
    function move(){ tabs.forEach(function(x,i){ x.classList.toggle('on',i===idx); }); }
    var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    var io=new IntersectionObserver(function(e){
      if(e[0].isIntersecting){ move(); if(!reduce&&!timer) timer=setInterval(function(){ idx=(idx+1)%tabs.length; move(); },2400); }
      else if(timer){ clearInterval(timer); timer=null; }
    },{threshold:.3});
    io.observe(wrap);
  }
  function mount(){
    if(!on()){ var e=document.getElementById('tslpemp'); if(e&&e.parentNode)e.parentNode.removeChild(e); return; }
    injectCSS(); retext();
    if(document.getElementById('tslpemp')) return;
    var somit=find(/Somit haben wir nun/);
    var marker=find(/Empfehlung zur Nutzung/);
    var claude=find(/Lass Claude Code/);
    if(!somit||!marker||!claude) return;
    var wrap=document.createElement('div'); wrap.id='tslpemp';
    var L=document.createElement('div'); L.className='tslp-col';
    var R=document.createElement('div'); R.className='tslp-col';
    L.innerHTML='<div class="db-hd">DB I – III : <span class="g">Lieferanten</span></div>'+
      '<div class="db-row">'+DBS.map(function(d){ return '<span class="tb">'+ICON+'<span class="num">'+d[0]+'</span> '+d[1]+'</span>'; }).join('')+'</div>';
    var emph=document.createElement('div'); emph.className='emph tslp-item'; emph.innerHTML='Empfehlung zur <span class="eg">Einrichtung</span>';
    var pClone=stripIds(claude.cloneNode(true)); pClone.className='p tslp-item';
    R.appendChild(emph); R.appendChild(pClone);
    wrap.appendChild(L); wrap.appendChild(R);
    if(somit.nextSibling) somit.parentNode.insertBefore(wrap,somit.nextSibling); else somit.parentNode.appendChild(wrap);
    claude.classList.add('tslp-hide');
    var items=R.querySelectorAll('.tslp-item');
    for(var i=0;i<items.length;i++) items[i].style.transitionDelay=(i*0.12+0.1)+'s';
    var io=new IntersectionObserver(function(e){
      if(e[0].isIntersecting){ wrap.classList.add('in'); setTimeout(function(){ wrap.classList.add('live'); },950); io.disconnect(); }
    },{threshold:.25});
    io.observe(wrap);
    cycle(wrap); tilt(wrap);
  }
  function boot(){
    var tries=0;
    var iv=setInterval(function(){ tries++; mount(); if(tries>60) clearInterval(iv); },300);
    new MutationObserver(function(){ if(on()) mount(); }).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='complete') boot(); else window.addEventListener('load',boot);
})();

/* ---- */

/* ============================================================
   zutatenliste — #tszein  "Empfehlung zur Einrichtung"
   Self-contained Klon des Empfehlungskastens (#tsmiss/#tslpemp)
   für /zutatenliste, direkt UNTER Block B (#tscb-B). Linke Spalte
   = Notion-Ansichts-Liste "DB IV : Zutaten" (4 Einrichtungs-Stufen,
   zyklisches Glas-Highlight), rechte Spalte = Lineal-Heading
   "Empfehlung zur Einrichtung" (letztes Wort beige) + Intro +
   4er-Schrittliste. Goldene Verbindungslinie vom aktiven linken
   Row zum zugehörigen Schritt (1:1, Muster #tsmiss). Glas-Sprache
   identisch (--g:199,180,137, Perspektiv-Entrance, Pointer-Tilt,
   Heartbeat, Gold-Top-Line). Text hartkodiert (Robert-Vorgabe,
   verbatim). Anker: nach Section #tscb-B, React-sicher (re-mount).
   ============================================================ */
(function(){
  if(window.__tszein) return; window.__tszein=true;
  var SLUG=/\/zutatenliste\/?$/;
  var ICON='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5"/><path d="M1.5 6.5h13M6.5 6.5v7"/></svg>';
  var ROWS=['Inventarprodukt anlegen','Zutat = 1000 g','Verknüpfen','Untereinheit 80 g'];
  var STEPS=[
    'Inventarprodukte anlegen',
    '(Fast) jedes Inventarprodukt = Zutat mit 1000 ml / g',
    'Inventarprodukt ↔ Zutat verknüpfen',
    'Untereinheiten der Zutaten (bspw. 80g) anlegen durch duplizieren'
  ];
  var INTRO='Um deine Zutaten-Liste das erste Mal in Betrieb zu nehmen, empfehle ich folgendes:';
  var CSS=`
  #tszein{--g:199,180,137;--rx:0deg;--ry:0deg;position:relative;display:grid;grid-template-columns:minmax(280px,1fr) 1.5fr;gap:clamp(28px,4.5vw,56px);align-items:center;width:min(1000px,95vw);margin:34px auto 34px;padding:clamp(26px,4vw,44px) clamp(24px,4.5vw,50px);border-radius:20px;background:linear-gradient(165deg,rgba(255,255,255,.05),rgba(255,255,255,.015) 55%,rgba(255,255,255,0));border:1px solid rgba(255,255,255,.10);box-shadow:0 18px 44px -30px rgba(0,0,0,.85),0 0 14px rgba(var(--g),.08);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;color:#fff;transform-style:preserve-3d;will-change:transform;opacity:0;transform:perspective(1100px) rotateX(9deg) translateY(34px) scale(.97);transition:opacity .8s ease,transform .9s cubic-bezier(.16,1,.3,1)}
  #tszein,#tszein *{box-sizing:border-box}
  #tszein.in{opacity:1;transform:perspective(1100px) rotateX(var(--rx)) rotateY(var(--ry))}
  #tszein.live{transition:transform .16s ease-out,box-shadow .5s ease,border-color .4s ease}
  #tszein.live:hover{border-color:rgba(var(--g),.4);animation:tszein-heartbeat 2.6s cubic-bezier(.4,0,.3,1) infinite}
  #tszein::before{content:"";position:absolute;inset:0;border-radius:20px;background:radial-gradient(560px circle at var(--mx,50%) var(--my,0%),rgba(255,255,255,.055),transparent 46%);opacity:0;transition:opacity .5s ease;pointer-events:none}
  #tszein.live:hover::before{opacity:1}
  #tszein::after{content:"";position:absolute;top:0;left:9%;right:9%;height:1px;background:linear-gradient(90deg,transparent,rgba(var(--g),.4),transparent);pointer-events:none}
  #tszein .tsz-link{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:0;opacity:1;transition:opacity .35s ease}
  #tszein .tsz-link.off{opacity:0}
  #tszein .tsz-link path{fill:none;stroke:rgba(var(--g),.55);stroke-width:1.5;filter:drop-shadow(0 0 6px rgba(var(--g),.35))}
  #tszein .tsz-link circle{fill:rgba(var(--g),.9)}
  #tszein .tsz-col{min-width:0;position:relative;z-index:1;transform:translateZ(22px)}
  #tszein .db-hd{font-size:1.4rem;font-weight:700;letter-spacing:-.01em;line-height:1.2;margin:0 0 14px;color:#fff;opacity:0;transform:translateY(14px);transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1)}
  #tszein .db-hd .g{color:#c7b489}
  #tszein.in .db-hd{opacity:1;transform:none}
  #tszein .db-row{display:flex;flex-direction:column;align-items:stretch;gap:6px;max-width:300px}
  #tszein .tb{display:inline-flex;align-items:center;gap:9px;padding:11px 15px;border-radius:12px;font-size:.92rem;font-weight:600;color:rgba(255,255,255,.5);white-space:nowrap;opacity:0;transform:translateY(10px) scale(.97);transition:color .45s ease,background .5s ease,box-shadow .5s ease,opacity .55s cubic-bezier(.16,1,.3,1),transform .55s cubic-bezier(.16,1,.3,1)}
  #tszein .tb svg{width:15px;height:15px;flex:none;opacity:.7}
  #tszein .tb .num{color:#c7b489;font-variant-numeric:tabular-nums;opacity:.9;font-size:.82rem}
  #tszein.in .tb{opacity:1;transform:none}
  #tszein.in .tb:nth-child(2){transition-delay:.08s}
  #tszein.in .tb:nth-child(3){transition-delay:.16s}
  #tszein.in .tb:nth-child(4){transition-delay:.24s}
  #tszein .tb.on{color:#fff;background:rgba(255,255,255,.09);box-shadow:inset 0 0 0 1px rgba(255,255,255,.16),0 0 22px rgba(var(--g),.10)}
  #tszein .tb.on svg{opacity:1}
  #tszein .tb.on .num{opacity:1}
  #tszein .tsz-item{opacity:0;transform:translateY(14px);transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1)}
  #tszein.in .tsz-item{opacity:1;transform:none}
  #tszein .emph{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;font-size:1.45rem;font-weight:600;letter-spacing:-.012em;color:#fff;margin:0 0 12px;padding:0}
  #tszein .emph .eg{color:#c7b489}
  #tszein .p{color:rgba(255,255,255,.68);font-size:.96rem;line-height:1.7;margin:0 0 16px;max-width:none}
  #tszein .tsz-ol{margin:0;padding-left:1.6em}
  #tszein .tsz-ol li{color:rgba(255,255,255,.62);font-size:.92rem;line-height:1.55;margin:0 0 8px;padding:10px 14px;border-radius:12px;transition:color .45s ease,background .5s ease,box-shadow .5s ease}
  #tszein .tsz-ol li::marker{color:rgba(255,255,255,.35);font-weight:600}
  #tszein .tsz-ol li.lit{color:#fff;background:rgba(255,255,255,.09);box-shadow:inset 0 0 0 1px rgba(255,255,255,.16),0 0 22px rgba(var(--g),.10)}
  #tszein .tsz-ol li.lit::marker{color:rgba(var(--g),.9)}
  @keyframes tszein-heartbeat{0%{box-shadow:0 4px 14px rgba(var(--g),.10),0 0 14px rgba(var(--g),.10)}18%{box-shadow:0 6px 22px rgba(var(--g),.30),0 0 46px rgba(var(--g),.34)}32%{box-shadow:0 5px 18px rgba(var(--g),.16),0 0 26px rgba(var(--g),.18)}46%{box-shadow:0 6px 20px rgba(var(--g),.26),0 0 40px rgba(var(--g),.28)}72%,100%{box-shadow:0 4px 14px rgba(var(--g),.10),0 0 14px rgba(var(--g),.10)}}
  @media(max-width:900px){#tszein{grid-template-columns:1fr;gap:26px}#tszein .tsz-link{display:none}#tszein .db-row{max-width:none}}
  @media(max-width:720px){#tszein .db-hd{font-size:1.25rem}#tszein .tb{padding:10px 13px;font-size:.86rem}#tszein .emph{font-size:1.3rem}}
  @media(prefers-reduced-motion:reduce){#tszein,#tszein.in{opacity:1;transform:none;transition:none}#tszein .db-hd,#tszein .tb,#tszein .tsz-item{opacity:1;transform:none;transition:none}#tszein.live:hover{animation:none;box-shadow:0 18px 44px -30px rgba(0,0,0,.85),0 0 26px rgba(var(--g),.22)}}
  `;
  function on(){ return SLUG.test(location.pathname); }
  function injectCSS(){ if(document.getElementById('tszein-css'))return; var s=document.createElement('style'); s.id='tszein-css'; s.textContent=CSS; document.head.appendChild(s); }
  function pos(el,root){ var x=0,y=0; while(el&&el!==root){ x+=el.offsetLeft; y+=el.offsetTop; el=el.offsetParent; } return {x:x,y:y}; }
  function tilt(wrap){
    if(!(window.matchMedia&&matchMedia('(hover: hover) and (pointer: fine)').matches)) return;
    if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var raf=null, cx=0, cy=0;
    wrap.addEventListener('mousemove',function(e){
      cx=e.clientX; cy=e.clientY;
      if(!wrap.classList.contains('live')||raf) return;
      raf=requestAnimationFrame(function(){
        raf=null;
        var r=wrap.getBoundingClientRect();
        var px=(cx-r.left)/r.width, py=(cy-r.top)/r.height;
        wrap.style.setProperty('--ry',((px-.5)*5).toFixed(2)+'deg');
        wrap.style.setProperty('--rx',((.5-py)*4).toFixed(2)+'deg');
        wrap.style.setProperty('--mx',(px*100).toFixed(1)+'%');
        wrap.style.setProperty('--my',(py*100).toFixed(1)+'%');
      });
    });
    wrap.addEventListener('mouseleave',function(){ wrap.style.setProperty('--rx','0deg'); wrap.style.setProperty('--ry','0deg'); });
  }
  /* Auto-Cycle durch die 4 Stufen + goldene Verbindungslinie zum zugehörigen Schritt (Muster #tsmiss) */
  function controller(wrap){
    var NS='http://www.w3.org/2000/svg';
    var tabs=[].slice.call(wrap.querySelectorAll('.tb'));
    var lis=[].slice.call(wrap.querySelectorAll('.tsz-ol li'));
    if(tabs.length<4||lis.length<4) return;
    var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    var svg=document.createElementNS(NS,'svg'); svg.setAttribute('class','tsz-link off');
    var path=document.createElementNS(NS,'path');
    var c1=document.createElementNS(NS,'circle'), c2=document.createElementNS(NS,'circle');
    c1.setAttribute('r','2.5'); c2.setAttribute('r','2.5');
    svg.appendChild(path); svg.appendChild(c1); svg.appendChild(c2);
    wrap.appendChild(svg);
    function draw(a,b){
      svg.setAttribute('viewBox','0 0 '+wrap.clientWidth+' '+wrap.clientHeight);
      var pa=pos(a,wrap), pb=pos(b,wrap);
      var ax=pa.x+a.offsetWidth+10, ay=pa.y+a.offsetHeight/2;
      var bx=pb.x-14, by=pb.y+b.offsetHeight/2;
      var dx=Math.max(30,(bx-ax)*.45);
      path.setAttribute('d','M'+ax+' '+ay+' C'+(ax+dx)+' '+ay+', '+(bx-dx)+' '+by+', '+bx+' '+by);
      c1.setAttribute('cx',ax); c1.setAttribute('cy',ay);
      c2.setAttribute('cx',bx); c2.setAttribute('cy',by);
      try{
        var len=path.getTotalLength();
        path.style.transition='none'; path.style.strokeDasharray=len; path.style.strokeDashoffset=len;
        void path.getBoundingClientRect();
        path.style.transition='stroke-dashoffset .55s cubic-bezier(.22,1,.36,1)'; path.style.strokeDashoffset='0';
      }catch(e){}
      svg.classList.remove('off');
    }
    var idx=0;
    function apply(){
      for(var i=0;i<tabs.length;i++) tabs[i].classList.toggle('on',i===idx);
      for(var j=0;j<lis.length;j++) lis[j].classList.toggle('lit',j===idx);
      if(window.innerWidth<901){ svg.classList.add('off'); return; }
      draw(tabs[idx],lis[idx]);
    }
    var timer=null;
    var io=new IntersectionObserver(function(e){
      if(e[0].isIntersecting){ apply(); if(!reduce&&!timer) timer=setInterval(function(){ idx=(idx+1)%tabs.length; apply(); },2600); }
      else if(timer){ clearInterval(timer); timer=null; }
    },{threshold:.3});
    io.observe(wrap);
    window.addEventListener('resize',apply);
  }
  function mount(){
    if(!on()){ var e=document.getElementById('tszein'); if(e&&e.parentNode)e.parentNode.removeChild(e); return; }
    injectCSS();
    if(document.getElementById('tszein')) return;
    var lap=document.querySelector('.tszmac-pc'); var anchor=lap?lap.closest('.notion-column-list'):null; if(!anchor) return;
    var wrap=document.createElement('div'); wrap.id='tszein';
    var L=document.createElement('div'); L.className='tsz-col';
    var R=document.createElement('div'); R.className='tsz-col';
    L.innerHTML='<div class="db-hd">DB IV : <span class="g">Zutaten</span></div>'+
      '<div class="db-row">'+ROWS.map(function(r,i){ return '<span class="tb"><span class="num">0'+(i+1)+'</span>'+ICON+' '+r+'</span>'; }).join('')+'</div>';
    var emph=document.createElement('div'); emph.className='emph tsz-item'; emph.innerHTML='Empfehlung zur <span class="eg">Einrichtung</span>';
    var intro=document.createElement('p'); intro.className='p tsz-item'; intro.textContent=INTRO;
    var ol=document.createElement('ol'); ol.className='tsz-ol tsz-item'; ol.innerHTML=STEPS.map(function(s){ return '<li>'+s+'</li>'; }).join('');
    R.appendChild(emph); R.appendChild(intro); R.appendChild(ol);
    wrap.appendChild(L); wrap.appendChild(R);
    if(anchor.nextSibling) anchor.parentNode.insertBefore(wrap,anchor.nextSibling); else anchor.parentNode.appendChild(wrap);
    var items=R.querySelectorAll('.tsz-item');
    for(var i=0;i<items.length;i++) items[i].style.transitionDelay=(i*0.12+0.1)+'s';
    var io=new IntersectionObserver(function(e){
      if(e[0].isIntersecting){ wrap.classList.add('in'); setTimeout(function(){ wrap.classList.add('live'); },950); io.disconnect(); }
    },{threshold:.25});
    io.observe(wrap);
    controller(wrap); tilt(wrap);
  }
  function boot(){
    var tries=0;
    var iv=setInterval(function(){ tries++; mount(); if(tries>60) clearInterval(iv); },300);
    new MutationObserver(function(){ if(on()) mount(); }).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='complete') boot(); else window.addEventListener('load',boot);
})();

/* ---- */

/* ============================================================
   Schaufenster / Warenkorb — #tsshop v2 (Gastro-OS Shop)
   Die Phasen-Bereiche werden zum Shop: jeder Notion-Toggle-
   Schritt ("1. Button anlegen" … "15. Notizen") wird eine
   Produkt-Karte im horizontal scrollbaren Regal. Klick öffnet
   die Detail-Ansicht (Astro-Shop-Muster, View-Transition-Morph):
   links das Bild, rechts Titel + der GEKLONTE Schritt-Inhalt
   (Eigenschaft, Spaltenname, Punkte, Screenshots); Formel-
   Codeblöcke laufen intern scrollbar, gedeckelt — sprengen nie
   das Layout. "Erledigt"-Button nutzt DIESELBEN localStorage-
   Keys wie das globale Checkbox-System (verlustfrei kompatibel).
   Die Original-Phasen-Spaltenliste wird nur versteckt (display:
   none) — Notion bleibt SSOT, nichts wird gelöscht.
   Datenmodell: Produkt-Kacheln (bildbares Objekt + Einheit =
   "Währung") + Konzept-Kacheln (ist_produkt_kachel:false).
   Bilder: objekt_varianten[i].img eintragen (null → Platzhalter),
   Karten mappen zyklisch auf die Objekt-Varianten (Bild + Wert).
   Werte = Beispielwerte, keine echten Kalkulationsdaten.
   v1→v2: 11.07.2026. Render v2 auf /inventurliste (db0).
   11.07.2026: db13_lieferanten auf /lieferpartner-… (DB I,
   13 Fahrzeug-Bilder img/lieferpartner, Währung = Mindest-
   belieferung €). PAGES.marker scopt die richtige Phasen-
   Sektion auf Seiten mit mehreren Phase-I/II-Bereichen.
   ============================================================ */
(function(){
  if(window.__tsshop) return; window.__tsshop=true;

  /* ---------- Datenmodell: alle Kacheln des Gastro-OS ---------- */
  var KACHELN=[
    { kachel_id:'db0_inventurliste', kachel_name:'Inventurliste', ist_produkt_kachel:true,
      einheit:'Preis (€)', einheit_typ:'preis',
      /* 15 Tasty-Studios-Produktbilder (img/inventar, GitHub Pages) — Preise = Beispielwerte */
      objekt_varianten:[
        { name:'Olivenöl',          wert:9.80, img:'https://tastyrob123.github.io/kurs/img/inventar/olivenoel.jpg' },
        { name:'Balsamico',         wert:7.90, img:'https://tastyrob123.github.io/kurs/img/inventar/balsamico.jpg' },
        { name:'Meersalz',          wert:2.90, img:'https://tastyrob123.github.io/kurs/img/inventar/meersalz.jpg' },
        { name:'Schwarzer Pfeffer', wert:4.80, img:'https://tastyrob123.github.io/kurs/img/inventar/schwarzer-pfeffer.jpg' },
        { name:'Tomatenmark',       wert:1.90, img:'https://tastyrob123.github.io/kurs/img/inventar/tomatenmark.jpg' },
        { name:'Dijon-Senf',        wert:3.80, img:'https://tastyrob123.github.io/kurs/img/inventar/dijon-senf.jpg' },
        { name:'Honig',             wert:6.40, img:'https://tastyrob123.github.io/kurs/img/inventar/honig.jpg' },
        { name:'Sojasauce',         wert:4.20, img:'https://tastyrob123.github.io/kurs/img/inventar/sojasauce.jpg' },
        { name:'Chilisauce',        wert:4.50, img:'https://tastyrob123.github.io/kurs/img/inventar/chilisauce.jpg' },
        { name:'Mayonnaise',        wert:5.60, img:'https://tastyrob123.github.io/kurs/img/inventar/mayonnaise.jpg' },
        { name:'Cornichons',        wert:3.20, img:'https://tastyrob123.github.io/kurs/img/inventar/cornichons.jpg' },
        { name:'Sardellen',         wert:5.90, img:'https://tastyrob123.github.io/kurs/img/inventar/sardellen.jpg' },
        { name:'Oregano',           wert:2.40, img:'https://tastyrob123.github.io/kurs/img/inventar/oregano.jpg' },
        { name:'Paprika Edelsüß',   wert:3.10, img:'https://tastyrob123.github.io/kurs/img/inventar/paprika-edelsuess.jpg' },
        { name:'Weißweinessig',     wert:3.60, img:'https://tastyrob123.github.io/kurs/img/inventar/weissweinessig.jpg' }
      ]},
    { kachel_id:'db4_zutaten', kachel_name:'Zutaten', ist_produkt_kachel:true,
      einheit:'Portionsgröße (g)', einheit_typ:'menge_g',
      /* 30 Tasty-Studios-Zutatenbilder (schwarzes Glas, Low-Key, img/zutaten, GitHub Pages) — Portionsgrößen = Beispielwerte */
      objekt_varianten:[
        { name:'Tomate',        wert:120, img:'https://tastyrob123.github.io/kurs/img/zutaten/rindersteak.jpg' },
        { name:'Avocado',       wert:75,  img:'https://tastyrob123.github.io/kurs/img/zutaten/thymian.jpg' },
        { name:'Paprika',       wert:80,  img:'https://tastyrob123.github.io/kurs/img/zutaten/butter.jpg' },
        { name:'Zitrone',       wert:20,  img:'https://tastyrob123.github.io/kurs/img/zutaten/knoblauch.jpg' },
        { name:'Lauchzwiebel',  wert:15,  img:'https://tastyrob123.github.io/kurs/img/zutaten/lauchzwiebel.jpg' },
        { name:'Champignons',   wert:75,  img:'https://tastyrob123.github.io/kurs/img/zutaten/champignons.jpg' },
        { name:'Rindersteak',   wert:200, img:'https://tastyrob123.github.io/kurs/img/zutaten/tomate.jpg' },
        { name:'Basilikum',     wert:5,   img:'https://tastyrob123.github.io/kurs/img/zutaten/basilikum.jpg' },
        { name:'Zwiebel',       wert:60,  img:'https://tastyrob123.github.io/kurs/img/zutaten/zwiebel.jpg' },
        { name:'Lachsfilet',    wert:150, img:'https://tastyrob123.github.io/kurs/img/zutaten/lachsfilet.jpg' },
        { name:'Karotte',       wert:60,  img:'https://tastyrob123.github.io/kurs/img/zutaten/karotte.jpg' },
        { name:'Granatapfel',   wert:80,  img:'https://tastyrob123.github.io/kurs/img/zutaten/granatapfel.jpg' },
        { name:'Knoblauch',     wert:8,   img:'https://tastyrob123.github.io/kurs/img/zutaten/zitrone.jpg' },
        { name:'Brokkoli',      wert:120, img:'https://tastyrob123.github.io/kurs/img/zutaten/brokkoli.jpg' },
        { name:'Blaubeeren',    wert:60,  img:'https://tastyrob123.github.io/kurs/img/zutaten/blaubeeren.jpg' },
        { name:'Chili',         wert:5,   img:'https://tastyrob123.github.io/kurs/img/zutaten/chili-rot.jpg' },
        { name:'Kartoffel',     wert:150, img:'https://tastyrob123.github.io/kurs/img/zutaten/kartoffel.jpg' },
        { name:'Garnelen',      wert:80,  img:'https://tastyrob123.github.io/kurs/img/zutaten/garnelen.jpg' },
        { name:'Feige',         wert:40,  img:'https://tastyrob123.github.io/kurs/img/zutaten/feige.jpg' },
        { name:'Spinat',        wert:60,  img:'https://tastyrob123.github.io/kurs/img/zutaten/spinat.jpg' },
        { name:'Aubergine',     wert:120, img:'https://tastyrob123.github.io/kurs/img/zutaten/aubergine.jpg' },
        { name:'Parmesan',      wert:20,  img:'https://tastyrob123.github.io/kurs/img/zutaten/parmesan.jpg' },
        { name:'Ingwer',        wert:10,  img:'https://tastyrob123.github.io/kurs/img/zutaten/ingwer.jpg' },
        { name:'Rote Bete',     wert:100, img:'https://tastyrob123.github.io/kurs/img/zutaten/rote-bete.jpg' },
        { name:'Hähnchenbrust', wert:180, img:'https://tastyrob123.github.io/kurs/img/zutaten/haehnchenbrust.jpg' },
        { name:'Zucchini',      wert:100, img:'https://tastyrob123.github.io/kurs/img/zutaten/zucchini.jpg' },
        { name:'Walnüsse',      wert:25,  img:'https://tastyrob123.github.io/kurs/img/zutaten/walnuesse.jpg' },
        { name:'Mozzarella',    wert:125, img:'https://tastyrob123.github.io/kurs/img/zutaten/mozzarella.jpg' },
        { name:'Butter',        wert:15,  img:'https://tastyrob123.github.io/kurs/img/zutaten/paprika-rot.jpg' },
        { name:'Thymian',       wert:3,   img:'https://tastyrob123.github.io/kurs/img/zutaten/avocado.jpg' }
      ]},
    { kachel_id:'db5_rezepturen', kachel_name:'Rezepturen', ist_produkt_kachel:true,
      einheit:'Portionsgröße (g)', einheit_typ:'menge_g',
      /* 23 Tasty-Studios-Sirupe/Saucen (edle Gastro-Lagerung, schwarzes Studio, img/rezepturen, GitHub Pages) — Portionsgrößen = Beispielwerte.
         23 einzigartige Bilder = 23 Karten (kein zyklisches Wiederholen). Reihenfolge bewusst farblich
         durchmischt (Rot/Orange/Grün/Blau/Violett/Braun abwechselnd), nicht nach Farbgruppen sortiert. */
      objekt_varianten:[
        { name:'Erdbeer-Sirup',         wert:25, img:'https://tastyrob123.github.io/kurs/img/rezepturen/erdbeer-sirup.jpg' },
        { name:'Mango-Sauce',           wert:50, img:'https://tastyrob123.github.io/kurs/img/rezepturen/mango-sauce.jpg' },
        { name:'Basilikum-Pesto',       wert:30, img:'https://tastyrob123.github.io/kurs/img/rezepturen/basilikum-pesto.jpg' },
        { name:'Blaubeer-Sauce',        wert:55, img:'https://tastyrob123.github.io/kurs/img/rezepturen/blaubeer-sauce.jpg' },
        { name:'Karamellsirup',         wert:35, img:'https://tastyrob123.github.io/kurs/img/rezepturen/karamellsirup.jpg' },
        { name:'Zitronensirup',         wert:18, img:'https://tastyrob123.github.io/kurs/img/rezepturen/zitronensirup.jpg' },
        { name:'Holunderblüten-Sirup',  wert:20, img:'https://tastyrob123.github.io/kurs/img/rezepturen/holunderblueten-sirup.jpg' },
        { name:'Rote-Bete-Sauce',       wert:60, img:'https://tastyrob123.github.io/kurs/img/rezepturen/rote-bete-sauce.jpg' },
        { name:'Karotten-Ingwer-Sirup', wert:22, img:'https://tastyrob123.github.io/kurs/img/rezepturen/karotten-ingwer-sirup.jpg' },
        { name:'Minzsirup',             wert:15, img:'https://tastyrob123.github.io/kurs/img/rezepturen/minzsirup.jpg' },
        { name:'Lavendel-Sirup',        wert:15, img:'https://tastyrob123.github.io/kurs/img/rezepturen/lavendel-sirup.jpg' },
        { name:'Schokoladensauce',      wert:40, img:'https://tastyrob123.github.io/kurs/img/rezepturen/schokoladensauce.jpg' },
        { name:'Hibiskus-Sirup',        wert:20, img:'https://tastyrob123.github.io/kurs/img/rezepturen/hibiskus-sirup.jpg' },
        { name:'Aprikosen-Coulis',      wert:40, img:'https://tastyrob123.github.io/kurs/img/rezepturen/aprikosen-coulis.jpg' },
        { name:'Matcha-Sirup',          wert:20, img:'https://tastyrob123.github.io/kurs/img/rezepturen/matcha-sirup.jpg' },
        { name:'Butterfly-Pea-Sirup',   wert:18, img:'https://tastyrob123.github.io/kurs/img/rezepturen/butterfly-pea-sirup.jpg' },
        { name:'Himbeer-Coulis',        wert:40, img:'https://tastyrob123.github.io/kurs/img/rezepturen/himbeer-coulis.jpg' },
        { name:'Ahornsirup',            wert:25, img:'https://tastyrob123.github.io/kurs/img/rezepturen/ahornsirup.jpg' },
        { name:'Passionsfrucht-Sauce',  wert:45, img:'https://tastyrob123.github.io/kurs/img/rezepturen/passionsfrucht-sauce.jpg' },
        { name:'Kiwi-Limetten-Sauce',   wert:45, img:'https://tastyrob123.github.io/kurs/img/rezepturen/kiwi-limetten-sauce.jpg' },
        { name:'Cassis-Sirup',          wert:18, img:'https://tastyrob123.github.io/kurs/img/rezepturen/cassis-sirup.jpg' },
        { name:'Rhabarber-Sirup',       wert:25, img:'https://tastyrob123.github.io/kurs/img/rezepturen/rhabarber-sirup.jpg' },
        { name:'Curry-Mango-Dip',       wert:50, img:'https://tastyrob123.github.io/kurs/img/rezepturen/curry-mango-dip.jpg' }
      ]},
    { kachel_id:'db5_finance_personal', kachel_name:'Personalkosten pro Rezeptur', ist_produkt_kachel:true,
      einheit:'Portionsgröße (g)', einheit_typ:'menge_g',
      /* 7 Tasty-Studios-Gerichte (Glasschale, schwarzes Studio, img/erweiterung, GitHub Pages) — Portionsgrößen = Beispielwerte.
         Finance-Erweiterung "Personalkosten pro Rezeptur" = 2. Tab-Gruppe auf /rezepturen, 7 Schritte = 7 Karten (1:1). */
      objekt_varianten:[
        { name:'Kichererbsen-Salat',   wert:120, img:'https://tastyrob123.github.io/kurs/img/erweiterung/kichererbsen-salat.jpg' },
        { name:'Tomatensalsa',         wert:90,  img:'https://tastyrob123.github.io/kurs/img/erweiterung/tomatensalsa.jpg' },
        { name:'Guacamole',            wert:80,  img:'https://tastyrob123.github.io/kurs/img/erweiterung/guacamole.jpg' },
        { name:'Hummus',               wert:100, img:'https://tastyrob123.github.io/kurs/img/erweiterung/hummus.jpg' },
        { name:'Räucherlachs-Röschen', wert:150, img:'https://tastyrob123.github.io/kurs/img/erweiterung/raeucherlachs-roeschen.jpg' },
        { name:'Gurkensalat',          wert:130, img:'https://tastyrob123.github.io/kurs/img/erweiterung/gurkensalat.jpg' },
        { name:'Caprese',              wert:160, img:'https://tastyrob123.github.io/kurs/img/erweiterung/caprese.jpg' }
      ]},
    { kachel_id:'db13_lieferanten', kachel_name:'Lieferpartner', ist_produkt_kachel:true,
      einheit:'Mindestbelieferung (€)', einheit_typ:'preis',
      /* 13 Tasty-Studios-Fahrzeugbilder (img/lieferpartner, GitHub Pages) — Werte = Beispielwerte */
      objekt_varianten:[
        { name:'Lieferroller',             wert:25,  img:'https://tastyrob123.github.io/kurs/img/lieferpartner/lieferroller.jpg' },
        { name:'E-Lastenrad',              wert:35,  img:'https://tastyrob123.github.io/kurs/img/lieferpartner/e-lastenrad.jpg' },
        { name:'Pickup',                   wert:60,  img:'https://tastyrob123.github.io/kurs/img/lieferpartner/pickup.jpg' },
        { name:'Stadtlieferwagen kompakt', wert:75,  img:'https://tastyrob123.github.io/kurs/img/lieferpartner/stadtlieferwagen-kompakt.jpg' },
        { name:'E-Lieferwagen',            wert:90,  img:'https://tastyrob123.github.io/kurs/img/lieferpartner/e-lieferwagen.jpg' },
        { name:'Hochdach-Transporter',     wert:120, img:'https://tastyrob123.github.io/kurs/img/lieferpartner/hochdach-transporter.jpg' },
        { name:'Kastenwagen Transit',      wert:150, img:'https://tastyrob123.github.io/kurs/img/lieferpartner/kastenwagen-transit.jpg' },
        { name:'Kühltransporter Sprinter', wert:180, img:'https://tastyrob123.github.io/kurs/img/lieferpartner/kuehltransporter-sprinter.jpg' },
        { name:'Pritschenwagen',           wert:220, img:'https://tastyrob123.github.io/kurs/img/lieferpartner/pritschenwagen-kisten.jpg' },
        { name:'Getränke-LKW',             wert:350, img:'https://tastyrob123.github.io/kurs/img/lieferpartner/getraenke-lkw.jpg' },
        { name:'Güterzug',                 wert:1200, fit:'contain', img:'https://tastyrob123.github.io/kurs/img/lieferpartner/gueterzug.jpg' },
        { name:'Containerschiff',          wert:3500, fit:'contain', img:'https://tastyrob123.github.io/kurs/img/lieferpartner/containerschiff.jpg' },
        { name:'Frachtflugzeug',           wert:7500, fit:'contain', img:'https://tastyrob123.github.io/kurs/img/lieferpartner/militaer-frachtflugzeug.jpg' }
      ]},
    { kachel_id:'db13_ansprechpartner', kachel_name:'Ansprechpartner', ist_produkt_kachel:true,
      einheit:'Jahresrückvergütung (%)', einheit_typ:'prozent',
      /* 9 Tasty-Studios-Merch-Bilder (img/ansprechpartner, GitHub Pages) — Werte = Beispielwerte */
      objekt_varianten:[
        { name:'Kochjacke',         wert:1,   img:'https://tastyrob123.github.io/kurs/img/ansprechpartner/kochjacke.jpg' },
        { name:'Hoodie',            wert:1.5, img:'https://tastyrob123.github.io/kurs/img/ansprechpartner/hoodie.jpg' },
        { name:'Kugelschreiber',    wert:2,   img:'https://tastyrob123.github.io/kurs/img/ansprechpartner/kugelschreiber.jpg' },
        { name:'Notizblock',        wert:2.5, img:'https://tastyrob123.github.io/kurs/img/ansprechpartner/notizblock.jpg' },
        { name:'Poloshirt',         wert:3,   img:'https://tastyrob123.github.io/kurs/img/ansprechpartner/poloshirt.jpg' },
        { name:'Bomberjacke',       wert:3.5, img:'https://tastyrob123.github.io/kurs/img/ansprechpartner/bomberjacke.jpg' },
        { name:'Schürze',           wert:4,   img:'https://tastyrob123.github.io/kurs/img/ansprechpartner/schuerze.jpg' },
        { name:'Thermosflasche',    wert:5,   img:'https://tastyrob123.github.io/kurs/img/ansprechpartner/thermosflasche.jpg' },
        { name:'Tote Bag',          wert:6,   img:'https://tastyrob123.github.io/kurs/img/ansprechpartner/tote-bag.jpg' },
        { name:'Emaille-Becher',    wert:8,   img:'https://tastyrob123.github.io/kurs/img/ansprechpartner/emaille-becher.jpg' }
      ]},
    { kachel_id:'db13_vertraege', kachel_name:'Lieferverträge', ist_produkt_kachel:true,
      einheit:'Vertragswert (€)', einheit_typ:'preis',
      /* 12 Tasty-Studios-Kugelschreiber-Varianten (img/vertraege, GitHub Pages) — Werte = Beispielwerte */
      objekt_varianten:[
        { name:'Creme Lack',            wert:350,   img:'https://tastyrob123.github.io/kurs/img/vertraege/creme-lack.jpg' },
        { name:'Taupe Matt',            wert:500,   img:'https://tastyrob123.github.io/kurs/img/vertraege/taupe-matt.jpg' },
        { name:'Navy Creme Zweifarbig', wert:750,   img:'https://tastyrob123.github.io/kurs/img/vertraege/navy-creme-zweifarbig.jpg' },
        { name:'Edelstahl Gebürstet',   wert:1000,  img:'https://tastyrob123.github.io/kurs/img/vertraege/edelstahl-gebuerstet.jpg' },
        { name:'Tiefdunkel Poliert',    wert:1400,  img:'https://tastyrob123.github.io/kurs/img/vertraege/tiefdunkel-poliert.jpg' },
        { name:'Schwarz Glanz Chrom',   wert:1900,  img:'https://tastyrob123.github.io/kurs/img/vertraege/schwarz-glanz-chrom.jpg' },
        { name:'Weiß Matt',             wert:2500,  img:'https://tastyrob123.github.io/kurs/img/vertraege/weiss-matt.jpg' },
        { name:'Taupe Leder',           wert:3200,  img:'https://tastyrob123.github.io/kurs/img/vertraege/taupe-leder.jpg' },
        { name:'Navy Signalrot Ring',   wert:4200,  img:'https://tastyrob123.github.io/kurs/img/vertraege/navy-signalrot-ring.jpg' },
        { name:'Schiefer Facettiert',   wert:5500,  img:'https://tastyrob123.github.io/kurs/img/vertraege/schiefer-facettiert.jpg' },
        { name:'Navy Executive',        wert:7000,  img:'https://tastyrob123.github.io/kurs/img/vertraege/navy-executive.jpg' },
        { name:'Creme Taupe Zweifarbig',wert:9000,  img:'https://tastyrob123.github.io/kurs/img/vertraege/creme-taupe-zweifarbig.jpg' },
        { name:'Creme Lack',            wert:12000, img:'https://tastyrob123.github.io/kurs/img/vertraege/creme-lack.jpg' }
      ]},
    { kachel_id:'db5_rezepte', kachel_name:'Rezepte', ist_produkt_kachel:true,
      einheit:'Portionen (Yield)', einheit_typ:'anzahl',
      objekt_varianten:[{name:'Burger'},{name:'Pasta-Teller'},{name:'Salatschale'},{name:'Suppe'},{name:'Steak'},{name:'Dessert'}]},
    { kachel_id:'db6_gk_loehne', kachel_name:'GK & Löhne', ist_produkt_kachel:true,
      einheit:'Stundenlohn (€/h)', einheit_typ:'preis',
      objekt_varianten:[{name:'Euro-Münzstapel'},{name:'Geldschein-Bündel'},{name:'Lohnzettel'},{name:'Portemonnaie'}]},
    { kachel_id:'db6_gemeinkosten', kachel_name:'Gemeinkosten', ist_produkt_kachel:true,
      einheit:'Kosten / Monat (€)', einheit_typ:'preis',
      /* 15 Tasty-Studios-Gemeinkosten-Objekte (Low-Key, schwarzes Studio, img/gemeinkosten, GitHub Pages) — Monats-Kosten = Beispielwerte */
      objekt_varianten:[
        { name:'Strom',        wert:480,  img:'https://tastyrob123.github.io/kurs/img/gemeinkosten/strom-gluehbirne.jpg' },
        { name:'Gas',          wert:260,  img:'https://tastyrob123.github.io/kurs/img/gemeinkosten/gas-gasbrenner.jpg' },
        { name:'Wasser',       wert:140,  img:'https://tastyrob123.github.io/kurs/img/gemeinkosten/wasser-wasserhahn.jpg' },
        { name:'Heizung',      wert:320,  img:'https://tastyrob123.github.io/kurs/img/gemeinkosten/heizung.jpg' },
        { name:'Internet',     wert:60,   img:'https://tastyrob123.github.io/kurs/img/gemeinkosten/internet-router.jpg' },
        { name:'Stromzähler',  wert:25,   img:'https://tastyrob123.github.io/kurs/img/gemeinkosten/stromzaehler.jpg' },
        { name:'Brandschutz',  wert:45,   img:'https://tastyrob123.github.io/kurs/img/gemeinkosten/brandschutz-feuerloescher.jpg' },
        { name:'Wartung',      wert:180,  img:'https://tastyrob123.github.io/kurs/img/gemeinkosten/wartung-werkzeug.jpg' },
        { name:'Miete',        wert:2500, img:'https://tastyrob123.github.io/kurs/img/gemeinkosten/miete-schluessel.jpg' },
        { name:'Reinigung',    wert:350,  img:'https://tastyrob123.github.io/kurs/img/gemeinkosten/reinigung-putzeimer.jpg' },
        { name:'Entsorgung',   wert:120,  img:'https://tastyrob123.github.io/kurs/img/gemeinkosten/entsorgung-muelltonne.jpg' },
        { name:'Buchhaltung',  wert:280,  img:'https://tastyrob123.github.io/kurs/img/gemeinkosten/buchhaltung-rechner.jpg' },
        { name:'Lüftung',      wert:90,   img:'https://tastyrob123.github.io/kurs/img/gemeinkosten/lueftung-ventilator.jpg' },
        { name:'Telefon',      wert:40,   img:'https://tastyrob123.github.io/kurs/img/gemeinkosten/telefon.jpg' },
        { name:'Versicherung', wert:210,  img:'https://tastyrob123.github.io/kurs/img/gemeinkosten/versicherung-schirm.jpg' }
      ]},
    { kachel_id:'db6_gemeinkostenannahmen', kachel_name:'Gemeinkostenannahmen', ist_produkt_kachel:true,
      einheit:'Annahme', einheit_typ:'anzahl',
      /* Rechen-/Annahme-Ebene (Monat, Kostenfaktoren, GK-Kosten/Monat, Absatz/Monat, GK/Produkt).
         ⚠️ PLATZHALTER: Bilder aus der Gemeinkosten-Serie zwischengenutzt, Werte = Beispiele —
         eigene schwarze-Studio-Bilder + finale Beispielwerte/Einheit von Robert nachziehen. */
      objekt_varianten:[
        { name:'Monat',          wert:1,    img:'https://tastyrob123.github.io/kurs/img/gemeinkosten/buchhaltung-rechner.jpg' },
        { name:'Kostenfaktoren', wert:15,   img:'https://tastyrob123.github.io/kurs/img/gemeinkosten/entsorgung-muelltonne.jpg' },
        { name:'GK / Monat',     wert:4770, img:'https://tastyrob123.github.io/kurs/img/gemeinkosten/versicherung-schirm.jpg' },
        { name:'Absatz / Monat', wert:3000, img:'https://tastyrob123.github.io/kurs/img/gemeinkosten/lueftung-ventilator.jpg' },
        { name:'GK / Produkt',   wert:2,    img:'https://tastyrob123.github.io/kurs/img/gemeinkosten/telefon.jpg' }
      ]},
    { kachel_id:'db7_mitarbeiterloehne', kachel_name:'Mitarbeiterlöhne', ist_produkt_kachel:true,
      einheit:'Nettogehalt (€)', einheit_typ:'preis',
      /* 15 Tasty-Studios-Personal-Objekte (Personalkosten-Serie, Low-Key, img/mitarbeiterloehne, GitHub Pages) — Netto-Monatsgehälter = Beispielwerte */
      objekt_varianten:[
        { name:'Zeiterfassung',    wert:1650, img:'https://tastyrob123.github.io/kurs/img/mitarbeiterloehne/zeiterfassungsterminal.jpg' },
        { name:'Kellnerbörse',     wert:1850, img:'https://tastyrob123.github.io/kurs/img/mitarbeiterloehne/kellnerbrieftasche.jpg' },
        { name:'Personalspind',    wert:1500, img:'https://tastyrob123.github.io/kurs/img/mitarbeiterloehne/personalspind.jpg' },
        { name:'Stechkarten',      wert:1580, img:'https://tastyrob123.github.io/kurs/img/mitarbeiterloehne/stechkarten-kartenhalter.jpg' },
        { name:'Logo-Anstecker',   wert:1720, img:'https://tastyrob123.github.io/kurs/img/mitarbeiterloehne/logo-anstecker.jpg' },
        { name:'Namensschild',     wert:1900, img:'https://tastyrob123.github.io/kurs/img/mitarbeiterloehne/namensschild.jpg' },
        { name:'Bonblock',         wert:2100, img:'https://tastyrob123.github.io/kurs/img/mitarbeiterloehne/bonblock.jpg' },
        { name:'Dienstplan',       wert:2400, img:'https://tastyrob123.github.io/kurs/img/mitarbeiterloehne/dienstplan.jpg' },
        { name:'Serviceschürze',   wert:1780, img:'https://tastyrob123.github.io/kurs/img/mitarbeiterloehne/serviceschuerze.jpg' },
        { name:'Arbeitsschuhe',    wert:1550, img:'https://tastyrob123.github.io/kurs/img/mitarbeiterloehne/arbeitsschuhe.jpg' },
        { name:'Lohnumschlag',     wert:1620, img:'https://tastyrob123.github.io/kurs/img/mitarbeiterloehne/lohnumschlag.jpg' },
        { name:'Ausweis',          wert:1950, img:'https://tastyrob123.github.io/kurs/img/mitarbeiterloehne/ausweis-lanyard.jpg' },
        { name:'Trinkgeld',        wert:1480, img:'https://tastyrob123.github.io/kurs/img/mitarbeiterloehne/trinkgeldglas.jpg' },
        { name:'Kochjacke',        wert:2600, img:'https://tastyrob123.github.io/kurs/img/mitarbeiterloehne/kochjacke.jpg' },
        { name:'Mitarbeiterhandbuch', wert:2200, img:'https://tastyrob123.github.io/kurs/img/mitarbeiterloehne/mitarbeiterhandbuch.jpg' }
      ]},
    { kachel_id:'db8_gerichte', kachel_name:'Gerichte & Getränke', ist_produkt_kachel:true,
      einheit:'Kosten (€)', einheit_typ:'preis',
      /* 37 Tasty-Studios-Menü-Bilder (Fine-Dining-Teller/Gläser/Tassen, schwarzes Studio, img/gerichte, GitHub Pages)
         — Kosten pro Gericht/Getränk/Dessert (Wareneinsatz) = Beispielwerte. Reihenfolge = Menü-Gänge. */
      objekt_varianten:[
        { name:'Jakobsmuscheln',   wert:6.50,  img:'https://tastyrob123.github.io/kurs/img/gerichte/jakobsmuscheln.jpg' },
        { name:'Rindertatar',      wert:5.80,  img:'https://tastyrob123.github.io/kurs/img/gerichte/rindertatar.jpg' },
        { name:'Burrata',          wert:4.20,  img:'https://tastyrob123.github.io/kurs/img/gerichte/burrata.jpg' },
        { name:'Thunfisch-Tataki', wert:6.90,  img:'https://tastyrob123.github.io/kurs/img/gerichte/thunfisch-tataki.jpg' },
        { name:'Kürbis-Velouté',   wert:2.40,  img:'https://tastyrob123.github.io/kurs/img/gerichte/kuerbis-veloute.jpg' },
        { name:'Rinderfilet',      wert:11.50, img:'https://tastyrob123.github.io/kurs/img/gerichte/rinderfilet.jpg' },
        { name:'Lachs',            wert:7.80,  img:'https://tastyrob123.github.io/kurs/img/gerichte/lachs.jpg' },
        { name:'Lammkarree',       wert:10.20, img:'https://tastyrob123.github.io/kurs/img/gerichte/lammkarree.jpg' },
        { name:'Rote-Bete-Risotto',wert:3.60,  img:'https://tastyrob123.github.io/kurs/img/gerichte/rote-bete-risotto.jpg' },
        { name:'Entenbrust',       wert:8.40,  img:'https://tastyrob123.github.io/kurs/img/gerichte/entenbrust.jpg' },
        { name:'Wolfsbarsch',      wert:9.10,  img:'https://tastyrob123.github.io/kurs/img/gerichte/wolfsbarsch.jpg' },
        { name:'Pilz-Ravioli',     wert:3.90,  img:'https://tastyrob123.github.io/kurs/img/gerichte/pilz-ravioli.jpg' },
        { name:'Short Rib',        wert:8.90,  img:'https://tastyrob123.github.io/kurs/img/gerichte/short-rib.jpg' },
        { name:'Gemüse-Steak',     wert:3.20,  img:'https://tastyrob123.github.io/kurs/img/gerichte/gemuese-steak.jpg' },
        { name:'Schoko-Fondant',   wert:2.10,  img:'https://tastyrob123.github.io/kurs/img/gerichte/schoko-fondant.jpg' },
        { name:'Crème-Brûlée',     wert:1.80,  img:'https://tastyrob123.github.io/kurs/img/gerichte/creme-brulee.jpg' },
        { name:'Beeren-Pavlova',   wert:2.60,  img:'https://tastyrob123.github.io/kurs/img/gerichte/beeren-pavlova.jpg' },
        { name:'Tiramisu',         wert:2.20,  img:'https://tastyrob123.github.io/kurs/img/gerichte/tiramisu.jpg' },
        { name:'Zitronentarte',    wert:1.90,  img:'https://tastyrob123.github.io/kurs/img/gerichte/zitronentarte.jpg' },
        { name:'Panna-Cotta',      wert:1.70,  img:'https://tastyrob123.github.io/kurs/img/gerichte/panna-cotta.jpg' },
        { name:'Cheesecake',       wert:2.30,  img:'https://tastyrob123.github.io/kurs/img/gerichte/cheesecake.jpg' },
        { name:'Negroni',          wert:2.80,  img:'https://tastyrob123.github.io/kurs/img/gerichte/negroni.jpg' },
        { name:'Aperol-Spritz',    wert:2.20,  img:'https://tastyrob123.github.io/kurs/img/gerichte/aperol-spritz.jpg' },
        { name:'Mojito',           wert:2.40,  img:'https://tastyrob123.github.io/kurs/img/gerichte/mojito.jpg' },
        { name:'Margarita',        wert:2.60,  img:'https://tastyrob123.github.io/kurs/img/gerichte/margarita.jpg' },
        { name:'Espresso-Martini', wert:2.90,  img:'https://tastyrob123.github.io/kurs/img/gerichte/espresso-martini.jpg' },
        { name:'Cosmopolitan',     wert:2.70,  img:'https://tastyrob123.github.io/kurs/img/gerichte/cosmopolitan.jpg' },
        { name:'Piña-Colada',      wert:2.50,  img:'https://tastyrob123.github.io/kurs/img/gerichte/pina-colada.jpg' },
        { name:'Gin-Basil-Smash',  wert:3.10,  img:'https://tastyrob123.github.io/kurs/img/gerichte/gin-basil-smash.jpg' },
        { name:'Espresso',         wert:0.45,  img:'https://tastyrob123.github.io/kurs/img/gerichte/espresso.jpg' },
        { name:'Cappuccino',       wert:0.65,  img:'https://tastyrob123.github.io/kurs/img/gerichte/cappuccino.jpg' },
        { name:'Flat-White',       wert:0.75,  img:'https://tastyrob123.github.io/kurs/img/gerichte/flat-white.jpg' },
        { name:'Latte-Macchiato',  wert:0.80,  img:'https://tastyrob123.github.io/kurs/img/gerichte/latte-macchiato.jpg' },
        { name:'Caramel-Macchiato',wert:0.95,  img:'https://tastyrob123.github.io/kurs/img/gerichte/caramel-macchiato.jpg' },
        { name:'Cortado',          wert:0.60,  img:'https://tastyrob123.github.io/kurs/img/gerichte/cortado.jpg' },
        { name:'Affogato',         wert:1.40,  img:'https://tastyrob123.github.io/kurs/img/gerichte/affogato.jpg' },
        { name:'Irish-Coffee',     wert:2.20,  img:'https://tastyrob123.github.io/kurs/img/gerichte/irish-coffee.jpg' }
      ]},
    { kachel_id:'db7_allergene', kachel_name:'Allergene', ist_produkt_kachel:true,
      einheit:'EU-Ziffer (1–14)', einheit_typ:'code',
      objekt_varianten:[{name:'Weizenähre'},{name:'Erdnuss'},{name:'Milchkanne'},{name:'Fisch'},{name:'Ei'},{name:'Sellerie'}]},
    { kachel_id:'db7_gerichte', kachel_name:'Gerichte', ist_produkt_kachel:true,
      einheit:'Verkaufspreis (€)', einheit_typ:'preis',
      objekt_varianten:[{name:'Hauptgang'},{name:'Vorspeise'},{name:'Dessert'},{name:'Bowl'},{name:'Pizza'}]},
    { kachel_id:'menue_kalkulation', kachel_name:'Menü Kalkulation', ist_produkt_kachel:true,
      einheit:'Foodcost (%)', einheit_typ:'prozent',
      objekt_varianten:[{name:'Taschenrechner'},{name:'Abakus'},{name:'Kassenbon'},{name:'Waage'}]},
    { kachel_id:'food_drinks_quartier', kachel_name:'Food / Drinks', ist_produkt_kachel:true,
      einheit:'Menge (ml)', einheit_typ:'menge_ml',
      objekt_varianten:[{name:'Cocktailglas'},{name:'Weinflasche'},{name:'Bierkrug'},{name:'Kaffeetasse'},{name:'Wasserkaraffe'}]},
    { kachel_id:'key_metrics', kachel_name:'Key Metrics', ist_produkt_kachel:true,
      einheit:'Zielwert', einheit_typ:'prozent',
      objekt_varianten:[{name:'Tacho-Dial'},{name:'Balkendiagramm'},{name:'Zielscheibe'},{name:'Stoppuhr'}]},
    { kachel_id:'multi_standorte', kachel_name:'Multi Standorte', ist_produkt_kachel:true,
      einheit:'Umsatz (€)', einheit_typ:'preis',
      objekt_varianten:[{name:'Karten-Pin'},{name:'Filial-Gebäude'},{name:'Globus'},{name:'Standort-Flagge'}]},
    { kachel_id:'operations_area', kachel_name:'Operations Area', ist_produkt_kachel:true,
      einheit:'Frequenz (x/Tag)', einheit_typ:'frequenz',
      objekt_varianten:[{name:'Küchen-Bon'},{name:'Checkliste'},{name:'Timer'},{name:'Schichtplan'}]},
    /* Konzept-Kacheln — bewusst ohne Objekt/Einheit-Schema */
    { kachel_id:'konzept_mehrwert_zielbild', kachel_name:'Mehrwert & Zielbild', ist_produkt_kachel:false },
    { kachel_id:'konzept_interface_design',  kachel_name:'Interface Design',    ist_produkt_kachel:false },
    { kachel_id:'konzept_vision_frame',      kachel_name:'Vision Frame',        ist_produkt_kachel:false },
    { kachel_id:'konzept_notion_ai',         kachel_name:'Notion AI',           ist_produkt_kachel:false },
    { kachel_id:'konzept_dynamic_system',    kachel_name:'Dynamic System',      ist_produkt_kachel:false },
    { kachel_id:'konzept_allgemeine_tipps',  kachel_name:'Allgemeine Tipps',    ist_produkt_kachel:false }
  ];
  function kachel(id){ for(var i=0;i<KACHELN.length;i++){ if(KACHELN[i].kachel_id===id) return KACHELN[i]; } return null; }
  function fmt(typ,v){
    if(v==null) return '';
    if(typ==='preis'){ var p=v.toFixed(2).split('.'); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g,'.')+','+p[1]+' €'; }
    if(typ==='menge_g')  return v+' g';
    if(typ==='menge_ml') return v+' ml';
    if(typ==='eur_h')    return String(v).replace('.',',')+' €/h';
    if(typ==='prozent')  return String(v).replace('.',',')+' %';
    if(typ==='anzahl')   return String(v);
    if(typ==='code')     return 'Nr. '+v;
    if(typ==='frequenz') return v+'×/Tag';
    return String(v);
  }

  /* Seiten-Zuordnung: welcher Pfad zeigt welchen Warenkorb.
     marker (optional): RegExp, der die richtige Phasen-Sektion wählt,
     wenn eine Seite MEHRERE Phase-I/II-Bereiche hat (z. B. Lieferpartner-
     Seite: DB I + DB II + DB III — "Kundennummer" gibt es nur in DB I). */
  var PAGES=[
    { path:/\/zutatenliste\/?$/, kachel:'db4_zutaten',
      eyebrow:'Der Warenkorb · DB IV',
      title:'Deine Zutaten. <span>Gramm für Gramm</span>.',
      sub:'Jeder Schritt liegt als Karte im Regal. Klick ihn auf, arbeite ihn ab, leg ihn in den Einkaufswagen — die Währung von DB IV ist die Portionsgröße.',
      /* Relation-Kacheln (erscheinen im Nachgang). DB IV baut die „Inventar Produkt"-Verknüpfung
         selbst → alle Rollups darüber (Herstellerbezeichnung, Preis/Ltr/Kg/Stück …) sind reguläre
         Checklisten-Schritte, KEINE Later-Karten. Es bleiben zwei Ghosts: die Gegenspalten, die
         auftauchen, sobald DB V (Rezepturen) und DB VIII (Gerichte) je eine wechselseitige
         „Zutaten"-Verknüpfung zu dieser Tabelle anlegen. */
      relations:[
        { type:'ghost', name:'Rezepturen', target:'Gegenspalte · aus DB V Rezepturen', flag:'erscheint automatisch',
          desc:'Gegenspalte der Zutaten-Verknüpfung aus den Rezepturen — erscheint von allein.',
          img:'https://tastyrob123.github.io/kurs/img/rezepturen/basilikum-pesto.jpg',
          content:'<p class="notion-text">Diese Spalte legst du hier <b>nicht</b> an.</p><p class="notion-text">&nbsp;</p><p class="notion-text">Sie erscheint automatisch, sobald du in <b>DB V : Rezepturen</b> die Verknüpfung „Zutaten" mit <b>wechselseitiger Verbindung</b> anlegst.</p><p class="notion-text">&nbsp;</p><p class="notion-text">→ <b>Name der Spalte</b> : Rezepturen</p><p class="notion-text">&nbsp;</p><p class="notion-text">Zeigt dir, in welchen Rezepturen diese Zutat als Baustein steckt.</p>' },
        { type:'ghost', name:'Gerichte', target:'Gegenspalte · aus DB VIII Gerichte', flag:'erscheint automatisch',
          desc:'Gegenspalte der Zutaten-Verknüpfung aus den Gerichten — erscheint von allein.',
          img:'https://tastyrob123.github.io/kurs/img/gerichte/rinderfilet.jpg',
          content:'<p class="notion-text">Diese Spalte legst du hier <b>nicht</b> an.</p><p class="notion-text">&nbsp;</p><p class="notion-text">Sie erscheint automatisch, sobald du in <b>DB VIII : Gerichte &amp; Getränke</b> die Verknüpfung „Zutaten" mit <b>wechselseitiger Verbindung</b> anlegst.</p><p class="notion-text">&nbsp;</p><p class="notion-text">→ <b>Name der Spalte</b> : Gerichte</p><p class="notion-text">&nbsp;</p><p class="notion-text">Zeigt dir, in welchen Gerichten diese Zutat direkt (Ready-to-Use) eingehängt ist.</p>' }
      ],
      summary:'Einwaage', chain:true },
    /* DB V Rezepturen — Phasen liegen hier in einem Tab-Widget (.notion-tabs, 4 Phasen),
       nicht in einer .notion-column-list → container-Selector + marker (nur die Phasen-
       Tabs tragen "Grundgerüst", die zweite Finance-Erweiterung-Tabgruppe nicht). */
    { path:/\/rezepturen\/?$/, kachel:'db5_rezepturen',
      container:'.notion-tabs', marker:/Grundgerüst/,
      eyebrow:'Der Warenkorb · DB V',
      title:'Deine Rezepturen. <span>Portion für Portion</span>.',
      sub:'Jeder Schritt liegt als Karte im Regal. Klick ihn auf, arbeite ihn ab, leg ihn in den Einkaufswagen — die Währung von DB V ist die Portionsgröße.',
      summary:'Portionsmenge', chain:true },
    /* DB V Finance-Erweiterung — zweite .notion-tabs-Gruppe auf /rezepturen ("Personalkosten pro
       Rezeptur", 7 Schritte). marker /Finance/ trifft NUR diese Gruppe; die Grundgerüst-Gruppe
       trägt kein "Finance". Zweites Regal unter DB V auf derselben Seite (eigene kachel_id → eigene rootId). */
    { path:/\/rezepturen\/?$/, kachel:'db5_finance_personal',
      container:'.notion-tabs', marker:/Finance/,
      eyebrow:'Der Warenkorb · DB V · Finance',
      title:'Erweiterung nach <span>Finance</span>',
      sub:'Wenn du Gemeinkosten & Mitarbeiterlöhne angelegt hast, können wir diese Tabelle erweitern. Wir wollen jetzt wissen: Was kostet es uns, eine Charge zuzubereiten? Wareneinsatz + Personalkosten pro Arbeitsvorgang (Gemeinkosten sind optional ebenfalls verknüpfbar). Dafür ergänzen wir weitere Spalten in der Rezepturen-Liste.',
      summary:'Portionsmenge', chain:true },
    /* DB VI Gemeinkosten + DB VII Mitarbeiterlöhne — DB VII liegt als eigenes Tab-Widget
       (.notion-tabs, marker /Mitarbeiter/). DB VI ist selbst in ZWEI Sub-Tabs geteilt:
       "DB VI : Gemeinkosten" (10 Posten) + "DB : GK-Kosten-Annahmen" (5 Annahmen). Beide
       liegen im SELBEN .notion-tabs-Widget → gleicher marker /Gemeinkosten/ findet das
       Widget, panel trennt den jeweiligen Sub-Tab → zwei getrennte Warenkörbe untereinander. */
    { path:/\/gemeinkosten-mitarbeiterlhne\/?$/, kachel:'db6_gemeinkosten',
      container:'.notion-tabs', marker:/Gemeinkosten/, panel:/GK Position/,
      eyebrow:'Der Warenkorb · DB VI',
      title:'Deine Gemeinkosten. <span>Posten für Posten</span>.',
      sub:'Jeder Schritt liegt als Karte im Regal. Klick ihn auf, arbeite ihn ab, leg ihn in den Einkaufswagen — die Währung von DB VI ist der Euro.',
      summary:'Fixkosten', chain:true },
    { path:/\/gemeinkosten-mitarbeiterlhne\/?$/, kachel:'db6_gemeinkostenannahmen',
      container:'.notion-tabs', marker:/Gemeinkosten/, panel:/Kostenfaktoren/,
      eyebrow:'Der Warenkorb · DB VI · Annahmen',
      title:'Deine <span>Gemeinkostenannahmen</span>.',
      sub:'Aus deinen Fixkosten wird die Rechen-Ebene: Monat, Kostenfaktoren, GK-Kosten pro Monat, Absatz pro Monat und am Ende die Gemeinkosten pro Produkt.',
      summary:'Annahmen', chain:true },
    { path:/\/gemeinkosten-mitarbeiterlhne\/?$/, kachel:'db7_mitarbeiterloehne',
      container:'.notion-tabs', marker:/Mitarbeiter/,
      eyebrow:'Der Warenkorb · DB VII',
      title:'Deine Mitarbeiterlöhne. <span>Netto für Netto</span>.',
      sub:'Jeder Schritt liegt als Karte im Regal. Klick ihn auf, arbeite ihn ab, leg ihn in den Einkaufswagen — die Währung von DB VII ist das Nettogehalt.',
      summary:'Lohnsumme', chain:true },
    /* DB VIII Gerichte & Getränke — 4 getrennte Phasen-Tab-Widgets (.notion-tabs) zu EINEM
       Regal gebündelt (multi:true, expect:4). marker /Phase/ trifft alle vier. 37 Schritte. */
    { path:/\/gerichte-getrnke-finaler-schritt\/?$/, kachel:'db8_gerichte',
      container:'.notion-tabs', multi:true, expect:4, marker:/Phase/,
      eyebrow:'Der Warenkorb · DB VIII',
      title:'Deine Gerichte & Getränke. <span>Teller für Teller</span>.',
      sub:'Jeder Schritt liegt als Karte im Regal. Klick ihn auf, arbeite ihn ab, leg ihn in den Einkaufswagen — die Währung von DB VIII sind die Kosten pro Gericht, Getränk oder Dessert.',
      summary:'Menükosten', chain:true },
    { path:/\/inventurliste\/?$/, kachel:'db0_inventurliste',
      eyebrow:'Der Warenkorb · DB 0',
      title:'Deine Inventurliste. <span>Schritt für Schritt</span>.',
      sub:'Jeder Schritt liegt als Karte im Regal. Klick ihn auf, arbeite ihn ab, leg ihn in den Einkaufswagen — die Währung von DB 0 ist der Preis.',
      /* Relation-Kacheln (erscheinen im Nachgang) — ans Ende des Regals, zählen gesondert.
         type:'ghost'  = wechselseitige Relation, erscheint automatisch → du tust nichts (nicht im Balken)
         type:'later'  = Rollup/aktive Verknüpfung, baust du selbst NACH der Relation (zählt im Balken, Lila) */
      relations:[
        { type:'ghost', name:'Lieferant', target:'Verknüpfung · DB I Lieferpartner', flag:'erscheint automatisch',
          desc:'Spiegelspalte der Lieferpartner-Verknüpfung — erscheint von allein.',
          img:'https://tastyrob123.github.io/kurs/img/lieferpartner/kuehltransporter-sprinter.jpg',
          content:'<p class="notion-text">Diese Spalte legst du hier <b>nicht</b> selbst an.</p><p class="notion-text">&nbsp;</p><p class="notion-text">Sobald du in <b>DB I : Lieferpartner</b> die Verknüpfung zur Inventurliste mit <b>wechselseitiger Verbindung</b> anlegst, taucht sie hier von allein auf.</p><p class="notion-text">&nbsp;</p><p class="notion-text">→ <b>Name der Spalte</b> : Lieferant</p><p class="notion-text">&nbsp;</p><p class="notion-text">Du benennst sie hier nur — verknüpft wird von der Lieferpartner-Seite.</p>' },
        { type:'later', name:'Hauptkontakt Lieferant', target:'Formel · Visitenkarte', flag:'später verknüpfen',
          desc:'Formel „Hauptkontakt Visitenkarte" — baust du selbst.',
          img:'https://tastyrob123.github.io/kurs/img/flow/lieferantenvertrag.jpg',
          content:'<p class="notion-text">→ <b>Eigenschaft</b> : Formel</p><p class="notion-text">&nbsp;</p><p class="notion-text">→ <b>Name der Spalte</b> : Hauptkontakt Visitenkarte</p><p class="notion-text">&nbsp;</p><p class="notion-text">Trage diese Formel ein:</p><div class="notion-code" style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.7rem;line-height:1.55">prop("Lieferpartner")<br>&nbsp;&nbsp;.map(current.prop("Ansprechpartner Übersicht")<br>&nbsp;&nbsp;&nbsp;&nbsp;/* Nur Hauptansprechpartner filtern */<br>&nbsp;&nbsp;&nbsp;&nbsp;.filter(current.prop("Hauptansprechpartner") == "X")<br>&nbsp;&nbsp;&nbsp;&nbsp;/* Kontaktkarte für jeden Ansprechpartner aufbauen */<br>&nbsp;&nbsp;&nbsp;&nbsp;.map(<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"👤 " + current.prop("Name") +<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if(not empty(current.prop("Job / Title")), "\\n💼 " + current.prop("Job / Title"), "") +<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if(not empty(current.prop("Telefon")), "\\n📞 " + current.prop("Telefon"), "") +<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if(not empty(current.prop("E-Mail")), "\\n✉️ " + current.prop("E-Mail"), "")<br>&nbsp;&nbsp;&nbsp;&nbsp;)<br>&nbsp;&nbsp;)<br>&nbsp;&nbsp;.flat()<br>&nbsp;&nbsp;/* Mehrere Karten mit Leerzeile trennen */<br>&nbsp;&nbsp;.join("\\n\\n")</div><p class="notion-text">&nbsp;</p><p class="notion-text">Zeigt den Hauptansprechpartner deines Lieferanten als Visitenkarte — Name, Titel, Telefon, Mail.</p>' },
        { type:'later', name:'Ansprechpartner Lieferant', target:'Rollup · über Lieferant', flag:'später verknüpfen',
          desc:'Rollup über die Lieferant-Verknüpfung — baust du selbst.',
          img:'https://tastyrob123.github.io/kurs/img/flow/ansprechpartner.jpg',
          content:'<p class="notion-text">→ <b>Eigenschaft</b> : Rollup</p><p class="notion-text">&nbsp;</p><p class="notion-text">→ <b>Verknüpfung</b> : Lieferant</p><p class="notion-text">→ <b>Eigenschaft</b> : Ansprechpartner</p><p class="notion-text">→ <b>Berechnen</b> : Eindeutige Werte zeigen</p><p class="notion-text">&nbsp;</p><p class="notion-text">→ <b>Name der Spalte</b> : Ansprechpartner Lieferant</p><p class="notion-text">&nbsp;</p><p class="notion-text">Dir werden hier die Ansprechpartner angezeigt, die im verknüpften Lieferanten hinterlegt sind.</p>' },
        { type:'ghost', name:'Ist Zutat', target:'Verknüpfung · DB IV Zutaten', flag:'erscheint automatisch',
          desc:'Spiegelspalte der Zutaten-Verknüpfung — erscheint von allein.',
          img:'https://tastyrob123.github.io/kurs/img/zutaten/tomate.jpg',
          content:'<p class="notion-text">Diese Spalte legst du hier <b>nicht</b> selbst an.</p><p class="notion-text">&nbsp;</p><p class="notion-text">Sie erscheint automatisch, sobald du in <b>DB IV : Zutaten</b> die Verknüpfung „Inventar Produkt" mit <b>wechselseitiger Verbindung</b> zur Inventurliste anlegst.</p>' },
        { type:'ghost', name:'Packaging / Co.', target:'Gegenspalte · aus DB VIII Gerichte', flag:'erscheint automatisch',
          desc:'Gegenspalte der Packaging-Verknüpfung aus den Gerichten — erscheint von allein.',
          img:'https://tastyrob123.github.io/kurs/img/packaging/kuchenbox.jpg',
          content:'<p class="notion-text">Diese Spalte legst du hier <b>nicht</b> an.</p><p class="notion-text">&nbsp;</p><p class="notion-text">Sie ist die <b>Gegenspalte</b> der Verknüpfung „Packaging", die du erst in <b>DB VIII : Gerichte &amp; Getränke</b> anlegst — dort wählst du je Gericht die passende Verpackung, und ihr Preis fließt in den Wareneinsatz. Ist die Verbindung wechselseitig, taucht „Packaging / Co." hier automatisch auf und zeigt, welche Gerichte diese Verpackung nutzen.</p><p class="notion-text">&nbsp;</p><p class="notion-text">Die Verpackung selbst liegt als normales Produkt in deiner Inventurliste — die „Packaging"-Seite ist nur eine gefilterte Ansicht davon.</p>' }
      ],
      summary:'Wareneinsatz', chain:true },
    { path:/\/lieferpartner-ansprechpartner-lieferantenvertrge\/?$/, kachel:'db13_lieferanten',
      marker:/Kundennummer/,
      eyebrow:'DB I - Lieferpartner',
      title:'Deine Lieferpartner. <span>An einem Ort</span>.',
      sub:'Jeder Schritt liegt als Karte im Regal. Klick ihn auf, arbeite ihn ab, leg ihn in den Einkaufswagen — die Währung von DB I ist die Mindestbelieferung.<br>Um zu starten: / → neue Tabellenansicht / Datenbank → DB I : Lieferpartner Übersicht.',
      relations:[
        { type:'ghost', name:'Ansprechpartner', target:'Gegenspalte · aus DB II', flag:'erscheint automatisch',
          desc:'Gegenspalte der Ansprechpartner-Verknüpfung — erscheint von allein.',
          img:'https://tastyrob123.github.io/kurs/img/flow/ansprechpartner.jpg',
          content:'<p class="notion-text">Diese Spalte legst du hier <b>nicht</b> an.</p><p class="notion-text">&nbsp;</p><p class="notion-text">Sie erscheint automatisch, sobald du in <b>DB II : Ansprechpartner</b> die Verknüpfung „Gehört zu Lieferpartner" mit <b>wechselseitiger Verbindung</b> anlegst.</p><p class="notion-text">&nbsp;</p><p class="notion-text">→ <b>Name der Spalte</b> : Ansprechpartner</p><p class="notion-text">&nbsp;</p><p class="notion-text">Zeigt dir, welche Ansprechpartner zu diesem Lieferpartner gehören.</p>' },
        { type:'ghost', name:'Verträge &amp; Dienstleister', target:'Gegenspalte · aus DB III', flag:'erscheint automatisch',
          desc:'Gegenspalte der Vertrags-Verknüpfung — erscheint von allein.',
          img:'https://tastyrob123.github.io/kurs/img/vertraege/navy-executive.jpg',
          content:'<p class="notion-text">Diese Spalte legst du hier <b>nicht</b> an.</p><p class="notion-text">&nbsp;</p><p class="notion-text">Sie erscheint automatisch, sobald du in <b>DB III : Lieferantenverträge</b> die Verknüpfung „Lieferpartner" mit <b>wechselseitiger Verbindung</b> anlegst.</p><p class="notion-text">&nbsp;</p><p class="notion-text">→ <b>Name der Spalte</b> : Verträge &amp; Dienstleister</p><p class="notion-text">&nbsp;</p><p class="notion-text">Zeigt dir, welche Verträge zu diesem Lieferpartner gehören.</p>' },
        { type:'later', name:'Hauptkontakt', target:'Rollup · über Ansprechpartner', flag:'später verknüpfen',
          desc:'Rollup über die Ansprechpartner-Verknüpfung — baust du selbst.',
          img:'https://tastyrob123.github.io/kurs/img/flow/lieferantenvertrag.jpg',
          content:'<p class="notion-text">→ <b>Eigenschaft</b> : Rollup</p><p class="notion-text">&nbsp;</p><p class="notion-text">→ <b>Verknüpfung</b> : Ansprechpartner Übersicht</p><p class="notion-text">→ <b>Eigenschaft</b> : Kontaktinfos</p><p class="notion-text">→ <b>Berechnen</b> : Original anzeigen</p><p class="notion-text">&nbsp;</p><p class="notion-text">→ <b>Name der Spalte</b> : Kontaktinfos</p><p class="notion-text">&nbsp;</p><p class="notion-text">Zeigt den Hauptansprechpartner deines Lieferpartners direkt in der Übersicht.</p>' }
      ],
      summary:'Transportkosten', cta:'Tour buchen', ctaDone:'Tour gebucht', chain:true },
    /* Zweites Regal auf derselben Seite: DB II Ansprechpartner (Marker eindeutig = Hauptansprechpartner) */
    { path:/\/lieferpartner-ansprechpartner-lieferantenvertrge\/?$/, kachel:'db13_ansprechpartner',
      marker:/Hauptansprechpartner/,
      eyebrow:'DB II - Ansprechpartner',
      title:'Deine Ansprechpartner. <span>In einer Übersicht</span>.',
      sub:'Jeder Schritt liegt als Karte im Regal. Klick ihn auf, arbeite ihn ab, leg ihn in den Einkaufswagen — die Währung von DB II ist die Jahresrückvergütung.<br>Um zu starten: / → neue Tabellenansicht / Datenbank → DB II : Ansprechpartner Übersicht.',
      summary:'Jahresrückvergütung', cta:'Paket auswählen', ctaDone:'Paket gewählt', chain:true },
    /* Drittes Regal auf derselben Seite: DB III Lieferverträge (Marker eindeutig = Vertragsbezeichnung) */
    { path:/\/lieferpartner-ansprechpartner-lieferantenvertrge\/?$/, kachel:'db13_vertraege',
      marker:/Vertragsbezeichnung/,
      eyebrow:'DB III - Lieferantenverträge',
      title:'Deine Lieferverträge. <span>Sauber dokumentiert</span>.',
      sub:'Jeder Schritt liegt als Karte im Regal. Klick ihn auf, arbeite ihn ab, leg ihn in den Einkaufswagen — die Währung von DB III ist der Vertragswert.<br>Um zu starten: / → neue Tabellenansicht / Datenbank → DB III : Lieferverträge Übersicht.',
      relations:[
        { type:'later', name:'Kontakt', target:'Rollup · über Lieferpartner', flag:'später verknüpfen',
          desc:'Rollup über die Lieferpartner-Verknüpfung — baust du selbst.',
          img:'https://tastyrob123.github.io/kurs/img/flow/ansprechpartner.jpg',
          content:'<p class="notion-text">→ <b>Eigenschaft</b> : Rollup</p><p class="notion-text">&nbsp;</p><p class="notion-text">→ <b>Verknüpfung</b> : Lieferpartner</p><p class="notion-text">→ <b>Eigenschaft</b> : Ansprechpartner</p><p class="notion-text">→ <b>Berechnen</b> : Original anzeigen</p><p class="notion-text">&nbsp;</p><p class="notion-text">→ <b>Name der Spalte</b> : Kontakt</p><p class="notion-text">&nbsp;</p><p class="notion-text">Zieht den Ansprechpartner des verknüpften Lieferpartners in den Vertrag.</p>' }
      ],
      summary:'Vertragsvolumina', cta:'Vertrag abschließen', ctaDone:'Vertrag geschlossen', chain:true }
  ];

  var reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  var CSS=`
  #tsshop{width:100vw;max-width:100vw;margin:clamp(44px,6vh,72px) 0 clamp(42px,6vh,72px);margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);padding:0 clamp(20px,4vw,56px);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",Helvetica,Arial,sans-serif;color:#fff}
  #tsshop *{box-sizing:border-box}
  #tsshop .tss-inner{max-width:1280px;margin:0 auto}
  #tsshop .tss-head{text-align:center;margin-bottom:30px}
  #tsshop .tss-eyebrow{display:inline-flex;align-items:center;gap:9px;font-size:.62rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#c7b489;margin-bottom:12px}
  #tsshop .tss-eyebrow::before{content:"";width:7px;height:7px;border-radius:50%;background:#c7b489;box-shadow:0 0 12px rgba(199,180,137,.7)}
  #tsshop .tss-title{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;font-size:clamp(32px,4.4vw,52px);font-weight:600;letter-spacing:-.02em;line-height:1.1;color:#fff;margin:0 0 12px}
  #tsshop .tss-title span{color:#c7b489}
  #tsshop .tss-sub{font-size:15px;color:#e1e1e1;max-width:600px;margin:0 auto;line-height:1.6}
  /* Fortschritts-Balken unter dem Warenkorb — edles Glas-Panel: links Summe (Champagner, dick),
     Mitte grüner Fortschritts-Track mit Glow+Sheen, rechts Backoffice-Gesamt (rot). */
  #tsshop .tss-bar{display:flex;align-items:center;gap:clamp(18px,3vw,44px);max-width:880px;margin:clamp(28px,3.6vh,52px) auto 0;padding:20px clamp(22px,2.6vw,32px);border-radius:18px;background:linear-gradient(165deg,rgba(255,255,255,.06),rgba(255,255,255,.018) 60%,rgba(255,255,255,.006));border:1px solid rgba(255,255,255,.08);box-shadow:0 24px 60px -34px rgba(0,0,0,.85),inset 0 1px 0 rgba(255,255,255,.07);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);opacity:0;transform:translateY(14px);transition:opacity .8s ease,transform .9s cubic-bezier(.22,1,.36,1)}
  #tsshop .tss-bar.on{opacity:1;transform:none}
  #tsshop .tss-bar__side{flex:0 0 auto;min-width:112px}
  #tsshop .tss-bar__left{text-align:left}
  #tsshop .tss-bar__right{text-align:right}
  #tsshop .tss-bar__val{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",Arial,sans-serif;font-size:clamp(23px,2.7vw,33px);font-weight:700;letter-spacing:-.012em;line-height:1;color:#fff;font-variant-numeric:tabular-nums}
  #tsshop .tss-bar__global{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",Arial,sans-serif;font-size:clamp(23px,2.7vw,33px);font-weight:700;letter-spacing:-.012em;line-height:1;color:#fff;font-variant-numeric:tabular-nums}
  #tsshop .tss-bar__cap{font-size:11px;font-weight:600;letter-spacing:.01em;color:#c7b489;margin-top:10px;white-space:nowrap}
  #tsshop .tss-bar__mid{flex:1 1 auto;min-width:0}
  #tsshop .tss-bar__track{position:relative;height:6px;border-radius:99px;background:rgba(255,255,255,.08);box-shadow:inset 0 1px 2px rgba(0,0,0,.45);overflow:hidden}
  #tsshop .tss-bar__fill{position:relative;height:100%;width:0;border-radius:99px;overflow:hidden;background:linear-gradient(90deg,#5FAE88,#9FD3B9);box-shadow:0 0 10px rgba(143,203,170,.5),inset 0 1px 0 rgba(255,255,255,.3);transition:width .7s cubic-bezier(.22,1,.36,1)}
  #tsshop .tss-bar__fill::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.42),transparent);transform:translateX(-100%);animation:tss-sheen 3.4s ease-in-out infinite}
  @keyframes tss-sheen{0%{transform:translateX(-100%)}55%,100%{transform:translateX(100%)}}
  #tsshop .tss-bar__mid-cap{display:flex;justify-content:space-between;gap:12px;margin-top:11px;font-size:10px;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:rgba(255,255,255,.4)}
  #tsshop .tss-bar__mid-cap b{color:rgba(216,201,171,.9);font-weight:700}
  @media(max-width:640px){#tsshop .tss-bar{flex-direction:column;align-items:stretch;gap:18px;text-align:center}#tsshop .tss-bar__left,#tsshop .tss-bar__right{text-align:center}#tsshop .tss-bar__side{min-width:0}#tsshop .tss-bar__cap{white-space:normal}}
  @media(prefers-reduced-motion:reduce){#tsshop .tss-bar{opacity:1;transform:none;transition:none}#tsshop .tss-bar__fill{transition:none}#tsshop .tss-bar__fill::after{animation:none;display:none}}
  #tsshop .tss-shelf{position:relative}
  #tsshop .tss-track{display:flex;gap:22px;overflow-x:auto;scroll-snap-type:x mandatory;padding:8px 2px 22px;scrollbar-width:none;-ms-overflow-style:none;overscroll-behavior-x:contain}
  #tsshop .tss-track::-webkit-scrollbar{display:none}
  #tsshop .tss-card{--tss-g:104,134,196;flex:0 0 calc((100% - 3*22px)/4);min-width:0;scroll-snap-align:start;cursor:pointer;border-radius:16px;overflow:visible;background:linear-gradient(165deg,rgba(255,255,255,.05),rgba(255,255,255,.015) 55%,rgba(255,255,255,0));border:1px solid rgba(255,255,255,.10);box-shadow:0 18px 44px -30px rgba(0,0,0,.85);opacity:0;transform:translateY(18px);transition:opacity .65s ease,transform .75s cubic-bezier(.22,1,.36,1),border-color .4s ease,box-shadow .5s ease}
  #tsshop .tss-card.on{opacity:1;transform:translateY(0)}
  /* Heartbeat-Glow wie #tsq (mehrwert-zielbild): navy-pastell neutral, pastellgrün im Einkaufswagen */
  #tsshop .tss-card:hover,#tsshop .tss-card:focus-visible{transform:translateY(-4px);border-color:rgba(var(--tss-g),.5);animation:tss-heartbeat 2.6s cubic-bezier(.4,0,.3,1) infinite;outline:none}
  @keyframes tss-heartbeat{
    0%{box-shadow:0 4px 14px rgba(var(--tss-g),.10),0 0 14px rgba(var(--tss-g),.10)}
    18%{box-shadow:0 6px 22px rgba(var(--tss-g),.30),0 0 46px rgba(var(--tss-g),.34)}
    32%{box-shadow:0 5px 18px rgba(var(--tss-g),.16),0 0 26px rgba(var(--tss-g),.18)}
    46%{box-shadow:0 6px 20px rgba(var(--tss-g),.26),0 0 40px rgba(var(--tss-g),.28)}
    72%,100%{box-shadow:0 4px 14px rgba(var(--tss-g),.10),0 0 14px rgba(var(--tss-g),.10)}
  }
  #tsshop .tss-imgwrap{position:relative;aspect-ratio:1/1;overflow:hidden;border-radius:16px 16px 0 0;background:#0b0d14}
  #tsshop .tss-imgwrap img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .5s cubic-bezier(.22,1,.36,1)}
  #tsshop .tss-card:hover .tss-imgwrap img{transform:scale(1.04)}
  #tsshop .tss-donebadge{position:absolute;top:12px;right:12px;z-index:3;width:28px;height:28px;border-radius:50%;display:none;align-items:center;justify-content:center;background:rgba(143,203,170,.92);border:1px solid rgba(255,255,255,.25);color:#0b1512;box-shadow:0 4px 16px rgba(143,203,170,.4)}
  #tsshop .tss-card.is-done .tss-donebadge{display:flex}
  /* im Einkaufswagen = edles Pastellgrün — Schleier nur über Rahmen/Textbereich, NICHT über dem Bild */
  #tsshop .tss-card{position:relative}
  #tsshop .tss-body{position:relative}
  #tsshop .tss-body::after{content:"";position:absolute;inset:0;pointer-events:none;border-radius:0 0 16px 16px;background:linear-gradient(180deg,rgba(143,203,170,.12),rgba(143,203,170,.22));opacity:0;transition:opacity .55s ease}
  #tsshop .tss-card.is-done .tss-body::after{opacity:1}
  #tsshop .tss-card.is-done{--tss-g:143,203,170;background:linear-gradient(165deg,rgba(160,208,180,.30),rgba(160,208,180,.12) 55%,rgba(160,208,180,.05));border-color:rgba(160,208,180,.6);box-shadow:0 18px 44px -30px rgba(0,0,0,.85),0 0 38px rgba(143,203,170,.24)}
  #tsshop .tss-card.is-done .tss-val{color:#9FD3B9}
  /* ── Relation-Kacheln: Ghost (erscheint automatisch) + Safe-for-Later (Lila) ── */
  #tsshop .tss-card.tss-rel{cursor:pointer}
  #tsshop .tss-flag{position:absolute;top:11px;left:11px;z-index:4;display:inline-flex;align-items:center;gap:6px;padding:5px 10px 5px 9px;border-radius:999px;font-size:10px;font-weight:600;letter-spacing:.02em;line-height:1;white-space:nowrap;-webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px)}
  #tsshop .tss-flag::before{content:"";width:6px;height:6px;border-radius:50%;flex:none}
  #tsshop .tss-val--rel{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;font-size:13px;font-weight:600;letter-spacing:0;text-transform:none;color:rgba(216,201,171,.92)}
  /* Ghost: nur Rahmen/Body wirken „noch nicht da" — das Bild bleibt voll */
  #tsshop .tss-card.tss-ghost{border:1px dashed rgba(255,255,255,.30);box-shadow:none;background:linear-gradient(165deg,rgba(255,255,255,.035),rgba(255,255,255,.01) 55%,transparent)}
  #tsshop .tss-card.tss-ghost .tss-body{opacity:.6}
  #tsshop .tss-card.tss-ghost:hover,#tsshop .tss-card.tss-ghost:focus-visible{transform:translateY(-4px);animation:none;border-color:rgba(255,255,255,.5)}
  #tsshop .tss-ghost .tss-flag{background:rgba(16,18,26,.74);border:1px dashed rgba(255,255,255,.5);color:rgba(255,255,255,.86)}
  #tsshop .tss-ghost .tss-flag::before{background:rgba(255,255,255,.6)}
  #tsshop .tss-card.tss-ghost.is-done{border-style:solid}
  #tsshop .tss-card.tss-ghost.is-done .tss-body{opacity:1}
  #tsshop .tss-card.tss-later{--tss-g:150,120,224;border:1px solid rgba(150,120,224,.5);background:linear-gradient(165deg,rgba(150,120,224,.17),rgba(150,120,224,.05) 55%,rgba(150,120,224,.015))}
  #tsshop .tss-card.tss-later:hover,#tsshop .tss-card.tss-later:focus-visible{border-color:rgba(150,120,224,.85);box-shadow:0 18px 44px -30px rgba(0,0,0,.85),0 0 34px rgba(150,120,224,.28)}
  #tsshop .tss-later .tss-flag{background:rgba(150,120,224,.92);border:1px solid rgba(255,255,255,.28);color:#0c0a16}
  #tsshop .tss-later .tss-flag::before{background:#0c0a16}
  #tsshop .tss-card.tss-later.is-done{--tss-g:143,203,170;border-color:rgba(160,208,180,.6)}
  /* Bild mittig „contain" (z. B. Packaging-Kuchenbox) */
  #tsshop .tss-card.tss-fit-contain .tss-imgwrap{background:#000}
  #tsshop .tss-card.tss-fit-contain .tss-imgwrap img{object-fit:contain}
  #tsshop.tss-has-rel .tss-bar__fill{background:linear-gradient(90deg,#e35d76,#e32552);box-shadow:0 0 10px rgba(227,37,82,.5),inset 0 1px 0 rgba(255,255,255,.3)}
  /* Relation-Overlay: Ziel-Label (Lineal) + „erscheint automatisch"-Chip + contain-Bild */
  #tsshop-detail .tsd-price--rel{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;font-size:15px;font-weight:600;letter-spacing:0;color:rgba(216,201,171,.95)}
  #tsshop-detail .tsd-auto{display:inline-flex;align-items:center;gap:8px;padding:11px 16px;border-radius:12px;font-size:.82rem;font-weight:600;background:rgba(255,255,255,.05);border:1px dashed rgba(255,255,255,.32);color:rgba(255,255,255,.8)}
  #tsshop-detail .tsd-auto svg{width:16px;height:16px;flex:none}
  #tsshop-detail .tsd-imgwrap--contain{background:#000}
  #tsshop-detail .tsd-imgwrap--contain img{object-fit:contain}
  /* Tron-Neon-Sweep beim In-den-Einkaufswagen-Legen */
  #tsshop .tss-neon{position:absolute;inset:0;width:100%;height:100%;z-index:4;pointer-events:none;overflow:visible;filter:drop-shadow(0 0 5px rgba(143,203,170,.95)) drop-shadow(0 0 16px rgba(143,203,170,.5));transition:opacity .5s ease}
  #tsshop .tss-body{padding:16px 18px 18px}
  #tsshop .tss-name{font-size:1.02rem;font-weight:600;letter-spacing:-.012em;color:#fff;margin:0 0 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #tsshop .tss-desc{font-size:.82rem;color:rgba(255,255,255,.52);line-height:1.5;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #tsshop .tss-val{text-align:right;margin-top:14px;font-size:1rem;font-weight:700;font-variant-numeric:tabular-nums;color:#d8c9ab}
  /* Kanten-Schatten entfernt: verdeckte am linken Rand die Karte + den Tron-Sweep. Scroll-Hinweis geben die Pfeile. */
  #tsshop .tss-fade{display:none !important}
  #tsshop .tss-fade.prev{left:0;background:linear-gradient(90deg,rgba(5,6,11,.92),rgba(5,6,11,0))}
  #tsshop .tss-fade.next{right:0;background:linear-gradient(270deg,rgba(5,6,11,.92),rgba(5,6,11,0))}
  #tsshop .tss-fade.on{opacity:1}
  #tsshop .tss-nav{position:absolute;top:calc(50% - 31px);z-index:3;width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(10,12,20,.72);border:1px solid rgba(255,255,255,.14);color:rgba(255,255,255,.75);cursor:pointer;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);transition:opacity .3s ease,border-color .25s ease,color .25s ease,transform .25s ease;opacity:0;pointer-events:none;padding:0}
  #tsshop .tss-nav.on{opacity:1;pointer-events:auto}
  #tsshop .tss-nav:hover{border-color:rgba(199,180,137,.55);color:#d8c9ab;transform:scale(1.06)}
  #tsshop .tss-nav.prev{left:-10px}
  #tsshop .tss-nav.next{right:-10px}
  @media(max-width:1024px){#tsshop .tss-card{flex-basis:calc((100% - 2*22px)/3)}}
  @media(max-width:820px){#tsshop .tss-card{flex-basis:calc((100% - 22px)/2)}}
  @media(max-width:540px){#tsshop .tss-card{flex-basis:78%}#tsshop .tss-track{gap:16px}}
  @media(hover:none){#tsshop .tss-nav{display:none}}
  @media(prefers-reduced-motion:reduce){
    #tsshop .tss-card{opacity:1;transform:none;transition:none}
    #tsshop .tss-card:hover,#tsshop .tss-card:focus-visible{transform:none;animation:none;box-shadow:0 0 26px rgba(var(--tss-g),.25)}
    #tsshop .tss-imgwrap img{transition:none}
    #tsshop .tss-nav{transition:none}
  }
  /* ---- Detail-Overlay: kompakt wie die Astro-Referenz, schwebt zentriert ---- */
  #tsshop-detail{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:clamp(14px,3vh,32px);overscroll-behavior:contain;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",Helvetica,Arial,sans-serif;color:#fff}
  #tsshop-detail *{box-sizing:border-box}
  #tsshop-detail .tsd-back{position:fixed;inset:0;background:rgba(4,5,10,.88);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
  #tsshop-detail .tsd-panel{position:relative;width:min(1020px,94vw);max-height:88vh;padding:clamp(20px,2.6vw,32px);border-radius:20px;background:linear-gradient(165deg,rgba(20,23,34,.97),rgba(9,11,18,.97));border:1px solid rgba(255,255,255,.10);box-shadow:0 40px 120px -40px rgba(0,0,0,.95)}
  #tsshop-detail.tsd-anim .tsd-panel{animation:tsdUp .55s cubic-bezier(.22,1,.36,1) both}
  @keyframes tsdUp{from{opacity:0;transform:translateY(42px) scale(.97)}to{opacity:1;transform:none}}
  #tsshop-detail .tsd-close{position:absolute;top:14px;right:14px;z-index:5;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);color:rgba(255,255,255,.8);cursor:pointer;padding:0;transition:border-color .25s ease,color .25s ease,transform .25s ease}
  #tsshop-detail .tsd-close:hover{border-color:rgba(199,180,137,.55);color:#d8c9ab;transform:scale(1.06)}
  /* Referenz-Proportion: Bild links definiert die Höhe, rechts scrollt der Inhalt intern */
  #tsshop-detail .tsd-grid{display:grid;grid-template-columns:minmax(0,23fr) minmax(0,22fr);gap:clamp(18px,2.4vw,32px);height:min(58vh,540px)}
  #tsshop-detail .tsd-imgwrap{height:100%;border-radius:14px;overflow:hidden;background:#0b0d14;border:1px solid rgba(255,255,255,.08)}
  #tsshop-detail .tsd-imgwrap img{display:block;width:100%;height:100%;object-fit:cover}
  #tsshop-detail .tsd-info{display:flex;flex-direction:column;min-height:0;height:100%}
  #tsshop-detail .tsd-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:.58rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#c7b489;margin:2px 0 8px}
  #tsshop-detail .tsd-title{font-size:clamp(22px,2.8vw,32px);font-weight:800;letter-spacing:-.02em;line-height:1.1;color:#fff;margin:22px 0 12px;flex:none}
  #tsshop-detail .tsd-content{flex:1;min-height:0;overflow-y:auto;padding-right:8px;font-size:.84rem;line-height:1.55;color:rgba(255,255,255,.72);scrollbar-width:thin}
  #tsshop-detail .tsd-content::-webkit-scrollbar{width:7px}
  #tsshop-detail .tsd-content::-webkit-scrollbar-thumb{background:rgba(199,180,137,.22);border-radius:99px}
  #tsshop-detail .tsd-content .notion-text{margin:5px 0;color:rgba(255,255,255,.72)}
  #tsshop-detail .tsd-content .notion-semantic-string{color:inherit}
  #tsshop-detail .tsd-content img{max-width:100%;width:auto;max-height:150px;height:auto;border-radius:8px}
  #tsshop-detail .tsd-content .notion-column-list{display:block}
  #tsshop-detail .tsd-content .notion-column{width:100%!important;max-width:100%!important;margin:0 0 8px!important}
  #tsshop-detail .tsd-content .notion-code{position:relative;max-height:200px;overflow:auto;margin:10px 0;padding:12px 14px;border-radius:10px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.09);font-size:.72rem;line-height:1.5}
  #tsshop-detail .tsd-content .notion-code::-webkit-scrollbar{width:7px;height:7px}
  #tsshop-detail .tsd-content .notion-code::-webkit-scrollbar-thumb{background:rgba(199,180,137,.25);border-radius:99px}
  #tsshop-detail .tsd-copy{position:sticky;top:0;float:right;margin:-2px -4px 6px 10px;padding:4px 11px;border-radius:999px;border:1px solid rgba(216,201,171,.3);background:rgba(10,12,20,.85);color:rgba(216,201,171,.75);font-size:10.5px;font-weight:600;letter-spacing:.05em;cursor:pointer;transition:color .2s ease,border-color .2s ease}
  #tsshop-detail .tsd-copy:hover{color:#efe6d2;border-color:rgba(216,201,171,.6)}
  #tsshop-detail .tsd-buy{flex:none;display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-top:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,.08)}
  #tsshop-detail .tsd-price{font-size:1.65rem;font-weight:800;font-variant-numeric:tabular-nums;color:#efe6d2;line-height:1}
  #tsshop-detail .tsd-done{flex:none;display:inline-flex;align-items:center;gap:9px;padding:12px 24px;border-radius:12px;border:1px solid rgba(239,230,210,.9);background:#efe6d2;color:#0c0e16;font-size:.9rem;font-weight:700;cursor:pointer;transition:background .25s ease,border-color .25s ease,color .25s ease,transform .2s ease}
  #tsshop-detail .tsd-done:hover{background:#e2d5b8;transform:translateY(-1px)}
  #tsshop-detail .tsd-done.is-done{background:rgba(143,203,170,.14);border-color:rgba(143,203,170,.5);color:#9FD3B9}
  @media(max-width:820px){
    #tsshop-detail{align-items:flex-end;padding:0}
    #tsshop-detail .tsd-panel{width:100%;max-height:94vh;border-radius:20px 20px 0 0;overflow-y:auto}
    #tsshop-detail .tsd-grid{grid-template-columns:1fr;height:auto}
    #tsshop-detail .tsd-imgwrap{height:auto;max-height:36vh}
    #tsshop-detail .tsd-imgwrap img{aspect-ratio:4/3}
    #tsshop-detail .tsd-content{max-height:38vh}
    #tsshop-detail .tsd-buy{flex-direction:column;align-items:stretch}
    #tsshop-detail .tsd-done{justify-content:center}
  }
  @media(prefers-reduced-motion:reduce){#tsshop-detail.tsd-anim .tsd-panel{animation:none}}
  /* View-Transition-Morph Karte → Detail */
  ::view-transition-group(tsshopimg),::view-transition-group(tsshoptitle),::view-transition-group(tsshopprice){animation-duration:.45s;animation-timing-function:cubic-bezier(.22,1,.36,1)}
  `;

  /* Platzhalter-Bild (SVG data-URI) — bis echte Produktbilder eingetragen sind */
  function ph(name){
    var initial=(name||'').trim().charAt(0).toUpperCase();
    var svg='<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">'
      +'<rect width="600" height="600" fill="#0b0d14"/>'
      +'<circle cx="300" cy="262" r="170" fill="rgba(199,180,137,0.045)"/>'
      +'<circle cx="300" cy="262" r="112" fill="rgba(199,180,137,0.05)"/>'
      +'<circle cx="300" cy="262" r="86" fill="none" stroke="rgba(199,180,137,0.35)" stroke-width="1.5"/>'
      +'<text x="300" y="290" text-anchor="middle" font-family="Georgia,serif" font-size="76" fill="rgba(216,201,171,0.75)">'+initial+'</text>'
      +'<text x="300" y="436" text-anchor="middle" font-family="-apple-system,Helvetica,sans-serif" font-size="21" letter-spacing="5" fill="rgba(255,255,255,0.4)">'+(name||'').toUpperCase()+'</text>'
      +'<text x="300" y="470" text-anchor="middle" font-family="-apple-system,Helvetica,sans-serif" font-size="12" letter-spacing="3" fill="rgba(199,180,137,0.55)">BILD FOLGT</text>'
      +'</svg>';
    return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  }

  /* #tsshop -> .tsshop (Mehrfach-Instanzen pro Seite); #tsshop-detail bleibt Singleton-ID */
  function injectCSS(){ if(document.getElementById('tsshop-css'))return; var s=document.createElement('style'); s.id='tsshop-css'; s.textContent=CSS.replace(/#tsshop(?!-detail)/g,'.tsshop'); document.head.appendChild(s); }

  var CHEV_L='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';
  var CHEV_R='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>';
  var XICON='<svg viewBox="0 0 18 18" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4.5 4.5l9 9M13.5 4.5l-9 9"/></svg>';
  var CHECK='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5l5 5 10-11"/></svg>';
  var CART='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="17.5" cy="20" r="1.4"/><path d="M2.5 3.5h2.6l2.5 12h10.3l2.1-8.5H6.1"/></svg>';

  /* ---- Schritte aus den Notion-Toggles der Phasen-Sektion lesen ---- */
  function doneKey(txt){ return 'done-'+((txt||'').replace(/[‣\s]/g,'').slice(0,40)); }
  function findPhases(marker,sel){
    var lists=document.querySelectorAll(sel||'.notion-column-list'), cand=null;
    for(var i=0;i<lists.length;i++){
      var t=lists[i].textContent||'';
      /* Standard-Regal (column-list) verlangt "Phase I"+"Schritt". Bei eigenem
         container-Selector (Tab-Widget .notion-tabs) identifiziert allein der marker
         die richtige Sektion — diese Seiten tragen kein "Phase I"/"Schritt" im
         Container-Text (z. B. /rezepturen: /Grundgerüst/; /gemeinkosten…: /Gemeinkosten/
         bzw. /Mitarbeiter/). Ohne marker fällt der Container-Fall auf "Phase I" zurück. */
      var ok = sel
        ? (marker ? marker.test(t) : t.indexOf('Phase I')>-1)
        : (t.indexOf('Phase I')>-1 && t.indexOf('Schritt')>-1 && (!marker||marker.test(t)));
      if(ok){ if(!cand||cand.contains(lists[i])) cand=lists[i]; }
    }
    return cand;
  }
  function collectSteps(list){
    var toggles=[].slice.call(list.querySelectorAll('.notion-toggle[class*="notion-toggle-heading"]'));
    return toggles.map(function(t,i){
      var sum=t.querySelector(':scope > .notion-toggle__summary');
      var rawTitle=sum?sum.textContent:'';
      var title=rawTitle.replace(/‣/g,'').replace(/\s+/g,' ').trim();
      var content=t.querySelector(':scope > .notion-toggle__content');
      var desc=content?content.textContent.replace(/\s+/g,' ').replace(/^→\s*/,'').trim().slice(0,110):'';
      return { i:i, toggle:t, title:title, key:doneKey(rawTitle), content:content, desc:desc };
    });
  }
  function relKey(page,r){ return 'rel-done-'+(page.kachel||'x')+'-'+r.name.replace(/[^a-z0-9]+/gi,'').toLowerCase(); }
  function isDone(step){ return localStorage.getItem(step.key)==='1'; }
  function setDone(step,val){
    localStorage.setItem(step.key, val?'1':'0');
    /* Original-Toggle-System synchron halten (gleiche Keys, gleiche Attribute) */
    step.toggle.setAttribute('data-done', val?'1':'0');
    var box=step.toggle.querySelector('.done-check'); if(box) box.checked=val;
  }

  /* ---- Markup ---- */
  function build(page,k,steps){
    var root=document.createElement('div'); root.className='tsshop'+((page.relations&&page.relations.length)?' tss-has-rel':''); root.id='tsshop--'+(page.kachel||'x');
    var cards=steps.map(function(st,i){
      var v=k.objekt_varianten[i%k.objekt_varianten.length]||{};
      return '<article class="tss-card'+(v.fit==='contain'?' tss-fit-contain':'')+(isDone(st)?' is-done':'')+'" data-step="'+i+'" role="button" tabindex="0" aria-label="'+st.title+' öffnen">'
        +'<div class="tss-imgwrap"><img src="'+(v.img||ph(v.name||st.title))+'" alt="'+st.title+'" loading="lazy"><span class="tss-donebadge">'+CHECK+'</span></div>'
        +'<div class="tss-body">'
          +'<h4 class="tss-name">'+st.title+'</h4>'
          +'<p class="tss-desc">'+st.desc+'</p>'
          +'<div class="tss-val">'+fmt(k.einheit_typ,v.wert)+'</div>'
        +'</div></article>';
    }).join('');
    var relCards='';
    if(page.relations&&page.relations.length){
      relCards=page.relations.map(function(r,ri){
        var done=(r.type==='later'&&localStorage.getItem(relKey(page,r))==='1')||(r.mirrorKey&&localStorage.getItem(r.mirrorKey)==='1');
        return '<article class="tss-card tss-rel tss-'+r.type+(r.fit==='contain'?' tss-fit-contain':'')+(done?' is-done':'')+'" data-rel="'+ri+'" role="button" tabindex="0" aria-label="'+r.name+' — '+r.flag+'">'
          +'<div class="tss-imgwrap"><img src="'+r.img+'" alt="'+r.name+'" loading="lazy"><span class="tss-flag">'+r.flag+'</span><span class="tss-donebadge">'+CHECK+'</span></div>'
          +'<div class="tss-body"><h4 class="tss-name">'+r.name+'</h4><p class="tss-desc">'+r.desc+'</p><div class="tss-val tss-val--rel">'+r.target+'</div></div>'
        +'</article>';
      }).join('');
    }
    root.innerHTML='<div class="tss-inner">'
      +'<div class="tss-head">'
        +'<div class="tss-eyebrow">'+page.eyebrow+'</div>'
        +'<h3 class="tss-title">'+page.title+'</h3>'
        +'<p class="tss-sub">'+page.sub+'</p>'
      +'</div>'
      +'<div class="tss-shelf" role="region" aria-label="'+k.kachel_name+' — Warenkorb">'
        +'<div class="tss-fade prev"></div><div class="tss-fade next"></div>'
        +'<button type="button" class="tss-nav prev" aria-label="Zurück scrollen">'+CHEV_L+'</button>'
        +'<button type="button" class="tss-nav next" aria-label="Weiter scrollen">'+CHEV_R+'</button>'
        +'<div class="tss-track">'+cards+relCards+'</div>'
      +'</div>'
      +(page.summary?'<div class="tss-bar">'
          +'<div class="tss-bar__side tss-bar__left"><div class="tss-bar__val"></div><div class="tss-bar__cap">'+page.summary+'</div></div>'
          +'<div class="tss-bar__mid"><div class="tss-bar__track"><div class="tss-bar__fill"></div></div><div class="tss-bar__mid-cap"></div></div>'
          +'<div class="tss-bar__side tss-bar__right"><div class="tss-bar__global"></div><div class="tss-bar__cap">Backoffice</div></div>'
        +'</div>':'')
      +'</div>';
    return root;
  }
  /* ---- Backoffice-Gesamtfortschritt: % ALLER Schritte aller Lektion-2-Blöcke ----
     Nenner = Summe der bekannten Schrittzahlen (auch noch nicht besuchte Seiten
     zählen mit). Zähler = erledigte Schritte = localStorage-Keys "done-…"='1'
     (dieselben Keys, die das Karten-/Checkbox-System setzt → immer aktuell). */
  var BACKOFFICE={ db0_inventurliste:16, db13_lieferanten:13, db13_ansprechpartner:10, db13_vertraege:13, db4_zutaten:30, db5_rezepturen:23, db5_finance_personal:7, db6_gemeinkosten:10, db6_gemeinkostenannahmen:5, db7_mitarbeiterloehne:15, db8_gerichte:37 };
  function backofficeTotal(){ var t=0; for(var kk in BACKOFFICE){ if(BACKOFFICE.hasOwnProperty(kk)) t+=BACKOFFICE[kk]; } return t; }
  function backofficeDone(){ var d=0; try{ for(var i=0;i<localStorage.length;i++){ var key=localStorage.key(i); if(key&&key.slice(0,5)==='done-'&&localStorage.getItem(key)==='1') d++; } }catch(e){} return d; }
  function backofficePct(){ var t=backofficeTotal(), d=Math.min(backofficeDone(),t); return t>0?Math.round(d/t*100):0; }
  function refreshGlobals(){ var g=backofficePct()+' %', els=document.querySelectorAll('.tsshop .tss-bar__global'); for(var i=0;i<els.length;i++) els[i].textContent=g; }
  /* Live-Aktualisierung, wenn in einem anderen Tab ein Schritt erledigt wird */
  window.addEventListener('storage',function(e){ if(!e.key||e.key.slice(0,5)==='done-') refreshGlobals(); });

  function updProgress(root,steps,k,page){
    if(!(page&&page.summary&&k&&k.objekt_varianten)) return;
    var done=steps.filter(isDone).length, n=k.objekt_varianten.length;
    /* Links: Summe der erledigten Karten (beige) — Werte exakt wie auf den Karten */
    var total=0;
    for(var i=0;i<steps.length;i++){ if(isDone(steps[i])){ var v=k.objekt_varianten[i%n]; if(v&&typeof v.wert==='number') total+=v.wert; } }
    total=Math.round(total*100)/100;
    var valEl=root.querySelector('.tss-bar__val');
    if(valEl) valEl.textContent=fmt(page.summaryType||k.einheit_typ,total);
    /* Mitte: Fortschritt DIESES Schritt-Blocks.
       Nenner = jetzt baubare Schritte + Safe-for-Later-Relationen (Lila).
       Ghost-Kacheln (erscheinen automatisch) zählen NICHT mit. */
    var laterList=(page.relations||[]).filter(function(r){ return r.type==='later'; });
    var laterDone=laterList.filter(function(r){ return localStorage.getItem(relKey(page,r))==='1'; }).length;
    var denom=steps.length+laterList.length, num=done+laterDone;
    var pct=denom?Math.round(num/denom*100):0;
    var fill=root.querySelector('.tss-bar__fill'); if(fill) fill.style.width=pct+'%';
    var mc=root.querySelector('.tss-bar__mid-cap');
    if(mc) mc.innerHTML='<span>Diese Lektion</span><span><b>'+pct+' %</b> · '+num+'/'+denom+'</span>';
    /* Rechts: Backoffice-Gesamt (rot) — auf allen Balken der Seite synchron */
    refreshGlobals();
  }

  /* Tron-Neon-Sweep: startet unten links, läuft in beide Richtungen, trifft sich oben rechts */
  function neonSweep(card){
    if(reduced||!card||card.querySelector('.tss-neon')) return;
    var w=card.offsetWidth,h=card.offsetHeight; if(!w||!h) return;
    var i=1.25,r=16-i,q=r-r/Math.SQRT2;
    var x0=i,y0=i,x1=w-i,y1=h-i;
    var P0x=x0+q,P0y=y1-q,P1x=x1-q,P1y=y0+q;
    var pA='M '+P0x+' '+P0y+' A '+r+' '+r+' 0 0 1 '+x0+' '+(y1-r)+' L '+x0+' '+(y0+r)+' A '+r+' '+r+' 0 0 1 '+(x0+r)+' '+y0+' L '+(x1-r)+' '+y0+' A '+r+' '+r+' 0 0 1 '+P1x+' '+P1y;
    var pB='M '+P0x+' '+P0y+' A '+r+' '+r+' 0 0 0 '+(x0+r)+' '+y1+' L '+(x1-r)+' '+y1+' A '+r+' '+r+' 0 0 0 '+x1+' '+(y1-r)+' L '+x1+' '+(y0+r)+' A '+r+' '+r+' 0 0 0 '+P1x+' '+P1y;
    var NS='http://www.w3.org/2000/svg';
    var svg=document.createElementNS(NS,'svg');
    svg.setAttribute('class','tss-neon');
    svg.setAttribute('viewBox','0 0 '+w+' '+h);
    [pA,pB].forEach(function(d){
      var p=document.createElementNS(NS,'path');
      p.setAttribute('d',d); p.setAttribute('fill','none');
      p.setAttribute('stroke','#A9DCC1'); p.setAttribute('stroke-width','2.5'); p.setAttribute('stroke-linecap','round');
      svg.appendChild(p);
      var len=p.getTotalLength();
      p.style.strokeDasharray=len; p.style.strokeDashoffset=len;
      p.animate([{strokeDashoffset:len},{strokeDashoffset:0}],{duration:950,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'});
    });
    card.appendChild(svg);
    setTimeout(function(){ svg.style.opacity='0'; setTimeout(function(){ svg.remove(); },520); },1300);
  }

  /* ---- Detail-Overlay ---- */
  function setNames(card,on){
    if(!card) return;
    var img=card.querySelector('.tss-imgwrap img'), ttl=card.querySelector('.tss-name'), val=card.querySelector('.tss-val');
    if(img) img.style.viewTransitionName=on?'tsshopimg':'';
    if(ttl) ttl.style.viewTransitionName=on?'tsshoptitle':'';
    if(val) val.style.viewTransitionName=on?'tsshopprice':'';
  }
  function buildOverlay(page,k,steps,idx,root){
    var st=steps[idx];
    var v=k.objekt_varianten[idx%k.objekt_varianten.length]||{};
    var ov=document.createElement('div'); ov.id='tsshop-detail';
    ov.innerHTML='<div class="tsd-back"></div>'
      +'<div class="tsd-panel">'
        +'<button type="button" class="tsd-close" aria-label="Schließen">'+XICON+'</button>'
        +'<div class="tsd-grid">'
          +'<div class="tsd-imgwrap'+(v.fit==='contain'?' tsd-imgwrap--contain':'')+'"><img src="'+(v.img||ph(v.name||st.title))+'" alt="'+st.title+'" style="view-transition-name:tsshopimg"></div>'
          +'<div class="tsd-info">'
            +'<div class="tsd-eyebrow">'+page.eyebrow+'</div>'
            +'<h2 class="tsd-title" style="view-transition-name:tsshoptitle">'+st.title+'</h2>'
            +'<div class="tsd-content"></div>'
            +'<div class="tsd-buy">'
              +'<div class="tsd-price" style="view-transition-name:tsshopprice">'+fmt(k.einheit_typ,v.wert)+'</div>'
              +'<button type="button" class="tsd-done'+(isDone(st)?' is-done':'')+'">'+(isDone(st)?CHECK:CART)+'<span>'+(isDone(st)?(page.ctaDone||'Im Einkaufswagen'):(page.cta||'In den Einkaufswagen'))+'</span></button>'
            +'</div>'
          +'</div>'
        +'</div>'
      +'</div>';
    /* Schritt-Inhalt verlustfrei klonen */
    var target=ov.querySelector('.tsd-content');
    if(st.content){
      var clone=st.content.cloneNode(true);
      /* Toggle war zu → Klon erbt inline display:none; alles aufklappen */
      clone.style.removeProperty('display');
      clone.removeAttribute('hidden');
      [].slice.call(clone.querySelectorAll('.notion-toggle__content')).forEach(function(e){ e.style.removeProperty('display'); });
      [].slice.call(clone.querySelectorAll('.notion-toggle.closed')).forEach(function(e){ e.classList.remove('closed'); });
      [].slice.call(clone.querySelectorAll('[id]')).forEach(function(e){ e.removeAttribute('id'); });
      [].slice.call(clone.querySelectorAll('.done-check, .notion-code__copy-button')).forEach(function(e){ e.remove(); });
      /* eigener Copy-Button je Formelblock */
      [].slice.call(clone.querySelectorAll('.notion-code')).forEach(function(code){
        var btn=document.createElement('button'); btn.type='button'; btn.className='tsd-copy'; btn.textContent='Copy';
        btn.addEventListener('click',function(e){
          e.stopPropagation();
          var src=code.cloneNode(true); var b=src.querySelector('.tsd-copy'); if(b) b.remove();
          var txt=src.textContent.trim();
          if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(txt);
          btn.textContent='Kopiert'; setTimeout(function(){ btn.textContent='Copy'; },1600);
        });
        code.insertBefore(btn,code.firstChild);
      });
      target.appendChild(clone);
    }
    return ov;
  }
  /* Relation-Kachel-Overlay: Ghost = Info + „erscheint automatisch"-Chip (kein Done-Button);
     Safe-for-Later = Instruktionen + „Als erledigt markieren" → Karte wird grün, zählt im Balken. */
  function openRelDetail(page,k,steps,r,ri,card,root){
    if(document.getElementById('tsshop-detail')) return;
    var isLater=r.type==='later', kk=relKey(page,r);
    var done=isLater?localStorage.getItem(kk)==='1':card.classList.contains('is-done');
    var contain=r.fit==='contain';
    var autoChip='<div class="tsd-auto"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg><span>Erscheint automatisch</span></div>';
    var doneBtn='<button type="button" class="tsd-done'+(done?' is-done':'')+'">'+(done?CHECK:CART)+'<span>'+(done?'Erledigt':'Als erledigt markieren')+'</span></button>';
    var ov=document.createElement('div'); ov.id='tsshop-detail'; ov.className='tsd-anim';
    ov.innerHTML='<div class="tsd-back"></div>'
      +'<div class="tsd-panel">'
        +'<button type="button" class="tsd-close" aria-label="Schließen">'+XICON+'</button>'
        +'<div class="tsd-grid">'
          +'<div class="tsd-imgwrap'+(contain?' tsd-imgwrap--contain':'')+'"><img src="'+r.img+'" alt="'+r.name+'"></div>'
          +'<div class="tsd-info">'
            +'<div class="tsd-eyebrow">'+(isLater?'Safe for Later':'Ghost · erscheint automatisch')+'</div>'
            +'<h2 class="tsd-title">'+r.name+'</h2>'
            +'<div class="tsd-content">'+(r.content||('<p class="notion-text">'+r.desc+'</p>'))+'</div>'
            +'<div class="tsd-buy">'
              +'<div class="tsd-price tsd-price--rel">'+r.target+'</div>'
              +(isLater?doneBtn:autoChip)
            +'</div>'
          +'</div>'
        +'</div>'
      +'</div>';
    function closeOv(){ ov.remove(); document.body.style.overflow=''; }
    ov.querySelector('.tsd-close').addEventListener('click',closeOv);
    ov.querySelector('.tsd-back').addEventListener('click',closeOv);
    ov.addEventListener('click',function(e){ if(e.target===ov) closeOv(); });
    document.addEventListener('keydown',function esc(e){ if(e.key==='Escape'){ closeOv(); document.removeEventListener('keydown',esc); } });
    if(isLater){
      var db=ov.querySelector('.tsd-done');
      db.addEventListener('click',function(){
        var nv=localStorage.getItem(kk)==='1'?'0':'1';
        localStorage.setItem(kk,nv);
        card.classList.toggle('is-done',nv==='1');
        updProgress(root,steps,k,page);
        if(nv==='1'){ closeOv(); setTimeout(function(){ neonSweep(card); },320); }
        else { db.classList.remove('is-done'); db.innerHTML=CART+'<span>Als erledigt markieren</span>'; }
      });
    }
    document.body.appendChild(ov);
    document.body.style.overflow='hidden';
  }

  function openDetail(page,k,steps,idx,root){
    if(document.getElementById('tsshop-detail')) return;
    var card=root.querySelector('.tss-card[data-step="'+idx+'"]');
    var ov=buildOverlay(page,k,steps,idx,root);
    function mountOv(){
      document.body.appendChild(ov);
      document.body.style.overflow='hidden';
    }
    function closeOv(){
      function unmount(){ ov.remove(); document.body.style.overflow=''; setNames(card,false); }
      if(document.startViewTransition&&!reduced&&card){
        setNames(card,false);
        var vt=document.startViewTransition(function(){ ov.remove(); document.body.style.overflow=''; setNames(card,true); });
        vt.finished.then(function(){ setNames(card,false); }).catch(function(){ setNames(card,false); });
      } else unmount();
    }
    /* In den Einkaufswagen: hinzufügen = Karte wird grün + Overlay schließt automatisch */
    var doneBtn=ov.querySelector('.tsd-done');
    doneBtn.addEventListener('click',function(){
      var st=steps[idx];
      var val=!isDone(st);
      setDone(st,val);
      var c=root.querySelector('.tss-card[data-step="'+idx+'"]'); if(c) c.classList.toggle('is-done',val);
      updProgress(root,steps,k,page);
      if(val){
        closeOv();
        setTimeout(function(){ neonSweep(c); },420);
        /* Chain (nur Seiten mit page.chain): Overlay schließt → Tron läuft →
           die Reihe rutscht auf, sodass die nächste NOCH FREIE Kachel exakt
           die Position der eben geöffneten einnimmt → dann öffnet sie sich.
           Bereits im Korb liegende Kacheln werden übersprungen. Ausgelöst NUR
           durch das Hinzufügen; Klick auf X/Backdrop beendet die Kette. */
        var nextIdx=-1;
        if(page.chain){ for(var j=idx+1;j<steps.length;j++){ if(!isDone(steps[j])){ nextIdx=j; break; } } }
        if(nextIdx>=0){
          var slideT=reduced?260:1400, openT=reduced?520:2150;
          setTimeout(function(){
            var track=root.querySelector('.tss-track');
            var cur=root.querySelector('.tss-card[data-step="'+idx+'"]');
            var nx=root.querySelector('.tss-card[data-step="'+nextIdx+'"]');
            if(track&&cur&&nx){ track.scrollBy({left:nx.offsetLeft-cur.offsetLeft, behavior:reduced?'auto':'smooth'}); }
          }, slideT);
          setTimeout(function(){ openDetail(page,k,steps,nextIdx,root); }, openT);
        }
        return;
      }
      doneBtn.classList.remove('is-done');
      doneBtn.innerHTML=CART+'<span>'+(page.cta||'In den Einkaufswagen')+'</span>';
    });
    ov.querySelector('.tsd-close').addEventListener('click',closeOv);
    ov.querySelector('.tsd-back').addEventListener('click',closeOv);
    ov.addEventListener('click',function(e){ if(e.target===ov) closeOv(); });
    document.addEventListener('keydown',function esc(e){ if(e.key==='Escape'){ closeOv(); document.removeEventListener('keydown',esc); } });
    if(document.startViewTransition&&!reduced&&card){
      /* Morph nach oben: Karte gibt ihre view-transition-names ans Overlay ab */
      setNames(card,true);
      var vt=document.startViewTransition(function(){ setNames(card,false); mountOv(); });
      vt.finished.catch(function(){});
    } else {
      ov.classList.add('tsd-anim');
      mountOv();
    }
  }

  /* ---- Verhalten Regal ---- */
  function setup(page,k,steps,root){
    var track=root.querySelector('.tss-track');
    var cards=[].slice.call(root.querySelectorAll('.tss-card'));
    var fadeP=root.querySelector('.tss-fade.prev'), fadeN=root.querySelector('.tss-fade.next');
    var navP=root.querySelector('.tss-nav.prev'), navN=root.querySelector('.tss-nav.next');
    var io=new IntersectionObserver(function(e){
      if(!e[0].isIntersecting) return;
      cards.forEach(function(c,i){
        c.style.transitionDelay=((i%4)*0.13)+'s';
        c.classList.add('on');
        setTimeout(function(){ c.style.transitionDelay=''; },(i%4)*130+900);
      });
      var bar=root.querySelector('.tss-bar'); if(bar) setTimeout(function(){ bar.classList.add('on'); },420);
      io.disconnect();
    },{threshold:.25});
    io.observe(root);
    function upd(){
      var max=track.scrollWidth-track.clientWidth-2;
      var canP=track.scrollLeft>4, canN=track.scrollLeft<max;
      fadeP.classList.toggle('on',canP); navP.classList.toggle('on',canP);
      fadeN.classList.toggle('on',canN); navN.classList.toggle('on',canN);
    }
    function step(){ var c=cards[0]; return c?c.getBoundingClientRect().width+22:320; }
    navP.addEventListener('click',function(){ track.scrollBy({left:-step(),behavior:'smooth'}); });
    navN.addEventListener('click',function(){ track.scrollBy({left:step(),behavior:'smooth'}); });
    track.addEventListener('scroll',upd,{passive:true});
    window.addEventListener('resize',upd);
    setTimeout(upd,150);
    cards.forEach(function(c){
      if(c.classList.contains('tss-rel')){
        var ri=parseInt(c.dataset.rel,10);
        c.addEventListener('click',function(){ openRelDetail(page,k,steps,page.relations[ri],ri,c,root); });
        c.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openRelDetail(page,k,steps,page.relations[ri],ri,c,root); } });
        return;
      }
      c.addEventListener('click',function(){ openDetail(page,k,steps,parseInt(c.dataset.step,10),root); });
      c.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openDetail(page,k,steps,parseInt(c.dataset.step,10),root); } });
    });
    updProgress(root,steps,k,page);
  }

  function pagesFor(){
    var out=[]; for(var i=0;i<PAGES.length;i++){ if(PAGES[i].path.test(location.pathname)) out.push(PAGES[i]); } return out;
  }
  function rootIdFor(page){ return 'tsshop--'+(page.kachel||'x'); }
  function mountPage(page){
    var lists;
    if(page.multi){
      /* Mehrere getrennte Container zu EINEM Regal bündeln (z. B. 4 einzelne
         .notion-tabs-Phasen auf /gerichte…): per Selector+marker sammeln, alle
         verstecken, Schritte zusammenfassen, Regal vor dem ERSTEN einfügen.
         page.expect: erst mounten, wenn alle erwarteten Container im DOM sind
         (verhindert Teil-Render während React-Hydration). */
      lists=[]; var nodes=document.querySelectorAll(page.container||'.notion-tabs');
      for(var i=0;i<nodes.length;i++){ var tx=nodes[i].textContent||''; if(!page.marker||page.marker.test(tx)) lists.push(nodes[i]); }
      if(page.expect && lists.length<page.expect) return;
    } else {
      var one=findPhases(page.marker,page.container); lists=one?[one]:[];
    }
    if(!lists.length) return;
    /* Original-Phasen verstecken (Notion bleibt SSOT) — auch nach React-Re-Render */
    for(var h=0;h<lists.length;h++){ if(lists[h].style.display!=='none') lists[h].style.display='none'; }
    var anchor=lists[0];
    var rootId=rootIdFor(page), existing=document.getElementById(rootId);
    /* leere Notion-Text-Blöcke direkt über dem Shop ausblenden — sie erzeugen tote Leerfläche */
    var top=existing||anchor, prev=top.previousElementSibling;
    while(prev && prev.classList && prev.classList.contains('notion-text') && !(prev.textContent||'').trim()){
      if(prev.style.display!=='none') prev.style.display='none';
      prev=prev.previousElementSibling;
    }
    if(existing) return;
    var k=kachel(page.kachel); if(!k||!k.ist_produkt_kachel) return;
    /* Schritt-Quelle bestimmen. Standard = die gefundenen Container. Bei page.panel liegt
       der gewünschte Schritt-Block in EINEM Sub-Tab (.notion-tabs__panel) des Containers:
       dann NUR die Toggles dieses Panels lesen, während der GANZE Container versteckt und
       verankert bleibt. So werden aus EINEM Tab-Widget zwei getrennte Warenkörbe (z. B.
       Gemeinkosten + Gemeinkostenannahmen auf /gemeinkosten-mitarbeiterlhne). */
    var srcs=lists;
    if(page.panel){
      srcs=[];
      for(var s=0;s<lists.length;s++){
        var panes=lists[s].querySelectorAll('.notion-tabs__panel');
        for(var p=0;p<panes.length;p++){ if(page.panel.test(panes[p].textContent||'')){ srcs.push(panes[p]); break; } }
      }
      if(!srcs.length) return;
    }
    var steps=[];
    for(var m=0;m<srcs.length;m++){ steps=steps.concat(collectSteps(srcs[m])); }
    steps.forEach(function(st,idx){ st.i=idx; });
    if(!steps.length) return;
    injectCSS();
    var root=build(page,k,steps);
    anchor.parentNode.insertBefore(root,anchor);
    setup(page,k,steps,root);
  }
  function mount(){
    var pages=pagesFor();
    if(!pages.length){
      [].slice.call(document.querySelectorAll('.tsshop')).forEach(function(e){ if(e.parentNode)e.parentNode.removeChild(e); });
      var d=document.getElementById('tsshop-detail'); if(d){ d.remove(); document.body.style.overflow=''; }
      return;
    }
    for(var i=0;i<pages.length;i++) mountPage(pages[i]);
  }
  function boot(){
    var tries=0;
    var iv=setInterval(function(){ tries++; mount(); if(tries>40) clearInterval(iv); },300);
    new MutationObserver(function(){ mount(); }).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='complete') boot(); else window.addEventListener('load',boot);
})();

/* ============================================================
   MacBook-Cover + Klick-Lightbox (lieferpartner)
   Exakt wie /inventurliste: Rohvideo per CSS versteckt,
   MacBook-Poster (Lektion 2.2 "DB I - III: Lieferpartner" in
   den Screen gebacken) sitzt im Video-Block der Sektion
   "DB I - III: Lieferanten" (Block 39ab…6bcf), Klick -> Lightbox.
   Poster (catbox): yznugp.png · Läuft nur auf
   /lieferpartner-ansprechpartner-lieferantenvertrge.
   ============================================================ */
(function(){
  if(window.__tsmacLief) return; window.__tsmacLief=true;
  var POSTER="https://files.catbox.moe/yznugp.png";
  (function(){ var pre=new Image(); pre.src=POSTER; })(); // Poster vorladen -> kein Leer-Blitz
  var PG='.page__lieferpartner-ansprechpartner-lieferantenvertrge';
  var VID='#block-39ab954655348084b1bee141678f6bcf';
  var CSS=[
    PG+' '+VID+' video{display:none!important;}',
    PG+' .tsmac{position:relative;cursor:pointer;display:block;width:100%;line-height:0;background:transparent;}',
    PG+' .tsmac img{width:100%;height:auto;display:block;transition:transform .5s ease;}',
    PG+' .tsmac:hover img{transform:scale(1.02);}',
    PG+' .tsmac__play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;}',
    PG+' .tsmac__play span{width:76px;height:76px;border-radius:50%;background:rgba(255,255,255,.16);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.55);display:flex;align-items:center;justify-content:center;transition:transform .3s,background .3s;}',
    PG+' .tsmac__play span::after{content:"";border-style:solid;border-width:12px 0 12px 20px;border-color:transparent transparent transparent #fff;margin-left:5px;}',
    PG+' .tsmac:hover .tsmac__play span{transform:scale(1.08);background:rgba(255,255,255,.26);}',
    '#tsmac-lb{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;background:rgba(5,6,11,.85);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);padding:4vw;opacity:0;transition:opacity .35s ease;}',
    '#tsmac-lb.open{display:flex;opacity:1;}',
    '#tsmac-lb .tsmac-stage{transform:scale(.94);transition:transform .4s cubic-bezier(.2,.7,.2,1);width:min(92vw,1180px);}',
    '#tsmac-lb.open .tsmac-stage{transform:scale(1);}',
    '#tsmac-lb video{width:100%;max-height:86vh;border-radius:12px;box-shadow:0 40px 120px rgba(0,0,0,.6);background:#000;display:block;}',
    '#tsmac-lb__close{position:absolute;top:22px;right:28px;width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.08);color:#fff;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;}'
  ].join('');
  function injectCSS(){ if(document.getElementById('tsmac-lief-css'))return; var s=document.createElement('style'); s.id='tsmac-lief-css'; s.textContent=CSS; document.head.appendChild(s); }
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
    if(!/\/lieferpartner-ansprechpartner-lieferantenvertrge\/?$/.test(location.pathname)) return;
    injectCSS();
    var scope=document.querySelector(PG); if(!scope) return;
    var nv=scope.querySelector(VID); if(!nv) return;
    if(nv.querySelector('.tsmac')) return;
    var raw=nv.querySelector('video'); if(!raw) return;
    var src=raw.currentSrc||raw.getAttribute('src')||(raw.querySelector('source')&&raw.querySelector('source').getAttribute('src'));
    if(!src) return;
    var poster=document.createElement('div'); poster.className='tsmac';
    poster.innerHTML='<img src="'+POSTER+'" alt="Lektion 2.2 – DB I - III: Lieferpartner" fetchpriority="high" decoding="async"><div class="tsmac__play"><span></span></div>';
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

/* ---- Organisationsfluss: Lieferant -> Ansprechpartner -> Lieferantenvertrag -> Produkt ---- */
(function(){
  if (window.__tsFlow) return; window.__tsFlow = true;
  var PATH = /\/lieferpartner-ansprechpartner-lieferantenvertrge\/?$/;
  var ROOT_ID = 'tsFlowRoot';

  var IMG = 'https://tastyrob123.github.io/kurs/img/flow/';
  var NODES = [
    { k:'01', label:'Lieferant',          desc:'Die Bezugsquelle',    img:'lieferant.jpg' },
    { k:'02', label:'Ansprechpartner',    desc:'Dein Kontakt dort',   img:'ansprechpartner.jpg' },
    { k:'03', label:'Lieferantenvertrag', desc:'Konditionen & JRV',   img:'lieferantenvertrag.jpg' },
    { k:'04', label:'Produkt',            desc:'Was bei dir ankommt', img:'produkt.jpg', central:true }
  ];

  function injectStyles(){
    if (document.getElementById('tsFlowStyles')) return;
    var css = `
    #tsFlowRoot{ width:100%; margin:8px 0; }
    #tsFlowRoot *{ box-sizing:border-box; }
    #tsFlowRoot .tsflow-section{ position:relative; overflow:hidden; padding:16px 8px 52px; background:transparent; }
    #tsFlowRoot .tsflow-section::before{ content:''; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:1200px; height:720px; background:radial-gradient(ellipse at center, rgba(150,175,255,.05) 0%, transparent 62%); pointer-events:none; }
    #tsFlowRoot .tsflow-canvas{ position:absolute; inset:0; width:100%; height:100%; z-index:0; pointer-events:none; }
    #tsFlowRoot .tsflow-inner{ position:relative; z-index:1; max-width:1080px; margin:0 auto; }
    #tsFlowRoot .tsflow-header{ text-align:center; margin-bottom:46px; }
    #tsFlowRoot .tsflow-title{ font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif; font-size:clamp(27px,3.5vw,41px); font-weight:600; letter-spacing:-.02em; color:#fff; line-height:1.14; margin:0 0 54px; }
    /* Intro-Textblock der Seite darueber: zentriert + etwas nach unten in den Zwischenraum */
    .tsflow-intro-block{ margin-top:70px !important; }
    .tsflow-intro-block, .tsflow-intro-block .notion-text, .tsflow-intro-block p, .tsflow-intro-block .notion-semantic-string{ text-align:center !important; }
    .tsflow-intro-block .notion-text{ max-width:820px; margin-left:auto !important; margin-right:auto !important; }
    #tsFlowRoot .tsflow-title span{ color:#c7b489; }
    #tsFlowRoot .tsflow-sub{ font-size:16px; color:#e1e1e1; max-width:660px; margin:0 auto; line-height:1.6; }

    #tsFlowRoot .tsflow-track{ display:flex; align-items:flex-start; justify-content:center; gap:0; }
    #tsFlowRoot .tsflow-node{ flex:0 0 auto; width:168px; text-align:center; opacity:0; transform:translateY(16px) scale(.94); transition:opacity .55s ease, transform .55s cubic-bezier(.34,1.56,.64,1); }
    #tsFlowRoot.play .tsflow-node{ opacity:1; transform:translateY(0) scale(1); transition-delay:calc(var(--i) * .3s + .1s); }

    #tsFlowRoot .tsflow-medallion{ width:104px; height:104px; margin:0 auto 18px; border-radius:50%; overflow:hidden; position:relative; border:1.5px solid rgba(88,116,190,.6); background:#0a0b10; box-shadow:0 0 24px rgba(185,208,255,.12); transition:box-shadow .35s, transform .35s, border-color .35s; }
    #tsFlowRoot .tsflow-medallion img{ width:100%; height:100%; object-fit:cover; display:block; }
    #tsFlowRoot .tsflow-node:hover .tsflow-medallion{ transform:translateY(-3px); box-shadow:0 0 46px rgba(200,220,255,.32); border-color:rgba(140,170,232,.92); }
    #tsFlowRoot .tsflow-node.central .tsflow-medallion{ border-width:2px; border-color:rgba(112,142,220,.72); box-shadow:0 0 40px rgba(196,216,255,.2), 0 0 0 4px rgba(196,216,255,.06); }
    #tsFlowRoot .tsflow-node.central:hover .tsflow-medallion{ box-shadow:0 0 60px rgba(206,224,255,.36), 0 0 0 8px rgba(206,224,255,.07); border-color:rgba(150,180,240,.96); }

    #tsFlowRoot .tsflow-num{ font-size:11.5px; font-weight:700; letter-spacing:.18em; color:rgba(199,180,137,.75); margin-bottom:7px; }
    #tsFlowRoot .tsflow-label{ font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif; font-size:15.5px; font-weight:600; letter-spacing:-.01em; color:#fff; margin-bottom:5px; }
    #tsFlowRoot .tsflow-node.central .tsflow-label{ color:#eaf1ff; }
    #tsFlowRoot .tsflow-desc{ font-size:13.5px; color:rgba(255,255,255,.4); line-height:1.42; }

    #tsFlowRoot .tsflow-conn{ flex:1 1 auto; position:relative; height:2px; margin-top:52px; min-width:24px; max-width:120px; }
    #tsFlowRoot .tsflow-line{ position:absolute; inset:0; background:linear-gradient(90deg, rgba(150,175,232,.14), rgba(150,175,232,.5)); transform:scaleX(0); transform-origin:left center; transition:transform .5s ease; }
    #tsFlowRoot.play .tsflow-conn .tsflow-line{ transform:scaleX(1); transition-delay:calc(var(--c) * .3s + .35s); }
    #tsFlowRoot .tsflow-tip{ position:absolute; right:-1px; top:50%; width:0; height:0; border-top:4px solid transparent; border-bottom:4px solid transparent; border-left:6px solid rgba(160,185,236,.66); transform:translateY(-50%) scale(0); transition:transform .3s cubic-bezier(.34,1.56,.64,1); }
    #tsFlowRoot.play .tsflow-conn .tsflow-tip{ transform:translateY(-50%) scale(1); transition-delay:calc(var(--c) * .3s + .76s); }
    #tsFlowRoot .tsflow-pulse{ position:absolute; top:50%; left:0; width:5px; height:5px; border-radius:50%; background:#dce9ff; box-shadow:0 0 8px rgba(190,212,255,.9); transform:translate(-50%,-50%); opacity:0; }
    #tsFlowRoot.play .tsflow-conn .tsflow-pulse{ animation:tsFlowPulseH 2.6s linear infinite; animation-delay:calc(var(--c) * .3s + 1.05s); }
    @keyframes tsFlowPulseH{ 0%{ left:0; opacity:0; } 12%{ opacity:1; } 88%{ opacity:1; } 100%{ left:100%; opacity:0; } }
    @keyframes tsFlowPulseV{ 0%{ top:0; opacity:0; } 12%{ opacity:1; } 88%{ opacity:1; } 100%{ top:100%; opacity:0; } }

    @media(max-width:720px){
      #tsFlowRoot .tsflow-section{ padding:44px 6px 40px; }
      #tsFlowRoot .tsflow-header{ margin-bottom:34px; }
      #tsFlowRoot .tsflow-track{ flex-direction:column; align-items:center; }
      #tsFlowRoot .tsflow-node{ width:100%; max-width:250px; }
      #tsFlowRoot .tsflow-conn{ flex:0 0 auto; width:2px; height:34px; min-width:0; max-width:none; margin:8px 0; }
      #tsFlowRoot .tsflow-line{ background:linear-gradient(180deg, rgba(150,175,232,.14), rgba(150,175,232,.5)); transform:scaleY(0); transform-origin:top center; }
      #tsFlowRoot.play .tsflow-conn .tsflow-line{ transform:scaleY(1); }
      #tsFlowRoot .tsflow-tip{ right:auto; left:50%; top:auto; bottom:-1px; border-left:4px solid transparent; border-right:4px solid transparent; border-top:6px solid rgba(160,185,236,.66); border-bottom:0; transform:translateX(-50%) scale(0); }
      #tsFlowRoot.play .tsflow-conn .tsflow-tip{ transform:translateX(-50%) scale(1); }
      #tsFlowRoot .tsflow-pulse{ left:50%; top:0; }
      #tsFlowRoot.play .tsflow-conn .tsflow-pulse{ animation-name:tsFlowPulseV; }
    }

    @media(prefers-reduced-motion:reduce){
      #tsFlowRoot .tsflow-node{ opacity:1 !important; transform:none !important; transition:none; }
      #tsFlowRoot .tsflow-conn .tsflow-line{ transform:scaleX(1) !important; transition:none; }
      #tsFlowRoot .tsflow-conn .tsflow-tip{ transform:translateY(-50%) scale(1) !important; transition:none; }
      #tsFlowRoot .tsflow-conn .tsflow-pulse{ animation:none !important; opacity:0 !important; }
    }`;
    var s=document.createElement('style'); s.id='tsFlowStyles'; s.textContent=css; document.head.appendChild(s);
  }

  function buildMarkup(){
    var root=document.createElement('div'); root.id=ROOT_ID;
    var track='';
    NODES.forEach(function(n,i){
      track += '<div class="tsflow-node'+(n.central?' central':'')+'" style="--i:'+i+'">'
             +   '<div class="tsflow-medallion"><img src="'+IMG+n.img+'" alt="'+n.label+'" loading="lazy"></div>'
             +   '<div class="tsflow-num">'+n.k+'</div>'
             +   '<div class="tsflow-label">'+n.label+'</div>'
             +   '<div class="tsflow-desc">'+n.desc+'</div>'
             + '</div>';
      if (i < NODES.length-1){
        track += '<div class="tsflow-conn" style="--c:'+i+'"><span class="tsflow-line"></span><span class="tsflow-tip"></span><span class="tsflow-pulse"></span></div>';
      }
    });
    root.innerHTML =
      '<section class="tsflow-section">'
    +   '<canvas class="tsflow-canvas" id="tsFlowCanvas"></canvas>'
    +   '<div class="tsflow-inner">'
    +     '<div class="tsflow-header">'
    +       '<h2 class="tsflow-title">Ein Vorgang, <span>eine Kette</span>.</h2>'
    +       '<p class="tsflow-sub">Jeder Lieferant hängt an einem Ansprechpartner, jeder Ansprechpartner an einem Vertrag — und jeder Vertrag bestimmt, welches Produkt zu welchen Konditionen bei dir ankommt. Genau diesen Fluss bildest du im Backoffice ab.</p>'
    +     '</div>'
    +     '<div class="tsflow-track">'+track+'</div>'
    +   '</div>'
    + '</section>';
    return root;
  }

  function initFlow(root){
    var section=root.querySelector('.tsflow-section');
    var canvas=root.querySelector('#tsFlowCanvas');
    var ctx=canvas.getContext('2d');
    var particles=[], animFrame, running=false, _rect={width:0,height:0}, _last=0, FRAME_MS=33;
    function resize(){ var r=section.getBoundingClientRect(); _rect=r; var dpr=window.devicePixelRatio||1; canvas.width=r.width*dpr; canvas.height=r.height*dpr; canvas.style.width=r.width+'px'; canvas.style.height=r.height+'px'; ctx.setTransform(dpr,0,0,dpr,0,0); }
    function initP(){ particles=[]; var r=section.getBoundingClientRect(); _rect=r; for(var i=0;i<32;i++){ particles.push({ x:Math.random()*r.width, y:Math.random()*r.height, r:Math.random()*.8+.2, vx:(Math.random()-.5)*.07, vy:(Math.random()-.5)*.05, alpha:Math.random()*.1+.02, pulse:Math.random()*Math.PI*2 }); } }
    function draw(ts){
      if(!running) return;
      if(ts && _last && ts-_last<FRAME_MS){ animFrame=requestAnimationFrame(draw); return; }
      if(ts) _last=ts;
      var pw=_rect.width, ph=_rect.height; if(!pw||!ph){ animFrame=requestAnimationFrame(draw); return; }
      ctx.clearRect(0,0,pw,ph);
      particles.forEach(function(p){ p.x+=p.vx; p.y+=p.vy; p.pulse+=.005;
        if(p.x<0)p.x=pw; if(p.x>pw)p.x=0; if(p.y<0)p.y=ph; if(p.y>ph)p.y=0;
        var a=p.alpha*(.7+Math.sin(p.pulse)*.3);
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle='rgba(180,205,255,'+a+')'; ctx.fill(); });
      animFrame=requestAnimationFrame(draw);
    }
    var played=false;
    var io=new IntersectionObserver(function(en){
      if(en[0].isIntersecting){
        if(!played){ played=true; root.classList.add('play'); resize(); initP(); running=true; draw(); }
        else if(!running){ running=true; resize(); draw(); }
      } else if(running){ running=false; cancelAnimationFrame(animFrame); }
    },{threshold:0.15});
    io.observe(section);
    var rt; window.addEventListener('resize',function(){ clearTimeout(rt); rt=setTimeout(function(){ if(running){ resize(); initP(); } },200); });
  }

  // Robust anchor: sit directly ABOVE der Video-Sektion ("DB I : Lieferpartner", halb Video / halb Text).
  // Die Video-Spalten-Liste ist zuverlaessig gerendert; der Intro-Textblock darueber wird von super.so
  // teils lazy/transient gerendert und taugt daher NICHT als Pflicht-Anker.
  // Rueckgabe: {node, where}.
  function findAnchor(){
    var root=document.querySelector('.notion-root'); if(!root) return null;
    var kids=root.children;
    // primaer: die Top-Level-column-list mit dem Lektions-Video -> davor einhaengen
    for(var i=0;i<kids.length;i++){
      var k=kids[i];
      if(k.classList && k.classList.contains('notion-column-list') && k.querySelector('.notion-video, .notion-video__content'))
        return { node:k, where:'before' };
    }
    // fallback: irgendein Video-Wrapper auf der Seite -> vor dessen Top-Level-Container
    var v=document.querySelector('.notion-video, .notion-video__content');
    if(v){ var c=v; while(c && c.parentNode!==root) c=c.parentNode; if(c) return { node:c, where:'before' }; }
    // letzter fallback: Top-Level-Textblock mit 'JRV und Co' -> danach einhaengen
    for(var j=0;j<kids.length;j++){ var t=kids[j]; if(t.textContent && t.textContent.indexOf('JRV und Co')>-1) return { node:t, where:'after' }; }
    return null;
  }
  function mount(){
    if(!PATH.test(location.pathname)) return;
    if(document.getElementById(ROOT_ID)) return;
    var a=findAnchor(); if(!a) return;
    injectStyles();
    var root=buildMarkup();
    if(a.where==='after') a.node.parentNode.insertBefore(root, a.node.nextSibling);
    else a.node.parentNode.insertBefore(root, a.node);
    tagIntro();
    initFlow(root);
  }
  // Intro-Absatz der Seite ("In dieser Lektion erstellen wir gleich...") zentrieren + tiefer setzen
  function tagIntro(){
    var texts=document.querySelectorAll('.notion-text');
    for(var i=0;i<texts.length;i++){
      if(texts[i].textContent && texts[i].textContent.indexOf('In dieser Lektion erstellen wir gleich')>-1){
        var block=texts[i].closest('.notion-column-list')||texts[i];
        block.classList.add('tsflow-intro-block');
        return;
      }
    }
  }
  function boot(){
    mount();
    var mo=new MutationObserver(function(){
      if(!PATH.test(location.pathname)){ var st=document.getElementById(ROOT_ID); if(st) st.remove(); return; }
      if(!document.getElementById(ROOT_ID)) mount();
    });
    mo.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();


/* ============================================================
   MacBook-Vergrößerung (lieferpartner) — #ts2mac
   Drei freigestellte MacBooks unter den Shop-Sektionen:
   DB I (links) · DB II (rechts) · DB III (rechts), je mit
   Textfläche daneben. Größe/Abstand wie #tsmb (mehrwert-zielbild).
   Klick auf den PC öffnet ihn groß in einer Lightbox.
   ⚠ Interim: Bilder sind kurze Einzelansichten -> Lightbox
   vergrößert nur. Für die echte Scroll-Animation (wie #tsmb)
   je einen LANGEN Ganzseiten-Screenshot einsetzen (dann .stage
   auf frame+scrollbaren screen umstellen). Bilder freigestellt
   (transparenter Hintergrund) unter img/lieferpartner-mac/.
   ============================================================ */
(function(){
  if(window.__ts2mac) return; window.__ts2mac=true;
  var PATH=/\/lieferpartner-ansprechpartner-lieferantenvertrge\/?$/;
  var BASE='https://tastyrob123.github.io/kurs/img/lieferpartner-mac/';
  var SCROLL=BASE+'scroll/';
  var FRAME='https://files.catbox.moe/oj1wa9.png'; /* leerer MacBook-Rahmen wie #tsmb */
  /* col: leere Notion-Spalte im 2-Spalten-Layout neben dem Erklärtext — der PC wird DORT platziert
     (echter Nachbar, gleiche Höhe, mittig). Ohne col (Verträge = kein 2-Spalten-Layout, Text volle
     Breite): Fallback = eigenes volles Band via side. */
  var MACS=[
    { after:'tsshop--db13_lieferanten',     col:'block-39bb954655348092b69cec1441abcc6e', img:BASE+'lieferpartner-uebersicht.png', shot:SCROLL+'lieferpartner.jpg',   cap:'Lieferpartner-Übersicht' },
    { after:'tsshop--db13_ansprechpartner', col:'block-39bb95465534801e9c8add95f1979a5e', img:BASE+'ansprechpartner-galerie.png',   shot:SCROLL+'ansprechpartner.jpg', cap:'Ansprechpartner-Galerie' },
    { after:'tsshop--db13_vertraege',       col:'block-39bb954655348006934fff07a63c709c', img:BASE+'vertraege-datenbank.png',        shot:SCROLL+'vertraege.jpg',      cap:'Verträge-Datenbank' }
  ];
  var CSS = `
  .ts2mac-row{width:100%;max-width:1180px;margin:clamp(30px,4vh,58px) auto 0;padding:0 clamp(16px,3vw,40px);display:flex;align-items:center;gap:clamp(20px,4vw,64px);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;box-sizing:border-box}
  .ts2mac-row.right{flex-direction:row-reverse}
  .ts2mac-row .ts2mac-cell{flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:center}
  /* PC direkt in einer leeren Notion-Spalte (neben dem Erklärtext) */
  .ts2mac-incol{display:flex;flex-direction:column;justify-content:center;align-items:center}
  .ts2mac-incol .ts2mac-pc{width:100%;display:flex;flex-direction:column;align-items:center}
  /* Text-Spalte + PC-Spalte vertikal mittig zueinander (Lieferpartner-, Ansprechpartner- & Verträge-Column-List) */
  #block-39bb9546553480dbae23db8a4b9592a6,#block-39bb9546553480248c0ac0e7ae493112,#block-39bb9546553480c49415d3053a4f2de6{align-items:center}
  .ts2mac-tile{width:100%;max-width:520px;cursor:pointer;border-radius:12px;filter:drop-shadow(0 18px 44px rgba(0,0,0,.5));transition:transform .5s cubic-bezier(.16,1,.3,1),filter .5s cubic-bezier(.16,1,.3,1)}
  .ts2mac-tile img{width:100%;height:auto;display:block}
  .ts2mac-tile:hover,.ts2mac-tile:focus-visible{transform:translateY(-4px) scale(1.02);animation:ts2macHb 2.6s cubic-bezier(.16,1,.3,1) infinite;outline:none}
  @keyframes ts2macHb{0%,100%{filter:drop-shadow(0 22px 52px rgba(0,0,0,.6)) drop-shadow(0 6px 18px rgba(199,180,137,.14))}50%{filter:drop-shadow(0 22px 52px rgba(0,0,0,.6)) drop-shadow(0 8px 26px rgba(199,180,137,.30))}}
  .ts2mac-tile:active{transform:scale(.99);transition-duration:.12s}
  .ts2mac-cap{width:100%;text-align:center;font-size:15px;font-weight:600;letter-spacing:.005em;color:#fff;margin-top:14px}
  .ts2mac-cap .g{color:#c7b489}
  .ts2mac-hint{font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.32);margin-top:6px;animation:ts2macHint 2.5s ease-in-out infinite}
  @keyframes ts2macHint{0%,100%{opacity:.4}50%{opacity:.8}}
  #ts2mac-lb{position:fixed;inset:0;z-index:99999;display:none;flex-direction:column;align-items:center;justify-content:center;background:rgba(5,6,11,.92);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);padding:clamp(16px,4vw,40px);opacity:0;transition:opacity .3s ease}
  #ts2mac-lb.open{display:flex;opacity:1}
  #ts2mac-lb .ts2mac-inner{position:relative;width:100%;max-width:min(960px,calc(100vw - 48px));transform:scale(.92) translateY(24px);transition:transform .5s cubic-bezier(.16,1,.3,1)}
  #ts2mac-lb.open .ts2mac-inner{transform:none}
  #ts2mac-lb.full .ts2mac-inner{max-width:100vw}
  #ts2mac-lb .ts2mac-mockup{position:relative;width:100%;aspect-ratio:1366/768;filter:drop-shadow(0 30px 80px rgba(0,0,0,.6)) drop-shadow(0 10px 30px rgba(0,0,0,.5))}
  #ts2mac-lb .ts2mac-fr{position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none;user-select:none}
  #ts2mac-lb .ts2mac-screen{position:absolute;top:3.65%;left:12.22%;width:73.06%;height:83.85%;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;z-index:3;border-radius:3px;background:#191919;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.16) transparent}
  #ts2mac-lb .ts2mac-screen::-webkit-scrollbar{width:5px}
  #ts2mac-lb .ts2mac-screen::-webkit-scrollbar-thumb{background:rgba(255,255,255,.16);border-radius:4px}
  #ts2mac-lb .ts2mac-screen img{width:100%;display:block}
  #ts2mac-lb .ts2mac-closehint{margin-top:20px;font-size:12px;letter-spacing:.1em;color:rgba(255,255,255,.32);text-align:center}
  #ts2mac-lb.full .ts2mac-closehint{display:none}
  #ts2mac-lb .ts2mac-btn{position:absolute;top:16px;z-index:10;width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.6);cursor:pointer;display:flex;align-items:center;justify-content:center;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);transition:background .2s,color .2s}
  #ts2mac-lb .ts2mac-btn:hover{background:rgba(255,255,255,.16);color:#fff}
  #ts2mac-lb .ts2mac-expand{left:16px}#ts2mac-lb .ts2mac-closex{right:16px}
  @media(max-width:820px){.ts2mac-row,.ts2mac-row.right{flex-direction:column}.ts2mac-txt{display:none}}
  @media(prefers-reduced-motion:reduce){.ts2mac-tile,.ts2mac-tile:hover{animation:none;transition:none}.ts2mac-hint{animation:none}}
  `;
  function injectCSS(){ if(document.getElementById('ts2mac-css'))return; var s=document.createElement('style'); s.id='ts2mac-css'; s.textContent=CSS; document.head.appendChild(s); }
  function shut(){ var lb=document.getElementById('ts2mac-lb'); if(lb) lb.classList.remove('open'); document.body.style.overflow=''; }
  function shutFull(){ var lb=document.getElementById('ts2mac-lb'); if(lb) lb.classList.remove('open','full'); document.body.style.overflow=''; }
  function ensureLb(){
    var lb=document.getElementById('ts2mac-lb'); if(lb) return lb;
    lb=document.createElement('div'); lb.id='ts2mac-lb';
    lb.innerHTML='<button class="ts2mac-btn ts2mac-expand" title="Vollbild" aria-label="Vollbild"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="ts2mac-btn ts2mac-closex" title="Schließen" aria-label="Schließen"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4.5 4.5l9 9M13.5 4.5l-9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button><div class="ts2mac-inner"><div class="ts2mac-mockup"><img class="ts2mac-fr" src="'+FRAME+'" alt="MacBook"><div class="ts2mac-screen"><img alt=""></div></div></div><div class="ts2mac-closehint">✕ Klicke daneben oder ESC zum Schließen</div>';
    document.body.appendChild(lb);
    var inner=lb.querySelector('.ts2mac-inner');
    lb.querySelector('.ts2mac-closex').addEventListener('click',shutFull);
    lb.querySelector('.ts2mac-expand').addEventListener('click',function(e){ e.stopPropagation(); lb.classList.toggle('full'); });
    inner.addEventListener('click',function(e){ e.stopPropagation(); });
    lb.addEventListener('click',function(e){ if(e.target===lb) shutFull(); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') shutFull(); });
    return lb;
  }
  function openLb(shot,alt){ var lb=ensureLb(); var img=lb.querySelector('.ts2mac-screen img'); img.src=shot; img.alt=alt||''; lb.classList.add('open'); lb.classList.remove('full'); document.body.style.overflow='hidden'; var sc=lb.querySelector('.ts2mac-screen'); if(sc) sc.scrollTop=0; }
  function buildPc(m){
    var pc=document.createElement('div'); pc.className='ts2mac-cell ts2mac-pc';
    pc.innerHTML='<div class="ts2mac-tile" role="button" tabindex="0" aria-label="'+m.cap+' vergrößern"><img src="'+m.img+'" alt="'+m.cap+'" loading="lazy" decoding="async"></div>'
      +'<div class="ts2mac-cap">'+m.cap+'<span class="g"> – Live Beispiel</span></div>'
      +'<div class="ts2mac-hint">Klicke zum Vergrößern</div>';
    var tile=pc.querySelector('.ts2mac-tile');
    tile.addEventListener('click',function(){ openLb(m.shot,m.cap); });
    tile.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openLb(m.shot,m.cap); } });
    return pc;
  }
  function buildRow(m){
    var row=document.createElement('div'); row.className='ts2mac-row'+(m.side==='right'?' right':''); row.id='ts2mac--'+m.after;
    var txt=document.createElement('div'); txt.className='ts2mac-cell ts2mac-txt';
    row.appendChild(buildPc(m)); row.appendChild(txt);
    return row;
  }
  function mount(){
    if(!PATH.test(location.pathname)){ var r=document.getElementById('ts2mac-lb'); if(r&&r.parentNode)r.parentNode.removeChild(r); return; }
    injectCSS();
    MACS.forEach(function(m){
      if(m.col){
        /* PC in die leere Notion-Spalte neben den Text setzen (echter Nachbar). */
        var col=document.getElementById(m.col); if(!col) return;
        var tgt=col.querySelector('.notion-column__content')||col;
        if(tgt.querySelector('.ts2mac-pc')) return;   /* Guard: kein Duplikat; selbstheilend falls React die Spalte neu rendert */
        col.classList.add('ts2mac-incol');
        tgt.appendChild(buildPc(m));
      } else {
        /* Fallback: eigenes volles Band nach dem Shop-Anker. */
        if(document.getElementById('ts2mac--'+m.after)) return;
        var shop=document.getElementById(m.after); if(!shop) return;
        shop.parentNode.insertBefore(buildRow(m), shop.nextSibling);
      }
    });
  }
  function boot(){
    var tries=0;
    var iv=setInterval(function(){ tries++; mount(); if(tries>80) clearInterval(iv); },300);
    new MutationObserver(function(){ mount(); }).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='complete') boot(); else window.addEventListener('load',boot);
})();

/* ============================================================
   lieferpartner — Überschrift „Lieferanten Netzwerk als
   Systembaustein" (#tslph): mehr Abstand zum Text darunter +
   letztes Wort „Systembaustein" in Champagner-Gold (#c7b489).
   Reiner Display-Layer auf dem Notion-Heading (kein Vault-Text).
   ============================================================ */
(function(){
  if(window.__tslph) return; window.__tslph=true;
  var PATH=/\/lieferpartner-ansprechpartner-lieferantenvertrge\/?$/;
  var PG='.page__lieferpartner-ansprechpartner-lieferantenvertrge';
  /* Farbe via CSS (Spezifität reicht); Abstand inline+!important,
     weil eine Theme-Regel mit höherer Spezifität den margin sonst überschreibt. */
  var CSS=PG+' .tslph-h .tslph-g{color:#c7b489 !important}';
  function injectCSS(){ if(document.getElementById('tslph-css'))return; var s=document.createElement('style'); s.id='tslph-css'; s.textContent=CSS; document.head.appendChild(s); }
  function findHeading(){
    var hs=document.querySelectorAll(PG+' .notion-heading, '+PG+' h1, '+PG+' h2');
    for(var i=0;i<hs.length;i++){ if(/Lieferanten Netzwerk als Systembaustein/i.test(hs[i].textContent||'')) return hs[i]; }
    return null;
  }
  function apply(){
    if(!PATH.test(location.pathname)) return;
    var h=findHeading(); if(!h) return;
    injectCSS();
    if(!h.classList.contains('tslph-h')) h.classList.add('tslph-h');
    if(h.style.marginBottom!=='44px') h.style.setProperty('margin-bottom','44px','important');
    if(!h.querySelector('.tslph-g')){
      h.innerHTML=(h.textContent||'').replace(/(Systembaustein)/, '<span class="tslph-g">$1</span>');
    }
  }
  function boot(){
    var tries=0;
    var iv=setInterval(function(){ tries++; apply(); if(tries>80) clearInterval(iv); },300);
    new MutationObserver(function(){ apply(); }).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='complete') boot(); else window.addEventListener('load',boot);
})();

/* ============================================================
   modul-2 — DB-Kachel-Raster "#tslmod" (18 Karten)
   Ersetzt das native Notion-Collection-Gallery-Raster (Block
   block-38fb…) durch die tsl-card-Komponente wie auf
   /inventurliste (#tslink) — aber OHNE Footer. Aufbau je Karte:
   T-Logo + Nummer (oben rechts) + Kicker + Titel (Lineal TS) +
   1-Zeilen-Beschreibung. Motiv = 3:2-JPEG (object-fit:contain,
   Bildschwarz verschmilzt mit #04050a), Scrim leicht reduziert
   ggü. #tslink (dunklere Motive), Champagner-Gold-Heartbeat-Glow.
   Bilder: img/modul2/*.jpg via GitHub Pages. Links = jeweilige
   Kurs-Unterseite (interner Wechsel, kein neuer Tab).
   ============================================================ */
(function(){
  if(window.__tslmod) return; window.__tslmod=true;
  function on(){ return /\/modul-2-das-notion-ai-backoffice-system\/?$/.test(location.pathname); }
  var BASE='https://tastyrob123.github.io/kurs/img/modul2/';
  var LOGO='https://files.catbox.moe/au80tp.png';
  var GLOW='199,180,137';
  var BLK='block-38fb95465534800bafb6c04f03af102b';
  var CARDS=[
   ['01','Überblick','Mehrwert & Zielbild','Das fertige Gericht vor Augen — worauf die nächsten Schritte hinarbeiten.','/mehrwert-zielbild','mehrwert-zielbild.jpg'],
   ['02','Datenbank','DB 0 · Inventurliste','Dein Warenbestand als Basis — jede Zutat mit ihrem Preis.','/inventurliste','inventurliste.jpg'],
   ['03','Datenbank','DB I–III · Lieferanten','Lieferanten, Ansprechpartner & Verträge — die Quelle jeder Einkaufszeile.','/lieferpartner-ansprechpartner-lieferantenvertrge','lieferanten.jpg'],
   ['04','Datenbank','DB IV · Zutaten','Zieht ihre Preise direkt aus deiner Inventurliste.','/zutatenliste','zutaten.jpg'],
   ['05','Datenbank','DB V · Rezepturen','Jede Rezeptur rechnet sich aus den Zutaten — automatisch.','/rezepturen','rezepturen.jpg'],
   ['06','Datenbank','DB VI · GK & Löhne','Gemein- und Personalkosten, sauber auf die Gerichte verteilt.','/gemeinkosten-mitarbeiterlhne','gemeinkosten-loehne.jpg'],
   ['07','Datenbank','DB VII · Allergene','Jede Zutat kennt ihre Allergene — die Kennzeichnung schreibt sich selbst.','/allergene-bersicht','allergene.jpg'],
   ['08','Datenbank','DB VIII · Gerichte & Getränke','Der finale Schritt — alles läuft im Gericht zusammen, auf den Cent.','/gerichte-getrnke-finaler-schritt','gerichte.jpg'],
   ['09','Interface','Interface-Bau','Grundstruktur & Widgets — dein System bekommt ein Gesicht.','/interface-bau-grundstruktur-widgets','interface.jpg'],
   ['10','Interface','Food-/Drinksquartier','Inhalte und Interface für Speisen und Getränke an einem Ort.','/food-drinksquartier-inhalte-interface','food-drinks.jpg'],
   ['11','Kalkulation','Menükalkulation','Menüs und Catering — kalkuliert bis auf die letzte Position.','/menkalkulation-catering-rechner','menuekalkulation.jpg'],
   ['12','Kennzahlen','Key Metrics','Deine wichtigsten Zahlen auf einen Blick — live aus dem System.','/key-metrics','key-metrics.jpg'],
   ['13','Betrieb','Operations Area','Der operative Kern — Abläufe, Checklisten, Tagesgeschäft.','/operations-area','operations.jpg'],
   ['14','Abschluss','Vision Frame','Der Abschluss des Building-Prozesses — dein Bild vom Ganzen.','/vision-frame-abschluss-des-building-prozesses','vision-frame.jpg'],
   ['15','KI','Notion AI','Wie KI dein System mitdenken lässt — konkret und im Alltag.','/notion-ai-fr-unser-system','notion-ai.jpg'],
   ['16','Skalierung','Multistandort','Das System auf mehrere Standorte erweitern — optional.','/multistandort-erweiterung-optional','multistandort.jpg'],
   ['17','Dynamik','Dynamisches System','Automationen und Feinschliff — das System bleibt in Bewegung.','/system-lebendiger-machen','dynamic-system.jpg'],
   ['18','Praxis','Allgemeine Tipps','Kniffe und Empfehlungen aus der Praxis — zum Weiterbauen.','/allgemeine-tipps','allgemeine-tipps.jpg']
  ];
  var CSS=`
  #tslmod{width:min(1320px,95vw);margin:34px auto 30px;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;color:#fff}
  #tslmod *{box-sizing:border-box}
  #tslmod .tsl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
  #tslmod a.tsl-card{position:relative;display:block;overflow:hidden;text-align:center;text-decoration:none;color:inherit;-webkit-tap-highlight-color:transparent;border-radius:16px;padding:30px 24px 26px;background:#04050a;border:1px solid transparent;box-shadow:0 18px 44px -30px rgba(0,0,0,.85);opacity:0;transform:translateY(18px);will-change:transform,box-shadow;transition:opacity .6s ease,transform .7s cubic-bezier(.22,1,.36,1),border-color .4s ease,box-shadow .5s ease}
  #tslmod .tsl-bg{position:absolute;inset:0;z-index:0;border-radius:inherit;overflow:hidden;background:#04050a;pointer-events:none}
  #tslmod .tsl-bg img{width:100%;height:100%;object-fit:contain;object-position:center;display:block;transition:filter .35s ease}
  #tslmod .tsl-bg::after{content:"";position:absolute;inset:0;background:radial-gradient(96% 86% at 50% 62%,rgba(4,5,10,.60) 0%,rgba(4,5,10,.36) 48%,rgba(4,5,10,.10) 78%,rgba(4,5,10,0) 100%)}
  #tslmod .tsl-num,#tslmod .tsl-logo,#tslmod .tsl-k,#tslmod .tsl-h,#tslmod .tsl-t{position:relative;z-index:2}
  #tslmod a.tsl-card.on{opacity:1;transform:translateY(0)}
  #tslmod a.tsl-card:hover{transform:translateY(-4px);box-shadow:0 6px 22px rgba(199,180,137,.20),0 0 40px rgba(199,180,137,.16)}
  #tslmod a.tsl-card:hover .tsl-bg img{filter:brightness(1.10)}
  #tslmod a.tsl-card:focus-visible{outline:2px solid rgba(${GLOW},.7);outline-offset:4px}
  #tslmod .tsl-num{position:absolute;top:24px;right:24px;font-size:.7rem;font-weight:500;letter-spacing:.2em;color:rgba(199,180,137,.55)}
  #tslmod .tsl-logo{display:block;height:32px;width:auto;margin:2px auto 16px}
  #tslmod .tsl-k{display:block;font-size:.56rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#c7b489;margin-bottom:8px;text-shadow:0 1px 2px rgba(0,0,0,.9),0 2px 8px rgba(0,0,0,.8)}
  #tslmod .tsl-h{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;font-size:1.22rem;font-weight:600;letter-spacing:-.012em;line-height:1.15;color:#fff;margin:0 0 11px;text-shadow:0 0 4px rgba(0,0,0,.9),0 1px 3px rgba(0,0,0,.95),0 3px 14px rgba(0,0,0,.9),0 6px 34px rgba(0,0,0,.8)}
  #tslmod .tsl-t{color:rgba(255,255,255,.66);font-size:.84rem;line-height:1.55;margin:0 auto;max-width:32ch;text-shadow:0 1px 2px rgba(0,0,0,.9),0 2px 10px rgba(0,0,0,.85),0 4px 22px rgba(0,0,0,.7)}
  @keyframes tslmod-hb{0%{box-shadow:0 4px 14px rgba(${GLOW},.10),0 0 14px rgba(${GLOW},.10)}18%{box-shadow:0 6px 22px rgba(${GLOW},.30),0 0 46px rgba(${GLOW},.34)}32%{box-shadow:0 5px 18px rgba(${GLOW},.16),0 0 26px rgba(${GLOW},.18)}46%{box-shadow:0 6px 20px rgba(${GLOW},.26),0 0 40px rgba(${GLOW},.28)}72%,100%{box-shadow:0 4px 14px rgba(${GLOW},.10),0 0 14px rgba(${GLOW},.10)}}
  @media(max-width:980px){#tslmod .tsl-grid{grid-template-columns:1fr 1fr}}
  @media(max-width:640px){#tslmod .tsl-grid{grid-template-columns:1fr}}
  @media(prefers-reduced-motion:reduce){#tslmod a.tsl-card{opacity:1;transform:none;transition:none}#tslmod a.tsl-card:hover{transform:none;animation:none;box-shadow:0 0 26px rgba(${GLOW},.25)}}
  `;
  function injectCSS(){ if(document.getElementById('tslmod-css'))return; var s=document.createElement('style'); s.id='tslmod-css'; s.textContent=CSS; document.head.appendChild(s); }
  function build(){
    var root=document.createElement('div'); root.id='tslmod';
    root.innerHTML='<div class="tsl-grid">'+CARDS.map(function(c){
      return '<a class="tsl-card" href="'+c[4]+'" style="--g:'+GLOW+'"><span class="tsl-bg" aria-hidden="true"><img src="'+BASE+c[5]+'" alt="" loading="lazy"></span><span class="tsl-num">'+c[0]+'</span><img class="tsl-logo" src="'+LOGO+'" alt="Tasty Studios" loading="lazy"><span class="tsl-k">'+c[1]+'</span><h3 class="tsl-h">'+c[2]+'</h3><p class="tsl-t">'+c[3]+'</p></a>';
    }).join('')+'</div>';
    return root;
  }
  function setup(root){
    var cards=[].slice.call(root.querySelectorAll('.tsl-card'));
    var io=new IntersectionObserver(function(e){
      if(!e[0].isIntersecting) return;
      cards.forEach(function(c,i){ c.style.transitionDelay=(i*0.06)+'s'; c.classList.add('on'); setTimeout(function(){ c.style.transitionDelay=''; }, i*60+900); });
      io.disconnect();
    },{threshold:.05});
    io.observe(root);
  }
  function mount(){
    if(!on()){ var e=document.getElementById('tslmod'); if(e&&e.parentNode)e.parentNode.removeChild(e); return; }
    var blk=document.getElementById(BLK); if(!blk) return;
    var gal=blk.querySelector('.notion-collection-gallery');
    if(gal) gal.style.display='none';
    if(document.getElementById('tslmod')) return;
    if(!gal) return;
    injectCSS();
    var root=build();
    gal.parentNode.insertBefore(root, gal.nextSibling);
    setup(root);
  }
  function boot(){
    var tries=0;
    var iv=setInterval(function(){ tries++; mount(); if(tries>60) clearInterval(iv); },300);
    new MutationObserver(function(){ mount(); }).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='complete') boot(); else window.addEventListener('load',boot);
})();

/* ---- */

/* lieferpartner-ansprechpartner-lieferantenvertrge — drei Notion-H3 zweifarbig:
   letzter Teil beige via .ts-accent (#c7b489), Muster wie __tsMwzGoal (kein CSS-Delta,
   .ts-accent global). Heading 2 wird zudem inhaltlich von „…als Supporter" auf
   „…immer erreichbar." gesetzt (Notion-Text bleibt Text-SSOT; JS erzwingt die finale
   Darstellung). Block-ID-Anker + Text-Fallback, selbstheilend (React kann Text/Span
   strippen -> debounced Observer zieht nach). */
(function(){
  if(window.__tsLavHead) return; window.__tsLavHead=true;
  function on(){ return /\/lieferpartner-ansprechpartner-lieferantenvertrge\/?$/.test(location.pathname); }
  var HEADS=[
    { id:'block-39bb95465534804084b8e000f830141a', find:'Gute Sortimentserfassung', black:'Gute Sortimentserfassung ', accent:'ist der Schlüssel.' },
    { id:'block-39bb95465534804c91e1c913ae8bd6e2', find:'Deine Ansprechpartner',    black:'Deine Ansprechpartner ',    accent:'immer erreichbar.' },
    { id:'block-39bb9546553480429c8bfc2036324c10', find:'Vertraglich abgesicherte',  black:'Vertraglich abgesicherte ', accent:'Warenflüsse' }
  ];
  function norm(s){ return (s||'').replace(/\s+/g,' ').trim(); }
  function find(h){
    var el=document.getElementById(h.id);
    if(el && el.tagName && el.tagName.charAt(0)==='H') return el;
    var hs=document.querySelectorAll('.page__lieferpartner-ansprechpartner-lieferantenvertrge h3.notion-heading');
    for(var i=0;i<hs.length;i++){ if(norm(hs[i].textContent).indexOf(h.find)===0) return hs[i]; }
    return null;
  }
  function tone(h){
    var el=find(h); if(!el) return;
    var want=norm(h.black+h.accent);
    var accCore=h.accent.replace(/[.!?…]+$/,''), accPunct=h.accent.slice(accCore.length);   /* Satzzeichen bleibt weiss */
    var sp=el.querySelector('.ts-accent');
    if(sp && norm(sp.textContent)===norm(accCore) && norm(el.textContent)===want) return; /* schon gesetzt */
    while(el.firstChild) el.removeChild(el.firstChild);
    el.appendChild(document.createTextNode(h.black));
    var s=document.createElement('span'); s.className='ts-accent'; s.textContent=accCore;
    el.appendChild(s);
    if(accPunct) el.appendChild(document.createTextNode(accPunct));
  }
  function apply(){ if(!on()) return; for(var i=0;i<HEADS.length;i++) tone(HEADS[i]); }
  apply();
  document.addEventListener('DOMContentLoaded', apply);
  var _t=null;
  new MutationObserver(function(){ if(_t) return; _t=setTimeout(function(){ _t=null; apply(); },200); })
    .observe(document.documentElement,{childList:true,subtree:true});
})();



















/* ============================================================================
   #tscover — Zutaten-DB-Erklär-Animationen (Seite /zutatenliste)
   ZWEI getrennte Vollbreite-Blöcke, je: Animation LINKS + Textpanel RECHTS.
   - Block A „Neue Größeneinheit anlegen": Zutat duplizieren -> umbenennen
     (80g Spinat) -> Portionsgröße (1 Kg -> 80 g) -> Hauptzutat-„X" entfernen.
   - Block B „Galerie mit Cover als Vorlage": Neu ▾ -> Neue Vorlage -> /Datenbank
     -> DB IV : Zutaten verknüpfen -> Galerie + Seiten-Cover -> Als Standard.

   Platzierung über Notion-Marker (Vollbreite-Textzeile, NICHT in einer Spalte):
     `groesse-animation`  -> Block A   ·   `vorlage-animation` -> Block B
   Ohne Marker: Fallback = Block A direkt unter dem Warenkorb (#tsshop--db4_zutaten),
   Block B direkt danach. Animation läuft VOLLBREITE (stabil) — nie in einer Notion-
   Spalte (dort Reconciler-Krieg -> Freeze). Der Text rechts liegt daher im Modul.

   Stil: Tasty-Studios + Notion-Dark-Mockup. Accents: Gold #c7b489 · Champagner
   #d8c9ab · Erledigt-Grün rgba(143,203,170). Werte = Beispielwerte.
   TEXT RECHTS = Platzhalter — Robert liefert den finalen Text.
   ============================================================================ */
(function(){
  if(window.__tscover) return; window.__tscover=true;
  var IMG='https://tastyrob123.github.io/kurs/img/zutaten/spinat.jpg';
  var reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function on(){ return /\/zutatenliste\/?$/.test(location.pathname); }

  var CSS=`
  .tscb{width:100vw;max-width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);padding:clamp(18px,3vh,34px) clamp(20px,4vw,56px);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",Helvetica,Arial,sans-serif;color:#fff}
  .tscb *{box-sizing:border-box}
  .tscb .tscb-in{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(28px,4vw,64px);align-items:center}
  .tscb .tscb-in.center{display:block;max-width:720px;text-align:center}
  .tscb .tscb-in.center .tscp-head{text-align:center}
  .tscb .tscb-in.center .tsc-steps{justify-content:center}
  .tscb .tscb-in.center .tsc-stage{max-width:640px;margin:20px auto 0}
  @media(max-width:900px){.tscb .tscb-in{grid-template-columns:1fr;gap:30px}}
  /* Duo: Animationen in Zeile 1 (gleiche Höhe), Texte in Zeile 2 -> Texte + Überschriften auf gleicher Höhe */
  .tscb.tscb-duo{padding-bottom:14px;margin-bottom:-100px}
  @media(max-width:900px){.tscb.tscb-duo{margin-bottom:-40px}}
  .tscb .tscb-duo-grid{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto auto;column-gap:clamp(28px,4vw,60px);row-gap:22px;align-items:start}
  .tscb .tscb-anim{min-width:0;align-self:stretch;display:flex;flex-direction:column}
  .tscb .tscb-anim>.tsc-anim{flex:1 1 auto;display:flex;flex-direction:column;min-width:0}
  .tscb .tscb-anim .tsc-stage{flex:1 1 auto}
  .tscb .tscb-anim .tsc-win{height:100%}
  .tscb .tscb-anim[data-cell="A"]{grid-column:1;grid-row:1}
  .tscb .tsx-center[data-cell="A"]{grid-column:1;grid-row:2}
  .tscb .tscb-anim[data-cell="B"]{grid-column:2;grid-row:1}
  .tscb .tsx-center[data-cell="B"]{grid-column:2;grid-row:2}
  @media(max-width:900px){.tscb .tscb-duo-grid{grid-template-columns:1fr;row-gap:14px}.tscb .tscb-duo-grid>*{grid-column:1!important;grid-row:auto!important}.tscb .tscb-anim[data-cell="B"]{margin-top:28px}}
  .tscb .tscb-anim .tscp-head{text-align:center}
  .tscb .tscb-anim .tsc-steps{justify-content:center}
  .tscb .tsx-center{text-align:center}
  .tscb .tsx-center .tsx-h{margin-bottom:12px}
  .tscb .tsx-center .tsx-p{max-width:440px;margin-left:auto;margin-right:auto}
  .tscb .tsx-center .tsx-p:last-child{margin-bottom:0}
  /* Block A steht als eigene Vollbreite-Sektion unter „Bausteine" (Block B), über „Empfehlung zur Einrichtung" (#tszein) — keine Sonder-Margin mehr */

  /* --- Textpanel rechts --- */
  .tscb .tsx{min-width:0}
  .tscb .tsx-eye{display:inline-flex;align-items:center;gap:9px;font-size:.62rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#c7b489;margin-bottom:14px}
  .tscb .tsx-eye::before{content:"";width:7px;height:7px;border-radius:50%;background:#c7b489;box-shadow:0 0 12px rgba(199,180,137,.7)}
  .tscb .tsx-h{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;font-size:clamp(19px,1.9vw,26px);font-weight:600;letter-spacing:-.02em;line-height:1.14;color:#fff;margin:0 0 14px}
  .tscb .tsx-h span{color:#c7b489}
  .tscb .tsx-p{font-size:15.5px;line-height:1.7;color:#dcdcdc;margin:0 0 16px;max-width:520px}
  .tscb .tsx-p b{color:#fff;font-weight:600}
  .tscb .tsx-left .tsx-p{max-width:560px}
  .tscb .tsx-left .tsx-p:last-child{margin-bottom:0}
  .tscb .tsx-ph{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:rgba(199,180,137,.5);margin-top:6px}

  /* --- Animation links --- */
  .tscb .tsc-anim{min-width:0}
  .tscb .tsc-play{position:absolute;z-index:30;left:50%;top:50%;transform:translate(-50%,-50%);display:inline-flex;align-items:center;gap:10px;padding:11px 20px 11px 15px;border:0;border-radius:999px;cursor:pointer;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;font-size:14px;font-weight:600;color:#0b0d14;background:#c7b489;box-shadow:0 12px 30px -8px rgba(0,0,0,.65),0 0 0 6px rgba(199,180,137,.14);transition:opacity .35s ease,transform .35s cubic-bezier(.16,1,.3,1),box-shadow .3s ease}
  .tscb .tsc-play:hover{transform:translate(-50%,-50%) scale(1.04);box-shadow:0 14px 34px -8px rgba(0,0,0,.75),0 0 0 9px rgba(199,180,137,.2)}
  .tscb .tsc-play .tsc-play-ic{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:rgba(11,13,20,.16)}
  .tscb .tsc-play .tsc-play-ic svg{width:11px;height:11px;margin-left:1px}
  .tscb .tsc-play.playing{opacity:0;pointer-events:none;transform:translate(-50%,-50%) scale(.9)}
  .tscb .tsc-poster{position:absolute;inset:0;z-index:15;border-radius:16px;overflow:hidden;background:#0f0f0f;transition:opacity .45s ease}
  .tscb .tsc-poster img{width:100%;height:100%;object-fit:cover;object-position:center;display:block}
  .tscb .tsc-poster::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,6,11,.12),rgba(5,6,11,.5))}
  .tscb .tsc-stage.playing .tsc-poster{opacity:0;pointer-events:none}
  .tscb .tscp-head{text-align:left;margin-bottom:14px}
  .tscb .tscp-eye{font-size:.58rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:#c7b489}
  .tscb .tscp-title{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;font-size:clamp(20px,1.8vw,26px);font-weight:600;letter-spacing:-.015em;color:#fff;margin:6px 0 0}
  .tscb .tscp-title span{color:#c7b489}
  .tscb .tsc-steps{display:flex;gap:6px;justify-content:flex-start;flex-wrap:wrap;margin:14px 0 0}
  .tscb .tsc-step{display:flex;align-items:center;gap:7px;padding:6px 11px 6px 6px;border-radius:999px;font-size:11.5px;font-weight:500;color:rgba(255,255,255,.42);box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);transition:color .4s ease,box-shadow .4s ease,background .4s ease}
  .tscb .tsc-step .n{width:17px;height:17px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;background:rgba(255,255,255,.1);color:rgba(255,255,255,.55);transition:all .4s ease}
  .tscb .tsc-step .n svg{opacity:0;width:10px;height:10px}
  .tscb .tsc-step.active{color:#fff;background:rgba(199,180,137,.10);box-shadow:inset 0 0 0 1px rgba(199,180,137,.5)}
  .tscb .tsc-step.active .n{background:#c7b489;color:#0b0d14}
  .tscb .tsc-step.done{color:rgba(255,255,255,.72)}
  .tscb .tsc-step.done .n{background:rgba(143,203,170,.92);color:#0b1512}
  .tscb .tsc-step.done .n .num{display:none}
  .tscb .tsc-step.done .n svg{opacity:1}
  .tscb .tsc-stage{position:relative;margin:18px 0 0}
  .tscb .tsc-win{position:relative;border-radius:16px;overflow:hidden;background:#191919;border:1px solid rgba(255,255,255,.09);box-shadow:0 40px 90px -46px rgba(0,0,0,.9),0 0 0 1px rgba(255,255,255,.02),inset 0 1px 0 rgba(255,255,255,.05);opacity:0;transform:translateY(22px) scale(.985);transition:opacity .8s ease,transform .9s cubic-bezier(.16,1,.3,1)}
  .tscb .tsc-anim.on .tsc-win{opacity:1;transform:none}
  .tscb .tsc-cursor{position:absolute;left:0;top:0;width:21px;height:21px;z-index:20;pointer-events:none;filter:drop-shadow(0 3px 5px rgba(0,0,0,.6));opacity:0;transition:opacity .4s ease;will-change:transform}
  .tscb .tsc-anim.on .tsc-cursor{opacity:1}
  .tscb .tsc-cursor.click{animation:tsc-cclick .4s ease}
  @keyframes tsc-cclick{40%{transform:scale(.8)}100%{transform:scale(1)}}
  @keyframes tsc-blink{50%{opacity:0}}
  @keyframes tsc-pop{to{opacity:1;transform:none}}

  /* Panel A Detailkarte */
  .tscb .tsc-cover{position:relative;height:92px;overflow:hidden;background:#0f0f0f}
  .tscb .tsc-cover img{width:100%;height:100%;object-fit:cover;object-position:center 42%;display:block}
  .tscb .tsc-cover::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(25,25,25,.85))}
  .tscb .tsc-pad{padding:14px clamp(16px,1.5vw,24px) 20px}
  .tscb .tsc-titlerow{display:flex;align-items:center;gap:10px;margin:-38px 0 3px;position:relative;z-index:2}
  .tscb .tsc-logo{width:24px;height:24px;flex:0 0 auto;border-radius:6px;background:#111;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.5)}
  .tscb .tsc-h1{position:relative;display:inline-flex;align-items:center;font-size:21px;font-weight:700;letter-spacing:-.015em;color:#fff;padding:2px 6px;margin-left:-6px;border-radius:6px;transition:box-shadow .3s ease,background .3s ease}
  .tscb .tsc-h1.editing{background:rgba(255,255,255,.04);box-shadow:0 0 0 1.5px rgba(199,180,137,.6)}
  .tscb .tsc-h1 .caret,.tscb .tsc-vbox .caret{display:inline-block;width:2px;height:18px;margin-left:1px;background:#c7b489;opacity:0;vertical-align:middle}
  .tscb .tsc-h1.editing .caret,.tscb .tsc-vbox.editing .caret{opacity:1;animation:tsc-blink .9s step-end infinite}
  .tscb .tsc-meta{font-size:12px;color:rgba(255,255,255,.34);margin:0 0 14px 1px}
  .tscb .tsc-rule{height:1px;background:rgba(255,255,255,.08);margin:0 0 14px}
  .tscb .tsc-prop{display:grid;grid-template-columns:150px 1fr;gap:10px;align-items:center;min-height:32px;padding:2px 0}
  .tscb .tsc-plabel{display:flex;align-items:center;gap:8px;font-size:13px;color:rgba(255,255,255,.55)}
  .tscb .tsc-plabel svg{flex:0 0 auto;color:rgba(255,255,255,.38)}
  .tscb .tsc-pval{font-size:13px;color:rgba(255,255,255,.92)}
  .tscb .tsc-vbox{display:inline-flex;align-items:center;min-width:70px;padding:3px 9px;border-radius:6px;transition:box-shadow .3s ease,background .3s ease}
  .tscb .tsc-vbox.editing{background:rgba(255,255,255,.04);box-shadow:0 0 0 1.5px rgba(199,180,137,.6)}
  .tscb .tsc-hi{transition:background .5s ease;border-radius:7px;margin:0 -8px;padding:0 8px}
  .tscb .tsc-hi.flash{background:rgba(199,180,137,.09)}
  .tscb .tsc-tags{display:flex;align-items:center;gap:6px;min-height:24px}
  .tscb .tsc-tag{display:inline-flex;align-items:center;gap:5px;height:22px;padding:0 4px 0 9px;border-radius:5px;background:rgba(255,255,255,.11);font-size:12.5px;font-weight:500;color:#e6e6e6;transform-origin:left center;transition:opacity .35s ease,transform .35s cubic-bezier(.34,1.56,.64,1)}
  .tscb .tsc-tag.out{opacity:0;transform:scale(.5)}
  .tscb .tsc-tagx{display:inline-flex;align-items:center;justify-content:center;width:15px;height:15px;border-radius:4px;color:rgba(255,255,255,.55);transition:background .2s ease}
  .tscb .tsc-tagx svg{width:9px;height:9px}
  .tscb .tsc-tag.hit .tsc-tagx{background:rgba(255,255,255,.22);color:#fff}
  .tscb .tsc-tph{font-size:12.5px;color:rgba(255,255,255,.3);opacity:0;transition:opacity .4s ease .1s;position:absolute}
  .tscb .tsc-tags.empty .tsc-tph{opacity:1;position:static}
  .tscb .tsc-menu{position:absolute;z-index:8;min-width:196px;padding:6px;border-radius:11px;background:#252525;border:1px solid rgba(255,255,255,.10);box-shadow:0 20px 50px -12px rgba(0,0,0,.75);opacity:0;transform:translateY(-6px) scale(.97);transform-origin:top left;pointer-events:none;transition:opacity .2s ease,transform .22s cubic-bezier(.16,1,.3,1)}
  .tscb .tsc-menu.on{opacity:1;transform:none}
  .tscb .tsc-mi{display:flex;align-items:center;gap:10px;padding:7px 9px;border-radius:7px;font-size:13px;color:rgba(255,255,255,.82)}
  .tscb .tsc-mi svg{flex:0 0 auto;color:rgba(255,255,255,.5)}
  .tscb .tsc-mi .kbd{margin-left:auto;font-size:11px;color:rgba(255,255,255,.34)}
  .tscb .tsc-mi .chev{margin-left:auto;color:rgba(255,255,255,.4)}
  .tscb .tsc-mi.dup.hit{background:rgba(199,180,137,.16);color:#fff}
  .tscb .tsc-mdiv{height:1px;background:rgba(255,255,255,.09);margin:5px 4px}
  .tscb .tsc-ghost{position:absolute;inset:0;z-index:5;border-radius:16px;background:rgba(199,180,137,.06);box-shadow:0 0 0 1.5px rgba(199,180,137,.4);opacity:0;pointer-events:none}
  .tscb .tsc-ghost.go{animation:tsc-ghost .7s cubic-bezier(.16,1,.3,1)}
  @keyframes tsc-ghost{0%{opacity:0;transform:translate(0,0) scale(1)}30%{opacity:1}100%{opacity:0;transform:translate(14px,18px) scale(.985)}}
  .tscb .tsc-done{position:absolute;top:12px;right:12px;z-index:6;display:flex;align-items:center;gap:6px;padding:5px 11px 5px 8px;border-radius:999px;background:rgba(143,203,170,.16);box-shadow:inset 0 0 0 1px rgba(143,203,170,.45);color:#bfe6d1;font-size:11.5px;font-weight:600;opacity:0;transform:translateY(-6px) scale(.9)}
  .tscb .tsc-win.finished .tsc-done{animation:tsc-pop .5s cubic-bezier(.34,1.56,.64,1) forwards}
  .tscb .tsc-done .dot{width:16px;height:16px;border-radius:50%;background:rgba(143,203,170,.95);color:#0b1512;display:flex;align-items:center;justify-content:center}
  .tscb[data-block="B"] .tsc-done{display:none}

  /* Panel B Vorlage/Galerie */
  .tscb .tscbb-bar{display:flex;align-items:center;gap:12px;padding:12px clamp(16px,1.5vw,22px);border-bottom:1px solid rgba(255,255,255,.07)}
  .tscb .tscbb-tools{display:flex;align-items:center;gap:13px;color:rgba(255,255,255,.4)}
  .tscb .tscbb-neu{margin-left:auto;display:inline-flex;align-items:center;height:30px;padding:0 12px;border-radius:7px 0 0 7px;background:#2d6ae0;color:#fff;font-size:13.5px;font-weight:600}
  .tscb .tscbb-neuv{display:inline-flex;align-items:center;justify-content:center;height:30px;width:26px;border-radius:0 7px 7px 0;background:#2d6ae0;box-shadow:inset 1px 0 0 rgba(255,255,255,.18);color:#fff}
  .tscb .tscbb-neuv.hit{background:#255ec9}
  .tscb .tscbb-drop{position:absolute;right:clamp(16px,1.5vw,22px);top:52px;z-index:9;width:240px;padding:8px;border-radius:12px;background:#252525;border:1px solid rgba(255,255,255,.10);box-shadow:0 22px 55px -12px rgba(0,0,0,.8);opacity:0;transform:translateY(-6px) scale(.97);transform-origin:top right;pointer-events:none;transition:opacity .2s ease,transform .22s cubic-bezier(.16,1,.3,1)}
  .tscb .tscbb-drop.on{opacity:1;transform:none}
  .tscb .tscbb-drophd{font-size:13px;font-weight:600;color:#fff;padding:4px 8px 2px}
  .tscb .tscbb-dropsub{font-size:11.5px;color:rgba(255,255,255,.42);padding:0 8px 8px;line-height:1.4}
  .tscb .tscbb-dropdiv{height:1px;background:rgba(255,255,255,.09);margin:4px 4px 6px}
  .tscb .tscbb-mi{display:flex;align-items:center;gap:9px;padding:7px 8px;border-radius:7px;font-size:13px;color:rgba(255,255,255,.82)}
  .tscb .tscbb-mi svg{flex:0 0 auto;color:rgba(255,255,255,.5)}
  .tscb .tscbb-mi.hit{background:rgba(199,180,137,.16);color:#fff}
  .tscb .tscbb-stage{position:relative;padding:16px clamp(16px,1.5vw,22px) 18px;min-height:236px}
  .tscb .tscbb-config{position:absolute;left:clamp(16px,1.5vw,22px);right:clamp(16px,1.5vw,22px);top:16px;opacity:1;transition:opacity .5s ease}
  .tscb .tscbb-config.gone{opacity:0;pointer-events:none}
  .tscb .tscbb-row{display:flex;align-items:center;gap:9px;margin-bottom:12px;opacity:0;transform:translateY(6px);transition:opacity .45s ease,transform .45s cubic-bezier(.16,1,.3,1)}
  .tscb .tscbb-row.show{opacity:1;transform:none}
  .tscb .tscbb-slash{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;color:rgba(255,255,255,.9);background:rgba(255,255,255,.05);border-radius:7px;padding:8px 11px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.07);width:100%}
  .tscb .tscbb-slash .cmd{color:#c7b489}
  .tscb .tscbb-slash .caret{display:inline-block;width:2px;height:14px;margin-left:1px;background:#c7b489;vertical-align:-2px;opacity:0}
  .tscb .tscbb-slash.typing .caret{opacity:1;animation:tsc-blink .9s step-end infinite}
  .tscb .tscbb-chip{display:inline-flex;align-items:center;gap:7px;padding:6px 11px;border-radius:7px;background:rgba(199,180,137,.12);box-shadow:inset 0 0 0 1px rgba(199,180,137,.4);font-size:12.5px;font-weight:600;color:#e6dcc4}
  .tscb .tscbb-chip svg{color:#c7b489}
  .tscb .tscbb-lay{display:flex;gap:7px}
  .tscb .tscbb-lc{display:flex;flex-direction:column;align-items:center;gap:5px;width:58px;padding:9px 0;border-radius:9px;background:rgba(255,255,255,.03);box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);font-size:10.5px;color:rgba(255,255,255,.5);transition:all .35s ease}
  .tscb .tscbb-lc svg{color:rgba(255,255,255,.55)}
  .tscb .tscbb-lc.sel{background:rgba(45,106,224,.14);box-shadow:inset 0 0 0 1.5px #4b82e6;color:#fff}
  .tscb .tscbb-lc.sel svg{color:#7aa6f2}
  .tscb .tscbb-prev{display:inline-flex;align-items:center;gap:8px;padding:6px 11px;border-radius:7px;background:rgba(255,255,255,.05);box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);font-size:12px;color:rgba(255,255,255,.7)}
  .tscb .tscbb-prev b{color:#d8c9ab;font-weight:600}
  .tscb .tscbb-gal{position:absolute;left:clamp(16px,1.5vw,22px);right:clamp(16px,1.5vw,22px);top:16px;display:grid;grid-template-columns:1fr 1fr;gap:10px;opacity:0;transform:translateY(8px);transition:opacity .55s ease,transform .6s cubic-bezier(.16,1,.3,1);pointer-events:none}
  .tscb .tscbb-gal.show{opacity:1;transform:none}
  .tscb .tscbb-gc{border-radius:9px;overflow:hidden;background:#212121;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06);opacity:0;transform:scale(.94)}
  .tscb .tscbb-gc.in{animation:tsc-cardin .5s cubic-bezier(.16,1,.3,1) forwards}
  @keyframes tsc-cardin{to{opacity:1;transform:none}}
  .tscb .tscbb-gc .im{height:62px;background:#141414;overflow:hidden}
  .tscb .tscbb-gc .im img{width:100%;height:100%;object-fit:cover;object-position:center 42%;display:block}
  .tscb .tscbb-gc .lb{padding:7px 10px 9px;font-size:12px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .tscb .tscbb-gc.newp{display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.4);font-size:12px;background:transparent;box-shadow:inset 0 0 0 1px rgba(255,255,255,.09);min-height:99px}

  @media(prefers-reduced-motion:reduce){
    .tscb .tsc-win{opacity:1;transform:none;transition:none}
    .tscb .tsc-cursor,.tscb .tsc-menu,.tscb .tscbb-drop,.tscb .tsc-ghost{display:none}
    .tscb .tsc-h1 .caret,.tscb .tsc-vbox .caret,.tscb .tscbb-slash .caret{display:none}
    .tscb .tsc-win .tsc-done{opacity:1;transform:none;animation:none}
    .tscb .tscbb-config{opacity:0}.tscb .tscbb-gal{opacity:1;transform:none}.tscb .tscbb-gc{opacity:1;transform:none;animation:none}
    .tscb .tsc-step{color:rgba(255,255,255,.72)}.tscb .tsc-step .n svg{opacity:1}.tscb .tsc-step .n .num{display:none}.tscb .tsc-step .n{background:rgba(143,203,170,.92);color:#0b1512}
  }`;

  var CURSOR='<svg viewBox="0 0 24 24" width="21" height="21" fill="none"><path d="M5 3l4.5 15 2.3-6.2 6.2-2.3z" fill="#fff" stroke="#0b0d14" stroke-width="1.3" stroke-linejoin="round"/></svg>';
  var CK='<svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.2 4.2L19 7" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var XI='<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
  var WRENCH='<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14.7 6.3a4 4 0 00-5.4 5l-6 6a1.5 1.5 0 002.1 2.1l6-6a4 4 0 005-5.4l-2.5 2.5-2.1-.6-.6-2.1z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';
  var TLOGO='<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M12 6v13" stroke="#e6ddc8" stroke-width="2.4" stroke-linecap="round"/></svg>';
  var FORK='<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M6 3v6a2 2 0 002 2v10M9 3v4M6 3v4M15 3c-1.5 0-2 3-2 5s.5 3 2 3h1V3z M16 3v18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var DB='<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="6" rx="7" ry="3" stroke="currentColor" stroke-width="1.6"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" stroke="currentColor" stroke-width="1.6"/></svg>';
  var FLAG='<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 21V4m0 0h11l-2 4 2 4H6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var GAL='<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.7"/><rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.7"/><rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.7"/><rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.7"/></svg>';
  var TBL='<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="1.6" stroke="currentColor" stroke-width="1.6"/><path d="M3 9h18M3 14h18M9 4v16" stroke="currentColor" stroke-width="1.6"/></svg>';
  var BRD='<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="5" height="16" rx="1.4" stroke="currentColor" stroke-width="1.6"/><rect x="10" y="4" width="5" height="11" rx="1.4" stroke="currentColor" stroke-width="1.6"/><rect x="17" y="4" width="4" height="14" rx="1.4" stroke="currentColor" stroke-width="1.6"/></svg>';
  function svgSm(p){ return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none">'+p+'</svg>'; }
  function step(n,label){ return '<div class="tsc-step" data-step="'+n+'"><span class="n"><span class="num">'+n+'</span>'+CK+'</span>'+label+'</div>'; }
  function txtPanel(t){
    var body=(t.body||[]).map(function(p){return '<p class="tsx-p">'+p+'</p>';}).join('');
    return '<div class="tsx">'+(t.eyebrow?'<div class="tsx-eye">'+t.eyebrow+'</div>':'')+'<h3 class="tsx-h">'+t.h+'</h3>'+body+'</div>';
  }
  /* Block-A-Linkstext: Bausteinprinzip (steht unter „Bausteine", über „Empfehlung zur Einrichtung") */
  var TXT_A={
    h:'Einmal anlegen, <span>überall verwendbar</span>.',
    body:['Jede portionierte Größe – zum Beispiel 80 g Spinat – ist ein eigener Baustein. Du legst ihn einmal an: Zutat duplizieren, Portionsgröße setzen, fertig.','Änderst du diesen Baustein an einer einzigen Stelle, rechnen alle verknüpften Rezepturen und Gerichte sofort korrekt weiter.'] };
  function txtBig(t){ var body=(t.body||[]).map(function(p){return '<p class="tsx-p">'+p+'</p>';}).join(''); return '<div class="tsx tsx-left">'+(t.eyebrow?'<div class="tsx-eye">'+t.eyebrow+'</div>':'')+(t.h?'<h3 class="tsx-h">'+t.h+'</h3>':'')+body+'</div>'; }

  /* ---------- Panel A markup ---------- */
  function menuItem(icon,label,right,cls){ return '<div class="tsc-mi '+(cls||'')+'">'+icon+'<span>'+label+'</span>'+(right||'')+'</div>'; }
  function animA(){
    var chev='<span class="chev">›</span>';
    var menu='<div class="tsc-menu">'+
      menuItem(WRENCH,'Eigenschaft bearbeiten',chev)+
      menuItem(svgSm('<path d="M7 17L17 7M9 7h8v8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'),'Öffnen in',chev)+
      menuItem(svgSm('<path d="M4 5h16v11H9l-4 3v-3H4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>'),'Kommentieren','<span class="kbd">⌘⇧M</span>')+
      menuItem(svgSm('<path d="M9 15l6-6M8 12l-2 2a3 3 0 004 4l2-2M16 12l2-2a3 3 0 00-4-4l-2 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'),'Link kopieren','')+
      '<div class="tsc-mdiv"></div>'+
      menuItem(svgSm('<rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M4 15V5a1 1 0 011-1h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'),'Duplizieren','<span class="kbd">⌘D</span>','dup')+
    '</div>';
    return '<div class="tsc-anim">'+
      '<div class="tscp-head"><div class="tsc-steps">'+step(1,'Duplizieren')+step(2,'Umbenennen')+step(3,'Portionsgröße')+step(4,'Hauptzutat')+'</div></div>'+
      '<div class="tsc-stage">'+
        '<div class="tsc-win">'+
          '<div class="tsc-done"><span class="dot">'+CK+'</span>Neue Größeneinheit</div>'+
          '<div class="tsc-cover"><img src="'+IMG+'" alt="Spinat"></div>'+
          '<div class="tsc-pad">'+
            '<div class="tsc-titlerow"><span class="tsc-logo">'+TLOGO+'</span><span class="tsc-h1"><span class="tsc-h1txt">Spinat</span><span class="caret"></span></span></div>'+
            '<div class="tsc-meta">Details anzeigen · Kommentar hinzufügen</div>'+
            '<div class="tsc-rule"></div>'+
            '<div class="tsc-prop tsc-hi" data-row="portion"><span class="tsc-plabel">'+WRENCH+'Portionsgröße</span><span class="tsc-pval"><span class="tsc-vbox"><span class="tsc-vtxt">1 Kg</span><span class="caret"></span></span></span></div>'+
            '<div class="tsc-prop tsc-hi" data-row="haupt"><span class="tsc-plabel">'+WRENCH+'Hauptzutat</span><span class="tsc-pval"><span class="tsc-tags"><span class="tsc-tag">X<span class="tsc-tagx">'+XI+'</span></span><span class="tsc-tph">Option auswählen</span></span></span></div>'+
            '<div class="tsc-prop"><span class="tsc-plabel">'+FORK+'Kategorie</span><span class="tsc-pval" style="opacity:.6">Blattgemüse</span></div>'+
            menu+
          '</div>'+
          '<div class="tsc-ghost"></div>'+
        '</div>'+
        '<div class="tsc-cursor">'+CURSOR+'</div>'+
      '</div></div>';
  }

  /* ---------- Panel B markup ---------- */
  function galCard(label){ return '<div class="tscbb-gc"><div class="im"><img src="'+IMG+'" alt="'+label+'"></div><div class="lb">'+label+'</div></div>'; }
  function animB(){
    var barTools=[svgSm('<path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>'),
      svgSm('<path d="M7 4v16m0 0l-3-3m3 3l3-3M17 20V4m0 0l-3 3m3-3l3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'),
      svgSm('<path d="M13 3L4 14h7l-1 7 9-11h-7z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>'),
      svgSm('<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.7"/><path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>')].join('');
    var drop='<div class="tscbb-drop">'+
      '<div class="tscbb-drophd">Vorlagen für DB IV : Zutaten</div>'+
      '<div class="tscbb-dropsub">Erstelle eine wiederverwendbare Seitenvorlage für diese Datenbank.</div>'+
      '<div class="tscbb-dropdiv"></div>'+
      '<div class="tscbb-mi" data-mi="neu">'+svgSm('<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>')+'<span>Neue Vorlage</span></div>'+
      '<div class="tscbb-mi" data-mi="std">'+FLAG+'<span>Als Standard festlegen</span></div>'+
    '</div>';
    return '<div class="tsc-anim">'+
      '<div class="tscp-head"><div class="tsc-steps">'+step(1,'Neue Vorlage')+step(2,'Datenbank')+step(3,'Galerie + Cover')+step(4,'Als Standard')+'</div></div>'+
      '<div class="tsc-stage">'+
        '<div class="tsc-win">'+
          '<div class="tscbb-bar"><div class="tscbb-tools">'+barTools+'</div><span class="tscbb-neu">Neu</span><span class="tscbb-neuv">'+svgSm('<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>')+'</span></div>'+
          drop+
          '<div class="tscbb-stage">'+
            '<div class="tscbb-config">'+
              '<div class="tscbb-row" data-r="slash"><div class="tscbb-slash"><span class="cmd">/</span><span class="tscbb-cmdtxt"></span><span class="caret"></span></div></div>'+
              '<div class="tscbb-row" data-r="link"><div class="tscbb-chip">'+DB+'<span>DB IV : Zutaten verknüpft</span></div></div>'+
              '<div class="tscbb-row" data-r="lay"><div class="tscbb-lay">'+
                '<div class="tscbb-lc" data-l="t">'+TBL+'Tabelle</div><div class="tscbb-lc" data-l="b">'+BRD+'Board</div><div class="tscbb-lc" data-l="g">'+GAL+'Galerie</div>'+
              '</div></div>'+
              '<div class="tscbb-row" data-r="prev"><div class="tscbb-prev">Kartenvorschau · <b>Seiten-Cover</b></div></div>'+
            '</div>'+
            '<div class="tscbb-gal">'+galCard('80g Spinat')+galCard('Spinat')+galCard('20g Spinat')+'<div class="tscbb-gc newp">+ Neue Seite</div></div>'+
          '</div>'+
        '</div>'+
        '<div class="tsc-cursor">'+CURSOR+'</div>'+
      '</div></div>';
  }

  var TXT_B={ h:'Bausteine in den <span>Zutaten anzeigen</span>.',
    body:['Erstelle in jeder Hauptzutat eine Übersicht, in der automatisch die Subzutaten (bspw. 80g) angezeigt werden.','Öffne dafür oben rechts Neu → Neue Vorlage → / Neue Datenbankansicht → DB IV : Zutaten verknüpfen und Filter „Name" = Name der Zutat → Cover Ansicht → Als Standard festlegen.'] };
  function centerText(t,key){
    var body=(t.body||[]).map(function(p){return '<p class="tsx-p">'+p+'</p>';}).join('');
    return '<div class="tsx tsx-center" data-cell="'+(key||'')+'">'+(t.h?'<h3 class="tsx-h">'+t.h+'</h3>':'')+body+'</div>';
  }
  var PLAYBTN='<button type="button" class="tsc-play"><span class="tsc-play-ic"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg></span><span class="tsc-play-label">Abspielen</span></button>';

  /* EIN Section: beide Animationen nebeneinander (2 Spalten), Text je zentriert darunter, je eigener Play-Button. */
  function buildDuo(){
    if(!document.getElementById('tscover-css')){ var s=document.createElement('style'); s.id='tscover-css'; s.textContent=CSS; document.head.appendChild(s); }
    var sec=document.createElement('section'); sec.className='tscb tscb-duo'; sec.id='tscb-duo';
    /* DOM-Reihenfolge animA, textA, animB, textB -> mobil (1 Spalte) korrekt gestapelt;
       Desktop: explizite Grid-Platzierung (Animationen Zeile 1, Texte Zeile 2) -> Texte auf gleicher Höhe. */
    sec.innerHTML='<div class="tscb-duo-grid">'+
      '<div class="tscb-anim" data-cell="A">'+animA()+'</div>'+
      centerText(TXT_A,'A')+
      '<div class="tscb-anim" data-cell="B">'+animB()+'</div>'+
      centerText(TXT_B,'B')+
    '</div>';
    [].forEach.call(sec.querySelectorAll('.tsc-stage'), function(st){ st.insertAdjacentHTML('beforeend', '<div class="tsc-poster"><img src="'+IMG+'" alt=""></div>'+PLAYBTN); });
    return sec;
  }

  /* ---------- Timing ---------- */
  function mkClock(){ var timers=[]; return { at:function(ms,fn){ timers.push(setTimeout(fn,ms)); }, clear:function(){ timers.forEach(clearTimeout); timers.length=0; } }; }
  function typeInto(clock,el,text,speed,done){ el.textContent=''; var i=0; (function tick(){ if(i<=text.length){ el.textContent=text.slice(0,i); i++; clock.at((speed||60)+Math.random()*35,tick); } else if(done) done(); })(); }
  function moveCursor(cur,x,y,dur){ cur.style.transition='transform '+dur+'ms cubic-bezier(.5,0,.2,1)'; cur.style.transform='translate('+x+'px,'+y+'px)'; }
  function relPos(stage,el,dx,dy){ var sr=stage.getBoundingClientRect(), er=el.getBoundingClientRect(); return [er.left-sr.left+(dx||0), er.top-sr.top+(dy||0)]; }
  function setStep(p,n,state){ var el=p.querySelector('.tsc-step[data-step="'+n+'"]'); if(!el)return; el.classList.remove('active','done'); if(state)el.classList.add(state); }
  /* super.so setzt teils !important-Regeln, die unsere Stylesheet-Regeln schlagen -> Sichtbarkeit inline erzwingen */
  function reveal(p){ var w=p.querySelector('.tsc-win'); if(w){ w.style.setProperty('transition','none','important'); w.style.setProperty('opacity','1','important'); w.style.setProperty('transform','none','important'); } var c=p.querySelector('.tsc-cursor'); if(c) c.style.setProperty('opacity','1','important'); }

  function playA(p,opts){
    if(p.__clock) p.__clock.clear(); var clock=mkClock(); p.__clock=clock;
    reveal(p);
    var stage=p.querySelector('.tsc-stage'), win=p.querySelector('.tsc-win'), cursor=p.querySelector('.tsc-cursor'),
        menu=p.querySelector('.tsc-menu'), ghost=p.querySelector('.tsc-ghost'),
        h1=p.querySelector('.tsc-h1'), h1txt=p.querySelector('.tsc-h1txt'),
        pRow=p.querySelector('[data-row="portion"]'), vbox=pRow.querySelector('.tsc-vbox'), vtxt=pRow.querySelector('.tsc-vtxt'),
        hRow=p.querySelector('[data-row="haupt"]'), tags=hRow.querySelector('.tsc-tags'), tag=hRow.querySelector('.tsc-tag'), tagx=hRow.querySelector('.tsc-tagx');
    p.classList.add('on');
    h1txt.textContent='Spinat'; h1.classList.remove('editing'); vtxt.textContent='1 Kg'; vbox.classList.remove('editing');
    tag.classList.remove('out','hit'); tags.classList.remove('empty'); win.classList.remove('finished'); menu.classList.remove('on');
    [1,2,3,4].forEach(function(n){ setStep(p,n,null); }); pRow.classList.remove('flash'); hRow.classList.remove('flash');
    if(opts&&opts.idle){ if(cursor)cursor.style.setProperty('opacity','0','important'); return; }
    if(reduced){ setStep(p,1,'done');setStep(p,2,'done');setStep(p,3,'done');setStep(p,4,'done'); h1txt.textContent='80g Spinat'; vtxt.textContent='80 g'; tag.classList.add('out'); tags.classList.add('empty'); win.classList.add('finished'); if(opts&&opts.onEnd) opts.onEnd(); return; }
    var at=clock.at, sw=stage.getBoundingClientRect().width, sh=stage.getBoundingClientRect().height;
    cursor.style.transition='none'; cursor.style.transform='translate('+(sw*0.7)+'px,'+(sh+40)+'px)';
    at(400,function(){ setStep(p,1,'active'); var q=relPos(stage,h1,36,6); moveCursor(cursor,q[0],q[1],700); });
    at(1150,function(){ var tr=relPos(stage,p.querySelector('.tsc-titlerow'),16,34); menu.style.left=tr[0]+'px'; menu.style.top=tr[1]+'px'; menu.classList.add('on');
      /* Menü darf nie unten aus der Karte ragen -> dynamisch hochklemmen */
      var wr=win.getBoundingClientRect(), mr=menu.getBoundingClientRect(); var over=mr.bottom-(wr.bottom-12);
      if(over>0) menu.style.top=(tr[1]-over)+'px';
    });
    at(1400,function(){ var dup=menu.querySelector('.tsc-mi.dup'); var q=relPos(stage,dup,24,12); moveCursor(cursor,q[0],q[1],540); });
    at(1980,function(){ menu.querySelector('.tsc-mi.dup').classList.add('hit'); cursor.classList.add('click'); });
    at(2120,function(){ cursor.classList.remove('click'); });
    at(2260,function(){ menu.classList.remove('on'); ghost.classList.add('go'); h1txt.textContent='Spinat (1)'; });
    at(2560,function(){ ghost.classList.remove('go'); setStep(p,1,'done'); });
    at(2760,function(){ setStep(p,2,'active'); var q=relPos(stage,h1,36,6); moveCursor(cursor,q[0],q[1],420); });
    at(3200,function(){ h1.classList.add('editing'); });
    at(3360,function(){ typeInto(clock,h1txt,'80g Spinat',62); });
    at(4560,function(){ h1.classList.remove('editing'); setStep(p,2,'done'); });
    at(4760,function(){ setStep(p,3,'active'); pRow.classList.add('flash'); var q=relPos(stage,vbox,28,12); moveCursor(cursor,q[0],q[1],460); });
    at(5260,function(){ vbox.classList.add('editing'); });
    at(5420,function(){ typeInto(clock,vtxt,'80 g',75); });
    at(6100,function(){ vbox.classList.remove('editing'); pRow.classList.remove('flash'); setStep(p,3,'done'); });
    at(6320,function(){ setStep(p,4,'active'); hRow.classList.add('flash'); var q=relPos(stage,tagx,6,7); moveCursor(cursor,q[0],q[1],500); });
    at(6870,function(){ tag.classList.add('hit'); cursor.classList.add('click'); });
    at(7010,function(){ cursor.classList.remove('click'); tag.classList.add('out'); });
    at(7360,function(){ tags.classList.add('empty'); hRow.classList.remove('flash'); setStep(p,4,'done'); });
    at(7700,function(){ win.classList.add('finished'); moveCursor(cursor,sw*0.72,sh+40,700); });
    at(8600,function(){ if(opts&&opts.onEnd) opts.onEnd(); });
  }

  function playB(p,opts){
    if(p.__clock) p.__clock.clear(); var clock=mkClock(); p.__clock=clock; var at=clock.at;
    reveal(p);
    var stage=p.querySelector('.tsc-stage'), win=p.querySelector('.tsc-win'), cursor=p.querySelector('.tsc-cursor'),
        neuv=p.querySelector('.tscbb-neuv'), drop=p.querySelector('.tscbb-drop'),
        miNeu=p.querySelector('.tscbb-mi[data-mi="neu"]'), miStd=p.querySelector('.tscbb-mi[data-mi="std"]'),
        config=p.querySelector('.tscbb-config'),
        rSlash=p.querySelector('.tscbb-row[data-r="slash"]'), cmdtxt=p.querySelector('.tscbb-cmdtxt'), slashBox=p.querySelector('.tscbb-slash'),
        rLink=p.querySelector('.tscbb-row[data-r="link"]'), rLay=p.querySelector('.tscbb-row[data-r="lay"]'), rPrev=p.querySelector('.tscbb-row[data-r="prev"]'),
        lcG=p.querySelector('.tscbb-lc[data-l="g"]'), gal=p.querySelector('.tscbb-gal'), gcs=p.querySelectorAll('.tscbb-gc');
    p.classList.add('on');
    [1,2,3,4].forEach(function(n){ setStep(p,n,null); }); drop.classList.remove('on'); miNeu.classList.remove('hit'); miStd.classList.remove('hit');
    config.classList.remove('gone'); [rSlash,rLink,rLay,rPrev].forEach(function(r){ r.classList.remove('show'); }); cmdtxt.textContent=''; slashBox.classList.remove('typing');
    lcG.classList.remove('sel'); gal.classList.remove('show'); [].forEach.call(gcs,function(c){ c.classList.remove('in'); });
    if(opts&&opts.idle){ if(cursor)cursor.style.setProperty('opacity','0','important'); return; }
    if(reduced){ setStep(p,1,'done');setStep(p,2,'done');setStep(p,3,'done');setStep(p,4,'done'); config.classList.add('gone'); gal.classList.add('show'); [].forEach.call(gcs,function(c){ c.classList.add('in'); }); lcG.classList.add('sel'); if(opts&&opts.onEnd) opts.onEnd(); return; }
    var sw=stage.getBoundingClientRect().width, sh=stage.getBoundingClientRect().height;
    cursor.style.transition='none'; cursor.style.transform='translate('+(sw*0.5)+'px,'+(sh+40)+'px)';
    at(400,function(){ setStep(p,1,'active'); var q=relPos(stage,neuv,7,7); moveCursor(cursor,q[0],q[1],680); });
    at(1120,function(){ neuv.classList.add('hit'); cursor.classList.add('click'); });
    at(1260,function(){ cursor.classList.remove('click'); neuv.classList.remove('hit'); drop.classList.add('on'); });
    at(1500,function(){ var q=relPos(stage,miNeu,22,10); moveCursor(cursor,q[0],q[1],460); });
    at(2000,function(){ miNeu.classList.add('hit'); cursor.classList.add('click'); });
    at(2160,function(){ cursor.classList.remove('click'); drop.classList.remove('on'); setStep(p,1,'done'); });
    at(2420,function(){ setStep(p,2,'active'); rSlash.classList.add('show'); var q=relPos(stage,slashBox,30,12); moveCursor(cursor,q[0],q[1],460); });
    at(2820,function(){ slashBox.classList.add('typing'); typeInto(clock,cmdtxt,'Datenbank – Tabellenansicht',44); });
    at(4200,function(){ slashBox.classList.remove('typing'); rLink.classList.add('show'); });
    at(4700,function(){ setStep(p,2,'done'); });
    at(4950,function(){ setStep(p,3,'active'); rLay.classList.add('show'); });
    at(5350,function(){ var q=relPos(stage,lcG,28,20); moveCursor(cursor,q[0],q[1],500); });
    at(5900,function(){ cursor.classList.add('click'); lcG.classList.add('sel'); });
    at(6040,function(){ cursor.classList.remove('click'); });
    at(6300,function(){ rPrev.classList.add('show'); });
    at(6800,function(){ setStep(p,3,'done'); });
    at(7050,function(){ config.classList.add('gone'); });
    at(7350,function(){ setStep(p,4,'active'); gal.classList.add('show'); [].forEach.call(gcs,function(c,i){ clock.at(i*130,function(){ c.classList.add('in'); }); }); });
    at(8100,function(){ var q=relPos(stage,neuv,7,7); moveCursor(cursor,q[0],q[1],520); });
    at(8700,function(){ neuv.classList.add('hit'); cursor.classList.add('click'); });
    at(8840,function(){ cursor.classList.remove('click'); neuv.classList.remove('hit'); drop.classList.add('on'); });
    at(9100,function(){ var q=relPos(stage,miStd,22,10); moveCursor(cursor,q[0],q[1],440); });
    at(9600,function(){ miStd.classList.add('hit'); cursor.classList.add('click'); });
    at(9760,function(){ cursor.classList.remove('click'); drop.classList.remove('on'); setStep(p,4,'done'); });
    at(10100,function(){ moveCursor(cursor,sw*0.5,sh+40,700); });
    at(11000,function(){ if(opts&&opts.onEnd) opts.onEnd(); });
  }

  /* Kein Autoplay: Idle-Poster + Play-Button JE Kachel, Animation läuft EINMAL auf Klick. */
  function armCell(cell, playFn){
    var panel=cell.querySelector('.tsc-anim'), btn=cell.querySelector('.tsc-play'), stage=cell.querySelector('.tsc-stage');
    playFn(panel,{idle:true});
    if(!btn) return;
    var playing=false;
    function label(t){ var l=btn.querySelector('.tsc-play-label'); if(l) l.textContent=t; }
    btn.addEventListener('click',function(){
      if(playing) return; playing=true; btn.classList.add('playing'); if(stage) stage.classList.add('playing');
      playFn(panel,{onEnd:function(){ playing=false; label('Erneut abspielen'); btn.classList.remove('playing'); if(stage) stage.classList.remove('playing'); }});
    });
  }
  function armDuo(sec){
    if(sec.__armed) return; sec.__armed=true;
    var cA=sec.querySelector('.tscb-anim[data-cell="A"]'); if(cA) armCell(cA, function(el,o){playA(el,o);});
    var cB=sec.querySelector('.tscb-anim[data-cell="B"]'); if(cB) armCell(cB, function(el,o){playB(el,o);});
  }

  function mount(){
    if(!on()){ var e=document.getElementById('tscb-duo'); if(e&&e.parentNode)e.parentNode.removeChild(e); return; }
    if(document.getElementById('tscb-duo')) return;
    /* EIN Duo-Block direkt UNTER die "Empfehlung zur Einrichtung"-Box (#tszein):
       Animation A | Animation B nebeneinander, Text je zentriert darunter. */
    var zein=document.getElementById('tszein'); if(!zein || !zein.parentNode) return;
    var sec=buildDuo();
    zein.parentNode.insertBefore(sec, zein.nextSibling);
    armDuo(sec);
  }
  function boot(){
    var tries=0; var iv=setInterval(function(){ tries++; mount(); if(tries>50)clearInterval(iv); },300);
    var _mt=null;
    new MutationObserver(function(){ if(_mt)return; _mt=setTimeout(function(){ _mt=null; mount(); },250); }).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='complete') boot(); else window.addEventListener('load',boot);
})();

/* ============================================================
   #tszmac — MacBook-Scroll (zutatenliste), Muster wie #ts2mac
   (Lieferpartner). STATISCHE Kachel (nur CSS-Hover) -> darf in
   einer Notion-Spalte leben (kein Reconciler-Krieg).
   Robert legt ein 2-Spalten-Layout an: LINKS sein Text, RECHTS
   eine Zeile mit dem Marker `zutat-laptop`. Der Laptop ersetzt
   den Marker in DER Spalte -> Laptop rechts, Text links.
   Klick auf den PC -> Lightbox mit langem Screenshot zum Scrollen.
   Bilder: img/zutaten-mac/pc.png (freigestellt) + scroll.jpg.
   ============================================================ */
(function(){
  if(window.__tszmac) return; window.__tszmac=true;
  var PATH=/\/zutatenliste\/?$/;
  var MARKER='zutat-laptop';
  var FRAME='https://files.catbox.moe/oj1wa9.png';   /* leerer MacBook-Rahmen (wie #ts2mac) */
  var IMG='https://tastyrob123.github.io/kurs/img/zutaten-mac/pc.png';
  var SHOT='https://tastyrob123.github.io/kurs/img/zutaten-mac/scroll.jpg';
  var CAP='Meine Zutaten · DB-Ansicht';

  var CSS=`
  .tszmac-incol{display:flex;flex-direction:column;justify-content:center;align-items:center}
  .tszmac-pc{width:100%;display:flex;flex-direction:column;align-items:center;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif}
  .tszmac-tile{width:100%;max-width:520px;cursor:pointer;border-radius:12px;filter:drop-shadow(0 18px 44px rgba(0,0,0,.5));transition:transform .5s cubic-bezier(.16,1,.3,1),filter .5s cubic-bezier(.16,1,.3,1)}
  .tszmac-tile img{width:100%;height:auto;display:block}
  .tszmac-tile:hover,.tszmac-tile:focus-visible{transform:translateY(-4px) scale(1.02);animation:tszmacHb 2.6s cubic-bezier(.16,1,.3,1) infinite;outline:none}
  @keyframes tszmacHb{0%,100%{filter:drop-shadow(0 22px 52px rgba(0,0,0,.6)) drop-shadow(0 6px 18px rgba(199,180,137,.14))}50%{filter:drop-shadow(0 22px 52px rgba(0,0,0,.6)) drop-shadow(0 8px 26px rgba(199,180,137,.30))}}
  .tszmac-tile:active{transform:scale(.99);transition-duration:.12s}
  .tszmac-cap{width:100%;text-align:center;font-size:15px;font-weight:600;letter-spacing:.005em;color:#fff;margin-top:14px}
  .tszmac-cap .g{color:#c7b489}
  .tszmac-hint{font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.32);margin-top:6px;animation:tszmacHint 2.5s ease-in-out infinite}
  @keyframes tszmacHint{0%,100%{opacity:.4}50%{opacity:.8}}
  #tszmac-lb{position:fixed;inset:0;z-index:99999;display:none;flex-direction:column;align-items:center;justify-content:center;background:rgba(5,6,11,.92);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);padding:clamp(16px,4vw,40px);opacity:0;transition:opacity .3s ease;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif}
  #tszmac-lb.open{display:flex;opacity:1}
  #tszmac-lb .tszmac-inner{position:relative;width:100%;max-width:min(960px,calc(100vw - 48px));transform:scale(.92) translateY(24px);transition:transform .5s cubic-bezier(.16,1,.3,1)}
  #tszmac-lb.open .tszmac-inner{transform:none}
  #tszmac-lb.full .tszmac-inner{max-width:100vw}
  #tszmac-lb .tszmac-mockup{position:relative;width:100%;aspect-ratio:1366/768;filter:drop-shadow(0 30px 80px rgba(0,0,0,.6)) drop-shadow(0 10px 30px rgba(0,0,0,.5))}
  #tszmac-lb .tszmac-fr{position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none;user-select:none}
  #tszmac-lb .tszmac-screen{position:absolute;top:3.65%;left:12.22%;width:73.06%;height:83.85%;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;z-index:3;border-radius:3px;background:#191919;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.16) transparent}
  #tszmac-lb .tszmac-screen::-webkit-scrollbar{width:5px}
  #tszmac-lb .tszmac-screen::-webkit-scrollbar-thumb{background:rgba(255,255,255,.16);border-radius:4px}
  #tszmac-lb .tszmac-screen img{width:100%;display:block}
  #tszmac-lb .tszmac-closehint{margin-top:20px;font-size:12px;letter-spacing:.1em;color:rgba(255,255,255,.32);text-align:center}
  #tszmac-lb.full .tszmac-closehint{display:none}
  #tszmac-lb .tszmac-btn{position:absolute;top:16px;z-index:10;width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.6);cursor:pointer;display:flex;align-items:center;justify-content:center;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);transition:background .2s,color .2s}
  #tszmac-lb .tszmac-btn:hover{background:rgba(255,255,255,.16);color:#fff}
  #tszmac-lb .tszmac-expand{left:16px}#tszmac-lb .tszmac-closex{right:16px}
  @media(prefers-reduced-motion:reduce){.tszmac-tile,.tszmac-tile:hover{animation:none;transition:none}.tszmac-hint{animation:none}}
  `;
  function injectCSS(){ if(document.getElementById('tszmac-css'))return; var s=document.createElement('style'); s.id='tszmac-css'; s.textContent=CSS; document.head.appendChild(s); }
  function shutFull(){ var lb=document.getElementById('tszmac-lb'); if(lb) lb.classList.remove('open','full'); document.body.style.overflow=''; }
  function ensureLb(){
    var lb=document.getElementById('tszmac-lb'); if(lb) return lb;
    lb=document.createElement('div'); lb.id='tszmac-lb';
    lb.innerHTML='<button class="tszmac-btn tszmac-expand" title="Vollbild" aria-label="Vollbild"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="tszmac-btn tszmac-closex" title="Schließen" aria-label="Schließen"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4.5 4.5l9 9M13.5 4.5l-9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button><div class="tszmac-inner"><div class="tszmac-mockup"><img class="tszmac-fr" src="'+FRAME+'" alt="MacBook"><div class="tszmac-screen"><img src="'+SHOT+'" alt="'+CAP+'"></div></div></div><div class="tszmac-closehint">✕ Klicke daneben oder ESC zum Schließen</div>';
    document.body.appendChild(lb);
    var inner=lb.querySelector('.tszmac-inner');
    lb.querySelector('.tszmac-closex').addEventListener('click',shutFull);
    lb.querySelector('.tszmac-expand').addEventListener('click',function(e){ e.stopPropagation(); lb.classList.toggle('full'); });
    inner.addEventListener('click',function(e){ e.stopPropagation(); });
    lb.addEventListener('click',function(e){ if(e.target===lb) shutFull(); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') shutFull(); });
    return lb;
  }
  function openLb(){ var lb=ensureLb(); lb.classList.add('open'); lb.classList.remove('full'); document.body.style.overflow='hidden'; var sc=lb.querySelector('.tszmac-screen'); if(sc) sc.scrollTop=0; }
  function buildPc(){
    var pc=document.createElement('div'); pc.className='tszmac-pc';
    pc.innerHTML='<div class="tszmac-tile" role="button" tabindex="0" aria-label="'+CAP+' vergrößern"><img src="'+IMG+'" alt="'+CAP+'" loading="lazy" decoding="async"></div>'
      +'<div class="tszmac-cap">'+CAP+'<span class="g"> – Live Beispiel</span></div>'
      +'<div class="tszmac-hint">Klicke zum Vergrößern</div>';
    var tile=pc.querySelector('.tszmac-tile');
    tile.addEventListener('click',openLb);
    tile.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openLb(); } });
    return pc;
  }
  /* leere Blatt-Zeile mit MARKER-Text -> ihre Notion-Spalte ist das Ziel */
  function markerCol(){
    var lists=document.querySelectorAll('.notion-column-list');
    for(var L=0;L<lists.length;L++){
      var all=lists[L].querySelectorAll('.notion-text');
      for(var i=0;i<all.length;i++){
        /* tolerant: trim + lowercase + führende/abschließende Nicht-Marker-Zeichen weg
           (Inline-Code, Punkt, Leerzeichen etc.) */
        var t=(all[i].textContent||'').trim().toLowerCase().replace(/^[^a-z]+/,'').replace(/[^a-z-]+$/,'');
        if(t===MARKER){
          var col=all[i].closest('.notion-column'); if(!col) continue;
          var mk=all[i]; while(mk.parentElement && mk.parentElement!==col) mk=mk.parentElement;
          return { col:col, marker:(mk&&mk!==col)?mk:all[i] };
        }
      }
    }
    return null;
  }
  function mount(){
    if(!PATH.test(location.pathname)){ var r=document.getElementById('tszmac-lb'); if(r&&r.parentNode)r.parentNode.removeChild(r); return; }
    injectCSS();
    /* schon montiert und noch im DOM? dann nichts tun (selbstheilend, falls React die Spalte neu rendert) */
    var existing=document.querySelector('.tszmac-pc'); if(existing && existing.closest('.notion-column')) return;
    var m=markerCol(); if(!m) return;
    var col=m.col, tgt=col.querySelector('.notion-column__content')||col;
    if(tgt.querySelector('.tszmac-pc')) return;
    col.classList.add('tszmac-incol');
    if(m.marker && m.marker.classList && !m.marker.classList.contains('notion-column') && !m.marker.classList.contains('notion-column-list')) m.marker.style.display='none';
    var list=col.closest('.notion-column-list'); if(list) list.style.alignItems='center';
    tgt.appendChild(buildPc());
  }
  function boot(){
    var tries=0;
    var iv=setInterval(function(){ tries++; mount(); if(tries>80) clearInterval(iv); },300);
    new MutationObserver(function(){ mount(); }).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='complete') boot(); else window.addEventListener('load',boot);
})();

/* ============================================================
   rezepturen — Section-Heading "Rezepturen als weiterer Baustein"
   auf den Referenz-Stil bringen (identisch zu "Deine Ansprech-
   partner immer erreichbar." auf /lieferpartner): Lineal TS,
   30px / line-height 34.5 / letter-spacing -.6px / weight 600,
   weiss + letzter Teil "weiterer Baustein" beige (.ts-accent
   #c7b489). Block-ID-Anker + Text-Fallback, selbstheilend
   (React strippt Span/Text -> debounced Observer zieht nach).
   ============================================================ */
(function(){
  if(window.__tsRezHead) return; window.__tsRezHead=true;
  var ID='block-e4ac26e9734d40888bc1dc22849f8d73';
  var FIND='Rezepturen als weiterer Baustein', BLACK='Rezepturen als ', ACCENT='weiterer Baustein';
  var CSS='.page__rezepturen #'+ID+'{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif !important;font-size:30px !important;line-height:34.5px !important;letter-spacing:-.6px !important;font-weight:600 !important;color:#fff !important}';
  function on(){ return /\/rezepturen\/?$/.test(location.pathname); }
  function injectCSS(){ if(document.getElementById('tsRezHead-css'))return; var s=document.createElement('style'); s.id='tsRezHead-css'; s.textContent=CSS; document.head.appendChild(s); }
  function norm(s){ return (s||'').replace(/\s+/g,' ').trim(); }
  function find(){
    var el=document.getElementById(ID);
    if(el && el.tagName && el.tagName.charAt(0)==='H') return el;
    var hs=document.querySelectorAll('.page__rezepturen .notion-heading');
    for(var i=0;i<hs.length;i++){ if(norm(hs[i].textContent).indexOf(FIND)===0) return hs[i]; }
    return null;
  }
  function tone(){
    var el=find(); if(!el) return;
    var want=norm(BLACK+ACCENT);
    var sp=el.querySelector('.ts-accent');
    if(sp && norm(sp.textContent)===norm(ACCENT) && norm(el.textContent)===want) return;
    while(el.firstChild) el.removeChild(el.firstChild);
    el.appendChild(document.createTextNode(BLACK));
    var s=document.createElement('span'); s.className='ts-accent'; s.textContent=ACCENT;
    el.appendChild(s);
  }
  function apply(){ if(!on()) return; injectCSS(); tone(); }
  apply();
  document.addEventListener('DOMContentLoaded', apply);
  var _t=null;
  new MutationObserver(function(){ if(_t) return; _t=setTimeout(function(){ _t=null; apply(); },200); })
    .observe(document.documentElement,{childList:true,subtree:true});
})();

/* ============================================================
   #tsd5 — REZEPTUR-RECHNER (DB V) · /rezepturen
   Interaktive Demo des Intro-Konzepts: Rezeptur zieht ihre
   Zutaten (Bausteine, freigestellte Tasty-Produktbilder) →
   summiert Gesamtmenge (g) + Rohstoffkosten → Portionsgröße
   teilt alles auf: Anzahl Portionen, Preis/Portion, Menge je
   Zutat/Portion, plus Nährwerte/Portion + Allergene. Live-
   Neuberechnung. Header = Hero-Komposition (Pesto-Glas + Logo,
   Titel "Basilikum Pesto" im unteren Bilddrittel). Stil nach
   #tsd4/Hero. Mount vor "Der Aufbau — Schritt für Schritt"
   (block-394b9546553480c785e7d4785453354f).
   Zahlen = Beispielwerte (Basilikum-Pesto). Bilder freigestellt
   (remove_background) aus den Tasty-Zutaten/Inventar-Fotos.
   ============================================================ */
(function(){
  if(window.__tsd5) return; window.__tsd5=true;

  var IMGBASE='https://tastyrob123.github.io/kurs/img/zutaten-cut/';
  var JAR='https://tastyrob123.github.io/kurs/img/zutaten-cut/pesto-glas.png';
  var LOGO='https://files.catbox.moe/au80tp.png';
  var RECIPE={
    name:'Basilikum-Pesto',
    items:[
      {n:'Basilikum',   g:50, p:24.00, img:'basilikum.png'},
      {n:'Parmesan',    g:40, p:18.00, img:'parmesan.png'},
      {n:'Pinienkerne', g:30, p:42.00, img:'pinienkerne.png'},
      {n:'Olivenöl',    g:90, p:9.80,  img:'olivenoel.png'},
      {n:'Knoblauch',   g:8,  p:6.00,  img:'knoblauch.png'},
      {n:'Meersalz',    g:2,  p:2.90,  img:'meersalz.png'}
    ]
  };
  /* Nährwerte je 100 g fertige Rezeptur (Beispielwerte) → skalieren mit der Portionsgröße */
  var NUT={kcal:460, fett:45, kh:4, protein:7};
  var ALLERGENE=['Milch','Schalenfrüchte'];
  var DEFAULT_PORTION=25, MIN_P=10, MAX_P=60;

  function totalG(){ return RECIPE.items.reduce(function(s,i){return s+i.g;},0); }
  function totalCost(){ return RECIPE.items.reduce(function(s,i){return s+i.g/1000*i.p;},0); }
  function nf(v,dec){ return (v).toFixed(dec).replace('.',','); }
  function nfP(v){ return (Math.abs(v-Math.round(v))<1e-6)?String(Math.round(v)):nf(v,1); } /* Portionen: ganze Zahl ohne ,0 */
  function MINPORT(){ return Math.max(2, Math.ceil(totalG()/MAX_P)); } /* min. Portionen, damit Portionsgröße ≤ MAX_P */
  function MAXPORT(){ return Math.floor(totalG()/MIN_P); }             /* max. Portionen, damit Portionsgröße ≥ MIN_P */

  var CSS=`
  #tsd5{width:min(1180px,94vw);margin:26px auto 62px;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;color:#fff;opacity:0;transform:translateY(20px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)}
  #tsd5.in{opacity:1;transform:none}
  /* Header — Hero-Komposition (Pesto-Glas + Logo + Titel im unteren Bilddrittel) */
  #tsd5 .d5-head{position:relative;text-align:center;margin:0 0 34px;isolation:isolate}
  #tsd5 .d5-hero{position:relative;display:block;width:min(470px,84%);margin:0 auto}
  #tsd5 .d5-jar{display:block;width:100%;height:auto;object-fit:contain;filter:contrast(1.05) saturate(1.06);pointer-events:none;user-select:none}
  #tsd5 .d5-herotext{position:relative;z-index:2;margin-top:-33%;padding:0 8px 4px}
  #tsd5 .d5-logo{display:block;width:46px;height:auto;margin:0 auto 12px;filter:drop-shadow(0 2px 8px rgba(0,0,0,.95)) drop-shadow(0 6px 24px rgba(0,0,0,.85));pointer-events:none;user-select:none}
  #tsd5 .d5-title{margin:0;font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;font-weight:600;line-height:1.03;letter-spacing:-.02em;font-size:clamp(2.1rem,5.4vw,3.4rem);text-shadow:0 0 4px rgba(0,0,0,.55),0 2px 5px rgba(0,0,0,.9),0 5px 16px rgba(0,0,0,.6)}
  #tsd5 .d5-title .basil{color:#7c7200}
  #tsd5 .d5-title .pesto{color:#fff}
  #tsd5 .d5-sub{max-width:660px;margin:20px auto 0;font-size:15.5px;line-height:1.62;color:#fff}
  #tsd5 .d5-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:22px;align-items:stretch}
  /* High-End Karten: sanfter Verlauf, Gold-Hairline, Tiefe + Glas-Kante oben */
  #tsd5 .d5-card{position:relative;border-radius:22px;padding:28px 26px 24px 20px;background:linear-gradient(180deg,rgba(255,255,255,.052),rgba(255,255,255,.022));border:1px solid rgba(199,180,137,.24);box-shadow:0 30px 80px -28px rgba(0,0,0,.72),inset 0 1px 0 rgba(255,255,255,.07);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px)}
  /* Rechte Karte Überschrift — zentriert, weiss */
  #tsd5 .d5-rhead{text-align:center;font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,sans-serif;font-size:27px;font-weight:600;color:#fff;letter-spacing:-.01em;margin:2px 0 22px}
  /* Bausteine-Zeilen mit freigestelltem Produktbild (viel größer) */
  #tsd5 .d5-item{display:grid;grid-template-columns:108px 1fr auto;align-items:center;gap:18px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.055);opacity:0;transform:translateX(-14px);transition:opacity .5s cubic-bezier(.16,1,.3,1),transform .55s cubic-bezier(.16,1,.3,1)}
  #tsd5 .d5-item:first-child{padding-top:2px}
  #tsd5 .d5-item:last-child{border-bottom:0}
  #tsd5.in .d5-item{opacity:1;transform:none}
  #tsd5 .d5-thumb{width:108px;height:108px;object-fit:contain;object-position:center;filter:drop-shadow(0 8px 18px rgba(0,0,0,.6));flex-shrink:0}
  #tsd5 .d5-item .nm{font-size:22px;font-weight:600;letter-spacing:-.01em;color:#fff}
  #tsd5 .d5-item .nm small{display:block;font-size:13.5px;color:rgba(255,255,255,.46);font-weight:400;letter-spacing:.01em;margin-top:4px}
  #tsd5 .d5-item .qty{text-align:right;white-space:nowrap}
  #tsd5 .d5-item .qty .q1{font-size:19px;font-weight:600;color:#fff}
  #tsd5 .d5-item .qty .q2{font-size:13px;color:rgba(255,255,255,.46);margin-top:3px}
  #tsd5 .d5-item .qty .q2 b{color:#c7b489;font-weight:600}
  /* Summen-Fuß — zentriert, edel */
  #tsd5 .d5-sums{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:20px}
  #tsd5 .d5-sum{border-radius:16px;padding:16px 14px;background:linear-gradient(180deg,rgba(199,180,137,.1),rgba(199,180,137,.04));border:1px solid rgba(199,180,137,.24);box-shadow:inset 0 1px 0 rgba(255,255,255,.06);text-align:center}
  #tsd5 .d5-sum .sl{font-size:12px;letter-spacing:.01em;color:rgba(255,255,255,.55);margin:0 0 8px}
  #tsd5 .d5-sum .sv{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,sans-serif;font-size:30px;font-weight:700;color:#c7b489;letter-spacing:-.01em;line-height:1}
  /* Rechte Karte — Pro Portion (füllt die volle Kartenhöhe, kein leerer Boden) */
  #tsd5 .d5-right{background:linear-gradient(180deg,rgba(199,180,137,.085),rgba(199,180,137,.03));border-color:rgba(199,180,137,.38);display:flex;flex-direction:column;justify-content:space-between;padding-left:23px;padding-right:23px}
  #tsd5 .d5-ctrl{margin:2px 0 22px}
  #tsd5 .d5-ctrl .cl{display:flex;align-items:baseline;justify-content:space-between;margin:0 0 13px}
  #tsd5 .d5-ctrl .cl .lab{font-size:13px;color:rgba(255,255,255,.7)}
  #tsd5 .d5-ctrl .cl .val{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,sans-serif;font-size:20px;font-weight:700;color:#fff}
  #tsd5 .d5-ctrl .cl .val small{font-size:12px;font-weight:500;color:rgba(255,255,255,.5);margin-left:2px}
  /* Slider — edel: Gold-Füllung bis zum Regler, polierter Bead-Thumb */
  #tsd5 .d5-range{-webkit-appearance:none;appearance:none;width:100%;height:6px;border-radius:6px;outline:none;margin:0;background:linear-gradient(90deg,#c7b489 0%,#e0d2ac var(--d5fill,25%),rgba(255,255,255,.13) var(--d5fill,25%),rgba(255,255,255,.13) 100%);box-shadow:inset 0 1px 2px rgba(0,0,0,.4)}
  #tsd5 .d5-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:24px;height:24px;border-radius:50%;background:radial-gradient(circle at 34% 30%,#fbf5e6,#c7b489 68%);border:1px solid rgba(255,255,255,.4);cursor:pointer;box-shadow:0 0 0 6px rgba(199,180,137,.13),0 4px 12px rgba(0,0,0,.6);transition:transform .14s cubic-bezier(.16,1,.3,1),box-shadow .2s ease}
  #tsd5 .d5-range::-webkit-slider-thumb:hover{box-shadow:0 0 0 8px rgba(199,180,137,.16),0 4px 14px rgba(0,0,0,.65)}
  #tsd5 .d5-range::-webkit-slider-thumb:active{transform:scale(1.12)}
  #tsd5 .d5-range::-moz-range-thumb{width:24px;height:24px;border:1px solid rgba(255,255,255,.4);border-radius:50%;background:radial-gradient(circle at 34% 30%,#fbf5e6,#c7b489 68%);cursor:pointer;box-shadow:0 0 0 6px rgba(199,180,137,.13),0 4px 12px rgba(0,0,0,.6)}
  #tsd5 .d5-scale{display:flex;justify-content:space-between;font-size:10px;color:rgba(255,255,255,.32);margin-top:10px}
  #tsd5 .d5-out{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:0}
  #tsd5 .d5-tile{border-radius:16px;padding:17px 14px;background:linear-gradient(180deg,rgba(255,255,255,.055),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.09);box-shadow:inset 0 1px 0 rgba(255,255,255,.06);text-align:center;display:flex;flex-direction:column;justify-content:center}
  #tsd5 .d5-tile.hot{background:linear-gradient(180deg,rgba(199,180,137,.16),rgba(199,180,137,.05));border-color:rgba(199,180,137,.5);padding-top:22px;padding-bottom:22px}
  #tsd5 .d5-tile .tl{font-size:12px;letter-spacing:.01em;color:rgba(255,255,255,.55);margin:0 0 8px}
  #tsd5 .d5-tile .tv{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,sans-serif;font-size:clamp(1.6rem,3.4vw,2.15rem);font-weight:700;letter-spacing:-.02em;color:#fff;line-height:1}
  #tsd5 .d5-tile.hot .tv{color:#c7b489;font-size:clamp(2.4rem,5vw,3.05rem)}
  #tsd5 .d5-tile .tu{font-size:12px;color:rgba(255,255,255,.45);margin-top:6px}
  /* Anzahl Portionen — mit +/- Steppern */
  #tsd5 .d5-adjrow{display:flex;align-items:center;justify-content:center;gap:16px;margin:2px 0}
  #tsd5 .d5-adjrow .tv{min-width:2.2ch}
  #tsd5 .d5-step{flex:none;width:36px;height:36px;border-radius:50%;border:1px solid rgba(199,180,137,.42);background:linear-gradient(180deg,rgba(199,180,137,.18),rgba(199,180,137,.06));color:#e9dcb8;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:22px;font-weight:600;line-height:1;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 2px 8px rgba(0,0,0,.4);transition:transform .14s cubic-bezier(.16,1,.3,1),background .2s ease,box-shadow .2s ease}
  #tsd5 .d5-step:hover{background:linear-gradient(180deg,rgba(199,180,137,.28),rgba(199,180,137,.1));box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 4px 12px rgba(0,0,0,.5);transform:translateY(-1px)}
  #tsd5 .d5-step:active{transform:scale(.94)}
  #tsd5 .d5-step:disabled{opacity:.28;cursor:not-allowed;transform:none;box-shadow:none}
  /* Nährwerte / Portion — deutlich mehr Abstand zu den Feldern darunter */
  #tsd5 .d5-seclbl{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,sans-serif;font-size:27px;font-weight:600;letter-spacing:-.01em;color:#fff;text-align:center;margin:0}
  #tsd5 .d5-nut{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:0}
  #tsd5 .d5-ncell{border-radius:13px;padding:16px 6px;background:linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.015));border:1px solid rgba(255,255,255,.08);box-shadow:inset 0 1px 0 rgba(255,255,255,.05);text-align:center}
  #tsd5 .d5-ncell .nv{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,sans-serif;font-size:23px;font-weight:700;color:#fff;line-height:1}
  #tsd5 .d5-ncell .nu{font-size:11px;color:rgba(255,255,255,.45);margin-top:7px;letter-spacing:.3px}
  /* Allergene — Label zentriert weiss, deutlich mehr Abstand zu den Chips */
  #tsd5 .d5-aller{text-align:center;margin:0}
  #tsd5 .d5-aller .al-l{display:block;font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,sans-serif;font-size:16px;font-weight:600;letter-spacing:.005em;color:#fff;margin:0 0 16px}
  #tsd5 .d5-allchips{display:flex;justify-content:center;flex-wrap:wrap;gap:11px}
  #tsd5 .d5-chip{font-size:15px;color:#efe3c4;background:linear-gradient(180deg,rgba(199,180,137,.16),rgba(199,180,137,.07));border:1px solid rgba(199,180,137,.32);border-radius:999px;padding:8px 18px;box-shadow:inset 0 1px 0 rgba(255,255,255,.06)}
  /* Formel — freistehend, weiss, größer (Gold-Betonungen bleiben) */
  #tsd5 .d5-formula{font-size:14.5px;color:#fff;text-align:center;margin:0;line-height:1.6}
  #tsd5 .d5-formula b{color:#c7b489;font-weight:600}
  #tsd5 .d5-foot{text-align:center;margin:48px auto 0;max-width:720px}
  #tsd5 .d5-foot .fm{font-size:20px;line-height:1.5;color:#fff;margin:0 0 12px}
  #tsd5 .d5-foot .fm .g{color:#c7b489}
  #tsd5 .d5-foot .fs{font-size:15px;line-height:1.55;color:rgba(255,255,255,.8);margin:0}
  @media(max-width:820px){
    #tsd5 .d5-grid{grid-template-columns:1fr}
    #tsd5 .d5-hero{width:min(420px,88%)}
    #tsd5 .d5-herotext{margin-top:-32%}
  }
  @media(max-width:560px){
    #tsd5 .d5-item{grid-template-columns:96px 1fr auto;gap:14px}
    #tsd5 .d5-thumb{width:96px;height:96px}
    #tsd5 .d5-item .nm{font-size:19px}
    #tsd5 .d5-item .qty .q1{font-size:17px}
    #tsd5 .d5-sum .sv{font-size:26px}
  }
  `;

  function injectCSS(){ if(document.getElementById('tsd5-css'))return; var s=document.createElement('style'); s.id='tsd5-css'; s.textContent=CSS; document.head.appendChild(s); }

  function build(){
    var root=document.createElement('div'); root.id='tsd5';
    var itemsHTML='';
    RECIPE.items.forEach(function(it,i){
      itemsHTML+='<div class="d5-item" style="transition-delay:'+(120+i*90)+'ms">'+
        '<img class="d5-thumb" src="'+IMGBASE+it.img+'" alt="'+it.n+'" decoding="async">'+
        '<span class="nm">'+it.n+'<small>'+nf(it.p,2)+' €/kg</small></span>'+
        '<span class="qty"><div class="q1">'+it.g+' g</div><div class="q2"><b class="pp" data-g="'+it.g+'">–</b> g/Portion</div></span>'+
      '</div>';
    });
    var allerHTML=ALLERGENE.map(function(a){return '<span class="d5-chip">'+a+'</span>';}).join('');
    root.innerHTML=
      '<div class="d5-head">'+
        '<div class="d5-hero">'+
          '<img class="d5-jar" src="'+JAR+'" alt="Basilikum-Pesto im Glas" decoding="async">'+
          '<div class="d5-herotext">'+
            '<img class="d5-logo" src="'+LOGO+'" alt="Tasty Studios">'+
            '<h2 class="d5-title"><span class="basil">Basilikum</span> <span class="pesto">Pesto</span></h2>'+
          '</div>'+
        '</div>'+
        '<p class="d5-sub">Ein Rezept zieht seine Zutaten als Bausteine. Menge und Preis summieren sich automatisch – die Portionsgröße teilt alles sauber auf.</p>'+
      '</div>'+
      '<div class="d5-grid">'+
        '<div class="d5-card">'+
          itemsHTML+
          '<div class="d5-sums">'+
            '<div class="d5-sum"><p class="sl">Gesamtmenge</p><div class="sv" data-count="menge">0 g</div></div>'+
            '<div class="d5-sum"><p class="sl">Rohstoffkosten</p><div class="sv" data-count="kosten">0,00 €</div></div>'+
          '</div>'+
        '</div>'+
        '<div class="d5-card d5-right">'+
          '<div class="d5-top">'+
            '<p class="d5-rhead">Pro Portion</p>'+
            '<div class="d5-ctrl">'+
              '<div class="cl"><span class="lab">Portionsgröße</span><span class="val"><span class="pval">'+DEFAULT_PORTION+'</span><small> g</small></span></div>'+
              '<input type="range" class="d5-range" min="'+MIN_P+'" max="'+MAX_P+'" step="1" value="'+DEFAULT_PORTION+'">'+
              '<div class="d5-scale"><span>'+MIN_P+' g</span><span>'+MAX_P+' g</span></div>'+
            '</div>'+
            '<div class="d5-out">'+
              '<div class="d5-tile d5-adj"><p class="tl">Anzahl Portionen</p><div class="d5-adjrow"><button type="button" class="d5-step" data-step="-1" aria-label="Weniger Portionen">&#8722;</button><div class="tv" data-out="portionen">–</div><button type="button" class="d5-step" data-step="1" aria-label="Mehr Portionen">+</button></div><div class="tu">Portionen</div></div>'+
              '<div class="d5-tile hot"><p class="tl">Preis / Portion</p><div class="tv" data-out="preis">–</div><div class="tu">pro Portion</div></div>'+
            '</div>'+
          '</div>'+
          '<p class="d5-seclbl">Nährwerte / Portion</p>'+
          '<div class="d5-nut">'+
            '<div class="d5-ncell"><div class="nv" data-nut="kcal">–</div><div class="nu">kcal</div></div>'+
            '<div class="d5-ncell"><div class="nv" data-nut="fett">–</div><div class="nu">Fett</div></div>'+
            '<div class="d5-ncell"><div class="nv" data-nut="kh">–</div><div class="nu">Kohlenh.</div></div>'+
            '<div class="d5-ncell"><div class="nv" data-nut="protein">–</div><div class="nu">Protein</div></div>'+
          '</div>'+
          '<p class="d5-seclbl">Allergene</p>'+
          '<div class="d5-allchips">'+allerHTML+'</div>'+
          '<p class="d5-formula"><b>Gesamtmenge ÷ Portionsgröße</b> = Portionen &nbsp;·&nbsp; <b>Kosten &amp; Nährwerte</b> laufen pro Portion mit.</p>'+
        '</div>'+
      '</div>'+
      '<div class="d5-foot">'+
        '<p class="fm">→ Änderst du eine Zutat, verschiebt sich <span class="g">alles</span> mit – Menge, Kosten, Nährwerte und jede Portion.</p>'+
        '<p class="fs">Zahlen = Beispielwerte. Nährwerte &amp; Allergene fließen im echten System automatisch aus den Zutaten mit.</p>'+
      '</div>';
    return root;
  }

  function recompute(root, portion, animate){
    var tG=totalG(), tC=totalCost();
    var portionen=tG/portion;               // Anzahl Portionen
    var preisPortion=tC/portionen;          // Rohstoffkosten pro Portion
    var f=portion/100;                      // Nährwert-Skalierung (je 100 g)
    var pv=root.querySelector('.pval'); if(pv)pv.textContent=nfP(portion);
    var rng=root.querySelector('.d5-range'); if(rng){ var pct=Math.max(0,Math.min(100,((portion-MIN_P)/(MAX_P-MIN_P))*100)); rng.style.setProperty('--d5fill', pct+'%'); rng.value=Math.round(portion); }
    root.__portion=portion;
    var mn=root.querySelector('.d5-step[data-step="-1"]'), pl=root.querySelector('.d5-step[data-step="1"]');
    if(mn)mn.disabled=(portionen<=MINPORT()+1e-6);
    if(pl)pl.disabled=(portionen>=MAXPORT()-1e-6);
    root.querySelectorAll('.pp').forEach(function(el){
      var g=parseFloat(el.getAttribute('data-g'))||0;
      el.textContent=nf(g/portionen,1);
    });
    var oP=root.querySelector('[data-out="portionen"]'), oE=root.querySelector('[data-out="preis"]');
    var setN=function(k,val){ var el=root.querySelector('[data-nut="'+k+'"]'); if(el)el.textContent=val; };
    setN('kcal', Math.round(NUT.kcal*f));
    setN('fett', nf(NUT.fett*f,1)+' g');
    setN('kh',   nf(NUT.kh*f,1)+' g');
    setN('protein', nf(NUT.protein*f,1)+' g');
    if(animate){
      countTo(oP, portionen, function(v){return nfP(v);});
      countTo(oE, preisPortion, function(v){return nf(v,2)+' €';});
    }else{
      oP.textContent=nfP(portionen);
      oE.textContent=nf(preisPortion,2)+' €';
    }
  }

  function countTo(el,target,fmt){
    var dur=750,t0=null,done=false;
    function finish(){ if(done)return; done=true; el.textContent=fmt(target); }
    function step(now){ if(done)return; if(t0===null)t0=now; var p=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-p,3); el.textContent=fmt(target*e); if(p<1)requestAnimationFrame(step); else finish(); }
    requestAnimationFrame(step);
    setTimeout(finish, dur+140);
  }

  var REDUCE=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function play(root){
    if(root.__played)return; root.__played=true;
    root.classList.add('in');
    var tG=totalG(), tC=totalCost();
    var mEl=root.querySelector('[data-count="menge"]'), kEl=root.querySelector('[data-count="kosten"]');
    if(REDUCE){
      mEl.textContent=Math.round(tG)+' g';
      kEl.textContent=nf(tC,2)+' €';
      recompute(root, DEFAULT_PORTION, false);
      return;
    }
    setTimeout(function(){ countTo(mEl,tG,function(v){return Math.round(v)+' g';}); },700);
    setTimeout(function(){ countTo(kEl,tC,function(v){return nf(v,2)+' €';}); },900);
    setTimeout(function(){ recompute(root, DEFAULT_PORTION, true); },1150);
  }

  function findAnchor(){
    /* Konzept-Absatz zuerst (Textphrase), Block-ID nur Fallback — Widget sitzt DIREKT DARUNTER,
       über dem Video-/Nährstoffe-Block und dem Heading "Der Aufbau". */
    var p=document.querySelectorAll('p.notion-text__content, .notion-text__content');
    for(var i=0;i<p.length;i++){ if((p[i].textContent||'').indexOf('zieht sich die einzelnen Zutaten')>-1) return p[i].closest('[id^="block-"]')||p[i]; }
    return document.getElementById('block-2c5edc4c7d1e4c1eb2478fdea38a3535');
  }
  function inView(el){ var r=el.getBoundingClientRect(); return r.top<(window.innerHeight*0.75)&&r.bottom>(window.innerHeight*0.25); }

  function mount(){
    if(!/\/rezepturen\/?$/.test(location.pathname)){ var e=document.getElementById('tsd5'); if(e&&e.parentNode)e.parentNode.removeChild(e); return; }
    if(document.getElementById('tsd5')) return;
    var a=findAnchor(); if(!a) return;
    injectCSS();
    var root=build();
    a.parentNode.insertBefore(root, a.nextSibling);  /* DIREKT UNTER den Konzept-Absatz */
    var range=root.querySelector('.d5-range');
    range.addEventListener('input', function(){ recompute(root, parseInt(range.value,10)||DEFAULT_PORTION, false); });
    /* +/- an "Anzahl Portionen": invers gekoppelt — Portionsgröße = Gesamtmenge ÷ Portionen */
    root.querySelectorAll('.d5-step').forEach(function(btn){
      btn.addEventListener('click', function(){
        var dir=parseInt(btn.getAttribute('data-step'),10);
        var tG=totalG(), curP=tG/(root.__portion||DEFAULT_PORTION);
        var newP=(dir>0)?Math.floor(curP+1e-6)+1:Math.ceil(curP-1e-6)-1;
        newP=Math.max(MINPORT(),Math.min(MAXPORT(),newP));
        recompute(root, tG/newP, true);
      });
    });
    recompute(root, DEFAULT_PORTION, false);
    root.querySelector('[data-out="portionen"]').textContent='–';
    root.querySelector('[data-out="preis"]').textContent='–';
    var io=new IntersectionObserver(function(ev){ if(ev[0].isIntersecting){ play(root); io.disconnect(); } },{threshold:.3});
    io.observe(root);
    if(inView(root)) play(root);
    var poll=setInterval(function(){ if(!document.body.contains(root)){ clearInterval(poll); return; } if(inView(root)){ play(root); clearInterval(poll); } },250);
    setTimeout(function(){ clearInterval(poll); },20000);
  }
  mount();
  document.addEventListener("DOMContentLoaded", mount);
  new MutationObserver(mount).observe(document.documentElement,{childList:true,subtree:true});
})();


/* ---- */

/* ============================================================
   rezepturen — MacBook-Scroll-Kachel "Meine Rezepturen" (#tsrv)
   Am "Nun haben wir Zutaten und Rezepte…"-Absatz: eigenes 2-Spalten-
   Grid — links Roberts Notion-Text (geklont, Original versteckt),
   rechts das anklickbare MacBook-Poster. Klick → großer PC (geteilter
   leerer Frame oj1wa9, identisch zu #tsiv/#tsmb) → Screen scrollt die
   lange Zutaten-Detailseite. Nur auf /rezepturen. Muster = #tsiv.
   Bilder: Frame (geteilt) oj1wa9.png · Poster img/rezepturen-mac/rv-poster.png
   (freigestellter MacBook "DB Meine Rezepturen") · Scroll
   img/rezepturen-mac/rv-scroll.png (Parmesan-Zutat-Detailseite).
   ============================================================ */
(function(){
  if(window.__tsrv) return; window.__tsrv=true;
  var FRAME="https://files.catbox.moe/oj1wa9.png";
  var COVER="https://tastyrob123.github.io/kurs/img/rezepturen-mac/rv-poster.png";
  var SHOT="https://tastyrob123.github.io/kurs/img/rezepturen-mac/rv-scroll.png";
  var ANCHOR_ID='block-6a8b34d0e7ed4681ab0fb35925ce5a88';
  var ANCHOR_PHRASE='Nun haben wir Zutaten und Rezepte';
  function on(){ return /\/rezepturen\/?$/.test(location.pathname); }
  var CSS=[
    '#tsrv-root{--tsrv-gold:#c7b489;--tsrv-ease:cubic-bezier(.16,1,.3,1);width:min(1000px,95vw);margin:8px auto 40px;display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,4.5vw,60px);align-items:center;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;opacity:0;transform:translateY(20px);transition:opacity .8s var(--tsrv-ease),transform .9s var(--tsrv-ease);}',
    '#tsrv-root.in{opacity:1;transform:none;}',
    '#tsrv-root *{box-sizing:border-box;}',
    '#tsrv-root .tsrv-textslot{min-width:0;min-height:1px;}',
    '#tsrv-root .tsrv-textslot .tsrv-lead{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;font-size:clamp(1.32rem,2vw,1.6rem);font-weight:600;letter-spacing:-.012em;line-height:1.22;color:#fff;margin:0 0 18px;}',
    '#tsrv-root .tsrv-textslot .tsrv-lead .tsrv-accent{color:var(--tsrv-gold);}',
    '#tsrv-root .tsrv-textslot p:not(.tsrv-lead){font-size:.95rem;line-height:1.7;color:rgba(255,255,255,.62);margin:0 0 14px;}',
    '#tsrv-root .tsrv-textslot p:last-child{margin-bottom:0;}',
    '.tsrv-hide{display:none !important;}',
    '#tsrv-root .tsrv-unit{display:flex;flex-direction:column;align-items:center;gap:8px;min-width:0;}',
    '@media(max-width:900px){#tsrv-root{grid-template-columns:1fr;}#tsrv-root .tsrv-textslot{text-align:left;max-width:600px;margin:0 auto 6px;}}',
    '#tsrv-root .tsrv-tile{position:relative;width:100%;max-width:520px;cursor:pointer;border-radius:12px;filter:drop-shadow(0 18px 44px rgba(0,0,0,.5));transition:transform .5s var(--tsrv-ease),filter .5s var(--tsrv-ease);}',
    '#tsrv-root .tsrv-tile:hover{transform:translateY(-4px) scale(1.02);animation:tsrvHeartbeat 2.6s var(--tsrv-ease) infinite;}',
    '@keyframes tsrvHeartbeat{0%,100%{filter:drop-shadow(0 22px 52px rgba(0,0,0,.6)) drop-shadow(0 6px 18px rgba(199,180,137,.14));}50%{filter:drop-shadow(0 22px 52px rgba(0,0,0,.6)) drop-shadow(0 8px 26px rgba(199,180,137,.30));}}',
    '#tsrv-root .tsrv-tile:active{transform:scale(.99);transition-duration:.12s;}',
    '#tsrv-root .tsrv-cover{width:100%;height:auto;aspect-ratio:845/536;display:block;pointer-events:none;user-select:none;}',
    '#tsrv-root .tsrv-caption{width:100%;text-align:center;font-size:15px;font-weight:600;letter-spacing:.005em;color:#fff;margin-top:6px;}',
    '#tsrv-root .tsrv-caption .tsrv-accent{color:var(--tsrv-gold);}',
    '#tsrv-root .tsrv-hint{font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.32);animation:tsrvHint 2.5s ease-in-out infinite;}',
    '@keyframes tsrvHint{0%,100%{opacity:.4}50%{opacity:.8}}',
    '#tsrv-lb{position:fixed;inset:0;z-index:99999;display:none;flex-direction:column;align-items:center;justify-content:center;background:rgba(5,6,11,.92);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);padding:32px;opacity:0;transition:opacity .24s cubic-bezier(.16,1,.3,1);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;}',
    '#tsrv-lb.open{display:flex;opacity:1;}',
    '#tsrv-lb .tsrv-inner{position:relative;width:100%;max-width:min(960px,calc(100vw - 64px));transform:scale(.92) translateY(24px);transition:transform .5s cubic-bezier(.16,1,.3,1);}',
    '#tsrv-lb.open .tsrv-inner{transform:scale(1) translateY(0);}',
    '#tsrv-lb.full{padding:0;}',
    '#tsrv-lb.full .tsrv-inner{max-width:100vw;}',
    '#tsrv-lb .tsrv-mockup{position:relative;width:100%;aspect-ratio:1366/768;filter:drop-shadow(0 30px 80px rgba(0,0,0,.6)) drop-shadow(0 10px 30px rgba(0,0,0,.5));}',
    '#tsrv-lb .tsrv-frame{position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none;user-select:none;}',
    '#tsrv-lb .tsrv-screen{position:absolute;top:3.65%;left:12.22%;width:73.06%;height:83.85%;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;z-index:3;border-radius:3px;background:#191919;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.14) transparent;}',
    '#tsrv-lb .tsrv-screen::-webkit-scrollbar{width:5px;}',
    '#tsrv-lb .tsrv-screen::-webkit-scrollbar-thumb{background:rgba(255,255,255,.14);border-radius:4px;}',
    '#tsrv-lb .tsrv-screen img{width:100%;display:block;}',
    '#tsrv-lb .tsrv-closehint{margin-top:22px;font-size:12px;letter-spacing:.1em;color:rgba(255,255,255,.32);text-align:center;}',
    '#tsrv-lb.full .tsrv-closehint{display:none;}',
    '#tsrv-lb .tsrv-btn{position:absolute;top:16px;z-index:10;width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.55);cursor:pointer;display:flex;align-items:center;justify-content:center;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);transition:background .2s,color .2s;}',
    '#tsrv-lb .tsrv-btn:hover{background:rgba(255,255,255,.16);color:#fff;}',
    '#tsrv-lb .tsrv-expand{left:16px;}#tsrv-lb .tsrv-closex{right:16px;}',
    '@media(prefers-reduced-motion:reduce){#tsrv-root,#tsrv-root *,#tsrv-lb *{animation:none!important;transition-duration:.01ms!important;}#tsrv-root{opacity:1;transform:none;}}'
  ].join('');
  function injectCSS(){ if(document.getElementById('tsrv-css'))return; var s=document.createElement('style'); s.id='tsrv-css'; s.textContent=CSS; document.head.appendChild(s); }
  function shut(){ var lb=document.getElementById('tsrv-lb'); if(!lb)return; lb.classList.remove('open','full'); document.body.style.overflow=''; }
  function ensureLb(){
    var lb=document.getElementById('tsrv-lb'); if(lb) return lb;
    lb=document.createElement('div'); lb.id='tsrv-lb';
    lb.innerHTML='<button class="tsrv-btn tsrv-expand" title="Vollbild" aria-label="Vollbild"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="tsrv-btn tsrv-closex" title="Schließen" aria-label="Schließen"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4.5 4.5l9 9M13.5 4.5l-9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button><div class="tsrv-inner"><div class="tsrv-mockup"><img class="tsrv-frame" src="'+FRAME+'" alt="MacBook"><div class="tsrv-screen"><img src="'+SHOT+'" alt="Zutaten-Detailseite — Live Beispiel"></div></div></div><div class="tsrv-closehint">✕ Klicke daneben oder ESC zum Schließen</div>';
    document.body.appendChild(lb);
    var inner=lb.querySelector('.tsrv-inner');
    lb.querySelector('.tsrv-closex').addEventListener('click',shut);
    lb.querySelector('.tsrv-expand').addEventListener('click',function(e){ e.stopPropagation(); lb.classList.toggle('full'); });
    inner.addEventListener('click',function(e){ e.stopPropagation(); });
    lb.addEventListener('click',function(e){ if(e.target===lb) shut(); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') shut(); });
    return lb;
  }
  function openLb(){ var lb=ensureLb(); lb.classList.add('open'); lb.classList.remove('full'); document.body.style.overflow='hidden'; var sc=lb.querySelector('.tsrv-screen'); if(sc) sc.scrollTop=0; }
  function buildTile(){
    var root=document.createElement('div'); root.id='tsrv-root';
    root.innerHTML='<div class="tsrv-textslot"></div><div class="tsrv-unit"><div class="tsrv-tile" role="button" tabindex="0" aria-label="Meine Rezepturen vergrößern"><img class="tsrv-cover" src="'+COVER+'" alt="Meine Rezepturen — DB-Ansicht" fetchpriority="high" decoding="async"></div><div class="tsrv-caption">Meine Rezepturen<span class="tsrv-accent"> · DB-Ansicht – Live Beispiel</span></div><div class="tsrv-hint">Klicke zum Vergrößern</div></div>';
    var tile=root.querySelector('.tsrv-tile');
    tile.addEventListener('click',openLb);
    tile.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openLb(); } });
    return root;
  }
  function reveal(root){
    if(root.__rv) return; root.__rv=true;
    var io=new IntersectionObserver(function(en){ if(en[0].isIntersecting){ root.classList.add('in'); io.disconnect(); } },{threshold:.2});
    io.observe(root);
    if(root.getBoundingClientRect().top < (window.innerHeight||800)) root.classList.add('in');
  }
  function findAnchor(){
    var el=document.getElementById(ANCHOR_ID);
    if(el) return el;
    var els=document.querySelectorAll('.page__rezepturen p.notion-text, .page__rezepturen .notion-text__content');
    for(var i=0;i<els.length;i++){ if((els[i].textContent||'').trim().indexOf(ANCHOR_PHRASE)===0) return els[i]; }
    return null;
  }
  function hideBlock(el){ if(!el)return; var w=(el.id&&/^block-/.test(el.id))?el:(el.closest('[id^="block-"]')||el); if(w) w.classList.add('tsrv-hide'); }
  /* Top-Level-Block = direktes Kind der .notion-root (der „Nun haben wir…"-Absatz liegt in einer
     .notion-column → das Grid MUSS auf Seitenebene vor der ganzen Spaltenliste sitzen, nicht in der Spalte). */
  function topLevelBlockFor(el){
    var nroot=document.querySelector('.notion-root'); if(!nroot) return el.closest('.notion-column-list')||el;
    var node=el;
    while(node && node.parentElement && node.parentElement!==nroot){ node=node.parentElement; }
    return (node&&node.parentElement===nroot)?node:(el.closest('.notion-column-list')||el);
  }
  /* Lead = erster Satz (letztes Wort beige, Lineal-TS-groß), Body = Rest — Muster wie #tsiv/#ts2mac. */
  function makeLead(text){
    var p=document.createElement('p'); p.className='tsrv-lead';
    var m=(text||'').match(/^([\s\S]*\s)(\S+)$/);
    if(m){ p.appendChild(document.createTextNode(m[1])); var s=document.createElement('span'); s.className='tsrv-accent'; s.textContent=m[2]; p.appendChild(s); }
    else p.textContent=text||'';
    return p;
  }
  function makeP(text){ var p=document.createElement('p'); p.textContent=(text||'').trim(); return p; }
  function fillText(anchor){
    var root=document.getElementById('tsrv-root'); if(!root) return;
    var slot=root.querySelector('.tsrv-textslot'); if(!slot) return;
    if(!slot.__filled){
      var full=(anchor.textContent||'').replace(/\s+/g,' ').trim();
      if(full){
        var idx=full.indexOf('. ');
        var leadTxt=idx>0?full.slice(0,idx+1):full;   /* "Nun haben wir Zutaten und Rezepte." */
        var bodyTxt=idx>0?full.slice(idx+2):'';        /* Rest */
        slot.appendChild(makeLead(leadTxt));
        if(bodyTxt) slot.appendChild(makeP(bodyTxt));
        slot.__filled=true;
      }
    }
    if(slot.__filled){
      /* ganze native Spaltenliste (Text-Spalte + leere Spalte) ausblenden, nicht nur den Absatz */
      var col=anchor.closest('.notion-column-list'); if(col) col.classList.add('tsrv-hide'); else hideBlock(anchor);
    }
  }
  function mount(){
    if(!on()){ ['tsrv-root','tsrv-lb'].forEach(function(id){ var e=document.getElementById(id); if(e&&e.parentNode)e.parentNode.removeChild(e); }); return; }
    var anchor=findAnchor(); if(!anchor) return;
    if(!document.getElementById('tsrv-root')){
      injectCSS();
      var root=buildTile();
      var target=topLevelBlockFor(anchor);   // vor der ganzen Spaltenliste (Top-Level), NICHT in die schmale Spalte
      target.parentNode.insertBefore(root, target);
      reveal(root);
    }
    fillText(anchor);
  }
  function boot(){
    var tries=0;
    var iv=setInterval(function(){ tries++; mount(); if(tries>60) clearInterval(iv); },300);
    var t=null;
    new MutationObserver(function(){ if(t) return; t=setTimeout(function(){ t=null; mount(); },200); }).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='complete') boot(); else window.addEventListener('load',boot);
})();

/* ============================================================
   #tsrezsys — SYSTEMFLUSS (DB V) · /rezepturen  [v3]
   Zwischen Finance-Warenkorb (#tsshop--db5_finance_personal) und
   Learnings (#tsl). Reduzierter High-End-Flow, korrekter Graph:
     Inventarprodukt (DB 0) -> Zutat (DB IV)
     Zutat -> Rezept (DB V)
     Zutat -> Gericht/Getraenk (DB VIII)   [direkt, ohne Rezept]
     Rezept -> Gericht/Getraenk
     Gericht/Getraenk -> Menue (Kalkulation)
   Die Kennzahlen (Preis/Portion, Allergene, Naehrwerte) ziehen als
   Licht durch das System bis in die Menuekalkulation.
   Keine Piktogramme (edle Ringknoten + Typo), kein greller Blob.
   Champagner-Gold #c7b489, Lineal TS 600, reduced-motion-Gate.
   ============================================================ */
(function(){
  if(window.__tsrezsys) return; window.__tsrezsys=true;
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CSS=`
  #tsrezsys{width:min(1120px,94vw);margin:clamp(32px,5.5vh,64px) auto clamp(36px,5vh,64px);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",Helvetica,Arial,sans-serif;color:#fff;opacity:0;transform:translateY(18px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform 1s cubic-bezier(.16,1,.3,1)}
  #tsrezsys.in{opacity:1;transform:none}
  #tsrezsys *{box-sizing:border-box}
  #tsrezsys .rs-head{text-align:center;margin:0 0 clamp(30px,4vw,50px)}
  #tsrezsys .rs-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:10.5px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:#c7b489;margin:0 0 14px}
  #tsrezsys .rs-eyebrow::before{content:"";width:6px;height:6px;border-radius:50%;background:#c7b489;box-shadow:0 0 12px rgba(199,180,137,.7)}
  #tsrezsys .rs-title{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;font-size:clamp(1.55rem,3.4vw,2.25rem);font-weight:600;letter-spacing:-.02em;line-height:1.12;margin:0;color:#fff}
  #tsrezsys .rs-title .g{color:#c7b489}
  #tsrezsys .stage{position:relative;width:100%;aspect-ratio:1200/380}
  #tsrezsys svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
  #tsrezsys .ln{fill:none;stroke:#c7b489;stroke-width:1.25;stroke-linecap:round;vector-effect:non-scaling-stroke;opacity:.55}
  #tsrezsys .guide{fill:none;stroke:none}
  #tsrezsys .comet{fill:#f3ead4;filter:drop-shadow(0 0 7px rgba(199,180,137,.95));opacity:0}
  #tsrezsys .comet.on{opacity:1}
  #tsrezsys .nd{position:absolute;transform:translate(-50%,-50%) scale(.72);opacity:0;transition:opacity .45s ease,transform .55s cubic-bezier(.34,1.56,.64,1)}
  #tsrezsys .nd.on{opacity:1;transform:translate(-50%,-50%) scale(1)}
  #tsrezsys .dot{display:block;position:relative;width:44px;height:44px;border-radius:50%;background:radial-gradient(65% 65% at 40% 34%,rgba(255,255,255,.05),rgba(13,16,22,.92));border:1px solid rgba(216,201,171,.26);margin:0 auto;transition:border-color .55s ease,box-shadow .55s ease}
  #tsrezsys .dot::after{content:"";position:absolute;top:50%;left:50%;width:7px;height:7px;border-radius:50%;background:#ecdfc2;transform:translate(-50%,-50%) scale(0);opacity:0;transition:transform .55s cubic-bezier(.34,1.56,.64,1),opacity .4s ease;box-shadow:0 0 10px rgba(199,180,137,.7)}
  #tsrezsys .nd.lit .dot{border-color:rgba(199,180,137,.85);box-shadow:0 0 0 1px rgba(199,180,137,.1),0 0 26px rgba(199,180,137,.18)}
  #tsrezsys .nd.lit .dot::after{transform:translate(-50%,-50%) scale(1);opacity:1}
  /* Rezept-Knoten: dezent hervorgehoben (Thema DB V) — champagner-getoentes Glas, feiner Doppelring */
  #tsrezsys .nd.rez .dot{width:58px;height:58px;background:radial-gradient(70% 70% at 42% 34%,rgba(199,180,137,.22),rgba(199,180,137,.06) 58%,rgba(15,18,24,.92));border:1px solid rgba(216,201,171,.5)}
  #tsrezsys .nd.rez .dot::before{content:"";position:absolute;inset:-7px;border-radius:50%;border:1px solid rgba(216,201,171,.14);transition:border-color .55s ease}
  #tsrezsys .nd.rez .dot::after{width:8px;height:8px}
  #tsrezsys .nd.rez.lit .dot{border-color:rgba(216,201,171,.95);box-shadow:0 0 0 1px rgba(199,180,137,.12),0 0 40px rgba(199,180,137,.28)}
  #tsrezsys .nd.rez.lit .dot::before{border-color:rgba(199,180,137,.45)}
  #tsrezsys .lbl{position:absolute;left:50%;transform:translateX(-50%);width:168px;text-align:center;line-height:1.25}
  #tsrezsys .lbl.below{top:calc(100% + 12px)}
  #tsrezsys .lbl.above{bottom:calc(100% + 12px)}
  #tsrezsys .lbl .nm{display:block;font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,sans-serif;font-size:14px;font-weight:600;letter-spacing:-.005em;color:#fff}
  #tsrezsys .lbl .sub{display:block;font-size:8.5px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:rgba(216,201,171,.5);margin-top:4px}
  #tsrezsys .nd.rez .lbl .nm{font-size:15.5px;color:#efe6d2}
  /* Kennzahl-Leiste unter dem Flow — edle Hairline-Tags */
  #tsrezsys .rs-keys{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin:clamp(28px,3.6vw,44px) auto 0}
  #tsrezsys .kp{font-size:11px;font-weight:600;letter-spacing:.05em;color:#d8c9ab;background:rgba(199,180,137,.05);border:1px solid rgba(216,201,171,.28);border-radius:999px;padding:6px 15px;white-space:nowrap;opacity:0;transform:translateY(6px);transition:opacity .5s ease,transform .6s cubic-bezier(.34,1.56,.64,1)}
  #tsrezsys .kp.on{opacity:1;transform:none}
  #tsrezsys .rs-desc{max-width:680px;margin:clamp(16px,2.2vw,24px) auto 0;text-align:center;font-size:15.5px;line-height:1.65;color:rgba(255,255,255,.9)}
  #tsrezsys .rs-desc .g{color:#c7b489}
  @media(max-width:820px){
    #tsrezsys .stage-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;margin:0 -3vw;padding-bottom:6px}
    #tsrezsys .stage{min-width:760px;margin:0 3vw}
  }
  @media(prefers-reduced-motion:reduce){
    #tsrezsys{opacity:1;transform:none;transition:none}
    #tsrezsys .nd{opacity:1;transform:translate(-50%,-50%) scale(1);transition:none}
    #tsrezsys .kp,#tsrezsys .comet,#tsrezsys .dot,#tsrezsys .dot::after{transition:none}
    #tsrezsys .kp{opacity:1;transform:none}
  }
  `;
  function injectCSS(){ if(document.getElementById('tsrezsys-css'))return; var s=document.createElement('style'); s.id='tsrezsys-css'; s.textContent=CSS; document.head.appendChild(s); }

  /* Nodes: [id, left%, top%, klasse, name, sublabel, labelPos] — %-Werte aus SVG-Koord. (viewBox 1200x380) */
  var NODES=[
    ['inv', 7.9,  65.8, 'st',  'Inventarprodukt', 'DB 0',       'below'],
    ['zut', 30,   65.8, 'zt',  'Zutat',           'DB IV',      'below'],
    ['rez', 52,   21.6, 'rez', 'Rezept',          'DB V',       'above'],
    ['gg',  74.2, 65.8, 'dn',  'Gericht / Getränk','DB VIII',   'below'],
    ['men', 93.3, 65.8, 'dn',  'Menü',            'Kalkulation','below']
  ];
  function build(){
    var root=document.createElement('div'); root.id='tsrezsys';
    var nodesHTML='';
    NODES.forEach(function(n){
      var lbl = n[4] ? ('<span class="lbl '+n[6]+'"><span class="nm">'+n[4]+'</span>'+(n[5]?('<span class="sub">'+n[5]+'</span>'):'')+'</span>') : '';
      nodesHTML+='<div class="nd '+n[3]+'" data-id="'+n[0]+'" style="left:'+n[1]+'%;top:'+n[2]+'%"><span class="dot"></span>'+lbl+'</div>';
    });
    var svg='<svg viewBox="0 0 1200 380" preserveAspectRatio="none">'
      +'<path class="ln" data-k="a" d="M95,250 H 360"/>'                                   /* Inventarprodukt -> Zutat */
      +'<path class="ln" data-k="b" d="M360,250 C 470,250 520,82 625,82"/>'               /* Zutat -> Rezept */
      +'<path class="ln" data-k="c" d="M360,250 C 520,312 730,312 890,250"/>'             /* Zutat -> Gericht/Getraenk (direkt) */
      +'<path class="ln" data-k="d" d="M625,82 C 730,82 780,250 890,250"/>'               /* Rezept -> Gericht/Getraenk */
      +'<path class="ln" data-k="e" d="M890,250 H 1120"/>'                                 /* Gericht/Getraenk -> Menue */
      +'<path class="guide" data-g="up" d="M95,250 L360,250 C470,250 520,82 625,82 C730,82 780,250 890,250 L1120,250"/>'
      +'<path class="guide" data-g="dn" d="M95,250 L360,250 C520,312 730,312 890,250 L1120,250"/>'
      +'<circle class="comet" data-p="up" r="4"/><circle class="comet" data-p="dn" r="4"/>'
      +'</svg>';
    root.innerHTML='<div class="rs-head"><span class="rs-eyebrow">Das Rückgrat · DB V</span>'
      +'<h2 class="rs-title">Eine Rezeptur. Das ganze <span class="g">System</span> rechnet mit.</h2></div>'
      +'<div class="stage-wrap"><div class="stage">'+svg+nodesHTML
      +'</div></div>'
      +'<div class="rs-keys"><span class="kp" data-i="0">Preis pro Portion</span><span class="kp" data-i="1">Allergene</span><span class="kp" data-i="2">Nährwerte</span></div>'
      +'<p class="rs-desc">Vom Inventarprodukt bis zur Menükalkulation — jede Rezeptur bündelt deine Zutaten und trägt <span class="g">Preis pro Portion, Allergene und Nährwerte</span> durch dein ganzes System.</p>';
    return root;
  }

  function q(root,id){return root.querySelector('.nd[data-id="'+id+'"]');}
  function lit(root,id){var n=q(root,id);if(n){n.classList.add('on');n.classList.add('lit');}}
  function on(root,id){var n=q(root,id);if(n)n.classList.add('on');}
  function draw(p,dur){var L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;p.style.transition='stroke-dashoffset '+dur+'ms cubic-bezier(.4,0,.2,1)';void p.getBoundingClientRect();p.style.strokeDashoffset='0';}
  function ln(root,k){return root.querySelector('.ln[data-k="'+k+'"]');}
  function comet(root,which){
    var guide=root.querySelector('.guide[data-g="'+which+'"]');
    var c=root.querySelector('.comet[data-p="'+which+'"]');
    if(!guide||!c)return;
    var L=guide.getTotalLength(),t0=null,dur=1850;
    c.classList.add('on');
    function step(now){
      if(t0===null)t0=now;
      var pr=Math.min(1,(now-t0)/dur);
      var e=pr<.5?2*pr*pr:1-Math.pow(-2*pr+2,2)/2; // easeInOutQuad
      var pt=guide.getPointAtLength(L*e);
      c.setAttribute('cx',pt.x);c.setAttribute('cy',pt.y);
      if(pr<1)requestAnimationFrame(step); else c.classList.remove('on');
    }
    requestAnimationFrame(step);
  }

  function play(root){
    if(root.__played)return; root.__played=true;
    root.classList.add('in');
    if(reduced){
      root.querySelectorAll('.nd').forEach(function(n){n.classList.add('on','lit');});
      root.querySelectorAll('.ln').forEach(function(l){l.style.strokeDashoffset='0';});
      return;
    }
    setTimeout(function(){on(root,'inv');},200);
    setTimeout(function(){lit(root,'inv');},520);
    setTimeout(function(){draw(ln(root,'a'),600);},450);
    setTimeout(function(){lit(root,'zut');},1050);
    setTimeout(function(){draw(ln(root,'b'),650);draw(ln(root,'c'),820);},1150);
    setTimeout(function(){lit(root,'rez');},1820);
    root.querySelectorAll('.kp').forEach(function(k){setTimeout(function(){k.classList.add('on');},2000+(+k.getAttribute('data-i'))*160);});
    setTimeout(function(){draw(ln(root,'d'),650);},2150);
    setTimeout(function(){lit(root,'gg');},2820);
    setTimeout(function(){draw(ln(root,'e'),560);comet(root,'up');comet(root,'dn');},2980);
    setTimeout(function(){lit(root,'men');},4680);
  }

  function inView(el){ var r=el.getBoundingClientRect(); return r.top < (window.innerHeight*0.8) && r.bottom > (window.innerHeight*0.2); }

  function anchorMount(root){
    var shop=document.getElementById('tsshop--db5_finance_personal');
    if(shop && shop.parentNode){ shop.parentNode.insertBefore(root, shop.nextSibling); return true; }
    var tsl=document.getElementById('tsl');
    if(tsl && tsl.parentNode){ tsl.parentNode.insertBefore(root, tsl); return true; }
    var nx=document.getElementById('ts-next-wrap');
    if(nx && nx.parentNode){ nx.parentNode.insertBefore(root, nx); return true; }
    return false;
  }
  function mount(){
    if(!/\/rezepturen\/?$/.test(location.pathname)){ var e=document.getElementById('tsrezsys'); if(e&&e.parentNode)e.parentNode.removeChild(e); return; }
    if(document.getElementById('tsrezsys')) return;
    if(!document.getElementById('tsshop--db5_finance_personal') && !document.getElementById('tsl')) return;
    injectCSS();
    var root=build();
    if(!anchorMount(root)) return;
    var started=false;
    function go(){ if(started)return; started=true; play(root); }
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(ev){ if(ev[0].isIntersecting){ go(); io.disconnect(); } },{threshold:.25});
      io.observe(root);
    }
    var pv=setInterval(function(){ if(started){clearInterval(pv);return;} if(inView(root)){ go(); clearInterval(pv); } },250);
    if(inView(root)) go();
  }
  function boot(){
    var tries=0;
    var iv=setInterval(function(){ tries++; mount(); if(tries>60) clearInterval(iv); },300);
    new MutationObserver(function(){ if(!document.getElementById('tsrezsys')) mount(); }).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='complete') boot(); else window.addEventListener('load',boot);
})();

/* ============================================================
   MacBook-Cover + Klick-Lightbox (gemeinkosten-mitarbeiterlhne)
   Muster 1:1 aus rezepturen (.tsmac / #tsmacRez). Natives 2-Spalten-
   Layout (Notion column-list #block-39cb…c985): links Rohvideo,
   rechts "Abschnitt A — Gemeinkosten"-Heading + Text. Rohvideo
   (#block-39cb…c8a4 / Anker "Wir bauen zwei Datenbanken") per
   JS-Marker .tsmac-host versteckt, freigestellter MacBook-Poster
   (build.png -> Lektion 2.6 im Screen) + Play-Button, Klick ->
   geteilte Lightbox #tsmac-lb. Nur auf /gemeinkosten-mitarbeiterlhne.
   Poster: img/gemeinkosten-mac/pc.png (jsDelivr).
   ============================================================ */
(function(){
  if(window.__tsmacGk) return; window.__tsmacGk=true;
  var POSTER="https://cdn.jsdelivr.net/gh/Tastyrob123/kurs@main/img/gemeinkosten-mac/pc.png";
  (function(){ var pre=new Image(); pre.src=POSTER; })();
  var VID='#block-39cb9546553480c8a4d0e1fc54cfcb87';
  var PHRASE='Wir bauen zwei Datenbanken';
  var CSS=[
    '.page__gemeinkosten-mitarbeiterlhne .notion-video.tsmac-host video{display:none!important;}',
    '.page__gemeinkosten-mitarbeiterlhne .tsmac{position:relative;cursor:pointer;display:block;width:100%;line-height:0;background:transparent;}',
    '.page__gemeinkosten-mitarbeiterlhne .tsmac img{width:100%;height:auto;display:block;transition:transform .5s ease;}',
    '.page__gemeinkosten-mitarbeiterlhne .tsmac:hover img{transform:scale(1.02);}',
    '.page__gemeinkosten-mitarbeiterlhne .tsmac__play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;}',
    '.page__gemeinkosten-mitarbeiterlhne .tsmac__play span{width:76px;height:76px;border-radius:50%;background:rgba(255,255,255,.16);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.55);display:flex;align-items:center;justify-content:center;transition:transform .3s,background .3s;}',
    '.page__gemeinkosten-mitarbeiterlhne .tsmac__play span::after{content:"";border-style:solid;border-width:12px 0 12px 20px;border-color:transparent transparent transparent #fff;margin-left:5px;}',
    '.page__gemeinkosten-mitarbeiterlhne .tsmac:hover .tsmac__play span{transform:scale(1.08);background:rgba(255,255,255,.26);}',
    '#tsmac-lb{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;background:rgba(5,6,11,.85);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);padding:4vw;opacity:0;transition:opacity .35s ease;}',
    '#tsmac-lb.open{display:flex;opacity:1;}',
    '#tsmac-lb .tsmac-stage{transform:scale(.94);transition:transform .4s cubic-bezier(.2,.7,.2,1);width:min(92vw,1180px);}',
    '#tsmac-lb.open .tsmac-stage{transform:scale(1);}',
    '#tsmac-lb video{width:100%;max-height:86vh;border-radius:12px;box-shadow:0 40px 120px rgba(0,0,0,.6);background:#000;display:block;}',
    '#tsmac-lb__close{position:absolute;top:22px;right:28px;width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.08);color:#fff;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;}'
  ].join('');
  function injectCSS(){ if(document.getElementById('tsmac-gk-css'))return; var s=document.createElement('style'); s.id='tsmac-gk-css'; s.textContent=CSS; document.head.appendChild(s); }
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
  function findVid(scope){
    var b=scope.querySelector(VID);
    if(b){ var v=b.matches&&b.matches('.notion-video')?b:b.querySelector('.notion-video'); if(v&&v.querySelector('video')) return v; }
    var texts=scope.querySelectorAll('.notion-text,p');
    for(var i=0;i<texts.length;i++){
      if(texts[i].textContent && texts[i].textContent.indexOf(PHRASE)>-1){
        var cl=texts[i].closest('.notion-column-list'); if(cl){ var vv=cl.querySelector('.notion-video'); if(vv&&vv.querySelector('video')) return vv; }
      }
    }
    var g=scope.querySelectorAll('.notion-column-list .notion-video');
    for(var j=0;j<g.length;j++){ if(g[j].querySelector('video')) return g[j]; }
    return null;
  }
  function mount(){
    if(!/\/gemeinkosten-mitarbeiterlhne\/?$/.test(location.pathname)) return;
    injectCSS();
    var scope=document.querySelector('.page__gemeinkosten-mitarbeiterlhne'); if(!scope) return;
    var nv=findVid(scope); if(!nv) return;
    if(nv.querySelector('.tsmac')) return;
    var raw=nv.querySelector('video'); if(!raw) return;
    var src=raw.currentSrc||raw.getAttribute('src')||(raw.querySelector('source')&&raw.querySelector('source').getAttribute('src'));
    if(!src) return;
    nv.classList.add('tsmac-host');
    var poster=document.createElement('div'); poster.className='tsmac';
    poster.innerHTML='<img src="'+POSTER+'" alt="Lektion 2.6 – DB VI–VII: GK & Löhne" fetchpriority="high" decoding="async"><div class="tsmac__play"><span></span></div>';
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


/* ---- */

/* ============================================================
   gemeinkosten-mitarbeiterlhne — Exkurs "Die drei Brillen" (#tsbrille)
   Eine Absatz-Achse, drei Brillen darauf: Break-Even (Untergrenze,
   Linie) · Kapazitaet (Obergrenze, physisches Max) · Szenario
   (beweglicher Marker Pessimistisch 50% / Realistisch 70% /
   Optimistisch 90%). Segmented-Control schaltet das Szenario, der
   Fuell-Balken zeigt Verlust-(rot)/Gewinn-(gruen)Anteil, Zahlen
   zaehlen hoch. Darunter 3 Brillen-Karten (Was muss/kann/werde ich).
   Sitzt DIREKT UNTER dem Intro-Absatz "Werkzeug mit drei Brillen".
   Nur auf /gemeinkosten-mitarbeiterlhne. Muster = #tsd5.
   Zahlen = Beispielwerte (Text-Beispiel 80x26x70%; Break-Even
   illustrativ 9.000 EUR / 9 EUR DB = 1.000 Stueck).
   ============================================================ */
(function(){
  if(window.__tsbrille) return; window.__tsbrille=true;

  var GOLD='#c7b489', EASE='cubic-bezier(.16,1,.3,1)';
  var EINH_TAG=80, TAGE=26;
  var AXISMAX=EINH_TAG*TAGE;              // 2.080 physisches Maximum (100%)
  var FIX=9000, DB=9;                     // Beispiel Fixkosten+Personal / DB je Stueck
  var BREAKEVEN=Math.round(FIX/DB);       // 1.000 Stueck Untergrenze
  var SZEN=[
    {key:'pess', lab:'Pessimistisch', pct:50, foot:'50 % der Kapazität'},
    {key:'real', lab:'Realistisch',   pct:70, foot:'70 % der Kapazität'},
    {key:'opt',  lab:'Optimistisch',  pct:90, foot:'90 % der Kapazität'}
  ];
  var DEFAULT=1; // Realistisch

  function nf(n){ return Math.round(n).toLocaleString('de-DE'); }

  var CSS=
  '#tsbrille{width:min(1080px,94vw);margin:26px auto 56px;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif;color:#fff;opacity:0;transform:translateY(20px);transition:opacity .8s '+EASE+',transform .9s '+EASE+'}'+
  '#tsbrille.in{opacity:1;transform:none}'+
  '#tsbrille *{box-sizing:border-box}'+
  '#tsbrille .tb-head{text-align:center;margin:0 0 30px}'+
  '#tsbrille .tb-eye{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,sans-serif;font-weight:600;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:'+GOLD+';margin:0 0 12px}'+
  '#tsbrille .tb-title{margin:0;font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,sans-serif;font-weight:600;line-height:1.08;letter-spacing:-.02em;font-size:clamp(1.9rem,4.4vw,2.8rem)}'+
  '#tsbrille .tb-title .g{color:'+GOLD+'}'+
  '#tsbrille .tb-sub{max-width:660px;margin:16px auto 0;font-size:15.5px;line-height:1.62;color:rgba(255,255,255,.72)}'+
  /* Haupt-Glaskarte mit der Achse */
  '#tsbrille .tb-stage{position:relative;border-radius:22px;padding:34px 34px 30px;background:linear-gradient(180deg,rgba(255,255,255,.052),rgba(255,255,255,.022));border:1px solid rgba(199,180,137,.24);box-shadow:0 30px 80px -28px rgba(0,0,0,.72),inset 0 1px 0 rgba(255,255,255,.07);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px)}'+
  '#tsbrille .tb-axlabel{display:flex;justify-content:space-between;align-items:baseline;margin:0 0 30px}'+
  '#tsbrille .tb-axlabel .l{font-size:12.5px;letter-spacing:.02em;color:rgba(255,255,255,.55)}'+
  '#tsbrille .tb-axlabel .r{font-size:12.5px;color:rgba(255,255,255,.4)}'+
  /* Achse / Balken */
  '#tsbrille .tb-track{position:relative;height:22px;border-radius:999px;background:rgba(255,255,255,.07);box-shadow:inset 0 1px 3px rgba(0,0,0,.45);margin:56px 0 0}'+
  '#tsbrille .tb-fill{position:absolute;left:0;top:0;bottom:0;width:0;border-radius:999px;transition:width .9s '+EASE+'}'+
  '#tsbrille .tb-fill .seg{position:absolute;top:0;bottom:0;border-radius:999px}'+
  '#tsbrille .tb-seg-loss{left:0;background:linear-gradient(180deg,#e35d76,#e32552);box-shadow:0 0 18px rgba(227,37,82,.4)}'+
  '#tsbrille .tb-seg-win{background:linear-gradient(180deg,#9FD3B9,#5FAE88);box-shadow:0 0 18px rgba(95,174,136,.45)}'+
  /* Break-Even Linie */
  '#tsbrille .tb-be{position:absolute;top:-16px;bottom:-16px;width:2px;background:repeating-linear-gradient(180deg,rgba(255,255,255,.85) 0,rgba(255,255,255,.85) 5px,transparent 5px,transparent 10px);transform:translateX(-1px);z-index:4}'+
  '#tsbrille .tb-be .cap{position:absolute;top:-30px;left:50%;transform:translateX(-50%);white-space:nowrap;font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,sans-serif;font-size:11px;font-weight:600;letter-spacing:.02em;color:#fff;background:rgba(8,10,18,.85);border:1px solid rgba(255,255,255,.2);border-radius:999px;padding:4px 11px;box-shadow:0 6px 18px rgba(0,0,0,.5)}'+
  /* Kapazitaets-Obergrenze Endkappe (Goldlinie am Bar-Ende; Beschriftung via Kopfzeile + Skala) */
  '#tsbrille .tb-cap-max{position:absolute;right:0;top:-16px;bottom:-16px;width:2px;background:linear-gradient(180deg,rgba(199,180,137,.9),rgba(199,180,137,.35));z-index:3}'+
  /* Szenario-Marker (beweglicher Bead) */
  '#tsbrille .tb-marker{position:absolute;top:50%;left:0;width:28px;height:28px;margin:-14px 0 0 -14px;border-radius:50%;background:radial-gradient(circle at 34% 30%,#fbf5e6,'+GOLD+' 68%);border:1px solid rgba(255,255,255,.5);box-shadow:0 0 0 7px rgba(199,180,137,.15),0 6px 16px rgba(0,0,0,.6);z-index:6;transition:left .9s '+EASE+'}'+
  '#tsbrille .tb-scale{display:flex;justify-content:space-between;font-size:10.5px;color:rgba(255,255,255,.3);margin-top:14px}'+
  /* Ergebnis-Tiles */
  '#tsbrille .tb-out{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin:34px 0 0}'+
  '#tsbrille .tb-tile{border-radius:16px;padding:18px 14px;background:linear-gradient(180deg,rgba(255,255,255,.055),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.09);box-shadow:inset 0 1px 0 rgba(255,255,255,.06);text-align:center}'+
  '#tsbrille .tb-tile.hot{background:linear-gradient(180deg,rgba(199,180,137,.16),rgba(199,180,137,.05));border-color:rgba(199,180,137,.5)}'+
  '#tsbrille .tb-tile .tl{font-size:11.5px;letter-spacing:.02em;color:rgba(255,255,255,.55);margin:0 0 9px}'+
  '#tsbrille .tb-tile .tv{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,sans-serif;font-size:clamp(1.5rem,3.2vw,2rem);font-weight:700;letter-spacing:-.02em;color:#fff;line-height:1}'+
  '#tsbrille .tb-tile.hot .tv{color:'+GOLD+';font-size:clamp(1.7rem,3.6vw,2.35rem)}'+
  '#tsbrille .tb-tile.win .tv{color:#9FD3B9}'+
  '#tsbrille .tb-tile .tu{font-size:11.5px;color:rgba(255,255,255,.42);margin-top:7px}'+
  /* Szenario Segmented-Control */
  '#tsbrille .tb-seg-ctrl{display:flex;gap:8px;justify-content:center;margin:30px auto 0;max-width:520px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:999px;padding:6px}'+
  '#tsbrille .tb-seg-btn{flex:1;border:0;background:transparent;color:rgba(255,255,255,.62);font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:13.5px;font-weight:600;letter-spacing:.01em;padding:11px 8px;border-radius:999px;cursor:pointer;transition:color .2s ease,background .3s '+EASE+',box-shadow .3s ease}'+
  '#tsbrille .tb-seg-btn .pc{display:block;font-size:11px;font-weight:500;color:rgba(255,255,255,.4);margin-top:3px}'+
  '#tsbrille .tb-seg-btn:hover{color:#fff}'+
  '#tsbrille .tb-seg-btn.on{background:linear-gradient(180deg,rgba(199,180,137,.24),rgba(199,180,137,.09));color:#fff;box-shadow:inset 0 1px 0 rgba(255,255,255,.1),0 4px 14px rgba(0,0,0,.4)}'+
  '#tsbrille .tb-seg-btn.on .pc{color:'+GOLD+'}'+
  '#tsbrille .tb-formula{font-size:14px;color:rgba(255,255,255,.8);text-align:center;margin:26px auto 0;max-width:640px;line-height:1.6}'+
  '#tsbrille .tb-formula b{color:'+GOLD+';font-weight:600}'+
  /* Drei Brillen-Karten */
  '#tsbrille .tb-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:26px 0 0}'+
  '#tsbrille .tb-card{border-radius:18px;padding:24px 22px;background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.02));border:1px solid rgba(199,180,137,.2);box-shadow:0 24px 60px -30px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.06);opacity:0;transform:translateY(16px);transition:opacity .6s '+EASE+',transform .65s '+EASE+'}'+
  '#tsbrille.in .tb-card{opacity:1;transform:none}'+
  '#tsbrille .tb-card .ic{width:40px;height:40px;margin:0 0 16px;display:flex;align-items:center;justify-content:center;border-radius:12px;background:linear-gradient(180deg,rgba(199,180,137,.18),rgba(199,180,137,.06));border:1px solid rgba(199,180,137,.32)}'+
  '#tsbrille .tb-card .ic svg{width:22px;height:22px;display:block}'+
  '#tsbrille .tb-card .ct{font-family:"Lineal TS",-apple-system,BlinkMacSystemFont,sans-serif;font-size:1.15rem;font-weight:600;letter-spacing:-.01em;color:#fff;margin:0 0 4px}'+
  '#tsbrille .tb-card .cq{font-size:13.5px;color:rgba(255,255,255,.6);margin:0 0 16px;line-height:1.5}'+
  '#tsbrille .tb-card .cr{display:inline-block;font-size:12px;font-weight:600;letter-spacing:.01em;color:'+GOLD+';background:linear-gradient(180deg,rgba(199,180,137,.16),rgba(199,180,137,.06));border:1px solid rgba(199,180,137,.3);border-radius:999px;padding:6px 13px}'+
  '@media(max-width:820px){'+
    '#tsbrille .tb-stage{padding:26px 20px 24px}'+
    '#tsbrille .tb-out{grid-template-columns:1fr;gap:10px}'+
    '#tsbrille .tb-cards{grid-template-columns:1fr;gap:12px}'+
    '#tsbrille .tb-seg-btn{font-size:12.5px;padding:10px 4px}'+
  '}'+
  '@media(prefers-reduced-motion:reduce){'+
    '#tsbrille,#tsbrille.in{opacity:1;transform:none}'+
    '#tsbrille .tb-fill,#tsbrille .tb-marker{transition:none}'+
    '#tsbrille .tb-card{opacity:1;transform:none;transition:none}'+
  '}';

  function injectCSS(){ if(document.getElementById('tsbrille-css'))return; var s=document.createElement('style'); s.id='tsbrille-css'; s.textContent=CSS; document.head.appendChild(s); }

  var G_ICON='<svg viewBox="0 0 24 24" fill="none" stroke="'+GOLD+'" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="6.5" cy="14" r="3.5"/><circle cx="17.5" cy="14" r="3.5"/><path d="M10 13c.7-.8 3.3-.8 4 0"/><path d="M3 11l2-4h3M21 11l-2-4h-3"/></svg>';

  var CARDS=[
    {t:'Break-Even', q:'„Was muss ich mindestens?" — rechnet von den Kosten her.', r:'Untergrenze'},
    {t:'Kapazität', q:'„Was kann ich überhaupt?" — rechnet vom Laden her, was physisch geht.', r:'Obergrenze'},
    {t:'Szenario', q:'„Was werde ich wohl?" — spielt gut / mittel / schlecht durch.', r:'Realistischer Bereich'}
  ];

  function build(){
    var root=document.createElement('div'); root.id='tsbrille';
    var bePct=BREAKEVEN/AXISMAX*100;
    var segHTML=SZEN.map(function(s,i){
      return '<button type="button" class="tb-seg-btn'+(i===DEFAULT?' on':'')+'" data-i="'+i+'">'+s.lab+'<span class="pc">'+s.pct+' %</span></button>';
    }).join('');
    var cardsHTML=CARDS.map(function(c,i){
      return '<div class="tb-card" style="transition-delay:'+(160+i*90)+'ms">'+
        '<div class="ic">'+G_ICON+'</div>'+
        '<h4 class="ct">'+c.t+'</h4>'+
        '<p class="cq">'+c.q+'</p>'+
        '<span class="cr">'+c.r+'</span>'+
      '</div>';
    }).join('');
    root.innerHTML=
      '<div class="tb-head">'+
        '<p class="tb-eye">Exkurs</p>'+
        '<h3 class="tb-title">Dieselbe Frage, <span class="g">drei Brillen</span></h3>'+
        '<p class="tb-sub">„Lohnt sich der Laden?" — von unten (Break-Even), von oben (Kapazität) und realistisch dazwischen (Szenario). Schalte die Auslastung um und sieh, wo dein Absatz landet.</p>'+
      '</div>'+
      '<div class="tb-stage">'+
        '<div class="tb-axlabel"><span class="l">Absatz pro Monat</span><span class="r">Kapazität: '+EINH_TAG+' × '+TAGE+' = '+nf(AXISMAX)+' Stück max</span></div>'+
        '<div class="tb-track">'+
          '<div class="tb-fill"><div class="seg tb-seg-loss"></div><div class="seg tb-seg-win"></div></div>'+
          '<div class="tb-be" style="left:'+bePct+'%"><span class="cap">Break-Even · '+nf(BREAKEVEN)+'</span></div>'+
          '<div class="tb-cap-max"></div>'+
          '<div class="tb-marker"></div>'+
        '</div>'+
        '<div class="tb-scale"><span>0</span><span>'+nf(AXISMAX)+' Stück</span></div>'+
        '<div class="tb-out">'+
          '<div class="tb-tile"><p class="tl">Untergrenze · Break-Even</p><div class="tv">'+nf(BREAKEVEN)+'</div><div class="tu">Stück / Monat</div></div>'+
          '<div class="tb-tile hot"><p class="tl">Möglicher Absatz · Szenario</p><div class="tv" data-out="absatz">–</div><div class="tu">Stück / Monat</div></div>'+
          '<div class="tb-tile win"><p class="tl">Gewinn-Zone · über Break-Even</p><div class="tv" data-out="gewinn">–</div><div class="tu">Stück Puffer</div></div>'+
        '</div>'+
        '<div class="tb-seg-ctrl">'+segHTML+'</div>'+
        '<p class="tb-formula"><b>'+EINH_TAG+' Einheiten/Tag × '+TAGE+' Tage × Auslastung</b> = möglicher Absatz. Alles über der Break-Even-Linie ist <b>Gewinn</b>.</p>'+
      '</div>'+
      '<div class="tb-cards">'+cardsHTML+'</div>';
    return root;
  }

  function countTo(el,target,fmt){
    if(!el)return;
    var dur=800,t0=null,done=false;
    function finish(){ if(done)return; done=true; el.textContent=fmt(target); }
    function step(now){ if(done)return; if(t0===null)t0=now; var p=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-p,3); el.textContent=fmt(target*e); if(p<1)requestAnimationFrame(step); else finish(); }
    requestAnimationFrame(step);
    setTimeout(finish, dur+150);
  }

  var REDUCE=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function apply(root, idx, animate){
    var s=SZEN[idx];
    var absatz=Math.round(AXISMAX*s.pct/100);
    var gewinn=Math.max(0,absatz-BREAKEVEN);
    var absPct=absatz/AXISMAX*100, bePct=BREAKEVEN/AXISMAX*100;
    root.__idx=idx;
    // Segmented-Control
    root.querySelectorAll('.tb-seg-btn').forEach(function(b){ b.classList.toggle('on', parseInt(b.getAttribute('data-i'),10)===idx); });
    // Balken
    var fill=root.querySelector('.tb-fill'); if(fill)fill.style.width=absPct+'%';
    var loss=root.querySelector('.tb-seg-loss'), win=root.querySelector('.tb-seg-win');
    // Verlust-Segment: 0 -> min(absatz,BE), in % der GESAMTACHSE -> als px via width des fills? nutze % der Achse
    var lossW=Math.min(absPct,bePct);          // % der Gesamtachse
    var winStart=Math.min(absPct,bePct);
    var winW=Math.max(0,absPct-bePct);
    // seg sind Kinder des fill (Breite=absPct% der Achse). Positioniere relativ zur Achse via left/width in % der ACHSE,
    // aber fill ist absPct breit -> rechne seg-Breiten als % von absPct.
    if(fill && absPct>0){
      if(loss){ loss.style.left='0'; loss.style.width=(lossW/absPct*100)+'%'; }
      if(win){ win.style.left=(winStart/absPct*100)+'%'; win.style.width=(winW/absPct*100)+'%'; }
    }
    // Marker
    var mk=root.querySelector('.tb-marker'); if(mk)mk.style.left=absPct+'%';
    // Zahlen
    var oA=root.querySelector('[data-out="absatz"]'), oG=root.querySelector('[data-out="gewinn"]');
    if(animate && !REDUCE){
      countTo(oA, absatz, function(v){return nf(v);});
      countTo(oG, gewinn, function(v){return '+'+nf(v);});
    }else{
      if(oA)oA.textContent=nf(absatz);
      if(oG)oG.textContent='+'+nf(gewinn);
    }
  }

  function play(root){
    if(root.__played)return; root.__played=true;
    root.classList.add('in');
    if(REDUCE){ apply(root, DEFAULT, false); return; }
    setTimeout(function(){ apply(root, DEFAULT, true); }, 450);
  }

  function findAnchor(){
    var p=document.querySelectorAll('p.notion-text__content, .notion-text__content');
    for(var i=0;i<p.length;i++){ if((p[i].textContent||'').indexOf('Werkzeug mit drei Brillen')>-1) return p[i].closest('[id^="block-"]')||p[i]; }
    return document.getElementById('block-e0117226860f406fb4ab5c7de84ee1a1');
  }
  function inView(el){ var r=el.getBoundingClientRect(); return r.top<(window.innerHeight*0.8)&&r.bottom>(window.innerHeight*0.2); }

  function mount(){
    if(!/\/gemeinkosten-mitarbeiterlhne\/?$/.test(location.pathname)){ var e=document.getElementById('tsbrille'); if(e&&e.parentNode)e.parentNode.removeChild(e); return; }
    if(document.getElementById('tsbrille')) return;
    var a=findAnchor(); if(!a) return;
    injectCSS();
    var root=build();
    a.parentNode.insertBefore(root, a.nextSibling);
    apply(root, DEFAULT, false);
    root.querySelector('[data-out="absatz"]').textContent='–';
    root.querySelector('[data-out="gewinn"]').textContent='–';
    root.querySelectorAll('.tb-seg-btn').forEach(function(btn){
      btn.addEventListener('click', function(){ apply(root, parseInt(btn.getAttribute('data-i'),10)||0, true); });
    });
    var io=new IntersectionObserver(function(ev){ if(ev[0].isIntersecting){ play(root); io.disconnect(); } },{threshold:.25});
    io.observe(root);
    if(inView(root)) play(root);
    var poll=setInterval(function(){ if(!document.body.contains(root)){ clearInterval(poll); return; } if(inView(root)){ play(root); clearInterval(poll); } },250);
    setTimeout(function(){ clearInterval(poll); },20000);
  }
  mount();
  document.addEventListener("DOMContentLoaded", mount);
  new MutationObserver(mount).observe(document.documentElement,{childList:true,subtree:true});
})();
