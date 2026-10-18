/* ===== The Table (§13–§15, §17, §23): Play under the ratified Mode ===== */

let TABLE_PREFILL = null;
const RUNGS = FRAMEWORK.ladder.map(([k]) => k);

function resState() {
  S.play.res = S.play.res || { mode: "resolution", success: "", successTier: "1", failure: "", failureTier: "1", question: "", factors: [] };
  if (TABLE_PREFILL) {
    Object.assign(S.play.res, { mode: "resolution", success: TABLE_PREFILL.stakes, failure: "No effect; the Cost is paid.", factors: [] });
    S.play.res.base = TABLE_PREFILL.rung;
    TABLE_PREFILL = null;
  }
  return S.play.res;
}
/* Odds begin at Even and move one rung per named Established factor (§15.6). */
function rungFor(res) {
  let i = RUNGS.indexOf(res.base || "Even");
  for (const f of res.factors) if (f.text.trim()) i += f.dir === "up" ? -1 : 1;
  return RUNGS[Math.max(0, Math.min(RUNGS.length - 1, i))];
}
function drawLine(d) {
  const what = d.oracle ? `Oracle: ${d.question || "—"}` : `Stakes: success ${d.success || "—"} [Tier ${d.successTier}] / failure ${d.failure || "—"} [Tier ${d.failureTier}]`;
  const f = d.factors && d.factors.length ? " · factors: " + d.factors.map((x) => (x.dir === "up" ? "+" : "−") + x.text).join(", ") : "";
  return `[[REC]] ${what} · Odds ${d.rung} (${d.t})${f} · ${d.r == null ? "no draw" : "d100 = " + d.r} · ${d.label} · source: ${d.source}`;
}

function bandStrip(t, r) {
  const a = t / 2, b = t, c = (t + 100) / 2;
  const seg = (cls, w, label) => (w > 0 ? h("div", { class: cls, style: `flex:0 0 ${w}%`, title: label }, w >= 9 ? label : "") : null);
  const strip = h("div", { class: "bandstrip", role: "img", "aria-label": `Bands at odds ${t}: clean success to ${Math.floor(a)}, success at cost to ${b}, failure with opening to ${Math.floor(c)}, clean failure above` },
    seg("b0", a, "Clean"), seg("b1", b - a, "At cost"), seg("b2", c - b, "Opening"), seg("b3", 100 - c, "Clean fail"));
  const marker = h("div", { class: "marker", style: `left:${r == null ? -10 : r - 0.5}%`, hidden: r == null ? true : null });
  put(strip, marker);
  return { el: h("div", { class: "stack tight" }, strip, h("div", { class: "scale-nums" }, h("span", null, "1"), h("span", null, "25"), h("span", null, "50"), h("span", null, "75"), h("span", null, "100"))), marker };
}

function resolutionPanel() {
  const res = resState();
  const box = h("div", { class: "panel stack" });
  const isSet = () => (res.mode === "oracle" ? !!res.question.trim() : !!(res.success.trim() && res.failure.trim()));
  let syncDrawButton = () => {};
  let syncOdds = () => {};
  box.addEventListener("input", () => { syncOdds(); syncDrawButton(); });
  const draw = () => {
    clear(box);
    const stakesSet = isSet();
    const last = S.play.draws[0];
    const stripHolder = h("div");
    const oddsEl = h("b");
    let marker = null, stripT = null;
    const ladderTags = [];
    /* Odds follow the named factors as they are typed; the draw reads them at the moment it is made. */
    syncOdds = () => {
      const rr = rungFor(res), tt = LADDER[rr];
      oddsEl.textContent = `${rr} (${tt})`;
      ladderTags.forEach(([k, el]) => { el.textContent = k === rr && k !== (res.base || "Even") ? "  ← odds" : ""; });
      if (stripT !== tt) { const s = bandStrip(tt, null); put(clear(stripHolder), s.el); marker = s.marker; stripT = tt; }
    };
    put(box,
      h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§15"), "Resolution"), h("h3", null, "Stakes, then Odds, then the draw"),
        seg([["resolution", "Attempt"], ["oracle", "Oracle question"]], res.mode, (v) => { res.mode = v; changed(); draw(); })),
      res.mode === "oracle" ? frag(
        h("p", { class: "small muted" }, "For a material fact nobody holds that will bind future Play. Put it as yes or no, set the Odds from what is Established, and draw."),
        field("Question (yes or no)", objInput(res, "question", { placeholder: "Is the steward the informant?" })))
      : frag(
        h("div", { class: "grid-2" },
          field("Success yields", objInput(res, "success", { area: true, rows: 2 })),
          field("Failure costs", objInput(res, "failure", { area: true, rows: 2 }))),
        h("div", { class: "row" }, h("span", { class: "small muted" }, "Tiers:"),
          h("label", { class: "row tight small" }, "success", objSelect(res, "successTier", ["0", "1", "2", "3"])),
          h("label", { class: "row tight small" }, "failure", objSelect(res, "failureTier", ["0", "1", "2", "3"])))),
      h("div", { class: "grid-2" },
        h("div", { class: "stack tight" }, h("span", { class: "field-label" }, "Start from"),
          h("div", { class: "ladder" }, FRAMEWORK.ladder.map(([k, v]) => {
            const tag = h("em", { style: "font-style:normal;color:var(--verd)" });
            ladderTags.push([k, tag]);
            return h("button", { type: "button", "aria-pressed": String((res.base || "Even") === k), onclick: () => { res.base = k; changed(); draw(); } },
              h("span", null, k, tag), h("span", null, v));
          }))),
        h("div", { class: "stack tight" }, h("span", { class: "field-label" }, "Established factors, one rung each"),
          ...res.factors.map((f, i) => h("div", { class: "factor" },
            h("button", { type: "button", class: "dir " + f.dir, onclick: () => { f.dir = f.dir === "up" ? "down" : "up"; changed(); draw(); }, title: "Toggle direction" }, f.dir === "up" ? "+1" : "−1"),
            objInput(f, "text", { placeholder: "name the factor" }),
            h("button", { type: "button", class: "btn ghost sm", onclick: () => { res.factors.splice(i, 1); changed(); draw(); } }, "×"))),
          h("div", { class: "row tight" },
            h("button", { type: "button", class: "btn sm", onclick: () => { res.factors.push({ dir: "up", text: "" }); changed(); draw(); } }, "+ for"),
            h("button", { type: "button", class: "btn sm", onclick: () => { res.factors.push({ dir: "down", text: "" }); changed(); draw(); } }, "− against")),
          h("p", { class: "small" }, "Odds: ", oddsEl),
          h("p", { class: "small muted" }, "Your Character's eloquence counts only insofar as it meets the opposing Character's Price."))),
      stripHolder);
    syncOdds();
    const out = h("div", { class: "result", "aria-live": "polite" });
    const showResult = (d, animate) => {
      clear(out);
      if (!d) return;
      const rEl = h("span", { class: "r" }, d.r == null ? "—" : String(d.r));
      put(out, rEl, h("span", { class: "band b" + d.idx }, d.label), h("span", { class: "src" }, `${d.rung} (${d.t}) · ${d.source}`));
      if (d.r != null && d.t === stripT && marker) { marker.hidden = false; marker.style.left = (d.r - 0.5) + "%"; }
      if (animate && d.r != null && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        let n = 0;
        const iv = setInterval(() => { rEl.textContent = String(randBelow(100) + 1); if (++n > 8) { clearInterval(iv); rEl.textContent = String(d.r); } }, 45);
      }
    };
    const doDraw = () => {
      syncOdds();
      const d = toolDraw(LADDER[rungFor(res)], res.mode === "oracle");
      Object.assign(d, { success: res.success, failure: res.failure, successTier: res.successTier, failureTier: res.failureTier, question: res.question, factors: res.factors.filter((f) => f.text.trim()).map((f) => ({ ...f })) });
      S.play.draws.unshift(d);
      changed();
      showResult(d, true);
      actions.hidden = false;
    };
    const actions = h("div", { class: "row tight", hidden: last ? null : true },
      h("button", { type: "button", class: "btn sm", onclick: () => { const d = S.play.draws[0]; if (!d) return; S.play.turns.push({ role: "record", content: drawLine(d), at: stamp() }); changed(); renderTable(); toast("Draw entered in the transcript"); } }, "Enter in the transcript"),
      h("button", { type: "button", class: "btn sm ghost", onclick: () => { const d = S.play.draws[0]; if (d) copyText(drawLine(d), "Draw"); } }, "Copy"));
    const drawBtn = h("button", { type: "button", class: "btn primary", disabled: stakesSet ? null : true, onclick: doDraw }, res.mode === "oracle" ? "Ask the Oracle" : "Draw d100");
    const hint = h("span", { class: "small muted" }, res.mode === "oracle" ? "State the question first." : "State both Stakes first: pre-commitment comes before the result exists.");
    syncDrawButton = () => { const ok = isSet(); drawBtn.disabled = !ok; hint.hidden = ok; };
    syncDrawButton();
    put(box, h("div", { class: "row" }, drawBtn, hint), out, actions);
    if (last) showResult(last, false);
  };
  draw();
  return box;
}

function clockSVG(c) {
  const n = Number(c.segments) || 4, f = Number(c.filled) || 0;
  const r = 40, cx = 46, cy = 46;
  const paths = [];
  for (let i = 0; i < n; i++) {
    const a0 = -Math.PI / 2 + (i / n) * Math.PI * 2, a1 = -Math.PI / 2 + ((i + 1) / n) * Math.PI * 2;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    paths.push(`<path class="${i < f ? "seg-on" : "seg-off"} seg-line" d="M${cx} ${cy} L${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z"/>`);
  }
  const wrap = h("span");
  wrap.innerHTML = `<svg viewBox="0 0 92 92" role="img" aria-label="${f} of ${n} segments filled">${paths.join("")}<circle class="ring" cx="${cx}" cy="${cy}" r="${r}"/></svg>`;
  return wrap.firstChild;
}
function clocksPanel() {
  const box = h("div", { class: "panel stack" });
  const draw = () => {
    clear(box);
    put(box, h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§15.8"), "Clocks"), h("h3", null, "They tick only on their conditions")));
    const grid = h("div", { class: "clocks" });
    S.clocks.forEach((c, i) => {
      const n = Number(c.segments) || 4, f = Number(c.filled) || 0, done = f >= n;
      const cond = h("input", { type: "text", placeholder: "which tick condition was met?", "aria-label": "Tick condition met" });
      put(grid, h("div", { class: "clock" + (done ? " done" : "") }, clockSVG(c), h("h4", null, c.name || "Unnamed Clock"),
        h("span", { class: "ticks-on" }, `${f}/${n} · ${c.visible ? "visible" : "hidden"} · ticks on: ${c.ticks || "—"}`),
        done ? h("p", { class: "small" }, h("b", null, "Complete: "), c.effect || "—") : frag(cond,
          h("div", { class: "row tight" }, h("button", { type: "button", class: "btn sm", onclick: () => {
            if (!cond.value.trim()) { cond.focus(); toast("Name the tick condition that was met. Clocks never advance by fiat."); return; }
            c.filled = f + 1; c.log = c.log || []; c.log.push({ at: stamp(), cond: cond.value.trim() });
            S.play.turns.push({ role: "record", content: `[[REC]] Clock ${c.name}: ${c.filled}/${n} (tick: ${cond.value.trim()})${c.filled >= n ? " · complete: " + (c.effect || "—") : ""}`, at: stamp() });
            changed(); draw(); renderTranscriptOnly();
          } }, "Tick"),
          f ? h("button", { type: "button", class: "btn ghost sm", title: "A Correction: the last tick was an error", onclick: () => { c.filled = f - 1; (c.log || []).pop(); changed(); draw(); } }, "Undo tick") : null)),
        h("button", { type: "button", class: "btn ghost sm", onclick: () => { S.clocks.splice(i, 1); changed(); draw(); } }, "Remove")));
    });
    put(box, S.clocks.length ? grid : h("p", { class: "small muted" }, "No Clocks. Every standing threat belongs on one; a visible Clock is a Telegraph."));
    const nc = { name: "", segments: "6", ticks: "", effect: "", visible: "true" };
    put(box, h("details", null, h("summary", { class: "small", style: "cursor:pointer" }, "Add a Clock"),
      h("div", { class: "stack tight", style: "margin-top:8px" },
        h("div", { class: "grid-2" }, field("Name", objInput(nc, "name")), field("Segments", objSelect(nc, "segments", ["4", "6", "8"]))),
        field("Ticks only when", objInput(nc, "ticks")), field("On completion", objInput(nc, "effect")),
        h("div", { class: "row" }, objSelect(nc, "visible", [["true", "visible (a Telegraph)"], ["", "hidden"]]),
          h("button", { type: "button", class: "btn sm primary", onclick: () => { if (!nc.name.trim()) return toast("Name the Clock"); S.clocks.push(Object.assign({ id: uid(), filled: 0, log: [] }, nc)); changed(); draw(); } }, "Add")))));
  };
  /* Redraw only when a Clock changes (the Operator ticks them too), so typing is never interrupted. */
  let sig = null;
  live(() => { const now = JSON.stringify(S.clocks.map((c) => [c.name, c.filled, c.segments])); if (now !== sig) { sig = now; draw(); } });
  return box;
}

function sealsPanel() {
  const box = h("div", { class: "panel stack" });
  const draw = () => {
    clear(box);
    const fact = h("textarea", { rows: 2, placeholder: "The informant is the steward, paid by House Merrow.", "aria-label": "Secret to seal" });
    const list = h("div");
    S.play.seals.forEach((s) => {
      const hidden = s.by === "Operator" && !s.revealed;
      if (s.void) {
        put(list, h("div", { class: "seal", style: "opacity:0.5" }, sigil(s.sha256), h("div", { class: "stack tight" }, h("span", { class: "id" }, s.id),
          h("span", { class: "small", style: "color:var(--wax)" }, "Void · written in a discarded continuation"))));
        return;
      }
      put(list, h("div", { class: "seal" }, sigil(s.sha256),
        h("div", { class: "stack tight" }, h("span", { class: "id" }, s.id, " ", s.by === "Operator" ? h("span", { class: "pill" }, "Operator") : h("span", { class: "pill" }, "yours")),
          h("span", { class: "dg" }, "sha256:" + s.sha256),
          hidden ? h("span", { class: "small muted" }, "Held unread until its revelation condition.") : h("span", { class: "small" }, s.plaintext),
          h("div", { class: "row tight" },
            hidden ? revealSealButton(s, draw) : h("button", { type: "button", class: "btn sm", onclick: async () => {
              const d = await sha256(s.nonce + "|" + s.plaintext);
              toast(d === s.sha256 ? `${s.id}: MATCHES the published digest` : `${s.id}: DOES NOT MATCH`);
            } }, "Verify"),
            h("button", { type: "button", class: "btn ghost sm", onclick: () => copyText(`${s.id} sha256:${s.sha256}`, "Digest") }, "Copy digest"),
            !hidden ? h("button", { type: "button", class: "btn ghost sm", onclick: () => saveFile(`${s.id}.json`, sealFileJSON(s)) }, "Save seal file") : null))));
    });
    put(box,
      h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§23"), "Hash Seals"), h("h3", null, "Fix a hidden fact now; prove later it never changed")),
      h("p", { class: "small muted" }, "Level 3: only the digest is published. The nonce stops a short secret being found by guessing; the digest binds whoever sealed it. Same scheme as scripts/seal.py."),
      fact,
      h("div", null, h("button", { type: "button", class: "btn", onclick: async () => {
        if (!fact.value.trim()) return toast("Write the fact to seal");
        const s = await makeSeal(`SEAL-${S.play.seals.length + 1}`, fact.value.trim());
        s.by = "User";
        S.play.seals.push(s);
        S.play.turns.push({ role: "record", content: `[[REC]] ${s.id} sha256:${s.sha256}`, at: stamp() });
        changed(); draw(); renderTranscriptOnly();
      } }, "Seal it")),
      list);
  };
  let sig = null;
  live(() => { const now = S.play.seals.map((x) => x.id + (x.void ? "v" : "") + (x.revealed ? "r" : "")).join(); if (now !== sig) { sig = now; draw(); } });
  return box;
}
function revealSealButton(s, after) {
  let armed = false;
  const b = h("button", { type: "button", class: "btn sm wax", onclick: async () => {
    if (!armed) { armed = true; b.textContent = "Confirm: reveal"; return; }
    s.revealed = true;
    const d = await sha256(s.nonce + "|" + s.plaintext);
    S.play.turns.push({ role: "record", content: `[[REC]] ${s.id} revealed: "${s.plaintext}" · nonce ${s.nonce} · recomputed sha256:${d} · ${d === s.sha256 ? "MATCHES" : "DOES NOT MATCH"} the published digest`, at: stamp() });
    changed(); after(); renderTranscriptOnly();
  } }, "Reveal");
  return b;
}

/* The same line format as scripts/draw.py --log. */
const drawLogText = () => S.play.draws.map((d) => `${d.at} | ${d.oracle ? "oracle" : "resolution"} | ${d.line}${d.by === "Operator" ? " | by the Operator" : ""}${d.void ? " | VOID (branch-abandoned)" : ""}`).join("\n");
function drawLogPanel() {
  const body = h("div");
  live(() => {
    put(clear(body), S.play.draws.length ? h("div", { class: "log" }, drawLogText()) : h("p", { class: "small muted" }, "No draws yet. No number authored by anyone is ever presented as a roll."));
  });
  return h("div", { class: "panel stack" },
    h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§15.9"), "Draw log"), h("h3", null, "Every draw, with its source"),
      docActions("Draw log", () => drawLogText() + "\n", `${fileSlug()}-draw-log.txt`)),
    body);
}

function recordPanels() {
  const cp = S.play.cp;
  const pre = h("pre", { class: "sheet short" });
  live(() => { pre.textContent = checkpointText(); });
  const cps = S.play.checkpoints;
  const latest = cps[cps.length - 1];
  const confirm = latest ? (() => { const c = h("input", { type: "checkbox", checked: latest.confirmed }); c.addEventListener("change", () => { latest.confirmed = c.checked; latest.text = latest.text.replace(/Confirmed: \[.\]/, `Confirmed: [${c.checked ? "x" : " "}]`); changed(); }); return h("label", { class: "row tight small" }, c, `CP-${latest.n} confirmed by you (an unconfirmed Checkpoint ranks with the ledger, not above it)`); })() : null;
  const ledger = rowList(S.play.ledger, (l, i, remove) => h("div", { class: "grid-3", style: "align-items:end" },
    field("Proposition or Claim", objInput(l, "text", { placeholder: "e.g. Holloway asserts the line clears at dawn, to Vess" })),
    field("Status", objSelect(l, "status", ["Established", "Provisional", "Disputed", "Void"])),
    h("div", { class: "row tight" }, objInput(l, "prov", { placeholder: "provenance" }), h("button", { type: "button", class: "btn ghost sm", onclick: remove }, "×"))),
    () => ({ text: "", status: "Provisional", prov: "", at: stamp() }), "Add an entry");
  const stale = rowList(S.play.stale, (x, i, remove) => h("div", { class: "grid-3", style: "align-items:end" },
    field("Phrase, image or beat", objInput(x, "text", { placeholder: "e.g. a breath they didn't know they were holding" })),
    field("Rule", objSelect(x, "rule", ["barred", "once per Part", "once per Session"])),
    h("div", null, h("button", { type: "button", class: "btn ghost sm", onclick: remove }, "Remove"))),
    () => ({ text: "", rule: "barred" }), "Add to the Stale Register");
  return h("div", { class: "grid-2" },
    h("div", { class: "panel stack" },
      h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§3.8"), "Checkpoint"), h("h3", null, "Kernel first, always"),
        docActions("Checkpoint", checkpointText, `${fileSlug()}-checkpoint.md`)),
      h("div", { class: "grid-2" }, field("In-fiction moment", bindInput("play.cp.moment")), field("Drift Watch: Tell-tales seen", bindInput("play.cp.drift"))),
      field("Now: where, who is present, what just happened", bindArea("play.cp.now")),
      field("Pending: unresolved Attempts; the Hand-back point", bindArea("play.cp.pending")),
      pre,
      h("div", { class: "row" }, h("button", { type: "button", class: "btn primary", onclick: () => {
        const n = S.play.checkpoints.length;
        S.play.checkpoints.push({ n, text: checkpointText(n), confirmed: false, at: stamp() });
        S.play.turns.push({ role: "record", content: `[[REC]] Checkpoint CP-${n} recorded.`, at: stamp() });
        changed(); renderTable(); toast(`CP-${n} recorded. Confirm it when you have read it.`);
      } }, "Record this Checkpoint"), confirm)),
    h("div", { class: "stack" },
      h("div", { class: "panel stack" }, h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§16"), "Canon Ledger"), h("h3", null, "A Character's speech establishes only that it was said")), ledger),
      h("div", { class: "panel stack" }, h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§24.4"), "Stale Register"), h("h3", null, "Barred or rate-limited")), stale)));
}

function interventionCounts() {
  const counts = { Nudge: 0, Flag: 0, Redo: 0, Hold: 0, Stop: 0 };
  for (const t of S.play.turns) {
    if (t.role !== "user") continue;
    const c = t.content;
    if (/\(\(.*\)\)/s.test(c)) counts.Nudge++;
    if (/\[\[FLAG\]\]/.test(c)) counts.Flag++;
    if (/\[\[REDO\]\]/.test(c) || t.redo) counts.Redo++;
    if (/\[\[HOLD\]\]/.test(c)) counts.Hold++;
    if (/\[\[STOP\]\]/.test(c)) counts.Stop++;
  }
  counts.Redo += S.play.turns.filter((t) => t.voidReason === "redo").length;
  return counts;
}
function partClosePanel() {
  S.play.review = S.play.review || { verdicts: {}, why: "", keep: "" };
  const rv = S.play.review;
  const pre = h("pre", { class: "sheet short" });
  const reviewText = () => {
    const c = interventionCounts();
    return [`PART REVIEW: Part ${S.active ? S.active.part : 1}`,
      `1. Promised:  ${S.decl.intent || "—"}`,
      `2. Happened:  ${kernelLines().map((k, i) => `K${i + 1} ${(rv.verdicts[i] || {}).v || "—"}${(rv.verdicts[i] || {}).q ? ` ("${rv.verdicts[i].q}")` : ""}`).join(" · ") || "—"}`,
      `              Interventions: Nudge ${c.Nudge}, Flag ${c.Flag}, Redo ${c.Redo}, Hold ${c.Hold}, Stop ${c.Stop}`,
      `3. Why:       ${rv.why || "—"}`,
      `4. Keep / Tune / Drop:  ${rv.keep || "—"}`,
      `Stale Register updated: ${S.play.stale.map((x) => x.text).filter(Boolean).join("; ") || "—"}`].join("\n") + "\n";
  };
  live(() => { pre.textContent = reviewText(); });
  return h("details", { class: "drawer" },
    h("summary", null, h("h3", null, `Close Part ${S.active ? S.active.part : 1}`), h("span", { class: "small muted" }, "Closure Record → Compaction → Part Review → Resumption Packet")),
    h("div", { class: "drawer-body" },
      h("p", { class: "small muted" }, "For each Kernel line: Held, Strained or Breached, each verdict supported by a verbatim quote. An unquoted verdict is not evidence."),
      ...kernelLines().map((k, i) => {
        rv.verdicts[i] = rv.verdicts[i] || { v: "", q: "" };
        return h("div", { class: "grid-3", style: "align-items:end" }, h("p", { class: "small" }, h("b", null, `K${i + 1} `), k),
          field("Verdict", objSelect(rv.verdicts[i], "v", [["", "—"], "Held", "Strained", "Breached"])), field("Quote", objInput(rv.verdicts[i], "q")));
      }),
      h("div", { class: "grid-2" }, field("Why", bindArea("play.review.why")), field("Keep / Tune / Drop (each tuning goes to the Amendment Docket)", bindArea("play.review.keep"))),
      pre,
      h("div", { class: "row" },
        h("button", { type: "button", class: "btn", onclick: () => copyText(reviewText(), "Part Review") }, "Copy the Part Review"),
        h("button", { type: "button", class: "btn primary", disabled: S.active ? null : true, onclick: () => {
          S.play.reviews = S.play.reviews || [];
          S.play.reviews.push({ part: S.active.part, text: reviewText(), at: stamp() });
          if (rv.keep.trim()) S.docket.push({ text: rv.keep.trim(), by: "U", status: "open" });
          const n = S.play.checkpoints.length;
          S.play.checkpoints.push({ n, text: checkpointText(n), confirmed: false, at: stamp() });
          S.play.turns.forEach((t) => { if (t.void) t.archived = true; });
          const [maj, min] = S.active.version.split(".").map(Number);
          S.active.part += 1;
          S.active.version = `${maj}.${min + (S.docket.some((d) => d.status === "accepted") ? 1 : 0)}.0`;
          S.play.turns.push({ role: "record", content: `[[REC]] Part ${S.active.part - 1} closed. Part Review recorded; Checkpoint CP-${n}; Part ${S.active.part} opens. Minor amendments take effect now.`, at: stamp() });
          S.play.review = { verdicts: {}, why: "", keep: "" };
          changed(); renderTable(); toast(`Part ${S.active.part} opens`);
          saveFile(`${fileSlug()}-resumption-packet-part-${S.active.part - 1}.md`, resumptionPacket());
        } }, "Close the Part and issue the Resumption Packet"))));
}

function renderTable() {
  const root = $("#table");
  const y = window.scrollY;
  clear(root);
  resetLive();
  const active = !!S.active;
  put(root,
    h("div", { class: "view-head" },
      h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§13–§15"), "Play"),
      h("h1", null, "The Table"),
      active ? h("p", { class: "lede" }, `${modeName()} v${S.active.version} · Régime ${S.active.regime} · Part ${S.active.part}. Only the retained continuation is Play.`) :
        h("div", { class: "notice" }, h("b", null, "No Mode is active. "), "Play begins after Assent and Activation. The instruments below work for practice; nothing here is Canon yet. ",
          h("button", { type: "button", class: "btn sm", onclick: () => { S.step = Math.min(S.step || 0, 8); go("deploy"); } }, "Go to Deployment"))),
    active && kernelLines().length ? h("div", { class: "panel stack tight" }, h("div", { class: "spread" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§22.2"), "Kernel"), h("span", { class: "small muted" }, "Above everything else")),
      h("ol", { class: "inv" }, kernelLines().map((k) => h("li", null, k)))) : null,
    h("div", { class: "split" }, playConsole(), h("aside", { class: "stack" }, resolutionPanel(), clocksPanel(), sealsPanel(), drawLogPanel())),
    recordPanels(),
    active ? partClosePanel() : null);
  window.scrollTo({ top: y });
}
RENDER.table = renderTable;
