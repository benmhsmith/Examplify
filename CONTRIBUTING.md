# Contributing to Provo

Provo is proprietary software owned by Benjamin Smith. It is built for brand-new learners, so accuracy and plain language matter more than anything else.

## Report a problem or suggest an idea (anyone)

- **Wrong answer or confusing question:** open an [issue](https://github.com/benmhsmith/Provo/issues/new/choose) and choose **Wrong answer or confusing question**. Say which exam, which module, the question text, and why you think it is wrong. A link to an official source helps most.
- **Topic or feature idea:** open an issue and choose **Idea**.

Reports and ideas are welcome from everyone. Code and content changes are accepted only from people the owner has approved in writing.

## Content rules

1. **Original questions only.** Never copy questions from a real exam, a "brain dump", or a paid course. Sharing real exam content breaks the exam's candidate agreement and can get learners' certifications revoked.
2. **Check every fact against a primary source**: the official exam objectives, the relevant RFC or IEEE standard, or vendor documentation. Put the source in your pull request.
3. **One defensible answer.** Every wrong option should be clearly wrong for a stated reason, and the explanation should say why the runner-up loses.
4. **Plain language.** Short sentences, terms defined the first time they appear, no jokes that depend on insider knowledge.

## Branches

- `main` always matches the latest release. Do not commit straight to it.
- Work on a branch named for what it is:
  - `network-plus/<short-description>` for changes to one exam, for example `network-plus/fix-ospf-question`
  - `core/<short-description>` for shared engine work
  - `security-plus` (or another exam name) while a new exam is being built
- Open a pull request into `main`. It is merged after review, then released.

## Adding a new exam

1. Create a branch named after the exam, for example `security-plus`.
2. Add a folder under `certs/`, for example `certs/security-plus/`, with the same layout as `certs/network-plus/`: `src/`, `joplin-plugin/`, `scripts/`, `README.md`, `CHANGELOG.md`, `UNRELEASED.md`.
3. Give the Joplin plugin its own ID in `manifest.json`, so it installs beside the other exams instead of replacing them.
4. Add the exam to the table in the top-level `README.md` and to `docs/index.html`.
5. Move anything the two exams genuinely share into `core/` as part of this work.

## Making a release (maintainers)

Each exam is versioned separately with [semantic versioning](https://semver.org/): `MAJOR.MINOR.PATCH`.

1. While you work, add one line per change to the exam's `UNRELEASED.md`.
2. Run the release script, for example: `python3 certs/network-plus/scripts/release.py 5.1.0`. It moves the notes into `CHANGELOG.md`, stamps the version, and updates the website copy in `docs/`.
3. Commit, open a pull request, and merge it into `main`.

Merging a new version into `main` starts the **Release Provo Network+** workflow (`.github/workflows/release-network-plus.yml`). It builds the `.jpl` and `.html`, creates the tag `network-plus-v5.1.0`, and publishes the GitHub Release with the changelog entry as its notes. If that version is already released, it does nothing. To rerun it by hand, open the repo's **Actions** tab, choose the workflow, and click **Run workflow**.

Tags are prefixed with the exam name so each exam's releases stay separate on one Releases page.

## Ownership of contributions

By submitting a change, you agree that the owner of Provo owns it and may use it under the terms in [LICENSE](LICENSE).
