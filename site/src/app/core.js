/* ===== core: DOM helpers, state, randomness, hashing, routing ===== */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "text") el.textContent = v;
      else if (k === "value") el.value = v;
      else if (k === "checked") el.checked = !!v;
      else if (k === "style") el.style.cssText = v;
      else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : String(v));
    }
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid == null || kid === false) continue;
    el.append(kid instanceof Node ? kid : String(kid));
  }
  return el;
}
const frag = (...kids) => { const f = document.createDocumentFragment(); for (const k of kids.flat(Infinity)) if (k != null && k !== false) f.append(k instanceof Node ? k : String(k)); return f; };
const clear = (el) => { while (el.firstChild) el.removeChild(el.firstChild); return el; };
/* Append like h() does: conditional children (null, false) are skipped, never printed. */
function put(el, ...kids) {
  for (const k of kids.flat(Infinity)) if (k != null && k !== false) el.append(k instanceof Node ? k : String(k));
  return el;
}
const words = (s) => (String(s || "").trim().match(/\S+/g) || []).length;
const sentenceCount = (s) => (String(s || "").trim().match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || []).filter((x) => x.trim()).length;
const roman = (n) => ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"][n] || String(n);
const today = () => new Date().toISOString().slice(0, 10);
const stamp = () => new Date().toISOString().slice(0, 19);
const uid = () => Math.random().toString(36).slice(2, 9);
const mark = (src) => (src ? h("span", { class: "mark " + src[0], title: FRAMEWORK.sources[src[0]] || src }, src) : null);
const pill = (cls, text) => h("span", { class: "pill " + (cls || "") }, cls === "live" ? h("span", { class: "dot" }) : null, text);

/* ---------- State ---------- */
const STORE_KEY = "operative-mode.v1";

function blankMagic() {
  return {
    on: false, name: "", seed: "", boundary: "", baseline: "Earth physics", substrate: "", operation: "", invariants: "", prohibitions: "",
    arch: "Grammar", workings: [], common: "", vars: { Transference: 2, Prevalence: 2, Naturalness: 2, "Ease of Use": 2, Reliability: 3, Consistency: 3 },
    varNotes: {}, src: { locus: "internal", reserve: "renewable", renewal: "", depletion: "", terms: "", ledger: "" },
    flux: { sign: "0", driver: "", measure: "" }, domains: [], resources: [], staged: false, production: false,
    engine: JSON.parse(JSON.stringify(LATTICE.engine)), access: "", gate: "Metaphysical", combination: "", apex: "",
    iface: "none", ifaceAuth: "Authoritative", ifaceNote: "", signature: "", costs: "", consequences: "", countermeasures: "",
    disc: { open: 2, horizon: 3, orientation: "earned", resolution: "follows Mode Transparency", exposition: "None outside a Character's Lens.", delegation: false },
    lens: { holder: "the User's Character", hardness: 2, known: "", believed: "" },
    balance: { Omnipotence: "", Omniscience: "", Omnipresence: "", "Infinite wealth": "" },
    kernelPicks: [], codex: [], seal: null, authoredBy: "",
    price: { domain: "", area: 30, range: 10, duration: 120, mag: 1, targets: 1, mods: [], ambiguous: false, parity: false, rank: 5 },
  };
}

function blankState() {
  return {
    v: 1, example: null, ceremony: "Light", step: 0,
    picks: {}, romance: { Pace: "", Obstacle: "" }, featured: {}, menuLog: [],
    decl: { name: "", intent: "", basis: [], narrative: "", context: "", horizon: "", burden: "", aims: [], antiAims: "", marks: {} },
    baseline: "", baselineSrc: "",
    deltas: {},
    seats: { user: "", operator: "" }, authority: [],
    world: { setting: "", rules: "" },
    characters: [], clocks: [],
    constraints: { dials: [], boundaries: "", depiction: "", persistent: "" },
    capability: { notes: "" },
    election: { rule: "Threshold-and-Balance", reference: "", nullElection: false, signature: [], reasons: "", tradeoffs: "", uncertainty: "" },
    premortem: [{ story: "", family: "", counter: "", telltale: "" }, { story: "", family: "", counter: "", telltale: "" }, { story: "", family: "", counter: "", telltale: "" }],
    kernel: [], touchstone: "", budget: { min: "", max: "" }, handback: "",
    proving: { status: "none", turns: [] },
    assent: { user: false, operator: false, operatorText: "" },
    docket: [],
    active: null,
    magic: blankMagic(),
    play: { turns: [], draws: [], seals: [], ledger: [], stale: [], checkpoints: [], tier: "default", cp: { moment: "", now: "", pending: "", drift: "" } },
  };
}

/* The Light Mode Sheet's worked example, so the workshop opens in a realistic working state. */
function coldHarbour() {
  const s = blankState();
  s.example = "Cold Harbour";
  s.ceremony = "Light";
  s.decl = { name: "Cold Harbour", intent: "Two strangers on a stopped train, and whatever passes between them.", basis: ["Enactive"],
    narrative: "Latent", context: "Seeded", horizon: "one scene", burden: "Scene-bound", aims: ["Character exploration", "immersion"], antiAims: "",
    marks: { intent: "U", basis: "I", narrative: "I", horizon: "I", burden: "I", context: "I", aims: "I" } };
  s.baseline = "Tête-à-tête"; s.baselineSrc = "B";
  s.deltas = { Resistance: { value: 3, src: "O", force: "H", reason: "The conductor has a job and does not bend it for charm." } };
  s.seats = { user: "Character (Vess)", operator: "Character (the conductor), Shared-Context" };
  s.world = { setting: "A night train stopped in snow outside a harbour town.", rules: "Nothing happens to the train that neither Party caused." };
  s.characters = [{ id: uid(), name: "The conductor", archetype: "Grizzled Veteran", want: "To keep the carriage orderly until the line is cleared.",
    line: "He will not open the locked baggage car for a passenger.", price: "A reason that serves the train, not the passenger.",
    leverage: "He holds the keys and the timetable.", tell: "Checks his watch before he refuses.", diction: "plain, railway, courteous",
    rhythm: "Short sentences; finishes on the rule.", vtell: "Says \"I'm afraid\" before every no.", never: "Never says what is in the baggage car.",
    sample: "I'm afraid the doors stay shut until Holloway clears the line, miss." }];
  s.election = { rule: "Threshold-and-Balance", reference: "", nullElection: false,
    signature: [{ value: "Resistance 3", traces: "Intent: strangers, not friends", cost: "Slower warmth; the User has to earn each concession." }],
    reasons: "A conductor who folds in the first exchange makes the conversation weightless.", tradeoffs: "Less comfort early.", uncertainty: "" };
  s.premortem = [
    { story: "A stopped train invites long atmospheric turns, and each turn grows.", family: "Inflation", counter: "K3 and the Turn Budget", telltale: "Three turns in a row over 150 words." },
    { story: "The conductor warms to Vess because she is charming, not because anything met his Price.", family: "Accommodation", counter: "K2; the conductor's Stake Card", telltale: "A concession with no reason named." },
    { story: "The scene acquires a plot: a stowaway, a murder, a twist.", family: "Narrative Drift", counter: "K3; Narrative Organization Latent", telltale: "An event neither Party caused." },
  ];
  s.kernel = ["Never speak, act or feel for Vess; stop where Vess would answer.",
    "The conductor's rule-keeping yields only to a reason that meets his Price.",
    "Nothing happens to the train that neither of us caused."];
  s.budget = { min: 30, max: 150 }; s.handback = "Exchange";
  s.capability.notes = "Cannot keep a secret across a context break; if we run long, I will checkpoint openly.";
  return s;
}

function migrate(s) {
  const b = blankState();
  const out = Object.assign(b, s);
  out.magic = Object.assign(blankMagic(), s.magic || {});
  out.magic.engine = Object.assign(JSON.parse(JSON.stringify(LATTICE.engine)), (s.magic || {}).engine || {});
  out.play = Object.assign(b.play, s.play || {});
  out.decl = Object.assign(b.decl, s.decl || {});
  return out;
}

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return migrate(JSON.parse(raw));
  } catch (e) { /* storage unavailable: the page still works for this visit */ }
  return null;
}

let S = load() || coldHarbour();
let saveTimer = null;
function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
  }, 250);
}

function getPath(obj, path) { return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj); }
function setPath(obj, path, value) {
  const keys = path.split(".");
  let o = obj;
  for (let i = 0; i < keys.length - 1; i++) { if (o[keys[i]] == null) o[keys[i]] = {}; o = o[keys[i]]; }
  o[keys[keys.length - 1]] = value;
}

/* Live refresh: views register small updaters for derived displays, so typing never re-renders the form. */
const LIVE = [];
function live(fn) { LIVE.push(fn); fn(); return fn; }
function changed() {
  persist();
  for (const fn of LIVE.slice()) { try { fn(); } catch (e) { console.error(e); } }
  renderModeChip();
}
function resetLive() { LIVE.length = 0; }

/* Bound controls */
function field(label, control, hint) {
  return h("label", { class: "field" }, h("span", null, label), control, hint ? h("span", { class: "field-hint" }, hint) : null);
}
function bindInput(path, attrs = {}, onSet) {
  const el = h("input", Object.assign({ type: "text", value: getPath(S, path) ?? "" }, attrs));
  el.addEventListener("input", () => {
    const v = attrs.type === "number" ? (el.value === "" ? "" : Number(el.value)) : el.value;
    setPath(S, path, v); if (onSet) onSet(v); changed();
  });
  return el;
}
function bindArea(path, attrs = {}, onSet) {
  const el = h("textarea", Object.assign({}, attrs));
  el.value = getPath(S, path) ?? "";
  el.addEventListener("input", () => { setPath(S, path, el.value); if (onSet) onSet(el.value); changed(); });
  return el;
}
function bindSelect(path, options, attrs = {}, onSet) {
  const cur = getPath(S, path) ?? "";
  const el = h("select", attrs, options.map((o) => {
    const [v, t] = Array.isArray(o) ? o : [o, o];
    return h("option", { value: v, selected: String(v) === String(cur) ? true : null }, t);
  }));
  el.addEventListener("change", () => { setPath(S, path, el.value); if (onSet) onSet(el.value); changed(); });
  return el;
}
function seg(options, current, onPick, label) {
  return h("div", { class: "seg", role: "group", "aria-label": label || null }, options.map((o) => {
    const [v, t] = Array.isArray(o) ? o : [o, o];
    return h("button", { type: "button", "aria-pressed": String(String(v) === String(current)), onclick: () => onPick(v) }, t);
  }));
}
function counter(fn) {
  const el = h("span", { class: "counter" });
  live(() => { const [text, cls] = fn(); el.textContent = text; el.className = "counter " + (cls || ""); });
  return el;
}

/* ---------- Randomness: real draws from the browser's entropy source (§15.9 Tool Draw) ---------- */
function randBelow(n) {
  const limit = Math.floor(0x100000000 / n) * n;
  const buf = new Uint32Array(1);
  let x;
  do { crypto.getRandomValues(buf); x = buf[0]; } while (x >= limit);
  return x % n;
}
function sampleN(options, n) {
  const pool = Array.from(new Set(options));
  const out = [];
  for (let i = 0; i < Math.min(n, pool.length); i++) out.push(pool.splice(randBelow(pool.length), 1)[0]);
  return out;
}
function randHex(bytes) {
  const b = new Uint8Array(bytes);
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
}
const LADDER = Object.fromEntries(FRAMEWORK.ladder.map(([k, v]) => [k, v]));
function bandFor(r, t) {
  if (r <= t / 2) return 0;
  if (r <= t) return 1;
  if (r <= (t + 100) / 2) return 2;
  return 3;
}
/* The same procedure as scripts/draw.py. */
function toolDraw(odds, oracle) {
  const t = typeof odds === "number" ? odds : LADDER[odds];
  const rung = FRAMEWORK.ladder.find(([, v]) => v === t)?.[0] || "custom";
  let r = null, idx;
  if (t === 0 || t === 100) idx = t === 100 ? 0 : 3;
  else { r = randBelow(100) + 1; idx = bandFor(r, t); }
  const label = (oracle ? FRAMEWORK.oracle : FRAMEWORK.bands)[idx];
  const line = `${rung.toLowerCase()} (${t}) | ${r == null ? "no draw (certain or impossible)" : "d100 = " + r} | ${label}`;
  return { rung, t, r, idx, label, oracle: !!oracle, line, at: stamp(), source: "Tool Draw (browser crypto.getRandomValues)" };
}

/* ---------- SHA-256: WebCrypto where available, a small pure implementation otherwise ---------- */
function sha256Pure(str) {
  const K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
  const bytes = Array.from(new TextEncoder().encode(str));
  const bitLen = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (let i = 7; i >= 0; i--) bytes.push(Math.floor(bitLen / 2 ** (8 * i)) & 0xff);
  const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  const W = new Array(64);
  for (let off = 0; off < bytes.length; off += 64) {
    for (let i = 0; i < 16; i++) W[i] = (bytes[off + 4 * i] << 24) | (bytes[off + 4 * i + 1] << 16) | (bytes[off + 4 * i + 2] << 8) | bytes[off + 4 * i + 3];
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(W[i - 15], 7) ^ rotr(W[i - 15], 18) ^ (W[i - 15] >>> 3);
      const s1 = rotr(W[i - 2], 17) ^ rotr(W[i - 2], 19) ^ (W[i - 2] >>> 10);
      W[i] = (W[i - 16] + s0 + W[i - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, hh] = H;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (hh + S1 + ch + K[i] + W[i]) | 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) | 0;
      hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
    }
    H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
    H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + hh) | 0;
  }
  return H.map((x) => (x >>> 0).toString(16).padStart(8, "0")).join("");
}
async function sha256(str) {
  try {
    if (crypto.subtle) {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
      return Array.from(new Uint8Array(buf), (x) => x.toString(16).padStart(2, "0")).join("");
    }
  } catch (e) { /* fall through */ }
  return sha256Pure(str);
}
/* The same scheme as scripts/seal.py: sha256(nonce_hex + "|" + plaintext), with a 32-byte nonce. */
async function makeSeal(id, plaintext) {
  const nonce = randHex(32);
  const digest = await sha256(nonce + "|" + plaintext);
  return { id, nonce, plaintext, sha256: digest, at: stamp(), revealed: false };
}

/* ---------- Runtime capabilities (only inside a Claude viewer; absent elsewhere) ---------- */
const CAP = { sample: null, downloads: null, tools: false, checked: false };
const capWatchers = [];
function onCaps(fn) { capWatchers.push(fn); }
function initCaps() {
  const c = window.claude;
  if (!c || typeof c.use !== "function") { CAP.checked = true; return; }
  c.use("sample").then(async (s) => {
    CAP.sample = s || null;
    if (s && typeof s.limits === "function") {
      try { const lim = await s.limits(); CAP.tools = !!(lim && lim.tools); } catch (e) { CAP.tools = false; }
    }
    CAP.checked = true;
    capWatchers.forEach((fn) => fn());
  }).catch(() => { CAP.checked = true; });
  c.use("downloads").then((d) => { CAP.downloads = d || null; }).catch(() => {});
}

/* ---------- Copy, save, toast ---------- */
let toastTimer = null;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("on"), 2400);
}
function copyText(text, label) {
  const done = () => toast((label || "Text") + " copied");
  const fallback = () => {
    const ta = h("textarea", { style: "position:fixed;left:-9999px;top:0;opacity:0" });
    ta.value = text;
    document.body.append(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    ta.remove();
    if (ok) done(); else toast("Copy was blocked here. Select the text and copy it by hand.");
  };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
  else fallback();
}
async function saveFile(filename, text) {
  if (CAP.downloads) {
    try { await CAP.downloads.save({ filename, data: text }); toast("Saved " + filename); }
    catch (e) { if (e && e.code !== "declined") toast("This view cannot save files. Use Copy instead."); }
    return;
  }
  try {
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const a = h("a", { href: url, download: filename, style: "display:none" });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  } catch (e) { toast("Saving is blocked here. Use Copy instead."); }
}
function docActions(name, getText, filename) {
  return h("div", { class: "row tight" },
    h("button", { type: "button", class: "btn sm", onclick: () => copyText(getText(), name) }, "Copy"),
    h("button", { type: "button", class: "btn sm", onclick: () => saveFile(filename, getText()) }, "Save .", filename.split(".").pop()));
}

/* ---------- Router ---------- */
const VIEWS = ["threshold", "play-menu", "magic-menu", "deploy", "table", "codex"];
const RENDER = {};
let currentView = "threshold";
function show(view) {
  if (!VIEWS.includes(view)) view = "threshold";
  currentView = view;
  resetLive();
  for (const sec of $$("main > .view")) sec.hidden = sec.dataset.view !== view;
  for (const a of $$(".chambers a")) {
    if (a.dataset.view === view) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  }
  if (RENDER[view]) RENDER[view]();
  renderModeChip();
}
function go(view) {
  if (location.hash.slice(1) === view) show(view);
  else location.hash = view;
  window.scrollTo({ top: 0 });
}
