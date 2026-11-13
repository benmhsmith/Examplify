/* Provo Security+ — Joplin plugin.
   - Notes containing a ```sec+ block open in a full-width "Provo Security+" editor
     (Joplin's editor-plugin API). The normal editor is one click away via Toggle editor.
   - The same block also renders inside the Markdown viewer (content script), as a fallback.
   - The plugin never writes to the note, so the note's Markdown is never altered.
   - Tools/Help > Provo Security+ > How to use opens instructions with a Copy command button.
     The same window opens once automatically after the plugin is first installed. */
joplin.plugins.register({
  onStart: async function () {
    const CS_ID = 'secplus_cs';
    const EDITOR_ID = 'secplus_editor';
    const KEY = 'secplus.progress';
    const FENCE = /^\s*```\s*(sec\+|sec-plus)\s*$/im;
    const DIAG = { version: '1.2.0', editorsApi: 'unknown', method: 'none', setupCalls: 0, handle: null, checks: [], shows: [], errors: [] };
    const note = function (arr, v) { arr.push(v); if (arr.length > 8) arr.shift(); };

    /* desktop or mobile (Joplin Android). Menus and the full-width editor are desktop-only. */
    let PLATFORM = 'desktop';
    try { const vi = await joplin.versionInfo(); if (vi && vi.platform) PLATFORM = vi.platform; } catch (e) {}
    DIAG.platform = PLATFORM;

    await joplin.settings.registerSettings({
      [KEY]: { value: '', type: 2 /* String */, public: false, label: 'Provo Security+ saved progress' }
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
    const STUDY_KEY = 'secplus.studyNotes';
    await joplin.settings.registerSettings({
      [STUDY_KEY]: { value: '[]', type: 2 /* String */, public: false, label: 'Provo Security+ study notes' }
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
    /* Turn the outline off without a restart (for example after "Reset everything, including badges").
       A chrome stylesheet cannot be unloaded, so a later stylesheet cancels it, and old files are deleted
       so nothing is left for the next session. */
    async function archOff() {
      if (archBusy) return;
      archBusy = true;
      try {
        const fs = joplin.require('fs-extra');
        const dir = await joplin.plugins.dataDir();
        if (lastCss) {
          /* the outline is showing in this session: cancel it with a later stylesheet */
          const file = dir + '/grand-architect-off-' + Date.now() + '.css';
          await fs.writeFile(file, '/* Provo Security+: Grand Architect off */\n.note-list-item-wrapper[data-id], .list-item-container[data-folder-id] { animation: none !important; box-shadow: none !important; }\n', 'utf8');
          await joplin.window.loadChromeCssFile(file);
          lastCss = '';
          DIAG.arch = 'off';
        } else if (!archCleaned) {
          /* nothing loaded this session: delete stylesheets left over from earlier sessions */
          archCleaned = true;
          try { (await fs.readdir(dir)).filter(f => /^grand-architect-(off-)?\d+\.css$/.test(f)).forEach(f => fs.remove(dir + '/' + f).catch(() => {})); } catch (e) {}
        }
      } catch (e) { note(DIAG.errors, 'archOff: ' + (e && e.message || e)); }
      archBusy = false;
    }
    async function archCheck(progressJson) {
      if (PLATFORM !== 'desktop' || archBusy) return;
      let secret = 0; try { secret = (JSON.parse(progressJson || '{}').secret) || 0; } catch (e) {}
      if (secret < 5) { await archOff(); return; }
      archBusy = true;
      try {
        if (!archScanned) { archScanned = true; await scanStudyNotes(); }
        const list = await studyList();
        if (!list.length) { archBusy = false; return; }
        const notes = list.map(x => `.note-list-item-wrapper[data-id="${x.note}"]`).join(',\n');
        const folders = [...new Set(list.map(x => x.folder).filter(Boolean))].map(f => `.list-item-container[data-folder-id="${f}"]`).join(',\n');
        const css = `/* Provo Security+: Grand Architect */
@keyframes sftArchGlow {
  0%, 100% { box-shadow: inset 0 0 0 2px rgba(255,90,90,.55), inset 0 0 10px rgba(255,90,90,.14); }
  20% { box-shadow: inset 0 0 0 2px rgba(255,200,70,.55), inset 0 0 10px rgba(255,200,70,.14); }
  40% { box-shadow: inset 0 0 0 2px rgba(80,220,120,.55), inset 0 0 10px rgba(80,220,120,.14); }
  60% { box-shadow: inset 0 0 0 2px rgba(70,170,255,.55), inset 0 0 10px rgba(70,170,255,.14); }
  80% { box-shadow: inset 0 0 0 2px rgba(170,110,255,.55), inset 0 0 10px rgba(170,110,255,.14); }
}
${[notes, folders].filter(Boolean).join(',\n')} { border-radius: 6px; animation: sftArchGlow 9s linear infinite !important; }
@media (prefers-reduced-motion: reduce) { ${[notes, folders].filter(Boolean).join(',\n')} { animation: none !important; box-shadow: inset 0 0 0 2px rgba(70,170,255,.55) !important; } }
`;
        if (css === lastCss) { archBusy = false; return; }
        lastCss = css;
        const fs = joplin.require('fs-extra');
        const dir = await joplin.plugins.dataDir();
        if (!archCleaned) { archCleaned = true; try { (await fs.readdir(dir)).filter(f => /^grand-architect-(off-)?\d+\.css$/.test(f)).forEach(f => fs.remove(dir + '/' + f).catch(() => {})); } catch (e) {} }
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
    const WELCOME_KEY = 'secplus.welcomeShown';
    await joplin.settings.registerSettings({
      [WELCOME_KEY]: { value: false, type: 3 /* Bool */, public: false, label: 'Provo Security+ welcome shown' }
    });
    const COMMAND_TEXT = '```sec+\n```\n';
    const NOTE_TITLE = 'Provo Security+';
    const NOTE_BODY = COMMAND_TEXT + '\n<!-- This note opens Provo Security+. If you see this text, click Toggle editor (top right) to go back to the tool. Keep the two lines above. -->\n';
    /* Add a ready-made study note: creates "Provo Security+" in the notebook that is open (or in a "Provo" notebook
       if none is open) and opens it, which shows the full-width tool. Progress lives in Joplin's settings,
       not in the note, so notes can be deleted and added again without losing anything. */
    async function addStudyNote(quiet) {
      try {
        let folderId = '';
        try { const f = await joplin.workspace.selectedFolder(); folderId = (f && f.id) || ''; } catch (e) {}
        if (!folderId) { try { const cur = await joplin.workspace.selectedNote(); folderId = (cur && cur.parent_id) || ''; } catch (e) {} }
        if (!folderId) {
          const res = await joplin.data.get(['folders'], { fields: ['id', 'title'], limit: 100 });
          const existing = (res.items || []).find(function (f) { return f.title === 'Provo'; });
          folderId = existing ? existing.id : (await joplin.data.post(['folders'], null, { title: 'Provo' })).id;
        }
        const created = await joplin.data.post(['notes'], null, { title: NOTE_TITLE, body: NOTE_BODY, parent_id: folderId });
        if (!quiet) await joplin.commands.execute('openNote', created.id);
        return created.id;
        if (!quiet) { try { await joplin.views.dialogs.showToast({ message: NOTE_TITLE + ' note added.', type: 'success', duration: 3000 }); } catch (e) {} }
      } catch (e) {
        note(DIAG.errors, 'add note: ' + (e && e.message || e));
        if (quiet) return '';
        await joplin.views.dialogs.showMessageBox('Could not add the note automatically. Create a note and type ```sec+ on one line and ``` on the next line instead.');
      }
    }
    await joplin.commands.register({ name: 'secplus.addNote', label: 'Add Provo Security+ note', iconName: 'fas fa-plus-circle', execute: addStudyNote });
    const dialog = await joplin.views.dialogs.create('secplus_howto');
    try { await joplin.views.dialogs.setFitToContent(dialog, false); } catch (e) {} /* fixed size: content scrolls, buttons stay visible on small screens */
    await joplin.views.dialogs.setHtml(dialog, `
      <style>html,body{height:100%}body{overflow-y:auto!important}</style>
      <div style="font-family:var(--joplin-font-family, system-ui, sans-serif);color:var(--joplin-color, #222);max-width:560px;margin:0 auto;padding:4px 6px 16px;line-height:1.5">
        <h2 style="margin:0 0 6px;font-size:1.4em">Provo Security+</h2>
        <p style="margin:0 0 12px">A study tool for the CompTIA Security+ (SY0-701) exam. It covers every exam domain: security controls, cryptography, threats and attacks, architecture, operations, identity and access, incident response, and governance, plus timed mini-exams and a one-page cram sheet. Your progress saves automatically.</p>
        <h3 style="margin:0 0 6px;font-size:1.1em">Add it to Joplin</h3>
        <p style="margin:0 0 12px">Click <b>Add Provo Security+ note</b> below, or choose <b>Tools → Provo Security+ → Add Provo Security+ note</b>. A note named <b>Provo Security+</b> is created in the notebook you have open, and it opens straight into the full-width tool. You can delete the note at any time: your progress is saved in Joplin, not in the note, so adding the note again picks up where you left off.</p>
        <h3 style="margin:0 0 6px;font-size:1.1em">Or add it to a note yourself</h3>
        <ol style="margin:0 0 12px;padding-left:1.3em">
          <li>Create a new note, or open the note you want to use.</li>
          <li>Use the <b>Markdown editor</b> (plain text). If you see a Word-style formatting toolbar instead, click <b>Toggle editor</b> at the top right of the note.</li>
          <li>Click <b>Copy command</b> below, then click in the note and paste with <b>Ctrl+V</b>.</li>
          <li>The tool appears in the preview pane. For a full-width view, press <b>Ctrl+Alt+V</b>.</li>
        </ol>
        <p style="margin:0 0 12px"><b>On Android:</b> open the note in edit mode, paste the command, then switch back to view mode. The tool appears in the note.</p>
        <p style="margin:0 0 4px">The command is these two lines:</p>
        <pre style="margin:0 0 12px;padding:8px 12px;border-radius:6px;background:var(--joplin-background-color3, #eef0f3);color:var(--joplin-color, #222);font-size:1.05em">\`\`\`sec+
\`\`\`</pre>
        <p style="margin:0;font-size:.9em;opacity:.8">To remove the tool from a note, delete those two lines. You can reopen this window any time from <b>Tools → Provo Security+ → How to use</b> (on Android, the <b>?</b> button on the editor toolbar).</p>
      </div>`);
    await joplin.views.dialogs.setButtons(dialog, [
      { id: 'add', title: 'Add Provo Security+ note' },
      { id: 'copy', title: 'Copy command' },
      { id: 'changelog', title: 'Changelog' },
      { id: 'close', title: 'Close' }
    ]);
    async function showHowTo() {
      const result = await joplin.views.dialogs.open(dialog);
      if (result && result.id === 'add') { await addStudyNote(); return; }
      if (result && result.id === 'changelog') { await showChangelog(); return; }
      if (result && result.id === 'copy') {
        try {
          await joplin.clipboard.writeText(COMMAND_TEXT);
          await joplin.views.dialogs.showToast({ message: 'Copied. Click in a note and press Ctrl+V to paste.', type: 'success', duration: 4000 });
        } catch (e) {
          await joplin.views.dialogs.showMessageBox('Copy did not work. Type ```sec+ on one line and ``` on the next line instead.');
        }
      }
    }
    await joplin.commands.register({ name: 'secplus.howTo', label: 'How to use', iconName: 'fas fa-question-circle', execute: showHowTo });

    /* Changelog window. CHANGELOG_HTML is filled in from CHANGELOG.md by release.py */
    const CHANGELOG_HTML = /*CHANGELOG*/"<h3 style=\"margin:14px 0 4px;font-size:1.1em\">v1.2.0</h3><ul style=\"margin:0 0 12px;padding-left:1.2em\"><li style=\"margin:.2em 0\">A menu in the top bar links to the Provo home page (all exams), this exam&#x27;s home, Contact us, and Report an issue. Selecting the Provo icon also returns to the Provo home page.</li><li style=\"margin:.2em 0\">Report an issue opens a pre-filled GitHub report with the exam, page, version and browser filled in.</li><li style=\"margin:.2em 0\">Contact us sends a message by email from inside the page.</li></ul><h3 style=\"margin:14px 0 4px;font-size:1.1em\">v1.1.0</h3><ul style=\"margin:0 0 12px;padding-left:1.2em\"><li style=\"margin:.2em 0\">Every answer is explained. After any multiple-choice question, Provo now shows why the correct answer is right and why each of the other options is wrong, with your own pick marked. This covers every drill and question type, from acronyms and terms to the question qualifiers.</li><li style=\"margin:.2em 0\">Mini-exams still give no feedback while you take them. Afterwards, the new Review your answers section walks through every question the same way: missed questions first, with a button to see all of them.</li><li style=\"margin:.2em 0\">Provo branding only: the footer and Joplin plugin details no longer name a company.</li><li style=\"margin:.2em 0\">New Provo icon: a white P on a border in the five domain colors. It appears in the top bar, at the center of the home header art, as the browser-tab icon, as the home-screen icon when the page is added to a phone, and as the Joplin plugin icon.</li><li style=\"margin:.2em 0\">License: Provo is now copyrighted by Benjamin Smith, and MyComputerCareer holds a right of first refusal to acquire it. See LICENSE.</li></ul><h3 style=\"margin:14px 0 4px;font-size:1.1em\">v1.0.0</h3><ul style=\"margin:0 0 12px;padding-left:1.2em\"><li style=\"margin:.2em 0\">Out of preview: every module from 02 to 10 now has hands-on labs alongside its questions, and every module covers its full SY0-701 objectives. Performance-based questions are still coming soon.</li><li style=\"margin:.2em 0\">New labs, 24 in all. Drag-and-drop works with a mouse, a finger, or by tapping a tile and then a target. Getting a lab task right on the first check counts as one question for each term it uses.</li><li style=\"margin:.2em 0\">02 Security Controls &amp; Concepts and every term module after it: Type the answer. Read a scenario and type the term, with no options to choose from. A correct answer with no hint masters the term in one go; with a hint, it counts as one question. Small typos and common alternative names (such as mantrap, whitelist, or SOP) are accepted.</li><li style=\"margin:.2em 0\">01 Acronyms: new Type it mode. Type the acronym from its meaning, or type out what an acronym stands for. Each correct answer adds two strength dots.</li><li style=\"margin:.2em 0\">01 Acronyms: trimmed to the 178 most likely to matter on the exam. General IT terms (such as LAN, URL, and HDD) and rarely tested acronyms are left out so students can focus. Progress on the acronyms that remain is kept.</li><li style=\"margin:.2em 0\">03 Cryptography &amp; PKI: Key Flow (a sender, a recipient, a certificate authority, and Mallory on the wire: drag the right key onto each step, 8 tasks) and Sort the cipher (symmetric, asymmetric, or hashing).</li><li style=\"margin:.2em 0\">04 Threat Actors &amp; Vectors: Threat Actor Profiler, Attack Surface Map, and Spot the Phish (fictional emails, text messages, and look-alike web addresses to inspect and report).</li><li style=\"margin:.2em 0\">05 Vulnerabilities &amp; Attacks: Vulnerability Hunt (penetration test findings by kind of vulnerability), Malware Lineup, and Kill Chain Builder.</li><li style=\"margin:.2em 0\">06 Security Architecture: Shared Responsibility (on-premises, IaaS, PaaS, SaaS), Network Zones, and Recovery Planner (RTO and RPO).</li><li style=\"margin:.2em 0\">07 Security Operations: Tool Match, Vulnerability Management cycle, and Disposal Decisions.</li><li style=\"margin:.2em 0\">08 Identity &amp; Access Management: Factor Sort, Access Model Match, and Sign-in Flows (SAML, OAuth, and the account lifecycle).</li><li style=\"margin:.2em 0\">09 Incident Response &amp; Forensics: Incident Timeline, Order of Volatility, and Which Log?</li><li style=\"margin:.2em 0\">10 Governance, Risk &amp; Compliance: Risk Calculator (SLE, ARO, ALE, and whether a control is worth it), Risk Responses, Policy or Procedure?, and Agreement Match.</li><li style=\"margin:.2em 0\">New Security+ badges: a Security+ Mastery badge, 20 prestige badges from Strong Password to Chief Information Security Officer, and 5 secret badges ending with The Vault.</li></ul><h3 style=\"margin:14px 0 4px;font-size:1.1em\">v0.2.0</h3><ul style=\"margin:0 0 12px;padding-left:1.2em\"><li style=\"margin:.2em 0\">Full content: the Acronyms module now has CompTIA&#x27;s complete SY0-701 acronym list (328 acronyms). The 247 core acronyms set your rank; the rest, which CompTIA lists but rarely tests, are marked Also listed and come up less often.</li><li style=\"margin:.2em 0\">Full content: the nine term modules now cover every SY0-701 objective, 394 terms in all (up from 113), each asked as a definition, a name, and a scenario. Existing progress carries over.</li><li style=\"margin:.2em 0\">Full content: the Mini-Exams bank now has 127 multiple-choice questions (up from 15), weighted to the domains, and Question Qualifiers has eight scenarios for each qualifier (up from one).</li><li style=\"margin:.2em 0\">Cram Sheet: new sections for zero trust, social engineering, states of data, email authentication, business impact metrics, penetration testing, and forensics.</li><li style=\"margin:.2em 0\">New header art for Security+: a threat radar with the MyComputerCareer logo at the center. Its outer ring is split into the five domains by exam weight, and as the sweep turns, each domain&#x27;s blip lights up when the line crosses it and fades before the next pass.</li><li style=\"margin:.2em 0\">Joplin: new &quot;Add Provo Security+ note&quot; command (Tools \u2192 Provo Security+, and a button in the How to use window). It creates a note named Provo Security+ in the notebook you have open and opens it straight into the full-width tool, so there is nothing to copy and paste. Delete the note any time; your progress is kept and comes back when you add the note again.</li><li style=\"margin:.2em 0\">Joplin: notes added by the plugin include a short hidden line that tells anyone who switches to the Markdown editor how to get back to the tool.</li><li style=\"margin:.2em 0\">Joplin: the How to use and Changelog windows now have a fixed size and scroll, so long text is no longer cut off and the buttons stay on screen even when Joplin cannot be made larger.</li></ul><h3 style=\"margin:14px 0 4px;font-size:1.1em\">v0.1.0</h3><p style=\"margin:0 0 12px\">First release of Provo Security+ for CompTIA Security+ SY0-701. This is a preview: every module works, and each is being expanded to cover its full objectives.</p><ul style=\"margin:0 0 12px;padding-left:1.2em\"><li style=\"margin:.2em 0\">13 modules in 5 stages covering all five SY0-701 domains, weighted 12 / 22 / 18 / 28 / 20 like the exam.</li><li style=\"margin:.2em 0\">Modules 02\u201310 ask each term several ways: name it, define it, spot it in a scenario, and, for attacks, pick the best defense.</li><li style=\"margin:.2em 0\">Acronyms, Question Qualifiers, a one-page Cram Sheet, and a Progress page.</li><li style=\"margin:.2em 0\">Mini-Exams: 10, 20, or 40 multiple-choice questions, timed at one minute per question and weighted by domain.</li><li style=\"margin:.2em 0\">Performance-Based Questions are coming soon. Until then they do not count toward the Security+ Mastery Badge.</li><li style=\"margin:.2em 0\">Five ranks per module, from Beginner to Pro. Reach Expert in every module for the Security+ Mastery Badge.</li><li style=\"margin:.2em 0\">Progress is saved separately from Network+, and the Joplin plugin installs beside Provo Network+ (use a ```sec+ block).</li><li style=\"margin:.2em 0\">Starter content: 113 terms, 36 acronyms, 5 qualifier questions, and 15 exam questions so far.</li></ul>"/*END*/;
    const changelog = await joplin.views.dialogs.create('secplus_changelog');
    try { await joplin.views.dialogs.setFitToContent(changelog, false); } catch (e) {} /* fixed size: content scrolls, buttons stay visible on small screens */
    await joplin.views.dialogs.setHtml(changelog, `
      <style>html,body{height:100%}body{overflow-y:auto!important}</style>
      <div style="font-family:var(--joplin-font-family, system-ui, sans-serif);color:var(--joplin-color, #222);max-width:600px;margin:0 auto;padding:4px 6px 16px;line-height:1.5">
        <h2 style="margin:0 0 2px;font-size:1.4em">Provo Security+ changelog</h2>
        <p style="margin:0 0 10px;opacity:.75">You are on version ${DIAG.version}.</p>
        <div>${CHANGELOG_HTML}</div>
      </div>`);
    await joplin.views.dialogs.setButtons(changelog, [{ id: 'close', title: 'Close' }]);
    async function showChangelog() { await joplin.views.dialogs.open(changelog); }
    await joplin.commands.register({ name: 'secplus.changelog', label: 'Changelog', execute: showChangelog });

    /* Tools (and Help) > Provo Security+ > How to use / Changelog */
    const SUB = [
      { commandName: 'secplus.addNote', label: 'Add Provo Security+ note' },
      { commandName: 'secplus.howTo', label: 'How to use' },
      { commandName: 'secplus.changelog', label: 'Changelog' }
    ];
    if (PLATFORM !== 'desktop') {
      /* Joplin Mobile has no menu bar: put How to use on the editor toolbar instead */
      try { await joplin.views.toolbarButtons.create('secplus_addnote_btn', 'secplus.addNote', 'editorToolbar'); } catch (e) { note(DIAG.errors, 'toolbar add: ' + (e && e.message || e)); }
      try { await joplin.views.toolbarButtons.create('secplus_howto_btn', 'secplus.howTo', 'editorToolbar'); } catch (e) { note(DIAG.errors, 'toolbar: ' + (e && e.message || e)); }
    } else {
      try {
        if (joplin.views.menus && typeof joplin.views.menus.create === 'function') {
          await joplin.views.menus.create('secplus_tools_menu', 'Provo Security+', SUB, 'tools');
          await joplin.views.menus.create('secplus_help_menu', 'Provo Security+', SUB, 'help');
        } else {
          await joplin.views.menuItems.create('secplus_addnote_tools', 'secplus.addNote', 'tools');
          await joplin.views.menuItems.create('secplus_howto_tools', 'secplus.howTo', 'tools');
          await joplin.views.menuItems.create('secplus_changelog_tools', 'secplus.changelog', 'tools');
        }
      } catch (e) { note(DIAG.errors, 'menus: ' + (e && e.message || e)); }
    }

    /* First install: show How to use. After an update: show the changelog. */
    const SEEN_KEY = 'secplus.lastVersionSeen';
    await joplin.settings.registerSettings({
      [SEEN_KEY]: { value: '', type: 2 /* String */, public: false, label: 'Provo Security+ last version seen' }
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
      await editors.setHtml(h, '<div id="sft-root"><header class="top"><div class="top-in"><a class="brand" href="#home" aria-label="Provo, home"><svg class="pvicon" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="13" fill="#0E1013"/><path d="M32 3.5H51A9.5 9.5 0 0 1 60.5 13V51A9.5 9.5 0 0 1 51 60.5H13A9.5 9.5 0 0 1 3.5 51V13A9.5 9.5 0 0 1 13 3.5H32" fill="none" stroke="#6EA4E8" stroke-width="7" pathLength="100" stroke-dasharray="23 77" stroke-dashoffset="0"/><path d="M32 3.5H51A9.5 9.5 0 0 1 60.5 13V51A9.5 9.5 0 0 1 51 60.5H13A9.5 9.5 0 0 1 3.5 51V13A9.5 9.5 0 0 1 13 3.5H32" fill="none" stroke="#4DBA80" stroke-width="7" pathLength="100" stroke-dasharray="20 80" stroke-dashoffset="-23"/><path d="M32 3.5H51A9.5 9.5 0 0 1 60.5 13V51A9.5 9.5 0 0 1 51 60.5H13A9.5 9.5 0 0 1 3.5 51V13A9.5 9.5 0 0 1 13 3.5H32" fill="none" stroke="#E8C25A" stroke-width="7" pathLength="100" stroke-dasharray="19 81" stroke-dashoffset="-43"/><path d="M32 3.5H51A9.5 9.5 0 0 1 60.5 13V51A9.5 9.5 0 0 1 51 60.5H13A9.5 9.5 0 0 1 3.5 51V13A9.5 9.5 0 0 1 13 3.5H32" fill="none" stroke="#F07070" stroke-width="7" pathLength="100" stroke-dasharray="14 86" stroke-dashoffset="-62"/><path d="M32 3.5H51A9.5 9.5 0 0 1 60.5 13V51A9.5 9.5 0 0 1 51 60.5H13A9.5 9.5 0 0 1 3.5 51V13A9.5 9.5 0 0 1 13 3.5H32" fill="none" stroke="#A994E0" stroke-width="7" pathLength="100" stroke-dasharray="24 76" stroke-dashoffset="-76"/><path d="M18.09 48.5V15.5H32.38Q36.81 15.5 40.01 16.94Q43.22 18.38 44.96 21.06Q46.71 23.75 46.71 27.47Q46.71 31.15 44.96 33.84Q43.22 36.53 40.01 37.96Q36.81 39.4 32.38 39.4H22.34L25.73 35.96V48.5ZM25.73 36.81 22.34 33.18H31.95Q35.49 33.18 37.23 31.67Q38.98 30.16 38.98 27.47Q38.98 24.74 37.23 23.23Q35.49 21.72 31.95 21.72H22.34L25.73 18.09Z" fill="#fff" stroke="#fff" stroke-width="1.1" stroke-linejoin="round"/></svg><span class="pvwrap"><b class="pvname"><span class="pvpro">Pro</span>vo</b><span class="pvbar" aria-hidden="true"><i class="pv1" style="flex:23"></i><i class="pv2" style="flex:20"></i><i class="pv3" style="flex:19"></i><i class="pv4" style="flex:14"></i><i class="pv5" style="flex:24"></i></span></span></a><a class="chipbtn" href="#cram" style="text-decoration:none;padding:6px 12px">Cram Sheet</a><a class="chipbtn" href="#progress" style="text-decoration:none;padding:6px 12px">Progress</a></div></header><main id="app"><p style="padding:16px">Loading…</p></main></div>');
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
