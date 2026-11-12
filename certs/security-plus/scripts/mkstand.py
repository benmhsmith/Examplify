import os,re,sys
HERE=os.path.dirname(os.path.abspath(__file__))
src=sys.argv[1]; dst=sys.argv[2]
s=open(src).read()
s=re.sub(r'<link rel="preconnect"[^>]*>\n?','',s)
s=re.sub(r'<link rel="stylesheet" href="https://fonts.googleapis.com[^>]*>\n?','',s)
fonts=open(os.path.join(HERE,'..','joplin-plugin','fonts.css')).read()
out='<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-title" content="Provo N+">\n<meta name="description" content="Provo: CompTIA Security+ (SY0-701) study lab with drills, PBQs, and mini-exams.">\n<style>:root{color-scheme:light}body{margin:0;font-size:14px}img{max-width:100%}[hidden]{display:none!important}</style>\n<style>\n'+fonts+'</style>\n'
head,rest=s.split('<header class="top">',1)
open(dst,'w').write(out+head+'</head>\n<body>\n<header class="top">'+rest+'\n</body>\n</html>\n')
