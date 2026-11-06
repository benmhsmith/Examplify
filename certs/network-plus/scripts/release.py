"""Build and release Examplify Network+.

Usage (from anywhere):
    python3 certs/network-plus/scripts/release.py 4.0.0
    python3 certs/network-plus/scripts/release.py 4.0.0 "What changed"

If no notes are given, the notes come from certs/network-plus/UNRELEASED.md,
which is then emptied. The script:
  1. adds the notes to CHANGELOG.md and embeds the changelog in the Joplin plugin,
  2. stamps the version into the web page and the plugin,
  3. builds the Joplin plugin (.jpl) and the standalone web page (.html) into build/,
  4. copies the web page to docs/network-plus/index.html for GitHub Pages.
"""
import html as html_lib
import json
import os
import re
import shutil
import subprocess
import sys
import tarfile

V = sys.argv[1] if len(sys.argv) > 1 else ''
assert re.fullmatch(r'\d+\.\d+\.\d+', V), 'version must look like 4.0.0'

CERT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
REPO = os.path.normpath(os.path.join(CERT, '..', '..'))
SRC = os.path.join(CERT, 'src', 'examplify-network-plus.html')
PLUGIN = os.path.join(CERT, 'joplin-plugin')
DIST = os.path.join(PLUGIN, 'dist')
OUT = os.path.join(CERT, 'build')
LOG = os.path.join(CERT, 'CHANGELOG.md')
UNREL = os.path.join(CERT, 'UNRELEASED.md')
PAGES = os.path.join(REPO, 'docs', 'network-plus', 'index.html')
os.makedirs(OUT, exist_ok=True)

notes = sys.argv[2] if len(sys.argv) > 2 else ''
if not notes and os.path.exists(UNREL):
    notes = open(UNREL).read().strip()
assert notes, 'no release notes: pass them as an argument or fill UNRELEASED.md'

old = open(LOG).read()
head, _, rest = old.partition('\n')
if f'## v{V}' not in old:
    open(LOG, 'w').write(head + f'\n\n## v{V}\n{notes}\n' + rest)


def md_to_html(md):
    out, in_list = [], False

    def inline(t):
        t = html_lib.escape(t)
        return re.sub(r'`+([^`]+?)`+', r'<code>\1</code>', t)

    for line in md.split('\n')[1:]:
        if line.startswith('- '):
            if not in_list:
                out.append('<ul style="margin:0 0 12px;padding-left:1.2em">')
                in_list = True
            out.append('<li style="margin:.2em 0">' + inline(line[2:]) + '</li>')
            continue
        if in_list:
            out.append('</ul>')
            in_list = False
        if line.startswith('## '):
            out.append('<h3 style="margin:14px 0 4px;font-size:1.1em">' + inline(line[3:]) + '</h3>')
        elif line.strip():
            out.append('<p style="margin:0 0 12px">' + inline(line) + '</p>')
    if in_list:
        out.append('</ul>')
    return ''.join(out)


idx = os.path.join(DIST, 'index.js')
t = open(idx).read()
t2 = re.sub(r'/\*CHANGELOG\*/.*?/\*END\*/',
            lambda m: '/*CHANGELOG*/' + json.dumps(md_to_html(open(LOG).read())) + '/*END*/',
            t, count=1, flags=re.S)
assert '/*CHANGELOG*/' in t2
open(idx, 'w').write(t2)


def stamp(path):
    s = open(path).read()
    s2 = re.sub(r'<span class="badge">v[0-9.]+</span>', f'<span class="badge">v{V}</span>', s)
    s2 = re.sub(r"version: '[0-9.]+'", f"version: '{V}'", s2)
    if s2 != s:
        open(path, 'w').write(s2)


for p in [SRC, os.path.join(PLUGIN, 'build.py'), idx]:
    stamp(p)
m = json.load(open(os.path.join(DIST, 'manifest.json')))
m['version'] = V
json.dump(m, open(os.path.join(DIST, 'manifest.json'), 'w'), indent=2)


def run(cmd, cwd):
    subprocess.run(cmd, cwd=cwd, check=True, stdout=subprocess.DEVNULL)


run([sys.executable, '-I', 'build.py'], PLUGIN)
run([sys.executable, '-I', 'build_editor.py'], PLUGIN)
for f in ['nft.js', 'editor.js', 'index.js']:
    run(['node', '--check', os.path.join('dist', f)], PLUGIN)

jpl = os.path.join(OUT, f'examplify-network-plus-v{V}.jpl')
with tarfile.open(jpl, 'w', format=tarfile.PAX_FORMAT) as tar:
    for f in ['manifest.json', 'index.js', 'contentScript.js', 'nft.js', 'nft.css', 'editor.js', 'editor.css', 'OFL.txt']:
        tar.add(os.path.join(DIST, f), arcname=f)

page = os.path.join(OUT, f'Examplify-Network-Plus-v{V}.html')
run([sys.executable, '-I', os.path.join(CERT, 'scripts', 'mkstand.py'), SRC, page], CERT)
os.makedirs(os.path.dirname(PAGES), exist_ok=True)
shutil.copyfile(page, PAGES)

if os.path.exists(UNREL) and len(sys.argv) <= 2:
    open(UNREL, 'w').write('')

print(jpl)
print(page)
print(PAGES)
