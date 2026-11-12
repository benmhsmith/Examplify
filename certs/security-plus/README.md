# Provo Security+

Provo's study lab for the **CompTIA Security+ SY0-701** exam. It drills every exam domain, tracks what you have mastered, and finishes with timed mini-exams weighted to the official domains.

**Current version:** see the [Security+ releases](https://github.com/benmhsmith/Provo/releases?q=security-plus) · [What changed](CHANGELOG.md)

Every module covers its full objectives: 178 exam-focused acronyms, 394 terms, 167 exam-style questions, and 24 hands-on labs. Performance-based questions are coming soon.

## What's inside

13 modules in 5 stages. Work through them in order.

| Stage | Module | What you practice | Objectives |
|---|---|---|---|
| 1 · Foundations | 01 Acronyms | The 178 acronyms most likely on the exam, asked four ways | Acronym list |
| | 02 Security Controls & Concepts | Control categories and types, CIA, zero trust, deception, change management | 1.1–1.3 |
| | 03 Cryptography & PKI | Encryption, hashing, signatures, certificates, key storage. Labs: Key Flow, Sort the cipher | 1.4 |
| 2 · Threats & architecture | 04 Threat Actors & Vectors | Who attacks, why, and the ways in. Labs: Threat Actor Profiler, Attack Surface Map, Spot the Phish | 2.1–2.2 |
| | 05 Vulnerabilities & Attacks | Vulnerabilities, malware, attacks, and their best defenses. Labs: Vulnerability Hunt, Malware Lineup, Kill Chain Builder | 2.3–2.5 |
| | 06 Security Architecture | Architecture models, data protection, resilience. Labs: Shared Responsibility, Network Zones, Recovery Planner | 3.1–3.4 |
| 3 · Operations & governance | 07 Security Operations | Hardening, vulnerability management, monitoring, automation. Labs: Tool Match, Vulnerability Management, Disposal Decisions | 4.1–4.5, 4.7 |
| | 08 Identity & Access Management | Authentication, federation, access control models. Labs: Factor Sort, Access Model Match, Sign-in Flows | 4.6 |
| | 09 Incident Response & Forensics | The response process in order, evidence, investigation. Labs: Incident Timeline, Order of Volatility, Which Log? | 4.8–4.9 |
| | 10 Governance, Risk & Compliance | Policies, roles, risk responses, vendors, audits. Labs: Risk Calculator, Risk Responses, Policy or Procedure?, Agreement Match | 5.1–5.6 |
| 4 · Exam skills | 11 Question Qualifiers | FIRST, NEXT, BEST, MOST likely, and MINIMUM questions | All |
| | 12 Performance-Based Questions | **Coming soon** | Given-a-scenario objectives |
| 5 · Test | 13 Mini-Exams | 10, 20, or 40 multiple-choice questions, timed and weighted | All |

Modules 02–10 each offer three ways to study: **Questions** (multiple choice and typed), **Type the answer** (read a scenario and type the term; a clean answer masters the term in one go), and **hands-on labs** (drag-and-drop, sorting, ordering, and inspection tasks that work with a mouse or a finger). Module 01 has a **Type it** mode as well.

There is also a one-page **Cram Sheet** and a **Progress** page.

### Domain weights (SY0-701)

| Domain | Weight |
|---|---|
| 1.0 General Security Concepts | 12% |
| 2.0 Threats, Vulnerabilities, and Mitigations | 22% |
| 3.0 Security Architecture | 18% |
| 4.0 Security Operations | 28% |
| 5.0 Security Program Management and Oversight | 20% |

### Ranks

Each module ranks you Beginner (under 50%), Intermediate (50%+), Advanced (70%+), Expert (80%+), or Pro (100%). Reach Expert in every module to earn the Security+ Mastery Badge. The Performance-Based Questions module does not count toward the badge until it is built.

## How to use it

Pick whichever fits you. Your progress is saved on your own device and never leaves it.

### Option 1: In your browser (nothing to install)

Open the web version: **https://benmhsmith.github.io/Provo/security-plus/**

Works on Windows, Mac, Linux, Chromebooks, Android, iPhone, and iPad. Progress is saved in that browser on that device, separately from Network+.

**iPhone or iPad:** open the link in Safari, tap the **Share** button, then **Add to Home Screen**. It opens like an app.

### Option 2: As a single file (works offline)

1. Go to the [Releases page](https://github.com/benmhsmith/Provo/releases?q=security-plus) and open the newest **Provo Security+** release.
2. Download `Provo-Security-Plus-vX.Y.Z.html`.
3. Double-click it to open it in your browser. No internet needed after that.

### Option 3: Inside Joplin (desktop and Android)

[Joplin](https://joplinapp.org/) is a free note-taking app. The plugin opens the lab right inside a note, and it installs beside Provo Network+.

**On a computer (Windows, Mac, Linux):**

1. Download `provo-security-plus-vX.Y.Z.jpl` from the newest **Provo Security+** release.
2. In Joplin, open the **Configuration** screen (**Tools → Options** on Windows and Linux, **Joplin → Settings** on Mac) and go to **Plugins**.
3. Click the **Plugin tools** gear button and choose **Install from file**. Pick the `.jpl` file.
4. Restart Joplin when asked. If Joplin keeps running in the system tray, quit it fully first.
5. Choose **Tools → Provo Security+ → Add Provo Security+ note**. A note named **Provo Security+** is created in the notebook you have open and opens in the full-width tool. Delete it any time; your progress is saved in Joplin and comes back when you add the note again.

**On Android:**

1. Download the `.jpl` file to your phone.
2. In Joplin, open **Configuration → Plugins**. Under **Advanced settings**, tap **Install from file** and pick the `.jpl` file.
3. Restart the app. Then type ` ```sec+ ` on one line of a note and ` ``` ` on the next.

Joplin on iPhone and iPad only allows plugins from its recommended list, so use Option 1 there.

## How it works under the hood

- **Term modules (02–10)** all run on one engine. Each term is asked several ways (name it, define it, a scenario, and for attacks, the best defense). A term is mastered after two different kinds of question about it are answered correctly. Content lives in `TERMSETS` in the source file, one entry per module.
- **Acronyms** use the same engine as Network+. `ACRO` holds the 178 exam-focused acronyms chosen from CompTIA's full list.
- **Type the answer** is turned on per module with `typed:true` in `TERMSETS`. Answers are matched with `tyMatch` (case, spacing, punctuation, a trailing "control" or "s", small typos, and each term's `alt` names). A clean correct answer gives two kinds of credit (`typed`, `typed2`), which masters the term.
- **Question Qualifiers** use `QUAL`; **Mini-Exams** draw from `BANK` plus `QUAL`, picked by domain weight.
- Progress is saved under its own key, so Security+ and Network+ never overwrite each other, even on the same website.
- The Joplin plugin has its own ID (`io.github.provo.securityplus`) and its own note block, ` ```sec+ `, so it installs beside Provo Network+.

## Folder contents (for contributors)

```
security-plus/
├── src/provo-security-plus.html      ← the whole app: one HTML file (HTML, CSS, JS)
├── joplin-plugin/                    ← Joplin plugin wrapper and build scripts
├── scripts/
│   ├── release.py                    ← builds and versions a release
│   └── mkstand.py                    ← makes the standalone web page
├── CHANGELOG.md
└── UNRELEASED.md                     ← notes for the next release
```

To build without releasing: `python3 certs/security-plus/scripts/release.py --build-only`

---

© 2026 Benjamin Smith. All rights reserved. See [LICENSE](../../LICENSE).

CompTIA and Security+ are trademarks of CompTIA, Inc. Provo contains no CompTIA exam questions.
