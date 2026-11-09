# Provo Network+ changelog

## v5.0.0
- Renamed to Provo Network+, by MyComputerCareer. Your saved progress, ranks, and badges carry over; the Joplin plugin keeps the same ID, so installing this version updates the old one in place.
- New look in MyComputerCareer colors: the MyComputerCareer logo and the Provo name in the top bar, the MyComputerCareer icon at the center of the home page diagram, and Montserrat for all text. Command output keeps its monospaced font. Dark mode keeps the dark grey theme.
- The home page title now shows CompTIA and the exam code N10-009 in small red text around Network+.
- Modules now use plain topic names: Acronyms, OSI Model, Ports & Protocols, Subnetting, Media & Wireless, Security, Troubleshooting Methodology, Tools & Commands, Question Qualifiers, Performance-Based Questions, and Mini-Exams.
- Five ranks instead of seven: Beginner (under 50%), Intermediate (50%+), Advanced (70%+), Expert (80%+), and Pro (100%). Ranks show as rings that fill with your progress.
- The Network+ Mastery Badge now unlocks when every module reaches Expert (80%), down from 90%. Secret prestige still needs Pro in every module.
- Provo is now proprietary software owned by MyComputerCareer. See LICENSE in the repository. Versions up to v4.0.0 were released under the GNU GPL v3.0.

## v4.0.0
- Renamed to Examplify Network+. Examplify is the new home for free certification study tools, starting with CompTIA Network+ (N10-009). Your saved progress, ranks, and badges carry over; the Joplin plugin keeps the same ID, so installing this version updates the old one in place.
- The source now lives on GitHub at github.com/benmhsmith/examplify, with each version published as a GitHub Release (the Joplin plugin and the standalone web page).
- The web version is also hosted on GitHub Pages, so iPhone and iPad users can open it in Safari and use Add to Home Screen.
- The top bar now just says Examplify. The home page title reads CompTIA Network+ N10-009, and the version number moved to the bottom of the home page.

## v3.9.0
- Routing PBQ: about half of the scenarios now address the Servers and Branch LANs from one /16, and R1 reaches both through a single summary route (some scenarios add summaries on R2 or R3 too). Students see that a router only needs a route that contains the destination, not one that names the exact subnet.
- Routing PBQ: two new tickets teach longest prefix match: an extra, more specific route that overrides a correct summary, and a summary with too narrow a prefix (/17 instead of /16).
- Routing PBQ grading: a required route now counts when the student's table sends the same destinations to the same next hop, whether they used the summary or separate specific routes.
- New PBQ: VLAN and trunk troubleshooting. Two switches, one failing ping. Students run show commands (VLAN brief, interface status, trunk, switchport, spanning tree, logging) and identify the faulty switch, the cause, and the fix. Faults: missing VLAN, VLAN not allowed on the trunk, uplinks in access mode, BPDU guard err-disable, and a shut port. Every scenario also includes a normal blocking port, a root-bridge question, and a "why no router is needed" question.
- New PBQ: Switch port configuration. Students configure an uplink trunk (native VLAN and allowed list), an IP phone port with data and voice VLANs, an LACP server bundle, a printer port, and the unused ports. Feedback includes the model Cisco configuration.
- New PBQ: Cable and port diagnostics. Students diagnose six desks from cable tester wire maps, switch port status and counters, and ipconfig output: open, short, split pair, duplex mismatch, admin down, err-disabled, wrong VLAN, wrong mask, wrong gateway, or no fault (including a crossover cable that works because of auto-MDIX).
- New PBQ: NOC monitoring dashboard. Five questions are answered from WAN, top-talker, device health, wireless, and syslog views. Each view has one randomized problem: jitter, loss, saturation, or latency; a reboot, CRC errors, a memory leak, or overheating; co-channel interference, a high noise floor, client overload, or an offline AP; and DHCP exhaustion, SSH brute force, a flapping uplink, or NTP failure.
- The PBQ Lab now has 10 PBQs. The all-PBQ mini-exam runs all 10, and the regular mini-exams draw from the larger pool.
- Qualifier Trainer rebuilt to match the other modules. It now has 35 questions (up from 10) across five qualifiers: FIRST, NEXT, BEST, MOST likely, and MINIMUM. It opens on a menu with Questions (sets of 10, 20, or 40) or a Qualifier guide, and the guide is hidden during a set. A qualifier is mastered after 4 different questions about it are answered correctly, and credit stays until Reset or Prestige.
- PBQ Lab rank now needs consistency: a PBQ is mastered after 3 attempts (each a new random scenario) scoring 90% or better. Attempts at 70–89% earn half credit along the way. PBQs finished inside mini-exams count too. Previously, one good attempt on each PBQ was enough for top rank.
- Mini-Exams rank is now the average of your last 3 full exams (20 or 40 questions, or all PBQs), with missing ones counting as 0. 10-question exams no longer count toward the rank. Previously, the last exam alone set the rank, so one perfect 10-question exam gave Grandmaster.
- Media & Wireless Match no longer has a Cable tools topic. Cable testers, toners, visual fault locators, and Wi-Fi analyzers are taught only in Which Tool / Command, which covers the full official tool list. Media now has 46 items in 7 topics.
- New module 06 · Security Drill (Stage 2) covers Domain 4.0: 59 terms from objectives 4.1 (concepts, encryption, identity and access, compliance, segmentation), 4.2 (attacks and social engineering), and 4.3 (hardening, NAC, ACLs, filtering, zones). Each term is asked as name it, define it, a scenario, and, for attacks, the best defense. A term is mastered after 2 different question types are answered correctly; a miss clears that term's progress until it is mastered. It opens on a menu with Questions (10, 20, or 40) or a Glossary, and the glossary is hidden during a set.
- Modules after Security are renumbered: Troubleshooting Ladder is 07, Which Tool / Command 08, Qualifier Trainer 09, PBQ Lab 10, and Mini-Exams 11.
- The Cram Sheet's security card now lists the defenses for ARP poisoning, DNS poisoning, VLAN hopping, and evil twin.

## v3.8.1
- Changelog wording cleaned up.

## v3.8.0
- Subnetting Gym now tracks /16 to /30 (15 prefixes) instead of /8 to /30, so practice stays in the third and fourth octets where block sizes are easy to work out mentally.
- Media & Wireless Match: 50 items (up from 21) in 8 topics: copper cabling, fiber, connectors, transceivers, Wi-Fi bands and channels, Wi-Fi security and design, installation and environment, and cable tools. Four question types: scenarios, "What is shown?" with drawn mock-ups of the exam connectors, transceivers, and cable tools, "Which picture shows...?", and odd-one-out. Progress now counts topics mastered; a topic stays mastered until Reset or Prestige.
- Troubleshooting Ladder: opens on a menu with "Questions" (sets of 10, 20, or 40, no step list during a set) and "The 7 steps" reference. Every question is about the steps and their order: step names and numbers, what comes before or after, what to do next, and which step an action belongs to. A step is mastered after 4 different questions about it are answered correctly. The separate drag-to-order puzzle was folded into these questions.
- Which Tool / Command: opens on a menu with three modes: Tools and commands, CLI only (the 9 host commands and 7 device show commands), and Tools only (hardware tools plus protocol analyzer, speed tester, and LLDP/CDP), in sets of 10, 20, or 40. Question types: two scenarios per tool, "What does it do?", "Which command produced this output?" with realistic sample output, and "Which tool is this?" with drawings. Each tool or command is mastered after 3 different correct questions about it.

## v3.7.0
- Module Ranks: Beginner under 30%, Novice 30%+, Intermediate 50%+, Advanced 70%+, Expert 80%+, Master 90%+, and a new top rank, Grandmaster, at 100%.
- The Network+ Mastery Badge (and prestige) now requires Master (90%+) in every module.
- Grandmaster: a module at 100% glows gold on the home page and the Progress page, and its own page gets a gold aura and a "Grandmaster" banner.
- A "See instructor for reward" note appears on the home page and the Progress page once a student reaches prestige 20.
- Any earned prestige badge now replaces the router icon at the center of the home page network graphic.
- Fixed: inside a Joplin note, animations (the home page graphic, Grandmaster glow) did not run because the in-note stylesheet broke their keyframes.

## v3.6.0
- Acronym Gym: removed the 26 optional second-pass acronyms and their checkbox. The gym now covers the 104 core exam acronyms only.
- Acronym Gym: new Drill description that focuses on testing recall and building acronym retention.
- OSI Sorter: 75 items (up from 28) across all seven layers, and three question types that switch at random: which layer an item belongs to, which item belongs at a given layer, and which item is the odd one out. Wrong answers come mostly from neighbouring layers, the ones that are easy to mix up.
- OSI Sorter: progress now counts layers mastered. A layer is mastered once every item on it has been answered correctly, and stays mastered until Reset or Prestige. A strip at the top shows each layer's status.
- Port & Protocol Drill now matches the Acronym Gym: a menu to choose Drill (sets of 10, 20, or 40) or Reference + secure pairs, no reference access during a drill, and a summary at the end of each set.
- Port & Protocol Drill: a card is mastered the first time it reaches strength 4 and stays mastered after a later miss; a port is mastered when both directions are. Only Reset or Prestige clears it.
- Subnetting Gym: progress now tracks every prefix from /8 to /30. A prefix is mastered once you have answered each of these correctly for it: prefix to mask, mask to prefix, usable hosts or total addresses, a network ID, and a broadcast ID. Skills stay done after a later miss; only Reset or Prestige clears them.
- Subnetting Gym opens on a menu that explains how progress works, why /31 isn't graded (the 2^h - 2 formula and RFC 3021 point-to-point links give different answers), and shows a grid of all 23 prefixes. Questions show a per-prefix strength meter. The block-size table now covers /8 to /30, and a new question type asks for total addresses.

## v3.5.0
- Joplin: the Tools and Help submenus now read just "How to use" and "Changelog" instead of repeating the plugin name.
- Acronym Gym: an acronym now counts as mastered the first time it reaches strength 4, and stays mastered even after a later miss. Only Reset or Prestige clears it. Mastered acronyms show a Mastered tag in the drill and a green dot in the glossary, and come up less often so practice focuses on the rest.
- Acronym Gym now opens on a menu: choose Drill (sets of 10, 20, or 40 questions) or Glossary. The glossary is hidden during a drill and opens again when the set is finished or you quit. Each set ends with a summary of your score, newly mastered acronyms, and what you missed.
- Acronym Gym "Spell it out" questions are harder: the wrong answers are made-up expansions that still fit the acronym's letters (for DHCP: Dynamic Host Control Protocol, Dynamic Hop Configuration Protocol, and so on).

## v3.4.0
- Every badge now has its own icon tied to its name (RJ45 plug for Patch Cable, brick wall and flame for Firewall, server rack for Data Center, globe for The Internet, and so on), with the level number on a tag at the bottom.

## v3.3.0
- Removed the Tier system. Every module now shows a Module Rank based on its progress bar: Beginner (under 20%), Novice (20%+), Intermediate (40%+), Advanced (60%+), Expert (80%+). The rank appears on the home page, the Progress page, each module's header, and each PBQ in the PBQ Lab (from its best score).
- New Network+ Mastery Badge: reach Expert in all 10 modules to earn it. It shows on the home page.
- New prestige option on the Progress page (for fun): once every module is at Expert, prestige resets all module progress and keeps your badge. 20 prestige levels, each with its own badge and name, from Patch Cable to The Internet.
- Reset all progress clears module progress only. Badges and prestige level are kept; they are lost only if the browser's or Joplin's own data is wiped.
- Progress page "Study next" now points to the module with the lowest progress.
- Fixed the PBQ Lab list layout.

## v3.2.0
- Joplin: the plugin now installs on Joplin for Android (Configuration > Plugins > Advanced settings > Install from file). Joplin for iPhone and iPad only allows plugins from Joplin's recommended list, so it can't install this one.
- Android: a ? button on the editor toolbar opens How to use, since the mobile app has no Tools menu. The Tools/Help submenu and the full-width view (Ctrl+Alt+V) stay desktop-only.
- How to use now has a Changelog button and Android instructions.
- In the note on a phone screen: larger buttons, and PBQ diagrams scroll sideways at a readable size.

## v3.1.0
- Modules reordered into five stages: Foundations, Core skills, Troubleshooting, Exam skills, Test. New numbers: 01 Acronym Gym, 02 OSI Sorter, 03 Port & Protocol Drill, 04 Subnetting Gym, 05 Media & Wireless Match, 06 Troubleshooting Ladder, 07 Which Tool / Command, 08 Qualifier Trainer, 09 PBQ Lab, 10 Mini-Exams. No questions changed, and saved progress carries over.
- Joplin: Tools and Help now have a Network+ Readiness Lab submenu with How to use and Changelog.
- Joplin: this changelog opens automatically after each plugin update.

## v3.0.0
- Renamed from Net+ Fast Track to Network+ Readiness Lab. The Joplin plugin keeps the same ID, so installing over 2.x keeps saved progress, and the ```net+ command still works.
- Versioned file names, and the version number now shows next to the name in the top bar.
- New home header: CompTIA Network+ N10-009 title with a network graphic. Removed the question count, time limit and passing score tiles.

## v2.x
Released as Net+ Fast Track: modules, Joplin plugin, PBQ Lab, mini-exams with PBQs, neutral dark theme, Atkinson Hyperlegible fonts, Desktop/Mobile switch.
