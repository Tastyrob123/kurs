const http=require('http'),fs=require('fs');
const html=fs.readFileSync('/tmp/kurs/harness.html','utf8').replace('<script>\n  // Fake','<script>\n  // (pathname bereits korrekt)\n  void 0; /* skip */\n</script>\n<script>\n  // Fake');
const js=fs.readFileSync('/tmp/kurs/tslohn_inject.js','utf8');
http.createServer((req,res)=>{
  if(req.url.indexOf('/gemeinkosten-mitarbeiterlhne')===0){ res.writeHead(200,{'content-type':'text/html; charset=utf-8'}); res.end(html); }
  else if(req.url.indexOf('/tslohn_inject.js')===0){ res.writeHead(200,{'content-type':'application/javascript; charset=utf-8'}); res.end(js); }
  else { res.writeHead(404); res.end('nf'); }
}).listen(8791,()=>console.log('up on 8791'));
