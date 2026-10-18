/* ===== The Operator: Claude, reached through the page's `sample` capability where it exists.
   Every request is also available as text to copy into a Claude conversation, with its reply pasted back. ===== */

const OP = { busy: false, ctl: null };
const liveOperator = () => !!CAP.sample && !CAP.denied;

function sampleErrorText(code) {
  switch (code) {
    case "cancelled": return "";
    case "not_granted": case "sampling_disabled": case "not_declared": case "capability_disabled": case "capability_removed":
      CAP.denied = true; return "Claude is not available to this page here. Use the hand-off packet instead.";
    case "rate_limited": return "Too many requests just now. Wait a little, then send again.";
    case "session_expired": return "Your session expired. Sign in again, then send again.";
    case "refused": return "Claude declined this turn. Rephrase the Move, or step out with [[HOLD]].";
    case "empty_completion": return "No reply came back. Try a shorter Move.";
    case "prompt_too_large": return "The Record is too long to send whole. Record a Checkpoint and close the Part; the Resumption Packet carries the rest.";
    case "invalid_json": return "The reply was not the JSON asked for. Try again.";
    case "tools_unavailable": CAP.tools = false; return "This view cannot run the page's dice for Claude. Send again: Claude will hand back for your roll instead.";
    default: return "The connection dropped. Any partial text is kept; send again to retry.";
  }
}

/* ---- Prompts ---- */
function hotTier() {
  const last = S.play.checkpoints[S.play.checkpoints.length - 1];
  const opSeals = S.play.seals.filter((s) => s.by === "Operator" && !s.revealed && !s.void);
  return [
    last ? last.text : checkpointText(),
    S.clocks.length ? "CLOCKS\n" + S.clocks.map((c) => `${c.name}: ${c.filled}/${c.segments}; ticks on: ${c.ticks || "—"}; completes: ${c.effect || "—"}; ${c.visible ? "visible" : "hidden"}`).join("\n") : "",
    S.play.ledger.length ? "CANON LEDGER\n" + S.play.ledger.map((l) => `${l.text} (${l.status}${l.prov ? ", " + l.prov : ""})`).join("\n") : "",
    S.magic.codex.length ? "CODEX\n" + S.magic.codex.map((c) => `${c.name} · ${c.domain} · Tier ${c.tier} · ${c.price}`).join("\n") : "",
    opSeals.length ? "YOUR SEALED SECRETS (the User sees only the digests; honour them exactly)\n" + opSeals.map((s) => `${s.id}: ${s.plaintext}${s.revelation ? " · revealed when: " + s.revelation : ""}`).join("\n") : "",
  ].filter(Boolean).join("\n\n");
}
function mechanics(tools) {
  return [
    "PAGE MECHANICS",
    tools ? "- Randomness: for an Attempt at Tier 1 or above, write the Stakes and the Odds (a Ladder rung with its named factors) in a [[PROC]] line FIRST, then call tool_draw, then render inside the Band it returns. For an unestablished material fact nobody holds, call tool_draw with oracle=true. Never write a number as if it were rolled."
      : "- Randomness: this page cannot run tools for you. When an Attempt needs a draw, write the Stakes and Odds in a [[PROC]] line and hand back: the User draws with the page's dice and the result arrives as a [[REC]] line. Never write a number as if it were rolled.",
    tools ? "- Secrets: to fix a hidden fact, call seal_secret. Only its digest is shown to the User." : "- Secrets: hold hidden facts at Commitment Level 1: publish properties, not the fact.",
    tools ? "- Clocks: call tick_clock only when one of the Clock's declared tick conditions is met." : "- Clocks: say in a [[REC]] line which tick condition was met; the User ticks the Clock.",
    "- [[REC]] lines inside the User's turns are entries the page wrote (draws, ticks, seals, Checkpoints). Treat them as Established.",
    "- Reply with your continuation only. Diegetic text is unmarked; procedural matter goes in [[PROC]], Record matter in [[REC]]. Never narrate the framework or cite sections in Diegetic text.",
  ].join("\n");
}
function operatorRules(kind, tools) {
  const spec = S.magic.on && S.magic.seal ? `\n=== MAGIC SPECIFICATION (sealed, sha256:${S.magic.seal.sha256}; resolve from it, never narrate it) ===\n${S.magic.seal.plaintext}\n` :
    S.magic.on ? `\n=== MAGIC SPECIFICATION (unsealed draft; resolve from it, never narrate it) ===\n${specSheet()}\n` : "";
  if (kind === "proving") {
    return [
      "You are the Operator for a candidate Mode under the Operative Mode Framework, Draft 0.4. A web page relays your reply to the User verbatim.",
      "This is a PROVING SCENE (§12.3): one to three exchanges rendered BEFORE Assent so the User can judge the Mode by what it produces. It is not Play. Everything in it is Provisional. Do not ask for assent and do not discuss the Mode: render the scene.",
      "", "=== OPERATING BRIEF (candidate) ===", brief(),
      "=== " + (S.ceremony === "Full" ? "MODE INSTRUMENT" : "MODE SHEET") + " (candidate) ===", S.ceremony === "Full" ? instrument() : lightSheet(),
      spec, mechanics(tools),
      "", "Begin from the User's starting point in the next turn, or from the declared opening if they give none. Stop at the User's first point of decision.",
    ].join("\n");
  }
  return [
    `You are the Operator in the ratified Mode "${modeName()}" v${version()} under the Operative Mode Framework, Draft 0.4. A web page runs this session: it keeps the Record, holds the dice, seals secrets, and relays your reply to the User verbatim. The User is the other Party.`,
    "", "=== ACTIVATION INSTRUCTION ===", ACTIVATION_INSTRUCTION,
    "=== OPERATING BRIEF ===", brief(),
    spec,
    "=== RECORD: HOT TIER ===", hotTier(),
    "", mechanics(tools),
    S.active ? "" : "\nNOTE: the Mode is not yet activated. Treat everything as practice and Provisional.",
  ].join("\n");
}

/* ---- Page tools offered to Claude ---- */
function pageTools(pending, bid) {
  return [
    { name: "tool_draw",
      description: "Draw d100 from the page's entropy source against Odds you have ALREADY stated, and get the Outcome Band (or the Oracle answer). Call only after writing the Stakes and Odds. Returns {rung, odds, d100, band, source}.",
      inputSchema: { type: "object", properties: {
        odds: { type: "string", description: "A rung of the Odds Ladder: Certain, Near-certain, Likely, Even, Unlikely, Remote, Impossible" },
        oracle: { type: "boolean", description: "true for a yes/no Oracle Question" },
        stakes: { type: "string", description: "The Stakes (or the Oracle question) exactly as you stated them" } }, required: ["odds", "stakes"] },
      execute(input) {
        const raw = String(input.odds || "").trim().toLowerCase();
        const rung = RUNGS.find((r) => r.toLowerCase() === raw) || RUNGS.find((r) => raw.startsWith(r.toLowerCase().slice(0, 4)));
        if (!rung) throw new Error("odds must be a rung of the Ladder: " + RUNGS.join(", "));
        const d = toolDraw(rung, !!input.oracle);
        Object.assign(d, { success: input.oracle ? "" : String(input.stakes || ""), failure: "", successTier: "", failureTier: "", question: input.oracle ? String(input.stakes || "") : "", factors: [], by: "Operator", bid });
        S.play.draws.unshift(d);
        pending.push({ role: "record", bid, content: `[[REC]] ${input.oracle ? "Oracle" : "Draw"} (Operator, Tool Draw): ${String(input.stakes || "").slice(0, 300)} · Odds ${d.rung} (${d.t}) · ${d.r == null ? "no draw" : "d100 = " + d.r} · ${d.label}`, at: stamp() });
        changed();
        return { rung: d.rung, odds: d.t, d100: d.r, band: d.label, source: d.source };
      } },
    { name: "seal_secret",
      description: "Seal a hidden fact at Commitment Level 3. The page stores the plaintext unread and shows the User only its SHA-256 digest. Returns {id, digest}.",
      inputSchema: { type: "object", properties: { fact: { type: "string" }, revelation: { type: "string", description: "the condition on which it will be revealed" } }, required: ["fact"] },
      async execute(input) {
        const s = await makeSeal(`SEAL-${S.play.seals.length + 1}`, String(input.fact || ""));
        s.by = "Operator"; s.revelation = String(input.revelation || ""); s.bid = bid;
        S.play.seals.push(s);
        pending.push({ role: "record", bid, content: `[[REC]] ${s.id} sha256:${s.sha256} (sealed by the Operator${s.revelation ? "; revealed when " + s.revelation : ""})`, at: stamp() });
        changed();
        return { id: s.id, digest: "sha256:" + s.sha256 };
      } },
    { name: "tick_clock",
      description: "Advance a Clock one segment because one of its declared tick conditions was met. Returns the Clock's state. Fails if no Clock has that name or it is complete.",
      inputSchema: { type: "object", properties: { clock: { type: "string" }, condition: { type: "string", description: "which declared tick condition was met, and how" } }, required: ["clock", "condition"] },
      execute(input) {
        const name = String(input.clock || "").trim().toLowerCase();
        const c = S.clocks.find((x) => x.name.trim().toLowerCase() === name);
        if (!c) throw new Error("No Clock named " + input.clock + ". Clocks: " + S.clocks.map((x) => x.name).join(", "));
        const n = Number(c.segments) || 4;
        if (Number(c.filled) >= n) throw new Error(c.name + " is already complete.");
        c.filled = Number(c.filled) + 1; c.log = c.log || []; c.log.push({ at: stamp(), cond: String(input.condition || ""), by: "Operator", bid });
        pending.push({ role: "record", bid, content: `[[REC]] Clock ${c.name}: ${c.filled}/${n} (tick: ${input.condition})${c.filled >= n ? " · complete: " + (c.effect || "—") : ""}`, at: stamp() });
        changed();
        return { clock: c.name, filled: c.filled, segments: n, complete: c.filled >= n, completionEffect: c.filled >= n ? c.effect : "" };
      } },
  ];
}

function sampleInput(turns, kind, tools) {
  const msgs = [{ role: "user", content: operatorRules(kind, tools) }];
  let body = turns.filter((t) => !t.void && !t.excluded);
  if (body.length > 80) body = body.slice(-80);
  for (const t of body) msgs.push({ role: t.role === "operator" ? "assistant" : "user", content: t.content || "…" });
  if (msgs[msgs.length - 1].role !== "user") msgs.push({ role: "user", content: "((Continue from where you stopped; hand back at my next point of decision.))" });
  return msgs;
}

/* The Retention Rule (§14.6): a discarded continuation has no standing, and neither does anything the
   page recorded while it was being written: its draws, seals and Clock ticks are Voided with it. */
function voidContinuation(turns, op, reason) {
  op.void = true; op.voidReason = reason; op.excluded = true;
  if (!op.bid) return;
  for (const t of turns) if (t !== op && t.bid === op.bid) { t.void = true; t.voidReason = "branch-abandoned"; t.excluded = true; }
  for (const s of S.play.seals) if (s.bid === op.bid) s.void = true;
  for (const d of S.play.draws) if (d.bid === op.bid) d.void = true;
  for (const c of S.clocks) for (const l of c.log || []) if (l.bid === op.bid && !l.void) { l.void = true; c.filled = Math.max(0, Number(c.filled) - 1); }
}

/* Run one Operator continuation into `turns`. */
async function runOperator(turns, kind, onUpdate) {
  if (!liveOperator() || OP.busy) return;
  OP.busy = true;
  OP.ctl = new AbortController();
  const pending = [];
  const useTools = kind === "play" && CAP.tools;
  const bid = uid();
  const reply = { role: "operator", content: "", at: stamp(), streaming: true, provisional: kind === "proving", bid };
  turns.push(reply);
  onUpdate();
  try {
    const opts = { cache: false, signal: OP.ctl.signal, modelTier: S.play.tier || "default", onText: ({ text }) => { reply.content = text; onUpdate(true); } };
    if (useTools) opts.tools = pageTools(pending, bid);
    const input = sampleInput(turns.slice(0, -1), kind, useTools);
    const res = await CAP.sample(input, opts);
    reply.content = res.text;
    if (res.truncated) reply.note = "Cut short at the length limit.";
  } catch (e) {
    const msg = sampleErrorText(e && e.code);
    if (e && e.code === "refused") reply.content = "";
    else reply.content = (e && e.text) || reply.content;
    if (!reply.content.trim()) turns.splice(turns.indexOf(reply), 1);
    else reply.note = "Interrupted.";
    if (msg) toast(msg);
  } finally {
    reply.streaming = false;
    if (pending.length) { const i = turns.indexOf(reply); turns.splice(i >= 0 ? i : turns.length, 0, ...pending); }
    OP.busy = false;
    OP.ctl = null;
    changed();
    onUpdate();
  }
  return reply;
}

/* ---- Transcript and console ---- */
function turnEl(t, i, turns, onChange) {
  const who = t.role === "operator" ? "Operator" : t.role === "record" ? "Record" : "You";
  const cls = "turn " + t.role + (t.void ? " void" : "") + (t.provisional ? " provisional" : "");
  const isLastOp = t.role === "operator" && !t.void && i === turns.map((x) => !x.void && x.role === "operator").lastIndexOf(true);
  return h("div", { class: cls },
    h("span", { class: "who" }, who, t.void ? h("span", { style: "color:var(--wax)" }, "Void · " + (t.voidReason || "discarded")) : null, t.note ? h("span", null, t.note) : null,
      t.at ? h("span", { style: "text-transform:none;letter-spacing:0" }, t.at.slice(11, 16)) : null,
      isLastOp && !OP.busy && liveOperator() ? h("button", { type: "button", class: "btn ghost sm", title: "[[REDO]]: this continuation never happened", onclick: () => onChange("redo") }, "Redo") : null),
    h("div", { class: "body" }, t.content || (t.streaming ? h("span", { class: "thinking" }, "The Operator is thinking…") : "")));
}
let transcriptRefreshers = [];
function renderTranscriptOnly() { transcriptRefreshers.forEach((fn) => fn()); }

function consoleUI(opts) {
  const { kind, getTurns, maxUser } = opts;
  const box = h("div", { class: "console" });
  const tr = h("div", { class: "transcript", "aria-live": "polite" });
  const ta = h("textarea", { placeholder: kind === "proving" ? "Your starting point, or your first Move" : "Your Move. Diegetic by default; ((…)) for a Nudge; [[HOLD]] to step out.", "aria-label": "Your Move" });
  const head = h("div", { class: "console-head" });
  const foot = h("div", { class: "composer" });
  let stick = true;
  tr.addEventListener("scroll", () => { stick = tr.scrollTop + tr.clientHeight >= tr.scrollHeight - 30; });

  const drawTranscript = (streaming) => {
    const turns = getTurns();
    if (streaming && tr.lastChild) {
      const last = turns[turns.length - 1];
      const body = tr.lastChild.querySelector(".body");
      if (body && last) body.textContent = last.content;
    } else {
      clear(tr);
      if (!turns.length) put(tr, h("p", { class: "thinking" }, kind === "proving" ? "The Proving Scene is empty. Give a starting point to render the first exchange." : "The transcript is empty. Play begins with your first Move."));
      turns.forEach((t, i) => put(tr, turnEl(t, i, turns, (action) => { if (action === "redo") redo(); })));
    }
    if (stick) tr.scrollTop = tr.scrollHeight;
  };
  const update = (streaming) => { drawTranscript(streaming); if (!streaming) drawFoot(); };
  transcriptRefreshers = transcriptRefreshers.filter((f) => f.kind !== kind);
  const refresher = () => update(false);
  refresher.kind = kind;
  transcriptRefreshers.push(refresher);

  const userCount = () => getTurns().filter((t) => t.role === "user" && !t.void).length;
  const redo = () => {
    const turns = getTurns();
    for (let j = turns.length - 1; j >= 0; j--) if (turns[j].role === "operator" && !turns[j].void) { voidContinuation(turns, turns[j], "redo"); break; }
    changed(); update();
    runOperator(turns, kind, update);
  };
  const send = () => {
    const text = ta.value.trim();
    if (!text || OP.busy) return;
    const turns = getTurns();
    if (maxUser && userCount() >= maxUser) { toast("A Proving Scene is one to three exchanges."); return; }
    if (/^\[\[REDO\]\]$/i.test(text)) { ta.value = ""; redo(); return; }
    const flag = /^\[\[FLAG\]\]/i.test(text);
    const prevOp = flag ? [...turns].reverse().find((t) => t.role === "operator" && !t.void) : null;
    const move = { role: "user", content: text, at: stamp(), provisional: kind === "proving" };
    turns.push(move);
    ta.value = "";
    changed(); update();
    if (!liveOperator()) return;
    runOperator(turns, kind, update).then((reply) => {
      if (flag && prevOp && reply && reply.content.trim()) {
        voidContinuation(turns, prevOp, "flagged and repaired"); move.excluded = true;
        changed(); update();
      }
    });
  };
  ta.addEventListener("keydown", (ev) => { if (ev.key === "Enter" && (ev.metaKey || ev.ctrlKey)) { ev.preventDefault(); send(); } });

  const insert = (tok) => {
    const s = ta.selectionStart ?? ta.value.length, e = ta.selectionEnd ?? ta.value.length;
    if (tok === "(( ))") { ta.setRangeText("((  ))", s, e, "end"); ta.selectionStart = ta.selectionEnd = s + 3; }
    else ta.setRangeText(tok, s, e, "end");
    ta.focus();
  };
  const drawHead = () => {
    clear(head);
    const tier = h("select", { "aria-label": "Model tier" }, [["quick", "quick"], ["default", "default"], ["complex", "complex"]].map(([v, t]) => h("option", { value: v, selected: (S.play.tier || "default") === v ? true : null }, t)));
    tier.addEventListener("change", () => { S.play.tier = tier.value; changed(); });
    put(head,
      h("div", { class: "row tight" }, liveOperator() ? pill("live", "Operator live") : pill("", "Hand-off"),
        h("span", { class: "small muted" }, liveOperator() ? (CAP.tools ? "Claude draws with the page's dice" : "Claude hands back for your rolls") : "Play in a Claude conversation; keep the Record here")),
      liveOperator() ? h("label", { class: "row tight small" }, "Model", tier) : null);
  };
  const drawFoot = () => {
    clear(foot);
    if (!liveOperator()) {
      const pasteTa = h("textarea", { placeholder: "Paste the Operator's continuation from your Claude conversation", "aria-label": "Operator continuation" });
      put(foot,
        h("div", { class: "notice verd" }, h("b", null, "Hand-off. "), CAP.checked ? "This page cannot reach Claude here. " : "Looking for Claude… ",
          "Copy the packet into a Claude conversation; it carries the Activation Instruction, the Operating Brief and the Mode. Keep the transcript here to keep the Record whole."),
        h("div", { class: "row tight" },
          h("button", { type: "button", class: "btn primary sm", onclick: () => copyText(kind === "proving" ? provingRequest() : handoffPacket(), "Hand-off packet") }, kind === "proving" ? "Copy the Proving request" : "Copy the hand-off packet"),
          h("button", { type: "button", class: "btn sm", onclick: () => saveFile(`${fileSlug()}-handoff.md`, kind === "proving" ? provingRequest() : handoffPacket()) }, "Save it")),
        ta,
        h("div", { class: "row tight" }, h("button", { type: "button", class: "btn sm", onclick: send }, "Add my Move")),
        pasteTa,
        h("div", { class: "row tight" }, h("button", { type: "button", class: "btn sm", onclick: () => {
          if (!pasteTa.value.trim()) return;
          getTurns().push({ role: "operator", content: pasteTa.value.trim(), at: stamp(), provisional: kind === "proving" });
          pasteTa.value = ""; changed(); update();
        } }, "Add the Operator's continuation")));
      return;
    }
    put(foot,
      h("div", { class: "tokens", "aria-label": "Intervention Ladder" }, FRAMEWORK.interventions.map((iv) => h("button", { type: "button", class: iv.rung === "Stop" ? "stop" : "", title: `${iv.rung}: ${iv.effect}`,
        onclick: () => insert(iv.insert) }, iv.token))),
      ta,
      h("div", { class: "spread" },
        h("span", { class: "small muted" }, maxUser ? `${userCount()} of ${maxUser} exchanges` : "Ctrl or ⌘ + Enter sends"),
        h("div", { class: "row tight" },
          OP.busy ? h("button", { type: "button", class: "btn wax sm", onclick: () => OP.ctl && OP.ctl.abort() }, "Stop") : null,
          h("button", { type: "button", class: "btn primary", disabled: OP.busy ? true : null, onclick: send }, "Send"))));
  };
  drawHead();
  update();
  onCaps(() => { drawHead(); update(); });
  put(box, head, tr, foot);
  return box;
}

function playConsole() {
  return consoleUI({ kind: "play", getTurns: () => S.play.turns });
}
function provingConsole() {
  return consoleUI({ kind: "proving", getTurns: () => S.proving.turns, maxUser: 3 });
}
function provingRequest() {
  return operatorRules("proving", false) + "\n\nMy starting point: (write it here, or say \"the declared opening\")";
}

/* ---- Completion and Election by the Operator (§10.2, §11) ---- */
const ELECT_SHAPE = `{
  "intent": "string, only if the User left it empty",
  "narrative": "Absent|Latent|Retrospective|Emergent|Guided|Structured",
  "horizon": "one exchange|one scene|one Part|episodic|indefinite continuity",
  "burden": "Minimal|Scene-bound|Part-bound|Long-term|Archival",
  "baseline": "Tête-à-tête|Neutral World|Guided Tale|Writers' Room|Table Game|Standing Posture",
  "deltas": [{"param": "one of ${GRADED.join(", ")}", "value": 0, "reason": "one line"}],
  "seats": {"user": "string", "operator": "string"},
  "setting": "string", "worldRules": "string",
  "characters": [{"name": "", "archetype": "", "want": "", "line": "", "price": "", "leverage": "", "tell": "", "diction": "", "rhythm": "", "vtell": "", "never": "", "sample": ""}],
  "clocks": [{"name": "", "segments": 6, "ticks": "", "effect": ""}],
  "signature": [{"value": "", "traces": "Intent|Aim n: …|Operator Inclination", "cost": ""}],
  "premortem": [{"story": "", "family": "a drift class, e.g. Accommodation", "counter": "", "telltale": ""}],
  "kernel": ["imperative line of observable conduct"],
  "touchstone": "80 to 200 words of sample continuation",
  "reasons": "", "tradeoffs": "", "uncertainty": "", "capability": ""
}`;
function electionRequest() {
  const picks = pickList().map((p) => `${p.label}: ${p.names.join("; ")}`).join("\n") || "none";
  const fixed = {
    ceremony: S.ceremony, name: S.decl.name, intent: S.decl.intent, basis: S.decl.basis, narrative: S.decl.narrative, context: S.decl.context,
    horizon: S.decl.horizon, burden: S.decl.burden, aims: S.decl.aims, antiAims: S.decl.antiAims, baseline: S.baselineSrc === "U" ? S.baseline : "",
    deltas: Object.fromEntries(Object.entries(S.deltas).filter(([, d]) => d.src === "U").map(([k, d]) => [k, d.value])),
    seats: S.seats, setting: S.world.setting, worldRules: S.world.rules,
    characters: S.characters.map((c) => ({ name: c.name, archetype: c.archetype, want: c.want, price: c.price })),
    clocks: S.clocks.map((c) => c.name), contentDials: S.constraints.dials, magic: S.magic.on ? magicLine() : "none",
    romance: S.romance, adultCharactersOnly: needsAdultRule(),
  };
  return [
    "You are the Operator under the Operative Mode Framework, Draft 0.4, doing Completion and Election (§10.2, §11) for a candidate Mode.",
    "The User fixed the values below (source U). Never change or contradict them. Complete and elect everything they left open:",
    "- Choose the Baseline Posture that best fits the Intent; write only Deltas that depart from it (0 to 4 on the Anchored Scales).",
    "- Elect; do not average. Name two to four Signature Choices, each traced to the Intent, a ranked Aim, or your own Inclination, each with its cost.",
    "- If Narrative Organization is Absent or Latent, do not elect complications or arcs.",
    `- Kernel: ${S.ceremony === "Light" ? "three to five" : "at most seven"} imperative lines of observable conduct, at most 150 words, never parameter values.`,
    "- Pre-Mortem: three one-sentence failure stories, at least one from the Regression family (Accommodation, Inflation, Homogenization, Recurrence, Momentum Seizure), each bound to a countermeasure and a Tell-tale.",
    "- Give each Character in the User's list (and any you add, at most three) a full Stake Card and Voice Card.",
    "- Touchstone: 80 to 200 words of continuation in the Mode's voice, ending at the User's point of decision, never speaking for the User's Character.",
    "- Your own limits bind the candidate; if anything fixed requires content you would decline, say so in \"uncertainty\".",
    "", "USER DECLARATIONS (U):", JSON.stringify(fixed, null, 1), "", "PLAY MENU PICKS (U):", picks, "",
    "Reply with only one JSON object of this shape, omitting any key the User already fixed:", ELECT_SHAPE,
  ].join("\n");
}
function applyElection(r) {
  if (!r || typeof r !== "object") throw new Error("not an object");
  const d = S.decl;
  const setI = (key, v) => { if (v && !(Array.isArray(d[key]) ? d[key].length : String(d[key] || "").trim())) { d[key] = v; d.marks[key] = key === "intent" ? "O" : "I"; } };
  setI("intent", r.intent); setI("narrative", r.narrative); setI("horizon", r.horizon); setI("burden", r.burden);
  if (r.baseline && FRAMEWORK.postures.some((p) => p.id === r.baseline) && (!S.baseline || S.baselineSrc !== "U")) { S.baseline = r.baseline; S.baselineSrc = "O"; }
  for (const dl of Array.isArray(r.deltas) ? r.deltas : []) {
    if (!GRADED.includes(dl.param)) continue;
    const v = Math.max(0, Math.min(4, Math.round(Number(dl.value))));
    if (isNaN(v) || (S.deltas[dl.param] && S.deltas[dl.param].src === "U")) continue;
    if (String(baseVal(dl.param)) === String(v)) { delete S.deltas[dl.param]; continue; }
    S.deltas[dl.param] = { value: v, src: "O", force: "Df", reason: String(dl.reason || "") };
  }
  if (r.seats) { if (!S.seats.user.trim() && r.seats.user) S.seats.user = String(r.seats.user); if (!S.seats.operator.trim() && r.seats.operator) S.seats.operator = String(r.seats.operator); }
  if (r.setting && !S.world.setting.trim()) S.world.setting = String(r.setting);
  if (r.worldRules && !S.world.rules.trim()) S.world.rules = String(r.worldRules);
  const keys = ["name", "archetype", "want", "line", "price", "leverage", "tell", "diction", "rhythm", "vtell", "never", "sample"];
  for (const c of Array.isArray(r.characters) ? r.characters : []) {
    let target = S.characters.find((x) => (c.name && x.name && x.name === c.name) || (c.archetype && x.archetype === c.archetype && !x.name));
    if (!target) { target = { id: uid(), src: "O" }; keys.forEach((k) => (target[k] = "")); S.characters.push(target); }
    for (const k of keys) if (!String(target[k] || "").trim() && c[k]) target[k] = String(c[k]);
  }
  for (const c of Array.isArray(r.clocks) ? r.clocks : []) {
    if (!c.name || S.clocks.some((x) => x.name === c.name)) continue;
    S.clocks.push({ id: uid(), name: String(c.name), segments: String([4, 6, 8].includes(Number(c.segments)) ? Number(c.segments) : 6), filled: 0, ticks: String(c.ticks || ""), effect: String(c.effect || ""), visible: "true", log: [] });
  }
  if (!S.election.signature.some((s) => s.value.trim()) && Array.isArray(r.signature)) S.election.signature = r.signature.slice(0, 4).map((s) => ({ value: String(s.value || ""), traces: String(s.traces || ""), cost: String(s.cost || "") }));
  if (Array.isArray(r.premortem)) r.premortem.slice(0, 3).forEach((p, i) => { if (!S.premortem[i].story.trim()) S.premortem[i] = { story: String(p.story || ""), family: String(p.family || ""), counter: String(p.counter || ""), telltale: String(p.telltale || "") }; });
  if (!kernelLines().length && Array.isArray(r.kernel)) S.kernel = r.kernel.map(String).filter(Boolean).slice(0, S.ceremony === "Light" ? 5 : 7);
  if (!S.touchstone.trim() && r.touchstone) S.touchstone = String(r.touchstone);
  for (const [k, f] of [["reasons", "reasons"], ["tradeoffs", "tradeoffs"], ["uncertainty", "uncertainty"]]) if (!S.election[f].trim() && r[k]) S.election[f] = String(r[k]);
  if (!S.capability.notes.trim() && r.capability) S.capability.notes = String(r.capability);
  S.example = null;
  changed();
}
function parseLooseJSON(text) {
  const t = String(text || "").trim();
  try { return JSON.parse(t); } catch (e) { /* keep looking */ }
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) { try { return JSON.parse(fence[1]); } catch (e) { /* keep looking */ } }
  const a = t.indexOf("{"), b = t.lastIndexOf("}");
  if (a >= 0 && b > a) return JSON.parse(t.slice(a, b + 1));
  throw new Error("no JSON");
}

function requestPanel({ eyebrow, title, intro, liveLabel, request, onLive, pastePlaceholder, onPaste, pasteLabel }) {
  const box = h("div", { class: "panel stack" });
  const status = h("p", { class: "small", "aria-live": "polite" });
  const draw = () => {
    clear(box);
    const pasteTa = h("textarea", { placeholder: pastePlaceholder, "aria-label": pasteLabel });
    put(box, h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "O"), eyebrow), h("h3", null, title), liveOperator() ? pill("live", "Operator live") : null),
      h("p", { class: "small muted" }, intro));
    if (liveOperator()) {
      let ctl = null;
      const btn = h("button", { type: "button", class: "btn primary", onclick: async () => {
        btn.disabled = true; stopBtn.hidden = false; status.textContent = "The Operator is thinking…";
        ctl = new AbortController();
        try { await onLive(ctl.signal, (msg) => { status.textContent = msg; }); }
        catch (e) { const m = sampleErrorText(e && e.code); status.textContent = m || ""; if (e && !e.code) status.textContent = "The reply could not be used: " + e.message; }
        finally { btn.disabled = false; stopBtn.hidden = true; }
      } }, liveLabel);
      const stopBtn = h("button", { type: "button", class: "btn wax sm", hidden: true, onclick: () => ctl && ctl.abort() }, "Stop");
      put(box, h("div", { class: "row" }, btn, stopBtn), status);
    }
    put(box, h("details", { open: liveOperator() ? null : true }, h("summary", { class: "small", style: "cursor:pointer" }, liveOperator() ? "Or use a Claude conversation" : "Use a Claude conversation"),
      h("div", { class: "stack tight", style: "margin-top:8px" },
        h("div", { class: "row tight" }, h("button", { type: "button", class: "btn sm", onclick: () => copyText(request(), "Request") }, "Copy the request"),
          h("span", { class: "small muted" }, "Paste it into Claude, then paste the reply here.")),
        pasteTa, h("div", null, h("button", { type: "button", class: "btn sm", onclick: () => { try { onPaste(pasteTa.value); pasteTa.value = ""; } catch (e) { toast("That reply could not be read: " + e.message); } } }, pasteLabel)))));
  };
  draw();
  onCaps(draw);
  return box;
}

function operatorElectPanel() {
  return requestPanel({
    eyebrow: "§10.2 · §11", title: "Let the Operator complete and elect the rest",
    intro: "You fix what you care about; the Operator elects everything you left open. Your values (U) are never overwritten. Its elections arrive marked O and its inferences I, for you to amend.",
    liveLabel: "Ask the Operator to elect", request: electionRequest,
    async onLive(signal, say) {
      const r = await CAP.sample.json(electionRequest(), { signal, modelTier: "default", cache: false, onText: () => say("The Operator is writing its elections…") });
      applyElection(r); say("Elections applied. Review them step by step; amend anything."); renderDeploy();
    },
    pastePlaceholder: "Paste the Operator's JSON reply", pasteLabel: "Apply the elections",
    onPaste(text) { applyElection(parseLooseJSON(text)); renderDeploy(); toast("Elections applied, marked O and I"); },
  });
}

function assentRequest() {
  return [
    "You are the Operator under the Operative Mode Framework, Draft 0.4, at Assent (§12.2). Below is the complete candidate.",
    "Check it against your own limits and against what you can actually do in this environment (a web page that draws dice, seals secrets with SHA-256 and keeps the Record).",
    "Reply in the Procedural Channel. The FIRST LINE is exactly ASSENT or AMEND. Then at most 120 words: your explicit assent subject to your boundaries and capability qualifications, or each amendment you require, one per line beginning \"- \".",
    "", S.ceremony === "Full" ? instrument() : lightSheet(), "", brief(),
    "", "VALIDATION: " + validation().map((t) => `${t.name}: ${t.ok === true ? "pass" : t.ok === "warn" ? "pass with note" : "FAILS"}`).join("; "),
  ].join("\n");
}
function applyAssent(text) {
  const t = String(text || "").trim();
  if (!t) throw new Error("empty reply");
  const first = t.split("\n")[0].trim().toUpperCase();
  S.assent.operatorText = t;
  if (first.startsWith("ASSENT")) { S.assent.operator = true; toast("The Operator assents"); }
  else {
    S.assent.operator = false;
    const items = t.split("\n").filter((l) => /^\s*-\s+/.test(l)).map((l) => l.replace(/^\s*-\s+/, ""));
    for (const it of items.length ? items : [t.split("\n").slice(1).join(" ")]) if (it.trim()) S.docket.push({ text: it.trim(), by: "O", status: "open" });
    toast("The Operator asks for amendments: see the Docket");
  }
  changed();
}
function operatorAssentPanel() {
  const shown = S.assent.operatorText ? h("div", { class: "panel stack tight" }, h("p", { class: "eyebrow" }, "The Operator's statement"), h("div", { class: "turn operator" }, h("div", { class: "body" }, S.assent.operatorText)),
    h("label", { class: "row tight small" }, (() => { const c = h("input", { type: "checkbox", checked: S.assent.operator }); c.addEventListener("change", () => { S.assent.operator = c.checked; changed(); renderDeploy(); }); return c; })(), "Operator assent recorded")) : null;
  return frag(requestPanel({
    eyebrow: "§12.2", title: "The Operator's assent",
    intro: "The Operator states its own assent explicitly, subject to its boundaries and capability qualifications, or names the amendments it needs.",
    liveLabel: "Ask the Operator for its assent", request: assentRequest,
    async onLive(signal, say) {
      if (!validationPasses()) { say("Validation fails: amend first."); return; }
      const { text } = await CAP.sample(assentRequest(), { signal, cache: false, modelTier: "default", onText: () => say("The Operator is reading the candidate…") });
      applyAssent(text); renderDeploy();
    },
    pastePlaceholder: "Paste the Operator's reply (first line ASSENT or AMEND)", pasteLabel: "Record the Operator's reply",
    onPaste(text) { applyAssent(text); renderDeploy(); },
  }), shown);
}

/* ---- Magic: the Operator writes the Specification, and the page seals it unread ---- */
function specRequest() {
  return [
    "You are the Operator under the Operative Mode Framework, Draft 0.4, writing a Magic Specification (§25) as its author.",
    "Every magic system is hard to its author: the Specification must pass the Closure Test. Every well-formed question about what the magic can do, to what, under what conditions and at what cost gets a Determinate, Distributed or Prohibited answer from it, with the Residual Thaumaturgic Clause answering what it leaves unsaid.",
    "Keep every value the User already set below. Fill every blank and every \"—\". For a Grammar system give each Tier its Envelope, a computable Cost Function, Modifiers with Price change and Tier effect, Access with gate kinds, Combination and Apex, and a Benchmark for every two or three Tiers. Run the Boundedness audit (omnipotence, omniscience, omnipresence, infinite wealth) and record it in Part F.",
    `The User's Target Hardness is ${S.magic.disc.open} → ${S.magic.disc.horizon}: write for the author tier only; the page seals your text and the User will not read it unless they break the seal.`,
    "Reply with only the completed sheet, in the same Markdown format.",
    "", specSheet(),
  ].join("\n");
}
function operatorAuthorPanel() {
  return requestPanel({
    eyebrow: "§25.2 · §25.12", title: "Let the Operator write and seal it",
    intro: "For a magic you want to discover: the Operator completes the Specification from your picks, and the page seals it at Level 3 without showing it to you. Only the digest is published.",
    liveLabel: "Ask the Operator to write the Specification", request: specRequest,
    async onLive(signal, say) {
      const { text } = await CAP.sample(specRequest(), { signal, cache: false, modelTier: "complex", onText: () => say("The Operator is writing the Specification (held unread)…") });
      S.magic.authoredBy = "Operator";
      await sealSpec(text.trim(), "Operator");
      say("Sealed. Only the digest is shown.");
    },
    pastePlaceholder: "Paste the Operator's Specification to seal it", pasteLabel: "Seal it as the Operator's",
    onPaste(text) { if (!text.trim()) throw new Error("empty"); S.magic.authoredBy = "Operator"; sealSpec(text.trim(), "Operator"); },
  });
}
