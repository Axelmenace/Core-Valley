/* ── model: state, the binder tree, persistence, templates ─────────────── */
const S = {
  meta: { v: 1, projects: [], settings: { ...DEFAULT_SETTINGS } },
  project: null, codex: null,
  texts: new Map(),          // nid → sanitized html (loaded lazily)
  mode: "write", sel: null, active: null, codexSel: null, codexCat: "all", codexQ: "",
  sessionStart: 0, sprint: null, focus: false,
};
let IX = { parent: {}, coord: {}, total: {}, order: [], chapters: [], depthOf: {} };

const P = () => S.project;
const node = id => (S.project && S.project.nodes[id]) || null;
const labelOf = type => type === "scene" ? "Scene" : FORMS[P().form][type];
const keyP = pid => "p." + pid, keyC = pid => "c." + pid, keyT = (pid, nid) => "t." + pid + "." + nid, keyS = (pid, nid) => "s." + pid + "." + nid;
const RANK = { part: 3, chapter: 2, scene: 1 };

function mkNode(p, type, title, extra = {}) {
  const n = { id: uid(), type, title: title || "", status: "seed", synopsis: "", notes: "", words: 0, include: true, threads: [], pov: "", place: "", when: "", target: 0, ...extra };
  if (type !== "scene") n.children = n.children || [];
  p.nodes[n.id] = n;
  return n;
}

/* Rebuild the derived index: parents, coordinates, totals, reading order. */
function reindex() {
  const p = P(); if (!p) return;
  const parent = {}, coord = {}, total = {}, order = [], chapters = [], depthOf = {};
  let ch = 0, pt = 0, loose = 0;
  const ser = p.form === "serial";
  const walk = (ids, par, chCoord, depth) => {
    let sc = 0, sum = 0;
    for (const id of ids) {
      const n = p.nodes[id]; if (!n) continue;
      parent[id] = par; depthOf[id] = depth;
      if (n.type === "part") { pt++; coord[id] = roman(pt); total[id] = walk(n.children, id, null, depth + 1); }
      else if (n.type === "chapter") { ch++; coord[id] = (ser ? "E" : "") + pad2(ch); chapters.push(id); total[id] = walk(n.children, id, coord[id], depth + 1); }
      else { sc++; coord[id] = chCoord ? chCoord + "·" + sc : "§" + (++loose); total[id] = n.words || 0; order.push(id); }
      sum += total[id] || 0;
    }
    return sum;
  };
  total.root = walk(p.root, null, null, 0);
  IX = { parent, coord, total, order, chapters, depthOf };
}
const projectWords = () => IX.total.root || 0;
const childrenOf = id => id ? (node(id) && node(id).children) || [] : P().root;
const ancestors = id => { const a = []; let x = IX.parent[id]; while (x) { a.push(x); x = IX.parent[x]; } return a; };
function scenesUnder(id) {
  if (!id) return IX.order.slice();
  const n = node(id); if (!n) return [];
  if (n.type === "scene") return [id];
  const out = []; const walk = ids => ids.forEach(c => { const m = node(c); if (!m) return; if (m.type === "scene") out.push(c); else walk(m.children); });
  walk(n.children); return out;
}
const chapterOf = id => { let x = id; while (x && node(x) && node(x).type !== "chapter") x = IX.parent[x]; return x && node(x) ? x : null; };
function rollupStatus(id) {
  const sc = scenesUnder(id); if (!sc.length) return node(id) ? node(id).status || "seed" : "seed";
  return STATUSES[Math.min(...sc.map(s => STATUS_IX[node(s).status] ?? 0))][0];
}
function targetOf(id) {
  const n = node(id); if (!n) return 0;
  if (n.target) return n.target;
  if (n.type === "scene") return 0;
  return scenesUnder(id).reduce((a, s) => a + (node(s).target || 0), 0);
}

/* ── Persistence ── */
const saveProjectSoon = debounce(() => saveProject(), 1200);
const saveCodexSoon = debounce(() => saveCodex(), 900);
const saveMetaSoon = debounce(() => saveMeta(), 800);
function summaryOf(p) {
  return { id: p.id, title: p.title, subtitle: p.subtitle || "", author: p.author || "", form: p.form, words: IX.total.root || 0, target: p.goal.words || 0, updated: p.updated, created: p.created, sample: !!p.sample };
}
function saveProject() {
  const p = P(); if (!p) return;
  p.updated = now();
  Store.put(keyP(p.id), p);
  const i = S.meta.projects.findIndex(x => x.id === p.id);
  const sum = summaryOf(p);
  if (i < 0) S.meta.projects.push(sum); else S.meta.projects[i] = sum;
  saveMetaSoon();
}
function saveCodex() { if (P() && S.codex) Store.put(keyC(P().id), S.codex); }
function saveMeta() { Store.put("meta", S.meta); }
function touch() { reindex(); saveProjectSoon(); }

async function loadMeta() {
  const m = await Store.get("meta");
  if (m && m.projects) S.meta = { ...S.meta, ...m, settings: { ...DEFAULT_SETTINGS, ...(m.settings || {}) } };
}
async function openProject(pid) {
  flushAll();
  const p = await Store.get(keyP(pid));
  if (!p) throw new Error("That project could not be found in storage.");
  const c = (await Store.get(keyC(pid))) || { entries: [] };
  normalizeProject(p);
  S.project = p; S.codex = c; S.texts = new Map();
  S.sel = p.sel && p.nodes[p.sel] ? p.sel : null; S.active = null; S.codexSel = null;
  S.mode = p.mode || "write";
  reindex();
  S.sessionStart = projectWords();
  lsSet("last", pid);
}
function normalizeProject(p) {
  p.nodes = p.nodes || {}; p.root = p.root || []; p.threads = p.threads || []; p.history = p.history || {}; p.trash = p.trash || [];
  p.goal = { words: FORMS[p.form].target, daily: FORMS[p.form].daily, deadline: "", ...(p.goal || {}) };
  p.sprints = p.sprints || [];
  for (const n of Object.values(p.nodes)) { n.threads = n.threads || []; if (n.type !== "scene") n.children = n.children || []; if (n.include === undefined) n.include = true; }
}
function flushAll() {
  saveProjectSoon.flush(); saveCodexSoon.flush(); saveMetaSoon.flush();
  if (typeof Editor !== "undefined") Editor.flush();
}

async function getText(nid) {
  if (S.texts.has(nid)) return S.texts.get(nid);
  const t = (await Store.get(keyT(P().id, nid))) || "";
  S.texts.set(nid, t); return t;
}
async function loadAllTexts() {
  const ids = Object.values(P().nodes).filter(n => n.type === "scene").map(n => n.id).filter(id => !S.texts.has(id));
  for (let i = 0; i < ids.length; i += 24) await Promise.all(ids.slice(i, i + 24).map(getText));
}
function putText(nid, html) {
  S.texts.set(nid, html);
  Store.put(keyT(P().id, nid), html);
}
/* Record a change in a scene's length: cached word count + today's ledger. */
function setSceneWords(nid, words) {
  const n = node(nid); if (!n) return 0;
  const delta = words - (n.words || 0);
  if (!delta) return 0;
  n.words = words;
  const d = dayKey(); P().history[d] = (P().history[d] || 0) + delta;
  reindex(); saveProjectSoon();
  return delta;
}

/* ── Snapshots ── */
async function getSnaps(nid) { return (await Store.get(keyS(P().id, nid))) || []; }
async function takeSnapshot(nid, label = "", force = false) {
  const html = await getText(nid);
  const list = await getSnaps(nid);
  if (!force && list.length && list[0].html === html) return false;
  if (!html.trim() && !force) return false;
  list.unshift({ t: now(), html, words: wordsOfHtml(html), label });
  while (list.length > 30) list.pop();
  Store.put(keyS(P().id, nid), list);
  node(nid).lastSnap = now();
  return true;
}
/* A safety snapshot the first time a scene is touched each day. */
async function dailySnapshot(nid) {
  const n = node(nid); if (!n) return;
  if (n.lastSnap && dayKey(new Date(n.lastSnap)) === dayKey()) return;
  n.lastSnap = now();
  await takeSnapshot(nid, "Start of day");
}

/* ── Tree edits ── */
function insertAt(id, parentId, index) {
  const arr = childrenOf(parentId);
  arr.splice(index < 0 || index > arr.length ? arr.length : index, 0, id);
}
function detach(id) {
  const par = IX.parent[id] ?? null;
  const arr = childrenOf(par); const i = arr.indexOf(id);
  if (i >= 0) arr.splice(i, 1);
  return { par, i };
}
function canNest(childType, parentId) {
  if (!parentId) return true;
  const pn = node(parentId); return !!pn && pn.type !== "scene" && RANK[pn.type] > RANK[childType];
}
function moveNode(id, targetId, where) {
  if (id === targetId) return false;
  const n = node(id), t = node(targetId); if (!n || !t) return false;
  if (ancestors(targetId).includes(id)) return false;
  let par, idx;
  if (where === "inside") { if (!canNest(n.type, targetId)) return false; par = targetId; idx = -1; }
  else { par = IX.parent[targetId] ?? null; if (!canNest(n.type, par)) return false; }
  detach(id); reindex();
  if (where !== "inside") { const arr = childrenOf(par); idx = arr.indexOf(targetId) + (where === "after" ? 1 : 0); }
  insertAt(id, par, idx); touch();
  return true;
}
function moveIntoEnd(id, parentId) {
  const n = node(id); if (!n || !canNest(n.type, parentId) || id === parentId || (parentId && ancestors(parentId).includes(id))) return false;
  detach(id); reindex(); insertAt(id, parentId, -1); touch(); return true;
}
function nudge(id, dir) {
  const par = IX.parent[id] ?? null; const arr = childrenOf(par); const i = arr.indexOf(id), j = i + dir;
  if (i < 0 || j < 0 || j >= arr.length) return false;
  [arr[i], arr[j]] = [arr[j], arr[i]]; touch(); return true;
}
/* Add a node where a writer expects it, relative to the current selection. */
function addNode(type, refId = S.sel, title) {
  const p = P();
  const ref = refId && node(refId);
  let par = null, idx = -1;
  if (type === "scene") {
    if (ref && ref.type === "scene") { par = IX.parent[ref.id] ?? null; idx = childrenOf(par).indexOf(ref.id) + 1; }
    else if (ref && ref.type === "chapter") { par = ref.id; }
    else if (ref && ref.type === "part") { const chs = ref.children.filter(c => node(c) && node(c).type === "chapter"); par = chs.length ? chs[chs.length - 1] : ref.id; }
    else if (p.form !== "short" && IX.chapters.length) par = IX.chapters[IX.chapters.length - 1];
  } else if (type === "chapter") {
    const ch = ref ? (ref.type === "chapter" ? ref.id : ref.type === "scene" ? chapterOf(ref.id) : null) : null;
    if (ch) { par = IX.parent[ch] ?? null; idx = childrenOf(par).indexOf(ch) + 1; }
    else if (ref && ref.type === "part") par = ref.id;
    else if (ref && ref.type === "scene") { par = IX.parent[ref.id] ?? null; if (par && node(par).type !== "part") par = null; }
    else { const parts = p.root.filter(r => node(r) && node(r).type === "part"); if (parts.length) par = parts[parts.length - 1]; }
  } else if (type === "part") {
    const top = ref ? [ref.id, ...ancestors(ref.id)].find(x => node(x).type === "part") : null;
    if (top) idx = p.root.indexOf(top) + 1;
  }
  const n = mkNode(p, type, title || "", type === "chapter" && p.form === "serial" ? { release: "", published: false, target: FORMS.serial.episodeTarget || 0 } : {});
  if (!n.title) n.title = type === "scene" ? "Untitled scene" : "New " + labelOf(type).toLowerCase();
  insertAt(n.id, par, idx);
  if (type !== "scene" && !n.children.length && type === "chapter") {
    const s = mkNode(p, "scene", "Untitled scene"); n.children.push(s.id);
  }
  touch();
  return n;
}
function duplicateNode(id) {
  const p = P();
  const copy = src => {
    const n = node(src); const c = structuredClone(n); c.id = uid(); c.title = n.title + (src === id ? " (copy)" : ""); c.lastSnap = 0;
    p.nodes[c.id] = c;
    if (n.type === "scene") { const t = S.texts.get(src); if (t != null) putText(c.id, t); else getText(src).then(tx => putText(c.id, tx)); }
    else c.children = n.children.map(copy);
    return c.id;
  };
  const par = IX.parent[id] ?? null; const nid = copy(id);
  insertAt(nid, par, childrenOf(par).indexOf(id) + 1);
  const d = dayKey(); // a duplicate is not writing: keep today's ledger honest
  reindex(); P().history[d] = (P().history[d] || 0); touch();
  return nid;
}
function trashNode(id) {
  const n = node(id); if (!n) return;
  const { par, i } = detach(id);
  P().trash.unshift({ id, parent: par, index: i, t: now(), title: n.title, type: n.type });
  if (S.sel === id || ancestors(S.sel || "").includes(id)) S.sel = par;
  touch();
}
function restoreTrash(ti) {
  const item = P().trash[ti]; if (!item) return;
  P().trash.splice(ti, 1);
  const par = item.parent && node(item.parent) && !P().trash.some(t => t.id === item.parent) ? item.parent : null;
  insertAt(item.id, par, item.index); touch();
}
function purgeTrash() {
  const p = P();
  const kill = id => { const n = p.nodes[id]; if (!n) return; if (n.children) n.children.forEach(kill); if (n.type === "scene") { Store.del(keyT(p.id, id)); Store.del(keyS(p.id, id)); S.texts.delete(id); } delete p.nodes[id]; };
  p.trash.forEach(t => kill(t.id)); p.trash = []; touch();
}

/* ── New projects & structure templates ── */
const TEMPLATES = {
  blank: { name: "Blank page", forms: ["short", "novella", "novel", "serial"], note: "One chapter and an empty scene." },
  five: {
    name: "Five-scene arc", forms: ["short", "novella"], note: "Hook, complication, escalation, crisis, resolution.",
    flat: [["Hook", "Open on the moment the ordinary breaks. Who wants what, right now?"], ["Complication", "The first attempt meets resistance; the cost of wanting becomes visible."], ["Escalation", "Stakes rise and options narrow. Reveal what the protagonist has been avoiding."], ["Crisis", "The irreversible choice. What do they give up?"], ["Resolution", "Show the world, and the person, after the turn. Echo the first image."]],
  },
  three: {
    name: "Three acts", forms: ["novella", "novel"], note: "Setup, confrontation, resolution, with the classic turning points.",
    acts: [["Act I · Setup", [["Ordinary world", "The protagonist's life and lack before the story starts moving."], ["Inciting incident", "The event that makes the old life impossible to keep."], ["Debate", "Resistance, doubt and the first real cost."], ["Crossing the threshold", "A deliberate choice into the new situation."]]],
      ["Act II · Confrontation", [["Trials and allies", "Learning the rules of the new world; friends, rivals and enemies."], ["Midpoint reversal", "A false victory or false defeat that changes the goal."], ["The noose tightens", "Opposition regroups; inner flaws cost real ground."], ["Darkest hour", "Everything seems lost; the lesson comes clear."]]],
      ["Act III · Resolution", [["Climax", "The final confrontation, won with what was learned."], ["New equilibrium", "The world after. Mirror the opening image."]]]],
  },
  seven: {
    name: "Seven-point", forms: ["novella", "novel", "serial"], note: "Plan from the ending back: hook to resolution through two pinches.",
    chapters: [["Hook", "Start in the opposite state of the resolution."], ["Plot turn one", "New idea or conflict that sets the story in motion."], ["Pinch one", "Pressure from the antagonist forces action."], ["Midpoint", "The protagonist moves from reacting to acting."], ["Pinch two", "Things fall apart; the mentor or plan fails."], ["Plot turn two", "The final piece the protagonist needs is found."], ["Resolution", "The climax delivers the change promised by the hook."]],
  },
  journey: {
    name: "The hero's journey", forms: ["novel", "serial"], note: "Twelve stages of departure, initiation and return.",
    acts: [["Departure", [["The ordinary world", "Home, and what is missing from it."], ["The call", "A summons, a threat, a door."], ["Refusal", "Fear, duty or doubt holds them back."], ["The mentor", "Counsel, a gift or a warning."], ["The first threshold", "Into the unknown country."]]],
      ["Initiation", [["Tests, allies, enemies", "Learning the rules of the other world."], ["The approach", "Preparing for the central ordeal."], ["The ordeal", "Death and rebirth, literal or not."], ["The reward", "The sword, the elixir, the knowledge."]]],
      ["Return", [["The road back", "Consequences give chase."], ["Resurrection", "The final test, using everything."], ["Return with the elixir", "Home, changed, with something to give."]]]],
  },
  kisho: {
    name: "Kishōtenketsu", forms: ["short", "novella", "novel"], note: "Four movements, built on contrast rather than conflict.",
    chapters: [["Ki · Introduction", "Characters and setting at rest."], ["Shō · Development", "Deepen what was introduced, without a twist yet."], ["Ten · Twist", "An unexpected element recasts everything."], ["Ketsu · Reconciliation", "Bring the two halves into a new harmony."]],
  },
  season: {
    name: "Serial season", forms: ["serial"], note: "One arc of six episodes, each with a cold open and a cliffhanger.",
    season: 6,
  },
};
function newProject({ title, author, form, template, target }) {
  const p = { id: uid(), v: 1, title: title || "Untitled", subtitle: "", author: author || "", form, created: now(), updated: now(),
    goal: { words: target || FORMS[form].target, daily: FORMS[form].daily, deadline: "" }, nodes: {}, root: [], threads: [], history: {}, trash: [], sprints: [], mode: "write" };
  const T = TEMPLATES[template] || TEMPLATES.blank;
  const sc = (t, syn, extra) => mkNode(p, "scene", t, { synopsis: syn || "", status: syn ? "outline" : "seed", ...extra });
  const ch = (t, syn, kids, extra = {}) => { const c = mkNode(p, "chapter", t, { synopsis: syn || "", ...extra }); (kids || []).forEach(k => c.children.push(k.id)); return c; };
  if (T.flat) {
    if (form === "short") T.flat.forEach(([t, s]) => p.root.push(sc(t, s).id));
    else T.flat.forEach(([t, s]) => p.root.push(ch(t, s, [sc(t, s)]).id));
  } else if (T.acts) {
    T.acts.forEach(([name, beats]) => {
      const part = mkNode(p, "part", name);
      beats.forEach(([t, s]) => part.children.push(ch(t, s, [sc(t, s)], form === "serial" ? { release: "", published: false, target: FORMS.serial.episodeTarget } : {}).id));
      p.root.push(part.id);
    });
  } else if (T.chapters) {
    T.chapters.forEach(([t, s]) => {
      const c = ch(t, s, [sc(t, s)], form === "serial" ? { release: "", published: false, target: FORMS.serial.episodeTarget } : {});
      if (form === "short") { p.root.push(c.children[0]); delete p.nodes[c.id]; } else p.root.push(c.id);
    });
  } else if (T.season) {
    const arc = mkNode(p, "part", "Arc one");
    for (let i = 1; i <= T.season; i++) {
      const e = ch("Episode " + numberWords(i).toLowerCase(), i === 1 ? "Pilot: establish the world, the want and the first question." : i === T.season ? "Season finale: answer the arc question, open the next." : "", [
        sc("Cold open", "Start mid-motion; a question the episode must answer."), sc("Complication", ""), sc("Cliffhanger", "End on a turn that pulls the reader to the next installment."),
      ], { release: "", published: false, target: FORMS.serial.episodeTarget });
      arc.children.push(e.id);
    }
    p.root.push(arc.id);
    p.threads.push({ id: uid(), name: "Arc question", color: THREAD_COLORS[0] });
  } else {
    if (form === "short") p.root.push(sc("Opening", "").id);
    else p.root.push(ch(form === "serial" ? "Episode one" : "Chapter one", "", [sc("Opening", "")], form === "serial" ? { release: "", published: false, target: FORMS.serial.episodeTarget } : {}).id);
  }
  return p;
}

/* ── The sample tome (original; clearly marked as a sample) ── */
function sampleProject() {
  const p = newProject({ title: "The Tidewright's Lantern", author: "Sample", form: "novel", template: "blank", target: 90000 });
  p.sample = true; p.subtitle = "A sample tome to explore. Delete it whenever you like.";
  p.nodes = {}; p.root = [];
  const T1 = { id: uid(), name: "The fourth star", color: THREAD_COLORS[1] }, T2 = { id: uid(), name: "Wren's oath", color: THREAD_COLORS[0] }, T3 = { id: uid(), name: "The Starwrights", color: THREAD_COLORS[2] };
  p.threads = [T1, T2, T3];
  const part = mkNode(p, "part", "The Counting"); p.root.push(part.id);
  const c1 = mkNode(p, "chapter", "Ledger of the Dead", { synopsis: "Wren discovers a star where none should be." });
  const c2 = mkNode(p, "chapter", "Salt and Brass", { synopsis: "A stranger arrives who already knows what Wren saw." });
  const c3 = mkNode(p, "chapter", "The Debt of Light", { synopsis: "What starlight costs, and who has been paying." });
  part.children.push(c1.id, c2.id, c3.id);
  const s = (ch, title, syn, status, threads, extra = {}) => { const n = mkNode(p, "scene", title, { synopsis: syn, status, threads: threads.map(t => t.id), ...extra }); ch.children.push(n.id); return n; };
  const a = s(c1, "The keeper counts", "Wren's nightly tally; the Hunter wears four stars instead of three.", "draft", [T1, T2], { pov: "Wren Halloway", place: "Ossery Light", when: "Night 1, low tide", target: 2500 });
  const b = s(c1, "The ledger lies", "Older entries have been scraped and rewritten. Someone has hidden a pattern.", "outline", [T1], { pov: "Wren Halloway", place: "Ossery Light", target: 2000 });
  const c = s(c2, "A visitor with salt in her hair", "Ilse Varro rows in through a sea that should be too far out to row.", "outline", [T3], { pov: "Wren Halloway", place: "The shingle", when: "Night 2", target: 2500 });
  s(c2, "Terms of passage", "Ilse offers Wren a way off the island, for a price measured in light.", "seed", [T2, T3], { pov: "Wren Halloway", target: 2500 });
  s(c3, "What the reckoning-glass remembers", "", "seed", [T1], { target: 3000 });
  const textA = [
    "Every night the tide on Ossery pulled the sea a little farther from the lighthouse, and every night Wren Halloway climbed the two hundred and twelve steps to count the stars that had gone out.",
    "She kept the tally in a ledger bound in eelskin. Forty-one keepers had written there before her, in inks that had faded from black to the colour of weak tea, and the columns told the same story in every hand: fewer lights each year, the sky thinning like an old coat.",
    "Tonight the lantern room smelled of brass polish and cold. She set her eye to the reckoning-glass, turned the rete until its pointers sat on the Hunter’s belt, and stopped breathing.",
    "Three stars. The Hunter had worn three stars in his belt for as long as there had been ledgers.",
    "<em>Now there were four.</em>",
  ];
  const textB = [
    "She did not sleep. At first light she carried the ledger down to the kitchen and opened it under the window, where the salt-glass made everything look underwater.",
    "The pages for the winter of the long storms were thinner than the rest. Held to the light, they showed the ghost of other numbers beneath the ink — a column scraped away and written over in a careful, borrowed hand.",
  ];
  p._texts = { [a.id]: textA.map(t => "<p>" + t + "</p>").join(""), [b.id]: textB.map(t => "<p>" + t + "</p>").join("") };
  a.words = wordsOfHtml(p._texts[a.id]); b.words = wordsOfHtml(p._texts[b.id]);
  void c;
  const codex = { entries: [
    { id: uid(), cat: "character", name: "Wren Halloway", aliases: "Wren, the keeper", summary: "Keeper of Ossery Light. Counts the dying stars.", fields: [["Age", "34"], ["Wants", "To leave the island without breaking the oath"], ["Fears", "That the counting means nothing"]], body: "Forty-second keeper of the Light. Inherited the post from her aunt, along with the oath never to leave the lantern unwatched between dusk and dawn." },
    { id: uid(), cat: "character", name: "Ilse Varro", aliases: "Ilse, the Varro woman", summary: "A Starwright who arrives by sea.", fields: [["Allegiance", "The Starwrights, maybe"]], body: "Knows the names of stars no ledger has recorded." },
    { id: uid(), cat: "place", name: "Ossery", aliases: "Ossery Light, the island", summary: "A tidal island whose sea retreats a little farther every night.", fields: [["Steps to the lantern", "212"]], body: "" },
    { id: uid(), cat: "tech", name: "Reckoning-glass", aliases: "the glass, rete", summary: "A brass star-sighting instrument in the lantern room.", fields: [], body: "Part telescope, part astrolabe. Its rete is engraved with stars that no longer shine." },
    { id: uid(), cat: "lore", name: "Light-debt", aliases: "starlight debt", summary: "Magic is paid for in starlight. Every working dims a star somewhere.", fields: [["Cost", "One star-year per working, roughly"], ["Who pays", "Whoever holds the debt"]], body: "The rule the whole world rests on, and the reason the sky is thinning." },
    { id: uid(), cat: "faction", name: "The Starwrights", aliases: "Starwrights, wrights", summary: "A guild that claims to make new stars.", fields: [], body: "" },
  ] };
  p.history[dayKey()] = 0;
  return { p, codex };
}

/* ── Sanitizing & converting prose ── */
const BLOCK_RE = /^(P|DIV|H[1-6]|BLOCKQUOTE|LI|UL|OL|SECTION|ARTICLE|PRE|HEADER|FOOTER|TABLE|TR|TD|FIGURE)$/;
function sanitizeProse(html) {
  const t = document.createElement("template"); t.innerHTML = html || "";
  const blocks = []; let cur = null;
  const flush = () => { if (cur !== null) { const c = cur.replace(/^(\s|<br>)+|(\s|<br>)+$/g, ""); blocks.push(c ? "<p>" + c + "</p>" : "<p><br></p>"); cur = null; } };
  const inline = n => {
    if (n.nodeType === 3) return esc(n.nodeValue.replace(/ /g, " "));
    if (n.nodeType !== 1) return "";
    const tag = n.tagName;
    if (tag === "BR") return "<br>";
    if (tag === "HR") return "";
    let inner = ""; n.childNodes.forEach(c => inner += inline(c));
    const st = n.getAttribute && (n.getAttribute("style") || "");
    if (tag === "B" || tag === "STRONG" || /font-weight:\s*(bold|[6-9]00)/.test(st)) return inner.trim() ? "<strong>" + inner + "</strong>" : inner;
    if (tag === "I" || tag === "EM" || tag === "CITE" || /font-style:\s*italic/.test(st)) return inner.trim() ? "<em>" + inner + "</em>" : inner;
    return inner;
  };
  const hasBlock = n => [...n.childNodes].some(c => c.nodeType === 1 && (BLOCK_RE.test(c.tagName) || c.tagName === "HR"));
  const walk = n => n.childNodes.forEach(c => {
    if (c.nodeType === 1 && c.tagName === "HR") { flush(); blocks.push("<hr>"); }
    else if (c.nodeType === 1 && BLOCK_RE.test(c.tagName)) {
      flush();
      if (hasBlock(c)) { walk(c); flush(); }
      else { cur = inline(c); flush(); }
    } else if (c.nodeType === 3 && cur === null && !c.nodeValue.trim()) { /* whitespace between blocks */ }
    else cur = (cur || "") + inline(c);
  });
  walk(t.content); flush();
  return blocks.join("").replace(/<\/strong><strong>|<\/em><em>/g, "");
}
/* Block model used by every exporter. */
function proseBlocks(html) {
  const t = document.createElement("template"); t.innerHTML = html || "";
  const out = [];
  const md = n => {
    if (n.nodeType === 3) return n.nodeValue;
    if (n.nodeType !== 1) return "";
    let inner = ""; n.childNodes.forEach(c => inner += md(c));
    if (n.tagName === "BR") return "\n";
    if (n.tagName === "STRONG" || n.tagName === "B") return "**" + inner + "**";
    if (n.tagName === "EM" || n.tagName === "I") return "*" + inner + "*";
    return inner;
  };
  t.content.childNodes.forEach(c => {
    if (c.nodeType === 1 && c.tagName === "HR") out.push({ hr: true });
    else if (c.nodeType === 1) { const text = c.textContent.replace(/ /g, " "); if (text.trim()) out.push({ text, md: md(c), html: c.innerHTML }); }
  });
  return out;
}
function mdInline(s) {
  return esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*(?!\s)(.+?)\*(?!\*)/g, "$1<em>$2</em>").replace(/(^|\W)_(?!\s)(.+?)_(?=\W|$)/g, "$1<em>$2</em>");
}
/* Turn a Markdown or plain-text manuscript into a project. */
function projectFromText(text, filename) {
  const lines = String(text).replace(/\r\n?/g, "\n").split("\n");
  const titleLine = lines.find(l => /^#\s+/.test(l));
  const hasCh = lines.some(l => /^##\s+/.test(l)) || lines.filter(l => /^#\s+/.test(l)).length > 1;
  const p = newProject({ title: (filename || "Imported manuscript").replace(/\.(md|markdown|txt)$/i, ""), form: hasCh ? "novel" : "short", template: "blank" });
  p.nodes = {}; p.root = []; const texts = {};
  let chap = null, scene = null, buf = [];
  const useH1asChapters = !lines.some(l => /^##\s+/.test(l));
  const flushPara = () => { if (!buf.length) return; const t = buf.join(" ").trim(); buf = []; if (!t) return; ensureScene(); texts[scene.id] = (texts[scene.id] || "") + "<p>" + mdInline(t) + "</p>"; };
  const ensureScene = (title) => {
    if (scene && !title) return;
    scene = mkNode(p, "scene", title || "Scene " + ((chap ? chap.children.length : p.root.length) + 1), { status: "draft" });
    if (p.form === "short") p.root.push(scene.id);
    else { if (!chap) { chap = mkNode(p, "chapter", "Chapter one"); p.root.push(chap.id); } chap.children.push(scene.id); }
  };
  const singleNewlineParas = !/\n\s*\n/.test(text);
  for (const raw of lines) {
    const l = raw.trimEnd();
    let m;
    if (!useH1asChapters && (m = l.match(/^#\s+(.*)/))) { flushPara(); if (!titleLine || l !== titleLine) continue; p.title = m[1].trim(); continue; }
    if ((m = l.match(/^(#{1,2})\s+(.*)/))) {
      flushPara();
      if (p.form === "short") { scene = null; ensureScene(m[2].trim()); continue; }
      chap = mkNode(p, "chapter", m[2].trim()); p.root.push(chap.id); scene = null; continue;
    }
    if ((m = l.match(/^###\s+(.*)/))) { flushPara(); scene = null; ensureScene(m[1].trim()); continue; }
    if (/^\s*(\*\s*\*\s*\*|#|~~~|—{3}|-{3,}|✦.*)\s*$/.test(l)) { flushPara(); scene = null; continue; }
    if (!l.trim()) { flushPara(); continue; }
    buf.push(l.trim());
    if (singleNewlineParas) flushPara();
  }
  flushPara();
  if (!p.root.length) ensureScene("Opening");
  for (const [id, html] of Object.entries(texts)) p.nodes[id].words = wordsOfHtml(html);
  p._texts = texts;
  return p;
}
