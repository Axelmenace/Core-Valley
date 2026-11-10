/* ── core: helpers, constants, ornament, sky ───────────────────────────── */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const uid = () => Date.now().toString(36).slice(-6) + Math.random().toString(36).slice(2, 7);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const pad2 = n => String(n).padStart(2, "0");
const now = () => Date.now();
function debounce(fn, ms) {
  let t = null, args = null;
  const d = (...a) => { args = a; clearTimeout(t); t = setTimeout(() => { t = null; fn(...args); }, ms); };
  d.flush = () => { if (t) { clearTimeout(t); t = null; fn(...args); } };
  d.pending = () => !!t;
  d.cancel = () => { clearTimeout(t); t = null; };
  return d;
}
function throttle(fn, ms) {
  let last = 0, t = null;
  return (...a) => {
    const n = Date.now(), wait = ms - (n - last);
    if (wait <= 0) { last = n; fn(...a); }
    else { clearTimeout(t); t = setTimeout(() => { last = Date.now(); fn(...a); }, wait); }
  };
}
const dayKey = (d = new Date()) => d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
const parseDay = k => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
const daysBetween = (a, b) => Math.round((parseDay(b) - parseDay(a)) / 86400000);
function fmtN(n) {
  n = Math.round(n || 0);
  const a = Math.abs(n);
  if (a >= 100000) return (n / 1000).toFixed(0) + "k";
  if (a >= 10000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toLocaleString("en-US");
}
const fmtFull = n => Math.round(n || 0).toLocaleString("en-US");
function roman(n) {
  const m = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let s = ""; for (const [v, r] of m) while (n >= v) { s += r; n -= v; } return s;
}
function numberWords(n) {
  const a = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const t = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  if (n < 20) return a[n];
  if (n < 100) return t[Math.floor(n / 10)] + (n % 10 ? "-" + a[n % 10] : "");
  return String(n);
}
function ago(ts) {
  if (!ts) return "never";
  const s = Math.round((Date.now() - ts) / 1000);
  if (s < 45) return "just now";
  if (s < 3600) return Math.round(s / 60) + " min ago";
  if (s < 86400) return Math.round(s / 3600) + " h ago";
  const d = Math.round(s / 86400);
  if (d < 14) return d + (d === 1 ? " day ago" : " days ago");
  return new Date(ts).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}
const stamp = ts => new Date(ts).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const WORD_RE = /[\p{L}\p{N}][\p{L}\p{N}'’\-]*/gu;
const countWords = text => (String(text || "").match(WORD_RE) || []).length;
function decodeEntities(s) {
  return s.replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}
const htmlToText = html => decodeEntities(String(html || "").replace(/<\/p>|<br\s*\/?>|<hr\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")).replace(/\n{3,}/g, "\n\n").trim();
const wordsOfHtml = html => countWords(decodeEntities(String(html || "").replace(/<[^>]+>/g, " ")));
const lsGet = (k, d) => { try { const v = localStorage.getItem("astrolabe:" + k); return v == null ? d : JSON.parse(v); } catch { return d; } };
const lsSet = (k, v) => { try { localStorage.setItem("astrolabe:" + k, JSON.stringify(v)); } catch { /* storage blocked */ } };
const reduceMotion = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── Story forms, statuses, codex categories ── */
const FORMS = {
  short:   { name: "Short story", part: "Movement", chapter: "Section", target: 6000,   daily: 500,  range: "1,000 – 7,500 words",  blurb: "One sitting, one turn. Scenes, with optional sections." },
  novella: { name: "Novella",     part: "Part",     chapter: "Chapter", target: 32000,  daily: 750,  range: "17,500 – 40,000 words", blurb: "A single thread pulled taut. Chapters and scenes." },
  novel:   { name: "Novel",       part: "Part",     chapter: "Chapter", target: 90000,  daily: 1000, range: "40,000 words and up",   blurb: "The full voyage. Parts, chapters, scenes and subplots." },
  serial:  { name: "Serial",      part: "Arc",      chapter: "Episode", target: 120000, daily: 1000, range: "Installments, released over time", blurb: "Arcs and episodes with release dates and per-episode targets." },
};
const STATUSES = [["seed", "Seed"], ["outline", "Outlined"], ["draft", "Drafting"], ["revised", "Revised"], ["final", "Final"]];
const STATUS_IX = Object.fromEntries(STATUSES.map(([k], i) => [k, i]));
const statusName = k => (STATUSES.find(s => s[0] === k) || STATUSES[0])[1];
const CODEX_CATS = [
  ["character", "Characters", "◈"], ["place", "Places", "⬡"], ["faction", "Factions", "☍"], ["lore", "Lore & Magic", "✶"],
  ["tech", "Tech & Artifacts", "⌬"], ["creature", "Creatures", "◬"], ["event", "Events", "⧗"], ["note", "Notes", "✎"],
];
const catGlyph = k => (CODEX_CATS.find(c => c[0] === k) || CODEX_CATS[7])[2];
const catName = k => (CODEX_CATS.find(c => c[0] === k) || CODEX_CATS[7])[1];
const THREAD_COLORS = ["#d8ac5d", "#6fd6da", "#e57a8a", "#9b8cf0", "#7fcf8d", "#f09a5b", "#5aa0e8", "#d97fd0"];
const SKINS = [
  ["auto", "Auto", ["#eceef3", "#080a14", "#d8ac5d"]],
  ["astral", "Astral", ["#080a14", "#d8ac5d", "#6fd6da"]],
  ["vellum", "Vellum", ["#f5f6f9", "#8a6216", "#0b6f7c"]],
  ["nebula", "Nebula", ["#040d16", "#86e9f5", "#ff86d4"]],
  ["ember", "Ember", ["#110a0a", "#e9a34a", "#94c6a0"]],
];
const PROSE_FONTS = [
  ["literata", "Literata", '"Literata", Georgia, "Times New Roman", serif'],
  ["garamond", "EB Garamond", '"EB Garamond", Garamond, Georgia, serif'],
  ["spectral", "Spectral", '"Spectral", Georgia, serif'],
  ["mono", "Plex Mono", '"IBM Plex Mono", ui-monospace, Menlo, monospace'],
  ["system", "System sans", 'system-ui, -apple-system, "Segoe UI", sans-serif'],
];
const DEFAULT_SETTINGS = {
  skin: "auto", font: "literata", size: 19, lh: 1.75, measure: 66, para: "indent",
  smart: true, typewriter: false, ambience: true, spell: true, lastBackup: 0,
};

/* ── The astrolabe ornament (generated, so it stays crisp at every size) ── */
function astrolabeSVG(kind) {
  const c = 50, P = n => n.toFixed(2);
  let ticks = "", glyphs = "";
  if (kind !== "mini") {
    for (let i = 0; i < 72; i++) {
      const a = (i * 5 - 90) * Math.PI / 180, r1 = 46, r2 = i % 6 === 0 ? 41.5 : 44;
      ticks += `<line class="a-tick" x1="${P(c + r1 * Math.cos(a))}" y1="${P(c + r1 * Math.sin(a))}" x2="${P(c + r2 * Math.cos(a))}" y2="${P(c + r2 * Math.sin(a))}"/>`;
    }
    if (kind === "hero") {
      ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"].forEach((g, i) => {
        const a = (i * 30 - 90) * Math.PI / 180, r = 38;
        glyphs += `<text class="a-glyph" x="${P(c + r * Math.cos(a))}" y="${P(c + r * Math.sin(a) + 1.2)}" text-anchor="middle">${g}</text>`;
      });
    }
  }
  const ptrs = [[-60, 31], [10, 26], [75, 33], [140, 24], [205, 30], [262, 27]].map(([deg, r]) => {
    const a = deg * Math.PI / 180, x = c + r * Math.cos(a), y = c + r * Math.sin(a), b = a + Math.PI / 2;
    return `<path class="a-ptr" d="M${P(x)} ${P(y)} L${P(c + (r - 6) * Math.cos(a) + 1.6 * Math.cos(b))} ${P(c + (r - 6) * Math.sin(a) + 1.6 * Math.sin(b))} L${P(c + (r - 6) * Math.cos(a) - 1.6 * Math.cos(b))} ${P(c + (r - 6) * Math.sin(a) - 1.6 * Math.sin(b))} Z"/>`;
  }).join("");
  return `<svg class="astro" viewBox="0 0 100 100" aria-hidden="true">
    <circle class="a-ring" cx="50" cy="50" r="48"/>
    ${kind === "mini" ? "" : '<circle class="a-thin" cx="50" cy="50" r="46"/>'}
    ${ticks}${glyphs}
    <circle class="a-thin" cx="50" cy="50" r="${kind === "mini" ? 30 : 34}"/>
    <g class="a-rete">
      <circle cx="50" cy="45" r="${kind === "mini" ? 20 : 24}"/>
      <circle cx="50" cy="50" r="${kind === "mini" ? 12 : 14}"/>
      ${kind === "mini" ? "" : ptrs}
      ${kind === "mini" ? "" : '<path d="M50 20 L50 80 M24 50 L76 50" opacity=".35"/>'}
    </g>
    <g class="a-rule"><line x1="${kind === "mini" ? 8 : 6}" y1="50" x2="${kind === "mini" ? 92 : 94}" y2="50"/></g>
    <circle class="a-hub" cx="50" cy="50" r="${kind === "mini" ? 3.4 : 2.2}"/>
  </svg>`;
}
function paintAstros(root = document) {
  $$("[data-astro]", root).forEach(el => { if (!el.firstChild) el.innerHTML = astrolabeSVG(el.dataset.astro); });
}

/* ── The sky: a slow star chart behind everything ── */
const Sky = (() => {
  let cv, ctx, stars = [], raf = 0, on = true, last = 0, rgb = "255,241,214", alpha = .9;
  function readTokens() {
    const cs = getComputedStyle(document.documentElement);
    rgb = (cs.getPropertyValue("--star") || "255,241,214").trim();
    alpha = parseFloat(cs.getPropertyValue("--star-a")) || .8;
  }
  function seed() {
    const w = cv.clientWidth, h = cv.clientHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(w * h / 7000);
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h, r: Math.random() < .08 ? 1.3 + Math.random() * .7 : .4 + Math.random() * .7,
      p: Math.random() * Math.PI * 2, s: .3 + Math.random() * 1.2, g: Math.random() < .12,
    }));
  }
  function draw(t) {
    const w = cv.clientWidth, h = cv.clientHeight;
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      const tw = on && !reduceMotion() ? .55 + .45 * Math.sin(s.p + t / 1000 * s.s) : .8;
      ctx.globalAlpha = alpha * tw * (s.r > 1.2 ? 1 : .7);
      ctx.fillStyle = s.g ? "rgb(" + rgb + ")" : "rgba(" + rgb + ",.85)";
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      if (s.r > 1.6) { ctx.globalAlpha *= .25; ctx.fillRect(s.x - 4, s.y - .25, 8, .5); ctx.fillRect(s.x - .25, s.y - 4, .5, 8); }
    }
    ctx.globalAlpha = 1;
  }
  function loop(t) {
    raf = 0;
    if (!on || document.hidden || reduceMotion()) return;
    if (t - last > 66) { last = t; draw(t); }
    raf = requestAnimationFrame(loop);
  }
  return {
    init() {
      cv = $("#sky"); ctx = cv.getContext("2d"); readTokens(); seed(); draw(0);
      window.addEventListener("resize", debounce(() => { seed(); draw(performance.now()); }, 200));
      document.addEventListener("visibilitychange", () => this.set(on));
      this.set(on);
    },
    set(v) {
      on = v; if (!cv) return;
      cv.style.opacity = v ? "1" : "0";
      if (v && !raf && !reduceMotion()) raf = requestAnimationFrame(loop);
    },
    retint() { if (!cv) return; readTokens(); draw(performance.now()); },
  };
})();
