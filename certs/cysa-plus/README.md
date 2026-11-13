# Provo CySA+

> **Preview.** Provo CySA+ is new and still being tested. Report anything that looks wrong through the [issue form](https://github.com/benmhsmith/Provo/issues/new/choose).

Provo's study lab for the **CompTIA CySA+ CS0-004** exam. It drills every exam objective, tracks what you have mastered, and finishes with timed mini-exams weighted to the official domains.

**Current version:** see the [CySA+ releases](https://github.com/benmhsmith/Provo/releases?q=cysa-plus) · [What changed](CHANGELOG.md)

Built from the official CompTIA CySA+ CS0-004 Exam Objectives (v2.0): 100 exam-focused acronyms, 302 terms, log-analysis and YARA labs, seven performance-based questions, and 115 analyst scenarios, including the new CS0-004 topics such as reading XML and JSON logs, AI in security operations, EPSS, SBOM and SCA, STRIDE, the Pyramid of Pain, LOLBins, and business email compromise.

## What's inside

17 modules in 5 stages. Work through them in order.

| Stage | Module | What you practice | Objectives |
|---|---|---|---|
| 1 · Foundations | 01 Acronyms | The 100 acronyms most likely on the exam, asked four ways | Acronyms |
| | 02 Architecture, IAM & Data | Logging, OS internals, cloud native, zero trust and SASE, PAM and secrets, data protection, OT/ICS/SCADA | 1.1 |
| 2 · Detect & analyze | 03 Indicators of Malicious Activity | Network, host, application, cloud, identity, and email indicators, including LOLBins, impossible travel, and BEC | 1.2 |
| | 04 Log Analysis | XML, JSON, YAML, syslog, and web logs; Windows event IDs and logon types; Zulu time and DST; true, false, and benign positives. Labs: **Log Reader** (12 logs) and **Zulu Time** | 1.1, 1.3, 2.3, 3.3 |
| | 05 Analysis Tools | Wireshark, tcpdump, Snort, Suricata, Zeek, sandboxes, OTX, MISP, OpenCTI, CyberChef, MXToolbox, EDR/XDR, UEBA, and reading YARA rules. Lab: **YARA Reader** (8 rules) | 1.3 |
| | 06 Threat Intel & Hunting | Actors, TTPs, ATT&CK heat maps, the Pyramid of Pain, intel confidence, IoC types, STRIDE, threat mapping, deception | 1.4 |
| | 07 Automation & Efficiency | Playbooks, runbooks, SOAR, IaC, tuning, enrichment, dashboards, APIs, webhooks, plug-ins | 1.5 |
| | 08 AI in Security Operations | Hallucination, data exposure, poisoning, prompt injection, excessive agency, AI usage policy, NIST AI RMF, EU AI Act, and the six AI use cases | 1.6 |
| 3 · Vulnerability management | 09 Vulnerability Scanning & Tools | Scan types and planning, baselines, Nmap to Nuclei, ScoutSuite, Prowler, Trivy, Checkov, Atomic Red Team, Caldera | 2.1–2.2 |
| | 10 Prioritize & Mitigate | CVSS metrics, EPSS, active exploitation, context awareness, mitigation, and validation | 2.3 |
| | 11 Controls, Risk & AppSec | Control types and functions, risk concepts and strategies, SLOs, SAST, DAST, SAMM, SCA, SBOM | 2.4 |
| 4 · Respond & report | 12 Attack Frameworks | Cyber Kill Chain, Diamond Model, MITRE ATT&CK | 3.1 |
| | 13 Incident Response | The seven-phase process, plans and exercises, triage, timelines, evidence, isolation, and root cause | 3.2–3.3 |
| | 14 Reporting & Communication | Scorecards, action plans, inhibitors to remediation, incident communication, and metrics | 4.1–4.2 |
| 5 · Exam skills & test | 15 Performance-Based Questions | Seven exam-style simulations, a new variation every run: scan prioritization, phishing headers, compromised hosts, Nmap hardening, IR phases and order of volatility, alert triage, YARA matching | All |
| | 16 Question Qualifiers | FIRST, NEXT, BEST, MOST likely, and MINIMUM analyst scenarios | All |
| | 17 Mini-Exams | 10, 20, or 40 questions, timed and weighted to the domains, with a full review | All |

Modules 02–14 each offer **Questions** (multiple choice and typed) and **Type the answer** (read a scenario and type the term). Every question explains why the right answer is right and why each other option is wrong. There is also a one-page **Cram Sheet** and a **Progress** page.

### Domain weights (CS0-004)

| Domain | Weight |
|---|---|
| 1.0 Security Operations | 34% |
| 2.0 Vulnerability Management | 26% |
| 3.0 Incident Response and Management | 24% |
| 4.0 Reporting and Communication | 16% |

## How to use it

Pick whichever fits you. Your progress is saved on your own device and never leaves it.

### Option 1: In your browser (nothing to install)

Open the web version: **https://benmhsmith.github.io/Provo/cysa-plus/**

Progress is saved in that browser on that device, separately from Network+ and Security+. **iPhone or iPad:** open the link in Safari, tap **Share**, then **Add to Home Screen**.

### Option 2: As a single file (works offline)

1. Go to the [Releases page](https://github.com/benmhsmith/Provo/releases?q=cysa-plus) and open the newest **Provo CySA+** release.
2. Download `Provo-CySA-Plus-vX.Y.Z.html` and double-click it. No internet needed after that.

### Option 3: Inside Joplin (desktop and Android)

1. Download `provo-cysa-plus-vX.Y.Z.jpl` from the newest **Provo CySA+** release.
2. In Joplin, open **Configuration → Plugins**, click the **Plugin tools** gear button, and choose **Install from file**. Pick the `.jpl` file and restart Joplin.
3. Choose **Tools → Provo CySA+ → Add Provo CySA+ note**. On Android, type ` ```cysa+ ` on one line of a note and ` ``` ` on the next.

The plugin has its own ID (`io.github.provo.cysaplus`) and note block (` ```cysa+ `), so it installs beside Provo Network+ and Provo Security+.

## Folder contents (for contributors)

```
cysa-plus/
├── src/provo-cysa-plus.html      ← the whole app: one HTML file (HTML, CSS, JS)
├── joplin-plugin/                ← Joplin plugin wrapper and build scripts
├── scripts/
│   ├── release.py                ← builds and versions a release
│   └── mkstand.py                ← makes the standalone web page
├── CHANGELOG.md
└── UNRELEASED.md                 ← notes for the next release
```

The app shares its engine with Provo Security+. Content lives in `TERMSETS`, `ACRO`, `BANK`, and `QUAL` in the source file.

To build without releasing: `python3 certs/cysa-plus/scripts/release.py --build-only`

## Sources

- CompTIA CySA+ CS0-004 Exam Objectives, document version 2.0 (domains, weights, and objectives)
- [CompTIA CySA+ certification page](https://www.comptia.org/en-us/certifications/cybersecurity-analyst/)
- FIRST: CVSS and EPSS · CISA Known Exploited Vulnerabilities catalog · MITRE ATT&CK
- Microsoft Learn: Windows security auditing events and logon types · Microsoft Sysinternals Sysmon · AWS CloudTrail record contents · RFC 5424 (syslog)
- YARA documentation (yara.readthedocs.io); PBQ matches verified against YARA 4.5
- NIST AI Risk Management Framework (AI 100-1) · OWASP Top 10 for LLM Applications · EU AI Act

---

© 2026 Benjamin Smith. All rights reserved. See [LICENSE](../../LICENSE).

CompTIA and CySA+ are trademarks of CompTIA, Inc. Provo contains no CompTIA exam questions.
