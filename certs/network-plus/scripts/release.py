"""Build and release Provo Network+.

Make a new version (run on your own machine or in a Claude session, then commit):
    python3 certs/network-plus/scripts/release.py 4.1.0
    python3 certs/network-plus/scripts/release.py 4.1.0 "What changed"

  If no notes are given, they come from certs/network-plus/UNRELEASED.md, which is then emptied.
  This adds the notes to CHANGELOG.md, embeds the changelog in the Joplin plugin, stamps the
  version, builds the .jpl and .html into build/, and copies the web page into docs/network-plus/
  for GitHub Pages.

Helper modes used by .github/workflows/release-network-plus.yml (it runs when a new
version is merged into main):
    python3 certs/network-plus/scripts/release.py --build-only
        Rebuild the .jpl and .html for the version already committed (no files are edited).
    python3 certs/network-plus/scripts/release.py --notes 4.1.0
        Print the GitHub Release notes for that version, taken from CHANGELOG.md.
"""
import html as html_lib
import json
import os
import re
import shutil
import subprocess
import sys
import tarfile

CERT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
REPO = os.path.normpath(os.path.join(CERT, '..', '..'))
SRC = os.path.join(CERT, 'src', 'provo-network-plus.html')
PLUGIN = os.path.join(CERT, 'joplin-plugin')
DIST = os.path.join(PLUGIN, 'dist')
OUT = os.path.join(CERT, 'build')
LOG = os.path.join(CERT, 'CHANGELOG.md')
UNREL = os.path.join(CERT, 'UNRELEASED.md')
PAGES = os.path.join(REPO, 'docs', 'network-plus', 'index.html')
REPO_URL = 'https://github.com/benmhsmith/Provo'
sys.path.insert(0, os.path.join(REPO, 'core'))
import current_release  # noqa: E402


def run(cmd, cwd):
    subprocess.run(cmd, cwd=cwd, check=True, stdout=subprocess.DEVNULL)


def section(version):
    """The body of '## vX.Y.Z' in CHANGELOG.md."""
    text = open(LOG).read()
    m = re.search(r'^## v' + re.escape(version) + r'\n(.*?)(?=^## v|\Z)', text, flags=re.S | re.M)
    assert m, f'v{version} is not in CHANGELOG.md'
    return m.group(1).strip()


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


def build(version):
    """Build the Joplin plugin and the standalone page into build/."""
    os.makedirs(OUT, exist_ok=True)
    run([sys.executable, '-I', 'build.py'], PLUGIN)
    run([sys.executable, '-I', 'build_editor.py'], PLUGIN)
    for f in ['nft.js', 'editor.js', 'index.js']:
        run(['node', '--check', os.path.join('dist', f)], PLUGIN)
    jpl = os.path.join(OUT, f'provo-network-plus-v{version}.jpl')
    with tarfile.open(jpl, 'w', format=tarfile.PAX_FORMAT) as tar:
        for f in ['manifest.json', 'index.js', 'contentScript.js', 'nft.js', 'nft.css', 'editor.js', 'editor.css', 'OFL.txt']:
            tar.add(os.path.join(DIST, f), arcname=f)
        for n in (16, 32, 48, 128):
            tar.add(os.path.join(DIST, 'icons', f'icon-{n}.png'), arcname=f'icons/icon-{n}.png')
    page = os.path.join(OUT, f'Provo-Network-Plus-v{version}.html')
    run([sys.executable, '-I', os.path.join(CERT, 'scripts', 'mkstand.py'), SRC, page], CERT)
    return jpl, page


def release_notes(version):
    return (current_release.NOTE + f'**Provo Network+ v{version}** for CompTIA Network+ N10-009.\n\n'
            '## Downloads\n'
            f'- **Joplin plugin (desktop and Android):** `provo-network-plus-v{version}.jpl`\n'
            f'- **Standalone web page (works offline):** `Provo-Network-Plus-v{version}.html`\n'
            '- **Use it in your browser:** https://benmhsmith.github.io/Provo/network-plus/\n\n'
            f'Setup steps for each option: [Provo Network+ README]({REPO_URL}/tree/main/certs/network-plus#how-to-use-it)\n\n'
            '## What changed\n' + section(version) + '\n\n'
            f'Full history: [CHANGELOG.md]({REPO_URL}/blob/main/certs/network-plus/CHANGELOG.md)\n')


def committed_version():
    return json.load(open(os.path.join(DIST, 'manifest.json')))['version']


def new_version(version, notes):
    assert re.fullmatch(r'\d+\.\d+\.\d+', version), 'version must look like 4.1.0'
    from_unreleased = not notes
    if from_unreleased and os.path.exists(UNREL):
        notes = open(UNREL).read().strip()
    assert notes, 'no release notes: pass them as an argument or fill UNRELEASED.md'

    old = open(LOG).read()
    head, _, rest = old.partition('\n')
    if f'## v{version}' not in old:
        open(LOG, 'w').write(head + f'\n\n## v{version}\n{notes}\n' + rest)

    idx = os.path.join(DIST, 'index.js')
    t = open(idx).read()
    t2 = re.sub(r'/\*CHANGELOG\*/.*?/\*END\*/',
                lambda m: '/*CHANGELOG*/' + json.dumps(md_to_html(open(LOG).read())) + '/*END*/',
                t, count=1, flags=re.S)
    assert '/*CHANGELOG*/' in t2
    open(idx, 'w').write(t2)

    for path in [SRC, os.path.join(PLUGIN, 'build.py'), idx]:
        s = open(path).read()
        s2 = re.sub(r'<span class="badge">v[0-9.]+</span>', f'<span class="badge">v{version}</span>', s)
        s2 = re.sub(r"version: '[0-9.]+'", f"version: '{version}'", s2)
        if s2 != s:
            open(path, 'w').write(s2)
    m = json.load(open(os.path.join(DIST, 'manifest.json')))
    m['version'] = version
    json.dump(m, open(os.path.join(DIST, 'manifest.json'), 'w'), indent=2)

    for f in current_release.update(REPO, 'network-plus', version):
        print('current release link updated:', f)
    jpl, page = build(version)
    os.makedirs(os.path.dirname(PAGES), exist_ok=True)
    shutil.copyfile(page, PAGES)
    if from_unreleased and os.path.exists(UNREL):
        open(UNREL, 'w').write('')
    print(jpl)
    print(page)
    print(PAGES)
    print(f'\nNext: commit and merge into main. The release workflow then publishes network-plus-v{version}.')


if __name__ == '__main__':
    args = sys.argv[1:]
    if args[:1] == ['--build-only']:
        for path in build(committed_version()):
            print(path)
    elif args[:1] == ['--notes']:
        sys.stdout.write(release_notes(args[1]))
    elif args:
        new_version(args[0], args[1] if len(args) > 1 else '')
    else:
        print(__doc__)
        sys.exit(1)
