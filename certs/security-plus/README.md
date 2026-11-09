# Provo Security+

MyComputerCareer's study lab for the **CompTIA Security+ SY0-701** exam. It drills every exam domain, tracks what you have mastered, and finishes with timed mini-exams weighted to the official domains.

> **In development.** The framework is in place with a starter set of questions in every module. Each module's content is being expanded to cover its full objectives, and performance-based questions are coming soon.

## What's inside

13 modules in 5 stages. Work through them in order.

| Stage | Module | What you practice | Objectives |
|---|---|---|---|
| 1 · Foundations | 01 Acronyms | Exam acronyms, asked four ways | Acronym list |
| | 02 Security Controls & Concepts | Control categories and types, CIA, zero trust, deception | 1.1–1.3 |
| | 03 Cryptography & PKI | Encryption, hashing, signatures, certificates, key storage | 1.4 |
| 2 · Threats & architecture | 04 Threat Actors & Vectors | Who attacks, why, and the ways in | 2.1–2.2 |
| | 05 Vulnerabilities & Attacks | Application flaws, malware, attacks, and their best defenses | 2.3–2.5 |
| | 06 Security Architecture | Architecture models, data protection, resilience | 3.1–3.4 |
| 3 · Operations & governance | 07 Security Operations | Hardening, vulnerability management, monitoring, automation | 4.1–4.5, 4.7 |
| | 08 Identity & Access Management | Authentication, federation, access control models | 4.6 |
| | 09 Incident Response & Forensics | The response process in order, evidence, investigation | 4.8–4.9 |
| | 10 Governance, Risk & Compliance | Policies, roles, risk responses, vendors, audits | 5.1–5.6 |
| 4 · Exam skills | 11 Question Qualifiers | FIRST, NEXT, BEST, MOST likely, and MINIMUM questions | All |
| | 12 Performance-Based Questions | **Coming soon** | Given-a-scenario objectives |
| 5 · Test | 13 Mini-Exams | 10, 20, or 40 multiple-choice questions, timed and weighted | All |

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

## How it works under the hood

- **Term modules (02–10)** all run on one engine. Each term is asked several ways (name it, define it, a scenario, and for attacks, the best defense). A term is mastered after two different kinds of question about it are answered correctly. Content lives in `TERMSETS` in the source file, one entry per module.
- **Acronyms** use the same engine as Network+, with the Security+ list in `ACRO`.
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

© 2026 MyComputerCareer. All rights reserved. See [LICENSE](../../LICENSE).

CompTIA and Security+ are trademarks of CompTIA, Inc. Provo contains no CompTIA exam questions.
