import os
HERE=os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
SRC=os.path.join(HERE,'..','src','examplify-network-plus.html')
import re, json
src=open(SRC).read()
css=src.split('<style>',1)[1].split('</style>',1)[0]
js=src.split('<script>',1)[1].split('</script>',1)[0]

# ---------- CSS: scope everything to .nft ----------
css=re.sub(r'/\*.*?\*/','',css,flags=re.S)
def parse(s):
    out=[];i=0
    while i<len(s):
        j=s.find('{',i)
        if j<0: break
        sel=s[i:j].strip()
        depth=1;k=j+1
        while depth:
            if s[k]=='{': depth+=1
            elif s[k]=='}': depth-=1
            k+=1
        out.append((sel,s[j+1:k-1]))
        i=k
    return out
def scope_sel(sel, dark=False):
    res=[]
    for part in sel.split(','):
        p=part.strip()
        if not p: continue
        if p.startswith('html.instructor') or p=='html' or p=='body::before' or p.startswith(':root[data-theme'): continue
        if p in (':root',):
            res.append('.nft.nft-dark' if dark else '.nft'); continue
        if p.startswith(':root:not('):
            res.append('.nft.nft-dark'); continue
        if p=='body': res.append('.nft'); continue
        if p=='*': res.append('.nft, .nft *'); continue
        res.append(('.nft.nft-dark ' if dark else '.nft ')+p)
    return ', '.join(res)
def emit(rules, dark=False):
    o=[]
    for sel,body in rules:
        if sel.startswith('@media (prefers-color-scheme'):
            o.append(emit(parse(body), dark=True)); continue
        if sel.startswith('@keyframes'):
            o.append(sel+'{'+body.strip()+'}'); continue  # animations are global; scoping them breaks them
        if sel.startswith('@media'):
            inner=emit(parse(body), dark)
            if inner.strip(): o.append(sel+'{'+inner+'}')
            continue
        s=scope_sel(sel, dark)
        if s: o.append(s+'{'+body.strip()+'}')
    return '\n'.join(o)
scoped=emit(parse(css))
reset = """
/* reset Joplin note-viewer styles inside the tool */
.nft{display:block;border:1px solid var(--line);border-radius:12px;overflow:hidden;margin:12px 0;text-align:left;font-size:16px}
.nft h1,.nft h2,.nft h3{border:0;padding:0;margin:0;background:none;color:inherit;font-family:var(--font-display);line-height:1.15}
.nft p{margin:.4em 0}
.nft table,.nft th,.nft td{border:0;background:transparent;color:inherit}
.nft tr{background:transparent!important}
.nft th,.nft td{border-bottom:1px solid var(--line)}
.nft ul,.nft ol{margin:.3em 0}
.nft a{text-decoration:none}
.nft code{background:none}
.nft [hidden]{display:none!important}
.nft .top{position:sticky;top:0}
.nft{position:relative}
.nft .rt-modal{position:absolute;align-items:flex-start;padding-top:24px}
.nft .rt-dialog{max-height:none}
.nft main{padding-block:16px 32px}
.nft-loading{padding:16px;font-family:system-ui,sans-serif}
.nft-wrap > .joplin-source{display:none!important}
.nft .nft-diag{margin-top:18px;font-size:13px;color:var(--muted)}
.nft .nft-diag summary{cursor:pointer}
.nft .gm-aura{position:absolute;z-index:3}
/* phone-width notes (Joplin Android) */
@media (max-width:760px){
.nft .dg svg{min-width:760px}
.nft .dg::after{content:"Swipe sideways to see the whole diagram.";display:block;font-size:.8rem;color:var(--muted);padding:2px 0 6px}
.nft .btn,.nft .chipbtn{min-height:44px}
.nft .chipbtn{display:inline-flex;align-items:center;justify-content:center;padding:6px 12px}
.nft .opt{min-height:52px}
.nft input.ans{width:100%}
.nft .rt-modal{padding-top:8px}
}
"""
open('dist/nft.css','w').write(open(os.path.join(HERE,'fonts.css')).read()+scoped+'\n'+reset)

# ---------- JS: run once per mounted block ----------
reps=[
 ('const $=(s,r=document)=>r.querySelector(s);','const $=(s,r=root)=>r.querySelector(s);'),
 ('''document.addEventListener("keydown",e=>{
  if(!curKeys || e.target.tagName==="INPUT" && e.key!=="Enter") return;''','''const __onKey=e=>{
  if(!root.isConnected){ document.removeEventListener("keydown",__onKey); return; }
  if(!curKeys || e.target.tagName==="INPUT" && e.key!=="Enter") return;'''),
 ('''  curKeys(e);
});''','''  curKeys(e);
};
document.addEventListener("keydown",__onKey);'''),
 ('function loadP(){ try{ return JSON.parse(localStorage.getItem(KEY)) || {}; }catch(e){ return {}; } }',
  'function loadP(){ try{ return JSON.parse(localStorage.getItem(KEY)) || {}; }catch(e){ return {}; } }'),
 ('function save(){ if(mode!=="student") return; try{ localStorage.setItem(KEY, JSON.stringify(P)); }catch(e){} }',
  'function save(){ const d=JSON.stringify(P); try{ localStorage.setItem(KEY, d); }catch(e){} api("save",d).catch(()=>{}); }'),
 ('const kb={prestige:P.prestige||0,everMastered:!!P.everMastered,secret:P.secret||0,secretOpen:!!P.secretOpen}; P=Object.assign({ports:{},items:{},subnet:[],ladderOrder:false,exams:[],acro:{},acroSecond:false,pbq:{}},kb); try{ localStorage.removeItem(KEY); }catch(e){} save(); viewProgress();',
  'const kb={prestige:P.prestige||0,everMastered:!!P.everMastered,secret:P.secret||0,secretOpen:!!P.secretOpen}; P=Object.assign({ports:{},items:{},subnet:[],ladderOrder:false,exams:[],acro:{},acroSecond:false,pbq:{}},kb); try{ localStorage.removeItem(KEY); }catch(e){} save(); viewProgress();'),
 ('examTimer=setInterval(()=>{ secs--;','examTimer=setInterval(()=>{ if(!root.isConnected){ clearInterval(examTimer); examTimer=null; return; } secs--;'),
 ('''  const h=(location.hash||"#home").slice(1);
  (ROUTES[h]||viewHome)();
  window.scrollTo(0,0);
}
window.addEventListener("hashchange",route);
/* a link to the page you are already on (e.g. "Exit exam" or "Take another" while on #exam) gets no hashchange event, so re-route by hand */
document.addEventListener("click",e=>{ const l=e.target.closest&&e.target.closest('a[href^="#"]'); if(!l) return; const h=l.getAttribute("href"); if(h===(location.hash||"#home")){ e.preventDefault(); route(); } });
route();''','''  (ROUTES[current]||viewHome)();
  if(navigated){ try{ root.scrollIntoView({block:"start"}); }catch(e){} }
}
let current="home", navigated=false;
function go(h){ current=h||"home"; navigated=true; route(); }
root.addEventListener("click",e=>{
  const a=e.target.closest && e.target.closest("a[href]");
  if(!a || !root.contains(a)) return;
  const href=a.getAttribute("href")||"";
  e.preventDefault(); e.stopPropagation();
  if(href.charAt(0)==="#"){ go(href.slice(1)); return; }
  if(/^https?:/i.test(href)){ api("open",href).catch(()=>{}); }
},true);
route();
api("load").then(v=>{ if(v){ try{ P=Object.assign({ports:{},items:{},subnet:[],ladderOrder:false,exams:[],acro:{},acroSecond:false,pbq:{}}, JSON.parse(v)); route(); }catch(e){} } }).catch(()=>{});'''),
]
js=re.sub(r'/\* Desktop / Mobile layout switch\..*?\}\)\(\);\n','',js,count=1,flags=re.S)
for a,b in reps:
    assert js.count(a)==1, 'missing: '+a[:60]
    js=js.replace(a,b)
js=js.replace('window.scrollTo(0,0);','try{ root.scrollIntoView({block:"start"}); }catch(e){}')
assert 'location.hash' not in js and 'window.scrollTo' not in js

shell='''<header class="top"><div class="top-in"><a class="brand" href="#home" aria-label="MyComputerCareer Provo, home"><span class="mycc-logo" aria-hidden="true"></span><span class="brand-div" aria-hidden="true"></span><span class="pvwrap"><b class="pvname"><span class="pvpro">Pro</span>vo</b><span class="pvbar" aria-hidden="true"><i class="pv1" style="flex:23"></i><i class="pv2" style="flex:20"></i><i class="pv3" style="flex:19"></i><i class="pv4" style="flex:14"></i><i class="pv5" style="flex:24"></i></span></span></a><a class="chipbtn" href="#cram" style="text-decoration:none;padding:6px 12px">Cram Sheet</a><a class="chipbtn" href="#progress" style="text-decoration:none;padding:6px 12px">Progress</a></div></header><main id="app"></main>'''
out='''/* Examplify Network+ — in-note renderer asset. Mounts the tool into every ```netplus-fast-track block in the note viewer. */
(function(){
  if(window.__nftLoaded) return; window.__nftLoaded=true;
  function isDark(){
    try{
      const c=getComputedStyle(document.body).backgroundColor.match(/\\d+(\\.\\d+)?/g);
      if(!c) return false; const [r,g,b]=c.map(Number);
      return (0.299*r+0.587*g+0.114*b) < 128 && !(c.length===4 && Number(c[3])===0);
    }catch(e){ return false; }
  }
  function mount(root){
    root.classList.toggle("nft-dark", isDark());
    const CS=root.getAttribute("data-cs")||"";
    function api(type,data){
      try{
        if(window.webviewApi && window.webviewApi.postMessage && CS){
          return Promise.resolve(window.webviewApi.postMessage(CS,{type:type,data:data}));
        }
      }catch(e){}
      return Promise.reject(new Error("no bridge"));
    }
    root.innerHTML=%s;
%s
  }
  function inRichText(){
    var b=document.body;
    return !!(b && (b.classList.contains("mce-content-body") || b.id==="tinymce")) || !!document.querySelector(".mce-content-body");
  }
  function showDiag(root){
    var cs=root.getAttribute("data-cs"); if(!cs || !window.webviewApi) return;
    Promise.resolve(window.webviewApi.postMessage(cs,{type:"diag"})).then(function(v){
      var app=root.querySelector("#app"); if(!app || !v) return;
      var el=document.createElement("details"); el.className="nft-diag";
      el.innerHTML='<summary>Full-width mode status (copy this if asked)</summary><pre style="white-space:pre-wrap;font-size:12px;margin:6px 0 0"></pre>';
      el.querySelector("pre").textContent=JSON.stringify(JSON.parse(v),null,1);
      var old=root.querySelector(".nft-diag"); if(old) old.remove();
      app.appendChild(el);
    }).catch(function(){});
  }
  function mountAll(){
    /* the Grand Architect glow belongs to study notes only: drop it when the note no longer has the tool */
    if(!document.querySelector("[data-nft-root]")){ var g=document.getElementById("nft-arch"); if(g) g.remove(); }
    var rt=inRichText();
    document.querySelectorAll("[data-nft-root]").forEach(function(el){
      if(el.getAttribute("data-mounted")==="1") return;
      el.setAttribute("data-mounted","1");
      if(rt){ el.setAttribute("contenteditable","false"); el.innerHTML='<div class="nft-loading"><b>Examplify Network+</b><br>This tool runs in the Markdown viewer. Switch editors (Toggle Editor) to use it. This block is safe to leave here.</div>'; return; }
      try{ mount(el); }catch(e){ el.textContent="Examplify Network+ failed to load: "+e.message; }
    });
  }
  document.addEventListener("joplin-noteDidUpdate", mountAll);
  try{ new MutationObserver(mountAll).observe(document.documentElement,{childList:true,subtree:true}); }catch(e){}
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", mountAll); else mountAll();
})();
''' % (json.dumps(shell), js)
open('dist/nft.js','w').write(out)
print('ok', len(out), len(scoped))
