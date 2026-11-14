"""Keep each exam's "Current release" link up to date.

GitHub marks only one release in a repository as "Latest", so Provo shows every exam's current
version itself: in the Exams table of the main README, on the exam's own README, and on the
website's exam cards. Each exam's release script calls update() when it makes a new version.
"""
import os
import re

REPO_URL = 'https://github.com/benmhsmith/Provo'
NOTE = ('> Provo publishes each exam separately, and GitHub marks only one release as **Latest**. '
        f'For the current version of every exam, see [Current releases]({REPO_URL}#exams).\n\n')


def tag_url(slug, version):
    return f'{REPO_URL}/releases/tag/{slug}-v{version}'


def update(repo, slug, version):
    """Point every current-release link for this exam at slug-v<version>. Returns the files changed."""
    md = re.compile(rf'\[v[0-9.]+\]\({re.escape(REPO_URL)}/releases/tag/{slug}-v[0-9.]+\)')
    htm = re.compile(rf'href="{re.escape(REPO_URL)}/releases/tag/{slug}-v[0-9.]+">v[0-9.]+<')
    changed = []
    for rel in ['README.md', os.path.join('certs', slug, 'README.md'), os.path.join('docs', 'index.html')]:
        path = os.path.join(repo, rel)
        if not os.path.exists(path):
            continue
        s = open(path).read()
        s2 = md.sub(f'[v{version}]({tag_url(slug, version)})', s)
        s2 = htm.sub(f'href="{tag_url(slug, version)}">v{version}<', s2)
        if s2 != s:
            open(path, 'w').write(s2)
            changed.append(rel)
    return changed
