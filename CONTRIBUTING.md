# Contributing to Examplify

Thanks for helping. Examplify is built for brand-new learners, so accuracy and plain language matter more than anything else.

## Ways to help

- **Report a wrong answer or a confusing question.** Open an [issue](https://github.com/benmhsmith/examplify/issues). Say which exam, which module, the question text, and why you think it is wrong. A link to an official source helps most.
- **Suggest a topic or feature.** Open an issue and describe what you want to practice.
- **Change the code or content.** Follow the workflow below.

## Content rules

1. **Original questions only.** Never copy questions from a real exam, a "brain dump," or a paid course. Sharing real exam content breaks the exam's candidate agreement and can get learners' certifications revoked.
2. **Check every fact against a primary source**: the official exam objectives, the relevant RFC or IEEE standard, or vendor documentation. Put the source in your pull request.
3. **One defensible answer.** Every wrong option should be clearly wrong for a stated reason, and the explanation should say why the runner-up loses.
4. **Plain language.** Short sentences, terms defined the first time they appear, no jokes that depend on insider knowledge.

## Branches

- `main` always matches the latest release. Do not commit straight to it.
- Do your work on a branch named for what it is:
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
2. Run the release script, for example: `python3 certs/network-plus/scripts/release.py 4.1.0`. It moves the notes into `CHANGELOG.md`, stamps the version, and updates the website copy in `docs/`.
3. Commit, open a pull request, and merge it into `main`.
4. Tag the merged commit and push the tag: `git tag network-plus-v4.1.0 && git push origin network-plus-v4.1.0`

Pushing the tag starts the **Release Examplify Network+** workflow (`.github/workflows/release-network-plus.yml`). It checks that the tag matches the version in the plugin's `manifest.json`, builds the `.jpl` and `.html`, and publishes the GitHub Release with the changelog entry as its notes.

Tags are prefixed with the exam name so each exam's releases stay separate on one Releases page.

## License

By contributing, you agree that your contribution is licensed under the [GNU GPL v3.0](LICENSE), the same as the rest of the project.
