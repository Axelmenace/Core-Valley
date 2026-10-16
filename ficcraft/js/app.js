/* Ficcraft: boot, routing, the index (sidebar) and the margin. */
(function () {
  'use strict';
  const FC = window.FC;
  const U = FC.U;
  const M = FC.model;
  const UI = FC.ui;
  const V = FC.views;
  const esc = U.esc;
  const icon = U.icon;

  FC.inViewer = !!(window.claude && typeof window.claude.use === 'function');
  FC.caps = { db: null, user: null, downloads: null, sample: null };

  const app = {
    route: null,
    view: null,
    legacyArchive: null,
    lastThread: U.pref.get('lastThread', null),
    sampleBlocked: false,
  };
  FC.app = app;

  const $ = (id) => document.getElementById(id);
  let persist = null;
  let adapter = null;
  let persisted = null;
  let initialTheme = null;

  /* ───────────── theme & reading size ───────────── */

  app.setTheme = function (v) {
    U.pref.set('theme', v);
    applyTheme();
  };
  function applyTheme() {
    const v = U.pref.get('theme', 'system');
    const root = document.documentElement;
    if (v === 'light' || v === 'dark') root.setAttribute('data-theme', v);
    else if (initialTheme) root.setAttribute('data-theme', initialTheme);
    else root.removeAttribute('data-theme');
    window.dispatchEvent(new Event('fc:theme'));
  }
  app.setReadSize = function (v) {
    U.pref.set('readsize', v);
    document.documentElement.setAttribute('data-readsize', v);
  };

  /* ───────────── storage ───────────── */

  app.adapterInfo = () => ({ kind: adapter ? adapter.kind : 'memory', label: adapter ? adapter.label : 'memory', persisted });
  app.storageSentence = function () {
    if (!adapter) return 'Opening the archive…';
    if (adapter.kind === 'account') return 'Your archive is saved privately to your Claude account. Only you can see it, from any device where you open this page.';
    if (adapter.kind === 'browser') {
      return FC.inViewer
        ? 'Your archive is kept in this browser only. Sign in to Claude to keep it in your account instead. Export a copy now and then.'
        : 'Your archive is kept in this browser, on this device. Nothing is sent anywhere. Export a copy now and then to keep it safe.';
    }
    return 'This browser won’t let the page store anything, so your work lasts only until you close the page. Export before you leave.';
  };

  async function withTimeout(p, ms) {
    return Promise.race([p, new Promise((r) => setTimeout(() => r(null), ms))]);
  }

  async function chooseAdapter() {
    if (FC.inViewer) {
      const [db, user, downloads, sample] = await Promise.all([
        withTimeout(window.claude.use('db'), 11000).catch(() => null),
        withTimeout(window.claude.use('user'), 11000).catch(() => null),
        withTimeout(window.claude.use('downloads'), 11000).catch(() => null),
        withTimeout(window.claude.use('sample'), 11000).catch(() => null),
      ]);
      FC.caps = { db, user, downloads, sample };
      let uid = null;
      if (user) {
        try { uid = await user.id(); } catch (e) { uid = null; }
      }
      if (db && uid) {
        const a = FC.storage.claudeDb(db, uid);
        try {
          const records = await a.loadAll();
          return { adapter: a, records };
        } catch (e) {
          console.warn('Ficcraft: account storage unavailable, using this browser.', e);
        }
      }
    }
    const a = await FC.storage.openLocal();
    let records = [];
    try {
      records = await a.loadAll();
    } catch (e) {
      console.error('Ficcraft: could not read the archive', e);
      notice('The archive in this browser couldn’t be read. Anything you write now may not be saved. Export often.', 'warn');
    }
    return { adapter: a, records };
  }

  async function askPersistence() {
    if (!adapter || adapter.kind !== 'browser' || FC.inViewer) return;
    try {
      if (navigator.storage && navigator.storage.persisted) {
        persisted = await navigator.storage.persisted();
        if (!persisted && navigator.storage.persist) persisted = await navigator.storage.persist();
      }
    } catch (e) {
      persisted = null;
    }
  }

  function makePersist() {
    persist = new FC.storage.Persist(adapter, M, {
      onState: renderSaveState,
      onDenied: () => fallBackToBrowser(),
      onTooLarge: () => UI.toast('One piece of the archive is too large to save. Split your longest entry in two.', { tone: 'warn', ms: 8000 }),
    });
    M.persist = persist;
  }

  async function fallBackToBrowser() {
    if (adapter && adapter.kind !== 'account') return;
    adapter = await FC.storage.openLocal();
    persist.adapter = adapter;
    persist.markAll(M.allKeys());
    notice('Your sharing level doesn’t let this page save to your Claude account, so your work is kept in this browser. Export a copy before you clear your browser’s data.', 'warn');
    renderSaveState(persist.state);
  }

  async function checkLegacy() {
    if (!adapter || adapter.kind !== 'account' || M.realms.size) return;
    try {
      const local = await FC.storage.idb();
      const recs = await local.loadAll();
      const realms = recs.filter((r) => r.k && r.k.startsWith('r_')).length;
      if (!realms) return;
      const entries = recs.filter((r) => r.k && r.k.startsWith('e_')).reduce((n, r) => n + (r.entries ? r.entries.length : 0), 0);
      app.legacyArchive = { realms, entries, records: recs };
    } catch (e) {
      /* no browser archive */
    }
  }
  app.importLegacy = function () {
    const la = app.legacyArchive;
    if (!la) return;
    const current = M.exportArchive(null);
    M.hydrate(la.records);
    const legacy = M.exportArchive(null);
    M.hydrate([]);
    M.importArchive(current);
    M.importArchive(legacy);
    app.legacyArchive = null;
    UI.toast('Brought your browser archive into your Claude account');
    app.go('hall');
  };

  function renderSaveState(state, detail) {
    const el = $('save-state');
    if (!el) return;
    const where = adapter ? adapter.label : '';
    let txt;
    let cls = 'is-' + state;
    let ic = 'check';
    if (state === 'saved') txt = adapter && adapter.kind === 'memory' ? 'Not stored: export before you leave' : 'Saved to ' + where;
    else if (state === 'pending' || state === 'saving') { txt = 'Saving…'; ic = 'musing'; }
    else if (state === 'retrying') { txt = 'Couldn’t save. Trying again…'; ic = 'riddle'; }
    else if (detail === 'full') { txt = 'Storage is full. Export, then delete something.'; ic = 'riddle'; }
    else { txt = 'Not saved'; ic = 'riddle'; }
    if (adapter && adapter.kind === 'memory') cls += ' is-memory';
    el.className = 'save-state ' + cls;
    el.innerHTML = icon(ic, 'ic-sm') + '<span>' + esc(txt) + '</span>';
  }

  function notice(msg, tone) {
    const el = $('notice');
    if (!el) return;
    el.className = 'notice' + (tone ? ' notice-' + tone : '');
    el.innerHTML = '<p></p><button type="button" class="icon-btn" aria-label="Dismiss">' + icon('close') + '</button>';
    el.querySelector('p').textContent = msg;
    el.querySelector('button').onclick = () => { el.hidden = true; };
    el.hidden = false;
  }

  /* ───────────── import / export / sample ───────────── */

  app.exportArchive = function (rid) {
    const data = M.exportArchive(rid);
    const r = rid ? M.realms.get(rid) : null;
    const date = new Date().toISOString().slice(0, 10);
    const name = 'ficcraft-' + (r ? U.slug(r.name) : 'archive') + '-' + date + '.json';
    UI.saveFile(name, JSON.stringify(data, null, 1), 'application/json');
  };
  app.importFlow = async function () {
    const f = await UI.pickFile('.json,application/json');
    if (!f) return;
    let data;
    try {
      data = JSON.parse(f.text);
    } catch (e) {
      UI.toast('That file isn’t valid JSON, so it can’t be a Ficcraft archive.', { tone: 'warn' });
      return;
    }
    const err = M.validateArchive(data);
    if (err) { UI.toast(err, { tone: 'warn', ms: 6000 }); return; }
    const ok = await UI.confirm({
      title: 'Import “' + f.name + '”?',
      body: 'It holds ' + U.plural(data.realms.length, 'realm') + ', ' + U.plural(data.threads.length, 'thread') + ', ' + U.plural(data.entries.length, 'entry', 'entries') + ' and ' + U.plural(data.codex.length, 'codex entry', 'codex entries') + '. They’ll be added to your archive; anything with the same identity is replaced.',
      confirm: 'Import',
    });
    if (!ok) return;
    try {
      M.importArchive(data);
      if (data.realms[0]) M.setActiveRealm(data.realms[0].id);
      UI.toast('Imported ' + U.plural(data.entries.length, 'entry', 'entries'));
      app.go('hall');
    } catch (e) {
      UI.toast(e.message || 'The import failed.', { tone: 'warn' });
    }
  };
  app.loadSample = function () {
    const existing = [...M.realms.values()].find((r) => r.sample);
    if (existing) { M.setActiveRealm(existing.id); app.go('hall'); return; }
    const data = FC.sampleRealm();
    M.importArchive(data);
    M.setActiveRealm(data.realms[0].id);
    app.go('hall');
  };

  /* A [[name]] was clicked: open its codex entry, or offer to write it. */
  app.openName = function (rid, name) {
    const x = M.findCodex(rid, name);
    if (x) { app.go('x-' + x.id); return; }
    const realm = M.realms.get(rid);
    if (realm) V.codexDialog(realm, { name });
  };

  /* ───────────── routing ───────────── */

  function parseRoute(hash) {
    const h = String(hash || '').replace(/^#/, '');
    if (!h) return { name: '' };
    let m = /^t-([a-z0-9]+)(?:\.e-([a-z0-9]+))?$/.exec(h);
    if (m) return { name: 'thread', id: m[1], entry: m[2] || null };
    m = /^x-([a-z0-9]+)(\.edit)?$/.exec(h);
    if (m) return { name: 'codexEntry', id: m[1], edit: !!m[2] };
    if (['hall', 'threads', 'codex', 'riddles', 'oracle', 'search', 'settings', 'welcome'].includes(h)) return { name: h };
    return { name: '' };
  }
  function replaceHash(h) {
    try {
      history.replaceState(null, '', '#' + h);
    } catch (e) {
      /* a locked-down frame may refuse history writes; the route still renders */
    }
  }
  app.go = function (hash) {
    const h = '#' + hash;
    if (location.hash === h) render();
    else location.hash = h;
  };
  window.addEventListener('hashchange', () => render());

  function unmountView() {
    if (app.view && app.view.unmount) {
      try { app.view.unmount(); } catch (e) { console.error(e); }
    }
    app.view = null;
  }

  function render() {
    UI.closeMenu();
    let r = parseRoute(location.hash);
    if (!M.realms.size && r.name !== 'settings') r = { name: 'welcome' };

    if (r.name === 'thread') {
      const t = M.threads.get(r.id);
      if (!t) { r = { name: 'threads' }; replaceHash('threads'); }
      else if (M.meta.activeRealm !== t.realmId) M.setActiveRealm(t.realmId);
    } else if (r.name === 'codexEntry') {
      const x = M.codex.get(r.id);
      if (!x) { r = { name: 'codex' }; replaceHash('codex'); }
      else if (M.meta.activeRealm !== x.realmId) M.setActiveRealm(x.realmId);
    }
    if (!r.name || (r.name === 'welcome' && M.realms.size)) { r = { name: 'hall' }; replaceHash('hall'); }

    const realm = M.activeRealm();
    const sameThread = app.route && app.route.name === 'thread' && r.name === 'thread' && app.route.id === r.id && app.view && app.view.jumpToId;
    if (sameThread) {
      app.route = r;
      if (r.entry) app.view.jumpToId(r.entry);
      return;
    }
    unmountView();
    app.route = r;
    U.pref.set('route', location.hash.slice(1));

    const main = $('view');
    const fresh = main.cloneNode(false);
    main.replaceWith(fresh);
    const root = fresh;
    root.scrollTop = 0;

    const appEl = $('app');
    appEl.classList.toggle('has-margin', r.name === 'thread');
    appEl.dataset.view = r.name;
    closeDrawer();

    switch (r.name) {
      case 'welcome': V.welcome(root); break;
      case 'hall': V.hall(root, realm); break;
      case 'threads': V.threads(root, realm); break;
      case 'codex': V.codex(root, realm); break;
      case 'codexEntry': V.codexEntry(root, realm, M.codex.get(r.id), r.edit); break;
      case 'riddles': V.riddles(root, realm); break;
      case 'oracle': V.oracle(root, realm); break;
      case 'search': V.search(root, realm, r.q); break;
      case 'settings': V.settings(root); break;
      case 'thread':
        app.lastThread = r.id;
        U.pref.set('lastThread', r.id);
        app.view = FC.thread.mount(root, r.id, { entry: r.entry });
        break;
      default: V.hall(root, realm);
    }
    renderSidebar();
    renderTopbar();
    if (r.name !== 'thread') {
      const h1 = root.querySelector('h1');
      if (h1 && document.activeElement === document.body) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
    }
  }
  app.render = render;

  /* ───────────── sidebar (the index) ───────────── */

  const NAV = [
    ['hall', 'hall', 'Hall'],
    ['threads', 'threads', 'Threads'],
    ['codex', 'codex', 'Codex'],
    ['riddles', 'riddle', 'Riddles'],
    ['oracle', 'oracle', 'Oracle'],
    ['search', 'search', 'Search'],
  ];

  function renderSidebar() {
    const sb = $('sidebar-body');
    if (!sb) return;
    const realm = M.activeRealm();
    const r = app.route || { name: '' };
    let h = '';
    if (realm) {
      const st = M.realmStats(realm.id);
      h +=
        '<button type="button" class="realm-switch" id="realm-switch" aria-haspopup="menu" title="Switch realm">' +
          '<span class="realm-sig">' + icon(realm.sigil) + '</span>' +
          '<span class="realm-name">' + esc(realm.name) + '</span>' + icon('chev', 'ic-sm') +
        '</button>' +
        '<nav class="nav" aria-label="Sections">' +
          NAV.map(([route, ic, label]) => {
            const on = r.name === route || (route === 'threads' && r.name === 'thread') || (route === 'codex' && r.name === 'codexEntry');
            const badge = route === 'riddles' && st.riddles ? '<span class="nav-badge" title="Open riddles">' + st.riddles + '</span>' : '';
            return '<a class="nav-item' + (on ? ' is-on' : '') + '" href="#' + route + '"' + (on ? ' aria-current="page"' : '') + '>' + icon(ic) + '<span>' + label + '</span>' + badge + '</a>';
          }).join('') +
        '</nav>';
      const threads = M.threadsOf(realm.id).sort((a, b) => b.updated - a.updated);
      h += '<div class="side-sec"><div class="side-head"><span>Recent threads</span><button type="button" class="icon-btn icon-btn-sm" id="side-new" title="Begin a thread" aria-label="Begin a thread">' + icon('plus') + '</button></div>';
      if (!threads.length) h += '<p class="side-empty">No threads yet.</p>';
      else {
        h += '<ul class="side-threads">' + threads.slice(0, 14).map((t) =>
          '<li><a class="side-thread' + (r.name === 'thread' && r.id === t.id ? ' is-on' : '') + '" href="#t-' + t.id + '"' + (r.name === 'thread' && r.id === t.id ? ' aria-current="page"' : '') + '>' +
            '<span class="side-st st-' + t.status + '" title="' + M.STATUSES[t.status].label + '">' + icon(M.STATUSES[t.status].icon, 'ic-sm') + '</span>' +
            '<span class="side-title">' + (t.parentId ? icon('branch', 'ic-sm side-branch') : '') + esc(t.title) + '</span>' +
            '<span class="side-n">' + M.entriesOf(t.id).length + '</span>' +
          '</a></li>'
        ).join('') + '</ul>';
        if (threads.length > 14) h += '<a class="side-all linkish" href="#threads">All ' + threads.length + ' threads</a>';
      }
      h += '</div>';
    } else {
      h += '<p class="side-empty">No realm yet.</p>';
    }
    sb.innerHTML = h;
    const sw = $('realm-switch');
    if (sw) sw.addEventListener('click', () => realmMenu(sw));
    const nb = $('side-new');
    if (nb) nb.addEventListener('click', () => V.newThreadDialog(realm));
    const set = $('nav-settings');
    if (set) {
      set.classList.toggle('is-on', r.name === 'settings');
      if (r.name === 'settings') set.setAttribute('aria-current', 'page');
      else set.removeAttribute('aria-current');
    }
  }
  const renderSidebarSoon = U.debounce(renderSidebar, 120);

  async function realmMenu(anchor) {
    const realms = M.realmList();
    const cur = M.activeRealm();
    const items = [{ heading: 'Realms' }];
    for (const r of realms) items.push({ label: r.name, gloss: U.plural(M.threadsOf(r.id).length, 'thread') + (r.sample ? ' · sample' : ''), icon: r.sigil, value: 'r:' + r.id, checked: cur && r.id === cur.id });
    items.push({ sep: true }, { label: 'Found a new realm…', icon: 'plus', value: 'new' });
    if (cur) items.push({ label: 'Edit this realm…', icon: 'edit', value: 'edit' });
    if (!realms.some((r) => r.sample)) items.push({ label: 'Add the sample realm', icon: 's-wave', value: 'sample' });
    const v = await UI.menu(anchor, items, { align: 'left', label: 'Realms' });
    if (!v) return;
    if (v.startsWith('r:')) { M.setActiveRealm(v.slice(2)); app.go('hall'); }
    else if (v === 'new') { const r = await V.realmDialog(null); if (r) app.go('hall'); }
    else if (v === 'edit') { await V.realmDialog(cur); render(); }
    else if (v === 'sample') app.loadSample();
  }

  function renderTopbar() {
    const tb = $('topbar-title');
    if (!tb) return;
    const realm = M.activeRealm();
    tb.textContent = realm ? realm.name : 'Ficcraft';
  }

  /* ───────────── drawers & margin ───────────── */

  const WIDE = () => window.matchMedia('(min-width: 1280px)').matches;
  let marginOpenWide = U.pref.get('margin', true);
  let marginOpenNarrow = false;
  app.marginOpen = () => (WIDE() ? marginOpenWide : marginOpenNarrow);
  app.toggleMargin = function () {
    if (WIDE()) { marginOpenWide = !marginOpenWide; U.pref.set('margin', marginOpenWide); }
    else marginOpenNarrow = !marginOpenNarrow;
    applyMargin();
  };
  app.closeMarginIfOverlay = function () {
    if (!WIDE() && marginOpenNarrow) { marginOpenNarrow = false; applyMargin(); }
  };
  function applyMargin() {
    const a = $('app');
    a.classList.toggle('margin-open', app.marginOpen());
    $('margin').setAttribute('aria-hidden', String(!app.marginOpen()));
    if (app.view && app.view.refreshMargin) app.view.refreshMargin();
    if (app.view) window.dispatchEvent(new Event('resize'));
  }
  window.matchMedia('(min-width: 1280px)').addEventListener('change', applyMargin);

  function openDrawer() {
    $('app').classList.add('drawer-open');
    const first = document.querySelector('#sidebar a, #sidebar button');
    if (first) first.focus();
  }
  function closeDrawer() {
    $('app').classList.remove('drawer-open');
  }

  /* ───────────── global keys ───────────── */

  document.addEventListener('keydown', (ev) => {
    if (UI.isModalOpen()) return;
    if (ev.key === 'Escape') {
      if ($('app').classList.contains('drawer-open')) { closeDrawer(); return; }
      if (!WIDE() && marginOpenNarrow) { marginOpenNarrow = false; applyMargin(); return; }
    }
    if (U.isTyping(ev) || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    if (ev.key === '/') { ev.preventDefault(); if (M.realms.size) app.go('search'); }
    else if (ev.key === '?') { ev.preventDefault(); app.go('settings'); }
  });

  /* ───────────── boot ───────────── */

  function bindShell() {
    $('menu-btn').addEventListener('click', openDrawer);
    $('topbar-search').addEventListener('click', () => { if (M.realms.size) app.go('search'); });
    $('scrim').addEventListener('click', () => { closeDrawer(); if (marginOpenNarrow) { marginOpenNarrow = false; applyMargin(); } });
    $('margin-close').addEventListener('click', () => { app.toggleMargin(); });
    $('sidebar').addEventListener('click', (ev) => {
      if (ev.target.closest('a[href^="#"]')) closeDrawer();
    });
    $('save-state').addEventListener('click', () => app.go('settings'));
    M.on((ev) => {
      if (ev.type === 'realm' && (ev.op === 'activate' || ev.op === 'delete' || ev.op === 'erase')) renderTopbar();
      renderSidebarSoon();
    });
    window.addEventListener('pagehide', () => { if (persist) persist.flush(); });
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && persist) persist.flush(); });
    window.addEventListener('beforeunload', (ev) => {
      if (persist && persist.pending()) {
        persist.flush();
        if (!FC.inViewer) { ev.preventDefault(); ev.returnValue = ''; }
      }
    });
  }

  async function start(hotData) {
    initialTheme = document.documentElement.getAttribute('data-theme');
    applyTheme();
    app.setReadSize(U.pref.get('readsize', 'm'));
    bindShell();
    renderSaveState('saving');
    $('save-state').innerHTML = icon('musing', 'ic-sm') + '<span>Opening the archive…</span>';

    const chosen = await chooseAdapter();
    adapter = chosen.adapter;
    M.hydrate(chosen.records);
    makePersist();
    renderSaveState('saved');
    askPersistence();
    await checkLegacy();
    if (FC.inViewer && adapter.kind === 'browser') {
      notice('Sign in to Claude to keep your archive in your account. For now it’s kept in this browser only.', 'info');
    } else if (adapter.kind === 'memory') {
      notice('This browser won’t let the page store anything, so your work lasts only until you close the page. Export before you leave.', 'warn');
    }

    if (window.claude && window.claude.hot && window.claude.hot.snapshot) {
      try { window.claude.hot.snapshot(() => ({ route: location.hash.slice(1) })); } catch (e) { /* ignore */ }
    }
    const want = (hotData && hotData.route) || (location.hash ? null : U.pref.get('route', null));
    if (want && !location.hash) replaceHash(want);
    $('app').classList.remove('is-booting');
    applyMargin();
    render();
  }

  function boot() {
    const h = window.claude && window.claude.hot;
    if (h && typeof h.ready === 'function') h.ready(start);
    else start((h && h.data) || {});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
