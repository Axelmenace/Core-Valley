/* ===== compile: the Mode as text. Light Sheet, Instrument, Kernel, Operating Brief, Record ===== */

const GRADED = FRAMEWORK.graded.map((g) => g.id);
const posture = () => FRAMEWORK.postures.find((p) => p.id === S.baseline) || null;
const baseVal = (param) => { const p = posture(); return p ? p.v[param] : undefined; };
const version = () => (S.active ? S.active.version : "1.0.0");
const modeName = () => S.decl.name.trim() || "Untitled Mode";
const kernelLines = () => S.kernel.map((k) => k.trim()).filter(Boolean);
const declMark = (key) => S.decl.marks[key] || "U";

function effective(param) {
  const d = S.deltas[param];
  if (d && d.value !== "" && d.value != null) return d.value;
  return baseVal(param);
}
function budgetText() {
  const { min, max } = S.budget;
  if (min !== "" && max !== "" && min != null && max != null) return `${min} to ${max}`;
  return baseVal("Turn Budget") || "";
}
function handbackText() { return S.handback || baseVal("Hand-back Granularity") || ""; }

/* Deltas: only values that depart from the Baseline are written (§5.6). */
function deltaList() {
  const out = [];
  const order = [...GRADED, ...FRAMEWORK.categorical.map((c) => c.id)];
  for (const k of order) {
    const d = S.deltas[k];
    if (!d || d.value === "" || d.value == null) continue;
    if (String(baseVal(k)) === String(d.value)) continue;
    out.push({ param: k, value: d.value, src: d.src || "U", force: d.force || "", reason: d.reason || "" });
  }
  const bt = budgetText();
  if (bt && bt !== baseVal("Turn Budget")) out.push({ param: "Turn Budget", value: bt + " words", src: S.budget.src || "U", force: "", reason: "" });
  const hb = handbackText();
  if (hb && hb !== baseVal("Hand-back Granularity")) out.push({ param: "Hand-back Granularity", value: hb, src: "U", force: "", reason: "" });
  return out;
}
const srcForce = (d) => `[${d.src}${d.force && d.force !== "Df" ? "·" + d.force : ""}]`;

/* Play Menu picks as Declarations. */
function pickList() {
  const out = [];
  for (const cat of PLAY_MENU.categories) {
    const p = S.picks[cat.key];
    if (!p) continue;
    for (const sub of cat.subs) {
      const names = p[sub.name] || [];
      if (names.length) out.push({ cat: cat.key, sub: sub.name, label: sub.name === "Options" ? cat.key : `${cat.key} / ${sub.name}`, names, sets: cat.sets });
    }
  }
  return out;
}
function picksOf(cat, sub) { return ((S.picks[cat] || {})[sub || "Options"] || []).slice(); }
function allPicksOf(cat) { return Object.values(S.picks[cat] || {}).flat(); }

function magicLine() {
  const m = S.magic;
  if (!m.on) return "none";
  const lvl = m.seal ? (m.seal.level || 3) : "unsealed";
  return `SPEC-${m.name || "Unnamed"} (${m.arch}) · ${m.seal ? "sealed at Level " + lvl : "not yet sealed"} · Target Hardness ${m.disc.open} → ${m.disc.horizon}`;
}
function limitsLine() {
  const parts = S.constraints.dials.filter((d) => d.subject.trim()).map((d) => `${d.subject.trim()}: ${d.dial}`);
  const ic = S.deltas["Intensity Ceiling"];
  if (ic && ic.value !== "" && ic.value != null) parts.push(`Intensity Ceiling ${ic.value}`);
  if (needsAdultRule()) parts.push("all characters are adults (the academy is a university or military college)");
  return parts.join(" · ");
}
function resolutionLine() {
  const r = effective("Randomness") || "Judgment";
  const bands = effective("Outcome Bands") === "Binary" ? "binary outcomes" : "Outcome Bands on";
  return `${r}; ${bands}`;
}
function pad(label, n = 13) { return (label + " ".repeat(n)).slice(0, Math.max(n, label.length + 1)); }
function indentLines(lines, n = 13) { return lines.map((l, i) => (i === 0 ? l : " ".repeat(n) + l)).join("\n"); }

/* assets/mode-sheet-light.md */
function lightSheet() {
  const p = posture();
  const deltas = deltaList().slice(0, 6).map((d) => `${d.param} ${d.value} ${srcForce(d)}${d.reason ? ": " + d.reason : ""}`);
  const kernel = kernelLines().map((k, i) => `K${i + 1} ${k}`);
  const purpose = [S.decl.basis.join(", ") || "—", "narrative organization: " + (S.decl.narrative || effective("Narrative Organization") || "—"), S.decl.horizon || "—"].join(" · ");
  const lines = [
    `MODE: ${modeName()} v${version()}`.padEnd(30) + `Baseline: ${p ? p.id + " 1.0" : "—"}`,
    "",
    pad("Intent") + `${S.decl.intent || "—"} [${declMark("intent")}]`,
    pad("Purpose") + `${purpose} [${declMark("narrative")}]`,
    pad("Seats") + `You: ${S.seats.user || "—"}   Me: ${S.seats.operator || "—"}`,
    pad("Deltas") + (deltas.length ? indentLines(deltas) : "none (Null Election: the Baseline fits)"),
    pad("Kernel") + (kernel.length ? indentLines(kernel) : "—"),
    pad("Resolution") + resolutionLine(),
    pad("Magic") + magicLine(),
  ];
  const lim = limitsLine();
  if (lim) lines.push(pad("Limits") + lim);
  lines.push(pad("Budget") + `${budgetText() || "—"} words per turn · hand back per ${(handbackText() || "—").toLowerCase()}`);
  lines.push(pad("Interrupt") + "[[HOLD]] · Stop [[STOP]]");
  const sig = S.election.nullElection ? "Null Election: the Baseline fits." :
    S.election.signature.filter((s) => s.value).map((s) => `${s.value}, because ${s.traces || "—"}; cost: ${s.cost || "—"}`).join(" ");
  const watch = S.premortem.find((p) => p.story.trim());
  const tail = [
    "",
    `Signature Choice: ${sig || "—"}`,
    `Watching: ${watch ? `${watch.family || "Drift"}. ${watch.story} ${watch.counter ? "Countermeasure: " + watch.counter + "." : ""}` : "—"}`,
    `Cannot reliably do: ${S.capability.notes || "—"}`,
  ];
  return lines.join("\n") + "\n" + tail.join("\n") + "\n";
}

/* assets/mode-instrument.md: written sections only. */
function instrument() {
  const p = posture();
  const L = [];
  L.push(`MODE: ${modeName()}   v${version()}   Régime ${S.active ? S.active.regime : 1}, Part ${S.active ? S.active.part : 1}`);
  L.push("Standing Framework: Deployable Working Draft 0.4");
  L.push(`Baseline: ${p ? p.id + " v1.0" : "None"}`);
  L.push("", "INTENT", `${S.decl.intent || "—"} [${declMark("intent")}]`);
  L.push("", "PURPOSE");
  L.push(`Basis: ${S.decl.basis.join(", ") || "—"}   Narrative Organization: ${S.decl.narrative || "—"}   Context: ${S.decl.context || "—"}   Horizon: ${S.decl.horizon || "—"}   Continuity burden: ${S.decl.burden || "—"}`);
  L.push(`Aims: ${S.decl.aims.map((a, i) => `${i + 1}. ${a}`).join("  ") || "—"}`);
  if (S.decl.antiAims.trim()) L.push(`Anti-aims: ${S.decl.antiAims.trim()}`);
  const picks = pickList();
  if (picks.length) {
    L.push("Play Menu declarations [U]:");
    for (const pk of picks) L.push(`  ${pk.label}: ${pk.names.join("; ")}`);
  }
  L.push("", "KERNEL");
  kernelLines().forEach((k, i) => L.push(`K${i + 1}. ${k}`));
  L.push("", "SIGNATURE CHOICES");
  if (S.election.nullElection) L.push("Null Election: the Baseline fits.");
  else S.election.signature.filter((s) => s.value).forEach((s, i) => L.push(`${i + 1}. ${s.value}: traces to ${s.traces || "—"}; cost accepted: ${s.cost || "—"}`));
  const dl = deltaList();
  if (dl.length) {
    L.push("", "DELTAS FROM BASELINE");
    dl.forEach((d) => L.push(`${d.param} ${d.value} ${srcForce(d)}${d.reason ? ": " + d.reason : ""}`));
  }
  L.push("", "SEATS", `User: ${S.seats.user || "—"}`, `Operator: ${S.seats.operator || "—"}`);
  const auth = S.authority.filter((a) => a.op);
  if (auth.length) {
    L.push("", "AUTHORITY MATRIX   (departures from the Residual Authority Clause only)", "| Operation | Holder | Exercise | Note |");
    auth.forEach((a) => L.push(`| ${a.op} | ${a.holder} | ${a.exercise || "—"} | ${a.note || ""} |`));
    if (S.magic.on && S.magic.disc.delegation) L.push("| S2 (magical knowledge of the User's Character) | O | Competence Delegation (§25.11) | S1 stays with the User |");
  } else if (S.magic.on && S.magic.disc.delegation) {
    L.push("", "AUTHORITY MATRIX", "| S2 (magical knowledge of the User's Character) | O | Competence Delegation (§25.11) | S1 stays with the User |");
  }
  const tg = effective("Telegraph Rule");
  if (tg && tg !== baseVal("Telegraph Rule")) L.push("", "CONSEQUENCE GATE", `Telegraph Rule: ${tg}`);
  if (S.deltas.Randomness || S.deltas["Outcome Bands"]) L.push("", "RESOLUTION", `Randomness source: ${effective("Randomness")}`, `Outcome Bands: ${effective("Outcome Bands") || "On"}`);
  L.push("", "CANON", `Claim Rule: ${baseVal("Claim Rule") || "Claim-preserving"}   Commitment Level (default): ${effective("Commitment Level") ?? "—"}   Uncertainty Handling: ${effective("Uncertainty Handling") || "leave open"}`);
  const dials = S.constraints.dials.filter((d) => d.subject.trim());
  L.push("", "CONSTRAINTS");
  L.push(`Content Dials: ${dials.map((d) => `${d.subject}: ${d.dial}`).join("; ") || "none declared"}`);
  if (S.deltas["Intensity Ceiling"]) L.push(`Intensity Ceiling: ${S.deltas["Intensity Ceiling"].value}`);
  if (S.constraints.depiction.trim()) L.push(`Value depiction: ${S.constraints.depiction.trim()}`);
  if (needsAdultRule()) L.push("Operator boundaries: all characters are adults; the academy is a university or military college (Play Menu validation).");
  if (S.constraints.boundaries.trim()) L.push(`Operator boundaries: ${S.constraints.boundaries.trim()}`);
  if (S.constraints.persistent.trim()) L.push(`Persistent across Parts: ${S.constraints.persistent.trim()}`);
  L.push("", "MODE-SPECIFIC MATERIAL");
  L.push(`Setting and world rules: ${[S.world.setting, S.world.rules].filter((x) => x.trim()).join(" ") || "—"}`);
  if (S.magic.on) L.push(`Magic: ${magicLine()}${S.magic.seal ? " · digest sha256:" + S.magic.seal.sha256 : ""}; Disclosure Profile: Target Hardness ${S.magic.disc.open} → ${S.magic.disc.horizon}, ${S.magic.disc.orientation}; Exposition Bound: ${S.magic.disc.exposition || "default"} (§25)`);
  L.push(`Characters: ${S.characters.map((c) => c.name).filter(Boolean).join(", ") || "—"} (Stake Cards and Voice Cards live in the Record)`);
  if (S.clocks.length) L.push("Clocks at Activation: " + S.clocks.map((c) => `${c.name} (${c.segments}; ticks on: ${c.ticks || "—"}; completes: ${c.effect || "—"}; ${c.visible ? "visible" : "hidden"})`).join(" · "));
  L.push("", "CAPABILITY", capabilityEnvironment(), `Qualifications and fallbacks: ${S.capability.notes || "—"}`);
  L.push("", "RECORD", `Location: this site's Record (browser) and its JSON export   Tiers in use: ${recordTiers()}   Hot Tier budget: ~400 words   Checkpoint triggers: default`);
  L.push("", "RENDERING", `Turn Budget: ${budgetText() || "—"} words   Hand-back Granularity: ${handbackText() || "—"}`, "Touchstone:");
  L.push(S.touchstone.trim() ? S.touchstone.trim().split("\n").map((l) => "> " + l).join("\n") : "> —");
  L.push("", "CHANNELS", "Procedural Interrupt: [[HOLD]]   Stop: [[STOP]]   Other markers: default");
  L.push("", "DRIFT WATCH");
  S.premortem.filter((p) => p.story.trim()).forEach((p, i) => L.push(`${i + 1}. ${p.story} (${p.family || "—"}) -> ${p.counter || "—"} -> ${p.telltale || "—"}`));
  L.push("", "ELECTION", `Rule: ${S.election.rule}${S.election.reference ? " (reference: " + S.election.reference + ")" : ""}   Principal reasons: ${S.election.reasons || "—"}   Trade-offs accepted: ${S.election.tradeoffs || "—"}   Material uncertainty: ${S.election.uncertainty || "—"}`);
  L.push("", "RATIFICATION", `Proving Scene: ${S.proving.status}`, `User assent: [${S.assent.user ? "x" : " "}]   Operator assent: [${S.assent.operator ? "x" : " "}]`);
  if (S.active) L.push(`Activation: v${S.active.version}, Régime ${S.active.regime}, Part ${S.active.part}, ${S.active.at.slice(0, 10)}; first Checkpoint CP-0`);
  return L.join("\n") + "\n";
}

function recordTiers() {
  const b = S.decl.burden;
  if (b === "Long-term" || b === "Archival") return "Hot, Warm, Cold";
  if (b === "Part-bound") return "Hot, Warm";
  return baseVal("Record Tiers") || "Hot";
}
function capabilityEnvironment() {
  const liveOp = CAP.sample ? "a live Operator (Claude, through this page)" : "no live Operator in this page (hand-off to a Claude conversation)";
  return `Environment: this site. Tool Draw from the browser's entropy source; Hash Seals (SHA-256, the scheme of scripts/seal.py); a Record kept in the browser with JSON export; ${liveOp}.`;
}

function kernelText() {
  return `KERNEL: ${modeName()} v${version()}\n` + kernelLines().map((k, i) => `K${i + 1}. ${k}`).join("\n") + "\n";
}

function cardText(c) {
  const stake = `STAKE  ${c.name || "—"}: Want ${c.want || "—"} | Line ${c.line || "—"} | Price ${c.price || "—"} | Leverage ${c.leverage || "—"}${c.tell ? " | Tell " + c.tell : ""}`;
  const voice = `VOICE  ${c.name || "—"}: Diction ${c.diction || "—"} | Rhythm ${c.rhythm || "—"} | Tell ${c.vtell || "—"} | Never ${c.never || "—"} | Sample: "${c.sample || "—"}"`;
  return stake + "\n" + voice;
}

/* assets/kernel-and-brief.md */
function brief() {
  const p = posture();
  const kern = kernelLines().map((k, i) => `K${i + 1}. ${k}`).join("\n") || "—";
  const ucert = effective("Uncertainty Handling") || "leave open";
  const L = [
    `OPERATING BRIEF: ${modeName()} v${version()}`,
    "Compiled from the Instrument. Where they differ, the Instrument governs.",
    "",
    "1. KERNEL (hold these above everything else)",
    kern,
    "",
    "2. WHAT THIS MODE IS FOR",
    S.decl.intent || "—",
    `Baseline: ${p ? p.id + " 1.0" : "None"}. ${p ? p.line : ""}`,
    "",
    "3. SEATS",
    `You hold: ${S.seats.operator || "the World and every Operator Character"}.`,
    `The User holds: ${S.seats.user || "their Character"}.`,
    "Never decide, speak, think or feel for the User's Character. Render only what the",
    "User's Character perceives. Stop at the User's next point of decision.",
    "",
    "4. UNSETTLED OUTCOMES",
    "For any Attempt at Tier 1 or above: state Stakes, then Odds from the Odds Ladder with",
    `the factors named, then resolve by ${effective("Randomness") || "Judgment"}, then render inside the Band.`,
    "Put every standing threat on a Clock. Advance Clocks only on their tick conditions.",
    "Never present a number you authored as a roll.",
    `Where a material fact is unestablished and nobody holds it: ${ucert.toLowerCase()}.`,
    "",
    "5. RENDERING",
    `Match the Touchstone (below). Turn Budget ${budgetText() || "—"} words. Hand back per ${(handbackText() || "—").toLowerCase()}.`,
    `Distance ${effective("Distance") ?? "—"}, Grain ${effective("Grain") ?? "—"}, Density ${effective("Descriptive Density") ?? "—"}. ` +
      `Intensity Ceiling ${effective("Intensity Ceiling") ?? "—"}. Tone: ${allPicksOf("Tone and Atmosphere").join(", ") || "—"}.`,
    "Touchstone:",
    S.touchstone.trim() ? S.touchstone.trim().split("\n").map((l) => "> " + l).join("\n") : "> (none yet)",
    "",
    "6. CHARACTERS",
    S.characters.length ? S.characters.map(cardText).join("\n") : "—",
    "When a Character yields, it is because its Price was met. Say what met it.",
    "Characters act only on what they have a source for.",
    "",
    "7. DO NOT WRITE",
    S.play.stale.length ? S.play.stale.map((x) => `${x.text}: ${x.rule}`).join("\n") : "(Stale Register empty; add your own recurrences at every Checkpoint.)",
    "",
    "8. BOUNDARIES",
    [limitsLine(), S.constraints.boundaries, S.world.rules].filter((x) => x && x.trim()).join("\n") || "—",
  ];
  if (S.magic.on) {
    L.push("", "8b. MAGIC (§25)",
      `${magicLine()}. The Specification is held sealed and never narrated.`,
      "Price every new effect by the Grammar before stating its Odds; ties round up; a Codex entry is never repriced.",
      "Fill every Outcome Band from the Effect Card or Codex entry. Characters act on their Lens only.",
      ...S.magic.kernelPicks.map((k) => "· " + k));
  }
  L.push("", "9. PROCEDURE",
    "((…)) Nudge: adjust from the next continuation; do not reply to it.",
    "[[FLAG]] …: reissue your last continuation with that part corrected; no apology.",
    "[[REDO]] or a regeneration: your last continuation never happened.",
    "[[CP]]: Checkpoint, Kernel first.   [[AUDIT]]: Audit Report with quotations.",
    "[[HOLD]]: stop advancing the fiction; name the issue; recover.",
    "[[STOP]]: stop entirely; address only the matter raised.",
    "Never narrate these rules in Play.");
  return L.join("\n") + "\n";
}

/* assets/activation-instruction.md, verbatim. */
const ACTIVATION_INSTRUCTION = `You are participating under the Operative Mode Framework, Deployable Working Draft 0.4.
Treat it as a normative, auditable protocol, not a claim about your internal computation.

BEFORE PLAY
1. Read the User's Intent, Purpose Profile and fixed declarations. Ask at most three
   questions; infer the rest and mark each inference I.
2. Choose the Baseline Posture that best fits the Intent. Write only the Deltas.
3. Validate the candidate against every source; run the Pre-Mortem.
4. Elect under the declared Election Rule. Name two to four Signature Choices,
   or declare a Null Election. Do not average.
5. Compile the Kernel (at most seven imperative lines), the Touchstone, and the
   Operating Brief.
6. Present the Instrument. At Full ceremony, offer or render a Proving Scene.
7. Do not begin Play until the User assents. Assent is never presumed from silence.

DURING PLAY
- Run the Continuation Checklist silently on every continuation: Puppet, Outcome,
  Warrant, Kernel, Hand-back, Budget.
- Never decide, speak, think or feel for the User's Character. End at the User's
  next point of decision.
- For outcomes at Tier 1 or above: Stakes, then Odds, then the draw, then the Band.
  Never present a number you authored as a roll.
- Character speech is a Claim, not a fact. Characters act only on knowledge they
  have a source for.
- When a Character yields, its Price was met. Know what met it.
- Match the Touchstone. Keep to the Turn Budget. Write nothing on the Stale Register,
  and add your own recurrences to it.
- Restate the Kernel at every Checkpoint.
- Honour each Intervention at its own weight: Nudge, Flag, Redo, Checkpoint, Audit,
  Hold, Stop.
- Only the retained continuation is Play. Void any Record entry written from a
  discarded branch.
- Disclose detectable degradation. Do not claim you will notice what you cannot detect.
- Do not amend the Mode during a Part, except to narrow it when either Party asks.

AT PART CLOSE
Checkpoint, Compaction, Part Review, Resumption Packet.
`;

function clocksLine() {
  return S.clocks.map((c) => `${c.name}: ${c.filled}/${c.segments}; ticks on ${c.ticks || "—"}; ${c.visible ? "visible" : "hidden"}`).join("\n" + " ".repeat(12)) || "none";
}
function hiddenLine() {
  const seals = S.play.seals.filter((s) => !s.void).map((s) => `${s.id}: Level 3, sha256:${s.sha256.slice(0, 16)}…${s.revealed ? " (revealed)" : ""}`);
  if (S.magic.on && S.magic.seal) seals.unshift(`SPEC-${S.magic.name || "Unnamed"}: Level ${S.magic.seal.level || 3}, sha256:${S.magic.seal.sha256.slice(0, 16)}…`);
  return seals.join("\n" + " ".repeat(12)) || "none";
}

/* assets/state-record.md, Hot Tier */
function checkpointText(n) {
  const cp = S.play.cp;
  const idx = n ?? S.play.checkpoints.length;
  return [
    `CHECKPOINT CP-${idx}: Part ${S.active ? S.active.part : 1}, ${cp.moment || "—"}        Confirmed: [ ]`,
    `Mode ${modeName()} v${version()}`,
    "",
    "KERNEL",
    kernelLines().map((k, i) => `K${i + 1}. ${k}`).join("\n") || "—",
    "",
    "NOW         " + (cp.now || "—"),
    "PENDING     " + (cp.pending || "—"),
    "CLOCKS      " + clocksLine(),
    "HIDDEN      " + hiddenLine(),
    "CAPABILITY  " + (CAP.sample ? "live Operator available in this page" : "no live Operator in this page; hand-off in use"),
    "DRIFT WATCH " + (cp.drift || "none observed"),
  ].join("\n") + "\n";
}

/* assets/state-record.md, Resumption Packet */
function resumptionPacket() {
  const last = S.play.checkpoints[S.play.checkpoints.length - 1];
  const open = S.play.ledger.filter((l) => l.status === "Provisional" || l.status === "Disputed");
  const codex = S.magic.codex.map((c) => `${c.name} · ${c.domain} · Tier ${c.tier} · ${c.price} · compared with ${c.bench || "—"}`);
  return [
    `RESUMPTION PACKET: ${modeName()} v${version()}, after Part ${S.active ? S.active.part : 1}, ${today()}`,
    "",
    "1. Operating Brief",
    brief(),
    "2. Hot Tier: the latest Checkpoint",
    last ? last.text : checkpointText(),
    "3. Open Items and running Clocks",
    (open.map((l) => `${l.text} (${l.status})`).join("\n") || "none") + "\n" + (clocksLine()),
    "",
    "4. Active Stake Cards and Voice Cards",
    S.characters.map(cardText).join("\n") || "—",
    "",
    "5. Stale Register",
    S.play.stale.map((x) => `${x.text}: ${x.rule}`).join("\n") || "—",
    "",
    "6. Rulings bearing on the next Part",
    codex.join("\n") || "—",
    "",
    "7. Hidden state, by Commitment Level",
    hiddenLine(),
    "",
    "8. Resumption instruction: read 1 to 7; restate the Hot Tier in brief;",
    "   resume at the Hand-back point upon the User's Move.",
  ].join("\n") + "\n";
}

/* The whole Mode, for a fresh Operator in another conversation. */
function handoffPacket() {
  const parts = [
    "Please act as the Operator for the Mode below. Read everything, then follow the Activation Instruction.",
    "",
    "=== ACTIVATION INSTRUCTION ===", ACTIVATION_INSTRUCTION,
    "=== OPERATING BRIEF ===", brief(),
    "=== " + (S.ceremony === "Full" ? "MODE INSTRUMENT" : "MODE SHEET") + " ===", S.ceremony === "Full" ? instrument() : lightSheet(),
  ];
  if (S.play.checkpoints.length || S.play.turns.length) parts.push("=== RESUMPTION PACKET ===", resumptionPacket());
  if (S.magic.on && S.magic.seal) parts.push("=== SEALED MAGIC SPECIFICATION (Operator's eyes only; never narrate it) ===", S.magic.seal.plaintext,
    `Digest: sha256:${S.magic.seal.sha256} (nonce ${S.magic.seal.nonce})`);
  parts.push(S.active ? "The Mode is ratified and active. Wait for my first Move." : "The Mode is not yet ratified. Present it, state your own assent or amendments, and do not begin Play until I assent.");
  return parts.join("\n");
}

function exportJSON() { return JSON.stringify(Object.assign({ exported: stamp(), framework: "Operative Mode Framework, Draft 0.4" }, S), null, 2); }
function fileSlug() { return (modeName().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "mode"); }
