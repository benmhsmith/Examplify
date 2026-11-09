/* Examplify Network+ — Joplin plugin.
   - Notes containing a ```net+ block (or the older ```netplus-fast-track) open in a full-width "Examplify Network+" editor
     (Joplin's editor-plugin API). The normal editor is one click away via Toggle editor.
   - The same block also renders inside the Markdown viewer (content script), as a fallback.
   - The plugin never writes to the note, so the note's Markdown is never altered.
   - Tools/Help > Examplify Network+ > How to use opens instructions with a Copy command button.
     The same window opens once automatically after the plugin is first installed. */
joplin.plugins.register({
  onStart: async function () {
    const CS_ID = 'netplusft_cs';
    const EDITOR_ID = 'netplusft_editor';
    const KEY = 'netplusft.progress';
    const FENCE = /^\s*```\s*(net\+|netplus-fast-track)\s*$/im;
    const DIAG = { version: '4.0.0', editorsApi: 'unknown', method: 'none', setupCalls: 0, handle: null, checks: [], shows: [], errors: [] };
    const note = function (arr, v) { arr.push(v); if (arr.length > 8) arr.shift(); };

    /* desktop or mobile (Joplin Android). Menus and the full-width editor are desktop-only. */
    let PLATFORM = 'desktop';
    try { const vi = await joplin.versionInfo(); if (vi && vi.platform) PLATFORM = vi.platform; } catch (e) {}
    DIAG.platform = PLATFORM;

    await joplin.settings.registerSettings({
      [KEY]: { value: '', type: 2 /* String */, public: false, label: 'Examplify Network+ saved progress' }
    });

    async function handle(msg) {
      if (!msg || !msg.type) return null;
      if (msg.type === 'diag') {
        const d = Object.assign({}, DIAG);
        try { if (DIAG.handle) { d.isActive = await joplin.views.editors.isActive(DIAG.handle); d.isVisible = await joplin.views.editors.isVisible(DIAG.handle); } } catch (e) { d.stateError = String(e && e.message || e); }
        try { const n = await joplin.workspace.selectedNote(); d.selectedNoteIsStudy = !!(n && FENCE.test(n.body || '')); } catch (e) {}
        return JSON.stringify(d);
      }
      if (msg.type === 'load') { trackStudyNote(); const v = await joplin.settings.value(KEY); archCheck(v); return v; }
      if (msg.type === 'save') { await joplin.settings.setValue(KEY, String(msg.data || '')); archCheck(String(msg.data || '')); return true; }
      if (msg.type === 'open' && /^https?:\/\//i.test(String(msg.data || ''))) {
        try { await joplin.commands.execute('openItem', String(msg.data)); } catch (e) {}
        return true;
      }
      return null;
    }

    /* Grand Architect (all 5 secret badges): outline the study notes and their notebooks in gold.
       Desktop only: Joplin Mobile doesn't let plugins style its interface. Uses the sidebar's
       data-folder-id and the note list's data-id attributes. */
    const STUDY_KEY = 'netplusft.studyNotes';
    await joplin.settings.registerSettings({
      [STUDY_KEY]: { value: '[]', type: 2 /* String */, public: false, label: 'Examplify Network+ study notes' }
    });
    async function studyList() { try { return JSON.parse(await joplin.settings.value(STUDY_KEY) || '[]'); } catch (e) { return []; } }
    let tracking = false;
    async function trackStudyNote() {
      if (tracking) return; tracking = true;
      try {
        const n = await joplin.workspace.selectedNote();
        if (n && FENCE.test(n.body || '')) {
          const list = await studyList();
          const i = list.findIndex(x => x.note === n.id);
          const item = { note: n.id, folder: n.parent_id };
          const changed = i < 0 || list[i].folder !== item.folder;
          if (changed) {
            if (i < 0) list.push(item); else list[i] = item;
            await joplin.settings.setValue(STUDY_KEY, JSON.stringify(list.slice(-50)));
            archCheck(await joplin.settings.value(KEY));
          }
        }
      } catch (e) { note(DIAG.errors, 'track: ' + (e && e.message || e)); }
      tracking = false;
    }
    let lastCss = '', archBusy = false, archCleaned = false, archScanned = false;
    /* Find every note that holds the tool (once per session), so outlines don't depend on opening each note first */
    async function scanStudyNotes() {
      try {
        const list = await studyList(); const seen = new Set(list.map(x => x.note));
        for (let page = 1; page <= 60; page++) {
          const res = await joplin.data.get(['notes'], { fields: ['id', 'parent_id', 'body'], limit: 100, page });
          (res.items || []).forEach(n => { if (!seen.has(n.id) && FENCE.test(n.body || '')) { seen.add(n.id); list.push({ note: n.id, folder: n.parent_id }); } });
          if (!res.has_more) break;
        }
        await joplin.settings.setValue(STUDY_KEY, JSON.stringify(list.slice(-50)));
        DIAG.scan = list.length + ' study notes';
      } catch (e) { note(DIAG.errors, 'scan: ' + (e && e.message || e)); }
    }
    async function archCheck(progressJson) {
      if (PLATFORM !== 'desktop' || archBusy) return;
      let secret = 0; try { secret = (JSON.parse(progressJson || '{}').secret) || 0; } catch (e) {}
      if (secret < 5) return;
      archBusy = true;
      try {
        if (!archScanned) { archScanned = true; await scanStudyNotes(); }
        const list = await studyList();
        if (!list.length) { archBusy = false; return; }
        const notes = list.map(x => `.note-list-item-wrapper[data-id="${x.note}"]`).join(',\n');
        const folders = [...new Set(list.map(x => x.folder).filter(Boolean))].map(f => `.list-item-container[data-folder-id="${f}"]`).join(',\n');
        const css = `/* Examplify Network+: Grand Architect */
@keyframes nftArchGlow {
  0%, 100% { box-shadow: inset 0 0 0 2px rgba(255,90,90,.55), inset 0 0 10px rgba(255,90,90,.14); }
  20% { box-shadow: inset 0 0 0 2px rgba(255,200,70,.55), inset 0 0 10px rgba(255,200,70,.14); }
  40% { box-shadow: inset 0 0 0 2px rgba(80,220,120,.55), inset 0 0 10px rgba(80,220,120,.14); }
  60% { box-shadow: inset 0 0 0 2px rgba(70,170,255,.55), inset 0 0 10px rgba(70,170,255,.14); }
  80% { box-shadow: inset 0 0 0 2px rgba(170,110,255,.55), inset 0 0 10px rgba(170,110,255,.14); }
}
${[notes, folders].filter(Boolean).join(',\n')} { border-radius: 6px; animation: nftArchGlow 9s linear infinite !important; }
@media (prefers-reduced-motion: reduce) { ${[notes, folders].filter(Boolean).join(',\n')} { animation: none !important; box-shadow: inset 0 0 0 2px rgba(70,170,255,.55) !important; } }
`;
        if (css === lastCss) { archBusy = false; return; }
        lastCss = css;
        const fs = joplin.require('fs-extra');
        const dir = await joplin.plugins.dataDir();
        if (!archCleaned) { archCleaned = true; try { (await fs.readdir(dir)).filter(f => /^grand-architect-\d+\.css$/.test(f)).forEach(f => fs.remove(dir + '/' + f).catch(() => {})); } catch (e) {} }
        const file = dir + '/grand-architect-' + Date.now() + '.css';
        await fs.writeFile(file, css, 'utf8');
        await joplin.window.loadChromeCssFile(file);
        DIAG.archFile = file;
        DIAG.arch = list.length + ' notes';
      } catch (e) { note(DIAG.errors, 'arch: ' + (e && e.message || e)); }
      archBusy = false;
    }

    archCheck(await joplin.settings.value(KEY));

    /* How-to window with a Copy command button (Help menu, and once on first install) */
    const WELCOME_KEY = 'netplusft.welcomeShown';
    await joplin.settings.registerSettings({
      [WELCOME_KEY]: { value: false, type: 3 /* Bool */, public: false, label: 'Examplify Network+ welcome shown' }
    });
    const COMMAND_TEXT = '```net+\n```\n';
    const dialog = await joplin.views.dialogs.create('netplusft_howto');
    await joplin.views.dialogs.setHtml(dialog, `
      <div style="font-family:var(--joplin-font-family, system-ui, sans-serif);color:var(--joplin-color, #222);max-width:520px;padding:4px 6px;line-height:1.5">
        <h2 style="margin:0 0 6px;font-size:1.4em">Examplify Network+</h2>
        <p style="margin:0 0 12px">A study tool for the CompTIA Network+ (N10-009) exam. It focuses on what the exam weighs most: port drills, subnetting practice, exam acronyms, PBQ practice, the troubleshooting steps, mini-exams, and a one-page cram sheet. Your progress saves automatically.</p>
        <h3 style="margin:0 0 6px;font-size:1.1em">Add it to a note</h3>
        <ol style="margin:0 0 12px;padding-left:1.3em">
          <li>Create a new note, or open the note you want to use.</li>
          <li>Use the <b>Markdown editor</b> (plain text). If you see a Word-style formatting toolbar instead, click <b>Toggle editor</b> at the top right of the note.</li>
          <li>Click <b>Copy command</b> below, then click in the note and paste with <b>Ctrl+V</b>.</li>
          <li>The tool appears in the preview pane. For a full-width view, press <b>Ctrl+Alt+V</b>.</li>
        </ol>
        <p style="margin:0 0 12px"><b>On Android:</b> open the note in edit mode, paste the command, then switch back to view mode. The tool appears in the note.</p>
        <p style="margin:0 0 4px">The command is these two lines:</p>
        <pre style="margin:0 0 12px;padding:8px 12px;border-radius:6px;background:var(--joplin-background-color3, #eef0f3);color:var(--joplin-color, #222);font-size:1.05em">\`\`\`net+
\`\`\`</pre>
        <p style="margin:0;font-size:.9em;opacity:.8">To remove the tool from a note, delete those two lines. You can reopen this window any time from <b>Tools → Examplify Network+ → How to use</b> (on Android, the <b>?</b> button on the editor toolbar).</p>
      </div>`);
    await joplin.views.dialogs.setButtons(dialog, [
      { id: 'copy', title: 'Copy command' },
      { id: 'changelog', title: 'Changelog' },
      { id: 'close', title: 'Close' }
    ]);
    async function showHowTo() {
      const result = await joplin.views.dialogs.open(dialog);
      if (result && result.id === 'changelog') { await showChangelog(); return; }
      if (result && result.id === 'copy') {
        try {
          await joplin.clipboard.writeText(COMMAND_TEXT);
          await joplin.views.dialogs.showToast({ message: 'Copied. Click in a note and press Ctrl+V to paste.', type: 'success', duration: 4000 });
        } catch (e) {
          await joplin.views.dialogs.showMessageBox('Copy did not work. Type ```net+ on one line and ``` on the next line instead.');
        }
      }
    }
    await joplin.commands.register({ name: 'netplusft.howTo', label: 'How to use', iconName: 'fas fa-question-circle', execute: showHowTo });

    /* Changelog window. CHANGELOG_HTML is filled in from CHANGELOG.md by release.py */
    const CHANGELOG_HTML = /*CHANGELOG*/"<h3 style=\"margin:14px 0 4px;font-size:1.1em\">v4.0.0</h3><ul style=\"margin:0 0 12px;padding-left:1.2em\"><li style=\"margin:.2em 0\">Renamed to Examplify Network+. Examplify is the new home for free certification study tools, starting with CompTIA Network+ (N10-009). Your saved progress, ranks, and badges carry over; the Joplin plugin keeps the same ID, so installing this version updates the old one in place.</li><li style=\"margin:.2em 0\">The source now lives on GitHub at github.com/benmhsmith/examplify, with each version published as a GitHub Release (the Joplin plugin and the standalone web page).</li><li style=\"margin:.2em 0\">The web version is also hosted on GitHub Pages, so iPhone and iPad users can open it in Safari and use Add to Home Screen.</li><li style=\"margin:.2em 0\">The top bar now just says Examplify. The home page title reads CompTIA Network+ N10-009, and the version number moved to the bottom of the home page.</li></ul><h3 style=\"margin:14px 0 4px;font-size:1.1em\">v3.9.0</h3><ul style=\"margin:0 0 12px;padding-left:1.2em\"><li style=\"margin:.2em 0\">Routing PBQ: about half of the scenarios now address the Servers and Branch LANs from one /16, and R1 reaches both through a single summary route (some scenarios add summaries on R2 or R3 too). Students see that a router only needs a route that contains the destination, not one that names the exact subnet.</li><li style=\"margin:.2em 0\">Routing PBQ: two new tickets teach longest prefix match: an extra, more specific route that overrides a correct summary, and a summary with too narrow a prefix (/17 instead of /16).</li><li style=\"margin:.2em 0\">Routing PBQ grading: a required route now counts when the student&#x27;s table sends the same destinations to the same next hop, whether they used the summary or separate specific routes.</li><li style=\"margin:.2em 0\">New PBQ: VLAN and trunk troubleshooting. Two switches, one failing ping. Students run show commands (VLAN brief, interface status, trunk, switchport, spanning tree, logging) and identify the faulty switch, the cause, and the fix. Faults: missing VLAN, VLAN not allowed on the trunk, uplinks in access mode, BPDU guard err-disable, and a shut port. Every scenario also includes a normal blocking port, a root-bridge question, and a &quot;why no router is needed&quot; question.</li><li style=\"margin:.2em 0\">New PBQ: Switch port configuration. Students configure an uplink trunk (native VLAN and allowed list), an IP phone port with data and voice VLANs, an LACP server bundle, a printer port, and the unused ports. Feedback includes the model Cisco configuration.</li><li style=\"margin:.2em 0\">New PBQ: Cable and port diagnostics. Students diagnose six desks from cable tester wire maps, switch port status and counters, and ipconfig output: open, short, split pair, duplex mismatch, admin down, err-disabled, wrong VLAN, wrong mask, wrong gateway, or no fault (including a crossover cable that works because of auto-MDIX).</li><li style=\"margin:.2em 0\">New PBQ: NOC monitoring dashboard. Five questions are answered from WAN, top-talker, device health, wireless, and syslog views. Each view has one randomized problem: jitter, loss, saturation, or latency; a reboot, CRC errors, a memory leak, or overheating; co-channel interference, a high noise floor, client overload, or an offline AP; and DHCP exhaustion, SSH brute force, a flapping uplink, or NTP failure.</li><li style=\"margin:.2em 0\">The PBQ Lab now has 10 PBQs. The all-PBQ mini-exam runs all 10, and the regular mini-exams draw from the larger pool.</li><li style=\"margin:.2em 0\">Qualifier Trainer rebuilt to match the other modules. It now has 35 questions (up from 10) across five qualifiers: FIRST, NEXT, BEST, MOST likely, and MINIMUM. It opens on a menu with Questions (sets of 10, 20, or 40) or a Qualifier guide, and the guide is hidden during a set. A qualifier is mastered after 4 different questions about it are answered correctly, and credit stays until Reset or Prestige.</li><li style=\"margin:.2em 0\">PBQ Lab rank now needs consistency: a PBQ is mastered after 3 attempts (each a new random scenario) scoring 90% or better. Attempts at 70\u201389% earn half credit along the way. PBQs finished inside mini-exams count too. Previously, one good attempt on each PBQ was enough for top rank.</li><li style=\"margin:.2em 0\">Mini-Exams rank is now the average of your last 3 full exams (20 or 40 questions, or all PBQs), with missing ones counting as 0. 10-question exams no longer count toward the rank. Previously, the last exam alone set the rank, so one perfect 10-question exam gave Grandmaster.</li><li style=\"margin:.2em 0\">Media &amp; Wireless Match no longer has a Cable tools topic. Cable testers, toners, visual fault locators, and Wi-Fi analyzers are taught only in Which Tool / Command, which covers the full official tool list. Media now has 46 items in 7 topics.</li><li style=\"margin:.2em 0\">New module 06 \u00b7 Security Drill (Stage 2) covers Domain 4.0: 59 terms from objectives 4.1 (concepts, encryption, identity and access, compliance, segmentation), 4.2 (attacks and social engineering), and 4.3 (hardening, NAC, ACLs, filtering, zones). Each term is asked as name it, define it, a scenario, and, for attacks, the best defense. A term is mastered after 2 different question types are answered correctly; a miss clears that term&#x27;s progress until it is mastered. It opens on a menu with Questions (10, 20, or 40) or a Glossary, and the glossary is hidden during a set.</li><li style=\"margin:.2em 0\">Modules after Security are renumbered: Troubleshooting Ladder is 07, Which Tool / Command 08, Qualifier Trainer 09, PBQ Lab 10, and Mini-Exams 11.</li><li style=\"margin:.2em 0\">The Cram Sheet&#x27;s security card now lists the defenses for ARP poisoning, DNS poisoning, VLAN hopping, and evil twin.</li></ul><h3 style=\"margin:14px 0 4px;font-size:1.1em\">v3.8.1</h3><ul style=\"margin:0 0 12px;padding-left:1.2em\"><li style=\"margin:.2em 0\">Changelog wording cleaned up.</li></ul><h3 style=\"margin:14px 0 4px;font-size:1.1em\">v3.8.0</h3><ul style=\"margin:0 0 12px;padding-left:1.2em\"><li style=\"margin:.2em 0\">Subnetting Gym now tracks /16 to /30 (15 prefixes) instead of /8 to /30, so practice stays in the third and fourth octets where block sizes are easy to work out mentally.</li><li style=\"margin:.2em 0\">Media &amp; Wireless Match: 50 items (up from 21) in 8 topics: copper cabling, fiber, connectors, transceivers, Wi-Fi bands and channels, Wi-Fi security and design, installation and environment, and cable tools. Four question types: scenarios, &quot;What is shown?&quot; with drawn mock-ups of the exam connectors, transceivers, and cable tools, &quot;Which picture shows...?&quot;, and odd-one-out. Progress now counts topics mastered; a topic stays mastered until Reset or Prestige.</li><li style=\"margin:.2em 0\">Troubleshooting Ladder: opens on a menu with &quot;Questions&quot; (sets of 10, 20, or 40, no step list during a set) and &quot;The 7 steps&quot; reference. Every question is about the steps and their order: step names and numbers, what comes before or after, what to do next, and which step an action belongs to. A step is mastered after 4 different questions about it are answered correctly. The separate drag-to-order puzzle was folded into these questions.</li><li style=\"margin:.2em 0\">Which Tool / Command: opens on a menu with three modes: Tools and commands, CLI only (the 9 host commands and 7 device show commands), and Tools only (hardware tools plus protocol analyzer, speed tester, and LLDP/CDP), in sets of 10, 20, or 40. Question types: two scenarios per tool, &quot;What does it do?&quot;, &quot;Which command produced this output?&quot; with realistic sample output, and &quot;Which tool is this?&quot; with drawings. Each tool or command is mastered after 3 different correct questions about it.</li></ul><h3 style=\"margin:14px 0 4px;font-size:1.1em\">v3.7.0</h3><ul style=\"margin:0 0 12px;padding-left:1.2em\"><li style=\"margin:.2em 0\">Module Ranks: Beginner under 30%, Novice 30%+, Intermediate 50%+, Advanced 70%+, Expert 80%+, Master 90%+, and a new top rank, Grandmaster, at 100%.</li><li style=\"margin:.2em 0\">The Network+ Mastery Badge (and prestige) now requires Master (90%+) in every module.</li><li style=\"margin:.2em 0\">Grandmaster: a module at 100% glows gold on the home page and the Progress page, and its own page gets a gold aura and a &quot;Grandmaster&quot; banner.</li><li style=\"margin:.2em 0\">A &quot;See instructor for reward&quot; note appears on the home page and the Progress page once a student reaches prestige 20.</li><li style=\"margin:.2em 0\">Any earned prestige badge now replaces the router icon at the center of the home page network graphic.</li><li style=\"margin:.2em 0\">Fixed: inside a Joplin note, animations (the home page graphic, Grandmaster glow) did not run because the in-note stylesheet broke their keyframes.</li></ul><h3 style=\"margin:14px 0 4px;font-size:1.1em\">v3.6.0</h3><ul style=\"margin:0 0 12px;padding-left:1.2em\"><li style=\"margin:.2em 0\">Acronym Gym: removed the 26 optional second-pass acronyms and their checkbox. The gym now covers the 104 core exam acronyms only.</li><li style=\"margin:.2em 0\">Acronym Gym: new Drill description that focuses on testing recall and building acronym retention.</li><li style=\"margin:.2em 0\">OSI Sorter: 75 items (up from 28) across all seven layers, and three question types that switch at random: which layer an item belongs to, which item belongs at a given layer, and which item is the odd one out. Wrong answers come mostly from neighbouring layers, the ones that are easy to mix up.</li><li style=\"margin:.2em 0\">OSI Sorter: progress now counts layers mastered. A layer is mastered once every item on it has been answered correctly, and stays mastered until Reset or Prestige. A strip at the top shows each layer&#x27;s status.</li><li style=\"margin:.2em 0\">Port &amp; Protocol Drill now matches the Acronym Gym: a menu to choose Drill (sets of 10, 20, or 40) or Reference + secure pairs, no reference access during a drill, and a summary at the end of each set.</li><li style=\"margin:.2em 0\">Port &amp; Protocol Drill: a card is mastered the first time it reaches strength 4 and stays mastered after a later miss; a port is mastered when both directions are. Only Reset or Prestige clears it.</li><li style=\"margin:.2em 0\">Subnetting Gym: progress now tracks every prefix from /8 to /30. A prefix is mastered once you have answered each of these correctly for it: prefix to mask, mask to prefix, usable hosts or total addresses, a network ID, and a broadcast ID. Skills stay done after a later miss; only Reset or Prestige clears them.</li><li style=\"margin:.2em 0\">Subnetting Gym opens on a menu that explains how progress works, why /31 isn&#x27;t graded (the 2^h - 2 formula and RFC 3021 point-to-point links give different answers), and shows a grid of all 23 prefixes. Questions show a per-prefix strength meter. The block-size table now covers /8 to /30, and a new question type asks for total addresses.</li></ul><h3 style=\"margin:14px 0 4px;font-size:1.1em\">v3.5.0</h3><ul style=\"margin:0 0 12px;padding-left:1.2em\"><li style=\"margin:.2em 0\">Joplin: the Tools and Help submenus now read just &quot;How to use&quot; and &quot;Changelog&quot; instead of repeating the plugin name.</li><li style=\"margin:.2em 0\">Acronym Gym: an acronym now counts as mastered the first time it reaches strength 4, and stays mastered even after a later miss. Only Reset or Prestige clears it. Mastered acronyms show a Mastered tag in the drill and a green dot in the glossary, and come up less often so practice focuses on the rest.</li><li style=\"margin:.2em 0\">Acronym Gym now opens on a menu: choose Drill (sets of 10, 20, or 40 questions) or Glossary. The glossary is hidden during a drill and opens again when the set is finished or you quit. Each set ends with a summary of your score, newly mastered acronyms, and what you missed.</li><li style=\"margin:.2em 0\">Acronym Gym &quot;Spell it out&quot; questions are harder: the wrong answers are made-up expansions that still fit the acronym&#x27;s letters (for DHCP: Dynamic Host Control Protocol, Dynamic Hop Configuration Protocol, and so on).</li></ul><h3 style=\"margin:14px 0 4px;font-size:1.1em\">v3.4.0</h3><ul style=\"margin:0 0 12px;padding-left:1.2em\"><li style=\"margin:.2em 0\">Every badge now has its own icon tied to its name (RJ45 plug for Patch Cable, brick wall and flame for Firewall, server rack for Data Center, globe for The Internet, and so on), with the level number on a tag at the bottom.</li></ul><h3 style=\"margin:14px 0 4px;font-size:1.1em\">v3.3.0</h3><ul style=\"margin:0 0 12px;padding-left:1.2em\"><li style=\"margin:.2em 0\">Removed the Tier system. Every module now shows a Module Rank based on its progress bar: Beginner (under 20%), Novice (20%+), Intermediate (40%+), Advanced (60%+), Expert (80%+). The rank appears on the home page, the Progress page, each module&#x27;s header, and each PBQ in the PBQ Lab (from its best score).</li><li style=\"margin:.2em 0\">New Network+ Mastery Badge: reach Expert in all 10 modules to earn it. It shows on the home page.</li><li style=\"margin:.2em 0\">New prestige option on the Progress page (for fun): once every module is at Expert, prestige resets all module progress and keeps your badge. 20 prestige levels, each with its own badge and name, from Patch Cable to The Internet.</li><li style=\"margin:.2em 0\">Reset all progress clears module progress only. Badges and prestige level are kept; they are lost only if the browser&#x27;s or Joplin&#x27;s own data is wiped.</li><li style=\"margin:.2em 0\">Progress page &quot;Study next&quot; now points to the module with the lowest progress.</li><li style=\"margin:.2em 0\">Fixed the PBQ Lab list layout.</li></ul><h3 style=\"margin:14px 0 4px;font-size:1.1em\">v3.2.0</h3><ul style=\"margin:0 0 12px;padding-left:1.2em\"><li style=\"margin:.2em 0\">Joplin: the plugin now installs on Joplin for Android (Configuration &gt; Plugins &gt; Advanced settings &gt; Install from file). Joplin for iPhone and iPad only allows plugins from Joplin&#x27;s recommended list, so it can&#x27;t install this one.</li><li style=\"margin:.2em 0\">Android: a ? button on the editor toolbar opens How to use, since the mobile app has no Tools menu. The Tools/Help submenu and the full-width view (Ctrl+Alt+V) stay desktop-only.</li><li style=\"margin:.2em 0\">How to use now has a Changelog button and Android instructions.</li><li style=\"margin:.2em 0\">In the note on a phone screen: larger buttons, and PBQ diagrams scroll sideways at a readable size.</li></ul><h3 style=\"margin:14px 0 4px;font-size:1.1em\">v3.1.0</h3><ul style=\"margin:0 0 12px;padding-left:1.2em\"><li style=\"margin:.2em 0\">Modules reordered into five stages: Foundations, Core skills, Troubleshooting, Exam skills, Test. New numbers: 01 Acronym Gym, 02 OSI Sorter, 03 Port &amp; Protocol Drill, 04 Subnetting Gym, 05 Media &amp; Wireless Match, 06 Troubleshooting Ladder, 07 Which Tool / Command, 08 Qualifier Trainer, 09 PBQ Lab, 10 Mini-Exams. No questions changed, and saved progress carries over.</li><li style=\"margin:.2em 0\">Joplin: Tools and Help now have a Network+ Readiness Lab submenu with How to use and Changelog.</li><li style=\"margin:.2em 0\">Joplin: this changelog opens automatically after each plugin update.</li></ul><h3 style=\"margin:14px 0 4px;font-size:1.1em\">v3.0.0</h3><ul style=\"margin:0 0 12px;padding-left:1.2em\"><li style=\"margin:.2em 0\">Renamed from Net+ Fast Track to Network+ Readiness Lab. The Joplin plugin keeps the same ID, so installing over 2.x keeps saved progress, and the ```net+ command still works.</li><li style=\"margin:.2em 0\">Versioned file names, and the version number now shows next to the name in the top bar.</li><li style=\"margin:.2em 0\">New home header: CompTIA Network+ N10-009 title with a network graphic. Removed the question count, time limit and passing score tiles.</li></ul><h3 style=\"margin:14px 0 4px;font-size:1.1em\">v2.x</h3><p style=\"margin:0 0 12px\">Released as Net+ Fast Track: modules, Joplin plugin, PBQ Lab, mini-exams with PBQs, neutral dark theme, Atkinson Hyperlegible fonts, Desktop/Mobile switch.</p>"/*END*/;
    const changelog = await joplin.views.dialogs.create('netplusft_changelog');
    await joplin.views.dialogs.setHtml(changelog, `
      <div style="font-family:var(--joplin-font-family, system-ui, sans-serif);color:var(--joplin-color, #222);width:560px;max-width:100%;padding:4px 6px;line-height:1.5">
        <h2 style="margin:0 0 2px;font-size:1.4em">Examplify Network+ changelog</h2>
        <p style="margin:0 0 10px;opacity:.75">You are on version ${DIAG.version}.</p>
        <div style="max-height:60vh;overflow-y:auto;padding-right:8px">${CHANGELOG_HTML}</div>
      </div>`);
    await joplin.views.dialogs.setButtons(changelog, [{ id: 'close', title: 'Close' }]);
    async function showChangelog() { await joplin.views.dialogs.open(changelog); }
    await joplin.commands.register({ name: 'netplusft.changelog', label: 'Changelog', execute: showChangelog });

    /* Tools (and Help) > Examplify Network+ > How to use / Changelog */
    const SUB = [
      { commandName: 'netplusft.howTo', label: 'How to use' },
      { commandName: 'netplusft.changelog', label: 'Changelog' }
    ];
    if (PLATFORM !== 'desktop') {
      /* Joplin Mobile has no menu bar: put How to use on the editor toolbar instead */
      try { await joplin.views.toolbarButtons.create('netplusft_howto_btn', 'netplusft.howTo', 'editorToolbar'); } catch (e) { note(DIAG.errors, 'toolbar: ' + (e && e.message || e)); }
    } else {
      try {
        if (joplin.views.menus && typeof joplin.views.menus.create === 'function') {
          await joplin.views.menus.create('netplusft_tools_menu', 'Examplify Network+', SUB, 'tools');
          await joplin.views.menus.create('netplusft_help_menu', 'Examplify Network+', SUB, 'help');
        } else {
          await joplin.views.menuItems.create('netplusft_howto_tools', 'netplusft.howTo', 'tools');
          await joplin.views.menuItems.create('netplusft_changelog_tools', 'netplusft.changelog', 'tools');
        }
      } catch (e) { note(DIAG.errors, 'menus: ' + (e && e.message || e)); }
    }

    /* First install: show How to use. After an update: show the changelog. */
    const SEEN_KEY = 'netplusft.lastVersionSeen';
    await joplin.settings.registerSettings({
      [SEEN_KEY]: { value: '', type: 2 /* String */, public: false, label: 'Examplify Network+ last version seen' }
    });
    const firstInstall = !(await joplin.settings.value(WELCOME_KEY));
    const lastSeen = await joplin.settings.value(SEEN_KEY);
    await joplin.settings.setValue(SEEN_KEY, DIAG.version);
    if (firstInstall) {
      await joplin.settings.setValue(WELCOME_KEY, true);
      setTimeout(function () { showHowTo().catch(function () {}); }, 2500);
    } else if (lastSeen !== DIAG.version) {
      setTimeout(function () { showChangelog().catch(function () {}); }, 2500);
    }

    /* In-viewer version (works on every Joplin version that supports plugins) */
    await joplin.contentScripts.register('markdownItPlugin', CS_ID, './contentScript.js');
    await joplin.contentScripts.onMessage(CS_ID, handle);

    /* Full-width editor version (Joplin versions with the editor-plugin API) */
    if (PLATFORM !== 'desktop') return;
    const editors = joplin.views && joplin.views.editors;
    DIAG.editorsApi = editors ? 'present' : 'missing';
    if (!editors) return;

    async function isStudyNote(noteId) {
      if (!noteId) return false;
      try {
        const n = await joplin.data.get(['notes', noteId], { fields: ['id', 'body'] });
        const r = !!(n && FENCE.test(n.body || ''));
        note(DIAG.checks, (noteId || '').slice(0, 6) + '=' + r);
        return r;
      } catch (e) { note(DIAG.errors, 'check: ' + (e && e.message || e)); return false; }
    }
    const handles = [];
    async function setup(h) {
      handles.push(h); DIAG.setupCalls++; DIAG.handle = h;
      await editors.setHtml(h, '<div id="nft-root"><header class="top"><div class="top-in"><a class="brand" href="#home"><svg class="kmark" viewBox="0 0 88 88" aria-hidden="true"><circle cx="44" cy="44" r="7.5" fill="var(--shu)"/><path d="M44 24 A20 20 0 1 1 25.2 37.2" fill="none" stroke="var(--ink)" stroke-width="6.5" stroke-linecap="round"/><path d="M44 10 A34 34 0 1 1 13.6 28.8" fill="none" stroke="var(--ink)" stroke-width="6.5" stroke-linecap="round" opacity="0.45"/></svg><b>keiko</b><span class="ktag">practice until it&#39;s yours</span></a><a class="chipbtn" href="#cram" style="text-decoration:none;padding:6px 12px">Cram Sheet</a><a class="chipbtn" href="#progress" style="text-decoration:none;padding:6px 12px">Progress</a></div></header><main id="app"><p style="padding:16px">Loading…</p></main></div>');
      await editors.addScript(h, './editor.css');
      await editors.addScript(h, './editor.js');
      await editors.onMessage(h, handle);
      // Refresh progress whenever the editor is shown again (the viewer version may have saved in between)
      await editors.onUpdate(h, async function () {
        try { editors.postMessage(h, { type: 'reload' }); } catch (e) {}
      });
    }
    const check = async function (event) { return await isStudyNote(event && event.noteId); };

    let usable = false;
    try {
      if (typeof editors.register === 'function') {
        await editors.register(EDITOR_ID, { onSetup: setup, onActivationCheck: check });
        usable = true; DIAG.method = 'register';
      } else if (typeof editors.create === 'function') {
        const h = await editors.create(EDITOR_ID);
        await setup(h);
        await editors.onActivationCheck(h, check);
        usable = true; DIAG.method = 'create';
      }
    } catch (e) { usable = false; note(DIAG.errors, 'register: ' + (e && e.message || e)); }
    if (!usable) return;

    /* Open study notes straight into the tool. Toggle editor plugin (Ctrl+Alt+V) still switches to Markdown.
       Joplin decides editor activation asynchronously after a note loads, so wait until our editor is
       active before asking Joplin to show it, retrying for a few seconds. */
    const sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
    let runToken = 0;
    async function ensureShown(noteId) {
      const token = ++runToken;
      const delays = [150, 300, 500, 800, 1200, 2000, 3000];
      for (let i = 0; i < delays.length; i++) {
        await sleep(delays[i]);
        if (token !== runToken) return;
        const cur = await joplin.workspace.selectedNote();
        if (!cur || cur.id !== noteId) return;
        const h = handles[0];
        if (!h) continue;
        try { if (await editors.isVisible(h)) return; } catch (e) {}
        let active = false;
        try { active = await editors.isActive(h); } catch (e) {}
        if (!active) { if (i === delays.length - 1) note(DIAG.shows, 'gave up: editor never active'); continue; }
        try { await joplin.commands.execute('showEditorPlugin'); note(DIAG.shows, 'show called (try ' + (i + 1) + ')'); } catch (e) { note(DIAG.errors, 'show: ' + (e && e.message || e)); }
      }
    }
    let lastNoteId = null;
    async function onSelection() {
      const note = await joplin.workspace.selectedNote();
      if (!note) { lastNoteId = null; return; }
      if (note.id === lastNoteId) return; // same note: respect the user's toggle choice
      lastNoteId = note.id;
      if (FENCE.test(note.body || '')) ensureShown(note.id);
    }
    await joplin.workspace.onNoteSelectionChange(function () { onSelection(); });
    onSelection(); // note already open at startup
  }
});
