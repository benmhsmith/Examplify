import os
HERE=os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
SRC=os.path.join(HERE,'..','src','examplify-network-plus.html')
import json
src=open(SRC).read()
css=src.split('<style>',1)[1].split('</style>',1)[0]
js=src.split('<script>',1)[1].split('</script>',1)[0]
css+="""
/* Joplin editor view: the host page doesn't scroll, so the tool scrolls inside its own container */
html,body{margin:0;height:100%;overflow:hidden}
body{font-size:16px}
[hidden]{display:none!important}
#nft-root{position:fixed;inset:0;overflow-y:auto;overflow-x:hidden;background:var(--bg)}
#nft-root .top{top:0}
"""
open('dist/editor.css','w').write(open(os.path.join(HERE,'fonts.css')).read()+css)
R=[
 ('function loadP(){ try{ return JSON.parse(localStorage.getItem(KEY)) || {}; }catch(e){ return {}; } }',
  'function loadP(){ if(window.__NFT_INIT!==undefined){ try{ return JSON.parse(window.__NFT_INIT||"{}")||{}; }catch(e){ return {}; } } try{ return JSON.parse(localStorage.getItem(KEY)) || {}; }catch(e){ return {}; } }'),
 ('function save(){ if(mode!=="student") return; try{ localStorage.setItem(KEY, JSON.stringify(P)); }catch(e){} }',
  'function save(){ const d=JSON.stringify(P); if(window.webviewApi){ try{ window.webviewApi.postMessage({type:"save",data:d}); }catch(e){} return; } try{ localStorage.setItem(KEY, d); }catch(e){} }'),
 ('const kb={prestige:P.prestige||0,everMastered:!!P.everMastered,secret:P.secret||0,secretOpen:!!P.secretOpen}; P=Object.assign({ports:{},items:{},subnet:[],ladderOrder:false,exams:[],acro:{},acroSecond:false,pbq:{}},kb); try{ localStorage.removeItem(KEY); }catch(e){} save(); viewProgress();',
  'const kb={prestige:P.prestige||0,everMastered:!!P.everMastered,secret:P.secret||0,secretOpen:!!P.secretOpen}; P=Object.assign({ports:{},items:{},subnet:[],ladderOrder:false,exams:[],acro:{},acroSecond:false,pbq:{}},kb); try{ localStorage.removeItem(KEY); }catch(e){} save(); viewProgress();'),
 ('  window.scrollTo(0,0);\n}','  window.scrollTo(0,0); var __r=document.getElementById("nft-root"); if(__r) __r.scrollTop=0;\n}'),
 ('});\nroute();\n',
  '});\nroute();\nwindow.__nftReload=function(v){ try{ P=Object.assign({ports:{},items:{},subnet:[],ladderOrder:false,exams:[],acro:{},acroSecond:false,pbq:{}}, JSON.parse(v||"{}")); }catch(e){} route(); };'),
]
for a,b in R:
    assert js.count(a)==1, 'missing: '+a[:60]
    js=js.replace(a,b)
out='''/* Examplify Network+ — Joplin editor view (full editor area). */
(function(){
  function ready(){ return document.getElementById('app') && document.querySelector('.top-in'); }
  function applyTheme(){
    try{
      var cs=getComputedStyle(document.documentElement);
      var bg=(cs.getPropertyValue('--joplin-background-color')||'').trim() || getComputedStyle(document.body).backgroundColor;
      var el=document.createElement('div'); el.style.color=bg; document.body.appendChild(el);
      var m=getComputedStyle(el).color.match(/\\d+(\\.\\d+)?/g); el.remove();
      if(!m) return; var lum=0.299*m[0]+0.587*m[1]+0.114*m[2];
      if(m.length===4 && Number(m[3])===0) return;
      document.documentElement.setAttribute('data-theme', lum<128?'dark':'light');
    }catch(e){}
  }
  function main(){
%s
  }
  function boot(){
    if(!ready()){ return setTimeout(boot,40); }
    applyTheme();
    document.addEventListener('click',function(e){
      var a=e.target.closest && e.target.closest('a[href]'); if(!a) return;
      var href=a.getAttribute('href')||'';
      if(/^https?:/i.test(href)){ e.preventDefault(); e.stopPropagation(); try{ window.webviewApi.postMessage({type:'open',data:href}); }catch(err){} }
    },true);
    if(window.webviewApi){
      if(window.webviewApi.onMessage){
        window.webviewApi.onMessage(function(m){
          var msg=(m && m.message) ? m.message : m;
          if(msg && msg.type==='reload' && window.__nftReload){
            window.webviewApi.postMessage({type:'load'}).then(function(v){ window.__nftReload(v); });
          }
        });
      }
      window.webviewApi.postMessage({type:'load'}).then(function(v){ window.__NFT_INIT=v||''; main(); }, function(){ window.__NFT_INIT=''; main(); });
    } else { main(); }
  }
  boot();
})();
''' % js
open('dist/editor.js','w').write(out)
print('editor built', len(out))
