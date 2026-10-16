/* Ficcraft: every view except the thread itself. */
(function () {
  'use strict';
  const FC = window.FC;
  const U = FC.U;
  const M = FC.model;
  const UI = FC.ui;
  const esc = U.esc;
  const icon = U.icon;

  const V = {};

  function statusPill(s, small) {
    const st = M.STATUSES[s];
    return '<span class="status-pill st-' + s + (small ? ' is-small' : '') + '" title="' + esc(st.label + ': ' + st.gloss) + '">' + icon(st.icon) + '<span>' + st.label + '</span></span>';
  }
  function lastEntry(tid) {
    const l = M.entriesOf(tid);
    return l[l.length - 1] || null;
  }
  function resolverFor(rid) {
    return { resolve: M.resolver(rid) };
  }
  function viewShell(inner, cls) {
    return '<div class="view' + (cls ? ' ' + cls : '') + '"><div class="view-inner">' + inner + '</div></div>';
  }

  /* ───────────── dialogs shared across views ───────────── */

  V.realmDialog = async function (realm) {
    const isNew = !realm;
    const body = U.el(
      '<form class="form">' +
        '<label class="field"><span class="field-label">Name of the realm</span><input type="text" id="rd-name" maxlength="120" autofocus placeholder="The world, the book, or the series"></label>' +
        '<label class="field"><span class="field-label">Premise <span class="opt">optional</span></span><textarea id="rd-premise" rows="3" maxlength="2000" placeholder="One or two sentences: what makes this world itself?"></textarea></label>' +
        '<fieldset class="field"><legend class="field-label">Sigil</legend><div class="sigil-pick" role="radiogroup" aria-label="Sigil"></div></fieldset>' +
      '</form>'
    );
    const pick = body.querySelector('.sigil-pick');
    let sigil = realm ? realm.sigil : M.SIGILS[Math.floor(Math.random() * M.SIGILS.length)];
    for (const s of M.SIGILS) {
      const b = U.el('<button type="button" class="sigil-opt" role="radio" data-s="' + s + '" aria-label="' + s.replace(/^(s|k)-/, '') + '">' + icon(s) + '</button>');
      b.setAttribute('aria-checked', String(s === sigil));
      b.addEventListener('click', () => {
        sigil = s;
        for (const o of pick.children) o.setAttribute('aria-checked', String(o.dataset.s === s));
      });
      pick.appendChild(b);
    }
    if (realm) {
      body.querySelector('#rd-name').value = realm.name;
      body.querySelector('#rd-premise').value = realm.premise || '';
    }
    const v = await UI.modal({
      title: isNew ? 'Found a new realm' : 'Edit realm',
      body,
      actions: [
        { label: 'Cancel', value: null },
        {
          label: isNew ? 'Found realm' : 'Save',
          tone: 'primary',
          validate: (d) => (d.querySelector('#rd-name').value.trim() ? null : 'Give the realm a name. You can change it later.'),
          value: (d) => ({ name: d.querySelector('#rd-name').value, premise: d.querySelector('#rd-premise').value, sigil }),
        },
      ],
    });
    if (!v) return null;
    if (isNew) {
      const r = M.createRealm(v);
      M.setActiveRealm(r.id);
      return r;
    }
    M.updateRealm(realm.id, v);
    return realm;
  };

  V.newThreadDialog = async function (realm, preset) {
    preset = preset || {};
    const body = U.el(
      '<form class="form">' +
        '<label class="field"><span class="field-label">What’s the idea?</span><input type="text" id="nt-title" maxlength="200" autofocus placeholder="A question, a name, a premise: “What does the sea take?”"></label>' +
        '<label class="field"><span class="field-label">First entry <span class="opt">optional</span></span><textarea id="nt-first" rows="4" placeholder="Write down the spark while it’s fresh. [[Name]] links the codex."></textarea></label>' +
        '<label class="field"><span class="field-label">Tags <span class="opt">optional, separated by commas</span></span><input type="text" id="nt-tags" autocomplete="off" placeholder="magic, politics"></label>' +
      '</form>'
    );
    if (preset.title) body.querySelector('#nt-title').value = preset.title;
    if (preset.first) body.querySelector('#nt-first').value = preset.first;
    const v = await UI.modal({
      title: 'Begin a thread',
      body,
      onOpen: (d) => {
        const ta = d.querySelector('#nt-first');
        UI.autosize(ta, 260);
        UI.linker(ta, () => realm.id);
      },
      actions: [
        { label: 'Cancel', value: null },
        {
          label: 'Begin thread',
          tone: 'primary',
          validate: (d) => (d.querySelector('#nt-title').value.trim() ? null : 'Give the thread a title. A question works well.'),
          value: (d) => ({ title: d.querySelector('#nt-title').value, first: d.querySelector('#nt-first').value, tags: d.querySelector('#nt-tags').value }),
        },
      ],
    });
    if (!v) return null;
    const t = M.createThread(realm.id, { title: v.title, tags: v.tags });
    if (preset.oracle) M.addEntry(t.id, { type: 'oracle', body: preset.oracle.q, oracle: preset.oracle.cat });
    if (v.first.trim()) M.addEntry(t.id, { type: preset.firstType || 'musing', body: v.first.trim() });
    FC.app.go('t-' + t.id);
    return t;
  };

  V.codexDialog = async function (realm, preset) {
    preset = preset || {};
    const body = U.el(
      '<form class="form">' +
        '<label class="field"><span class="field-label">Name</span><input type="text" id="cx-name" maxlength="160" autofocus></label>' +
        '<label class="field"><span class="field-label">Kind</span><select id="cx-kind">' +
          M.KIND_ORDER.map((k) => '<option value="' + k + '">' + M.KINDS[k].label + '</option>').join('') +
        '</select></label>' +
        '<label class="field"><span class="field-label">In a sentence <span class="opt">optional</span></span><input type="text" id="cx-sum" maxlength="600" placeholder="What would a well-read local say this is?"></label>' +
      '</form>'
    );
    body.querySelector('#cx-name').value = preset.name || '';
    body.querySelector('#cx-kind').value = preset.kind || guessKind(preset.name || '');
    const v = await UI.modal({
      title: preset.name ? 'Write “' + preset.name + '” into the codex' : 'New codex entry',
      body,
      actions: [
        { label: 'Cancel', value: null },
        {
          label: 'Create entry',
          tone: 'primary',
          validate: (d) => {
            const n = d.querySelector('#cx-name').value.trim();
            if (!n) return 'Give the entry a name.';
            const ex = M.findCodex(realm.id, n);
            return ex ? '“' + ex.name + '” is already in the codex.' : null;
          },
          value: (d) => ({ name: d.querySelector('#cx-name').value, kind: d.querySelector('#cx-kind').value, summary: d.querySelector('#cx-sum').value }),
        },
      ],
    });
    if (!v) return null;
    const x = M.createCodex(realm.id, v);
    FC.app.go('x-' + x.id + (preset.edit === false ? '' : '.edit'));
    return x;
  };

  function guessKind(name) {
    const n = name.toLowerCase();
    if (/\b(order|guild|synod|council|house|league|brotherhood|sisterhood|company|church|cult|clan|choir|circle|court|legion|fellowship|cabal|covenant|conclave|temple|band|host)\b/.test(n)) return 'faction';
    if (/\b(war|battle|siege|fall|drowning|founding|treaty|plague|revolt|coronation)\b/.test(n)) return 'event';
    if (/\b(city|town|river|sea|mountains?|forest|isle|island|keep|castle|harbou?r|bay|reef|vale|marsh|marches|road)\b/.test(n)) return 'place';
    if (/\b(sword|crown|ring|ledger|book|blade|stone|bell|key|chalice|map)\b/.test(n)) return 'artifact';
    if (/(binding|craft|magic|weaving|sorcery|art)\b/.test(n)) return 'magic';
    return 'concept';
  }

  /* ───────────── welcome ───────────── */

  V.welcome = function (root) {
    const legacy = FC.app.legacyArchive;
    root.innerHTML = viewShell(
      '<section class="welcome">' +
        '<div class="welcome-sigil" aria-hidden="true">' + icon('sigil') + '</div>' +
        '<h1 class="wordmark">Ficcraft</h1>' +
        '<p class="welcome-tag">A scriptorium for the worlds you haven’t finished yet.</p>' +
        '<p class="welcome-lede">Log an idea the moment it strikes, then keep developing it for months: one thread per idea, as long as it needs to be, with a codex that remembers every name you invent.</p>' +
        (legacy
          ? '<div class="notice-card"><p><strong>There’s an archive saved in this browser</strong> (' + U.plural(legacy.realms, 'realm') + ', ' + U.plural(legacy.entries, 'entry', 'entries') + '). Bring it into your Claude account so it follows you?</p><button type="button" class="btn btn-primary btn-sm" data-act="legacy">Bring it over</button></div>'
          : '') +
        '<div class="welcome-actions">' +
          '<button type="button" class="btn btn-primary btn-lg" data-act="found">' + icon('plus') + '<span>Found your first realm</span></button>' +
          '<button type="button" class="btn btn-ghost btn-lg" data-act="sample">' + icon('s-wave') + '<span>Explore a sample realm</span></button>' +
          '<button type="button" class="btn btn-ghost btn-lg" data-act="import">' + icon('import') + '<span>Import an archive</span></button>' +
        '</div>' +
        '<div class="pillars">' +
          '<article class="pillar">' + icon('threads', 'ic-lg') + '<h2>Threads</h2><p>Follow one idea for as long as it takes. Musings, what-ifs, riddles, canon and drafts sit in one long thread. Waypoints divide it, ribbons mark your place, and branches split off new directions. A distillation keeps what you currently believe.</p></article>' +
          '<article class="pillar">' + icon('codex', 'ic-lg') + '<h2>Codex</h2><p>Write <code>[[The Salt Synod]]</code> anywhere and it becomes a link. Names you haven’t written up yet wait in a list. Every codex entry gathers each place it was mentioned.</p></article>' +
          '<article class="pillar">' + icon('oracle', 'ic-lg') + '<h2>Oracle</h2><p>When the page goes quiet, draw a question from a deck of ' + FC.oracle.size + ' about cost, power, faith, trade, memory and the people a story forgets. You can also question a codex entry directly.</p></article>' +
        '</div>' +
        '<p class="welcome-store">' + icon('lore', 'ic-sm') + '<span>' + esc(FC.app.storageSentence()) + '</span></p>' +
      '</section>',
      'view-welcome'
    );
    root.addEventListener('click', async (ev) => {
      const b = ev.target.closest('[data-act]');
      if (!b) return;
      if (b.dataset.act === 'found') { const r = await V.realmDialog(null); if (r) FC.app.go('hall'); }
      else if (b.dataset.act === 'sample') FC.app.loadSample();
      else if (b.dataset.act === 'import') FC.app.importFlow();
      else if (b.dataset.act === 'legacy') FC.app.importLegacy();
    });
  };

  /* ───────────── hall ───────────── */

  V.hall = function (root, realm) {
    const st = M.realmStats(realm.id);
    const threads = M.threadsOf(realm.id).sort((a, b) => b.updated - a.updated);
    const census = M.linkCensus(realm.id);
    const canon = M.recentCanon(realm.id, 5);
    const rs = resolverFor(realm.id);

    let h =
      '<header class="hall-head">' +
        '<div class="hall-sigil" aria-hidden="true">' + icon(realm.sigil) + '</div>' +
        '<div class="hall-title">' +
          '<p class="eyebrow">Realm' + (realm.sample ? ' · sample' : '') + '</p>' +
          '<h1 class="display">' + esc(realm.name) + '</h1>' +
          (realm.premise ? '<p class="premise">' + esc(realm.premise) + '</p>' : '<p class="premise is-empty"><button type="button" class="linkish" data-act="edit-realm">Add a premise</button>: a sentence or two on what makes this world itself.</p>') +
        '</div>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-act="edit-realm">' + icon('edit') + '<span>Edit realm</span></button>' +
      '</header>' +
      '<p class="colophon">' +
        [U.plural(st.threads, 'thread'), U.plural(st.entries, 'entry', 'entries'), U.plural(st.words, 'word'), U.plural(st.codex, 'codex entry', 'codex entries'), U.plural(st.riddles, 'open riddle')].join('<span aria-hidden="true"> · </span>') +
      '</p>';

    if (realm.sample) {
      h += '<div class="notice-card"><p>This is a sample realm, written to show how Ficcraft fits together. Change anything you like. When you’re done with it, delete it from <a href="#settings">Settings</a>.</p></div>';
    }

    if (!threads.length) {
      h +=
        '<section class="hall-start">' +
          '<h2>Begin with one idea</h2>' +
          '<p>A thread is one idea, followed for as long as it stays interesting: a magic system, a city, a character’s secret, a question about your ending.</p>' +
          '<form class="inline-begin" id="hall-begin"><label class="sr-only" for="hall-begin-title">Your first idea</label>' +
            '<input type="text" id="hall-begin-title" maxlength="200" placeholder="What does the magic cost?">' +
            '<button type="submit" class="btn btn-primary">Begin thread</button></form>' +
        '</section>';
    } else {
      h += '<section class="hall-sec"><div class="sec-head"><h2>Pick up where you left off</h2><a href="#threads" class="linkish">All threads</a></div><ul class="resume-list">';
      for (const t of threads.slice(0, 4)) {
        const le = lastEntry(t.id);
        h +=
          '<li><a class="resume" href="#t-' + t.id + '">' +
            '<span class="resume-main"><span class="resume-title">' + esc(t.title) + '</span>' +
            '<span class="resume-snip">' + (le ? '<span class="t-' + le.type + ' resume-type">' + M.TYPES[le.type].label + '</span> ' + esc(U.snippet(le.body, 150)) : '<em>No entries yet</em>') + '</span></span>' +
            '<span class="resume-meta">' + statusPill(t.status, true) + '<span>' + U.plural(M.entriesOf(t.id).length, 'entry', 'entries') + ' · ' + esc(U.ago(t.updated)) + '</span></span>' +
          '</a></li>';
      }
      h += '</ul></section>';

      h += '<section class="hall-sec"><div class="sec-head"><h2>The forge</h2><p class="sec-note">Every thread, by how far along it is.</p></div><div class="forge">';
      for (const s of M.STATUS_ORDER) {
        const ts = threads.filter((t) => t.status === s);
        h += '<div class="forge-col st-' + s + '"><h3>' + icon(M.STATUSES[s].icon) + '<span>' + M.STATUSES[s].label + '</span><span class="forge-n">' + ts.length + '</span></h3>';
        if (!ts.length) h += '<p class="forge-empty">' + esc(M.STATUSES[s].gloss) + '</p>';
        else {
          h += '<ul>' + ts.slice(0, 7).map((t) => '<li><a href="#t-' + t.id + '">' + esc(t.title) + '</a></li>').join('') + '</ul>';
          if (ts.length > 7) h += '<a class="forge-more linkish" href="#threads" data-status="' + s + '">and ' + (ts.length - 7) + ' more</a>';
        }
        h += '</div>';
      }
      h += '</div></section>';

      h += '<div class="hall-2col">';
      h += '<section class="hall-sec"><div class="sec-head"><h2>Recent canon</h2></div>';
      if (!canon.length) h += '<p class="muted">Mark an entry as <em>Canon</em> when it becomes settled truth. The latest appear here.</p>';
      else {
        h += '<ul class="canon-list">' + canon.map((c) =>
          '<li><a href="#t-' + c.t.id + '.e-' + c.e.id + '" class="canon-item">' + icon('canon') +
            '<span class="canon-text">' + FC.md.inline(U.snippet(c.e.body, 200), rs) + '</span>' +
            '<span class="canon-src">' + esc(c.t.title) + ' · ' + esc(U.ago(c.e.created)) + '</span></a></li>'
        ).join('') + '</ul>';
      }
      h += '</section>';
      h += '<section class="hall-sec"><div class="sec-head"><h2>Unwritten names</h2><a href="#codex" class="linkish">Codex</a></div>';
      if (!census.unwritten.length) h += '<p class="muted">Names you write as <code>[[links]]</code> but haven’t added to the codex will wait here.</p>';
      else {
        h += '<div class="chip-row">' + census.unwritten.slice(0, 18).map((u) =>
          '<button type="button" class="chip chip-missing" data-name="' + esc(u.name) + '" title="Mentioned ' + u.count + '×. Click to write it.">' + icon('plus', 'ic-sm') + '<span>' + esc(u.name) + '</span><span class="chip-n">' + u.count + '</span></button>'
        ).join('') + '</div>';
      }
      h += '</section></div>';
    }

    root.innerHTML = viewShell(h, 'view-hall');
    root.addEventListener('click', async (ev) => {
      const b = ev.target.closest('[data-act], [data-name], [data-status]');
      if (!b) return;
      if (b.dataset.act === 'edit-realm') { await V.realmDialog(realm); }
      else if (b.dataset.name) { V.codexDialog(realm, { name: b.dataset.name }); }
      else if (b.dataset.status) { U.pref.set('threads:status', b.dataset.status); }
    });
    const form = root.querySelector('#hall-begin');
    if (form) {
      form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const v = form.querySelector('input').value.trim();
        if (!v) { form.querySelector('input').focus(); return; }
        const t = M.createThread(realm.id, { title: v });
        FC.app.go('t-' + t.id);
      });
    }
  };

  /* ───────────── threads ───────────── */

  V.threads = function (root, realm) {
    const state = {
      status: U.pref.get('threads:status', 'all'),
      tag: U.pref.get('threads:tag', ''),
      q: '',
      sort: U.pref.get('threads:sort', 'recent'),
    };
    const all = M.threadsOf(realm.id);
    if (state.tag && !all.some((t) => t.tags.includes(state.tag))) state.tag = '';
    const tags = [...new Set(all.flatMap((t) => t.tags))].sort();

    root.innerHTML = viewShell(
      '<header class="view-head"><div><p class="eyebrow">' + esc(realm.name) + '</p><h1>Threads</h1></div>' +
        '<button type="button" class="btn btn-primary" data-act="new">' + icon('plus') + '<span>Begin a thread</span></button></header>' +
      '<div class="toolbar">' +
        '<div class="chip-row" role="group" aria-label="Filter by status" id="tl-status"></div>' +
        '<div class="toolbar-right">' +
          '<label class="sr-only" for="tl-q">Filter threads by title</label><input type="search" id="tl-q" class="input-sm" placeholder="Filter by title…">' +
          (tags.length ? '<label class="sr-only" for="tl-tag">Tag</label><select id="tl-tag" class="input-sm"><option value="">All tags</option>' + tags.map((x) => '<option value="' + esc(x) + '">#' + esc(x) + '</option>').join('') + '</select>' : '') +
          '<label class="sr-only" for="tl-sort">Sort</label><select id="tl-sort" class="input-sm">' +
            '<option value="recent">Recently written</option><option value="created">Newest first</option><option value="title">By title</option><option value="longest">Longest first</option>' +
          '</select>' +
        '</div>' +
      '</div>' +
      '<div id="tl-list"></div>',
      'view-threads'
    );
    const listEl = root.querySelector('#tl-list');
    const statusEl = root.querySelector('#tl-status');
    const tagSel = root.querySelector('#tl-tag');
    const sortSel = root.querySelector('#tl-sort');
    if (tagSel) tagSel.value = state.tag;
    sortSel.value = state.sort;

    function renderStatus() {
      const counts = {};
      for (const t of all) counts[t.status] = (counts[t.status] || 0) + 1;
      statusEl.innerHTML =
        '<button type="button" class="chip' + (state.status === 'all' ? ' is-on' : '') + '" data-status="all" aria-pressed="' + (state.status === 'all') + '">All <span class="chip-n">' + all.length + '</span></button>' +
        M.STATUS_ORDER.map((s) =>
          '<button type="button" class="chip st-' + s + (state.status === s ? ' is-on' : '') + '" data-status="' + s + '" aria-pressed="' + (state.status === s) + '">' + icon(M.STATUSES[s].icon) + '<span>' + M.STATUSES[s].label + '</span><span class="chip-n">' + (counts[s] || 0) + '</span></button>'
        ).join('');
    }
    function sorter(a, b) {
      if (state.sort === 'title') return a.title.localeCompare(b.title);
      if (state.sort === 'created') return b.created - a.created;
      if (state.sort === 'longest') return M.entriesOf(b.id).length - M.entriesOf(a.id).length;
      return b.updated - a.updated;
    }
    function row(t, depth, flat) {
      const n = M.entriesOf(t.id).length;
      const parent = flat && t.parentId ? M.threads.get(t.parentId) : null;
      return '<li class="trow" style="--depth:' + depth + '">' +
        '<a class="trow-link" href="#t-' + t.id + '">' +
          '<span class="trow-st st-' + t.status + '" title="' + M.STATUSES[t.status].label + '">' + icon(M.STATUSES[t.status].icon) + '</span>' +
          '<span class="trow-main"><span class="trow-title">' + (depth ? icon('branch', 'ic-sm trow-branch') : '') + esc(t.title) + '</span>' +
            '<span class="trow-sub">' +
              (parent ? '<span class="trow-from">from ' + esc(parent.title) + '</span>' : '') +
              t.tags.map((x) => '<span class="tag">#' + esc(x) + '</span>').join('') +
            '</span></span>' +
          '<span class="trow-meta">' + U.plural(n, 'entry', 'entries') + '<br>' + esc(U.ago(t.updated)) + '</span>' +
        '</a></li>';
    }
    function renderList() {
      const q = U.normName(state.q);
      let ts = all.filter((t) => (state.status === 'all' || t.status === state.status) && (!state.tag || t.tags.includes(state.tag)) && (!q || t.title.toLowerCase().includes(q)));
      if (!all.length) {
        listEl.innerHTML = '<div class="empty-state">' + icon('threads', 'ic-xl') + '<p class="empty-title">No threads yet.</p><p>Begin one with any idea, however small. Threads grow by accretion.</p><button type="button" class="btn btn-primary" data-act="new">Begin a thread</button></div>';
        return;
      }
      if (!ts.length) { listEl.innerHTML = '<p class="muted empty-line">No threads match. <button type="button" class="linkish" data-act="clear">Clear the filters</button></p>'; return; }
      const filtered = state.status !== 'all' || state.tag || q;
      let html = '<ul class="tlist">';
      if (filtered || state.sort !== 'recent') {
        ts.sort(sorter);
        for (const t of ts) html += row(t, 0, true);
      } else {
        const ids = new Set(ts.map((t) => t.id));
        const kids = new Map();
        for (const t of ts) {
          const p = t.parentId && ids.has(t.parentId) ? t.parentId : null;
          if (!kids.has(p)) kids.set(p, []);
          kids.get(p).push(t);
        }
        const walk = (pid, depth) => {
          const list = (kids.get(pid) || []).sort(sorter);
          for (const t of list) { html += row(t, Math.min(depth, 4), false); walk(t.id, depth + 1); }
        };
        walk(null, 0);
      }
      html += '</ul>';
      listEl.innerHTML = html;
    }
    renderStatus();
    renderList();

    root.addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-status], [data-act]');
      if (!b) return;
      if (b.dataset.status) {
        state.status = b.dataset.status;
        U.pref.set('threads:status', state.status);
        renderStatus();
        renderList();
      } else if (b.dataset.act === 'new') V.newThreadDialog(realm);
      else if (b.dataset.act === 'clear') {
        state.status = 'all'; state.tag = ''; state.q = '';
        U.pref.set('threads:status', 'all'); U.pref.set('threads:tag', '');
        root.querySelector('#tl-q').value = '';
        if (tagSel) tagSel.value = '';
        renderStatus();
        renderList();
      }
    });
    root.querySelector('#tl-q').addEventListener('input', (ev) => { state.q = ev.target.value; renderList(); });
    if (tagSel) tagSel.addEventListener('change', () => { state.tag = tagSel.value; U.pref.set('threads:tag', state.tag); renderList(); });
    sortSel.addEventListener('change', () => { state.sort = sortSel.value; U.pref.set('threads:sort', state.sort); renderList(); });
  };

  /* ───────────── codex ───────────── */

  V.codex = function (root, realm) {
    const state = { kind: U.pref.get('codex:kind', 'all'), q: '' };
    const census = M.linkCensus(realm.id);
    const all = M.codexOf(realm.id);
    root.innerHTML = viewShell(
      '<header class="view-head"><div><p class="eyebrow">' + esc(realm.name) + '</p><h1>Codex</h1></div>' +
        '<button type="button" class="btn btn-primary" data-act="new">' + icon('plus') + '<span>New entry</span></button></header>' +
      '<div class="toolbar"><div class="chip-row" id="cx-kinds" role="group" aria-label="Filter by kind"></div>' +
        '<div class="toolbar-right"><label class="sr-only" for="cx-q">Filter the codex</label><input type="search" id="cx-q" class="input-sm" placeholder="Filter by name…"></div></div>' +
      '<div id="cx-list"></div>' +
      '<section class="hall-sec" id="cx-unwritten"></section>',
      'view-codex'
    );
    const kindsEl = root.querySelector('#cx-kinds');
    const listEl = root.querySelector('#cx-list');

    function renderKinds() {
      const counts = {};
      for (const x of all) counts[x.kind] = (counts[x.kind] || 0) + 1;
      kindsEl.innerHTML =
        '<button type="button" class="chip' + (state.kind === 'all' ? ' is-on' : '') + '" data-kind="all" aria-pressed="' + (state.kind === 'all') + '">All <span class="chip-n">' + all.length + '</span></button>' +
        M.KIND_ORDER.filter((k) => counts[k]).map((k) =>
          '<button type="button" class="chip' + (state.kind === k ? ' is-on' : '') + '" data-kind="' + k + '" aria-pressed="' + (state.kind === k) + '">' + icon(M.KINDS[k].icon) + '<span>' + M.KINDS[k].plural + '</span><span class="chip-n">' + counts[k] + '</span></button>'
        ).join('');
    }
    function renderList() {
      const q = U.normName(state.q);
      const xs = all
        .filter((x) => (state.kind === 'all' || x.kind === state.kind) && (!q || [x.name].concat(x.aliases).some((n) => n.toLowerCase().includes(q))))
        .sort((a, b) => sortName(a.name).localeCompare(sortName(b.name)));
      if (!all.length) {
        listEl.innerHTML = '<div class="empty-state">' + icon('codex', 'ic-xl') + '<p class="empty-title">The codex is empty.</p><p>Add people, places, factions and magic here. Or write <code>[[a name]]</code> in any entry, and it will appear under “Unwritten names”, ready to be written up.</p><button type="button" class="btn btn-primary" data-act="new">New entry</button></div>';
        return;
      }
      if (!xs.length) { listEl.innerHTML = '<p class="muted empty-line">Nothing matches.</p>'; return; }
      let html = '<div class="glossary">';
      let letter = '';
      for (const x of xs) {
        const L = (sortName(x.name)[0] || '#').toUpperCase();
        if (L !== letter) {
          if (letter) html += '</ul></div>';
          letter = L;
          html += '<div class="gl-group"><h2 class="gl-letter" aria-label="' + esc(L) + '">' + esc(L) + '</h2><ul class="gl-list">';
        }
        const n = census.counts.get(x.id) || 0;
        html += '<li><a class="gl-row" href="#x-' + x.id + '">' +
          '<span class="gl-name">' + esc(x.name) + '</span>' +
          '<span class="gl-kind">' + icon(M.KINDS[x.kind].icon, 'ic-sm') + M.KINDS[x.kind].label + '</span>' +
          (x.summary ? '<span class="gl-sum">' + esc(x.summary) + '</span>' : '<span class="gl-sum muted">Nothing written yet.</span>') +
          '<span class="gl-count">' + (n ? 'Named in ' + U.plural(n, 'place') : 'Not yet named in a thread') + '</span>' +
        '</a></li>';
      }
      html += '</ul></div></div>';
      listEl.innerHTML = html;
    }
    function renderUnwritten() {
      const el = root.querySelector('#cx-unwritten');
      if (!census.unwritten.length) { el.innerHTML = ''; return; }
      el.innerHTML = '<div class="sec-head"><h2>Unwritten names</h2><p class="sec-note">Named in your threads but not yet in the codex.</p></div><div class="chip-row">' +
        census.unwritten.map((u) => '<button type="button" class="chip chip-missing" data-name="' + esc(u.name) + '">' + icon('plus', 'ic-sm') + '<span>' + esc(u.name) + '</span><span class="chip-n">' + u.count + '</span></button>').join('') + '</div>';
    }
    renderKinds();
    renderList();
    renderUnwritten();
    root.addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-kind], [data-act], [data-name]');
      if (!b) return;
      if (b.dataset.kind) { state.kind = b.dataset.kind; U.pref.set('codex:kind', state.kind); renderKinds(); renderList(); }
      else if (b.dataset.act === 'new') V.codexDialog(realm, {});
      else if (b.dataset.name) V.codexDialog(realm, { name: b.dataset.name });
    });
    root.querySelector('#cx-q').addEventListener('input', (ev) => { state.q = ev.target.value; renderList(); });
  }

  function sortName(n) {
    return String(n).replace(/^(the|a|an)\s+/i, '');
  }

  V.codexEntry = function (root, realm, x, editing) {
    const rs = resolverFor(realm.id);
    function view() {
      const bl = M.backlinks(x);
      const groups = new Map();
      for (const r of bl.entries) {
        if (!groups.has(r.t.id)) groups.set(r.t.id, { t: r.t, list: [] });
        groups.get(r.t.id).list.push(r.e);
      }
      let h =
        '<nav class="crumbs" aria-label="Breadcrumb"><a href="#codex">Codex</a><span aria-hidden="true">›</span><span>' + M.KINDS[x.kind].plural + '</span></nav>' +
        '<article class="codex-entry">' +
          '<header class="ce-head">' +
            '<p class="ce-kind">' + icon(M.KINDS[x.kind].icon) + '<span>' + M.KINDS[x.kind].label + '</span></p>' +
            '<h1 class="display">' + esc(x.name) + '</h1>' +
            (x.aliases.length ? '<p class="ce-aliases">Also called ' + x.aliases.map((a) => '<em>' + esc(a) + '</em>').join(', ') + '</p>' : '') +
            (x.summary ? '<p class="ce-summary">' + esc(x.summary) + '</p>' : '') +
            '<div class="ce-actions">' +
              '<button type="button" class="btn btn-ghost btn-sm" data-act="edit">' + icon('edit') + '<span>Edit</span></button>' +
              '<button type="button" class="btn btn-ghost btn-sm" data-act="ask">' + icon('oracle') + '<span>Question it</span></button>' +
              '<button type="button" class="btn btn-ghost btn-sm" data-act="delete">' + icon('trash') + '<span>Delete</span></button>' +
            '</div>' +
          '</header>' +
          '<div id="ce-card"></div>' +
          (x.body.trim()
            ? '<div class="prose ce-body">' + FC.md.render(x.body, rs) + '</div>'
            : '<p class="mg-empty ce-body">Nothing written yet. <button type="button" class="linkish" data-act="edit">Write this entry</button>. What would a local say about it, and what would a scholar?</p>') +
          '<p class="ce-stamp">Last revised ' + esc(U.ago(x.updated)) + '</p>' +
          '<section class="ce-mentions"><h2>Mentioned in</h2>';
      if (!bl.entries.length && !bl.threads.length && !bl.codex.length) {
        h += '<p class="muted">Nowhere yet. Write <code>[[' + esc(x.name) + ']]</code> in a thread to link it here.</p>';
      } else {
        for (const g of groups.values()) {
          h += '<div class="mention-group"><h3><a href="#t-' + g.t.id + '">' + esc(g.t.title) + '</a> <span class="mg-count">' + g.list.length + '</span></h3><ul class="mention-list">' +
            g.list.slice(0, 12).map((e) =>
              '<li><a class="mention" href="#t-' + g.t.id + '.e-' + e.id + '"><span class="mention-type t-' + e.type + '">' + icon(M.TYPES[e.type].icon, 'ic-sm') + M.TYPES[e.type].label + '</span>' +
              '<span class="mention-text">' + UI.markSnippet(e.body, [x.name].concat(x.aliases).map((n) => n.toLowerCase()), 110) + '</span>' +
              '<span class="mention-date">' + esc(U.fmtDate(e.created)) + '</span></a></li>'
            ).join('') +
            (g.list.length > 12 ? '<li class="muted small">…and ' + (g.list.length - 12) + ' more in this thread</li>' : '') +
            '</ul></div>';
        }
        if (bl.threads.length) h += '<div class="mention-group"><h3>Distillations</h3><ul class="mention-list">' + bl.threads.map((t) => '<li><a class="mention" href="#t-' + t.id + '"><span class="mention-text">' + esc(t.title) + '</span></a></li>').join('') + '</ul></div>';
        if (bl.codex.length) h += '<div class="mention-group"><h3>Other codex entries</h3><div class="chip-row">' + bl.codex.map((y) => '<a class="chip chip-sm" href="#x-' + y.id + '">' + icon(M.KINDS[y.kind].icon, 'ic-sm') + '<span>' + esc(y.name) + '</span></a>').join('') + '</div></div>';
      }
      h += '</section></article>';
      root.innerHTML = viewShell(h, 'view-codex-entry');
    }
    function edit() {
      root.innerHTML = viewShell(
        '<nav class="crumbs" aria-label="Breadcrumb"><a href="#codex">Codex</a><span aria-hidden="true">›</span><a href="#x-' + x.id + '">' + esc(x.name) + '</a></nav>' +
        '<form class="form codex-form" id="ce-form">' +
          '<h1 class="h1">Edit codex entry</h1>' +
          '<div class="form-row">' +
            '<label class="field grow"><span class="field-label">Name</span><input type="text" id="ce-name" maxlength="160"></label>' +
            '<label class="field"><span class="field-label">Kind</span><select id="ce-kind">' + M.KIND_ORDER.map((k) => '<option value="' + k + '">' + M.KINDS[k].label + '</option>').join('') + '</select></label>' +
          '</div>' +
          '<label class="field"><span class="field-label">Also called <span class="opt">other names and spellings, separated by commas; links to any of them count</span></span><input type="text" id="ce-aliases"></label>' +
          '<label class="field"><span class="field-label">In a sentence</span><input type="text" id="ce-sum" maxlength="600"></label>' +
          '<label class="field"><span class="field-label">Entry <span class="opt">Markdown; [[Name]] links other entries</span></span><textarea id="ce-body" rows="12"></textarea></label>' +
          '<div class="form-actions"><button type="button" class="btn btn-ghost" data-act="cancel">Cancel</button><button type="submit" class="btn btn-primary">Save entry</button></div>' +
          '<p class="dlg-error" id="ce-err" hidden></p>' +
        '</form>',
        'view-codex-entry'
      );
      const f = root.querySelector('#ce-form');
      f.querySelector('#ce-name').value = x.name;
      f.querySelector('#ce-kind').value = x.kind;
      f.querySelector('#ce-aliases').value = x.aliases.join(', ');
      f.querySelector('#ce-sum').value = x.summary;
      const ta = f.querySelector('#ce-body');
      ta.value = x.body;
      UI.autosize(ta, () => window.innerHeight * 0.65);
      UI.linker(ta, () => realm.id);
      f.querySelector('#ce-name').focus();
      f.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const name = f.querySelector('#ce-name').value.trim();
        const err = f.querySelector('#ce-err');
        if (!name) { err.hidden = false; err.textContent = 'Give the entry a name.'; return; }
        const clash = M.findCodex(realm.id, name);
        if (clash && clash.id !== x.id) { err.hidden = false; err.textContent = '“' + clash.name + '” already uses that name.'; return; }
        M.updateCodex(x.id, { name, kind: f.querySelector('#ce-kind').value, aliases: f.querySelector('#ce-aliases').value, summary: f.querySelector('#ce-sum').value, body: ta.value });
        FC.app.go('x-' + x.id);
      });
      f.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); f.requestSubmit(); }
      });
    }
    async function ask() {
      const card = FC.oracle.interrogate(x.kind, x.name);
      const el = root.querySelector('#ce-card');
      el.innerHTML =
        '<div class="mini-card' + (matchMedia('(prefers-reduced-motion: reduce)').matches ? '' : ' is-drawn') + '"><p class="mini-card-head">' + icon('oracle') + '<span>The Oracle asks</span></p>' +
        '<p class="mini-card-q">' + esc(card.q) + '</p>' +
        '<div class="mini-card-actions"><button type="button" class="btn btn-primary btn-sm" data-act="take">Take it to a thread</button><button type="button" class="btn btn-ghost btn-sm" data-act="ask">Another</button></div></div>';
      el.dataset.q = card.q;
    }
    root.addEventListener('click', async (ev) => {
      const b = ev.target.closest('[data-act]');
      if (!b) return;
      const act = b.dataset.act;
      if (act === 'edit') FC.app.go('x-' + x.id + '.edit');
      else if (act === 'cancel') FC.app.go('x-' + x.id);
      else if (act === 'ask') ask();
      else if (act === 'take') {
        const q = root.querySelector('#ce-card').dataset.q;
        V.takeQuestion(realm, { q, cat: 'codex' }, '[[' + x.name + ']]: ');
      } else if (act === 'delete') {
        const ok = await UI.confirm({ title: 'Delete “' + x.name + '”?', body: 'The entry is removed from the codex. Links to it in your threads stay, and show up again under “Unwritten names”.', confirm: 'Delete entry', danger: true });
        if (!ok) return;
        const removed = M.deleteCodex(x.id);
        FC.app.go('codex');
        UI.toast('Codex entry deleted', { action: { label: 'Undo', fn: () => { M.restoreCodex(removed); FC.app.go('x-' + removed.id); } } });
      }
    });
    if (editing) edit();
    else view();
  };

  /* Put an oracle question into a thread the writer picks. */
  V.takeQuestion = async function (realm, card, prefix) {
    const threads = M.threadsOf(realm.id).sort((a, b) => b.updated - a.updated);
    const body = U.el(
      '<form class="form"><blockquote class="q-preview"></blockquote>' +
        '<label class="field"><span class="field-label">Inscribe it into</span><select id="tq-thread">' +
          '<option value="__new">A new thread, with this question as its title</option>' +
          threads.map((t) => '<option value="' + t.id + '">' + esc(t.title) + '</option>').join('') +
        '</select></label></form>'
    );
    body.querySelector('.q-preview').textContent = card.q;
    if (threads.length) body.querySelector('#tq-thread').value = FC.app.lastThread && M.threads.has(FC.app.lastThread) && M.threads.get(FC.app.lastThread).realmId === realm.id ? FC.app.lastThread : threads[0].id;
    const v = await UI.modal({ title: 'Take the question to a thread', body, actions: [{ label: 'Cancel', value: null }, { label: 'Inscribe', tone: 'primary', value: (d) => d.querySelector('#tq-thread').value }] });
    if (!v) return;
    const text = (prefix || '') + card.q;
    if (v === '__new') {
      const t = M.createThread(realm.id, { title: card.q.length <= 120 ? card.q : U.snippet(card.q, 120) });
      M.addEntry(t.id, { type: 'oracle', body: text, oracle: card.cat });
      FC.app.go('t-' + t.id);
    } else {
      M.addEntry(v, { type: 'oracle', body: text, oracle: card.cat });
      FC.app.go('t-' + v);
    }
  };

  /* ───────────── riddles ───────────── */

  V.riddles = function (root, realm) {
    let showAll = U.pref.get('riddles:all', false);
    const rs = resolverFor(realm.id);
    function render() {
      const list = M.riddles(realm.id, showAll);
      const open = list.filter((r) => !r.e.resolved).length;
      let h =
        '<header class="view-head"><div><p class="eyebrow">' + esc(realm.name) + '</p><h1>Riddles</h1><p class="view-sub">' + U.plural(open, 'open question') + ' across the realm. Answer them in their threads, or mark them answered here.</p></div>' +
        '<label class="switch"><input type="checkbox" id="rd-all"' + (showAll ? ' checked' : '') + '><span>Show answered riddles too</span></label></header>';
      if (!list.length) {
        h += '<div class="empty-state">' + icon('riddle', 'ic-xl') + '<p class="empty-title">' + (showAll ? 'No riddles yet.' : 'No open riddles.') + '</p><p>When something stumps you, inscribe it as a <em>Riddle</em> and move on. Every unanswered one gathers here, so none get lost in a long thread.</p></div>';
      } else {
        const groups = new Map();
        for (const r of list) {
          if (!groups.has(r.t.id)) groups.set(r.t.id, { t: r.t, items: [] });
          groups.get(r.t.id).items.push(r.e);
        }
        for (const g of groups.values()) {
          h += '<section class="riddle-group"><h2><a href="#t-' + g.t.id + '">' + esc(g.t.title) + '</a> ' + statusPill(g.t.status, true) + '</h2><ul class="riddle-list">';
          for (const e of g.items) {
            h += '<li class="riddle' + (e.resolved ? ' is-resolved' : '') + '">' +
              '<span class="riddle-mark" aria-hidden="true">?</span>' +
              '<div class="riddle-main"><div class="riddle-text prose">' + FC.md.render(e.body, rs) + '</div>' +
              '<p class="riddle-meta">' + (e.resolved ? 'Answered ' + esc(U.ago(e.resolved)) + ' · ' : '') + 'Asked ' + esc(U.fmtDate(e.created)) + '</p></div>' +
              '<div class="riddle-actions"><a class="btn btn-ghost btn-sm" href="#t-' + g.t.id + '.e-' + e.id + '">Go to it</a>' +
              '<button type="button" class="btn btn-ghost btn-sm" data-resolve="' + e.id + '">' + (e.resolved ? 'Reopen' : icon('check') + '<span>Answered</span>') + '</button></div>' +
            '</li>';
          }
          h += '</ul></section>';
        }
      }
      root.innerHTML = viewShell(h, 'view-riddles');
      root.querySelector('#rd-all').addEventListener('change', (ev) => { showAll = ev.target.checked; U.pref.set('riddles:all', showAll); render(); });
    }
    root.addEventListener('click', (ev) => {
      const wl = ev.target.closest('a.wl');
      if (wl) { ev.preventDefault(); FC.app.openName(realm.id, wl.dataset.wl); return; }
      const b = ev.target.closest('[data-resolve]');
      if (!b) return;
      const e = M.byId.get(b.dataset.resolve);
      if (!e) return;
      M.updateEntry(e.id, { resolved: !e.resolved });
      UI.toast(e.resolved ? 'Marked answered' : 'Reopened', { action: { label: 'Undo', fn: () => M.updateEntry(e.id, { resolved: !e.resolved }) } });
      render();
    });
    render();
  };

  /* ───────────── oracle ───────────── */

  const history = [];
  V.oracle = function (root, realm) {
    let cat = U.pref.get('oracle:cat', '');
    let card = null;
    const threads = M.threadsOf(realm.id).sort((a, b) => b.updated - a.updated);
    root.innerHTML = viewShell(
      '<header class="view-head"><div><p class="eyebrow">' + esc(realm.name) + '</p><h1>Oracle</h1><p class="view-sub">Draw a question when the page goes quiet. ' + FC.oracle.size + ' cards in ' + FC.oracle.CATS.length + ' suits, plus questions for every codex entry.</p></div></header>' +
      '<div class="chip-row oracle-suits" id="or-cats" role="group" aria-label="Suit"></div>' +
      '<div class="oracle-stage">' +
        '<div class="tarot" id="or-card" aria-live="polite"></div>' +
        '<div class="oracle-side">' +
          '<button type="button" class="btn btn-primary btn-lg" data-act="draw">' + icon('oracle') + '<span>Draw a card</span></button>' +
          '<button type="button" class="btn btn-ghost" data-act="take" disabled>' + icon('musing') + '<span>Take it to a thread</span></button>' +
          '<p class="muted small">A card becomes an <em>Oracle</em> entry in the thread you choose. Answer it underneath.</p>' +
        '</div>' +
      '</div>' +
      '<section class="consult" id="or-consult" hidden></section>' +
      '<section class="hall-sec" id="or-history"></section>',
      'view-oracle'
    );
    const catsEl = root.querySelector('#or-cats');
    const cardEl = root.querySelector('#or-card');
    const takeBtn = root.querySelector('[data-act="take"]');
    function renderCats() {
      catsEl.innerHTML =
        '<button type="button" class="chip' + (!cat ? ' is-on' : '') + '" data-cat="" aria-pressed="' + !cat + '">Any suit</button>' +
        FC.oracle.CATS.map((c) => '<button type="button" class="chip' + (cat === c.id ? ' is-on' : '') + '" data-cat="' + c.id + '" aria-pressed="' + (cat === c.id) + '">' + esc(c.label) + '</button>').join('');
    }
    function renderCard(animate) {
      if (!card) {
        cardEl.className = 'tarot is-back';
        cardEl.innerHTML = '<div class="tarot-back" aria-hidden="true">' + icon('sigil') + '</div><p class="sr-only">No card drawn yet.</p>';
        takeBtn.disabled = true;
        return;
      }
      cardEl.className = 'tarot' + (animate && !matchMedia('(prefers-reduced-motion: reduce)').matches ? ' is-drawn' : '');
      cardEl.innerHTML =
        '<p class="tarot-suit">' + esc(card.label) + '</p>' +
        '<div class="tarot-eye" aria-hidden="true">' + icon('oracle') + '</div>' +
        '<p class="tarot-q">' + esc(card.q) + '</p>' +
        '<p class="tarot-num">No. ' + U.roman(card.n) + ' of ' + U.roman(card.total) + '</p>';
      takeBtn.disabled = false;
    }
    function renderHistory() {
      const el = root.querySelector('#or-history');
      if (!history.length) { el.innerHTML = ''; return; }
      el.innerHTML = '<div class="sec-head"><h2>Drawn this session</h2></div><ol class="draw-list">' +
        history.slice().reverse().map((c, i) => '<li><span class="draw-suit">' + esc(c.label) + '</span><span>' + esc(c.q) + '</span><button type="button" class="linkish" data-hist="' + (history.length - 1 - i) + '">Take it</button></li>').join('') + '</ol>';
    }
    renderCats();
    renderCard(false);
    renderHistory();
    root.addEventListener('click', (ev) => {
      const c = ev.target.closest('[data-cat]');
      if (c) { cat = c.dataset.cat; U.pref.set('oracle:cat', cat); renderCats(); return; }
      const hb = ev.target.closest('[data-hist]');
      if (hb) { V.takeQuestion(realm, history[+hb.dataset.hist]); return; }
      const b = ev.target.closest('[data-act]');
      if (!b) return;
      if (b.dataset.act === 'draw') {
        card = FC.oracle.draw(cat || null);
        history.push(card);
        if (history.length > 30) history.shift();
        renderCard(true);
        renderHistory();
      } else if (b.dataset.act === 'take' && card) V.takeQuestion(realm, card);
    });
    V.consult(root.querySelector('#or-consult'), realm, threads);
  };

  /* Ask Claude for questions about a thread. Only where the page runs inside Claude and the viewer allows it. */
  V.consult = function (el, realm, threads) {
    const sample = FC.caps && FC.caps.sample;
    if (!sample || FC.app.sampleBlocked || !threads.length) { el.hidden = true; return; }
    el.hidden = false;
    el.innerHTML =
      '<div class="sec-head"><h2>Consult Claude</h2></div>' +
      '<p class="view-sub">Claude reads one thread’s distillation and its recent entries, then asks five questions about the gaps. It only asks. It won’t write your world. This uses your own Claude account.</p>' +
      '<div class="consult-row"><label class="sr-only" for="cs-thread">Thread</label><select id="cs-thread" class="input-sm">' +
        threads.map((t) => '<option value="' + t.id + '">' + esc(t.title) + '</option>').join('') +
      '</select><button type="button" class="btn btn-ghost" id="cs-go">' + icon('oracle') + '<span>Ask for questions</span></button>' +
      '<button type="button" class="btn btn-ghost" id="cs-stop" hidden>Stop</button></div>' +
      '<div id="cs-out" aria-live="polite"></div>';
    const go = el.querySelector('#cs-go');
    const stop = el.querySelector('#cs-stop');
    const out = el.querySelector('#cs-out');
    const sel = el.querySelector('#cs-thread');
    if (FC.app.lastThread && threads.some((t) => t.id === FC.app.lastThread)) sel.value = FC.app.lastThread;
    let ctl = null;
    go.addEventListener('click', async () => {
      const t = M.threads.get(sel.value);
      if (!t) return;
      const entries = M.entriesOf(t.id).slice(-40);
      let ctx = '';
      for (const e of entries) ctx += '[' + M.TYPES[e.type].label + '] ' + e.body.trim() + '\n\n';
      if (ctx.length > 12000) ctx = ctx.slice(ctx.length - 12000);
      const names = M.codexOf(realm.id).map((x) => x.name + (x.summary ? ': ' + x.summary : '')).slice(0, 40).join('\n');
      const prompt =
        'You are helping a fantasy novelist develop one idea from their worldbuilding notebook. Read the notes below and ask exactly five probing questions that would help them develop this idea further. ' +
        'Ask about gaps, costs, consequences, contradictions, and the people the idea affects. Do not suggest answers, do not write prose, do not invent new names. Each question is one or two sentences, specific to these notes.\n\n' +
        'Reply with only a JSON array of five strings.\n\n' +
        'Realm: ' + realm.name + (realm.premise ? '\nPremise: ' + realm.premise : '') +
        '\nThread title: ' + t.title +
        (t.distillation.trim() ? '\nThe writer’s current distillation of the idea:\n' + t.distillation.trim() : '') +
        (names ? '\nCodex entries in this realm:\n' + names : '') +
        '\n\nRecent entries, oldest first:\n' + ctx;
      ctl = new AbortController();
      go.disabled = true;
      stop.hidden = false;
      out.innerHTML = '<p class="muted">Claude is reading the thread…</p>';
      try {
        const qs = await sample.json(prompt, { signal: ctl.signal, cache: false });
        const list = Array.isArray(qs) ? qs.map((q) => String(q)).filter(Boolean).slice(0, 8) : [];
        if (!list.length) { out.innerHTML = '<p class="muted">That reply didn’t contain any questions. Try again.</p>'; return; }
        out.innerHTML = '<ol class="consult-list">' + list.map((q, i) => '<li><span>' + esc(q) + '</span><button type="button" class="btn btn-ghost btn-sm" data-cq="' + i + '">Inscribe</button></li>').join('') + '</ol>';
        out.onclick = (ev) => {
          const b = ev.target.closest('[data-cq]');
          if (!b) return;
          M.addEntry(t.id, { type: 'oracle', body: list[+b.dataset.cq], oracle: 'claude' });
          b.disabled = true;
          b.textContent = 'Inscribed';
          UI.toast('Inscribed into “' + t.title + '”');
        };
      } catch (e) {
        const code = e && e.code;
        if (code === 'cancelled') out.innerHTML = '';
        else if (code === 'not_granted' || code === 'sampling_disabled' || code === 'not_declared' || code === 'capability_disabled' || code === 'capability_removed') {
          FC.app.sampleBlocked = true;
          el.hidden = true;
        } else if (code === 'rate_limited') out.innerHTML = '<p class="muted">Claude is busy for you right now. Try again in a little while.</p>';
        else if (code === 'invalid_json') out.innerHTML = '<p class="muted">The reply came back in the wrong shape. Try again.</p>';
        else if (code === 'refused') out.innerHTML = '<p class="muted">Claude declined to answer for this thread.</p>';
        else out.innerHTML = '<p class="muted">Something interrupted the request. Try again.</p>';
      } finally {
        go.disabled = false;
        stop.hidden = true;
        ctl = null;
      }
    });
    stop.addEventListener('click', () => { if (ctl) ctl.abort(); });
  };

  /* ───────────── search ───────────── */

  V.search = function (root, realm, q) {
    root.innerHTML = viewShell(
      '<header class="view-head"><div><p class="eyebrow">' + esc(realm.name) + '</p><h1>Search</h1></div></header>' +
      '<div class="search-bar"><label class="sr-only" for="sr-q">Search</label>' +
        '<input type="search" id="sr-q" class="search-big" placeholder="Search every thread, entry and codex entry…" autocomplete="off" spellcheck="false">' +
        '<label class="sr-only" for="sr-type">Kind of entry</label><select id="sr-type" class="input-sm"><option value="">Everything</option>' +
          M.TYPE_ORDER.concat(['oracle']).map((ty) => '<option value="' + ty + '">' + M.TYPES[ty].label + ' entries</option>').join('') +
        '</select></div>' +
      '<div id="sr-out" aria-live="polite"></div>',
      'view-search'
    );
    const inp = root.querySelector('#sr-q');
    const type = root.querySelector('#sr-type');
    const out = root.querySelector('#sr-out');
    inp.value = q || U.pref.get('search:q', '');
    const run = U.debounce(() => {
      const query = inp.value;
      U.pref.set('search:q', query);
      const r = M.search(realm.id, query, { type: type.value || null });
      if (!r) { out.innerHTML = '<p class="muted empty-line">Type a word or two. Every entry in every thread of this realm is searched, however long the thread.</p>'; return; }
      const n = r.threads.length + r.entries.length + r.codex.length;
      if (!n) { out.innerHTML = '<p class="muted empty-line">Nothing found for “' + esc(query) + '”.</p>'; return; }
      let h = '';
      if (r.threads.length) {
        h += '<section class="sr-sec"><h2>Threads <span class="mg-count">' + r.threads.length + '</span></h2><ul class="sr-list">' +
          r.threads.slice(0, 20).map((t) => '<li><a class="sr-item" href="#t-' + t.id + '"><span class="sr-title">' + UI.markSnippet(t.title, r.terms, 200) + '</span>' +
            (t.distillation && r.terms.some((x) => t.distillation.toLowerCase().includes(x)) ? '<span class="sr-snip">' + UI.markSnippet(t.distillation, r.terms) + '</span>' : '') + '</a></li>').join('') + '</ul></section>';
      }
      if (r.codex.length) {
        h += '<section class="sr-sec"><h2>Codex <span class="mg-count">' + r.codex.length + '</span></h2><ul class="sr-list">' +
          r.codex.slice(0, 20).map((x) => '<li><a class="sr-item" href="#x-' + x.id + '"><span class="sr-title">' + icon(M.KINDS[x.kind].icon, 'ic-sm') + UI.markSnippet(x.name, r.terms, 200) + '</span><span class="sr-snip">' + UI.markSnippet(x.summary + ' ' + x.body, r.terms) + '</span></a></li>').join('') + '</ul></section>';
      }
      if (r.entries.length) {
        const max = 150;
        h += '<section class="sr-sec"><h2>Entries <span class="mg-count">' + r.entries.length + '</span></h2><ul class="sr-list">' +
          r.entries.slice(0, max).map((x) => '<li><a class="sr-item" href="#t-' + x.t.id + '.e-' + x.e.id + '">' +
            '<span class="sr-meta"><span class="t-' + x.e.type + ' sr-type">' + icon(M.TYPES[x.e.type].icon, 'ic-sm') + M.TYPES[x.e.type].label + '</span><span>' + esc(x.t.title) + '</span><span>' + esc(U.fmtDate(x.e.created)) + '</span></span>' +
            '<span class="sr-snip">' + UI.markSnippet(x.e.body, r.terms) + '</span></a></li>').join('') + '</ul>' +
          (r.entries.length > max ? '<p class="muted small">Showing the newest ' + max + '. Add another word to narrow it down.</p>' : '') + '</section>';
      }
      out.innerHTML = h;
    }, 160);
    inp.addEventListener('input', run);
    type.addEventListener('change', run);
    run();
    setTimeout(() => { inp.focus(); inp.select(); }, 30);
  };

  /* ───────────── settings ───────────── */

  V.settings = function (root) {
    const realm = M.activeRealm();
    const theme = U.pref.get('theme', 'system');
    const size = U.pref.get('readsize', 'm');
    const realms = M.realmList();
    const adapter = FC.app.adapterInfo();
    let h =
      '<header class="view-head"><div><h1>Settings</h1></div></header>' +
      '<section class="set-sec"><h2>Appearance</h2>' +
        '<div class="set-row"><span class="set-label" id="lbl-theme">Theme</span><div class="seg" role="radiogroup" aria-labelledby="lbl-theme">' +
          [['system', 'Follow the system'], ['light', 'Parchment'], ['dark', 'Candlelight']].map(([v, l]) => '<button type="button" role="radio" class="seg-btn" data-theme="' + v + '" aria-checked="' + (theme === v) + '">' + l + '</button>').join('') +
        '</div></div>' +
        '<div class="set-row"><span class="set-label" id="lbl-size">Reading size</span><div class="seg" role="radiogroup" aria-labelledby="lbl-size">' +
          [['s', 'Small'], ['m', 'Medium'], ['l', 'Large']].map(([v, l]) => '<button type="button" role="radio" class="seg-btn" data-size="' + v + '" aria-checked="' + (size === v) + '">' + l + '</button>').join('') +
        '</div></div>' +
      '</section>' +
      '<section class="set-sec"><h2>Your archive</h2>' +
        '<p class="set-store">' + icon(adapter.kind === 'account' ? 'codex' : adapter.kind === 'memory' ? 'close' : 'lore') + '<span>' + esc(FC.app.storageSentence()) + '</span></p>' +
        (adapter.persisted === false ? '<p class="muted small">This browser may clear site data when it runs low on space. Export a copy now and then.</p>' : '') +
        (adapter.persisted === true ? '<p class="muted small">This browser has agreed to keep the archive and won’t clear it to make space.</p>' : '') +
        '<div class="btn-row">' +
          '<button type="button" class="btn btn-ghost" data-act="export-all">' + icon('export') + '<span>Export everything</span></button>' +
          (realm ? '<button type="button" class="btn btn-ghost" data-act="export-realm">' + icon('export') + '<span>Export this realm</span></button>' : '') +
          '<button type="button" class="btn btn-ghost" data-act="import">' + icon('import') + '<span>Import an archive</span></button>' +
        '</div>' +
        '<p class="muted small">Exports are JSON files that Ficcraft can import again, here or in any other copy of Ficcraft. Importing adds to what’s here. Anything with the same identity is replaced by the imported version.</p>' +
      '</section>' +
      '<section class="set-sec"><h2>Realms</h2><ul class="realm-list">' +
        realms.map((r) => '<li><span class="realm-li-sig">' + icon(r.sigil) + '</span><span class="realm-li-name">' + esc(r.name) + (r.sample ? ' <span class="muted small">(sample)</span>' : '') + '</span>' +
          '<span class="realm-li-stats muted small">' + U.plural(M.threadsOf(r.id).length, 'thread') + '</span>' +
          '<button type="button" class="btn btn-ghost btn-sm" data-edit-realm="' + r.id + '">Edit</button>' +
          '<button type="button" class="btn btn-ghost btn-sm" data-del-realm="' + r.id + '">Delete</button></li>').join('') +
        '</ul><div class="btn-row"><button type="button" class="btn btn-ghost" data-act="found">' + icon('plus') + '<span>Found a new realm</span></button>' +
        (!realms.some((r) => r.sample) ? '<button type="button" class="btn btn-ghost" data-act="sample">' + icon('s-wave') + '<span>Add the sample realm</span></button>' : '') +
        '</div></section>' +
      '<section class="set-sec"><h2>Keyboard</h2><dl class="keys">' +
        [['/', 'Search'], ['Ctrl + Enter', 'Inscribe, or save an edit'], ['Ctrl + F', 'Find in the open thread'], ['[ and ]', 'Previous and next waypoint'], ['i', 'Jump to the entry box'], ['[[', 'Link a codex name while typing'], ['Esc', 'Close a dialog, menu or editor']]
          .map(([k, d]) => '<div><dt><kbd>' + esc(k) + '</kbd></dt><dd>' + esc(d) + '</dd></div>').join('') +
      '</dl></section>' +
      '<section class="set-sec set-danger"><h2>Erase</h2><p>Delete every realm, thread, entry and codex entry stored in ' + esc(adapter.label) + '. Export first if you might want them back.</p>' +
        '<button type="button" class="btn btn-danger" data-act="erase">' + icon('trash') + '<span>Erase the whole archive</span></button></section>' +
      '<p class="colophon small">Ficcraft · a scriptorium for worlds in progress</p>';
    root.innerHTML = viewShell(h, 'view-settings');

    root.addEventListener('click', async (ev) => {
      const b = ev.target.closest('button');
      if (!b) return;
      if (b.dataset.theme) { FC.app.setTheme(b.dataset.theme); for (const x of root.querySelectorAll('[data-theme]')) x.setAttribute('aria-checked', String(x === b)); return; }
      if (b.dataset.size) { FC.app.setReadSize(b.dataset.size); for (const x of root.querySelectorAll('[data-size]')) x.setAttribute('aria-checked', String(x === b)); return; }
      if (b.dataset.editRealm) { await V.realmDialog(M.realms.get(b.dataset.editRealm)); FC.app.render(); return; }
      if (b.dataset.delRealm) {
        const r = M.realms.get(b.dataset.delRealm);
        if (!r) return;
        const st = M.realmStats(r.id);
        const ok = st.entries > 0 || st.codex > 0
          ? await UI.confirmTyped({ title: 'Delete “' + r.name + '”?', body: 'This deletes ' + U.plural(st.threads, 'thread') + ', ' + U.plural(st.entries, 'entry', 'entries') + ' and ' + U.plural(st.codex, 'codex entry', 'codex entries') + '. It can’t be undone.', word: 'DELETE', confirm: 'Delete realm' })
          : await UI.confirm({ title: 'Delete “' + r.name + '”?', body: 'The realm is empty.', confirm: 'Delete realm', danger: true });
        if (!ok) return;
        M.deleteRealm(r.id);
        UI.toast('Realm deleted');
        FC.app.render();
        return;
      }
      switch (b.dataset.act) {
        case 'export-all': FC.app.exportArchive(null); break;
        case 'export-realm': FC.app.exportArchive(realm.id); break;
        case 'import': FC.app.importFlow(); break;
        case 'found': { const r = await V.realmDialog(null); if (r) FC.app.go('hall'); break; }
        case 'sample': FC.app.loadSample(); break;
        case 'erase': {
          const ok = await UI.confirmTyped({ title: 'Erase the whole archive?', body: 'Every realm, thread, entry and codex entry will be deleted from ' + adapter.label + '. This can’t be undone.', word: 'ERASE', confirm: 'Erase everything' });
          if (!ok) return;
          M.eraseAll();
          UI.toast('Archive erased');
          FC.app.go('welcome');
          break;
        }
        default: break;
      }
    });
  };

  FC.views = V;
})();
