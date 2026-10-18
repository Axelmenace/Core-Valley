/* ===== Deployment (§12): Declaration → Completion → Validation → Election → Compilation →
   Proving → Amendment → Assent → Activation ===== */

const STEPS = FRAMEWORK.sequence;
const DRIFT_CLASSES = [...FRAMEWORK.drift.map((d) => d[0]), ...MAGIC.drift.map((d) => d[0])];
const touchstoneWords = () => words(S.touchstone);
const touchstoneOk = () => touchstoneWords() >= 80 && touchstoneWords() <= 200;
const kernelWords = () => words(kernelLines().join(" "));
/* §11.8 asks two to four at Full; the Light Sheet carries "the Signature Choice you made and why". */
const minSignature = () => (S.ceremony === "Full" ? 2 : 1);
const PARAM_IN_KERNEL =new RegExp("\\b(" + [...GRADED, "Turn Budget"].join("|") + ")\\s*[:=]?\\s*\\d", "i");

function setDecl(key, value) { S.decl[key] = value; S.decl.marks[key] = "U"; }

/* §10.5: eight conjunctive tests. ok is true, false, or "warn" (passes, with a note). */
function validation() {
  const T = [];
  const full = S.ceremony === "Full";
  const light = S.ceremony === "Light";
  const kl = kernelLines().length;
  const burden = S.decl.burden;
  const aboveScene = ["Part-bound", "Long-term", "Archival"].includes(burden);

  const miss = [];
  if (!S.decl.intent.trim()) miss.push("an Intent Statement");
  else if (sentenceCount(S.decl.intent) > 3) miss.push("an Intent of one to three sentences");
  if (!S.baseline) miss.push("a Baseline Posture");
  if (!S.seats.user.trim() || !S.seats.operator.trim()) miss.push("both Seats");
  if (light && (kl < 3 || kl > 5)) miss.push("a Kernel of three to five lines");
  if (full && (kl < 1 || kl > 7)) miss.push("a Kernel of at most seven lines");
  if (kl && kernelWords() > 150) miss.push("a Kernel of at most 150 words");
  if (full && !touchstoneOk()) miss.push("a Touchstone of 80 to 200 words");
  if (light && deltaList().length > 6) miss.push("at most six Deltas");
  T.push({ name: "Completeness", ok: !miss.length, why: miss.length ? "Missing " + miss.join(", ") + "." :
    `Intent, Baseline, Seats, Kernel${full ? ", Touchstone" : ""} and the Interrupt ([[HOLD]]) are present${aboveScene ? "; the Record is designated (this site, with JSON export)" : ""}.` });

  const conflicts = [], notes = [];
  const no = S.decl.narrative || baseVal("Narrative Organization") || "";
  const lowNarr = ["Absent", "Latent", "Retrospective"].includes(no);
  if (lowNarr && Number(effective("Pressure")) >= 3) conflicts.push(`Pressure ${effective("Pressure")} imposes complications that Narrative Organization ${no} does not license (§4.3)`);
  const pp = S.deltas["Plot Protection"];
  if (lowNarr && pp && Number(pp.value) >= 2) conflicts.push(`Plot Protection ${pp.value} presumes plot threads that Narrative Organization ${no} does not develop`);
  if (S.magic.on && !specValid()) conflicts.push("Specification Validation (§25.13) has open items: see the Magic Menu");
  if (Number(effective("Transparency")) < 2 && String(effective("Commitment Level")) === "0") notes.push("Transparency below 2 with Commitment Level 0 cannot demonstrate its adjudications; declare that trade under Capability");
  if (Number(effective("Resistance")) <= 1) notes.push("Resistance at 1 or below drifts toward Accommodation unless Stake Cards hold");
  if (effective("Randomness") === "Seed Tape") notes.push("Seed Tape draws are permitted only with Odds set strictly by the Ladder");
  T.push({ name: "Compatibility", ok: conflicts.length ? false : notes.length ? "warn" : true, why: conflicts.length ? conflicts.join("; ") + "." : notes.length ? notes.join("; ") + "." : "No value contradicts another, including Deltas against Baseline dependencies." });

  const auth = S.authority.filter((a) => a.op);
  T.push({ name: "Authority closure", ok: S.seats.user.trim() && S.seats.operator.trim() ? true : false,
    why: S.seats.user.trim() && S.seats.operator.trim() ? `The Residual Authority Clause resolves every operation not allocated${auth.length ? `; ${auth.length} departure${auth.length > 1 ? "s" : ""} recorded in the Authority Matrix` : ""}.` : "Name both Seats; the Residual Clause then closes authority by construction." });

  const capNotes = [`Randomness: ${effective("Randomness") || "Judgment"}${["Tool Draw", "User Roll"].includes(effective("Randomness")) ? " (this site draws from the browser's entropy source)" : ""}`];
  capNotes.push(`Commitment: up to Level 3 here (SHA-256)`);
  capNotes.push(CAP.sample ? "a live Operator runs in this page" : "Play runs through hand-off to a Claude conversation");
  T.push({ name: "Capability feasibility", ok: true, why: capNotes.join("; ") + ". Assent does not create capability." });

  T.push({ name: "Record feasibility", ok: burden ? true : "warn", why: burden ? `Continuity burden ${burden}. Record Tiers: ${recordTiers()}; kept here and exportable as JSON; Hot Tier near 400 words.` : "Declare a continuity burden so the Record Tiers can be budgeted." });

  const adm = ["Content Dials and Intensity Ceiling as declared"];
  if (needsAdultRule()) adm.push("school with romance runs only with adult characters, entered as a boundary");
  T.push({ name: "Constraint admissibility", ok: true, why: adm.join("; ") + ". The Operator's own limits bind every candidate and are stated at Assent." });

  const sig = S.election.signature.filter((s) => s.value.trim());
  const untraced = sig.filter((s) => !s.traces.trim());
  const minSig = minSignature();
  const purposeOk = S.election.nullElection || (sig.length >= minSig && sig.length <= 4 && !untraced.length);
  T.push({ name: "Purpose fitness", ok: purposeOk, why: S.election.nullElection ? "Null Election declared: the Baseline fits." :
    purposeOk ? (sig.length === 1 ? "One Signature Choice, traced to the Intent, an Aim, or an Inclination." : `${sig.length} Signature Choices, each traced to the Intent, an Aim, or an Inclination.`) :
    sig.length < minSig ? `Name ${minSig === 1 ? "the Signature Choice (one line at Light ceremony)" : "two to four Signature Choices"} in Election, or declare a Null Election.` : sig.length > 4 ? "At most four Signature Choices." : "Trace every Signature Choice to the Intent, a ranked Aim, or an Operator Inclination." });

  const stories = S.premortem.filter((p) => p.story.trim());
  const bound = stories.filter((p) => p.counter.trim() && p.telltale.trim());
  const regress = stories.some((p) => FRAMEWORK.regressionFamily.includes(p.family));
  const need = full ? 3 : 1;
  const driftOk = bound.length >= need && bound.length === stories.length && (!full || regress);
  T.push({ name: "Drift exposure", ok: driftOk, why: driftOk ? `Pre-Mortem present: ${stories.length} failure ${stories.length === 1 ? "story" : "stories"}, each bound to a countermeasure and a Tell-tale${regress ? ", one from the Regression family" : ""}.` :
    `${full ? "Three" : "At least one"} failure ${full ? "stories" : "story"}, each with a countermeasure and a Tell-tale${full ? ", at least one from the Regression family" : ""}.` });
  return T;
}
const validationPasses = () => validation().every((t) => t.ok === true || t.ok === "warn");

function stepStatus(i) {
  const id = STEPS[i].id;
  if (id === "declaration") return S.decl.intent.trim() && S.decl.narrative && S.decl.horizon ? "done" : S.decl.intent.trim() || S.decl.name.trim() ? "part" : "";
  if (id === "completion") return S.baseline && S.seats.user.trim() && S.seats.operator.trim() ? "done" : S.baseline ? "part" : "";
  if (id === "validation") { const v = validation(); return v.every((t) => t.ok === true || t.ok === "warn") ? "done" : v.some((t) => t.ok === true) ? "fail" : ""; }
  if (id === "election") { const n = S.election.signature.filter((s) => s.value.trim()).length; return S.election.nullElection || n >= minSignature() ? "done" : n ? "part" : ""; }
  if (id === "compilation") { const kl = kernelLines().length; if (!kl) return ""; return validation()[0].ok === true ? "done" : "part"; }
  if (id === "proving") return S.proving.status !== "none" ? "done" : S.proving.turns.length ? "part" : "";
  if (id === "amendment") return S.docket.some((d) => d.status === "open") ? "part" : S.assent.user ? "done" : "";
  if (id === "assent") return S.assent.user && S.assent.operator ? "done" : S.assent.user || S.assent.operator ? "part" : "";
  if (id === "activation") return S.active ? "done" : "";
  return "";
}

/* ---- Small builders ---- */
function labelWithMark(text, key) { return h("span", null, text, " ", S.decl[key] && (S.decl[key].length || S.decl[key] === true) ? mark(declMark(key)) : null); }
function declInput(key, attrs) {
  const el = h("input", Object.assign({ type: "text", value: S.decl[key] || "" }, attrs || {}));
  el.addEventListener("input", () => { setDecl(key, el.value); changed(); });
  return el;
}
function declArea(key, attrs) {
  const el = h("textarea", attrs || {});
  el.value = S.decl[key] || "";
  el.addEventListener("input", () => { setDecl(key, el.value); changed(); });
  return el;
}
function chipMulti(list, options, onChange, max) {
  const box = h("div", { class: "chips" });
  const draw = () => {
    put(clear(box), ...options.map((o) => {
      const i = list.indexOf(o);
      return h("button", { type: "button", class: "chip", "aria-pressed": String(i >= 0), disabled: i < 0 && max && list.length >= max ? true : null,
        onclick: () => { if (i >= 0) list.splice(i, 1); else list.push(o); onChange(); draw(); changed(); } },
        max && i >= 0 ? h("span", { class: "x" }, i + 1 + ".") : null, o);
    }));
  };
  draw();
  return box;
}
function rowList(list, makeRow, makeNew, addLabel) {
  const box = h("div", { class: "stack tight" });
  const draw = () => {
    clear(box);
    list.forEach((item, i) => put(box, makeRow(item, i, () => { list.splice(i, 1); changed(); draw(); })));
    put(box, h("div", null, h("button", { type: "button", class: "btn sm", onclick: () => { list.push(makeNew()); changed(); draw(); } }, addLabel)));
  };
  draw();
  return box;
}
function objInput(obj, key, attrs) {
  const el = h(attrs && attrs.area ? "textarea" : "input", Object.assign(attrs && attrs.area ? {} : { type: "text" }, attrs || {}));
  el.removeAttribute("area");
  el.value = obj[key] ?? "";
  el.addEventListener("input", () => { obj[key] = el.value; changed(); });
  return el;
}
function objSelect(obj, key, options) {
  const el = h("select", null, options.map((o) => { const [v, t] = Array.isArray(o) ? o : [o, o]; return h("option", { value: v, selected: String(obj[key]) === String(v) ? true : null }, t); }));
  el.addEventListener("change", () => { obj[key] = el.value; changed(); });
  return el;
}
function stepHead(i, title, line) {
  return h("div", { class: "step-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§12"), `Step ${i + 1} of 9`),
    h("h2", null, h("span", { class: "rn" }, roman(i + 1) + "."), title), h("p", { class: "lede prose" }, line));
}
function stepNav(i) {
  return h("div", { class: "step-nav" },
    i > 0 ? h("button", { type: "button", class: "btn", onclick: () => { S.step = i - 1; changed(); renderDeploy(true); } }, "← " + STEPS[i - 1].name) : h("span"),
    i < STEPS.length - 1 ? h("button", { type: "button", class: "btn primary", onclick: () => { S.step = i + 1; changed(); renderDeploy(true); } }, STEPS[i + 1].name + " →") :
      h("button", { type: "button", class: "btn primary", disabled: S.active ? null : true, onclick: () => go("table") }, "Go to the Table →"));
}

/* ---- Step I: Declaration ---- */
function stepDeclaration() {
  const d = S.decl;
  const intentCount = counter(() => {
    const n = sentenceCount(d.intent);
    return [`${n} sentence${n === 1 ? "" : "s"} · ${words(d.intent)} words`, d.intent.trim() ? (n >= 1 && n <= 3 ? "ok" : "bad") : ""];
  });
  const picks = pickList();
  return frag(
    h("div", { class: "panel stack" }, h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§21.2"), "Ceremony"), h("h3", null, "Choose a ceremony level first")),
      h("div", { class: "grid-3" }, FRAMEWORK.ceremony.map((c) => h("button", { type: "button", class: "posture", "aria-pressed": String(S.ceremony === c.id),
        onclick: () => { S.ceremony = c.id; changed(); renderDeploy(); } }, h("h3", null, c.id), h("p", null, h("b", null, "Use when: "), c.use), h("p", { class: "vals" }, "Produce: " + c.produce))))),
    h("div", { class: "panel stack" },
      h("div", { class: "grid-2" }, field("Mode name", (() => { const el = h("input", { type: "text", value: d.name, placeholder: "e.g. The Drowned Throne" }); el.addEventListener("input", () => { d.name = el.value; changed(); }); return el; })())),
      h("label", { class: "field" }, h("span", null, labelWithMark("Intent Statement", "intent")), declArea("intent", { placeholder: "One to three sentences: what the Mode is for, and what success looks like from your side. An experience, not a plot." }),
        h("div", { class: "spread" }, h("span", { class: "field-hint" }, "“A political game in which every advantage is paid for and the world never softens to the player”, not “the player becomes Warden”."), intentCount))),
    h("div", { class: "panel stack" },
      h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§4"), "Purpose Profile"), h("h3", null, "What kind of interaction")),
      h("div", { class: "stack tight" }, h("span", { class: "field-label" }, labelWithMark("Interaction Basis", "basis")), chipMulti(d.basis, FRAMEWORK.purpose.basis, () => { d.marks.basis = "U"; })),
      h("div", { class: "stack tight" }, h("span", { class: "field-label" }, labelWithMark("Narrative Organization", "narrative")),
        h("div", { class: "options" }, FRAMEWORK.purpose.narrative.map(([n, t]) => h("button", { type: "button", class: "opt", "aria-pressed": String(d.narrative === n),
          onclick: () => { setDecl("narrative", d.narrative === n ? "" : n); changed(); renderDeploy(); } }, h("b", null, n), h("span", null, t)))),
        h("p", { class: "small muted" }, "The single location of the Mode's disposition toward story. Nothing else may impose development it does not license.")),
      h("div", { class: "grid-3" },
        field(labelWithMark("Initial Context", "context"), (() => { const el = h("select", null, h("option", { value: "" }, "—"), FRAMEWORK.purpose.context.map((c) => h("option", { value: c, selected: d.context === c ? true : null }, c))); el.addEventListener("change", () => { setDecl("context", el.value); changed(); }); return el; })()),
        field(labelWithMark("Temporal horizon", "horizon"), (() => { const el = h("select", null, h("option", { value: "" }, "—"), FRAMEWORK.purpose.horizon.map((c) => h("option", { value: c, selected: d.horizon === c ? true : null }, c))); el.addEventListener("change", () => { setDecl("horizon", el.value); changed(); }); return el; })()),
        field(labelWithMark("Continuity burden", "burden"), (() => { const el = h("select", null, h("option", { value: "" }, "—"), FRAMEWORK.purpose.burden.map(([c, t]) => h("option", { value: c, selected: d.burden === c ? true : null }, `${c} (${t})`))); el.addEventListener("change", () => { setDecl("burden", el.value); changed(); }); return el; })())),
      h("div", { class: "stack tight" }, h("span", { class: "field-label" }, labelWithMark("Aims: at most three, ranked in the order you pick them", "aims")), chipMulti(d.aims, FRAMEWORK.purpose.aims, () => { d.marks.aims = "U"; }, 3)),
      field("Anti-aims: experiences you do not want (they bind Election as hard conditions)", declArea("antiAims", { placeholder: "e.g. no chosen-one destiny; no romance" }))),
    h("div", { class: "panel stack" },
      h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "U"), "Declarations from the Play Menu"),
        h("a", { class: "btn sm", href: "#play-menu" }, picks.length ? "Change picks" : "Open the Play Menu")),
      picks.length ? h("div", { class: "stack tight" }, picks.map((p) => h("p", { class: "small" }, h("b", null, p.label + ": "), p.names.join("; "), h("span", { class: "muted" }, " · sets " + p.sets)))) :
        h("p", { class: "small muted" }, "None. Unsure what to play? The Menu offers eighteen sets in small portions.")),
    h("p", { class: "small muted" }, "The Operator asks at most three questions, infers the rest and marks each inference I so you can correct it. A thin Declaration is not a defect."));
}

/* ---- Step II: Completion ---- */
function gradedScale(g) {
  const b = baseVal(g.id);
  const bNum = typeof b === "number" ? b : null;
  const cur = S.deltas[g.id] && S.deltas[g.id].value !== "" ? Number(S.deltas[g.id].value) : bNum;
  const anchorEl = h("p", { class: "anchor" });
  const reasonBox = h("div", { class: "grid-2" });
  const showAnchor = (v) => {
    clear(anchorEl);
    if (v == null) { put(anchorEl, h("i", null, "—"), typeof b === "string" ? `Baseline: ${b}` : "Not set by the Baseline. Pick a value to write a Delta."); return; }
    put(anchorEl, h("i", null, v), v % 2 === 0 ? g.a[v / 2] : `Between “${g.a[(v - 1) / 2]}” and “${g.a[(v + 1) / 2]}”`);
  };
  const drawReason = () => {
    clear(reasonBox);
    const dl = S.deltas[g.id];
    if (!dl) return;
    put(reasonBox, objInput(dl, "reason", { placeholder: "reason, one line", "aria-label": g.id + " reason" }),
      h("div", { class: "row tight" }, objSelect(dl, "src", [["U", "U · you set it"], ["O", "O · Operator elected"], ["J", "J · jointly"]]),
        objSelect(dl, "force", [["Df", "Default"], ["H", "Hard"], ["K", "Kernel"], ["Pf", "Preference"], ["Asp", "Aspiration"]])));
  };
  showAnchor(cur);
  drawReason();
  const status = h("span", { class: "small" });
  const drawStatus = () => { put(clear(status), S.deltas[g.id] ? frag(mark(S.deltas[g.id].src || "U"), " Delta") : bNum != null ? frag(mark("B"), " Baseline") : h("span", { class: "muted" }, typeof b === "string" ? b : "unset")); };
  drawStatus();
  return h("div", { class: "scale" },
    h("div", { class: "scale-top" }, h("span", { class: "nm" }, g.id, h("small", null, g.domain)), status),
    h("div", { class: "ticks", role: "group", "aria-label": g.id }, [0, 1, 2, 3, 4].map((i) => h("button", { type: "button", "aria-pressed": String(i === cur),
      class: (i === bNum ? "base " : "") + (S.deltas[g.id] && i === cur ? "is-delta" : ""),
      onclick: (ev) => {
        if (i === bNum) delete S.deltas[g.id];
        else S.deltas[g.id] = Object.assign({ src: "U", force: "Df", reason: "" }, S.deltas[g.id] || {}, { value: i });
        $$("button", ev.currentTarget.parentNode).forEach((btn, j) => { btn.setAttribute("aria-pressed", String(j === i)); btn.classList.toggle("is-delta", !!S.deltas[g.id] && j === i); });
        showAnchor(i); drawReason(); drawStatus(); changed();
      } }, i))),
    anchorEl, reasonBox);
}
function categoricalDelta(c) {
  const b = baseVal(c.id);
  const cur = S.deltas[c.id] ? String(S.deltas[c.id].value) : "";
  const el = h("select", { "aria-label": c.id }, h("option", { value: "" }, `Baseline${b != null ? ": " + b : ""}`), c.opts.map((o) => h("option", { value: o, selected: cur === o ? true : null }, o)));
  el.addEventListener("change", () => {
    if (!el.value) delete S.deltas[c.id];
    else S.deltas[c.id] = Object.assign({ src: "U", force: "Df", reason: "" }, S.deltas[c.id] || {}, { value: c.id === "Commitment Level" ? Number(el.value) : el.value });
    changed();
  });
  return field(c.id, el);
}
function characterCard(c, i, remove) {
  const f = (key, label, attrs) => field(label, objInput(c, key, attrs));
  return h("div", { class: "card-edit" },
    h("div", { class: "spread" }, h("div", { class: "row tight" }, h("h3", { style: "font-size:1.2rem" }, c.name || "Unnamed Character"), c.archetype ? h("span", { class: "pill" }, c.archetype) : null, c.src ? mark(c.src) : null),
      h("button", { type: "button", class: "btn ghost sm", onclick: remove }, "Remove")),
    h("div", { class: "grid-3" }, f("name", "Name"), f("archetype", "Archetype")),
    h("p", { class: "field-label" }, "Stake Card (§24.1): the Price is fixed before you start persuading"),
    h("div", { class: "grid-3" }, f("want", "Want"), f("line", "Line (will not do)"), f("price", "Price (what makes them yield)"), f("leverage", "Leverage"), f("tell", "Tell (optional)")),
    h("p", { class: "field-label" }, "Voice Card (§24.3): the counter to Homogenization"),
    h("div", { class: "grid-3" }, f("diction", "Diction (three words)"), f("rhythm", "Rhythm"), f("vtell", "Verbal tell"), f("never", "Never says"), f("sample", "Sample line")));
}
function clockRow(c, i, remove) {
  return h("div", { class: "card-edit" },
    h("div", { class: "grid-3" }, field("Clock", objInput(c, "name", { placeholder: "e.g. The Harbour Watch closes in" })),
      field("Segments", objSelect(c, "segments", [["4", "4"], ["6", "6"], ["8", "8"]])),
      field("Visibility", objSelect(c, "visible", [["true", "visible (a Telegraph)"], ["", "hidden"]]))),
    h("div", { class: "grid-2" }, field("Ticks only when", objInput(c, "ticks", { placeholder: "declared tick conditions" })), field("On completion", objInput(c, "effect", { placeholder: "completion effect" }))),
    h("div", null, h("button", { type: "button", class: "btn ghost sm", onclick: remove }, "Remove Clock")));
}
function stepCompletion() {
  const sb = suggestedBaseline();
  const groups = {};
  for (const g of FRAMEWORK.graded) (groups[g.domain] = groups[g.domain] || []).push(g);
  const dcount = counter(() => { const n = deltaList().length; return [`${n} Delta${n === 1 ? "" : "s"}${S.ceremony === "Light" ? " · Light allows six" : ""}`, S.ceremony === "Light" && n > 6 ? "bad" : "ok"]; });
  const p = posture();
  return frag(
    h("div", { class: "panel stack" },
      h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "App. D"), "Baseline first"), h("h3", null, "Choose the Baseline Posture"),
        sb ? h("span", { class: "small" }, mark("I"), ` suggested: ${sb.id}, from ${sb.why}`) : null),
      h("div", { class: "grid-3" }, FRAMEWORK.postures.map((ps) => h("button", { type: "button", class: "posture", "aria-pressed": String(S.baseline === ps.id),
        onclick: () => { S.baseline = ps.id; S.baselineSrc = "U"; changed(); renderDeploy(); } },
        h("div", { class: "spread" }, h("h3", null, ps.id), S.baseline === ps.id ? mark(S.baselineSrc || "U") : sb && sb.id === ps.id ? mark("I") : null),
        h("p", null, ps.line),
        h("span", { class: "vals" }, `Initiative ${ps.v.Initiative} · Pressure ${ps.v.Pressure} · Resistance ${ps.v.Resistance} · Transparency ${ps.v.Transparency} · ${ps.v["Turn Budget"]} words`)))),
      p ? h("p", { class: "prose small" }, p.desc) : null,
      h("details", null, h("summary", { class: "small muted", style: "cursor:pointer" }, "The full Posture Library"), postureTable())),
    h("div", { class: "panel stack" },
      h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§5.6"), "Only the Deltas"), h("h3", null, "Write only what departs from the Baseline"), dcount),
      h("p", { class: "small muted" }, "B marks the Baseline value. Any other value is a Delta, written with its source and force. Every value the Baseline supplies correctly is a value never written."),
      h("div", { class: "grid-2" }, Object.entries(groups).map(([dom, gs]) => h("div", null, h("p", { class: "group-name" }, dom), ...gs.map(gradedScale)))),
      h("div", { class: "grid-3" }, FRAMEWORK.categorical.map(categoricalDelta),
        field("Turn Budget: fewest words", bindInput("budget.min", { type: "number", min: 0, placeholder: String((baseVal("Turn Budget") || "").split(" to ")[0] || "") })),
        field("Turn Budget: most words", bindInput("budget.max", { type: "number", min: 0, placeholder: String((baseVal("Turn Budget") || "").split(" to ")[1] || "") })),
        field("Hand-back Granularity", bindSelect("handback", [["", `Baseline: ${baseVal("Hand-back Granularity") || "—"}`], "Beat", "Exchange", "Scene", "Section", "Resolution"])))),
    h("div", { class: "panel stack" },
      h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§6"), "Seats and authority"), h("h3", null, "Who holds what")),
      h("div", { class: "grid-2" }, field("Your Seats", bindInput("seats.user", { placeholder: "e.g. Character (Vess)" })), field("The Operator's Seats", bindInput("seats.operator", { placeholder: "e.g. World, every Operator Character, Adjudicator" }))),
      h("p", { class: "small muted" }, "The Residual Authority Clause resolves every operation you do not allocate: your Character's action, speech and interiority stay yours (S1, S2). Record only departures."),
      rowList(S.authority, (a, i, remove) => h("div", { class: "grid-3", style: "align-items:end" },
        field("Operation", objSelect(a, "op", [["", "—"], ...FRAMEWORK.seats.map(([c, t]) => [c, `${c}: ${t}`]), ["Above Tier 1", "Any operation above Tier 1 of the Consequence Gate"]])),
        field("Holder", objSelect(a, "holder", [["U", "U · User"], ["O", "O · Operator"], ["J", "J · Proposal and uptake"], ["R", "R · Resolution Protocol"], ["N", "N · no holder: prohibited"]])),
        h("div", { class: "row tight" }, objInput(a, "note", { placeholder: "exercise, note" }), h("button", { type: "button", class: "btn ghost sm", onclick: remove }, "Remove"))),
        () => ({ op: "", holder: "O", exercise: "", note: "" }), "Add a departure")),
    h("div", { class: "panel stack" },
      h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§5.6.6"), "Mode-specific material"), h("h3", null, "Setting, world rules, magic")),
      field("Setting", bindArea("world.setting", { placeholder: "where and when; the Play Menu fills this from your setting picks" })),
      field("World rules the Operator is likely to regress against", bindArea("world.rules", { placeholder: "e.g. Nothing happens to the train that neither Party caused." })),
      h("div", { class: "row" }, S.magic.on ? frag(pill("warn", "magic"), h("span", { class: "small" }, magicLine())) : h("span", { class: "small muted" }, "No magic in this Mode."),
        h("a", { class: "btn sm", href: "#magic-menu" }, S.magic.on ? "Open the Magic Menu" : "Add magic"))),
    h("div", { class: "panel stack" },
      h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§24"), "Characters"), h("h3", null, "Stake Cards and Voice Cards")),
      rowList(S.characters, characterCard, () => ({ id: uid(), name: "", archetype: "", want: "", line: "", price: "", leverage: "", tell: "", diction: "", rhythm: "", vtell: "", never: "", sample: "" }), "Add a Character")),
    h("div", { class: "panel stack" },
      h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§15.8"), "Clocks at Activation"), h("h3", null, "Every standing threat on a Clock")),
      rowList(S.clocks, clockRow, () => ({ id: uid(), name: "", segments: "6", filled: 0, ticks: "", effect: "", visible: "true", log: [] }), "Add a Clock")),
    h("div", { class: "panel stack" },
      h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§19"), "Constraints"), h("h3", null, "Content Dials and boundaries")),
      h("p", { class: "small muted" }, FRAMEWORK.dials.map(([d, t]) => `${d}: ${t}`).join(" ")),
      rowList(S.constraints.dials, (dl, i, remove) => h("div", { class: "grid-3", style: "align-items:end" }, field("Subject", objInput(dl, "subject", { placeholder: "e.g. torture" })),
        field("Dial", objSelect(dl, "dial", ["Open", "Veiled", "Lined"])), h("div", null, h("button", { type: "button", class: "btn ghost sm", onclick: remove }, "Remove"))),
        () => ({ subject: "", dial: "Veiled" }), "Add a Content Dial"),
      needsAdultRule() ? h("div", { class: "notice wax" }, h("b", null, "Boundary from the Play Menu. "), "All characters are adults; the academy is a university or military college.") : null,
      h("div", { class: "grid-2" }, field("Operator boundaries", bindArea("constraints.boundaries")), field("Value depiction (Attribution, Enactment, Structural Validation, Rhetorical Advocacy)", bindArea("constraints.depiction")),
        field("Persistent across Parts", bindArea("constraints.persistent")))),
    h("div", { class: "panel stack" },
      h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§9"), "Capability"), h("h3", null, "What this environment can actually do")),
      h("p", { class: "small" }, capabilityEnvironment()),
      field("Qualifications and fallbacks: what the Operator cannot reliably do here", bindArea("capability.notes"))),
    operatorElectPanel());
}
function postureTable() {
  return h("div", { class: "table-wrap", style: "margin-top:10px" }, h("table", null,
    h("thead", null, h("tr", null, h("th", null, "Parameter"), FRAMEWORK.postures.map((p) => h("th", { class: p.id === S.baseline ? "hl" : null }, p.id)))),
    h("tbody", null, FRAMEWORK.postureRows.map((r) => h("tr", null, h("td", null, r), FRAMEWORK.postures.map((p) => h("td", { class: p.id === S.baseline ? "hl" : null }, String(p.v[r] ?? "—"))))))));
}

/* ---- Step III: Validation ---- */
function stepValidation() {
  const testsEl = h("div");
  live(() => {
    clear(testsEl);
    for (const t of validation()) put(testsEl, h("div", { class: "test" }, pill(t.ok === true ? "pass" : t.ok === "warn" ? "warn" : "fail", t.ok === true ? "pass" : t.ok === "warn" ? "note" : "fails"),
      h("span", { class: "nm" }, t.name), h("span", { class: "why" }, t.why)));
  });
  const summary = h("p", { class: "small" });
  live(() => { const v = validation(); const n = v.filter((t) => t.ok === true || t.ok === "warn").length; summary.textContent = `${n} of 8 pass. Passing seven does not carry the eighth.`; });
  return frag(
    h("div", { class: "panel stack" }, h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§10.5"), "Conjunctive"), h("h3", null, "Eight tests"), summary), testsEl),
    S.magic.on ? h("div", { class: "panel stack" }, h("div", { class: "spread" }, h("h3", null, "Specification Validation (§25.13)"), h("a", { class: "btn sm", href: "#magic-menu" }, "Open the Magic Menu")),
      h("div", null, specChecks().map((c) => h("div", { class: "test" }, pill(c.ok === true ? "pass" : c.ok === "warn" ? "warn" : "fail", c.ok === true ? "pass" : c.ok === "warn" ? "note" : "open"), h("span", { class: "nm" }, c.name), h("span", { class: "why" }, c.why))))) : null,
    h("div", { class: "panel stack" },
      h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§10.6"), "Pre-Mortem"), h("h3", null, "Suppose the Mode has failed by the end of its second Part")),
      h("p", { class: "small muted" }, "Write the three most likely stories of that failure, one sentence each, at least one from the Regression family. Bind each to a countermeasure (a Kernel line, a Card, a Delta, a Clock) and to the Tell-tale that would show it first. This becomes the Drift Watch."),
      ...S.premortem.map((pm, i) => h("div", { class: "card-edit" },
        h("div", { class: "grid-2" }, field(`Failure story ${i + 1}`, objInput(pm, "story", { area: true, placeholder: "one sentence" })),
          field("Drift class", objSelect(pm, "family", [["", "—"], ...DRIFT_CLASSES.map((d) => [d, d + (FRAMEWORK.regressionFamily.includes(d) ? " · Regression" : "")])]))),
        h("div", { class: "grid-2" }, field("Countermeasure", objInput(pm, "counter")), field("Tell-tale", objInput(pm, "telltale")))))));
}

/* ---- Step IV: Election ---- */
function stepElection() {
  const e = S.election;
  const avg = h("div");
  live(() => {
    clear(avg);
    const nums = GRADED.map((g) => effective(g)).filter((v) => typeof v === "number" || (v !== "" && !isNaN(Number(v)) && v !== null && v !== undefined)).map(Number);
    if (nums.length && nums.every((v) => v === 2) && !e.nullElection) put(avg, h("div", { class: "notice" }, h("b", null, "Presumptively averaged. "), "Every graded value sits at 2: the absence of a decision in the costume of balance. Elect; do not average, or state the reason."));
  });
  const traceOpts = [["", "—"], ["Intent", "the Intent"], ...S.decl.aims.map((a, i) => [`Aim ${i + 1}: ${a}`, `Aim ${i + 1}: ${a}`]), ["Operator Inclination", "Operator Inclination"]];
  const suggestions = deltaList().filter((d) => !e.signature.some((s) => s.value.startsWith(d.param))).slice(0, 6);
  return frag(
    h("div", { class: "panel stack" },
      h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§11.2"), "Election Rule"), h("h3", null, "How the Operator chooses")),
      h("div", { class: "options" }, FRAMEWORK.electionRules.map(([r, t]) => h("button", { type: "button", class: "opt", "aria-pressed": String(e.rule === r), onclick: () => { e.rule = r; changed(); renderDeploy(); } }, h("b", null, r), h("span", null, t)))),
      e.rule === "Contrast" ? field("Contrast Reference (your Declaration, another Régime, or the Baseline)", bindInput("election.reference")) : null,
      e.rule === "Stochastic" ? h("p", { class: "small" }, "Draws among satisfactory candidates come from this site's Tool Draw.") : null),
    h("div", { class: "panel stack" },
      h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§11.8"), "Signature Choices"), h("h3", null, S.ceremony === "Full" ? "Two to four values that most distinguish the Mode" : "The value that most distinguishes the Mode, and up to three more")),
      h("label", { class: "row tight" }, (() => { const c = h("input", { type: "checkbox", checked: e.nullElection }); c.addEventListener("change", () => { e.nullElection = c.checked; changed(); renderDeploy(); }); return c; })(),
        "Null Election: the Baseline fits as it is"),
      e.nullElection ? null : frag(
        rowList(e.signature, (s, i, remove) => h("div", { class: "card-edit" },
          h("div", { class: "grid-3" }, field(`Signature Choice ${i + 1}`, objInput(s, "value", { placeholder: "e.g. Resistance 3" })), field("Traces to", objSelect(s, "traces", traceOpts)),
            field("Cost accepted", objInput(s, "cost", { placeholder: "what it costs" }))),
          h("div", null, h("button", { type: "button", class: "btn ghost sm", onclick: remove }, "Remove"))),
          () => ({ value: "", traces: "", cost: "" }), "Add a Signature Choice"),
        suggestions.length ? h("div", { class: "suggest" }, h("span", { class: "field-label" }, "From your Deltas"), suggestions.map((d) => h("button", { type: "button",
          onclick: () => { e.signature.push({ value: `${d.param} ${d.value}`, traces: "", cost: "" }); changed(); renderDeploy(); } }, h("span", { class: "from" }, "Delta"), `${d.param} ${d.value}${d.reason ? ": " + d.reason : ""}`))) : null),
      avg),
    h("div", { class: "panel stack" },
      h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§11.7"), "Election statement"), h("h3", null, "Short, readable, not a defence brief")),
      h("div", { class: "grid-2" }, field("Principal reasons", bindArea("election.reasons")), field("Trade-offs accepted", bindArea("election.tradeoffs")), field("Material uncertainty", bindArea("election.uncertainty")))));
}

/* ---- Step V: Compilation ---- */
function kernelSuggestions() {
  const out = [];
  for (const s of S.election.signature.filter((x) => x.value.trim())) out.push(["Signature", `Hold ${s.value} in conduct: ${s.traces ? "it serves " + s.traces.replace(/^Aim \d: /, "") : "it is what makes this Mode itself"}.`]);
  for (const p of S.premortem.filter((x) => x.counter.trim() && !/^K\d/.test(x.counter.trim()))) out.push(["Pre-Mortem", p.counter.trim().replace(/\.?$/, ".")]);
  for (const k of S.magic.on ? S.magic.kernelPicks : []) out.push(["Magic", k]);
  for (const k of FRAMEWORK.kernelStock) out.push(["Stock", k]);
  return out.filter(([, t]) => !kernelLines().includes(t));
}
function stepCompilation() {
  const kbox = h("div", { class: "stack tight" });
  const drawKernel = () => {
    clear(kbox);
    S.kernel.forEach((line, i) => {
      const ta = h("textarea", { rows: 2, "aria-label": `K${i + 1}`, style: "min-height:2.6em" });
      ta.value = line;
      ta.addEventListener("input", () => { S.kernel[i] = ta.value; changed(); });
      put(kbox, h("div", { class: "kernel-line" }, h("span", { class: "k" }, `K${i + 1}`), ta,
        h("button", { type: "button", class: "btn ghost sm", "aria-label": `Remove K${i + 1}`, onclick: () => { S.kernel.splice(i, 1); changed(); drawKernel(); drawSuggest(); } }, "×")));
    });
    put(kbox, h("div", null, h("button", { type: "button", class: "btn sm", disabled: S.kernel.length >= 7 ? true : null, onclick: () => { S.kernel.push(""); changed(); drawKernel(); } }, "Add a line")));
  };
  const sbox = h("div", { class: "suggest" });
  const drawSuggest = () => {
    put(clear(sbox), h("span", { class: "field-label" }, "Draw Kernel lines from"), ...kernelSuggestions().slice(0, 10).map(([from, t]) => h("button", { type: "button", disabled: S.kernel.length >= 7 ? true : null,
      onclick: () => { S.kernel.push(t); changed(); drawKernel(); drawSuggest(); } }, h("span", { class: "from" }, from), t)));
  };
  drawKernel(); drawSuggest();
  const kcount = counter(() => {
    const n = kernelLines().length, w = kernelWords();
    const lo = S.ceremony === "Light" ? 3 : 1, hi = S.ceremony === "Light" ? 5 : 7;
    return [`${n} line${n === 1 ? "" : "s"} (${lo} to ${hi}) · ${w} of 150 words`, n >= lo && n <= hi && w <= 150 ? "ok" : "bad"];
  });
  const lint = h("div");
  live(() => {
    clear(lint);
    const bad = kernelLines().filter((k) => PARAM_IN_KERNEL.test(k));
    if (bad.length) put(lint, h("div", { class: "notice" }, h("b", null, "Conduct, not values. "), `A Kernel line states observable conduct, not a parameter value: “Operator Characters yield only when their Price is met, and say what met it”, not “Resistance 3”. Check: ${bad.map((b) => "“" + b + "”").join(" ")}`));
  });
  const tcount = counter(() => { const n = touchstoneWords(); return [`${n} words (80 to 200)`, n === 0 ? "" : touchstoneOk() ? "ok" : "bad"]; });
  const sheetPre = h("pre", { class: "sheet" });
  const briefPre = h("pre", { class: "sheet" });
  const bcount = counter(() => { const n = words(brief()); return [`${n} words (400 to 900)`, n >= 400 && n <= 900 ? "ok" : ""]; });
  live(() => { sheetPre.textContent = S.ceremony === "Full" ? instrument() : lightSheet(); briefPre.textContent = brief(); });
  const sheetName = S.ceremony === "Full" ? "Mode Instrument" : "Light Mode Sheet";
  return frag(
    h("div", { class: "panel stack" },
      h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§22.2"), "Kernel"), h("h3", null, "At most seven imperative lines of observable conduct"), kcount),
      h("p", { class: "small muted" }, "Restated verbatim at the top of every Checkpoint. That re-anchoring is the main defence against salience decay."),
      kbox, lint, sbox),
    h("div", { class: "panel stack" },
      h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§22.4"), "Touchstone"), h("h3", null, "A ratified sample continuation"), tcount),
      h("p", { class: "small muted" }, `It anchors Distance, Grain, Density, Register and length by example, and outranks every verbal description of style. ${S.ceremony === "Full" ? "Required at Full ceremony." : "Optional at Light ceremony."} A good Proving continuation usually becomes the Touchstone.`),
      bindArea("touchstone", { class: "tall", placeholder: "80 to 200 words, written in the voice the Mode should keep" })),
    h("div", { class: "panel stack" },
      h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, S.ceremony === "Full" ? "§5.6" : "§21.2"), sheetName), h("h3", null, "What you will assent to"),
        docActions(sheetName, () => (S.ceremony === "Full" ? instrument() : lightSheet()), `${fileSlug()}-${S.ceremony === "Full" ? "instrument" : "mode-sheet"}.md`)),
      sheetPre),
    h("div", { class: "panel stack" },
      h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§22.3"), "Operating Brief"), h("h3", null, "Derivative: regenerated whenever the Instrument changes"), bcount,
        docActions("Operating Brief", brief, `${fileSlug()}-operating-brief.md`)),
      briefPre));
}

/* ---- Step VI: Proving (console lives in operator.js) ---- */
function stepProving() {
  if (S.ceremony === "Inline") return h("div", { class: "panel" }, h("p", { class: "prose" }, "A Proving Scene is absent at Inline ceremony. Move on to Assent."));
  return frag(
    h("p", { class: "prose" }, `One to three exchanges played under the candidate, before Assent. It is not Play: all of it is Provisional. At Assent you Retain it (it becomes Canon and opens the first Part) or Discard it. ${S.ceremony === "Full" ? "The default at Full ceremony." : "Optional at Light ceremony."} You may always assent without one.`),
    provingConsole(),
    h("div", { class: "panel stack" },
      h("div", { class: "panel-head" }, h("h3", null, "Disposition"), h("span", { class: "pill " + (S.proving.status === "retained" ? "pass" : S.proving.status === "discarded" ? "fail" : "") }, S.proving.status)),
      h("div", { class: "row" },
        h("button", { type: "button", class: "btn primary", disabled: S.proving.turns.length ? null : true, onclick: () => { S.proving.status = "retained"; changed(); renderDeploy(); toast("Retained: it will open the first Part"); } }, "Retain"),
        h("button", { type: "button", class: "btn", disabled: S.proving.turns.length ? null : true, onclick: () => { S.proving.status = "discarded"; changed(); renderDeploy(); toast("Discarded: Void, branch-abandoned"); } }, "Discard"),
        h("button", { type: "button", class: "btn ghost", onclick: () => { S.proving.status = "none"; changed(); renderDeploy(); } }, "Assent without one"),
        h("button", { type: "button", class: "btn ghost", disabled: S.proving.turns.some((t) => t.role === "operator") ? null : true, onclick: () => {
          const last = S.proving.turns.filter((t) => t.role === "operator").pop();
          S.touchstone = last.content.trim(); changed(); toast("Adopted as the Touchstone");
        } }, "Adopt the last continuation as the Touchstone"))));
}

/* ---- Step VII: Amendment ---- */
function stepAmendment() {
  const v = h("p", { class: "small" });
  live(() => { const n = validation().filter((t) => t.ok === true || t.ok === "warn").length; v.textContent = `Re-validated with every change: ${n} of 8 pass. The Compilation regenerates on its own.`; });
  return frag(
    h("p", { class: "prose" }, "Either Party may amend anything that is not framework-fixed. Edit any step directly; Validation repeats and the Kernel, Brief and Sheet regenerate. Proposals still being argued go on the Docket."),
    h("div", { class: "panel stack" }, h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§17.11"), "Amendment Docket"), h("h3", null, "Open proposals"), v),
      rowList(S.docket, (d, i, remove) => h("div", { class: "grid-3", style: "align-items:end" }, field("Proposal", objInput(d, "text")), field("Proposed by", objSelect(d, "by", [["U", "User"], ["O", "Operator"]])),
        h("div", { class: "row tight" }, objSelect(d, "status", ["open", "accepted", "rejected"]), h("button", { type: "button", class: "btn ghost sm", onclick: remove }, "Remove"))),
        () => ({ text: "", by: "U", status: "open" }), "Add a proposal")));
}

/* ---- Step VIII: Assent ---- */
function stepAssent() {
  const ok = validationPasses();
  const userBox = h("input", { type: "checkbox", checked: S.assent.user, disabled: ok ? null : true, id: "assentUser" });
  userBox.addEventListener("change", () => { S.assent.user = userBox.checked; changed(); renderDeploy(); });
  return frag(
    !ok ? h("div", { class: "notice wax" }, h("b", null, "Validation fails. "), "A candidate that fails a test is amended, not assented to. ", h("button", { type: "button", class: "btn sm", onclick: () => { S.step = 2; renderDeploy(); } }, "See Validation")) : null,
    h("div", { class: "panel stack" },
      h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§12.2"), "Your assent"), h("h3", null, "Never presumed from silence")),
      h("p", { class: "small" }, `${modeName()} v${version()} · Baseline ${S.baseline || "—"} · ${deltaList().length} Deltas · ${kernelLines().length} Kernel lines · Touchstone ${touchstoneWords() ? touchstoneWords() + " words" : "none"} · Proving ${S.proving.status}`),
      h("label", { class: "row tight", for: "assentUser" }, userBox, "I assent to the complete candidate: the " + (S.ceremony === "Full" ? "Instrument" : "Mode Sheet") + ", its Kernel and its Touchstone.")),
    operatorAssentPanel());
}

/* ---- Step IX: Activation ---- */
function activate() {
  S.active = { version: "1.0.0", regime: 1, part: 1, at: stamp() };
  if (S.proving.status === "retained") S.play.turns = S.proving.turns.map((t) => Object.assign({}, t, { provisional: false, canon: true }));
  S.play.cp = { moment: "the opening of Part 1", now: S.world.setting || "", pending: "The User's first Move.", drift: "none observed" };
  S.play.checkpoints = [{ n: 0, text: checkpointText(0), confirmed: false, at: stamp() }];
  for (const c of S.clocks) { c.filled = Number(c.filled) || 0; c.log = c.log || []; }
  changed();
  renderDeploy();
  toast(`Activated: ${modeName()} v1.0.0, Régime 1, Part 1`);
}
function stepActivation() {
  const ready = S.assent.user && S.assent.operator;
  if (!S.active) {
    return h("div", { class: "panel stack" },
      h("p", { class: "prose" }, "Activation fixes the version, the first Checkpoint, the first Part and the Régime, and, where continuity outlives the Session, the first Resumption Packet. Play begins in the continuation after Assent, never in the ratification message."),
      ready ? h("div", null, h("button", { type: "button", class: "btn primary", onclick: activate }, "Activate the Mode")) :
        h("div", { class: "notice" }, h("b", null, "Waiting on Assent. "), `${S.assent.user ? "" : "Your assent. "}${S.assent.operator ? "" : "The Operator's assent."}`));
  }
  const docs = [
    [S.ceremony === "Full" ? "Mode Instrument" : "Light Mode Sheet", () => (S.ceremony === "Full" ? instrument() : lightSheet()), `${fileSlug()}-${S.ceremony === "Full" ? "instrument" : "mode-sheet"}.md`],
    ["Operating Brief", brief, `${fileSlug()}-operating-brief.md`],
    ["Activation Instruction", () => ACTIVATION_INSTRUCTION, "activation-instruction.md"],
    ["Resumption Packet", resumptionPacket, `${fileSlug()}-resumption-packet.md`],
    ["Hand-off packet (everything, for a Claude conversation)", handoffPacket, `${fileSlug()}-handoff.md`],
    ["The Record (JSON)", exportJSON, `${fileSlug()}-record.json`],
  ];
  if (S.magic.on && S.magic.seal) docs.splice(3, 0, ["Magic seal file (for scripts/seal.py)", () => sealFileJSON(S.magic.seal), `${S.magic.seal.id}.json`]);
  return frag(
    h("div", { class: "panel stack" },
      h("div", { class: "spread" }, h("div", { class: "stack tight" }, h("p", { class: "eyebrow" }, "Active"), h("h3", null, `${modeName()} v${S.active.version} · Régime ${S.active.regime} · Part ${S.active.part}`),
        h("p", { class: "small muted" }, `Activated ${S.active.at.replace("T", " ")}. First Checkpoint CP-0 is in the Record.`)),
        h("button", { type: "button", class: "btn primary", onclick: () => go("table") }, "Go to the Table →"))),
    h("div", { class: "panel stack" }, h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, "Documents"), h("h3", null, "Everything the Mode needs, in its own words")),
      ...docs.map(([name, fn, file]) => h("div", { class: "spread", style: "padding:8px 0;border-bottom:1px solid var(--rule-2)" }, h("span", null, name), docActions(name, fn, file)))));
}

/* ---- The view ---- */
function importRecord() {
  const input = h("input", { type: "file", accept: ".json,application/json", style: "display:none" });
  input.addEventListener("change", () => {
    const f = input.files && input.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try { const data = JSON.parse(String(r.result)); if (!data || typeof data !== "object" || !data.decl) throw new Error("not a Record"); S = migrate(data); S.example = null; changed(); renderDeploy(); toast("Record imported"); }
      catch (e) { toast("That file is not an exported Record."); }
    };
    r.readAsText(f);
  });
  put(document.body, input);
  input.click();
  setTimeout(() => input.remove(), 60000);
}
function newModeButton() {
  let armed = false;
  const b = h("button", { type: "button", class: "btn sm ghost", onclick: () => {
    if (!armed) { armed = true; b.textContent = "Confirm: clear this Mode"; setTimeout(() => { armed = false; b.textContent = "New Mode"; }, 4000); return; }
    S = blankState(); changed(); renderDeploy(); toast("A blank Mode. The Play Menu is a good place to start.");
  } }, "New Mode");
  return b;
}
function renderDeploy(scrollTop) {
  const root = $("#deploy");
  const y = window.scrollY;
  clear(root);
  resetLive();
  const i = Math.max(0, Math.min(8, S.step || 0));
  const rail = h("nav", { class: "rail", "aria-label": "Deployment sequence" });
  const drawRail = () => {
    put(clear(rail), ...STEPS.map((st, j) => h("button", { type: "button", "aria-current": j === i ? "step" : null, onclick: () => { S.step = j; changed(); renderDeploy(true); } },
      h("span", { class: "rn" }, roman(j + 1)), h("span", null, st.name), h("span", { class: "st " + stepStatus(j), title: stepStatus(j) || "not started" }))));
  };
  live(drawRail);
  const railCol = h("div", { class: "rail-col" }, rail,
    h("div", { class: "rail-foot" },
      h("span", null, `Ceremony: ${S.ceremony}`),
      h("button", { type: "button", class: "btn sm", onclick: () => saveFile(`${fileSlug()}-record.json`, exportJSON()) }, "Export the Record"),
      h("button", { type: "button", class: "btn sm", onclick: importRecord }, "Import a Record"),
      h("button", { type: "button", class: "btn sm ghost", onclick: () => { S = coldHarbour(); changed(); renderDeploy(); toast("Loaded the worked example, Cold Harbour"); } }, "Load the example"),
      newModeButton()));
  const st = STEPS[i];
  const body = { declaration: stepDeclaration, completion: stepCompletion, validation: stepValidation, election: stepElection, compilation: stepCompilation,
    proving: stepProving, amendment: stepAmendment, assent: stepAssent, activation: stepActivation }[st.id]();
  put(root,
    h("div", { class: "view-head" },
      h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§12"), "The deployment sequence"),
      h("h1", null, "Deploy a Mode"),
      S.example ? h("div", { class: "notice verd" }, h("b", null, `This is the worked example, ${S.example}, `), "from the Light Mode Sheet. Edit it, or start a new Mode from the Play Menu or with New Mode below the steps.") : null),
    h("div", { class: "deploy" }, railCol, h("div", { class: "step" }, stepHead(i, st.name, st.line), body, stepNav(i))));
  window.scrollTo({ top: scrollTop ? Math.min(y, root.offsetTop) : y });
}
RENDER.deploy = renderDeploy;
