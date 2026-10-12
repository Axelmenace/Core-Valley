/* ===== Play Menu (assets/play-menu.md, served in small portions) ===== */

const CAT = Object.fromEntries(PLAY_MENU.categories.map((c) => [c.key, c]));
const SETTINGS = MENU_GUIDE.settings;
const REST = ["Creatures and Beings", "Role and Profession Settings", "Social Structure Settings", "Religions and Religious Themes", "Politics and Ideology"];

function isPicked(cat, sub, name) { return picksOf(cat, sub).includes(name); }
function togglePick(cat, sub, name) {
  const p = (S.picks[cat] = S.picks[cat] || {});
  let list = (p[sub] = p[sub] || []);
  if (list.includes(name)) list = list.filter((x) => x !== name);
  else {
    if (cat === "Romantic Interest") {
      if (name === "Don't Include One") list = [];
      else list = list.filter((x) => x !== "Don't Include One");
    }
    list.push(name);
  }
  p[sub] = list;
  if (!list.length) delete p[sub];
  if (!Object.keys(p).length) delete S.picks[cat];
}

function needsAdultRule() {
  const any = (map) => Object.entries(map).some(([cat, names]) => allPicksOf(cat).some((n) => names.includes(n)));
  return any(MENU_GUIDE.schoolish) && any(MENU_GUIDE.romantic);
}
function settingCatsPicked() { return SETTINGS.filter((c) => allPicksOf(c).length); }
function suitedSettings() {
  const types = allPicksOf("Story Types");
  return SETTINGS.filter((c) => types.some((t) => (MENU_GUIDE.settingFor[c] || []).includes(t)));
}
function suggestedBaseline() {
  if (allPicksOf("Story Mechanics").length >= 3) return { id: "Table Game", why: "three or more Story Mechanics" };
  for (const t of allPicksOf("Story Types")) {
    for (const [id, list] of Object.entries(MENU_GUIDE.baselineFor)) if (list.includes(t)) return { id, why: `Story Type ${t}` };
  }
  return null;
}

function menuNotices() {
  const out = [];
  if (needsAdultRule()) out.push(["wax", "Validation", "A school pick combined with romance runs only with adult characters: an academy, a university, a military college. This becomes a boundary of the Mode."]);
  const sc = settingCatsPicked().filter((c) => c !== "Environment and Location Settings" && c !== "Trope Fusion Settings");
  if (sc.length >= 2) out.push(["verd", "Trope Fusion", `Two setting categories picked (${sc.map((c) => c.replace(" Settings", "")).join(" + ")}). The Operator names the collision point and builds the world rules around it.`]);
  const mech = allPicksOf("Story Mechanics").length;
  if (mech >= 3) out.push(["", "Story Mechanics", "Three or more mechanics push the Mode toward the Table Game Baseline. Any pick here raises Transparency."]);
  else if (mech) out.push(["", "Story Mechanics", "A mechanics pick raises Transparency: more of the rules are visible."]);
  if (allPicksOf("Story Types").includes("Hard Sci-Fi")) out.push(["", "Causal Standard", "Hard Sci-Fi raises the Causal Standard in whichever setting is picked."]);
  if (allPicksOf("Dark World Settings").length) out.push(["", "Dark World", "Pairs with a high Resistance and a low Plot Protection. The Intensity Ceiling and Content Dials decide how much of the darkness is rendered."]);
  const tones = allPicksOf("Tone and Atmosphere").length;
  if (tones === 1) out.push(["", "Tone", "The best pick is two: a dominant tone and an undertone."]);
  if (tones > 2) out.push(["", "Tone", "Two tones work best: a dominant tone and an undertone. More than that blurs the Tonal Range."]);
  const ri = allPicksOf("Romantic Interest");
  if (ri.length && !ri.includes("Don't Include One")) out.push(["", "Romance", "Adds romance to the Aims and gives one Operator Character a Want that involves your Character. How explicitly it is rendered is set by the Content Dials."]);
  if (picksOf("Fantasy and Magic Settings", "How magic works").length || picksOf("Fantasy and Magic Settings", "How common magic is").some((x) => x !== "None"))
    out.push(["gilt", "Magic", "Magic picked. Its Specification is built in the Magic Menu before Play (§25): hard to its author, however soft to you."]);
  return out;
}

/* ---- Option rendering ---- */
function optionCard(cat, sub, o, onToggle) {
  const pressed = isPicked(cat, sub, o.name);
  const meta = [o.period, o.fusion, o.sets ? "sets: " + o.sets : null, o.example ? "e.g. " + o.example : null].filter(Boolean).join(" · ");
  return h("button", { type: "button", class: "opt" + (cat === "Fantasy and Magic Settings" && sub !== "The kind of world" ? " gilt" : ""),
    "aria-pressed": String(pressed), "data-key": `${cat}|${sub}|${o.name}`, onclick: () => onToggle(o.name) },
    h("b", null, o.name), o.desc ? h("span", null, o.desc) : null, meta ? h("em", null, meta) : null);
}
function optionChip(cat, sub, name, onToggle) {
  return h("button", { type: "button", class: "chip", "aria-pressed": String(isPicked(cat, sub, name)), "data-key": `${cat}|${sub}|${name}`, onclick: () => onToggle(name) }, name);
}
function featuredFor(cat, sub) {
  const key = `${cat}|${sub.name}`;
  const names = sub.options.map((o) => o.name);
  if (!S.featured[key] || !S.featured[key].every((n) => names.includes(n))) S.featured[key] = sampleN(names, 6);
  return S.featured[key];
}

const openAll = new Set();
function catBlock(catKey, opts = {}) {
  const cat = CAT[catKey];
  const wrap = h("div", { class: "cat", id: "cat-" + cat.num });
  const total = cat.subs.reduce((n, s) => n + s.options.length, 0);
  const refresh = (focusKey) => {
    const fresh = catBlock(catKey, opts);
    wrap.replaceWith(fresh);
    if (focusKey) { const b = fresh.querySelector(`[data-key="${CSS.escape(focusKey)}"]`); if (b) b.focus(); }
    renderTray();
    changed();
  };
  if (!opts.bare) {
    put(wrap, h("div", { class: "cat-title" }, h("h3", null, cat.key), h("span", { class: "n" }, `${cat.num}. · ${total} options`)));
    if (cat.sets) put(wrap, h("p", { class: "sets" }, h("b", null, "Sets"), cat.sets));
    if (cat.blurb) put(wrap, h("p", { class: "prose small" }, cat.blurb));
  }
  for (const sub of cat.subs) {
    const onToggle = (name) => { togglePick(cat.key, sub.name, name); refresh(`${cat.key}|${sub.name}|${name}`); };
    const box = h("div", { class: "stack tight" });
    if (sub.name !== "Options") put(box, h("p", { class: "sub-name" }, sub.name));
    if (sub.groups) {
      for (const g of sub.groups) put(box, h("p", { class: "group-name" }, g.name), h("div", { class: "chips" }, g.options.map((n) => optionChip(cat.key, sub.name, n, onToggle))));
    } else {
      const key = `${cat.key}|${sub.name}`;
      const small = sub.options.length <= 9;
      const expanded = small || openAll.has(key);
      let shown = sub.options;
      if (!expanded) {
        const feat = featuredFor(cat.key, sub);
        const picked = picksOf(cat.key, sub.name);
        shown = sub.options.filter((o) => feat.includes(o.name) || picked.includes(o.name));
      }
      put(box, h("div", { class: "options" }, shown.map((o) => optionCard(cat.key, sub.name, o, onToggle))));
      if (!small) {
        put(box, h("div", { class: "row tight" },
          h("button", { type: "button", class: "btn sm", onclick: () => { expanded ? openAll.delete(key) : openAll.add(key); refresh(); } },
            expanded ? "Show six" : `Show all ${sub.options.length}`),
          !expanded ? h("button", { type: "button", class: "btn ghost sm", title: "A Tool Draw of six others", onclick: () => { S.featured[key] = sampleN(sub.options.map((o) => o.name), 6); refresh(); } }, "Draw six others") : null,
          !expanded ? h("span", { class: "small muted" }, `Six of ${sub.options.length}, drawn at random. The rest are available.`) : null));
      }
    }
    put(wrap, box);
  }
  if (cat.key === "Romantic Interest") {
    const ri = allPicksOf("Romantic Interest");
    if (ri.length && !ri.includes("Don't Include One")) {
      for (const [ref, options] of Object.entries(PLAY_MENU.refinements)) {
        put(wrap, h("div", { class: "stack tight" }, h("p", { class: "group-name" }, ref + " (optional refinement)"),
          h("div", { class: "chips" }, options.map((o) => h("button", { type: "button", class: "chip", "aria-pressed": String(S.romance[ref] === o),
            onclick: () => { S.romance[ref] = S.romance[ref] === o ? "" : o; refresh(); } }, o)))));
      }
    }
  }
  if (cat.key === "Story Hooks" && PLAY_MENU.hookExamples.length) {
    put(wrap, h("details", { class: "small" }, h("summary", { class: "muted" }, "Hooks stack: examples from published fiction"),
      h("div", { class: "table-wrap", style: "margin-top:8px" }, h("table", null, h("tbody", null,
        PLAY_MENU.hookExamples.map((e) => h("tr", null, h("td", null, e.title), h("td", null, e.hooks))))))));
  }
  return wrap;
}

/* ---- The tray: Declarations so far ---- */
let trayEl = null;
function renderTray() {
  if (!trayEl) return;
  clear(trayEl);
  const picks = pickList();
  put(trayEl, h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "U"), "Your Declarations"),
    h("span", { class: "small muted" }, picks.reduce((n, p) => n + p.names.length, 0) + " picks")));
  if (!picks.length) put(trayEl, h("p", { class: "tray-empty" }, "Nothing picked yet. Everything unpicked is the Operator's to elect."));
  for (const p of picks) {
    put(trayEl, h("div", { class: "tray-group" }, h("span", { class: "t" }, p.label),
      h("div", { class: "chips" }, p.names.map((n) => h("button", { type: "button", class: "chip", "aria-pressed": "true", title: "Remove",
        onclick: () => { togglePick(p.cat, p.sub, n); renderMenu(); changed(); } }, n, h("span", { class: "x" }, "×"))))));
  }
  if (S.romance.Pace || S.romance.Obstacle) put(trayEl, h("p", { class: "small" }, "Romance: ", [S.romance.Pace, S.romance.Obstacle].filter(Boolean).join(" · ")));
  const sb = suggestedBaseline();
  if (sb) put(trayEl, h("p", { class: "small" }, mark("I"), " Suggested Baseline: ", h("b", null, sb.id), ` (from ${sb.why}).`));
  for (const [cls, t, msg] of menuNotices()) put(trayEl, h("div", { class: "notice " + cls }, h("b", null, t + ". "), msg));
  const carry = h("div", { class: "row" },
    h("button", { type: "button", class: "btn primary", disabled: picks.length ? null : true, onclick: carryIntoMode },
      S.example ? "Start a Mode from these picks" : "Carry into Declaration"),
    picks.length ? h("button", { type: "button", class: "btn ghost", onclick: () => { S.picks = {}; S.romance = { Pace: "", Obstacle: "" }; renderMenu(); changed(); } }, "Clear picks") : null);
  put(trayEl, carry);
  if (S.example && picks.length) put(trayEl, h("p", { class: "small muted" }, `This replaces the worked example, ${S.example}, with a new Mode built from your picks.`));
}

/* ---- Roll for me (the procedure of scripts/menu_draw.py) ---- */
function drawCore(n, apply) {
  const setting = SETTINGS[randBelow(SETTINGS.length)];
  const cats = ["Story Types", setting, "Tone and Atmosphere"];
  return drawCats(cats, n, apply);
}
function drawCats(cats, n, apply) {
  const lines = [];
  const offers = [];
  for (const c of cats) {
    for (const sub of CAT[c].subs) {
      const picks = sampleN(sub.options.map((o) => o.name), n);
      const label = sub.name === "Options" ? c : `${c} / ${sub.name}`;
      lines.push(`${label}: ${picks.join("; ")}`);
      offers.push({ cat: c, sub: sub.name, label, picks });
      if (apply) for (const p of picks) if (!isPicked(c, sub.name, p)) togglePick(c, sub.name, p);
    }
  }
  lines.push("(source: Tool Draw from the Play Menu)");
  S.menuLog.unshift({ at: stamp(), text: lines.join("\n"), offers: apply ? null : offers });
  S.menuLog = S.menuLog.slice(0, 6);
  return offers;
}

function rollPanel() {
  const box = h("div", { class: "panel stack" });
  const logEl = h("div", { class: "stack tight" });
  const renderLog = () => {
    clear(logEl);
    for (const entry of S.menuLog.slice(0, 3)) {
      const el = h("div", { class: "roll-out" }, h("span", { class: "muted" }, entry.at.replace("T", " ") + "\n"), entry.text);
      put(logEl, el);
      if (entry.offers) {
        for (const o of entry.offers) {
          put(logEl, h("div", { class: "stack tight" }, h("span", { class: "group-name" }, o.label),
            h("div", { class: "chips" }, o.picks.map((p) => h("button", { type: "button", class: "chip", "aria-pressed": String(isPicked(o.cat, o.sub, p)),
              onclick: () => { togglePick(o.cat, o.sub, p); renderMenu(); changed(); } }, p)))));
        }
      }
    }
  };
  put(box,
    h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§15.9"), "Roll for me"), h("h3", null, "A real draw, not the Operator's preference")),
    h("p", { class: "prose small" }, "Draws come from your browser's entropy source and are labelled as a Tool Draw, as every draw declares its source."),
    h("div", { class: "row" },
      h("button", { type: "button", class: "btn primary", onclick: () => { drawCore(1, true); renderMenu(); changed(); toast("Drew the core three"); } }, "Draw the core three"),
      h("button", { type: "button", class: "btn", onclick: () => { drawCore(5, false); renderMenu(); changed(); } }, "Offer five of each"),
      h("button", { type: "button", class: "btn ghost", onclick: () => { drawCats(PLAY_MENU.categories.map((c) => c.key), 1, false); renderMenu(); changed(); } }, "One from every category")),
    logEl);
  renderLog();
  return box;
}

/* ---- Carry the picks into the Mode (Completion uses them; every pick is marked U) ---- */
function carryIntoMode() {
  if (S.example) {
    const keep = { picks: S.picks, romance: S.romance, featured: S.featured, menuLog: S.menuLog, magic: S.magic };
    S = Object.assign(blankState(), keep);
    S.magic = keep.magic.on || picksOf("Fantasy and Magic Settings", "How magic works").length ? keep.magic : blankMagic();
  }
  const sb = suggestedBaseline();
  if (sb && (!S.baseline || S.baselineSrc === "I")) { S.baseline = sb.id; S.baselineSrc = "I"; }
  const settingBits = [];
  for (const c of SETTINGS) for (const sub of CAT[c].subs) { const ps = picksOf(c, sub.name); if (ps.length) settingBits.push(ps.join(" + ")); }
  for (const c of ["Social Structure Settings", "Religions and Religious Themes", "Politics and Ideology", "Creatures and Beings"]) {
    const ps = allPicksOf(c); if (ps.length) settingBits.push(c.replace(" Settings", "") + ": " + ps.join(", "));
  }
  if (settingBits.length && !S.world.setting.trim()) S.world.setting = settingBits.join(". ") + ".";
  const role = allPicksOf("Role and Profession Settings");
  if (role.length && !S.seats.user.trim()) S.seats.user = `Character (${role.join(", ").toLowerCase()})`;
  if (!S.seats.operator.trim()) S.seats.operator = "World, every Operator Character, Adjudicator";
  for (const a of allPicksOf("Character Archetypes")) {
    if (!S.characters.some((c) => c.archetype === a)) S.characters.push({ id: uid(), name: "", archetype: a, want: "", line: "", price: "", leverage: "", tell: "", diction: "", rhythm: "", vtell: "", never: "", sample: "" });
  }
  const mech = allPicksOf("Story Mechanics");
  if (mech.includes("Dice Resolution") && !S.deltas.Randomness) S.deltas.Randomness = { value: "Tool Draw", src: "U", reason: "Play Menu: Dice Resolution" };
  if (mech.includes("Oracle Play") && !S.deltas["Uncertainty Handling"]) S.deltas["Uncertainty Handling"] = { value: "Oracle", src: "U", reason: "Play Menu: Oracle Play" };
  if (mech.includes("Freeform") && !S.deltas.Randomness) S.deltas.Randomness = { value: "Judgment", src: "U", reason: "Play Menu: Freeform" };
  if (mech.includes("Permadeath") && !S.constraints.persistent.includes("Permadeath")) S.constraints.persistent = (S.constraints.persistent + " Permadeath: Tier 3 admissible for the User's Character.").trim();
  const ri = allPicksOf("Romantic Interest");
  if (ri.length && !ri.includes("Don't Include One") && !S.decl.aims.includes("emotional intensity") && S.decl.aims.length < 3) S.decl.aims.push("emotional intensity");
  const workings = picksOf("Fantasy and Magic Settings", "How magic works");
  const common = picksOf("Fantasy and Magic Settings", "How common magic is");
  if (workings.length || common.some((x) => x !== "None")) {
    S.magic.on = true;
    S.magic.workings = Array.from(new Set([...S.magic.workings, ...workings]));
    if (common.length) { S.magic.common = common[0]; S.magic.vars.Prevalence = MAGIC.prevalenceFor[common[0]] ?? S.magic.vars.Prevalence; }
  }
  S.step = 0;
  changed();
  toast("Picks carried into the Mode as Declarations [U]");
  go("deploy");
}

/* ---- The view ---- */
function renderMenu() {
  const root = $("#play-menu");
  const y = window.scrollY;
  clear(root);
  resetLive();
  const types = allPicksOf("Story Types");
  const suited = suitedSettings();
  if (!S.menuSetting || !SETTINGS.includes(S.menuSetting)) S.menuSetting = suited[0] || settingCatsPicked()[0] || "Fantasy and Magic Settings";
  const ordered = [...suited, ...SETTINGS.filter((c) => !suited.includes(c))];

  const main = h("div", { class: "stack loose" });
  const portionSets = (key) => h("p", { class: "sets" }, h("b", null, "Sets"), CAT[key].sets);
  put(main, h("section", { class: "portion panel" },
    h("div", { class: "portion-head" }, h("span", { class: "rn" }, "I"), h("h2", null, "Story Type"), portionSets("Story Types")),
    catBlock("Story Types", { bare: true })));

  const tabs = h("div", { class: "chips", role: "tablist", "aria-label": "Setting categories" }, ordered.map((c) => {
    const n = allPicksOf(c).length;
    return h("button", { type: "button", role: "tab", class: "chip", "aria-selected": String(S.menuSetting === c), "aria-pressed": String(S.menuSetting === c),
      onclick: () => { S.menuSetting = c; renderMenu(); changed(); } },
      c.replace(" Settings", "").replace("Environment and Location", "Environment"), suited.includes(c) ? h("span", { class: "x" }, "suits") : null, n ? h("span", { class: "x" }, "· " + n) : null);
  }));
  put(main, h("section", { class: "portion panel" },
    h("div", { class: "portion-head" }, h("span", { class: "rn" }, "II"), h("h2", null, "One setting"),
      h("p", { class: "small muted" }, types.length ? `Categories that suit ${types.join(" and ")} come first. Two picks from different categories make a Trope Fusion.` : "Pick a Story Type first and the suited categories come forward. Two setting categories make a Trope Fusion.")),
    tabs, catBlock(S.menuSetting)));

  put(main, h("section", { class: "portion panel" },
    h("div", { class: "portion-head" }, h("span", { class: "rn" }, "III"), h("h2", null, "Tone"), portionSets("Tone and Atmosphere")),
    h("p", { class: "prose small" }, CAT["Tone and Atmosphere"].blurb),
    catBlock("Tone and Atmosphere", { bare: true })));

  put(main, h("div", { class: "stack tight" }, h("p", { class: "eyebrow" }, "Optional refinements"),
    ...MENU_GUIDE.refinements.map((k) => drawer(k))));
  put(main, h("div", { class: "stack tight" }, h("p", { class: "eyebrow" }, "The rest of the Menu"),
    ...REST.map((k) => drawer(k))));

  trayEl = h("div", { class: "panel tray" });
  const side = h("aside", { class: "stack sticky" }, trayEl, rollPanel());

  put(root,
    h("div", { class: "view-head" },
      h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§10.1"), "Declaration · Play Menu v1.1"),
      h("h1", null, "Play Menu"),
      h("p", { class: "lede" }, "For a Player who does not know what to play. Three portions first, the rest only if you want them. Every pick is a User Declaration, marked U; every category left unpicked stays the Operator's to elect.")),
    h("div", { class: "split" }, main, side));
  renderTray();
  window.scrollTo({ top: y });
}
function drawer(key) {
  const cat = CAT[key];
  const n = allPicksOf(key).length;
  const d = h("details", { class: "drawer", open: n ? true : null },
    h("summary", null, h("h3", null, cat.key), h("span", { class: "sets" }, h("b", null, "Sets"), cat.sets), n ? pill("pass", n + " picked") : null),
    h("div", { class: "drawer-body" }, catBlock(key, { bare: true })));
  if (cat.blurb) d.querySelector(".drawer-body").prepend(h("p", { class: "prose small" }, cat.blurb));
  return d;
}
RENDER["play-menu"] = renderMenu;
