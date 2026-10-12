/* ===== Magic Menu (§25): the Specification, the Effect Grammar, the Disclosure Profile, the seal ===== */

const M = () => S.magic;
const WORKINGS = CAT["Fantasy and Magic Settings"].subs.find((s) => s.name === "How magic works").options;
const COMMON = CAT["Fantasy and Magic Settings"].subs.find((s) => s.name === "How common magic is").options;

/* ---- The Grammar engine (§25.8) ---- */
function fmtMin(m) {
  m = Number(m);
  if (!isFinite(m)) return "—";
  if (m < 60) return `${+m.toFixed(2)} min`;
  if (m < 1440) return `${+(m / 60).toFixed(2)} h`;
  return `${+(m / 1440).toFixed(2)} day${m === 1440 ? "" : "s"}`;
}
function fitEngine(e) {
  const n = Math.max(1, Math.min(12, Math.round(Number(e.tiers) || 1)));
  e.tiers = n;
  for (const k of ["duration", "magnitude", "targets", "gate"]) {
    const arr = e[k] || [];
    while (arr.length < n) arr.push(arr.length ? arr[arr.length - 1] : k === "magnitude" ? "" : 1);
    arr.length = n;
    e[k] = arr;
  }
  return e;
}
function envelope(e, t, mods = []) {
  const g = Number(e.growth) || 1;
  let area = Number(e.areaBase) * g ** (t - 1);
  let range = Number(e.rangeBase) * g ** (t - 1);
  let duration = Number(e.duration[t - 1]);
  let targets = Number(e.targets[t - 1]);
  for (const name of mods) {
    const mod = e.modifiers.find((x) => x.name === name);
    if (!mod) continue;
    if (mod.fx === "range") range *= 2;
    if (mod.fx === "duration") duration *= 2;
    if (mod.fx === "area") area *= 2;
    if (mod.fx === "targets") targets += 1;
  }
  return { area, range, duration, targets, magnitude: e.magnitude[t - 1], gate: Number(e.gate[t - 1]) };
}
/* The Pricing Procedure, steps 1 to 5. Ties and ambiguity round up; Benchmark Parity moves up a Tier. */
function priceEffect(e, req) {
  fitEngine(e);
  const out = { steps: [], prohibited: null };
  const domainOk = !!req.domain && M().domains.includes(req.domain);
  out.steps.push(["Domain", domainOk ? `${req.domain}` : "No Domain chosen: Prohibited"]);
  if (!domainOk) { out.prohibited = "It lies in no Domain."; return out; }
  const mods = req.mods || [];
  let t0 = null, binding = "";
  for (let t = 1; t <= e.tiers; t++) {
    const env = envelope(e, t, mods);
    if (req.area <= env.area && req.range <= env.range && req.duration <= env.duration && req.targets <= env.targets && req.mag <= t) { t0 = t; break; }
  }
  if (t0 == null) { out.prohibited = "No Tier's Envelope contains it: it lies above the Apex and does not happen."; out.steps.push(["Placement", out.prohibited]); return out; }
  if (t0 > 1) {
    const prev = envelope(e, t0 - 1, mods);
    const why = [];
    if (req.area > prev.area) why.push("Area");
    if (req.range > prev.range) why.push("Range");
    if (req.duration > prev.duration) why.push("Duration");
    if (req.targets > prev.targets) why.push("Targets");
    if (req.mag > t0 - 1) why.push("Magnitude");
    binding = why.join(", ");
  }
  let t = t0;
  const notes = [`lowest Envelope containing every Parameter: Tier ${t0}${binding ? " (set by " + binding + ")" : ""}`];
  if (req.ambiguous) { t += 1; notes.push("ambiguous placement rounds up: +1"); }
  const raise = mods.length >= Number(e.modRaise || 99);
  if (raise) { t += 1; notes.push(`${mods.length} Modifiers raise the Tier: +1`); }
  out.steps.push(["Placement", notes.join("; ")]);
  if (req.parity) { t += 1; out.steps.push(["Parity", "exceeds its Tier's Benchmarks in aggregate: up one Tier"]); }
  else out.steps.push(["Parity", "within its Tier's Benchmarks"]);
  if (t > e.tiers) { out.prohibited = `Tier ${t} lies above the Apex (Tier ${e.tiers}): it does not happen.`; out.steps.push(["Apex", out.prohibited]); return out; }
  out.tier = t;
  out.access = Number(req.rank) >= t;
  out.steps.push(["Access", out.access ? `Rank ${req.rank} reaches Tier ${t}` : `Rank ${req.rank} cannot reach Tier ${t}. The effect exists; this user cannot cast it.`]);
  const base = Number(e.costBase) ** t;
  const pct = Number(e.modPct) / 100;
  const mult = e.stacking === "compound" ? (1 + pct) ** mods.length : 1 + pct * mods.length;
  out.price = Math.ceil(base * mult - 1e-9);
  out.priceText = `${out.price} ${e.resource}`;
  out.steps.push(["Price", `${e.costBase}^${t} = ${base}${mods.length ? ` × ${+mult.toFixed(4)} (${mods.length} Modifier${mods.length > 1 ? "s" : ""}, ${e.stacking})` : ""} → ${out.priceText}${base * mult % 1 ? " (rounded up)" : ""}`]);
  out.gate = Number(e.gate[t - 1]);
  const benches = Object.entries(e.benchmarks || {}).map(([k, v]) => [Number(k), v]).filter(([k, v]) => v && k <= t).sort((a, b) => b[0] - a[0]);
  out.bench = benches.length ? `T${benches[0][0]} ${benches[0][1].split(" (")[0]}` : "—";
  out.rung = "Likely";
  return out;
}

/* ---- The Specification sheet (assets/magic-specification.md) ---- */
function specSheet() {
  const m = M(), e = fitEngine(m.engine);
  const v = (k) => m.vars[k];
  const note = (k) => (m.varNotes[k] ? ` · ${m.varNotes[k]}` : "");
  const L = [];
  L.push(`## SPEC-${m.name || "Unnamed"} · v1.0.0 · Commitment Level 3 · Digest published separately`, "");
  L.push("### A. Identity", `- **Name:** ${m.name || "—"}`, `- **Seed:** ${m.seed || "—"}`, `- **Boundary:** ${m.boundary || "—"}`, `- **Mundane Baseline:** ${m.baseline || "Earth physics"}`, "");
  L.push("### B. Mechanism Core", `- **Substrate:** ${m.substrate || "—"}`, `- **Operation:** ${m.operation || "—"}`, `- **Invariants:** ${m.invariants || "—"}`,
    `- **Prohibitions:** ${m.prohibitions || "—"}`, `- **Interfaces:** with the Baseline by Mundane Continuity; with other systems by Coupling Closure unless declared`,
    `- **Generativity:** ${m.arch}`, `- **Clause displacements:** none`);
  if (m.workings.length) L.push(`- **Shape (Play Menu):** ${m.workings.join("; ")}`);
  L.push("", "### C. Variables",
    `- Transference ${v("Transference")}${note("Transference")}`,
    `- Prevalence ${v("Prevalence")}${m.common ? ` (${m.common})` : ""}${note("Prevalence")}`,
    `- Source: ${m.src.locus} · ${m.src.reserve}` +
      (m.src.reserve === "renewable" ? ` · Renewal Rule: ${m.src.renewal || "—"}` : "") +
      (["finite", "renewable"].includes(m.src.reserve) ? ` · Depletion Effect: ${m.src.depletion || "—"}` : "") +
      (m.src.locus === "agentive" ? ` · Terms: ${m.src.terms || "—"}` : "") + (m.src.reserve === "shared" ? ` · Share Ledger: ${m.src.ledger || "—"}` : ""),
    `- Flux ${m.flux.sign}${m.flux.sign !== "0" ? ` · Driver: ${m.flux.driver || "—"} · Measure: ${m.flux.measure || "—"}` : ""}`,
    `- Naturalness ${v("Naturalness")}${note("Naturalness")}`,
    `- Ease of Use ${v("Ease of Use")}${note("Ease of Use")}`,
    `- Reliability ${v("Reliability")}${note("Reliability")}`,
    `- Consistency ${v("Consistency")}${note("Consistency")}`, "");
  if (m.arch === "Grammar" || m.arch === "Mixed") {
    L.push("### D1. Effect Grammar", `- **Domains:** ${m.domains.join(" · ") || "—"}`,
      `- **Power Axes:** primary Tier 1–${e.tiers}, gated by the user's Rank (Access Rule)`, "- **Envelopes:**", "",
      "| Tier | Magnitude | Area (radius) | Range | Duration | Targets | Gate Ceiling | Default rung |", "| --- | --- | --- | --- | --- | --- | --- | --- |");
    for (let t = 1; t <= e.tiers; t++) {
      const env = envelope(e, t);
      L.push(`| ${t} | ${env.magnitude || "—"} | ${+env.area.toFixed(2)} m | ${+env.range.toFixed(2)} m | ${fmtMin(env.duration)} | ${env.targets} | ${env.gate} | Likely at the caster's own Tier |`);
    }
    L.push("", `- **Cost Function:** Price = ${e.costBase}^Tier ${e.resource}${m.resources.filter((r) => r !== e.resource).length ? "; also " + m.resources.filter((r) => r !== e.resource).join(", ") + " as the card states" : ""}. Each Modifier adds ${e.modPct}% (${e.stacking}), rounded up. Ties and ambiguity round up.`,
      `- **Modifier Table:** ${e.modifiers.map((x) => `${x.name} (+${e.modPct}%)`).join("; ")}. ${e.modRaise} or more Modifiers on one effect raise its Tier by one.`,
      `- **Access Rule:** ${m.access || "—"} [${(m.gate || "Metaphysical")[0]}]`,
      `- **Combination Rule:** ${m.combination || "—"}`, `- **Apex Rule:** ${m.apex || `Tier ${e.tiers}`}`,
      `- **Diegetic Interface:** ${m.iface}${m.iface !== "none" ? `; Authority: ${m.ifaceAuth}${m.ifaceNote ? ". " + m.ifaceNote : ""}` : ""}`,
      `- **Benchmarks:** ${Object.entries(e.benchmarks || {}).filter(([, b]) => b).map(([k, b]) => `T${k} ${b}`).join("; ") || "—"}`,
      `- **Signature Effects:** ${m.signature || "none"}`,
      `- **Codex:** ${m.codex.length ? m.codex.map((c) => `${c.name} · ${c.domain} · T${c.tier} · ${c.price} · vs ${c.bench}`).join("; ") : "kept in the Record; starts empty"}`);
    if (m.staged) L.push(`- **Stages and Products:** ${m.stagesText || "Preparation and Release; each Product states Vessel, Trigger, Shelf, Uses, Transferability"}`);
    L.push("");
  } else {
    L.push(`### D2. Effects Catalogue (${m.arch})`, m.catalogue || "- (one card per effect, ten lines at most)", "");
  }
  if (m.production) L.push("### D3. Production Rule", m.productionText || "- Inputs · Processes · Producer · Output Space · Grade Function · Side-Effect Function · Failure", "");
  L.push("### E. Limitations", `- **Costs:** ${m.costs || m.resources.join(", ") || "—"}`, `- **Consequences:** ${m.consequences || "—"}`,
    `- **Countermeasures:** ${m.countermeasures || "—"}`, "");
  L.push("### F. Balance Record", "| Unbounded State | Route found, or closed by |", "| --- | --- |");
  for (const u of MAGIC.unbounded) L.push(`| ${u} | ${m.balance[u] || "—"} |`);
  L.push("", `### Lens Sheet: ${m.lens.holder || "the User's Character"}`, `- **Hardness:** ${m.lens.hardness} (${MAGIC.lens[m.lens.hardness]})`,
    `- **Known:** ${m.lens.known || "—"}`, `- **Believed (Claims):** ${m.lens.believed || "—"}`, "");
  L.push("### Disclosure Profile", `- **Target Hardness for the User:** at opening ${m.disc.open} → over the horizon ${m.disc.horizon}`,
    `- **Disclosure Orientation:** ${m.disc.orientation}`, `- **Resolution Transparency (magic):** ${m.disc.resolution}`,
    `- **Exposition Bound:** ${m.disc.exposition || "none outside a Character's Lens"}`,
    `- **Competence Delegation:** ${m.disc.delegation ? "the User's Character's magical knowledge (part of S2) delegated to the Operator; S1 stays with the User" : "none"}`, "");
  L.push("Everything this sheet leaves unsaid is answered by the Residual Thaumaturgic Clause (§25.6): " + MAGIC.residual.map((r) => r[0]).join(", ") + ".");
  return L.join("\n") + "\n";
}

/* §25.13, the checkable remainder. */
function specChecks() {
  const m = M(), out = [];
  const add = (name, ok, why) => out.push({ name, ok, why });
  if (m.seal && m.seal.by === "Operator") {
    add("Author tier", true, "Written and sealed by the Operator, who runs the Closure and Boundedness audits as its author. You can audit it at Revelation.");
    add("Disclosure feasibility", true, "Held unread at Level 3; only the digest is published.");
    return out;
  }
  add("Seed", !!m.seed.trim(), m.seed.trim() ? "The interpretive anchor is written." : "Write the Seed: one line the whole system grows from.");
  const closure = [];
  if (m.src.reserve === "renewable" && !m.src.renewal.trim()) closure.push("a Renewal Rule");
  if (["finite", "renewable"].includes(m.src.reserve) && !m.src.depletion.trim()) closure.push("a Depletion Effect");
  if (m.src.locus === "agentive" && !m.src.terms.trim()) closure.push("the patron's Terms (and Stake Card)");
  if (m.src.reserve === "shared" && !m.src.ledger.trim()) closure.push("a Share Ledger");
  if (m.flux.sign !== "0" && (!m.flux.driver.trim() || !m.flux.measure.trim())) closure.push("Flux's Driver and Measure");
  for (const k of ["Reliability", "Consistency"]) if (m.vars[k] < 4 && !(m.varNotes[k] || "").trim()) closure.push(`${k}'s ${k === "Reliability" ? "failure chance and variance" : "enumerated deviations"}`);
  add("Closure", !closure.length, closure.length ? "Missing " + closure.join(", ") + "." : "Every Distributed value names its distribution.");
  if (m.arch === "Grammar" || m.arch === "Mixed") {
    const e = fitEngine(m.engine);
    const ok = m.domains.length > 0 && e.tiers >= 1 && Number(e.costBase) > 0 && e.duration.every((d) => Number(d) > 0);
    add("Grammar determinacy", ok, ok ? "Domains, Envelopes and a computable Cost Function are present." : "Needs at least one Domain, a complete Envelope table and a numeric Cost Function.");
    const benches = Object.values(e.benchmarks || {}).filter(Boolean).length;
    add("Benchmarks", benches >= Math.ceil(e.tiers / 3), `${benches} Benchmark${benches === 1 ? "" : "s"} for ${e.tiers} Tiers (Light ceremony asks one per two or three Tiers).`);
  }
  const unb = MAGIC.unbounded.filter((u) => !m.balance[u].trim());
  add("Boundedness", !unb.length, unb.length ? "Audit " + unb.join(", ") + ": a route found and closed, or \"none found\"." : "All four Unbounded States audited.");
  add("Gate classification", !!m.gate, `Access gate marked ${m.gate || "—"}.`);
  if (m.iface !== "none" && m.ifaceAuth === "Authoritative" && m.disc.open <= 1)
    add("Disclosure feasibility", false, "An Authoritative interface is a Disclosure channel; it cannot coexist with a Target Hardness of 1.");
  else add("Disclosure feasibility", true, m.disc.open < 4 ? "Hidden state needs Level 2 or 3: this site seals at Level 3." : "Full disclosure: nothing hidden.");
  const maxGate = Math.max(...fitEngine(m.engine).gate.map(Number));
  if (m.arch === "Grammar" && maxGate >= 3) add("Gate fit", "warn", "Tiers with Gate Ceiling 3 are admissible only where the Instrument declares Tier 3 admissible.");
  return out;
}
const specValid = () => specChecks().every((c) => c.ok === true || c.ok === "warn");

/* ---- Seal sigil: a wax disc drawn from the digest ---- */
function drawSigil(canvas, hex) {
  const dpr = window.devicePixelRatio || 1;
  const size = 76;
  canvas.width = size * dpr; canvas.height = size * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  const css = getComputedStyle(document.documentElement);
  const wax = css.getPropertyValue("--wax").trim() || "#9f2f29";
  const ink = css.getPropertyValue("--wax-ink").trim() || "#fff";
  const c = size / 2;
  const bytes = (hex.match(/../g) || []).map((x) => parseInt(x, 16));
  ctx.beginPath();
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const r = 35 + ((bytes[i] || 0) % 3) * 0.7;
    i ? ctx.lineTo(c + Math.cos(a) * r, c + Math.sin(a) * r) : ctx.moveTo(c + Math.cos(a) * r, c + Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fillStyle = wax;
  ctx.fill();
  ctx.strokeStyle = ink;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(c, c, 28, 0, Math.PI * 2); ctx.stroke();
  ctx.globalAlpha = 0.9;
  const n = 7 + ((bytes[0] || 0) % 5);
  const step = 2 + ((bytes[1] || 0) % (n - 3));
  const pts = Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const r = 15 + ((bytes[2 + i] || 0) / 255) * 9;
    return [c + Math.cos(a) * r, c + Math.sin(a) * r];
  });
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  let k = 0;
  for (let i = 0; i <= n; i++) { const [x, y] = pts[k]; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); k = (k + step) % n; }
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = ink;
  ctx.font = "italic 13px 'IM Fell English', Georgia, serif";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(hex.slice(0, 4), c, c + 1);
}
function sigil(hex) { const cv = h("canvas", { width: 76, height: 76, "aria-hidden": "true" }); requestAnimationFrame(() => drawSigil(cv, hex)); return cv; }
function sealFileJSON(seal) { return JSON.stringify({ id: seal.id, nonce: seal.nonce, plaintext: seal.plaintext, sha256: seal.sha256 }, null, 2) + "\n"; }

async function sealSpec(text, by) {
  const m = M();
  if (m.seal) { m.sealHistory = m.sealHistory || []; m.sealHistory.push({ sha256: m.seal.sha256, at: m.seal.at }); }
  const seal = await makeSeal("SPEC-" + (m.name || "Unnamed"), text);
  seal.level = 3;
  seal.by = by || "User";
  seal.hidden = by === "Operator" && m.disc.open < 4;
  m.seal = seal;
  changed();
  renderMagic();
  toast("Specification sealed · sha256:" + seal.sha256.slice(0, 12) + "…");
}

/* ---- The view ---- */
function applyHints() {
  const m = M();
  for (const w of m.workings) {
    const hint = MAGIC.hints[w];
    if (!hint) continue;
    for (const [k, v] of Object.entries(hint.set || {})) {
      if (k.startsWith("var.")) m.vars[k.slice(4)] = v;
      else if (k.startsWith("src.")) m.src[k.slice(4)] = v;
      else if (k.startsWith("disc.")) m.disc[k.slice(5)] = v;
      else if (k.startsWith("flux.")) m.flux[k.slice(5)] = v;
      else m[k] = v;
    }
    for (const d of hint.domains || []) if (!m.domains.includes(d)) m.domains.push(d);
    for (const r of hint.resources || []) if (!m.resources.includes(r)) m.resources.push(r);
  }
  if (m.common) m.vars.Prevalence = MAGIC.prevalenceFor[m.common] ?? m.vars.Prevalence;
  if (m.resources.length && !m.resources.includes(m.engine.resource)) m.engine.resource = m.resources[0];
  changed();
  renderMagic();
  toast("Suggestions applied, marked as inferences");
}
function loadLattice() {
  const keep = { kernelPicks: M().kernelPicks };
  const m = Object.assign(blankMagic(), JSON.parse(JSON.stringify(LATTICE)));
  m.on = true; m.workings = ["Mana Pool", "Elemental"]; m.common = "Widespread"; m.kernelPicks = keep.kernelPicks;
  m.engine = JSON.parse(JSON.stringify(LATTICE.engine));
  m.price = { domain: "Frost", area: 30, range: 10, duration: 120, mag: 1, targets: 1, mods: ["×2 duration"], ambiguous: false, parity: false, rank: 5 };
  m.balance = { Omnipotence: "Apex: nothing alters a Prohibition or affects more than one city block.", Omniscience: "Mind is surface only; no reading of memory.",
    Omnipresence: "Space is short range only.", "Infinite wealth": "Energy is conserved beyond the mana spent; nothing created from nothing above Tier 5." };
  m.lens = { holder: "the User's Character", hardness: 3, known: "The status window: own Rank, pool and Codexed spells.", believed: "" };
  S.magic = m;
  changed();
  renderMagic();
  toast("Loaded SPEC-Lattice, the worked example");
}

function setBlock(num, title, sets, ...body) {
  return h("section", { class: "panel stack" },
    h("div", { class: "portion-head" }, h("span", { class: "rn magic-num" }, roman(num)), h("h2", null, title), h("p", { class: "sets" }, h("b", null, "Sets"), sets)),
    ...body);
}
function scaleRow(id, anchors, value, onPick, extra) {
  const anchorEl = h("p", { class: "anchor" });
  const showAnchor = (v) => {
    const text = anchors.length === 5 ? anchors[v] : v % 2 === 0 ? anchors[v / 2] : `Between “${anchors[(v - 1) / 2]}” and “${anchors[(v + 1) / 2]}”`;
    put(clear(anchorEl), h("i", null, v), text);
  };
  showAnchor(value);
  return h("div", { class: "scale" },
    h("div", { class: "scale-top" }, h("span", { class: "nm" }, id), extra || null),
    h("div", { class: "ticks", role: "group", "aria-label": id }, [0, 1, 2, 3, 4].map((i) => h("button", { type: "button", "aria-pressed": String(i === value), class: i === value ? "is-delta" : "",
      onclick: (ev) => { onPick(i); $$("button", ev.target.parentNode).forEach((b, j) => { b.setAttribute("aria-pressed", String(j === i)); b.className = j === i ? "is-delta" : ""; }); showAnchor(i); changed(); } }, i))),
    anchorEl);
}
function chipToggleList(list, options, cls, onChange) {
  return h("div", { class: "chips" }, options.map((o) => {
    const [name, title] = Array.isArray(o) ? o : [o, null];
    return h("button", { type: "button", class: "chip " + (cls || ""), title, "aria-pressed": String(list.includes(name)),
      onclick: (ev) => { const i = list.indexOf(name); if (i >= 0) list.splice(i, 1); else list.push(name); ev.currentTarget.setAttribute("aria-pressed", String(list.includes(name))); if (onChange) onChange(); changed(); } }, name);
  }));
}

function engineBlock() {
  const m = M(), e = fitEngine(m.engine), p = m.price;
  const table = h("div", { class: "table-wrap" });
  const renderTable = () => {
    fitEngine(e);
    put(clear(table), h("table", null,
      h("thead", null, h("tr", null, ["Tier", "Magnitude", "Area", "Range", "Duration (min)", "Targets", "Gate", "Benchmark"].map((x) => h("th", null, x)))),
      h("tbody", null, Array.from({ length: e.tiers }, (_, i) => {
        const t = i + 1, env = envelope(e, t);
        const cell = (key, attrs) => {
          const el = h("input", Object.assign({ type: key === "magnitude" ? "text" : "number", value: e[key][i], "aria-label": `Tier ${t} ${key}` }, attrs || {}));
          el.addEventListener("input", () => { e[key][i] = key === "magnitude" ? el.value : Number(el.value); changed(); });
          return h("td", null, el);
        };
        const bench = h("input", { type: "text", value: (e.benchmarks || {})[t] || "", "aria-label": `Tier ${t} Benchmark` });
        bench.addEventListener("input", () => { e.benchmarks = e.benchmarks || {}; e.benchmarks[t] = bench.value; changed(); });
        const iMark = (arr) => (arr && arr[i] ? mark("I") : null);
        return h("tr", null, h("td", { class: "num" }, t), h("td", { style: "min-width:150px" }, cell("magnitude").firstChild, " ", iMark(e.magnitudeI)),
          h("td", { class: "num" }, +env.area.toFixed(2) + " m"), h("td", { class: "num" }, +env.range.toFixed(2) + " m"),
          h("td", { style: "min-width:110px" }, cell("duration", { min: 0, step: "any" }).firstChild, " ", h("span", { class: "small muted" }, fmtMin(env.duration)), " ", iMark(e.durationI)),
          h("td", { style: "width:74px" }, cell("targets", { min: 1 }).firstChild), h("td", { style: "width:64px" }, cell("gate", { min: 0, max: 3 }).firstChild),
          h("td", { style: "min-width:150px" }, bench));
      }))));
  };
  renderTable();

  const num = (path, attrs) => bindInput("magic.engine." + path, Object.assign({ type: "number" }, attrs || {}), () => { renderTable(); });
  const out = h("div", { class: "stack" });
  const renderOut = () => {
    const r = priceEffect(e, p);
    clear(out);
    put(out, h("ol", { class: "steps-ol" }, r.steps.map(([k, v]) => h("li", null, h("b", null, k + ". "), v))));
    if (r.prohibited) { put(out, h("div", { class: "notice wax" }, h("b", null, "Prohibited. "), r.prohibited)); return; }
    put(out, h("div", { class: "engine-out" },
      h("div", { class: "stat" }, h("span", { class: "k" }, "Tier"), h("span", { class: "v" }, r.tier), h("span", { class: "note" }, `Gate Ceiling ${r.gate}`)),
      h("div", { class: "stat" }, h("span", { class: "k" }, "Price"), h("span", { class: "v gilt" }, r.price), h("span", { class: "note" }, e.resource)),
      h("div", { class: "stat" }, h("span", { class: "k" }, "Odds"), h("span", { class: "v" }, r.access ? r.rung : "—"), h("span", { class: "note" }, r.access ? "at the caster's own Tier" : "beyond this user's Access")),
      h("div", { class: "stat" }, h("span", { class: "k" }, "Compared with"), h("span", { class: "v", style: "font-size:1.1rem" }, r.bench))));
    const nameIn = h("input", { type: "text", placeholder: "Name for the Codex, e.g. Ford-Ice", "aria-label": "Codex name" });
    put(out, h("div", { class: "row" }, nameIn,
      h("button", { type: "button", class: "btn gilt", onclick: () => {
        const name = nameIn.value.trim() || `${p.domain} effect T${r.tier}`;
        if (m.codex.some((c) => c.name.toLowerCase() === name.toLowerCase())) { toast("Already in the Codex. A Codex entry is never repriced."); return; }
        m.codex.push({ name, domain: p.domain, tier: r.tier, price: r.priceText, bench: r.bench, note: `Area ${p.area} m · Range ${p.range} m · ${fmtMin(p.duration)} · ${p.targets} target(s)${p.mods.length ? " · " + p.mods.join(", ") : ""}`, at: today() });
        changed(); renderMagic(); toast(`Entered ${name} in the Codex`);
      } }, "Enter in the Codex"),
      h("button", { type: "button", class: "btn", disabled: r.access ? null : true, onclick: () => {
        TABLE_PREFILL = { stakes: `Success: ${p.domain} effect at Tier ${r.tier} (${r.priceText} paid). Failure: no effect, Cost paid.`, rung: "Likely", factors: [] };
        go("table");
      } }, "Resolve at the Table →")));
  };
  const reqNum = (key, label, attrs) => {
    const el = h("input", Object.assign({ type: "number", value: p[key], min: 0, step: "any" }, attrs || {}));
    el.addEventListener("input", () => { p[key] = Number(el.value); renderOut(); changed(); });
    return field(label, el);
  };
  const domainSel = h("select", { "aria-label": "Domain" }, h("option", { value: "" }, "— choose —"), m.domains.map((d) => h("option", { value: d, selected: d === p.domain ? true : null }, d)));
  domainSel.addEventListener("change", () => { p.domain = domainSel.value; renderOut(); changed(); });
  const magSel = h("select", { "aria-label": "Magnitude" }, Array.from({ length: e.tiers }, (_, i) => h("option", { value: i + 1, selected: p.mag === i + 1 ? true : null }, `T${i + 1}: ${e.magnitude[i] || "—"}`)));
  magSel.addEventListener("change", () => { p.mag = Number(magSel.value); renderOut(); changed(); });
  const modChips = h("div", { class: "chips" }, e.modifiers.map((x) => h("button", { type: "button", class: "chip gilt", "aria-pressed": String(p.mods.includes(x.name)),
    onclick: (ev) => { const i = p.mods.indexOf(x.name); if (i >= 0) p.mods.splice(i, 1); else p.mods.push(x.name); ev.currentTarget.setAttribute("aria-pressed", String(p.mods.includes(x.name))); renderOut(); changed(); } }, x.name)));
  const check = (key, label) => {
    const el = h("input", { type: "checkbox", checked: p[key] });
    el.addEventListener("change", () => { p[key] = el.checked; renderOut(); changed(); });
    return h("label", { class: "row tight small" }, el, label);
  };
  renderOut();
  live(renderOut);

  return frag(
    h("div", { class: "grid-3" },
      field("Tiers", num("tiers", { min: 1, max: 12 }), "Apex is the top Tier"),
      field("Area at T1 (m)", num("areaBase", { min: 0, step: "any" })),
      field("Range at T1 (m)", num("rangeBase", { min: 0, step: "any" })),
      field("Growth per Tier", num("growth", { min: 1, step: "any" }), "×2 doubles Area and Range"),
      field("Cost base", num("costBase", { min: 1, step: "any" }), "Price = base^Tier"),
      field("Resource", bindInput("magic.engine.resource")),
      field("Each Modifier adds (%)", num("modPct", { min: 0, step: "any" })),
      field("Modifier stacking", bindSelect("magic.engine.stacking", [["additive", "additive (+% each)"], ["compound", "compound (×% each)"]])),
      field("Modifiers that raise the Tier", num("modRaise", { min: 1 }), "count of Modifiers on one effect")),
    table,
    h("div", { class: "panel quiet stack" },
      h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§25.8.1"), "The Pricing Procedure"),
        h("h3", null, "Price an effect before its Odds are stated")),
      h("div", { class: "grid-3" }, field("Domain", domainSel), field("Magnitude needed", magSel), reqNum("area", "Area, radius (m)"), reqNum("range", "Range (m)"),
        reqNum("duration", "Duration (minutes)"), reqNum("targets", "Targets", { min: 1, step: 1 }), reqNum("rank", "Caster's Rank (highest Tier)", { min: 0, step: 1 })),
      h("div", { class: "stack tight" }, h("span", { class: "field-label" }, "Modifiers"), modChips),
      h("div", { class: "row" }, check("ambiguous", "Placement could fall at either of two Tiers (round up)"), check("parity", "Exceeds its Tier's Benchmarks in aggregate")),
      out));
}

function specPanel() {
  const m = M();
  const box = h("div", { class: "stack" });
  const sheet = h("pre", { class: "sheet" });
  const checks = h("div", { class: "stack tight" });
  const sealBox = h("div", { class: "stack tight" });
  const renderSheet = () => {
    sheet.textContent = specSheet();
    clear(checks);
    for (const c of specChecks()) put(checks, h("div", { class: "test", style: "padding:6px 0" },
      pill(c.ok === true ? "pass" : c.ok === "warn" ? "warn" : "fail", c.ok === true ? "pass" : c.ok === "warn" ? "note" : "open"),
      h("span", { class: "nm" }, c.name), h("span", { class: "why" }, c.why)));
    clear(sealBox);
    if (m.seal) {
      const stale = !m.seal.hidden && m.seal.plaintext !== specSheet() && m.seal.by !== "Operator";
      put(sealBox, h("div", { class: "seal" }, sigil(m.seal.sha256),
        h("div", { class: "stack tight" }, h("span", { class: "id" }, m.seal.id), h("span", { class: "dg" }, "sha256:" + m.seal.sha256),
          h("span", { class: "small muted" }, `Level 3 Hash Seal · ${m.seal.at.replace("T", " ")} · by ${m.seal.by}`))));
      if (stale) put(sealBox, h("div", { class: "notice" }, h("b", null, "Changed since sealing. "), "An amendment reseals the Specification; the old digest stays in the Record."));
      put(sealBox, h("div", { class: "row tight" },
        h("button", { type: "button", class: "btn sm", onclick: () => saveFile(`${m.seal.id}.json`, sealFileJSON(m.seal)) }, "Save seal file"),
        h("button", { type: "button", class: "btn sm", onclick: () => copyText(`${m.seal.id} sha256:${m.seal.sha256}`, "Digest") }, "Copy digest"),
        stale ? h("button", { type: "button", class: "btn sm gilt", onclick: () => sealSpec(specSheet(), "User") }, "Reseal") : null));
      put(sealBox, h("p", { class: "small muted" }, "Verify anywhere: ", h("span", { class: "mono" }, `python scripts/seal.py verify ${m.seal.id}.json`)));
    } else {
      put(sealBox, h("p", { class: "small" }, "Never held at Level 0 (§25.12). Seal it so it cannot change without detection."),
        h("button", { type: "button", class: "btn gilt", onclick: () => sealSpec(specSheet(), "User") }, "Seal the Specification"));
    }
  };
  live(renderSheet);
  const hidden = m.seal && m.seal.hidden && !m.seal.revealed;
  put(box,
    h("div", { class: "panel stack" },
      h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§25.4"), "Author tier"), h("h3", null, `SPEC-${m.name || "Unnamed"}`),
        docActions("Specification", () => (hidden ? "(sealed)" : m.seal && m.seal.by === "Operator" ? m.seal.plaintext : specSheet()), `SPEC-${m.name || "unnamed"}.md`)),
      hidden ? h("div", { class: "sealed-block" }, h("b", null, "Sealed by the Operator. Held unread."),
        h("p", { class: "small" }, "The Operator wrote this Specification for a Mode you want to discover. Reading it raises your Disclosure to 4. Break the seal at Revelation, or when you choose."),
        revealButton()) :
        (m.seal && m.seal.by === "Operator" ? h("pre", { class: "sheet" }, m.seal.plaintext) : sheet),
      sealBox),
    h("div", { class: "panel stack" }, h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§25.13"), "Specification Validation"), h("h3", null, "Conjunctive: one open item amends")), checks),
    operatorAuthorPanel());
  return box;
}
function revealButton() {
  let armed = false;
  const b = h("button", { type: "button", class: "btn sm wax", onclick: () => {
    if (!armed) { armed = true; b.textContent = "Confirm: break the seal"; return; }
    M().seal.revealed = true; changed(); renderMagic(); toast("Seal broken. Verify the digest against what you read.");
  } }, "Break the seal");
  return b;
}

function renderMagic() {
  const root = $("#magic-menu");
  const y = window.scrollY;
  clear(root);
  resetLive();
  const m = M();
  const onToggle = h("input", { type: "checkbox", checked: m.on, id: "magicOn" });
  onToggle.addEventListener("change", () => { m.on = onToggle.checked; changed(); });

  const hintsBox = h("div", { class: "stack tight" });
  const renderHints = () => {
    clear(hintsBox);
    const hs = m.workings.filter((w) => MAGIC.hints[w]);
    if (!hs.length) return;
    put(hintsBox, ...hs.map((w) => h("p", { class: "small" }, mark("I"), " ", h("b", null, w + ": "), MAGIC.hints[w].note)),
      h("div", null, h("button", { type: "button", class: "btn sm gilt", onclick: applyHints }, "Apply these suggestions")));
  };
  renderHints();

  const varNote = (k) => {
    const el = h("input", { type: "text", value: m.varNotes[k] || "", placeholder: MAGIC.variables.find((v) => v.id === k)?.dist ? "distribution or deviations (required below 4)" : "reason, one line", "aria-label": k + " reason" });
    el.addEventListener("input", () => { m.varNotes[k] = el.value; changed(); });
    return el;
  };

  const sourceFollow = h("div", { class: "grid-2" });
  const renderSource = () => {
    clear(sourceFollow);
    if (m.src.reserve === "renewable") put(sourceFollow, field("Renewal Rule", bindInput("magic.src.renewal", { placeholder: "what refills it, how fast" })));
    if (["finite", "renewable"].includes(m.src.reserve)) put(sourceFollow, field("Depletion Effect", bindInput("magic.src.depletion", { placeholder: "what happens at zero" })));
    if (m.src.locus === "agentive") put(sourceFollow, field("Terms (the patron's)", bindInput("magic.src.terms", { placeholder: "what the user owes; what follows on default" }), "The patron is a Character with a Stake Card: give it one in Completion."));
    if (m.src.reserve === "shared") put(sourceFollow, field("Share Ledger", bindInput("magic.src.ledger", { placeholder: "who holds what share; what moves shares" })));
    if (m.flux.sign !== "0") put(sourceFollow, field("Flux Driver", bindInput("magic.flux.driver", { placeholder: "what moves it" })), field("Flux Measure", bindInput("magic.flux.measure", { placeholder: "a Clock or a Record count" })));
  };
  renderSource();

  const domainAdd = h("input", { type: "text", placeholder: "Add a Domain, with scope", "aria-label": "New Domain" });
  const domainChips = h("div", { class: "stack tight" });
  const renderDomains = () => {
    put(clear(domainChips), chipToggleList(m.domains, Array.from(new Set([...MAGIC.domains, ...m.domains])), "gilt", () => {}));
  };
  renderDomains();

  const sets = h("div", { class: "stack loose" },
    setBlock(1, "How magic works", "the shape of Parts B to E; picks combine",
      h("div", { class: "options" }, WORKINGS.map((o) => h("button", { type: "button", class: "opt gilt", "aria-pressed": String(m.workings.includes(o.name)),
        onclick: (ev) => { const i = m.workings.indexOf(o.name); if (i >= 0) m.workings.splice(i, 1); else m.workings.push(o.name); ev.currentTarget.setAttribute("aria-pressed", String(m.workings.includes(o.name))); renderHints(); changed(); } },
        h("b", null, o.name), h("span", null, o.desc || "")))),
      hintsBox),
    setBlock(2, "How common magic is", "Prevalence (Part C)",
      h("div", { class: "options" }, COMMON.map((o) => h("button", { type: "button", class: "opt gilt", "aria-pressed": String(m.common === o.name),
        onclick: () => { m.common = m.common === o.name ? "" : o.name; if (m.common) m.vars.Prevalence = MAGIC.prevalenceFor[m.common]; changed(); renderMagic(); } },
        h("b", null, o.name), h("span", null, o.desc || ""), h("em", null, "Prevalence " + MAGIC.prevalenceFor[o.name]))))),
    setBlock(3, "Identity", "Part A",
      h("div", { class: "grid-2" }, field("Name", bindInput("magic.name", { placeholder: "a working name is enough" })),
        field("Mundane Baseline", bindInput("magic.baseline"))),
      field("Seed", bindInput("magic.seed", { placeholder: "the one core concept, in one line" }), "A disputed entry is read toward the Seed."),
      field("Boundary", bindInput("magic.boundary", { placeholder: "what it covers, and where it stops" }))),
    setBlock(4, "Mechanism Core", "Part B",
      h("div", { class: "stack tight" }, h("span", { class: "field-label" }, "Substrate: what magic is in this world"),
        h("div", { class: "chips" }, MAGIC.substrates.map((s) => h("button", { type: "button", class: "chip gilt", "aria-pressed": String(m.substrate === s),
          onclick: () => { m.substrate = m.substrate === s ? "" : s; changed(); renderMagic(); } }, s))),
        bindInput("magic.substrate", { "aria-label": "Substrate" })),
      field("Operation", bindArea("magic.operation", { placeholder: "what the user does → what the Substrate does → what results" })),
      h("div", { class: "grid-2" }, field("Invariants", bindArea("magic.invariants", { placeholder: "laws true of every instance" })),
        field("Prohibitions", bindArea("magic.prohibitions", { placeholder: "what it never does, under any condition" }))),
      h("div", { class: "stack tight" }, h("span", { class: "field-label" }, "Generativity (§25.7)"),
        seg(MAGIC.architectures.map((a) => a[0]), m.arch, (v) => { m.arch = v; changed(); renderMagic(); }, "Generativity"),
        h("p", { class: "small muted" }, MAGIC.architectures.find((a) => a[0] === m.arch)?.[1] || "")),
      m.arch === "Rule" || m.arch === "Enumerated" ? field("Effects Catalogue", bindArea("magic.catalogue", { class: "tall", placeholder: "E1, Hold: a door or lid will not open. Range touch; Duration until the salt dissolves; Success Likely; Gate Ceiling 1." })) : null,
      h("div", { class: "row" },
        h("label", { class: "row tight small" }, (() => { const c = h("input", { type: "checkbox", checked: m.staged }); c.addEventListener("change", () => { m.staged = c.checked; changed(); renderMagic(); }); return c; })(), "Staged effects (Preparation, then Release) and Products"),
        h("label", { class: "row tight small" }, (() => { const c = h("input", { type: "checkbox", checked: m.production }); c.addEventListener("change", () => { m.production = c.checked; changed(); renderMagic(); }); return c; })(), "Crafting: a Production Rule")),
      m.staged ? field("Stages and Products", bindArea("magic.stagesText", { placeholder: "Stages: Price · time · performer · shareable? · interrupted by. Products: Vessel · Trigger · Shelf · Uses · Transferability" })) : null,
      m.production ? field("Production Rule", bindArea("magic.productionText", { placeholder: "Inputs · Processes · Producer · Output Space · Grade Function · Side-Effect Function · Failure" })) : null),
    setBlock(5, "Source and Flux", "Part C, categorical",
      h("div", { class: "grid-2" },
        h("div", { class: "stack tight" }, h("span", { class: "field-label" }, "Locus"), seg(MAGIC.loci.map((l) => l[0]), m.src.locus, (v) => { m.src.locus = v; changed(); renderMagic(); }),
          h("p", { class: "small muted" }, MAGIC.loci.find((l) => l[0] === m.src.locus)?.[1])),
        h("div", { class: "stack tight" }, h("span", { class: "field-label" }, "Reserve"), seg(MAGIC.reserves.map((l) => l[0]), m.src.reserve, (v) => { m.src.reserve = v; changed(); renderMagic(); }),
          h("p", { class: "small muted" }, MAGIC.reserves.find((l) => l[0] === m.src.reserve)?.[1]))),
      h("div", { class: "stack tight" }, h("span", { class: "field-label" }, "Flux: is the world's magic waxing or waning?"),
        seg(MAGIC.flux, m.flux.sign, (v) => { m.flux.sign = v; changed(); renderMagic(); })),
      sourceFollow),
    setBlock(6, "The Variables", "Part C, anchored 0 to 4 (§25.9)",
      ...MAGIC.variables.map((v) => scaleRow(v.id, v.a, m.vars[v.id], (i) => { m.vars[v.id] = i; }, null)),
      h("div", { class: "grid-2" }, MAGIC.variables.map((v) => field(v.id + " · note", varNote(v.id))))),
    setBlock(7, "The Price", "the Cost Function's Price vector",
      h("p", { class: "small muted" }, "Every resource an effect spends. Strict Cost: each is paid on the page whenever its conditions are met."),
      chipToggleList(m.resources, MAGIC.resources, "gilt")),
    m.arch === "Grammar" || m.arch === "Mixed" ? setBlock(8, "Domains", "Part D1: the partition of what the magic can touch",
      domainChips,
      h("div", { class: "row" }, domainAdd, h("button", { type: "button", class: "btn sm", onclick: () => { const v = domainAdd.value.trim(); if (v && !m.domains.includes(v)) { m.domains.push(v); changed(); renderMagic(); } } }, "Add Domain")),
      h("p", { class: "small muted" }, "A request that lies in no Domain is Prohibited. A multi-Domain request is priced in each.")) : null,
    m.arch === "Grammar" || m.arch === "Mixed" ? setBlock(9, "The Effect Grammar", "Part D1: Envelopes, Cost Function, Modifiers, Benchmarks, the Codex",
      engineBlock(),
      h("div", { class: "grid-2" },
        field("Access Rule", bindArea("magic.access", { placeholder: "who reaches which Domains at which Tiers, and how access grows" })),
        h("div", { class: "stack tight" }, h("span", { class: "field-label" }, "Gate kind"), seg(MAGIC.gates.map((g) => g[0]), m.gate, (v) => { m.gate = v; changed(); renderMagic(); }),
          h("p", { class: "small muted" }, MAGIC.gates.find((g) => g[0] === m.gate)?.[1])),
        field("Combination Rule", bindArea("magic.combination", { placeholder: "stacking, concentration, active-effect limit, multi-Domain surcharge" })),
        field("Apex Rule", bindArea("magic.apex", { placeholder: "what the top Tier can do; what nothing can do" }))),
      m.codex.length ? h("div", { class: "table-wrap" }, h("table", null, h("thead", null, h("tr", null, ["Codex", "Domain", "Tier", "Price", "Compared with", ""].map((x) => h("th", null, x)))),
        h("tbody", null, m.codex.map((c, i) => h("tr", null, h("td", null, h("b", null, c.name), h("div", { class: "small muted" }, c.note || "")), h("td", null, c.domain), h("td", { class: "num" }, c.tier), h("td", null, c.price), h("td", null, c.bench),
          h("td", null, h("button", { type: "button", class: "btn ghost sm", title: "Void this entry", onclick: () => { m.codex.splice(i, 1); changed(); renderMagic(); } }, "Void"))))))) : null) : null,
    setBlock(10, "Limitations and Interface", "Part E; the Diegetic Interface (§25.8.2)",
      h("div", { class: "grid-2" }, field("Costs", bindArea("magic.costs")), field("Consequences", bindArea("magic.consequences")),
        field("Countermeasures", bindArea("magic.countermeasures")), field("Signature Effects", bindArea("magic.signature", { placeholder: "unique gifts outside the Cost Function, each a Retained Disparity" }))),
      h("div", { class: "stack tight" }, h("span", { class: "field-label" }, "Diegetic Interface"),
        h("div", { class: "chips" }, MAGIC.interfaces.map((s) => h("button", { type: "button", class: "chip gilt", "aria-pressed": String(m.iface === s), onclick: () => { m.iface = s; changed(); renderMagic(); } }, s))),
        m.iface !== "none" ? frag(seg(MAGIC.authority.map((a) => a[0]), m.ifaceAuth, (v) => { m.ifaceAuth = v; changed(); renderMagic(); }),
          h("p", { class: "small muted" }, MAGIC.authority.find((a) => a[0] === m.ifaceAuth)?.[1]), bindInput("magic.ifaceNote", { placeholder: "what it shows, and to whom", "aria-label": "Interface note" })) : null)),
    setBlock(11, "Disclosure and Lens", "how hard the system is to you (§25.10, §25.11)",
      h("p", { class: "small muted" }, "Soft magic is a fully specified system with a low Target Hardness. Your ignorance changes what you are told, never what is true."),
      scaleRow("Target Hardness at opening", MAGIC.lens, m.disc.open, (i) => { m.disc.open = i; }),
      scaleRow("Target Hardness over the horizon", MAGIC.lens, m.disc.horizon, (i) => { m.disc.horizon = i; }),
      h("div", { class: "grid-2" },
        h("div", { class: "stack tight" }, h("span", { class: "field-label" }, "Disclosure Orientation"), seg(MAGIC.orientation.map((o) => o[0]), m.disc.orientation, (v) => { m.disc.orientation = v; changed(); renderMagic(); }),
          h("p", { class: "small muted" }, MAGIC.orientation.find((o) => o[0] === m.disc.orientation)?.[1])),
        field("Resolution Transparency (magic)", bindSelect("magic.disc.resolution", MAGIC.resolution)),
        field("Exposition Bound", bindInput("magic.disc.exposition")),
        h("label", { class: "row tight small" }, (() => { const c = h("input", { type: "checkbox", checked: m.disc.delegation }); c.addEventListener("change", () => { m.disc.delegation = c.checked; changed(); }); return c; })(),
          "Competence Delegation: my Character knows more magic than I do; the Operator renders their competence. I keep the choice to act (S1).")),
      h("div", { class: "grid-2" }, field("Lens holder", bindInput("magic.lens.holder")), field("Lens Hardness (0 to 4)", bindSelect("magic.lens.hardness", MAGIC.lens.map((t, i) => [i, `${i}: ${t}`])))),
      h("div", { class: "grid-2" }, field("Known (entry → source)", bindArea("magic.lens.known")), field("Believed (Claims; ✗ where the Specification contradicts)", bindArea("magic.lens.believed")))),
    setBlock(12, "Balance Record", "Part F: the Boundedness audit, done as a min-maxer would",
      ...MAGIC.unbounded.map((u) => field(u, bindInput(`magic.balance.${u}`, { placeholder: "route found and how it is closed, or \"none found\"" })))),
    setBlock(13, "Kernel lines for magic", "the Kernel, at Compilation (§25.15)",
      h("p", { class: "small muted" }, "Pick the lines to carry into the Kernel when magic is a Signature Choice."),
      h("div", { class: "suggest" }, MAGIC.kernel.map((k) => h("button", { type: "button", "aria-pressed": String(m.kernelPicks.includes(k)),
        style: m.kernelPicks.includes(k) ? "border-style:solid;border-color:var(--gilt);color:var(--ink)" : "",
        onclick: () => { const i = m.kernelPicks.indexOf(k); if (i >= 0) m.kernelPicks.splice(i, 1); else m.kernelPicks.push(k); changed(); renderMagic(); } },
        h("span", { class: "from" }, m.kernelPicks.includes(k) ? "✓ picked" : "pick"), k)))));

  put(root,
    h("div", { class: "view-head" },
      h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§25"), "Magic System Construction"),
      h("h1", null, "Magic Menu"),
      h("p", { class: "lede" }, "Every magic system is hard to its author. Hard and soft describe what you and the Characters have been shown, never what the author holds. Pick what the magic is like; the Menu writes the Specification, prices any spell through its Grammar, and seals it.")),
    h("div", { class: "row" },
      h("label", { class: "row tight", for: "magicOn" }, onToggle, h("span", null, "This Mode has magic")),
      h("button", { type: "button", class: "btn", onclick: loadLattice }, "Load the worked example: SPEC-Lattice"),
      h("button", { type: "button", class: "btn ghost", onclick: () => { S.magic = blankMagic(); S.magic.on = true; changed(); renderMagic(); } }, "Start a blank Specification")),
    h("div", { class: "split" }, sets, h("aside", { class: "sticky" }, specPanel())));
  window.scrollTo({ top: y });
}
RENDER["magic-menu"] = renderMagic;
