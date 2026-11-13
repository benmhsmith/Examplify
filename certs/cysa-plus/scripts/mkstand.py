import os,re,sys
HERE=os.path.dirname(os.path.abspath(__file__))
src=sys.argv[1]; dst=sys.argv[2]
s=open(src).read()
s=re.sub(r'<link rel="preconnect"[^>]*>\n?','',s)
s=re.sub(r'<link rel="stylesheet" href="https://fonts.googleapis.com[^>]*>\n?','',s)
ICONS=os.path.join(HERE,'..','..','..','docs','images','icons')
import base64,urllib.parse
_svg=open(os.path.join(ICONS,'provo-icon-small.svg')).read().strip()
_b64=lambda f:base64.b64encode(open(os.path.join(ICONS,f),'rb').read()).decode()
icons='<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,'+urllib.parse.quote(_svg)+'">\n<link rel="apple-touch-icon" href="data:image/png;base64,'+_b64('apple-touch-icon.png')+'">\n<link rel="icon" type="image/png" sizes="192x192" href="data:image/png;base64,'+_b64('icon-192.png')+'">\n'
fonts=open(os.path.join(HERE,'..','joplin-plugin','fonts.css')).read()
out='<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">\n'+icons+'<meta name="apple-mobile-web-app-title" content="Provo CySA+">\n<meta name="description" content="Provo: CompTIA CySA+ (CS0-004) study lab with drills, scenarios, and mini-exams.">\n<style>:root{color-scheme:light}body{margin:0;font-size:14px}img{max-width:100%}[hidden]{display:none!important}</style>\n<style>\n'+fonts+'</style>\n'
head,rest=s.split('<header class="top">',1)
open(dst,'w').write(out+head+'</head>\n<body>\n<header class="top">'+rest+'\n</body>\n</html>\n')
