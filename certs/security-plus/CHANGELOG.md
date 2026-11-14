# Provo Security+ changelog

## v1.4.0
- Performance-Based Questions (module 13) is now live with six original simulations. Every run generates a new variation, with the answer choices shuffled:
  - **CIA triad and control types:** choose the property each event or control affects, then classify each control.
  - **Name the attack, pick the control:** five incidents drawn from a pool of 20, each matched to its attack and its best control.
  - **Place the security devices:** an on-premises store, a cloud VPC, or a branch office, with numbered slots and subnet types.
  - **Fix the site-to-site VPN:** compare both peers with the tunnel policy, read the tunnel log, and fix each mismatched or weak setting.
  - **Move to key-based SSH:** build the commands for Linux or Windows, read `ssh -v` output, and harden `sshd_config`.
  - **Trace the outbreak:** use EDR detections and a network flow log to find patient zero, the spread, and the next step.
- A run at 90% or better clears a PBQ. Clear each one three times to master it. The module now counts toward the Mastery Badge.

## v1.3.0
- Question Qualifiers: 30 new practice questions (70 in all), 6 for each qualifier. Each is built around a trap CompTIA uses, such as a runner-up answer that also works or a detail that rules out the obvious choice, and explains the trap after you answer. These practice questions never appear in the mini-exams.
- Exam-Style Drill (new module): 169 original exam-style questions across 38 skills taken from the exam objectives, weighted Heavy, Core, or Light, with up to six variations each. Four styles: direct, scenario, exhibit (logs, email headers, scan results, and tables), and round best-fit questions in plain English, where several answers fit part of the question and one fits best. Every answer, right or wrong, is explained. These questions also appear in the mini-exams.
- Exam-style questions are now mixed into every objective module: one in every four questions comes from the Exam-Style Drill for that module's objectives, so you practice the way the exam asks from the first module on. A right answer there also counts in the drill.
- The last modules are now in this order: Question Qualifiers, Exam-Style Drill, Performance-Based Questions, Mini-Exams.

## v1.2.0
- A menu in the top bar links to the Provo home page (all exams), this exam's home, Contact us, and Report an issue. Selecting the Provo icon also returns to the Provo home page.
- Report an issue opens a pre-filled GitHub report with the exam, page, version and browser filled in.
- Contact us sends a message by email from inside the page.

## v1.1.0
- Every answer is explained. After any multiple-choice question, Provo now shows why the correct answer is right and why each of the other options is wrong, with your own pick marked. This covers every drill and question type, from acronyms and terms to the question qualifiers.
- Mini-exams still give no feedback while you take them. Afterwards, the new Review your answers section walks through every question the same way: missed questions first, with a button to see all of them.
- Provo branding only: the footer and Joplin plugin details no longer name a company.
- New Provo icon: a white P on a border in the five domain colors. It appears in the top bar, at the center of the home header art, as the browser-tab icon, as the home-screen icon when the page is added to a phone, and as the Joplin plugin icon.
- License: Provo is now copyrighted by Benjamin Smith, and MyComputerCareer holds a right of first refusal to acquire it. See LICENSE.

## v1.0.0
- Out of preview: every module from 02 to 10 now has hands-on labs alongside its questions, and every module covers its full SY0-701 objectives. Performance-based questions are still coming soon.
- New labs, 24 in all. Drag-and-drop works with a mouse, a finger, or by tapping a tile and then a target. Getting a lab task right on the first check counts as one question for each term it uses.
- 02 Security Controls & Concepts and every term module after it: Type the answer. Read a scenario and type the term, with no options to choose from. A correct answer with no hint masters the term in one go; with a hint, it counts as one question. Small typos and common alternative names (such as mantrap, whitelist, or SOP) are accepted.
- 01 Acronyms: new Type it mode. Type the acronym from its meaning, or type out what an acronym stands for. Each correct answer adds two strength dots.
- 01 Acronyms: trimmed to the 178 most likely to matter on the exam. General IT terms (such as LAN, URL, and HDD) and rarely tested acronyms are left out so students can focus. Progress on the acronyms that remain is kept.
- 03 Cryptography & PKI: Key Flow (a sender, a recipient, a certificate authority, and Mallory on the wire: drag the right key onto each step, 8 tasks) and Sort the cipher (symmetric, asymmetric, or hashing).
- 04 Threat Actors & Vectors: Threat Actor Profiler, Attack Surface Map, and Spot the Phish (fictional emails, text messages, and look-alike web addresses to inspect and report).
- 05 Vulnerabilities & Attacks: Vulnerability Hunt (penetration test findings by kind of vulnerability), Malware Lineup, and Kill Chain Builder.
- 06 Security Architecture: Shared Responsibility (on-premises, IaaS, PaaS, SaaS), Network Zones, and Recovery Planner (RTO and RPO).
- 07 Security Operations: Tool Match, Vulnerability Management cycle, and Disposal Decisions.
- 08 Identity & Access Management: Factor Sort, Access Model Match, and Sign-in Flows (SAML, OAuth, and the account lifecycle).
- 09 Incident Response & Forensics: Incident Timeline, Order of Volatility, and Which Log?
- 10 Governance, Risk & Compliance: Risk Calculator (SLE, ARO, ALE, and whether a control is worth it), Risk Responses, Policy or Procedure?, and Agreement Match.
- New Security+ badges: a Security+ Mastery badge, 20 prestige badges from Strong Password to Chief Information Security Officer, and 5 secret badges ending with The Vault.

## v0.2.0
- Full content: the Acronyms module now has CompTIA's complete SY0-701 acronym list (328 acronyms). The 247 core acronyms set your rank; the rest, which CompTIA lists but rarely tests, are marked Also listed and come up less often.
- Full content: the nine term modules now cover every SY0-701 objective, 394 terms in all (up from 113), each asked as a definition, a name, and a scenario. Existing progress carries over.
- Full content: the Mini-Exams bank now has 127 multiple-choice questions (up from 15), weighted to the domains, and Question Qualifiers has eight scenarios for each qualifier (up from one).
- Cram Sheet: new sections for zero trust, social engineering, states of data, email authentication, business impact metrics, penetration testing, and forensics.
- New header art for Security+: a threat radar with the MyComputerCareer logo at the center. Its outer ring is split into the five domains by exam weight, and as the sweep turns, each domain's blip lights up when the line crosses it and fades before the next pass.
- Joplin: new "Add Provo Security+ note" command (Tools → Provo Security+, and a button in the How to use window). It creates a note named Provo Security+ in the notebook you have open and opens it straight into the full-width tool, so there is nothing to copy and paste. Delete the note any time; your progress is kept and comes back when you add the note again.
- Joplin: notes added by the plugin include a short hidden line that tells anyone who switches to the Markdown editor how to get back to the tool.
- Joplin: the How to use and Changelog windows now have a fixed size and scroll, so long text is no longer cut off and the buttons stay on screen even when Joplin cannot be made larger.

## v0.1.0
First release of Provo Security+ for CompTIA Security+ SY0-701. This is a preview: every module works, and each is being expanded to cover its full objectives.
- 13 modules in 5 stages covering all five SY0-701 domains, weighted 12 / 22 / 18 / 28 / 20 like the exam.
- Modules 02–10 ask each term several ways: name it, define it, spot it in a scenario, and, for attacks, pick the best defense.
- Acronyms, Question Qualifiers, a one-page Cram Sheet, and a Progress page.
- Mini-Exams: 10, 20, or 40 multiple-choice questions, timed at one minute per question and weighted by domain.
- Performance-Based Questions are coming soon. Until then they do not count toward the Security+ Mastery Badge.
- Five ranks per module, from Beginner to Pro. Reach Expert in every module for the Security+ Mastery Badge.
- Progress is saved separately from Network+, and the Joplin plugin installs beside Provo Network+ (use a ```sec+ block).
- Starter content: 113 terms, 36 acronyms, 5 qualifier questions, and 15 exam questions so far.
