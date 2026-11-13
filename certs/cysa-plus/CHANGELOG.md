# Provo CySA+ changelog

## v0.1.1
- Every performance-based question is now a new variation each run: findings, phishing brands, hosts, ports, alerts, users, and times are drawn from pools, and the drop-down choices are shuffled so the right answer is never in a fixed spot. Clear each PBQ 3 times to master it; retrying the same variation is for review and does not count.
- New PBQ 7, **Which files match the YARA rule?**: a new rule and five collected files every run. The answers were checked against the real YARA engine on 1,000 generated files.
- New **YARA Reader** lab in 05 Analysis Tools: eight rules covering meta, text and hex strings, nocase, wide, fullword, wildcards and jumps, counts, offsets, file-type and size checks, the pe module, exclusions, and `yara -r -s` output. Six new YARA terms and a Reading YARA rules cram card.
- The IR phases PBQ now also has a web-server compromise scenario.

## v0.1.0
- First release of Provo CySA+ for CompTIA CySA+ CS0-004, built from the official CS0-004 Exam Objectives (v2.0) and weighted 34 / 26 / 24 / 16 across the four domains.
- 17 modules: Acronyms (100), thirteen topic modules covering every objective from 1.1 to 4.2 (296 terms), Performance-Based Questions (6 simulations), Question Qualifiers (25 analyst scenarios), and Mini-Exams drawn from 115 scenario questions, 12 of them built around a real-looking log.
- Log Analysis module with two labs. **Log Reader:** 12 Windows XML, AWS and Entra JSON, Linux syslog, web, DNS, and firewall logs, each walked from "what happened" to "escalate, contain, tune, or close". **Zulu Time:** endless practice converting UTC to and from Eastern, Central, Mountain, and Pacific time, with daylight saving time and dates that change at midnight.
- AI in Security Operations is its own module: risks (hallucination, data exposure, poisoning, direct and indirect prompt injection, excessive agency), governance (AI usage policy, NIST AI RMF, EU AI Act, human in the loop), and the six CS0-004 use cases.
- Six performance-based questions in the exam's drop-down style: prioritize scan results (CVSS, EPSS, KEV, false positives), analyze a phishing email's SPF, DKIM, and DMARC, find the compromised hosts, harden a server from Nmap output, place ransomware response actions in IR phases and order of volatility, and work an alert queue.
- CySA+'s own badge art: a log-under-the-lens Mastery badge, 20 analyst prestige badges from Log Reader to SOC Director, and 5 secret badges.
- The home page art is a simplified log under a magnifying glass, framed by the four domain colors.
- Covers what is new in CS0-004, including AI in security operations (1.6), log formats (JSON, XML, YAML, EVTX), EPSS, SBOM and SCA, STRIDE, the Pyramid of Pain, LOLBins, business email compromise, OTX, MISP, OpenCTI, YARA, Zeek, Suricata, Trivy, Checkov, Atomic Red Team, and Caldera.
- Every question explains why the correct answer is right and why each other option is wrong. Mini-exams give a full review when you finish.
- A one-page Cram Sheet with the incident response order, CVSS versus EPSS versus KEV, the Pyramid of Pain, the attack frameworks, a tool-to-job map, key Windows event IDs, a five-step method for reading logs, a Zulu time card, evidence handling, and reporting metrics.
