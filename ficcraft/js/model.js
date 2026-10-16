/* Ficcraft: the archive in memory.
   Realms hold threads and a codex. Threads hold entries, ordered by seq.
   Persistence keys: meta · r_<realm> · t_<thread> · x_<codex> · e_<thread>_<chunk>. */
(function () {
  'use strict';
  const FC = window.FC;
  const U = FC.U;

  const TYPES = {
    musing: { label: 'Musing', gloss: 'A thought, a note, a scrap', icon: 'musing', hint: 'Write down what you are thinking…' },
    whatif: { label: 'What If', gloss: 'A speculation to try on', icon: 'whatif', hint: 'What if…' },
    riddle: { label: 'Riddle', gloss: 'An open question to answer later', icon: 'riddle', hint: 'Ask a question you can’t answer yet…' },
    canon: { label: 'Canon', gloss: 'Settled truth about your world', icon: 'canon', hint: 'State something that is now true of your world…' },
    fragment: { label: 'Fragment', gloss: 'A passage of prose or dialogue', icon: 'fragment', hint: 'Draft a passage: a scene, a voice, a line of dialogue…' },
    lore: { label: 'Lore', gloss: 'Research, references, borrowed facts', icon: 'lore', hint: 'Note a source, a reference, a fact borrowed from history…' },
    waypoint: { label: 'Waypoint', gloss: 'A heading that divides a long thread', icon: 'waypoint', hint: 'Name the next stretch of this thread…' },
    oracle: { label: 'Oracle', gloss: 'A question drawn from the deck', icon: 'oracle', hint: '' },
  };
  const TYPE_ORDER = ['musing', 'whatif', 'riddle', 'canon', 'fragment', 'lore', 'waypoint'];

  const STATUSES = {
    spark: { label: 'Spark', gloss: 'Just struck. The seed of an idea.', icon: 'spark' },
    kindling: { label: 'Kindling', gloss: 'Gathering material around it.', icon: 'kindling' },
    burning: { label: 'Burning', gloss: 'Under active development.', icon: 'flame' },
    forged: { label: 'Forged', gloss: 'Settled. Part of the world now.', icon: 'forged' },
    banked: { label: 'Banked', gloss: 'Set aside, kept warm for later.', icon: 'banked' },
  };
  const STATUS_ORDER = ['spark', 'kindling', 'burning', 'forged', 'banked'];

  const KINDS = {
    character: { label: 'Character', plural: 'Characters', icon: 'k-character' },
    place: { label: 'Place', plural: 'Places', icon: 'k-place' },
    faction: { label: 'Faction', plural: 'Factions', icon: 'k-faction' },
    magic: { label: 'Magic', plural: 'Magic', icon: 'k-magic' },
    artifact: { label: 'Artifact', plural: 'Artifacts', icon: 'k-artifact' },
    creature: { label: 'Creature', plural: 'Creatures', icon: 'k-creature' },
    culture: { label: 'Culture', plural: 'Cultures', icon: 'k-culture' },
    event: { label: 'Event', plural: 'Events', icon: 'k-event' },
    concept: { label: 'Concept', plural: 'Concepts', icon: 'k-concept' },
  };
  const KIND_ORDER = Object.keys(KINDS);

  const SIGILS = ['s-crown', 'k-place', 's-wave', 's-tree', 's-moon', 's-sun', 's-sword', 's-key'];

  const MAX_TEXT = 50000;
  const CHUNK_MAX_N = 60;
  const CHUNK_SOFT = 100000;

  const M = {
    TYPES, TYPE_ORDER, STATUSES, STATUS_ORDER, KINDS, KIND_ORDER, SIGILS, MAX_TEXT,
    realms: new Map(),
    threads: new Map(),
    codex: new Map(),
    lists: new Map(),
    byId: new Map(),
    meta: { activeRealm: null },
    persist: null,
    ver: 0,
  };

  const K = {
    realm: (id) => 'r_' + id,
    thread: (id) => 't_' + id,
    codex: (id) => 'x_' + id,
    chunk: (tid, c) => 'e_' + tid + '_' + c,
  };
  M.K = K;

  function mark(k) {
    if (M.persist) M.persist.mark(k);
  }

  const listeners = new Set();
  M.on = function (fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  };
  function emit(ev) {
    M.ver++;
    if (ev.type === 'codex') codexVer++;
    for (const fn of [...listeners]) {
      try { fn(ev); } catch (e) { console.error(e); }
    }
  }

  function clean(s, max) {
    s = String(s == null ? '' : s).replace(/\r\n?/g, '\n');
    return s.length > max ? s.slice(0, max) : s;
  }
  function normTags(tags) {
    const arr = Array.isArray(tags) ? tags : U.splitList(tags);
    const out = [];
    for (const t of arr) {
      const v = String(t).trim().replace(/^#/, '').replace(/\s+/g, '-').toLowerCase().slice(0, 40);
      if (v && !out.includes(v)) out.push(v);
    }
    return out.slice(0, 20);
  }
  function normList(list) {
    const arr = Array.isArray(list) ? list : U.splitList(list);
    const out = [];
    for (const a of arr) {
      const v = String(a).trim().slice(0, 160);
      if (v && !out.some((o) => U.normName(o) === U.normName(v))) out.push(v);
    }
    return out.slice(0, 20);
  }

  /* Runtime bookkeeping per thread: chunk sizes and a word-count cache. Never persisted. */
  const rt = new Map();
  function info(tid) {
    let i = rt.get(tid);
    if (!i) { i = { chunks: new Map(), words: null }; rt.set(tid, i); }
    return i;
  }
  function est(e) {
    return (e.body ? e.body.length : 0) * 1.15 + 180;
  }
  function listOf(tid) {
    let l = M.lists.get(tid);
    if (!l) { l = []; M.lists.set(tid, l); }
    return l;
  }
  function recomputeChunks(tid) {
    const inf = info(tid);
    inf.chunks.clear();
    for (const e of listOf(tid)) {
      const ci = inf.chunks.get(e.c) || { n: 0, size: 0 };
      ci.n++;
      ci.size += est(e);
      inf.chunks.set(e.c, ci);
    }
  }
  function invalidate(tid) {
    info(tid).words = null;
  }
  function insertSorted(list, e) {
    if (!list.length || list[list.length - 1].seq <= e.seq) { list.push(e); return; }
    let lo = 0;
    let hi = list.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (list[mid].seq <= e.seq) lo = mid + 1;
      else hi = mid;
    }
    list.splice(lo, 0, e);
  }
  function assignChunk(t, e) {
    const inf = info(t.id);
    let c = t.curChunk || 0;
    let ci = inf.chunks.get(c) || { n: 0, size: 0 };
    const s = est(e);
    if (ci.n >= CHUNK_MAX_N || (ci.n > 0 && ci.size + s > CHUNK_SOFT)) {
      c = t.nextChunk++;
      t.curChunk = c;
      ci = { n: 0, size: 0 };
    }
    e.c = c;
    ci.n++;
    ci.size += s;
    inf.chunks.set(c, ci);
  }
  function normalizeThread(t) {
    t.tags = normTags(t.tags || []);
    t.distillation = t.distillation || '';
    t.status = STATUSES[t.status] ? t.status : 'spark';
    const list = listOf(t.id);
    let maxSeq = 0;
    let maxC = 0;
    for (const e of list) {
      if (e.seq > maxSeq) maxSeq = e.seq;
      if (e.c > maxC) maxC = e.c;
    }
    t.nextSeq = Math.max(t.nextSeq || 1, maxSeq + 1);
    t.nextChunk = Math.max(t.nextChunk || 1, maxC + 1);
    if (t.curChunk == null || t.curChunk >= t.nextChunk) t.curChunk = maxC;
    recomputeChunks(t.id);
  }

  M.hydrate = function (records) {
    M.realms.clear(); M.threads.clear(); M.codex.clear(); M.lists.clear(); M.byId.clear(); rt.clear();
    M.meta = { activeRealm: null };
    const chunks = [];
    for (const r of records || []) {
      if (!r || typeof r.k !== 'string') continue;
      if (r.k === 'meta') { M.meta = Object.assign({ activeRealm: null }, r.meta || {}); continue; }
      const p = r.k.slice(0, 2);
      if (p === 'r_' && r.realm) M.realms.set(r.realm.id, r.realm);
      else if (p === 't_' && r.thread) M.threads.set(r.thread.id, r.thread);
      else if (p === 'x_' && r.codex) M.codex.set(r.codex.id, Object.assign({ aliases: [], summary: '', body: '' }, r.codex));
      else if (p === 'e_' && Array.isArray(r.entries)) chunks.push(r);
    }
    for (const ch of chunks) {
      if (!M.threads.has(ch.threadId)) continue;
      const list = listOf(ch.threadId);
      for (const e of ch.entries) {
        if (!e || !e.id || M.byId.has(e.id)) continue;
        e.threadId = ch.threadId;
        e.c = ch.c;
        list.push(e);
        M.byId.set(e.id, e);
      }
    }
    for (const list of M.lists.values()) list.sort((a, b) => a.seq - b.seq);
    for (const t of M.threads.values()) normalizeThread(t);
    if (M.meta.activeRealm && !M.realms.has(M.meta.activeRealm)) M.meta.activeRealm = null;
    if (!M.meta.activeRealm && M.realms.size) M.meta.activeRealm = M.realmList()[0].id;
    M.ver++;
    codexVer++;
  };

  function packEntry(e) {
    const o = { id: e.id, seq: e.seq, type: e.type, body: e.body, created: e.created };
    if (e.edited) o.edited = e.edited;
    if (e.ribbon) o.ribbon = true;
    if (e.resolved) o.resolved = e.resolved;
    if (e.oracle) o.oracle = e.oracle;
    return o;
  }

  function serializeChunk(tid, c, k) {
    const t = M.threads.get(tid);
    if (!t) return null;
    let list = listOf(tid).filter((e) => e.c === c);
    if (!list.length) return null;
    let doc = { k, threadId: tid, c, entries: list.map(packEntry) };
    let size = U.byteLen(JSON.stringify(doc));
    let split = false;
    while (size > FC.storage.MAX_DOC_BYTES && list.length > 1) {
      const cut = Math.ceil(list.length / 2);
      const moved = list.slice(cut);
      list = list.slice(0, cut);
      const nc = t.nextChunk++;
      for (const e of moved) e.c = nc;
      if (t.curChunk === c) t.curChunk = nc;
      mark(K.thread(tid));
      mark(K.chunk(tid, nc));
      doc = { k, threadId: tid, c, entries: list.map(packEntry) };
      size = U.byteLen(JSON.stringify(doc));
      split = true;
    }
    if (split) recomputeChunks(tid);
    if (size > FC.storage.MAX_DOC_BYTES) return { __tooLarge: true };
    return doc;
  }

  M.serialize = function (k) {
    if (k === 'meta') return { k, meta: M.meta };
    const p = k.slice(0, 2);
    const rest = k.slice(2);
    if (p === 'r_') { const r = M.realms.get(rest); return r ? { k, realm: r } : null; }
    if (p === 't_') { const t = M.threads.get(rest); return t ? { k, thread: t } : null; }
    if (p === 'x_') { const x = M.codex.get(rest); return x ? { k, codex: x } : null; }
    if (p === 'e_') {
      const i = rest.lastIndexOf('_');
      return serializeChunk(rest.slice(0, i), Number(rest.slice(i + 1)), k);
    }
    return null;
  };

  M.allKeys = function () {
    const keys = ['meta'];
    for (const id of M.realms.keys()) keys.push(K.realm(id));
    for (const id of M.threads.keys()) {
      keys.push(K.thread(id));
      const cs = new Set(listOf(id).map((e) => e.c));
      for (const c of cs) keys.push(K.chunk(id, c));
    }
    for (const id of M.codex.keys()) keys.push(K.codex(id));
    return keys;
  };

  /* ───────────── Realms ───────────── */

  M.realmList = function () {
    const act = new Map();
    for (const t of M.threads.values()) act.set(t.realmId, Math.max(act.get(t.realmId) || 0, t.updated || 0));
    return [...M.realms.values()].sort((a, b) => (act.get(b.id) || b.created) - (act.get(a.id) || a.created));
  };
  M.activeRealm = () => M.realms.get(M.meta.activeRealm) || null;
  M.setActiveRealm = function (id) {
    if (!M.realms.has(id) || M.meta.activeRealm === id) return;
    M.meta.activeRealm = id;
    mark('meta');
    emit({ type: 'realm', op: 'activate', id });
  };
  M.createRealm = function (o) {
    o = o || {};
    const r = {
      id: o.id || U.uid(),
      name: clean(o.name, 120).trim() || 'Untitled realm',
      premise: clean(o.premise, 2000).trim(),
      sigil: SIGILS.includes(o.sigil) ? o.sigil : 's-crown',
      created: o.created || Date.now(),
    };
    if (o.sample) r.sample = true;
    M.realms.set(r.id, r);
    mark(K.realm(r.id));
    emit({ type: 'realm', op: 'create', id: r.id });
    return r;
  };
  M.updateRealm = function (id, patch) {
    const r = M.realms.get(id);
    if (!r) return;
    if ('name' in patch) r.name = clean(patch.name, 120).trim() || r.name;
    if ('premise' in patch) r.premise = clean(patch.premise, 2000).trim();
    if ('sigil' in patch && SIGILS.includes(patch.sigil)) r.sigil = patch.sigil;
    if ('sample' in patch && !patch.sample) delete r.sample;
    mark(K.realm(id));
    emit({ type: 'realm', op: 'update', id });
  };
  M.deleteRealm = function (id) {
    if (!M.realms.has(id)) return;
    for (const t of M.threadsOf(id)) dropThread(t.id);
    for (const x of M.codexOf(id)) { M.codex.delete(x.id); mark(K.codex(x.id)); }
    M.realms.delete(id);
    mark(K.realm(id));
    if (M.meta.activeRealm === id) {
      const next = M.realmList()[0];
      M.meta.activeRealm = next ? next.id : null;
    }
    mark('meta');
    emit({ type: 'realm', op: 'delete', id });
    emit({ type: 'codex', op: 'bulk' });
  };

  /* ───────────── Threads ───────────── */

  M.threadsOf = (rid) => [...M.threads.values()].filter((t) => t.realmId === rid);
  M.entriesOf = (tid) => M.lists.get(tid) || [];
  M.children = (tid) => [...M.threads.values()].filter((t) => t.parentId === tid);

  M.createThread = function (realmId, o) {
    o = o || {};
    const now = o.created || Date.now();
    const t = {
      id: o.id || U.uid(),
      realmId,
      title: clean(o.title, 200).trim() || 'Untitled thread',
      status: STATUSES[o.status] ? o.status : 'spark',
      tags: normTags(o.tags || []),
      parentId: o.parentId || null,
      parentEntryId: o.parentEntryId || null,
      distillation: clean(o.distillation, MAX_TEXT),
      distilled: o.distillation ? o.distilled || now : null,
      created: now,
      updated: o.updated || now,
      nextSeq: 1,
      nextChunk: 1,
      curChunk: 0,
    };
    M.threads.set(t.id, t);
    listOf(t.id);
    mark(K.thread(t.id));
    emit({ type: 'thread', op: 'create', id: t.id });
    return t;
  };
  M.updateThread = function (id, patch) {
    const t = M.threads.get(id);
    if (!t) return;
    if ('title' in patch) t.title = clean(patch.title, 200).trim() || t.title;
    if ('status' in patch && STATUSES[patch.status]) t.status = patch.status;
    if ('tags' in patch) t.tags = normTags(patch.tags);
    if ('distillation' in patch) {
      t.distillation = clean(patch.distillation, MAX_TEXT);
      t.distilled = Date.now();
      invalidate(id);
    }
    t.updated = Date.now();
    mark(K.thread(id));
    emit({ type: 'thread', op: 'update', id });
  };
  function dropThread(id) {
    const list = listOf(id);
    const used = new Set(list.map((e) => e.c));
    for (const e of list) M.byId.delete(e.id);
    M.lists.delete(id);
    M.threads.delete(id);
    rt.delete(id);
    mark(K.thread(id));
    for (const c of used) mark(K.chunk(id, c));
  }
  M.deleteThread = function (id) {
    const t = M.threads.get(id);
    if (!t) return null;
    const entries = listOf(id).slice();
    const reparented = [];
    for (const ch of M.threads.values()) {
      if (ch.parentId === id) {
        reparented.push({ id: ch.id, parentId: ch.parentId, parentEntryId: ch.parentEntryId });
        ch.parentId = t.parentId || null;
        ch.parentEntryId = null;
        mark(K.thread(ch.id));
      }
    }
    dropThread(id);
    emit({ type: 'thread', op: 'delete', id });
    return { thread: t, entries, reparented };
  };
  M.restoreThread = function (snap) {
    if (!snap || M.threads.has(snap.thread.id)) return;
    const t = snap.thread;
    M.threads.set(t.id, t);
    const list = listOf(t.id);
    for (const e of snap.entries) { list.push(e); M.byId.set(e.id, e); }
    list.sort((a, b) => a.seq - b.seq);
    normalizeThread(t);
    for (const r of snap.reparented) {
      const ch = M.threads.get(r.id);
      if (ch) { ch.parentId = r.parentId; ch.parentEntryId = r.parentEntryId; mark(K.thread(ch.id)); }
    }
    for (const k of M.allKeys()) if (k === K.thread(t.id) || k.startsWith('e_' + t.id + '_')) mark(k);
    emit({ type: 'thread', op: 'create', id: t.id });
  };

  M.threadWords = function (tid) {
    const inf = info(tid);
    if (inf.words == null) {
      let w = 0;
      for (const e of listOf(tid)) w += U.words(e.body);
      const t = M.threads.get(tid);
      if (t) w += U.words(t.distillation);
      inf.words = w;
    }
    return inf.words;
  };

  /* ───────────── Entries ───────────── */

  M.addEntry = function (tid, o) {
    const t = M.threads.get(tid);
    if (!t) return null;
    const now = Date.now();
    const e = {
      id: o.id || U.uid(),
      threadId: tid,
      seq: o.seq != null ? o.seq : t.nextSeq++,
      type: TYPES[o.type] ? o.type : 'musing',
      body: clean(o.body, MAX_TEXT),
      created: o.created || now,
    };
    if (o.edited) e.edited = o.edited;
    if (o.ribbon) e.ribbon = true;
    if (o.resolved && e.type === 'riddle') e.resolved = o.resolved;
    if (o.oracle) e.oracle = String(o.oracle).slice(0, 40);
    if (e.seq >= t.nextSeq) t.nextSeq = e.seq + 1;
    assignChunk(t, e);
    insertSorted(listOf(tid), e);
    M.byId.set(e.id, e);
    t.updated = Math.max(t.updated || 0, e.created);
    invalidate(tid);
    mark(K.thread(tid));
    mark(K.chunk(tid, e.c));
    emit({ type: 'entry', op: 'add', id: e.id, threadId: tid });
    return e;
  };
  M.updateEntry = function (id, patch) {
    const e = M.byId.get(id);
    if (!e) return;
    let edited = false;
    if ('body' in patch) {
      const b = clean(patch.body, MAX_TEXT);
      if (b !== e.body) { e.body = b; edited = true; }
    }
    if ('type' in patch && TYPES[patch.type] && patch.type !== e.type) {
      e.type = patch.type;
      if (e.type !== 'riddle') delete e.resolved;
    }
    if ('ribbon' in patch) { if (patch.ribbon) e.ribbon = true; else delete e.ribbon; }
    if ('resolved' in patch) { if (patch.resolved) e.resolved = Date.now(); else delete e.resolved; }
    if (edited) {
      e.edited = Date.now();
      const t = M.threads.get(e.threadId);
      if (t) { t.updated = Date.now(); mark(K.thread(t.id)); }
      recomputeChunks(e.threadId);
      invalidate(e.threadId);
    }
    mark(K.chunk(e.threadId, e.c));
    emit({ type: 'entry', op: 'update', id, threadId: e.threadId });
  };
  M.deleteEntry = function (id) {
    const e = M.byId.get(id);
    if (!e) return null;
    const list = listOf(e.threadId);
    const i = list.indexOf(e);
    if (i >= 0) list.splice(i, 1);
    M.byId.delete(id);
    recomputeChunks(e.threadId);
    invalidate(e.threadId);
    mark(K.chunk(e.threadId, e.c));
    emit({ type: 'entry', op: 'delete', id, threadId: e.threadId });
    return e;
  };
  M.restoreEntry = function (e) {
    if (!e || !M.threads.has(e.threadId) || M.byId.has(e.id)) return;
    insertSorted(listOf(e.threadId), e);
    M.byId.set(e.id, e);
    recomputeChunks(e.threadId);
    invalidate(e.threadId);
    mark(K.chunk(e.threadId, e.c));
    emit({ type: 'entry', op: 'add', id: e.id, threadId: e.threadId });
  };
  M.indexOf = function (tid, eid) {
    const list = listOf(tid);
    for (let i = list.length - 1; i >= 0; i--) if (list[i].id === eid) return i;
    return -1;
  };

  /* ───────────── Codex ───────────── */

  let codexVer = 0;
  M.codexOf = (rid) => [...M.codex.values()].filter((x) => x.realmId === rid);
  M.createCodex = function (realmId, o) {
    o = o || {};
    const now = Date.now();
    const x = {
      id: o.id || U.uid(),
      realmId,
      name: clean(o.name, 160).trim() || 'Unnamed',
      kind: KINDS[o.kind] ? o.kind : 'concept',
      aliases: normList(o.aliases || []),
      summary: clean(o.summary, 600).trim(),
      body: clean(o.body, MAX_TEXT),
      created: o.created || now,
      updated: o.updated || now,
    };
    M.codex.set(x.id, x);
    mark(K.codex(x.id));
    emit({ type: 'codex', op: 'create', id: x.id });
    return x;
  };
  M.updateCodex = function (id, patch) {
    const x = M.codex.get(id);
    if (!x) return;
    if ('name' in patch) x.name = clean(patch.name, 160).trim() || x.name;
    if ('kind' in patch && KINDS[patch.kind]) x.kind = patch.kind;
    if ('aliases' in patch) x.aliases = normList(patch.aliases);
    if ('summary' in patch) x.summary = clean(patch.summary, 600).trim();
    if ('body' in patch) x.body = clean(patch.body, MAX_TEXT);
    x.updated = Date.now();
    mark(K.codex(id));
    emit({ type: 'codex', op: 'update', id });
  };
  M.deleteCodex = function (id) {
    const x = M.codex.get(id);
    if (!x) return null;
    M.codex.delete(id);
    mark(K.codex(id));
    emit({ type: 'codex', op: 'delete', id });
    return x;
  };
  M.restoreCodex = function (x) {
    if (!x || M.codex.has(x.id)) return;
    M.codex.set(x.id, x);
    mark(K.codex(x.id));
    emit({ type: 'codex', op: 'create', id: x.id });
  };

  function codexNames(x) {
    return [x.name].concat(x.aliases || []).map(U.normName).filter(Boolean);
  }
  const idxCache = new Map();
  M.codexIndex = function (rid) {
    let c = idxCache.get(rid);
    if (!c || c.ver !== codexVer) {
      const map = new Map();
      for (const x of M.codex.values()) {
        if (x.realmId !== rid) continue;
        for (const n of codexNames(x)) if (!map.has(n)) map.set(n, x);
      }
      c = { ver: codexVer, map };
      idxCache.set(rid, c);
    }
    return c.map;
  };
  M.findCodex = (rid, name) => M.codexIndex(rid).get(U.normName(name)) || null;
  M.resolver = function (rid) {
    const idx = M.codexIndex(rid);
    return (name) => idx.has(U.normName(name));
  };

  /* Cached [[link]] targets per text-bearing object; invalidates itself when the text changes. */
  const linkCache = new WeakMap();
  function namesIn(obj, src) {
    let c = linkCache.get(obj);
    if (!c || c.src !== src) {
      const names = new Map();
      for (const n of FC.md.links(src || '')) {
        const k = U.normName(n);
        if (k && !names.has(k)) names.set(k, n);
      }
      c = { src, names };
      linkCache.set(obj, c);
    }
    return c.names;
  }
  M.namesInEntry = (e) => namesIn(e, e.body);

  M.backlinks = function (x) {
    const names = new Set(codexNames(x));
    const has = (map) => { for (const k of map.keys()) if (names.has(k)) return true; return false; };
    const out = { entries: [], threads: [], codex: [] };
    for (const t of M.threadsOf(x.realmId)) {
      if (has(namesIn(t, t.distillation))) out.threads.push(t);
      for (const e of M.entriesOf(t.id)) if (has(namesIn(e, e.body))) out.entries.push({ e, t });
    }
    for (const y of M.codexOf(x.realmId)) if (y !== x && has(namesIn(y, y.body))) out.codex.push(y);
    out.entries.sort((a, b) => b.e.created - a.e.created);
    return out;
  };

  let census = null;
  M.linkCensus = function (rid) {
    if (census && census.rid === rid && census.ver === M.ver) return census;
    const idx = M.codexIndex(rid);
    const counts = new Map();
    const unwritten = new Map();
    const tally = (map, t) => {
      for (const [k, orig] of map) {
        const x = idx.get(k);
        if (x) counts.set(x.id, (counts.get(x.id) || 0) + 1);
        else {
          const u = unwritten.get(k) || { name: orig, count: 0, threadId: t ? t.id : null };
          u.count++;
          unwritten.set(k, u);
        }
      }
    };
    for (const t of M.threadsOf(rid)) {
      tally(namesIn(t, t.distillation), t);
      for (const e of M.entriesOf(t.id)) tally(namesIn(e, e.body), t);
    }
    for (const x of M.codexOf(rid)) tally(namesIn(x, x.body), null);
    census = {
      rid,
      ver: M.ver,
      counts,
      unwritten: [...unwritten.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    };
    return census;
  };

  M.threadMentions = function (tid) {
    const t = M.threads.get(tid);
    if (!t) return { known: [], unknown: [] };
    const idx = M.codexIndex(t.realmId);
    const known = new Map();
    const unknown = new Map();
    const take = (map) => {
      for (const [k, orig] of map) {
        const x = idx.get(k);
        if (x) known.set(x.id, { x, n: ((known.get(x.id) || {}).n || 0) + 1 });
        else unknown.set(k, { name: orig, n: ((unknown.get(k) || {}).n || 0) + 1 });
      }
    };
    take(namesIn(t, t.distillation));
    for (const e of M.entriesOf(tid)) take(namesIn(e, e.body));
    return {
      known: [...known.values()].sort((a, b) => b.n - a.n),
      unknown: [...unknown.values()].sort((a, b) => b.n - a.n),
    };
  };

  /* ───────────── Queries ───────────── */

  M.realmStats = function (rid) {
    const ts = M.threadsOf(rid);
    let entries = 0;
    let words = 0;
    let riddles = 0;
    for (const t of ts) {
      const l = M.entriesOf(t.id);
      entries += l.length;
      words += M.threadWords(t.id);
      for (const e of l) if (e.type === 'riddle' && !e.resolved) riddles++;
    }
    for (const x of M.codexOf(rid)) words += U.words(x.body) + U.words(x.summary);
    return { threads: ts.length, entries, words, codex: M.codexOf(rid).length, riddles };
  };

  M.riddles = function (rid, withResolved) {
    const out = [];
    for (const t of M.threadsOf(rid)) {
      for (const e of M.entriesOf(t.id)) {
        if (e.type === 'riddle' && (withResolved || !e.resolved)) out.push({ e, t });
      }
    }
    out.sort((a, b) => b.e.created - a.e.created);
    return out;
  };

  M.recentCanon = function (rid, n) {
    const out = [];
    for (const t of M.threadsOf(rid)) for (const e of M.entriesOf(t.id)) if (e.type === 'canon') out.push({ e, t });
    out.sort((a, b) => b.e.created - a.e.created);
    return out.slice(0, n || 6);
  };

  M.search = function (rid, q, opts) {
    opts = opts || {};
    const terms = U.normName(q).split(' ').filter(Boolean);
    if (!terms.length) return null;
    const hit = (s) => {
      const l = String(s || '').toLowerCase();
      for (const term of terms) if (l.indexOf(term) < 0) return false;
      return true;
    };
    const threads = [];
    const entries = [];
    const codex = [];
    for (const t of M.threadsOf(rid)) {
      if (!opts.type && hit(t.title + ' ' + t.tags.join(' ') + ' ' + t.distillation)) threads.push(t);
      for (const e of M.entriesOf(t.id)) {
        if (opts.type && e.type !== opts.type) continue;
        if (hit(e.body)) entries.push({ e, t });
      }
    }
    if (!opts.type) {
      for (const x of M.codexOf(rid)) if (hit(x.name + ' ' + x.aliases.join(' ') + ' ' + x.summary + ' ' + x.body)) codex.push(x);
    }
    entries.sort((a, b) => b.e.created - a.e.created);
    threads.sort((a, b) => b.updated - a.updated);
    return { terms, threads, entries, codex };
  };

  /* ───────────── Import / export ───────────── */

  M.exportArchive = function (rid) {
    const realms = rid ? [M.realms.get(rid)].filter(Boolean) : [...M.realms.values()];
    const ids = new Set(realms.map((r) => r.id));
    const threads = [...M.threads.values()].filter((t) => ids.has(t.realmId));
    const entries = [];
    for (const t of threads) for (const e of M.entriesOf(t.id)) entries.push(Object.assign({ threadId: t.id }, packEntry(e)));
    const codex = [...M.codex.values()].filter((x) => ids.has(x.realmId));
    return {
      format: 'ficcraft-archive',
      version: 1,
      exportedAt: new Date().toISOString(),
      realms,
      threads: threads.map((t) => {
        const c = Object.assign({}, t);
        delete c.nextChunk;
        delete c.curChunk;
        return c;
      }),
      entries,
      codex,
    };
  };

  function repack(tid) {
    const t = M.threads.get(tid);
    const list = listOf(tid);
    const old = new Set(list.map((e) => e.c));
    for (const c of info(tid).chunks.keys()) old.add(c);
    let c = 0;
    let n = 0;
    let size = 0;
    for (const e of list) {
      const s = est(e);
      if (n >= CHUNK_MAX_N || (n > 0 && size + s > CHUNK_SOFT)) { c++; n = 0; size = 0; }
      e.c = c;
      n++;
      size += s;
    }
    t.curChunk = c;
    t.nextChunk = c + 1;
    for (const oc of old) mark(K.chunk(tid, oc));
    for (let i = 0; i <= c; i++) mark(K.chunk(tid, i));
    recomputeChunks(tid);
    invalidate(tid);
    mark(K.thread(tid));
  }

  M.validateArchive = function (data) {
    if (!data || typeof data !== 'object') return 'This file is not a Ficcraft archive.';
    if (data.format !== 'ficcraft-archive') return 'This file is not a Ficcraft archive (it has no “ficcraft-archive” marker).';
    if (!Array.isArray(data.realms) || !Array.isArray(data.threads) || !Array.isArray(data.entries) || !Array.isArray(data.codex)) {
      return 'This archive is missing realms, threads, entries or codex lists.';
    }
    return null;
  };

  M.importArchive = function (data) {
    const err = M.validateArchive(data);
    if (err) throw new Error(err);
    const touched = new Set();
    for (const r of data.realms) {
      if (!r || !r.id) continue;
      M.realms.set(r.id, {
        id: String(r.id),
        name: clean(r.name, 120).trim() || 'Untitled realm',
        premise: clean(r.premise, 2000),
        sigil: SIGILS.includes(r.sigil) ? r.sigil : 's-crown',
        created: Number(r.created) || Date.now(),
        ...(r.sample ? { sample: true } : {}),
      });
      mark(K.realm(r.id));
    }
    for (const t of data.threads) {
      if (!t || !t.id || !M.realms.has(t.realmId)) continue;
      const prev = M.threads.get(t.id);
      M.threads.set(t.id, {
        id: String(t.id),
        realmId: t.realmId,
        title: clean(t.title, 200).trim() || 'Untitled thread',
        status: STATUSES[t.status] ? t.status : 'spark',
        tags: normTags(t.tags || []),
        parentId: t.parentId || null,
        parentEntryId: t.parentEntryId || null,
        distillation: clean(t.distillation, MAX_TEXT),
        distilled: t.distilled || null,
        created: Number(t.created) || Date.now(),
        updated: Number(t.updated) || Date.now(),
        nextSeq: prev ? prev.nextSeq : 1,
        nextChunk: prev ? prev.nextChunk : 1,
        curChunk: prev ? prev.curChunk : 0,
      });
      listOf(t.id);
      touched.add(t.id);
    }
    for (const e of data.entries) {
      if (!e || !e.id || !M.threads.has(e.threadId)) continue;
      const existing = M.byId.get(e.id);
      if (existing) {
        const l = listOf(existing.threadId);
        const i = l.indexOf(existing);
        if (i >= 0) l.splice(i, 1);
        touched.add(existing.threadId);
      }
      const ne = {
        id: String(e.id),
        threadId: e.threadId,
        seq: Number(e.seq) || 0,
        type: TYPES[e.type] ? e.type : 'musing',
        body: clean(e.body, MAX_TEXT),
        created: Number(e.created) || Date.now(),
        c: 0,
      };
      if (e.edited) ne.edited = Number(e.edited);
      if (e.ribbon) ne.ribbon = true;
      if (e.resolved && ne.type === 'riddle') ne.resolved = Number(e.resolved) || Date.now();
      if (e.oracle) ne.oracle = String(e.oracle).slice(0, 40);
      listOf(ne.threadId).push(ne);
      M.byId.set(ne.id, ne);
      touched.add(ne.threadId);
    }
    for (const tid of touched) {
      const l = listOf(tid);
      l.sort((a, b) => a.seq - b.seq || a.created - b.created);
      let seq = 0;
      for (const e of l) { if (e.seq <= seq) e.seq = seq + 1; seq = e.seq; }
      const t = M.threads.get(tid);
      t.nextSeq = seq + 1;
      repack(tid);
    }
    for (const x of data.codex) {
      if (!x || !x.id || !M.realms.has(x.realmId)) continue;
      M.codex.set(x.id, {
        id: String(x.id),
        realmId: x.realmId,
        name: clean(x.name, 160).trim() || 'Unnamed',
        kind: KINDS[x.kind] ? x.kind : 'concept',
        aliases: normList(x.aliases || []),
        summary: clean(x.summary, 600),
        body: clean(x.body, MAX_TEXT),
        created: Number(x.created) || Date.now(),
        updated: Number(x.updated) || Date.now(),
      });
      mark(K.codex(x.id));
    }
    if (!M.meta.activeRealm && M.realms.size) M.meta.activeRealm = data.realms[0] ? data.realms[0].id : M.realmList()[0].id;
    mark('meta');
    emit({ type: 'realm', op: 'import' });
    emit({ type: 'codex', op: 'bulk' });
    return { realms: data.realms.length, threads: data.threads.length, entries: data.entries.length, codex: data.codex.length };
  };

  M.eraseAll = function () {
    const keys = M.allKeys();
    M.realms.clear(); M.threads.clear(); M.codex.clear(); M.lists.clear(); M.byId.clear(); rt.clear();
    M.meta = { activeRealm: null };
    for (const k of keys) mark(k);
    emit({ type: 'realm', op: 'erase' });
    emit({ type: 'codex', op: 'bulk' });
  };

  /* Markdown export of one thread, for writers who want the whole thing as a document. */
  M.threadMarkdown = function (tid) {
    const t = M.threads.get(tid);
    if (!t) return '';
    const realm = M.realms.get(t.realmId);
    const lines = ['# ' + t.title, ''];
    lines.push('*' + STATUSES[t.status].label + (realm ? ' · ' + realm.name : '') + (t.tags.length ? ' · ' + t.tags.map((x) => '#' + x).join(' ') : '') + '*', '');
    if (t.distillation.trim()) lines.push('## Distillation', '', t.distillation.trim(), '');
    lines.push('## Thread', '');
    let day = '';
    for (const e of M.entriesOf(tid)) {
      const dk = U.fmtDay(e.created);
      if (dk !== day) { lines.push('### ' + dk, ''); day = dk; }
      if (e.type === 'waypoint') { lines.push('#### ✦ ' + U.firstLine(e.body), ''); continue; }
      const tag = TYPES[e.type].label + (e.type === 'riddle' && e.resolved ? ' (answered)' : '') + (e.ribbon ? ' · ribboned' : '');
      lines.push('**' + tag + '** · ' + U.fmtTime(e.created), '', e.body.trim(), '');
    }
    return lines.join('\n');
  };

  FC.model = M;
})();
